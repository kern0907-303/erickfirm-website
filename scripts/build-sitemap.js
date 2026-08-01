import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
// This compatibility source keeps builds safe until the browser anon-key migration is verified.
const INSIGHTS_API_URL = process.env.INSIGHTS_API_URL || 'https://erickfirm.com/.netlify/functions/notion?lang=zh-TW';

const DOMAIN = "https://erickfirm.com";

const brandToService = {
  i8: "enterprise-doctor",
  nas: "life-number",
  abl: "personal-growth",
  erick: "erick-column"
};

async function fetchArticles() {
  try {
    const res = SUPABASE_URL && SUPABASE_KEY
      ? await fetch(`${SUPABASE_URL}/rest/v1/insights_articles?brand_id=in.(erick,i8,nas,abl)&status=eq.published&order=created_at.desc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      })
      : await fetch(INSIGHTS_API_URL);
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.posts || data.results || [];
    }
  } catch (err) {
    throw new Error(`Failed to fetch published articles from Supabase: ${err.message}`);
  }
}

async function generateSitemap() {
  const articles = await fetchArticles();
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { url: `${DOMAIN}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
    { url: `${DOMAIN}/insights`, lastmod: today, changefreq: 'daily', priority: '0.9' },
    { url: `${DOMAIN}/insights/enterprise-doctor`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { url: `${DOMAIN}/insights/life-number`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { url: `${DOMAIN}/insights/personal-growth`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { url: `${DOMAIN}/insights/erick-column`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
  ];

  const articleUrls = [];

  articles.forEach((art) => {
    const service = art.service || brandToService[art.brand_id] || "erick-column";
    const slug = art.slug || String(art.title || '').trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-+|-+$/g, '');
    if (!slug || art.status !== 'published') return;
    const dateStr = (art.publishDate || art.publish_date || art.created_at || today).slice(0, 10);
    articleUrls.push({
      url: `${DOMAIN}/insights/${service}/${encodeURIComponent(slug)}`,
      lastmod: dateStr,
      changefreq: 'monthly',
      priority: '0.7'
    });
  });

  const allUrls = [...staticUrls, ...articleUrls];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const targetPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(targetPath, xmlContent, 'utf-8');
  console.log(`✅ Successfully generated sitemap.xml with ${allUrls.length} URLs at ${targetPath}`);
}

generateSitemap().catch(console.error);
