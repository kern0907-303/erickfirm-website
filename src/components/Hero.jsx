import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const Hero = () => {
  const reduceMotion = useReducedMotion();
  const enter = (delay) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section className="erick-hero relative flex min-h-[80svh] items-center overflow-hidden pt-28 pb-16 sm:min-h-[82svh] md:min-h-[86vh] md:pb-20">
      <div className="erick-hero__glow erick-hero__glow--one" aria-hidden="true" />
      <div className="erick-hero__glow erick-hero__glow--two" aria-hidden="true" />
      <div className="erick-hero__glow erick-hero__glow--three" aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <motion.p {...enter(0.05)} className="mb-8 text-xs font-medium tracking-[0.24em] text-slate-500">
            ERICK FIRM
          </motion.p>
          <h1 className="text-[2.25rem] font-bold leading-[1.42] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <motion.span {...enter(0.18)} className="block">
              事情卡住，
              <br />
              通常不是因為你不夠努力。
            </motion.span>
            <motion.span {...enter(0.42)} className="mt-8 block md:mt-10">
              是還沒看見，
              <br />
              那個一直在影響結果的因素。
            </motion.span>
          </h1>
        </div>
      </div>

      <motion.div
        {...enter(0.8)}
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.2em] text-slate-500 md:bottom-7"
        aria-hidden="true"
      >
        <span>SCROLL</span>
        <span className="erick-scroll-line block h-8 w-px bg-slate-400/70" />
      </motion.div>
    </section>
  );
};

export default Hero;
