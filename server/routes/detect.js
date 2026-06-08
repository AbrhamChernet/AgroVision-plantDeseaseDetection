const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const upload = require('../middleware/upload');
const jwt = require('jsonwebtoken');
const Detection = require('../models/Detection');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/predict';
const JWT_SECRET = process.env.JWT_SECRET || 'agrovision_secret_key';
const SUPPORTED_CROPS = ['maize', 'wheat'];
const MINIMUM_CONFIDENCE = 0.4;
const TRAINED_DISEASE_CLASSES = {
  maize: ['Blight', 'Common_Rust', 'Gray_Leaf_Spot', 'Healthy'],
  wheat: ['Yellow_Rust', 'Mildew', 'Septoria', 'Healthy']
};

// 1. Self-contained in-memory rate limiter (max 10 requests per minute per IP)
const ipRequestCounts = {};
setInterval(() => {
  // Clear counts every 1 minute
  for (const ip in ipRequestCounts) {
    delete ipRequestCounts[ip];
  }
}, 60000);

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!ipRequestCounts[ip]) {
    ipRequestCounts[ip] = 0;
  }

  if (ipRequestCounts[ip] >= 10) {
    return res.status(429).json({ 
      message: 'በአንድ ደቂቃ ውስጥ ከ10 ጊዜ በላይ መመርመር አይችሉም። እባክዎ ጥቂት ሰከንዶችን ይጠብቁ።' // Rate limit message in Amharic
    });
  }

  ipRequestCounts[ip]++;
  next();
};

// Optional user session attachment from HttpOnly cookies or Authorization header
const attachUserOptional = (req, res, next) => {
  let token = null;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;
    } catch (err) {
      console.warn('Optional auth verification failed:', err.message);
    }
  }
  next();
};

// @route   POST api/detect
// @desc    Upload leaf photo, run FastAPI prediction, save in MongoDB
router.post('/', rateLimiter, upload.single('image'), attachUserOptional, async (req, res) => {
  const { crop } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'እባክዎ የቅጠሉን ምስል ያስገቡ።' }); // Please upload an image
  }
  if (!crop || !SUPPORTED_CROPS.includes(crop)) {
    return res.status(400).json({ message: 'እባክዎ ትክክለኛ የሰብል ዓይነት ይምረጡ (በቆሎ ወይም ስንዴ)።' });
  }

  const filePath = req.file.path;
  const imagePathUrl = `/uploads/${path.basename(filePath)}`;
  const userAgent = req.headers['user-agent'] || 'Unknown Device';

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('crop', crop);

    const mlResponse = await axios.post(ML_SERVICE_URL, form, {
      headers: {
        ...form.getHeaders()
      },
      timeout: 12000
    });

    const prediction = mlResponse.data;
    if (prediction && prediction.success === false) {
      return res.status(422).json({
        success: false,
        errorType: prediction.errorType || 'INVALID_LEAF_IMAGE',
        message: prediction.message || 'Please upload a clear image containing only the target crop leaf.',
        messageAmharic: prediction.message_amharic,
        messageEnglish: prediction.message_english,
        details: prediction
      });
    }

    const predictedClass = prediction.class || prediction.diagnosis;
    const confidence = Number(prediction.confidence);
    const isInvalidPrediction = !predictedClass || predictedClass === 'Invalid Input' || predictedClass === 'Uncertain result';

    if (
      isInvalidPrediction ||
      Number.isNaN(confidence) ||
      confidence < MINIMUM_CONFIDENCE ||
      !TRAINED_DISEASE_CLASSES[crop].includes(predictedClass)
    ) {
      return res.status(422).json({
        message: 'Unable to classify image reliably',
        prediction
      });
    }

    const severity = (prediction.severity || 'none').toLowerCase();
    const validSeverities = ['none', 'low', 'medium', 'high'];
    const normalizedSeverity = validSeverities.includes(severity) ? severity : 'none';

    const detectionRecord = new Detection({
      userId: req.userId || null,
      cropType: crop,
      imagePath: imagePathUrl,
      diseaseDetected: predictedClass,
      diseaseAmharic: prediction.class_amharic || prediction.diagnosis_amharic || '',
      confidence,
      severity: normalizedSeverity,
      recommendationAmharic: prediction.recommendation_amharic || prediction.remedy_amharic || '',
      recommendationEnglish: prediction.recommendation_english || prediction.remedy || '',
      location: { lat: 9.03, lng: 38.74 },
      deviceInfo: userAgent
    });

    await detectionRecord.save();
    return res.json({ detection: detectionRecord });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.success === false) {
      return res.status(err.response.status || 422).json(err.response.data);
    }
    console.warn('ML service error or unreachable; rejecting prediction to prevent unsafe guesses.', err.message || err);
    return res.status(502).json({
      message: 'Unable to classify image reliably. Please try again later with a valid crop leaf image.'
    });
  }
});

module.exports = router;
