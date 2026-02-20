import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            {/* 加上 ! 強制白字 */}
            <h2 className="text-2xl font-bold !text-white tracking-[0.2em] mb-2 font-display">ERICK FIRM</h2>
            {/* 加上 ! 強制金字 */}
            <p className="!text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-bold">Relationship Engineering</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
            {/* 加上 ! 強制淺灰字 */}
            <a href="#services" className="!text-slate-300 hover:!text-white transition-colors">服務項目</a>
            <a href="#about" className="!text-slate-300 hover:!text-white transition-colors">關於我們</a>
            <a href="#contact" className="!text-slate-300 hover:!text-white transition-colors">預約諮詢</a>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-wide">
          {/* 加上 ! 強制淺灰字 */}
          <p className="!text-slate-400">© {new Date().getFullYear()} Erick Firm. All rights reserved.</p>
          <p className="mt-4 md:mt-0 !text-slate-400">運用信息場技術，重塑治理結構。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
