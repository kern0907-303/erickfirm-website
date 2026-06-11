const SERVICE_MAP = {
  '企業醫生': 'enterprise-doctor',
  '生命數字': 'life-number',
  '生命藍圖規劃': 'life-number',
  '個人藍圖規劃': 'life-number',
  '個人成長': 'personal-growth',
  '個人頻率校準': 'personal-growth',
  '能量氣象站': 'personal-growth',
  'enterprise doctor': 'enterprise-doctor',
  'numerology': 'life-number',
  'life blueprint planning': 'life-number',
  'personal blueprint planning': 'life-number',
  'life number': 'life-number',
  'personal growth': 'personal-growth',
  'enterprise-doctor': 'enterprise-doctor',
  'life-number': 'life-number',
  'personal-growth': 'personal-growth',
  '專欄': 'erick-column',
  'erick 專欄': 'erick-column',
  'erick專欄': 'erick-column',
  'erick column': 'erick-column',
  'erick-column': 'erick-column',
};

function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readLocalizedText(value, locale) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return value[locale] || value['zh-TW'] || value.en || '';
  return '';
}

function normalizeService(raw) {
  const key = String(raw || '').trim();
  const lower = key.toLowerCase();
  return SERVICE_MAP[key] || SERVICE_MAP[lower] || 'personal-growth';
}

export function getServiceNameFromSlug(service, locale, i18n) {
  return i18n[locale]?.services?.[service] || service;
}

export function normalizePost(raw, locale = 'zh-TW') {
  const service = normalizeService(raw.service || raw.project || raw.category);
  const title = readLocalizedText(raw.title, locale) || 'Untitled';
  const excerpt = readLocalizedText(raw.excerpt, locale);
  const slugBase = readLocalizedText(raw.slug, locale) || raw.slug || title;
  const id = raw.id || `fallback-${slugify(slugBase)}`;
  const slug = slugify(slugBase) || slugify(title) || id;

  const projectTagMap = {
    'zh-TW': {
      'enterprise-doctor': '企業醫生',
      'life-number': '生命藍圖',
      'personal-growth': '個人成長',
      'erick-column': '專欄',
    },
    'en': {
      'enterprise-doctor': 'Enterprise Doctor',
      'life-number': 'Life Blueprint',
      'personal-growth': 'Personal Growth',
      'erick-column': 'Column',
    }
  };
  const projectTag = projectTagMap[locale]?.[service] || projectTagMap['zh-TW']?.[service];
  const rawTags = Array.isArray(raw.tags) ? raw.tags : [];
  const tags = [...rawTags];
  if (projectTag && !tags.includes(projectTag)) {
    tags.unshift(projectTag);
  }

  return {
    id,
    slug,
    service,
    tags,
    locale: raw.locale || locale,
    canonicalKey: raw.canonicalKey || id,
    alternateLocales: Array.isArray(raw.alternateLocales) ? raw.alternateLocales : [],
    title,
    excerpt,
    publishDate: raw.publishDate || '',
    format: raw.format || 'Article',
    blocks: Array.isArray(raw.blocks) ? raw.blocks : [],
  };
}

export function normalizePosts(list, locale = 'zh-TW') {
  return (Array.isArray(list) ? list : []).map((item) => normalizePost(item, locale));
}

export function findPostByRoute(posts, { service, slug, id }) {
  if (id) return posts.find((item) => item.id === id) || null;
  return posts.find((item) => item.service === service && item.slug === slug) || null;
}
