'use client';

/**
 * CT Work đợt 6 — TST-1 GIÁM SÁT & KIỂM SOÁT TEST: KPI (pass rate vòng gần nhất, tiến độ, retest, lỗi mở, leakage/DRE,
 * độ phủ yêu cầu) · biểu đồ ChartFrame (pass rate theo vòng, đường S, lỗi theo mức/mô-đun/nguyên nhân, lỗi mở-đóng) ·
 * tiêu chí kết thúc tự đánh giá · ước lượng có tham số năng suất · kế hoạch IEEE 829 · Test Summary Report · thuộc tính
 * test case (cấp/loại/ước lượng). Mọi con số do máy chủ tính (testMetrics.ts) — ở đây chỉ vẽ.
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { q6Api, q6Keys, TEST_LEVELS, TEST_TYPES, type Count, type Criteria, type Estimation, type PlanSettings, type QualityDashboard } from '@/lib/work-q6-api';
import ChartFrame from '../charts/ChartFrame';
import { FlowTooltip } from '../charts/FlowCharts';
import { AXIS_TICK, GRID, SERIES } from '../charts/chartColors';
import KpiTile, { KpiRow } from '../KpiTile';
import { EmptyState, PageLoading } from '../ui';
import { useWT, type WKey } from '../i18n';
import { Badge, Card, Labeled, NumberInput, Segmented, Tbl, Td, Th, pct } from './qui';

const SEV_COLOR: Record<string, string> = { CRITICAL: 'var(--w-red)', MAJOR: 'var(--w-orange)', MINOR: 'var(--w-yellow)', TRIVIAL: 'var(--w-text-3)', '—': 'var(--w-border-strong)' };

export default function QualityTab({ config, pid }: { config: ProjectConfig; pid: number }) {
  const { t } = useWT();
  const plans = useQuery({ queryKey: ['work', 'testPlans', pid], queryFn: () => workApi.testPlans(pid) });
  const [planId, setPlanId] = useState<number | null>(null);
  const q = useQuery({ queryKey: [...q6Keys.tests(pid), 'quality', planId], queryFn: () => q6Api.quality(pid, planId) });
  const d = q.data;
  return (
    <div className="flex flex-col gap-3 p-4" data-testid="q6-quality-tab">
      <div className="flex flex-wrap items-end gap-3">
        <Labeled label={t('q6.plan')} className="w-[280px]">
          <select className="w-input" value={planId ?? ''} onChange={(e) => setPlanId(e.target.value ? Number(e.target.value) : null)} data-testid="q6-plan-select">
            <option value="">{t('q6.allTests')}</option>
            {(plans.data ?? []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Labeled>
      </div>
      {q.isLoading ? <PageLoading /> : q.error || !d ? <EmptyState title={t('q6.loadFailed')} body={workError(q.error)} /> : (
        <>
          <Kpis d={d} />
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            <PassRateChart d={d} />
            <SCurveChart d={d} />
            <TrendChart d={d} />
            <CountChart title={t('q6.chSeverity')} rows={d.defects.bySeverity} colorOf={(k) => SEV_COLOR[k] ?? 'var(--w-chart-1)'} testId="q6-chart-severity" />
            <CountChart title={t('q6.chModule')} rows={d.defects.byModule} testId="q6-chart-module" />
            <CountChart title={t('q6.chRootCause')} rows={d.defects.byRootCause.map((r) => ({ ...r, key: r.key === '—' ? r.key : t(`q6.rc${r.key}` as WKey) }))} testId="q6-chart-rootcause" />
          </div>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            <ExitCard d={d} hasPlan={!!planId} />
            <Estimation pid={pid} planId={planId} d={d} canEdit={config.permissions.editIssues} />
          </div>
          <PlanDoc pid={pid} planId={planId} canEdit={config.permissions.editIssues} />
          <Tsr pid={pid} planId={planId} />
          <Attributes pid={pid} canEdit={config.permissions.editIssues} />
        </>
      )}
    </div>
  );
}

function Kpis({ d }: { d: QualityDashboard }) {
  const { t } = useWT();
  const last = d.cycles[d.cycles.length - 1];
  return (
    <KpiRow min={170} label={t('q6.tabQuality')}>
      <KpiTile label={t('q6.kPassRate')} value={pct(last?.passRate)} tone={last?.passRate === null || last?.passRate === undefined ? 'muted' : last.passRate >= 95 ? 'green' : last.passRate >= 80 ? 'yellow' : 'red'} testId="q6-kpi-pass" />
      <KpiTile label={t('q6.kProgress')} value={pct(last?.progress)} hint={last ? `${last.executed}/${last.total}` : undefined} />
      <KpiTile label={t('q6.kRetest')} value={pct(d.retest.retestRate)} hint={t('q6.kRetestHint', { r: d.retest.retested, f: d.retest.failedCases, x: d.retest.fixRate ?? '—' })} />
      <KpiTile label={t('q6.kOpenDefects')} value={String(d.defects.open)} hint={t('q6.kOpenDefectsHint', { n: d.defects.total })} tone={d.defects.open ? 'orange' : 'green'} />
      <KpiTile label={t('q6.kLeakage')} value={pct(d.defects.leakage)} hint={t('q6.kLeakageHint', { d: d.defects.dre ?? '—' })} />
      <KpiTile label={t('q6.kCoverage')} value={pct(d.coverage.pct)} hint={t('q6.kCoverageHint', { v: d.coverage.verifiedPct ?? '—' })} tone={d.coverage.pct === 100 ? 'green' : 'muted'} />
    </KpiRow>
  );
}

function PassRateChart({ d }: { d: QualityDashboard }) {
  const { t } = useWT();
  const rows = d.cycles.map((c) => ({ name: `R${c.round} · ${c.name}`, passRate: c.passRate ?? 0, pass: c.pass, fail: c.fail, blocked: c.blocked, executed: c.executed }));
  return (
    <ChartFrame title={t('q6.chPassRate')} description={t('q6.chPassRateDesc')} status={rows.length ? 'ready' : 'empty'} emptyText={t('q6.noTests')} rows={rows}
      columns={[{ key: 'name', label: t('q6.cycle') }, { key: 'passRate', label: t('q6.passRate') }, { key: 'pass', label: 'PASS' }, { key: 'fail', label: 'FAIL' }, { key: 'blocked', label: 'BLOCKED' }]}
      summary={rows.map((r) => `${r.name}: ${r.passRate}%`).join('; ')} testId="q6-chart-passrate">
      {() => (
        <div style={{ height: 240 }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 6, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} />
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false} width={44} unit="%" />
              <Tooltip content={<FlowTooltip fmt={(v) => `${v}%`} />} cursor={{ fill: 'var(--w-hover)' }} />
              <Bar dataKey="passRate" name={t('q6.passRate')} fill={SERIES.done} isAnimationActive={false} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

function SCurveChart({ d }: { d: QualityDashboard }) {
  const { t, fmtShortDate } = useWT();
  const pts = d.sCurve?.points ?? [];
  return (
    <ChartFrame title={t('q6.chSCurve')} description={t('q6.chSCurveDesc')} subtitle={d.sCurve?.cycle.name} status={pts.length ? 'ready' : 'empty'} emptyText={t('q6.noTests')}
      series={[{ key: 'planned', label: t('q6.planned'), color: SERIES.guideline, dashed: true }, { key: 'actual', label: t('q6.actual'), color: SERIES.completed }]}
      rows={pts} columns={[{ key: 'day', label: t('charts.day') }, { key: 'planned', label: t('q6.planned') }, { key: 'actual', label: t('q6.actual') }]} testId="q6-chart-scurve">
      {(hidden) => (
        <div style={{ height: 240 }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pts} margin={{ top: 6, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="day" tickFormatter={(x: string) => fmtShortDate(x)} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={24} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<FlowTooltip labelFormat={(x) => fmtShortDate(x)} />} />
              {!hidden.has('planned') && <Line dataKey="planned" name={t('q6.planned')} stroke={SERIES.guideline} strokeDasharray="4 4" dot={false} isAnimationActive={false} />}
              {!hidden.has('actual') && <Line dataKey="actual" name={t('q6.actual')} stroke={SERIES.completed} strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

function TrendChart({ d }: { d: QualityDashboard }) {
  const { t, fmtShortDate } = useWT();
  const pts = d.defectTrend;
  const empty = !pts.some((p) => p.opened || p.closed || p.openTotal);
  return (
    <ChartFrame title={t('q6.chTrend')} description={t('q6.chTrendDesc')} status={empty ? 'empty' : 'ready'} emptyText={t('q6.noDefects')}
      series={[{ key: 'opened', label: t('q6.opened'), color: SERIES.created }, { key: 'closed', label: t('q6.closed'), color: SERIES.resolved }, { key: 'openTotal', label: t('q6.openTotal'), color: SERIES.overdue }]}
      rows={pts} columns={[{ key: 'day', label: t('charts.day') }, { key: 'opened', label: t('q6.opened') }, { key: 'closed', label: t('q6.closed') }, { key: 'openTotal', label: t('q6.openTotal') }]} testId="q6-chart-trend">
      {(hidden) => (
        <div style={{ height: 240 }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pts} margin={{ top: 6, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="day" tickFormatter={(x: string) => fmtShortDate(x)} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={24} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<FlowTooltip labelFormat={(x) => fmtShortDate(x)} />} />
              {!hidden.has('opened') && <Bar dataKey="opened" name={t('q6.opened')} fill={SERIES.created} isAnimationActive={false} />}
              {!hidden.has('closed') && <Bar dataKey="closed" name={t('q6.closed')} fill={SERIES.resolved} isAnimationActive={false} />}
              {!hidden.has('openTotal') && <Line dataKey="openTotal" name={t('q6.openTotal')} stroke={SERIES.overdue} dot={false} isAnimationActive={false} />}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

function CountChart({ title, rows, colorOf, testId }: { title: string; rows: Count[]; colorOf?: (k: string) => string; testId: string }) {
  const { t } = useWT();
  const data = rows.slice(0, 12);
  return (
    <ChartFrame title={title} status={data.length ? 'ready' : 'empty'} emptyText={t('q6.noDefects')}
      series={[{ key: 'total', label: t('q6.total'), color: 'var(--w-chart-1)' }, { key: 'open', label: t('q6.open'), color: SERIES.overdue }]}
      rows={data} columns={[{ key: 'key', label: title }, { key: 'total', label: t('q6.total') }, { key: 'open', label: t('q6.open') }]} summary={data.map((r) => `${r.key} ${r.total}`).join(', ')} testId={testId}>
      {(hidden) => (
        <div style={{ height: Math.max(160, data.length * 30 + 30) }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, bottom: 0, left: 8 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="key" tick={AXIS_TICK} tickLine={false} axisLine={false} width={120} />
              <Tooltip content={<FlowTooltip />} cursor={{ fill: 'var(--w-hover)' }} />
              {!hidden.has('total') && <Bar dataKey="total" name={t('q6.total')} isAnimationActive={false} fill="var(--w-chart-1)" shape={colorOf ? ((p: { x: number; y: number; width: number; height: number; payload: Count }) => <rect x={p.x} y={p.y} width={p.width} height={p.height} rx={2} fill={colorOf(p.payload.key)} />) as never : undefined} />}
              {!hidden.has('open') && <Bar dataKey="open" name={t('q6.open')} fill={SERIES.overdue} isAnimationActive={false} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

function ExitCard({ d, hasPlan }: { d: QualityDashboard; hasPlan: boolean }) {
  const { t } = useWT();
  return (
    <Card title={t('q6.exitTitle')} desc={hasPlan ? undefined : t('q6.exitNoPlan')} actions={<Badge tone={d.exit.met ? 'green' : 'red'}>{d.exit.met ? t('q6.exitMet') : t('q6.exitNotMet')}</Badge>} testId="q6-exit">
      <Tbl minWidth={420} label={t('q6.exitTitle')}>
        <thead><tr><Th>{t('q6.exitTitle')}</Th><Th w={100}>{t('q6.target')}</Th><Th w={100}>{t('q6.actual')}</Th><Th w={70}>{t('q6.met')}</Th></tr></thead>
        <tbody>
          {d.exit.rows.map((r) => (
            <tr key={r.key}><Td>{t(`q6.crit_${r.key}` as WKey)}</Td><Td className="tabular-nums">{r.target}</Td><Td className="tabular-nums">{r.actual}</Td><Td><Badge tone={r.met ? 'green' : 'red'}>{r.met ? '✓' : '✗'}</Badge></Td></tr>
          ))}
        </tbody>
      </Tbl>
    </Card>
  );
}

function Estimation({ pid, planId, d, canEdit }: { pid: number; planId: number | null; d: QualityDashboard; canEdit: boolean }) {
  const { t, fmtNumber } = useWT();
  const qc = useQueryClient();
  const [p, setP] = useState<Estimation>(d.estimation.params);
  useEffect(() => setP(d.estimation.params), [d.estimation.params]);
  const save = useMutation({
    mutationFn: () => q6Api.savePlanSettings(pid, planId!, { estimation: p }),
    onSuccess: () => { toast.success(t('q6.saved')); qc.invalidateQueries({ queryKey: [...q6Keys.tests(pid), 'quality'] }); },
    onError: (e) => toast.error(workError(e)),
  });
  const e = d.estimation;
  const field = (k: keyof Estimation, label: string, step = 1) => (
    <Labeled label={label}><NumberInput label={label} value={p[k] as number} step={step} min={0} disabled={!canEdit || !planId} onChange={(v) => setP({ ...p, [k]: v ?? 0 })} /></Labeled>
  );
  return (
    <Card title={t('q6.estTitle')} testId="q6-estimation"
      actions={canEdit && planId ? <button type="button" className="w-btn w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()}>{t('q6.estSaveToPlan')}</button> : undefined}>
      <div className="mb-3 rounded-[6px] bg-[var(--w-hover)] px-3 py-2">
        <div className="text-[15px] font-semibold tabular-nums">{t('q6.estResult', { d: fmtNumber(e.effort.totalDays), h: fmtNumber(e.effort.totalHours), c: fmtNumber(e.durationDays), t: e.params.testers })}</div>
        <div className="text-[12px] text-[var(--w-text-2)]">{t('q6.estBreakdown', { a: e.effort.designDays, b: e.effort.executeDays, c: e.effort.overheadDays })}</div>
        <div className="mt-1 font-mono text-[11.5px] text-[var(--w-text-3)]">{e.formula}</div>
        <div className="mt-1 text-[12px] text-[var(--w-text-2)]">{t('q6.estRecorded', { m: e.recordedMinutes, n: e.casesWithEstimate })}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        <Labeled label={t('q6.estMethod')} className="col-span-2 md:col-span-3">
          <Segmented<Estimation['method']> label={t('q6.estMethod')} disabled={!canEdit || !planId} value={p.method} onChange={(v) => setP({ ...p, method: v })} options={[{ value: 'TEST_CASES', label: t('q6.estTC') }, { value: 'FUNCTION_POINTS', label: t('q6.estFP') }]} />
        </Labeled>
        {field('size', t('q6.estSize'))}{field('designPerDay', t('q6.estDesignPerDay'))}{field('executePerDay', t('q6.estExecutePerDay'))}
        {field('cycles', t('q6.estCycles'))}{field('retestPct', t('q6.estRetest'))}{field('overheadPct', t('q6.estOverhead'))}
        {field('testers', t('q6.estTesters'))}{field('hoursPerDay', t('q6.estHours'), 0.5)}
      </div>
      {!planId && <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{t('q6.planDocNeedsPlan')}</p>}
    </Card>
  );
}

const PLAN_FIELDS: Array<[keyof PlanSettings, WKey]> = [
  ['scopeIn', 'q6.scopeIn'], ['scopeOut', 'q6.scopeOut'], ['approach', 'q6.approach'], ['environment', 'q6.environment'], ['suspension', 'q6.suspension'],
  ['resumption', 'q6.resumption'], ['deliverables', 'q6.deliverables'], ['schedule', 'q6.schedule'], ['risks', 'q6.risksText'], ['variances', 'q6.variances'],
];

function PlanDoc({ pid, planId, canEdit }: { pid: number; planId: number | null; canEdit: boolean }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: [...q6Keys.tests(pid), 'plan', planId], queryFn: () => q6Api.planSettings(pid, planId!), enabled: !!planId });
  const [s, setS] = useState<PlanSettings | null>(null);
  useEffect(() => setS(q.data?.settings ?? null), [q.data]);
  const save = useMutation({
    mutationFn: () => q6Api.savePlanSettings(pid, planId!, s!),
    onSuccess: () => { toast.success(t('q6.saved')); qc.invalidateQueries({ queryKey: [...q6Keys.tests(pid)] }); },
    onError: (e) => toast.error(workError(e)),
  });
  if (!planId) return <Card title={t('q6.planDoc')}><p className="text-[12.5px] text-[var(--w-text-3)]">{t('q6.planDocNeedsPlan')}</p></Card>;
  if (!s) return <PageLoading rows={3} />;
  const crit = (k: keyof Criteria, label: WKey) => (
    <Labeled label={t(label)}><NumberInput label={t(label)} value={s.criteria[k]} min={0} disabled={!canEdit} onChange={(v) => setS({ ...s, criteria: { ...s.criteria, [k]: v ?? 0 } })} /></Labeled>
  );
  return (
    <Card title={t('q6.planDoc')} testId="q6-plan-doc"
      actions={canEdit ? <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()} data-testid="q6-save-plan">{t('q6.save')}</button> : undefined}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {PLAN_FIELDS.map(([k, label]) => (
          <Labeled key={k} label={t(label)}><textarea className="w-input min-h-[56px]" disabled={!canEdit} value={(s[k] as string | undefined) ?? ''} onChange={(e) => setS({ ...s, [k]: e.target.value })} /></Labeled>
        ))}
      </div>
      <h3 className="mb-2 mt-4 text-[13px] font-semibold">{t('q6.exitTitle')}</h3>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {crit('passRate', 'q6.crit_passRate')}{crit('minExecuted', 'q6.crit_executed')}{crit('maxOpenCritical', 'q6.crit_openCritical')}{crit('maxOpenMajor', 'q6.crit_openMajor')}{crit('reqCoverage', 'q6.crit_reqCoverage')}
      </div>
    </Card>
  );
}

function Tsr({ pid, planId }: { pid: number; planId: number | null }) {
  const { t, locale } = useWT();
  const [show, setShow] = useState(false);
  const q = useQuery({ queryKey: [...q6Keys.tests(pid), 'tsr', planId, locale], queryFn: () => q6Api.tsr(pid, planId, locale), enabled: show });
  const err = (e: unknown) => toast.error(workError(e));
  return (
    <Card title={t('q6.tsr')} desc={t('q6.tsrDesc')} testId="q6-tsr"
      actions={<>
        <button type="button" className="w-btn w-btn-sm" onClick={() => setShow(!show)} aria-expanded={show} data-testid="q6-tsr-preview"><FileText size={13} /> {t('q6.tsrPreview')}</button>
        <button type="button" className="w-btn w-btn-sm" onClick={() => q6Api.exportTsr(pid, planId, 'docx', locale).catch(err)} data-testid="q6-tsr-docx"><Download size={13} /> {t('q6.tsrDocx')}</button>
        <button type="button" className="w-btn w-btn-sm" onClick={() => q6Api.exportTsr(pid, planId, 'pdf', locale).catch(err)}><Download size={13} /> {t('q6.tsrPdf')}</button>
      </>}>
      {show && (q.isLoading ? <PageLoading rows={4} /> : q.data && (
        <div role="region" aria-label={t('q6.tsr')} tabIndex={0} className="max-h-[520px] overflow-auto rounded-[6px] border border-[var(--w-border)] px-4 py-3 text-[13px] leading-relaxed [&_h1]:mb-2 [&_h1]:text-[17px] [&_h1]:font-semibold [&_h2]:mb-1 [&_h2]:mt-4 [&_h2]:text-[14px] [&_h2]:font-semibold [&_table]:my-2 [&_table]:w-full [&_td]:border [&_td]:border-[var(--w-border)] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-[var(--w-border)] [&_th]:bg-[var(--w-hover)] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-5">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{q.data.markdown}</ReactMarkdown>
        </div>
      ))}
    </Card>
  );
}

function Attributes({ pid, canEdit }: { pid: number; canEdit: boolean }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: [...q6Keys.tests(pid), 'attrs'], queryFn: () => q6Api.attributes(pid) });
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [level, setLevel] = useState('');
  const [type, setType] = useState('');
  const [est, setEst] = useState<number | null>(null);
  const apply = useMutation({
    mutationFn: () => q6Api.setAttributes(pid, { numbers: [...sel], ...(level ? { level: level === '-' ? null : level } : {}), ...(type ? { testType: type === '-' ? null : type } : {}), ...(est !== null ? { estimateMin: est } : {}) }),
    onSuccess: () => { toast.success(t('q6.saved')); qc.invalidateQueries({ queryKey: [...q6Keys.tests(pid)] }); setSel(new Set()); },
    onError: (e) => toast.error(workError(e)),
  });
  const rows = useMemo(() => q.data ?? [], [q.data]);
  return (
    <Card title={t('q6.attrs')} desc={t('q6.attrsDesc')} testId="q6-attrs">
      {!rows.length ? <p className="text-[12.5px] text-[var(--w-text-3)]">{t('q6.noTests')}</p> : (
        <>
          {canEdit && (
            <div className="mb-2 flex flex-wrap items-end gap-2">
              <Labeled label={t('q6.level')}><select className="w-input w-[150px]" value={level} onChange={(e) => setLevel(e.target.value)}><option value="" /><option value="-">{t('q6.none')}</option>{TEST_LEVELS.map((l) => <option key={l} value={l}>{t(`q6.lv${l}` as WKey)}</option>)}</select></Labeled>
              <Labeled label={t('q6.testType')}><select className="w-input w-[170px]" value={type} onChange={(e) => setType(e.target.value)}><option value="" /><option value="-">{t('q6.none')}</option>{TEST_TYPES.map((l) => <option key={l} value={l}>{t(`q6.tt${l}` as WKey)}</option>)}</select></Labeled>
              <Labeled label={t('q6.estimateMin')}><NumberInput label={t('q6.estimateMin')} className="w-[120px]" value={est} min={0} onChange={setEst} /></Labeled>
              <button type="button" className="w-btn w-btn-sm" disabled={!sel.size || (!level && !type && est === null) || apply.isPending} onClick={() => apply.mutate()}>{t('q6.applyToSelected', { n: sel.size })}</button>
            </div>
          )}
          <Tbl minWidth={720} maxHeight={420} label={t('q6.attrs')}>
            <thead><tr>
              <Th w={36}>{canEdit && <input type="checkbox" aria-label={t('q6.selectAll')} checked={sel.size === rows.length} onChange={(e) => setSel(e.target.checked ? new Set(rows.map((r) => r.number)) : new Set())} />}</Th>
              <Th w={70}>#</Th><Th>{t('q6.colTitle')}</Th><Th w={130}>{t('q6.level')}</Th><Th w={150}>{t('q6.testType')}</Th><Th w={100}>{t('q6.technique')}</Th><Th w={100} className="text-right">{t('q6.estimateMin')}</Th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.number}>
                  <Td>{canEdit && <input type="checkbox" aria-label={`#${r.number}`} checked={sel.has(r.number)} onChange={(e) => { const s = new Set(sel); if (e.target.checked) s.add(r.number); else s.delete(r.number); setSel(s); }} />}</Td>
                  <Td className="font-mono text-[12px]">{r.number}</Td>
                  <Td className="text-[12.5px]">{r.title}</Td>
                  <Td className="text-[12px]">{r.level ? t(`q6.lv${r.level}` as WKey) : '—'}</Td>
                  <Td className="text-[12px]">{r.testType ? t(`q6.tt${r.testType}` as WKey) : '—'}</Td>
                  <Td className="text-[12px]">{r.technique ?? '—'}</Td>
                  <Td className="text-right tabular-nums">{r.estimateMin ?? '—'}</Td>
                </tr>
              ))}
            </tbody>
          </Tbl>
        </>
      )}
    </Card>
  );
}
