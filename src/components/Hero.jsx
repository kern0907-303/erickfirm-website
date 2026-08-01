import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPreferredLocale, i18n, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    badge: 'DECISION SUPPORT STUDIO',
    title1: '歡迎你來，',
    title2: '我們先陪你看清結構，',
    titleAccent: '再精準對位軌道',
    desc: '不論卡在商業營運、合夥溝通還是個人執行力，所有的瓶頸本質上都是「底層結構的錯位」。我們從系統結構出發，陪你重組高效能運行軌道。',
    findAnswer: '做 30 秒自評，領取解讀報告',
    bookNow: '加官方 LINE 諮詢',
    cards: [
      {
        id: '01',
        title: '初八企業信息顧問Ｉ８',
        problem: '企業醫生專案：理清獲客-交付-回款阻塞',
        outcome: '降低協作摩擦，使企業營運回到可預測的增長軌道',
        to: '/insights/enterprise-doctor',
        cta: '探索 Ｉ８企業信息顧問',
      },
      {
        id: '02',
        title: '平衡空間 ＮＡＳ',
        problem: '生命數字教學：看懂個人天賦、盲點與生命儀表板',
        outcome: '精確解讀自己與合夥格局，掌握最適當的決策與合作主導權',
        to: '/insights/life-number',
        cta: '探索 平衡空間 ＮＡＳ',
      },
      {
        id: '03',
        title: '艾伯林量子調頻ＡＢＬ',
        problem: '個人信息場調和：TimeWaver 阻力定位與週期頻率支持',
        outcome: '清理深層無形干擾，重整日常能效，獲得穩定頻率共振支持',
        to: '/insights/personal-growth',
        cta: '探索 艾伯林量子調頻 ＡＢＬ',
      },
    ],
  },
  en: {
    badge: 'DECISION SUPPORT STUDIO',
    title1: 'Welcome.',
    title2: 'We map the underlying system structure first,',
    titleAccent: 'then align your growth path',
    desc: 'Whether stuck in revenue, partner conflict, or execution delays, every bottleneck is a structural mismatch. We isolate the root blockages using first principles.',
    findAnswer: 'Find My Best Next Step',
    bookNow: 'Book an Assessment',
    cards: [
      {
        id: '01',
        title: 'I8 Enterprise Consulting',
        problem: 'Enterprise Doctor: Unblock funnel & reduce transaction friction',
        outcome: 'Restore operational predictability and healthy cashflow margins',
        to: '/insights/enterprise-doctor',
        cta: 'Explore I8 Consulting',
      },
      {
        id: '02',
        title: 'NAS Balanced Space',
        problem: 'Life Numerology Teaching: Map talents, blind spots & life dashboard',
        outcome: 'Understand personal and partnership dynamics to optimize key choices',
        to: '/insights/life-number',
        cta: 'Explore NAS Balanced Space',
      },
      {
        id: '03',
        title: 'ABL Quantum Frequency',
        problem: 'Field Harmonization: TimeWaver mapping & frequency support',
        outcome: 'Clear subconscious blocks to sustain peak performance energy',
        to: '/insights/personal-growth',
        cta: 'Explore ABL Quantum Frequency',
      },
    ],
  },
};

const Hero = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  const [activeCard, setActiveCard] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const touchStartXRef = React.useRef(0);
  const touchEndXRef = React.useRef(0);
  React.useEffect(() => onLocaleChange(setLocale), []);
  const dict = i18n[locale];
  const hero = copy[locale];

  React.useEffect(() => {
    setActiveCard(0);
  }, [locale]);

  React.useEffect(() => {
    if (isPaused) return undefined;
    const timer = window.setInterval(() => {
      setActiveCard((prev) => (prev + 1) % hero.cards.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [hero.cards.length, isPaused]);

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.changedTouches?.[0]?.clientX || 0;
    touchEndXRef.current = touchStartXRef.current;
  };

  const handleTouchMove = (event) => {
    touchEndXRef.current = event.changedTouches?.[0]?.clientX || touchEndXRef.current;
  };

  const handleTouchEnd = () => {
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(distance) < 40) return;
    if (distance > 0) {
      setActiveCard((prev) => (prev + 1) % hero.cards.length);
      return;
    }
    setActiveCard((prev) => (prev - 1 + hero.cards.length) % hero.cards.length);
  };

  const scrollToAssessment = () => {
    const element = document.getElementById('assessment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20 bg-white">
      {/* BCG-inspired fast-flowing ambient light and shadow effects on light background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-gradient-to-b from-white via-[#F4F9FA]/50 to-white">
        {/* Glow orb 1: Tiffany Blue (Fast, energetic movement) */}
        <motion.div
          animate={{
            x: [-80, 80, -40, -80],
            y: [-40, 90, -60, -40],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-10 -left-10 w-[500px] h-[500px] rounded-full bg-accent/25 blur-[90px]"
        />
        
        {/* Glow orb 2: Consulting Blue */}
        <motion.div
          animate={{
            x: [60, -60, 30, 60],
            y: [90, -30, 80, 90],
            scale: [1.1, 0.9, 1.05, 1.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full bg-secondary/18 blur-[110px]"
        />
        
        {/* Glow orb 3: Vibrant Teal/Emerald */}
        <motion.div
          animate={{
            x: [40, -40, 60, 40],
            y: [-90, 60, -30, -90],
            scale: [0.95, 1.1, 0.95, 0.95],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-20 w-[400px] h-[400px] rounded-full bg-teal-300/20 blur-[85px]"
        />

        {/* Glow orb 4: Bright highlight core */}
        <motion.div
          animate={{
            x: [-30, 45, -45, -30],
            y: [30, -30, 30, 30],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/3 w-[200px] h-[200px] rounded-full bg-accent/15 blur-[70px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 xl:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] md:text-xs font-bold tracking-[0.18em] text-slate-700 font-display">{hero.badge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-[1.15] text-slate-900 mb-6 font-display tracking-tight">
              {hero.title1}
              <br />
              {hero.title2}<span className="text-accent">{hero.titleAccent}</span>
            </h1>

            <p className="text-slate-700 text-base md:text-lg leading-relaxed max-w-xl mb-8 font-sans">
              {hero.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToAssessment}
                className="px-7 py-4 rounded-sm bg-slate-900 text-white font-bold tracking-wide hover:bg-accent hover:text-slate-900 transition-all duration-350 font-sans shadow-md cursor-pointer hover:shadow-lg hover:translate-y-[-1px]"
              >
                {hero.findAnswer}
              </button>
              <a
                href="/#contact"
                className="px-7 py-4 rounded-sm border border-slate-300 text-slate-900 font-bold tracking-wide hover:border-accent hover:text-accent transition-all duration-350 text-center font-sans cursor-pointer hover:translate-y-[-1px]"
              >
                {hero.bookNow || dict.consult}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="space-y-4"
          >
            <div
              className="relative overflow-hidden rounded-2xl max-w-[480px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${activeCard * 100}%)` }}
              >
                {hero.cards.map((card, index) => (
                  <article
                    key={card.id}
                    className="group w-full shrink-0 rounded-2xl border border-slate-250/70 bg-white p-6 md:p-8 shadow-[0_4px_20px_rgba(0,42,84,0.03)] hover:shadow-[0_20px_50px_rgba(0,42,84,0.08)] hover:border-accent/40 transition-all duration-300 transform hover:translate-y-[-4px]"
                  >
                    <div className="mb-4">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-display tracking-tight">{card.title}</h2>
                    </div>

                    <p className="text-[15px] font-bold text-slate-800 mb-2.5 font-sans mt-4">・{card.problem}</p>
                    <p className="text-sm text-slate-550 leading-relaxed mb-6 font-sans">{card.outcome}</p>

                    <Link
                      to={card.to}
                      className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-accent transition-colors font-sans"
                    >
                      {card.cta}
                      <ArrowUpRight size={16} />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 pl-1">
              {hero.cards.map((card, index) => (
                <button
                  key={card.id}
                  type="button"
                  aria-label={`Go to card ${index + 1}`}
                  onClick={() => setActiveCard(index)}
                  className={`h-1.5 rounded-full transition-all ${activeCard === index ? 'w-8 bg-accent shadow-[0_0_8px_rgba(0,194,194,0.4)]' : 'w-4 bg-slate-300 hover:bg-slate-400'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button
        onClick={scrollToAssessment}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 hover:text-accent transition-colors"
      >
        <ChevronDown size={28} />
      </motion.button>
    </section>
  );
};

export default Hero;
