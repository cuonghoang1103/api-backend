'use client';

// Editor Platforms tab — Phase 7.
//
// CRUD view for the project's platform posts — one
// row per (platform, scheduled time). Lets the user
// write platform-specific captions, add hashtags,
// mark as published (with a postUrl), and reorder
// the list. Like all the editor tabs, the data is
// persisted via the single project PUT — no per-row
// API calls.
//
// Layout: a column per platform the project targets.
// Each column has an "Add" CTA at the bottom and a
// list of scheduled posts.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Plus,
 Trash2,
 Link2,
 Hash,
 Clock,
 ExternalLink,
 CheckCircle2,
 CircleDashed,
 GripVertical,
 Send,
 Calendar,
 X,
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
import { PLATFORM_META } from '@/lib/studio-meta';
import type {
 ContentPlatform,
 ContentPlatformPost,
} from '@/types';

interface PlatformsTabProps {
 platforms: ContentPlatformPost[];
 onChange: (next: ContentPlatformPost[]) => void;
}

// All four platforms are always available — the user
// picks which ones this project targets by adding a
// row. Empty platforms just don't show up in the
// list.
const ALL_PLATFORMS: ContentPlatform[] = [
 'TIKTOK',
 'YOUTUBE',
 'FACEBOOK',
 'INSTAGRAM',
];

export default function PlatformsTab({
 platforms,
 onChange,
}: PlatformsTabProps) {
 // Active filter — defaults to "all" so the user
 // sees every platform at once.
 const [activeFilter, setActiveFilter] = useState<
 'ALL' | ContentPlatform
 >('ALL');

 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
 );

 const filtered = platforms
 .filter((p) => activeFilter === 'ALL' || p.platform === activeFilter)
 .sort((a, b) => a.order - b.order);

 const onAdd = (platform: ContentPlatform) => {
 const nextOrder = platforms.length > 0
 ? Math.max(...platforms.map((p) => p.order)) + 1
 : 0;
 onChange([
 ...platforms,
 {
 platform,
 caption: null,
 hashtags: [],
 scheduledTime: null,
 postUrl: null,
 isPublished: false,
 order: nextOrder,
 },
 ]);
 };

 const onUpdate = (idx: number, patch: Partial<ContentPlatformPost>) => {
 onChange(platforms.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
 };

 const onDelete = (idx: number) => {
 onChange(platforms.filter((_, i) => i !== idx));
 };

 const onReorder = (event: DragEndEvent) => {
 const { active, over } = event;
 if (!over || active.id === over.id) return;
 const oldIdx = filtered.findIndex((p) => String(p.id ?? p.order) === active.id);
 const newIdx = filtered.findIndex((p) => String(p.id ?? p.order) === over.id);
 if (oldIdx === -1 || newIdx === -1) return;
 // Reorder the filtered list, then merge back into
 // the unfiltered list (preserving platforms that
 // weren't in the filter).
 const reordered = arrayMove(filtered, oldIdx, newIdx).map((p, i) => ({
 ...p,
 order: i,
 }));
 // Replace the reordered items in the source list.
 const other = platforms.filter(
 (p) => !filtered.some((f) => f.id === p.id && f.platform === p.platform),
 );
 onChange([...other, ...reordered]);
 };

 // Per-platform count for the filter chips.
 const countByPlatform = platforms.reduce<Record<string, number>>(
 (acc, p) => {
 acc[p.platform] = (acc[p.platform] ?? 0) + 1;
 return acc;
 },
 {},
 );

 return (
 <div className="space-y-4">
 {/* Filter chips */}
 <div className="flex items-center gap-2 overflow-x-auto pb-1">
 <FilterChip
 active={activeFilter === 'ALL'}
 label="All"
 count={platforms.length}
 onClick={() => setActiveFilter('ALL')}
 />
 {ALL_PLATFORMS.map((p) => {
 const meta = PLATFORM_META[p];
 const count = countByPlatform[p] ?? 0;
 return (
 <FilterChip
 key={p}
 active={activeFilter === p}
 label={meta.label}
 color={meta.color}
 count={count}
 onClick={() => setActiveFilter(p)}
 />
 );
 })}
 </div>

 {/* Empty state per platform (when filter shows 0) */}
 {filtered.length === 0 ? (
 <div className="text-center py-12">
 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-studio-500/10 ring-1 ring-studio-500/20 mb-4">
 <Send className="w-7 h-7 text-studio-400/60" />
 </div>
 <h3 className="text-base font-semibold text-text-primary">
 No {activeFilter === 'ALL' ? 'posts' : PLATFORM_META[activeFilter].label + ' posts'} yet
 </h3>
 <p className="mt-1 text-sm text-text-secondary max-w-sm mx-auto">
 Add a row below to schedule a caption + publish time for this platform.
 </p>
 </div>
 ) : (
 <DndContext
 sensors={sensors}
 collisionDetection={closestCenter}
 onDragEnd={onReorder}
 >
 <SortableContext
 items={filtered.map((p) => String(p.id ?? p.order))}
 strategy={verticalListSortingStrategy}
 >
 <div className="space-y-2">
 <AnimatePresence mode="popLayout">
 {filtered.map((post, idx) => {
 const realIdx = platforms.findIndex(
 (p) =>
 p.id === post.id &&
 p.platform === post.platform,
 );
 return (
 <SortablePostRow
 key={String(post.id ?? `${post.platform}-${post.order}`)}
 post={post}
 onUpdate={(patch) => onUpdate(realIdx, patch)}
 onDelete={() => onDelete(realIdx)}
 />
 );
 })}
 </AnimatePresence>
 </div>
 </SortableContext>
 </DndContext>
 )}

 {/* Add row — one button per platform */}
 <div className="pt-3 border-t border-studio-500/10">
 <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">
 Add a new post:
 </div>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
 {ALL_PLATFORMS.map((p) => {
 const meta = PLATFORM_META[p];
 return (
 <button
 key={p}
 type="button"
 onClick={() => onAdd(p)}
 className="inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-studio-500/10 hover:bg-studio-500/20 text-studio-300 text-xs font-semibold transition-colors"
 >
 <Plus className="w-3.5 h-3.5" />
 {meta.label}
 </button>
 );
 })}
 </div>
 </div>
 </div>
 );
}

// ─── Sortable row ────────────────────────────────────────────────
function SortablePostRow({
 post,
 onUpdate,
 onDelete,
}: {
 post: ContentPlatformPost;
 onUpdate: (patch: Partial<ContentPlatformPost>) => void;
 onDelete: () => void;
}) {
 const {
 attributes,
 listeners,
 setNodeRef,
 transform,
 transition,
 isDragging,
 } = useSortable({ id: String(post.id ?? post.order) });

 const style: React.CSSProperties = {
 transform: CSS.Transform.toString(transform),
 transition,
 opacity: isDragging ? 0.6 : 1,
 };

 const meta = PLATFORM_META[post.platform];
 const [tagDraft, setTagDraft] = useState('');

 const addTag = () => {
 const t = tagDraft.trim().toLowerCase();
 if (!t) return;
 if (post.hashtags.includes(t)) {
 setTagDraft('');
 return;
 }
 onUpdate({ hashtags: [...post.hashtags, t] });
 setTagDraft('');
 };

 const removeTag = (tag: string) => {
 onUpdate({ hashtags: post.hashtags.filter((h) => h !== tag) });
 };

 return (
 <motion.div
 ref={setNodeRef}
 style={style}
 layout
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.96 }}
 transition={{ duration: 0.2 }}
 className="studio-glass rounded-xl p-3 sm:p-4 shadow-studio-card"
 >
 <div className="flex items-start gap-2 sm:gap-3">
 {/* Drag handle */}
 <button
 type="button"
 {...attributes}
 {...listeners}
 aria-label="Drag to reorder"
 className="hidden sm:inline-flex items-center justify-center w-7 h-7 rounded-md text-text-muted hover:text-text-primary hover:bg-studio-500/15 cursor-grab active:cursor-grabbing shrink-0 mt-1"
 >
 <GripVertical className="w-3.5 h-3.5" />
 </button>

 {/* Platform badge */}
 <div
 className="inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0 mt-0.5"
 style={{ backgroundColor: `${meta.color}25`, color: meta.color }}
 >
 <Send className="w-4 h-4" />
 </div>

 {/* Body */}
 <div className="flex-1 min-w-0 space-y-2">
 {/* Top row: platform + status + delete */}
 <div className="flex items-center gap-2">
 <span
 className="inline-flex items-center gap-1 px-2 h-5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
 style={{ backgroundColor: `${meta.color}25`, color: meta.color }}
 >
 {meta.label}
 </span>
 <PublishToggle
 published={post.isPublished}
 onChange={(v) => onUpdate({ isPublished: v })}
 />
 <div className="flex-1" />
 <button
 type="button"
 onClick={onDelete}
 aria-label="Delete"
 className="inline-flex items-center justify-center w-7 h-7 rounded-md text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </div>

 {/* Caption */}
 <textarea
 value={post.caption ?? ''}
 onChange={(e) => onUpdate({ caption: e.target.value || null })}
 placeholder="Caption for this platform…"
 rows={3}
 className="w-full px-3 py-2 rounded-lg bg-bg-elevated/40 ring-1 ring-studio-500/10 focus:ring-studio-500/40 focus:outline-none text-sm text-text-primary placeholder:text-text-muted resize-none"
 />

 {/* Hashtags */}
 <div>
 <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-muted mb-1">
 <Hash className="w-3 h-3" />
 Hashtags
 </div>
 <div className="flex flex-wrap items-center gap-1.5">
 {post.hashtags.map((tag) => (
 <span
 key={tag}
 className="inline-flex items-center gap-1 px-2 h-6 rounded-md bg-studio-500/10 text-studio-300 text-[11px] font-medium"
 >
 #{tag}
 <button
 type="button"
 onClick={() => removeTag(tag)}
 aria-label={`Remove ${tag}`}
 className="ml-0.5 -mr-1 w-3.5 h-3.5 inline-flex items-center justify-center text-studio-400 hover:text-studio-200"
 >
 <X className="w-2.5 h-2.5" />
 </button>
 </span>
 ))}
 <input
 type="text"
 value={tagDraft}
 onChange={(e) => setTagDraft(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === 'Enter' || e.key === ',') {
 e.preventDefault();
 addTag();
 }
 }}
 placeholder="add tag…"
 className="inline-block w-24 h-6 px-2 bg-transparent text-[11px] text-text-primary placeholder:text-text-muted focus:outline-none border-b border-dashed border-studio-500/20 focus:border-studio-500/40"
 />
 </div>
 </div>

 {/* Schedule + postUrl (single row on desktop) */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-elevated/40 ring-1 ring-studio-500/10">
 <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
 <input
 type="datetime-local"
 value={
 post.scheduledTime
 ? toLocalDatetime(post.scheduledTime)
 : ''
 }
 onChange={(e) =>
 onUpdate({
 scheduledTime: e.target.value
 ? new Date(e.target.value).toISOString()
 : null,
 })
 }
 className="w-full bg-transparent text-sm text-text-primary focus:outline-none"
 />
 </label>
 <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-elevated/40 ring-1 ring-studio-500/10">
 <Link2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
 <input
 type="url"
 value={post.postUrl ?? ''}
 onChange={(e) =>
 onUpdate({ postUrl: e.target.value || null })
 }
 placeholder="Post URL (after publish)"
 className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
 />
 {post.postUrl && (
 <a
 href={post.postUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="text-studio-400 hover:text-studio-300"
 >
 <ExternalLink className="w-3.5 h-3.5" />
 </a>
 )}
 </label>
 </div>
 </div>
 </div>
 </motion.div>
 );
}

// ─── Helpers ─────────────────────────────────────────────────────

function FilterChip({
 active,
 label,
 count,
 color,
 onClick,
}: {
 active: boolean;
 label: string;
 count: number;
 color?: string;
 onClick: () => void;
}) {
 return (
 <button
 type="button"
 onClick={onClick}
 className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-colors ${
 active
 ? 'bg-studio-500/20 text-studio-200 ring-1 ring-studio-500/30'
 : 'bg-bg-elevated/60 text-text-muted hover:text-text-primary ring-1 ring-studio-500/15'
 }`}
 >
 {color && (
 <span
 className="w-2 h-2 rounded-full"
 style={{ backgroundColor: color }}
 />
 )}
 {label}
 <span
 className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] ${
 active ? 'bg-studio-500 text-bg-base' : 'bg-bg-base/50 text-text-muted'
 }`}
 >
 {count}
 </span>
 </button>
 );
}

function PublishToggle({
 published,
 onChange,
}: {
 published: boolean;
 onChange: (v: boolean) => void;
}) {
 return (
 <button
 type="button"
 onClick={() => onChange(!published)}
 className={`inline-flex items-center gap-1 px-2 h-5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors ${
 published
 ? 'bg-emerald-500/15 text-emerald-300'
 : 'bg-bg-elevated/60 text-text-muted'
 }`}
 >
 {published ? (
 <CheckCircle2 className="w-3 h-3" />
 ) : (
 <CircleDashed className="w-3 h-3" />
 )}
 {published ? 'Published' : 'Draft'}
 </button>
 );
}

// `datetime-local` wants a value in the form
// `YYYY-MM-DDTHH:mm` in the LOCAL timezone. The DB
// stores ISO strings (UTC). This converts one to the
// other.
function toLocalDatetime(iso: string): string {
 const d = new Date(iso);
 if (isNaN(d.getTime())) return '';
 const pad = (n: number) => String(n).padStart(2, '0');
 return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
