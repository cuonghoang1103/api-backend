'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, Calendar, ImageIcon, Code2, ChevronDown, ChevronUp } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectMilestone } from '@/types';

// Same language set used by the case-study "Database Schema"
// section (ProjectEditor.tsx → SCHEMA_LANGS). Re-declared
// locally to keep this editor self-contained — duplicating
// the 7-entry list is cheaper than introducing a shared
// constants file for a single consumer.
const CODE_LANGS = [
 'prisma',
 'sql',
 'typescript',
 'javascript',
 'json',
 'yaml',
 'plaintext',
];

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
 {/*
 ─── Code review block ───
 Toggle that opens/closes a code editor for the
 milestone. The textarea stores the raw code; the
 select picks the language for syntax highlighting on
 the public page. Both fields are stored verbatim on
 the milestone row (codeBlock + codeLang). The
 collapsed-by-default state keeps the editor compact
 when the admin doesn't want to add a code review.
 */}
 <CodeBlockEditor
 codeBlock={milestone.codeBlock}
 codeLang={milestone.codeLang}
 onUpdate={onUpdate}
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

// ─────────────────────────────────────────────────────────────────
// CodeBlockEditor — collapsible "Code review" sub-section that
// lives below the milestone description. When the milestone
// has no `codeBlock` and isn't expanded, the editor only shows
// a single "+ Code review" toggle. Once expanded, it reveals a
// language selector + monospace textarea. The textarea uses a
// local mirror state (same pattern as the ListItemEditor
// content input) to keep the cursor stable while typing — the
// parent's onUpdate rewrites the whole milestone object on
// every keystroke which would otherwise flicker the input.
// ─────────────────────────────────────────────────────────────────
function CodeBlockEditor({
 codeBlock,
 codeLang,
 onUpdate,
}: {
 codeBlock: string | undefined;
 codeLang: string | undefined;
 onUpdate: (patch: Partial<ProjectMilestone>) => void;
}) {
 // Auto-expand if the milestone already has code from a
 // previous save so the admin sees the existing content
 // without having to click the toggle.
 const [open, setOpen] = useState<boolean>(Boolean(codeBlock));
 const [localCode, setLocalCode] = useState(codeBlock ?? '');
 const [isFocused, setIsFocused] = useState(false);

 if (!isFocused && localCode !== (codeBlock ?? '')) {
 setLocalCode(codeBlock ?? '');
 }

 const lang = codeLang ?? 'plaintext';

 return (
 <div className="rounded-lg border border-darkborder/60 bg-darkcard/40">
 <button
 type="button"
 onClick={() => setOpen((v) => !v)}
 className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-text-muted hover:text-text-primary transition-colors"
 >
 <span className="inline-flex items-center gap-1.5">
 <Code2 className="w-3.5 h-3.5" />
 {codeBlock ? 'Code review' : 'Thêm code review'}
 {codeBlock && (
 <span className="text-[10px] text-text-muted">
 · {codeLang ?? 'plaintext'} · {codeBlock.length} chars
 </span>
 )}
 </span>
 {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
 </button>
 <AnimatePresence initial={false}>
 {open && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.18 }}
 className="overflow-hidden"
 >
 <div className="px-3 pb-3 space-y-2">
 <div className="flex items-center gap-2">
 <label className="text-[10px] text-text-muted uppercase">Ngôn ngữ</label>
 <select
 value={lang}
 onChange={(e) => onUpdate({ codeLang: e.target.value })}
 className="px-2 py-1 bg-darkcard border border-darkborder rounded text-xs"
 >
 {CODE_LANGS.map((l) => (
 <option key={l} value={l}>{l}</option>
 ))}
 </select>
 </div>
 <textarea
 value={localCode}
 onFocus={() => setIsFocused(true)}
 onBlur={() => {
 setIsFocused(false);
 if (localCode !== (codeBlock ?? '')) {
 onUpdate({ codeBlock: localCode });
 }
 }}
 onChange={(e) => {
 const v = e.target.value;
 setLocalCode(v);
 onUpdate({ codeBlock: v });
 }}
 placeholder="Dán code để hiển thị syntax-highlighted trên trang case study..."
 rows={6}
 className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded text-xs font-mono text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:border-neon-violet/50 transition-colors"
 />
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}