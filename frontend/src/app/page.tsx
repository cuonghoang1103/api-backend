'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSocialStore } from '@/store/socialStore';
import { useSocialFeed, useInvalidateFeed, useFeedCounts } from '@/hooks/useSocialQueries';
import { PostComposer } from '@/components/social/PostComposer';
import { PostCard, PostSkeleton } from '@/components/social/PostCard';
import SocialSidebar from '@/components/social/SocialSidebar';
import SocialRightWidget from '@/components/social/SocialRightWidget';
import FeedFilterTabs, {
  type FeedFilter,
  parseFeedFilterFromUrl,
  writeFeedFilterToUrl,
  FEED_FILTER_URL_PARAM,
} from '@/components/social/FeedFilterTabs';
import FeedTypeTabs, {
  type FeedType,
  feedTypeToParam,
  parseFeedTypeFromUrl,
  writeFeedTypeToUrl,
  FEED_TYPE_URL_PARAM,
} from '@/components/social/FeedTypeTabs';
import FeedFileList from '@/components/social/FeedFileList';
import FeedVideoGrid from '@/components/social/FeedVideoGrid';
import FeedHasNewBanner from '@/components/social/FeedHasNewBanner';
import { useFeedHasNew } from '@/hooks/useFeedHasNew';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Loader2, Search, Sparkles, X, RotateCw } from 'lucide-react';
import SocialBackground from '@/components/social/SocialBackground';
import TheaterMode from '@/components/social/TheaterMode';
import MiniChatDock from '@/components/social/MiniChatDock';

export default function SocialPage() {
  const { posts, loadMore, isLoadingMore, hasNextPage } = useSocialStore();
  const invalidateFeed = useInvalidateFeed();
  const invalidateFeedRef = useRef(invalidateFeed);
  invalidateFeedRef.current = invalidateFeed;

  // Active hashtag filter set by the right-side trending widget.
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);

  // Phase 5 home upgrade: feed filter tab (All / Following / Popular).
  // Mirrored to the URL (?f=following|popular) so the tab survives
  // reload + share-by-link. Hashtag filtering composes on top of the
  // tab — picking a hashtag while on "Following" keeps the
  // following scope + adds the hashtag scope.
  const [feedFilter, setFeedFilter] = useState<FeedFilter>(() =>
    typeof window !== 'undefined' ? parseFeedFilterFromUrl(window.location.search) : 'all',
  );
  const onFeedFilterChange = useCallback((next: FeedFilter) => {
    setFeedFilter(next);
    // Sync URL. `all` strips the param so the URL stays clean.
    const url = new URL(window.location.href);
    if (next === 'all') url.searchParams.delete(FEED_FILTER_URL_PARAM);
    else url.searchParams.set(FEED_FILTER_URL_PARAM, next);
    window.history.replaceState({}, '', url.toString());
    // Reset feed pagination so the user sees a fresh list per tab.
    useSocialStore.setState({ posts: [], cursor: null, hasNextPage: true });
  }, []);

  // Content-type tab (Tất cả / Bài viết / Video / File) — the PRIMARY
  // feed navigation. Mirrored to ?tab= so it survives reload + share.
  // The all/following/popular filter is a SECONDARY control shown only
  // on the "Tất cả" and "Bài viết" tabs.
  const [feedType, setFeedType] = useState<FeedType>(() =>
    typeof window !== 'undefined' ? parseFeedTypeFromUrl(window.location.search) : 'all',
  );
  const { data: feedCounts } = useFeedCounts();
  const onFeedTypeChange = useCallback((next: FeedType) => {
    setFeedType(next);
    const url = new URL(window.location.href);
    if (next === 'all') url.searchParams.delete(FEED_TYPE_URL_PARAM);
    else url.searchParams.set(FEED_TYPE_URL_PARAM, next);
    window.history.replaceState({}, '', url.toString());
    // Fresh list per tab so we don't mix types while paginating.
    useSocialStore.setState({ posts: [], cursor: null, hasNextPage: true });
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { hashtag } = (e as CustomEvent<{ hashtag: string | null }>).detail ?? {};
      const next = hashtag || null;
      setActiveHashtag(next);
      // Reset Zustand store so the filtered feed loads from scratch.
      useSocialStore.setState({ posts: [], cursor: null, hasNextPage: true });
    };
    window.addEventListener('social:filter-hashtag', handler as EventListener);
    return () => window.removeEventListener('social:filter-hashtag', handler as EventListener);
  }, []);

  // Notification deep-link: ?post=N scrolls the matching PostCard
  // into view. We wait one extra frame after the posts array
  // updates so the new DOM nodes are mounted before we query for
  // them. The cleanup removes the ?post query so the page
  // doesn't re-trigger the scroll on every subsequent
  // useState/useReducer that touches `posts` (e.g. socket
  // appends a new post, which would otherwise cause a jump).
  const searchParams = useSearchParams();
  useEffect(() => {
    const postId = searchParams.get('post');
    if (!postId) return;
    const tid = Number(postId);
    if (!Number.isFinite(tid)) return;
    // Wait two frames: one for React to commit the post nodes,
    // one for any layout/image-loading that might shift scrollHeight.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>(
          `[data-post-id="${tid}"]`,
        );
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Brief highlight so the user sees what was opened.
          el.classList.add('ring-2', 'ring-violet-500/60', 'transition');
          window.setTimeout(() => {
            el.classList.remove('ring-2', 'ring-violet-500/60');
          }, 1800);
        }
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      // Strip ?post from the URL after the scroll so a later
      // socket append (which would re-run the effect) doesn't
      // jump the user back to the old post.
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.get('post') === String(tid)) {
          url.searchParams.delete('post');
          window.history.replaceState({}, '', url.toString());
        }
      } catch { /* ignore */ }
    };
    // We intentionally depend on `posts` length so the effect
    // re-runs when the feed arrives and the target post is
    // mounted. We do NOT depend on `posts` reference identity
    // because socket appends would otherwise cause re-scrolls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, posts.length]);

  // Phase 5 home upgrade: subscribe to feed:has-new pings so we
  // can show the "X bài viết mới" banner. The page calls the
  // returned onAck after the user clicks the banner and we've
  // pulled the new posts.
  const { count: newPostsCount, onAck: onNewPostsSeen } = useFeedHasNew();

  // TanStack Query feed — reads from cache if visited within 30s (no refetch),
  // falls back to Zustand store if cache is empty.
  // Content-type tabs only carry the all/following/popular filter on the
  // "Tất cả" and "Bài viết" tabs; Video/File ignore it (a "popular video"
  // sub-filter would just confuse the grid).
  const effectiveSort: 'recent' | 'popular' =
    (feedType === 'all' || feedType === 'post') && feedFilter === 'popular' ? 'popular' : 'recent';
  const effectiveFollowing =
    (feedType === 'all' || feedType === 'post') && feedFilter === 'following';

  const { data: feedData, isLoading: isLoadingFeed, error } = useSocialFeed({
    limit: 20,
    hashtag: activeHashtag ?? undefined,
    // Phase 5 home upgrade: forward the active filter tab. Each
    // tab gets its own TQ cache key so flipping back to "All"
    // shows the cached "All" feed instantly.
    sort: effectiveSort,
    following: effectiveFollowing,
    // Content-type tab → backend `type` filter (undefined = all).
    type: feedTypeToParam(feedType),
  });

  // Keep the Zustand feed scope in sync so infinite-scroll loadMore()
  // pages stay within the active tab/filter/hashtag (it reads
  // store.feedParams). Without this, scrolling past the first page would
  // append unfiltered posts.
  useEffect(() => {
    useSocialStore.getState().setFeedParams({
      sort: effectiveSort,
      following: effectiveFollowing,
      hashtag: activeHashtag ?? undefined,
      type: feedTypeToParam(feedType),
    });
  }, [effectiveSort, effectiveFollowing, activeHashtag, feedType]);

  // Hydrate Zustand store from TanStack Query cache so PostCard mutations work.
  // Invalidate the query after mutations to trigger a background refetch.
  const { toggleLike, toggleSave, loadComments, commentsByPost, loadMoreComments, commentsHasMoreByPost, isLoadingComments, addOptimisticComment, deletePost } = useSocialStore((s) => ({
    toggleLike: s.toggleLike,
    toggleSave: s.toggleSave,
    loadComments: s.loadComments,
    commentsByPost: s.commentsByPost,
    loadMoreComments: s.loadMoreComments,
    commentsHasMoreByPost: s.commentsHasMoreByPost,
    isLoadingComments: s.isLoadingComments,
    addOptimisticComment: s.addOptimisticComment,
    deletePost: s.deletePost,
  }));

  const feedPosts = feedData?.data ?? posts;
  const feedNextCursor = feedData?.nextCursor ?? null;
  const feedHasMore = feedData?.hasMore ?? hasNextPage;

  // Track whether the NavigationDock is open so we can push the page
  // content left and avoid the panel covering the header / composer.
  const [dockOpen, setDockOpen] = useState(false);
  useEffect(() => {
    const saved = sessionStorage.getItem('dock-open');
    if (saved === 'true') setDockOpen(true);
    const handler = () => {
      setDockOpen(sessionStorage.getItem('dock-open') === 'true');
    };
    window.addEventListener('storage', handler);
    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('focus', handler);
    };
  }, []);

  // Phase 5 home upgrade: when the user clicks the "X bài viết mới"
  // banner we invalidate the feed query so the cursor resets to
  // "latest" and reload via the existing infinite-scroll trigger.
  // We also scroll to the top so the freshly loaded posts appear
  // at the top of the feed.
  const onAckNewPosts = useCallback(() => {
    onNewPostsSeen();
    invalidateFeedRef.current();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [onNewPostsSeen]);

  // ─── Theater Mode state (added 2026-06-22) ─────────────────
  // Page-level state for the fullscreen video modal. PostCard
  // emits `onOpenTheater(postId)`; we remember which post was
  // asked for and pass the current feed down to TheaterMode
  // along with a close handler. Keeping the state at the page
  // level (instead of inside PostCard) means the modal can be
  // closed from anywhere — keyboard, click on backdrop, the X
  // button — without each card needing to know about the
  // others.
  const [theaterState, setTheaterState] = useState<{ postId: number } | null>(null);
  // Phase 5 home upgrade: right sidebar toggle on mobile. Hidden
  // by default on <lg breakpoints; the "Widgets" button in the
  // composer / header bar opens a slide-in panel. Persisted across
  // session via sessionStorage so the user's preference sticks.
  const [rightOpen, setRightOpen] = useState(false);
  useEffect(() => {
    const saved = sessionStorage.getItem('right-open');
    if (saved === 'true') setRightOpen(true);
    const handler = () => setRightOpen(sessionStorage.getItem('right-open') === 'true');
    window.addEventListener('storage', handler);
    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('focus', handler);
    };
  }, []);
  const toggleRight = useCallback(() => {
    setRightOpen((v) => {
      const next = !v;
      try { sessionStorage.setItem('right-open', String(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);
  const handleOpenTheater = useCallback((postId: number) => {
    setTheaterState({ postId });
  }, []);
  const handleCloseTheater = useCallback(() => {
    setTheaterState(null);
  }, []);

  // Wrap Zustand mutations so they invalidate the TanStack Query cache.
  const handleToggleLike = useCallback(
    async (postId: number) => {
      await toggleLike(postId);
      invalidateFeedRef.current();
    },
    [toggleLike],
  );

  const handleToggleSave = useCallback(
    async (postId: number) => {
      await toggleSave(postId);
      invalidateFeedRef.current();
    },
    [toggleSave],
  );

  const handleDeletePost = useCallback(
    async (postId: number) => {
      await deletePost(postId);
      invalidateFeedRef.current();
    },
    [deletePost],
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && feedHasMore && !isLoadingMore) {
        loadMore();
      }
    },
    [feedHasMore, isLoadingMore, loadMore],
  );

  // Zustand posts is the single source of truth for rendering.
  // TanStack Query is used only for background data fetching
  // (initial load via the loader, not for display).
  // Every mutation in PostCard updates Zustand directly, so
  // this component re-renders immediately when posts change.
  const displayPosts = posts;

  // Seed Zustand store from TQ data. We use set() to ensure
  // a re-render — direct assignment (getState().posts = ...) does NOT
  // trigger Zustand subscriptions.
  useEffect(() => {
    if (feedData?.data && feedData.data.length > 0) {
      const storePosts = useSocialStore.getState().posts;
      // Only update if Zustand is empty (avoids overwriting in-flight changes)
      if (storePosts.length === 0) {
        useSocialStore.setState({ posts: feedData.data });
      }
    }
  }, [feedData]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    });
    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (loadMoreRef.current && observerRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [displayPosts, isLoadingMore]);

  return (
    <main className="min-h-screen pt-16" style={{ background: '#03020c' }}>
      <SocialBackground />
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 50% 0%, rgba(139, 92, 246, 0.06) 0%, transparent 70%), radial-gradient(ellipse 600px 400px at 80% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 60%)',
        }}
      />

      {/* 3-column layout:
          - Left rail: navigation icons (hidden on small screens)
          - Centre: feed (600-700px max-width for comfortable reading)
          - Right: trending/AI widget (hidden on small screens)
          - On <lg: single-column centred feed

          When the NavigationDock is open (280px wide), the left edge
          of the feed gets covered. We push the grid to the right so
          the Feed header + composer are never hidden.
       */}
      <div
        className={`relative z-10 mx-auto w-full px-6 lg:px-12 xl:px-16 py-6 transition-[padding-left] duration-300 ${
          dockOpen ? 'lg:pl-[calc(280px+1.5rem)]' : ''
        }`}
      >
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_300px] xl:grid-cols-[220px_minmax(0,1fr)_300px]">
          {/* Left sidebar (icons) */}
          <div className="hidden lg:block">
            <SocialSidebar />
          </div>

          {/* Center feed — bounded width so reading is comfortable */}
          <div className="mx-auto w-full min-w-0 lg:max-w-[740px] xl:max-w-[780px]">
            {/* Header — Phase 5 home upgrade: refined typography.
                Smaller, denser headline that fits the focused-study
                vibe; subtle accent line under the title so the feed
                doesn't look like a generic social page. */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 26 }}
              className="mb-5"
            >
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h1
                    className="bg-gradient-to-r from-violet-300 via-purple-300 to-cyan-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-[2rem]"
                  >
                    Bảng tin
                  </h1>
                  <p className="mt-0.5 text-[13px]" style={{ color: '#64748b' }}>
                    Không gian học tập & chia sẻ của bạn
                  </p>
                </div>
                {/* Tiny counter badge so the user knows how many posts
                    they're seeing without scrolling. Updates live
                    when filter tabs change. */}
                <div
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium"
                  style={{ color: '#94a3b8' }}
                  title="Số bài viết đang hiển thị"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  {displayPosts.length} bài
                </div>
              </div>
              {/* Accent underline — gradient fades from violet to cyan
                  so the page header feels related to the brand
                  identity without using a heavy box border. */}
              <div
                className="mt-3 h-px w-full"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(139,92,246,0.4) 0%, rgba(34,211,238,0.4) 50%, transparent 100%)',
                }}
              />
            </motion.div>

            {/* Composer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PostComposer />
            </motion.div>

            {/* Active hashtag filter banner */}
            {activeHashtag && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
                style={{
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.25)',
                }}
              >
                <span style={{ color: '#a78bfa' }}>Đang lọc: <strong>#{activeHashtag}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveHashtag(null);
                    useSocialStore.setState({ posts: [], cursor: null, hasNextPage: true });
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(
                        new CustomEvent('social:filter-hashtag', { detail: { hashtag: null } }),
                      );
                    }
                  }}
                  className="ml-auto text-xs transition-colors"
                  style={{ color: '#7c3aed' }}
                >
                  Xoá bộ lọc ×
                </button>
              </motion.div>
            )}

            {/* Primary navigation: content-type tabs (Tất cả / Bài viết
                / Video / File) with per-tab counts. */}
            <div className="mt-4">
              <FeedTypeTabs active={feedType} onChange={onFeedTypeChange} counts={feedCounts} />
            </div>

            {/* Secondary control: all/following/popular filter. Only
                meaningful for the post-style feeds, so we hide it on the
                Video grid and File list to avoid a confusing combo. */}
            {(feedType === 'all' || feedType === 'post') && (
              <div className="mt-3">
                <FeedFilterTabs active={feedFilter} onChange={onFeedFilterChange} />
              </div>
            )}

            {/* Phase 5 home upgrade: "X bài viết mới" banner — drops in
                above the list whenever a follower posts. Clicking it
                resets the cursor and triggers an infinite-scroll
                fetch via the existing observer. */}
            <FeedHasNewBanner count={newPostsCount} onAck={onAckNewPosts} />

            {/* Feed — space-y-6 gives each post more breathing room */}
            <div id="feed-list" className="mt-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {isLoadingFeed && displayPosts.length === 0 ? (
                  /* Use the PostSkeleton list during initial load so the
                     placeholder matches the real card shape exactly. */
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <PostSkeleton key={i} />
                    ))}
                  </div>
                ) : error ? (
                  // Phase 5 home upgrade: friendly error state with
                  // exponential-backoff auto-retry + a manual button.
                  // The network can be flaky on mobile so we don't
                  // want a single failure to leave the user with an
                  // empty page — we silently retry up to 3 times with
                  // 1s, 2s, 4s delays before showing the error UI.
                  <FeedErrorState
                    error={error as Error}
                    onRetry={() => invalidateFeedRef.current()}
                  />
                ) : displayPosts.length === 0 ? (
                  <EmptyFeed type={feedType} />
                ) : feedType === 'video' ? (
                  // TikTok-style: grid of poster thumbnails; tapping one
                  // opens the dedicated full-screen /feed/video reel.
                  <FeedVideoGrid posts={displayPosts} />
                ) : feedType === 'file' ? (
                  // File tab: download-focused list of shared files.
                  <FeedFileList posts={displayPosts} />
                ) : (
                  displayPosts.map((post) => {
                    // Find the latest version of this post from Zustand.
                    // Zustand is the single source of truth for mutations;
                    // TQ is used only for initial data hydration and
                    // background refetch reconciliation.
                    const latest = posts.find((p) => p.id === post.id) ?? post;
                    return (
                      // Performance note (Phase 4 perf):
                      // - `whileInView` was replaced with a plain
                      //   mount-only animate because whileInView attaches
                      //   a per-card IntersectionObserver that promotes
                      //   the wrapper onto its own compositing layer
                      //   — combined with the backdrop-filter the card
                      //   used to have, this made video inside the card
                      //   choppy (~10 FPS). With the backdrop-filter
                      //   gone (see PostCard.tsx) the cost dropped, but
                      //   we still want to avoid the extra observer per
                      //   card. A 200ms fade-in on first mount is the
                      //   cheapest possible entrance.
                      // - We dropped the `layout` prop: Framer's layout
                      //   animation forces a synchronous layout
                      //   measurement on every add/remove, which is
                      //   the dominant jank source while scrolling
                      //   and triggering infinite scroll.
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <PostCard
                          post={latest}
                          onOpenTheater={handleOpenTheater}
                        />
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>

              {/* Load more trigger */}
              <div ref={loadMoreRef} className="flex justify-center py-4">
                {isLoadingMore && (
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 animate-pulse rounded-full" style={{ background: '#8B5CF6' }} />
                    <div className="h-2 w-2 animate-pulse rounded-full" style={{ background: '#8B5CF6', animationDelay: '150ms' }} />
                    <div className="h-2 w-2 animate-pulse rounded-full" style={{ background: '#8B5CF6', animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right widget — trending + AI shortcut + suggestions.
              Phase 5 home upgrade: hidden on <lg by default; the
              "Widgets" floating button opens a slide-in panel. */}
          <div className="hidden lg:block">
            <SocialRightWidget />
          </div>
        </div>
      </div>

      {/* Phase 5 home upgrade: right-sidebar floating toggle + slide-in
          panel for mobile / tablet. Sits OUTSIDE the grid so it
          covers the right edge without disturbing layout. Closes
          when the user taps the backdrop. */}
      <button
        type="button"
        onClick={toggleRight}
        aria-label={rightOpen ? 'Đóng widgets' : 'Mở widgets'}
        aria-expanded={rightOpen}
        className="fixed bottom-20 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0c0f14]/90 text-teal-200 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md hover:bg-[#0c0f14] lg:hidden"
        style={{ touchAction: 'manipulation' }}
      >
        <Sparkles size={18} />
      </button>
      <AnimatePresence>
        {rightOpen && (
          <>
            <motion.div
              key="right-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRightOpen(false)}
              className="fixed inset-0 z-40 bg-black/55 lg:hidden"
            />
            <motion.aside
              key="right-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 right-0 z-50 w-[88%] max-w-sm overflow-y-auto border-l border-white/[0.06] bg-[#0e1218] pt-16 lg:hidden"
              role="dialog"
              aria-label="Widgets"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Widgets</h2>
                <button
                  type="button"
                  onClick={() => setRightOpen(false)}
                  aria-label="Đóng"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.05]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SocialRightWidget />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Theater Mode overlay (added 2026-06-22) ────────────
          Sits OUTSIDE the grid so it can cover the entire
          viewport including the left/right sidebars. State is
          page-level (see `theaterState` above) so any PostCard
          can open it. */}
      <TheaterMode
        posts={displayPosts}
        startPostId={theaterState?.postId ?? 0}
        open={theaterState !== null}
        onClose={handleCloseTheater}
        onReact={handleToggleLike}
      />

      {/* ─── Floating mini-chat dock (added 2026-06-22) ────────
          Listens for the `social:open-mini-chat` event that
          SocialSidebar's FriendsSection dispatches when the
          user clicks a friend row. Mounted at the page level
          so it survives route changes inside the social app. */}
      <MiniChatDock />
    </main>
  );
}

// FeedSkeleton removed — replaced by PostSkeleton from PostCard.tsx

// Phase 5 home upgrade: feed error state with auto-retry.
// Renders a friendly error card with a "Thử lại" button + a
// built-in exponential-backoff auto-retry (1s → 2s → 4s) so a
// single network blip doesn't leave the user with an empty feed.
// We deliberately cap auto-retry at 3 attempts so a real outage
// still surfaces the manual "Thử lại" button quickly.
function FeedErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const [attempt, setAttempt] = useState(0);
  const [autoRetrying, setAutoRetrying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const maxAutoRetries = 3;

  useEffect(() => {
    if (attempt >= maxAutoRetries) return;
    const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
    setAutoRetrying(true);
    setCountdown(Math.ceil(delay / 1000));
    const tick = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    const timer = setTimeout(() => {
      clearInterval(tick);
      setAutoRetrying(false);
      setAttempt((a) => a + 1);
      onRetry();
    }, delay);
    return () => {
      clearTimeout(timer);
      clearInterval(tick);
    };
    // We intentionally only re-run on attempt change so a manual
    // retry doesn't loop forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 26 }}
      className="flex flex-col items-center justify-center rounded-2xl p-6 text-center"
      style={{
        background: 'rgba(248, 113, 113, 0.04)',
        border: '1px solid rgba(248, 113, 113, 0.18)',
      }}
    >
      <div
        className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ background: 'rgba(248,113,113,0.1)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-base font-semibold" style={{ color: '#fca5a5' }}>
        Không tải được bảng tin
      </h3>
      <p className="mt-1 max-w-sm text-[13px] leading-relaxed" style={{ color: '#94a3b8' }}>
        {error?.message || 'Đã có lỗi mạng. Đang thử lại...'}
      </p>
      <div className="mt-4 flex items-center gap-2">
        {autoRetrying ? (
          <span className="flex items-center gap-1.5 text-[12px]" style={{ color: '#94a3b8' }}>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Tự thử lại sau {countdown}s...
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setAttempt(0); // reset auto-retry counter
              onRetry();
            }}
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors"
            style={{
              background: 'rgba(139,92,246,0.18)',
              color: '#a78bfa',
              border: '1px solid rgba(139,92,246,0.3)',
            }}
          >
            <RotateCw className="h-3.5 w-3.5" />
            Thử lại ngay
          </button>
        )}
        {attempt > 0 && attempt < maxAutoRetries && (
          <span className="text-[11px]" style={{ color: '#475569' }}>
            ({attempt}/{maxAutoRetries} lần)
          </span>
        )}
      </div>
    </motion.div>
  );
}

function EmptyFeed({ type = 'all' }: { type?: FeedType }) {
  // Phase 5 home upgrade: friendly empty state with a hand-drawn
  // SVG illustration, gradient headline, and a primary CTA to
  // jump-start engagement. Empty states used to be just a
  // centred icon + 2 lines of English text; now they read as a
  // designed zero-screen that nudges the user to action.
  //
  // Per-tab copy so each content-type tab explains its own emptiness.
  const copy: Record<FeedType, { title: string; body: string }> = {
    all: {
      title: 'Feed của bạn đang trống',
      body: 'Hãy là người đầu tiên chia sẻ — một câu hỏi, một khoảnh khắc, hay đoạn code hay. Cộng đồng đang chờ bạn.',
    },
    post: {
      title: 'Chưa có bài viết nào',
      body: 'Viết chia sẻ đầu tiên — văn bản, ảnh hoặc một cuộc bình chọn.',
    },
    video: {
      title: 'Chưa có video nào',
      body: 'Đăng một video dọc (hoặc dán link YouTube/TikTok) để khởi động chế độ xem toàn màn hình.',
    },
    file: {
      title: 'Chưa có file nào',
      body: 'Chia sẻ tài nguyên dev — zip, markdown, source… mọi người tải về trực tiếp ở đây.',
    },
  };
  const { title, body } = copy[type] ?? copy.all;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Animated SVG illustration: a floating notebook with a
          sparkle. The SVG animates the sparkle pulse + a slow
          float on the notebook so the empty state never reads as
          "dead" while the user looks at it. */}
      <motion.div
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(6,182,212,0.18))',
          border: '1px solid rgba(139,92,246,0.3)',
        }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#empty-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="empty-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          {/* Notebook */}
          <path d="M4 4h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4z" />
          <path d="M8 2v4M16 2v4M4 10h12" />
          {/* Sparkle (top-right) */}
          <motion.circle
            cx="19" cy="4" r="1.5" fill="#a78bfa"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M21 7 L22 8 L21 9 L20 8 Z"
            fill="#22d3ee"
            animate={{ opacity: [0.5, 1, 0.5], rotate: [0, 90, 180] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '21px 8px' }}
          />
        </svg>
      </motion.div>
      <h3 className="bg-gradient-to-r from-violet-300 via-cyan-300 to-violet-300 bg-clip-text text-xl font-bold tracking-tight text-transparent">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
        {body}
      </p>
      <div className="mt-5 flex items-center gap-2 text-[11px]" style={{ color: '#64748b' }}>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          Click ✨ AI Write để bắt đầu
        </span>
        <span style={{ color: '#334155' }}>·</span>
        <span>Hoặc paste ảnh / video trực tiếp</span>
      </div>
    </motion.div>
  );
}
