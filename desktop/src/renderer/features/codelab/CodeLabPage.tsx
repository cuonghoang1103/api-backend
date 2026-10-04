/**
 * Code Lab — DÙNG LẠI nguyên cây `/code-lab` của web (04/10/2026).
 *
 * ─── Vì sao bỏ màn native cũ ───
 * Màn native trước đây (630 dòng) chỉ ĐỌC được: danh sách track, đề bài, gợi ý,
 * lời giải. Cây web thì có cả phần làm bài thật, đo 04/10/2026:
 *   6 trang · 14 thành phần `components/code-lab` (~3.000 dòng)
 *   - Sổ bài NHIỀU TỆP (Workspace) có tô màu cú pháp, lưu tiến độ lên máy chủ,
 *     tải/xuất .zip kiểu dự án NetBeans cho LAB211;
 *   - AI giảng bài + hỏi tiếp; Huấn luyện viên (vấn đáp, soát yêu cầu, chấm zip);
 *   - Phòng Lab (gom bài, trợ giảng, nộp zip, hướng dẫn review), độ phủ kỹ năng,
 *     tiến độ từng module, bài giảng của module + hỏi AI theo bài.
 * Viết lại tất cả ở đây là chép một khối mã sẽ trôi lệch với web từng tuần.
 * Dính Next.js: chỉ `next/link`, `next/navigation`, `next/dynamic` — đều có shim.
 *
 * ─── Chạy mã ───
 * Chấm và giải thích đi máy chủ. Riêng nút "Run (JS)" chạy mã ngay trên máy —
 * qua worker hộp cát (xem khối `__CT_HOP_CAT_WORKER__` bên dưới).
 *
 * ─── Khung ───
 * Giống IELTS: khung KHÔNG cuộn mang `container` để lớp phủ `fixed` bên trong
 * (thanh Phòng Lab, ngăn huấn luyện viên) neo vào VÙNG NỘI DUNG thay vì cả cửa
 * sổ — không thì chúng đè lên thanh bên của app. Phần cuộn là `.ct-web-host`.
 *
 * `code-lab.css` của web chỉ được `app/code-lab/layout.tsx` nạp (layout đó là
 * server component chỉ khai metadata, app không dựng) ⇒ phải nạp ở đây.
 * Phần chỉnh riêng cho desktop nằm ở `codelab-desk.css`, phạm vi `.ct-cl-khung`.
 */
import '@/app/code-lab/code-lab.css';
import './codelab-desk.css';
import { TrangWebTheoTuyen } from '../web/TrangWeb';

/* Nút "Run (JS)" của bài tập chạy mã người học trong worker
   (`components/code-lab/chayJs.ts`). CSP của app cấm eval trên trang và worker
   `blob:` thừa kế CSP đó ⇒ trỏ sang worker HỘP CÁT có CSP riêng (được eval,
   không được ra mạng — public/hop-cat-worker.js, src/main/security.ts), y như
   Thuật toán. Đặt ở tầm mô-đun: nạp trang là có, trước khi ai bấm Run. */
if (typeof window !== 'undefined') {
  (globalThis as { __CT_HOP_CAT_WORKER__?: string }).__CT_HOP_CAT_WORKER__ =
    new URL('hop-cat-worker.js', window.location.href).href;
}

export function CodeLabPage() {
  return (
    <div className="ct-cl-khung">
      <TrangWebTheoTuyen ten="Code Lab" />
    </div>
  );
}
