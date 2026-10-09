'use client';

/**
 * Biểu đồ dòng chảy + KPI (UX-B, 10/10/2026). Mỗi biểu đồ TỰ tải số liệu (TanStack Query, khoá dưới wk.reports(pid)
 * ⇒ sự kiện thời gian thực làm tươi) và đi qua ChartFrame (tiêu đề, cách tính, trạng thái, chú giải ẩn/hiện,
 * xuất PNG/CSV, bảng ẩn cho trình đọc màn hình). Dùng ở cả tab Reports lẫn widget dashboard (`bare`).
 *
 * Mọi con số do MÁY CHỦ tính (flowMetrics.ts, có test đáp án tay) — ở đây chỉ vẽ.
 */

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ComposedChart, Line, LineChart, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart,
  Tooltip, XAxis, YAxis, ZAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import { workApi, workError, userName, type EstimationUnit, type ProjectConfig } from '@/lib/work-api';
import { uxbApi, uxbKeys, type CycleItem } from '@/lib/work-uxb-api';
import { wk } from '../hooks';
import KpiTile, { KpiRow, type KpiTone } from '../KpiTile';
import { fmtDay, num, unitLabel, useAllSprints, useReportableSprints, SprintSelect } from '../reports/shared';
import { useWT, wt } from '@/components/work/i18n';
import ChartFrame, { type ChartStatus } from './ChartFrame';
import { AXIS_TICK, GRID, SERIES, bandColors } from './chartColors';

const statusOf = (q: { isLoading: boolean; error: unknown; data?: unknown }, empty: boolean): ChartStatus =>
  q.isLoading ? 'loading' : q.error ? 'error' : empty ? 'empty' : 'ready';

type TipRow = { name?: string | number; value?: unknown; color?: string; stroke?: string; fill?: string; payload?: Record<string, unknown> };

/** Tooltip chung theo token (nền tối không chói). `fmt` định dạng giá trị. */
export function FlowTooltip({ active, payload, label, labelFormat, fmt }: {
  active?: boolean; payload?: TipRow[]; label?: string | number; labelFormat?: (l: string) => string; fmt?: (v: number, name: string) => string;
}) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter((p) => p.value !== null && p.value !== undefined);
  if (!rows.length) return null;
  return (
    <div className="rounded-[var(--w-radius)] border border-[var(--w-border-strong)] bg-[var(--w-raised)] px-2.5 py-2 text-[12px] shadow-[var(--w-shadow-pop)]">
      {label !== undefined && label !== '' && <div className="mb-1 font-medium text-[var(--w-text)]">{labelFormat ? labelFormat(String(label)) : label}</div>}
      {rows.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[var(--w-text-2)]">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color ?? p.stroke ?? p.fill }} />
          <span className="truncate">{p.name}</span>
          <span className="ml-auto pl-3 font-medium tabular-nums text-[var(--w-text)]">{fmt ? fmt(Number(p.value), String(p.name)) : num(Number(p.value))}</span>
        </div>
      ))}
    </div>
  );
}

const days = (n: number | null | undefined) => (n === null || n === undefined ? '—' : wt('charts.nDays', { n: num(n) }));

// ─── CFD ─────────────────────────────────────────────────────────

export function CfdChart({ pid, days: range = 30, bare, height = 260 }: { pid: number; days?: number; bare?: boolean; height?: number }) {
  const q = useQuery({ queryKey: [...uxbKeys.base(pid), 'cfd', range], queryFn: () => uxbApi.cfd(pid, range), staleTime: 60_000 });
  const d = q.data;
  const colors = useMemo(() => bandColors(d?.bands ?? []), [d?.bands]);
  const total = (p: Record<string, unknown> | undefined) => (p ? (d?.bands ?? []).reduce((s, b) => s + Number(p[b.key] ?? 0), 0) : 0);
  const empty = !!d && (!d.points.length || d.points.every((p) => total(p) === 0));
  const series = (d?.bands ?? []).map((b) => ({ key: b.key, label: b.name, color: colors[b.key] }));
  const columns = [{ key: 'day', label: wt('charts.day') }, ...(d?.bands ?? []).map((b) => ({ key: b.key, label: b.name }))];
  const last = d?.points[d.points.length - 1];
  return (
    <ChartFrame
      title={wt('charts.cfd')} description={wt('charts.cfdDesc')} bare={bare} height={height}
      subtitle={d ? wt('charts.lastNDays', { n: d.days }) : undefined}
      status={statusOf(q, empty)} error={q.error ? workError(q.error) : undefined} onRetry={() => q.refetch()} emptyText={wt('charts.cfdEmpty')}
      series={series} rows={d?.points} columns={columns}
      summary={last ? wt('charts.cfdSummary', { n: d!.days, s: (d!.bands ?? []).map((b) => `${b.name} ${last[b.key]}`).join(', ') }) : undefined}
      testId="chart-cfd"
    >
      {(hidden) => (
        <div style={{ height }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={d!.points} margin={{ top: 6, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="day" tickFormatter={fmtDay} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={24} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<FlowTooltip labelFormat={fmtDay} />} cursor={{ stroke: 'var(--w-border-strong)' }} />
              {/* Done ở dưới cùng (vẽ trước), To Do trên cùng — quy ước CFD. */}
              {[...d!.bands].reverse().filter((b) => !hidden.has(b.key)).map((b) => (
                <Area key={b.key} type="linear" dataKey={b.key} name={b.name} stackId="cfd" stroke={colors[b.key]} fill={colors[b.key]} fillOpacity={0.85} strokeWidth={1} isAnimationActive={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

// ─── Cycle time ──────────────────────────────────────────────────

export function CycleTimeChart({ pid, days: range = 90, bare, height = 260, onOpenIssue }: { pid: number; days?: number; bare?: boolean; height?: number; onOpenIssue?: (n: number) => void }) {
  const q = useQuery({ queryKey: [...uxbKeys.base(pid), 'cycle', range], queryFn: () => uxbApi.cycleTime(pid, range), staleTime: 60_000 });
  const d = q.data;
  const pts = useMemo(() => (d?.items ?? []).map((i) => ({ ...i, x: new Date(i.resolvedAt).getTime() })), [d]);
  const cyc = pts.filter((p) => p.cycleDays !== null);
  const empty = !!d && !d.items.length;
  const series = [
    { key: 'cycle', label: wt('charts.cycle'), color: SERIES.completed },
    { key: 'lead', label: wt('charts.lead'), color: SERIES.scope },
    { key: 'p50', label: `P50 ${days(d?.cycle.p50)}`, color: SERIES.p50, dashed: true },
    { key: 'p85', label: `P85 ${days(d?.cycle.p85)}`, color: SERIES.p85, dashed: true },
    { key: 'p95', label: `P95 ${days(d?.cycle.p95)}`, color: SERIES.p95, dashed: true },
  ];
  const columns = [
    { key: 'number', label: wt('charts.issue') }, { key: 'day', label: wt('charts.resolvedOn') },
    { key: 'cycleDays', label: wt('charts.cycleDays') }, { key: 'leadDays', label: wt('charts.leadDays') },
  ];
  const fmtX = (t: number) => fmtDay(new Date(t).toISOString().slice(0, 10));
  return (
    <ChartFrame
      title={wt('charts.cycleTitle')} description={wt('charts.cycleDesc')} bare={bare} height={height}
      subtitle={d ? wt('charts.cycleSub', { count: d.items.length, n: d.days }) : undefined}
      status={statusOf(q, empty)} error={q.error ? workError(q.error) : undefined} onRetry={() => q.refetch()} emptyText={wt('charts.cycleEmpty')}
      series={series} defaultHidden={['lead']} rows={d?.items} columns={columns}
      summary={d ? wt('charts.cycleSummary', { count: d.items.length, a: days(d.cycle.p50), b: days(d.cycle.p85), c: days(d.cycle.p95) }) : undefined}
      testId="chart-cycle"
    >
      {(hidden) => (
        <div style={{ height }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 34, bottom: 0, left: -12 }}>
              <CartesianGrid stroke={GRID} />
              <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} scale="time" tickFormatter={fmtX} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={24} name={wt('charts.resolvedOn')} />
              <YAxis dataKey="y" type="number" tick={AXIS_TICK} tickLine={false} axisLine={false} width={44} name={wt('charts.daysAxis')}
                label={{ value: wt('charts.daysAxis'), angle: -90, position: 'insideLeft', offset: 18, fill: 'var(--w-text-3)', fontSize: 11 }} />
              <ZAxis range={[36, 36]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CycleTip />} />
              {!hidden.has('cycle') && (
                <Scatter name={wt('charts.cycle')} data={cyc.map((p) => ({ ...p, y: p.cycleDays }))} fill={SERIES.completed} fillOpacity={0.8} isAnimationActive={false}
                  onClick={(p: { payload?: CycleItem }) => p?.payload && onOpenIssue?.(p.payload.number)} cursor={onOpenIssue ? 'pointer' : undefined} />
              )}
              {!hidden.has('lead') && (
                <Scatter name={wt('charts.lead')} data={pts.map((p) => ({ ...p, y: p.leadDays }))} fill={SERIES.scope} fillOpacity={0.55} shape="diamond" isAnimationActive={false} />
              )}
              {(['p50', 'p85', 'p95'] as const).map((k) => d?.cycle[k] !== null && d?.cycle[k] !== undefined && !hidden.has(k) && (
                <ReferenceLine key={k} y={d.cycle[k]!} stroke={SERIES[k]} strokeDasharray="5 4" strokeWidth={1.5}
                  label={{ value: k.toUpperCase(), position: 'right', fill: 'var(--w-text-2)', fontSize: 10 }} ifOverflow="extendDomain" />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

function CycleTip({ active, payload }: { active?: boolean; payload?: Array<{ payload?: CycleItem & { y: number } }> }) {
  const p = active ? payload?.[0]?.payload : undefined;
  if (!p) return null;
  return (
    <div className="max-w-[260px] rounded-[var(--w-radius)] border border-[var(--w-border-strong)] bg-[var(--w-raised)] px-2.5 py-2 text-[12px] shadow-[var(--w-shadow-pop)]">
      <div className="font-medium text-[var(--w-text)]">#{p.number}{p.title ? ` · ${p.title}` : ''}</div>
      <div className="mt-0.5 text-[var(--w-text-2)]">{wt('charts.resolvedOn')}: {fmtDay(p.day)}</div>
      <div className="text-[var(--w-text-2)]">{wt('charts.cycle')}: <b className="tabular-nums text-[var(--w-text)]">{days(p.cycleDays)}</b> · {wt('charts.lead')}: <b className="tabular-nums text-[var(--w-text)]">{days(p.leadDays)}</b></div>
    </div>
  );
}

// ─── Throughput ──────────────────────────────────────────────────

export function ThroughputChart({ pid, weeks = 12, bare, height = 220 }: { pid: number; weeks?: number; bare?: boolean; height?: number }) {
  const q = useQuery({ queryKey: [...uxbKeys.base(pid), 'throughput', weeks], queryFn: () => uxbApi.throughput(pid, weeks), staleTime: 60_000 });
  const d = q.data;
  const empty = !!d && d.weeks.every((w) => !w.count);
  const series = [
    { key: 'count', label: wt('charts.issuesDone'), color: SERIES.done },
    { key: 'avg', label: wt('charts.avgPerWeek', { n: num(d?.average) }), color: SERIES.average, dashed: true },
  ];
  const columns = [
    { key: 'week', label: wt('charts.weekOf') }, { key: 'count', label: wt('charts.issuesDone') },
    { key: 'points', label: d ? `${unitLabel(d.unit)}` : wt('charts.points') },
  ];
  return (
    <ChartFrame
      title={wt('charts.throughput')} description={wt('charts.throughputDesc')} bare={bare} height={height}
      subtitle={d ? wt('charts.lastNWeeks', { n: d.weeks.length }) : undefined}
      status={statusOf(q, empty)} error={q.error ? workError(q.error) : undefined} onRetry={() => q.refetch()} emptyText={wt('charts.throughputEmpty')}
      series={series} rows={d?.weeks} columns={columns}
      summary={d ? wt('charts.throughputSummary', { n: d.weeks.length, a: num(d.average), t: d.weeks.reduce((s, w) => s + w.count, 0) }) : undefined}
      testId="chart-throughput"
    >
      {(hidden) => (
        <div style={{ height }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={d!.weeks} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="week" tickFormatter={fmtDay} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={16} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<FlowTooltip labelFormat={(l) => wt('charts.weekOfX', { d: fmtDay(l) })} fmt={(v) => String(v)} />} cursor={{ fill: 'var(--w-hover)' }} />
              {!hidden.has('count') && <Bar dataKey="count" name={wt('charts.issuesDone')} fill={SERIES.done} radius={[3, 3, 0, 0]} maxBarSize={28} isAnimationActive={false} />}
              {!hidden.has('avg') && d?.average !== null && d?.average !== undefined && (
                <ReferenceLine y={d.average} stroke={SERIES.average} strokeDasharray="5 4" strokeWidth={1.5} ifOverflow="extendDomain" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

// ─── Aging WIP ───────────────────────────────────────────────────

/** Rải ngang trong cột theo mã thẻ (cố định, không ngẫu nhiên — ảnh xuất ra lần nào cũng như nhau). */
const jitter = (id: number) => (((id * 2654435761) >>> 0) % 1000) / 1000 - 0.5;

export function AgingWipChart({ pid, bare, height = 260, onOpenIssue }: { pid: number; bare?: boolean; height?: number; onOpenIssue?: (n: number) => void }) {
  const q = useQuery({ queryKey: [...uxbKeys.base(pid), 'aging'], queryFn: () => uxbApi.agingWip(pid), staleTime: 60_000 });
  const d = q.data;
  const colors = useMemo(() => bandColors(d?.bands ?? []), [d?.bands]);
  const idx = useMemo(() => new Map((d?.bands ?? []).map((b, i) => [b.key, i])), [d?.bands]);
  const pts = useMemo(() => (d?.items ?? []).map((i) => ({ ...i, x: (idx.get(i.band) ?? 0) + jitter(i.issueId) * 0.6, y: i.ageDays })), [d, idx]);
  const empty = !!d && !d.items.length;
  const p85 = d?.reference.p85 ?? null;
  const older = p85 === null ? 0 : (d?.items ?? []).filter((i) => i.ageDays > p85).length;
  const series = [
    ...(d?.bands ?? []).map((b) => ({ key: b.key, label: b.name, color: colors[b.key] })),
    { key: 'p50', label: `P50 ${days(d?.reference.p50)}`, color: SERIES.p50, dashed: true },
    { key: 'p85', label: `P85 ${days(d?.reference.p85)}`, color: SERIES.p85, dashed: true },
  ];
  const bandName = (k: string) => d?.bands.find((b) => b.key === k)?.name ?? k;
  const columns = [
    { key: 'number', label: wt('charts.issue') }, { key: 'band', label: wt('common.status'), value: (r: { band: string }) => bandName(r.band) },
    { key: 'ageDays', label: wt('charts.ageDays') },
  ];
  return (
    <ChartFrame
      title={wt('charts.aging')} description={wt('charts.agingDesc')} bare={bare} height={height}
      subtitle={d ? `${wt('charts.wipN', { count: d.items.length })}${older ? ` · ${wt('charts.olderP85', { count: older })}` : ''}` : undefined}
      status={statusOf(q, empty)} error={q.error ? workError(q.error) : undefined} onRetry={() => q.refetch()} emptyText={wt('charts.agingEmpty')}
      series={series} rows={d?.items} columns={columns}
      summary={d ? wt('charts.agingSummary', { count: d.items.length, o: older }) : undefined}
      testId="chart-aging"
    >
      {(hidden) => (
        <div style={{ height }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 34, bottom: 0, left: -12 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="x" type="number" domain={[-0.5, Math.max(0.5, (d?.bands.length ?? 1) - 0.5)]} ticks={(d?.bands ?? []).map((_, i) => i)}
                tickFormatter={(i: number) => d?.bands[Math.round(i)]?.name ?? ''} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} interval={0} />
              <YAxis dataKey="y" type="number" tick={AXIS_TICK} tickLine={false} axisLine={false} width={44}
                label={{ value: wt('charts.ageDays'), angle: -90, position: 'insideLeft', offset: 18, fill: 'var(--w-text-3)', fontSize: 11 }} />
              <ZAxis range={[40, 40]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<AgingTip bandName={bandName} />} />
              {(d?.bands ?? []).filter((b) => !hidden.has(b.key)).map((b) => (
                <Scatter key={b.key} name={b.name} data={pts.filter((p) => p.band === b.key)} fill={colors[b.key]} isAnimationActive={false}
                  onClick={(p: { payload?: { number: number } }) => p?.payload && onOpenIssue?.(p.payload.number)} cursor={onOpenIssue ? 'pointer' : undefined} />
              ))}
              {(['p50', 'p85'] as const).map((k) => d?.reference[k] !== null && d?.reference[k] !== undefined && !hidden.has(k) && (
                <ReferenceLine key={k} y={d.reference[k]!} stroke={SERIES[k]} strokeDasharray="5 4" strokeWidth={1.5} ifOverflow="extendDomain"
                  label={{ value: k.toUpperCase(), position: 'right', fill: 'var(--w-text-2)', fontSize: 10 }} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

function AgingTip({ active, payload, bandName }: { active?: boolean; payload?: Array<{ payload?: { number: number; title?: string; band: string; ageDays: number } }>; bandName: (k: string) => string }) {
  const p = active ? payload?.[0]?.payload : undefined;
  if (!p) return null;
  return (
    <div className="max-w-[260px] rounded-[var(--w-radius)] border border-[var(--w-border-strong)] bg-[var(--w-raised)] px-2.5 py-2 text-[12px] shadow-[var(--w-shadow-pop)]">
      <div className="font-medium text-[var(--w-text)]">#{p.number}{p.title ? ` · ${p.title}` : ''}</div>
      <div className="mt-0.5 text-[var(--w-text-2)]">{bandName(p.band)} · <b className="tabular-nums text-[var(--w-text)]">{days(p.ageDays)}</b></div>
    </div>
  );
}

// ─── Release burnup / burndown ───────────────────────────────────

export function ReleaseBurnupChart({ pid, versionId: fixed, bare, height = 260 }: { pid: number; versionId?: number | null; bare?: boolean; height?: number }) {
  const vq = useQuery({ queryKey: [...wk.reports(pid), 'versions-lite'], queryFn: () => workApi.versions(pid), staleTime: 60_000 });
  const versions = useMemo(() => (vq.data ?? []).filter((v) => v.status !== 'ARCHIVED'), [vq.data]);
  const [picked, setPicked] = useState<number | null>(fixed ?? null);
  const [mode, setMode] = useState<'burnup' | 'burndown'>('burnup');
  const [by, setBy] = useState<'estimate' | 'count'>('estimate');
  useEffect(() => {
    if (fixed) { setPicked(fixed); return; }
    if (picked && versions.some((v) => v.id === picked)) return;
    const next = versions.find((v) => v.status === 'UNRELEASED') ?? versions[versions.length - 1];
    setPicked(next?.id ?? null);
  }, [fixed, versions, picked]);
  const q = useQuery({
    queryKey: [...uxbKeys.base(pid), 'release', picked, by],
    queryFn: () => uxbApi.releaseBurnup(pid, picked!, by),
    enabled: !!picked,
    staleTime: 60_000,
  });
  const d = q.data;
  const unitOf = (u: EstimationUnit | undefined, byCount: boolean | undefined) => (byCount ? wt('charts.issuesUnit') : unitLabel(u));
  const status: ChartStatus = vq.isLoading || (picked && q.isLoading) ? 'loading'
    : vq.error || q.error ? 'error'
      : !versions.length || !d || !d.points.length ? 'empty' : 'ready';
  const series = mode === 'burnup'
    ? [{ key: 'scope', label: wt('charts.scope'), color: SERIES.scope }, { key: 'done', label: wt('charts.done'), color: SERIES.done }]
    : [{ key: 'remaining', label: wt('charts.remaining'), color: SERIES.remaining }, { key: 'ideal', label: wt('charts.guideline'), color: SERIES.guideline, dashed: true }];
  const columns = [
    { key: 'day', label: wt('charts.day') }, { key: 'scope', label: wt('charts.scope') }, { key: 'done', label: wt('charts.done') },
    { key: 'remaining', label: wt('charts.remaining') }, { key: 'ideal', label: wt('charts.guideline') },
  ];
  const last = d?.points[d.points.length - 1];
  const toolbar = (
    <>
      {!fixed && versions.length > 0 && (
        <select aria-label={wt('charts.pickVersion')} value={picked ?? ''} onChange={(e) => setPicked(Number(e.target.value))} className="w-input h-[26px] w-auto max-w-[160px] py-0 pr-7 text-[12px]">
          {versions.map((v) => <option key={v.id} value={v.id}>{v.name}{v.status === 'RELEASED' ? wt('charts.releasedParen') : ''}</option>)}
        </select>
      )}
      <Seg value={mode} onChange={setMode} label={wt('charts.chartMode')} options={[['burnup', wt('charts.burnup')], ['burndown', wt('charts.burndown')]]} />
      <Seg value={by} onChange={setBy} label={wt('charts.measure')} options={[['estimate', wt('charts.byEstimate')], ['count', wt('charts.byCount')]]} />
    </>
  );
  return (
    <ChartFrame
      title={mode === 'burnup' ? wt('charts.releaseBurnup') : wt('charts.releaseBurndown')} description={wt('charts.releaseDesc')} bare={bare} height={height}
      subtitle={d ? `${d.version.name}${d.version.releaseDate ? ` · ${wt('charts.releaseOn', { d: fmtDay(d.version.releaseDate) })}` : ''}${d.forecast ? ` · ${wt('charts.forecast', { d: fmtDay(d.forecast) })}` : ''}` : undefined}
      status={status} error={vq.error ? workError(vq.error) : q.error ? workError(q.error) : undefined} onRetry={() => { vq.refetch(); q.refetch(); }}
      emptyText={!versions.length ? wt('charts.noVersions') : wt('charts.releaseEmpty')}
      series={series} rows={d?.points} columns={columns} toolbar={toolbar}
      summary={last ? wt('charts.releaseSummary', { v: d!.version.name, s: num(last.scope), dn: num(last.done), u: unitOf(d!.unit, d!.byCount) }) : undefined}
      fileName={d ? `release-${d.version.name}` : undefined}
      testId="chart-release"
    >
      {(hidden) => (
        <div style={{ height }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={d!.points} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="day" tickFormatter={fmtDay} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={20} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={44}
                label={{ value: unitOf(d!.unit, d!.byCount), angle: -90, position: 'insideLeft', offset: 18, fill: 'var(--w-text-3)', fontSize: 11 }} />
              <Tooltip content={<FlowTooltip labelFormat={fmtDay} />} cursor={{ stroke: 'var(--w-border-strong)' }} />
              {mode === 'burnup' ? (
                <>
                  {!hidden.has('scope') && <Line type="stepAfter" dataKey="scope" name={wt('charts.scope')} stroke={SERIES.scope} strokeWidth={1.5} dot={false} isAnimationActive={false} />}
                  {!hidden.has('done') && <Line type="stepAfter" dataKey="done" name={wt('charts.done')} stroke={SERIES.done} strokeWidth={2} dot={false} isAnimationActive={false} />}
                </>
              ) : (
                <>
                  {!hidden.has('ideal') && <Line type="linear" dataKey="ideal" name={wt('charts.guideline')} stroke={SERIES.guideline} strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} connectNulls />}
                  {!hidden.has('remaining') && <Line type="stepAfter" dataKey="remaining" name={wt('charts.remaining')} stroke={SERIES.remaining} strokeWidth={2} dot={false} isAnimationActive={false} />}
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

/** Nút phân đoạn nhỏ (aria-pressed) cho thanh công cụ biểu đồ. */
export function Seg<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: Array<[T, string]>; label: string }) {
  return (
    <div className="inline-flex rounded-[var(--w-radius)] border border-[var(--w-border-strong)] p-0.5" role="group" aria-label={label}>
      {options.map(([v, l]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}
          className={cn('h-[20px] rounded-[4px] px-2 text-[11.5px] font-medium', value === v ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
          {l}
        </button>
      ))}
    </div>
  );
}

// ─── Velocity (có đường trung bình) ──────────────────────────────

export function VelocityChart({ pid, bare, height = 260 }: { pid: number; bare?: boolean; height?: number }) {
  const q = useQuery({ queryKey: [...wk.reports(pid), 'velocity'], queryFn: () => workApi.velocity(pid) });
  const d = q.data;
  const u = unitLabel(d?.unit);
  const empty = !!d && !d.sprints.length;
  const series = [
    { key: 'committed', label: wt('charts.committed'), color: SERIES.committed },
    { key: 'completed', label: wt('charts.completed'), color: SERIES.completed },
    { key: 'avg', label: wt('charts.avg3'), color: SERIES.average },
  ];
  const columns = [
    { key: 'name', label: wt('common.sprint') }, { key: 'committedPoints', label: wt('charts.committed') },
    { key: 'completedPoints', label: wt('charts.completed') }, { key: 'rollingAverage', label: wt('charts.avg3') },
  ];
  return (
    <ChartFrame
      title={wt('charts.velocity')} description={wt('charts.velocityDesc')} bare={bare} height={height}
      subtitle={d && d.average !== null ? wt('charts.velocitySub', { n: num(d.average), u }) : undefined}
      status={statusOf(q, empty)} error={q.error ? workError(q.error) : undefined} onRetry={() => q.refetch()} emptyText={wt('rep.noCompletedBody')}
      series={series} rows={d?.sprints} columns={columns}
      summary={d ? wt('charts.velocitySummary', { count: d.sprints.length, n: num(d.average), u }) : undefined}
      testId="chart-velocity"
    >
      {(hidden) => (
        <div style={{ height }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={d!.sprints} margin={{ top: 8, right: 8, bottom: 0, left: -8 }} barGap={3} barCategoryGap="24%">
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} interval={0}
                tickFormatter={(s: string) => (s.length > 12 ? `${s.slice(0, 11)}…` : s)} />
              <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={48}
                label={{ value: u, angle: -90, position: 'insideLeft', offset: 18, fill: 'var(--w-text-3)', fontSize: 11 }} />
              <Tooltip content={<FlowTooltip fmt={(v) => `${num(v)} ${u}`} />} cursor={{ fill: 'var(--w-hover)' }} />
              {!hidden.has('committed') && <Bar dataKey="committedPoints" name={wt('charts.committed')} fill={SERIES.committed} radius={[3, 3, 0, 0]} maxBarSize={28} isAnimationActive={false} />}
              {!hidden.has('completed') && <Bar dataKey="completedPoints" name={wt('charts.completed')} fill={SERIES.completed} radius={[3, 3, 0, 0]} maxBarSize={28} isAnimationActive={false} />}
              {!hidden.has('avg') && <Line type="monotone" dataKey="rollingAverage" name={wt('charts.avg3')} stroke={SERIES.average} strokeWidth={2} dot={{ r: 3, fill: SERIES.average, strokeWidth: 0 }} isAnimationActive={false} />}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

// ─── Sprint burndown / burnup ────────────────────────────────────

export function SprintBurndownChart({ pid, sprintId: fixedId, bare, height = 260, mode: fixedMode, showPicker }: {
  pid: number; sprintId?: number | null; bare?: boolean; height?: number; mode?: 'burndown' | 'burnup'; showPicker?: boolean;
}) {
  const sprintsQ = useAllSprints(pid);
  const sprints = useReportableSprints(sprintsQ.data);
  const [picked, setPicked] = useState<number | null>(null);
  const [modeState, setMode] = useState<'burndown' | 'burnup'>('burndown');
  const mode = fixedMode ?? modeState;
  const chosen = (fixedId && sprints.find((s) => s.id === fixedId)) || sprints.find((s) => s.id === picked) || sprints[0];
  const q = useQuery({ queryKey: [...wk.reports(pid), 'burndown', chosen?.id ?? null], queryFn: () => workApi.burndown(pid, chosen!.id), enabled: !!chosen });
  const d = q.data;
  const u = unitLabel(d?.unit);
  const status: ChartStatus = sprintsQ.isLoading || (chosen && q.isLoading) ? 'loading'
    : sprintsQ.error || q.error ? 'error' : !chosen || !d || !d.points.length ? 'empty' : 'ready';
  const series = mode === 'burndown'
    ? [{ key: 'remaining', label: wt('charts.remaining'), color: SERIES.remaining }, { key: 'ideal', label: wt('charts.guideline'), color: SERIES.guideline, dashed: true }, { key: 'scope', label: wt('charts.scope'), color: SERIES.scope }]
    : [{ key: 'done', label: wt('charts.completed'), color: SERIES.done }, { key: 'scope', label: wt('charts.scope'), color: SERIES.scope }];
  const columns = [
    { key: 'day', label: wt('charts.day') }, { key: 'remaining', label: wt('charts.remaining') }, { key: 'ideal', label: wt('charts.guideline') },
    { key: 'total', label: wt('charts.scope') }, { key: 'done', label: wt('charts.completed') },
  ];
  const known = d?.points.filter((p) => p.remaining !== null) ?? [];
  const lastKnown = known[known.length - 1];
  const fewDots = known.length < 3;
  const toolbar = (
    <>
      {showPicker && sprints.length > 0 && <SprintSelect sprints={sprints} value={chosen?.id ?? null} onChange={setPicked} className="!h-[26px]" />}
      {!fixedMode && <Seg value={mode} onChange={setMode} label={wt('rep.chartType')} options={[['burndown', wt('charts.burndown')], ['burnup', wt('charts.burnup')]]} />}
    </>
  );
  return (
    <ChartFrame
      title={mode === 'burndown' ? wt('charts.sprintBurndown') : wt('charts.sprintBurnup')} description={mode === 'burndown' ? wt('charts.burndownDesc') : wt('charts.burnupDesc')}
      bare={bare} height={height}
      subtitle={d ? `${d.sprint.name}${lastKnown ? ` · ${wt('charts.remainingX', { n: num(lastKnown.remaining), u })}` : ''}` : undefined}
      status={status} error={sprintsQ.error ? workError(sprintsQ.error) : q.error ? workError(q.error) : undefined} onRetry={() => { sprintsQ.refetch(); q.refetch(); }}
      emptyText={!chosen ? wt('dash.noStarted') : wt('rep.noDataBody')}
      series={series} rows={d?.points} columns={columns} toolbar={toolbar}
      summary={d && lastKnown ? wt('charts.burndownSummary', { s: d.sprint.name, n: num(lastKnown.remaining), t: num(lastKnown.total), u }) : undefined}
      fileName={d ? `burndown-${d.sprint.name}` : undefined}
      testId="chart-burndown"
    >
      {(hidden) => (
        <div style={{ height }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={d!.points} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="day" tickFormatter={fmtDay} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={16} />
              <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={48}
                label={{ value: u, angle: -90, position: 'insideLeft', offset: 18, fill: 'var(--w-text-3)', fontSize: 11 }} />
              <Tooltip content={<FlowTooltip labelFormat={fmtDay} fmt={(v) => `${num(v)} ${u}`} />} cursor={{ stroke: 'var(--w-border-strong)' }} />
              {/* Sprint mới 1–2 ngày: Recharts không vẽ được đường từ 1 điểm ⇒ bật chấm. */}
              {mode === 'burndown' ? (
                <>
                  {!hidden.has('scope') && <Line type="stepAfter" dataKey="total" name={wt('charts.scope')} stroke={SERIES.scope} strokeWidth={1} strokeOpacity={0.6} dot={false} isAnimationActive={false} />}
                  {!hidden.has('ideal') && <Line type="linear" dataKey="ideal" name={wt('charts.guideline')} stroke={SERIES.guideline} strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />}
                  {!hidden.has('remaining') && <Line type="stepAfter" dataKey="remaining" name={wt('charts.remaining')} stroke={SERIES.remaining} strokeWidth={2} dot={fewDots ? { r: 3.5, fill: SERIES.remaining, strokeWidth: 0 } : false} activeDot={{ r: 4 }} isAnimationActive={false} />}
                </>
              ) : (
                <>
                  {!hidden.has('scope') && <Line type="stepAfter" dataKey="total" name={wt('charts.scope')} stroke={SERIES.scope} strokeWidth={1.5} dot={fewDots ? { r: 3, fill: SERIES.scope, strokeWidth: 0 } : false} isAnimationActive={false} />}
                  {!hidden.has('done') && <Line type="stepAfter" dataKey="done" name={wt('charts.completed')} stroke={SERIES.done} strokeWidth={2} dot={fewDots ? { r: 3.5, fill: SERIES.done, strokeWidth: 0 } : false} activeDot={{ r: 4 }} isAnimationActive={false} />}
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

// ─── Tải theo người ──────────────────────────────────────────────

export function LoadByPersonChart({ pid, bare }: { pid: number; bare?: boolean }) {
  const q = useQuery({ queryKey: [...uxbKeys.base(pid), 'load'], queryFn: () => uxbApi.loadByPerson(pid), staleTime: 30_000 });
  const d = q.data;
  const rows = useMemo(() => (d?.people ?? []).slice(0, 12).map((p) => ({ ...p, name: p.user ? userName(p.user) : wt('charts.unassigned') })), [d]);
  const empty = !!d && !d.people.length;
  const series = [
    { key: 'inProgress', label: wt('charts.inProgress'), color: SERIES.inProgress },
    { key: 'todo', label: wt('charts.todo'), color: SERIES.todo },
  ];
  const columns = [
    { key: 'name', label: wt('charts.person') }, { key: 'todo', label: wt('charts.todo') }, { key: 'inProgress', label: wt('charts.inProgress') },
    { key: 'overdue', label: wt('common.overdue') }, { key: 'blocked', label: wt('charts.blocked') }, { key: 'estimate', label: d ? unitLabel(d.unit) : '' },
  ];
  const height = Math.max(140, rows.length * 30 + 28);
  return (
    <ChartFrame
      title={wt('charts.workload')} description={wt('charts.workloadDesc')} bare={bare} height={height}
      status={statusOf(q, empty)} error={q.error ? workError(q.error) : undefined} onRetry={() => q.refetch()} emptyText={wt('charts.workloadEmpty')}
      series={series} rows={rows} columns={columns}
      summary={d ? wt('charts.workloadSummary', { count: rows.length }) : undefined}
      testId="chart-workload"
    >
      {(hidden) => (
        <div style={{ height }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barCategoryGap={6}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} />
              <YAxis type="category" dataKey="name" width={104} tick={AXIS_TICK} tickLine={false} axisLine={false} tickFormatter={(v: string) => (v.length > 15 ? `${v.slice(0, 14)}…` : v)} />
              <Tooltip content={<LoadTip unit={d?.unit} />} cursor={{ fill: 'var(--w-hover)' }} />
              {!hidden.has('inProgress') && <Bar dataKey="inProgress" stackId="l" name={wt('charts.inProgress')} fill={SERIES.inProgress} maxBarSize={20} isAnimationActive={false} />}
              {!hidden.has('todo') && <Bar dataKey="todo" stackId="l" name={wt('charts.todo')} fill={SERIES.todo} radius={[0, 3, 3, 0]} maxBarSize={20} isAnimationActive={false} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

function LoadTip({ active, payload, label, unit }: { active?: boolean; payload?: Array<{ payload?: { todo: number; inProgress: number; overdue: number; blocked: number; estimate: number } }>; label?: string; unit?: EstimationUnit }) {
  const p = active ? payload?.[0]?.payload : undefined;
  if (!p) return null;
  return (
    <div className="rounded-[var(--w-radius)] border border-[var(--w-border-strong)] bg-[var(--w-raised)] px-2.5 py-2 text-[12px] shadow-[var(--w-shadow-pop)]">
      <div className="mb-1 font-medium text-[var(--w-text)]">{label}</div>
      <div className="text-[var(--w-text-2)]">{wt('charts.inProgress')}: <b className="text-[var(--w-text)]">{p.inProgress}</b> · {wt('charts.todo')}: <b className="text-[var(--w-text)]">{p.todo}</b></div>
      <div className="text-[var(--w-text-2)]">{wt('common.overdue')}: <b className={p.overdue ? 'text-[var(--w-red-text)]' : 'text-[var(--w-text)]'}>{p.overdue}</b> · {wt('charts.blocked')}: <b className="text-[var(--w-text)]">{p.blocked}</b></div>
      <div className="text-[var(--w-text-2)]">{wt('charts.estimateLeft')}: <b className="text-[var(--w-text)]">{num(p.estimate)} {unitLabel(unit)}</b></div>
    </div>
  );
}

// ─── Hàng KPI có xu hướng ────────────────────────────────────────

function Trend({ value, previous, goodWhenDown }: { value: number; previous: number | null; goodWhenDown?: boolean }) {
  const { t } = useWT();
  if (previous === null) return <span>{t('charts.noTrend')}</span>;
  const diff = value - previous;
  if (diff === 0) return <span>{t('charts.sameAsWeekAgo')}</span>;
  const good = goodWhenDown ? diff < 0 : diff > 0;
  return (
    <span className={good ? 'text-[var(--w-green-text)]' : 'text-[var(--w-red-text)]'}>
      {diff > 0 ? '▲' : '▼'} {Math.abs(diff)} <span className="text-[var(--w-text-3)]">{t('charts.vsWeekAgo')}</span>
    </span>
  );
}

export function KpiStrip({ pid, config }: { pid: number; config: ProjectConfig }) {
  const q = useQuery({ queryKey: [...uxbKeys.base(pid), 'kpis'], queryFn: () => uxbApi.kpis(pid), staleTime: 30_000 });
  const d = q.data;
  if (q.isLoading) {
    return <KpiRow min={150}>{Array.from({ length: 6 }, (_, i) => <span key={i} className="w-skel h-[78px] !rounded-[10px]" aria-hidden="true" />)}</KpiRow>;
  }
  if (q.error || !d) {
    return (
      <div className="flex items-center gap-2 text-[12.5px] text-[var(--w-text-2)]" role="alert">
        {wt('charts.error')} <button type="button" className="w-btn w-btn-sm" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>
      </div>
    );
  }
  const st = d.sprint?.status;
  const sprintTone: KpiTone | undefined = st === 'AT_RISK' ? 'red' : st === 'ON_TRACK' || st === 'DONE' ? 'green' : 'muted';
  const base = `/work/${config.workspace.slug}/${config.key}`;
  return (
    <KpiRow min={150} label={wt('charts.kpis')}>
      <KpiTile label={wt('charts.kpiOpen')} value={d.open.value} hint={<Trend value={d.open.value} previous={d.open.previous} goodWhenDown />} title={wt('charts.kpiOpenTip')} />
      <KpiTile label={wt('common.overdue')} value={d.overdue.value} tone={d.overdue.value ? 'red' : undefined} hint={<Trend value={d.overdue.value} previous={d.overdue.previous} goodWhenDown />} title={wt('charts.kpiOverdueTip')} />
      <KpiTile label={wt('charts.blocked')} value={d.blocked.value} tone={d.blocked.value ? 'orange' : undefined} hint={wt('charts.blockedHint')} />
      <KpiTile label={wt('charts.kpiSprint')} value={d.sprint ? wt(`charts.pace_${d.sprint.status}` as 'charts.pace_ON_TRACK') : '—'} tone={d.sprint ? sprintTone : undefined}
        hint={d.sprint ? `${d.sprint.name} · ${wt('charts.daysLeft', { count: d.sprint.daysLeft })}` : wt('charts.noSprint')} />
      <KpiTile label={wt('charts.kpiScope')} value={d.sprint?.pctDone !== null && d.sprint?.pctDone !== undefined ? `${d.sprint.pctDone}%` : '—'}
        hint={d.sprint ? `${num(d.sprint.done)} / ${num(d.sprint.total)}` : undefined} />
      {d.highRisks === null ? (
        <KpiTile label={wt('charts.kpiRisks')} value="—" hint={wt('charts.raidOff')} />
      ) : (
        <a href={`${base}/raid`} className="min-w-0 rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--w-accent-border)]">
          <KpiTile label={wt('charts.kpiRisks')} value={d.highRisks} tone={d.highRisks ? 'red' : undefined} hint={wt('charts.kpiRisksHint')} className="h-full hover:border-[var(--w-border-strong)]" />
        </a>
      )}
    </KpiRow>
  );
}
