import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import ProductCheckoutButton from '../components/ProductCheckoutButton';
import SEOHead from '../components/SEOHead';
import AblLegalFooter from '../components/AblLegalFooter';
import { BUY_STEPS, PLAN_DIFF, PLAN_DIFF_NOTE, QUARTERS, THEMES, FAQS } from '../content/abl2027Content';
import './AblSales.css';

const INDEXABLE = true;
const TITLE = '艾伯林量子調頻｜2027 年度頻率支持';
const DESCRIPTION = '2027 年度頻率支持，團體共享頻率，或個人單獨設定，一整年的背景支持，每季一次 LINE 更新通知。';

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
          <a className="abl-cta abl-sales-scroll" href="#how-to-buy">看怎麼購買</a>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">買了會得到什麼</h2>
          <div className="abl-sales-copy">
            <p>一整年的背景支持，從付款確認當天起算，共 365 天。</p>
            <p>你選一個年度主題，全年固定。一年分四季，每一季有一個階段重點，每一季你會在 LINE 收到一次通知。你不用另外做功課。</p>
          </div>
        </div>
      </section>

      <section id="how-to-buy" className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">怎麼購買，四步就完成</h2>
          <ol className="abl-sales-steps">
            {BUY_STEPS.map(([title, body], index) => (
              <li className="abl-sales-step" key={title}>
                <span className="abl-sales-step-no">{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <p className="abl-sales-note">結帳按鈕在下面每個方案的卡片裡。還沒開放的方案，卡片上會寫「十一月陸續開放」，開放後按鈕會自己出現在同一個位置。</p>
        </div>
      </section>

      <section id="support-options" className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">選哪一種</h2>
          <div className="abl-sales-diff">
            <ul>
              {PLAN_DIFF.map(([name, body]) => (
                <li key={name}><strong>{name}</strong><span>{body}</span></li>
              ))}
            </ul>
            <p>{PLAN_DIFF_NOTE}</p>
          </div>
          <div className="abl-sales-grid abl-sales-grid-plans">
            <article className="abl-card abl-sales-card">
              <h3 className="abl-heading">團體年度頻率<span className="abl-sales-price">NT$990 <small>/ 年</small></span></h3>
              <div className="abl-sales-copy">
                <p>一群人，共享同一個頻率。</p>
                <p>2027 共同主題：穩定承接。在變動裡穩住自己，讓真正適合你的關係、機會與資源，有空間進來。</p>
                <p>包含：共同年度主題、四季階段重點、每季一則簡短提醒。</p>
              </div>
              <ProductCheckoutButton code="group_annual" label="前往結帳" closedText="十一月陸續開放" />
            </article>
            <article className="abl-card abl-sales-card">
              <h3 className="abl-heading">個人年度頻率　單一主題<span className="abl-sales-price">NT$2,200 <small>/ 年</small></span></h3>
              <div className="abl-sales-copy">
                <p>從下面六個主題選一個，頻率單獨為你設定、單獨發送。</p>
                <p>包含：一個年度主題、四季階段重點、每季一次更新通知。</p>
              </div>
              <ProductCheckoutButton code="individual_single" label="前往結帳" closedText="十一月陸續開放" />
            </article>
            <article className="abl-card abl-sales-card">
              <h3 className="abl-heading">個人年度頻率　雙主題<span className="abl-sales-price">NT$3,980 <small>/ 年</small></span></h3>
              <div className="abl-sales-copy">
                <p>從下面六個主題選兩個，兩個頻率各自單獨為你設定、單獨發送。</p>
                <p>包含：兩個年度主題、各自的四季階段重點、各自每季一次更新通知。</p>
              </div>
              <ProductCheckoutButton code="individual_dual" label="前往結帳" closedText="十一月陸續開放" />
            </article>
          </div>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
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

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">個人六個年度主題</h2>
          <p className="abl-sales-lead">選一個，或選兩個。每個主題都有自己的四季重點。</p>
          <div className="abl-sales-grid abl-sales-grid-two">
            {THEMES.map((theme) => (
              <article className="abl-card abl-sales-card abl-sales-theme" key={theme.name}>
                <h3 className="abl-heading"><span className="abl-sales-theme-icon" aria-hidden="true">{theme.icon}</span>{theme.name}</h3>
                <p className="abl-sales-theme-line">{theme.line}</p>
                <p className="abl-sales-theme-fit">{theme.fit}</p>
                <p className="abl-sales-theme-goal">{theme.goal}</p>
                <details className="abl-sales-seasons-wrap" open>
                  <summary>四季重點</summary>
                  <ul className="abl-sales-seasons">
                    {theme.seasons.map(([season, title, body]) => (
                      <li key={season}><b>{season}　{title}</b><span>{body}</span></li>
                    ))}
                  </ul>
                </details>
              </article>
            ))}
          </div>
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
          <h2 className="abl-heading">選好了，就從方案卡片開始</h2>
          <p>購買的入口是每個方案卡片裡的「前往結帳」。還沒開放的方案，開放時我們會在官方 LINE 通知你。也可以先加官方 LINE，問我們該選哪一種。</p>
          <div className="abl-sales-ending-actions">
            <a className="abl-cta abl-sales-scroll" href="#support-options">回到選方案</a>
            <a className="abl-cta abl-sales-line" href={LINE_CONFIG.LINE_ADD_URL} target="_blank" rel="noopener noreferrer">加官方 LINE，開放時通知我</a>
          </div>
        </div>
      </section>

      <footer className="abl-sales-disclaimer">頻率支持不是醫療、診斷或療效保證。</footer>
      <AblLegalFooter />
    </main>
  );
};

export default Abl2027Page;
