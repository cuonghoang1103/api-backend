'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Code2, Terminal, Loader2 } from 'lucide-react';
import ClientOnly from '@/components/providers/ClientOnly';
import DevPostCard from '@/components/dev-hub/DevPostCard';
import PostDetailModal from '@/components/dev-hub/PostDetailModal';
import { devPostsApi } from '@/lib/api/devPosts';
import type { DevPostCard as DevPostCardType } from '@/types/devPost';

const C = {
  primary: '#a855f7',
  secondary: '#ec4899',
  tertiary: '#22d3ee',
  text: '#f8fafc',
  textMuted: '#64748b',
  border: 'rgba(168,85,247,0.15)',
  glassBg: 'rgba(10,5,25,0.6)',
};

export default function DevHubPage() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<DevPostCardType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const loadPosts = useCallback(async (category?: string) => {
    setLoading(true);
    const [postsData, catsData] = await Promise.all([
      devPostsApi.getAll(category && category !== 'All' ? category : undefined),
      devPostsApi.getCategories(),
    ]);
    setPosts(postsData);
    setCategories(['All', ...catsData]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (mounted) loadPosts(activeCategory === 'All' ? undefined : activeCategory);
  }, [mounted, activeCategory, loadPosts]);

  if (!mounted) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0015 0%, #1a0535 50%, #0a0015 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="h-6 w-48 rounded animate-pulse mb-4" style={{ background: 'rgba(168,85,247,0.2)' }} />
          <div className="h-4 w-72 rounded animate-pulse" style={{ background: 'rgba(168,85,247,0.1)' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0a0015 0%, #120525 40%, #0f0025 70%, #050010 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px]" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px]" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)' }}>
            <Terminal className="w-3.5 h-3.5" style={{ color: C.primary }} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]" style={{ color: C.primary }}>
              Engineering Log
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: C.text }}>
                Dev Sharing{' '}
                <span style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  &amp; Source Code Hub
                </span>
              </h1>
              <p className="text-sm" style={{ color: C.textMuted }}>
                Experience logs, production patterns, and open-source reference implementations.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-2xl font-mono font-bold" style={{ color: C.text }}>{posts.length}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.textMuted }}>Articles</p>
              </div>
              <div className="w-px h-10" style={{ background: C.border }} />
              <div className="text-right">
                <p className="text-2xl font-mono font-bold" style={{ color: C.tertiary }}>
                  {posts.reduce((s, p) => s + p.downloadCount, 0).toLocaleString()}
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.textMuted }}>Total DLs</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Category Filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-200"
              style={{
                background: activeCategory === cat ? `linear-gradient(135deg, ${C.primary}, ${C.secondary})` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeCategory === cat ? 'transparent' : C.border}`,
                color: activeCategory === cat ? '#fff' : C.textMuted,
                boxShadow: activeCategory === cat ? `0 0 16px rgba(168,85,247,0.35)` : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* ── Cards Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: C.glassBg, border: `1px solid ${C.border}`, height: '260px' }}
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(168,85,247,0.1)', border: `1px solid ${C.border}` }}
            >
              <Code2 className="w-8 h-8" style={{ color: `${C.primary}60` }} />
            </div>
            <p className="text-sm font-medium" style={{ color: C.textMuted }}>No articles in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <DevPostCard
                key={post.id}
                post={post}
                index={i}
                onClick={() => setSelectedPostId(post.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      <ClientOnly>
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      </ClientOnly>
    </div>
  );
}
