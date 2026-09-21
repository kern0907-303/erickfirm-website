// scripts/prerender-shell.js
// 預渲染共用工具：拿 vite 建好的 dist/index.html 當殼，只替換 <head> 的 meta 與 #root 的內容。
// 用完整的殼（而不是自己拼一個新的 HTML）是為了保留 CSS、字型、favicon、CSP 與全站 Person 身份資料——
// 舊版文章預渲染只抓了 <script>，導致從外部連結直接進文章頁的人看到的是沒有樣式的頁面。
import fs from 'node:fs';
import path from 'node:path';

export const SITE = 'https://erickfirm.com';
export const PERSON_ID = `${SITE}/#erick`; // 與 index.html 的 Person @id 一致，AI 才會把各頁連到同一個人

export const esc = (v = '') => String(v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const loadShell = (dist) => fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
}

// 有就換、沒有就補；保證每個 meta 只出現一次
function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta\\s+${attr}="${reEsc(key)}"\\s+content="[^"]*"\\s*/?>`, 'g');
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  let hit = false;
  const out = html.replace(re, () => { if (hit) return ''; hit = true; return tag; });
  return hit ? out : out.replace('</head>', `  ${tag}\n  </head>`);
}

function setCanonical(html, url) {
  const re = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/;
  const tag = `<link rel="canonical" href="${esc(url)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
}

// 用 div 深度配對找出 #root 的結尾，避免內容裡有巢狀 div 時切錯位置
function replaceRoot(html, inner) {
  const open = html.indexOf('<div id="root">');
  if (open < 0) throw new Error('shell 裡找不到 <div id="root">');
  const start = open + '<div id="root">'.length;
  const tagRe = /<\/?div\b[^>]*>/g;
  tagRe.lastIndex = start;
  let depth = 1, m;
  while ((m = tagRe.exec(html))) {
    depth += m[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return html.slice(0, start) + inner + html.slice(m.index);
  }
  throw new Error('#root 的 </div> 沒有配對到');
}

// JSON 內若含 </script> 會提早結束標籤，轉成 \u003c 避免
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

// 靜態內容的外框：React 掛載前的一瞬間會看到它，所以給它乾淨的排版，不要是一坨黑字
export const frame = (inner) =>
  `<main style="max-width:44rem;margin:0 auto;padding:8rem 1.5rem 4rem;line-height:1.9;color:#1F1A2E;font-family:'Noto Sans TC',sans-serif">${inner}</main>`;

export function renderPage(shell, { title, description, url, type = 'website', image, jsonld = [], body }) {
  let html = shell;
  html = setTitle(html, title);
  html = setMeta(html, 'name', 'description', description);
  html = setCanonical(html, url);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:type', type);
  if (image) html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  if (image) html = setMeta(html, 'name', 'twitter:image', image);
  if (jsonld.length) html = html.replace('</head>', `  ${jsonld.map(ld).join('\n  ')}\n  </head>`);
  return replaceRoot(html, frame(body));
}

export function writePage(dist, route, html) {
  const rel = decodeURIComponent(route).replace(/^\/+/, '');
  const out = path.join(dist, rel, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  return out;
}

export const breadcrumb = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })),
});
