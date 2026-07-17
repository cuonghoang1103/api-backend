'use client';
/**
 * A one-shot confetti burst.
 *
 * Deliberately NOT canvas-confetti: framer-motion is already a dependency and
 * this is ~40 divs that run once and unmount. A new package for that would have
 * to earn its place in the Docker build, and it would not.
 *
 * Fires once per mount and never loops — remount it (change `key`) to fire
 * again. Respects reduced motion by rendering nothing: confetti is pure
 * celebration, so removing it costs the user nothing but the noise.
 */
import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const COLORS = ['#58CC02', '#FFC800', '#7F56E6', '#22D3EE', '#EC4899', '#F97316'];

export function Confetti({ count = 40 }: { count?: number }) {
  const reduce = useReducedMotion();

  // Positions are frozen on mount: recomputing them on a re-render would
  // teleport every piece mid-flight.
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        // Spread across the width, biased away from the exact centre so the
        // mascot underneath stays visible.
        x: (i / count) * 100 + (Math.random() * 6 - 3),
        delay: Math.random() * 0.25,
        duration: 1.8 + Math.random() * 1.2,
        drift: Math.random() * 120 - 60,
        rotate: Math.random() * 720 - 360,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 6,
        round: Math.random() > 0.5,
      })),
    [count],
  );

  if (reduce) return null;

  return (
    // pointer-events-none is load-bearing: this covers the whole celebration
    // screen, including the "Tiếp tục" button underneath it.
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute top-0"
          style={{
            left: `${b.x}%`,
            width: b.size,
            height: b.size * (b.round ? 1 : 1.6),
            background: b.color,
            borderRadius: b.round ? '50%' : 2,
          }}
          initial={{ y: '-10%', opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', x: b.drift, rotate: b.rotate, opacity: [1, 1, 0] }}
          transition={{ duration: b.duration, delay: b.delay, ease: 'easeIn', times: [0, 0.75, 1] }}
        />
      ))}
    </div>
  );
}
