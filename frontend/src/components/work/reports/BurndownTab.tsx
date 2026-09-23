'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, formatDate, Spinner } from '@/components/work/ui';
import { cn } from '@/lib/utils';
import {
  axisTick, Card, ChartTooltip, fmtDay, fmtValue, Legend, SprintSelect, StatCell, unitLabel, useAllSprints, useReportableSprints,
} from './shared';

export default function BurndownTab({ pid }: { pid: number }) {
  const sprintsQ = useAllSprints(pid);
  const sprints = useReportableSprints(sprintsQ.data);
  const [sprintId, setSprintId] = useState<number | null>(null);
  const [mode, setMode] = useState<'burndown' | 'burnup'>('burndown');

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

  if (sprintsQ.isLoading) return <div className="flex justify-center py-16"><Spinner size={20} /></div>;
  if (sprintsQ.error) return <EmptyState title="Could not load sprints" body={workError(sprintsQ.error)} />;
  if (!sprints.length) return <EmptyState title="No sprints yet" body="Start a sprint from the Backlog to see its burndown." />;

  const d = q.data;
  const unit = d?.unit;
  const sprint = d?.sprint;
  let lastCell: { label: string; value: string; tone?: 'red' } = { label: 'Days left', value: '—' };
  if (sprint?.state === 'CLOSED') {
    lastCell = { label: 'Completed on', value: sprint.completedAt ? formatDate(sprint.completedAt) : '—' };
  } else if (sprint?.endAt) {
    const left = Math.ceil((new Date(sprint.endAt).getTime() - Date.now()) / 86_400_000);
    lastCell = left < 0 ? { label: 'Overdue by', value: `${-left} ${-left === 1 ? 'day' : 'days'}`, tone: 'red' } : { label: 'Days left', value: String(left) };
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SprintSelect sprints={sprints} value={sprintId} onChange={setSprintId} />
        <div className="ml-auto inline-flex rounded-[var(--w-radius)] border border-[var(--w-border-strong)] p-0.5" role="tablist" aria-label="Chart type">
          {(['burndown', 'burnup'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                'h-[24px] rounded-[4px] px-2.5 text-[12px] font-medium',
                mode === m ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
              )}
            >
              {m === 'burndown' ? 'Burndown' : 'Burnup'}
            </button>
          ))}
        </div>
      </div>

      {q.isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={20} /></div>
      ) : q.error ? (
        <EmptyState title="Could not load the burndown" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : d && stats ? (
        <>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <StatCell label="Committed" value={fmtValue(stats.committed, unit)} hint="At sprint start" />
            <StatCell label="Completed" value={fmtValue(stats.completed, unit)} tone="green" />
            <StatCell label="Remaining" value={fmtValue(stats.remaining, unit)} />
            <StatCell label={lastCell.label} value={lastCell.value} tone={lastCell.tone} hint={sprint?.endAt ? `Ends ${formatDate(sprint.endAt)}` : undefined} />
          </div>
          {d.sprint.goal && (
            <div className="text-[13px] text-[var(--w-text-2)]">
              <span className="font-medium text-[var(--w-text)]">Sprint goal:</span> {d.sprint.goal}
            </div>
          )}
          <Card>
            {!d.points.length ? (
              <EmptyState title="No data for this sprint yet" body="Numbers are recorded once a day after the sprint starts." />
            ) : (
              <>
                <div className="mb-3">
                  <Legend
                    items={mode === 'burndown'
                      ? [{ label: 'Remaining', color: 'var(--w-accent)' }, { label: 'Guideline', color: 'var(--w-text-3)', dashed: true }]
                      : [{ label: 'Completed', color: 'var(--w-green)' }, { label: 'Scope', color: 'var(--w-text-2)' }]}
                  />
                </div>
                <div className="h-[300px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    {/* Sprint mới chạy 1–2 ngày thì đường chỉ có 1–2 điểm — Recharts không vẽ
                        được đường từ 1 điểm, nên bật chấm để người xem vẫn thấy số liệu. */}
                    <LineChart data={d.points} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                      <CartesianGrid stroke="var(--w-border)" vertical={false} />
                      <XAxis dataKey="day" tickFormatter={fmtDay} tick={axisTick} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={16} />
                      <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={48}
                        label={{ value: unitLabel(unit), angle: -90, position: 'insideLeft', offset: 18, fill: 'var(--w-text-3)', fontSize: 11 }} />
                      <Tooltip content={<ChartTooltip unit={unit} labelFormat={fmtDay} />} cursor={{ stroke: 'var(--w-border-strong)' }} />
                      {mode === 'burndown' ? (
                        <>
                          <Line type="linear" dataKey="ideal" name="Guideline" stroke="var(--w-text-3)" strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                          <Line type="stepAfter" dataKey="remaining" name="Remaining" stroke="var(--w-accent)" strokeWidth={2} dot={d.points.filter((x) => x.remaining !== null).length < 3 ? { r: 3.5, fill: 'var(--w-accent)', strokeWidth: 0 } : false} activeDot={{ r: 4 }} isAnimationActive={false} />
                        </>
                      ) : (
                        <>
                          <Line type="stepAfter" dataKey="total" name="Scope" stroke="var(--w-text-2)" strokeWidth={1.5} dot={d.points.filter((x) => x.total !== null).length < 3 ? { r: 3, fill: 'var(--w-text-2)', strokeWidth: 0 } : false} isAnimationActive={false} />
                          <Line type="stepAfter" dataKey="done" name="Completed" stroke="var(--w-green)" strokeWidth={2} dot={d.points.filter((x) => x.done !== null).length < 3 ? { r: 3.5, fill: 'var(--w-green)', strokeWidth: 0 } : false} activeDot={{ r: 4 }} isAnimationActive={false} />
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </Card>
        </>
      ) : null}
    </div>
  );
}
