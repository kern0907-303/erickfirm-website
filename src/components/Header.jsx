import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { LINE_CONFIG } from '../lib/constants';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-200/60 p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <img src="/logo.png" alt="Erickfirm Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-extrabold tracking-[0.15em] text-slate-900 font-display transition-colors group-hover:text-slate-600">
            ERICK <span>FIRM</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 font-sans">
          <Link to="/" className="text-sm font-bold text-slate-700 hover:text-accent transition-colors">首頁</Link>
          <Link to="/insights" className="text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors">洞察文章</Link>
          <a href="/#about" className="text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors">關於</a>
          <a
            href={LINE_CONFIG.LINE_MESSAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-colors"
          >
            加 LINE
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-900 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? '關閉選單' : '開啟選單'}>
          {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-6 shadow-xl font-sans text-slate-900">
          <button onClick={() => handleNav('/')} className="text-left font-bold text-slate-700 hover:text-accent">首頁</button>
          <button onClick={() => handleNav('/insights')} className="text-left font-bold text-slate-700 hover:text-slate-900">洞察文章</button>
          <a href="/#about" onClick={() => setIsMenuOpen(false)} className="font-bold text-slate-700 hover:text-slate-900">關於</a>
          <a
            href={LINE_CONFIG.LINE_MESSAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="bg-slate-900 text-white text-center py-3 font-bold transition-colors cursor-pointer"
          >
            加 LINE
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
