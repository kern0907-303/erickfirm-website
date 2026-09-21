const DEFAULT_SUPABASE_URL = "https://wbbnjasjyfuatkvnoogi.supabase.co";
const DEFAULT_LOCALE = "zh-TW";
const NETLIFY_FALLBACK_URL = "https://erickfirm.netlify.app/.netlify/functions/notion";

const jsonHeaders = (cacheControl = "no-store") => ({
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
  "Cache-Control": cacheControl,
});

function jsonResponse(status, body, cacheControl) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders(cacheControl),
  });
}

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateExcerpt(content = "", length = 150) {
  const text = content
    .replace(/^#+\s+.+$/gm, "")
    .replace(/#\S+/g, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text.length <= length ? text : `${text.slice(0, length)}...`;
}

function getServiceFromContent(content = "", title = "") {
  const text = `${title} ${content}`.toLowerCase();

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

function getServiceFromBrand(brandId = "", content = "", title = "") {
  const brand = String(brandId || "").toLowerCase().trim();
  if (brand === "i8") return "enterprise-doctor";
  if (brand === "nas") return "life-number";
  if (brand === "abl") return "personal-growth";
  if (brand === "erick") return "erick-column";

  return getServiceFromContent(content, title);
}

function base64UrlEncode(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function formatMermaidCode(rawCode) {
  let code = rawCode.trim();
  code = code.replace(/%%\{init:[\s\S]*?\}%%\s*/g, "");
  code = code.replace(/([a-zA-Z0-9_-]+)\s*\[(.*?)\]/g, (match, nodeId, label) => {
    if (label.startsWith("(") || label.startsWith("[") || label.endsWith(")") || label.endsWith("]")) {
      return match;
    }
    return `${nodeId}([${label}])`;
  });

  const themeConfig = `%%{init: {
  'theme': 'base',
  'themeVariables': {
    'fontFamily': 'Arial, sans-serif',
    'primaryColor': '#002A54',
    'primaryTextColor': '#FFFFFF',
    'primaryBorderColor': '#00C2C2',
    'lineColor': '#00509D',
    'secondaryColor': '#00C2C2',
    'secondaryTextColor': '#FFFFFF',
    'tertiaryColor': '#F4F9FA',
    'tertiaryTextColor': '#1A202C'
  }
}}%%`;

  return `${themeConfig}\n${code}`;
}

function parseMarkdownToBlocks(markdown = "") {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let inCodeBlock = false;
  let codeContent = [];
  let codeLanguage = "";

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        const codeText = codeContent.join("\n");

        if (codeLanguage === "mermaid") {
          const formattedCode = formatMermaidCode(codeText);
          const imageUrl = `https://mermaid.ink/img/${base64UrlEncode(formattedCode)}`;
          const lastBlock = blocks[blocks.length - 1];

          if (lastBlock?.type === "image" && lastBlock.image.url.includes("your-id")) {
            lastBlock.image.url = imageUrl;
          } else if (!lastBlock || lastBlock.type !== "image") {
            blocks.push({
              id: Math.random().toString(36).slice(2, 11),
              type: "image",
              image: {
                alt: "概念模型架構圖",
                url: imageUrl,
              },
            });
          }
        } else {
          blocks.push({
            id: Math.random().toString(36).slice(2, 11),
            type: "paragraph",
            paragraph: { rich_text: [{ plain_text: codeText }] },
          });
        }

        codeContent = [];
        codeLanguage = "";
      } else {
        inCodeBlock = true;
        codeLanguage = trimmed.slice(3).trim().toLowerCase();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    if (!trimmed) continue;

    if (trimmed.startsWith("# ")) {
      blocks.push({
        id: Math.random().toString(36).slice(2, 11),
        type: "heading_1",
        heading_1: { rich_text: [{ plain_text: trimmed.slice(2).trim() }] },
      });
    } else if (trimmed.startsWith("## ")) {
      blocks.push({
        id: Math.random().toString(36).slice(2, 11),
        type: "heading_2",
        heading_2: { rich_text: [{ plain_text: trimmed.slice(3).trim() }] },
      });
    } else if (trimmed.startsWith("### ")) {
      blocks.push({
        id: Math.random().toString(36).slice(2, 11),
        type: "heading_3",
        heading_3: { rich_text: [{ plain_text: trimmed.slice(4).trim() }] },
      });
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      blocks.push({
        id: Math.random().toString(36).slice(2, 11),
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ plain_text: trimmed.slice(2).trim() }] },
      });
    } else if (/^\d+\.\s/.test(trimmed)) {
      blocks.push({
        id: Math.random().toString(36).slice(2, 11),
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ plain_text: trimmed.replace(/^\d+\.\s/, "").trim() }] },
      });
    } else if (/^!\[(.*?)\]\((.*?)\)$/.test(trimmed)) {
      const match = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      blocks.push({
        id: Math.random().toString(36).slice(2, 11),
        type: "image",
        image: {
          alt: match[1] || "",
          url: match[2] || "",
        },
      });
    } else {
      blocks.push({
        id: Math.random().toString(36).slice(2, 11),
        type: "paragraph",
        paragraph: { rich_text: [{ plain_text: trimmed }] },
      });
    }
  }

  return blocks;
}

function mapSupabaseArticleToPost(article, locale = DEFAULT_LOCALE) {
  const id = article.id;
  const title = article.title || "Untitled";
  const content = article.content || "";
  const contentWithoutCode = content.replace(/```[\s\S]*?```/g, "");
  // 第二個字元不能是 #，否則 Markdown 的「## 標題」會被當成一個叫「#」的標籤。
  const tags = (contentWithoutCode.match(/#[^\s#][^\s]*/g) || [])
    .map((tag) => tag.slice(1).replace(/['",.;:!?()[\]{}]/g, "").trim())
    .filter((tag) => tag && !/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(tag));

  return {
    id,
    title,
    excerpt: generateExcerpt(content, 150),
    slug: slugify(title) || id,
    service: getServiceFromBrand(article.brand_id, content, title),
    publishDate: article.created_at ? article.created_at.split("T")[0] : "",
    tags,
    status: article.status || "published",
    locale,
    canonicalKey: id,
    alternateLocales: [],
    format: "Article",
    aeoSchema: article.aeo_schema || "",
    aeoFaq: article.aeo_faq || "",
  };
}

async function supabaseFetch(env, path, init = {}) {
  const supabaseUrl = env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseKey) {
    throw new Error("Missing SUPABASE_KEY environment variable.");
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    ...(init.headers || {}),
  };

  return fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers,
  });
}

async function listPosts(env, locale = DEFAULT_LOCALE) {
  const res = await supabaseFetch(
    env,
    "insights_articles?brand_id=in.(erick,i8,nas,abl)&status=eq.published&order=created_at.desc",
  );

  if (!res.ok) {
    throw new Error(`Supabase API responded with status ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return (data || []).map((article) => mapSupabaseArticleToPost(article, locale));
}

async function getPostDetail(env, postId, locale = DEFAULT_LOCALE) {
  const res = await supabaseFetch(env, `insights_articles?id=eq.${postId}`);

  if (!res.ok) {
    throw new Error(`Supabase API responded with status ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  if (!data?.length) {
    throw new Error("Post not found");
  }

  const article = data[0];
  return {
    page: mapSupabaseArticleToPost(article, locale),
    blocks: parseMarkdownToBlocks(article.content || ""),
    faqBlocks: article.aeo_faq ? parseMarkdownToBlocks(article.aeo_faq) : [],
  };
}

async function proxyToNetlify(request) {
  const sourceUrl = new URL(request.url);
  const targetUrl = new URL(NETLIFY_FALLBACK_URL);
  targetUrl.search = sourceUrl.search;

  const proxied = await fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
  });

  const headers = new Headers(proxied.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS, POST");

  return new Response(proxied.body, {
    status: proxied.status,
    statusText: proxied.statusText,
    headers,
  });
}

async function handleNotionFunction(request, env) {
  if (request.method === "OPTIONS") {
    return jsonResponse(204, {});
  }

  const hasSupabaseKey = Boolean(env.SUPABASE_KEY || env.SUPABASE_SERVICE_ROLE_KEY);
  if (!hasSupabaseKey || env.NETLIFY_FUNCTION_FALLBACK === "true") {
    return proxyToNetlify(request);
  }

  if (request.method === "POST") {
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(400, { error: "Invalid JSON body" });
    }

    const { name, email, message, inquiry_type } = body;
    if (!name || !email || !message) {
      return jsonResponse(400, { error: "Name, email, and message are required fields." });
    }

    const res = await supabaseFetch(env, encodeURIComponent("Erick Firm 表格"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        inquiry_type: inquiry_type || "consultation",
        status: "new",
      }),
    });

    if (!res.ok) {
      return jsonResponse(res.status || 500, { error: `Failed to save submission: ${await res.text()}` });
    }

    const insertedData = await res.json();
    const tgToken = env.TELEGRAM_BOT_TOKEN;
    const tgChatId = env.TELEGRAM_CHAT_ID;

    if (tgToken && tgChatId) {
      const typeLabel = inquiry_type === "consultation" ? "專屬診斷預約" : "一般諮詢";
      const tgText = `🔔 <b>收到新表單預約申請！</b>\n\n` +
        `👤 <b>姓名</b>：${name}\n` +
        `📞 <b>聯絡方式</b>：${email}\n` +
        `🏷️ <b>類型</b>：${typeLabel}\n` +
        `📝 <b>目前面臨的卡點</b>：\n${message}`;

      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: tgText,
          parse_mode: "HTML",
        }),
      }).catch((error) => console.error("Failed to send Telegram notification:", error));
    }

    return jsonResponse(200, { success: true, data: insertedData });
  }

  if (request.method !== "GET") {
    return jsonResponse(405, { error: "Method Not Allowed" });
  }

  const url = new URL(request.url);
  const locale = url.searchParams.get("lang") || DEFAULT_LOCALE;
  const service = url.searchParams.get("service") || "";
  const postId = url.searchParams.get("postId");
  const slug = url.searchParams.get("slug");

  if (postId) {
    return jsonResponse(200, await getPostDetail(env, postId, locale), "public, max-age=60, s-maxage=60, stale-while-revalidate=30");
  }

  if (slug) {
    const posts = await listPosts(env, locale);
    const match = posts.find((post) => post.slug === slug && (service ? post.service === service : true));
    if (!match) {
      return jsonResponse(404, { error: "Post not found" });
    }
    return jsonResponse(200, await getPostDetail(env, match.id, locale), "public, max-age=60, s-maxage=60, stale-while-revalidate=30");
  }

  let posts = await listPosts(env, locale);
  if (service) {
    posts = posts.filter((post) => post.service === service);
  }

  return jsonResponse(200, { posts, results: posts }, "public, max-age=60, s-maxage=60, stale-while-revalidate=30");
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "www.erickfirm.com") {
    return Response.redirect(`https://erickfirm.com${url.pathname}${url.search}`, 301);
  }

  if (url.pathname === "/.netlify/functions/notion") {
    try {
      return await handleNotionFunction(context.request, context.env);
    } catch (error) {
      console.error("Cloudflare Pages function error:", error);
      return jsonResponse(500, {
        error: error.message || "Server Error",
        debug: {
          hasSupabaseUrl: Boolean(context.env.SUPABASE_URL || DEFAULT_SUPABASE_URL),
          hasSupabaseKey: Boolean(context.env.SUPABASE_KEY || context.env.SUPABASE_SERVICE_ROLE_KEY),
        },
      });
    }
  }

  return context.next();
}
