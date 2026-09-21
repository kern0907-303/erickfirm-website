import React from 'react';
import { motion } from 'framer-motion';
import { LINE_CONFIG } from '../lib/constants';

const Hero = () => {
  return (
    <section className="min-h-[92vh] flex items-center bg-[#f7f6f2] pt-28 pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-xs tracking-[0.24em] text-slate-500 mb-8 font-medium">ERICK FIRM</p>
          <h1 className="text-[2.45rem] sm:text-5xl md:text-6xl font-bold leading-[1.42] text-slate-900 mb-10 tracking-tight">
            事情卡住，
            <br />
            通常不是因為你不夠努力。
            <br />
            <br />
            是還沒看見，
            <br />
            那個一直在影響結果的因素。
          </h1>
          <div>
            <a
              href={LINE_CONFIG.LINE_MESSAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-slate-900 px-6 py-4 text-white text-sm font-bold transition-colors hover:bg-slate-700"
            >
              加 LINE，4 題找出你卡在哪 →
            </a>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">免費領取《事情卡住的三種樣子》初步卡點分析</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
