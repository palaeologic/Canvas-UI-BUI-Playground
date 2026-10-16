import { MODELS } from "../data/models";
import { PRESET_ORDER, PRESETS, presetConfig, type PresetKey } from "../data/presets";
import { Eyebrow, NextLink } from "./Chapters";
import { Wells } from "./EffortWells";
import { Disclosure } from "../components/ui/Disclosure";

const EFFORT_WELLS = { low: 1, medium: 2, high: 3, xhigh: 3, max: 3 } as const;

/** What changes from the setting before it: makes "each step turns one dial" visible. */
const STEP: Record<PresetKey, { tag: string; kind: "start" | "model" | "time" }> = {
  quick: { tag: "Small jobs", kind: "start" },
  standard: { tag: "Start here", kind: "start" },
  expert: { tag: "+ stronger model", kind: "model" },
  thorough: { tag: "+ more time", kind: "time" },
};

export function Settings() {
  return (
    <section id="settings">
      <div className="sec-head" data-reveal>
        <Eyebrow id="settings">The four settings</Eyebrow>
        <h2>Your chat assistant bundles both choices into four settings</h2>
        <p className="sub">Your app may label these differently. Each step up either brings in a stronger model or gives the strongest model more time.</p>
      </div>
      <div className="presets" data-reveal data-stagger>
        {PRESET_ORDER.map((k) => {
          const p = PRESETS[k];
          const step = STEP[k];
          return (
            <div className={`preset${k === "standard" ? " is-default" : ""}`} key={k} style={{ ["--c" as string]: MODELS[p.model].color }}>
              <span className={`step step-${step.kind}`}>{step.tag}</span>
              <h3>{p.name}</h3>
              <span className="cfg">
                <Wells on={EFFORT_WELLS[p.effort]} color={MODELS[p.model].color} />
                {presetConfig(p)}
              </span>
              <p className="like">{p.like}</p>
              <ul className="preset-example-first"><li>{p.examples[0]}</li></ul>
              {p.examples.length > 1 && (
                <Disclosure className="preset-more" label="More examples">
                  <ul>{p.examples.slice(1).map((e) => <li key={e}>{e}</li>)}</ul>
                </Disclosure>
              )}
              <span className="speed">{p.speed}</span>
            </div>
          );
        })}
      </div>
      <NextLink from="settings" />
    </section>
  );
}

const RULES = [
  ["Start with Standard", "It handles most work. Move only when you have a reason to."],
  ["Check context, then give it more time", "First make sure Claude has the right files and a clear instruction. If it had everything it needed but skipped a sheet, source or step, step up one setting."],
  ["Still wrong with complete context? Try a stronger model", "If Claude had the right information and instructions but its reasoning or judgement is still poor, move to a stronger model."],
  ["Simple task, slow answer? Step down", "If Quick does the job, keep using it. Thorough on everything wastes time and budget."],
] as const;

export function Rules() {
  return (
    <section id="rules">
      <div className="sec-head" data-reveal>
        <Eyebrow id="rules">Four rules</Eyebrow>
        <h2>Everything you need to remember</h2>
      </div>
      <div className="rules" data-reveal data-stagger>
        {RULES.map(([h, t], i) => (
          <div className="rule" key={h}><span className="rule-n">{i + 1}</span><h3>{h}</h3><p>{t}</p></div>
        ))}
      </div>
      <NextLink from="rules" />
    </section>
  );
}
