/** Giảng theo slide — bài 12.4 "Hai instance, một sự thật" (deck api-12-4, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-12-4', 'Two instances, one truth', 'Hai instance, một sự thật', [
  [1, 'Cover', `<p>The state that was never data, and Redis switched off.</p>`, `<p>Trạng thái chưa bao giờ là dữ liệu, và tắt Redis.</p>`],
  [2, 'Probes', `<p>The six probes of 12.1 now pass on PostgreSQL and Redis.</p>`, `<p>Sáu phép thử của 12.1 giờ đều qua trên PostgreSQL và Redis.</p>`],
  [3, 'Token bucket', `<p>One atomic Lua script with Redis’s clock: five, then 429, across both instances.</p>`, `<p>Một script Lua nguyên tử dùng đồng hồ Redis: năm lượt, rồi 429, qua cả hai instance.</p>`],
  [4, 'Keys and ETags', `<p>Save the idempotency record before replying; read the list version from a sequence.</p>`, `<p>Lưu bản ghi idempotency trước khi trả lời; đọc số phiên bản danh sách từ sequence.</p>`],
  [5, 'Optimistic lock', `<p>Put the version check inside the UPDATE: lost edits 11 of 20, then 0.</p>`, `<p>Đặt phép kiểm version trong câu UPDATE: mất bản sửa 11/20, rồi 0.</p>`],
  [6, 'Redis down', `<p>Decide per feature: limits open, cache bypass, tickets 503, events wait.</p>`, `<p>Quyết định theo tính năng: giới hạn mở cửa, cache bỏ qua, vé 503, sự kiện chờ.</p>`],
]);
