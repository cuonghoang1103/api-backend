/**
 * Công thức hiệu ứng âm thanh — tách khỏi `useSoundEngine` để dùng được ở
 * HAI nơi với cùng một bộ công thức:
 *
 *   1. Thời gian thực, trong trang: `AudioContext` → loa + nhánh ghi của
 *      MediaRecorder (người dạy bấm nút Quay).
 *   2. NGOẠI TUYẾN, khi dựng video hàng loạt: `OfflineAudioContext` render
 *      cả đường tiếng của một kịch bản thành WAV nhanh hơn thời gian thực
 *      nhiều lần, rồi ffmpeg ghép vào video.
 *
 * Nếu để công thức nằm trong hook, bản dựng ngoại tuyến buộc phải chép lại
 * chúng — và hai bản sẽ trôi dạt khỏi nhau ngay lần chỉnh âm sắc đầu tiên.
 * `BaseAudioContext` là kiểu cha của cả hai loại context, nên cùng một hàm
 * chạy được ở cả hai đường.
 *
 * TẤT ĐỊNH: nhiễu trắng sinh bằng LCG có hạt giống cố định, không
 * `Math.random()` — hai lần dựng cùng một kịch bản cho ra file giống hệt.
 */

import type { SfxName } from './types';

export interface SfxTarget {
  ctx: BaseAudioContext;
  /** Điểm gom mọi hiệu ứng (GainNode hoặc thẳng destination). */
  master: AudioNode;
  noise: AudioBuffer;
}

/** Đệm nhiễu trắng 1 giây, dùng lại cho mọi hiệu ứng swoosh/buzz. */
export function makeNoiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  let seed = 0x2f6e2b1;
  for (let i = 0; i < data.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    data[i] = seed / 2147483648 - 1;
  }
  return noise;
}

/** Một nốt: dao động ký + envelope ADSR rút gọn (attack → decay mũ). */
function tone(
  g: SfxTarget,
  at: number,
  freq: number,
  opts: { type?: OscillatorType; dur?: number; gain?: number; delay?: number; sweepTo?: number }
) {
  const t0 = at + (opts.delay ?? 0);
  const dur = opts.dur ?? 0.18;
  const osc = g.ctx.createOscillator();
  osc.type = opts.type ?? 'sine';
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.sweepTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.sweepTo), t0 + dur);

  const env = g.ctx.createGain();
  // Attack 6ms để tránh tiếng "cạch" do nhảy biên độ đột ngột.
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(opts.gain ?? 0.22, t0 + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(env).connect(g.master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Một mảng nhiễu đi qua bộ lọc dải quét tần số — nền của mọi "swoosh". */
function swoosh(
  g: SfxTarget,
  at: number,
  opts: { from: number; to: number; dur: number; gain: number; q?: number; type?: BiquadFilterType }
) {
  const src = g.ctx.createBufferSource();
  src.buffer = g.noise;
  src.loop = true;

  const filter = g.ctx.createBiquadFilter();
  filter.type = opts.type ?? 'bandpass';
  filter.Q.value = opts.q ?? 1.4;
  filter.frequency.setValueAtTime(opts.from, at);
  filter.frequency.exponentialRampToValueAtTime(opts.to, at + opts.dur);

  const env = g.ctx.createGain();
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(opts.gain, at + opts.dur * 0.25);
  env.gain.exponentialRampToValueAtTime(0.0001, at + opts.dur);

  src.connect(filter).connect(env).connect(g.master);
  src.start(at);
  src.stop(at + opts.dur + 0.05);
}

/**
 * Xếp lịch một hiệu ứng vào thời điểm tuyệt đối `at` của context.
 *
 * Thời gian thực thì `at = ctx.currentTime`; dựng ngoại tuyến thì `at` là
 * mốc bắt đầu của bước trong kịch bản, tính từ 0.
 */
export function scheduleSfx(g: SfxTarget, name: SfxName, at: number) {
  switch (name) {
    case 'click':
      // Nhấp giao diện: xung vuông rất ngắn, hơi cao.
      tone(g, at, 1400, { type: 'square', dur: 0.045, gain: 0.06 });
      break;
    case 'blip':
      tone(g, at, 660, { type: 'triangle', dur: 0.09, gain: 0.1 });
      break;
    case 'swoosh':
      // Gói tin bay: nhiễu quét từ trầm lên cao.
      swoosh(g, at, { from: 380, to: 2600, dur: 0.3, gain: 0.13, q: 1.1 });
      break;
    case 'stream':
      swoosh(g, at, { from: 900, to: 900, dur: 0.5, gain: 0.05, q: 6 });
      break;
    case 'ping':
      // Chuông nhỏ: quãng năm hoàn hảo, nghe "sạch".
      tone(g, at, 988, { type: 'sine', dur: 0.34, gain: 0.16 });
      tone(g, at, 1480, { type: 'sine', dur: 0.26, gain: 0.08, delay: 0.012 });
      break;
    case 'success':
      // Hợp âm rải trưởng — tín hiệu "xong việc" quen thuộc.
      tone(g, at, 523.25, { type: 'triangle', dur: 0.24, gain: 0.16 });
      tone(g, at, 659.25, { type: 'triangle', dur: 0.24, gain: 0.15, delay: 0.075 });
      tone(g, at, 783.99, { type: 'triangle', dur: 0.36, gain: 0.17, delay: 0.15 });
      break;
    case 'lock':
      // Chốt khoá: hai nốt đi lên, kết bằng tiếng "cạch".
      tone(g, at, 440, { type: 'square', dur: 0.07, gain: 0.08 });
      tone(g, at, 880, { type: 'square', dur: 0.12, gain: 0.09, delay: 0.07 });
      swoosh(g, at, { from: 3000, to: 900, dur: 0.1, gain: 0.05, q: 3, type: 'highpass' });
      break;
    case 'buzz':
      // Cảnh báo nhẹ: răng cưa trầm, ngắt quãng.
      tone(g, at, 190, { type: 'sawtooth', dur: 0.1, gain: 0.1 });
      tone(g, at, 150, { type: 'sawtooth', dur: 0.13, gain: 0.1, delay: 0.13 });
      break;
    case 'error':
      // Lỗi: răng cưa trượt xuống + nhiễu trầm. Cố tình khó chịu.
      tone(g, at, 220, { type: 'sawtooth', dur: 0.42, gain: 0.17, sweepTo: 70 });
      tone(g, at, 110, { type: 'square', dur: 0.38, gain: 0.1, sweepTo: 55 });
      swoosh(g, at, { from: 700, to: 120, dur: 0.34, gain: 0.09, q: 0.8 });
      break;
  }
}

/* ────────────────────────────────────────────────────────────
   DỰNG ĐƯỜNG TIẾNG NGOẠI TUYẾN
   ──────────────────────────────────────────────────────────── */

/** Một hiệu ứng và thời điểm nó nổ, tính bằng giây từ đầu video. */
export interface SfxCue {
  name: SfxName;
  at: number;
}

/**
 * Render toàn bộ đường tiếng của một kịch bản thành WAV 16-bit.
 *
 * Chạy trong `OfflineAudioContext` nên nhanh hơn thời gian thực rất nhiều —
 * một video 30 giây render tiếng trong khoảng một giây — và cho ra đúng cùng
 * một file ở mọi lần chạy, khác hẳn việc thu bằng MediaRecorder theo thời
 * gian thực (phụ thuộc tải máy).
 *
 * Cộng thêm `tail` giây ở cuối để tiếng cuối cùng kịp tắt hẳn thay vì bị cắt cụt.
 */
export async function renderSfxTrackToWav(cues: SfxCue[], durationSec: number, tail = 1.2): Promise<Blob> {
  const sampleRate = 48000;
  const total = Math.max(0.5, durationSec + tail);
  const OfflineCtor: typeof OfflineAudioContext =
    window.OfflineAudioContext ??
    (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;

  const ctx = new OfflineCtor(2, Math.ceil(total * sampleRate), sampleRate);
  const master = ctx.createGain();
  master.gain.value = 1;
  master.connect(ctx.destination);

  const target: SfxTarget = { ctx, master, noise: makeNoiseBuffer(ctx) };
  for (const cue of cues) scheduleSfx(target, cue.name, Math.max(0, cue.at));

  const buffer = await ctx.startRendering();
  return encodeWav(buffer);
}

/** AudioBuffer → WAV PCM 16-bit (ffmpeg đọc thẳng, không cần thư viện). */
function encodeWav(buffer: AudioBuffer): Blob {
  const channels = buffer.numberOfChannels;
  const frames = buffer.length;
  const bytes = frames * channels * 2;
  const out = new DataView(new ArrayBuffer(44 + bytes));

  const str = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) out.setUint8(offset + i, s.charCodeAt(i));
  };

  str(0, 'RIFF');
  out.setUint32(4, 36 + bytes, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  out.setUint32(16, 16, true); // cỡ khối fmt
  out.setUint16(20, 1, true); // PCM không nén
  out.setUint16(22, channels, true);
  out.setUint32(24, buffer.sampleRate, true);
  out.setUint32(28, buffer.sampleRate * channels * 2, true); // byte mỗi giây
  out.setUint16(32, channels * 2, true); // khối căn chỉnh
  out.setUint16(34, 16, true); // bit mỗi mẫu
  str(36, 'data');
  out.setUint32(40, bytes, true);

  const data = Array.from({ length: channels }, (_, c) => buffer.getChannelData(c));
  let p = 44;
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) {
      // Kẹp trước khi lượng tử hoá: mẫu vượt ±1 mà cứ nhân 32767 thì tràn số
      // và biến thành tiếng rè chói tai.
      const v = Math.max(-1, Math.min(1, data[c][i]));
      out.setInt16(p, v < 0 ? v * 0x8000 : v * 0x7fff, true);
      p += 2;
    }
  }
  return new Blob([out.buffer], { type: 'audio/wav' });
}
