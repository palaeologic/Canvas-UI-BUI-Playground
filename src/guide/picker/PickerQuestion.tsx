import { PickerRadioGroup } from "../../components/ui/PickerRadioGroup";
import type { Answers, Level, Question } from "../../data/picker";
import type { PresetKey } from "../../data/presets";

export function PickerQuestion({
  question,
  index,
  answers,
  onChange,
  colorOf,
}: {
  question: Question;
  index: number;
  answers: Answers;
  onChange: (level: Level) => void;
  colorOf: (preset: PresetKey) => string;
}) {
  const labelId = `picker-${question.dim}-label`;
  return (
    <fieldset>
      <legend id={labelId}><span className="q-n">{index + 1}</span>{question.legend}</legend>
      <PickerRadioGroup
        name={question.dim}
        labelId={labelId}
        value={String(answers[question.dim])}
        options={question.options.map((label, i) => ({
          value: String(i),
          label,
          color: colorOf(question.map[i]!),
        }))}
        onValueChange={(value) => onChange(Number(value) as Level)}
      />
    </fieldset>
  );
}
