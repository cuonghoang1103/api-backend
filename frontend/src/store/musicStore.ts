import { create } from 'zustand';
import type { Track } from '@/types';

type RepeatMode = 'none' | 'one' | 'all';

const brokenLocalTracks = new Set<string>();

// ── localStorage keys ──────────────────────────────────────────────────────────
const LS_KEY = 'cuong-music-v2';
const HISTORY_KEY = 'cuong-music-history-v1';

const MAX_HISTORY = 50;
const SAVE_DEBOUNCE_MS = 1000;

// ── Persisted state ────────────────────────────────────────────────────────────
interface PersistedState {
  currentTrackId: string | null;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  lastPlaylistId: string | null;
}

function defaultPersisted(): PersistedState {
  return { currentTrackId: null, currentTime: 0, volume: 0.7, isMuted: false, isShuffled: false, repeatMode: 'none', lastPlaylistId: null };
}

function loadPersisted(): PersistedState {
  if (typeof window === 'undefined') return defaultPersisted();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const safeTime = typeof parsed.currentTime === 'number' && Number.isFinite(parsed.currentTime) && parsed.currentTime > 0
        ? parsed.currentTime
        : 0;
      return { ...defaultPersisted(), ...parsed, currentTime: safeTime };
    }
  } catch { /* ignore */ }
  return defaultPersisted();
}

// ── Recently played history ─────────────────────────────────────────────────────
interface HistoryState {
  history: string[]; // array of track IDs (oldest first)
  recentlyPlayed: Track[]; // cached full track objects
}

function defaultHistory(): HistoryState {
  return { history: [], recentlyPlayed: [] };
}

function loadHistory(): HistoryState {
  if (typeof window === 'undefined') return defaultHistory();
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        history: Array.isArray(parsed?.history) ? parsed.history : [],
        recentlyPlayed: Array.isArray(parsed?.recentlyPlayed) ? parsed.recentlyPlayed : [],
      };
    }
  } catch { /* ignore */ }
  return defaultHistory();
}

function saveHistory(state: HistoryState) {
  if (typeof window === 'undefined') return;
  try {
    // Only persist IDs + minimal data to save space
    const minimal = {
      history: state.history,
      recentlyPlayed: state.recentlyPlayed.map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        coverImage: t.coverImage,
        duration: t.duration,
        audioUrl: t.audioUrl,
        localPath: t.localPath,
      })),
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify(minimal));
  } catch { /* ignore */ }
}

// ── Debounced persist ────────────────────────────────────────────────────────────
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSave(getter: () => PersistedState) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    savePersisted(getter());
    saveTimer = null;
  }, SAVE_DEBOUNCE_MS);
}

function savePersisted(p: PersistedState) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

/** Immediately flush any pending debounced save (used on pause/unmount). */
function flushSave(getter: () => PersistedState) {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  savePersisted(getter());
}

// ── helpers ────────────────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ── store interface ─────────────────────────────────────────────────────────────
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
  allTracks: Track[];
  savedAllTracks: Track[];
  lastPlaylistId: string | null;
  // ── Newly added ──
  /** Recently played tracks (max 50), oldest first */
  recentlyPlayed: Track[];
  /** Track IDs in recently played order */
  history: string[];
  /** Smart Shuffle: avoid repeating recently played in shuffle mode */
  smartShufflePool: string[];

  setTracks: (tracks: Track[]) => void;
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
  restoreAllTracks: () => void;
  /** Add track to recently played history */
  addToHistory: (track: Track) => void;
  /** Smart Shuffle: pick next track avoiding recent ones */
  smartShuffleNext: () => Track | null;
  /** Clear entire playback history */
  clearHistory: () => void;
}

// ── store ───────────────────────────────────────────────────────────────────────
export const useMusicStore = create<MusicState>()((set, get) => {
  const persisted = loadPersisted();
  const hist = loadHistory();

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
    recentlyPlayed: hist.recentlyPlayed,
    history: hist.history,
    smartShufflePool: [],

    setTracks: (tracks) => {
      const p = loadPersisted();
      const { savedAllTracks, currentTrack, tracks: existingTracks, isPlaying, currentTime, isPlaying: isPlayingNow } = get();

      // ── No-op guard ───────────────────────────────────────────────
      // If the new tracks list is identical to what the store already
      // has (by id + length), skip the entire update. This prevents
      // re-creating `currentTrack` / `queue` / etc. on every page
      // navigation, which would break `===` reference checks inside
      // MusicAudioController and force a reload of the audio element
      // (the user reported: "từ trang khác ấn về lại trang nhạc thì
      // nhạc nó phát lại từ đầu").
      if (existingTracks.length === tracks.length) {
        let same = true;
        for (let i = 0; i < tracks.length; i++) {
          if (existingTracks[i]?.id !== tracks[i]?.id) { same = false; break; }
        }
        if (same) return;
      }

      // ── Bug 4 fix: stronger safety net for in-progress playback ──
      // If the user is currently playing a track, do NOT reset any of
      // the playback state (currentTrack / currentIndex / currentTime
      // / isPlaying) just because the new server-side list differs.
      //
      // The previous logic only preserved `currentTrack` by appending
      // it to `workingTracks`, but it then ran the full "restore from
      // persisted state" block which could still clobber
      // `currentTime` to a stale value and re-create the
      // `currentTrack` reference — which made the audio controller
      // see a "new track" and reload the audio source.
      //
      // Now: if a track is actively playing, we keep the entire
      // playback state untouched and only refresh the static track
      // lists (tracks / allTracks / savedAllTracks / queue). The
      // playing track is already in `existingTracks` (or we append
      // it), so the next track has somewhere to live.
      const isActivelyPlaying = currentTrack && isPlayingNow;

      if (isActivelyPlaying && currentTrack) {
        let workingTracks = tracks;
        if (!tracks.some((t) => t.id === currentTrack.id)) {
          // The currently playing track is missing from the new list
          // (e.g. a YouTube track that hasn't been registered to the
          // DB yet). Append it so the store's "next track" logic
          // still has a coherent list to advance through.
          workingTracks = [...tracks, currentTrack];
        }
        const newSaved = savedAllTracks.length === 0 ? workingTracks : savedAllTracks;
        // DO NOT touch currentTrack / currentIndex / currentTime /
        // isPlaying / duration — they're owned by the audio
        // controller. Only refresh the static lists.
        set({
          tracks: workingTracks,
          allTracks: workingTracks,
          savedAllTracks: newSaved,
          queue: workingTracks,
          lastPlaylistId: null,
          smartShufflePool: [],
        });
        return;
      }

      // ── SAFETY NET for in-progress YouTube playback (legacy) ────
      // If the user is currently listening to a track and the new
      // list from the server doesn't contain it (e.g. they searched
      // a YouTube track that hadn't been registered to the DB yet),
      // APPEND the current track to the incoming list so it isn't
      // lost. This is the last line of defense — the primary fix
      // is in CyberSearch.handleSelect which calls
      // /api/v1/music/tracks/remote BEFORE adding to the store.
      let workingTracks = tracks;
      if (
        currentTrack &&
        isPlaying &&
        !tracks.some((t) => t.id === currentTrack.id)
      ) {
        // Preserve playback across the page navigation
        workingTracks = [...tracks, currentTrack];
      }

      const first = workingTracks[0] || null;
      let restored: Track | null = null;
      let restoredIdx = -1;
      if (p.currentTrackId && workingTracks.length > 0) {
        const idx = workingTracks.findIndex((t) => t.id === p.currentTrackId);
        if (idx >= 0) { restored = workingTracks[idx]; restoredIdx = idx; }
      }
      const newSaved = savedAllTracks.length === 0 ? workingTracks : savedAllTracks;
      // Preserve currentTime so reload restores the listening position
      const isSameTrack = restored && currentTrack?.id === restored.id;
      const restoredTime = isSameTrack ? get().currentTime : p.currentTime;
      set({
        tracks: workingTracks,
        allTracks: workingTracks,
        savedAllTracks: newSaved,
        queue: workingTracks,
        currentTrack: restored ?? first,
        currentIndex: restoredIdx >= 0 ? restoredIdx : (first ? 0 : -1),
        currentTime: restoredTime,
        lastPlaylistId: null,
        smartShufflePool: [],
      });
      savePersisted({ ...p, lastPlaylistId: null, currentTime: restoredTime });
    },

    setAllTracks: (tracks) => {
      const { currentTrack } = get();
      set({ allTracks: tracks, savedAllTracks: tracks, queue: tracks, currentTrack });
    },

    addTrack: (track) => {
      const { allTracks, savedAllTracks } = get();
      set((s) => {
        const newTracks = [...s.tracks, track];
        const newAll = [...allTracks, track];
        const newSaved = [...savedAllTracks, track];
        const wasEmpty = s.tracks.length === 0;
        return {
          tracks: newTracks,
          allTracks: newAll,
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
        const newAll = s.allTracks.filter((t) => t.id !== id);
        const deletedIndex = s.tracks.findIndex((t) => t.id === id);
        let newIndex = s.currentIndex;
        let newCurrent = s.currentTrack;
        if (newTracks.length === 0) { newCurrent = null; newIndex = -1; }
        else if (currentTrack?.id === id) {
          newIndex = Math.min(deletedIndex, newTracks.length - 1);
          newCurrent = newTracks[newIndex];
        } else if (deletedIndex < s.currentIndex) { newIndex = s.currentIndex - 1; }
        return {
          tracks: newTracks, allTracks: newAll, queue: newTracks,
          currentTrack: newCurrent, currentIndex: newIndex,
          isPlaying: newCurrent ? s.isPlaying : false,
        };
      });
    },

    playTrack: (track) => {
      const { tracks } = get();
      const idx = tracks.findIndex((t) => t.id === track.id);
      const p = loadPersisted();
      get().addToHistory(track);
      set({ currentTrack: track, currentIndex: idx >= 0 ? idx : 0, isPlaying: true });
      savePersisted({ ...p, currentTrackId: track.id });
    },

    playTrackAtIndex: (index) => {
      const { tracks } = get();
      if (index < 0 || index >= tracks.length) return;
      const p = loadPersisted();
      const track = tracks[index];
      get().addToHistory(track);
      set({ currentTrack: track, currentIndex: index, isPlaying: true, currentTime: 0 });
      savePersisted({ ...p, currentTrackId: track.id });
    },

    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
    play: () => set({ isPlaying: true }),
    pause: () => {
      set({ isPlaying: false });
      // Persist position immediately so a reload/close captures the pause point
      flushSave(() => {
        const s = get();
        return {
          currentTrackId: s.currentTrack?.id ?? null,
          currentTime: s.currentTime,
          volume: s.volume,
          isMuted: s.isMuted,
          isShuffled: s.isShuffled,
          repeatMode: s.repeatMode,
          lastPlaylistId: s.lastPlaylistId,
        };
      });
    },

    next: () => {
      const { tracks, currentIndex, currentTrack, repeatMode, isShuffled } = get();
      if (tracks.length === 0) return;
      const p = loadPersisted();

      // Apple Music parity: when repeat-one is on, it takes
      // precedence over shuffle — the user explicitly asked to loop
      // the current track, so restart it instead of advancing.
      if (repeatMode === 'one' && currentTrack) { set({ currentTime: 0 }); return; }

      if (isShuffled) {
        let next = get().smartShuffleNext();

        // Refill pool if exhausted (smart shuffle loops infinitely).
        if (!next) {
          const shuffled = shuffleArray(tracks);
          set({ smartShufflePool: shuffled.map((t) => t.id) });
          next = get().smartShuffleNext();
        }

        if (!next) { set({ isPlaying: false }); return; }
        const idx = tracks.findIndex((t) => t.id === next!.id);
        get().addToHistory(next);
        set({ currentTrack: next, currentIndex: idx, isPlaying: true, currentTime: 0 });
        savePersisted({ ...p, currentTrackId: next.id });
        return;
      }

      let nextIdx = currentIndex + 1;
      if (nextIdx >= tracks.length) {
        if (repeatMode === 'all') nextIdx = 0;
        else { set({ isPlaying: false }); return; }
      }

      const next = tracks[nextIdx];
      get().addToHistory(next);
      set({ currentTrack: next, currentIndex: nextIdx, isPlaying: true, currentTime: 0 });
      savePersisted({ ...p, currentTrackId: next.id });
    },

    previous: () => {
      const { tracks, currentIndex, currentTime, history, recentlyPlayed } = get();
      if (tracks.length === 0) return;
      const p = loadPersisted();

      if (currentTime > 3) { set({ currentTime: 0 }); return; }

      // If history exists, go back in time
      if (history.length > 1) {
        const newHistory = history.slice(0, -1);
        const prevId = newHistory[newHistory.length - 1];
        const prevTrack = recentlyPlayed.find((t) => t.id === prevId);
        if (prevTrack) {
          const idx = tracks.findIndex((t) => t.id === prevId);
          set({
            history: newHistory,
            currentTrack: prevTrack,
            currentIndex: idx >= 0 ? idx : 0,
            currentTime: 0,
            isPlaying: true,
          });
          savePersisted({ ...p, currentTrackId: prevId });
          return;
        }
      }

      let prevIdx = currentIndex - 1;
      if (prevIdx < 0) prevIdx = tracks.length - 1;
      const prev = tracks[prevIdx];
      get().addToHistory(prev);
      set({ currentTrack: prev, currentIndex: prevIdx, currentTime: 0, isPlaying: true });
      savePersisted({ ...p, currentTrackId: prev.id });
    },

    setCurrentTime: (time) => {
      set({ currentTime: time });
      scheduleSave(loadPersisted);
    },

    setDuration: (duration) => set({ duration }),
    setVolume: (volume) => {
      set({ volume });
    },
    toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

    toggleShuffle: () =>
      // CRITICAL: same as cycleRepeat — pure UI toggle. Do NOT touch
      // `currentTrack`, `currentTime`, or `isPlaying`. Touching
      // `tracks` reference is fine because the audio controller is
      // not subscribed to that array (it reads `currentTrack` only).
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
          return { isShuffled: true, queue: shuffled, tracks: shuffled, smartShufflePool: shuffled.map((t) => t.id) };
        } else {
          savePersisted({ ...p, isShuffled: false });
          return { isShuffled: false, tracks: s.queue, queue: s.queue, smartShufflePool: [] };
        }
      }),

    cycleRepeat: () => {
      const p = loadPersisted();
      // CRITICAL: this is a pure UI toggle. It MUST NOT modify
      // `currentTrack`, `currentTime`, `isPlaying`, or anything that
      // would cause MusicAudioController to reload the audio source
      // (the controller has effects keyed on `currentTrack?.id` /
      // `currentTrack?.audioUrl` / `currentTime` that reload the
      // track). Keep the dep list to just `repeatMode`.
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
      set((s) => ({ tracks: s.tracks.map((t) => (t.id === id ? { ...t, audioUrl: '' } : t)) }));
    },

    stop: () => {
      set({ isPlaying: false, currentTime: 0 });
      flushSave(() => {
        const s = get();
        return {
          currentTrackId: s.currentTrack?.id ?? null,
          currentTime: 0,
          volume: s.volume,
          isMuted: s.isMuted,
          isShuffled: s.isShuffled,
          repeatMode: s.repeatMode,
          lastPlaylistId: s.lastPlaylistId,
        };
      });
    },

    restoreAllTracks: () => {
      const { savedAllTracks, currentTrack } = get();
      if (savedAllTracks.length === 0) return;
      let idx = savedAllTracks.findIndex((t) => t.id === currentTrack?.id);
      if (idx < 0) idx = 0;
      set({ tracks: savedAllTracks, allTracks: savedAllTracks, queue: savedAllTracks, currentIndex: idx });
    },

    addToHistory: (track) => {
      set((s) => {
        // Remove if already exists (to move to most recent)
        const filtered = s.history.filter((id) => id !== track.id);
        const newHistory = [...filtered, track.id];
        // Trim to max size
        const trimmed = newHistory.slice(-MAX_HISTORY);
        // Build recently played array (keep last MAX_HISTORY)
        const existing = s.recentlyPlayed.filter((t) => trimmed.includes(t.id));
        const existingIds = new Set(existing.map((t) => t.id));
        const newTracks = trimmed
          .map((id) => existing.find((t) => t.id === id) || s.tracks.find((t) => t.id === id))
          .filter(Boolean) as Track[];
        const newState = { history: trimmed, recentlyPlayed: newTracks };
        saveHistory(newState);
        return newState;
      });
    },

    smartShuffleNext: () => {
      const { smartShufflePool, tracks, currentTrack } = get();
      if (smartShufflePool.length === 0) return null;
      if (smartShufflePool.length === 1) return tracks.find((t) => t.id === smartShufflePool[0]) ?? null;

      // Avoid repeating the last 5 tracks
      const { history } = get();
      const recentIds = new Set(history.slice(-5));
      const avoidSet = new Set([...recentIds, currentTrack?.id].filter(Boolean));

      // Find a track that hasn't been played recently
      let candidates = smartShufflePool.filter((id) => !avoidSet.has(id));
      if (candidates.length === 0) {
        // Fall back to full pool minus current
        candidates = smartShufflePool.filter((id) => id !== currentTrack?.id);
      }
      if (candidates.length === 0) return null;

      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      set((s) => ({ smartShufflePool: s.smartShufflePool.filter((id) => id !== chosen) }));
      return tracks.find((t) => t.id === chosen) ?? null;
    },

    clearHistory: () => {
      set({ history: [], recentlyPlayed: [] });
      saveHistory({ history: [], recentlyPlayed: [] });
    },
  };
});

// ── Flush pending save on page unload ──────────────────────────────────────────
if (typeof window !== 'undefined') {
  // Avoid registering the listener multiple times in dev (HMR)
  const w = window as Window & { __musicUnloadBound?: boolean };
  if (!w.__musicUnloadBound) {
    w.__musicUnloadBound = true;
    const flushOnUnload = () => {
      flushSave(() => {
        const s = useMusicStore.getState();
        return {
          currentTrackId: s.currentTrack?.id ?? null,
          currentTime: s.currentTime,
          volume: s.volume,
          isMuted: s.isMuted,
          isShuffled: s.isShuffled,
          repeatMode: s.repeatMode,
          lastPlaylistId: s.lastPlaylistId,
        };
      });
    };
    window.addEventListener('beforeunload', flushOnUnload);
    window.addEventListener('pagehide', flushOnUnload);
  }
}
