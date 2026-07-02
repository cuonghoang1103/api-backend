'use client';

import { useEffect, useRef } from 'react';

export default function CyberCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Skip entirely on touch / no-fine-pointer devices (no custom cursor
    // is shown there anyway) and when the user prefers reduced motion.
    // This removes the global per-frame rAF tax on mobile and for
    // reduced-motion users — desktop pointer users are unaffected.
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;
    let rafId = 0;
    let isHovering = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      ringX = lerp(ringX, dotX, 0.12);
      ringY = lerp(ringY, dotY, 0.12);
      ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(${isHovering ? 1.6 : 1})`;
      // Once the trailing ring has caught up to the cursor, stop the
      // loop — it restarts on the next move/hover change. An idle mouse
      // now costs zero rAF instead of running forever. Visuals identical.
      if (Math.abs(ringX - dotX) < 0.1 && Math.abs(ringY - dotY) < 0.1) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(loop);
    };
    const kick = () => { if (!rafId) rafId = requestAnimationFrame(loop); };

    const onMouseMove = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
      dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      kick();
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        isHovering = true;
        ring.style.borderColor = '#ec4899';
        kick();
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        isHovering = false;
        ring.style.borderColor = '#8B5CF6';
        kick();
      }
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9999] rounded-full border-2 border-violet-500 transition-transform duration-75"
        style={{
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
          boxShadow: '0 0 12px rgba(139,92,246,0.6)',
        }}
      />
      {/* Center dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          background: '#8B5CF6',
          boxShadow: '0 0 8px rgba(139,92,246,0.9)',
        }}
      />
    </>
  );
}
