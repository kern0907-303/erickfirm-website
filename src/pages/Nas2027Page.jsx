import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, Check, Map as MapIcon, CloudSun } from 'lucide-react';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import ProductCheckoutButton from '../components/ProductCheckoutButton';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';
import { LEGAL_TAX_ID } from '../content/ablLegal';
import { NAS_LEGAL_EMAIL } from '../content/nasLegal';
import {
  NAS2027_CHECKOUT_URL, NAS2027_TITLE, NAS2027_DESCRIPTION, HERO, HERO_BY_TYPE, STRUGGLE, TURN, SOLUTION,
  LINK_SECTION, DIFFERENCES, EXCERPTS_TITLE, EXCERPTS_INTRO, EXCERPTS, EXCERPT_MONTHS, PLANS, FAMILY_NOTE, BUY_STEPS, ABOUT, FAQS, ENDING,
  DISCLAIMER, LEGAL_SELLER_LINE_NAS,
} from '../content/nas2027Content';

// 2026-10-26：改用平衡空間其他頁面同一套視覺（白底、紫金點綴、NAS 品牌標記），不再沿用艾伯林的銷售頁版型。
// 自動產生與交付上線前維持 noindex，結帳按鈕在後台開放商品前顯示「即將開放」。
const INDEXABLE = true;

const PART_ICONS = [MapIcon, CloudSun];
const LIGHT_TONE = {
  red: 'bg-[#D9534F]',
  yellow: 'bg-[#D4A537]',
  green: 'bg-[#3F9D6B]',
};

const Quote = ({ parts }) => (
  <>
    {parts.map((text, index) => (index % 2 === 1
      ? <mark key={text} className="px-0.5 font-bold text-[#1F1A2E]" style={{ background: 'linear-gradient(transparent 58%, rgba(212, 184, 106, 0.45) 58%)' }}>{text}</mark>
      : <React.Fragment key={text}>{text}</React.Fragment>))}
  </>
);

const QUIZ_TYPE_PATTERN = /^[LDOKM]$/;
const BODY_COPY_CLASS = 'text-lg font-normal';
const BODY_COPY_RELAXED_CLASS = `${BODY_COPY_CLASS} leading-relaxed`;
const BODY_SUBHEADING_CLASS = 'text-xl';

// 做過卡點檢查的人：網址的 quiz_type 優先，其次是瀏覽器記得的類型。掛載後才讀，預渲染的 HTML 維持通用版。
function useQuizType() {
  const [type, setType] = React.useState(null);
  React.useEffect(() => {
    let value = '';
    try { value = (new URLSearchParams(window.location.search).get('quiz_type') || '').toUpperCase(); } catch { value = ''; }
    if (QUIZ_TYPE_PATTERN.test(value)) {
      try { localStorage.setItem('nas.quizType', value); } catch { /* 存不了就算了 */ }
    } else {
      try { value = localStorage.getItem('nas.quizType') || ''; } catch { value = ''; }
    }
    if (QUIZ_TYPE_PATTERN.test(value)) setType(value);
  }, []);
  return type;
}

const Nas2027Page = () => {
  const quizType = useQuizType();
  const hero = (quizType && HERO_BY_TYPE[quizType]) || HERO;
  return (
  <main className="bg-white text-[#1F1A2E]">
    <SEOHead title={NAS2027_TITLE} description={NAS2027_DESCRIPTION} exactTitle noindex={!INDEXABLE} />

    {/* 1. 首屏：車燈 */}
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-white via-[#F4F0FB]/60 to-white">
      <div className="max-w-4xl mx-auto">
        <NASMark label="2027 年度導航" />
        <HeroTextReveal
          key={quizType || 'default'}
          title={hero.title}
          subtitle={hero.subtitle}
          titleClassName="text-3xl md:text-[2.6rem] font-bold leading-snug mb-8"
          subtitleClassName="text-base md:text-lg text-[#55506B] leading-loose mb-10 max-w-3xl"
        />
        <a href="#struggle" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] transition">
          {HERO.action}<ArrowRight size={16} />
        </a>
      </div>
    </section>

    {/* 2. 你是不是也這樣 */}
    <section id="struggle" className="py-20 px-6 border-t border-[#F0EDF7]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">{STRUGGLE.title}</h2>
        <div className="mb-10">
          {STRUGGLE.scenes.map(([, text], index) => (
            <p key={text} className={`text-lg md:text-xl leading-relaxed text-[#1F1A2E] py-5 ${index === 0 ? '' : 'border-t border-[#F0EDF7]'}`}>{text}</p>
          ))}
        </div>
        <p className="text-lg font-medium leading-loose text-[#1F1A2E] border-l-2 border-[#D4B86A] pl-6">{STRUGGLE.closing}</p>
      </div>
    </section>

    {/* 3. 轉折 */}
    <section className="py-20 px-6 bg-[#F7F5FC]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-snug">{TURN.title}</h2>
        {TURN.paragraphs.map((text, index) => (
          <p key={text} className={`leading-loose mb-5 ${index === TURN.paragraphs.length - 1 ? 'text-lg font-semibold text-[#1F1A2E]' : 'text-[#55506B]'}`}>{text}</p>
        ))}
      </div>
    </section>

    {/* 4. 地圖與路況 */}
    <section id="solution" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{SOLUTION.title}</h2>
        <p className="text-[#55506B] leading-relaxed mb-10 max-w-3xl">{SOLUTION.intro}</p>
        <div className="grid md:grid-cols-2 gap-5">
          {SOLUTION.parts.map((part, index) => {
            const Icon = PART_ICONS[index] || MapIcon;
            return (
              <article key={part.name} className="card-flat p-7 bg-[#F8F6FC]">
                <div className="flex items-center gap-3 mb-4">
                  <Icon size={22} className="text-[#5B3A9E]" />
                  <h3 className="text-xl font-bold">{part.name}</h3>
                </div>
                <p className="text-[#55506B] leading-loose mb-5">{part.body}</p>
                <ul className="space-y-3">
                  {part.items.map((item) => (
                    <li key={item} className={`flex gap-3 ${BODY_COPY_RELAXED_CLASS} text-[#463F5C]`}>
                      <Check size={16} className="shrink-0 mt-1 text-[#A8883F]" /><span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>

    {/* 4-1. 報告和 365 怎麼接在一起 */}
    <section id="link" className="py-20 px-6 border-t border-[#F0EDF7]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">{LINK_SECTION.title}</h2>
        <p className="text-[#55506B] leading-loose mb-3 max-w-3xl">{LINK_SECTION.intro}</p>
        <p className={`${BODY_COPY_RELAXED_CLASS} text-[#8A84A0] mb-10`}>{LINK_SECTION.note}</p>
        <div className="space-y-6">
          {LINK_SECTION.pairs.map((pair) => (
            <article key={pair.moment} className="rounded-2xl border border-[#E7E3F0] p-5 md:p-6">
              <p className={`${BODY_SUBHEADING_CLASS} font-bold text-[#5B3A9E] mb-4`}>{pair.moment}</p>
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
                <div className="rounded-xl bg-[#F8F6FC] border border-[#ECE6F5] p-5">
                  <p className="text-[11px] font-semibold tracking-wide text-[#A8883F] mb-2">{LINK_SECTION.reportLabel}｜{pair.report.chapter}</p>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-bold text-[#3B2D5C]">{pair.report.title}</p>
                    {pair.report.tag && <span className="shrink-0 text-xs text-[#8A6D1F]">{pair.report.tag}</span>}
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#463F5C]">{pair.report.text}</p>
                </div>
                <div className="flex items-center justify-center text-[#B9A9D6]">
                  <ArrowRight size={22} className="hidden md:block" /><ArrowDown size={22} className="md:hidden" />
                </div>
                <div className="rounded-xl bg-[#E8EEF6] p-4">
                  <p className="text-[11px] font-semibold tracking-wide text-[#5D6B82] mb-3">{LINK_SECTION.lineLabel}</p>
                  <div className="flex gap-2.5 items-start">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-[#5B3A9E] text-white text-xs font-bold flex items-center justify-center">平</span>
                    <p className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[15px] leading-relaxed text-[#1F1A2E] shadow-sm">{pair.line}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-10 text-lg font-semibold leading-loose text-[#1F1A2E] border-l-2 border-[#D4B86A] pl-6 max-w-3xl">{LINK_SECTION.closing}</p>
      </div>
    </section>

    {/* 5. 報告摘句 */}
    <section className="py-20 px-6 bg-[#F7F5FC]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{EXCERPTS_TITLE}</h2>
        <p className="text-[#55506B] leading-relaxed mb-10">{EXCERPTS_INTRO}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXCERPTS.map((item) => (
            <figure key={item.chapter} className="m-0 rounded-2xl border border-[#E7E3F0] bg-white p-6">
              <figcaption className={`${BODY_SUBHEADING_CLASS} font-semibold tracking-wide text-[#A8883F] mb-4`}>{item.chapter}</figcaption>
              <blockquote className="m-0 text-lg md:text-xl font-medium leading-loose text-[#1F1A2E]"><Quote parts={item.quote} /></blockquote>
              {item.dont && <p className={`mt-4 pt-4 border-t border-dashed border-[#E7E3F0] ${BODY_COPY_RELAXED_CLASS} text-[#55506B]`}>先別做：{item.dont}</p>}
            </figure>
          ))}
          <figure className="m-0 rounded-2xl border border-[#E7E3F0] bg-white p-6 md:col-span-2 lg:col-span-3">
            <figcaption className={`${BODY_SUBHEADING_CLASS} font-semibold tracking-wide text-[#A8883F] mb-5`}>{EXCERPT_MONTHS.chapter}</figcaption>
            <ul className="space-y-4">
              {EXCERPT_MONTHS.rows.map(([tone, light, range, theme, side, text]) => (
                <li key={range} className="flex gap-4 items-start">
                  <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold text-white ${LIGHT_TONE[tone]}`}>{light}</span>
                  <div>
                    <p className={`${BODY_COPY_RELAXED_CLASS} text-[#6E6885]`}>{range}<span className={`ml-2 ${BODY_SUBHEADING_CLASS} font-semibold text-[#1F1A2E]`}>{theme}</span></p>
                    <p className="text-lg font-medium leading-relaxed text-[#1F1A2E]">{side}｜{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className={`mt-5 ${BODY_COPY_RELAXED_CLASS} text-[#6E6885]`}>{EXCERPT_MONTHS.note}</p>
          </figure>
        </div>
      </div>
    </section>

    {/* 6. 不一樣的地方 */}
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">和一般流年運勢不一樣的地方</h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {DIFFERENCES.map(([name, body]) => (
            <div key={name} className="flex gap-3">
              <Check size={18} className="shrink-0 mt-1 text-[#5B3A9E]" />
              <div>
                <h3 className="font-bold mb-1">{name}</h3>
                <p className={`${BODY_COPY_RELAXED_CLASS} text-[#55506B]`}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 7. 方案 */}
    <section id="plan" className="py-20 px-6 bg-[#F7F5FC]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">選一個方案</h2>
        <div className="grid md:grid-cols-3 gap-5 items-stretch mb-14">
          {PLANS.map((plan) => (
            <article key={plan.code} className={`relative flex flex-col rounded-2xl bg-white p-7 ${plan.featured ? 'border-2 border-[#5B3A9E] shadow-[0_16px_40px_rgba(91,58,158,0.14)]' : 'border border-[#E7E3F0]'}`}>
              {plan.badge && <span className="absolute -top-3 left-7 text-xs px-3 py-1 rounded-full bg-[#5B3A9E] text-white">{plan.badge}</span>}
              <p className={`${BODY_COPY_CLASS} text-[#6E6885] mb-1`}>{plan.name}</p>
              <p className="text-4xl font-bold tabular-nums mb-1">{plan.price}</p>
              <p className={`${BODY_COPY_CLASS} text-[#A8883F] mb-5`}>{plan.tagline}</p>
              <ul className="space-y-3 mb-5">
                {plan.items.map((item) => (
                  <li key={item} className={`flex gap-3 ${BODY_COPY_RELAXED_CLASS} text-[#463F5C]`}>
                    <Check size={16} className="shrink-0 mt-1 text-[#5B3A9E]" /><span>{item}</span>
                  </li>
                ))}
              </ul>
              {plan.note && <p className={`${BODY_COPY_RELAXED_CLASS} text-[#55506B] mb-5`}>{plan.note}</p>}
              <div className="mt-auto pt-2">
                <ProductCheckoutButton
                  code={plan.code} label="前往結帳" closedText="即將開放"
                  checkoutUrl={NAS2027_CHECKOUT_URL + '?plan=' + plan.code}
                  className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] transition"
                  closedClassName="w-full text-center px-6 py-3.5 rounded-full border border-[#DAD4E8] text-sm text-[#918BA6]"
                />
              </div>
            </article>
          ))}
        </div>
        <div className="mb-14 rounded-2xl border border-[#E7DFC8] bg-[#FBF7EE] p-6">
          <p className="font-bold text-[#1F1A2E]">{FAMILY_NOTE.title}</p>
          <p className={`mt-2 ${BODY_COPY_RELAXED_CLASS} text-[#55506B]`}>{FAMILY_NOTE.body}</p>
        </div>
        <h3 className="text-xl font-bold mb-6">怎麼買，四步就完成</h3>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BUY_STEPS.map(([title, body], index) => (
            <li key={title} className="rounded-2xl border border-[#E7E3F0] bg-white p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#5B3A9E] text-sm font-bold text-white mb-3">{index + 1}</span>
              <h4 className="font-bold mb-2">{title}</h4>
              <p className={`${BODY_COPY_RELAXED_CLASS} text-[#55506B]`}>{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* 8. 寫的人 */}
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">寫這份導航的人</h2>
        {ABOUT.map((text) => <p key={text} className="text-[#55506B] leading-loose mb-4">{text}</p>)}
        <Link to="/about" className="inline-flex items-center gap-2 text-[#1F1A2E] font-medium hover:underline mt-2">認識艾瑞克<ArrowRight size={16} /></Link>
      </div>
    </section>

    {/* 9. 常見問題 */}
    <section className="py-20 px-6 bg-[#F7F5FC]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">常見問題</h2>
        <div className="divide-y divide-[#E7E3F0] border-y border-[#E7E3F0]">
          {FAQS.map(([question, answer]) => (
            <article key={question} className="py-6">
              <h3 className="mb-3 text-xl font-bold">{question}</h3>
              <p className={`${BODY_COPY_RELAXED_CLASS} text-[#55506B]`}>{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* 10. 結尾：加 LINE 只在這裡出現一次 */}
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-5">{ENDING.title}</h2>
        <p className="text-lg text-[#55506B] leading-loose mb-10">{ENDING.body}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#plan" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] transition">
            {ENDING.action}<ArrowRight size={16} />
          </a>
          <a href={LINE_CONFIG.NAS_LINE_ADD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#D4B86A] text-[#A8883F] hover:border-[#A8883F] hover:bg-[#FBF7EE] transition">
            還有問題，先加官方 LINE 問我們
          </a>
        </div>
      </div>
    </section>

    <footer className="px-6 pb-14">
      <div className="max-w-4xl mx-auto border-t border-[#F0EDF7] pt-8 text-center text-xs leading-loose text-[#918BA6]">
        <p className="mb-3">{DISCLAIMER}</p>
        <p>{LEGAL_SELLER_LINE_NAS}　統一編號 {LEGAL_TAX_ID}　{NAS_LEGAL_EMAIL}</p>
        <nav aria-label="法務資訊" className="mt-2 flex justify-center gap-5">
          <Link to="/nas/terms" className="underline underline-offset-4 hover:text-[#5B3A9E]">服務條款</Link>
          <Link to="/nas/privacy" className="underline underline-offset-4 hover:text-[#5B3A9E]">隱私權政策</Link>
        </nav>
      </div>
    </footer>
  </main>
  );
};

export default Nas2027Page;
