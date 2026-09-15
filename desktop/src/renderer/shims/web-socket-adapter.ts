/**
 * Cắm socket CỦA APP DESKTOP vào cây messenger dùng lại từ web.
 *
 * ─── Vì sao cần ───
 * `frontend/src/lib/socket.ts` nối tới `window.location.origin`. Ở app desktop
 * origin là `app://cuongthai` — không phải máy chủ, nên nếu để nguyên thì toàn
 * bộ messenger nối vào hư không: danh sách hội thoại vẫn tải được qua REST,
 * nhưng tin nhắn mới không bao giờ tới, trạng thái hoạt động luôn là ngoại
 * tuyến, và không có lỗi nào trên màn hình.
 *
 * ─── Vì sao DÙNG LẠI socket có sẵn chứ không mở thêm ───
 * App đã có `realtime/socket.ts`, nối ngay khi đăng nhập và phục vụ cuộc gọi.
 * Mở thêm socket thứ hai cho cùng một người thì máy chủ vẫn chịu được — nó đếm
 * hiện diện theo NGƯỜI chứ không theo socket (`messaging.socket.ts`, nhánh
 * "multi-tab") — nhưng mọi sự kiện sẽ tới hai nơi, và app phải tự chống xử lý
 * trùng. Thêm một lớp có thể sai mà không đổi lấy gì.
 *
 * Đây là bộ nối 20 dòng, cùng lối với `web-api-adapter.ts`.
 */
import { datNguonSocket } from '@/lib/socket';
import { laySocket } from '../realtime/socket';

let daCam = false;

/**
 * Trỏ `lib/socket.ts` của web vào socket của app.
 *
 * Gọi được nhiều lần; chỉ cắm một lần. Không nhận tham số vì `laySocket()`
 * luôn trả về socket HIỆN HÀNH — kể cả sau khi app nối lại bằng token mới,
 * lúc mà một tham chiếu chộp sẵn sẽ trỏ vào socket đã chết.
 */
export function camSocketDesktop(): void {
  if (daCam) return;
  daCam = true;
  datNguonSocket(() => laySocket());
}

/** Gỡ ra, trả web về hành vi mặc định. Chỉ dùng trong phép kiểm. */
export function thaSocketDesktop(): void {
  daCam = false;
  datNguonSocket(null);
}
