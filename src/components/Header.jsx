import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { lineAddUrlFor } from '../lib/constants';
import { brandFor } from '../lib/brand';

// Erick Firm 首頁、文章、關於頁用的選單
const FIRM_NAV = [
  { to: '/', label: '首頁' },
  { to: '/insights', label: '洞察文章' },
  { to: '/about', label: '關於艾瑞克' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  // /abl 與 /nas/2027 首屏不放加 LINE（2027 頁只在結尾出現一次）
  const showLineCta = !['/abl', '/nas/2027'].includes(pathname.replace(/\/+$/, ''));
  const lineUrl = lineAddUrlFor(pathname);
  const navigate = useNavigate();
  // /nas、/abl、/i8 底下只出現該品牌的 logo、名稱與選單，不出現 Erick Firm
  const brand = brandFor(pathname);
  const nav = brand ? brand.nav : FIRM_NAV;

  const handleNav = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to={brand ? brand.home : '/'} className="flex items-center gap-3 group active:scale-[0.98] transition-transform">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-200/60 p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <img src={brand ? brand.logo : '/logo.png'} alt={brand ? `${brand.name} Logo` : 'Erickfirm Logo'} className="w-full h-full object-contain" />
          </div>
          {brand ? (
            <span className="text-lg font-extrabold tracking-[0.08em] text-slate-900 transition-colors group-hover:text-slate-600">
              {brand.name}
            </span>
          ) : (
            <span className="text-lg font-extrabold tracking-[0.15em] text-slate-900 font-display transition-colors group-hover:text-slate-600">
              ERICK <span>FIRM</span>
            </span>
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 font-sans">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className="text-sm font-bold text-slate-700 hover:text-slate-950 active:opacity-70 transition-colors">{item.label}</Link>
          ))}
          {showLineCta && (
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 active:scale-[0.97] transition-all"
            >
              加 LINE
            </a>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-900 p-2 active:scale-90 transition-transform" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? '關閉選單' : '開啟選單'}>
          {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-6 shadow-xl font-sans text-slate-900">
          {nav.map((item) => (
            <button key={item.to} onClick={() => handleNav(item.to)} className="text-left font-bold text-slate-700 hover:text-slate-900 active:opacity-70">{item.label}</button>
          ))}
          {showLineCta && (
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="bg-slate-900 text-white text-center py-3 font-bold active:scale-[0.98] transition-all cursor-pointer"
            >
              加 LINE
            </a>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
