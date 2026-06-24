'use client';

// CreateProjectModal — the modal that opens when the user
// clicks "+ New project" anywhere in the /creator area.
//
// Why a single global modal (controlled by studioStore)
// instead of a route or a per-page local state?
// 1. The trigger lives in StudioTopbar, which is rendered
// on every /creator/* route — including the per-project
// editor. A route-based modal would force a navigation
// out of the editor. A local-state modal would have to
// be duplicated in 6+ places.
// 2. The Calendar's "Plan a project on this day" flow
// also wants to pre-fill the filmDate field. Routing
// that through a shared store keeps the field-set
// consistent.
//
// What the modal does:
// - Minimal required field: title (validated client-side,
// also required by the server).
// - Optional fields: type (default VLOG), concept (textarea),
// ideaDate, filmDate, publishDate, mainHook.
// - On submit, calls useCreateContentProject(); on success
// navigates to /creator/projects/<newId> so the user lands
// directly in the editor to flesh it out.
// - Backdrop click + Escape key both close the modal.
// - While pending, the submit button shows a spinner and
// the form is disabled.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
 X,
 Plus,
 Loader2,
 Calendar as CalendarIcon,
 Film,
 Send,
 Type as TypeIcon,
 Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

import { useCreateContentProject } from '@/hooks/useContentQueries';
import { useStudioStore } from '@/store/studioStore';
import { CONTENT_TYPE_META } from '@/lib/studio-meta';
import type { ContentProjectCreate, ContentType } from '@/types';
import { cn } from '@/lib/utils';

const TYPE_OPTIONS: ContentType[] = [
 'VLOG',
 'AFFILIATE',
 'CODE_REVIEW',
 'REVIEW',
 'IDEA',
 'OTHER',
];

export default function CreateProjectModal() {
 const isOpen = useStudioStore((s) => s.isCreateModalOpen);
 const preFill = useStudioStore((s) => s.preFill);
 const close = useStudioStore((s) => s.closeCreateModal);
 const open = useStudioStore((s) => s.openCreateModal);

 const router = useRouter();
 const create = useCreateContentProject();

 // Local form state. We reset it every time the modal
 // opens (or preFill changes) so the user always starts
 // from a clean slate.
 const [title, setTitle] = useState('');
 const [type, setType] = useState<ContentType>('VLOG');
 const [concept, setConcept] = useState('');
 const [mainHook, setMainHook] = useState('');
 const [ideaDate, setIdeaDate] = useState('');
 const [filmDate, setFilmDate] = useState('');
 const [publishDate, setPublishDate] = useState('');
 const [tagsInput, setTagsInput] = useState('');
 const [tags, setTags] = useState<string[]>([]);

 // Reset form on open. We use a small effect + a
 // `lastOpen` ref so the reset only runs on transitions
 // from closed→open, not on every render.
 useEffect(() => {
 if (!isOpen) return;
 setTitle('');
 setType(preFill?.type ?? 'VLOG');
 setConcept('');
 setMainHook('');
 setIdeaDate('');
 setFilmDate(preFill?.filmDate ?? '');
 setPublishDate(preFill?.publishDate ?? '');
 setTagsInput('');
 setTags([]);
 // We intentionally exclude `preFill` from the deps
 // array — pre-fill is only read on the open transition.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [isOpen]);

 // Escape to close.
 useEffect(() => {
 if (!isOpen) return;
 const onKey = (e: KeyboardEvent) => {
 if (e.key === 'Escape' && !create.isPending) close();
 };
 document.addEventListener('keydown', onKey);
 return () => document.removeEventListener('keydown', onKey);
 }, [isOpen, create.isPending, close]);

 // Lock body scroll while modal is open.
 useEffect(() => {
 if (!isOpen) return;
 const prev = document.body.style.overflow;
 document.body.style.overflow = 'hidden';
 return () => {
 document.body.style.overflow = prev;
 };
 }, [isOpen]);

 const addTag = () => {
 const t = tagsInput.trim();
 if (!t) return;
 if (tags.includes(t)) {
 setTagsInput('');
 return;
 }
 setTags([...tags, t]);
 setTagsInput('');
 };

 const removeTag = (t: string) =>
 setTags(tags.filter((x) => x !== t));

 const canSubmit = title.trim().length > 0 && !create.isPending;

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!canSubmit) return;

 const payload: ContentProjectCreate = {
 title: title.trim(),
 type,
 status: 'IDEA', // New projects always start in the IDEA column.
 concept: concept.trim() || null,
 mainHook: mainHook.trim() || null,
 ideaDate: ideaDate || null,
 filmDate: filmDate || null,
 publishDate: publishDate || null,
 tags: tags.length > 0 ? tags : undefined,
 };

 try {
 const res = await create.mutateAsync(payload);
 // Axios response shape: { data: { data: ContentProject, success, message } }
 const newId = res?.data?.data?.id;
 close();
 if (typeof newId === 'number') {
 router.push(`/creator/projects/${newId}`);
 } else {
 // Fallback: just close the modal and stay where we are.
 router.refresh();
 }
 } catch (err: any) {
 const msg =
 err?.response?.data?.message ??
 err?.message ??
 'Could not create project';
 toast.error(msg);
 }
 };

 return (
 <AnimatePresence>
 {isOpen && (
 <>
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
 onClick={() => !create.isPending && close()}
 />

 {/* Dialog wrapper */}
 <div
 className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6"
 role="dialog"
 aria-modal="true"
 aria-labelledby="new-project-title"
 >
 <motion.div
 initial={{ opacity: 0, y: 16, scale: 0.97 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 8, scale: 0.97 }}
 transition={{ duration: 0.22, ease: [0.32, 0.94, 0.6, 1] }}
 className="pointer-events-auto flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-studio-500/20 bg-[#0d0f18]/95 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
 onClick={(e) => e.stopPropagation()}
 >
 {/* Header */}
 <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
 <div className="flex items-center gap-2.5">
 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-studio-gradient shadow-[0_0_18px_rgba(245,158,11,0.35)]">
 <Plus className="w-4 h-4 text-studio-950" strokeWidth={2.6} />
 </div>
 <div>
 <h2
 id="new-project-title"
 className="text-sm font-semibold text-text-primary"
 >
 New project
 </h2>
 <p className="text-[11px] text-text-muted">
 Start a new video project. You can flesh it out in the editor.
 </p>
 </div>
 </div>
 <button
 type="button"
 onClick={() => !create.isPending && close()}
 disabled={create.isPending}
 aria-label="Close"
 className="w-7 h-7 rounded-md inline-flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/5 disabled:opacity-40"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </div>

 {/* Body (scrollable) */}
 <form
 onSubmit={handleSubmit}
 className="flex flex-col min-h-0 flex-1 overflow-y-auto"
 >
 <div className="px-5 py-4 space-y-4">
 {/* Title */}
 <div>
 <label
 htmlFor="cp-title"
 className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5"
 >
 Project title <span className="text-studio-400">*</span>
 </label>
 <input
 id="cp-title"
 type="text"
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 placeholder="e.g. 5 chiêu Vue 3 mà tôi ước mình biết sớm hơn"
 disabled={create.isPending}
 autoFocus
 className="w-full h-10 px-3 rounded-lg bg-bg-elevated/60 ring-1 ring-studio-500/15 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-studio-500/40 disabled:opacity-50"
 />
 </div>

 {/* Type picker */}
 <div>
 <label className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1">
 <TypeIcon className="w-3 h-3" /> Type
 </label>
 <div className="flex flex-wrap gap-1.5">
 {TYPE_OPTIONS.map((t) => {
 const meta = CONTENT_TYPE_META[t];
 const active = t === type;
 return (
 <button
 key={t}
 type="button"
 onClick={() => setType(t)}
 disabled={create.isPending}
 className={cn(
 'inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all',
 'disabled:opacity-50',
 active
 ? 'bg-studio-500/20 text-studio-200 ring-1 ring-studio-500/40'
 : 'bg-bg-elevated/40 text-text-secondary ring-1 ring-studio-500/10 hover:ring-studio-500/25 hover:text-text-primary',
 )}
 >
 <span className="text-sm leading-none">{meta.emoji}</span>
 {meta.label}
 </button>
 );
 })}
 </div>
 </div>

 {/* Main hook (one-liner pitch) */}
 <div>
 <label
 htmlFor="cp-hook"
 className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1"
 >
 <Sparkles className="w-3 h-3" /> Main hook (one-liner pitch)
 </label>
 <input
 id="cp-hook"
 type="text"
 value={mainHook}
 onChange={(e) => setMainHook(e.target.value)}
 placeholder="Why would someone click? e.g. Most devs pick the wrong state manager."
 disabled={create.isPending}
 className="w-full h-9 px-3 rounded-lg bg-bg-elevated/60 ring-1 ring-studio-500/15 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-studio-500/40 disabled:opacity-50"
 />
 </div>

 {/* Concept */}
 <div>
 <label
 htmlFor="cp-concept"
 className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5"
 >
 Concept (longer description)
 </label>
 <textarea
 id="cp-concept"
 value={concept}
 onChange={(e) => setConcept(e.target.value)}
 placeholder="What is the video about? What's the angle?"
 rows={3}
 disabled={create.isPending}
 className="w-full px-3 py-2 rounded-lg bg-bg-elevated/60 ring-1 ring-studio-500/15 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-studio-500/40 resize-y disabled:opacity-50"
 />
 </div>

 {/* Dates row */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 <DateField
 id="cp-idea"
 label="Idea date"
 icon={CalendarIcon}
 value={ideaDate}
 onChange={setIdeaDate}
 disabled={create.isPending}
 />
 <DateField
 id="cp-film"
 label="Film date"
 icon={Film}
 value={filmDate}
 onChange={setFilmDate}
 disabled={create.isPending}
 />
 <DateField
 id="cp-publish"
 label="Publish date"
 icon={Send}
 value={publishDate}
 onChange={setPublishDate}
 disabled={create.isPending}
 />
 </div>

 {/* Tags */}
 <div>
 <label
 htmlFor="cp-tags"
 className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5"
 >
 Tags
 </label>
 <div className="flex flex-wrap items-center gap-1.5 px-2 py-1.5 min-h-[2.5rem] rounded-lg bg-bg-elevated/60 ring-1 ring-studio-500/15 focus-within:ring-2 focus-within:ring-studio-500/40">
 {tags.map((t) => (
 <span
 key={t}
 className="inline-flex items-center gap-1 px-2 h-6 rounded-md bg-studio-500/15 text-studio-200 text-[11px] font-medium ring-1 ring-studio-500/25"
 >
 {t}
 <button
 type="button"
 onClick={() => removeTag(t)}
 disabled={create.isPending}
 className="text-studio-300 hover:text-studio-100 disabled:opacity-40"
 aria-label={`Remove ${t}`}
 >
 <X className="w-3 h-3" />
 </button>
 </span>
 ))}
 <input
 id="cp-tags"
 type="text"
 value={tagsInput}
 onChange={(e) => setTagsInput(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === 'Enter' || e.key === ',') {
 e.preventDefault();
 addTag();
 } else if (
 e.key === 'Backspace' &&
 tagsInput === '' &&
 tags.length > 0
 ) {
 setTags(tags.slice(0, -1));
 }
 }}
 onBlur={addTag}
 placeholder={tags.length === 0 ? 'vue, tutorial, ...' : ''}
 disabled={create.isPending}
 className="flex-1 min-w-[8ch] bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none disabled:opacity-50"
 />
 </div>
 <p className="mt-1 text-[10px] text-text-muted">
 Press Enter or comma to add a tag.
 </p>
 </div>
 </div>

 {/* Footer */}
 <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] px-5 py-3 bg-black/20">
 <p className="text-[11px] text-text-muted">
 New projects start in the <span className="text-studio-300">Idea</span> column.
 </p>
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => !create.isPending && close()}
 disabled={create.isPending}
 className="h-9 px-3 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 disabled:opacity-40"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={!canSubmit}
 className="h-9 px-4 rounded-lg bg-studio-gradient text-studio-950 text-sm font-semibold shadow-[0_0_18px_rgba(245,158,11,0.3)] hover:shadow-[0_0_24px_rgba(245,158,11,0.5)] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
 >
 {create.isPending ? (
 <>
 <Loader2 className="w-3.5 h-3.5 animate-spin" />
 Creating…
 </>
 ) : (
 <>
 <Plus className="w-3.5 h-3.5" strokeWidth={2.6} />
 Create project
 </>
 )}
 </button>
 </div>
 </div>
 </form>
 </motion.div>
 </div>
 </>
 )}
 </AnimatePresence>
 );
 }

// ─── Date field helper ─────────────────────────────────────────────
function DateField({
 id,
 label,
 icon: Icon,
 value,
 onChange,
 disabled,
}: {
 id: string;
 label: string;
 icon: React.ComponentType<{ className?: string }>;
 value: string;
 onChange: (v: string) => void;
 disabled?: boolean;
}) {
 return (
 <div>
 <label
 htmlFor={id}
 className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1"
 >
 <Icon className="w-3 h-3" />
 {label}
 </label>
 <input
 id={id}
 type="date"
 value={value}
 onChange={(e) => onChange(e.target.value)}
 disabled={disabled}
 className="w-full h-9 px-2 rounded-lg bg-bg-elevated/60 ring-1 ring-studio-500/15 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-studio-500/40 disabled:opacity-50 [color-scheme:dark]"
 />
 </div>
 );
}
