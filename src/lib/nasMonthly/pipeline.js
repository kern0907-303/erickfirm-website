import {
  BANNED_OUTPUT_TERMS,
  MONTHLY_QUESTIONS,
  MONTHLY_SECTION_IDS,
  buildMonthlyPromptBundle,
} from "./policy.js";
import { calculateBirthNumbers, calculateFlows } from "../numerology/index.js";

const PROFILE_FIELDS = Object.freeze(["theme", "strength", "watch"]);
const NUMBER_KEYS = Object.freeze(["solarMain", "lunarMain", "flowMonth"]);
const RELATION_CODES = new Set(["same_number", "same_group", "cross_group"]);

/** Calculate the three narrative numbers with the canonical numerology module. */
export function calculateMonthlyNumbers({ solarBirthDate, lunarBirthOverride = "", targetDate }) {
  const birth = calculateBirthNumbers(solarBirthDate, lunarBirthOverride);
  const flows = calculateFlows(solarBirthDate, targetDate);
  return {
    solarMain: birth.solarMain.number,
    lunarMain: birth.lunarMain?.number ?? null,
    flowMonth: flows.flowMonth.num,
  };
}

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function addDays(isoDate, dayDelta) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + dayDelta));
  return `${String(date.getUTCFullYear()).padStart(4, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function toSelectedProfile(profile, number) {
  if (!profile || typeof profile !== "object") return null;
  return {
    number,
    theme: typeof profile.theme === "string" ? profile.theme.trim() : "",
    strength: typeof profile.strength === "string" ? profile.strength.trim() : "",
    watch: typeof profile.watch === "string" ? profile.watch.trim() : "",
  };
}

function normalizeRelationRules(rules) {
  if (!rules || typeof rules !== "object") return null;
  const groups = rules.core_groups ?? rules.coreGroups;
  if (Array.isArray(rules.groups)) {
    if (rules.groups.length === 0) return null;
    return { groups: rules.groups };
  }
  if (!groups || typeof groups !== "object") return null;

  const normalizedGroups = Object.values(groups)
    .map((group) => Array.isArray(group?.numbers) ? group.numbers : [])
    .filter((numbers) => numbers.length > 0);
  if (normalizedGroups.length === 0) return null;
  return { groups: normalizedGroups };
}

function getRelationCode(solarNumber, lunarNumber, rules) {
  const normalized = normalizeRelationRules(rules);
  if (!normalized) return null;
  if (solarNumber === lunarNumber) return "same_number";

  const solarGroup = normalized.groups.find((group) => group.includes(solarNumber));
  const lunarGroup = normalized.groups.find((group) => group.includes(lunarNumber));
  if (!solarGroup || !lunarGroup) return null;
  return solarGroup === lunarGroup ? "same_group" : "cross_group";
}

/**
 * Build a model-safe packet. Callers provide only deterministic calculation output,
 * a profile catalog, relation_rules.json, and the flow-window API response. PII and
 * raw birth dates are intentionally not accepted or copied into the result.
 */
export function buildMonthlyNarrativePacket({
  numbers,
  flowWindow,
  profileCatalog,
  relationRules,
  monthlyQuestions = MONTHLY_QUESTIONS,
}) {
  const safeNumbers = {};
  for (const key of NUMBER_KEYS) safeNumbers[key] = numbers?.[key] ?? null;

  const profiles = {};
  for (const key of NUMBER_KEYS) {
    const number = safeNumbers[key];
    profiles[key] = toSelectedProfile(profileCatalog?.[String(number)], number);
  }

  const safeFlowWindow = flowWindow && typeof flowWindow === "object"
    ? {
      start: flowWindow.start ?? null,
      end: flowWindow.end ?? null,
      nextChange: flowWindow.nextChange ?? null,
      nextSendDate: flowWindow.nextSendDate ?? null,
    }
    : null;

  const safeRules = normalizeRelationRules(relationRules);

  return {
    numbers: safeNumbers,
    profiles,
    relationRules: safeRules,
    flowWindow: safeFlowWindow,
    monthlyQuestions,
  };
}

export function validateMonthlyPreflight(packet) {
  const errors = [];
  if (!packet || typeof packet !== "object") {
    return { ok: false, errors: ["missing_packet"] };
  }

  for (const key of NUMBER_KEYS) {
    const value = packet.numbers?.[key];
    if (!Number.isInteger(value) || value < 0 || value > 9) {
      errors.push(`invalid_number:${key}`);
      continue;
    }
    if (value === 0) errors.push("profile_pending:0");

    const profile = packet.profiles?.[key];
    if (!profile) {
      errors.push(`missing_profile:${key}:${value}`);
      continue;
    }
    if (profile.number !== value) errors.push(`numeric_conflict:profile:${key}`);
    for (const field of PROFILE_FIELDS) {
      if (typeof profile[field] !== "string" || !profile[field].trim()) {
        errors.push(`missing_profile_field:${key}:${field}`);
      }
    }
  }

  if (!packet.relationRules) {
    errors.push("missing_relation_rules");
  } else {
    const derivedRelation = getRelationCode(
      packet.numbers?.solarMain,
      packet.numbers?.lunarMain,
      packet.relationRules,
    );
    if (!derivedRelation || !RELATION_CODES.has(derivedRelation)) {
      errors.push("invalid_relation_rules");
    }
  }

  const window = packet.flowWindow;
  if (!window || ![window.start, window.end, window.nextChange, window.nextSendDate].every(isIsoDate)) {
    errors.push("invalid_flow_window");
  } else if (
    window.start > window.end
    || addDays(window.end, 1) !== window.nextChange
    || addDays(window.nextChange, -1) !== window.nextSendDate
  ) {
    errors.push("numeric_conflict:flow_window");
  }

  const questions = packet.monthlyQuestions;
  if (
    questions?.status !== "approved"
    || !Array.isArray(questions.sections)
    || questions.sections.length !== MONTHLY_SECTION_IDS.length
    || questions.sections.some((section, index) => (
      section?.id !== MONTHLY_SECTION_IDS[index]
      || typeof section.question !== "string"
      || !section.question.trim()
      || section.question.includes("__PENDING")
    ))
  ) {
    errors.push("missing_section_questions");
  }

  return { ok: errors.length === 0, errors };
}

function getDerivedRelation(packet) {
  return getRelationCode(
    packet.numbers.solarMain,
    packet.numbers.lunarMain,
    packet.relationRules,
  );
}

function buildPromptPacket(packet) {
  return {
    numbers: packet.numbers,
    profiles: packet.profiles,
    relation: { code: getDerivedRelation(packet) },
  };
}

function parseGeneratedJson(raw) {
  if (typeof raw !== "string") {
    return { ok: false, error: "json_parse_failed:not_string" };
  }
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false, error: "json_parse_failed:invalid_json" };
  }
}

function getTextFields(result) {
  if (!result || typeof result !== "object" || !Array.isArray(result.sections)) return null;
  return [
    result.opening,
    ...result.sections.map((section) => section?.text),
    result.firstStep,
    result.nextCyclePreview,
  ];
}

function numericConflictInText(text, packet) {
  const expected = {
    "陽曆": packet.numbers.solarMain,
    "陰曆": packet.numbers.lunarMain,
    "本期流月": packet.numbers.flowMonth,
    "流月": packet.numbers.flowMonth,
  };
  const claims = /(?:本期流月|陽曆|陰曆|流月|主命數|生命數字|數字)(?:主命數)?[^0-9０-９零〇一二三四五六七八九十]{0,8}([0-9０-９零〇一二三四五六七八九十]+)/gu;
  const chineseDigits = { 零: 0, 〇: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  for (const match of text.matchAll(claims)) {
    const labelMatch = match[0].match(/^(本期流月|陽曆|陰曆|流月)/u);
    const label = labelMatch?.[1];
    const rawValue = match[1].replace(/[０-９]/g, (digit) => String(digit.charCodeAt(0) - 0xff10 + 48));
    const claimedValue = /^\d+$/.test(rawValue)
      ? Number(rawValue)
      : [...rawValue].reduce((value, digit) => chineseDigits[digit] ?? Number.NaN, 0);
    if (!Number.isFinite(claimedValue) || expected[label] === undefined || claimedValue !== expected[label]) return true;
  }
  return /[0-9０-９]/u.test(text);
}

function containsBannedTerms(text) {
  const normalized = text.normalize("NFKC");
  const matches = BANNED_OUTPUT_TERMS.filter((term) => normalized.includes(term.normalize("NFKC")));
  if (/[\p{Script=Han}]{1,6}型/u.test(normalized)) matches.push("型別分類");
  return matches;
}

export function validateMonthlyGeneratedContent(result, packet) {
  const errors = [];
  const textFields = getTextFields(result);
  if (!textFields || !["opening", "sections", "firstStep", "nextCyclePreview"].every((key) => key in result)) {
    return { ok: false, errors: ["invalid_json_schema"] };
  }
  if (textFields.some((field) => typeof field !== "string" || !field.trim())) {
    errors.push("empty_text_field");
    return { ok: false, errors };
  }
  if (Object.keys(result).some((key) => !["opening", "sections", "firstStep", "nextCyclePreview"].includes(key))) {
    errors.push("unexpected_json_field");
  }
  if (
    result.sections.length !== MONTHLY_SECTION_IDS.length
    || result.sections.some((section, index) => section?.id !== MONTHLY_SECTION_IDS[index])
    || result.sections.some((section) => Object.keys(section ?? {}).some((key) => !["id", "text"].includes(key)))
  ) {
    errors.push("section_order_or_schema_mismatch");
  }

  const allText = textFields.join("\n");
  const bannedTerms = containsBannedTerms(allText);
  if (bannedTerms.length) errors.push(`banned_term:${bannedTerms.join(",")}`);
  if (numericConflictInText(allText, packet)) errors.push("numeric_conflict:generated_text");
  if (/[一二三四五六七八九十]{1,2}月(?:[一二三四五六七八九十]{1,3}日)?|[二〇零一二三四五六七八九]{4}年/u.test(allText)) {
    errors.push("llm_generated_date_claim");
  }

  const opening = result.opening;
  const openingLength = Array.from(opening).length;
  if (openingLength < 300 || openingLength > 400) errors.push("opening_length_out_of_range");

  const requiredAnchors = [
    "陽曆",
    "陰曆",
    "流月",
    packet.profiles.solarMain.theme,
    packet.profiles.lunarMain.theme,
    packet.profiles.flowMonth.theme,
  ];
  if (requiredAnchors.some((anchor) => !opening.includes(anchor))) {
    errors.push("opening_missing_personalization_anchor");
  }
  if (!/(?:交會|交互|互相|牽動|影響|相遇|交織)/u.test(opening)) {
    errors.push("opening_missing_interaction");
  }
  if (!opening.includes("本期") || !opening.includes("流月")) {
    errors.push("opening_missing_current_flow_month");
  }
  if (packet.numbers.solarMain === packet.numbers.lunarMain) {
    if (!/(?:一致|相同)/u.test(opening)) errors.push("opening_missing_alignment");
  } else if (!/(?:不同|落差)/u.test(opening)) {
    errors.push("opening_missing_contrast");
  }
  if (!result.firstStep.includes("今晚") || !/(?:先|寫下|選擇|試著|安排|設定|整理|列出|完成|預留|留下|停下|問自己|練習|對話|記錄|確認|區分|拒絕|調整)/u.test(result.firstStep)) {
    errors.push("first_step_not_actionable");
  }

  const sectionChecks = [
    {
      id: "section_1",
      anchors: ["陽曆", packet.profiles.solarMain.theme, packet.profiles.flowMonth.theme],
      response: /(?:方向|推向|推動)/u,
    },
    {
      id: "section_2",
      anchors: ["陰曆", packet.profiles.lunarMain.theme, packet.profiles.flowMonth.theme],
      response: /(?:順|卡)/u,
    },
    {
      id: "section_3",
      anchors: ["陽曆", packet.profiles.solarMain.theme, "陰曆", packet.profiles.lunarMain.theme, packet.profiles.flowMonth.theme],
      response: /(?:現形|呈現|出現|表現)/u,
      contrast: /(?:落差|一致)/u,
    },
    {
      id: "section_4",
      anchors: ["流月", packet.profiles.flowMonth.theme],
      response: /(?:^|[^不])適合/u,
      contrast: /(?:不適合|不宜|先別|不要|別).{0,6}硬推/u,
    },
  ];
  for (const check of sectionChecks) {
    const section = result.sections.find((entry) => entry.id === check.id);
    if (!section) continue;
    const sectionText = section.text;
    if (
      !sectionText.includes("本期")
      || !sectionText.includes("流月")
      || !/(?:交會|交互|互相|牽動|影響|相遇|交織|帶動|推動|碰上|遇上)/u.test(sectionText)
      || check.anchors.some((anchor) => !sectionText.includes(anchor))
    ) {
      errors.push(`section_missing_flow_interaction:${check.id}`);
    }
    if (check.response && !check.response.test(sectionText)) {
      errors.push(`section_missing_answer:${check.id}`);
    }
    if (check.contrast && !check.contrast.test(sectionText)) {
      errors.push(`section_missing_contrast:${check.id}`);
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Draft-only pipeline. It has no persistence or delivery adapter, and its only
 * external dependency is an injected text generator (mocked in dry-run tests).
 */
export async function runMonthlyDraftPipeline({ packet, generateText }) {
  const preflight = validateMonthlyPreflight(packet);
  if (!preflight.ok) {
    return {
      status: "blocked",
      stage: "preflight",
      errors: preflight.errors,
      sent: false,
      persisted: false,
    };
  }
  if (typeof generateText !== "function") {
    return {
      status: "blocked",
      stage: "preflight",
      errors: ["missing_text_generator"],
      sent: false,
      persisted: false,
    };
  }

  const promptPacket = buildPromptPacket(packet);
  const prompts = buildMonthlyPromptBundle(promptPacket, packet.monthlyQuestions);
  let raw;
  try {
    raw = await generateText(prompts);
  } catch {
    return {
      status: "blocked",
      stage: "generation",
      errors: ["text_generation_failed"],
      sent: false,
      persisted: false,
    };
  }

  const parsed = parseGeneratedJson(raw);
  if (!parsed.ok) {
    return {
      status: "blocked",
      stage: "postflight",
      errors: [parsed.error],
      sent: false,
      persisted: false,
    };
  }

  const postflight = validateMonthlyGeneratedContent(parsed.value, packet);
  if (!postflight.ok) {
    return {
      status: "blocked",
      stage: "postflight",
      errors: postflight.errors,
      sent: false,
      persisted: false,
    };
  }

  return {
    status: "dry_run_ready_for_review",
    stage: "complete",
    draft: parsed.value,
    deterministicEnvelope: {
      numbers: packet.numbers,
      flowWindow: packet.flowWindow,
      relationCode: getDerivedRelation(packet),
    },
    sent: false,
    persisted: false,
  };
}
