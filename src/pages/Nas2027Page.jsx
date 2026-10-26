import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import ProductCheckoutButton from '../components/ProductCheckoutButton';
import SEOHead from '../components/SEOHead';
import { LEGAL_EMAIL, LEGAL_TAX_ID } from '../content/ablLegal';
import {
  NAS2027_PRODUCT_CODE, NAS2027_CHECKOUT_URL, NAS2027_PRICE, NAS2027_TITLE, NAS2027_DESCRIPTION, HERO, STAGES, STAGES_NOTE,
  CHAPTERS, DIFFERENCES, PREVIEWS, PLAN_LINES, BUY_STEPS, ABOUT, FAQS, ENDING, DISCLAIMER, LEGAL_SELLER_LINE_NAS,
} from '../content/nas2027Content';
import './AblPage.css';
import './AblSales.css';
import '../components/AblLegalFooter.css';
import './NasSales.css';

// 自動產生與交付上線前維持 noindex，結帳按鈕在後台開放 nas_2027_report 前顯示「即將開放」。
const INDEXABLE = false;

const Nas2027Page = () => {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <main className="theme-abl theme-nas-2027 abl-sales-page">
      <SEOHead title={NAS2027_TITLE} description={NAS2027_DESCRIPTION} exactTitle noindex={!INDEXABLE} />

      <section className="abl-hero abl-sales-hero">
        <div className="abl-sales-container">
          <Link className="abl-sales-top-link" to="/nas">平衡空間</Link>
          <div className="abl-logo-card">
            {!logoFailed ? (
              <img src="/logo-nas.png" alt="" width="500" height="500" loading="eager" className="abl-logo"
                onError={() => setLogoFailed(true)} />
            ) : (
              <span className="abl-logo-text">平衡空間</span>
            )}
          </div>
          <HeroTextReveal
            title={HERO.title}
            subtitle={HERO.subtitle}
            titleClassName="abl-heading abl-sales-title"
            subtitleClassName="abl-sales-subtitle"
          />
          <a className="abl-cta abl-sales-scroll" href="#chapters">{HERO.action}</a>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">你是不是也在這裡</h2>
          <div className="abl-sales-grid abl-sales-grid-themes">
            {STAGES.map((stage) => (
              <article className="abl-card abl-sales-card" key={stage.name}>
                <h3 className="abl-heading"><span className="abl-sales-theme-icon" aria-hidden="true">{stage.icon}</span>{stage.name}</h3>
                <p>{stage.body}</p>
              </article>
            ))}
          </div>
          <p className="abl-sales-note">{STAGES_NOTE}</p>
        </div>
      </section>

      <section id="chapters" className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">這份報告回答六件事</h2>
          <div className="abl-sales-grid abl-sales-grid-themes">
            {CHAPTERS.map(([icon, name, body]) => (
              <article className="abl-card abl-sales-card" key={name}>
                <h3 className="abl-heading"><span className="abl-sales-theme-icon" aria-hidden="true">{icon}</span>{name}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">和一般流年運勢不一樣的地方</h2>
          <div className="abl-sales-diff">
            <ul>
              {DIFFERENCES.map(([name, body]) => (
                <li key={name}><strong>{name}</strong><span>{body}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">裡面長這樣</h2>
          <div className="abl-sales-grid abl-sales-grid-themes nas-sales-previews">
            {PREVIEWS.map(([src, alt]) => (
              <figure className="abl-card nas-sales-preview" key={src}>
                <img src={src} alt={alt} loading="lazy" width="900" height="1274" />
                <figcaption>{alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="plan" className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">價格與購買</h2>
          <article className="abl-card abl-sales-card nas-sales-plan">
            <h3 className="abl-heading">2027 年度導航　個人報告<span className="abl-sales-price">{NAS2027_PRICE}</span></h3>
            <div className="abl-sales-copy">
              {PLAN_LINES.map((line) => <p key={line}>{line}</p>)}
            </div>
            <ProductCheckoutButton code={NAS2027_PRODUCT_CODE} label="前往結帳" closedText="即將開放" checkoutUrl={NAS2027_CHECKOUT_URL} />
          </article>
          <ol className="abl-sales-steps">
            {BUY_STEPS.map(([title, body], index) => (
              <li className="abl-sales-step" key={title}>
                <span className="abl-sales-step-no">{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">寫這份報告的人</h2>
          <div className="abl-sales-copy">
            {ABOUT.map((text) => <p key={text}>{text}</p>)}
          </div>
        </div>
      </section>

      <section className="abl-sales-section">
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
          <h2 className="abl-heading">{ENDING.title}</h2>
          <p>{ENDING.body}</p>
          <div className="abl-sales-ending-actions">
            <a className="abl-cta abl-sales-scroll" href="#plan">回到價格與購買</a>
            <a className="abl-cta abl-sales-line" href={LINE_CONFIG.LINE_ADD_URL} target="_blank" rel="noopener noreferrer">加官方 LINE，開放時通知我</a>
          </div>
        </div>
      </section>

      <footer className="abl-sales-disclaimer">{DISCLAIMER}</footer>
      <div className="abl-legal-footer">
        <p>{LEGAL_SELLER_LINE_NAS}　統一編號 {LEGAL_TAX_ID}　{LEGAL_EMAIL}</p>
        <nav aria-label="法務資訊">
          <Link to="/nas/terms">服務條款</Link>
          <Link to="/nas/privacy">隱私權政策</Link>
        </nav>
      </div>
    </main>
  );
};

export default Nas2027Page;
