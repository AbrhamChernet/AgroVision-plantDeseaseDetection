const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
  cropType: {
    type: String,
    required: true,
    enum: ['maize', 'wheat', 'teff']
  },
  nameEnglish: {
    type: String,
    required: true
  },
  nameAmharic: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['none', 'low', 'medium', 'high']
  },
  descriptionAmharic: {
    type: String
  },
  causesAmharic: {
    type: String
  },
  symptomsAmharic: {
    type: String
  },
  treatmentAmharic: {
    type: String
  },
  preventionAmharic: {
    type: String
  },
  imageUrl: {
    type: String
  }
});

module.exports = mongoose.model('Disease', DiseaseSchema);
