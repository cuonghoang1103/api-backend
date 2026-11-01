/** Giảng theo slide — bài 10.2 "Hàng đợi và worker" (deck api-10-2, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-10-2', 'Queues and workers', 'Hàng đợi và worker', [
  [1, 'Cover', `<p>Keep the 202 promise when things die.</p>`, `<p>Giữ lời hứa 202 khi tiến trình chết.</p>`],
  [2, 'Dies with the process', `<p>Jobs in memory: restart, 404.</p>`, `<p>Việc trong RAM: khởi động lại là 404.</p>`],
  [3, 'Queue in Redis', `<p>A job is a Redis hash.</p>`, `<p>Một việc là một hash trong Redis.</p>`],
  [4, 'Retries, workers', `<p>Backoff 2 s, 4 s; three workers 3× faster.</p>`, `<p>Lùi dần (backoff) 2 s, 4 s; ba worker nhanh gấp 3.</p>`],
  [5, 'Worker dies', `<p>kill -9: 34 s; SIGTERM: finish first.</p>`, `<p>kill -9: 34 s; SIGTERM: làm xong rồi mới tắt.</p>`],
  [6, 'Summary', `<p>Next: event contracts.</p>`, `<p>Tiếp theo: hợp đồng sự kiện.</p>`],
]);
