import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPostUrl, withTrailingSlash } from '../src/lib/insights-adapter.js';
import { listPosts } from '../functions/_middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const supabaseEnv = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
};
const INSIGHTS_API_URL = process.env.INSIGHTS_API_URL || 'https://erickfirm.com/.netlify/functions/notion?lang=zh-TW';
const DOMAIN = 'https://erickfirm.com';

async function fetchArticles() {
  try {
    if (supabaseEnv.SUPABASE_KEY) return await listPosts(supabaseEnv);
    if (process.env.CF_PAGES === '1') {
      throw new Error('Cloudflare Pages build requires SUPABASE_KEY; refusing to fetch from Netlify.');
    }
    const response = await fetch(INSIGHTS_API_URL);
    if (!response.ok) throw new Error(`content source returned ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : data.posts || data.results || [];
  } catch (error) {
    throw new Error(`Failed to fetch published articles: ${error.message}`);
  }
}

async function generateSitemap() {
  const articles = await fetchArticles();
  const today = new Date().toISOString().slice(0, 10);
  const staticUrls = [
    { url: `${DOMAIN}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
    { url: `${DOMAIN}/insights`, lastmod: today, changefreq: 'daily', priority: '0.9' },
    { url: `${DOMAIN}/insights/enterprise-doctor`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { url: `${DOMAIN}/insights/life-number`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { url: `${DOMAIN}/insights/personal-growth`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { url: `${DOMAIN}/insights/erick-column`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { url: `${DOMAIN}/i8`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { url: `${DOMAIN}/about`, lastmod: today, changefreq: 'monthly', priority: '0.9' },
    { url: `${DOMAIN}/three`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
    // 平衡空間 NAS 第二層主頁——沒列在這裡，搜尋引擎與 AI 爬蟲就不知道這些頁面存在
    { url: `${DOMAIN}/nas`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
    { url: `${DOMAIN}/nas/calculator`, lastmod: today, changefreq: 'monthly', priority: '0.9' },
    { url: `${DOMAIN}/nas/meili`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { url: `${DOMAIN}/nas/course`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
    { url: `${DOMAIN}/nas/consultant`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
  ];
  const articleUrls = articles
    .filter((article) => article.status === 'published' && getPostUrl(article) !== `${DOMAIN}/insights/personal-growth`)
    .map((article) => ({
      url: getPostUrl(article),
      lastmod: (article.publishDate || article.publish_date || article.created_at || today).slice(0, 10),
      changefreq: 'monthly',
      priority: '0.7',
    }));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticUrls, ...articleUrls].map((item) => `  <url>\n    <loc>${withTrailingSlash(item.url)}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n    <changefreq>${item.changefreq}</changefreq>\n    <priority>${item.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`;
  fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), xml, 'utf8');
  console.log(`Generated sitemap.xml with ${staticUrls.length + articleUrls.length} URLs.`);
}

generateSitemap().catch((error) => { console.error(error); process.exitCode = 1; });
