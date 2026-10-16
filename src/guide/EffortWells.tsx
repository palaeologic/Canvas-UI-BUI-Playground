export type EffortTone = "low" | "medium" | "high";

export function Wells({ on, color, tone = "medium" }: { on: number; color?: string; tone?: EffortTone }) {
  const wellColor = color ?? `var(--effort-${tone})`;
  return (
    <span className={`wells effort-${tone}`} aria-hidden="true" style={{ ["--wc" as string]: wellColor }}>
      {[1, 2, 3].map((i) => <i key={i} className={i <= on ? "on" : undefined} style={{ ["--k" as string]: i }} />)}
    </span>
  );
}
