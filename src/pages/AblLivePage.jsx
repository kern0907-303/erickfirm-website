import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import SEOHead from '../components/SEOHead';
import AblLegalFooter from '../components/AblLegalFooter';
import {
  LIVE_NAME, LIVE_SUBTITLE, LIVE_FALLBACK_WHEN, LIVE_CAPACITY, LIVE_PRICE,
  LIVE_HERO, LIVE_PAIN, LIVE_REFRAME, LIVE_GAINS, LIVE_LOSS, LIVE_HOST, LIVE_HOW, LIVE_RISK, LIVE_CLOSE,
} from '../content/ablLiveContent';
import { readAblAttribution, withAblAttribution } from '../lib/ablAttribution';
import './AblSales.css';
import './AblLive.css';

const TITLE = `${LIVE_NAME}｜艾伯林量子調頻線上體驗會`;
const DESCRIPTION = '你在等一個翻身的機會，只是不知道它什麼時候來。線上 80 分鐘，看清楚六個年度頻率裡，哪一個是你現在最需要的。';
const STATUS_URL = 'https://pay.erickfirm.com/api/abl-live/status';
const CHECKOUT_URL = 'https://pay.erickfirm.com/abl/live/';

// 讀取報名狀態：開放、額滿、剩幾位。讀不到時照常顯示報名按鈕，由結帳頁再確認一次。
const useLiveStatus = () => {
  const [status, setStatus] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(STATUS_URL, { cache: 'no-store', signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => { if (body) setStatus(body); })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return status;
};

const AblLivePage = () => {
  const status = useLiveStatus();
  const [attribution] = useState(readAblAttribution);
  const [logoFailed, setLogoFailed] = useState(false);
  const [showBar, setShowBar] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const el = document.getElementById('live-gains');
    if (!el) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setShowBar(true); });
    }, { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const checkoutHref = useMemo(() => withAblAttribution(CHECKOUT_URL, attribution), [attribution]);
  const when = status?.starts_text || LIVE_FALLBACK_WHEN;
  const price = status?.price_twd || LIVE_PRICE;
  const capacity = status?.capacity || LIVE_CAPACITY;
  const full = status?.full === true;
  const closed = status?.closed === true;
  const seatsLeft = Number.isFinite(status?.seats_left) ? status.seats_left : null;
  const seatsText = full ? '這一場已經額滿'
    : closed ? '這一場已經截止報名'
      : seatsLeft !== null && seatsLeft <= 10 ? `只剩 ${seatsLeft} 位`
        : `每場限 ${capacity} 位，額滿就關閉報名`;

  const onCheckout = () => {
    window.efMetaEvent?.('InitiateCheckout', { value: price, currency: 'TWD', content_category: 'abl_live' });
  };

  const renderCta = (className, label) => (full || closed ? (
    <span className={className + ' is-disabled'}>{full ? '已額滿' : '已截止'}</span>
  ) : (
    <a className={className} href={checkoutHref} onClick={onCheckout}>{label}</a>
  ));

  return (
    <main className="theme-abl abl-sales-page abl-live-page">
      <SEOHead title={TITLE} description={DESCRIPTION} exactTitle />

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
          <p className="abl-live-badge">{LIVE_NAME}{LIVE_SUBTITLE.split('｜').map((part) => <span key={part}>{part}</span>)}</p>
          <HeroTextReveal
            title={LIVE_HERO.title}
            subtitle={LIVE_HERO.subtitle}
            titleClassName="abl-heading abl-sales-title"
            subtitleClassName="abl-sales-subtitle"
          />
          <a className="abl-cta abl-sales-scroll" href="#live-pains">{LIVE_HERO.action}</a>
        </div>
      </section>

      <section id="live-pains" className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{LIVE_PAIN.title}</h2>
          <ul className="abl-pain-list">
            {LIVE_PAIN.items.map((text) => <li key={text}>{text}</li>)}
          </ul>
          <p className="abl-pain-closing">{LIVE_PAIN.closing}</p>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{LIVE_REFRAME.title}</h2>
          <div className="abl-sales-copy">
            {LIVE_REFRAME.paras.map((text) => <p key={text}>{text}</p>)}
          </div>
          <ul className="abl-live-themes">
            {LIVE_REFRAME.themes.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </div>
      </section>

      <section id="live-gains" className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{LIVE_GAINS.title}</h2>
          <ol className="abl-live-gains">
            {LIVE_GAINS.items.map((text) => <li key={text}>{text}</li>)}
          </ol>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{LIVE_LOSS.title}</h2>
          <div className="abl-sales-copy">
            {LIVE_LOSS.paras.map((text) => <p key={text}>{text}</p>)}
          </div>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{LIVE_HOST.title}</h2>
          <img className="abl-pick-portrait" src="/erick-portrait-warm-v2.webp" alt="艾瑞克" width="160" height="160" loading="lazy" />
          <div className="abl-sales-copy">
            {LIVE_HOST.paras.map((text) => <p key={text}>{text}</p>)}
            <p><Link to="/abl/about" className="underline underline-offset-4">認識艾瑞克，看他怎麼看信息場與頻率</Link></p>
          </div>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{LIVE_HOW.title}</h2>
          <p className="abl-live-when">📅 {when}</p>
          <div className="abl-sales-copy">
            {LIVE_HOW.paras.map((text) => <p key={text}>{text}</p>)}
          </div>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{LIVE_RISK.title}</h2>
          <div className="abl-sales-copy"><p>{LIVE_RISK.text}</p></div>
        </div>
      </section>

      <section id="live-signup" className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner abl-live-signup">
          <h2 className="abl-heading">報名</h2>
          <p className={'abl-live-seats' + (seatsLeft !== null && seatsLeft <= 10 ? ' is-low' : '')}>{seatsText}</p>
          <p className="abl-live-price">報名費 NT${price}</p>
          <p className="abl-live-close">{LIVE_CLOSE.line}</p>
          {renderCta('abl-cta abl-live-cta', '我要報名')}
          <p className="abl-live-note">下一步填姓名與 Email，以信用卡付款，約一分鐘完成。</p>
        </div>
      </section>

      <section className="abl-sales-ending">
        <div className="abl-sales-inner abl-sales-ending-inner">
          <h2 className="abl-heading">還有問題？</h2>
          <p>加官方 LINE 留言，我們會回覆你。</p>
          <div className="abl-sales-ending-actions">
            <a className="abl-cta abl-sales-line" href={LINE_CONFIG.ABL_LINE_ADD_URL} target="_blank" rel="noopener noreferrer">加官方 LINE 問我們</a>
          </div>
        </div>
      </section>

      <footer className="abl-sales-disclaimer">頻率支持不是醫療、診斷或療效保證。</footer>
      <AblLegalFooter />

      <div className={'abl-pick-bar is-active' + (showBar ? '' : ' is-hidden')}>
        <div className="abl-pick-bar-info">
          <span>{when}</span>
          <strong>NT${price}</strong>
          <em>{seatsText}</em>
        </div>
        {renderCta('abl-pick-bar-cta', '我要報名')}
      </div>
    </main>
  );
};

export default AblLivePage;
