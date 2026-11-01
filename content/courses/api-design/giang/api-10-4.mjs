/** Giảng theo slide — bài 10.4 "API thời gian thực" (deck api-10-4, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-10-4', 'Realtime APIs', 'API thời gian thực', [
  [1, 'Cover', `<p>Four ways to put an event on a screen.</p>`, `<p>Bốn cách đưa một sự kiện lên màn hình.</p>`],
  [2, 'Four clients', `<p>Polling every 2 s: 1.1 s late, 1,500 idle requests. SSE and WebSocket: about 1 ms.</p>`, `<p>Hỏi lại (polling) mỗi 2 s: trễ 1,1 s, 1.500 request khi rảnh. SSE (luồng sự kiện từ server) và WebSocket: khoảng 1 ms.</p>`],
  [3, 'SSE and resume', `<p>Last-Event-ID replays what was missed; too old means a reset event.</p>`, `<p>Last-Event-ID (id sự kiện cuối) phát bù phần bị lỡ; quá cũ thì nhận sự kiện reset (tải lại).</p>`],
  [4, 'The flush trap', `<p>Gzip without flush: browsers see nothing, curl works. Test with gzip.</p>`, `<p>Nén gzip mà không flush (đẩy ra): trình duyệt không thấy gì, curl vẫn chạy. Hãy thử với gzip.</p>`],
  [5, 'Tickets, servers', `<p>One-time tickets instead of tokens in URLs; fan-out through Redis.</p>`, `<p>Vé (ticket) dùng một lần thay token trên URL; phát tán (fan-out) qua Redis.</p>`],
  [6, 'Choosing', `<p>SSE for feeds; next: webhooks.</p>`, `<p>SSE cho luồng tin; tiếp theo: webhook.</p>`],
]);
