'use client';

/**
 * dm5 G4 (27/11/2026) — mảnh giao diện của trang Code: chip CI (A2), cờ PR lớn / nhánh sống lâu (D12), thẻ "Sức khoẻ repo" (D13).
 */

import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, CircleDashed, CircleHelp, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { wt } from '../i18n';
import { codeApi, codeKeys, type CiState, type RepoHealthItem } from './codeApi';
import { safeHref } from './codeText';

const CI_LOOK: Record<string, { icon: typeof CheckCircle2; cls: string; nhanChu: 'g4.ciSuccess' | 'g4.ciFailure' | 'g4.ciPending' | 'g4.ciNeutral' }> = {
  success: { icon: CheckCircle2, cls: 'border-[var(--w-green)] text-[var(--w-green-text,var(--w-green))]', nhanChu: 'g4.ciSuccess' },
  failure: { icon: XCircle, cls: 'border-[var(--w-red)] text-[var(--w-red-text)]', nhanChu: 'g4.ciFailure' },
  pending: { icon: Loader2, cls: 'border-[var(--w-amber,#d97706)] text-[var(--w-amber-text,#b45309)]', nhanChu: 'g4.ciPending' },
  neutral: { icon: CircleDashed, cls: 'border-[var(--w-border-strong)] text-[var(--w-text-2)]', nhanChu: 'g4.ciNeutral' },
};

/** Chip CI: xanh / đỏ / vàng; bấm mở lượt chạy CI (nếu có link). Không có dữ liệu ⇒ không vẽ (trừ khi showNone). */
export function CiChip({ state, url, compact, showNone, className }: { state: CiState | undefined; url?: string | null; compact?: boolean; showNone?: boolean; className?: string }) {
  const look = state ? CI_LOOK[state] : null;
  if (!look && !showNone) return null;
  const Icon = look?.icon ?? CircleHelp;
  const label = look ? wt(look.nhanChu) : wt('g4.ciNone');
  const body = (
    <span
      className={cn('inline-flex h-[20px] shrink-0 items-center gap-1 rounded-full border px-1.5 text-[11px] font-medium', look?.cls ?? 'border-dashed border-[var(--w-border-strong)] text-[var(--w-text-3)]', className)}
      title={label} data-testid="ci-chip" data-ci={state ?? 'none'}
    >
      <Icon size={11} className={state === 'pending' ? 'animate-spin' : undefined} aria-hidden="true" />
      {!compact && label}
      {compact && <span className="sr-only">{label}</span>}
    </span>
  );
  const href = safeHref(url ?? null);
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" aria-label={wt('g4.ciOpen')}>{body}</a> : body;
}

/** Cờ cảnh báo nhỏ (PR lớn, nhánh sống lâu). */
export function WarnFlag({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn('inline-flex h-[20px] items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--w-amber,#d97706)_14%,transparent)] px-1.5 text-[11px] font-medium text-[var(--w-amber-text,#b45309)]', className)} data-testid="g4-warn">
      <AlertTriangle size={11} aria-hidden="true" /> {text}
    </span>
  );
}

const ST: Record<RepoHealthItem['state'], { icon: typeof CheckCircle2; cls: string; nhanChu: 'g4.stOk' | 'g4.stMissing' | 'g4.stUnknown' }> = {
  ok: { icon: CheckCircle2, cls: 'text-[var(--w-green)]', nhanChu: 'g4.stOk' },
  missing: { icon: XCircle, cls: 'text-[var(--w-red-text)]', nhanChu: 'g4.stMissing' },
  unknown: { icon: CircleHelp, cls: 'text-[var(--w-text-3)]', nhanChu: 'g4.stUnknown' },
};

/** D13: thẻ "Sức khoẻ repo" — 5 mục trên nhánh mặc định. */
export function RepoHealthCard({ pid }: { pid: number }) {
  const q = useQuery({ queryKey: codeKeys.health(pid), queryFn: () => codeApi.health(pid), staleTime: 5 * 60_000, retry: false });
  if (q.isLoading || q.isError || !q.data) return null;
  const d = q.data;
  const ok = d.items.filter((i) => i.state === 'ok').length;
  return (
    <section className="w-card p-4" data-testid="repo-health">
      <div className="mb-2 flex items-center gap-2">
        <ShieldCheck size={15} className="text-[var(--w-accent-text)]" aria-hidden="true" />
        <h2 className="text-[13.5px] font-semibold">{wt('g4.healthTitle')}</h2>
        {d.connected && d.items.length > 0 && <span className="ml-auto text-[12px] tabular-nums text-[var(--w-text-2)]">{ok}/{d.items.length}</span>}
      </div>
      {!d.connected ? (
        <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('g4.healthNotConnected')}</p>
      ) : (
        <>
          <p className="mb-2 text-[12px] text-[var(--w-text-3)]">{wt('g4.healthHint', { b: d.defaultBranch ?? 'main' })}</p>
          <ul className="space-y-1.5">
            {d.items.map((i) => {
              const s = ST[i.state];
              const Icon = s.icon;
              return (
                <li key={i.key} className="flex items-start gap-2 text-[12.5px]">
                  <Icon size={14} className={cn('mt-0.5 shrink-0', s.cls)} aria-label={wt(s.nhanChu)} />
                  <span className="min-w-0">
                    <span className="font-medium">{wt(`g4.h_${i.key}` as 'g4.h_ci')}</span>
                    <span className="block text-[12px] text-[var(--w-text-2)] [overflow-wrap:anywhere]">{i.detail}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
