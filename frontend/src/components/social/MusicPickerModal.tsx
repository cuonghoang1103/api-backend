'use client';

/**
 * MusicPickerModal — user-facing music picker for post background music.
 *
 * Two SOURCES (tabs):
 *   1. "Nhạc nền"     → the admin-curated Song pool (publicSongsApi, /songs).
 *   2. "Từ trang nhạc" → the public music page tracks (musicApi, /music/tracks).
 *      Picking one bridges it into a Song via /songs/from-music-track so it can
 *      attach to the post (which FKs to Song). YouTube-only tracks that haven't
 *      been downloaded to R2 are rejected with a clear message.
 *
 * Two STEPS:
 *   Step 1: PICK — server-side search (?q=) over title/artist; each row has a
 *           preview ▶ (only for directly-playable audio).
 *   Step 2: TRIM — optional dual-thumb slider to pick a segment. Default is the
 *           whole track, so a user who ignores it still attaches the full song.
 *
 * A single persistent <audio> element powers the preview.
 */

import { useEffect, useRef, useState } from 'react';
import { Search, Play, Pause, X, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { publicSongsApi, musicApi, type AdminSong } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface MusicPickerResult {
  musicTrackId: number;
  musicStartSec: number;
  musicEndSec: number;
}

// Minimal shape the composer needs from a picked track. `id` is always a
// Song id by the time we call onPick (music-page picks are resolved first).
export interface MusicPickTrack {
  id: number;
  title: string;
  artist: string;
  coverImage: string | null;
  audioUrl: string | null;
  durationSec: number;
}

export interface MusicPickerModalProps {
  open: boolean;
  onClose: () => void;
  onPick: (result: MusicPickerResult & { track: MusicPickTrack }) => void;
}

type PickSource = 'song' | 'music';

interface PickRow {
  id: number;
  title: string;
  artist: string;
  coverImage: string | null;
  durationSec: number;
  audioUrl: string | null;
  source: PickSource;
}

// A URL we can drop straight into <audio> (R2 mp3 etc). YouTube links can't
// play as inline background audio, so we don't offer a preview for them.
function isInlinePlayable(url: string | null | undefined): boolean {
  return !!url && /^https?:\/\//i.test(url) && !/(?:youtube\.com|youtu\.be)/i.test(url);
}

export default function MusicPickerModal({ open, onClose, onPick }: MusicPickerModalProps) {
  const [source, setSource] = useState<PickSource>('song');
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<PickRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [step, setStep] = useState<'pick' | 'trim'>('pick');
  const [selected, setSelected] = useState<MusicPickTrack | null>(null);
  const [previewingId, setPreviewingId] = useState<number | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [startSec, setStartSec] = useState(0);
  const [endSec, setEndSec] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset to a clean state every time the modal opens — otherwise reopening
  // drops the user straight into the trim screen of the previously-picked song.
  useEffect(() => {
    if (open) {
      setStep('pick');
      setSelected(null);
      setQuery('');
      setSource('song');
      setPreviewingId(null);
      setPreviewing(false);
    }
  }, [open]);

  // Live search (250ms debounce), server-side ?q= against the active source.
  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const q = query.trim();
        if (source === 'song') {
          const res = await publicSongsApi.list({ q: q || undefined, limit: 30 });
          const items = (res.data?.data?.items ?? []) as AdminSong[];
          setHits(items.map((t) => ({
            id: t.id, title: t.title, artist: t.artist,
            coverImage: t.coverImage ?? null, durationSec: t.durationSec,
            audioUrl: t.audioUrl, source: 'song' as const,
          })));
        } else {
          const res = await musicApi.getTracks({ page: 1, size: 30, keyword: q || undefined });
          const items = ((res.data as { data?: unknown[] })?.data ?? []) as Array<Record<string, unknown>>;
          setHits(items.map((t) => ({
            id: Number(t.id),
            title: String(t.title ?? ''),
            artist: String(t.artist ?? ''),
            coverImage: (t.coverImage as string | null) ?? null,
            durationSec: Number(t.durationSeconds ?? 0),
            audioUrl: (t.audioUrl as string | null) ?? null,
            source: 'music' as const,
          })));
        }
      } catch {
        toast.error('Không tải được danh sách nhạc');
        setHits([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open, source]);

  // Persistent audio element for previews.
  useEffect(() => {
    if (!open) {
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
        toast.error('Không thể phát nhạc này');
      });
    }
  }, [open]);

  const playPreview = (row: PickRow) => {
    if (!audioRef.current || !isInlinePlayable(row.audioUrl)) return;
    if (previewingId === row.id) {
      audioRef.current.pause();
      setPreviewing(false);
      setPreviewingId(null);
      return;
    }
    audioRef.current.src = row.audioUrl!;
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => {
      setPreviewingId(row.id);
      setPreviewing(true);
    }).catch(() => setPreviewing(false));
  };

  // Advance to the trim step with a resolved, attachable Song. Music-page
  // rows are bridged to a Song first (may reject YouTube-only tracks).
  const pickRow = async (row: PickRow) => {
    if (audioRef.current) audioRef.current.pause();
    setPreviewing(false);
    setPreviewingId(null);

    let track: MusicPickTrack;
    if (row.source === 'song') {
      track = {
        id: row.id, title: row.title, artist: row.artist,
        coverImage: row.coverImage, audioUrl: row.audioUrl, durationSec: row.durationSec,
      };
    } else {
      setResolving(true);
      try {
        const res = await publicSongsApi.fromMusicTrack(row.id);
        const song = res.data.data;
        track = {
          id: song.id, title: song.title, artist: song.artist,
          coverImage: song.coverImage ?? null, audioUrl: song.audioUrl, durationSec: song.durationSec,
        };
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        toast.error(e?.response?.data?.message || 'Không dùng được bài này làm nhạc nền');
        return;
      } finally {
        setResolving(false);
      }
    }

    setSelected(track);
    const dur = Math.max(1, track.durationSec);
    setStartSec(0);
    setEndSec(dur);
    setStep('trim');
  };

  const toggleSnippetPlay = () => {
    if (!audioRef.current || !selected || !isInlinePlayable(selected.audioUrl)) return;
    if (previewing && previewingId === selected.id) {
      audioRef.current.pause();
      setPreviewing(false);
      return;
    }
    audioRef.current.src = selected.audioUrl!;
    audioRef.current.currentTime = startSec;
    audioRef.current.play().then(() => {
      setPreviewingId(selected.id);
      setPreviewing(true);
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

  const trackDuration = selected?.durationSec ?? 0;
  const maxSec = trackDuration;

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
              {/* Source tabs */}
              <div className="flex gap-1 rounded-lg bg-darkbg/60 p-1">
                {([
                  { key: 'song', label: 'Nhạc nền' },
                  { key: 'music', label: 'Từ trang nhạc' },
                ] as const).map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => { setSource(t.key); setHits([]); }}
                    className={cn(
                      'flex-1 rounded-md py-1.5 text-sm font-medium transition-colors',
                      source === t.key
                        ? 'bg-gradient-to-r from-neon-violet/30 to-neon-pink/30 text-text-primary'
                        : 'text-text-muted hover:text-text-primary',
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

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

              {source === 'music' && (
                <p className="text-[11px] text-text-muted">
                  Chỉ bài đã tải về (⬇ ở trang nhạc) mới phát nền được; bài YouTube chưa tải sẽ báo lỗi khi chọn.
                </p>
              )}

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
                    const canPreview = isInlinePlayable(track.audioUrl);
                    return (
                      <li
                        key={`${track.source}-${track.id}`}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] transition-colors cursor-pointer"
                        onClick={() => void pickRow(track)}
                      >
                        <button
                          type="button"
                          disabled={!canPreview}
                          onClick={(e) => { e.stopPropagation(); playPreview(track); }}
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
                            !canPreview
                              ? 'bg-white/5 text-text-muted/40 cursor-not-allowed'
                              : isPreviewing
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
                        {resolving ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-text-muted" />
                        ) : (
                          <span className="text-[10px] tabular-nums text-text-muted">
                            {m}:{String(s).padStart(2, '0')}
                          </span>
                        )}
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

                  {/* Trimmer — default is the whole track. */}
                  <div className="rounded-xl border border-darkborder bg-darkcard/40 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleSnippetPlay}
                        disabled={!isInlinePlayable(selected.audioUrl)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-40"
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
 * RangeDual — dual-thumb range slider (two stacked native range inputs).
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
