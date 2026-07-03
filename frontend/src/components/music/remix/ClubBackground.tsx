'use client';

import { useEffect, useRef } from 'react';

/**
 * ClubBackground — an animated nightclub / DJ-bar backdrop for the
 * /music/remix deck. Sweeping coloured spotlight beams from the ceiling,
 * a slow strobe pulse, a haze glow over the "dancefloor", and drifting
 * light dust. Pure canvas (transform/opacity-cheap), honours
 * prefers-reduced-motion (paints one static frame) and pauses while the
 * tab is hidden. Same lifecycle pattern as CyberBackground.tsx.
 */
export default function ClubBackground() {
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

    // Ceiling-mounted moving-head beams. Each pivots from a fixed anchor
    // near the top and sweeps its aim left↔right at its own rate.
    type Beam = { anchorX: number; hue: number; sweep: number; speed: number; phase: number; width: number };
    let beams: Beam[] = [];
    const initBeams = () => {
      const w = canvas.width;
      const hues = [280, 320, 190, 45, 255]; // violet, magenta, cyan, amber, indigo
      beams = hues.map((hue, i) => ({
        anchorX: (0.12 + 0.19 * i) * w,
        hue,
        sweep: 0.55 + 0.1 * i,
        speed: 0.18 + 0.05 * i * (i % 2 ? 1 : -1),
        phase: i * 1.3,
        width: 0.05 + 0.012 * (i % 3),
      }));
    };

    // Drifting dancefloor dust / light motes.
    type Mote = { x: number; y: number; r: number; vy: number; a: number; hue: number };
    let motes: Mote[] = [];
    const initMotes = () => {
      const w = canvas.width, h = canvas.height;
      const n = Math.min(70, Math.floor((w * h) / 26000));
      motes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.25 + 0.05),
        a: Math.random() * 0.4 + 0.1,
        hue: [280, 320, 190][Math.floor(Math.random() * 3)],
      }));
    };

    let t = 0;
    const drawFrame = () => {
      const w = canvas.width, h = canvas.height;

      // Base: deep club gloom, slightly warmer toward the floor.
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#05030c');
      bg.addColorStop(0.55, '#0a0616');
      bg.addColorStop(1, '#0d0510');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Global slow "beat" pulse (fakes music energy without audio wiring).
      const beat = 0.5 + 0.5 * Math.sin(t * 2.2);
      const beatSoft = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.1));

      // Spotlight beams — triangular gradient wedges fanning down.
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const topY = -h * 0.06;
      for (const b of beams) {
        const aim = Math.sin(t * b.speed + b.phase) * b.sweep; // radians offset
        const len = h * 1.25;
        const halfW = b.width * w * (0.7 + 0.5 * beat);
        // Direction pointing generally downward, tilted by `aim`.
        const dx = Math.sin(aim);
        const dy = Math.cos(aim);
        const ex = b.anchorX + dx * len;
        const ey = topY + dy * len;
        // Perpendicular for the wedge base.
        const px = dy, py = -dx;

        const grad = ctx.createLinearGradient(b.anchorX, topY, ex, ey);
        const inten = 0.16 * (0.5 + 0.7 * beat);
        grad.addColorStop(0, `hsla(${b.hue}, 95%, 65%, ${inten})`);
        grad.addColorStop(0.5, `hsla(${b.hue}, 95%, 60%, ${inten * 0.45})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(b.anchorX, topY);
        ctx.lineTo(ex + px * halfW, ey + py * halfW);
        ctx.lineTo(ex - px * halfW, ey - py * halfW);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Bright source glow at the fixture.
        const src = ctx.createRadialGradient(b.anchorX, topY + h * 0.02, 0, b.anchorX, topY + h * 0.02, w * 0.06);
        src.addColorStop(0, `hsla(${b.hue}, 100%, 80%, ${0.5 * beat})`);
        src.addColorStop(1, 'transparent');
        ctx.fillStyle = src;
        ctx.fillRect(b.anchorX - w * 0.06, topY - h * 0.02, w * 0.12, h * 0.1);
      }
      ctx.restore();

      // Dancefloor haze glow rising from the bottom center.
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const haze = ctx.createRadialGradient(w * 0.5, h * 1.02, 0, w * 0.5, h * 1.02, h * 0.8);
      haze.addColorStop(0, `hsla(290, 80%, 55%, ${0.10 * beatSoft})`);
      haze.addColorStop(0.5, `hsla(260, 80%, 50%, ${0.05 * beatSoft})`);
      haze.addColorStop(1, 'transparent');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Light motes.
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const m of motes) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${m.hue}, 90%, 75%, ${m.a * (0.5 + 0.5 * beat)})`;
        ctx.fill();
        m.y += m.vy;
        m.x += Math.sin(t * 0.5 + m.y * 0.01) * 0.15;
        if (m.y < -4) { m.y = h + 4; m.x = Math.random() * w; }
      }
      ctx.restore();

      // Subtle vignette to focus the console in the center.
      const vig = ctx.createRadialGradient(w / 2, h * 0.55, h * 0.25, w / 2, h * 0.55, Math.max(w, h) * 0.75);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    };

    const loop = () => {
      t += 0.016;
      drawFrame();
      rafRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (!reduce) rafRef.current = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onResize = () => { resize(); initBeams(); initMotes(); drawFrame(); };

    resize();
    initBeams();
    initMotes();
    drawFrame(); // paint once immediately
    start();

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
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
