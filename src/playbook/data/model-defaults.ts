export const EFFORT_LEVELS = ["low", "medium", "high", "xhigh", "max"] as const;
export type EffortLevel = (typeof EFFORT_LEVELS)[number];

export const MODEL_DEFAULTS = [
  { key: "haiku", name: "Haiku 5.5", cssColor: "var(--haiku)", defaultEffort: "medium" as EffortLevel, bedrockId: "anthropic.claude-haiku-5-5", inputPrice: "0.10", outputPrice: "0.50" },
  { key: "sonnet", name: "Sonnet 5.5", cssColor: "var(--sonnet)", defaultEffort: "high" as EffortLevel, bedrockId: "anthropic.claude-sonnet-5-5", inputPrice: "2", outputPrice: "10" },
  { key: "opus", name: "Opus 5.5", cssColor: "var(--opus)", defaultEffort: "medium" as EffortLevel, bedrockId: "anthropic.claude-opus-5-5", inputPrice: "4", outputPrice: "20" },
] as const;

export const VERIFIED_DATE = "16 October 2026";
