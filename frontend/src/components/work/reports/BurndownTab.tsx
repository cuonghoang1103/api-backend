'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, formatDate, PageLoading } from '@/components/work/ui';
import { fmtValue, SprintSelect, StatCell, useAllSprints, useReportableSprints } from './shared';
import { SprintBurndownChart } from '../charts/FlowCharts';
import { wt } from '@/components/work/i18n';

export default function BurndownTab({ pid }: { pid: number }) {
  const sprintsQ = useAllSprints(pid);
  const sprints = useReportableSprints(sprintsQ.data);
  const [sprintId, setSprintId] = useState<number | null>(null);

  useEffect(() => {
    if (!sprints.length) return;
    if (sprintId === null || !sprints.some((s) => s.id === sprintId)) setSprintId(sprints[0].id);
  }, [sprints, sprintId]);

  const q = useQuery({
    queryKey: [...wk.reports(pid), 'burndown', sprintId],
    queryFn: () => workApi.burndown(pid, sprintId!),
    enabled: sprintId !== null,
  });

  const stats = useMemo(() => {
    const d = q.data;
    if (!d) return null;
    const known = d.points.filter((p) => p.remaining !== null);
    const last = known[known.length - 1];
    const committed = d.sprint.committedPoints ?? d.points[0]?.total ?? 0;
    const completed = d.sprint.state === 'CLOSED' && d.sprint.completedPoints !== null ? d.sprint.completedPoints : last?.done ?? 0;
    const remaining = last?.remaining ?? committed;
    return { committed, completed, remaining };
  }, [q.data]);

  if (sprintsQ.isLoading) return <PageLoading rows={4} />;
  if (sprintsQ.error) return <EmptyState title={wt('rep.loadSprintsFailed')} body={workError(sprintsQ.error)} />;
  if (!sprints.length) return <EmptyState title={wt('rep.noSprints')} body={wt('rep.noSprintsBody')} />;

  const d = q.data;
  const unit = d?.unit;
  const sprint = d?.sprint;
  let lastCell: { label: string; value: string; tone?: 'red' } = { label: wt('rep.daysLeft'), value: '—' };
  if (sprint?.state === 'CLOSED') {
    lastCell = { label: wt('rep.completedOn'), value: sprint.completedAt ? formatDate(sprint.completedAt) : '—' };
  } else if (sprint?.endAt) {
    const left = Math.ceil((new Date(sprint.endAt).getTime() - Date.now()) / 86_400_000);
    lastCell = left < 0 ? { label: wt('rep.overdueBy'), value: wt('common.days', { count: -left }), tone: 'red' } : { label: wt('rep.daysLeft'), value: String(left) };
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SprintSelect sprints={sprints} value={sprintId} onChange={setSprintId} />
      </div>

      {q.isLoading ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => <span key={i} className="w-skel h-[78px] !rounded-[10px]" />)}
        </div>
      ) : q.error ? (
        <EmptyState title={wt('rep.loadBdFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />
      ) : d && stats ? (
        <>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <StatCell label={wt('rep.committed')} value={fmtValue(stats.committed, unit)} hint={wt('rep.atStart')} />
            <StatCell label={wt('rep.completed')} value={fmtValue(stats.completed, unit)} tone="green" />
            <StatCell label={wt('rep.remaining')} value={fmtValue(stats.remaining, unit)} />
            <StatCell label={lastCell.label} value={lastCell.value} tone={lastCell.tone} hint={sprint?.endAt ? wt('rep.endsOn', { d: formatDate(sprint.endAt) }) : undefined} />
          </div>
          {d.sprint.goal && (
            <div className="text-[13px] text-[var(--w-text-2)]">
              <span className="font-medium text-[var(--w-text)]">{wt('rep.sprintGoal')}</span> {d.sprint.goal}
            </div>
          )}
        </>
      ) : null}
      {/* UX-B: biểu đồ đi qua ChartFrame (chú giải bật/tắt, cách tính, xuất PNG/CSV, có đường scope). */}
      {sprintId !== null && <SprintBurndownChart pid={pid} sprintId={sprintId} height={300} />}
    </div>
  );
}
