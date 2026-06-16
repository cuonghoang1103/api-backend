'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Star, ExternalLink, Github, Filter, X, Sparkles,
  Tag as TagIcon, Code2, ChevronLeft, ChevronRight, RefreshCw,
  ArrowDownAZ, Calendar, Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { githubApi, GithubRepo, GithubRepoTag, GithubRepoListResponse } from '@/lib/api';
import { languageBadgeClasses, formatStars } from '@/lib/repos';
import { renderReview } from '@/lib/markdown';
import ParticleBackground from '@/components/repos/ParticleBackground';

interface ReposFeedClientProps {
  initialData: GithubRepoListResponse | null;
  initialTags: GithubRepoTag[];
  initialLanguages: { name: string; count: number }[];
}

type SortKey = 'newest' | 'oldest' | 'most-stars' | 'least-stars' | 'name-asc' | 'name-desc';

const SORT_OPTIONS: { value: SortKey; label: string; icon: React.ReactNode }[] = [
  { value: 'newest', label: 'Moi nhat', icon: <Calendar className="h-3.5 w-3.5" /> },
  { value: 'oldest', label: 'Cu nhat', icon: <Calendar className="h-3.5 w-3.5 opacity-60" /> },
  { value: 'most-stars', label: 'Nhieu sao', icon: <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> },
  { value: 'least-stars', label: 'It sao', icon: <Star className="h-3.5 w-3.5" /> },
  { value: 'name-asc', label: 'Ten A-Z', icon: <ArrowDownAZ className="h-3.5 w-3.5" /> },
  { value: 'name-desc', label: 'Ten Z-A', icon: <ArrowDownAZ className="h-3.5 w-3.5 rotate-180" /> },
];

export default function ReposFeedClient({
  initialData,
  initialTags,
  initialLanguages,
}: ReposFeedClientProps) {
  const [repos, setRepos] = useState<GithubRepo[]>(initialData?.items ?? []);
  const [tags, setTags] = useState<GithubRepoTag[]>(initialTags);
  const [languages, setLanguages] = useState<{ name: string; count: number }[]>(initialLanguages);
  const [filters, setFilters] = useState({
    keyword: '',
    tagId: null as number | null,
    language: null as string | null,
    page: 1,
  });
  const [sort, setSort] = useState<SortKey>('newest');
  const [total, setTotal] = useState(initialData?.total ?? 0);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const fetchAbortRef = useRef<AbortController | null>(null);

  const fetchRepos = useCallback(async (current: typeof filters) => {
    fetchAbortRef.current?.abort();
    const controller = new AbortController();
    fetchAbortRef.current = controller;
    setLoading(true);
    try {
      const res = await githubApi.list({
        page: current.page,
        pageSize: 12,
        tagId: current.tagId || undefined,
        language: current.language || undefined,
        keyword: current.keyword || undefined,
      });
      if (controller.signal.aborted) return;
      const data = res.data;
      setRepos(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      if ((err as { name?: string }).name === 'CanceledError') return;
      // eslint-disable-next-line no-console
      console.error('[repos] fetch error', err);
      toast.error('Khong tai duoc danh sach repo');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepos(filters);
  }, [filters, fetchRepos]);

  // Debounce keyword search.
  useEffect(() => {
    const id = setTimeout(() => {
      setFilters((prev) => (prev.keyword === searchInput ? prev : { ...prev, keyword: searchInput, page: 1 }));
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Client-side sort. The backend doesn't expose a sort param
  // today (filters via SQL already), so we sort the result set
  // in the browser. This is fine because pageSize is capped at
  // 12 — the work is trivial.
  const sortedRepos = useMemo(() => {
    const list = [...repos];
    switch (sort) {
      case 'newest':
        return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      case 'oldest':
        return list.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
      case 'most-stars':
        return list.sort((a, b) => b.stars - a.stars);
      case 'least-stars':
        return list.sort((a, b) => a.stars - b.stars);
      case 'name-asc':
        return list.sort((a, b) => a.repoName.localeCompare(b.repoName));
      case 'name-desc':
        return list.sort((a, b) => b.repoName.localeCompare(a.repoName));
      default:
        return list;
    }
  }, [repos, sort]);

  const activeFilterCount = (filters.tagId ? 1 : 0) + (filters.language ? 1 : 0) + (filters.keyword ? 1 : 0);

  const clearAll = () => {
    setSearchInput('');
    setFilters({ keyword: '', tagId: null, language: null, page: 1 });
  };

  return (
    <div className="relative min-h-screen bg-darkbg text-text-primary pt-24 pb-20">
      <ParticleBackground density="high" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <header className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-violet/30 bg-neon-violet/10 px-4 py-1.5 text-xs uppercase tracking-wider text-neon-violet"
          >
            <Sparkles className="h-3.5 w-3.5" />
            GitHub Repo Hub
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-3 font-heading text-4xl font-bold leading-tight md:text-5xl"
          >
            Kho repo <span className="bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-pink bg-clip-text text-transparent">duoc binh chon</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-text-secondary"
          >
            Tong hop nhung repo GitHub toi yeu thich, kem bai hoc va nhan xet cua ban than
            de giup ban quyet dinh co nen hoc theo repo do hay khong.
          </motion.p>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-text-muted"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkcard/40 px-3 py-1">
              <Github className="h-3 w-3" />
              <span className="font-mono font-semibold text-text-primary">{total}</span> repo
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkcard/40 px-3 py-1">
              <TagIcon className="h-3 w-3" />
              <span className="font-mono font-semibold text-text-primary">{tags.length}</span> tag
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkcard/40 px-3 py-1">
              <Code2 className="h-3 w-3" />
              <span className="font-mono font-semibold text-text-primary">{languages.length}</span> ngon ngu
            </span>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* ─── Sidebar / filters ────────────────────────────── */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-darkborder/50 bg-darkcard/60 p-5 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Filter className="h-4 w-4 text-neon-violet" />
                Bo loc
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="ml-auto inline-flex items-center gap-1 text-xs font-normal text-text-muted hover:text-text-primary"
                  >
                    <X className="h-3 w-3" />
                    Xoa tat ca
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tim theo ten hoac mo ta..."
                  className="w-full rounded-xl border border-darkborder bg-darkbg/60 py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none focus:ring-1 focus:ring-neon-violet/30"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted hover:text-text-primary"
                    aria-label="Xoa tim kiem"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Tags */}
            <FilterSection
              icon={<TagIcon className="h-4 w-4 text-neon-violet" />}
              title="Tags"
              empty={tags.length === 0}
            >
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => {
                  const active = filters.tagId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setFilters((p) => ({ ...p, tagId: active ? null : t.id, page: 1 }))}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all ${
                        active
                          ? 'border-neon-violet bg-neon-violet/20 text-text-primary shadow-[0_0_12px_rgba(167,139,250,0.25)]'
                          : 'border-darkborder bg-darkbg/40 text-text-secondary hover:border-neon-violet/40 hover:text-text-primary'
                      }`}
                    >
                      {t.name}
                      <span className={`text-[10px] ${active ? 'text-text-primary/70' : 'text-text-muted'}`}>
                        {t.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            {/* Languages */}
            <FilterSection
              icon={<Code2 className="h-4 w-4 text-neon-indigo" />}
              title="Ngon ngu"
              empty={languages.length === 0}
            >
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => {
                  const active = filters.language === l.name;
                  return (
                    <button
                      key={l.name}
                      onClick={() => setFilters((p) => ({ ...p, language: active ? null : l.name, page: 1 }))}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all ${
                        active
                          ? 'border-neon-indigo bg-neon-indigo/20 text-text-primary shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                          : 'border-darkborder bg-darkbg/40 text-text-secondary hover:border-neon-indigo/40 hover:text-text-primary'
                      }`}
                    >
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          active ? 'bg-neon-indigo' : 'bg-text-muted'
                        }`}
                      />
                      {l.name}
                      <span className="text-text-muted">{l.count}</span>
                    </button>
                  );
                })}
              </div>
            </FilterSection>
          </aside>

          {/* ─── Repo grid ──────────────────────────────────── */}
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-text-muted">
              <span>
                {loading
                  ? 'Dang tai...'
                  : total === 0
                  ? 'Chua co repo nao'
                  : `Hien thi ${repos.length} / ${total} repo`}
              </span>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="appearance-none rounded-lg border border-darkborder bg-darkcard/60 py-1.5 pl-3 pr-8 text-xs text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-text-primary focus:border-neon-violet/50 focus:outline-none"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ArrowDownAZ className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                </div>

                <button
                  onClick={() => fetchRepos(filters)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-darkborder bg-darkcard/60 px-3 py-1.5 text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-text-primary"
                  title="Tai lai"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Tai lai
                </button>
              </div>
            </div>

            {repos.length === 0 && !loading ? (
              <EmptyState onClear={clearAll} hasFilters={activeFilterCount > 0} />
            ) : (
              <motion.ul
                layout
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >
                <AnimatePresence mode="popLayout">
                  {sortedRepos.map((repo) => (
                    <motion.li
                      key={repo.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RepoCard repo={repo} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
                <PageButton
                  disabled={filters.page <= 1 || loading}
                  onClick={() => setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Truoc
                </PageButton>
                <span className="rounded-lg border border-darkborder bg-darkcard/60 px-3 py-1.5 text-xs text-text-secondary">
                  Trang {filters.page} / {totalPages}
                </span>
                <PageButton
                  disabled={filters.page >= totalPages || loading}
                  onClick={() => setFilters((p) => ({ ...p, page: Math.min(totalPages, p.page + 1) }))}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </PageButton>
              </nav>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

interface FilterSectionProps {
  icon: React.ReactNode;
  title: string;
  empty: boolean;
  children: React.ReactNode;
}

function FilterSection({ icon, title, empty, children }: FilterSectionProps) {
  return (
    <div className="rounded-2xl border border-darkborder/50 bg-darkcard/60 p-5 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
        {icon}
        {title}
      </div>
      {empty ? (
        <p className="text-xs text-text-muted">Chua co du lieu.</p>
      ) : (
        children
      )}
    </div>
  );
}

interface PageButtonProps {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function PageButton({ disabled, onClick, children }: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-lg border border-darkborder bg-darkcard/60 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-darkborder"
    >
      {children}
    </button>
  );
}

function EmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <div className="rounded-2xl border border-darkborder/50 bg-darkcard/40 p-10 text-center backdrop-blur-xl">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-darkborder bg-darkcard/60">
        {hasFilters ? <Filter className="h-8 w-8 text-text-muted" /> : <Github className="h-8 w-8 text-text-muted" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text-primary">
        {hasFilters ? 'Khong co repo phu hop voi bo loc' : 'Kho repo dang duoc cap nhat'}
      </h3>
      <p className="mx-auto max-w-md text-sm text-text-secondary">
        {hasFilters
          ? 'Thu xoa bo loc hoac tu khoa khac de xem them repo.'
          : 'Hay quay lai sau, kho repo dang duoc cap nhat.'}
      </p>
      {hasFilters ? (
        <button
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-neon-violet/40 bg-neon-violet/10 px-4 py-2 text-sm font-medium text-neon-violet transition-colors hover:bg-neon-violet/20"
        >
          <X className="h-4 w-4" />
          Xoa bo loc
        </button>
      ) : (
        <a
          href="https://github.com/cuonghoang1103?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-neon-violet/40 bg-neon-violet/10 px-4 py-2 text-sm font-medium text-neon-violet transition-colors hover:bg-neon-violet/20"
        >
          <Flame className="h-4 w-4" />
          Xem GitHub cua toi
        </a>
      )}
    </div>
  );
}

interface RepoCardProps {
  repo: GithubRepo;
}

function RepoCard({ repo }: RepoCardProps) {
  return (
    <Link
      href={`/repos/${repo.id}`}
      className="group block h-full"
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-darkborder/50 bg-darkcard/60 p-5 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-neon-violet/40 group-hover:shadow-[0_8px_40px_-12px_rgba(167,139,250,0.4)]">
        {/* Top row: stars + language */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="group/link flex min-w-0 flex-1 items-center gap-2">
            <Github className="h-5 w-5 shrink-0 text-text-secondary group-hover:text-text-primary" />
            <h3 className="truncate font-heading text-base font-bold text-text-primary group-hover:text-neon-violet">
              {repo.repoName}
            </h3>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${languageBadgeClasses(repo.language)}`}
          >
            {repo.language || 'N/A'}
          </span>
        </div>

        {/* Owner + stars + date */}
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
          <span className="truncate">@{repo.owner}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1 text-yellow-400">
            <Star className="h-3.5 w-3.5 fill-yellow-400" />
            <span className="font-mono font-semibold">{formatStars(repo.stars)}</span>
          </span>
          {repo.createdAt && (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(repo.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </>
          )}
        </div>

        {/* Description (GitHub's own) */}
        {repo.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-secondary">
            {repo.description}
          </p>
        )}

        {/* myReview panel — flex-grow so the footer sticks to the bottom of the card */}
        {repo.myReview && (
          <div className="relative mb-4 flex-grow overflow-hidden rounded-xl border border-neon-violet/20 bg-gradient-to-br from-neon-violet/[0.04] to-neon-indigo/[0.04] p-4">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-neon-violet">
              <Sparkles className="h-3 w-3" />
              Bai hoc &amp; danh gia
            </div>
            <div
              className="rich-content line-clamp-3 text-sm leading-relaxed text-text-secondary"
              dangerouslySetInnerHTML={{ __html: renderReview(repo.myReview) }}
            />
          </div>
        )}

        {/* Tags */}
        {repo.tags && repo.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {repo.tags.slice(0, 4).map((t) => (
              <span
                key={t.id}
                className="rounded-full border border-darkborder bg-darkbg/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-muted"
              >
                #{t.name}
              </span>
            ))}
            {repo.tags.length > 4 && (
              <span className="rounded-full border border-darkborder bg-darkbg/60 px-2 py-0.5 text-[10px] text-text-muted">
                +{repo.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer: "Xem chi tiet" hint + external link */}
        <div className="mt-auto flex items-center justify-between border-t border-white/[0.04] pt-3 text-xs">
          <span className="inline-flex items-center gap-1 text-text-muted transition-colors group-hover:text-neon-violet">
            Xem chi tiet
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(repo.url, '_blank', 'noopener,noreferrer');
            }}
            role="button"
            tabIndex={-1}
            className="inline-flex items-center gap-1 text-text-muted transition-colors hover:text-text-primary"
            title="Mo tren GitHub"
          >
            <ExternalLink className="h-3 w-3" />
            GitHub
          </span>
        </div>

        {/* Hover ring */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-neon-violet/0 transition-all duration-300 group-hover:ring-neon-violet/30" />
      </article>
    </Link>
  );
}
