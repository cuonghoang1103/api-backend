'use client';

import { useEffect, useState } from 'react';

/**
 * True on touch / coarse-pointer devices (phones, most tablets).
 *
 * SSR-safe: returns `false` during SSR and the first client render, then
 * updates in an effect — so it never causes a hydration mismatch. Use it
 * to DISABLE heavy always-on animations on mobile (canvas rAF loops,
 * framer `repeat: Infinity`) while leaving desktop untouched.
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: coarse)');
    setIsTouch(mq.matches);
    const onChange = () => setIsTouch(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return isTouch;
}

/** True when the user asked the OS to reduce motion. SSR-safe like above. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

/**
 * Convenience: true when we should suppress heavy decorative animation —
 * either a touch device OR reduced-motion preference.
 */
export function useReduceAnimations(): boolean {
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  return isTouch || reduced;
}
