'use client';

// ProjectCardPremium — the redesigned project card for the
// /projects grid. It replaces the legacy `ProjectCard` in
// ProjectsClient with:
//
// • Glassmorphism surface (rounded-3xl + .glass-frost)
// • 3D tilt toward the cursor (rotateX/Y from Framer Motion
// motion values, perspective set on the parent grid item)
// • Spring-based hover lift (y, shadow, image scale)
// • 1px gradient border (violet → indigo) that fades in on
// hover via .gradient-border-violet
// • Image carousel — same logic as the legacy card (left/
// right arrows + dot indicators + "Demo" + "Featured" +
// status overlays), preserved 1:1
// • Tech chips — small mono pills capped at 4 visible + N
// • Action row — "Chi tiet" primary (magnetic-press) +
// circular icon buttons for live / GitHub / video
//
// We do NOT touch the data shape — same Project type, same
// callbacks, same navigation to /projects/[slug] on click.

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useReducedMotion, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ExternalLink, Github, Play, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Done',
  IN_PROGRESS: 'Building',
  PLANNING: 'Planned',
  MAINTENANCE: 'Maint.',
  ON_HOLD: 'Paused',
};

const STATUS_COLORS: Record<string, { fg: string; border: string }> = {
  COMPLETED: { fg: '#6ee7b7', border: 'rgba(110, 231, 183, 0.45)' },
  IN_PROGRESS: { fg: '#fde047', border: 'rgba(253, 224, 71, 0.45)' },
  PLANNING: { fg: '#93c5fd', border: 'rgba(147, 197, 253, 0.45)' },
  MAINTENANCE: { fg: '#c4b5fd', border: 'rgba(196, 181, 253, 0.45)' },
  ON_HOLD: { fg: '#94a3b8', border: 'rgba(148, 163, 184, 0.45)' },
};

// Level badges
const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Cơ bản',
  INTERMEDIATE: 'Trung bình',
  ADVANCED: 'Nâng cao',
};

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  BEGINNER: { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399' },
  INTERMEDIATE: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24' },
  ADVANCED: { bg: 'rgba(248, 113, 113, 0.15)', text: '#f87171' },
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Web: { bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8' },
  Mobile: { bg: 'rgba(168, 85, 247, 0.15)', text: '#a78bfa' },
  AI: { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6' },
  DevOps: { bg: 'rgba(14, 165, 233, 0.15)', text: '#38bdf8' },
  Game: { bg: 'rgba(249, 115, 22, 0.15)', text: '#fb923c' },
  IoT: { bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80' },
  Data: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8' },
  Tooling: { bg: 'rgba(161, 161, 170, 0.15)', text: '#a1a1aa' },
};

// ─── Carousel (preserved from legacy card) ───────────────
function CardCarousel({
 project,
 onVideoClick,
}: {
 project: Project;
 onVideoClick?: (url: string) => void;
}) {
 const [current, setCurrent] = useState(0);

 const allImages = useMemo(
 () =>
 [
 project.thumbnailUrl,
 ...(project.images ?? []),
 ].filter((u): u is string =>
 typeof u === 'string' && u.trim().length > 0 && u.startsWith('http')
 ),
 [project.thumbnailUrl, project.images]
 );

 const hasImages = allImages.length > 0;
 const hasMultiple = allImages.length > 1;

 return (
 <div className="relative h-52 overflow-hidden">
 {!hasImages ? (
 // No-image placeholder — subtle gradient + tiny "Project" SVG.
 <div
 className="absolute inset-0 flex items-center justify-center"
 style={{
 background:
 'linear-gradient(135deg, rgba(99, 102, 241, 0.10) 0%, rgba(18, 18, 26, 0.0) 50%, rgba(139, 92, 246, 0.10) 100%)',
 }}
 >
 <div className="text-violet-300/40 font-mono text-xs tracking-widest uppercase">
 {project.title.slice(0, 18)}
 </div>
 </div>
 ) : (
 <>
 {/* Crossfade between images. */}
 <AnimatePresenceImg current={current} images={allImages} title={project.title} />

 {/* Bottom gradient for legibility. */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

 {/* Video demo button — top left, only if project has a video. */}
 {(project as any).videoUrl && (
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 onVideoClick?.((project as any).videoUrl);
 }}
 className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white transition-all hover:scale-105"
 style={{
 background: 'rgba(0,0,0,0.6)',
 backdropFilter: 'blur(8px)',
 border: '1px solid rgba(255,255,255,0.18)',
 }}
 >
 <Play className="w-2.5 h-2.5 fill-white" />
 Demo
 </button>
 )}

 {/* Featured badge — top left, only if featured. */}
 {project.featured && (
 <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-300 to-orange-400 text-yellow-950 text-[10px] font-bold rounded-lg shadow-lg tracking-wider">
 <Star className="w-2.5 h-2.5 fill-current" />
 FEATURED
 </div>
 )}

 {/* Status pill — top right, only if not featured. */}
 {project.status && !project.featured && (
 <div
 className="status-pill absolute top-3 right-3 z-20"
 style={{
 color: STATUS_COLORS[project.status]?.fg ?? '#94a3b8',
 borderColor: STATUS_COLORS[project.status]?.border ?? 'rgba(148,163,184,0.45)',
 }}
 >
 <span
 className="w-1.5 h-1.5 rounded-full"
 style={{ background: 'currentColor', boxShadow: `0 0 6px currentColor` }}
 />
 {STATUS_LABELS[project.status] ?? project.status}
 </div>
 )}

 {/* Carousel arrows. */}
 {hasMultiple && (
 <>
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1));
 }}
 className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
 style={{
 background: 'rgba(0,0,0,0.5)',
 backdropFilter: 'blur(8px)',
 border: '1px solid rgba(255,255,255,0.1)',
 }}
 aria-label="Previous image"
 >
 <ChevronLeft className="w-4 h-4 text-white" />
 </button>
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1));
 }}
 className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
 style={{
 background: 'rgba(0,0,0,0.5)',
 backdropFilter: 'blur(8px)',
 border: '1px solid rgba(255,255,255,0.1)',
 }}
 aria-label="Next image"
 >
 <ChevronRight className="w-4 h-4 text-white" />
 </button>
 </>
 )}

 {/* Dot indicators. */}
 {hasMultiple && (
 <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
 {allImages.map((_, i) => (
 <button
 key={i}
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 setCurrent(i);
 }}
 className="h-1.5 rounded-full transition-all"
 style={{
 width: i === current ? '18px' : '4px',
 background: i === current ? '#a855f7' : 'rgba(255,255,255,0.4)',
 }}
 aria-label={`Image ${i + 1}`}
 />
 ))}
 </div>
 )}
 </>
 )}
 </div>
 );
}

// Crossfade image stack. Uses AnimatePresence internally so
// we don't double-import it at the top level for this small
// detail — a tiny micro-component is cleaner.
function AnimatePresenceImg({
 current,
 images,
 title,
}: {
 current: number;
 images: string[];
 title: string;
}) {
 return (
 <AnimatePresence mode="wait" initial={false}>
 {images[current] && (
 <motion.div
 key={current}
 initial={{ opacity: 0, scale: 1.02 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.98 }}
 transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
 className="absolute inset-0"
 >
 <SafeImage
 src={images[current]}
 alt={title}
 label={title}
 className="absolute inset-0 w-full h-full object-cover"
 loading="lazy"
 />
 </motion.div>
 )}
 </AnimatePresence>
 );
}

// ─── Magnetic button ─────────────────────────────────────
// A small wrapper that subtly follows the cursor while
// hovered. Displacement is capped to ±5px and smoothed by
// a spring so the motion is never twitchy.
function MagneticButton({
 children,
 className,
 style,
 onClick,
 ariaLabel,
}: {
 children: React.ReactNode;
 className?: string;
 style?: React.CSSProperties;
 onClick?: (e: React.MouseEvent) => void;
 ariaLabel?: string;
}) {
 const ref = useRef<HTMLButtonElement>(null);
 const x = useMotionValue(0);
 const y = useMotionValue(0);
 // Spring-smoothed values so the motion feels organic.
 const sx = useSpring(x, { stiffness: 200, damping: 20, mass: 0.4 });
 const sy = useSpring(y, { stiffness: 200, damping: 20, mass: 0.4 });
 const prefersReducedMotion = useReducedMotion();

 const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
 if (prefersReducedMotion) return;
 const node = ref.current;
 if (!node) return;
 const rect = node.getBoundingClientRect();
 const dx = e.clientX - (rect.left + rect.width / 2);
 const dy = e.clientY - (rect.top + rect.height / 2);
 // Clamp to ±5px so the button never leaves its slot.
 x.set(Math.max(-5, Math.min(5, dx * 0.2)));
 y.set(Math.max(-5, Math.min(5, dy * 0.2)));
 };
 const handleMouseLeave = () => {
 x.set(0);
 y.set(0);
 };

 return (
 <motion.button
 ref={ref}
 type="button"
 onClick={onClick}
 onMouseMove={handleMouseMove}
 onMouseLeave={handleMouseLeave}
 style={{ x: sx, y: sy, ...style }}
 whileTap={{ scale: 0.95 }}
 transition={{ type: 'spring', stiffness: 400, damping: 22 }}
 className={className}
 aria-label={ariaLabel}
 >
 {children}
 </motion.button>
 );
}

// ─── Main card ───────────────────────────────────────────
export default function ProjectCardPremium({
 project,
 onOpenPanel,
 onVideoClick,
 isHovered,
 onHoverStart,
 onHoverEnd,
}: {
 project: Project;
 onOpenPanel: (project: Project) => void;
 onVideoClick?: (url: string) => void;
 isHovered: boolean;
 onHoverStart: () => void;
 onHoverEnd: () => void;
}) {
 const router = useRouter();
 const cardRef = useRef<HTMLDivElement>(null);
 const prefersReducedMotion = useReducedMotion();

 // 3D tilt: rotateX / rotateY driven by the cursor position
 // over the card. The values are clamped to ±6 degrees so
 // the effect is subtle, never disorienting.
 const mouseX = useMotionValue(0);
 const mouseY = useMotionValue(0);
 const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);
 const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
 // Spring-smoothed to remove jitter at the cursor's sampling rate.
 const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20, mass: 0.5 });
 const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20, mass: 0.5 });

 const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
 if (prefersReducedMotion) return;
 const node = cardRef.current;
 if (!node) return;
 const rect = node.getBoundingClientRect();
 // Normalize to [-0.5, 0.5].
 mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
 mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
 };
 const handleCardMouseLeave = () => {
 mouseX.set(0);
 mouseY.set(0);
 onHoverEnd();
 };

 // Cap visible tech chips at 4 — show "+N" for the rest.
 const visibleTechs = (project.technologies ?? []).slice(0, 4);
 const extraTechs = Math.max(0, (project.technologies ?? []).length - 4);

 // Has a video demo?
 const hasVideo = Boolean((project as any).videoUrl);
 // Project year — derived from startDate or createdAt.
 const year = useMemo(() => {
 const dateStr = project.startDate ?? project.createdAt;
 if (!dateStr) return null;
 const d = new Date(dateStr);
 return isNaN(d.getTime()) ? null : d.getFullYear();
 }, [project.startDate, project.createdAt]);

 return (
 <motion.article
 ref={cardRef}
 layout
 onMouseMove={handleCardMouseMove}
 onMouseEnter={onHoverStart}
 onMouseLeave={handleCardMouseLeave}
 onClick={() => onOpenPanel(project)}
 initial={{ opacity: 0, y: 18 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.96 }}
 transition={{
 type: 'spring',
 stiffness: 220,
 damping: 26,
 mass: 0.6,
 layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
 }}
 style={{
 perspective: 1200,
 // The tilt values from Framer Motion.
 rotateX: prefersReducedMotion ? 0 : springRotateX,
 rotateY: prefersReducedMotion ? 0 : springRotateY,
 // Lift on hover.
 y: isHovered && !prefersReducedMotion ? -6 : 0,
 }}
 className="group relative cursor-pointer"
 >
 <div
 className={`relative rounded-3xl glass-frost gradient-border-violet overflow-hidden flex flex-col h-full ${isHovered ? 'is-active shadow-premium-card-hover' : 'shadow-premium-card'}`}
 style={{
 transformStyle: 'preserve-3d',
 transition: 'box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
 }}
 >
 <CardCarousel project={project} onVideoClick={onVideoClick} />

 {/* Content — padded, with a top divider that fades in on hover. */}
 <div className="flex flex-col flex-1 p-5 gap-3">
 {/* Title + (optional) year */}
 <div className="flex items-start justify-between gap-2 premium-tilt-child">
 <h3
 className="text-base font-heading font-bold text-text-primary line-clamp-1 group-hover:text-violet-200 transition-colors"
 style={{ letterSpacing: '-0.01em' }}
 >
 {project.title}
 </h3>
 {year && (
 <span className="font-mono text-[10px] text-text-muted shrink-0 mt-1 tracking-wider">
 {year}
 </span>
 )}
 </div>

  {/* Description — line-clamp 2. */}
  <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
  {project.description}
  </p>

  {/* Level + Category badges */}
  {(project.difficulty || project.category) && (
    <div className="flex flex-wrap gap-1.5">
      {project.difficulty && LEVEL_COLORS[project.difficulty] && (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border"
          style={{
            background: LEVEL_COLORS[project.difficulty].bg,
            color: LEVEL_COLORS[project.difficulty].text,
            borderColor: LEVEL_COLORS[project.difficulty].text + '30',
          }}
        >
          {LEVEL_LABELS[project.difficulty] || project.difficulty}
        </span>
      )}
      {project.category && CATEGORY_COLORS[project.category] && (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border"
          style={{
            background: CATEGORY_COLORS[project.category].bg,
            color: CATEGORY_COLORS[project.category].text,
            borderColor: CATEGORY_COLORS[project.category].text + '30',
          }}
        >
          {project.category}
        </span>
      )}
    </div>
  )}

  {/* Tech chips. */}
 {visibleTechs.length > 0 && (
 <div className="flex flex-wrap gap-1.5 pt-1">
 {visibleTechs.map((t) => (
 <span key={t} className="tech-chip">
 {t}
 </span>
 ))}
 {extraTechs > 0 && (
 <span className="tech-chip" style={{ color: 'rgb(148, 163, 184)' }}>
 +{extraTechs}
 </span>
 )}
 </div>
 )}

 {/* Spacer pushes the action row to the bottom so all
 * cards in a row have aligned footers. */}
 <div className="flex-1" />

 {/* Action row. */}
 <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
 <MagneticButton
 onClick={(e) => {
 e.stopPropagation();
 router.push(`/projects/${project.slug}`);
 }}
 className="magnetic-press flex-1 h-11 sm:h-9 inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-white"
 style={{
 // Inline so we can pass the gradient.
 background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
 }}
 >
 View
 <span className="text-base leading-none">→</span>
 </MagneticButton>

 {project.projectUrl && (
 <MagneticButton
 ariaLabel="Open live demo"
 onClick={(e) => {
 e.stopPropagation();
 window.open(project.projectUrl, '_blank', 'noopener,noreferrer');
 }}
 className="magnetic-press w-11 h-11 sm:w-9 sm:h-9 inline-flex items-center justify-center rounded-lg text-text-muted hover:text-emerald-300"
 style={{
 background: 'rgba(255,255,255,0.04)',
 border: '1px solid rgba(255,255,255,0.08)',
 }}
 >
 <ExternalLink className="w-3.5 h-3.5" />
 </MagneticButton>
 )}

 {project.githubUrl && (
 <MagneticButton
 ariaLabel="Open GitHub repo"
 onClick={(e) => {
 e.stopPropagation();
 window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
 }}
 className="magnetic-press w-11 h-11 sm:w-9 sm:h-9 inline-flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary"
 style={{
 background: 'rgba(255,255,255,0.04)',
 border: '1px solid rgba(255,255,255,0.08)',
 }}
 >
 <Github className="w-3.5 h-3.5" />
 </MagneticButton>
 )}

 {hasVideo && (
 <MagneticButton
 ariaLabel="Play demo video"
 onClick={(e) => {
 e.stopPropagation();
 onVideoClick?.((project as any).videoUrl);
 }}
 className="magnetic-press w-11 h-11 sm:w-9 sm:h-9 inline-flex items-center justify-center rounded-lg text-red-300"
 style={{
 background: 'rgba(239, 68, 68, 0.08)',
 border: '1px solid rgba(239, 68, 68, 0.25)',
 }}
 >
 <Play className="w-3.5 h-3.5 fill-current" />
 </MagneticButton>
 )}
 </div>
 </div>
 </div>
 </motion.article>
 );
}
