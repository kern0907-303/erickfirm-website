import fs from 'node:fs';
import path from 'node:path';
import { getPostImage, getPostPath, getPostRoute, getPostUrl } from '../src/lib/insights-adapter.js';

const dist = path.resolve('dist');
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
// Keep the current server-side Supabase adapter as a build fallback until direct browser access is proven.
const apiUrl = process.env.INSIGHTS_API_URL || 'https://erickfirm.com/.netlify/functions/notion?lang=zh-TW';
const excerpt = (content = '') => content.replace(/^#+\s+.+$/gm, '').replace(/#\S+/g, '').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 180);
const esc = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const response = url && key
  ? await fetch(`${url}/rest/v1/insights_articles?brand_id=in.(erick,i8,nas,abl)&status=eq.published&order=created_at.desc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  : await fetch(apiUrl);
if (!response.ok) throw new Error(`Cannot build static articles: content source returned ${response.status}`);
const responseData = await response.json();
const articles = Array.isArray(responseData) ? responseData : responseData.posts || responseData.results || [];
const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const assetScript = shell.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)?.[0] || '';
const redirects = [];

for (const article of articles) {
  if (article.status !== 'published') continue;
  const pagePath = getPostPath(article);
  const canonical = getPostUrl(article);
  const filePath = decodeURIComponent(pagePath);
  const title = `${article.title} | Erick Firm`;
  const description = excerpt(article.content) || article.title;
  const image = getPostImage(article);
  const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${image}"><meta property="og:type" content="article"><meta property="og:site_name" content="Erick Firm"><meta property="og:locale" content="zh_TW"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${image}">${article.aeoSchema || article.aeo_schema || ''}</head><body><div id="root"><main><article><h1>${esc(article.title)}</h1><p>${esc(description)}</p></article></main></div>${assetScript}</body></html>`;
  // Keep Unicode filename segments decoded: percent-encoded Chinese exceeds common 255-byte filename limits.
  const output = path.join(dist, filePath.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
  redirects.push(`${pagePath} ${filePath}/index.html 200`);
  const { service } = getPostRoute(article);
  redirects.push(`/insights/${service}/${article.id} ${pagePath} 301!`);
}

const notFound = '<!doctype html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="robots" content="noindex"><title>找不到文章 | Erick Firm</title></head><body><main><h1>找不到文章</h1><p>這篇文章不存在或已移動。</p></main></body></html>';
fs.writeFileSync(path.join(dist, '404.html'), notFound);
fs.writeFileSync(path.join(dist, '_redirects'), `${redirects.join('\n')}\n/insights/:service/:slug /404.html 404\n/* /index.html 200\n`);
console.log(`Generated ${articles.length} static article pages and redirects.`);
