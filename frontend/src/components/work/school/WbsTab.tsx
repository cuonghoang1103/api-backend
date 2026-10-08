'use client';

/**
 * A3 — WBS + ước lượng (đợt 3B). Cây epic → story → sub-task đánh số 1.0 / 1.1 / 1.1.1 như sheet WBS của
 * Report2_Project Tracking; mỗi dòng: loại (Screen/Function/Non-UI), số field + transaction ⇒ độ phức tạp ⇒
 * man-day theo bảng quy đổi (ADMIN sửa được), effort dự kiến ghi đè, effort thực tế từ worklog.
 */

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, EmptyState, PageLoading, Spinner } from '../ui';
import { COMPLEXITIES, days, schoolApi, schoolKeys, WBS_KINDS, type Complexity, type EstimationMatrix, type WbsData, type WbsItemInput, type WbsRow } from './schoolApi';

const numOrNull = (v: string) => (v.trim() === '' ? null : Math.max(0, Number(v)) || 0);

export default function WbsTab({ pid, onOpenIssue }: { pid: number; onOpenIssue: (n: number) => void }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: schoolKeys.wbs(pid), queryFn: () => schoolApi.wbs(pid) });
  const [matrixOpen, setMatrixOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [onlyLeaves, setOnlyLeaves] = useState(false);
  const data = q.data;
  const rows = useMemo(() => (data?.rows ?? []).filter((r) => !onlyLeaves || !r.childCount), [data, onlyLeaves]);
  if (q.isLoading) return <PageLoading />;
  if (!data) return <EmptyState title="Could not load the WBS" body={q.error ? workError(q.error) : undefined} />;

  const patch = async (r: WbsRow, body: WbsItemInput) => {
    try {
      const res = await schoolApi.setItem(pid, r.number, body);
      qc.setQueryData<WbsData>(schoolKeys.wbs(pid), (old) => old && res.row ? { ...old, totals: res.totals, rows: old.rows.map((x) => (x.issueId === res.row!.issueId ? res.row! : x)) } : old);
      // Cha cộng dồn effort của con ⇒ tải lại cả cây cho số ở dòng cha đúng.
      qc.invalidateQueries({ queryKey: schoolKeys.wbs(pid) });
    } catch (e) { toast.error(workError(e, 'Could not save')); }
  };
  const t = data.totals;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[var(--w-border)] px-4 py-3">
        <Stat label="Planned" value={`${days(t.plannedDays)} pds`} />
        <Stat label="Actual" value={`${days(t.actualDays)} pds`} tone={t.actualDays > t.plannedDays && t.plannedDays > 0 ? 'red' : undefined} />
        <Stat label="Estimated" value={t.functions} />
        <Stat label="Not estimated" value={t.unestimated} tone={t.unestimated ? 'yellow' : undefined} />
        <div className="flex flex-wrap gap-2 text-[12px] text-[var(--w-text-2)]">
          {t.byIteration.map((it) => (
            <span key={it.iteration} className="rounded-full bg-[var(--w-sunken)] px-2 py-0.5">{it.iteration}: <b>{it.functions}</b> · {days(it.plannedDays)} pds</span>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]"><input type="checkbox" checked={onlyLeaves} onChange={(e) => setOnlyLeaves(e.target.checked)} /> Functions only</label>
          <button type="button" className="w-btn w-btn-sm" onClick={() => setMatrixOpen(true)}><Settings2 size={13} /> Complexity table</button>
          <button type="button" className="w-btn w-btn-sm" disabled={busy} onClick={async () => {
            setBusy(true);
            try { toast.success(`Exported ${await schoolApi.exportWbs(pid)}`); } catch (e) { toast.error(workError(e, 'Could not export')); } finally { setBusy(false); }
          }}>{busy ? <Spinner size={12} /> : <Download size={13} />} Export WBS (.xlsx)</button>
        </div>
      </div>
      {data.truncated && <div className="border-b border-[var(--w-border)] bg-[var(--w-yellow-soft,transparent)] px-4 py-2 text-[12.5px] text-[var(--w-yellow)]">Only the first 3,000 issues are shown.</div>}
      {!rows.length ? (
        <EmptyState title="No work items yet" body="The WBS is built from your epics, stories and sub-tasks. Create an epic with a few stories under it, then estimate each one here." />
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[1180px] border-separate border-spacing-0 text-[12.5px]">
            <thead className="sticky top-0 z-10 bg-[var(--w-raised,var(--w-panel))] text-left text-[11.5px] text-[var(--w-text-2)]">
              <tr>
                {['#', 'Function / Screen', 'Type', 'Feature', 'Fields', 'Trans.', 'Level', 'Planned (pds)', 'Actual (pds)', 'Iteration', 'Status', 'In charge'].map((h) => (
                  <th key={h} className="whitespace-nowrap border-b border-[var(--w-border)] px-2 py-2 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.issueId} className={cn('hover:bg-[var(--w-hover)]', r.depth === 0 && 'font-medium')}>
                  <td className="border-b border-[var(--w-border)] px-2 py-1 font-mono text-[11.5px] text-[var(--w-text-2)]">{r.wbs}</td>
                  <td className="max-w-[340px] border-b border-[var(--w-border)] px-2 py-1">
                    <button type="button" className="block w-full truncate text-left hover:underline" style={{ paddingLeft: r.depth * 14 }} onClick={() => onOpenIssue(r.number)} title={`${r.key} ${r.title}`}>
                      <span className="mr-1.5 font-mono text-[11px] text-[var(--w-text-3)]">{r.key}</span>{r.title}
                    </button>
                  </td>
                  <td className="border-b border-[var(--w-border)] px-1 py-1">
                    <select className="w-input h-[28px] w-[96px] text-[12px]" disabled={!data.canEdit} value={r.kind} aria-label="Type" onChange={(e) => patch(r, { kind: e.target.value || null })}>
                      <option value="">—</option>
                      {WBS_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </td>
                  <td className="border-b border-[var(--w-border)] px-1 py-1"><TextCell value={r.feature} ro={!data.canEdit} width={130} label="Feature" onCommit={(v) => patch(r, { feature: v || null })} /></td>
                  <td className="border-b border-[var(--w-border)] px-1 py-1"><NumCell value={r.fields} ro={!data.canEdit} label="Fields" onCommit={(v) => patch(r, { fields: v })} /></td>
                  <td className="border-b border-[var(--w-border)] px-1 py-1"><NumCell value={r.transactions} ro={!data.canEdit} label="Transactions" onCommit={(v) => patch(r, { transactions: v })} /></td>
                  <td className="border-b border-[var(--w-border)] px-1 py-1">
                    <select className={cn('w-input h-[28px] w-[132px] text-[12px]', r.complexitySource && r.complexitySource !== 'set' && 'italic text-[var(--w-text-2)]')} disabled={!data.canEdit}
                      value={r.complexitySource === 'set' ? r.complexity ?? '' : ''} aria-label="Complexity" title={r.complexitySource === 'derived' ? `From fields/transactions: ${r.complexity}` : r.complexitySource === 'field' ? `From the Complexity field: ${r.complexity}` : undefined}
                      onChange={(e) => patch(r, { complexity: (e.target.value || null) as Complexity | null })}>
                      <option value="">{r.complexity && r.complexitySource !== 'set' ? `Auto · ${r.complexity}` : '—'}</option>
                      {COMPLEXITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="border-b border-[var(--w-border)] px-1 py-1">
                    <div className="flex items-center gap-1">
                      <NumCell value={r.plannedSource === 'override' ? r.plannedDays : null} placeholder={r.plannedSource && r.plannedSource !== 'override' ? days(r.plannedDays) : ''} step={0.5} ro={!data.canEdit} label="Planned effort override" onCommit={(v) => patch(r, { plannedDays: v })} />
                      {r.childCount > 0 && <span className="text-[11px] text-[var(--w-text-3)]" title="Including children">Σ{days(r.plannedTotal)}</span>}
                    </div>
                  </td>
                  <td className={cn('border-b border-[var(--w-border)] px-2 py-1 tabular-nums', r.plannedTotal && r.actualTotal > r.plannedTotal ? 'text-[var(--w-red)]' : '')}>{days(r.childCount ? r.actualTotal : r.actualDays) || '—'}</td>
                  <td className="whitespace-nowrap border-b border-[var(--w-border)] px-2 py-1 text-[var(--w-text-2)]">{r.iteration || '—'}</td>
                  <td className="whitespace-nowrap border-b border-[var(--w-border)] px-2 py-1"><span className="rounded-full bg-[var(--w-sunken)] px-2 py-0.5 text-[11.5px]" title={r.statusName}>{r.status}</span></td>
                  <td className="whitespace-nowrap border-b border-[var(--w-border)] px-2 py-1 text-[var(--w-text-2)]">{r.assignee || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <MatrixDialog open={matrixOpen} onClose={() => setMatrixOpen(false)} pid={pid} matrix={data.matrix} canEdit={data.canEditMatrix} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'red' | 'yellow' }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">{label}</div>
      <div className={cn('text-[17px] font-semibold tabular-nums leading-tight', tone === 'red' && 'text-[var(--w-red)]', tone === 'yellow' && 'text-[var(--w-yellow)]')}>{value}</div>
    </div>
  );
}

function NumCell({ value, onCommit, ro, label, placeholder, step = 1 }: { value: number | null; onCommit: (v: number | null) => void; ro: boolean; label: string; placeholder?: string; step?: number }) {
  const [v, setV] = useState(value === null ? '' : String(value));
  const [focus, setFocus] = useState(false);
  const shown = focus ? v : value === null ? '' : String(value);
  return (
    <input type="number" min={0} step={step} className="w-input h-[28px] w-[64px] text-[12px] tabular-nums" readOnly={ro} aria-label={label} placeholder={placeholder}
      value={shown} onFocus={() => { setFocus(true); setV(value === null ? '' : String(value)); }}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => { setFocus(false); const n = numOrNull(v); if (n !== value) onCommit(n); }}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} />
  );
}

function TextCell({ value, onCommit, ro, label, width }: { value: string; onCommit: (v: string) => void; ro: boolean; label: string; width: number }) {
  const [v, setV] = useState(value);
  const [focus, setFocus] = useState(false);
  return (
    <input className="w-input h-[28px] text-[12px]" style={{ width }} readOnly={ro} aria-label={label} value={focus ? v : value} maxLength={120}
      onFocus={() => { setFocus(true); setV(value); }} onChange={(e) => setV(e.target.value)}
      onBlur={() => { setFocus(false); if (v.trim() !== value) onCommit(v.trim()); }}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} />
  );
}

function MatrixDialog({ open, onClose, pid, matrix, canEdit }: { open: boolean; onClose: () => void; pid: number; matrix: EstimationMatrix; canEdit: boolean }) {
  const qc = useQueryClient();
  const [m, setM] = useState<EstimationMatrix>(matrix);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) setM(matrix); }, [open, matrix]);
  const setLv = (i: number, k: 'maxFields' | 'maxTransactions' | 'manDays', v: string) =>
    setM((x) => ({ ...x, levels: x.levels.map((l, j) => (j === i ? { ...l, [k]: v.trim() === '' ? (k === 'manDays' ? 0 : null) : Number(v) } : l)) }));
  const save = async () => {
    setSaving(true);
    try {
      const res = await schoolApi.setMatrix(pid, m);
      qc.setQueryData(schoolKeys.wbs(pid), res);
      toast.success('Complexity table saved');
      onClose();
    } catch (e) { toast.error(workError(e, 'Could not save')); } finally { setSaving(false); }
  };
  return (
    <Dialog open={open} onClose={() => !saving && onClose()} title="Complexity → effort" width={620}
      footer={canEdit ? <><button type="button" className="w-btn" onClick={onClose}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={saving} onClick={save}>{saving && <Spinner size={12} />} Save</button></> : <button type="button" className="w-btn" onClick={onClose}>Close</button>}>
      <p className="mb-3 text-[12.5px] text-[var(--w-text-2)]">
        A function is <b>Simple</b> when both its fields and transactions are within the Simple limits, otherwise <b>Medium</b> within the Medium limits, otherwise <b>Complex</b>.
        The default is the FPT SEP490 template (≤7 fields &amp; ≤3 transactions = 3 man-days, ≤15 &amp; ≤7 = 5, more = 7).{!canEdit && ' Only project admins can change it.'}
      </p>
      <table className="w-full text-[12.5px]">
        <thead className="text-left text-[11.5px] text-[var(--w-text-2)]"><tr><th className="py-1">Level</th><th>Max fields</th><th>Max transactions</th><th>Man-days</th></tr></thead>
        <tbody>
          {m.levels.map((l, i) => (
            <tr key={l.name}>
              <td className="py-1 font-semibold">{l.name}</td>
              {(['maxFields', 'maxTransactions', 'manDays'] as const).map((k) => (
                <td key={k} className="pr-2">
                  <input type="number" min={0} step={k === 'manDays' ? 0.5 : 1} className="w-input h-[30px] w-[110px]" readOnly={!canEdit} aria-label={`${l.name} ${k}`}
                    value={l[k] ?? ''} placeholder={k === 'manDays' ? '' : 'no limit'} onChange={(e) => setLv(i, k, e.target.value)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <label className="mt-3 flex items-center gap-2 text-[12.5px]">Hours per man-day
        <input type="number" min={1} max={24} className="w-input h-[30px] w-[80px]" readOnly={!canEdit} value={m.hoursPerDay} onChange={(e) => setM((x) => ({ ...x, hoursPerDay: Number(e.target.value) || 8 }))} />
        <span className="text-[var(--w-text-3)]">— converts logged hours and hour estimates to man-days</span>
      </label>
    </Dialog>
  );
}
