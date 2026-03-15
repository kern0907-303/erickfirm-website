import React from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    heading: '你可能正在搜尋這些問題',
    desc: '每個問題都給你一條可落地的下一步，不只講概念。',
    items: [
      {
        q: '如何增長業績？',
        a: '先確認不是「努力不夠」，而是商業流程有阻塞點。從企業醫生路徑先盤點：獲客、交付、回款三段。',
        to: '/insights/enterprise-doctor',
        cta: '看業績增長路徑',
      },
      {
        q: '我想提升行動力與決策力，該從哪開始？',
        a: '先用 TimeWaver 分析釐清你的決策卡點，再做節奏與執行優先順序調整，把想法變成穩定行動。',
        to: '/insights/personal-growth',
        cta: '看行動力提升策略',
      },
      {
        q: '我不知道該做什麼，誰可以幫我分析？',
        a: '先做個人藍圖規劃的決策偏好與角色對位分析，釐清你現在該先做哪一件事、該先放下哪一件事。',
        to: '/insights/life-number',
        cta: '看方向分析入口',
      },
    ],
  },
  en: {
    heading: 'Questions People Ask Before They Decide',
    desc: 'Each question maps to a practical next step, not just theory.',
    items: [
      {
        q: 'How can I grow revenue?',
        a: 'Check the business flow first. The Enterprise Doctor path starts with three checkpoints: acquisition, delivery, and collection.',
        to: '/insights/enterprise-doctor',
        cta: 'See Revenue Growth Path',
      },
      {
        q: 'How can I improve execution and decision quality?',
        a: 'Start with TimeWaver-based analysis to identify your decision bottlenecks, then reset priorities and execution rhythm.',
        to: '/insights/personal-growth',
        cta: 'See Execution Strategy',
      },
      {
        q: 'I feel stuck. Who can help me analyze my direction?',
        a: 'Start with Personal Blueprint Planning to map decision preference and role alignment, then define what to do first and what to pause.',
        to: '/insights/life-number',
        cta: 'See Direction Analysis',
      },
    ],
  },
};

const ProblemAnswersSection = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const section = copy[locale];

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="text-sm text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-4">People Also Ask</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-display">{section.heading}</h3>
          <p className="text-slate-600 font-medium">{section.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {section.items.map((item) => (
            <article key={item.q} className="bg-white border border-slate-200 rounded-xl p-7">
              <h4 className="text-xl font-bold text-slate-900 mb-4">{item.q}</h4>
              <p className="text-slate-700 leading-relaxed mb-6">{item.a}</p>
              <Link to={item.to} className="text-sm font-bold text-slate-900 hover:text-[#D4AF37] tracking-wide">
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
