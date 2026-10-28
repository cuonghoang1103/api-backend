'use client';
/**
 * Bộ phát cho mô phỏng "sống" (không biết trước số bước): giữ LỊCH SỬ các trạng thái, tới cuối thì tính bước kế bằng
 * hàm thuần `tick`. Người học can thiệp (kill, truncate…) ⇒ cắt phần tương lai và ghi trạng thái mới — nên tua lùi rồi
 * làm khác đi vẫn đúng. Trả về đối tượng khớp interface Player của ui.tsx để dùng chung <Controls>.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Player } from './ui';

export function useLivePlayer<S>(init: () => S, tick: (s: S) => S, baseMs = 700, max = 900) {
  const [hist, setHist] = useState<S[]>(() => [init()]);
  const [i, setIRaw] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const ref = useRef({ hist, i });
  ref.current = { hist, i };
  const tickRef = useRef(tick);
  tickRef.current = tick;

  const advance = useCallback(() => {
    const { hist: h, i: k } = ref.current;
    if (k < h.length - 1) { setIRaw(k + 1); return; }
    const nxt = tickRef.current(h[k]);
    const nh = h.length >= max ? [...h.slice(h.length - max + 1), nxt] : [...h, nxt];
    setHist(nh); setIRaw(nh.length - 1);
  }, [max]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(advance, baseMs / speed);
    return () => window.clearTimeout(id);
  }, [playing, i, hist, speed, baseMs, advance]);

  /** can thiệp: áp `fn` lên trạng thái đang xem, bỏ phần tương lai */
  const apply = useCallback((fn: (s: S) => S) => {
    const { hist: h, i: k } = ref.current;
    const nh = [...h.slice(0, k + 1), fn(h[k])];
    setHist(nh); setIRaw(nh.length - 1);
  }, []);
  const restart = useCallback((s0: S) => { setPlaying(false); setHist([s0]); setIRaw(0); }, []);

  const p: Player = {
    i, total: hist.length, playing, speed, setSpeed, setPlaying,
    setI: (v: number) => setIRaw(Math.max(0, Math.min(ref.current.hist.length - 1, v))),
    atEnd: false,
    next: () => { setPlaying(false); advance(); },
    prev: () => { setPlaying(false); setIRaw((x) => Math.max(0, x - 1)); },
    reset: () => { setPlaying(false); setIRaw(0); },
    toggle: () => setPlaying((v) => !v),
  };
  return { p, S: hist[Math.min(i, hist.length - 1)], hist: hist.slice(0, i + 1), apply, restart };
}
