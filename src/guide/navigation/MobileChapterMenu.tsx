import { CHAPTERS, type ChapterId } from "../Chapters";

const Check = () => (
  <svg className="tick" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function MobileChapterMenu({
  active,
  visited,
  isComplete,
  onChoose,
}: {
  active: ChapterId | null;
  visited: Set<ChapterId>;
  isComplete: boolean;
  onChoose: () => void;
}) {
  return (
    <>
      <p className="menu-head">{isComplete ? "Guide complete" : `${visited.size} of ${CHAPTERS.length} chapters visited`}</p>
      <ol>
        {CHAPTERS.map((c, i) => {
          const showSeen = !isComplete && visited.has(c.id) && c.id !== active;
          return (
            <li key={c.id} style={{ ["--i" as string]: i }}>
              <a href={`#${c.id}`} aria-current={c.id === active ? "location" : undefined} onClick={onChoose}>
                <span className={`n${showSeen ? " seen" : ""}`}>{showSeen ? <Check /> : i + 1}</span>
                <span className="t">{c.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
      <a className="menu-foot" href="/playbook">Developer playbook →</a>
    </>
  );
}
