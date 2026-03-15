import React from 'react';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const FAQ_DATA = {
  'zh-TW': [
    {
      q: '我想增長業績，但不知道先改哪一塊，怎麼辦？',
      a: '先從企業醫生的三段檢查開始：獲客、交付、回款。只要先找出一個最大阻塞點，業績就會開始回升。',
    },
    {
      q: '我想提升行動力與決策力，這裡有可行方向嗎？',
      a: '有。先看個人成長中的 TimeWaver 分析與節奏重建內容，先找核心卡點，再設計執行節奏。',
    },
    {
      q: '我對自己方向很混亂，這裡可以幫我分析嗎？',
      a: '可以，個人藍圖規劃會先做決策偏好與角色對位分析，幫你把「現在先做什麼」具體化。',
    },
    {
      q: '如果我只有 15 分鐘，先看哪裡最有價值？',
      a: '先看首頁「你可能正在搜尋的問題」與「值得收藏指南」，能最快定位問題與得到可用框架。',
    },
  ],
  en: [
    {
      q: 'I need revenue growth, but where should I start?',
      a: 'Start with the Enterprise Doctor checkpoints: acquisition, delivery, and collection. Fix one major blocker first.',
    },
    {
      q: 'I want stronger execution and decision quality. Is there a practical path?',
      a: 'Yes. Start with Personal Growth content on TimeWaver analysis and rhythm reset, then build a stable execution cycle.',
    },
    {
      q: 'My direction feels unclear. Can this site help me analyze it?',
      a: 'Yes. Personal Blueprint Planning starts with decision preference and role alignment to make your next move concrete.',
    },
    {
      q: 'I only have 15 minutes. What should I read first?',
      a: 'Start with “Questions People Ask” and “Worth Bookmarking” on the homepage for quick clarity and practical frameworks.',
    },
  ],
};

const HomeFAQ = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const FAQS = FAQ_DATA[locale];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-sm text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-4">FAQ</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-display">{locale === 'en' ? 'Quick Answers for First-Time Visitors' : '首頁快速問答'}</h3>
          <p className="text-slate-600 font-medium">{locale === 'en' ? 'Get the key answers first, then choose your service path.' : '先回答你最常問的問題，再決定從哪個服務切入。'}</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((item) => (
            <article key={item.q} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-slate-900 mb-3">{item.q}</h4>
              <p className="text-slate-700 leading-relaxed">{item.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export { FAQ_DATA as FAQS };
export default HomeFAQ;
