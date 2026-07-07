'use client';

/**
 * /saved — Personal Saved Posts page (v2 — multi-collection).
 *
 * Tabbed view of the user's bookmarked posts. Tabs are derived
 * from the `FeedCollection` table (real multi-folder model).
 *
 * Each tab fetches its own page of saved posts from
 * `/feed/collections/:id/posts`. We re-use `PostCard` so the
 * action bar / like / comment / share / save flows stay 100%
 * identical to the feed.
 *
 * Why a new component instead of mutating the legacy one: the
 * legacy page relied on `SocialSave.folder` (single string).
 * The new contract is id-based so the two flows can't share
 * one render path. We keep the legacy export on disk in case
 * external bookmarks still point at the old behaviour — but
 * we wire `/saved` to the new component via this file.
 */

import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark, BookmarkCheck, Folder, Hash, Inbox, Layers,
  Plus, Trash2, Loader2, RefreshCw,
} from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { socialApi } from '@/lib/api';
import { PostCard, PostSkeleton } from '@/components/social/PostCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { FeedCollection, SocialPost } from '@/types/social';
import { socialKeys } from '@/hooks/useSocialQueries';

// ─── Tab keys ─────────────────────────────────────────────────────
//
// `null`  → all (the user is just browsing every saved post)
// `0`     → uncategorized bucket (legacy saves w/o folder)
// `N>0`   → specific collection id

const ALL_TAB: number | null = null;
const UNCATEGORISED_TAB = 0 as const;

export default function SavedPostsPage() {
  const qc = useQueryClient();
  // The currently selected tab id. `null` = All.
  const [activeTab, setActiveTab] = useState<number | null>(ALL_TAB);
  // Track which tabs the user has visited so we lazy-load the
  // active tab's posts the first time it's selected.
  const [visitedTabs, setVisitedTabs] = useState<Set<number>>(new Set([ALL_TAB as any]));

  // ── Collections list (always loaded) ────────────────────────
  const collectionsQuery = useQuery({
    queryKey: [...socialKeys.all, 'collections'] as const,
    queryFn: () => socialApi.listCollectionsV2().then((r: any) => r.data.data as {
      collections: FeedCollection[];
      uncategorized: number;
      total: number;
    }),
    staleTime: 30_000,
  });
  const collections = collectionsQuery.data?.collections ?? [];
  const uncategorizedCount = collectionsQuery.data?.uncategorized ?? 0;
  const totalSaved = collectionsQuery.data?.total ?? 0;

  // ── Active tab content ───────────────────────────────────────
  const activeQuery = useQuery({
    queryKey: [...socialKeys.all, 'collection-posts', activeTab] as const,
    queryFn: async () => {
      const r = await socialApi.listSavedPostsInCollection(
        activeTab === UNCATEGORISED_TAB ? null : activeTab,
        { limit: 20 },
      );
      return (r as any).data.data as {
        items: Array<{ saveId: number; savedAt: string; post: SocialPost }>;
        nextCursor: number | null;
      };
    },
    enabled: activeTab !== null && visitedTabs.has(activeTab as any),
    // Always refetch when the user switches tab so they see the latest
    // posts with full media (the API fix added media serialization).
    staleTime: 0,
  });

  // When the user switches tab, mark it visited so the query
  // fetches. We mark BEFORE the switch so a click triggers the
  // fetch immediately.
  const selectTab = useCallback((id: number | null) => {
    setVisitedTabs((prev) => {
      const next = new Set(prev);
      next.add(id as any);
      return next;
    });
    setActiveTab(id);
  }, []);

  // ── Delete collection ────────────────────────────────────────
  const deleteCollection = useMutation({
    mutationFn: (id: number) => socialApi.deleteCollectionV2(id),
    onMutate: async (id) => {
      // Optimistic remove from local list.
      const prev = collections;
      qc.setQueryData([...socialKeys.all, 'collections'], (old: any) =>
        old ? { ...old, collections: old.collections.filter((c: any) => c.id !== id) } : old,
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData([...socialKeys.all, 'collections'], ctx.prev as any);
      toast.error('Xoá thất bại');
    },
    onSuccess: () => {
      toast.success('Đã xoá bộ sưu tập');
      // If we deleted the active tab, jump back to All.
      if (activeTab !== null && !isNaN(activeTab as any) && activeTab !== UNCATEGORISED_TAB) {
        setActiveTab(ALL_TAB);
      }
      // Refresh the active tab's post list (the deleted posts
      // may still be in the local cache).
      qc.invalidateQueries({ queryKey: [...socialKeys.all, 'collection-posts'] });
    },
  });

  // Build tab list. We always pin "Tất cả" first, then
  // "Chưa phân loại" if non-zero, then user collections.
  type Tab = { key: number | null; label: string; count: number; icon: any };
  const tabs: Tab[] = [
    { key: ALL_TAB, label: 'Tất cả', count: totalSaved, icon: Layers },
  ];
  if (uncategorizedCount > 0) {
    tabs.push({
      key: UNCATEGORISED_TAB,
      label: 'Chưa phân loại',
      count: uncategorizedCount,
      icon: Inbox,
    });
  }
  for (const c of collections) {
    tabs.push({
      key: c.id,
      label: c.name,
      count: c.count,
      icon: c.icon ? (() => <span>{c.icon}</span>) as any : Folder,
    });
  }

  const items = activeQuery.data?.items ?? [];
  const isLoadingActive = activeQuery.isLoading && activeQuery.isFetching;

  return (
    <main
      className="relative mx-auto w-full max-w-3xl px-4 pt-24 pb-24"
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
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-2xl font-bold text-text-primary">
              Đã lưu
            </h1>
            <p className="text-sm text-text-muted">
              {totalSaved === 0
                ? 'Bạn chưa lưu bài viết nào.'
                : `${totalSaved} bài viết · ${collections.length} bộ sưu tập`}
            </p>
          </div>
          {/* Inline create collection */}
          <div className="flex items-center gap-2">
            {/* Refresh to bust old TQ cache */}
            <button
              onClick={() => {
                qc.invalidateQueries({ queryKey: [...socialKeys.all, 'collection-posts'] });
                qc.invalidateQueries({ queryKey: [...socialKeys.all, 'collections'] });
              }}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              title="Làm mới"
            >
              <RefreshCw size={14} />
            </button>
            <NewCollectionButton onCreated={(c) => {
              qc.setQueryData([...socialKeys.all, 'collections'], (old: any) =>
                old ? { ...old, collections: [...old.collections, c] } : old,
              );
              selectTab(c.id);
            }} />
          </div>
        </div>
      </header>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div
          className="mb-5 flex gap-1.5 overflow-x-auto rounded-2xl p-1.5"
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
                key={String(t.key)}
                onClick={() => selectTab(t.key)}
                className={cn(
                  'relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-muted hover:bg-white/[0.04] hover:text-text-secondary',
                )}
                style={
                  isActive
                    ? {
                        background: 'rgba(245,158,11,0.15)',
                        border: '1px solid rgba(245,158,11,0.35)',
                        boxShadow: '0 0 0 1px rgba(245,158,11,0.2), 0 4px 16px rgba(245,158,11,0.18)',
                      }
                    : { border: '1px solid transparent' }
                }
              >
                {typeof Icon === 'function' && Icon.length ? <Icon size={14} /> : <Icon size={14} />}
                <span>{t.label}</span>
                <span
                  className="rounded-full px-1.5 text-[10px] tabular-nums"
                  style={{
                    background: isActive ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#fcd34d' : '#94a3b8',
                  }}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active collection toolbar (delete) */}
      {activeTab !== null && activeTab !== UNCATEGORISED_TAB && activeTab !== ALL_TAB && (
        <div className="mb-4 flex items-center justify-end">
          <button
            onClick={() => {
              const c = collections.find((x) => x.id === activeTab);
              if (!c) return;
              if (confirm(`Xoá bộ sưu tập "${c.name}"? Các bài viết lưu trong đó sẽ được giữ nguyên ở tab "Tất cả".`)) {
                deleteCollection.mutate(c.id);
              }
            }}
            disabled={deleteCollection.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 size={12} />
            Xoá bộ sưu tập này
          </button>
        </div>
      )}

      {/* Body */}
      {totalSaved === 0 ? (
        <EmptyState />
      ) : isLoadingActive ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState hint="Chưa có bài viết nào trong bộ sưu tập này." />
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((it, index) => (
              <motion.div
                key={it.saveId}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index < 5 ? index * 0.04 : 0 }}
              >
                <PostCard
                  post={it.post}
                  onDelete={async (postId) => {
                    // The card has its own delete optimistic
                    // update; we just need to make sure the
                    // current tab refreshes too.
                    await socialApi.unsavePost(postId).catch(() => null);
                    qc.invalidateQueries({ queryKey: [...socialKeys.all, 'collection-posts'] });
                    qc.invalidateQueries({ queryKey: [...socialKeys.all, 'collections'] });
                  }}
                  onToggleSave={async (postId) => {
                    // The card handles the cache patch. We
                    // additionally invalidate THIS page's
                    // collection tab so the saved post
                    // disappears on refresh.
                    await socialApi.unsavePost(postId).catch(() => null);
                    qc.invalidateQueries({ queryKey: [...socialKeys.all, 'collection-posts'] });
                    qc.invalidateQueries({ queryKey: [...socialKeys.all, 'collections'] });
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

function EmptyState({ hint }: { hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.02] px-6 py-16 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: 'rgba(245,158,11,0.12)',
          border: '1px solid rgba(245,158,11,0.3)',
        }}
      >
        <BookmarkCheck size={28} style={{ color: '#f59e0b' }} />
      </div>
      <h2 className="text-base font-semibold text-text-primary">
        Chưa có gì ở đây
      </h2>
      <p className="mt-1 max-w-sm text-sm text-text-muted">
        {hint ?? 'Lưu bài viết từ trang Feed bằng cách nhấn vào biểu tượng bookmark. Bạn có thể phân loại vào nhiều bộ sưu tập khác nhau.'}
      </p>
    </div>
  );
}

function NewCollectionButton({ onCreated }: { onCreated: (c: FeedCollection) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    try {
      const res = await socialApi.createCollectionV2(trimmed);
      const created = (res as any)?.data?.data as FeedCollection | undefined;
      if (created) {
        onCreated(created);
        setName('');
        setOpen(false);
        toast.success(`Đã tạo "${created.name}"`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Tạo thất bại');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all"
        style={{
          background: 'rgba(139,92,246,0.15)',
          color: '#c4b5fd',
          border: '1px solid rgba(139,92,246,0.3)',
        }}
      >
        <Plus size={14} />
        Bộ sưu tập mới
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-2xl p-3"
              style={{
                background: 'rgba(15,15,25,0.96)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-text-muted">
                Tên bộ sưu tập
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void submit();
                  } else if (e.key === 'Escape') {
                    setOpen(false);
                  }
                }}
                autoFocus
                maxLength={80}
                placeholder="Gaming, Tài liệu, ..."
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted/60 transition-colors focus:border-violet-400/50"
              />
              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2.5 py-1.5 text-xs text-text-muted hover:bg-white/5 hover:text-text-secondary"
                >
                  Huỷ
                </button>
                <button
                  onClick={() => void submit()}
                  disabled={!name.trim() || busy}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-40"
                  style={{
                    background: 'rgba(139,92,246,0.25)',
                    color: '#c4b5fd',
                    border: '1px solid rgba(139,92,246,0.4)',
                  }}
                >
                  {busy ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                  Tạo
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
