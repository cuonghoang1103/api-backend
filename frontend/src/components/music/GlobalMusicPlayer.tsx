'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX,
  ChevronUp, Music, X,
} from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import { usePathname } from 'next/navigation';

const AUTO_HIDE_DELAY = 5000; // 5 seconds

function isSafeCoverUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  return url.startsWith('http') || url.startsWith('/uploads/');
}

// ============================================================
// SeekBar — click + drag to seek. While dragging, the store
// is updated locally so the visual thumb follows the pointer,
// and the audio element is seeked once on release.
// ============================================================
function SeekBar({
  currentTime, duration, onSeek, onActivity,
}: {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onActivity: () => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragValue, setDragValue] = useState<number | null>(null);

  const valueFromPointer = useCallback((clientX: number): number => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return pct * (duration || 0);
  }, [duration]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!duration || duration <= 0) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const v = valueFromPointer(e.clientX);
    setDragging(true);
    setDragValue(v);
    onSeek(v);
    onActivity();
  }, [duration, valueFromPointer, onSeek, onActivity]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const v = valueFromPointer(e.clientX);
    setDragValue(v);
    onSeek(v);
  }, [dragging, valueFromPointer, onSeek]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    setDragging(false);
    setDragValue(null);
    onActivity();
  }, [dragging, onActivity]);

  const displayValue = dragging && dragValue !== null ? dragValue : currentTime;
  const progress = duration > 0 ? Math.max(0, Math.min(100, (displayValue / duration) * 100)) : 0;
  const thumbVisible = dragging || progress > 0;

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative h-2 flex-1 bg-darkborder rounded-full cursor-pointer group/seek select-none touch-none"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={Math.max(duration, 0)}
      aria-valuenow={Math.floor(displayValue)}
    >
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-indigo to-neon-violet rounded-full"
        style={{ width: `${progress}%` }}
      />
      {thumbVisible && (
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md pointer-events-none transition-opacity"
          style={{
            left: `calc(${progress}% - 6px)`,
            opacity: dragging ? 1 : 0,
            boxShadow: '0 0 10px rgba(139,92,246,0.6)',
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// ExpandedPlayer — full-width player view
// ============================================================
function ExpandedPlayer({ onCollapse, onClose, onActivity }: {
  onCollapse: () => void;
  onClose: () => void;
  onActivity: () => void;
}) {
  const {
    currentTrack, isPlaying, currentTime, duration, volume, isMuted,
    isShuffled, repeatMode, tracks,
    next, previous, togglePlay, setCurrentTime, setVolume, toggleMute,
    toggleShuffle, cycleRepeat,
  } = useMusicStore();

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;
  const storeState = useMusicStore.getState();
  const currentIndex = storeState.currentIndex;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-0 left-0 right-0 z-[60] bg-darkbg/95 border-t border-darkborder shadow-2xl"
    >
      {/* Invisible activity tracker */}
      <div onClick={onActivity} onMouseDown={onActivity} onTouchStart={onActivity} className="absolute inset-0 cursor-default" />
      <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center gap-5">
          {/* Cover + Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg shrink-0">
              {isSafeCoverUrl(currentTrack?.coverImage) ? (
                <Image
                  src={currentTrack.coverImage}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
                  <Music className="w-6 h-6 text-white/40" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{currentTrack?.title}</p>
              <p className="text-xs text-text-muted truncate">{currentTrack?.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleShuffle}
                className={`p-1.5 rounded-lg transition-all ${isShuffled ? 'text-neon-violet' : 'text-text-muted hover:text-text-primary'}`}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button onClick={() => { previous(); onActivity(); }} className="p-1.5 text-text-secondary hover:text-text-primary transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => { togglePlay(); onActivity(); }}
                className="w-10 h-10 bg-gradient-to-r from-neon-indigo to-neon-violet rounded-full flex items-center justify-center text-white shadow-lg shadow-neon-violet/25"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </motion.button>
              <button onClick={() => { next(); onActivity(); }} className="p-1.5 text-text-secondary hover:text-text-primary transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                onClick={cycleRepeat}
                className={`p-1.5 rounded-lg transition-all ${repeatMode !== 'none' ? 'text-neon-violet' : 'text-text-muted hover:text-text-primary'}`}
              >
                <RepeatIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Progress */}
            <div className="w-full max-w-md flex items-center gap-2">
              <span className="text-xs text-text-muted w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
              <SeekBar
                currentTime={currentTime}
                duration={duration}
                onSeek={setCurrentTime}
                onActivity={onActivity}
              />
              <span className="text-xs text-text-muted w-10 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="flex items-center gap-2 w-32">
              <button onClick={toggleMute} className="text-text-muted hover:text-text-primary transition-colors shrink-0">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="relative h-2 flex-1 bg-darkborder rounded-full cursor-pointer group/vol">
                <div
                  className="absolute top-0 left-0 h-full bg-neon-violet/70 rounded-full"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md pointer-events-none opacity-0 group-hover/vol:opacity-100"
                  style={{
                    left: `calc(${isMuted ? 0 : volume * 100}% - 5px)`,
                    boxShadow: '0 0 6px rgba(139,92,246,0.6)',
                  }}
                />
                <input
                  type="range" min={0} max={1} step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => { setVolume(parseFloat(e.target.value)); onActivity(); }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="text-xs text-text-muted tabular-nums hidden md:block">
              {currentIndex + 1} / {tracks.length}
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-red-400 transition-colors" title="Close player">
              <X className="w-4 h-4" />
            </button>
            <button onClick={onCollapse} className="text-text-muted hover:text-text-primary transition-colors" title="Minimize">
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// MiniBar — collapsed bottom bar
// ============================================================
function MiniBar({ onExpand, onClose }: { onExpand: () => void; onClose: () => void }) {
  const { currentTrack, isPlaying, togglePlay } = useMusicStore();

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-[60] bg-darkbg/95 border-t border-darkborder/50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 py-2.5">
          <button onClick={onExpand} className="relative w-9 h-9 rounded-lg overflow-hidden shadow-md shrink-0">
            {isSafeCoverUrl(currentTrack.coverImage) ? (
              <Image src={currentTrack.coverImage} alt={currentTrack.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
                <Music className="w-4 h-4 text-white/50" />
              </div>
            )}
          </button>

          <button onClick={onExpand} className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold text-text-primary truncate">{currentTrack.title}</p>
            <p className="text-[10px] text-text-muted truncate">{currentTrack.artist}</p>
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 bg-gradient-to-r from-neon-indigo to-neon-violet rounded-full flex items-center justify-center text-white shadow-md shrink-0"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <button
            onClick={onClose}
            className="text-text-muted hover:text-red-400 transition-colors shrink-0"
            title="Close player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Entry point — auto-hide behavior:
// - When not playing: auto-hide after 5s
// - When expanded: auto-collapse after 5s of inactivity
// ============================================================
export default function GlobalMusicPlayer() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { currentTrack, tracks, isPlaying } = useMusicStore();

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
    if (collapseTimerRef.current) { clearTimeout(collapseTimerRef.current); collapseTimerRef.current = null; }
  }, []);

  const scheduleHide = useCallback(() => {
    clearAllTimers();
    hideTimerRef.current = setTimeout(() => setHidden(true), AUTO_HIDE_DELAY);
  }, [clearAllTimers]);

  const scheduleCollapse = useCallback(() => {
    clearAllTimers();
    collapseTimerRef.current = setTimeout(() => setExpanded(false), AUTO_HIDE_DELAY);
  }, [clearAllTimers]);

  const recordActivity = useCallback(() => {
    if (expanded) {
      scheduleCollapse();
    }
  }, [expanded, scheduleCollapse]);

  // When a track becomes available, show player
  useEffect(() => {
    if (currentTrack && tracks.length > 0) {
      setHidden(false);
    }
  }, [currentTrack, tracks.length]);

  // When paused → schedule auto-hide; when playing → cancel hide
  useEffect(() => {
    if (!currentTrack || tracks.length === 0 || hidden) return;
    if (!isPlaying) {
      scheduleHide();
    } else {
      clearAllTimers();
    }
  }, [isPlaying, currentTrack, tracks.length, hidden, scheduleHide, clearAllTimers]);

  // When expanded → schedule auto-collapse
  useEffect(() => {
    if (!currentTrack || tracks.length === 0 || hidden) return;
    if (expanded) {
      scheduleCollapse();
    } else {
      if (collapseTimerRef.current) { clearTimeout(collapseTimerRef.current); collapseTimerRef.current = null; }
    }
    return () => { clearAllTimers(); };
  }, [expanded, currentTrack, tracks.length, hidden, scheduleCollapse, clearAllTimers]);

  // Always show player on any page when there's a current track
  if (!currentTrack || tracks.length === 0) return null;
  if (hidden) return null;

  return (
    <AnimatePresence>
      {expanded ? (
        <ExpandedPlayer
          onCollapse={() => { setExpanded(false); clearAllTimers(); }}
          onClose={() => { setHidden(true); clearAllTimers(); }}
          onActivity={recordActivity}
        />
      ) : (
        <MiniBar
          onExpand={() => { setExpanded(true); clearAllTimers(); }}
          onClose={() => { setHidden(true); clearAllTimers(); }}
        />
      )}
    </AnimatePresence>
  );
}
