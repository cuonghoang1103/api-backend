'use client';

/**
 * useBot — hỏi bot một nước, chạy trong Web Worker (`lib/doiKhang/bot.worker.ts`).
 *
 * - Bot "nghĩ" tối thiểu 400–900 ms cho tự nhiên (nước dễ cũng không bật ra tức thì).
 * - `huyHet()` bỏ mọi câu trả lời đang chờ (tái đấu, rời bàn) — kết quả muộn bị lờ đi.
 * - Trình duyệt không tạo được Worker ⇒ lùi về chạy ở luồng chính (sau một nhịp setTimeout).
 * - Worker bị huỷ khi component unmount.
 */
import { useCallback, useEffect, useRef } from 'react';
import { LUAT, taoNgauNhien, type CapDoBot, type MaTro } from '@/lib/doiKhang/luat';

type Cho = { resolve: (m: unknown) => void; reject: (e: Error) => void };

export function useBot() {
  const workerRef = useRef<Worker | null>(null);
  const choRef = useRef(new Map<number, Cho>());
  const idRef = useRef(0);
  const theHeRef = useRef(0);

  useEffect(() => {
    const cho = choRef.current;
    let w: Worker | null = null;
    try {
      w = new Worker(new URL('../../lib/doiKhang/bot.worker.ts', import.meta.url));
      w.onmessage = (e: MessageEvent<{ id: number; nuoc?: unknown; loi?: string }>) => {
        const c = cho.get(e.data.id);
        if (!c) return;
        cho.delete(e.data.id);
        if (e.data.loi) c.reject(new Error(e.data.loi));
        else c.resolve(e.data.nuoc);
      };
      w.onerror = () => {
        // Worker hỏng giữa chừng ⇒ trả lỗi cho mọi câu đang chờ, lần sau chạy luồng chính.
        cho.forEach((c) => c.reject(new Error('Bot gặp lỗi')));
        cho.clear();
        w?.terminate();
        workerRef.current = null;
      };
      workerRef.current = w;
    } catch {
      workerRef.current = null;
    }
    return () => {
      w?.terminate();
      workerRef.current = null;
      cho.clear();
    };
  }, []);

  const huyHet = useCallback(() => {
    theHeRef.current++;
    choRef.current.clear();
  }, []);

  /** Trả nước bot chọn, hoặc `null` nếu đã bị huỷ (tái đấu / rời bàn) trong lúc nghĩ. */
  const hoi = useCallback(async <M,>(tro: MaTro, s: unknown, capDo: CapDoBot): Promise<M | null> => {
    const theHe = theHeRef.current;
    const batDau = Date.now();
    const toiThieu = 400 + Math.random() * 500;
    const seed = (Math.random() * 2 ** 31) | 0;
    let nuoc: unknown;
    const w = workerRef.current;
    if (w) {
      const id = ++idRef.current;
      nuoc = await new Promise<unknown>((resolve, reject) => {
        choRef.current.set(id, { resolve, reject });
        w.postMessage({ id, tro, s, capDo, seed });
      }).catch(() => LUAT[tro].nuocBot(s, capDo, taoNgauNhien(seed)));
    } else {
      await new Promise((r) => setTimeout(r, 30));
      nuoc = LUAT[tro].nuocBot(s, capDo, taoNgauNhien(seed));
    }
    const conLai = toiThieu - (Date.now() - batDau);
    if (conLai > 0) await new Promise((r) => setTimeout(r, conLai));
    if (theHe !== theHeRef.current) return null;
    return nuoc as M;
  }, []);

  return { hoi, huyHet };
}
