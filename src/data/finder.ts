import { TEAMS, TITLES, type RoleKey } from "./roles";

export interface FinderHit { name: string; kind: "Job title" | "Team"; keys: RoleKey[] }

// Common abbreviations work both ways: "QC" finds "Quality Control", "quality assurance" finds "QA Manager".
const ABBR: [string, string][] = [
  ["qc", "quality control"], ["qa", "quality assurance"], ["qp", "qualified person"],
  ["pd", "process development"], ["bd", "business development"],
];

const words = (s: string) => s.toLowerCase().replace(/&/g, " and ").split(/[^a-z0-9]+/).filter(Boolean);

interface Entry extends FinderHit { words: string[]; length: number }

const ENTRIES: Entry[] = [
  ...Object.entries(TITLES).map(([name, keys]) => ({ name, keys, kind: "Job title" as const })),
  ...Object.entries(TEAMS).map(([name, keys]) => ({ name, keys, kind: "Team" as const })),
].map((e) => {
  const base = words(e.name);
  const text = ` ${base.join(" ")} `;
  const extra = ABBR.flatMap(([abbr, full]) => [
    ...(base.includes(abbr) ? full.split(" ") : []),
    ...(text.includes(` ${full} `) ? [abbr] : []),
  ]);
  return { ...e, words: [...base, ...extra], length: base.length };
});

/** Every word typed must start a word in the title or team name. Shortest names first, at most `limit`. */
export function findRoles(query: string, limit = 6): FinderHit[] {
  const q = words(query);
  if (!q.length) return [];
  return ENTRIES
    .filter((e) => q.every((t) => e.words.some((w) => w.startsWith(t))))
    .sort((a, b) => a.length - b.length)
    .slice(0, limit)
    .map(({ name, kind, keys }) => ({ name, kind, keys }));
}
