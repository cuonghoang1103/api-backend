'use client';

/**
 * Mảnh dùng chung cho màn hình chạy test: nhãn/màu trạng thái lần chạy,
 * thanh tiến độ xếp chồng, xuất CSV. Chỉ dùng token --w-*.
 */

import type { CycleCounts, CycleState, RunStatus, StepStatus } from '@/lib/work-api';
import { cn } from '@/lib/utils';

export const RUN_META: Record<RunStatus, { label: string; color: string }> = {
  TODO: { label: 'To do', color: 'var(--w-text-3)' },
  IN_PROGRESS: { label: 'In progress', color: 'var(--w-accent)' },
  PASS: { label: 'Passed', color: 'var(--w-green)' },
  FAIL: { label: 'Failed', color: 'var(--w-red)' },
  BLOCKED: { label: 'Blocked', color: 'var(--w-orange)' },
  SKIP: { label: 'Skipped', color: 'var(--w-text-3)' },
  RETEST: { label: 'Retest', color: 'var(--w-accent)' },
};

/** Thứ tự hiện trên thanh xếp chồng và chip lọc. */
export const RUN_ORDER: RunStatus[] = ['PASS', 'FAIL', 'BLOCKED', 'RETEST', 'IN_PROGRESS', 'SKIP', 'TODO'];

export const STEP_META: Record<StepStatus, { label: string; short: string; key: string; color: string }> = {
  TODO: { label: 'Not run', short: '—', key: '', color: 'var(--w-text-3)' },
  PASS: { label: 'Pass', short: 'Pass', key: 'P', color: 'var(--w-green)' },
  FAIL: { label: 'Fail', short: 'Fail', key: 'F', color: 'var(--w-red)' },
  BLOCKED: { label: 'Blocked', short: 'Blocked', key: 'B', color: 'var(--w-orange)' },
  SKIP: { label: 'Skip', short: 'Skip', key: 'S', color: 'var(--w-text-2)' },
};

export function RunStatusPill({ status, className }: { status: RunStatus | null | undefined; className?: string }) {
  if (!status) {
    return <span className={cn('inline-flex h-[20px] items-center rounded-[4px] border border-dashed border-[var(--w-border-strong)] px-1.5 text-[11px] text-[var(--w-text-3)]', className)}>Never run</span>;
  }
  const m = RUN_META[status];
  const muted = status === 'TODO' || status === 'SKIP';
  return (
    <span
      className={cn('inline-flex h-[20px] shrink-0 items-center whitespace-nowrap rounded-[4px] border px-1.5 text-[11px] font-semibold uppercase tracking-[0.02em]', className)}
      style={muted
        ? { color: 'var(--w-text-2)', background: 'var(--w-sunken)', borderColor: 'var(--w-border-strong)' }
        : { color: m.color, background: `color-mix(in srgb, ${m.color} 13%, transparent)`, borderColor: `color-mix(in srgb, ${m.color} 40%, transparent)` }}
    >
      {m.label}
    </span>
  );
}

export const CYCLE_STATE_META: Record<CycleState, { label: string; color: string }> = {
  PLANNED: { label: 'Planned', color: 'var(--w-text-2)' },
  IN_PROGRESS: { label: 'In progress', color: 'var(--w-accent-text)' },
  DONE: { label: 'Done', color: 'var(--w-green)' },
};

export function CycleStateBadge({ state }: { state: CycleState }) {
  const m = CYCLE_STATE_META[state];
  return (
    <span
      className="inline-flex h-[20px] shrink-0 items-center rounded-[4px] border px-1.5 text-[11px] font-semibold uppercase tracking-[0.02em]"
      style={state === 'PLANNED'
        ? { color: m.color, background: 'var(--w-sunken)', borderColor: 'var(--w-border-strong)' }
        : { color: m.color, background: `color-mix(in srgb, ${m.color} 12%, transparent)`, borderColor: `color-mix(in srgb, ${m.color} 38%, transparent)` }}
    >
      {m.label}
    </span>
  );
}

/** Thanh tiến độ xếp chồng theo trạng thái; TODO là phần nền còn trống. */
export function StatusBar({ counts, total, height = 6, className }: { counts: CycleCounts['counts']; total: number; height?: number; className?: string }) {
  const title = RUN_ORDER.filter((s) => counts[s]).map((s) => `${RUN_META[s].label}: ${counts[s]}`).join(' · ') || 'No tests';
  return (
    <div title={title} style={{ height }} className={cn('flex w-full overflow-hidden rounded-full bg-[var(--w-sunken)]', className)}>
      {total > 0 && RUN_ORDER.filter((s) => s !== 'TODO' && counts[s]).map((s) => (
        <div
          key={s}
          style={{
            width: `${(counts[s] / total) * 100}%`,
            background: s === 'SKIP' ? 'var(--w-border-strong)' : RUN_META[s].color,
            opacity: s === 'IN_PROGRESS' ? 0.55 : 1,
          }}
        />
      ))}
    </div>
  );
}

// ─── CSV ─────────────────────────────────────────────────────────

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Tải CSV về máy; có BOM để Excel đọc đúng UTF-8 (tiếng Việt). */
export function downloadCsv(fileName: string, header: string[], rows: unknown[][]) {
  const text = [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
  const blob = new Blob(['﻿', text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const safeFileName = (s: string) => s.replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'export';

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
