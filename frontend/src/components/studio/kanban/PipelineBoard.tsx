'use client';

// PipelineBoard — the full kanban surface. Owns the
// DndContext, the optimistic status updates, and the
// (very simple) "drop a card into a different column →
// update its status" behaviour.
//
// What this is NOT doing (yet):
// • Cross-column re-ordering of the same card. The DnD
// lib supports it but the API only models "one project
// = one status" so we collapse it to status change.
// • Persistence of the column order. The column order is
// fixed (STATUS_ORDER from studio-meta) so the visual
// flow is always the same.

import { useState, useMemo, useEffect } from 'react';
import {
 DndContext,
 DragOverlay,
 PointerSensor,
 KeyboardSensor,
 useSensor,
 useSensors,
 closestCorners,
 type DragEndEvent,
 type DragStartEvent,
} from '@dnd-kit/core';
import {
 SortableContext,
 sortableKeyboardCoordinates,
 horizontalListSortingStrategy,
 verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Search } from 'lucide-react';
import KanbanCard from './KanbanCard';
import KanbanColumn from './KanbanColumn';
import StatusPill from '@/components/studio/StatusPill';
import { useContentProjects, useUpdateContentStatus } from '@/hooks/useContentQueries';
import { STATUS_ORDER, CONTENT_STATUS_META } from '@/lib/studio-meta';
import type { ContentProjectSummary, ContentStatus } from '@/types';

export default function PipelineBoard() {
 const { data: projects = [], isLoading } = useContentProjects();
 const updateStatus = useUpdateContentStatus();
 const [activeId, setActiveId] = useState<number | null>(null);
 const [query, setQuery] = useState('');

 // 4px activation distance prevents accidental drags when
 // the user just wants to click through to the editor.
 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
 );

 // Group projects by status. Memoised on (projects, query)
 // so the columns only re-shuffle when either actually
 // changes.
 const byStatus = useMemo(() => {
 const groups: Record<ContentStatus, ContentProjectSummary[]> = {
 IDEA: [], SCRIPTING: [], FILMING: [], EDITING: [], SCHEDULED: [], PUBLISHED: [],
 };
 const q = query.trim().toLowerCase();
 for (const p of projects) {
 if (q && !p.title.toLowerCase().includes(q) && !p.tags.some((t) => t.toLowerCase().includes(q))) {
 continue;
 }
 groups[p.status].push(p);
 }
 return groups;
 }, [projects, query]);

 // Pre-sort each column by filmDate asc (or by updatedAt
 // desc if no filmDate). The user can re-arrange within
 // a column by drag later if we expose it.
 const sortedByStatus = useMemo(() => {
 const out: Record<ContentStatus, ContentProjectSummary[]> = { ...byStatus };
 for (const s of STATUS_ORDER) {
 out[s] = [...byStatus[s]].sort((a, b) => {
 if (a.filmDate && b.filmDate) {
 return new Date(a.filmDate).getTime() - new Date(b.filmDate).getTime();
 }
 if (a.filmDate) return -1;
 if (b.filmDate) return 1;
 return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
 });
 }
 return out;
 }, [byStatus]);

 const activeProject = activeId ? projects.find((p) => p.id === activeId) ?? null : null;

 const onDragStart = (e: DragStartEvent) => {
 const id = typeof e.active.id === 'number' ? e.active.id : parseInt(String(e.active.id), 10);
 setActiveId(Number.isFinite(id) ? id : null);
 };

 const onDragEnd = (e: DragEndEvent) => {
 setActiveId(null);
 const { active, over } = e;
 if (!over) return;

 const activeIdNum =
 typeof active.id === 'number' ? active.id : parseInt(String(active.id), 10);
 if (!Number.isFinite(activeIdNum)) return;

 // Two cases:
 // 1. Dropped on a card — we adopt the target card's
 // status (so the moved card sits next to it).
 // 2. Dropped on a column — we adopt that column's
 // status. Both code paths land at the same: a
 // PATCH /:id/status with the new status.
 let newStatus: ContentStatus | null = null;
 const overData = over.data.current as { type?: string; status?: ContentStatus } | undefined;

 if (overData?.type === 'column' && overData.status) {
 newStatus = overData.status;
 } else if (overData?.type === 'card') {
 const targetId =
 typeof over.id === 'number' ? over.id : parseInt(String(over.id), 10);
 const target = projects.find((p) => p.id === targetId);
 if (target) newStatus = target.status;
 }

 if (!newStatus) return;
 const moving = projects.find((p) => p.id === activeIdNum);
 if (!moving || moving.status === newStatus) return;

 updateStatus.mutate({ id: activeIdNum, status: newStatus });
 };

 // Keyboard escape to clear the active drag.
 useEffect(() => {
 const handler = (e: KeyboardEvent) => {
 if (e.key === 'Escape') setActiveId(null);
 };
 window.addEventListener('keydown', handler);
 return () => window.removeEventListener('keydown', handler);
 }, []);

 if (isLoading) {
 return (
 <div className="flex items-center justify-center h-64 text-text-muted text-sm">
 <Film className="w-4 h-4 mr-2 animate-pulse" />
 Loading pipeline…
 </div>
 );
 }

 const totalVisible = STATUS_ORDER.reduce((a, s) => a + sortedByStatus[s].length, 0);

 return (
 <DndContext
 sensors={sensors}
 collisionDetection={closestCorners}
 onDragStart={onDragStart}
 onDragEnd={onDragEnd}
 onDragCancel={() => setActiveId(null)}
 >
 {/* Toolbar */}
 <div className="flex items-center justify-between gap-3 mb-4">
 <div className="flex items-center gap-2 flex-1 max-w-md">
 <div className="relative flex-1">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
 <input
 type="text"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder="Search title or #tag…"
 className="w-full pl-9 pr-3 h-9 rounded-lg bg-darkcard/60 border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50 focus:ring-2 focus:ring-studio-500/20"
 />
 </div>
 <span className="text-xs text-text-muted whitespace-nowrap">
 {totalVisible} / {projects.length} project{projects.length === 1 ? '' : 's'}
 </span>
 </div>
 <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-text-muted">
 <kbd className="px-1.5 h-5 rounded bg-darkcard border border-darkborder text-[10px]">drag</kbd>
 to move across stages
 </div>
 </div>

 {/* The board — horizontal scroll on small screens */}
 <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6">
 <SortableContext
 items={STATUS_ORDER.map((s) => `column-${s}`)}
 strategy={horizontalListSortingStrategy}
 >
 {STATUS_ORDER.map((status) => (
 <KanbanColumn
 key={status}
 status={status}
 count={sortedByStatus[status].length}
 >
 <SortableContext
 items={sortedByStatus[status].map((p) => p.id)}
 strategy={verticalListSortingStrategy}
 >
 <AnimatePresence>
 {sortedByStatus[status].map((p, i) => (
 <KanbanCard key={p.id} project={p} index={i} />
 ))}
 </AnimatePresence>
 </SortableContext>
 </KanbanColumn>
 ))}
 </SortableContext>
 </div>

 {/* Drag overlay — renders the floating card while
 dragging. Without it the card would snap to the
 cursor at full opacity. */}
 <DragOverlay>
 {activeProject ? (
 <div className="w-72">
 <div className="rounded-xl border border-studio-500/40 bg-darkcard shadow-[0_24px_60px_rgba(0,0,0,0.55),0_0_50px_rgba(245,158,11,0.18)] p-3">
 <p className="text-sm font-medium text-text-primary line-clamp-2 leading-snug">
 {activeProject.title}
 </p>
 <div className="flex items-center gap-1.5 mt-2">
 <StatusPill status={activeProject.status} size="xs" />
 <span className="text-[10px] text-text-muted">dragging…</span>
 </div>
 </div>
 </div>
 ) : null}
 </DragOverlay>
 </DndContext>
 );
}
