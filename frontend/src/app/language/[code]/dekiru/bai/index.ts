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

/**
 * Nội dung bài n + bài "Chữ Hán của lớp" (hanLop.ts) chèn sau `bN-kanji` —
 * scripts/course-manifest.mts gọi đúng hàm `chenHanLop` này.
 */
export function loadBai(n: number): Promise<Lesson[]> | null {
  const p = loadGoc(n);
  return p && Promise.all([p, import('./hanLop')]).then(([ls, h]) => h.chenHanLop(n, ls));
}

/** Bài "Theo slide lớp" (slideB45/slideB67) chia về đúng bài theo id: Slot 1–4 = Bài 4; Slot 10–14 + tổng hợp B6 = Bài 6. */
const SLOT_B4 = /^slot-0[1-4]-/;
const SLOT_B6 = /^(slot-1[0-4]-|slide-tong-hop-b6$)/;

function loadGoc(n: number): Promise<Lesson[]> | null {
  switch (n) {
    case 0: return import('./bai0').then((m) => m.BAI_0);
    case 1: return Promise.all([import('./bai1'), import('./sach'), import('./jp113B12')]).then(([m, s, j]) => [...m.BAI_1, ...j.JP113_B1, ...j.LT_B1, s.SACH[1]]);
    case 2: return Promise.all([import('./bai2'), import('./sach'), import('./jp113B12')]).then(([m, s, j]) => [...m.BAI_2, ...j.JP113_B2, ...j.LT_B2, s.SACH[2]]);
    case 3: return Promise.all([import('./bai3'), import('./sach'), import('./jp113B3')]).then(([m, s, j]) => [...m.BAI_3, ...j.JP113_B3, ...j.LT_B3, s.SACH[3]]);
    case 4: return Promise.all([import('./bai4'), import('./sach2'), import('./slideB45'), import('./luyenThemB45')]).then(([m, s, c, lt]) => [...m.BAI_4, ...c.SLIDE_B45.filter((l) => SLOT_B4.test(l.id)), ...lt.LUYEN_THEM_B4, s.SACH_2[4]]);
    case 5: return Promise.all([import('./bai5'), import('./sach2'), import('./slideB45'), import('./luyenThemB45')]).then(([m, s, c, lt]) => [...m.BAI_5, ...c.SLIDE_B45.filter((l) => !SLOT_B4.test(l.id)), ...lt.LUYEN_THEM_B5, s.SACH_2[5]]);
    case 6: return Promise.all([import('./bai6'), import('./sach2'), import('./slideB67'), import('./luyenThemB67')]).then(([m, s, c, lt]) => [...m.BAI_6, ...c.SLIDE_B67.filter((l) => SLOT_B6.test(l.id)), ...lt.LUYEN_THEM_B6, s.SACH_2[6]]);
    case 7: return Promise.all([import('./bai7'), import('./slideB67'), import('./luyenThemB67')]).then(([m, c, lt]) => [...m.BAI_7, ...c.SLIDE_B67.filter((l) => !SLOT_B6.test(l.id)), ...lt.LUYEN_THEM_B7, m.SACH_7]);
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
