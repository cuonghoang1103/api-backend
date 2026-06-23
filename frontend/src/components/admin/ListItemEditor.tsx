'use client';

// ─────────────────────────────────────────────────────────────────
// ListItemEditor — shared editor for the three "list of strings"
// sections (Core Knowledge / Portfolio Bonus / Completion
// Outcomes). All three share the same shape (an id + content +
// order) and the same UI, so a single component instance is
// rendered per kind with the `kind` discriminator passed in.
//
// The parent owns persistence: the editor only emits the
// updated list via `onChange` and never calls the API directly.
// `saveFn` + dirty-state lives in the parent's SaveableSection.
//
// Drag-reorder via @dnd-kit (same as MilestonesEditor /
// FeaturesEditor / ResourcesEditor) so the experience is
// consistent across all child-entity editors in the project
// editor.
// ─────────────────────────────────────────────────────────────────

import { useState } from 'react';
import {
 DndContext,
 closestCenter,
 KeyboardSensor,
 PointerSensor,
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
import { motion } from 'framer-motion';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import type { ProjectListItem, ProjectListKind } from '@/types';

export interface ListItemEditorProps {
 items: ProjectListItem[];
 kind: ProjectListKind;
 onChange: (next: ProjectListItem[]) => void;
}

// Placeholder content picked per kind so the first item the
// admin adds is meaningful. Avoids the "Giai đoạn mới" default
// that the milestone / feature editors use.
const KIND_PLACEHOLDERS: Record<ProjectListKind, string> = {
 CORE_KNOWLEDGE: 'VD: React Server Components vs Client Components',
 PORTFOLIO_BONUS: 'VD: Live demo trên Vercel',
 COMPLETION_OUTCOME: 'VD: Triển khai CRUD đầy đủ với Next.js',
};

export default function ListItemEditor({ items, kind, onChange }: ListItemEditorProps) {
 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
 );

 // ─── drag-end handler ───
 // Reorder the items array and rewrite each item's `order`
 // to match its new index in the array. The `order` field
 // is what the server uses for stable sort, so keeping it
 // in sync with the array index keeps the public page in
 // the same order as the editor.
 const onDragEnd = (event: DragEndEvent) => {
 const { active, over } = event;
 if (!over || active.id === over.id) return;
 const oldIndex = items.findIndex((i) => i.id === active.id);
 const newIndex = items.findIndex((i) => i.id === over.id);
 if (oldIndex < 0 || newIndex < 0) return;
 const next = arrayMove(items, oldIndex, newIndex).map((it, idx) => ({ ...it, order: idx }));
 onChange(next);
 };

 const update = (id: number, patch: Partial<ProjectListItem>) => {
 onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
 };

 const remove = (id: number) => {
 onChange(items.filter((it) => it.id !== id));
 };

 // New item: negative id so saveChildList knows to POST
 // rather than PUT. The server assigns the real id on
 // create.
 const add = () => {
 const nextOrder = items.length;
 const newItem: ProjectListItem = {
 id: -Date.now(),
 kind,
 content: '',
 order: nextOrder,
 };
 onChange([...items, newItem]);
 };

 return (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <p className="text-xs text-text-muted">
 {items.length} mục
 </p>
 <button
 type="button"
 onClick={add}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-violet/15 text-neon-violet text-xs font-medium hover:bg-neon-violet/25 transition-colors"
 >
 <Plus className="w-3.5 h-3.5" />
 Thêm mục
 </button>
 </div>

 {items.length === 0 ? (
 <p className="text-xs text-text-muted italic text-center py-6 border border-dashed border-darkborder rounded-xl">
 Chưa có mục nào. Nhấn "Thêm mục" để bắt đầu.
 </p>
 ) : (
 <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
 <SortableContext
 items={items.map((i) => i.id)}
 strategy={verticalListSortingStrategy}
 >
 <ul className="space-y-2">
 {items.map((it) => (
 <SortableRow
 key={it.id}
 item={it}
 placeholder={KIND_PLACEHOLDERS[kind]}
 onUpdate={(patch) => update(it.id, patch)}
 onRemove={() => remove(it.id)}
 />
 ))}
 </ul>
 </SortableContext>
 </DndContext>
 )}
 </div>
 );
}

function SortableRow({
 item,
 placeholder,
 onUpdate,
 onRemove,
}: {
 item: ProjectListItem;
 placeholder: string;
 onUpdate: (patch: Partial<ProjectListItem>) => void;
 onRemove: () => void;
}) {
 const {
 attributes,
 listeners,
 setNodeRef,
 transform,
 transition,
 isDragging,
 } = useSortable({ id: item.id });

 const style: React.CSSProperties = {
 transform: CSS.Transform.toString(transform),
 transition,
 opacity: isDragging ? 0.5 : 1,
 };

 // Local content state — we let the input be controlled so
 // typing doesn't cause an onChange storm (the parent's
 // onChange rewrites the array reference on every
 // keystroke, which in turn rerenders the dnd context).
 // We mirror the value locally to keep the cursor
 // position stable while typing.
 const [localContent, setLocalContent] = useState(item.content);
 const [isFocused, setIsFocused] = useState(false);

 // If the parent resets the list (e.g. revert) and the
 // canonical content differs from the local mirror, snap
 // back. We only do this while the input is NOT focused
 // to avoid clobbering the user mid-typing.
 if (!isFocused && localContent !== item.content) {
 setLocalContent(item.content);
 }

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
 title="Kéo để sắp xếp lại"
 >
 <GripVertical className="w-4 h-4" />
 </button>
 <input
 type="text"
 value={localContent}
 placeholder={placeholder}
 onFocus={() => setIsFocused(true)}
 onBlur={() => {
 setIsFocused(false);
 // Commit on blur in case the user typed and didn't
 // propagate (focus-blur before the controlled sync).
 if (localContent !== item.content) {
 onUpdate({ content: localContent });
 }
 }}
 onChange={(e) => {
 const v = e.target.value;
 setLocalContent(v);
 onUpdate({ content: v });
 }}
 className="flex-1 px-3 py-2 rounded-lg bg-darkcard border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
 maxLength={500}
 />
 <button
 type="button"
 onClick={onRemove}
 className="mt-1.5 p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
 title="Xóa"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </div>
 </motion.li>
 );
}
