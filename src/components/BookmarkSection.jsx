import React from 'react';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    heading: '值得收藏的三份起手指南',
    desc: '這區是給第一次認識你的朋友。即使今天不預約，也能先帶走可用框架，讓網站具備收藏價值。',
    cards: [
      ['企業醫生起手清單', '用 10 分鐘檢查營運內耗、決策瓶頸與現金流風險。', '/insights/enterprise-doctor', '打開清單 →'],
      ['生命藍圖規劃決策地圖', '快速判斷你在壓力情境下的決策偏差與溝通盲點。', '/insights/life-number', '查看地圖 →'],
      ['個人成長節奏模板', '建立一個不靠意志力、可持續執行的每週成長節奏。', '/insights/personal-growth', '套用模板 →'],
    ],
  },
  en: {
    heading: 'Three Resources Worth Bookmarking',
    desc: 'Built for first-time visitors. Even without booking today, you can leave with practical frameworks.',
    cards: [
      ['Enterprise Doctor Checklist', 'Review operational friction, decision bottlenecks, and cashflow risk in 10 minutes.', '/insights/enterprise-doctor', 'Open Checklist →'],
      ['Life Blueprint Planning Decision Map', 'Spot decision bias and communication blind spots under pressure.', '/insights/life-number', 'Open Map →'],
      ['Personal Growth Rhythm Template', 'Build a weekly rhythm system that does not rely on willpower.', '/insights/personal-growth', 'Use Template →'],
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
        <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl">
            <h2 className="text-sm text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-4">Worth Bookmarking</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">{section.heading}</h3>
            <p className="text-slate-200 leading-relaxed mb-8">
              {section.desc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {section.cards.map(([title, desc, href, cta]) => (
              <article key={title} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h4 className="font-bold text-[#D4AF37] mb-3">{title}</h4>
                <p className="text-sm text-slate-200 mb-4">{desc}</p>
                <a href={href} className="text-sm font-bold text-white hover:text-[#D4AF37]">{cta}</a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookmarkSection;
