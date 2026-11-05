// 艾伯林量子調頻：落地網址的 utm 與 fbclid 記住 90 天，並帶到結帳頁，訂單才知道從哪裡來
export const ABL_ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid'];
const STORAGE_KEY = 'abl_2027_order_attribution';
const TTL_MS = 90 * 86400000;

export function readAblAttribution() {
  if (typeof window === 'undefined') return {};
  const query = new URLSearchParams(window.location.search);
  const current = Object.fromEntries(ABL_ATTRIBUTION_KEYS
    .filter((key) => query.has(key) && query.get(key) !== '')
    .map((key) => [key, query.get(key)]));
  let saved = {};
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (parsed && Date.now() - Number(parsed.captured_at) <= TTL_MS) saved = parsed;
  } catch { /* optional */ }
  const hasUtm = ABL_ATTRIBUTION_KEYS.slice(0, 4).some((key) => Object.hasOwn(current, key));
  const next = hasUtm ? { ...current, captured_at: Date.now() }
    : Object.keys(current).length ? { ...saved, ...current, captured_at: saved.captured_at || Date.now() } : saved;
  if (Object.keys(current).length) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* optional */ }
  }
  return next;
}

export function withAblAttribution(href, attribution) {
  let result = href;
  for (const key of ABL_ATTRIBUTION_KEYS) {
    const value = attribution?.[key];
    if (typeof value === 'string' && value !== '') result += (result.includes('?') ? '&' : '?') + key + '=' + encodeURIComponent(value);
  }
  return result;
}
