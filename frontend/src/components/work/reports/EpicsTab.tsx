'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { wk, type Lookups } from '@/components/work/hooks';
import { EmptyState, formatDate, Spinner, StatusBadge } from '@/components/work/ui';
import { cn } from '@/lib/utils';
import { num, unitLabel } from './shared';

export default function EpicsTab({ pid, config, lk }: { pid: number; config: ProjectConfig; lk: Lookups }) {
  const q = useQuery({ queryKey: [...wk.reports(pid), 'epics'], queryFn: () => workApi.epicReport(pid) });

  if (q.isLoading) return <div className="flex justify-center py-16"><Spinner size={20} /></div>;
  if (q.error) return <EmptyState title="Could not load epics" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />;
  const d = q.data;
  if (!d || !d.epics.length) return <EmptyState title="No epics yet" body="Create an epic and link issues to it to track progress across sprints." />;

  const u = unitLabel(d.unit);
  const today = new Date().toISOString().slice(0, 10);
  const epicType = config.issueTypes.find((t) => t.level === 1);

  return (
    <div className="overflow-x-auto rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
      <table className="w-full min-w-[720px] text-[13px]">
        <thead>
          <tr className="border-b border-[var(--w-border)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
            <th className="px-3 py-2 font-medium">Epic</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="w-[200px] px-3 py-2 font-medium">Progress</th>
            <th className="px-3 py-2 text-right font-medium">{u === 'h' ? 'Hours' : 'Points'}</th>
            <th className="px-3 py-2 text-right font-medium">Due</th>
          </tr>
        </thead>
        <tbody>
          {d.epics.map((e) => {
            const href = `/work/${config.workspace.slug}/${config.key}/issue/${e.number}`;
            const overdue = !!e.dueDate && !e.resolved && e.dueDate.slice(0, 10) < today;
            return (
              <tr key={e.id} className="border-b border-[var(--w-border)] last:border-0 hover:bg-[var(--w-hover)]">
                <td className="max-w-[280px] px-3 py-2.5">
                  <Link href={href} className="flex min-w-0 items-center gap-2">
                    {epicType && <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: epicType.color }} />}
                    <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{lk.issueKey(e.number)}</span>
                    <span className="truncate font-medium hover:underline">{e.title}</span>
                  </Link>
                </td>
                <td className="px-3 py-2.5"><StatusBadge status={lk.statuses.get(e.statusId)} /></td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--w-sunken)]"
                      role="progressbar"
                      aria-valuenow={e.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${e.title} progress`}
                    >
                      <div className="h-full rounded-full bg-[var(--w-green)]" style={{ width: `${Math.min(100, Math.max(0, e.percent))}%` }} />
                    </div>
                    <span className="w-9 shrink-0 text-right text-[12px] font-medium tabular-nums">{e.percent}%</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-[var(--w-text-3)]">{e.completed} of {e.total} {e.total === 1 ? 'issue' : 'issues'}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-[var(--w-text-2)]">{num(e.pointsDone)} / {num(e.points)} {u}</td>
                <td className={cn('whitespace-nowrap px-3 py-2.5 text-right', overdue ? 'font-medium text-[var(--w-red)]' : 'text-[var(--w-text-2)]')}>
                  {e.dueDate ? formatDate(e.dueDate) : '—'}
                  {overdue && <div className="text-[11px] font-normal">Overdue</div>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
