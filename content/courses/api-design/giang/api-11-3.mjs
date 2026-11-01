/** Giảng theo slide — bài 11.3 "Rút gọn link (2)" (deck api-11-3, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-11-3', 'URL shortener (2)', 'Rút gọn link (2)', [
  [1, 'Cover', `<p>The redirect, the hot path, and abuse.</p>`, `<p>Chuyển hướng, đường nóng (hot path) và lạm dụng.</p>`],
  [2, '301 vs 302', `<p>With 301 the browser cached the redirect: 2 of 10 clicks counted.</p>`, `<p>Với 301 trình duyệt cache chuyển hướng: chỉ đếm được 2/10 lượt bấm.</p>`],
  [3, 'Which one', `<p>Counting clicks or editing targets means 302.</p>`, `<p>Muốn đếm lượt bấm hay đổi đích thì dùng 302.</p>`],
  [4, 'Hot path', `<p>One UPDATE per click cost 21–39%; a stream append far less.</p>`, `<p>Mỗi lượt bấm một UPDATE tốn 21–39%; thêm vào stream tốn ít hơn hẳn.</p>`],
  [5, 'Follow-ups', `<p>Phishing, deleted links, stats, editing — each has a contract answer.</p>`, `<p>Lừa đảo, link đã xoá, thống kê, sửa đích — mỗi chuyện có câu trả lời ở hợp đồng.</p>`],
  [6, 'Score', `<p>The whole shortener answer scored. Next: the news feed.</p>`, `<p>Chấm cả câu trả lời rút gọn link. Tiếp theo: news feed.</p>`],
]);
