export type ModelKey = "haiku" | "sonnet" | "opus";
export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

export interface ModelInfo {
  key: ModelKey;
  name: string;
  bedrockId: string;
  /** CSS custom property holding the model colour. */
  color: string;
  /** The capability characteristic to scan first in the staff guide. */
  strength: string;
  /** Plain-language biotech analogy for non-technical staff. */
  persona: string;
}

export const MODELS: Record<ModelKey, ModelInfo> = {
  haiku: {
    key: "haiku",
    name: "Haiku 5.5",
    bedrockId: "anthropic.claude-haiku-5-5",
    color: "var(--haiku)",
    strength: "Fast and direct",
    persona: "Like a lab technician handling a clear routine task.",
  },
  sonnet: {
    key: "sonnet",
    name: "Sonnet 5.5",
    bedrockId: "anthropic.claude-sonnet-5-5",
    color: "var(--sonnet)",
    strength: "Versatile and dependable",
    persona: "Like an experienced research associate handling everyday work.",
  },
  opus: {
    key: "opus",
    name: "Opus 5.5",
    bedrockId: "anthropic.claude-opus-5-5",
    color: "var(--opus)",
    strength: "Best for ambiguity and difficult judgement",
    persona: "Like a senior scientist working through a complex problem.",
  },
};
