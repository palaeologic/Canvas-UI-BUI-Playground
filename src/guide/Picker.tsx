import { useEffect, useRef, useState } from "react";
import { MODELS } from "../data/models";
import { PRESET_ORDER, PRESETS, presetConfig, type PresetKey } from "../data/presets";
import { QUESTIONS, recommend, type Answers } from "../data/picker";
import { Eyebrow, NextLink } from "./Chapters";
import { useTryInPicker } from "../data/tryInPicker";
import { PickerExamples } from "./picker/PickerExamples";
import { PickerQuestion } from "./picker/PickerQuestion";
import { PickerResult } from "./picker/PickerResult";

const START: Answers = { time: 0, check: 0, stakes: 0 };
const same = (x: Answers, y: Answers) => x.time === y.time && x.check === y.check && x.stakes === y.stakes;
const colorOf = (k: PresetKey) => MODELS[PRESETS[k].model].color;

export function Picker() {
  const [answers, setAnswers] = useState<Answers>(START);
  useTryInPicker(setAnswers);
  // Keep recommendation logic independent of the UI layer: Base UI only changes
  // how answers are selected, while recommend() remains the single source of truth.
  const rec = recommend(answers);
  const preset = PRESETS[rec.preset];
  const color = colorOf(rec.preset);
  const level = PRESET_ORDER.indexOf(rec.preset);
  const resultRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = resultRef.current;
    if (!el) return;
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  }, [answers]);

  return (
    <section id="picker">
      <div className="sec-head" data-reveal>
        <Eyebrow id="picker">Try it</Eyebrow>
        <h2>Find the right setting for your task</h2>
        <p className="sub">Answer three questions about a real task, or start from an example.</p>
      </div>
      <PickerExamples answers={answers} onSelect={setAnswers} colorOf={colorOf} />
      <div data-reveal>
        <div className="bench">
          <form className="qs" onSubmit={(e) => e.preventDefault()}>
            {QUESTIONS.map((q, qi) => (
              <PickerQuestion
                key={q.dim}
                question={q}
                index={qi}
                answers={answers}
                colorOf={colorOf}
                onChange={(level) => setAnswers((a) => ({ ...a, [q.dim]: level }))}
              />
            ))}
            <div className="qs-foot">
              <button type="button" className="link-btn" onClick={() => setAnswers(START)} disabled={same(answers, START)}>Start over</button>
            </div>
            <a className="mini-result" href="#pick-result" style={{ ["--c" as string]: color }} aria-hidden="true" tabIndex={-1}>
              <span className="mini-k">Recommended start</span>
              <b key={rec.preset} className="swap">{preset.name}</b>
              <span className="mini-cfg">{presetConfig(preset)}</span>
              <span className="mini-go">Why ↓</span>
            </a>
          </form>
          <PickerResult recommendation={rec} color={color} level={level} colorOf={colorOf} resultRef={resultRef} />
        </div>
      </div>
      <NextLink from="picker" />
    </section>
  );
}
