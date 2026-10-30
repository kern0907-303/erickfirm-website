import { lineMessageUrl } from '../lib/constants.js';

// 平衡空間（生命數字）文章的 LINE 一律接平衡空間自己的官方帳號，不接 Erick Firm 帳號。
const NAS_LINE_ADD_URL = 'https://line.me/R/ti/p/@xyx9843q';
const NAS_LINE_TEXT = '加入平衡空間 LINE';

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
    btn2Text: NAS_LINE_TEXT,
    btn2Url: NAS_LINE_ADD_URL,
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
  btn2Text: NAS_LINE_TEXT,
  btn2Url: NAS_LINE_ADD_URL,
};

// 冷流量（2026-10-29 定）：卡點五型自我檢查是冷流量的入口，先看到自己的狀態，再用 LINE 登入看詳細解析。
// 計算器是超冷流量（supercold，破圈文章）的入口，零摩擦先算到東西。
export const NAS_QUIZ_CTA = {
  title: '你的生活，卡在哪一種狀態？',
  desc: '生活一直卡住，不是因為不夠努力。8 題，大約 2 分鐘，選完馬上知道自己卡在哪一種狀態，詳細解析用 LINE 登入免費看。',
  btn1Text: '做卡點五型自我檢查',
  btn1Url: '/nas/quiz',
  btn2Text: NAS_LINE_TEXT,
  btn2Url: NAS_LINE_ADD_URL,
};
// 舊名稱保留給既有引用
export const NAS_WARM_CTA = NAS_QUIZ_CTA;

/**
 * 把資料庫裡的值正規化成現在這兩層。
 *
 * 2026-10-30 改版：分層名稱改成 supercold（破圈，導計算器）與 cold（建立信任，導小測）。
 * 只處理 warm 這一個舊值，它過去代表建立信任，就是現在的 cold；
 * 舊的 cold（過去代表破圈）由資料庫一次性改成 supercold，不在這裡猜，
 * 否則同一個字串 cold 會有兩種意思。
 * @param {unknown} value
 * @returns {'supercold'|'cold'|null}
 */
export function normalizeFunnel(value) {
  const text = String(value || '').trim();
  if (text === 'supercold') return 'supercold';
  if (text === 'cold') return 'cold';
  if (text === 'warm') return 'cold';
  return null;
}

/**
 * @param {string} service 文章分類
 * @param {string} slug 文章代稱，用來做來源標記
 * @param {{ calculated?: boolean, funnel?: 'supercold'|'cold'|'warm'|null }} options
 *   calculated 讀者是否已經在計算器算過（瀏覽器記得生日）
 *   funnel 這篇屬於哪一層，由儀表板依海巡標記寫進資料庫
 *
 * 優先順序：行為 > 文章標記。
 * 已經算過的人不管文章哪一層，都往下一步（2027 年度導航）走，不再繞回計算器。
 * supercold（破圈）導免費計算器，零摩擦，輸入生日直接看結果。
 * cold（建立信任）導卡點五型自我檢查，8 題加 LINE 登入看詳細解析。
 * 沒有標記的文章退回該分類的通用 CTA，不猜一層給它。
 */
export function getCategoryCtaConfig(service, slug = '', { calculated = false, funnel = null } = {}) {
  const config = CATEGORY_CTA_CONFIG[service] || CATEGORY_CTA_CONFIG['personal-growth'];
  if (service !== 'life-number') return config;
  const tier = normalizeFunnel(funnel);
  // 來源標記帶上分層，後台才分得出造訪是哪一層帶來的
  const params = new URLSearchParams();
  if (slug) params.set('source', `nas-article-${slug}`);
  if (tier) params.set('funnel', tier);
  const query = params.toString();
  if (calculated) {
    return { ...NAS_NEXT_AFTER_CALCULATOR, btn1Url: query ? `/nas/2027?${query}` : '/nas/2027' };
  }
  if (tier === 'cold') {
    return { ...NAS_QUIZ_CTA, btn1Url: query ? `/nas/quiz?${query}` : '/nas/quiz' };
  }
  if (tier === 'supercold') {
    return { ...config, btn1Url: query ? `/nas/calculator/?${query}` : '/nas/calculator/' };
  }
  if (!query) return config;
  return { ...config, btn1Url: `/nas/calculator/?${query}` };
}
