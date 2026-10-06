const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'agrovision_secret_key';

const isProduction = process.env.NODE_ENV === 'production';
const isCrossDomain = process.env.CROSS_DOMAIN === 'true';

const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isCrossDomain ? 'none' : 'lax',
  ...(maxAge !== undefined ? { maxAge } : {})
});

// @route   POST api/auth/register
// @desc    Register a new farmer account
router.post(
  '/register',
  [
    body('name', 'እባክዎ ሙሉ ስምዎን ያስገቡ።').notEmpty(),
    body('phone', 'እባክዎ ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ (+251...)።').matches(/^\+251[79]\d{8}$/),
    body('password', 'የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት።').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, phone, password, profilePhoto } = req.body;

    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
          message: 'የዳታቤዝ ግንኙነት አልተገኘም። እባክዎ በVercel ላይ MONGO_URI እና የMongoDB Atlas IP Whitelist (0.0.0.0/0) ያረጋግጡ። (Database disconnected. Please check MONGO_URI in Vercel and MongoDB Atlas IP access 0.0.0.0/0).'
        });
      }

      let user = await User.findOne({ phone });
      if (user) {
        return res.status(400).json({ message: 'በዚህ ስልክ ቁጥር ቀድሞ የተመዘገበ አካውንት አለ።' });
      }

      user = new User({
        name,
        phone,
        passwordHash: password,
        profilePhoto: profilePhoto || '',
        role: 'user',
        lastLogin: new Date()
      });

      await user.save();

      const payload = { id: user._id, name: user.name, role: user.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      // Save token in HttpOnly Cookie
      res.cookie('token', token, getCookieOptions(7 * 24 * 60 * 60 * 1000));

      res.status(201).json({
        message: 'ምዝገባው በተሳካ ሁኔታ ተጠናቋል።',
        user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
      });
    } catch (err) {
      console.error('Register error:', err.message);
      const isDbErr = err.name === 'MongooseError' || err.name === 'MongoServerSelectionError' || (err.message && err.message.includes('buffering timed out'));
      const errorMsg = isDbErr 
        ? 'የዳታቤዝ ግንኙነት አልተሳካም። እባክዎ MongoDB Atlas ቅንብሮችን ያረጋግጡ። (' + err.message + ')'
        : 'ምዝገባው አልተሳካም። እባክዎ እንደገና ይሞክሩ። (' + err.message + ')';
      res.status(500).json({ message: errorMsg });
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate phone number + password, set HttpOnly token
router.post(
  '/login',
  [
    body('phone', 'እባክዎ ስልክ ቁጥር ያስገቡ።').notEmpty(),
    body('password', 'እባክዎ የይለፍ ቃል ያስገቡ።').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { phone, password, rememberMe } = req.body;

    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
          message: 'የዳታቤዝ ግንኙነት አልተገኘም። እባክዎ በVercel ላይ MONGO_URI እና የMongoDB Atlas IP Whitelist (0.0.0.0/0) ያረጋግጡ። (Database disconnected. Please check MONGO_URI in Vercel and MongoDB Atlas IP access 0.0.0.0/0).'
        });
      }

      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(400).json({ message: 'ስልክ ቁጥር ወይም የይለፍ ቃል አልተዛመደም።' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'ስልክ ቁጥር ወይም የይለፍ ቃል አልተዛመደም።' });
      }

      user.lastLogin = new Date();
      await user.save();

      const payload = { id: user._id, name: user.name, role: user.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      // Set cookie duration based on rememberMe option
      const cookieAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day

      res.cookie('token', token, getCookieOptions(cookieAge));

      res.json({
        message: 'እንኳን ደህና መጡ! መግባትዎ ተረጋግጧል።',
        user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
      });
    } catch (err) {
      console.error('Login error:', err.message);
      const isDbErr = err.name === 'MongooseError' || err.name === 'MongoServerSelectionError' || (err.message && err.message.includes('buffering timed out'));
      const errorMsg = isDbErr 
        ? 'የዳታቤዝ ግንኙነት አልተሳካም። እባክዎ MongoDB Atlas ቅንብሮችን ያረጋግጡ። (' + err.message + ')'
        : 'መግባት አልተሳካም። እባክዎ እንደገና ይሞክሩ። (' + err.message + ')';
      res.status(500).json({ message: errorMsg });
    }
  }
);

// @route   POST api/auth/logout
// @desc    Clear auth token cookies
router.post('/logout', (req, res) => {
  res.clearCookie('token', getCookieOptions());
  res.json({ message: 'በተሳካ ሁኔታ ወጥተዋል።' });
});

// @route   GET api/auth/me
// @desc    Check cookie and return current session user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'ተጠቃሚው አልተገኘም።' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'የተጠቃሚ መረጃን ማውጣት አልተቻለም።' });
  }
});

module.exports = router;
