'use client';

/**
 * "Gọi cho CuongMini" — nói chuyện bằng giọng thay vì gõ chữ.
 *
 * Vòng lặp: NGHE → NGHĨ → NÓI → nghe tiếp. Mỗi lượt vẫn đi qua đúng đường
 * `sendMessage` của khung chat, nên cuộc gọi được lưu vào chính phiên trò
 * chuyện đó — gọi xong đóng lại là thấy toàn bộ nội dung dạng chữ.
 *
 * Ba quyết định đáng ghi lại:
 *
 * 1. **Nghe bằng trình duyệt trước, máy chủ sau.** `SpeechRecognition` có sẵn
 *    trong Chrome/Cốc Cốc/Edge: miễn phí, độ trễ gần bằng không, không gửi
 *    tiếng nói đi đâu cả. Safari/Firefox không có nó → lùi về thu âm rồi gửi
 *    `POST /ai/stt` (Whisper của Groq, dùng lại khoá sẵn có). Đường lùi là chỗ
 *    lỗi hay nấp, nên nó có nút bấm riêng ("Giữ để nói") chứ không tự chạy ngầm.
 *
 * 2. **Cắt lời được.** Chạm vào vòng tròn lúc máy đang nói là nó im ngay và
 *    chuyển sang nghe. Trợ lý giọng nói mà không cắt lời được thì mỗi lần nó
 *    hiểu sai là người dùng phải ngồi nghe hết.
 *
 * 3. **Im lặng KHÔNG phải lỗi.** Nghe hụt vài lần đầu là chuyện thường (mic
 *    chưa sẵn, người dùng còn nghĩ). Ba lần liên tiếp không nghe thấy gì thì
 *    dừng vòng lặp và chờ người dùng chạm — vòng lặp tự quay mãi vừa tốn pin
 *    vừa làm đèn mic nhấp nháy không dứt.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSpeech } from '@/hooks/useSpeech';
import type { ChatSkin } from '@/store/chatSkinStore';

type Phase = 'idle' | 'listening' | 'thinking' | 'speaking' | 'blocked';
type Lang = 'VI' | 'EN';

const PHASE_LABEL: Record<Phase, { vi: string; hint: string }> = {
  idle: { vi: 'Chạm để nói', hint: 'Chạm vào vòng tròn rồi nói' },
  listening: { vi: 'Đang nghe…', hint: 'Nói xong cứ im, mình tự hiểu là hết câu' },
  thinking: { vi: 'Đang nghĩ…', hint: '' },
  speaking: { vi: 'CuongMini đang nói…', hint: 'Chạm để cắt lời' },
  blocked: { vi: 'Không dùng được mic', hint: 'Cho phép micro trong trình duyệt rồi thử lại' },
};

/** Số lần nghe hụt liên tiếp trước khi dừng vòng lặp và chờ người dùng chạm. */
const MAX_SILENT_ROUNDS = 3;

export default function VoiceCallOverlay({
  open,
  onClose,
  onAsk,
  skin = 'terminal',
}: {
  open: boolean;
  onClose: () => void;
  /** Gửi câu vừa nghe được vào đúng luồng chat; trả về câu trả lời đã hoàn tất. */
  onAsk: (text: string) => Promise<string>;
  skin?: ChatSkin;
}) {
  const isStudio = skin === 'studio';
  const reduceMotion = useReducedMotion();
  const {
    speak, stopSpeak, speaking, ttsSupported,
    listen, stopListen, sttSupported,
    startRecording, stopRecording, recording, recordSupported,
  } = useSpeech();

  const [phase, setPhase] = useState<Phase>('idle');
  const [lang, setLang] = useState<Lang>('VI');
  const [muted, setMuted] = useState(false);       // tắt tiếng CuongMini
  const [micOff, setMicOff] = useState(false);     // tạm dừng nghe
  const [heard, setHeard] = useState('');          // câu người dùng vừa nói
  const [reply, setReply] = useState('');          // câu trả lời đang/đã đọc
  const [uploading, setUploading] = useState(false);

  const silentRounds = useRef(0);
  const wasSpeaking = useRef(false);
  const closedRef = useRef(false);

  // ── Dừng mọi thứ khi đóng ─────────────────────────────────────
  const hangUp = useCallback(() => {
    closedRef.current = true;
    stopListen();
    stopSpeak();
    setPhase('idle');
    onClose();
  }, [onClose, stopListen, stopSpeak]);

  useEffect(() => {
    if (open) { closedRef.current = false; return; }
    // Đóng bằng bất cứ đường nào (Esc, nút, đổi trang) cũng phải tắt mic + loa.
    closedRef.current = true;
    stopListen();
    stopSpeak();
  }, [open, stopListen, stopSpeak]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') hangUp(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, hangUp]);

  // ── Một lượt: nghe → hỏi → đọc câu trả lời ────────────────────
  const ask = useCallback(async (text: string) => {
    setHeard(text);
    setReply('');
    setPhase('thinking');
    try {
      const answer = await onAsk(text);
      if (closedRef.current) return;
      setReply(answer);
      if (!answer.trim()) { setPhase('idle'); return; }
      if (muted || !ttsSupported) { setPhase('idle'); return; }
      setPhase('speaking');
      speak(answer, lang);
    } catch {
      if (closedRef.current) return;
      toast.error('Không gửi được câu hỏi');
      setPhase('idle');
    }
  }, [onAsk, muted, ttsSupported, speak, lang]);

  const beginListening = useCallback(() => {
    if (closedRef.current || micOff) return;
    if (!sttSupported) { setPhase('idle'); return; } // đường lùi: nút "Giữ để nói"
    setPhase('listening');
    listen(
      lang,
      (text) => { silentRounds.current = 0; void ask(text); },
      (code) => {
        if (closedRef.current) return;
        if (code === 'not-allowed' || code === 'service-not-allowed') {
          setPhase('blocked');
          return;
        }
        // 'no-speech' / 'aborted': im lặng là chuyện thường, thử lại vài lần.
        silentRounds.current += 1;
        if (silentRounds.current >= MAX_SILENT_ROUNDS) { setPhase('idle'); return; }
        setTimeout(() => { if (!closedRef.current) beginListening(); }, 600);
      },
    );
  }, [ask, lang, listen, micOff, sttSupported]);

  // Mở cuộc gọi → nghe ngay (nếu trình duyệt nghe được).
  useEffect(() => {
    if (!open) return;
    silentRounds.current = 0;
    setHeard(''); setReply('');
    if (sttSupported) beginListening();
    else setPhase('idle');
    // chỉ chạy khi mở
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Đọc xong → nghe tiếp. Bám vào lượt CHUYỂN true→false của `speaking`:
  // `speak()` có thể phải chờ nạp danh sách giọng nên cờ chưa bật ngay,
  // đọc thẳng `!speaking` sẽ quay về nghe khi máy còn chưa kịp mở miệng.
  useEffect(() => {
    if (wasSpeaking.current && !speaking && phase === 'speaking' && !closedRef.current) {
      beginListening();
    }
    wasSpeaking.current = speaking;
  }, [speaking, phase, beginListening]);

  // ── Chạm vòng tròn: cắt lời / bắt đầu nghe ────────────────────
  const tapOrb = useCallback(() => {
    if (phase === 'speaking') { stopSpeak(); return; }  // cắt lời → effect trên sẽ nghe tiếp
    if (phase === 'listening') { stopListen(); setPhase('idle'); return; }
    if (phase === 'thinking') return;
    silentRounds.current = 0;
    beginListening();
  }, [phase, stopSpeak, stopListen, beginListening]);

  // ── Đường lùi cho Safari/Firefox: giữ để nói, thả ra thì gửi ──
  const pushToTalk = useCallback(() => {
    if (recording) { stopRecording(); return; }
    setPhase('listening');
    void startRecording(async (blob) => {
      setPhase('idle');
      if (!blob) { toast.error('Không mở được micro'); return; }
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('audio', blob, 'cau-hoi.webm');
        fd.append('language', lang === 'VI' ? 'vi' : 'en');
        const res = await fetch('/api/v1/ai/stt', { method: 'POST', body: fd });
        const json = await res.json();
        const text = json?.data?.text as string | undefined;
        if (!res.ok || !json?.success) { toast.error(json?.message || 'Không nghe được'); return; }
        if (!text?.trim()) { toast.info('Chưa nghe rõ, thử nói lại gần mic hơn'); return; }
        void ask(text);
      } catch {
        toast.error('Không gửi được đoạn ghi âm');
      } finally {
        setUploading(false);
      }
    });
  }, [recording, startRecording, stopRecording, lang, ask]);

  if (!open) return null;

  const label = PHASE_LABEL[phase];
  const active = phase === 'listening' || phase === 'speaking';

  // Bảng màu: bản studio đi theo theme sáng/tối của web; bản terminal giữ tông cyan.
  const surface = isStudio ? 'bg-[var(--studio-bg)]' : 'bg-[#0a0a0f]';
  const textMain = isStudio ? 'text-[color:var(--studio-text)]' : 'text-[#f8fafc]';
  const textSoft = isStudio ? 'text-[color:var(--studio-text-soft)]' : 'text-[#94a3b8]';
  const textFaint = isStudio ? 'text-[color:var(--studio-text-faint)]' : 'text-[#64748b]';
  const chip = isStudio
    ? 'border-[color:var(--studio-border)] bg-[var(--studio-panel)] hover:bg-[var(--studio-panel-soft)]'
    : 'border-[#22d3ee]/25 bg-[#0d1117] hover:bg-[#22d3ee]/10';

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Cuộc gọi với CuongMini"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-0 z-[200] flex flex-col ${surface}`}
    >
      {/* Đầu: ngôn ngữ nghe + trạng thái phụ */}
      <div className="flex items-center justify-between px-4 pt-4 sm:px-6">
        <div className={`text-[11px] uppercase tracking-[0.18em] ${textFaint}`}>cuongthai.com</div>
        <div role="group" aria-label="Ngôn ngữ nghe" className={`flex items-center gap-0.5 rounded-full border p-0.5 ${chip}`}>
          {(['VI', 'EN'] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`h-7 rounded-full px-3 text-[11px] font-medium transition-colors ${
                lang === l ? (isStudio ? 'bg-[var(--studio-accent)] text-white' : 'bg-[#22d3ee]/20 text-[#22d3ee]') : textFaint
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Giữa: vòng tròn + trạng thái + lời thoại gần nhất */}
      <div className="flex flex-1 flex-col items-center justify-center gap-7 px-6 text-center">
        <button
          type="button"
          onClick={tapOrb}
          aria-label={phase === 'speaking' ? 'Cắt lời' : 'Bắt đầu nói'}
          className="relative flex h-40 w-40 items-center justify-center rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6366f1]/40 sm:h-48 sm:w-48"
        >
          {/* Sóng lan — chỉ khi đang nghe/nói, và tắt hẳn nếu người dùng xin giảm chuyển động */}
          {active && !reduceMotion && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: phase === 'listening' ? 'rgba(99,102,241,0.16)' : 'rgba(139,92,246,0.16)' }}
                animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: phase === 'listening' ? 'rgba(99,102,241,0.12)' : 'rgba(139,92,246,0.12)' }}
                animate={{ scale: [1, 1.6], opacity: [0.35, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
              />
            </>
          )}
          <motion.span
            className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-2xl font-bold text-white shadow-[0_10px_40px_rgba(99,102,241,0.35)] sm:h-32 sm:w-32"
            animate={reduceMotion ? undefined : { scale: active ? [1, 1.04, 1] : 1 }}
            transition={{ duration: 2.4, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
          >
            {phase === 'thinking' || uploading
              ? <Loader2 className="h-7 w-7 animate-spin" />
              : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/favicon.png" alt="" className="h-3/5 w-3/5 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]" />
              )}
          </motion.span>
        </button>

        <div className="min-h-[3.5rem]">
          <p className={`text-lg font-medium ${textMain}`} aria-live="polite">{label.vi}</p>
          {label.hint && <p className={`mt-1 text-[13px] ${textFaint}`}>{label.hint}</p>}
        </div>

        {/* Lời thoại gần nhất — mỗi bên tối đa 2 dòng, đủ để biết máy nghe đúng chưa */}
        <div className="w-full max-w-md space-y-2">
          <AnimatePresence mode="popLayout">
            {heard && (
              <motion.p
                key={`h-${heard}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`line-clamp-2 text-[13px] ${textSoft}`}
              >
                <span className={textFaint}>Bạn: </span>{heard}
              </motion.p>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {reply && (
              <motion.p
                key={`r-${reply.slice(0, 24)}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`line-clamp-3 text-[15px] leading-6 ${textMain}`}
              >
                {reply}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Đường lùi: trình duyệt không nghe trực tiếp được */}
        {!sttSupported && (
          <div className="space-y-2">
            <p className={`text-[13px] ${textFaint}`}>
              Trình duyệt này không nghe trực tiếp được — giữ nút rồi nói.
            </p>
            <button
              type="button"
              onClick={pushToTalk}
              disabled={!recordSupported || uploading}
              className={`inline-flex h-12 items-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors disabled:opacity-50 ${chip} ${textMain}`}
            >
              <Mic className="h-4 w-4" />
              {recording ? 'Đang thu — bấm để gửi' : 'Bấm để nói'}
            </button>
          </div>
        )}
      </div>

      {/* Cuối: ba nút, mỗi nút ≥56px cho ngón tay */}
      <div className="flex items-center justify-center gap-5 px-6 pb-10 pt-4 sm:gap-8">
        <button
          type="button"
          onClick={() => { setMicOff((v) => { if (!v) stopListen(); else setTimeout(beginListening, 0); return !v; }); }}
          aria-pressed={micOff}
          aria-label={micOff ? 'Bật micro' : 'Tắt micro'}
          className={`flex h-14 w-14 items-center justify-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/50 ${chip} ${micOff ? 'text-rose-500' : textMain}`}
        >
          {micOff ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={hangUp}
          aria-label="Kết thúc cuộc gọi"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-white shadow-[0_8px_28px_rgba(225,29,72,0.4)] transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/40 active:scale-95"
        >
          <PhoneOff className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={() => { setMuted((v) => { if (!v) stopSpeak(); return !v; }); }}
          aria-pressed={muted}
          aria-label={muted ? 'Bật tiếng CuongMini' : 'Tắt tiếng CuongMini'}
          className={`flex h-14 w-14 items-center justify-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/50 ${chip} ${muted ? 'text-rose-500' : textMain}`}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      <p className={`pb-6 text-center text-[11px] ${textFaint}`}>
        Cuộc gọi được lưu vào khung chat · Esc để kết thúc
      </p>
    </motion.div>
  );
}
