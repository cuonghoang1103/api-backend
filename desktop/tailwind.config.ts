/**
 * Tailwind cho app desktop.
 *
 * `content` quét CẢ hai cây: mã của desktop, VÀ mã của web mà desktop dùng lại.
 * Thiếu cây thứ hai thì Tailwind không thấy lớp nào trong đó, không sinh CSS
 * tương ứng, và giao diện hiện ra TRẦN TRỤI — không lỗi, không cảnh báo.
 *
 * ─── Vì sao `theme` lấy TỪ CẤU HÌNH CỦA WEB (22/08/2026) ───
 * Trước đó `theme: { extend: {} }`, tức bảng màu riêng của web KHÔNG tồn tại ở
 * đây. Bốn trang port đợt 20/08 không dính vì chúng hầu như chỉ dùng màu chuẩn
 * của Tailwind. Trang Phỏng vấn thì dính ngay: cả năm màn đều mở bằng
 * `bg-darkbg text-slate-100`, mà `darkbg` (#18191a) là màu RIÊNG của web.
 *
 * Không có nó thì `bg-darkbg` không sinh ra lớp nào, trang KHÔNG có nền, chữ
 * vẫn `text-slate-100` — ở chủ đề sáng là **trắng trên trắng**. Build vẫn xanh,
 * typecheck vẫn xanh; chỉ có người dùng nhìn thấy một trang trống. Đây đúng là
 * cặp song sinh lật ngược của lỗi 02/07/2026 (nền tối cố định + chữ theo
 * theme = đen trên đen).
 *
 * ⚠️ Lấy `theme` chứ KHÔNG dùng `presets: [webConfig]`, có chủ đích:
 *  • `presets` gộp luôn `content` của web. Những glob đó là đường TƯƠNG ĐỐI,
 *    giải theo thư mục chạy lệnh (`desktop/`), nên chúng trỏ vào
 *    `desktop/src/app/**` — không tồn tại. Vô hại nhưng gây hiểu nhầm cho
 *    người đọc sau.
 *  • `presets` cũng gộp `plugins`. Web thêm một plugin là bản dựng desktop gãy
 *    vì thiếu gói, ở một chỗ chẳng liên quan gì tới việc vừa làm.
 * Lấy đúng `theme` là lấy đúng thứ cần chung, và MỘT bảng thì không lệch được
 * — cùng lý do `vite.alias.ts` gộp hai danh sách alias làm một.
 */
import type { Config } from 'tailwindcss';
import webConfig from '../frontend/tailwind.config';

export default {
  darkMode: 'class',
  content: [
    './src/renderer/**/*.{ts,tsx,html}',
    /**
     * ⚠️ Quét CẢ cây nguồn của web, không chỉ `components/notes`.
     *
     * Bản đầu chỉ liệt kê `components/notes` và bỏ sót `app/notes/page.tsx` —
     * chính là nơi giữ bố cục ngoài cùng: `h-[calc(100dvh-…)]` và BA
     * `overflow-y-auto`. Không quét thì Tailwind không sinh những lớp đó, ba
     * vùng cuộn không tồn tại, và cây môn học bị cắt cụt ở đáy — không kéo
     * được, không lỗi, không cảnh báo.
     *
     * Liệt kê từng thư mục là mời gọi bỏ sót lần nữa: cây Notes import chéo
     * sang `components/ui`, `lib`, `store`, `types`, và sẽ còn mở rộng. Quét cả
     * cây tốn thêm chút thời gian dựng, đổi lấy việc không bao giờ phải đoán
     * xem còn thiếu thư mục nào.
     */
    '../frontend/src/**/*.{ts,tsx}',
  ],
  theme: webConfig.theme,
  plugins: [],
} satisfies Config;
