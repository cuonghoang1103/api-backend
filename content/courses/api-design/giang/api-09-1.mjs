/** Giảng theo slide — bài 9.1 "Cache HTTP" (deck api-09-1, 8 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-09-1', 'HTTP caching', 'Cache HTTP', [
  [1, 'Cover', `<p>Who may keep an answer, and what a 304 saves.</p>`, `<p>Ai được giữ câu trả lời, và một 304 tiết kiệm được gì.</p>`],
  [2, 'After Chapter 9 you can…', `<p>Five lessons and a lab on data that grows.</p>`, `<p>Năm bài và một lab về dữ liệu lớn lên.</p>`],
  [3, 'Who may keep a response', `<p>Public for shared data, private for personal data, no-store for secrets.</p>`, `<p>Public cho dữ liệu chung, private cho dữ liệu riêng, no-store cho bí mật.</p>`],
  [4, 'A version ETag', `<p>Compare before the query, and the 304 costs almost nothing.</p>`, `<p>So trước truy vấn thì 304 gần như không tốn gì.</p>`],
  [5, 'Under load', `<p>Express’s 304 saves bytes; the early 304 saves work too.</p>`, `<p>304 của Express tiết kiệm byte; 304 sớm tiết kiệm cả công.</p>`],
  [6, 'The header that leaks data', `<p>One wrong public gave An’s bookings to Bình.</p>`, `<p>Một chữ public sai đưa lượt đặt của An cho Bình.</p>`],
  [7, 'Interview answers', `<p>Store, how long, how to revalidate.</p>`, `<p>Ai lưu, lưu bao lâu, kiểm lại bằng gì.</p>`],
  [8, 'Summary', `<p>Next: a Redis cache and the stampede.</p>`, `<p>Tiếp theo: cache Redis và cú giẫm đạp.</p>`],
]);
