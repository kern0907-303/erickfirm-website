// server/ai_reading.js
// 修正版：本地運算 + 回傳 lunar_parsed + 嚴禁 Markdown 符號

// 由 functions/_middleware.js（Cloudflare Pages）呼叫。
// 2026-10-26：農曆換算改用 src/lib/numerology 的定版農曆表（Excel 123諮商版 1900–2100），
// 舊 LUNAR_DB 的 1970 與 2031 年起月長碼有誤；生命功課等級改用 Excel 完整路徑規則（Erick 2026-10-26 裁定）。
import { solarToLunar } from "../src/lib/numerology/index.js";
export async function handleAiReading(event, env) {
  if (event.httpMethod === "OPTIONS") return resp(200, { ok: true });
  if (event.httpMethod !== "POST") return resp(405, { error: "Method Not Allowed" });

  try {
    const body = safeJsonParse(event.body);
    const mode = String(body.mode || "reading").trim();
    const birthdate = String(body.birthdate || "").trim();
    const name = String(body.name || "").trim();
    const manualLunar = String(body.lunarBirthdate || "").trim();
    const report = body.report || null;
    const question = String(body.question || "").trim();
    const analysisMode = String(body.analysis_mode || "today").trim();

    // ------------------------------------------
    // MODE: REPORT (生成命盤數據)
    // ------------------------------------------
    if (mode === "report") {
      const solarParts = parseDateStr(birthdate);
      if (!solarParts) return resp(200, { ok: false, error: "無效的生日格式" });

      // 1. 計算陽曆
      const solarResult = calcNumerology(solarParts.y, solarParts.m, solarParts.d, "+");
      
      // 2. 處理陰曆
      let lunarParts = null;
      let lunarStr = "未知";
      
      if (manualLunar) {
        lunarParts = parseDateStr(manualLunar);
        if(lunarParts) lunarStr = `${lunarParts.y}年${lunarParts.m}月${lunarParts.d}日`;
      } 
      
      if (!lunarParts) {
        const autoLunar = getLunarStruct(solarParts.y, solarParts.m, solarParts.d);
        if (autoLunar) {
          lunarParts = { y: autoLunar.y, m: autoLunar.m, d: autoLunar.d };
          lunarStr = autoLunar.str;
        }
      }

      // 3. 計算陰曆數據
      let lunarResult = { main: "??/??", soul: "?級", flowYear: "0", flowMonth: "0", flowDay: "0" };
      if (lunarParts) {
        const now = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Taipei"}));
        const todayLunar = getLunarStruct(now.getFullYear(), now.getMonth()+1, now.getDate());
        
        if (todayLunar) {
           lunarResult = calcNumerologyWithTarget(
             lunarParts.y, lunarParts.m, lunarParts.d, 
             todayLunar.y, todayLunar.m, todayLunar.d, 
             "-"
           );
        } else {
           lunarResult = calcNumerology(lunarParts.y, lunarParts.m, lunarParts.d, "-");
        }
      }

      const parsed = {
        solarMain: solarResult.main,
        lunarMain: lunarResult.main,
        solarSoul: solarResult.soul,
        lunarSoul: lunarResult.soul,
        solarYear: solarResult.flowYear,
        solarMonth: solarResult.flowMonth,
        solarDay: solarResult.flowDay,
        lunarYear: lunarResult.flowYear,
        lunarMonth: lunarResult.flowMonth,
        lunarDay: lunarResult.flowDay,
      };

      const ov = computeOverallPercent(parsed);

      return resp(200, {
        ok: true,
        parsed: parsed,
        raw_result: `主命數 ${solarResult.main}, ${lunarResult.main}\n生命功課等級陽曆 ${solarResult.soul}\n生命功課等級陰曆 ${lunarResult.soul}\n`,
        overall_percent: ov.percent,
        overall_icon: ov.emoji,
        overall_label: ov.label,
        lunar_birthday_text: lunarStr,
        lunar_parsed: lunarParts 
      });
    }

    // ----------------------------
    // AI (OpenAI)
    // ----------------------------
    const apiKey = env.OPENAI_API_KEY;
    const model = env.OPENAI_MODEL || "gpt-4o-mini";

    if (!apiKey) return resp(200, { text: "（小幫手這邊雲層偏厚，請檢查 API Key。）" });

    const system = `
你是「小幫手」。
你只根據外部提供的 report 回應，不得自行心算。
解析模式：${analysisMode}
語氣：溫暖、穩定、落地。
【重要格式規定】：
1. 請使用自然段落分段。
2. 嚴禁使用任何 Markdown 格式符號（如 **粗體**、## 標題）。
3. 保持純文字輸出，像寫信一樣。
`.trim();

    const userPrompt = mode === "qa"
        ? buildQaPrompt({ question, analysisMode })
        : buildReadingPrompt({ analysisMode });

    const text = await callOpenAIResponsesWithTimeout({
      apiKey, model, system, userPrompt,
      contextPack: { birthdate, name, report },
      timeoutMs: 25000,
    });

    return resp(200, { text });

  } catch (err) {
    console.error("[ai_reading] FAILED:", err);
    return resp(200, { text: "（系統忙碌中，請稍後再試。）" });
  }
}


// ==========================================
// 核心演算法 (保持不變)
// ==========================================

function sumDigits(n) {
  let sum = 0;
  String(n).split('').forEach(ch => sum += parseInt(ch, 10));
  return sum;
}

function calcPath(numVal, sign = "") {
  let temp = numVal;
  const steps = [temp];
  while (temp > 9) {
    temp = sumDigits(temp);
    steps.push(temp);
  }
  if (steps.length === 1) {
    steps.push(temp);
  }
  const formatted = steps.map((value, index) => index === 0 ? String(value).padStart(2, '0') : String(value));
  return { path: `${sign}${formatted.join('/')}`, main: temp };
}

function calcSoulLevelFull(year, month, day, sign = "") {
  // Excel 完整路徑規則（與 nas-annual-engine birth_track 相同）：
  // 後天數取路徑最後一層之前的所有數字（例 29/11/2 → 2、9、1、1；20/2 → 2、0），逐一比對生日八碼。
  // 主命數不在生日：後天數全不在 1 級、部分 2 級、全部 3 級。
  // 主命數在生日：全不在 4 級、部分 5 級、全部 7 級；若重複數（長路徑看路徑數字與主命數，短路徑看 1–9，不含 0）
  // 在生日出現三次以上，降為 6 級。
  const dateStr = String(year) + String(month).padStart(2,'0') + String(day).padStart(2,'0');
  const innateDigits = dateStr.split('').map(d => parseInt(d, 10));
  const total = innateDigits.reduce((a, b) => a + b, 0);
  const res = calcPath(total, sign);
  const pathStr = res.path;
  const mainNumber = res.main;
  const counts = {};
  innateDigits.forEach(d => counts[d] = (counts[d] || 0) + 1);
  const parts = pathStr.replace(/^[+-]/, "").split("/");
  const consequentDigits = parts.slice(0, -1).join("").split("").map(d => parseInt(d, 10));
  const hits = consequentDigits.map(d => counts[d] !== undefined);
  const allPresent = hits.length > 0 && hits.every(Boolean);
  const anyPresent = hits.some(Boolean);
  let level;
  if (counts[mainNumber] === undefined) {
    level = allPresent ? 3 : anyPresent ? 2 : 1;
  } else if (!anyPresent) {
    level = 4;
  } else if (!allPresent) {
    level = 5;
  } else {
    const pool = consequentDigits.length > 2
      ? new Set([...consequentDigits, mainNumber])
      : new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    level = [...pool].some(d => (counts[d] || 0) >= 3) ? 6 : 7;
  }
  return { main: pathStr, soul: level + "級" };
}

function getLunarStruct(sy, sm, sd) {
  const iso = `${String(sy).padStart(4, "0")}-${String(sm).padStart(2, "0")}-${String(sd).padStart(2, "0")}`;
  try {
    const lunar = solarToLunar(iso);
    return { y: lunar.y, m: lunar.m, d: lunar.d, str: `${lunar.y}年${lunar.leap ? "閏" : ""}${lunar.m}月${lunar.d}日` };
  } catch (error) {
    if (error instanceof RangeError) return null;
    throw error;
  }
}

function calcFlowsWithTarget(birthY, birthM, birthD, targetY, targetM, targetD, sign = "") {
  let fyBase = targetY;
  // 規則：今天月日 >= 生日月日 → 今年，否則 → 去年
  if (targetM < birthM || (targetM === birthM && targetD < birthD)) {
    fyBase = targetY - 1;
  }
  const fyStrRaw = String(fyBase) + String(birthM).padStart(2,'0') + String(birthD).padStart(2,'0');
  const fyRes = calcPath(sumDigits(fyStrRaw), sign);

  let fmBase = targetM;
  if (targetD < birthD) {
    fmBase = targetM - 1;
    if (fmBase === 0) fmBase = 12;
  }
  // 定版規則：流月＝生日年＋目標月（目標日小於生日日則減 1）＋生日日
  const fmStrRaw = String(birthY) + String(fmBase).padStart(2,'0') + String(birthD).padStart(2,'0');
  const fmRes = calcPath(sumDigits(fmStrRaw), sign);

  const fdStrRaw = String(birthY) + String(birthM).padStart(2,'0') + String(targetD).padStart(2,'0');
  const fdRes = calcPath(sumDigits(fdStrRaw), sign);

  return { fy: fyRes.path, fm: fmRes.path, fd: fdRes.path, fyNum: fyRes.main };
}

function calcNumerology(y, m, d, sign) {
  const now = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Taipei"}));
  return calcNumerologyWithTarget(y, m, d, now.getFullYear(), now.getMonth() + 1, now.getDate(), sign);
}

function calcNumerologyWithTarget(y, m, d, targetY, targetM, targetD, sign) {
  const soulRes = calcSoulLevelFull(y, m, d, sign);
  const flowRes = calcFlowsWithTarget(y, m, d, targetY, targetM, targetD, sign);
  return {
    main: soulRes.main,
    soul: soulRes.soul,
    flowYear: flowRes.fy,
    flowMonth: flowRes.fm,
    flowDay: flowRes.fd
  };
}

function resp(statusCode, obj) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" },
    body: JSON.stringify(obj),
  };
}
function safeJsonParse(s) { try { return JSON.parse(s || "{}"); } catch { return {}; } }
function parseDateStr(s) {
  const raw = String(s).replace(/\D/g, "");
  if (raw.length < 8) return null;
  return { y: parseInt(raw.slice(0,4), 10), m: parseInt(raw.slice(4,6), 10), d: parseInt(raw.slice(6,8), 10) };
}
// ===================================================================
// 能量氣象：主命數 × 流日／流月／流年 的「關係」計分
// 判定邏輯沿用 n8n「365每日能量推播」的 determineFortune()，
// 那套是已驗證過的，這裡只負責把六種關係映射成五級天氣。
// 關鍵：分數跟「她是誰」有關——同一天不同主命數會拿到不同天氣。
// ===================================================================

// 路徑字串取最末一位：'+30/3' → 3；含 '?' 視為無效
function digitOf(s) {
  if (!s) return null;
  const parts = String(s).replace(/^[+-]/, "").split("/").filter(Boolean);
  if (!parts.length || parts.some((x) => x.includes("?"))) return null;
  const n = parseInt(parts[parts.length - 1].replace(/\D/g, ""), 10);
  return (n >= 1 && n <= 9) ? n : null;
}

// 沖煞組合（雙向）。必須在「磨練」之前判斷，否則永遠觸發不到。
const CONFLICT_PAIRS = [[1,5],[5,1],[2,7],[7,2],[3,8],[8,3],[4,9],[9,4]];

// 六種關係 → 分數。對外只露天氣，不露關係名稱。
function relationScore(main, flow) {
  if (main === null || flow === null) return null;
  if (flow === main) return 92;                                            // 共振
  if (Math.abs(flow - main) === 1 ||
      (main === 1 && flow === 9) || (main === 9 && flow === 1)) return 82; // 順流
  if (flow + main === 10) return 72;                                       // 助力
  // 沖煞給 12 分（不是 25）：陽陰兩盤取平均會把極端值洗掉，
  // 25 分會讓「兩盤同時沖煞」也只掉到 25，一年跑不出 2 天颱風。
  // 12 分之後，雙盤沖煞＝颱風、單盤沖煞＝下雨，一年約 7 天颱風。
  if (CONFLICT_PAIRS.some((pr) => pr[0] === main && pr[1] === flow)) return 12; // 沖煞
  const diff = Math.abs(flow - main);
  if (diff >= 4 && diff <= 5) return 38;                                   // 磨練
  return 58;                                                               // 平穩
}

function computeOverallPercent(parsed){
  const solarMain = digitOf(parsed.solarMain);
  const lunarMain = digitOf(parsed.lunarMain);

  // 同一軸的陽曆／陰曆各自跟自己的主命數比，再平均
  const axis = (solarPath, lunarPath) => avgScore(
    relationScore(solarMain, digitOf(solarPath)),
    relationScore(lunarMain, digitOf(lunarPath))
  );

  const day   = axis(parsed.solarDay,   parsed.lunarDay);
  const month = axis(parsed.solarMonth, parsed.lunarMonth);
  const year  = axis(parsed.solarYear,  parsed.lunarYear);

  // 這一頁賣的是「今天」，所以流日佔大頭。
  const parts = [];
  if (day   !== null) parts.push({ v: day,   w: 0.60 });
  if (month !== null) parts.push({ v: month, w: 0.25 });
  if (year  !== null) parts.push({ v: year,  w: 0.15 });
  if (!parts.length) return { percent: null, emoji: "⛅️", label: "（等待更新）" };

  const wsum = parts.reduce((a,x)=>a+x.w, 0);
  const pct = Math.round(parts.reduce((a,x)=>a+x.v*x.w, 0) / wsum);
  const band = weatherBand(pct);
  return { percent: pct, emoji: band.emoji, label: band.label };
}

function weatherBand(p){
  if (p >= 80) return { emoji:"☀️", label:"晴朗" };
  if (p >= 65) return { emoji:"⛅️", label:"多雲" };
  if (p >= 50) return { emoji:"🌥️", label:"陰偶陣雨" };
  if (p >= 35) return { emoji:"🌧️", label:"下雨" };
  return { emoji:"🌀", label:"颱風" };
}
function avgScore(a, b){
  const va = (typeof a === "number") ? a : null;
  const vb = (typeof b === "number") ? b : null;
  if (va === null && vb === null) return null;
  if (va === null) return vb;
  if (vb === null) return va;
  return Math.round((va + vb) / 2);
}
function buildQaPrompt({ question, analysisMode }){
  const q = String(question || "").trim();
  if(analysisMode === "core") return `請回應使用者問題。解析模式：主命數。以命盤為依據。\n${q}`;
  return `請回應使用者問題。參考整體能量氣象。\n${q}`;
}
function buildReadingPrompt({ analysisMode }){
  if(analysisMode === "core") return `請生成一段「陽曆／陰曆主命數分析」。`;
  return `請生成一段「今日能量解讀」。`;
}
async function callOpenAIResponsesWithTimeout({ apiKey, model, system, userPrompt, contextPack, timeoutMs }) {
  // [已修復] 使用正確的 Chat Completions API 結構
  const payload = {
    model: model, 
    messages: [
      { role: "system", content: system },
      { role: "user", content: userPrompt + "\nJSON:\n" + safeJSONStringify(contextPack) }
    ],
    temperature: 0.7
  };

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    // [已修復] 修正為正確的 OpenAI Endpoint
    const r = await fetch("https://api.openai.com/v1/chat/completions", { 
      method: "POST", 
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` }, 
      body: JSON.stringify(payload), 
      signal: ac.signal 
    });
    
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`OpenAI ${r.status}`);
    
    // [已修復] 正確讀取回傳文字
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    }
    
    return "（訊號微弱，請重試。）";
  } catch (e) {
    if (e?.name === "AbortError") return "（小幫手逾時，請重試。）";
    throw e;
  } finally { clearTimeout(timer); }
}
function safeJSONStringify(obj) { try { return JSON.stringify(obj, null, 2); } catch { return "{}"; } }
