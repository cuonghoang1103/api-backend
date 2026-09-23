'use client';

/**
 * CT Work — ô chọn giá trị cho các trường của thẻ. Dùng chung giữa hộp thoại
 * "Create issue" và trang chi tiết thẻ để hai nơi luôn hành xử giống nhau.
 */

import { useMemo, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronDown, CircleDashed, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  userName, workApi, workError, type IssueCard, type ProjectConfig, type WorkLabel,
} from '@/lib/work-api';
import { allowedTargets, wk, type Lookups } from './hooks';
import {
  IssueTypeIcon, LabelChip, PickerList, Popover, PRIORITIES, PriorityIcon, StatusBadge, UserAvatar, useToggle,
  type PickOption,
} from './ui';

/** Nút mở popover chọn. `bare` = không viền (dùng trong cột thuộc tính). */
function Trigger({ children, disabled, bare, onClick, triggerRef, className }: {
  children: ReactNode; disabled?: boolean; bare?: boolean; onClick: () => void; triggerRef: React.RefObject<HTMLButtonElement>; className?: string;
}) {
  return (
    <button
      ref={triggerRef}
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex min-h-[30px] w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13px] transition-colors',
        bare ? 'hover:bg-[var(--w-hover)]' : 'border border-[var(--w-border-strong)] bg-[var(--w-panel)] hover:bg-[var(--w-hover)]',
        disabled && 'cursor-default hover:bg-transparent',
        className,
      )}
    >
      {children}
    </button>
  );
}

function usePick() {
  const t = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  return { ...t, ref };
}

// ─── Loại thẻ ────────────────────────────────────────────────────

export function TypePicker({ config, value, onChange, levels, bare, disabled }: {
  config: ProjectConfig; value: number; onChange: (id: number) => void; levels?: number[]; bare?: boolean; disabled?: boolean;
}) {
  const p = usePick();
  const types = config.issueTypes.filter((t) => !levels || levels.includes(t.level));
  const cur = config.issueTypes.find((t) => t.id === value);
  return (
    <>
      <Trigger triggerRef={p.ref} onClick={p.toggle} bare={bare} disabled={disabled}>
        <IssueTypeIcon type={cur} />
        <span className="flex-1 truncate">{cur?.name ?? 'Select type'}</span>
        {!disabled && !bare && <ChevronDown size={13} className="text-[var(--w-text-3)]" />}
      </Trigger>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={220}>
        <PickerList
          options={types.map((t) => ({ value: t.id, label: t.name, icon: <IssueTypeIcon type={t} size={12} /> }))}
          selected={[value]}
          onPick={(id) => { onChange(id); p.close(); }}
          placeholder="Issue type…"
        />
      </Popover>
    </>
  );
}

// ─── Trạng thái (chỉ các trạng thái được phép chuyển tới) ────────

export function StatusPicker({ lk, issue, onChange, bare, disabled }: {
  lk: Lookups; issue: Pick<IssueCard, 'typeId' | 'statusId'>; onChange: (id: number) => void; bare?: boolean; disabled?: boolean;
}) {
  const p = usePick();
  const wf = lk.workflowOfType(issue.typeId);
  const cur = lk.statuses.get(issue.statusId);
  const allowed = wf ? allowedTargets(lk, issue.typeId, issue.statusId, wf.statuses.map((s) => s.id)) : [];
  return (
    <>
      <Trigger triggerRef={p.ref} onClick={p.toggle} bare={bare} disabled={disabled}>
        <StatusBadge status={cur} />
        {!disabled && <ChevronDown size={13} className="text-[var(--w-text-3)]" />}
      </Trigger>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={220}>
        <PickerList
          options={(wf?.statuses ?? []).filter((s) => allowed.includes(s.id) || s.id === issue.statusId).map((s) => ({
            value: s.id, label: s.name, hint: s.id === issue.statusId ? 'Current' : undefined,
            icon: <span className="h-2 w-2 rounded-full" style={{ background: s.category === 'DONE' ? 'var(--w-green)' : s.category === 'IN_PROGRESS' ? 'var(--w-accent)' : 'var(--w-text-3)' }} />,
          }))}
          selected={[issue.statusId]}
          onPick={(id) => { if (id !== issue.statusId) onChange(id); p.close(); }}
          placeholder="Move to…"
          empty="No transitions from this status"
        />
      </Popover>
    </>
  );
}

// ─── Ưu tiên ─────────────────────────────────────────────────────

export function PriorityPicker({ value, onChange, bare, disabled }: { value: number; onChange: (v: number) => void; bare?: boolean; disabled?: boolean }) {
  const p = usePick();
  const cur = PRIORITIES.find((x) => x.value === value) ?? PRIORITIES[2];
  return (
    <>
      <Trigger triggerRef={p.ref} onClick={p.toggle} bare={bare} disabled={disabled}>
        <PriorityIcon priority={value} />
        <span className="flex-1">{cur.label}</span>
      </Trigger>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={200}>
        <PickerList
          options={PRIORITIES.map((x) => ({ value: x.value, label: x.label, icon: <PriorityIcon priority={x.value} size={14} /> }))}
          selected={[value]}
          onPick={(v) => { onChange(v); p.close(); }}
          placeholder="Priority…"
        />
      </Popover>
    </>
  );
}

// ─── Người được giao ─────────────────────────────────────────────

export function AssigneePicker({ config, value, onChange, meId, bare, disabled }: {
  config: ProjectConfig; value: number | null; onChange: (id: number | null) => void; meId?: number; bare?: boolean; disabled?: boolean;
}) {
  const p = usePick();
  // Chỉ người có quyền sửa thẻ mới nhận việc được (backend cũng chặn y hệt).
  const assignable = config.members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');
  const cur = config.members.find((m) => m.id === value) ?? null;
  const options: PickOption<number>[] = [
    { value: 0, label: 'Unassigned', icon: <UserAvatar user={null} size={16} /> },
    ...assignable.map((m) => ({ value: m.id, label: userName(m), hint: m.id === meId ? 'You' : undefined, keywords: m.username, icon: <UserAvatar user={m} size={16} /> })),
  ];
  return (
    <>
      <Trigger triggerRef={p.ref} onClick={p.toggle} bare={bare} disabled={disabled}>
        <UserAvatar user={cur} size={18} />
        <span className={cn('flex-1 truncate', !cur && 'text-[var(--w-text-3)]')}>{cur ? userName(cur) : 'Unassigned'}</span>
      </Trigger>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={240}>
        <PickerList options={options} selected={[value ?? 0]} onPick={(v) => { onChange(v || null); p.close(); }} placeholder="Assign to…" />
      </Popover>
    </>
  );
}

// ─── Nhãn (chọn nhiều, tạo mới tại chỗ) ──────────────────────────

const LABEL_COLORS = ['#5e6ad2', '#2f9e6a', '#d9713f', '#d9443f', '#b8901f', '#2f80ed', '#9b51e0', '#64748b'];

export function LabelsPicker({ config, value, onChange, bare, disabled }: {
  config: ProjectConfig; value: number[]; onChange: (ids: number[]) => void; bare?: boolean; disabled?: boolean;
}) {
  const p = usePick();
  const qc = useQueryClient();
  const [extra, setExtra] = useState<WorkLabel[]>([]);
  const all = useMemo(() => [...config.labels, ...extra.filter((e) => !config.labels.some((l) => l.id === e.id))], [config.labels, extra]);
  const chosen = all.filter((l) => value.includes(l.id));
  const toggle = (id: number) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  const create = async (name: string) => {
    try {
      const l = await workApi.createLabel(config.id, { name, color: LABEL_COLORS[all.length % LABEL_COLORS.length] });
      setExtra((x) => [...x, l]);
      onChange([...value, l.id]);
      qc.invalidateQueries({ queryKey: wk.project(config.id) });
    } catch (err) {
      toast.error(workError(err, 'Could not create label'));
    }
  };
  return (
    <>
      <Trigger triggerRef={p.ref} onClick={p.toggle} bare={bare} disabled={disabled} className="flex-wrap py-1">
        {chosen.length ? chosen.map((l) => <LabelChip key={l.id} label={l} />) : (
          <span className="flex items-center gap-1.5 text-[var(--w-text-3)]"><Tag size={13} /> None</span>
        )}
      </Trigger>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={240}>
        <PickerList
          multi
          options={all.map((l) => ({ value: l.id, label: l.name, icon: <span className="h-2 w-2 rounded-full" style={{ background: l.color }} /> }))}
          selected={value}
          onPick={toggle}
          onCreate={disabled ? undefined : create}
          placeholder="Find or create a label…"
          empty="No labels yet"
        />
      </Popover>
    </>
  );
}

// ─── Component ───────────────────────────────────────────────────

export function ComponentsPicker({ config, value, onChange, bare, disabled }: {
  config: ProjectConfig; value: number[]; onChange: (ids: number[]) => void; bare?: boolean; disabled?: boolean;
}) {
  const p = usePick();
  const chosen = config.components.filter((c) => value.includes(c.id));
  if (!config.components.length && !chosen.length) return <span className="px-2 text-[13px] text-[var(--w-text-3)]">None</span>;
  return (
    <>
      <Trigger triggerRef={p.ref} onClick={p.toggle} bare={bare} disabled={disabled}>
        <span className={cn('flex-1 truncate', !chosen.length && 'text-[var(--w-text-3)]')}>{chosen.map((c) => c.name).join(', ') || 'None'}</span>
      </Trigger>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={240}>
        <PickerList
          multi
          options={config.components.map((c) => ({ value: c.id, label: c.name }))}
          selected={value}
          onPick={(id) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id])}
          placeholder="Components…"
        />
      </Popover>
    </>
  );
}

// ─── Sprint ──────────────────────────────────────────────────────

export function SprintPicker({ config, value, onChange, bare, disabled }: {
  config: ProjectConfig; value: number | null; onChange: (id: number | null) => void; bare?: boolean; disabled?: boolean;
}) {
  const p = usePick();
  const cur = config.sprints.find((s) => s.id === value);
  return (
    <>
      <Trigger triggerRef={p.ref} onClick={p.toggle} bare={bare} disabled={disabled}>
        <span className={cn('flex-1 truncate', !cur && 'text-[var(--w-text-3)]')}>{cur ? cur.name : value ? 'Closed sprint' : 'Backlog'}</span>
        {cur?.state === 'ACTIVE' && <span className="rounded-[4px] bg-[var(--w-accent-soft)] px-1.5 text-[10px] font-semibold uppercase text-[var(--w-accent-text)]">Active</span>}
      </Trigger>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={240}>
        <PickerList
          options={[
            { value: 0, label: 'Backlog' },
            ...config.sprints.map((s) => ({ value: s.id, label: s.name, hint: s.state === 'ACTIVE' ? 'Active' : undefined })),
          ]}
          selected={[value ?? 0]}
          onPick={(v) => { onChange(v || null); p.close(); }}
          placeholder="Sprint…"
          empty="No open sprints"
        />
      </Popover>
    </>
  );
}

// ─── Thẻ cha ─────────────────────────────────────────────────────

/** Việc con chọn story/task/bug làm cha; việc thường chọn epic. */
export function ParentPicker({ config, lk, childLevel, value, onChange, excludeId, bare, disabled }: {
  config: ProjectConfig; lk: Lookups; childLevel: number; value: { id: number; number: number; title: string } | null;
  onChange: (parent: { id: number; number: number; title: string } | null) => void; excludeId?: number; bare?: boolean; disabled?: boolean;
}) {
  const p = usePick();
  const parentTypeIds = config.issueTypes.filter((t) => t.level === childLevel + 1).map((t) => t.id);
  const q = useQuery({
    queryKey: [...wk.issues(config.id), 'parents', childLevel],
    queryFn: () => workApi.issues(config.id, { type: parentTypeIds, includeDone: false, limit: 200 }),
    enabled: p.on && parentTypeIds.length > 0,
  });
  if (!parentTypeIds.length) return null;
  const label = childLevel === -1 ? 'Parent issue' : 'Epic';
  return (
    <>
      <Trigger triggerRef={p.ref} onClick={p.toggle} bare={bare} disabled={disabled}>
        {value ? (
          <>
            <span className="shrink-0 font-mono text-[11px] text-[var(--w-text-3)]">{lk.issueKey(value.number)}</span>
            <span className="flex-1 truncate">{value.title}</span>
          </>
        ) : (
          <span className="flex items-center gap-1.5 text-[var(--w-text-3)]"><CircleDashed size={13} /> {childLevel === -1 ? 'Choose parent' : 'No epic'}</span>
        )}
      </Trigger>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={300}>
        <PickerList
          options={[
            ...(childLevel === -1 ? [] : [{ value: 0, label: 'No epic' }]),
            ...(q.data?.items ?? []).filter((i) => i.id !== excludeId).map((i) => ({
              value: i.id, label: i.title, keywords: lk.issueKey(i.number), hint: lk.issueKey(i.number),
              icon: <IssueTypeIcon type={lk.types.get(i.typeId)} size={12} />,
            })),
          ]}
          selected={[value?.id ?? 0]}
          onPick={(id) => {
            const hit = q.data?.items.find((i) => i.id === id);
            onChange(hit ? { id: hit.id, number: hit.number, title: hit.title } : null);
            p.close();
          }}
          placeholder={`Search ${label.toLowerCase()}s…`}
          empty={q.isLoading ? 'Loading…' : `No open ${label.toLowerCase()}s`}
        />
      </Popover>
    </>
  );
}

// ─── Ngày + số ───────────────────────────────────────────────────

export function DateInput({ value, onChange, disabled }: { value: string | null; onChange: (v: string | null) => void; disabled?: boolean }) {
  return (
    <input
      type="date"
      disabled={disabled}
      value={value ? value.slice(0, 10) : ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-input w-input-bare"
    />
  );
}

export function NumberInput({ value, onCommit, placeholder = 'None', disabled, step = 1 }: {
  value: number | null; onCommit: (v: number | null) => void; placeholder?: string; disabled?: boolean; step?: number;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (value === null ? '' : String(value));
  const commit = () => {
    if (draft === null) return;
    const t = draft.trim();
    const n = t === '' ? null : Number(t);
    setDraft(null);
    if (n !== null && (!Number.isFinite(n) || n < 0)) return;
    if (n !== value) onCommit(n);
  };
  return (
    <input
      inputMode="decimal"
      disabled={disabled}
      value={shown}
      step={step}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') { setDraft(null); (e.target as HTMLInputElement).blur(); } }}
      className="w-input w-input-bare tabular"
    />
  );
}


// ─── Fix version ─────────────────────────────────────────────────

/** Chọn version phát hành: chỉ version chưa phát hành chọn được; đã phát hành hiện mờ. */
export function FixVersionPicker({ config, value, onChange, bare, disabled }: {
  config: ProjectConfig; value: number | null; onChange: (id: number | null) => void; bare?: boolean; disabled?: boolean;
}) {
  const p = usePick();
  const q = useQuery({ queryKey: wk.versions(config.id), queryFn: () => workApi.versions(config.id), staleTime: 60_000 });
  const versions = (q.data ?? []).filter((v) => v.status !== 'ARCHIVED' || v.id === value);
  const cur = q.data?.find((v) => v.id === value);
  const pick = (id: number | null) => { if (id !== value) onChange(id); p.close(); };
  return (
    <>
      <Trigger triggerRef={p.ref} onClick={p.toggle} bare={bare} disabled={disabled}>
        <span className={cn('flex-1 truncate', !cur && 'text-[var(--w-text-3)]')}>{cur ? cur.name : value ? 'Unknown version' : 'None'}</span>
        {cur?.status === 'RELEASED' && <span className="rounded-[4px] bg-[color-mix(in_srgb,var(--w-green)_14%,transparent)] px-1.5 text-[10px] font-semibold uppercase text-[var(--w-green)]">Released</span>}
      </Trigger>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={240}>
        <div className="max-h-[280px] overflow-y-auto p-1" role="listbox" aria-label="Fix version">
          <button
            type="button"
            role="option"
            aria-selected={value === null}
            onClick={() => pick(null)}
            className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]"
          >
            <span className="flex-1 text-[var(--w-text-2)]">None</span>
            {value === null && <Check size={13} className="text-[var(--w-accent-text)]" />}
          </button>
          {q.isLoading && <div className="px-2 py-3 text-center text-[12px] text-[var(--w-text-3)]">Loading…</div>}
          {!q.isLoading && !versions.length && <div className="px-2 py-3 text-center text-[12px] text-[var(--w-text-3)]">No versions yet</div>}
          {versions.map((v) => {
            const locked = v.status !== 'UNRELEASED';
            return (
              <button
                key={v.id}
                type="button"
                role="option"
                aria-selected={v.id === value}
                aria-disabled={locked}
                disabled={locked}
                title={locked ? `${v.name} is ${v.status === 'RELEASED' ? 'released' : 'archived'}` : undefined}
                onClick={() => pick(v.id)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px]',
                  locked ? 'cursor-not-allowed opacity-50' : 'hover:bg-[var(--w-hover)]',
                )}
              >
                <span className="min-w-0 flex-1 truncate">{v.name}</span>
                {locked && <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{v.status === 'RELEASED' ? 'Released' : 'Archived'}</span>}
                {v.id === value && <Check size={13} className="shrink-0 text-[var(--w-accent-text)]" />}
              </button>
            );
          })}
        </div>
      </Popover>
    </>
  );
}
