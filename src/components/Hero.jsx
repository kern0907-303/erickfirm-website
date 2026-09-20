import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPreferredLocale, i18n, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    badge: 'ERICK FIRM・20 年底層結構對位',
    title1: '世上沒有無緣無故的卡點，',
    title2: '所有的瓶頸本質上都是',
    titleAccent: '「底層結構的錯位」',
    desc: '20 年跨越生命底層、天賦藍圖與商業系統。我們不給空泛的心靈雞湯，只陪你一層一層看清結構，重塑關鍵時刻的承接力與決策張力。',
    findAnswer: '探索三大情境之門',
    directAbl: '進入 ABL 信息調和專區',
  },
  en: {
    badge: 'ERICK FIRM・20 YEARS STRUCTURAL ALIGNMENT',
    title1: 'No bottleneck happens in vacuum,',
    title2: 'Every limitation is fundamentally a',
    titleAccent: 'Structural Mismatch',
    desc: '20+ years bridging life capacity, innate talent blueprints, and enterprise architecture. We isolate root structural blocks to rebuild your decision capacity.',
    findAnswer: 'Explore Three Scenario Gates',
    directAbl: 'Go to ABL Information Harmonization',
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

          {/* 主 CTA 按鈕群 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <a
              href="#services"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 text-white font-bold tracking-wide hover:bg-slate-800 transition-all duration-300 font-sans shadow-md hover:shadow-xl hover:scale-105 cursor-pointer text-center text-base"
            >
              {hero.findAnswer} ➔
            </a>
            <Link
              to="/abl"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-700 text-white font-bold tracking-wide hover:bg-emerald-800 transition-all duration-300 font-sans shadow-md hover:shadow-xl hover:scale-105 cursor-pointer text-center text-base flex items-center justify-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              {hero.directAbl} ➔
            </Link>
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
