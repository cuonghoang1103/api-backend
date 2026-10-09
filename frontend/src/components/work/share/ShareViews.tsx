'use client';

/**
 * Các khung xem của trang chia sẻ công khai /work/share/<token>: Board,
 * Backlog, Reports, Tests + bảng chi tiết thẻ. CHỈ ĐỌC — không kéo thả,
 * không nút sửa. Dữ liệu từ các endpoint /work/share/* (không cần đăng nhập).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarDays, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  workApi, workError, type RunStatus, type ShareIssue, type ShareSummary, type StatusCategory,
} from '@/lib/work-api';
import {
  EmptyState, formatDate, IssueTypeIcon, PRIORITIES, PriorityIcon, Spinner, StatusBadge, UserAvatar, WorkPortal,
} from '../ui';
import { axisTick, Card, ChartTooltip, fmtDay, Legend, num, SectionTitle, StatCell, unitLabel } from '../reports/shared';
import { CycleStateBadge, RUN_META, RUN_ORDER, StatusBar } from '../tests/runStatus';
import { wt } from '@/components/work/i18n';

// ─── Tra cứu ─────────────────────────────────────────────────────

type SharedStatus = ShareSummary['workflows'][number]['statuses'][number];
type SharedType = ShareSummary['issueTypes'][number];
type SharedMember = ShareSummary['members'][number];

export interface ShareLookups {
  statuses: Map<number, SharedStatus>;
  types: Map<number, SharedType>;
  members: Map<number, SharedMember>;
  /** Cột board = trạng thái của workflow mặc định. */
  columns: SharedStatus[];
}

export function useShareLookups(s: ShareSummary | undefined): ShareLookups {
  return useMemo(() => {
    const statuses = new Map<number, SharedStatus>();
    for (const w of s?.workflows ?? []) for (const st of w.statuses) statuses.set(st.id, st);
    const def = s?.workflows.find((w) => w.isDefault) ?? s?.workflows[0];
    return {
      statuses,
      types: new Map((s?.issueTypes ?? []).map((t) => [t.id, t])),
      members: new Map((s?.members ?? []).map((m) => [m.id, m])),
      columns: [...(def?.statuses ?? [])].sort((a, b) => a.position - b.position),
    };
  }, [s]);
}

const shareKey = (token: string, ...rest: unknown[]) => ['work', 'share', token, ...rest] as const;

/** Thành viên công khai chỉ có tên + ảnh — dựng dáng WorkUser cho UserAvatar. */
function asUser(m: SharedMember) {
  return { username: m.name, fullName: m.name, displayName: m.name, avatarUrl: m.avatarUrl };
}

function Assignee({ id, lk, withName }: { id: number | null; lk: ShareLookups; withName?: boolean }) {
  const m = id !== null ? lk.members.get(id) : undefined;
  // Người được giao không phải ADMIN/MEMBER (vd khách hàng) không có trong danh sách công khai.
  const name = id === null ? wt('common.unassigned') : m?.name ?? wt('share.vMember');
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5" title={name}>
      {m ? <UserAvatar user={asUser(m)} size={20} /> : <UserAvatar user={null} size={20} />}
      {withName && <span className={cn('truncate', id === null && 'text-[var(--w-text-3)]')}>{name}</span>}
    </span>
  );
}

function Loading() {
  return <div className="flex justify-center py-16"><Spinner size={20} /></div>;
}

function LoadError({ error, retry, what }: { error: unknown; retry: () => void; what: string }) {
  return <EmptyState title={wt('share.vLoadFailed', { what })} body={workError(error)} action={<button type="button" className="w-btn" onClick={retry}>{wt('common.tryAgain')}</button>} />;
}

const isOverdue = (i: ShareIssue, lk: ShareLookups) =>
  !!i.dueDate && lk.statuses.get(i.statusId)?.category !== 'DONE' && new Date(`${i.dueDate.slice(0, 10)}T23:59:59Z`).getTime() < Date.now();

// ─── Board ───────────────────────────────────────────────────────

function BoardCard({ issue, lk, onOpen }: { issue: ShareIssue; lk: ShareLookups; onOpen: (n: number) => void }) {
  const done = lk.statuses.get(issue.statusId)?.category === 'DONE';
  const overdue = isOverdue(issue, lk);
  return (
    <button
      type="button"
      onClick={() => onOpen(issue.number)}
      className="w-full rounded-[7px] border border-[var(--w-border)] bg-[var(--w-panel)] px-2.5 py-2 text-left text-[13px] transition-colors hover:border-[var(--w-border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--w-accent)]"
    >
      <p className={cn('mb-2 line-clamp-3 leading-snug', done && 'text-[var(--w-text-3)] line-through decoration-[var(--w-text-3)]')}>{issue.title}</p>
      <div className="flex items-center gap-2 text-[11px] text-[var(--w-text-3)]">
        <IssueTypeIcon type={lk.types.get(issue.typeId)} size={13} />
        <span className="font-mono">{issue.key}</span>
        {issue.dueDate && (
          <span className={cn('flex items-center gap-0.5', overdue && 'font-medium text-[var(--w-red)]')} title={overdue ? wt('common.overdue') : wt('common.dueDate')}>
            <CalendarDays size={11} />{formatDate(issue.dueDate)}
          </span>
        )}
        <span className="ml-auto flex items-center gap-1.5">
          {issue.storyPoints !== null && (
            <span className="rounded-full bg-[var(--w-sunken)] px-1.5 py-px font-medium tabular text-[var(--w-text-2)]" title={wt('share.vSp')}>{wt('share.vPts', { count: issue.storyPoints })}</span>
          )}
          <PriorityIcon priority={issue.priority} size={14} />
          <Assignee id={issue.assigneeId} lk={lk} />
        </span>
      </div>
    </button>
  );
}

/** Vùng cuộn ngang có mờ dần ở mép khi còn nội dung bị khuất — cho người xem biết còn cột. */
function HScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 2, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2 });
  }, []);
  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [measure]);
  return (
    <div className="relative">
      <div ref={ref} onScroll={measure} className="overflow-x-auto pb-3 [scrollbar-color:var(--w-border-strong)_transparent] [scrollbar-width:thin]">
        {children}
      </div>
      {edges.left && <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--w-bg)] to-transparent" />}
      {edges.right && <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--w-bg)] to-transparent" />}
    </div>
  );
}

export function ShareBoard({ token, summary, lk, onOpen }: { token: string; summary: ShareSummary; lk: ShareLookups; onOpen: (n: number) => void }) {
  const q = useQuery({ queryKey: shareKey(token, 'issues', 'board'), queryFn: () => workApi.shareIssues(token, 'board'), retry: 1 });

  const byColumn = useMemo(() => {
    const map = new Map<number, ShareIssue[]>(lk.columns.map((c) => [c.id, []]));
    const firstOfCategory = (cat: StatusCategory | undefined) => lk.columns.find((c) => c.category === cat)?.id ?? lk.columns[0]?.id;
    for (const i of q.data ?? []) {
      // Thẻ thuộc workflow khác: xếp vào cột đầu tiên cùng nhóm trạng thái.
      const col = map.has(i.statusId) ? i.statusId : firstOfCategory(lk.statuses.get(i.statusId)?.category);
      if (col !== undefined) map.get(col)?.push(i);
    }
    return map;
  }, [q.data, lk]);

  if (q.isLoading) return <Loading />;
  if (q.error) return <LoadError error={q.error} retry={() => q.refetch()} what={wt('share.wBoard')} />;
  if (!lk.columns.length) return <EmptyState title={wt('share.vNoWorkflow')} />;

  const active = summary.sprints.find((s) => s.state === 'ACTIVE');

  return (
    <div>
      {active && (
        <div className="mb-3 text-[13px] text-[var(--w-text-2)]">
          <span className="font-medium text-[var(--w-text)]">{active.name}</span>
          {active.endAt && <span className="text-[var(--w-text-3)]">{wt('share.vEnds', { d: formatDate(active.endAt) })}</span>}
          {active.goal && <span className="block truncate sm:inline"><span className="hidden sm:inline"> · </span>{wt('share.vGoal', { g: active.goal })}</span>}
        </div>
      )}
      <p className="mb-2 text-[12px] text-[var(--w-text-3)]">
        {(q.data?.length ?? 0)} {(q.data?.length ?? 0) === 1 ? 'issue' : 'issues'} · sub-tasks are not listed separately — open an issue to see its sub-tasks.
      </p>
      {/* Cột co giãn để vừa màn hình rộng; hẹp hơn thì cuộn ngang, có thanh cuộn + mép mờ. */}
      <HScroll>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${lk.columns.length}, minmax(220px, 1fr))` }}>
          {lk.columns.map((c) => {
            const items = byColumn.get(c.id) ?? [];
            const points = items.reduce((s, i) => s + (i.storyPoints ?? 0), 0);
            return (
              <div key={c.id} className="flex min-w-0 flex-col">
                <div className="mb-2 flex h-7 items-center gap-2 px-1">
                  <span className="truncate text-[12px] font-semibold uppercase tracking-[0.03em] text-[var(--w-text-2)]">{c.name}</span>
                  <span className="text-[12px] tabular text-[var(--w-text-3)]">{items.length}</span>
                  {points > 0 && <span className="ml-auto text-[11px] tabular text-[var(--w-text-3)]" title={wt('share.vSp')}>{wt('rep.pts', { n: num(points) })}</span>}
                </div>
                <div className="flex min-h-[120px] flex-col gap-1.5 rounded-[8px] bg-[var(--w-sunken)] p-1.5">
                  {items.map((i) => <BoardCard key={i.number} issue={i} lk={lk} onOpen={onOpen} />)}
                  {!items.length && <div className="px-2 py-4 text-center text-[12px] text-[var(--w-text-3)]">{wt('share.vNoIssues')}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </HScroll>
    </div>
  );
}

// ─── Backlog ─────────────────────────────────────────────────────

function BacklogRow({ issue, lk, onOpen }: { issue: ShareIssue; lk: ShareLookups; onOpen: (n: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(issue.number)}
      className="flex w-full items-center gap-2.5 border-b border-[var(--w-border)] px-3 py-2 text-left text-[13px] last:border-b-0 hover:bg-[var(--w-hover)]"
    >
      <IssueTypeIcon type={lk.types.get(issue.typeId)} size={13} />
      <span className="w-[72px] shrink-0 truncate font-mono text-[12px] text-[var(--w-text-3)]">{issue.key}</span>
      <span className="min-w-0 flex-1 truncate">{issue.title}</span>
      <StatusBadge status={lk.statuses.get(issue.statusId)} className="hidden shrink-0 sm:inline-flex" />
      <span className="hidden shrink-0 sm:inline-flex"><PriorityIcon priority={issue.priority} size={14} /></span>
      <span className="w-7 shrink-0 text-right text-[12px] tabular text-[var(--w-text-2)]" title={wt('share.vSp')}>{issue.storyPoints ?? ''}</span>
      <Assignee id={issue.assigneeId} lk={lk} />
    </button>
  );
}

export function ShareBacklog({ token, summary, lk, onOpen }: { token: string; summary: ShareSummary; lk: ShareLookups; onOpen: (n: number) => void }) {
  const q = useQuery({ queryKey: shareKey(token, 'issues', 'backlog'), queryFn: () => workApi.shareIssues(token, 'backlog'), retry: 1 });

  const groups = useMemo(() => {
    const sprints = [...summary.sprints].sort((a, b) => Number(b.state === 'ACTIVE') - Number(a.state === 'ACTIVE'));
    const known = new Set(sprints.map((s) => s.id));
    const rows = q.data ?? [];
    return [
      ...sprints.map((s) => ({ id: `s${s.id}`, name: s.name, sprint: s, items: rows.filter((i) => i.sprintId === s.id) })),
      { id: 'backlog', name: wt('share.vBacklog'), sprint: null, items: rows.filter((i) => i.sprintId === null || !known.has(i.sprintId)) },
    ];
  }, [q.data, summary.sprints]);

  if (q.isLoading) return <Loading />;
  if (q.error) return <LoadError error={q.error} retry={() => q.refetch()} what={wt('share.wBacklog')} />;
  if (!q.data?.length) return <EmptyState title={wt('share.vNothingBacklog')} body={wt('share.vNothingBacklogBody')} />;

  return (
    <div className="space-y-5">
      {groups.filter((g) => g.items.length || g.sprint?.state === 'ACTIVE').map((g) => {
        const points = g.items.reduce((s, i) => s + (i.storyPoints ?? 0), 0);
        return (
          <section key={g.id}>
            <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 px-1">
              <h3 className="text-[13px] font-semibold">{g.name}</h3>
              {g.sprint?.state === 'ACTIVE' && (
                <span className="rounded-[4px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-1.5 text-[11px] font-medium leading-[18px] text-[var(--w-accent-text)]">{wt('studio.stActive')}</span>
              )}
              {g.sprint && (g.sprint.startAt || g.sprint.endAt) && (
                <span className="text-[12px] text-[var(--w-text-3)]">{formatDate(g.sprint.startAt)} – {formatDate(g.sprint.endAt)}</span>
              )}
              <span className="text-[12px] text-[var(--w-text-3)]">
                {wt('rep.nIssues', { count: g.items.length })}{points > 0 ? ` · ${wt('rep.pts', { n: num(points) })}` : ''}
              </span>
            </div>
            {g.sprint?.goal && <p className="mb-2 px-1 text-[12px] text-[var(--w-text-2)]">{wt('share.vGoal', { g: g.sprint.goal })}</p>}
            <div className={cn('overflow-hidden rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]', !g.items.length && 'border-dashed')}>
              {g.items.map((i) => <BacklogRow key={i.number} issue={i} lk={lk} onOpen={onOpen} />)}
              {!g.items.length && <div className="px-3 py-5 text-center text-[12px] text-[var(--w-text-3)]">{wt('share.vNoOpenSprint')}</div>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ─── Reports ─────────────────────────────────────────────────────

export function ShareReportsView({ token }: { token: string }) {
  const q = useQuery({ queryKey: shareKey(token, 'reports'), queryFn: () => workApi.shareReports(token), retry: 1 });
  if (q.isLoading) return <Loading />;
  if (q.error || !q.data) return <LoadError error={q.error} retry={() => q.refetch()} what={wt('share.wReports')} />;
  const { totals, burndown, velocity, unit } = q.data;
  const pct = totals.issues ? Math.round((totals.done / totals.issues) * 100) : 0;
  const pctPts = totals.points ? Math.round((totals.donePoints / totals.points) * 100) : 0;
  const u = unitLabel(unit);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatCell label={wt('share.vIssuesDone')} value={`${totals.done} / ${totals.issues}`} hint={wt('share.vPctComplete', { n: pct })} tone="green" />
        <StatCell label={wt('rep.openIssues')} value={totals.issues - totals.done} />
        <StatCell label={unit === 'HOURS' ? wt('share.vHoursDone') : wt('share.vPointsDone')} value={`${num(totals.donePoints)} / ${num(totals.points)}`} hint={wt('share.vPctEst', { n: pctPts })} tone="accent" />
        <StatCell label={wt('share.vAvgVel')} value={velocity?.average != null ? `${num(velocity.average)} ${u}` : '—'} hint={velocity?.sprints.length ? wt('share.vLast3') : wt('share.vNoCompleted')} />
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--w-sunken)]" title={wt('share.vPctIssuesDone', { n: pct })}>
        <div className="h-full rounded-full bg-[var(--w-green)]" style={{ width: `${pct}%` }} />
      </div>

      <div>
        <SectionTitle right={burndown ? <span className="text-[12px] text-[var(--w-text-3)]">{burndown.sprint.name}</span> : undefined}>{wt('share.vBurndown')}</SectionTitle>
        <Card>
          {!burndown ? (
            <EmptyState title={wt('pf.noActiveSprint')} body={wt('share.vBurndownBody')} />
          ) : !burndown.points.length ? (
            <EmptyState title={wt('share.vNoData')} body={wt('share.vNoDataBody')} />
          ) : (
            <>
              <div className="mb-3"><Legend items={[{ label: wt('share.vRemaining'), color: 'var(--w-accent)' }, { label: wt('share.vGuideline'), color: 'var(--w-text-3)', dashed: true }]} /></div>
              <div className="h-[260px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={burndown.points} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                    <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
                    <XAxis dataKey="day" tickFormatter={fmtDay} tick={axisTick} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={16} />
                    <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={48} />
                    <Tooltip content={<ChartTooltip unit={burndown.unit} labelFormat={fmtDay} />} cursor={{ stroke: 'var(--w-border-strong)' }} />
                    <Line type="linear" dataKey="ideal" name="Guideline" stroke="var(--w-text-3)" strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    <Line
                      type="stepAfter" dataKey="remaining" name="Remaining" stroke="var(--w-chart-1)" strokeWidth={2} activeDot={{ r: 4 }} isAnimationActive={false}
                      dot={burndown.points.filter((x) => x.remaining !== null).length < 3 ? { r: 3.5, fill: 'var(--w-chart-1)', strokeWidth: 0 } : false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </Card>
      </div>

      <div>
        <SectionTitle>{wt('share.vVelocity')}</SectionTitle>
        <Card>
          {!velocity || !velocity.sprints.length ? (
            <EmptyState title={wt('share.vNoSprintsYet')} body={wt('share.vVelBody')} />
          ) : (
            <>
              <div className="mb-3"><Legend items={[{ label: wt('share.vCommitted'), color: 'var(--w-text-3)' }, { label: wt('rep.completed'), color: 'var(--w-accent)' }]} /></div>
              <div className="h-[260px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={velocity.sprints} margin={{ top: 8, right: 8, bottom: 0, left: -8 }} barGap={3} barCategoryGap="24%">
                    <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
                    <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} interval={0}
                      tickFormatter={(s: string) => (s.length > 12 ? `${s.slice(0, 11)}…` : s)} />
                    <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={48} />
                    <Tooltip content={<ChartTooltip unit={velocity.unit} />} cursor={{ fill: 'var(--w-hover)' }} />
                    <Bar dataKey="committedPoints" name="Committed" fill="var(--w-text-3)" radius={[3, 3, 0, 0]} maxBarSize={28} isAnimationActive={false} />
                    <Bar dataKey="completedPoints" name="Completed" fill="var(--w-chart-1)" radius={[3, 3, 0, 0]} maxBarSize={28} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── Tests ───────────────────────────────────────────────────────

export function ShareTestsView({ token }: { token: string }) {
  const q = useQuery({ queryKey: shareKey(token, 'tests'), queryFn: () => workApi.shareTests(token), retry: 1 });
  if (q.isLoading) return <Loading />;
  if (q.error) return <LoadError error={q.error} retry={() => q.refetch()} what={wt('share.wTests')} />;
  if (!q.data?.length) return <EmptyState title={wt('share.vNoCycles')} body={wt('share.vNoCyclesBody')} />;

  return (
    <div className="overflow-x-auto rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
      <table className="w-full min-w-[640px] text-[13px]">
        <thead>
          <tr className="border-b border-[var(--w-border)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
            <th className="px-3 py-2 font-medium">{wt('share.vCycle')}</th>
            <th className="px-3 py-2 font-medium">{wt('share.vState')}</th>
            <th className="w-[200px] px-3 py-2 font-medium">{wt('common.progress')}</th>
            <th className="px-3 py-2 text-right font-medium">{wt('share.vPassRate')}</th>
            <th className="px-3 py-2 font-medium">{wt('share.vResults')}</th>
          </tr>
        </thead>
        <tbody>
          {q.data.map((c) => {
            const counts = c.counts as Record<RunStatus, number>;
            const meta = [c.environment, c.build && wt('share.vBuild', { b: c.build })].filter(Boolean).join(' · ');
            return (
              <tr key={c.id} className="border-b border-[var(--w-border)] align-top last:border-0">
                <td className="px-3 py-2.5">
                  <div className="font-medium">{c.name}</div>
                  <div className="mt-0.5 text-[12px] text-[var(--w-text-3)]">{meta || wt('share.vCreated', { d: formatDate(c.createdAt) })}</div>
                </td>
                <td className="px-3 py-2.5"><CycleStateBadge state={c.state} /></td>
                <td className="px-3 py-2.5">
                  <StatusBar counts={counts} total={c.total} className="mt-1.5" />
                  <div className="mt-1 text-[11px] tabular text-[var(--w-text-3)]">{wt('share.vExecuted', { a: c.executed, b: c.total })}</div>
                </td>
                <td className="px-3 py-2.5 text-right tabular">
                  {c.passRate === null ? <span className="text-[var(--w-text-3)]">—</span> : (
                    <span className={cn('font-semibold', c.passRate >= 90 ? 'text-[var(--w-green)]' : c.passRate < 70 ? 'text-[var(--w-red)]' : '')}>{num(c.passRate)}%</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[var(--w-text-2)]">
                    {RUN_ORDER.filter((s) => counts[s]).map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 whitespace-nowrap">
                        <span className="h-2 w-2 rounded-full" style={{ background: RUN_META[s].color }} />
                        {RUN_META[s].label} <span className="tabular font-medium text-[var(--w-text)]">{counts[s]}</span>
                      </span>
                    ))}
                    {!c.total && <span className="text-[var(--w-text-3)]">{wt('share.vNoTests')}</span>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Chi tiết thẻ (chỉ đọc) ──────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[30px] items-center gap-3 text-[13px]">
      <span className="w-[104px] shrink-0 text-[var(--w-text-3)]">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function ShareIssuePanel({ token, number, summary, lk, onClose, onOpen }: {
  token: string; number: number; summary: ShareSummary; lk: ShareLookups; onClose: () => void; onOpen: (n: number) => void;
}) {
  const q = useQuery({ queryKey: shareKey(token, 'issue', number), queryFn: () => workApi.shareIssue(token, number), retry: 1 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const i = q.data;
  const type = i ? lk.types.get(i.typeId) : undefined;
  const sprint = i?.sprintId ? summary.sprints.find((s) => s.id === i.sprintId) : undefined;
  const priority = PRIORITIES.find((p) => p.value === i?.priority);

  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[70] bg-black/30" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={i ? `${i.key} ${i.title}` : wt('common.issue')}
          style={{ boxShadow: 'var(--w-shadow-pop)' }}
          className="absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col border-l border-[var(--w-border)] bg-[var(--w-panel)]"
        >
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-4">
            {i && <IssueTypeIcon type={type} size={14} />}
            <span className="font-mono text-[12px] text-[var(--w-text-2)]">{i?.key ?? `${number}`}</span>
            <span className="ml-1 rounded-[4px] border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-3)]">{wt('share.vReadOnly')}</span>
            <button type="button" onClick={onClose} className="w-btn w-btn-ghost w-btn-icon w-btn-sm ml-auto" aria-label={wt('common.close')}><X size={15} /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {q.isLoading ? <Loading /> : q.error || !i ? (
              <EmptyState title={wt('share.vUnavailable')} body={workError(q.error, wt('share.vCouldNot'))} />
            ) : (
              <>
                {i.parent && (
                  <button type="button" onClick={() => onOpen(i.parent!.number)} className="mb-2 inline-flex max-w-full items-center gap-1 text-[12px] text-[var(--w-text-2)] hover:text-[var(--w-accent-text)]">
                    <span className="font-mono">{summary.project.key}-{i.parent.number}</span>
                    <span className="truncate">{i.parent.title}</span>
                    <ChevronRight size={12} className="shrink-0" />
                  </button>
                )}
                <h2 className="text-[18px] font-semibold leading-snug">{i.title}</h2>

                <div className="mt-4 rounded-[8px] border border-[var(--w-border)] px-3 py-2">
                  <Row label={wt('common.status')}><StatusBadge status={lk.statuses.get(i.statusId)} /></Row>
                  <Row label={wt('common.type')}><span className="inline-flex items-center gap-1.5"><IssueTypeIcon type={type} size={13} />{type?.name ?? '—'}</span></Row>
                  <Row label={wt('common.priority')}><span className="inline-flex items-center gap-1.5"><PriorityIcon priority={i.priority} size={14} />{priority?.label ?? wt('pspec.sevMedium')}</span></Row>
                  <Row label={wt('common.assignee')}><Assignee id={i.assigneeId} lk={lk} withName /></Row>
                  {sprint && <Row label={wt('common.sprint')}>{sprint.name}</Row>}
                  {i.storyPoints !== null && <Row label={wt('common.storyPoints')}><span className="tabular">{num(i.storyPoints)}</span></Row>}
                  {i.startDate && <Row label={wt('common.startDate')}>{formatDate(i.startDate)}</Row>}
                  <Row label={wt('common.dueDate')}>
                    {i.dueDate ? <span className={cn(isOverdue(i, lk) && 'font-medium text-[var(--w-red)]')}>{formatDate(i.dueDate)}{isOverdue(i, lk) ? wt('share.vOverdueSp') : ''}</span> : <span className="text-[var(--w-text-3)]">{wt('common.none')}</span>}
                  </Row>
                  {i.resolvedAt && <Row label={wt('common.resolved')}>{formatDate(i.resolvedAt)}</Row>}
                  <Row label={wt('common.created')}>{formatDate(i.createdAt)}</Row>
                </div>

                {i.description !== null ? (
                  <div className="mt-6">
                    <h3 className="mb-2 text-[13px] font-semibold">{wt('common.description')}</h3>
                    {i.description.trim()
                      ? <div className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-[var(--w-text)]">{i.description}</div>
                      : <p className="text-[13px] text-[var(--w-text-3)]">{wt('portal.noDescription')}</p>}
                    {(i.images ?? []).length > 0 && (
                      <div className="mt-3 flex flex-col gap-3">
                        {(i.images ?? []).map((src, n) => (
                          // eslint-disable-next-line @next/next/no-img-element -- ảnh qua API của link, không qua next/image
                          <img key={src} src={src} alt={wt('share.vImageN', { n: n + 1 })} loading="lazy" className="max-w-full rounded-[6px] border border-[var(--w-border)]" />
                        ))}
                      </div>
                    )}
                  </div>
                ) : !summary.options.descriptions && (
                  <p className="mt-6 text-[12px] text-[var(--w-text-3)]">{wt('share.vNoDesc')}</p>
                )}

                {i.children.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-[13px] font-semibold">{wt('share.vChildIssues')} <span className="font-normal text-[var(--w-text-3)]">{i.children.length}</span></h3>
                    <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
                      {i.children.map((c) => (
                        <button
                          key={c.number}
                          type="button"
                          onClick={() => onOpen(c.number)}
                          className="flex w-full items-center gap-2.5 border-b border-[var(--w-border)] px-3 py-2 text-left text-[13px] last:border-b-0 hover:bg-[var(--w-hover)]"
                        >
                          <span className="shrink-0 font-mono text-[12px] text-[var(--w-text-3)]">{summary.project.key}-{c.number}</span>
                          <span className="min-w-0 flex-1 truncate">{c.title}</span>
                          <StatusBadge status={lk.statuses.get(c.statusId)} className="shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>
      </div>
    </WorkPortal>
  );
}

