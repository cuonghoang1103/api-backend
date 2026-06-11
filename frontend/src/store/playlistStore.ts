import { create } from 'zustand';
import { toast } from 'sonner';
import type { Track } from '@/types';

interface PlaylistItem {
  id: number;
  name: string;
  description?: string;
  coverUrl?: string;
  userId?: number;
  createdByName?: string;
  isPublic: boolean;
  trackCount: number;
  totalDurationSeconds: number;
  tracks?: Track[];
  createdAt: string;
}

interface PlaylistState {
  playlists: PlaylistItem[];
  isOpen: boolean;
  pendingTrack: Track | null; // track being added to a playlist

  openDrawer: () => void;
  closeDrawer: () => void;
  setPlaylists: (playlists: PlaylistItem[]) => void;

  // Set a track that the user wants to add to a playlist
  setPendingTrack: (track: Track | null) => void;

  // CRUD operations
  createPlaylist: (name: string, coverUrl?: string) => Promise<PlaylistItem | null>;
  deletePlaylist: (id: number) => Promise<void>;
  addTrackToPlaylist: (playlistId: number, track: Track) => Promise<{ success: boolean; needsAuth?: boolean }>;
  removeTrackFromPlaylist: (playlistId: number, trackId: number) => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  playPlaylist: (playlist: PlaylistItem) => void;
}

function parseTrack(raw: any): Track {
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? 'Unknown'),
    artist: String(raw.artist ?? 'Unknown'),
    duration:
      typeof raw.durationSeconds === 'number'
        ? `${Math.floor(raw.durationSeconds / 60)}:${String(raw.durationSeconds % 60).padStart(2, '0')}`
        : String(raw.duration ?? '0:00'),
    audioUrl: raw.audioUrl ?? '',
    coverImage: raw.coverImage ?? '',
  };
}

function parsePlaylist(raw: any): PlaylistItem {
  return {
    id: raw.id,
    name: raw.name ?? 'Untitled',
    description: raw.description,
    coverUrl: raw.coverUrl,
    userId: raw.userId,
    createdByName: raw.createdByName ?? raw.user?.username,
    isPublic: raw.isPublic ?? true,
    trackCount: raw.trackCount ?? 0,
    totalDurationSeconds: raw.totalDurationSeconds ?? 0,
    tracks: Array.isArray(raw.tracks) ? raw.tracks.map(parseTrack) : undefined,
    createdAt: raw.createdAt ?? '',
  };
}

export const usePlaylistStore = create<PlaylistState>()((set, get) => ({
  playlists: [],
  isOpen: false,
  pendingTrack: null,

  openDrawer: () => {
    get().fetchPlaylists();
    set({ isOpen: true });
  },
  closeDrawer: () => set({ isOpen: false, pendingTrack: null }),

  setPlaylists: (playlists) => set({ playlists }),

  setPendingTrack: (track) => set({ pendingTrack: track }),

  createPlaylist: async (name: string, coverUrl?: string) => {
    try {
      const res = await fetch('/api/v1/music/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, coverUrl }),
      });

      if (res.status === 401) {
        toast.error('Vui lòng đăng nhập để tạo playlist');
        return null;
      }

      const data = await res.json();
      if (data.success) {
        const created = parsePlaylist(data.data);
        set((s) => ({ playlists: [created, ...s.playlists] }));
        set({ isOpen: false, pendingTrack: null });
        toast.success(`Đã tạo playlist "${created.name}"`);
        return created;
      }
      toast.error(data.message || 'Tạo playlist thất bại');
      return null;
    } catch (err) {
      console.error('[PlaylistStore] create error:', err);
      toast.error('Tạo playlist thất bại');
      return null;
    }
  },

  deletePlaylist: async (id: number) => {
    try {
      const res = await fetch(`/api/v1/music/playlists/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        set((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) }));
        toast.success('Đã xóa playlist');
      }
    } catch (err) {
      console.error('[PlaylistStore] delete error:', err);
      toast.error('Xóa playlist thất bại');
    }
  },

  addTrackToPlaylist: async (playlistId: number, track: Track) => {
    try {
      const res = await fetch(`/api/v1/music/playlists/${playlistId}/tracks`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId: parseInt(track.id, 10) }),
      });

      if (res.status === 401) {
        toast.error('Vui lòng đăng nhập để thêm bài hát');
        return { success: false, needsAuth: true };
      }

      const data = await res.json();
      if (data.success) {
        const updated = parsePlaylist(data.data);
        set((s) => ({
          playlists: s.playlists.map((p) => (p.id === playlistId ? updated : p)),
        }));
        toast.success(`Đã thêm "${track.title}" vào playlist`);
        return { success: true };
      }
      toast.error(data.message || 'Thêm bài hát thất bại');
      return { success: false };
    } catch (err) {
      console.error('[PlaylistStore] addTrack error:', err);
      toast.error('Thêm bài hát thất bại');
      return { success: false };
    }
  },

  removeTrackFromPlaylist: async (playlistId: number, trackId: number) => {
    try {
      const res = await fetch(`/api/v1/music/playlists/${playlistId}/tracks/${trackId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        const updated = parsePlaylist(data.data);
        set((s) => ({
          playlists: s.playlists.map((p) => (p.id === playlistId ? updated : p)),
        }));
      }
    } catch (err) {
      console.error('[PlaylistStore] removeTrack error:', err);
    }
  },

  fetchPlaylists: async () => {
    try {
      const res = await fetch('/api/v1/music/playlists', { credentials: 'include' });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        set({ playlists: data.data.map(parsePlaylist) });
      }
    } catch (err) {
      console.error('[PlaylistStore] fetch error:', err);
    }
  },

  playPlaylist: (playlist: PlaylistItem) => {
    const { useMusicStore } = require('@/store/musicStore');
    const tracks = playlist.tracks ?? [];
    if (tracks.length === 0) return;
    const store = useMusicStore.getState();
    const currentAllTracks = store.tracks;
    store.setTracks(tracks);
    store.setAllTracks(currentAllTracks);
    store.playTrackAtIndex(0);
    set({ isOpen: false });
  },
}));
