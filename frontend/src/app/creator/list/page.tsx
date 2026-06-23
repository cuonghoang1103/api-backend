'use client';

// /creator/list — dense power-user table view of all content
// projects. Phase 8.
//
// The pipeline (kanban) is great for *moving* work forward;
// the calendar is great for *timing* work. This list is for
// *scanning* the whole catalog at once: sort by date, filter
// by type/status/tag, multi-select rows, bulk update.
//
// Features:
// • Sticky header with sort indicators.
// • Status + type filter pills (single-select each).
// • Debounced search across title.
// • Multi-select with sticky bottom action bar (delete,
// set status, promote-from-idea link).
// • Click row → /creator/projects/:id.
// • Empty state with CTA to capture new project.

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Search,
 Filter,
 ArrowUpDown,
 ChevronUp,
 ChevronDown,
 X,
 Trash2,
 Calendar,
 ListChecks,
 Film,
 Youtube,
 ExternalLink,
 Sparkles,
 Plus,
 Image as ImageIcon,
} from 'lucide-react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
 useContentProjects,
 useUpdateContentStatus,
 useDeleteContentProject,
} from '@/hooks/useContentQueries';
import StatusPill from '@/components/studio/StatusPill';
import TypePill from '@/components/studio/TypePill';
import {
 CONTENT_STATUS_META,
 CONTENT_TYPE_META,
} from '@/lib/studio-meta';
import type {
 ContentProjectSummary,
 ContentStatus,
 ContentType,
} from '@/types';

type SortKey =
 | 'title'
 | 'type'
 | 'status'
 | 'ideaDate'
 | 'filmDate'
 | 'publishDate'
 | 'updatedAt';
type SortDir = 'asc' | 'desc';

const STATUSES: ContentStatus[] = [
 'IDEA',
 'SCRIPTING',
 'FILMING',
 'EDITING',
 'SCHEDULED',
 'PUBLISHED',
];
const TYPES: ContentType[] = [
 'VLOG',
 'AFFILIATE',
 'CODE_REVIEW',
 'REVIEW',
 'IDEA',
 'OTHER',
];

export default function CreatorListPage() {
 const [statusFilter, setStatusFilter] = useState<ContentStatus | 'ALL'>(
 'ALL',
 );
 const [typeFilter, setTypeFilter] = useState<ContentType | 'ALL'>('ALL');
 const [search, setSearch] = useState('');
 const debouncedSearch = useDebouncedValue(search, 250);

 const { data: projects = [], isLoading } = useContentProjects();

 const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
 const [sortDir, setSortDir] = useState<SortDir>('desc');

 const [selected, setSelected] = useState<Set<number>>(new Set());

 // Reset selection when filter changes.
 useEffect(() => {
 setSelected(new Set());
 }, [statusFilter, typeFilter, debouncedSearch]);

 const updateProject = useUpdateContentStatus();
 const deleteProject = useDeleteContentProject();

 // Filtered + sorted view.
 const rows = useMemo(() => {
 let r = projects;
 if (statusFilter !== 'ALL') r = r.filter((p) => p.status === statusFilter);
 if (typeFilter !== 'ALL') r = r.filter((p) => p.type === typeFilter);
 if (debouncedSearch.trim()) {
 const q = debouncedSearch.toLowerCase();
 r = r.filter((p) => p.title.toLowerCase().includes(q));
 }
 const dir = sortDir === 'asc' ? 1 : -1;
 return [...r].sort((a, b) => {
 const av = a[sortKey] ?? '';
 const bv = b[sortKey] ?? '';
 if (av < bv) return -1 * dir;
 if (av > bv) return 1 * dir;
 return 0;
 });
 }, [projects, statusFilter, typeFilter, debouncedSearch, sortKey, sortDir]);

 const onSort = (key: SortKey) => {
 if (key === sortKey) {
 setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
 } else {
 setSortKey(key);
 setSortDir(key === 'title' || key === 'type' || key === 'status' ? 'asc' : 'desc');
 }
 };

 const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
 const someSelected = selected.size > 0 && !allSelected;

 const toggleAll = () => {
 if (allSelected) setSelected(new Set());
 else setSelected(new Set(rows.map((r) => r.id)));
 };
 const toggleOne = (id: number) => {
 setSelected((prev) => {
 const next = new Set(prev);
 if (next.has(id)) next.delete(id);
 else next.add(id);
 return next;
 });
 };

 const onBulkStatus = async (status: ContentStatus) => {
 const ids = Array.from(selected);
 // Fire-and-forget; the mutation hook invalidates the
 // list query on success.
 await Promise.all(
 ids.map((id) =>
 updateProject.mutateAsync({ id, status }).catch(() => null),
 ),
 );
 setSelected(new Set());
 };

 const onBulkDelete = async () => {
 if (
 !window.confirm(
 `Delete ${selected.size} project${selected.size === 1 ? '' : 's'}? This cannot be undone.`,
 )
 )
 return;
 const ids = Array.from(selected);
 await Promise.all(
 ids.map((id) =>
 deleteProject.mutateAsync(id).catch(() => null),
 ),
 );
 setSelected(new Set());
 };

 return (
 <div className="space-y-3">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-end gap-3">
 <div className="flex-1 min-w-0">
 <h1 className="text-2xl font-bold text-text-primary tracking-tight">
 All projects
 </h1>
 <p className="text-xs text-text-secondary mt-0.5">
 {rows.length}
 {rows.length !== projects.length &&
 ` of ${projects.length}`}{' '}
 project{rows.length === 1 ? '' : 's'}
 {selected.size > 0 && (
 <span className="text-studio-400">
 {' '}
 · {selected.size} selected
 </span>
 )}
 </p>
 </div>
 <div className="flex items-center gap-2">
 <Link
 href="/creator/pipeline"
 className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-bg-elevated/40 hover:bg-bg-elevated/70 text-text-primary text-xs font-semibold transition-colors"
 >
 <ListChecks className="w-3.5 h-3.5" />
 Pipeline
 </Link>
 <Link
 href="/creator/calendar"
 className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-bg-elevated/40 hover:bg-bg-elevated/70 text-text-primary text-xs font-semibold transition-colors"
 >
 <Calendar className="w-3.5 h-3.5" />
 Calendar
 </Link>
 <Link
 href="/creator/projects/new"
 className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-studio-500 text-bg-base text-xs font-semibold hover:bg-studio-400 transition-colors"
 >
 <Plus className="w-3.5 h-3.5" />
 New
 </Link>
 </div>
 </div>

 {/* Filters */}
 <div className="studio-glass rounded-2xl p-3 shadow-studio-card space-y-2.5">
 {/* Search */}
 <div className="relative">
 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search by title…"
 className="w-full bg-bg-elevated/40 rounded-lg pl-8 pr-3 h-9 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-studio-500/40 placeholder:text-text-muted/60"
 />
 {search && (
 <button
 type="button"
 onClick={() => setSearch('')}
 className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>

 {/* Status filter */}
 <FilterRow
 label="Status"
 value={statusFilter}
 options={['ALL', ...STATUSES]}
 onChange={(v) => setStatusFilter(v as ContentStatus | 'ALL')}
 colorMap={(v) =>
 v === 'ALL' ? null : (CONTENT_STATUS_META[v as ContentStatus]?.color ?? null)
 }
 />
 {/* Type filter */}
 <FilterRow
 label="Type"
 value={typeFilter}
 options={['ALL', ...TYPES]}
 onChange={(v) => setTypeFilter(v as ContentType | 'ALL')}
 colorMap={(v) =>
 v === 'ALL' ? null : (CONTENT_TYPE_META[v as ContentType]?.color ?? null)
 }
 />
 </div>

 {/* Table */}
 <div className="studio-glass rounded-2xl shadow-studio-card overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead className="bg-bg-elevated/40 sticky top-0 z-10">
 <tr className="text-text-muted text-[10px] uppercase tracking-wider">
 <th className="w-8 px-3 py-2">
 <input
 type="checkbox"
 checked={allSelected}
 ref={(el) => {
 if (el) el.indeterminate = someSelected;
 }}
 onChange={toggleAll}
 className="accent-studio-500"
 />
 </th>
 <SortHeader
 label="Title"
 k="title"
 current={sortKey}
 dir={sortDir}
 onClick={() => onSort('title')}
 />
 <SortHeader
 label="Type"
 k="type"
 current={sortKey}
 dir={sortDir}
 onClick={() => onSort('type')}
 />
 <SortHeader
 label="Status"
 k="status"
 current={sortKey}
 dir={sortDir}
 onClick={() => onSort('status')}
 />
 <SortHeader
 label="Idea"
 k="ideaDate"
 current={sortKey}
 dir={sortDir}
 onClick={() => onSort('ideaDate')}
 />
 <SortHeader
 label="Film"
 k="filmDate"
 current={sortKey}
 dir={sortDir}
 onClick={() => onSort('filmDate')}
 />
 <SortHeader
 label="Publish"
 k="publishDate"
 current={sortKey}
 dir={sortDir}
 onClick={() => onSort('publishDate')}
 />
 <SortHeader
 label="Updated"
 k="updatedAt"
 current={sortKey}
 dir={sortDir}
 onClick={() => onSort('updatedAt')}
 />
 <th className="px-3 py-2 text-right">Counts</th>
 <th className="w-8" />
 </tr>
 </thead>
 <tbody>
 {isLoading && (
 <tr>
 <td
 colSpan={10}
 className="px-3 py-12 text-center text-text-muted"
 >
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
 className="inline-block w-4 h-4 border-2 border-studio-500 border-t-transparent rounded-full"
 />
 <span className="ml-2 text-xs">Loading projects…</span>
 </td>
 </tr>
 )}
 {!isLoading && rows.length === 0 && (
 <tr>
 <td colSpan={10} className="px-3 py-12 text-center">
 <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-studio-500/10 mb-2">
 <Sparkles className="w-5 h-5 text-studio-400" />
 </div>
 <p className="text-sm text-text-primary font-semibold mb-1">
 {projects.length === 0
 ? 'No projects yet'
 : 'No projects match these filters'}
 </p>
 <p className="text-xs text-text-secondary mb-3">
 {projects.length === 0
 ? 'Capture your first idea or start a blank project.'
 : 'Try clearing the search or status filter.'}
 </p>
 {projects.length === 0 && (
 <Link
 href="/creator/ideas"
 className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-studio-500 text-bg-base text-xs font-semibold hover:bg-studio-400 transition-colors"
 >
 <Plus className="w-3.5 h-3.5" />
 Capture an idea
 </Link>
 )}
 </td>
 </tr>
 )}
 {rows.map((p) => (
 <ProjectRow
 key={p.id}
 project={p}
 selected={selected.has(p.id)}
 onToggle={() => toggleOne(p.id)}
 />)
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Bulk action bar */}
 <AnimatePresence>
 {selected.size > 0 && (
 <motion.div
 initial={{ y: 80, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 80, opacity: 0 }}
 transition={{ type: 'spring', stiffness: 120, damping: 18 }}
 className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 studio-glass rounded-2xl shadow-studio-card-hover px-3 py-2 flex items-center gap-2"
 >
 <span className="text-xs font-semibold text-text-primary">
 {selected.size} selected
 </span>
 <div className="h-4 w-px bg-bg-elevated" />
 <select
 onChange={(e) => {
 if (e.target.value) {
 onBulkStatus(e.target.value as ContentStatus);
 e.target.value = '';
 }
 }}
 className="bg-bg-elevated/60 text-xs text-text-primary rounded px-2 h-7 focus:outline-none focus:ring-1 focus:ring-studio-500/40"
 defaultValue=""
 >
 <option value="" disabled>
 Set status…
 </option>
 {STATUSES.map((s) => (
 <option key={s} value={s}>
 {CONTENT_STATUS_META[s].label}
 </option>
 ))}
 </select>
 <button
 type="button"
 onClick={onBulkDelete}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-[11px] font-semibold text-rose-300 hover:bg-rose-500/15 transition-colors"
 >
 <Trash2 className="w-3 h-3" />
 Delete
 </button>
 <button
 type="button"
 onClick={() => setSelected(new Set())}
 className="text-text-muted hover:text-text-primary p-1"
 aria-label="Clear selection"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}

// ─── Sortable header cell ───────────────────────────────────────
function SortHeader({
 label,
 k,
 current,
 dir,
 onClick,
}: {
 label: string;
 k: SortKey;
 current: SortKey;
 dir: SortDir;
 onClick: () => void;
}) {
 const active = current === k;
 return (
 <th className="px-3 py-2 text-left">
 <button
 type="button"
 onClick={onClick}
 className={`inline-flex items-center gap-1 font-semibold ${
 active ? 'text-studio-400' : 'text-text-muted hover:text-text-primary'
 }`}
 >
 {label}
 {active ? (
 dir === 'asc' ? (
 <ChevronUp className="w-3 h-3" />
 ) : (
 <ChevronDown className="w-3 h-3" />
 )
 ) : (
 <ArrowUpDown className="w-3 h-3 opacity-40" />
 )}
 </button>
 </th>
 );
}

// ─── Filter row (label + chips) ──────────────────────────────────
function FilterRow<T extends string>({
 label,
 value,
 options,
 onChange,
 colorMap,
}: {
 label: string;
 value: T;
 options: readonly T[];
 onChange: (v: T) => void;
 colorMap: (v: T) => string | null;
}) {
 return (
 <div className="flex items-center gap-2 flex-wrap">
 <div className="flex items-center gap-1 text-text-muted shrink-0 w-16">
 <Filter className="w-3 h-3" />
 <span className="text-[10px] uppercase tracking-wider font-semibold">
 {label}
 </span>
 </div>
 <div className="flex items-center gap-1 flex-wrap">
 {options.map((opt) => {
 const active = opt === value;
 const c = colorMap(opt);
 return (
 <button
 key={opt}
 type="button"
 onClick={() => onChange(opt)}
 className={`px-2 h-6 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
 active
 ? c
 ? 'text-bg-base'
 : 'bg-studio-500 text-bg-base'
 : 'bg-bg-elevated/40 text-text-secondary hover:bg-bg-elevated/70'
 }`}
 style={
 active && c
 ? { backgroundColor: c }
 : undefined
 }
 >
 {opt === 'ALL' ? 'All' : opt.replace('_', ' ')}
 </button>
 );
 })}
 </div>
 </div>
 );
}

// ─── Project row ────────────────────────────────────────────────
function ProjectRow({
 project,
 selected,
 onToggle,
}: {
 project: ContentProjectSummary;
 selected: boolean;
 onToggle: () => void;
}) {
 return (
 <motion.tr
 layout
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className={`border-t border-bg-elevated/40 group ${
 selected
 ? 'bg-studio-500/5'
 : 'hover:bg-bg-elevated/20'
 }`}
 >
 <td className="px-3 py-2">
 <input
 type="checkbox"
 checked={selected}
 onChange={onToggle}
 onClick={(e) => e.stopPropagation()}
 className="accent-studio-500"
 />
 </td>
 <td className="px-3 py-2 max-w-[280px]">
 <Link
 href={`/creator/projects/${project.id}`}
 className="flex items-center gap-2 group/title"
 >
 <div className="shrink-0 w-7 h-7 rounded-md bg-bg-elevated/60 ring-1 ring-studio-500/10 overflow-hidden flex items-center justify-center">
 {project.thumbnailUrl ? (
 // eslint-disable-next-line @next/next/no-img-element
 <img
 src={project.thumbnailUrl}
 alt=""
 className="w-full h-full object-cover"
 />
 ) : (
 <ImageIcon className="w-3.5 h-3.5 text-text-muted" />
 )}
 </div>
 <span className="font-semibold text-text-primary truncate group-hover/title:text-studio-300 transition-colors">
 {project.title}
 </span>
 </Link>
 </td>
 <td className="px-3 py-2">
 <TypePill type={project.type} size="xs" />
 </td>
 <td className="px-3 py-2">
 <StatusPill status={project.status} size="xs" bare />
 </td>
 <td className="px-3 py-2 text-text-secondary tabular-nums">
 {formatDate(project.ideaDate)}
 </td>
 <td className="px-3 py-2 text-text-secondary tabular-nums">
 {formatDate(project.filmDate)}
 </td>
 <td className="px-3 py-2 text-text-secondary tabular-nums">
 {formatDate(project.publishDate)}
 </td>
 <td className="px-3 py-2 text-text-muted text-[10px] tabular-nums">
 {formatRelative(project.updatedAt)}
 </td>
 <td className="px-3 py-2 text-right">
 <Counts project={project} />
 </td>
 <td className="px-3 py-2">
 <Link
 href={`/creator/projects/${project.id}`}
 className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-studio-300 transition-all"
 >
 <ExternalLink className="w-3.5 h-3.5" />
 </Link>
 </td>
 </motion.tr>
 );
}

function Counts({ project }: { project: ContentProjectSummary }) {
 const c = project._count;
 if (!c) return <span className="text-text-muted text-[10px]">—</span>;
 return (
 <div className="inline-flex items-center gap-2 text-[10px] text-text-muted">
 {c.days > 0 && (
 <span title="Production days">
 <Film className="w-3 h-3 inline -mt-0.5 mr-0.5" />
 {c.days}
 </span>
 )}
 {c.platformPosts > 0 && (
 <span title="Platform posts">
 <Youtube className="w-3 h-3 inline -mt-0.5 mr-0.5" />
 {c.platformPosts}
 </span>
 )}
 {c.checklistItems > 0 && (
 <span title="Checklist items">
 <ListChecks className="w-3 h-3 inline -mt-0.5 mr-0.5" />
 {c.checklistItems}
 </span>
 )}
 </div>
 );
}

function formatDate(iso: string | null): string {
 if (!iso) return '—';
 const d = new Date(iso);
 if (Number.isNaN(d.getTime())) return '—';
 return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
}

function formatRelative(iso: string): string {
 const d = new Date(iso);
 if (Number.isNaN(d.getTime())) return '—';
 const diff = (Date.now() - d.getTime()) / 1000;
 if (diff < 60) return 'just now';
 if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
 if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
 if (diff < 86400 * 30)
 return `${Math.floor(diff / 86400)}d ago`;
 return d.toLocaleDateString('en-CA');
}
