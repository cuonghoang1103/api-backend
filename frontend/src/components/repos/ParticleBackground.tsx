'use client';

import { useEffect, useRef } from 'react';

// ─── ParticleBackground ────────────────────────────────────────────
//
// A full-bleed canvas backdrop for the GitHub Repo Hub page.
// Three layers, all rendered to the same <canvas> to keep paint
// cost low:
//
//   1. Drifting "code particles" — small glyphs (·, ⌘, {}, 0/1)
//      that float upward at a slow rate and wrap around the top.
//   2. Glowing dots — a sparse constellation of soft circles that
//      pulse on a sine wave and gently drift. These give the
//      "fairy lights" feel of the existing SocialBackground.
//   3. Mouse halo — a single radial gradient that follows the
//      pointer. It only affects a small region so the rest of
//      the canvas stays calm.
//
// Performance notes:
//   * We cap the particle count based on the canvas area to
//     avoid runaway cost on huge 4K monitors.
//   * The render loop short-circuits when document.hidden is
//     true so background tabs don't burn CPU/GPU.
//   * We downscale the canvas on high-DPI screens. Without
//     this, retina rendering quadruples the cost.
//   * All animation state lives in a single rAF closure so
//     React re-renders don't restart the loop.
// ──────────────────────────────────────────────────────────────────

interface ParticleBackgroundProps {
  /** Reduce density for low-end devices. Default 'high'. */
  density?: 'low' | 'medium' | 'high';
  /** Tint of the particles. Defaults to the violet brand color. */
  color?: string;
  /** If false, do not follow the pointer. */
  followPointer?: boolean;
}

export default function ParticleBackground({
  density = 'high',
  color = 'rgba(167, 139, 250, ', // tailwind violet-400
  followPointer = true,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // ─── Sizing ────────────────────────────────────────────────
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    // ─── Particle count ──────────────────────────────────────
    const area = width * height;
    const densityMap = { low: 0.00004, medium: 0.00008, high: 0.00015 };
    const totalCount = Math.min(
      Math.max(40, Math.floor(area * densityMap[density])),
      220,
    );
    const glyphCount = Math.floor(totalCount * 0.55);
    const dotCount = totalCount - glyphCount;

    // ─── Glyph pool (matrix-style but gentle) ──────────────────
    const glyphs = ['·', '⌘', '{}', '0', '1', 'λ', 'π', '◇', '∞', '✦', '→', '◆'];
    const codeChars: CodeParticle[] = Array.from({ length: glyphCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: -(0.15 + Math.random() * 0.45), // upward
      vx: (Math.random() - 0.5) * 0.1,
      ch: glyphs[Math.floor(Math.random() * glyphs.length)],
      size: 10 + Math.random() * 6,
      alpha: 0.15 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.4 + Math.random() * 0.6,
    }));

    // ─── Glowing dots ─────────────────────────────────────────
    const dots: DotParticle[] = Array.from({ length: dotCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      phase: Math.random() * Math.PI * 2,
      pulse: 0.5 + Math.random() * 0.8,
    }));

    // ─── Pointer state ────────────────────────────────────────
    const pointer: { x: number; y: number; active: boolean } = {
      x: width / 2,
      y: height / 2,
      active: false,
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    if (followPointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave);
    }

    // ─── Render loop ──────────────────────────────────────────
    let rafId = 0;
    let lastTs = performance.now();
    const render = (ts: number) => {
      // Pause when tab is hidden — saves battery in background.
      if (document.hidden) {
        rafId = requestAnimationFrame(render);
        return;
      }
      const dt = Math.min(ts - lastTs, 50); // cap dt to avoid huge jumps after tab switch
      lastTs = ts;

      ctx.clearRect(0, 0, width, height);

      // Soft radial gradient near the pointer for a "spotlight" effect.
      if (followPointer && pointer.active) {
        const grad = ctx.createRadialGradient(
          pointer.x, pointer.y, 0,
          pointer.x, pointer.y, 220,
        );
        grad.addColorStop(0, `${color}0.12)`);
        grad.addColorStop(0.5, `${color}0.04)`);
        grad.addColorStop(1, `${color}0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // ── Glowing dots (drawn first, behind glyphs) ──
      for (const d of dots) {
        d.x += d.vx * (dt / 16);
        d.y += d.vy * (dt / 16);
        if (d.x < 0) d.x = width;
        else if (d.x > width) d.x = 0;
        if (d.y < 0) d.y = height;
        else if (d.y > height) d.y = 0;

        const phase = (ts * 0.001 * d.pulse) + d.phase;
        const glow = 0.35 + 0.45 * Math.sin(phase);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * (1 + 0.6 * Math.sin(phase)), 0, Math.PI * 2);
        ctx.fillStyle = `${color}${0.55 * glow})`;
        ctx.fill();

        // Outer glow ring for the bigger dots only — too expensive otherwise.
        if (d.r > 1.2) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = `${color}${0.06 * glow})`;
          ctx.fill();
        }
      }

      // ── Code particles ──
      for (const p of codeChars) {
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;

        // Subtle horizontal sway via a sine — gives the
        // particles a "floating" feel rather than drifting
        // in a straight line.
        const sway = Math.sin((ts * 0.001) + p.phase) * 6;
        const twinkle = p.alpha * (0.7 + 0.3 * Math.sin((ts * 0.001) * p.twinkle + p.phase));

        ctx.font = `${p.size}px ui-monospace, "JetBrains Mono", "Fira Code", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `${color}${twinkle})`;
        ctx.fillText(p.ch, p.x + sway, p.y);

        // Soft underline accent under the bigger glyphs.
        if (p.size > 13) {
          ctx.fillStyle = `${color}${twinkle * 0.35})`;
          ctx.fillRect(p.x + sway - p.size * 0.4, p.y + p.size * 0.55, p.size * 0.8, 1);
        }
      }

      // Subtle vignette so the edges feel deeper than the
      // center — focuses the eye on the cards above.
      const vg = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.35,
        width / 2, height / 2, Math.max(width, height) * 0.75,
      );
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, width, height);

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      if (followPointer) {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
      }
    };
  }, [density, color, followPointer]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

// ─── Particle types ──────────────────────────────────────────────

interface CodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ch: string;
  size: number;
  alpha: number;
  phase: number;
  twinkle: number;
}

interface DotParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  pulse: number;
}
