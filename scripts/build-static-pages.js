import fs from 'node:fs';
import path from 'node:path';
import { getPostImage, getPostPath, getPostUrl } from '../src/lib/insights-adapter.js';

const source = process.env.INSIGHTS_API_URL || 'https://erickfirm.com/.netlify/functions/notion?lang=zh-TW';
const dist = path.resolve('dist');
const esc = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const clean = (value = '') => String(value).replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim().slice(0, 180);

/**
 * 把 post.blocks 轉成可被爬蟲讀取的 HTML。
 * ⚠️ 這是本檔最重要的改動：原版只輸出 <h1> 與摘要，
 * 3,000 字正文只存在 JS 裡，而 AI 爬蟲多數不執行 JS。
 * React 掛載後會覆蓋這塊，使用者看到的畫面不變。
 */
const renderBlocks = (blocks = []) => {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((b) => {
      const text = b?.text ?? b?.content ?? b?.plain_text ?? '';
      if (!text) return '';
      const type = String(b?.type || 'paragraph').toLowerCase();
      if (type.includes('heading_1') || type === 'h1') return `<h2>${esc(text)}</h2>`;
      if (type.includes('heading_2') || type === 'h2') return `<h2>${esc(text)}</h2>`;
      if (type.includes('heading_3') || type === 'h3') return `<h3>${esc(text)}</h3>`;
      if (type.includes('list') || type === 'li') return `<li>${esc(text)}</li>`;
      if (type.includes('quote')) return `<blockquote>${esc(text)}</blockquote>`;
      return `<p>${esc(text)}</p>`;
    })
    .join('');
};

const response = await fetch(source);
if (!response.ok) throw new Error(`Static article source returned ${response.status}`);
const data = await response.json();
const posts = (data.posts || data.results || []).filter((post) => post.status === 'published');
const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const script = shell.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)?.[0] || '';

let withBody = 0;
for (const post of posts) {
  const route = getPostPath(post);
  const canonical = getPostUrl(post);
  const image = getPostImage(post);
  const title = post.title.includes('Erick Firm') ? post.title : `${post.title} | Erick Firm`;
  const description = clean(post.excerpt) || post.title;
  const schema = post.aeoSchema || post.aeo_schema || '';
  const bodyHtml = renderBlocks(post.blocks);
  if (bodyHtml) withBody += 1;

  const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${image}"><meta property="og:type" content="article"><meta property="og:site_name" content="Erick Firm"><meta property="og:locale" content="zh_TW"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${image}">${schema}</head><body><div id="root"><main><article><h1>${esc(post.title)}</h1>${bodyHtml || `<p>${esc(description)}</p>`}</article></main></div>${script}</body></html>`;

  const output = path.join(dist, decodeURIComponent(route).slice(1), 'index.html');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
}
console.log(`Generated ${posts.length} static article pages (${withBody} with full body text).`);
