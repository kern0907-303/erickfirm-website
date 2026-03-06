import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPreferredLocale, i18n, setPreferredLocale } from '../lib/i18n';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locale, setLocale] = useState(getPreferredLocale());
  const navigate = useNavigate();
  const dict = i18n[locale];

  const handleNav = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLocaleChange = (nextLocale) => {
    setLocale(nextLocale);
    setPreferredLocale(nextLocale);
  };

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-[0.2em] text-slate-900 !text-slate-900">
          ERICK <span className="text-[#D4AF37]">FIRM</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-sm font-bold text-slate-700 hover:text-[#D4AF37] transition-colors">{dict.home}</Link>
          <Link to="/insights" className="text-sm font-bold text-slate-700 hover:text-[#D4AF37] transition-colors">{dict.insights}</Link>
          <a href="/#services" className="text-sm font-bold text-slate-700 hover:text-[#D4AF37] transition-colors">{dict.servicesMenu}</a>
          <a href="/#contact" className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-sm hover:bg-[#D4AF37] transition-all">
            {dict.consult}
          </a>
          <div className="flex items-center text-xs border border-slate-200 rounded-full overflow-hidden">
            <button onClick={() => handleLocaleChange('zh-TW')} className={`px-3 py-1 ${locale === 'zh-TW' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>中</button>
            <button onClick={() => handleLocaleChange('en')} className={`px-3 py-1 ${locale === 'en' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>EN</button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-6 shadow-xl">
          <button onClick={() => handleNav('/')} className="text-left font-bold text-slate-700">{dict.home}</button>
          <button onClick={() => handleNav('/insights')} className="text-left font-bold text-slate-700">{dict.insights}</button>
          <a href="/#services" onClick={() => setIsMenuOpen(false)} className="font-bold text-slate-700">{dict.servicesMenu}</a>
          <a href="/#contact" onClick={() => setIsMenuOpen(false)} className="bg-slate-900 text-white text-center py-3 font-bold rounded-sm">{dict.consult}</a>
          <div className="flex items-center text-xs border border-slate-200 rounded-full overflow-hidden w-fit">
            <button onClick={() => handleLocaleChange('zh-TW')} className={`px-3 py-1 ${locale === 'zh-TW' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>中</button>
            <button onClick={() => handleLocaleChange('en')} className={`px-3 py-1 ${locale === 'en' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>EN</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
