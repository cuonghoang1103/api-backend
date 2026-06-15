'use client';

import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  hue: number;
  opacity: number;
  wobblePhase: number;
  wobbleSpeed: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  hue: number;
  lineWidth: number;
}

interface Wisp {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  opacity: number;
  phase: number;
}

export default function SocialBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const wispsRef = useRef<Wisp[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Re-bind to local consts the closure can use without TS
    // re-narrowing across nested function declarations.
    const cv = canvas;
    const cx = ctx;

    const BUBBLE_COUNT = 18;
    const WISP_COUNT = 20;

    const resize = () => {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    };

    function init() {
      const w = cv.width;
      const h = cv.height;
      const hues = ['#8b5cf6', '#06b6d4', '#22d3ee', '#a855f7', '#ec4899', '#6366f1'];

      bubblesRef.current = Array.from({ length: BUBBLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 60 + 20,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        hue: parseInt(hues[Math.floor(Math.random() * hues.length)].replace('#', ''), 16),
        opacity: Math.random() * 0.06 + 0.01,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.01 + 0.003,
      }));

      wispsRef.current = Array.from({ length: WISP_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 80 + 30,
        hue: [270, 200, 320, 180][Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.04 + 0.01,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    let lastTime = 0;
    function draw(ts: number) {
      const dt = Math.min(ts - lastTime, 50);
      lastTime = ts;
      timeRef.current += 0.005;

      const w = cv.width;
      const h = cv.height;

      cx.clearRect(0, 0, w, h);

      // Background gradient
      const bg = cx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.7);
      bg.addColorStop(0, 'rgba(3, 2, 12, 0.97)');
      bg.addColorStop(0.5, 'rgba(2, 1, 8, 0.99)');
      bg.addColorStop(1, 'rgba(1, 1, 3, 1)');
      cx.fillStyle = bg;
      cx.fillRect(0, 0, w, h);

      // Draw wisps (soft glowing blobs)
      for (const wisp of wispsRef.current) {
        wisp.phase += 0.01;
        const offsetX = Math.sin(wisp.phase) * 30;
        const offsetY = Math.cos(wisp.phase * 0.7) * 20;

        cx.save();
        cx.globalAlpha = wisp.opacity;
        const grad = cx.createRadialGradient(
          wisp.x + offsetX, wisp.y + offsetY, 0,
          wisp.x + offsetX, wisp.y + offsetY, wisp.size
        );
        grad.addColorStop(0, `hsla(${wisp.hue}, 70%, 50%, 1)`);
        grad.addColorStop(0.5, `hsla(${wisp.hue}, 60%, 40%, 0.5)`);
        grad.addColorStop(1, 'transparent');
        cx.fillStyle = grad;
        cx.beginPath();
        cx.ellipse(
          wisp.x + offsetX, wisp.y + offsetY,
          wisp.size, wisp.size * 0.6, wisp.phase * 0.3, 0, Math.PI * 2
        );
        cx.fill();
        cx.restore();

        // Update
        wisp.x += wisp.vx * (dt / 16);
        wisp.y += wisp.vy * (dt / 16);
        if (wisp.x < -wisp.size) wisp.x = w + wisp.size;
        if (wisp.x > w + wisp.size) wisp.x = -wisp.size;
        if (wisp.y < -wisp.size) wisp.y = h + wisp.size;
        if (wisp.y > h + wisp.size) wisp.y = -wisp.size;
      }

      // Draw ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += 1.5;
        r.opacity -= 0.008;
        if (r.opacity <= 0 || r.radius > r.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }
        cx.save();
        cx.globalAlpha = r.opacity;
        cx.strokeStyle = `hsl(${r.hue}, 70%, 55%)`;
        cx.lineWidth = r.lineWidth;
        cx.shadowColor = `hsl(${r.hue}, 70%, 55%)`;
        cx.shadowBlur = 4;
        cx.beginPath();
        cx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        cx.stroke();
        cx.restore();
      }

      // Draw bubbles
      for (const bubble of bubblesRef.current) {
        bubble.wobblePhase += bubble.wobbleSpeed;

        const hueInt = typeof bubble.hue === 'string' ? parseInt(bubble.hue, 16) : bubble.hue;
        const r = (hueInt >> 16) & 255;
        const g = (hueInt >> 8) & 255;
        const b = hueInt & 255;
        const color = `rgb(${r},${g},${b})`;

        cx.save();
        cx.globalAlpha = bubble.opacity;

        // Outer glow
        const glowGrad = cx.createRadialGradient(
          bubble.x, bubble.y, bubble.radius * 0.5,
          bubble.x, bubble.y, bubble.radius * 1.8
        );
        glowGrad.addColorStop(0, `rgba(${r},${g},${b}, 0.4)`);
        glowGrad.addColorStop(0.5, `rgba(${r},${g},${b}, 0.15)`);
        glowGrad.addColorStop(1, 'transparent');
        cx.fillStyle = glowGrad;
        cx.beginPath();
        cx.arc(bubble.x, bubble.y, bubble.radius * 1.8, 0, Math.PI * 2);
        cx.fill();

        // Bubble outline
        cx.strokeStyle = `rgba(${r},${g},${b}, ${bubble.opacity * 2})`;
        cx.lineWidth = 1;
        cx.shadowColor = color;
        cx.shadowBlur = 8;
        cx.beginPath();
        cx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        cx.stroke();

        // Inner highlight
        const hlGrad = cx.createRadialGradient(
          bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, 0,
          bubble.x, bubble.y, bubble.radius
        );
        hlGrad.addColorStop(0, `rgba(255,255,255, ${bubble.opacity * 0.8})`);
        hlGrad.addColorStop(0.3, `rgba(255,255,255, ${bubble.opacity * 0.2})`);
        hlGrad.addColorStop(1, 'transparent');
        cx.fillStyle = hlGrad;
        cx.beginPath();
        cx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        cx.fill();

        cx.restore();

        // Update
        bubble.x += bubble.vx * (dt / 16);
        bubble.y += bubble.vy * (dt / 16);
        if (bubble.x < -bubble.radius * 2) bubble.x = w + bubble.radius * 2;
        if (bubble.x > w + bubble.radius * 2) bubble.x = -bubble.radius * 2;
        if (bubble.y < -bubble.radius * 2) bubble.y = h + bubble.radius * 2;
        if (bubble.y > h + bubble.radius * 2) bubble.y = -bubble.radius * 2;

        // Spawn ripple occasionally
        if (Math.random() < 0.002) {
          ripplesRef.current.push({
            x: bubble.x,
            y: bubble.y,
            radius: bubble.radius,
            maxRadius: bubble.radius + 50,
            opacity: 0.3,
            hue: 260,
            lineWidth: 1,
          });
        }
      }

      // Floating particles
      cx.save();
      for (let i = 0; i < 30; i++) {
        const px = ((timeRef.current * 20 + i * 47) % w);
        const py = ((Math.sin(timeRef.current + i) + 1) / 2 * h);
        cx.globalAlpha = 0.1 + Math.sin(timeRef.current * 2 + i) * 0.05;
        cx.fillStyle = ['#8b5cf6', '#06b6d4', '#22d3ee'][i % 3];
        cx.beginPath();
        cx.arc(px, py, 1, 0, Math.PI * 2);
        cx.fill();
      }
      cx.restore();

      // Vignette
      const vig = cx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, Math.max(w, h) * 0.75);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.5)');
      cx.fillStyle = vig;
      cx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    init();
    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => { resize(); init(); };
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
    />
  );
}
