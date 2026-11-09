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
});

export function khoaDu100(slug: string | null | undefined): KhoaDu100 | null {
  if (!slug) return null;
  return KHOA_DU_100[slug] ?? null;
}
