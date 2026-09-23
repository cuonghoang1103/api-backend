'use client';

/**
 * Tab Workflow: chọn quy trình → xem dạng Sơ đồ (kiểu Jira, mặc định trên màn
 * ≥ md) hoặc Danh sách (sửa trạng thái + ma trận luồng chuyển). Hai dạng dùng
 * chung một bản nháp luồng chuyển nên đổi qua lại không mất phần đang sửa.
 */

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, List, Network, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig, type StatusCategory, type WorkStatus, type WorkWorkflow } from '@/lib/work-api';
import { Dialog, Field, IssueTypeIcon, Spinner } from '../ui';
import { ConfirmDialog, Section, Select } from './shared';
import { ColorPicker } from './ProjectLabels';
import { useProjectInvalidate } from './useProjectInvalidate';
import { AddStatusForm, CATEGORIES, CATEGORY_LABEL, DeleteStatusDialog, WipInput, useStatusUpdate } from '../workflow/statusParts';
import { useTransitionDraft, type TransitionDraft } from '../workflow/useTransitionDraft';
import WorkflowDiagram from '../workflow/WorkflowDiagram';

export { CATEGORY_LABEL, WipInput };

const sortStatuses = (wf: WorkWorkflow) => [...wf.statuses].sort((a, b) => a.position - b.position);

/** Màn hẹp hơn md (768px) — điện thoại: sơ đồ chỉ xem. */
function useIsNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
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
  const update = useStatusUpdate(pid, status.id, onChanged, () => setName(status.name));

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

// ─── Ma trận luồng chuyển ────────────────────────────────────────

function TransitionsEditor({ wf, statuses, canEdit, draft }: { wf: WorkWorkflow; statuses: WorkStatus[]; canEdit: boolean; draft: TransitionDraft }) {
  const { mode, pairs } = draft;

  const switchMode = (m: 'free' | 'restricted') => {
    draft.setMode(m);
    // Chuyển sang giới hạn lần đầu: khởi đầu bằng "từ bất kỳ" → mọi trạng thái (tương đương tự do).
    if (m === 'restricted' && !pairs.size) draft.setPairs(new Set(statuses.map((s) => `any:${s.id}`)));
  };

  const rows: Array<{ id: number | null; name: string }> = [{ id: null, name: 'From any status' }, ...statuses.map((s) => ({ id: s.id, name: s.name }))];
  const has = (from: number | null, to: number) => pairs.has(`${from ?? 'any'}:${to}`);

  return (
    <div className="mt-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)]">Transitions</h4>
        {canEdit && draft.dirty && (
          <div className="flex items-center gap-2">
            <button type="button" className="w-btn w-btn-sm" onClick={draft.discard}>Discard</button>
            <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={draft.saving || draft.invalid} onClick={draft.save}>
              {draft.saving && <Spinner size={12} />}
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
                              checked={has(r.id, s.id)}
                              disabled={!canEdit}
                              onChange={() => draft.toggle(r.id, s.id)}
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

// ─── Một quy trình (sơ đồ hoặc danh sách) ────────────────────────

function WorkflowPanel({
  wf, config, canEdit, narrow, view, invalidate, onDirtyChange,
}: {
  wf: WorkWorkflow; config: ProjectConfig; canEdit: boolean; narrow: boolean; view: 'diagram' | 'list';
  invalidate: () => void; onDirtyChange: (dirty: boolean) => void;
}) {
  const statuses = sortStatuses(wf);
  // Loại thẻ đi theo quy trình này (loại không gán quy trình ⇒ quy trình mặc định).
  const types = config.issueTypes.filter((t) => (t.workflowId ? t.workflowId === wf.id : wf.isDefault));
  const [deleting, setDeleting] = useState<WorkStatus | null>(null);
  const draft = useTransitionDraft(wf, config.id, invalidate);
  useEffect(() => { onDirtyChange(draft.dirty); }, [draft.dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  const reorder = useMutation({
    mutationFn: (ids: number[]) => workApi.reorderStatuses(config.id, wf.id, ids),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(workError(err, 'Could not reorder the statuses')),
  });

  const move = (i: number, dir: -1 | 1) => {
    const ids = statuses.map((s) => s.id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    reorder.mutate(ids);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-[13px] font-semibold">{wf.name}</h3>
        {wf.isDefault && <span className="rounded-[4px] border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-2)]">Default</span>}
        <span className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-2)]">
          {statuses.length} statuses · {draft.initialMode === 'free' ? 'free' : `${draft.initialPairs.size} transitions`}
        </span>
        {reorder.isPending && <Spinner size={12} />}
        <span className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
          {types.length ? `Used by ${types.length} issue type${types.length === 1 ? '' : 's'}:` : 'Not used by any issue type'}
          {types.map((t) => (
            <span key={t.id} className="inline-flex items-center gap-1 text-[var(--w-text-2)]">
              <IssueTypeIcon type={t} size={12} />
              {t.name}
            </span>
          ))}
        </span>
      </div>

      {view === 'diagram' ? (
        <WorkflowDiagram
          wf={wf}
          config={config}
          draft={draft}
          canEdit={canEdit && !narrow}
          invalidate={invalidate}
          onDeleteStatus={setDeleting}
        />
      ) : (
        <>
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
            {canEdit && <AddStatusForm pid={config.id} wfId={wf.id} onAdded={() => invalidate()} />}
          </div>
          <p className="mt-2 text-[12px] text-[var(--w-text-3)]">Statuses appear on the board in this order. Every workflow needs at least one “To do” and one “Done” status.</p>
          <TransitionsEditor wf={wf} statuses={statuses} canEdit={canEdit} draft={draft} />
        </>
      )}

      <DeleteStatusDialog status={deleting} statuses={statuses} pid={config.id} onClose={() => setDeleting(null)} onDone={invalidate} />
    </div>
  );
}

// ─── Hộp tạo quy trình ───────────────────────────────────────────

function NewWorkflowDialog({ open, onClose, config, onCreated }: { open: boolean; onClose: () => void; config: ProjectConfig; onCreated: (id: number) => void }) {
  const [name, setName] = useState('');
  const [copyFrom, setCopyFrom] = useState<number | ''>('');
  useEffect(() => {
    if (!open) return;
    setName('');
    setCopyFrom((config.workflows.find((w) => w.isDefault) ?? config.workflows[0])?.id ?? '');
  }, [open, config.workflows]);

  const create = useMutation({
    mutationFn: () => workApi.createWorkflow(config.id, { name: name.trim(), copyFrom: copyFrom || null }),
    onSuccess: (wf) => {
      toast.success(`Workflow “${name.trim()}” created`, { description: 'Assign it to an issue type in the Issue types tab.' });
      onCreated(wf.id);
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

// ─── Trang ───────────────────────────────────────────────────────

const VIEW_KEY = 'ctwork.workflowView';

export default function ProjectWorkflow({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;
  const narrow = useIsNarrow();
  const [creating, setCreating] = useState(false);
  const workflows = [...config.workflows].sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.id - b.id);

  const [activeId, setActiveId] = useState<number | null>(workflows[0]?.id ?? null);
  const active = workflows.find((w) => w.id === activeId) ?? workflows[0];

  // Dạng xem: người dùng chọn thì nhớ (theo trình duyệt); chưa chọn thì theo màn hình.
  const [picked, setPicked] = useState<'diagram' | 'list' | null>(null);
  useEffect(() => {
    try { const v = localStorage.getItem(VIEW_KEY); if (v === 'diagram' || v === 'list') setPicked(v); } catch { /* bộ nhớ bị chặn */ }
  }, []);
  const view: 'diagram' | 'list' = narrow ? (picked === 'diagram' ? 'diagram' : 'list') : (picked ?? 'diagram');
  const pickView = (v: 'diagram' | 'list') => {
    setPicked(v);
    try { localStorage.setItem(VIEW_KEY, v); } catch { /* bộ nhớ bị chặn */ }
  };

  // Đổi quy trình khi đang có luồng chuyển chưa lưu ⇒ hỏi trước.
  const [dirty, setDirty] = useState(false);
  const [pendingSwitch, setPendingSwitch] = useState<number | null>(null);
  const switchTo = (id: number) => {
    if (id === active?.id) return;
    if (dirty) setPendingSwitch(id); else setActiveId(id);
  };

  return (
    <Section
      title="Workflows"
      description="The statuses an issue moves through and which moves between them are allowed. Assign workflows to issue types in the Issue types tab."
      action={canEdit ? (
        <button type="button" className="w-btn" onClick={() => setCreating(true)} aria-label="New workflow">
          <Plus size={14} />
          <span className="hidden sm:inline">New workflow</span>
        </button>
      ) : undefined}
    >
      {workflows.length > 0 && active && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {workflows.length > 1 ? (
            <div role="tablist" aria-label="Workflows" className="-mx-1 flex max-w-full gap-1 overflow-x-auto px-1">
              {workflows.map((w) => {
                const on = w.id === active.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => switchTo(w.id)}
                    className={cn(
                      'flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] border px-2.5 text-[13px] transition-colors',
                      on
                        ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] font-medium text-[var(--w-text)]'
                        : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]',
                    )}
                  >
                    {w.name}
                    {w.isDefault && <span className="text-[11px] text-[var(--w-text-3)]">Default</span>}
                  </button>
                );
              })}
            </div>
          ) : <span />}
          <div role="group" aria-label="View" className="flex shrink-0 rounded-[7px] border border-[var(--w-border-strong)] p-0.5">
            {([['diagram', 'Diagram', Network], ['list', 'List', List]] as const).map(([k, label, Icon]) => (
              <button
                key={k}
                type="button"
                aria-pressed={view === k}
                onClick={() => pickView(k)}
                className={cn(
                  'flex h-[26px] items-center gap-1.5 rounded-[5px] px-2.5 text-[12px] font-medium transition-colors',
                  view === k ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
                )}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      {narrow && canEdit && (
        <p className="mb-3 rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12px] text-[var(--w-text-2)]">
          Open on a larger screen to edit the diagram. {view === 'diagram' ? 'Here you can view it — drag to pan, use + / − to zoom.' : 'You can still edit statuses and transitions in this list.'}
        </p>
      )}

      {active && (
        <WorkflowPanel
          key={active.id}
          wf={active}
          config={config}
          canEdit={canEdit}
          narrow={narrow}
          view={view}
          invalidate={invalidate}
          onDirtyChange={setDirty}
        />
      )}
      {!workflows.length && <p className="text-[13px] text-[var(--w-text-3)]">This project has no workflow.</p>}

      <NewWorkflowDialog open={creating} onClose={() => setCreating(false)} config={config} onCreated={(id) => { invalidate(); if (!dirty) setActiveId(id); }} />
      <ConfirmDialog
        open={pendingSwitch !== null}
        onClose={() => setPendingSwitch(null)}
        onConfirm={() => { setActiveId(pendingSwitch); setPendingSwitch(null); }}
        title="Discard unsaved transitions?"
        confirmLabel="Discard and switch"
        body="You have transition changes in this workflow that are not saved yet. Switching to another workflow will discard them."
      />
    </Section>
  );
}
