'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Code2, SlidersHorizontal, FileSearch, Rss, X, ChevronDown, ArrowUpDown } from 'lucide-react';
import { projectsApi } from '@/lib/api';
import type { Project } from '@/types';
import ProjectCardPremium from '@/components/projects/ProjectCardPremium';
import ProjectsSkeleton from '@/components/projects/ProjectsSkeleton';
import ProjectsEmpty from '@/components/projects/ProjectsEmpty';
import ProjectsHero from './ProjectsHero';

// Filter constants from admin editor
const CATEGORIES = ['Web', 'Mobile', 'AI', 'DevOps', 'Game', 'IoT', 'Data', 'Tooling'] as const;
const LEVELS = [
  { value: '', label: 'Tất cả' },
  { value: 'BEGINNER', label: 'Cơ bản' },
  { value: 'INTERMEDIATE', label: 'Trung bình' },
  { value: 'ADVANCED', label: 'Nâng cao' },
] as const;
const STATUSES = [
  { value: '', label: 'Tất cả' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'PLANNING', label: 'Planning' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'ON_HOLD', label: 'On Hold' },
] as const;
const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'level-asc', label: 'Cơ bản → Nâng cao' },
  { value: 'level-desc', label: 'Nâng cao → Cơ bản' },
] as const;

type SortValue = 'newest' | 'oldest' | 'level-asc' | 'level-desc';
type LevelValue = '' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
type StatusValue = string;

// Level badge colors
const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  INTERMEDIATE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ADVANCED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Cơ bản',
  INTERMEDIATE: 'Trung bình',
  ADVANCED: 'Nâng cao',
};

// Status badge colors
const STATUS_COLORS: Record<string, string> = {
  COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  PLANNING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  MAINTENANCE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ON_HOLD: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  PLANNING: 'Planning',
  MAINTENANCE: 'Maintenance',
  ON_HOLD: 'On Hold',
};

// Level sort order for sorting
const LEVEL_ORDER: Record<string, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  '': 0,
};

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

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelValue>('');
  const [statusFilter, setStatusFilter] = useState<StatusValue>('');
  const [sortBy, setSortBy] = useState<SortValue>('newest');

  // UI state
  const [filterOpen, setFilterOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setSearchKeyword(value);
    }, 300);
  };

  // Load projects
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

  // All unique techs from projects
  const allTechs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  // Active filters count
  const activeFiltersCount = [
    categoryFilter,
    levelFilter,
    statusFilter,
    searchKeyword,
  ].filter(Boolean).length;

  // Filtered and sorted projects
  const filtered = useMemo(() => {
    let result = [...projects];

    // Search (title, description, category, tech tags) - case insensitive
    if (searchKeyword) {
      const q = searchKeyword.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.technologies ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Level filter (difficulty)
    if (levelFilter) {
      result = result.filter((p) => p.difficulty === levelFilter);
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'level-asc':
        result.sort((a, b) => (LEVEL_ORDER[a.difficulty || ''] || 0) - (LEVEL_ORDER[b.difficulty || ''] || 0));
        break;
      case 'level-desc':
        result.sort((a, b) => (LEVEL_ORDER[b.difficulty || ''] || 0) - (LEVEL_ORDER[a.difficulty || ''] || 0));
        break;
    }

    return result;
  }, [projects, searchKeyword, categoryFilter, levelFilter, statusFilter, sortBy]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchKeyword('');
    setSearchInput('');
    setCategoryFilter('');
    setLevelFilter('');
    setStatusFilter('');
    setSortBy('newest');
  }, []);

  const openVideoModal = (url: string) => {
    const id = extractYouTubeId(url);
    if (id) setVideoModalUrl(id);
    else window.open(url, '_blank');
  };

  const openPanel = (project: Project) => {
    router.push(`/projects/${project.slug}`);
  };

  return (
    <>
      {/* Compact Hero */}
      <ProjectsHero
        projectCount={projects.length}
        techCount={allTechs.length}
        featuredCount={projects.filter((p) => p.featured).length}
      />

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 space-y-3">
        {/* Search + Controls row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-darkcard border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); setSearchKeyword(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortValue)}
              className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-darkcard border border-darkborder text-text-secondary text-sm focus:outline-none focus:border-neon-violet/50 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
              filterOpen || activeFiltersCount > 0
                ? 'bg-neon-violet/20 border-neon-violet text-neon-violet'
                : 'bg-darkcard border-darkborder text-text-secondary hover:border-neon-violet/30 hover:text-text-primary'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Bộ lọc
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-neon-violet text-white text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Advanced search link */}
          <Link
            href={searchInput.trim() ? `/projects/search?q=${encodeURIComponent(searchInput.trim())}` : '/projects/search'}
            className="px-4 py-3 rounded-xl border border-darkborder text-text-secondary hover:border-neon-violet/50 hover:text-white transition-colors text-sm inline-flex items-center gap-1.5"
          >
            <FileSearch className="w-4 h-4" />
            <span className="hidden sm:inline">Tìm nâng cao</span>
          </Link>

          {/* RSS */}
          <a
            href="/api/v1/projects/feed.xml"
            target="_blank"
            rel="alternate"
            className="px-3 py-3 rounded-xl border border-darkborder text-orange-400 hover:border-orange-400/50 transition-colors"
            title="RSS feed"
          >
            <Rss className="w-4 h-4" />
          </a>
        </div>

        {/* Expandable filters */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-darkcard/50 border border-darkborder">
                {/* Category filter */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Danh mục</span>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          categoryFilter === cat
                            ? 'bg-neon-violet/20 border-neon-violet text-neon-violet'
                            : 'bg-darkcard border-darkborder/60 text-text-secondary hover:border-neon-violet/30 hover:text-text-primary'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level filter */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Mức độ</span>
                  <div className="flex flex-wrap gap-2">
                    {LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setLevelFilter(level.value as LevelValue)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          levelFilter === level.value
                            ? 'bg-neon-violet/20 border-neon-violet text-neon-violet'
                            : 'bg-darkcard border-darkborder/60 text-text-secondary hover:border-neon-violet/30 hover:text-text-primary'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status filter */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Trạng thái</span>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => setStatusFilter(statusFilter === status.value ? '' : status.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          statusFilter === status.value
                            ? 'bg-neon-violet/20 border-neon-violet text-neon-violet'
                            : 'bg-darkcard border-darkborder/60 text-text-secondary hover:border-neon-violet/30 hover:text-text-primary'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Active filters + results count */}
      {(searchKeyword || categoryFilter || levelFilter || statusFilter) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-muted">
              {filtered.length} kết quả
            </span>
            <button
              onClick={clearAllFilters}
              className="px-2 py-1 rounded text-xs text-neon-violet hover:bg-neon-violet/10 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <ProjectsSkeleton count={9} />
        ) : filtered.length === 0 ? (
          <ProjectsEmpty
            onClearFilters={clearAllFilters}
            hasFilters={Boolean(searchKeyword || categoryFilter || levelFilter || statusFilter)}
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
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
