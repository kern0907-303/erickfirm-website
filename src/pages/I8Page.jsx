import React from 'react';
import { ArrowRight, ClipboardCheck, Route, ShieldCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';
import SEOHead from '../components/SEOHead';

const I8_LINE_DIAGNOSTIC_URL = LINE_CONFIG.LINE_MESSAGE_URL + '%E3%80%90%E4%BC%81%E6%A5%AD%E9%86%AB%E7%94%9F%E8%A8%BA%E6%96%B7%E3%80%91';

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
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://erickfirm.com/i8#service',
        name: '初八企業顧問 I8｜企業醫生診斷',
        url: 'https://erickfirm.com/i8',
        serviceType: '企業決策與組織協作診斷',
        provider: { '@id': 'https://erickfirm.com/#erick' },
        description: '協助企業主從人力與組織協作、決策與管理節奏、經營流程與資源配置，釐清最該優先處理的經營卡點。',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: '企業醫生診斷｜初八企業顧問 I8',
        url: 'https://erickfirm.com/i8',
        inLanguage: 'zh-Hant',
        about: { '@id': 'https://erickfirm.com/i8#service' },
        author: { '@id': 'https://erickfirm.com/#erick' },
      },
    ],
  };

  return (
    <div className="bg-[#F7FAFB] text-slate-900 pt-24 pb-20">
      <SEOHead
        title="企業醫生診斷｜人力與組織協作卡點 - 初八企業顧問 I8"
        description="當團隊越來越忙、協作卻越來越慢，問題未必在人不夠。初八企業顧問 I8 從組織協作、決策節奏與經營流程，協助企業主找出最該先處理的結構。"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="px-6 pt-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#9FDCE2] bg-white px-4 py-2 text-sm font-bold text-[#217987]">
            <img src="/logo-i8.png" alt="" className="h-5 w-5 object-contain" />
            初八企業顧問 I8｜企業醫生診斷
          </div>
          <h1 className="mt-7 max-w-3xl text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            企業最怕的不是問題出現，
            <br className="hidden md:block" />
            是一直處理錯問題。
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-loose text-slate-600">
            當人力、協作或營運開始卡住，通常不只是某個人做得不夠好。企業醫生診斷陪你回到角色、決策、流程與節奏，先找出此刻最值得處理的關鍵因素。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href={I8_LINE_DIAGNOSTIC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#143C47] px-6 py-4 font-bold text-white transition hover:bg-[#217987]"
            >
              先說說目前的卡點 <ArrowRight size={18} />
            </a>
            <Link
              to="/insights/enterprise-doctor"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-4 font-bold text-slate-700 transition hover:border-[#217987] hover:text-[#217987]"
            >
              先看企業醫生文章
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-bold tracking-[0.24em] text-[#217987]">WHAT WE LOOK AT</p>
          <h2 className="mt-3 text-3xl font-bold">不是替公司貼標籤，而是把結構看清楚</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {lenses.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-[#F7FAFB] p-6">
                <Icon className="text-[#217987]" size={28} />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-bold tracking-[0.24em] text-[#217987]">HOW A DIAGNOSIS STARTS</p>
          <h2 className="mt-3 text-3xl font-bold">從一個真正想處理的問題開始</h2>
          <div className="mt-10 space-y-5">
            {steps.map(([title, text], index) => (
              <div key={title} className="flex gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D9F1F4] font-bold text-[#217987]">{index + 1}</span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-[#9FDCE2] bg-[#ECF8F9] p-6 text-slate-700">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#217987]" size={22} />
              <p className="leading-relaxed">
                這不是自動評分工具，也不會用一份表單替你下結論。每一家企業的背景不同，診斷以實際經營情境為準，先確認資訊與優先順序，再討論是否需要後續支持。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#143C47] px-7 py-12 text-center text-white md:px-12">
          <h2 className="text-3xl font-bold text-white">先把最困擾的問題說清楚。</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-200">
            如果你正面對人力、組織協作、決策反覆或經營流程的卡點，先透過 LINE 說明目前情境。我們會從最需要被看清的地方開始。
          </p>
          <a
            href={I8_LINE_DIAGNOSTIC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-[#143C47] transition hover:bg-[#D9F1F4]"
          >
            進入企業醫生診斷 <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default I8Page;
