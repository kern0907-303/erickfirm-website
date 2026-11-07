import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import SEOHead from '../components/SEOHead';
import AblLegalFooter from '../components/AblLegalFooter';
import { LEGAL_EMAIL } from '../content/ablLegal';
import {
  ABL_ABOUT_TITLE, ABL_ABOUT_DESCRIPTION, ABL_ABOUT_HERO, ABL_ABOUT_SECTIONS,
  ABL_ABOUT_ACTIONS, ABL_ABOUT_CONTACT_TITLE, ABL_ABOUT_DISCLAIMER,
} from '../content/ablAbout';
import './AblSales.css';

// 艾伯林量子調頻版「認識艾瑞克」：冷流量從艾伯林量子調頻的頁面點進來，只看到艾伯林量子調頻。
// 版型沿用 /abl/2027（青綠到亮藍漸層、ABL Logo），首屏標題逐字浮現。
const AblAboutPage = () => {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <main className="theme-abl abl-sales-page">
      <SEOHead title={ABL_ABOUT_TITLE} description={ABL_ABOUT_DESCRIPTION} exactTitle />

      <section className="abl-hero abl-sales-hero">
        <div className="abl-sales-container">
          <Link className="abl-sales-top-link" to="/abl">艾伯林量子調頻</Link>
          <div className="abl-logo-card">
            {!logoFailed ? (
              <img src="/brand/abl-logo.png" alt="" width="500" height="500" loading="eager" className="abl-logo" onError={() => setLogoFailed(true)} />
            ) : (
              <span className="abl-logo-text">艾伯林量子調頻</span>
            )}
          </div>
          <HeroTextReveal
            title={ABL_ABOUT_HERO.title}
            subtitle={ABL_ABOUT_HERO.subtitle}
            titleClassName="abl-heading abl-sales-title"
            subtitleClassName="abl-sales-subtitle"
          />
        </div>
      </section>

      {ABL_ABOUT_SECTIONS.map((section, index) => (
        <section key={section.title} className={'abl-sales-section' + (index % 2 === 1 ? ' abl-sales-section-muted' : '')}>
          <div className="abl-sales-inner">
            <h2 className="abl-heading">{section.title}</h2>
            {index === 0 ? (
              <img className="abl-pick-portrait" src="/erick-portrait-warm-v2.webp" alt="艾瑞克" width="160" height="160" loading="lazy" />
            ) : null}
            <div className="abl-sales-copy">
              {section.paragraphs.map((text) => <p key={text}>{text}</p>)}
            </div>
          </div>
        </section>
      ))}

      <section className="abl-sales-ending">
        <div className="abl-sales-inner abl-sales-ending-inner">
          <h2 className="abl-heading">想從哪裡開始</h2>
          <div className="abl-sales-ending-actions">
            {ABL_ABOUT_ACTIONS.map((action) => (
              <Link key={action.to} to={action.to} className={'abl-cta ' + (action.primary ? 'abl-sales-scroll' : 'abl-sales-line')}>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{ABL_ABOUT_CONTACT_TITLE}</h2>
          <div className="abl-sales-copy">
            <p>LINE：<a href={LINE_CONFIG.ABL_LINE_ADD_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">艾伯林量子調頻官方 LINE</a></p>
            <p>Email：<a href={'mailto:' + LEGAL_EMAIL} className="underline underline-offset-4">{LEGAL_EMAIL}</a></p>
          </div>
        </div>
      </section>

      <footer className="abl-sales-disclaimer">{ABL_ABOUT_DISCLAIMER}</footer>
      <AblLegalFooter />
    </main>
  );
};

export default AblAboutPage;
