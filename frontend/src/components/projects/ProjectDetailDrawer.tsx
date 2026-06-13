'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, Github, Calendar, Code2, Eye, Star, GitFork,
  Clock, ChevronRight, BookOpen, Layers, Play, Copy, Check,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
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

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleCopy(); }}
      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono text-[#64748b] hover:text-[#94a3b8] transition-colors"
      title="Copy code"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

const markdownComponents: Components = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code({ node: _node, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match;
    const code = String(children).replace(/\n$/, '');

    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded-md text-[#a855f7] bg-neon-violet/10 font-mono text-xs"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="relative group my-4 rounded-xl overflow-hidden border border-[#22d3ee]/15">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1e2530] border-b border-[#2d3748]">
          <span className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-widest">
            {match[1]}
          </span>
          <CopyButton code={code} />
        </div>
        {/* Code */}
        <pre className="!m-0 !rounded-none !border-0 overflow-x-auto">
          <code className={`${match[1]} hljs !font-mono !text-[13px] !leading-relaxed !bg-transparent`} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  },
};

interface ProjectDetailDrawerProps {
  project: Project | null;
  onClose: () => void;
  starred?: boolean;
  onToggleStar?: () => void;
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

  const statusStyle = project ? STATUS_COLORS[project.status] : null;
  const techs = Array.isArray(project?.technologies) ? project.technologies : [];
  const videoId = project?.videoUrl ? extractYouTubeId(project.videoUrl) : null;

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* iOS Sheet Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 w-full max-w-3xl mx-auto rounded-t-3xl flex flex-col max-h-[92vh]"
            style={{ background: '#0d1117' }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 shrink-0 border-b"
              style={{ borderColor: 'rgba(168,85,247,0.18)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                >
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#a855f7' }}>
                    Chi tiết dự án
                  </p>
                  <h2 className="text-base font-heading font-bold text-white truncate max-w-[200px] sm:max-w-[300px]">
                    {project.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
                style={{ color: '#64748b' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 space-y-5">
                {/* Cover Image */}
                {project.thumbnailUrl && (
                  <div className="relative rounded-2xl overflow-hidden h-48 sm:h-56">
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                )}

                {/* Status + Featured badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {statusStyle && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      {STATUS_LABELS[project.status] ?? project.status}
                    </span>
                  )}
                  {project.isFeatured && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-400/15 text-yellow-300">
                      Noi Bat
                    </span>
                  )}
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                    {project.description}
                  </p>
                )}

                {/* Meta info */}
                <div className="flex flex-wrap gap-4">
                  {project.role && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94a3b8' }}>
                      <Code2 className="w-3.5 h-3.5" style={{ color: '#a855f7' }} />
                      {project.role}
                    </div>
                  )}
                  {project.duration && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94a3b8' }}>
                      <Clock className="w-3.5 h-3.5" style={{ color: '#a855f7' }} />
                      {project.duration}
                    </div>
                  )}
                  {(project.startDate || project.endDate) && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94a3b8' }}>
                      <Calendar className="w-3.5 h-3.5" style={{ color: '#a855f7' }} />
                      {formatDate(project.startDate)}
                      {project.startDate && project.endDate && <ChevronRight className="w-3 h-3" />}
                      {project.startDate && !project.endDate
                        ? <span className="text-neon-violet">— Hien tai</span>
                        : formatDate(project.endDate)}
                    </div>
                  )}
                </div>

                {/* Tech Stack */}
                {techs.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a855f7' }}>
                      Cong nghe su dung
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {techs.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-lg text-xs font-medium border"
                          style={{
                            background: 'rgba(168,85,247,0.08)',
                            borderColor: 'rgba(168,85,247,0.25)',
                            color: '#c084fc',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Markdown with syntax highlighting */}
                {project.content && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#a855f7' }}>
                      <BookOpen className="w-3.5 h-3.5" />
                      Hanh trinh phat trien
                    </p>
                    <div
                      className="rounded-xl p-5 border overflow-hidden"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: 'rgba(168,85,247,0.15)',
                      }}
                    >
                      <div className="prose-invert max-w-none">
                        <style>{`
                          .prose-invert { color: #94a3b8; font-size: 14px; line-height: 1.8; }
                          .prose-invert h1, .prose-invert h2, .prose-invert h3 { color: #f8fafc; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; }
                          .prose-invert h1 { font-size: 1.25rem; }
                          .prose-invert h2 { font-size: 1.1rem; }
                          .prose-invert h3 { font-size: 1rem; }
                          .prose-invert p { margin-bottom: 0.75em; }
                          .prose-invert a { color: #a855f7; text-decoration: underline; }
                          .prose-invert strong { color: #f8fafc; }
                          .prose-invert em { color: #818cf8; }
                          .prose-invert ul { list-style: none; padding-left: 0; }
                          .prose-invert ul li { padding-left: 1.2em; position: relative; margin-bottom: 0.3em; }
                          .prose-invert ul li::before { content: ''; position: absolute; left: 0; top: 0.65em; width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, #a855f7, #ec4899); }
                          .prose-invert ol { padding-left: 1.5em; }
                          .prose-invert ol li { margin-bottom: 0.3em; }
                          .prose-invert blockquote { border-left: 3px solid #a855f7; padding-left: 1em; margin: 1em 0; font-style: italic; color: #64748b; }
                          .prose-invert hr { border-color: rgba(168,85,247,0.2); margin: 1.5em 0; }
                          .prose-invert table { width: 100%; border-collapse: collapse; font-size: 13px; }
                          .prose-invert th { background: rgba(168,85,247,0.1); padding: 8px; text-align: left; }
                          .prose-invert td { padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                          .prose-invert pre { margin: 0; }
                          /* highlight.js theme — VS Code Dark Plus inspired */
                          .hljs { background: #1e2530; color: #d4d4d4; }
                          .hljs-keyword, .hljs-selector-tag, .hljs-built_in, .hljs-name, .hljs-tag { color: #569cd6; }
                          .hljs-string, .hljs-title, .hljs-section, .hljs-attribute, .hljs-literal, .hljs-template-tag, .hljs-template-variable, .hljs-type, .hljs-addition { color: #ce9178; }
                          .hljs-deletion, .hljs-selector-id, .hljs-selector-class, .hljs-selector-attr, .hljs-selector-pseudo { color: #ce9178; }
                          .hljs-number { color: #b5cea8; }
                          .hljs-comment, .hljs-quote { color: #6a9955; font-style: italic; }
                          .hljs-variable, .hljs-params { color: #9cdcfe; }
                          .hljs-meta { color: #dcdcaa; }
                          .hljs-function, .hljs-title.function_ { color: #dcdcaa; }
                          .hljs-property { color: #9cdcfe; }
                          .hljs-operator, .hljs-punctuation { color: #d4d4d4; }
                          .hljs-class .hljs-title, .hljs-title.class_ { color: #4ec9b0; }
                          .hljs-attr, .hljs-attribute { color: #9cdcfe; }
                        `}</style>
                        <ReactMarkdown
                          rehypePlugins={[rehypeHighlight]}
                          components={markdownComponents}
                        >
                          {project.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex gap-3 pt-2 flex-wrap">
                  {videoId && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{
                        background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
                        boxShadow: '0 4px 16px rgba(255,0,0,0.3)',
                      }}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Xem Demo
                    </button>
                  )}
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 text-center text-sm font-medium rounded-xl text-white transition-opacity hover:opacity-90 text-center"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Xem truc tuyen
                      </span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors"
                      style={{ borderColor: 'rgba(168,85,247,0.25)', color: '#94a3b8' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#a855f7';
                        e.currentTarget.style.color = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.25)';
                        e.currentTarget.style.color = '#94a3b8';
                      }}
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>

                {/* YouTube Embed */}
                <AnimatePresence>
                  {showVideo && videoId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-2xl overflow-hidden border"
                      style={{ borderColor: 'rgba(168,85,247,0.25)' }}
                    >
                      <div style={{ aspectRatio: '16/9' }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                          title="Project Demo Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
