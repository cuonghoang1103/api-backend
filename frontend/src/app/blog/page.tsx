'use client';

import BlogCard from '@/components/blog/BlogCard';
import BlogPostDetailModal from '@/components/blog/BlogPostDetailModal';
import ParticleGridBackground from '@/components/blog/ParticleGridBackground';
import ClientOnly from '@/components/providers/ClientOnly';
import { blogApi } from '@/lib/api';
import type { Category, PostCard } from '@/types';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, FileText, Layers, Search, X, Zap } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

const ALL_TAGS = ['JavaScript', 'React', 'TypeScript', 'Next.js', 'Spring Boot', 'AI', 'Node.js', 'Python', 'CSS', 'Docker', 'PostgreSQL', 'DevOps'];

function HeroSection() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Glowing accent orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px]"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(60px)',
            animation: 'float1 8s ease-in-out infinite',
          }}
        />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px]"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
            transform: 'translate(50%, 50%)',
            filter: 'blur(60px)',
            animation: 'float2 10s ease-in-out infinite',
          }}
        />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px]"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(80px)',
            animation: 'float3 12s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow: '0 0 30px rgba(139,92,246,0.1)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6' }} />
            <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: '#8b5cf6' }}>
              Engineering Knowledge Base
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold leading-tight">
            <span style={{ color: '#f8fafc' }}>Experience </span>
            <span
              className="relative"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Log
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, #8b5cf6, #ec4899, transparent)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8 }}              
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#94a3b8' }}>
            Production patterns, open-source implementations, and technical deep-dives from the engineering trenches.
          </p>

          {/* Tech stack pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {['Next.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AI'].map((tech) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + Math.random() * 0.3 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748b',
                }}
              >
                <Cpu className="w-3 h-3" style={{ color: '#8b5cf6' }} />
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-40px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(50%, 50%) translateY(0px); }
          50% { transform: translate(50%, 50%) translateY(30px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </section>
  );
}

function BlogContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  const [posts, setPosts] = useState<PostCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const pageSize = 9;

  const fetchCategories = useCallback(async () => {
    try {
      const response = await blogApi.getCategories();
      setCategories(response.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, unknown> = { page: currentPage, size: pageSize };
      if (categorySlug) params.category = categorySlug;
      if (searchKeyword) params.keyword = searchKeyword;

      const response = await blogApi.getPosts(params as Parameters<typeof blogApi.getPosts>[0]);
      const postsData = Array.isArray(response.data?.data) ? response.data.data : [];
      const pagination = response.data?.pagination;
      let filteredPosts = postsData;

      if (selectedTags.length > 0) {
        filteredPosts = filteredPosts.filter((post: PostCard) => {
          const postTags = (post as any).tagNames || [];
          return selectedTags.some(tag =>
            postTags.some((pt: string) => pt.toLowerCase() === tag.toLowerCase())
          );
        });
      }

      setPosts(filteredPosts);
      setTotalPages(pagination?.totalPages || 1);
      setTotalElements(pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Unable to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, categorySlug, searchKeyword, selectedTags]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { setCurrentPage(1); fetchPosts(); }, [fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const hasActiveFilters = searchKeyword || selectedTags.length > 0;

  return (
    <>
      {/* Search & Filters */}
      <section
        className="sticky top-[var(--app-nav-h)] z-30 border-b"
        style={{
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: 'rgba(139,92,246,0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl text-sm"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(139,92,246,0.15)',
                  color: '#f8fafc',
                  outline: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              {searchKeyword && (
                <button type="button" onClick={() => { setSearchKeyword(''); fetchPosts(); }}
                  className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center transition-colors"
                  style={{ color: '#64748b' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f8fafc'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b'; }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 0 20px rgba(139,92,246,0.3)',
              }}
            >
              Search
            </motion.button>
          </form>

          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <span className="text-xs shrink-0 font-mono" style={{ color: '#64748b' }}>
              <Zap className="w-3 h-3 inline mr-1" style={{ color: '#ec4899' }} />
              Tags:
            </span>
            {ALL_TAGS.map(tag => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTagToggle(tag)}
                className="shrink-0 px-3 py-1 min-h-[36px] rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: selectedTags.includes(tag)
                    ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedTags.includes(tag) ? 'transparent' : 'rgba(139,92,246,0.15)'}`,
                  color: selectedTags.includes(tag) ? '#fff' : '#64748b',
                  boxShadow: selectedTags.includes(tag) ? '0 0 16px rgba(139,92,246,0.35)' : 'none',
                }}
              >
                #{tag}
              </motion.button>
            ))}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={clearFilters}
                className="shrink-0 px-3 py-1 text-xs transition-colors"
                style={{ color: '#f87171' }}
              >
                Clear all
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* Category banner */}
      {activeCategory && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono" style={{ color: '#64748b' }}>Browsing:</span>
            <span
              className="px-3 py-1 text-sm font-medium rounded-lg"
              style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.25)' }}
            >
              {activeCategory.name}
            </span>
            <a href="/blog" className="text-xs transition-colors" style={{ color: '#64748b' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#8b5cf6'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b'; }}>
              Clear
            </a>
          </div>
          {activeCategory.description && <p className="text-sm mb-6" style={{ color: '#64748b' }}>{activeCategory.description}</p>}
        </div>
      )}

      {/* Results count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-mono" style={{ color: '#64748b' }}>
            {totalElements > 0 ? `${totalElements} article${totalElements > 1 ? 's' : ''} found` : 'No posts found'}
          </p>
          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: '#64748b' }}>
            <Layers className="w-3.5 h-3.5" />
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden border"
                style={{
                  background: 'rgba(15,15,20,0.7)',
                  borderColor: 'rgba(139,92,246,0.1)',
                  height: '340px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center py-12">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <FileText className="w-8 h-8" style={{ color: '#f87171' }} />
          </div>
          <p className="mb-4" style={{ color: '#94a3b8' }}>{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchPosts}
            className="px-6 py-2.5 rounded-xl transition-colors"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.25)' }}
          >
            Try Again
          </motion.button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && posts.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl border"
            style={{
              background: 'rgba(15,15,20,0.5)',
              borderColor: 'rgba(139,92,246,0.1)',
            }}
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: 'rgba(139,92,246,0.1)' }}
            >
              <FileText className="w-8 h-8" style={{ color: '#64748b' }} />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2" style={{ color: '#f8fafc' }}>
              {hasActiveFilters ? 'No posts match your filters' : 'No blog posts yet'}
            </h3>
            <p className="mb-6" style={{ color: '#64748b' }}>
              {hasActiveFilters ? 'Try adjusting your search or category filters.' : 'Check back soon for new articles and tutorials.'}
            </p>
            {hasActiveFilters && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-xl font-medium transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                }}
              >
                Clear Filters
              </motion.button>
            )}
          </motion.div>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && !error && posts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <BlogCard
                key={post.id}
                post={post}
                index={i}
                onCardClick={post.sourceUrl ? () => setSelectedPostId(post.id) : undefined}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(139,92,246,0.15)',
                  color: '#94a3b8',
                }}
              >
                Previous
              </motion.button>

              <div className="flex items-center gap-1">
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const page = i + 1;
                  const isActive = currentPage === page;
                  return (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10 rounded-xl text-sm font-medium transition-all"
                      style={
                        isActive
                          ? {
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              color: '#fff',
                              boxShadow: '0 0 20px rgba(139,92,246,0.35)',
                            }
                          : {
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(139,92,246,0.15)',
                              color: '#94a3b8',
                            }
                      }
                    >
                      {page}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(139,92,246,0.15)',
                  color: '#94a3b8',
                }}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      )}

      {/* Post Detail Modal */}
      <ClientOnly>
        <BlogPostDetailModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} />
      </ClientOnly>
    </>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Particle Grid Background */}
      <ParticleGridBackground />

      {/* Content layer */}
      <div className="relative z-10">
        <HeroSection />
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-darkcard rounded-2xl overflow-hidden border border-darkborder/50 h-[320px]" />
                </div>
              ))}
            </div>
          </div>
        }>
          <BlogContent />
        </Suspense>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
