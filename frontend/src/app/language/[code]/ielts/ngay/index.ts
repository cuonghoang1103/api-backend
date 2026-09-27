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
    default: return null;
  }
}
