import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { getPreferredLocale, i18n, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    badge: 'DECISION SUPPORT STUDIO',
    title1: '歡迎你來，',
    title2: '我們先陪你看清結構，',
    titleAccent: '再精準對位軌道',
    desc: '不論卡在商業營運、合夥溝通還是個人執行力，所有的瓶頸本質上都是「底層結構的錯位」。我們從系統結構出發，陪你重組高效能運行軌道。',
    findAnswer: '30 秒，先找出你現在該解的那一題',
  },
  en: {
    badge: 'DECISION SUPPORT STUDIO',
    title1: 'Welcome.',
    title2: 'We map the underlying system structure first,',
    titleAccent: 'then align your growth path',
    desc: 'Whether stuck in revenue, partner conflict, or execution delays, every bottleneck is a structural mismatch. We isolate the root blockages using first principles.',
    findAnswer: 'Find the 30s Decision Assessment',
  },
};

const Hero = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const hero = copy[locale] || copy['zh-TW'];

  const scrollToAssessment = () => {
    const element = document.getElementById('assessment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-24 bg-white">
      {/* BCG 風格動態光影背景 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-gradient-to-b from-white via-[#F4F9FA]/50 to-white">
        {/* 光暈 1: Tiffany Blue */}
        <motion.div
          animate={{
            x: [-80, 80, -40, -80],
            y: [-40, 90, -60, -40],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-10 -left-10 w-[500px] h-[500px] rounded-full bg-accent/25 blur-[90px]"
        />

        {/* 光暈 2: Consulting Blue */}
        <motion.div
          animate={{
            x: [60, -60, 30, 60],
            y: [90, -30, 80, 90],
            scale: [1.1, 0.9, 1.05, 1.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full bg-secondary/18 blur-[110px]"
        />

        {/* 光暈 3: Teal/Emerald */}
        <motion.div
          animate={{
            x: [40, -40, 60, 40],
            y: [-90, 60, -30, -90],
            scale: [0.95, 1.1, 0.95, 0.95],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-10 right-20 w-[400px] h-[400px] rounded-full bg-teal-300/20 blur-[85px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          {/* Badge 標籤 */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] md:text-xs font-bold tracking-[0.18em] text-slate-700 font-display">
              {hero.badge}
            </span>
          </div>

          {/* 主標題 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.2] text-slate-900 mb-8 font-display tracking-tight">
            {hero.title1}
            <br />
            {hero.title2}
            <span className="text-accent">{hero.titleAccent}</span>
          </h1>

          {/* 副標題說明 */}
          <p className="text-slate-700 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-sans font-light">
            {hero.desc}
          </p>

          {/* 單一主 CTA 按鈕 */}
          <div className="flex justify-center w-full">
            <button
              onClick={scrollToAssessment}
              className="px-8 py-4 md:px-10 md:py-5 rounded-full bg-slate-900 text-white font-bold tracking-wide hover:bg-accent hover:text-slate-900 transition-all duration-300 font-sans shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer text-base md:text-lg"
            >
              {hero.findAnswer} ➔
            </button>
          </div>
        </motion.div>
      </div>

      {/* 向下捲動箭頭 */}
      <motion.button
        onClick={scrollToAssessment}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 hover:text-accent transition-colors cursor-pointer"
        aria-label="Scroll to assessment"
      >
        <ChevronDown size={28} />
      </motion.button>
    </section>
  );
};

export default Hero;
