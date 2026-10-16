import { describe, expect, test } from "bun:test";
import { recommend, type Answers } from "./picker";

const a = (time: 0 | 1 | 2, check: 0 | 1 | 2, stakes: 0 | 1 | 2): Answers => ({ time, check, stakes });

describe("recommend", () => {
  test("all low answers give Quick", () => {
    expect(recommend(a(0, 0, 0)).preset).toBe("quick");
  });

  test("changing any single answer away from the lowest changes the result", () => {
    expect(recommend(a(1, 0, 0)).preset).toBe("standard");
    expect(recommend(a(0, 1, 0)).preset).toBe("standard");
    expect(recommend(a(0, 0, 1)).preset).toBe("standard");
  });

  test("hard-to-check work brings in the stronger model", () => {
    expect(recommend(a(0, 2, 0)).preset).toBe("expert");
  });

  test("serious stakes or long jobs give Thorough", () => {
    expect(recommend(a(0, 0, 2)).preset).toBe("thorough");
    expect(recommend(a(2, 0, 0)).preset).toBe("thorough");
  });

  test("explains every answer", () => {
    const r = recommend(a(1, 2, 0));
    expect(r.preset).toBe("expert");
    expect(r.reasons.map((x) => x.suggests)).toEqual(["standard", "expert", "quick"]);
  });
});
