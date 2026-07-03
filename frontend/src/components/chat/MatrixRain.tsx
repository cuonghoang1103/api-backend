'use client';

import { useEffect, useRef } from 'react';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

interface Column {
  x: number;
  speed: number;
  chars: string[];
  offset: number;
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // The rain sits at opacity 0.06 — pure ambience. Don't burn battery on
    // phones/tablets or for reduced-motion users: draw one static frame's
    // worth of nothing (transparent canvas) and stop.
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const FONT_SIZE = 12;
    const COLS = Math.floor(canvas.width / FONT_SIZE);

    const columns: Column[] = Array.from({ length: COLS }, (_, i) => ({
      x: i * FONT_SIZE,
      speed: 1 + Math.random() * 3,
      chars: Array.from({ length: 8 + Math.floor(Math.random() * 12) }, () =>
        CHARS[Math.floor(Math.random() * CHARS.length)]
      ),
      offset: Math.random() * canvas.height,
    }));

    let frame: number;
    let lastTime = 0;

    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      if (time - lastTime < 40) return;
      lastTime = time;

      ctx.fillStyle = 'rgba(10, 10, 15, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      columns.forEach((col) => {
        const y = col.offset;
        const fadeIdx = Math.floor(Math.random() * col.chars.length);
        col.chars.forEach((char, i) => {
          const charY = y - i * FONT_SIZE;
          if (charY < 0 || charY > canvas.height) return;

          if (i === fadeIdx) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#22d3ee';
            ctx.shadowBlur = 8;
          } else if (i === fadeIdx - 1) {
            ctx.fillStyle = '#22d3ee';
            ctx.shadowBlur = 4;
          } else {
            ctx.fillStyle = `rgba(34, 211, 238, ${0.3 + (i / col.chars.length) * 0.5})`;
            ctx.shadowBlur = 0;
          }

          ctx.font = `${FONT_SIZE}px "JetBrains Mono", "Fira Code", monospace`;
          ctx.fillText(char, col.x, charY);
        });

        ctx.shadowBlur = 0;
        col.offset += col.speed;
        if (col.offset - col.chars.length * FONT_SIZE > canvas.height) {
          col.offset = 0;
          col.speed = 1 + Math.random() * 3;
        }
      });
    };

    frame = requestAnimationFrame(draw);

    // Pause completely while the tab is hidden.
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (document.visibilityState === 'visible') {
        frame = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.06 }}
    />
  );
}
