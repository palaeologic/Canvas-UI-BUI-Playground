import { useEffect } from "react";
import { prefersReducedMotion } from "./support";

/**
 * Scroll-in reveals. Elements with [data-reveal] fade and rise into place the first time they enter
 * the viewport; children of [data-stagger] follow one after another. Content is only hidden once this
 * hook has confirmed it can reveal it again (IntersectionObserver present, motion allowed), so a
 * script error or an old browser leaves everything visible.
 *
 * `start` lets the page hold the reveals until the splash loader has gone, so the hero animates in view.
 */
export function useReveal(start: boolean) {
  useEffect(() => {
    if (!start || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    for (const el of els) {
      if (el.hasAttribute("data-stagger")) {
        [...el.children].forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(Math.min(i, 8))));
      }
      // Anything already above the fold or scrolled past shows at once, without animating.
      if (el.getBoundingClientRect().bottom < 0) el.classList.add("is-in", "is-done");
    }
    root.classList.add("reveal-on");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          io.unobserve(el);
          // Drop the entrance transitions afterwards so hover effects respond with no stagger delay.
          window.setTimeout(() => el.classList.add("is-done"), 1400);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => !el.classList.contains("is-in") && io.observe(el));
    return () => io.disconnect();
  }, [start]);
}
