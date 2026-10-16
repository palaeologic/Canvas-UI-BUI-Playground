import { PRESET_ORDER, type PresetKey } from "./presets";

export type Level = 0 | 1 | 2;
export type Dimension = "time" | "check" | "stakes";
export type Answers = Record<Dimension, Level>;

export interface Question {
  dim: Dimension;
  legend: string;
  label: string;
  options: [string, string, string];
  /** Short phrase per option for the explanation rows. */
  short: [string, string, string];
  /** The setting each option points to on its own. */
  map: [PresetKey, PresetKey, PresetKey];
}

export const QUESTIONS: Question[] = [
  {
    dim: "time",
    legend: "How long would a skilled colleague need for this?",
    label: "Size of the job",
    options: ["A few minutes", "An hour or two", "A day or more"],
    short: ["a few minutes", "an hour or two", "a day or more"],
    map: ["quick", "standard", "thorough"],
  },
  {
    dim: "check",
    legend: "Can you check the answer yourself, quickly?",
    label: "Checking it",
    options: ["Yes, at a glance", "Partly", "No, not easily"],
    short: ["easy to check", "partly checkable", "hard to check"],
    map: ["quick", "standard", "expert"],
  },
  {
    dim: "stakes",
    legend: "What happens if it's wrong?",
    label: "If it's wrong",
    options: ["Easy to fix", "Costs us time", "Serious: patient safety, GMP, legal, financial or regulatory"],
    short: ["easy to fix", "costs time", "serious consequences"],
    map: ["quick", "standard", "thorough"],
  },
];

export interface Recommendation {
  preset: PresetKey;
  reasons: { dim: Dimension; label: string; answer: string; suggests: PresetKey }[];
}

/** Each answer suggests a setting on its own; the strictest suggestion wins. */
export function recommend(answers: Answers): Recommendation {
  let best = 0;
  const reasons = QUESTIONS.map((q) => {
    const level = answers[q.dim];
    const suggests = q.map[level];
    best = Math.max(best, PRESET_ORDER.indexOf(suggests));
    return { dim: q.dim, label: q.label, answer: q.short[level], suggests };
  });
  return { preset: PRESET_ORDER[best] ?? "standard", reasons };
}
