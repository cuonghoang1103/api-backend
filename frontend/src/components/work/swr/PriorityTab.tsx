'use client';

/**
 * CTW đợt 4b (R12) — Bảng ưu tiên Wiegers (Deliverable 7): mỗi dòng là một FE-n hoặc UC-nn ĐANG CÓ (liên kết #5), bốn
 * điểm 1–9 (benefit, penalty, cost, risk), trọng số dự án; value % / cost % / risk % / priority tính đúng công thức sheet
 * Template của `Requirements Prioritization Spreadsheet.xlsx`; xuất xlsx giữ công thức.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { workSwrApi, workSwrKeys, type PriorityRow, type Weights } from '@/lib/work-swr-api';
import { wfmt, wt, type WKey } from '@/components/work/i18n';
import { EmptyState, PageLoading, Spinner } from '../ui';
import { Chip, downloadXlsx, RowActions, TableFrame, TabIntro, TD, TH, useSwrRefresh } from './shared';

const SCORES = ['benefit', 'penalty', 'cost', 'risk'] as const;
type ScoreKey = (typeof SCORES)[number];
const S_LABEL: Record<ScoreKey, WKey> = { benefit: 'swr.sBenefit', penalty: 'swr.sPenalty', cost: 'swr.sCost', risk: 'swr.sRisk' };

function ScoreInput({ row, k, disabled, onSave }: { row: PriorityRow; k: ScoreKey; disabled: boolean; onSave: (v: number) => void }) {
  const [v, setV] = useState(String(row[k]));
  useEffect(() => setV(String(row[k])), [row, k]);
  const commit = () => {
    const n = Number(v);
    if (Number.isInteger(n) && n >= 1 && n <= 9 && n !== row[k]) onSave(n);
    else setV(String(row[k]));
  };
  return (
    <input type="number" min={1} max={9} step={1} className="w-input h-7 w-14 px-1.5 text-center tabular-nums" value={v} disabled={disabled}
      aria-label={wt('swr.scoreOf', { what: wt(S_LABEL[k]), row: row.label ?? '' })}
      onChange={(e) => setV(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
  );
}

export default function PriorityTab({ pid }: { pid: number }) {
  const refresh = useSwrRefresh(pid);
  const q = useQuery({ queryKey: workSwrKeys.priority(pid), queryFn: () => workSwrApi.priority(pid) });
  const [w, setW] = useState<Weights | null>(null);
  const [pick, setPick] = useState('');
  useEffect(() => { if (q.data) setW(q.data.weights); }, [q.data]);
  const upd = useMutation({ mutationFn: (x: { id: number; body: Partial<Record<ScoreKey, number>> }) => workSwrApi.updateRow(pid, x.id, x.body), onSuccess: () => refresh(), onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))) });
  const add = useMutation({
    mutationFn: () => { const [kind, ref] = pick.split('|'); return workSwrApi.upsertRow(pid, { target: { kind: kind as 'FE' | 'UC', ref } }); },
    onSuccess: () => { refresh(); setPick(''); }, onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const seed = useMutation({ mutationFn: (kind: 'FE' | 'UC') => workSwrApi.seedRows(pid, kind), onSuccess: (r) => { refresh(); toast.success(wt('swr.rowsAdded', { count: r.added })); }, onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))) });
  const del = useMutation({ mutationFn: (id: number) => workSwrApi.removeRow(pid, id), onSuccess: () => refresh(), onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  const weights = useMutation({ mutationFn: () => workSwrApi.settings(pid, { weights: w! }), onSuccess: () => { refresh(); toast.success(wt('swr.weightsSaved')); }, onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))) });

  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  const fmt = (n: number, d = 1) => wfmt.number(n, { minimumFractionDigits: d, maximumFractionDigits: d });
  const sorted = [...data.rows].sort((a, b) => (a.computed?.rank ?? 999) - (b.computed?.rank ?? 999));
  const dirty = !!w && (['benefit', 'penalty', 'cost', 'risk'] as const).some((k) => w[k] !== data.weights[k]);
  return (
    <div className="flex flex-col gap-3">
      <TabIntro text={wt('swr.priorityIntro')}>
        <button type="button" className="w-btn w-btn-sm" onClick={() => downloadXlsx(pid, 'priority')}><FileSpreadsheet size={13} /> .xlsx</button>
      </TabIntro>
      {w && (
        <fieldset className="flex flex-wrap items-end gap-3 rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
          <legend className="px-1 text-[12px] font-medium text-[var(--w-text-2)]">{wt('swr.weights')}</legend>
          {SCORES.map((k) => (
            <label key={k} className="flex flex-col gap-1 text-[12px] text-[var(--w-text-2)]">
              {wt(S_LABEL[k])}
              <input type="number" min={0} max={10} step={0.5} className="w-input h-8 w-20 tabular-nums" value={w[k]} disabled={!data.canConfigure} onChange={(e) => setW({ ...w, [k]: Number(e.target.value) })} />
            </label>
          ))}
          {data.canConfigure && <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={!dirty || weights.isPending} onClick={() => weights.mutate()}>{weights.isPending && <Spinner size={12} />} {wt('common.save')}</button>}
          <p className="basis-full text-[12px] text-[var(--w-text-2)]">{wt('swr.weightsHint')}</p>
        </fieldset>
      )}
      {data.canEdit && (
        <div className="flex flex-wrap items-center gap-2">
          <select className="w-input h-8 w-auto min-w-[240px]" aria-label={wt('swr.addRow')} value={pick} onChange={(e) => setPick(e.target.value)}>
            <option value="">{wt('swr.addRowPh')}</option>
            {data.candidates.map((c) => <option key={`${c.kind}|${c.ref}`} value={`${c.kind}|${c.ref}`}>{c.ref} — {c.label}</option>)}
          </select>
          <button type="button" className="w-btn w-btn-sm" disabled={!pick || add.isPending} onClick={() => add.mutate()}><Plus size={13} /> {wt('common.add')}</button>
          <button type="button" className="w-btn w-btn-sm" disabled={seed.isPending} onClick={() => seed.mutate('FE')}>{wt('swr.seedFe')}</button>
          <button type="button" className="w-btn w-btn-sm" disabled={seed.isPending} onClick={() => seed.mutate('UC')}>{wt('swr.seedUc')}</button>
        </div>
      )}
      {!data.rows.length ? <EmptyState title={wt('swr.noRows')} body={wt('swr.noRowsBody')} /> : (
        <TableFrame label={wt('swr.tabPriority')}>
          <table className="w-full min-w-[1040px] border-separate border-spacing-0">
            <thead><tr>{['#', wt('swr.hFeatureOrUc'), wt('swr.sBenefit'), wt('swr.sPenalty'), wt('swr.hTotalValue'), 'Value %', wt('swr.sCost'), 'Cost %', wt('swr.sRisk'), 'Risk %', wt('common.priority'), ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--w-hover)]">
                  <td className={`${TD} tabular-nums`}>{r.computed?.rank ?? '—'}</td>
                  <td className={`${TD} max-w-[320px]`}>{r.label ?? <Chip tone="red">{wt('swr.orphanRow')}</Chip>}</td>
                  {(['benefit', 'penalty'] as const).map((k) => <td key={k} className={TD}><ScoreInput row={r} k={k} disabled={!data.canEdit || r.orphan} onSave={(v) => upd.mutate({ id: r.id, body: { [k]: v } })} /></td>)}
                  <td className={`${TD} tabular-nums`}>{r.computed ? fmt(r.computed.totalValue, 1) : '—'}</td>
                  <td className={`${TD} tabular-nums`}>{r.computed ? fmt(r.computed.valuePct) : '—'}</td>
                  <td className={TD}><ScoreInput row={r} k="cost" disabled={!data.canEdit || r.orphan} onSave={(v) => upd.mutate({ id: r.id, body: { cost: v } })} /></td>
                  <td className={`${TD} tabular-nums`}>{r.computed ? fmt(r.computed.costPct) : '—'}</td>
                  <td className={TD}><ScoreInput row={r} k="risk" disabled={!data.canEdit || r.orphan} onSave={(v) => upd.mutate({ id: r.id, body: { risk: v } })} /></td>
                  <td className={`${TD} tabular-nums`}>{r.computed ? fmt(r.computed.riskPct) : '—'}</td>
                  <td className={`${TD} font-semibold tabular-nums`}>{r.computed ? fmt(r.computed.priority, 2) : '—'}</td>
                  <td className={`${TD} w-12`}>{data.canEdit && <RowActions label={r.label ?? String(r.id)} onDelete={() => del.mutate(r.id)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
    </div>
  );
}
