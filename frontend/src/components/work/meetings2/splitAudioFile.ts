'use client';

/**
 * CT Work K-2 — tải TỆP GHI ÂM CÓ SẴN (mp3/m4a/webm/wav): cắt ngay trên trình duyệt thành đoạn 90 s WAV 16 kHz mono
 * (≈ 2,9 MB/đoạn — dưới trần 24 MB của Groq, và đi qua Cloudflare không vướng giới hạn thân yêu cầu). Không cần ffmpeg
 * ở máy chủ, và đi đúng đường tải theo đoạn như ghi trực tiếp ⇒ rớt mạng giữa chừng chỉ phải gửi lại đoạn hỏng.
 *
 * Trình duyệt không giải mã được (codec lạ) ⇒ gửi NGUYÊN tệp làm một đoạn nếu ≤ 24 MB.
 */

export const SPLIT_MS = 90_000;
const RATE = 16_000;
export const MAX_SINGLE_BYTES = 24 * 1024 * 1024;

export interface FilePart { blob: Blob; startMs: number; durationMs: number; fileName: string }

function wav(samples: Float32Array): Blob {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, RATE, true);
  v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, samples.length * 2, true);
  for (let i = 0, o = 44; i < samples.length; i++, o += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buf], { type: 'audio/wav' });
}

async function durationOf(file: File): Promise<number> {
  return new Promise((resolve) => {
    const a = document.createElement('audio');
    const url = URL.createObjectURL(file);
    a.preload = 'metadata';
    a.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(Number.isFinite(a.duration) ? a.duration * 1000 : 0); };
    a.onerror = () => { URL.revokeObjectURL(url); resolve(0); };
    a.src = url;
  });
}

export async function splitAudioFile(file: File, partMs = SPLIT_MS): Promise<FilePart[]> {
  try {
    const bytes = await file.arrayBuffer();
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new Ctx();
    const decoded = await ctx.decodeAudioData(bytes.slice(0));
    void ctx.close();
    // Trộn về mono + đổi tần số mẫu bằng OfflineAudioContext.
    const off = new OfflineAudioContext(1, Math.max(1, Math.ceil(decoded.duration * RATE)), RATE);
    const src = off.createBufferSource();
    src.buffer = decoded;
    src.connect(off.destination);
    src.start();
    const mono = (await off.startRendering()).getChannelData(0);
    const per = Math.round((partMs / 1000) * RATE);
    const parts: FilePart[] = [];
    for (let i = 0, k = 0; i < mono.length; i += per, k++) {
      const slice = mono.subarray(i, Math.min(mono.length, i + per));
      if (slice.length < RATE / 2) break; // đuôi < 0,5 s
      parts.push({ blob: wav(slice), startMs: (i / RATE) * 1000, durationMs: (slice.length / RATE) * 1000, fileName: `upload-${String(k).padStart(4, '0')}.wav` });
    }
    return parts;
  } catch {
    if (file.size > MAX_SINGLE_BYTES) throw new Error('decode');
    const ms = (await durationOf(file)) || 60_000;
    return [{ blob: file, startMs: 0, durationMs: Math.min(ms, 10 * 60_000), fileName: file.name }];
  }
}
