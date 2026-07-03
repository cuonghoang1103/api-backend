'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Disc3, Volume2, Music2 } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import { getMediaUrl } from '@/lib/utils';
import type { Track } from '@/types';

/* eslint-disable @next/next/no-img-element */

// ── Colours (match the club backdrop) ──
const NEON_A = '#c026d3'; // magenta — deck A
const NEON_B = '#06b6d4'; // cyan — deck B
const AMBER = '#f59e0b';

function fmt(sec: number): string {
  if (!sec || !Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Deterministic pseudo-waveform bar heights from a track id (stable per track). */
function waveform(seed: string, bars = 96): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const out: number[] = [];
  for (let i = 0; i < bars; i++) {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    const r = ((h >>> 0) % 1000) / 1000;
    // Bias toward a lively centre-weighted shape.
    const env = 0.35 + 0.65 * Math.sin((i / bars) * Math.PI);
    out.push(0.15 + r * 0.85 * env);
  }
  return out;
}

// ── A single rotating jog wheel / turntable platter ──
function JogWheel({
  track,
  spinning,
  accent,
  label,
}: {
  track: Track | null;
  spinning: boolean;
  accent: string;
  label: string;
}) {
  const cover = track?.coverImage ? getMediaUrl(track.coverImage, null) : '';
  return (
    <div className="relative flex flex-col items-center gap-2 select-none">
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: 'clamp(140px, 22vw, 220px)',
          height: 'clamp(140px, 22vw, 220px)',
          background: 'radial-gradient(circle at 50% 40%, #2a2a30 0%, #131316 60%, #060608 100%)',
          boxShadow: `0 0 0 6px #0b0b0e, 0 0 0 8px ${accent}55, 0 18px 50px rgba(0,0,0,0.6), 0 0 60px ${accent}30`,
          border: `2px solid ${accent}66`,
        }}
      >
        {/* Spinning platter */}
        <motion.div
          className="absolute inset-3 rounded-full overflow-hidden"
          style={{
            background:
              'repeating-radial-gradient(circle at 50% 50%, #1a1a1e 0px, #1a1a1e 2px, #0e0e11 3px, #0e0e11 5px)',
          }}
          animate={spinning ? { rotate: 360 } : { rotate: 0 }}
          transition={
            spinning
              ? { repeat: Infinity, ease: 'linear', duration: 1.8 }
              : { duration: 0.4 }
          }
        >
          {/* Vinyl sheen */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(from 0deg, transparent, ${accent}22, transparent 40%, ${accent}18, transparent 70%)` }}
          />
          {/* Centre label / cover */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="rounded-full overflow-hidden flex items-center justify-center"
              style={{
                width: '46%',
                height: '46%',
                border: `2px solid ${accent}`,
                boxShadow: `0 0 18px ${accent}88`,
                background: '#111',
              }}
            >
              {cover ? (
                <img src={cover} alt="" className="w-full h-full object-cover" />
              ) : (
                <Disc3 className="w-8 h-8" style={{ color: accent }} />
              )}
            </div>
          </div>
        </motion.div>

        {/* Spindle dot */}
        <div className="absolute w-2.5 h-2.5 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
      </div>
      <span className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: `${accent}` }}>
        {label}
      </span>
    </div>
  );
}

// ── A rotary EQ / trim knob (visual, drag to turn) ──
function Knob({ label, accent, initial = 0.5 }: { label: string; accent: string; initial?: number }) {
  const [val, setVal] = useState(initial);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startVal = useRef(initial);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startY.current = e.clientY;
    startVal.current = val;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dy = startY.current - e.clientY;
    setVal(Math.max(0, Math.min(1, startVal.current + dy / 120)));
  };
  const onUp = () => { dragging.current = false; };

  const angle = -135 + val * 270;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative rounded-full cursor-ns-resize touch-none"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{
          width: 34,
          height: 34,
          background: 'radial-gradient(circle at 50% 35%, #2c2c32, #131316)',
          border: `1px solid ${accent}55`,
          boxShadow: `0 2px 6px rgba(0,0,0,0.5), 0 0 8px ${accent}22`,
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: 2,
            height: 13,
            marginLeft: -1,
            marginTop: -13,
            background: accent,
            boxShadow: `0 0 6px ${accent}`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: '50% 100%',
          }}
        />
      </div>
      <span className="text-[8px] font-mono tracking-widest uppercase text-white/40">{label}</span>
    </div>
  );
}

// ── VU meter column (animated with the beat while playing) ──
function VuMeter({ active, accent }: { active: boolean; accent: string }) {
  const segs = 14;
  return (
    <div className="flex flex-col-reverse gap-[2px]">
      {Array.from({ length: segs }).map((_, i) => {
        const threshold = i / segs;
        const color = threshold > 0.8 ? '#ef4444' : threshold > 0.6 ? AMBER : accent;
        return (
          <motion.div
            key={i}
            className="rounded-sm"
            style={{ width: 8, height: 6, background: color }}
            animate={
              active
                ? { opacity: [0.15, 1, 0.3], scaleY: [0.8, 1, 0.8] }
                : { opacity: 0.12 }
            }
            transition={
              active
                ? { repeat: Infinity, duration: 0.5 + threshold * 0.6, delay: i * 0.03, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
          />
        );
      })}
    </div>
  );
}

export default function DjDeck({ tracks }: { tracks: Track[] }) {
  const currentTrack = useMusicStore((s) => s.currentTrack);
  const isPlaying = useMusicStore((s) => s.isPlaying);
  const currentTime = useMusicStore((s) => s.currentTime);
  const duration = useMusicStore((s) => s.duration);
  const volume = useMusicStore((s) => s.volume);

  const playTrack = useMusicStore((s) => s.playTrack);
  const togglePlay = useMusicStore((s) => s.togglePlay);
  const next = useMusicStore((s) => s.next);
  const previous = useMusicStore((s) => s.previous);
  const setCurrentTime = useMusicStore((s) => s.setCurrentTime);
  const setVolume = useMusicStore((s) => s.setVolume);

  const [crossfade, setCrossfade] = useState(0.5); // 0 = A, 1 = B (visual)

  const laneRef = useRef<HTMLDivElement>(null);

  const bars = useMemo(() => waveform(currentTrack?.id ?? 'empty'), [currentTrack?.id]);
  const progress = duration > 0 ? currentTime / duration : 0;

  // "Deck B" preview = the next track in the list (decorative second platter).
  const deckBTrack = useMemo(() => {
    if (!tracks.length) return null;
    const idx = tracks.findIndex((t) => t.id === currentTrack?.id);
    return tracks[(idx + 1 + tracks.length) % tracks.length] ?? null;
  }, [tracks, currentTrack?.id]);

  const seekFromClientX = useCallback((clientX: number) => {
    const el = laneRef.current;
    if (!el || !duration) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setCurrentTime(pct * duration);
  }, [duration, setCurrentTime]);

  const onLoad = (track: Track) => {
    if (currentTrack?.id === track.id) togglePlay();
    else playTrack(track);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* ── Now-playing readout ── */}
      <div
        className="rounded-t-2xl px-5 py-3 flex items-center justify-between gap-4 flex-wrap"
        style={{
          background: 'linear-gradient(180deg, rgba(20,10,30,0.85), rgba(10,6,18,0.85))',
          border: '1px solid rgba(192,38,211,0.35)',
          borderBottom: 'none',
          backdropFilter: 'blur(14px)',
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: isPlaying ? '#22c55e' : '#64748b', boxShadow: isPlaying ? '0 0 10px #22c55e' : 'none' }}
          />
          <div className="min-w-0">
            <div className="text-sm font-bold text-white truncate">
              {currentTrack?.title ?? 'Chưa chọn bản remix'}
            </div>
            <div className="text-[11px] font-mono truncate" style={{ color: NEON_A }}>
              {currentTrack?.artist ?? 'Chọn 1 track ở danh sách bên dưới'}
            </div>
          </div>
        </div>
        <div className="font-mono text-xs text-white/70 tabular-nums">
          {fmt(currentTime)} <span className="text-white/30">/</span> {fmt(duration)}
        </div>
      </div>

      {/* ── Console body ── */}
      <div
        className="rounded-b-2xl p-4 sm:p-6"
        style={{
          background: 'linear-gradient(180deg, rgba(14,10,22,0.9), rgba(8,5,14,0.94))',
          border: '1px solid rgba(192,38,211,0.35)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          backdropFilter: 'blur(14px)',
        }}
      >
        {/* Decks + mixer */}
        <div className="flex items-start justify-between gap-3 sm:gap-6">
          {/* Deck A */}
          <div className="flex flex-col items-center gap-3">
            <JogWheel track={currentTrack} spinning={isPlaying} accent={NEON_A} label="DECK A" />
            <div className="flex items-center gap-2">
              <button
                onClick={previous}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/70 transition"
                title="Trước"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={togglePlay}
                disabled={!currentTrack}
                className="w-12 h-12 rounded-full flex items-center justify-center text-black transition disabled:opacity-40"
                style={{ background: NEON_A, boxShadow: `0 0 24px ${NEON_A}aa` }}
                title={isPlaying ? 'Tạm dừng' : 'Phát'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/70 transition"
                title="Sau"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center mixer */}
          <div className="flex-1 flex flex-col items-center gap-4 pt-2 min-w-0">
            {/* VU meters + EQ */}
            <div className="flex items-start justify-center gap-4 sm:gap-6">
              <VuMeter active={isPlaying} accent={NEON_A} />
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <Knob label="Hi" accent={NEON_A} />
                <Knob label="Hi" accent={NEON_B} />
                <Knob label="Mid" accent={NEON_A} />
                <Knob label="Mid" accent={NEON_B} />
                <Knob label="Low" accent={NEON_A} />
                <Knob label="Low" accent={NEON_B} />
              </div>
              <VuMeter active={isPlaying} accent={NEON_B} />
            </div>

            {/* Master volume (real) */}
            <div className="w-full max-w-xs flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-white/50 shrink-0" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="dj-range flex-1"
                style={{ accentColor: NEON_A }}
                aria-label="Âm lượng"
              />
              <span className="text-[10px] font-mono text-white/40 w-8 text-right">{Math.round(volume * 100)}</span>
            </div>

            {/* Crossfader (visual A↔B) */}
            <div className="w-full max-w-xs">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={crossfade}
                onChange={(e) => setCrossfade(parseFloat(e.target.value))}
                className="dj-range w-full"
                style={{ accentColor: NEON_B }}
                aria-label="Crossfader"
              />
              <div className="flex justify-between text-[9px] font-mono tracking-widest mt-0.5">
                <span style={{ color: NEON_A }}>A</span>
                <span className="text-white/30">CROSSFADER</span>
                <span style={{ color: NEON_B }}>B</span>
              </div>
            </div>
          </div>

          {/* Deck B (preview / decorative) */}
          <div className="hidden md:flex flex-col items-center gap-3">
            <JogWheel track={deckBTrack} spinning={isPlaying} accent={NEON_B} label="DECK B" />
            <button
              onClick={() => deckBTrack && playTrack(deckBTrack)}
              disabled={!deckBTrack}
              className="px-4 py-2 rounded-full text-[11px] font-mono tracking-widest uppercase transition disabled:opacity-40"
              style={{ background: `${NEON_B}22`, color: NEON_B, border: `1px solid ${NEON_B}55` }}
              title="Nạp track kế tiếp vào deck"
            >
              Load ▸
            </button>
          </div>
        </div>

        {/* ── Waveform / seek lane ── */}
        <div
          ref={laneRef}
          onClick={(e) => seekFromClientX(e.clientX)}
          className="mt-5 relative h-16 rounded-lg overflow-hidden cursor-pointer flex items-center gap-[2px] px-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          role="slider"
          aria-label="Thanh thời gian"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
        >
          {bars.map((b, i) => {
            const played = i / bars.length <= progress;
            return (
              <div
                key={i}
                className="flex-1 rounded-full"
                style={{
                  height: `${b * 100}%`,
                  minWidth: 2,
                  background: played ? NEON_A : 'rgba(255,255,255,0.14)',
                  boxShadow: played ? `0 0 6px ${NEON_A}88` : 'none',
                  transition: 'background 0.1s',
                }}
              />
            );
          })}
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-[2px] pointer-events-none"
            style={{ left: `${progress * 100}%`, background: '#fff', boxShadow: '0 0 8px #fff' }}
          />
        </div>
      </div>

      {/* ── Remix crate (track list) ── */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Music2 className="w-4 h-4" style={{ color: NEON_B }} />
          <h2 className="text-sm font-mono tracking-[0.25em] uppercase text-white/70">Remix Crate</h2>
          <span className="text-[11px] font-mono text-white/30">({tracks.length})</span>
        </div>
        {tracks.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="text-sm text-white/50">Chưa có bản remix nào.</p>
            <p className="text-xs text-white/30 mt-1">
              Upload nhạc ở{' '}
              <a href="/admin/music" className="underline" style={{ color: NEON_A }}>admin/music</a>{' '}
              và chọn danh mục <b>Remix</b>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tracks.map((track) => {
              const isCur = currentTrack?.id === track.id;
              const cover = track.coverImage ? getMediaUrl(track.coverImage, null) : '';
              return (
                <button
                  key={track.id}
                  onClick={() => onLoad(track)}
                  className="group flex items-center gap-3 p-2.5 rounded-xl text-left transition"
                  style={{
                    background: isCur ? `${NEON_A}1a` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isCur ? `${NEON_A}66` : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-black/40 flex items-center justify-center">
                    {cover ? (
                      <img src={cover} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Disc3 className="w-5 h-5 text-white/40" />
                    )}
                    {isCur && isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="flex gap-[2px] items-end h-4">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="w-[3px] rounded-full"
                              style={{ background: NEON_A }}
                              animate={{ height: [4, 14, 4] }}
                              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12, ease: 'easeInOut' }}
                            />
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-medium truncate ${isCur ? 'text-white' : 'text-white/80'}`}>
                      {track.title}
                    </div>
                    <div className="text-[11px] text-white/40 truncate">{track.artist}</div>
                  </div>
                  <span className="text-[10px] font-mono text-white/30 shrink-0">{track.duration}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Range slider skin */}
      <style jsx>{`
        .dj-range {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          outline: none;
        }
        .dj-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
          cursor: pointer;
        }
        .dj-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border: none;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
