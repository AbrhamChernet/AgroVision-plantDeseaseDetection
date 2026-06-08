import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';
import API, { getImageUrl } from '../utils/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Dashboard = () => {
  const { t } = useLanguage();
  const { playHoverSound } = useAudio();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalScans: 0,
    diseasesFound: 0,
    mostCommonDisease: 'የለም',
    cropBreakdown: [
      { name: 'በቆሎ (Maize)', value: 0 },
      { name: 'ስንዴ (Wheat)', value: 0 },
      { name: 'ጤፍ (Teff)', value: 0 }
    ]
  });

  const [recentDetections, setRecentDetections] = useState([]);
  const [weather, setWeather] = useState({
    temp: 22,
    humidity: 78,
    wind: 12,
    condition: 'Rainy',
    risk: 'high'
  });

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B'];

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load dashboard aggregates
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) return;
      try {
        const statsRes = await API.get('/history/stats');
        if (statsRes.data && statsRes.data.stats) {
          setStats(statsRes.data.stats);
        }

        const historyRes = await API.get('/history');
        if (historyRes.data && historyRes.data.history) {
          // Slice last 3 items
          setRecentDetections(historyRes.data.history.slice(0, 3));
        }
      } catch (err) {
        console.warn('Backend stats error. Restoring mock stats for preview...');
        const cached = localStorage.getItem('agrovision_recent_scans');
        if (cached) {
          const parsed = JSON.parse(cached);
          setRecentDetections(parsed.slice(0, 3));
          
          const maizeVal = parsed.filter(s => s.cropType === 'maize').length;
          const wheatVal = parsed.filter(s => s.cropType === 'wheat').length;
          
          setStats({
            totalScans: parsed.length,
            diseasesFound: parsed.filter(s => s.severity !== 'none').length,
            mostCommonDisease: parsed.length > 0 ? parsed[0].diseaseAmharic : 'የለም',
            cropBreakdown: [
              { name: 'በቆሎ (Maize)', value: maizeVal },
              { name: 'ስንዴ (Wheat)', value: wheatVal },
              { name: 'ጤፍ (Teff)', value: 0 }
            ]
          });
        }
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  // Fetch Debre Markos live weather conditions (fallback to agricultural simulation if offline/api key empty)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = import.meta.env.OPENWEATHER_API_KEY || '6d123e45f9e8a75e01f234e9c70a8d3b'; // Mock fallback key
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Debre%20Markos&units=metric&appid=${API_KEY}`
        );
        const data = await weatherRes.json();
        
        if (data.main) {
          const relativeHumidity = data.main.humidity;
          // Elevated fungal outbreak risk when humidity > 70%
          const diseaseRisk = relativeHumidity > 70 ? 'high' : 'low';
          
          setWeather({
            temp: Math.round(data.main.temp),
            humidity: relativeHumidity,
            wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            condition: data.weather[0].main,
            risk: diseaseRisk
          });
        }
      } catch (err) {
        // High fidelity simulated rainy season weather forecast for crop safety check
        setWeather({
          temp: 21,
          humidity: 79,
          wind: 14,
          condition: 'Showers',
          risk: 'high'
        });
      }
    };

    fetchWeather();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5] dark:bg-zinc-950">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5] dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:12px_12px] opacity-30"></div>
          <div className="relative z-10 text-left">
            <h1 className="text-3xl font-black font-ethiopic leading-tight">
              {t('welcomeUser')}, {user?.name}! 👋
            </h1>
            <p className="text-zinc-100/80 text-xs font-semibold font-ethiopic mt-1.5">
              ሰብልዎን በየጊዜው መከታተል የተትረፈረፈ ምርት እንዲያገኙ ይረዳል።
            </p>
          </div>
          
          {/* Quick actions row */}
          <div className="flex gap-2 relative z-10 w-full md:w-auto">
            <Link
              to="/detect"
              onMouseEnter={playHoverSound}
              className="flex-grow md:flex-grow-0 px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-black font-ethiopic text-xs rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 text-center"
            >
              📷 {t('newDetectBtn')}
            </Link>
            <Link
              to="/history"
              onMouseEnter={playHoverSound}
              className="flex-grow md:flex-grow-0 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-extrabold font-ethiopic text-xs rounded-xl border border-white/20 text-center"
            >
              📅 ታሪክ እይ
            </Link>
          </div>
        </div>

        {/* Dashboard Grid Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Stats & Breakdown Chart */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick counters grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Scan Counter */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm text-center">
                <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-ethiopic">
                  {t('totalScans')}
                </p>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">
                  {stats.totalScans}
                </h3>
              </div>

              {/* Weekly Scan */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm text-center">
                <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-ethiopic">
                  {t('statsWeek')}
                </p>
                <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {stats.totalScans}
                </h3>
              </div>

              {/* Top outbreak spotted */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm text-center">
                <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-ethiopic">
                  {t('mostDetected')}
                </p>
                <h3 className="text-base font-black text-zinc-900 dark:text-white mt-2 font-ethiopic truncate">
                  {stats.mostCommonDisease}
                </h3>
              </div>
            </div>

            {/* Recharts Pie Chart panel */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-ethiopic mb-4">
                📊 {t('cropBreakdown')}
              </h3>
              
              <div className="h-64 w-full">
                {stats.totalScans > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.cropBreakdown.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.cropBreakdown.filter(item => item.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-zinc-400 text-xs font-semibold font-ethiopic">
                    ምርት ስርጭት ገበታ ለማሳየት መጀመሪያ የቅጠል በሽታ ምርመራ ያድርጉ።
                  </div>
                )}
              </div>
            </div>

            {/* Weather & Crop Outbreak Risk Warning widget */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-ethiopic mb-4">
                🌤️ {t('weatherWidget')} (ደብረ ማርቆስ)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-4xl mb-1">🌦️</span>
                  <h4 className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                    {weather.temp}°C
                  </h4>
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{weather.condition}</span>
                </div>

                <div className="sm:col-span-4 grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="bg-zinc-50 dark:bg-zinc-950/40 p-3 rounded-2xl text-center border border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 block mb-1 font-ethiopic">{t('humidity')}</span>
                    <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200">{weather.humidity}%</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950/40 p-3 rounded-2xl text-center border border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 block mb-1 font-ethiopic">{t('wind')}</span>
                    <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200">{weather.wind} km/h</span>
                  </div>
                </div>

                {/* Localized Outbreak Warnings */}
                <div className="sm:col-span-4 bg-red-50/50 dark:bg-red-950/10 border border-red-200/50 rounded-2xl p-4 flex items-start gap-2.5">
                  <span className="text-2xl animate-bounce">⚠️</span>
                  <div>
                    <h5 className="text-red-700 dark:text-red-400 font-extrabold font-ethiopic text-[11px] uppercase tracking-wider">
                      የበሽታ ስርጭት ስጋት
                    </h5>
                    <p className="text-zinc-700 dark:text-zinc-300 font-semibold font-ethiopic text-[10px] leading-relaxed mt-1">
                      {weather.risk === 'high' ? t('weatherRiskHigh') : t('weatherRiskLow')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Ethiopian Calendars & Recent Activities */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Ethiopian Seasonal Advisories */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-ethiopic">
                📅 {t('ethiopianSeasons')}
              </h3>

              {/* Meher Season crop care */}
              <div className="border-l-4 border-emerald-600 pl-4 py-1 space-y-1">
                <h4 className="font-extrabold text-zinc-950 dark:text-white font-ethiopic text-sm">
                  {t('meherSeason')}
                </h4>
                <p className="text-zinc-500 font-semibold font-ethiopic text-xs leading-relaxed">
                  {t('meherDesc')}
                </p>
              </div>

              {/* Belg Season crop care */}
              <div className="border-l-4 border-amber-500 pl-4 py-1 space-y-1">
                <h4 className="font-extrabold text-zinc-950 dark:text-white font-ethiopic text-sm">
                  {t('belgSeason')}
                </h4>
                <p className="text-zinc-500 font-semibold font-ethiopic text-xs leading-relaxed">
                  {t('belgDesc')}
                </p>
              </div>
            </div>

            {/* Recent scanning activity feed */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-ethiopic">
                🌾 {t('recentActivity')}
              </h3>

              {recentDetections.length > 0 ? (
                <div className="space-y-4">
                  {recentDetections.map((detection) => (
                    <div
                      key={detection._id || detection.id}
                      onClick={() => navigate('/history')}
                      onMouseEnter={playHoverSound}
                      className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-950/80 rounded-2xl cursor-pointer transition-all border border-zinc-100 dark:border-zinc-800/80 shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-200 shrink-0">
                        <img src={getImageUrl(detection.imagePath)} alt="crop" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left space-y-0.5 truncate">
                        <h4 className="font-black text-zinc-950 dark:text-white font-ethiopic text-xs truncate">
                          {detection.diseaseAmharic}
                        </h4>
                        <span className="text-[10px] font-extrabold font-ethiopic text-zinc-400">
                          {detection.cropType === 'maize' ? 'በቆሎ' : 'ስንዴ'} | {new Date(detection.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-400 font-semibold font-ethiopic text-xs">
                  ምንም የምርመራ መዝገብ አልተገኘም።
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
