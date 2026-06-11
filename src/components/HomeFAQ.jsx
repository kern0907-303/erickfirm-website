import React from 'react';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const FAQ_DATA = {
  'zh-TW': [
    {
      q: '我想打破企業營收停滯，但不知道該先梳理哪一塊？',
      a: '先從初八企業信息顧問Ｉ８（企業醫生專案）的「獲客、交付、回款」三段結構開始排查。找到主要漏斗阻塞點，優先投入資源排除，即可看到營運效率與利潤回升。',
    },
    {
      q: '如何解決莫名的執行拖延、突破個人成長瓶頸？',
      a: '這通常源於信息場與潛意識層面的糾纏阻力。艾伯林量子調頻ＡＢＬ（能量對位專案）使用 TimeWaver 信息場科技定位底層抗拒源並進行調頻修復，重新找回流暢高效的日常節奏。',
    },
    {
      q: '合夥人溝通內耗高、或對個人核心方向感到混亂時，該如何理清？',
      a: '合作高摩擦是角色權利錯位與決策盲區所致。平衡空間 ＮＡＳ（關係對位專案）專注於決策偏好與生命藍圖規劃，將對的職責安放在對的軌道上，將信任摩擦降至最低。',
    },
    {
      q: '如果我只有 15 分鐘，先看哪裡最有價值？',
      a: '建議先看首頁的「第一性原理思維對照」與「值得收藏指南」，能以最短時間獲得定位問題的底層模型。',
    },
  ],
  en: [
    {
      q: 'How do I identify which business bottleneck to fix first?',
      a: 'We begin with I8 Enterprise Consulting (Enterprise Doctor project) to audit your "Acquisition, Delivery, and Collection" funnel. Resolving the single major funnel leak will yield immediate cashflow improvement.',
    },
    {
      q: 'How can I overcome execution blocks and sustain growth momentum?',
      a: 'Willpower depletion points to subconscious field blocks. ABL Quantum Frequency uses TimeWaver technology to map and tune core energetic blocks, replacing raw effort with stable execution flow.',
    },
    {
      q: 'How do we resolve partner friction or lack of personal direction?',
      a: 'Friction is a symptom of role mismatch and decision bias. NAS Balanced Space (Relation Alignment project) maps decision preferences to place stakeholders in the correct seats, lowering communication costs.',
    },
    {
      q: 'I only have 15 minutes. What should I read first?',
      a: 'Start with the "First Principles Framework" and "Worth Bookmarking" sections on our homepage to get a clear conceptual diagnosis and actionable models.',
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
          <h2 className="text-sm text-accent font-bold tracking-[0.3em] uppercase mb-4 font-sans">FAQ</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-display">{locale === 'en' ? 'Quick Answers for First-Time Visitors' : '首頁快速問答'}</h3>
          <p className="text-slate-600 font-medium font-sans">{locale === 'en' ? 'Get the key answers first, then choose your service path.' : '先回答你最常問的問題，再決定從哪個服務切入。'}</p>
        </div>

        <div className="space-y-4 font-sans">
          {FAQS.map((item) => (
            <article key={item.q} className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-slate-900 mb-3 font-display">{item.q}</h4>
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
