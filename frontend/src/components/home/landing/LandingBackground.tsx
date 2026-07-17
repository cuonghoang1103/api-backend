'use client';

/**
 * Dark, gently animated backdrop for the landing page. Not pitch-black like
 * rive.app — a deep navy base with three slow-drifting colour blobs and a faint
 * grid, so it reads as "alive and premium" without pulling focus. Honors
 * prefers-reduced-motion: the blobs sit still (still pretty, just no motion).
 */
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/useIsTouch';

const BLOBS = [
  { color: '#7c3aed', size: 560, top: '-8%', left: '-6%', dur: 22, path: { x: [0, 60, -20, 0], y: [0, -40, 30, 0] } },
  { color: '#06b6d4', size: 520, top: '30%', left: '62%', dur: 26, path: { x: [0, -50, 30, 0], y: [0, 40, -30, 0] } },
  { color: '#ec4899', size: 420, top: '58%', left: '18%', dur: 30, path: { x: [0, 40, -30, 0], y: [0, -30, 40, 0] } },
];

export default function LandingBackground() {
  const reduced = usePrefersReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Deep navy base with a subtle top-down lift so it isn't flat black. */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 100% at 50% -10%, #16162a 0%, #0c0c16 55%, #08080f 100%)' }} />

      {/* Drifting colour blobs. */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size, height: b.size, top: b.top, left: b.left,
            background: b.color, filter: 'blur(120px)', opacity: 0.28,
          }}
          animate={reduced ? undefined : b.path}
          transition={reduced ? undefined : { duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Faint grid for a "engine / product" texture. */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(100% 80% at 50% 0%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(100% 80% at 50% 0%, #000 40%, transparent 100%)',
        }}
      />
    </div>
  );
}
