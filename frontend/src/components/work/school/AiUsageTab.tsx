'use client';

/**
 * A29 — AI Usage Report theo SWP391 Template0 (đợt 3B). Nhật ký dùng AI theo tuần: "Collect from CT Work" tự ghi
 * từ provenance (thẻ AI-assisted, lượt AI agent, hội thoại trợ lý AI — không ghi trùng, không đè dòng đã sửa) +
 * dòng nhập tay; cột kiểm chứng / số đo / điểm 1–5 / rủi ro do sinh viên điền. Xuất .xlsx đúng mẫu.
 */

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bot, Download, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { ddmm, mondayOf, schoolApi, schoolKeys, SDLC_PHASES, todayLocal, type AiUsageInput, type AiUsageLog } from './schoolApi';
import { wt } from '@/components/work/i18n';

export default function AiUsageTab({ pid, canEdit }: { pid: number; canEdit: boolean }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: schoolKeys.ai(pid), queryFn: () => schoolApi.ai(pid) });
  const [busy, setBusy] = useState<'sync' | 'export' | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const groups = useMemo(() => {
    const m = new Map<string, { label: string; rows: AiUsageLog[] }>();
    for (const l of q.data?.logs ?? []) {
      const key = l.weekNo && l.weekNo > 0 ? `n${String(l.weekNo).padStart(3, '0')}` : `d${mondayOf(l.usedAt)}`;
      if (!m.has(key)) m.set(key, { label: l.weekNo && l.weekNo > 0 ? wt('school.weekN', { n: l.weekNo }) : wt('school.weekOf', { d: ddmm(mondayOf(l.usedAt)) }), rows: [] });
      m.get(key)!.rows.push(l);
    }
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }, [q.data]);
  if (q.isLoading) return <PageLoading />;
  if (!q.data) return <EmptyState title={wt('common.couldNotLoad')} body={q.error ? workError(q.error) : undefined} />;
  const logs = q.data.logs;
  const missing = logs.filter((l) => !l.validation || !l.value).length;

  const sync = async () => {
    setBusy('sync');
    try {
      const r = await schoolApi.syncAi(pid);
      await qc.invalidateQueries({ queryKey: schoolKeys.ai(pid) });
      toast.success(r.added ? wt('school.aiAdded', { count: r.added }) : wt('school.nothingNew'));
    } catch (e) { toast.error(workError(e, wt('school.collectFailed'))); } finally { setBusy(null); }
  };
  const patch = async (l: AiUsageLog, body: Partial<AiUsageInput>) => {
    try {
      const res = await schoolApi.updateAi(pid, l.id, body);
      qc.setQueryData<typeof q.data>(schoolKeys.ai(pid), (old) => old && { ...old, logs: old.logs.map((x) => (x.id === l.id ? { ...x, ...res } : x)) });
    } catch (e) { toast.error(workError(e, wt('common.couldNotSave'))); }
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--w-border)] px-4 py-3">
        <div className="text-[13px]"><b>{logs.length}</b> {wt('school.entries')} · <span className={cn(missing && 'text-[var(--w-yellow)]')}>{wt('school.needValidation', { n: missing })}</span></div>
        <div className="ml-auto flex flex-wrap gap-2">
          {canEdit && <button type="button" className="w-btn w-btn-sm" disabled={!!busy} onClick={sync} title={wt('school.collectTitle')}>{busy === 'sync' ? <Spinner size={12} /> : <Bot size={13} />} {wt('school.collect')}</button>}
          {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setAddOpen(true)}><Plus size={13} /> {wt('school.entry')}</button>}
          <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={!!busy} onClick={async () => {
            setBusy('export');
            try { toast.success(wt('fpt.exported', { name: await schoolApi.exportAi(pid) })); } catch (e) { toast.error(workError(e, wt('fpt.exportFailed'))); } finally { setBusy(null); }
          }}>{busy === 'export' ? <Spinner size={12} /> : <Download size={13} />} {wt('school.exportT0')}</button>
        </div>
      </div>
      {!logs.length ? (
        <EmptyState title={wt('school.noAi')} body={wt('school.noAiBody')}
          action={canEdit ? <div className="flex gap-2"><button type="button" className="w-btn w-btn-primary" onClick={sync}><Bot size={14} /> {wt('school.collect')}</button><button type="button" className="w-btn" onClick={() => setAddOpen(true)}><Plus size={14} /> {wt('school.addEntry')}</button></div> : undefined} />
      ) : (
        <div className="min-h-0 flex-1 overflow-auto p-4">
          {groups.map((g) => (
            <div key={g.label} className="mb-5">
              <h3 className="mb-1 text-[13px] font-semibold">{g.label} <span className="font-normal text-[var(--w-text-3)]">· {g.rows.length}</span></h3>
              <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
                <table className="w-full min-w-[1240px] border-separate border-spacing-0 text-[12.5px]">
                  <thead className="bg-[#fff59d] text-left text-[11.5px] text-[#3d3a00]">
                    <tr>{['Date', 'SDLC phase', 'Task / activity', 'AI tool', 'AI output', 'Your validation / modification', 'Evidence', 'Measure', 'Value', 'Risks / limitations', ''].map((h) => <th key={h} className="px-2 py-1.5 font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {g.rows.map((l) => (
                      <tr key={l.id} className="align-top">
                        <td className="whitespace-nowrap border-t border-[var(--w-border)] px-2 py-1.5">{ddmm(l.usedAt)}{l.source === 'AUTO' && <div className="text-[10.5px] text-[var(--w-text-3)]" title={wt('school.collectedFrom')}>auto</div>}</td>
                        <td className="border-t border-[var(--w-border)] px-1 py-1">
                          <select className="w-input h-[28px] w-[130px] text-[12px]" disabled={!canEdit} value={l.phase} aria-label={wt('school.sdlcPhase')} onChange={(e) => patch(l, { phase: e.target.value })}>
                            {SDLC_PHASES.map((p) => <option key={p}>{p}</option>)}
                          </select>
                        </td>
                        <Cell w={200} v={l.task} ro={!canEdit} label={wt('school.task')} max={300} onCommit={(v) => v && patch(l, { task: v })} />
                        <Cell w={120} v={l.tool} ro={!canEdit} label={wt('school.aiTool')} max={120} onCommit={(v) => v && patch(l, { tool: v })} />
                        <Cell w={190} v={l.output} ro={!canEdit} label={wt('school.aiOutput')} onCommit={(v) => patch(l, { output: v || null })} />
                        <Cell w={210} v={l.validation} ro={!canEdit} label={wt('school.validation')} warn={!l.validation} onCommit={(v) => patch(l, { validation: v || null })} />
                        <Cell w={140} v={l.evidence} ro={!canEdit} label={wt('school.evidence')} max={1000} onCommit={(v) => patch(l, { evidence: v || null })} />
                        <Cell w={120} v={l.measure} ro={!canEdit} label={wt('school.measure')} max={300} onCommit={(v) => patch(l, { measure: v || null })} />
                        <td className="border-t border-[var(--w-border)] px-1 py-1">
                          <select className={cn('w-input h-[28px] w-[56px] text-[12px]', !l.value && 'border-[var(--w-yellow)]')} disabled={!canEdit} value={l.value ?? ''} aria-label={wt('school.valueAdded')} onChange={(e) => patch(l, { value: e.target.value ? Number(e.target.value) : null })}>
                            <option value="">—</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </td>
                        <Cell w={170} v={l.risks} ro={!canEdit} label={wt('school.risks')} onCommit={(v) => patch(l, { risks: v || null })} />
                        <td className="border-t border-[var(--w-border)] px-1 py-1.5 text-center">
                          {canEdit && <button type="button" className="text-[var(--w-text-3)] hover:text-[var(--w-red)]" aria-label={wt('school.deleteEntry')} onClick={async () => {
                            if (!window.confirm(wt('school.deleteEntryQ'))) return;
                            try { await schoolApi.deleteAi(pid, l.id); qc.invalidateQueries({ queryKey: schoolKeys.ai(pid) }); } catch (e) { toast.error(workError(e)); }
                          }}><Trash2 size={12} /></button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
      <AddDialog open={addOpen} onClose={() => setAddOpen(false)} pid={pid} onAdded={() => qc.invalidateQueries({ queryKey: schoolKeys.ai(pid) })} />
    </div>
  );
}

function Cell({ v, onCommit, ro, label, w, max = 4000, warn }: { v: string | null; onCommit: (v: string) => void; ro: boolean; label: string; w: number; max?: number; warn?: boolean }) {
  const [t, setT] = useState(v ?? '');
  const [focus, setFocus] = useState(false);
  return (
    <td className="border-t border-[var(--w-border)] px-1 py-1" style={{ width: w }}>
      <textarea rows={2} className={cn('w-input min-h-[44px] resize-y py-1 text-[12.5px]', warn && !ro && 'placeholder:text-[var(--w-yellow)]')} readOnly={ro} aria-label={label} maxLength={max}
        placeholder={warn && !ro ? wt('school.fillIn') : ''} value={focus ? t : v ?? ''}
        onFocus={() => { setFocus(true); setT(v ?? ''); }} onChange={(e) => setT(e.target.value)}
        onBlur={() => { setFocus(false); if (t.trim() !== (v ?? '')) onCommit(t.trim()); }} />
    </td>
  );
}

function AddDialog({ open, onClose, pid, onAdded }: { open: boolean; onClose: () => void; pid: number; onAdded: () => void }) {
  const blank = (): AiUsageInput => ({ usedAt: todayLocal(), phase: 'Implementation', task: '', tool: '', output: '', validation: '', evidence: '', measure: '', value: null, risks: '' });
  const [f, setF] = useState<AiUsageInput>(blank);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof AiUsageInput>(k: K, v: AiUsageInput[K]) => setF((x) => ({ ...x, [k]: v }));
  const submit = async () => {
    if (!f.task.trim() || !f.tool.trim()) return;
    setBusy(true);
    try { await schoolApi.addAi(pid, f); onAdded(); setF(blank()); onClose(); } catch (e) { toast.error(workError(e, wt('school.addFailed'))); } finally { setBusy(false); }
  };
  return (
    <Dialog open={open} onClose={() => !busy && onClose()} title={wt('school.addAiEntry')} width={620}
      footer={<><button type="button" className="w-btn" onClick={onClose} disabled={busy}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" onClick={submit} disabled={busy || !f.task.trim() || !f.tool.trim()}>{busy && <Spinner size={12} />} {wt('common.add')}</button></>}>
      <div className="grid gap-x-4 sm:grid-cols-3">
        <Field label={wt('common.day')}><input type="date" className="w-input" value={f.usedAt} onChange={(e) => set('usedAt', e.target.value)} /></Field>
        <Field label={wt('school.sdlc')}><select className="w-input" value={f.phase} onChange={(e) => set('phase', e.target.value)}>{SDLC_PHASES.map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label={wt('school.aiTool')}><input className="w-input" value={f.tool} maxLength={120} placeholder={wt('school.phTool')} onChange={(e) => set('tool', e.target.value)} /></Field>
      </div>
      <Field label={wt('school.task')}><input className="w-input" value={f.task} maxLength={300} placeholder={wt('school.phTask')} onChange={(e) => set('task', e.target.value)} /></Field>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Field label={wt('school.aiOutput')}><textarea className="w-input min-h-[60px]" value={f.output ?? ''} maxLength={4000} placeholder={wt('school.phOutput')} onChange={(e) => set('output', e.target.value)} /></Field>
        <Field label={wt('school.validation')}><textarea className="w-input min-h-[60px]" value={f.validation ?? ''} maxLength={4000} placeholder={wt('school.phValidation')} onChange={(e) => set('validation', e.target.value)} /></Field>
        <Field label={wt('school.evidence')}><input className="w-input" value={f.evidence ?? ''} maxLength={1000} placeholder={wt('school.phEvidence')} onChange={(e) => set('evidence', e.target.value)} /></Field>
        <Field label={wt('school.measure')}><input className="w-input" value={f.measure ?? ''} maxLength={300} placeholder={wt('school.phMeasure')} onChange={(e) => set('measure', e.target.value)} /></Field>
      </div>
      <div className="grid gap-x-4 sm:grid-cols-[120px_1fr]">
        <Field label={wt('school.value15')}><select className="w-input" value={f.value ?? ''} onChange={(e) => set('value', e.target.value ? Number(e.target.value) : null)}><option value="">—</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select></Field>
        <Field label={wt('school.risks')}><input className="w-input" value={f.risks ?? ''} maxLength={4000} placeholder={wt('school.phRisks')} onChange={(e) => set('risks', e.target.value)} /></Field>
      </div>
    </Dialog>
  );
}
