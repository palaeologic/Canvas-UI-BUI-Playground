import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { EFFORT_LEVELS, MODEL_DEFAULTS } from "../data/model-defaults";
import { ROUTING_GROUPS, ROUTING_ROWS, type RoutingGroupKey } from "../data/routing-matrix";
import { SectionHeader } from "../components/SectionHeader";

function presetName(model: string, effortIndex: number) {
  if (model === "haiku" && effortIndex === 0) return "Quick";
  if (model === "sonnet" && effortIndex === 1) return "Standard";
  if (model === "opus" && effortIndex === 1) return "Expert";
  if (model === "opus" && effortIndex === 2) return "Thorough";
  return null;
}

export function RoutingMatrix() {
  const [group, setGroup] = useState<RoutingGroupKey>(() => {
    if (typeof window === "undefined") return "all";
    try { const saved = localStorage.getItem("mep-group") as RoutingGroupKey | null; return saved && saved in ROUTING_GROUPS ? saved : "all"; } catch { return "all"; }
  });
  const [query, setQuery] = useState("");
  useEffect(() => { try { localStorage.setItem("mep-group", group); } catch {} }, [group]);
  const rows = useMemo(() => ROUTING_ROWS.filter((row) => {
    if (group !== "all" && !row.groups.includes(group)) return false;
    const haystack = `${row.task} ${row.example} ${row.why}`.toLowerCase();
    return !query || haystack.includes(query.toLowerCase());
  }), [group, query]);

  return <section id="matrix" className="reference-breakout">
    <SectionHeader id="matrix" eyebrow="06 · Routing" title="Routing matrix: task → model → starting effort" intro="These are starting points, not rules. Each row names the setting to try first and the escalation if it falls short." />
    <div className="filters" role="group" aria-label="Filter routing matrix by work group">
      {(Object.entries(ROUTING_GROUPS) as [RoutingGroupKey, string][]).map(([key, label]) => <button type="button" className="chip" key={key} aria-pressed={group === key} onClick={() => setGroup(key)}>{label}</button>)}
      <input className="search" type="search" aria-label="Search routing tasks" placeholder="Search tasks…" value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} />
    </div>
    <div className="tablewrap"><table className="matrix-table"><thead><tr><th scope="col">Task</th><th scope="col">Start with</th><th scope="col">Effort</th><th scope="col">Why, and escalation</th></tr></thead><tbody>{rows.map((row) => { const model = MODEL_DEFAULTS.find((item) => item.key === row.model)!; const preset = presetName(row.model, row.effortIndex); return <tr key={row.id}><td data-label="Task"><strong>{row.task}</strong>{row.bio ? <span className="bio"> · Bio</span> : null}<small>{row.example}</small></td><td data-label="Start with"><span className="dot" style={{ background: model.cssColor }} />{model.name}<br/><span className="surface-badge">{row.surface === "chat" ? (preset ? `Chat · ${preset} preset` : "Chat") : "OpenChamber"}</span></td><td data-label="Effort"><span className="tag">{EFFORT_LEVELS[row.effortIndex]}</span></td><td data-label="Why, and escalation" className="mwhy">{row.why}<br/><b>Escalate:</b> {row.escalation}</td></tr>; })}</tbody></table>{rows.length === 0 ? <div className="empty">No tasks match. Clear the search or choose another group.</div> : null}</div>
  </section>;
}
