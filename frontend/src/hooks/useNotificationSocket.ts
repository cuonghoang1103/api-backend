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
import { connectSocket } from '@/lib/socket';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { usePreferencesStore, type NotifyType } from '@/store/preferencesStore';
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
          // Per-category mute (added 2026-08-08). The row still exists on
          // the server — the user can always find it on /notifications —
          // we just don't interrupt them with it here. Unknown/new types
          // default to shown rather than silently swallowed.
          const typePrefs = usePreferencesStore.getState().notifyTypes;
          if (typePrefs && typePrefs[payload.type as NotifyType] === false) return;

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
        // effects: (1) play the dedicated admin sound, (2) surface it in
        // the bell, (3) trigger the fly-in robot popup (AnnouncementBotPopup).
        const onAnnouncement = (a: AdminAnnouncementEvent) => {
          if (!a || typeof a.id !== 'number') return;
          if (usePreferencesStore.getState().notifyTypes?.ADMIN_ANNOUNCEMENT === false) return;

          // (2) Re-read from the server instead of fabricating a row.
          //
          // This used to `prepend()` a synthetic notification with a
          // NEGATIVE id and bump the unread counter by hand. The server
          // had never heard of that row: it vanished on reload, and the
          // badge stayed permanently one ahead of the real unread count.
          // The backend now writes a real per-user row before it
          // broadcasts (notification.service.ts → fanoutAnnouncement), so
          // a plain refresh picks up the genuine row, with a real id that
          // "mark as read" can actually act on.
          void useNotificationStore.getState().refresh();

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

        // Reconnect recovery. Anything that happened while the socket was
        // down was never pushed to us, so on every re-connect (not the
        // first one — that's what the REST hydrate below is for) re-read
        // the list head so the bell catches up instead of silently
        // missing a window of notifications.
        const onReconnect = () => {
          void useNotificationStore.getState().refresh();
        };
        socket.io.on('reconnect', onReconnect);

        cleanupFn = () => {
          socket.off('social:notification', onNotification);
          socket.off('admin:announcement', onAnnouncement);
          socket.off('music:access-changed', onMusicAccess);
          socket.io.off('reconnect', onReconnect);
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

  // Hydrate + keep the bell badge honest.
  //
  // This block used to be wrapped in `if (getSocket()?.connected)` and
  // `if (cur === 0)`. Both were wrong:
  //
  //   * `connectSocket()` is started by the effect ABOVE and only assigns
  //     the module singleton once its promise resolves. This effect runs
  //     in the same tick, so `getSocket()` was still null and
  //     `null?.connected` is undefined — falsy. The fetch therefore never
  //     ran on a page load, and since this store isn't persisted the badge
  //     started at 0 every time and stayed 0 until the user opened the
  //     dropdown. Unread notifications were effectively invisible.
  //
  //   * The `cur === 0` guard then meant that even when it did fire, the
  //     count could only ever go up, never down — so a notification read
  //     on another device left a phantom badge here.
  //
  // The endpoint is a single indexed COUNT, so calling it unconditionally
  // on mount (and on the wake-ups below) is cheap.
  useEffect(() => {
    if (!isAuthenticated) return;

    void useNotificationStore.getState().syncUnreadCount();

    // The socket is the primary channel, but it can miss events while the
    // laptop is asleep, on a flaky network, or when the tab is throttled
    // in the background. These three wake-ups converge the badge back to
    // the truth without polling on a timer.
    // Throttled: focus + visibilitychange + online can all fire within a
    // few milliseconds of the same alt-tab, and a user flipping between
    // windows would otherwise issue a request per flip. 15s is well under
    // any realistic "I stepped away" gap while collapsing bursts to one.
    let lastSync = 0;
    const resync = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      const now = Date.now();
      if (now - lastSync < 15_000) return;
      lastSync = now;
      void useNotificationStore.getState().syncUnreadCount();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') resync();
    };

    window.addEventListener('focus', resync);
    window.addEventListener('online', resync);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('focus', resync);
      window.removeEventListener('online', resync);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isAuthenticated]);
}