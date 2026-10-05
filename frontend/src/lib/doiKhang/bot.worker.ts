/**
 * Web Worker chạy bot đối kháng (05/10/2026) — tìm nước (alpha-beta cờ vua/cờ tướng, dò caro…) có
 * thể mất tới ~1,5 giây; chạy ở luồng chính thì bàn khựng, đồng hồ đứng, quân không trượt được.
 *
 * Vào: { id, tro, s, capDo, seed } · Ra: { id, nuoc } hoặc { id, loi }.
 */
import { LUAT, taoNgauNhien, type CapDoBot, type MaTro } from './luat';

interface YeuCau {
  id: number;
  tro: MaTro;
  s: unknown;
  capDo: CapDoBot;
  seed: number;
}

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent<YeuCau>) => void) | null;
  postMessage: (d: unknown) => void;
};

ctx.onmessage = (e) => {
  const { id, tro, s, capDo, seed } = e.data;
  try {
    const nuoc = LUAT[tro].nuocBot(s, capDo, taoNgauNhien(seed));
    ctx.postMessage({ id, nuoc });
  } catch (err) {
    ctx.postMessage({ id, loi: err instanceof Error ? err.message : String(err) });
  }
};

export {};
