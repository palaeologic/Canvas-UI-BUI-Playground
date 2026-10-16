import { PLAYBOOK_NAV, type PlaybookSectionId } from "../playbook-nav";

export function SectionNav({ activeSection, activeGroup }: { activeSection: PlaybookSectionId; activeGroup: string }) {
  return <>
    <nav className="compact-nav" aria-label="Playbook topic groups">{PLAYBOOK_NAV.map((group) => <a href={`#${group.items[0].id}`} key={group.label} aria-current={group.label === activeGroup ? "location" : undefined}>{group.label}</a>)}</nav>
    <details className="mobile-sections">
      <summary>Sections · {activeGroup}</summary>
      <div className="mobile-sections-panel">{PLAYBOOK_NAV.map((group) => <div className="mobile-sections-group" key={group.label}><span className="mobile-sections-label">{group.label}</span>{group.items.map((item) => <a href={`#${item.id}`} key={item.id} aria-current={item.id === activeSection ? "location" : undefined}>{item.label}</a>)}</div>)}</div>
    </details>
  </>;
}
