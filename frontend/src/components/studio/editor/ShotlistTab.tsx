'use client';

// Editor Shot list tab — Phase 7.
//
// A flat, ordered view of every scene in the project
// (across all production days) so the user can see
// the "shot list" in one place. The data lives on
// the scenes themselves (cameraAngle, shotType,
// props, durationSeconds, brollNotes, editingNotes),
// so this tab is mostly a *read* view that calls
// back into the Storyboard's onChange to edit.
//
// We DO allow:
// • Toggle a scene as "in shot list" (UI-only —
// every scene is in the shot list, this is just for
// visual scanning)
// • Click a scene to jump back to its day in the
// Storyboard
// • Edit per-scene notes inline (props, B-roll,
// editing notes) — these call onChange with the
// updated day
//
// Layout
// ──────
// • Top: aggregate stats (total scenes, total
// duration, unique props, unique camera angles).
// • List: cards in order, day + scene number
// stamped at the top, fields shown as labelled
// rows.

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
 Camera,
 Clock,
 MapPin,
 StickyNote,
 Film,
 Hash,
 Image as ImageIcon,
 Pencil,
 CheckCircle2,
 CircleDashed,
 Aperture,
} from 'lucide-react';
import {
 SHOT_TYPE_META,
 SCENE_TYPE_META,
} from '@/lib/studio-meta';
import type {
 ContentProductionDay,
 ContentScene,
 SceneType,
 ShotType,
} from '@/types';

interface ShotlistTabProps {
 days: ContentProductionDay[];
 onChange: (days: ContentProductionDay[]) => void;
 /** Called when the user clicks "Edit in storyboard" —
 * lets the parent (ProjectEditorShell) jump back to
 * the storyboard tab and highlight the scene. */
 onFocusScene?: (dayId: number | undefined, sceneId: number | undefined) => void;
}

interface FlatScene {
 day: ContentProductionDay;
 scene: ContentScene;
 dayNumber: number;
 sceneIndex: number;
}

export default function ShotlistTab({
 days,
 onChange,
 onFocusScene,
}: ShotlistTabProps) {
 // Flatten days + scenes into a single ordered list.
 // The order is the user's canonical shot order —
 // we sort by day.dayNumber then scene.sceneNumber
 // so any re-order they do on the storyboard shows
 // up here in the right place.
 const flat: FlatScene[] = useMemo(() => {
 const out: FlatScene[] = [];
 for (const d of [...days].sort((a, b) => a.dayNumber - b.dayNumber)) {
 for (let i = 0; i < d.scenes.length; i++) {
 out.push({
 day: d,
 scene: d.scenes[i],
 dayNumber: d.dayNumber,
 sceneIndex: i,
 });
 }
 }
 return out;
 }, [days]);

 // Aggregate stats.
 const stats = useMemo(() => {
 const totalScenes = flat.length;
 const totalSeconds = flat.reduce(
 (acc, f) => acc + (f.scene.durationSeconds ?? 0),
 0,
 );
 const propSet = new Set<string>();
 const angleSet = new Set<string>();
 for (const f of flat) {
 if (f.scene.props) {
 for (const p of f.scene.props.split(',').map((s) => s.trim()).filter(Boolean)) {
 propSet.add(p);
 }
 }
 if (f.scene.cameraAngle) angleSet.add(f.scene.cameraAngle);
 }
 return {
 totalScenes,
 totalSeconds,
 propCount: propSet.size,
 angleCount: angleSet.size,
 };
 }, [flat]);

 // ─── Edit helpers ──────────────────────────────────────
 // We rebuild the days array with the patched scene
 // in place. Mirrors the Storyboard's edit pattern.
 const updateScene = (
 dayId: number,
 sceneId: number,
 patch: Partial<ContentScene>,
 ) => {
 const next = days.map((d) => {
 if (d.id !== dayId) return d;
 return {
 ...d,
 scenes: d.scenes.map((s) =>
 s.id === sceneId ? { ...s, ...patch } : s,
 ),
 };
 });
 onChange(next);
 };

 if (flat.length === 0) {
 return (
 <div className="text-center py-16">
 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-studio-500/10 ring-1 ring-studio-500/20 mb-4">
 <Film className="w-7 h-7 text-studio-400/60" />
 </div>
 <h3 className="text-base font-semibold text-text-primary">
 No scenes yet
 </h3>
 <p className="mt-1 text-sm text-text-secondary max-w-sm mx-auto">
 Add scenes in the Storyboard tab and they'll show up here as your shot list.
 </p>
 </div>
 );
 }

 return (
 <div className="space-y-4">
 {/* Aggregate stats */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <StatPill
 icon={Hash}
 label="Scenes"
 value={stats.totalScenes.toString()}
 />
 <StatPill
 icon={Clock}
 label="Total length"
 value={formatDuration(stats.totalSeconds)}
 />
 <StatPill
 icon={Aperture}
 label="Unique props"
 value={stats.propCount.toString()}
 />
 <StatPill
 icon={Camera}
 label="Camera angles"
 value={stats.angleCount.toString()}
 />
 </div>

 {/* Scene cards */}
 <div className="space-y-2">
 {flat.map(({ day, scene, dayNumber, sceneIndex }, idx) => {
 const sceneMeta = SCENE_TYPE_META[scene.sceneType as SceneType];
 const shotMeta = scene.shotType
 ? SHOT_TYPE_META[scene.shotType as ShotType]
 : null;
 return (
 <motion.article
 key={scene.id ?? `tmp-${idx}`}
 layout
 initial={{ opacity: 0, y: 4 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.02 }}
 className="studio-glass rounded-xl p-3 sm:p-4 shadow-studio-card hover:shadow-studio-card-hover transition-shadow"
 >
 <div className="flex items-start gap-3">
 {/* Sequence number + scene-type badge */}
 <div className="flex flex-col items-center gap-1 shrink-0 w-12">
 <div className="text-[10px] uppercase tracking-wider text-text-muted">
 Day {dayNumber}
 </div>
 <div className="w-9 h-9 rounded-lg bg-studio-500/15 ring-1 ring-studio-500/30 inline-flex items-center justify-center">
 <span className="text-sm font-bold text-studio-300">
 {scene.sceneNumber}
 </span>
 </div>
 <div className="text-[10px] text-text-muted text-center">
 {sceneMeta?.label ?? scene.sceneType}
 </div>
 </div>

 {/* Body */}
 <div className="flex-1 min-w-0 space-y-2">
 <div className="flex items-center gap-2 flex-wrap">
 {shotMeta && (
 <span className="inline-flex items-center gap-1 px-2 h-5 rounded-md bg-bg-elevated/60 ring-1 ring-studio-500/20 text-text-secondary text-[10px] font-semibold uppercase tracking-wider">
 {shotMeta.icon && <span className="text-studio-300">{shotMeta.icon}</span>}
 {shotMeta.label}
 </span>
 )}
 {day.location && (
 <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
 <MapPin className="w-3 h-3" />
 {day.location}
 </span>
 )}
 {typeof scene.durationSeconds === 'number' && scene.durationSeconds > 0 && (
 <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
 <Clock className="w-3 h-3" />
 {formatDuration(scene.durationSeconds)}
 </span>
 )}
 <div className="flex-1" />
 {onFocusScene && (
 <button
 type="button"
 onClick={() => onFocusScene(day.id, scene.id)}
 className="inline-flex items-center gap-1 h-6 px-2 rounded-md text-[10px] text-text-muted hover:text-studio-300 hover:bg-studio-500/10"
 >
 <Pencil className="w-3 h-3" />
 Edit
 </button>
 )}
 </div>

 {/* Per-scene fields (compact view + inline edit) */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-[12px]">
 {scene.cameraAngle && (
 <FieldRow icon={Camera} label="Camera" value={scene.cameraAngle} />
 )}
 {scene.props && (
 <FieldRow icon={Aperture} label="Props" value={scene.props} />
 )}
 </div>

 {/* Inline-editable notes (B-roll, editing) */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
 <InlineNote
 icon={ImageIcon}
 label="B-roll notes"
 value={scene.brollNotes}
 onSave={(v) => updateScene(day.id!, scene.id!, { brollNotes: v })}
 placeholder="What B-roll to drop in here…"
 />
 <InlineNote
 icon={StickyNote}
 label="Editing notes"
 value={scene.editingNotes}
 onSave={(v) => updateScene(day.id!, scene.id!, { editingNotes: v })}
 placeholder="Cut, transition, music, SFX…"
 />
 </div>
 </div>
 </div>
 </motion.article>
 );
 })}
 </div>
 </div>
 );
}

// ─── Helpers ─────────────────────────────────────────────────────

function StatPill({
 icon: Icon,
 label,
 value,
}: {
 icon: React.ComponentType<{ className?: string }>;
 label: string;
 value: string;
}) {
 return (
 <div className="studio-glass rounded-xl px-3 py-2.5 flex items-center gap-2.5">
 <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-studio-500/15 shrink-0">
 <Icon className="w-4 h-4 text-studio-400" />
 </div>
 <div>
 <div className="text-base font-semibold text-text-primary leading-tight">
 {value}
 </div>
 <div className="text-[10px] text-text-muted uppercase tracking-wider">
 {label}
 </div>
 </div>
 </div>
 );
}

function FieldRow({
 icon: Icon,
 label,
 value,
}: {
 icon: React.ComponentType<{ className?: string }>;
 label: string;
 value: string;
}) {
 return (
 <div className="flex items-start gap-1.5 text-text-secondary">
 <Icon className="w-3 h-3 text-text-muted mt-0.5 shrink-0" />
 <span className="text-[10px] uppercase tracking-wider text-text-muted shrink-0 mt-0.5">
 {label}:
 </span>
 <span className="line-clamp-1">{value}</span>
 </div>
 );
}

// Small inline editor: shows the value as a one-line
// preview, click to expand to a textarea, blur to
// save. Keeps the shot list scannable while still
// allowing notes without leaving the tab.
function InlineNote({
 icon: Icon,
 label,
 value,
 onSave,
 placeholder,
}: {
 icon: React.ComponentType<{ className?: string }>;
 label: string;
 value: string | null;
 onSave: (v: string | null) => void;
 placeholder?: string;
}) {
 const [editing, setEditing] = useState(false);
 const [draft, setDraft] = useState(value ?? '');

 const commit = () => {
 const next = draft.trim();
 onSave(next.length > 0 ? next : null);
 setEditing(false);
 };

 return (
 <div className="rounded-lg bg-bg-elevated/30 ring-1 ring-studio-500/10 px-2.5 py-1.5">
 <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-muted mb-0.5">
 <Icon className="w-3 h-3" />
 {label}
 </div>
 {editing ? (
 <textarea
 autoFocus
 value={draft}
 onChange={(e) => setDraft(e.target.value)}
 onBlur={commit}
 onKeyDown={(e) => {
 if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commit();
 if (e.key === 'Escape') {
 setDraft(value ?? '');
 setEditing(false);
 }
 }}
 placeholder={placeholder}
 rows={2}
 className="w-full bg-transparent text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none resize-none"
 />
 ) : (
 <button
 type="button"
 onClick={() => {
 setDraft(value ?? '');
 setEditing(true);
 }}
 className="w-full text-left text-[12px] text-text-secondary hover:text-text-primary min-h-[1.5em]"
 >
 {value ?? (
 <span className="text-text-muted italic">{placeholder ?? 'Click to add…'}</span>
 )}
 </button>
 )}
 </div>
 );
}

function formatDuration(seconds: number): string {
 if (seconds <= 0) return '0s';
 const m = Math.floor(seconds / 60);
 const s = seconds % 60;
 if (m === 0) return `${s}s`;
 if (s === 0) return `${m}m`;
 return `${m}m ${s}s`;
}
