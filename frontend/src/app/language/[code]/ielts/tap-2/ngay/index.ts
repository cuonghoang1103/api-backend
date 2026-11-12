/**
 * Bộ nạp các ngày ĐÃ SOẠN của IELTS Tập 2 — mỗi ngày một tệp `ngayN.ts` export `NGAY_N: Lesson[]`
 * (id bài / bài tập `t2dN-…`). Cách soạn: `../../SOAN-BAI.md` mục "Soạn Tập 2".
 *
 * Mỗi `case` một `import('./ngayN')` với chuỗi TĨNH → mỗi ngày một chunk, tải khi mở.
 * Thêm ngày: tạo ngayN.ts → thêm dòng `case N: return import('./ngayN').then((m) => m.NGAY_N);`
 * → `npm run course:manifest` (ghi ngay/manifest.ts; thiếu `case` thì `course:manifest:check` báo đỏ).
 * Ngày chưa có `case` ⇒ trả null ⇒ data.ts hiện khung "sắp có" theo mục lục.
 */
import type { Lesson } from '../data';

export function loadNgay(n: number): Promise<Lesson[]> | null {
  switch (n) {
    // Thêm `case` theo thứ tự ngày, ngay trên dòng `default` (đừng ghi mẫu có số thật trong chú thích:
    // bộ kiểm manifest dò chuỗi import của từng ngày trong tệp này — chú thích cũng bị tính).
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
    case 24: return import('./ngay24').then((m) => m.NGAY_24);
    default: return null;
  }
}
