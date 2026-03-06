const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const DEFAULT_LOCALE = "zh-TW";

const SERVICE_MAP = {
  "企業醫生": "enterprise-doctor",
  "生命數字": "life-number",
  "個人成長": "personal-growth",
  "個人頻率校準": "personal-growth",
  "能量氣象站": "personal-growth",
  "enterprise doctor": "enterprise-doctor",
  "numerology": "life-number",
  "life number": "life-number",
  "personal growth": "personal-growth",
};

function resp(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

async function notionFetch(path, init = {}) {
  if (!NOTION_API_KEY) {
    const e = new Error("Missing NOTION_API_KEY");
    e.status = 500;
    throw e;
  }

  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(data?.message || `Notion API error (${res.status})`);
    e.status = res.status;
    e.data = data;
    throw e;
  }
  return data;
}

function plainText(richText = []) {
  return richText.map(t => t?.plain_text || "").join("").trim();
}

function getProp(props, key) {
  return props?.[key] ?? null;
}

function normalizeLocale(locale) {
  return locale === "en" ? "en" : DEFAULT_LOCALE;
}

function toLowerTrim(value) {
  return String(value || "").trim().toLowerCase();
}

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readPropText(prop) {
  if (!prop) return "";
  if (prop.type === "title") return plainText(prop.title);
  if (prop.type === "rich_text") return plainText(prop.rich_text);
  if (prop.type === "select") return prop.select?.name || "";
  if (prop.type === "multi_select") return (prop.multi_select || []).map((x) => x.name).join(", ");
  if (prop.type === "date") return prop.date?.start || "";
  return "";
}

function readLocaleValue(props) {
  const raw = readFirstPropText(props, ["Locale", "Language", "語系", "Lang"]);
  const value = toLowerTrim(raw);
  if (value === "en" || value === "en-us" || value === "en-gb" || value === "english") return "en";
  if (value === "zh-tw" || value === "zh_tw" || value === "zh" || value === "chinese" || value === "繁中" || value === "中文") return "zh-TW";
  return DEFAULT_LOCALE;
}

function readStatusValue(props) {
  const statusProp = getProp(props, "Status");
  if (!statusProp) return "";
  if (statusProp.type === "status") return statusProp.status?.name || "";
  if (statusProp.type === "select") return statusProp.select?.name || "";
  return "";
}

function isPublishedStatus(status) {
  const value = String(status || "").trim().toLowerCase();
  return value === "published" || value === "已發布" || value === "上架";
}

function readFirstPropText(props, keys = []) {
  for (const key of keys) {
    const text = readPropText(getProp(props, key));
    if (text) return text;
  }
  return "";
}

function normalizeService(raw) {
  const text = String(raw || "").trim();
  return SERVICE_MAP[text] || SERVICE_MAP[text.toLowerCase()] || "personal-growth";
}

function normalizeBlock(block) {
  const type = block?.type;
  const text = plainText(block?.[type]?.rich_text || []);
  return {
    ...block,
    text,
  };
}

function mapPage(page, locale = DEFAULT_LOCALE) {
  const props = page.properties || {};

  const title = locale === "en"
    ? readFirstPropText(props, ["Title_en", "Title EN", "Title", "Name", "標題", "Title_zh"])
    : readFirstPropText(props, ["Title_zh", "Title ZH", "Title", "Name", "標題", "Title_en"]);

  const excerpt = locale === "en"
    ? readFirstPropText(props, ["Excerpt_en", "Excerpt EN", "Excerpt", "摘要", "Excerpt_zh"])
    : readFirstPropText(props, ["Excerpt_zh", "Excerpt ZH", "Excerpt", "摘要", "Excerpt_en"]);

  const serviceRaw = readFirstPropText(props, ["Service", "Project", "分類", "Category"]);
  const service = normalizeService(serviceRaw);

  const slugRaw = locale === "en"
    ? readFirstPropText(props, ["Slug_en", "Slug EN", "Slug", "slug", "Slug_zh"])
    : readFirstPropText(props, ["Slug_zh", "Slug ZH", "Slug", "slug", "Slug_en"]);
  const slug = slugify(slugRaw || title || page.id);

  const publishDate = readFirstPropText(props, ["Publish Date", "Date", "發布日期"]) || null;

  const tagsProp = getProp(props, "Tags");
  const tags = tagsProp?.type === "multi_select" ? (tagsProp.multi_select || []).map((x) => x.name) : [];
  const status = readStatusValue(props);
  const pageLocale = readLocaleValue(props);
  const canonicalRaw = readFirstPropText(props, [
    "CanonicalKey",
    "Canonical Key",
    "Canonical",
    "canonical_key",
    "CanonicalKey_Auto",
    "Canonical Key Auto",
  ]);
  const canonicalKey = slugify(canonicalRaw || slugRaw || title || page.id) || page.id;

  return {
    id: page.id,
    title: title || "Untitled",
    excerpt,
    slug,
    service,
    publishDate,
    tags,
    status,
    locale: pageLocale,
    canonicalKey,
    alternateLocales: [],
  };
}

function sortPostsByDateDesc(posts = []) {
  return [...posts].sort((a, b) => {
    const aDate = Date.parse(a.publishDate || "") || 0;
    const bDate = Date.parse(b.publishDate || "") || 0;
    return bDate - aDate;
  });
}

function ensureUniqueSlugs(posts = []) {
  const slugCount = new Map();
  return posts.map((post) => {
    const key = `${post.service}:${post.slug}`;
    const count = slugCount.get(key) || 0;
    slugCount.set(key, count + 1);

    if (count === 0) return post;
    return {
      ...post,
      slug: `${post.slug}-${post.id.slice(0, 6).toLowerCase()}`,
    };
  });
}

async function listPosts(locale = DEFAULT_LOCALE) {
  if (!NOTION_DATABASE_ID) {
    const e = new Error("Missing NOTION_DATABASE_ID");
    e.status = 500;
    throw e;
  }

  // 保守：不做依賴欄位的排序，避免欄位不存在導致 400
  const data = await notionFetch(`databases/${NOTION_DATABASE_ID}/query`, {
    method: "POST",
    body: JSON.stringify({ page_size: 100 }),
  });

  const mapped = (data.results || []).map((page) => mapPage(page, locale));
  const publishedOnly = mapped.filter((post) => {
    if (!post.status) return true;
    return isPublishedStatus(post.status);
  });
  const byCanonical = new Map();
  for (const post of publishedOnly) {
    const key = post.canonicalKey || post.id;
    const group = byCanonical.get(key) || [];
    group.push(post);
    byCanonical.set(key, group);
  }

  const selected = [];
  for (const group of byCanonical.values()) {
    const exact = group.find((item) => item.locale === locale);
    const fallback = group.find((item) => item.locale === DEFAULT_LOCALE);
    const winner = exact || fallback || group[0];
    selected.push({
      ...winner,
      alternateLocales: group.map((item) => ({
        locale: item.locale,
        service: item.service,
        slug: item.slug,
        id: item.id,
      })),
    });
  }

  const sorted = sortPostsByDateDesc(selected);
  return ensureUniqueSlugs(sorted);
}

async function postDetail(postId, locale = DEFAULT_LOCALE) {
  const page = await notionFetch(`pages/${postId}`, { method: "GET" });
  const blocks = await notionFetch(`blocks/${postId}/children?page_size=100`, { method: "GET" });
  return {
    page: mapPage(page, locale),
    blocks: (blocks.results || []).map(normalizeBlock),
  };
}

async function postDetailByCanonical(canonicalKey, locale = DEFAULT_LOCALE, serviceFilter = "") {
  const posts = await listPosts(locale);
  const match = posts.find((post) => {
    const sameCanonical = post.canonicalKey === canonicalKey;
    if (!sameCanonical) return false;
    if (!serviceFilter) return true;
    return post.service === serviceFilter;
  });

  if (!match) {
    const e = new Error("Post not found");
    e.status = 404;
    throw e;
  }

  return postDetail(match.id, locale);
}

async function postDetailBySlug(slug, locale = DEFAULT_LOCALE, serviceFilter = "") {
  const posts = await listPosts(locale);
  const match = posts.find((post) => {
    const sameSlug = post.slug === slug;
    if (!sameSlug) return false;
    if (!serviceFilter) return true;
    return post.service === serviceFilter;
  });

  if (!match) {
    const e = new Error("Post not found");
    e.status = 404;
    throw e;
  }

  return postDetail(match.id, locale);
}

export async function handler(event) {
  try {
    if (event.httpMethod === "OPTIONS") return resp(204, {});
    if (event.httpMethod !== "GET") return resp(405, { error: "Method Not Allowed" });

    const qs = event.queryStringParameters || {};
    const locale = normalizeLocale(qs.lang);
    const service = qs.service || "";

    if (qs.postId) {
      const detail = await postDetail(qs.postId, locale);
      return resp(200, detail);
    }

    if (qs.slug) {
      if (qs.canonicalKey) {
        const detail = await postDetailByCanonical(qs.canonicalKey, locale, service);
        return resp(200, detail);
      }
      const detail = await postDetailBySlug(qs.slug, locale, service);
      return resp(200, detail);
    }

    let posts = await listPosts(locale);
    if (service) {
      posts = posts.filter((post) => post.service === service);
    }

    return resp(200, { posts, results: posts });
  } catch (err) {
    return resp(err.status || 500, {
      error: err.message || "Server Error",
      debug: {
        hasApiKey: !!NOTION_API_KEY,
        hasDatabaseId: !!NOTION_DATABASE_ID,
        databaseId: NOTION_DATABASE_ID ? `${String(NOTION_DATABASE_ID).slice(0, 6)}...${String(NOTION_DATABASE_ID).slice(-6)}` : null,
        notionStatus: err.status || null,
        notionData: err.data || null,
      },
      hint: [
        "1) 確認 .env 或 Netlify 環境變數有 NOTION_API_KEY / NOTION_DATABASE_ID",
        "2) 確認 Notion 資料庫右上角『分享』→『Connections』已把 integration 加進去",
        "3) 如果 Notion 回 400，先檢查資料庫欄位型別（Status/Publish Date/Slug）是否符合設定",
      ],
    });
  }
}
