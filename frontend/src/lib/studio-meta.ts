// Shared studio constants — anything that needs to know
// the meaning of a status / type / phase lives here so the
// Dashboard, Pipeline, and Editor all paint the same way.
//
// Why a single source of truth: when Phase 5 introduces
// the calendar, Phase 6 the list view, and Phase 7 the
// remaining editor tabs, the only way to keep all six
// surfaces consistent is to point them at the same meta
// map. Inline strings scattered across files will drift.

import type {
 ContentStatus,
 ContentType,
 SceneType,
 ShotType,
 ContentPlatform,
 ChecklistPhase,
} from '@/types';

// ─── Status meta ────────────────────────────────────────────────────────────

export interface ContentStatusMeta {
 label: string;
 /** Tailwind classes for the pill background + text. */
 pillClass: string;
 /** Tailwind classes for the column header strip + dot. */
 accentClass: string;
 /** Hex colour for canvas / SVG / sparkline usage. */
 color: string;
 /** Sort weight — lower = earlier in the pipeline. */
 order: number;
 /** Short description shown in tooltips / dashboards. */
 description: string;
}

export const CONTENT_STATUS_META: Record<ContentStatus, ContentStatusMeta> = {
 IDEA: {
 label: 'Idea',
 pillClass: 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30',
 accentClass: 'text-slate-300',
 color: '#94a3b8',
 order: 0,
 description: 'Spark captured, no script yet.',
 },
 SCRIPTING: {
 label: 'Scripting',
 pillClass: 'bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30',
 accentClass: 'text-blue-300',
 color: '#60a5fa',
 order: 1,
 description: 'Outline + draft in progress.',
 },
 FILMING: {
 label: 'Filming',
 pillClass: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
 accentClass: 'text-amber-300',
 color: '#F59E0B',
 order: 2,
 description: 'Cameras rolling.',
 },
 EDITING: {
 label: 'Editing',
 pillClass: 'bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/30',
 accentClass: 'text-purple-300',
 color: '#a855f7',
 order: 3,
 description: 'Cut + colour + sound in post.',
 },
 SCHEDULED: {
 label: 'Scheduled',
 pillClass: 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30',
 accentClass: 'text-cyan-300',
 color: '#22d3ee',
 order: 4,
 description: 'Locked in. Going live soon.',
 },
 PUBLISHED: {
 label: 'Published',
 pillClass: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
 accentClass: 'text-emerald-300',
 color: '#10b981',
 order: 5,
 description: 'Out in the world.',
 },
};

/** Ordered list for the Kanban columns + agenda. */
export const STATUS_ORDER: ContentStatus[] = [
 'IDEA',
 'SCRIPTING',
 'FILMING',
 'EDITING',
 'SCHEDULED',
 'PUBLISHED',
];

// ─── Type meta ──────────────────────────────────────────────────────────────

export interface ContentTypeMeta {
 label: string;
 emoji: string;
 color: string;
}

export const CONTENT_TYPE_META: Record<ContentType, ContentTypeMeta> = {
 VLOG: { label: 'Vlog', emoji: '🎬', color: '#f59e0b' },
 AFFILIATE: { label: 'Affiliate', emoji: '🛒', color: '#ec4899' },
 CODE_REVIEW: { label: 'Code Review', emoji: '⌨️', color: '#3b82f6' },
 REVIEW: { label: 'Review', emoji: '🔍', color: '#8b5cf6' },
 IDEA: { label: 'Idea', emoji: '💡', color: '#94a3b8' },
 OTHER: { label: 'Other', emoji: '📦', color: '#64748b' },
};

// ─── Scene / shot / platform / phase meta ───────────────────────────────────

export const SCENE_TYPE_META: Record<SceneType, { label: string; short: string; color: string }> = {
 OPENING: { label: 'Opening', short: 'OP', color: '#a855f7' },
 HOOK: { label: 'Hook', short: 'HK', color: '#f43f5e' },
 INTRO: { label: 'Intro', short: 'IN', color: '#3b82f6' },
 BODY: { label: 'Body', short: 'BD', color: '#94a3b8' },
 BROLL: { label: 'B-roll', short: 'BR', color: '#22d3ee' },
 CTA: { label: 'Call to action', short: 'CT', color: '#10b981' },
 OUTRO: { label: 'Outro', short: 'OU', color: '#f59e0b' },
};

export const SHOT_TYPE_META: Record<ShotType, { label: string; icon: string }> = {
 CLOSEUP: { label: 'Close-up', icon: '◉' },
 MEDIUM: { label: 'Medium', icon: '⊙' },
 WIDE: { label: 'Wide', icon: '○' },
 POV: { label: 'POV', icon: '◐' },
 OVERHEAD: { label: 'Overhead', icon: '⬢' },
};

export const PLATFORM_META: Record<ContentPlatform, { label: string; color: string }> = {
 TIKTOK: { label: 'TikTok', color: '#000000' },
 YOUTUBE: { label: 'YouTube', color: '#ff0000' },
 FACEBOOK: { label: 'Facebook', color: '#1877f2' },
 INSTAGRAM: { label: 'Instagram', color: '#e1306c' },
};

export const CHECKLIST_PHASE_META: Record<ChecklistPhase, { label: string; color: string }> = {
 PRE: { label: 'Pre-production', color: '#94a3b8' },
 PRODUCTION: { label: 'Production', color: '#f59e0b' },
 POST: { label: 'Post-production', color: '#a855f7' },
 PUBLISH: { label: 'Publish', color: '#10b981' },
};
