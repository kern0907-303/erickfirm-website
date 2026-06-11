import React from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    heading: '以第一性原理釐清您的核心阻塞點',
    desc: '問題不在於問題本身，而在於您解決問題的結構層級。',
    items: [
      {
        q: '如何打破企業營收增長停滯的瓶頸？',
        a: '增長的本質是交易流程的無阻礙運轉。如果營收停滯，並非團隊不夠努力，而是商業漏斗出現阻塞。初八企業信息顧問Ｉ８協助您精確盤點「獲客-交付-回款」三段結構，排除內部損耗。',
        to: '/insights/enterprise-doctor',
        cta: '探索 Ｉ８ 企業醫生專案',
      },
      {
        q: '我想提升決策力與執行力，卻總是面臨隱形阻力？',
        a: '執行阻力源於潛意識與信息場的卡點。當您意志力強撐依然拖延，代表底層信息場有待修復。艾伯林量子調頻ＡＢＬ透過 TimeWaver 科技定位核心阻塞源並實時調頻，將努力轉化為自然動力。',
        to: '/insights/personal-growth',
        cta: '探索 ＡＢＬ 量子調頻專案',
      },
      {
        q: '團隊內耗高、合作高摩擦，該如何理清關係？',
        a: '合作與關係的摩擦本質上是角色定位與決策偏好的錯位。平衡空間 ＮＡＳ協助您與合夥團隊進行深度生命藍圖與權力分工對位，讓對的權力回到對的位置，將溝通摩擦降到最低。',
        to: '/insights/life-number',
        cta: '探索 ＮＡＳ 關係對位專案',
      },
    ],
  },
  en: {
    heading: 'Deconstruct Your Core Bottlenecks via First Principles',
    desc: 'The problem is rarely the symptom itself, but the level at which you address it.',
    items: [
      {
        q: 'How do I resolve stagnant business growth?',
        a: 'Growth is the frictionless flow of transactions. If revenue stalls, I8 Enterprise Consulting diagnoses structural blocks in your "Acquisition-Delivery-Collection" loops to restore healthy cashflow margins.',
        to: '/insights/enterprise-doctor',
        cta: 'Explore I8 Enterprise Path',
      },
      {
        q: 'How do I build consistent execution and resolve internal resistance?',
        a: 'Persistent hesitation stems from subconscious field blocks. ABL Quantum Frequency uses TimeWaver field scanning to isolate and clear energetic blocks, restoring natural execution and decision clarity.',
        to: '/insights/personal-growth',
        cta: 'Explore ABL Field Tuning',
      },
      {
        q: 'How do we solve partner conflicts and team friction?',
        a: 'Friction arises from role authority mismatch and decision bias. NAS Balanced Space maps decision profiles and seat alignment to establish correct governance boundaries, reducing communication costs.',
        to: '/insights/life-number',
        cta: 'Explore NAS Relation Alignment',
      },
    ],
  },
};

const ProblemAnswersSection = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const section = copy[locale];

  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="text-sm text-accent font-bold tracking-[0.3em] uppercase mb-4 font-sans">People Also Ask</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-display">{section.heading}</h3>
          <p className="text-slate-600 font-medium font-sans">{section.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 font-sans">
          {section.items.map((item) => (
            <article key={item.q} className="bg-white border border-slate-200 rounded-lg p-7">
              <h4 className="text-lg font-bold text-slate-900 mb-4 font-display">{item.q}</h4>
              <p className="text-slate-700 leading-relaxed mb-6">{item.a}</p>
              <Link to={item.to} className="text-sm font-bold text-slate-900 hover:text-accent tracking-wide transition-colors">
                {item.cta} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemAnswersSection;
