import type { RefObject } from "react";
import type { Recommendation } from "../../data/picker";
import { PRESET_ORDER, PRESETS, presetConfig, type PresetKey } from "../../data/presets";

export function PickerResult({
  recommendation,
  color,
  level,
  colorOf,
  resultRef,
}: {
  recommendation: Recommendation;
  color: string;
  level: number;
  colorOf: (preset: PresetKey) => string;
  resultRef: RefObject<HTMLDivElement | null>;
}) {
  const preset = PRESETS[recommendation.preset];
  return (
    <div id="pick-result" ref={resultRef} className="result" style={{ ["--c" as string]: color }} aria-live="polite">
      <span className="eyebrow">Recommended starting setting</span>
      <div className="swap-wrap"><span key={recommendation.preset} className="big swap">{preset.name}</span></div>
      <span className="cfg">{presetConfig(preset)}</span>
      <div className="meter" style={{ ["--lv" as string]: level }} aria-hidden="true">
        <div className="meter-track"><span className="meter-fill" /><span className="meter-thumb" /></div>
        <div className="meter-labels">
          {PRESET_ORDER.map((k, i) => (
            <span key={k} className={i === level ? "on" : i < level ? "past" : undefined} style={{ ["--c" as string]: colorOf(k) }}>{PRESETS[k].name}</span>
          ))}
        </div>
      </div>
      <p key={`why-${recommendation.preset}`} className="swap-soft">{preset.why}</p>
      <div className="why">
        {recommendation.reasons.map((r) => {
          const deciding = r.suggests === recommendation.preset && recommendation.preset !== "quick";
          return (
            <div className={`why-row${deciding ? " deciding" : ""}`} key={r.dim}>
              <span>{r.label}: {r.answer}</span>
              <b style={{ color: colorOf(r.suggests) }}>{deciding && <span className="deciding-k">deciding</span>}{PRESETS[r.suggests].name}</b>
            </div>
          );
        })}
      </div>
      <p className="sub small">Each answer suggests a setting. The highest one wins. You can move one step up or down after seeing the first answer; if it falls short, follow the four rules above.</p>
    </div>
  );
}
