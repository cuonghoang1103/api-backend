'use client';

/**
 * Database designer — BẢNG "CHUẨN THIẾT KẾ": lỗi (CSDL sẽ từ chối) · cảnh báo · gợi ý, mỗi dòng mở ra được "Vì sao" và
 * "Sửa thế nào" (công cụ dạy học), bấm ⇒ nhảy tới đúng chỗ trong mã.
 */

import { useMemo, useState } from 'react';
import { AlertOctagon, AlertTriangle, ChevronDown, ChevronRight, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWT } from '@/components/work/i18n';
import type { Problem, Severity } from '@/lib/sqlDesign';

const ICON: Record<Severity, typeof Info> = { error: AlertOctagon, warning: AlertTriangle, info: Info };
const TONE: Record<Severity, string> = { error: 'text-[var(--w-red-text)]', warning: 'text-[var(--w-yellow-text)]', info: 'text-[var(--w-accent-text)]' };

export function counts(ps: Problem[]) {
  return { error: ps.filter((p) => p.severity === 'error').length, warning: ps.filter((p) => p.severity === 'warning').length, info: ps.filter((p) => p.severity === 'info').length };
}

export default function LintPanel({ problems, onJump, onClose }: { problems: Problem[]; onJump: (p: Problem) => void; onClose: () => void }) {
  const { t, locale } = useWT();
  const [filter, setFilter] = useState<Severity | 'all'>('all');
  const [open, setOpen] = useState<number | null>(null);
  const c = counts(problems);
  const list = useMemo(() => problems.filter((p) => filter === 'all' || p.severity === filter), [problems, filter]);
  const L = (b: { vi: string; en: string }) => (locale === 'vi' ? b.vi : b.en);
  return (
    <section className="flex h-full min-h-0 flex-col bg-[var(--w-panel)]" aria-label={t('dbd.problems')}>
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-[var(--w-border)] px-2 py-1">
        <span className="text-[12px] font-semibold">{t('dbd.problems')}</span>
        {(['all', 'error', 'warning', 'info'] as const).map((k) => (
          <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}
            className={cn('rounded-[5px] px-1.5 py-0.5 text-[11.5px]', filter === k ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
            {k === 'all' ? t('dbd.all', { count: problems.length }) : t(`dbd.sev_${k}`, { count: c[k] })}
          </button>
        ))}
        <span className="flex-1" />
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onClose} aria-label={t('common.close')}><X size={13} /></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto" tabIndex={0} role="region" aria-label={t('dbd.problems')}>
        {!list.length ? <p className="px-3 py-3 text-[12.5px] text-[var(--w-green-text)]">{problems.length ? t('dbd.noneOfKind') : t('dbd.noProblems')}</p> : (
          <ul>
            {list.map((p, i) => {
              const Icon = ICON[p.severity];
              const expanded = open === i;
              return (
                <li key={`${p.code}-${i}`} className="border-b border-[var(--w-border)] last:border-b-0">
                  <div className="flex items-start gap-1.5 px-2 py-1.5 hover:bg-[var(--w-hover)]">
                    <button type="button" className="mt-px shrink-0 text-[var(--w-text-3)]" aria-expanded={expanded} aria-label={t('dbd.why')} onClick={() => setOpen(expanded ? null : i)} disabled={!p.why}>
                      {p.why ? (expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />) : <span className="inline-block w-[13px]" />}
                    </button>
                    <Icon size={13} className={cn('mt-0.5 shrink-0', TONE[p.severity])} aria-hidden="true" />
                    <button type="button" className="min-w-0 flex-1 text-left text-[12.5px] leading-snug" onClick={() => onJump(p)}>
                      <span>{L(p.message)}</span>
                      {p.span && <span className="ml-1.5 font-mono text-[11px] text-[var(--w-text-3)]">{t('dbd.lineN', { n: p.span.line })}</span>}
                      <span className="ml-1.5 font-mono text-[10.5px] text-[var(--w-text-3)]">{p.code}</span>
                    </button>
                  </div>
                  {expanded && p.why && (
                    <div className="space-y-1 px-8 pb-2 text-[12px] leading-relaxed text-[var(--w-text-2)]">
                      <p><span className="font-semibold text-[var(--w-text)]">{t('dbd.why')}: </span>{L(p.why)}</p>
                      {p.fix && <p><span className="font-semibold text-[var(--w-text)]">{t('dbd.fix')}: </span>{L(p.fix)}</p>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
