// ⛔ BẢN CHÉP — sửa ở src/services/doiKhang/luat/ rồi chạy scripts/dong-bo-luat-doi-khang.mjs
/**
 * Tiện ích dùng chung cho luật đối kháng — thuần TS, không phụ thuộc môi trường.
 */

/** PRNG mulberry32 — cùng seed ⇒ cùng dãy (chia bài tái lập được). Trả số trong [0, 1). */
export function taoNgauNhien(seed: number): () => number {
  let a = (seed >>> 0) || 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function laDoiTuong(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

export function laSoNguyen(x: unknown, min: number, max: number): x is number {
  return typeof x === 'number' && Number.isInteger(x) && x >= min && x <= max;
}

/** Đồng hồ ms — Date.now có ở cả trình duyệt lẫn Node. */
export function bayGio(): number {
  return Date.now();
}
