'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import { usePlaylistStore } from '@/store/playlistStore';
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

export default function CyberPlaylist() {
  const {
    tracks, currentTrack, isPlaying, playTrackAtIndex,
    allTracks, savedAllTracks, restoreAllTracks, recentlyPlayed,
  } = useMusicStore();
  const { openDrawer, setPendingTrack } = usePlaylistStore();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'tracks' | 'history' | 'info'>('tracks');

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
    if (!debouncedSearch) return tracks;
    const q = debouncedSearch.toLowerCase();
    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q),
    );
  }, [tracks, debouncedSearch]);

  const totalDuration = useMemo(
    () => tracks.reduce((acc, t) => acc + parseDuration(t.duration), 0),
    [tracks],
  );

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
            {isSafeUrl(tracks[0]?.coverImage) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tracks[0].coverImage}
                alt="Playlist"
                className="object-cover w-full h-full"
                style={{ width: 56, height: 56 }}
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
              {activeTab === 'history' ? 'RECENT_SIGNALS' : 'FULL_TRACKLIST'}
            </h2>
            <p className="text-[11px] font-mono" style={{ color: C.textMuted }}>
              {activeTab === 'history'
                ? `${recentlyPlayed.length} signals logged`
                : `${tracks.length} tracks | ${formatTotal(totalDuration)}`}
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-4">
          {(['tracks', 'history', 'info'] as const).map((tab) => {
            const labels = { tracks: 'TRACKS', history: 'HISTORY', info: 'SYS.INFO' };
            const isActive = activeTab === tab;
            return (
              <motion.button
                key={tab}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all"
                style={{
                  background: isActive ? `${C.primary}20` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? `${C.primary}50` : C.border}`,
                  color: isActive ? C.primary : C.textMuted,
                }}
              >
                {labels[tab]}
              </motion.button>
            );
          })}
        </div>

        {/* Search — tracks tab */}
        {activeTab === 'tracks' && (
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

      {/* Track list */}
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
                  onPlay={() => handlePlayTrack(track)}
                  onAddToPlaylist={() => handleAddToPlaylist(track)}
                  colors={C}
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
                    onPlay={() => handlePlayTrack(track)}
                    onAddToPlaylist={() => handleAddToPlaylist(track)}
                    colors={C}
                    dimmed
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
  track, index, isActive, isPlaying, onPlay, onAddToPlaylist, colors, dimmed = false,
}: {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onAddToPlaylist: () => void;
  colors: typeof C;
  dimmed?: boolean;
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
      {/* Index / playing indicator */}
      <div className="w-7 flex items-center justify-center shrink-0">
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-5">
            <div className="w-1 rounded-full cyber-bar-1" style={{ background: colors.primary, height: 4 }} />
            <div className="w-1 rounded-full cyber-bar-2" style={{ background: colors.primary, height: 4 }} />
            <div className="w-1 rounded-full cyber-bar-3" style={{ background: colors.primary, height: 4 }} />
          </div>
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
        {isSafeUrl(track.coverImage) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.coverImage}
            alt={track.title}
            style={{ width: 44, height: 44 }}
            className="object-cover w-full h-full"
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

      {/* Add to playlist */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => { e.stopPropagation(); onAddToPlaylist(); }}
        className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        style={{ background: `${colors.primary}15`, color: colors.primary }}
        title="Add to playlist"
      >
        <Plus className="w-3.5 h-3.5" />
      </motion.button>

      {/* Duration */}
      <span className="text-[11px] tabular-nums font-mono shrink-0" style={{ color: colors.textMuted }}>
        {track.duration}
      </span>
    </motion.div>
  );
});
