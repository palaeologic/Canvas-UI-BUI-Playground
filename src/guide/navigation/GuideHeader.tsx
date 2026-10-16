import { useEffect, useRef, useState } from "react";
import { CHAPTERS } from "../Chapters";
import { ThemeToggle } from "../ThemeToggle";
import { BrandMark } from "./BrandMark";
import { DesktopChapterNav } from "./DesktopChapterNav";
import { MobileChapterMenu } from "./MobileChapterMenu";
import { useGuideProgress } from "./useGuideProgress";

export function GuideHeader() {
  const { active, visited, scrolled, isComplete } = useGuideProgress();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const idx = active ? CHAPTERS.findIndex((c) => c.id === active) : -1;
  const current = idx >= 0 ? CHAPTERS[idx] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); } };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    menuRef.current?.querySelector<HTMLElement>('[aria-current="location"], a')?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={`topbar${scrolled ? " is-scrolled" : ""}`}>
        <div className="topbar-in">
          <a className="brand" href="#top" aria-label="Pick Your Claude, back to top">
            <BrandMark />
            <span>Pick Your Claude</span>
          </a>
          <DesktopChapterNav active={active} visited={visited} isComplete={isComplete} />
          <div className="topbar-end">
            <a className="pill-link" href="/playbook" title="Model & Effort Playbook, for developers and admins">Playbook</a>
            <ThemeToggle />
            <button
              ref={btnRef}
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls="chapter-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="menu-cur">
                {current ? <><b>{idx + 1}/{CHAPTERS.length}</b> {current.short}</> : "Contents"}
              </span>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
        <div className="readbar" aria-hidden="true"><span /></div>
        <div ref={menuRef} id="chapter-menu" className={`chapter-menu${open ? " is-open" : ""}`} hidden={!open}>
          <MobileChapterMenu active={active} visited={visited} isComplete={isComplete} onChoose={() => setOpen(false)} />
        </div>
      </header>
    </>
  );
}
