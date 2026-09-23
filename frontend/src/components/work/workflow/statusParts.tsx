'use client';

/** Mảnh dùng chung giữa danh sách trạng thái và sơ đồ: nhãn nhóm, ô WIP, hộp xoá, form thêm. */

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { workApi, workError, type StatusCategory, type WorkStatus } from '@/lib/work-api';
import { Dialog, Field, Spinner } from '../ui';
import { Select } from '../settings/shared';

export const CATEGORY_LABEL: Record<StatusCategory, string> = { TODO: 'To do', IN_PROGRESS: 'In progress', DONE: 'Done' };
export const CATEGORIES: StatusCategory[] = ['TODO', 'IN_PROGRESS', 'DONE'];
export const DEFAULT_COLOR: Record<StatusCategory, string> = { TODO: '#64748b', IN_PROGRESS: '#2563eb', DONE: '#16a34a' };

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
      className="w-input !h-7 !w-[88px] shrink-0 !px-2 text-[12px] disabled:opacity-60"
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

/** Sửa một trạng thái (tên, nhóm, màu, WIP) — lưu ngay từng trường. */
export function useStatusUpdate(pid: number, statusId: number, onChanged: () => void, onError?: () => void) {
  return useMutation({
    mutationFn: (body: { name?: string; category?: StatusCategory; color?: string; wipLimit?: number | null }) => workApi.updateStatus(pid, statusId, body),
    onSuccess: () => onChanged(),
    onError: (err) => { toast.error(workError(err, 'Could not update the status')); onError?.(); },
  });
}

export function DeleteStatusDialog({ status, statuses, pid, onClose, onDone }: { status: WorkStatus | null; statuses: WorkStatus[]; pid: number; onClose: () => void; onDone: () => void }) {
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

/** Form thêm trạng thái (một dòng). `compact` cho popover trên sơ đồ. */
export function AddStatusForm({ pid, wfId, onAdded, compact, autoFocus }: { pid: number; wfId: number; onAdded: (s: WorkStatus) => void; compact?: boolean; autoFocus?: boolean }) {
  const [name, setName] = useState('');
  const [cat, setCat] = useState<StatusCategory>('IN_PROGRESS');
  const add = useMutation({
    mutationFn: () => workApi.addStatus(pid, wfId, { name: name.trim(), category: cat, color: DEFAULT_COLOR[cat] }),
    onSuccess: (s) => { toast.success(`Status “${s.name}” added`); setName(''); onAdded(s); },
    onError: (err) => toast.error(workError(err, 'Could not add the status')),
  });
  return (
    <form
      className={compact ? 'flex flex-col gap-2 p-3' : 'flex flex-wrap items-center gap-2 border-t border-dashed border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 sm:flex-nowrap'}
      onSubmit={(e) => { e.preventDefault(); if (name.trim() && !add.isPending) add.mutate(); }}
    >
      <input
        className="w-input !h-7 min-w-0 flex-1 text-[13px]"
        placeholder="New status name"
        value={name}
        maxLength={60}
        autoFocus={autoFocus}
        onChange={(e) => setName(e.target.value)}
        aria-label="New status name"
      />
      <div className="flex items-center gap-2">
        <Select className={compact ? '!h-7 min-w-0 flex-1 text-[12px]' : '!h-7 !w-[118px] text-[12px]'} value={cat} onChange={(e) => setCat(e.target.value as StatusCategory)} aria-label="New status category">
          {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
        </Select>
        <button type="submit" className="w-btn w-btn-sm shrink-0" disabled={!name.trim() || add.isPending}>
          {add.isPending ? <Spinner size={12} /> : <Plus size={13} />}
          Add status
        </button>
      </div>
    </form>
  );
}
