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
      { id: '02', title: '平衡空間 ＮＡＳ', project: '生命數字教學', audience: '希望掌握天賦格局、看懂人生盲區並繪製個人決策軌道的個體與合夥團隊', solve: '看不清個人與團隊天賦、重大決策反覆遲疑、人際與合作溝通高摩擦', method: '生命數字解析 → 天賦能量盤點 → 繪製生命儀表板 → 盲點對位教學', outcome: '看懂自己的生命儀表板，掌握決策與關係的主動權，讓角色合作更流暢', timeline: '1-3 週內繪製專屬生命儀表板並完成核心教學', path: '/insights/life-number' },
      { id: '03', title: '艾伯林量子調頻ＡＢＬ', project: '個人信息場調和與頻率支持', audience: '希望清理隱形卡點、調和個人磁場節奏並獲得能量支持的高管與創業者', solve: '意志力過度強撐導致身心耗盡、莫名執行阻力、日常專注與能量失調', method: 'TimeWaver 信息場掃描 → 潛意識阻力定位 → 個人信息場調和 → 週期頻率支持', outcome: '清理深層無形干擾，重塑穩定的決策張力，獲得高效能頻率支持', timeline: '2-6 週內完成底層調和，並建立週期頻率支持', path: '/insights/personal-growth' },
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
      { id: '02', title: 'NAS Balanced Space', project: 'Life Numerology Teaching', audience: 'Individuals and partnership teams seeking to discover natural talents and map their decision dashboard', solve: 'Difficulty recognizing talents, decision loops, and communication friction in partnerships', method: 'Numerology analysis ➜ Gift assessment ➜ Life dashboard mapping ➜ Core training', outcome: 'Understand your personal life dashboard, clarify roles, and optimize relationship boundaries', timeline: 'Map personal life dashboard and complete core training in 1-3 weeks', path: '/insights/life-number' },
      { id: '03', title: 'ABL Quantum Frequency', project: 'Personal Information Field Harmonization', audience: 'Executives and entrepreneurs seeking to clear subconscious resistance and receive energy alignment', solve: 'Burnout from raw willpower force, unexplained execution blockages, and energetic imbalances', method: 'TimeWaver field scan ➜ Block mapping ➜ Personal field harmonization ➜ Frequency support', outcome: 'Clear invisible field blockages, rebuild decision performance, and sustain high-energy focus', timeline: 'Align core energy and set up frequency support loops in 2-6 weeks', path: '/insights/personal-growth' },
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
