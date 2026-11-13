/**
 * ============================================================
 * BIẾT KHI NÀO NGƯỜI DÙNG ĐÓNG KẾT NỐI SSE (13/11/2026)
 * ============================================================
 *
 * ⚠️ `req.on('close', …)` KHÔNG làm được việc này. Từ Node 16, `IncomingMessage` tự huỷ (autoDestroy) ngay khi thân yêu
 * cầu đọc xong — mà `express.json()` đọc xong thân TRƯỚC khi tới handler, và các middleware `await` CSDL (xác thực, kiểm
 * Pro…) ⇒ sự kiện `close` của `req` đã bắn XONG trước khi handler kịp gắn listener. Listener đó không bao giờ chạy.
 * Đo thật (Node 22/26 + Express): handler gắn sau một `await` thấy `req.destroyed === true`; người dùng huỷ giữa luồng
 * chỉ làm bắn `close` của `res`.
 *
 * Hậu quả ở AI Code (`/agent/turn`): bấm Dừng / đóng app KHÔNG huỷ lời gọi cổng — lượt chạy tới cùng, vẫn tính tiền và
 * ăn hạn mức, chỉ là không ai đọc kết quả.
 *
 * Đúng là nghe `close` của `res`: bắn khi socket đóng; `writableFinished === false` ⇒ ta CHƯA `end()` xong ⇒ khách bỏ đi
 * giữa chừng (khác lúc chính ta `res.end()` — khi đó cũng bắn `close`, nhưng `writableFinished === true`).
 */
import type { Response } from 'express';

/** Gọi `onDong` ĐÚNG MỘT LẦN khi khách đóng kết nối trước khi phản hồi ghi xong. Không bắn khi ta tự `res.end()`. */
export function khiKhachDong(res: Pick<Response, 'on' | 'writableFinished'>, onDong: () => void): void {
  let daGoi = false;
  res.on('close', () => {
    if (daGoi || res.writableFinished) return;
    daGoi = true;
    onDong();
  });
}
