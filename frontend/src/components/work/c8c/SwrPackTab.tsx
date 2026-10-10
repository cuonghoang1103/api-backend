'use client';

/**
 * CTW đợt 8c — SWR302: R13 CÔNG CỤ ƯỚC LƯỢNG BA (mô hình Wiegers Ch.19) + R24 BÁO CÁO TRẠNG THÁI YÊU CẦU + R26 GÓI NỘP 8
 * DELIVERABLE (ZIP). Trang /work/<ws>/<KEY>/wiegers?tab=estimation.
 * Số đếm TỰ ĐIỀN từ dữ liệu dự án (UC, màn hình, báo cáo, stakeholder, hệ thống ngoài); sửa tay được, lệch với dữ liệu ⇒
 * cảnh báo (người chấm dò "số trong deliverable 8 khớp deliverable 2/4/6").
 */

import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, Download, FileArchive, RotateCcw } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { saveBlob } from '@/lib/work-docs3a-api';
import { c8cKeys, EST_COUNT_KEYS, swrPackApi, type EstCountKey, type Estimation } from '@/lib/work-c8c-api';
import { EmptyState, PageLoading, Spinner } from '../ui';
import KpiTile from '../KpiTile';
import { Badge, Card, Tbl, Td, Th } from '../quality/qui';
import { useWT } from '../i18n';

const CAT: Record<string, never> = {
  'Project Start and Management': 'c8c.cat_start' as never, 'Model Requirements - People': 'c8c.cat_people' as never,
  'Model Requirements - System': 'c8c.cat_system' as never, 'Model Requirements - Data': 'c8c.cat_data' as never,
};
const r2 = (n: number | null | undefined) => (n === null || n === undefined ? '—' : (Math.round(n * 100) / 100).toLocaleString());

export default function SwrPackTab({ pid }: { pid: number }) {
  const { t } = useWT();
  return (
    <div className="flex flex-col gap-4 p-4" data-testid="swr-pack-tab">
      <PackageCard pid={pid} />
      <EstimationCard pid={pid} />
      <StatusCard pid={pid} />
      <p className="text-[11.5px] text-[var(--w-text-3)]">{t('c8c.estSource')}</p>
    </div>
  );
}

function PackageCard({ pid }: { pid: number }) {
  const { t } = useWT();
  const dl = useMutation({
    mutationFn: () => swrPackApi.packageZip(pid),
    onSuccess: (f) => saveBlob(f.blob, f.fileName),
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <Card title={t('c8c.pkgTitle')} desc={t('c8c.pkgDesc')} actions={<button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={dl.isPending} onClick={() => dl.mutate()} data-testid="swr-package">{dl.isPending ? <Spinner size={12} /> : <FileArchive size={13} />} {t('c8c.pkgDownload')}</button>}>
      <ol className="grid list-decimal gap-x-6 gap-y-0.5 pl-5 text-[12.5px] text-[var(--w-text-2)] sm:grid-cols-2">
        {(['pkg1', 'pkg2', 'pkg3', 'pkg4', 'pkg5', 'pkg6', 'pkg7', 'pkg8'] as const).map((k) => <li key={k}>{t(`c8c.${k}` as never)}</li>)}
      </ol>
    </Card>
  );
}

function EstimationCard({ pid }: { pid: number }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: c8cKeys.estimation(pid), queryFn: () => swrPackApi.estimation(pid) });
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [proj, setProj] = useState<Record<string, string | boolean>>({});
  useEffect(() => {
    if (!q.data) return;
    setCounts(Object.fromEntries(EST_COUNT_KEYS.map((k) => [k, String(q.data!.result.counts[k])])));
    const p = q.data.result.project;
    setProj({ totalBudget: String(p.totalBudget), baHourlyCost: String(p.baHourlyCost), projectType: p.projectType, developers: String(p.developers), remote: p.remote, projectWeeks: String(p.projectWeeks), requirementsWeeks: String(p.requirementsWeeks), budgetPercent: String(p.budgetPercent) });
  }, [q.data]);
  const save = useMutation({
    mutationFn: (body: Parameters<typeof swrPackApi.saveEstimation>[1]) => swrPackApi.saveEstimation(pid, body),
    onSuccess: (d) => { qc.setQueryData(c8cKeys.estimation(pid), d); toast.success(t('c8c.estSaved')); },
    onError: (e) => toast.error(workError(e)),
  });
  const xlsx = useMutation({ mutationFn: () => swrPackApi.estimationXlsx(pid), onSuccess: (f) => saveBlob(f.blob, f.fileName), onError: (e) => toast.error(workError(e)) });
  if (q.isLoading) return <PageLoading rows={3} />;
  if (q.error || !q.data) return <EmptyState title={t('c8c.loadFailed')} body={workError(q.error)} />;
  const e: Estimation = q.data;
  const m = e.result.methods;
  const n = (v: string | boolean | undefined) => Number(String(v ?? '').replace(',', '.')) || 0;
  const submit = () => save.mutate({
    counts: Object.fromEntries(EST_COUNT_KEYS.map((k) => [k, Number(counts[k]) === e.auto[k] ? null : Math.max(0, Math.round(n(counts[k])))])),
    project: { totalBudget: n(proj.totalBudget), baHourlyCost: n(proj.baHourlyCost), projectType: proj.projectType === 'COTS' ? 'COTS' : 'STANDARD', developers: Math.round(n(proj.developers)), remote: !!proj.remote, projectWeeks: n(proj.projectWeeks), requirementsWeeks: n(proj.requirementsWeeks), budgetPercent: n(proj.budgetPercent) },
  });
  const input = (k: string, v: string, set: (v: string) => void, label: string, hint?: string) => (
    <label key={k} className="flex flex-col gap-0.5 text-[12.5px]">
      <span className="text-[var(--w-text-2)]">{label}</span>
      <input className="w-input" inputMode="decimal" value={v} disabled={!e.canEdit} onChange={(ev) => set(ev.target.value)} aria-describedby={hint ? `${k}-hint` : undefined} />
      {hint && <span id={`${k}-hint`} className="text-[11px] text-[var(--w-text-3)]">{hint}</span>}
    </label>
  );
  return (
    <Card
      title={t('c8c.estTitle')} desc={t('c8c.estDesc')}
      actions={<button type="button" className="w-btn w-btn-sm" disabled={xlsx.isPending} onClick={() => xlsx.mutate()}>{xlsx.isPending ? <Spinner size={12} /> : <Download size={12} />} {t('c8c.exportXlsx')}</button>}
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <KpiTile label={t('c8c.estA')} value={r2(m.budgetPercent.bas)} hint={t('c8c.estCost', { v: r2(m.budgetPercent.requirementsCost) })} />
        <KpiTile label={t('c8c.estB', { r: m.devRatio.ratio ?? 6 })} value={r2(m.devRatio.bas)} hint={t('c8c.estCost', { v: r2(m.devRatio.requirementsCost) })} />
        <KpiTile label={t('c8c.estC')} value={r2(m.activity.bas)} hint={t('c8c.estHours', { h: r2(e.result.totals.hours) })} />
      </div>
      {!!e.mismatches.length && (
        <div className="mt-3 flex gap-2 rounded-[6px] border border-[var(--w-border)] px-2.5 py-2 text-[12.5px]" role="status">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--w-orange-text,var(--w-text-2))]" />
          <span>{t('c8c.estMismatch')} {e.mismatches.map((x) => t('c8c.estMismatchItem', { label: t(`c8c.cnt_${x.key}` as never), a: x.entered, b: x.actual })).join(' · ')}</span>
        </div>
      )}
      <form className="mt-3 grid gap-4 lg:grid-cols-2" onSubmit={(ev) => { ev.preventDefault(); submit(); }}>
        <fieldset className="grid grid-cols-2 gap-2">
          <legend className="mb-1 text-[12px] font-semibold">{t('c8c.estCounts')}</legend>
          {EST_COUNT_KEYS.map((k: EstCountKey) => input(k, counts[k] ?? '', (v) => setCounts((c) => ({ ...c, [k]: v })), t(`c8c.cnt_${k}` as never), Number(counts[k]) !== e.auto[k] ? t('c8c.estAuto', { n: e.auto[k] }) : undefined))}
        </fieldset>
        <fieldset className="grid grid-cols-2 content-start gap-2">
          <legend className="mb-1 text-[12px] font-semibold">{t('c8c.estProject')}</legend>
          {input('totalBudget', String(proj.totalBudget ?? ''), (v) => setProj((p) => ({ ...p, totalBudget: v })), t('c8c.pBudget'))}
          {input('baHourlyCost', String(proj.baHourlyCost ?? ''), (v) => setProj((p) => ({ ...p, baHourlyCost: v })), t('c8c.pRate'))}
          {input('developers', String(proj.developers ?? ''), (v) => setProj((p) => ({ ...p, developers: v })), t('c8c.pDevs'))}
          {input('budgetPercent', String(proj.budgetPercent ?? ''), (v) => setProj((p) => ({ ...p, budgetPercent: v })), t('c8c.pPercent'))}
          {input('projectWeeks', String(proj.projectWeeks ?? ''), (v) => setProj((p) => ({ ...p, projectWeeks: v })), t('c8c.pWeeks'))}
          {input('requirementsWeeks', String(proj.requirementsWeeks ?? ''), (v) => setProj((p) => ({ ...p, requirementsWeeks: v })), t('c8c.pReqWeeks'))}
          <label className="flex flex-col gap-0.5 text-[12.5px]"><span className="text-[var(--w-text-2)]">{t('c8c.pType')}</span>
            <select className="w-input" disabled={!e.canEdit} value={String(proj.projectType ?? 'STANDARD')} onChange={(ev) => setProj((p) => ({ ...p, projectType: ev.target.value }))}><option value="STANDARD">{t('c8c.pStandard')}</option><option value="COTS">COTS</option></select>
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-[12.5px]"><input type="checkbox" disabled={!e.canEdit} checked={!!proj.remote} onChange={(ev) => setProj((p) => ({ ...p, remote: ev.target.checked }))} /> {t('c8c.pRemote')}</label>
          {e.canEdit && <div className="col-span-2 flex gap-2"><button type="submit" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending}>{save.isPending ? <Spinner size={12} /> : null} {t('c8c.estRecalc')}</button><button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => save.mutate({ counts: Object.fromEntries(EST_COUNT_KEYS.map((k) => [k, null])), minutes: Object.fromEntries(e.result.rows.map((x) => [x.key, null])) })}><RotateCcw size={12} /> {t('c8c.estReset')}</button></div>}
        </fieldset>
      </form>
      <div className="mt-4">
        <Tbl minWidth={640} maxHeight={360} label={t('c8c.estActivities')}>
          <thead><tr><Th>{t('c8c.estActivity')}</Th><Th w={110}>{t('c8c.estMinUnit')}</Th><Th w={80}>{t('c8c.estUnits')}</Th><Th w={80}>{t('c8c.estHoursCol')}</Th></tr></thead>
          <tbody>
            {e.result.categories.map((c) => (
              <Fragment key={c.category}>
                <tr><Td colSpan={3} className="font-semibold">{t(CAT[c.category] ?? ('c8c.cat_start' as never)) || c.category}</Td><Td className="font-semibold tabular-nums">{r2(c.hours)}</Td></tr>
                {e.result.rows.filter((x) => x.category === c.category).map((x) => (
                  <tr key={x.key}>
                    <Td className="pl-5 text-[12.5px]">{t(`c8c.act_${x.key}` as never)}{x.edited && <> <Badge tone="yellow">{t('c8c.edited')}</Badge></>}</Td>
                    <Td>
                      <input className="w-input h-7 w-[90px] text-right tabular-nums" inputMode="numeric" disabled={!e.canEdit} defaultValue={x.minutesPerUnit} aria-label={t('c8c.estMinUnitFor', { a: t(`c8c.act_${x.key}` as never) })}
                        onBlur={(ev) => { const v = Number(ev.target.value); if (Number.isFinite(v) && v >= 0 && v !== x.minutesPerUnit) save.mutate({ minutes: { [x.key]: v } }); }} />
                    </Td>
                    <Td className="tabular-nums">{x.units ?? 'N/A'}</Td>
                    <Td className="tabular-nums">{r2(x.hours)}</Td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </Tbl>
      </div>
    </Card>
  );
}

function StatusCard({ pid }: { pid: number }) {
  const { t } = useWT();
  const [days, setDays] = useState(30);
  const q = useQuery({ queryKey: c8cKeys.statusReport(pid, days), queryFn: () => swrPackApi.statusReport(pid, days) });
  const xlsx = useMutation({ mutationFn: () => swrPackApi.statusXlsx(pid, days), onSuccess: (f) => saveBlob(f.blob, f.fileName), onError: (e) => toast.error(workError(e)) });
  const r = q.data;
  const max = Math.max(1, ...(r?.trend ?? []).map((x) => x.added + x.changed + x.deleted));
  return (
    <Card
      title={t('c8c.stTitle')} desc={t('c8c.stDesc')}
      actions={<div className="flex items-center gap-2">
        <select className="w-input h-7 w-auto text-[12.5px]" aria-label={t('c8c.stPeriod')} value={days} onChange={(e) => setDays(Number(e.target.value))}>{[7, 30, 90].map((d) => <option key={d} value={d}>{t('c8c.stDays', { n: d })}</option>)}</select>
        <button type="button" className="w-btn w-btn-sm" disabled={xlsx.isPending} onClick={() => xlsx.mutate()}>{xlsx.isPending ? <Spinner size={12} /> : <Download size={12} />} {t('c8c.exportXlsx')}</button>
      </div>}
    >
      {q.isLoading ? <PageLoading rows={2} /> : !r ? <EmptyState title={t('c8c.loadFailed')} body={workError(q.error)} /> : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <KpiTile label={t('c8c.stTotal')} value={r.total} />
            <KpiTile label={t('c8c.stVolatility')} value={`${r.window.volatility}%`} hint={t('c8c.stVolHint', { a: r.window.added, m: r.window.modified, d: r.window.deleted })} tone={r.window.volatility > 25 ? 'orange' : undefined} />
            <KpiTile label={t('c8c.stEffort')} value={r.effort.hours} hint={t('c8c.stEffortHint')} />
            <KpiTile label={t('c8c.stChanged')} value={r.versionedMoreThanOnce} />
          </div>
          <div className="flex flex-wrap gap-1.5 text-[12px]">
            {Object.entries(r.byLifecycle).map(([k, v]) => <Badge key={k}>{t(`c8c.lc_${k}` as never)}: {v}</Badge>)}
          </div>
          <div aria-label={t('c8c.stTrend')} role="img" className="flex h-[90px] items-end gap-1">
            {r.trend.map((w) => (
              <div key={w.week} className="flex min-w-0 flex-1 flex-col items-center gap-0.5" title={`${w.week}: +${w.added} ~${w.changed} −${w.deleted} · ${w.effortHours} h`}>
                <div className="flex w-full flex-col-reverse overflow-hidden rounded-[3px]" style={{ height: `${((w.added + w.changed + w.deleted) / max) * 70}px` }}>
                  <span style={{ flex: w.added, background: 'var(--w-green, #2f9e44)' }} />
                  <span style={{ flex: w.changed, background: 'var(--w-accent, #4f5bd5)' }} />
                  <span style={{ flex: w.deleted, background: 'var(--w-red, #c92a2a)' }} />
                </div>
                <span className="text-[10px] tabular-nums text-[var(--w-text-3)]">{w.week.slice(5)}</span>
              </div>
            ))}
          </div>
          <p className="text-[11.5px] text-[var(--w-text-3)]">{t('c8c.stLegend')}</p>
          {!!r.effort.byPerson.length && <p className="text-[12.5px] text-[var(--w-text-2)]">{r.effort.byPerson.map((p) => `${p.who}: ${p.hours} h`).join(' · ')}</p>}
        </div>
      )}
    </Card>
  );
}
