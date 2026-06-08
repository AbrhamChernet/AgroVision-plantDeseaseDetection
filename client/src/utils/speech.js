/**
 * Utility to speak localized messages using browser Web Speech API.
 * Supports Amharic (am-ET) and English (en-US).
 */
export const speakAmharicOrEnglish = (text, locale = 'am') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any running speech before starting a new narration
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85; // Slightly slower, easy to understand rate for farmers
  utterance.pitch = 1.0;

  // Wait for voices list to load
  let voices = window.speechSynthesis.getVoices();

  const setVoice = () => {
    voices = window.speechSynthesis.getVoices();
    if (locale === 'am') {
      // Look for Amharic or general Semitic/regional voices
      const amVoice = voices.find(
        (v) => v.lang.startsWith('am') || v.lang.includes('ET')
      );
      if (amVoice) {
        utterance.voice = amVoice;
        utterance.lang = 'am-ET';
      } else {
        // If am-ET voice is unavailable, we use standard regional accents or fall back to english
        utterance.lang = 'en-US';
      }
    } else {
      const enVoice = voices.find(
        (v) => v.lang.startsWith('en') && v.localService === true
      ) || voices.find((v) => v.lang.startsWith('en'));
      
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
