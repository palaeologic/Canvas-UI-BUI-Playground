import type { ReactNode } from "react";
import { fxOff, useReducedMotion } from "./support";

/**
 * Decorative reveal for role cards.
 *
 * This used to render live educational content through experimental HTML-in-Canvas.
 * That made essential content depend on an experimental rendering path. The reveal is
 * now CSS-only: cards always remain ordinary semantic DOM and the effect can safely fail.
 */
export function SequenceReveal({ revealKey, children, className }: { revealKey: string; children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const animate = !reduced && !fxOff("reveal");
  return (
    <div key={revealKey} className={`${className ?? ""} seq-fallback${animate ? " is-animating" : ""}`}>
      {children}
    </div>
  );
}
