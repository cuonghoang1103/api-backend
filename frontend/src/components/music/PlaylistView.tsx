'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ArrowLeft, ListMusic, Trash2, Clock, Loader2, Camera } from 'lucide-react';
import { usePlaylistDetail, useRemoveTrackFromPlaylist, useDeletePlaylist, useUploadPlaylistCover } from '@/hooks/useMusicQueries';
import { toast } from 'sonner';
import type { Playlist, Track } from '@/types';
import { formatDuration } from '@/hooks/useMusicQueries';
import { SafeImage } from '@/components/ui/SafeImage';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80';

interface PlaylistViewProps {
  playlistId: number;
  onBack: () => void;
}

function buildAudioUrl(raw: { audioUrl?: string | null; localPath?: string | null; id: number }): string {
  if (raw.audioUrl?.trim()) return raw.audioUrl;
  if (raw.localPath?.trim()) return `/uploads/${raw.localPath.replace(/^\/+/, '')}`;
  return `/api/v1/music/stream/${raw.id}`;
}

interface PlaylistTrack {
  id: number;
  title: string;
  artist: string;
  audioUrl?: string | null;
  coverImage?: string | null;
  durationSeconds?: number | null;
  localPath?: string | null;
  createdAt?: string;
}

function toTrack(raw: PlaylistTrack): Track {
  return {
    id: String(raw.id),
    title: raw.title ?? 'Unknown',
    artist: raw.artist ?? 'Unknown Artist',
    duration: raw.durationSeconds ? formatDuration(raw.durationSeconds) : '0:00',
    durationSeconds: raw.durationSeconds ?? undefined,
    audioUrl: buildAudioUrl(raw),
    coverImage: raw.coverImage ?? '',
    localPath: raw.localPath ?? undefined,
    createdAt: raw.createdAt ?? undefined,
  };
}

function PlaylistTrackRow({
  track,
  index,
  onRemove,
  onPlay,
  isPlaying,
  currentTrackId,
}: {
  track: Track;
  index: number;
  onRemove: () => void;
  onPlay: () => void;
  isPlaying: boolean;
  currentTrackId?: string;
}) {
  const isActive = currentTrackId === track.id;
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 rounded-xl group transition-colors cursor-pointer ${isActive ? 'bg-white/5' : ''}`}
      onClick={onPlay}
    >
      <div className="w-8 flex items-center justify-center shrink-0">
        {isActive && isPlaying ? (
          <Pause className="w-4 h-4 text-neon-violet" />
        ) : (
          <span className="text-xs text-gray-500 group-hover:hidden">{index + 1}</span>
        )}
        {!isActive && !isPlaying && (
          <Play className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
        {track.coverImage && !imgError ? (
          <img
            src={track.coverImage}
            alt={track.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
            <span className="text-white/50 text-xs font-bold">{track.title.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-neon-violet' : 'text-white'}`}>
          {track.title}
        </p>
        <p className="text-xs text-gray-500 truncate">{track.artist}</p>
      </div>

      <div className="text-xs text-gray-500 tabular-nums w-10 text-right shrink-0">
        {track.duration}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="p-1.5 text-gray-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all rounded-lg hover:bg-red-500/10 shrink-0"
        title="Remove from playlist"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function PlaylistView({ playlistId, onBack }: PlaylistViewProps) {
  const { data, isLoading } = usePlaylistDetail(playlistId);
  const removeTrack = useRemoveTrackFromPlaylist();
  const deletePlaylist = useDeletePlaylist();

  const uploadCover = useUploadPlaylistCover();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [coverImgError, setCoverImgError] = useState(false);

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }
    try {
      await uploadCover.mutateAsync({ playlistId, file });
      setCoverImgError(false);
      toast.success('Đã cập nhật ảnh bìa');
    } catch (err: any) {
      toast.error(
        err?.status === 401
          ? 'Bạn cần đăng nhập'
          : err?.status === 403
            ? 'Bạn không có quyền sửa playlist này'
            : err?.message || 'Tải ảnh thất bại',
      );
    }
  };

  const playlist: Playlist | undefined = data?.data;
  // Backend returns flat tracks — no wrapper needed
  const rawTracks = playlist?.tracks ?? [];
  const tracks: Track[] = rawTracks.map((r) => toTrack(r));

  const totalSec = tracks.reduce((acc, t) => acc + (t.durationSeconds ?? 0), 0);

  const handlePlayAll = useCallback(() => {
    if (tracks.length === 0) return;
    const { useMusicStore } = require('@/store/musicStore');
    useMusicStore.getState().setTracks(tracks);
    useMusicStore.getState().playTrackAtIndex(0);
  }, [tracks]);

  const handlePlayTrack = useCallback((index: number) => {
    const { useMusicStore } = require('@/store/musicStore');
    useMusicStore.getState().setTracks(tracks);
    useMusicStore.getState().playTrackAtIndex(index);
  }, [tracks]);

  const handleRemove = async (trackId: number) => {
    await removeTrack.mutateAsync({ playlistId, trackId });
  };

  const handleDelete = async () => {
    await deletePlaylist.mutateAsync(playlistId);
    onBack();
  };

  const currentTrack = typeof window !== 'undefined'
    ? require('@/store/musicStore').useMusicStore.getState().currentTrack
    : null;
  const isPlaying = typeof window !== 'undefined'
    ? require('@/store/musicStore').useMusicStore.getState().isPlaying
    : false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-neon-violet animate-spin" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Playlist not found</p>
        <button onClick={onBack} className="mt-4 text-neon-violet underline text-sm">
          Quay lai
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Tat ca bai hat
      </button>

      <div className="flex items-end gap-6 mb-8">
        <div className="group relative w-44 h-44 rounded-2xl overflow-hidden shadow-2xl shadow-neon-violet/20 shrink-0">
          {playlist.coverUrl && !coverImgError ? (
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              className="w-full h-full object-cover"
              onError={() => setCoverImgError(true)}
            />
          ) : tracks.length > 0 ? (
            <img
              src={tracks[0].coverImage || DEFAULT_COVER}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
              <ListMusic className="w-16 h-16 text-white/30" />
            </div>
          )}

          {/* Phase 2b: upload custom cover (owner/admin enforced server-side) */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverSelect}
          />
          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadCover.isPending}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/60 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:cursor-wait"
            title="Đổi ảnh bìa"
          >
            {uploadCover.isPending ? (
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            ) : (
              <>
                <Camera className="w-7 h-7 text-white" />
                <span className="text-[10px] font-mono text-white uppercase tracking-wider">Đổi bìa</span>
              </>
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Playlist</p>
          <h1 className="text-3xl font-bold text-white mb-1 truncate">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-sm text-gray-400 mb-1">{playlist.description}</p>
          )}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {playlist.user && (
              <span>Tao boi <span className="text-gray-300">{playlist.user.username}</span></span>
            )}
            <span>{tracks.length} bai hat</span>
            {totalSec > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(totalSec)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-neon-violet text-white font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          <Play className="w-4 h-4 fill-white" />
          Nghe tat ca
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-red-400 text-sm transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Xoa Playlist
        </button>
      </div>

      {tracks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">Playlist trong</p>
          <p className="text-xs mt-1">Them nhac vao playlist tu trang quan ly</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {tracks.map((track, idx) => (
            <PlaylistTrackRow
              key={track.id}
              track={track}
              index={idx}
              onRemove={() => handleRemove(Number(track.id))}
              onPlay={() => handlePlayTrack(idx)}
              isPlaying={isPlaying}
              currentTrackId={currentTrack?.id}
            />
          ))}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-darkcard border border-darkborder rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Xoa Playlist?</h3>
            <p className="text-sm text-gray-400 mb-5">
              Ban that su muon xoa playlist "{playlist.name}"? Hanh dong nay khong the hoan tac.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-darkborder rounded-xl text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              >
                Huy
              </button>
              <button
                onClick={() => void handleDelete()}
                disabled={deletePlaylist.isPending}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletePlaylist.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Xoa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
