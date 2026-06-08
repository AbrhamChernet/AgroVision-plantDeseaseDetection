const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Detection = require('../models/Detection');
const auth = require('../middleware/auth');

// @route   GET api/history
// @desc    Get user scan history records
router.get('/', auth, async (req, res) => {
  try {
    const history = await Detection.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ history });
  } catch (err) {
    console.error('History fetch error:', err.message);
    res.status(500).json({ message: 'የምርመራ ታሪክን ማውጣት አልተቻለም።' });
  }
});

// @route   DELETE api/history/:id
// @desc    Delete a scan history entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const scan = await Detection.findOne({ _id: req.params.id, userId: req.user.id });
    if (!scan) {
      return res.status(404).json({ message: 'ይህ የምርመራ መዝገብ አልተገኘም ወይም የእርስዎ አይደለም።' });
    }

    // Delete physically if file is local (optional check)
    // fs.unlinkSync(path.join(__dirname, '..', scan.imagePath)) - omitted for safety

    await scan.deleteOne();
    res.json({ message: 'የምርመራው መዝገብ በተሳካ ሁኔታ ተሰርዟል።' });
  } catch (err) {
    console.error('Delete scan error:', err.message);
    res.status(500).json({ message: 'መዝገቡን መሰረዝ አልተቻለም።' });
  }
});

// @route   GET api/history/stats
// @desc    Aggregate scan statistics for the dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalScans = await Detection.countDocuments({ userId });
    const healthyCount = await Detection.countDocuments({ userId, severity: 'none' });
    
    // Count diseases (where severity is not 'none')
    const diseasesFound = await Detection.countDocuments({ 
      userId, 
      severity: { $ne: 'none' } 
    });

    // Find last scan date
    const lastScan = await Detection.findOne({ userId })
      .sort({ createdAt: -1 })
      .select('createdAt');
    const lastScanDate = lastScan ? lastScan.createdAt : null;

    // Find the most common disease detected using MongoDB aggregation
    const aggregation = await Detection.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), severity: { $ne: 'none' } } },
      { $group: { _id: '$diseaseAmharic', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const mostCommonDisease = aggregation.length > 0 ? aggregation[0]._id : 'የለም'; // None (Amharic)

    // Crop breakdown data for pie charts
    const maizeCount = await Detection.countDocuments({ userId, cropType: 'maize' });
    const wheatCount = await Detection.countDocuments({ userId, cropType: 'wheat' });
    const teffCount = await Detection.countDocuments({ userId, cropType: 'teff' });

    res.json({
      stats: {
        totalScans,
        diseasesFound,
        mostCommonDisease,
        lastScanDate,
        cropBreakdown: [
          { name: 'በቆሎ (Maize)', value: maizeCount },
          { name: 'ስንዴ (Wheat)', value: wheatCount },
          { name: 'ጤፍ (Teff)', value: teffCount }
        ]
      }
    });
  } catch (err) {
    console.error('Stats aggregation error:', err.message);
    res.status(500).json({ message: 'የስታቲስቲክስ መረጃዎችን መተንተን አልተቻለም።' });
  }
});

module.exports = router;
