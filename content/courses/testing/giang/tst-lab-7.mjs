/** Giảng theo slide — Lab 7 (deck tst-lab-7, 8 slide). */
import { walkTst } from '../_slides.mjs';

export default walkTst('tst-lab-7', 'Lab 7 — End-to-end journeys: kill 8 mutants', 'Lab 7 — hành trình đầu-cuối: diệt 8 đột biến', [
  [1, 'Lab 7 — End-to-end journeys: kill 8 mutants',
    `<p>The chapter lab: journey tests for the whole app, graded by planting eight bugs in the React app, the sign-in form and the server.</p>`,
    `<p>Lab của chương: test hành trình cho cả ứng dụng, chấm bằng cách cài tám bug vào app React, form đăng nhập và server.</p>`],
  [2, 'Your mission',
    `<p>Two spec files, sessions where they help, and 8/8. Each mutant rebuilds and restarts everything, so grading takes a minute and a half.</p>`,
    `<p>Hai file spec, dùng phiên lưu sẵn ở chỗ có ích, và 8/8. Mỗi đột biến build và khởi động lại mọi thứ, nên chấm mất khoảng một phút rưỡi.</p>`],
  [3, 'The 8 planted bugs',
    `<p>Roles mixed up, sessions that never end or never survive a reload, a server that accepts any password, the wrong token, a silent error, a broken form field, and an admin account without its role.</p>`,
    `<p>Nhầm vai trò, phiên không bao giờ kết thúc hoặc không sống qua lần tải lại, server nhận mọi mật khẩu, sai token, lỗi im lặng, một trường form hỏng, và tài khoản admin mất vai trò.</p>`],
  [4, 'A typical first attempt: 2 of 8',
    `<p>Three green tests with a title check, a sleep and a body search catch only the bugs that stop everything. Nothing reloads, signs out or checks roles.</p>`,
    `<p>Ba test xanh với kiểm tiêu đề, một lần sleep và tìm chữ trong body chỉ bắt được những bug làm hỏng tất cả. Không có gì tải lại, đăng xuất hay kiểm vai trò.</p>`],
  [5, 'The reference solution: 8 of 8',
    `<p>Seven journey tests: wrong password, reload and sign-out, roles, booking, approval, a taken slot, and the booking seen by the admin.</p>`,
    `<p>Bảy test hành trình: sai mật khẩu, tải lại và đăng xuất, vai trò, đặt phòng, chờ duyệt, khung đã có người đặt, và lượt đặt được admin thấy.</p>`],
  [6, 'Rubric (10 points)',
    `<p>Four points for mutants; the rest for journeys, retrying assertions, data of its own per test, and saved sessions where login is not the subject.</p>`,
    `<p>Bốn điểm cho đột biến; phần còn lại cho hành trình, assertion biết thử lại, dữ liệu riêng cho mỗi test, và phiên lưu sẵn ở chỗ không phải test đăng nhập.</p>`],
  [7, 'Hints, from gentle to strong',
    `<p>Wrong password first, then reload and sign out, then roles, then the cross-user journey, then repeat everything three times.</p>`,
    `<p>Sai mật khẩu trước, rồi tải lại và đăng xuất, rồi vai trò, rồi hành trình giữa hai người, rồi lặp tất cả ba lần.</p>`],
  [8, 'Before you call it done',
    `<p>All suites green, 8/8, and no session files, builds or test results in git.</p>`,
    `<p>Mọi bộ test xanh, 8/8, và không có file phiên, bản build hay kết quả test nào trong git.</p>`],
]);
