/**
 * Phỏng vấn — DÙNG LẠI nguyên cây `/interview` của web.
 *
 * Đo thật 22/08/2026 trước khi quyết (cùng cách đã đo bốn trang đợt 20/08):
 *
 *   6 tệp · 1.983 dòng · dính Next.js đúng 7 chỗ
 *     4 × `next/link`       — đã có shim
 *     3 × `next/navigation` — `useRouter` 2, `useParams` 2, đã có shim
 *
 * Không chỗ nào cần shim mới. `layout.tsx` chỉ khai `metadata` cho SEO rồi trả
 * thẳng `children` — không có bố cục nào để dựng lại ở đây.
 *
 * ─── Vì sao là `TrangWebTheoTuyen` chứ không phải `TrangWebDon` ───
 * Cây này có năm đường dẫn, hai trong số đó động (`/interview/session/:id`,
 * `/interview/report/:id`). `TrangWebDon` chỉ dựng được MỘT component cố định.
 *
 * ─── `canPhien` mặc định BẬT ở đây, khác Thuật toán ───
 * Không truyền `canPhien` thì `TrangWebTheoTuyen` vẫn chờ cầu nối — đúng, vì
 * mọi màn của cây này gọi `/api/v1/interview/*` ngay ở lượt vẽ đầu (đã kiểm:
 * `/interview/tracks` và `/interview/history` trả 401 trên production, tức là
 * có mount và ĐÒI đăng nhập). Dựng trước khi phiên sẵn sàng là màn đầu tiên
 * nhận 401 rồi hiện danh sách rỗng.
 *
 * ─── Ba chỗ vỏ app chỏi với trang web, đã vá ở nơi khác ───
 *  1. `bg-darkbg` — màu RIÊNG của web, không có trong `theme.extend` của
 *     desktop ⇒ Tailwind không sinh lớp ⇒ trang KHÔNG có nền, mà chữ vẫn
 *     `text-slate-100`. Ở chủ đề sáng là trắng trên trắng. Vá bằng cách cho
 *     `tailwind.config.ts` của desktop kế thừa `presets` từ web.
 *  2. `pt-16` — chừa chỗ cho thanh điều hướng CỐ ĐỊNH của web. App không có
 *     thanh đó, nên nó là 64px trống ở đỉnh.
 *  3. `min-h-screen` — 100vh, trong khi khung ở đây đã trừ thanh tiêu đề và
 *     thanh trạng thái.
 *  Cả (2) và (3) vá bằng CSS phạm vi `.ct-web-host` trong `styles.css`.
 *
 * ─── Giọng nói tự hạ cấp, KHÔNG vỡ ───
 * `useSpeech` có hai đường nhập bằng giọng: `SpeechRecognition` (Chromium của
 * Electron KHÔNG kèm dịch vụ nhận dạng của Google nên thường thiếu) và
 * `MediaRecorder` → `/interview/stt` (chạy được). Trang chỉ vẽ nút mic khi
 * `sttSupported`/`recordSupported` là true, nên thiếu là MẤT NÚT chứ không nổ.
 * Gõ tay luôn dùng được. Đọc câu hỏi (`speechSynthesis`) dùng giọng hệ điều
 * hành, có sẵn trên macOS.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function PhongVanPage() {
  return <TrangWebTheoTuyen ten="Phỏng vấn" />;
}
