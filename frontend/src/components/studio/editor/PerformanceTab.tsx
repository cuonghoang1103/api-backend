'use client';

// Editor Performance tab — Phase 7.
//
// Post-publish metrics. The model is 1-1 with the
// project, so we render a single set of inputs. The
// data lives in `project.performance`; if it's null
// (older project, or the row was deleted), we render
// a "no metrics yet" hint and a "start tracking"
// button that creates a default row by sending an
// empty payload (the server upserts).
//
// Four stat tiles for views/likes/comments/shares.
// Below that: CTR (% with slider), watch time
// (seconds, displayed as m:ss), per-platform
// breakdown (read-only JSON for now — the editor
// doesn't need a per-platform UI yet), and a
// lessons-learned textarea.

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
 Eye,
 Heart,
 MessageCircle,
 Share2,
 Clock,
 Percent,
 TrendingUp,
 FileText,
 Sparkles,
 Plus,
} from 'lucide-react';
import type { ContentPerformance } from '@/types';

interface PerformanceTabProps {
 performance: ContentPerformance | null;
 onChange: (next: ContentPerformance) => void;
}

export default function PerformanceTab({
 performance,
 onChange,
}: PerformanceTabProps) {
 // Local state for the platform-metrics JSON editor
 // (avoids a roundtrip on every keystroke).
 const [platformText, setPlatformText] = useState(() =>
 performance?.platformMetrics
 ? JSON.stringify(performance.platformMetrics, null, 2)
 : '{}',
 );
 // When the server's `performance` prop changes (after
 // autosave round-trip), reset the platform JSON editor
 // so the user sees the latest persisted shape.
 useEffect(() => {
 setPlatformText(
 performance?.platformMetrics
 ? JSON.stringify(performance.platformMetrics, null, 2)
 : '{}',
 );
 }, [performance]);

 // Derived stats.
 const stats = useMemo(() => {
 const p = performance;
 if (!p) return null;
 const engagement =
 p.totalViews > 0
 ? Math.round(
 ((p.totalLikes + p.totalComments + p.totalShares) /
 p.totalViews) *
 100 *
 10,
 ) / 10
 : 0;
 const watchFmt = formatWatchTime(p.watchTimeSec ?? 0);
 return { engagement, watchFmt };
 }, [performance]);

 if (!performance) {
 return (
 <div className="studio-glass rounded-2xl p-8 text-center shadow-studio-card">
 <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-studio-500/10 mb-3">
 <Sparkles className="w-6 h-6 text-studio-400" />
 </div>
 <h3 className="text-sm font-semibold text-text-primary mb-1">
 No metrics yet
 </h3>
 <p className="text-xs text-text-secondary mb-4 max-w-sm mx-auto">
 Once you publish this project, come back here to log
 view counts, watch time, and lessons learned.
 </p>
 <button
 type="button"
 onClick={() =>
 onChange({
 id: 0,
 contentProjectId: 0,
 platformMetrics: null,
 totalViews: 0,
 totalLikes: 0,
 totalComments: 0,
 totalShares: 0,
 ctr: null,
 watchTimeSec: null,
 lessonsLearned: null,
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 })
 }
 className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-studio-500 text-bg-base text-xs font-semibold hover:bg-studio-400 transition-colors"
 >
 <Plus className="w-3.5 h-3.5" />
 Start tracking
 </button>
 </div>
 );
 }

 const update = (patch: Partial<ContentPerformance>) => {
 onChange({ ...performance, ...patch });
 };

 // CTR: store as a fraction in the DB, but show the
 // user a percent input (more intuitive). We convert
 // in the patch so the server stores the canonical
 // shape.
 const ctrPercent = performance.ctr == null ? 0 : performance.ctr * 100;
 const setCtrPercent = (pct: number) => {
 update({ ctr: pct > 0 ? pct / 100 : 0 });
 };

 return (
 <div className="space-y-4">
 {/* Stat tiles */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
 <StatTile
 icon={<Eye className="w-3.5 h-3.5" />}
 label="Views"
 value={performance.totalViews}
 onChange={(v) => update({ totalViews: clampInt(v) })}
 tint="#60a5fa"
 />
 <StatTile
 icon={<Heart className="w-3.5 h-3.5" />}
 label="Likes"
 value={performance.totalLikes}
 onChange={(v) => update({ totalLikes: clampInt(v) })}
 tint="#f43f5e"
 />
 <StatTile
 icon={<MessageCircle className="w-3.5 h-3.5" />}
 label="Comments"
 value={performance.totalComments}
 onChange={(v) => update({ totalComments: clampInt(v) })}
 tint="#a855f7"
 />
 <StatTile
 icon={<Share2 className="w-3.5 h-3.5" />}
 label="Shares"
 value={performance.totalShares}
 onChange={(v) => update({ totalShares: clampInt(v) })}
 tint="#22d3ee"
 />
 </div>

 {/* Engagement + watch time + CTR row */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 <div className="studio-glass rounded-2xl p-4 shadow-studio-card">
 <div className="flex items-center gap-1.5 mb-2">
 <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
 <span className="text-xs font-semibold text-text-primary">
 Engagement rate
 </span>
 </div>
 <div className="text-2xl font-bold text-text-primary tabular-nums">
 {stats?.engagement ?? 0}
 <span className="text-base text-text-secondary">%</span>
 </div>
 <div className="text-[10px] text-text-muted mt-1">
 likes + comments + shares / views
 </div>
 </div>

 <div className="studio-glass rounded-2xl p-4 shadow-studio-card">
 <div className="flex items-center gap-1.5 mb-2">
 <Clock className="w-3.5 h-3.5 text-studio-400" />
 <span className="text-xs font-semibold text-text-primary">
 Avg watch time
 </span>
 </div>
 <div className="flex items-center gap-2">
 <input
 type="number"
 min="0"
 value={performance.watchTimeSec ?? 0}
 onChange={(e) =>
 update({ watchTimeSec: clampInt(e.target.value) })
 }
 className="w-20 bg-bg-elevated/40 rounded px-2 py-1 text-sm font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-studio-500/40 tabular-nums"
 />
 <span className="text-xs text-text-secondary">sec</span>
 <span className="text-[10px] text-text-muted ml-auto">
 = {stats?.watchFmt}
 </span>
 </div>
 <div className="text-[10px] text-text-muted mt-1">
 shown to viewers as m:ss
 </div>
 </div>

 <div className="studio-glass rounded-2xl p-4 shadow-studio-card">
 <div className="flex items-center gap-1.5 mb-2">
 <Percent className="w-3.5 h-3.5 text-cyan-400" />
 <span className="text-xs font-semibold text-text-primary">
 CTR
 </span>
 </div>
 <div className="flex items-center gap-2">
 <input
 type="range"
 min="0"
 max="20"
 step="0.1"
 value={ctrPercent}
 onChange={(e) => setCtrPercent(parseFloat(e.target.value))}
 className="flex-1 accent-studio-500"
 />
 <span className="text-sm font-bold text-text-primary tabular-nums w-12 text-right">
 {ctrPercent.toFixed(1)}%
 </span>
 </div>
 <div className="text-[10px] text-text-muted mt-1">
 click-through rate on the thumbnail
 </div>
 </div>
 </div>

 {/* Lessons learned */}
 <div className="studio-glass rounded-2xl p-4 shadow-studio-card">
 <div className="flex items-center gap-1.5 mb-2">
 <FileText className="w-3.5 h-3.5 text-studio-400" />
 <span className="text-xs font-semibold text-text-primary">
 Lessons learned
 </span>
 <span className="text-[10px] text-text-muted ml-1">
 what worked, what didn't
 </span>
 </div>
 <textarea
 value={performance.lessonsLearned ?? ''}
 onChange={(e) =>
 update({ lessonsLearned: e.target.value || null })
 }
 placeholder="The first 3 seconds carried the entire video…"
 rows={4}
 className="w-full bg-bg-elevated/40 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-studio-500/40 resize-y placeholder:text-text-muted/60"
 />
 </div>

 {/* Per-platform breakdown (read-only-ish JSON for now) */}
 <details className="studio-glass rounded-2xl shadow-studio-card group">
 <summary className="cursor-pointer list-none p-4 flex items-center gap-1.5">
 <Sparkles className="w-3.5 h-3.5 text-text-muted" />
 <span className="text-xs font-semibold text-text-primary">
 Per-platform breakdown
 </span>
 <span className="text-[10px] text-text-muted ml-1">
 (read-only JSON, edit via API)
 </span>
 <span className="ml-auto text-[10px] text-text-muted group-open:hidden">
 click to expand
 </span>
 </summary>
 <div className="px-4 pb-4">
 <textarea
 value={platformText}
 onChange={(e) => setPlatformText(e.target.value)}
 onBlur={() => {
 // Best-effort: parse and push to performance.
 // If the JSON is invalid, swallow + revert locally.
 try {
 const parsed = JSON.parse(platformText || '{}');
 if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
 update({ platformMetrics: parsed });
 } else {
 setPlatformText(
 performance.platformMetrics
 ? JSON.stringify(performance.platformMetrics, null, 2)
 : '{}',
 );
 }
 } catch {
 setPlatformText(
 performance.platformMetrics
 ? JSON.stringify(performance.platformMetrics, null, 2)
 : '{}',
 );
 }
 }}
 rows={6}
 className="w-full bg-bg-base/60 rounded-lg px-3 py-2 text-[11px] font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-studio-500/40 resize-y"
 spellCheck={false}
 />
 <div className="text-[10px] text-text-muted mt-1">
 Save with Ctrl/Cmd+S or by clicking away. Invalid
 JSON is reverted.
 </div>
 </div>
 </details>
 </div>
 );
}

// ─── Stat tile ───────────────────────────────────────────────────
function StatTile({
 icon,
 label,
 value,
 onChange,
 tint,
}: {
 icon: React.ReactNode;
 label: string;
 value: number;
 onChange: (v: number) => void;
 tint: string;
}) {
 return (
 <motion.div
 whileHover={{ y: -1 }}
 className="studio-glass rounded-2xl p-3 shadow-studio-card"
 >
 <div className="flex items-center gap-1.5 mb-2">
 <span style={{ color: tint }}>{icon}</span>
 <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
 {label}
 </span>
 </div>
 <input
 type="number"
 min="0"
 value={value}
 onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
 className="w-full bg-transparent text-2xl font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-studio-500/40 rounded px-1 -mx-1 tabular-nums"
 />
 </motion.div>
 );
}

// ─── helpers ─────────────────────────────────────────────────────
function clampInt(v: number | string): number {
 const n = typeof v === 'string' ? parseInt(v, 10) : v;
 if (!Number.isFinite(n) || n < 0) return 0;
 return Math.trunc(n);
}

function formatWatchTime(sec: number): string {
 if (sec <= 0) return '0:00';
 const m = Math.floor(sec / 60);
 const s = sec % 60;
 return `${m}:${s.toString().padStart(2, '0')}`;
}
