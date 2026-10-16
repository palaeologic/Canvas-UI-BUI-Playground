import { useEffect, useState } from "react";
import { ROLES, ROLE_ALIASES, type RoleKey } from "../data/roles";
import { RoleFinder } from "./RoleFinder";
import { Eyebrow, NextLink } from "./Chapters";
import { RoleTabs } from "./roles/RoleTabs";

const STORAGE_KEY = "pyc-role";

const resolve = (k: string | null | undefined): RoleKey | undefined => {
  const key = k ? (ROLE_ALIASES[k] ?? k) : undefined;
  return ROLES.some((r) => r.key === key) ? (key as RoleKey) : undefined;
};

function initialRole(): RoleKey {
  const fromHash = resolve(typeof location !== "undefined" ? location.hash.slice(1) : "");
  if (fromHash) return fromHash;
  try {
    const saved = resolve(localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
  } catch { /* storage unavailable */ }
  return "lead";
}

export function Roles() {
  const [active, setActive] = useState<RoleKey>(initialRole);
  const [focusRequest, setFocusRequest] = useState(0);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, active); } catch { /* storage unavailable */ }
  }, [active]);

  return (
    <section id="roles">
      <div className="sec-head" data-reveal>
        <Eyebrow id="roles">Examples by role</Eyebrow>
        <h2>What this looks like in your work</h2>
        <p className="sub">Search your title or team, or browse all work groups. Every example shows the three picker answers behind its setting, so you can learn the reasoning and reuse it on your own tasks.</p>
      </div>
      <div data-reveal>
        <RoleFinder onPick={(key) => {
          // Finder selection is intentionally routed through the same controlled tab state.
          // Base UI owns tab semantics; Roles owns which work group the product selected.
          setActive(key);
          setFocusRequest((n) => n + 1);
        }} />
      </div>
      <RoleTabs active={active} onChange={setActive} focusRequest={focusRequest} />
      <NextLink from="roles" />
    </section>
  );
}
