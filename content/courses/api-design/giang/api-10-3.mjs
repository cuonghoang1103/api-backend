/** Giảng theo slide — bài 10.3 "Hợp đồng sự kiện" (deck api-10-3, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-10-3', 'Event contracts', 'Hợp đồng sự kiện', [
  [1, 'Cover', `<p>An event says “this happened”.</p>`, `<p>Sự kiện nói “việc này đã xảy ra”.</p>`],
  [2, 'One event', `<p>CloudEvents envelope; AsyncAPI writes it down.</p>`, `<p>Phong bì CloudEvents; AsyncAPI ghi hợp đồng ra giấy.</p>`],
  [3, 'Thin or fat', `<p>Thin events read stale state; add fields only.</p>`, `<p>Sự kiện mỏng (thin) đọc phải trạng thái cũ; chỉ thêm trường.</p>`],
  [4, 'At least once', `<p>Record the id in the effect’s transaction.</p>`, `<p>Ghi id trong cùng giao dịch với tác dụng.</p>`],
  [5, 'Outbox', `<p>Dual write lost 342; outbox lost none.</p>`, `<p>Ghi kép mất 342; outbox (hộp thư đi) không mất.</p>`],
  [6, 'Summary', `<p>Next: realtime to screens.</p>`, `<p>Tiếp theo: đẩy thời gian thực ra màn hình.</p>`],
]);
