import React from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    heading: '三大結構對位服務',
    desc: '以第一性原理為核心，從系統治理、角色互補到能量場修復，為決策者重塑高效能運行網絡。',
    labels: { project: '主打專案：', audience: '適合誰：', solve: '解決什麼：', method: '如何進行：', outcome: '預期結果：', timeline: '時間預期：' },
    read: '看此軌道洞察 →',
    consult: '立即諮詢',
    stats: ['核心軌道分艙', '標準執行步驟', '客製化診斷與建議', '首頁可直接回答常見疑問'],
    services: [
      { id: '01', title: '初八企業信息顧問Ｉ８', project: '企業醫生專案', audience: '面臨增長瓶頸、營運內耗與營收停滯的創辦人及核心團隊', solve: '獲客流量阻塞、交付效率低落、現金流回看失真與內部交易成本過高', method: '商業體質盤點 → 漏斗風險診斷 → 交易結構重整 → 週會KPI回看', outcome: '打通關鍵漏斗阻塞，降低內部協作摩擦，使商業系統恢復可預測之利潤增長', timeline: '1-4 週內定位關鍵阻塞，並優化基本治理常識', path: '/insights/enterprise-doctor' },
      { id: '02', title: '平衡空間 ＮＡＳ', project: '生命藍圖規劃與關係對位', audience: '常在關鍵時刻卡住決策、合夥團隊溝通高摩擦、多重身份角色錯位的領導者', solve: '重大決策反覆遲疑、核心合夥人角色權力錯位、高管團隊溝通內耗', method: '決策偏好分析 → 核心角色對位 → 壓力情境策略建議 → 關係成本校正', outcome: '透視個體深層決策邏輯，精準角色定位，將關係維護與溝通成本降至最低', timeline: '1-3 週內釐清決策核心盲區，並完成決策地圖', path: '/insights/life-number' },
      { id: '03', title: '艾伯林量子調頻ＡＢＬ', project: '個人成長與信息場調頻', audience: '遭遇莫名執行阻力、自律與意志力耗盡、需突破決策天花板的高管與創業者', solve: '莫名拖延遲疑、意志力強撐導致精力崩潰、潛意識隱形抗拒、環境磁場失衡', method: 'TimeWaver 信息場掃描 → 潛意識卡點定位 → 個人及環境調頻支持 → 週期能效回看', outcome: '定位並清理看不見的干擾阻力，重建流暢執行節奏，修復關鍵決策張力', timeline: '2-6 週內釋放核心卡點，並重整日常能效表現', path: '/insights/personal-growth' },
    ],
  },
  en: {
    heading: 'Three Structural Alignment Services',
    desc: 'Based on first principles, we optimize governance systems, key relationships, and information fields to rebuild growth capability.',
    labels: { project: 'Core Project:', audience: 'Who it’s for:', solve: 'What it solves:', method: 'How it works:', outcome: 'Expected outcome:', timeline: 'Typical timeline:' },
    read: 'Read track insights →',
    consult: 'Book Consultation',
    stats: ['Distinct service tracks', 'Standard execution steps', 'Tailored diagnostic support', 'Questions answered on homepage'],
    services: [
      { id: '01', title: 'I8 Enterprise Consulting', project: 'Enterprise Doctor Project', audience: 'Founders and leadership teams facing stagnation, internal friction, and bottlenecks', solve: 'Funnel blockage, poor delivery efficiency, cashflow misalignment, and high internal transaction cost', method: 'Health audit ➜ Risk diagnosis ➜ Structure redesign ➜ Weekly KPI review', outcome: 'Dramatically reduce operational friction, unblock funnel, and restore predictable growth', timeline: 'Locate core blockages within 1-4 weeks', path: '/insights/enterprise-doctor' },
      { id: '02', title: 'NAS Balanced Space', project: 'Life Blueprint & Relation Alignment', audience: 'Leaders stuck in decision loops, facing high relation friction, or experiencing role confusion', solve: 'Decision loops, role authority mismatch, and communication conflicts in partner relations', method: 'Decision preference mapping ➜ Role seat alignment ➜ Scenario guidance ➜ Relation reset', outcome: 'Map individual decision dynamics and seat alignment to minimize friction cost', timeline: 'Map core decision biases and design blueprint in 1-3 weeks', path: '/insights/life-number' },
      { id: '03', title: 'ABL Quantum Frequency', project: 'Personal Growth & Field Tuning', audience: 'Entrepreneurs and executives facing unexplained stagnation or willpower depletion', solve: 'Procrastination, emotional exhaustion, subconscious resistance, and environmental field imbalances', method: 'TimeWaver information scan ➜ Subconscious block mapping ➜ Frequency resonance support ➜ Energy review', outcome: 'Detect and clear invisible blocks, rebuild execution flow, and restore key decision energy', timeline: 'Release core blocks and restore performance rhythm in 2-6 weeks', path: '/insights/personal-growth' },
    ],
  },
};

const Services = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const section = copy[locale];

  return (
    <section id="services" className="py-24 bg-surface">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-sm text-accent font-bold tracking-[0.3em] uppercase mb-4 font-sans">Three Core Services</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-display">{section.heading}</h3>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium font-sans">{section.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {section.services.map((srv) => (
            <div key={srv.id} className="bg-white rounded-lg p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border-t-4 border-accent hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="text-xs font-bold text-accent tracking-[0.3em] mb-4 font-sans">{srv.id}</div>
              <h4 className="text-2xl font-bold text-slate-900 mb-6 font-display">{srv.title}</h4>
              <div className="space-y-4 text-sm text-slate-700 font-sans">
                <p><span className="font-bold text-slate-900">{section.labels.project}</span>{srv.project}</p>
                <p><span className="font-bold text-slate-900">{section.labels.audience}</span>{srv.audience}</p>
                <p><span className="font-bold text-slate-900">{section.labels.solve}</span>{srv.solve}</p>
                <p><span className="font-bold text-slate-900">{section.labels.method}</span>{srv.method}</p>
                <p><span className="font-bold text-slate-900">{section.labels.outcome}</span>{srv.outcome}</p>
                <p><span className="font-bold text-slate-900">{section.labels.timeline}</span>{srv.timeline}</p>
              </div>
              <div className="mt-8 flex gap-4 font-sans">
                <Link to={srv.path} className="text-slate-900 font-bold tracking-wider hover:text-accent transition-colors text-sm uppercase">
                  {section.read}
                </Link>
                <a href="/#contact" className="text-slate-500 font-bold tracking-wider hover:text-slate-900 transition-colors text-sm uppercase">
                  {section.consult}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary text-white rounded-lg p-8 md:p-10 grid md:grid-cols-4 gap-6 font-sans">
          <div>
            <p className="text-3xl font-bold text-accent font-display">3</p>
            <p className="text-sm mt-2">{section.stats[0]}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent font-display">4</p>
            <p className="text-sm mt-2">{section.stats[1]}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent font-display">1:1</p>
            <p className="text-sm mt-2">{section.stats[2]}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent font-display">FAQ</p>
            <p className="text-sm mt-2">{section.stats[3]}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
