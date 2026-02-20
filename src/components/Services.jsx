import React from 'react';

const Services = () => {
  const services = [
    {
      id: "01",
      title: "企業體質診斷",
      desc: "不看表面財報，直擊商業模式與內部關係的根本錯位。運用信息場技術，找出隱藏的交易成本與內耗源頭。",
      icon: "📊"
    },
    {
      id: "02",
      title: "個人頻率校準",
      desc: "針對決策者進行深度的能量與頻率梳理。當創辦人的關係結構與頻率歸位，企業的卡點自然迎刃而解。",
      icon: "⚡"
    },
    {
      id: "03",
      title: "長效防護協議",
      desc: "不只是單次諮詢，我們提供全年度的頻率保護與結構優化。建立堅不可摧的個人與企業護城河。",
      icon: "🛡️"
    }
  ];

  return (
    <section id="services" className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-sm text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-4">Core Protocols</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-display">核心修復協議</h3>
          {/* 這裡加深為 slate-600 */}
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">精準定位問題根源，提供結構性的修復方案</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((srv) => (
            <div key={srv.id} className="bg-white rounded-xl p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border-t-4 border-[#D4AF37] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl mb-8 w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-[#D4AF37] border border-slate-100">
                {srv.icon}
              </div>
              
              <h4 className="text-xl font-bold text-slate-900 mb-4">{srv.title}</h4>
              {/* 這裡加深為 slate-700，保證好讀 */}
              <p className="text-slate-700 leading-relaxed mb-8 text-sm md:text-base text-justify font-medium">{srv.desc}</p>
              
              <button className="text-slate-900 font-bold tracking-wider hover:text-[#D4AF37] transition-colors flex items-center gap-2 text-sm uppercase">
                了解更多 <span className="text-lg">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
