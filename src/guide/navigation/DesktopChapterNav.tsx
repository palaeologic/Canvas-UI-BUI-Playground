import { useLayoutEffect, useRef } from "react";
import { CHAPTERS, type ChapterId } from "../Chapters";

const ACTION_CHAPTERS = new Set<ChapterId>(["picker", "roles", "signs"]);

const Check = () => (
  <svg className="tick" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function DesktopChapterNav({ active, visited, isComplete }: { active: ChapterId | null; visited: Set<ChapterId>; isComplete: boolean }) {
  const navRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const place = () => {
      const a = nav.querySelector<HTMLElement>('a[aria-current="location"]');
      nav.style.setProperty("--ind-x", `${a ? a.offsetLeft : 0}px`);
      nav.style.setProperty("--ind-w", `${a ? a.offsetWidth : 0}px`);
      nav.dataset.ind = a ? "on" : "off";
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <nav ref={navRef} className={`chapters${isComplete ? " is-complete" : ""}`} aria-label="Chapters">
      <span className="ind" aria-hidden="true" />
      {CHAPTERS.map((c, i) => {
        const showSeen = !isComplete && visited.has(c.id) && c.id !== active;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            aria-current={c.id === active ? "location" : undefined}
            className={`${showSeen ? "seen " : ""}${ACTION_CHAPTERS.has(c.id) ? "is-action" : ""}`.trim() || undefined}
            title={c.title}
          >
            <span className="n">{showSeen ? <Check /> : i + 1}</span>
            {c.short}
          </a>
        );
      })}
    </nav>
  );
}
