/**
 * Mô phỏng — DÙNG LẠI nguyên `SimulationStudio` của web.
 *
 * Đo thật 20/08/2026: 84 tệp, **34.940 dòng** — cây lớn nhất trong bốn trang
 * đợt này, và dính Next.js đúng MỘT chỗ (`next/dynamic`, vốn đã có shim từ
 * hồi Notes). Viết lại từng ấy kịch bản hoạt hình ở đây là làm lại nhiều
 * tháng công việc rồi phải nuôi hai bản song song mãi mãi.
 *
 * ⚠️ Trang này cần canvas, Web Audio và MediaRecorder. Cả ba đều có trong
 * Chromium của Electron, nên không phải bỏ tính năng nào — kể cả quay video
 * bài giảng ngay trong app.
 *
 * ⚠️ Nó KHÔNG hoàn toàn ngoại tuyến như Thuật toán. `RecorderStudio` gọi
 * `fetch('/api/v1/simulation/convert-mp4')` để xuất MP4 — endpoint có thật
 * (thử: 401, tức đã mount), nhưng đường dẫn TƯƠNG ĐỐI ở origin `app://cuongthai`
 * trỏ vào bundle chứ không ra máy chủ. Vì thế `configureWebApi` nay bọc luôn
 * `fetch` toàn cục cho các đường `/api/` — xem `shims/web-api-adapter.ts`.
 * Phần còn lại của trang (mọi kịch bản hoạt hình) chạy hoàn toàn trong máy.
 *
 * ⚠️ `TrangWebDon` giữ `lazy()` trong `useMemo`. Bỏ ra là mỗi lần vẽ lại dựng
 * mới cả canvas lẫn ngữ cảnh âm thanh — với cây này thì thấy rõ ngay.
 */
import { TrangWebDon } from '../web/TrangWeb';

const nap = () => import('@/components/simulation/SimulationStudio');

export function MoPhongPage() {
  return <TrangWebDon nap={nap} ten="Xưởng mô phỏng" />;
}
