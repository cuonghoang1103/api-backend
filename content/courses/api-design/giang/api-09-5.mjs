/** Giảng theo slide — bài 9.5 "SQL vs NoSQL nhìn từ API" (deck api-09-5, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-09-5', 'SQL vs NoSQL from the API', 'SQL vs NoSQL nhìn từ API', [
  [1, 'Cover', `<p>Measure the requests, not the slogans.</p>`, `<p>Đo request, đừng tin khẩu hiệu.</p>`],
  [2, 'Two shapes', `<p>The same lab data as tables and as JSONB documents.</p>`, `<p>Cùng dữ liệu phòng lab dạng bảng và dạng tài liệu JSONB.</p>`],
  [3, 'Four requests', `<p>One read wins; updates and cross-lab queries lose.</p>`, `<p>Một lần đọc thắng; sửa và truy vấn xuyên phòng thua.</p>`],
  [4, 'Reading the results', `<p>Growing lists belong in their own rows.</p>`, `<p>Danh sách lớn dần thuộc về các dòng riêng.</p>`],
  [5, 'Decide from access patterns', `<p>Never shape the API around the storage.</p>`, `<p>Đừng bao giờ nặn API theo cách lưu.</p>`],
  [6, 'Summary', `<p>Next: Lab 9.</p>`, `<p>Tiếp theo: Lab 9.</p>`],
]);
