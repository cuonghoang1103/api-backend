'use client';
/**
 * My Language — Conversation ("Giao tiếp") section.
 * Chat-bubble Q/A pairs with pronunciation + TTS, collapsible Vietnamese
 * meaning, optional admin voice clip, optional illustrative image (lightbox),
 * and a client-side MediaRecorder practice mode (record → replay → compare).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { MessagesSquare, Mic, Pause, Play, Square, X } from 'lucide-react';
import { toast } from 'sonner';
import { fetchAllPages, languageApi } from '@/lib/language-api';
import type { ConversationItem } from '@/types/language';
import {
  CardsSkeleton,
  EmptyState,
  SectionShell,
  SpeakerButton,
  usePrefersReducedMotion,
} from '@/components/language/primitives';
import { getImageUrl, getMediaUrl } from '@/lib/utils';

// ─── Mini play/pause audio (admin voice) ───────────────────────────
function MiniAudio({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnd = () => setPlaying(false);
    el.addEventListener('ended', onEnd);
    el.addEventListener('pause', onEnd);
    return () => {
      el.removeEventListener('ended', onEnd);
      el.removeEventListener('pause', onEnd);
    };
  }, []);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play().then(() => setPlaying(true)).catch(() => toast.error('Không phát được âm thanh'));
    } else {
      el.pause();
    }
  }, []);

  return (
    <>
      <audio ref={ref} src={src} preload="none" className="hidden" />
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-neon-cyan ring-1 ring-neon-cyan/30 transition hover:bg-neon-cyan/10"
      >
        {playing ? <Pause size={13} /> : <Play size={13} />} {label}
      </button>
    </>
  );
}

// ─── Practice recorder (client-side only, no upload) ───────────────
function PracticeRecorder({ voiceSrc }: { voiceSrc: string | null }) {
  const [supported, setSupported] = useState(true);
  const [recording, setRecording] = useState(false);
  const [clipUrl, setClipUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const clipUrlRef = useRef<string | null>(null);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const adminAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const ok =
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function' &&
      typeof window !== 'undefined' &&
      typeof window.MediaRecorder !== 'undefined';
    setSupported(ok);
  }, []);

  // keep a ref so the unmount cleanup always revokes the latest URL
  useEffect(() => {
    clipUrlRef.current = clipUrl;
  }, [clipUrl]);

  useEffect(() => {
    return () => {
      if (clipUrlRef.current) URL.revokeObjectURL(clipUrlRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const start = useCallback(async () => {
    if (!supported) {
      toast.error('Trình duyệt không hỗ trợ ghi âm');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        setClipUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      recorderRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      toast.error('Không truy cập được micro');
    }
  }, [supported]);

  const stop = useCallback(() => {
    recorderRef.current?.stop();
    setRecording(false);
  }, []);

  const replay = useCallback(() => {
    const el = userAudioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => toast.error('Không phát lại được'));
  }, []);

  // Play admin voice, then the user recording back-to-back to compare.
  const compare = useCallback(() => {
    const admin = adminAudioRef.current;
    const user = userAudioRef.current;
    if (!admin || !user) return;
    const onAdminEnd = () => {
      admin.removeEventListener('ended', onAdminEnd);
      user.currentTime = 0;
      void user.play().catch(() => undefined);
    };
    admin.addEventListener('ended', onAdminEnd);
    admin.currentTime = 0;
    void admin.play().catch(() => {
      admin.removeEventListener('ended', onAdminEnd);
      toast.error('Không phát được âm thanh mẫu');
    });
  }, []);

  if (!supported) {
    return <p className="mt-2 text-[11px] text-text-muted">Trình duyệt không hỗ trợ ghi âm luyện tập.</p>;
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {!recording ? (
        <button
          type="button"
          onClick={start}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-neon-violet ring-1 ring-neon-violet/30 transition hover:bg-neon-violet/10"
        >
          <Mic size={13} /> Ghi âm
        </button>
      ) : (
        <button
          type="button"
          onClick={stop}
          className="inline-flex items-center gap-1.5 rounded-full bg-neon-orange/15 px-2.5 py-1 text-xs font-medium text-neon-orange ring-1 ring-neon-orange/40 transition hover:bg-neon-orange/25"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-neon-orange" />
          <Square size={12} /> Dừng
        </button>
      )}

      {clipUrl && (
        <>
          <audio ref={userAudioRef} src={clipUrl} preload="auto" className="hidden" />
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-neon-cyan ring-1 ring-neon-cyan/30 transition hover:bg-neon-cyan/10"
          >
            <Play size={13} /> Nghe lại
          </button>
          {voiceSrc && (
            <>
              <audio ref={adminAudioRef} src={voiceSrc} preload="none" className="hidden" />
              <button
                type="button"
                onClick={compare}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-neon-blue ring-1 ring-neon-blue/30 transition hover:bg-neon-blue/10"
              >
                <Play size={13} /> So sánh mẫu
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─── One Q/A conversation card ─────────────────────────────────────
function ConversationCard({
  item,
  onImage,
}: {
  item: ConversationItem;
  onImage: (url: string) => void;
}) {
  const [showMeaning, setShowMeaning] = useState(false);
  const voiceSrc = item.voiceUrl ? getMediaUrl(item.voiceUrl, null, item.id) : null;

  return (
    <div className="card p-4">
      {item.imageUrl && (
        <button
          type="button"
          onClick={() => onImage(getImageUrl(item.imageUrl ?? undefined))}
          aria-label="Phóng to hình minh hoạ"
          className="mb-3 block w-full overflow-hidden rounded-xl ring-1 ring-[var(--border-color)]"
        >
          <Image
            src={getImageUrl(item.imageUrl ?? undefined)}
            alt=""
            width={640}
            height={360}
            className="h-auto w-full object-cover"
            unoptimized
          />
        </button>
      )}

      {/* Question bubble (left) */}
      <div className="flex flex-col items-start">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--bg-surface)] px-3.5 py-2 ring-1 ring-[var(--border-color)]">
          <p className="break-words text-sm text-text-primary">{item.question}</p>
        </div>
        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2 pl-1">
          {item.questionPronunciation && (
            <span className="min-w-0 break-words text-[11px] italic text-text-muted">{item.questionPronunciation}</span>
          )}
          <SpeakerButton text={item.question} reading={item.questionPronunciation} audioUrl={null} size={15} rate={0.85} />
        </div>
      </div>

      {/* Answer bubble (right) */}
      <div className="mt-3 flex flex-col items-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-neon-violet/20 px-3.5 py-2 ring-1 ring-neon-violet/30">
          <p className="break-words text-sm text-text-primary">{item.answer}</p>
        </div>
        <div className="mt-1 flex min-w-0 flex-wrap items-center justify-end gap-2 pr-1">
          {item.answerPronunciation && (
            <span className="min-w-0 break-words text-[11px] italic text-text-muted">{item.answerPronunciation}</span>
          )}
          <SpeakerButton text={item.answer} reading={item.answerPronunciation} audioUrl={null} size={15} rate={0.85} />
        </div>
        {voiceSrc && (
          <div className="mt-1.5 pr-1">
            <MiniAudio src={voiceSrc} label="Nghe mẫu" />
          </div>
        )}
        <div className="self-stretch">
          <PracticeRecorder voiceSrc={voiceSrc} />
        </div>
      </div>

      {/* Vietnamese meaning (collapsible) */}
      {item.meaningVi && (
        <div className="mt-3 border-t border-[var(--border-color)] pt-2">
          <button
            type="button"
            onClick={() => setShowMeaning((v) => !v)}
            aria-expanded={showMeaning}
            className="text-xs font-medium text-text-muted transition hover:text-neon-violet"
          >
            {showMeaning ? 'Ẩn nghĩa' : 'Xem nghĩa'}
          </button>
          {showMeaning && <p className="mt-1 text-sm text-text-secondary">{item.meaningVi}</p>}
        </div>
      )}

      {item.note && <p className="mt-2 text-[11px] text-text-muted">{item.note}</p>}
    </div>
  );
}

export default function ConversationPage() {
  const code = String(useParams().code);
  const [items, setItems] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchAllPages(async ({ page, limit }) => {
      const res = await languageApi.conversation(code, { page, limit });
      return res.data.data ?? [];
    })
      .then((all) => {
        if (alive) setItems(all);
      })
      .catch(() => {
        if (alive) toast.error('Không tải được nội dung giao tiếp');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [code]);

  return (
    <SectionShell code={code} title="Giao tiếp" icon={<MessagesSquare size={26} className="text-neon-violet" />}>
      {loading ? (
        <CardsSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          emoji="💬"
          title="Chưa có mẫu câu giao tiếp"
          hint="Các đoạn hội thoại luyện nói cho ngôn ngữ này sẽ sớm được thêm vào."
        />
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <ConversationCard key={it.id} item={it} onImage={setLightbox} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeInOut' } }}
            onClick={() => setLightbox(null)}
            style={{ pointerEvents: 'auto' }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Xem hình"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Đóng"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X size={20} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-full rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}
