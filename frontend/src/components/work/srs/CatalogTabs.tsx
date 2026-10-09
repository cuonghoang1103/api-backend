'use client';

/**
 * CTW đợt 4 (A6 + A7) — ba danh mục nhỏ của SRS: Actors (bảng 1.3.1), Business Rules (5.1, BR-nn — UC tham chiếu) và
 * Non-UI Functions (1.4.3). Mỗi danh mục: bảng có tiêu đề dính + hộp thêm/sửa có nhãn.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { workCtw4Api, workCtw4Keys, type SrsActor, type SrsData, type SrsFunction, type SrsRule } from '@/lib/work-ctw4-api';
import { Dialog, EmptyState, Field, Spinner } from '../ui';
import { Chip, Clip, TableFrame, TD, TextArea, TH, UcStatusChip } from './shared';
import { wt } from '@/components/work/i18n';

function useRefresh(pid: number) {
  const qc = useQueryClient();
  return () => { qc.invalidateQueries({ queryKey: workCtw4Keys.srs(pid) }); qc.invalidateQueries({ queryKey: workCtw4Keys.rtm(pid) }); };
}

const RowActions = ({ onEdit, onDelete, label }: { onEdit: () => void; onDelete?: () => void; label: string }) => (
  <span className="flex justify-end gap-1">
    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('common.edit')} ${label}`} title={wt('common.edit')} onClick={onEdit}><Pencil size={13} /></button>
    {onDelete && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('common.delete')} ${label}`} title={wt('common.delete')} onClick={onDelete}><Trash2 size={13} /></button>}
  </span>
);

// ─── Actors ──────────────────────────────────────────────────────

export function ActorsTab({ pid, data }: { pid: number; data: SrsData }) {
  const refresh = useRefresh(pid);
  const [edit, setEdit] = useState<SrsActor | 'new' | null>(null);
  const [f, setF] = useState({ name: '', description: '', kind: 'PERSON' as 'PERSON' | 'SYSTEM' });
  useEffect(() => { if (edit) setF(edit === 'new' ? { name: '', description: '', kind: 'PERSON' } : { name: edit.name, description: edit.description ?? '', kind: edit.kind === 'SYSTEM' ? 'SYSTEM' : 'PERSON' }); }, [edit]);
  const save = useMutation({
    mutationFn: () => (edit === 'new' ? workCtw4Api.createActor(pid, { name: f.name.trim(), description: f.description || null, kind: f.kind }) : workCtw4Api.updateActor(pid, (edit as SrsActor).id, { name: f.name.trim(), description: f.description || null, kind: f.kind })),
    onSuccess: () => { refresh(); setEdit(null); toast.success(wt('common.saved')); },
    onError: (e) => toast.error(workError(e, wt('srs.actorSaveFailed'))),
  });
  const del = useMutation({ mutationFn: (id: number) => workCtw4Api.deleteActor(pid, id), onSuccess: () => { refresh(); toast.success(wt('srs.actorDeleted')); }, onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  const uses = (id: number) => data.useCases.filter((u) => u.primaryActorId === id || u.secondaryActorIds.includes(id)).length;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-[13px] text-[var(--w-text-2)]">{wt('srs.actorsIntro')}</p>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEdit('new')}><Plus size={14} /> {wt('srs.addActor')}</button>}
      </div>
      {!data.actors.length ? <EmptyState title={wt('srs.noActors')} body={wt('srs.noActorsBody')} /> : (
        <TableFrame label="Actors">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead><tr>{['#', 'Actor', wt('srs.kind'), wt('common.description'), 'Use case', ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {data.actors.map((a, i) => (
                <tr key={a.id} className="hover:bg-[var(--w-hover)]">
                  <td className={`${TD} w-10 text-[var(--w-text-2)]`}>{i + 1}</td>
                  <td className={`${TD} font-medium`}>{a.name}</td>
                  <td className={TD}><Chip tone={a.kind === 'SYSTEM' ? 'blue' : 'muted'}>{a.kind === 'SYSTEM' ? wt('srs.system') : wt('srs.person')}</Chip></td>
                  <td className={`${TD} max-w-[420px]`}><Clip text={a.description} /></td>
                  <td className={`${TD} tabular-nums`}>{uses(a.id)}</td>
                  <td className={`${TD} w-20`}>{data.canEdit && <RowActions label={a.name} onEdit={() => setEdit(a)} onDelete={() => window.confirm(wt('srs.deleteActorQ', { name: a.name })) && del.mutate(a.id)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? wt('srs.addActor') : wt('srs.editActor')} width={520}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        <Field label={wt('common.name')}><input className="w-input" autoFocus value={f.name} maxLength={120} placeholder="Student" onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label={wt('srs.kind')}>
          <select className="w-input" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as 'PERSON' | 'SYSTEM' })}>
            <option value="PERSON">{wt('srs.personOpt')}</option><option value="SYSTEM">{wt('srs.systemOpt')}</option>
          </select>
        </Field>
        <TextArea id="actor-desc" label={wt('common.description')} value={f.description} rows={3} onChange={(v) => setF({ ...f, description: v })} />
      </Dialog>
    </div>
  );
}

// ─── Business rules ──────────────────────────────────────────────

export function RulesTab({ pid, data }: { pid: number; data: SrsData }) {
  const refresh = useRefresh(pid);
  const [edit, setEdit] = useState<SrsRule | 'new' | null>(null);
  const [f, setF] = useState({ name: '', definition: '', category: '' });
  useEffect(() => { if (edit) setF(edit === 'new' ? { name: '', definition: '', category: '' } : { name: edit.name, definition: edit.definition ?? '', category: edit.category ?? '' }); }, [edit]);
  const save = useMutation({
    mutationFn: () => {
      const body = { name: f.name.trim(), definition: f.definition || null, category: f.category.trim() || null };
      return edit === 'new' ? workCtw4Api.createRule(pid, body) : workCtw4Api.updateRule(pid, (edit as SrsRule).number, body);
    },
    onSuccess: (r) => { refresh(); setEdit(null); toast.success(wt('srs.savedKey', { key: r.key })); },
    onError: (e) => toast.error(workError(e, wt('srs.ruleSaveFailed'))),
  });
  const accept = useMutation({ mutationFn: (n: number) => workCtw4Api.updateRule(pid, n, { status: 'DRAFT' }), onSuccess: () => { refresh(); toast.success(wt('srs.ruleAccepted')); }, onError: (e) => toast.error(workError(e, wt('srs.acceptFailed'))) });
  const del = useMutation({ mutationFn: (n: number) => workCtw4Api.deleteRule(pid, n), onSuccess: () => { refresh(); toast.success(wt('srs.ruleDeleted')); }, onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-[13px] text-[var(--w-text-2)]">{wt('srs.rulesIntro')}</p>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEdit('new')}><Plus size={14} /> {wt('srs.addRule')}</button>}
      </div>
      {!data.rules.length ? <EmptyState title={wt('srs.noRulesT')} body={wt('srs.noRulesBody')} /> : (
        <TableFrame label={wt('srs.tabBusinessRules')}>
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead><tr>{['ID', wt('srs.ruleName'), wt('srs.ruleDef'), wt('srs.usedIn'), wt('common.status'), ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {data.rules.map((r) => (
                <tr key={r.number} className="hover:bg-[var(--w-hover)]">
                  <td className={`${TD} font-mono text-[12px]`}>{r.key}</td>
                  <td className={`${TD} font-medium`}>{r.name}</td>
                  <td className={`${TD} max-w-[420px]`}><Clip text={r.definition} lines={3} /></td>
                  <td className={`${TD} font-mono text-[12px]`}>{r.usedIn.join(', ') || <span className="text-[var(--w-text-3)]">—</span>}</td>
                  <td className={TD}><span className="flex items-center gap-1.5"><UcStatusChip status={r.status} />{r.status === 'PROPOSED' && data.canApprove && <button type="button" className="w-btn w-btn-sm" onClick={() => accept.mutate(r.number)}>{wt('srs.acceptShort')}</button>}</span></td>
                  <td className={`${TD} w-20`}>{data.canEdit && <RowActions label={r.key} onEdit={() => setEdit(r)} onDelete={() => window.confirm(wt('releases.deleteQ', { name: r.key })) && del.mutate(r.number)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? wt('srs.addRuleT') : `${wt('common.edit')} ${(edit as SrsRule | null)?.key ?? ''}`} width={560}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        <Field label={wt('srs.ruleName')}><input className="w-input" autoFocus value={f.name} maxLength={200} placeholder={wt('srs.ruleNamePh')} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <TextArea id="rule-def" label={wt('srs.ruleDef')} value={f.definition} rows={4} onChange={(v) => setF({ ...f, definition: v })} hint={wt('srs.ruleDefHint')} />
        <Field label={wt('srs.category')}><input className="w-input" value={f.category} maxLength={60} placeholder={wt('srs.categoryPh')} onChange={(e) => setF({ ...f, category: e.target.value })} /></Field>
      </Dialog>
    </div>
  );
}

// ─── Non-UI functions ────────────────────────────────────────────

export function FunctionsTab({ pid, data }: { pid: number; data: SrsData }) {
  const refresh = useRefresh(pid);
  const [edit, setEdit] = useState<SrsFunction | 'new' | null>(null);
  const [f, setF] = useState({ feature: '', name: '', description: '', issue: '' });
  useEffect(() => { if (edit) setF(edit === 'new' ? { feature: '', name: '', description: '', issue: '' } : { feature: edit.feature ?? '', name: edit.name, description: edit.description ?? '', issue: '' }); }, [edit]);
  const save = useMutation({
    mutationFn: () => {
      const issueNumber = Number(/(\d+)\s*$/.exec(f.issue)?.[1]) || undefined;
      const body = { feature: f.feature.trim() || null, name: f.name.trim(), description: f.description || null, ...(issueNumber ? { issueNumber } : {}) };
      return edit === 'new' ? workCtw4Api.createFunction(pid, body) : workCtw4Api.updateFunction(pid, (edit as SrsFunction).id, body);
    },
    onSuccess: () => { refresh(); setEdit(null); toast.success(wt('common.saved')); },
    onError: (e) => toast.error(workError(e, wt('srs.fnSaveFailed'))),
  });
  const del = useMutation({ mutationFn: (id: number) => workCtw4Api.deleteFunction(pid, id), onSuccess: () => { refresh(); toast.success(wt('srs.deleted')); }, onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-[13px] text-[var(--w-text-2)]">{wt('srs.fnIntro')}</p>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEdit('new')}><Plus size={14} /> {wt('fpt.addFunction')}</button>}
      </div>
      {!data.functions.length ? <EmptyState title={wt('srs.noFn')} body={wt('srs.noFnBody')} /> : (
        <TableFrame label={wt('srs.tabNonUiFunctions')}>
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead><tr>{[wt('school.hFeature'), wt('srs.sysFn'), wt('common.description'), ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {data.functions.map((fn) => (
                <tr key={fn.id} className="hover:bg-[var(--w-hover)]">
                  <td className={TD}>{fn.feature ?? '—'}</td>
                  <td className={`${TD} font-medium`}>{fn.name}</td>
                  <td className={`${TD} max-w-[460px]`}><Clip text={fn.description} lines={3} /></td>
                  <td className={`${TD} w-20`}>{data.canEdit && <RowActions label={fn.name} onEdit={() => setEdit(fn)} onDelete={() => window.confirm(wt('releases.deleteQ', { name: fn.name })) && del.mutate(fn.id)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? wt('srs.addFn') : wt('srs.editFn')} width={560}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        <Field label={wt('school.hFeature')}><input className="w-input" value={f.feature} maxLength={120} placeholder="Booking" onChange={(e) => setF({ ...f, feature: e.target.value })} /></Field>
        <Field label={wt('srs.sysFn')}><input className="w-input" autoFocus value={f.name} maxLength={200} placeholder="Auto-expire reservations" onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <TextArea id="fn-desc" label={wt('common.description')} value={f.description} rows={3} onChange={(v) => setF({ ...f, description: v })} />
        <Field label={wt('srs.reqIssueOpt')}><input className="w-input" value={f.issue} placeholder={`${data.key}-12`} onChange={(e) => setF({ ...f, issue: e.target.value })} /></Field>
      </Dialog>
    </div>
  );
}
