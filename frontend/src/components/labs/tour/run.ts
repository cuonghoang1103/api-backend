/**
 * Phần "không giao diện" của bộ chạy tour: làm một dãy hành động trên LabBus, chờ điều kiện. Dùng chung cho
 * TourLayer (trình duyệt) và bộ kiểm tours.test.ts (jsdom) — nên kịch bản kiểm là ĐÚNG đường mã người học chạy.
 */
import type { LabBus, LabState } from '../bus';
import { ACT_GAP, type TourAct } from './types';

export class Cancelled extends Error { constructor() { super('cancelled'); } }

export interface RunCtx {
  bus: LabBus;
  /** hệ số tốc độ (2 = nhanh gấp đôi) */
  rate: number;
  alive: () => boolean;
  sleep?: (ms: number) => Promise<void>;
}

const realSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function pause(ctx: RunCtx, ms: number) {
  if (!ctx.alive()) throw new Cancelled();
  await (ctx.sleep ?? realSleep)(Math.max(0, ms / ctx.rate));
  if (!ctx.alive()) throw new Cancelled();
}

/** Chờ tới khi `ok()` đúng (kiểm lại mỗi lần bus đổi và mỗi 60 ms). Trả false nếu hết giờ. */
export function waitUntil(ctx: RunCtx, ok: () => boolean, timeoutMs: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (ok()) { resolve(true); return; }
    let done = false;
    const fin = (v: boolean | Error) => {
      if (done) return;
      done = true; un(); clearInterval(iv); clearTimeout(to);
      if (v instanceof Error) reject(v); else resolve(v);
    };
    const check = () => { if (!ctx.alive()) fin(new Cancelled()); else if (ok()) fin(true); };
    const un = ctx.bus.subscribe(check);
    const iv = setInterval(check, 60);
    const to = setTimeout(() => fin(false), timeoutMs);
  });
}

/** Làm từng hành động: chờ `delay`, chờ mô phỏng đăng ký hành động đó (tab vừa đổi cần một nhịp vẽ), rồi bấm. */
export async function runActs(ctx: RunCtx, acts: TourAct[] | undefined, stopWhen?: () => boolean): Promise<string[]> {
  const missing: string[] = [];
  for (const a of acts ?? []) {
    for (let k = 0; k < (a.upTo ?? 1); k++) {
      if (a.upTo && stopWhen?.()) break;
      if (a.delay) await pause(ctx, a.delay);
      const ok = await waitUntil(ctx, () => ctx.bus.has(a.a), 3000);
      if (!ok || !ctx.bus.act(a.a, a.v)) { missing.push(a.a); break; }
      await pause(ctx, ACT_GAP);
    }
  }
  return missing;
}

export const holds = (until: (s: LabState) => boolean, bus: LabBus) => {
  try { return !!until(bus.state); } catch { return false; }
};
