import { useId, useState } from "react";
import { findRoles } from "../data/finder";
import { ROLES, type RoleKey } from "../data/roles";

const LABEL = Object.fromEntries(ROLES.map((r) => [r.key, r.label])) as Record<RoleKey, string>;

/** "Find your tab": type a job title or team, get the tab (and any second tab) to open. */
export function RoleFinder({ onPick }: { onPick: (key: RoleKey) => void }) {
  const [q, setQ] = useState("");
  const id = useId();
  const hits = findRoles(q);
  return (
    <div className="finder">
      <label htmlFor={id}>Find your tab</label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Your job title or team, e.g. Process Technician or Antigen Core"
        autoComplete="off"
        spellCheck={false}
      />
      {q.trim() && (
        <div className="hits" aria-live="polite">
          {hits.length === 0 ? (
            <p className="nohit">No match yet. Pick the tab closest to your daily work. The four settings work the same everywhere.</p>
          ) : (
            hits.map((h) => (
              <div className="hit" key={h.name}>
                <span className="hitname">{h.name} <small>{h.kind}</small></span>
                {h.keys.map((k, i) => (
                  <button key={k} type="button" className={`goto${i ? " also" : ""}`} onClick={() => onPick(k)}>
                    {i ? "Also: " : ""}{LABEL[k]}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
