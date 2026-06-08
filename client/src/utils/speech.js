let currentAudios = [];
let pendingChunks = [];
let isPlaying = false;
let currentLocale = 'am';

/**
 * Utility to split text into safe chunks under 180 characters (Google TTS limit is 200).
 */
const splitTextIntoChunks = (text, maxLen = 180) => {
  if (!text) return [];
  // Split by sentence punctuation (Amharic "።" or English ".", "!", "?")
  const sentences = text.match(/[^።.!?]+[።.!?]*/g) || [text];
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if ((currentChunk + ' ' + trimmed).trim().length <= maxLen) {
      currentChunk = (currentChunk + ' ' + trimmed).trim();
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      
      if (trimmed.length > maxLen) {
        const words = trimmed.split(/\s+/);
        let wordChunk = '';
        for (const word of words) {
          if ((wordChunk + ' ' + word).trim().length <= maxLen) {
            wordChunk = (wordChunk + ' ' + word).trim();
          } else {
            if (wordChunk) chunks.push(wordChunk);
            wordChunk = word;
          }
        }
        currentChunk = wordChunk;
      } else {
        currentChunk = trimmed;
      }
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  return chunks;
};

/**
 * Stop any ongoing speech playback (both Google TTS audios and SpeechSynthesis).
 */
export const stopSpeech = () => {
  pendingChunks = [];
  isPlaying = false;
  
  if (currentAudios.length > 0) {
    currentAudios.forEach((audio) => {
      try {
        audio.pause();
        audio.src = ''; // Release resource
      } catch (e) {
        console.warn('Error pausing audio:', e);
      }
    });
    currentAudios = [];
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Play text chunks sequentially.
 */
const playNextChunk = () => {
  if (pendingChunks.length === 0) {
    isPlaying = false;
    return;
  }

  const chunk = pendingChunks.shift();
  const langCode = currentLocale === 'am' ? 'am' : 'en';
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(chunk)}`;

  const audio = new Audio(url);
  currentAudios.push(audio);

  audio.onended = () => {
    currentAudios = currentAudios.filter((a) => a !== audio);
    playNextChunk();
  };

  audio.onerror = (e) => {
    console.warn('Google TTS play error, falling back to browser Web Speech API:', e);
    currentAudios = currentAudios.filter((a) => a !== audio);
    
    // Put chunk back and play remaining using Web Speech API fallback
    const remainingText = [chunk, ...pendingChunks].join(' ');
    stopSpeech();
    playNativeSpeech(remainingText, currentLocale);
  };

  audio.play().catch((err) => {
    console.warn('Google TTS autoplay blocked, falling back to browser Web Speech API:', err);
    currentAudios = currentAudios.filter((a) => a !== audio);
    
    const remainingText = [chunk, ...pendingChunks].join(' ');
    stopSpeech();
    playNativeSpeech(remainingText, currentLocale);
  });
};

/**
 * Fallback native speech synthesis player.
 */
const playNativeSpeech = (text, locale) => {
  if (!('speechSynthesis' in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.pitch = 1.0;

  let voices = window.speechSynthesis.getVoices();

  const setVoice = () => {
    voices = window.speechSynthesis.getVoices();
    if (locale === 'am') {
      const amVoice = voices.find(
        (v) => v.lang.startsWith('am') || v.lang.includes('ET')
      );
      if (amVoice) {
        utterance.voice = amVoice;
        utterance.lang = 'am-ET';
      } else {
        utterance.lang = 'en-US'; // Fallback
      }
    } else {
      // For English, use any available English voice
      const enVoice = voices.find((v) => v.lang.startsWith('en-US')) || 
                      voices.find((v) => v.lang.startsWith('en'));
      if (enVoice) {
        utterance.voice = enVoice;
      }
      utterance.lang = 'en-US';
    }
    window.speechSynthesis.speak(utterance);
  };

  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = setVoice;
  } else {
    setVoice();
  }
};

/**
 * Main function to speak localized messages.
 * Uses online Google TTS with native SpeechSynthesis fallback.
 */
export const speakAmharicOrEnglish = (text, locale = 'am') => {
  stopSpeech();

  if (!text) return;

  currentLocale = locale;

  if (navigator.onLine) {
    try {
      pendingChunks = splitTextIntoChunks(text, 180);
      if (pendingChunks.length > 0) {
        isPlaying = true;
        playNextChunk();
        return;
      }
    } catch (e) {
      console.warn('Failed to initialize Google TTS, falling back to Web Speech API:', e);
    }
  }

  // Offline or error fallback
  playNativeSpeech(text, locale);
};
