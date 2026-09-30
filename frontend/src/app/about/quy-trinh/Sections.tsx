'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Cpu, Globe, Smartphone, Wrench } from 'lucide-react';
import {
  CROSS_CUTTING,
  ENGAGEMENTS,
  PHASES,
  PRODUCT_TYPES,
  STAGES,
  phaseOf,
  pick,
  type LearnLink,
} from './data';
import { LearnChips } from './StageDetail';

type Lang = 'vi' | 'en';

const card = { borderColor: 'var(--border-color)', background: 'var(--bg-card)' } as const;

export function SectionHead({ kicker, title, sub, color = '#8b5cf6' }: { kicker: string; title: string; sub?: string; color?: string }) {
  return (
    <div className="text-center mb-10 max-w-3xl mx-auto">
      <span
        className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.16em] mb-3"
        style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 30%, transparent)` }}
      >
        {kicker}
      </span>
      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">{title}</h2>
      {sub && <p className="mt-3 text-text-secondary leading-relaxed">{sub}</p>}
    </div>
  );
}

const reveal = (reduced: boolean, i = 0) =>
  reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.4, delay: Math.min(i * 0.05, 0.3) },
      };

// ─── Xuyên suốt dự án ───────────────────────────────────────────────────────
export function CrossCutting({ lang, reduced }: { lang: Lang; reduced: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CROSS_CUTTING.map((c, i) => (
        <motion.div key={c.id} {...reveal(reduced, i)} className="rounded-2xl border p-5" style={card}>
          <h3 className="font-heading text-lg font-bold text-text-primary">{pick(c.title, lang)}</h3>
          <p className="mt-1 text-sm text-text-muted">{pick(c.body, lang)}</p>
          <ul className="mt-3 space-y-2">
            {c.points.map((p) => (
              <li key={p[0]} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 bg-neon-violet" />
                {pick(p, lang)}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Loại sản phẩm ──────────────────────────────────────────────────────────
const TYPE_ICON = { web: Globe, mobile: Smartphone, tool: Wrench, ai: Bot, iot: Cpu } as const;

export function ProductTypes({ lang, reduced, onPickStage }: { lang: Lang; reduced: boolean; onPickStage: (n: number) => void }) {
  const [active, setActive] = useState(PRODUCT_TYPES[0].id);
  const t = PRODUCT_TYPES.find((p) => p.id === active)!;
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <div className="flex lg:flex-col gap-2 flex-wrap" role="tablist">
        {PRODUCT_TYPES.map((p) => {
          const Icon = TYPE_ICON[p.id as keyof typeof TYPE_ICON] ?? Globe;
          const on = p.id === active;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(p.id)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors flex-1 lg:flex-none min-w-[8.5rem]"
              style={{
                borderColor: on ? '#8b5cf6' : 'var(--border-color)',
                background: on ? 'color-mix(in srgb, #8b5cf6 14%, var(--bg-card))' : 'var(--bg-card)',
                color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <Icon className="w-4 h-4 shrink-0" style={{ color: on ? '#8b5cf6' : undefined }} />
              {pick(p.title, lang)}
            </button>
          );
        })}
      </div>

      <motion.div
        key={t.id}
        initial={reduced ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border p-5 sm:p-6"
        style={card}
        role="tabpanel"
      >
        <p className="font-heading text-lg sm:text-xl font-bold text-text-primary">{pick(t.emphasis, lang)}</p>
        <ul className="mt-4 space-y-2">
          {t.points.map((p) => (
            <li key={p[0]} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 bg-neon-fuchsia" />
              {pick(p, lang)}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          {L('Giai đoạn được nhấn mạnh', 'Stages that weigh more')}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {t.heavy.map((k) => {
            const st = STAGES[k];
            const c = phaseOf(st.phase).color;
            return (
              <button
                key={k}
                type="button"
                onClick={() => onPickStage(k)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium text-text-primary"
                style={{ borderColor: `color-mix(in srgb, ${c} 45%, var(--border-color))`, background: `color-mix(in srgb, ${c} 9%, var(--bg-card))` }}
              >
                <span className="font-bold tabular-nums" style={{ color: c }}>{String(k).padStart(2, '0')}</span>
                {pick(st.title, lang)}
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">{L('Học thêm', 'Learn more')}</p>
        <div className="mt-2">
          <LearnChips links={t.learn} lang={lang} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Mô hình hợp tác ────────────────────────────────────────────────────────
export function Engagements({ lang, reduced }: { lang: Lang; reduced: boolean }) {
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ENGAGEMENTS.map((e, i) => (
        <motion.div key={e.id} {...reveal(reduced, i)} className="rounded-2xl border p-5 flex flex-col" style={card}>
          <h3 className="font-heading text-lg font-bold text-text-primary">{pick(e.title, lang)}</h3>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">{pick(e.body, lang)}</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-500">{L('Hợp khi', 'Fits when')}</dt>
              <dd className="text-text-secondary">{pick(e.fits, lang)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-500">{L('Đánh đổi', 'Trade-off')}</dt>
              <dd className="text-text-secondary">{pick(e.tradeoff, lang)}</dd>
            </div>
          </dl>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Bản đồ học theo nhóm giai đoạn ─────────────────────────────────────────
export function LearningMap({ lang, reduced }: { lang: Lang; reduced: boolean }) {
  return (
    <div className="grid gap-3">
      {PHASES.map((ph, i) => {
        const stages = STAGES.filter((s) => s.phase === ph.key);
        const seen = new Set<string>();
        const links: LearnLink[] = [];
        for (const s of stages) for (const l of s.learn) if (!seen.has(l.href)) (seen.add(l.href), links.push(l));
        links.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'academy' ? -1 : 1));
        return (
          <motion.div
            key={ph.key}
            {...reveal(reduced, i)}
            className="rounded-2xl border p-4 sm:p-5 grid gap-3 md:grid-cols-[220px_1fr] md:items-center"
            style={card}
          >
            <div>
              <p className="font-heading font-bold text-text-primary flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: ph.color }} />
                {pick(ph.label, lang)}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {stages.map((s) => String(s.n).padStart(2, '0')).join(' · ')}
              </p>
            </div>
            <LearnChips links={links} lang={lang} />
          </motion.div>
        );
      })}
    </div>
  );
}
