/**
 * Khoá "SẮP RA MẮT" (`courses.status = 'COMING_SOON'`, 22/10/2026) — KHUNG khoá học: ảnh bìa, tên, mô tả, mục lục
 * chương/bài, CHƯA có nội dung bài. "Làm khung trước, học đến đâu làm đến đó."
 *
 * Quy ước lưu (fail-closed):
 *   - `isPublished = false` — đúng như form admin vẫn suy ra (`isPublished = status === 'PUBLISHED'`). Nhờ vậy MỌI
 *     đường đang lọc `isPublished: true` (danh sách /courses, tìm kiếm, nổi bật, sitemap, mua, mã kích hoạt) tự loại
 *     nó ra mà không phải sửa từng chỗ.
 *   - các bài lưu `isPublished = false` ⇒ `serializeCourse` không bao giờ trả nội dung bài cho người thường.
 * Chỉ hai chỗ CỐ Ý cho thấy nó: `GET /courses/chuong-trinh` (nhóm `sapRaMat`) và `GET /courses/:slug` (bản giới thiệu
 * chỉ có mục lục). Còn lại (ghi danh, tích tiến độ, đọc bài, mua, mã kích hoạt) gọi `chanSapRaMat` — kể cả khi ai đó
 * lỡ bật `isPublished` thì cửa vẫn đóng theo `status`.
 * Đổi sang PUBLISHED ở admin ⇒ mọi thứ chạy như khoá thường (bài nào xuất bản thì hiện bài đó).
 */
import { AppError } from '../middleware/errorHandler.js';

export const SAP_RA_MAT = 'COMING_SOON';

export function laSapRaMat(c: { status?: string | null } | null | undefined): boolean {
  return String(c?.status ?? '').toUpperCase() === SAP_RA_MAT;
}

/** Ném 409 `COURSE_COMING_SOON` nếu khoá đang "Sắp ra mắt" (người gọi tự miễn cho admin nếu cần). */
export function chanSapRaMat(c: { status?: string | null } | null | undefined): void {
  if (laSapRaMat(c)) {
    throw new AppError('Khoá học sắp ra mắt — chưa mở đăng ký và chưa có bài để học.', 409, 'COURSE_COMING_SOON');
  }
}
