import React from 'react';
import SEOHead from '../components/SEOHead';
import { stuckReport } from '../content/stuckReport';
import { LINE_CONFIG } from '../lib/constants';

const META_TITLE = '事情卡住的三種樣子｜艾瑞克';
const META_DESCRIPTION = '卡住不是你的問題，是一個訊號——你現在的看法已經不夠用了。十分鐘，把你卡住的地方拆開看一次。';

const Paragraphs = ({ blocks }) => (
  <div className="space-y-6 text-[17px] font-light leading-[1.95] text-slate-700 md:text-[18px]">
    {blocks.map((block, index) => <p key={index}>{block}</p>)}
  </div>
);

const ThreePage = () => (
  <main className="bg-[#fbfaf7] pb-24 pt-32 text-slate-800 md:pb-32 md:pt-36">
    <SEOHead title={META_TITLE} description={META_DESCRIPTION} exactTitle />

    <article className="mx-auto max-w-[640px] px-6">
      <header className="mb-14 border-b border-slate-300 pb-12 md:mb-16 md:pb-14">
        <p className="mb-5 text-xs tracking-[0.22em] text-slate-500">FREE REPORT</p>
        <h1 className="text-4xl font-medium leading-[1.45] tracking-tight text-slate-900 md:text-5xl md:leading-[1.4]">
          {stuckReport.title}
        </h1>
      </header>

      {stuckReport.sections.map((section, sectionIndex) => (
        <section
          key={section.id || `section-${sectionIndex}`}
          id={section.id}
          className={section.heading ? 'scroll-mt-28 pt-14 md:pt-20' : ''}
        >
          {section.heading && (
            <h2 className="mb-9 border-t border-slate-300 pt-8 text-2xl font-medium leading-relaxed text-slate-900 md:text-3xl">
              {section.heading}
            </h2>
          )}

          <Paragraphs blocks={section.blocks} />

          {section.groups?.map((group) => (
            <div key={group.heading} className="mt-12">
              <h3 className="mb-6 text-xl font-medium leading-relaxed text-slate-900 md:text-2xl">{group.heading}</h3>
              <Paragraphs blocks={group.blocks} />
            </div>
          ))}

          {section.actions?.map((action) => (
            <div key={action.heading} className="mt-9 border-l-2 border-slate-400 bg-white/70 px-5 py-6 md:px-7">
              <h3 className="mb-6 text-xl font-medium leading-relaxed text-slate-900">{action.heading}</h3>
              <Paragraphs blocks={action.blocks} />
            </div>
          ))}

          {section.ctaAfter && (
            <div className="mt-12 border-t border-slate-300 pt-10">
              <a
                href={LINE_CONFIG.LINE_ADD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center bg-slate-900 px-6 py-4 text-center text-sm font-bold text-white transition-colors hover:bg-slate-700"
              >
                加入 LINE，或回到對話
              </a>
            </div>
          )}
        </section>
      ))}
    </article>
  </main>
);

export default ThreePage;
