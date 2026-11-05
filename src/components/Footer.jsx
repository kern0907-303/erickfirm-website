import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { lineAddUrlFor } from '../lib/constants';
import { brandFor } from '../lib/brand';

const linkClass = '!text-slate-300 hover:!text-white active:opacity-70 transition-colors';

const Footer = () => {
  const { pathname } = useLocation();
  // /nas、/abl、/i8 底下只放該品牌：品牌名、和 Erick Firm 關係的說明、自己的頁面，不放其他品牌連結
  const brand = brandFor(pathname);

  if (brand) {
    return (
      <footer className="bg-slate-900 pt-16 pb-20 md:pb-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] mb-16">
            <div>
              <h2 className="text-2xl font-bold !text-white tracking-[0.08em] mb-5">{brand.name}</h2>
              <p className="text-slate-300 text-base leading-relaxed" style={{ textWrap: 'balance' }}>{brand.relation}</p>
            </div>
            <div className="grid gap-3 text-sm font-medium font-sans content-start">
              {brand.nav.map((item) => (
                <Link key={item.to} to={item.to} className={linkClass}>{item.label}</Link>
              ))}
              <a href={lineAddUrlFor(pathname)} target="_blank" rel="noopener noreferrer" className={`mt-3 ${linkClass}`}>官方 LINE</a>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row gap-3 justify-between items-center text-xs tracking-wide font-sans">
            <p className="!text-slate-400">© {new Date().getFullYear()} {brand.name}</p>
            {brand.legal.length > 0 && (
              <div className="flex gap-5">
                {brand.legal.map((item) => (
                  <Link key={item.to} to={item.to} className="!text-slate-400 hover:!text-white active:opacity-70 transition-colors">{item.label}</Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-900 pt-16 pb-20 md:pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] mb-16">
          <div>
            <h2 className="text-2xl font-bold !text-white tracking-[0.2em] mb-5 font-display">ERICK FIRM</h2>
            <p className="text-slate-300 text-base leading-relaxed">看見那個一直在影響結果的因素。</p>
          </div>
          <div className="grid gap-3 text-sm font-medium font-sans">
            <Link to="/about" className={linkClass}>關於艾瑞克</Link>
            <Link to="/i8" className={linkClass}>初八企業顧問</Link>
            <Link to="/nas" className={linkClass}>平衡空間</Link>
            <Link to="/abl" className={linkClass}>艾伯林量子調頻</Link>
            <a href={lineAddUrlFor(pathname)} target="_blank" rel="noopener noreferrer" className={`mt-3 ${linkClass}`}>官方 LINE</a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-wide font-sans">
          <p className="!text-slate-400">© {new Date().getFullYear()} Erick Firm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
