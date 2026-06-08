const mongoose = require('mongoose');

const DetectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  cropType: {
    type: String,
    required: true,
    enum: ['maize', 'wheat', 'teff']
  },
  imagePath: {
    type: String,
    required: true
  },
  diseaseDetected: {
    type: String,
    required: true
  },
  diseaseAmharic: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['none', 'low', 'medium', 'high']
  },
  recommendationAmharic: {
    type: String,
    required: true
  },
  recommendationEnglish: {
    type: String,
    required: true
  },
  location: {
    lat: { type: Number, default: 9.03 }, // Default to Addis Ababa latitude
    lng: { type: Number, default: 38.74 } // Default to Addis Ababa longitude
  },
  deviceInfo: {
    type: String,
    default: 'Mobile Browser'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Detection', DetectionSchema);
