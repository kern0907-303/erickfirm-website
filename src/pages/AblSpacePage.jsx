import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import ProductCheckoutButton from '../components/ProductCheckoutButton';
import SEOHead from '../components/SEOHead';
import './AblSales.css';

const INDEXABLE = false;
const TITLE = '艾伯林量子調頻｜空間調頻';
const DESCRIPTION = '空間調頻看的是一個地址的空間狀態，以及人在其中的使用方式，一年內分階段回看與調整。';

const TIMELINE = [
  '第 0 天　建立空間基準',
  '第 30 天　第一次回看',
  '第 60 天　第二次調整',
  '第 90 天　建立新的基準',
  '第 180 天　半年檢視',
  '第 270 天　再校準',
  '第 360 天　年度回顧',
];

const FAQS = [
  ['哪些空間適用？', '第一輪適用居家、SOHO、個人工作室。大型商業空間目前不在第一輪範圍。'],
  ['一個方案可以用在幾個地址？', '一個方案對應一個地址。'],
  ['空間調頻和個人年度頻率有什麼不同？', '個人年度頻率支持的是你自己的狀態，空間調頻看的是一個地址的空間。兩者可以分開選擇。'],
];

const AblSpacePage = () => {
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
            title="把每天所在的空間，慢慢調成你需要的樣子"
            subtitle="艾伯林量子調頻 空間調頻，一個地址，一整年，分階段回看與調整。"
            titleClassName="abl-heading abl-sales-title"
            subtitleClassName="abl-sales-subtitle"
          />
          <a className="abl-cta abl-sales-scroll" href="#space-year">看一年怎麼走</a>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">這是什麼</h2>
          <div className="abl-sales-copy">
            <p>空間調頻看的是一個地址的空間狀態，以及人在其中的使用方式。</p>
            <p>第一輪適用居家、SOHO、個人工作室。大型商業空間目前不在第一輪範圍。</p>
          </div>
        </div>
      </section>

      <section id="space-year" className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">一年怎麼走</h2>
          <ol className="abl-sales-timeline">
            {TIMELINE.map((stage) => <li className="abl-card abl-sales-card" key={stage}>{stage}</li>)}
          </ol>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">每次回看，只回答四件事</h2>
          <ul className="abl-sales-four-items">
            <li className="abl-card abl-sales-card">哪裡有改變</li>
            <li className="abl-card abl-sales-card">哪裡維持住</li>
            <li className="abl-card abl-sales-card">哪裡又偏掉</li>
            <li className="abl-card abl-sales-card">下一階段調整什麼</li>
          </ul>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">方案</h2>
          <article className="abl-card abl-sales-card abl-sales-space-plan">
            <h3 className="abl-heading">空間調頻　NT$8,800 / 年 / 一個地址</h3>
            <div className="abl-sales-copy">
              <p>適用：居家、SOHO、個人工作室。</p>
              <p>一個方案對應一個地址。</p>
            </div>
            <ProductCheckoutButton code="space_reset_365" label="前往結帳" />
          </article>
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
          <p>想先確認你的空間適不適合，先加 LINE，我們一起看。</p>
          <a className="abl-cta abl-sales-line" href={LINE_CONFIG.LINE_ADD_URL} target="_blank" rel="noopener noreferrer">加 LINE，開放時通知我</a>
        </div>
      </section>

      <footer className="abl-sales-disclaimer">空間調頻提供的是空間狀態的整理與支持，不是醫療、診斷或療效保證。</footer>
    </main>
  );
};

export default AblSpacePage;
