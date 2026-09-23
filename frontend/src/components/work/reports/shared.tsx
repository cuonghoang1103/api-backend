'use client';

/** Mảnh dùng chung cho các tab báo cáo: đơn vị, ô chọn sprint, ô số liệu, tooltip biểu đồ. */

import { useMemo, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workApi, type EstimationUnit, type SprintFull } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { cn } from '@/lib/utils';

export const unitLabel = (u: EstimationUnit | undefined) => (u === 'HOURS' ? 'h' : 'pts');

/** 12 → "12", 12.5 → "12.5". */
export const num = (n: number | null | undefined) => (n === null || n === undefined ? '—' : String(Math.round(n * 10) / 10));

export const fmtValue = (n: number | null | undefined, u: EstimationUnit | undefined) =>
  n === null || n === undefined ? '—' : `${num(n)} ${unitLabel(u)}`;

/** "2026-09-23" → "Sep 23". */
export function fmtDay(day: string): string {
  const d = new Date(day.length === 10 ? `${day}T00:00:00Z` : day);
  if (Number.isNaN(d.getTime())) return day;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** Mọi sprint kể cả đã đóng — khoá nằm dưới wk.sprints nên sự kiện sprint.updated làm tươi nó. */
export function useAllSprints(pid: number) {
  return useQuery({ queryKey: [...wk.sprints(pid), 'all'], queryFn: () => workApi.sprints(pid, true) });
}

/** ACTIVE + CLOSED, sprint đang chạy trước, rồi sprint đóng gần nhất. */
export function useReportableSprints(sprints: SprintFull[] | undefined) {
  return useMemo(() => {
    const list = (sprints ?? []).filter((s) => s.state !== 'PLANNED');
    const time = (s: SprintFull) => new Date(s.completedAt ?? s.endAt ?? s.startAt ?? 0).getTime();
    return list.sort((a, b) => {
      if (a.state !== b.state) return a.state === 'ACTIVE' ? -1 : 1;
      return time(b) - time(a) || b.id - a.id;
    });
  }, [sprints]);
}

export function SprintSelect({ sprints, value, onChange, className }: { sprints: SprintFull[]; value: number | null; onChange: (id: number) => void; className?: string }) {
  return (
    <select
      aria-label="Sprint"
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn('w-input h-[28px] w-auto max-w-full py-0 pr-7 text-[12px]', className)}
    >
      {sprints.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}{s.state === 'ACTIVE' ? ' (active)' : ''}
        </option>
      ))}
    </select>
  );
}

export function StatCell({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: ReactNode; tone?: 'green' | 'red' | 'accent' }) {
  return (
    <div className="min-w-0 rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2.5">
      <div className="truncate text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">{label}</div>
      <div
        className={cn(
          'mt-1 truncate text-[18px] font-semibold tabular-nums',
          tone === 'green' && 'text-[var(--w-green)]',
          tone === 'red' && 'text-[var(--w-red)]',
          tone === 'accent' && 'text-[var(--w-accent-text)]',
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-0.5 truncate text-[11px] text-[var(--w-text-3)]">{hint}</div>}
    </div>
  );
}

type TipPayload = { name?: string | number; value?: number | string | null | (number | string)[]; color?: string; stroke?: string; fill?: string; dataKey?: unknown };

/** Tooltip của Recharts theo token --w-* (mặc định của Recharts là nền trắng cứng, chói ở giao diện tối). */
export function ChartTooltip({ active, payload, label, unit, labelFormat }: {
  active?: boolean; payload?: TipPayload[]; label?: string | number; unit?: EstimationUnit; labelFormat?: (l: string) => string;
}) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter((p) => p.value !== null && p.value !== undefined);
  if (!rows.length) return null;
  return (
    <div className="rounded-[var(--w-radius)] border border-[var(--w-border-strong)] bg-[var(--w-raised)] px-2.5 py-2 text-[12px] shadow-[var(--w-shadow-pop)]">
      {label !== undefined && <div className="mb-1 font-medium text-[var(--w-text)]">{labelFormat ? labelFormat(String(label)) : label}</div>}
      {rows.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[var(--w-text-2)]">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color ?? p.stroke ?? p.fill }} />
          <span>{p.name}</span>
          <span className="ml-auto pl-3 font-medium tabular-nums text-[var(--w-text)]">{fmtValue(Number(p.value), unit)}</span>
        </div>
      ))}
    </div>
  );
}

export const axisTick = { fill: 'var(--w-text-3)', fontSize: 11 };

export function Legend({ items }: { items: Array<{ label: string; color: string; dashed?: boolean }> }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--w-text-2)]">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4" style={{ borderTop: `2px ${it.dashed ? 'dashed' : 'solid'} ${it.color}` }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)] p-4', className)}>{children}</div>;
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <h3 className="text-[13px] font-semibold">{children}</h3>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}
