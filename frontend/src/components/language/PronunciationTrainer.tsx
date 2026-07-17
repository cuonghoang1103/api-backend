'use client';
/**
 * My Language — AI pronunciation trainer (Pro/Max).
 *
 * The learner reads `target` aloud → we record (useSpeech.startRecording) →
 * POST the clip to /my-language/ai/pronounce → Groq Whisper transcribes it and
 * an LLM scores the pronunciation. Shows a score ring + what the STT heard +
 * Vietnamese feedback + tips, with replay of both the sample and the recording.
 *
 * Audio is never persisted server-side. The Pro gate + non-Pro redirect live in
 * PronounceButton — this modal only opens for Pro users.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader2, X, RotateCcw, AlertTriangle, Lightbulb, Play, BookmarkPlus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { languageApi, notebookApi, type PronunciationResult } from '@/lib/language-api';
import { SpeakerButton, ProgressRing } from '@/components/language/primitives';
import { useSpeech } from '@/hooks/useSpeech';
import type { VocabLang } from '@/lib/notesTts';

function speakLang(code: string): VocabLang | undefined {
  const c = (code || '').toLowerCase();
  if (c === 'ja') return 'ja-JP';
  if (c === 'zh') return 'zh-CN';
  if (c === 'en') return 'en-US';
  return undefined;
}

const VERDICT: Record<PronunciationResult['verdict'], { label: string; ring: string; text: string }> = {
  good: { label: 'Tốt', ring: 'text-neon-green', text: 'text-neon-green' },
  ok: { label: 'Khá', ring: 'text-neon-cyan', text: 'text-neon-cyan' },
  poor: { label: 'Cần luyện thêm', ring: 'text-neon-orange', text: 'text-neon-orange' },
};

export function PronunciationTrainer({
  target,
  reading,
  languageCode,
  title,
  onClose,
}: {
  target: string;
  reading?: string | null;
  languageCode: string;
  title: string;
  onClose: () => void;
}) {
  const { startRecording, stopRecording, recording, recordSupported } = useSpeech();
  const [mounted, setMounted] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const autoStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedUrlRef = useRef<string | null>(null);

  useEffect(() => setMounted(true), []);

  const saveToNotebook = async (r: PronunciationResult) => {
    if (saved) return;
    const body = [
      `**Mục tiêu:** ${r.target}${reading ? ` (${reading})` : ''}`,
      r.heard ? `**Máy nghe được:** ${r.heard}` : '',
      `**Điểm:** ${r.score}/100 (${r.verdict})`,
      r.feedback ? `\n${r.feedback}` : '',
      r.tips.length ? `\n### Mẹo\n${r.tips.map((t) => `- ${t}`).join('\n')}` : '',
    ].filter(Boolean).join('\n\n');
    try {
      await notebookApi.save({ code: languageCode, title, kind: 'pronunciation', reading: reading ?? undefined, body });
      setSaved(true);
      toast.success('Đã lưu vào sổ tay');
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không lưu được.');
    }
  };

  // Escape to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Cleanup the recording object URL + auto-stop timer on unmount.
  useEffect(() => () => {
    if (autoStopTimer.current) clearTimeout(autoStopTimer.current);
    if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current);
  }, []);

  const forceLang = speakLang(languageCode);

  const toggleRecord = useCallback(() => {
    if (recording) { stopRecording(); return; }
    setError(null);
    setResult(null);
    if (recordedUrlRef.current) { URL.revokeObjectURL(recordedUrlRef.current); recordedUrlRef.current = null; setRecordedUrl(null); }
    void startRecording(async (blob) => {
      if (autoStopTimer.current) { clearTimeout(autoStopTimer.current); autoStopTimer.current = null; }
      if (!blob) { setError('Không ghi âm được — micro bị chặn hoặc không khả dụng.'); return; }
      const url = URL.createObjectURL(blob);
      recordedUrlRef.current = url;
      setRecordedUrl(url);
      setScoring(true);
      try {
        const r = await languageApi.pronounce({ audio: blob, languageCode, target, reading: reading ?? undefined });
        setResult(r.data.data ?? null);
      } catch (e: unknown) {
        const msg =
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Không chấm được, vui lòng thử lại.';
        setError(msg);
      } finally {
        setScoring(false);
      }
    });
    // Safety cap so a forgotten recording doesn't run forever / upload huge audio.
    autoStopTimer.current = setTimeout(() => stopRecording(), 12_000);
  }, [recording, startRecording, stopRecording, languageCode, target, reading]);

  const replay = useCallback(() => {
    if (!recordedUrl) return;
    const a = new Audio(recordedUrl);
    a.play().catch(() => {});
  }, [recordedUrl]);

  if (!mounted) return null;

  const v = result ? VERDICT[result.verdict] : null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ y: 24, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Luyện phát âm"
          className="card flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-[var(--border-color)] px-4 py-3.5">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-violet/15 text-neon-violet">
              <Mic size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-neon-violet">Luyện phát âm</p>
              <p className="truncate font-heading text-base font-semibold text-text-primary">{title}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-muted transition hover:bg-[var(--bg-surface)] hover:text-text-primary"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {/* Target to read + sample playback */}
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-[var(--bg-surface)] p-4 ring-1 ring-[var(--border-color)]">
              <div className="min-w-0 text-center">
                <p className="break-words text-xl font-bold text-text-primary">{target}</p>
                {reading && <p className="mt-0.5 text-xs text-text-muted">{reading}</p>}
              </div>
              <SpeakerButton text={target} reading={reading} forceLang={forceLang} />
            </div>

            {!recordSupported ? (
              <div className="flex items-start gap-2 rounded-xl bg-neon-orange/10 p-3 text-neon-orange ring-1 ring-neon-orange/30">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm">Trình duyệt không hỗ trợ ghi âm. Hãy thử trên Chrome/Safari mới.</p>
              </div>
            ) : (
              <>
                {/* Mic control */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleRecord}
                    disabled={scoring}
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-full ring-1 transition disabled:opacity-50 ${
                      recording
                        ? 'animate-pulse bg-neon-pink/20 text-neon-pink ring-neon-pink/40'
                        : 'bg-neon-violet/15 text-neon-violet ring-neon-violet/40 hover:bg-neon-violet/25'
                    }`}
                    aria-label={recording ? 'Dừng ghi' : 'Bắt đầu đọc'}
                  >
                    {recording ? <Square size={26} /> : <Mic size={28} />}
                  </button>
                  <p className="text-xs text-text-muted">
                    {scoring ? 'Đang chấm…' : recording ? 'Đang nghe… bấm để dừng' : 'Bấm micro rồi đọc to'}
                  </p>
                </div>

                {scoring && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-muted">
                    <Loader2 size={18} className="animate-spin text-neon-violet" /> Đang phân tích phát âm…
                  </div>
                )}

                {error && !scoring && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-neon-orange/10 p-3 text-neon-orange ring-1 ring-neon-orange/30">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {result && !scoring && v && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-surface)] p-3 ring-1 ring-[var(--border-color)]">
                      <div className={v.ring}>
                        <ProgressRing value={result.score} size={60} label={`${result.score}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold ${v.text}`}>{v.label}</p>
                        {result.heard && (
                          <p className="mt-0.5 break-words text-xs text-text-muted">
                            Máy nghe được: <span className="text-text-secondary">{result.heard}</span>
                          </p>
                        )}
                        {recordedUrl && (
                          <button
                            type="button"
                            onClick={replay}
                            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-neon-violet hover:underline"
                          >
                            <Play size={12} /> Nghe lại bản ghi
                          </button>
                        )}
                      </div>
                    </div>

                    {result.feedback && (
                      <p className="rounded-xl bg-neon-violet/10 p-3 text-sm text-text-primary ring-1 ring-neon-violet/25">{result.feedback}</p>
                    )}

                    {result.tips.length > 0 && (
                      <div className="flex items-start gap-2 rounded-xl bg-neon-cyan/10 p-3 text-neon-cyan ring-1 ring-neon-cyan/30">
                        <Lightbulb size={18} className="mt-0.5 shrink-0" />
                        <ul className="min-w-0 list-disc space-y-1 pl-4 text-sm text-text-secondary">
                          {result.tips.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={toggleRecord}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-4 py-2 text-sm font-medium text-text-secondary ring-1 ring-[var(--border-color)] transition hover:text-neon-violet hover:ring-neon-violet/40"
                      >
                        <RotateCcw size={15} /> Thử lại
                      </button>
                      <button
                        type="button"
                        onClick={() => saveToNotebook(result)}
                        disabled={saved}
                        className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 transition disabled:opacity-70 ${saved ? 'bg-neon-green/15 text-neon-green ring-neon-green/30' : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-neon-violet hover:ring-neon-violet/40'}`}
                      >
                        {saved ? <Check size={15} /> : <BookmarkPlus size={15} />} {saved ? 'Đã lưu' : 'Lưu vào sổ tay'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

/**
 * PronounceButton — Pro-gated trigger. Non-Pro users go to /pro; Pro users open
 * the trainer (managed by the parent via `onOpen`).
 */
export function PronounceButton({ isPro, onOpen, className = '' }: { isPro: boolean; onOpen: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      title="Luyện phát âm"
      /* Primary: filled. Speaking the word is the main thing to DO with a
         vocabulary card, so it must not look like a peer of the AI button. */
      className={`inline-flex items-center gap-1.5 rounded-full bg-neon-cyan px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 ${className}`}
    >
      <Mic size={14} />
      <span>Luyện đọc</span>
      {!isPro && (
        <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide">
          Pro
        </span>
      )}
    </button>
  );
}
