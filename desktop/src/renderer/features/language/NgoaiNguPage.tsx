/**
 * Ngoại ngữ — DÙNG LẠI cây `language` của web, 17 trang con.
 *
 * Đo thật 20/08/2026: 45 tệp, **12.616 dòng**, và là cây dính Next.js nặng
 * nhất trong bốn trang đợt này — 19 tệp dùng `next/navigation` (34 chỗ
 * `useParams`, 19 `useRouter`, 8 `useSearchParams`), 10 dùng `next/link`, 2
 * dùng `next/image`. Ba shim trong `src/renderer/shims/` sinh ra vì trang này.
 *
 * ⚠️ ĐƯỜNG API THẬT LÀ `/api/v1/my-language`, KHÔNG phải `/api/v1/languages`.
 * Tên hàm trong `lib/language-api.ts` gợi ý sai (`list`, `/languages/${id}`) vì
 * những chuỗi đó thuộc nhóm ADMIN. Gọi `/api/v1/languages` trên production trả
 * **404**; `/api/v1/my-language` trả 6 ngôn ngữ. Đo bằng curl, không đọc mã mà
 * đoán.
 *
 * 17 trang con: bảng chữ (+ luyện), hội thoại, ngữ pháp, soát ngữ pháp, chữ
 * Hán, nghe, luyện, hỏi đáp, đọc, lộ trình, nhập vai, thống kê, dịch, từ vựng,
 * viết, sổ tay. Tất cả nằm trong bảng tra `dinhTuyenWeb.ts`.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function NgoaiNguPage() {
  return <TrangWebTheoTuyen ten="Ngoại ngữ" />;
}
