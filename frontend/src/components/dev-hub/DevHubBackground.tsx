'use client';

import { useEffect, useRef } from 'react';

interface MatrixChar {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
  fadeSpeed: number;
}

interface DataStream {
  x: number;
  chars: MatrixChar[];
  color: string;
  speed: number;
}

export default function DevHubBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    const COLORS = ['#a855f7', '#ec4899', '#22d3ee', '#8b5cf6', '#06b6d4'];
    const STREAMS = 25;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}[]<>/\\|;:,.?!@#$%^&*~+-=';

    function randomChar() {
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    const streams: DataStream[] = [];

    function initStreams() {
      streams.length = 0;
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < STREAMS; i++) {
        const x = Math.random() * w;
        const len = Math.floor(Math.random() * 15) + 5;
        const chars: MatrixChar[] = [];
        for (let j = 0; j < len; j++) {
          chars.push({
            x,
            y: Math.random() * h,
            speed: Math.random() * 2 + 1,
            char: randomChar(),
            opacity: 1,
            fadeSpeed: Math.random() * 0.02 + 0.005,
          });
        }
        streams.push({
          x,
          chars,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          speed: Math.random() * 1.5 + 0.5,
        });
      }
    }

    let lastTime = 0;
    function draw(ts: number) {
      const dt = Math.min(ts - lastTime, 50);
      lastTime = ts;

      const w = canvas.width;
      const h = canvas.height;

      // Clear with trail effect
      ctx.fillStyle = 'rgba(10, 0, 21, 0.08)';
      ctx.fillRect(0, 0, w, h);

      // Draw scanlines
      ctx.fillStyle = 'rgba(139, 92, 246, 0.015)';
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }

      // Draw data streams
      for (const stream of streams) {
        for (const char of stream.chars) {
          ctx.globalAlpha = char.opacity * 0.7;
          ctx.fillStyle = stream.color;
          ctx.font = '12px JetBrains Mono, monospace';
          ctx.fillText(char.char, char.x, char.y);

          char.y += char.speed * (dt / 16);
          char.opacity -= char.fadeSpeed;

          if (char.opacity <= 0 || char.y > h) {
            char.y = 0;
            char.opacity = 1;
            char.char = randomChar();
            char.speed = Math.random() * 2 + 1;
          }
        }

        stream.x += stream.speed * 0.1;
        if (stream.x > w + 50) {
          stream.x = -20;
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    // Touch / coarse-pointer devices (phones, most tablets): paint one static
    // frame and NEVER start the rAF loop — cuts heat/jank on mobile. Desktop
    // (fine pointer) is unaffected.
    const isCoarse =
      typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)')?.matches;

    resize();
    initStreams();

    const onResize = () => { resize(); initStreams(); if (isCoarse) { draw(0); cancelAnimationFrame(rafRef.current); } };
    window.addEventListener('resize', onResize);

    if (isCoarse) {
      draw(0);                              // one static frame
      cancelAnimationFrame(rafRef.current); // ...but don't animate
      return () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener('resize', onResize);
      };
    }

    rafRef.current = requestAnimationFrame(draw);

    // Desktop: pause the loop while the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (!rafRef.current) {
        lastTime = performance.now();
        rafRef.current = requestAnimationFrame(draw);
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
