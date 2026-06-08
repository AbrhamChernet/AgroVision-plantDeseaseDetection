import React from 'react';
import { useAudio } from '../context/AudioContext';
import { useLanguage } from '../context/LanguageContext';

const AudioPlayer = () => {
  const { isMuted, toggleMute, playHoverSound } = useAudio();
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[slideDown_0.4s_ease-out]">
      <button
        onClick={() => {
          toggleMute();
        }}
        onMouseEnter={playHoverSound}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 ${
          isMuted
            ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
            : 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700 hover:shadow-emerald-500/20'
        }`}
        title={isMuted ? 'ድምፅ ክፈት (Unmute)' : 'ድምፅ አጥፋ (Mute)'}
        aria-label="Audio Toggle"
      >
        {isMuted ? (
          // Speaker Off Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          // Speaker On + Sound Waves Animation Icon
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5V14.5H7.75L12 18.75Z" />
            </svg>
            {/* Visual audio wave pulses */}
            <div className="flex items-end gap-[2px] h-3 ml-1">
              <span className="w-[3px] h-full bg-white rounded-full animate-[pulse_0.6s_infinite_alternate]"></span>
              <span className="w-[3px] h-[70%] bg-white rounded-full animate-[pulse_0.4s_infinite_alternate_delay-100]"></span>
              <span className="w-[3px] h-[40%] bg-white rounded-full animate-[pulse_0.8s_infinite_alternate_delay-200]"></span>
            </div>
          </div>
        )}
        <span className="text-xs font-bold font-ethiopic tracking-wide">
          {isMuted ? 'ድምፅ ዝግ' : 'ድምፅ ክፍት'}
        </span>
      </button>
    </div>
  );
};

export default AudioPlayer;
