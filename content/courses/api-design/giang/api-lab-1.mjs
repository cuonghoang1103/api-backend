/** Giảng theo slide — Lab Chương 1 "Báo hỏng thiết bị" (deck api-lab-1, 8 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-lab-1', 'Lab 1 — Device issue reports', 'Lab 1 — Báo hỏng thiết bị', [
  [1, 'Cover',
    `<p>The Chapter 1 lab: design a new LabFlow resource on paper, build it in Express 5, and prove every promise with curl.</p>`,
    `<p>Lab Chương 1: thiết kế một tài nguyên mới của LabFlow trên giấy, dựng nó bằng Express 5, và chứng minh từng lời hứa bằng curl.</p>`],
  [2, 'The request from the lab managers',
    `<p>The lab managers want students to report broken devices with a title and a severity — LOW, MEDIUM or HIGH. Anyone may read the reports; only a manager resolves one, and only once. A HIGH report must put the device into MAINTENANCE immediately. And while you are at it: no two devices with the same serial number.</p><p>Plan about twenty minutes to design, an hour or more to build, twenty minutes to prove.</p>`,
    `<p>Quản lý lab muốn sinh viên báo thiết bị hỏng kèm tiêu đề và mức độ — LOW, MEDIUM hoặc HIGH. Ai cũng được đọc các phiếu báo; chỉ quản lý được đánh dấu đã xử lý, và chỉ một lần. Phiếu mức HIGH phải đưa thiết bị vào trạng thái MAINTENANCE ngay lập tức. Và nhân tiện: không được có hai thiết bị trùng số serial.</p><p>Dự kiến khoảng hai mươi phút thiết kế, một giờ trở lên để dựng, hai mươi phút để chứng minh.</p>`],
  [3, 'Part A — design first',
    `<p>Part A is on paper. Fill the table — method, URL and success code for each need — then decide the status code for every error on the right. The hint lists which lesson answers which question. Do not open your editor until both lists are complete.</p>`,
    `<p>Phần A làm trên giấy. Điền bảng — phương thức, URL và mã thành công cho từng nhu cầu — rồi quyết định mã trạng thái cho từng lỗi ở bên phải. Gợi ý cho biết bài nào trả lời câu nào. Đừng mở trình soạn code cho tới khi cả hai danh sách đã đầy đủ.</p>`],
  [4, 'Part B — build rules',
    `<p>Part B has six rules: follow the naming guide from lesson 1.4; a new report starts OPEN with <code>reportedBy</code> and <code>createdAt</code>; HIGH severity moves the device to MAINTENANCE; every URL answers a wrong method with 405 and Allow; every error uses the same JSON shape; and mount the nested router before <code>/devices</code>, with <code>mergeParams</code> so it can read the device id.</p>`,
    `<p>Phần B có sáu luật: theo hướng dẫn đặt tên ở bài 1.4; phiếu mới bắt đầu ở trạng thái OPEN kèm <code>reportedBy</code> và <code>createdAt</code>; mức HIGH chuyển thiết bị sang MAINTENANCE; URL nào cũng trả 405 kèm Allow cho phương thức sai; lỗi nào cũng dùng cùng một hình dạng JSON; và gắn router lồng trước <code>/devices</code>, kèm <code>mergeParams</code> để nó đọc được id thiết bị.</p>`],
  [5, 'Part C — the happy path',
    `<p>Part C proves it. The happy path from our reference solution: a HIGH report returns 201 with a Location header, the device now shows MAINTENANCE, and the manager’s resolve returns the report as RESOLVED with a <code>resolvedAt</code> time.</p>`,
    `<p>Phần C là chứng minh. Đường đi suôn sẻ trong lời giải mẫu: một phiếu mức HIGH trả về 201 kèm header Location, thiết bị giờ hiện MAINTENANCE, và thao tác xử lý của quản lý trả về phiếu ở trạng thái RESOLVED kèm thời điểm <code>resolvedAt</code>.</p>`],
  [6, 'Part C — every error',
    `<p>Then every error, in this order on a freshly restarted server: a bad body gives 400, an unknown device 404, a student resolving 403, a second resolve 409, DELETE on a report 405 with Allow, and a duplicate serial 409. Paste every full response into <code>TRANSCRIPT.md</code> and read the status line before the body.</p>`,
    `<p>Rồi tới từng lỗi, theo đúng thứ tự này trên một server vừa khởi động lại: body sai cho 400, thiết bị không tồn tại cho 404, sinh viên đánh dấu xử lý cho 403, xử lý lần hai cho 409, DELETE một phiếu cho 405 kèm Allow, và trùng số serial cho 409. Dán nguyên mọi response vào <code>TRANSCRIPT.md</code> và đọc dòng trạng thái trước khi đọc body.</p>`],
  [7, 'Rubric — 10 points',
    `<p>The rubric gives ten points: two for the design, two for methods and success codes, two for the six error codes, one for the HIGH-severity rule, one for a single JSON error shape, one for the naming guide, and one for an honest transcript. Seven passes; below seven, fix and resubmit, because the next chapters build on this code.</p>`,
    `<p>Thang chấm có mười điểm: hai cho thiết kế, hai cho phương thức và mã thành công, hai cho sáu mã lỗi, một cho luật mức HIGH, một cho hình dạng lỗi JSON thống nhất, một cho hướng dẫn đặt tên, và một cho bản ghi chép trung thực. Bảy điểm là đạt; dưới bảy thì sửa và nộp lại, vì các chương sau xây trên chính code này.</p>`],
  [8, 'Hand-in and stretch goals',
    `<p>Hand in four things: <code>DESIGN.md</code> with a reason for each choice, the code, <code>TRANSCRIPT.md</code>, and a commit message that says what the API gained. Stretch goals earn no points but real skills: restore the device when its last HIGH report is resolved, add a filtered <code>GET /issues</code>, build a Bruno collection, and explain why resolve is not a PATCH.</p>`,
    `<p>Nộp bốn thứ: <code>DESIGN.md</code> có lý do cho từng lựa chọn, code, <code>TRANSCRIPT.md</code>, và một commit message nói rõ API có thêm gì. Các thử thách thêm không có điểm nhưng cho kỹ năng thật: trả thiết bị về AVAILABLE khi phiếu HIGH cuối cùng được xử lý, thêm <code>GET /issues</code> có lọc, dựng một collection Bruno, và giải thích vì sao "xử lý" không phải là một PATCH.</p>`],
]);
