import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

const AboutErickSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div id="about" className="py-ef-section bg-ef-paper font-sans">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* 左欄：直式圓角人物照片預留位置 */}
          <div className="lg:col-span-5">
            <motion.div
              initial={reduceMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              className="relative aspect-[3/4] w-full"
            >
              <motion.div
                variants={reduceMotion ? undefined : {
                  hidden: { clipPath: 'inset(100% 0 0 0)' },
                  visible: { clipPath: 'inset(0% 0 0 0)' },
                }}
                transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full overflow-hidden rounded-ef-card bg-ef-card shadow-[var(--ef-shadow-lift)]"
              >
                <motion.img
                  src="/erick-portrait-warm-v2.webp"
                  alt="Erick Firm 創辦人 Erick"
                  className="h-full w-full object-cover object-center"
                  variants={reduceMotion ? undefined : {
                    hidden: { scale: 1.04 },
                    visible: { scale: 1 },
                  }}
                  transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* 右欄：文字內容 */}
          <div className="lg:col-span-7">
            <Reveal direction="right">
            <h2 className="text-ef-section font-bold text-ef-ink mb-8 font-display">
              我不是來給你答案的人
            </h2>

            <div className="space-y-6 text-ef-text text-ef-lead font-light">
              <p>
                最早接觸的是生命數字。那時候我想弄懂一件事：為什麼有些人怎麼做都順，有些人怎麼做都卡？後來才明白，每個人都有自己的初始設定：你的思考慣性、你的行動節奏、你在關係裡會反覆出現的模式。
              </p>
              <p>
                再後來我開始看信息場。一件事情的發生，從來不是單一原因。情緒、關係、身體、環境一直在互相影響，只是平常我們只看得到最吵的那一個。
              </p>
              <p>
                累積了大量個案之後，我把同一套眼光帶進企業，才發現商業也一樣。一家公司看得見的是營運規劃、行銷、報表；看不見的是公司的氛圍、員工的情緒，還有目標與願景是不是真的一致。
              </p>
            </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutErickSection;
