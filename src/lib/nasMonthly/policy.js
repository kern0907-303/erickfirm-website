/** Prompt redlines are source fragments from docs/nas-life-number/report_system.md. */
export const REPORT_SYSTEM_REDLINE_FRAGMENTS = Object.freeze([
  "Never calculate numerology from a birthday or invent a number not present in the profile.",
  "Do not turn a symbolic tendency into a guaranteed event.",
  "Do not provide medical, legal, or investment guarantees or diagnoses.",
  "Avoid fate, oracle, or fear-based language.",
  "Return to choices, resource allocation, boundaries, and testable action.",
  "relation classifications as configurable engineering assumptions.",
]);

export const SUPPLEMENTAL_NAS_REDLINE_IDS = Object.freeze([
  "no_person_type_classification_including_incomplete_chart",
  "no_single_person_emotion_number",
  "opening_is_solar_lunar_contrast_interacting_with_current_flow_month",
]);

export const SUPPLEMENTAL_NAS_REDLINE_TEXT = Object.freeze([
  "不得判定或命名人的類型；不得出現落差型、斷線型、過載型、空缺型、錯位型等型別名稱。盤面缺少出生時分、九宮或連線資料時，一律只描述可觀察的現象，不做型別分類。",
  "不得提及感情數；單人資料不能計算兩人主命數相加的感情數。",
  "開場必須呈現這位訂閱者的陽曆與陰曆主命數落差，如何和本期流月互相作用；不得使用通用開場。開場需有 300–400 個字元，並優先確保個人化。",
]);

export const MODEL_OUTPUT_BOUNDARIES = Object.freeze([
  "陽曆／陰曆主命數、本期流月值與週期日期由程式計算或提供；LLM 不得重算、改寫或補造。",
  "標題、段落 ID、日期、簽名、P.S. 與 HTML 由程式模板處理；LLM 只回傳指定 JSON 欄位的文字。",
]);

export const BANNED_OUTPUT_TERMS = Object.freeze([
  "感情數",
  "落差型",
  "斷線型",
  "過載型",
  "空缺型",
  "錯位型",
  "命定",
  "注定",
  "天命",
  "改命",
  "開運",
  "絕對準",
  "絕對",
  "破解命運",
  "必定",
  "必然",
  "保證",
  "百分之百",
  "無法改變",
  "逃不掉",
  "厄運",
  "災難",
  "你一定會",
  "這個數字就是不好",
  "宿命",
  "保證改善",
  "治療",
  "療效",
  "治癒",
  "疾病",
  "疾病根治",
  "醫療診斷",
  "法律保證",
  "投資保證",
]);

export const MONTHLY_SECTION_IDS = Object.freeze([
  "section_1",
  "section_2",
  "section_3",
  "section_4",
]);

export const MONTHLY_QUESTIONS = Object.freeze({
  status: "pending_erick_approval",
  sections: Object.freeze(MONTHLY_SECTION_IDS.map((id) => Object.freeze({
    id,
    question: null,
  }))),
});

export const NUMBER_ZERO_PROFILE_STATUS = "awaiting_erick_profile";

export function buildMonthlyPromptBundle(packet, approvedQuestions) {
  if (
    approvedQuestions?.status !== "approved"
    || !Array.isArray(approvedQuestions.sections)
    || approvedQuestions.sections.length !== MONTHLY_SECTION_IDS.length
  ) {
    throw new TypeError("monthly_questions 尚未核可或不完整");
  }
  const questionText = approvedQuestions.sections
    .map((section, index) => `${index + 1}. [${section.id}] ${section.question}`)
    .join("\n");

  const system = [
    "你是 NAS 生命數字月信的中文寫作模組。只使用輸入封包裡的計算欄位與 profile 文字作為事實；不得從生日重算或創造數值。",
    "口吻使用 NAS 第一層語言：溫暖、清楚、具體、有共鳴、不宿命；描述生活中可辨識的現象，再提供可測試的一步。不要使用 ABL 的信息場、頻率或能量場語言。",
    "敘事順序沿用既有郵件骨架：個人開場、分段回應、今晚可做的第一步、後續週期預告。問候、主旨、日期、簽名、P.S. 與 HTML 由程式模板處理，不要輸出。",
    "\n適用的 report_system.md 紅線（只列本產品適用條目）：",
    ...REPORT_SYSTEM_REDLINE_FRAGMENTS.map((line) => `- ${line}`),
    "\nNAS 月信補充紅線：",
    ...SUPPLEMENTAL_NAS_REDLINE_TEXT.map((line) => `- ${line}`),
    "\n計算與輸出欄位界線：",
    ...MODEL_OUTPUT_BOUNDARIES.map((line) => `- ${line}`),
    "\n個人化要求：opening 是本封信的第一段，長度為 300–400 個 Unicode 字元。必須同時寫出陽曆主命數 profile、陰曆主命數 profile 的一致或落差，以及這個交互如何落在本期流月節奏。前 300–400 字要讓當事人辨認出自己的狀態；不得用泛用問候或抽象套話充數。",
    "不得把人分類，也不得從不完整盤面推導類型。盤面沒有出生時分、九宮或連線資料，視為不具備判型條件；只可描述輸入 profile 支持的現象。",
    "不得在文字欄位輸出任何阿拉伯數字、日期或計算結果。數字 ID 只供你理解素材，不能重算、修改或寫進文字。遇到資料缺漏或矛盾時不要自行補足，讓前後攔截拒絕產文。",
    "只輸出符合下列形狀的 JSON，不要 Markdown fence、HTML、額外欄位或說明：",
    '{"opening":"...","sections":[{"id":"section_1","text":"..."},{"id":"section_2","text":"..."},{"id":"section_3","text":"..."},{"id":"section_4","text":"..."}],"firstStep":"...","nextCyclePreview":"..."}',
  ].join("\n");

  const user = JSON.stringify({
    calculated: {
      solarMain: packet.numbers.solarMain,
      lunarMain: packet.numbers.lunarMain,
      flowMonth: packet.numbers.flowMonth,
      solarLunarRelation: packet.relation.code,
    },
    profiles: packet.profiles,
    approvedMonthlyQuestions: questionText,
  });

  return Object.freeze({ system, user });
}
