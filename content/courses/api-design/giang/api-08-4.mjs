/** Giảng theo slide — bài 8.4 "Mở rộng ngang" (deck api-08-4, 8 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-08-4', 'Scaling out', 'Mở rộng ngang', [
  [1, 'Cover', `<p>Two instances, four breakages, one cause.</p>`, `<p>Hai bản, bốn chỗ hỏng, một nguyên nhân.</p>`],
  [2, 'What you will get', `<p>What works, what breaks, and how to move state out.</p>`, `<p>Cái gì chạy, cái gì hỏng, và cách đưa trạng thái ra ngoài.</p>`],
  [3, 'Two instances', `<p>JWT keeps working because the token carries its own claims.</p>`, `<p>JWT vẫn chạy vì token tự mang thông tin.</p>`],
  [4, 'What breaks', `<p>Data, IDs, limits and idempotency lived in one process’s RAM.</p>`, `<p>Dữ liệu, id, giới hạn và idempotency nằm trong RAM một tiến trình.</p>`],
  [5, 'One idempotency table', `<p>One INSERT … ON CONFLICT lets exactly one instance win.</p>`, `<p>Một câu INSERT … ON CONFLICT chỉ cho đúng một bản thắng.</p>`],
  [6, 'Sticky sessions and failover', `<p>Sticky sessions hide the problem; retries need idempotency.</p>`, `<p>Sticky session giấu vấn đề; thử lại cần idempotency.</p>`],
  [7, 'Checklist', `<p>Six contract rules for running many instances.</p>`, `<p>Sáu luật hợp đồng khi chạy nhiều bản.</p>`],
  [8, 'Summary', `<p>Next: SLOs and load shedding.</p>`, `<p>Tiếp theo: SLO và bỏ bớt tải.</p>`],
]);
