'use client';

import { Plus, Trash2, GripVertical, CheckCircle2, Hammer, CircleDashed } from 'lucide-react';
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
import type { ProjectFeature, ProjectFeatureStatus } from '@/types';

interface FeaturesEditorProps {
 features: ProjectFeature[];
 onChange: (next: ProjectFeature[]) => void;
}

const STATUSES: { value: ProjectFeatureStatus; label: string; pill: string; icon: typeof CheckCircle2 }[] = [
 { value: 'DONE', label: 'Hoàn thành', pill: 'bg-emerald-500/20 text-emerald-300', icon: CheckCircle2 },
 { value: 'IN_PROGRESS', label: 'Đang làm', pill: 'bg-yellow-500/20 text-yellow-300', icon: Hammer },
 { value: 'PLANNED', label: 'Kế hoạch', pill: 'bg-blue-500/20 text-blue-300', icon: CircleDashed },
];

/**
 * FeaturesEditor — drag-reorderable list grouped by status
 * (DONE / IN_PROGRESS / PLANNED). Each item has title and
 * description; the parent decides where it lives by
 * editing `status`.
 */
export default function FeaturesEditor({ features, onChange }: FeaturesEditorProps) {
 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
 );

 const onDragEnd = (e: DragEndEvent) => {
 const { active, over } = e;
 if (!over || active.id === over.id) return;
 const oldIdx = features.findIndex((f) => f.id === active.id);
 const newIdx = features.findIndex((f) => f.id === over.id);
 if (oldIdx < 0 || newIdx < 0) return;
 const next = arrayMove(features, oldIdx, newIdx).map((f, i) => ({ ...f, order: i }));
 onChange(next);
 };

 const update = (id: number, patch: Partial<ProjectFeature>) => {
 onChange(features.map((f) => (f.id === id ? { ...f, ...patch } : f)));
 };

 const remove = (id: number) => {
 onChange(features.filter((f) => f.id !== id));
 };

 const add = () => {
 const nextOrder = features.length;
 onChange([
 ...features,
 {
 id: -Date.now(),
 title: 'Tính năng mới',
 description: '',
 status: 'PLANNED',
 order: nextOrder,
 },
 ]);
 };

 return (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <p className="text-xs text-text-muted">{features.length} tính năng</p>
 <button
 type="button"
 onClick={add}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-violet/15 text-neon-violet text-xs font-medium hover:bg-neon-violet/25 transition-colors"
 >
 <Plus className="w-3.5 h-3.5" />
 Thêm tính năng
 </button>
 </div>

 {features.length === 0 ? (
 <p className="text-xs text-text-muted italic text-center py-6 border border-dashed border-darkborder rounded-xl">
 Chưa có tính năng nào.
 </p>
 ) : (
 <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
 <SortableContext items={features.map((f) => f.id)} strategy={verticalListSortingStrategy}>
 <ul className="space-y-2">
 {features.map((f) => (
 <SortableFeature
 key={f.id}
 feature={f}
 onUpdate={(patch) => update(f.id, patch)}
 onRemove={() => remove(f.id)}
 />
 ))}
 </ul>
 </SortableContext>
 </DndContext>
 )}
 </div>
 );
}

function SortableFeature({
 feature,
 onUpdate,
 onRemove,
}: {
 feature: ProjectFeature;
 onUpdate: (patch: Partial<ProjectFeature>) => void;
 onRemove: () => void;
}) {
 const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
 id: feature.id,
 });

 const style: React.CSSProperties = {
 transform: CSS.Transform.toString(transform),
 transition,
 opacity: isDragging ? 0.5 : 1,
 };

 const currentStatus = STATUSES.find((s) => s.value === feature.status) ?? STATUSES[2];

 return (
 <motion.li
 ref={setNodeRef}
 style={style}
 layout
 className="rounded-xl border border-darkborder bg-darkbg/60 p-3"
 >
 <div className="flex items-start gap-3">
 <button
 type="button"
 {...attributes}
 {...listeners}
 className="mt-2 p-1 text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing"
 >
 <GripVertical className="w-4 h-4" />
 </button>
 <currentStatus.icon className="w-4 h-4 mt-2.5 flex-shrink-0" />
 <div className="flex-1 space-y-2">
 <div className="flex items-center gap-2">
 <input
 type="text"
 value={feature.title}
 onChange={(e) => onUpdate({ title: e.target.value })}
 placeholder="Tên tính năng"
 className="flex-1 px-3 py-1.5 bg-darkcard border border-darkborder rounded-lg text-sm"
 />
 <select
 value={feature.status}
 onChange={(e) => onUpdate({ status: e.target.value as ProjectFeatureStatus })}
 className={`px-2.5 py-1.5 rounded-lg text-xs border border-darkborder cursor-pointer ${currentStatus.pill}`}
 >
 {STATUSES.map((s) => (
 <option key={s.value} value={s.value}>{s.label}</option>
 ))}
 </select>
 </div>
 <textarea
 value={feature.description ?? ''}
 onChange={(e) => onUpdate({ description: e.target.value })}
 placeholder="Mô tả ngắn (optional)..."
 rows={1}
 className="w-full px-3 py-1.5 bg-darkcard border border-darkborder rounded-lg text-xs resize-none"
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