import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSkillListQuery,
  buildSkillTreeNodes,
  formatSkillTextFile,
  getSkillStatusMeta,
  getParseStatusMeta,
  getValidateStatusMeta,
  summarizeSkills,
} from "../src/common/SkillFormatter.mjs";

test("buildSkillListQuery omits empty filters and keeps explicit zero values", () => {
  const query = buildSkillListQuery({
    pageNum: 2,
    pageSize: 20,
    keyword: " parser ",
    status: 0,
    parseStatus: "",
    validateStatus: null,
  });

  assert.equal(query, "pageNum=2&pageSize=20&keyword=parser&status=0");
});

test("status metadata is independent for enable, parse and validate states", () => {
  assert.equal(getSkillStatusMeta(1).text, "已启用");
  assert.equal(getSkillStatusMeta(0).text, "已停用");
  assert.equal(getParseStatusMeta(1).text, "解析成功");
  assert.equal(getParseStatusMeta(-1).text, "解析失败");
  assert.equal(getValidateStatusMeta(1).text, "校验通过");
  assert.equal(getValidateStatusMeta(-1).text, "校验失败");
});

test("summarizeSkills counts validation pending separately from enable status", () => {
  const summary = summarizeSkills([
    { status: 1, validateStatus: 1 },
    { status: 1, validateStatus: 0 },
    { status: 0, validateStatus: -1 },
  ]);

  assert.deepEqual(summary, {
    total: 3,
    enabled: 2,
    disabled: 1,
    pendingValidate: 2,
  });
});

test("buildSkillTreeNodes creates synthetic directories and preserves files", () => {
  const tree = buildSkillTreeNodes([
    { path: "SKILL.md", textFile: true, size: 12 },
    { path: "references/rules.txt", textFile: true, size: 8 },
    { path: "assets/icon.png", textFile: false, size: 32 },
  ]);

  assert.deepEqual(
    tree.map((node) => ({
      path: node.path,
      name: node.name,
      depth: node.depth,
      directory: node.directory,
      textFile: node.textFile,
    })),
    [
      { path: "SKILL.md", name: "SKILL.md", depth: 0, directory: false, textFile: true },
      { path: "assets", name: "assets", depth: 0, directory: true, textFile: false },
      { path: "assets/icon.png", name: "icon.png", depth: 1, directory: false, textFile: false },
      { path: "references", name: "references", depth: 0, directory: true, textFile: false },
      { path: "references/rules.txt", name: "rules.txt", depth: 1, directory: false, textFile: true },
    ]
  );
});

test("formatSkillTextFile formats json and normalizes other text safely", () => {
  assert.equal(formatSkillTextFile("config.json", '{"b":2,"a":1}'), '{\n  "b": 2,\n  "a": 1\n}\n');
  assert.equal(formatSkillTextFile("SKILL.md", "line 1  \r\nline 2"), "line 1\nline 2\n");
});
