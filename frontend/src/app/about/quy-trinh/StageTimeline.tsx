'use client';

/**
 * Dòng thời gian dọc của 15 giai đoạn — thẻ hiện dần khi cuộn, nghiêng theo
 * chuột (tilt 3D). Tilt chỉ bật với chuột thật (`pointerType === 'mouse'`) và
 * khi không bật `prefers-reduced-motion`; trên cảm ứng thẻ đứng yên.
 */
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { phaseOf, pick, stageHref, STAGE_PAGES_ENABLED, type Stage } from './data';
import { LearnChips } from './StageDetail';

interface Props {
  stages: Stage[];
  lang: 'vi' | 'en';
  reduced: boolean;
  onOpen: (n: number) => void;
}

export default function StageTimeline({ stages, lang, reduced, onOpen }: Props) {
  return (
    <ol className="relative">
      {/* Trục */}
      <span
        aria-hidden
        className="absolute left-[19px] sm:left-[23px] top-2 bottom-2 w-0.5 rounded-full"
        style={{
          background:
            'linear-gradient(180deg, #6366f1, #8b5cf6 18%, #d946ef 32%, #0ea5e9 48%, #f43f5e 64%, #10b981 80%, #f59e0b)',
          opacity: 0.55,
        }}
      />
      {stages.map((s) => (
        <TimelineItem key={s.slug} stage={s} lang={lang} reduced={reduced} onOpen={onOpen} />
      ))}
    </ol>
  );
}

function TimelineItem({
  stage: s,
  lang,
  reduced,
  onOpen,
}: {
  stage: Stage;
  lang: 'vi' | 'en';
  reduced: boolean;
  onOpen: (n: number) => void;
}) {
  const color = phaseOf(s.phase).color;
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.li
      className="relative pl-12 sm:pl-16 pb-6 last:pb-0"
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <span
        className="absolute left-0 top-3 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-heading font-bold text-white tabular-nums text-sm sm:text-base"
        style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, #000))`, boxShadow: `0 6px 18px -6px ${color}` }}
      >
        {String(s.n).padStart(2, '0')}
      </span>

      <div style={{ perspective: 1000 }}>
        <motion.div
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={{
            rotateX: reduced ? 0 : rx,
            rotateY: reduced ? 0 : ry,
            borderColor: 'var(--border-color)',
            background: 'var(--bg-card)',
          }}
          className="relative rounded-2xl border p-4 sm:p-6 transition-shadow hover:shadow-xl"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color }}>
              {pick(phaseOf(s.phase).label, lang)}
            </span>
            <span className="text-[11px] text-text-muted">· {pick(s.short, lang)}</span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-text-primary">{pick(s.title, lang)}</h3>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">{pick(s.goal, lang)}</p>

          <div className="mt-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-text-primary mb-2">
              <FileText className="w-3.5 h-3.5" style={{ color }} /> {L('Bàn giao', 'Deliverables')}
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {s.deliverables.map((d) => (
                <li
                  key={d[0]}
                  className="px-2 py-1 rounded-md text-[12px] leading-snug text-text-secondary"
                  style={{ background: `color-mix(in srgb, ${color} 9%, var(--bg-surface))` }}
                >
                  {pick(d, lang)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <LearnChips links={s.learn} lang={lang} />
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => onOpen(s.n)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color }}
            >
              {L('Hoạt động, tiêu chuẩn, cổng chất lượng', 'Activities, standards, quality gate')} <ArrowRight className="w-4 h-4" />
            </button>
            {STAGE_PAGES_ENABLED && (
              <Link href={stageHref(s)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
                {L('Xem chi tiết', 'Full details')} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </motion.li>
  );
}
