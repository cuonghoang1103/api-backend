'use client';

/**
 * SocialSavePopoverV2 (added 2026-06-20)
 * ======================================
 *
 * Multi-folder "Lưu vào bộ sưu tập" popover anchored to the
 * bookmark icon on a PostCard. Powered by the new
 * FeedCollection + FeedSavedPost tables on the backend.
 *
 * Differences from the legacy single-folder popover:
 *   - Posts can be saved into MULTIPLE collections at once.
 *   - The user picks a *set* of collections via checkboxes.
 *   - "Create new" runs against the new POST /feed/collections
 *     endpoint which returns the new row's id, then commits
 *     the save immediately into it.
 *   - "Bỏ lưu" clears ALL memberships for the (post, user)
 *     pair (sets collectionIds to []).
 *
 * Renders via a React portal into document.body so it escapes
 * any parent stacking context. SSR-safe — the whole component
 * returns null until mounted on the client.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bookmark, BookmarkCheck, FolderPlus, Check, X, Loader2,
} from 'lucide-react';
import { socialApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { FeedCollection, FeedPostSaveContext } from '@/types/social';

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const NEON_AMBER = '#f59e0b';

export interface SocialSavePopoverV2Props {
  postId: number;
  /** The collections owned by this user. */
  collections: FeedCollection[];
  /** The pre-ticked state for this post. */
  context: FeedPostSaveContext | null;
  /** Whether anything is loading (parent OR popover). */
  loading?: boolean;
  /** Called when the user toggles checkboxes / commits. The
   *  parent (PostCard) hits the new `/feed/save-post-v2` route
   *  + patches the Query cache + Zustand store. The popover
   *  doesn't own the network call directly — it owns UX only. */
  onCommit: (collectionIds: number[]) => Promise<void>;
  /** Inline-create trigger. The parent decides whether to
   *  optimistically prepend the new collection into the list
   *  and re-render the popover with the freshly created row
   *  ticked. */
  onCreateCollection: (name: string) => Promise<FeedCollection | null>;
  anchorRef: React.RefObject<HTMLElement>;
  open: boolean;
  onClose: () => void;
}

export default function SocialSavePopoverV2({
  postId,
  collections,
  context,
  loading = false,
  onCommit,
  onCreateCollection,
  anchorRef,
  open,
  onClose,
}: SocialSavePopoverV2Props) {
  // The IDs currently ticked. Initialised from `context`. We
  // track it as a Set for O(1) toggle + easy "isX" lookup.
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(context?.collectionIds ?? []),
  );
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Track mount so SSR can skip the portal.
  useEffect(() => { setMounted(true); }, []);

  // Re-sync selected set whenever the popover opens OR the
  // context changes (e.g. parent re-fetched after a save).
  useEffect(() => {
    if (open) {
      setSelectedIds(new Set(context?.collectionIds ?? []));
    }
  }, [open, context]);

  // Position the popover relative to the trigger button. We
  // recompute on scroll/resize so it stays glued to it.
  useIsoLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const compute = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = 288;
      const margin = 8;
      const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
      const preferredTop = rect.bottom + margin;
      // Flip above if there's not enough room below.
      const top = preferredTop + 380 > viewportH
        ? Math.max(margin, rect.top - 380 - margin)
        : preferredTop;
      setPos({
        top,
        left: Math.max(margin, Math.min(window.innerWidth - width - margin, rect.right - width)),
      });
    };
    compute();
    window.addEventListener('scroll', compute, true);
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute, true);
      window.removeEventListener('resize', compute);
    };
  }, [open, anchorRef]);

  // Escape closes the popover.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // ── Toggle one row. Optimistic UI flip + commit. ──────────────
  const toggleCollection = async (id: number) => {
    if (busy) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
    setBusy(true);
    try {
      await onCommit(Array.from(next));
    } catch (err: any) {
      // Rollback on error.
      setSelectedIds(new Set(selectedIds));
      toast.error(err?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setBusy(false);
    }
  };

  // ── Inline create + tick + commit. ───────────────────────────
  const handleCreate = async () => {
    const name = newName.trim();
    if (!name || busy) return;
    if (name.length > 80) {
      toast.error('Tên tối đa 80 ký tự');
      return;
    }
    setBusy(true);
    try {
      const created = await onCreateCollection(name);
      if (!created) return; // parent already toasted the error
      const next = new Set(selectedIds);
      next.add(created.id);
      setSelectedIds(next);
      setNewName('');
      await onCommit(Array.from(next));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Tạo bộ sưu tập thất bại');
    } finally {
      setBusy(false);
    }
  };

  // ── "Bỏ lưu" — clear ALL memberships for this post. ────────
  const handleUnsave = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onCommit([]);
      setSelectedIds(new Set());
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Bỏ lưu thất bại');
    } finally {
      setBusy(false);
    }
  };

  if (!mounted) return null;
  // postId is referenced via prop typing; the lint rule wants
  // a no-op usage here.
  void postId;

  return createPortal(
    <AnimatePresence>
      {open && pos && (
        <>
          <div
            className="fixed inset-0"
            style={{ zIndex: 9998 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.32, 0.94, 0.6, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              zIndex: 9999,
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-light)',
            }}
            className="w-72 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid var(--border-light)' }}
            >
              <div className="flex items-center gap-2">
                {selectedIds.size > 0 ? (
                  <BookmarkCheck size={16} style={{ color: NEON_AMBER }} />
                ) : (
                  <Bookmark size={16} style={{ color: 'var(--text-muted)' }} />
                )}
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {selectedIds.size > 0
                    ? `Đã lưu (${selectedIds.size})`
                    : 'Lưu vào bộ sưu tập'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-surface-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
                title="Đóng"
              >
                <X size={14} />
              </button>
            </div>

            {/* Collections list */}
            <div className="max-h-64 overflow-y-auto py-1.5">
              {loading && collections.length === 0 && (
                <div className="flex items-center gap-2 px-4 py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Loader2 size={12} className="animate-spin" />
                  Đang tải...
                </div>
              )}
              {!loading && collections.length === 0 && (
                <p className="px-4 py-3 text-xs italic" style={{ color: 'var(--text-muted)' }}>
                  Bạn chưa có bộ sưu tập nào. Tạo mới bên dưới.
                </p>
              )}
              {collections.map((c) => {
                const isSelected = selectedIds.has(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCollection(c.id)}
                    disabled={busy}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors',
                      'hover:bg-white/[0.04]',
                      isSelected ? 'text-text-primary' : 'text-text-secondary',
                    )}
                  >
                    <motion.span
                      animate={isSelected ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                      transition={{ duration: 0.22, ease: [0.32, 0.94, 0.6, 1] }}
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-colors',
                        isSelected
                          ? 'border-transparent'
                          : 'border-white/20 bg-transparent',
                      )}
                      style={
                        isSelected
                          ? { background: NEON_AMBER, color: '#0d0f18' }
                          : undefined
                      }
                    >
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </motion.span>
                    <span className="flex-1 truncate">
                      {c.icon ? <span className="mr-1.5">{c.icon}</span> : null}
                      {c.name}
                    </span>
                    <span className="shrink-0 rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] tabular-nums text-text-muted">
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Inline create */}
            <div className="border-t border-white/[0.06] px-4 py-3">
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-text-muted">
                + Tạo bộ sưu tập mới
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void handleCreate();
                    }
                  }}
                  maxLength={80}
                  placeholder="Gaming, Tài liệu, ..."
                  disabled={busy}
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-text-primary outline-none placeholder:text-text-muted/60 transition-colors focus:border-amber-400/50"
                />
                <button
                  onClick={() => void handleCreate()}
                  disabled={busy || !newName.trim()}
                  className="flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium transition-all disabled:opacity-40"
                  style={{
                    background: 'rgba(245,158,11,0.18)',
                    color: NEON_AMBER,
                    border: '1px solid rgba(245,158,11,0.35)',
                  }}
                  title="Tạo và lưu vào đây"
                >
                  {busy ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <FolderPlus size={12} />
                  )}
                  Lưu
                </button>
              </div>
            </div>

            {/* Footer — unsave if anything ticked */}
            {selectedIds.size > 0 && (
              <div className="border-t border-white/[0.06] px-2 py-2">
                <button
                  onClick={() => void handleUnsave()}
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-40"
                >
                  <Bookmark size={12} />
                  Bỏ lưu khỏi tất cả
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
