import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import SEOHead from '../components/SEOHead';
import AblLegalFooter from '../components/AblLegalFooter';
import {
  INTRO, PRICE_TIERS, TIMELINE, HERO, PAIN, REFRAME, HOW,
  FOCUS_TITLE, FOCUS_HINT, CHECK_TITLE, CHECK_HINT, THEMES, FAQS,
} from '../content/abl2027Content';
import { LEGAL_SELLER_LINE, LEGAL_TAX_ID } from '../content/ablLegal';
import { readAblAttribution, withAblAttribution } from '../lib/ablAttribution';
import './AblSales.css';

const INDEXABLE = true;
const TITLE = '艾伯林量子調頻｜2027 年度頻率支持';
const DESCRIPTION = '休息了，卻還是回不到自己的狀態？選你這一年最想顧好的主題，頻率單獨為你設定、單獨發送，陪你一整年。';
const PUBLIC_CONFIG_URL = 'https://pay.erickfirm.com/api/public-config';
const CHECKOUT_URL = 'https://pay.erickfirm.com/?product=individual_single&focus=';
const OPEN_DATE_TEXT = '11\u00a0月\u00a010\u00a0日開放購買';

// 與收款後台 public/shared/catalogue.mjs 的 personalPrice 一致
const personalPrice = (count) => {
  if (count < 1 || count > 6) return 0;
  if (count === 1) return 2600;
  if (count === 6) return 11800;
  return 2200 * count;
};
const formatPrice = (value) => 'NT$' + new Intl.NumberFormat('zh-TW').format(value);
const tierOf = (count) => (count === 6 ? 'all' : count >= 2 ? 'multi' : count === 1 ? 'one' : '');
const priceBreakdown = (count) => {
  if (count === 6) return '6 個全選，比一個一個選省 NT$1,400';
  if (count >= 2) return count + ' 個 × NT$2,200';
  if (count === 1) return '1 個主題';
  return '';
};
const scrollToId = (id) => {
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 30);
};

const FocusAndChecks = ({ item }) => (
  <details className="abl-sales-seasons-wrap">
    <summary>看這個主題一整年的內容</summary>
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
  const [mode, setMode] = useState('');
  const open = useCheckoutOpen();
  const count = selected.length;
  const total = personalPrice(count);
  const currentTier = tierOf(count);
  const [attribution] = useState(readAblAttribution);
  const [showBar, setShowBar] = useState(() => typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const el = document.getElementById('themes');
    if (!el) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setShowBar(true); });
    }, { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const checkoutHref = useMemo(
    () => withAblAttribution(CHECKOUT_URL + encodeURIComponent(selected.join(',')), attribution),
    [selected, attribution],
  );

  const toggle = (code) => {
    if (mode === 'one') {
      setSelected((current) => (current.includes(code) ? [] : [code]));
      return;
    }
    setSelected((current) => (current.includes(code) ? current.filter((item) => item !== code) : [...current, code]));
  };
  const chooseTier = (tierMode) => {
    setMode(tierMode);
    if (tierMode === 'all') {
      setSelected(THEMES.map((theme) => theme.code));
      scrollToId('abl-pick-summary');
      return;
    }
    if (tierMode === 'one') setSelected((current) => current.slice(0, 1));
    if (tierMode === 'multi' && count === 6) setSelected([]);
    scrollToId('abl-pick-guide');
  };

  let guideStep = 1;
  let guideText = '在下方點選你想顧好的主題，點一下卡片就會打勾，可以選好幾個。';
  if (mode === 'one' && count === 0) {
    guideText = '請在下方點選 1 個主題，點一下卡片就會打勾。';
  } else if (mode === 'multi' && count < 2) {
    guideText = '請在下方點選 2 到 5 個主題。已選 ' + count + ' 個，再選 ' + (2 - count) + ' 個以上。';
  } else if (count > 0) {
    guideStep = 2;
    guideText = open === false
      ? '已選 ' + count + ' 個，金額 ' + formatPrice(total) + '。' + OPEN_DATE_TEXT + '，當天就能結帳。'
      : '已選 ' + count + ' 個，金額 ' + formatPrice(total) + '。往下按「前往結帳」就完成選擇。';
  }

  const ctaLabel = '前往結帳 ' + formatPrice(total);
  const renderCta = (className) => (open && count ? (
    <a className={className} href={checkoutHref}>{ctaLabel}</a>
  ) : (
    <span className={className + ' is-disabled'}>{open === false ? OPEN_DATE_TEXT : count ? '確認中…' : '先點選上面的主題'}</span>
  ));

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
            title={HERO.title}
            subtitle={HERO.subtitle}
            titleClassName="abl-heading abl-sales-title"
            subtitleClassName="abl-sales-subtitle"
          />
          <a className="abl-cta abl-sales-scroll" href="#abl-pains">{HERO.action}</a>
        </div>
      </section>

      <section id="abl-pains" className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{PAIN.title}</h2>
          <ul className="abl-pain-list">
            {PAIN.items.map((text) => <li key={text}>{text}</li>)}
          </ul>
          <p className="abl-pain-closing">{PAIN.closing}</p>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{REFRAME.title}</h2>
          <div className="abl-sales-copy">
            {REFRAME.paras.map((text) => <p key={text}>{text}</p>)}
          </div>
          <p className="abl-reframe-punch">{REFRAME.punch}</p>
          <p className="abl-reframe-after">{REFRAME.after}</p>
        </div>
      </section>

      <section className="abl-sales-section">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">{HOW.title}</h2>
          <div className="abl-sales-copy">
            {HOW.paras.map((text) => <p key={text}>{text}</p>)}
          </div>
          <div className="abl-honest">
            <h3>{HOW.honestTitle}</h3>
            {HOW.honest.map((text) => <p key={text}>{text}</p>)}
          </div>
        </div>
      </section>

      <section className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">誰替你設定</h2>
          <img className="abl-pick-portrait" src="/erick-portrait-warm-v2.webp" alt="艾瑞克" width="160" height="160" loading="lazy" />
          <div className="abl-sales-copy">
            <p>艾伯林量子調頻由艾瑞克負責。二十年身心領域的經驗，2018 年起投入頻率設備的調和工作。</p>
            <p>每一位客人的頻率，都是收到你的資料後親自設定，設定好才通知你。</p>
            <p><Link to="/abl/about" className="underline underline-offset-4">認識艾瑞克，看他怎麼看信息場與頻率</Link></p>
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


      <section className="abl-sales-section">
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


      <section id="themes" className="abl-sales-section abl-sales-section-muted">
        <div className="abl-sales-inner">
          <h2 className="abl-heading">選你這一年最想顧好的主題</h2>
          <div id="abl-pick-guide" className={'abl-pick-guide is-step-' + guideStep} aria-live="polite">
            <span className="abl-pick-guide-step">第 {guideStep} 步</span>
            <p>{guideText}</p>
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
                      <span className="abl-pick-tap">{isOn ? '已選，再點一次可取消' : '點這裡選這個主題'}</span>
                    </span>
                  </button>
                  <FocusAndChecks item={theme} />
                </article>
              );
            })}
          </div>
          <div id="abl-pick-summary" className={'abl-pick-summary' + (count ? ' is-active' : '')}>
            {count ? (
              <>
                <span className="abl-pick-summary-label">第 2 步　確認金額後結帳</span>
                <span className="abl-pick-summary-count">已選 {count} 個主題　{priceBreakdown(count)}</span>
                <strong key={total} className="abl-pick-summary-total">{formatPrice(total)}<small> / 年</small></strong>
                {count === 5 ? <em>再加 1 個只要多 NT$800，六個全拿</em> : null}
                {renderCta('abl-pick-summary-cta')}
                <span className="abl-pick-summary-refund">7 天內不滿意，全額退款，不問理由</span>
                <span className="abl-pick-summary-next">按下後填姓名與 Email，用信用卡付款。付款完成，畫面會帶你填寫設定資料。</span>
              </>
            ) : (
              <>
                <span className="abl-pick-summary-label">還沒選主題</span>
                <span className="abl-pick-summary-count">往上點選主題，金額會在這裡自動算好。</span>
              </>
            )}
          </div>
          <h3 className="abl-pick-tiers-title">價格怎麼算</h3>
          <div className="abl-pick-tiers" role="list">
            {PRICE_TIERS.map((tier) => (
              <div className={'abl-pick-tier' + (tier.highlight ? ' is-anchor' : '') + (currentTier === tier.mode ? ' is-current' : '')} role="listitem" key={tier.count}>
                {currentTier === tier.mode ? <span className="abl-pick-tier-badge">目前的計價</span> : null}
                <span className="abl-pick-tier-count">{tier.count}</span>
                <strong>{tier.price}<small>{tier.unit}</small></strong>
                <span className="abl-pick-tier-note">{tier.note}</span>
                <button type="button" className={'abl-pick-all' + (tier.highlight ? '' : ' is-outline')} onClick={() => chooseTier(tier.mode)}>{tier.action}</button>
              </div>
            ))}
          </div>
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

      <div className={'abl-pick-bar' + (count ? ' is-active' : '') + (showBar ? '' : ' is-hidden')}>
        <div className="abl-pick-bar-info">
          {count ? (
            <>
              <span>已選 {count} 個主題</span>
              <strong key={total}>{formatPrice(total)}<small> / 年</small></strong>
            </>
          ) : (
            <span>第 1 步：點選主題，金額自動算好</span>
          )}
        </div>
        {count ? renderCta('abl-pick-bar-cta') : (
          <a className="abl-pick-bar-cta is-ghost" href="#abl-pick-guide">去選主題</a>
        )}
      </div>
    </main>
  );
};

export default Abl2027Page;
