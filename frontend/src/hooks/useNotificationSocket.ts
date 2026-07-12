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
import { useAnnouncementPopup } from '@/store/useAnnouncementPopup';
import type { SocialNotification } from '@/types/social';

/** Payload shape of the `admin:announcement` socket event. */
interface AdminAnnouncementEvent {
  id: number;
  title: string;
  category: string;
  createdAt: string;
}

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
          // When the super-admin (Cuong03dx) is the actor — e.g. they liked /
          // commented on the recipient's post — play the dedicated "admin
          // notification" sound the user configured in /settings/notifications.
          // The notification payload carries the actor as `sender`, so this
          // needs no backend change for admin INTERACTIONS.
          const isAdminActor = payload.sender?.username === 'Cuong03dx';
          const kind =
            payload.type === 'NEW_MESSAGE'
              ? 'message'
              : isAdminActor
                ? 'admin-notification'
                : 'notification';
          import('@/lib/sound')
            .then(({ playSound }) => {
              void playSound(kind);
            })
            .catch(() => { /* ignore */ });
        };

        socket.on('social:notification', onNotification);

        // Admin announcement broadcast (added 2026-07-09). Fired to
        // EVERY connected client when an admin posts to /forum. Three
        // effects: (1) play the dedicated admin sound, (2) drop a
        // synthetic notification into the bell (so it persists + bumps
        // unread), (3) trigger the fly-in robot popup (AnnouncementBotPopup).
        const onAnnouncement = (a: AdminAnnouncementEvent) => {
          if (!a || typeof a.id !== 'number') return;

          // (2) Synthetic bell notification. entityId = announcement id so
          // the dropdown deep-links to /forum/:id; payload.title feeds the
          // "Thông báo mới từ Admin: …" label. Negative id keeps it from
          // colliding with real server notification ids in the de-dupe set.
          useNotificationStore.getState().prepend({
            id: -a.id,
            type: 'ADMIN_ANNOUNCEMENT',
            entityId: a.id,
            secondaryEntityId: null,
            payload: { title: a.title },
            isRead: false,
            createdAt: a.createdAt || new Date().toISOString(),
            receiverId: 0,
            sender: {
              id: 0,
              username: 'admin',
              fullName: 'Admin',
              displayName: 'Admin',
              avatarUrl: null,
            },
          } as SocialNotification);

          // (3) Robot fly-in popup. Standalone store — no circular import.
          useAnnouncementPopup.getState().show({
            message: 'Bạn có thông báo mới từ admin ở trang diễn đàn',
            href: `/forum/${a.id}`,
          });

          // (1) Play the admin sound (lazy-import to keep AudioContext off
          // the server + out of the initial bundle).
          if (typeof window === 'undefined') return;
          import('@/lib/sound')
            .then(({ playSound }) => {
              void playSound('admin-notification');
            })
            .catch(() => { /* ignore */ });
        };

        socket.on('admin:announcement', onAnnouncement);

        // Music page access changed (admin flipped the global mode or toggled
        // this user). Re-broadcast as a window event so useMusicAccess refetches
        // and the /music nav item appears/disappears in realtime.
        const onMusicAccess = () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('music-access-changed'));
          }
        };
        socket.on('music:access-changed', onMusicAccess);

        cleanupFn = () => {
          socket.off('social:notification', onNotification);
          socket.off('admin:announcement', onAnnouncement);
          socket.off('music:access-changed', onMusicAccess);
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