/** Giảng theo slide — bài 8.1 "Ngân sách độ trễ" (deck api-08-1, 10 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-08-1', 'Latency budgets', 'Ngân sách độ trễ', [
  [1, 'Cover', `<p>Measure every leg before changing code.</p>`, `<p>Đo từng chặng trước khi sửa code.</p>`],
  [2, 'After Chapter 8 you can…', `<p>Six lessons and a lab, every number measured on LabFlow.</p>`, `<p>Sáu bài và một lab, mọi con số đều đo trên LabFlow.</p>`],
  [3, 'One request, many legs', `<p>Find the big leg first; tiny legs do not matter.</p>`, `<p>Tìm chặng lớn trước; chặng nhỏ không đáng sửa.</p>`],
  [4, 'Numbers measured on this machine', `<p>Remember orders of magnitude: ns, µs, ms, hundreds of ms.</p>`, `<p>Nhớ theo bậc: ns, µs, ms, hàng trăm ms.</p>`],
  [5, 'Median, p95, p99', `<p>Promise percentiles; five calls per screen meet the p99 often.</p>`, `<p>Hứa theo phân vị; màn hình gọi năm lần sẽ hay gặp p99.</p>`],
  [6, 'Server-Timing', `<p>Each response tells where its time went: login is 97% scrypt.</p>`, `<p>Mỗi response tự kể thời gian đi đâu: đăng nhập 97% là scrypt.</p>`],
  [7, 'A latency budget', `<p>Split the target across legs; open connections early.</p>`, `<p>Chia mục tiêu cho từng chặng; mở kết nối sớm.</p>`],
  [8, 'Estimate first', `<p>Average load is tiny; the danger is a burst on an expensive endpoint.</p>`, `<p>Tải trung bình rất nhỏ; nguy hiểm là đợt dồn vào endpoint đắt.</p>`],
  [9, 'Traps and interview answers', `<p>Repeat measurements; keep Server-Timing away from strangers.</p>`, `<p>Đo lặp lại; đừng gửi Server-Timing cho người lạ.</p>`],
  [10, 'Summary', `<p>Next: the 07:00 load test.</p>`, `<p>Tiếp theo: bài test tải 07:00.</p>`],
]);
