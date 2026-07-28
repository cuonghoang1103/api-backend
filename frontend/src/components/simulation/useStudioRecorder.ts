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
  /** Độ phân giải XUẤT — độc lập với khung vẽ 1920×1080. */
  width: number;
  height: number;
  fps: number;
  videoBps: number;
  label: { vi: string; en: string };
  note: { vi: string; en: string };
}

/**
 * Máy di động hay máy yếu?
 *
 * Không dò theo chuỗi user-agent (dễ sai và dễ lỗi thời) mà theo thứ đang
 * thực sự giới hạn: số nhân CPU và việc màn hình có cảm ứng. Một chiếc
 * MacBook có trackpad vẫn không báo `pointer: coarse`, còn điện thoại thì có.
 */
export function isLowPowerDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const cores = navigator.hardwareConcurrency ?? 8;
  const narrow = window.screen?.width ? Math.min(window.screen.width, window.screen.height) < 820 : false;
  return (coarse && narrow) || cores <= 4;
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
/**
 * Ba mức chất lượng — độ phân giải là tham số QUAN TRỌNG NHẤT.
 *
 * BÀI HỌC TỪ MOBILE (28/07/2026)
 * ------------------------------
 * Bản trước quay thẳng canvas 1920×1080 ở 60fps. Trên máy tính thì ổn, trên
 * điện thoại thì hỏng: bộ mã hoá phần cứng không kham nổi 1080p thời gian
 * thực, nó tụt lại rồi rớt khung hàng loạt, và khi `stop()` xả bộ đệm thì
 * phần lớn nội dung chưa kịp mã hoá bị vứt. User quay 24 giây nhưng file chỉ
 * còn ~5 giây, lại phát nhanh vì các khung thưa bị dồn vào khoảng thời gian
 * ngắn hơn nhiều.
 *
 * Cách chữa là hạ ĐỘ PHÂN GIẢI chứ không phải hạ bitrate: chi phí mã hoá tỉ
 * lệ với số điểm ảnh mỗi giây. 1080p60 → 720p30 là giảm 4,5 lần khối lượng
 * việc cho bộ mã hoá, đủ để điện thoại bắt kịp thời gian thực.
 */
export const QUALITY_PRESETS: QualityPreset[] = [
  {
    id: 'high',
    width: 1920,
    height: 1080,
    fps: 60,
    videoBps: 5_000_000,
    label: { vi: '1080p', en: '1080p' },
    note: {
      vi: '1920×1080 · 60fps · 5 Mb/s (~43 MB mỗi phút). Chỉ dùng trên máy tính — điện thoại KHÔNG mã hoá kịp và sẽ rớt khung.',
      en: '1920×1080 · 60fps · 5 Mbps (~43 MB per minute). Desktop only — phones cannot encode this in real time and will drop frames.',
    },
  },
  {
    id: 'balanced',
    width: 1280,
    height: 720,
    fps: 30,
    videoBps: 2_500_000,
    label: { vi: '720p', en: '720p' },
    note: {
      vi: '1280×720 · 30fps · 2,5 Mb/s (~22 MB mỗi phút). Chữ vẫn đọc rõ, đủ để đăng tải và hầu hết điện thoại kham được.',
      en: '1280×720 · 30fps · 2.5 Mbps (~22 MB per minute). Text stays legible, fine for publishing, and most phones can keep up.',
    },
  },
  {
    id: 'light',
    width: 960,
    height: 540,
    fps: 30,
    videoBps: 1_200_000,
    label: { vi: '540p', en: '540p' },
    note: {
      vi: '960×540 · 30fps · 1,2 Mb/s (~11 MB mỗi phút). Mức an toàn nhất cho điện thoại; gửi qua chat hoặc nhúng vào bài học.',
      en: '960×540 · 30fps · 1.2 Mbps (~11 MB per minute). The safest choice on a phone; good for chat and embedding in lessons.',
    },
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

/**
 * Thứ tự ưu tiên codec.
 *
 * Máy khoẻ: VP9 trước — nét hơn ở cùng bitrate.
 * Máy yếu:  VP8 trước — bộ mã hoá phần cứng cho VP8 phổ biến hơn hẳn trên
 *           điện thoại. VP9 nhiều máy phải mã hoá bằng phần mềm, và đó đúng
 *           là thứ làm rớt khung.
 * `video/mp4` xếp cuối cho Safari (từ iOS 17.4 mới có MediaRecorder, và nó
 * KHÔNG hỗ trợ WebM). Bộ vá thời lượng chỉ hiểu WebM nên với mp4 nó lặng lẽ
 * trả lại file gốc — an toàn, không làm hỏng gì.
 */
function mimeCandidates(lowPower: boolean): string[] {
  const webm = lowPower
    ? ['video/webm;codecs=vp8,opus', 'video/webm;codecs=vp9,opus', 'video/webm']
    : ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  return [...webm, 'video/mp4;codecs=avc1,mp4a', 'video/mp4'];
}

function pickMimeType(lowPower: boolean): string | null {
  if (typeof MediaRecorder === 'undefined') return null;
  return mimeCandidates(lowPower).find((m) => MediaRecorder.isTypeSupported(m)) ?? null;
}

export interface UseStudioRecorderArgs {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  sound: SoundEngine;
  /** Gợi ý tên file, ví dụ "rest-api-post-201". */
  baseName: string;
}

export function useStudioRecorder({ canvasRef, sound, baseName }: UseStudioRecorderArgs) {
  const [state, setState] = useState<RecorderState>('idle');
  // Máy yếu mặc định 540p: thà video nhỏ mà đủ khung, còn hơn 1080p rớt khung.
  const [lowPower, setLowPower] = useState(false);
  const [quality, setQuality] = useState<QualityId>('balanced');
  const qualityRef = useRef<QualityId>('balanced');
  qualityRef.current = quality;
  const lowPowerRef = useRef(false);
  lowPowerRef.current = lowPower;
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
  const encoderRef = useRef<HTMLCanvasElement | null>(null);
  const blitRafRef = useRef<number | null>(null);
  const stopBlitRef = useRef<(() => void) | null>(null);
  const startedAtRef = useRef(0);
  const pausedTotalRef = useRef(0);
  const pausedAtRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const weak = isLowPowerDevice();
    setLowPower(weak);
    if (weak) setQuality('light');
    setSupported(typeof MediaRecorder !== 'undefined' && pickMimeType(weak) !== null);
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
    const mimeType = pickMimeType(lowPowerRef.current);
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

    // Canvas MÃ HOÁ riêng, tách khỏi canvas vẽ.
    //
    // Sân khấu luôn vẽ ở 1920×1080 để bố cục và cỡ chữ cố định. Nhưng quay
    // thẳng từ đó thì điện thoại chết ngạt. Thay vào đó ta thu nhỏ từng khung
    // sang một canvas phụ đúng độ phân giải xuất rồi mới `captureStream` từ
    // canvas phụ đó. Chi phí thêm chỉ là một lần `drawImage` mỗi khung — GPU
    // làm việc này gần như miễn phí — đổi lại bộ mã hoá nhẹ đi tới 4-5 lần.
    const encoder = document.createElement('canvas');
    encoder.width = preset.width;
    encoder.height = preset.height;
    const encCtx = encoder.getContext('2d', { alpha: false });
    if (!encCtx) {
      setError('Không tạo được canvas mã hoá.');
      return;
    }
    encCtx.imageSmoothingEnabled = true;
    encCtx.imageSmoothingQuality = 'high';
    encoderRef.current = encoder;

    let blitting = true;
    const blit = () => {
      if (!blitting) return;
      // Vẽ khung mới nhất của sân khấu, đã thu về độ phân giải xuất.
      encCtx.drawImage(canvas, 0, 0, encoder.width, encoder.height);
      blitRafRef.current = requestAnimationFrame(blit);
    };
    stopBlitRef.current = () => {
      blitting = false;
      if (blitRafRef.current != null) cancelAnimationFrame(blitRafRef.current);
      blitRafRef.current = null;
    };
    blit();

    const canvasStream = encoder.captureStream(preset.fps);
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
      stopBlitRef.current?.();
      stopBlitRef.current = null;
      encoderRef.current = null;
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
            // Safari xuất mp4, phần còn lại xuất webm — đuôi file phải theo
            // đúng container, nếu không hệ điều hành mở bằng ứng dụng sai.
            filename: `${baseName || 'simulation'}.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`,
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
      stopBlitRef.current?.();
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
    lowPower,
    start,
    stop,
    pause,
    resume,
    toggleMic,
    download,
    discard,
  };
}
