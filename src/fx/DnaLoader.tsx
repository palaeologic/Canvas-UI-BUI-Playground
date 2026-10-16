import { useEffect, useRef, useState } from "react";
import { alpha, fitCanvas, prefersReducedMotion, readPalette } from "./support";

const MIN_MS = 1000, MAX_MS = 2600, EXIT_MS = 700, PAIRS = 24;
const SEEN_KEY = "pyc-loader-seen";
function seenThisSession(): boolean { try { return sessionStorage.getItem(SEEN_KEY) === "1"; } catch { return false; } }

/** Decorative splash loader; normal app content remains React DOM. */
export function DnaLoader({ ready, onDone }: { ready: Promise<unknown>; onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"show" | "exit" | "gone">(() => (prefersReducedMotion() || seenThisSession() ? "gone" : "show"));
  const exitStart = useRef(0);
  useEffect(() => {
    if (state === "gone") { onDone?.(); return; }
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch {}
    const started = performance.now(); let cancelled = false;
    const finish = () => { if (cancelled || exitStart.current) return; exitStart.current = performance.now(); setState("exit"); onDone?.(); window.setTimeout(() => !cancelled && setState("gone"), EXIT_MS); };
    const cap = window.setTimeout(finish, MAX_MS);
    ready.finally(() => { const wait = Math.max(0, MIN_MS - (performance.now() - started)); window.setTimeout(() => { window.clearTimeout(cap); finish(); }, wait); });
    return () => { cancelled = true; window.clearTimeout(cap); };
  }, []);
  useEffect(() => {
    if (state === "gone") return;
    const canvas = canvasRef.current; const ctx = canvas?.getContext("2d"); if (!canvas || !ctx) return;
    const pal = readPalette(); const pairColors = [pal.haiku, pal.sonnet, pal.opus, pal.accent]; let raf = 0;
    const draw = (now: number) => {
      const w = canvas.clientWidth, h = canvas.clientHeight; const dpr = fitCanvas(canvas, w, h); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const width = Math.min(560, w * 0.78), amp = Math.min(46, h * 0.07), cx = w / 2, cy = h / 2 - 18, x0 = cx - width / 2, t = now / 1000;
      const unzip = exitStart.current ? Math.min(1, (now - exitStart.current) / EXIT_MS) : 0, ease = unzip * unzip * (3 - 2 * unzip);
      const strandA: [number, number, number][] = [], strandB: [number, number, number][] = [];
      for (let i = 0; i < PAIRS; i++) { const x = x0 + (i / (PAIRS - 1)) * width; const phase = t * 2.4 + i * 0.42; const s = Math.sin(phase), c = Math.cos(phase); const fromMid = Math.abs(i - (PAIRS - 1) / 2) / (PAIRS / 2); const split = Math.max(0, ease * 1.6 - fromMid * 0.6) * h * 0.22; strandA.push([x, cy + amp * s - split, c]); strandB.push([x, cy - amp * s + split, -c]); }
      ctx.lineCap = "round";
      for (let i = 0; i < PAIRS; i++) { const a = strandA[i]!, b = strandB[i]!; const depth = Math.abs(a[2]), color = pairColors[i % pairColors.length]!, fade = 1 - ease; const midX = a[0], midY = (a[1] + b[1]) / 2; ctx.lineWidth = 3; ctx.strokeStyle = alpha(color, (0.25 + 0.6 * depth) * fade); const gap = ease * 10; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(midX, midY - gap); ctx.stroke(); ctx.strokeStyle = alpha(pairColors[(i + 2) % pairColors.length]!, (0.25 + 0.6 * depth) * fade); ctx.beginPath(); ctx.moveTo(midX, midY + gap); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      const backbone = (pts: [number, number, number][], color: string) => { ctx.lineWidth = 2; ctx.strokeStyle = alpha(color, 0.55 * (1 - ease * 0.7)); ctx.beginPath(); pts.forEach(([x, y], i) => { if (i === 0) return ctx.moveTo(x, y); const [px, py] = pts[i - 1]!; ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2); }); ctx.stroke(); for (const [x, y, z] of pts) { ctx.fillStyle = alpha(color, (0.35 + 0.65 * (z + 1) / 2) * (1 - ease)); ctx.beginPath(); ctx.arc(x, y, 2.2 + 2.6 * ((z + 1) / 2), 0, Math.PI * 2); ctx.fill(); } };
      backbone(strandB, pal.muted); backbone(strandA, pal.ink); raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf);
  }, [state === "gone"]);
  if (state === "gone") return null;
  return <div className={`dna-loader${state === "exit" ? " is-exiting" : ""}`} role="status" aria-live="polite" onClick={() => { exitStart.current = performance.now(); setState("exit"); onDone?.(); window.setTimeout(() => setState("gone"), EXIT_MS); }}><canvas ref={canvasRef} className="dna-canvas" aria-hidden="true" /><p className="dna-caption">Preparing your guide</p></div>;
}
