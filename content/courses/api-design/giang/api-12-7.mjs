/** Giảng theo slide — bài 12.7 "Checklist triển khai" (deck api-12-7, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-12-7', 'The deployment checklist', 'Checklist triển khai', [
  [1, 'Cover', `<p>Seven items between “tests pass” and a calm deploy day.</p>`, `<p>Bảy mục giữa “test qua” và một ngày triển khai yên ổn.</p>`],
  [2, 'Config', `<p>Refuse to start with bad config, and list every problem at once.</p>`, `<p>Từ chối khởi động khi cấu hình sai, và liệt kê mọi lỗi một lần.</p>`],
  [3, 'Readiness', `<p>Database down: alive but not ready; writes 503, cached reads 200.</p>`, `<p>CSDL sập: còn sống nhưng chưa sẵn sàng; ghi 503, đọc có cache 200.</p>`],
  [4, 'Shutdown', `<p>Say not ready, drain, finish in-flight work: 622 errors became zero.</p>`, `<p>Báo chưa sẵn sàng, xả, làm nốt việc dở: 622 lỗi thành không.</p>`],
  [5, 'Logs and metrics', `<p>One JSON line per request with its id; metrics on a private port.</p>`, `<p>Mỗi request một dòng JSON kèm mã; metrics ở cổng riêng.</p>`],
  [6, 'Backup and smoke', `<p>A backup counts only after a restore; a smoke test decides each deploy.</p>`, `<p>Sao lưu chỉ tính khi đã khôi phục; smoke test quyết định mỗi lần triển khai.</p>`],
]);
