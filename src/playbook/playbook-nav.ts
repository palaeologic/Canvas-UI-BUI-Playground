export const PLAYBOOK_NAV = [
  { label: "Understand", items: [
    { id: "dials", label: "Two dials" },
    { id: "explorer", label: "Effort explorer" },
  ] },
  { label: "Diagnose", items: [
    { id: "when", label: "When to change effort" },
    { id: "which", label: "Effort or model?" },
  ] },
  { label: "Choose & route", items: [
    { id: "defaults", label: "Defaults & prices" },
    { id: "matrix", label: "Routing matrix" },
  ] },
  { label: "Configure", items: [
    { id: "chat", label: "Chat presets" },
    { id: "openchamber", label: "OpenChamber" },
  ] },
  { label: "Platform", items: [
    { id: "bio", label: "Biology refusals" },
    { id: "bedrock", label: "Bedrock gotchas" },
  ] },
  { label: "Measure", items: [
    { id: "sweep", label: "Run a sweep" },
  ] },
  { label: "Govern", items: [
    { id: "habit", label: "Governance" },
  ] },
] as const;

export type PlaybookNavGroup = (typeof PLAYBOOK_NAV)[number];
export type PlaybookSectionId = PlaybookNavGroup["items"][number]["id"];

export const LEGACY_PLAYBOOK_FRAGMENTS: Readonly<Record<string, PlaybookSectionId>> = {
  code: "openchamber",
};

const currentIds = new Set<string>(PLAYBOOK_NAV.flatMap((group) => group.items.map((item) => item.id)));

export function normalizePlaybookFragment(fragment: string): PlaybookSectionId | null {
  const id = fragment.replace(/^#/, "");
  if (!id) return null;
  if (currentIds.has(id)) return id as PlaybookSectionId;
  return LEGACY_PLAYBOOK_FRAGMENTS[id] ?? null;
}

export function playbookFragmentHref(id: PlaybookSectionId): string {
  return `/playbook#${id}`;
}
