'use client';

// KanbanCard — single draggable card used inside a Kanban
// column. Pulls the sortable handle from @dnd-kit so the
// user can either drag the whole card (via the grip icon)
// or click into the editor via the rest of the card
// surface.

import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Calendar, GraduationCap, GripVertical } from 'lucide-react';
import StatusPill from '@/components/studio/StatusPill';
import TypePill from '@/components/studio/TypePill';
import { useStudioT } from '@/lib/studio-i18n';
import type { ContentProjectSummary } from '@/types';

interface KanbanCardProps {
 project: ContentProjectSummary;
 /** Optional animation delay so the initial render
 staggers nicely instead of all popping in at once. */
 index?: number;
}

function fmtDay(iso: string | null): string | null {
 if (!iso) return null;
 return new Date(iso).toLocaleDateString('vi-VN', {
 day: '2-digit',
 month: 'short',
 });
}

function dayDiff(iso: string | null): number | null {
 if (!iso) return null;
 return Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function KanbanCard({ project, index = 0 }: KanbanCardProps) {
 const { t } = useStudioT();
 const {
 attributes,
 listeners,
 setNodeRef,
 transform,
 transition,
 isDragging,
 } = useSortable({
 id: project.id,
 data: { type: 'card', project },
 });

 const style: React.CSSProperties = {
 transform: CSS.Transform.toString(transform),
 transition,
 opacity: isDragging ? 0.4 : 1,
 zIndex: isDragging ? 50 : undefined,
 };

 const filmDay = fmtDay(project.filmDate);
 const filmDiff = dayDiff(project.filmDate);

 return (
 <motion.div
 ref={setNodeRef}
 style={style}
 initial={{ opacity: 0, y: 6 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.25, delay: index * 0.02 }}
 className="group relative rounded-xl border border-darkborder bg-darkcard/80 hover:border-studio-500/40 transition-colors"
 >
 {/* Card body. The whole surface is a Link to the
 editor — but the grip handle is a separate span that
 captures pointer events so dragging still works. */}
 <Link
 href={`/creator/projects/${project.id}`}
 className="block p-3 pr-8"
 >
 {/* Course / series line, above the title.
     Reads from the denormalised `courseTitle` snapshot, so it
     stays correct even after the source course is renamed or
     unpublished. Episode number is only meaningful next to a
     series name, so they render together or not at all. */}
 {(project.courseTitle || project.seriesName) && (
 <div className="flex items-center gap-1 mb-1 text-[10px] text-studio-400/90">
 <GraduationCap className="w-3 h-3 shrink-0" />
 <span className="truncate">
 {project.seriesName || project.courseTitle}
 {project.episodeNumber != null &&
 (project.seriesName || project.courseTitle) &&
 ` · ${t('episodeShort', { n: project.episodeNumber })}`}
 </span>
 </div>
 )}
 <p className="text-sm font-medium text-text-primary line-clamp-2 leading-snug group-hover:text-studio-300 transition-colors">
 {project.title}
 </p>
 {project.lessonRef && (
 <p className="text-[10px] text-text-muted mt-0.5 truncate">{project.lessonRef}</p>
 )}
 <div className="flex items-center gap-1.5 mt-2 flex-wrap">
 <TypePill type={project.type} size="xs" />
 {project.tags.slice(0, 1).map((t) => (
 <span
 key={t}
 className="text-[10px] text-text-muted bg-darkcard/60 px-1.5 h-5 rounded-full border border-darkborder inline-flex items-center"
 >
 #{t}
 </span>
 ))}
 </div>
 {filmDay && (
 <div className="flex items-center gap-1 mt-2 text-[10px] text-text-muted">
 <Calendar className="w-3 h-3" />
 <span>{t('filmOn', { date: filmDay })}</span>
 {filmDiff !== null && (
 <span
 className={
 filmDiff < 0
 ? 'text-red-400'
 : filmDiff <= 3
 ? 'text-amber-400'
 : 'text-text-muted'
 }
 >
 {filmDiff === 0 ? `· ${t('today')}` : filmDiff < 0 ? `· -${Math.abs(filmDiff)}d` : `· +${filmDiff}d`}
 </span>
 )}
 </div>
 )}
 </Link>

 {/* Drag handle — sits on the right edge so the rest
 of the card can still be a Link. */}
 <button
 type="button"
 {...attributes}
 {...listeners}
 aria-label={t('dragCardHint')}
 className="absolute right-1.5 top-1.5 p-1 rounded text-text-muted hover:text-text-primary hover:bg-white/5 cursor-grab active:cursor-grabbing touch-none"
 >
 <GripVertical className="w-3.5 h-3.5" />
 </button>
 </motion.div>
 );
}
