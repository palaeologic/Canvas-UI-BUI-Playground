import { useSyncExternalStore } from "react";
import { onThemeChange, prefersReducedMotion } from "./fx/support";

/**
 * Light/dark theme. The page follows the OS until the user picks one; picking the same theme as the OS
 * clears the stored choice, so "follow the system" comes back by itself. The inline script in the HTML
 * <head> applies a stored choice before first paint, so there is no flash of the wrong theme.
 */
export type Theme = "light" | "dark";
export const THEME_KEY = "pyc-theme";

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");
export const systemTheme = (): Theme => (darkQuery().matches ? "dark" : "light");

export function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  return set === "dark" || set === "light" ? set : systemTheme();
}

/** Switch theme. With an origin point, the new theme grows out of it as a circle (View Transitions). */
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try {
      if (next === systemTheme()) localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, next);
    } catch { /* storage unavailable */ }
  };

  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || prefersReducedMotion()) {
    const root = document.documentElement;
    root.classList.add("theme-anim");
    apply();
    window.setTimeout(() => root.classList.remove("theme-anim"), 400);
    return;
  }

  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 28;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const t = doc.startViewTransition(apply);
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 520, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
    );
  }).catch(() => { /* transition skipped */ });
}

export function useTheme(): Theme {
  return useSyncExternalStore(onThemeChange, currentTheme, () => "light");
}
