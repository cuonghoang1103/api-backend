/** Giảng theo slide — Lab 6 (deck tst-lab-6, 8 slide). */
import { walkTst } from '../_slides.mjs';

export default walkTst('tst-lab-6', 'Lab 6 — React components: kill 8 mutants', 'Lab 6 — component React: diệt 8 đột biến', [
  [1, 'Lab 6 — React components: kill 8 mutants',
    `<p>The chapter lab: tests for the booking form and the admin list, graded by a script that plants eight bugs in the components.</p>`,
    `<p>Lab của chương: test cho form đặt phòng và danh sách admin, chấm bằng một script cài tám con bug vào các component.</p>`],
  [2, 'Your mission',
    `<p>Two test files, user-style queries and interactions, and 8/8. Two bugs change nothing a sighted user sees — only what a screen reader announces.</p>`,
    `<p>Hai file test, truy vấn và tương tác kiểu người dùng, và 8/8. Hai con bug không đổi gì với người nhìn màn hình — chỉ đổi thứ trình đọc màn hình đọc lên.</p>`],
  [3, 'The 8 planted bugs',
    `<p>Errors announced politely instead of as alerts, labels detached from inputs, double booking, an off-by-one seat limit, lost server errors, swapped messages, a 403 shown as a failure, and a retry button that does nothing.</p>`,
    `<p>Lỗi được đọc nhẹ nhàng thay vì như cảnh báo, label tách khỏi input, đặt trùng hai lần, giới hạn số chỗ lệch một, mất lỗi từ máy chủ, đảo thông báo, 403 hiện như lỗi chung, và nút thử lại không làm gì.</p>`],
  [4, 'A typical first attempt: 1 of 8',
    `<p>Four green tests with CSS selectors, fireEvent and text searches kill only the swapped-message bug, because one test happens to wait for “Booked”.</p>`,
    `<p>Bốn test xanh dùng bộ chọn CSS, fireEvent và tìm theo chữ chỉ diệt được con bug đảo thông báo, vì tình cờ có một test chờ chữ “Booked”.</p>`],
  [5, 'The reference solution: 8 of 8',
    `<p>Sixteen tests: labels for every field, alert versus status, a held promise, seats at both limits, and every server answer including 403 and a retry.</p>`,
    `<p>Mười sáu test: label cho mọi trường, alert so với status, một promise được giữ, số chỗ ở cả hai giới hạn, và mọi câu trả lời của máy chủ kể cả 403 và thử lại.</p>`],
  [6, 'Rubric (10 points)',
    `<p>Four points for mutants; the rest for user-style queries, covering every state, correct async handling and a clean, fast suite.</p>`,
    `<p>Bốn điểm cho đột biến; phần còn lại cho truy vấn kiểu người dùng, phủ mọi trạng thái, xử lý bất đồng bộ đúng và bộ test gọn, nhanh.</p>`],
  [7, 'Hints, from gentle to strong',
    `<p>Labels first, then alert versus status, then the held promise, then the seat limits, then a stub client that fails once.</p>`,
    `<p>Label trước, rồi alert so với status, rồi promise được giữ, rồi giới hạn số chỗ, rồi một client stub lỗi một lần.</p>`],
  [8, 'Before you call it done',
    `<p>Both suites green, 8/8, no selectors or test ids, and only test files changed.</p>`,
    `<p>Cả hai bộ test xanh, 8/8, không bộ chọn CSS hay test id, và chỉ file test thay đổi.</p>`],
]);
