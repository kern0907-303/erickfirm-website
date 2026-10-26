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

export function getCategoryCtaConfig(service, slug = '', { calculated = false } = {}) {
  const config = CATEGORY_CTA_CONFIG[service] || CATEGORY_CTA_CONFIG['personal-growth'];
  if (service !== 'life-number') return config;
  const source = slug ? new URLSearchParams({ source: `nas-article-${slug}` }).toString() : '';
  if (calculated) {
    return { ...NAS_NEXT_AFTER_CALCULATOR, btn1Url: source ? `/nas/2027?${source}` : '/nas/2027' };
  }
  if (!slug) return config;
  return { ...config, btn1Url: `/nas/calculator/?${source}` };
}
