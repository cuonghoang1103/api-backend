/** Giảng theo slide — bài 11.4 "News feed" (deck api-11-4, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-11-4', 'A news feed', 'News feed', [
  [1, 'Cover', `<p>When to do the work: at write time or at read time.</p>`, `<p>Làm việc lúc nào: lúc ghi hay lúc đọc.</p>`],
  [2, 'Contract', `<p>One huge account decides the design; the cursor stays opaque.</p>`, `<p>Một tài khoản khổng lồ quyết định thiết kế; cursor giữ mờ (opaque).</p>`],
  [3, 'Push vs pull', `<p>Push: 200,000 commands per big post. Pull: every read pays per follow.</p>`, `<p>Đẩy (push): 200.000 lệnh cho mỗi bài của trang lớn. Kéo (pull): mỗi lần đọc trả giá theo số tài khoản theo dõi.</p>`],
  [4, 'Hybrid', `<p>Push for normal accounts, pull for big ones: 4 commands per read.</p>`, `<p>Đẩy cho tài khoản thường, kéo cho tài khoản lớn: 4 lệnh mỗi lần đọc.</p>`],
  [5, 'Pages', `<p>Offset repeated a post; a cursor older than X did not.</p>`, `<p>Offset lặp một bài; cursor “cũ hơn X” thì không.</p>`],
  [6, 'Follow-ups', `<p>Unfollow, delete, live updates. Next: chat.</p>`, `<p>Bỏ theo dõi, xoá bài, cập nhật tức thì. Tiếp theo: chat.</p>`],
]);
