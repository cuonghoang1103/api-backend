'use client';

// /creator/calendar — Calendar view (Phase 6).
//
// A month grid + agenda list for upcoming film dates
// and publish dates. Data comes from
// /api/v1/admin/content/projects?from=…&to=…&field=any
// — the server OR-matches across filmDate and
// publishDate. We split the response client-side
// into the two lanes so the calendar dots can be
// colour-coded by "kind" (filming vs publishing).
//
// Two modes:
// • Month (default) — react-day-picker month grid
// with dots for each project + a side agenda
// of the current month.
// • Agenda — a list grouped by week for the next
// 60 days, useful when the month grid gets
// crowded.

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
 Calendar as CalendarIcon,
 CalendarRange,
 ChevronLeft,
 ChevronRight,
 Film,
 Send,
 ListFilter,
 Filter,
 X,
 CalendarDays,
 ArrowRight,
} from 'lucide-react';
import {
 format,
 startOfMonth,
 endOfMonth,
 startOfWeek,
 endOfWeek,
 addMonths,
 subMonths,
 addDays,
 isSameDay,
 isSameMonth,
 isToday,
 parseISO,
} from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useContentProjects } from '@/hooks/useContentQueries';
import { CONTENT_STATUS_META, CONTENT_TYPE_META } from '@/lib/studio-meta';
import StatusPill from '@/components/studio/StatusPill';
import TypePill from '@/components/studio/TypePill';
import type { ContentProjectSummary } from '@/types';

// A project shows up on the calendar in two
// different lanes: filming (filmDate) and
// publishing (publishDate). We model them as a
// flat "event" list so the calendar can render
// either.
type CalEvent = {
 id: number;
 project: ContentProjectSummary;
 date: Date;
 kind: 'film' | 'publish';
};

function projectsToEvents(projects: ContentProjectSummary[]): CalEvent[] {
 const events: CalEvent[] = [];
 for (const p of projects) {
 if (p.filmDate) {
 events.push({
 id: p.id * 10 + 1,
 project: p,
 date: parseISO(p.filmDate),
 kind: 'film',
 });
 }
 if (p.publishDate) {
 events.push({
 id: p.id * 10 + 2,
 project: p,
 date: parseISO(p.publishDate),
 kind: 'publish',
 });
 }
 }
 return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

const KIND_META = {
 film: { label: 'Filming', color: '#F59E0B', tint: 'rgba(245, 158, 11, 0.15)' },
 publish: { label: 'Publishing', color: '#10b981', tint: 'rgba(16, 185, 129, 0.15)' },
} as const;

const VIEW_MODES = [
 { value: 'month' as const, label: 'Month', icon: CalendarIcon },
 { value: 'agenda' as const, label: 'Agenda', icon: ListFilter },
];

// ─── Project chip ───────────────────────────────────────────────
// Reused inside the agenda + the day detail panel.
function ProjectChip({
 project,
 kind,
 compact,
}: {
 project: ContentProjectSummary;
 kind: 'film' | 'publish';
 compact?: boolean;
}) {
 const k = KIND_META[kind];
 return (
 <Link
 href={`/creator/projects/${project.id}`}
 className="group flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg bg-bg-elevated/40 ring-1 ring-studio-500/10 hover:ring-studio-500/30 hover:bg-bg-elevated/60 transition-colors"
 >
 <span
 className="inline-block w-2 h-2 rounded-full shrink-0"
 style={{ backgroundColor: k.color }}
 title={k.label}
 />
 <div className="flex-1 min-w-0">
 <div className="text-sm font-medium text-text-primary line-clamp-1 group-hover:text-studio-300 transition-colors">
 {project.title}
 </div>
 {!compact && (
 <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-text-muted">
 <TypePill type={project.type} size="xs" />
 <span>·</span>
 <span className="capitalize">{CONTENT_TYPE_META[project.type]?.label ?? project.type}</span>
 </div>
 )}
 </div>
 {!compact && <StatusPill status={project.status} size="xs" bare />}
 <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-studio-300 transition-colors" />
 </Link>
 );
}

// ─── Day cell modifier helpers ──────────────────────────────────
function buildModifiers(events: CalEvent[]) {
 // We tag each day with a `film` modifier if it has
 // a filming event, and a `publish` modifier if it
 // has a publishing event. DayPicker will then add
 // the right CSS class so we can paint the dot.
 const filmDays: Date[] = [];
 const publishDays: Date[] = [];
 const bothDays: Date[] = [];
 const eventByDate = new Map<string, CalEvent[]>();
 for (const e of events) {
 const k = format(e.date, 'yyyy-MM-dd');
 const arr = eventByDate.get(k) ?? [];
 arr.push(e);
 eventByDate.set(k, arr);
 if (e.kind === 'film') filmDays.push(e.date);
 if (e.kind === 'publish') publishDays.push(e.date);
 }
 for (const [k, arr] of eventByDate) {
 if (arr.some((e) => e.kind === 'film') && arr.some((e) => e.kind === 'publish')) {
 bothDays.push(parseISO(k));
 }
 }
 return { filmDays, publishDays, bothDays, eventByDate };
}

// ─── Agenda view ────────────────────────────────────────────────
function AgendaView({
 events,
 monthStart,
 monthEnd,
}: {
 events: CalEvent[];
 monthStart: Date;
 monthEnd: Date;
}) {
 // Group events by week. We start at the first
 // week's Monday before `monthStart` and walk
 // forward in 7-day jumps.
 const groups: Array<{ key: string; label: string; events: CalEvent[] }> = [];
 let cursor = startOfWeek(monthStart, { weekStartsOn: 1 });
 let safety = 0;
 while (cursor <= monthEnd && safety < 20) {
 const weekEnd = endOfWeek(cursor, { weekStartsOn: 1 });
 const weekEvents = events.filter(
 (e) => e.date >= cursor && e.date <= weekEnd,
 );
 if (weekEvents.length > 0) {
 groups.push({
 key: cursor.toISOString(),
 label: `Week of ${format(cursor, 'MMM d')} – ${format(weekEnd, 'MMM d')}`,
 events: weekEvents,
 });
 }
 cursor = addDays(cursor, 7);
 safety++;
 }

 if (groups.length === 0) {
 return (
 <div className="text-center py-16">
 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-studio-500/10 ring-1 ring-studio-500/20 mb-4">
 <CalendarDays className="w-7 h-7 text-studio-400/60" />
 </div>
 <h3 className="text-base font-semibold text-text-primary">No events in this window</h3>
 <p className="mt-1 text-sm text-text-secondary max-w-sm mx-auto">
 Pick a different month or set a film / publish date on a project.
 </p>
 </div>
 );
 }

 return (
 <div className="space-y-6">
 {groups.map((g) => (
 <div key={g.key}>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
 {g.label}
 </span>
 <span className="flex-1 h-px bg-studio-500/10" />
 <span className="text-[10px] text-text-muted">
 {g.events.length} event{g.events.length === 1 ? '' : 's'}
 </span>
 </div>
 <div className="space-y-2">
 {g.events.map((e) => (
 <div
 key={e.id}
 className="flex items-start gap-3"
 >
 <div className="w-14 shrink-0 text-right">
 <div className="text-[10px] uppercase tracking-wider text-text-muted">
 {format(e.date, 'EEE')}
 </div>
 <div className="text-base font-semibold text-text-primary">
 {format(e.date, 'd')}
 </div>
 <div className="text-[10px] text-text-muted">
 {format(e.date, 'MMM')}
 </div>
 </div>
 <div className="flex-1 min-w-0">
 <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: KIND_META[e.kind].color }}>
 {KIND_META[e.kind].label}
 </div>
 <ProjectChip project={e.project} kind={e.kind} />
 </div>
 </div>
 ))}
 </div>
 </div>
 ))}
 </div>
 );
}

// ─── Day detail panel (under the month grid) ───────────────────
function DayDetailPanel({
 date,
 events,
 onClose,
}: {
 date: Date | undefined;
 events: CalEvent[];
 onClose: () => void;
}) {
 if (!date) return null;
 const dayEvents = events
 .filter((e) => isSameDay(e.date, date))
 .sort((a, b) => a.kind.localeCompare(b.kind));

 return (
 <AnimatePresence>
 <motion.div
 key={date.toISOString()}
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 4 }}
 className="studio-glass rounded-2xl p-4 sm:p-5 shadow-studio-card"
 >
 <div className="flex items-center justify-between mb-3">
 <div>
 <div className="text-[11px] uppercase tracking-wider text-text-muted">
 {format(date, 'EEEE')}
 </div>
 <div className="text-base font-semibold text-text-primary">
 {format(date, 'MMMM d, yyyy')}
 </div>
 </div>
 <button
 type="button"
 onClick={onClose}
 aria-label="Close"
 className="w-7 h-7 rounded-md inline-flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-studio-500/15"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </div>
 {dayEvents.length === 0 ? (
 <p className="text-sm text-text-muted py-4 text-center">
 Nothing scheduled on this day.
 </p>
 ) : (
 <div className="space-y-2">
 {dayEvents.map((e) => (
 <div
 key={e.id}
 className="flex items-start gap-3"
 >
 <div
 className="w-1 self-stretch rounded-full shrink-0"
 style={{ backgroundColor: KIND_META[e.kind].color }}
 />
 <div className="flex-1">
 <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: KIND_META[e.kind].color }}>
 {KIND_META[e.kind].label}
 </div>
 <ProjectChip project={e.project} kind={e.kind} />
 </div>
 </div>
 ))}
 </div>
 )}
 </motion.div>
 </AnimatePresence>
 );
}

// ─── Page ───────────────────────────────────────────────────────
export default function CalendarPage() {
 const [view, setView] = useState<'month' | 'agenda'>('month');
 const [month, setMonth] = useState<Date>(new Date());
 const [selected, setSelected] = useState<Date | undefined>(new Date());
 const [kindFilter, setKindFilter] = useState<'all' | 'film' | 'publish'>('all');

 // Compute the window the calendar is interested in.
 // Month view: full month ± 1 week padding.
 // Agenda view: full month range.
 const monthStart = startOfMonth(month);
 const monthEnd = endOfMonth(month);
 const fetchFrom = format(startOfWeek(monthStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
 const fetchTo = format(endOfWeek(monthEnd, { weekStartsOn: 1 }), 'yyyy-MM-dd');

 const projectsQ = useContentProjects({
 from: fetchFrom,
 to: fetchTo,
 field: 'any',
 });

 const events = useMemo(
 () => projectsToEvents(projectsQ.data ?? []),
 [projectsQ.data],
 );

 // For agenda view we only want events inside the
 // current month, not the padded window.
 const monthEvents = useMemo(
 () =>
 events.filter(
 (e) => e.date >= monthStart && e.date <= monthEnd,
 ),
 [events, monthStart, monthEnd],
 );

 // Filter by kind if user picked one.
 const visibleEvents = useMemo(
 () =>
 kindFilter === 'all'
 ? monthEvents
 : monthEvents.filter((e) => e.kind === kindFilter),
 [monthEvents, kindFilter],
 );

 const { filmDays, publishDays, bothDays, eventByDate } = useMemo(
 () => buildModifiers(monthEvents),
 [monthEvents],
 );

 const stats = useMemo(() => {
 const totalFilm = events.filter((e) => e.kind === 'film').length;
 const totalPublish = events.filter((e) => e.kind === 'publish').length;
 const upcoming = events
 .filter((e) => e.date >= new Date())
 .slice(0, 3);
 return { totalFilm, totalPublish, upcoming };
 }, [events]);

 if (projectsQ.isLoading) {
 return (
 <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto">
 <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-4">
 Calendar
 </h1>
 <div className="flex items-center justify-center py-16 text-text-muted text-sm">
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
 className="inline-block w-4 h-4 border-2 border-studio-500 border-t-transparent rounded-full mr-2"
 />
 Loading projects…
 </div>
 </div>
 );
 }

 return (
 <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto space-y-6">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
 <div>
 <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
 Calendar
 </h1>
 <p className="mt-1 text-sm text-text-secondary">
 See every film date and publish date at a glance.
 </p>
 </div>
 <div className="flex items-center gap-2">
 {/* View switcher */}
 <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-bg-elevated/60 ring-1 ring-studio-500/15">
 {VIEW_MODES.map((m) => {
 const Icon = m.icon;
 const active = view === m.value;
 return (
 <button
 key={m.value}
 type="button"
 onClick={() => setView(m.value)}
 className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-colors ${
 active
 ? 'bg-studio-500/20 text-studio-200 ring-1 ring-studio-500/30'
 : 'text-text-muted hover:text-text-primary'
 }`}
 >
 <Icon className="w-3.5 h-3.5" />
 {m.label}
 </button>
 );
 })}
 </div>
 {/* Kind filter */}
 <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-bg-elevated/60 ring-1 ring-studio-500/15">
 {(['all', 'film', 'publish'] as const).map((k) => (
 <button
 key={k}
 type="button"
 onClick={() => setKindFilter(k)}
 className={`inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
 kindFilter === k
 ? 'bg-studio-500/20 text-studio-200 ring-1 ring-studio-500/30'
 : 'text-text-muted hover:text-text-primary'
 }`}
 >
 {k === 'film' ? (
 <Film className="w-3 h-3" />
 ) : k === 'publish' ? (
 <Send className="w-3 h-3" />
 ) : (
 <Filter className="w-3 h-3" />
 )}
 {k}
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Stats row */}
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
 <StatPill
 icon={Film}
 label="Filming events"
 value={stats.totalFilm}
 color={KIND_META.film.color}
 />
 <StatPill
 icon={Send}
 label="Publish events"
 value={stats.totalPublish}
 color={KIND_META.publish.color}
 />
 <StatPill
 icon={CalendarRange}
 label="Upcoming"
 value={stats.upcoming.length}
 color="#F59E0B"
 subtle
 />
 </div>

 {/* Main content */}
 {view === 'month' ? (
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
 {/* Calendar grid */}
 <div className="studio-glass rounded-2xl p-4 sm:p-5 shadow-studio-card">
 <DayPicker
 mode="single"
 selected={selected}
 onSelect={setSelected}
 month={month}
 onMonthChange={setMonth}
 modifiers={{ film: filmDays, publish: publishDays, both: bothDays }}
 modifiersClassNames={{
 film: 'studio-day--film',
 publish: 'studio-day--publish',
 both: 'studio-day--both',
 }}
 showOutsideDays
 classNames={{
 root: 'studio-daypicker',
 caption_label: 'text-sm font-semibold text-text-primary',
 nav: 'flex items-center gap-1',
 button_previous:
 'inline-flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-text-primary hover:bg-studio-500/15 transition-colors',
 button_next:
 'inline-flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-text-primary hover:bg-studio-500/15 transition-colors',
 month_caption: 'flex items-center justify-center py-2',
 month_grid: 'w-full border-collapse',
 weekdays: 'text-[10px] uppercase tracking-wider text-text-muted',
 weekday: 'text-center py-2 font-semibold',
 week: 'mt-1',
 day: 'text-center',
 day_button:
 'w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm text-text-primary hover:bg-studio-500/15 transition-colors mx-auto block',
 today: 'ring-1 ring-studio-500/40 font-bold',
 selected: '!bg-studio-500 !text-bg-base hover:!bg-studio-400',
 outside: 'opacity-30',
 }}
 components={{
 Chevron: ({ orientation }) =>
 orientation === 'left' ? (
 <ChevronLeft className="w-4 h-4" />
 ) : (
 <ChevronRight className="w-4 h-4" />
 ),
 }}
 />
 {/* Legend */}
 <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
 <span className="inline-flex items-center gap-1.5">
 <span
 className="inline-block w-2 h-2 rounded-full"
 style={{ backgroundColor: KIND_META.film.color }}
 />
 Filming
 </span>
 <span className="inline-flex items-center gap-1.5">
 <span
 className="inline-block w-2 h-2 rounded-full"
 style={{ backgroundColor: KIND_META.publish.color }}
 />
 Publishing
 </span>
 <span className="inline-flex items-center gap-1.5">
 <span className="inline-block w-2 h-2 rounded-full ring-1 ring-studio-500/40" />
 Today
 </span>
 </div>
 </div>
 {/* Day detail */}
 <div className="space-y-3">
 <DayDetailPanel
 date={selected}
 events={events}
 onClose={() => setSelected(undefined)}
 />
 {/* Upcoming next 3 */}
 {stats.upcoming.length > 0 && (
 <div className="studio-glass rounded-2xl p-4 sm:p-5 shadow-studio-card">
 <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-1.5">
 <CalendarDays className="w-4 h-4 text-studio-400" />
 Up next
 </h3>
 <div className="space-y-2">
 {stats.upcoming.map((e) => (
 <ProjectChip
 key={e.id}
 project={e.project}
 kind={e.kind}
 compact
 />
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 ) : (
 <div className="studio-glass rounded-2xl p-4 sm:p-5 shadow-studio-card">
 <div className="flex items-center justify-between mb-4">
 <button
 type="button"
 onClick={() => setMonth((m) => subMonths(m, 1))}
 className="inline-flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-text-primary hover:bg-studio-500/15"
 aria-label="Previous month"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 <h2 className="text-base font-semibold text-text-primary">
 {format(month, 'MMMM yyyy')}
 </h2>
 <button
 type="button"
 onClick={() => setMonth((m) => addMonths(m, 1))}
 className="inline-flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-text-primary hover:bg-studio-500/15"
 aria-label="Next month"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 <AgendaView
 events={visibleEvents}
 monthStart={monthStart}
 monthEnd={monthEnd}
 />
 </div>
 )}

 {/* Footer hint */}
 <div className="flex items-center gap-2 text-xs text-text-muted pt-2">
 <span>
 Set a project's <Link href="/creator" className="text-studio-400 hover:text-studio-300 underline-offset-2 hover:underline">film date or publish date</Link> to see it here.
 </span>
 </div>
 </div>
 );
}

function StatPill({
 icon: Icon,
 label,
 value,
 color,
 subtle,
}: {
 icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
 label: string;
 value: number;
 color: string;
 subtle?: boolean;
}) {
 return (
 <div className="studio-glass rounded-xl px-3 py-2.5 flex items-center gap-2.5">
 <div
 className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
 style={{
 backgroundColor: subtle ? 'rgba(245, 158, 11, 0.12)' : `${color}25`,
 }}
 >
 <Icon className="w-4 h-4" style={{ color }} />
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
