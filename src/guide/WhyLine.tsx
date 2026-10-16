import { QUESTIONS } from "../data/picker";
import { SETTINGS, type RoleCard } from "../data/roles";

/** The three picker answers behind an example's setting. OpenChamber examples say who picks instead. */
export function WhyLine({ card }: { card: RoleCard }) {
  if (!card.answers) {
    return (
      <div className="whyline">
        <span className="whylabel">OpenChamber</span>
        <span className="why-chip">you pick model and thinking level</span>
      </div>
    );
  }
  const answers = card.answers;
  return (
    <div className="whyline">
      <span className="whylabel">Why {SETTINGS[card.setting].label}</span>
      {QUESTIONS.map((q, i) => (
        <span key={q.dim} className={`why-chip lvl${answers[i]}`} title={q.label}>{q.short[answers[i]!]}</span>
      ))}
    </div>
  );
}
