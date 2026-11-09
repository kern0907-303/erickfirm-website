import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LINE_CONFIG } from '../lib/constants';
import Reveal from './Reveal';
import StuckPivot from './StuckPivot';
import { CardRise, CardRiseItem, MaskHeading } from './Motion';

const lineButtonClass = 'ef-btn ef-btn--ink';

export const PhilosophySection = () => (
  <section className="bg-ef-cream py-ef-section">
    <div className="container mx-auto max-w-3xl px-6">
      <Reveal className="border-l border-ef-line pl-6 text-ef-statement text-ef-body md:pl-10">
        <p>二十年來，<br />我在三個很不一樣的地方，<span className="nowrap-tail">做同一件事。</span></p>
        <p className="mt-8">一個人對自己的理解。<br />一個人的狀態。<br />一間公司的決策。</p>
        <p className="mt-8">方法不同，<br />要找的東西是同一個：<br />那個一直在影響結果，<span className="nowrap-tail">卻一直沒被看見的因素。</span></p>
      </Reveal>
    </div>
  </section>
);

export const WhyStuckSection = () => (
  <section className="bg-ef-sage py-ef-section">
    <div className="container mx-auto max-w-6xl px-6">
      <StuckPivot />
      <Reveal delay={0.08} className="mt-14 grid border-y border-ef-line md:grid-cols-3">
        <p className="py-7 pr-0 text-ef-copy text-ef-text md:pr-8">公司說是行銷不夠，其實是交付卡住。</p>
        <p className="border-t border-ef-line py-7 text-ef-copy text-ef-text md:border-l md:border-t-0 md:px-8">一個人說自己不夠自律，其實是他的節奏從來沒有被好好安排過。</p>
        <p className="border-t border-ef-line py-7 pl-0 text-ef-copy text-ef-text md:border-l md:border-t-0 md:pl-8">一段合作說是溝通問題，其實是兩個人用完全不同的方式，在理解同一件事。</p>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-12 text-ef-statement text-ef-ink">最吵的那個問題，<br />通常不是最關鍵的那一個。</p>
        <p className="mt-9 text-sm">
          <Link to="/about" className="font-medium text-ef-text underline decoration-ef-muted underline-offset-4 transition-colors hover:text-ef-ink">
            想知道我是怎麼走到這裡的？
          </Link>
        </p>
      </Reveal>
    </div>
  </section>
);

const stuckTypes = [
  ['組織卡住', '你承擔一個團隊、部門或事業的結果。\n人越來越忙，事情卻越來越慢。\n你知道哪裡不對，只是說不出來是哪裡。'],
  ['定位卡住', '你很努力，也不是沒有能力。\n只是心裡一直有個聲音在問：這條路，真的是我的嗎？\n換過方向、換過工作，最後好像又回到同一個地方。'],
  ['自己卡住', '你一直是那個撐住的人。\n撐著工作、撐著家人，也撐著所有人的情緒。\n等到終於有時間留給自己，卻發現，\n已經不知道怎麼回到自己了。'],
];

export const StuckTypesSection = () => (
  <section className="bg-ef-paper py-ef-section">
    <div className="container mx-auto max-w-7xl px-6">
      <MaskHeading
        lines={['事情卡住，', '大概有三種樣子']}
        className="text-ef-section font-bold text-ef-ink"
        rule
      />
      <CardRise className="mt-12 grid gap-5 md:grid-cols-3">
        {stuckTypes.map(([title, body]) => (
          <CardRiseItem key={title} className="h-full">
            <article className="card-soft h-full min-h-[250px] bg-ef-card p-7 md:p-9">
              <h3 className="text-ef-title font-bold text-ef-ink">{title}</h3>
              <p className="mt-6 whitespace-pre-line text-ef-copy text-ef-muted">{body}</p>
            </article>
          </CardRiseItem>
        ))}
      </CardRise>
      <Reveal delay={0.1}><p className="mt-10 text-ef-copy text-ef-muted">你可能是其中一種，也可能三種都有一點。<br />先別急著判斷，往下看。</p></Reveal>
    </div>
  </section>
);

export const AnalysisSection = () => (
  <section className="bg-ef-sand py-ef-section">
    <div className="container mx-auto grid max-w-5xl gap-x-14 gap-y-9 px-6 md:grid-cols-[360px_minmax(0,1fr)] md:items-center">
      <Reveal direction="left" className="order-2 mx-auto w-full max-w-[260px] sm:max-w-[300px] md:order-1 md:max-w-[360px]">
      <figure>
        <div className="overflow-hidden rounded-ef-card bg-ef-ink shadow-[var(--ef-shadow-lift)]">
          <video
            className="block aspect-[9/16] w-full bg-ef-ink"
            controls
            playsInline
            preload="metadata"
            poster="/media/erick-introduction-poster.jpg"
            aria-label="艾瑞克談如何找出真正影響結果的問題"
          >
            <source src="/media/erick-introduction.mp4" type="video/mp4" />
            <track kind="captions" srcLang="zh-Hant" label="繁體中文" src="/media/erick-introduction.vtt" default />
            你的瀏覽器不支援影片播放。
          </video>
        </div>
        <figcaption className="mt-3 text-center text-ef-small text-ef-muted">46 秒｜開啟聲音播放</figcaption>
      </figure>
      </Reveal>
      <div className="contents md:order-2 md:block">
        <Reveal direction="right" className="order-1">
          <h2 className="text-ef-section font-bold text-ef-ink">你不是來聽更多道理的。<br />你是想知道，<span className="nowrap-tail">現在該怎麼辦。</span></h2>
          <p className="mt-7 text-ef-lead text-ef-muted">二十年來，我反覆做同一件事：先找出真正影響結果的問題。看清楚卡住的位置，才不會把力氣花在最吵、卻不關鍵的地方。</p>
        </Reveal>
        <Reveal direction="right" delay={0.1} className="order-3 md:mt-8">
          <p className="text-ef-copy text-ef-muted">如果這段話剛好說中了你現在的狀態，加入 LINE 告訴我們目前卡住的地方；我們會先從最適合你的方向開始。</p>
        </Reveal>
      </div>
    </div>
  </section>
);

export const ClaritySection = () => (
  <section className="bg-ef-paper py-ef-section">
    <div className="container mx-auto max-w-3xl px-6">
      <Reveal>
      <h2 className="text-ef-section font-bold text-ef-ink">先說清楚的幾件事</h2>
      <div className="mt-9 space-y-7 text-ef-copy text-ef-muted">
        <p>我不做醫療診斷，也不取代醫師或心理治療。<br />如果你正在接受治療，請繼續和你的醫師合作。</p>
        <p>我不保證結果。<br />我能做的，是陪你看清楚，然後一起找出下一步。</p>
        <p>如果我判斷你現在需要的不是我，<br />我會直接告訴你。</p>
      </div>
      </Reveal>
    </div>
  </section>
);

export const ClosingSection = () => (
  <section className="bg-ef-warm py-ef-section">
    <div className="container mx-auto max-w-3xl px-6">
      <Reveal>
      <h2 className="text-ef-section font-bold text-ef-ink">寫在最後</h2>
      <div className="mt-10 text-ef-statement text-ef-body">
        <p>你來，不是為了再聽更多道理，<br />而是想知道，現在該怎麼辦。</p>
        <p className="mt-7">不管你是一個人，還是一家公司，<br />我會先陪你看清楚：<br />眼前的問題是什麼，<br />背後反覆出現的模式又是什麼。</p>
        <p className="mt-7">把真正卡住的位置找出來，<br />才能給你現在最該做的下一步。</p>
      </div>
      <p className="mt-10 text-ef-copy text-ef-muted">艾瑞克 Erick</p>
      <a href={LINE_CONFIG.LINE_ADD_URL} target="_blank" rel="noopener noreferrer" className={`${lineButtonClass} mt-10`}>
        加 LINE，找到適合你的方向
        <ArrowRight size={18} aria-hidden="true" />
      </a>
      </Reveal>
    </div>
  </section>
);
