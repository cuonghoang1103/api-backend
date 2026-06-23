'use client';

// Editor Storyboard tab — the production days + scenes
// editor. Two-level editing:
//
// 1. Days (the "when" + "where" of filming)
// 2. Scenes inside each day (the actual shot list)
//
// We do NOT expose per-scene POST/PUT/DELETE — the editor
// calls scheduleSave() with the full desired state, the
// server's `replaceChildren` does the diff. This is the
// "idempotent upsert" pattern from Phase 2.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Camera,
 ChevronDown,
 ChevronUp,
 MapPin,
 Plus,
 StickyNote,
 Trash2,
 GripVertical,
 X,
 Film,
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
import { SCENE_TYPE_META, SHOT_TYPE_META } from '@/lib/studio-meta';
import type {
 ContentProductionDay,
 ContentScene,
 SceneType,
 ShotType,
} from '@/types';

interface StoryboardTabProps {
 days: ContentProductionDay[];
 onChange: (days: ContentProductionDay[]) => void;
}

export default function StoryboardTab({ days, onChange }: StoryboardTabProps) {
 return (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <p className="text-xs text-text-muted">
 {days.length} day{days.length === 1 ? '' : 's'} · {days.reduce((a, d) => a + d.scenes.length, 0)} scene
 {days.reduce((a, d) => a + d.scenes.length, 0) === 1 ? '' : 's'}
 </p>
 <button
 type="button"
 onClick={() => {
 const nextOrder = days.length;
 onChange([
 ...days,
 {
 dayNumber: nextOrder + 1,
 date: null,
 location: null,
 notes: null,
 order: nextOrder,
 scenes: [],
 },
 ]);
 }}
 className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-studio-500/15 text-studio-300 text-xs font-medium hover:bg-studio-500/25 transition-colors"
 >
 <Plus className="w-3.5 h-3.5" />
 Add filming day
 </button>
 </div>

 {days.length === 0 ? (
 <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/30 p-10 text-center">
 <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-studio-500/15 mb-3">
 <Film className="w-6 h-6 text-studio-400" />
 </div>
 <p className="text-sm text-text-primary font-medium">No filming days yet</p>
 <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
 Add a day to start planning your shot list. Each day
 can hold any number of scenes with dialogue, voiceover,
 camera direction and duration.
 </p>
 </div>
 ) : (
 <SortableDays days={days} onChange={onChange} />
 )}
 </div>
 );
}

// ─── Day list (sortable) ──────────────────────────────────────

function SortableDays({ days, onChange }: StoryboardTabProps) {
 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
 );

 const onDragEnd = (e: DragEndEvent) => {
 const { active, over } = e;
 if (!over || active.id === over.id) return;
 const oldIdx = days.findIndex((d) => dKey(d) === active.id);
 const newIdx = days.findIndex((d) => dKey(d) === over.id);
 if (oldIdx < 0 || newIdx < 0) return;
 const next = arrayMove(days, oldIdx, newIdx).map((d, i) => ({ ...d, order: i }));
 onChange(next);
 };

 const updateDay = (dayId: string, patch: Partial<ContentProductionDay>) => {
 onChange(days.map((d) => (dKey(d) === dayId ? { ...d, ...patch } : d)));
 };
 const removeDay = (dayId: string) => {
 onChange(days.filter((d) => dKey(d) !== dayId));
 };
 const addScene = (dayId: string) => {
 const day = days.find((d) => dKey(d) === dayId);
 if (!day) return;
 const nextOrder = day.scenes.length;
 const scene: ContentScene = {
 sceneNumber: nextOrder + 1,
 sceneType: 'BODY',
 dialogue: null,
 voiceover: null,
 action: null,
 cameraAngle: null,
 shotType: null,
 props: null,
 brollNotes: null,
 editingNotes: null,
 durationSeconds: null,
 storyboardImageUrl: null,
 order: nextOrder,
 };
 updateDay(dayId, { scenes: [...day.scenes, scene] });
 };
 const updateScene = (dayId: string, sceneIdx: number, patch: Partial<ContentScene>) => {
 const day = days.find((d) => dKey(d) === dayId);
 if (!day) return;
 const nextScenes = day.scenes.map((s, i) => (i === sceneIdx ? { ...s, ...patch } : s));
 updateDay(dayId, { scenes: nextScenes });
 };
 const removeScene = (dayId: string, sceneIdx: number) => {
 const day = days.find((d) => dKey(d) === dayId);
 if (!day) return;
 updateDay(dayId, { scenes: day.scenes.filter((_, i) => i !== sceneIdx) });
 };

 return (
 <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
 <SortableContext items={days.map(dKey)} strategy={verticalListSortingStrategy}>
 <div className="space-y-3">
 {days.map((day) => (
 <SortableDay
 key={dKey(day)}
 day={day}
 onUpdate={(patch) => updateDay(dKey(day), patch)}
 onRemove={() => removeDay(dKey(day))}
 onAddScene={() => addScene(dKey(day))}
 onUpdateScene={(idx, patch) => updateScene(dKey(day), idx, patch)}
 onRemoveScene={(idx) => removeScene(dKey(day), idx)}
 />
 ))}
 </div>
 </SortableContext>
 </DndContext>
 );
}

function dKey(day: ContentProductionDay): string {
 return `day-${day.id ?? `tmp-${day.order}-${day.dayNumber}`}`;
}

// ─── Single day (sortable) ────────────────────────────────────

function SortableDay({
 day,
 onUpdate,
 onRemove,
 onAddScene,
 onUpdateScene,
 onRemoveScene,
}: {
 day: ContentProductionDay;
 onUpdate: (patch: Partial<ContentProductionDay>) => void;
 onRemove: () => void;
 onAddScene: () => void;
 onUpdateScene: (idx: number, patch: Partial<ContentScene>) => void;
 onRemoveScene: (idx: number) => void;
}) {
 const [expanded, setExpanded] = useState(true);
 const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
 id: dKey(day),
 });
 const style: React.CSSProperties = {
 transform: CSS.Transform.toString(transform),
 transition,
 opacity: isDragging ? 0.5 : 1,
 };

 return (
 <div
 ref={setNodeRef}
 style={style}
 className="rounded-2xl border border-darkborder bg-darkcard/60"
 >
 {/* Day header */}
 <div className="flex items-center gap-2 px-4 py-3 border-b border-darkborder">
 <button
 type="button"
 {...attributes}
 {...listeners}
 className="p-1 rounded text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing touch-none"
 aria-label="Drag to reorder day"
 >
 <GripVertical className="w-4 h-4" />
 </button>
 <div className="w-8 h-8 rounded-lg bg-studio-500/15 flex items-center justify-center text-sm font-bold text-studio-300 shrink-0">
 {day.dayNumber}
 </div>
 <div className="flex-1 min-w-0">
 <input
 type="text"
 value={day.location ?? ''}
 onChange={(e) => onUpdate({ location: e.target.value })}
 placeholder="Location (e.g. Home studio, Quán cafe, …)"
 className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
 />
 </div>
 <input
 type="date"
 value={day.date ? day.date.split('T')[0] : ''}
 onChange={(e) => onUpdate({ date: e.target.value === '' ? null : e.target.value })}
 className="hidden sm:block px-2 h-8 rounded-md bg-darkbg border border-darkborder text-xs text-text-primary focus:outline-none focus:border-studio-500/40"
 />
 <span className="text-[10px] text-text-muted shrink-0">
 {day.scenes.length} scene{day.scenes.length === 1 ? '' : 's'}
 </span>
 <button
 type="button"
 onClick={() => setExpanded((v) => !v)}
 className="p-1 rounded text-text-muted hover:text-text-primary"
 aria-label={expanded ? 'Collapse' : 'Expand'}
 >
 {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
 </button>
 <button
 type="button"
 onClick={onRemove}
 className="p-1 rounded text-text-muted hover:text-red-300"
 aria-label="Remove day"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </div>

 {/* Day notes (full-width row) */}
 <AnimatePresence initial={false}>
 {expanded && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="overflow-hidden"
 >
 <div className="px-4 py-3 border-b border-darkborder/50">
 <label className="flex items-start gap-2">
 <StickyNote className="w-3.5 h-3.5 text-text-muted mt-1.5 shrink-0" />
 <textarea
 value={day.notes ?? ''}
 onChange={(e) => onUpdate({ notes: e.target.value })}
 rows={1}
 placeholder="Day notes (lighting, talent, props to bring…)"
 className="flex-1 bg-transparent text-xs text-text-secondary placeholder:text-text-muted focus:outline-none resize-none"
 />
 </label>
 </div>

 {/* Scenes */}
 <ul className="p-3 space-y-2">
 {day.scenes.length === 0 ? (
 <li className="text-[11px] text-text-muted italic text-center py-3">
 No scenes yet. Add one to start the shot list.
 </li>
 ) : (
 day.scenes.map((scene, idx) => (
 <SceneRow
 key={scene.id ?? `tmp-scene-${idx}-${scene.order}`}
 scene={scene}
 index={idx}
 onUpdate={(patch) => onUpdateScene(idx, patch)}
 onRemove={() => onRemoveScene(idx)}
 />
 ))
 )}
 </ul>

 <div className="px-3 pb-3">
 <button
 type="button"
 onClick={onAddScene}
 className="w-full inline-flex items-center justify-center gap-1.5 px-3 h-8 rounded-lg border border-dashed border-darkborder bg-darkbg/30 text-text-secondary hover:text-studio-300 hover:border-studio-500/40 text-xs font-medium transition-colors"
 >
 <Plus className="w-3.5 h-3.5" />
 Add scene
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}

// ─── Single scene ─────────────────────────────────────────────

function SceneRow({
 scene,
 index,
 onUpdate,
 onRemove,
}: {
 scene: ContentScene;
 index: number;
 onUpdate: (patch: Partial<ContentScene>) => void;
 onRemove: () => void;
}) {
 const meta = SCENE_TYPE_META[scene.sceneType];
 return (
 <li className="rounded-xl border border-darkborder bg-darkcard/40 p-3">
 <div className="flex items-center gap-2 mb-2">
 <div
 className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
 style={{ background: meta.color }}
 title={meta.label}
 >
 {meta.short}
 </div>
 <span className="text-[11px] text-text-muted shrink-0">
 #{scene.sceneNumber}
 </span>
 <select
 value={scene.sceneType}
 onChange={(e) => onUpdate({ sceneType: e.target.value as SceneType })}
 className="px-2 h-7 rounded-md bg-darkbg border border-darkborder text-xs text-text-primary focus:outline-none focus:border-studio-500/40"
 >
 {(Object.keys(SCENE_TYPE_META) as SceneType[]).map((s) => (
 <option key={s} value={s}>
 {SCENE_TYPE_META[s].label}
 </option>
 ))}
 </select>
 <select
 value={scene.shotType ?? ''}
 onChange={(e) => onUpdate({ shotType: (e.target.value || null) as ShotType | null })}
 className="px-2 h-7 rounded-md bg-darkbg border border-darkborder text-xs text-text-primary focus:outline-none focus:border-studio-500/40"
 >
 <option value="">— shot —</option>
 {(Object.keys(SHOT_TYPE_META) as ShotType[]).map((s) => (
 <option key={s} value={s}>
 {SHOT_TYPE_META[s].icon} {SHOT_TYPE_META[s].label}
 </option>
 ))}
 </select>
 <input
 type="number"
 min={0}
 value={scene.durationSeconds ?? ''}
 onChange={(e) =>
 onUpdate({ durationSeconds: e.target.value === '' ? null : Number(e.target.value) })
 }
 placeholder="sec"
 className="w-16 px-2 h-7 rounded-md bg-darkbg border border-darkborder text-xs text-text-primary focus:outline-none focus:border-studio-500/40"
 />
 <button
 type="button"
 onClick={onRemove}
 className="ml-auto p-1 rounded text-text-muted hover:text-red-300"
 aria-label="Remove scene"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 <SceneField
 label="Dialogue"
 value={scene.dialogue}
 onChange={(v) => onUpdate({ dialogue: v })}
 placeholder="On-screen dialogue (lời thoại)…"
 />
 <SceneField
 label="Voiceover"
 value={scene.voiceover}
 onChange={(v) => onUpdate({ voiceover: v })}
 placeholder="Voiceover narration…"
 />
 <SceneField
 label="Action / camera"
 value={scene.action}
 onChange={(v) => onUpdate({ action: v })}
 placeholder="What happens + camera direction…"
 />
 <SceneField
 label="B-roll / editing"
 value={scene.brollNotes}
 onChange={(v) => onUpdate({ brollNotes: v })}
 placeholder="B-roll inserts + editing notes…"
 />
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 mt-2">
 <SceneField
 label="Props"
 value={scene.props}
 onChange={(v) => onUpdate({ props: v })}
 placeholder="Props (comma-separated, e.g. mic, ring light, phone)"
 compact
 />
 <div className="flex items-center gap-1 self-end pb-1.5">
 <Camera className="w-3 h-3 text-text-muted" />
 <span className="text-[10px] text-text-muted">
 Scene {index + 1}
 </span>
 </div>
 </div>
 </li>
 );
}

function SceneField({
 label,
 value,
 onChange,
 placeholder,
 compact,
}: {
 label: string;
 value: string | null;
 onChange: (v: string | null) => void;
 placeholder: string;
 compact?: boolean;
}) {
 return (
 <label className="block">
 <span className="text-[10px] text-text-muted uppercase tracking-wider">{label}</span>
 <textarea
 value={value ?? ''}
 onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
 rows={compact ? 1 : 2}
 placeholder={placeholder}
 className="mt-0.5 w-full px-2 py-1.5 rounded-md bg-darkbg border border-darkborder text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/40 resize-y"
 />
 </label>
 );
}
