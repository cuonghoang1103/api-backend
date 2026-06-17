'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Github, Calendar, Users, Code2, Eye, Star, GitFork, SlidersHorizontal, Play, ChevronDown } from 'lucide-react';
import { projectsApi } from '@/lib/api';
import type { Project } from '@/types';
import ProjectDetailDrawer from '@/components/projects/ProjectDetailDrawer';
import { SafeImage } from '@/components/ui/SafeImage';

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

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

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
    <div className="relative h-48 overflow-hidden">
      {!hasImages ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, #1a1040 0%, #0f0a20 50%, #1e0a30 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse 60% 60% at 30% 50%, rgba(168,85,247,0.4) 0%, transparent 70%)` }} />
          <div className="absolute inset-0 opacity-15" style={{ background: `radial-gradient(ellipse 50% 50% at 70% 50%, rgba(236,72,153,0.4) 0%, transparent 70%)` }} />
          <div
            className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}
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
              <SafeImage
                key={current}
                src={allImages[current]}
                alt={project.title}
                label={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {(project as any).videoUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVideoClick?.((project as any).videoUrl);
              }}
              className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white transition-all hover:scale-105"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z" />
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
                  style={{ width: i === current ? '16px' : '4px', background: i === current ? '#a855f7' : 'rgba(255,255,255,0.4)' }}
                />
              ))}
            </div>
          )}
        </>
      )}
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
  isHovered,
  onHoverStart,
  onHoverEnd,
}: {
  project: Project;
  starred: boolean;
  onToggleStar: () => void;
  onOpenPanel: () => void;
  onVideoClick?: (url: string) => void;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: isHovered ? 0.85 : 1, scale: isHovered ? 1.03 : 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onOpenPanel}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="group flex flex-col bg-darkcard rounded-2xl border border-darkborder/50 overflow-hidden shadow-lg hover:shadow-neon-violet/10 cursor-pointer"
      style={{
        borderRadius: isHovered ? '24px' : '16px',
        transition: 'border-radius 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isHovered
          ? '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(168,85,247,0.15)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        filter: isHovered ? 'drop-shadow(0 20px 40px rgba(168,85,247,0.2))' : 'none',
      }}
    >
      <CardCarousel project={project} onVideoClick={onVideoClick} />

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-heading font-bold text-text-primary mb-2 group-hover:text-neon-violet transition-colors line-clamp-1">
          {project.title}
        </h3>

        <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-shrink-0">
          {project.description}
        </p>

        <div className="flex items-center gap-4 mb-4 flex-shrink-0">
          {project.role && (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Users className="w-3.5 h-3.5" />
              {project.role}
            </span>
          )}
          {project.duration && (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Calendar className="w-3.5 h-3.5" />
              {project.duration}
            </span>
          )}
        </div>

        <div className="flex gap-3 mt-auto pt-4 border-t border-darkborder/50">
          <button
            onClick={(e) => { e.stopPropagation(); onOpenPanel(); }}
            className="flex-1 py-2 text-center text-sm bg-gradient-to-r from-neon-indigo/20 to-neon-violet/20 border border-neon-violet/30 text-neon-violet rounded-lg hover:from-neon-indigo/30 hover:to-neon-violet/30 transition-all font-medium"
          >
            Chi tiet
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
              className="p-2 bg-darkbg border border-darkborder rounded-lg text-text-muted hover:text-text-primary transition-colors"
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [starredIds, setStarredIds] = useState<Set<number>>(() => new Set());

  const openVideoModal = (url: string) => {
    const id = extractYouTubeId(url);
    if (id) setVideoModalUrl(id);
    else window.open(url, '_blank');
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const res = await projectsApi.getAll({ size: 100 });
        const data: Project[] = res.data?.data?.content || res.data?.data || [];
        setProjects(data);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

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
      <ProjectDetailDrawer
        project={selectedProject}
        onClose={closePanel}
        starred={selectedProject ? starredIds.has(selectedProject.id) : false}
        onToggleStar={selectedProject ? () => toggleStar(selectedProject.id) : undefined}
      />

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 space-y-3">
        {/* Search + Filter toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Tim kiem du an..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-darkcard border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Tim kiem
            </button>
          </form>

          {/* Filter toggle button */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${
              filterOpen || statusFilter || techFilter
                ? 'bg-neon-violet/20 border-neon-violet text-neon-violet'
                : 'bg-darkcard border-darkborder text-text-secondary hover:border-neon-violet/30 hover:text-text-primary'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Bo loc
            {(statusFilter || techFilter) && (
              <span className="w-5 h-5 rounded-full bg-neon-violet text-white text-[10px] font-bold flex items-center justify-center">
                {(statusFilter ? 1 : 0) + (techFilter ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Status filter chips */}
        <motion.div
          animate={{ height: filterOpen ? 'auto' : 0, opacity: filterOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-2 pb-1">
            <div className="flex items-center gap-1.5 text-xs text-text-muted shrink-0">
              <span>Trang thai:</span>
            </div>
            {['', 'COMPLETED', 'IN_PROGRESS', 'PLANNING', 'MAINTENANCE'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-neon-violet/20 border-neon-violet text-neon-violet'
                    : 'bg-darkcard border-darkborder/60 text-text-secondary hover:border-neon-violet/30 hover:text-text-primary'
                }`}
              >
                {status === '' ? 'Tat ca' : STATUS_LABELS[status] ?? status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tech filter chips */}
        <motion.div
          animate={{ height: filterOpen ? 'auto' : 0, opacity: filterOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-1.5 items-center">
            <div className="flex items-center gap-1.5 text-xs text-text-muted shrink-0">
              <Code2 className="w-3.5 h-3.5" />
              <span>Tech:</span>
            </div>
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
                xoa
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Active filter chips */}
      {(statusFilter || techFilter) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {statusFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neon-violet/10 border border-neon-violet/30 text-neon-violet text-xs rounded-full">
                {STATUS_LABELS[statusFilter] ?? statusFilter}
                <button onClick={() => setStatusFilter('')} className="hover:text-white transition-colors font-bold">x</button>
              </span>
            )}
            {techFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neon-indigo/10 border border-neon-indigo/30 text-neon-indigo text-xs rounded-full">
                {techFilter}
                <button onClick={() => setTechFilter('')} className="hover:text-white transition-colors font-bold">x</button>
              </span>
            )}
            <span className="text-xs text-text-muted">
              {filtered.length} ket qua
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-darkcard rounded-2xl overflow-hidden border border-darkborder/50">
                  <div className="h-48 bg-darkbg" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-darkbg rounded-lg w-3/4" />
                    <div className="h-4 bg-darkbg rounded w-full" />
                    <div className="h-4 bg-darkbg rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Code2 className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
              Khong tim thay du an nao
            </h3>
            <p className="text-text-secondary">
              Thu tu khoa hoac bo loc khac
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
                    isHovered={hoveredId === project.id}
                    onHoverStart={() => setHoveredId(project.id)}
                    onHoverEnd={() => setHoveredId(null)}
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
                  Truoc
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

      {/* YouTube Modal */}
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
              Dong
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
