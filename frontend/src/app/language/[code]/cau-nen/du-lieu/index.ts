/**
 * Bộ nạp nội dung từng ngày của "1000 câu nền" — mỗi ngày một tệp `ngayN.ts` export `NGAY_N`.
 * Mỗi `case` một `import()` với chuỗi TĨNH ⇒ mỗi ngày một chunk, tải khi mở.
 * Ngày chưa có `case` ⇒ null ⇒ trang hiện "sắp có".
 */
import type { NgayCauNen } from '../kieu';

export function napNgay(n: number): Promise<NgayCauNen> | null {
  switch (n) {
    case 1: return import('./ngay1').then((m) => m.NGAY_1);
    default: return null;
  }
}

const daNap = new Map<number, Promise<NgayCauNen | null>>();
/** Nạp có đệm (nhiều phần trên trang cùng xin một ngày chỉ tải một lần). Lỗi mạng ⇒ xoá đệm để thử lại. */
export function layNgay(n: number): Promise<NgayCauNen | null> {
  const co = daNap.get(n);
  if (co) return co;
  const p = (napNgay(n) ?? Promise.resolve(null)).catch((e) => { daNap.delete(n); throw e; });
  daNap.set(n, p);
  return p;
}
