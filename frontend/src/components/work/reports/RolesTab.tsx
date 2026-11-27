'use client';

/**
 * dm5 G4 (C5, 27/11/2026) — Reports › "Giờ theo vai": giờ theo năm mũ C1 PM · C2 BA · C3 Dev BE · C4 Dev FE · C5 QA mỗi tuần,
 * % trong tuần và cảnh báo (QA < x% · tổng > y giờ/tuần — settings.roleAlert). Một người đóng 5 vai vẫn thấy đủ 5 cột
 * (contrib theo NGƯỜI chỉ ra một dòng). Mũ mỗi lần ghi = chọn khi Log time > nhãn thẻ > activity.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { g4Api, g4Keys } from '@/lib/work-dm5g4-api';
import { EmptyState, Spinner } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';
import { addDays, mondayOf, vnToday } from './TimeTab';

const HAT_COLOR: Record<string, string> = { C1: '#7c3aed', C2: '#0891b2', C3: '#2563eb', C4: '#16a34a', C5: '#ca8a04' };

export default function RolesTab({ pid, config }: { pid: number; config: ProjectConfig }) {
  const [from, setFrom] = useState(() => addDays(mondayOf(vnToday()), -21));
  const [to, setTo] = useState(() => addDays(mondayOf(vnToday()), 6));
  const [userId, setUserId] = useState<number | null>(null);
  const q = useQuery({ queryKey: g4Keys.hoursByRole(pid, from, to, userId), queryFn: () => g4Api.hoursByRole(pid, { from, to, ...(userId ? { userId } : {}) }), enabled: !!from && !!to && from <= to });
  const people = config.members.filter((m) => m.role !== 'CLIENT');

  return (
    <div className="space-y-4" data-testid="roles-tab">
      <p className="max-w-[760px] text-[13px] text-[var(--w-text-2)]">{wt('g4.rolesIntro')}</p>
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-[12px] text-[var(--w-text-2)]">{wt('g4.from')}<input type="date" className="w-input mt-0.5 !h-8" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="text-[12px] text-[var(--w-text-2)]">{wt('g4.to')}<input type="date" className="w-input mt-0.5 !h-8" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <label className="text-[12px] text-[var(--w-text-2)]">{wt('g4.person')}
          <select className="w-input mt-0.5 !h-8" value={userId ?? ''} onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">{wt('g4.everyone')}</option>
            {people.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
          </select>
        </label>
        {q.isFetching && <Spinner size={12} />}
      </div>
      {q.isError ? <p className="text-[13px] text-[var(--w-red-text)]">{workError(q.error)}</p> : !q.data ? <div className="py-10 text-center"><Spinner /></div> : !q.data.weeks.length ? (
        <EmptyState title={wt('g4.noLogs')} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-[10px] border border-[var(--w-border)] bg-[var(--w-raised)]">
            <table className="w-full min-w-[720px] text-[13px]">
              <thead>
                <tr className="border-b border-[var(--w-border)] text-left text-[12px] text-[var(--w-text-3)]">
                  <th className="px-3 py-2 font-medium">{wt('g4.week')}</th>
                  {q.data.hats.map((h) => <th key={h.hat} className="px-3 py-2 text-right font-medium"><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: HAT_COLOR[h.hat] }} />{h.hat} {h.label}</th>)}
                  <th className="px-3 py-2 text-right font-medium">{wt('g4.total')}</th>
                  <th className="px-3 py-2 font-medium">{wt('g4.alerts')}</th>
                </tr>
              </thead>
              <tbody>
                {q.data.weeks.map((w) => (
                  <tr key={w.weekStart} className="border-b border-[var(--w-border)] last:border-b-0">
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-[12px]">{w.weekStart}</td>
                    {q.data!.hats.map((h) => (
                      <td key={h.hat} className="px-3 py-2 text-right tabular-nums">
                        {w.hours[h.hat] ? <>{w.hours[h.hat]}h <span className="text-[11px] text-[var(--w-text-3)]">{w.pct[h.hat]}%</span></> : <span className="text-[var(--w-text-3)]">—</span>}
                        <div className="mt-1 h-1 rounded-full bg-[var(--w-sunken)]"><div className="h-1 rounded-full" style={{ width: `${Math.min(100, w.pct[h.hat])}%`, background: HAT_COLOR[h.hat] }} /></div>
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right font-medium tabular-nums">{w.totalHours}h</td>
                    <td className="px-3 py-2">
                      {w.alerts.length ? (
                        <ul className="space-y-0.5">{w.alerts.map((a) => <li key={a.code} className="flex items-start gap-1 text-[12px] text-[var(--w-amber-text,#b45309)]"><AlertTriangle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />{a.message}</li>)}</ul>
                      ) : <span className="text-[var(--w-text-3)]">—</span>}
                    </td>
                  </tr>
                ))}
                <tr className="bg-[var(--w-sunken)] font-medium">
                  <td className="px-3 py-2">{wt('g4.total')}</td>
                  {q.data.hats.map((h) => <td key={h.hat} className="px-3 py-2 text-right tabular-nums">{q.data!.totals.hours[h.hat]}h <span className="text-[11px] text-[var(--w-text-3)]">{q.data!.totals.pct[h.hat]}%</span></td>)}
                  <td className="px-3 py-2 text-right tabular-nums">{q.data.totals.totalHours}h</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[12px] text-[var(--w-text-3)]">
            {wt('g4.thresholds', { qa: q.data.thresholds.qaMinPct, max: q.data.thresholds.maxWeekHours })}
            {q.data.guessedHours > 0 && <> · {wt('g4.guessed', { h: q.data.guessedHours })}</>}
          </p>
        </>
      )}
    </div>
  );
}
