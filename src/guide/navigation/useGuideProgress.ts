import { useEffect, useState } from "react";
import { CHAPTERS, type ChapterId } from "../Chapters";

const VISITED_KEY = "pyc-visited";

function loadVisited(): Set<ChapterId> {
  try {
    const raw = JSON.parse(localStorage.getItem(VISITED_KEY) ?? "[]");
    return new Set(Array.isArray(raw) ? raw.filter((x) => CHAPTERS.some((c) => c.id === x)) : []);
  } catch {
    return new Set();
  }
}

/**
 * Scroll-spy state stays separate from the navigation markup. CHAPTERS is the single
 * registry for section IDs, so desktop/mobile navigation cannot drift into dead links.
 */
export function useGuideProgress() {
  const [active, setActive] = useState<ChapterId | null>(null);
  const [visited, setVisited] = useState<Set<ChapterId>>(loadVisited);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      doc.style.setProperty("--read", p.toFixed(4));
      setScrolled(window.scrollY > 8);

      const line = window.innerHeight * 0.35;
      let current: ChapterId | null = null;
      for (const c of CHAPTERS) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= line) current = c.id;
      }
      if (max > 0 && window.scrollY >= max - 4) current = CHAPTERS[CHAPTERS.length - 1]!.id;
      setActive(current);
      if (current) {
        setVisited((v) => {
          if (v.has(current)) return v;
          const next = new Set(v).add(current);
          try { localStorage.setItem(VISITED_KEY, JSON.stringify([...next])); } catch { /* storage unavailable */ }
          return next;
        });
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { active, visited, scrolled, isComplete: visited.size === CHAPTERS.length };
}
