import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';

const ResultCard = ({ result, onReset }) => {
  const { t, locale } = useLanguage();
  const { playHoverSound, speakText } = useAudio();

  const {
    cropType,
    diseaseDetected,
    diseaseAmharic,
    confidence,
    severity,
    recommendationAmharic,
    recommendationEnglish
  } = result;

  // Color code based on disease severity
  let severityColor = 'bg-zinc-100 text-zinc-700 border-zinc-300';
  let progressColor = 'bg-emerald-500';
  
  if (severity === 'high') {
    severityColor = 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
    progressColor = 'bg-red-600';
  } else if (severity === 'medium') {
    severityColor = 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    progressColor = 'bg-yellow-500';
  } else if (severity === 'none') {
    severityColor = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    progressColor = 'bg-emerald-600';
  }

  // Format confidence properly as percent (e.g. 0.97 -> 97%)
  const percentage = confidence <= 1.0 ? Math.round(confidence * 100) : Math.round(confidence);

  // Auto speak results on loading
  React.useEffect(() => {
    const textAm = `የምርመራ ውጤት፡ ${diseaseAmharic}። ደረጃው ${severity === 'none' ? 'ጤናማ' : severity === 'high' ? 'ከፍተኛ' : 'መካከለኛ'} ነው። የሚመከር መፍትሄ፡ ${recommendationAmharic}`;
    const textEn = `Diagnostic Result: ${diseaseDetected}. Severity level is ${severity}. Recommendation: ${recommendationEnglish}`;
    
    const timer = setTimeout(() => {
      speakText(textAm, textEn);
    }, 500);

    return () => clearTimeout(timer);
  }, [result]);

  const handleSpeechReplay = () => {
    const textAm = `የምርመራ ውጤት፡ ${diseaseAmharic}። ደረጃው ${severity === 'none' ? 'ጤናማ' : severity === 'high' ? 'ከፍተኛ' : 'መካከለኛ'} ነው። የሚመከር መፍትሄ፡ ${recommendationAmharic}`;
    const textEn = `Diagnostic Result: ${diseaseDetected}. Severity level is ${severity}. Recommendation: ${recommendationEnglish}`;
    speakText(textAm, textEn);
  };

  // Build WhatsApp Share details link
  const shareMessage = encodeURIComponent(
    `🌾 *አግሮቪዥን AI (AgroVision AI)* 🌾\n` +
    `የሰብል ምርመራ ውጤት:\n` +
    `• ሰብል: ${cropType === 'maize' ? 'በቆሎ' : 'ስንዴ'}\n` +
    `• በሽታ: ${diseaseAmharic} (${diseaseDetected})\n` +
    `• ጉዳት ደረጃ: ${severity === 'high' ? 'ከፍተኛ' : severity === 'medium' ? 'መካከለኛ' : 'የለም'}\n` +
    `• መፍትሄ: ${recommendationAmharic}\n\n` +
    `ለበለጠ መረጃ በስልክዎ መርምረው ፈጣን መፍትሄ ያግኙ።`
  );

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl animate-fadeIn relative">
      
      {/* Header section with Speaker/Replay trigger */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider font-ethiopic">
          {t('resultTitle')}
        </h4>
        
        {/* Narrate result speech button */}
        <button
          onClick={handleSpeechReplay}
          onMouseEnter={playHoverSound}
          className="p-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-600 rounded-full transition-colors shadow-sm"
          title="አንብብልኝ (Read Aloud)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5V14.5H7.75L12 18.75Z" />
          </svg>
        </button>
      </div>

      {/* Disease Large Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white font-ethiopic mb-2">
          {locale === 'am' ? diseaseAmharic : diseaseDetected}
        </h2>
        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold tracking-wide uppercase">
          {locale === 'am' ? diseaseDetected : diseaseAmharic}
        </span>
      </div>

      {/* Stats Breakdown: Severity & Confidence Bar */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Severity badge info */}
        <div className="bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-2xl text-center border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold mb-2 font-ethiopic">
            {t('severityBadge')}
          </p>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border font-ethiopic ${severityColor}`}>
            {severity === 'high' ? t('severityHigh') : severity === 'medium' ? t('severityMedium') : t('severityNone')}
          </span>
        </div>

        {/* Confidence Percentage progress */}
        <div className="bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold mb-2 text-center font-ethiopic">
            {t('confidenceScore')}
          </p>
          <div className="flex items-center justify-between gap-3">
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
              <div className={`h-full ${progressColor} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Treatment Recommendations Card */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border-2 border-emerald-600/30 rounded-2xl p-5 mb-6 flex gap-4 items-start">
        {/* Leaf icon */}
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h4 className="text-emerald-700 dark:text-emerald-400 font-extrabold font-ethiopic text-sm mb-1.5">
            {t('recommendation')}
          </h4>
          <p className="text-zinc-700 dark:text-zinc-300 font-medium font-ethiopic text-xs leading-relaxed">
            {locale === 'am' ? recommendationAmharic : recommendationEnglish}
          </p>
        </div>
      </div>

      {/* 4. Action buttons: Reset & WhatsApp */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReset}
          onMouseEnter={playHoverSound}
          className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-ethiopic px-6 py-3 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md shadow-emerald-600/10 text-center"
        >
          🔄 {t('tryAgain')}
        </button>

        {/* Floating/Bottom Share WhatsApp button */}
        <a
          href={`https://api.whatsapp.com/send?text=${shareMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={playHoverSound}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold font-ethiopic px-6 py-3 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md shadow-green-500/10 text-center"
        >
          {/* WhatsApp SVG logo */}
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 2.015 14.12 1.01 11.5 1.012c-5.443 0-9.87 4.374-9.874 9.802-.001 1.762.483 3.486 1.4 5.01L2 21.008l4.647-1.854z" />
          </svg>
          {t('shareWhatsApp')}
        </a>
      </div>

    </div>
  );
};

export default ResultCard;
