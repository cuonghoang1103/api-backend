'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Search, ChevronRight, Music, Loader2 } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import type { Track } from '@/types';

function isSafeCoverUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  return url.startsWith('http') || url.startsWith('/uploads/');
}

interface CinematicPlaylistProps {
  isNight?: boolean;
}

interface NeonColors {
  primary: string;
  secondary: string;
  tertiary: string;
  glow: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBgHover: string;
  border: string;
  borderActive: string;
}

export default function CinematicPlaylist({ isNight = true }: CinematicPlaylistProps) {
  const { tracks, currentTrack, isPlaying, playTrack, playTrackAtIndex, currentIndex } = useMusicStore();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredTracks = tracks.filter((track) =>
    !search ||
    track.title.toLowerCase().includes(search.toLowerCase()) ||
    track.artist.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlayTrack = (track: Track, index: number) => {
    const actualIndex = tracks.indexOf(track);
    if (actualIndex === currentIndex && currentTrack?.id === track.id) {
      useMusicStore.getState().togglePlay();
    } else {
      playTrackAtIndex(actualIndex);
    }
  };

  const neonColors: NeonColors = {
    primary: isNight ? '#8b5cf6' : '#6366f1',
    secondary: isNight ? '#ec4899' : '#d946ef',
    tertiary: isNight ? '#22d3ee' : '#3b82f6',
    glow: isNight ? 'rgba(139,92,246,0.2)' : 'rgba(99,102,241,0.15)',
    text: isNight ? '#f8fafc' : '#1e293b',
    textMuted: isNight ? '#64748b' : '#64748b',
    cardBg: isNight ? 'rgba(18,18,26,0.75)' : 'rgba(255,255,255,0.75)',
    cardBgHover: isNight ? 'rgba(139,92,246,0.15)' : 'rgba(99,102,241,0.1)',
    border: isNight ? 'rgba(39,39,42,0.6)' : 'rgba(226,232,240,0.6)',
    borderActive: isNight ? 'rgba(139,92,246,0.5)' : 'rgba(99,102,241,0.5)',
  };

  const parseDuration = (d: string | number | undefined): number => {
    if (!d && d !== 0) return 0;
    if (typeof d === 'number') return d;
    if (typeof d === 'string' && d.includes(':')) {
      const parts = d.split(':').map(Number);
      return parts[0] * 60 + (parts[1] || 0);
    }
    return Number(d) || 0;
  };

  const totalDuration = tracks.reduce((acc, t) => acc + parseDuration(t.duration), 0);

  const formatTotalDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
  };

  return (
    <div
      className="w-full max-w-md rounded-3xl overflow-hidden"
      style={{
        background: neonColors.cardBg,
        backdropFilter: 'blur(24px)',
        border: `1px solid ${neonColors.border}`,
      }}
    >
      {/* Header */}
      <div className="p-5" style={{ borderBottom: `1px solid ${neonColors.border}` }}>
        {/* Playlist info */}
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shrink-0"
            style={{
              background: `linear-gradient(135deg, ${neonColors.primary}, ${neonColors.secondary})`,
              boxShadow: `0 0 30px ${neonColors.glow}`,
            }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            {isSafeCoverUrl(tracks[0]?.coverImage) ? (
              <Image
                src={tracks[0].coverImage}
                alt="Playlist Cover"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-8 h-8 text-white/70" />
              </div>
            )}
          </motion.div>
          <div className="min-w-0">
            <span
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: neonColors.primary }}
            >
              Playlist
            </span>
            <h2 className="text-lg font-bold truncate mt-0.5" style={{ color: neonColors.text }}>
              Chill Coding Vibes
            </h2>
            <p className="text-xs mt-1" style={{ color: neonColors.textMuted }}>
              with Cuong Hoang &bull; {tracks.length} tracks &bull; {formatTotalDuration(totalDuration)}
            </p>
          </div>
        </div>

        {/* Play all button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => tracks[0] && playTrackAtIndex(0)}
          disabled={tracks.length === 0}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{
            background: `linear-gradient(135deg, ${neonColors.primary}, ${neonColors.secondary})`,
            boxShadow: `0 0 20px ${neonColors.glow}`,
          }}
        >
          <Play className="w-4 h-4" fill="currentColor" />
          Play All
        </motion.button>

        {/* Search */}
        <div className="relative mt-3">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: neonColors.textMuted }}
          />
          <input
            type="text"
            placeholder="Search tracks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: isNight ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${neonColors.border}`,
              color: neonColors.text,
            }}
          />
        </div>
      </div>

      {/* Track list */}
      <div
        className="overflow-y-auto"
        style={{
          maxHeight: '400px',
          scrollbarWidth: 'thin',
          scrollbarColor: `${neonColors.primary} transparent`,
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: neonColors.primary }} />
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <Music className="w-10 h-10 mb-3" style={{ color: neonColors.textMuted }} />
            <p className="text-sm" style={{ color: neonColors.textMuted }}>
              {search ? 'No tracks found' : 'No tracks yet'}
            </p>
          </div>
        ) : (
          <div className="p-2">
            <AnimatePresence>
              {filteredTracks.map((track, idx) => {
                const isActive = currentTrack?.id === track.id;
                const isCurrentlyPlaying = isActive && isPlaying;

                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <TrackItem
                      track={track}
                      index={idx}
                      isActive={isActive}
                      isPlaying={isCurrentlyPlaying}
                      onPlay={() => handlePlayTrack(track, idx)}
                      colors={neonColors}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Now playing indicator */}
      {currentTrack && (
        <div
          className="p-3 flex items-center gap-3"
          style={{ borderTop: `1px solid ${neonColors.border}` }}
        >
          <motion.div
            className="w-8 h-8 rounded-lg overflow-hidden shrink-0"
            animate={{ boxShadow: isPlaying ? [neonColors.glow, `0 0 20px ${neonColors.primary}`, neonColors.glow] : neonColors.glow }}
            transition={{ duration: isPlaying ? 2 : 0, repeat: isPlaying ? Infinity : 0 }}
          >
            {isSafeCoverUrl(currentTrack.coverImage) ? (
              <Image
                src={currentTrack.coverImage}
                alt="Now Playing"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${neonColors.primary}, ${neonColors.secondary})`,
                }}
              >
                <Music className="w-4 h-4 text-white/70" />
              </div>
            )}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ background: neonColors.primary }}
                animate={isPlaying ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
                transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: neonColors.primary }}>
                Now Playing
              </span>
            </div>
            <p className="text-xs font-medium truncate" style={{ color: neonColors.text }}>
              {currentTrack.title}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 shrink-0" style={{ color: neonColors.textMuted }} />
        </div>
      )}
    </div>
  );
}

// Individual track item component
function TrackItem({
  track,
  index,
  isActive,
  isPlaying,
  onPlay,
  colors,
}: {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  colors: NeonColors;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onPlay}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group"
      style={{
        background: isActive ? colors.cardBgHover : 'transparent',
        border: `1px solid ${isActive ? colors.borderActive : 'transparent'}`,
      }}
    >
      {/* Index / Playing indicator */}
      <div className="w-6 flex items-center justify-center shrink-0">
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ background: colors.primary }}
                animate={{ height: [4, 14 + i * 2, 4] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.15,
                }}
              />
            ))}
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
        className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0"
        whileHover={{ scale: 1.05 }}
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
            <span className="text-white/70 text-sm font-bold">{track.title.charAt(0)}</span>
          </div>
        )}

        {/* Hover play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.4)' }}
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
            style={{ boxShadow: `0 0 0 2px ${colors.primary}`, opacity: 0.6 }}
          />
        )}
      </motion.div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{ color: isActive ? colors.primary : colors.text }}
        >
          {track.title}
        </p>
        <p className="text-xs truncate" style={{ color: colors.textMuted }}>
          {track.artist}
        </p>
      </div>

      {/* Duration */}
      <span className="text-xs tabular-nums shrink-0" style={{ color: colors.textMuted }}>
        {track.duration}
      </span>
    </motion.div>
  );
}
