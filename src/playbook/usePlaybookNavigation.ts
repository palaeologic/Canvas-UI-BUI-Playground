import { useEffect, useMemo, useState } from "react";
import { PLAYBOOK_NAV, normalizePlaybookFragment, type PlaybookSectionId } from "./playbook-nav";

const SECTION_IDS = PLAYBOOK_NAV.flatMap((group) => group.items.map((item) => item.id));

export function usePlaybookNavigation(): { activeSection: PlaybookSectionId; activeGroup: string } {
  const [activeSection, setActiveSection] = useState<PlaybookSectionId>("dials");
  useEffect(() => {
    const normalized = normalizePlaybookFragment(location.hash);
    let raf = 0;
    const spy = () => {
      raf = 0;
      const line = innerHeight * 0.3;
      let hit: PlaybookSectionId | null = null;
      for (const id of SECTION_IDS) { const element = document.getElementById(id); if (element && element.getBoundingClientRect().top <= line) hit = id; }
      if (!hit) return;
      setActiveSection((current) => { if (current === hit) return current; history.replaceState(history.state, "", `${location.pathname}${location.search}#${hit}`); return hit!; });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(spy); };
    addEventListener("scroll", schedule, { passive: true }); addEventListener("resize", schedule);
    if (normalized) {
      if (location.hash.slice(1) !== normalized) history.replaceState(history.state, "", `${location.pathname}${location.search}#${normalized}`);
      setActiveSection(normalized);
      raf = requestAnimationFrame(() => { raf = 0; document.getElementById(normalized)?.scrollIntoView({ block: "start" }); requestAnimationFrame(spy); });
    } else spy();
    return () => { removeEventListener("scroll", schedule); removeEventListener("resize", schedule); if (raf) cancelAnimationFrame(raf); };
  }, []);
  const activeGroup = useMemo(() => PLAYBOOK_NAV.find((group) => group.items.some((item) => item.id === activeSection))?.label ?? PLAYBOOK_NAV[0].label, [activeSection]);
  return { activeSection, activeGroup };
}
