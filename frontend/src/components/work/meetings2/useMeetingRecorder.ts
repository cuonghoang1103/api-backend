'use client';

/**
 * CT Work K-2 — GHI ÂM CUỘC HỌP theo đoạn ~90 giây, tải dần lên backend (không mất khi rớt mạng).
 *
 * Vì sao xoay vòng MediaRecorder thay vì `start(timeslice)`: với timeslice chỉ mảnh ĐẦU có phần đầu tệp (EBML/moov),
 * các mảnh sau không tự giải mã được ⇒ Whisper không đọc được từng đoạn. Mỗi đoạn ở đây là một tệp độc lập: bật máy
 * ghi MỚI trên cùng luồng micro rồi mới dừng máy cũ (chồng vài chục ms — backend bỏ dòng lặp ở mép nối).
 *
 * Hàng tải: mỗi đoạn có `seq` cố định ⇒ gửi lại sau lỗi mạng không nhân đôi (backend trả `duplicate`). Lỗi ⇒ thử lại
 * với nhịp lùi dần (2 s → 30 s), tiếp tục khi trình duyệt báo `online`. Đoạn chỉ rời bộ nhớ khi máy chủ đã nhận.
 *
 * Dọn đúng lúc (cùng bài học useGhiAm.ts): rời trang ⇒ dừng máy ghi + tắt micro, nếu không đèn micro sáng mãi.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { duoiTheoKieu, kieuGhiDuoc } from '@/components/messaging/useGhiAm';

export const CHUNK_MS = 90_000;

export interface QueuedChunk { seq: number; startMs: number; durationMs: number; blob: Blob; fileName: string; speakerId: number | null; tries: number }
export type RecorderState = 'idle' | 'starting' | 'recording' | 'stopping';
export type RecorderError = 'unsupported' | 'denied' | 'no-mic' | 'other' | null;

export function useMeetingRecorder(opts: {
  upload: (c: QueuedChunk) => Promise<unknown>;
  /** Người đang giữ mic (gán cho đoạn sắp đóng). */
  speakerId: number | null;
  chunkMs?: number;
}) {
  const chunkMs = opts.chunkMs ?? CHUNK_MS;
  const [state, setState] = useState<RecorderState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [pending, setPending] = useState(0);
  const [uploaded, setUploaded] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<RecorderError>(null);

  const stream = useRef<MediaStream | null>(null);
  const rec = useRef<MediaRecorder | null>(null);
  const t0 = useRef(0);
  const seq = useRef(0);
  const rotateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const queue = useRef<QueuedChunk[]>([]);
  const busy = useRef(false);
  const uploadRef = useRef(opts.upload);
  const speakerRef = useRef(opts.speakerId);
  const stopWaiters = useRef<Array<() => void>>([]);
  const alive = useRef(true);
  uploadRef.current = opts.upload;
  speakerRef.current = opts.speakerId;

  const pump = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      while (queue.current.length && alive.current) {
        const c = queue.current[0];
        try {
          await uploadRef.current(c);
          queue.current.shift();
          setUploaded((n) => n + 1);
          setRetrying(false);
        } catch (err) {
          const status = (err as { response?: { status?: number } })?.response?.status;
          // 4xx (trừ 408/429) = máy chủ từ chối hẳn (lượt ghi đã đóng, sai kiểu…) ⇒ bỏ đoạn, không thử mãi.
          if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
            queue.current.shift();
            continue;
          }
          c.tries += 1;
          setRetrying(true);
          const wait = Math.min(30_000, 2000 * 2 ** Math.min(c.tries - 1, 4));
          await new Promise((r) => setTimeout(r, wait));
        } finally {
          setPending(queue.current.length);
        }
      }
    } finally {
      busy.current = false;
    }
  }, []);

  useEffect(() => {
    const on = () => { void pump(); };
    window.addEventListener('online', on);
    return () => window.removeEventListener('online', on);
  }, [pump]);

  const now = () => performance.now() - t0.current;

  const startOne = useCallback(() => {
    const s = stream.current;
    if (!s) return;
    const mime = kieuGhiDuoc();
    const r = mime ? new MediaRecorder(s, { mimeType: mime }) : new MediaRecorder(s);
    const parts: Blob[] = [];
    const segStart = now();
    const mySeq = seq.current++;
    r.ondataavailable = (e) => { if (e.data && e.data.size) parts.push(e.data); };
    r.onstop = () => {
      const type = r.mimeType || mime || 'audio/webm';
      const blob = new Blob(parts, { type });
      const durationMs = Math.max(0, now() - segStart);
      if (blob.size && durationMs >= 500) {
        queue.current.push({ seq: mySeq, startMs: segStart, durationMs, blob, fileName: `meeting-${String(mySeq).padStart(4, '0')}.${duoiTheoKieu(type)}`, speakerId: speakerRef.current, tries: 0 });
        setPending(queue.current.length);
        void pump();
      }
      const w = stopWaiters.current.shift();
      w?.();
    };
    r.start();
    return r;
  }, [pump]);

  const rotate = useCallback(() => {
    const old = rec.current;
    const next = startOne();
    if (next) rec.current = next;
    if (old && old.state !== 'inactive') old.stop();
    rotateTimer.current = setTimeout(rotate, chunkMs);
  }, [startOne, chunkMs]);

  const cleanup = useCallback(() => {
    if (rotateTimer.current) clearTimeout(rotateTimer.current);
    if (tick.current) clearInterval(tick.current);
    rotateTimer.current = null; tick.current = null;
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { setError('unsupported'); return false; }
    setState('starting');
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    } catch (err) {
      const n = (err as DOMException)?.name;
      setError(n === 'NotAllowedError' || n === 'SecurityError' ? 'denied' : n === 'NotFoundError' ? 'no-mic' : 'other');
      setState('idle');
      return false;
    }
    t0.current = performance.now();
    seq.current = 0;
    setElapsed(0);
    rec.current = startOne() ?? null;
    rotateTimer.current = setTimeout(rotate, chunkMs);
    tick.current = setInterval(() => setElapsed(now()), 1000);
    setState('recording');
    return true;
  }, [startOne, rotate, chunkMs]);

  /** Dừng: đóng đoạn cuối, tắt micro, đợi hàng tải trống (tối đa `waitMs`). */
  const stop = useCallback(async (waitMs = 20_000) => {
    if (state !== 'recording' && !rec.current) return;
    setState('stopping');
    if (rotateTimer.current) clearTimeout(rotateTimer.current);
    const r = rec.current;
    rec.current = null;
    if (r && r.state !== 'inactive') {
      await new Promise<void>((res) => { stopWaiters.current.push(res); r.stop(); setTimeout(res, 3000); });
    }
    cleanup();
    const end = Date.now() + waitMs;
    while (queue.current.length && Date.now() < end) await new Promise((res) => setTimeout(res, 300));
    setState('idle');
  }, [state, cleanup]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      try { if (rec.current && rec.current.state !== 'inactive') rec.current.stop(); } catch { /* đã dừng */ }
      cleanup();
    };
  }, [cleanup]);

  // Còn đoạn chưa tải ⇒ hỏi trước khi rời trang.
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (queue.current.length || rec.current) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, []);

  return { state, elapsed, pending, uploaded, retrying, error, start, stop };
}
