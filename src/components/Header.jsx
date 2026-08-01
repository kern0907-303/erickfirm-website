import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-200/60 p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <img src="/logo.png" alt="Erickfirm Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-extrabold tracking-[0.15em] text-slate-900 font-display transition-colors group-hover:text-accent">
            ERICK <span className="text-accent">FIRM</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 font-sans">
          <Link to="/" className="text-sm font-bold text-slate-700 hover:text-accent transition-colors">首頁</Link>
          <Link to="/insights" className="text-sm font-bold text-slate-700 hover:text-accent transition-colors">洞察智庫</Link>
          <a href="/#services" className="text-sm font-bold text-slate-700 hover:text-accent transition-colors">服務項目</a>
          <a
            href={LINE_CONFIG.LINE_MESSAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-accent hover:text-slate-900 hover:translate-y-[-1px] active:translate-y-0 hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            加官方 LINE 諮詢 ↗
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-900 p-2 text-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-6 shadow-xl font-sans text-slate-900">
          <button onClick={() => handleNav('/')} className="text-left font-bold text-slate-700 hover:text-accent">首頁</button>
          <button onClick={() => handleNav('/insights')} className="text-left font-bold text-slate-700 hover:text-accent">洞察智庫</button>
          <a href="/#services" onClick={() => setIsMenuOpen(false)} className="font-bold text-slate-700 hover:text-accent">服務項目</a>
          <a
            href={LINE_CONFIG.LINE_MESSAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="bg-primary text-white text-center py-3 font-bold rounded-lg active:bg-accent active:text-slate-900 transition-colors cursor-pointer"
          >
            加官方 LINE 諮詢 ↗
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
