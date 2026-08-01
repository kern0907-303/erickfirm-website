const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const BRAND_TO_SERVICE = {
  i8: 'enterprise-doctor',
  nas: 'life-number',
  abl: 'personal-growth',
  erick: 'erick-column',
};

const slugify = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
  .replace(/^-+|-+$/g, '');

const excerptFrom = (content = '', length = 150) => {
  const text = content
    .replace(/^#+\s+.+$/gm, '')
    .replace(/#\S+/g, '')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

const parseMarkdownToBlocks = (markdown = '') => markdown
  .split(/\r?\n/)
  .filter((line) => line.trim() && !line.trim().startsWith('```'))
  .map((line, index) => {
    const text = line.trim();
    const id = `supabase-${index}`;
    if (text.startsWith('### ')) return { id, type: 'heading_3', text: text.slice(4) };
    if (text.startsWith('## ')) return { id, type: 'heading_2', text: text.slice(3) };
    if (text.startsWith('# ')) return { id, type: 'heading_1', text: text.slice(2) };
    if (/^[-*]\s+/.test(text) || /^\d+\.\s+/.test(text)) return { id, type: 'bulleted_list_item', text: text.replace(/^([-*]|\d+\.)\s+/, '') };
    return { id, type: 'paragraph', text };
  });

const parseTags = (content = '') => [...new Set(
  (content.replace(/```[\s\S]*?```/g, '').match(/#\S+/g) || [])
    .map((tag) => tag.slice(1).replace(/['",.;:!?()\[\]{}]/g, '').trim())
    .filter(Boolean),
)];

export const isSupabaseInsightsConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const mapSupabaseArticle = (article, locale = 'zh-TW') => ({
  id: article.id,
  title: article.title || 'Untitled',
  excerpt: excerptFrom(article.content),
  slug: article.slug || slugify(article.title) || article.id,
  service: BRAND_TO_SERVICE[article.brand_id] || 'personal-growth',
  publishDate: article.publish_date || article.created_at?.slice(0, 10) || '',
  tags: parseTags(article.content),
  status: article.status || 'published',
  locale,
  canonicalKey: article.id,
  alternateLocales: [],
  format: 'Article',
  aeoSchema: article.aeo_schema || '',
  aeoFaq: article.aeo_faq || '',
  blocks: parseMarkdownToBlocks(article.content),
  faqBlocks: parseMarkdownToBlocks(article.aeo_faq),
});

async function request(query) {
  if (!isSupabaseInsightsConfigured()) throw new Error('Supabase browser configuration is missing');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/insights_articles?${query}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!response.ok) throw new Error(`Supabase request failed: ${response.status}`);
  return response.json();
}

export async function fetchSupabasePosts(locale) {
  const articles = await request('brand_id=in.(erick,i8,nas,abl)&status=eq.published&order=created_at.desc');
  return articles.map((article) => mapSupabaseArticle(article, locale));
}

export async function fetchSupabasePost({ id, service, slug }, locale) {
  const posts = await fetchSupabasePosts(locale);
  const post = id ? posts.find((item) => item.id === id) : posts.find((item) => item.service === service && item.slug === slug);
  if (!post) throw new Error('Post not found');
  return { page: post, blocks: post.blocks, faqBlocks: post.faqBlocks, posts };
}
