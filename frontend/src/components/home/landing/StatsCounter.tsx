'use client';

/**
 * Landing stats — the same premium card treatment as the About page's
 * StatsSection (bordered glass card, accent icon chip, gradient count-up number,
 * animated telemetry background, hover glow) but with this platform's own
 * numbers and English labels. Always-dark styling (no theme vars) since the
 * landing is always dark. Reduced-motion still shows the final numbers.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Languages, Briefcase, PenLine, LayoutGrid } from 'lucide-react';

interface Stat { icon: typeof Languages; value: number; suffix: string; label: string; glow: string; }

const STATS: Stat[] = [
  { icon: Languages, value: 3, suffix: '', label: 'Languages · EN · JA · ZH', glow: '#22d3ee' },
  { icon: Briefcase, value: 8, suffix: 'k+', label: 'Interview questions', glow: '#a855f7' },
  { icon: PenLine, value: 4, suffix: 'k+', label: 'Kanji & Hanzi taught', glow: '#d946ef' },
  { icon: LayoutGrid, value: 12, suffix: '+', label: 'Modules & tools', glow: '#818cf8' },
];

function Counter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const inc = value / (1600 / 16);
    const id = setInterval(() => {
      start += inc;
      if (start >= value) { setN(value); clearInterval(id); } else setN(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [inView, value]);
  return <span className="tabular-nums">{n}{suffix}</span>;
}

// Animated micro-visual per card (mesh / bars / led nodes / radar), currentColor.
function TelemetryBg({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 240 120" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => <line key={`h${i}`} x1="0" y1={i * 28 + 10} x2="240" y2={i * 28 + 10} stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,5" />)}
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={16 + (i % 5) * 48} cy={10 + Math.floor(i / 5) * 28} r="1.5" fill="currentColor" />)}
      </svg>
    );
  }
  if (index === 1) {
    return (
      <div className="absolute inset-0 flex items-end justify-center gap-1 overflow-hidden px-4 pb-3 opacity-[0.08]" aria-hidden>
        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
          <motion.div key={i} className="w-3 rounded-t-sm" style={{ height: `${h}%`, background: 'currentColor' }}
            animate={{ height: [`${h * 0.6}%`, `${h}%`, `${h * 0.8}%`] }}
            transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }} />
        ))}
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-[0.12]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="relative flex items-center justify-center" style={{ width: 12, height: 12 }}>
            <motion.div className="absolute rounded-full" style={{ width: 12, height: 12, background: 'currentColor' }}
              animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }} />
            <div className="relative rounded-full" style={{ width: 5, height: 5, background: 'currentColor' }} />
          </motion.div>
        ))}
      </div>
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.07]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="absolute rounded-full border" style={{ width: 20, height: 20, borderColor: 'currentColor' }}
          animate={{ scale: [1, 5 + i * 2], opacity: [0.8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 1.0, ease: 'easeOut' }} />
      ))}
    </div>
  );
}

function StatCard({ stat, index, inView }: { stat: Stat; index: number; inView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative"
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, ${stat.glow}18 0%, transparent 60%)`, opacity: hover ? 1 : 0 }} aria-hidden />
      <div className="relative overflow-hidden rounded-2xl border p-6"
        style={{ background: 'rgba(13,11,23,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderColor: hover ? `${stat.glow}50` : 'rgba(255,255,255,0.06)', transition: 'border-color 0.3s ease' }}>
        <div className="pointer-events-none absolute inset-0" style={{ color: stat.glow }} aria-hidden><TelemetryBg index={index} /></div>
        <div className="absolute left-0 right-0 top-0 h-px rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${stat.glow}, transparent)`, opacity: hover ? 1 : 0.5 }} aria-hidden />

        <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: `linear-gradient(135deg, ${stat.glow}20, ${stat.glow}08)`, boxShadow: hover ? `0 0 20px ${stat.glow}30` : 'none' }}>
          <stat.icon className="h-5 w-5" style={{ color: stat.glow }} strokeWidth={1.5} />
        </div>

        <div className="relative mb-2 text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ background: `linear-gradient(135deg, ${stat.glow}, ${stat.glow}80)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: hover ? `drop-shadow(0 0 8px ${stat.glow}60)` : 'none', transition: 'filter 0.3s ease' }}>
          <Counter value={stat.value} suffix={stat.suffix} inView={inView} />
        </div>
        <p className="relative text-sm leading-relaxed text-slate-400">{stat.label}</p>
      </div>
    </motion.div>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} inView={inView} />)}
      </div>
    </div>
  );
}
