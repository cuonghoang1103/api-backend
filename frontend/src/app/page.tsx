'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSocialStore } from '@/store/socialStore';
import { useSocialFeed, useInvalidateFeed } from '@/hooks/useSocialQueries';
import { PostComposer } from '@/components/social/PostComposer';
import { PostCard, PostSkeleton } from '@/components/social/PostCard';
import SocialSidebar from '@/components/social/SocialSidebar';
import SocialRightWidget from '@/components/social/SocialRightWidget';
import { motion, AnimatePresence } from 'framer-motion';
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

  // TanStack Query feed — reads from cache if visited within 30s (no refetch),
  // falls back to Zustand store if cache is empty.
  const { data: feedData, isLoading: isLoadingFeed, error } = useSocialFeed({
    limit: 20,
    hashtag: activeHashtag ?? undefined,
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

            {/* Feed — space-y-6 gives each post more breathing room */}
            <div className="mt-6 space-y-6">
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
                  displayPosts.map((post, index) => {
                    // Find the latest version of this post from Zustand.
                    // Zustand is the single source of truth for mutations;
                    // TQ is used only for initial data hydration and
                    // background refetch reconciliation.
                    const latest = posts.find((p) => p.id === post.id) ?? post;
                    return (
                      <motion.div
                        key={post.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index < 5 ? index * 0.05 : 0 }}
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

          {/* Right widget — trending + AI shortcut + suggestions */}
          <div className="hidden lg:block">
            <SocialRightWidget />
          </div>
        </div>
      </div>

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
