import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeroTextReveal from '../components/HeroTextReveal';
import SEOHead from '../components/SEOHead';
import { LEGAL_BRAND, privacy, terms } from '../content/ablLegal';
import './AblLegalPage.css';

const renderBlock = (block, index) => {
  if (block.type === 'p') return <p key={index}>{block.text}</p>;
  if (block.type === 'ul') {
    return <ul key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
  }
  if (block.type === 'card') {
    return (
      <address className="abl-legal-contact-card" key={index}>
        <p>{block.entity} / 統一編號 {block.taxId} / {block.email} / <a href={block.lineUrl} target="_blank" rel="noopener noreferrer">{block.lineLabel}</a></p>
      </address>
    );
  }
  return null;
};

const AblLegalPage = () => {
  const { pathname } = useLocation();
  const document = pathname.endsWith('/privacy') ? privacy : terms;
  const [logoFailed, setLogoFailed] = useState(false);
  const pageTitle = document.title + '｜' + LEGAL_BRAND;

  return (
    <main className="theme-abl abl-legal-page">
      <SEOHead title={pageTitle} description={document.description} exactTitle />
      <header className="abl-legal-hero">
        <Link className="abl-legal-back" to="/abl">返回艾伯林量子調頻</Link>
        <div className="abl-logo-card">
          {!logoFailed ? (
            <img
              src="/brand/abl-logo.png"
              alt={LEGAL_BRAND}
              width="500"
              height="500"
              loading="eager"
              className="abl-logo"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="abl-logo-text">{LEGAL_BRAND}</span>
          )}
        </div>
        <p className="abl-legal-brand">{LEGAL_BRAND}</p>
        <HeroTextReveal
          title={document.title}
          subtitle={'最後更新：' + document.lastUpdated}
          titleClassName="abl-heading abl-legal-title"
          subtitleClassName="abl-legal-updated"
        />
      </header>
      <article className="abl-legal-content">
        <p>{document.intro}</p>
        {document.sections.map((section) => (
          <section className="abl-legal-section" key={section.title}>
            <h2 className="abl-heading">{section.title}</h2>
            <div className="abl-legal-blocks">{section.blocks.map(renderBlock)}</div>
          </section>
        ))}
      </article>
    </main>
  );
};

export default AblLegalPage;
