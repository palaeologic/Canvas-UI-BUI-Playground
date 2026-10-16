import type { Answers } from "../../data/picker";
import { recommend } from "../../data/picker";
import type { PresetKey } from "../../data/presets";

export const PICKER_EXAMPLES: { label: string; a: Answers }[] = [
  { label: "Fix an Excel formula", a: { time: 0, check: 0, stakes: 0 } },
  { label: "Summarise a paper", a: { time: 1, check: 1, stakes: 0 } },
  { label: "Choose a statistics method", a: { time: 1, check: 2, stakes: 1 } },
  { label: "Review a contract", a: { time: 1, check: 2, stakes: 2 } },
];

const same = (x: Answers, y: Answers) => x.time === y.time && x.check === y.check && x.stakes === y.stakes;

export function PickerExamples({ answers, onSelect, colorOf }: { answers: Answers; onSelect: (answers: Answers) => void; colorOf: (preset: PresetKey) => string }) {
  return (
    <div className="examples" role="group" aria-label="Examples" data-reveal>
      <span className="examples-k">Try:</span>
      {PICKER_EXAMPLES.map((ex) => {
        const k = recommend(ex.a).preset;
        return (
          <button
            key={ex.label}
            type="button"
            className="chip"
            aria-pressed={same(ex.a, answers)}
            style={{ ["--c" as string]: colorOf(k) }}
            onClick={() => onSelect(ex.a)}
          >
            {ex.label}
          </button>
        );
      })}
    </div>
  );
}
