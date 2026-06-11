import React from 'react';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    heading: '值得收藏的三份結構對位指南',
    desc: '這是為初次造訪 Erick Firm 的決策者設計的。即使今天不預約評估，也建議先帶走可用之結構框架，讓您快速自我檢視。',
    cards: [
      ['Ｉ８企業醫生起手清單', '用 10 分鐘排查營運內耗、商業漏斗阻塞與現金流信號斷裂。', '/insights/enterprise-doctor', '打開清單 →'],
      ['ＮＡＳ決策對位地圖', '快速判斷您或合夥團隊在壓力情境下的角色錯位與決策盲區。', '/insights/life-number', '查看地圖 →'],
      ['ＡＢＬ個人能效節奏模板', '建立一個不靠意志力強撐、可持續流暢運行的能效回看系統。', '/insights/personal-growth', '套用模板 →'],
    ],
  },
  en: {
    heading: 'Three Alignment Resources Worth Bookmarking',
    desc: 'Designed for first-time visitors. Even without booking an assessment today, you can leverage these foundational frameworks.',
    cards: [
      ['I8 Enterprise Doctor Checklist', 'Review operational leaks, funnel blockages, and cashflow signals in 10 minutes.', '/insights/enterprise-doctor', 'Open Checklist →'],
      ['NAS Decision Seat Alignment Map', 'Identify decision biases and role authority conflicts under pressure.', '/insights/life-number', 'Open Map →'],
      ['ABL Performance Rhythm Template', 'Build a weekly performance tracking template that replaces raw willpower.', '/insights/personal-growth', 'Use Template →'],
    ],
  },
};

const BookmarkSection = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const section = copy[locale];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="bg-primary text-white rounded-lg p-8 md:p-12 shadow-xl">
          <div className="max-w-3xl">
            <h2 className="text-sm text-accent font-bold tracking-[0.3em] uppercase mb-4 font-sans">Worth Bookmarking</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6 font-display">{section.heading}</h3>
            <p className="text-slate-200 leading-relaxed mb-8 font-sans">
              {section.desc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 font-sans">
            {section.cards.map(([title, desc, href, cta]) => (
              <article key={title} className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-accent/40 transition-all duration-300">
                <h4 className="font-bold text-accent mb-3 font-display">{title}</h4>
                <p className="text-sm text-slate-200 mb-4">{desc}</p>
                <a href={href} className="text-sm font-bold text-white hover:text-accent transition-colors">{cta}</a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookmarkSection;
