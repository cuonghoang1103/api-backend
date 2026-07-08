'use client';

import { useState, useRef, useEffect, useMemo, useCallback, type Dispatch, type SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { Plus, ListPlus, CornerDownLeft, Heart, Flame, Clock, Download, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMusicStore } from '@/store/musicStore';
import { usePlaylistStore } from '@/store/playlistStore';
import { useAuthStore } from '@/store/authStore';
import { useAddToQueue, useLikedTrackIds, useLikedTracks, useToggleLike, useMostPlayedTracks, musicKeys } from '@/hooks/useMusicQueries';
import { musicApi } from '@/lib/api';
import { isYouTubeUrl } from '@/lib/youtube-player';
import { toast } from 'sonner';
import type { Track } from '@/types';

function isSafeUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  return url.startsWith('http') || url.startsWith('/uploads/');
}

const C = {
  primary: '#8B5CF6',
  secondary: '#06b6d4',
  accent: '#ec4899',
  glow: 'rgba(139,92,246,0.2)',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  glassBg: 'rgba(15,23,42,0.75)',
  glassBgLight: 'rgba(20,15,40,0.6)',
  border: 'rgba(139,92,246,0.15)',
  cardBgHover: 'rgba(139,92,246,0.08)',
  activeBg: 'rgba(139,92,246,0.12)',
};

function parseDuration(d: string | number | undefined): number {
  if (!d && d !== 0) return 0;
  if (typeof d === 'number') return d;
  if (typeof d === 'string' && d.includes(':')) {
    const parts = d.split(':').map(Number);
    return parts[0] * 60 + (parts[1] || 0);
  }
  return Number(d) || 0;
}

function formatTotal(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// Phase 2a: which tab + sort the playlist is showing
type PlaylistView = 'tracks' | 'liked' | 'history' | 'most-played' | 'info';

export default function CyberPlaylist() {
  const {
    tracks, currentTrack, isPlaying, playTrackAtIndex,
    allTracks, savedAllTracks, restoreAllTracks, recentlyPlayed,
    playNext, addToManualQueue,
    likedIds, toggleLike,
  } = useMusicStore();
  const { openDrawer, setPendingTrack } = usePlaylistStore();
  const addToQueueApi = useAddToQueue();
  const toggleLikeApi = useToggleLike();

  // Phase 2a: server-hydrated lists — auth-gated: /music/likes and
  // /music/play-counts are per-user endpoints that 401 for guests, and the
  // playlist mounts on every /music visit (audit 2026-07-05). Guests keep
  // the local Zustand likes/history exactly as before.
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  // Admin gate for the "Download to site" button (backend also enforces
  // requireRole('ADMIN')). Mirrors SocialSidebar's admin check.
  const isAdmin = !!(user as any)?.roles?.some((r: string) =>
    ['admin', 'ADMIN', 'ROLE_ADMIN', 'SUPER_ADMIN'].includes(r),
  );
  const queryClient = useQueryClient();
  // Which track is currently being extracted → R2 (spinner on its button).
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);
  const { data: serverLikedTracks = [] } = useLikedTracks(isAuthenticated, 200);
  const { data: serverMostPlayed = [] } = useMostPlayedTracks(isAuthenticated, 50);

  // Hydrate likedIds / likedTracks from the server snapshot.
  // Phase 2a: keep the Zustand mirror in sync without spamming
  // refetches. We do this in an effect so the hook-driven data
  // (which updates on cache invalidation) flows into the store
  // and the rest of the UI can read it synchronously.
  const hydrateLikedFromServer = useMusicStore((s) => s.hydrateLikedFromServer);
  useEffect(() => {
    // Derive IDs from serverLikedTracks (so we always have both)
    const ids = serverLikedTracks.map((t) => Number(t.id)).filter(Number.isFinite);
    hydrateLikedFromServer(ids, serverLikedTracks);
  }, [serverLikedTracks, hydrateLikedFromServer]);

  const [search, setSearch] = useState('');
  // Phase 2b: tracklist sort. 'added' keeps the original order.
  const [sortBy, setSortBy] = useState<'added' | 'title' | 'artist' | 'duration'>('added');
  const [activeTab, setActiveTab] = useState<PlaylistView>('tracks');
  const [imgError, setImgError] = useState(false);
  const [failedThumbs, setFailedThumbs] = useState<Set<string>>(new Set());
  // Track the previous track id so we can clear failedThumbs when
  // the user switches to a brand-new track (otherwise the previous
  // track's broken-thumb state would keep its cover hidden until a
  // page reload — the symptom the user described as "reload to see
  // the YouTube cover").
  const prevTrackIdRef = useRef<string | null>(null);
  useEffect(() => {
    const id = tracks[0]?.id ?? null;
    if (prevTrackIdRef.current !== null && prevTrackIdRef.current !== id) {
      // The first listed track changed — its `failedThumbs` entry
      // is no longer relevant and would otherwise hide the cover.
      setFailedThumbs((prev) => {
        if (!prev.has(id as string)) return prev;
        const next = new Set(prev);
        next.delete(id as string);
        return next;
      });
    }
    prevTrackIdRef.current = id;
  }, [tracks]);

  // ── Debounced search ──────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ── Memoized derived values ────────────────────────────────────────
  const filteredTracks = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    const base = debouncedSearch
      ? tracks.filter(
          (track) =>
            track.title.toLowerCase().includes(q) ||
            track.artist.toLowerCase().includes(q),
        )
      : tracks;
    if (sortBy === 'added') return base;
    // Copy before sort so we never mutate the source array / store.
    const sorted = [...base];
    if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'artist') {
      sorted.sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (sortBy === 'duration') {
      sorted.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
    }
    return sorted;
  }, [tracks, debouncedSearch, sortBy]);

  const filteredLikedTracks = useMemo(() => {
    // Safe-guard against server returning null/empty
    const safe = Array.isArray(serverLikedTracks) ? serverLikedTracks : [];
    if (!debouncedSearch) return safe;
    const q = debouncedSearch.toLowerCase();
    return safe.filter(
      (track) =>
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q),
    );
  }, [serverLikedTracks, debouncedSearch]);

  const filteredMostPlayed = useMemo(() => {
    const safe = Array.isArray(serverMostPlayed) ? serverMostPlayed : [];
    if (!debouncedSearch) return safe;
    const q = debouncedSearch.toLowerCase();
    return safe.filter(
      (track) =>
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q),
    );
  }, [serverMostPlayed, debouncedSearch]);

  const totalDuration = useMemo(
    () => tracks.reduce((acc, t) => acc + parseDuration(t.duration), 0),
    [tracks],
  );

  // ── Track action handlers ─────────────────────────────────────────
  const handlePlayTrack = useCallback(
    (track: Track) => {
      const state = useMusicStore.getState();
      // Clicking the currently playing track toggles play/pause — no restart.
      if (state.currentTrack?.id === track.id) {
        state.togglePlay();
        return;
      }
      const idx = tracks.indexOf(track);
      if (idx < 0) return;
      playTrackAtIndex(idx);
    },
    [tracks, playTrackAtIndex],
  );

  const handleAddToPlaylist = useCallback(
    (track: Track) => {
      setPendingTrack(track);
      openDrawer();
    },
    [setPendingTrack, openDrawer],
  );

  // Cyber Phase 1: queue actions. Local Zustand mirror is the
  // source of truth for instant UX; the server hook is a best-effort
  // sync for cross-device persistence.
  const handlePlayNext = useCallback(
    (track: Track) => {
      playNext(track);
      const numericId = Number(track.id);
      if (Number.isFinite(numericId) && numericId > 0) {
        addToQueueApi.mutate({ trackId: numericId, intent: 'next' });
      }
      toast.success(`"${track.title}" will play next`);
    },
    [playNext, addToQueueApi],
  );

  const handleAddToQueue = useCallback(
    (track: Track) => {
      addToManualQueue(track);
      const numericId = Number(track.id);
      if (Number.isFinite(numericId) && numericId > 0) {
        addToQueueApi.mutate({ trackId: numericId, intent: 'queue' });
      }
      toast.success(`Added "${track.title}" to queue`);
    },
    [addToManualQueue, addToQueueApi],
  );

  // Download a YouTube track's audio to R2 (admin only). Once stored, the
  // row becomes an <audio>-backed track → plays in the background / with
  // the screen locked on mobile. Extraction is server-side (yt-dlp+ffmpeg)
  // and can take 10-60s, so we show a spinner and a loading toast.
  const handleDownloadToSite = useCallback(
    async (track: Track) => {
      const numericId = Number(track.id);
      if (!Number.isFinite(numericId) || numericId <= 0) {
        toast('Bài này đang được lưu — thử lại sau giây lát');
        return;
      }
      if (downloadingId != null) {
        toast('Đang tải một bài khác về, đợi xong đã nhé');
        return;
      }
      setDownloadingId(track.id);
      const toastId = toast.loading(`Đang tải "${track.title}" về site…`);
      try {
        const res = await musicApi.downloadToSite(numericId);
        const updated = (res?.data?.data ?? null) as
          | { id?: number; localPath?: string; audioUrl?: string; coverImage?: string }
          | null;
        toast.success('Đã tải về site — giờ nghe nền / khoá màn hình được', { id: toastId });
        // Patch the track in-place so the row immediately switches to its
        // R2 source and the download button hides. A plain refetch won't
        // do it: setTracks no-ops on a same-id/length list, so the store
        // would keep the old YouTube audioUrl.
        if (updated?.id != null) {
          useMusicStore.setState((s) => {
            const patch = (t: Track) =>
              Number(t.id) === Number(updated.id)
                ? {
                    ...t,
                    localPath: updated.localPath ?? t.localPath,
                    audioUrl: updated.audioUrl ?? '',
                    coverImage: updated.coverImage ?? t.coverImage,
                  }
                : t;
            return {
              tracks: s.tracks.map(patch),
              allTracks: s.allTracks.map(patch),
              savedAllTracks: s.savedAllTracks.map(patch),
              queue: s.queue.map(patch),
            };
          });
        }
        queryClient.invalidateQueries({ queryKey: musicKeys.tracks() });
      } catch (e: any) {
        toast.error(
          e?.response?.data?.message || e?.userFriendlyMessage || 'Tải nhạc thất bại',
          { id: toastId },
        );
      } finally {
        setDownloadingId(null);
      }
    },
    [downloadingId, queryClient],
  );

  // Cyber Phase 2a: like/unlike toggle (optimistic via store).
  // Fire-and-forget: server errors surface via React Query, but
  // the optimistic update already gave the user instant feedback.
  const handleToggleLike = useCallback(
    (track: Track) => {
      const numericId = Number(track.id);
      if (!Number.isFinite(numericId) || numericId <= 0) {
        // A just-searched YouTube track still has a transient `yt-<id>`
        // id (no server row yet — it's persisted in the background and
        // gets a numeric id on the next tracks refetch). Liking it now
        // would corrupt likedIds with a bogus -1 entry, so we no-op and
        // let the user like it once it has a real id.
        toast('Bài này đang được lưu — thử lại sau giây lát');
        return;
      }
      // Optimistic local flip first.
      const isCurrentlyLiked = Array.isArray(likedIds) && likedIds.includes(numericId);
      toggleLike(numericId, track);
      toggleLikeApi.mutate(
        { trackId: numericId, intent: isCurrentlyLiked ? 'unlike' : 'like' },
        {
          onError: () => {
            // Revert on error.
            toggleLike(numericId, track);
            toast.error('Could not update like — try again');
          },
        },
      );
    },
    [likedIds, toggleLike, toggleLikeApi],
  );

  const handlePlayLikedTrack = useCallback(
    (track: Track) => {
      const idx = tracks.findIndex((t) => t.id === track.id);
      if (idx >= 0) {
        playTrackAtIndex(idx);
      } else {
        // Liked track is in store but not in current playlist —
        // play it via direct setCurrent + play.
        const state = useMusicStore.getState();
        state.playTrack(track);
      }
    },
    [tracks, playTrackAtIndex],
  );

  const handlePlayMostPlayedTrack = useCallback(
    (track: Track) => handlePlayLikedTrack(track),
    [handlePlayLikedTrack],
  );

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: C.glassBg,
        backdropFilter: 'blur(32px)',
        border: `1px solid ${C.border}`,
      }}
    >
      {/* Accent line */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${C.primary}, ${C.secondary}, ${C.accent})`,
        }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-14 h-14 rounded-2xl overflow-hidden shrink-0"
            style={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
              boxShadow: `0 0 30px ${C.glow}`,
            }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            {isSafeUrl(tracks[0]?.coverImage) && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tracks[0].coverImage}
                alt="Playlist"
                className="object-cover w-full h-full"
                style={{ width: 56, height: 56 }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
            )}
          </motion.div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: C.primary }}>
              Neural Playlist
            </span>
            <h2 className="text-base font-bold font-mono truncate mt-0.5" style={{ color: C.text }}>
              {activeTab === 'liked'
                ? 'LIKED_SIGNALS'
                : activeTab === 'most-played'
                  ? 'NEURAL_HOT_PATH'
                  : activeTab === 'history'
                    ? 'RECENT_SIGNALS'
                    : 'FULL_TRACKLIST'}
            </h2>
            <p className="text-[11px] font-mono" style={{ color: C.textMuted }}>
              {activeTab === 'liked'
                ? `${serverLikedTracks.length} liked`
                : activeTab === 'most-played'
                  ? `${serverMostPlayed.length} tracks ranked by plays`
                  : activeTab === 'history'
                    ? `${recentlyPlayed.length} signals logged`
                    : `${tracks.length} tracks | ${formatTotal(totalDuration)}`}
            </p>
          </div>
        </div>

        {/* Tab bar — Phase 2a: now includes LIKED + MOST_PLAYED */}
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { key: 'tracks', label: 'TRACKS', icon: null },
            { key: 'liked', label: 'LIKED', icon: Heart },
            { key: 'most-played', label: 'HOT', icon: Flame },
            { key: 'history', label: 'HISTORY', icon: Clock },
            { key: 'info', label: 'SYS.INFO', icon: null },
          ] as const).map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                style={{
                  background: isActive ? `${C.primary}20` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? `${C.primary}50` : C.border}`,
                  color: isActive ? C.primary : C.textMuted,
                }}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {label}
              </motion.button>
            );
          })}
        </div>

        {/* Search — visible on track-listing tabs */}
        {(activeTab === 'tracks' || activeTab === 'liked' || activeTab === 'most-played') && (
          <div className="relative mb-3">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search matrix..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-mono outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${C.border}`,
                color: C.text,
              }}
              onFocus={(e) => { (e.target as HTMLElement).style.borderColor = C.primary; }}
              onBlur={(e) => { (e.target as HTMLElement).style.borderColor = C.border; }}
            />
          </div>
        )}

        {/* Sort control (Phase 2b) — tracks tab only */}
        {activeTab === 'tracks' && (
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-wider mr-1" style={{ color: C.textMuted }}>
              SORT
            </span>
            {([
              { key: 'added', label: 'ADDED' },
              { key: 'title', label: 'TITLE' },
              { key: 'artist', label: 'ARTIST' },
              { key: 'duration', label: 'TIME' },
            ] as const).map(({ key, label }) => {
              const isActive = sortBy === key;
              return (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all"
                  style={{
                    background: isActive ? `${C.secondary}20` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? `${C.secondary}50` : C.border}`,
                    color: isActive ? C.secondary : C.textMuted,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* All tracks pill */}
        {activeTab === 'tracks' && savedAllTracks.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={restoreAllTracks}
            className="mb-3 py-1.5 px-3 rounded-xl text-xs font-mono flex items-center gap-1.5"
            style={{
              background: `${C.secondary}20`,
              border: `1px solid ${C.secondary}40`,
              color: C.secondary,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            ALL {savedAllTracks.length} TRACKS
          </motion.button>
        )}
      </div>

      {/* Track list (TRACKS tab) */}
      {activeTab === 'tracks' && (
        <div
          className="overflow-y-auto px-3 pb-3"
          style={{
            maxHeight: '460px',
            scrollbarWidth: 'thin',
            scrollbarColor: `${C.primary}40 transparent`,
          }}
        >
          {filteredTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="1" opacity="0.3">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <p className="text-sm font-mono mt-3" style={{ color: C.textMuted }}>
                {search ? 'Signal not found' : 'Matrix empty'}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredTracks.map((track, idx) => (
                <CyberTrackItem
                  key={track.id}
                  track={track}
                  index={idx}
                  isActive={currentTrack?.id === track.id}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  liked={Array.isArray(likedIds) && likedIds.includes(Number(track.id))}
                  onPlay={() => handlePlayTrack(track)}
                  onAddToPlaylist={() => handleAddToPlaylist(track)}
                  onPlayNext={() => handlePlayNext(track)}
                  onAddToQueue={() => handleAddToQueue(track)}
                  onToggleLike={() => handleToggleLike(track)}
                  onDownloadToSite={isAdmin ? () => handleDownloadToSite(track) : undefined}
                  downloading={downloadingId === track.id}
                  colors={C}
                  failedThumbs={failedThumbs}
                  setFailedThumbs={setFailedThumbs}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Liked Songs tab — Phase 2a */}
      {activeTab === 'liked' && (
        <div
          className="overflow-y-auto px-3 pb-3"
          style={{ maxHeight: '460px', scrollbarWidth: 'thin', scrollbarColor: `${C.primary}40 transparent` }}
        >
          {filteredLikedTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Heart className="w-12 h-12 mb-2" style={{ color: C.textMuted, opacity: 0.3 }} />
              <p className="text-sm font-mono mt-3" style={{ color: C.textMuted }}>
                {search ? 'No liked tracks match' : 'No liked tracks yet'}
              </p>
              <p className="text-[10px] font-mono text-text-muted/70 mt-1">
                Tap the heart on any track to add it here
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredLikedTracks.map((track, idx) => (
                <CyberTrackItem
                  key={track.id}
                  track={track}
                  index={idx}
                  isActive={currentTrack?.id === track.id}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  liked={true}
                  onPlay={() => handlePlayLikedTrack(track)}
                  onAddToPlaylist={() => handleAddToPlaylist(track)}
                  onPlayNext={() => handlePlayNext(track)}
                  onAddToQueue={() => handleAddToQueue(track)}
                  onToggleLike={() => handleToggleLike(track)}
                  onDownloadToSite={isAdmin ? () => handleDownloadToSite(track) : undefined}
                  downloading={downloadingId === track.id}
                  colors={C}
                  failedThumbs={failedThumbs}
                  setFailedThumbs={setFailedThumbs}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Most Played tab — Phase 2a */}
      {activeTab === 'most-played' && (
        <div
          className="overflow-y-auto px-3 pb-3"
          style={{ maxHeight: '460px', scrollbarWidth: 'thin', scrollbarColor: `${C.primary}40 transparent` }}
        >
          {filteredMostPlayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Flame className="w-12 h-12 mb-2" style={{ color: C.textMuted, opacity: 0.3 }} />
              <p className="text-sm font-mono mt-3" style={{ color: C.textMuted }}>
                {search ? 'No plays match' : 'No plays yet'}
              </p>
              <p className="text-[10px] font-mono text-text-muted/70 mt-1">
                Play tracks to build your hot path
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredMostPlayed.map((track, idx) => (
                <CyberTrackItem
                  key={track.id}
                  track={track}
                  index={idx}
                  isActive={currentTrack?.id === track.id}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  liked={Array.isArray(likedIds) && likedIds.includes(Number(track.id))}
                  badge={`×${(track as Track & { count?: number }).count ?? 0}`}
                  onPlay={() => handlePlayMostPlayedTrack(track)}
                  onAddToPlaylist={() => handleAddToPlaylist(track)}
                  onPlayNext={() => handlePlayNext(track)}
                  onAddToQueue={() => handleAddToQueue(track)}
                  onToggleLike={() => handleToggleLike(track)}
                  onDownloadToSite={isAdmin ? () => handleDownloadToSite(track) : undefined}
                  downloading={downloadingId === track.id}
                  colors={C}
                  failedThumbs={failedThumbs}
                  setFailedThumbs={setFailedThumbs}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div
          className="overflow-y-auto px-3 pb-3"
          style={{ maxHeight: '460px', scrollbarWidth: 'thin', scrollbarColor: `${C.primary}40 transparent` }}
        >
          {recentlyPlayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="1" opacity="0.3">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <p className="text-sm font-mono mt-3" style={{ color: C.textMuted }}>
                No signals logged yet
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {recentlyPlayed.slice().reverse().map((track, idx) => (
                <motion.div
                  key={`${track.id}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <CyberTrackItem
                    track={track}
                    index={-1}
                    isActive={false}
                    isPlaying={false}
                    liked={Array.isArray(likedIds) && likedIds.includes(Number(track.id))}
                    onPlay={() => handlePlayTrack(track)}
                    onAddToPlaylist={() => handleAddToPlaylist(track)}
                    onPlayNext={() => handlePlayNext(track)}
                    onAddToQueue={() => handleAddToQueue(track)}
                    onToggleLike={() => handleToggleLike(track)}
                  onDownloadToSite={isAdmin ? () => handleDownloadToSite(track) : undefined}
                  downloading={downloadingId === track.id}
                    colors={C}
                    dimmed
                    failedThumbs={failedThumbs}
                    setFailedThumbs={setFailedThumbs}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info tab */}
      {activeTab === 'info' && (
        <div className="px-5 pb-5 space-y-3" style={{ maxHeight: '460px', overflowY: 'auto' }}>
          {[
            { label: 'TRACKS_LOADED', value: String(tracks.length) },
            { label: 'TOTAL_DURATION', value: formatTotal(totalDuration) },
            { label: 'SIGNALS_LOGGED', value: String(recentlyPlayed.length) },
            { label: 'LIKED_TRACKS', value: String(serverLikedTracks.length) },
            { label: 'UNIQUE_PLAYS', value: String(serverMostPlayed.length) },
            { label: 'MATRIX_VERSION', value: 'v2.0.0' },
            { label: 'ENGINE', value: 'ZUSTAND' },
            { label: 'AUDIO_API', value: 'HTML5' },
            { label: 'CROSS_ORIGIN', value: 'ANONYMOUS' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span className="text-xs font-mono" style={{ color: C.textMuted }}>{item.label}</span>
              <span className="text-xs font-mono font-bold" style={{ color: C.primary }}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CyberTrackItem ──────────────────────────────────────────────────────────────────────
const CyberTrackItem = motion(function CyberTrackItem({
  track, index, isActive, isPlaying, liked, badge,
  onPlay, onAddToPlaylist, onPlayNext, onAddToQueue, onToggleLike,
  onDownloadToSite, downloading = false,
  colors, dimmed = false,
  failedThumbs, setFailedThumbs,
}: {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  liked?: boolean;
  badge?: string;
  onPlay: () => void;
  onAddToPlaylist: () => void;
  onPlayNext?: () => void;
  onAddToQueue?: () => void;
  onToggleLike?: () => void;
  onDownloadToSite?: () => void;
  downloading?: boolean;
  colors: typeof C;
  dimmed?: boolean;
  failedThumbs: Set<string>;
  setFailedThumbs: Dispatch<SetStateAction<Set<string>>>;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.99 }}
      onClick={onPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group"
      style={{
        background: isActive ? colors.activeBg : hovered ? colors.cardBgHover : 'transparent',
        border: `1px solid ${isActive ? 'rgba(139,92,246,0.3)' : 'transparent'}`,
        opacity: dimmed ? 0.6 : 1,
      }}
    >
      {/* Index / playing indicator / badge */}
      <div className="w-7 flex items-center justify-center shrink-0">
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-5">
            <div className="w-1 rounded-full cyber-bar-1" style={{ background: colors.primary, height: 4 }} />
            <div className="w-1 rounded-full cyber-bar-2" style={{ background: colors.primary, height: 4 }} />
            <div className="w-1 rounded-full cyber-bar-3" style={{ background: colors.primary, height: 4 }} />
          </div>
        ) : badge ? (
          <span
            className="text-[10px] font-mono tabular-nums font-bold"
            style={{ color: colors.accent }}
            title="Play count"
          >
            {badge}
          </span>
        ) : (
          <span className="text-[11px] font-mono tabular-nums" style={{ color: isActive ? colors.primary : colors.textMuted }}>
            {index >= 0 ? String(index + 1).padStart(2, '0') : '—'}
          </span>
        )}
      </div>

      {/* Cover */}
      <motion.div
        className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 shadow-md"
        whileHover={{ scale: 1.08 }}
        style={{ opacity: dimmed ? 0.7 : 1 }}
      >
        {isSafeUrl(track.coverImage) && !failedThumbs.has(track.id) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.coverImage}
            alt={track.title}
            style={{ width: 44, height: 44 }}
            className="object-cover w-full h-full"
            onError={() => {
              setFailedThumbs(prev => {
                const next = new Set(prev);
                next.add(track.id);
                return next;
              });
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
          >
            <span className="text-white/50 text-sm font-bold">{track.title.charAt(0)}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '2px' }}>
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </div>

        {/* Active ring */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-lg"
            style={{ boxShadow: `0 0 0 2px ${colors.primary}`, opacity: 0.6 }}
          />
        )}
      </motion.div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold font-mono truncate"
          style={{ color: isActive ? colors.primary : colors.text }}
        >
          {track.title}
        </p>
        <p className="text-[11px] font-mono truncate" style={{ color: colors.textMuted }}>
          {track.artist}
        </p>
      </div>

      {/* Queue + playlist + like actions — always visible on mobile, hover-only on desktop */}
      <div className="flex items-center gap-1 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
        {/* Heart (Phase 2a) — visible at all times when liked, otherwise only on hover */}
        {onToggleLike && (
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              // When liked, always show (with filled heart). Otherwise
              // ghost it on hover only.
              opacity: liked ? 1 : undefined,
              background: liked ? `${colors.accent}25` : 'transparent',
              color: liked ? colors.accent : colors.textMuted,
            }}
            title={liked ? 'Unlike' : 'Like'}
            aria-label={liked ? 'Unlike' : 'Like'}
            aria-pressed={liked ? true : false}
          >
            <Heart
              className="w-3.5 h-3.5"
              fill={liked ? colors.accent : 'none'}
              strokeWidth={liked ? 2 : 1.5}
            />
          </motion.button>
        )}
        {onPlayNext && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onPlayNext(); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${colors.secondary}15`, color: colors.secondary }}
            title="Play next"
            aria-label="Play next"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </motion.button>
        )}
        {onAddToQueue && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onAddToQueue(); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${colors.secondary}15`, color: colors.secondary }}
            title="Add to queue"
            aria-label="Add to queue"
          >
            <ListPlus className="w-3.5 h-3.5" />
          </motion.button>
        )}
        {/* Download-to-site: only for YouTube tracks (admin). Converts the
            track to an R2 mp3 so it plays in the background / with the
            screen locked on mobile. Hidden once it's no longer a YT track. */}
        {onDownloadToSite && isYouTubeUrl(track.audioUrl).isYT && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); if (!downloading) onDownloadToSite(); }}
            disabled={downloading}
            className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-70"
            style={{ background: `${colors.accent}15`, color: colors.accent }}
            title="Tải về site (nghe nền / khoá màn hình)"
            aria-label="Tải nhạc về site"
          >
            {downloading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Download className="w-3.5 h-3.5" />}
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onAddToPlaylist(); }}
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${colors.primary}15`, color: colors.primary }}
          title="Add to playlist"
          aria-label="Add to playlist"
        >
          <Plus className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Duration */}
      <span className="text-[11px] tabular-nums font-mono shrink-0" style={{ color: colors.textMuted }}>
        {track.duration}
      </span>
    </motion.div>
  );
});