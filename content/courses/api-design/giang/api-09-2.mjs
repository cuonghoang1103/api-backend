/** Giảng theo slide — bài 9.2 "Cache Redis và giẫm đạp" (deck api-09-2, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-09-2', 'Redis cache and stampede', 'Cache Redis và giẫm đạp', [
  [1, 'Cover', `<p>Compute once, serve everyone — until the key expires.</p>`, `<p>Tính một lần, phục vụ mọi người — cho tới khi khoá hết hạn.</p>`],
  [2, 'An expensive question', `<p>Cache-aside in front of a full scan.</p>`, `<p>Cache-aside đứng trước một lần quét toàn bảng.</p>`],
  [3, 'Hit, miss, steady load', `<p>From 43 to 4,150 requests per second.</p>`, `<p>Từ 43 lên 4.150 request mỗi giây.</p>`],
  [4, 'The stampede', `<p>Single-flight turns 32 queries into one.</p>`, `<p>Single-flight biến 32 truy vấn thành một.</p>`],
  [5, 'The contract', `<p>Say how stale; fail open to the database.</p>`, `<p>Nói rõ độ cũ; cache hỏng thì lùi về CSDL.</p>`],
  [6, 'Summary', `<p>Next: read replicas.</p>`, `<p>Tiếp theo: bản sao đọc.</p>`],
]);
