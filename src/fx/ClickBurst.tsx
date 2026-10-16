import { useEffect, useRef } from "react";
import { alpha, fitCanvas, prefersReducedMotion, readPalette } from "./support";

interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string; y_shape: boolean; rot: number }
interface Ring { x: number; y: number; life: number; color: string }
const TARGETS = "button, label, a, [data-burst]";

/** Click feedback on a pointer-transparent canvas; never owns application state. */
export function ClickBurst() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || prefersReducedMotion()) return;
    let parts: Particle[] = [], rings: Ring[] = [], raf = 0, last = 0, dpr = 1;
    const resize = () => { dpr = fitCanvas(canvas, window.innerWidth, window.innerHeight); };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      rings = rings.filter((r) => (r.life += dt) < 0.45);
      for (const r of rings) { const p = r.life / 0.45; ctx.strokeStyle = alpha(r.color, 0.55 * (1 - p)); ctx.lineWidth = 2 * (1 - p) + 0.5; ctx.beginPath(); ctx.arc(r.x, r.y, 6 + 30 * Math.sqrt(p), 0, Math.PI * 2); ctx.stroke(); }
      parts = parts.filter((q) => (q.life += dt) < q.max);
      for (const q of parts) {
        q.vy += 380 * dt; q.vx *= 0.985; q.x += q.vx * dt; q.y += q.vy * dt; q.rot += 6 * dt;
        const k = 1 - q.life / q.max; ctx.fillStyle = ctx.strokeStyle = alpha(q.color, 0.85 * k);
        if (q.y_shape) { ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.lineWidth = 1.5; ctx.lineCap = "round"; const s = q.size * 2; ctx.beginPath(); ctx.moveTo(0, s * 0.6); ctx.lineTo(0, 0); ctx.lineTo(-s * 0.45, -s * 0.5); ctx.moveTo(0, 0); ctx.lineTo(s * 0.45, -s * 0.5); ctx.stroke(); ctx.restore(); }
        else { ctx.beginPath(); ctx.arc(q.x, q.y, q.size * k + 0.5, 0, Math.PI * 2); ctx.fill(); }
      }
      if (parts.length || rings.length) raf = requestAnimationFrame(tick); else { raf = 0; ctx.clearRect(0, 0, canvas.width, canvas.height); }
    };
    const onDown = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(TARGETS) as HTMLElement | null; if (!el || el.closest("[data-no-burst]")) return;
      const own = getComputedStyle(el).getPropertyValue("--c").trim(); const pal = readPalette(); const color = own && own.startsWith("#") ? own : pal.accent;
      rings.push({ x: e.clientX, y: e.clientY, life: 0, color }); const n = 14;
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + Math.random() * 0.4; const sp = 90 + Math.random() * 160; parts.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 80, life: 0, max: 0.5 + Math.random() * 0.35, size: 1.5 + Math.random() * 2.2, color: i % 3 === 0 ? pal.accent : color, y_shape: i % 5 === 0, rot: Math.random() * 6 }); }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };
    resize(); window.addEventListener("resize", resize); document.addEventListener("pointerdown", onDown, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); document.removeEventListener("pointerdown", onDown); };
  }, []);
  return <canvas ref={ref} className="click-burst" aria-hidden="true" />;
}
