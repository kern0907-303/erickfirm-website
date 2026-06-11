import React from 'react';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    heading: '我們如何把建議變成結果',
    desc: '陌生訪客最在意的不是理念，而是流程是否可信、結果是否可預期。',
    steps: [
      { title: '問題定義', desc: '先把問題從模糊的「卡關感」重塑為可觀察的結構與關鍵阻力指標。' },
      { title: '服務對位', desc: '根據您的底層阻塞，對齊到 初八企業信息顧問Ｉ８、平衡空間 ＮＡＳ 或 艾伯林量子調頻ＡＢＬ 服務軌道。' },
      { title: '執行優化', desc: '以週會或定期信息回看為錨點持續追蹤調整，用系統代管習慣，不依賴單次建議。' },
      { title: '成果追蹤', desc: '回看決策清晰度、內部協作摩擦度與能效輸出穩定度，以第一性原理衡量結果。' },
    ],
    points: [
      ['5秒', '看懂網站定位與三服務結構核心'],
      ['30秒', '完成自評，知道應從哪個對位軌道切入'],
      ['90秒', '理解方法、證據與下一步具體對位路徑'],
    ],
  },
  en: {
    heading: 'How We Turn Advice into Results',
    desc: 'New visitors care about one thing: is the process credible and are outcomes predictable?',
    steps: [
      { title: 'Define the Problem', desc: 'Deconstruct vague pressures into observable structure and structural metrics.' },
      { title: 'Align the Track', desc: 'Map your core bottlenecks to I8 Enterprise Consulting, NAS Balanced Space, or ABL Quantum Frequency tracks.' },
      { title: 'Optimize Execution', desc: 'Use cycle-based checkpoints and structural loops rather than one-off consultation.' },
      { title: 'Track Outcomes', desc: 'Review decision quality, organizational friction, and execution stability metrics.' },
    ],
    points: [
      ['5 sec', 'Understand positioning and track differences'],
      ['30 sec', 'Finish self-check and find your alignment seat'],
      ['90 sec', 'Understand process, evidence, and next action path'],
    ],
  },
};

const ProofSection = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const section = copy[locale];

  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="text-sm text-accent font-bold tracking-[0.3em] uppercase mb-4 font-sans">Proof & Process</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-display">{section.heading}</h3>
          <p className="text-slate-600 font-medium font-sans">{section.desc}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 font-sans">
          {section.steps.map((step, idx) => (
            <article key={step.title} className="bg-white border border-slate-200 rounded-lg p-6">
              <p className="text-xs font-bold text-accent tracking-[0.2em] mb-3">STEP {idx + 1}</p>
              <h4 className="text-lg font-bold text-slate-900 mb-3 font-display">{step.title}</h4>
              <p className="text-slate-700 text-sm leading-relaxed">{step.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6 font-sans">
          {section.points.map(([time, text]) => (
            <div key={time} className="bg-white border border-slate-200 rounded-lg p-6">
              <p className="text-3xl font-bold text-accent font-display">{time}</p>
              <p className="text-slate-700 mt-2">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProofSection;
