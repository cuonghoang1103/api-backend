'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  ListChecks,
  ShieldCheck,
  Target,
  Users,
  Wrench,
} from 'lucide-react';
import { phaseOf, pick, stageHref, STAGE_PAGES_ENABLED, type Bi, type LearnLink, type Stage } from './data';

interface Props {
  stages: Stage[];
  selected: number;
  onSelect: (n: number) => void;
  lang: 'vi' | 'en';
  reduced: boolean;
}

/** Bảng chi tiết của giai đoạn đang chọn. */
export default function StageDetail({ stages, selected, onSelect, lang, reduced }: Props) {
  const s = stages[selected];
  const color = phaseOf(s.phase).color;
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);
  const n = stages.length;

  return (
    <div>
      {/* Bộ chọn nhanh 0–14 */}
      <div className="flex flex-wrap gap-2 justify-center mb-6" role="tablist" aria-label={L('Chọn giai đoạn', 'Choose a stage')}>
        {stages.map((st) => {
          const c = phaseOf(st.phase).color;
          const on = st.n === selected;
          return (
            <button
              key={st.slug}
              type="button"
              role="tab"
              aria-selected={on}
              title={pick(st.title, lang)}
              onClick={() => onSelect(st.n)}
              className="w-9 h-9 rounded-xl border text-sm font-semibold tabular-nums transition-all"
              style={{
                borderColor: on ? c : 'var(--border-color)',
                background: on ? c : 'var(--bg-card)',
                color: on ? '#fff' : 'var(--text-secondary)',
                transform: on ? 'translateY(-2px)' : undefined,
                boxShadow: on ? `0 6px 16px -6px ${c}` : undefined,
              }}
            >
              {st.n}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={s.slug}
          role="tabpanel"
          initial={reduced ? false : { opacity: 0, rotateX: -8, y: 16 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, rotateX: 6, y: -10 }}
          transition={{ duration: reduced ? 0.01 : 0.35, ease: 'easeOut' }}
          style={{ transformPerspective: 1200, borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          className="relative rounded-3xl border overflow-hidden"
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 20%, transparent))` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl"
            style={{ background: `color-mix(in srgb, ${color} 16%, transparent)` }}
          />

          <div className="relative p-5 sm:p-8">
            <header className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
              <div
                className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-heading text-2xl font-bold text-white tabular-nums"
                style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, #000))` }}
              >
                {String(s.n).padStart(2, '0')}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-1" style={{ color }}>
                  {L('Giai đoạn', 'Stage')} {s.n}/{n - 1} · {pick(phaseOf(s.phase).label, lang)}
                </p>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
                  {pick(s.title, lang)}
                </h3>
                <p className="mt-3 text-text-secondary leading-relaxed max-w-3xl">{pick(s.goal, lang)}</p>
              </div>
            </header>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Block icon={ListChecks} color={color} title={L('Hoạt động chính', 'Key activities')} items={s.activities} lang={lang} />
              <Block icon={FileText} color={color} title={L('Sản phẩm bàn giao', 'Deliverables')} items={s.deliverables} lang={lang} strong />
              <Block icon={Users} color={color} title={L('Khách hàng tham gia', 'Client involvement')} items={s.client} lang={lang} />
              <section className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: 'var(--border-color)' }}>
                <BlockTitle icon={Wrench} color={color} title={L('Công cụ', 'Tools')} />
                <div className="flex flex-wrap gap-2">
                  {s.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-text-secondary border"
                      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <section className="mt-4 rounded-2xl border p-4 sm:p-5" style={{ borderColor: 'var(--border-color)' }}>
              <BlockTitle icon={ShieldCheck} color={color} title={L('Tiêu chuẩn tham chiếu', 'Reference standards')} />
              <ul className="grid gap-3 sm:grid-cols-2">
                {s.standards.map((st) => (
                  <li key={st.name} className="text-sm">
                    <span className="font-semibold text-text-primary">{st.name}</span>
                    <span className="block text-text-muted">{pick(st.note, lang)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.2fr]">
              <section
                className="rounded-2xl p-4 sm:p-5"
                style={{ background: `color-mix(in srgb, ${color} 10%, var(--bg-card))`, border: `1px solid color-mix(in srgb, ${color} 35%, transparent)` }}
              >
                <BlockTitle icon={ClipboardCheck} color={color} title={L('Cổng chất lượng — điều kiện đi tiếp', 'Quality gate — exit criteria')} />
                <p className="text-sm text-text-primary leading-relaxed">{pick(s.gate, lang)}</p>
              </section>
              <section className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: 'var(--border-color)' }}>
                <BlockTitle icon={BookOpen} color={color} title={L('Học ở đâu trên web', 'Learn it on this site')} />
                <LearnChips links={s.learn} lang={lang} />
              </section>
            </div>

            <footer className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onSelect((selected - 1 + n) % n)}
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
              >
                <ChevronLeft className="w-4 h-4" /> {pick(stages[(selected - 1 + n) % n].title, lang)}
              </button>
              {STAGE_PAGES_ENABLED && (
                <Link href={stageHref(s)} className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color }}>
                  {L('Xem chi tiết', 'Full details')} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <button
                type="button"
                onClick={() => onSelect((selected + 1) % n)}
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary text-right"
              >
                {pick(stages[(selected + 1) % n].title, lang)} <ChevronRight className="w-4 h-4" />
              </button>
            </footer>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}

function BlockTitle({ icon: Icon, color, title }: { icon: typeof Target; color: string; title: string }) {
  return (
    <h4 className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
      <Icon className="w-4 h-4 shrink-0" style={{ color }} />
      {title}
    </h4>
  );
}

function Block({
  icon,
  color,
  title,
  items,
  lang,
  strong,
}: {
  icon: typeof Target;
  color: string;
  title: string;
  items: Bi[];
  lang: 'vi' | 'en';
  strong?: boolean;
}) {
  return (
    <section
      className="rounded-2xl border p-4 sm:p-5"
      style={{
        borderColor: strong ? `color-mix(in srgb, ${color} 40%, var(--border-color))` : 'var(--border-color)',
      }}
    >
      <BlockTitle icon={icon} color={color} title={title} />
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it[0]} className="flex gap-2.5 text-sm text-text-secondary leading-relaxed">
            <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
            <span className={strong ? 'text-text-primary' : undefined}>{pick(it, lang)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LearnChips({ links, lang }: { links: LearnLink[]; lang: 'vi' | 'en' }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium text-text-primary transition-colors hover:border-[color:var(--accent-color)]"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}
        >
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
            style={
              l.kind === 'academy'
                ? { background: 'color-mix(in srgb, #f59e0b 22%, transparent)', color: 'var(--text-primary)' }
                : { background: 'color-mix(in srgb, #6366f1 22%, transparent)', color: 'var(--text-primary)' }
            }
          >
            {l.kind === 'academy' ? (lang === 'en' ? 'Subject' : 'Môn') : lang === 'en' ? 'Course' : 'Khoá'}
          </span>
          {l.label}
        </Link>
      ))}
    </div>
  );
}
