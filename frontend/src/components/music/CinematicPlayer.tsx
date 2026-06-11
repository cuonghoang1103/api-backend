'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX,
  ChevronUp, ChevronDown, Maximize2, X,
} from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import WaveformVisualizer from './WaveformVisualizer';

import type { Track } from '@/types';

function isSafeCoverUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  return url.startsWith('http') || url.startsWith('/uploads/');
}

interface CinematicPlayerProps {
  isNight?: boolean;
}

export default function CinematicPlayer({ isNight = true }: CinematicPlayerProps) {
  const {
    currentTrack, isPlaying, currentTime, duration, volume, isMuted,
    isShuffled, repeatMode, tracks, currentIndex,
    next, previous, togglePlay, setCurrentTime, setVolume, toggleMute,
    toggleShuffle, cycleRepeat,
  } = useMusicStore();

  const [expanded, setExpanded] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  if (!currentTrack) return null;

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    setCurrentTime(pct * duration);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    setVolume(pct);
  };

  const neonColors = {
    primary: isNight ? '#8b5cf6' : '#6366f1',
    secondary: isNight ? '#ec4899' : '#d946ef',
    glow: isNight ? 'rgba(139,92,246,0.3)' : 'rgba(99,102,241,0.3)',
    text: isNight ? '#f8fafc' : '#1e293b',
    textMuted: isNight ? '#64748b' : '#64748b',
    cardBg: isNight ? 'rgba(18,18,26,0.85)' : 'rgba(255,255,255,0.85)',
    border: isNight ? 'rgba(39,39,42,0.8)' : 'rgba(226,232,240,0.8)',
    progress: isNight ? 'rgba(139,92,246,0.6)' : 'rgba(99,102,241,0.6)',
  };

  return (
    <AnimatePresence>
      {/* Expanded Player View */}
      {expanded ? (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            background: neonColors.cardBg,
            backdropFilter: 'blur(24px)',
            borderTop: `1px solid ${neonColors.border}`,
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-6">
            {/* Expanded content */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Left: Cover + Info */}
              <div className="flex items-center gap-5 w-full lg:w-auto">
                {/* Rotating Cover */}
                <motion.div
                  className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-2xl shrink-0"
                  style={{ boxShadow: `0 0 40px ${neonColors.glow}` }}
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{
                    rotate: {
                      duration: isPlaying ? 20 : 0,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                  }}
                >
                  {isSafeCoverUrl(currentTrack.coverImage) ? (
                    <Image
                      src={currentTrack.coverImage}
                      alt={currentTrack.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${neonColors.primary}, ${neonColors.secondary})`,
                      }}
                    >
                      <span className="text-white/50 text-3xl font-bold">
                        {currentTrack.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Track Info */}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold truncate" style={{ color: neonColors.text }}>
                    {currentTrack.title}
                  </h3>
                  <p className="text-sm truncate" style={{ color: neonColors.textMuted }}>
                    {currentTrack.artist}
                  </p>
                  <div className="mt-2 text-xs" style={{ color: neonColors.textMuted }}>
                    {currentIndex + 1} / {tracks.length}
                  </div>
                </div>
              </div>

              {/* Center: Controls + Progress */}
              <div className="flex-1 w-full">
                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={toggleShuffle}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: isShuffled ? neonColors.primary : neonColors.textMuted }}
                    title="Shuffle"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={previous}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    style={{ color: neonColors.text }}
                    title="Previous"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${neonColors.primary}, ${neonColors.secondary})`,
                      boxShadow: `0 0 30px ${neonColors.glow}`,
                    }}
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </motion.button>
                  <button
                    onClick={next}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    style={{ color: neonColors.text }}
                    title="Next"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                  <button
                    onClick={cycleRepeat}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: repeatMode !== 'none' ? neonColors.primary : neonColors.textMuted }}
                    title="Repeat"
                  >
                    <RepeatIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full flex items-center gap-3">
                  <span className="text-xs tabular-nums" style={{ color: neonColors.textMuted, minWidth: '40px' }}>
                    {formatTime(currentTime)}
                  </span>
                  <div
                    ref={progressRef}
                    onClick={handleProgressClick}
                    className="flex-1 h-1.5 rounded-full cursor-pointer relative overflow-hidden"
                    style={{ background: neonColors.border }}
                  >
                    <motion.div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${neonColors.primary}, ${neonColors.secondary})`,
                      }}
                    />
                  </div>
                  <span className="text-xs tabular-nums" style={{ color: neonColors.textMuted, minWidth: '40px' }}>
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Waveform Visualizer */}
                <div className="mt-3 flex justify-center">
                  <WaveformVisualizer
                    barCount={50}
                    width={400}
                    height={40}
                    isNight={isNight}
                  />
                </div>
              </div>

              {/* Right: Volume + Actions */}
              <div className="flex items-center gap-4 w-full lg:w-auto lg:flex-col lg:items-end">
                {/* Volume */}
                <div className="flex items-center gap-2 w-32">
                  <button
                    onClick={toggleMute}
                    className="shrink-0"
                    style={{ color: neonColors.textMuted }}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <div
                    onClick={handleVolumeChange}
                    className="flex-1 h-1.5 rounded-full cursor-pointer relative overflow-hidden"
                    style={{ background: neonColors.border }}
                  >
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${isMuted ? 0 : volume * 100}%`,
                        background: neonColors.primary,
                      }}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpanded(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    style={{ color: neonColors.textMuted }}
                    title="Minimize"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Mini Bar */
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            background: neonColors.cardBg,
            backdropFilter: 'blur(24px)',
            borderTop: `1px solid ${neonColors.border}`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 py-3">
              {/* Cover */}
              <motion.button
                onClick={() => setExpanded(true)}
                className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSafeCoverUrl(currentTrack.coverImage) ? (
                  <Image
                    src={currentTrack.coverImage}
                    alt={currentTrack.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${neonColors.primary}, ${neonColors.secondary})`,
                    }}
                  >
                    <span className="text-white/50 text-lg font-bold">
                      {currentTrack.title.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Now playing ring */}
                {isPlaying && (
                  <div
                    className="absolute inset-0 rounded-xl animate-pulse"
                    style={{
                      boxShadow: `0 0 0 2px ${neonColors.primary}`,
                      opacity: 0.5,
                    }}
                  />
                )}
              </motion.button>

              {/* Track info */}
              <button
                onClick={() => setExpanded(true)}
                className="flex-1 min-w-0 text-left"
              >
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: neonColors.text }}
                >
                  {currentTrack.title}
                </p>
                <p className="text-xs truncate" style={{ color: neonColors.textMuted }}>
                  {currentTrack.artist}
                </p>
              </button>

              {/* Mini Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${neonColors.primary}, ${neonColors.secondary})`,
                    boxShadow: `0 0 20px ${neonColors.glow}`,
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
                <button
                  onClick={next}
                  className="p-2 rounded-lg hover:bg-white/5"
                  style={{ color: neonColors.textMuted }}
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Expand button */}
              <button
                onClick={() => setExpanded(true)}
                className="p-2 rounded-lg hover:bg-white/5"
                style={{ color: neonColors.textMuted }}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            {/* Mini Progress */}
            <div
              onClick={handleProgressClick}
              className="h-0.5 rounded-full cursor-pointer relative overflow-hidden mb-0 -mt-1 mx-4"
              style={{ background: neonColors.border }}
            >
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${neonColors.primary}, ${neonColors.secondary})`,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
