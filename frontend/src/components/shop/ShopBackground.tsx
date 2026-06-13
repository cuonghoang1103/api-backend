'use client';

import { useEffect, useRef } from 'react';

interface HologramLine {
  x: number;
  y: number;
  width: number;
  hue: number;
  opacity: number;
  speed: number;
  type: 'horizontal' | 'diagonal' | 'scanner';
}

interface GlitchBlock {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
  hue: number;
  decay: number;
}

interface NeonSign {
  x: number;
  y: number;
  chars: string;
  size: number;
  hue: number;
  phase: number;
  flickerSpeed: number;
}

export default function ShopBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<HologramLine[]>([]);
  const glitchRef = useRef<GlitchBlock[]>([]);
  const signsRef = useRef<NeonSign[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    function init() {
      const w = canvas.width;
      const h = canvas.height;
      const LINE_COUNT = 40;
      linesRef.current = Array.from({ length: LINE_COUNT }, () => ({
        x: 0,
        y: Math.random() * h,
        width: Math.random() * w * 0.8 + w * 0.1,
        hue: [170, 190, 200, 280, 320][Math.floor(Math.random() * 5)],
        opacity: Math.random() * 0.3 + 0.05,
        speed: (Math.random() * 0.3 + 0.1) * (Math.random() < 0.5 ? 1 : -1),
        type: (['horizontal', 'diagonal', 'scanner'] as const)[Math.floor(Math.random() * 3)],
      }));

      const SIGNS = ['SHOP', 'NEW', 'SALE', 'AI', 'PRO', 'HOT', 'VIP'];
      signsRef.current = Array.from({ length: 7 }, (_, i) => ({
        x: (i / 7) * w + Math.random() * 60,
        y: Math.random() * h * 0.4 + 50,
        chars: SIGNS[i % SIGNS.length],
        size: Math.random() * 30 + 20,
        hue: [170, 280, 320, 190, 45][i % 5],
        phase: Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.05 + 0.01,
      }));
    }

    let lastTime = 0;
    function draw(ts: number) {
      const dt = Math.min(ts - lastTime, 50);
      lastTime = ts;
      timeRef.current += 0.008;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Deep dark background with subtle warm tint
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.7);
      bg.addColorStop(0, 'rgba(5, 3, 15, 0.97)');
      bg.addColorStop(0.6, 'rgba(3, 2, 10, 0.99)');
      bg.addColorStop(1, 'rgba(1, 1, 5, 1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Holographic grid
      ctx.save();
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.025)';
      ctx.lineWidth = 0.5;
      const CELL = 48;
      for (let x = 0; x <= w; x += CELL) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y <= h; y += CELL) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      ctx.restore();

      // Holographic lines
      for (const line of linesRef.current) {
        if (line.type === 'horizontal') {
          ctx.save();
          const grad = ctx.createLinearGradient(line.x, line.y, line.x + line.width, line.y);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(0.1, `hsla(${line.hue}, 90%, 60%, ${line.opacity})`);
          grad.addColorStop(0.5, `hsla(${line.hue}, 90%, 70%, ${line.opacity * 1.5})`);
          grad.addColorStop(0.9, `hsla(${line.hue}, 90%, 60%, ${line.opacity})`);
          grad.addColorStop(1, 'transparent');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.shadowColor = `hsl(${line.hue}, 90%, 60%)`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(line.x, line.y);
          ctx.lineTo(line.x + line.width, line.y);
          ctx.stroke();
          ctx.restore();

          line.y += line.speed * (dt / 16);
          if (line.y < 0) line.y = h;
          if (line.y > h) line.y = 0;
        } else if (line.type === 'diagonal') {
          ctx.save();
          ctx.strokeStyle = `hsla(${line.hue}, 70%, 50%, ${line.opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(line.x, 0);
          ctx.lineTo(line.x + line.width * 0.3, h);
          ctx.stroke();
          ctx.restore();

          line.x += line.speed * (dt / 16);
          if (line.x < -line.width) line.x = w;
          if (line.x > w + line.width) line.x = -line.width;
        } else {
          // Scanner line
          const scanY = (Math.sin(timeRef.current * 0.5 + line.x * 0.01) + 1) / 2 * h;
          ctx.save();
          const grad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(0.5, `hsla(${line.hue}, 90%, 65%, ${line.opacity * 2})`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fillRect(0, scanY - 2, w, 4);
          ctx.restore();
        }
      }

      // Neon signs
      for (const sign of signsRef.current) {
        const flicker = Math.sin(timeRef.current * sign.flickerSpeed * 100 + sign.phase);
        const visible = flicker > -0.3;
        if (!visible) continue;

        const alpha = (Math.sin(timeRef.current * sign.flickerSpeed * 100 + sign.phase + Math.PI / 2) + 1) / 2 * 0.7 + 0.3;

        ctx.save();
        ctx.font = `bold ${sign.size}px JetBrains Mono, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Outer glow
        ctx.shadowColor = `hsl(${sign.hue}, 90%, 60%)`;
        ctx.shadowBlur = 30 * alpha;
        ctx.fillStyle = `hsla(${sign.hue}, 90%, 65%, ${alpha * 0.5})`;
        ctx.fillText(sign.chars, sign.x, sign.y);

        // Core
        ctx.shadowBlur = 15;
        ctx.fillStyle = `hsl(${sign.hue}, 90%, 85%)`;
        ctx.fillText(sign.chars, sign.x, sign.y);

        ctx.restore();
      }

      // Random glitch blocks
      if (Math.random() < 0.03) {
        glitchRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          w: Math.random() * 120 + 20,
          h: Math.random() * 8 + 2,
          opacity: Math.random() * 0.4 + 0.1,
          hue: Math.random() < 0.5 ? 170 : 280,
          decay: Math.random() * 0.02 + 0.01,
        });
      }

      for (let i = glitchRef.current.length - 1; i >= 0; i--) {
        const g = glitchRef.current[i];
        g.opacity -= g.decay;
        if (g.opacity <= 0) {
          glitchRef.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = g.opacity;
        ctx.fillStyle = `hsl(${g.hue}, 90%, 60%)`;
        ctx.fillRect(g.x, g.y, g.w, g.h);
        ctx.restore();
      }

      // Vignette
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, Math.max(w, h) * 0.8);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

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
