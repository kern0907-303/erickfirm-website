import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeroTextReveal from '../components/HeroTextReveal';
import SEOHead from '../components/SEOHead';
import { NAS_LEGAL_BRAND, nasPrivacy, nasTerms } from '../content/nasLegal';
import './AblPage.css';
import './AblLegalPage.css';
import './NasSales.css';

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

// 平衡空間的服務條款與隱私權政策（/nas/terms、/nas/privacy），版型沿用 ABL 法務頁，換成 NAS 紫金色系。
const NasLegalPage = () => {
  const { pathname } = useLocation();
  const document = pathname.replace(/\/+$/, '') === '/nas/privacy' ? nasPrivacy : nasTerms;
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <main className="theme-abl theme-nas-2027 abl-legal-page nas-legal-page">
      <SEOHead title={document.title + '｜' + NAS_LEGAL_BRAND} description={document.description} exactTitle />
      <header className="abl-legal-hero">
        <Link className="abl-legal-back" to="/nas">返回平衡空間</Link>
        <div className="abl-logo-card">
          {!logoFailed ? (
            <img src="/logo-nas.png" alt={NAS_LEGAL_BRAND} width="500" height="500" loading="eager" className="abl-logo" onError={() => setLogoFailed(true)} />
          ) : (
            <span className="abl-logo-text">{NAS_LEGAL_BRAND}</span>
          )}
        </div>
        <p className="abl-legal-brand">{NAS_LEGAL_BRAND}</p>
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

export default NasLegalPage;
