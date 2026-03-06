import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPreferredLocale, i18n, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    badge: 'DECISION SUPPORT STUDIO',
    title1: '歡迎你來，',
    title2: '我們先陪你看懂問題，',
    titleAccent: '再選對服務路徑',
    desc: '你可能正在卡在業績、決策或行動節奏。先不用急著下結論，我們會用清楚的方法，陪你找到此刻最值得先解的一題。',
    findAnswer: '我想先找答案',
    bookNow: '直接預約評估',
    cards: [
      {
        id: '01',
        title: '企業醫生',
        problem: '解決業績停滯與團隊內耗',
        outcome: '讓營運節奏回到可預測、可放大的狀態',
        to: '/insights/enterprise-doctor',
        cta: '看企業醫生方案',
      },
      {
        id: '02',
        title: '生命數字',
        problem: '解決決策混亂與角色錯位',
        outcome: '釐清角色分工與決策邏輯，避免反覆內耗',
        to: '/insights/life-number',
        cta: '看生命數字分析',
      },
      {
        id: '03',
        title: '個人成長',
        problem: '透過 TimeWaver 分析，找到核心問題',
        outcome: '強化行動力與決策力，建立穩定輸出節奏',
        to: '/insights/personal-growth',
        cta: '看個人成長路徑',
      },
    ],
  },
  en: {
    badge: 'DECISION SUPPORT STUDIO',
    title1: 'Welcome.',
    title2: 'Let us first understand your challenge,',
    titleAccent: 'then choose the right service path',
    desc: 'If you are facing pressure in growth, decisions, or execution rhythm, start here. We help you identify the most important issue to solve first and move with clarity.',
    findAnswer: 'Find My Best Next Step',
    bookNow: 'Book an Assessment',
    cards: [
      {
        id: '01',
        title: 'Enterprise Doctor',
        problem: 'Fix stagnant revenue and team friction',
        outcome: 'Restore a predictable operating rhythm and scalable execution',
        to: '/insights/enterprise-doctor',
        cta: 'Explore Enterprise Doctor',
      },
      {
        id: '02',
        title: 'Numerology',
        problem: 'Fix decision confusion and role mismatch',
        outcome: 'Clarify decision logic and team roles to reduce repeated friction',
        to: '/insights/life-number',
        cta: 'Explore Numerology',
      },
      {
        id: '03',
        title: 'Personal Growth',
        problem: 'Use TimeWaver analysis to find the core issue',
        outcome: 'Build stronger execution and decision quality with a stable rhythm',
        to: '/insights/personal-growth',
        cta: 'Explore Personal Growth',
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
    <section className="relative min-h-screen overflow-hidden pt-24 pb-20 bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(15,23,42,0.09),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_48%,#ffffff_100%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 xl:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border border-slate-200 bg-white/80">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
              <span className="text-[11px] md:text-xs font-bold tracking-[0.18em] text-slate-700">{hero.badge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black leading-[1.12] text-slate-900 mb-6">
              {hero.title1}
              <br />
              {hero.title2}<span className="text-[#D4AF37]">{hero.titleAccent}</span>
            </h1>

            <p className="text-slate-700 text-base md:text-lg leading-relaxed max-w-xl mb-8">
              {hero.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToAssessment}
                className="px-7 py-4 rounded-sm bg-slate-900 text-white font-bold tracking-wide hover:bg-[#D4AF37] transition-colors"
              >
                {hero.findAnswer}
              </button>
              <a
                href="/#contact"
                className="px-7 py-4 rounded-sm border border-slate-300 text-slate-900 font-bold tracking-wide hover:border-[#D4AF37] transition-colors text-center"
              >
                {hero.bookNow || dict.consult}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="space-y-3"
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
                    className="group w-full shrink-0 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-5 md:p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_40px_rgba(15,23,42,0.12)] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-[11px] tracking-[0.22em] font-bold text-[#D4AF37] mb-2">SERVICE {card.id}</p>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900">{card.title}</h2>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">#{index + 1}</span>
                    </div>

                    <p className="text-[15px] font-semibold text-slate-800 mb-2">・{card.problem}</p>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{card.outcome}</p>

                    <Link
                      to={card.to}
                      className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-[#D4AF37] transition-colors"
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
                  className={`h-1.5 rounded-full transition-all ${activeCard === index ? 'w-8 bg-[#D4AF37]' : 'w-4 bg-slate-300 hover:bg-slate-400'}`}
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 hover:text-[#D4AF37] transition-colors"
      >
        <ChevronDown size={28} />
      </motion.button>
    </section>
  );
};

export default Hero;
