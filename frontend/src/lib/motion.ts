/**
 * My Language — shared motion vocabulary.
 *
 * One place to define what "entering", "pressed" and "popping" mean, so a
 * button on the hub and a node on the path feel like the same product.
 *
 * RULE OF RESTRAINT: at most ONE looping animation in a viewport. The mascot
 * breathes and the current path node pulses — that is the budget. Everything
 * else moves on entrance or on touch, then stops. Ambient motion everywhere
 * reads as noise, and on a phone it is battery.
 *
 * REDUCED MOTION: never branch on it inside a component with an `if`. Call
 * useMotion() once and hand back variants that are already correct — a
 * component that forgets is a component that ignores the OS setting, and the
 * ones that forget are the ones nobody looks at again.
 */
import { useEffect, useState } from 'react';
import { useReducedMotion, type Variants, type Transition } from 'framer-motion';

// ─── Timing ──────────────────────────────────────────────────────
export const EASE_OUT = [0.22, 1, 0.36, 1] as const; // gentle iOS-ish deceleration
export const SPRING_POP: Transition = { type: 'spring', stiffness: 400, damping: 22 };
export const SPRING_SOFT: Transition = { type: 'spring', stiffness: 260, damping: 30 };

// ─── Full-motion variants ────────────────────────────────────────
const pageEnterFull: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT, staggerChildren: 0.05 },
  },
};

const childEnterFull: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
};

const popInFull: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: SPRING_POP },
};

// ─── Reduced-motion variants ─────────────────────────────────────
// Not "no animation": opacity alone still explains that something arrived,
// without any movement to trigger vestibular discomfort. Stagger is kept —
// it is sequencing, not motion.
const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.03 } },
};
const fadeOnlyChild: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

export interface MotionKit {
  reduce: boolean;
  /** Page/section container — stagger its children. */
  pageEnter: Variants;
  /** Direct child of a pageEnter container. */
  childEnter: Variants;
  /** Scale-in with overshoot: badges, checkmarks, combo pills. */
  popIn: Variants;
  /** Spread onto a motion element for hover lift. */
  cardHover: Record<string, unknown>;
  /** Spread onto a motion element for tap feedback. */
  buttonPress: Record<string, unknown>;
  /** Infinite ring pulse — for the ONE current node only. */
  pulseRing: Record<string, unknown>;
  /** Horizontal shake for a wrong answer / locked node. */
  shake: Record<string, unknown>;
}

/**
 * The motion kit for this render, already reduced-motion-correct.
 *
 * `useReducedMotion()` returns null on the server and the real value after
 * hydration, so treat null as "full motion" — matching what SSR painted, which
 * keeps the first frame from jumping.
 */
export function useMotion(): MotionKit {
  const reduce = useReducedMotion() === true;

  if (reduce) {
    return {
      reduce,
      pageEnter: fadeOnly,
      childEnter: fadeOnlyChild,
      popIn: fadeOnlyChild,
      cardHover: {},
      // Still confirm the tap, just without travel — feedback is not decoration.
      buttonPress: { whileTap: { opacity: 0.7 } },
      pulseRing: {},
      shake: {},
    };
  }

  return {
    reduce,
    pageEnter: pageEnterFull,
    childEnter: childEnterFull,
    popIn: popInFull,
    cardHover: { whileHover: { scale: 1.02, y: -2 }, transition: { duration: 0.15 } },
    buttonPress: { whileTap: { scale: 0.97 } },
    pulseRing: {
      animate: { boxShadow: ['0 0 0 0 rgba(255,200,0,.55)', '0 0 0 12px rgba(255,200,0,0)'] },
      transition: { duration: 1.6, repeat: Infinity, ease: 'easeOut' },
    },
    // Small and quick: a wrong answer should feel like a nudge, not a rejection.
    shake: {
      animate: { x: [0, -6, 6, -4, 4, 0] },
      transition: { duration: 0.35 },
    },
  };
}

/**
 * Count a number up on mount.
 *
 * Reduced motion starts AT the target — no flash of 0 before the effect runs,
 * and nothing moves.
 */
export function useCountUp(target: number, durationMs = 800): number {
  const reduce = useReducedMotion() === true;
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (reduce || target <= 0) { setValue(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / durationMs);
      // easeOutCubic — fast, then settling, so the last digits stay readable.
      setValue(Math.round(target * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    // Start from 0 here, not in useState: the server renders the real number,
    // so the markup is correct for no-JS and for the first paint, and only a
    // hydrated browser ever sees it count.
    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, reduce]);

  return value;
}
