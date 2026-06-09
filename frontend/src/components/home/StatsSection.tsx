'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, FolderOpen, Cpu, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface StatItem {
  icon: typeof Code2;
  value: number;
  suffix: string;
  labelKey: string;
  color: string;
  glowColor: string;
}

const stats: StatItem[] = [
  { icon: Code2, value: 3, suffix: '+', labelKey: 'stats.yearsExperience', color: 'neon-indigo', glowColor: '#818cf8' },
  { icon: FolderOpen, value: 20, suffix: '+', labelKey: 'stats.projectsDelivered', color: 'neon-violet', glowColor: '#a855f7' },
  { icon: Cpu, value: 15, suffix: '+', labelKey: 'stats.technologiesUsed', color: 'neon-fuchsia', glowColor: '#d946ef' },
  { icon: Users, value: 50, suffix: '+', labelKey: 'stats.happyClients', color: 'neon-cyan', glowColor: '#22d3ee' },
];

// ── Animated count-up ─────────────────────────────────────────────────────────
interface AnimatedCounterProps {
  value: number;
  suffix: string;
  inView: boolean;
}

function AnimatedCounter({ value, suffix, inView }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span className="tabular-nums">
      {displayValue}{suffix}
    </span>
  );
}

// ── Border Beam overlay ───────────────────────────────────────────────────────
function BorderBeam({ color }: { color: string }) {
  return (
    <div
      className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color}30 50%, transparent 100%)`,
          animation: 'borderBeamMove 3s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes borderBeamMove {
          0%, 100% { transform: translateX(-100%) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(200%) rotate(2deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Micro-visual backgrounds ────────────────────────────────────────────────────
function TelemetryBg({ index }: { index: number }) {
  if (index === 0) {
    // Years: dotted timeline mesh
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
        viewBox="0 0 240 120"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h${i}`}
            x1="0" y1={i * 28 + 10} x2="240" y2={i * 28 + 10}
            stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,5"
          />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`v${i}`}
            x1={i * 48} y1="0" x2={i * 48} y2="120"
            stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,5"
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <circle
            key={i}
            cx={16 + (i % 5) * 48}
            cy={10 + Math.floor(i / 5) * 28}
            r="1.5"
            fill="currentColor"
          />
        ))}
      </svg>
    );
  }

  if (index === 1) {
    // Projects: mini bar chart data pulse
    return (
      <div
        className="absolute inset-0 flex items-end justify-center gap-1 px-4 pb-3 pointer-events-none overflow-hidden opacity-[0.08]"
        aria-hidden="true"
      >
        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
          <motion.div
            key={i}
            className="w-3 rounded-t-sm"
            style={{
              height: `${h}%`,
              background: 'currentColor',
            }}
            animate={{ height: [`${h * 0.6}%`, `${h}%`, `${h * 0.8}%`] }}
            transition={{
              duration: 2 + i * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    );
  }

  if (index === 2) {
    // Tech: 3 pulsing micro-led nodes
    return (
      <div
        className="absolute inset-0 flex items-center justify-center gap-6 pointer-events-none opacity-[0.12]"
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="relative flex items-center justify-center"
            style={{ width: 12, height: 12 }}
          >
            {/* Outer pulse ring */}
            <motion.div
              className="absolute rounded-full"
              style={{ width: 12, height: 12, background: 'currentColor' }}
              animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
            />
            {/* Core dot */}
            <div
              className="relative rounded-full"
              style={{ width: 5, height: 5, background: 'currentColor' }}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // index === 3: Radar pulse
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.07]"
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: 20,
            height: 20,
            borderColor: 'currentColor',
          }}
          animate={{ scale: [1, 5 + i * 2], opacity: [0.8, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1.0,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  stat: StatItem;
  index: number;
  inView: boolean;
  isMounted: boolean;
}

function StatCard({ stat, index, inView, isMounted }: StatCardProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="relative group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight radial gradient following cursor */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${stat.glowColor}18 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Outer glow blob on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${stat.glowColor}12 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
          filter: 'blur(20px)',
        }}
        aria-hidden="true"
      />

      <div
        className="relative p-6 rounded-2xl border overflow-hidden"
        style={{
          background: 'rgba(13, 11, 23, 0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: isHovered ? `${stat.glowColor}50` : 'rgba(255,255,255,0.06)',
          transition: 'border-color 0.3s ease',
        }}
      >
        {/* Animated border beam on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
          aria-hidden="true"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <BorderBeam color={stat.glowColor} />
        </motion.div>

        {/* Telemetry micro-visual background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ color: stat.glowColor }}
          aria-hidden="true"
        >
          <TelemetryBg index={index} />
        </div>

        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${stat.glowColor}, transparent)`,
          }}
          animate={{ opacity: isHovered ? 1 : 0.5, scaleX: isHovered ? [0.8, 1, 0.8] : 1 }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
        />

        {/* Icon */}
        <div
          className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${stat.glowColor}20, ${stat.glowColor}08)`,
            boxShadow: isHovered ? `0 0 20px ${stat.glowColor}30` : 'none',
          }}
        >
          <stat.icon className="w-5.5 h-5.5" style={{ color: stat.glowColor }} strokeWidth={1.5} />
        </div>

        {/* Value — neon gradient */}
        {isMounted ? (
          <div
            className="relative text-5xl md:text-5xl font-heading font-bold mb-3 tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${stat.glowColor}, ${stat.glowColor}80)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: isHovered ? `drop-shadow(0 0 8px ${stat.glowColor}60)` : 'none',
              transition: 'filter 0.3s ease',
            }}
          >
            <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
          </div>
        ) : (
          /* SSR / hydration guard: render same dimensions but without gradient */
          <div className="text-5xl md:text-5xl font-heading font-bold mb-3 tracking-tight text-text-muted/40 tabular-nums">
            {stat.value}{stat.suffix}
          </div>
        )}

        {/* Label */}
        <p className="relative text-sm text-text-muted leading-relaxed">
          {t(stat.labelKey)}
        </p>

        {/* Bottom scan line accent */}
        <motion.div
          className="absolute bottom-0 left-0 h-px rounded-b-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${stat.glowColor}80, transparent)`,
            width: '100%',
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────
export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="py-20 border-y border-darkborder relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-indigo/4 via-transparent to-neon-violet/4 pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.labelKey}
              stat={stat}
              index={index}
              inView={isInView}
              isMounted={isMounted}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
