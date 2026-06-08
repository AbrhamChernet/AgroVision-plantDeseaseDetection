import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { diseaseData } from '../data/diseaseData';
import DiseaseCard from '../components/DiseaseCard';

const Diseases = () => {
  const { t } = useLanguage();
  const { playHoverSound } = useAudio();
  const [activeTab, setActiveTab] = useState('maize');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDiseases, setFilteredDiseases] = useState([]);

  useEffect(() => {
    // Get crop pool based on tab
    const cropPool = diseaseData[activeTab] || [];
    
    // Filter by search query (match English and Amharic titles)
    const filtered = cropPool.filter((disease) => {
      const q = searchQuery.toLowerCase();
      return (
        disease.nameEn.toLowerCase().includes(q) ||
        disease.nameAm.includes(q) ||
        (disease.descriptionAmharic && disease.descriptionAmharic.includes(q))
      );
    });

    setFilteredDiseases(filtered);
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAFAF5] dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white font-ethiopic mb-2">
            📖 {t('navDiseases')}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold font-ethiopic">
            የበቆሎ እና የስንዴ ሰብል በሽታዎች ዝርዝር፣ ምልክቶችና መከላከያ መንገዶች ማውጫ።
          </p>
          <div className="w-16 h-1 bg-emerald-600 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Search bar & Tabs row */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Crop Selector Tabs */}
          <div className="flex gap-2 w-full md:w-auto">
            {/* Maize Tab */}
            <button
              onClick={() => {
                setActiveTab('maize');
                setSearchQuery('');
              }}
              onMouseEnter={playHoverSound}
              className={`flex-grow md:flex-grow-0 px-6 py-2.5 rounded-xl font-bold font-ethiopic text-sm border transition-all duration-300 transform active:scale-95 ${
                activeTab === 'maize'
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              🌽 የበቆሎ በሽታዎች
            </button>

            {/* Wheat Tab */}
            <button
              onClick={() => {
                setActiveTab('wheat');
                setSearchQuery('');
              }}
              onMouseEnter={playHoverSound}
              className={`flex-grow md:flex-grow-0 px-6 py-2.5 rounded-xl font-bold font-ethiopic text-sm border transition-all duration-300 transform active:scale-95 ${
                activeTab === 'wheat'
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              🌾 የስንዴ በሽታዎች
            </button>

            {/* Teff Tab (Disabled Coming soon) */}
            <div className="relative group cursor-not-allowed hidden sm:block">
              <button
                disabled
                className="px-6 py-2.5 rounded-xl font-bold font-ethiopic text-sm border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-600 opacity-60 flex items-center gap-1"
              >
                🌱 የጤፍ በሽታዎች
              </button>
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow font-ethiopic">
                {t('comingSoon')}
              </span>
            </div>
          </div>

          {/* Search Input field */}
          <div className="relative w-full md:max-w-sm shrink-0">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold font-ethiopic text-xs focus:outline-none focus:border-emerald-600 text-zinc-800 dark:text-zinc-200 transition-colors"
            />
            {/* Search Glass icon */}
            <div className="absolute left-3.5 top-3.5 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

        </div>

        {/* 2. Grid list of Disease Cards */}
        {filteredDiseases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDiseases.map((disease) => (
              <DiseaseCard key={disease.id} disease={disease} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-xl flex flex-col items-center justify-center space-y-4">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 font-ethiopic">
              ምንም ዓይነት በሽታ አልተገኘም።
            </h3>
            <p className="text-zinc-500 text-xs font-medium font-ethiopic max-w-xs">
              እባክዎ የምርመራ ቃላቶቹን ያረጋግጡ ወይም የሰብል ዓይነትን ይቀይሩ።
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Diseases;
