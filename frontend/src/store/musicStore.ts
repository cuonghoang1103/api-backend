import { create } from 'zustand';
import type { Track } from '@/types';

type RepeatMode = 'none' | 'one' | 'all';

const brokenLocalTracks = new Set<string>();

// ── localStorage keys ──────────────────────────────────────────────────────────
const LS_KEY = 'cuong-music-v2';
const BLOB_STORAGE_KEY = 'music-audio-blobs-v2';
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
  // Cyber Phase 1 additions (optional so existing flush call sites
  // that build the object inline don't need to be updated).
  playbackRate?: number;
  manualQueueIds?: string[];
}

function defaultPersisted(): PersistedState {
  return {
    currentTrackId: null,
    currentTime: 0,
    volume: 0.7,
    isMuted: false,
    isShuffled: false,
    repeatMode: 'none',
    lastPlaylistId: null,
    playbackRate: 1.0,
    manualQueueIds: [],
  };
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
      // Guard manualQueueIds so a corrupted localStorage payload can
      // never make the store "x is not iterable" crash the page.
      const safeManualQueueIds = Array.isArray(parsed?.manualQueueIds)
        ? parsed.manualQueueIds.filter((x: unknown): x is string => typeof x === 'string')
        : [];
      // Guard playbackRate — clamp to [0.5, 2] to defend against
      // hand-edited localStorage values that would make the audio
      // API throw.
      const rawRate = typeof parsed?.playbackRate === 'number' && Number.isFinite(parsed.playbackRate)
        ? parsed.playbackRate
        : 1.0;
      const safeRate = Math.max(0.5, Math.min(2, rawRate));
      return {
        ...defaultPersisted(),
        ...parsed,
        currentTime: safeTime,
        manualQueueIds: safeManualQueueIds,
        playbackRate: safeRate,
      };
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

  // Cyber Phase 2a additions
  /** Server-hydrated set of numeric track IDs the user has liked. */
  likedIds: number[];
  /** Server-hydrated full track objects the user has liked. */
  likedTracks: Track[];

  // Cyber Phase 1 additions
  /** Spotify-style manual play queue (wins over auto-feed). */
  manualQueue: Track[];
  /** Playback speed multiplier: 0.5 – 2.0 */
  playbackRate: number;

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

  // Cyber Phase 2a actions
  /** Like a track (optimistic update; server is fire-and-forget). */
  toggleLike: (trackId: number, track: Track) => void;
  /** Hydrate likedIds + likedTracks from the server snapshot. */
  hydrateLikedFromServer: (likedIds: number[], likedTracks: Track[]) => void;

  // Cyber Phase 1 queue actions
  /** Insert a track as the very next item in the manual queue. */
  playNext: (track: Track) => void;
  /** Append a track to the end of the manual queue. */
  addToManualQueue: (track: Track) => void;
  /** Remove a track from the manual queue (no-op if not present). */
  removeFromManualQueue: (trackId: string) => void;
  /** Reorder the manual queue (e.g. after a drag-and-drop). */
  reorderManualQueue: (orderedIds: string[]) => void;
  /** Drop the entire manual queue. Does NOT touch auto-feed tracks. */
  clearManualQueue: () => void;
  /** Set playback speed (clamped to 0.5 – 2.0). */
  setPlaybackRate: (rate: number) => void;
  /** Sync the manual queue from the authoritative server copy. */
  hydrateManualQueue: (serverQueue: Track[]) => void;
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
    // Cyber Phase 1: manual queue starts empty; the queue query hook
    // hydrates it from the server copy once the user is auth'd.
    manualQueue: [],
    playbackRate: persisted.playbackRate ?? 1.0,
    // Cyber Phase 2a: liked IDs/tracks start empty; the likes query
    // hook hydrates them from the server snapshot once the user
    // is auth'd.
    likedIds: [],
    likedTracks: [],

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
      const { tracks, currentIndex, currentTrack, repeatMode, isShuffled, manualQueue } = get();
      if (tracks.length === 0 && (!Array.isArray(manualQueue) || manualQueue.length === 0)) return;
      const p = loadPersisted();

      // Apple Music parity: when repeat-one is on, it takes
      // precedence over shuffle — the user explicitly asked to loop
      // the current track, so restart it instead of advancing.
      if (repeatMode === 'one' && currentTrack) { set({ currentTime: 0 }); return; }

      // Cyber Phase 1: manual queue wins over auto-feed.
      // If the user has queued tracks ("Play next" / "Add to
      // queue"), consume the FIRST one (oldest) and continue
      // auto-feed afterwards. Spotify/Apple Music parity.
      const safeManualQueue = Array.isArray(manualQueue) ? manualQueue : [];
      if (safeManualQueue.length > 0) {
        const [first, ...rest] = safeManualQueue;
        get().addToHistory(first);
        const idx = tracks.findIndex((t) => t.id === first.id);
        set({
          manualQueue: rest,
          currentTrack: first,
          currentIndex: idx >= 0 ? idx : 0,
          isPlaying: true,
          currentTime: 0,
        });
        savePersisted({
          ...p,
          currentTrackId: first.id,
          manualQueueIds: rest.map((t) => t.id),
        });
        return;
      }

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
          try {
            const stored: Record<string, { data: string; type: string }> =
              JSON.parse(localStorage.getItem(BLOB_STORAGE_KEY) || '{}');
            const blob = stored[track.id];
            if (blob?.data && blob.data.startsWith('data:')) {
              // Reconstruct Blob from the stored data: URL so the track
              // plays after page reload. We decode base64 synchronously
              // using a DataView rather than relying on fetch().
              const base64 = blob.data.split(',')[1];
              if (base64) {
                const binary = atob(base64);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                  bytes[i] = binary.charCodeAt(i);
                }
                const restoredBlob = new Blob([bytes], { type: blob.type || 'audio/mpeg' });
                const restoredUrl = URL.createObjectURL(restoredBlob);
                return { ...track, audioUrl: restoredUrl };
              }
            }
          } catch {
            /* storage unavailable or quota exceeded */
          }
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

    // ── Cyber Phase 1: manual play queue actions ──
    //
    // All mutators are IDEMPOTENT at the DB level (UNIQUE
    // (user_id, track_id) on the music_queue_items table). The
    // client-side mirror just needs the same property: repeated
    // calls must not create duplicate entries.
    playNext: (track) => {
      const p = loadPersisted();
      set((s) => {
        const safeQueue = Array.isArray(s.manualQueue) ? s.manualQueue : [];
        const filtered = safeQueue.filter((t) => t.id !== track.id);
        const next = [track, ...filtered];
        savePersisted({ ...p, manualQueueIds: next.map((t) => t.id) });
        return { manualQueue: next };
      });
    },
    addToManualQueue: (track) => {
      const p = loadPersisted();
      set((s) => {
        const safeQueue = Array.isArray(s.manualQueue) ? s.manualQueue : [];
        if (safeQueue.some((t) => t.id === track.id)) return s;
        const next = [...safeQueue, track];
        savePersisted({ ...p, manualQueueIds: next.map((t) => t.id) });
        return { manualQueue: next };
      });
    },
    removeFromManualQueue: (trackId) => {
      const p = loadPersisted();
      set((s) => {
        const safeQueue = Array.isArray(s.manualQueue) ? s.manualQueue : [];
        const next = safeQueue.filter((t) => t.id !== trackId);
        savePersisted({ ...p, manualQueueIds: next.map((t) => t.id) });
        return { manualQueue: next };
      });
    },
    reorderManualQueue: (orderedIds) => {
      const p = loadPersisted();
      // Guard: `orderedIds` may be undefined if a caller passes
      // a bad arg. Default to []. The reorder is then a no-op.
      const safeIds = Array.isArray(orderedIds) ? orderedIds : [];
      set((s) => {
        const safeQueue = Array.isArray(s.manualQueue) ? s.manualQueue : [];
        const byId = new Map(safeQueue.map((t) => [t.id, t]));
        const next = safeIds
          .map((id) => byId.get(id))
          .filter((t): t is Track => Boolean(t));
        savePersisted({ ...p, manualQueueIds: next.map((t) => t.id) });
        return { manualQueue: next };
      });
    },
    clearManualQueue: () => {
      const p = loadPersisted();
      savePersisted({ ...p, manualQueueIds: [] });
      set({ manualQueue: [] });
    },
    setPlaybackRate: (rate) => {
      // Clamp + sanity-check so a stray `Infinity` or `NaN` from a
      // buggy caller can't propagate to the <audio> element (which
      // throws on non-finite values).
      const safe = Number.isFinite(rate) ? Math.max(0.5, Math.min(2, rate)) : 1.0;
      const p = loadPersisted();
      savePersisted({ ...p, playbackRate: safe });
      set({ playbackRate: safe });
    },
    hydrateManualQueue: (serverQueue) => {
      // Defensive: server may return null on cold start. Treat as [].
      const safe = Array.isArray(serverQueue) ? serverQueue : [];
      set({ manualQueue: safe });
      const p = loadPersisted();
      savePersisted({ ...p, manualQueueIds: safe.map((t) => t.id) });
    },

    // ── Cyber Phase 2a: like/unlike actions ──
    //
    // Optimistic: toggle state immediately, then the React Query
    // mutation below sends the actual POST / DELETE to the server.
    // On error, the mutation's onError restores the previous state.
    toggleLike: (trackId, track) => {
      const safeIds = Array.isArray(get().likedIds) ? get().likedIds : [];
      const safeTracks = Array.isArray(get().likedTracks) ? get().likedTracks : [];
      const isCurrentlyLiked = safeIds.includes(trackId);

      if (isCurrentlyLiked) {
        // Unlike — remove from both arrays, keep order otherwise.
        set({
          likedIds: safeIds.filter((id) => id !== trackId),
          likedTracks: safeTracks.filter((t) => t.id !== String(trackId)),
        });
      } else {
        // Like — add the numeric ID and prepend the track to the list
        // so the user sees it instantly at the top.
        set({
          likedIds: [trackId, ...safeIds],
          likedTracks: [track, ...safeTracks],
        });
      }
    },
    hydrateLikedFromServer: (likedIds, likedTracks) => {
      // Defensive: server may return null on cold start. Treat as [].
      // De-dupe likedIds defensively in case the server returns dupes.
      const rawIds = Array.isArray(likedIds) ? likedIds : [];
      const safeIds: number[] = [];
      const seen = new Set<number>();
      for (const id of rawIds) {
        if (Number.isFinite(id) && !seen.has(id)) {
          seen.add(id);
          safeIds.push(id);
        }
      }
      const safeTracks = Array.isArray(likedTracks) ? likedTracks : [];

      // Idempotency guard — CRITICAL. The caller runs this from a
      // useEffect whose dependency is `serverLikedTracks`, which gets
      // a fresh `[]` default reference on every render while the query
      // is loading. If we `set()` unconditionally we hand back new
      // array references each call, forcing a re-render → the effect
      // fires again → set() again → infinite loop (React #185
      // "Maximum update depth exceeded"). So bail out when nothing
      // actually changed.
      const cur = get();
      const sameIds =
        cur.likedIds.length === safeIds.length &&
        cur.likedIds.every((v, i) => v === safeIds[i]);
      const sameTracks =
        cur.likedTracks.length === safeTracks.length &&
        cur.likedTracks.every((t, i) => t.id === safeTracks[i]?.id);
      if (sameIds && sameTracks) return;

      set({ likedIds: safeIds, likedTracks: safeTracks });
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
