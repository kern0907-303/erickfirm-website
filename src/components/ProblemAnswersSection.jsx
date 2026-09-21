import React from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    heading: '以第一性原理釐清您的核心阻塞點',
    desc: '問題不在於問題本身，而在於您解決問題的結構層級。',
    items: [
      {
        q: '人力與組織協作一直卡住，問題到底在哪裡？',
        a: '當團隊越來越忙、協作卻越來越慢，不一定是人不夠或制度不夠。企業醫生診斷先把角色、授權、跨部門節奏和決策方式攤開，找出最該先處理的結構。',
        to: '/i8',
        cta: '進入企業醫生診斷',
      },
      {
        q: '長期撐住、一直先照顧別人，卻越來越回不到自己的狀態？',
        a: '工作和照顧常常兩頭燒。ABL 提供個人狀態的觀察與支持，陪你辨識長期硬撐帶來的內在消耗，慢慢回到比較穩定、清楚，也能行動的狀態。',
        to: '/abl',
        cta: '進入 ABL 個人狀態支持',
      },
      {
        q: '我適合什麼工作與方向？為什麼已經很努力還是卡住？',
        a: '天賦不是把你定型的標籤，而是理解自己怎麼思考、怎麼行動的線索。NAS 以生命數字協助你整理天賦、職涯、創業或收入選擇的方向，找到較適合自己的節奏。',
        to: '/nas',
        cta: '進入 NAS 生命數字',
      },
    ],
  },
  en: {
    heading: 'Deconstruct Your Core Bottlenecks via First Principles',
    desc: 'The problem is rarely the symptom itself, but the level at which you address it.',
    items: [
      {
        q: 'Where are people and organizational collaboration getting stuck?',
        a: 'When a team gets busier but collaboration slows down, the issue is not always headcount or policy. Enterprise Doctor starts with roles, decision rights, cross-team rhythm, and handoffs to identify the structure to address first.',
        to: '/i8',
        cta: 'Enter Enterprise Doctor Diagnosis',
      },
      {
        q: 'Have you been holding everything together for too long and losing your own footing?',
        a: 'Work and care responsibilities can pull in two directions at once. ABL offers observation and support for your personal state, helping you notice long-term internal depletion and return to a steadier, clearer place to act.',
        to: '/abl',
        cta: 'Enter ABL Personal State Support',
      },
      {
        q: 'What work and direction suit me—and why am I still stuck despite trying hard?',
        a: 'Talent is not a label that fixes your future. NAS uses life numerology to help you understand your patterns and consider career, business, or income choices with a rhythm that fits you better.',
        to: '/nas',
        cta: 'Enter NAS Life Numerology',
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
          <h2 className="text-sm text-accent font-bold tracking-[0.3em] uppercase mb-4 font-sans">FIRST PRINCIPLES</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-display">{section.heading}</h3>
          <p className="text-slate-600 font-medium font-sans max-w-xl mx-auto font-light">{section.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 font-sans">
          {section.items.map((item) => (
            <article key={item.q} className="bg-white border border-slate-200/60 rounded-2xl p-7 shadow-[0_4px_25px_rgba(0,42,84,0.03)] hover:shadow-[0_20px_50px_rgba(0,42,84,0.08)] hover:border-accent/40 hover:translate-y-[-4px] transition-all duration-300 transform flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 font-display leading-snug">{item.q}</h4>
                <p className="text-slate-700 leading-relaxed mb-6 font-light">{item.a}</p>
              </div>
              <Link to={item.to} className="text-sm font-bold text-slate-900 hover:text-accent tracking-wide transition-colors mt-2">
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
