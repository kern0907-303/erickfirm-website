import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getPreferredLocale, i18n, setPreferredLocale } from '../lib/i18n';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locale, setLocale] = useState(getPreferredLocale());
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dict = i18n[locale];

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLocaleChange = (nextLocale) => {
    setLocale(nextLocale);
    setPreferredLocale(nextLocale);
  };

  const isDarkHeader = !isScrolled && isHomePage;

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isDarkHeader
        ? 'bg-transparent border-transparent'
        : 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm'
    }`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className={`text-xl font-bold tracking-[0.2em] font-display transition-colors ${
          isDarkHeader ? 'text-white' : 'text-slate-900'
        }`}>
          ERICK <span className="text-accent">FIRM</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 font-sans">
          <Link to="/" className={`text-sm font-bold transition-colors ${
            isDarkHeader ? 'text-white/90 hover:text-accent' : 'text-slate-700 hover:text-accent'
          }`}>{dict.home}</Link>
          <Link to="/insights" className={`text-sm font-bold transition-colors ${
            isDarkHeader ? 'text-white/90 hover:text-accent' : 'text-slate-700 hover:text-accent'
          }`}>{dict.insights}</Link>
          <a href="/#services" className={`text-sm font-bold transition-colors ${
            isDarkHeader ? 'text-white/90 hover:text-accent' : 'text-slate-700 hover:text-accent'
          }`}>{dict.servicesMenu}</a>
          <a href="/#contact" className={`px-6 py-2 text-sm font-bold rounded-sm transition-all duration-300 ${
            isDarkHeader
              ? 'bg-accent text-slate-900 hover:bg-white hover:text-primary shadow-md'
              : 'bg-primary text-white hover:bg-accent hover:text-slate-900'
          }`}>
            {dict.consult}
          </a>
          <div className={`flex items-center text-xs border rounded-full overflow-hidden transition-colors ${
            isDarkHeader ? 'border-white/20' : 'border-slate-200'
          }`}>
            <button onClick={() => handleLocaleChange('zh-TW')} className={`px-3 py-1 transition-colors ${
              locale === 'zh-TW' 
                ? (isDarkHeader ? 'bg-accent text-slate-900 font-bold' : 'bg-primary text-white') 
                : (isDarkHeader ? 'bg-transparent text-white/70 hover:text-white' : 'bg-white text-slate-600')
            }`}>中</button>
            <button onClick={() => handleLocaleChange('en')} className={`px-3 py-1 transition-colors ${
              locale === 'en' 
                ? (isDarkHeader ? 'bg-accent text-slate-900 font-bold' : 'bg-primary text-white') 
                : (isDarkHeader ? 'bg-transparent text-white/70 hover:text-white' : 'bg-white text-slate-600')
            }`}>EN</button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className={`md:hidden transition-colors ${
          isDarkHeader ? 'text-white' : 'text-slate-900'
        }`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-6 shadow-xl font-sans text-slate-900">
          <button onClick={() => handleNav('/')} className="text-left font-bold text-slate-700 hover:text-accent">{dict.home}</button>
          <button onClick={() => handleNav('/insights')} className="text-left font-bold text-slate-700 hover:text-accent">{dict.insights}</button>
          <a href="/#services" onClick={() => setIsMenuOpen(false)} className="font-bold text-slate-700 hover:text-accent">{dict.servicesMenu}</a>
          <a href="/#contact" onClick={() => setIsMenuOpen(false)} className="bg-primary text-white text-center py-3 font-bold rounded-sm active:bg-accent active:text-slate-900 transition-colors">{dict.consult}</a>
          <div className="flex items-center text-xs border border-slate-200 rounded-full overflow-hidden w-fit">
            <button onClick={() => handleLocaleChange('zh-TW')} className={`px-3 py-1 transition-colors ${locale === 'zh-TW' ? 'bg-primary text-white font-bold' : 'bg-white text-slate-600'}`}>中</button>
            <button onClick={() => handleLocaleChange('en')} className={`px-3 py-1 transition-colors ${locale === 'en' ? 'bg-primary text-white font-bold' : 'bg-white text-slate-600'}`}>EN</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
