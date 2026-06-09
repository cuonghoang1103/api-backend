'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Github, Calendar, Users, Code2, Eye, Star, GitFork, SlidersHorizontal, Play } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { projectsApi } from '@/lib/api';
import type { Project } from '@/types';
import ProjectDetailDrawer from '@/components/projects/ProjectDetailDrawer';

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  PLANNING: 'Planning',
  MAINTENANCE: 'Maintenance',
  ON_HOLD: 'On Hold',
};

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  PLANNING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  MAINTENANCE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ON_HOLD: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

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

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ─── Mini Carousel for Project Cards ──────────────────────────────────────────
function CardCarousel({
  project,
  onVideoClick,
}: {
  project: Project;
  onVideoClick?: (url: string) => void;
}) {
  const [current, setCurrent] = useState(0);

  const allImages = [
    project.thumbnailUrl,
    ...(project.images ?? []),
  ].filter((u): u is string => typeof u === 'string' && u.trim().length > 0 && u.startsWith('http'));

  const hasImages = allImages.length > 0;
  const hasMultiple = allImages.length > 1;

  return (
    <div className="relative h-48 overflow-hidden" style={{ borderRadius: '0' }}>
      {/* ── No images: gradient placeholder ── */}
      {!hasImages ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, #1a1040 0%, #0f0a20 50%, #1e0a30 100%)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(ellipse 60% 60% at 30% 50%, rgba(168,85,247,0.4) 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-15"
            style={{
              background: `radial-gradient(ellipse 50% 50% at 70% 50%, rgba(236,72,153,0.4) 0%, transparent 70%)`,
            }}
          />
          <div
            className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(168,85,247,0.15)',
              border: '1px solid rgba(168,85,247,0.3)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M23 7l-7 5 7 5V7z" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="1" y="5" width="15" height="14" rx="2" stroke="#a855f7" strokeWidth="2" />
            </svg>
          </div>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            {allImages[current] && (
              <motion.img
                key={current}
                src={allImages[current]}
                alt={project.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* ── YouTube badge ── */}
          {(project as any).videoUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVideoClick?.((project as any).videoUrl);
              }}
              className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white transition-all hover:scale-105"
              style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z" />
                <path d="M9.75 15.5V8.5l6.5 3.5-6.5 3.5z" fill="#fff" />
              </svg>
              Demo
            </button>
          )}

          {project.featured && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-lg shadow-lg z-20">
              NOI BAT
            </div>
          )}

          {project.status && !project.featured && (
            <div className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-lg border z-20 ${STATUS_COLORS[project.status] || ''}`}>
              {STATUS_LABELS[project.status] || project.status}
            </div>
          )}

          {hasMultiple && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrent((c) => c === 0 ? allImages.length - 1 : c - 1); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M7 2L4 5L7 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrent((c) => c === allImages.length - 1 ? 0 : c + 1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M3 2L6 5L3 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          {hasMultiple && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === current ? '16px' : '4px',
                    background: i === current ? '#a855f7' : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
          )}

          {hasMultiple && (
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium z-10"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: '#fff' }}
            >
              {current + 1}/{allImages.length}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-darkcard rounded-2xl overflow-hidden border border-darkborder/50">
            <div className="h-48 bg-darkbg" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-darkbg rounded-lg w-3/4" />
              <div className="h-4 bg-darkbg rounded w-full" />
              <div className="h-4 bg-darkbg rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Project Card ───────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  starred,
  onToggleStar,
  onOpenPanel,
  onVideoClick,
}: {
  project: Project;
  starred: boolean;
  onToggleStar: () => void;
  onOpenPanel: () => void;
  onVideoClick?: (url: string) => void;
}) {
  const stats = MOCK_STATS[project.id] ?? { views: 0, stars: 0, forks: 0 };
  const hasGallery = Array.isArray(project.images) && project.images.length > 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onClick={onOpenPanel}
      className="group flex flex-col bg-darkcard rounded-2xl border border-darkborder/50 hover:border-neon-violet/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-neon-violet/10 cursor-pointer"
    >
      {/* Card Carousel */}
      <CardCarousel project={project} onVideoClick={onVideoClick} />

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        {/* Title */}
        <h3 className="text-lg font-heading font-bold text-text-primary mb-2 group-hover:text-neon-violet transition-colors line-clamp-1">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-shrink-0">
          {project.description}
        </p>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-4 flex-shrink-0">
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Eye className="w-3.5 h-3.5" />
            {formatCount(stats.views)}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleStar(); }}
            className={`flex items-center gap-1 text-xs transition-all hover:scale-110 ${starred ? 'text-yellow-400' : 'text-text-muted hover:text-yellow-400'}`}
          >
            <motion.span animate={starred ? { scale: [1, 1.4, 1] } : { scale: 1 }} transition={{ duration: 0.25 }}>
              <Star className="w-3.5 h-3.5" fill={starred ? 'currentColor' : 'none'} />
            </motion.span>
            {formatCount(stats.stars + (starred ? 1 : 0))}
          </button>
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <GitFork className="w-3.5 h-3.5" />
            {formatCount(stats.forks)}
          </span>
          {starred && (
            <span className="ml-auto flex items-center gap-1 text-xs text-neon-violet/60">
              <Star className="w-3.5 h-3.5 fill-current" />
              Gallery
            </span>
          )}
        </div>

        {/* Tech stack tags */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 flex-shrink-0">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-neon-indigo/10 text-neon-indigo/80 text-xs rounded-md border border-neon-indigo/20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-0.5 text-text-muted text-xs">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-text-muted mb-4 flex-shrink-0">
          {project.role && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {project.role}
            </span>
          )}
          {project.duration && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {project.duration}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto pt-4 border-t border-darkborder/50">
          <button
            onClick={(e) => { e.stopPropagation(); onOpenPanel(); }}
            className="flex-1 py-2 text-center text-sm bg-gradient-to-r from-neon-indigo/20 to-neon-violet/20 border border-neon-violet/30 text-neon-violet rounded-lg hover:from-neon-indigo/30 hover:to-neon-violet/30 transition-all font-medium"
          >
            Chi tiết
          </button>
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-darkbg border border-darkborder rounded-lg text-text-muted hover:text-neon-emerald hover:border-neon-emerald/30 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-darkbg border border-darkborder rounded-lg text-text-muted hover:text-text-primary hover:border-darkborder transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {(project as any).videoUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVideoClick?.((project as any).videoUrl);
              }}
              className="p-2 rounded-lg transition-colors"
              style={{
                background: 'linear-gradient(135deg, rgba(255,0,0,0.15), rgba(200,0,0,0.1))',
                border: '1px solid rgba(255,0,0,0.25)',
                color: '#ff4444',
              }}
              title="Xem Video Demo"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────────
export default function ProjectsClient() {
  const { projects, setProjects } = useProjectStore();

  const [starredIds, setStarredIds] = useState<Set<number>>(() => new Set());
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  const openVideoModal = (url: string) => {
    const id = extractYouTubeId(url);
    if (id) setVideoModalUrl(id);
    else window.open(url, '_blank');
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await projectsApi.getAll({ size: 100 });
        const backendProjects: Project[] = res.data?.data?.content || res.data?.data || [];
        if (backendProjects.length > 0) {
          setProjects(backendProjects);
        }
      } catch {
        // fall back to seed data from store
      }
    };
    loadProjects();
  }, [setProjects]);

  const allTechs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const pageSize = 9;

  const filtered = useMemo(() => {
    let result = [...projects];
    if (searchKeyword) {
      const q = searchKeyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.technologies ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter) result = result.filter((p) => p.status === statusFilter);
    if (techFilter) {
      result = result.filter(
        (p) => (p.technologies ?? []).some((t) => t.toLowerCase() === techFilter.toLowerCase())
      );
    }
    return result;
  }, [projects, searchKeyword, statusFilter, techFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status === statusFilter ? '' : status);
    setCurrentPage(1);
  };

  const handleTechFilter = (tech: string) => {
    setTechFilter(tech === techFilter ? '' : tech);
    setCurrentPage(1);
  };

  const toggleStar = (id: number) => {
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openPanel = (project: Project) => setSelectedProject(project);
  const closePanel = () => setSelectedProject(null);

  return (
    <>
      {/* Slide-over Panel */}
      <ProjectDetailDrawer
        project={selectedProject}
        onClose={closePanel}
        starred={selectedProject ? starredIds.has(selectedProject.id) : false}
        onToggleStar={selectedProject ? () => toggleStar(selectedProject.id) : undefined}
      />

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 space-y-3">
        {/* Search + Status row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Tìm kiếm dự án..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-darkcard border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Tìm kiếm
            </button>
          </form>

          <div className="flex gap-2 flex-wrap">
            {['', 'COMPLETED', 'IN_PROGRESS', 'PLANNING', 'MAINTENANCE'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-neon-violet/20 border-neon-violet text-neon-violet'
                    : 'bg-darkcard border-darkborder text-text-secondary hover:border-neon-violet/30 hover:text-text-primary'
                }`}
              >
                {status === '' ? 'Tất cả' : STATUS_LABELS[status] ?? status}
              </button>
            ))}
          </div>
        </div>

        {/* Tech-stack filter row */}
        {allTechs.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs text-text-muted shrink-0 pr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Lọc:</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {allTechs.map((tech) => (
                <button
                  key={tech}
                  onClick={() => handleTechFilter(tech)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all shrink-0 ${
                    techFilter === tech
                      ? 'bg-neon-indigo/20 border-neon-indigo text-neon-indigo'
                      : 'bg-darkcard border-darkborder/60 text-text-secondary hover:border-neon-indigo/30 hover:text-neon-indigo/80'
                  }`}
                >
                  {tech}
                </button>
              ))}
              {techFilter && (
                <button
                  onClick={() => setTechFilter('')}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                >
                  × Clear
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Active filter chips */}
      {(statusFilter || techFilter) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {statusFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neon-violet/10 border border-neon-violet/30 text-neon-violet text-xs rounded-full">
                {STATUS_LABELS[statusFilter] ?? statusFilter}
                <button onClick={() => setStatusFilter('')} className="hover:text-white transition-colors font-bold">×</button>
              </span>
            )}
            {techFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neon-indigo/10 border border-neon-indigo/30 text-neon-indigo text-xs rounded-full">
                {techFilter}
                <button onClick={() => setTechFilter('')} className="hover:text-white transition-colors font-bold">×</button>
              </span>
            )}
            <span className="text-xs text-text-muted">
              {filtered.length} kết quả
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Code2 className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
              Không tìm thấy dự án nào
            </h3>
            <p className="text-text-secondary">
              Thử từ khóa hoặc bộ lọc khác
            </p>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {paginated.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    starred={starredIds.has(project.id)}
                    onToggleStar={() => toggleStar(project.id)}
                    onOpenPanel={() => openPanel(project)}
                    onVideoClick={openVideoModal}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-darkcard border border-darkborder rounded-xl text-text-secondary disabled:opacity-30 hover:border-neon-violet/30 hover:text-text-primary transition-colors"
                >
                  Trước
                </button>
                <span className="px-4 py-2 text-text-secondary text-sm">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-darkcard border border-darkborder rounded-xl text-text-secondary disabled:opacity-30 hover:border-neon-violet/30 hover:text-text-primary transition-colors"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── YouTube Modal ── */}
      {videoModalUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setVideoModalUrl(null)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setVideoModalUrl(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm font-medium"
            >
              Đóng
            </button>
            <div style={{ aspectRatio: '16/9' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoModalUrl}?autoplay=1`}
                title="Project Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
