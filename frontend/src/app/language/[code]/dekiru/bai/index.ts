/**
 * Bộ nạp nội dung các bài đã soạn — mỗi bài một tệp `baiN.ts` (xem ../SOAN-BAI.md).
 *
 * Mỗi `case` một `import('./baiN')` với chuỗi TĨNH để webpack tách mỗi bài
 * thành một chunk riêng: trang chỉ mang mục lục (manifest.ts, sinh tự động),
 * mở bài nào thì tải chunk của bài đó. Mỗi bài = các bài soạn + mục
 * 📖 Theo sách (đi theo từng trang sách) ở cuối.
 *
 * Thêm bài mới: tạo baiN.ts, thêm một `case` ở đây, rồi `npm run course:manifest`
 * (script kiểm cả việc thiếu `case` — và cùng luật ghép Theo sách như ở đây).
 * Bài chưa có ở đây thì data.ts dựng khung "sắp có" theo mục lục sách.
 */
import type { Lesson } from '@/components/sach-hoc/types';

export function loadBai(n: number): Promise<Lesson[]> | null {
  switch (n) {
    case 0: return import('./bai0').then((m) => m.BAI_0);
    case 1: return Promise.all([import('./bai1'), import('./sach')]).then(([m, s]) => [...m.BAI_1, s.SACH[1]]);
    case 2: return Promise.all([import('./bai2'), import('./sach')]).then(([m, s]) => [...m.BAI_2, s.SACH[2]]);
    case 3: return Promise.all([import('./bai3'), import('./sach')]).then(([m, s]) => [...m.BAI_3, s.SACH[3]]);
    case 4: return Promise.all([import('./bai4'), import('./sach2')]).then(([m, s]) => [...m.BAI_4, s.SACH_2[4]]);
    case 5: return Promise.all([import('./bai5'), import('./sach2')]).then(([m, s]) => [...m.BAI_5, s.SACH_2[5]]);
    case 6: return Promise.all([import('./bai6'), import('./sach2')]).then(([m, s]) => [...m.BAI_6, s.SACH_2[6]]);
    case 7: return import('./bai7').then((m) => [...m.BAI_7, m.SACH_7]);
    case 8: return import('./bai8').then((m) => [...m.BAI_8, m.SACH_8]);
    case 9: return import('./bai9').then((m) => [...m.BAI_9, m.SACH_9]);
    case 10: return import('./bai10').then((m) => [...m.BAI_10, m.SACH_10]);
    case 11: return import('./bai11').then((m) => [...m.BAI_11, m.SACH_11]);
    case 12: return import('./bai12').then((m) => [...m.BAI_12, m.SACH_12]);
    case 13: return import('./bai13').then((m) => [...m.BAI_13, m.SACH_13]);
    case 14: return import('./bai14').then((m) => [...m.BAI_14, m.SACH_14]);
    case 15: return import('./bai15').then((m) => [...m.BAI_15, m.SACH_15]);
    default: return null;
  }
}
