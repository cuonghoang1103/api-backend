'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  Search, Star, ExternalLink, Github, Filter, X, Sparkles,
  Tag as TagIcon, Code2, ChevronLeft, ChevronRight, RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { githubApi, GithubRepo, GithubRepoTag, GithubRepoListResponse } from '@/lib/api';
import ParticleBackground from '@/components/repos/ParticleBackground';

// Tiny inline markdown renderer. We support the subset the
// admin review is likely to use: bold, italic, inline code,
// links, line breaks, and bulleted lists. We deliberately
// don't pull in a full markdown lib to keep the bundle small.
function renderInlineMarkdown(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-darkbg/70 text-neon-violet text-[0.85em]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-text-primary">$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(
      /\[([^\]]+)\]\((https?:[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-neon-indigo hover:text-neon-violet underline underline-offset-2">$1</a>',
    );
}

function renderReview(review: string): string {
  if (!review) return '';
  const lines = review.split('\n');
  const out: string[] = [];
  let inList = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('- ')) {
      if (!inList) {
        out.push('<ul class="list-disc list-inside space-y-1.5 my-3">');
        inList = true;
      }
      out.push(`<li>${renderInlineMarkdown(line.slice(2))}</li>`);
    } else {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      if (line === '') {
        out.push('<br/>');
      } else {
        out.push(`<p class="my-2 leading-relaxed">${renderInlineMarkdown(line)}</p>`);
      }
    }
  }
  if (inList) out.push('</ul>');
  return out.join('');
}

// ─── Language → color map ─────────────────────────────────────────
//
// GitHub-style language colors for the language badge. We only
// hardcode the common ones; anything else falls back to violet.
// Keeping this in one place makes the badge easy to tweak
// without hunting through the card.
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  JavaScript: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
  Python: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Go: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Rust: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Java: 'bg-red-500/20 text-red-300 border-red-500/30',
  Kotlin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Swift: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'C++': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  C: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'C#': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  PHP: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Ruby: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Shell: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
  HTML: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  CSS: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Dart: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Vue: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

function languageBadge(lang: string | null): string {
  if (!lang) return 'bg-darkcard text-text-muted border-darkborder';
  return (
    LANGUAGE_COLORS[lang] ||
    'bg-neon-violet/15 text-neon-violet border-neon-violet/30'
  );
}

// Format star counts. 1234 → "1.2k", 1500000 → "1.5M".
function formatStars(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

// ─── Filter state ─────────────────────────────────────────────────
//
// All filter state is held in a single object. URL state would
// be nicer for shareable links, but for v1 we keep it in-memory
// to avoid hydration mismatch on the SSR-rendered initial page.
interface Filters {
  keyword: string;
  tagId: number | null;
  language: string | null;
  page: number;
}

interface ReposFeedClientProps {
  initialData: GithubRepoListResponse | null;
  initialTags: GithubRepoTag[];
  initialLanguages: { name: string; count: number }[];
}

export default function ReposFeedClient({
  initialData,
  initialTags,
  initialLanguages,
}: ReposFeedClientProps) {
  const [repos, setRepos] = useState<GithubRepo[]>(initialData?.items ?? []);
  const [tags, setTags] = useState<GithubRepoTag[]>(initialTags);
  const [languages, setLanguages] = useState<{ name: string; count: number }[]>(initialLanguages);
  const [filters, setFilters] = useState<Filters>({
    keyword: '',
    tagId: null,
    language: null,
    page: 1,
  });
  const [total, setTotal] = useState(initialData?.total ?? 0);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // AbortController to cancel stale fetches when filters change.
  const fetchAbortRef = useRef<AbortController | null>(null);

  const fetchRepos = useCallback(async (current: Filters) => {
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
      setLoading(false);
    }
  }, []);

  // Refetch on filter change (except `searchInput` which is
  // debounced separately below).
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
                      className={`rounded-full border px-3 py-1 text-xs transition-all ${
                        active
                          ? 'border-neon-violet bg-neon-violet/20 text-text-primary shadow-[0_0_12px_rgba(167,139,250,0.25)]'
                          : 'border-darkborder bg-darkbg/40 text-text-secondary hover:border-neon-violet/40 hover:text-text-primary'
                      }`}
                    >
                      {t.name}
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
            <div className="mb-4 flex items-center justify-between text-sm text-text-muted">
              <span>
                {loading
                  ? 'Dang tai...'
                  : total === 0
                  ? 'Chua co repo nao'
                  : `Hien thi ${repos.length} / ${total} repo`}
              </span>
              <button
                onClick={() => fetchRepos(filters)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-darkborder bg-darkcard/60 px-3 py-1.5 text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-text-primary"
                title="Tai lai"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                Tai lai
              </button>
            </div>

            {repos.length === 0 && !loading ? (
              <EmptyState onClear={clearAll} hasFilters={activeFilterCount > 0} />
            ) : (
              <motion.ul
                layout
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >
                <AnimatePresence mode="popLayout">
                  {repos.map((repo) => (
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
      <Github className="mx-auto mb-4 h-12 w-12 text-text-muted" />
      <h3 className="mb-2 text-lg font-semibold text-text-primary">Chua co repo phu hop</h3>
      <p className="mx-auto max-w-md text-sm text-text-secondary">
        {hasFilters
          ? 'Thu xoa bo loc hoac tu khoa khac de xem them repo.'
          : 'Hay quay lai sau, kho repo dang duoc cap nhat.'}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-neon-violet/40 bg-neon-violet/10 px-4 py-2 text-sm font-medium text-neon-violet transition-colors hover:bg-neon-violet/20"
        >
          <X className="h-4 w-4" />
          Xoa bo loc
        </button>
      )}
    </div>
  );
}

interface RepoCardProps {
  repo: GithubRepo;
}

function RepoCard({ repo }: RepoCardProps) {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-darkborder/50 bg-darkcard/60 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-neon-violet/40 hover:shadow-[0_8px_40px_-12px_rgba(167,139,250,0.4)]">
      {/* Top row: stars + language */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link flex min-w-0 flex-1 items-center gap-2"
        >
          <Github className="h-5 w-5 shrink-0 text-text-secondary group-hover/link:text-text-primary" />
          <h3 className="truncate font-heading text-base font-bold text-text-primary group-hover/link:text-neon-violet">
            {repo.repoName}
          </h3>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-text-muted opacity-0 transition-opacity group-hover/link:opacity-100" />
        </a>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${languageBadge(repo.language)}`}
        >
          {repo.language || 'N/A'}
        </span>
      </div>

      {/* Owner + stars */}
      <div className="mb-3 flex items-center gap-3 text-xs text-text-muted">
        <span className="truncate">@{repo.owner}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1 text-yellow-400">
          <Star className="h-3.5 w-3.5 fill-yellow-400" />
          <span className="font-mono font-semibold">{formatStars(repo.stars)}</span>
        </span>
      </div>

      {/* Description (GitHub's own) */}
      {repo.description && (
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-secondary">
          {repo.description}
        </p>
      )}

      {/* myReview panel */}
      {repo.myReview && (
        <div className="relative mb-4 overflow-hidden rounded-xl border border-neon-violet/20 bg-gradient-to-br from-neon-violet/[0.04] to-neon-indigo/[0.04] p-4">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-neon-violet">
            <Sparkles className="h-3 w-3" />
            Bai hoc &amp; danh gia
          </div>
          <div
            className="rich-content text-sm leading-relaxed text-text-secondary"
            dangerouslySetInnerHTML={{ __html: renderReview(repo.myReview) }}
          />
        </div>
      )}

      {/* Tags */}
      {repo.tags && repo.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.tags.map((t) => (
            <span
              key={t.id}
              className="rounded-full border border-darkborder bg-darkbg/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-muted"
            >
              #{t.name}
            </span>
          ))}
        </div>
      )}

      {/* Hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-neon-violet/0 transition-all duration-300 group-hover:ring-neon-violet/30" />
    </article>
  );
}
