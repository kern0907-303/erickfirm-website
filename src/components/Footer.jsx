import React from 'react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';

const Footer = () => {
  return (
    <footer className="bg-slate-900 pt-16 pb-20 md:pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] mb-16">
          <div>
            <h2 className="text-2xl font-bold !text-white tracking-[0.2em] mb-5 font-display">ERICK FIRM</h2>
            <p className="text-slate-300 text-base leading-relaxed">看見那個一直在影響結果的因素。</p>
          </div>
          <div className="grid gap-3 text-sm font-medium font-sans">
            <Link to="/i8" className="!text-slate-300 hover:!text-white transition-colors">初八信息顧問 I8</Link>
            <Link to="/nas" className="!text-slate-300 hover:!text-white transition-colors">平衡空間 NAS</Link>
            <Link to="/abl" className="!text-slate-300 hover:!text-white transition-colors">艾伯林量子調頻 ABL</Link>
            <a href={LINE_CONFIG.LINE_MESSAGE_URL} target="_blank" rel="noopener noreferrer" className="mt-3 !text-slate-300 hover:!text-white transition-colors">官方 LINE</a>
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
