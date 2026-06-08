import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';

const DiseaseCard = ({ disease }) => {
  const { t, locale } = useLanguage();
  const { playHoverSound, speakText } = useAudio();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    crop,
    cropType,
    nameEnglish,
    nameAmharic,
    severity,
    descriptionAmharic,
    causesAmharic,
    symptomsAmharic,
    treatmentAmharic,
    preventionAmharic,
    imageUrl
  } = disease;

  const displayCrop = crop || cropType;

  // Colors based on severity
  let severityColor = 'bg-zinc-100 text-zinc-700 border-zinc-200';
  if (severity === 'high') {
    severityColor = 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
  } else if (severity === 'medium') {
    severityColor = 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
  } else if (severity === 'none') {
    severityColor = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  }

  // Voice narration of the detailed handbook modal
  const handleVoiceNarration = () => {
    const audioTextAm = `የበሽታው ስም። ${nameAmharic}። ደረጃው ${severity === 'high' ? 'ከፍተኛ' : 'መካከለኛ'} ነው። በሽታው ስለሚከሰትበት ምክንያት፡ ${causesAmharic}። በሽታው የሚያሳያቸው ምልክቶች፡ ${symptomsAmharic}። የሚመከር መፍትሄ፡ ${treatmentAmharic}። ለመከላከል መከተል ያለብን መንገዶች፡ ${preventionAmharic}`;
    const audioTextEn = `Disease name. ${nameEnglish}. Severity is ${severity}. Causes: ${nameEnglish} is caused by fungal spores. Symptoms: ${symptomsAmharic}. Recommended treatments: ${treatmentAmharic}. Preventions: ${preventionAmharic}`;
    
    speakText(audioTextAm, audioTextEn);
  };

  return (
    <>
      {/* 1. Outer Card View */}
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full animate-fadeIn"
        onMouseEnter={playHoverSound}
      >
        {/* Crop Disease Thumbnail */}
        <div className="relative h-44 overflow-hidden bg-zinc-100">
          <img 
            src={imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400'} 
            alt={nameEnglish}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
          {/* Crop identifier pill */}
          <span className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow font-ethiopic">
            {displayCrop === 'maize' ? t('cropMaize') : displayCrop === 'wheat' ? t('cropWheat') : t('cropTeff')}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white font-ethiopic leading-tight">
                {locale === 'am' ? nameAmharic : nameEnglish}
              </h3>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold border rounded-full font-ethiopic ${severityColor}`}>
                {severity === 'high' ? t('severityHigh') : severity === 'medium' ? t('severityMedium') : t('severityNone')}
              </span>
            </div>
            
            <p className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold mb-3">
              {locale === 'am' ? nameEnglish : nameAmharic}
            </p>

            <p className="text-zinc-600 dark:text-zinc-300 text-xs font-medium font-ethiopic leading-relaxed mb-4 line-clamp-3">
              {descriptionAmharic || 'ይህ ሰብል በጤናማ ሁኔታ ላይ ይገኛል።'}
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            onMouseEnter={playHoverSound}
            className="w-full text-center py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold font-ethiopic text-xs rounded-xl transition-all duration-300 transform active:scale-95 border border-emerald-100 dark:border-emerald-950/30"
          >
            📖 {t('readMore')}
          </button>
        </div>
      </div>

      {/* 2. Detailed Modal overlay pop-up */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative animate-[slideDown_0.35s_cubic-bezier(0.16,1,0.3,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close button & Audio Replay in upper header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-zinc-950 dark:text-white font-ethiopic">
                {locale === 'am' ? nameAmharic : nameEnglish}
              </h2>
              
              <div className="flex items-center gap-2">
                {/* Narrate modal content speaker */}
                <button
                  onClick={handleVoiceNarration}
                  onMouseEnter={playHoverSound}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-600 rounded-full transition-colors"
                  title="የድምፅ እገዛ (Read Out)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5V14.5H7.75L12 18.75Z" />
                  </svg>
                </button>
                
                {/* Close modal */}
                <button
                  onClick={() => setModalOpen(false)}
                  onMouseEnter={playHoverSound}
                  className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body Info panels */}
            <div className="space-y-5">
              
              {/* Image banner inside Modal */}
              <div className="w-full h-56 rounded-2xl overflow-hidden shadow-inner bg-zinc-100">
                <img 
                  src={imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600'} 
                  alt={nameEnglish} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* General Description */}
              <div className="bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl p-4">
                <p className="text-zinc-700 dark:text-zinc-300 font-medium font-ethiopic text-xs leading-relaxed">
                  {descriptionAmharic || 'ምንም ዓይነት የበሽታ ወይም የጉዳት ምልክት የሌለው ጤናማ ተክል።'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Causes */}
                <div className="bg-amber-50/40 dark:bg-amber-950/5 border border-amber-200/50 rounded-2xl p-4">
                  <h4 className="text-amber-800 dark:text-amber-400 font-extrabold font-ethiopic text-sm mb-2 flex items-center gap-1.5">
                    🔬 {t('causes')}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 font-medium font-ethiopic text-xs leading-relaxed">
                    {causesAmharic || 'ለበሽታው መንስኤ የሚሆኑ የፈንገስ ስፖሮች።'}
                  </p>
                </div>

                {/* 2. Symptoms */}
                <div className="bg-red-50/40 dark:bg-red-950/5 border border-red-200/50 rounded-2xl p-4">
                  <h4 className="text-red-800 dark:text-red-400 font-extrabold font-ethiopic text-sm mb-2 flex items-center gap-1.5">
                    🔍 {t('symptoms')}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 font-medium font-ethiopic text-xs leading-relaxed">
                    {symptomsAmharic || 'በቅጠሉ ላይ የሚታዩ ነጠብጣቦች፣ ቁስለቶችና ቀለሙ የተቀየረ ጠባሳ።'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 3. Treatment */}
                <div className="bg-emerald-50/40 dark:bg-emerald-950/5 border border-emerald-200/50 rounded-2xl p-4">
                  <h4 className="text-emerald-800 dark:text-emerald-400 font-extrabold font-ethiopic text-sm mb-2 flex items-center gap-1.5">
                    🌿 {t('recommendation')}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 font-medium font-ethiopic text-xs leading-relaxed">
                    {treatmentAmharic || 'በሽታው ሲከሰት መወሰድ ያለበት መፍትሄ።'}
                  </p>
                </div>

                {/* 4. Preventions */}
                <div className="bg-blue-50/40 dark:bg-blue-950/5 border border-blue-200/50 rounded-2xl p-4">
                  <h4 className="text-blue-800 dark:text-blue-400 font-extrabold font-ethiopic text-sm mb-2 flex items-center gap-1.5">
                    🛡️ {t('prevention')}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 font-medium font-ethiopic text-xs leading-relaxed">
                    {preventionAmharic || 'በሽታው አስቀድሞ እንዳይከሰት መከላከያ መንገዶች።'}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                onMouseEnter={playHoverSound}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-ethiopic px-6 py-2.5 rounded-xl transition-all duration-300 shadow"
              >
                {t('closeBtn')}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default DiseaseCard;
