'use client';

import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, formatDate, Spinner } from '@/components/work/ui';
import { axisTick, Card, ChartTooltip, Legend, num, SectionTitle, unitLabel } from './shared';

export default function VelocityTab({ pid }: { pid: number }) {
  const q = useQuery({ queryKey: [...wk.reports(pid), 'velocity'], queryFn: () => workApi.velocity(pid) });

  if (q.isLoading) return <div className="flex justify-center py-16"><Spinner size={20} /></div>;
  if (q.error) return <EmptyState title="Could not load velocity" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />;
  const d = q.data;
  if (!d || !d.sprints.length) {
    return <EmptyState title="No completed sprints yet" body="Velocity appears once your team completes its first sprint." />;
  }
  const u = unitLabel(d.unit);
  const shown = Math.min(3, d.sprints.length);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[12px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Average velocity</div>
        <div className="mt-0.5 text-[22px] font-semibold tabular-nums">
          {d.average === null ? '—' : `${num(d.average)} ${u}`}
          <span className="ml-2 text-[13px] font-normal text-[var(--w-text-3)]">(last {shown} {shown === 1 ? 'sprint' : 'sprints'})</span>
        </div>
      </div>

      <Card>
        <div className="mb-3">
          <Legend items={[{ label: 'Committed', color: 'var(--w-text-3)' }, { label: 'Completed', color: 'var(--w-accent)' }]} />
        </div>
        <div className="h-[280px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={d.sprints} margin={{ top: 8, right: 8, bottom: 0, left: -8 }} barGap={3} barCategoryGap="24%">
              <CartesianGrid stroke="var(--w-border)" vertical={false} />
              <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} interval={0}
                tickFormatter={(s: string) => (s.length > 12 ? `${s.slice(0, 11)}…` : s)} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={48}
                label={{ value: u, angle: -90, position: 'insideLeft', offset: 18, fill: 'var(--w-text-3)', fontSize: 11 }} />
              <Tooltip content={<ChartTooltip unit={d.unit} />} cursor={{ fill: 'var(--w-hover)' }} />
              <Bar dataKey="committedPoints" name="Committed" fill="var(--w-text-3)" radius={[3, 3, 0, 0]} maxBarSize={28} isAnimationActive={false} />
              <Bar dataKey="completedPoints" name="Completed" fill="var(--w-accent)" radius={[3, 3, 0, 0]} maxBarSize={28} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div>
        <SectionTitle>Sprints</SectionTitle>
        <div className="overflow-x-auto rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
          <table className="w-full min-w-[480px] text-[13px]">
            <thead>
              <tr className="border-b border-[var(--w-border)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
                <th className="px-3 py-2 font-medium">Sprint</th>
                <th className="px-3 py-2 font-medium">Completed on</th>
                <th className="px-3 py-2 text-right font-medium">Committed</th>
                <th className="px-3 py-2 text-right font-medium">Completed</th>
                <th className="px-3 py-2 text-right font-medium">% completed</th>
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
