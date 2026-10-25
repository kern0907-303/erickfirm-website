import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  calculateFlows,
  getFlowMonthWindow,
  LUNAR_TABLE,
  solarToLunar,
} from "../src/lib/numerology/index.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const vectorDirectory = path.resolve(scriptDirectory, "../docs/nas-life-number");
const numerologyVectors = JSON.parse(
  fs.readFileSync(path.join(vectorDirectory, "numerology-vectors.json"), "utf8"),
);
const lunarVectors = JSON.parse(
  fs.readFileSync(path.join(vectorDirectory, "lunar-vectors.json"), "utf8"),
);

assert.deepEqual(LUNAR_TABLE, lunarVectors.table, "calculation module lunar table drifted from fixture");
assert.equal(
  numerologyVectors.golden_from_excel.cases.length,
  numerologyVectors.golden_from_excel.count,
  "golden_from_excel case count mismatch",
);
assert.equal(lunarVectors.cases.length, lunarVectors.case_count, "lunar case count mismatch");
assert.equal(
  numerologyVectors.flow_month_window_cases.cases.length,
  numerologyVectors.flow_month_window_cases.count,
  "flow_month_window case count mismatch",
);

for (const [index, testCase] of numerologyVectors.golden_from_excel.cases.entries()) {
  const result = calculateFlows(testCase.birth, testCase.target);
  for (const [flowName, expectedKey] of [
    ["flowYear", "flow_year_path"],
    ["flowMonth", "flow_month_path"],
    ["flowDay", "flow_day_path"],
  ]) {
    assert.equal(
      result[flowName].path,
      testCase.expect[expectedKey],
      `golden case ${index + 1} ${flowName} (${testCase.target})`,
    );
  }
}

for (const [index, testCase] of numerologyVectors.derived_edge_cases.cases.entries()) {
  const result = calculateFlows(testCase.birth, testCase.target);
  for (const flowName of ["flowYear", "flowMonth", "flowDay"]) {
    const expected = testCase.expect[
      { flowYear: "flow_year", flowMonth: "flow_month", flowDay: "flow_day" }[flowName]
    ];
    assert.deepEqual(
      { source: result[flowName].source, steps: result[flowName].steps, num: result[flowName].num },
      expected,
      `derived case ${index + 1} ${flowName} (${testCase.target})`,
    );
  }
}

for (const [index, testCase] of numerologyVectors.flow_month_window_cases.cases.entries()) {
  assert.deepEqual(
    getFlowMonthWindow(testCase.birth, testCase.target),
    testCase.expect,
    `flow month window case ${index + 1} (${testCase.target})`,
  );
}

for (const [index, testCase] of lunarVectors.cases.entries()) {
  assert.deepEqual(
    solarToLunar(testCase.solar),
    testCase.lunar,
    `lunar case ${index + 1} (${testCase.solar})`,
  );
}

console.log(`numerology golden_from_excel: ${numerologyVectors.golden_from_excel.cases.length}/${numerologyVectors.golden_from_excel.count} PASS`);
console.log(`numerology derived_edge_cases: ${numerologyVectors.derived_edge_cases.cases.length}/${numerologyVectors.derived_edge_cases.count} PASS`);
console.log(`flow month window cases: ${numerologyVectors.flow_month_window_cases.cases.length}/${numerologyVectors.flow_month_window_cases.count} PASS`);
console.log(`lunar vectors: ${lunarVectors.cases.length}/${lunarVectors.case_count} PASS`);
console.log(`lunar table: ${Object.keys(LUNAR_TABLE).length} years, exact match PASS`);
