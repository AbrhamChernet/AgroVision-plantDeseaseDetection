import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';
import API, { getImageUrl } from '../utils/api';
import toast from 'react-hot-toast';

const History = () => {
  const { t } = useLanguage();
  const { playHoverSound } = useAudio();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [historyList, setHistoryList] = useState([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    diseasesFound: 0,
    mostCommonDisease: 'የለም',
    lastScanDate: null
  });
  const [dataLoading, setDataLoading] = useState(true);

  // Filters State
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');
  const [searchDiseaseQuery, setSearchDiseaseQuery] = useState('');

  // Selected Detail Modal view
  const [activeDetail, setActiveDetail] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error(t('notLoggedIn'));
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load history records and aggregate stats
  const loadHistoryData = async () => {
    if (!isAuthenticated) return;
    setDataLoading(true);
    try {
      const historyRes = await API.get('/history');
      if (historyRes.data && historyRes.data.history) {
        setHistoryList(historyRes.data.history);
      }

      const statsRes = await API.get('/history/stats');
      if (statsRes.data && statsRes.data.stats) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.warn('API error loading history. Resorting to local cached scans...', err);
      const saved = localStorage.getItem('agrovision_recent_scans');
      if (saved) {
        const cached = JSON.parse(saved);
        setHistoryList(cached);
        setStats({
          totalScans: cached.length,
          diseasesFound: cached.filter(s => s.severity !== 'none').length,
          mostCommonDisease: cached.length > 0 ? cached[0].diseaseAmharic : 'የለም',
          lastScanDate: cached.length > 0 ? cached[0].createdAt : null
        });
      }
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadHistoryData();
    }
  }, [isAuthenticated]);

  // Delete a history entry
  const handleDeleteScan = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('ይህን የምርመራ መዝገብ ማጥፋት ይፈልጋሉ?')) return;

    try {
      await API.delete(`/history/${id}`);
      toast.success('መዝገቡ በተሳካ ሁኔታ ተሰርዟል።');
      
      // Update UI list locally
      setHistoryList(historyList.filter((item) => item._id !== id));
      
      // Refresh stats
      loadHistoryData();
    } catch (err) {
      // Offline delete fallback
      const updated = historyList.filter((item) => item.id !== id && item._id !== id);
      setHistoryList(updated);
      localStorage.setItem('agrovision_recent_scans', JSON.stringify(updated));
      toast.success('መዝገቡ ተሰርዟል።');
    }
  };

  // Perform filtering
  const filteredList = historyList.filter((item) => {
    // Crop filter
    const cropMatch = selectedCropFilter === 'all' || item.cropType === selectedCropFilter;
    
    // Search query
    const diseaseName = item.diseaseAmharic || item.diseaseDetected || '';
    const queryMatch = diseaseName.toLowerCase().includes(searchDiseaseQuery.toLowerCase());
    
    return cropMatch && queryMatch;
  });

  const triggerPDFPrint = () => {
    window.print();
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5] dark:bg-zinc-950">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5] dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Printable Area wrapper class overlay */}
      <div className="max-w-6xl mx-auto space-y-8 print:p-0">
        
        {/* Printable invoice title header (visible ONLY during print) */}
        <div className="hidden print:block text-center border-b-2 border-zinc-900 pb-4 mb-6">
          <h1 className="text-3xl font-black text-zinc-900 font-ethiopic">🌾 አግሮቪዥን AI - የሰብል ምርመራ ሪፖርት</h1>
          <p className="text-xs font-semibold font-ethiopic text-zinc-600 mt-1">Debre Markos, Ethiopia | Date: {new Date().toLocaleDateString()}</p>
        </div>

        {/* 1. Statistics Cards at Top (Print hidden for neat sheets) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
          {/* Total scans */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm text-center">
            <span className="text-2xl mb-1 block">📊</span>
            <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-ethiopic">
              {t('totalScans')}
            </p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
              {stats.totalScans}
            </h3>
          </div>

          {/* Diseases found count */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm text-center">
            <span className="text-2xl mb-1 block">⚠️</span>
            <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-ethiopic">
              {t('diseasesFound')}
            </p>
            <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">
              {stats.diseasesFound}
            </h3>
          </div>

          {/* Most common disease */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm text-center">
            <span className="text-2xl mb-1 block">🦠</span>
            <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-ethiopic">
              {t('mostDetected')}
            </p>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mt-1.5 font-ethiopic truncate">
              {stats.mostCommonDisease}
            </h3>
          </div>

          {/* Last Scan Date */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm text-center">
            <span className="text-2xl mb-1 block">📅</span>
            <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-ethiopic">
              {t('lastScanDate')}
            </p>
            <h3 className="text-[11px] font-bold text-zinc-900 dark:text-white mt-3 leading-tight truncate">
              {stats.lastScanDate ? new Date(stats.lastScanDate).toLocaleDateString() : 'የለም'}
            </h3>
          </div>
        </div>

        {/* 2. Filters Row & PDF Trigger (Print hidden) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between print:hidden">
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Filter buttons */}
            <button
              onClick={() => setSelectedCropFilter('all')}
              onMouseEnter={playHoverSound}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-ethiopic border transition-all ${
                selectedCropFilter === 'all'
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              ሁሉም ሰብሎች
            </button>
            <button
              onClick={() => setSelectedCropFilter('maize')}
              onMouseEnter={playHoverSound}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-ethiopic border transition-all ${
                selectedCropFilter === 'maize'
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              🌽 በቆሎ
            </button>
            <button
              onClick={() => setSelectedCropFilter('wheat')}
              onMouseEnter={playHoverSound}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-ethiopic border transition-all ${
                selectedCropFilter === 'wheat'
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              🌾 ስንዴ
            </button>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {/* Search filter input */}
            <input
              type="text"
              placeholder="የበሽታውን ስም ይፈልጉ..."
              value={searchDiseaseQuery}
              onChange={(e) => setSearchDiseaseQuery(e.target.value)}
              className="flex-grow pl-4 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold font-ethiopic text-xs focus:outline-none focus:border-emerald-600 text-zinc-800 dark:text-zinc-200 transition-colors"
            />

            {/* Export PDF Print Button */}
            <button
              onClick={triggerPDFPrint}
              onMouseEnter={playHoverSound}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-900 text-white font-bold font-ethiopic text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 shrink-0"
            >
              🖨️ {t('exportPDF')}
            </button>
          </div>

        </div>

        {/* 3. History Table / Grid */}
        {filteredList.length > 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-950/40">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-ethiopic">ፎቶ (Image)</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-ethiopic">{t('cropCol')}</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-ethiopic">{t('diseaseCol')}</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-ethiopic">{t('confidenceScore')}</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-ethiopic">{t('dateCol')}</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-ethiopic print:hidden">{t('actionsCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-ethiopic font-medium text-xs text-zinc-800 dark:text-zinc-200">
                  {filteredList.map((item) => (
                    <tr 
                      key={item._id || item.id} 
                      onClick={() => setActiveDetail(item)}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100">
                          <img src={getImageUrl(item.imagePath)} alt="Leaf" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-sm uppercase tracking-wide">
                        {item.cropType === 'maize' ? '🌽 በቆሎ' : '🌾 ስንዴ'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-extrabold text-zinc-950 dark:text-white font-ethiopic">
                          {item.diseaseAmharic || item.diseaseDetected}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-extrabold">
                        {item.confidence <= 1.0 ? Math.round(item.confidence * 100) : Math.round(item.confidence)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-500">
                        {new Date(item.createdAt).toLocaleDateString()} | {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap print:hidden" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleDeleteScan(item._id || item.id, e)}
                          onMouseEnter={playHoverSound}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 rounded-lg font-bold font-ethiopic text-[11px] shadow-sm transition-colors border border-red-100 dark:border-red-900/30"
                        >
                          🗑️ {t('deleteBtn')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-xl flex flex-col items-center justify-center space-y-4">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 font-ethiopic">
              ምንም የምርመራ መዝገብ አልተገኘም።
            </h3>
            <p className="text-zinc-500 text-xs font-medium font-ethiopic max-w-xs">
              ምርመራ ካደረጉ በኋላ የምዝገባ ታሪክዎ እዚህ ላይ በዝርዝር ይቀመጣል።
            </p>
          </div>
        )}

        {/* 4. Details Modal popup */}
        {activeDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-zinc-950 dark:text-white font-ethiopic">📋 የምርመራ ታሪክ ዝርዝር</h3>
                <button
                  onClick={() => setActiveDetail(null)}
                  className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-500 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="w-full h-48 rounded-2xl overflow-hidden bg-zinc-100 shadow-inner">
                  <img src={getImageUrl(activeDetail.imagePath)} alt="Scan Leaf" className="w-full h-full object-cover" />
                </div>

                <div className="grid grid-cols-2 gap-3 font-ethiopic text-xs">
                  <div className="bg-zinc-50 dark:bg-zinc-950/20 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 block font-semibold">ሰብል (Crop)</span>
                    <span className="font-extrabold text-sm uppercase tracking-wide">{activeDetail.cropType === 'maize' ? 'በቆሎ' : 'ስንዴ'}</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950/20 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 block font-semibold">የታየው በሽታ (Disease)</span>
                    <span className="font-extrabold text-sm text-red-600">{activeDetail.diseaseAmharic}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/50 rounded-2xl p-4">
                  <h4 className="text-emerald-700 dark:text-emerald-400 font-extrabold font-ethiopic text-xs mb-1">🌿 የሚመከር መፍትሄ (Remedy)</h4>
                  <p className="text-zinc-700 dark:text-zinc-300 font-medium font-ethiopic text-[11px] leading-relaxed">
                    {activeDetail.recommendationAmharic || activeDetail.remedyAmharic || 'ለዚህ በሽታ የተሰጠ ልዩ መግለጫ የለም።'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setActiveDetail(null)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-ethiopic px-6 py-2.5 rounded-xl transition-all shadow"
                >
                  ዝጋ
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default History;
