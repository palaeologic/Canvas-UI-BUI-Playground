import type { ReactNode } from "react";
import type { PlaybookSectionId } from "../playbook-nav";

export function SectionHeader({ eyebrow, title, intro }: { id: PlaybookSectionId; eyebrow: string; title: ReactNode; intro?: ReactNode }) {
  return <div className="sec-head"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{intro ? <p className="prose section-intro">{intro}</p> : null}</div>;
}
