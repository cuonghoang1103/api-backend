/** Giảng theo slide — Lab 3 (deck tst-lab-3, 8 slide). */
import { walkTst } from '../_slides.mjs';

export default walkTst('tst-lab-3', 'Lab 3 — honest doubles: kill 8 mutants', 'Lab 3 — đồ đóng thế trung thực: diệt 8 đột biến', [
  [1, 'Lab 3 — honest doubles: kill 8 mutants',
    `<p>The chapter lab: test the e-mail flow with the right double for each job, then let the mutation script plant eight bugs in the glue code.</p>`,
    `<p>Lab của chương: test luồng gửi thư với đúng loại đồ đóng thế cho từng việc, rồi để script đột biến cài tám con bug vào phần code “keo dán”.</p>`],
  [2, 'Your mission',
    `<p>Test <code>notify.js</code> and <code>mailer.js</code> with real rules, fakes for storage and mail, and MSW for HTTP — without mocking your own modules. Aim for 8/8.</p>`,
    `<p>Test <code>notify.js</code> và <code>mailer.js</code> với luật thật, fake cho lưu trữ và thư, MSW cho HTTP — không mock module của chính mình. Nhắm 8/8.</p>`],
  [3, 'The 8 planted bugs',
    `<p>Wrong recipient, missing date, missing seat count, a mail failure that fails the request, a silent failure, a missed rate limit, a broken auth header, and 4xx treated as success — all realistic mistakes in integration glue.</p>`,
    `<p>Gửi nhầm người, thiếu ngày, thiếu số chỗ, thư hỏng làm hỏng luôn yêu cầu, hỏng mà không ghi log, không nhận ra giới hạn tần suất, header xác thực sai, và coi lỗi 4xx là thành công — toàn lỗi thật hay gặp ở phần code nối các hệ thống.</p>`],
  [4, 'A typical first attempt: 0 of 8',
    `<p>Three green tests that check “a mail was sent” and “an id came back”. None checks who, what, or what happens on failure — so none of the eight bugs is noticed.</p>`,
    `<p>Ba test xanh kiểm “có thư được gửi” và “có id trả về”. Không test nào kiểm gửi cho ai, nội dung gì, hay chuyện gì xảy ra khi hỏng — nên không con bug nào bị phát hiện.</p>`],
  [5, 'The reference solution: 8 of 8',
    `<p>Eleven tests: exact mails for both statuses, a stub that throws, the warning text, MSW with header and body recorded, and separate answers 429, 400 and 503. The whole project: 73 tests, all green.</p>`,
    `<p>Mười một test: thư chính xác cho cả hai trạng thái, một stub ném lỗi, nội dung cảnh báo, MSW ghi lại header và thân request, và các câu trả lời 429, 400, 503 tách riêng. Cả dự án: 73 test, xanh hết.</p>`],
  [6, 'Rubric (10 points)',
    `<p>Four points for mutants; six for using the right doubles, asserting outcomes, blocking the real network and keeping the suite clean and fast.</p>`,
    `<p>Bốn điểm cho đột biến; sáu điểm cho việc dùng đúng đồ đóng thế, khẳng định kết quả, chặn mạng thật và giữ bộ test gọn, nhanh.</p>`],
  [7, 'Hints, from gentle to strong',
    `<p>Start from sentences about who receives what. Compare whole objects, make the mailer fail on purpose, and record the HTTP request in MSW.</p>`,
    `<p>Bắt đầu từ các câu “ai nhận gì”. So nguyên cả object, cố ý làm mailer hỏng, và ghi lại request HTTP trong MSW.</p>`],
  [8, 'Before you call it done',
    `<p>Green with no real network, 8/8 here and still 8/8 in Labs 1 and 2, only test files changed, one clear commit.</p>`,
    `<p>Xanh mà không chạm mạng thật, 8/8 ở đây và vẫn 8/8 ở Lab 1 và Lab 2, chỉ file test thay đổi, một commit rõ ràng.</p>`],
]);
