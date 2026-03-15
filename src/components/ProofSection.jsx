import React from 'react';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    heading: '我們如何把建議變成結果',
    desc: '陌生訪客最在意的不是理念，而是流程是否可信、結果是否可預期。',
    steps: [
      { title: '問題定義', desc: '先把問題從「感覺」變成可觀察的結構與指標。' },
      { title: '服務對位', desc: '依照你的情境，對應企業醫生、生命藍圖規劃或個人成長路徑。' },
      { title: '執行優化', desc: '用週期檢核機制持續調整，而不是一次性建議。' },
      { title: '成果追蹤', desc: '以決策品質、內耗程度、輸出穩定度回看成效。' },
    ],
    points: [
      ['5秒', '看懂網站定位與三服務差異'],
      ['30秒', '完成自評，知道先從哪個服務切入'],
      ['90秒', '理解方法、證據與下一步行動路徑'],
    ],
  },
  en: {
    heading: 'How We Turn Advice into Results',
    desc: 'New visitors care about one thing: is the process credible and are outcomes predictable?',
    steps: [
      { title: 'Define the Problem', desc: 'Turn vague pressure into observable structure and indicators.' },
      { title: 'Match the Service', desc: 'Map your scenario to Enterprise Doctor, Life Blueprint Planning, or Personal Growth.' },
      { title: 'Optimize Execution', desc: 'Use cycle-based checkpoints, not one-off recommendations.' },
      { title: 'Track Outcomes', desc: 'Review decision quality, internal friction, and output stability.' },
    ],
    points: [
      ['5 sec', 'Understand positioning and service differences'],
      ['30 sec', 'Finish self-check and pick your first path'],
      ['90 sec', 'Understand process, evidence, and next action'],
    ],
  },
};

const ProofSection = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const section = copy[locale];

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="text-sm text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-4">Proof & Process</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-display">{section.heading}</h3>
          <p className="text-slate-600 font-medium">{section.desc}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {section.steps.map((step, idx) => (
            <article key={step.title} className="bg-white border border-slate-200 rounded-xl p-6">
              <p className="text-xs font-bold text-[#D4AF37] tracking-[0.2em] mb-3">STEP {idx + 1}</p>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
              <p className="text-slate-700 text-sm leading-relaxed">{step.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {section.points.map(([time, text]) => (
            <div key={time} className="bg-white border border-slate-200 rounded-xl p-6">
              <p className="text-3xl font-bold text-[#D4AF37]">{time}</p>
              <p className="text-slate-700 mt-2">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProofSection;
