'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Search, Music, Loader2, ListMusic, Plus, ImagePlus } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import { usePlaylistStore } from '@/store/playlistStore';
import type { Track } from '@/types';

function isSafeCoverUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  return url.startsWith('http') || url.startsWith('/uploads/');
}

interface PremiumPlaylistProps {
  isNight?: boolean;
}

export default function PremiumPlaylist({ isNight = true }: PremiumPlaylistProps) {
  const { tracks, currentTrack, isPlaying, playTrackAtIndex, allTracks, savedAllTracks, restoreAllTracks } = useMusicStore();
  const [search, setSearch] = useState('');
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'tracks' | 'playlists'>('tracks');
  const [showingPlaylistId, setShowingPlaylistId] = useState<string | null>(null);

  const { playlists, fetchPlaylists, createPlaylist, playPlaylist } = usePlaylistStore();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [pendingCover, setPendingCover] = useState<string | null>(null);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);

  // ── Debounced search ─────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 300);
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  // ── Memoized derived values ─────────────────────────────────────
  const filteredTracks = useMemo(() => {
    if (!debouncedSearch) return tracks;
    const q = debouncedSearch.toLowerCase();
    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q),
    );
  }, [tracks, debouncedSearch]);

  const totalDuration = useMemo(() => tracks.reduce((acc, t) => {
    const d = t.duration;
    if (!d) return acc;
    if (d.includes(':')) {
      const parts = d.split(':').map(Number);
      return acc + parts[0] * 60 + (parts[1] || 0);
    }
    return acc + (Number(d) || 0);
  }, 0), [tracks]);

  const formatTotal = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
  };

  const c = {
    primary: '#a855f7',
    secondary: '#ec4899',
    tertiary: '#22d3ee',
    glow: 'rgba(168,85,247,0.2)',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    glassBg: 'rgba(15,10,30,0.75)',
    glassBgLight: 'rgba(20,15,40,0.6)',
    border: 'rgba(168,85,247,0.15)',
    borderLight: 'rgba(168,85,247,0.08)',
    cardBgHover: 'rgba(168,85,247,0.08)',
    activeBg: 'rgba(168,85,247,0.12)',
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingCover(ev.target?.result as string);
    reader.readAsDataURL(file);
    setPendingCoverFile(file);
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
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
    await createPlaylist(newPlaylistName.trim(), coverUrl);
    setNewPlaylistName('');
    setPendingCover(null);
    setPendingCoverFile(null);
    setCreating(false);
  };

  const tabIndicatorStyle = {
    position: 'absolute' as const,
    bottom: 0,
    height: '2px',
    borderRadius: '2px',
    transition: 'all 0.25s ease',
  };

  const activeTabIndex = activeTab === 'tracks' ? 0 : 1;

  return (
    <div
      className="w-full rounded-3xl overflow-hidden"
      style={{
        background: c.glassBg,
        backdropFilter: 'blur(32px)',
        border: `1px solid ${c.border}`,
      }}
    >
      {/* Top accent */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${c.primary}, ${c.secondary}, ${c.tertiary})`,
        }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-14 h-14 rounded-2xl overflow-hidden shrink-0"
            style={{
              background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
              boxShadow: `0 0 30px ${c.glow}`,
            }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            {isSafeCoverUrl(tracks[0]?.coverImage) ? (
              <Image
                src={tracks[0].coverImage}
                alt="Playlist"
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ListMusic className="w-7 h-7 text-white/70" />
              </div>
            )}
          </motion.div>
          <div className="min-w-0 flex-1">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: c.primary }}
            >
              Music
            </span>
            <h2 className="text-base font-bold truncate mt-0.5" style={{ color: c.text }}>
              {activeTab === 'playlists'
                ? 'My Playlists'
                : showingPlaylistId
                ? playlists.find((p) => String(p.id) === showingPlaylistId)?.name || 'Playlist'
                : 'All Tracks'}
            </h2>
            <p className="text-[11px] truncate" style={{ color: c.textMuted }}>
              {activeTab === 'tracks'
                ? showingPlaylistId
                  ? `${tracks.length} tracks`
                  : `All tracks \u2022 ${allTracks.length} \u2022 ${formatTotal(totalDuration)}`
                : `${playlists.length} playlist${playlists.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Tabs + All Tracks + Play All in one row */}
        <div className="flex items-center gap-2 mb-4">
          {/* Tab buttons */}
          <div
            className="relative flex rounded-xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${c.border}` }}
          >
            {/* Sliding indicator */}
            <motion.div
              layout
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              style={{
                ...tabIndicatorStyle,
                left: activeTabIndex === 0 ? 0 : '50%',
                width: '50%',
              }}
              className="bg-neon-violet/20"
            />
            {(['tracks', 'playlists'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'playlists') fetchPlaylists();
                }}
                className="relative z-10 px-4 py-2 text-xs font-semibold capitalize transition-colors"
                style={{ color: activeTab === tab ? c.primary : c.textMuted }}
              >
                {tab === 'tracks' ? 'Tracks' : 'Playlists'}
              </button>
            ))}
          </div>

          {/* All Tracks pill — always visible on tracks tab */}
          {activeTab === 'tracks' && savedAllTracks.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => restoreAllTracks()}
              className="py-2 px-3 rounded-xl text-xs font-medium flex items-center gap-1.5 shrink-0"
              style={{
                background: `${c.tertiary}20`,
                border: `1px solid ${c.tertiary}40`,
                color: c.tertiary,
              }}
            >
              <ListMusic className="w-3 h-3" />
              All Tracks
            </motion.button>
          )}

          {/* Play All — always available */}
          {activeTab === 'tracks' && tracks.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => tracks[0] && playTrackAtIndex(0)}
              className="ml-auto py-2 px-4 rounded-xl font-bold text-xs text-white flex items-center gap-2 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                boxShadow: `0 0 20px ${c.glow}`,
              }}
            >
              <Play className="w-3 h-3" fill="currentColor" />
              Play All
            </motion.button>
          )}
        </div>

        {/* Search — tracks tab only */}
        {activeTab === 'tracks' && (
          <div className="relative mb-3">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: c.textMuted }}
            />
            <input
              type="text"
              placeholder="Search tracks..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${c.border}`,
                color: c.text,
              }}
              onFocus={(e) => { (e.target as HTMLElement).style.borderColor = c.primary; (e.target as HTMLElement).style.background = 'rgba(168,85,247,0.05)'; }}
              onBlur={(e) => { (e.target as HTMLElement).style.borderColor = c.border; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
            />
          </div>
        )}

        {/* Playlist creation — playlists tab only */}
        {activeTab === 'playlists' && (
          <form onSubmit={handleCreatePlaylist} className="mb-3 space-y-2">
            <div className="flex gap-2 items-center">
              {/* Cover preview */}
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                style={{ border: `1px dashed ${c.border}`, background: 'rgba(255,255,255,0.03)' }}
              >
                {pendingCover ? (
                  <Image src={pendingCover} alt="Cover" width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                  <ImagePlus className="w-5 h-5" style={{ color: c.textMuted }} />
                )}
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                className="hidden"
              />
              <input
                type="text"
                placeholder="New playlist name..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                maxLength={100}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none min-w-0"
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
                disabled={!newPlaylistName.trim() || creating}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Content: Track list OR Playlist list */}
      {activeTab === 'tracks' ? (
        <div
          className="overflow-y-auto px-3 pb-3"
          style={{
            maxHeight: '440px',
            scrollbarWidth: 'thin',
            scrollbarColor: `${c.primary}40 transparent`,
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: c.primary }} />
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Music className="w-12 h-12 mb-3" style={{ color: `${c.primary}40` }} />
              <p className="text-sm font-medium" style={{ color: c.textMuted }}>
                {search ? 'No tracks found' : 'No tracks yet'}
              </p>
              {search && (
                <button onClick={() => setSearch('')} className="mt-2 text-xs underline" style={{ color: c.primary }}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-0.5">
              <AnimatePresence>
                {filteredTracks.map((track, idx) => {
                  const isActive = currentTrack?.id === track.id;
                  const isCurrentlyPlaying = isActive && isPlaying;
                  return (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <PremiumTrackItem
                        track={track}
                        index={idx}
                        isActive={isActive}
                        isPlaying={isCurrentlyPlaying}
                        onPlay={() => {
                          const actualIndex = tracks.indexOf(track);
                          if (actualIndex === useMusicStore.getState().currentIndex && currentTrack?.id === track.id) {
                            useMusicStore.getState().togglePlay();
                          } else {
                            playTrackAtIndex(actualIndex);
                          }
                        }}
                        onAddToPlaylist={() => {
                          usePlaylistStore.getState().setPendingTrack(track);
                          usePlaylistStore.getState().openDrawer();
                        }}
                        colors={c}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : (
        <div
          className="overflow-y-auto px-3 pb-3"
          style={{
            maxHeight: '440px',
            scrollbarWidth: 'thin',
            scrollbarColor: `${c.primary}40 transparent`,
          }}
        >
          {playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <ListMusic className="w-12 h-12 mb-3" style={{ color: `${c.primary}30` }} />
              <p className="text-sm font-medium" style={{ color: c.textMuted }}>No playlists yet</p>
              <p className="text-xs mt-1" style={{ color: c.textMuted, opacity: 0.6 }}>Create one above to get started</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {playlists.map((pl) => (
                <motion.button
                  key={pl.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => { setShowingPlaylistId(String(pl.id)); playPlaylist(pl); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                  style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${c.border}` }}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md">
                    {isSafeCoverUrl(pl.coverUrl) ? (
                      <Image src={pl.coverUrl!} alt={pl.name} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}
                      >
                        <ListMusic className="w-5 h-5 text-white/70" />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,0,0,0.45)' }}
                    >
                      <Play className="w-5 h-5 text-white" fill="currentColor" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: c.text }}>{pl.name}</p>
                    <p className="text-[11px]" style={{ color: c.textMuted }}>
                      {pl.trackCount} track{pl.trackCount !== 1 ? 's' : ''}
                    </p>
                    {pl.createdByName && (
                      <p className="text-[10px] truncate mt-0.5" style={{ color: c.textMuted, opacity: 0.8 }}>
                        Tạo bởi {pl.createdByName}
                      </p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PremiumTrackItem({
  track,
  index,
  isActive,
  isPlaying,
  onPlay,
  onAddToPlaylist,
  colors,
}: {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onAddToPlaylist: () => void;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    glow: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    glassBg: string;
    glassBgLight: string;
    border: string;
    borderLight: string;
    cardBgHover: string;
    activeBg: string;
  };
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onPlay}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group transition-all duration-200"
      style={{
        background: isActive ? colors.activeBg : 'transparent',
        border: `1px solid ${isActive ? 'rgba(168,85,247,0.25)' : 'transparent'}`,
      }}
    >
      {/* Index / Playing indicator */}
      <div className="w-7 flex items-center justify-center shrink-0">
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-5">
            <div className="w-1 rounded-full prem-bar-1" style={{ background: colors.primary }} />
            <div className="w-1 rounded-full prem-bar-2" style={{ background: colors.primary }} />
            <div className="w-1 rounded-full prem-bar-3" style={{ background: colors.primary }} />
          </div>
        ) : (
          <span
            className="text-[11px] font-medium tabular-nums"
            style={{ color: isActive ? colors.primary : colors.textMuted }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Cover */}
      <motion.div
        className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 shadow-md"
        whileHover={{ scale: 1.08 }}
      >
        {isSafeCoverUrl(track.coverImage) ? (
          <Image
            src={track.coverImage}
            alt={track.title}
            width={44}
            height={44}
            className="object-cover w-full h-full"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            <span className="text-white/60 text-sm font-bold">{track.title.charAt(0)}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </div>

        {/* Active ring */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              boxShadow: `0 0 0 2px ${colors.primary}`,
              opacity: 0.6,
            }}
          />
        )}
      </motion.div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: isActive ? colors.primary : colors.text }}
        >
          {track.title}
        </p>
        <p className="text-[11px] truncate" style={{ color: colors.textMuted }}>
          {track.artist}
        </p>
      </div>

      {/* Add to Playlist button */}
      <button
        onClick={(e) => { e.stopPropagation(); onAddToPlaylist(); }}
        className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        style={{ color: colors.primary, background: `${colors.primary}15` }}
        title="Add to Playlist"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Duration */}
      <span className="text-[11px] tabular-nums shrink-0 font-mono" style={{ color: colors.textMuted }}>
        {track.duration}
      </span>
    </motion.div>
  );
}
