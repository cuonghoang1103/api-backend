/** Giảng theo slide — bài 8.6 "Suy giảm có chủ đích" (deck api-08-6, 10 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-08-6', 'Degrading on purpose', 'Suy giảm có chủ đích', [
  [1, 'Cover', `<p>Old data with a label, or a clear refusal.</p>`, `<p>Dữ liệu cũ có nhãn, hoặc lời từ chối rõ ràng.</p>`],
  [2, 'What you will get', `<p>Per-endpoint decisions, probes, contract, client.</p>`, `<p>Quyết định theo endpoint, probe, hợp đồng, client.</p>`],
  [3, 'Decide per endpoint', `<p>Reads may be stale; writes must not pretend.</p>`, `<p>Đọc có thể cũ; ghi không được giả vờ.</p>`],
  [4, 'A simulated outage', `<p>Lab list 200 with Age; booking 503; /ready 503.</p>`, `<p>Danh sách phòng 200 kèm Age; đặt phòng 503; /ready 503.</p>`],
  [5, 'Liveness vs readiness', `<p>Never put the database in liveness.</p>`, `<p>Đừng bao giờ đưa CSDL vào liveness.</p>`],
  [6, 'Into the contract', `<p>OpenAPI 2.2.0 documents 503 and both headers.</p>`, `<p>OpenAPI 2.2.0 ghi rõ 503 và hai header.</p>`],
  [7, 'An app that reads it', `<p>Same key, Retry-After, and a time budget.</p>`, `<p>Cùng khoá, theo Retry-After, và một ngân sách thời gian.</p>`],
  [8, 'Two scenarios', `<p>The app never hangs; add jitter for fairness.</p>`, `<p>App không bao giờ treo; thêm jitter cho công bằng.</p>`],
  [9, 'Interview answers', `<p>The answer depends on the endpoint, and it is written down.</p>`, `<p>Câu trả lời tuỳ endpoint, và đã được viết ra.</p>`],
  [10, 'Summary', `<p>Next: Lab 8.</p>`, `<p>Tiếp theo: Lab 8.</p>`],
]);
