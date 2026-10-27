import { lineMessageUrl } from '../lib/constants.js';

// Shared by the React article page and the prerendered article output so copy
// and source-tagged destinations stay in sync.
export const CATEGORY_CTA_CONFIG = {
  'personal-growth': {
    title: '如果這篇讓你想到自己',
    desc: '狀態的事，通常不是再撐一下就會過去。與其繼續猜，不如先看清楚自己現在卡在哪一層。',
    btn1Text: '做 30 秒自評',
    btn1Url: 'https://erickfirm.com/#assessment',
    btn2Text: '加 LINE 輸入【168】',
    btn2Url: lineMessageUrl('168'),
  },
  'life-number': {
    title: '你自己的那一套，是怎麼運作的？',
    desc: '每個人的節奏、判斷方式與卡點位置本來就不同。硬套別人的方法會累，先看懂自己這一套比較快。',
    btn1Text: '先免費算一次',
    btn1Url: '/nas/calculator/',
    btn2Text: '加 LINE 輸入【168】',
    btn2Url: lineMessageUrl('168'),
  },
  'enterprise-doctor': {
    title: '如果你的公司也卡在同一個地方',
    desc: '多數瓶頸不是策略不夠好，而是結構裡有一段一直沒被看見。先確認該從哪一段查起，比急著改策略有用。',
    btn1Text: '做 30 秒盤點',
    btn1Url: 'https://erickfirm.com/#assessment',
    btn2Text: '預約聯繫',
    btn2Url: lineMessageUrl('168'),
  },
  'erick-column': {
    title: '想知道你現在該先解哪一題？',
    desc: '問題通常不只一個，但真正該先動的永遠只有一個。',
    btn1Text: '做 30 秒自評',
    btn1Url: 'https://erickfirm.com/#assessment',
    btn2Text: '加 LINE 輸入【168】',
    btn2Url: lineMessageUrl('168'),
  },
};

// 已經在計算器算過的人，看完文章不再被帶回計算器，改往下一步走（2026-10-26）。
export const NAS_NEXT_AFTER_CALCULATOR = {
  title: '你已經看過自己的雙軌了，接下來呢？',
  desc: '雙軌說的是你這個人；2027 年度導航說的是你這一年。依你的生日寫成，十二個月什麼時候衝、什麼時候收，再加上 365 能量氣象台每天晚上的提醒。',
  btn1Text: '看 2027 年度導航',
  btn1Url: '/nas/2027',
  btn2Text: '加 LINE 輸入【168】',
  btn2Url: lineMessageUrl('168'),
};

// 溫流量：讀者看過幾篇、已經有基本信任，這時候換名單才合理。
// 冷流量（破圈，讀者不認識作者）不要一上來就要 email，先讓他免費算到東西。
export const NAS_WARM_CTA = {
  title: '要不要看完整版的你？',
  desc: '計算器給的是雙軌結構，小測再往下一層：天賦、盲點，還有你現在走到的生命階段。留一個 email 就把完整解析寄給你。',
  btn1Text: '做生命數字小測',
  btn1Url: '/nas/quiz',
  btn2Text: '加 LINE 輸入【168】',
  btn2Url: lineMessageUrl('168'),
};

/**
 * @param {string} service 文章分類
 * @param {string} slug 文章代稱，用來做來源標記
 * @param {{ calculated?: boolean, funnel?: 'cold'|'warm'|null }} options
 *   calculated 讀者是否已經在計算器算過（瀏覽器記得生日）
 *   funnel 這篇是冷流量還是溫流量，由儀表板依海巡標記寫進資料庫
 *
 * 優先順序：行為 > 文章標記。
 * 已經算過的人不管文章是冷是暖，都往下一步（2027 年度導航）走，不再繞回計算器。
 * 沒算過而且文章標為溫流量，才導去要 email 的小測。
 * 其餘（冷流量或沒有標記）一律導免費計算器，零摩擦。
 */
export function getCategoryCtaConfig(service, slug = '', { calculated = false, funnel = null } = {}) {
  const config = CATEGORY_CTA_CONFIG[service] || CATEGORY_CTA_CONFIG['personal-growth'];
  if (service !== 'life-number') return config;
  // 來源標記帶上冷暖，後台才分得出造訪是哪一種流量帶來的
  const params = new URLSearchParams();
  if (slug) params.set('source', `nas-article-${slug}`);
  if (funnel === 'cold' || funnel === 'warm') params.set('funnel', funnel);
  const query = params.toString();
  if (calculated) {
    return { ...NAS_NEXT_AFTER_CALCULATOR, btn1Url: query ? `/nas/2027?${query}` : '/nas/2027' };
  }
  if (funnel === 'warm') {
    return { ...NAS_WARM_CTA, btn1Url: query ? `/nas/quiz?${query}` : '/nas/quiz' };
  }
  if (!query) return config;
  return { ...config, btn1Url: `/nas/calculator/?${query}` };
}
