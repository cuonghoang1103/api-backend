'use client';

import { useState, useMemo, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Share2, Clock, TrendingUp, Search, Sparkles, Code2, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import {
  ARTICLES,
  AUTHORS,
  CATEGORY_TABS,
  QUICK_TIPS,
  TRENDING_TAGS,
  TOP_AUTHORS,
  type Article,
  type Category,
  type CodeBlock,
} from './data';

/**
 * Tech Trends & Insights — public page
 *
 * Layout:
 *   [ Header + search + tab bar ]
 *   [ main 70%  |  sidebar 30% (sticky) ]
 *     main:   bento grid of article cards (featured = 2-col, normal = 1-col)
 *     sidebar: Trending Tags / Quick Tips / Top Authors
 *
 * Animations:
 *   - Cards: fade + slide-up on filter change (Framer Motion + layout)
 *   - Tabs:  active pill slides between positions
 *   - Hover: scale-up + neon glow on each card
 *
 * State:
 *   - category: 'All' | one of the 4 categories
 *   - query:    search text (matches title + summary + tags)
 *   - bookmarks: Set<articleId> persisted in localStorage (SSR-safe)
 *
 * "use client" is required because we use useState / useEffect and
 * Framer Motion. The page wrapper (page.tsx) is a server component
 * so the page metadata still works for SEO.
 */
export default function TechTrendsClient() {
  const [category, setCategory] = useState<'All' | Category>('All');
  const [query, setQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // SSR-safe hydration: only read localStorage after mount. Without
  // this guard the server renders one thing and the client renders
  // another, which is a classic hydration mismatch source.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem('tech-trends:bookmarks');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setBookmarks(new Set(arr));
      }
    } catch {
      // localStorage may be unavailable (private mode, sandbox).
      // Silently fall back to an in-memory set.
    }
  }, [mounted]);

  const persistBookmarks = (next: Set<string>) => {
    setBookmarks(next);
    try {
      localStorage.setItem('tech-trends:bookmarks', JSON.stringify([...next]));
    } catch {}
  };

  const toggleBookmark = (id: string) => {
    const next = new Set(bookmarks);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    persistBookmarks(next);
  };

  // Filter + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      if (category !== 'All' && a.category !== category) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [category, query]);

  const trendingTags = useMemo(() => TRENDING_TAGS(8), []);
  const topAuthors = useMemo(() => TOP_AUTHORS(3), []);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-darkbg" style={{ background: '#0a0a0f' }}>
      {/* Decorative background — soft glow blobs to add depth without
          competing with the content. Pointer events off so it never
          intercepts clicks. */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-neon-indigo/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-neon-fuchsia/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-neon-cyan/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ────────────────────────────────────────── */}
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
              {' '}of {ARTICLES.length} posts
            </div>
          </motion.div>
        </header>

        {/* ── Main grid + sidebar ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Main column (70% on desktop) */}
          <main className="lg:col-span-7">
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
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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

function ArticleCard({
  article,
  index,
  bookmarked,
  onToggleBookmark,
  isExpanded,
  onToggleExpand,
}: {
  article: Article;
  index: number;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const style = CATEGORY_STYLES[article.category];
  // Featured = 2 columns on md+, normal = 1 column.
  const spanClass = article.featured ? 'md:col-span-2' : 'md:col-span-1';

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
        {/* Cover — gradient + emoji, no external image dep */}
        <div
          className={[
            'relative w-full overflow-hidden',
            article.featured ? 'aspect-[2.4/1]' : 'aspect-[2/1]',
          ].join(' ')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-darksurface via-darkcard to-darksurface" />
          <div className="absolute inset-0 bg-gradient-to-br from-neon-indigo/10 via-transparent to-neon-fuchsia/10" />
          <div className="absolute inset-0 flex items-center justify-center text-7xl sm:text-8xl select-none">
            <span className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              {article.cover}
            </span>
          </div>

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

          {/* Bookmark button on cover */}
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
            article.featured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl',
          ].join(' ')}>
            {article.title}
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

          {/* Expanded body — shows on demand */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.32, 0.94, 0.6, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-3 text-text-secondary text-sm leading-relaxed border-t border-darkborder">
                  {article.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium
                  bg-white/[0.04] text-text-muted border border-white/[0.04]
                  hover:text-text-primary hover:border-neon-violet/30 transition-colors cursor-pointer"
                onClick={() => { /* future: route to filtered list */ }}
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Meta + actions */}
          <div className="flex items-center justify-between pt-3 border-t border-darkborder">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white',
                  'bg-gradient-to-br shrink-0',
                  article.author.gradient,
                ].join(' ')}
              >
                {article.author.initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">{article.author.name}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                  <span>{formatDate(article.publishedAt)}</span>
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
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary
                  hover:bg-white/[0.04] transition-colors active:scale-95"
                aria-label="Share"
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

function TrendingTagsCard({ tags, onSelect }: { tags: { tag: string; score: number }[]; onSelect: (t: string) => void }) {
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

function QuickTipsCard({ tips }: { tips: { title: string; body: string }[] }) {
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

function TopAuthorsCard({ items }: { items: { author: typeof AUTHORS[number]; score: number }[] }) {
  return (
    <Widget title="Top Authors" icon={<Sparkles className="w-4 h-4" />}>
      <ul className="space-y-3">
        {items.map(({ author, score }, i) => (
          <li key={author.id} className="flex items-start gap-3">
            <span className="shrink-0 text-[10px] font-bold text-text-muted w-3 mt-2.5 tabular-nums">
              {i + 1}
            </span>
            <div className={[
              'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0',
              'bg-gradient-to-br', author.gradient,
            ].join(' ')}>
              {author.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold text-text-primary truncate">{author.name}</p>
                <span className="text-[9px] text-text-muted tabular-nums shrink-0">{score} pts</span>
              </div>
              <p className="text-[10px] text-text-muted truncate">{author.handle}</p>
              <p className="text-[11px] text-text-secondary leading-relaxed mt-1 line-clamp-2">
                {author.bio}
              </p>
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

// ── Empty state ─────────────────────────────────────────────────

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
