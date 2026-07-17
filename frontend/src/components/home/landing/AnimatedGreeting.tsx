'use client';

/**
 * Animated hero greeting: the headline assembles word-by-word (spring), a
 * gradient sweep runs across it, and two little 2D robot mascots hover in from
 * the sides — the playful "robots" touch, done in SVG so it stays light and
 * CSP-safe (no Rive/Lottie runtime, no external asset). Reduced-motion: text
 * appears instantly and the robots stop bobbing.
 */
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/useIsTouch';

function Robot({ hue, flip }: { hue: string; flip?: boolean }) {
  return (
    <svg width="72" height="84" viewBox="0 0 72 84" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <rect x="14" y="2" width="4" height="12" rx="2" fill={hue} />
      <circle cx="16" cy="2" r="3" fill={hue} />
      <rect x="8" y="12" width="56" height="44" rx="14" fill="#12122250" stroke={hue} strokeWidth="2.5" />
      <circle cx="27" cy="32" r="6" fill={hue} />
      <circle cx="45" cy="32" r="6" fill={hue} />
      <circle cx="27" cy="32" r="2.4" fill="#0b0b16" />
      <circle cx="45" cy="32" r="2.4" fill="#0b0b16" />
      <rect x="26" y="44" width="20" height="4" rx="2" fill={hue} opacity="0.7" />
      <rect x="18" y="58" width="36" height="20" rx="8" fill="#12122250" stroke={hue} strokeWidth="2.5" />
      <rect x="2" y="60" width="8" height="4" rx="2" fill={hue} />
      <rect x="62" y="60" width="8" height="4" rx="2" fill={hue} />
    </svg>
  );
}

export default function AnimatedGreeting({ line1, line2 }: { line1: string; line2: string }) {
  const reduced = usePrefersReducedMotion();
  const words = line1.split(' ');

  const bob = (delay: number) =>
    reduced ? {} : { animate: { y: [0, -10, 0] }, transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const, delay } };

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Robots flanking the headline */}
      <motion.div className="absolute -left-4 -top-6 hidden sm:block md:-left-16" initial={reduced ? false : { opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
        <motion.div {...bob(0)}><Robot hue="#a78bfa" /></motion.div>
      </motion.div>
      <motion.div className="absolute -right-4 -top-6 hidden sm:block md:-right-16" initial={reduced ? false : { opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
        <motion.div {...bob(0.6)}><Robot hue="#22d3ee" flip /></motion.div>
      </motion.div>

      {/* Headline — words spring into place one by one */}
      <h1 className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
        {words.map((w, i) => (
          <motion.span
            key={i}
            initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 220, damping: 20 }}
            className={i === words.length - 1 ? 'bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent' : undefined}
          >
            {w}
          </motion.span>
        ))}
      </h1>

      <motion.p
        className="mt-5 max-w-2xl text-base text-slate-300/90 sm:text-lg"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 + words.length * 0.08 + 0.1, duration: 0.5 }}
      >
        {line2}
      </motion.p>
    </div>
  );
}
