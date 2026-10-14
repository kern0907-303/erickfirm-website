import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// 入場款式 B：標題一行一行從遮罩下推出，細線展開，卡片由下方升起並放大到定位。
// 開啟「減少動態效果」的人看到的是完整靜態內容。
const EXPO = [0.16, 1, 0.3, 1];

// 標題：lines 是已經斷好的每一行。rule 為 true 時，標題下方多一條展開的細線。
export const MaskHeading = ({ as: Tag = 'h2', lines, className = '', rule = false }) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div>
        <Tag className={className}>
          {lines.map((line) => <span key={line} className="block">{line}</span>)}
        </Tag>
        {rule && <div className="mt-6 h-0.5 w-[72px] bg-slate-900" />}
      </div>
    );
  }

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } };
  const line = { hidden: { y: '115%' }, visible: { y: '0%', transition: { duration: 1.05, ease: EXPO } } };
  const ruleVariant = { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.9, ease: EXPO, delay: 0.45 } } };

  return (
    <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
      <Tag className={className}>
        {lines.map((text) => (
          <span key={text} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <motion.span variants={line} className="inline-block">{text}</motion.span>
          </span>
        ))}
      </Tag>
      {rule && <motion.div variants={ruleVariant} className="mt-6 h-0.5 w-[72px] origin-left bg-slate-900" />}
    </motion.div>
  );
};

// 卡片群：放在 grid 外層，裡面每一張卡片用 CardRiseItem 包起來。
export const CardRise = ({ children, className = '' }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.16 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </motion.div>
  );
};

// 進場動畫放在外層，滑過浮起的效果放在裡面那張卡片，兩者才不會互相干擾。
export const CardRiseItem = ({ children, className = '' }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 72, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease: EXPO } },
      }}
    >
      {children}
    </motion.div>
  );
};
