'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  trail: { x: number; y: number }[];
  maxTrail: number;
  life: number;
  maxLife: number;
}

interface Pixel {
  x: number;
  y: number;
  vy: number;
  size: number;
  hue: number;
  opacity: number;
  char: string;
}

const PIXEL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*?!<>[]{}';

export default function GamesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pixelsRef = useRef<Pixel[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 40;
    const PIXEL_COUNT = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    function init() {
      const w = canvas.width;
      const h = canvas.height;
      const hues = [340, 260, 190, 45, 280, 170];

      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 1,
        hue: hues[Math.floor(Math.random() * hues.length)],
        trail: [],
        maxTrail: Math.floor(Math.random() * 12) + 5,
        life: 1,
        maxLife: Math.random() * 0.002 + 0.001,
      }));

      pixelsRef.current = Array.from({ length: PIXEL_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h - h,
        vy: Math.random() * 2 + 0.5,
        size: Math.random() * 10 + 6,
        hue: hues[Math.floor(Math.random() * hues.length)],
        opacity: Math.random() * 0.5 + 0.2,
        char: PIXEL_CHARS[Math.floor(Math.random() * PIXEL_CHARS.length)],
      }));
    }

    let lastTime = 0;
    function draw(ts: number) {
      const dt = Math.min(ts - lastTime, 50);
      lastTime = ts;

      const w = canvas.width;
      const h = canvas.height;

      // Trail / fade effect
      ctx.fillStyle = 'rgba(2, 1, 10, 0.08)';
      ctx.fillRect(0, 0, w, h);

      // Draw pixel characters falling
      ctx.save();
      ctx.font = '14px JetBrains Mono, monospace';
      for (const px of pixelsRef.current) {
        ctx.save();
        ctx.globalAlpha = px.opacity;
        ctx.fillStyle = `hsl(${px.hue}, 80%, 55%)`;
        ctx.shadowColor = `hsl(${px.hue}, 80%, 55%)`;
        ctx.shadowBlur = 6;
        ctx.fillText(px.char, px.x, px.y);
        ctx.restore();

        px.y += px.vy * (dt / 16);
        px.x += Math.sin(px.y * 0.01) * 0.3;

        if (px.y > h + 20) {
          px.y = -20;
          px.x = Math.random() * w;
          px.char = PIXEL_CHARS[Math.floor(Math.random() * PIXEL_CHARS.length)];
        }
      }
      ctx.restore();

      // Draw particles with trails
      for (const p of particlesRef.current) {
        // Draw trail
        for (let i = 0; i < p.trail.length; i++) {
          const t = p.trail[i];
          const alpha = (i / p.trail.length) * 0.4 * p.life;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `hsl(${p.hue}, 80%, 55%)`;
          ctx.beginPath();
          ctx.arc(t.x, t.y, p.size * (i / p.trail.length) * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Add current pos to trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.maxTrail) p.trail.shift();

        // Glow
        ctx.save();
        ctx.globalAlpha = p.life;
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        glowGrad.addColorStop(0, `hsla(${p.hue}, 90%, 65%, 1)`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsl(${p.hue}, 90%, 80%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Update
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.life -= p.maxLife;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        if (p.life <= 0 || p.x < 0 || p.x > w) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.life = 1;
          p.vx = (Math.random() - 0.5) * 1.5;
          p.vy = (Math.random() - 0.5) * 1.5;
          p.trail = [];
          p.hue = [340, 260, 190, 45, 280, 170][Math.floor(Math.random() * 6)];
        }
      }

      // Draw connection lines between close particles
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

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
