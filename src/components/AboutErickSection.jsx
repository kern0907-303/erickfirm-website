import React from 'react';

const AboutErickSection = () => {
  return (
    <section id="about" className="py-24 bg-white font-sans border-b border-slate-200/60">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* 左欄：直式圓角人物照片預留位置 */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-surface border border-slate-200/80 shadow-md group hover:border-accent/40 transition-all duration-300">
              <img
                src="/erick-portrait-purple.png"
                alt="Erick Firm 創辦人 Erick"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* 右欄：文字內容 */}
          <div className="lg:col-span-7">
            {/* 小標 */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-slate-200 bg-surface text-xs font-bold tracking-[0.2em] text-slate-600 font-display shadow-sm">
              <span className="h-2 w-2 rounded-full bg-accent" />
              ABOUT
            </div>

            {/* 主標題 */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 font-display tracking-tight leading-tight">
              我不是來給你答案的人
            </h2>

            {/* 內文三段 */}
            <div className="space-y-6 text-slate-700 text-base md:text-lg leading-relaxed font-light">
              <p>
                我做這件事二十年了，順序是這樣的。
              </p>
              <p>
                最早接觸的是生命數字。那時候我想弄懂一件事：為什麼有些人怎麼做都順，有些人怎麼做都卡？後來才明白，每個人都有自己的初始設定——你的思考慣性、你的行動節奏、你在關係裡會反覆出現的模式。看懂自己的定位之後，很多「我是不是哪裡有問題」的自我懷疑，會先停下來。
              </p>
              <p>
                再後來我開始看信息場。生命數字給的是一個人的內建設定，信息場給的是一張更完整的圖：一件事情的發生，從來不是單一原因。情緒、關係、身體、環境一直在互相影響，只是平常我們只看得到最吵的那一個。
              </p>
              <p>
                我發現一件事：多數卡住的狀況，問題都不在被討論的那個層次。公司說是行銷不夠，其實是交付卡住；一個人說自己不夠自律，其實是他的節奏從來沒有被真正安排過。
              </p>
              <p>
                累積了大量個案之後，我把同一套眼光帶進企業，才發現商業也一樣。一家公司看得見的是營運規劃、行銷、報表；看不見的是公司的氛圍、員工的情緒、目標與願景是不是真的一致。這些隱態的部分，才是一家企業能不能獲利、能不能走遠的關鍵。
              </p>
              <p>
                所以我不太急著給建議。我會先陪你把結構看清楚，不管你是一個人，還是一家公司。因為結構一旦對了，很多你以為要用力才能做到的事，會自己開始動。
              </p>
            </div>

            {/* 署名 */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <p className="text-slate-900 font-extrabold text-lg md:text-xl font-display">
                Erick｜<span className="text-slate-600 font-medium">Erick Firm 創辦人</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutErickSection;
