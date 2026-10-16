import { useEffect, useRef } from "react";
import { alpha, fitCanvas, onThemeChange, prefersReducedMotion, readPalette, type Palette } from "./support";

interface Cell { x: number; y: number; r: number; vx: number; vy: number; depth: number; hue: number; seed: number; nx: number; ny: number }
interface Antibody { x: number; y: number; size: number; rot: number; spin: number; vx: number; vy: number; depth: number; hue: number }

/**
 * Ambient background: slow-drifting immune cells and antibodies with gentle parallax on scroll
 * and a soft push away from the pointer. Canvas 2D, fixed behind the page, ignores pointer events.
 * Pauses when the tab is hidden; draws one still frame for reduced-motion users.
 * This canvas is decorative, pointer-transparent, and fixed behind the document. Never
 * move essential text or controls into this component.
 */
export function CellField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let pal: Palette = readPalette();
    let w = 0, h = 0, dpr = 1;
    let cells: Cell[] = [];
    let abs: Antibody[] = [];
    const pointer = { x: -1e4, y: -1e4 };
    const still = prefersReducedMotion();
    let raf = 0;
    let last = performance.now();

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const populate = () => {
      const area = w * h;
      const nCells = Math.round(Math.min(46, Math.max(14, area / 36000)));
      const nAbs = Math.round(nCells / 3);
      cells = Array.from({ length: nCells }, () => {
        const a = rand(0, Math.PI * 2);
        return {
          x: rand(0, w), y: rand(0, h), r: rand(12, 44), vx: 0, vy: 0, depth: rand(0.2, 1),
          hue: Math.floor(rand(0, 4)), seed: rand(0, 1000), nx: Math.cos(a) * 0.35, ny: Math.sin(a) * 0.35,
        };
      });
      abs = Array.from({ length: nAbs }, () => ({
        x: rand(0, w), y: rand(0, h), size: rand(14, 24), rot: rand(0, Math.PI * 2), spin: rand(-0.25, 0.25),
        vx: rand(-6, 6), vy: rand(-6, 6), depth: rand(0.3, 1), hue: Math.floor(rand(0, 4)),
      }));
    };

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      dpr = fitCanvas(canvas, w, h);
      if (!cells.length) populate();
      if (still) draw(0);
    };

    const colorOf = (i: number) => [pal.accent, pal.haiku, pal.sonnet, pal.opus][i] ?? pal.accent;

    const drawAntibody = (a: Antibody, y: number) => {
      const k = pal.fxAlpha * (0.25 + 0.35 * a.depth);
      ctx.save();
      ctx.translate(a.x, y);
      ctx.rotate(a.rot);
      ctx.strokeStyle = alpha(colorOf(a.hue), k);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      const s = a.size;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.6); ctx.lineTo(0, 0);
      ctx.lineTo(-s * 0.45, -s * 0.55); ctx.moveTo(0, 0);
      ctx.lineTo(s * 0.45, -s * 0.55);
      ctx.stroke();
      ctx.fillStyle = alpha(colorOf(a.hue), k);
      for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * s * 0.5, -s * 0.62, 2.2, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    };

    const drawCell = (c: Cell, y: number, t: number) => {
      const color = colorOf(c.hue);
      const k = pal.fxAlpha * (0.18 + 0.3 * c.depth);
      ctx.beginPath();
      const steps = 28;
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const wob = 1 + 0.05 * Math.sin(a * 3 + t * 0.8 + c.seed) + 0.03 * Math.sin(a * 5 - t * 0.6 + c.seed);
        const px = c.x + Math.cos(a) * c.r * wob, py = y + Math.sin(a) * c.r * wob;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fillStyle = alpha(color, k * 0.35); ctx.fill(); ctx.strokeStyle = alpha(color, k); ctx.lineWidth = 1.4; ctx.stroke();
      ctx.beginPath(); ctx.arc(c.x + c.nx * c.r, y + c.ny * c.r, c.r * 0.38, 0, Math.PI * 2); ctx.fillStyle = alpha(color, k * 0.8); ctx.fill();
    };

    function draw(now: number) {
      const t = now / 1000;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0); ctx!.clearRect(0, 0, w, h);
      const scroll = window.scrollY; const H = h + 120;
      const wrapY = (y: number) => ((((y + 60) % H) + H) % H) - 60;
      for (const c of cells) {
        const y = wrapY(c.y - scroll * c.depth * 0.15);
        if (!still) {
          const ax = Math.sin(t * 0.21 + c.seed) * 4, ay = Math.cos(t * 0.17 + c.seed * 1.3) * 4;
          const dx = c.x - pointer.x, dy = y - pointer.y; const d2 = dx * dx + dy * dy, R = 170;
          if (d2 < R * R && d2 > 1) { const d = Math.sqrt(d2); const f = (1 - d / R) * 90; c.vx += (dx / d) * f * dt; c.vy += (dy / d) * f * dt; }
          c.vx = (c.vx + ax * dt) * 0.96; c.vy = (c.vy + ay * dt) * 0.96;
          c.x += (c.vx + Math.sin(t * 0.1 + c.seed) * 3 * c.depth) * dt; c.y += (c.vy - 2.5 * c.depth) * dt;
          if (c.x < -60) c.x = w + 60; else if (c.x > w + 60) c.x = -60;
        }
        drawCell(c, y, t);
      }
      for (const a of abs) {
        if (!still) { a.x += a.vx * dt; a.y += a.vy * dt; a.rot += a.spin * dt; if (a.x < -40) a.x = w + 40; else if (a.x > w + 40) a.x = -40; }
        drawAntibody(a, wrapY(a.y - scroll * a.depth * 0.1));
      }
      if (!still) raf = requestAnimationFrame(draw);
    }

    const onMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; };
    const onLeave = () => { pointer.x = pointer.y = -1e4; };
    const onVisibility = () => { cancelAnimationFrame(raf); if (!document.hidden && !still) { last = performance.now(); raf = requestAnimationFrame(draw); } };
    const offTheme = onThemeChange(() => { pal = readPalette(); if (still) draw(0); });

    resize(); window.addEventListener("resize", resize); window.addEventListener("pointermove", onMove, { passive: true }); document.addEventListener("pointerleave", onLeave); document.addEventListener("visibilitychange", onVisibility);
    if (still) draw(0); else raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); offTheme(); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  return <canvas ref={ref} className="cell-field" aria-hidden="true" />;
}
