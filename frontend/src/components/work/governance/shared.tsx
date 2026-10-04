'use client';

/**
 * CT Work — mảnh dùng chung của đợt S3b (CR · RAID · họp). Màu/khung theo token
 * "Graphite & Iris" của work.css (`--w-*`) — không dùng Tailwind `dark:` (theme tối
 * của CT Work đi qua biến CSS, xem CLAUDE.md "theme-dark").
 */

import { useCallback, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { userName, type ProjectConfig } from '@/lib/work-api';
import { CR_STATUS_LABEL, RAID_STATUS_LABEL, type CrStatus, type RiskLevel } from '@/lib/work-s3b-api';
import { Select } from '../settings/shared';
import { Pill } from '../studio/shared';

type Tone = 'neutral' | 'blue' | 'green' | 'red' | 'orange' | 'accent';

const CR_TONE: Record<CrStatus, Tone> = {
  DRAFT: 'neutral', SUBMITTED: 'blue', UNDER_REVIEW: 'orange', APPROVED: 'green', REJECTED: 'red', IMPLEMENTED: 'accent',
};
export const CrStatusPill = ({ status }: { status: CrStatus }) => <Pill tone={CR_TONE[status]}>{CR_STATUS_LABEL[status]}</Pill>;

const RAID_TONE: Record<string, Tone> = {
  OPEN: 'orange', MONITORING: 'blue', MITIGATED: 'green', CLOSED: 'neutral', UNVALIDATED: 'orange', VALIDATED: 'green', INVALID: 'red',
};
export const RaidStatusPill = ({ status }: { status: string }) => <Pill tone={RAID_TONE[status] ?? 'neutral'}>{RAID_STATUS_LABEL[status] ?? status}</Pill>;

/** Màu theo mức rủi ro — dùng cho ô ma trận + huy hiệu điểm. */
export const LEVEL_COLOR: Record<RiskLevel, string> = { HIGH: 'var(--w-red)', MEDIUM: 'var(--w-orange)', LOW: 'var(--w-green)' };

export function levelOf(score: number | null): RiskLevel | null {
  if (score === null) return null;
  return score >= 15 ? 'HIGH' : score >= 8 ? 'MEDIUM' : 'LOW';
}

/** Huy hiệu điểm L × I. */
export function ScoreBadge({ score, title, className }: { score: number | null; title?: string; className?: string }) {
  const lv = levelOf(score);
  if (score === null || !lv) {
    return <span className={cn('inline-flex h-[22px] min-w-[30px] items-center justify-center rounded-[6px] border border-dashed border-[var(--w-border-strong)] px-1.5 text-[11.5px] text-[var(--w-text-3)]', className)} title={title ?? 'Not scored'}>—</span>;
  }
  return (
    <span
      title={title ?? `Score ${score} (${lv.toLowerCase()})`}
      className={cn('inline-flex h-[22px] min-w-[30px] items-center justify-center rounded-[6px] px-1.5 text-[12px] font-semibold tabular-nums', className)}
      style={{ color: LEVEL_COLOR[lv], background: `color-mix(in srgb, ${LEVEL_COLOR[lv]} 12%, transparent)`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${LEVEL_COLOR[lv]} 35%, transparent)` }}
    >
      {score}
    </span>
  );
}

/** "+5 days" · "−2 days" · "—". */
export function fmtDays(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  if (n === 0) return '0 days';
  return `${n > 0 ? '+' : '−'}${Math.abs(n)} day${Math.abs(n) === 1 ? '' : 's'}`;
}

/** Chi phí ghi tự do: số + đơn vị (không quy đổi). */
export function fmtCost(amount: number | null | undefined, currency: string | null | undefined): string {
  if (amount === null || amount === undefined) return '—';
  const n = amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return currency?.trim() ? `${n} ${currency.trim().toUpperCase()}` : n;
}

/** Ô chọn người trong dự án (chỉ người của đội khi `staffOnly`). */
export function PersonSelect({ config, value, onChange, label, staffOnly, empty = 'Nobody', disabled }: {
  config: ProjectConfig; value: number | null; onChange: (v: number | null) => void; label: string; staffOnly?: boolean; empty?: string; disabled?: boolean;
}) {
  const people = config.members.filter((m) => !staffOnly || (m.role !== 'CLIENT'));
  return (
    <Select aria-label={label} value={value ?? ''} disabled={disabled} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}>
      <option value="">{empty}</option>
      {people.map((m) => <option key={m.id} value={m.id}>{userName(m)}{m.role === 'CLIENT' ? ' (client)' : ''}</option>)}
    </Select>
  );
}

export function Section({ title, action, children, className, id }: { title: ReactNode; action?: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <section className={cn('w-card p-4 md:p-5', className)} id={id}>
      <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2">
        <h2 className="w-section-title">{title}</h2>
        {action && <div className="ml-auto flex flex-wrap items-center gap-1.5">{action}</div>}
      </div>
      {children}
    </section>
  );
}

/** Làm tươi mọi dữ liệu S3b của dự án (+ phê duyệt, thẻ). */
export function useGovInvalidate(pid: number) {
  const qc = useQueryClient();
  return useCallback(() => {
    qc.invalidateQueries({ queryKey: ['work', 'gov', pid] });
    for (const k of ['approvals', 'my-approvals', 'issue', 'issues', 'board', 'backlog']) qc.invalidateQueries({ queryKey: ['work', k] });
  }, [qc, pid]);
}

/** "Mon, Oct 5 · 09:00–10:30 (Asia/Ho_Chi_Minh)" theo múi giờ của cuộc họp. */
export function fmtMeetingTime(startsAt: string, endsAt: string, tz: string): string {
  try {
    const day = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(startsAt));
    const t = (s: string) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' }).format(new Date(s));
    return `${day} · ${t(startsAt)}–${t(endsAt)}`;
  } catch {
    return new Date(startsAt).toLocaleString();
  }
}

/** Ô datetime-local (giờ của MÁY) ⇄ ISO. */
export const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
export const fromLocalInput = (v: string) => new Date(v).toISOString();

export function Kv({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] font-medium text-[var(--w-text-3)]">{k}</dt>
      <dd className="mt-0.5 min-w-0 text-[13.5px] [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}
