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
    <section className="erick-hero relative flex min-h-[80svh] items-center overflow-hidden pt-28 pb-16 sm:min-h-[82svh] md:min-h-[86svh] md:pb-20">
      <div className="erick-hero__glow erick-hero__glow--one" aria-hidden="true" />
      <div className="erick-hero__glow erick-hero__glow--two" aria-hidden="true" />
      <div className="erick-hero__glow erick-hero__glow--three" aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          {/* 斷行保護：nowrap-tail 讓「不夠努力。」「影響結果的因素。」整組換行，手機不會只掉一兩個字 */}
          <h1 className="text-ef-display font-bold text-ef-ink">
            <motion.span {...enter(0.12)} className="block">
              事情卡住，
              <br />
              通常不是因為你<span className="nowrap-tail">不夠努力。</span>
            </motion.span>
            <motion.span {...enter(0.36)} className="mt-8 block md:mt-10">
              是還沒看見，
              <br />
              那個一直在<span className="nowrap-tail">影響結果的因素。</span>
            </motion.span>
          </h1>
        </div>
      </div>

      <motion.div
        {...enter(0.8)}
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center md:bottom-7"
        aria-hidden="true"
      >
        <span className="erick-scroll-line block h-10 w-px bg-ef-muted" />
      </motion.div>
    </section>
  );
};

export default Hero;
