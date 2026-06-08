import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { locale, toggleLanguage, t } = useLanguage();
  const { playHoverSound } = useAudio();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', labelKey: 'navHome' },
    { path: '/detect', labelKey: 'navDetect' },
    { path: '/diseases', labelKey: 'navDiseases' },
    { path: '/history', labelKey: 'navHistory', protected: true },
    { path: '/dashboard', labelKey: 'navDashboard', protected: true }
  ];

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-0 z-40 transition-colors duration-300 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* 1. Logo & Brand Title */}
          <div className="flex items-center">
            <Link
              to="/"
              onMouseEnter={playHoverSound}
              className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-xl tracking-tight transition-transform hover:scale-105"
            >
              <span className="text-2xl">🌾</span>
              <span className="font-ethiopic font-black tracking-tight">አግሮቪዥን AI</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                if (link.protected && !isAuthenticated) return null;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onMouseEnter={playHoverSound}
                    className={`inline-flex items-center px-3 py-2 text-xs font-extrabold font-ethiopic rounded-xl transition-all duration-300 ${
                      isActive(link.path)
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-black border border-emerald-100 dark:border-emerald-800'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 2. Top-Right Buttons (Language Swapper + Auth Toggles) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switch Button (AM / EN) */}
            <button
              onClick={toggleLanguage}
              onMouseEnter={playHoverSound}
              className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-full font-bold text-xs shadow-sm border border-zinc-200 dark:border-zinc-700 transition-all duration-300"
              title="ቋንቋ ቀይር (Switch Language)"
            >
              🌐 {locale === 'am' ? 'English (EN)' : 'አማርኛ (AM)'}
            </button>

            {isAuthenticated ? (
              // Logged In Status details
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 font-ethiopic">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  onMouseEnter={playHoverSound}
                  className="px-4 py-2 bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 dark:hover:bg-zinc-600 text-white font-extrabold font-ethiopic text-xs rounded-xl shadow transition-colors"
                >
                  {t('navLogout')}
                </button>
              </div>
            ) : (
              // Auth Entry Link buttons
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onMouseEnter={playHoverSound}
                  className="px-4 py-2 text-xs font-extrabold font-ethiopic text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  onMouseEnter={playHoverSound}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold font-ethiopic text-xs rounded-xl shadow transition-colors"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Mobile Menu Trigger */}
          <div className="flex items-center md:hidden gap-2">
            {/* Language Switch Button on Mobile */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-full font-extrabold text-[10px] border border-zinc-200 dark:border-zinc-700"
            >
              {locale === 'am' ? 'EN' : 'አማ'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              onMouseEnter={playHoverSound}
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl"
              aria-label="Toggle Mobile Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* 3. Mobile Navigation Drawer Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 animate-slideDown p-4 space-y-2">
          {navLinks.map((link) => {
            if (link.protected && !isAuthenticated) return null;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl font-bold font-ethiopic text-sm ${
                  isActive(link.path)
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
          
          <hr className="border-zinc-200 dark:border-zinc-800 my-2" />

          {isAuthenticated ? (
            <div className="space-y-2">
              <span className="block px-4 py-1 text-xs font-bold text-zinc-400 font-ethiopic">
                👤 {user?.name}
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold font-ethiopic rounded-xl text-sm"
              >
                {t('navLogout')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-center bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold font-ethiopic rounded-xl text-sm"
              >
                {t('navLogin')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-ethiopic rounded-xl text-sm shadow"
              >
                {t('navRegister')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
