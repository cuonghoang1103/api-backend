'use client';

import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, formatDate, PageLoading } from '@/components/work/ui';
import { num, SectionTitle, unitLabel } from './shared';
import { VelocityChart } from '../charts/FlowCharts';
import { wt } from '@/components/work/i18n';

export default function VelocityTab({ pid }: { pid: number }) {
  const q = useQuery({ queryKey: [...wk.reports(pid), 'velocity'], queryFn: () => workApi.velocity(pid) });

  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error) return <EmptyState title={wt('rep.loadVelFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />;
  const d = q.data;
  if (!d || !d.sprints.length) {
    return <EmptyState title={wt('rep.noCompleted')} body={wt('rep.noCompletedBody')} />;
  }
  const u = unitLabel(d.unit);
  const shown = Math.min(3, d.sprints.length);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[12px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">{wt('rep.avgVelocity')}</div>
        <div className="mt-0.5 text-[22px] font-semibold tabular-nums">
          {d.average === null ? '—' : `${num(d.average)} ${u}`}
          <span className="ml-2 text-[13px] font-normal text-[var(--w-text-3)]">{wt('rep.lastN', { count: shown })}</span>
        </div>
      </div>

      {/* UX-B: ChartFrame — cột cam kết/hoàn thành + đường trung bình trượt 3 sprint, xuất PNG/CSV. */}
      <VelocityChart pid={pid} height={280} />

      <div>
        <SectionTitle>{wt('rep.sprints')}</SectionTitle>
        <div className="overflow-x-auto rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
          <table className="w-full min-w-[480px] text-[13px]">
            <thead>
              <tr className="border-b border-[var(--w-border)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
                <th className="px-3 py-2 font-medium">Sprint</th>
                <th className="px-3 py-2 font-medium">{wt('rep.completedOn')}</th>
                <th className="px-3 py-2 text-right font-medium">{wt('rep.committed')}</th>
                <th className="px-3 py-2 text-right font-medium">{wt('rep.completed')}</th>
                <th className="px-3 py-2 text-right font-medium">{wt('rep.pctCompleted')}</th>
              </tr>
            </thead>
            <tbody>
              {[...d.sprints].reverse().map((s) => {
                const pct = s.committedPoints ? Math.round((s.completedPoints / s.committedPoints) * 100) : null;
                return (
                  <tr key={s.id} className="border-b border-[var(--w-border)] last:border-0">
                    <td className="px-3 py-2 font-medium">{s.name}</td>
                    <td className="px-3 py-2 text-[var(--w-text-2)]">{s.completedAt ? formatDate(s.completedAt) : '—'}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{num(s.committedPoints)} {u}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{num(s.completedPoints)} {u}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-[var(--w-text-2)]">{pct === null ? '—' : `${pct}%`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
