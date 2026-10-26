// 生命功課等級（Excel 完整路徑規則）與農曆換算回歸測試。
// 期望值與 nas-annual-engine 的 birth_track 相同（2026-10-26 三方對拍 2,693 筆生日 0 差異）。
import assert from "node:assert/strict";
import test from "node:test";
import { handleAiReading } from "../server/ai_reading.js";

async function report(birthdate) {
  const res = await handleAiReading({ httpMethod: "POST", body: JSON.stringify({ mode: "report", birthdate }) }, {});
  return JSON.parse(res.body);
}

const CASES = [
  ["1930-02-05", "+20/2", "7級", "-21/3", "5級"],
  ["1930-05-19", "+28/10/1", "5級", "-20/2", "7級"],
  ["1945-09-19", "+38/11/2", "2級", "-32/5", "4級"],
  ["2007-08-29", "+28/10/1", "2級", "-24/6", "2級"],
  ["1970-06-08", "+31/4", "2級", "-27/9", "5級"],
  ["1970-09-15", "+32/5", "4級", "-31/4", "2級"],
];

for (const [birth, solarMain, solarSoul, lunarMain, lunarSoul] of CASES) {
  test(`等級與主命數 ${birth}`, async () => {
    const { parsed } = await report(birth);
    assert.deepEqual(
      [parsed.solarMain, parsed.solarSoul, parsed.lunarMain, parsed.lunarSoul],
      [solarMain, solarSoul, lunarMain, lunarSoul],
    );
  });
}

test("1970 年中秋換算為農曆八月十五", async () => {
  const body = await report("1970-09-15");
  assert.deepEqual(body.lunar_parsed, { y: 1970, m: 8, d: 15 });
});
