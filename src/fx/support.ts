import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Shared helpers for optional visual effects.
 *
 * Important architecture rule: this module may support decorative Canvas animation,
 * but it must never be required to render or operate forms, navigation, learning text,
 * tabs, tables, or disclosures. If every Canvas call in the app fails, the guide must
 * still remain fully readable and usable.
 */
const motionQuery = () => window.matchMedia("(prefers-reduced-motion: reduce)");

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && motionQuery().matches;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const q = motionQuery();
      q.addEventListener("change", cb);
      return () => q.removeEventListener("change", cb);
    },
    prefersReducedMotion,
    () => false,
  );
}

/** Theme colours for Canvas drawing. Re-read after theme changes instead of duplicating a Canvas palette. */
export interface Palette {
  bg: string; surface: string; ink: string; muted: string; line: string; accent: string;
  haiku: string; sonnet: string; opus: string; fxAlpha: number;
}

export function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string) => cs.getPropertyValue(n).trim();
  return {
    bg: v("--bg"), surface: v("--surface"), ink: v("--ink"), muted: v("--muted"), line: v("--line"),
    accent: v("--accent"), haiku: v("--haiku"), sonnet: v("--sonnet"), opus: v("--opus"),
    fxAlpha: Number.parseFloat(v("--fx-alpha")) || 0.6,
  };
}

export function onThemeChange(cb: () => void): () => void {
  const q = window.matchMedia("(prefers-color-scheme: dark)");
  q.addEventListener("change", cb);
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    q.removeEventListener("change", cb);
    mo.disconnect();
  };
}

export function usePalette(): Palette | null {
  const [p, setP] = useState<Palette | null>(null);
  useEffect(() => {
    const update = () => setP(readPalette());
    update();
    return onThemeChange(update);
  }, []);
  return p;
}

/** "#17885c" + 0.4 -> "rgba(23,136,92,0.4)". Falls back to the input for non-hex colours. */
export function alpha(color: string, a: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(color);
  if (!m || !m[1]) return color;
  const n = Number.parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Size a Canvas backing store to its CSS box, capped at 2x for battery and memory. */
export function fitCanvas(canvas: HTMLCanvasElement, width: number, height: number): number {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(width * dpr));
  const h = Math.max(1, Math.round(height * dpr));
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  return dpr;
}

/**
 * Debug switch: `?nofx=all` or a list such as `?nofx=reveal,cells,burst,loader`.
 * This only disables decoration. No product behavior is allowed to depend on it.
 */
export function fxOff(name: "reveal" | "cells" | "burst" | "loader"): boolean {
  if (typeof location === "undefined") return false;
  const list = new URLSearchParams(location.search).get("nofx")?.split(",") ?? [];
  return list.includes("all") || list.includes(name);
}
