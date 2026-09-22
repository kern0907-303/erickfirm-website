import React from 'react';

const AboutErickSection = () => {
  return (
    <div id="about" className="py-20 bg-white font-sans md:py-28">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* 左欄：直式圓角人物照片預留位置 */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-surface border border-slate-200/80 shadow-md group hover:border-accent/40 transition-all duration-300">
              <img
                src="/erick-portrait-warm-v2.webp"
                alt="Erick Firm 創辦人 Erick"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* 右欄：文字內容 */}
          <div className="lg:col-span-7">
            <p className="mb-5 text-xs tracking-[0.22em] text-slate-500">ABOUT ERICK</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 font-display tracking-tight leading-tight">
              我不是來給你答案的人
            </h2>

            <div className="space-y-6 text-slate-700 text-base md:text-lg leading-relaxed font-light">
              <p>
                最早接觸的是生命數字。那時候我想弄懂一件事：為什麼有些人怎麼做都順，有些人怎麼做都卡？後來才明白，每個人都有自己的初始設定——你的思考慣性、你的行動節奏、你在關係裡會反覆出現的模式。
              </p>
              <p>
                再後來我開始看信息場。一件事情的發生，從來不是單一原因。情緒、關係、身體、環境一直在互相影響，只是平常我們只看得到最吵的那一個。
              </p>
              <p>
                累積了大量個案之後，我把同一套眼光帶進企業，才發現商業也一樣。一家公司看得見的是營運規劃、行銷、報表；看不見的是公司的氛圍、員工的情緒，還有目標與願景是不是真的一致。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutErickSection;
