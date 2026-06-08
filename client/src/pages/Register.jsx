import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { t } = useLanguage();
  const { playHoverSound } = useAudio();
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+251');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Name validation
    if (name.trim().length < 3) {
      toast.error('እባክዎ ሙሉ ስምዎን በትክክል ያስገቡ (ቢያንስ 3 ፊደላት)');
      return;
    }
    
    // 2. Phone format validation: Must match +251 followed by 9 digits
    const ethioPhoneRegex = /^\+251[79]\d{8}$/;
    if (!ethioPhoneRegex.test(phone.trim())) {
      toast.error('እባክዎ ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ! (+2519... ወይም +2517...)');
      return;
    }

    // 3. Password length check
    if (password.length < 6) {
      toast.error('የይለፍ ቃል ቢያንስ 6 ፊደላት ወይም ቁጥሮች መሆን አለበት።');
      return;
    }

    // 4. Password confirmation check
    if (password !== confirmPassword) {
      toast.error('የይለፍ ቃላቱ አይጣጣሙም! እባክዎ እንደገና ያረጋግጡ።');
      return;
    }

    setLocalLoading(true);
    const res = await register(name.trim(), phone.trim(), password);
    setLocalLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      toast.error(res.error || 'ይህ ስልክ ቁጥር ቀድሞ ተመዝግቧል ወይም ስህተት ተከስቷል።');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAFAF5] dark:bg-zinc-950 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Registration glassmorphism card */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800/80 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6">
        
        {/* Header title */}
        <div className="text-center">
          <span className="text-3xl block mb-2">👤</span>
          <h2 className="text-2xl font-black text-zinc-950 dark:text-white font-ethiopic">
            {t('regTitle')}
          </h2>
          <div className="w-12 h-1 bg-emerald-600 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="space-y-4 font-ethiopic text-xs font-semibold text-zinc-800 dark:text-zinc-200">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-zinc-500 font-bold">
              {t('fullName')}
            </label>
            <input
              id="name"
              type="text"
              placeholder="ሙሉ ስም ያስገቡ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-4 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold font-ethiopic text-xs focus:outline-none focus:border-emerald-600 text-zinc-950 dark:text-white transition-colors"
            />
          </div>

          {/* Phone Number */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirmPass" className="block text-zinc-500 font-bold">
              {t('confirmPassword')}
            </label>
            <input
              id="confirmPass"
              type="password"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-4 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold font-ethiopic text-xs focus:outline-none focus:border-emerald-600 text-zinc-950 dark:text-white transition-colors"
            />
          </div>

          {/* Submit register trigger */}
          <button
            type="submit"
            disabled={localLoading || authLoading}
            onMouseEnter={playHoverSound}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-ethiopic text-sm rounded-xl transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-2"
          >
            {localLoading || authLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'ተመዝገብ (Register)'
            )}
          </button>

        </form>

        {/* Redirect toggle Link */}
        <div className="text-center pt-2">
          <Link
            to="/login"
            onMouseEnter={playHoverSound}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline font-ethiopic"
          >
            {t('hasAccount')}
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Register;
