import type { ReactNode } from "react";
export function Disclosure({ summary, children, open }: { summary: ReactNode; children: ReactNode; open?: boolean }) {
  return <details className="disclosure" open={open}><summary>{summary}</summary>{children}</details>;
}
