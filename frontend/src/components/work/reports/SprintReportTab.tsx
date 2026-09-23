'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError, type ProjectConfig, type SprintReportItem } from '@/lib/work-api';
import { wk, type Lookups } from '@/components/work/hooks';
import { EmptyState, formatDate, Spinner } from '@/components/work/ui';
import { num, SectionTitle, SprintSelect, unitLabel, useAllSprints, useReportableSprints } from './shared';

export default function SprintReportTab({ pid, config, lk }: { pid: number; config: ProjectConfig; lk: Lookups }) {
  const sprintsQ = useAllSprints(pid);
  const sprints = useReportableSprints(sprintsQ.data);
  const [sprintId, setSprintId] = useState<number | null>(null);

  useEffect(() => {
    if (!sprints.length) return;
    if (sprintId === null || !sprints.some((s) => s.id === sprintId)) setSprintId(sprints[0].id);
  }, [sprints, sprintId]);

  const q = useQuery({
    queryKey: [...wk.reports(pid), 'sprint', sprintId],
    queryFn: () => workApi.sprintReport(pid, sprintId!),
    enabled: sprintId !== null,
  });

  const byNumber = useMemo(() => {
    const m = new Map<number, SprintReportItem>();
    q.data?.report.completed.forEach((i) => m.set(i.number, i));
    q.data?.report.incomplete.forEach((i) => m.set(i.number, i));
    return m;
  }, [q.data]);

  if (sprintsQ.isLoading) return <div className="flex justify-center py-16"><Spinner size={20} /></div>;
  if (sprintsQ.error) return <EmptyState title="Could not load sprints" body={workError(sprintsQ.error)} />;
  if (!sprints.length) return <EmptyState title="No sprints yet" body="Start a sprint from the Backlog to see its report." />;

  const href = (n: number) => `/work/${config.workspace.slug}/${config.key}/issue/${n}`;
  const d = q.data;
  const r = d?.report;
  const u = unitLabel(r?.unit);
  const total = r ? r.completed.length + r.incomplete.length : 0;
  const scopeChanged = !!r && (r.added.length > 0 || r.removed.length > 0);

  const issueRow = (n: number, item?: SprintReportItem) => (
    <li key={n} className="flex min-w-0 items-center gap-3 border-b border-[var(--w-border)] px-3 py-2 last:border-0">
      <Link href={href(n)} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{lk.issueKey(n)}</Link>
      <Link href={href(n)} className="min-w-0 flex-1 truncate text-[13px] hover:underline">{item?.title ?? <span className="text-[var(--w-text-3)]">Open issue</span>}</Link>
      {item && <span className="shrink-0 text-[12px] tabular-nums text-[var(--w-text-3)]">{num(item.points)} {u}</span>}
    </li>
  );

  const section = (title: string, nums: number[], empty: string, items?: SprintReportItem[]) => (
    <section>
      <SectionTitle right={<span className="text-[12px] text-[var(--w-text-3)]">{nums.length}</span>}>{title}</SectionTitle>
      {nums.length ? (
        <ul className="rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
          {nums.map((n, i) => issueRow(n, items?.[i] ?? byNumber.get(n)))}
        </ul>
      ) : (
        <div className="rounded-[var(--w-radius-lg)] border border-dashed border-[var(--w-border-strong)] px-3 py-3 text-[12px] text-[var(--w-text-3)]">{empty}</div>
      )}
    </section>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SprintSelect sprints={sprints} value={sprintId} onChange={setSprintId} />
        {d && (
          <span className="text-[12px] text-[var(--w-text-3)]">
            {d.sprint.state === 'CLOSED'
              ? `Completed ${d.sprint.completedAt ? formatDate(d.sprint.completedAt) : ''} · snapshot at completion`
              : 'In progress · live data'}
          </span>
        )}
      </div>

      {q.isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={20} /></div>
      ) : q.error ? (
        <EmptyState title="Could not load the sprint report" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : r ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[15px] font-semibold">
              {r.completed.length} of {total} {total === 1 ? 'issue' : 'issues'} completed
              <span className="text-[var(--w-text-3)]"> · </span>
              {num(r.completedPoints)} of {num(r.committedPoints)} {u}
            </div>
            {scopeChanged && (
              <span className="rounded-full border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--w-accent-text)]">
                Scope changed · +{r.added.length} / −{r.removed.length}
              </span>
            )}
          </div>
          {d?.sprint.goal && (
            <div className="text-[13px] text-[var(--w-text-2)]"><span className="font-medium text-[var(--w-text)]">Sprint goal:</span> {d.sprint.goal}</div>
          )}
          {section('Completed issues', r.completed.map((i) => i.number), 'No issues were completed.', r.completed)}
          {section('Not completed', r.incomplete.map((i) => i.number), 'Everything in this sprint was completed.', r.incomplete)}
          {section('Added after sprint start', r.added, 'No issues were added after the sprint started.')}
          {section('Removed from sprint', r.removed, 'No issues were removed from the sprint.')}
        </>
      ) : null}
    </div>
  );
}
