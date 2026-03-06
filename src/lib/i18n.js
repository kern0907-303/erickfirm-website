const LOCALE_KEY = 'site-locale';
const SUPPORTED_LOCALES = ['zh-TW', 'en'];

export function normalizeLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : 'zh-TW';
}

export function getPreferredLocale() {
  if (typeof window === 'undefined') return 'zh-TW';
  return normalizeLocale(window.localStorage.getItem(LOCALE_KEY) || 'zh-TW');
}

export function setPreferredLocale(locale) {
  if (typeof window === 'undefined') return;
  const next = normalizeLocale(locale);
  window.localStorage.setItem(LOCALE_KEY, next);
  window.dispatchEvent(new CustomEvent('site-locale-change', { detail: next }));
}

export function onLocaleChange(callback) {
  if (typeof window === 'undefined') return () => {};

  const onCustom = (event) => callback(normalizeLocale(event.detail));
  const onStorage = (event) => {
    if (event.key === LOCALE_KEY) {
      callback(normalizeLocale(event.newValue || 'zh-TW'));
    }
  };

  window.addEventListener('site-locale-change', onCustom);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener('site-locale-change', onCustom);
    window.removeEventListener('storage', onStorage);
  };
}

export const i18n = {
  'zh-TW': {
    insights: '洞察智庫',
    insightsDesc: '依服務分艙閱讀，快速找到最相關的實戰文章',
    services: {
      all: '全部',
      'enterprise-doctor': '企業醫生',
      'life-number': '生命數字',
      'personal-growth': '個人成長',
    },
    fallbackHint: '目前使用備援內容',
    loadingInsights: '正在從 Notion 載入最新洞察...',
    noInsights: '目前沒有可顯示的文章',
    readMore: '閱讀更多',
    backToInsights: '返回洞察',
    loadingPost: '深度加載中...',
    postNotFound: '找不到文章',
    home: '首頁',
    consult: '預約諮詢',
    servicesMenu: '服務項目',
  },
  en: {
    insights: 'Insights',
    insightsDesc: 'Read by service silos to find the most relevant playbooks fast',
    services: {
      all: 'All',
      'enterprise-doctor': 'Enterprise Doctor',
      'life-number': 'Numerology',
      'personal-growth': 'Personal Growth',
    },
    fallbackHint: 'Using fallback content',
    loadingInsights: 'Loading latest insights from Notion...',
    noInsights: 'No articles available right now',
    readMore: 'READ MORE',
    backToInsights: 'Back to Insights',
    loadingPost: 'Loading post...',
    postNotFound: 'Post not found',
    home: 'Home',
    consult: 'Book a Consultation',
    servicesMenu: 'Services',
  },
};
