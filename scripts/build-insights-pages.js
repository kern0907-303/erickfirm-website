// 把 /insights 與四個分類頁預渲染成靜態 HTML。
// 舊狀況：這些頁面沒有靜態檔，伺服器回的是首頁外殼，canonical 與 og:url 都指向首頁，
// 搜尋引擎第一次抓到時會把它們當成首頁的複本；也不會轉向結尾有斜線的網址，與文章頁行為不一致。
// 標題與描述沿用 src/pages/Insights.jsx 與 src/lib/i18n.js 的繁體中文文字；改那邊時請同步改這裡。
import path from 'node:path';
import { getPostPath } from '../src/lib/insights-adapter.js';
import { listPosts } from '../functions/_middleware.js';
import { SITE, esc, loadShell, renderPage, writePage, breadcrumb } from './prerender-shell.js';

const dist = path.resolve('dist');
const INSIGHTS_NAME = '洞察智庫';
const CATEGORIES = [
  { slug: 'enterprise-doctor', name: '初八信息顧問 I8', description: '聚焦營運增長、流程優化與團隊執行力，提供可落地的企業診斷與策略。' },
  { slug: 'life-number', name: '平衡空間 NAS', description: '聚焦決策偏好與角色理解，協助你在關鍵情境下做出更一致且有效的選擇。' },
  { slug: 'personal-growth', name: '艾伯林 ABL', description: '聚焦行動力與決策力提升，協助創辦人與高管釐清身心與狀態瓶頸。' },
  { slug: 'erick-column', name: 'Erick 專欄', description: 'Erick 創辦人的個人專欄，分享商業思維、決策邏輯與生活實踐。' },
];

// 文章清單只用來在頁面裡放內部連結，讓搜尋引擎順著找到每篇文章；讀不到就只輸出頁面本身。
let posts = [];
try {
  const key = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (key) {
    posts = (await listPosts({ SUPABASE_URL: process.env.SUPABASE_URL, SUPABASE_KEY: key })).filter((post) => post.status === 'published');
  }
} catch (error) {
  console.warn(`  ⚠ 讀不到文章清單（${error.message}），分類頁將不含文章連結`);
}

const postLink = (post) => `<li><a href="${esc(getPostPath(post))}/">${esc(post.title)}</a></li>`;
const shell = loadShell(dist);

for (const category of CATEGORIES) {
  const url = `${SITE}/insights/${category.slug}`;
  const list = posts.filter((post) => getPostPath(post).startsWith(`/insights/${category.slug}/`));
  const body = `<section><h1>${esc(category.name)}</h1><p>${esc(category.description)}</p>${list.length ? `<ul>${list.map(postLink).join('')}</ul>` : ''}</section>`;
  writePage(dist, `/insights/${category.slug}`, renderPage(shell, {
    title: `${category.name} | ${INSIGHTS_NAME}`,
    description: category.description,
    url,
    image: `${SITE}/og-default.png`,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: category.name, description: category.description, url: `${url}/`, inLanguage: 'zh-Hant' },
      breadcrumb([['首頁', `${SITE}/`], [INSIGHTS_NAME, `${SITE}/insights/`], [category.name, `${url}/`]]),
    ],
    body,
  }));
}

const indexDescription = '依服務分艙閱讀，快速找到最相關的實戰文章';
const indexBody = `<section><h1>${esc(INSIGHTS_NAME)}</h1><p>${esc(indexDescription)}</p><ul>${CATEGORIES.map((c) => `<li><a href="/insights/${c.slug}/">${esc(c.name)}</a></li>`).join('')}</ul></section>`;
writePage(dist, '/insights', renderPage(shell, {
  title: `${INSIGHTS_NAME} | Erick Firm`,
  description: indexDescription,
  url: `${SITE}/insights`,
  image: `${SITE}/og-default.png`,
  jsonld: [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: INSIGHTS_NAME, description: indexDescription, url: `${SITE}/insights/`, inLanguage: 'zh-Hant' },
    breadcrumb([['首頁', `${SITE}/`], [INSIGHTS_NAME, `${SITE}/insights/`]]),
  ],
  body: indexBody,
}));

console.log(`Generated static insights pages: ${CATEGORIES.length + 1} (${posts.length} article links available)`);
