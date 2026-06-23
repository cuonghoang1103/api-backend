'use client';

// Editor Checklist tab — Phase 7.
//
// A 4-lane kanban (PRE / PRODUCTION / POST / PUBLISH)
// for the project's to-do list. Each lane is
// collapsible, drag-reorder is supported inside a
// lane and across lanes (changing the phase). A
// progress bar at the top shows the project's
// "ready" state. Adding a row creates it in the
// currently selected lane (or the first one if
// "All" is selected).
//
// Like the other editor tabs, all mutations go
// through the single project PUT — no per-row API.

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Plus,
 Trash2,
 CheckCircle2,
 CircleDashed,
 GripVertical,
 ChevronDown,
 ChevronUp,
 ListChecks,
} from 'lucide-react';
import {
 DndContext,
 closestCenter,
 PointerSensor,
 KeyboardSensor,
 useSensor,
 useSensors,
 type DragEndEvent,
} from '@dnd-kit/core';
import {
 arrayMove,
 SortableContext,
 sortableKeyboardCoordinates,
 useSortable,
 verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CHECKLIST_PHASE_META } from '@/lib/studio-meta';
import type { ChecklistPhase, ContentChecklistItem } from '@/types';

interface ChecklistTabProps {
 items: ContentChecklistItem[];
 onChange: (next: ContentChecklistItem[]) => void;
}

const PHASE_ORDER: ChecklistPhase[] = [
 'PRE',
 'PRODUCTION',
 'POST',
 'PUBLISH',
];

export default function ChecklistTab({
 items,
 onChange,
}: ChecklistTabProps) {
 // Track which lanes are collapsed. Default: all
 // expanded. State is session-only — no need to
 // persist.
 const [collapsed, setCollapsed] = useState<Record<ChecklistPhase, boolean>>({
 PRE: false,
 PRODUCTION: false,
 POST: false,
 PUBLISH: false,
 });

 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
 );

 // Group by phase. Sort by `order` inside each
 // group so the user's order is preserved.
 const byPhase = useMemo(() => {
 const out: Record<ChecklistPhase, ContentChecklistItem[]> = {
 PRE: [],
 PRODUCTION: [],
 POST: [],
 PUBLISH: [],
 };
 for (const item of items) {
 out[item.phase].push(item);
 }
 for (const p of PHASE_ORDER) {
 out[p].sort((a, b) => a.order - b.order);
 }
 return out;
 }, [items]);

 // Aggregate progress.
 const progress = useMemo(() => {
 const total = items.length;
 const done = items.filter((i) => i.done).length;
 const pct = total > 0 ? Math.round((done / total) * 100) : 0;
 return { total, done, pct };
 }, [items]);

 const onAdd = (phase: ChecklistPhase) => {
 const phaseItems = byPhase[phase];
 const nextOrder =
 phaseItems.length > 0
 ? Math.max(...phaseItems.map((i) => i.order)) + 1
 : 0;
 onChange([
 ...items,
 { phase, label: 'New item', done: false, order: nextOrder },
 ]);
 };

 const onUpdate = (id: number, patch: Partial<ContentChecklistItem>) => {
 onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
 };

 const onDelete = (id: number) => {
 onChange(items.filter((i) => i.id !== id));
 };

 const onReorder = (event: DragEndEvent) => {
 const { active, over } = event;
 if (!over || active.id === over.id) return;
 // Find which phase the active and over items are
 // in. If they're in the same lane, just reorder
 // inside it. If different, move the active item
 // to the over item's phase.
 const activeItem = items.find((i) => String(i.id) === active.id);
 const overItem = items.find((i) => String(i.id) === over.id);
 if (!activeItem || !overItem) return;

 if (activeItem.phase === overItem.phase) {
 const lane = byPhase[activeItem.phase];
 const oldIdx = lane.findIndex((i) => i.id === activeItem.id);
 const newIdx = lane.findIndex((i) => i.id === overItem.id);
 if (oldIdx === -1 || newIdx === -1) return;
 const reordered = arrayMove(lane, oldIdx, newIdx).map((it, i) => ({
 ...it,
 order: i,
 }));
 // Splice the reordered lane back into the master
 // list (preserving items from other phases).
 const otherPhases = items.filter(
 (i) => i.phase !== activeItem.phase,
 );
 onChange([...otherPhases, ...reordered]);
 } else {
 // Move across phases.
 const fromLane = byPhase[activeItem.phase];
 const toLane = byPhase[overItem.phase];
 const oldIdx = fromLane.findIndex((i) => i.id === activeItem.id);
 const newIdx = toLane.findIndex((i) => i.id === overItem.id);
 if (oldIdx === -1 || newIdx === -1) return;
 // Remove from source lane, insert at the over
 // position in target lane. Mark the moved item
 // with the new phase.
 const moved: ContentChecklistItem = {
 ...activeItem,
 phase: overItem.phase,
 };
 const newToLane = [...toLane];
 newToLane.splice(newIdx, 0, moved);
 const reorderedTo = newToLane.map((it, i) => ({ ...it, order: i }));
 const newFromLane = fromLane
 .filter((i) => i.id !== activeItem.id)
 .map((it, i) => ({ ...it, order: i }));
 // Other phases (excluding the two) are kept as-is.
 const otherPhases = items.filter(
 (i) =>
 i.phase !== activeItem.phase && i.phase !== overItem.phase,
 );
 onChange([...otherPhases, ...newFromLane, ...reorderedTo]);
 }
 };

 return (
 <div className="space-y-4">
 {/* Progress bar */}
 <div className="studio-glass rounded-2xl p-4 shadow-studio-card">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 <ListChecks className="w-4 h-4 text-studio-400" />
 <span className="text-sm font-semibold text-text-primary">
 Project readiness
 </span>
 </div>
 <span className="text-xs text-text-secondary">
 {progress.done} / {progress.total} · {progress.pct}%
 </span>
 </div>
 <div className="h-2 rounded-full bg-bg-elevated/60 overflow-hidden">
 <motion.div
 className="h-full rounded-full bg-studio-500"
 initial={{ width: 0 }}
 animate={{ width: `${progress.pct}%` }}
 transition={{ duration: 0.4, ease: 'easeOut' }}
 />
 </div>
 </div>

 {/* 4 lanes */}
 <DndContext
 sensors={sensors}
 collisionDetection={closestCenter}
 onDragEnd={onReorder}
 >
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {PHASE_ORDER.map((phase) => {
 const meta = CHECKLIST_PHASE_META[phase];
 const lane = byPhase[phase];
 const laneDone = lane.filter((i) => i.done).length;
 return (
 <div
 key={phase}
 className="studio-glass rounded-2xl shadow-studio-card overflow-hidden"
 >
 <button
 type="button"
 onClick={() =>
 setCollapsed((c) => ({ ...c, [phase]: !c[phase] }))
 }
 className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 hover:bg-bg-elevated/30 transition-colors"
 >
 <div className="flex items-center gap-2">
 <span
 className="inline-block w-2.5 h-2.5 rounded-full"
 style={{ backgroundColor: meta.color }}
 />
 <span
 className="text-xs font-semibold uppercase tracking-wider"
 style={{ color: meta.color }}
 >
 {meta.label}
 </span>
 <span className="text-[10px] text-text-muted">
 {laneDone}/{lane.length}
 </span>
 </div>
 {collapsed[phase] ? (
 <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
 ) : (
 <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
 )}
 </button>
 {!collapsed[phase] && (
 <div className="px-3 sm:px-4 pb-3 sm:pb-4">
 <SortableContext
 items={lane.map((i) => String(i.id))}
 strategy={verticalListSortingStrategy}
 >
 <div className="space-y-1.5 min-h-[40px]">
 <AnimatePresence mode="popLayout">
 {lane.map((item) => (
 <SortableItem
 key={item.id}
 item={item}
 onUpdate={(patch) => onUpdate(item.id!, patch)}
 onDelete={() => onDelete(item.id!)}
 />
 ))}
 </AnimatePresence>
 {lane.length === 0 && (
 <div className="text-center text-[11px] text-text-muted py-3 italic">
 No items
 </div>
 )}
 </div>
 </SortableContext>
 <button
 type="button"
 onClick={() => onAdd(phase)}
 className="mt-2 w-full inline-flex items-center justify-center gap-1 h-7 rounded-md bg-studio-500/10 hover:bg-studio-500/20 text-studio-300 text-[11px] font-semibold transition-colors"
 >
 <Plus className="w-3 h-3" />
 Add to {meta.label}
 </button>
 </div>
 )}
 </div>
 );
 })}
 </div>
 </DndContext>
 </div>
 );
}

// ─── Sortable row ────────────────────────────────────────────────
function SortableItem({
 item,
 onUpdate,
 onDelete,
}: {
 item: ContentChecklistItem;
 onUpdate: (patch: Partial<ContentChecklistItem>) => void;
 onDelete: () => void;
}) {
 const {
 attributes,
 listeners,
 setNodeRef,
 transform,
 transition,
 isDragging,
 } = useSortable({ id: String(item.id) });

 const style: React.CSSProperties = {
 transform: CSS.Transform.toString(transform),
 transition,
 opacity: isDragging ? 0.5 : 1,
 };

 return (
 <motion.div
 ref={setNodeRef}
 style={style}
 layout
 initial={{ opacity: 0, y: 4 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, x: -8 }}
 transition={{ duration: 0.18 }}
 className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-lg ring-1 ${
 item.done
 ? 'bg-emerald-500/5 ring-emerald-500/15'
 : 'bg-bg-elevated/40 ring-studio-500/10'
 }`}
 >
 {/* Drag handle */}
 <button
 type="button"
 {...attributes}
 {...listeners}
 aria-label="Drag to reorder"
 className="text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing"
 >
 <GripVertical className="w-3 h-3" />
 </button>

 {/* Checkbox */}
 <button
 type="button"
 onClick={() => onUpdate({ done: !item.done })}
 aria-label={item.done ? 'Mark not done' : 'Mark done'}
 className="shrink-0"
 >
 {item.done ? (
 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
 ) : (
 <CircleDashed className="w-4 h-4 text-text-muted hover:text-studio-400" />
 )}
 </button>

 {/* Label — input that saves on blur / Enter */}
 <input
 type="text"
 value={item.label}
 onChange={(e) => onUpdate({ label: e.target.value })}
 placeholder="Item label…"
 className={`flex-1 min-w-0 bg-transparent text-[13px] focus:outline-none ${
 item.done
 ? 'line-through text-text-muted'
 : 'text-text-primary'
 }`}
 />

 {/* Delete */}
 <button
 type="button"
 onClick={onDelete}
 aria-label="Delete"
 className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-400/70 hover:text-rose-400"
 >
 <Trash2 className="w-3 h-3" />
 </button>
 </motion.div>
 );
}
