'use client';

// /creator — Studio Dashboard.
//
// 3 horizontal stat cards (IDEA / IN-PROGRESS / LIVE) +
// 2 agenda columns ("Next 14 days" + "Recently updated")
// + a "Scripting queue" lane. All four blocks read from
// the same `useContentProjects()` query so when the user
// drops a card on the Pipeline the counts move in real
// time on this page.

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
 ArrowRight,
 Calendar as CalendarIcon,
 Clock,
 Film,
 Lightbulb,
 Plus,
 Rocket,
 Sparkles,
 TrendingUp,
 Users,
} from 'lucide-react';
import { useContentProjects } from '@/hooks/useContentQueries';
import { CONTENT_STATUS_META, STATUS_ORDER } from '@/lib/studio-meta';
import StatusPill from '@/components/studio/StatusPill';
import TypePill from '@/components/studio/TypePill';
import type { ContentProjectSummary, ContentStatus } from '@/types';

function dayDiff(iso: string | null): number | null {
 if (!iso) return null;
 const target = new Date(iso).getTime();
 const now = Date.now();
 return Math.round((target - now) / 86_400_000);
}

function fmtDay(iso: string | null): string {
 if (!iso) return '—';
 const d = new Date(iso);
 return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: 'short' });
}

export default function CreatorDashboardPage() {
 const router = useRouter();
 const { data: projects = [], isLoading } = useContentProjects();

 // ─── Aggregates ────────────────────────────────────────
 const counts = useMemo(() => {
 const c: Record<ContentStatus, number> = {
 IDEA: 0, SCRIPTING: 0, FILMING: 0, EDITING: 0, SCHEDULED: 0, PUBLISHED: 0,
 };
 for (const p of projects) c[p.status] += 1;
 return c;
 }, [projects]);

 const inProgress = counts.SCRIPTING + counts.FILMING + counts.EDITING;
 const live = counts.SCHEDULED + counts.PUBLISHED;

 // "Next 14 days" — projects with filmDate in [today, today+14d]
 const nextToFilm = useMemo(() => {
 const cutoff = Date.now() + 14 * 86_400_000;
 return projects
 .filter((p) => p.filmDate && new Date(p.filmDate).getTime() <= cutoff)
 .filter((p) => p.status !== 'PUBLISHED')
 .sort((a, b) => new Date(a.filmDate!).getTime() - new Date(b.filmDate!).getTime())
 .slice(0, 5);
 }, [projects]);

 // "Recently updated" — top 6 by updatedAt
 const recent = useMemo(() => {
 return [...projects]
 .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
 .slice(0, 6);
 }, [projects]);

 // "Scripting queue" — status=SCRIPTING
 const scripting = useMemo(() => {
 return projects.filter((p) => p.status === 'SCRIPTING');
 }, [projects]);

 const isEmpty = !isLoading && projects.length === 0;

 return (
 <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
 {/* Hero strip */}
 <motion.section
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
 className="relative overflow-hidden rounded-3xl border border-studio-500/20 studio-glass p-6 sm:p-8 mb-6"
 >
 <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-3">
 <span className="inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full bg-studio-500/15 text-studio-300 text-xs font-semibold uppercase tracking-wider">
 <Sparkles className="w-3 h-3" />
 Content Studio
 </span>
 <span className="text-text-muted text-xs">
 {isLoading ? 'Loading…' : `${projects.length} project${projects.length === 1 ? '' : 's'}`}
 </span>
 </div>
 <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
 Studio{' '}
 <span className="bg-studio-gradient bg-clip-text text-transparent">
 Dashboard
 </span>
 </h1>
 <p className="mt-2 text-text-secondary max-w-xl text-sm sm:text-base">
 Plan, script, film, ship. One workspace for every video
 you ship across TikTok, YouTube, Facebook and Instagram.
 </p>
 </div>
 <div className="flex items-center gap-3">
 <Link
 href="/creator/pipeline"
 className="flex items-center gap-1.5 px-4 h-10 rounded-xl border border-studio-500/30 text-studio-300 hover:bg-studio-500/10 text-sm font-semibold transition-colors"
 >
 <Film className="w-4 h-4" />
 Open pipeline
 </Link>
 <button
 onClick={() => router.push('/creator?new=1')}
 className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-studio-gradient text-studio-950 font-semibold text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_28px_rgba(245,158,11,0.45)] transition-shadow"
 >
 <Plus className="w-4 h-4" />
 New project
 </button>
 </div>
 </div>
 </motion.section>

 {/* Stat cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
 <StatCard
 label="Ideas"
 value={counts.IDEA}
 meta={CONTENT_STATUS_META.IDEA}
 icon={Lightbulb}
 delay={0.05}
 />
 <StatCard
 label="In progress"
 value={inProgress}
 meta={CONTENT_STATUS_META.FILMING}
 icon={Film}
 sub={`${counts.SCRIPTING} script · ${counts.FILMING} film · ${counts.EDITING} cut`}
 delay={0.1}
 />
 <StatCard
 label="Scheduled + Live"
 value={live}
 meta={CONTENT_STATUS_META.PUBLISHED}
 icon={Rocket}
 sub={`${counts.SCHEDULED} queued · ${counts.PUBLISHED} out`}
 delay={0.15}
 />
 <StatCard
 label="Total"
 value={projects.length}
 meta={{ color: '#a3a3a3', label: 'Total' } as { color: string; label: string }}
 icon={TrendingUp}
 delay={0.2}
 />
 </div>

 {/* Empty state */}
 {isEmpty && (
 <motion.div
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4 }}
 className="rounded-2xl border border-dashed border-studio-500/30 bg-darkcard/40 p-10 text-center mb-6"
 >
 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-studio-500/15 ring-1 ring-studio-500/30 mb-4 reel-spin">
 <Film className="w-7 h-7 text-studio-400" />
 </div>
 <h2 className="font-heading text-xl font-semibold text-text-primary mb-1">
 No projects yet
 </h2>
 <p className="text-text-secondary text-sm mb-5 max-w-md mx-auto">
 Capture your first spark. The Studio will turn it into
 a project with days, scenes, scripts and a publish plan.
 </p>
 <button
 onClick={() => router.push('/creator?new=1')}
 className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-studio-gradient text-studio-950 font-semibold text-sm"
 >
 <Plus className="w-4 h-4" />
 Create your first project
 </button>
 </motion.div>
 )}

 {/* Two-column agenda */}
 {!isEmpty && (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
 {/* Next to film */}
 <AgendaCard
 title="Next 14 days"
 subtitle={nextToFilm.length > 0 ? `${nextToFilm.length} project${nextToFilm.length === 1 ? '' : 's'} scheduled` : 'Nothing scheduled'}
 icon={CalendarIcon}
 accent="studio"
 >
 {nextToFilm.length === 0 ? (
 <EmptyHint text="Drop a film date on a project card to see it here." />
 ) : (
 <ul className="space-y-1.5">
 {nextToFilm.map((p) => {
 const d = dayDiff(p.filmDate);
 return (
 <li key={p.id}>
 <Link
 href={`/creator/projects/${p.id}`}
 className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-studio-500/10 transition-colors group"
 >
 <div className="w-12 shrink-0 text-center">
 <div className="font-heading text-base text-studio-300 leading-none">
 {d === 0 ? 'Today' : d === 1 ? 'Tmrw' : `+${d}d`}
 </div>
 <div className="text-[10px] text-text-muted mt-0.5">{fmtDay(p.filmDate)}</div>
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-sm text-text-primary font-medium truncate group-hover:text-studio-300 transition-colors">
 {p.title}
 </p>
 <div className="flex items-center gap-1.5 mt-0.5">
 <StatusPill status={p.status} size="xs" bare />
 <TypePill type={p.type} size="xs" />
 </div>
 </div>
 <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
 </Link>
 </li>
 );
 })}
 </ul>
 )}
 </AgendaCard>

 {/* Recently updated */}
 <AgendaCard
 title="Recently updated"
 subtitle={`${recent.length} of ${projects.length}`}
 icon={Clock}
 accent="studio"
 >
 {recent.length === 0 ? (
 <EmptyHint text="No projects yet." />
 ) : (
 <ul className="space-y-1.5">
 {recent.map((p) => (
 <li key={p.id}>
 <Link
 href={`/creator/projects/${p.id}`}
 className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-studio-500/10 transition-colors group"
 >
 <div className="min-w-0 flex-1">
 <p className="text-sm text-text-primary font-medium truncate group-hover:text-studio-300 transition-colors">
 {p.title}
 </p>
 <div className="flex items-center gap-1.5 mt-0.5">
 <StatusPill status={p.status} size="xs" bare />
 <TypePill type={p.type} size="xs" />
 </div>
 </div>
 <div className="text-[10px] text-text-muted text-right shrink-0">
 {fmtRelative(p.updatedAt)}
 </div>
 </Link>
 </li>
 ))}
 </ul>
 )}
 </AgendaCard>
 </div>
 )}

 {/* Scripting queue lane */}
 {!isEmpty && scripting.length > 0 && (
 <motion.section
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: 0.2 }}
 className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 sm:p-5"
 >
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
 <Users className="w-4 h-4 text-blue-300" />
 </div>
 <div>
 <h2 className="font-heading text-sm font-semibold text-text-primary">
 Scripting queue
 </h2>
 <p className="text-xs text-text-muted">
 {scripting.length} project{scripting.length === 1 ? '' : 's'} waiting for a script
 </p>
 </div>
 </div>
 <Link
 href="/creator/pipeline?status=SCRIPTING"
 className="text-xs text-blue-300 hover:text-blue-200 font-medium"
 >
 View all →
 </Link>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
 {scripting.slice(0, 6).map((p) => (
 <Link
 key={p.id}
 href={`/creator/projects/${p.id}`}
 className="flex items-center gap-2 p-2.5 rounded-lg bg-darkcard/60 border border-darkborder hover:border-blue-500/40 transition-colors"
 >
 <div className="min-w-0 flex-1">
 <p className="text-sm text-text-primary font-medium truncate">{p.title}</p>
 <div className="text-[10px] text-text-muted mt-0.5">
 {p.filmDate ? `Film ${fmtDay(p.filmDate)}` : 'No film date'}
 </div>
 </div>
 <TypePill type={p.type} size="xs" />
 </Link>
 ))}
 </div>
 </motion.section>
 )}
 </div>
 );
}

// ─── Sub-components ────────────────────────────────────────────────

interface StatCardProps {
 label: string;
 value: number;
 meta: { color: string; label: string };
 icon: React.ComponentType<{ className?: string }>;
 sub?: string;
 delay: number;
}

function StatCard({ label, value, meta, icon: Icon, sub, delay }: StatCardProps) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay }}
 className="relative overflow-hidden rounded-2xl border border-darkborder bg-darkcard/60 p-4 sm:p-5 hover:border-studio-500/40 transition-colors"
 >
 <div className="flex items-center justify-between mb-2">
 <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">{label}</p>
 <div
 className="w-7 h-7 rounded-lg flex items-center justify-center"
 style={{ background: `${meta.color}25`, color: meta.color }}
 >
 <Icon className="w-4 h-4" />
 </div>
 </div>
 <p className="font-heading text-3xl font-bold text-text-primary leading-none">
 {value}
 </p>
 {sub && <p className="text-[11px] text-text-muted mt-1.5">{sub}</p>}
 </motion.div>
 );
}

interface AgendaCardProps {
 title: string;
 subtitle: string;
 icon: React.ComponentType<{ className?: string }>;
 accent: 'studio' | 'blue';
 children: React.ReactNode;
}

function AgendaCard({ title, subtitle, icon: Icon, accent, children }: AgendaCardProps) {
 const iconColor = accent === 'studio' ? 'text-studio-300' : 'text-blue-300';
 const iconBg = accent === 'studio' ? 'bg-studio-500/15' : 'bg-blue-500/15';
 return (
 <motion.section
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4 }}
 className="rounded-2xl border border-darkborder bg-darkcard/60 p-4 sm:p-5"
 >
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
 <Icon className={`w-4 h-4 ${iconColor}`} />
 </div>
 <div>
 <h2 className="font-heading text-sm font-semibold text-text-primary">{title}</h2>
 <p className="text-xs text-text-muted">{subtitle}</p>
 </div>
 </div>
 </div>
 {children}
 </motion.section>
 );
}

function EmptyHint({ text }: { text: string }) {
 return (
 <div className="rounded-lg border border-dashed border-darkborder bg-darkcard/30 p-4 text-center text-xs text-text-muted italic">
 {text}
 </div>
 );
}

function fmtRelative(iso: string): string {
 const diff = Date.now() - new Date(iso).getTime();
 const mins = Math.floor(diff / 60_000);
 if (mins < 1) return 'just now';
 if (mins < 60) return `${mins}m ago`;
 const hrs = Math.floor(mins / 60);
 if (hrs < 24) return `${hrs}h ago`;
 const days = Math.floor(hrs / 24);
 if (days < 30) return `${days}d ago`;
 return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' });
}
