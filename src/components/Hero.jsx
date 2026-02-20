import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-white">
      {/* 背景：乾淨的白色到極淺灰漸層 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
      
      {/* 背景：極簡的網格，象徵「制度與結構」 (改為淺色網格) */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#94A3B8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-left"
          >
            {/* Tag: 定義我們是做工程的，不是做療癒的 */}
            <div className="inline-block mb-8 px-4 py-2 border-l-2 border-[#D4AF37] bg-slate-50 shadow-sm">
              <span className="text-[#D4AF37] text-xs md:text-sm font-bold tracking-[0.3em] uppercase">
                RELATIONSHIP ENGINEERING
              </span>
            </div>

            {/* H1: 破題 —— 關係的錯位 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight font-sans text-slate-900">
              人生所有的卡點，
              <br />
              都是<span className="text-[#D4AF37]">「關係」</span>的錯位。
            </h1>

            {/* Sub: 正典宣言 —— 制度 > 情緒 */}
            <div className="border-l-2 border-slate-200 pl-6 mb-10">
              <p className="text-slate-800 text-xl md:text-2xl font-medium mb-4 tracking-wide">
                不是情緒問題，是結構問題。
              </p>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed text-justify max-w-lg">
                雞湯給你安慰，地圖給你路徑。<br />
                我們不提供短暫的撫慰，而是運用『交易成本』與『信息場分析』，為你重新設計商業與人生的治理結構。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={scrollToServices} 
                className="px-8 py-4 bg-slate-900 text-white rounded-sm font-bold text-lg hover:bg-[#D4AF37] hover:text-white transition-all duration-300 tracking-widest shadow-md"
              >
                查看修復協議
              </button>
            </div>
          </motion.div>

          {/* 右側視覺：秩序與結構的幾何圖形 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1 }} 
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              <div className="absolute inset-0 border border-slate-200 rounded-full opacity-50 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 border border-[#D4AF37]/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="https://horizons-cdn.hostinger.com/254fbb14-56d1-494d-abd4-71da2c76554a/erick3-l2Sqi.jpg" 
                  alt="Structure and Order" 
                  className="w-3/4 h-3/4 object-cover rounded-sm shadow-xl" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button 
        onClick={scrollToServices} 
        animate={{ y: [0, 10, 0] }} 
        transition={{ duration: 2, repeat: Infinity }} 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-slate-400 hover:text-[#D4AF37] transition-colors duration-300"
      >
        <ChevronDown size={30} />
      </motion.button>
    </section>
  );
};

export default Hero;
