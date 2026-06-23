'use client';

import { Plus, Trash2, GripVertical, FileText, FileCode2, Github, ExternalLink, Link2 } from 'lucide-react';
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
import type { ProjectResource, ProjectResourceType } from '@/types';

interface ResourcesEditorProps {
 resources: ProjectResource[];
 onChange: (next: ProjectResource[]) => void;
}

const TYPES: { value: ProjectResourceType; label: string }[] = [
 { value: 'LINK', label: 'Link' },
 { value: 'PDF', label: 'PDF' },
 { value: 'DOC', label: 'Doc' },
 { value: 'REPO', label: 'Repo' },
 { value: 'OTHER', label: 'Khác' },
];

/**
 * ResourcesEditor — drag-reorderable list. Each resource
 * has type (PDF/DOC/REPO/LINK/OTHER), title, URL, optional
 * description and file size. The type drives the icon
 * shown in the public detail page, so admins should
 * pick the type that best matches the link target.
 */
export default function ResourcesEditor({ resources, onChange }: ResourcesEditorProps) {
 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
 );

 const onDragEnd = (e: DragEndEvent) => {
 const { active, over } = e;
 if (!over || active.id === over.id) return;
 const oldIdx = resources.findIndex((r) => r.id === active.id);
 const newIdx = resources.findIndex((r) => r.id === over.id);
 if (oldIdx < 0 || newIdx < 0) return;
 const next = arrayMove(resources, oldIdx, newIdx).map((r, i) => ({ ...r, order: i }));
 onChange(next);
 };

 const update = (id: number, patch: Partial<ProjectResource>) => {
 onChange(resources.map((r) => (r.id === id ? { ...r, ...patch } : r)));
 };

 const remove = (id: number) => {
 onChange(resources.filter((r) => r.id !== id));
 };

 const add = () => {
 const nextOrder = resources.length;
 onChange([
 ...resources,
 {
 id: -Date.now(),
 title: 'Tài nguyên mới',
 url: 'https://',
 type: 'LINK',
 order: nextOrder,
 },
 ]);
 };

 return (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <p className="text-xs text-text-muted">{resources.length} tài nguyên</p>
 <button
 type="button"
 onClick={add}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-violet/15 text-neon-violet text-xs font-medium hover:bg-neon-violet/25 transition-colors"
 >
 <Plus className="w-3.5 h-3.5" />
 Thêm tài nguyên
 </button>
 </div>

 {resources.length === 0 ? (
 <p className="text-xs text-text-muted italic text-center py-6 border border-dashed border-darkborder rounded-xl">
 Chưa có tài nguyên nào.
 </p>
 ) : (
 <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
 <SortableContext items={resources.map((r) => r.id)} strategy={verticalListSortingStrategy}>
 <ul className="space-y-2">
 {resources.map((r) => (
 <SortableResource
 key={r.id}
 resource={r}
 onUpdate={(patch) => update(r.id, patch)}
 onRemove={() => remove(r.id)}
 />
 ))}
 </ul>
 </SortableContext>
 </DndContext>
 )}
 </div>
 );
}

function SortableResource({
 resource,
 onUpdate,
 onRemove,
}: {
 resource: ProjectResource;
 onUpdate: (patch: Partial<ProjectResource>) => void;
 onRemove: () => void;
}) {
 const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
 id: resource.id,
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
 <div className="mt-2.5 flex-shrink-0">
 {resource.type === 'PDF' && <FileText className="w-4 h-4 text-rose-400" />}
 {resource.type === 'DOC' && <FileText className="w-4 h-4 text-blue-400" />}
 {resource.type === 'REPO' && <Github className="w-4 h-4" />}
 {resource.type === 'LINK' && <ExternalLink className="w-4 h-4 text-neon-violet" />}
 {resource.type === 'OTHER' && <FileCode2 className="w-4 h-4 text-text-muted" />}
 </div>
 <div className="flex-1 space-y-2">
 <div className="flex items-center gap-2 flex-wrap">
 <input
 type="text"
 value={resource.title}
 onChange={(e) => onUpdate({ title: e.target.value })}
 placeholder="Tiêu đề"
 className="flex-1 min-w-[200px] px-3 py-1.5 bg-darkcard border border-darkborder rounded-lg text-sm"
 />
 <select
 value={resource.type}
 onChange={(e) => onUpdate({ type: e.target.value as ProjectResourceType })}
 className="px-2.5 py-1.5 bg-darkcard border border-darkborder rounded-lg text-xs cursor-pointer"
 >
 {TYPES.map((t) => (
 <option key={t.value} value={t.value}>{t.label}</option>
 ))}
 </select>
 </div>
 <input
 type="url"
 value={resource.url}
 onChange={(e) => onUpdate({ url: e.target.value })}
 placeholder="https://..."
 className="w-full px-3 py-1.5 bg-darkcard border border-darkborder rounded-lg text-xs"
 />
 <textarea
 value={resource.description ?? ''}
 onChange={(e) => onUpdate({ description: e.target.value })}
 placeholder="Mô tả (optional)..."
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