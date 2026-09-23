'use client';

/**
 * Widget của dashboard: mỗi widget tự tải số liệu (TanStack Query) và tự
 * báo tải/lỗi của nó — một widget hỏng không kéo cả dashboard chết theo.
 * Khoá nằm dưới wk.widget(pid) ⊂ wk.reports(pid) nên sự kiện thời gian thực
 * làm tươi mọi widget.
 */

import Link from 'next/link';
import { useMemo, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { AlertTriangle, Clock, Hourglass, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  workApi, workError, type DashboardWidget, type GroupBy, type IssueCard, type ProjectConfig, type StatsGroup, type WidgetKind,
} from '@/lib/work-api';
import { wk, type Lookups } from '../hooks';
import { IssueTypeIcon, PRIORITIES, Spinner, StatusBadge, UserAvatar, formatDate } from '../ui';
import { axisTick, fmtDay, fmtValue, Legend, unitLabel, useAllSprints, useReportableSprints } from '../reports/shared';
import { jqlErrorOf, jqlListUrl } from '../search/jql';

// ─── Danh mục widget ─────────────────────────────────────────────

export const WIDGET_META: Record<WidgetKind, { label: string; description: string; defaultTitle: string; usesQuery: boolean }> = {
  filter: { label: 'Filter results', description: 'A list of issues matching a query', defaultTitle: 'Filter results', usesQuery: true },
  counter: { label: 'Issue count', description: 'One big number for a query', defaultTitle: 'Issue count', usesQuery: true },
  pie: { label: 'Pie chart', description: 'Share of issues by a field', defaultTitle: 'Issues breakdown', usesQuery: true },
  bar: { label: 'Bar chart', description: 'Issues per value of a field', defaultTitle: 'Issues breakdown', usesQuery: true },
  created_resolved: { label: 'Created vs resolved', description: 'Daily created and resolved issues', defaultTitle: 'Created vs resolved', usesQuery: true },
  burndown: { label: 'Sprint burndown', description: 'Remaining work in a sprint', defaultTitle: 'Sprint burndown', usesQuery: false },
  my_issues: { label: 'My open issues', description: 'Open issues assigned to the viewer', defaultTitle: 'My open issues', usesQuery: false },
  health: { label: 'Project health', description: 'Overdue, due soon, stuck and unassigned work', defaultTitle: 'Project health', usesQuery: false },
  text: { label: 'Text', description: 'Notes, links or instructions for the team', defaultTitle: 'Notes', usesQuery: false },
};

export const WIDGET_KINDS: WidgetKind[] = ['filter', 'counter', 'pie', 'bar', 'created_resolved', 'burndown', 'my_issues', 'health', 'text'];

export const GROUP_BY_OPTIONS: Array<{ value: GroupBy; label: string }> = [
  { value: 'status', label: 'Status' },
  { value: 'statusCategory', label: 'Status category' },
  { value: 'assignee', label: 'Assignee' },
  { value: 'type', label: 'Issue type' },
  { value: 'priority', label: 'Priority' },
  { value: 'label', label: 'Label' },
  { value: 'sprint', label: 'Sprint' },
  { value: 'component', label: 'Component' },
];

export const newWidgetId = () => Math.random().toString(36).slice(2, 10);

/** Bộ widget khởi đầu — chỉ dùng JQL chung chung để dự án nào cũng hợp lệ. */
export function defaultWidgets(): DashboardWidget[] {
  return [
    { id: newWidgetId(), kind: 'counter', title: 'Open issues', query: 'statusCategory != Done', size: 'half' },
    { id: newWidgetId(), kind: 'counter', title: 'Overdue', query: 'due < now() AND statusCategory != Done', size: 'half' },
    { id: newWidgetId(), kind: 'pie', title: 'Issues by status', query: '', groupBy: 'status', size: 'half' },
    { id: newWidgetId(), kind: 'bar', title: 'Open issues by assignee', query: 'statusCategory != Done', groupBy: 'assignee', size: 'half' },
    { id: newWidgetId(), kind: 'created_resolved', title: 'Created vs resolved (30 days)', query: '', days: 30, size: 'full' },
    { id: newWidgetId(), kind: 'my_issues', title: 'My open issues', size: 'half' },
    { id: newWidgetId(), kind: 'health', title: 'Project health', size: 'half' },
  ];
}

const MY_ISSUES_JQL = 'assignee = currentUser() AND statusCategory != Done ORDER BY priority';

// ─── Màu ─────────────────────────────────────────────────────────

const PALETTE = ['var(--w-accent)', 'var(--w-green)', 'var(--w-orange)', 'var(--w-blue)', 'var(--w-yellow)', 'var(--w-red)', '#9b51e0', '#64748b', '#0f9fb0', '#c2549d'];
const CATEGORY_COLOR: Record<string, string> = { TODO: 'var(--w-text-3)', IN_PROGRESS: 'var(--w-accent)', DONE: 'var(--w-green)' };

function groupColor(g: StatsGroup, i: number, groupBy: GroupBy | undefined): string {
  if (g.key === 'none') return 'var(--w-border-strong)';
  if (groupBy === 'statusCategory') return CATEGORY_COLOR[g.key] ?? PALETTE[i % PALETTE.length];
  if (groupBy === 'priority') {
    const p = PRIORITIES.find((x) => `p${x.value}` === g.key);
    if (p) return p.color;
  }
  return g.color || PALETTE[i % PALETTE.length];
}

/**
 * Màu cho cả nhóm, KHÔNG trùng nhau: nhiều trạng thái mặc định chung một màu
 * xám ⇒ biểu đồ tròn thành một khối. Màu thứ hai trở đi bị trùng thì lấy màu
 * chưa dùng kế tiếp trong bảng màu phân loại.
 */
function distinctColors(groups: StatsGroup[], groupBy: GroupBy | undefined): string[] {
  const used = new Set<string>();
  let next = 0;
  return groups.map((g, i) => {
    let c = groupColor(g, i, groupBy);
    const norm = c.toLowerCase();
    if (g.key !== 'none' && used.has(norm)) {
      for (let k = 0; k < PALETTE.length; k++) {
        const cand = PALETTE[(next + k) % PALETTE.length];
        if (!used.has(cand.toLowerCase())) { c = cand; next = (next + k + 1) % PALETTE.length; break; }
      }
    }
    used.add(c.toLowerCase());
    return c;
  });
}

// ─── Khung chung ─────────────────────────────────────────────────

function Loading() {
  return <div className="flex h-[140px] items-center justify-center"><Spinner size={18} /></div>;
}

function WidgetError({ err, onRetry }: { err: unknown; onRetry: () => void }) {
  const jql = jqlErrorOf(err);
  return (
    <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 px-2 text-center">
      <div className="text-[13px] font-medium">{jql ? 'This widget’s query is invalid' : 'Couldn’t load this widget'}</div>
      <p className="max-w-[360px] text-[12px] text-[var(--w-text-2)]">{jql ? jql.message : workError(err)}</p>
      {!jql && <button type="button" className="w-btn w-btn-sm" onClick={onRetry}>Try again</button>}
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[120px] items-center justify-center px-2 text-center text-[12.5px] text-[var(--w-text-3)]">{children}</div>;
}

const retryUnlessJql = (n: number, err: unknown) => !jqlErrorOf(err) && n < 2;

type TipRow = { name?: string | number; value?: number | string | (number | string)[] | null; color?: string; stroke?: string; fill?: string; payload?: { label?: string; color?: string } };

/** Tooltip đếm số thẻ (ChartTooltip của báo cáo gắn đơn vị điểm/giờ nên không dùng được). */
function CountTooltip({ active, payload, label, labelFormat }: { active?: boolean; payload?: TipRow[]; label?: string | number; labelFormat?: (l: string) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[var(--w-radius)] border border-[var(--w-border-strong)] bg-[var(--w-raised)] px-2.5 py-2 text-[12px] shadow-[var(--w-shadow-pop)]">
      {label !== undefined && label !== '' && <div className="mb-1 font-medium text-[var(--w-text)]">{labelFormat ? labelFormat(String(label)) : label}</div>}
      {payload.filter((p) => p.value !== null && p.value !== undefined).map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[var(--w-text-2)]">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.payload?.color ?? p.color ?? p.stroke ?? p.fill }} />
          <span className="truncate">{p.payload?.label ?? p.name}</span>
          <span className="ml-auto pl-3 font-medium tabular-nums text-[var(--w-text)]">{Math.round(Number(p.value) * 10) / 10}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Danh sách thẻ gọn ───────────────────────────────────────────

function IssueRows({ items, lk, onOpenIssue }: { items: IssueCard[]; lk: Lookups; onOpenIssue: (n: number) => void }) {
  return (
    <div className="-mx-1">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={() => onOpenIssue(it.number)}
          className="flex w-full min-w-0 items-center gap-2 rounded-[5px] px-1 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]"
        >
          <IssueTypeIcon type={lk.types.get(it.typeId)} size={12} />
          <span className="w-[62px] shrink-0 truncate font-mono text-[11px] text-[var(--w-text-3)]">{lk.issueKey(it.number)}</span>
          <span className="min-w-0 flex-1 truncate">{it.title}</span>
          <StatusBadge status={lk.statuses.get(it.statusId)} className="max-w-[40%] shrink-0 truncate max-sm:!hidden" />
          <UserAvatar user={it.assigneeId ? lk.members.get(it.assigneeId) : null} size={18} />
        </button>
      ))}
    </div>
  );
}

function IssueListWidget({ pid, jql, lk, config, onOpenIssue, emptyText }: {
  pid: number; jql: string; lk: Lookups; config: ProjectConfig; onOpenIssue: (n: number) => void; emptyText: string;
}) {
  const q = useQuery({
    queryKey: [...wk.widget(pid), 'list', jql],
    queryFn: () => workApi.search(pid, jql, { limit: 10 }),
    staleTime: 30_000,
    retry: retryUnlessJql,
  });
  if (q.isLoading) return <Loading />;
  if (q.error || !q.data) return <WidgetError err={q.error} onRetry={() => q.refetch()} />;
  if (!q.data.items.length) return <Empty>{emptyText}</Empty>;
  return (
    <div>
      <IssueRows items={q.data.items} lk={lk} onOpenIssue={onOpenIssue} />
      <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--w-text-3)]">
        <span className="tabular">{q.data.items.length < q.data.total ? `Showing ${q.data.items.length} of ${q.data.total}` : `${q.data.total} ${q.data.total === 1 ? 'issue' : 'issues'}`}</span>
        <Link href={jqlListUrl(config.workspace.slug, config.key, jql)} className="text-[var(--w-accent-text)] hover:underline">View in Issues</Link>
      </div>
    </div>
  );
}

// ─── Đếm ─────────────────────────────────────────────────────────

function CounterWidget({ pid, jql, config }: { pid: number; jql: string; config: ProjectConfig }) {
  const q = useQuery({
    queryKey: [...wk.widget(pid), 'count', jql],
    queryFn: () => workApi.search(pid, jql, { limit: 1 }),
    staleTime: 30_000,
    retry: retryUnlessJql,
  });
  if (q.isLoading) return <Loading />;
  if (q.error || !q.data) return <WidgetError err={q.error} onRetry={() => q.refetch()} />;
  return (
    <Link
      href={jqlListUrl(config.workspace.slug, config.key, jql)}
      className="group flex min-h-[120px] flex-col items-center justify-center rounded-[6px] hover:bg-[var(--w-hover)]"
      title={jql || 'All issues'}
    >
      <span className="text-[44px] font-semibold leading-none tabular-nums">{q.data.total}</span>
      <span className="mt-2 text-[12px] text-[var(--w-text-3)] group-hover:text-[var(--w-accent-text)]">{q.data.total === 1 ? 'issue' : 'issues'} · View</span>
    </Link>
  );
}

// ─── Tròn + cột ──────────────────────────────────────────────────

function useStats(pid: number, groupBy: GroupBy, jql: string) {
  return useQuery({
    queryKey: [...wk.widget(pid), 'stats', groupBy, jql],
    queryFn: () => workApi.stats(pid, groupBy, jql),
    staleTime: 30_000,
    retry: retryUnlessJql,
  });
}

function PieWidget({ pid, jql, groupBy }: { pid: number; jql: string; groupBy: GroupBy }) {
  const q = useStats(pid, groupBy, jql);
  const data = useMemo(() => {
    const groups = q.data?.groups ?? [];
    const colors = distinctColors(groups, groupBy);
    return groups.map((g, i) => ({ ...g, color: colors[i] }));
  }, [q.data, groupBy]);
  if (q.isLoading) return <Loading />;
  if (q.error || !q.data) return <WidgetError err={q.error} onRetry={() => q.refetch()} />;
  if (!q.data.total) return <Empty>No issues match this query.</Empty>;
  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="relative h-[168px] w-[168px] shrink-0 max-[380px]:h-[132px] max-[380px]:w-[132px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="label" innerRadius="58%" outerRadius="100%" paddingAngle={data.length > 1 ? 1.5 : 0} stroke="none" isAnimationActive={false}>
              {data.map((g) => <Cell key={g.key} fill={g.color} />)}
            </Pie>
            <Tooltip content={<CountTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[20px] font-semibold tabular-nums">{q.data.total}</span>
          <span className="text-[11px] text-[var(--w-text-3)]">issues</span>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        {data.slice(0, 8).map((g) => (
          <div key={g.key} className="flex min-w-0 items-center gap-2 text-[12.5px]">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: g.color }} />
            <span className="min-w-0 flex-1 truncate text-[var(--w-text-2)]">{g.label}</span>
            <span className="shrink-0 tabular-nums">{g.count}</span>
            <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-[var(--w-text-3)]">{Math.round((g.count / q.data!.total) * 100)}%</span>
          </div>
        ))}
        {data.length > 8 && <div className="text-[11px] text-[var(--w-text-3)]">+{data.length - 8} more</div>}
      </div>
    </div>
  );
}

function BarWidget({ pid, jql, groupBy }: { pid: number; jql: string; groupBy: GroupBy }) {
  const q = useStats(pid, groupBy, jql);
  const data = useMemo(() => {
    const groups = (q.data?.groups ?? []).slice(0, 15);
    const colors = distinctColors(groups, groupBy);
    return groups.map((g, i) => ({ ...g, color: colors[i] }));
  }, [q.data, groupBy]);
  if (q.isLoading) return <Loading />;
  if (q.error || !q.data) return <WidgetError err={q.error} onRetry={() => q.refetch()} />;
  if (!q.data.total) return <Empty>No issues match this query.</Empty>;
  const height = Math.max(140, data.length * 30 + 24);
  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barCategoryGap={6}>
          <CartesianGrid stroke="var(--w-border)" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={axisTick} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} />
          <YAxis
            type="category" dataKey="label" width={96} tick={axisTick} tickLine={false} axisLine={false}
            tickFormatter={(v: string) => (v.length > 14 ? `${v.slice(0, 13)}…` : v)}
          />
          <Tooltip content={<CountTooltip />} cursor={{ fill: 'var(--w-hover)' }} />
          <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={20} isAnimationActive={false}>
            {data.map((g) => <Cell key={g.key} fill={g.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Tạo mới vs xong ─────────────────────────────────────────────

function CreatedResolvedWidget({ pid, jql, days }: { pid: number; jql: string; days: number }) {
  const q = useQuery({
    queryKey: [...wk.widget(pid), 'created-resolved', days, jql],
    queryFn: () => workApi.createdResolved(pid, days, jql),
    staleTime: 60_000,
    retry: retryUnlessJql,
  });
  const totals = useMemo(() => (q.data ?? []).reduce((a, d) => ({ created: a.created + d.created, resolved: a.resolved + d.resolved }), { created: 0, resolved: 0 }), [q.data]);
  if (q.isLoading) return <Loading />;
  if (q.error || !q.data) return <WidgetError err={q.error} onRetry={() => q.refetch()} />;
  return (
    <div className="min-w-0">
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <Legend items={[{ label: `Created · ${totals.created}`, color: 'var(--w-red)' }, { label: `Resolved · ${totals.resolved}`, color: 'var(--w-green)' }]} />
        <span className="ml-auto text-[11px] text-[var(--w-text-3)]">Last {days} days</span>
      </div>
      <div className="h-[200px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={q.data} margin={{ top: 6, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="var(--w-border)" vertical={false} />
            <XAxis dataKey="day" tickFormatter={fmtDay} tick={axisTick} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={24} />
            <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} width={40} />
            <Tooltip content={<CountTooltip labelFormat={fmtDay} />} cursor={{ stroke: 'var(--w-border-strong)' }} />
            <Line type="monotone" dataKey="created" name="Created" stroke="var(--w-red)" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="resolved" name="Resolved" stroke="var(--w-green)" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Burndown ────────────────────────────────────────────────────

function BurndownWidget({ pid, sprintId }: { pid: number; sprintId: number | null | undefined }) {
  const sprintsQ = useAllSprints(pid);
  const sprints = useReportableSprints(sprintsQ.data);
  // Không chọn sprint ⇒ sprint đang chạy (hoặc sprint đóng gần nhất).
  const chosen = (sprintId && sprints.find((s) => s.id === sprintId)) || sprints[0];
  const q = useQuery({
    queryKey: [...wk.reports(pid), 'burndown', chosen?.id ?? null],
    queryFn: () => workApi.burndown(pid, chosen!.id),
    enabled: !!chosen,
  });
  if (sprintsQ.isLoading || (chosen && q.isLoading)) return <Loading />;
  if (sprintsQ.error) return <WidgetError err={sprintsQ.error} onRetry={() => sprintsQ.refetch()} />;
  if (!chosen) return <Empty>No started sprints yet. Start a sprint from the Backlog to see its burndown.</Empty>;
  if (q.error || !q.data) return <WidgetError err={q.error} onRetry={() => q.refetch()} />;
  const d = q.data;
  const last = [...d.points].reverse().find((p) => p.remaining !== null);
  return (
    <div className="min-w-0">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
        <span className="font-medium">{d.sprint.name}</span>
        {d.sprint.state === 'ACTIVE' && <span className="rounded-[4px] bg-[var(--w-accent-soft)] px-1.5 text-[10px] font-semibold uppercase text-[var(--w-accent-text)]">Active</span>}
        <span className="ml-auto text-[var(--w-text-3)]">Remaining <span className="font-medium tabular-nums text-[var(--w-text)]">{fmtValue(last?.remaining ?? null, d.unit)}</span></span>
      </div>
      {!d.points.length ? (
        <Empty>Numbers are recorded once a day after the sprint starts.</Empty>
      ) : (
        <div className="h-[200px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={d.points} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="var(--w-border)" vertical={false} />
              <XAxis dataKey="day" tickFormatter={fmtDay} tick={axisTick} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={20} />
              <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} width={44}
                label={{ value: unitLabel(d.unit), angle: -90, position: 'insideLeft', offset: 18, fill: 'var(--w-text-3)', fontSize: 11 }} />
              <Tooltip content={<CountTooltip labelFormat={fmtDay} />} cursor={{ stroke: 'var(--w-border-strong)' }} />
              <Line type="linear" dataKey="ideal" name="Guideline" stroke="var(--w-text-3)" strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="stepAfter" dataKey="remaining" name="Remaining" stroke="var(--w-accent)" strokeWidth={2}
                dot={d.points.filter((x) => x.remaining !== null).length < 3 ? { r: 3, fill: 'var(--w-accent)', strokeWidth: 0 } : false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── Sức khoẻ ────────────────────────────────────────────────────

function HealthWidget({ pid, onOpenIssue }: { pid: number; onOpenIssue: (n: number) => void }) {
  const q = useQuery({ queryKey: [...wk.reports(pid), 'insights'], queryFn: () => workApi.insights(pid), staleTime: 30_000 });
  if (q.isLoading) return <Loading />;
  if (q.error || !q.data) return <WidgetError err={q.error} onRetry={() => q.refetch()} />;
  const d = q.data;
  const cells = [
    { label: 'Overdue', n: d.overdue.length, icon: AlertTriangle, color: 'var(--w-red)' },
    { label: 'Due in 3 days', n: d.dueSoon.length, icon: Clock, color: 'var(--w-accent-text)' },
    { label: 'Stuck > 5 days', n: d.stale.length, icon: Hourglass, color: 'var(--w-orange)' },
    { label: 'Urgent, no owner', n: d.unassignedUrgent.length, icon: UserX, color: 'var(--w-red)' },
  ];
  const attention = [...d.overdue.map((i) => ({ ...i, why: `Due ${formatDate(i.dueDate)}` })), ...d.stale.map((i) => ({ ...i, why: `Idle ${i.idleDays}d` }))].slice(0, 4);
  const risk = d.sprintRisk;
  return (
    <div className="min-w-0 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {cells.map((c) => (
          <div key={c.label} className="min-w-0 rounded-[6px] border border-[var(--w-border)] px-2.5 py-2">
            <div className="flex items-center gap-1.5 truncate text-[11px] text-[var(--w-text-3)]"><c.icon size={12} style={{ color: c.n ? c.color : undefined }} /> {c.label}</div>
            <div className={cn('mt-0.5 text-[18px] font-semibold tabular-nums', !c.n && 'text-[var(--w-green)]')} style={c.n ? { color: c.color } : undefined}>{c.n}</div>
          </div>
        ))}
      </div>
      {risk && (
        <p className={cn('text-[12px]', risk.atRisk ? 'text-[var(--w-red)]' : 'text-[var(--w-text-2)]')}>
          {risk.sprint}: {risk.remaining} {unitLabel(d.unit)} left, {risk.daysLeft} {risk.daysLeft === 1 ? 'day' : 'days'} to go
          {risk.atRisk ? ' — at risk at the current pace.' : ' — on track.'}
        </p>
      )}
      {attention.length > 0 && (
        <div className="-mx-1">
          {attention.map((i) => (
            <button key={`${i.number}-${i.why}`} type="button" onClick={() => onOpenIssue(i.number)} className="flex w-full min-w-0 items-center gap-2 rounded-[5px] px-1 py-1 text-left text-[12.5px] hover:bg-[var(--w-hover)]">
              <span className="w-[62px] shrink-0 truncate font-mono text-[11px] text-[var(--w-text-3)]">{i.key}</span>
              <span className="min-w-0 flex-1 truncate">{i.title}</span>
              <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{i.why}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Chữ ─────────────────────────────────────────────────────────

function TextWidget({ text }: { text: string | undefined }) {
  const paras = (text ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (!paras.length) return <Empty>No text yet. Edit the dashboard to add notes.</Empty>;
  return (
    <div className="space-y-2 break-words text-[13px] leading-relaxed text-[var(--w-text-2)]">
      {paras.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
    </div>
  );
}

// ─── Cổng vào ────────────────────────────────────────────────────

export function WidgetBody({ w, pid, config, lk, onOpenIssue }: {
  w: DashboardWidget; pid: number; config: ProjectConfig; lk: Lookups; onOpenIssue: (n: number) => void;
}) {
  const jql = w.query ?? '';
  switch (w.kind) {
    case 'filter': return <IssueListWidget pid={pid} jql={jql} lk={lk} config={config} onOpenIssue={onOpenIssue} emptyText="No issues match this query." />;
    case 'my_issues': return <IssueListWidget pid={pid} jql={MY_ISSUES_JQL} lk={lk} config={config} onOpenIssue={onOpenIssue} emptyText="Nothing open is assigned to you." />;
    case 'counter': return <CounterWidget pid={pid} jql={jql} config={config} />;
    case 'pie': return <PieWidget pid={pid} jql={jql} groupBy={w.groupBy ?? 'status'} />;
    case 'bar': return <BarWidget pid={pid} jql={jql} groupBy={w.groupBy ?? 'status'} />;
    case 'created_resolved': return <CreatedResolvedWidget pid={pid} jql={jql} days={w.days ?? 30} />;
    case 'burndown': return <BurndownWidget pid={pid} sprintId={w.sprintId} />;
    case 'health': return <HealthWidget pid={pid} onOpenIssue={onOpenIssue} />;
    case 'text': return <TextWidget text={w.text} />;
    default: return <Empty>Unknown widget.</Empty>;
  }
}
