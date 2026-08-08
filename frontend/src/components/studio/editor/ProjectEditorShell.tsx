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
// All 8 tabs are implemented. (The old `phase?: number`
// field on TabDef and its "Arriving in Phase N" stub were
// left over from the staged build-out; no tab has carried a
// phase number since Phase 7 shipped, so the stub was
// unreachable and has been removed rather than translated.)

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
 ArrowLeft,
 Check,
 CheckSquare,
 ChevronDown,
 Clapperboard,
 Film,
 Image as ImageIcon,
 LayoutDashboard,
 Megaphone,
 Mic,
 Pencil,
 Save,
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
import ScriptTab from './ScriptTab';
import ShotlistTab from './ShotlistTab';
import PlatformsTab from './PlatformsTab';
import ChecklistTab from './ChecklistTab';
import PerformanceTab from './PerformanceTab';
import { CONTENT_STATUS_META, STATUS_ORDER } from '@/lib/studio-meta';
import { pick, useStudioT, type StudioKey, type StudioLang } from '@/lib/studio-i18n';
import type {
 ContentAffiliateProduct,
 ContentChecklistItem,
 ContentPerformance,
 ContentPlatformPost,
 ContentProject,
 ContentProductionDay,
 ContentStatus,
} from '@/types';

interface TabDef {
 id: string;
 /** i18n key, resolved at render — not a literal, so the tab
  *  strip follows the language switch like everything else. */
 labelKey: StudioKey;
 icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabDef[] = [
 { id: 'overview', labelKey: 'tabOverview', icon: LayoutDashboard },
 { id: 'storyboard', labelKey: 'tabStoryboard', icon: Film },
 { id: 'teleprompter', labelKey: 'tabTeleprompter', icon: Mic },
 { id: 'script', labelKey: 'tabScript', icon: Pencil },
 { id: 'shotlist', labelKey: 'tabShotlist', icon: ImageIcon },
 { id: 'platforms', labelKey: 'tabPlatforms', icon: Megaphone },
 { id: 'checklist', labelKey: 'tabChecklist', icon: CheckSquare },
 { id: 'performance', labelKey: 'tabPerformance', icon: Sparkles },
];

interface ProjectEditorShellProps {
 projectId: number;
}

export default function ProjectEditorShell({ projectId }: ProjectEditorShellProps) {
 const router = useRouter();
 const { t, lang } = useStudioT();
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
 // CRITICAL: only setForm if the new data actually
 // differs from what we already have — otherwise the
 // useEffect on `[form]` below re-fires and re-arms
 // the debounce, causing an infinite PUT loop every
 // 1.2s. Comparing the JSON is cheap (the form is
 // only ~30 fields) and bullet-proof.
 setForm((prev) => {
 if (!prev) return saved;
 if (JSON.stringify(prev) === JSON.stringify({ ...prev, ...saved })) {
 return prev; // no change — bail out
 }
 return { ...prev, ...saved };
 });
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
 if (!confirm(t('confirmDeleteProject', { title: form.title }))) return;
 await flushNow();
 await deleteProject.mutateAsync(projectId);
 router.push('/creator/pipeline');
 };

 if (isLoading) {
 return (
 <div className="flex items-center justify-center h-64 text-text-muted text-sm">
 <Clapperboard className="w-4 h-4 mr-2 animate-pulse" />
 {t('loadingProject')}
 </div>
 );
 }

 if (error || !form) {
 return (
 <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-2xl mx-auto text-center">
 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/15 ring-1 ring-red-500/30 mb-4">
 <Trash2 className="w-7 h-7 text-red-300" />
 </div>
 <h1 className="font-heading text-2xl font-bold text-text-primary">
 {t('projectNotFound')}
 </h1>
 <p className="text-text-secondary text-sm mt-2">{t('projectNotFoundHint')}</p>
 <Link
 href="/creator/pipeline"
 className="mt-6 inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-studio-500/30 text-studio-300 text-sm font-semibold"
 >
 <ArrowLeft className="w-4 h-4" />
 {t('backToPipeline')}
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
 aria-label={t('backToPipeline')}
 >
 <ArrowLeft className="w-4 h-4" />
 </Link>
 <div className="min-w-0 flex-1">
 <div className="flex items-center gap-2 flex-wrap">
 <StatusQuickPicker
 current={form.status}
 lang={lang}
 title={t('fieldStatus')}
 onChange={(s) =>
 setForm((prev) => (prev ? { ...prev, status: s } : prev))
 }
 />
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
 {/* Manual save — autosave runs 1.2s after the last
 edit, but the user can force-save immediately. We
 show the button prominently so people who don't
 realise there's autosave don't feel stuck on
 "Edting" / "Editing" (the production-stage pill
 is a separate control, see StatusQuickPicker). */}
 <button
 type="button"
 onClick={() => {
 void flushNow();
 }}
 disabled={status === 'saving' || !isDirty}
 title={!isDirty ? t('saved') : t('save')}
 className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-studio-500/15 text-studio-200 ring-1 ring-studio-500/30 hover:bg-studio-500/25 hover:ring-studio-500/50 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-studio-500/15"
 >
 <Save className="w-3.5 h-3.5" />
 {status === 'saving' ? t('saving') : t('save')}
 </button>
 <button
 type="button"
 onClick={handleDelete}
 className="p-2 rounded-lg text-text-muted hover:text-red-300 hover:bg-red-500/10 transition-colors"
 aria-label={t('delete')}
 title={t('delete')}
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>

 {/* Tab strip — horizontal scroll on small screens */}
 <div className="border-b border-darkborder mb-5 -mx-4 px-4 sm:-mx-6 sm:px-6 overflow-x-auto">
 <nav className="flex items-center gap-1 min-w-max">
 {TABS.map((tab) => {
 const isActive = activeTab === tab.id;
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
 {t(tab.labelKey)}
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
 {activeTab === 'script' && (
 <ScriptTab
 project={form}
 onChange={(script) => setForm((prev) => (prev ? { ...prev, script } : prev))}
 />
 )}
 {activeTab === 'shotlist' && (
 <ShotlistTab
 days={form.days}
 onChange={(days) => setForm((prev) => (prev ? { ...prev, days } : prev))}
 />
 )}
 {activeTab === 'platforms' && (
 <PlatformsTab
 platforms={form.platformPosts}
 onChange={(platformPosts) =>
 setForm((prev) => (prev ? { ...prev, platformPosts } : prev))
 }
 />
 )}
 {activeTab === 'checklist' && (
 <ChecklistTab
 items={form.checklistItems}
 contentType={form.type}
 scriptLang={form.scriptLang}
 onChange={(checklistItems) =>
 setForm((prev) => (prev ? { ...prev, checklistItems } : prev))
 }
 />
 )}
 {activeTab === 'performance' && (
 <PerformanceTab
 performance={form.performance}
 onChange={(performance) =>
 setForm((prev) => (prev ? { ...prev, performance } : prev))
 }
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
 script: form.script,
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
 // Academy binding + pacing. These must ride along on every
 // autosave: the Overview tab edits them in the same `form`
 // object, and a payload that omits them would let the server's
 // "undefined = leave alone" rule silently discard the edit.
 courseSlug: form.courseSlug,
 courseTitle: form.courseTitle,
 examId: form.examId,
 examTitle: form.examTitle,
 lessonRef: form.lessonRef,
 projectSlug: form.projectSlug,
 seriesName: form.seriesName,
 episodeNumber: form.episodeNumber,
 targetDurationSec: form.targetDurationSec,
 scriptLang: form.scriptLang,
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

// ─── Status quick-picker (topbar) ─────────────────────────────
// A clickable status pill that opens a dropdown of all 6
// statuses. Same shape as StatusPill but acts like a
// <button> + popover. We can't easily extend StatusPill
// to be a button (it's used as a static <span> in 6+
// other places), so we wrap it in a small picker.
function StatusQuickPicker({
 current,
 lang,
 title,
 onChange,
}: {
 current: ContentStatus;
 lang: StudioLang;
 title: string;
 onChange: (s: ContentStatus) => void;
}) {
 const [open, setOpen] = useState(false);
 const ref = useRef<HTMLDivElement>(null);

 // Close on outside click + Escape.
 useEffect(() => {
 if (!open) return;
 const onClick = (e: MouseEvent) => {
 if (ref.current && !ref.current.contains(e.target as Node)) {
 setOpen(false);
 }
 };
 const onKey = (e: KeyboardEvent) => {
 if (e.key === 'Escape') setOpen(false);
 };
 document.addEventListener('mousedown', onClick);
 document.addEventListener('keydown', onKey);
 return () => {
 document.removeEventListener('mousedown', onClick);
 document.removeEventListener('keydown', onKey);
 };
 }, [open]);

 return (
 <div ref={ref} className="relative">
 <button
 type="button"
 onClick={() => setOpen((o) => !o)}
 className="inline-flex items-center gap-1 group"
 aria-haspopup="listbox"
 aria-expanded={open}
 title={title}
 >
 <StatusPill status={current} size="sm" />
 <ChevronDown className="w-3 h-3 text-text-muted group-hover:text-studio-300 transition-colors" />
 </button>
 <AnimatePresence>
 {open && (
 <motion.ul
 initial={{ opacity: 0, y: -4, scale: 0.97 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: -2, scale: 0.97 }}
 transition={{ duration: 0.15 }}
 className="absolute left-0 top-full mt-1.5 z-30 min-w-[180px] py-1 rounded-xl border border-studio-500/20 bg-[#0d0f18]/95 backdrop-blur-2xl shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
 role="listbox"
 >
 {STATUS_ORDER.map((s) => {
 const meta = CONTENT_STATUS_META[s];
 const active = s === current;
 return (
 <li key={s}>
 <button
 type="button"
 onClick={() => {
 onChange(s);
 setOpen(false);
 }}
 className={`w-full flex items-center gap-2 px-3 h-8 text-left text-xs font-medium transition-colors ${
 active
 ? 'bg-studio-500/15 text-studio-200'
 : 'text-text-primary hover:bg-white/5'
 }`}
 role="option"
 aria-selected={active}
 >
 <span
 className="w-1.5 h-1.5 rounded-full"
 style={{ background: meta.color }}
 />
 {pick(meta.label, lang)}
 {active && (
 <Check className="w-3 h-3 ml-auto text-studio-400" />
 )}
 </button>
 </li>
 );
 })}
 </motion.ul>
 )}
 </AnimatePresence>
 </div>
 );
}
