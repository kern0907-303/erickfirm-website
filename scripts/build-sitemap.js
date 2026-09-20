import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPostUrl } from '../src/lib/insights-adapter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
const INSIGHTS_API_URL = process.env.INSIGHTS_API_URL || 'https://erickfirm.com/.netlify/functions/notion?lang=zh-TW';
const DOMAIN = 'https://erickfirm.com';

async function fetchArticles() {
  try {
    const response = SUPABASE_URL && SUPABASE_KEY
      ? await fetch(`${SUPABASE_URL}/rest/v1/insights_articles?brand_id=in.(erick,i8,nas,abl)&status=eq.published&order=created_at.desc`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      })
      : await fetch(INSIGHTS_API_URL);
    if (!response.ok) throw new Error(`content source returned ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : data.posts || data.results || [];
  } catch (error) {
    console.warn(`Fetch articles remote failed: ${error.message}. Checking local fallback...`);
    const fallbackPath = path.resolve(__dirname, '../src/data/insights.fallback.json');
    if (fs.existsSync(fallbackPath)) {
      const fallbackData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
      return Array.isArray(fallbackData) ? fallbackData : fallbackData.posts || [];
    }
    return [];
  }
}

async function generateSitemap() {
  const articles = await fetchArticles();
  const today = new Date().toISOString().slice(0, 10);
  const staticUrls = [
    { url: `${DOMAIN}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
    { url: `${DOMAIN}/abl`, lastmod: today, changefreq: 'daily', priority: '0.95' },
    { url: `${DOMAIN}/insights`, lastmod: today, changefreq: 'daily', priority: '0.9' },
    { url: `${DOMAIN}/insights/enterprise-doctor`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { url: `${DOMAIN}/insights/life-number`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { url: `${DOMAIN}/insights/personal-growth`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { url: `${DOMAIN}/insights/erick-column`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
  ];
  const articleUrls = articles
    .filter((article) => article.status === 'published' && getPostUrl(article) !== `${DOMAIN}/insights/personal-growth`)
    .map((article) => ({
      url: getPostUrl(article),
      lastmod: (article.publishDate || article.publish_date || article.created_at || today).slice(0, 10),
      changefreq: 'monthly',
      priority: '0.7',
    }));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticUrls, ...articleUrls].map((item) => `  <url>\n    <loc>${item.url}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n    <changefreq>${item.changefreq}</changefreq>\n    <priority>${item.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`;
  fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), xml, 'utf8');
  console.log(`Generated sitemap.xml with ${staticUrls.length + articleUrls.length} URLs.`);
}

generateSitemap().catch((error) => { console.error(error); process.exitCode = 1; });
