'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bookmark, ArrowLeft, X } from 'lucide-react';
import { useSocialStore } from '@/store/socialStore';
import { PostCard } from '@/components/social/PostCard';
import SocialBackground from '@/components/social/SocialBackground';
import SocialSidebar from '@/components/social/SocialSidebar';
import SocialRightWidget from '@/components/social/SocialRightWidget';
import type { SocialPost } from '@/types/social';

/**
 * /social/bookmarks — lists posts the signed-in user has saved.
 * Reuses the shared PostCard so the rendering is identical to the
 * home feed, and wires up an empty state for first-time users.
 */
export default function BookmarksPage() {
  const { savedPosts, loadSaved, isLoadingSaves, unsavePost } = useSocialStore();

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  return (
    <main className="min-h-screen" style={{ background: '#03020c' }}>
      <SocialBackground />
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 50% 0%, rgba(139, 92, 246, 0.06) 0%, transparent 70%), radial-gradient(ellipse 600px 400px at 80% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
          <div className="hidden lg:block">
            <SocialSidebar />
          </div>

          <div className="mx-auto w-full max-w-[680px] min-w-0">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3"
            >
              <Link
                href="/social"
                className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-white/[0.04] hover:text-text-primary"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1
                  className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-3xl font-black tracking-tight text-transparent"
                >
                  Đã lưu
                </h1>
                <p className="mt-1 text-xs" style={{ color: '#64748b' }}>
                  Những bài viết bạn muốn đọc lại sau
                </p>
              </div>
            </motion.div>

            {isLoadingSaves && savedPosts.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-40 animate-pulse rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  />
                ))}
              </div>
            ) : savedPosts.length === 0 ? (
              <EmptyBookmarks />
            ) : (
              <ul className="space-y-4">
                {savedPosts.map((post: SocialPost) => (
                  <li key={post.id} className="relative">
                    <button
                      onClick={() => unsavePost(post.id)}
                      title="Bỏ lưu"
                      className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-red-500/15 hover:text-red-400"
                      style={{
                        background: 'rgba(15,15,25,0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="hidden lg:block">
            <SocialRightWidget />
          </div>
        </div>
      </div>
    </main>
  );
}

function EmptyBookmarks() {
  return (
    <div
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
        <Bookmark className="h-7 w-7" style={{ color: '#a78bfa' }} />
      </div>
      <p className="text-lg font-semibold" style={{ color: '#94a3b8' }}>
        Chưa có bài viết nào được lưu
      </p>
      <p className="mt-1 max-w-xs text-sm" style={{ color: '#475569' }}>
        Bấm vào biểu tượng bookmark ở bài viết bất kỳ để lưu lại đọc sau.
      </p>
      <Link
        href="/social"
        className="mt-5 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
        style={{
          background: 'rgba(139, 92, 246, 0.15)',
          color: '#a78bfa',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        Khám phá feed
      </Link>
    </div>
  );
}
