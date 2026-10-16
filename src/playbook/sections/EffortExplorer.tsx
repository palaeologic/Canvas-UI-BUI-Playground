import { useState } from "react";
import { EFFORT_LEVELS, MODEL_DEFAULTS } from "../data/model-defaults";
import { SectionHeader } from "../components/SectionHeader";

const EFFORT_COPY = [
  { does: "Fewest tool calls, terse replies, and goes straight to action. It still thinks on genuinely hard problems, just less.", use: "Formula fixes, reformatting, quick lookups, classification, helper subagents.", risk: "On multi-step work it may skip a check or stop early." },
  { does: "Balanced spend. Scopes its work to what you asked.", use: "Day-to-day work with a clear scope: a feature with a spec, a deck outline, a paper summary.", risk: "Can be shallow on genuinely ambiguous problems." },
  { does: "Spends what the task needs. More reading, more verification, plans before acting.", use: "Bug fixes in existing code, multi-source analysis, contract review, anything hard to check yourself.", risk: "Overspends on simple asks and may add steps nobody requested." },
  { does: "Extended capability for long-horizon work. Expect meaningfully more tokens.", use: "Agentic coding and pipeline builds that run 30+ minutes with large token budgets.", risk: "Expensive for interactive chat. Needs a large max_tokens." },
  { does: "No constraint on spend. The deepest reasoning available.", use: "Frontier problems you want worked through unattended, such as hunting a subtle security flaw.", risk: "Diminishing returns and prone to overthinking. Test before adopting, and keep it out of everyday presets." },
] as const;
const WORK = [12, 26, 48, 74, 100];
const ROLES = {
  haiku: "Fast and very cheap. Best with precise instructions. Use it for lookups, extraction, triage and helper subagents.",
  sonnet: "Strong generalist. Give it the whole afternoon and it reads everything and checks its work. The everyday workhorse.",
  opus: "The expert. Brings pattern recognition from deep experience. Handles ambiguity, unfamiliar domains and high-stakes judgement.",
} as const;

export function EffortExplorer() {
  const [modelKey, setModelKey] = useState<keyof typeof ROLES>("sonnet");
  const model = MODEL_DEFAULTS.find((m) => m.key === modelKey)!;
  const defaultIndex = EFFORT_LEVELS.indexOf(model.defaultEffort);
  const [effortIndex, setEffortIndex] = useState(defaultIndex);
  const effort = EFFORT_COPY[effortIndex];
  const relative = effortIndex === defaultIndex ? "This is the model's API default, the right place to start." : effortIndex < defaultIndex ? "Below default: try it only after the task already works at the default." : "Above default: use it when the task is long or hard to check yourself.";

  return <section id="explorer">
    <SectionHeader id="explorer" eyebrow="02 · Interactive" title="Effort explorer" intro="Pick a model and a level to see what changes. The bars show relative work on the same task." />
    <span className="illustrative-badge">Illustrative, not benchmark data</span>
    <div className="bench">
      <div className="controls">
        <div className="ctl"><span>Model</span><div className="seg" role="group" aria-label="Model">{MODEL_DEFAULTS.map((m) => <button type="button" key={m.key} aria-pressed={m.key === modelKey} onClick={() => { setModelKey(m.key); setEffortIndex(EFFORT_LEVELS.indexOf(m.defaultEffort)); }}><span className="dot" style={{ background: m.cssColor }} />{m.name}</button>)}</div></div>
        <div className="ctl"><span>Effort</span><div className="seg" role="group" aria-label="Effort">{EFFORT_LEVELS.map((level, i) => <button type="button" key={level} aria-pressed={i === effortIndex} onClick={() => setEffortIndex(i)}>{level}{i === defaultIndex ? " · default" : ""}</button>)}</div></div>
      </div>
      <div className="explorer-out">
        <dl className="dl"><dt>Model brings</dt><dd>{ROLES[modelKey]}</dd><dt>At {EFFORT_LEVELS[effortIndex]}, Claude</dt><dd>{effort.does}</dd><dt>Good for</dt><dd>{effort.use}</dd><dt>Watch for</dt><dd>{effort.risk}</dd><dt>Relative to default</dt><dd>{relative}</dd></dl>
        <div className="workbar" aria-label="Illustrative relative work by effort level"><span className="eyebrow">Same task, work done (illustrative)</span>{EFFORT_LEVELS.map((level, i) => <div className={`wb-row${i === effortIndex ? " on" : ""}`} key={level}><span>{level}</span><div className="wb-track"><div className="wb-fill" style={{ width: `${WORK[i]}%`, background: i === effortIndex ? model.cssColor : `color-mix(in srgb, ${model.cssColor} 30%, var(--sunken))` }} /></div></div>)}<p className="note">Higher levels set how far Claude may go. On a simple task it still stops early, so real gaps are often smaller.</p></div>
      </div>
    </div>
  </section>;
}
