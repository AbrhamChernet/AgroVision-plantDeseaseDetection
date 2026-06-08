import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { t } = useLanguage();
  const { playHoverSound } = useAudio();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('+251');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Phone number format validation: Must match +251 followed by 9 digits
    const ethioPhoneRegex = /^\+251[79]\d{8}$/;
    if (!ethioPhoneRegex.test(phone.trim())) {
      toast.error('እባክዎ ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ! (+2519... ወይም +2517...)');
      return;
    }

    // 2. Password validation
    if (password.length < 6) {
      toast.error('የይለፍ ቃል ቢያንስ 6 ፊደላት ወይም ቁጥሮች መሆን አለበት።');
      return;
    }

    setLocalLoading(true);
    const res = await login(phone.trim(), password, rememberMe);
    setLocalLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      toast.error(res.error || 'ስልክ ቁጥር ወይም የይለፍ ቃል አልተሳሳተም፤ እባክዎ እንደገና ይሞክሩ።');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAFAF5] dark:bg-zinc-950 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Login Card Panel utilizing glassmorphism */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800/80 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6">
        
        {/* Header Title */}
        <div className="text-center">
          <span className="text-3xl block mb-2">🔓</span>
          <h2 className="text-2xl font-black text-zinc-950 dark:text-white font-ethiopic">
            {t('logTitle')}
          </h2>
          <div className="w-12 h-1 bg-emerald-600 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-ethiopic text-xs font-semibold text-zinc-800 dark:text-zinc-200">
          
          {/* Phone Input */}
          <div className="space-y-1">
            <label htmlFor="phone" className="block text-zinc-500 font-bold">
              {t('phoneNum')}
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+251912345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full pl-4 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold font-ethiopic text-xs focus:outline-none focus:border-emerald-600 text-zinc-950 dark:text-white transition-colors"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label htmlFor="pass" className="block text-zinc-500 font-bold">
              {t('password')}
            </label>
            <input
              id="pass"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-4 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold font-ethiopic text-xs focus:outline-none focus:border-emerald-600 text-zinc-950 dark:text-white transition-colors"
            />
          </div>

          {/* Remember me checkbox toggle */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-500">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950"
              />
              <span>{t('rememberMe')}</span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={localLoading || authLoading}
            onMouseEnter={playHoverSound}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-ethiopic text-sm rounded-xl transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-2"
          >
            {localLoading || authLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'ግባ (Login)'
            )}
          </button>

        </form>

        {/* Redirect toggle Link */}
        <div className="text-center pt-2">
          <Link
            to="/register"
            onMouseEnter={playHoverSound}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline font-ethiopic"
          >
            {t('noAccount')}
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Login;
