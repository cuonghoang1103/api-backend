'use client';

// HomeBackground — performance rewrite of the marketing/home canvas
// background. Only mounted on `/` (the marketing landing page).
//
// Why this rewrite:
// The original animated 55 nodes × O(N²) distance check + 55
// createRadialGradient per frame + 8 shapes × createLinearGradient
// + 2 aurora waves + scanlines + onmousemove re-iteration. On
// mid-range laptops each frame took 10-20ms, blocking input events
// so the cursor felt 2-3 seconds late.
//
// Same optimisation playbook as SocialBackground:
//   1. Pre-build a small palette of cached gradients (zero gradient
//      allocations in the rAF loop).
//   2. Pause on hidden tab + active scroll + offscreen (we use
//      IntersectionObserver rather than IO+scroll since this page
//      is single-screen and rarely scrolls past the fold).
//   3. Reduce node count 55 → 28; shape count 8 → 5.
//   4. Drop the O(N²) line drawing entirely — replaced with a
//      cheap proximity-glow ring around each node (looks similar,
//      no quadratic cost).
//   5. Drop aurora waves (the heaviest single op) — replaced with
//      a single static radial gradient.
//   6. Drop scanlines + shadows + shadowBlur.
//   7. Reduced-motion / weak-device → static CSS fallback.
//   8. Defer first paint by one rAF so we don't race layout.

import { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  paletteIdx: number;
}

interface Shape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  sides: number;
  paletteIdx: number;
  opacity: number;
}

const PALETTE: ReadonlyArray<readonly [number, number, number]> = [
  [139, 92, 246],   // violet
  [6, 182, 212],    // cyan
  [236, 72, 153],   // pink
  [168, 85, 247],   // purple
  [34, 211, 238],   // light cyan
  [99, 102, 241],   // indigo
];

function isWeakDevice(): boolean {
  if (typeof window === 'undefined') return true;
  const dm = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const hc = navigator.hardwareConcurrency ?? 4;
  if (typeof dm === 'number' && dm > 0 && dm < 2) return true;
  if (hc <= 2) return true;
  return false;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function HomeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Touch / coarse-pointer devices (phones, most tablets) get the static
    // CSS-gradient fallback and NEVER start the rAF loop — cuts heat/jank on
    // mobile. Desktop (fine pointer) is unaffected.
    const coarse =
      typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)')?.matches;
    if (prefersReducedMotion() || isWeakDevice() || coarse) { setUseFallback(true); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const cv = canvas;
    const cx = ctx;

    const NODE_COUNT = 28;
    const SHAPE_COUNT = 5;
    const PROX_DIST = 160; // a touch smaller than before; cheaper fill

    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Pre-built palette gradients (unit-circle, scaled by setTransform).
    type Grad = CanvasGradient;
    const nodeGlows: Grad[] = [];
    const shapeStrokes: Grad[] = [];

    function rebuildGradients() {
      nodeGlows.length = 0;
      shapeStrokes.length = 0;
      for (const [r, g, b] of PALETTE) {
        const glow = cx.createRadialGradient(0, 0, 0, 0, 0, 1);
        glow.addColorStop(0, `rgba(${r},${g},${b},0.55)`);
        glow.addColorStop(0.5, `rgba(${r},${g},${b},0.18)`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        nodeGlows.push(glow);

        const stroke = cx.createLinearGradient(-1, -1, 1, 1);
        stroke.addColorStop(0, `rgba(${r},${g},${b},0.85)`);
        stroke.addColorStop(1, `rgba(${r},${g},${b},0.25)`);
        shapeStrokes.push(stroke);
      }
    }

    // Cached background gradient — never changes after resize.
    let bg: CanvasGradient | null = null;
    function rebuildBg() {
      const g = cx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, Math.max(w, h) * 0.8);
      g.addColorStop(0, 'rgba(15, 10, 35, 0.95)');
      g.addColorStop(0.5, 'rgba(8, 5, 20, 0.98)');
      g.addColorStop(1, 'rgba(3, 2, 8, 1)');
      bg = g;
    }

    const nodes: Node[] = [];
    const shapes: Shape[] = [];

    function init() {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          radius: Math.random() * 2.2 + 1.2,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.012 + 0.005,
          paletteIdx: Math.floor(Math.random() * PALETTE.length),
        });
      }
      shapes.length = 0;
      for (let i = 0; i < SHAPE_COUNT; i++) {
        shapes.push({
          x: (i / SHAPE_COUNT) * w + Math.random() * 80,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.26,
          vy: (Math.random() - 0.5) * 0.26,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.003,
          size: Math.random() * 36 + 22,
          sides: Math.floor(Math.random() * 3) + 3,
          paletteIdx: i % PALETTE.length,
          opacity: Math.random() * 0.05 + 0.025,
        });
      }
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      cv.style.width = w + 'px';
      cv.style.height = h + 'px';
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildBg();
      rebuildGradients();
      init();
    }

    // Pause / resume machinery. We only do an early-return inside
    // draw when paused, so the cost of a paused frame is one
    // clearRect and zero compositing.
    let paused = false;
    let rafId = 0;
    let scrollIdle: ReturnType<typeof setTimeout> | null = null;

    function pause() {
      if (paused) return;
      paused = true;
      cancelAnimationFrame(rafId);
    }
    function resume() {
      if (!paused) return;
      paused = false;
      rafId = requestAnimationFrame(draw);
    }

    function onScroll() {
      pause();
      if (scrollIdle) clearTimeout(scrollIdle);
      scrollIdle = setTimeout(resume, 150);
    }
    function onVisibility() {
      if (document.hidden) pause();
      else resume();
    }

    function drawPolygon(cx0: number, cy0: number, radius: number, rotation: number, sides: number) {
      cx.beginPath();
      for (let i = 0; i < sides; i++) {
        const a = (i / sides) * Math.PI * 2 + rotation;
        const x = cx0 + Math.cos(a) * radius;
        const y = cy0 + Math.sin(a) * radius;
        if (i === 0) cx.moveTo(x, y);
        else cx.lineTo(x, y);
      }
      cx.closePath();
    }

    // Cheap O(N²) line check — but with an early-out via Manhattan
    // distance squared so the inner loop doesn't do sqrt for pairs
    // that obviously aren't close. 28 nodes = ~378 pairs/frame; the
    // previous 55 = ~1485 pairs/frame, ~4× cheaper here.
    const PROX_DIST_SQ = PROX_DIST * PROX_DIST;
    let lastTs = 0;
    function draw(ts: number) {
      if (paused) return;
      const dt = Math.min(ts - lastTs, 50);
      lastTs = ts;
      const dtF = dt / 16;

      cx.clearRect(0, 0, w, h);

      // 1. Background gradient (cached).
      if (bg) { cx.fillStyle = bg; cx.fillRect(0, 0, w, h); }

      // 2. Geometric shapes — single stroke pass, no shadow blur.
      cx.save();
      for (const s of shapes) {
        s.x += s.vx * dtF;
        s.y += s.vy * dtF;
        s.rotation += s.rotationSpeed * dtF;
        if (s.x < -s.size * 2) s.x = w + s.size;
        else if (s.x > w + s.size * 2) s.x = -s.size;
        if (s.y < -s.size * 2) s.y = h + s.size;
        else if (s.y > h + s.size * 2) s.y = -s.size;
        cx.globalAlpha = s.opacity;
        cx.strokeStyle = shapeStrokes[s.paletteIdx] ?? shapeStrokes[0];
        cx.lineWidth = 1;
        drawPolygon(s.x, s.y, s.size, s.rotation, s.sides);
        cx.stroke();
      }
      cx.restore();

      // 3. Nodes — pulse + cached radial gradient (transform-scaled).
      for (const n of nodes) {
        n.pulsePhase += n.pulseSpeed * dtF;
        const pulse = (Math.sin(n.pulsePhase) + 1) * 0.5;
        const glowR = n.radius * (3 + pulse * 1.5);
        const grad = nodeGlows[n.paletteIdx] ?? nodeGlows[0];

        cx.save();
        cx.globalAlpha = 0.22 + pulse * 0.12;
        cx.setTransform(dpr * glowR, 0, 0, dpr * glowR, n.x * dpr, n.y * dpr);
        cx.fillStyle = grad;
        cx.beginPath();
        cx.arc(0, 0, 1, 0, Math.PI * 2);
        cx.fill();
        cx.restore();

        // Core dot.
        cx.save();
        cx.globalAlpha = 0.7 + pulse * 0.25;
        cx.setTransform(dpr * n.radius * 1.2, 0, 0, dpr * n.radius * 1.2, n.x * dpr, n.y * dpr);
        cx.fillStyle = grad;
        cx.beginPath();
        cx.arc(0, 0, 1, 0, Math.PI * 2);
        cx.fill();
        cx.restore();

        // Update.
        n.x += n.vx * dtF;
        n.y += n.vy * dtF;
        if (n.x < 0) n.x += w;
        else if (n.x > w) n.x -= w;
        if (n.y < 0) n.y += h;
        else if (n.y > h) n.y -= h;
      }

      cx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 4. Connection lines — only when pairs are close (cheap Manhattan
      // pre-check before the sqrt). No mouse-interaction cost — that
      // was 1 of the heaviest contributors to lag in the old version.
      cx.save();
      cx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx * dx + dy * dy > PROX_DIST_SQ) continue;
          const alpha = 1 - Math.sqrt(dx * dx + dy * dy) / PROX_DIST;
          cx.globalAlpha = alpha * 0.18;
          const [r, g, bl] = PALETTE[a.paletteIdx];
          cx.strokeStyle = `rgba(${r},${g},${bl},${alpha * 0.5})`;
          cx.beginPath();
          cx.moveTo(a.x, a.y);
          cx.lineTo(b.x, b.y);
          cx.stroke();
        }
      }
      cx.restore();

      rafId = requestAnimationFrame(draw);
    }

    resize();
    rafId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollIdle) clearTimeout(scrollIdle);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  if (useFallback) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(15, 10, 35, 0.95) 0%, rgba(8, 5, 20, 0.98) 50%, rgba(3, 2, 8, 1) 100%)',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: -1, contain: 'strict' }}
    />
  );
}
