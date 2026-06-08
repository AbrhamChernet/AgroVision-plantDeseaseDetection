import React, { useState, useEffect } from 'react';

const farmingTips = [
  'በቆሎን ከባቄላ ወይም ከአተር ጋር ማፈራረቅ የአፈርን ናይትሮጅን ይጨምራል! 🌱',
  'ቢጫ ዝገት ምልክት በቅጠል ላይ ሲታይ ወዲያውኑ ተስማሚ ፀረ-ፈንገስ ይርጩ! 🌾',
  'ስንዴን በማለዳ ወይም በማታ ማጠጣት በፀሐይ ቃጠሎ ምክንያት የሚመጣን በሽታ ይከላከላል። 💧',
  'ሰብልዎን በየሳምንቱ 2 ጊዜ በጥልቀት በመመርመር በሽታን ቀድመው ይከላከሉ! 🔍',
  'በቆሎን አጥጋግቶ አለመዝራት የአየር ዝውውርን በመጨመር ፈንገስን ይቀንሳል። 💨'
];

const AbelMascot = ({ state = 'wave', inline = false }) => {
  const [tipIndex, setTipIndex] = useState(0);

  // Rotate farming tips every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % farmingTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Determine keyframe animations based on Abel's emotional state
  let animationClass = 'animate-bounce'; // Default safe animation
  if (state === 'dance') animationClass = 'animate-[dance_1s_infinite_ease-in-out]';
  if (state === 'think') animationClass = 'animate-[pulse_1.5s_infinite_ease-in-out]';
  if (state === 'concerned') animationClass = 'animate-[shake_0.8s_infinite]';

  return (
    <div className={`flex flex-col items-center select-none ${inline ? '' : 'lg:relative'}`}>
      <style>{`
        @keyframes dance {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-10px) rotate(4deg) scale(1.05); }
          50% { transform: translateY(0) rotate(-4deg) scale(0.98); }
          75% { transform: translateY(-6px) rotate(2deg) scale(1.02); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px) translateY(1px); }
          40%, 80% { transform: translateX(4px) translateY(-1px); }
        }
      `}</style>

      {/* Floating Speech Bubble (Abel's Advice) */}
      <div className="relative mb-4 max-w-xs bg-white dark:bg-zinc-900 border-2 border-emerald-600 rounded-2xl p-3 shadow-lg animate-fadeIn text-center">
        <p className="text-zinc-800 dark:text-zinc-200 text-xs font-semibold leading-relaxed">
          {farmingTips[tipIndex]}
        </p>
        {/* Speech bubble pointer tail */}
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-zinc-900 border-r-2 border-b-2 border-emerald-600 rotate-45"></div>
      </div>

      {/* Vector SVG Abel Mascot Farmer Character */}
      <div className={`w-48 h-48 md:w-56 md:h-56 ${animationClass} transition-all duration-500`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background Shadow */}
          <ellipse cx="100" cy="185" rx="60" ry="10" fill="rgba(0,0,0,0.15)" />

          {/* Traditional Ethiopian Shamma Body */}
          <path d="M 60 190 L 140 190 L 130 115 L 70 115 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" />
          
          {/* Ethiopian Embroidery Ribbons (Tibeb - Red, Gold, Green stripes on chest) */}
          <rect x="85" y="115" width="30" height="75" fill="#FFFFFF" />
          <rect x="90" y="115" width="4" height="75" fill="#C0392B" />
          <rect x="98" y="115" width="4" height="75" fill="#D4A017" />
          <rect x="106" y="115" width="4" height="75" fill="#1D6B3A" />

          {/* Neck */}
          <rect x="92" y="100" width="16" height="20" fill="#E6C29E" rx="2" />

          {/* Head & Skin */}
          <circle cx="100" cy="80" r="30" fill="#E6C29E" />

          {/* Hair (Black, soft curly outline) */}
          <path d="M 70 80 C 65 50, 135 50, 130 80 C 135 70, 130 55, 115 50 C 100 45, 85 55, 80 60 C 72 65, 68 72, 70 80 Z" fill="#2D2D2D" />

          {/* Traditional Straw Netela/Cap Band */}
          <path d="M 72 70 Q 100 62 128 70" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

          {/* Big Friendly Eyes */}
          <circle cx="90" cy="82" r="5" fill="#FFFFFF" />
          <circle cx="90" cy="82" r="2.5" fill="#1F2937" />
          <circle cx="110" cy="82" r="5" fill="#FFFFFF" />
          <circle cx="110" cy="82" r="2.5" fill="#1F2937" />

          {/* Happy/Concerned Mouth */}
          {state === 'concerned' ? (
            // Curved worried frown line
            <path d="M 93 98 Q 100 92 107 98" fill="none" stroke="#C0392B" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            // Big happy open smile
            <path d="M 92 92 Q 100 102 108 92" fill="none" stroke="#1D6B3A" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Cute Rosy Cheeks */}
          <circle cx="80" cy="86" r="3" fill="#F87171" opacity="0.6" />
          <circle cx="120" cy="86" r="3" fill="#F87171" opacity="0.6" />

          {/* Left Arm holding Tablet */}
          <path d="M 68 128 Q 40 140 55 160" fill="none" stroke="#E6C29E" strokeWidth="10" strokeLinecap="round" />
          {/* Tablet (representing modern farming) */}
          <rect x="35" y="145" width="28" height="20" rx="3" fill="#1F2937" stroke="#9CA3AF" strokeWidth="1" transform="rotate(-15, 35, 145)" />
          <rect x="38" y="148" width="22" height="14" rx="1" fill="#60A5FA" transform="rotate(-15, 35, 145)" />

          {/* Right Arm: State-dependent behavior */}
          {state === 'wave' && (
            // Wave Hand pointing to upload
            <g>
              <path d="M 130 128 Q 165 105 160 85" fill="none" stroke="#E6C29E" strokeWidth="10" strokeLinecap="round" />
              {/* Hand waving */}
              <circle cx="160" cy="82" r="6" fill="#E6C29E" />
            </g>
          )}

          {state === 'think' && (
            // Tapping chin thoughtfully
            <g>
              <path d="M 130 128 Q 140 115 116 100" fill="none" stroke="#E6C29E" strokeWidth="10" strokeLinecap="round" />
              <circle cx="116" cy="98" r="6" fill="#E6C29E" />
            </g>
          )}

          {state === 'dance' && (
            // Hands high up in the air dancing
            <g>
              <path d="M 130 128 Q 160 100 155 80" fill="none" stroke="#E6C29E" strokeWidth="10" strokeLinecap="round" />
              <circle cx="155" cy="78" r="6" fill="#E6C29E" />
            </g>
          )}

          {state === 'concerned' && (
            // Arms down/concerned, pointing to results
            <g>
              <path d="M 130 128 Q 155 150 170 145" fill="none" stroke="#E6C29E" strokeWidth="10" strokeLinecap="round" />
              <circle cx="172" cy="144" r="6" fill="#E6C29E" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default AbelMascot;
