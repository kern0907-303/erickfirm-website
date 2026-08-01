import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = "https://wbbnjasjyfuatkvnoogi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiYm5qYXNqeWZ1YXRrdm5vb2dpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQ0MjY2MiwiZXhwIjoyMDgzMDE4NjYyfQ.rmyavlJf2s0nVGqWiKFfBV7uBBt90s_mgiMSaWml9Cw";

const DOMAIN = "https://erickfirm.com";

const brandToService = {
  i8: "enterprise-doctor",
  nas: "life-number",
  abl: "personal-growth",
  erick: "erick-column"
};

async function fetchArticles() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/insights_articles?brand_id=in.(erick,i8,nas,abl)&status=eq.published&order=created_at.desc`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Failed to fetch from Supabase, using fallback for sitemap:", err);
  }
  return [];
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
    const service = brandToService[art.brand_id] || "erick-column";
    const dateStr = art.created_at ? new Date(art.created_at).toISOString().split('T')[0] : today;
    
    // 如果有 slug 則注入 slug URL，同時注入 ID URL 確保雙重相容
    if (art.slug) {
      articleUrls.push({
        url: `${DOMAIN}/insights/${service}/${encodeURIComponent(art.slug)}`,
        lastmod: dateStr,
        changefreq: 'monthly',
        priority: '0.7'
      });
    }
    articleUrls.push({
      url: `${DOMAIN}/insights/${service}/${art.id}`,
      lastmod: dateStr,
      changefreq: 'monthly',
      priority: '0.6'
    });
  });

  const allUrls = [...staticUrls, ...articleUrls];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
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
