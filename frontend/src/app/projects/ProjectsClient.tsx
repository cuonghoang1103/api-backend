'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Code2, SlidersHorizontal, FileSearch, Rss } from 'lucide-react';
import { projectsApi } from '@/lib/api';
import type { Project } from '@/types';
// Premium redesign (Phase 6) — these replace the inline
// ProjectCard, loading shimmer, and empty state with
// spring-based, glassmorphic, 3D-tilted equivalents.
import ProjectCardPremium from '@/components/projects/ProjectCardPremium';
import ProjectsSkeleton from '@/components/projects/ProjectsSkeleton';
import ProjectsEmpty from '@/components/projects/ProjectsEmpty';
import ProjectsHero from './ProjectsHero';

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

// ─── Main Component ──────────────────────────────────────────────────────────────
export default function ProjectsClient() {
 const router = useRouter();
 const [projects, setProjects] = useState<Project[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchInput, setSearchInput] = useState('');
 const [searchKeyword, setSearchKeyword] = useState('');
 const [statusFilter, setStatusFilter] = useState('');
 const [techFilter, setTechFilter] = useState('');
 const [currentPage, setCurrentPage] = useState(1);
  // ── Removed in Phase 5: selectedProject state for the
 // legacy ProjectDetailDrawer. Card clicks now navigate
 // to /projects/[slug] instead of opening a modal.
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
 const [filterOpen, setFilterOpen] = useState(false);
 const [hoveredId, setHoveredId] = useState<number | null>(null);

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

 // Clear all active filters + search in one shot. Wired
 // to the empty-state CTA. Resets to page 1.
 const clearAllFilters = useCallback(() => {
 setSearchKeyword('');
 setSearchInput('');
 setStatusFilter('');
 setTechFilter('');
 setCurrentPage(1);
 }, []);

 const openPanel = (project: Project) => {
 // Phase 5: navigate to the dedicated detail route
 // instead of opening the legacy modal drawer.
 router.push(`/projects/${project.slug}`);
 };

 return (
 <>
 {/* Premium hero — receives live counts from the data
 * so the three counters always reflect the current set
 * of projects. Mounts before the filters so the page
 * first paints the editorial header, then the controls. */}
 <ProjectsHero
 projectCount={projects.length}
 techCount={allTechs.length}
 featuredCount={projects.filter((p) => p.featured).length}
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
 <Link
 href={searchInput.trim() ? `/projects/search?q=${encodeURIComponent(searchInput.trim())}` : '/projects/search'}
 className="px-4 py-3 rounded-xl border border-darkborder text-text-secondary hover:border-neon-violet/50 hover:text-white transition-colors whitespace-nowrap text-sm inline-flex items-center gap-1.5"
 title="Tìm kiếm nâng cao trong nội dung case study"
 >
 <FileSearch className="w-4 h-4" />
 Tìm nâng cao
 </Link>
 <a
 href="/api/v1/projects/feed.xml"
 target="_blank"
 rel="alternate"
 className="px-3 py-3 rounded-xl border border-darkborder text-orange-400 hover:border-orange-400/50 transition-colors"
 title="RSS feed"
 >
 <Rss className="w-4 h-4" />
 </a>
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
 // Premium shimmer skeleton — 9 cards in the same
 // 1/2/3-col responsive grid the real cards use, so the
 // page never jumps when the data arrives.
 <ProjectsSkeleton count={9} />
 ) : filtered.length === 0 ? (
 // Premium empty state — ringed search-off icon + clear
 // filters CTA. Only shows the CTA when filters are
 // actually active (so it doesn't appear on a fresh page
 // with no projects at all).
 <ProjectsEmpty
 onClearFilters={clearAllFilters}
 hasFilters={Boolean(searchKeyword || statusFilter || techFilter)}
 />
 ) : (
 <>
 <motion.div
 layout
 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
 >
 <AnimatePresence mode="popLayout">
 {paginated.map((project) => (
 <ProjectCardPremium
 key={project.id}
 project={project}
 onOpenPanel={openPanel}
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
