/**
 * Sổ "KHOÁ ĐÃ XONG 100%" (hiện dấu DONE) (09/11/2026, theo yêu cầu chủ trang).
 *
 * Một khoá chỉ được ghi vào đây khi ĐỦ cả bộ: slide (gốc của trường với môn Academy) · bài giảng · video bài giảng
 * cho mọi bài · Code Lab · quiz từng chương · đề PE / FE / PT (nếu môn có thi) — ngoại lệ duy nhất là video CHỮA ĐỀ,
 * đang tạm dừng theo luật 31/10 nên không tính. Thẻ khoá ở /academy và /courses hiện dấu "✓ DONE" (kiểu Verified by CuongThai) theo sổ này.
 *
 * Thêm/bớt một khoá = sửa đúng một dòng ở đây (kèm ngày kiểm và ghi chú cái gì đã kiểm). Danh sách kiểm chi tiết
 * nằm ở ~/Documents/video-bai-giang/KHOA-DU-100.md.
 */
export interface KhoaDu100 {
  /** Ngày kiểm đủ (dd/mm/yyyy). */
  ngay: string;
  /** Ghi chú ngắn: cái gì đã kiểm (hiện trong tooltip). */
  ghiChu?: string;
}

export const KHOA_DU_100: Readonly<Record<string, KhoaDu100>> = Object.freeze({
  // slug khoá ⇒ thông tin kiểm. Chỉ thêm khoá đã kiểm ĐỦ cả bộ (xem đầu tệp).
  'postgresql': { ngay: '09/11/2026', ghiChu: '86/86 bài có video · Code Lab 80 module · quiz 17 chương · PE/FE/PT' },
  'introduction-to-databases': { ngay: '09/11/2026', ghiChu: 'DBI202 · slide trường · 102/102 bài có video · Code Lab 102 module · quiz mọi chương · đề PE/FE' },
  'web-foundations': { ngay: '09/11/2026', ghiChu: '87/87 bài có video · Code Lab 67 module · quiz 14 chương · PE/FE/PT' },
  'git': { ngay: '09/11/2026', ghiChu: '102/102 bài có video · track Git trên Code Lab · quiz 18 chương · PE/FE/PT' },
  'data-structures-and-algorithms': { ngay: '09/11/2026', ghiChu: 'CSD201 · slide trường · 114 bài có video · Code Lab 66 module · quiz mọi chương · đề PE/FE' },
  'object-oriented-programming': { ngay: '09/11/2026', ghiChu: 'PRO192 · slide trường · 98 bài có video · Code Lab 49 module · quiz mọi chương (thêm N1, N2) · đề PE/FE' },
  'front-end-web-development-with-react': { ngay: '10/11/2026', ghiChu: 'FER202 · slide trường · 105/105 bài có video · Code Lab 128 module · quiz mọi chương · đề FE/PE' },
  'software-testing': { ngay: '10/11/2026', ghiChu: 'SWT301 · slide trường · 111/111 bài có video · Code Lab 77 module · quiz mọi chương · đề FE/PE' },
  'software-requirements': { ngay: '10/11/2026', ghiChu: 'SWR302 · slide trường · 139/139 bài có video · Code Lab 131 module · quiz chương bài giảng · đề FE/PE' },
  'authentication': { ngay: '12/11/2026', ghiChu: '77/77 bài có video · Code Lab 77 module (đủ Ch0–12) · quiz 13 chương · đề FE/PE/PT×3' },
  'server-side-development-nodejs-express-mongodb': { ngay: '12/11/2026', ghiChu: 'SDN302 · slide trường · 40/42 bài có video (2 bài đề thi) · Code Lab 35 module · quiz 8 chương · 25 đề PE/FE' },
});

export function khoaDu100(slug: string | null | undefined): KhoaDu100 | null {
  if (!slug) return null;
  return KHOA_DU_100[slug] ?? null;
}
