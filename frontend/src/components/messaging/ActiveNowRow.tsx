'use client';

import { useEffect, useState } from 'react';
import { useMessagingStore } from '@/store/messagingStore';
import { friendApi, type FriendUser } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

/**
 * Messenger-style "Đang hoạt động" strip — a horizontal, scrollable
 * row of the user's ONLINE friends shown at the top of the inbox
 * (mobile only; the parent wraps this in `md:hidden`).
 *
 * Data flow:
 *  - Friends are fetched ONCE on mount (best-effort — a failure just
 *    means the strip stays hidden, never an error state).
 *  - Online status comes from the messaging store's `presence` slice,
 *    which is seeded by `loadOnlineUsers()` and then live-updated by
 *    the socket's `presence:update` events. We subscribe to the slice
 *    via the store hook so friends pop in/out as they come online.
 *  - Tapping a friend opens (or creates) the 1:1 thread. Note that
 *    `startUserThread` only returns the thread id — it does NOT set
 *    the current thread — so we follow up with `openThread`.
 *
 * Self-hides (renders null) when no friends are online.
 */
export default function ActiveNowRow() {
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const presence = useMessagingStore((s) => s.presence);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await friendApi.listFriends(undefined, 30);
        if (!cancelled) setFriends(res.data.data?.users ?? []);
      } catch {
        // Best-effort: no friends list → strip simply doesn't render.
      }
    })();
    // Seed the presence snapshot once; socket events keep it fresh.
    void useMessagingStore.getState().loadOnlineUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const online = friends.filter((f) => presence.byUserId[f.id]?.online);
  if (online.length === 0) return null;

  const handleOpen = async (friend: FriendUser) => {
    if (pendingId !== null) return;
    setPendingId(friend.id);
    try {
      const store = useMessagingStore.getState();
      const threadId = await store.startUserThread(friend.id);
      await store.openThread(threadId);
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? e?.message ?? 'Không thể mở cuộc trò chuyện');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="shrink-0">
      <p className="px-4 pt-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        Đang hoạt động
      </p>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {online.map((f) => {
          const name = f.displayName || f.username;
          const firstName = name.trim().split(/\s+/)[0] || name;
          return (
            <button
              key={f.id}
              onClick={() => handleOpen(f)}
              disabled={pendingId !== null}
              className={cn(
                'flex w-14 shrink-0 flex-col items-center gap-1 transition-opacity',
                pendingId !== null && pendingId !== f.id && 'opacity-60',
                pendingId === f.id && 'opacity-80',
              )}
              title={name}
            >
              <div className="relative h-14 w-14">
                {f.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.avatarUrl}
                    alt={name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span
                  className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-[#0a0a14] shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  title="Đang hoạt động"
                />
              </div>
              <span className="w-full truncate text-center text-[11px] text-text-secondary">
                {firstName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
