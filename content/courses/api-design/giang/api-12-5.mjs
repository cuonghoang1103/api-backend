/** Giảng theo slide — bài 12.5 "Làm nó chịu tải" (deck api-12-5, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-12-5', 'Making it scale', 'Làm nó chịu tải', [
  [1, 'Cover', `<p>Read less from the database; never make a student wait for an email.</p>`, `<p>Đọc CSDL ít hơn; không bao giờ bắt sinh viên chờ email.</p>`],
  [2, 'Cache', `<p>A hit is not faster on one laptop; the win is load kept off the database.</p>`, `<p>Trên một máy trúng cache không nhanh hơn; cái lợi là bớt tải cho CSDL.</p>`],
  [3, 'Outbox', `<p>The event row commits with the booking; a relay publishes it.</p>`, `<p>Dòng sự kiện commit cùng lượt đặt; relay phát nó đi.</p>`],
  [4, 'Wake the relay', `<p>NOTIFY at commit: event lag about one millisecond instead of one second.</p>`, `<p>NOTIFY lúc commit: độ trễ sự kiện chừng một mili giây thay vì một giây.</p>`],
  [5, 'Email', `<p>Inside the request: slow, and 500s; in a queue: fast, retried to delivery.</p>`, `<p>Trong request: chậm và lỗi 500; qua hàng đợi: nhanh, thử lại tới khi giao.</p>`],
  [6, 'Exactly one email', `<p>At-least-once events, deduplicated by job id: 21 events, 20 emails.</p>`, `<p>Sự kiện ít nhất một lần, khử trùng theo id job: 21 sự kiện, 20 email.</p>`],
]);
