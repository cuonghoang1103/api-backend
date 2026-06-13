'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSocialStore } from '@/store/socialStore';
import { PostComposer } from '@/components/social/PostComposer';
import { PostCard } from '@/components/social/PostCard';
import { motion, AnimatePresence } from 'framer-motion';
import SocialBackground from '@/components/social/SocialBackground';

export default function SocialPage() {
  const { posts, loadFeed, loadMore, isLoadingFeed, isLoadingMore, hasNextPage, error } =
    useSocialStore();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isLoadingMore) {
        loadMore();
      }
    },
    [hasNextPage, isLoadingMore, loadMore]
  );

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
  }, [posts, isLoadingMore]);

  return (
    <main className="min-h-screen" style={{ background: '#03020c' }}>
      <SocialBackground />
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 50% 0%, rgba(139, 92, 246, 0.06) 0%, transparent 70%), radial-gradient(ellipse 600px 400px at 80% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
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

        {/* Feed */}
        <div className="mt-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoadingFeed && posts.length === 0 ? (
              <FeedSkeleton key="skeleton" />
            ) : error ? (
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: 'rgba(139, 92, 246, 0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                }}
              >
                <p style={{ color: '#f87171' }}>{error}</p>
                <button
                  onClick={() => loadFeed(true)}
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
            ) : posts.length === 0 ? (
              <EmptyFeed />
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index < 5 ? index * 0.05 : 0 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))
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
    </main>
  );
}

function FeedSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="space-y-2">
              <div className="h-3 w-24 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-2 w-16 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="h-3 w-4/5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="h-3 w-3/5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </div>
      ))}
    </>
  );
}

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
