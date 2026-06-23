'use client';

// ProjectEditorShell — the chrome around the 8 editor
// tabs. Owns:
// • the local form state (a copy of the server project)
// • the autosave hook (debounced PUT via
// useProjectAutosave)
// • the save indicator pill
// • the 8-tab navigation
// • the "Back to pipeline" link
//
// Phase 4 only ships 3 tabs (Overview / Storyboard /
// Teleprompter). The other 5 are stubs that Phase 5–7
// will fill in. The stub tabs are visible (so the user
// can see the structure of the full editor) but show a
// "coming in Phase N" panel.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
 ArrowLeft,
 CheckSquare,
 Clapperboard,
 Film,
 Image as ImageIcon,
 LayoutDashboard,
 Megaphone,
 Mic,
 Package,
 Pencil,
 ShoppingBag,
 Sparkles,
 Trash2,
} from 'lucide-react';
import {
 useContentProject,
 useDeleteContentProject,
} from '@/hooks/useContentQueries';
import StatusPill from '@/components/studio/StatusPill';
import TypePill from '@/components/studio/TypePill';
import SaveIndicator, { type SaveStatus } from './SaveIndicator';
import { useProjectAutosave } from './useProjectAutosave';
import OverviewTab from './OverviewTab';
import StoryboardTab from './StoryboardTab';
import TeleprompterTab from './TeleprompterTab';
import { CONTENT_STATUS_META } from '@/lib/studio-meta';
import type {
 ContentAffiliateProduct,
 ContentChecklistItem,
 ContentPerformance,
 ContentPlatformPost,
 ContentProject,
 ContentProductionDay,
} from '@/types';

interface TabDef {
 id: string;
 label: string;
 icon: React.ComponentType<{ className?: string }>;
 phase?: number; // which phase builds this tab
}

const TABS: TabDef[] = [
 { id: 'overview', label: 'Overview', icon: LayoutDashboard },
 { id: 'storyboard', label: 'Storyboard', icon: Film },
 { id: 'teleprompter', label: 'Teleprompter', icon: Mic },
 { id: 'script', label: 'Script', icon: Pencil, phase: 7 },
 { id: 'shotlist', label: 'Shot list', icon: ImageIcon, phase: 7 },
 { id: 'platforms', label: 'Platforms', icon: Megaphone, phase: 7 },
 { id: 'checklist', label: 'Checklist', icon: CheckSquare, phase: 7 },
 { id: 'performance', label: 'Performance', icon: Sparkles, phase: 7 },
];

interface ProjectEditorShellProps {
 projectId: number;
}

export default function ProjectEditorShell({ projectId }: ProjectEditorShellProps) {
 const router = useRouter();
 const { data: project, isLoading, error } = useContentProject(projectId);
 const deleteProject = useDeleteContentProject();

 // Local form state — a deep-ish copy of the project so
 // the user can edit fields and see the diff before the
 // debounce fires.
 const [form, setForm] = useState<ContentProject | null>(null);
 const [activeTab, setActiveTab] = useState<string>('overview');

 // When the server data arrives, populate the form.
 // We also update the form when the autosave returns a
 // new server-normalised version (so ids assigned on
 // create are filled in).
 useEffect(() => {
 if (project && (!form || form.id !== project.id)) {
 setForm(structuredClone(project));
 }
 }, [project, form]);

 // Track whether the form actually has unsaved changes
 // so the save indicator can show "dirty" instead of
 // "idle". We compare to the last-saved snapshot.
 const lastSavedRef = useRef<ContentProject | null>(null);
 useEffect(() => {
 if (project) lastSavedRef.current = project;
 }, [project]);

 const isDirty = useMemo(() => {
 if (!form || !lastSavedRef.current) return false;
 return JSON.stringify(form) !== JSON.stringify(lastSavedRef.current);
 }, [form]);

 const { status, lastSavedAt, scheduleSave, flushNow } = useProjectAutosave({
 projectId,
 onSaved: (saved) => {
 // Sync the local form to the server's response so
 // we pick up the assigned ids / normalised fields.
 setForm((prev) => (prev ? { ...prev, ...saved } : saved));
 lastSavedRef.current = saved;
 },
 });

 // Whenever the form changes, re-arm the debounce.
 // We pass a closure that returns the *current* form so
 // the debounce can fire with the freshest values.
 useEffect(() => {
 if (!form) return;
 scheduleSave(() => buildPayload(form));
 // We intentionally only re-arm on `form` changes; the
 // scheduleSave callback is stable.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [form]);

 // Flush on tab change so the user never loses an
 // in-flight edit when switching tabs.
 const handleTabChange = async (nextId: string) => {
 if (activeTab === nextId) return;
 await flushNow();
 setActiveTab(nextId);
 };

 const handleDelete = async () => {
 if (!form) return;
 if (!confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
 await flushNow();
 await deleteProject.mutateAsync(projectId);
 router.push('/creator/pipeline');
 };

 if (isLoading) {
 return (
 <div className="flex items-center justify-center h-64 text-text-muted text-sm">
 <Clapperboard className="w-4 h-4 mr-2 animate-pulse" />
 Loading project…
 </div>
 );
 }

 if (error || !form) {
 return (
 <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-2xl mx-auto text-center">
 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/15 ring-1 ring-red-500/30 mb-4">
 <Trash2 className="w-7 h-7 text-red-300" />
 </div>
 <h1 className="font-heading text-2xl font-bold text-text-primary">Project not found</h1>
 <p className="text-text-secondary text-sm mt-2">
 The project may have been deleted or you don't have access.
 </p>
 <Link
 href="/creator/pipeline"
 className="mt-6 inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-studio-500/30 text-studio-300 text-sm font-semibold"
 >
 <ArrowLeft className="w-4 h-4" />
 Back to pipeline
 </Link>
 </div>
 );
 }

 const derivedStatus: SaveStatus = status === 'idle' && isDirty ? 'dirty' : status;

 return (
 <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
 {/* Topbar: back link + title + pills + save indicator + delete */}
 <div className="flex items-center gap-3 mb-4">
 <Link
 href="/creator/pipeline"
 className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
 aria-label="Back to pipeline"
 >
 <ArrowLeft className="w-4 h-4" />
 </Link>
 <div className="min-w-0 flex-1">
 <div className="flex items-center gap-2 flex-wrap">
 <StatusPill status={form.status} size="sm" />
 <TypePill type={form.type} size="sm" />
 {form.tags.slice(0, 3).map((t) => (
 <span
 key={t}
 className="px-1.5 h-5 text-[10px] rounded-full bg-darkcard/60 border border-darkborder text-text-muted inline-flex items-center"
 >
 #{t}
 </span>
 ))}
 </div>
 <h1 className="font-heading text-lg sm:text-xl font-bold text-text-primary truncate mt-1">
 {form.title}
 </h1>
 </div>
 <SaveIndicator status={derivedStatus} lastSavedAt={lastSavedAt} />
 <button
 type="button"
 onClick={handleDelete}
 className="p-2 rounded-lg text-text-muted hover:text-red-300 hover:bg-red-500/10 transition-colors"
 aria-label="Delete project"
 title="Delete project"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>

 {/* Tab strip — horizontal scroll on small screens */}
 <div className="border-b border-darkborder mb-5 -mx-4 px-4 sm:-mx-6 sm:px-6 overflow-x-auto">
 <nav className="flex items-center gap-1 min-w-max">
 {TABS.map((tab) => {
 const isActive = activeTab === tab.id;
 const isFuture = typeof tab.phase === 'number' && tab.phase > 4;
 const Icon = tab.icon;
 return (
 <button
 key={tab.id}
 type="button"
 onClick={() => handleTabChange(tab.id)}
 className={`group flex items-center gap-1.5 px-3 h-10 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
 isActive
 ? 'border-studio-500 text-studio-300'
 : 'border-transparent text-text-muted hover:text-text-primary'
 }`}
 >
 <Icon className={`w-4 h-4 ${isActive ? 'text-studio-400' : 'text-text-muted'}`} />
 {tab.label}
 {isFuture && (
 <span className="ml-1 text-[9px] uppercase tracking-wider text-text-muted/70 bg-darkcard/60 border border-darkborder rounded-full px-1.5 h-4 inline-flex items-center">
 Phase {tab.phase}
 </span>
 )}
 </button>
 );
 })}
 </nav>
 </div>

 {/* Tab content */}
 <AnimatePresence mode="wait">
 <motion.div
 key={activeTab}
 initial={{ opacity: 0, y: 6 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -6 }}
 transition={{ duration: 0.2 }}
 >
 {activeTab === 'overview' && (
 <OverviewTab
 project={form}
 onChange={(patch) =>
 setForm((prev) => (prev ? { ...prev, ...patch } : prev))
 }
 />
 )}
 {activeTab === 'storyboard' && (
 <StoryboardTab
 days={form.days}
 onChange={(days) => setForm((prev) => (prev ? { ...prev, days } : prev))}
 />
 )}
 {activeTab === 'teleprompter' && <TeleprompterTab project={form} />}
 {activeTab !== 'overview' &&
 activeTab !== 'storyboard' &&
 activeTab !== 'teleprompter' && (
 <ComingSoonTab
 tabId={activeTab}
 tabLabel={TABS.find((t) => t.id === activeTab)?.label ?? ''}
 phase={TABS.find((t) => t.id === activeTab)?.phase ?? 7}
 />
 )}
 </motion.div>
 </AnimatePresence>
 </div>
 );
}

// ─── Helpers ─────────────────────────────────────────────────────

/**
 * Build the PUT payload from the current form. The
 * server is idempotent (replaceChildren) so we always
 * send the *full desired state* — never partial patches.
 * `updatedAt` / `createdAt` / `id` are not editable so
 * we strip them.
 */
function buildPayload(form: ContentProject) {
 return {
 title: form.title,
 type: form.type,
 status: form.status,
 concept: form.concept,
 mainHook: form.mainHook,
 thumbnailUrl: form.thumbnailUrl,
 ideaDate: form.ideaDate,
 filmDate: form.filmDate,
 publishDate: form.publishDate,
 tags: form.tags,
 // The form may keep referenceLinks as null (initial
 // state from the server). The API type expects
 // undefined-or-array, so we normalise to [] on the way
 // out — easier than fighting null in every consumer.
 referenceLinks: form.referenceLinks ?? [],
 days: form.days.map((d: ContentProductionDay) => ({
 id: d.id,
 dayNumber: d.dayNumber,
 date: d.date,
 location: d.location,
 notes: d.notes,
 order: d.order,
 scenes: d.scenes.map((s) => ({
 id: s.id,
 sceneNumber: s.sceneNumber,
 sceneType: s.sceneType,
 dialogue: s.dialogue,
 voiceover: s.voiceover,
 action: s.action,
 cameraAngle: s.cameraAngle,
 shotType: s.shotType,
 props: s.props,
 brollNotes: s.brollNotes,
 editingNotes: s.editingNotes,
 durationSeconds: s.durationSeconds,
 storyboardImageUrl: s.storyboardImageUrl,
 order: s.order,
 })),
 })),
 affiliateProducts: form.affiliateProducts.map((p: ContentAffiliateProduct) => ({
 id: p.id,
 name: p.name,
 url: p.url,
 discountCode: p.discountCode,
 commissionPercent: p.commissionPercent,
 revenue: p.revenue,
 notes: p.notes,
 order: p.order,
 })),
 platformPosts: form.platformPosts.map((p: ContentPlatformPost) => ({
 id: p.id,
 platform: p.platform,
 caption: p.caption,
 hashtags: p.hashtags,
 scheduledTime: p.scheduledTime,
 postUrl: p.postUrl,
 isPublished: p.isPublished,
 order: p.order,
 })),
 checklistItems: form.checklistItems.map((c: ContentChecklistItem) => ({
 id: c.id,
 phase: c.phase,
 label: c.label,
 done: c.done,
 order: c.order,
 })),
 performance: form.performance as ContentPerformance | null,
 };
}

// ─── Coming-soon tab stub ───────────────────────────────────────

function ComingSoonTab({
 tabId,
 tabLabel,
 phase,
}: {
 tabId: string;
 tabLabel: string;
 phase: number;
}) {
 const icon =
 tabId === 'script' ? Pencil
 : tabId === 'shotlist' ? ImageIcon
 : tabId === 'platforms' ? Megaphone
 : tabId === 'checklist' ? CheckSquare
 : tabId === 'performance' ? Sparkles
 : Package;
 const Icon = icon;
 return (
 <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/30 p-10 text-center">
 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-studio-500/15 ring-1 ring-studio-500/30 mb-4">
 <Icon className="w-7 h-7 text-studio-400" />
 </div>
 <h2 className="font-heading text-xl font-semibold text-text-primary mb-1">
 {tabLabel}
 </h2>
 <p className="text-text-secondary text-sm max-w-md mx-auto">
 This tab ships in Phase {phase}. For now, the 3 active
 tabs (Overview · Storyboard · Teleprompter) cover the
 core planning + scripting workflow.
 </p>
 <div className="mt-5 inline-flex items-center gap-2 px-3 h-8 rounded-full bg-studio-500/10 text-studio-300 text-xs font-semibold uppercase tracking-wider">
 <Package className="w-3.5 h-3.5" />
 Arriving in Phase {phase}
 </div>
 </div>
 );
}
