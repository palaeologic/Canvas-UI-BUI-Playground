import { useEffect, useState } from "react";
import { MODELS } from "../../data/models";
import { SETTINGS, toAnswers, type RoleCard } from "../../data/roles";
import { tryInPicker } from "../../data/tryInPicker";
import { WhyLine } from "../WhyLine";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* fall through */ }
  const ta = document.createElement("textarea");
  ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; }
  ta.remove();
  return ok;
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 1600);
    return () => window.clearTimeout(t);
  }, [state]);
  return (
    <button type="button" className={`copy-btn is-${state}`} onClick={async () => setState((await copyText(text)) ? "done" : "fail")}>
      <span className="copy-ico" aria-hidden="true">
        <svg className="i-copy" viewBox="0 0 24 24" width="14" height="14"><rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
        <svg className="i-done" viewBox="0 0 24 24" width="14" height="14"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <span aria-live="polite">{state === "done" ? "Copied" : state === "fail" ? "Select and copy" : "Copy prompt"}</span>
    </button>
  );
}

export function RoleExampleCard({ card }: { card: RoleCard }) {
  const setting = SETTINGS[card.setting];
  return (
    <article className="card" style={{ ["--c" as string]: MODELS[setting.model].color }}>
      <div className="card-top">
        <span className="who">{card.area}{card.bio ? <> · <span className="bio">may trip bio filter</span></> : null}</span>
        <span className="setting">{setting.label}</span>
      </div>
      <p className="prompt">"{card.prompt}"</p>
      <p className="tip"><b>Tip:</b> {card.tip}</p>
      <WhyLine card={card} />
      <div className="card-foot">
        {card.answers && <button type="button" className="try-btn" onClick={() => tryInPicker(toAnswers(card.answers!))}>Try in the picker</button>}
        <CopyButton text={card.prompt} />
      </div>
    </article>
  );
}
