import { describe, expect, test } from "bun:test";
import { recommend } from "./picker";
import { ROLES, ROLE_ALIASES, TEAMS, TITLES, isCodeSetting, toAnswers } from "./roles";
import { findRoles } from "./finder";

const keys = new Set(ROLES.map((r) => r.key));

describe("role examples", () => {
  test("every chat example's picker answers lead to its setting", () => {
    for (const role of ROLES) for (const c of role.cards) {
      if (isCodeSetting(c.setting)) continue;
      expect(c.answers, `${role.key}/${c.area} needs answers`).toBeDefined();
      expect(recommend(toAnswers(c.answers!)).preset, `${role.key}/${c.area}`).toBe(c.setting);
    }
  });

  test("OpenChamber examples have no picker answers", () => {
    for (const role of ROLES) for (const c of role.cards) if (isCodeSetting(c.setting)) expect(c.answers).toBeUndefined();
  });

  test("every tab teaches at least two different settings", () => {
    for (const role of ROLES) expect(new Set(role.cards.map((c) => c.setting)).size).toBeGreaterThan(1);
  });
});

describe("title and team mapping", () => {
  test("all 63 job titles and 24 teams map to existing tabs", () => {
    expect(Object.keys(TITLES)).toHaveLength(63);
    expect(Object.keys(TEAMS)).toHaveLength(24);
    for (const v of [...Object.values(TITLES), ...Object.values(TEAMS)]) {
      expect(v.length).toBeGreaterThan(0);
      for (const k of v) expect(keys.has(k)).toBe(true);
    }
  });

  test("old tab keys still resolve", () => {
    for (const k of Object.values(ROLE_ALIASES)) expect(keys.has(k)).toBe(true);
  });
});

describe("findRoles", () => {
  const names = (q: string) => findRoles(q).map((h) => h.name);
  test("matches word starts, in any case", () => {
    expect(names("process tech")).toEqual(["Process Technician", "Senior Process Technician"]);
    expect(names("ANTIGEN")).toEqual(["Antigen Core"]);
  });
  test("understands common abbreviations both ways", () => {
    expect(names("qc")).toContain("Quality Control");
    expect(names("qp")).toEqual(["Quality Assurance Manager & Qualified Person"]);
    expect(names("quality assurance")).toContain("QA Manager");
  });
  test("returns nothing for empty or unknown input", () => {
    expect(findRoles("  ")).toEqual([]);
    expect(findRoles("xyz")).toEqual([]);
  });
  test("titles with two tabs return both, main tab first", () => {
    expect(findRoles("director of gmp")[0]!.keys).toEqual(["mfg", "lead"]);
  });
});
