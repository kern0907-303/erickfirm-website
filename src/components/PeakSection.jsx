import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Zap, ArrowRight } from 'lucide-react';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    title: '第一性原理治理：解構系統的底層邏輯',
    subtitle: '所有的卡關與瓶頸，本質上都是結構的錯位。',
    desc: '傳統諮詢教你「加強管理」或「提升意志力」，但這只是在修補症狀。Erick Firm 從第一性原理出發，透過信息場、治理結構與生命數字教學，直接重組阻礙成長的底層結構。',
    vsTitle: '思維對照：症狀修補 vs. 結構重整',
    traditional: {
      title: '傳統對應（治療症狀）',
      p1: '業績下滑 ➜ 加碼廣告與加倍工時（忽略漏斗阻塞與交易成本）',
      p2: '方向混亂 ➜ 尋求外部導師給答案（忽略自己對天賦盲區與生命儀表板的失控）',
      p3: '執行拖延 ➜ 逼迫自己靠意志力強撐（忽略個人信息場阻力與能量失調）',
    },
    firstPrinciples: {
      title: 'Erick Firm（重塑結構）',
      p1: '初八企業信息顧問Ｉ８ ➜ 梳理「獲客-交付-回款」三段結構，修復商業漏斗。',
      p2: '平衡空間 ＮＡＳ ➜ 透過生命數字教學，帶你繪製並看懂自己的生命儀表板。',
      p3: '艾伯林量子調頻ＡＢＬ ➜ TimeWaver 個人信息場調和與週期頻率支持，清理底層阻礙。',
    },
    triadTitle: '三維一體結構模型',
    triads: [
      {
        icon: Shield,
        name: '初八企業信息顧問Ｉ８',
        focus: '治理結構對位',
        desc: '解決商業系統的信號斷裂與阻塞，理清流程，讓營運回到常識與利潤。',
      },
      {
        icon: Target,
        name: '平衡空間 ＮＡＳ',
        focus: '生命天賦與儀表板定位',
        desc: '透過生命數字解析與對位教學，看懂天賦、盲點與生命儀表板，掌握人生主動權。',
      },
      {
        icon: Zap,
        name: '艾伯林量子調頻ＡＢＬ',
        focus: '個人信息場調和',
        desc: '透過 TimeWaver 量子分析進行個人信息場調和，提供週期頻率支持以重組能量。',
      },
    ],
    peakSlogan: '「結構不對，努力白費；對位清晰，增長自然發生。」',
  },
  en: {
    title: 'First Principles Governance: Deconstructing System Dynamics',
    subtitle: 'Every bottleneck is, at its core, a structural mismatch.',
    desc: 'Traditional advice urges you to "work harder" or "increase willpower." Erick Firm targets the underlying structure of growth via information field tuning, life numerology dashboards, and governance systems.',
    vsTitle: 'Framework Comparison: Symptom Patching vs. Structural Redesign',
    traditional: {
      title: 'Traditional Approach (Symptom-Level)',
      p1: 'Stagnant Growth ➜ Push harder on sales (ignoring bottleneck & transaction cost)',
      p2: 'Lost Direction ➜ Ask external coaches for answers (ignoring your own life dashboard & talent potential)',
      p3: 'Execution Delay ➜ Force action through willpower (ignoring personal field blockages & energy depletion)',
    },
    firstPrinciples: {
      title: 'Erick Firm (First Principles)',
      p1: 'I8 Enterprise Consulting ➜ Audit "Acquisition-Delivery-Collection" and fix funnel flow.',
      p2: 'NAS Balanced Space ➜ Life Numerology teaching to map and read your own life dashboard.',
      p3: 'ABL Quantum Frequency ➜ Personal information field harmonization & frequency support via TimeWaver.',
    },
    triadTitle: 'The Triad Alignment Model',
    triads: [
      {
        icon: Shield,
        name: 'I8 Enterprise Consulting',
        focus: 'Governance Structure',
        desc: 'Repair operational disconnects to restore predictable revenue flow and system health.',
      },
      {
        icon: Target,
        name: 'NAS Balanced Space',
        focus: 'Life Dashboard & Talents',
        desc: 'Understand natural gifts and blind spots through life numerology teaching and dashboards.',
      },
      {
        icon: Zap,
        name: 'ABL Quantum Frequency',
        focus: 'Field Harmonization & Support',
        desc: 'Personal information field harmonization and frequency support loops powered by TimeWaver.',
      },
    ],
    peakSlogan: '“If the structure is wrong, effort is wasted. When aligned, growth is inevitable.”',
  },
};

const PeakSection = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const dict = copy[locale];

  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,194,194,0.12),transparent_40%)] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <span className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-4 block font-sans">First Principles</span>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight font-display">{dict.title}</h2>
          <p className="text-xl text-accent font-semibold mb-6 font-sans">{dict.subtitle}</p>
          <p className="text-slate-300 leading-relaxed font-sans">{dict.desc}</p>
        </div>

        {/* Comparison grid: Critical Thinking */}
        <div className="grid lg:grid-cols-2 gap-10 mb-24 font-sans">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 md:p-10">
            <h3 className="text-lg font-bold text-slate-400 mb-6 uppercase tracking-wider">{dict.traditional.title}</h3>
            <ul className="space-y-6 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold mt-1">✕</span>
                <p>{dict.traditional.p1}</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold mt-1">✕</span>
                <p>{dict.traditional.p2}</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold mt-1">✕</span>
                <p>{dict.traditional.p3}</p>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 border-2 border-accent/30 rounded-lg p-8 md:p-10 relative shadow-[0_0_30px_rgba(0,194,194,0.1)]">
            <div className="absolute -top-3.5 right-6 bg-accent text-slate-900 text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest">
              Critical Corrective
            </div>
            <h3 className="text-lg font-bold text-accent mb-6 uppercase tracking-wider">{dict.firstPrinciples.title}</h3>
            <ul className="space-y-6 text-sm text-white">
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <p>{dict.firstPrinciples.p1}</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <p>{dict.firstPrinciples.p2}</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span>
                <p>{dict.firstPrinciples.p3}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Visual Peak Method: Venn Diagram intersection styled in pure CSS */}
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 font-display">{dict.triadTitle}</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20 font-sans">
          {dict.triads.map((triad, idx) => {
            const Icon = triad.icon;
            return (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-8 hover:border-accent/30 hover:bg-white/[0.07] transition-all duration-300 flex flex-col h-full">
                <div className="h-12 w-12 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6">
                  <Icon size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-300 mb-2">{triad.name}</h4>
                <p className="text-accent text-xs font-bold uppercase tracking-widest mb-4">{triad.focus}</p>
                <p className="text-slate-300 text-sm leading-relaxed flex-grow">{triad.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Closing slogan: Peak highlight */}
        <div className="text-center border-t border-white/10 pt-16 font-sans">
          <p className="text-xl md:text-2xl font-bold text-accent italic font-display">{dict.peakSlogan}</p>
        </div>
      </div>
    </section>
  );
};

export default PeakSection;
