'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Track, Playlist, PlaylistSummary } from '@/types';

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
  if (raw.audioUrl?.trim()) return raw.audioUrl;
  if (raw.localPath?.trim()) {
    const normalized = raw.localPath.replace(/^\/+/, '');
    return `/uploads/${normalized}`;
  }
  return `/api/v1/music/stream/${raw.id}`;
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
 * Search YouTube for music videos (authenticated).
 * Returns parsed results with artist/title extraction and durations.
 */
export function useYouTubeSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: musicKeys.youtubeSearch(query),
    queryFn: () => {
      if (!query.trim()) return Promise.resolve({ success: true, data: [] } as YouTubeSearchResponse);
      return fetchJson<YouTubeSearchResponse>(
        `/api/v1/music/admin/youtube-search?q=${encodeURIComponent(query.trim())}`,
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
    staleTime: 30_000,
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
