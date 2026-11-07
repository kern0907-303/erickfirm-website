import React, { useEffect } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import './HeroTextReveal.css';

const LETTER_STAGGER = 0.04;
// 這些詞在標題裡固定不拆成兩行（例如「平衡空間」不會斷成「平衡空」和「間」）
const KEEP_TOGETHER = ['艾伯林量子調頻', '初八企業顧問', '平衡空間', '生命數字', '艾瑞克'];
const LETTER_DURATION = 0.6;

const HeroTextReveal = ({ title, subtitle, titleClassName = '', subtitleClassName = '' }) => {
  const reduceMotion = useReducedMotion();
  const titleControls = useAnimationControls();
  const subtitleControls = useAnimationControls();
  const letters = Array.from(title);
  // 把字分組：遇到標點就斷成一組，每組最後兩個字黏在一起，標題就不會有單獨一個字掉到下一行
  const groups = [];
  {
    let buffer = [];
    letters.forEach((letter, index) => {
      buffer.push({ letter, index });
      if (/[，。、！？：；,.!?]/.test(letter) || index === letters.length - 1) {
        groups.push(buffer);
        buffer = [];
      }
    });
  }
  // 不可在 i 和 i+1 之間換行的位置：受保護的詞內部，以及每組最後三個字之間
  const noBreakAfter = new Set();
  KEEP_TOGETHER.forEach((word) => {
    let from = title.indexOf(word);
    while (from !== -1) {
      const start = Array.from(title.slice(0, from)).length;
      const length = Array.from(word).length;
      for (let k = start; k < start + length - 1; k += 1) noBreakAfter.add(k);
      from = title.indexOf(word, from + word.length);
    }
  });
  groups.forEach((group) => {
    const tailStart = Math.max(0, group.length - 3);
    for (let k = tailStart; k < group.length - 1; k += 1) noBreakAfter.add(group[k].index);
  });
  const subtitleDelay = LETTER_DURATION + Math.max(0, letters.length - 1) * LETTER_STAGGER;

  useEffect(() => {
    if (reduceMotion !== false) {
      titleControls.stop();
      subtitleControls.stop();
      titleControls.set('visible');
      subtitleControls.set('visible');
      return;
    }

    titleControls.set('hidden');
    subtitleControls.set('hidden');
    titleControls.start('visible');
    subtitleControls.start('visible', { delay: subtitleDelay });
  }, [reduceMotion, subtitleControls, subtitleDelay, titleControls]);

  if (reduceMotion === true) {
    return (
      <>
        <h1 className={titleClassName}>{title}</h1>
        <p className={subtitleClassName}>{subtitle}</p>
      </>
    );
  }

  return (
    <>
      <h1 className={titleClassName}>
        <span className="sr-only">{title}</span>
        <motion.span
          aria-hidden="true"
          className="hero-text-reveal__visual"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: LETTER_STAGGER } },
          }}
          initial="visible"
          animate={titleControls}
        >
          {groups.map((group) => {
            const renderLetter = ({ letter, index }) => (
            <motion.span
              key={`${letter}-${index}`}
              className="hero-text-reveal__letter"
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: LETTER_DURATION, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {letter}
            </motion.span>
            );
            // 依可換行的位置切成小段；超過一個字的段落整段不換行
            const chunks = [];
            let chunk = [];
            group.forEach((item) => {
              chunk.push(item);
              if (!noBreakAfter.has(item.index)) {
                chunks.push(chunk);
                chunk = [];
              }
            });
            if (chunk.length) chunks.push(chunk);
            return (
              <React.Fragment key={'g' + group[0].index}>
                {chunks.map((part) => (part.length > 1
                  ? <span key={'c' + part[0].index} className="nowrap-tail">{part.map(renderLetter)}</span>
                  : renderLetter(part[0])))}
              </React.Fragment>
            );
          })}
        </motion.span>
      </h1>
      <motion.p
        className={subtitleClassName}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.45 } },
        }}
        initial="visible"
        animate={subtitleControls}
      >
        {subtitle}
      </motion.p>
    </>
  );
};

export default HeroTextReveal;
