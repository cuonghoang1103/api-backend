/**
 * Báo "người này đang dùng APP" cho máy chủ, để làm mới `users.last_active_at`.
 *
 * ⛔ VÌ SAO APP PHẢI TỰ LÀM: bản web nhịp này nằm ở `<BaoHoatDong/>` trong
 * `frontend/src/app/layout.tsx` — mà app desktop **không dùng layout của web**,
 * nó chỉ mượn từng TRANG (xem `vite.alias.ts`). Nên mọi thứ gắn ở layout đều
 * không chạy trong app, và không có gì báo lỗi cả.
 *
 * Hậu quả nếu thiếu: socket lo được chấm xanh lúc đang nối, nhưng mốc thời
 * gian thì đứng im — người khác thấy "Hoạt động 3 ngày trước" về một người
 * đang ngồi gõ trong app, và ngay khi họ đóng app thì dòng chữ đó sai hẳn.
 * `follow.service.ts` cũng đọc đúng cột này để xếp bạn bè đang online.
 *
 * Nhịp 45 giây là CỐ Ý, phải nhỏ hơn ngưỡng 60s ở `follow.service.ts`. Đặt
 * đúng 60 thì có lúc mốc quá hạn trước nhịp kế, và người khác thấy mình nhấp
 * nháy online/offline.
 */
import type { ApiClient } from '../api/client';

const NHIP_MS = 45_000;

let dong: ReturnType<typeof setInterval> | null = null;
let dangGui = false;
let gheNho: (() => void) | null = null;

/** Bắt đầu nhịp báo. Gọi lại nhiều lần an toàn — nó tự dừng nhịp cũ. */
export function batBaoHoatDong(api: ApiClient): void {
  ngungBaoHoatDong();

  const gui = () => {
    // Cửa sổ bị ẩn/thu nhỏ thì KHÔNG báo — không thì mở app rồi để đó suốt
    // đêm là cả đêm hiện "đang hoạt động".
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
    if (dangGui) return;
    dangGui = true;
    // Hỏng thì im: việc nền, nhịp sau bù. Bày lỗi ra màn hình cho thứ người
    // dùng không yêu cầu là quấy rầy.
    void api
      .request('/api/v1/users/status', { method: 'POST' })
      .catch(() => {})
      .finally(() => { dangGui = false; });
  };

  gui();
  dong = setInterval(gui, NHIP_MS);
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', gui);
  gheNho = gui;
}

/** Dừng nhịp. Gọi khi đăng xuất — không thì app vẫn báo hộ người vừa thoát. */
export function ngungBaoHoatDong(): void {
  if (dong) clearInterval(dong);
  dong = null;
  dangGui = false;
  if (gheNho && typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', gheNho);
  }
  gheNho = null;
}
