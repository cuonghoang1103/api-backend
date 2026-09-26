'use client';

/**
 * Board kéo thả (dnd-kit). Mỗi cột là một nhóm trạng thái (xem boardColumns
 * ở backend). Thả thẻ vào cột ⇒ chọn trạng thái đích HỢP LỆ theo quy trình
 * của chính thẻ đó (Bug có vòng Retest, Story thì không), rồi gửi rank theo
 * hai hàng xóm để server đặt đúng chỗ.
 *
 * Như Jira: việc con KHÔNG thành thẻ rời lẫn với story — mặc định nó lồng
 * trong thẻ cha ("3 sub-tasks"), hoặc chọn Group by → Sub-tasks để mỗi thẻ cha
 * thành một làn (swimlane) và việc con là thẻ kéo được. Group by Assignee /
 * Epic chia làn theo người / epic. Logic chia nằm ở ./board/grouping.ts.
 *
 * Lạc quan: thẻ nằm yên ở chỗ vừa thả ngay lập tức; server từ chối thì trả về
 * chỗ cũ + báo lý do. Sự kiện socket của chính mình sẽ tải lại board sau đó.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  closestCorners, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useDroppable, useSensor, useSensors,
  type DragEndEvent, type DragOverEvent, type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight, Layers, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  workApi, workError, workErrorStatus, type BoardColumn, type BoardData, type IssueCard, type ProjectConfig,
} from '@/lib/work-api';
import { allowedTargets, wk, type Lookups } from './hooks';
import { IssueTypeIcon, StatusBadge, UserAvatar } from './ui';
import { CardBody } from './board/BoardCard';
import BoardToolbar from './board/BoardToolbar';
import {
  buildLanes, EMPTY_QUICK, isSubtask, makeQuickTest, subtasksByParent, type GroupBy, type Lane, type QuickFilters, type SubtaskInfo,
} from './board/grouping';

export { CardBody } from './board/BoardCard';

const COL_W = 284;
/** Cột co giãn cho vừa màn hình: tối thiểu 260px (hẹp thì cuộn ngang), tối đa 380px. */
const COL_STYLE = { flex: '1 0 0', minWidth: 260, maxWidth: 380 } as const;

// ─── Lưu lựa chọn theo dự án (localStorage có thể ném lỗi ở cửa sổ riêng tư) ──

function readLs<T>(key: string, fallback: T): T {
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch { return fallback; }
}
function writeLs(key: string, v: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* bỏ qua */ }
}

// ─── Thẻ kéo được ────────────────────────────────────────────────

function SortableCard({ issue, lk, onOpen, disabled, subtasks, inDone, showParent }: {
  issue: IssueCard; lk: Lookups; onOpen: (n: number) => void; disabled: boolean;
  subtasks: SubtaskInfo | null; inDone: boolean; showParent: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: issue.id, disabled });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn('rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--w-accent-border)]', isDragging && 'opacity-40')}
      {...attributes}
      // Không kéo được (chỉ xem / đang khoá chỉnh sửa) vẫn MỞ thẻ được ⇒ không phải "disabled".
      aria-disabled={undefined}
      {...listeners}
      onClick={() => onOpen(issue.number)}
      onKeyDown={(e) => {
        listeners?.onKeyDown?.(e);
        if (e.key === 'Enter' && !e.defaultPrevented) onOpen(issue.number);
      }}
    >
      <CardBody issue={issue} lk={lk} subtasks={subtasks} inDoneColumn={inDone} onOpen={onOpen} showParent={showParent} />
    </div>
  );
}

// ─── Tạo nhanh trong cột ─────────────────────────────────────────

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
      placeholder="What needs to be done? Enter to create"
      onChange={(e) => setTitle(e.target.value)}
      onBlur={() => { if (!title.trim()) setOpen(false); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void submit(); }
        if (e.key === 'Escape') { setTitle(''); setOpen(false); }
      }}
      className="w-input !h-auto resize-none py-1.5 text-[13px]"
    />
  );
}

// ─── Ô (một cột trong một làn) ───────────────────────────────────

function Cell({ laneKey, col, cards, lk, onOpen, canDrag, onQuickAdd, highlight, blocked, nested, onBoard, grow }: {
  laneKey: string; col: BoardColumn; cards: IssueCard[]; lk: Lookups; onOpen: (n: number) => void; canDrag: boolean;
  onQuickAdd?: (title: string) => Promise<unknown>; highlight: boolean; blocked: boolean;
  /** Việc con theo id cha — null khi chế độ Sub-tasks (việc con là thẻ). */
  nested: Map<number, SubtaskInfo> | null;
  onBoard: Set<number>;
  grow: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: `col:${laneKey}|${col.key}` });
  const inDone = col.category === 'DONE';
  return (
    <div
      ref={setNodeRef}
      style={COL_STYLE}
      className={cn(
        'flex shrink-0 flex-col gap-1.5 rounded-[8px] bg-[var(--w-sunken)] p-1.5 transition-colors',
        grow ? 'min-h-[160px]' : 'min-h-[64px]',
        highlight && 'bg-[var(--w-accent-soft)] outline outline-1 outline-[var(--w-accent-border)]',
        blocked && 'opacity-50',
      )}
    >
      <SortableContext items={cards.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {cards.map((i) => (
          <SortableCard
            key={i.id}
            issue={i}
            lk={lk}
            onOpen={onOpen}
            disabled={!canDrag}
            subtasks={nested?.get(i.id) ?? null}
            inDone={inDone}
            showParent={isSubtask(i, lk) && !!i.parentId && !onBoard.has(i.parentId)}
          />
        ))}
      </SortableContext>
      {onQuickAdd && <QuickAdd onCreate={onQuickAdd} />}
    </div>
  );
}

// ─── Đầu làn ─────────────────────────────────────────────────────

function LaneHeader({ lane, lk, collapsed, onToggle, onOpen, info, count }: {
  lane: Lane; lk: Lookups; collapsed: boolean; onToggle: () => void; onOpen: (n: number) => void; info?: SubtaskInfo; count: number;
}) {
  const p = lane.parent;
  return (
    <div className="sticky left-0 z-[1] flex w-fit max-w-[min(100vw-48px,900px)] items-center gap-2 py-1.5">
      <button type="button" onClick={onToggle} aria-expanded={!collapsed} className="flex min-w-0 items-center gap-2 rounded-[5px] px-1 py-0.5 text-left hover:bg-[var(--w-hover)]">
        {collapsed ? <ChevronRight size={14} className="shrink-0" /> : <ChevronDown size={14} className="shrink-0" />}
        {lane.userId !== undefined && <UserAvatar user={lane.userId ? lk.members.get(lane.userId) : null} size={20} />}
        {lane.epic !== undefined && (
          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] bg-[#7c3aed] text-white"><Layers size={10} /></span>
        )}
        {p && <IssueTypeIcon type={lk.types.get(p.typeId)} size={13} />}
        {p && <span className="shrink-0 font-mono text-[11.5px] text-[var(--w-text-3)]">{lk.issueKey(p.number)}</span>}
        <span className="truncate text-[13px] font-semibold">{lane.title}</span>
        <span className="shrink-0 rounded-full bg-[var(--w-sunken)] px-1.5 text-[11px] font-medium tabular text-[var(--w-text-2)]">
          {count} {lane.parent ? (count === 1 ? 'sub-task' : 'sub-tasks') : count === 1 ? 'issue' : 'issues'}
        </span>
      </button>
      {p && (
        <>
          <StatusBadge status={lk.statuses.get(p.statusId)} />
          {info && <span className="text-[11.5px] tabular text-[var(--w-text-3)]">{info.done}/{info.total} done</span>}
          {info && info.open > 0 && lk.statuses.get(p.statusId)?.category === 'DONE' && (
            <span className="text-[11.5px] font-medium text-[var(--w-orange)]" title="The parent is done but some sub-tasks are still open">⚠ {info.open} still open</span>
          )}
          <button type="button" onClick={() => onOpen(p.number)} className="text-[12px] text-[var(--w-accent-text)] hover:underline">Open</button>
        </>
      )}
    </div>
  );
}

// ─── Board ───────────────────────────────────────────────────────

export default function Board({ config, lk, data, visible, onOpen, toolbarLeading }: {
  config: ProjectConfig;
  lk: Lookups;
  data: BoardData;
  /** Thẻ còn lại sau bộ lọc của trang (null = không lọc). */
  visible: Set<number> | null;
  /** Bộ lọc của trang, đặt ở đầu hàng công cụ. */
  toolbarLeading?: import('react').ReactNode;
  onOpen: (n: number) => void;
}) {
  const qc = useQueryClient();
  const pid = config.id;
  const canDrag = config.permissions.transition;
  const lsKey = `ctwork:board:${pid}`;
  const [group, setGroupState] = useState<GroupBy>('none');
  const [quick, setQuick] = useState<QuickFilters>(EMPTY_QUICK);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  // Đọc lựa chọn đã lưu sau khi gắn (tránh lệch HTML lúc hydrate).
  useEffect(() => {
    setGroupState(readLs<GroupBy>(`${lsKey}:group`, 'none'));
    setCollapsed(new Set(readLs<string[]>(`${lsKey}:collapsed`, [])));
  }, [lsKey]);
  const setGroup = (g: GroupBy) => { setGroupState(g); writeLs(`${lsKey}:group`, g); };
  const saveCollapsed = useCallback((s: Set<string>) => { setCollapsed(s); writeLs(`${lsKey}:collapsed`, [...s].slice(0, 200)); }, [lsKey]);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  // Vị trí lạc quan: thẻ vừa thả → trạng thái mới cho tới khi server trả lời.
  const [pending, setPending] = useState<Map<number, { statusId: number }>>(new Map());
  // Thứ tự lạc quan theo ô `${lane}|${col}`.
  const orderRef = useRef<Map<string, number[]> | null>(null);

  // Epic (không có trên board) — chỉ tải khi chia làn theo epic.
  const epicTypeIds = useMemo(() => config.issueTypes.filter((t) => t.level === 1).map((t) => t.id), [config.issueTypes]);
  const epicsQ = useQuery({
    queryKey: [...wk.issues(pid), 'board-epics'],
    queryFn: () => workApi.issues(pid, { type: epicTypeIds, includeDone: true, limit: 500 }),
    enabled: group === 'epic' && epicTypeIds.length > 0,
    staleTime: 30_000,
  });
  const epics = useMemo(() => new Map((epicsQ.data?.items ?? []).map((e) => [e.id, { number: e.number, title: e.title }])), [epicsQ.data]);

  const colOfStatus = useMemo(() => {
    const m = new Map<number, string>();
    config.boardColumns.forEach((c) => c.statusIds.forEach((s) => m.set(s, c.key)));
    return m;
  }, [config.boardColumns]);

  const issues = useMemo(
    () => data.issues.map((raw) => (pending.has(raw.id) ? { ...raw, ...pending.get(raw.id)! } : raw)),
    [data.issues, pending],
  );
  const filtered = useMemo(() => {
    const test = makeQuickTest(quick, lk);
    return issues.filter((i) => (!visible || visible.has(i.id)) && test(i));
  }, [issues, visible, quick, lk]);
  const onBoard = useMemo(() => new Set(filtered.map((i) => i.id)), [filtered]);

  // Tiến độ việc con tính trên TOÀN BỘ board; cách lồng tính trên phần đang hiện.
  const nestedAll = useMemo(() => subtasksByParent(issues, lk), [issues, lk]);
  const nestedShown = useMemo(() => subtasksByParent(filtered, lk), [filtered, lk]);
  const lanes = useMemo(() => buildLanes(group, filtered, lk, nestedShown, epics), [group, filtered, lk, nestedShown, epics]);

  /** lane → cột → thẻ (đã áp thứ tự lạc quan). */
  const cells = useMemo(() => {
    const out = new Map<string, Map<string, IssueCard[]>>();
    for (const lane of lanes) {
      const m = new Map<string, IssueCard[]>(config.boardColumns.map((c) => [c.key, []]));
      for (const i of lane.cards) {
        const k = colOfStatus.get(i.statusId);
        if (k) m.get(k)!.push(i);
      }
      out.set(lane.key, m);
    }
    const ord = orderRef.current;
    if (ord) {
      for (const [cellKey, ids] of ord) {
        const [laneKey, colKey] = cellKey.split('|');
        out.get(laneKey)?.get(colKey)?.sort((a, b) => {
          const ia = ids.indexOf(a.id);
          const ib = ids.indexOf(b.id);
          return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
        });
      }
    }
    return out;
  }, [lanes, config.boardColumns, colOfStatus]);

  /** id thẻ → ô chứa nó. */
  const cellOf = useMemo(() => {
    const m = new Map<number, { lane: string; col: string }>();
    for (const [lane, cols] of cells) for (const [col, list] of cols) for (const i of list) m.set(i.id, { lane, col });
    return m;
  }, [cells]);

  // Đầu cột: số thẻ + điểm, cộng qua mọi làn.
  const colStats = useMemo(() => {
    const m = new Map<string, { count: number; points: number }>();
    for (const c of config.boardColumns) m.set(c.key, { count: 0, points: 0 });
    for (const cols of cells.values()) {
      for (const [k, list] of cols) {
        const s = m.get(k)!;
        s.count += list.length;
        s.points += list.reduce((a, i) => a + (i.storyPoints ?? 0), 0);
      }
    }
    return m;
  }, [cells, config.boardColumns]);

  const byId = useMemo(() => new Map(issues.map((i) => [i.id, i])), [issues]);
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
      qc.invalidateQueries({ queryKey: wk.backlog(pid) });
      orderRef.current = null;
      setPending((p) => {
        const n = new Map(p);
        for (const [id] of n) if (byId.get(id)?.number === v.num) n.delete(id);
        return n;
      });
    },
  });

  /** Ô đích từ id của dnd-kit (ô trống hoặc thẻ bị đè). */
  const targetOf = (id: string | number | undefined): { lane: string; col: BoardColumn } | undefined => {
    if (id === undefined) return undefined;
    if (typeof id === 'string' && id.startsWith('col:')) {
      const [lane, colKey] = id.slice(4).split('|');
      const col = config.boardColumns.find((c) => c.key === colKey);
      return col ? { lane, col } : undefined;
    }
    const at = cellOf.get(Number(id));
    const col = at && config.boardColumns.find((c) => c.key === at.col);
    return at && col ? { lane: at.lane, col } : undefined;
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
  const onDragOver = (e: DragOverEvent) => setOverCol(targetOf(e.over?.id ?? undefined)?.col.key ?? null);
  const onDragCancel = () => { setActiveId(null); setOverCol(null); };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    setOverCol(null);
    const issue = byId.get(Number(e.active.id));
    const from = issue ? cellOf.get(issue.id) : undefined;
    const t = targetOf(e.over?.id ?? undefined);
    if (!issue || !from || !t) return;
    // Làn là cách NHÌN (người/epic/cha) — thả sang làn khác chỉ đổi trạng thái, thẻ ở lại làn của nó.
    const lane = from.lane;
    const target = t.col;

    const fromStatus = issue.statusId;
    let statusId: number | undefined;
    if (!target.statusIds.includes(fromStatus)) {
      const options = allowedTargets(lk, issue.typeId, fromStatus, target.statusIds);
      if (!options.length) {
        const fromName = lk.statuses.get(fromStatus)?.name ?? 'this status';
        toast.error(`The ${lk.types.get(issue.typeId)?.name ?? 'issue'} workflow does not allow moving from ${fromName} to ${target.name}.`);
        return;
      }
      statusId = options[0];
    }

    // Thứ tự mới trong ô đích: bỏ thẻ ra, chèn vào chỗ thả.
    const full = cells.get(lane)?.get(target.key) ?? [];
    const list = full.filter((i) => i.id !== issue.id);
    const overId = typeof e.over?.id === 'number' ? e.over.id : Number.NaN;
    let idx = t.lane === lane ? list.findIndex((i) => i.id === overId) : -1;
    if (idx === -1) idx = list.length;
    else if (from.col === target.key) {
      // Kéo xuống trong cùng cột thì chỗ thả là SAU thẻ bị đè.
      const oldIdx = full.findIndex((i) => i.id === issue.id);
      if (oldIdx !== -1 && oldIdx <= idx) idx += 1;
    }
    const before = list[idx - 1] ?? null;
    const after = list[idx] ?? null;
    const newOrder = [...list.slice(0, idx).map((i) => i.id), issue.id, ...list.slice(idx).map((i) => i.id)];
    const same = full.map((i) => i.id).join() === newOrder.join();
    if (same && statusId === undefined) return;

    orderRef.current = new Map([[`${lane}|${target.key}`, newOrder]]);
    // Luôn tạo Map mới để các ô tính lại theo thứ tự lạc quan.
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
      qc.invalidateQueries({ queryKey: wk.backlog(pid) });
    } catch (err) {
      toast.error(workError(err, 'Could not create the issue'));
      throw err;
    }
  };

  const toggleLane = (k: string) => {
    const n = new Set(collapsed);
    if (n.has(k)) n.delete(k); else n.add(k);
    saveCollapsed(n);
  };

  const single = group === 'none';
  const total = data.issues.length;
  const shown = filtered.length;

  return (
    <div className="flex h-full flex-col">
      <BoardToolbar
        config={config}
        group={group}
        onGroup={setGroup}
        quick={quick}
        onQuick={setQuick}
        shown={shown}
        total={total}
        lanes={lanes.length}
        onCollapseAll={(c) => saveCollapsed(c ? new Set(lanes.map((l) => `${group}:${l.key}`)) : new Set())}
        leading={toolbarLeading}
      />
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
        <div className="min-h-0 flex-1 overflow-auto [scrollbar-gutter:stable]">
          <div className="flex min-h-full min-w-max flex-col px-4 pb-4">
            {/* Đầu cột — dính trên cùng khi cuộn dọc */}
            <div className="sticky top-0 z-[2] flex gap-3 bg-[var(--w-panel)] pb-2 pt-3">
              {config.boardColumns.map((col) => {
                const s = colStats.get(col.key) ?? { count: 0, points: 0 };
                const over = col.wipLimit !== null && s.count > col.wipLimit;
                return (
                  <div key={col.key} style={COL_STYLE} className="flex h-7 shrink-0 items-center gap-2 px-1">
                    <span className="truncate text-[12px] font-semibold uppercase tracking-[0.03em] text-[var(--w-text-2)]">{col.name}</span>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-1.5 text-[11.5px] tabular',
                        over ? 'bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] font-semibold text-[var(--w-red)]' : 'bg-[var(--w-sunken)] text-[var(--w-text-2)]',
                      )}
                      title={col.wipLimit !== null ? `${s.count} issues · WIP limit ${col.wipLimit}${over ? ' — over the limit' : ''}` : `${s.count} issues`}
                    >
                      {s.count}{col.wipLimit !== null && ` / ${col.wipLimit}`}
                    </span>
                    {over && <span className="shrink-0 text-[10.5px] font-semibold uppercase text-[var(--w-red)]">Over WIP</span>}
                    <span className="ml-auto shrink-0 text-[11px] tabular text-[var(--w-text-3)]" title="Story points in this column">{Math.round(s.points * 10) / 10} pts</span>
                  </div>
                );
              })}
            </div>

            {lanes.map((lane) => {
              const cols = cells.get(lane.key)!;
              const collapseKey = `${group}:${lane.key}`;
              const isCollapsed = !single && collapsed.has(collapseKey);
              const count = lane.cards.length;
              if (!single && !count && lane.key === 'other') return null;
              return (
                <section key={lane.key} className={cn(single ? 'flex flex-1 flex-col' : 'border-t border-[var(--w-border)] pt-1 first-of-type:border-t-0')}>
                  {!single && (
                    <LaneHeader
                      lane={lane}
                      lk={lk}
                      collapsed={isCollapsed}
                      onToggle={() => toggleLane(collapseKey)}
                      onOpen={onOpen}
                      info={lane.parent ? nestedAll.get(lane.parent.id) : undefined}
                      count={count}
                    />
                  )}
                  {!isCollapsed && (
                    <div className={cn('flex gap-3', single ? 'flex-1 items-stretch' : 'pb-3')}>
                      {config.boardColumns.map((col) => (
                        <Cell
                          key={col.key}
                          laneKey={lane.key}
                          col={col}
                          cards={cols.get(col.key) ?? []}
                          lk={lk}
                          onOpen={onOpen}
                          canDrag={canDrag}
                          highlight={overCol === col.key && !blockedCols.has(col.key) && !!active && !col.statusIds.includes(active.statusId)}
                          blocked={blockedCols.has(col.key)}
                          nested={group === 'subtasks' ? null : nestedAll}
                          onBoard={onBoard}
                          grow={single}
                          onQuickAdd={single && config.permissions.createIssues && col.category !== 'DONE' ? quickAdd(col) : undefined}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
            {!filtered.length && (
              <p className="sticky left-0 py-6 text-center text-[13px] text-[var(--w-text-3)]">No issues match the current filters.</p>
            )}
          </div>
        </div>
        <DragOverlay dropAnimation={{ duration: 160, easing: 'ease-out' }}>
          {active ? <div style={{ width: COL_W - 12 }} className="cursor-grabbing"><CardBody issue={active} lk={lk} dragging /></div> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
