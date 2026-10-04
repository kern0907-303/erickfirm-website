// scripts/build-static-pages.js
// 把每篇已發布文章預渲染成靜態 HTML，讓不執行 JavaScript 的 AI 爬蟲讀得到全文。
//
// 這一版修掉三個問題：
// 1. 舊版只抓殼裡的 <script>，沒帶 CSS——從外部連結直接進文章頁的人看到的是沒有樣式的頁面。
//    現在改用完整的殼（prerender-shell.js），CSS、字型、全站身份資料都保留。
// 2. 舊版讀文章「列表」API，但列表不含內文，所以每篇都退回只放摘要（約 150 字）。
//    現在逐篇讀「單篇」API 取得內文區塊。
// 3. 舊版讀區塊文字的欄位名稱跟 API 實際格式對不上（API 是 b.paragraph.rich_text[0].plain_text），
//    所以就算有區塊也讀不出字。現在兩種格式都支援。
// 另外新增 Article 與 FAQPage 結構化資料，讓 AI 知道作者是誰、能直接引用問答。
import path from 'node:path';
import { getPostImage, getPostPath, getPostUrl } from '../src/lib/insights-adapter.js';
import { getArticleBlocks, getArticleDescription, parseArticleFaq } from '../src/lib/article-content.js';
import { getPostDetail, listPosts } from '../functions/_middleware.js';
import { SITE, PERSON_ID, esc, loadShell, renderPage, writePage, breadcrumb } from './prerender-shell.js';

const source = process.env.INSIGHTS_API_URL || 'https://erickfirm.com/.netlify/functions/notion?lang=zh-TW';
const supabaseEnv = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
};
if (process.env.CF_PAGES === '1' && !supabaseEnv.SUPABASE_KEY) {
  throw new Error('Cloudflare Pages build requires SUPABASE_KEY; refusing to fetch from Netlify.');
}
const dist = path.resolve('dist');
const SERVICE_NAME = {
  'life-number': '生命數字',
  'personal-growth': '個人成長',
  'enterprise-doctor': '企業醫生',
  'erick-column': 'Erick 專欄',
};

// 區塊文字：新格式 b[type].rich_text[0].plain_text，舊格式 b.text / b.content / b.plain_text
// 行內 Markdown：先跳脫，再還原 **粗體** 與 [文字](連結)
const inline = (t) => esc(t)
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, href) => `<a href="${href}">${txt}</a>`)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

function renderBlocks(blocks = [], title = '') {
  if (!Array.isArray(blocks)) return '';
  const out = [];
  let list = [];
  const flush = () => { if (list.length) { out.push(`<ul>${list.join('')}</ul>`); list = []; } };
  for (const { type, text } of getArticleBlocks(blocks, title)) {
    if (!text) continue;
    if (type.includes('list') || type === 'li') { list.push(`<li>${inline(text)}</li>`); continue; }
    flush();
    if (type.includes('heading_1') || type.includes('heading_2') || type === 'h1' || type === 'h2') out.push(`<h2 class="text-2xl font-bold mt-10 mb-4 text-slate-900 border-l-4 border-accent pl-4 font-display">${inline(text)}</h2>`);
    else if (type.includes('heading_3') || type === 'h3') out.push(`<h3 class="text-xl font-bold mt-8 mb-4 text-slate-900 font-display">${inline(text)}</h3>`);
    else if (type.includes('quote')) out.push(`<blockquote>${inline(text)}</blockquote>`);
    else out.push(`<p>${inline(text)}</p>`);
  }
  flush();
  return out.join('');
}

// aeo_schema 可能是 <script> 包好的，也可能是裸 JSON。解析得出來才放，解析不了寧可不放，
// 避免把壞掉的標記塞進 <head>（舊版是原封不動直接插入）。
function parseSchema(raw = '') {
  const s = String(raw || '').trim();
  if (!s) return [];
  const chunks = s.includes('<script')
    ? [...s.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1])
    : [s];
  const objs = [];
  for (const c of chunks) {
    try { const o = JSON.parse(c); objs.push(...(Array.isArray(o) ? o : [o])); } catch { /* 略過壞掉的 */ }
  }
  return objs;
}

function normalizeCustomSchema(value, description) {
  if (Array.isArray(value)) return value.map((entry) => normalizeCustomSchema(entry, description)).filter(Boolean);
  if (!value || typeof value !== 'object') return value;
  const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
  if (types.includes('FAQPage')) return null;
  const normalized = { ...value };
  if (types.some((type) => ['Article', 'BlogPosting', 'NewsArticle', 'WebPage'].includes(type)) && normalized.description) {
    normalized.description = description;
  }
  if (Array.isArray(normalized['@graph'])) {
    normalized['@graph'] = normalized['@graph'].map((entry) => normalizeCustomSchema(entry, description)).filter(Boolean);
  }
  return normalized;
}

async function fetchDetail(id) {
  if (supabaseEnv.SUPABASE_KEY) return getPostDetail(supabaseEnv, id);
  const u = new URL(source);
  u.searchParams.set('postId', id);
  const res = await fetch(u);
  if (!res.ok) throw new Error(`status ${res.status}`);
  return res.json();
}

const data = supabaseEnv.SUPABASE_KEY
  ? { posts: await listPosts(supabaseEnv) }
  : await (async () => {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Static article source returned ${response.status}`);
    return response.json();
  })();
const posts = (data.posts || data.results || []).filter((post) => post.status === 'published');
const shell = loadShell(dist);

let withBody = 0;
let withFaq = 0;
for (const post of posts) {
  const route = getPostPath(post);
  const url = getPostUrl(post);
  const image = getPostImage(post);
  const title = post.title.includes('Erick Firm') ? post.title : `${post.title} | Erick Firm`;
  let blocks = post.blocks;
  if (!Array.isArray(blocks) || !blocks.length) {
    try { blocks = (await fetchDetail(post.id))?.blocks || []; }
    catch (e) { console.warn(`  ⚠ ${post.title}：讀不到內文（${e.message}），改用摘要`); blocks = []; }
  }
  const description = getArticleDescription(blocks, post.title);
  const bodyHtml = renderBlocks(blocks, post.title);
  if (bodyHtml) withBody += 1;

  const custom = normalizeCustomSchema(parseSchema(post.aeoSchema || post.aeo_schema), description).filter(Boolean);
  const faqPairs = parseArticleFaq(post.aeoFaq || post.aeo_faq);
  if (faqPairs.length) withFaq += 1;

  const section = SERVICE_NAME[post.service] || '文章';
  const sectionUrl = post.service ? `${SITE}/insights/${post.service}` : `${SITE}/insights`;

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description,
      url,
      mainEntityOfPage: url,
      image,
      inLanguage: 'zh-Hant',
      ...(post.publishDate ? { datePublished: post.publishDate } : {}),
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID },
      articleSection: section,
      ...(Array.isArray(post.tags) && post.tags.length ? { keywords: post.tags.join(', ') } : {}),
    },
    breadcrumb([['首頁', `${SITE}/`], [section, sectionUrl], [post.title, url]]),
    ...(faqPairs.length ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqPairs.map(([q, a]) => ({
        '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    }] : []),
    ...custom,
  ];

  const faqHtml = faqPairs.length
    ? `<section class="mt-16 pt-12 border-t border-slate-100 font-sans"><h2 class="text-2xl font-bold text-slate-900 mb-8 font-display">常見問題</h2><div class="space-y-4">${faqPairs.map(([q, a]) => `<div class="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm"><div class="p-5"><h3 class="text-base md:text-lg font-bold text-slate-900 font-display mb-3">${esc(q)}</h3><p class="text-slate-600 leading-relaxed text-sm md:text-base">${esc(a)}</p></div></div>`).join('')}</div></section>`
    : '';

  const body = `<article><h1>${esc(post.title)}</h1>${bodyHtml || `<p>${esc(description)}</p>`}${faqHtml}</article>`;
  writePage(dist, route, renderPage(shell, { title, description, url, type: 'article', image, jsonld, body }));
}
console.log(`Generated ${posts.length} static article pages (${withBody} with full body text, ${withFaq} with FAQ).`);
