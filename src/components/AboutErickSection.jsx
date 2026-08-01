import React from 'react';

const AboutErickSection = () => {
  return (
    <section id="about" className="py-24 bg-white font-sans border-b border-slate-200/60">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* 左欄：直式圓角人物照片預留位置 */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-surface border border-slate-200/80 shadow-md flex flex-col items-center justify-center p-8 text-center group hover:border-accent/40 transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-slate-200/70 flex items-center justify-center mb-4 text-slate-400 text-3xl">
                👤
              </div>
              <p className="text-slate-500 font-bold text-sm mb-1 font-sans">
                請上傳 Erick 個人照
              </p>
              <p className="text-slate-400 text-xs font-mono">
                (預留直式比例相片位置 3:4)
              </p>
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
                我做這件事二十年了。前十年在企業裡看營運，後十年開始看人——看那些明明很努力、方法也對，卻始終跑不動的人身上到底發生了什麼。
              </p>
              <p>
                我發現一件事：多數卡住的狀況，問題都不在被討論的那個層次。公司說是行銷不夠，其實是交付卡住；一個人說自己不夠自律，其實是他的節奏從來沒有被真正安排過。
              </p>
              <p>
                所以我不太急著給建議。我會先陪你把結構看清楚，因為結構一旦對了，很多你以為要用力才能做到的事，會自己開始動。
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
