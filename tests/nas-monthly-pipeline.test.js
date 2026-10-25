import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  BANNED_OUTPUT_TERMS,
  MONTHLY_QUESTIONS,
  MONTHLY_SECTION_IDS,
  MODEL_OUTPUT_BOUNDARIES,
  NUMBER_ZERO_PROFILE_STATUS,
  REPORT_SYSTEM_REDLINE_FRAGMENTS,
  SUPPLEMENTAL_NAS_REDLINE_IDS,
  SUPPLEMENTAL_NAS_REDLINE_TEXT,
  buildMonthlyNarrativePacket,
  buildMonthlyPromptBundle,
  calculateMonthlyNumbers,
  runMonthlyDraftPipeline,
  validateMonthlyGeneratedContent,
  validateMonthlyPreflight,
} from "../src/lib/nasMonthly/index.js";

const approvedSyntheticQuestions = {
  status: "approved",
  sections: MONTHLY_SECTION_IDS.map((id, index) => ({
    id,
    question: `SYNTHETIC_TEST_QUESTION_${String.fromCharCode(65 + index)}`,
  })),
};

const syntheticProfileCatalog = {
  "1": { theme: "發起", strength: "表達主張", watch: "獨自推進" },
  "2": { theme: "連結", strength: "建立互信", watch: "模糊界線" },
  "5": { theme: "轉換", strength: "探索新路徑", watch: "缺少收斂" },
  "4": { theme: "建構", strength: "穩定流程", watch: "只沿用熟悉選項" },
  "8": { theme: "成果", strength: "整合資源", watch: "把控制當成安全" },
  "9": { theme: "整合", strength: "完成循環", watch: "尚未收尾就開新線" },
};

const syntheticRelationRules = {
  core_groups: {
    A: { numbers: [1, 4, 8] },
    B: { numbers: [2, 6, 9] },
    C: { numbers: [3, 5, 7] },
  },
  polarity_pairs: [[1, 2]],
};

function makePacket({
  numbers = { solarMain: 1, lunarMain: 2, flowMonth: 5 },
  profileCatalog = syntheticProfileCatalog,
  monthlyQuestions = approvedSyntheticQuestions,
  flowWindow = {
    start: "2027-01-31",
    end: "2027-02-28",
    nextChange: "2027-03-01",
    nextSendDate: "2027-02-28",
  },
} = {}) {
  return buildMonthlyNarrativePacket({
    numbers,
    profileCatalog,
    relationRules: syntheticRelationRules,
    monthlyQuestions,
    flowWindow,
  });
}

function makeValidDraft(packet = makePacket()) {
  const anchors = [
    `陽曆${packet.profiles.solarMain.theme}`,
    `陰曆${packet.profiles.lunarMain.theme}`,
    `流月${packet.profiles.flowMonth.theme}`,
    packet.numbers.solarMain === packet.numbers.lunarMain ? "一致" : "不同",
  ].join("，");
  const seed = `${anchors}呈現的，是想往前推進的方向、實際採取的方式，以及本期節奏如何交會。這些資料只描述可觀察的傾向，讓你在日常選擇中找到更適合自己的做法。`;
  const opening = Array.from(seed.repeat(8)).slice(0, 330).join("");
  return {
    opening,
    sections: MONTHLY_SECTION_IDS.map((id) => ({
      id,
      text: "這段是合成測試文字，用來確認各段問題依序承接，不代表正式月信文案。",
    })),
    firstStep: "今晚先寫下一件最想推進的事，再選一個可以在十分鐘內完成的步驟。",
    nextCyclePreview: "下一個週期再回來檢視，哪些做法值得延續，哪些需要調整。",
  };
}

function asGenerator(draft) {
  return async () => JSON.stringify(draft);
}

test("report_system redlines included in prompt are exact fragments of the unchanged baseline", async () => {
  const baseline = await readFile(new URL("../docs/nas-life-number/report_system.md", import.meta.url), "utf8");
  for (const redline of REPORT_SYSTEM_REDLINE_FRAGMENTS) {
    assert.ok(baseline.includes(redline), `baseline is missing prompt redline: ${redline}`);
  }

  const packet = makePacket();
  const prompts = buildMonthlyPromptBundle({
    numbers: packet.numbers,
    profiles: packet.profiles,
    relation: { code: "polarity_pair" },
  }, approvedSyntheticQuestions);
  for (const redline of REPORT_SYSTEM_REDLINE_FRAGMENTS) assert.ok(prompts.system.includes(redline));
  for (const supplementalRule of SUPPLEMENTAL_NAS_REDLINE_TEXT) assert.ok(prompts.system.includes(supplementalRule));
  for (const boundary of MODEL_OUTPUT_BOUNDARIES) assert.ok(prompts.system.includes(boundary));
  assert.equal(SUPPLEMENTAL_NAS_REDLINE_IDS.length, SUPPLEMENTAL_NAS_REDLINE_TEXT.length);
  assert.ok(!prompts.system.includes("universal path 11/2"));
  assert.ok(!prompts.system.includes("book lens"));
  assert.ok(!prompts.system.includes("five polarity pairs"));
  assert.ok(!prompts.system.includes("polarity_pair"));
  assert.ok(!prompts.system.includes("Use book lenses only"));
  assert.ok(!prompts.system.includes("2027 universal path"));
});

test("synthetic end-to-end draft completes without sending or persisting", async () => {
  const numbers = calculateMonthlyNumbers({ solarBirthDate: "1990-01-15", targetDate: "2027-02-15" });
  assert.deepEqual(numbers, { solarMain: 8, lunarMain: 4, flowMonth: 9 });
  const packet = makePacket({
    numbers,
    flowWindow: {
      start: "2027-02-15",
      end: "2027-03-14",
      nextChange: "2027-03-15",
      nextSendDate: "2027-03-14",
    },
  });
  const result = await runMonthlyDraftPipeline({
    packet,
    generateText: async (prompts) => {
      assert.ok(prompts.system.includes("300–400 個 Unicode 字元"));
      assert.ok(prompts.user.includes('"solarMain":8'));
      assert.ok(!prompts.user.includes("1990-01-15"));
      assert.ok(!prompts.user.includes("2027-02-15"));
      return JSON.stringify(makeValidDraft(packet));
    },
  });

  assert.equal(result.status, "dry_run_ready_for_review");
  assert.equal(result.sent, false);
  assert.equal(result.persisted, false);
  assert.equal(result.deterministicEnvelope.flowWindow.nextChange, "2027-03-15");
  assert.equal(result.deterministicEnvelope.relationCode, "same_group");
  assert.equal(Array.from(result.draft.opening).length, 330);
});

test("missing profile including unresolved number 0 blocks before text generation", async () => {
  const packet = makePacket({ numbers: { solarMain: 0, lunarMain: 2, flowMonth: 5 } });
  let called = false;
  const result = await runMonthlyDraftPipeline({
    packet,
    generateText: async () => { called = true; return "{}"; },
  });

  assert.equal(NUMBER_ZERO_PROFILE_STATUS, "awaiting_erick_profile");
  assert.equal(result.status, "blocked");
  assert.ok(result.errors.includes("missing_profile:solarMain:0"));
  assert.equal(called, false);
});

test("unapproved or absent section questions block before text generation", async () => {
  const packet = makePacket({ monthlyQuestions: MONTHLY_QUESTIONS });
  let called = false;
  const result = await runMonthlyDraftPipeline({
    packet,
    generateText: async () => { called = true; return "{}"; },
  });

  assert.equal(result.status, "blocked");
  assert.ok(result.errors.includes("missing_section_questions"));
  assert.equal(called, false);
});

test("profile number conflicting with computed number is blocked in preflight", () => {
  const packet = makePacket();
  packet.profiles.solarMain.number = 9;
  const result = validateMonthlyPreflight(packet);
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes("numeric_conflict:profile:solarMain"));
});

test("banned type names and 感情數 are blocked after generation", () => {
  const packet = makePacket();
  const draft = makeValidDraft(packet);
  draft.opening = `${draft.opening.slice(0, -1)}落差型與感情數`;
  const result = validateMonthlyGeneratedContent(draft, packet);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes("落差型")));
  assert.ok(result.errors.some((error) => error.includes("感情數")));
});

test("numeric claim that disagrees with the computed flow month is blocked", () => {
  const packet = makePacket();
  const draft = makeValidDraft(packet);
  draft.sections[0].text = "本期流月是六，請直接依此判斷。";
  const result = validateMonthlyGeneratedContent(draft, packet);
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes("numeric_conflict:generated_text"));
});

test("invalid JSON is blocked at postflight", async () => {
  const result = await runMonthlyDraftPipeline({ packet: makePacket(), generateText: async () => "{not-json" });
  assert.equal(result.status, "blocked");
  assert.equal(result.stage, "postflight");
  assert.ok(result.errors.includes("json_parse_failed:invalid_json"));
});

test("generic opening without all three personal anchors is blocked", () => {
  const packet = makePacket();
  const draft = makeValidDraft(packet);
  draft.opening = Array.from("這是一段沒有個人主命數或本期流月資訊的通用開場。".repeat(30)).slice(0, 330).join("");
  const result = validateMonthlyGeneratedContent(draft, packet);
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes("opening_missing_personalization_anchor"));
});

test("NAS banned phrases from the brand guardrail are caught", () => {
  const packet = makePacket();
  const draft = makeValidDraft(packet);
  draft.firstStep = "你一定會開運。";
  const result = validateMonthlyGeneratedContent(draft, packet);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => BANNED_OUTPUT_TERMS.some((term) => error.includes(term))));
});
