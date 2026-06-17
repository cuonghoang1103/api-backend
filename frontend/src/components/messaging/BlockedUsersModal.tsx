'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldOff, Search } from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import SafeImage from '@/components/ui/SafeImage';

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Modal that lists every user the current viewer has blocked.
 *
 * Backing data: `useMessagingStore().blockedUsers`, which is
 * loaded once on `init()` from `/messages/blocks` and refreshed
 * after every block / unblock action. The list is rendered with
 * avatar + display name + the date they were blocked. Each row
 * has an "Bỏ chặn" button that calls `store.unblockUser`.
 *
 * The modal also hides any sidebar tab indicators (filter chips)
 * underneath so the user can read the list without distraction.
 */
export default function BlockedUsersModal({ open, onClose }: Props) {
  const blockedUsers = useMessagingStore((s) => s.blockedUsers);
  const blockedLoaded = useMessagingStore((s) => s.blockedLoaded);
  const loadBlocked = useMessagingStore((s) => s.loadBlocked);
  const unblockUser = useMessagingStore((s) => s.unblockUser);
  const [query, setQuery] = useState('');
  const [pendingId, setPendingId] = useState<number | null>(null);

  // Lazy-load when the modal first opens so we always have
  // a fresh list (the store's `loadBlocked` is cheap).
  useEffect(() => {
    if (open) {
      void loadBlocked();
      setQuery('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const filtered = blockedUsers.filter((u) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      u.displayName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    );
  });

  const handleUnblock = async (userId: number, name: string) => {
    setPendingId(userId);
    try {
      await unblockUser(userId);
      toast.success(`Đã bỏ chặn ${name}`);
    } catch (e) {
      toast.error('Không thể bỏ chặn người dùng');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a14]/98 shadow-2xl backdrop-blur"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <ShieldOff className="h-4 w-4 text-amber-400" />
                <h2 className="text-[13px] font-semibold text-text-primary">
                  Người dùng đã chặn
                </h2>
                <span className="rounded-full bg-white/[0.06] px-1.5 text-[10px] font-bold tabular-nums text-text-secondary">
                  {blockedUsers.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-text-muted hover:bg-white/[0.06] hover:text-text-primary"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            {blockedUsers.length > 0 && (
              <div className="border-b border-white/[0.06] px-3 py-2">
                <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 focus-within:border-cyan-500/40">
                  <Search className="h-3.5 w-3.5 text-text-muted" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm trong danh sách chặn..."
                    className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto">
              {!blockedLoaded ? (
                <div className="flex items-center justify-center px-4 py-12 text-[12px] text-text-muted">
                  Đang tải...
                </div>
              ) : blockedUsers.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
                    <ShieldOff className="h-5 w-5 text-text-muted" />
                  </div>
                  <p className="text-[12.5px] font-semibold text-text-primary">
                    Chưa chặn ai
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
                    Người dùng bị chặn sẽ không thể nhắn tin cho bạn và sẽ bị ẩn khỏi tất cả các tab.
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-4 py-12 text-center text-[12px] text-text-muted">
                  Không tìm thấy "{query}"
                </div>
              ) : (
                <ul className="divide-y divide-white/[0.04]">
                  {filtered.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.03]"
                    >
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
                        {u.avatarUrl ? (
                          <SafeImage
                            src={u.avatarUrl}
                            alt={u.displayName}
                            label={u.displayName || u.username}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
                          >
                            {(u.displayName || u.username).charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-semibold text-text-primary">
                          {u.displayName}
                        </p>
                        <p className="truncate text-[10.5px] text-text-muted">
                          @{u.username}
                          {u.reason ? ` · ${u.reason}` : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => handleUnblock(u.id, u.displayName)}
                        disabled={pendingId === u.id}
                        className={cn(
                          'shrink-0 rounded-lg border border-amber-500/30 bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-200 transition-colors hover:bg-amber-500/25',
                          pendingId === u.id && 'cursor-not-allowed opacity-50',
                        )}
                      >
                        {pendingId === u.id ? 'Đang xử lý...' : 'Bỏ chặn'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[10.5px] text-text-muted">
              Khi bỏ chặn, cuộc trò chuyện cũ (nếu có) sẽ xuất hiện trở lại trong tab "Tất cả tin nhắn".
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}