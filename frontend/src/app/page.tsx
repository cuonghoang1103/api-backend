'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSocialStore } from '@/store/socialStore';
import { useSocialFeed, useInvalidateFeed } from '@/hooks/useSocialQueries';
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
import FeedHasNewBanner from '@/components/social/FeedHasNewBanner';
import { useFeedHasNew } from '@/hooks/useFeedHasNew';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Loader2, Search, Sparkles, X } from 'lucide-react';
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

  // Phase 5 home upgrade: subscribe to feed:has-new pings so we
  // can show the "X bài viết mới" banner. The page calls the
  // returned onAck after the user clicks the banner and we've
  // pulled the new posts.
  const { count: newPostsCount, onAck: onNewPostsSeen } = useFeedHasNew();

  // TanStack Query feed — reads from cache if visited within 30s (no refetch),
  // falls back to Zustand store if cache is empty.
  const { data: feedData, isLoading: isLoadingFeed, error } = useSocialFeed({
    limit: 20,
    hashtag: activeHashtag ?? undefined,
    // Phase 5 home upgrade: forward the active filter tab. Each
    // tab gets its own TQ cache key so flipping back to "All"
    // shows the cached "All" feed instantly.
    sort: feedFilter === 'popular' ? 'popular' : 'recent',
    following: feedFilter === 'following',
  });

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
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1
                className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-4xl font-black tracking-tight text-transparent"
                style={{ fontSize: '2.5rem' }}
              >
                Feed
              </h1>
              <p className="mt-1 text-sm" style={{ color: '#64748b' }}>
                Your personal space
              </p>
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

            {/* Phase 5 home upgrade: filter tabs (All / Following / Popular).
                Sits below the hashtag banner so the user sees both
                composable scopes at once. */}
            <div className="mt-4">
              <FeedFilterTabs active={feedFilter} onChange={onFeedFilterChange} />
            </div>

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
                  <div
                    className="rounded-2xl p-6 text-center"
                    style={{
                      background: 'rgba(139, 92, 246, 0.05)',
                      border: '1px solid rgba(139, 92, 246, 0.15)',
                    }}
                  >
                    <p style={{ color: '#f87171' }}>{String((error as any)?.message || error)}</p>
                    <button
                      onClick={() => invalidateFeedRef.current()}
                      className="mt-3 rounded-xl px-4 py-2 text-sm font-medium transition-all"
                      style={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#a78bfa',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      Try again
                    </button>
                  </div>
                ) : displayPosts.length === 0 ? (
                  <EmptyFeed />
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

function EmptyFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl py-16 text-center"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))',
          border: '1px solid rgba(139,92,246,0.3)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <p className="text-lg font-semibold" style={{ color: '#94a3b8' }}>
        No posts yet
      </p>
      <p className="mt-1 text-sm" style={{ color: '#475569' }}>
        Be the first to share something
      </p>
    </motion.div>
  );
}
