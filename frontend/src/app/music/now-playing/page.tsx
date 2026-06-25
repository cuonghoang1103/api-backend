'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useMusicStore } from '@/store/musicStore';
import CyberAudioVisualizer from '@/components/music/CyberAudioVisualizer';
import CyberLyrics from '@/components/music/CyberLyrics';
import ListenTogether from '@/components/music/ListenTogether';
import ShareTrackModal from '@/components/music/ShareTrackModal';

function isSafeUrl(url: unknown): url is string {
  return typeof url === 'string' && url.trim().length > 0 && url.startsWith('http');
}

const C = {
  primary: '#8B5CF6',
  secondary: '#06b6d4',
  accent: '#ec4899',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#94a3b8',
};

function formatTime(t: number) {
  if (!t || isNaN(t)) return '00:00';
  return `${Math.floor(t / 60).toString().padStart(2, '0')}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
}

export default function NowPlayingPage() {
  const {
    currentTrack, isPlaying, currentTime, duration, volume, isMuted,
    isShuffled, repeatMode, next, previous, togglePlay,
    setCurrentTime, setVolume, toggleMute, toggleShuffle, cycleRepeat,
    tracks, currentIndex,
  } = useMusicStore();

  const [isMounted, setIsMounted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [crosshair, setCrosshair] = useState({ x: 0, y: 0 });
  const [bgImgError, setBgImgError] = useState(false);
  const [vinylImgError, setVinylImgError] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setCrosshair({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(pct * duration);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(pct);
  };

  if (!isMounted) return null;

  const bgImage = currentTrack?.coverImage;
  // NOTE: bgImgError / vinylImgError are tracked per-track so a
  // transient load failure on one track doesn't permanently hide the
  // cover when the user switches to a different track (and a
  // page reload — which resets React state — would mysteriously
  // restore the cover). Without this reset, the user reported:
  // "I have to reload the page to see the YouTube track's cover".
  const currentTrackId = currentTrack?.id ?? null;
  const isBlurred = isSafeUrl(bgImage) && !bgImgError;
  const hasCover = isSafeUrl(currentTrack?.coverImage) && !vinylImgError;

  // Reset the error flags whenever we switch to a different track.
  // Same URL → keep the existing flag (likely a real failure). New
  // URL → start fresh so a previously-failed cover can be retried.
  useEffect(() => {
    setBgImgError(false);
    setVinylImgError(false);
    // We intentionally depend on the track id (not the URL) so a
    // single track re-emitting a fresh URL object doesn't reset
    // a known-broken cover.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackId]);

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{
        background: isBlurred
          ? `linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.8))`
          : `linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)`,
        cursor: 'crosshair',
      }}
    >
      {/* Hidden tracker for background image errors */}
      <img
        src={bgImage}
        alt=""
        className="hidden"
        onError={() => setBgImgError(true)}
      />
      {/* Hidden tracker for vinyl image errors */}
      <img
        src={currentTrack?.coverImage}
        alt=""
        className="hidden"
        onError={() => setVinylImgError(true)}
      />
      {/* ── Blurred background ── */}
      {isBlurred && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(80px) saturate(1.2)',
            transform: 'scale(1.2)',
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: isBlurred
            ? 'radial-gradient(ellipse at center, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.9) 70%)'
            : 'transparent',
        }}
      />

      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Custom crosshair cursor */}
      <div
        className="fixed top-0 left-0 z-[100] pointer-events-none"
        style={{
          width: 24,
          height: 24,
          transform: `translate(${crosshair.x - 12}px, ${crosshair.y - 12}px)`,
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${C.primary}`,
            opacity: 0.6,
            boxShadow: `0 0 8px ${C.primary}`,
          }}
        />
        <div
          className="absolute top-1/2 left-0 right-0 h-px"
          style={{ background: `${C.primary}80` }}
        />
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px"
          style={{ background: `${C.primary}80` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen pt-16">
        {/* Header */}
        <div
          className="px-6 py-4"
          style={{
            background: 'rgba(15,23,42,0.5)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid rgba(139,92,246,0.15)`,
          }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link
              href="/music"
              className="flex items-center gap-2 text-xs font-mono transition-all hover:opacity-80"
              style={{ color: C.primary }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              BACK_TO_MATRIX
            </Link>

            <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: C.primary }}>
              NOW_PLAYING
            </span>

            <div className="flex items-center gap-4">
              <ListenTogether
                // Close other modals so they don't overlap on top of
                // each other when the user opens one then opens another.
                // Without this, Listen Together (z-210) would cover the
                // LYRICS overlay (z-200), making both feel "duplicated
                // and stacked on top of each other".
                onOpen={() => {
                  setShowLyrics(false);
                  setShowShare(false);
                  setShowInfo(false);
                }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowShare((v) => {
                    if (!v) {
                      setShowLyrics(false);
                      setShowInfo(false);
                    }
                    return !v;
                  });
                }}
                className="text-xs font-mono font-bold transition-all"
                style={{ color: C.primary }}
              >
                SHARE
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowLyrics((v) => {
                    if (!v) {
                      setShowShare(false);
                      setShowInfo(false);
                    }
                    return !v;
                  });
                }}
                className="text-xs font-mono font-bold transition-all"
                style={{ color: C.secondary }}
              >
                LYRICS
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowInfo(!showInfo)}
                className="text-xs font-mono transition-all"
                style={{ color: C.textMuted }}
              >
                {showInfo ? 'HIDE' : 'INFO'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Synced lyrics overlay (Phase 2b) */}
        <CyberLyrics
          open={showLyrics}
          onClose={() => setShowLyrics(false)}
          trackId={currentTrack?.id ? Number(currentTrack.id) : null}
          trackTitle={currentTrack?.title}
          trackArtist={currentTrack?.artist}
        />

        {/* Share track (Phase 3) */}
        <ShareTrackModal
          open={showShare}
          onClose={() => setShowShare(false)}
          item={
            currentTrack
              ? {
                  kind: 'track',
                  title: currentTrack.title,
                  artist: currentTrack.artist,
                  audioUrl: currentTrack.audioUrl,
                }
              : null
          }
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-28 gap-8">
          {currentTrack ? (
            <>
              {/* Album art — large */}
              <motion.div
                layout
                key={currentTrack.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative"
                style={{ width: 280, height: 280 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: hasCover
                      ? `url(${currentTrack.coverImage}) center/cover`
                      : `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                    boxShadow: `0 0 80px rgba(139,92,246,0.4), 0 0 160px rgba(139,92,246,0.15)`,
                  }}
                  animate={{ boxShadow: [
                    '0 0 80px rgba(139,92,246,0.4), 0 0 160px rgba(139,92,246,0.15)',
                    '0 0 100px rgba(6,182,212,0.4), 0 0 200px rgba(6,182,212,0.15)',
                    '0 0 80px rgba(236,72,153,0.4), 0 0 160px rgba(236,72,153,0.15)',
                    '0 0 80px rgba(139,92,246,0.4), 0 0 160px rgba(139,92,246,0.15)',
                  ]}}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                {!hasCover && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-3xl">
                    <span className="text-white/40 font-bold text-7xl">
                      {currentTrack.title.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Playing ring */}
                {isPlaying && (
                  <>
                    <motion.div
                      className="absolute -inset-4 rounded-full"
                      style={{ border: `1px solid ${C.primary}40` }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute -inset-8 rounded-full"
                      style={{ border: `1px solid ${C.secondary}20` }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    />
                  </>
                )}
              </motion.div>

              {/* Track info */}
              <motion.div
                key={`info-${currentTrack.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center max-w-lg"
              >
                <h1
                  className="text-2xl md:text-3xl font-bold font-mono mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${C.text}, ${C.primary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {currentTrack.title}
                </h1>
                <p className="text-sm font-mono" style={{ color: C.textSecondary }}>
                  {currentTrack.artist}
                </p>

                {/* Track index */}
                <p className="text-xs font-mono mt-2" style={{ color: C.textMuted }}>
                  [{currentIndex + 1} / {tracks.length}] · {currentTrack.duration}
                </p>
              </motion.div>

              {/* Visualizer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-2xl"
              >
                <CyberAudioVisualizer isPlaying={isPlaying} currentTrack={currentTrack} />
              </motion.div>

              {/* Progress bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="w-full max-w-2xl"
              >
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="relative h-1.5 rounded-full cursor-crosshair group"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`,
                      boxShadow: `0 0 12px ${C.primary}`,
                    }}
                  />
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -ml-2"
                    style={{
                      left: `${progress}%`,
                      background: C.text,
                      boxShadow: `0 0 12px ${C.primary}`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs font-mono tabular-nums" style={{ color: C.textMuted }}>
                    {formatTime(currentTime)}
                  </span>
                  <span className="text-xs font-mono tabular-nums" style={{ color: C.textMuted }}>
                    {formatTime(duration)}
                  </span>
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={toggleShuffle}
                  className="p-3 rounded-xl transition-all"
                  style={{ color: isShuffled ? C.primary : C.textMuted, background: isShuffled ? `${C.primary}20` : 'transparent' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 3 21 3 21 8" />
                    <line x1="4" y1="20" x2="21" y2="3" />
                    <polyline points="21 16 21 21 16 21" />
                    <line x1="15" y1="15" x2="21" y2="21" />
                    <line x1="4" y1="4" x2="9" y2="9" />
                  </svg>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={previous}
                  className="p-3 text-text-primary"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="19 20 9 12 19 4 19 20" />
                    <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white"
                  style={{
                    background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                    boxShadow: `0 0 40px rgba(139,92,246,0.5)`,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.svg
                        key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                      >
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </motion.svg>
                    ) : (
                      <motion.svg
                        key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                        style={{ marginLeft: '3px' }}
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={next}
                  className="p-3 text-text-primary"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 4 15 12 5 20 5 4" />
                    <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={cycleRepeat}
                  className="p-3 rounded-xl transition-all relative"
                  style={{ color: repeatMode !== 'none' ? C.primary : C.textMuted, background: repeatMode !== 'none' ? `${C.primary}20` : 'transparent' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                  {repeatMode === 'one' && (
                    <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold" style={{ color: C.primary }}>1</span>
                  )}
                </motion.button>
              </motion.div>

              {/* Volume */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-3 w-full max-w-xs"
              >
                <button
                  onClick={toggleMute}
                  className="text-text-muted shrink-0"
                  style={{ color: C.textMuted }}
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
                </button>
                <div
                  ref={volumeRef}
                  onClick={handleVolumeClick}
                  className="flex-1 h-1 rounded-full cursor-crosshair relative"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: `${isMuted ? 0 : volume * 100}%`,
                      background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`,
                    }}
                  />
                </div>
                <span className="text-xs font-mono tabular-nums shrink-0" style={{ color: C.textMuted, minWidth: '32px' }}>
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </motion.div>

              {/* Info panel */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="w-full max-w-lg rounded-xl p-4"
                    style={{
                      background: 'rgba(15,23,42,0.8)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid rgba(139,92,246,0.15)`,
                    }}
                  >
                    {[
                      { label: 'TITLE', value: currentTrack.title },
                      { label: 'ARTIST', value: currentTrack.artist },
                      { label: 'DURATION', value: currentTrack.duration },
                      { label: 'TRACK_INDEX', value: `${currentIndex + 1} / ${tracks.length}` },
                      { label: 'ENGINE', value: 'CYBER_AUDIO_MATRIX_v2' },
                      { label: 'STATUS', value: isPlaying ? 'PLAYING' : 'PAUSED' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
                        <span className="text-[10px] font-mono uppercase" style={{ color: C.textMuted }}>{item.label}</span>
                        <span className="text-[10px] font-mono font-bold" style={{ color: C.primary }}>{item.value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-sm font-mono" style={{ color: C.textMuted }}>
                No track selected — return to matrix
              </p>
              <Link
                href="/music"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono text-white"
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
              >
                GO_BACK
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
