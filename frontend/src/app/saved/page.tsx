'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark, BookmarkCheck, Folder, Hash, Inbox, Layers,
  Trash2,
} from 'lucide-react';
import { useSocialStore } from '@/store/socialStore';
import { PostCard, PostSkeleton } from '@/components/social/PostCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { SocialPost } from '@/types/social';

/**
 * /saved — Personal Saved Posts page.
 *
 * A tabbed view of the user's bookmarked posts. Tabs are derived
 * from `SocialSave.folder` so any save grouping the user has built
 * up over time appears automatically — no migration needed.
 *
 * Built entirely on top of the existing socialStore + socialApi
 * primitives (loadSaved, loadSaveFolders, toggleSave, unsavePost)
 * so the feed action bar / PostCard continue to work unchanged.
 */
export default function SavedPostsPage() {
  const {
    savedPosts,
    saveFolders,
    isLoadingSaves,
    loadSaved,
    loadSaveFolders,
    unsavePost,
    loadFeed,
  } = useSocialStore();

  // `null` = "Chưa phân loại", string = a named collection,
  // empty-string = "Tất cả" (all saved posts regardless of folder).
  const [activeTab, setActiveTab] = useState<string>('');

  // Hydrate on mount. We fetch both endpoints so the tab bar can
  // show counts and the body has posts to filter.
  useEffect(() => {
    void loadSaveFolders();
    void loadSaved();
  }, [loadSaveFolders, loadSaved]);

  // The store returns saved posts as flat SocialPost[] (already
  // unwrapped from { savedId, post }). We group by folder for the
  // tab counts and to render the active bucket.
  const grouped = useMemo(() => {
    const m = new Map<string, SocialPost[]>();
    m.set('', []); // Tất cả
    m.set('__uncategorized', []); // Chưa phân loại
    for (const f of saveFolders) {
      const key = f.name ?? '__uncategorized';
      if (!m.has(key)) m.set(key, []);
    }
    for (const p of savedPosts) {
      // The post carries its savedFolder (set by the feed) so we
      // can group without re-querying.
      const folder = (p as any)?.savedFolder ?? null;
      const key = folder ?? '__uncategorized';
      m.get(key)?.push(p);
      m.get('')?.push(p);
    }
    return m;
  }, [savedPosts, saveFolders]);

  const visiblePosts = grouped.get(activeTab) ?? [];

  const handleUnsave = async (postId: number): Promise<void> => {
    try {
      await unsavePost(postId);
      toast.success('Đã bỏ lưu');
    } catch {
      toast.error('Bỏ lưu thất bại');
    }
  };

  // Build the tab list. We always pin "Tất cả" first, then
  // "Chưa phân loại" if there are any, then named folders in
  // the order returned by the server (server sorts by count desc).
  type Tab = { key: string; label: string; count: number; icon: any };
  const tabs: Tab[] = [];
  tabs.push({
    key: '',
    label: 'Tất cả',
    count: savedPosts.length,
    icon: Layers,
  });
  if ((grouped.get('__uncategorized')?.length ?? 0) > 0) {
    tabs.push({
      key: '__uncategorized',
      label: 'Chưa phân loại',
      count: grouped.get('__uncategorized')!.length,
      icon: Inbox,
    });
  }
  for (const f of saveFolders) {
    if (!f.name) continue;
    tabs.push({
      key: f.name,
      label: f.name,
      count: f.count,
      icon: Folder,
    });
  }

  return (
    <main
      className="relative mx-auto w-full max-w-3xl px-4 pt-6 pb-24"
      style={{ color: '#e2e8f0' }}
    >
      {/* Page header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)',
            }}
          >
            <Bookmark size={20} style={{ color: '#f59e0b' }} />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-bold text-text-primary">
              Đã lưu
            </h1>
            <p className="text-sm text-text-muted">
              {savedPosts.length === 0
                ? 'Bạn chưa lưu bài viết nào.'
                : `${savedPosts.length} bài viết · ${saveFolders.length} collection`}
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div
          className="mb-5 flex gap-2 overflow-x-auto rounded-2xl p-1.5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all',
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-text-muted hover:bg-white/[0.04] hover:text-text-primary',
                )}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.35), rgba(139,92,246,0.35))',
                      }
                    : undefined
                }
              >
                <Icon size={13} />
                {t.label}
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] tabular-nums',
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'bg-white/[0.04] text-text-muted',
                  )}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Body */}
      {isLoadingSaves ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : visiblePosts.length === 0 ? (
        <EmptyState tab={activeTab} onGoToFeed={() => void loadFeed()} />
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {visiblePosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <PostCard
                  post={post}
                  onToggleSave={() => handleUnsave(post.id)}
                />
                {/* Folder tag chip */}
                {(post as any)?.savedFolder ? (
                  <div
                    className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: 'rgba(245,158,11,0.15)',
                      color: '#fbbf24',
                      border: '1px solid rgba(245,158,11,0.35)',
                    }}
                  >
                    <Hash size={9} />
                    {(post as any).savedFolder}
                  </div>
                ) : null}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}

/**
 * Empty state — different copy depending on whether the user is
 * in "Tất cả" (no saves at all) vs a specific collection that just
 * happens to be empty.
 */
function EmptyState({ tab, onGoToFeed }: { tab: string; onGoToFeed: () => void }) {
  const isAll = tab === '';
  return (
    <div
      className="rounded-3xl px-6 py-16 text-center"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.25)',
        }}
      >
        <BookmarkCheck size={28} className="text-amber-400" />
      </div>
      <h2 className="mb-2 font-heading text-lg font-bold text-text-primary">
        {isAll ? 'Chưa có bài viết đã lưu' : 'Collection trống'}
      </h2>
      <p className="mx-auto mb-5 max-w-sm text-sm text-text-muted">
        {isAll
          ? 'Bấm vào biểu tượng Bookmark trên bất kỳ bài viết nào để lưu lại. Bạn có thể chọn collection hoặc tạo mới ngay tại chỗ.'
          : 'Chưa có bài viết nào trong collection này. Hãy lưu bài viết vào đây từ trang chủ.'}
      </p>
      {isAll && (
        <button
          onClick={onGoToFeed}
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors"
          style={{
            background: 'rgba(139,92,246,0.18)',
            color: '#a78bfa',
            border: '1px solid rgba(139,92,246,0.35)',
          }}
        >
          <Bookmark size={14} />
          Khám phá bài viết
        </button>
      )}
    </div>
  );
}
