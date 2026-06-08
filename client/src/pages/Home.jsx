import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import AbelMascot from '../components/AbelMascot';
import maizeImg from '../assets/maize.png';
import wheatImg from '../assets/wheat.png';

const Home = () => {
  const { t } = useLanguage();
  const { playHoverSound } = useAudio();

  return (
    <div className="min-h-screen bg-[#FAFAF5] dark:bg-zinc-950 flex flex-col justify-between animate-fadeIn transition-colors duration-300">
      
      {/* 1. Full-Screen Agricultural Hero Section */}
      <header className="relative bg-gradient-to-tr from-emerald-900 via-emerald-800 to-amber-600 text-white overflow-hidden py-16 lg:py-24 shadow-2xl">
        {/* Subtle decorative grain background texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-yellow-300 text-xs font-bold font-ethiopic tracking-wide shadow-sm animate-pulse">
                🌾 የግብርና ብልህ ረዳት (AI Companion)
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-ethiopic leading-tight tracking-tight drop-shadow-md">
                {t('heroTitle')}
              </h1>
              
              <p className="text-zinc-100/90 text-sm sm:text-base font-medium font-ethiopic leading-relaxed max-w-xl">
                {t('heroSub')}
              </p>
              
              {/* Large Glowing CTA Button */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Link
                  to="/detect"
                  onMouseEnter={playHoverSound}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-black font-ethiopic rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-yellow-500/30 text-lg border-2 border-yellow-400 group"
                >
                  📷 {t('heroBtn')}
                  {/* Glowing Arrow Indicator */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                
                <Link
                  to="/diseases"
                  onMouseEnter={playHoverSound}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-extrabold font-ethiopic rounded-2xl transition-colors backdrop-blur-md border border-white/25 text-sm"
                >
                  📖 {t('navDiseases')}
                </Link>
              </div>
            </div>

            {/* Right Mascot Column - Abel waving and pointing to the button */}
            <div className="lg:col-span-5 flex justify-center">
              <AbelMascot state="wave" />
            </div>

          </div>
        </div>
      </header>

      {/* 2. Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Fast scan */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-md transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-inner">
              ⚡
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white font-ethiopic mb-2">
              {t('featureFast')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-xs font-semibold font-ethiopic leading-relaxed">
              {t('featureFastDesc')}
            </p>
          </div>

          {/* Card 2: Localized Amharic */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-md transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-inner">
              🗣️
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white font-ethiopic mb-2">
              {t('featureAmh')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-xs font-semibold font-ethiopic leading-relaxed">
              {t('featureAmhDesc')}
            </p>
          </div>

          {/* Card 3: Free Service */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-md transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-inner">
              🛡️
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white font-ethiopic mb-2">
              {t('featureFree')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-xs font-semibold font-ethiopic leading-relaxed">
              {t('featureFreeDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Crop Selector Section with Teff blur placeholder */}
      <section className="bg-zinc-100/50 dark:bg-zinc-950/30 border-y border-zinc-200 dark:border-zinc-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white font-ethiopic mb-4">
              {t('cropSelectorTitle')}
            </h2>
            <div className="w-20 h-1 bg-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Maize crop card */}
            <Link
              to="/detect"
              onMouseEnter={playHoverSound}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden bg-zinc-200">
                <img src={maizeImg} alt="Maize" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-ethiopic mb-2">
                  🌽 {t('cropMaize')}
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold font-ethiopic">የበቆሎ ቅጠል ለመመርመር እዚህ ይጫኑ</span>
              </div>
            </Link>

            {/* Wheat crop card */}
            <Link
              to="/detect"
              onMouseEnter={playHoverSound}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden bg-zinc-200">
                <img src={wheatImg} alt="Wheat" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-ethiopic mb-2">
                  🌾 {t('cropWheat')}
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold font-ethiopic">የስንዴ ቅጠል ለመመርመር እዚህ ይጫኑ</span>
              </div>
            </Link>

            {/* Teff - Coming Soon Blur Card Overlay */}
            <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow select-none group">
              <div className="h-48 overflow-hidden bg-zinc-200 filter blur-[4px]">
                <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=400" alt="Teff" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 text-center filter blur-[2px]">
                <h3 className="text-xl font-bold text-zinc-400 font-ethiopic mb-2">
                  🌱 {t('cropTeff')}
                </h3>
                <span className="text-xs text-zinc-400 font-extrabold font-ethiopic">የጤፍ ቅጠል በሽታ መመርመሪያ</span>
              </div>
              
              {/* Coming Soon absolute blur badge overlay */}
              <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 text-center z-10 transition-colors duration-300 hover:bg-emerald-950/70">
                <div className="w-16 h-16 bg-yellow-500/20 text-yellow-300 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner">
                  🔒
                </div>
                <h3 className="text-2xl font-black text-white font-ethiopic mb-1">
                  {t('cropTeff')}
                </h3>
                <span className="bg-yellow-600 text-white font-black font-ethiopic text-xs px-4 py-1.5 rounded-full shadow-lg">
                  {t('comingSoon')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white font-ethiopic mb-4">
            {t('howItWorks')}
          </h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Connector dashes on larger viewports */}
          <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 z-0"></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg">
              1
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-ethiopic">
              {t('step1')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-xs font-semibold font-ethiopic leading-relaxed max-w-xs">
              {t('step1Desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg">
              2
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-ethiopic">
              {t('step2')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-xs font-semibold font-ethiopic leading-relaxed max-w-xs">
              {t('step2Desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg">
              3
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-ethiopic">
              {t('step3')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-xs font-semibold font-ethiopic leading-relaxed max-w-xs">
              {t('step3Desc')}
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12 border-t border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex justify-center items-center gap-2 text-white font-black text-xl font-ethiopic">
            <span>🌾</span> አግሮቪዥን AI
          </div>
          <p className="text-xs font-bold font-ethiopic leading-relaxed max-w-md mx-auto">
            {t('footerText')}
          </p>
          <div className="text-[10px] text-zinc-600 font-semibold pt-4">
            © {new Date().getFullYear()} AgroVision AI. All rights reserved. Addis Ababa, Ethiopia.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
