import React from 'react';
import { motion } from 'framer-motion';
import { Target, Cpu, GitMerge } from 'lucide-react';

// Erick's new professional image in business attire at a desk with computer and cityscape background with neon lights
const profileImg = "https://horizons-cdn.hostinger.com/254fbb14-56d1-494d-abd4-71da2c76554a/d0e66bf697312968d36415224f878a1f.jpg";

const About = () => {
  return (
    <section id="about" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* 背景裝飾光 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* 左側：照片區 (Image) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* 裝飾框線 */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[#D4AF37]" />
            
            {/* 照片本體 */}
            <div className="relative rounded-sm overflow-hidden border border-[#333] group">
              <img 
                src={profileImg} 
                alt="Erick in a business suit at a desk with a computer, overlooking a cityscape with neon lights" 
                className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              />
              {/* 掃描線效果 (Scanline) */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F0FF]/5 to-transparent opacity-0 group-hover:opacity-100 bg-[length:100%_4px] animate-scan pointer-events-none" />
            </div>
          </motion.div>

          {/* 右側：文字區 (Text) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-[#D4AF37] text-sm font-bold tracking-[0.3em] uppercase mb-4">
              WHO IS ERICK
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              我不看你的運氣<br />
              我看你的<span className="text-[#00F0FF]">結構參數</span>
            </h3>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-8 text-justify">
              大多數的痛苦，不是因為你不夠努力，而是因為你試圖用錯誤的結構，去運作原本完美的能量。
              <br/><br/>
              作為一名關係結構工程師，我結合了 <b>NAS 生命數字</b> 的原廠設定分析，與 <b>Initial8</b> 的商業邏輯診斷。
              我不提供心靈雞湯，我只負責把你的系統「Bug」抓出來，並重新編譯。
            </p>

            {/* 核心能力圖標 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Target, title: "精準歸因", desc: "鎖定問題根源" },
                { icon: Cpu, title: "結構重組", desc: "優化底層邏輯" },
                { icon: GitMerge, title: "頻率對齊", desc: "消除背景雜訊" }
              ].map((item, index) => (
                <div key={index} className="flex flex-col gap-2 p-4 bg-[#121212] border border-[#222] rounded-sm hover:border-[#D4AF37]/30 transition-colors">
                  <item.icon className="text-[#00F0FF] w-6 h-6 mb-1" />
                  <h4 className="text-white font-bold text-sm">{item.title}</h4>
                  <p className="text-[#666] text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;