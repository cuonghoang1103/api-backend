'use client';

/**
 * CTW đợt 6b — Checklist chất lượng yêu cầu (Wiegers ch.11 "Characteristics of excellent requirements" + ISO/IEC/IEEE 29148):
 * rõ ràng · đầy đủ · nhất quán · kiểm chứng được · khả thi · cần thiết · có ưu tiên · truy vết được. Máy chấm phần ĐO ĐƯỢC
 * (từ mơ hồ "nhanh", "thân thiện"…, thiếu tiêu chí chấp nhận, NFR không có số đo, trùng lặp, thiếu nguồn/ưu tiên/truy vết);
 * người chấm phần còn lại; AI đề xuất cách viết lại (chỉ gợi ý — người tự sửa thẻ).
 */

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Bot, Check, Copy, FileSpreadsheet, Minus, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { QUALITY_CRITERIA, workSwr6bApi, workSwr6bKeys, type CriterionResult, type QualityCriterion, type QualityRow } from '@/lib/work-swr6b-api';
import { useWT, wt, type WKey } from '@/components/work/i18n';
import KpiTile, { KpiRow } from '../KpiTile';
import { Dialog, EmptyState, PageLoading, Spinner } from '../ui';
import { Chip, downloadFile, Seg, TabIntro, TableFrame, TD, TH, TYPE_KEY, use6bRefresh } from './shared';

export const CRIT_KEY: Record<QualityCriterion, WKey> = {
  unambiguous: 'srsx.cUnambiguous', complete: 'srsx.cComplete', consistent: 'srsx.cConsistent', verifiable: 'srsx.cVerifiable',
  feasible: 'srsx.cFeasible', necessary: 'srsx.cNecessary', prioritized: 'srsx.cPrioritized', traceable: 'srsx.cTraceable',
};
const REASON_KEY: Record<string, WKey> = {
  VAGUE: 'srsx.rVague', NO_DESCRIPTION: 'srsx.rNoDescription', PLACEHOLDER: 'srsx.rPlaceholder', NO_AC: 'srsx.rNoAc', DUPLICATE: 'srsx.rDuplicate',
  MARKED_CONFLICT: 'srsx.rMarkedConflict', NFR_NO_METRIC: 'srsx.rNfrNoMetric', QUALITY_WORD_NO_NUMBER: 'srsx.rQualityWord', MARKED_INFEASIBLE: 'srsx.rMarkedInfeasible',
  NEEDS_REVIEW: 'srsx.rNeedsReview', NO_SOURCE: 'srsx.rNoSource', MARKED_UNNEEDED: 'srsx.rMarkedUnneeded', NO_PRIORITY: 'srsx.rNoPriority', NOT_TRACED: 'srsx.rNotTraced',
};
export const reasonText = (r: CriterionResult['reasons'][number]) => wt(REASON_KEY[r.code] ?? 'srsx.rNeedsReview', r.params as Record<string, string | number> | undefined);

function Mark({ c }: { c: CriterionResult }) {
  const title = `${wt(CRIT_KEY[c.key])}: ${c.status === 'pass' ? wt('srsx.ok') : c.reasons.map(reasonText).join('; ') || wt('srsx.rNeedsReview')}`;
  return (
    <span role="img" title={title} aria-label={title} className={cn('inline-flex h-6 w-6 items-center justify-center rounded-[6px]',
      c.status === 'pass' ? 'bg-[color-mix(in_srgb,var(--w-green)_16%,transparent)] text-[var(--w-green-text)]' : c.status === 'fail' ? 'bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] text-[var(--w-red-text)]' : 'bg-[var(--w-sunken)] text-[var(--w-text-3)]')}>
      {c.status === 'pass' ? <Check size={13} /> : c.status === 'fail' ? <X size={13} /> : <Minus size={13} />}
    </span>
  );
}

export default function QualityTab({ pid, onOpenIssue }: { pid: number; onOpenIssue: (n: number) => void }) {
  const { locale } = useWT();
  const refresh = use6bRefresh(pid);
  const q = useQuery({ queryKey: workSwr6bKeys.quality(pid), queryFn: () => workSwr6bApi.quality(pid) });
  const [filter, setFilter] = useState<'ALL' | 'FAILING'>('FAILING');
  const [open, setOpen] = useState<QualityRow | null>(null);
  const setManual = useMutation({
    mutationFn: (x: { num: number; body: Partial<Record<'feasible' | 'consistent' | 'necessary', boolean | null>> }) => workSwr6bApi.setQuality(pid, x.num, x.body),
    onSuccess: (r) => { refresh(); setOpen(r); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const fix = useMutation({
    mutationFn: (num: number) => workSwr6bApi.aiFix(pid, num, locale),
    onSuccess: (r) => { refresh(); setOpen((o) => (o ? { ...o, ai: r.suggestion, aiModel: r.model } : o)); },
    onError: (e) => toast.error(workError(e, wt('srsx.aiFailed'))),
  });
  const rows = useMemo(() => (q.data?.requirements ?? []).filter((r) => filter === 'ALL' || r.criteria.some((c) => c.status === 'fail')), [q.data, filter]);
  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  const failing = data.requirements.filter((r) => r.criteria.some((c) => c.status === 'fail')).length;
  return (
    <div className="flex flex-col gap-4">
      <TabIntro text={wt('srsx.qIntro')}>
        <button type="button" className="w-btn w-btn-sm" disabled={!data.requirements.length} onClick={() => downloadFile(() => workSwr6bApi.exportQuality(pid))}><FileSpreadsheet size={13} /> .xlsx</button>
      </TabIntro>
      <KpiRow label={wt('srsx.qKpis')}>
        <KpiTile label={wt('srsx.kAverage')} value={data.average === null ? '—' : `${data.average}%`} tone={data.average === null ? 'muted' : data.average >= 80 ? 'green' : data.average >= 60 ? 'yellow' : 'red'} />
        <KpiTile label={wt('srsx.kRequirements')} value={data.requirements.length} />
        <KpiTile label={wt('srsx.kFailing')} value={failing} tone={failing ? 'orange' : 'green'} />
        {QUALITY_CRITERIA.filter((c) => data.byCriterion[c].fail > 0).slice(0, 3).map((c) => <KpiTile key={c} label={wt(CRIT_KEY[c])} value={data.byCriterion[c].fail} hint={wt('srsx.failN')} tone="red" />)}
      </KpiRow>
      <Seg label={wt('srsx.filter')} value={filter} onChange={setFilter} options={[{ id: 'FAILING', label: wt('srsx.fFailing'), count: failing }, { id: 'ALL', label: wt('srsx.fAll'), count: data.requirements.length }]} />
      {!rows.length ? <EmptyState title={data.requirements.length ? wt('srsx.allPass') : wt('srsx.noReqs')} body={data.requirements.length ? undefined : wt('srsx.noReqsBody')} /> : (
        <TableFrame label={wt('srsx.qTitle')}>
          <table className="w-full min-w-[980px] border-separate border-spacing-0">
            <thead><tr>
              <th scope="col" className={TH}>{wt('elic.hRequirement')}</th>
              {QUALITY_CRITERIA.map((c) => <th key={c} scope="col" className={`${TH} text-center`}>{wt(CRIT_KEY[c])}</th>)}
              <th scope="col" className={`${TH} text-right`}>{wt('srsx.score')}</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.issueId} className="cursor-pointer hover:bg-[var(--w-hover)]" onClick={() => setOpen(r)}>
                  <td className={TD}>
                    <button type="button" className="mr-1.5 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline" onClick={(e) => { e.stopPropagation(); onOpenIssue(r.number); }}>{r.key}</button>
                    <button type="button" className="text-left hover:underline" onClick={(e) => { e.stopPropagation(); setOpen(r); }}>{r.title}</button>
                    {r.reqType && <span className="ml-1.5"><Chip tone="muted">{wt(TYPE_KEY[r.reqType])}</Chip></span>}
                  </td>
                  {QUALITY_CRITERIA.map((c) => <td key={c} className={`${TD} text-center`}><Mark c={r.criteria.find((x) => x.key === c)!} /></td>)}
                  <td className={`${TD} text-right font-semibold tabular-nums`}>{r.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      <Dialog open={!!open} onClose={() => setOpen(null)} title={open ? `${open.key} · ${open.title}` : ''} width={720}>
        {open && (
          <div className="flex flex-col gap-3">
            <ul className="flex flex-col gap-1.5">
              {open.criteria.map((c) => (
                <li key={c.key} className="flex items-start gap-2 text-[13px]">
                  <Mark c={c} />
                  <div className="flex-1">
                    <span className="font-medium">{wt(CRIT_KEY[c.key])}</span>{!c.auto && <span className="ml-1 text-[11.5px] text-[var(--w-text-3)]">({wt('srsx.manual')})</span>}
                    {c.status !== 'pass' && c.reasons.length > 0 && <p className="text-[12.5px] text-[var(--w-text-2)]">{c.reasons.map(reasonText).join(' · ')}</p>}
                  </div>
                  {data.canEdit && (c.key === 'feasible' || c.key === 'consistent' || c.key === 'necessary') && (
                    <span className="flex gap-1">
                      <button type="button" className={cn('w-btn w-btn-sm', open.manual[c.key] === true && 'w-btn-on')} aria-pressed={open.manual[c.key] === true} onClick={() => setManual.mutate({ num: open.number, body: { [c.key]: open.manual[c.key] === true ? null : true } })}>{wt('srsx.yes')}</button>
                      <button type="button" className={cn('w-btn w-btn-sm', open.manual[c.key] === false && 'w-btn-on')} aria-pressed={open.manual[c.key] === false} onClick={() => setManual.mutate({ num: open.number, body: { [c.key]: open.manual[c.key] === false ? null : false } })}>{wt('srsx.no')}</button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {open.vague.length > 0 && (
              <div className="rounded-[8px] border border-[var(--w-border)] p-2.5">
                <p className="mb-1 text-[12.5px] font-medium">{wt('srsx.vagueWords')}</p>
                <ul className="flex flex-col gap-1">{open.vague.map((v, i) => <li key={i} className="text-[12.5px]"><Chip tone="orange">{v.match}</Chip> <span className="text-[var(--w-text-2)]">{v.hint}</span>{v.replace && <span className="text-[var(--w-text-2)]"> → “{v.replace}”</span>}</li>)}</ul>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <p className="flex-1 text-[12.5px] text-[var(--w-text-2)]">{wt('srsx.aiHint')}</p>
              {data.canUseAi && open.criteria.some((c) => c.status === 'fail') && <button type="button" className="w-btn w-btn-sm" disabled={fix.isPending} onClick={() => fix.mutate(open.number)}>{fix.isPending ? <Spinner size={12} /> : <Bot size={13} />} {wt('srsx.aiFix')}</button>}
            </div>
            {open.ai && (
              <div className="rounded-[8px] border border-[var(--w-accent)] bg-[color-mix(in_srgb,var(--w-accent)_6%,transparent)] p-3">
                <div className="mb-1 flex items-center gap-2"><span className="text-[12.5px] font-semibold">{wt('srsx.aiRewrite')}</span><span className="text-[11.5px] text-[var(--w-text-3)]">{open.aiModel}</span>
                  <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => { void navigator.clipboard?.writeText([open.ai!.rewrite, ...(open.ai!.acceptanceCriteria ?? []).map((x) => `- ${x}`)].join('\n')); toast.success(wt('srsx.copied')); }}><Copy size={12} /> {wt('srsx.copy')}</button>
                </div>
                <p className="text-[13px]">{open.ai.rewrite}</p>
                {!!open.ai.acceptanceCriteria?.length && <ul className="mt-1.5 list-disc pl-5 text-[12.5px]">{open.ai.acceptanceCriteria.map((x, i) => <li key={i}>{x}</li>)}</ul>}
                {open.ai.metric && <p className="mt-1.5 text-[12.5px] text-[var(--w-text-2)]">{wt('srsx.aiMetric', { scale: open.ai.metric.scale, meter: open.ai.metric.meter, must: open.ai.metric.must ?? '—', unit: open.ai.metric.unit ?? '' })}</p>}
                {!!open.ai.notes?.length && <p className="mt-1.5 text-[12px] text-[var(--w-text-3)]">{open.ai.notes.join(' · ')}</p>}
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
