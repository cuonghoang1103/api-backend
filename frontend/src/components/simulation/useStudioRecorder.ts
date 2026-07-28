'use client';

/**
 * Phòng thu: quay canvas + trộn âm thanh, xuất file .webm.
 *
 * ĐƯỜNG HÌNH
 * ----------
 * `canvas.captureStream(60)` trả về một MediaStream có đúng một video track
 * lấy thẳng từ backing store 1920×1080 — không phụ thuộc kích thước hiển
 * thị, không dính thanh trình duyệt, không cần người dạy bấm chọn cửa sổ.
 * Đây là lý do toàn bộ hoạt cảnh được vẽ trên canvas thay vì SVG: SVG/DOM
 * KHÔNG có captureStream, muốn quay thì buộc phải dùng getDisplayMedia().
 *
 * ĐƯỜNG TIẾNG — phần dễ sai nhất
 * ------------------------------
 * MediaRecorder nhận MỘT MediaStream. Nếu ta đưa vào hai audio track (một
 * của SFX, một của micro) thì đa số trình duyệt chỉ mã hoá track ĐẦU TIÊN
 * và tiếng còn lại biến mất — lỗi này rất hay gặp và chỉ phát hiện ra sau
 * khi đã quay xong cả bài giảng. Cách đúng là trộn TRƯỚC trong đồ thị Web
 * Audio: SFX và micro cùng nối vào một MediaStreamAudioDestinationNode
 * (xem `useSoundEngine`), rồi lấy đúng MỘT track đã trộn sẵn từ đó.
 *
 *   SFX  ─┐
 *          ├→ recordDest → 1 audio track ─┐
 *   Mic  ─┘                                ├→ new MediaStream → MediaRecorder
 *   canvas.captureStream() → 1 video track ┘
 *
 * ĐỊNH DẠNG
 * ---------
 * Chrome/Firefox chỉ xuất WebM ổn định qua MediaRecorder, nên phần này
 * KHÔNG hứa hẹn .mp4. Cần .mp4 để đưa lên nền tảng video thì chuyển đổi
 * bằng ffmpeg phía máy chủ (container backend đã có sẵn /usr/bin/ffmpeg):
 *
 *   ffmpeg -i bai-giang.webm -c:v libx264 -crf 20 -preset slow \
 *          -c:a aac -b:a 192k -movflags +faststart bai-giang.mp4
 *
 * Tuyệt đối không dùng ffmpeg.wasm tải từ CDN — CSP `default-src 'self'`
 * của site chặn thẳng.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { withWebmDuration } from './fixWebmDuration';
import type { SoundEngine } from './useSoundEngine';

export type RecorderState = 'idle' | 'recording' | 'paused';

export type QualityId = 'high' | 'balanced' | 'light';

export interface QualityPreset {
  id: QualityId;
  fps: number;
  videoBps: number;
  label: { vi: string; en: string };
  note: { vi: string; en: string };
}

/**
 * Ba mức chất lượng.
 *
 * Bản đầu để cứng 8 Mb/s ở 60fps — nét thật, nhưng một video 15 giây đã nặng
 * 16 MB và người dạy không có cách nào chỉnh. Con số đó thừa thãi với nội
 * dung của trang này: nền tối phẳng, hình khối đặc, chữ sắc nét — VP9 nén
 * loại nội dung đồ hoạ tổng hợp cực tốt. Ở 5 Mb/s mắt thường không phân biệt
 * được với 8 Mb/s, mà dung lượng giảm gần 40%.
 *
 * Mức "Nhẹ" hạ xuống 30fps: chính việc giảm một nửa số khung mới là thứ cắt
 * dung lượng mạnh nhất, chứ không phải riêng bitrate. Hoạt cảnh ở đây chuyển
 * động chậm và mượt nên 30fps vẫn xem tốt.
 */
export const QUALITY_PRESETS: QualityPreset[] = [
  {
    id: 'high',
    fps: 60,
    videoBps: 5_000_000,
    label: { vi: 'Nét tối đa', en: 'Maximum' },
    note: { vi: '5 Mb/s · 60fps · ~43 MB mỗi phút — dành cho bản lưu trữ gốc', en: '5 Mbps · 60fps · ~43 MB per minute — for an archival master' },
  },
  {
    id: 'balanced',
    fps: 30,
    videoBps: 2_500_000,
    label: { vi: 'Cân bằng', en: 'Balanced' },
    note: { vi: '2,5 Mb/s · 30fps · ~22 MB mỗi phút — vẫn nét chữ, hợp để đăng tải', en: '2.5 Mbps · 30fps · ~22 MB per minute — text stays crisp, ideal for publishing' },
  },
  {
    id: 'light',
    fps: 30,
    videoBps: 1_200_000,
    label: { vi: 'Nhẹ', en: 'Light' },
    note: { vi: '1,2 Mb/s · 30fps · ~11 MB mỗi phút — gửi qua chat, nhúng vào bài học', en: '1.2 Mbps · 30fps · ~11 MB per minute — for chat and embedding in lessons' },
  },
];

export function getQuality(id: QualityId): QualityPreset {
  return QUALITY_PRESETS.find((q) => q.id === id) ?? QUALITY_PRESETS[1];
}

export interface RecordingResult {
  url: string;
  blob: Blob;
  mimeType: string;
  sizeBytes: number;
  durationMs: number;
  filename: string;
}

/** Thứ tự ưu tiên codec: VP9 nét hơn ở cùng bitrate, VP8 để dự phòng. */
const MIME_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm;codecs=vp9',
  'video/webm',
];

function pickMimeType(): string | null {
  if (typeof MediaRecorder === 'undefined') return null;
  return MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m)) ?? null;
}

export interface UseStudioRecorderArgs {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  sound: SoundEngine;
  /** Gợi ý tên file, ví dụ "rest-api-post-201". */
  baseName: string;
}

export function useStudioRecorder({ canvasRef, sound, baseName }: UseStudioRecorderArgs) {
  const [state, setState] = useState<RecorderState>('idle');
  const [quality, setQuality] = useState<QualityId>('balanced');
  const qualityRef = useRef<QualityId>('balanced');
  qualityRef.current = quality;
  const [micEnabled, setMicEnabled] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState<RecordingResult | null>(null);
  /** Đang vá header sau khi dừng ghi — vài chục mili giây. */
  const [finalising, setFinalising] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const micStreamRef = useRef<MediaStream | null>(null);
  const canvasStreamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef(0);
  const pausedTotalRef = useRef(0);
  const pausedAtRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setSupported(typeof MediaRecorder !== 'undefined' && pickMimeType() !== null);
  }, []);

  /* ── Đồng hồ hiển thị ─────────────────────────────────────────
     Dùng performance.now() ở ĐÂY là hợp lệ: đây là đồng hồ tường của bản
     ghi, không phải trục thời gian của mô phỏng. Trục mô phỏng vẫn đếm
     bằng số khung để giữ tính tất định. */
  const startTimer = useCallback(() => {
    if (timerRef.current != null) return;
    timerRef.current = window.setInterval(() => {
      if (pausedAtRef.current) return;
      setElapsedMs(performance.now() - startedAtRef.current - pausedTotalRef.current);
    }, 200);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /* ── Micro ────────────────────────────────────────────────── */

  const enableMic = useCallback(async (): Promise<boolean> => {
    setError(null);
    if (micStreamRef.current) return true;
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Trình duyệt không hỗ trợ thu âm micro.');
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // Ba tuỳ chọn này quan trọng khi thu giọng giảng trong phòng thường:
          // khử vọng, khử ồn nền và tự cân bằng âm lượng.
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      micStreamRef.current = stream;
      await sound.ensure();
      sound.connectMic(stream);
      setMicReady(true);
      return true;
    } catch (e) {
      const name = e instanceof DOMException ? e.name : '';
      setError(
        name === 'NotAllowedError'
          ? 'Bạn đã từ chối quyền micro. Mở khoá ở biểu tượng ổ khoá trên thanh địa chỉ rồi thử lại.'
          : name === 'NotFoundError'
            ? 'Không tìm thấy thiết bị micro nào.'
            : 'Không mở được micro.'
      );
      setMicReady(false);
      return false;
    }
  }, [sound]);

  const disableMic = useCallback(() => {
    sound.disconnectMic();
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
    setMicReady(false);
  }, [sound]);

  const toggleMic = useCallback(async () => {
    if (micEnabled) {
      disableMic();
      setMicEnabled(false);
    } else {
      const ok = await enableMic();
      setMicEnabled(ok);
    }
  }, [micEnabled, disableMic, enableMic]);

  /* ── Bắt đầu / dừng ───────────────────────────────────────── */

  const start = useCallback(async () => {
    setError(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mimeType = pickMimeType();
    if (!mimeType) {
      setError('Trình duyệt này không hỗ trợ MediaRecorder cho WebM. Hãy dùng Chrome, Edge hoặc Firefox bản mới.');
      return;
    }

    // AudioContext phải được mở từ trong một cử chỉ người dùng — nút bấm
    // chính là cử chỉ đó, nên gọi ở đây là đúng chỗ.
    const graph = await sound.ensure();
    if (micEnabled && !micStreamRef.current) await enableMic();

    // Giải phóng URL của bản ghi trước để không rò bộ nhớ khi quay nhiều lần.
    if (lastUrlRef.current) {
      URL.revokeObjectURL(lastUrlRef.current);
      lastUrlRef.current = null;
    }
    setResult(null);

    const preset = getQuality(qualityRef.current);
    const canvasStream = canvas.captureStream(preset.fps);
    canvasStreamRef.current = canvasStream;

    const tracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];
    // Chỉ MỘT audio track: track này đã là bản trộn sẵn của SFX + micro.
    const mixed = graph ? sound.getRecordStream() : null;
    const audioTrack = mixed?.getAudioTracks()[0];
    if (audioTrack) tracks.push(audioTrack);

    const combined = new MediaStream(tracks);
    const recorder = new MediaRecorder(combined, {
      mimeType,
      videoBitsPerSecond: preset.videoBps,
      audioBitsPerSecond: 128_000,
    });

    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onerror = () => setError('Quá trình ghi gặp lỗi và đã dừng.');
    recorder.onstop = () => {
      const raw = new Blob(chunksRef.current, { type: mimeType });
      chunksRef.current = [];
      const durationMs = performance.now() - startedAtRef.current - pausedTotalRef.current;
      setState('idle');
      stopTimer();
      canvasStreamRef.current?.getTracks().forEach((t) => t.stop());
      canvasStreamRef.current = null;

      // Ghi thời lượng thật vào header trước khi giao file cho người dùng.
      // MediaRecorder ghi theo luồng nên bỏ trống trường này, khiến trình phát
      // và phần mềm dựng đọc sai độ dài. Vá thất bại thì dùng nguyên bản gốc.
      setFinalising(true);
      void withWebmDuration(raw, durationMs)
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          lastUrlRef.current = url;
          setResult({
            url,
            blob,
            mimeType,
            sizeBytes: blob.size,
            durationMs,
            filename: `${baseName || 'simulation'}.webm`,
          });
        })
        .finally(() => setFinalising(false));
    };

    // timeslice 1000ms: chunk được đẩy ra mỗi giây thay vì dồn tới lúc stop.
    // Nếu tab sập giữa chừng, phần đã ghi vẫn còn trong bộ nhớ.
    recorder.start(1000);
    recorderRef.current = recorder;
    startedAtRef.current = performance.now();
    pausedTotalRef.current = 0;
    pausedAtRef.current = 0;
    setElapsedMs(0);
    setState('recording');
    startTimer();
  }, [baseName, canvasRef, enableMic, micEnabled, sound, startTimer, stopTimer]);

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    if (!rec || rec.state === 'inactive') return;
    rec.stop();
    recorderRef.current = null;
  }, []);

  const pause = useCallback(() => {
    const rec = recorderRef.current;
    if (!rec || rec.state !== 'recording') return;
    rec.pause();
    pausedAtRef.current = performance.now();
    setState('paused');
  }, []);

  const resume = useCallback(() => {
    const rec = recorderRef.current;
    if (!rec || rec.state !== 'paused') return;
    rec.resume();
    pausedTotalRef.current += performance.now() - pausedAtRef.current;
    pausedAtRef.current = 0;
    setState('recording');
  }, []);

  const download = useCallback(() => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [result]);

  const discard = useCallback(() => {
    if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
    lastUrlRef.current = null;
    setResult(null);
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
      recorderRef.current?.state !== 'inactive' && recorderRef.current?.stop();
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      canvasStreamRef.current?.getTracks().forEach((t) => t.stop());
      if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
    };
  }, [stopTimer]);

  return {
    state,
    supported,
    elapsedMs,
    result,
    finalising,
    error,
    micEnabled,
    micReady,
    quality,
    setQuality,
    start,
    stop,
    pause,
    resume,
    toggleMic,
    download,
    discard,
  };
}
