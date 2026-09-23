'use client';

/**
 * Backlog: các sprint chưa đóng (sprint đang chạy trên cùng) + backlog.
 *
 * - Kéo thả thẻ giữa sprint ↔ backlog và sắp xếp (dnd-kit, nhiều khung chứa).
 *   Rank là THỨ TỰ TOÀN DỰ ÁN, nên chỉ cần gửi hai hàng xóm trong khung đích.
 * - Chọn nhiều thẻ (⌘/Ctrl-click, Shift-click, ô chọn) ⇒ thanh sửa hàng loạt.
 * - Bảng epic bên trái: tiến độ + lọc theo epic.
 */

import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useDroppable, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ChevronDown, ChevronRight, MoreHorizontal, Pencil, Play, Plus, Trash2, CheckCircle2, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  workApi, workError, workErrorStatus, type BacklogData, type BacklogIssue, type BulkPatch, type ProjectConfig,
  type SprintFull,
} from '@/lib/work-api';
import { wk, type Lookups } from './hooks';
import { CompleteSprintDialog, EditSprintDialog, PlanSprintDialog, sprintRange, StartSprintDialog, unitLabel } from './SprintDialogs';
import { ConfirmDialog } from './settings/shared';
import {
  IssueTypeIcon, Popover, StatusBadge, UserAvatar, useToggle,
} from './ui';
import { PriorityWithTip } from './board/BoardCard';
import BulkBar from './board/BulkBar';
import { bulkSetStatusByName, type BulkResult } from './board/bulk';

/** Thành viên không có quyền sprint vẫn THẤY nút (mờ) và biết vì sao — không giấu im lặng. */
const NO_SPRINT_PERM = 'Only project admins can manage sprints';

type Container = number | 'backlog';
const cid = (c: Container) => `box:${c}`;

// ─── Dòng thẻ ────────────────────────────────────────────────────

function EstimateCell({ issue, unit, editable, onSave }: { issue: BacklogIssue; unit: BacklogData['unit']; editable: boolean; onSave: (v: number | null) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  if (draft !== null) {
    return (
      <input
        autoFocus
        inputMode="decimal"
        value={draft}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const t = draft.trim();
          setDraft(null);
          const n = t === '' ? null : Number(t);
          if (n === null || (Number.isFinite(n) && n >= 0)) onSave(n);
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          if (e.key === 'Escape') setDraft(null);
        }}
        className="w-input h-6 w-12 px-1 text-center text-[12px]"
      />
    );
  }
  const val = unit === 'HOURS' ? (issue.originalEstimateMin ? issue.estimate : null) : issue.storyPoints;
  return (
    <button
      type="button"
      disabled={!editable}
      title={editable ? (unit === 'HOURS' ? 'Estimate (hours) — click to edit' : 'Story points — click to edit') : unit === 'HOURS' ? 'Estimate (hours)' : 'Story points'}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); setDraft(val === null ? '' : String(val)); }}
      className={cn(
        'inline-flex h-5 min-w-[40px] items-center justify-center rounded-full px-1.5 text-[11px] font-medium tabular',
        val === null ? 'text-[var(--w-text-3)]' : 'bg-[var(--w-sunken)] text-[var(--w-text-2)]',
        editable && 'hover:bg-[var(--w-active)]',
      )}
    >
      {val === null ? '–' : unit === 'HOURS' ? `${val}h` : `${val} ${val === 1 ? 'pt' : 'pts'}`}
    </button>
  );
}

function Row({ issue, lk, unit, selected, onSelect, onOpen, editable, epicTitle, onEstimate, dragDisabled }: {
  issue: BacklogIssue; lk: Lookups; unit: BacklogData['unit']; selected: boolean;
  onSelect: (e: React.MouseEvent | React.KeyboardEvent, id: number) => void; onOpen: (n: number) => void; editable: boolean;
  epicTitle?: string; onEstimate: (issue: BacklogIssue, v: number | null) => void; dragDisabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: issue.id, disabled: dragDisabled });
  const done = lk.statuses.get(issue.statusId)?.category === 'DONE';
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      {...attributes}
      {...listeners}
      role="row"
      aria-selected={selected}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) onSelect(e, issue.id);
        else onOpen(issue.number);
      }}
      onKeyDown={(e) => {
        listeners?.onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === 'Enter') onOpen(issue.number);
        if (e.key === ' ') { e.preventDefault(); onSelect(e, issue.id); }
      }}
      className={cn(
        'group flex h-9 cursor-default items-center gap-2 border-b border-[var(--w-border)] px-3 text-[13px] outline-none last:border-b-0',
        selected ? 'bg-[var(--w-accent-soft)]' : 'bg-[var(--w-panel)] hover:bg-[var(--w-hover)]',
        'focus-visible:shadow-[inset_2px_0_0_var(--w-accent)]',
        isDragging && 'opacity-40',
      )}
    >
      <input
        type="checkbox"
        aria-label={`Select ${lk.issueKey(issue.number)}`}
        checked={selected}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onSelect(e, issue.id); }}
        onChange={() => {}}
        className={cn('shrink-0 accent-[var(--w-accent)]', !selected && 'opacity-0 group-hover:opacity-100 focus:opacity-100')}
      />
      <IssueTypeIcon type={lk.types.get(issue.typeId)} size={13} />
      <span className="w-[64px] shrink-0 font-mono text-[11px] text-[var(--w-text-3)]">{lk.issueKey(issue.number)}</span>
      <span className={cn('min-w-0 flex-1 truncate', done && 'text-[var(--w-text-3)] line-through')}>{issue.title}</span>
      {epicTitle && (
        <span className="hidden max-w-[160px] shrink-0 truncate rounded-[4px] bg-[color-mix(in_srgb,#7c3aed_14%,transparent)] px-1.5 py-px text-[11px] font-medium text-[#8b5cf6] md:inline" title={`Epic: ${epicTitle}`}>
          {epicTitle}
        </span>
      )}
      {issue.subtaskCount > 0 && <span className="hidden text-[11px] text-[var(--w-text-3)] sm:inline" title="Sub-tasks">{issue.subtaskCount} {issue.subtaskCount === 1 ? 'sub-task' : 'sub-tasks'}</span>}
      <span className="hidden sm:inline"><StatusBadge status={lk.statuses.get(issue.statusId)} /></span>
      <EstimateCell issue={issue} unit={unit} editable={editable} onSave={(v) => onEstimate(issue, v)} />
      <PriorityWithTip priority={issue.priority} size={13} />
      <UserAvatar user={issue.assigneeId ? lk.members.get(issue.assigneeId) : null} size={20} />
    </div>
  );
}

// ─── Khung chứa (một sprint hoặc backlog) ────────────────────────

function Box({ id, children, empty }: { id: Container; children: ReactNode; empty: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: cid(id) });
  return (
    <div
      ref={setNodeRef}
      className={cn('overflow-hidden rounded-[8px] border border-[var(--w-border)] transition-colors', isOver && 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]')}
    >
      {children}
      {empty}
    </div>
  );
}

interface BoxTotals { count: number; todo: number; progress: number; done: number; nTodo: number; nProgress: number; nDone: number }
const EMPTY_TOTALS: BoxTotals = { count: 0, todo: 0, progress: 0, done: 0, nTodo: 0, nProgress: 0, nDone: 0 };

/** "2 to do · 1 in progress · 1 done · 21 pts" — chữ rõ nghĩa thay cho ba con số trơn. */
function SprintSummary({ t, unit }: { t: BoxTotals; unit: BacklogData['unit'] }) {
  const r = (n: number) => Math.round(n * 10) / 10;
  const u = unit === 'HOURS' ? 'h' : 'pts';
  const part = (n: number, pts: number, label: string, color: string) => (
    <span className="inline-flex items-center gap-1" title={`${n} ${n === 1 ? 'issue' : 'issues'} ${label} · ${r(pts)} ${unitLabel(unit)}`}>
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="tabular">{n}</span> {label}
    </span>
  );
  const total = t.todo + t.progress + t.done;
  return (
    <span className="hidden items-center gap-2 text-[12px] text-[var(--w-text-2)] sm:flex">
      {part(t.nTodo, t.todo, 'to do', 'var(--w-text-3)')}
      <span className="text-[var(--w-text-3)]">·</span>
      {part(t.nProgress, t.progress, 'in progress', 'var(--w-accent)')}
      <span className="text-[var(--w-text-3)]">·</span>
      {part(t.nDone, t.done, 'done', 'var(--w-green)')}
      <span
        className="rounded-full bg-[var(--w-sunken)] px-1.5 py-px text-[11px] font-semibold tabular text-[var(--w-text)]"
        title={`Total estimate: ${r(total)} ${unitLabel(unit)} (${r(t.done)} done)`}
      >
        {r(total)} {u}
      </span>
    </span>
  );
}

/** Nút sprint: có quyền thì bấm được; không thì mờ + chú thích. */
function SprintBtn({ allowed, disabledReason, onClick, children, ghost }: {
  allowed: boolean; disabledReason?: string; onClick: () => void; children: ReactNode; ghost?: boolean;
}) {
  const off = !allowed || !!disabledReason;
  return (
    <span title={!allowed ? NO_SPRINT_PERM : disabledReason} className={cn('inline-flex', off && 'cursor-not-allowed')}>
      <button type="button" disabled={off} onClick={onClick} className={cn('w-btn w-btn-sm', ghost && 'w-btn-ghost', off && 'pointer-events-none')}>
        {children}
      </button>
    </span>
  );
}

function QuickCreate({ onCreate }: { onCreate: (title: string) => Promise<unknown> }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="flex h-9 w-full items-center gap-2 px-3 text-[13px] text-[var(--w-text-3)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text-2)]">
        <Plus size={14} /> Create issue
      </button>
    );
  }
  return (
    <form
      className="flex items-center gap-2 px-2 py-1.5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!title.trim() || busy) return;
        setBusy(true);
        try { await onCreate(title.trim()); setTitle(''); } finally { setBusy(false); }
      }}
    >
      <input
        autoFocus
        value={title}
        disabled={busy}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => { if (!title.trim()) setOpen(false); }}
        onKeyDown={(e) => e.key === 'Escape' && (setTitle(''), setOpen(false))}
        placeholder="What needs to be done? Press Enter to create"
        className="w-input h-8"
      />
    </form>
  );
}

// ─── Backlog ─────────────────────────────────────────────────────

export default function Backlog({ config, lk, data, onOpen, filter }: {
  config: ProjectConfig;
  lk: Lookups;
  data: BacklogData;
  onOpen: (n: number) => void;
  /** Lọc từ thanh công cụ của trang (tìm, epic, người) — null = không lọc. */
  filter: (i: BacklogIssue) => boolean;
}) {
  const qc = useQueryClient();
  const pid = config.id;
  const canPlan = config.permissions.manageSprints;
  const canEdit = config.permissions.editIssues;
  const [collapsed, setCollapsed] = useState<Set<Container>>(new Set());
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const lastClicked = useRef<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [optimistic, setOptimistic] = useState<Map<number, { sprintId: number | null; order?: number[] }>>(new Map());
  const [dialog, setDialog] = useState<{ kind: 'start' | 'complete' | 'edit' | 'delete' | 'plan'; sprint: SprintFull } | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const orderRef = useRef<Map<Container, number[]> | null>(null);

  const epics = useMemo(() => new Map(data.epics.map((e) => [e.id, e])), [data.epics]);
  const containers: Container[] = [...data.sprints.map((s) => s.id), 'backlog'];

  const lists = useMemo(() => {
    const m = new Map<Container, BacklogIssue[]>(containers.map((c) => [c, []]));
    for (const raw of data.issues) {
      const o = optimistic.get(raw.id);
      const i = o ? { ...raw, sprintId: o.sprintId } : raw;
      if (!filter(i)) continue;
      m.get(i.sprintId ?? 'backlog')?.push(i);
    }
    const ord = orderRef.current;
    if (ord) {
      for (const [k, ids] of ord) {
        m.get(k)?.sort((a, b) => {
          const ia = ids.indexOf(a.id);
          const ib = ids.indexOf(b.id);
          return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
        });
      }
    }
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.issues, data.sprints, optimistic, filter]);

  const flat = useMemo(() => containers.flatMap((c) => lists.get(c) ?? []), [lists, containers]);
  const byId = useMemo(() => new Map(data.issues.map((i) => [i.id, i])), [data.issues]);

  // Tổng điểm theo khung, tính trên TOÀN BỘ thẻ (không theo bộ lọc) — giống Jira.
  const totals = useMemo(() => {
    const t = new Map<Container, BoxTotals>();
    for (const i of data.issues) {
      const o = optimistic.get(i.id);
      const c: Container = (o ? o.sprintId : i.sprintId) ?? 'backlog';
      const x = t.get(c) ?? { ...EMPTY_TOTALS };
      x.count += 1;
      const cat = lk.statuses.get(i.statusId)?.category;
      if (cat === 'DONE') { x.done += i.estimate; x.nDone += 1; } else if (cat === 'IN_PROGRESS') { x.progress += i.estimate; x.nProgress += 1; } else { x.todo += i.estimate; x.nTodo += 1; }
      t.set(c, x);
    }
    return t;
  }, [data.issues, optimistic, lk.statuses]);

  const refresh = useCallback(() => {
    for (const k of [wk.backlog(pid), wk.board(pid), wk.issues(pid)]) qc.invalidateQueries({ queryKey: k });
  }, [qc, pid]);

  const onSelect = (e: React.MouseEvent | React.KeyboardEvent, id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if ('shiftKey' in e && e.shiftKey && lastClicked.current !== null) {
        const a = flat.findIndex((i) => i.id === lastClicked.current);
        const b = flat.findIndex((i) => i.id === id);
        if (a !== -1 && b !== -1) {
          for (const i of flat.slice(Math.min(a, b), Math.max(a, b) + 1)) next.add(i.id);
          return next;
        }
      }
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    lastClicked.current = id;
  };

  const bulk = useMutation({
    mutationFn: async (v: { patch?: BulkPatch; status?: string; label: string }): Promise<BulkResult & { label: string }> => {
      const picked = [...selected].map((id) => byId.get(id)).filter((i): i is BacklogIssue => !!i);
      const r = v.status
        ? await bulkSetStatusByName(pid, lk, picked, v.status)
        : await workApi.bulkUpdate(pid, picked.map((i) => i.number), v.patch ?? {});
      return { ...r, label: v.label };
    },
    onSuccess: (r) => {
      if (r.updated.length) toast.success(`${r.updated.length} ${r.updated.length === 1 ? 'issue' : 'issues'} ${r.label}`);
      if (r.failed.length) {
        toast.error(`${r.failed.length} could not be changed: ${r.failed.slice(0, 3).map((f) => `${lk.issueKey(f.number)} (${f.error})`).join(', ')}`);
      }
      setSelected(new Set(r.failed.map((f) => data.issues.find((i) => i.number === f.number)?.id).filter((x): x is number => !!x)));
      refresh();
    },
    onError: (err) => toast.error(workError(err, 'Bulk change failed')),
  });

  const estimate = useMutation({
    mutationFn: (v: { issue: BacklogIssue; value: number | null }) =>
      workApi.updateIssue(pid, v.issue.number, data.unit === 'HOURS'
        ? { originalEstimateMin: v.value === null ? null : Math.round(v.value * 60), version: v.issue.version }
        : { storyPoints: v.value, version: v.issue.version }),
    onSuccess: refresh,
    onError: (err) => { toast.error(workErrorStatus(err) === 409 ? 'Someone else just changed this issue. Refreshed.' : workError(err)); refresh(); },
  });

  const move = useMutation({
    mutationFn: (v: { issue: BacklogIssue; sprintId: number | null; before: number | null; after: number | null }) =>
      workApi.moveIssue(pid, v.issue.number, {
        sprintId: v.sprintId === v.issue.sprintId ? undefined : v.sprintId,
        beforeIssueId: v.before, afterIssueId: v.after, version: v.issue.version,
      }),
    onSettled: async (_d, err, v) => {
      if (err) toast.error(workErrorStatus(err) === 409 ? 'The backlog changed while you were dragging. Refreshed.' : workError(err, 'Could not move the issue'));
      await qc.invalidateQueries({ queryKey: wk.backlog(pid) });
      qc.invalidateQueries({ queryKey: wk.board(pid) });
      orderRef.current = null;
      setOptimistic((o) => { const n = new Map(o); n.delete(v.issue.id); return n; });
    },
  });

  const containerOf = (id: string | number | undefined): Container | undefined => {
    if (id === undefined) return undefined;
    if (typeof id === 'string' && id.startsWith('box:')) {
      const v = id.slice(4);
      return v === 'backlog' ? 'backlog' : Number(v);
    }
    const i = byId.get(Number(id));
    if (!i) return undefined;
    return (optimistic.get(i.id)?.sprintId ?? i.sprintId) ?? 'backlog';
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const issue = byId.get(Number(e.active.id));
    const target = containerOf(e.over?.id ?? undefined);
    if (!issue || target === undefined) return;
    const from = containerOf(issue.id);
    const full = lists.get(target) ?? [];
    const list = full.filter((i) => i.id !== issue.id);
    const overId = typeof e.over?.id === 'number' ? e.over.id : Number.NaN;
    let idx = list.findIndex((i) => i.id === overId);
    if (idx === -1) idx = list.length;
    else if (from === target) {
      const oldIdx = full.findIndex((i) => i.id === issue.id);
      if (oldIdx !== -1 && oldIdx <= idx) idx += 1;
    }
    const newOrder = [...list.slice(0, idx).map((i) => i.id), issue.id, ...list.slice(idx).map((i) => i.id)];
    if (from === target && full.map((i) => i.id).join() === newOrder.join()) return;
    const sprintId = target === 'backlog' ? null : target;
    orderRef.current = new Map([[target, newOrder]]);
    setOptimistic((o) => new Map(o).set(issue.id, { sprintId }));
    move.mutate({ issue, sprintId, before: list[idx - 1]?.id ?? null, after: list[idx]?.id ?? null });
  };

  const create = (sprintId: number | null) => async (title: string) => {
    const typeId = (config.issueTypes.find((t) => t.key === 'STORY') ?? config.issueTypes.find((t) => t.key === 'TASK') ?? config.issueTypes.find((t) => t.level === 0))?.id;
    if (!typeId) return;
    try {
      await workApi.createIssue(pid, { typeId, title, sprintId: sprintId ?? undefined });
      refresh();
    } catch (err) {
      toast.error(workError(err, 'Could not create the issue'));
      throw err;
    }
  };

  const active = data.sprints.find((s) => s.state === 'ACTIVE');
  const planned = data.sprints.filter((s) => s.state === 'PLANNED');
  const dragging = activeId ? byId.get(activeId) : undefined;
  const deleteSprint = useMutation({
    mutationFn: (s: SprintFull) => workApi.deleteSprint(pid, s.id),
    onSuccess: () => { refresh(); qc.invalidateQueries({ queryKey: wk.project(pid) }); setDialog(null); },
    onError: (err) => toast.error(workError(err)),
  });

  const renderRows = (c: Container) => {
    const rows = lists.get(c) ?? [];
    return (
      <SortableContext items={rows.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {rows.map((i) => (
          <Row
            key={i.id}
            issue={i}
            lk={lk}
            unit={data.unit}
            selected={selected.has(i.id)}
            onSelect={onSelect}
            onOpen={onOpen}
            editable={canEdit}
            epicTitle={i.parentId ? epics.get(i.parentId)?.title : undefined}
            onEstimate={(issue, value) => estimate.mutate({ issue, value })}
            dragDisabled={!canEdit}
          />
        ))}
      </SortableContext>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e: DragStartEvent) => setActiveId(Number(e.active.id))}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div
        className="space-y-5 px-4 pb-28 pt-4"
        onKeyDown={(e) => { if (e.key === 'Escape' && selected.size && !document.querySelector('[role="dialog"]')) setSelected(new Set()); }}
      >
        {data.sprints.map((s) => {
          const t = totals.get(s.id) ?? EMPTY_TOTALS;
          const isCollapsed = collapsed.has(s.id);
          const range = sprintRange(s);
          return (
            <section key={s.id}>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCollapsed((c) => { const n = new Set(c); if (n.has(s.id)) n.delete(s.id); else n.add(s.id); return n; })}
                  className="flex items-center gap-1.5 text-[13px] font-semibold"
                >
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  {s.name}
                </button>
                {s.state === 'ACTIVE' && <span className="rounded-[4px] bg-[var(--w-accent-soft)] px-1.5 text-[10px] font-semibold uppercase text-[var(--w-accent-text)]">Active</span>}
                {range && <span className="text-[12px] text-[var(--w-text-3)]">{range}</span>}
                <span className="text-[12px] text-[var(--w-text-3)] tabular">({t.count} {t.count === 1 ? 'issue' : 'issues'})</span>
                <span className="ml-auto flex items-center gap-2">
                  <SprintSummary t={t} unit={data.unit} />
                  {s.state === 'PLANNED' && canPlan && (
                    <button
                      type="button"
                      className="w-btn w-btn-ghost w-btn-sm"
                      title="Propose issues for this sprint from your velocity"
                      onClick={() => setDialog({ kind: 'plan', sprint: s })}
                    >
                      <Sparkles size={12} /> <span className="max-sm:!hidden">Plan with AI</span>
                    </button>
                  )}
                  {s.state === 'PLANNED' && (
                    <SprintBtn
                      allowed={canPlan}
                      disabledReason={active ? `${active.name} is still running — complete it first` : undefined}
                      onClick={() => setDialog({ kind: 'start', sprint: s })}
                    >
                      <Play size={12} /> Start sprint
                    </SprintBtn>
                  )}
                  {s.state === 'ACTIVE' && (
                    <SprintBtn allowed={canPlan} onClick={() => setDialog({ kind: 'complete', sprint: s })}>
                      <CheckCircle2 size={12} /> Complete sprint
                    </SprintBtn>
                  )}
                  {canPlan && <SprintMenu sprint={s} onEdit={() => setDialog({ kind: 'edit', sprint: s })} onDelete={() => setDialog({ kind: 'delete', sprint: s })} />}
                </span>
              </div>
              {s.goal && !isCollapsed && <p className="mb-1.5 pl-5 text-[12px] text-[var(--w-text-2)]">{s.goal}</p>}
              {!isCollapsed && (
                <Box
                  id={s.id}
                  empty={!lists.get(s.id)?.length ? (
                    <div className="flex h-16 items-center justify-center border-b border-dashed border-[var(--w-border)] text-[12px] text-[var(--w-text-3)] last:border-b-0">
                      {t.count ? 'No issues match the current filter.' : 'Plan this sprint by dragging issues here from the backlog.'}
                    </div>
                  ) : null}
                >
                  {renderRows(s.id)}
                  {canEdit && <QuickCreate onCreate={create(s.id)} />}
                </Box>
              )}
            </section>
          );
        })}

        <section>
          <div className="mb-1.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCollapsed((c) => { const n = new Set(c); if (n.has('backlog')) n.delete('backlog'); else n.add('backlog'); return n; })}
              className="flex items-center gap-1.5 text-[13px] font-semibold"
            >
              {collapsed.has('backlog') ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              Backlog
            </button>
            <span className="text-[12px] text-[var(--w-text-3)] tabular">({totals.get('backlog')?.count ?? 0} issues)</span>
            <span className="ml-auto flex items-center gap-2">
              {totals.get('backlog') && <SprintSummary t={totals.get('backlog')!} unit={data.unit} />}
              <SprintBtn
                allowed={canPlan}
                onClick={async () => {
                  try { await workApi.createSprint(pid); refresh(); qc.invalidateQueries({ queryKey: wk.project(pid) }); } catch (err) { toast.error(workError(err)); }
                }}
              >
                <Plus size={12} /> Create sprint
              </SprintBtn>
            </span>
          </div>
          {!collapsed.has('backlog') && (
            <Box
              id="backlog"
              empty={!lists.get('backlog')?.length ? (
                <div className="flex h-16 items-center justify-center border-b border-dashed border-[var(--w-border)] text-[12px] text-[var(--w-text-3)] last:border-b-0">
                  {totals.get('backlog')?.count ? 'No issues match the current filter.' : 'Your backlog is empty.'}
                </div>
              ) : null}
            >
              {renderRows('backlog')}
              {(canEdit || config.permissions.createIssues) && <QuickCreate onCreate={create(null)} />}
            </Box>
          )}
        </section>
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease-out' }}>
        {dragging ? (
          <div className="flex h-9 items-center gap-2 rounded-[6px] border border-[var(--w-accent-border)] bg-[var(--w-panel)] px-3 text-[13px]" style={{ boxShadow: 'var(--w-shadow-pop)' }}>
            <IssueTypeIcon type={lk.types.get(dragging.typeId)} size={13} />
            <span className="font-mono text-[11px] text-[var(--w-text-3)]">{lk.issueKey(dragging.number)}</span>
            <span className="truncate">{dragging.title}</span>
          </div>
        ) : null}
      </DragOverlay>

      {selected.size > 0 && (
        <BulkBar
          count={selected.size}
          config={config}
          lk={lk}
          sprints={data.sprints}
          epics={data.epics.filter((e) => !e.done)}
          busy={bulk.isPending}
          onPatch={(patch, label) => bulk.mutate({ patch, label })}
          onStatus={(name) => bulk.mutate({ status: name, label: `moved to ${name}` })}
          onClear={() => setSelected(new Set())}
          onDelete={() => setBulkDelete(true)}
        />
      )}

      <ConfirmDialog
        open={bulkDelete}
        onClose={() => setBulkDelete(false)}
        onConfirm={() => { setBulkDelete(false); bulk.mutate({ patch: { delete: true }, label: 'deleted' }); }}
        title={`Delete ${selected.size} ${selected.size === 1 ? 'issue' : 'issues'}`}
        body="The selected issues and their sub-tasks will be deleted."
        confirmLabel="Delete"
      />

      {dialog?.kind === 'start' && (
        <StartSprintDialog
          open
          onClose={() => setDialog(null)}
          pid={pid}
          sprint={dialog.sprint}
          issueCount={totals.get(dialog.sprint.id)?.count ?? 0}
          points={Math.round(((totals.get(dialog.sprint.id)?.todo ?? 0) + (totals.get(dialog.sprint.id)?.progress ?? 0) + (totals.get(dialog.sprint.id)?.done ?? 0)) * 10) / 10}
          unit={data.unit}
          defaultWeeks={Math.max(1, Math.round(Number((config.settings as { sprintLengthDays?: number }).sprintLengthDays ?? 14) / 7))}
        />
      )}
      {dialog?.kind === 'complete' && (
        <CompleteSprintDialog open onClose={() => setDialog(null)} pid={pid} sprint={dialog.sprint} plannedSprints={planned} />
      )}
      {dialog?.kind === 'plan' && (
        <PlanSprintDialog open onClose={() => setDialog(null)} pid={pid} sprint={dialog.sprint} issueKey={lk.issueKey} />
      )}
      {dialog?.kind === 'edit' && <EditSprintDialog open onClose={() => setDialog(null)} pid={pid} sprint={dialog.sprint} />}
      {dialog?.kind === 'delete' && (
        <ConfirmDialog
          open
          onClose={() => setDialog(null)}
          onConfirm={() => deleteSprint.mutate(dialog.sprint)}
          title={`Delete ${dialog.sprint.name}`}
          body="The sprint is removed and its issues go back to the backlog."
          confirmLabel="Delete sprint"
          pending={deleteSprint.isPending}
        />
      )}
    </DndContext>
  );
}

function SprintMenu({ sprint, onEdit, onDelete }: { sprint: SprintFull; onEdit: () => void; onDelete: () => void }) {
  const t = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={ref} type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="Sprint actions" onClick={t.toggle}><MoreHorizontal size={14} /></button>
      <Popover open={t.on} onClose={t.close} anchorRef={ref} width={180} align="end">
        <div className="p-1">
          <button type="button" onClick={() => { t.close(); onEdit(); }} className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left hover:bg-[var(--w-hover)]"><Pencil size={13} /> Edit sprint</button>
          {sprint.state === 'PLANNED' && (
            <button type="button" onClick={() => { t.close(); onDelete(); }} className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[var(--w-red)] hover:bg-[var(--w-hover)]"><Trash2 size={13} /> Delete sprint</button>
          )}
        </div>
      </Popover>
    </>
  );
}

