/** Giảng theo slide — bài 10.6 "Webhook (2): nhận" (deck api-10-6, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-10-6', 'Webhooks (2): receiving', 'Webhook (2): nhận', [
  [1, 'Cover', `<p>Sooner or later your API is the receiver. The endpoint is public, messages repeat and arrive out of order, and the sender gives up if you are slow.</p>`,
    `<p>Sớm muộn API của bạn sẽ là bên nhận. Endpoint công khai, thông điệp lặp lại và tới sai thứ tự, còn bên gửi bỏ cuộc nếu bạn chậm.</p>`],
  [2, 'The checklist', `<p>Five steps in order: raw body, signature and time, dedupe by webhook-id, answer 2xx at once, apply only if newer. Each step is a switch on the receiver, so we turn one off and measure what it prevents.</p>`,
    `<p>Năm bước theo thứ tự: body thô (raw body — đúng chuỗi byte đã ký), chữ ký và mốc giờ, lọc trùng theo webhook-id, trả 2xx ngay, chỉ áp dụng khi mới hơn. Mỗi bước là một công tắc trên bên nhận, nên ta tắt từng cái để đo xem nó ngăn được gì.</p>`],
  [3, 'Raw bytes and replays', `<p>Parsing then stringifying changes the bytes, so a Python sender’s valid signature fails. A captured request: changed body 401, same id inside the window 200 duplicate, after the window 401.</p>`,
    `<p>Parse rồi stringify lại làm đổi chuỗi byte, nên chữ ký hợp lệ của bên gửi viết bằng Python bị từ chối. Một request bị bắt lại: sửa body thì 401, gửi lại trong cửa sổ thời gian (tolerance window) thì 200 kèm “trùng”, quá cửa sổ thì 401 — đó là chống phát lại (replay).</p>`],
  [4, 'Answer first', `<p>Slow work behind a 2 s timeout gave 5 attempts and 5 emails. Dedupe cut it to one email; answering 202 first made it one attempt in 21 ms.</p>`,
    `<p>Việc chậm đứng sau giới hạn chờ 2 s cho ra 5 lần thử và 5 email. Lọc trùng (dedupe) giảm còn một email; trả 202 trước (acknowledge first — nhận trước, làm sau) còn một lần thử trong 21 ms.</p>`],
  [5, 'Order', `<p>The cancellation arrived before the booking. Last write wins ended PENDING; the version check kept CANCELLED and dropped one stale event.</p>`,
    `<p>Sự kiện huỷ tới trước sự kiện đặt. Ghi sau thắng (last write wins) kết thúc ở PENDING; kiểm phiên bản (version) giữ đúng CANCELLED và bỏ một sự kiện cũ (stale event).</p>`],
  [6, 'Summary', `<p>Keep dedupe ids as long as the sender retries, written with the effect. Next: Lab 10.</p>`,
    `<p>Giữ id đã xử lý lâu bằng thời gian bên gửi còn thử lại, ghi cùng giao dịch với tác dụng. Tiếp theo: Lab 10.</p>`],
]);
