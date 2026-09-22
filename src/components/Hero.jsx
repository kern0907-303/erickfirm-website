import React from 'react';
import { motion } from 'framer-motion';

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
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
