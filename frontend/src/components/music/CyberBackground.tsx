'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLORS = ['#8B5CF6', '#06b6d4', '#ec4899', '#a855f7', '#22d3ee'];
    const PARTICLE_COUNT = 60;

    // Static layers (opaque base fill + grid, and the scanline overlay)
    // never change between frames — only the window size. We paint them
    // ONCE onto offscreen canvases and blit them each frame instead of
    // re-stroking 80 grid lines + hundreds of scanline rects every frame.
    // Pixels are identical; per-frame work drops sharply.
    const baseLayer = document.createElement('canvas');   // #0f172a + grid
    const scanLayer = document.createElement('canvas');   // scanline overlay
    const baseCtx = baseLayer.getContext('2d');
    const scanCtx = scanLayer.getContext('2d');

    const buildStaticLayers = () => {
      baseLayer.width = canvas.width;
      baseLayer.height = canvas.height;
      scanLayer.width = canvas.width;
      scanLayer.height = canvas.height;
      if (baseCtx) {
        baseCtx.fillStyle = '#0f172a';
        baseCtx.fillRect(0, 0, canvas.width, canvas.height);
        const cols = 40;
        const rows = 40;
        const w = canvas.width / cols;
        const h = canvas.height / rows;
        baseCtx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
        baseCtx.lineWidth = 0.5;
        for (let i = 0; i <= cols; i++) {
          baseCtx.beginPath();
          baseCtx.moveTo(i * w, 0);
          baseCtx.lineTo(i * w, canvas.height);
          baseCtx.stroke();
        }
        for (let j = 0; j <= rows; j++) {
          baseCtx.beginPath();
          baseCtx.moveTo(0, j * h);
          baseCtx.lineTo(canvas.width, j * h);
          baseCtx.stroke();
        }
      }
      if (scanCtx) {
        scanCtx.clearRect(0, 0, canvas.width, canvas.height);
        scanCtx.fillStyle = 'rgba(0,0,0,0.03)';
        for (let y = 0; y < canvas.height; y += 4) {
          scanCtx.fillRect(0, y, canvas.width, 2);
        }
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildStaticLayers();
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };
    initParticles();

    const drawGlows = () => {
      const time = Date.now() * 0.001;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Central radial glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(canvas.width, canvas.height) * 0.6);
      grad.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.03)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated orbs
      for (let i = 0; i < 3; i++) {
        const angle = time * 0.2 + (i * Math.PI * 2) / 3;
        const radius = Math.min(canvas.width, canvas.height) * (0.25 + i * 0.08);
        const ox = cx + Math.cos(angle) * radius;
        const oy = cy + Math.sin(angle) * radius;
        const orbGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, 120);
        const colors = ['#8B5CF6', '#06b6d4', '#ec4899'];
        orbGrad.addColorStop(0, colors[i] + '15');
        orbGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(ox, oy, 120, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = () => {
      // Opaque base (fill + grid) blitted from the prebuilt layer —
      // replaces the per-frame clearRect + fill + 80 grid strokes.
      ctx.drawImage(baseLayer, 0, 0);

      drawGlows();

      // Particles
      particlesRef.current.forEach((p, i) => {
        // Update
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Draw connection lines to nearby particles
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // Scanline overlay blitted on top (replaces the per-frame
      // fillRect loop). Same result, one drawImage.
      ctx.drawImage(scanLayer, 0, 0);
      rafRef.current = requestAnimationFrame(draw);
    };

    // Pause the whole loop while the tab is hidden — a background music
    // page shouldn't burn frames when the user isn't looking.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
