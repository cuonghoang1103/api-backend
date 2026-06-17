'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Plus, Play, Trash2, ListMusic, Check, Loader2, ChevronRight, Music2, ImagePlus,
} from 'lucide-react';
import { usePlaylistStore } from '@/store/playlistStore';
import { useMusicStore } from '@/store/musicStore';
import type { Track } from '@/types';

function isSafeCoverUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  return url.startsWith('http') || url.startsWith('/uploads/');
}

function formatDuration(secs: number): string {
  if (!secs) return '0:00';
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
}

export default function PlaylistDrawer() {
  const {
    playlists, isOpen, pendingTrack,
    closeDrawer, setPendingTrack,
    createPlaylist, deletePlaylist,
    addTrackToPlaylist, removeTrackFromPlaylist,
    fetchPlaylists, playPlaylist,
  } = usePlaylistStore();

  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [addingTo, setAddingTo] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [pendingCover, setPendingCover] = useState<string | null>(null);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);

  // Fetch playlists when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, fetchPlaylists]);

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingCover(ev.target?.result as string);
    reader.readAsDataURL(file);
    setPendingCoverFile(file);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    let coverUrl: string | undefined;
    if (pendingCoverFile) {
      try {
        const fd = new FormData();
        fd.append('file', pendingCoverFile);
        fd.append('category', 'thumbnails');
        const res = await fetch('/api/v1/files/upload', { method: 'POST', credentials: 'include', body: fd });
        const data = await res.json();
        if (data.success) coverUrl = data.data.url;
      } catch (_) {}
    }
    await createPlaylist(newName.trim(), coverUrl);
    setNewName('');
    setPendingCover(null);
    setPendingCoverFile(null);
    setCreating(false);
    inputRef.current?.focus();
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    if (!pendingTrack) return;
    setAddingTo(playlistId);
    const result = await addTrackToPlaylist(playlistId, pendingTrack);
    setAddingTo(null);
    if (result.success) {
      setPendingTrack(null);
      closeDrawer();
    }
  };

  const handleRemoveTrack = async (playlistId: number, trackId: string) => {
    await removeTrackFromPlaylist(playlistId, parseInt(trackId, 10));
  };

  const handlePlayPlaylist = (playlist: typeof playlists[0]) => {
    playPlaylist(playlist);
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const c = {
    primary: '#a855f7',
    secondary: '#ec4899',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    glassBg: 'rgba(10,6,25,0.92)',
    glassBgLight: 'rgba(20,15,40,0.7)',
    border: 'rgba(168,85,247,0.18)',
    borderLight: 'rgba(168,85,247,0.08)',
    danger: '#f43f5e',
    success: '#22c55e',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
            style={{
              background: c.glassBg,
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderLeft: `1px solid ${c.border}`,
              boxShadow: `-20px 0 60px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Top accent */}
            <div
              className="h-0.5 w-full shrink-0"
              style={{
                background: `linear-gradient(90deg, ${c.primary}, ${c.secondary})`,
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}
                >
                  <ListMusic className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold" style={{ color: c.text }}>Playlists</h2>
                  <p className="text-[10px]" style={{ color: c.textMuted }}>{playlists.length} playlist{playlists.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: c.textMuted, background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = c.text; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = c.textMuted; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pending track banner */}
            <AnimatePresence>
              {pendingTrack && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden shrink-0"
                  style={{ borderBottom: `1px solid ${c.border}` }}
                >
                  <div className="px-5 py-3 flex items-center gap-3" style={{ background: `${c.primary}10` }}>
                    <Music2 className="w-4 h-4 shrink-0" style={{ color: c.primary }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: c.text }}>
                        {pendingTrack.title}
                      </p>
                      <p className="text-[10px] truncate" style={{ color: c.textMuted }}>
                        Add to playlist
                      </p>
                    </div>
                    <button
                      onClick={() => setPendingTrack(null)}
                      className="text-[10px] px-2 py-1 rounded-md"
                      style={{ color: c.textMuted, border: `1px solid ${c.border}` }}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Create playlist */}
            <div className="px-5 pt-4 pb-3 shrink-0">
              <form onSubmit={handleCreate} className="flex items-center gap-2">
                {/* Cover upload button */}
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                  style={{ border: `1px dashed ${c.border}`, background: 'rgba(255,255,255,0.03)' }}
                >
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverSelect}
                    className="hidden"
                  />
                  {pendingCover ? (
                    <Image src={pendingCover} alt="Cover" width={40} height={40} className="object-cover w-full h-full" />
                  ) : (
                    <ImagePlus className="w-4 h-4" style={{ color: c.textMuted }} />
                  )}
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New playlist name..."
                  maxLength={100}
                  className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-all min-w-0"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${c.border}`,
                    color: c.text,
                  }}
                  onFocus={(e) => { (e.target as HTMLElement).style.borderColor = c.primary; }}
                  onBlur={(e) => { (e.target as HTMLElement).style.borderColor = c.border; }}
                />
                <button
                  type="submit"
                  disabled={!newName.trim() || creating}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}
                >
                  {creating ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 text-white" />
                  )}
                </button>
              </form>
            </div>

            {/* Playlist list */}
            <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-1">
              {playlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ListMusic className="w-12 h-12 mb-3" style={{ color: `${c.primary}30` }} />
                  <p className="text-sm font-medium" style={{ color: c.textMuted }}>No playlists yet</p>
                  <p className="text-xs mt-1" style={{ color: c.textMuted, opacity: 0.6 }}>
                    Create one above to get started
                  </p>
                </div>
              ) : (
                playlists.map((playlist) => (
                  <PlaylistItem
                    key={playlist.id}
                    playlist={playlist}
                    isExpanded={expandedId === playlist.id}
                    pendingTrack={pendingTrack}
                    addingTo={addingTo}
                    onToggleExpand={() => toggleExpand(playlist.id)}
                    onPlay={() => handlePlayPlaylist(playlist)}
                    onDelete={() => deletePlaylist(playlist.id)}
                    onAddTrack={() => handleAddToPlaylist(playlist.id)}
                    onRemoveTrack={(trackId) => handleRemoveTrack(playlist.id, trackId)}
                    colors={c}
                  />
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PlaylistItem({
  playlist, isExpanded, pendingTrack, addingTo,
  onToggleExpand, onPlay, onDelete, onAddTrack, onRemoveTrack, colors,
}: {
  playlist: { id: number; name: string; coverUrl?: string; createdByName?: string; trackCount: number; totalDurationSeconds: number; tracks?: Track[] };
  isExpanded: boolean;
  pendingTrack: Track | null;
  addingTo: number | null;
  onToggleExpand: () => void;
  onPlay: () => void;
  onDelete: () => void;
  onAddTrack: () => void;
  onRemoveTrack: (trackId: string) => void;
  colors: Record<string, string>;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${colors.border}`, background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Main row */}
      <div className="flex items-center gap-2.5 p-2.5">
        {/* Cover */}
        <button
          onClick={onPlay}
          className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md"
        >
          {isSafeCoverUrl(playlist.coverUrl) && !imgError ? (
            <Image src={playlist.coverUrl!} alt={playlist.name} fill className="object-cover" sizes="48px" onError={() => setImgError(true)} />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
            >
              <ListMusic className="w-5 h-5 text-white/70" />
            </div>
          )}
          {/* Play overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.45)' }}
          >
            <Play className="w-5 h-5 text-white" fill="currentColor" />
          </div>
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: colors.text }}>{playlist.name}</p>
          <p className="text-[11px]" style={{ color: colors.textMuted }}>
            {playlist.trackCount} track{playlist.trackCount !== 1 ? 's' : ''} &bull; {formatDuration(playlist.totalDurationSeconds)}
          </p>
          {playlist.createdByName && (
            <p className="text-[10px] truncate mt-0.5" style={{ color: colors.textMuted, opacity: 0.8 }}>
              Tạo bởi {playlist.createdByName}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {pendingTrack && (
            <button
              onClick={onAddTrack}
              disabled={addingTo === playlist.id}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: colors.success, background: 'rgba(34,197,94,0.1)' }}
              title="Add track to this playlist"
            >
              {addingTo === playlist.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
            </button>
          )}
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: colors.danger, background: 'rgba(244,63,94,0.08)' }}
            title="Delete playlist"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleExpand}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: colors.textMuted, background: 'rgba(255,255,255,0.04)' }}
          >
            <ChevronRight
              className="w-3.5 h-3.5 transition-transform"
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
            />
          </button>
        </div>
      </div>

      {/* Expanded track list */}
      <AnimatePresence>
        {isExpanded && playlist.tracks && playlist.tracks.length > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
            style={{ borderTop: `1px solid ${colors.border}` }}
          >
            <div className="py-1.5 px-2.5 space-y-0.5 max-h-48 overflow-y-auto">
              {playlist.tracks.map((track) => {
                const isPending = pendingTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-lg group"
                    style={{ background: isPending ? `${colors.primary}15` : 'transparent' }}
                  >
                    <Music2 className="w-3.5 h-3.5 shrink-0" style={{ color: isPending ? colors.primary : colors.textMuted }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium truncate" style={{ color: isPending ? colors.primary : colors.text }}>{track.title}</p>
                      <p className="text-[10px] truncate" style={{ color: colors.textMuted }}>{track.artist}</p>
                    </div>
                    <button
                      onClick={() => onRemoveTrack(track.id)}
                      className="w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: colors.danger }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
