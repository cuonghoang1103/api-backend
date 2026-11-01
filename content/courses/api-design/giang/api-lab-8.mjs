/** Giảng theo slide — Lab 8 "Báo cáo dùng phòng" (deck api-lab-8, 9 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-lab-8', 'Lab 8 — Usage report', 'Lab 8 — Báo cáo dùng phòng', [
  [1, 'Cover', `<p>The whole chapter in one task.</p>`, `<p>Cả chương gói trong một bài.</p>`],
  [2, 'Six tasks', `<p>Measure, explain, fix, cache, scale, promise.</p>`, `<p>Đo, giải thích, sửa, cache, mở rộng, cam kết.</p>`],
  [3, 'The starter', `<p>Correct numbers, 335 ms of blocking.</p>`, `<p>Số đúng, 335 ms chặn event loop.</p>`],
  [4, 'Why shedding does nothing', `<p>Synchronous work never waits, so nothing is shed.</p>`, `<p>Việc đồng bộ không chờ, nên chẳng gì bị từ chối.</p>`],
  [5, 'One pass, then a cache', `<p>Same bytes, 180× faster, then 9× more.</p>`, `<p>Cùng từng byte, nhanh 180 lần, rồi thêm 9 lần.</p>`],
  [6, 'Side by side', `<p>Fix the algorithm before adding a cache; cache after auth.</p>`, `<p>Sửa thuật toán trước khi thêm cache; cache sau bước xác thực.</p>`],
  [7, 'Instances and contract', `<p>Per-instance limits double; write what is really promised.</p>`, `<p>Giới hạn riêng từng bản bị nhân đôi; viết đúng điều thật sự hứa.</p>`],
  [8, 'Rubric', `<p>Ten points across six tasks.</p>`, `<p>Mười điểm cho sáu nhiệm vụ.</p>`],
  [9, 'What this lab shows', `<p>Next: Chapter 9, data at scale.</p>`, `<p>Tiếp theo: Chương 9, dữ liệu khi lớn lên.</p>`],
]);
