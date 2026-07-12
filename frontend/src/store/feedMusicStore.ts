'use client';

/**
 * feedMusicStore — global mute state for post background music.
 *
 * Post music auto-plays as you scroll each music post into view. The speaker
 * button toggles sound for ALL posts (mute once → stays muted everywhere) and
 * the choice persists across reloads. Default: unmuted (sound on).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FeedMusicState {
  muted: boolean;
  toggleMuted: () => void;
  setMuted: (m: boolean) => void;
}

export const useFeedMusicStore = create<FeedMusicState>()(
  persist(
    (set) => ({
      muted: false,
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
      setMuted: (m) => set({ muted: m }),
    }),
    { name: 'feed-music-mute' },
  ),
);
