import React from 'react';
import { LINE_CONFIG } from '../lib/constants';

const lineButtonClass = 'inline-flex items-center gap-3 bg-slate-900 px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-slate-700';

export const PhilosophySection = () => (
  <section className="bg-white py-20 md:py-28">
    <div className="container mx-auto max-w-3xl px-6">
      <div className="border-l border-slate-300 pl-6 md:pl-10 text-xl md:text-3xl leading-[1.9] text-slate-800">
        <p>二十年來，<br />我在三個很不一樣的地方，做同一件事。</p>
        <p className="mt-8">一個人對自己的理解。<br />一個人的狀態。<br />一間公司的決策。</p>
        <p className="mt-8">方法不同，<br />要找的東西是同一個——<br />那個一直在影響結果，卻一直沒被看見的因素。</p>
      </div>
    </div>
  </section>
);

export const WhyStuckSection = () => (
  <section className="bg-[#f7f6f2] py-20 md:py-28">
    <div className="container mx-auto max-w-6xl px-6">
      <div className="max-w-3xl">
        <p className="text-xs tracking-[0.22em] text-slate-500 mb-5">WHY WE GET STUCK</p>
        <p className="text-2xl md:text-4xl leading-[1.7] text-slate-900">再試一次。再撐一下。再多做一點。</p>
        <p className="mt-8 text-base md:text-lg leading-loose text-slate-600">多數人卡住的時候，第一個反應都是更用力。<br />但我看了二十年，很少有人是輸在不夠用力。</p>
        <p className="mt-7 text-base md:text-lg leading-loose text-slate-600">問題通常不在被討論的那一層。</p>
      </div>
      <div className="mt-14 grid border-y border-slate-300 md:grid-cols-3">
        <p className="py-7 pr-0 text-base leading-loose text-slate-700 md:pr-8">公司說是行銷不夠，其實是交付卡住。</p>
        <p className="border-t border-slate-300 py-7 text-base leading-loose text-slate-700 md:border-l md:border-t-0 md:px-8">一個人說自己不夠自律，其實是他的節奏從來沒有被好好安排過。</p>
        <p className="border-t border-slate-300 py-7 pl-0 text-base leading-loose text-slate-700 md:border-l md:border-t-0 md:pl-8">一段合作說是溝通問題，其實是兩個人用完全不同的方式，在理解同一件事。</p>
      </div>
      <p className="mt-12 text-xl md:text-3xl leading-relaxed text-slate-900">最吵的那個問題，<br />通常不是最關鍵的那一個。</p>
    </div>
  </section>
);

const stuckTypes = [
  ['工作卡住', '公司越來越忙，事情卻越來越慢。\n會議開了很多次，決定反覆在改。\n你知道哪裡不對，只是說不出來是哪裡。'],
  ['定位卡住', '你很努力，也不是沒有能力。\n只是心裡一直有個聲音在問：這條路，真的是我的嗎？\n換過方向、換過工作，最後好像又回到同一個地方。'],
  ['自己卡住', '你一直是那個撐住的人。\n撐著工作、撐著家人，也撐著所有人的情緒。\n等到終於有時間留給自己，卻發現——\n已經不知道怎麼回到自己了。'],
];

export const StuckTypesSection = () => (
  <section className="bg-white py-20 md:py-28">
    <div className="container mx-auto max-w-7xl px-6">
      <h2 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900">事情卡住，大概有三種樣子</h2>
      <div className="mt-12 grid gap-px overflow-hidden border border-slate-300 bg-slate-300 md:grid-cols-3">
        {stuckTypes.map(([title, body]) => (
          <article key={title} className="min-h-[250px] bg-white p-7 md:p-9">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="mt-7 whitespace-pre-line text-base leading-loose text-slate-600">{body}</p>
          </article>
        ))}
      </div>
      <p className="mt-10 text-base leading-loose text-slate-600">你可能是其中一種，也可能三種都有一點。<br />先別急著判斷，往下看。</p>
    </div>
  </section>
);

export const AnalysisSection = () => (
  <section className="bg-[#ece9e1] py-20 md:py-28">
    <div className="container mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
      <div className="mx-auto w-full max-w-[464px] overflow-hidden border border-slate-300 bg-slate-900 shadow-[0_20px_50px_rgba(31,26,46,0.12)]">
        <video
          className="block aspect-[9/16] w-full bg-slate-900"
          controls
          playsInline
          preload="metadata"
          poster="/media/erick-introduction-poster.jpg"
        >
          <source src="/media/erick-introduction.mp4" type="video/mp4" />
          <track kind="captions" srcLang="zh-Hant" label="繁體中文" src="/media/erick-introduction.vtt" default />
          你的瀏覽器不支援影片播放。
        </video>
      </div>
      <div>
        <p className="text-xs font-medium tracking-[0.22em] text-slate-500">A NOTE FROM ERICK</p>
        <h2 className="mt-5 text-3xl md:text-5xl font-bold leading-tight text-slate-900">你不是來聽更多道理的。<br />你是想知道，現在該怎麼辦。</h2>
        <p className="mt-7 text-base md:text-lg leading-loose text-slate-600">二十年來，我反覆做同一件事：先找出真正影響結果的問題。看清楚卡住的位置，才不會把力氣花在最吵、卻不關鍵的地方。</p>
        <p className="mt-7 text-base leading-loose text-slate-600">如果這段話剛好說中了你現在的狀態，加入 LINE 回答 4 個問題；我們會先從你目前最值得處理的地方開始。</p>
        <a href={LINE_CONFIG.LINE_MESSAGE_URL} target="_blank" rel="noopener noreferrer" className={`${lineButtonClass} mt-10`}>
          加 LINE，回答 4 個問題 →
        </a>
      </div>
    </div>
  </section>
);

export const ClaritySection = () => (
  <section className="bg-white py-20 md:py-28">
    <div className="container mx-auto max-w-3xl px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900">先說清楚的幾件事</h2>
      <div className="mt-9 space-y-7 text-sm md:text-base leading-loose text-slate-600">
        <p>我不做醫療診斷，也不取代醫師或心理治療。<br />如果你正在接受治療，請繼續和你的醫師合作。</p>
        <p>我不保證結果。<br />我能做的，是陪你看清楚，然後一起找出下一步。</p>
        <p>如果我判斷你現在需要的不是我，<br />我會直接告訴你。</p>
      </div>
    </div>
  </section>
);

export const ClosingSection = () => (
  <section className="bg-[#f7f6f2] py-20 md:py-28">
    <div className="container mx-auto max-w-3xl px-6">
      <p className="text-xs tracking-[0.22em] text-slate-500">WRITING AT THE END</p>
      <h2 className="mt-6 text-3xl md:text-5xl font-bold leading-[1.7] text-slate-900">寫在最後</h2>
      <div className="mt-10 text-xl md:text-2xl leading-[1.9] text-slate-800">
        <p>你來，不是為了再聽更多道理，<br />而是想知道，現在該怎麼辦。</p>
        <p className="mt-7">不管你是一個人，還是一家公司，<br />我會先陪你看清楚：<br />眼前的問題是什麼，<br />背後反覆出現的模式又是什麼。</p>
        <p className="mt-7">把真正卡住的位置找出來，<br />才能給你現在最該做的下一步。</p>
      </div>
      <p className="mt-10 text-base text-slate-600">— 艾瑞克 Erick</p>
      <a href={LINE_CONFIG.LINE_MESSAGE_URL} target="_blank" rel="noopener noreferrer" className={`${lineButtonClass} mt-10`}>
        加 LINE，4 題找出你卡在哪 →
      </a>
    </div>
  </section>
);
