'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  X, ExternalLink, Github, Calendar, Code2, Eye, Star, GitFork,
  Clock, ChevronRight, BookOpen, Layers, Play,
} from 'lucide-react';
import ImageCarousel from './ImageCarousel';
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

function isSafeUrl(url: unknown): url is string {
  return typeof url === 'string' && url.trim().length > 0 && url.startsWith('http');
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function parseMarkdown(content: string): string {
  if (!content) return '';
  return content
    .replace(/^## (.+)$/gm, '<h3 class="text-lg font-bold text-text-primary mt-6 mb-3 flex items-center gap-2"><span class="w-1 h-5 rounded-full bg-gradient-to-b from-neon-violet to-neon-indigo shrink-0"></span>$1</h3>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-neon-violet/50 pl-4 py-2 my-3 rounded-r-lg bg-neon-violet/5 text-text-secondary italic">$1</blockquote>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-neon-violet font-semibold">$1</strong>')
    .replace(/_(.+?)_/g, '<em class="text-neon-indigo">$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-text-secondary my-1.5"><span class="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style="background:linear-gradient(135deg,#a855f7,#ec4899)"></span>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="flex items-start gap-2 text-text-secondary my-1.5"><span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-neon-indigo/15 text-neon-indigo mt-0.5">$1</span>$2</li>')
    .replace(/^---$/gm, '<hr class="my-5 border-darkborder" />')
    .replace(/\n\n/g, '</p><p class="text-text-secondary leading-relaxed mt-3">')
    .replace(/^(?!<[hlpb])(.+)$/gm, '$1');
}

function renderContent(content: string): string {
  if (!content) return '';
  const paragraphs = content.split(/\n\n+/);
  return paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<li') || trimmed.startsWith('<hr')) {
        return trimmed;
      }
      return `<p class="text-text-secondary leading-relaxed mt-3">${parseMarkdown(trimmed)}</p>`;
    })
    .join('\n');
}

interface ProjectDetailDrawerProps {
  project: Project | null;
  onClose: () => void;
  starred?: boolean;
  onToggleStar?: () => void;
}

const MOCK_STATS: Record<number, { views: number; stars: number; forks: number }> = {
  1: { views: 1420, stars: 89, forks: 24 },
  2: { views: 890, stars: 45, forks: 12 },
  3: { views: 670, stars: 38, forks: 9 },
  4: { views: 450, stars: 22, forks: 6 },
  5: { views: 320, stars: 15, forks: 4 },
  6: { views: 280, stars: 18, forks: 3 },
  7: { views: 150, stars: 8, forks: 2 },
  8: { views: 520, stars: 31, forks: 7 },
  9: { views: 390, stars: 19, forks: 5 },
};

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function ProjectDetailDrawer({
  project,
  onClose,
  starred = false,
  onToggleStar,
}: ProjectDetailDrawerProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const c = {
    primary: '#a855f7',
    secondary: '#ec4899',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    glassBg: 'rgba(10,6,25,0.92)',
    glassBgLight: 'rgba(20,15,40,0.7)',
    border: 'rgba(168,85,247,0.18)',
  };

  const stats = project ? (MOCK_STATS[project.id] ?? { views: 0, stars: 0, forks: 0 }) : null;
  const statusStyle = project ? STATUS_COLORS[project.status] : null;
  const techs = Array.isArray(project?.technologies) ? project.technologies : [];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl flex flex-col"
            style={{ background: c.glassBg }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 shrink-0 border-b"
              style={{ borderColor: c.border }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}
                >
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.primary }}>
                    Chi tiết dự án
                  </p>
                  <h2 className="text-base font-heading font-bold" style={{ color: c.text }}>
                    {project.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
                style={{ color: c.textMuted }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 space-y-5">
                {/* Image Carousel */}
                <ImageCarousel
                  images={project.images ?? []}
                  thumbnailUrl={project.thumbnailUrl}
                  title={project.title}
                />

                {/* Status + Featured badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {statusStyle && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      {STATUS_LABELS[project.status] ?? project.status}
                    </span>
                  )}
                  {project.featured && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-400/15 text-yellow-300">
                      Nổi bật
                    </span>
                  )}
                  {stats && (
                    <div className="ml-auto flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs" style={{ color: c.textMuted }}>
                        <Eye className="w-3.5 h-3.5" />
                        {formatCount(stats.views)}
                      </span>
                      {onToggleStar && (
                        <button
                          onClick={onToggleStar}
                          className={`flex items-center gap-1 text-xs transition-all hover:scale-110 ${starred ? 'text-yellow-400' : 'text-text-muted hover:text-yellow-400'}`}
                        >
                          <Star className="w-3.5 h-3.5" fill={starred ? 'currentColor' : 'none'} />
                          {formatCount(stats.stars + (starred ? 1 : 0))}
                        </button>
                      )}
                      <span className="flex items-center gap-1 text-xs" style={{ color: c.textMuted }}>
                        <GitFork className="w-3.5 h-3.5" />
                        {formatCount(stats.forks)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed" style={{ color: c.textSecondary }}>
                  {project.description}
                </p>

                {/* Meta info */}
                <div className="flex flex-wrap gap-4">
                  {project.role && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: c.textSecondary }}>
                      <Code2 className="w-3.5 h-3.5" style={{ color: c.primary }} />
                      {project.role}
                    </div>
                  )}
                  {project.duration && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: c.textSecondary }}>
                      <Clock className="w-3.5 h-3.5" style={{ color: c.primary }} />
                      {project.duration}
                    </div>
                  )}
                  {(project.startDate || project.endDate) && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: c.textSecondary }}>
                      <Calendar className="w-3.5 h-3.5" style={{ color: c.primary }} />
                      {formatDate(project.startDate)}
                      {project.startDate && project.endDate && (
                        <ChevronRight className="w-3 h-3" />
                      )}
                      {formatDate(project.endDate) && project.endDate !== project.startDate
                        ? formatDate(project.endDate)
                        : project.startDate && !project.endDate
                        ? <span className="text-neon-violet">— Hiện tại</span>
                        : null}
                    </div>
                  )}
                </div>

                {/* Tech Stack */}
                {techs.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: c.primary }}>
                      Công nghệ sử dụng
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {techs.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-lg text-xs font-medium border"
                          style={{
                            background: `${c.primary}10`,
                            borderColor: `${c.primary}30`,
                            color: c.primary,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case Study Content */}
                {project.content && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: c.primary }}>
                      <BookOpen className="w-3.5 h-3.5" />
                      Hành trình phát triển
                    </p>
                    <div
                      className="rounded-xl p-5 border"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: `${c.primary}20`,
                      }}
                    >
                      <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderContent(project.content)) }}
                      />
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex gap-3 pt-2">
                  {(project as any).videoUrl && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{
                        background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
                        boxShadow: '0 4px 16px rgba(255,0,0,0.3)',
                      }}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Xem Video Demo
                    </button>
                  )}
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 text-center text-sm font-medium rounded-xl text-white transition-opacity hover:opacity-90"
                      style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Xem trực tuyến
                      </span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors"
                      style={{ borderColor: c.border, color: c.textSecondary }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = c.primary; (e.currentTarget as HTMLElement).style.color = c.text; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.textSecondary; }}
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors"
                    style={{ borderColor: c.border, color: c.textSecondary }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = c.primary; (e.currentTarget as HTMLElement).style.color = c.text; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.textSecondary; }}
                  >
                    Trang chi tiết →
                  </Link>
                </div>

                {/* ── YouTube Modal ── */}
                {isMounted && showVideo && (project as any).videoUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setShowVideo(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="relative w-full max-w-4xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setShowVideo(false)}
                        className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm font-medium transition-colors"
                      >
                        Đóng
                      </button>
                      <div style={{ aspectRatio: '16/9' }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId((project as any).videoUrl!)}?autoplay=1`}
                          title="Project Demo Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full rounded-2xl border"
                          style={{ borderColor: c.border }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
