'use client';

/**
 * Notification store (added 2026-06-20)
 * ======================================
 *
 * Holds the in-app social notification feed for the navbar bell.
 *
 * Three responsibilities:
 *
 *   1. Hydrate: fetch the latest notifications from the REST
 *      API on login and refresh whenever the bell dropdown
 *      opens. Cursor pagination lives here.
 *
 *   2. Mark-as-read: keep `unreadCount` accurate. When the
 *      user opens the dropdown we flip every entry to `isRead`
 *      in bulk and zero out the badge locally.
 *
 *   3. Real-time: when a `social:notification` socket event
 *      arrives, prepend the new item to the list and bump the
 *      unread count. The bell badge re-renders without polling.
 *
 * Why a separate store from socialStore: the navbar bell is
 * mounted on EVERY page, and a single shared notification store
 * is much cheaper than re-hydrating on every route change.
 */

import { create } from 'zustand';
import { notificationApi } from '@/lib/api';
import type { SocialNotification, NotificationListResponse } from '@/types/social';

interface NotificationState {
  items: SocialNotification[];
  cursor: number | null;
  hasNextPage: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  unreadCount: number;
  error: string | null;

  loadInitial: () => Promise<void>;
  loadMore: () => Promise<void>;
  markAllRead: () => Promise<void>;
  /** Inject a single new notification (e.g. from a socket push). */
  prepend: (n: SocialNotification) => void;
  /** Optimistically decrement the unread badge (e.g. when the
   *  user opens the dropdown and we mark everything read). */
  setUnreadCount: (n: number) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  cursor: null,
  hasNextPage: true,
  isLoading: false,
  isLoadingMore: false,
  unreadCount: 0,
  error: null,

  loadInitial: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const res = await notificationApi.list({ limit: 20 });
      const data = (res.data as any).data as NotificationListResponse;
      set({
        items: data.items,
        cursor: data.pagination.nextCursor,
        hasNextPage: data.pagination.hasNextPage,
        unreadCount: data.unreadCount,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to load notifications',
        isLoading: false,
      });
    }
  },

  loadMore: async () => {
    const { cursor, isLoadingMore, hasNextPage } = get();
    if (isLoadingMore || !hasNextPage || !cursor) return;
    set({ isLoadingMore: true });
    try {
      const res = await notificationApi.list({ cursor, limit: 20 });
      const data = (res.data as any).data as NotificationListResponse;
      set((s) => ({
        items: [...s.items, ...data.items],
        cursor: data.pagination.nextCursor,
        hasNextPage: data.pagination.hasNextPage,
        isLoadingMore: false,
      }));
    } catch {
      set({ isLoadingMore: false });
    }
  },

  markAllRead: async () => {
    // Optimistic: zero the badge immediately so the bell UI is
    // snappy. The PATCH call updates the server in the background.
    const before = get().items;
    const unreadBefore = get().unreadCount;
    set({
      items: before.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    });
    try {
      await notificationApi.markRead({ all: true });
      // After the server confirms all-read, the messenger badge
      // (useMessagingStore.unreadTotal) may still be stale because
      // it tracks DM unread via a separate counter. We re-fetch
      // here so the two badges converge to 0 in lockstep. The
      // lazy import avoids a hard module dependency between the
      // two stores (and a potential circular import with
      // messagingStore, which itself lazy-imports messageCache).
      try {
        const { useMessagingStore } = await import('./messagingStore');
        await useMessagingStore.getState().refreshUnread();
      } catch {
        /* best-effort — the messenger badge will catch up on next
           init() or the next thread:new-message event */
      }
    } catch {
      // Roll back the optimistic flip on failure
      set({ items: before, unreadCount: unreadBefore });
    }
  },

  prepend: (n) =>
    set((s) => ({
      // De-dupe — if the item already exists (e.g. socket push
      // arrived before REST hydrate completed) don't double-add.
      items: s.items.some((existing) => existing.id === n.id) ? s.items : [n, ...s.items],
      unreadCount: s.unreadCount + (n.isRead ? 0 : 1),
    })),

  setUnreadCount: (n) => set({ unreadCount: Math.max(0, n) }),

  reset: () =>
    set({
      items: [],
      cursor: null,
      hasNextPage: true,
      isLoading: false,
      isLoadingMore: false,
      unreadCount: 0,
      error: null,
    }),
}));