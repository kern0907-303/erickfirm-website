const SUPABASE_URL = process.env.SUPABASE_URL || "https://wbbnjasjyfuatkvnoogi.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const DEFAULT_LOCALE = "zh-TW";

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

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateExcerpt(content = "", length = 150) {
  let text = content
    .replace(/^#+\s+.+$/gm, "") // remove heading lines
    .replace(/#\S+/g, "") // remove hashtags
    .replace(/[*_`]/g, "") // remove formatting marks
    .replace(/\s+/g, " ") // normalize whitespace
    .trim();
    
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

function getServiceFromContent(content = "", title = "") {
  const text = (title + " " + content).toLowerCase();
  
  if (text.includes("erick 專欄") || text.includes("erick專欄") || text.includes("專欄") || text.includes("erick-column")) {
    return "erick-column";
  }
  if (text.includes("企業醫生") || text.includes("營運") || text.includes("流程優化") || text.includes("企業診斷") || text.includes("團隊執行力") || text.includes("enterprise-doctor") || text.includes("i8") || text.includes("i8企業")) {
    return "enterprise-doctor";
  }
  if (text.includes("生命數字") || text.includes("生命藍圖") || text.includes("個人藍圖") || text.includes("決策偏好") || text.includes("life-number") || text.includes("nas") || text.includes("nas生命數字")) {
    return "life-number";
  }
  if (text.includes("個人成長") || text.includes("自我成長") || text.includes("timewaver") || text.includes("個人品牌") || text.includes("能量") || text.includes("personal-growth") || text.includes("二次覺醒") || text.includes("abl") || text.includes("abl量子調頻")) {
    return "personal-growth";
  }
  
  return "personal-growth";
}

function parseMarkdownToBlocks(markdown = "") {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    
    // Heading 1
    if (trimmed.startsWith("# ")) {
      blocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "heading_1",
        heading_1: { rich_text: [{ plain_text: trimmed.slice(2).trim() }] }
      });
    }
    // Heading 2
    else if (trimmed.startsWith("## ")) {
      blocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "heading_2",
        heading_2: { rich_text: [{ plain_text: trimmed.slice(3).trim() }] }
      });
    }
    // Heading 3
    else if (trimmed.startsWith("### ")) {
      blocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "heading_3",
        heading_3: { rich_text: [{ plain_text: trimmed.slice(4).trim() }] }
      });
    }
    // Bulleted list item
    else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      blocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ plain_text: trimmed.slice(2).trim() }] }
      });
    }
    // Numbered list item
    else if (/^\d+\.\s/.test(trimmed)) {
      const contentText = trimmed.replace(/^\d+\.\s/, "");
      blocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ plain_text: contentText.trim() }] }
      });
    }
    // Image Markdown: ![alt](url)
    else if (/^!\[(.*?)\]\((.*?)\)$/.test(trimmed)) {
      const match = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      blocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "image",
        image: {
          alt: match[1] || "",
          url: match[2] || ""
        }
      });
    }
    // Paragraph
    else {
      blocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "paragraph",
        paragraph: { rich_text: [{ plain_text: trimmed }] }
      });
    }
  }
  return blocks;
}

function mapSupabaseArticleToPost(article, locale = DEFAULT_LOCALE) {
  const id = article.id;
  const title = article.title || "Untitled";
  const content = article.content || "";
  
  const excerpt = generateExcerpt(content, 150);
  const service = getServiceFromContent(content, title);
  const slug = slugify(title) || id;
  
  let publishDate = "";
  if (article.created_at) {
    publishDate = article.created_at.split("T")[0];
  }
  
  const tagsMatches = content.match(/#\S+/g);
  const tags = tagsMatches ? tagsMatches.map(t => t.slice(1)) : [];
  
  return {
    id,
    title,
    excerpt,
    slug,
    service,
    publishDate,
    tags,
    status: article.status || "published",
    locale,
    canonicalKey: id,
    alternateLocales: [],
    format: "Article"
  };
}

async function listPosts(locale = DEFAULT_LOCALE) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/insights_articles?brand_id=in.(erick,i8,nas,abl)&status=eq.published&order=created_at.desc`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase API responded with status ${res.status}: ${errText}`);
  }
  
  const data = await res.json();
  return (data || []).map(article => mapSupabaseArticleToPost(article, locale));
}

async function getPostDetail(postId, locale = DEFAULT_LOCALE) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/insights_articles?id=eq.${postId}`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase API responded with status ${res.status}: ${errText}`);
  }
  
  const data = await res.json();
  if (!data || !data.length) {
    throw new Error("Post not found");
  }
  
  const article = data[0];
  const page = mapSupabaseArticleToPost(article, locale);
  const blocks = parseMarkdownToBlocks(article.content || "");
  
  return {
    page,
    blocks
  };
}

export async function handler(event) {
  try {
    if (event.httpMethod === "OPTIONS") return resp(204, {});

    if (!SUPABASE_KEY) {
      return resp(500, {
        error: "Missing SUPABASE_KEY environment variable.",
        hint: "請在 Netlify 系統設定中新增環境變數 SUPABASE_KEY，值為您的 Supabase Anon Key 或 Service Role Key。"
      });
    }

    if (event.httpMethod === "POST") {
      let body;
      try {
        body = JSON.parse(event.body || "{}");
      } catch (e) {
        return resp(400, { error: "Invalid JSON body" });
      }

      const { name, email, message, inquiry_type } = body;
      if (!name || !email || !message) {
        return resp(400, { error: "Name, email, and message are required fields." });
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/${encodeURIComponent("Erick Firm 表格")}`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          name,
          email,
          message,
          inquiry_type: inquiry_type || "consultation",
          status: "new"
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Supabase insert error:", errText);
        return resp(res.status || 500, { error: `Failed to save submission: ${errText}` });
      }

      const insertedData = await res.json();
      return resp(200, { success: true, data: insertedData });
    }

    if (event.httpMethod !== "GET") return resp(405, { error: "Method Not Allowed" });

    const qs = event.queryStringParameters || {};
    const locale = qs.lang || DEFAULT_LOCALE;
    const service = qs.service || "";

    // If query has postId, return detail
    if (qs.postId) {
      const detail = await getPostDetail(qs.postId, locale);
      return resp(200, detail);
    }

    // If query has slug, find by slug
    if (qs.slug) {
      const posts = await listPosts(locale);
      const match = posts.find(post => post.slug === qs.slug && (service ? post.service === service : true));
      if (!match) {
        return resp(404, { error: "Post not found" });
      }
      const detail = await getPostDetail(match.id, locale);
      return resp(200, detail);
    }

    // Default: list posts
    let posts = await listPosts(locale);
    if (service) {
      posts = posts.filter(post => post.service === service);
    }

    return resp(200, { posts, results: posts });
  } catch (err) {
    console.error("Netlify function error:", err);
    return resp(500, {
      error: err.message || "Server Error",
      debug: {
        hasSupabaseUrl: !!SUPABASE_URL,
        hasSupabaseKey: !!SUPABASE_KEY
      }
    });
  }
}
