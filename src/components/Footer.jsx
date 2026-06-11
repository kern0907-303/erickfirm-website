import React from 'react';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    services: '服務項目',
    about: '關於我們',
    consult: '預約諮詢',
    slogan: '運用信息場技術，重塑治理結構。',
  },
  en: {
    services: 'Services',
    about: 'About',
    consult: 'Book Consultation',
    slogan: 'Rebuild decision structure with information-field insights.',
  },
};

const Footer = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const dict = copy[locale];

  return (
    <footer className="bg-primary pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold !text-white tracking-[0.2em] mb-2 font-display">ERICK FIRM</h2>
            <p className="!text-accent text-xs tracking-[0.3em] uppercase font-bold font-sans">Relationship Engineering</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium font-sans">
            <a href="#services" className="!text-slate-300 hover:!text-accent transition-colors">{dict.services}</a>
            <a href="#about" className="!text-slate-300 hover:!text-accent transition-colors">{dict.about}</a>
            <a href="#contact" className="!text-slate-300 hover:!text-accent transition-colors">{dict.consult}</a>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-wide font-sans">
          <p className="!text-slate-400">© {new Date().getFullYear()} Erick Firm. All rights reserved.</p>
          <p className="mt-4 md:mt-0 !text-slate-400">{dict.slogan}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
