'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Terminal, Loader2, TerminalSquare, Database, Cpu, Zap, Package, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';
import ClientOnly from '@/components/providers/ClientOnly';
import DevPostCard from '@/components/dev-hub/DevPostCard';
import PostDetailModal from '@/components/dev-hub/PostDetailModal';
import { devPostsApi } from '@/lib/api/devPosts';
import type { DevPostCard as DevPostCardType } from '@/types/devPost';
import DevHubBackground from '@/components/dev-hub/DevHubBackground';

const C = {
  primary: '#a855f7',
  secondary: '#ec4899',
  tertiary: '#22d3ee',
  text: '#f8fafc',
  textMuted: '#64748b',
  border: 'rgba(168,85,247,0.15)',
  glassBg: 'rgba(10,5,25,0.6)',
};

const TECH_ICONS: Record<string, React.ElementType> = {
  TypeScript: Cpu,
  JavaScript: TerminalSquare,
  React: Package,
  Next: Package,
  PostgreSQL: Database,
  Docker: Package,
  AI: Zap,
  Default: Code2,
};

function HeroSection({ postCount, totalDownloads }: { postCount: number; totalDownloads: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12"
    >
      {/* Label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
        style={{
          background: 'rgba(168,85,247,0.08)',
          border: '1px solid rgba(168,85,247,0.2)',
          boxShadow: '0 0 30px rgba(168,85,247,0.06)',
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#a855f7', boxShadow: '0 0 8px #a855f7' }}
        />
        <Terminal className="w-3.5 h-3.5" style={{ color: C.primary }} />
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]" style={{ color: C.primary }}>
          Engineering Log // Live
        </span>
      </motion.div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
            <span style={{ color: C.text }}>Dev Sharing </span>
            <span
              style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              &amp; Source Code Hub
            </span>
          </h1>
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: C.textMuted }}>
            Experience logs, production patterns, and open-source reference implementations crafted from real engineering challenges.
          </p>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['Next.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AI', 'React'].map((tech, i) => {
              const Icon = TECH_ICONS[tech] || TECH_ICONS.Default;
              return (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: '#64748b',
                  }}
                >
                  <Icon className="w-3 h-3" style={{ color: '#a855f7' }} />
                  {tech}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats panel */}
        <div className="flex items-center gap-6 shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-right"
          >
            <p className="text-3xl font-mono font-bold" style={{ color: C.text }}>
              {postCount.toLocaleString()}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.textMuted }}>
              Articles
            </p>
          </motion.div>
          <div className="w-px h-12" style={{ background: C.border }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-right"
          >
            <p className="text-3xl font-mono font-bold" style={{ color: C.tertiary }}>
              {totalDownloads.toLocaleString()}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.textMuted }}>
              Total DLs
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DevHubPage() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<DevPostCardType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  // Sidebar collapse state — persisted to localStorage so it survives
  // navigation. Defaults to OPEN so first-time visitors see the categories.
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dev-hub-sidebar-open');
      if (saved !== null) setSidebarOpen(saved !== 'false');
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('dev-hub-sidebar-open', String(sidebarOpen)); } catch { /* ignore */ }
  }, [sidebarOpen]);

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

  const totalDownloads = posts.reduce((s, p) => s + p.downloadCount, 0);

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
        background: 'linear-gradient(135deg, #0a0015 0%, #0f0020 40%, #08001a 70%, #050010 100%)',
      }}
    >
      {/* Matrix Data Stream Background */}
      <DevHubBackground />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        <div
          className="absolute top-0 left-1/4 w-[700px] h-[700px]"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px]"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.03) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <HeroSection postCount={posts.length} totalDownloads={totalDownloads} />

        <div className="flex gap-6 items-start">
          {/* Sidebar — vertical category list with collapse toggle */}
          <motion.aside
            initial={false}
            animate={{ width: sidebarOpen ? 240 : 56 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="shrink-0 sticky top-24 self-start hidden md:block"
          >
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: 'rgba(10,5,25,0.5)',
                borderColor: 'rgba(168,85,247,0.15)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Header — always visible so the toggle is reachable when collapsed */}
              <div className="flex items-center justify-between px-3 py-3 border-b" style={{ borderColor: 'rgba(168,85,247,0.1)' }}>
                <AnimatePresence mode="wait" initial={false}>
                  {sidebarOpen ? (
                    <motion.div
                      key="header-open"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <FolderOpen className="w-4 h-4 shrink-0" style={{ color: C.primary }} />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: C.text }}>
                        Categories
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="header-closed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <FolderOpen className="w-4 h-4 shrink-0" style={{ color: C.primary }} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setSidebarOpen((v) => !v)}
                  className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                  style={{ color: C.textMuted }}
                  title={sidebarOpen ? 'Thu gọn' : 'Mở rộng'}
                  aria-label={sidebarOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
                >
                  {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>

              {/* Category list */}
              <AnimatePresence initial={false}>
                {sidebarOpen && (
                  <motion.ul
                    key="cat-list"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 space-y-1"
                  >
                    {categories.map((cat) => {
                      const active = activeCategory === cat;
                      return (
                        <li key={cat}>
                          <button
                            type="button"
                            onClick={() => setActiveCategory(cat)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all duration-200 flex items-center gap-2 ${
                              active ? 'shadow-md' : 'hover:bg-white/5'
                            }`}
                            style={{
                              background: active
                                ? `linear-gradient(135deg, ${C.primary}, ${C.secondary})`
                                : 'transparent',
                              color: active ? '#fff' : C.textMuted,
                              boxShadow: active ? `0 0 16px rgba(168,85,247,0.35)` : 'none',
                            }}
                          >
                            <Code2 className="w-3 h-3 shrink-0" />
                            <span className="truncate">{cat}</span>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>

          {/* Content — fills remaining space; width changes when sidebar collapses */}
          <div className="flex-1 min-w-0">
            {/* Loading */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl overflow-hidden border"
                    style={{
                      background: C.glassBg,
                      borderColor: C.border,
                      height: '260px',
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                ))}
              </div>
            ) : posts.length === 0 ? (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-4 rounded-2xl border"
                style={{
                  background: 'rgba(10,5,25,0.5)',
                  borderColor: 'rgba(168,85,247,0.08)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(168,85,247,0.08)', border: `1px solid ${C.border}` }}
                >
                  <Code2 className="w-8 h-8" style={{ color: `${C.primary}50` }} />
                </div>
                <p className="text-sm font-medium" style={{ color: C.textMuted }}>
                  No articles in this category yet.
                </p>
              </motion.div>
            ) : (
              /* Cards Grid */
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
        </div>
      </div>

      {/* Post Detail Modal */}
      <ClientOnly>
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      </ClientOnly>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
