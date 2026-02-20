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
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-sm text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-3">Core Protocols</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-display">核心修復協議</h3>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((srv) => (
            <div key={srv.id} className="group bg-white rounded-2xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
              {/* 背景大數字浮水印 (極淺灰) */}
              <div className="absolute -right-4 -top-8 text-8xl font-black text-slate-50 pointer-events-none group-hover:text-[#D4AF37]/5 transition-colors">
                {srv.id}
              </div>
              
              <div className="text-4xl mb-6 bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center border border-slate-100 text-[#D4AF37]">
                {srv.icon}
              </div>
              
              <h4 className="text-2xl font-bold text-slate-900 mb-4">{srv.title}</h4>
              <p className="text-slate-600 leading-relaxed mb-8 text-justify">{srv.desc}</p>
              
              <button className="text-[#D4AF37] font-bold tracking-wider hover:text-slate-900 transition-colors flex items-center gap-2 text-sm uppercase">
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
