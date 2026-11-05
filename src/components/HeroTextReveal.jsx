import React, { useEffect } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import './HeroTextReveal.css';

const LETTER_STAGGER = 0.04;
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
            const tailStart = Math.max(0, group.length - 3);
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
            return (
              <React.Fragment key={'g' + group[0].index}>
                {group.slice(0, tailStart).map(renderLetter)}
                <span className="nowrap-tail">{group.slice(tailStart).map(renderLetter)}</span>
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
