import { PLAYBOOK_NAV, type PlaybookSectionId } from "../playbook-nav";
export function SectionRail({ activeSection }: { activeSection: PlaybookSectionId }) {
  return <aside className="section-rail" aria-label="Playbook table of contents"><h2>On this page</h2>{PLAYBOOK_NAV.map((group) => <div className="rail-group" key={group.label}><span className="rail-label">{group.label}</span>{group.items.map((item) => <a href={`#${item.id}`} key={item.id} aria-current={item.id === activeSection ? "location" : undefined}>{item.label}</a>)}</div>)}</aside>;
}
