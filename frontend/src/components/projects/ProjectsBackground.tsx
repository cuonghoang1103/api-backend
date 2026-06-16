'use client';

import { useEffect, useRef } from 'react';

const CHARS = '01アイウエオカキクケコ{}[]<>/\\|;:,.?!@#$%^&*~+-=▓░█▄▀◆◇●○◎◉⊕⊗∪∩∈∉∝∞√∑∏∫∂∇≡≢≣⊂⊃⊆⊇';

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  opacity: number;
  hue: number;
  fadeSpeed: number;
  bright: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
}

export default function ProjectsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<RainDrop[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    const COLORS = ['#8b5cf6', '#06b6d4', '#22d3ee', '#a855f7', '#6366f1'];
    const DROP_COUNT = 70;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    function makeChars(len: number): string[] {
      return Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]);
    }

    function initDrops() {
      const w = canvas.width;
      const h = canvas.height;
      dropsRef.current = Array.from({ length: DROP_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h - h,
        speed: Math.random() * 3 + 1.5,
        length: Math.floor(Math.random() * 20) + 8,
        chars: makeChars(Math.floor(Math.random() * 20) + 8),
        opacity: Math.random() * 0.7 + 0.3,
        hue: 260 + Math.random() * 40,
        fadeSpeed: Math.random() * 0.02 + 0.008,
        bright: Math.random() < 0.08,
      }));
    }

    function spawnSpark(x: number, y: number) {
      if (sparksRef.current.length > 30) return;
      sparksRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        maxLife: Math.random() * 0.03 + 0.01,
        hue: 260 + Math.random() * 40,
        size: Math.random() * 2 + 1,
      });
    }

    let lastTime = 0;
    function draw(ts: number) {
      const dt = Math.min(ts - lastTime, 50);
      lastTime = ts;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      bg.addColorStop(0, 'rgba(6, 5, 20, 0.97)');
      bg.addColorStop(0.5, 'rgba(3, 2, 10, 0.99)');
      bg.addColorStop(1, 'rgba(1, 1, 5, 1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle grid
      ctx.save();
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.03)';
      ctx.lineWidth = 0.5;
      const CELL = 60;
      for (let x = 0; x <= w; x += CELL) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y <= h; y += CELL) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      ctx.restore();

      // Draw rain drops
      for (const drop of dropsRef.current) {
        for (let i = 0; i < drop.chars.length; i++) {
          const charY = drop.y + i * 16;
          if (charY < 0 || charY > h) continue;

          const fade = i === 0
            ? drop.opacity
            : Math.max(0, drop.opacity * (1 - i / drop.chars.length) * 0.7);

          if (fade < 0.02) continue;

          ctx.save();
          ctx.font = '14px JetBrains Mono, monospace';

          if (i === 0 && drop.bright) {
            ctx.fillStyle = `hsla(180, 80%, 70%, ${fade})`;
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 8;
          } else if (i < 3) {
            ctx.fillStyle = `hsla(${drop.hue}, 80%, 65%, ${fade * 0.9})`;
          } else {
            ctx.fillStyle = `hsla(${drop.hue}, 60%, 45%, ${fade * 0.5})`;
          }

          ctx.fillText(drop.chars[i], drop.x, charY);
          ctx.restore();
        }

        drop.y += drop.speed * (dt / 16);
        drop.opacity -= drop.fadeSpeed;

        // Occasionally change a character
        if (Math.random() < 0.05) {
          const idx = Math.floor(Math.random() * drop.chars.length);
          drop.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        // Reset when faded out
        if (drop.opacity <= 0 || drop.y > h + drop.length * 20) {
          drop.x = Math.random() * w;
          drop.y = -drop.length * 20;
          drop.speed = Math.random() * 3 + 1.5;
          drop.length = Math.floor(Math.random() * 20) + 8;
          drop.chars = makeChars(drop.length);
          drop.opacity = Math.random() * 0.7 + 0.3;
          drop.hue = 260 + Math.random() * 40;
          drop.bright = Math.random() < 0.08;
        }

        // Spawn sparks on bright head
        if (drop.bright && drop.opacity > 0.5 && Math.random() < 0.15) {
          spawnSpark(drop.x, drop.y);
        }
      }

      // Draw sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.maxLife;
        if (s.life <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = s.life;
        ctx.fillStyle = `hsl(${s.hue}, 80%, 70%)`;
        ctx.shadowColor = `hsl(${s.hue}, 80%, 70%)`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Scanline
      ctx.save();
      ctx.globalAlpha = 0.02;
      ctx.fillStyle = '#8b5cf6';
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    initDrops();
    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => { resize(); initDrops(); };
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
