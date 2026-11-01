/** Giảng theo slide — bài 12.1 "Kế hoạch dự án cuối khoá" (deck api-12-1, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-12-1', 'The capstone plan', 'Kế hoạch dự án cuối khoá', [
  [1, 'Cover', `<p>LabFlow leaves RAM: PostgreSQL, Redis and two instances.</p>`, `<p>LabFlow rời RAM: PostgreSQL, Redis và hai instance.</p>`],
  [2, 'After Chapter 12', `<p>Seven skills, each measured: schema, build, share, scale, measure, ship, tell.</p>`, `<p>Bảy kỹ năng, kỹ năng nào cũng có số đo: lược đồ, dựng, dùng chung, chịu tải, đo, triển khai, kể chuyện.</p>`],
  [3, 'Inventory', `<p>List the in-memory state first; the truth goes to PostgreSQL, short-lived shared state to Redis.</p>`, `<p>Liệt kê trạng thái trong bộ nhớ trước; sự thật về PostgreSQL, trạng thái dùng chung ngắn hạn về Redis.</p>`],
  [4, 'Measured', `<p>Two RAM instances: data lost, a double booking, a stale 304, a ticket and a key refused.</p>`, `<p>Hai instance RAM: mất dữ liệu, đặt trùng, 304 sai, vé và khoá bị từ chối.</p>`],
  [5, 'Schema', `<p>One rule, one constraint; keep the public id; index the queries you serve.</p>`, `<p>Một luật, một ràng buộc; giữ id công khai; đánh index theo truy vấn.</p>`],
  [6, 'Precision', `<p>Milliseconds in the cursor need milliseconds in the column: timestamptz(3).</p>`, `<p>Con trỏ giữ mili giây thì cột cũng phải mili giây: timestamptz(3).</p>`],
]);
