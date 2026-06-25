'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Track, Playlist, PlaylistSummary } from '@/types';
import { getMediaUrl } from '@/lib/utils';

// ─── API fetch helpers ────────────────────────────────────────────────────────

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw Object.assign(new Error(err.message || `HTTP ${res.status}`), { status: res.status });
  }
  return res.json() as Promise<T>;
}

// ─── Backend track shape (numeric IDs) ────────────────────────────────────────
interface RawTrack {
  id: number;
  title: string;
  artist: string;
  audioUrl?: string | null;
  localPath?: string | null;
  coverImage?: string | null;
  durationSeconds?: number | null;
  fileSize?: number | null;
  active?: boolean | null;
  createdAt?: string | null;
}

/**
 * Normalize a raw backend track to the frontend Track format.
 * Converts numeric IDs to strings and builds a valid audioUrl.
 */
function normalizeTrack(raw: RawTrack): Track {
  const audioUrl = buildPlaybackUrl(raw);
  return {
    id: String(raw.id),
    title: raw.title ?? 'Unknown',
    artist: raw.artist ?? 'Unknown Artist',
    duration: raw.durationSeconds ? formatDuration(raw.durationSeconds) : '0:00',
    durationSeconds: raw.durationSeconds ?? undefined,
    audioUrl,
    coverImage: raw.coverImage ?? '',
    localPath: raw.localPath ?? undefined,
    fileSize: raw.fileSize ?? undefined,
    active: raw.active ?? undefined,
    createdAt: raw.createdAt ?? undefined,
  };
}

function buildPlaybackUrl(raw: RawTrack): string {
  // Resolves R2 keys, legacy local paths, and remote audio URLs
  // through the shared helper. See lib/utils.ts#getMediaUrl.
  return getMediaUrl(raw.localPath, raw.audioUrl, raw.id);
}

export function formatDuration(seconds: number): string {
  if (!seconds || !Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
}

// ─── Track API calls ─────────────────────────────────────────────────────────

export interface TracksResponse {
  success: boolean;
  data: RawTrack[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminTracksResponse {
  success: boolean;
  data: RawTrack[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface YouTubeSearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  videoId: string;
  duration?: string;
  durationSeconds?: number;
}

export interface YouTubeSearchResponse {
  success: boolean;
  data: YouTubeSearchResult[];
}

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const musicKeys = {
  all: ['music'] as const,
  tracks: () => [...musicKeys.all, 'tracks'] as const,
  adminTracks: () => [...musicKeys.all, 'admin-tracks'] as const,
  history: () => [...musicKeys.all, 'history'] as const,
  // Cyber Phase 1: persistent play queue (server-side mirror).
  queue: () => [...musicKeys.all, 'queue'] as const,
  // Cyber Phase 2a: per-user likes + per-user play counts.
  likedIds: () => [...musicKeys.all, 'liked-ids'] as const,
  likedTracks: () => [...musicKeys.all, 'liked-tracks'] as const,
  mostPlayed: (limit: number) => [...musicKeys.all, 'most-played', limit] as const,
  youtubeSearch: (q: string) => [...musicKeys.all, 'youtube-search', q] as const,
};

// ─── Queries ────────────────────────────────────────────────────────────────

/**
 * Fetch all public tracks (with TanStack Query caching).
 * Stale time: 5 minutes — cache survives page navigations.
 */
export function useTracks(params?: { page?: number; size?: number; keyword?: string }) {
  return useQuery({
    queryKey: [...musicKeys.tracks(), params],
    queryFn: () => {
      const sp = new URLSearchParams();
      if (params?.page) sp.set('page', String(params.page));
      if (params?.size) sp.set('size', String(params.size));
      if (params?.keyword) sp.set('keyword', params.keyword);
      const qs = sp.toString();
      return fetchJson<TracksResponse>(`/api/v1/music/tracks${qs ? `?${qs}` : ''}`);
    },
    select: (res) => {
      // Normalize backend tracks to frontend Track format
      return {
        ...res,
        data: res.data.map((raw) => normalizeTrack(raw)),
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Fetch admin track list (authenticated).
 */
export function useAdminTracks(params?: { page?: number; size?: number; keyword?: string; includeInactive?: boolean }) {
  return useQuery({
    queryKey: [...musicKeys.adminTracks(), params],
    queryFn: () => {
      const sp = new URLSearchParams();
      if (params?.page) sp.set('page', String(params.page));
      if (params?.size) sp.set('size', String(params.size));
      if (params?.keyword) sp.set('keyword', params.keyword);
      if (params?.includeInactive) sp.set('includeInactive', 'true');
      const qs = sp.toString();
      return fetchJson<AdminTracksResponse>(`/api/v1/music/admin/tracks${qs ? `?${qs}` : ''}`);
    },
    select: (res) => ({
      ...res,
      data: res.data.map((raw) => normalizeTrack(raw)),
    }),
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Fetch user's listening history from PostgreSQL (authenticated).
 * This is the persistent history — survives browser close.
 */
export function useMusicHistory() {
  return useQuery({
    queryKey: musicKeys.history(),
    queryFn: () => fetchJson<{ success: boolean; data: (Track & { playedAt?: string })[] }>('/api/v1/music/history'),
    staleTime: 1 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Search YouTube for music videos (public — works for guests, users, and admins).
 * Returns parsed results with artist/title extraction and durations.
 *
 * Backend route:
 *   GET /api/v1/music/youtube-search?q=...   (public, optionalAuth)
 *
 * The /admin/youtube-search variant still exists for back-compat but is no
 * longer called by the frontend.
 */
export function useYouTubeSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: musicKeys.youtubeSearch(query),
    queryFn: () => {
      if (!query.trim()) return Promise.resolve({ success: true, data: [] } as YouTubeSearchResponse);
      return fetchJson<YouTubeSearchResponse>(
        `/api/v1/music/youtube-search?q=${encodeURIComponent(query.trim())}`,
      );
    },
    enabled: enabled && query.trim().length >= 2,
    staleTime: 10 * 60 * 1000, // YouTube search results cached longer
    gcTime: 60 * 60 * 1000,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Record a play event to PostgreSQL history.
 * Fire-and-forget: doesn't block playback.
 */
export function useRecordPlay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (trackId: number) =>
      fetchJson<{ success: boolean; message: string }>('/api/v1/music/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId }),
      }),
    onSuccess: () => {
      // Invalidate history cache so it reflects latest plays
      qc.invalidateQueries({ queryKey: musicKeys.history() });
    },
  });
}

/**
 * Clear all listening history.
 */
export function useClearHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      fetchJson<{ success: boolean; message: string }>('/api/v1/music/history', {
        method: 'DELETE',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: musicKeys.history() });
    },
  });
}

/**
 * Invalidate track list cache — call after creating/updating/deleting a track.
 */
export function useInvalidateTracks() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: musicKeys.tracks() });
    qc.invalidateQueries({ queryKey: musicKeys.adminTracks() });
  };
}

// ─── Playlist hooks ──────────────────────────────────────────────────────────

function playlistKeys() {
  return [...musicKeys.all, 'playlists'] as const;
}

function playlistDetailKey(id: number) {
  return [...playlistKeys(), 'detail', id] as const;
}

/**
 * Fetch all playlists (public + user-owned).
 */
export function usePlaylists() {
  return useQuery({
    queryKey: playlistKeys(),
    queryFn: () =>
      fetchJson<{ success: boolean; data: PlaylistSummary[] }>('/api/v1/music/playlists'),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}

/**
 * Fetch a single playlist with full track list.
 */
export function usePlaylistDetail(id: number | null) {
  return useQuery({
    queryKey: playlistDetailKey(id ?? -1),
    queryFn: () =>
      fetchJson<{ success: boolean; data: Playlist }>(`/api/v1/music/playlists/${id}`),
    enabled: id != null && id > 0,
    staleTime: 60_000,    // 1 minute — playlist data rarely changes
    gcTime: 10 * 60_000, // 10 minutes
  });
}

/**
 * Create a new playlist.
 */
export function useCreatePlaylist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string; coverUrl?: string }) =>
      fetchJson<{ success: boolean; data: Playlist }>('/api/v1/music/playlists', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playlistKeys() });
    },
  });
}

/**
 * Update a playlist.
 */
export function useUpdatePlaylist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name?: string; description?: string; coverUrl?: string; isPublic?: boolean };
    }) =>
      fetchJson<{ success: boolean; data: Playlist }>(`/api/v1/music/playlists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: playlistKeys() });
      qc.invalidateQueries({ queryKey: playlistDetailKey(vars.id) });
    },
  });
}

/**
 * Delete a playlist.
 */
export function useDeletePlaylist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetchJson<{ success: boolean }>(`/api/v1/music/playlists/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playlistKeys() });
    },
  });
}

/**
 * Add a track to a playlist.
 */
export function useAddTrackToPlaylist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, trackId }: { playlistId: number; trackId: number }) =>
      fetchJson<{ success: boolean }>(`/api/v1/music/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId }),
      }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: playlistDetailKey(vars.playlistId) });
      qc.invalidateQueries({ queryKey: playlistKeys() });
    },
  });
}

/**
 * Remove a track from a playlist.
 */
export function useRemoveTrackFromPlaylist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, trackId }: { playlistId: number; trackId: number }) =>
      fetchJson<{ success: boolean }>(
        `/api/v1/music/playlists/${playlistId}/tracks/${trackId}`,
        { method: 'DELETE' },
      ),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: playlistDetailKey(vars.playlistId) });
      qc.invalidateQueries({ queryKey: playlistKeys() });
    },
  });
}

// ─── Cyber Phase 1: play queue hooks ──────────────────────────

/**
 * Server-side raw queue item (joined with track data).
 * The server only stores numeric (DB-backed) tracks in the queue;
 * YouTube / local tracks without a numeric id are not server-replicated.
 */
export interface QueueItemDTO {
  trackId: number;
  position: number;
  intent: 'next' | 'queue';
  title: string;
  artist: string;
  coverImage: string | null;
  audioUrl: string | null;
  localPath: string | null;
  durationSeconds: number | null;
}

/**
 * Convert a server DTO into the frontend Track shape.
 * Reuses `getMediaUrl` so the same R2 → backend-stream logic applies.
 */
function normalizeQueueItem(dto: QueueItemDTO): Track {
  return {
    id: String(dto.trackId),
    title: dto.title ?? 'Unknown',
    artist: dto.artist ?? 'Unknown Artist',
    duration: dto.durationSeconds ? formatDuration(dto.durationSeconds) : '0:00',
    durationSeconds: dto.durationSeconds ?? undefined,
    audioUrl: getMediaUrl(dto.localPath, dto.audioUrl, dto.trackId),
    coverImage: dto.coverImage ?? '',
    localPath: dto.localPath ?? undefined,
  };
}

/**
 * Fetch the user's persistent play queue (authenticated).
 * Always returns an array (never `undefined`) so consumers can
 * iterate without the "x is not iterable" runtime crash.
 *
 * Stale time is short (30s) so cross-device additions show up
 * quickly after a refresh, but the in-memory Zustand mirror is the
 * source of truth during a session.
 */
export function useMusicQueue(enabled = true) {
  return useQuery({
    queryKey: musicKeys.queue(),
    queryFn: async () => {
      const res = await fetchJson<{ success: boolean; data: QueueItemDTO[] | null }>(
        '/api/v1/music/queue',
      );
      const raw = Array.isArray(res?.data) ? res.data : [];
      return raw.map(normalizeQueueItem);
    },
    enabled,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Add a track to the user's queue. Idempotent on the server
 * (a repeat call updates the existing row's position instead of
 * inserting a duplicate — UNIQUE (user_id, track_id) constraint).
 *
 * `intent: 'next'` → insert at the front (play immediately after
 * the current track). `'queue'` → append.
 */
export function useAddToQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ trackId, intent }: { trackId: number; intent?: 'next' | 'queue' }) =>
      fetchJson<{ success: boolean; data: QueueItemDTO }>('/api/v1/music/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId, intent: intent ?? 'queue' }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: musicKeys.queue() });
    },
  });
}

/**
 * Remove a single track from the queue.
 */
export function useRemoveFromQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (trackId: number) =>
      fetchJson<{ success: boolean }>(`/api/v1/music/queue/${trackId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: musicKeys.queue() });
    },
  });
}

/**
 * Clear the user's entire queue.
 */
export function useClearQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      fetchJson<{ success: boolean }>('/api/v1/music/queue', { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: musicKeys.queue() });
    },
  });
}

/**
 * Reorder the queue. `orderedTrackIds` is the desired order
 * (oldest → newest). Replaces the entire server order in one
 * transaction.
 */
export function useReorderQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderedTrackIds: number[]) =>
      fetchJson<{ success: boolean }>('/api/v1/music/queue/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackIds: orderedTrackIds }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: musicKeys.queue() });
    },
  });
}

// ─── Cyber Phase 2a: likes + most-played hooks ───────────────────

/**
 * Raw DTO for a liked track (matches LikedTrackDTO on backend).
 */
export interface LikedTrackDTO {
  trackId: number;
  likedAt: string;
  title: string;
  artist: string;
  coverImage: string | null;
  audioUrl: string | null;
  localPath: string | null;
  durationSeconds: number | null;
}

/**
 * Convert a server liked-track DTO into the frontend Track shape.
 * Same audioUrl resolution logic as the queue hooks.
 */
function normalizeLikedTrack(dto: LikedTrackDTO): Track {
  return {
    id: String(dto.trackId),
    title: dto.title ?? 'Unknown',
    artist: dto.artist ?? 'Unknown Artist',
    duration: dto.durationSeconds ? formatDuration(dto.durationSeconds) : '0:00',
    durationSeconds: dto.durationSeconds ?? undefined,
    audioUrl: getMediaUrl(dto.localPath, dto.audioUrl, dto.trackId),
    coverImage: dto.coverImage ?? '',
    localPath: dto.localPath ?? undefined,
  };
}

/**
 * Raw DTO for a most-played track (matches PlayCountTrackDTO on backend).
 */
export interface MostPlayedTrackDTO {
  trackId: number;
  count: number;
  lastPlayedAt: string;
  title: string;
  artist: string;
  coverImage: string | null;
  audioUrl: string | null;
  localPath: string | null;
  durationSeconds: number | null;
}

function normalizeMostPlayed(dto: MostPlayedTrackDTO): Track & { count: number } {
  return {
    id: String(dto.trackId),
    title: dto.title ?? 'Unknown',
    artist: dto.artist ?? 'Unknown Artist',
    duration: dto.durationSeconds ? formatDuration(dto.durationSeconds) : '0:00',
    durationSeconds: dto.durationSeconds ?? undefined,
    audioUrl: getMediaUrl(dto.localPath, dto.audioUrl, dto.trackId),
    coverImage: dto.coverImage ?? '',
    localPath: dto.localPath ?? undefined,
    count: dto.count,
  };
}

/**
 * Fetch the IDs of tracks the current user has liked. Cheap
 * hydration (single int[] payload) — used to flip the heart
 * icon state on each track in the playlist without pulling full
 * track data.
 *
 * Always returns a number array (never undefined).
 */
export function useLikedTrackIds(enabled = true) {
  return useQuery({
    queryKey: musicKeys.likedIds(),
    queryFn: async () => {
      const res = await fetchJson<{ success: boolean; data: number[] | null }>(
        '/api/v1/music/likes/ids',
      );
      const raw = Array.isArray(res?.data) ? res.data : [];
      // De-dupe + filter to finite numbers defensively.
      const seen = new Set<number>();
      const out: number[] = [];
      for (const id of raw) {
        if (Number.isFinite(id) && !seen.has(id)) {
          seen.add(id);
          out.push(id);
        }
      }
      return out;
    },
    enabled,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Fetch the user's liked tracks with full metadata. Used to
 * populate the "Liked Songs" tab in CyberPlaylist.
 */
export function useLikedTracks(enabled = true, limit = 200) {
  return useQuery({
    queryKey: [...musicKeys.likedTracks(), limit],
    queryFn: async () => {
      const res = await fetchJson<{ success: boolean; data: LikedTrackDTO[] | null }>(
        `/api/v1/music/likes?limit=${Math.max(1, Math.min(limit, 500))}`,
      );
      const raw = Array.isArray(res?.data) ? res.data : [];
      return raw.map(normalizeLikedTrack);
    },
    enabled,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}

/**
 * Toggle (like/unlike) a track. The local store updates
 * optimistically via `toggleLike` BEFORE this mutation fires,
 * so the user sees instant feedback. On error, we invalidate
 * the liked-ids query so the truth from the server is re-read.
 *
 * The backend route decides the new state based on whether the
 * (userId, trackId) row already exists.
 */
export function useToggleLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ trackId, intent }: { trackId: number; intent: 'like' | 'unlike' }) =>
      fetchJson<{ success: boolean; data: { liked: boolean; trackId: number } }>(
        intent === 'like'
          ? `/api/v1/music/likes/${trackId}`
          : `/api/v1/music/likes/${trackId}`,
        { method: intent === 'like' ? 'POST' : 'DELETE' },
      ),
    onSuccess: () => {
      // Invalidate both queries so the cached list + the IDs stay
      // in sync with the server.
      qc.invalidateQueries({ queryKey: musicKeys.likedIds() });
      qc.invalidateQueries({ queryKey: musicKeys.likedTracks() });
    },
  });
}

/**
 * Fetch the user's most-played tracks, sorted by count DESC.
 * Used to populate the "Most Played" sort option / tab in
 * CyberPlaylist.
 */
export function useMostPlayedTracks(enabled = true, limit = 50) {
  return useQuery({
    queryKey: musicKeys.mostPlayed(limit),
    queryFn: async () => {
      const res = await fetchJson<{ success: boolean; data: MostPlayedTrackDTO[] | null }>(
        `/api/v1/music/play-counts?limit=${Math.max(1, Math.min(limit, 200))}`,
      );
      const raw = Array.isArray(res?.data) ? res.data : [];
      return raw.map(normalizeMostPlayed);
    },
    enabled,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}
