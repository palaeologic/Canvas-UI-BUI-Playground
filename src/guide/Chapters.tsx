import type { ReactNode } from "react";

/** The guide's chapters, in reading order. Each id is a <section> on the page. */
export const CHAPTERS = [
  { id: "basics", short: "Basics", title: "The two choices" },
  { id: "settings", short: "Settings", title: "The four settings" },
  { id: "rules", short: "Rules", title: "Four rules" },
  { id: "picker", short: "Try it", title: "Find your setting" },
  { id: "roles", short: "Your role", title: "Examples by role" },
  { id: "signs", short: "Fix it", title: "Signs you picked wrong" },
  { id: "habits", short: "Habits", title: "Good habits" },
  { id: "learn", short: "Learn", title: "Keep learning" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

export const chapterNo = (id: ChapterId) => CHAPTERS.findIndex((c) => c.id === id) + 1;

/** Section eyebrow with the chapter number, so the page reads like a short course. */
export function Eyebrow({ id, children }: { id: ChapterId; children: ReactNode }) {
  return (
    <span className="eyebrow">
      <span className="ch-no">{String(chapterNo(id)).padStart(2, "0")}</span> {children}
    </span>
  );
}

/** "Next chapter" link at the end of a section. */
export function NextLink({ from }: { from: ChapterId }) {
  const i = CHAPTERS.findIndex((c) => c.id === from);
  const next = CHAPTERS[i + 1];
  if (!next) return null;
  return (
    <a className="next-link" href={`#${next.id}`}>
      <span className="next-k">Next · {String(i + 2).padStart(2, "0")}</span>
      <span className="next-t">{next.title}</span>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </a>
  );
}
