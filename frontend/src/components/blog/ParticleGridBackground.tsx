'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface FloatingOrb {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  color: string;
}

export default function ParticleGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const orbsRef = useRef<FloatingOrb[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gridCanvas = gridRef.current!;
    if (!canvas || !gridCanvas) return;
    const ctx = canvas.getContext('2d')!;
    const gridCtx = gridCanvas.getContext('2d')!;
    if (!ctx || !gridCtx) return;

    const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#a855f7', '#22d3ee'];
    const PARTICLE_COUNT = 80;
    const ORB_COUNT = 4;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      gridCanvas.width = w;
      gridCanvas.height = h;

      ctx.clearRect(0, 0, w, h);
      gridCtx.clearRect(0, 0, w, h);
      drawGrid();
    };

    function drawGrid() {
      if (!gridCtx || !gridCanvas) return;
      const w = gridCanvas.width;
      const h = gridCanvas.height;
      const CELL = 60;
      gridCtx.clearRect(0, 0, w, h);
      gridCtx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
      gridCtx.lineWidth = 0.5;
      for (let x = 0; x <= w; x += CELL) {
        gridCtx.beginPath();
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, h);
        gridCtx.stroke();
      }
      for (let y = 0; y <= h; y += CELL) {
        gridCtx.beginPath();
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(w, y);
        gridCtx.stroke();
      }
    }

    function initParticles() {
      const w = canvas.width;
      const h = canvas.height;
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));

      orbsRef.current = Array.from({ length: ORB_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 250 + 100,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.08 + 0.02,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function draw() {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw orbs (glowing background blobs)
      for (const orb of orbsRef.current) {
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, `${orb.color}${Math.round(orb.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${orb.color}00`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and update particles
      for (const p of particlesRef.current) {
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      // Draw connection lines between close particles
      ctx.globalAlpha = 0.03;
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function updateOrbs() {
      const w = canvas.width;
      const h = canvas.height;
      for (const orb of orbsRef.current) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.radius) orb.x = w + orb.radius;
        if (orb.x > w + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = h + orb.radius;
        if (orb.y > h + orb.radius) orb.y = -orb.radius;
      }
    }

    function loop() {
      updateOrbs();
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    // Touch / coarse-pointer devices (phones, most tablets): paint one static
    // frame and NEVER start the rAF loop — cuts heat/jank on mobile. Desktop
    // (fine pointer) is unaffected.
    const isCoarse =
      typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)')?.matches;

    resize();
    initParticles();

    const onResize = () => { resize(); initParticles(); if (isCoarse) draw(); };
    window.addEventListener('resize', onResize);

    if (isCoarse) {
      draw(); // one static frame (grid already painted in resize())
      return () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener('resize', onResize);
      };
    }

    loop();

    // Desktop: pause the loop while the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <>
      <canvas
        ref={gridRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
    </>
  );
}
