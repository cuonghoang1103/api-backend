'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Pause, ArrowLeft, ListMusic, Trash2, Clock, Plus, X, Loader2 } from 'lucide-react';
import { usePlaylistDetail, useRemoveTrackFromPlaylist, useDeletePlaylist } from '@/hooks/useMusicQueries';
import type { Playlist, Track } from '@/types';
import { formatDuration } from '@/hooks/useMusicQueries';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80';

interface PlaylistViewProps {
  playlistId: number;
  onBack: () => void;
}

function normalizeTrack(raw: {
  id: number;
  title: string;
  artist: string;
  audioUrl?: string | null;
  coverImage?: string | null;
  durationSeconds?: number | null;
  fileSize?: BigInt | null;
  localPath?: string | null;
  active?: boolean | null;
  createdAt?: string | Date | null;
}): Track {
  const audioUrl = raw.audioUrl?.trim()
    || (raw.localPath?.trim() ? `/uploads/${raw.localPath.replace(/^\/+/, '')}` : '')
    || `/api/v1/music/stream/${raw.id}`;
  return {
    id: String(raw.id),
    title: raw.title ?? 'Unknown',
    artist: raw.artist ?? 'Unknown Artist',
    duration: raw.durationSeconds ? formatDuration(raw.durationSeconds) : '0:00',
    durationSeconds: Number(raw.durationSeconds ?? 0) || undefined,
    audioUrl,
    coverImage: raw.coverImage ?? '',
    localPath: raw.localPath ?? undefined,
    fileSize: raw.fileSize != null ? Number(raw.fileSize) : undefined,
    active: raw.active ?? undefined,
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
  };
}

function PlaylistTrackRow({
  item,
  index,
  onRemove,
  onPlay,
  isPlaying,
  currentTrackId,
}: {
  item: { position: number; addedAt: string; track: ReturnType<typeof normalizeTrack> };
  index: number;
  onRemove: () => void;
  onPlay: () => void;
  isPlaying: boolean;
  currentTrackId?: string;
}) {
  const t = item.track;
  const isActive = currentTrackId === t.id;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 rounded-xl group transition-colors cursor-pointer ${isActive ? 'bg-white/5' : ''}`}
      onClick={onPlay}
    >
      {/* Number / Play */}
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

      {/* Cover */}
      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
        {t.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.coverImage} alt={t.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
            <span className="text-white/50 text-xs font-bold">{t.title.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-neon-violet' : 'text-white'}`}>
          {t.title}
        </p>
        <p className="text-xs text-gray-500 truncate">{t.artist}</p>
      </div>

      {/* Duration */}
      <div className="text-xs text-gray-500 tabular-nums w-10 text-right shrink-0">
        {t.duration}
      </div>

      {/* Remove */}
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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const playlist: Playlist | undefined = data?.data;
  const tracks = (playlist?.tracks ?? []).map((item) => ({
    ...item,
    track: normalizeTrack(item.track as unknown as Parameters<typeof normalizeTrack>[0]),
  }));
  const totalSec = tracks.reduce((acc, t) => acc + (t.track.durationSeconds ?? 0), 0);

  const handlePlayAll = useCallback(() => {
    if (tracks.length === 0) return;
    // Set all tracks in store and play first
    const { useMusicStore } = require('@/store/musicStore');
    const allTracks = tracks.map((t: { track: Track }) => t.track);
    useMusicStore.getState().setTracks(allTracks);
    useMusicStore.getState().playTrackAtIndex(0);
  }, [tracks]);

  const handlePlayTrack = useCallback((index: number) => {
    const { useMusicStore } = require('@/store/musicStore');
    const allTracks = tracks.map((t: { track: Track }) => t.track);
    useMusicStore.getState().setTracks(allTracks);
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
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Tat ca bai hat
      </button>

      {/* Playlist header */}
      <div className="flex items-end gap-6 mb-8">
        {/* Cover */}
        <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-2xl shadow-neon-violet/20 shrink-0">
          {playlist.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : tracks.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tracks[0].track.coverImage || DEFAULT_COVER}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
              <ListMusic className="w-16 h-16 text-white/30" />
            </div>
          )}
        </div>

        {/* Info */}
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
            <span>{tracks.length} {tracks.length === 1 ? 'bai hat' : 'bai hat'}</span>
            {totalSec > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(totalSec)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
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

      {/* Track list */}
      {tracks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">Playlist trong</p>
          <p className="text-xs mt-1">Them nhac vao playlist tu trang quan ly</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {tracks.map((item: { position: number; track: Track }, idx: number) => (
            <PlaylistTrackRow
              key={item.track.id}
              item={item}
              index={idx}
              onRemove={() => handleRemove(Number(item.track.id))}
              onPlay={() => handlePlayTrack(idx)}
              isPlaying={isPlaying}
              currentTrackId={currentTrack?.id}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation */}
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
