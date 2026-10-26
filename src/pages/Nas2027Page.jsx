import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import ProductCheckoutButton from '../components/ProductCheckoutButton';
import SEOHead from '../components/SEOHead';
import { LEGAL_TAX_ID } from '../content/ablLegal';
import { NAS_LEGAL_EMAIL } from '../content/nasLegal';
import {
  NAS2027_CHECKOUT_URL, NAS2027_TITLE, NAS2027_DESCRIPTION, HERO, STRUGGLE, TURN, SOLUTION,
  DIFFERENCES, PREVIEWS, PLANS, BUY_STEPS, ABOUT, FAQS, ENDING, DISCLAIMER, LEGAL_SELLER_LINE_NAS,
} from '../content/nas2027Content';
import './AblPage.css';
import './AblSales.css';
import '../components/AblLegalFooter.css';
import './NasSales.css';

// 自動產生與交付上線前維持 noindex，結帳按鈕在後台開放商品前顯示「即將開放」。
const INDEXABLE = false;

const Nas2027Page = () => {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <main className="theme-abl theme-nas-2027 abl-sales-page">
      <SEOHead title={NAS2027_TITLE} description={NAS2027_DESCRIPTION} exactTitle noindex={!INDEXABLE} />

      <section className="abl-hero abl-sales-hero nas-hero">
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
          <a className="abl-cta abl-sales-scroll" href="#struggle">{HERO.action}</a>
        </div>
      </section>

      <section id="struggle" className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{STRUGGLE.title}</h2>
          <ul className="nas-scenes">
            {STRUGGLE.scenes.map(([icon, text]) => (
              <li key={text}><span aria-hidden="true">{icon}</span><p>{text}</p></li>
            ))}
          </ul>
          <p className="nas-pullquote">{STRUGGLE.closing}</p>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{TURN.title}</h2>
          <div className="abl-sales-copy nas-turn">
            {TURN.paragraphs.map((text) => <p key={text}>{text}</p>)}
          </div>
        </div>
      </section>

      <section id="solution" className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{SOLUTION.title}</h2>
          <p className="abl-sales-note">{SOLUTION.intro}</p>
          <div className="abl-sales-grid nas-solution-grid">
            {SOLUTION.parts.map((part) => (
              <article className="abl-card abl-sales-card nas-solution-card" key={part.name}>
                <h3 className="abl-heading"><span className="abl-sales-theme-icon" aria-hidden="true">{part.icon}</span>{part.name}</h3>
                <p>{part.body}</p>
                <ul className="nas-check-list">
                  {part.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">報告裡面長這樣</h2>
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

      <section id="plan" className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">選一個方案</h2>
          <div className="nas-plans">
            {PLANS.map((plan) => (
              <article className={'abl-card abl-sales-card nas-plan' + (plan.featured ? ' is-featured' : '')} key={plan.code}>
                {plan.badge ? <span className="nas-plan-badge">{plan.badge}</span> : null}
                <h3 className="abl-heading">{plan.name}</h3>
                <p className="nas-plan-tagline">{plan.tagline}</p>
                <p className="nas-plan-price">{plan.price}</p>
                <ul className="nas-check-list">
                  {plan.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                {plan.note ? <p className="nas-plan-note">{plan.note}</p> : null}
                <ProductCheckoutButton code={plan.code} label="前往結帳" closedText="即將開放"
                  checkoutUrl={NAS2027_CHECKOUT_URL + '?plan=' + plan.code} />
              </article>
            ))}
          </div>
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

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">寫這份導航的人</h2>
          <div className="abl-sales-copy">
            {ABOUT.map((text) => <p key={text}>{text}</p>)}
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

      <section className="abl-sales-ending nas-ending">
        <div className="abl-sales-inner abl-sales-ending-inner">
          <h2 className="abl-heading">{ENDING.title}</h2>
          <p>{ENDING.body}</p>
          <div className="abl-sales-ending-actions">
            <a className="abl-cta abl-sales-scroll" href="#plan">{ENDING.action}</a>
            <a className="abl-cta abl-sales-line" href={LINE_CONFIG.LINE_ADD_URL} target="_blank" rel="noopener noreferrer">還有問題，先加官方 LINE 問我們</a>
          </div>
        </div>
      </section>

      <footer className="abl-sales-disclaimer">{DISCLAIMER}</footer>
      <div className="abl-legal-footer">
        <p>{LEGAL_SELLER_LINE_NAS}　統一編號 {LEGAL_TAX_ID}　{NAS_LEGAL_EMAIL}</p>
        <nav aria-label="法務資訊">
          <Link to="/nas/terms">服務條款</Link>
          <Link to="/nas/privacy">隱私權政策</Link>
        </nav>
      </div>
    </main>
  );
};

export default Nas2027Page;
