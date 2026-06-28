'use client';

/**
 * MusicPickerModal — user-facing music sticker picker.
 *
 * Replaces the old YouTube-based picker (see commit history).
 * Two-step flow the user can step through:
 *
 *   Step 1: PICK A TRACK
 *     - Search box filters the live `?q=` query against the
 *       title and artist columns server-side.
 *     - Each row shows cover + title + artist + duration.
 *     - A ▶ button on each row plays a short preview
 *       (handled by the same Audio element that lives in
 *       the parent composer once the track is committed —
 *       the picker only toggles the preview source).
 *     - Tapping the row body selects the track and advances
 *       to Step 2.
 *
 *   Step 2: TRIM (advanced)
 *     - A dual-handle range slider (startSec → endSec) on a
 *       mini timeline. The start / end are clamped to the
 *       first 40s of the track and to each other. The slider
 *       re-clicks 'Play' on a sub-segment so the user hears
 *       the snippet they're about to attach.
 *     - The trimmer is "Advanced" — we hide it behind a
 *       toggle so the default flow is just "tap to attach"
 *       (startSec=0, endSec=40s, or track length if shorter).
 *     - The user can also "Pick another track" to back to
 *       step 1.
 *
 * The modal mounts a single persistent <audio> element so the
 * preview doesn't restart when the user switches between
 * tracks (we just update its src).
 */

import { useEffect, useRef, useState } from 'react';
import { Search, Play, Pause, X, Scissors, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminSongsApi, type AdminSong } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const MAX_SNIPPET_SEC = 40; // hard cap per the spec

export interface MusicPickerResult {
  musicTrackId: number;
  musicStartSec: number;
  musicEndSec: number;
}

export interface MusicPickerModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with the picked track + snippet bounds when the
   *  user confirms. The parent composer stores these in the
   *  composerMusicTrack field of the store; the actual POST
   *  happens when the user submits the post. */
  onPick: (result: MusicPickerResult & { track: AdminSong }) => void;
}

interface SearchHit extends AdminSong {
  url: string;
}

export default function MusicPickerModal({ open, onClose, onPick }: MusicPickerModalProps) {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'pick' | 'trim'>('pick');
  const [selected, setSelected] = useState<SearchHit | null>(null);
  const [previewingId, setPreviewingId] = useState<number | null>(null);
  const [previewing, setPreviewing] = useState(false);
  // Snippet bounds in seconds. Defaults to the first 40s of the
  // track, or the full track if it's shorter than 40s.
  const [startSec, setStartSec] = useState(0);
  const [endSec, setEndSec] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live-search with a 250ms debounce. The debounce avoids
  // hammering the server while the user is typing — a slow
  // connection is fine; the empty-query path returns the
  // newest 30 active tracks.
  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await adminSongsApi.list({ limit: 30 });
        const rawItems = (res.data?.data?.items ?? []) as AdminSong[];
        // Map AdminSong → SearchHit by aliasing audioUrl → url so
        // the rest of the component can use the shorter name.
        // The adminSongsApi shape returns `audioUrl`; without this
        // mapping, the audio src becomes undefined and the player
        // fires its 'error' event with "Khong the phat track nay".
        const items: SearchHit[] = rawItems.map((t) => ({
          ...t,
          url: t.audioUrl,
        }));
        const q = query.trim().toLowerCase();
        setHits(q ? items.filter(
          (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q),
        ) : items);
      } catch (err) {
        toast.error('Khong tai duoc danh sach nhac');
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open]);

  // Persistent audio element so previews don't restart on
  // track changes. We just swap its src.
  useEffect(() => {
    if (!open) {
      // Tear down on close.
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      setPreviewingId(null);
      setPreviewing(false);
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
      audioRef.current.addEventListener('ended', () => setPreviewing(false));
      audioRef.current.addEventListener('error', () => {
        setPreviewing(false);
        toast.error('Khong the phat nhac nay');
      });
    }
  }, [open]);

  const playPreview = (track: SearchHit) => {
    if (!audioRef.current) return;
    if (previewingId === track.id) {
      // Toggle: same track → pause.
      audioRef.current.pause();
      setPreviewing(false);
      return;
    }
    audioRef.current.src = track.url;
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => {
      setPreviewingId(track.id);
      setPreviewing(true);
    }).catch(() => setPreviewing(false));
  };

  const pickTrack = (track: SearchHit) => {
    setSelected(track);
    // Reset snippet bounds to defaults.
    const dur = Math.max(1, track.durationSec);
    const end = Math.min(dur, MAX_SNIPPET_SEC);
    setStartSec(0);
    setEndSec(end);
    setStep('trim');
    setShowAdvanced(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const toggleSnippetPlay = () => {
    if (!audioRef.current || !selected) return;
    if (previewing && previewingId === selected.id) {
      audioRef.current.pause();
      setPreviewing(false);
      return;
    }
    audioRef.current.src = selected.url;
    audioRef.current.currentTime = startSec;
    audioRef.current.play().then(() => {
      setPreviewingId(selected.id);
      setPreviewing(true);
      // Auto-stop at endSec.
      const stopAt = endSec;
      const onTimeUpdate = () => {
        if (audioRef.current && audioRef.current.currentTime >= stopAt) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('timeupdate', onTimeUpdate);
          setPreviewing(false);
        }
      };
      audioRef.current?.addEventListener('timeupdate', onTimeUpdate);
    }).catch(() => setPreviewing(false));
  };

  const handleConfirm = () => {
    if (!selected) return;
    onPick({
      musicTrackId: selected.id,
      musicStartSec: startSec,
      musicEndSec: endSec,
      track: selected,
    });
    onClose();
  };

  const trackDuration = (selected?.durationSec ?? 0);
  const maxSec = Math.min(trackDuration, MAX_SNIPPET_SEC);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg overflow-hidden rounded-2xl border border-darkborder bg-[#0d0f18] shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-darkborder/60 px-5 py-3.5">
            <div className="flex items-center gap-2.5 text-text-primary">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-neon-violet/30 to-neon-pink/30 text-xs">
                ♫
              </span>
              <h2 className="text-base font-semibold">
                {step === 'pick' ? 'Chọn nhạc nền' : 'Chỉnh đoạn nhạc'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {step === 'pick' ? (
            <div className="p-5 space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo tên bài hát hoặc nghệ sĩ..."
                  className="w-full rounded-lg border border-darkborder bg-darkbg/60 py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-neon-violet/20 border-t-neon-violet" />
                </div>
              ) : hits.length === 0 ? (
                <div className="rounded-xl border border-dashed border-darkborder bg-darkcard/20 px-4 py-8 text-center text-sm text-text-muted">
                  Không tìm thấy bài hát phù hợp.
                </div>
              ) : (
                <ul className="max-h-80 overflow-y-auto rounded-xl border border-darkborder bg-darkcard/40 divide-y divide-darkborder/40">
                  {hits.map((track) => {
                    const isPreviewing = previewingId === track.id && previewing;
                    const m = Math.floor(track.durationSec / 60);
                    const s = track.durationSec % 60;
                    return (
                      <li
                        key={track.id}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] transition-colors cursor-pointer"
                        onClick={() => pickTrack(track)}
                      >
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); playPreview(track); }}
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
                            isPreviewing
                              ? 'bg-neon-emerald/20 text-neon-emerald'
                              : 'bg-white/8 text-text-secondary hover:text-text-primary',
                          )}
                          aria-label={isPreviewing ? 'Dừng phát' : 'Nghe thử'}
                        >
                          {isPreviewing ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5 translate-x-[1px]" />
                          )}
                        </button>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-gradient-to-br from-neon-violet/40 to-neon-pink/40">
                          {track.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={track.coverImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-white">♫</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-text-primary">
                            {track.title}
                          </div>
                          <div className="truncate text-[11px] text-text-muted">
                            {track.artist}
                          </div>
                        </div>
                        <span className="text-[10px] tabular-nums text-text-muted">
                          {m}:{String(s).padStart(2, '0')}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {selected && (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-darkborder bg-darkcard/40 p-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-gradient-to-br from-neon-violet/40 to-neon-pink/40">
                      {selected.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={selected.coverImage} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-white text-xl">♫</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-text-primary">{selected.title}</div>
                      <div className="truncate text-[11px] text-text-muted">{selected.artist}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('pick');
                        setSelected(null);
                        if (audioRef.current) audioRef.current.pause();
                      }}
                      className="rounded-lg px-2 py-1 text-[11px] text-text-muted hover:text-text-primary hover:bg-white/5"
                    >
                      Chọn khác
                    </button>
                  </div>

                  {/* Advanced trimmer — hidden behind toggle by default
                      so the standard "tap to attach" path stays
                      short. */}
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text-primary"
                  >
                    <Scissors className="h-3 w-3" />
                    {showAdvanced ? 'Ẩn tuỳ chỉnh nâng cao' : 'Tuỳ chỉnh nâng cao (cắt 15-40s)'}
                  </button>

                  {showAdvanced ? (
                    <div className="rounded-xl border border-darkborder bg-darkcard/40 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleSnippetPlay}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                          aria-label="Phát đoạn"
                        >
                          {previewing && previewingId === selected.id ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5 translate-x-[1px]" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0 text-xs">
                          <div className="flex items-center justify-between text-text-muted">
                            <span>Bắt đầu: {formatSec(startSec)}</span>
                            <span>Kết thúc: {formatSec(endSec)}</span>
                            <span>{Math.round(endSec - startSec)}s</span>
                          </div>
                          <RangeDual
                            min={0}
                            max={maxSec || 1}
                            step={0.5}
                            valueMin={startSec}
                            valueMax={endSec}
                            onChange={(lo, hi) => { setStartSec(lo); setEndSec(hi); }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-text-muted text-center py-1">
                      Sẽ lấy {formatSec(0)} → {formatSec(endSec)} ({Math.round(endSec - startSec)}s)
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('pick')}
                  className="rounded-lg border border-darkborder bg-darkcard/40 px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-white/5"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-neon-violet to-neon-pink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Check className="h-4 w-4" />
                  Chọn bài hát
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function formatSec(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/**
 * RangeDual — dual-thumb range slider.
 * Single horizontal track; the selected region is highlighted.
 *
 * We render two stacked native <input type="range"> elements
 * (one for the min thumb, one for the max thumb) instead of a
 * custom canvas-drawn slider. Native inputs already give us
 * keyboard support (arrow keys), accessibility (ARIA), and
 * touch support for free, and the visual styling is just CSS
 * overrides on `::-webkit-slider-thumb` and `::-webkit-slider-runnable-track`.
 *
 * The min thumb's value is clamped to the max thumb's value so
 * the thumbs can't cross. Same for the max thumb against the
 * min thumb.
 */
function RangeDual({ min, max, step, valueMin, valueMax, onChange }: {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}) {
  const pct = (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100);
  return (
    <div className="relative h-9 mt-1">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-white/10" />
      <div
        className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-gradient-to-r from-neon-violet to-neon-pink"
        style={{ left: `${pct(valueMin)}%`, right: `${100 - pct(valueMax)}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMin}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (v < valueMax) onChange(v, valueMax);
        }}
        className="range-dual absolute inset-0 w-full appearance-none bg-transparent"
        style={{ zIndex: valueMin > max - 1 ? 5 : 4 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMax}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (v > valueMin) onChange(valueMin, v);
        }}
        className="range-dual absolute inset-0 w-full appearance-none bg-transparent"
        style={{ zIndex: 5 }}
      />
      <style jsx>{`
        .range-dual { pointer-events: none; }
        .range-dual::-webkit-slider-runnable-track { background: transparent; height: 6px; }
        .range-dual::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: white; box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.4);
          pointer-events: auto; cursor: pointer; margin-top: -7px;
        }
        .range-dual::-moz-range-track { background: transparent; height: 6px; }
        .range-dual::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: white; box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.4);
          pointer-events: auto; cursor: pointer; border: none;
        }
      `}</style>
    </div>
  );
}
