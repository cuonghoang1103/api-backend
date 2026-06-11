'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX,
  Heart, ListPlus, Maximize2,
} from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';

function isSafeCoverUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  return url.startsWith('http') || url.startsWith('/uploads/');
}

interface PremiumNowPlayingProps {
  isNight?: boolean;
}

export default function PremiumNowPlaying({ isNight = true }: PremiumNowPlayingProps) {
  const {
    currentTrack, isPlaying, currentTime, duration, volume, isMuted,
    isShuffled, repeatMode, tracks, currentIndex,
    next, previous, togglePlay, setCurrentTime, setVolume, toggleMute,
    toggleShuffle, cycleRepeat,
  } = useMusicStore();

  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [showVolume, setShowVolume] = useState(false);

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
    const pct = Math.max(0, Math.min(1, x / rect.width));
    setCurrentTime(pct * duration);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    setVolume(pct);
  };

  const c = {
    primary: '#a855f7',
    secondary: '#ec4899',
    tertiary: '#22d3ee',
    glow: 'rgba(168,85,247,0.4)',
    glowStrong: 'rgba(168,85,247,0.6)',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    glassBg: 'rgba(15,10,30,0.75)',
    glassBgLight: 'rgba(20,15,40,0.6)',
    border: 'rgba(168,85,247,0.15)',
    borderLight: 'rgba(168,85,247,0.08)',
    progress: 'rgba(168,85,247,0.6)',
    progressBg: 'rgba(255,255,255,0.08)',
  };

  if (!currentTrack) {
    return (
      <div
        className="w-full rounded-3xl overflow-hidden"
        style={{
          background: c.glassBg,
          backdropFilter: 'blur(32px)',
          border: `1px solid ${c.border}`,
        }}
      >
        <div className="p-8 flex flex-col items-center justify-center min-h-[420px]">
          {/* Empty state */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div
              className="w-32 h-32 rounded-3xl mx-auto mb-6 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${c.primary}20, ${c.secondary}20)`,
                border: `1px solid ${c.border}`,
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c.primary} strokeWidth="1.5" opacity="0.5">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: c.text }}>No track selected</h3>
            <p className="text-sm" style={{ color: c.textMuted }}>
              Pick a track from the playlist to start
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ background: c.primary, opacity: 0.3 }}
                  animate={{ height: [8, 24, 8] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full rounded-3xl overflow-hidden"
      style={{
        background: c.glassBg,
        backdropFilter: 'blur(32px)',
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 80px ${c.glow}, 0 25px 50px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Top accent line */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${c.primary}, ${c.secondary}, ${c.tertiary}, transparent)`,
        }}
      />

      <div className="p-6">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-5">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: c.primary }}
            animate={isPlaying ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: c.primary }}
          >
            Now Playing
          </span>
        </div>

        {/* Album Art + Info Row */}
        <div className="flex gap-5 items-center mb-6">
          {/* Rotating Vinyl Disc */}
          <VinylDisc
            coverImage={currentTrack.coverImage}
            title={currentTrack.title}
            isPlaying={isPlaying}
            primary={c.primary}
            glow={c.glowStrong}
          />

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <motion.h2
              key={currentTrack.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg md:text-xl font-bold truncate mb-1"
              style={{
                background: `linear-gradient(135deg, ${c.text}, ${c.primary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {currentTrack.title}
            </motion.h2>
            <p className="text-sm truncate" style={{ color: c.textSecondary }}>
              {currentTrack.artist}
            </p>

            {/* Mood tag */}
            <div className="flex items-center gap-2 mt-2">
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: `${c.primary}15`,
                  border: `1px solid ${c.border}`,
                  color: c.primary,
                }}
              >
                Chill
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: `${c.tertiary}15`,
                  border: `1px solid rgba(34,211,238,0.15)`,
                  color: c.tertiary,
                }}
              >
                Coding
              </span>
            </div>
          </div>
        </div>

        {/* Waveform Visualizer */}
        <div className="mb-5">
          <WaveformDisplay isPlaying={isPlaying} primaryColor={c.primary} secondaryColor={c.secondary} />
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="relative h-1.5 rounded-full cursor-pointer group"
            style={{ background: c.progressBg }}
          >
            {/* Glow under progress */}
            <div
              className="absolute top-1/2 left-0 h-4 -translate-y-1/2 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${c.primary}, ${c.secondary})`,
                boxShadow: `0 0 12px ${c.glow}`,
                filter: 'blur(4px)',
              }}
            />
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${c.primary}, ${c.secondary})`,
              }}
            />
            {/* Thumb */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                left: `${progress}%`,
                background: c.text,
                boxShadow: `0 0 10px ${c.glow}`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] tabular-nums" style={{ color: c.textMuted }}>
              {formatTime(currentTime)}
            </span>
            <span className="text-[11px] tabular-nums" style={{ color: c.textMuted }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Left: Shuffle + Repeat */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleShuffle}
              className="p-2 rounded-xl transition-all"
              style={{ color: isShuffled ? c.primary : c.textMuted }}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={cycleRepeat}
              className="p-2 rounded-xl transition-all relative"
              style={{ color: repeatMode !== 'none' ? c.primary : c.textMuted }}
              title="Repeat"
            >
              <RepeatIcon className="w-4 h-4" />
              {repeatMode === 'one' && (
                <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold" style={{ color: c.primary }}>1</span>
              )}
            </motion.button>
          </div>

          {/* Center: Play Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={previous}
              className="p-2 rounded-xl transition-all"
              style={{ color: c.text }}
              title="Previous"
            >
              <SkipBack className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={togglePlay}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                boxShadow: `0 0 30px ${c.glow}`,
              }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="p-2 rounded-xl transition-all"
              style={{ color: c.text }}
              title="Next"
            >
              <SkipForward className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Right: Volume + Actions */}
          <div className="flex items-center gap-1">
            {/* Volume */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}
                className="p-2 rounded-xl transition-all"
                style={{ color: c.textMuted }}
                title="Volume"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : volume < 0.5 ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </motion.button>

              <AnimatePresence>
                {showVolume && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded-xl"
                    style={{
                      background: c.glassBgLight,
                      backdropFilter: 'blur(16px)',
                      border: `1px solid ${c.border}`,
                      minWidth: '120px',
                    }}
                    onMouseEnter={() => setShowVolume(true)}
                    onMouseLeave={() => setShowVolume(false)}
                  >
                    <div
                      ref={volumeRef}
                      onClick={handleVolumeClick}
                      className="relative h-1.5 rounded-full cursor-pointer"
                      style={{ background: c.progressBg }}
                    >
                      <div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{
                          width: `${isMuted ? 0 : volume * 100}%`,
                          background: `linear-gradient(90deg, ${c.primary}, ${c.secondary})`,
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Like */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl transition-all"
              style={{ color: c.textMuted }}
              title="Like"
            >
              <Heart className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Track index */}
        <div className="text-center mt-4 text-xs" style={{ color: c.textMuted }}>
          {currentIndex + 1} / {tracks.length}
        </div>
      </div>
    </motion.div>
  );
}

// Rotating vinyl disc — cover art spins on a circular record
function VinylDisc({
  coverImage,
  title,
  isPlaying,
  primary,
  glow,
}: {
  coverImage: string;
  title: string;
  isPlaying: boolean;
  primary: string;
  glow: string;
}) {
  const DISC_SIZE = 120; // px

  return (
    <motion.div
      className="relative shrink-0"
      animate={{ rotate: isPlaying ? 360 : 0 }}
      transition={{
        rotate: {
          duration: isPlaying ? 8 : 0,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
      style={{ width: DISC_SIZE, height: DISC_SIZE }}
    >
      {/* Outer glow ring */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${primary}30 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Vinyl record base (dark disc) */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #1a1a2e 0%, #0d0d15 60%, #080810 100%)',
          boxShadow: `0 0 30px ${glow}, 0 0 60px ${glow}40, inset 0 0 20px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Vinyl grooves texture */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              inset: `${8 + i * 10}px`,
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          />
        ))}

        {/* Shiny highlight */}
        <div
          className="absolute rounded-full"
          style={{
            top: '5%',
            left: '10%',
            width: '35%',
            height: '20%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Cover art (center label) */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${DISC_SIZE * 0.45}px`,
          height: `${DISC_SIZE * 0.45}px`,
          boxShadow: `0 0 20px ${glow}, 0 2px 8px rgba(0,0,0,0.8)`,
        }}
      >
        {isSafeCoverUrl(coverImage) ? (
          <Image
            src={coverImage}
            alt={title}
            width={DISC_SIZE * 0.45}
            height={DISC_SIZE * 0.45}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${primary}, #ec4899)` }}
          >
            <span className="text-white/60 font-bold text-2xl">
              {title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Center spindle */}
      <div
        className="absolute rounded-full"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '10px',
          height: '10px',
          background: 'radial-gradient(circle, #2a2a3a 0%, #111118 100%)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.8)',
        }}
      />

      {/* Tonearm hint — small gradient when playing */}
      {isPlaying && (
        <div
          className="absolute"
          style={{
            top: '50%',
            right: '-4px',
            transform: 'translateY(-50%)',
            width: '28px',
            height: '3px',
            borderRadius: '2px',
            background: `linear-gradient(to left, ${primary}, transparent)`,
            opacity: 0.6,
          }}
        />
      )}
    </motion.div>
  );
}

// Canvas-based waveform display
function WaveformDisplay({
  isPlaying,
  primaryColor,
  secondaryColor,
}: {
  isPlaying: boolean;
  primaryColor: string;
  secondaryColor: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const BAR_COUNT = 60;
    const BAR_GAP = 2;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const barW = (width - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT;
    const minH = 3;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < BAR_COUNT; i++) {
        const x = i * (barW + BAR_GAP);
        const norm = i / BAR_COUNT;

        let barH: number;
        if (isPlaying) {
          const wave1 = Math.sin(phaseRef.current + norm * Math.PI * 4) * 0.5 + 0.5;
          const wave2 = Math.sin(phaseRef.current * 1.3 + norm * Math.PI * 6) * 0.3 + 0.5;
          const wave3 = Math.sin(phaseRef.current * 0.8 + norm * Math.PI * 2.5) * 0.2 + 0.5;
          const noise = Math.random() * 0.15;
          barH = minH + (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2 + noise) * (height - minH);
        } else {
          barH = minH + Math.sin(norm * Math.PI) * (height * 0.15);
        }

        const y = (height - barH) / 2;

        // Gradient
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        grad.addColorStop(0, primaryColor);
        grad.addColorStop(0.5, secondaryColor);
        grad.addColorStop(1, primaryColor);

        // Glow
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = isPlaying ? 8 : 0;

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, barW / 2);
        ctx.fill();

        // Reflection
        if (isPlaying) {
          ctx.fillStyle = `${primaryColor}12`;
          ctx.beginPath();
          ctx.roundRect(x, height - y + 2, barW, barH * 0.3, barW / 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
      }

      if (isPlaying) {
        phaseRef.current += 0.06;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, primaryColor, secondaryColor]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-14 rounded-xl"
      style={{ display: 'block' }}
    />
  );
}
