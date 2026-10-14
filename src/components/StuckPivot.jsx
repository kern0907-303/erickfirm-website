import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// 捲動推進款式 D：動畫跟著捲動走，往回捲會倒放。
// 文案維持首頁「為什麼會卡住」原本那一段，只改成跟著捲動一步步出現：
// 先劃掉三個「再…」，接著出現說明，最後浮現結論。
// 桌機畫面釘住，手機不釘住改成進入畫面時依序播放，開啟「減少動態效果」的人看到完整靜態版。
const OLD_LINES = ['再試一次。', '再撐一下。', '再多做一點。'];
const EXPLAIN = ['多數人卡住的時候，第一個反應都是更用力。', '但我看了二十年，很少有人是輸在不夠用力。'];
const CONCLUSION = '問題通常不在被討論的那一層。';
const EXPO = [0.16, 1, 0.3, 1];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return isDesktop;
}

const Eyebrow = () => <p className="mb-6 text-xs tracking-[0.22em] text-slate-500">WHY WE GET STUCK</p>;

// 劃掉的細線：寬度由 progress 決定
const StrikeLine = ({ progress }) => (
  <motion.span
    aria-hidden="true"
    className="absolute left-0 right-0 top-[58%] h-[2px] origin-left bg-slate-900"
    style={{ scaleX: progress }}
  />
);

// 減少動態效果：完整靜態版
const StaticVersion = () => (
  <div className="max-w-3xl">
    <Eyebrow />
    <p className="text-2xl leading-[1.7] text-slate-400 md:text-4xl">
      {OLD_LINES.map((line) => <span key={line} className="mr-3 inline-block line-through">{line}</span>)}
    </p>
    <p className="mt-8 text-base leading-loose text-slate-600 md:text-lg">
      {EXPLAIN[0]}<br />{EXPLAIN[1]}
    </p>
    <p className="mt-7 text-2xl font-bold leading-[1.6] text-slate-900 md:text-4xl">{CONCLUSION}</p>
  </div>
);

// 手機：不釘住，進入畫面依序播放
const MobileVersion = () => {
  const strike = (i) => ({
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.7, ease: EXPO, delay: 0.5 + i * 0.35 } },
  });
  return (
    <motion.div
      className="max-w-3xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={{ hidden: {}, visible: {} }}
    >
      <Eyebrow />
      <div className="space-y-2 text-2xl leading-[1.5] text-slate-900">
        {OLD_LINES.map((line, i) => (
          <p key={line} className="relative inline-block w-full">
            <span className="relative inline-block">
              {line}
              <motion.span aria-hidden="true" variants={strike(i)} className="absolute left-0 right-0 top-[58%] h-[2px] origin-left bg-slate-900" />
            </span>
          </p>
        ))}
      </div>
      <motion.p
        className="mt-8 text-base leading-loose text-slate-600"
        variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EXPO, delay: 1.7 } } }}
      >
        {EXPLAIN[0]}<br />{EXPLAIN[1]}
      </motion.p>
      <motion.p
        className="mt-7 text-2xl font-bold leading-[1.6] text-slate-900"
        variants={{ hidden: { opacity: 0, y: 48 }, visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EXPO, delay: 2.2 } } }}
      >
        {CONCLUSION}
      </motion.p>
    </motion.div>
  );
};

// 桌機：釘住畫面，動畫由捲動進度驅動
const DesktopVersion = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88px', 'end end'] });

  const s1 = useTransform(scrollYProgress, [0.04, 0.22], [0, 1]);
  const s2 = useTransform(scrollYProgress, [0.16, 0.34], [0, 1]);
  const s3 = useTransform(scrollYProgress, [0.28, 0.46], [0, 1]);
  const oldOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0.3]);
  const explainOpacity = useTransform(scrollYProgress, [0.42, 0.58], [0, 1]);
  const explainY = useTransform(scrollYProgress, [0.42, 0.58], [24, 0]);
  const conclusionOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);
  const conclusionY = useTransform(scrollYProgress, [0.6, 0.85], [56, 0]);
  const conclusionBlur = useTransform(scrollYProgress, [0.6, 0.85], ['blur(10px)', 'blur(0px)']);
  const progressBar = scrollYProgress;
  const strikes = [s1, s2, s3];

  return (
    <div ref={ref} className="relative h-[250vh]">
      <div className="sticky top-[88px] h-[calc(100vh-112px)] min-h-[480px]">
        <div className="relative grid h-full place-content-center gap-3 overflow-hidden rounded-[28px] bg-[#e5eae7] px-8 text-center">
          <Eyebrow />
          <motion.div style={{ opacity: oldOpacity }} className="grid gap-2">
            {OLD_LINES.map((line, i) => (
              <p key={line} className="text-3xl leading-[1.5] text-slate-900 md:text-5xl">
                <span className="relative inline-block">
                  {line}
                  <StrikeLine progress={strikes[i]} />
                </span>
              </p>
            ))}
          </motion.div>
          <motion.p style={{ opacity: explainOpacity, y: explainY }} className="mx-auto mt-6 max-w-2xl text-base leading-loose text-slate-600 md:text-lg">
            {EXPLAIN[0]}<br />{EXPLAIN[1]}
          </motion.p>
          <motion.p
            style={{ opacity: conclusionOpacity, y: conclusionY, filter: conclusionBlur }}
            className="mt-4 text-3xl font-bold leading-[1.5] text-slate-900 md:text-5xl"
          >
            {CONCLUSION}
          </motion.p>
          <div className="absolute bottom-6 left-8 right-8 h-[3px] overflow-hidden rounded-full bg-slate-300/70">
            <motion.i className="block h-full origin-left bg-slate-900" style={{ scaleX: progressBar }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StuckPivot = () => {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  if (reduceMotion) return <StaticVersion />;
  return isDesktop ? <DesktopVersion /> : <MobileVersion />;
};

export default StuckPivot;
