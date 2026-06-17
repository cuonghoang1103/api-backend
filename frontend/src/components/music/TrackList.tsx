'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Trash2, AlertTriangle } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import { useAuthStore } from '@/store/authStore';
import type { Track } from '@/types';

interface TrackListProps {
  onUploadClick?: () => void;
}

// ============================================================
// Broken track handling:
// Tracks with id starting with "local-" that couldn't restore their
// blob URL after reload will have audioUrl = "".
// We show a warning badge and offer to re-upload or delete.
// ============================================================

function TrackItem({
  track,
  index,
  onDelete,
}: {
  track: Track;
  index: number;
  onDelete: (id: string) => void;
}) {
  const { currentTrack, isPlaying, playTrack } = useMusicStore();
  const isAdmin = useAuthStore(
    (s) => s.user?.roles?.some((r: string) => r.replace('ROLE_', '').toUpperCase() === 'ADMIN')
  );
  const isActive = currentTrack?.id === track.id;
  const isBroken = !track.audioUrl;
  const [imgError, setImgError] = useState(false);

  const handlePlay = () => {
    if (isBroken) return;
    if (isActive) {
      useMusicStore.getState().togglePlay();
    } else {
      playTrack(track);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
          transition-all duration-200
          ${isBroken
            ? 'opacity-50 bg-red-500/5 border border-red-500/10'
            : isActive
            ? 'bg-neon-violet/15 border border-neon-violet/20'
            : 'hover:bg-darkcard/60 border border-transparent'
          }
        `}
      >
        {/* Index / Play indicator */}
        <div className="w-7 flex items-center justify-center shrink-0">
          {isActive && isPlaying && !isBroken ? (
            <div className="flex items-end gap-0.5 h-4">
              {/* CSS keyframes — GPU-only, no JS animation overhead */}
              <div className="w-1 rounded-full track-bar-1" />
              <div className="w-1 rounded-full track-bar-2" />
              <div className="w-1 rounded-full track-bar-3" />
            </div>
          ) : (
            <span className={`text-xs font-medium ${isActive ? 'text-neon-violet' : 'text-text-muted/60'}`}>
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Cover */}
        <button
          onClick={handlePlay}
          className={`relative w-10 h-10 rounded-lg overflow-hidden shrink-0 group/play ${
            isBroken ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {track.coverImage && !imgError ? (
            <img
              src={track.coverImage}
              alt={track.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
              <span className="text-white/50 text-sm font-bold">{track.title.charAt(0)}</span>
            </div>
          )}
          {!isBroken && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/play:opacity-100 transition-opacity">
              {isActive && isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </div>
          )}
          {isActive && !isBroken && (
            <div className="absolute inset-0 ring-2 ring-neon-violet/60 rounded-lg" />
          )}
        </button>

        {/* Info */}
        <button
          onClick={handlePlay}
          className={`flex-1 min-w-0 text-left ${isBroken ? 'cursor-not-allowed' : ''}`}
          title={isBroken ? 'Track unavailable — file not found after reload. Please re-upload.' : track.title}
        >
          <div className="flex items-center gap-1.5">
            <p className={`text-sm font-medium truncate ${isActive ? 'text-neon-violet' : isBroken ? 'text-red-400' : 'text-text-primary'}`}>
              {track.title}
            </p>
            {isBroken && (
              <span className="shrink-0">
                <AlertTriangle className="w-3 h-3 text-red-400" />
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted truncate">{track.artist}</p>
        </button>

        {/* Broken track re-upload hint */}
        {isBroken && isAdmin && (
          <span className="text-[10px] text-red-400 shrink-0 hidden sm:block">
            Re-upload to fix
          </span>
        )}

        {/* Delete (admin only) */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(track.id);
            }}
            className="p-1.5 rounded-lg text-text-muted/40 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            title="Delete track"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Duration */}
        <span className="text-xs text-text-muted shrink-0 font-mono w-12 text-right">
          {track.duration}
        </span>
      </div>
    </motion.div>
  );
}

function DeleteConfirmDialog({
  track,
  onConfirm,
  onCancel,
}: {
  track: Track;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onCancel} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="relative z-50 bg-darkcard rounded-2xl border border-darkborder shadow-2xl w-full max-w-sm p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-text-primary">Delete Track?</h3>
            <p className="text-sm text-text-muted mt-1">
              Are you sure you want to delete{' '}
              <span className="text-text-primary font-medium">&ldquo;{track.title}&rdquo;</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TrackList({ onUploadClick }: TrackListProps) {
  const { playTrackAtIndex, deleteTrack, currentTrack } = useMusicStore();
  const isAdmin = useAuthStore(
    (s) => s.user?.roles?.some((r: string) => r.replace('ROLE_', '').toUpperCase() === 'ADMIN')
  );
  const [deleteTarget, setDeleteTarget] = useState<Track | null>(null);

  // Get tracks directly from the global store
  const tracks = useMusicStore((s) => s.tracks);

  const totalSeconds = useMemo(() => tracks.reduce((acc, t) => {
    const parts = t.duration.split(':').map(Number);
    return acc + (parts[0] * 60 + (parts[1] || 0));
  }, 0), [tracks]);

  const formatTotal = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const brokenCount = useMemo(() => tracks.filter((t) => !t.audioUrl).length, [tracks]);

  const handlePlayAll = () => {
    const firstPlayable = tracks.find((t) => t.audioUrl);
    if (firstPlayable) playTrackAtIndex(tracks.indexOf(firstPlayable));
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      if (currentTrack?.id === deleteTarget.id) {
        useMusicStore.getState().pause();
      }
      deleteTrack(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmDialog
            track={deleteTarget}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <span className="text-sm text-text-muted">
              {tracks.length} tracks &bull; {formatTotal(totalSeconds)}
            </span>
            {brokenCount > 0 && (
              <span className="ml-2 text-xs text-red-400">
                ({brokenCount} unavailable — re-upload to fix)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={onUploadClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-neon-violet/10 border border-neon-violet/20 text-neon-violet text-xs font-medium rounded-xl hover:bg-neon-violet/20 transition-colors"
              >
                <span className="text-base leading-none">+</span>
                Upload
              </button>
            )}
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              <Play className="w-3.5 h-3.5" fill="currentColor" />
              Play All
            </button>
          </div>
        </div>

        {/* Empty state */}
        {tracks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-darkborder rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-text-muted/30" />
            </div>
            <p className="text-text-muted text-sm">No tracks yet</p>
            {isAdmin && (
              <button
                onClick={onUploadClick}
                className="mt-3 text-sm text-neon-violet hover:underline"
              >
                Upload your first track
              </button>
            )}
          </div>
        )}

        {/* Track list */}
        <AnimatePresence>
          <div className="space-y-0.5">
            {tracks.map((track, i) => (
              <TrackItem
                key={track.id}
                track={track}
                index={i}
                onDelete={(id) => {
                  const t = tracks.find((tr) => tr.id === id);
                  if (t) setDeleteTarget(t);
                }}
              />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </>
  );
}
