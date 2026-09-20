import fs from 'node:fs';
import path from 'node:path';
import { getPostImage, getPostPath, getPostUrl } from '../src/lib/insights-adapter.js';

const source = process.env.INSIGHTS_API_URL || 'https://erickfirm.com/.netlify/functions/notion?lang=zh-TW';
const dist = path.resolve('dist');
const esc = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const clean = (value = '') => String(value).replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim().slice(0, 180);

let posts = [];
try {
  const response = await fetch(source);
  if (response.ok) {
    const data = await response.json();
    posts = (data.posts || data.results || []).filter((post) => post.status === 'published');
  }
} catch (e) {
  console.warn(`Static article source fetch failed (${e.message}). Checking fallback...`);
  const fallbackPath = path.resolve('src/data/insights.fallback.json');
  if (fs.existsSync(fallbackPath)) {
    const fallbackData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    posts = (fallbackData.posts || fallbackData || []).filter((post) => post.status === 'published');
  }
}
const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const script = shell.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)?.[0] || '';

for (const post of posts) {
  const route = getPostPath(post);
  const canonical = getPostUrl(post);
  const image = getPostImage(post);
  const title = post.title.includes('Erick Firm') ? post.title : `${post.title} | Erick Firm`;
  const description = clean(post.excerpt) || post.title;
  const schema = post.aeoSchema || post.aeo_schema || '';
  const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${image}"><meta property="og:type" content="article"><meta property="og:site_name" content="Erick Firm"><meta property="og:locale" content="zh_TW"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${image}">${schema}</head><body><div id="root"><main><article><h1>${esc(post.title)}</h1><p>${esc(description)}</p></article></main></div>${script}</body></html>`;
  const output = path.join(dist, decodeURIComponent(route).slice(1), 'index.html');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
}
console.log(`Generated ${posts.length} static article pages.`);
