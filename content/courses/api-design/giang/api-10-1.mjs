/** Giảng theo slide — bài 10.1 "API bất đồng bộ: 202, việc nền, hỏi lại" (deck api-10-1, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-10-1', 'Asynchronous APIs', 'API bất đồng bộ', [
  [1, 'Cover', `<p>Some requests are orders, not questions.</p>`, `<p>Có request là mệnh lệnh, không phải câu hỏi.</p>`],
  [2, 'Waiting in one request', `<p>524 at 100 s; the server worked on, a click redid it.</p>`, `<p>524 sau 100 s; server vẫn làm, bấm lại là làm lại.</p>`],
  [3, '202 Accepted', `<p>202, Location, Retry-After: answered in 17 ms.</p>`, `<p>202 (đã nhận), Location, Retry-After: trả lời sau 17 ms.</p>`],
  [4, 'The job resource', `<p>Poll the job until a final status.</p>`, `<p>Hỏi lại (polling) tài nguyên việc (job) tới khi có trạng thái cuối.</p>`],
  [5, 'Cancel, retention', `<p>Cancel 202, expired 410, same key same job.</p>`, `<p>Huỷ 202, hết hạn 410, cùng khoá là cùng việc.</p>`],
  [6, 'Summary', `<p>Next: where the job really runs.</p>`, `<p>Tiếp theo: việc thật sự chạy ở đâu.</p>`],
]);
