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
import { makeNoiseBuffer, scheduleSfx } from './sfx';
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

    // Nhiễu trắng dựng sẵn 1 giây, tái sử dụng cho swoosh/buzz. Sinh bằng
    // LCG có hạt giống cố định thay cho Math.random(): cùng một tiếng động ở
    // mọi lần chạy, đúng tinh thần tất định của cả trang.
    const noise = makeNoiseBuffer(ctx);

    graphRef.current = { ctx, master, speakerGain, recordDest, noise };
    if (ctx.state === 'suspended') await ctx.resume();
    return graphRef.current;
  }, []);

  /**
   * Phát một hiệu ứng NGAY. Công thức nằm ở `sfx.ts` để bản dựng video ngoại
   * tuyến dùng đúng cùng bộ công thức — xem ghi chú đầu file đó.
   */
  const play = useCallback((name: SfxName) => {
    const g = graphRef.current;
    if (!g) return;
    // Không chặn theo `muted` ở đây: speakerGain đã lo phần loa, còn nhánh
    // ghi vẫn cần âm thanh.
    scheduleSfx({ ctx: g.ctx, master: g.master, noise: g.noise }, name, g.ctx.currentTime);
  }, []);

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
