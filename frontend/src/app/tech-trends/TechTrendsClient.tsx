'use client';

import { useState, useMemo, useEffect, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { Bookmark, Share2, Clock, TrendingUp, Search, Sparkles, Code2, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { techTrendsApi } from '@/lib/api';
import {
  CATEGORY_TABS,
  QUICK_TIPS,
  CATEGORY_DEFAULT_EMOJI,
  type Article,
  type Category,
  type TrendingTag,
  type TopAuthor,
  type CodeBlock,
} from './types';

/**
 * Tech Trends & Insights — public page
 *
 * Data source: `techTrendsApi.list()` (read-only, no auth).
 * The page hydrates once on mount and does all subsequent
 * filtering / searching client-side. With the current page
 * size cap of 100 this is fine; if the dataset ever crosses
 * ~500 articles we should switch to server-side paging.
 *
 * Layout: bento grid (main, 70%) + sticky sidebar (30%).
 * Featured articles span 2 columns; normal articles span 1.
 *
 * SSR safety: bookmark state reads from localStorage only
 * after useEffect fires, so the server and the first client
 * render agree (no hydration mismatch).
 */
export default function TechTrendsClient() {
  const [category, setCategory] = useState<'All' | Category>('All');
  const [query, setQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Data: articles from the backend. The hook returns the
  // raw PublicTechTrendArticle (id is number, not string),
  // which is what the rest of the page wants.
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Hydration guard. Also seed the search box from `?q=` so tag
  // links coming from an article detail page (/tech-trends?q=React)
  // land pre-filtered.
  useEffect(() => {
    setMounted(true);
    try {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) setQuery(q);
    } catch {
      /* no window / bad URL — ignore */
    }
  }, []);

  // Initial load + bookmark hydration
  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await techTrendsApi.list({ size: 100 });
        if (cancelled) return;
        // The public serializer is already in the right
        // shape — we just narrow the type for the rest
        // of the page.
        setArticles(res.data.data as unknown as Article[]);
        setLoadError(null);
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Failed to load articles';
        setLoadError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    // Hydrate bookmarks from localStorage
    try {
      const raw = localStorage.getItem('tech-trends:bookmarks');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          setBookmarks(new Set(arr.filter((x) => Number.isFinite(x))));
        }
      }
    } catch {
      // localStorage may be unavailable — fall back to
      // the in-memory Set.
    }
    return () => { cancelled = true; };
  }, [mounted]);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('tech-trends:bookmarks', JSON.stringify([...next]));
      } catch {
        // localStorage may be unavailable (private mode /
        // sandbox) — keep the in-memory Set as the source
        // of truth for this session.
      }
      return next;
    });
  }, []);

  // Filter + search (client-side, against the loaded set)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (category !== 'All' && a.category !== category) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [articles, category, query]);

  // Sidebar data — computed from the full article set, not
  // the filtered slice, so the sidebar stays stable as the
  // user types in the search box.
  const trendingTags = useMemo<TrendingTag[]>(() => {
    const tagScores = new Map<string, number>();
    for (const a of articles) {
      for (const t of a.tags) {
        tagScores.set(t, (tagScores.get(t) ?? 0) + (a.trendingScore || 1));
      }
    }
    return [...tagScores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, score]) => ({ tag, score }));
  }, [articles]);

  const topAuthors = useMemo<TopAuthor[]>(() => {
    const authorScores = new Map<number, number>();
    for (const a of articles) {
      if (!a.author) continue;
      authorScores.set(a.author.id, (authorScores.get(a.author.id) ?? 0) + (a.trendingScore || 1));
    }
    return [...authorScores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, score]) => {
        const author = articles.find((x) => x.author?.id === id)?.author;
        // author is guaranteed non-null here because we
        // only built the map from articles with an author.
        return { author: author as Required<NonNullable<Article['author']>>, score };
      })
      .filter((x): x is TopAuthor => Boolean(x.author));
  }, [articles]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-darkbg" style={{ background: '#0a0a0f' }}>
      {/* Decorative background — soft glow blobs to add depth
          without competing with the content. */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-neon-indigo/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-neon-fuchsia/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-neon-cyan/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ────────────────────────────────────── */}
        <header className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.94, 0.6, 1] }}
            className="flex items-center gap-2 text-xs text-neon-violet font-medium mb-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated by humans, scored by community</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.32, 0.94, 0.6, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-text-primary tracking-tight leading-[1.1]"
          >
            Tech Trends{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-fuchsia">
              &amp; Insights
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.32, 0.94, 0.6, 1] }}
            className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed"
          >
            Long-form bug post-mortems, interview prep, architecture deep-dives, and the
            news that actually matters — picked weekly, no clickbait.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.32, 0.94, 0.6, 1] }}
            className="mt-8 relative max-w-xl"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, tag, or keyword..."
              className="w-full pl-11 pr-4 py-3.5 bg-darkcard/80 backdrop-blur-sm
                border border-darkborder rounded-2xl text-sm text-text-primary
                placeholder:text-text-muted
                focus:outline-none focus:border-neon-violet/50 focus:ring-2 focus:ring-neon-violet/20
                transition-all duration-200"
            />
          </motion.div>

          {/* Tab bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.32, 0.94, 0.6, 1] }}
            className="mt-6 flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label="Category filter"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = category === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategory(tab.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={[
                    'relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium',
                    'transition-all duration-200 active:scale-95',
                    isActive
                      ? 'text-white shadow-neon'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tab-pill"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.accent}`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>{tab.emoji}</span>
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}

            <div className="ml-auto text-xs text-text-muted">
              <span className="text-text-secondary font-medium">{filtered.length}</span>
              {' '}of {articles.length} posts
            </div>
          </motion.div>
        </header>

        {/* ── Main grid + sidebar ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Main column (70% on desktop) */}
          <main className="lg:col-span-7">
            {loading ? (
              <LoadingState />
            ) : loadError ? (
              <ErrorState message={loadError} />
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <EmptyState
                    key="empty"
                    query={query}
                    category={category}
                    onReset={() => { setQuery(''); setCategory('All'); }}
                  />
                ) : (
                  <motion.div
                    key="grid"
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {filtered.map((article, idx) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        index={idx}
                        bookmarked={mounted && bookmarks.has(article.id)}
                        onToggleBookmark={() => toggleBookmark(article.id)}
                        isExpanded={expandedId === article.id}
                        onToggleExpand={() =>
                          setExpandedId((cur) => (cur === article.id ? null : article.id))
                        }
                        onSelectTag={(t) => setQuery(t)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </main>

          {/* Sidebar (30% on desktop, hidden on mobile/tablet) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-5">
              <TrendingTagsCard tags={trendingTags} onSelect={(t) => setQuery(t)} />
              <QuickTipsCard tips={QUICK_TIPS} />
              <TopAuthorsCard items={topAuthors} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ── Article Card ─────────────────────────────────────────────────

const CATEGORY_STYLES: Record<Category, { bg: string; text: string; border: string; emoji: string }> = {
  TechNews:   { bg: 'bg-neon-emerald/10',  text: 'text-neon-emerald',  border: 'border-neon-emerald/20',  emoji: '📰' },
  FixBug:     { bg: 'bg-neon-red/10',       text: 'text-neon-red',       border: 'border-neon-red/20',       emoji: '🐛' },
  Experience: { bg: 'bg-neon-cyan/10',      text: 'text-neon-cyan',      border: 'border-neon-cyan/20',      emoji: '💼' },
  Interviews: { bg: 'bg-neon-fuchsia/10',   text: 'text-neon-fuchsia',   border: 'border-neon-fuchsia/20',   emoji: '🎯' },
};

// Runtime fallback: the backend could return a category not in the `Category`
// union (e.g. a newly added one). Without this, `style.bg`/`style.emoji` below
// would throw and crash the whole grid. TS thinks the lookup is always defined,
// so we coerce through `?? DEFAULT_CATEGORY_STYLE`.
const DEFAULT_CATEGORY_STYLE = { bg: 'bg-neon-violet/10', text: 'text-neon-violet', border: 'border-neon-violet/20', emoji: '🏷️' };

const FALLBACK_GRADIENTS = [
  'from-neon-indigo to-neon-violet',
  'from-neon-cyan to-neon-blue',
  'from-neon-fuchsia to-neon-pink',
  'from-neon-emerald to-neon-green',
  'from-neon-orange to-neon-red',
];

function pickGradient(id: number) {
  return FALLBACK_GRADIENTS[id % FALLBACK_GRADIENTS.length];
}

function authorInitials(name: string | null | undefined): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function authorDisplayName(author: Article['author']): string {
  if (!author) return 'Anonymous';
  return author.displayName || author.fullName || author.username || 'Anonymous';
}

function ArticleCard({
  article,
  index,
  bookmarked,
  onToggleBookmark,
  isExpanded,
  onToggleExpand,
  onSelectTag,
}: {
  article: Article;
  index: number;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelectTag: (tag: string) => void;
}) {
  const style = CATEGORY_STYLES[article.category] ?? DEFAULT_CATEGORY_STYLE;
  const spanClass = article.isFeatured ? 'md:col-span-2' : 'md:col-span-1';
  const displayCover = article.coverEmoji || CATEGORY_DEFAULT_EMOJI[article.category] || DEFAULT_CATEGORY_STYLE.emoji;
  const permalink = `/tech-trends/${article.slug}`;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? `${window.location.origin}${permalink}` : permalink;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.summary, url });
        return;
      } catch {
        /* cancelled → fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Đã sao chép link bài viết');
    } catch {
      toast.error('Không thể sao chép link');
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2), ease: [0.32, 0.94, 0.6, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: [0.32, 0.94, 0.6, 1] } }}
      className={`group relative ${spanClass}`}
    >
      <div
        className={[
          'relative h-full overflow-hidden rounded-2xl',
          'bg-gradient-to-b from-darksurface/80 to-darkcard/80',
          'backdrop-blur-sm border border-darkborder',
          'transition-all duration-300',
          'hover:border-neon-violet/40',
          'hover:shadow-[0_8px_32px_-8px_rgba(139,92,246,0.4)]',
        ].join(' ')}
      >
        {/* Cover — either a real image (if coverImageUrl
            is set) or the gradient + emoji fallback. */}
        <div
          className={[
            'relative w-full overflow-hidden bg-darkcard',
            article.isFeatured ? 'aspect-[2.4/1]' : 'aspect-[2/1]',
          ].join(' ')}
        >
          {article.coverImageUrl ? (
            <>
              <img
                src={article.coverImageUrl}
                alt={article.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-darkcard via-darkcard/40 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-darksurface via-darkcard to-darksurface" />
              <div className="absolute inset-0 bg-gradient-to-br from-neon-indigo/10 via-transparent to-neon-fuchsia/10" />
              <div className="absolute inset-0 flex items-center justify-center text-7xl sm:text-8xl select-none">
                <span className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {displayCover}
                </span>
              </div>
            </>
          )}

          {/* Category pill on cover */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={[
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                'border backdrop-blur-md',
                style.bg, style.text, style.border,
              ].join(' ')}
            >
              <span>{style.emoji}</span>
              <span>#{article.category}</span>
            </span>
            {article.trendingScore >= 90 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neon-orange/10 text-neon-orange border border-neon-orange/20 backdrop-blur-md">
                <TrendingUp className="w-3 h-3" />
                <span>Hot</span>
              </span>
            )}
          </div>

          {/* Bookmark button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
            className={[
              'absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md',
              'border transition-all duration-200 active:scale-90',
              bookmarked
                ? 'bg-neon-violet/20 text-neon-violet border-neon-violet/30'
                : 'bg-black/30 text-white border-white/10 hover:bg-black/50',
            ].join(' ')}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark className={['w-4 h-4', bookmarked ? 'fill-current' : ''].join(' ')} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className={[
            'font-heading font-semibold text-text-primary tracking-tight',
            'leading-relaxed',
            article.isFeatured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl',
          ].join(' ')}>
            <Link
              href={permalink}
              className="hover:text-neon-violet transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {article.title}
            </Link>
          </h2>

          <p className="text-text-secondary leading-relaxed text-sm sm:text-[0.95rem]">
            {article.summary}
          </p>

          {/* Code block — only for FixBug cards */}
          {article.codeBlock && (
            <CodeComparison
              before={article.codeBlock.before}
              after={article.codeBlock.after}
              takeaway={article.codeBlock.takeaway}
            />
          )}

          {/* Expanded body — Tier 1A. Prefer the server-rendered
              bodyHtml (rich TipTap output); fall back to the
              legacy paragraph array for articles written
              before the migration. The CSS class
              `.tech-prose` (in globals.css) styles headings,
              lists, blockquote, code, images, links — the same
              typography as the admin editor so what you write
              is what readers see. */}
          <AnimatePresence>
            {isExpanded && (article.bodyHtml || article.body.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.32, 0.94, 0.6, 1] }}
                className="overflow-hidden"
              >
                {article.bodyHtml ? (
                  <div
                    className="tech-prose pt-3 border-t border-darkborder"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.bodyHtml) }}
                  />
                ) : (
                  <div className="pt-2 space-y-3 text-text-secondary text-sm leading-relaxed border-t border-darkborder">
                    {article.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium
                    bg-white/[0.04] text-text-muted border border-white/[0.04]
                    hover:text-text-primary hover:border-neon-violet/30 transition-colors cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); onSelectTag(t); }}
                >
                  #{t}
                </button>
              ))}
            </div>
          )}

          {/* Meta + actions */}
          <div className="flex items-center justify-between pt-3 border-t border-darkborder">
            <div className="flex items-center gap-2.5 min-w-0">
              {article.author?.avatarUrl ? (
                <img
                  src={article.author.avatarUrl}
                  alt={authorDisplayName(article.author)}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white',
                    'bg-gradient-to-br shrink-0',
                    pickGradient(article.author?.id ?? article.id),
                  ].join(' ')}
                >
                  {authorInitials(authorDisplayName(article.author))}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">
                  {authorDisplayName(article.author)}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                  <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                  <span>·</span>
                  <Clock className="w-3 h-3" />
                  <span>{article.readTimeMin} min read</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium
                  bg-white/[0.04] text-text-secondary
                  hover:bg-neon-violet/15 hover:text-neon-violet
                  transition-colors active:scale-95"
              >
                {isExpanded ? 'Hide' : 'Read'}
              </button>
              <Link
                href={permalink}
                onClick={(e) => e.stopPropagation()}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium
                  bg-white/[0.04] text-text-secondary
                  hover:bg-neon-violet/15 hover:text-neon-violet
                  transition-colors active:scale-95"
              >
                Mở
              </Link>
              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary
                  hover:bg-white/[0.04] transition-colors active:scale-95"
                aria-label="Chia sẻ"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ── Code Comparison (Error vs Solution) ───────────────────────────

function CodeComparison({ before, after, takeaway }: {
  before: CodeBlock;
  after: CodeBlock;
  takeaway: string;
}) {
  return (
    <div className="rounded-xl border border-darkborder overflow-hidden bg-[#0a0c14]">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-darkborder">
        {/* Before — error */}
        <div>
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-darkborder bg-red-500/5">
            <AlertTriangle className="w-3.5 h-3.5 text-neon-red" />
            <span className="text-[11px] font-semibold text-neon-red uppercase tracking-wider">
              Before · Error
            </span>
            <span className="ml-auto text-[10px] font-mono text-text-muted">
              {before.lang}
            </span>
          </div>
          <pre className="p-3 text-[11px] sm:text-xs font-mono text-text-secondary leading-relaxed overflow-x-auto">
            <code>{before.lines.join('\n')}</code>
          </pre>
        </div>

        {/* After — solution */}
        <div>
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-darkborder bg-emerald-500/5">
            <CheckCircle2 className="w-3.5 h-3.5 text-neon-emerald" />
            <span className="text-[11px] font-semibold text-neon-emerald uppercase tracking-wider">
              After · Solution
            </span>
            <span className="ml-auto text-[10px] font-mono text-text-muted">
              {after.lang}
            </span>
          </div>
          <pre className="p-3 text-[11px] sm:text-xs font-mono text-text-secondary leading-relaxed overflow-x-auto">
            <code>{after.lines.join('\n')}</code>
          </pre>
        </div>
      </div>

      {/* Takeaway strip */}
      <div className="flex items-start gap-2 px-3 py-2.5 bg-neon-violet/5 border-t border-darkborder">
        <Code2 className="w-3.5 h-3.5 text-neon-violet mt-0.5 shrink-0" />
        <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">
          <span className="font-semibold text-text-primary">Takeaway:</span> {takeaway}
        </p>
      </div>
    </div>
  );
}

// ── Sidebar widgets ──────────────────────────────────────────────

function TrendingTagsCard({ tags, onSelect }: { tags: TrendingTag[]; onSelect: (t: string) => void }) {
  if (tags.length === 0) return null;
  return (
    <Widget title="Trending Tags" icon={<TrendingUp className="w-4 h-4" />}>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(({ tag, score }, i) => (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className={[
              'group relative inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs',
              'border transition-all duration-200 active:scale-95',
              i < 3
                ? 'bg-neon-violet/10 text-neon-violet border-neon-violet/20 hover:bg-neon-violet/15'
                : 'bg-white/[0.04] text-text-secondary border-white/[0.04] hover:text-text-primary hover:border-neon-violet/30',
            ].join(' ')}
          >
            <span className="font-medium">#{tag}</span>
            <span className="text-[9px] text-text-muted tabular-nums">{score}</span>
          </button>
        ))}
      </div>
    </Widget>
  );
}

function QuickTipsCard({ tips }: { tips: typeof QUICK_TIPS }) {
  return (
    <Widget title="Quick Coding Tips" icon={<Sparkles className="w-4 h-4" />}>
      <ol className="space-y-3">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-neon-violet/15 text-neon-violet text-[11px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary leading-snug">{tip.title}</p>
              <p className="text-[11px] text-text-muted leading-relaxed mt-0.5">{tip.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Widget>
  );
}

function TopAuthorsCard({ items }: { items: TopAuthor[] }) {
  if (items.length === 0) return null;
  return (
    <Widget title="Top Authors" icon={<Sparkles className="w-4 h-4" />}>
      <ul className="space-y-3">
        {items.map(({ author, score }, i) => (
          <li key={author.id} className="flex items-start gap-3">
            <span className="shrink-0 text-[10px] font-bold text-text-muted w-3 mt-2.5 tabular-nums">
              {i + 1}
            </span>
            {author.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={authorDisplayName(author)}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className={[
                'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0',
                'bg-gradient-to-br', pickGradient(author.id),
              ].join(' ')}>
                {authorInitials(authorDisplayName(author))}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {authorDisplayName(author)}
                </p>
                <span className="text-[9px] text-text-muted tabular-nums shrink-0">{score} pts</span>
              </div>
              <p className="text-[10px] text-text-muted truncate">@{author.username}</p>
              {author.bio && (
                <p className="text-[11px] text-text-secondary leading-relaxed mt-1 line-clamp-2">
                  {author.bio}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Widget>
  );
}

function Widget({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-darkcard/60 backdrop-blur-sm border border-darkborder p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-neon-violet">{icon}</span>
        <h3 className="text-sm font-heading font-semibold text-text-primary">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── States ─────────────────────────────────────────────────

function LoadingState() {
  // Skeleton grid mirroring the 2-col ArticleCard layout — no bare spinner,
  // so the page reads as "content arriving" (FB-style perceived speed).
  return (
    <div
      className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-5"
      role="status"
      aria-busy="true"
      aria-label="Đang tải bài viết"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border border-darkborder bg-darkcard/60 backdrop-blur-sm"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <Skeleton className="h-40 w-full" />
          <div className="p-5 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" rounded="rounded-full" />
              <Skeleton className="h-5 w-20" rounded="rounded-full" />
            </div>
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-6 w-6" rounded="rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="col-span-full rounded-2xl bg-darkcard/60 backdrop-blur-sm border border-darkborder p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
        Couldn’t load articles
      </h3>
      <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      <p className="text-xs text-text-muted mt-3">
        Check that the backend is running and the <code className="text-text-secondary">tech_trend_articles</code> table has been migrated.
      </p>
    </div>
  );
}

function EmptyState({ query, category, onReset }: { query: string; category: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="col-span-full rounded-2xl bg-darkcard/60 backdrop-blur-sm border border-darkborder p-12 text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neon-violet/10 flex items-center justify-center">
        <Search className="w-7 h-7 text-neon-violet" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
        No posts found
      </h3>
      <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
        {query
          ? <>Nothing matches <span className="text-text-primary font-medium">“{query}”</span> in <span className="text-text-primary font-medium">#{category}</span>.</>
          : <>No posts in <span className="text-text-primary font-medium">#{category}</span> yet.</>}
      </p>
      <button
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
          bg-white/[0.04] border border-darkborder text-sm text-text-secondary
          hover:text-text-primary hover:border-neon-violet/30 transition-all active:scale-95"
      >
        <X className="w-3.5 h-3.5" />
        Clear filters
      </button>
    </motion.div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch {
    return iso;
  }
}
