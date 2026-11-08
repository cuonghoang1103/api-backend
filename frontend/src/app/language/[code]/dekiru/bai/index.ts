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
import { chenLuyenNho, chenHinh } from './luyenNho';

/**
 * Nội dung bài n + bài "Chữ Hán của lớp" (hanLop.ts) chèn sau `bN-kanji` —
 * scripts/course-manifest.mts gọi đúng hàm `chenHanLop` này.
 */
export function loadBai(n: number): Promise<Lesson[]> | null {
  const p = loadGoc(n);
  // + mục 🃏 Luyện nhớ / 🎌 Luyện bảng chữ của bài (luyenNho.ts) — manifest gọi cùng hàm.
  // + 🖼️ thẻ hình & 📽️ slide (hinhB14.ts — Bài 1–4, hinhB57.ts — Bài 5–7, hinhB810.ts — Bài 8–10, hinhB1113.ts — Bài 11–13, hinhB1415.ts — Bài 14–15) — manifest gọi cùng các hàm.
  const hinh = n >= 1 && n <= 4 ? import('./hinhB14').then((m) => ({ 1: m.HINH_B1, 2: m.HINH_B2, 3: m.HINH_B3, 4: m.HINH_B4 })[n])
    : n >= 5 && n <= 7 ? import('./hinhB57').then((m) => ({ 5: m.HINH_B5, 6: m.HINH_B6, 7: m.HINH_B7 })[n])
    : n >= 8 && n <= 10 ? import('./hinhB810').then((m) => ({ 8: m.HINH_B8, 9: m.HINH_B9, 10: m.HINH_B10 })[n])
    : n >= 11 && n <= 13 ? import('./hinhB1113').then((m) => ({ 11: m.HINH_B11, 12: m.HINH_B12, 13: m.HINH_B13 })[n])
    : n >= 14 && n <= 15 ? import('./hinhB1415').then((m) => ({ 14: m.HINH_B14, 15: m.HINH_B15 })[n])
    : Promise.resolve(undefined);
  // + 🎙️ đọc to kiểu đề (docTo14 — Bài 1–4) và đề thi thử JPD113 (thiThu113 — cuối Bài 3).
  const them = Promise.all([
    n >= 1 && n <= 4 ? import('./docTo14').then((m) => [({ 1: m.DOC_TO_B1, 2: m.DOC_TO_B2, 3: m.DOC_TO_B3, 4: m.DOC_TO_B4 })[n]!]) : [],
    n === 3 ? import('./thiThu113').then((m) => m.THI_THU_113) : [],
    // Kiểm tra từng bài đúng form thi (Bài 4–9) + thi cuối kỳ JPD123 đúng form "Speaking Demo" (cuối Bài 7).
    n >= 4 && n <= 9 ? import('./kiemTraBai49').then((m) => (m as unknown as Record<string, Lesson[]>)[`KIEM_TRA_B${n}`]) : [],
    n === 7 ? import('./thiCuoiKy123').then((m) => m.THI_CUOI_KY_123) : [],
  ]).then((x) => x.flat());
  return p && Promise.all([p, import('./hanLop'), hinh, them]).then(([ls, h, hi, th]) => chenLuyenNho(n, chenHinh(n, [...h.chenHanLop(n, ls), ...th], hi)));
}

/** Bài "Theo slide lớp" (slideB45/slideB67) chia về đúng bài theo id: Slot 1–4 = Bài 4; Slot 10–14 + tổng hợp B6 = Bài 6. */
const SLOT_B4 = /^slot-0[1-4]-/;
const SLOT_B6 = /^(slot-1[0-4]-|slide-tong-hop-b6$)/;

function loadGoc(n: number): Promise<Lesson[]> | null {
  switch (n) {
    // Bài 0 + bộ luyện thêm bảng chữ 672 câu (09/11/2026, luyenThemB0.ts).
    case 0: return Promise.all([import('./bai0'), import('./luyenThemB0')]).then(([m, lt]) => [...m.BAI_0, ...lt.LUYEN_THEM_B0]);
    case 1: return Promise.all([import('./bai1'), import('./sach'), import('./jp113B12')]).then(([m, s, j]) => [...m.BAI_1, ...j.JP113_B1, ...j.LT_B1, s.SACH[1]]);
    case 2: return Promise.all([import('./bai2'), import('./sach'), import('./jp113B12')]).then(([m, s, j]) => [...m.BAI_2, ...j.JP113_B2, ...j.LT_B2, s.SACH[2]]);
    case 3: return Promise.all([import('./bai3'), import('./sach'), import('./jp113B3')]).then(([m, s, j]) => [...m.BAI_3, ...j.JP113_B3, ...j.LT_B3, s.SACH[3]]);
    case 4: return Promise.all([import('./bai4'), import('./sach2'), import('./slideB45'), import('./luyenThemB45')]).then(([m, s, c, lt]) => [...m.BAI_4, ...c.SLIDE_B45.filter((l) => SLOT_B4.test(l.id)), ...lt.LUYEN_THEM_B4, s.SACH_2[4]]);
    case 5: return Promise.all([import('./bai5'), import('./sach2'), import('./slideB45'), import('./luyenThemB45')]).then(([m, s, c, lt]) => [...m.BAI_5, ...c.SLIDE_B45.filter((l) => !SLOT_B4.test(l.id)), ...lt.LUYEN_THEM_B5, s.SACH_2[5]]);
    case 6: return Promise.all([import('./bai6'), import('./sach2'), import('./slideB67'), import('./luyenThemB67')]).then(([m, s, c, lt]) => [...m.BAI_6, ...c.SLIDE_B67.filter((l) => SLOT_B6.test(l.id)), ...lt.LUYEN_THEM_B6, s.SACH_2[6]]);
    case 7: return Promise.all([import('./bai7'), import('./slideB67'), import('./luyenThemB67')]).then(([m, c, lt]) => [...m.BAI_7, ...c.SLIDE_B67.filter((l) => !SLOT_B6.test(l.id)), ...lt.LUYEN_THEM_B7, m.SACH_7]);
    case 8: return Promise.all([import('./bai8'), import('./luyenThemB89')]).then(([m, lt]) => [...m.BAI_8, ...lt.LUYEN_THEM_B8, m.SACH_8]);
    case 9: return Promise.all([import('./bai9'), import('./luyenThemB89')]).then(([m, lt]) => [...m.BAI_9, ...lt.LUYEN_THEM_B9, m.SACH_9]);
    case 10: return Promise.all([import('./bai10'), import('./luyenThemB10')]).then(([m, lt]) => [...m.BAI_10, ...lt.LUYEN_THEM_B10, m.SACH_10]);
    case 11: return Promise.all([import('./bai11'), import('./luyenThemB1112')]).then(([m, lt]) => [...m.BAI_11, ...lt.LUYEN_THEM_B11, m.SACH_11]);
    case 12: return Promise.all([import('./bai12'), import('./luyenThemB1112')]).then(([m, lt]) => [...m.BAI_12, ...lt.LUYEN_THEM_B12, m.SACH_12]);
    case 13: return Promise.all([import('./bai13'), import('./luyenThemB1314')]).then(([m, lt]) => [...m.BAI_13, ...lt.LUYEN_THEM_B13, m.SACH_13]);
    case 14: return Promise.all([import('./bai14'), import('./luyenThemB1314')]).then(([m, lt]) => [...m.BAI_14, ...lt.LUYEN_THEM_B14, m.SACH_14]);
    case 15: return import('./bai15').then((m) => [...m.BAI_15, m.SACH_15]);
    // Bài 16+ (tiếp sau sách → N2, 09/11/2026): một tệp gồm cốt lõi + buổi trên lớp + luyện thêm.
    case 16: return import('./bai16').then((m) => m.BAI_16);
    case 17: return import('./bai17').then((m) => m.BAI_17);
    case 18: return import('./bai18').then((m) => m.BAI_18);
    case 19: return import('./bai19').then((m) => m.BAI_19);
    case 20: return import('./bai20').then((m) => m.BAI_20);
    case 21: return import('./bai21').then((m) => m.BAI_21);
    default: return null;
  }
}
