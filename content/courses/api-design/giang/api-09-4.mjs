/** Giảng theo slide — bài 9.4 "API sẵn sàng phân mảnh" (deck api-09-4, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-09-4', 'Sharding-safe APIs', 'API sẵn sàng phân mảnh', [
  [1, 'Cover', `<p>Three API decisions made long before sharding.</p>`, `<p>Ba quyết định API đưa ra từ lâu trước khi phân mảnh.</p>`],
  [2, 'bigint, UUIDv4, UUIDv7', `<p>v7 keeps the index small and reveals the time.</p>`, `<p>v7 giữ chỉ mục gọn và lộ thời điểm tạo.</p>`],
  [3, 'Two shards', `<p>With the shard key one shard answers; without it, all.</p>`, `<p>Có khoá phân mảnh thì một mảnh trả lời; không có thì tất cả.</p>`],
  [4, 'Page 1000', `<p>Naive offset is wrong; cursor is right and cheap.</p>`, `<p>Offset ngây thơ sai; cursor đúng và rẻ.</p>`],
  [5, 'API rules', `<p>UUIDs, cursors, shard key in the path, no totals.</p>`, `<p>UUID, cursor, khoá phân mảnh trong path, không có tổng.</p>`],
  [6, 'Summary', `<p>Next: documents or tables.</p>`, `<p>Tiếp theo: tài liệu hay bảng.</p>`],
]);
