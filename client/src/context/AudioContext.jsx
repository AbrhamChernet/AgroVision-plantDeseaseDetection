import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { speakAmharicOrEnglish, stopSpeech } from '../utils/speech';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const { locale } = useLanguage();
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('agrovision_muted');
    return saved ? JSON.parse(saved) : false;
  });

  // 1. Play offline-ready hover click using Web Audio API Oscillator
  const playHoverSound = () => {
    if (isMuted) return;

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      // Generate a soft organic woodblock click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.warn('Web Audio click error:', e);
    }
  };

  // 2. Play alert chiming tones using Web Audio API
  const playChimeSound = (type = 'success') => {
    if (isMuted) return;

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;

      if (type === 'success' || type === 'healthy') {
        // Happy, bright agricultural chime (two notes ascending)
        const notes = [523.25, 659.25]; // C5, E5
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.05, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);
          
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.3);
        });
      } else {
        // Disease detected warning chime (two notes descending)
        const notes = [349.23, 293.66]; // F4, D4
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);
          gain.gain.setValueAtTime(0.05, now + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.35);
          
          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 0.4);
        });
      }
    } catch (e) {
      console.warn('Web Audio chime error:', e);
    }
  };

  // 3. Play vocal narration
  const speakText = (textAmharic, textEnglish) => {
    if (isMuted) return;
    const text = locale === 'am' ? textAmharic : textEnglish;
    speakAmharicOrEnglish(text, locale);
  };

  // 4. Play automatic welcome greeting on first boot
  useEffect(() => {
    // We delay slightly to let the browser unlock audio rendering
    const timer = setTimeout(() => {
      if (!isMuted) {
        speakText(
          'እንኳን ወደ አግሮቪዥን ሰብል በሽታ መመርመሪያ በደህና መጡ። ለመጀመር ምስል ስቀል የሚለውን ቁልፍ ይጫኑ።',
          'Welcome to AgroVision AI Crop Pathology System. Click upload image to get started.'
        );
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    localStorage.setItem('agrovision_muted', JSON.stringify(nextMute));
    
    // Stop any ongoing speech if muted
    if (nextMute) {
      stopSpeech();
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playHoverSound, playChimeSound, speakText }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
