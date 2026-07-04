'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX,
  ChevronUp, Music, X,
  ListMusic, Trash2, GripVertical,
} from 'lucide-react';
import {
  DndContext, closestCenter,
  useSensor, useSensors, PointerSensor, KeyboardSensor,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMusicStore } from '@/store/musicStore';
import { useMusicKeyboardShortcuts } from '@/hooks/useMusicKeyboardShortcuts';
import {
  useRemoveFromQueue, useClearQueue,
} from '@/hooks/useMusicQueries';
import { usePathname } from 'next/navigation';
import type { Track } from '@/types';

const AUTO_HIDE_DELAY = 5000; // 5 seconds

// Playback speed presets, in display order.
const SPEED_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;
function formatSpeed(r: number): string {
  return r === 1 ? '1×' : `${r}×`;
}

function isSafeCoverUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  return url.startsWith('http') || url.startsWith('/uploads/');
}

// ============================================================
// SeekBar — click + drag to seek.
// ============================================================
function SeekBar({
  currentTime, duration, onSeek, onActivity, setIsSeeking,
}: {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onActivity: () => void;
  /** Called when drag starts/stops to prevent seek-feedback loops */
  setIsSeeking: (v: boolean) => void;
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
    setIsSeeking(true);
  }, [duration, valueFromPointer, onSeek, onActivity, setIsSeeking]);

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
    setIsSeeking(false);
  }, [dragging, onActivity, setIsSeeking]);

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
// QueuePopover — drag-reorderable manual queue.
// ============================================================
function QueuePopover({ onClose }: { onClose: () => void }) {
  const manualQueue = useMusicStore((s) => s.manualQueue);
  const { reorderManualQueue, removeFromManualQueue, clearManualQueue } = useMusicStore();
  const removeFromQueueApi = useRemoveFromQueue();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids = manualQueue.map((t) => t.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(manualQueue, oldIndex, newIndex);
    reorderManualQueue(reordered.map((t) => t.id));
  };

  // Defensive array guard so the "x is not iterable" crash never happens.
  const items = Array.isArray(manualQueue) ? manualQueue : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="absolute bottom-full left-0 right-0 mb-2 mx-3 sm:mx-6 max-w-3xl sm:left-auto sm:right-6 sm:mx-0 bg-darkcard/95 backdrop-blur-md border border-darkborder rounded-2xl shadow-2xl z-[65] overflow-hidden"
      role="dialog"
      aria-label="Play queue"
    >
      <div className="flex items-center justify-between p-3 border-b border-darkborder">
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-neon-violet" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            Play Queue
          </span>
          <span className="text-[10px] font-mono text-text-muted">
            {items.length} {items.length === 1 ? 'track' : 'tracks'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {items.length > 0 && (
            <button
              onClick={() => {
                // Local mirror first (instant UX); the ServerQueueSync
                // child below fires the server DELETE for us.
                clearManualQueue();
              }}
              className="px-2 py-1 text-[10px] font-mono text-text-muted hover:text-red-400 rounded-lg transition-colors"
              title="Clear queue"
              aria-label="Clear queue"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary rounded-lg transition-colors"
            title="Close queue"
            aria-label="Close queue"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto p-2">
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <ListMusic className="w-8 h-8 mx-auto mb-2 text-text-muted opacity-40" />
            <p className="text-xs font-mono text-text-muted">
              Queue is empty
            </p>
            <p className="text-[10px] font-mono text-text-muted/70 mt-1">
              Use &quot;Play next&quot; or &quot;Add to queue&quot; on any track
            </p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {items.map((track) => (
                <SortableQueueItem
                  key={track.id}
                  track={track}
                  onRemove={() => {
                    removeFromManualQueue(track.id);
                    // Best-effort server sync if it's a numeric ID
                    // (YouTube / local tracks don't have a server row).
                    const numericId = Number(track.id);
                    if (Number.isFinite(numericId) && numericId > 0) {
                      removeFromQueueApi.mutate(numericId);
                    }
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
      {/* Side-effect-only child: watches the manualQueue length and
          fires a server-side clear-all when the user empties it. */}
      <ServerQueueSync />
    </motion.div>
  );
}

function SortableQueueItem({ track, onRemove }: { track: Track; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: track.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 group"
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
        aria-label="Drag handle"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>
      <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 bg-darkborder">
        {track.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={track.coverImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
            <Music className="w-3.5 h-3.5 text-white/50" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-text-primary truncate">{track.title}</p>
        <p className="text-[10px] text-text-muted truncate">{track.artist}</p>
      </div>
      <button
        onClick={onRemove}
        className="p-1 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Remove from queue"
        aria-label="Remove from queue"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Side-effect-only child: watches the manualQueue length and
// fires a server-side clear-all when the user empties it.
function ServerQueueSync() {
  const clearQueueApi = useClearQueue();
  const manualQueue = useMusicStore((s) => s.manualQueue);
  const lastSyncedLen = useRef<number | null>(null);
  useEffect(() => {
    if (
      lastSyncedLen.current !== null &&
      lastSyncedLen.current > 0 &&
      manualQueue.length === 0
    ) {
      clearQueueApi.mutate();
    }
    lastSyncedLen.current = manualQueue.length;
  }, [manualQueue.length, clearQueueApi]);
  return null;
}

// ============================================================
// SpeedMenu — playback rate picker.
// ============================================================
function SpeedMenu({ onClose }: { onClose: () => void }) {
  const playbackRate = useMusicStore((s) => s.playbackRate);
  const setPlaybackRate = useMusicStore((s) => s.setPlaybackRate);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="absolute bottom-full mb-2 right-0 bg-darkcard/95 backdrop-blur-md border border-darkborder rounded-xl shadow-xl z-[65] py-1 min-w-[120px]"
      role="menu"
      aria-label="Playback speed"
    >
      {SPEED_PRESETS.map((r) => (
        <button
          key={r}
          onClick={() => { setPlaybackRate(r); onClose(); }}
          className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors flex items-center justify-between ${
            Math.abs(playbackRate - r) < 0.01
              ? 'bg-neon-violet/15 text-neon-violet'
              : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
          }`}
        >
          <span>{formatSpeed(r)}</span>
          {Math.abs(playbackRate - r) < 0.01 && (
            <span className="text-[9px] text-neon-violet">●</span>
          )}
        </button>
      ))}
    </motion.div>
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
    isShuffled, repeatMode, tracks, playbackRate, manualQueue,
    next, previous, togglePlay, setCurrentTime, setVolume, toggleMute,
    toggleShuffle, cycleRepeat, setIsSeeking,
  } = useMusicStore();

  const [imgError, setImgError] = useState(false);
  // Reset the error flag whenever the track changes. The GlobalMusicPlayer
  // is mounted once at the root layout (it lives across page navigation
  // and every track switch) — without this reset, a single transient
  // load failure (R2 5xx, CSP block, YouTube 404, network race)
  // would set imgError=true and stick forever, hiding the cover for
  // every subsequent track until a hard reload. The user reported
  // 'the cover disappears and I have to reload the page to see it'.
  // CyberPlayer.tsx already does the same fix in its VinylDisc
  // (see NoteCodeBlock discussion for the broader pattern); we
  // mirror it here so the bottom player matches.
  useEffect(() => {
    setImgError(false);
  }, [currentTrack?.id]);
  // Cyber Phase 1: popover state for queue + speed menu.
  const [queueOpen, setQueueOpen] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);
  const manualQueueLen = Array.isArray(manualQueue) ? manualQueue.length : 0;

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
      className="music-bar-fixed fixed bottom-0 left-0 right-0 z-[60] bg-darkbg/95 border-t border-darkborder shadow-2xl"
    >
      {/* Invisible activity tracker — stopPropagation prevents clicks from
          bubbling to the motion wrapper and accidentally triggering
          navigation on other pages. */}
      <div
        onClick={(e) => { e.stopPropagation(); onActivity(); }}
        onMouseDown={(e) => { e.stopPropagation(); onActivity(); }}
        onTouchStart={(e) => { e.stopPropagation(); onActivity(); }}
        className="absolute inset-0 cursor-default"
      />
      <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center gap-5">
          {/* Cover + Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg shrink-0">
              {isSafeCoverUrl(currentTrack?.coverImage) && !imgError ? (
                <Image
                  src={currentTrack.coverImage}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  priority
                  onError={() => setImgError(true)}
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
                setIsSeeking={setIsSeeking}
              />
              <span className="text-xs text-text-muted w-10 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume + secondary controls */}
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
            {/* Queue button — opens popover above */}
            <button
              onClick={() => { setQueueOpen((v) => !v); setSpeedOpen(false); onActivity(); }}
              className={`relative p-1.5 rounded-lg transition-colors ${queueOpen ? 'text-neon-violet' : 'text-text-muted hover:text-text-primary'}`}
              title="Play queue"
              aria-label="Play queue"
            >
              <ListMusic className="w-4 h-4" />
              {manualQueueLen > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-neon-violet text-white text-[9px] font-mono font-bold flex items-center justify-center">
                  {manualQueueLen}
                </span>
              )}
            </button>
            {/* Speed button — opens preset menu */}
            <div className="relative">
              <button
                onClick={() => { setSpeedOpen((v) => !v); setQueueOpen(false); onActivity(); }}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors min-w-[36px] ${speedOpen ? 'text-neon-violet bg-neon-violet/10' : 'text-text-muted hover:text-text-primary'}`}
                title="Playback speed"
                aria-label="Playback speed"
              >
                {playbackRate === 1 ? '1×' : `${playbackRate}×`}
              </button>
              <AnimatePresence>
                {speedOpen && <SpeedMenu onClose={() => setSpeedOpen(false)} />}
              </AnimatePresence>
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
      {/* Queue popover — floats just above the player */}
      <AnimatePresence>
        {queueOpen && <QueuePopover onClose={() => setQueueOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// MiniBar — collapsed bottom bar
// ============================================================
function MiniBar({ onExpand, onClose }: { onExpand: () => void; onClose: () => void }) {
  const { currentTrack, isPlaying, togglePlay } = useMusicStore();
  const [imgError, setImgError] = useState(false);

  // Same fix as ExpandedPlayer above: reset imgError whenever
  // the track id changes so a transient load failure on one track
  // doesn't permanently hide the cover for the rest of the
  // session. Hooks must run unconditionally, so this lives
  // BEFORE the `if (!currentTrack) return null` early return.
  useEffect(() => {
    setImgError(false);
  }, [currentTrack?.id]);

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className="music-bar-fixed fixed bottom-0 left-0 right-0 z-[60] bg-darkbg/95 border-t border-darkborder/50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 py-2.5">
          <button onClick={onExpand} className="relative w-9 h-9 rounded-lg overflow-hidden shadow-md shrink-0">
            {isSafeCoverUrl(currentTrack.coverImage) && !imgError ? (
              <Image src={currentTrack.coverImage} alt={currentTrack.title} fill className="object-cover" onError={() => setImgError(true)} />
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

  // Cyber Phase 1: keyboard shortcuts (music-scoped — see the hook
  // for the input/textarea/contenteditable guard).
  useMusicKeyboardShortcuts();

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