'use client';

/** Tab Workflow: sửa trạng thái (thứ tự, tên, nhóm, màu, WIP), luồng chuyển, tạo quy trình mới. */

import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig, type StatusCategory, type WorkStatus, type WorkWorkflow } from '@/lib/work-api';
import { Dialog, Field, IssueTypeIcon, Spinner } from '../ui';
import { Section, Select } from './shared';
import { ColorPicker } from './ProjectLabels';
import { useProjectInvalidate } from './useProjectInvalidate';

export const CATEGORY_LABEL: Record<StatusCategory, string> = { TODO: 'To do', IN_PROGRESS: 'In progress', DONE: 'Done' };
const CATEGORIES: StatusCategory[] = ['TODO', 'IN_PROGRESS', 'DONE'];
const DEFAULT_COLOR: Record<StatusCategory, string> = { TODO: '#64748b', IN_PROGRESS: '#2563eb', DONE: '#16a34a' };

const sortStatuses = (wf: WorkWorkflow) => [...wf.statuses].sort((a, b) => a.position - b.position);

/** Ô số WIP: rỗng = không giới hạn; lưu khi rời ô. */
export function WipInput({ value, onCommit, disabled, label }: { value: number | null; onCommit: (v: number | null) => void; disabled?: boolean; label: string }) {
  const [text, setText] = useState(value == null ? '' : String(value));
  useEffect(() => setText(value == null ? '' : String(value)), [value]);
  const commit = () => {
    const t = text.trim();
    const n = t ? Math.floor(Number(t)) : null;
    if (n !== null && (!Number.isFinite(n) || n < 1)) { setText(value == null ? '' : String(value)); return; }
    if (n !== value) onCommit(n);
  };
  return (
    <input
      type="number"
      min={1}
      inputMode="numeric"
      className="w-input !h-7 !w-[72px] shrink-0 !px-2 text-[12px] disabled:opacity-60"
      placeholder="No limit"
      title="WIP limit (leave empty for no limit)"
      aria-label={label}
      value={text}
      disabled={disabled}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
    />
  );
}

// ─── Một dòng trạng thái ─────────────────────────────────────────

function StatusRow({
  status, index, count, pid, canEdit, busy, onMove, onDelete, onChanged,
}: {
  status: WorkStatus; index: number; count: number; pid: number; canEdit: boolean; busy: boolean;
  onMove: (dir: -1 | 1) => void; onDelete: () => void; onChanged: () => void;
}) {
  const [name, setName] = useState(status.name);
  useEffect(() => setName(status.name), [status.name]);

  const update = useMutation({
    mutationFn: (body: { name?: string; category?: StatusCategory; color?: string; wipLimit?: number | null }) => workApi.updateStatus(pid, status.id, body),
    onSuccess: () => onChanged(),
    onError: (err) => { toast.error(workError(err, 'Could not update the status')); setName(status.name); },
  });

  const commitName = () => {
    const n = name.trim();
    if (!n) { setName(status.name); return; }
    if (n !== status.name) update.mutate({ name: n });
  };
  const locked = !canEdit || update.isPending;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 last:border-b-0 sm:flex-nowrap">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {canEdit && (
          <div className="flex shrink-0 flex-col">
            <button type="button" className="flex h-3.5 w-5 items-center justify-center text-[var(--w-text-3)] hover:text-[var(--w-text)] disabled:opacity-30" disabled={busy || index === 0} onClick={() => onMove(-1)} aria-label={`Move ${status.name} up`}>
              <ArrowUp size={12} />
            </button>
            <button type="button" className="flex h-3.5 w-5 items-center justify-center text-[var(--w-text-3)] hover:text-[var(--w-text)] disabled:opacity-30" disabled={busy || index === count - 1} onClick={() => onMove(1)} aria-label={`Move ${status.name} down`}>
              <ArrowDown size={12} />
            </button>
          </div>
        )}
        <ColorPicker value={status.color} ariaLabel="Status colour" disabled={locked} onChange={(c) => update.mutate({ color: c })} />
        {canEdit ? (
          <input
            className="h-7 min-w-0 flex-1 rounded-[5px] border border-transparent bg-transparent px-2 text-[13px] outline-none hover:border-[var(--w-border)] focus:border-[var(--w-accent-border)]"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') { setName(status.name); e.currentTarget.blur(); }
            }}
            aria-label="Status name"
          />
        ) : (
          <span className="min-w-0 flex-1 truncate px-2 text-[13px]">{status.name}</span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 pl-7 sm:pl-0">
        {update.isPending && <Spinner size={12} />}
        <Select
          className="!h-7 !w-[118px] text-[12px]"
          value={status.category}
          disabled={locked}
          onChange={(e) => update.mutate({ category: e.target.value as StatusCategory })}
          aria-label="Status category"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
        </Select>
        <WipInput value={status.wipLimit} disabled={locked} label={`WIP limit for ${status.name}`} onCommit={(v) => update.mutate({ wipLimit: v })} />
        {canEdit && (
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onDelete} disabled={count <= 1} aria-label={`Delete status ${status.name}`} title="Delete status">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Hộp xoá trạng thái ──────────────────────────────────────────

function DeleteStatusDialog({ status, statuses, pid, onClose, onDone }: { status: WorkStatus | null; statuses: WorkStatus[]; pid: number; onClose: () => void; onDone: () => void }) {
  const others = statuses.filter((s) => s.id !== status?.id);
  const [moveTo, setMoveTo] = useState<number | ''>('');
  useEffect(() => {
    if (!status) return;
    // Mặc định chuyển sang trạng thái cùng nhóm, không có thì trạng thái đầu tiên.
    const same = others.find((s) => s.category === status.category) ?? others[0];
    setMoveTo(same?.id ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.id]);

  const del = useMutation({
    mutationFn: () => workApi.deleteStatus(pid, status!.id, moveTo || undefined),
    onSuccess: () => { toast.success(`Status “${status?.name}” deleted`); onDone(); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not delete the status')),
  });

  return (
    <Dialog
      open={!!status}
      onClose={onClose}
      title="Delete status?"
      width={440}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-danger-solid" disabled={!moveTo || del.isPending} onClick={() => del.mutate()}>
            {del.isPending && <Spinner size={12} />}
            Delete status
          </button>
        </>
      }
    >
      <p className="mb-4 text-[13px] leading-relaxed text-[var(--w-text-2)]">
        The status <span className="font-medium text-[var(--w-text)]">{status?.name}</span> will be removed from this workflow, along with any transitions that use it.
        Issues currently in it will be moved to the status you choose.
      </p>
      <Field label="Move issues to">
        <Select value={moveTo} onChange={(e) => setMoveTo(e.target.value ? Number(e.target.value) : '')}>
          {others.map((s) => <option key={s.id} value={s.id}>{s.name} ({CATEGORY_LABEL[s.category]})</option>)}
        </Select>
      </Field>
    </Dialog>
  );
}

// ─── Ma trận luồng chuyển ────────────────────────────────────────

const pairKey = (from: number | null, to: number) => `${from ?? 'any'}:${to}`;

function TransitionsEditor({ wf, statuses, pid, canEdit, onSaved }: { wf: WorkWorkflow; statuses: WorkStatus[]; pid: number; canEdit: boolean; onSaved: () => void }) {
  const initialMode: 'free' | 'restricted' = wf.transitions.length ? 'restricted' : 'free';
  // Khoá theo chữ ký nội dung, không theo tham chiếu mảng — tải lại cấu hình không xoá bản nháp.
  const sig = wf.transitions.map((t) => pairKey(t.fromStatusId, t.toStatusId)).sort().join(',');
  const initialSet = useMemo(() => new Set(sig ? sig.split(',') : []), [sig]);
  const [mode, setMode] = useState(initialMode);
  const [pairs, setPairs] = useState<Set<string>>(initialSet);
  // Dữ liệu máy chủ đổi (sau khi lưu / phiên khác sửa) ⇒ nạp lại bản nháp.
  useEffect(() => { setMode(initialMode); setPairs(new Set(initialSet)); }, [initialMode, initialSet]);

  const dirty = mode !== initialMode || (mode === 'restricted' && (pairs.size !== initialSet.size || [...pairs].some((k) => !initialSet.has(k))));

  const save = useMutation({
    mutationFn: () => {
      if (mode === 'free') return workApi.setTransitions(pid, wf.id, { mode: 'free' });
      const transitions = [...pairs].map((k) => {
        const [f, t] = k.split(':');
        return { from: f === 'any' ? null : Number(f), to: Number(t) };
      });
      return workApi.setTransitions(pid, wf.id, { mode: 'restricted', transitions });
    },
    onSuccess: () => { toast.success('Transitions saved'); onSaved(); },
    onError: (err) => toast.error(workError(err, 'Could not save the transitions')),
  });

  const toggle = (from: number | null, to: number) => {
    const k = pairKey(from, to);
    setPairs((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };

  const switchMode = (m: 'free' | 'restricted') => {
    setMode(m);
    // Chuyển sang giới hạn lần đầu: khởi đầu bằng "từ bất kỳ" → mọi trạng thái (tương đương tự do).
    if (m === 'restricted' && !pairs.size) setPairs(new Set(statuses.map((s) => pairKey(null, s.id))));
  };

  const rows: Array<{ id: number | null; name: string }> = [{ id: null, name: 'From any status' }, ...statuses.map((s) => ({ id: s.id, name: s.name }))];

  return (
    <div className="mt-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)]">Transitions</h4>
        {canEdit && dirty && (
          <div className="flex items-center gap-2">
            <button type="button" className="w-btn w-btn-sm" onClick={() => { setMode(initialMode); setPairs(new Set(initialSet)); }}>Discard</button>
            <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending || (mode === 'restricted' && !pairs.size)} onClick={() => save.mutate()}>
              {save.isPending && <Spinner size={12} />}
              Save transitions
            </button>
          </div>
        )}
      </div>
      <div className="mb-3 flex flex-col gap-1.5 text-[13px]">
        <label className={cn('flex items-center gap-2', canEdit ? 'cursor-pointer' : 'cursor-default')}>
          <input type="radio" name={`tmode-${wf.id}`} checked={mode === 'free'} disabled={!canEdit} onChange={() => switchMode('free')} className="accent-[var(--w-accent)]" />
          Allow any status to move to any status
        </label>
        <label className={cn('flex items-center gap-2', canEdit ? 'cursor-pointer' : 'cursor-default')}>
          <input type="radio" name={`tmode-${wf.id}`} checked={mode === 'restricted'} disabled={!canEdit} onChange={() => switchMode('restricted')} className="accent-[var(--w-accent)]" />
          Only allow the moves checked below
        </label>
      </div>
      {mode === 'restricted' && (
        <>
          <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[var(--w-sunken)]">
                  <th className="sticky left-0 z-[1] min-w-[140px] bg-[var(--w-sunken)] px-3 py-2 text-left font-medium text-[var(--w-text-3)]">From ↓ / To →</th>
                  {statuses.map((s) => (
                    <th key={s.id} className="min-w-[84px] px-2 py-2 text-center font-medium text-[var(--w-text-2)]">
                      <span className="line-clamp-2 break-words">{s.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id ?? 'any'} className="border-t border-[var(--w-border)]">
                    <th scope="row" className={cn('sticky left-0 z-[1] bg-[var(--w-panel)] px-3 py-1.5 text-left font-medium', r.id === null ? 'italic text-[var(--w-text-2)]' : 'text-[var(--w-text)]')}>
                      <span className="line-clamp-2 break-words">{r.name}</span>
                    </th>
                    {statuses.map((s) => {
                      const self = r.id === s.id;
                      return (
                        <td key={s.id} className={cn('px-2 py-1.5 text-center', self && 'bg-[var(--w-sunken)]')}>
                          {!self && (
                            <input
                              type="checkbox"
                              className="accent-[var(--w-accent)]"
                              checked={pairs.has(pairKey(r.id, s.id))}
                              disabled={!canEdit}
                              onChange={() => toggle(r.id, s.id)}
                              aria-label={`${r.id === null ? 'Any status' : r.name} to ${s.name}`}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] text-[var(--w-text-3)]">
            {pairs.size ? `${pairs.size} allowed move${pairs.size === 1 ? '' : 's'}. “From any status” lets issues reach that status from anywhere.` : 'Check at least one move, or allow all moves.'}
          </p>
        </>
      )}
    </div>
  );
}

// ─── Một quy trình ───────────────────────────────────────────────

function WorkflowCard({ wf, config, canEdit, invalidate }: { wf: WorkWorkflow; config: ProjectConfig; canEdit: boolean; invalidate: () => void }) {
  const statuses = sortStatuses(wf);
  // Loại thẻ đi theo quy trình này (loại không gán quy trình ⇒ quy trình mặc định).
  const types = config.issueTypes.filter((t) => (t.workflowId ? t.workflowId === wf.id : wf.isDefault));
  const [deleting, setDeleting] = useState<WorkStatus | null>(null);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<StatusCategory>('IN_PROGRESS');

  const reorder = useMutation({
    mutationFn: (ids: number[]) => workApi.reorderStatuses(config.id, wf.id, ids),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(workError(err, 'Could not reorder the statuses')),
  });
  const add = useMutation({
    mutationFn: () => workApi.addStatus(config.id, wf.id, { name: newName.trim(), category: newCat, color: DEFAULT_COLOR[newCat] }),
    onSuccess: (s) => { toast.success(`Status “${s.name}” added`); setNewName(''); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not add the status')),
  });

  const move = (i: number, dir: -1 | 1) => {
    const ids = statuses.map((s) => s.id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    reorder.mutate(ids);
  };

  return (
    <div className="border-b border-[var(--w-border)] py-6 first:pt-0 last:border-b-0">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-[13px] font-semibold">{wf.name}</h3>
        {wf.isDefault && <span className="rounded-[4px] border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-2)]">Default</span>}
        {reorder.isPending && <Spinner size={12} />}
        <span className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
          {types.length ? 'Used by' : 'Not used by any issue type'}
          {types.map((t) => (
            <span key={t.id} className="inline-flex items-center gap-1 text-[var(--w-text-2)]">
              <IssueTypeIcon type={t} size={12} />
              {t.name}
            </span>
          ))}
        </span>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
        {statuses.map((s, i) => (
          <StatusRow
            key={s.id}
            status={s}
            index={i}
            count={statuses.length}
            pid={config.id}
            canEdit={canEdit}
            busy={reorder.isPending}
            onMove={(dir) => move(i, dir)}
            onDelete={() => setDeleting(s)}
            onChanged={invalidate}
          />
        ))}
        {canEdit && (
          <form
            className="flex flex-wrap items-center gap-2 border-t border-dashed border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 sm:flex-nowrap"
            onSubmit={(e) => { e.preventDefault(); if (newName.trim() && !add.isPending) add.mutate(); }}
          >
            <input className="w-input !h-7 min-w-0 flex-1 text-[13px]" placeholder="New status name" value={newName} maxLength={60} onChange={(e) => setNewName(e.target.value)} aria-label="New status name" />
            <Select className="!h-7 !w-[118px] text-[12px]" value={newCat} onChange={(e) => setNewCat(e.target.value as StatusCategory)} aria-label="New status category">
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
            </Select>
            <button type="submit" className="w-btn w-btn-sm shrink-0" disabled={!newName.trim() || add.isPending}>
              {add.isPending ? <Spinner size={12} /> : <Plus size={13} />}
              Add status
            </button>
          </form>
        )}
      </div>
      <p className="mt-2 text-[12px] text-[var(--w-text-3)]">Statuses appear on the board in this order. Every workflow needs at least one “To do” and one “Done” status.</p>

      <TransitionsEditor wf={wf} statuses={statuses} pid={config.id} canEdit={canEdit} onSaved={invalidate} />

      <DeleteStatusDialog status={deleting} statuses={statuses} pid={config.id} onClose={() => setDeleting(null)} onDone={invalidate} />
    </div>
  );
}

// ─── Hộp tạo quy trình ───────────────────────────────────────────

function NewWorkflowDialog({ open, onClose, config, onCreated }: { open: boolean; onClose: () => void; config: ProjectConfig; onCreated: () => void }) {
  const [name, setName] = useState('');
  const [copyFrom, setCopyFrom] = useState<number | ''>('');
  useEffect(() => {
    if (!open) return;
    setName('');
    setCopyFrom((config.workflows.find((w) => w.isDefault) ?? config.workflows[0])?.id ?? '');
  }, [open, config.workflows]);

  const create = useMutation({
    mutationFn: () => workApi.createWorkflow(config.id, { name: name.trim(), copyFrom: copyFrom || null }),
    onSuccess: () => {
      toast.success(`Workflow “${name.trim()}” created`, { description: 'Assign it to an issue type in the Issue types tab.' });
      onCreated();
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not create the workflow')),
  });

  return (
    <Dialog open={open} onClose={onClose} title="New workflow" width={460}>
      <form onSubmit={(e) => { e.preventDefault(); if (name.trim() && !create.isPending) create.mutate(); }}>
        <Field label="Name">
          <input className="w-input" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} autoFocus placeholder="e.g. Bug lifecycle" />
        </Field>
        <Field label="Start from" hint="Copies the statuses and transitions of the chosen workflow.">
          <Select value={copyFrom} onChange={(e) => setCopyFrom(e.target.value ? Number(e.target.value) : '')}>
            <option value="">Blank — To Do, In Progress, Done</option>
            {config.workflows.map((w) => <option key={w.id} value={w.id}>Copy of {w.name}</option>)}
          </Select>
        </Field>
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={!name.trim() || create.isPending}>
            {create.isPending && <Spinner size={12} />}
            Create workflow
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export default function ProjectWorkflow({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;
  const [creating, setCreating] = useState(false);
  const workflows = [...config.workflows].sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.id - b.id);

  return (
    <Section
      title="Workflows"
      description="The statuses an issue moves through, in board order, and which moves between them are allowed. Assign workflows to issue types in the Issue types tab."
      action={canEdit ? (
        <button type="button" className="w-btn" onClick={() => setCreating(true)} aria-label="New workflow">
          <Plus size={14} />
          <span className="hidden sm:inline">New workflow</span>
        </button>
      ) : undefined}
    >
      {workflows.map((wf) => <WorkflowCard key={wf.id} wf={wf} config={config} canEdit={canEdit} invalidate={invalidate} />)}
      {!workflows.length && <p className="text-[13px] text-[var(--w-text-3)]">This project has no workflow.</p>}
      <NewWorkflowDialog open={creating} onClose={() => setCreating(false)} config={config} onCreated={invalidate} />
    </Section>
  );
}
