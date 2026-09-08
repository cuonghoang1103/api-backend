import { api } from '@/lib/api';

/**
 * Biến URL ảnh TƯƠNG ĐỐI thành tuyệt đối — cần cho app desktop.
 *
 * ─── Vì sao cần ───
 * Bài Tech Trends có hai dạng ảnh bìa (đo trong DB production 07/09/2026):
 *   • tuyệt đối: `https://media.cuongthai.com/images/...` — chạy ở mọi nơi
 *   • TƯƠNG ĐỐI: `/deepdives/vue/reactivity-tracking.svg` — file tĩnh trong
 *     `public/` của web
 *
 * Trên web, dạng thứ hai giải ra `https://cuongthai.com/deepdives/…` nên đúng.
 * Trong app desktop, trang chạy ở origin `app://cuongthai`, nên nó giải vào
 * chính BUNDLE của app ⇒ 404 ⇒ thẻ ảnh vỡ, chỉ còn chữ alt lòi ra. Không có
 * lỗi mạng nào dễ thấy, và trên web thì mọi thứ vẫn bình thường.
 *
 * ─── Vì sao lấy gốc từ `api.defaults.baseURL` ───
 * Đó là chỗ DUY NHẤT đã biết địa chỉ máy chủ ở cả hai nền: web để `/api/v1`
 * (tương đối), desktop được `configureWebApi()` đặt thành
 * `https://cuongthai.com/api/v1`. Bỏ đuôi `/api/v1` là ra gốc site.
 * Trên web, gốc rút ra là chuỗi RỖNG ⇒ hàm trả nguyên URL tương đối, tức
 * KHÔNG đổi hành vi web một chút nào. Cùng mẫu đã dùng ở `CourseTutor.tsx`.
 */
export function anhTuyetDoi(url?: string | null): string {
  const u = (url ?? '').trim();
  if (!u) return '';
  // Đã tuyệt đối, hoặc là ảnh nội tuyến/đối tượng — trả nguyên, đừng đụng vào.
  if (/^(https?:|data:|blob:|\/\/)/i.test(u)) return u;

  /* App desktop đặt biến này lúc khởi động (`shims/web-api-adapter.ts`).
     KHÔNG đọc `api.defaults.baseURL` làm nguồn chính: nó chỉ được đặt trong
     một effect của `TrangWeb`, mà thẻ ảnh dựng TRƯỚC effect đó — đo thật
     07/09/2026, lúc vẽ nó vẫn là `/api/v1` nên ảnh vẫn vỡ. `defaults.baseURL`
     giữ lại làm đường lùi cho những chỗ gọi muộn. */
  const toanCuc = (globalThis as { __CT_GOC_SITE__?: string }).__CT_GOC_SITE__;
  const goc = (toanCuc || '').trim()
    || String(api.defaults.baseURL ?? '').replace(/\/api\/v1\/?$/, '');
  if (!goc) return u; // web: tương đối là đúng rồi
  return `${goc}${u.startsWith('/') ? '' : '/'}${u}`;
}
