'use client';

/**
 * useNotificationSocket (added 2026-06-20)
 * =========================================
 *
 * Wires the frontend notification store to the Socket.IO stream.
 *
 * Behaviour:
 *   - Connects on first call (idempotent — re-renders are no-ops).
 *   - Subscribes to the `social:notification` event. Each
 *     payload is prepended to the notification list and the
 *     unread badge is bumped.
 *   - Plays a sound per the user's preference. The spec'd rule
 *     (in the original task):
 *       * NEW_MESSAGE         → "tin_nhan_moi_chua_doc.mp3"
 *       * everything else     → "co_thong_bao_moi.mp3"
 *     The actual file mapping is handled inside `playSound`,
 *     which is already wired to the SoundKind enum and reads
 *     the user's master + per-kind toggle + volume slider.
 *   - On unmount, we DO NOT disconnect — the global socket is
 *     a long-lived singleton (the messaging store is the
 *     canonical owner). We just remove our specific listener.
 *
 * Why a hook and not a plain module-level listener: it lets the
 * dock opt in / out by just mounting/unmounting, which is the
 * idiom Next.js already uses for everything else.
 */

import { useEffect } from 'react';
import { getSocket, connectSocket } from '@/lib/socket';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import type { SocialNotification } from '@/types/social';

let attached = false;
let cleanupFn: (() => void) | null = null;

export function useNotificationSocket(): void {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    // Idempotent — only attach the global listener once.
    if (attached) return;
    attached = true;

    let cancelled = false;

    (async () => {
      try {
        // Make sure the singleton is connected. If it's
        // already up (e.g. the messaging store opened it
        // first) this is a cheap no-op.
        const socket = await connectSocket();
        if (cancelled || !socket) return;

        const onNotification = (payload: SocialNotification) => {
          // Push into the store. The store does the
          // de-dupe + unreadCount bookkeeping.
          useNotificationStore.getState().prepend(payload);

          // Lazy-import the sound service so this module
          // doesn't pull in the AudioContext on the server.
          // The spec'd rule:
          //   NEW_MESSAGE → "tin_nhan_moi_chua_doc.mp3"
          //   everything else → "co_thong_bao_moi.mp3"
          // We map that to the SoundKind enum: 'message'
          // and 'notification' respectively. The user
          // can swap the actual MP3 in /settings/notifications.
          if (typeof window === 'undefined') return;
          const kind = payload.type === 'NEW_MESSAGE' ? 'message' : 'notification';
          import('@/lib/sound')
            .then(({ playSound }) => {
              void playSound(kind);
            })
            .catch(() => { /* ignore */ });
        };

        socket.on('social:notification', onNotification);

        cleanupFn = () => {
          socket.off('social:notification', onNotification);
        };
      } catch (err) {
        // The socket failed to connect — that's fine, the
        // REST poll on dropdown open will keep the UI fresh.
        attached = false;
        console.warn('[useNotificationSocket] connect failed:', (err as Error).message);
      }
    })();

    return () => {
      cancelled = true;
      // We intentionally do NOT clear `attached` here because
      // a re-mount of the dock shouldn't tear down the global
      // listener. The socket itself lives across the app.
      if (cleanupFn) {
        cleanupFn();
        cleanupFn = null;
      }
      attached = false; // allow re-attach on next mount
    };
  }, [isAuthenticated]);

  // Also expose a way to fetch the current unread count on
  // mount — the socket push only fires on NEW events, so if
  // the user is on the page and the server already had 3
  // unread when they logged in, we need to pull those.
  useEffect(() => {
    if (!isAuthenticated) return;
    if (getSocket()?.connected) {
      // We're online — the store can poll the cheap
      // /unread-count endpoint so the bell badge is
      // correct from the start. (This is a no-op if the
      // store already has a value.)
      const cur = useNotificationStore.getState().unreadCount;
      if (cur === 0) {
        import('@/lib/api').then(({ notificationApi }) => {
          notificationApi
            .unreadCount()
            .then((res) => {
              const c = (res.data as any).data?.unreadCount ?? 0;
              if (typeof c === 'number') {
                useNotificationStore.getState().setUnreadCount(c);
              }
            })
            .catch(() => { /* ignore */ });
        });
      }
    }
  }, [isAuthenticated]);
}