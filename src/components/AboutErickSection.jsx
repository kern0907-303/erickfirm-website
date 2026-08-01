import React from 'react';
import { LINE_CONFIG } from '../lib/constants';

const AboutErickSection = () => {
  return (
    <section className="py-24 bg-white font-sans">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* 左側形象簡介卡片 */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-surface p-8 md:p-10 border border-slate-200/80 shadow-md">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary/10 mb-6 border border-accent/30 p-1">
                <img
                  src="/logo.png"
                  alt="Erick 奧斯學長"
                  className="w-full h-full object-contain rounded-xl bg-white"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider mb-4 font-display">
                FOUNDER & PRINCIPAL CONSULTANT
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 font-display">
                Erick 營運長 <span className="text-sm font-normal text-slate-500 font-sans">（奧斯學長）</span>
              </h3>
              <p className="text-accent font-bold text-xs tracking-widest uppercase mb-6 font-display">
                Erick Firm 創辦人
              </p>

              <div className="space-y-3 text-sm text-slate-600 font-light border-t border-slate-200/80 pt-6">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>初八企業信息顧問 (I8) 主理人</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>平衡空間 (NAS) 生命數字創辦導師</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>艾伯林量子調頻 (ABL) 信息場分析顧問</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右側信念與對位內容 */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-slate-200 bg-surface text-xs font-bold tracking-widest text-slate-600 font-display">
              <span className="h-2 w-2 rounded-full bg-accent" />
              ABOUT ERICK
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 font-display leading-tight tracking-tight">
              「我不相信治標不治本的硬撐。
              <br />
              商業與人生所有的卡點，答案都在<span className="text-accent">底層結構</span>裡。」
            </h2>

            <p className="text-slate-700 text-base md:text-lg leading-relaxed mb-6 font-light">
              你好，我是 Erick（奧斯學長）。在多年的企業顧問諮詢與個人陪伴經驗中，我發現大部分人在面對瓶頸時，習慣用「加倍努力」、「提高意志力」或「急著換策略」來應對。但如果底層的運作結構本來就錯位，努力只會加速耗損。
            </p>

            <p className="text-slate-700 text-base md:text-lg leading-relaxed mb-8 font-light">
              Erick Firm 的創立，就是為了提供一套基於第一性原理的「結構對位系統」。我們結合企業營運診斷、生命數字天賦解析與 TimeWaver 信息場頻率調和，陪你看清並重組屬於你最不費力的高效能運行軌道。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={LINE_CONFIG.LINE_MESSAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-accent hover:text-slate-900 transition-all duration-300 text-center text-base cursor-pointer shadow-md hover:shadow-lg font-sans"
              >
                加 LINE 與 Erick 團隊聯繫 ➔
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutErickSection;
