import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-slate-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 tracking-[0.2em] mb-2">ERICK FIRM</h2>
            <p className="text-[#D4AF37] text-sm tracking-widest uppercase font-bold">Relationship Engineering</p>
          </div>
          
          <div className="flex gap-8 text-sm font-medium">
            <a href="#services" className="text-slate-500 hover:text-[#D4AF37] transition-colors">服務項目</a>
            <a href="#about" className="text-slate-500 hover:text-[#D4AF37] transition-colors">關於我們</a>
            <a href="#contact" className="text-slate-500 hover:text-[#D4AF37] transition-colors">預約諮詢</a>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Erick Firm. All rights reserved.</p>
          <p className="mt-2 md:mt-0">運用信息場技術，重塑治理結構。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
