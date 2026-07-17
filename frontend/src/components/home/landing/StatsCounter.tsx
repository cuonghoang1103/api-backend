'use client';

/**
 * Real-number strip that counts up when it scrolls into view (rive/agency-style
 * social proof). Numbers are the platform's own, kept conservative/round so they
 * never overstate. Reduced-motion: shows the final numbers immediately.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/useIsTouch';

interface Stat { value: number; suffix?: string; label: string; }

const STATS: Stat[] = [
  { value: 3, label: 'Languages · EN · JA · ZH' },
  { value: 8000, suffix: '+', label: 'Interview questions' },
  { value: 4000, suffix: '+', label: 'Kanji & Hanzi taught' },
  { value: 12, suffix: '+', label: 'Modules & tools' },
];

function useCountUp(target: number, run: boolean, ms = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const start = 0;
    const steps = 40;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      const t = i / steps;
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setN(Math.round(start + (target - start) * eased));
      if (i >= steps) clearInterval(id);
    }, ms / steps);
    return () => clearInterval(id);
  }, [target, run, ms]);
  return n;
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : String(n);
}

function StatItem({ s, run }: { s: Stat; run: boolean }) {
  const n = useCountUp(s.value, run);
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-4xl font-extrabold tabular-nums text-transparent sm:text-5xl">
        {run ? fmt(n) : '0'}{s.suffix ?? ''}
      </div>
      <div className="mt-1.5 text-xs uppercase tracking-wide text-slate-400 sm:text-sm">{s.label}</div>
    </div>
  );
}

export default function StatsCounter() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(reduced);

  useEffect(() => {
    if (reduced) { setRun(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <motion.div
      ref={ref}
      className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-4 py-4 sm:grid-cols-4"
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      {STATS.map((s) => <StatItem key={s.label} s={s} run={run} />)}
    </motion.div>
  );
}
