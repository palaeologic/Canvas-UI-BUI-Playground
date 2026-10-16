import { MODELS, type Effort, type ModelKey } from "./models";

export type PresetKey = "quick" | "standard" | "expert" | "thorough";

export interface Preset {
  key: PresetKey;
  name: string;
  model: ModelKey;
  effort: Effort;
  like: string;
  examples: string[];
  speed: string;
  why: string;
}

export const PRESET_ORDER: PresetKey[] = ["quick", "standard", "expert", "thorough"];

export const PRESETS: Record<PresetKey, Preset> = {
  quick: {
    key: "quick", name: "Quick", model: "haiku", effort: "low",
    like: "Asking the lab technician for a quick answer.",
    examples: ["Excel formula fixes", "Emails and meeting notes", "IT how-to questions"],
    speed: "Fastest · lowest cost",
    why: "Short, low-risk and easy to check. Quick gives you an answer in seconds.",
  },
  standard: {
    key: "standard", name: "Standard", model: "sonnet", effort: "medium",
    like: "Giving a research associate a focused hour.",
    examples: ["Slide decks and status reports", "Spreadsheets and QC trending", "SOP drafts and paper summaries"],
    speed: "Fast · moderate cost",
    why: "A real piece of work with a clear goal. Standard is the right everyday choice.",
  },
  expert: {
    key: "expert", name: "Expert", model: "opus", effort: "medium",
    like: "A senior scientist's considered opinion.",
    examples: ["Board and partnering narratives", "Statistics and assay choices", "Portfolio and capacity trade-offs"],
    speed: "Slower · higher cost",
    why: "It needs judgement or know-how you can't easily check, so bring in the stronger model.",
  },
  thorough: {
    key: "thorough", name: "Thorough", model: "opus", effort: "high",
    like: "The senior scientist's full, careful review.",
    examples: ["Contract and patent review", "Clinical, regulatory and GMP documents", "Multi-paper evidence reviews"],
    speed: "Slowest · highest cost",
    why: "It's long, high-stakes or hard to verify. Give the strongest model time to check its own work, and still have an expert review the result.",
  },
};

export const presetConfig = (p: Preset) => `${MODELS[p.model].name.split(" ")[0]} · ${p.effort} effort`;
