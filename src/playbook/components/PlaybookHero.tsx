import { EFFORT_LEVELS, MODEL_DEFAULTS } from "../data/model-defaults";

export function PlaybookHero() {
  return (
    <header className="hero">
      <div className="stack">
        <a className="hero-back" href="/">← Staff guide</a>
        <div className="scope-meta" aria-label="Playbook scope">
          <span>Platform guide</span>
          <span>For developers, platform &amp; IT admins</span>
          <span>Amazon Bedrock</span>
        </div>
        <h1>Model &amp; Effort Playbook</h1>
        <p className="thesis">The model is the <em className="r">reagent</em>: it decides what can bind. Effort is the <em className="d">dose</em>: it decides how hard the reaction runs.</p>
        <p className="lede">Choose the model for the capability the task needs. Choose effort for how much planning, reading and checking that model should do.</p>
      </div>
      <figure className="plate" aria-label="Three models across five effort levels, with each model's API default marked">
        <div className="plate-cols"><span />{EFFORT_LEVELS.map((level) => <span key={level}>{level === "medium" ? "med" : level}</span>)}</div>
        {MODEL_DEFAULTS.map((model) => (
          <div className="plate-row" key={model.key}>
            <span className="lab">{model.name}</span>
            {EFFORT_LEVELS.map((level, index) => {
              const isDefault = model.defaultEffort === level;
              const pct = 18 + index * 18;
              return <span key={level} className="well f" aria-label={`${model.name} ${level}${isDefault ? ", API default" : ""}`} title={`${model.name} · ${level}${isDefault ? " (API default)" : ""}`} style={{ background: `color-mix(in srgb, ${model.cssColor} ${pct}%, var(--surface))`, boxShadow: isDefault ? "0 0 0 2px var(--surface), 0 0 0 4px var(--ink)" : undefined }} />;
            })}
          </div>
        ))}
        <figcaption className="plate-cap">Every model offers all five levels. The ringed well is each model&apos;s API default. Shading deepens with spend.</figcaption>
        <a className="hero-shortcut" href="#defaults">See defaults &amp; prices →</a>
      </figure>
    </header>
  );
}
