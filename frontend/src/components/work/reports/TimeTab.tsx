'use client';

/**
 * Báo cáo giờ đã ghi (worklog): tổng theo người × ngày trong một khoảng,
 * mở từng người để xem giờ theo thẻ. Ngày tính theo giờ Việt Nam — khớp
 * với backend (timeReport cắt ngày ở 00:00 +07).
 */

import { Fragment, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { fmtMinutes } from '@/components/work/TimeTracking';
import { EmptyState, Spinner, UserAvatar } from '@/components/work/ui';
import { cn } from '@/lib/utils';
import { fmtDay, StatCell } from './shared';

// ─── Ngày theo giờ Việt Nam ──────────────────────────────────────

/** Hôm nay ở Việt Nam, dạng YYYY-MM-DD. */
export function vnToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export function addDays(day: string, n: number): string {
  const t = Date.parse(`${day}T00:00:00Z`) + n * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/** Thứ Hai của tuần chứa `day`. */
export function mondayOf(day: string): string {
  const dow = new Date(`${day}T00:00:00Z`).getUTCDay();
  return addDays(day, -((dow + 6) % 7));
}

export function daysBetween(from: string, to: string): string[] {
  const out: string[] = [];
  for (let d = from; d <= to && out.length < 400; d = addDays(d, 1)) out.push(d);
  return out;
}

const isWeekend = (day: string) => [0, 6].includes(new Date(`${day}T00:00:00Z`).getUTCDay());
const weekday = (day: string) => new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

/** Quá 31 ngày thì bảng theo ngày quá rộng — chỉ hiện tổng. */
const MAX_DAY_COLUMNS = 31;

export default function TimeTab({ pid, config, onOpenIssue }: { pid: number; config: ProjectConfig; onOpenIssue: (num: number) => void }) {
  const [from, setFrom] = useState(() => mondayOf(vnToday()));
  const [to, setTo] = useState(() => addDays(mondayOf(vnToday()), 6));
  const [open, setOpen] = useState<Set<number>>(new Set());

  const validRange = !!from && !!to && from <= to;
  const q = useQuery({
    queryKey: [...wk.timeReport(pid), from, to],
    queryFn: () => workApi.timeReport(pid, { from, to }),
    enabled: validRange,
  });
  const days = useMemo(() => (validRange ? daysBetween(from, to) : []), [from, to, validRange]);
  const showDays = days.length <= MAX_DAY_COLUMNS;

  const shiftWeek = (n: number) => {
    const m = addDays(mondayOf(from), n * 7);
    setFrom(m);
    setTo(addDays(m, 6));
  };
  const thisWeek = () => { const m = mondayOf(vnToday()); setFrom(m); setTo(addDays(m, 6)); };
  const toggle = (id: number) => setOpen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const data = q.data;
  const dayTotals = useMemo(() => {
    const t: Record<string, number> = {};
    for (const p of data?.people ?? []) for (const [d, m] of Object.entries(p.byDay)) t[d] = (t[d] ?? 0) + m;
    return t;
  }, [data]);
  const activeDays = Object.values(dayTotals).filter((m) => m > 0).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center">
          <button type="button" className="w-btn w-btn-sm w-btn-icon !rounded-r-none" onClick={() => shiftWeek(-1)} aria-label="Previous week" title="Previous week"><ChevronLeft size={13} /></button>
          <button type="button" className="w-btn w-btn-sm !rounded-none !border-x-0" onClick={thisWeek}>This week</button>
          <button type="button" className="w-btn w-btn-sm w-btn-icon !rounded-l-none" onClick={() => shiftWeek(1)} aria-label="Next week" title="Next week"><ChevronRight size={13} /></button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
          <input type="date" aria-label="From" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} className="w-input !h-[28px] !w-auto py-0 text-[12px]" />
          <span>to</span>
          <input type="date" aria-label="To" value={to} min={from} onChange={(e) => e.target.value && setTo(e.target.value)} className="w-input !h-[28px] !w-auto py-0 text-[12px]" />
        </div>
        <span className="text-[12px] text-[var(--w-text-3)] sm:ml-auto">Days in Vietnam time (UTC+7)</span>
      </div>

      {!validRange ? (
        <EmptyState title="Pick a valid range" body="The start date must be on or before the end date." />
      ) : q.isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={20} /></div>
      ) : q.error ? (
        <EmptyState title="Could not load time report" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : !data || !data.people.length ? (
        <EmptyState title="No time logged in this range" body="Log time from an issue (Time tracking → Log time) and it will show up here." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatCell label="Total logged" value={fmtMinutes(data.totalMin)} tone="accent" />
            <StatCell label="People" value={data.people.length} />
            <StatCell label="Days with logs" value={`${activeDays} / ${days.length}`} />
            <StatCell label="Per person" value={fmtMinutes(data.totalMin / data.people.length)} hint="Average" />
          </div>

          <div className="overflow-x-auto rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
            <table className="w-full text-[12.5px]" style={{ minWidth: showDays ? 240 + days.length * 64 : 420 }}>
              <thead>
                <tr className="border-b border-[var(--w-border)] text-left text-[11px] text-[var(--w-text-3)]">
                  <th className="sticky left-0 z-[1] bg-[var(--w-panel)] px-3 py-2 font-medium uppercase tracking-wide">Member</th>
                  {showDays && days.map((d) => (
                    <th key={d} className={cn('px-2 py-2 text-right font-medium', isWeekend(d) && 'bg-[var(--w-sunken)]')}>
                      <div className="uppercase tracking-wide">{weekday(d)}</div>
                      <div className="font-normal tabular-nums">{fmtDay(d)}</div>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-right font-medium uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.people.map((p) => {
                  const expanded = open.has(p.user.id);
                  return (
                    <Fragment key={p.user.id}>
                      <tr className="border-b border-[var(--w-border)]">
                        <td className="sticky left-0 z-[1] bg-[var(--w-panel)] px-3 py-2">
                          <button type="button" onClick={() => toggle(p.user.id)} aria-expanded={expanded} className="flex min-w-0 items-center gap-2 text-left">
                            <ChevronDown size={13} className={cn('shrink-0 text-[var(--w-text-3)] transition-transform', !expanded && '-rotate-90')} />
                            <UserAvatar user={p.user} size={20} />
                            <span className="max-w-[160px] truncate font-medium">{p.name}</span>
                          </button>
                        </td>
                        {showDays && days.map((d) => (
                          <td key={d} className={cn('px-2 py-2 text-right tabular-nums', isWeekend(d) && 'bg-[var(--w-sunken)]', !p.byDay[d] && 'text-[var(--w-text-3)]')}>
                            {p.byDay[d] ? fmtMinutes(p.byDay[d]) : '·'}
                          </td>
                        ))}
                        <td className="px-3 py-2 text-right font-semibold tabular-nums">{fmtMinutes(p.totalMin)}</td>
                      </tr>
                      {expanded && (
                        <tr className="border-b border-[var(--w-border)] bg-[var(--w-sunken)]">
                          <td colSpan={(showDays ? days.length : 0) + 2} className="px-3 py-2">
                            <ul className="sticky left-3 max-w-[min(640px,calc(100vw-64px))] space-y-1 pl-6">
                              {p.issues.map((i) => (
                                <li key={i.number} className="flex min-w-0 items-center gap-2">
                                  <button type="button" onClick={() => onOpenIssue(i.number)} className="shrink-0 font-mono text-[11.5px] text-[var(--w-accent-text)] hover:underline">
                                    {config.key}-{i.number}
                                  </button>
                                  <span className="min-w-0 flex-1 truncate text-[var(--w-text-2)]">{i.title}</span>
                                  <span className="shrink-0 tabular-nums">{fmtMinutes(i.minutes)}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="text-[var(--w-text-2)]">
                  <td className="sticky left-0 z-[1] bg-[var(--w-panel)] px-3 py-2 text-[11px] font-medium uppercase tracking-wide">Total</td>
                  {showDays && days.map((d) => (
                    <td key={d} className={cn('px-2 py-2 text-right font-medium tabular-nums', isWeekend(d) && 'bg-[var(--w-sunken)]')}>
                      {dayTotals[d] ? fmtMinutes(dayTotals[d]) : ''}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right font-semibold tabular-nums text-[var(--w-text)]">{fmtMinutes(data.totalMin)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {!showDays && <p className="text-[12px] text-[var(--w-text-3)]">The per-day breakdown is hidden for ranges longer than {MAX_DAY_COLUMNS} days.</p>}
        </>
      )}
    </div>
  );
}
