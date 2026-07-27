'use client';

/**
 * Bộ tổng hợp âm thanh bằng Web Audio API.
 *
 * VÌ SAO TỔNG HỢP CHỨ KHÔNG DÙNG FILE MP3
 * ---------------------------------------
 * CSP của site là `default-src 'self'` — không nạp được asset từ CDN, và
 * thêm chục file .mp3 vào repo chỉ để kêu "tinh" thì vừa nặng vừa phải quản
 * lý. Mọi hiệu ứng ở đây được SINH RA bằng dao động ký và bộ lọc: không byte
 * nào phải tải về, âm sắc chỉnh được bằng tham số, và quan trọng nhất — âm
 * thanh đi thẳng vào graph Web Audio nên trộn được vào bản ghi video mà
 * không cần bắt "âm thanh hệ thống".
 *
 * KIẾN TRÚC ĐƯỜNG TIẾNG
 * ---------------------
 *   dao động ký / nhiễu → envelope → master ─┬→ speakerGain → ctx.destination
 *                                             └────────────→ recordDest ──┐
 *   micro ────────────────────────────────────────────────→ recordDest ──┴→ video
 *
 * Hai chi tiết PHẢI đúng, sai là hỏng bản ghi mà chỉ phát hiện ra sau khi đã
 * quay xong cả bài giảng:
 *
 * 1. Nút chỉnh âm lượng loa (`speakerGain`) nằm SAU nhánh rẽ sang recordDest,
 *    không phải trước. Nếu hạ thẳng `master` thì tắt loa cũng tắt luôn tiếng
 *    trong video. Người dạy thường tắt loa để khỏi vọng vào micro — mà đó lại
 *    đúng lúc cần SFX trong bản ghi nhất.
 * 2. Micro CHỈ nối vào recordDest. Nối thêm ra loa là hú phản hồi tức thì.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SfxName } from './types';

interface AudioGraph {
  ctx: AudioContext;
  /** Điểm gom mọi hiệu ứng. Luôn để nguyên 1.0 — đừng chỉnh để tắt tiếng. */
  master: GainNode;
  /** Chỉ điều khiển LOA. Hạ nút này không ảnh hưởng tiếng đi vào video. */
  speakerGain: GainNode;
  recordDest: MediaStreamAudioDestinationNode;
  /** Bộ đệm nhiễu trắng dùng lại cho mọi hiệu ứng "swoosh". */
  noise: AudioBuffer;
}

export interface SoundEngine {
  play: (name: SfxName) => void;
  muted: boolean;
  toggleMuted: () => void;
  /** Đảm bảo AudioContext đã mở — phải gọi từ trong một cử chỉ người dùng. */
  ensure: () => Promise<AudioGraph | null>;
  /** Nhánh audio để MediaRecorder trộn vào video. */
  getRecordStream: () => MediaStream | null;
  /** Nối luồng micro vào bản ghi (không phát ra loa). */
  connectMic: (stream: MediaStream) => void;
  disconnectMic: () => void;
}

export function useSoundEngine(): SoundEngine {
  const graphRef = useRef<AudioGraph | null>(null);
  const micRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    mutedRef.current = muted;
    const g = graphRef.current;
    // Chỉ hạ nhánh LOA. Nhánh ghi nằm trước nút này nên video vẫn có đủ SFX
    // kể cả khi người dạy tắt loa để tránh vọng vào micro.
    if (g) g.speakerGain.gain.value = muted ? 0.0001 : 1;
  }, [muted]);

  const ensure = useCallback(async (): Promise<AudioGraph | null> => {
    if (graphRef.current) {
      if (graphRef.current.ctx.state === 'suspended') await graphRef.current.ctx.resume();
      return graphRef.current;
    }
    if (typeof window === 'undefined') return null;
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;

    const ctx = new Ctor({ sampleRate: 48000 });
    const master = ctx.createGain();
    master.gain.value = 1;

    const speakerGain = ctx.createGain();
    speakerGain.gain.value = mutedRef.current ? 0.0001 : 1;

    const recordDest = ctx.createMediaStreamDestination();
    // Rẽ nhánh TRƯỚC nút âm lượng loa: bản ghi lấy tín hiệu đầy đủ, còn loa
    // đi qua speakerGain nên tắt được độc lập.
    master.connect(recordDest);
    master.connect(speakerGain).connect(ctx.destination);

    // Nhiễu trắng dựng sẵn 1 giây, tái sử dụng cho swoosh/buzz.
    const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    // Sinh bằng LCG có hạt giống cố định thay cho Math.random(): cùng một
    // tiếng động ở mọi lần chạy, đúng tinh thần tất định của cả trang.
    let seed = 0x2f6e2b1;
    for (let i = 0; i < data.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      data[i] = (seed / 2147483648) - 1;
    }

    graphRef.current = { ctx, master, speakerGain, recordDest, noise };
    if (ctx.state === 'suspended') await ctx.resume();
    return graphRef.current;
  }, []);

  /* ── Các khối tổng hợp cơ bản ────────────────────────────── */

  /** Một nốt: dao động ký + envelope ADSR rút gọn (attack → decay mũ). */
  const tone = useCallback(
    (g: AudioGraph, freq: number, opts: { type?: OscillatorType; dur?: number; gain?: number; at?: number; sweepTo?: number }) => {
      const { ctx, master } = g;
      const t0 = ctx.currentTime + (opts.at ?? 0);
      const dur = opts.dur ?? 0.18;
      const osc = ctx.createOscillator();
      osc.type = opts.type ?? 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      if (opts.sweepTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.sweepTo), t0 + dur);

      const env = ctx.createGain();
      // Attack 6ms để tránh tiếng "cạch" do nhảy biên độ đột ngột.
      env.gain.setValueAtTime(0.0001, t0);
      env.gain.exponentialRampToValueAtTime(opts.gain ?? 0.22, t0 + 0.006);
      env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      osc.connect(env).connect(master);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    },
    []
  );

  /** Một mảng nhiễu đi qua bộ lọc dải quét tần số — nền của mọi "swoosh". */
  const swoosh = useCallback(
    (g: AudioGraph, opts: { from: number; to: number; dur: number; gain: number; q?: number; type?: BiquadFilterType }) => {
      const { ctx, master, noise } = g;
      const t0 = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = noise;
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = opts.type ?? 'bandpass';
      filter.Q.value = opts.q ?? 1.4;
      filter.frequency.setValueAtTime(opts.from, t0);
      filter.frequency.exponentialRampToValueAtTime(opts.to, t0 + opts.dur);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t0);
      env.gain.exponentialRampToValueAtTime(opts.gain, t0 + opts.dur * 0.25);
      env.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);

      src.connect(filter).connect(env).connect(master);
      src.start(t0);
      src.stop(t0 + opts.dur + 0.05);
    },
    []
  );

  const play = useCallback(
    (name: SfxName) => {
      const g = graphRef.current;
      if (!g) return;
      // Không chặn theo `muted` ở đây: master gain đã lo phần loa, còn nhánh
      // ghi vẫn cần âm thanh.
      switch (name) {
        case 'click':
          // Nhấp giao diện: xung vuông rất ngắn, hơi cao.
          tone(g, 1400, { type: 'square', dur: 0.045, gain: 0.06 });
          break;
        case 'blip':
          tone(g, 660, { type: 'triangle', dur: 0.09, gain: 0.1 });
          break;
        case 'swoosh':
          // Gói tin bay: nhiễu quét từ trầm lên cao.
          swoosh(g, { from: 380, to: 2600, dur: 0.3, gain: 0.13, q: 1.1 });
          break;
        case 'stream':
          swoosh(g, { from: 900, to: 900, dur: 0.5, gain: 0.05, q: 6 });
          break;
        case 'ping':
          // Chuông nhỏ: quãng năm hoàn hảo, nghe "sạch".
          tone(g, 988, { type: 'sine', dur: 0.34, gain: 0.16 });
          tone(g, 1480, { type: 'sine', dur: 0.26, gain: 0.08, at: 0.012 });
          break;
        case 'success':
          // Hợp âm rải trưởng — tín hiệu "xong việc" quen thuộc.
          tone(g, 523.25, { type: 'triangle', dur: 0.24, gain: 0.16 });
          tone(g, 659.25, { type: 'triangle', dur: 0.24, gain: 0.15, at: 0.075 });
          tone(g, 783.99, { type: 'triangle', dur: 0.36, gain: 0.17, at: 0.15 });
          break;
        case 'lock':
          // Chốt khoá: hai nốt đi lên, kết bằng tiếng "cạch".
          tone(g, 440, { type: 'square', dur: 0.07, gain: 0.08 });
          tone(g, 880, { type: 'square', dur: 0.12, gain: 0.09, at: 0.07 });
          swoosh(g, { from: 3000, to: 900, dur: 0.1, gain: 0.05, q: 3, type: 'highpass' });
          break;
        case 'buzz':
          // Cảnh báo nhẹ: răng cưa trầm, ngắt quãng.
          tone(g, 190, { type: 'sawtooth', dur: 0.1, gain: 0.1 });
          tone(g, 150, { type: 'sawtooth', dur: 0.13, gain: 0.1, at: 0.13 });
          break;
        case 'error':
          // Lỗi: răng cưa trượt xuống + nhiễu trầm. Cố tình khó chịu.
          tone(g, 220, { type: 'sawtooth', dur: 0.42, gain: 0.17, sweepTo: 70 });
          tone(g, 110, { type: 'square', dur: 0.38, gain: 0.1, sweepTo: 55 });
          swoosh(g, { from: 700, to: 120, dur: 0.34, gain: 0.09, q: 0.8 });
          break;
      }
    },
    [swoosh, tone]
  );

  const getRecordStream = useCallback(() => graphRef.current?.recordDest.stream ?? null, []);

  const connectMic = useCallback((stream: MediaStream) => {
    const g = graphRef.current;
    if (!g) return;
    micRef.current?.disconnect();
    const src = g.ctx.createMediaStreamSource(stream);
    // CHỈ nối vào nhánh ghi. Nối thêm vào ctx.destination sẽ tạo vòng phản
    // hồi micro → loa → micro và hú ngay lập tức.
    src.connect(g.recordDest);
    micRef.current = src;
  }, []);

  const disconnectMic = useCallback(() => {
    micRef.current?.disconnect();
    micRef.current = null;
  }, []);

  // Dọn dẹp: đóng AudioContext khi rời trang, nếu không Chrome giữ lại và
  // cảnh báo "AudioContext was not allowed to start" ở lần vào sau.
  useEffect(() => {
    return () => {
      micRef.current?.disconnect();
      const g = graphRef.current;
      graphRef.current = null;
      if (g && g.ctx.state !== 'closed') void g.ctx.close();
    };
  }, []);

  const toggleMuted = useCallback(() => setMuted((m) => !m), []);

  return { play, muted, toggleMuted, ensure, getRecordStream, connectMic, disconnectMic };
}
