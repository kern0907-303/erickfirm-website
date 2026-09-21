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
import { SITE, PERSON_ID, esc, loadShell, renderPage, writePage, breadcrumb } from './prerender-shell.js';

const source = process.env.INSIGHTS_API_URL || 'https://erickfirm.com/.netlify/functions/notion?lang=zh-TW';
const dist = path.resolve('dist');
const clean = (v = '') => String(v).replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim().slice(0, 180);

const SERVICE_NAME = {
  'life-number': '生命數字',
  'personal-growth': '個人成長',
  'enterprise-doctor': '企業醫生',
  'erick-column': 'Erick 專欄',
};

// 區塊文字：新格式 b[type].rich_text[0].plain_text，舊格式 b.text / b.content / b.plain_text
const blockText = (b = {}) =>
  b?.[b?.type]?.rich_text?.[0]?.plain_text ?? b?.text ?? b?.content ?? b?.plain_text ?? '';

// 行內 Markdown：先跳脫，再還原 **粗體** 與 [文字](連結)
const inline = (t) => esc(t)
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, href) => `<a href="${href}">${txt}</a>`)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

function renderBlocks(blocks = []) {
  if (!Array.isArray(blocks)) return '';
  const out = [];
  let list = [];
  const flush = () => { if (list.length) { out.push(`<ul>${list.join('')}</ul>`); list = []; } };
  for (const b of blocks) {
    const text = blockText(b);
    if (!text) continue;
    const type = String(b?.type || 'paragraph').toLowerCase();
    if (type.includes('list') || type === 'li') { list.push(`<li>${inline(text)}</li>`); continue; }
    flush();
    if (type.includes('heading_1') || type.includes('heading_2') || type === 'h1' || type === 'h2') out.push(`<h2>${inline(text)}</h2>`);
    else if (type.includes('heading_3') || type === 'h3') out.push(`<h3>${inline(text)}</h3>`);
    else if (type.includes('quote')) out.push(`<blockquote>${inline(text)}</blockquote>`);
    else if (type === 'image') continue;
    else out.push(`<p>${inline(text)}</p>`);
  }
  flush();
  return out.join('');
}

// aeo_faq 是純文字：「Q：…」「A：…」成對。全形半形冒號、前綴粗體都接受。
function parseFaq(text = '') {
  const pairs = [];
  let q = null;
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.replace(/\*\*/g, '').trim();
    const mq = line.match(/^Q\s*[:：]\s*(.+)$/i);
    const ma = line.match(/^A\s*[:：]\s*(.+)$/i);
    if (mq) q = mq[1].trim();
    else if (ma && q) { pairs.push([q, ma[1].trim()]); q = null; }
  }
  return pairs;
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

const hasType = (objs, type) => objs.some((o) =>
  o?.['@type'] === type || (Array.isArray(o?.['@graph']) && o['@graph'].some((g) => g?.['@type'] === type)));

async function fetchDetail(id) {
  const u = new URL(source);
  u.searchParams.set('postId', id);
  const res = await fetch(u);
  if (!res.ok) throw new Error(`status ${res.status}`);
  return res.json();
}

const response = await fetch(source);
if (!response.ok) throw new Error(`Static article source returned ${response.status}`);
const data = await response.json();
const posts = (data.posts || data.results || []).filter((post) => post.status === 'published');
const shell = loadShell(dist);

let withBody = 0;
let withFaq = 0;
for (const post of posts) {
  const route = getPostPath(post);
  const url = getPostUrl(post);
  const image = getPostImage(post);
  const title = post.title.includes('Erick Firm') ? post.title : `${post.title} | Erick Firm`;
  const description = clean(post.excerpt) || post.title;

  let blocks = post.blocks;
  if (!Array.isArray(blocks) || !blocks.length) {
    try { blocks = (await fetchDetail(post.id))?.blocks || []; }
    catch (e) { console.warn(`  ⚠ ${post.title}：讀不到內文（${e.message}），改用摘要`); blocks = []; }
  }
  const bodyHtml = renderBlocks(blocks);
  if (bodyHtml) withBody += 1;

  const custom = parseSchema(post.aeoSchema || post.aeo_schema);
  const faqPairs = hasType(custom, 'FAQPage') ? [] : parseFaq(post.aeoFaq || post.aeo_faq);
  if (faqPairs.length || hasType(custom, 'FAQPage')) withFaq += 1;

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
    ? `<section><h2>常見問題</h2>${faqPairs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>`
    : '';

  const body = `<article><h1>${esc(post.title)}</h1>${bodyHtml || `<p>${esc(description)}</p>`}${faqHtml}</article>`;
  writePage(dist, route, renderPage(shell, { title, description, url, type: 'article', image, jsonld, body }));
}
console.log(`Generated ${posts.length} static article pages (${withBody} with full body text, ${withFaq} with FAQ).`);
