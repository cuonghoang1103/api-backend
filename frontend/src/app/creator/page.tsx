'use client';

// /creator — Studio Dashboard (Phase 3 placeholder).
//
// Phase 4 will replace this with the real dashboard:
// - 3-stat row (IDEA / IN-PROGRESS / PUBLISHED counts)
// - "Next to film" agenda (projects with filmDate in the
// next 14 days, sorted ascending)
// - "Recently updated" list (top 6 by updatedAt)
// - "Scripting queue" lane (status=SCRIPTING)
//
// For now we render a friendly "under construction" state
// using the same visual language (amber accent, film-grain
// card) so navigating to /creator works and the design
// intent is visible.

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
 ArrowRight,
 Clapperboard,
 Construction,
 Lightbulb,
 KanbanSquare,
 CalendarRange,
 Sparkles,
} from 'lucide-react';

const ROADMAP = [
 {
 phase: 'Phase 3',
 title: 'Design system + shell',
 status: 'done',
 note: 'Amber accent + studio topbar + middleware gate — done.',
 },
 {
 phase: 'Phase 4',
 title: 'Dashboard + Pipeline + Editor (Overview, Storyboard, Teleprompter)',
 status: 'next',
 note: 'Deploy 1 milestone.',
 },
 {
 phase: 'Phase 5',
 title: 'Idea Bank',
 status: 'future',
 note: 'Lightweight capture with promote-to-project.',
 },
 {
 phase: 'Phase 6',
 title: 'Calendar (react-day-picker)',
 status: 'future',
 note: 'Month + agenda view keyed off filmDate/publishDate.',
 },
 {
 phase: 'Phase 7',
 title: 'Remaining editor tabs (Script, Shotlist, Platforms, Checklist, Performance)',
 status: 'future',
 note: '5 more tabs.',
 },
 {
 phase: 'Phase 8',
 title: 'List/table view + polish',
 status: 'future',
 note: 'Dense grid for power users + empty/loading states.',
 },
];

export default function CreatorDashboardPage() {
 return (
 <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
 {/* Hero strip */}
 <motion.section
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
 className="relative overflow-hidden rounded-3xl border border-studio-500/20 studio-glass p-6 sm:p-10 mb-8"
 >
 <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-3">
 <span className="inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full bg-studio-500/15 text-studio-300 text-xs font-semibold uppercase tracking-wider">
 <Sparkles className="w-3 h-3" />
 Content Studio
 </span>
 <span className="text-text-muted text-xs">Phase 3 ready</span>
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
 <KanbanSquare className="w-4 h-4" />
 Open pipeline
 </Link>
 <Link
 href="/creator/ideas"
 className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-studio-gradient text-studio-950 font-semibold text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)]"
 >
 Capture idea
 <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 </div>
 </motion.section>

 {/* Three next-step tiles */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
 {[
 {
 icon: Lightbulb,
 label: 'Idea Bank',
 href: '/creator/ideas',
 desc: 'Capture sparks. Promote to project when ready.',
 },
 {
 icon: KanbanSquare,
 label: 'Pipeline',
 href: '/creator/pipeline',
 desc: 'Drag cards across Idea → Scripting → Filming → Editing → Published.',
 },
 {
 icon: CalendarRange,
 label: 'Calendar',
 href: '/creator/calendar',
 desc: 'See every film date and publish date at a glance.',
 },
 ].map((tile) => (
 <Link
 key={tile.href}
 href={tile.href}
 className="group flex items-start gap-3 p-4 rounded-2xl border border-darkborder bg-darkcard/60 hover:border-studio-500/40 hover:bg-studio-500/5 transition-all"
 >
 <div className="w-10 h-10 rounded-xl bg-studio-500/15 flex items-center justify-center shrink-0 group-hover:bg-studio-500/25 transition-colors">
 <tile.icon className="w-5 h-5 text-studio-400" />
 </div>
 <div className="min-w-0">
 <p className="font-heading font-semibold text-text-primary text-sm">
 {tile.label}
 </p>
 <p className="text-xs text-text-muted mt-0.5">{tile.desc}</p>
 </div>
 </Link>
 ))}
 </div>

 {/* Phase roadmap */}
 <section>
 <div className="flex items-center gap-2 mb-4">
 <Construction className="w-4 h-4 text-studio-400" />
 <h2 className="font-heading text-lg font-semibold text-text-primary">
 Build roadmap
 </h2>
 <span className="ml-2 text-xs text-text-muted">
 6 phases · 2 deploys
 </span>
 </div>
 <ol className="space-y-2">
 {ROADMAP.map((item, i) => (
 <motion.li
 key={item.phase}
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.05 * i, duration: 0.3 }}
 className={`flex items-start gap-4 p-4 rounded-xl border ${
 item.status === 'done'
 ? 'border-studio-500/30 bg-studio-500/5'
 : item.status === 'next'
 ? 'border-studio-500/20 bg-darkcard/60'
 : 'border-darkborder bg-darkcard/40'
 }`}
 >
 <div
 className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
 item.status === 'done'
 ? 'bg-studio-500 text-studio-950'
 : item.status === 'next'
 ? 'bg-studio-500/20 text-studio-300 ring-1 ring-studio-500/40'
 : 'bg-darkcard text-text-muted'
 }`}
 >
 {item.status === 'done' ? '✓' : i + 1}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 flex-wrap">
 <p className="font-semibold text-text-primary text-sm">
 {item.title}
 </p>
 <span className="text-[10px] uppercase tracking-wider text-text-muted">
 {item.phase}
 </span>
 </div>
 <p className="text-xs text-text-secondary mt-0.5">{item.note}</p>
 </div>
 {item.status === 'next' && (
 <span className="text-xs text-studio-300 font-semibold uppercase tracking-wider self-center">
 Next
 </span>
 )}
 </motion.li>
 ))}
 </ol>
 </section>
 </div>
 );
}
