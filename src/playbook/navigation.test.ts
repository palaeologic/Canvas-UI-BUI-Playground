import { describe, expect, test } from "bun:test";
import { PLAYBOOK_NAV, normalizePlaybookFragment, playbookFragmentHref } from "./playbook-nav";

describe("playbook navigation registry", () => {
  test("has the seven conceptual groups in order", () => {
    expect(PLAYBOOK_NAV.map((group) => group.label)).toEqual([
      "Understand", "Diagnose", "Choose & route", "Configure", "Platform", "Measure", "Govern",
    ]);
  });

  test("contains each primary section exactly once", () => {
    const ids = PLAYBOOK_NAV.flatMap((group) => group.items.map((item) => item.id));
    expect(ids).toEqual(["dials", "explorer", "when", "which", "defaults", "matrix", "chat", "openchamber", "bio", "bedrock", "sweep", "habit"]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("normalizes old and current fragments", () => {
    expect(normalizePlaybookFragment("code")).toBe("openchamber");
    expect(normalizePlaybookFragment("#matrix")).toBe("matrix");
    expect(normalizePlaybookFragment("")).toBeNull();
    expect(normalizePlaybookFragment("missing")).toBeNull();
    expect(playbookFragmentHref("bio")).toBe("/playbook#bio");
  });
});
