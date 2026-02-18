import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Zap, Briefcase, ExternalLink } from 'lucide-react';

const Services = () => {
  const protocols = [
    {
      step: "01",
      id: "NAS",
      name: "NAS | 生命導航",
      relation: "治理「你與自己的關係」",
      desc: "輸入生日，解碼你的原廠設定。這不是算命，這是確認你的天賦參數，停止內耗。",
      icon: Compass,
      action: "啟動原廠檢測",
      link: "https://lifeos-site.netlify.app/", // 連結 A：NAS 工具站
      target: "_blank" // 開新視窗
    },
    {
      step: "02",
      id: "Initial8",
      name: "初八 | 商業診斷",
      relation: "治理「你與世界的關係」",
      desc: "填寫結構問卷，掃描企業隱形風險。找出那些讓你也許很努力，卻依然卡關的制度性漏洞。",
      icon: Briefcase,
      action: "開始企業體質掃描",
      link: "https://business-doctor-tw.netlify.app/", // 連結 B：初八問卷站 (選定這個)
      target: "_blank" // 開新視窗
    },
    {
      step: "03",
      id: "Abliene",
      name: "艾伯林 | 頻率調頻",
      relation: "治理「你與環境的關係」",
      desc: "環境充滿雜訊。當你的頻率混濁，發出的訊號也會扭曲。預約 TimeWaver 為你清理背景雜訊。",
      icon: Zap,
      action: "預約頻率諮詢",
      link: "#contact", // 暫時導向頁尾表單，因為艾伯林尚未有獨立工具站
      target: "_self" // 原地捲動
    }
  ];

  return (
    <section id="services" className="py-32 bg-[#121212] relative overflow-hidden">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 max-w-3xl">
          <h2 className="text-sm font-bold text-[#D4AF37] tracking-[0.3em] uppercase mb-4">
            THE PROTOCOL
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            一套修復關係的<br/>
            <span className="text-[#00F0FF]">系統工程</span>
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed">
            我們不解決表面的症狀，我們修復底層的連結。<br/>
            從內在原廠設定，到外在商業契約，按順序重建你的生活秩序。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* 連接線 (僅在電腦版顯示) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/30 to-[#D4AF37]/0 z-0" />

          {protocols.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group bg-[#181818] border border-[#333] p-8 pt-12 rounded-sm hover:border-[#D4AF37]/50 transition-all duration-500 flex flex-col"
            >
              {/* 背景大數字水印 */}
              <div className="absolute top-2 right-4 text-8xl font-bold text-[#222] group-hover:text-[#2A2A2A] transition-colors select-none z-0">
                {item.step}
              </div>

              <div className="relative z-10 flex-grow">
                {/* Icon */}
                <div className="w-12 h-12 bg-[#121212] border border-[#D4AF37]/30 flex items-center justify-center mb-8 group-hover:border-[#00F0FF]/50 transition-colors">
                  <item.icon className="text-[#D4AF37] w-6 h-6 group-hover:text-[#00F0FF] transition-colors" />
                </div>

                {/* 關係定義 */}
                <div className="text-[#00F0FF] text-xs font-bold tracking-widest uppercase mb-2">
                  {item.relation}
                </div>

                {/* 品牌名 */}
                <h4 className="text-2xl font-bold text-white mb-1">
                  {item.name}
                </h4>

                {/* 描述 */}
                <p className="text-gray-400 text-sm leading-7 text-justify mt-4">
                  {item.desc}
                </p>
              </div>

              {/* 按鈕區域：固定在底部 */}
              <div className="mt-8 pt-6 border-t border-[#333] group-hover:border-[#D4AF37]/30 transition-colors">
                <a 
                  href={item.link} 
                  target={item.target}
                  rel="noopener noreferrer"
                  className="w-full py-3 border border-[#D4AF37] text-[#D4AF37] font-bold text-sm uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-all duration-300 rounded-sm flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  {item.action}
                  {item.target === "_blank" && <ExternalLink size={16} />}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;