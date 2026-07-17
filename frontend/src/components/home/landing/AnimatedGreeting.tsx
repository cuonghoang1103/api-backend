'use client';

/**
 * Hero greeting with a typewriter effect: the headline types itself out, the
 * name/brand portion in a gradient, then a soft caret blinks and the subtitle
 * fades in. No mascots — clean and premium. Reduced-motion: full text at once.
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/useIsTouch';

export default function AnimatedGreeting({ head, highlight, sub }: { head: string; highlight: string; sub: string }) {
  const reduced = usePrefersReducedMotion();
  const full = head + highlight;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced) { setN(full.length); return; }
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= full.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [full, reduced]);

  const typedHead = full.slice(0, Math.min(n, head.length));
  const typedHighlight = n > head.length ? full.slice(head.length, n) : '';
  const done = n >= full.length;

  return (
    <div className="relative flex flex-col items-center text-center">
      <h1 className="min-h-[1.15em] text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
        <span>{typedHead}</span>
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">{typedHighlight}</span>
        {!reduced && (
          <span
            aria-hidden
            className={`ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.08em] rounded-full bg-cyan-400 align-middle ${done ? 'lp-caret-blink' : ''}`}
          />
        )}
      </h1>

      <motion.p
        className="mt-5 max-w-2xl text-base text-slate-300/90 sm:text-lg"
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: done ? 1 : 0, y: done ? 0 : 8 }}
        transition={{ duration: 0.5 }}
      >
        {sub}
      </motion.p>

      <style>{`.lp-caret-blink { animation: lp-blink 1s step-end infinite; } @keyframes lp-blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}
