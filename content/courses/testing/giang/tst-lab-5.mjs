/** Giảng theo slide — Lab 5 (deck tst-lab-5, 8 slide). */
import { walkTst } from '../_slides.mjs';

export default walkTst('tst-lab-5', 'Lab 5 — API tests: kill 8 mutants', 'Lab 5 — test API: diệt 8 đột biến', [
  [1, 'Lab 5 — API tests: kill 8 mutants',
    `<p>The chapter lab: test the whole HTTP API, then let the script plant eight bugs in routes, authentication and error mapping.</p>`,
    `<p>Lab của chương: test toàn bộ API HTTP, rồi để script cài tám con bug vào route, xác thực và phần đổi mã lỗi.</p>`],
  [2, 'Your mission',
    `<p>Real tokens, a fresh app per test, exact statuses, headers and bodies — and 8/8.</p>`,
    `<p>Token thật, mỗi test một app mới, đúng mã trạng thái, header và body — và 8/8.</p>`],
  [3, 'The 8 planted bugs',
    `<p>Two ways to read other people’s data, a wrong status for forbidden, a schema that drops unknown fields, 200 instead of 201, a missing Location, the wrong status for a taken slot, and expiry checked against the wrong clock.</p>`,
    `<p>Hai cách đọc dữ liệu người khác, sai mã cho “bị cấm”, schema âm thầm bỏ khoá lạ, 200 thay vì 201, thiếu Location, sai mã cho khung đã có người đặt, và kiểm hết hạn bằng nhầm đồng hồ.</p>`],
  [4, 'A typical first attempt: 0 of 8',
    `<p>Four green tests with status ranges, only the owner reading, and no clock — none of the eight bugs is noticed.</p>`,
    `<p>Bốn test xanh dùng khoảng mã trạng thái, chỉ chủ sở hữu đọc, và không có đồng hồ — không con bug nào bị phát hiện.</p>`],
  [5, 'The reference solution: 8 of 8',
    `<p>Twelve tests: exact statuses, Location and bodies, a table of roles, a role in the body, an expired token. The whole unit suite: 85 tests.</p>`,
    `<p>Mười hai test: đúng mã trạng thái, Location và body, một bảng vai trò, vai trò trong body, một token hết hạn. Cả bộ unit: 85 test.</p>`],
  [6, 'Rubric (10 points)',
    `<p>Four points for mutants; the rest for access control as a table, exact assertions, real tokens with a fixed clock, and a clean, fast suite.</p>`,
    `<p>Bốn điểm cho đột biến; phần còn lại cho phân quyền dạng bảng, khẳng định chính xác, token thật với đồng hồ cố định, và bộ test gọn, nhanh.</p>`],
  [7, 'Hints, from gentle to strong',
    `<p>Rows of who-reads-whose-data, exact numbers instead of ranges, a role in the body, a moved clock, and the Location header.</p>`,
    `<p>Các dòng ai-đọc-dữ-liệu-của-ai, con số chính xác thay vì khoảng, vai trò trong body, đồng hồ được dịch, và header Location.</p>`],
  [8, 'Before you call it done',
    `<p>Green, 8/8 here and in Labs 1–3, only test files changed, one clear commit.</p>`,
    `<p>Xanh, 8/8 ở đây và ở Lab 1–3, chỉ file test thay đổi, một commit rõ ràng.</p>`],
]);
