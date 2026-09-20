import React from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';
import { LINE_CONFIG } from '../lib/constants';

const copy = {
  'zh-TW': {
    heading: '三大情境之門・對位核心卡點',
    desc: '世上沒有一體適用的解法。從個人內在承接、天賦藍圖盲區到商業系統架構，請根據你當前最急迫的現實卡點，進入專屬的情境入口：',
    labels: { project: '核心主題：', audience: '適合誰：', solve: '解決什麼：', method: '如何進行：', outcome: '預期結果：', timeline: '服務形式：' },
    read: '進入專題入口 ➔',
    consult: '立即預約 ↗',
    stats: ['情境獨立分流', '直球對決問題', '專屬深度解說', '100% 聚焦對位'],
    services: [
      {
        id: '門 01',
        brand: 'ABL 系統',
        title: '艾伯林 ABL・信息調和',
        project: '生命後台耗電程式清理與承接力重置（10分鐘實測解密）',
        audience: '像沒充飽電的電池、夜間大腦關不了機、想衝卻踩著煞車動彈不得的高管與創業者',
        solve: '為什麼越努力越累？找出潛意識中吃光你精力的隱藏耗電程式與漏能點',
        method: '線上狀態掃描 ➜ 耗電程式定位 ➜ 遠距頻率修補 ➜ 7~30天動態回看支持',
        outcome: '關閉大腦無效運轉，修復深層睡眠自癒力，找回真實的行動承接力',
        timeline: '100% 線上遠距進行（視訊解讀＋遠距調和）',
        path: '/abl',
        featured: true,
        buttonText: '進入 ABL 專區（看實測解密）➔',
      },
      {
        id: '門 02',
        brand: 'NAS 系統',
        title: '平衡空間 NAS・天賦對位',
        project: '天賦藍圖與性格盲區解構（奧斯學長生命數字）',
        audience: '重大決策反覆遲疑、天賦錯配內耗、看不清自身性格盲點的個體與合夥團隊',
        solve: '不知道優勢在哪裡、用別人的標準懲罰自己、合夥與親密關係溝通高摩擦',
        method: '20年奧斯學長生命數字解析 ➜ 天賦資源矩陣 ➜ 繪製個人生命儀表板',
        outcome: '看懂自己的生命使用說明書，掌握決策主動權，讓角色合作順暢無阻',
        timeline: '線上天賦解盤與 1 對 1 深度對焦',
        path: '/insights/life-number',
        featured: false,
        buttonText: '探索天賦專題 ➔',
      },
      {
        id: '門 03',
        brand: 'I8 系統',
        title: '初八企業顧問 I8・企業醫生',
        project: '商業決策校準與系統架構（企業醫生專案）',
        audience: '營收面臨增長瓶頸、內部協作內耗嚴重、獲客或交付阻塞的創辦人及核心團隊',
        solve: '商業模式利潤漏斗堵塞、高管決策共識困難、現金流回看不清、組織摩擦成本過高',
        method: '商業體質盤點 ➜ 系統漏斗風險評估 ➜ 交易結構重整 ➜ 核心KPI對位',
        outcome: '打通關鍵漏斗阻塞，降低內部協作摩擦，使商業系統恢復可預測利潤增長',
        timeline: '企業深度專案盤點與高管對位顧問',
        path: '/insights/enterprise-doctor',
        featured: false,
        buttonText: '探索企業醫生專題 ➔',
      },
    ],
  },
  en: {
    heading: 'Three Scenario Gates: Align Your Root Blockage',
    desc: 'No generic solutions. Based on first principles, enter the dedicated scenario gate tailored to your current challenge:',
    labels: { project: 'Core Theme:', audience: 'Who it’s for:', solve: 'What it solves:', method: 'How it works:', outcome: 'Expected outcome:', timeline: 'Format:' },
    read: 'Enter Dedicated Hub ➔',
    consult: 'Consult ↗',
    stats: ['Isolated Scenario Gates', 'First-principle Diagnosis', 'Dedicated Deep Guides', 'Targeted Alignment'],
    services: [
      {
        id: 'Gate 01',
        brand: 'ABL System',
        title: 'ABL Information Harmonization',
        project: 'Inner Capacity Reset & 10-Min VSL',
        audience: 'High-performers and individuals exhausted from willpower force, execution resistance, and chronic anxiety',
        solve: 'Paralysis despite clear goals, invisible resistance, nervous system overdrive, energy leakage',
        method: 'Online State Scan ➜ Blockage Pinpointing ➜ Remote Harmonization ➜ 7-Day Cycle Support',
        outcome: 'Discharge compensatory anxiety, restore deep sleep, rebuild authentic life capacity',
        timeline: '100% Online Remote Session',
        path: '/abl',
        featured: true,
        buttonText: 'Enter ABL Hub (Watch 10-Min Video) ➔',
      },
      {
        id: 'Gate 02',
        brand: 'NAS System',
        title: 'NAS Balanced Space',
        project: 'Innate Blueprint & Blindspots Deconstruction',
        audience: 'Individuals & co-founders experiencing talent mismatch, chronic hesitation, and communication friction',
        solve: 'Decision paralysis, talent mismatch, interpersonal friction',
        method: 'Life Numerology Analysis ➜ Gift Assessment ➜ Personal Life Dashboard',
        outcome: 'Master your innate operating manual and align strategic relationships',
        timeline: 'Online 1-on-1 Session',
        path: '/insights/life-number',
        featured: false,
        buttonText: 'Explore Talent Blueprint ➔',
      },
      {
        id: 'Gate 03',
        brand: 'I8 System',
        title: 'I8 Enterprise Consulting',
        project: 'Enterprise Doctor Project',
        audience: 'Founders facing revenue stagnation, operational friction, and delivery bottlenecks',
        solve: 'Funnel blockage, poor delivery efficiency, cashflow misalignment, high friction cost',
        method: 'Health Audit ➜ Funnel Risk Diagnosis ➜ Structural Redesign ➜ KPI Review',
        outcome: 'Unblock growth bottleneck, reduce friction, restore profitable growth',
        timeline: 'Enterprise Advisory Program',
        path: '/insights/enterprise-doctor',
        featured: false,
        buttonText: 'Explore Enterprise Doctor ➔',
      },
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
            <div
              key={srv.id}
              className={`bg-white rounded-2xl p-8 md:p-10 shadow-[0_4px_25px_rgba(0,42,84,0.04)] border-t-4 ${
                srv.featured ? 'border-[#00C2C2] ring-2 ring-[#00C2C2]/20' : 'border-accent'
              } border-x border-b border-slate-100 hover:translate-y-[-4px] hover:shadow-[0_20px_50px_rgba(0,42,84,0.08)] transition-all duration-300 transform flex flex-col justify-between relative`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-accent tracking-[0.2em] font-sans">{srv.id}</span>
                  {srv.featured && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 bg-[#E0F7F7] text-[#006E6E] border border-[#00C2C2]/40 rounded-full font-sans animate-pulse">
                      🔥 10分鐘實測解密
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200/60 p-0.5 shadow-sm shrink-0">
                    <img
                      src={srv.brand.includes('ABL') ? '/logo-abl.jpg' : srv.brand.includes('NAS') ? '/logo-nas.png' : '/logo-i8.png'}
                      alt={`${srv.title} Logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 font-display leading-tight">{srv.title}</h4>
                </div>

                <div className="space-y-4 text-sm text-slate-700 font-sans">
                  <p><span className="font-bold text-slate-900">{section.labels.project}</span>{srv.project}</p>
                  <p><span className="font-bold text-slate-900">{section.labels.audience}</span>{srv.audience}</p>
                  <p><span className="font-bold text-slate-900">{section.labels.solve}</span>{srv.solve}</p>
                  <p><span className="font-bold text-slate-900">{section.labels.method}</span>{srv.method}</p>
                  <p><span className="font-bold text-slate-900">{section.labels.outcome}</span>{srv.outcome}</p>
                  <p><span className="font-bold text-slate-900">{section.labels.timeline}</span>{srv.timeline}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3 font-sans">
                <Link
                  to={srv.path}
                  className={`w-full py-3 rounded-lg text-center font-bold text-sm tracking-wide transition-all shadow-sm ${
                    srv.featured
                      ? 'bg-slate-900 text-white hover:bg-[#00A8A8] hover:shadow-md'
                      : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md'
                  }`}
                >
                  {srv.buttonText || section.read}
                </Link>
                <a
                  href={`${LINE_CONFIG.LINE_MESSAGE_URL}%E3%80%90${encodeURIComponent(srv.title)}%E3%80%91`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-xs font-semibold text-slate-500 hover:text-[#008A8A] transition-colors"
                >
                  直接加 LINE 預約此主題 ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary/95 backdrop-blur-sm border border-slate-700/30 text-white rounded-2xl p-8 md:p-10 grid md:grid-cols-4 gap-6 font-sans shadow-lg">
          <div>
            <p className="text-3xl font-bold text-accent font-display">3</p>
            <p className="text-sm mt-2 font-medium">{section.stats[0]}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent font-display">4</p>
            <p className="text-sm mt-2 font-medium">{section.stats[1]}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent font-display">1:1</p>
            <p className="text-sm mt-2 font-medium">{section.stats[2]}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent font-display">20+</p>
            <p className="text-sm mt-2 font-medium">{section.stats[3]}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
