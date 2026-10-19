import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import ProductCheckoutButton from '../components/ProductCheckoutButton';
import SEOHead from '../components/SEOHead';
import AblLegalFooter from '../components/AblLegalFooter';
import './AblSales.css';

const INDEXABLE = false;
const TITLE = '艾伯林量子調頻｜2027 年度頻率支持';
const DESCRIPTION = '2027 年度頻率支持，一整年的背景支持，團體與個人兩種選擇，每季一次更新通知。';

const QUARTERS = [
  ['第一季　穩住自己，先把自己放回中心', '新的一年，不急著往外追。先把散掉的注意力收回來，把生活、情緒和行動重新放回自己的節奏。'],
  ['第二季　建立連結，讓對的人與資源靠近', '當自己穩下來，下一步不是更用力，而是看清楚哪些關係值得靠近、哪些合作值得投入、哪些資源值得承接。'],
  ['第三季　承接行動，把機會變成真正的進展', '看見機會不等於接得住。這一季的重點，是讓已有的連結與資源真正落到選擇、行動與成果。'],
  ['第四季　整合收束，留下有效的，放下不再需要的', '年底不是再多做一點，而是把這一年真正有價值的東西留下來，把不再適合的人、事、習慣與消耗慢慢放下。'],
];

const THEMES = [
  '年度定錨頻率　穩住今年想維持的狀態',
  '運勢光啟頻率　重新整理，回到可以前進的節奏',
  '思維加速頻率　專注、學習與決策的整理',
  '豐盛擴容頻率　資源承接、金錢與價值感',
  '身心降噪頻率　壓力、耗損、休息與恢復',
  '情感共振頻率　關係、人際、連結與互動',
];

const PERSONAL_YEAR = [
  '第一季　穩定資源感',
  '第二季　承接機會',
  '第三季　擴張與行動',
  '第四季　整合與留存',
];

const FAQS = [
  ['團體和個人差在哪裡？', '團體是一群人共用同一個年度主題。個人是你自己選定的主題，四季重點也圍繞著這個主題。'],
  ['單一主題和雙主題差在哪裡？', '單一主題有一個年度主題。雙主題是兩個各自獨立的年度主題，各自有四季重點。'],
  ['可以中途換主題嗎？', '年度主題全年固定。如果你想更換，請透過 LINE 與我們聯絡。'],
  ['有人工諮詢嗎？', '這是年度背景支持，每季以更新通知交付，不包含一對一人工諮詢。'],
  ['有包含平衡空間的 365 能量氣象台嗎？', '沒有。這是獨立的商品。'],
  ['空間調頻和個人年度頻率有什麼不同？', '個人年度頻率支持的是你自己的狀態，空間調頻看的是一個地址的空間。兩者可以分開選擇。'],
];

const Abl2027Page = () => {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <main className="theme-abl abl-sales-page">
      <SEOHead title={TITLE} description={DESCRIPTION} exactTitle noindex={!INDEXABLE} />

      <section className="abl-hero abl-sales-hero">
        <div className="abl-sales-container">
          <Link className="abl-sales-top-link" to="/abl">艾伯林量子調頻</Link>
          <div className="abl-logo-card">
            {!logoFailed ? (
              <img
                src="/brand/abl-logo.png"
                alt=""
                width="500"
                height="500"
                loading="eager"
                className="abl-logo"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="abl-logo-text">艾伯林量子調頻</span>
            )}
          </div>
          <HeroTextReveal
            title="今年，把狀態穩在你想要的地方"
            subtitle="艾伯林量子調頻 2027 年度頻率支持，一整年的背景支持，一季一季陪你往前走。"
            titleClassName="abl-heading abl-sales-title"
            subtitleClassName="abl-sales-subtitle"
          />
          <a className="abl-cta abl-sales-scroll" href="#support-options">看三種支持</a>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">一年怎麼走</h2>
          <div className="abl-sales-copy">
            <p>從付款確認當天起算，一整年。</p>
            <p>年度主題全年固定，每一季有一個階段重點，每季你會收到一次 LINE 更新通知。</p>
          </div>
        </div>
      </section>

      <section id="support-options" className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">選哪一種支持</h2>
          <div className="abl-sales-grid abl-sales-grid-plans">
            <article className="abl-card abl-sales-card">
              <h3 className="abl-heading">團體年度頻率　NT$990 / 年</h3>
              <div className="abl-sales-copy">
                <p>一群人，共同接受同一個年度主題。</p>
                <p>2027 共同主題：穩定承接</p>
                <p>在變動裡穩住自己，讓真正適合你的關係、機會與資源，有空間進來。</p>
                <p>包含：共同年度主題、四季階段重點、每季一則簡短提醒。</p>
              </div>
              <ProductCheckoutButton code="group_annual" label="前往結帳" />
            </article>
            <article className="abl-card abl-sales-card">
              <h3 className="abl-heading">個人年度頻率　單一主題　NT$2,200 / 年</h3>
              <div className="abl-sales-copy">
                <p>專門為你選定的一個年度主題，全年固定，四季各有一個階段重點。</p>
                <p>包含：一個年度主題、四季階段重點、每季一次更新通知。</p>
              </div>
              <ProductCheckoutButton code="individual_single" label="前往結帳" />
            </article>
            <article className="abl-card abl-sales-card">
              <h3 className="abl-heading">個人年度頻率　雙主題　NT$3,980 / 年</h3>
              <div className="abl-sales-copy">
                <p>兩個各自獨立的年度主題，各自有四季階段重點。</p>
                <p>包含：兩個年度主題、各自的四季階段重點、各自每季一次更新通知。</p>
              </div>
              <ProductCheckoutButton code="individual_dual" label="前往結帳" />
            </article>
          </div>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">團體 2027 四季</h2>
          <div className="abl-sales-grid abl-sales-grid-two">
            {QUARTERS.map(([title, body]) => (
              <article className="abl-card abl-sales-card" key={title}>
                <h3 className="abl-heading">{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">個人六個年度主題</h2>
          <div className="abl-sales-grid abl-sales-grid-themes">
            {THEMES.map((theme) => <article className="abl-card abl-sales-card" key={theme}>{theme}</article>)}
          </div>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">個人版一年的樣子，以豐盛擴容為例</h2>
          <div className="abl-sales-grid abl-sales-grid-four">
            {PERSONAL_YEAR.map((stage) => <article className="abl-card abl-sales-card" key={stage}>{stage}</article>)}
          </div>
          <p className="abl-sales-note">年度主題不變，每一季只調整這個主題下的階段重點。</p>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">常見問題</h2>
          <div className="abl-sales-faqs">
            {FAQS.map(([question, answer]) => (
              <details className="abl-sales-faq" open key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="abl-sales-ending">
        <div className="abl-sales-inner abl-sales-ending-inner">
          <p>想知道哪一種適合你，先加 LINE，我們一起看。</p>
          <a className="abl-cta abl-sales-line" href={LINE_CONFIG.LINE_ADD_URL} target="_blank" rel="noopener noreferrer">加 LINE，開放時通知我</a>
        </div>
      </section>

      <footer className="abl-sales-disclaimer">頻率支持不是醫療、診斷或療效保證。</footer>
      <AblLegalFooter />
    </main>
  );
};

export default Abl2027Page;
