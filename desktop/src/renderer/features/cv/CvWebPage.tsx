/**
 * CV Builder — DÙNG LẠI nguyên cây `/cv` của web (9 màn).
 *
 * Đo thật 22/08/2026: 12 tệp · 3.048 dòng · dính Next.js 16 chỗ
 * (9 `next/link`, 14 `useRouter`, 2 `useParams`) — cả ba shim đã có sẵn.
 *
 * ─── Vì sao thay màn native cũ ───
 * `CvPage.tsx` (345 dòng, ngay cạnh tệp này) sửa được ĐÚNG khối liên hệ: họ
 * tên · chức danh · email · điện thoại · nơi ở · liên kết · tóm tắt. Riêng
 * `/cv/profile` của web đã 760 dòng và phủ thêm kinh nghiệm · dự án · học vấn
 * · giải thưởng · kỹ năng · chứng chỉ · ngoại ngữ, cộng tám màn nữa: nhập từ
 * file, phỏng vấn lấy nội dung (intake), soát bằng AI, chọn mục tiêu, xem như
 * nhà tuyển dụng, xuất bản, và trình dựng theo từng bản CV.
 *
 * ⚠️ CÁI MẤT: `CvPage` đọc bằng cache và ghi vào hàng đợi đồng bộ, nên nó sửa
 * được KHI MẤT MẠNG. Cây web thì không — nó gọi API thẳng. Đổi lại là toàn bộ
 * tính năng. Xem chú thích đầu `CvPage.tsx` để biết cách lấy lại nếu cần.
 *
 * ⚠️ Hàng đợi đồng bộ KHÔNG bị ảnh hưởng: handler `cv-profile` sống ở
 * `offline/transport.ts` (có phép kiểm riêng) chứ không ở trong `CvPage`. Nên
 * bản cũ còn sửa đổi kẹt trong hàng đợi vẫn được đẩy lên bình thường sau khi
 * người dùng cập nhật app.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function CvWebPage() {
  return <TrangWebTheoTuyen ten="CV Builder" />;
}
