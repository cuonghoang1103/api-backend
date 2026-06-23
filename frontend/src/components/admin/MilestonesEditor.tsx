'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, Calendar, ImageIcon } from 'lucide-react';
import {
 DndContext,
 closestCenter,
 KeyboardSensor,
 PointerSensor,
 useSensor,
 useSensors,
 DragEndEvent,
} from '@dnd-kit/core';
import {
 arrayMove,
 SortableContext,
 sortableKeyboardCoordinates,
 useSortable,
 verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import type { ProjectMilestone } from '@/types';

interface MilestonesEditorProps {
 milestones: ProjectMilestone[];
 onChange: (next: ProjectMilestone[]) => void;
}

/**
 * MilestonesEditor — drag-reorderable list. Each item has
 * phase, title, description, date, imageUrl. The image
 * upload piggybacks on fileApi.upload (R2) so admins can
 * drop a screenshot of each milestone right from the
 * browser.
 *
 * `onChange` fires on every edit so the parent can persist
 * (autosave debounce 2s).
 */
export default function MilestonesEditor({ milestones, onChange }: MilestonesEditorProps) {
 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
 );

 const onDragEnd = (e: DragEndEvent) => {
 const { active, over } = e;
 if (!over || active.id === over.id) return;
 const oldIdx = milestones.findIndex((m) => m.id === active.id);
 const newIdx = milestones.findIndex((m) => m.id === over.id);
 if (oldIdx < 0 || newIdx < 0) return;
 const next = arrayMove(milestones, oldIdx, newIdx).map((m, i) => ({ ...m, order: i }));
 onChange(next);
 };

 const update = (id: number, patch: Partial<ProjectMilestone>) => {
 onChange(milestones.map((m) => (m.id === id ? { ...m, ...patch } : m)));
 };

 const remove = (id: number) => {
 onChange(milestones.filter((m) => m.id !== id));
 };

 const add = () => {
 const nextOrder = milestones.length;
 onChange([
 ...milestones,
 {
 id: -Date.now(), // negative to mark as unsaved (server will assign real id)
 phase: 'PHASE',
 title: 'Giai đoạn mới',
 description: '',
 order: nextOrder,
 },
 ]);
 };

 return (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <p className="text-xs text-text-muted">{milestones.length} mốc</p>
 <button
 type="button"
 onClick={add}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-violet/15 text-neon-violet text-xs font-medium hover:bg-neon-violet/25 transition-colors"
 >
 <Plus className="w-3.5 h-3.5" />
 Thêm mốc
 </button>
 </div>

 {milestones.length === 0 ? (
 <p className="text-xs text-text-muted italic text-center py-6 border border-dashed border-darkborder rounded-xl">
 Chưa có mốc phát triển nào. Nhấn "Thêm mốc" để bắt đầu.
 </p>
 ) : (
 <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
 <SortableContext items={milestones.map((m) => m.id)} strategy={verticalListSortingStrategy}>
 <ul className="space-y-2">
 {milestones.map((m) => (
 <SortableMilestone
 key={m.id}
 milestone={m}
 onUpdate={(patch) => update(m.id, patch)}
 onRemove={() => remove(m.id)}
 />
 ))}
 </ul>
 </SortableContext>
 </DndContext>
 )}
 </div>
 );
}

function SortableMilestone({
 milestone,
 onUpdate,
 onRemove,
}: {
 milestone: ProjectMilestone;
 onUpdate: (patch: Partial<ProjectMilestone>) => void;
 onRemove: () => void;
}) {
 const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
 id: milestone.id,
 });

 const style: React.CSSProperties = {
 transform: CSS.Transform.toString(transform),
 transition,
 opacity: isDragging ? 0.5 : 1,
 };

 return (
 <motion.li
 ref={setNodeRef}
 style={style}
 layout
 className="rounded-xl border border-darkborder bg-darkbg/60 p-4"
 >
 <div className="flex items-start gap-3">
 <button
 type="button"
 {...attributes}
 {...listeners}
 className="mt-1 p-1 text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing"
 title="Kéo để sắp xếp lại"
 >
 <GripVertical className="w-4 h-4" />
 </button>
 <div className="flex-1 space-y-3">
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
 <input
 type="text"
 value={milestone.phase ?? ''}
 onChange={(e) => onUpdate({ phase: e.target.value })}
 placeholder="PHASE"
 className="px-3 py-2 bg-darkcard border border-darkborder rounded-lg text-xs font-mono uppercase"
 />
 <input
 type="text"
 value={milestone.title}
 onChange={(e) => onUpdate({ title: e.target.value })}
 placeholder="Tiêu đề"
 className="col-span-2 sm:col-span-2 px-3 py-2 bg-darkcard border border-darkborder rounded-lg text-sm"
 />
 <input
 type="date"
 value={milestone.date?.slice(0, 10) ?? ''}
 onChange={(e) => onUpdate({ date: e.target.value })}
 className="px-3 py-2 bg-darkcard border border-darkborder rounded-lg text-xs"
 />
 </div>
 <textarea
 value={milestone.description ?? ''}
 onChange={(e) => onUpdate({ description: e.target.value })}
 placeholder="Mô tả ngắn..."
 rows={2}
 className="w-full px-3 py-2 bg-darkcard border border-darkborder rounded-lg text-xs resize-none"
 />
 <input
 type="url"
 value={milestone.imageUrl ?? ''}
 onChange={(e) => onUpdate({ imageUrl: e.target.value })}
 placeholder="URL ảnh minh hoạ (optional)"
 className="w-full px-3 py-2 bg-darkcard border border-darkborder rounded-lg text-xs"
 />
 </div>
 <button
 type="button"
 onClick={onRemove}
 className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
 title="Xóa"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </motion.li>
 );
}