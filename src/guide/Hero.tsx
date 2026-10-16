import { MODELS, type ModelKey } from "../data/models";
import { CHAPTERS } from "./Chapters";
import { Wells, type EffortTone } from "./EffortWells";

const EFFORT_RUNGS: { name: string; on: number; tone: EffortTone; text: string }[] = [
  { name: "Low", on: 1, tone: "low", text: "A quick look. Answers fast and doesn't double-check." },
  { name: "Medium", on: 2, tone: "medium", text: "A focused session. The sensible default." },
  { name: "High", on: 3, tone: "high", text: "A careful review. Reads everything and checks its own work." },
];

export function Hero() {
  return (
    <header className="hero" id="basics" data-reveal data-stagger>
      <span className="eyebrow"><span className="ch-no">01</span> A plain-language guide for everyone at the company</span>
      <h1>Which Claude, and how hard?</h1>
      <p className="lede">
        Every request to Claude involves two choices. You don't need to understand the technology—just answer the two questions below.
      </p>
      <div className="cta-row">
        <a className="btn btn-primary" href="#picker">
          Choose a setting
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
        <a className="btn btn-ghost" href="#settings">Learn how it works</a>
        <span className="meta">{CHAPTERS.length} short chapters · about 5 minutes</span>
      </div>
      <div className="two-q">
        <div className="q">
          <span className="num">1. Who do you ask? <span className="num-sub">The model</span></span>
          <div className="ladder">
            {(Object.keys(MODELS) as ModelKey[]).map((k) => (
              <div className="rung" key={k} style={{ ["--c" as string]: MODELS[k].color }}>
                <b><span className="dot" style={{ background: MODELS[k].color }} />{MODELS[k].name.split(" ")[0]}</b>
                <span><strong className="model-strength">{MODELS[k].strength}.</strong> {MODELS[k].persona}</span>
              </div>
            ))}
          </div>
          <p className="sub small">A stronger model raises the capability ceiling. Giving a weaker one more time does not raise that ceiling.</p>
        </div>
        <div className="q effort-card">
          <span className="num">2. How long do you give them? <span className="num-sub">The effort</span></span>
          <div className="ladder">
            {EFFORT_RUNGS.map((r) => (
              <div className={`rung effort-row effort-${r.tone}`} key={r.name} style={{ ["--c" as string]: `var(--effort-${r.tone})` }}>
                <b><Wells on={r.on} tone={r.tone} /> {r.name}</b>
                <span>{r.text}</span>
              </div>
            ))}
          </div>
          <p className="sub small">More time means more thorough answers, but they arrive slower and cost more. It doesn't make Claude smarter.</p>
        </div>
      </div>
      <p className="default-note"><b>Most people should start with <a href="#settings">Standard</a>.</b> Move up or down only when the task gives you a reason.</p>
    </header>
  );
}
