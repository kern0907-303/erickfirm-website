import React from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    heading: '三服務導向首頁',
    desc: '每個服務都清楚回答：適合誰、解決什麼、怎麼做、能得到什麼',
    labels: { audience: '適合誰：', solve: '解決什麼：', method: '如何進行：', outcome: '預期結果：', timeline: '時間預期：' },
    read: '看此服務洞察 →',
    consult: '立即諮詢',
    stats: ['核心服務分艙', '標準執行步驟', '客製化診斷與建議', '首頁可直接回答常見疑問'],
    services: [
      { id: '01', title: '企業醫生', audience: '創辦人、管理層、成長瓶頸中的團隊', solve: '營收停滯、內耗升高、決策節奏混亂', method: '體質盤點 → 風險診斷 → 結構重整 → KPI回看', outcome: '降低交易成本，提升決策效率與現金流穩定度', timeline: '通常 1-4 週可看到管理節奏改善', path: '/insights/enterprise-doctor' },
      { id: '02', title: '生命藍圖規劃', audience: '方向混亂、角色多重、常在關鍵時刻卡住決策的人', solve: '決策反覆、角色錯位、溝通誤解與合作磨耗', method: '決策偏好盤點 → 角色對位分析 → 情境策略建議 → 週期校正', outcome: '看清自己的決策模式，讓選擇更快更穩，合作更順暢', timeline: '通常 1-3 週可看到決策清晰度與溝通效率改善', path: '/insights/life-number' },
      { id: '03', title: '個人成長', audience: '需要提升行動力與決策力的決策者', solve: '執行拖延、決策遲疑、節奏失衡', method: 'TimeWaver 分析 → 核心問題定位 → 個人化支持建議 → 週期回看', outcome: '看見真正卡點，重建穩定節奏與決策清晰度', timeline: '通常 2-6 週可看到行動與決策表現改善', path: '/insights/personal-growth' },
    ],
  },
  en: {
    heading: 'Three Service Tracks',
    desc: 'Each service answers four things: who it is for, what it solves, how it works, and what outcomes to expect.',
    labels: { audience: 'Who it’s for:', solve: 'What it solves:', method: 'How it works:', outcome: 'Expected outcome:', timeline: 'Typical timeline:' },
    read: 'Read service insights →',
    consult: 'Book Consultation',
    stats: ['Distinct service tracks', 'Standard execution steps', 'Tailored diagnostic support', 'Questions answered on homepage'],
    services: [
      { id: '01', title: 'Enterprise Doctor', audience: 'Founders and leaders facing growth bottlenecks', solve: 'Stalled revenue, internal friction, and unstable decision cadence', method: 'Health audit → Risk diagnosis → Structure redesign → KPI review', outcome: 'Lower transaction cost and stronger decision speed', timeline: 'Visible improvement in 1-4 weeks', path: '/insights/enterprise-doctor' },
      { id: '02', title: 'Life Blueprint Planning', audience: 'People with role complexity and recurring decision conflicts', solve: 'Decision loops, role mismatch, and communication friction', method: 'Decision preference mapping → Role alignment → Scenario strategy → Cycle reset', outcome: 'Clearer choices and smoother collaboration', timeline: 'Visible clarity in 1-3 weeks', path: '/insights/life-number' },
      { id: '03', title: 'Personal Growth', audience: 'Decision-makers improving execution and decision quality', solve: 'Execution delay, decision hesitation, and unstable rhythm', method: 'TimeWaver analysis → Core issue mapping → Personalized support plan → Cycle review', outcome: 'Higher execution consistency and better decision quality', timeline: 'Visible improvement in 2-6 weeks', path: '/insights/personal-growth' },
    ],
  },
};

const Services = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const section = copy[locale];

  return (
    <section id="services" className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-sm text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-4">Three Core Services</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-display">{section.heading}</h3>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">{section.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {section.services.map((srv) => (
            <div key={srv.id} className="bg-white rounded-xl p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border-t-4 border-[#D4AF37] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="text-xs font-bold text-[#D4AF37] tracking-[0.3em] mb-4">{srv.id}</div>
              <h4 className="text-2xl font-bold text-slate-900 mb-6">{srv.title}</h4>
              <div className="space-y-4 text-sm text-slate-700">
                <p><span className="font-bold text-slate-900">{section.labels.audience}</span>{srv.audience}</p>
                <p><span className="font-bold text-slate-900">{section.labels.solve}</span>{srv.solve}</p>
                <p><span className="font-bold text-slate-900">{section.labels.method}</span>{srv.method}</p>
                <p><span className="font-bold text-slate-900">{section.labels.outcome}</span>{srv.outcome}</p>
                <p><span className="font-bold text-slate-900">{section.labels.timeline}</span>{srv.timeline}</p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link to={srv.path} className="text-slate-900 font-bold tracking-wider hover:text-[#D4AF37] transition-colors text-sm uppercase">
                  {section.read}
                </Link>
                <a href="/#contact" className="text-slate-500 font-bold tracking-wider hover:text-slate-900 transition-colors text-sm uppercase">
                  {section.consult}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-slate-900 text-white rounded-2xl p-8 md:p-10 grid md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-[#D4AF37]">3</p>
            <p className="text-sm mt-2">{section.stats[0]}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#D4AF37]">4</p>
            <p className="text-sm mt-2">{section.stats[1]}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#D4AF37]">1:1</p>
            <p className="text-sm mt-2">{section.stats[2]}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#D4AF37]">FAQ</p>
            <p className="text-sm mt-2">{section.stats[3]}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
