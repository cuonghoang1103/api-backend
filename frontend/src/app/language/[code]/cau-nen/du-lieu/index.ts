/**
 * Bộ nạp nội dung từng ngày của "1000 câu nền" — mỗi ngày một tệp `ngayN.ts` export `NGAY_N`.
 * Mỗi `case` một `import()` với chuỗi TĨNH ⇒ mỗi ngày một chunk, tải khi mở.
 * Ngày chưa có `case` ⇒ null ⇒ trang hiện "sắp có".
 */
import type { NgayCauNen } from '../kieu';

export function napNgay(n: number): Promise<NgayCauNen> | null {
  switch (n) {
    case 1: return import('./ngay1').then((m) => m.NGAY_1);
    case 2: return import('./ngay2').then((m) => m.NGAY_2);
    case 3: return import('./ngay3').then((m) => m.NGAY_3);
    case 4: return import('./ngay4').then((m) => m.NGAY_4);
    case 5: return import('./ngay5').then((m) => m.NGAY_5);
    case 6: return import('./ngay6').then((m) => m.NGAY_6);
    case 7: return import('./ngay7').then((m) => m.NGAY_7);
    case 8: return import('./ngay8').then((m) => m.NGAY_8);
    case 9: return import('./ngay9').then((m) => m.NGAY_9);
    case 10: return import('./ngay10').then((m) => m.NGAY_10);
    case 11: return import('./ngay11').then((m) => m.NGAY_11);
    case 12: return import('./ngay12').then((m) => m.NGAY_12);
    case 13: return import('./ngay13').then((m) => m.NGAY_13);
    case 14: return import('./ngay14').then((m) => m.NGAY_14);
    case 15: return import('./ngay15').then((m) => m.NGAY_15);
    case 16: return import('./ngay16').then((m) => m.NGAY_16);
    case 17: return import('./ngay17').then((m) => m.NGAY_17);
    case 18: return import('./ngay18').then((m) => m.NGAY_18);
    case 19: return import('./ngay19').then((m) => m.NGAY_19);
    case 20: return import('./ngay20').then((m) => m.NGAY_20);
    case 21: return import('./ngay21').then((m) => m.NGAY_21);
    case 22: return import('./ngay22').then((m) => m.NGAY_22);
    case 23: return import('./ngay23').then((m) => m.NGAY_23);
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
