/**
 * Bộ nạp các ngày đã soạn, mỗi ngày một tệp `ngayN.ts` (xem ../SOAN-BAI.md).
 * Ngày 1 nằm thẳng trong data.ts vì nó được soạn trước khi tách tệp.
 * Ngày chưa có ở đây thì data.ts dựng khung "sắp có" theo mục lục sách.
 *
 * Mỗi `case` một `import('./ngayN')` với chuỗi TĨNH → mỗi ngày một chunk,
 * tải khi mở. Thêm ngày mới: tạo ngayN.ts, thêm `case`, rồi `npm run course:manifest`.
 */
import type { Lesson } from '../data';

export function loadNgay(n: number): Promise<Lesson[]> | null {
  switch (n) {
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
    default: return null;
  }
}
