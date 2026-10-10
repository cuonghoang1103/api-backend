'use client';

/**
 * CTW đợt 4b (R6) — Phân loại yêu cầu Wiegers (Business / User / Functional / Quality attribute theo nhóm chất lượng /
 * Constraint / External interface / Data) + thuộc tính (priority, source, owner, rationale, stability, version) + vòng đời
 * Proposed → Approved → Implemented → Verified, Deleted / Rejected. Mỗi thay đổi một dòng lịch sử của thẻ.
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { History, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { REQ_TYPES, workSwrApi, workSwrKeys, type Lifecycle, type P3, type ReqType, type Requirement } from '@/lib/work-swr-api';
import { wfmt, wt } from '@/components/work/i18n';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { caps, Chip, LIFECYCLE_KEY, LifecycleChip, P3_KEY, TabIntro, TextArea, TYPE_KEY, useSwrRefresh } from './shared';
import DataTable from '../table/DataTable';

type Filter = ReqType | 'ALL' | 'UNCLASSIFIED';
const EMPTY = { reqType: 'FUNCTIONAL' as ReqType, subtype: '', priority: '' as '' | P3, source: '', ownerId: '', rationale: '', stability: '' as '' | P3 };

export default function RequirementsTab({ pid, onOpenIssue }: { pid: number; onOpenIssue: (n: number) => void }) {
  const refresh = useSwrRefresh(pid);
  const q = useQuery({ queryKey: workSwrKeys.requirements(pid), queryFn: () => workSwrApi.requirements(pid) });
  const [filter, setFilter] = useState<Filter>('ALL');
  const [edit, setEdit] = useState<Requirement | null>(null);
  const [f, setF] = useState(EMPTY);
  const [hist, setHist] = useState<Requirement | null>(null);
  const h = useQuery({ queryKey: workSwrKeys.history(pid, hist?.number ?? 0), queryFn: () => workSwrApi.history(pid, hist!.number), enabled: !!hist });
  useEffect(() => {
    if (!edit) return;
    setF({ reqType: edit.reqType ?? 'FUNCTIONAL', subtype: edit.subtype ?? '', priority: edit.priority ?? '', source: edit.source ?? '', ownerId: edit.ownerId ? String(edit.ownerId) : '', rationale: edit.rationale ?? '', stability: edit.stability ?? '' });
  }, [edit]);
  const save = useMutation({
    mutationFn: () => workSwrApi.setRequirement(pid, edit!.number, {
      reqType: f.reqType, subtype: f.subtype || null, priority: f.priority || null, source: f.source || null, ownerId: f.ownerId ? Number(f.ownerId) : null,
      rationale: f.rationale || null, stability: f.stability || null, ...(edit!.classified ? { reqVersion: edit!.reqVersion } : {}),
    }),
    onSuccess: (r) => { refresh(); setEdit(null); toast.success(wt('swr.savedKey', { key: r.key })); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const move = useMutation({
    mutationFn: (x: { num: number; to: Lifecycle }) => workSwrApi.setLifecycle(pid, x.num, x.to),
    onSuccess: (r) => { refresh(); toast.success(wt('swr.statusNow', { key: r.key, s: wt(LIFECYCLE_KEY[r.lifecycle]) })); },
    onError: (e) => toast.error(workError(e, wt('swr.statusFailed'))),
  });
  const bulkMove = useMutation({
    mutationFn: async (x: { nums: number[]; to: Lifecycle }) => {
      let ok = 0;
      for (const num of x.nums) { try { await workSwrApi.setLifecycle(pid, num, x.to); ok += 1; } catch { /* đếm lỗi */ } }
      return { ok, failed: x.nums.length - ok };
    },
    onSuccess: (r) => { refresh(); if (r.ok) toast.success(wt('uxc.movedN', { count: r.ok })); if (r.failed) toast.error(wt('uxc.moveFailedN', { count: r.failed })); },
  });
  const rows = useMemo(() => (q.data?.requirements ?? []).filter((r) => filter === 'ALL' || (filter === 'UNCLASSIFIED' ? !r.classified : r.reqType === filter)), [q.data, filter]);

  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  const subtypes = f.reqType === 'QUALITY' ? data.qualityAttrs : f.reqType === 'EXTERNAL_INTERFACE' ? data.interfaceKinds : f.reqType === 'DATA' ? data.dataKinds : [];
  const chips: Array<[Filter, string, number]> = [
    ['ALL', wt('common.all'), data.counts.total], ['UNCLASSIFIED', wt('swr.unclassified'), data.counts.unclassified],
    ...REQ_TYPES.map((t) => [t, wt(TYPE_KEY[t]), data.counts.byType[t]] as [Filter, string, number]),
  ];
  return (
    <div className="flex flex-col gap-3">
      <TabIntro text={wt('swr.reqIntro')} />
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={wt('swr.filterType')}>
        {chips.map(([k, label, n]) => (
          <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}
            className={cn('w-btn w-btn-sm', filter === k && 'w-btn-primary')}>{label} <span className="tabular-nums opacity-80">{n}</span></button>
        ))}
      </div>
      {!data.requirements.length ? <EmptyState title={wt('swr.noReqs')} body={wt('swr.noReqsBody')} /> : (
        // UX-C: bảng chung — sắp xếp/lọc nhanh/cột/xuất; chọn nhiều ⇒ chuyển vòng đời hàng loạt (chỉ áp cho dòng cho phép bước đó).
        <div className="w-card overflow-hidden">
          <DataTable
            id="swr-requirements"
            label={wt('swr.tabRequirements')}
            rows={rows}
            rowKey={(r) => r.issueId}
            height="auto"
            selectable={data.canEdit || data.canApprove}
            exportName="requirements"
            columns={[
              { id: 'key', header: 'ID', width: 96, value: (r) => r.number, exportValue: (r) => r.key, text: (r) => r.key,
                cell: (r) => <button type="button" className="font-mono text-[12px] text-[var(--w-accent-text)] hover:underline" onClick={() => onOpenIssue(r.number)}>{r.key}</button> },
              { id: 'title', header: wt('swr.hRequirement'), width: 300, grow: true, required: true, value: (r) => r.title,
                cell: (r) => <span className="min-w-0"><span className="block truncate font-medium" title={r.title}>{r.title}</span>{r.rationale ? <span className="block truncate text-[11.5px] text-[var(--w-text-3)]" title={r.rationale}>{r.rationale}</span> : null}</span> },
              { id: 'type', header: wt('common.type'), width: 150, value: (r) => (r.reqType ? wt(TYPE_KEY[r.reqType]) : wt('swr.unclassified')),
                cell: (r) => (r.reqType ? <Chip tone="blue">{wt(TYPE_KEY[r.reqType])}</Chip> : <Chip tone="yellow">{wt('swr.unclassified')}</Chip>) },
              { id: 'subtype', header: wt('swr.hCategory'), width: 130, hideBelow: 'md', value: (r) => caps(r.subtype) || null },
              { id: 'priority', header: wt('common.priority'), width: 100, value: (r) => (r.priority ? wt(P3_KEY[r.priority]) : null) },
              { id: 'status', header: wt('common.status'), width: 220, value: (r) => wt(LIFECYCLE_KEY[r.lifecycle]),
                cell: (r) => (
                  <span className="flex items-center gap-1.5">
                    <LifecycleChip lc={r.lifecycle} />
                    {(data.canEdit || data.canApprove) && r.next.length > 0 && (
                      <select className="w-input h-7 w-auto py-0 text-[12px]" aria-label={wt('swr.moveTo', { key: r.key })} value="" disabled={move.isPending}
                        onChange={(e) => e.target.value && move.mutate({ num: r.number, to: e.target.value as Lifecycle })}>
                        <option value="">{wt('swr.moveShort')}</option>
                        {r.next.map((n) => <option key={n} value={n}>{wt(LIFECYCLE_KEY[n])}</option>)}
                      </select>
                    )}
                  </span>
                ) },
              { id: 'source', header: wt('swr.hSource'), width: 170, hideBelow: 'lg', value: (r) => r.source },
              { id: 'version', header: wt('swr.hVersion'), width: 80, align: 'right', value: (r) => (r.classified ? r.reqVersion : null), cell: (r) => <span className="tabular-nums">{r.classified ? `v${r.reqVersion}` : '—'}</span> },
              { id: 'actions', header: '', width: 84, sortable: false, export: false, required: true,
                cell: (r) => (
                  <span className="flex w-full justify-end gap-1">
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('swr.history')} ${r.key}`} title={wt('swr.history')} onClick={() => setHist(r)}><History size={13} /></button>
                    {data.canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('swr.classify')} ${r.key}`} title={wt('swr.classify')} onClick={() => setEdit(r)}><SlidersHorizontal size={13} /></button>}
                  </span>
                ) },
            ]}
            bulkActions={(sel, clear) => {
              const targets = [...new Set(sel.flatMap((r) => r.next))];
              return (
                <select className="w-input h-7 w-auto py-0 text-[12px]" aria-label={wt('uxc.bulkLifecycle')} value="" disabled={bulkMove.isPending || !targets.length}
                  onChange={(e) => {
                    const to = e.target.value as Lifecycle;
                    if (!to) return;
                    bulkMove.mutate({ nums: sel.filter((r) => r.next.includes(to)).map((r) => r.number), to }, { onSuccess: clear });
                  }}>
                  <option value="">{wt('uxc.bulkLifecycle')}</option>
                  {targets.map((n) => <option key={n} value={n}>{wt(LIFECYCLE_KEY[n])} ({sel.filter((r) => r.next.includes(n)).length})</option>)}
                </select>
              );
            }}
          />
        </div>
      )}

      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit ? wt('swr.classifyTitle', { key: edit.key }) : ''} width={600}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        {edit && <p className="mb-3 text-[13px] font-medium">{edit.title}</p>}
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label={wt('common.type')}>
            <select className="w-input" value={f.reqType} onChange={(e) => setF({ ...f, reqType: e.target.value as ReqType, subtype: '' })}>
              {REQ_TYPES.map((t) => <option key={t} value={t}>{wt(TYPE_KEY[t])}</option>)}
            </select>
          </Field>
          <Field label={wt('swr.hCategory')}>
            <select className="w-input" value={f.subtype} disabled={!subtypes.length} onChange={(e) => setF({ ...f, subtype: e.target.value })}>
              <option value="">—</option>{subtypes.map((s) => <option key={s} value={s}>{caps(s)}</option>)}
            </select>
          </Field>
          <Field label={wt('common.priority')}>
            <select className="w-input" value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as '' | P3 })}>
              <option value="">—</option>{(['HIGH', 'MEDIUM', 'LOW'] as const).map((p) => <option key={p} value={p}>{wt(P3_KEY[p])}</option>)}
            </select>
          </Field>
          <Field label={wt('swr.hStability')}>
            <select className="w-input" value={f.stability} onChange={(e) => setF({ ...f, stability: e.target.value as '' | P3 })}>
              <option value="">—</option>{(['HIGH', 'MEDIUM', 'LOW'] as const).map((p) => <option key={p} value={p}>{wt(P3_KEY[p])}</option>)}
            </select>
          </Field>
          <Field label={wt('swr.hSource')}><input className="w-input" value={f.source} maxLength={300} placeholder={wt('swr.sourcePh')} onChange={(e) => setF({ ...f, source: e.target.value })} /></Field>
          <Field label={wt('common.owner')}>
            <select className="w-input" value={f.ownerId} onChange={(e) => setF({ ...f, ownerId: e.target.value })}>
              <option value="">—</option>{data.owners.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </Field>
        </div>
        <TextArea id="req-rationale" label={wt('swr.hRationale')} value={f.rationale} rows={3} onChange={(v) => setF({ ...f, rationale: v })} />
      </Dialog>

      <Dialog open={!!hist} onClose={() => setHist(null)} title={hist ? wt('swr.historyOf', { key: hist.key }) : ''} width={560}
        footer={<button type="button" className="w-btn" onClick={() => setHist(null)}>{wt('common.close')}</button>}>
        {h.isLoading ? <Spinner /> : !(h.data ?? []).length ? <p className="text-[13px] text-[var(--w-text-2)]">{wt('swr.noHistory')}</p> : (
          <ol className="flex flex-col gap-2 text-[13px]">
            {h.data!.map((x) => (
              <li key={x.id} className="border-b border-[var(--w-border)] pb-2">
                <span className="font-medium">{x.actor ?? '—'}</span>{x.actorKind === 'AGENT' ? <span className="ml-1"><Chip tone="accent">AI</Chip></span> : null}
                <span className="text-[var(--w-text-2)]"> · {wfmt.dateTime(x.at)}</span>
                <div>{x.field}: <span className="text-[var(--w-text-2)]">{x.from ?? '∅'}</span> → <span className="font-medium">{x.to ?? '∅'}</span></div>
              </li>
            ))}
          </ol>
        )}
      </Dialog>
    </div>
  );
}
