'use client';

import { useState, useMemo, useEffect, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { Bookmark, Share2, Clock, TrendingUp, Search, Sparkles, Code2, AlertTriangle, CheckCircle2, X, Download, MessageSquare, Archive, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { techTrendsApi, blogApi } from '@/lib/api';
import ParticleGridBackground from '@/components/blog/ParticleGridBackground';
import type { Post } from '@/types';
import {
  CATEGORY_TABS,
  QUICK_TIPS,
  CATEGORY_DEFAULT_EMOJI,
  CATEGORY_LABEL_VI,
  type Article,
  type Category,
  type TabId,
  type Resource,
  type FeedItem,
  type TrendingTag,
  type TopAuthor,
  type CodeBlock,
} from './types';

/**
 * Blog — the site's single writing surface (public page).
 *
 * ─── WHY ONE PAGE ──────────────────────────────────────────────
 * Until 2026-08-05 the site had TWO blogs: /blog (2 posts, both
 * announcements whose body was the literal string "FPTU") and
 * /tech-trends (28 real articles). Both sat in the nav, and the one
 * called "Blog" — the word readers actually look for — was the empty
 * one. They are merged here.
 *
 * Data sources, deliberately two:
 *   - `techTrendsApi.list()`  → hand-written articles + the AI news
 *                                bulletin (`tech_trend_articles`)
 *   - `blogApi.getPosts()`    → legacy source-code drops and course
 *                                announcements (`posts`), surfaced
 *                                under the "Source & Thông báo" tab
 *
 * Merging in the UI rather than migrating rows keeps the download
 * counter, the existing comment threads, and the admin CRUD for both
 * systems working untouched. The reader sees one blog either way.
 *
 * The page hydrates once on mount and does all subsequent filtering /
 * searching client-side. With the current page size cap of 100 this is
 * fine; past ~500 articles, switch to server-side paging.
 *
 * Layout: bento grid (main, 70%) + sticky sidebar (30%).
 * Featured articles span 2 columns; normal articles span 1.
 *
 * SSR safety: bookmark state reads from localStorage only
 * after useEffect fires, so the server and the first client
 * render agree (no hydration mismatch).
 */
export default function TechTrendsClient() {
  const [category, setCategory] = useState<TabId>('All');
  const [query, setQuery] = useState('');
  // Archive filter — null = every year. Set from the sidebar archive.
  const [year, setYear] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Data: articles from the backend. The hook returns the
  // raw PublicTechTrendArticle (id is number, not string),
  // which is what the rest of the page wants.
  const [articles, setArticles] = useState<Article[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
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
      // Two independent backends. `allSettled`, not `all`: the legacy
      // blog table is a side dish, and losing it must not blank out the
      // 28 articles that are the point of the page.
      setLoading(true);
      const [articlesRes, resourcesRes] = await Promise.allSettled([
        techTrendsApi.list({ size: 100 }),
        blogApi.getPosts({ page: 1, size: 50 }),
      ]);
      if (cancelled) return;

      if (articlesRes.status === 'fulfilled') {
        // The public serializer is already in the right
        // shape — we just narrow the type for the rest
        // of the page.
        setArticles(articlesRes.value.data.data as unknown as Article[]);
        setLoadError(null);
      } else {
        const err = articlesRes.reason;
        setLoadError(err instanceof Error ? err.message : 'Failed to load articles');
      }

      if (resourcesRes.status === 'fulfilled') {
        const rows = resourcesRes.value.data?.data;
        setResources(Array.isArray(rows) ? (rows as Post[]).map(toResource) : []);
      }

      setLoading(false);
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

  // One chronological feed out of the two tables. Built once per data
  // change so every downstream view (grid, counts, archive) agrees on
  // what "a post" is.
  const feed = useMemo<FeedItem[]>(() => {
    const items: FeedItem[] = [
      ...articles.map((a): FeedItem => ({
        type: 'article',
        date: a.publishedAt || a.createdAt,
        article: a,
      })),
      ...resources.map((r): FeedItem => ({
        type: 'resource',
        date: r.publishedAt || r.createdAt,
        resource: r,
      })),
    ];
    return items.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [articles, resources]);

  // Filter + search (client-side, against the loaded set)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return feed.filter((item) => {
      if (category !== 'All' && itemCategory(item) !== category) return false;
      if (year !== null && yearOf(item.date) !== year) return false;
      if (!q) return true;
      return itemHaystack(item).includes(q);
    });
  }, [feed, category, year, query]);

  // Per-tab counts. Shown on the tabs themselves so an empty category
  // is visible BEFORE the click, not after an empty state.
  const counts = useMemo(() => {
    const map = new Map<TabId, number>();
    for (const item of feed) {
      if (year !== null && yearOf(item.date) !== year) continue;
      map.set(itemCategory(item), (map.get(itemCategory(item)) ?? 0) + 1);
      map.set('All', (map.get('All') ?? 0) + 1);
    }
    return map;
  }, [feed, year]);

  // Archive by year, newest first — the one piece of furniture a blog
  // needs to stop looking like a 9-card grid and start looking like a
  // body of work.
  const archive = useMemo(() => {
    const byYear = new Map<number, number>();
    for (const item of feed) {
      const y = yearOf(item.date);
      if (y) byYear.set(y, (byYear.get(y) ?? 0) + 1);
    }
    return [...byYear.entries()].sort((a, b) => b[0] - a[0]);
  }, [feed]);

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
    // Resource tags (fptu, swp, kì5…) count too — they are the tags the
    // audience that actually shows up here searches for.
    for (const r of resources) {
      for (const t of r.tags) tagScores.set(t, (tagScores.get(t) ?? 0) + 1);
    }
    return [...tagScores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, score]) => ({ tag, score }));
  }, [articles, resources]);

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
      {/* Particle grid — carried over from the old /blog page, the one
          part of it worth keeping. Canvas-based and pointer-events-none,
          so it sits behind everything without touching interaction. */}
      <ParticleGridBackground />

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
            className="inline-flex items-center gap-2 rounded-full border border-neon-violet/25 bg-neon-violet/10 px-4 py-1.5 text-xs font-medium text-neon-violet mb-4"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-neon-violet animate-pulse" />
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nhật ký kỹ thuật · viết từ việc thật, không viết lại tài liệu</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.32, 0.94, 0.6, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-text-primary tracking-tight leading-[1.1]"
          >
            Blog{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-fuchsia">
              CuongThai
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.32, 0.94, 0.6, 1] }}
            className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed"
          >
            Sự cố production có thật, bài mổ lỗi, hướng dẫn chuyên sâu, kinh nghiệm ôn thi
            &amp; phỏng vấn — cùng source code và thông báo khoá học. Tất cả ở một chỗ.
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
              placeholder="Tìm theo tiêu đề, thẻ hoặc từ khoá..."
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
            aria-label="Lọc theo mục"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = category === tab.id;
              const n = counts.get(tab.id) ?? 0;
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
                      : n === 0
                        ? 'text-text-muted/60 hover:text-text-secondary'
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
                    {/* Count per tab: an empty category should be visible
                        before the click, not after an empty state. */}
                    <span
                      className={[
                        'ml-0.5 rounded-md px-1.5 py-px text-[10px] tabular-nums',
                        isActive ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-text-muted',
                      ].join(' ')}
                    >
                      {n}
                    </span>
                  </span>
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-2 text-xs text-text-muted">
              {year !== null && (
                <button
                  onClick={() => setYear(null)}
                  className="inline-flex items-center gap-1 rounded-lg border border-neon-violet/30 bg-neon-violet/10 px-2 py-1 text-neon-violet transition-colors hover:bg-neon-violet/20"
                >
                  Năm {year}
                  <X className="h-3 w-3" />
                </button>
              )}
              <span>
                <span className="text-text-secondary font-medium">{filtered.length}</span>
                {' '}/ {feed.length} bài
              </span>
            </div>
          </motion.div>
        </header>

        {/* ── Chuyên đề ghim: Lộ trình IELTS ─────────────────────── */}
        <Link
          href="/tech-trends/ielts"
          className="group block mb-4 rounded-2xl border border-sky-400/30 bg-gradient-to-r from-sky-400/[0.12] via-indigo-400/[0.06] to-transparent p-5 sm:p-6 hover:border-sky-400/50 transition-all"
        >
          <div className="flex items-start gap-4">
            <span className="hidden sm:flex w-12 h-12 shrink-0 rounded-xl bg-sky-400/15 items-center justify-center text-2xl">
              🎓
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-sky-500 text-white">
                  CHUYÊN ĐỀ
                </span>
                <span className="text-[11px] text-text-muted">4 chặng band · có mốc tự tick</span>
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-text-primary group-hover:text-sky-400 transition-colors">
                Lộ trình IELTS 0 → 7.5 — đủ 4 kỹ năng
              </h3>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                Mỗi chặng ghi rõ mỗi ngày làm gì cho Nghe, Đọc, Viết, Nói; mốc phải đạt để lên chặng
                sau; và những sai lầm hay mắc ở đúng chặng đó — phần khiến nhiều người kẹt hàng tháng.
              </p>
            </div>
            <span className="hidden sm:block text-sky-400 text-xl shrink-0 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        {/* ── Chuyên đề ghim: Tiếng Anh Giao Tiếp ──────────────────
            Cùng lý do với JPD113 bên dưới: trang tĩnh, không do API trả về,
            nên phải ghim tay ở sảnh mới tìm thấy được. */}
        <Link
          href="/tech-trends/tieng-anh-giao-tiep"
          className="group block mb-4 rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-400/[0.12] via-sky-400/[0.06] to-transparent p-5 sm:p-6 hover:border-emerald-400/50 transition-all"
        >
          <div className="flex items-start gap-4">
            <span className="hidden sm:flex w-12 h-12 shrink-0 rounded-xl bg-emerald-400/15 items-center justify-center text-2xl">
              🗣️
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-500 text-white">
                  CHUYÊN ĐỀ
                </span>
                <span className="text-[11px] text-text-muted">Khoá 20 ngày · có nút nghe từng câu</span>
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-text-primary group-hover:text-emerald-400 transition-colors">
                Tiếng Anh Giao Tiếp — 20 ngày từ câu chào tới kể chuyện
              </h3>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                Câu dùng hằng ngày trước (chào hỏi, hôm nay làm gì, ăn gì, hẹn giờ), rồi tới tiếng Anh
                công việc. Mỗi ngày có hỏi–đáp nhiều cách trả lời, hội thoại mẫu, từ vựng có phiên âm,
                ngữ pháp và một âm khó để luyện.
              </p>
            </div>
            <span className="hidden sm:block text-emerald-400 text-xl shrink-0 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        {/* ── Chuyên đề ghim: lộ trình ôn thi JPD113 ──────────────
            Trang tĩnh, không nằm trong danh sách bài viết từ API,
            nên ghim thẳng ở đây để tìm thấy được từ sảnh. */}
        <Link
          href="/tech-trends/on-thi-jpd113"
          className="group block mb-8 rounded-2xl border border-neon-violet/30 bg-gradient-to-r from-neon-violet/[0.12] via-neon-fuchsia/[0.06] to-transparent p-5 sm:p-6 hover:border-neon-violet/50 transition-all"
        >
          <div className="flex items-start gap-4">
            <span className="hidden sm:flex w-12 h-12 shrink-0 rounded-xl bg-neon-violet/15 items-center justify-center text-2xl">
              🇯🇵
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-neon-violet text-white">
                  CHUYÊN ĐỀ
                </span>
                <span className="text-[11px] text-text-muted">Lộ trình ôn thi có checklist</span>
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-text-primary group-hover:text-neon-violet transition-colors">
                Ôn thi JPD113 — lộ trình 5 ngày từ số 0
              </h3>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                Kana → số &amp; thời gian → trợ từ → kanji → thi nói. Kèm bảng tra cứu đầy đủ,
                ngân hàng 13 bài đọc + 22 câu hỏi vấn đáp, và 35 đề luyện có sẵn.
              </p>
            </div>
            <span className="hidden sm:block text-neon-violet text-xl shrink-0 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

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
                    onReset={() => { setQuery(''); setCategory('All'); setYear(null); }}
                  />
                ) : (
                  <motion.div
                    key="grid"
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {filtered.map((item, idx) =>
                      item.type === 'article' ? (
                        <ArticleCard
                          key={`a-${item.article.id}`}
                          article={item.article}
                          index={idx}
                          bookmarked={mounted && bookmarks.has(item.article.id)}
                          onToggleBookmark={() => toggleBookmark(item.article.id)}
                          isExpanded={expandedId === item.article.id}
                          onToggleExpand={() =>
                            setExpandedId((cur) => (cur === item.article.id ? null : item.article.id))
                          }
                          onSelectTag={(t) => setQuery(t)}
                        />
                      ) : (
                        <ResourceCard
                          key={`r-${item.resource.id}`}
                          resource={item.resource}
                          index={idx}
                          onSelectTag={(t) => setQuery(t)}
                        />
                      ),
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </main>

          {/* Sidebar (30% on desktop, hidden on mobile/tablet) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-5">
              <ArchiveCard
                items={archive}
                activeYear={year}
                onSelect={(y) => setYear((cur) => (cur === y ? null : y))}
              />
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
  DeepDive:   { bg: 'bg-neon-orange/10',    text: 'text-neon-orange',    border: 'border-neon-orange/20',    emoji: '📖' },
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
              <span>{CATEGORY_LABEL_VI[article.category] ?? article.category}</span>
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
            aria-label={bookmarked ? 'Bỏ lưu bài' : 'Lưu bài'}
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
                  <span>{article.readTimeMin} phút đọc</span>
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
                {isExpanded ? 'Thu gọn' : 'Đọc nhanh'}
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

// ── Resource Card (source drops + announcements) ─────────────────
//
// Replaces the old /blog terminal window (mac traffic lights, "TECHNICAL
// EXCHANGE" sidebar). Those posts have no body worth reading — the payload
// is the GitHub link — so the card leads with the download, not with a
// fake code editor.

function ResourceCard({ resource, index, onSelectTag }: {
  resource: Resource;
  index: number;
  onSelectTag: (tag: string) => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const permalink = `/blog/${resource.slug}`;

  const handleGetSource = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!resource.sourceUrl || downloading) return;
    setDownloading(true);
    // Count the download server-side, then open. If the counter call
    // fails the reader still gets the link — the counter is telemetry,
    // not a gate.
    try {
      const res = await blogApi.recordDownload(resource.id);
      const url = res.data?.data?.url || resource.sourceUrl;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(resource.sourceUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
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
      className="group relative md:col-span-1"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-darkborder bg-gradient-to-b from-darksurface/80 to-darkcard/80 backdrop-blur-sm transition-all duration-300 hover:border-neon-violet/40 hover:shadow-[0_8px_32px_-8px_rgba(139,92,246,0.4)]">
        {/* Cover */}
        <div className="relative aspect-[2/1] w-full overflow-hidden bg-darkcard">
          {resource.thumbnailUrl ? (
            <>
              <img
                src={resource.thumbnailUrl}
                alt={resource.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-darkcard via-darkcard/40 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-darksurface via-darkcard to-darksurface" />
              <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 via-transparent to-neon-fuchsia/10" />
              <div className="absolute inset-0 flex items-center justify-center text-7xl select-none sm:text-8xl">
                <span className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">📦</span>
              </div>
            </>
          )}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-neon-violet/20 bg-neon-violet/10 px-2.5 py-1 text-xs font-medium text-neon-violet backdrop-blur-md">
            <Package className="h-3 w-3" />
            <span>{CATEGORY_LABEL_VI.Resources}</span>
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <h2 className="font-heading text-lg font-semibold leading-relaxed tracking-tight text-text-primary sm:text-xl">
            <Link href={permalink} className="transition-colors hover:text-neon-violet">
              {resource.title}
            </Link>
          </h2>

          {resource.excerpt && (
            <p className="text-sm leading-relaxed text-text-secondary sm:text-[0.95rem]">
              {resource.excerpt}
            </p>
          )}

          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onSelectTag(t); }}
                  className="cursor-pointer rounded-md border border-white/[0.04] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-text-muted transition-colors hover:border-neon-violet/30 hover:text-text-primary"
                >
                  #{t}
                </button>
              ))}
            </div>
          )}

          {/* Meta + actions — pinned to the bottom so cards of different
              text lengths still line their buttons up. */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-darkborder pt-3">
            <div className="flex items-center gap-3 text-[11px] text-text-muted">
              <span>{formatDate(resource.publishedAt || resource.createdAt)}</span>
              {resource.downloadCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {resource.downloadCount}
                </span>
              )}
              {resource.commentCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {resource.commentCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={permalink}
                className="rounded-lg bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-text-secondary transition-colors hover:bg-neon-violet/15 hover:text-neon-violet active:scale-95"
              >
                Mở
              </Link>
              {resource.sourceUrl && (
                <button
                  onClick={handleGetSource}
                  disabled={downloading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neon-violet to-neon-fuchsia px-3 py-1 text-[11px] font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
                >
                  <Download className="h-3 w-3" />
                  {downloading ? 'Đang mở…' : 'Lấy source'}
                </button>
              )}
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

// Archive by year. Borrowed straight from taniarascia.com, and the
// cheapest upgrade on this page: "2026 — 30 bài" reads as a body of
// work in a way a grid of nine cards never does.
function ArchiveCard({ items, activeYear, onSelect }: {
  items: [number, number][];
  activeYear: number | null;
  onSelect: (year: number) => void;
}) {
  if (items.length === 0) return null;
  const max = Math.max(...items.map(([, n]) => n));
  return (
    <Widget title="Lưu trữ theo năm" icon={<Archive className="h-4 w-4" />}>
      <ul className="space-y-1.5">
        {items.map(([y, n]) => {
          const isActive = activeYear === y;
          return (
            <li key={y}>
              <button
                onClick={() => onSelect(y)}
                aria-pressed={isActive}
                className={[
                  'group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors',
                  isActive ? 'bg-neon-violet/15' : 'hover:bg-white/[0.04]',
                ].join(' ')}
              >
                <span className={[
                  'w-11 shrink-0 text-sm font-semibold tabular-nums',
                  isActive ? 'text-neon-violet' : 'text-text-primary',
                ].join(' ')}>
                  {y}
                </span>
                {/* Bar length is relative to the busiest year, so the
                    shape of the archive is readable at a glance. */}
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <span
                    className={[
                      'block h-full rounded-full transition-all',
                      isActive ? 'bg-neon-violet' : 'bg-neon-violet/40 group-hover:bg-neon-violet/70',
                    ].join(' ')}
                    style={{ width: `${Math.max(8, Math.round((n / max) * 100))}%` }}
                  />
                </span>
                <span className="shrink-0 text-[11px] tabular-nums text-text-muted">{n} bài</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Widget>
  );
}

function TrendingTagsCard({ tags, onSelect }: { tags: TrendingTag[]; onSelect: (t: string) => void }) {
  if (tags.length === 0) return null;
  return (
    <Widget title="Thẻ nổi bật" icon={<TrendingUp className="w-4 h-4" />}>
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
    <Widget title="Mẹo nhanh khi code" icon={<Sparkles className="w-4 h-4" />}>
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
    <Widget title="Tác giả" icon={<Sparkles className="w-4 h-4" />}>
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
                <span className="text-[9px] text-text-muted tabular-nums shrink-0">{score} điểm</span>
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
        Không tải được bài viết
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

function EmptyState({ query, category, onReset }: { query: string; category: TabId; onReset: () => void }) {
  const label = category === 'All' ? 'Tất cả' : (CATEGORY_LABEL_VI[category] ?? category);
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
        Chưa có bài nào
      </h3>
      <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
        {query
          ? <>Không có kết quả cho <span className="text-text-primary font-medium">“{query}”</span> trong mục <span className="text-text-primary font-medium">{label}</span>.</>
          : <>Mục <span className="text-text-primary font-medium">{label}</span> chưa có bài viết.</>}
      </p>
      <button
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
          bg-white/[0.04] border border-darkborder text-sm text-text-secondary
          hover:text-text-primary hover:border-neon-violet/30 transition-all active:scale-95"
      >
        <X className="w-3.5 h-3.5" />
        Bỏ bộ lọc
      </button>
    </motion.div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────

// Legacy blog `Post` → `Resource`. Normalising here means the rest of
// the page never has to care which table a card came from.
function toResource(p: Post): Resource {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: (p.excerpt || '').trim(),
    thumbnailUrl: p.thumbnailUrl || null,
    sourceUrl: p.sourceUrl || null,
    downloadCount: p.downloadCount ?? 0,
    commentCount: p.commentCount ?? 0,
    viewCount: p.viewCount ?? 0,
    tags: p.tagNames ?? [],
    publishedAt: p.publishedAt || null,
    createdAt: p.createdAt,
  };
}

function itemCategory(item: FeedItem): TabId {
  return item.type === 'article' ? item.article.category : 'Resources';
}

function yearOf(iso: string): number | null {
  const y = new Date(iso).getFullYear();
  return Number.isFinite(y) ? y : null;
}

// Everything a search should match, lowercased once per item.
function itemHaystack(item: FeedItem): string {
  if (item.type === 'article') {
    const a = item.article;
    return `${a.title} ${a.summary} ${a.tags.join(' ')}`.toLowerCase();
  }
  const r = item.resource;
  return `${r.title} ${r.excerpt} ${r.tags.join(' ')}`.toLowerCase();
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return iso;
  }
}
