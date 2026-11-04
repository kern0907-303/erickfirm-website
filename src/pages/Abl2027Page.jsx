import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import SEOHead from '../components/SEOHead';
import AblLegalFooter from '../components/AblLegalFooter';
import {
  INTRO, PRICE_TIERS, TIMELINE, BUY_STEPS, WHY_SINGLE,
  FOCUS_TITLE, FOCUS_HINT, CHECK_TITLE, CHECK_HINT, THEMES, FAQS,
} from '../content/abl2027Content';
import { LEGAL_SELLER_LINE, LEGAL_TAX_ID } from '../content/ablLegal';
import './AblSales.css';

const INDEXABLE = true;
const TITLE = '艾伯林量子調頻｜2027 年度頻率支持';
const DESCRIPTION = '選你這一年最想顧好的主題，頻率單獨為你設定、單獨發送。選 1 個 NT$2,600，2 到 5 個每個 NT$2,200，6 個全選 NT$11,800。';
const PUBLIC_CONFIG_URL = 'https://pay.erickfirm.com/api/public-config';
const CHECKOUT_URL = 'https://pay.erickfirm.com/?product=individual_single&focus=';
const OPEN_DATE_TEXT = '11 月 10 日開放購買';

// 與收款後台 public/shared/catalogue.mjs 的 personalPrice 一致
const personalPrice = (count) => {
  if (count < 1 || count > 6) return 0;
  if (count === 1) return 2600;
  if (count === 6) return 11800;
  return 2200 * count;
};
const formatPrice = (value) => 'NT$' + new Intl.NumberFormat('zh-TW').format(value);

const FocusAndChecks = ({ item }) => (
  <details className="abl-sales-seasons-wrap">
    <summary>看四句焦點與四季檢視</summary>
    <p className="abl-sales-subhead">{FOCUS_TITLE}<small>{FOCUS_HINT}</small></p>
    <ol className="abl-sales-focus">
      {item.focus.map((sentence) => <li key={sentence}>{sentence}</li>)}
    </ol>
    <p className="abl-sales-subhead">{CHECK_TITLE}<small>{CHECK_HINT}</small></p>
    <ul className="abl-sales-seasons">
      {item.checks.map(([season, title, question]) => (
        <li key={season}><b>{season}　{title}</b><span>{question}</span></li>
      ))}
    </ul>
  </details>
);

const useCheckoutOpen = () => {
  const [open, setOpen] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4000);
    fetch(PUBLIC_CONFIG_URL, { cache: 'no-store', signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const product = Array.isArray(data?.products) ? data.products.find((item) => item?.code === 'individual_single') : null;
        setOpen(product?.status === 'open');
      })
      .catch(() => setOpen(false))
      .finally(() => window.clearTimeout(timer));
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, []);
  return open;
};

const Abl2027Page = () => {
  const [logoFailed, setLogoFailed] = useState(false);
  const [selected, setSelected] = useState([]);
  const open = useCheckoutOpen();
  const total = personalPrice(selected.length);
  const checkoutHref = useMemo(() => CHECKOUT_URL + encodeURIComponent(selected.join(',')), [selected]);

  const toggle = (code) => {
    setSelected((current) => (current.includes(code) ? current.filter((item) => item !== code) : [...current, code]));
  };
  const selectAll = () => {
    setSelected(THEMES.map((theme) => theme.code));
    document.getElementById('themes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="theme-abl abl-sales-page">
      <SEOHead title={TITLE} description={DESCRIPTION} exactTitle noindex={!INDEXABLE} />

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
            title="這一年，你最想先顧好哪一件事？"
            subtitle="選好主題，頻率單獨為你設定、單獨發送，陪你走完 2027 一整年。"
            titleClassName="abl-heading abl-sales-title"
            subtitleClassName="abl-sales-subtitle"
          />
          <a className="abl-cta abl-sales-scroll" href="#themes">開始選主題</a>
        </div>
      </section>

      <section id="themes" className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">點選你想顧好的主題</h2>
          <p className="abl-sales-lead">可以選好幾個，價格會自動算好。</p>
          <div className="abl-pick-tiers" role="list">
            {PRICE_TIERS.map((tier) => (
              <div className={'abl-pick-tier' + (tier.highlight ? ' is-anchor' : '')} role="listitem" key={tier.count}>
                <span className="abl-pick-tier-count">{tier.count}</span>
                <strong>{tier.price}<small>{tier.unit}</small></strong>
                <span className="abl-pick-tier-note">{tier.note}</span>
                {tier.highlight ? <button type="button" className="abl-pick-all" onClick={selectAll}>一鍵全選六個</button> : null}
              </div>
            ))}
          </div>
          <div className="abl-pick-grid">
            {THEMES.map((theme) => {
              const isOn = selected.includes(theme.code);
              return (
                <article className={'abl-pick-card' + (isOn ? ' is-selected' : '')} key={theme.code}>
                  <button type="button" className="abl-pick-toggle" aria-pressed={isOn} onClick={() => toggle(theme.code)}>
                    <span className="abl-pick-check" aria-hidden="true">{isOn ? '✓' : '+'}</span>
                    <span className="abl-pick-icon" aria-hidden="true">{theme.icon}</span>
                    <span className="abl-pick-text">
                      <b>{theme.name}</b>
                      <span>{theme.line}</span>
                      <small>{theme.fit}</small>
                    </span>
                  </button>
                  <FocusAndChecks item={theme} />
                </article>
              );
            })}
          </div>
          <p className="abl-sales-note">{WHY_SINGLE}</p>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">買了之後，會發生什麼</h2>
          <div className="abl-sales-copy">{INTRO.map((text) => <p key={text}>{text}</p>)}</div>
          <ol className="abl-pick-timeline">
            {TIMELINE.map(([when, what]) => (
              <li key={when}><b>{when}</b><span>{what}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">誰替你設定</h2>
          <img className="abl-pick-portrait" src="/erick-portrait-warm-v2.webp" alt="艾瑞克" width="160" height="160" loading="lazy" />
          <div className="abl-sales-copy">
            <p>艾伯林量子調頻由艾瑞克負責。二十年身心領域的經驗，2018 年起投入頻率設備的調和工作。</p>
            <p>每一位客人的頻率，都是收到你的資料後親自設定，設定好才通知你。</p>
          </div>
          <ul className="abl-pick-trust">
            <li><b>7 日內不問理由全額退款</b><span>付款日起 7 日內，透過 LINE 或 Email 申請。</span></li>
            <li><b>綠界科技信用卡付款</b><span>我們看不到，也不會儲存你的卡號。</span></li>
            <li><b>資料只用於設定</b><span>照片與個人資料存放在不公開的空間，服務結束後 90 天刪除。</span></li>
            <li><b>價格對每個人都一樣</b><span>沒有折扣碼，也沒有限時漲價。</span></li>
            <li><b>賣方資訊</b><span>{LEGAL_SELLER_LINE}，統一編號 {LEGAL_TAX_ID}。</span></li>
          </ul>
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
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">常見問題</h2>
          <div className="abl-sales-faqs">
            {FAQS.map(([question, answer]) => (
              <details className="abl-sales-faq" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="abl-sales-ending">
        <div className="abl-sales-inner abl-sales-ending-inner">
          <h2 className="abl-heading">還在猶豫選哪一個？</h2>
          <p>加官方 LINE，輸入 1，我們用兩個小問題幫你找到最適合的主題。</p>
          <div className="abl-sales-ending-actions">
            <a className="abl-cta abl-sales-scroll" href="#themes">回到選主題</a>
            <a className="abl-cta abl-sales-line" href={LINE_CONFIG.ABL_LINE_ADD_URL} target="_blank" rel="noopener noreferrer">加官方 LINE 問我們</a>
          </div>
        </div>
      </section>

      <footer className="abl-sales-disclaimer">頻率支持不是醫療、診斷或療效保證。</footer>
      <AblLegalFooter />

      <div className={'abl-pick-bar' + (selected.length ? ' is-active' : '')} aria-live="polite">
        <div className="abl-pick-bar-info">
          {selected.length ? (
            <>
              <span>已選 {selected.length} 個主題</span>
              <strong>{formatPrice(total)}<small> / 年</small></strong>
              {selected.length === 5 ? <em>再加 1 個只要多 NT$800，六個全拿</em> : null}
            </>
          ) : (
            <span>先點選上面的主題</span>
          )}
        </div>
        {open && selected.length ? (
          <a className="abl-pick-bar-cta" href={checkoutHref}>前往結帳</a>
        ) : (
          <span className="abl-pick-bar-soon">{open === false ? OPEN_DATE_TEXT : selected.length ? '確認中…' : '選好就能結帳'}</span>
        )}
      </div>
    </main>
  );
};

export default Abl2027Page;
