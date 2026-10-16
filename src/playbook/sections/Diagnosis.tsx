import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclosure } from "../components/Disclosure";

const SYMPTOMS = [
  { symptom: "It skipped a file, a source or a test, or stopped halfway through", dial: "Effort ↑", text: "If the context was complete, raise effort one level and rerun. This matters most if you had set it below the default." },
  { symptom: "It tried hard, had the right context, and was still confidently wrong", dial: "Model ↑", text: "The task may need a more capable model. Move up a model and restart effort at that model's default, not at the level you were on." },
  { symptom: "It took ages, burned tokens and did work nobody asked for", dial: "Effort ↓", text: "It may be working harder than the task needs. Drop one level and compare quality." },
  { symptom: "It's on the top model at high effort and still fails", dial: "Context", text: "Check the prompt scope, the data you supplied and the tools it can reach. If those are solid, split the task, or try xhigh for long agentic work before considering max." },
  { symptom: "Routine work has gone fine on the big model for weeks", dial: "Model ↓", text: "Drop to a smaller model for routine stretches. It is faster and usually cheaper at the same quality." },
  { symptom: "A new model version just shipped", dial: "Re-sweep", text: "Rerun your standard tasks on the new model, starting at its default and then one level lower. Keep the cheapest level that holds quality." },
] as const;

export function Diagnosis() {
  const [selected, setSelected] = useState(0);
  const result = SYMPTOMS[selected];
  return <section id="which">
    <SectionHeader id="which" eyebrow="04 · Diagnosis" title="Which dial to turn: effort or model?" intro="Context → Effort → Model. First check the task, files and tools. If that context is good, pick the symptom you saw." />
    <div className="bench"><div className="symptoms" role="group" aria-label="Symptoms">{SYMPTOMS.map((item, i) => <button type="button" className="symptom" aria-pressed={i === selected} onClick={() => setSelected(i)} key={item.symptom}>{item.symptom}</button>)}</div><div className="verdict" aria-live="polite"><span className="dial">{result.dial}</span><p>{result.text}</p></div></div>
    <Disclosure summary="Advanced: when you change models"><div className="prose stack"><h3>Start again at the default</h3><p>Level names are the same on every model, but the same level is not the same amount of work. Say you max out Haiku, it still misses, and you move to Sonnet. Don&apos;t carry <code>max</code> across. Restart at Sonnet&apos;s default, because the stronger model may finish at lower effort. When a new model version ships, re-run your standard tasks on it at a lower level. You will often get the same quality for less.</p></div></Disclosure>
  </section>;
}
