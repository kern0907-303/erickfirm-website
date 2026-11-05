import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import ProductCheckoutButton from '../components/ProductCheckoutButton';
import SEOHead from '../components/SEOHead';
import AblLegalFooter from '../components/AblLegalFooter';
import { readAblAttribution, withAblAttribution } from '../lib/ablAttribution';
import './AblSales.css';

const INDEXABLE = false;
const TITLE = '艾伯林量子調頻｜空間調頻';
const DESCRIPTION = '空間調頻看的是一個地址的空間狀態，以及人在其中的使用方式，一年內分階段回看與調整。居家與 SOHO 每年 NT$8,800，工作室與辦公室每年 NT$16,800。';

const OPEN_DATE_TEXT = '11\u00a0月\u00a017\u00a0日開放購買';

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
  ['哪些空間適用？', '居家與 SOHO 選居家方案；個人工作室、辦公室、小店面選工作室方案。整層辦公室、餐廳、賣場等大型商業空間，請先在 LINE 洽詢。'],
  ['一個方案可以用在幾個地址？', '一個方案對應一個地址。'],
  ['付款後要做什麼？', '付款完成後，LINE 會傳一個填資料的連結，請上傳空間照片（每個主要區域一張），並填寫主要使用者的姓名與生日。我們依照片建立空間基準，設定好會用 LINE 通知你。'],
  ['照片和資料會保存多久？', '只用於這次服務，服務結束後 90 天刪除。'],
  ['空間調頻和個人年度頻率有什麼不同？', '個人年度頻率支持的是你自己的狀態，空間調頻看的是一個地址的空間。兩者可以分開選擇。'],
];

const AblSpacePage = () => {
  const [logoFailed, setLogoFailed] = useState(false);
  const [attribution] = useState(readAblAttribution);
  const checkoutFor = (code) => withAblAttribution('https://pay.erickfirm.com/?product=' + code, attribution);

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
          <a className="abl-cta abl-sales-scroll" href="#space-plans">看方案與價格</a>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">這是什麼</h2>
          <div className="abl-sales-copy">
            <p>空間調頻看的是一個地址的空間狀態，以及人在其中的使用方式。</p>
            <p>居家與 SOHO，個人工作室、辦公室與小店面，都可以選擇。大型商業空間請先在 LINE 洽詢。</p>
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

      <section id="space-plans" className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">方案</h2>
          <p className="abl-sales-lead">選一個方案按「前往結帳」，用 LINE 登入後信用卡付款。付款完成，LINE 會傳填資料的連結，照著填就好。</p>
          <article className="abl-card abl-sales-card abl-sales-space-plan">
            <h3 className="abl-heading">居家方案　<span className="whitespace-nowrap">NT$8,800 / 年 / 一個地址</span></h3>
            <div className="abl-sales-copy">
              <p>適用：居家、SOHO。</p>
              <p>一個方案對應一個地址。</p>
            </div>
            <ProductCheckoutButton code="space_reset_365" label="前往結帳 NT$8,800" closedText={OPEN_DATE_TEXT} checkoutUrl={checkoutFor('space_reset_365')} />
          </article>
          <article className="abl-card abl-sales-card abl-sales-space-plan">
            <h3 className="abl-heading">工作室方案　<span className="whitespace-nowrap">NT$16,800 / 年 / 一個地址</span></h3>
            <div className="abl-sales-copy">
              <p>適用：個人工作室、辦公室、小店面。</p>
              <p>一個方案對應一個地址。</p>
            </div>
            <ProductCheckoutButton code="space_reset_365_studio" label="前往結帳 NT$16,800" closedText={OPEN_DATE_TEXT} checkoutUrl={checkoutFor('space_reset_365_studio')} />
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
          <div className="abl-sales-ending-actions">
            <a className="abl-cta abl-sales-scroll" href="#space-plans">回到方案</a>
            <a className="abl-cta abl-sales-line" href={LINE_CONFIG.ABL_LINE_ADD_URL} target="_blank" rel="noopener noreferrer">加官方 LINE 問我們</a>
          </div>
        </div>
      </section>

      <footer className="abl-sales-disclaimer">空間調頻提供的是空間狀態的整理與支持，不是醫療、診斷或療效保證。</footer>
      <AblLegalFooter />
    </main>
  );
};

export default AblSpacePage;
