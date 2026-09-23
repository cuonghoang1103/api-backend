'use client';

/**
 * Board kéo thả (dnd-kit). Mỗi cột là một nhóm trạng thái (xem boardColumns
 * ở backend). Thả thẻ vào cột ⇒ chọn trạng thái đích HỢP LỆ theo quy trình
 * của chính thẻ đó (Bug có vòng Retest, Story thì không), rồi gửi rank theo
 * hai hàng xóm để server đặt đúng chỗ.
 *
 * Lạc quan: thẻ nằm yên ở chỗ vừa thả ngay lập tức; server từ chối thì trả về
 * chỗ cũ + báo lý do. Sự kiện socket của chính mình sẽ tải lại board sau đó.
 */

import { useMemo, useRef, useState } from 'react';
import {
  closestCorners, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useDroppable, useSensor, useSensors,
  type DragEndEvent, type DragOverEvent, type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarClock, GitBranch, MessageSquare, Paperclip, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  workApi, workError, workErrorStatus, type BoardColumn, type BoardData, type IssueCard, type ProjectConfig,
} from '@/lib/work-api';
import { allowedTargets, wk, type Lookups } from './hooks';
import { IssueTypeIcon, LabelChip, PriorityIcon, UserAvatar } from './ui';

// ─── Thẻ ─────────────────────────────────────────────────────────

function isOverdue(i: IssueCard, lk: Lookups) {
  if (!i.dueDate || lk.statuses.get(i.statusId)?.category === 'DONE') return false;
  return new Date(i.dueDate).getTime() + 86_400_000 < Date.now();
}

export function CardBody({ issue, lk, dragging }: { issue: IssueCard; lk: Lookups; dragging?: boolean }) {
  const labels = issue.labelIds.map((id) => lk.labels.get(id)).filter(Boolean).slice(0, 3);
  const done = lk.statuses.get(issue.statusId)?.category === 'DONE';
  const overdue = isOverdue(issue, lk);
  return (
    <div
      className={cn(
        'rounded-[7px] border border-[var(--w-border)] bg-[var(--w-panel)] px-2.5 py-2 text-[13px] transition-[border-color,box-shadow]',
        'hover:border-[var(--w-border-strong)]',
        dragging && 'rotate-[1.5deg] border-[var(--w-accent-border)] shadow-[var(--w-shadow-pop)]',
      )}
    >
      <p className={cn('mb-2 line-clamp-3 leading-snug', done && 'text-[var(--w-text-3)] line-through decoration-[var(--w-text-3)]')}>{issue.title}</p>
      {labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">{labels.map((l) => <LabelChip key={l!.id} label={l!} />)}</div>
      )}
      <div className="flex items-center gap-2 text-[11px] text-[var(--w-text-3)]">
        <IssueTypeIcon type={lk.types.get(issue.typeId)} size={12} />
        <span className="font-mono">{lk.issueKey(issue.number)}</span>
        {issue.dueDate && (
          <span className={cn('flex items-center gap-0.5', overdue && 'font-medium text-[var(--w-red)]')} title={overdue ? 'Overdue' : 'Due date'}>
            <CalendarClock size={11} />
            {new Date(issue.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
          </span>
        )}
        {issue.subtaskCount > 0 && <span className="flex items-center gap-0.5" title="Sub-tasks"><GitBranch size={11} />{issue.subtaskCount}</span>}
        {issue.commentCount > 0 && <span className="flex items-center gap-0.5" title="Comments"><MessageSquare size={11} />{issue.commentCount}</span>}
        {issue.attachmentCount > 0 && <span className="flex items-center gap-0.5" title="Attachments"><Paperclip size={11} />{issue.attachmentCount}</span>}
        <span className="ml-auto flex items-center gap-1.5">
          {issue.storyPoints !== null && (
            <span className="rounded-full bg-[var(--w-sunken)] px-1.5 py-px font-medium tabular text-[var(--w-text-2)]" title="Story points">{issue.storyPoints}</span>
          )}
          <PriorityIcon priority={issue.priority} size={13} />
          <UserAvatar user={issue.assigneeId ? lk.members.get(issue.assigneeId) : null} size={18} />
        </span>
      </div>
    </div>
  );
}

function SortableCard({ issue, lk, onOpen, disabled }: { issue: IssueCard; lk: Lookups; onOpen: (n: number) => void; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: issue.id, disabled });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn('outline-none', isDragging && 'opacity-40')}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(issue.number)}
      onKeyDown={(e) => {
        listeners?.onKeyDown?.(e);
        if (e.key === 'Enter' && !e.defaultPrevented) onOpen(issue.number);
      }}
    >
      <CardBody issue={issue} lk={lk} />
    </div>
  );
}

// ─── Cột ─────────────────────────────────────────────────────────

function QuickAdd({ onCreate }: { onCreate: (title: string) => Promise<unknown> }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="flex h-8 w-full items-center gap-1.5 rounded-[6px] px-2 text-[12px] text-[var(--w-text-3)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text-2)]">
        <Plus size={13} /> Create issue
      </button>
    );
  }
  const submit = async () => {
    const t = title.trim();
    if (!t || busy) return;
    setBusy(true);
    try { await onCreate(t); setTitle(''); } finally { setBusy(false); }
  };
  return (
    <textarea
      autoFocus
      rows={2}
      value={title}
      disabled={busy}
      placeholder="What needs to be done?"
      onChange={(e) => setTitle(e.target.value)}
      onBlur={() => { if (!title.trim()) setOpen(false); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void submit(); }
        if (e.key === 'Escape') { setTitle(''); setOpen(false); }
      }}
      className="w-input resize-none text-[13px]"
    />
  );
}

function Column({ col, issues, lk, onOpen, canDrag, onQuickAdd, highlight, blocked }: {
  col: BoardColumn; issues: IssueCard[]; lk: Lookups; onOpen: (n: number) => void; canDrag: boolean;
  onQuickAdd?: (title: string) => Promise<unknown>; highlight: boolean; blocked: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: `col:${col.key}` });
  const points = issues.reduce((s, i) => s + (i.storyPoints ?? 0), 0);
  const over = col.wipLimit !== null && issues.length > col.wipLimit;
  return (
    <div className="flex h-full w-[284px] shrink-0 flex-col">
      <div className="mb-2 flex h-7 items-center gap-2 px-1">
        <span className="text-[12px] font-semibold uppercase tracking-[0.03em] text-[var(--w-text-2)]">{col.name}</span>
        <span className={cn('text-[12px] tabular', over ? 'font-semibold text-[var(--w-red)]' : 'text-[var(--w-text-3)]')} title={col.wipLimit !== null ? `WIP limit ${col.wipLimit}` : undefined}>
          {issues.length}{col.wipLimit !== null && ` / ${col.wipLimit}`}
        </span>
        {points > 0 && <span className="ml-auto text-[11px] tabular text-[var(--w-text-3)]" title="Story points">{points} pts</span>}
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-[120px] flex-1 flex-col gap-1.5 overflow-y-auto rounded-[8px] p-1.5 transition-colors',
          'bg-[var(--w-sunken)]',
          highlight && 'bg-[var(--w-accent-soft)] outline outline-1 outline-[var(--w-accent-border)]',
          blocked && 'opacity-50',
          over && 'outline outline-1 outline-[color-mix(in_srgb,var(--w-red)_45%,transparent)]',
        )}
      >
        <SortableContext items={issues.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {issues.map((i) => <SortableCard key={i.id} issue={i} lk={lk} onOpen={onOpen} disabled={!canDrag} />)}
        </SortableContext>
        {onQuickAdd && <QuickAdd onCreate={onQuickAdd} />}
      </div>
    </div>
  );
}

// ─── Board ───────────────────────────────────────────────────────

export default function Board({ config, lk, data, visible, onOpen }: {
  config: ProjectConfig;
  lk: Lookups;
  data: BoardData;
  /** Thẻ còn lại sau bộ lọc (null = không lọc). */
  visible: Set<number> | null;
  onOpen: (n: number) => void;
}) {
  const qc = useQueryClient();
  const pid = config.id;
  const canDrag = config.permissions.transition;
  const [activeId, setActiveId] = useState<number | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  // Vị trí lạc quan: thẻ vừa thả → { cột, chỉ số } cho tới khi server trả lời.
  const [pending, setPending] = useState<Map<number, { statusId: number }>>(new Map());
  const orderRef = useRef<Map<string, number[]> | null>(null);

  const colOfStatus = useMemo(() => {
    const m = new Map<number, string>();
    config.boardColumns.forEach((c) => c.statusIds.forEach((s) => m.set(s, c.key)));
    return m;
  }, [config.boardColumns]);

  const byCol = useMemo(() => {
    const m = new Map<string, IssueCard[]>(config.boardColumns.map((c) => [c.key, []]));
    for (const raw of data.issues) {
      const i = pending.has(raw.id) ? { ...raw, ...pending.get(raw.id)! } : raw;
      if (visible && !visible.has(i.id)) continue;
      const k = colOfStatus.get(i.statusId);
      if (k) m.get(k)!.push(i);
    }
    // Thứ tự lạc quan sau khi thả (nếu có) thắng thứ tự rank từ server.
    const ord = orderRef.current;
    if (ord) {
      for (const [k, ids] of ord) {
        const list = m.get(k);
        if (!list) continue;
        list.sort((a, b) => {
          const ia = ids.indexOf(a.id);
          const ib = ids.indexOf(b.id);
          return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
        });
      }
    }
    return m;
  }, [data.issues, config.boardColumns, colOfStatus, visible, pending]);

  const byId = useMemo(() => new Map(data.issues.map((i) => [i.id, i])), [data.issues]);
  const active = activeId ? byId.get(activeId) : undefined;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const move = useMutation({
    mutationFn: (v: { num: number; statusId?: number; beforeIssueId: number | null; afterIssueId: number | null; version: number }) =>
      workApi.moveIssue(pid, v.num, { statusId: v.statusId, beforeIssueId: v.beforeIssueId, afterIssueId: v.afterIssueId, version: v.version }),
    onSettled: async (_d, err, v) => {
      if (err) {
        toast.error(workErrorStatus(err) === 409 ? 'The board changed while you were dragging. Refreshed.' : workError(err, 'Could not move the issue'));
      }
      await qc.invalidateQueries({ queryKey: wk.board(pid) });
      orderRef.current = null;
      setPending((p) => {
        const n = new Map(p);
        for (const [id] of n) if (byId.get(id)?.number === v.num) n.delete(id);
        return n;
      });
    },
  });

  const columnOf = (id: string | number | undefined): BoardColumn | undefined => {
    if (id === undefined) return undefined;
    if (typeof id === 'string' && id.startsWith('col:')) return config.boardColumns.find((c) => `col:${c.key}` === id);
    const issue = byId.get(Number(id));
    const k = issue ? colOfStatus.get(pending.get(issue.id)?.statusId ?? issue.statusId) : undefined;
    return config.boardColumns.find((c) => c.key === k);
  };

  // Cột nào KHÔNG nhận được thẻ đang kéo (quy trình không cho) — làm mờ ngay khi bắt đầu kéo.
  const blockedCols = useMemo(() => {
    if (!active) return new Set<string>();
    const s = new Set<string>();
    for (const c of config.boardColumns) {
      if (c.statusIds.includes(active.statusId)) continue;
      if (!allowedTargets(lk, active.typeId, active.statusId, c.statusIds).length) s.add(c.key);
    }
    return s;
  }, [active, config.boardColumns, lk]);

  const onDragStart = (e: DragStartEvent) => setActiveId(Number(e.active.id));
  const onDragOver = (e: DragOverEvent) => setOverCol(columnOf(e.over?.id ?? undefined)?.key ?? null);
  const onDragCancel = () => { setActiveId(null); setOverCol(null); };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    setOverCol(null);
    const issue = byId.get(Number(e.active.id));
    const target = columnOf(e.over?.id ?? undefined);
    if (!issue || !target) return;

    const fromStatus = pending.get(issue.id)?.statusId ?? issue.statusId;
    let statusId: number | undefined;
    if (!target.statusIds.includes(fromStatus)) {
      const options = allowedTargets(lk, issue.typeId, fromStatus, target.statusIds);
      if (!options.length) {
        const from = lk.statuses.get(fromStatus)?.name ?? 'this status';
        toast.error(`The ${lk.types.get(issue.typeId)?.name ?? 'issue'} workflow does not allow moving from ${from} to ${target.name}.`);
        return;
      }
      statusId = options[0];
    }

    // Thứ tự mới trong cột đích: bỏ thẻ ra, chèn vào chỗ thả.
    const list = (byCol.get(target.key) ?? []).filter((i) => i.id !== issue.id);
    const overId = typeof e.over?.id === 'number' ? e.over.id : Number.NaN;
    let idx = list.findIndex((i) => i.id === overId);
    if (idx === -1) idx = list.length;
    else if (columnOf(issue.id)?.key === target.key) {
      // Kéo xuống trong cùng cột thì chỗ thả là SAU thẻ bị đè.
      const oldIdx = (byCol.get(target.key) ?? []).findIndex((i) => i.id === issue.id);
      if (oldIdx !== -1 && oldIdx <= idx) idx += 1;
    }
    const before = list[idx - 1] ?? null;
    const after = list[idx] ?? null;
    const newOrder = [...list.slice(0, idx).map((i) => i.id), issue.id, ...list.slice(idx).map((i) => i.id)];
    const same = (byCol.get(target.key) ?? []).map((i) => i.id).join() === newOrder.join();
    if (same && statusId === undefined) return;

    orderRef.current = new Map([[target.key, newOrder]]);
    // Luôn tạo Map mới để byCol tính lại theo thứ tự lạc quan.
    setPending((p) => (statusId !== undefined ? new Map(p).set(issue.id, { statusId }) : new Map(p)));
    move.mutate({ num: issue.number, statusId, beforeIssueId: before?.id ?? null, afterIssueId: after?.id ?? null, version: issue.version });
  };

  const quickAdd = (col: BoardColumn) => async (title: string) => {
    const typeId = (config.issueTypes.find((t) => t.key === 'TASK') ?? config.issueTypes.find((t) => t.key === 'STORY') ?? config.issueTypes.find((t) => t.level === 0))?.id;
    if (!typeId) return;
    const wf = lk.workflowOfType(typeId);
    const statusId = col.statusIds.find((s) => wf?.statuses.some((x) => x.id === s));
    try {
      await workApi.createIssue(pid, { typeId, title, statusId, sprintId: data.sprint?.id ?? undefined });
      await qc.invalidateQueries({ queryKey: wk.board(pid) });
    } catch (err) {
      toast.error(workError(err, 'Could not create the issue'));
      throw err;
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
      <div className="flex h-full gap-3 overflow-x-auto px-4 pb-4 pt-3">
        {config.boardColumns.map((col) => (
          <Column
            key={col.key}
            col={col}
            issues={byCol.get(col.key) ?? []}
            lk={lk}
            onOpen={onOpen}
            canDrag={canDrag}
            highlight={overCol === col.key && !blockedCols.has(col.key) && !!active && !col.statusIds.includes(active.statusId)}
            blocked={blockedCols.has(col.key)}
            onQuickAdd={config.permissions.editIssues && col.category !== 'DONE' ? quickAdd(col) : undefined}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 160, easing: 'ease-out' }}>
        {active ? <div className="w-[272px] cursor-grabbing"><CardBody issue={active} lk={lk} dragging /></div> : null}
      </DragOverlay>
    </DndContext>
  );
}
