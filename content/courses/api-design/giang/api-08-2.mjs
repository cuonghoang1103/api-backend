/** Giảng theo slide — bài 8.2 "Nút thắt đầu tiên" (deck api-08-2, 9 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-08-2', 'The first bottleneck', 'Nút thắt đầu tiên', [
  [1, 'Cover', `<p>One line from Chapter 6 slowed every request.</p>`, `<p>Một dòng code của Chương 6 làm chậm mọi request.</p>`],
  [2, 'What you will get', `<p>A load test, a blocked event loop, and the fix.</p>`, `<p>Một bài test tải, event loop bị chặn, và cách sửa.</p>`],
  [3, 'Read the status codes', `<p>82,460 fast answers were our own 429s; check Little’s law.</p>`, `<p>82.460 câu trả lời nhanh là 429 của chính ta; kiểm bằng định luật Little.</p>`],
  [4, 'The 07:00 test', `<p>A bystander probe shows the damage: lab list p99 3.3 → 463 ms.</p>`, `<p>Bộ đo người đứng ngoài cho thấy thiệt hại: p99 danh sách phòng 3,3 → 463 ms.</p>`],
  [5, 'One thread', `<p>A synchronous step in any handler makes every endpoint wait.</p>`, `<p>Một bước đồng bộ ở bất kỳ handler nào bắt mọi endpoint chờ.</p>`],
  [6, 'The fix', `<p>Async scrypt on the threadpool: p99 8 ms, 114 logins/s.</p>`, `<p>scrypt bất đồng bộ trên threadpool: p99 8 ms, 114 lượt/s.</p>`],
  [7, 'The threadpool', `<p>Four threads by default, shared with fs, dns.lookup and zlib.</p>`, `<p>Mặc định bốn luồng, dùng chung với fs, dns.lookup và zlib.</p>`],
  [8, 'Traps and interview answers', `<p>All endpoints slow at once in Node: suspect blocking.</p>`, `<p>Mọi endpoint cùng chậm trong Node: nghi bị chặn.</p>`],
  [9, 'Summary', `<p>Next: payload size on slow links.</p>`, `<p>Tiếp theo: kích thước payload trên đường truyền chậm.</p>`],
]);
