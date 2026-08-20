/**
 * Lộ trình — DÙNG LẠI cây `roadmap` của web, CÓ trang con.
 *
 * Đo thật 20/08/2026: 5 tệp, 632 dòng, 2 chỗ dùng `next/link` (đã có shim).
 * Dữ liệu thật từ `GET /api/v1/roadmaps`: **14 lộ trình theo vai trò + 19 theo
 * kỹ năng**, endpoint công khai (không cần đăng nhập để xem danh sách).
 *
 * Có trang con `/roadmap/<slug>` nên dùng `TrangWebTheoTuyen`: bấm một lộ
 * trình là app đổi `route`, bảng tra khớp `/roadmap/:slug` và bơm `slug` xuống
 * qua context — cây web đọc bằng `useParams()` y như trên Next.
 *
 * ⚠️ Trang danh sách của web nằm ở `components/roadmap/RoadmapLanding`, KHÔNG
 * phải `app/roadmap/page` — tệp `page.tsx` chỉ là vỏ khai báo metadata cho SEO
 * và `export const metadata` sẽ kéo theo kiểu của Next. Bảng tra trỏ thẳng vào
 * component thật.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function LoTrinhPage() {
  return <TrangWebTheoTuyen ten="Lộ trình" />;
}
