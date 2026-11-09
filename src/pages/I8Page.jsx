import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ClipboardCheck, Route, ShieldCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { lineMessageUrl } from '../lib/constants';
import SEOHead from '../components/SEOHead';
import ReportExit from '../components/ReportExit';

const I8_LINE_DIAGNOSTIC_URL = lineMessageUrl('【企業醫生診斷】');

const lenses = [
  {
    icon: UsersRound,
    title: '人力與組織協作',
    text: '角色是否清楚、事情由誰決定、跨部門交接在哪裡失速。先看協作結構，而不是急著把問題歸到某一個人。',
  },
  {
    icon: ClipboardCheck,
    title: '決策與管理節奏',
    text: '會議、授權、回看和優先序是否讓團隊知道現在該處理什麼。決策一再重來，通常不是大家不努力。',
  },
  {
    icon: Route,
    title: '經營流程與資源配置',
    text: '從獲客、交付到回款，找出哪一段正在消耗團隊。指標不是越多越好，而是要能支持下一個決策。',
  },
];

const steps = [
  ['先釐清現在卡在哪裡', '從組織、人力、客戶拓展、現金流與管理需求中，找出這次最需要被看清的一件事。'],
  ['把結構攤開來看', '回到角色、決策、流程與節奏，辨識表面問題背後真正反覆出現的關鍵因素。'],
  ['確認優先順序與下一步', '不是一次塞進所有建議，而是確認眼前最值得先處理的結構，以及可執行的下一步。'],
];

const I8Page = () => {
  const reduceMotion = useReducedMotion();
  // 首屏標題逐行浮現；開啟「減少動態效果」的人直接看到完整標題
  const enter = (delay) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  });
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://erickfirm.com/i8#service',
        name: '初八企業顧問｜企業醫生診斷',
        url: 'https://erickfirm.com/i8',
        serviceType: '企業決策與組織協作診斷',
        provider: { '@id': 'https://erickfirm.com/#erick' },
        description: '協助企業主、高階主管與承擔組織結果的管理者，從人力與組織協作、決策與管理節奏、經營流程與資源配置，釐清最該優先處理的卡點。',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: '企業醫生診斷｜初八企業顧問',
        url: 'https://erickfirm.com/i8',
        inLanguage: 'zh-Hant',
        about: { '@id': 'https://erickfirm.com/i8#service' },
        author: { '@id': 'https://erickfirm.com/#erick' },
      },
    ],
  };

  return (
    <div className="bg-i8-bg text-ef-ink pb-20">
      <SEOHead
        title="企業醫生診斷｜人力與組織協作卡點 - 初八企業顧問"
        description="當團隊越來越忙、協作卻越來越慢，問題未必在人不夠。初八企業顧問陪企業主、高階主管與承擔組織結果的人，從組織協作、決策節奏與經營流程找出最該先處理的結構。"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="i8-hero relative overflow-hidden px-6 pt-36 pb-ef-section">
        <div className="erick-hero__glow i8-hero__glow--one" aria-hidden="true" />
        <div className="erick-hero__glow i8-hero__glow--two" aria-hidden="true" />
        <div className="erick-hero__glow i8-hero__glow--three" aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-ef-paper px-4 py-2 text-sm font-bold text-i8-accent shadow-[inset_0_0_0_1px_var(--i8-soft)]">
            <img src="/logo-i8.png" alt="" className="h-5 w-5 object-contain" />
            初八企業顧問｜企業醫生診斷
          </div>
          {/* 斷行保護：詞組用 nowrap-tail 整組換行，手機不會把「一直」拆開 */}
          <h1 className="mt-7 max-w-3xl text-ef-display font-bold text-primary">
            <motion.span {...enter(0.12)} className="block">
              <span className="nowrap-tail">企業最怕的</span><span className="nowrap-tail">不是問題出現，</span>
            </motion.span>
            <motion.span {...enter(0.36)} className="block">
              <span className="nowrap-tail">是一直處理錯問題。</span>
            </motion.span>
          </h1>
          <p className="mt-7 max-w-2xl text-ef-lead text-ef-muted">
            當你承擔的不只是自己的工作，而是一個團隊、一個部門、一項產品，甚至整家公司，卡住時不一定是誰做得不夠好。企業醫生診斷陪你回到角色、決策、流程與節奏，先找出此刻最值得處理的關鍵因素。
          </p>
          <p className="mt-4 max-w-2xl text-ef-copy text-ef-muted">不論你是企業主、高階主管、部門主管，或在高科技與專業組織中承擔關鍵結果的人，都可以從這裡開始。</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {/* 首屏不放 LINE：主按鈕先帶到下方的診斷流程，LINE 只在頁面最後出現一次 */}
            <a href="#i8-how" className="ef-btn ef-btn--i8">
              看診斷怎麼進行 <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link
              to="/insights/enterprise-doctor"
              className="ef-btn ef-btn--ghost ef-btn--ghost-i8"
            >
              先看企業醫生文章
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ef-paper px-6 py-ef-section">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-ef-section font-bold text-primary"><span className="nowrap-tail">不是替組織貼標籤，</span><span className="nowrap-tail">而是把結構看清楚</span></h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {lenses.map(({ icon: Icon, title, text }) => (
              <article key={title} className="card-flat bg-i8-card p-7">
                <h3 className="flex items-center gap-3 text-ef-title font-bold text-primary">
                  <Icon className="shrink-0 text-i8-accent" size={22} aria-hidden="true" />
                  {title}
                </h3>
                <p className="mt-4 text-ef-copy text-ef-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="i8-how" className="scroll-mt-24 px-6 py-ef-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-ef-section font-bold text-primary"><span className="nowrap-tail">從一個真正</span><span className="nowrap-tail">想處理的問題開始</span></h2>
          <div className="mt-12 space-y-4">
            {steps.map(([title, text], index) => (
              <div key={title} className="card-flat flex gap-5 bg-ef-paper p-6 md:p-7">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-i8-mist font-bold text-i8-accent tabular-nums">{index + 1}</span>
                <div>
                  <h3 className="text-ef-title font-bold text-primary">{title}</h3>
                  <p className="mt-2 text-ef-copy text-ef-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card-flat mt-10 bg-i8-tint p-6 md:p-7 text-ef-text">
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 shrink-0 text-i8-accent" size={22} aria-hidden="true" />
              <p className="text-ef-copy">
                這不是自動評分工具，也不會用一份表單替你下結論。每個組織的背景不同，診斷以實際經營情境為準，先確認資訊與優先順序，再討論是否需要後續支持。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="ef-on-dark max-w-4xl mx-auto rounded-ef-card bg-i8-deep px-7 py-14 text-center text-ef-paper md:px-12 md:py-16">
          <h2 className="text-ef-section font-bold text-ef-paper">先把最困擾的問題說清楚。</h2>
          <p className="mx-auto mt-5 max-w-2xl text-ef-copy text-i8-mist">
            如果你正面對人力、組織協作、決策反覆或經營流程的卡點，先透過 LINE 說明目前情境。我們會從最需要被看清的地方開始。
          </p>
          <a
            href={I8_LINE_DIAGNOSTIC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ef-btn ef-btn--paper mt-9"
          >
            進入企業醫生診斷 <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
      <ReportExit question="還不確定問題是出在組織，還是出在自己？" />
    </div>
  );
};

export default I8Page;
