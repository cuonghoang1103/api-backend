'use client';

/**
 * Đường thời gian các giai đoạn, chia theo 7 pha.
 *
 *  · Màn ≥ 768px (và KHÔNG bật giảm chuyển động): đường NGANG gắn theo cuộn —
 *    khối dính (sticky) giữ yên, cuộn dọc tới đâu thì dải thẻ trượt ngang tới
 *    đó; thanh 7 pha ở trên sáng dần theo vị trí.
 *  · Màn hẹp hoặc `prefers-reduced-motion`: danh sách DỌC chia theo pha, thẻ
 *    hiện dần khi cuộn tới (reduced: hiện sẵn).
 *
 * Mỗi giai đoạn là một thẻ dẫn tới /about/quy-trinh/<slug>.
 * Mọi hook đứng trước mọi return (không return sớm trong file này).
 */
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PHASES, phaseOf, pick, stageHref, type Stage } from './data';

interface Props {
  stages: Stage[];
  lang: 'vi' | 'en';
  reduced: boolean;
}

const CARD_W = 300;
const GAP = 20;

export default function PhaseTimeline({ stages, lang, reduced }: Props) {
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);
  const groups = useMemo(
    () => PHASES.map((p) => ({ phase: p, stages: stages.filter((s) => s.phase === p.key) })).filter((g) => g.stages.length > 0),
    [stages],
  );

  // ── Ngang: đo dải thẻ để biết phải trượt bao xa ──
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const measure = () => {
      const v = viewRef.current;
      const t = trackRef.current;
      if (!v || !t) return;
      setDist(Math.max(0, t.scrollWidth - v.clientWidth));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    if (viewRef.current) ro.observe(viewRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [stages.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (p) => -p * dist);
  const [cur, setCur] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.min(stages.length - 1, Math.max(0, Math.round(p * (stages.length - 1))));
    setCur((c) => (c === i ? c : i));
  });
  const curPhase = stages[cur]?.phase;

  return (
    <div>
      {/* ── NGANG (≥ md, không giảm chuyển động) ── */}
      {/* Luôn render (để ref của useScroll luôn có phần tử); giảm chuyển động ⇒ ẩn hẳn. */}
      <div
          ref={sectionRef}
          className={`relative hidden ${reduced ? '' : 'md:block'}`}
          // Chiều cao = một màn + quãng trượt ngang ⇒ cuộn dọc 1px = trượt ngang 1px.
          style={{ height: `calc(100vh - 4rem + ${dist}px)` }}
        >
          <div className="sticky top-16 h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 w-full">
              <PhaseBar groups={groups} total={stages.length} curPhase={curPhase} lang={lang} />
            </div>
            <div ref={viewRef} className="mt-8 w-full max-w-6xl mx-auto px-4">
              <motion.div ref={trackRef} style={{ x }} className="flex items-stretch w-max" >
                {groups.map((g, gi) => (
                  <div key={g.phase.key} className="flex items-stretch" style={{ marginLeft: gi === 0 ? 0 : GAP * 2 }}>
                    <div className="flex flex-col justify-start pr-4 w-[7.5rem] shrink-0 border-l-2 pl-4" style={{ borderColor: g.phase.color }}>
                      <span className="text-[0.75rem] text-[color:var(--s-muted)] tabular-nums">
                        {L('Pha', 'Phase')} {gi + 1}
                      </span>
                      <span className="font-editorial text-[1.35rem] leading-tight text-[color:var(--s-ink)]">{pick(g.phase.label, lang)}</span>
                    </div>
                    {g.stages.map((s) => (
                      <div key={s.slug} style={{ width: CARD_W, marginLeft: GAP }} className="shrink-0">
                        <StageCard stage={s} lang={lang} highlight={s.n === cur} />
                      </div>
                    ))}
                  </div>
                ))}
                <div className="shrink-0 w-8" aria-hidden />
              </motion.div>
            </div>
            <p className="max-w-6xl mx-auto px-4 w-full mt-6 text-[0.8rem] text-[color:var(--s-muted)]">
              {L('Cuộn xuống để đi tiếp theo trình tự. Bấm một thẻ để mở tài liệu của giai đoạn.', 'Keep scrolling to move through the sequence. Click a card to open its stage document.')}
            </p>
          </div>
      </div>

      {/* ── DỌC (màn hẹp, hoặc giảm chuyển động ở mọi cỡ) ── */}
      <div className={`${reduced ? '' : 'md:hidden'} max-w-6xl mx-auto px-4`}>
        <ol className="space-y-12">
          {groups.map((g, gi) => (
            <li key={g.phase.key}>
              <div className="flex items-baseline gap-3 border-b border-[color:var(--s-line)] pb-3">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 self-center" style={{ background: g.phase.color }} />
                <span className="font-editorial text-[1.4rem] text-[color:var(--s-ink)]">{pick(g.phase.label, lang)}</span>
                <span className="ml-auto text-[0.75rem] text-[color:var(--s-muted)] tabular-nums">
                  {L('Pha', 'Phase')} {gi + 1}/{groups.length}
                </span>
              </div>
              <ol className={`mt-5 grid gap-4 ${reduced ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
                {g.stages.map((s, i) => (
                  <motion.li
                    key={s.slug}
                    initial={reduced ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.2) }}
                  >
                    <StageCard stage={s} lang={lang} />
                  </motion.li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function PhaseBar({
  groups,
  total,
  curPhase,
  lang,
}: {
  groups: { phase: (typeof PHASES)[number]; stages: Stage[] }[];
  total: number;
  curPhase?: string;
  lang: 'vi' | 'en';
}) {
  const curIdx = groups.findIndex((g) => g.phase.key === curPhase);
  return (
    <ol className="flex gap-1.5" aria-label={lang === 'en' ? 'Phases' : 'Các pha'}>
      {groups.map((g, i) => {
        const on = i === curIdx;
        const past = i < curIdx;
        return (
          <li key={g.phase.key} className="min-w-0" style={{ flex: `${g.stages.length} 1 0` }} aria-current={on ? 'step' : undefined}>
            <span
              className="block h-1 rounded-full transition-colors duration-300"
              style={{ background: on || past ? g.phase.color : 'var(--s-line)' }}
            />
            <span
              className={`mt-2 block truncate text-[0.78rem] transition-colors ${on ? 'font-semibold text-[color:var(--s-ink)]' : 'text-[color:var(--s-muted)]'}`}
            >
              {pick(g.phase.label, lang)}
              <span className="ml-1 tabular-nums opacity-70">({g.stages.length}/{total})</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StageCard({ stage: s, lang, highlight }: { stage: Stage; lang: 'vi' | 'en'; highlight?: boolean }) {
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);
  const color = phaseOf(s.phase).color;
  const nTpl = s.templates?.length ?? 0;
  return (
    <Link
      href={stageHref(s)}
      className={`group flex h-full flex-col rounded-xl border bg-[var(--s-raise)] p-5 transition-colors ${
        highlight ? 'border-[color:var(--s-ink)]' : 'border-[color:var(--s-line)] hover:border-[color:var(--s-line-strong)]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-editorial text-[1.6rem] leading-none text-[color:var(--s-ink)] tabular-nums">
          {String(s.n).padStart(2, '0')}
        </span>
        <span className="h-1 w-8 rounded-full" style={{ background: color }} aria-hidden />
      </div>
      <h3 className="mt-4 font-heading text-[1.02rem] font-semibold leading-snug text-[color:var(--s-ink)]">{pick(s.title, lang)}</h3>
      <p className="mt-1 text-[0.8rem] text-[color:var(--s-muted)]">{pick(s.short, lang)}</p>
      <p className="mt-3 text-[0.875rem] leading-relaxed text-[color:var(--s-body)] line-clamp-4">{pick(s.goal, lang)}</p>
      <div className="mt-auto pt-4 flex items-end justify-between gap-3">
        <p className="text-[0.75rem] text-[color:var(--s-muted)]">
          {L(`${s.deliverables.length} đầu ra`, `${s.deliverables.length} deliverables`)}
          {nTpl > 0 && <>{' · '}{L(`${nTpl} mẫu tài liệu`, `${nTpl} templates`)}</>}
        </p>
        <ArrowRight className="w-4 h-4 shrink-0 text-[color:var(--s-accent)] transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
