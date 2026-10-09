import { siteImage } from '@/lib/og/siteCards';

// UX-D: ảnh xem trước riêng (Hồ sơ) — tiêu đề thật của trang thay vì ảnh chung của cả site.
export const runtime = 'nodejs';
export const alt = 'Hồ sơ · CuongThai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Hồ sơ người dùng cần đăng nhập (GET /users/:id/profile có authenticate) ⇒ KHÔNG lộ tên/ảnh, chỉ thẻ chung.
export default async function Image() {
  return siteImage({ kind: 'Hồ sơ', title: 'Hồ sơ thành viên CuongThai', subtitle: 'Đăng nhập để xem hồ sơ, bài viết và hoạt động của thành viên.', meta: ['Sign in to view'] });
}
