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
  ChevronRight,
  Clock,
  BookOpen,
  MapPin,
  CheckCircle2,
  Circle,
  Zap,
  Target,
  Rocket,
  Wrench,
} from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import ImageCarousel from '@/components/projects/ImageCarousel';
import { sanitizeHtml } from '@/lib/utils';
import type { Project } from '@/types';

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PLANNING: { label: 'Lên kế hoạch', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  IN_PROGRESS: { label: 'Đang phát triển', color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  COMPLETED: { label: 'Hoàn thành', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  MAINTENANCE: { label: 'Bảo trì', color: 'text-purple-400', bg: 'bg-purple-500/15' },
};

const STATUS_ORDER = ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'MAINTENANCE'];

interface TimelineEntry {
  label: string;
  description: string;
  date?: string;
  icon: React.ElementType;
  status: 'done' | 'active' | 'pending';
}

function buildTimeline(project: Project): TimelineEntry[] {
  const currentIdx = STATUS_ORDER.indexOf(project.status);

  const phases: TimelineEntry[] = [
    {
      label: 'Lên kế hoạch',
      description: 'Phân tích yêu cầu, nghiên cứu công nghệ, thiết kế kiến trúc hệ thống tổng thể.',
      date: project.startDate,
      icon: Target,
      status: currentIdx >= 0 ? 'done' : 'pending',
    },
    {
      label: 'Phát triển',
      description: 'Xây dựng tính năng cốt lõi, API endpoints, giao diện người dùng theo design system.',
      icon: Zap,
      status: currentIdx >= 1 ? 'done' : currentIdx === 1 ? 'active' : 'pending',
    },
    {
      label: 'Kiểm thử',
      description: 'Unit tests, integration tests, QA, sửa lỗi và tối ưu hiệu năng trước khi release.',
      icon: Wrench,
      status: currentIdx >= 2 ? 'done' : currentIdx === 2 ? 'active' : 'pending',
    },
    {
      label: 'Triển khai',
      description: 'Deploy lên production, monitoring, viết documentation và bàn giao cho người dùng.',
      icon: Rocket,
      status: project.status === 'COMPLETED' || project.status === 'MAINTENANCE' ? 'done'
        : project.status === 'IN_PROGRESS' ? 'active' : 'pending',
    },
  ];

  return phases;
}

function parseMarkdown(content: string): string {
  if (!content) return '';
  return content
    .replace(/^## (.+)$/gm,
      '<h3 class="text-xl font-bold text-text-primary mt-8 mb-4 flex items-center gap-3"><span class="w-1 h-6 rounded-full bg-gradient-to-b from-neon-violet to-neon-indigo shrink-0"></span>$1</h3>')
    .replace(/^### (.+)$/gm,
      '<h4 class="text-base font-semibold text-neon-violet mt-5 mb-2 flex items-center gap-2"><span class="w-1 h-4 rounded-full bg-neon-violet shrink-0"></span>$1</h4>')
    .replace(/^> (.+)$/gm,
      '<blockquote class="border-l-4 border-neon-violet/50 pl-5 py-3 my-4 rounded-r-xl text-text-secondary italic" style="background:rgba(139,92,246,0.06)">$1</blockquote>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-neon-violet font-semibold">$1</strong>')
    .replace(/_(.+?)_/g, '<em class="text-neon-indigo">$1</em>')
    .replace(/`(.+?)`/g,
      '<code class="px-2 py-0.5 rounded text-sm" style="background:rgba(139,92,246,0.12);color:#c4b5fd;border:1px solid rgba(139,92,246,0.2)">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 hover:underline transition-colors">$1</a>')
    .replace(/^- (.+)$/gm,
      '<li class="flex items-start gap-3 text-text-secondary my-2 text-sm leading-relaxed"><span class="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0 flex-shrink-0" style="background:linear-gradient(135deg,#a855f7,#ec4899)"></span>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm,
      '<li class="flex items-start gap-3 text-text-secondary my-2 text-sm leading-relaxed list-none"><span class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5" style="background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);color:#818cf8">$1</span>$2</li>')
    .replace(/^---$/gm,
      '<hr class="my-6 border-0 h-px" style="background:linear-gradient(90deg,transparent,rgba(168,85,247,0.3),transparent)" />')
    .replace(/\n\n/g, '</p><p class="text-text-secondary leading-relaxed mt-3 text-sm">')
    .replace(/^(?!<[hla]|<code|<li|<hr)(.+)$/gm, '$1');
}

function renderContent(content: string): string {
  if (!content) return '';
  const paragraphs = content.split(/\n\n+/);
  return paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<li') ||
        trimmed.startsWith('<hr')
      ) {
        return trimmed;
      }
      return `<p class="text-text-secondary leading-relaxed mt-3 text-sm">${parseMarkdown(trimmed)}</p>`;
    })
    .join('\n');
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProjectBySlug, getProjectsByStatus } = useProjectStore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [showVideo, setShowVideo] = useState(false);

  const slug = params?.slug as string;

  useEffect(() => {
    if (!slug) return;

    const found = getProjectBySlug(slug);
    if (!found) {
      router.push('/projects');
      return;
    }

    setProject(found);

    const related = getProjectsByStatus(found.status)
      .filter((p) => p.slug !== slug)
      .slice(0, 3);
    setRelatedProjects(related);
    setLoading(false);
  }, [slug, getProjectBySlug, getProjectsByStatus, router]);

  const timeline = useMemo(() => (project ? buildTimeline(project) : []), [project]);
  const techs = Array.isArray(project?.technologies) ? project.technologies : [];

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

  const status = statusConfig[project.status] || statusConfig.PLANNING;

  const c = {
    primary: '#a855f7',
    secondary: '#ec4899',
    tertiary: '#22d3ee',
    border: 'rgba(168,85,247,0.2)',
    borderLight: 'rgba(168,85,247,0.08)',
    surface: 'rgba(20,15,40,0.5)',
  };

  return (
    <div className="min-h-screen bg-darkbg pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/projects')}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Quay lại dự án</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-2">
                {project.title}
              </h1>
              {project.role && (
                <p className="text-sm font-medium" style={{ color: c.primary }}>
                  Vai trò: {project.role}
                </p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color} flex-shrink-0 mt-2`}>
              {status.label}
            </span>
          </div>

          <p className="text-lg text-text-secondary leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {(project as any).videoUrl && (
              <button
                onClick={() => {
                  const id = extractYouTubeId((project as any).videoUrl!);
                  if (id) setShowVideo(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
                  boxShadow: '0 4px 20px rgba(255,0,0,0.3)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z" />
                  <path d="M9.75 15.5V8.5l6.5 3.5-6.5 3.5z" fill="#FF0000" />
                </svg>
                Xem Demo
              </button>
            )}
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
                style={{ boxShadow: `0 4px 20px ${c.primary}40` }}
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
          </div>
        </motion.div>

        {/* Image Gallery Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8"
        >
          <ImageCarousel
            images={project.images ?? []}
            thumbnailUrl={project.thumbnailUrl}
            title={project.title}
            videoUrl={(project as any).videoUrl}
            onVideoClick={(url) => {
              const id = extractYouTubeId(url);
              if (id) setShowVideo(true);
              else window.open(url, '_blank');
            }}
          />
        </motion.div>

        {/* Technologies */}
        {techs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5" style={{ color: c.primary }} />
              Công nghệ sử dụng
            </h2>
            <div className="flex flex-wrap gap-2">
              {techs.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  className="px-4 py-2 bg-darkcard border border-darkborder rounded-xl text-sm text-text-secondary hover:text-neon-violet hover:border-neon-violet/30 transition-colors cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-8 rounded-2xl p-6 border"
            style={{
              background: c.surface,
              borderColor: c.border,
            }}
          >
            <h2 className="text-lg font-heading font-bold text-text-primary mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: c.primary }} />
              Lộ trình phát triển
            </h2>
            <div className="relative pl-6">
              {/* Gradient line */}
              <div
                className="absolute left-[7px] top-2 bottom-2 w-px rounded-full"
                style={{
                  background: `linear-gradient(180deg, ${c.primary}, ${c.secondary}, ${c.tertiary})`,
                  opacity: 0.35,
                }}
              />
              <div className="space-y-5">
                {timeline.map((entry, index) => {
                  const Icon = entry.icon;
                  const isDone = entry.status === 'done';
                  const isActive = entry.status === 'active';
                  return (
                    <motion.div
                      key={entry.label}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + index * 0.07 }}
                      className="relative flex items-start gap-4"
                    >
                      {/* Node */}
                      <div
                        className="absolute -left-6 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1"
                        style={{
                          background: isDone
                            ? `linear-gradient(135deg, ${c.primary}, ${c.secondary})`
                            : isActive
                            ? c.surface
                            : c.surface,
                          borderColor: isDone ? c.primary : isActive ? c.primary : c.border,
                          boxShadow: isActive ? `0 0 16px ${c.primary}80` : isDone ? `0 0 8px ${c.primary}40` : 'none',
                        }}
                      >
                        {isDone && <CheckCircle2 className="w-2 h-2 text-white" />}
                        {isActive && <Circle className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.primary }} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-5" style={{ borderBottom: index < timeline.length - 1 ? `1px solid ${c.borderLight}` : 'none' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold" style={{ color: isDone || isActive ? c.primary : '#64748b' }}>
                            {entry.label}
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: `${c.primary}20`, color: c.primary }}>
                              Đang làm
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: isDone || isActive ? '#94a3b8' : '#475569' }}>
                          {entry.description}
                        </p>
                        {entry.date && (
                          <span className="text-xs mt-1.5 block flex items-center gap-1" style={{ color: `${c.primary}aa` }}>
                            <Clock className="w-3 h-3" />
                            {formatDate(entry.date)}
                          </span>
                        )}
                      </div>

                      {/* Icon */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: isDone || isActive ? `${c.primary}15` : 'rgba(255,255,255,0.03)',
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: isDone || isActive ? c.primary : '#475569' }} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Case Study / Rich Content */}
        {project.content && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" style={{ color: c.primary }} />
              Hành trình phát triển
            </h2>
            <div
              className="rounded-2xl p-6 sm:p-8 border"
              style={{
                background: c.surface,
                borderColor: c.border,
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderContent(project.content)) }} />
            </div>
          </motion.div>
        )}

        {/* Project Dates */}
        {(project.startDate || project.endDate) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mb-8 flex items-center gap-3 text-sm text-text-secondary"
          >
            <Calendar className="w-4 h-4" style={{ color: c.primary }} />
            {project.startDate && (
              <span>{formatDate(project.startDate)}</span>
            )}
            {project.startDate && project.endDate && (
              <ChevronRight className="w-4 h-4 text-text-muted" />
            )}
            {project.endDate ? (
              <span>{formatDate(project.endDate)}</span>
            ) : project.startDate ? (
              <span className="text-neon-violet font-medium">— Hiện tại</span>
            ) : null}
          </motion.div>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-12 pt-8 border-t border-darkborder"
          >
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: c.primary }} />
              Dự án liên quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedProjects.map((rp) => (
                <button
                  key={rp.id}
                  onClick={() => router.push(`/projects/${rp.slug}`)}
                  className="text-left bg-darkcard border border-darkborder rounded-2xl p-5 hover:border-neon-violet/30 transition-colors group"
                >
                  <h3 className="font-medium text-text-primary group-hover:text-neon-violet transition-colors">
                    {rp.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">{rp.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(Array.isArray(rp.technologies) ? rp.technologies.slice(0, 3) : []).map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-neon-indigo/10 text-neon-indigo rounded text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── YouTube Modal ── */}
      {showVideo && project?.videoUrl && (
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
                src={`https://www.youtube.com/embed/${extractYouTubeId(project.videoUrl!)}?autoplay=1`}
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
