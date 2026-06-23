'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
 ArrowLeft,
 ExternalLink,
 Github,
 Calendar,
 Code2,
 Sparkles,
 Clock,
 BookOpen,
 ChevronRight,
 ArrowRight,
 GraduationCap,
 Trophy,
 Target,
 CheckCircle2,
} from 'lucide-react';
import { projectsApi } from '@/lib/api';
import type { Project, ProjectListItem, ProjectListKind } from '@/types';
import { useProjectStore } from '@/store/projectStore';
import ImageCarousel from '@/components/projects/ImageCarousel';
import MarkdownRenderer from '@/components/projects/MarkdownRenderer';
import TableOfContents from '@/components/projects/TableOfContents';
import ReadingProgressBar from '@/components/projects/ReadingProgressBar';
import MilestoneTimeline from '@/components/projects/MilestoneTimeline';
import FeatureChecklist from '@/components/projects/FeatureChecklist';
import ResourcesList from '@/components/projects/ResourcesList';
import ProjectLikeButton from '@/components/projects/ProjectLikeButton';
import ProjectPdfExport from '@/components/projects/ProjectPdfExport';
import CodeBlock from '@/components/projects/CodeBlock';

const STATUS_LABELS: Record<string, string> = {
 COMPLETED: 'Hoàn thành',
 IN_PROGRESS: 'Đang phát triển',
 PLANNING: 'Lên kế hoạch',
 MAINTENANCE: 'Bảo trì',
 ON_HOLD: 'Tạm dừng',
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
 COMPLETED: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
 IN_PROGRESS: { bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
 PLANNING: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
 MAINTENANCE: { bg: 'bg-purple-500/15', text: 'text-purple-400' },
 ON_HOLD: { bg: 'bg-gray-500/15', text: 'text-gray-400' },
};

const DIFFICULTY_LABELS: Record<string, string> = {
 BEGINNER: 'Cơ bản',
 INTERMEDIATE: 'Trung bình',
 ADVANCED: 'Nâng cao',
};

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
 BEGINNER: { bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
 INTERMEDIATE: { bg: 'bg-yellow-500/15', text: 'text-yellow-300' },
 ADVANCED: { bg: 'bg-rose-500/15', text: 'text-rose-300' },
};

function extractYouTubeId(url: string): string | null {
 const patterns = [
 /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
 ];
 for (const p of patterns) {
 const m = url.match(p);
 if (m) return m[1];
 }
 return null;
}

function formatDate(dateStr?: string) {
 if (!dateStr) return null;
 try {
 return new Date(dateStr).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
 } catch {
 return dateStr;
 }
}

function formatNumber(n: number): string {
 if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
 return String(n);
}

/**
 * Reading time fallback — backend doesn't expose this yet,
 * so we compute client-side. Strips code fences first
 * because they read slower (200wpm assumes prose).
 */
function computeReadingTime(mdx: string | null | undefined): number {
 if (!mdx) return 1;
 const stripped = mdx.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
 const words = stripped.split(/\s+/).filter(Boolean).length;
 return Math.max(1, Math.round(words / 200));
}

const C = {
 primary: '#a855f7',
 secondary: '#ec4899',
 tertiary: '#22d3ee',
 surface: 'rgba(20,15,40,0.5)',
 border: 'rgba(168,85,247,0.2)',
};

export default function ProjectDetailPage() {
 const params = useParams();
 const router = useRouter();
 const { getProjectBySlug, projects: storeProjects } = useProjectStore();

 const [project, setProject] = useState<Project | null>(null);
 const [loading, setLoading] = useState(true);
 const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
 const [prevProject, setPrevProject] = useState<Project | null>(null);
 const [nextProject, setNextProject] = useState<Project | null>(null);
 const [showVideo, setShowVideo] = useState(false);

 const slug = params?.slug as string;

 useEffect(() => {
 if (!slug) return;
 let cancelled = false;

 const loadFromStore = (): Project | null => {
 const found = getProjectBySlug(slug);
 if (!found) return null;
 return found;
 };

 const loadFromApi = async (): Promise<Project | null> => {
 try {
 const res = await projectsApi.getBySlug(slug);
 return (res.data?.data as Project | undefined) ?? null;
 } catch {
 return null;
 }
 };

 (async () => {
 setLoading(true);
 const apiProject = await loadFromApi();
 if (cancelled) return;
 const finalProject = apiProject || loadFromStore();
 if (!finalProject) {
 router.push('/projects');
 setLoading(false);
 return;
 }
 setProject(finalProject);

 // Prev/next — walk store list, find current index
 const all = storeProjects;
 const idx = all.findIndex((p) => p.slug === slug);
 if (idx >= 0) {
 setPrevProject(idx > 0 ? all[idx - 1] : null);
 setNextProject(idx < all.length - 1 ? all[idx + 1] : null);
 }

 // Related — same category first, fall back to same difficulty
 const sameCategory = all
 .filter((p) => p.slug !== slug && p.category && p.category === finalProject.category)
 .slice(0, 3);
 const sameDifficulty = all
 .filter((p) => p.slug !== slug && p.difficulty && p.difficulty === finalProject.difficulty)
 .slice(0, 3);
 const merged: Project[] = [...sameCategory];
 for (const p of sameDifficulty) {
 if (merged.length >= 3) break;
 if (!merged.find((m) => m.slug === p.slug)) merged.push(p);
 }
 setRelatedProjects(merged);

 setLoading(false);
 })();

 return () => { cancelled = true; };
 }, [slug, getProjectBySlug, storeProjects, router]);

 const techs = useMemo(
 () => (Array.isArray(project?.technologies) ? project!.technologies : []),
 [project],
 );

 const readingMinutes = useMemo(() => {
 if (!project) return 0;
 const src = project.bodyMdx || project.content || '';
 return computeReadingTime(src);
 }, [project]);

 // Filter list-of-strings items by kind. We keep them as
 // three separate lists (memoized) so each public section
 // is rendered with its own header + icon, matching the
 // editor's per-section treatment.
 const coreKnowledge = useMemo(
 () => (project?.listItems ?? []).filter((x) => x.kind === 'CORE_KNOWLEDGE'),
 [project],
 );
 const portfolioBonus = useMemo(
 () => (project?.listItems ?? []).filter((x) => x.kind === 'PORTFOLIO_BONUS'),
 [project],
 );
 const completionOutcome = useMemo(
 () => (project?.listItems ?? []).filter((x) => x.kind === 'COMPLETION_OUTCOME'),
 [project],
 );

 if (loading) {
 return (
 <div className="min-h-screen bg-darkbg pt-24 pb-16 px-4 sm:px-6 flex items-center justify-center">
 <div className="text-center">
 <div className="w-12 h-12 border-2 border-neon-violet border-t-transparent rounded-full animate-spin mx-auto mb-4" />
 <p className="text-text-muted">Đang tải...</p>
 </div>
 </div>
 );
 }

 if (!project) return null;

 const statusMeta = STATUS_COLORS[project.status] ?? STATUS_COLORS.PLANNING;
 const difficultyMeta = project.difficulty ? DIFFICULTY_COLORS[project.difficulty] ?? null : null;
 const videoId = project.videoUrl ? extractYouTubeId(project.videoUrl) : null;
 const hasBody = Boolean(project.bodyHtml || project.bodyMdx || project.content);
 const hasSchema = Boolean(project.schemaCode && project.schemaCode.trim());

 return (
 <div className="min-h-screen bg-darkbg">
 <ReadingProgressBar targetSelector="case-study-content" />

 <div className="pt-24 pb-16 px-4 sm:px-6">
 <div className="max-w-6xl mx-auto">
 {/* Back link */}
 <motion.button
 initial={{ opacity: 0, x: -12 }}
 animate={{ opacity: 1, x: 0 }}
 onClick={() => router.push('/projects')}
 className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-8 group"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 <span className="text-sm">Quay lại dự án</span>
 </motion.button>

 {/* Hero */}
 <motion.header
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4 }}
 className="mb-8"
 >
 <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
 <div className="flex-1 min-w-0">
 <div className="flex flex-wrap items-center gap-2 mb-3">
 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.bg} ${statusMeta.text}`}>
 {STATUS_LABELS[project.status] ?? project.status}
 </span>
 {project.featured && (
 <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/15 text-yellow-300">
 Nổi bật
 </span>
 )}
 {difficultyMeta && (
 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyMeta.bg} ${difficultyMeta.text}`}>
 {DIFFICULTY_LABELS[project.difficulty!] ?? project.difficulty}
 </span>
 )}
 {project.category && (
 <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#22d3ee]/10 text-[#22d3ee]">
 {project.category}
 </span>
 )}
 </div>

 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-text-primary mb-3 leading-tight">
 {project.title}
 </h1>

 {project.description && (
 <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-4 max-w-3xl">
 {project.description}
 </p>
 )}

 <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-muted">
 {project.role && (
 <span className="inline-flex items-center gap-1.5">
 <Code2 className="w-3.5 h-3.5" style={{ color: C.primary }} />
 {project.role}
 </span>
 )}
 {project.duration && (
 <span className="inline-flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5" style={{ color: C.primary }} />
 {project.duration}
 </span>
 )}
 {hasBody && (
 <span className="inline-flex items-center gap-1.5">
 <BookOpen className="w-3.5 h-3.5" style={{ color: C.primary }} />
 {readingMinutes} phút đọc
 </span>
 )}
 {typeof project.viewCount === 'number' && (
 <span className="inline-flex items-center gap-1.5">
 <Sparkles className="w-3.5 h-3.5" style={{ color: C.primary }} />
 {formatNumber(project.viewCount)} lượt xem
 </span>
 )}
 {(project.startDate || project.endDate) && (
 <span className="inline-flex items-center gap-1.5">
 <Calendar className="w-3.5 h-3.5" style={{ color: C.primary }} />
 {formatDate(project.startDate)}
 {project.startDate && project.endDate && <ChevronRight className="w-3 h-3" />}
 {project.endDate ? formatDate(project.endDate) : <span className="text-neon-violet">— Hiện tại</span>}
 </span>
 )}
 </div>
 </div>
 </div>

 {/* CTAs */}
 <div className="flex flex-wrap gap-3 mt-5">
 {videoId && (
 <button
 onClick={() => setShowVideo(true)}
 className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
 style={{ background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)', boxShadow: '0 4px 20px rgba(255,0,0,0.3)' }}
 >
 <PlayIcon />
 Xem Demo
 </button>
 )}
 {project.projectUrl && (
 <a
 href={project.projectUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
 style={{ boxShadow: `0 4px 20px ${C.primary}40` }}
 >
 <ExternalLink className="w-4 h-4" />
 Xem trực tuyến
 </a>
 )}
 {project.githubUrl && (
 <a
 href={project.githubUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 px-5 py-2.5 bg-darkcard border border-darkborder text-text-primary text-sm font-medium rounded-xl hover:border-neon-indigo/30 transition-colors"
 >
 <Github className="w-4 h-4" />
 Mã nguồn
 </a>
 )}
 <ProjectLikeButton slug={project.slug} initialCount={project.likeCount ?? 0} />
 <ProjectPdfExport project={project} />
 </div>
 </motion.header>

 {/* Image gallery carousel */}
 {(project.thumbnailUrl || (project.images && project.images.length > 0) || project.videoUrl) && (
 <motion.div
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1, duration: 0.4 }}
 className="mb-10"
 >
 <ImageCarousel
 images={project.images ?? []}
 thumbnailUrl={project.thumbnailUrl}
 title={project.title}
 videoUrl={project.videoUrl}
 onVideoClick={(url) => {
 const id = extractYouTubeId(url);
 if (id) setShowVideo(true);
 else window.open(url, '_blank');
 }}
 />
 </motion.div>
 )}

 {/* Tech pills */}
 {techs.length > 0 && (
 <motion.section
 initial={{ opacity: 0, y: 16 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ duration: 0.4 }}
 className="mb-10"
 >
 <h2 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
 <Code2 className="w-5 h-5" style={{ color: C.primary }} />
 Công nghệ sử dụng
 </h2>
 <div className="flex flex-wrap gap-2">
 {techs.map((tech, i) => (
 <motion.span
 key={tech}
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ delay: i * 0.03, duration: 0.2 }}
 className="px-4 py-2 bg-darkcard border border-darkborder rounded-xl text-sm text-text-secondary hover:text-neon-violet hover:border-neon-violet/30 transition-colors"
 >
 {tech}
 </motion.span>
 ))}
 </div>
 </motion.section>
 )}

 <MilestoneTimeline milestones={project.milestones ?? []} />
 <FeatureChecklist features={project.features ?? []} />

 {/* Body: 2-column TOC + content */}
 {hasBody && (
 <div
 id="case-study-content"
 className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-8 lg:gap-12 mt-4"
 >
 <TableOfContents contentSelector=".case-study-body" headingOffset={120} />
 <article className="min-w-0">
 <h2 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
 <BookOpen className="w-5 h-5" style={{ color: C.primary }} />
 Case Study
 </h2>
 <div
 className="rounded-2xl p-6 sm:p-8 border"
 style={{ background: C.surface, borderColor: C.border }}
 >
 <MarkdownRenderer
 html={project.bodyHtml}
 mdx={project.bodyMdx || project.content}
 openLinksInNewTab
 />
 </div>
 </article>
 </div>
 )}

 {/* Database schema */}
 {hasSchema && (
 <motion.section
 initial={{ opacity: 0, y: 16 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ duration: 0.4 }}
 className="mt-10"
 >
 <h2 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
 <Code2 className="w-5 h-5" style={{ color: C.primary }} />
 Database Schema
 </h2>
 <CodeBlock
 code={project.schemaCode!}
 language={project.schemaLang ?? 'prisma'}
 fileName="schema"
 />
 </motion.section>
 )}

 <ResourcesList resources={project.resources ?? []} />

 {/* 3 list-of-strings sections — all share the same
 component shape but each gets its own header + icon to
 match the editor's per-section treatment. The component
 is rendered with framer-motion stagger for a polished
 reveal as the user scrolls past the timeline. */}
 <ListItemsSection
 title="Kiến thức cần học vững"
 subtitle="Những kiến thức nền tảng cần nắm vững khi bắt tay vào dự án"
 icon={GraduationCap}
 accent="text-cyan-400"
 items={coreKnowledge}
 />
 <ListItemsSection
 title="Điểm cộng cho portfolio"
 subtitle="Những thứ khiến dự án nổi bật hơn khi ứng tuyển hoặc chia sẻ"
 icon={Trophy}
 accent="text-yellow-400"
 items={portfolioBonus}
 />
 <ListItemsSection
 title="Đánh giá sau khi hoàn thành"
 subtitle="Những gì bạn sẽ 'biết cách làm' sau khi đưa dự án lên production"
 icon={Target}
 accent="text-emerald-400"
 items={completionOutcome}
 />

 {/* Related projects */}
 {relatedProjects.length > 0 && (
 <motion.section
 initial={{ opacity: 0, y: 16 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ duration: 0.4 }}
 className="mt-12 pt-8 border-t border-darkborder"
 >
 <h2 className="text-xl font-heading font-bold text-text-primary mb-6 flex items-center gap-2">
 <Sparkles className="w-5 h-5" style={{ color: C.primary }} />
 Dự án liên quan
 </h2>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 {relatedProjects.map((rp) => (
 <button
 key={rp.id}
 onClick={() => router.push(`/projects/${rp.slug}`)}
 className="text-left bg-darkcard border border-darkborder rounded-2xl p-5 hover:border-neon-violet/30 transition-all group"
 >
 {rp.thumbnailUrl && (
 <div className="relative h-32 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl">
 <img
 src={rp.thumbnailUrl}
 alt={rp.title}
 className="w-full h-full object-cover transition-transform group-hover:scale-105"
 />
 </div>
 )}
 <h3 className="font-medium text-text-primary group-hover:text-neon-violet transition-colors line-clamp-1">
 {rp.title}
 </h3>
 {rp.description && (
 <p className="text-sm text-text-muted mt-1 line-clamp-2">{rp.description}</p>
 )}
 <div className="flex flex-wrap gap-1 mt-3">
 {(Array.isArray(rp.technologies) ? rp.technologies.slice(0, 3) : []).map((t) => (
 <span key={t} className="px-2 py-0.5 bg-neon-indigo/10 text-neon-indigo rounded text-xs">
 {t}
 </span>
 ))}
 </div>
 </button>
 ))}
 </div>
 </motion.section>
 )}

 {/* Prev/Next nav */}
 {(prevProject || nextProject) && (
 <motion.nav
 initial={{ opacity: 0, y: 16 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ duration: 0.4 }}
 className="mt-10 pt-8 border-t border-darkborder"
 aria-label="Project pagination"
 >
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {prevProject ? (
 <button
 onClick={() => router.push(`/projects/${prevProject.slug}`)}
 className="text-left p-5 rounded-2xl border border-darkborder bg-darkcard hover:border-neon-violet/30 transition-all group"
 >
 <span className="text-xs text-text-muted inline-flex items-center gap-1 mb-1">
 <ArrowLeft className="w-3 h-3" />
 Dự án trước
 </span>
 <p className="text-sm font-medium text-text-primary group-hover:text-neon-violet transition-colors line-clamp-1">
 {prevProject.title}
 </p>
 </button>
 ) : <div />}

 {nextProject && (
 <button
 onClick={() => router.push(`/projects/${nextProject.slug}`)}
 className="text-right p-5 rounded-2xl border border-darkborder bg-darkcard hover:border-neon-violet/30 transition-all group sm:col-start-2"
 >
 <span className="text-xs text-text-muted inline-flex items-center gap-1 mb-1">
 Dự án tiếp theo
 <ArrowRight className="w-3 h-3" />
 </span>
 <p className="text-sm font-medium text-text-primary group-hover:text-neon-violet transition-colors line-clamp-1">
 {nextProject.title}
 </p>
 </button>
 )}
 </div>
 </motion.nav>
 )}
 </div>
 </div>

 {/* YouTube modal */}
 {showVideo && videoId && (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center p-4"
 style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
 onClick={() => setShowVideo(false)}
 >
 <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
 <button
 onClick={() => setShowVideo(false)}
 className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm font-medium"
 >
 Đóng
 </button>
 <div style={{ aspectRatio: '16/9' }}>
 <iframe
 src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
 title="Project Demo Video"
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 allowFullScreen
 className="w-full h-full rounded-2xl"
 />
 </div>
 </div>
 </div>
 )}
 </div>
 );
}

function PlayIcon() {
 return (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
 <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z" />
 <path d="M9.75 15.5V8.5l6.5 3.5-6.5 3.5z" fill="#FF0000" />
 </svg>
 );
}

// ─────────────────────────────────────────────────────────────────
// ListItemsSection — renders one of the three "list of
// strings" sections (Core Knowledge / Portfolio Bonus /
// Completion Outcomes). Visually consistent with the rest of
// the case study page (rounded dark card, neon icon, staggered
// reveal). Returns null when the list is empty so the public
// page only shows sections that have content.
// ─────────────────────────────────────────────────────────────────
function ListItemsSection({
 title,
 subtitle,
 icon: Icon,
 accent,
 items,
}: {
 title: string;
 subtitle: string;
 icon: typeof CheckCircle2;
 accent: string;
 items: ProjectListItem[];
}) {
 if (!items || items.length === 0) return null;
 return (
 <motion.section
 initial={{ opacity: 0, y: 16 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ duration: 0.4 }}
 className="mt-10"
 >
 <div className="flex items-center gap-2 mb-1">
 <Icon className={`w-5 h-5 ${accent}`} />
 <h2 className="text-lg font-heading font-bold text-text-primary">{title}</h2>
 <span className="ml-auto text-xs text-text-muted">{items.length} mục</span>
 </div>
 <p className="text-sm text-text-muted mb-4">{subtitle}</p>
 <ul className="space-y-2">
 {items.map((it, i) => (
 <motion.li
 key={it.id ?? i}
 initial={{ opacity: 0, x: -6 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: '-30px' }}
 transition={{ duration: 0.25, delay: i * 0.03 }}
 className="flex items-start gap-2 bg-darkcard border border-darkborder rounded-xl px-4 py-3"
 >
 <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${accent}`} />
 <span className="text-sm text-text-primary leading-relaxed">{it.content}</span>
 </motion.li>
 ))}
 </ul>
 </motion.section>
 );
}