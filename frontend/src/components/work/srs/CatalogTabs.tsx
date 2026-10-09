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

function useRefresh(pid: number) {
  const qc = useQueryClient();
  return () => { qc.invalidateQueries({ queryKey: workCtw4Keys.srs(pid) }); qc.invalidateQueries({ queryKey: workCtw4Keys.rtm(pid) }); };
}

const RowActions = ({ onEdit, onDelete, label }: { onEdit: () => void; onDelete?: () => void; label: string }) => (
  <span className="flex justify-end gap-1">
    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Edit ${label}`} title="Edit" onClick={onEdit}><Pencil size={13} /></button>
    {onDelete && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Delete ${label}`} title="Delete" onClick={onDelete}><Trash2 size={13} /></button>}
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
    onSuccess: () => { refresh(); setEdit(null); toast.success('Saved'); },
    onError: (e) => toast.error(workError(e, 'Could not save the actor')),
  });
  const del = useMutation({ mutationFn: (id: number) => workCtw4Api.deleteActor(pid, id), onSuccess: () => { refresh(); toast.success('Actor deleted'); }, onError: (e) => toast.error(workError(e, 'Could not delete')) });
  const uses = (id: number) => data.useCases.filter((u) => u.primaryActorId === id || u.secondaryActorIds.includes(id)).length;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-[13px] text-[var(--w-text-2)]">Everyone and everything that interacts with the system — user roles, and external systems or timers for non-UI functions. Table 1.3.1 of Report 3.</p>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEdit('new')}><Plus size={14} /> Add actor</button>}
      </div>
      {!data.actors.length ? <EmptyState title="No actors yet" body="Add the user roles first (e.g. Student, Lab Manager, Administrator) — use cases and the screen authorization matrix are built on them." /> : (
        <TableFrame label="Actors">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead><tr>{['#', 'Actor', 'Kind', 'Description', 'Use cases', ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {data.actors.map((a, i) => (
                <tr key={a.id} className="hover:bg-[var(--w-hover)]">
                  <td className={`${TD} w-10 text-[var(--w-text-2)]`}>{i + 1}</td>
                  <td className={`${TD} font-medium`}>{a.name}</td>
                  <td className={TD}><Chip tone={a.kind === 'SYSTEM' ? 'blue' : 'muted'}>{a.kind === 'SYSTEM' ? 'System' : 'Person'}</Chip></td>
                  <td className={`${TD} max-w-[420px]`}><Clip text={a.description} /></td>
                  <td className={`${TD} tabular-nums`}>{uses(a.id)}</td>
                  <td className={`${TD} w-20`}>{data.canEdit && <RowActions label={a.name} onEdit={() => setEdit(a)} onDelete={() => window.confirm(`Delete actor ${a.name}? Use cases keep their text but lose this actor.`) && del.mutate(a.id)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? 'Add actor' : 'Edit actor'} width={520}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} Save</button></>}>
        <Field label="Name"><input className="w-input" autoFocus value={f.name} maxLength={120} placeholder="Student" onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Kind">
          <select className="w-input" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as 'PERSON' | 'SYSTEM' })}>
            <option value="PERSON">Person (user role)</option><option value="SYSTEM">System (external system, timer)</option>
          </select>
        </Field>
        <TextArea id="actor-desc" label="Description" value={f.description} rows={3} onChange={(v) => setF({ ...f, description: v })} />
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
    onSuccess: (r) => { refresh(); setEdit(null); toast.success(`Saved ${r.key}`); },
    onError: (e) => toast.error(workError(e, 'Could not save the rule')),
  });
  const accept = useMutation({ mutationFn: (n: number) => workCtw4Api.updateRule(pid, n, { status: 'DRAFT' }), onSuccess: () => { refresh(); toast.success('Rule accepted'); }, onError: (e) => toast.error(workError(e, 'Could not accept')) });
  const del = useMutation({ mutationFn: (n: number) => workCtw4Api.deleteRule(pid, n), onSuccess: () => { refresh(); toast.success('Rule deleted'); }, onError: (e) => toast.error(workError(e, 'Could not delete')) });
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-[13px] text-[var(--w-text-2)]">Every validation becomes a business rule (BR-01 …) that use cases reference. Section 5.1 of Report 3.</p>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEdit('new')}><Plus size={14} /> Add rule</button>}
      </div>
      {!data.rules.length ? <EmptyState title="No business rules yet" body="Write each rule as one testable sentence — e.g. “Start time is later than now and at most 14 days ahead.”" /> : (
        <TableFrame label="Business rules">
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead><tr>{['ID', 'Rule name', 'Rule definition', 'Used in', 'Status', ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {data.rules.map((r) => (
                <tr key={r.number} className="hover:bg-[var(--w-hover)]">
                  <td className={`${TD} font-mono text-[12px]`}>{r.key}</td>
                  <td className={`${TD} font-medium`}>{r.name}</td>
                  <td className={`${TD} max-w-[420px]`}><Clip text={r.definition} lines={3} /></td>
                  <td className={`${TD} font-mono text-[12px]`}>{r.usedIn.join(', ') || <span className="text-[var(--w-text-3)]">—</span>}</td>
                  <td className={TD}><span className="flex items-center gap-1.5"><UcStatusChip status={r.status} />{r.status === 'PROPOSED' && data.canApprove && <button type="button" className="w-btn w-btn-sm" onClick={() => accept.mutate(r.number)}>Accept</button>}</span></td>
                  <td className={`${TD} w-20`}>{data.canEdit && <RowActions label={r.key} onEdit={() => setEdit(r)} onDelete={() => window.confirm(`Delete ${r.key}?`) && del.mutate(r.number)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? 'Add business rule' : `Edit ${(edit as SrsRule | null)?.key ?? ''}`} width={560}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} Save</button></>}>
        <Field label="Rule name"><input className="w-input" autoFocus value={f.name} maxLength={200} placeholder="Booking window" onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <TextArea id="rule-def" label="Rule definition" value={f.definition} rows={4} onChange={(v) => setF({ ...f, definition: v })} hint="One rule per row, measurable: a tester must be able to say pass or fail." />
        <Field label="Category (optional)"><input className="w-input" value={f.category} maxLength={60} placeholder="Validation, Calculation, Access…" onChange={(e) => setF({ ...f, category: e.target.value })} /></Field>
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
    onSuccess: () => { refresh(); setEdit(null); toast.success('Saved'); },
    onError: (e) => toast.error(workError(e, 'Could not save the function')),
  });
  const del = useMutation({ mutationFn: (id: number) => workCtw4Api.deleteFunction(pid, id), onSuccess: () => { refresh(); toast.success('Deleted'); }, onError: (e) => toast.error(workError(e, 'Could not delete')) });
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-[13px] text-[var(--w-text-2)]">Functions with no screen — scheduled jobs, background processing, integrations. Table 1.4.3 of Report 3.</p>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEdit('new')}><Plus size={14} /> Add function</button>}
      </div>
      {!data.functions.length ? <EmptyState title="No non-UI functions" body="E.g. “Auto-expire reservations — runs every night at 00:00 and cancels unconfirmed bookings.”" /> : (
        <TableFrame label="Non-UI functions">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead><tr>{['Feature', 'System function', 'Description', ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {data.functions.map((fn) => (
                <tr key={fn.id} className="hover:bg-[var(--w-hover)]">
                  <td className={TD}>{fn.feature ?? '—'}</td>
                  <td className={`${TD} font-medium`}>{fn.name}</td>
                  <td className={`${TD} max-w-[460px]`}><Clip text={fn.description} lines={3} /></td>
                  <td className={`${TD} w-20`}>{data.canEdit && <RowActions label={fn.name} onEdit={() => setEdit(fn)} onDelete={() => window.confirm(`Delete ${fn.name}?`) && del.mutate(fn.id)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? 'Add non-UI function' : 'Edit non-UI function'} width={560}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} Save</button></>}>
        <Field label="Feature"><input className="w-input" value={f.feature} maxLength={120} placeholder="Booking" onChange={(e) => setF({ ...f, feature: e.target.value })} /></Field>
        <Field label="System function"><input className="w-input" autoFocus value={f.name} maxLength={200} placeholder="Auto-expire reservations" onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <TextArea id="fn-desc" label="Description" value={f.description} rows={3} onChange={(v) => setF({ ...f, description: v })} />
        <Field label="Requirement issue (optional)"><input className="w-input" value={f.issue} placeholder={`${data.key}-12`} onChange={(e) => setF({ ...f, issue: e.target.value })} /></Field>
      </Dialog>
    </div>
  );
}
