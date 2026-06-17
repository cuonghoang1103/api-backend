'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated galaxy / solar-system background.
 *
 * What you get, in layers (back to front):
 *  1. Deep-space gradient (radial dark navy → near-black)
 *  2. Nebula clouds (3 colored radial blobs that drift slowly,
 *     blended with `screen` so they look like gas clouds)
 *  3. A field of ~600 parallax stars. Each star is a tiny
 *     canvas circle that twinkles on its own phase.
 *  4. A central solar system: 1 sun (radial gradient w/ glow
 *     + corona flicker) and 4 orbiting planets on tilted
 *     orbits, each with a thin orbit ring.
 *  5. On top of everything: a faint vignette so the page
 *     content stays readable.
 *
 * Performance notes:
 *  - Single <canvas>, single rAF loop, no DOM thrash.
 *  - Hi-DPI aware (backs the canvas with the devicePixelRatio).
 *  - Pauses when the tab is hidden (rAF doesn't fire, so this
 *    comes for free, but we still guard against stale clocks).
 *  - No deps — pure canvas2d.
 *
 * The component is `pointer-events: none` so it never blocks
 * clicks. By default it spans the full viewport (`fixed
 * inset-0 -z-10`), but you can pass `contained` to make it
 * sit inside its parent as an `absolute inset-0` layer —
 * useful when you want the galaxy confined to a single
 * panel (e.g. the messenger body) rather than the whole
 * page.
 */
export default function GalaxyBackground({
  contained = false,
}: {
  /**
   * When `true`, the wrapper becomes `absolute inset-0` and
   * sizes itself to its parent (which must be `position:
   * relative` or similar). When `false` (default) the
   * wrapper is `fixed inset-0 -z-10` covering the viewport.
   */
  contained?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let lastTs = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;    // ── Star field ────────────────────────────────────────
    // Two layers: a dense near-field of small stars and a
    // sparser far-field of bigger twinkly stars. We sample
    // positions once on resize; the per-frame work is just
    // twinkling + drawing.
    type Star = {
      x: number; // 0..1 (relative to width)
      y: number; // 0..1 (relative to height)
      r: number; // base radius in px (scaled by dpr)
      phase: number; // 0..2π twinkle phase
      speed: number; // twinkle speed (rad/s)
      hue: number; // 200..260 most are blue-white, a few warm
    };
    let stars: Star[] = [];
    const STAR_COUNT = 600;

    // ── Solar system ──────────────────────────────────────
    // Sun + 4 planets on tilted orbits. Each orbit is rendered
    // as a thin ellipse (the perspective of a circle tilted in
    // 3D). Planets are small solid circles with their own
    // tinted highlight to fake a lit hemisphere.
    type Planet = {
      orbitR: number; // semi-major axis in px
      size: number; // radius in px
      speed: number; // angular speed (rad/s)
      phase: number; // initial phase (rad)
      tilt: number; // orbit tilt (rad) — gives the ellipse YX ratio
      hue: number; // base hue for the planet body
      highlightHue: number; // hue for the lit highlight
    };
    const planets: Planet[] = [
      { orbitR: 90, size: 3.5, speed: 1.1, phase: 0.4, tilt: 0.25, hue: 28, highlightHue: 48 }, // warm inner
      { orbitR: 140, size: 5, speed: 0.7, phase: 2.1, tilt: 0.15, hue: 200, highlightHue: 210 }, // blue
      { orbitR: 200, size: 6.5, speed: 0.45, phase: 4.0, tilt: 0.35, hue: 140, highlightHue: 160 }, // green
      { orbitR: 270, size: 4.5, speed: 0.3, phase: 5.5, tilt: 0.2, hue: 320, highlightHue: 340 }, // pinkish
    ];

    // ── Nebulas ───────────────────────────────────────────
    // Big colored radial blobs that drift. We store them as
    // base positions in 0..1 space and offset slowly over
    // time to give the impression of slow gas motion.
    type Nebula = {
      x: number; y: number; // 0..1
      r: number; // radius in px
      hue: number; // 0..360
      phase: number;
    };
    const nebulas: Nebula[] = [
      { x: 0.18, y: 0.22, r: 380, hue: 220, phase: 0 },     // blue
      { x: 0.82, y: 0.30, r: 460, hue: 290, phase: 1.4 },   // purple
      { x: 0.55, y: 0.85, r: 520, hue: 200, phase: 2.8 },   // cyan
      { x: 0.30, y: 0.75, r: 420, hue: 320, phase: 4.2 },   // pink
    ];

    /**
     * Resize the canvas backing store to match the canvas's
     * actual rendered size (in CSS pixels) and rebuild the
     * star field. Cheap because we only sample positions, not
     * allocate per frame.
     *
     * We use `clientWidth/clientHeight` (not `window.inner*`)
     * so the same code works in both `fixed inset-0` (full
     * viewport) and `absolute inset-0` (clipped to a parent)
     * modes. In the latter case the parent must be
     * `position: relative` and have a definite size.
     */
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Fall back to 0 if the canvas is hidden — we skip
      // resampling in that case so we don't divide by 0.
      const rect = canvas.getBoundingClientRect();
      width = rect.width || canvas.clientWidth;
      height = rect.height || canvas.clientHeight;
      if (width === 0 || height === 0) return;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // (Re)seed stars proportionally to the canvas area so
      // density stays roughly constant on big canvases.
      const area = (width * height) / (1280 * 720);
      const count = Math.floor(STAR_COUNT * Math.max(0.6, Math.min(2, area)));
      stars = new Array(count).fill(0).map(() => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.4 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.8,
        hue: 200 + Math.random() * 80, // mostly blue-white
      }));
    };

    /**
     * Paint a soft radial blob. We use a stacked-radial
     * gradient with the lightest color in the center and a
     * bunch of progressively darker stops with low alpha.
     * This is cheap (one fill per nebula per frame).
     */
    const drawNebula = (n: Nebula, t: number) => {
      // Slow drift around the base position so the clouds
      // "breathe" rather than being glued in place.
      const ox = Math.cos(t * 0.05 + n.phase) * 40;
      const oy = Math.sin(t * 0.04 + n.phase * 0.7) * 30;
      const cx = n.x * width + ox;
      const cy = n.y * height + oy;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r);
      grad.addColorStop(0, `hsla(${n.hue}, 80%, 60%, 0.18)`);
      grad.addColorStop(0.4, `hsla(${n.hue}, 80%, 50%, 0.10)`);
      grad.addColorStop(1, `hsla(${n.hue}, 80%, 30%, 0)`);
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    /**
     * Paint the central sun. We layer 3 radial gradients:
     *  1. Soft outer corona (very wide, low alpha) — gives the
     *     "lit-from-within" halo.
     *  2. Mid glow (medium alpha) — the visible disc.
     *  3. Bright core (small radius, near-white) — the eye
     *     anchor.
     * Plus a flickering "surface" jitter via a tiny per-frame
     * offset so it doesn't look static.
     */
    const drawSun = (cx: number, cy: number, t: number) => {
      const flicker = 1 + Math.sin(t * 1.7) * 0.04 + Math.sin(t * 4.1) * 0.02;
      // Outer corona
      const outer = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160 * flicker);
      outer.addColorStop(0, 'rgba(255, 200, 120, 0.35)');
      outer.addColorStop(0.3, 'rgba(255, 160, 80, 0.18)');
      outer.addColorStop(1, 'rgba(255, 140, 50, 0)');
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = outer;
      ctx.beginPath();
      ctx.arc(cx, cy, 160 * flicker, 0, Math.PI * 2);
      ctx.fill();
      // Mid glow
      const mid = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70);
      mid.addColorStop(0, 'rgba(255, 235, 180, 0.95)');
      mid.addColorStop(0.5, 'rgba(255, 200, 120, 0.7)');
      mid.addColorStop(1, 'rgba(255, 180, 90, 0)');
      ctx.fillStyle = mid;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.fill();
      // Bright core
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
      core.addColorStop(0, 'rgba(255, 255, 245, 1)');
      core.addColorStop(0.6, 'rgba(255, 240, 200, 0.9)');
      core.addColorStop(1, 'rgba(255, 200, 120, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    /**
     * Draw a planet at its current orbit position. The orbit
     * is an ellipse with X radius = orbitR, Y radius =
     * orbitR * cos(tilt) — a circle viewed at an angle looks
     * exactly like that. The planet itself is a small disc
     * with a tinted highlight on the side facing the sun.
     */
    const drawPlanet = (p: Planet, t: number, sunX: number, sunY: number) => {
      const angle = p.phase + t * p.speed;
      const px = sunX + Math.cos(angle) * p.orbitR;
      const py = sunY + Math.sin(angle) * p.orbitR * Math.cos(p.tilt);

      // Orbit ring (thin, low alpha — purely decorative)
      ctx.save();
      ctx.translate(sunX, sunY);
      ctx.scale(1, Math.cos(p.tilt));
      ctx.beginPath();
      ctx.arc(0, 0, p.orbitR, 0, Math.PI * 2);
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.stroke();
      ctx.restore();

      // Direction from sun → planet, in screen space. Used to
      // place the highlight on the lit side.
      const dx = px - sunX;
      const dy = py - sunY;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const hx = px - ux * p.size * 0.35;
      const hy = py - uy * p.size * 0.35;

      // Body
      const body = ctx.createRadialGradient(hx, hy, 0, px, py, p.size);
      body.addColorStop(0, `hsl(${p.highlightHue}, 80%, 80%)`);
      body.addColorStop(0.6, `hsl(${p.hue}, 65%, 55%)`);
      body.addColorStop(1, `hsl(${p.hue}, 70%, 25%)`);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Subtle atmospheric glow on far side (rim light)
      const rim = ctx.createRadialGradient(px, py, p.size * 0.8, px, py, p.size * 1.4);
      rim.addColorStop(0, `hsla(${p.highlightHue}, 90%, 80%, 0)`);
      rim.addColorStop(1, `hsla(${p.highlightHue}, 90%, 80%, 0.25)`);
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(px, py, p.size * 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    /**
     * One frame. Order matters: deep gradient → nebulas →
     * far stars → solar system → near stars → vignette. The
     * solar system is centered on the viewport so the page
     * content sits over the gas giants without a hot spot.
     */
    const draw = (ts: number) => {
      // `ts` is the high-res DOMHighResTimeStamp (ms). We
      // convert to seconds for our trig.
      const t = ts / 1000;
      const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0.016;
      lastTs = ts;

      // Deep-space gradient — darker at edges, slightly
      // lighter near the center to suggest an open cluster.
      const bg = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) * 0.8,
      );
      bg.addColorStop(0, '#0a0a1f');
      bg.addColorStop(0.5, '#05050f');
      bg.addColorStop(1, '#000005');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Nebulas
      for (const n of nebulas) drawNebula(n, t);

      // Sun + planets (slight screen-shake to fake energy)
      const shake = 1 + Math.sin(t * 0.7) * 0.4;
      const sunX = width / 2 + Math.sin(t * 0.13) * 6 * shake;
      const sunY = height / 2 + Math.cos(t * 0.11) * 4 * shake;
      for (const p of planets) drawPlanet(p, t, sunX, sunY);
      drawSun(sunX, sunY, t);

      // Stars — twinkle = 0.55..1.0 alpha on a sine phase.
      for (const s of stars) {
        const tw = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed));
        ctx.fillStyle = `hsla(${s.hue}, 30%, 92%, ${tw.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vignette — soft dark ring at the very edges so the
      // page content reads better.
      const vg = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.35,
        width / 2, height / 2, Math.max(width, height) * 0.75,
      );
      vg.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vg.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, width, height);

      raf = requestAnimationFrame(draw);
      // `dt` is available if we ever want frame-rate aware
      // animations; the current scene is purely time-based.
      void dt;
    };

    resize();
    raf = requestAnimationFrame(draw);
    // ResizeObserver catches both window resizes AND parent
    // container resizes (e.g. when the messenger panel
    // changes height because the user opened a thread). It
    // fires once on observe so we don't need a separate
    // initial resize call.
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      // pointer-events: none so the page stays clickable.
      // The wrapper is `fixed inset-0 -z-10` by default so
      // it sits behind every page element regardless of
      // stacking context. When `contained` is set we switch
      // to `absolute inset-0` and drop the negative z-index
      // so the parent panel can decide its own stacking.
      className={
        contained
          ? 'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] bg-[#02020a]'
          : 'pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#02020a]'
      }
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
      />
    </div>
  );
}
