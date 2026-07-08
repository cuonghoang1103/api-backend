'use client';
/**
 * My Language — Listening ("Nghe") section.
 * Lesson list → in-page detail with a custom audio player (play/pause,
 * seek, speed, A-B loop) for UPLOAD sources, or a YouTube embed. Transcript
 * and translation are progressive reveals; comprehension answers are
 * spoiler-blurred until tapped.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Eye, Gauge, Headphones, Pause, Play, Repeat } from 'lucide-react';
import { toast } from 'sonner';
import { fetchAllPages, languageApi } from '@/lib/language-api';
import type { ListeningItem } from '@/types/language';
import {
  CardsSkeleton,
  EmptyState,
  SectionShell,
  usePrefersReducedMotion,
} from '@/components/language/primitives';
import { getMediaUrl } from '@/lib/utils';
import { getYouTubeId } from '@/lib/videoEmbed';

const SPEEDS = [0.5, 0.75, 1, 1.25] as const;
type Speed = (typeof SPEEDS)[number];

function fmtTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ─── Custom audio player (seek + speed + A-B loop) ─────────────────
function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);
  const [loopA, setLoopA] = useState<number | null>(null);
  const [loopB, setLoopB] = useState<number | null>(null);

  // keep the A-B markers current for the timeupdate listener without
  // re-binding it on every seek.
  const loopRef = useRef<{ a: number | null; b: number | null }>({ a: null, b: null });
  useEffect(() => {
    loopRef.current = { a: loopA, b: loopB };
  }, [loopA, loopB]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      setCurrent(el.currentTime);
      const { a, b } = loopRef.current;
      if (a != null && b != null && b > a && el.currentTime >= b) {
        el.currentTime = a;
      }
    };
    const onMeta = () => setDuration(el.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
    };
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => toast.error('Không phát được âm thanh'));
    } else {
      el.pause();
    }
  }, []);

  const seek = useCallback((v: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = v;
    setCurrent(v);
  }, []);

  const pickSpeed = useCallback((s: Speed) => {
    const el = audioRef.current;
    setSpeed(s);
    if (el) el.playbackRate = s;
  }, []);

  const clearLoop = useCallback(() => {
    setLoopA(null);
    setLoopB(null);
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Tạm dừng' : 'Phát'}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neon-violet/20 text-neon-violet ring-1 ring-neon-violet/40 transition hover:bg-neon-violet/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/60"
        >
          {playing ? <Pause size={20} /> : <Play size={20} className="translate-x-[1px]" />}
        </button>

        <div className="min-w-0 flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={Math.min(current, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Thanh tua"
            className="w-full accent-neon-violet"
          />
          <div className="mt-0.5 flex justify-between text-[11px] tabular-nums text-text-muted">
            <span>{fmtTime(current)}</span>
            <span>{fmtTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Speed control */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
          <Gauge size={14} /> Tốc độ
        </span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => pickSpeed(s)}
            aria-pressed={speed === s}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition ${
              speed === s
                ? 'bg-neon-violet/20 text-neon-violet ring-neon-violet/40'
                : 'bg-[var(--bg-card)] text-text-secondary ring-[var(--border-color)] hover:text-text-primary'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>

      {/* A-B loop */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
          <Repeat size={14} /> Lặp A-B
        </span>
        <button
          type="button"
          onClick={() => setLoopA(current)}
          className="rounded-full bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-neon-cyan ring-1 ring-neon-cyan/30 transition hover:bg-neon-cyan/10"
        >
          Đặt A{loopA != null ? ` (${fmtTime(loopA)})` : ''}
        </button>
        <button
          type="button"
          onClick={() => setLoopB(current)}
          className="rounded-full bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-neon-blue ring-1 ring-neon-blue/30 transition hover:bg-neon-blue/10"
        >
          Đặt B{loopB != null ? ` (${fmtTime(loopB)})` : ''}
        </button>
        {(loopA != null || loopB != null) && (
          <button
            type="button"
            onClick={clearLoop}
            className="rounded-full bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-text-muted ring-1 ring-[var(--border-color)] transition hover:text-text-primary"
          >
            Xoá A-B
          </button>
        )}
        {loopA != null && loopB != null && loopB <= loopA && (
          <span className="text-[11px] text-neon-orange">B phải sau A</span>
        )}
      </div>
    </div>
  );
}

// ─── Comprehension question with spoiler answer ────────────────────
function QuestionRow({ q, a }: { q: string; a: string }) {
  const [shown, setShown] = useState(false);
  return (
    <li className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3">
      <p className="text-sm font-medium text-text-primary">{q}</p>
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        aria-expanded={shown}
        className={`mt-1.5 rounded-md text-left text-sm text-text-secondary transition ${
          shown ? '' : 'select-none blur-sm hover:blur-[3px]'
        }`}
      >
        {a || '—'}
      </button>
      {!shown && <p className="mt-1 text-[11px] text-text-muted">Chạm để hiện đáp án</p>}
    </li>
  );
}

// ─── Lesson detail ─────────────────────────────────────────────────
function LessonDetail({ item, onBack }: { item: ListeningItem; onBack: () => void }) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const reduced = usePrefersReducedMotion();

  const ytId = item.sourceType === 'YOUTUBE' ? getYouTubeId(item.youtubeUrl) : null;
  const audioSrc =
    item.sourceType === 'UPLOAD' && item.audioUrl
      ? getMediaUrl(item.audioUrl, null, item.id)
      : null;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-4"
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition hover:text-neon-violet"
      >
        <ArrowLeft size={16} /> Danh sách bài nghe
      </button>

      <div className="card p-4 sm:p-5">
        <h2 className="mb-3 font-heading text-xl font-bold text-text-primary">{item.title}</h2>

        {audioSrc ? (
          <AudioPlayer src={audioSrc} />
        ) : ytId ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-[var(--border-color)]">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ) : (
          <p className="text-sm text-text-muted">Bài nghe này chưa có nguồn âm thanh.</p>
        )}

        {/* Transcript reveal */}
        {item.transcript && (
          <div className="mt-4">
            {!showTranscript ? (
              <button
                type="button"
                onClick={() => setShowTranscript(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-3.5 py-1.5 text-sm font-medium text-neon-violet ring-1 ring-neon-violet/30 transition hover:bg-neon-violet/10"
              >
                <Eye size={15} /> Hiện transcript
              </button>
            ) : (
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3">
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-text-primary">
                  {item.transcript}
                </p>
                {item.translation && (
                  <div className="mt-3 border-t border-[var(--border-color)] pt-3">
                    {!showTranslation ? (
                      <button
                        type="button"
                        onClick={() => setShowTranslation(true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card)] px-3.5 py-1.5 text-sm font-medium text-neon-cyan ring-1 ring-neon-cyan/30 transition hover:bg-neon-cyan/10"
                      >
                        <Eye size={15} /> Hiện bản dịch
                      </button>
                    ) : (
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-text-secondary">
                        {item.translation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Comprehension questions */}
        {item.questions && item.questions.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Câu hỏi</h3>
            <ul className="space-y-2">
              {item.questions.map((qq, i) => (
                <QuestionRow key={i} q={qq.question} a={qq.answer} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ListeningPage() {
  const code = String(useParams().code);
  const [items, setItems] = useState<ListeningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchAllPages(async ({ page, limit }) => {
      const res = await languageApi.listening(code, { page, limit });
      return res.data.data ?? [];
    })
      .then((all) => {
        if (alive) setItems(all);
      })
      .catch(() => {
        if (alive) toast.error('Không tải được danh sách bài nghe');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [code]);

  const selected = items.find((it) => it.id === selectedId) ?? null;

  return (
    <SectionShell code={code} title="Nghe" icon={<Headphones size={26} className="text-neon-violet" />}>
      {loading ? (
        <CardsSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          emoji="🎧"
          title="Chưa có bài nghe"
          hint="Nội dung luyện nghe cho ngôn ngữ này sẽ sớm được thêm vào."
        />
      ) : (
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key="detail"
              exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.2, ease: 'easeInOut' } }}
              style={{ pointerEvents: 'auto' }}
            >
              <LessonDetail item={selected} onBack={() => setSelectedId(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.2, ease: 'easeInOut' } }}
              style={{ pointerEvents: 'auto' }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setSelectedId(it.id)}
                  className="card group flex items-center gap-3 p-4 text-left transition hover:ring-2 hover:ring-neon-violet/40"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neon-violet/15 text-neon-violet">
                    <Headphones size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-text-primary">{it.title}</span>
                    <span className="text-xs text-text-muted">
                      {it.sourceType === 'YOUTUBE' ? 'YouTube' : 'Audio'}
                      {it.questions && it.questions.length > 0 ? ` · ${it.questions.length} câu hỏi` : ''}
                    </span>
                  </span>
                  <Play size={18} className="shrink-0 text-text-muted transition group-hover:text-neon-violet" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </SectionShell>
  );
}
