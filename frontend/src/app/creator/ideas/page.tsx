'use client';

// /creator/ideas — Idea Bank.
//
// Phase 5. A lightweight capture-first surface for
// half-baked video ideas. The shape is intentionally
// different from /creator (dashboard) and
// /creator/pipeline (kanban) so it stays fun to use:
// a big "capture" form up top, a status filter, and
// a card grid of ideas below. Each card exposes the
// promote-to-project action — that's the moment the
// idea becomes a real production record.

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
 Lightbulb,
 Plus,
 Search,
 Star,
 Tag as TagIcon,
 ArrowUpRight,
 Archive,
 ArchiveRestore,
 Trash2,
 Sparkles,
 Filter,
 X,
 CheckCircle2,
 CircleDashed,
} from 'lucide-react';
import {
 useContentIdeas,
 useCreateContentIdea,
 useDeleteContentIdea,
 usePromoteContentIdea,
 useUpdateContentIdea,
} from '@/hooks/useContentQueries';
import { IDEA_STATUS_META } from '@/lib/studio-meta';
import type { ContentIdea, IdeaStatus } from '@/types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const STATUS_TABS: Array<{ value: IdeaStatus | 'ALL'; label: string }> = [
 { value: 'ALL', label: 'All' },
 { value: 'CAPTURED', label: IDEA_STATUS_META.CAPTURED.label },
 { value: 'REFINED', label: IDEA_STATUS_META.REFINED.label },
 { value: 'PROMOTED', label: IDEA_STATUS_META.PROMOTED.label },
 { value: 'ARCHIVED', label: IDEA_STATUS_META.ARCHIVED.label },
];

// ─── Capture form ─────────────────────────────────────────────────
// A simple "type and go" capture box. Press Enter or
// click "Capture" to save. We deliberately keep the
// fields minimal (title + optional hook) — full notes
// and score are set on the card detail later.
function CaptureForm() {
 const [title, setTitle] = useState('');
 const [hook, setHook] = useState('');
 const create = useCreateContentIdea();

 const submit = (e: React.FormEvent) => {
 e.preventDefault();
 const t = title.trim();
 if (!t) return;
 create.mutate(
 { title: t, hook: hook.trim() || null },
 {
 onSuccess: () => {
 setTitle('');
 setHook('');
 },
 },
 );
 };

 return (
 <form
 onSubmit={submit}
 className="studio-glass rounded-2xl p-4 sm:p-5 shadow-studio-card"
 >
 <div className="flex items-start gap-3">
 <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-studio-500/15 ring-1 ring-studio-500/30 shrink-0 mt-1">
 <Lightbulb className="w-4.5 h-4.5 text-studio-400" />
 </div>
 <div className="flex-1 space-y-2">
 <input
 type="text"
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 placeholder="Tóm tắt ý tưởng trong 1 câu..."
 maxLength={140}
 className="w-full bg-transparent text-base sm:text-lg font-medium text-text-primary placeholder:text-text-muted focus:outline-none"
 />
 <input
 type="text"
 value={hook}
 onChange={(e) => setHook(e.target.value)}
 placeholder="Hook (tuỳ chọn) — câu mở đầu khi lên video"
 maxLength={280}
 className="w-full bg-transparent text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
 />
 <div className="flex items-center justify-between pt-1">
 <span className="text-xs text-text-muted">
 {title.length}/140 · {hook.length}/280
 </span>
 <button
 type="submit"
 disabled={!title.trim() || create.isPending}
 className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-studio-500 hover:bg-studio-400 text-bg-base text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {create.isPending ? (
 <CircleDashed className="w-4 h-4 animate-spin" />
 ) : (
 <Plus className="w-4 h-4" />
 )}
 Capture
 </button>
 </div>
 </div>
 </div>
 </form>
 );
}

// ─── Idea card ────────────────────────────────────────────────────
// One card per idea. The status pill lives in the
// corner; the title + hook + tags + score fill the
// body; the action row holds archive / delete /
// promote. The promote button is the only "real"
// navigation (it creates a project + jumps to the
// editor).
function IdeaCard({
 idea,
 onPromote,
 onArchive,
 onUnarchive,
 onDelete,
 onRate,
 isPromoting,
}: {
 idea: ContentIdea;
 onPromote: () => void;
 onArchive: () => void;
 onUnarchive: () => void;
 onDelete: () => void;
 onRate: (score: number) => void;
 isPromoting: boolean;
}) {
 const meta = IDEA_STATUS_META[idea.status];
 const created = new Date(idea.createdAt);
 const days = Math.max(
 0,
 Math.floor((Date.now() - created.getTime()) / 86_400_000),
 );

 return (
 <motion.article
 layout
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.96 }}
 transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
 className="group studio-glass rounded-2xl p-4 sm:p-5 shadow-studio-card hover:shadow-studio-card-hover transition-shadow flex flex-col gap-3"
 >
 {/* Top row: status pill + score */}
 <div className="flex items-center justify-between">
 <span
 className="inline-flex items-center gap-1.5 px-2 h-6 rounded-full text-[11px] font-semibold uppercase tracking-wider"
 style={{ backgroundColor: meta.tint, color: meta.color }}
 >
 <span
 className="w-1.5 h-1.5 rounded-full"
 style={{ backgroundColor: meta.color }}
 />
 {meta.label}
 </span>
 <ScoreStars score={idea.score} onRate={onRate} />
 </div>

 {/* Body: title + hook + notes */}
 <div>
 <h3 className="text-base font-semibold text-text-primary leading-snug line-clamp-3">
 {idea.title}
 </h3>
 {idea.hook && (
 <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">
 {idea.hook}
 </p>
 )}
 {idea.notes && (
 <p className="mt-2 text-xs text-text-muted line-clamp-2 italic">
 "{idea.notes}"
 </p>
 )}
 </div>

 {/* Tags */}
 {idea.tags.length > 0 && (
 <div className="flex flex-wrap gap-1.5">
 {idea.tags.slice(0, 5).map((tag) => (
 <span
 key={tag}
 className="inline-flex items-center gap-1 px-2 h-5 rounded-md bg-studio-500/10 text-studio-300 text-[10px] font-medium"
 >
 <TagIcon className="w-2.5 h-2.5" />
 {tag}
 </span>
 ))}
 {idea.tags.length > 5 && (
 <span className="text-[10px] text-text-muted">
 +{idea.tags.length - 5}
 </span>
 )}
 </div>
 )}

 {/* Footer: meta + actions */}
 <div className="mt-auto pt-3 border-t border-studio-500/10 flex items-center justify-between gap-2">
 <span className="text-[11px] text-text-muted">
 {days === 0 ? 'Today' : `${days}d ago`}
 </span>
 <div className="flex items-center gap-1">
 {/* Promote (or "open project" if already promoted) */}
 {idea.status === 'PROMOTED' && idea.promotedToProjectId ? (
 <Link
 href={`/creator/projects/${idea.promotedToProjectId}`}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-emerald-500/15 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
 >
 <ArrowUpRight className="w-3 h-3" />
 Open project
 </Link>
 ) : (
 <button
 type="button"
 onClick={onPromote}
 disabled={isPromoting}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-studio-500/15 text-studio-300 text-xs font-semibold hover:bg-studio-500/25 transition-colors disabled:opacity-50"
 >
 {isPromoting ? (
 <CircleDashed className="w-3 h-3 animate-spin" />
 ) : (
 <Sparkles className="w-3 h-3" />
 )}
 Promote
 </button>
 )}

 {idea.status === 'ARCHIVED' ? (
 <IconButton
 icon={ArchiveRestore}
 onClick={onUnarchive}
 label="Restore"
 />
 ) : (
 <IconButton icon={Archive} onClick={onArchive} label="Archive" />
 )}
 <IconButton
 icon={Trash2}
 onClick={onDelete}
 label="Delete"
 danger
 />
 </div>
 </div>
 </motion.article>
 );
}

// Score stars — 1..5. Click to set; click same to
// clear. Keeps the control compact inside the card.
function ScoreStars({
 score,
 onRate,
}: {
 score: number | null;
 onRate: (score: number) => void;
}) {
 const value = score ?? 0;
 return (
 <div className="inline-flex items-center gap-0.5">
 {[1, 2, 3, 4, 5].map((n) => (
 <button
 key={n}
 type="button"
 onClick={() => onRate(value === n ? 0 : n)}
 className="text-studio-400/60 hover:text-studio-400 transition-colors"
 aria-label={`Rate ${n}`}
 >
 <Star
 className="w-3.5 h-3.5"
 fill={n <= value ? 'currentColor' : 'none'}
 strokeWidth={1.5}
 />
 </button>
 ))}
 </div>
 );
}

function IconButton({
 icon: Icon,
 onClick,
 label,
 danger,
}: {
 icon: React.ComponentType<{ className?: string }>;
 onClick: () => void;
 label: string;
 danger?: boolean;
}) {
 return (
 <button
 type="button"
 onClick={onClick}
 aria-label={label}
 title={label}
 className={`inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
 danger
 ? 'text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10'
 : 'text-text-muted hover:text-text-primary hover:bg-studio-500/15'
 }`}
 >
 <Icon className="w-3.5 h-3.5" />
 </button>
 );
}

// ─── Filter bar ────────────────────────────────────────────────────
// Status tab + search input. Counts inside the tabs
// come from the unfiltered list so the user can see
// "5 captured, 2 refined" at a glance.
function FilterBar({
 active,
 onChange,
 counts,
 search,
 onSearch,
}: {
 active: IdeaStatus | 'ALL';
 onChange: (s: IdeaStatus | 'ALL') => void;
 counts: Record<IdeaStatus | 'ALL', number>;
 search: string;
 onSearch: (v: string) => void;
}) {
 return (
 <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
 <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-bg-elevated/60 ring-1 ring-studio-500/15 overflow-x-auto">
 {STATUS_TABS.map((tab) => {
 const count = counts[tab.value] ?? 0;
 const isActive = active === tab.value;
 return (
 <button
 key={tab.value}
 type="button"
 onClick={() => onChange(tab.value)}
 className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
 isActive
 ? 'bg-studio-500/20 text-studio-200 ring-1 ring-studio-500/30'
 : 'text-text-muted hover:text-text-primary'
 }`}
 >
 {tab.label}
 <span
 className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] ${
 isActive
 ? 'bg-studio-500 text-bg-base'
 : 'bg-bg-base/50 text-text-muted'
 }`}
 >
 {count}
 </span>
 </button>
 );
 })}
 </div>
 <div className="flex-1 sm:max-w-xs relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
 <input
 type="text"
 value={search}
 onChange={(e) => onSearch(e.target.value)}
 placeholder="Search ideas..."
 className="w-full h-10 pl-9 pr-9 rounded-xl bg-bg-elevated/60 ring-1 ring-studio-500/15 focus:ring-studio-500/40 focus:outline-none text-sm text-text-primary placeholder:text-text-muted"
 />
 {search && (
 <button
 type="button"
 onClick={() => onSearch('')}
 aria-label="Clear search"
 className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-text-muted hover:text-text-primary hover:bg-studio-500/15 inline-flex items-center justify-center"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 </div>
 );
}

// ─── Empty state ───────────────────────────────────────────────────
function EmptyState({ filtered }: { filtered: boolean }) {
 return (
 <div className="text-center py-16">
 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-studio-500/10 ring-1 ring-studio-500/20 mb-4">
 <Lightbulb className="w-7 h-7 text-studio-400/60" />
 </div>
 <h3 className="text-base font-semibold text-text-primary">
 {filtered ? 'No ideas match' : 'Your idea bank is empty'}
 </h3>
 <p className="mt-1 text-sm text-text-secondary max-w-sm mx-auto">
 {filtered
 ? 'Try a different status filter or clear the search box.'
 : 'Drop a title in the capture form above. Refine later, promote when ready.'}
 </p>
 </div>
 );
}

// ─── Page ──────────────────────────────────────────────────────────
export default function IdeasPage() {
 const router = useRouter();
 const [statusFilter, setStatusFilter] = useState<IdeaStatus | 'ALL'>('ALL');
 const [rawSearch, setRawSearch] = useState('');
 const debouncedSearch = useDebouncedValue(rawSearch, 250);

 // Fetch all ideas (so the tab counts are correct)
 // and a separate filtered set for the grid.
 const all = useContentIdeas({ take: 200 });
 const filtered = useContentIdeas({
 status: statusFilter === 'ALL' ? undefined : statusFilter,
 search: debouncedSearch || undefined,
 take: 100,
 });

 const update = useUpdateContentIdea();
 const remove = useDeleteContentIdea();
 const promote = usePromoteContentIdea();

 // Tab counts — derived from the unfiltered list.
 const counts = useMemo(() => {
 const base: Record<IdeaStatus | 'ALL', number> = {
 ALL: 0,
 CAPTURED: 0,
 REFINED: 0,
 PROMOTED: 0,
 ARCHIVED: 0,
 };
 for (const idea of all.data?.items ?? []) {
 base.ALL++;
 base[idea.status]++;
 }
 return base;
 }, [all.data]);

 const handlePromote = (id: number) => {
 promote.mutate(id, {
 onSuccess: (res) => {
 // The server message is "redirectTo=/creator/projects/N"
 const m = /redirectTo=(\/creator\/projects\/\d+)/.exec(
 res.data.message ?? '',
 );
 const target = m?.[1] ?? '/creator';
 router.push(target);
 },
 });
 };

 const handleArchive = (idea: ContentIdea) =>
 update.mutate({
 id: idea.id,
 payload: { status: 'ARCHIVED' },
 });
 const handleUnarchive = (idea: ContentIdea) =>
 update.mutate({
 id: idea.id,
 payload: { status: idea.hook ? 'REFINED' : 'CAPTURED' },
 });
 const handleDelete = (idea: ContentIdea) => {
 if (!confirm(`Delete idea "${idea.title}"? This cannot be undone.`)) return;
 remove.mutate(idea.id);
 };
 const handleRate = (idea: ContentIdea, score: number) =>
 update.mutate({
 id: idea.id,
 payload: { score: score === 0 ? null : score },
 });

 const items = filtered.data?.items ?? [];
 const isLoading = all.isLoading || filtered.isLoading;
 const isFiltered = statusFilter !== 'ALL' || debouncedSearch.length > 0;

 return (
 <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto space-y-6">
 {/* Header */}
 <div className="flex items-end justify-between gap-4">
 <div>
 <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
 Idea Bank
 </h1>
 <p className="mt-1 text-sm text-text-secondary">
 Capture sparks. Promote to a project when ready.
 </p>
 </div>
 <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
 <Filter className="w-3.5 h-3.5" />
 {counts.ALL} idea{counts.ALL === 1 ? '' : 's'} total
 </div>
 </div>

 {/* Capture */}
 <CaptureForm />

 {/* Filters */}
 <FilterBar
 active={statusFilter}
 onChange={setStatusFilter}
 counts={counts}
 search={rawSearch}
 onSearch={setRawSearch}
 />

 {/* Grid */}
 {isLoading ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {[...Array(6)].map((_, i) => (
 <div
 key={i}
 className="studio-glass rounded-2xl p-5 h-44 animate-pulse"
 />
 ))}
 </div>
 ) : items.length === 0 ? (
 <EmptyState filtered={isFiltered} />
 ) : (
 <AnimatePresence mode="popLayout">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {items.map((idea) => (
 <IdeaCard
 key={idea.id}
 idea={idea}
 isPromoting={
 promote.isPending && promote.variables === idea.id
 }
 onPromote={() => handlePromote(idea.id)}
 onArchive={() => handleArchive(idea)}
 onUnarchive={() => handleUnarchive(idea)}
 onDelete={() => handleDelete(idea)}
 onRate={(score) => handleRate(idea, score)}
 />
 ))}
 </div>
 </AnimatePresence>
 )}

 {/* Footer hint: promoted items show a marker */}
 {counts.PROMOTED > 0 && (
 <div className="flex items-center gap-2 text-xs text-text-muted pt-2">
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
 {counts.PROMOTED} idea{counts.PROMOTED === 1 ? '' : 's'} promoted to a project.{' '}
 <Link
 href="/creator/pipeline"
 className="text-studio-400 hover:text-studio-300 underline-offset-2 hover:underline"
 >
 See pipeline →
 </Link>
 </div>
 )}
 </div>
 );
}
