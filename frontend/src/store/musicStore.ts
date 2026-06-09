import { create } from 'zustand';
import type { Track } from '@/types';

type RepeatMode = 'none' | 'one' | 'all';

// Module-level set to track broken local tracks across reloads
const brokenLocalTracks = new Set<string>();

// ── localStorage keys ──────────────────────────────────────────────────────────
const LS_KEY = 'cuong-music-v1';

interface PersistedState {
  currentTrackId: string | null;
  currentTime: number;
  currentIndex: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  lastPlaylistId: string | null;
}

function loadPersisted(): PersistedState {
  if (typeof window === 'undefined') {
    return { currentTrackId: null, currentTime: 0, currentIndex: -1, volume: 0.7, isMuted: false, isShuffled: false, repeatMode: 'none', lastPlaylistId: null };
  }
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { currentTrackId: null, currentTime: 0, currentIndex: -1, volume: 0.7, isMuted: false, isShuffled: false, repeatMode: 'none', lastPlaylistId: null };
}

function savePersisted(p: PersistedState) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

// ── store interface ───────────────────────────────────────────────────────────
interface MusicState {
  tracks: Track[];
  currentTrack: Track | null;
  currentIndex: number;
  isPlaying: boolean;
  isHydrated: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  // The default full track list loaded at app start (e.g. 50 tracks)
  allTracks: Track[];
  // Saved snapshot of allTracks before a playlist was loaded — used to restore
  savedAllTracks: Track[];
  // Tracks which playlist is currently loaded so we can restore it
  lastPlaylistId: string | null;

  setTracks: (tracks: Track[]) => void;
  /** Called by PremiumPlaylist when user clicks a playlist — saves allTracks */
  setAllTracks: (tracks: Track[]) => void;
  addTrack: (track: Track) => void;
  deleteTrack: (id: string) => void;
  playTrack: (track: Track) => void;
  playTrackAtIndex: (index: number) => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  clearQueue: () => void;
  setHydrated: (v: boolean) => void;
  restoreBlobs: () => void;
  markTrackBroken: (id: string) => void;
  stop: () => void;
  /** Restore full allTracks list when user switches back to "All Tracks" */
  restoreAllTracks: () => void;
}

// ── helpers ──────────────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ── store ─────────────────────────────────────────────────────────────────────
export const useMusicStore = create<MusicState>()((set, get) => {
  const persisted = loadPersisted();

  return {
    tracks: [],
    currentTrack: null,
    currentIndex: -1,
    isPlaying: false,
    isHydrated: true,
    currentTime: persisted.currentTime,
    duration: 0,
    volume: persisted.volume,
    isMuted: persisted.isMuted,
    isShuffled: persisted.isShuffled,
    repeatMode: persisted.repeatMode,
    queue: [],
    allTracks: [],
    savedAllTracks: [],
    lastPlaylistId: persisted.lastPlaylistId,

    setTracks: (tracks) => {
      const p = loadPersisted();
      const { savedAllTracks } = get();
      const first = tracks[0] || null;
      let restored: Track | null = null;
      let restoredIdx = -1;
      if (p.currentTrackId && tracks.length > 0) {
        const idx = tracks.findIndex((t) => t.id === p.currentTrackId);
        if (idx >= 0) { restored = tracks[idx]; restoredIdx = idx; }
      }
      // Initialize savedAllTracks on first load (when empty), then preserve across playlist switches
      const newSaved = savedAllTracks.length === 0 ? tracks : savedAllTracks;
      set({
        tracks,
        allTracks: tracks,
        savedAllTracks: newSaved,
        queue: tracks,
        currentTrack: restored ?? first,
        currentIndex: restoredIdx >= 0 ? restoredIdx : (first ? 0 : -1),
        lastPlaylistId: null,
      });
      savePersisted({ ...p, lastPlaylistId: null });
    },

    setAllTracks: (tracks) => {
      const { currentTrack } = get();
      // Only update the snapshot fields — don't overwrite the currently playing tracks
      set({ allTracks: tracks, savedAllTracks: tracks, queue: tracks, currentTrack });
    },

    addTrack: (track) => {
      const { allTracks, savedAllTracks } = get();
      set((s) => {
        const newTracks = [...s.tracks, track];
        const newAllTracks = [...allTracks, track];
        const newSaved = [...savedAllTracks, track];
        const wasEmpty = s.tracks.length === 0;
        return {
          tracks: newTracks,
          allTracks: newAllTracks,
          savedAllTracks: newSaved,
          queue: newTracks,
          currentTrack: wasEmpty ? track : s.currentTrack,
          currentIndex: wasEmpty ? 0 : s.currentIndex,
        };
      });
    },

    deleteTrack: (id) => {
      const { currentTrack } = get();
      if (id.startsWith('local-')) brokenLocalTracks.delete(id);
      set((s) => {
        const newTracks = s.tracks.filter((t) => t.id !== id);
        const newAllTracks = s.allTracks.filter((t) => t.id !== id);
        const deletedIndex = s.tracks.findIndex((t) => t.id === id);
        let newIndex = s.currentIndex;
        let newCurrent = s.currentTrack;

        if (newTracks.length === 0) {
          newCurrent = null;
          newIndex = -1;
        } else if (currentTrack?.id === id) {
          newIndex = Math.min(deletedIndex, newTracks.length - 1);
          newCurrent = newTracks[newIndex];
        } else if (deletedIndex < s.currentIndex) {
          newIndex = s.currentIndex - 1;
        }

        return {
          tracks: newTracks,
          allTracks: newAllTracks,
          queue: newTracks,
          currentTrack: newCurrent,
          currentIndex: newIndex,
          isPlaying: newCurrent ? s.isPlaying : false,
        };
      });
    },

    playTrack: (track) => {
      const { tracks } = get();
      const idx = tracks.findIndex((t) => t.id === track.id);
      const p = loadPersisted();
      set({ currentTrack: track, currentIndex: idx >= 0 ? idx : 0, isPlaying: true });
      savePersisted({ ...p, currentTrackId: track.id });
    },

    playTrackAtIndex: (index) => {
      const { tracks } = get();
      if (index < 0 || index >= tracks.length) return;
      const p = loadPersisted();
      const track = tracks[index];
      set({ currentTrack: track, currentIndex: index, isPlaying: true, currentTime: 0 });
      savePersisted({ ...p, currentTrackId: track.id });
    },

    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),

    next: () => {
      const { tracks, currentIndex, repeatMode, currentTrack } = get();
      if (tracks.length === 0) return;
      const p = loadPersisted();

      if (repeatMode === 'one') { set({ currentTime: 0 }); return; }

      let nextIdx = currentIndex + 1;
      if (nextIdx >= tracks.length) {
        if (repeatMode === 'all') nextIdx = 0;
        else { set({ isPlaying: false }); return; }
      }

      const next = tracks[nextIdx];
      set({ currentTrack: next, currentIndex: nextIdx, isPlaying: true, currentTime: 0 });
      savePersisted({ ...p, currentTrackId: next.id });
    },

    previous: () => {
      const { tracks, currentIndex, currentTime, currentTrack } = get();
      if (tracks.length === 0) return;
      const p = loadPersisted();

      if (currentTime > 3) { set({ currentTime: 0 }); return; }

      let prevIdx = currentIndex - 1;
      if (prevIdx < 0) prevIdx = tracks.length - 1;
      const prev = tracks[prevIdx];
      set({ currentTrack: prev, currentIndex: prevIdx, currentTime: 0, isPlaying: true });
      savePersisted({ ...p, currentTrackId: prev.id });
    },

    setCurrentTime: (time) => {
      const p = loadPersisted();
      set({ currentTime: time });
      savePersisted({ ...p, currentTime: time });
    },

    setDuration: (duration) => set({ duration }),
    setVolume: (volume) => {
      const p = loadPersisted();
      set({ volume, isMuted: false });
      savePersisted({ ...p, volume, isMuted: false });
    },
    toggleMute: () => {
      const p = loadPersisted();
      const { isMuted } = get();
      set({ isMuted: !isMuted });
      savePersisted({ ...p, isMuted: !isMuted });
    },

    toggleShuffle: () =>
      set((s) => {
        const p = loadPersisted();
        const newShuffle = !s.isShuffled;
        if (newShuffle) {
          const shuffled = shuffleArray(s.tracks);
          if (s.currentTrack) {
            const ci = shuffled.findIndex((t) => t.id === s.currentTrack!.id);
            if (ci > 0) { [shuffled[0], shuffled[ci]] = [shuffled[ci], shuffled[0]]; }
          }
          savePersisted({ ...p, isShuffled: true });
          return { isShuffled: true, queue: shuffled, tracks: shuffled };
        } else {
          savePersisted({ ...p, isShuffled: false });
          return { isShuffled: false, tracks: s.queue, queue: s.queue };
        }
      }),

    cycleRepeat: () => {
      const p = loadPersisted();
      set((s) => {
        const modes: RepeatMode[] = ['none', 'all', 'one'];
        const idx = modes.indexOf(s.repeatMode);
        const next = modes[(idx + 1) % modes.length];
        savePersisted({ ...p, repeatMode: next });
        return { repeatMode: next };
      });
    },

    clearQueue: () => set({ queue: [] }),

    setHydrated: (v) => set({ isHydrated: v }),

    restoreBlobs: () => {
      set((s) => ({
        tracks: s.tracks.map((track) => {
          if (!track.id.startsWith('local-')) return track;
          if (brokenLocalTracks.has(track.id)) return track;
          brokenLocalTracks.add(track.id);
          return { ...track, audioUrl: '' };
        }),
      }));
    },

    markTrackBroken: (id) => {
      brokenLocalTracks.add(id);
      set((s) => ({
        tracks: s.tracks.map((t) => (t.id === id ? { ...t, audioUrl: '' } : t)),
      }));
    },

    stop: () => set({ isPlaying: false, currentTime: 0 }),

    restoreAllTracks: () => {
      const { savedAllTracks, currentTrack } = get();
      if (savedAllTracks.length === 0) return;
      let idx = savedAllTracks.findIndex((t) => t.id === currentTrack?.id);
      if (idx < 0) idx = 0;
      set({ tracks: savedAllTracks, allTracks: savedAllTracks, queue: savedAllTracks, currentIndex: idx });
    },
  };
});
