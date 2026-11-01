/** Giảng theo slide — bài Lab 10 "Báo cáo dùng phòng thành việc nền có webhook" (deck api-lab-10, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-lab-10', 'Lab 10 — Report job with a webhook', 'Lab 10 — Báo cáo thành việc nền có webhook', [
  [1, 'Cover', `<p>The Lab 8 report, now for the whole campus: change the contract, not the computation.</p>`,
    `<p>Báo cáo của Lab 8, giờ cho cả trường: đổi hợp đồng, không đổi phép tính.</p>`],
  [2, 'Starting point and tasks', `<p>The starter answers correctly in 23.3 s while the client waits. Seven tasks: 202 with a job, who may do what, status, result, cancel, webhook and retention.</p>`,
    `<p>Bản khởi đầu (starter) trả đúng số liệu sau 23,3 s trong khi client ngồi chờ. Bảy nhiệm vụ: 202 kèm việc nền (job), ai được làm gì, trạng thái, kết quả, huỷ, webhook và thời hạn giữ (retention).</p>`],
  [3, 'Rubric and grader', `<p>Ten points; the grading script runs every check against your running LabFlow with its own receiver. The starter scores 0/10.</p>`,
    `<p>Mười điểm; script chấm (grader) chạy mọi phép kiểm trên LabFlow đang chạy của bạn, kèm bên nhận webhook riêng. Bản khởi đầu được 0/10.</p>`],
  [4, 'The solution', `<p>The route only creates the job; the task checks the abort signal and reports progress once per day. Two traps: a webhook without an owner goes to everyone, and cancelling only the queue leaves the work running.</p>`,
    `<p>Route chỉ tạo việc; tác vụ kiểm tín hiệu huỷ (abort signal) và báo tiến độ mỗi ngày. Hai bẫy: webhook không ghi chủ sở hữu thì gửi tới mọi người, và chỉ huỷ trong hàng đợi thì việc đang chạy vẫn tiếp tục.</p>`],
  [5, 'Measured', `<p>202 in 6 ms, 700 rows matching SQL, cancel at 5%, exactly one signed webhook: 10/10.</p>`,
    `<p>202 sau 6 ms, 700 dòng khớp SQL, huỷ ở 5%, đúng một webhook có chữ ký hợp lệ: 10/10.</p>`],
  [6, 'What this lab shows', `<p>The ready event stays thin: the report is private and already lives at a URL that checks the token. Download the chapter code.</p>`,
    `<p>Sự kiện báo xong giữ mỏng (thin — chỉ có đường dẫn): báo cáo là riêng tư và đã nằm ở một URL có kiểm token. Tải mã của chương về.</p>`],
]);
