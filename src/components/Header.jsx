import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAbl = location.pathname.startsWith('/abl');

  const handleNav = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
            {isAbl && <span className="ml-2 text-xs font-semibold px-2.5 py-0.5 bg-[#E0F7F7] text-[#006E6E] rounded-full border border-[#00C2C2]/40">ABL TimeWaver</span>}
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-sans">
          {isAbl ? (
            <>
              <button onClick={() => scrollToSection('philosophy')} className="text-sm font-bold text-slate-700 hover:text-[#008A8A] transition-colors">TimeWaver 原理</button>
              <button onClick={() => scrollToSection('vsl')} className="text-sm font-bold text-slate-700 hover:text-[#008A8A] transition-colors flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00C2C2] animate-pulse"></span>
                實測解密
              </button>
              <button onClick={() => scrollToSection('booking')} className="text-sm font-bold text-slate-700 hover:text-[#008A8A] transition-colors">預約說明</button>
              <Link to="/" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 px-2.5 py-1 rounded-md">
                ← 回總首頁
              </Link>
              <a
                href={`${LINE_CONFIG.LINE_MESSAGE_URL}%E3%80%90ABL%20TimeWaver%E8%AA%BF%E5%92%8C%E9%A0%90%E7%B4%84%E3%80%91`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-[#00A8A8] hover:translate-y-[-1px] active:translate-y-0 shadow-sm transition-all duration-300 cursor-pointer"
              >
                預約線上調和 ↗
              </a>
            </>
          ) : (
            <>
              <Link to="/" className="text-sm font-bold text-slate-700 hover:text-accent transition-colors">首頁</Link>
              <Link to="/abl" className="text-sm font-bold text-[#006E6E] hover:text-[#00A8A8] transition-colors flex items-center gap-1.5 bg-[#E0F7F7] px-3 py-1 rounded-md border border-[#00C2C2]/40">
                <span className="w-2 h-2 rounded-full bg-[#00C2C2]"></span>
                ABL 信息調和
              </Link>
              <a href="/#services" className="text-sm font-bold text-slate-700 hover:text-accent transition-colors">三大情境之門</a>
              <Link to="/insights" className="text-sm font-bold text-slate-700 hover:text-accent transition-colors">洞察智庫</Link>
              <a
                href={LINE_CONFIG.LINE_MESSAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-accent hover:text-slate-900 hover:translate-y-[-1px] active:translate-y-0 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                加官方 LINE 預約 ↗
              </a>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-900 p-2 text-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-5 shadow-xl font-sans text-slate-900">
          {isAbl ? (
            <>
              <button onClick={() => scrollToSection('philosophy')} className="text-left font-bold text-slate-700 hover:text-[#008A8A]">TimeWaver 原理</button>
              <button onClick={() => scrollToSection('vsl')} className="text-left font-bold text-slate-700 hover:text-[#008A8A]">實測解密</button>
              <button onClick={() => scrollToSection('booking')} className="text-left font-bold text-slate-700 hover:text-[#008A8A]">線上預約流程</button>
              <button onClick={() => handleNav('/')} className="text-left text-xs font-semibold text-slate-500 py-1 border-t border-slate-100">
                ← 回 Erick Firm 總首頁
              </button>
              <a
                href={`${LINE_CONFIG.LINE_MESSAGE_URL}%E3%80%90ABL%20TimeWaver%E8%AA%BF%E5%92%8C%E9%A0%90%E7%B4%84%E3%80%91`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="bg-slate-900 text-white text-center py-3 font-bold rounded-lg transition-colors cursor-pointer"
              >
                預約線上調和 ↗
              </a>
            </>
          ) : (
            <>
              <button onClick={() => handleNav('/')} className="text-left font-bold text-slate-700 hover:text-accent">首頁</button>
              <button onClick={() => handleNav('/abl')} className="text-left font-bold text-[#006E6E] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00C2C2]"></span>
                ABL 信息調和專區
              </button>
              <a href="/#services" onClick={() => setIsMenuOpen(false)} className="font-bold text-slate-700 hover:text-accent">三大情境之門</a>
              <button onClick={() => handleNav('/insights')} className="text-left font-bold text-slate-700 hover:text-accent">洞察智庫</button>
              <a
                href={LINE_CONFIG.LINE_MESSAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="bg-primary text-white text-center py-3 font-bold rounded-lg active:bg-accent active:text-slate-900 transition-colors cursor-pointer"
              >
                加官方 LINE 預約 ↗
              </a>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
