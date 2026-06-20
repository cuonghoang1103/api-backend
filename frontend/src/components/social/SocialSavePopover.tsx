'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bookmark, BookmarkCheck, FolderPlus, Check, X, Loader2,
} from 'lucide-react';
import { socialApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface SaveCollection {
  name: string | null;
  count: number;
}

interface SocialSavePopoverProps {
  postId: number;
  // The folder name currently associated with this save, if any.
  // null = uncategorised. undefined = not saved at all.
  currentFolder?: string | null;
  isSaved: boolean;
  // Existing collections the user has used before. Fed in by the
  // parent so we don't re-fetch on every PostCard.
  collections: SaveCollection[];
  // Called whenever the user confirms a save/unsave from inside the
  // popover. The parent (PostCard) is responsible for calling
  // `toggleSave()` or refreshing its `isSaved` state — we keep this
  // component stateless w.r.t. the network to stay composable.
  onCommit: (folder: string | null, remove: boolean) => Promise<void> | void;
  // Trigger button ref — we measure this to position the popover.
  anchorRef: React.RefObject<HTMLElement>;
  open: boolean;
  onClose: () => void;
}

const NEON_AMBER = '#f59e0b';

/**
 * "Save to collection" popover anchored to the bookmark icon on a
 * PostCard. Renders via a React portal into document.body so it
 * escapes any stacking context, transform or overflow on the page
 * (this was the bug that bit the Hub action menu — same fix).
 *
 * Inside the popover:
 *   - A list of existing collections with checkboxes. Ticking
 *     auto-commits (debounced through `onCommit`).
 *   - An inline "Tạo collection mới" row to create + save in one step.
 *   - A "Bỏ lưu" button at the bottom for the unsave action.
 */
export default function SocialSavePopover({
  postId,
  currentFolder,
  isSaved,
  collections,
  onCommit,
  anchorRef,
  open,
  onClose,
}: SocialSavePopoverProps) {
  // Local "selected" state — the collection name the user has picked
  // in this session. Null = the uncategorised bucket.
  const [selected, setSelected] = useState<string | null>(
    isSaved ? (currentFolder ?? null) : null,
  );
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Track mount so we can SSR-skip the portal without hydration
  // mismatches. The whole popover is interactive-only, no SSR use.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync `selected` whenever the popover re-opens, so the previously
  // committed folder is re-checked. We don't reset on close because
  // that would cause flicker if the user just toggles quickly.
  useEffect(() => {
    if (open) {
      setSelected(isSaved ? (currentFolder ?? null) : null);
    }
  }, [open, isSaved, currentFolder]);

  // Position the popover using viewport coordinates. Recompute on
  // scroll/resize so it stays anchored to the trigger button.
  useIsoLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const compute = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Width is fixed (w-72 = 288px). Right-align to button.
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

  if (!mounted) return null;

  /**
   * Toggling a checkbox: we commit immediately so the user sees
   * the orange dot fill in. The parent decides whether to call
   * the legacy toggleSave() or the new /feed/save-post endpoint.
   */
  const pickCollection = async (name: string | null) => {
    if (busy) return;
    setBusy(true);
    try {
      await onCommit(name, false);
      setSelected(name);
    } catch (err: any) {
      toast.error('Lưu thất bại');
    } finally {
      setBusy(false);
    }
  };

  const handleUnsave = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onCommit(null, true);
      setSelected(null);
      onClose();
    } catch {
      toast.error('Bỏ lưu thất bại');
    } finally {
      setBusy(false);
    }
  };

  /**
   * "Tạo collection mới" — validate, then call the new
   * POST /feed/collections endpoint to register the name, then
   * commit the save into that collection.
   */
  const handleCreate = async () => {
    const name = newName.trim();
    if (!name || busy) return;
    if (name.length > 50) {
      toast.error('Tên tối đa 50 ký tự');
      return;
    }
    setBusy(true);
    try {
      await socialApi.createCollection(name);
      await onCommit(name, false);
      setSelected(name);
      setNewName('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Tạo collection thất bại');
    } finally {
      setBusy(false);
    }
  };

  // We don't strictly need postId inside the popover (the parent owns
  // the save call), but reading it here makes the component easier to
  // audit — and we reference it once so React doesn't flag it as
  // unused under noUnusedParameters.
  void postId;

  return createPortal(
    <AnimatePresence>
      {open && pos && (
        <>
          {/* Backdrop: closes the popover on outside click. */}
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
            transition={{ duration: 0.12 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              zIndex: 9999,
            }}
            className="w-72 overflow-hidden rounded-2xl border border-white/10 bg-[rgba(15,15,25,0.96)] shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                {isSaved ? (
                  <BookmarkCheck size={16} style={{ color: NEON_AMBER }} />
                ) : (
                  <Bookmark size={16} className="text-text-muted" />
                )}
                <span className="text-sm font-semibold text-text-primary">
                  {isSaved ? 'Đã lưu vào...' : 'Lưu vào collection'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                title="Đóng"
              >
                <X size={14} />
              </button>
            </div>

            {/* Existing collections */}
            <div className="max-h-64 overflow-y-auto py-1.5">
              {collections.length === 0 && (
                <p className="px-4 py-3 text-xs italic text-text-muted">
                  Bạn chưa có collection nào. Tạo mới bên dưới.
                </p>
              )}
              {collections.map((c) => {
                const name = c.name ?? '';
                const isSelected = selected === name;
                return (
                  <button
                    key={name || '__uncategorized'}
                    onClick={() => pickCollection(name || null)}
                    disabled={busy}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors',
                      'hover:bg-white/[0.04]',
                      isSelected ? 'text-text-primary' : 'text-text-secondary',
                    )}
                  >
                    <span
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
                    </span>
                    <span className="flex-1 truncate">
                      {name || 'Chưa phân loại'}
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
                + Tạo collection mới
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreate();
                    }
                  }}
                  maxLength={50}
                  placeholder="Gaming, Tài liệu, ..."
                  disabled={busy}
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-text-primary outline-none placeholder:text-text-muted/60 transition-colors focus:border-amber-400/50"
                />
                <button
                  onClick={handleCreate}
                  disabled={busy || !newName.trim()}
                  className="flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium transition-all disabled:opacity-40"
                  style={{
                    background: 'rgba(245,158,11,0.18)',
                    color: NEON_AMBER,
                    border: '1px solid rgba(245,158,11,0.35)',
                  }}
                  title="Tạo và lưu vào đây"
                >
                  {busy ? <Loader2 size={12} className="animate-spin" /> : <FolderPlus size={12} />}
                  Lưu
                </button>
              </div>
            </div>

            {/* Footer: unsave if currently saved */}
            {isSaved && (
              <div className="border-t border-white/[0.06] px-2 py-2">
                <button
                  onClick={handleUnsave}
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-40"
                >
                  <Bookmark size={12} />
                  Bỏ lưu bài viết này
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
