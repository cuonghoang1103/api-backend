'use client';

import { useEffect, useRef } from 'react';

/**
 * requestAnimationFrame game loop that auto-pauses when the tab is hidden or
 * the window loses focus.
 *
 * Why the pause matters: rAF already throttles on hidden tabs, but the delta
 * handed to the callback would still balloon to whatever time passed while the
 * tab was away — a snake would teleport across the board on return. We stop the
 * loop and reset the clock instead, so `dt` is always a real frame delta.
 *
 * `dt` is delivered in seconds and clamped to 100ms so a slow frame can't
 * tunnel objects through walls.
 */
export function useGameLoop(
  callback: (dt: number, elapsed: number) => void,
  running: boolean,
) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;

    let active = true;
    startRef.current = performance.now();
    lastRef.current = startRef.current;

    const frame = (now: number) => {
      if (!active) return;
      const dt = Math.min(0.1, (now - lastRef.current) / 1000);
      lastRef.current = now;
      cbRef.current(dt, (now - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    // Tab hidden / window blurred → stop burning frames and reset the clock so
    // the first frame back is a normal delta, not a multi-second jump.
    const onVisibility = () => {
      if (document.hidden) {
        active = false;
        cancelAnimationFrame(rafRef.current);
      } else if (!active) {
        active = true;
        lastRef.current = performance.now();
        rafRef.current = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [running]);
}
