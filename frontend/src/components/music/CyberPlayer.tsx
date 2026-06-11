'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useMusicStore } from '@/store/musicStore';
import CyberAudioVisualizer from './CyberAudioVisualizer';

function isSafeUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  return url.startsWith('http') || url.startsWith('/uploads/');
}

const C = {
  primary: '#8B5CF6',
  secondary: '#06b6d4',
  accent: '#ec4899',
  glow: 'rgba(139,92,246,0.4)',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  glassBg: 'rgba(15,23,42,0.75)',
  glassBgLight: 'rgba(20,15,40,0.6)',
  border: 'rgba(139,92,246,0.15)',
  progressBg: 'rgba(255,255,255,0.06)',
};

function MarqueeTitle({
  text, active, className, gradientFrom, gradientTo,
}: {
  text: string;
  active: boolean;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const check = () => {
      const t = textRef.current;
      const c = containerRef.current;
      if (t && c) {
        setIsOverflowing(t.scrollWidth > c.clientWidth);
      }
    };
    check();
    const ro = new ResizeObserver(check);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div ref={containerRef} className="mb-1" style={{ overflow: 'hidden', position: 'relative' }}>
      <div
        className={className}
        style={{
          background: gradientFrom || gradientTo
            ? `linear-gradient(135deg, ${gradientFrom || '#f8fafc'}, ${gradientTo || '#8B5CF6'})`
            : undefined,
          WebkitBackgroundClip: (gradientFrom || gradientTo) ? 'text' : undefined,
          WebkitTextFillColor: (gradientFrom || gradientTo) ? 'transparent' : undefined,
          whiteSpace: 'nowrap',
          display: 'inline-block',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          animation: isOverflowing && active ? 'marquee-player 6s linear infinite' : undefined,
        }}
      >
        {isOverflowing && active ? (
          <span>
            {text}&nbsp;&nbsp;&nbsp;
          </span>
        ) : (
          text
        )}
      </div>
      {isOverflowing && active && (
        <span
          className={className}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            background: gradientFrom || gradientTo
              ? `linear-gradient(135deg, ${gradientFrom || '#f8fafc'}, ${gradientTo || '#8B5CF6'})`
              : undefined,
            WebkitBackgroundClip: (gradientFrom || gradientTo) ? 'text' : undefined,
            WebkitTextFillColor: (gradientFrom || gradientTo) ? 'transparent' : undefined,
            whiteSpace: 'nowrap',
            display: 'inline-block',
            animation: 'marquee-player 6s linear infinite',
            animationDelay: '3s',
          }}
        >
          {text}&nbsp;&nbsp;&nbsp;
        </span>
      )}
      <style>{`
        @keyframes marquee-player {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

function VinylDisc({
  coverImage, title, isPlaying,
}: {
  coverImage: string; title: string; isPlaying: boolean;
}) {
  const SIZE = 160;

  return (
    <motion.div
      className="relative shrink-0"
      animate={{ rotate: isPlaying ? 360 : 0 }}
      transition={{ duration: isPlaying ? 8 : 0, repeat: Infinity, ease: 'linear' }}
      style={{ width: SIZE, height: SIZE }}
    >
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${C.primary}30 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Vinyl base */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #1a1a2e 0%, #0d0d15 60%, #080810 100%)',
          boxShadow: `0 0 40px ${C.glow}, 0 0 80px rgba(139,92,246,0.15), inset 0 0 20px rgba(0,0,0,0.5)`,
        }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{ inset: `${8 + i * 12}px`, border: '1px solid rgba(255,255,255,0.03)' }}
          />
        ))}
        <div
          className="absolute rounded-full"
          style={{
            top: '5%', left: '10%', width: '35%', height: '20%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Cover art center */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: `${SIZE * 0.42}px`, height: `${SIZE * 0.42}px`,
          boxShadow: `0 0 20px ${C.glow}, 0 2px 8px rgba(0,0,0,0.8)`,
        }}
      >
        {isSafeUrl(coverImage) ? (
          <Image
            src={coverImage} alt={title} fill className="object-cover"
            unoptimized width={SIZE * 0.42} height={SIZE * 0.42}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})` }}
          >
            <span className="text-white/50 font-bold text-3xl">{title.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Spindle */}
      <div
        className="absolute rounded-full"
        style={{
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '10px', height: '10px',
          background: 'radial-gradient(circle, #2a2a3a 0%, #111118 100%)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.8)',
        }}
      />

      {/* Tonearm hint */}
      {isPlaying && (
        <div
          className="absolute"
          style={{
            top: '50%', right: '-4px', transform: 'translateY(-50%)',
            width: '32px', height: '3px', borderRadius: '2px',
            background: `linear-gradient(to left, ${C.primary}, transparent)`,
            opacity: 0.6,
          }}
        />
      )}
    </motion.div>
  );
}

function formatTime(t: number) {
  if (!t || isNaN(t)) return '00:00';
  return `${Math.floor(t / 60).toString().padStart(2, '0')}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
}

export default function CyberPlayer() {
  const {
    currentTrack, isPlaying, currentTime, duration, volume, isMuted,
    isShuffled, repeatMode, next, previous, togglePlay,
    setCurrentTime, setVolume, toggleMute, toggleShuffle, cycleRepeat,
  } = useMusicStore();

  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [showVolume, setShowVolume] = useState(false);
  const [hoveredTitle, setHoveredTitle] = useState(false);
  const [showVolumeValue, setShowVolumeValue] = useState(false);
  const prevTrackRef = useRef<string | null>(null);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Record play history when track changes
  useEffect(() => {
    if (!currentTrack || !isPlaying) return;
    if (prevTrackRef.current === currentTrack.id) return;
    prevTrackRef.current = currentTrack.id;

    // Fire and forget — don't block playback for history recording
    fetch('/api/music/history', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId: Number(currentTrack.id) }),
    }).catch(() => { /* ignore */ });
  }, [currentTrack, isPlaying]);

  const RepeatIcon = repeatMode === 'one'
    ? () => <span className="text-[8px] font-bold absolute -top-0.5 -right-0.5" style={{ color: C.primary }}>1</span>
    : () => null;

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(pct * duration);
  }, [duration, setCurrentTime]);

  const handleVolumeClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(pct);
  }, [setVolume]);

  if (!currentTrack) {
    return (
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: C.glassBg,
          backdropFilter: 'blur(32px)',
          border: `1px solid ${C.border}`,
        }}
      >
        <div className="p-8 flex flex-col items-center justify-center min-h-[420px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div
              className="w-32 h-32 rounded-3xl mx-auto mb-6 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${C.primary}20, ${C.secondary}20)`,
                border: `1px solid ${C.border}`,
                boxShadow: `0 0 40px rgba(139,92,246,0.1)`,
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="1.5" opacity="0.5">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <p className="text-sm font-mono" style={{ color: C.textMuted }}>
              No signal — select a track to initiate
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl overflow-hidden"
      style={{
        background: C.glassBg,
        backdropFilter: 'blur(32px)',
        border: `1px solid ${C.border}`,
        boxShadow: `0 0 80px ${C.glow}, 0 25px 50px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Accent line */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${C.primary}, ${C.secondary}, ${C.accent}, transparent)`,
        }}
      />

      <div className="p-6">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-5">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: C.primary }}
            animate={isPlaying
              ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }
              : { scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: C.primary }}>
            NOW_PLAYING
          </span>
        </div>

        {/* Disc + Info */}
        <div className="flex gap-5 items-center mb-6">
          <VinylDisc coverImage={currentTrack.coverImage} title={currentTrack.title} isPlaying={isPlaying} />

          <div className="flex-1 min-w-0">
            <MarqueeTitle
              text={currentTrack.title}
              active={hoveredTitle}
              className="text-lg md:text-xl font-bold font-mono"
              gradientFrom={C.text}
              gradientTo={C.primary}
            />
            <p className="text-sm font-mono truncate" style={{ color: C.textSecondary }}>
              {currentTrack.artist}
            </p>

            {/* Tags */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{
                background: `${C.primary}15`, border: `1px solid ${C.border}`, color: C.primary,
              }}>
                NEURAL
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{
                background: `${C.secondary}15`, border: '1px solid rgba(6,182,212,0.15)', color: C.secondary,
              }}>
                CHILL
              </span>
            </div>
          </div>
        </div>

        {/* Audio Visualizer */}
        <div className="mb-5">
          <CyberAudioVisualizer isPlaying={isPlaying} currentTrack={currentTrack} />
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="relative h-1.5 rounded-full cursor-crosshair group"
            style={{ background: C.progressBg }}
          >
            {/* Glow under progress */}
            <div
              className="absolute top-1/2 left-0 h-4 -translate-y-1/2 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`,
                boxShadow: `0 0 16px ${C.primary}`,
                filter: 'blur(6px)',
              }}
            />
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`,
              }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                left: `${progress}%`,
                background: C.text,
                boxShadow: `0 0 10px ${C.primary}`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] tabular-nums font-mono" style={{ color: C.textMuted }}>
              {formatTime(currentTime)}
            </span>
            <span className="text-[11px] tabular-nums font-mono" style={{ color: C.textMuted }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Shuffle + Repeat */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={toggleShuffle}
              className="p-2.5 rounded-xl transition-all relative"
              style={{ color: isShuffled ? C.primary : C.textMuted, background: isShuffled ? `${C.primary}15` : 'transparent' }}
              title="Smart Shuffle"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={cycleRepeat}
              className="p-2.5 rounded-xl transition-all relative"
              style={{ color: repeatMode !== 'none' ? C.primary : C.textMuted, background: repeatMode !== 'none' ? `${C.primary}15` : 'transparent' }}
              title="Repeat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              {repeatMode === 'one' && (
                <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold" style={{ color: C.primary }}>1</span>
              )}
            </motion.button>
          </div>

          {/* Play controls */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={previous}
              className="p-3 rounded-xl transition-all"
              style={{ color: C.text }}
              title="Previous"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" />
              </svg>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={togglePlay}
              className="w-14 h-14 rounded-full flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                boxShadow: `0 0 40px ${C.glow}`,
              }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.svg
                    key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                    style={{ marginLeft: '2px' }}
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={next}
              className="p-3 rounded-xl transition-all"
              style={{ color: C.text }}
              title="Next"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
              </svg>
            </motion.button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={toggleMute}
              onMouseEnter={() => { setShowVolume(true); setShowVolumeValue(true); }}
              onMouseLeave={() => setShowVolume(false)}
              className="p-2.5 rounded-xl transition-all"
              style={{ color: C.textMuted }}
              title="Volume"
            >
              {isMuted || volume === 0 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </motion.button>

            <AnimatePresence>
              {showVolume && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -5 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -5 }}
                  className="relative"
                  onMouseEnter={() => setShowVolume(true)}
                  onMouseLeave={() => setShowVolume(false)}
                >
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded-xl min-w-[120px]"
                    style={{
                      background: C.glassBgLight,
                      backdropFilter: 'blur(16px)',
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      ref={volumeRef}
                      onClick={handleVolumeClick}
                      className="relative h-1.5 rounded-full cursor-crosshair"
                      style={{ background: C.progressBg }}
                    >
                      <div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{
                          width: `${isMuted ? 0 : volume * 100}%`,
                          background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`,
                        }}
                      />
                    </div>
                    {showVolumeValue && (
                      <p className="text-center text-[10px] font-mono mt-1.5" style={{ color: C.textMuted }}>
                        {Math.round((isMuted ? 0 : volume) * 100)}%
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Status bar */}
        <div className="text-center mt-4 flex items-center justify-center gap-3">
          <span className="text-[10px] font-mono" style={{ color: C.textMuted }}>
            SYS://AUDIO.MATRIX.v2.0
          </span>
          <span style={{ color: C.textMuted, opacity: 0.3 }}>|</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{
              background: isPlaying ? '#4ade80' : C.textMuted,
              boxShadow: isPlaying ? '0 0 6px #4ade80' : 'none',
            }} />
            <span className="text-[10px] font-mono" style={{ color: isPlaying ? '#4ade80' : C.textMuted }}>
              {isPlaying ? 'PLAYING' : 'IDLE'}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
