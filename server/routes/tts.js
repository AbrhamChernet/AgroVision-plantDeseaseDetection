const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @route   GET /api/tts
 * @desc    Proxy Google Translate TTS audio to bypass browser CORS/Referrer blocks
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const text = req.query.q;
    const lang = req.query.tl || 'am';

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Missing text parameter q' });
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(text.trim())}`;

    const response = await axios({
      method: 'GET',
      url: ttsUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
      'Accept-Ranges': 'bytes'
    });

    response.data.pipe(res);
  } catch (error) {
    console.error('TTS Proxy Error:', error.message);
    res.status(502).json({ error: 'Failed to synthesize speech audio from TTS upstream.' });
  }
});

module.exports = router;
