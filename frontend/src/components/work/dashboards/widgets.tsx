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
import { cn } from '@/lib/utils';
import {
  workApi, workError, type DashboardWidget, type GroupBy, type IssueCard, type ProjectConfig, type StatsGroup, type WidgetKind,
} from '@/lib/work-api';
import { wk, type Lookups } from '../hooks';
import { OPEN_ISSUES_JQL, counterHint } from '../openIssues';
import KpiTile, { type KpiTone } from '../KpiTile';
import { IssueTypeIcon, PRIORITIES, Spinner, StatusBadge, UserAvatar, formatDate } from '../ui';
import { axisTick, fmtDay, fmtValue, Legend, unitLabel, useAllSprints, useReportableSprints } from '../reports/shared';
import { jqlErrorOf, jqlListUrl } from '../search/jql';
import { govApi, govKeys } from '@/lib/work-s3b-api';
import { ScoreBadge } from '../governance/shared';
import { wt } from '@/components/work/i18n';

// ─── Danh mục widget ─────────────────────────────────────────────

export const WIDGET_META: Record<WidgetKind, { label: string; description: string; defaultTitle: string; usesQuery: boolean }> = {
  filter: { get label() { return wt('dash.l_filter'); }, get description() { return wt('dash.d_filter'); }, get defaultTitle() { return wt('dash.t_filter'); }, usesQuery: true },
  counter: { get label() { return wt('dash.l_counter'); }, get description() { return wt('dash.d_counter'); }, get defaultTitle() { return wt('dash.t_counter'); }, usesQuery: true },
  pie: { get label() { return wt('dash.l_pie'); }, get description() { return wt('dash.d_pie'); }, get defaultTitle() { return wt('dash.t_pie'); }, usesQuery: true },
  bar: { get label() { return wt('dash.l_bar'); }, get description() { return wt('dash.d_bar'); }, get defaultTitle() { return wt('dash.t_bar'); }, usesQuery: true },
  created_resolved: { get label() { return wt('dash.l_created_resolved'); }, get description() { return wt('dash.d_created_resolved'); }, get defaultTitle() { return wt('dash.t_created_resolved'); }, usesQuery: true },
  burndown: { get label() { return wt('dash.l_burndown'); }, get description() { return wt('dash.d_burndown'); }, get defaultTitle() { return wt('dash.t_burndown'); }, usesQuery: false },
  my_issues: { get label() { return wt('dash.l_my_issues'); }, get description() { return wt('dash.d_my_issues'); }, get defaultTitle() { return wt('dash.t_my_issues'); }, usesQuery: false },
  health: { get label() { return wt('dash.l_health'); }, get description() { return wt('dash.d_health'); }, get defaultTitle() { return wt('dash.t_health'); }, usesQuery: false },
  text: { get label() { return wt('dash.l_text'); }, get description() { return wt('dash.d_text'); }, get defaultTitle() { return wt('dash.t_text'); }, usesQuery: false },
  top_risks: { get label() { return wt('dash.l_top_risks'); }, get description() { return wt('dash.d_top_risks'); }, get defaultTitle() { return wt('dash.t_top_risks'); }, usesQuery: false },
};

export const WIDGET_KINDS: WidgetKind[] = ['filter', 'counter', 'pie', 'bar', 'created_resolved', 'burndown', 'my_issues', 'health', 'top_risks', 'text'];

export const GROUP_BY_OPTIONS: Array<{ value: GroupBy; label: string }> = [
  { value: 'status', get label() { return wt('common.status'); } },
  { value: 'statusCategory', get label() { return wt('dash.gb_statusCategory'); } },
  { value: 'assignee', get label() { return wt('common.assignee'); } },
  { value: 'type', get label() { return wt('dash.gb_type'); } },
  { value: 'priority', get label() { return wt('common.priority'); } },
  { value: 'label', get label() { return wt('dash.gb_label'); } },
  { value: 'sprint', get label() { return wt('common.sprint'); } },
  { value: 'component', get label() { return wt('dash.gb_component'); } },
];

export const newWidgetId = () => Math.random().toString(36).slice(2, 10);

/** Bộ widget khởi đầu — chỉ dùng JQL chung chung để dự án nào cũng hợp lệ. */
export function defaultWidgets(): DashboardWidget[] {
  return [
    { id: newWidgetId(), kind: 'counter', title: wt('rep.openIssues'), query: OPEN_ISSUES_JQL, size: 'half' },
    { id: newWidgetId(), kind: 'counter', title: wt('common.overdue'), query: `due < now() AND ${OPEN_ISSUES_JQL}`, size: 'half' },
    { id: newWidgetId(), kind: 'pie', title: wt('dash.tIssuesByStatus'), query: '', groupBy: 'status', size: 'half' },
    { id: newWidgetId(), kind: 'bar', title: wt('dash.tOpenByAssignee'), query: OPEN_ISSUES_JQL, groupBy: 'assignee', size: 'half' },
    { id: newWidgetId(), kind: 'created_resolved', title: wt('dash.tCr30'), query: '', days: 30, size: 'full' },
    { id: newWidgetId(), kind: 'my_issues', title: wt('dash.t_my_issues'), size: 'half' },
    { id: newWidgetId(), kind: 'health', title: wt('dash.t_health'), size: 'half' },
  ];
}

const MY_ISSUES_JQL = 'assignee = currentUser() AND statusCategory != Done ORDER BY priority';

// ─── Màu ─────────────────────────────────────────────────────────

const PALETTE = ['var(--w-chart-1)', 'var(--w-chart-2)', 'var(--w-chart-3)', 'var(--w-chart-4)', 'var(--w-chart-5)', 'var(--w-chart-6)', 'var(--w-chart-7)', 'var(--w-chart-8)'];
const CATEGORY_COLOR: Record<string, string> = { TODO: 'var(--w-status-todo)', IN_PROGRESS: 'var(--w-status-progress)', DONE: 'var(--w-status-done)' };

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
      <div className="text-[13px] font-medium">{jql ? wt('dash.invalidQ') : wt('dash.couldntLoad')}</div>
      <p className="max-w-[360px] text-[12px] text-[var(--w-text-2)]">{jql ? jql.message : workError(err)}</p>
      {!jql && <button type="button" className="w-btn w-btn-sm" onClick={onRetry}>{wt('common.tryAgain')}</button>}
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
        <span className="tabular">{q.data.items.length < q.data.total ? wt('dash.showingAofB', { a: q.data.items.length, b: q.data.total }) : wt('rep.nIssues', { count: q.data.total })}</span>
        <Link href={jqlListUrl(config.workspace.slug, config.key, jql)} className="text-[var(--w-accent-text)] hover:underline">{wt('dash.viewInIssues')}</Link>
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
      title={counterHint(jql)}
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
  if (!q.data.total) return <Empty>{wt('dash.noMatch')}</Empty>;
  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="relative h-[168px] w-[168px] shrink-0 max-[380px]:h-[132px] max-[380px]:w-[132px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="label" innerRadius="58%" outerRadius="100%" paddingAngle={data.length > 1 ? 1.5 : 0} stroke="none" isAnimationActive={false}>
              {/* UX-A ARIA: mỗi lát (path role=img của Recharts) cần tên. */}
              {data.map((g) => <Cell key={g.key} fill={g.color} aria-label={`${g.label}: ${g.count}`} />)}
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
  if (!q.data.total) return <Empty>{wt('dash.noMatch')}</Empty>;
  const height = Math.max(140, data.length * 30 + 24);
  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barCategoryGap={6}>
          <CartesianGrid stroke="var(--w-chart-grid)" horizontal={false} />
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
        <Legend items={[{ label: wt('dash.createdN', { n: totals.created }), color: 'var(--w-chart-1)' }, { label: wt('dash.resolvedN', { n: totals.resolved }), color: 'var(--w-green)' }]} />
        <span className="ml-auto text-[11px] text-[var(--w-text-3)]">{wt('dash.lastNDays', { n: days })}</span>
      </div>
      <div className="h-[200px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={q.data} margin={{ top: 6, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
            <XAxis dataKey="day" tickFormatter={fmtDay} tick={axisTick} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={24} />
            <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} width={40} />
            <Tooltip content={<CountTooltip labelFormat={fmtDay} />} cursor={{ stroke: 'var(--w-border-strong)' }} />
            <Line type="monotone" dataKey="created" name="Created" stroke="var(--w-chart-1)" strokeWidth={2} dot={false} isAnimationActive={false} />
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
  if (!chosen) return <Empty>{wt('dash.noStarted')}</Empty>;
  if (q.error || !q.data) return <WidgetError err={q.error} onRetry={() => q.refetch()} />;
  const d = q.data;
  const last = [...d.points].reverse().find((p) => p.remaining !== null);
  return (
    <div className="min-w-0">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
        <span className="font-medium">{d.sprint.name}</span>
        {d.sprint.state === 'ACTIVE' && <span className="rounded-[4px] bg-[var(--w-accent-soft)] px-1.5 text-[10px] font-semibold uppercase text-[var(--w-accent-text)]">{wt('studio.stActive')}</span>}
        <span className="ml-auto text-[var(--w-text-3)]">{wt('dash.remaining')} <span className="font-medium tabular-nums text-[var(--w-text)]">{fmtValue(last?.remaining ?? null, d.unit)}</span></span>
      </div>
      {!d.points.length ? (
        <Empty>{wt('share.vNoDataBody')}</Empty>
      ) : (
        <div className="h-[200px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={d.points} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
              <XAxis dataKey="day" tickFormatter={fmtDay} tick={axisTick} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={20} />
              <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} width={44}
                label={{ value: unitLabel(d.unit), angle: -90, position: 'insideLeft', offset: 18, fill: 'var(--w-text-3)', fontSize: 11 }} />
              <Tooltip content={<CountTooltip labelFormat={fmtDay} />} cursor={{ stroke: 'var(--w-border-strong)' }} />
              <Line type="linear" dataKey="ideal" name="Guideline" stroke="var(--w-text-3)" strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="stepAfter" dataKey="remaining" name="Remaining" stroke="var(--w-chart-1)" strokeWidth={2}
                dot={d.points.filter((x) => x.remaining !== null).length < 3 ? { r: 3, fill: 'var(--w-chart-1)', strokeWidth: 0 } : false} isAnimationActive={false} />
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
  const cells: { label: string; n: number; tone: KpiTone }[] = [
    { label: wt('common.overdue'), n: d.overdue.length, tone: 'red' },
    { label: wt('rep.due3'), n: d.dueSoon.length, tone: 'accent' },
    { label: wt('rep.stuck5'), n: d.stale.length, tone: 'orange' },
    { label: wt('dash.urgentNoOwner'), n: d.unassignedUrgent.length, tone: 'red' },
  ];
  const attention = [...d.overdue.map((i) => ({ ...i, why: wt('rep.dueD', { d: formatDate(i.dueDate) }) })), ...d.stale.map((i) => ({ ...i, why: wt('dash.idleD', { n: i.idleDays ?? '?' }) }))].slice(0, 4);
  const risk = d.sprintRisk;
  return (
    <div className="min-w-0 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {cells.map((c) => <KpiTile key={c.label} size="sm" label={c.label} value={c.n} tone={c.n ? c.tone : 'green'} />)}
      </div>
      {risk && (
        <p className={cn('text-[12px]', risk.atRisk ? 'text-[var(--w-red)]' : 'text-[var(--w-text-2)]')}>
          {wt('dash.riskLine', { s: risk.sprint, n: risk.remaining, u: unitLabel(d.unit), count: risk.daysLeft })}
          {risk.atRisk ? wt('dash.atRiskPace') : wt('dash.onTrackDot')}
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
  if (!paras.length) return <Empty>{wt('dash.noText')}</Empty>;
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
    case 'filter': return <IssueListWidget pid={pid} jql={jql} lk={lk} config={config} onOpenIssue={onOpenIssue} emptyText={wt('dash.noMatch')} />;
    case 'my_issues': return <IssueListWidget pid={pid} jql={MY_ISSUES_JQL} lk={lk} config={config} onOpenIssue={onOpenIssue} emptyText={wt('dash.nothingMine')} />;
    case 'counter': return <CounterWidget pid={pid} jql={jql} config={config} />;
    case 'pie': return <PieWidget pid={pid} jql={jql} groupBy={w.groupBy ?? 'status'} />;
    case 'bar': return <BarWidget pid={pid} jql={jql} groupBy={w.groupBy ?? 'status'} />;
    case 'created_resolved': return <CreatedResolvedWidget pid={pid} jql={jql} days={w.days ?? 30} />;
    case 'burndown': return <BurndownWidget pid={pid} sprintId={w.sprintId} />;
    case 'health': return <HealthWidget pid={pid} onOpenIssue={onOpenIssue} />;
    case 'text': return <TextWidget text={w.text} />;
    case 'top_risks': return <TopRisksWidget pid={pid} config={config} />;
    default: return <Empty>{wt('dash.unknown')}</Empty>;
  }
}

// ─── Top risks (đợt S3b — sổ RAID) ───────────────────────────────

function TopRisksWidget({ pid, config }: { pid: number; config: ProjectConfig }) {
  const q = useQuery({ queryKey: govKeys.topRisks(pid), queryFn: () => govApi.topRisks(pid, 5), staleTime: 30_000 });
  if (q.isLoading) return <div className="flex h-24 items-center justify-center"><Spinner /></div>;
  if (!q.data?.enabled) return <Empty>{wt('dash.raidOff')}</Empty>;
  if (!q.data.items.length) return <Empty>{wt('dash.noRisks')}</Empty>;
  const base = `/work/${config.workspace.slug}/${config.key}/raid`;
  return (
    <ul className="divide-y divide-[var(--w-border)]" data-testid="widget-top-risks">
      {q.data.items.map((r) => (
        <li key={r.id}>
          <Link href={`${base}?item=${r.number}`} className="flex min-w-0 items-center gap-2 py-2 text-[13px] hover:bg-[var(--w-hover)]">
            <ScoreBadge score={r.score} />
            <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{r.key}</span>
            <span className="min-w-0 flex-1 truncate">{r.title}</span>
            {r.owner && <UserAvatar user={r.owner} size={18} />}
          </Link>
        </li>
      ))}
    </ul>
  );
}
