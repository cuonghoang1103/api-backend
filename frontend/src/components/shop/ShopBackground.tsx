'use client';

import { useEffect, useRef } from 'react';

/**
 * ShopBackground — a calm, premium ambient backdrop for the shop.
 *
 * Rewritten (2026-07-03): the old version was a busy "cyber" canvas
 * (40 moving hologram lines, flickering SHOP/SALE/HOT neon signs, glitch
 * blocks, scanner beams) which read as distracting on a storefront. This
 * version is intentionally quiet: a soft dark gradient + a few very slow,
 * low-opacity radial glows drifting behind the content, plus a faint grid.
 * Transform/opacity-cheap, no per-frame text/shadow work. Honours
 * prefers-reduced-motion (renders a static frame).
 */
export default function ShopBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // A handful of large, soft glows that drift slowly. Muted premium
    // hues (indigo / teal / violet) at very low opacity.
    type Glow = { x: number; y: number; r: number; hue: number; phase: number; ax: number; ay: number };
    let glows: Glow[] = [];
    const initGlows = () => {
      const w = canvas.width, h = canvas.height;
      const hues = [225, 265, 190]; // indigo, violet, teal
      glows = hues.map((hue, i) => ({
        x: (0.25 + 0.25 * i) * w,
        y: (0.35 + 0.15 * ((i % 2) ? 1 : -1)) * h,
        r: Math.max(w, h) * (0.42 + 0.06 * i),
        hue,
        phase: i * 2.1,
        ax: (0.05 + 0.02 * i) * w,
        ay: (0.04 + 0.015 * i) * h,
      }));
    };

    let t = 0;
    const drawFrame = () => {
      const w = canvas.width, h = canvas.height;

      // Base gradient — deep, calm navy (not pure black), gentle top-down.
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#0b0f1e');
      bg.addColorStop(1, '#070a14');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Soft drifting glows (screen-blended for a clean bloom).
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const g of glows) {
        const gx = g.x + Math.cos(t * 0.15 + g.phase) * g.ax;
        const gy = g.y + Math.sin(t * 0.12 + g.phase) * g.ay;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, g.r);
        grad.addColorStop(0, `hsla(${g.hue}, 70%, 55%, 0.10)`);
        grad.addColorStop(0.5, `hsla(${g.hue}, 70%, 50%, 0.04)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();

      // Very faint grid for a subtle "tech" texture (barely visible).
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.03)';
      ctx.lineWidth = 1;
      const CELL = 64;
      for (let x = 0; x <= w; x += CELL) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y <= h; y += CELL) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.restore();
    };

    const loop = () => {
      t += 0.016;
      drawFrame();
      rafRef.current = requestAnimationFrame(loop);
    };

    resize();
    initGlows();
    drawFrame(); // paint once immediately

    if (!reduce) {
      rafRef.current = requestAnimationFrame(loop);
    }

    const onResize = () => { resize(); initGlows(); drawFrame(); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
