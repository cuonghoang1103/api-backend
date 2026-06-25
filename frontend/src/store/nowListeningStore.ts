'use client';

/**
 * ============================================================
 * Now-listening presence store (Phase 3)
 * ============================================================
 *
 * userId → what they're currently playing. Fed by socket
 * `nowplaying:update` events (see ListenTogetherSync). Used to render
 * a "🎧 đang nghe …" badge on profiles. Best-effort + ephemeral.
 */

import { create } from 'zustand';

export interface NowPlayingEntry {
  username: string;
  title: string;
  artist: string;
}

interface NowListeningState {
  byUser: Record<number, NowPlayingEntry>;
  set: (userId: number, entry: NowPlayingEntry | null) => void;
  hydrate: (items: Array<{ userId: number; username: string; track: { title: string; artist: string } }>) => void;
  get: (userId: number) => NowPlayingEntry | null;
}

export const useNowListeningStore = create<NowListeningState>()((set, getState) => ({
  byUser: {},

  set: (userId, entry) =>
    set((s) => {
      const next = { ...s.byUser };
      if (entry) next[userId] = entry;
      else delete next[userId];
      return { byUser: next };
    }),

  hydrate: (items) =>
    set(() => {
      const next: Record<number, NowPlayingEntry> = {};
      for (const it of Array.isArray(items) ? items : []) {
        if (it && it.track) {
          next[it.userId] = { username: it.username, title: it.track.title, artist: it.track.artist };
        }
      }
      return { byUser: next };
    }),

  get: (userId) => getState().byUser[userId] ?? null,
}));
