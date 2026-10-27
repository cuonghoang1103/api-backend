import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alertVi } from './alertVi.js';

const CA: Array<[string, string | null]> = [
  ['SLA breached: first response (HIGH, goal 4h)', 'Đã quá hạn SLA phản hồi đầu tiên (ưu tiên HIGH, mục tiêu 4h)'],
  ['SLA at risk: resolution due in 35m (MEDIUM)', 'Sắp quá hạn SLA giải quyết: còn 35m (ưu tiên MEDIUM)'],
  ['Review due: R-3 Rủi ro mất dữ liệu', 'Đến hạn xem lại R-3: Rủi ro mất dữ liệu'],
  ['Meeting starts in 15 min: Họp sprint 3', 'Cuộc họp bắt đầu sau 15 phút: Họp sprint 3'],
  ['You are invited to a meeting: Demo', 'Bạn được mời họp: Demo'],
  ['Khoa Pham replied No: bận thi', 'Khoa Pham trả lời Không: bận thi'],
  ['A client (client) replied Yes', 'Một khách hàng trả lời Có'],
  ['Your approval is requested: SRS v2', 'Cần bạn duyệt: SRS v2'],
  ['AI deletion waiting for your approval: NT-5', 'Yêu cầu xoá do AI đề xuất đang chờ bạn duyệt: NT-5'],
  ['Long submitted the timesheet for week 2026-W44', 'Long đã nộp timesheet tuần 2026-W44'],
  ['⏱ Your timer on NT-12 has been running for over 2.5h — stop it if you are done', '⏱ Bộ đếm giờ của bạn ở NT-12 đã chạy hơn 2,5 giờ — xong việc thì bấm dừng nhé'],
  ['🤖 Bot finished NT-9 — needs your review', '🤖 Bot đã làm xong NT-9 — cần bạn review'],
  ['New assignment: Lab 2 — due 2026-10-29 16:59 UTC', 'Bài tập mới: Lab 2 — hạn 2026-10-29 16:59 UTC'],
  ['New announcement in SE1907: Nghỉ học thứ 5', 'Thông báo mới trong lớp SE1907: Nghỉ học thứ 5'],
  ['License/asset "JetBrains" expires in 1 day (2026-10-29)', 'Giấy phép/tài sản "JetBrains" còn 1 ngày nữa hết hạn (2026-10-29)'],
  ['Khoa pushed 3 commits to main: “fix login”', 'Khoa đẩy 3 commit lên main: “fix login”'],
  ['Anh Tú merged pull request #12: Thêm trang phòng', 'Anh Tú merge pull request #12: Thêm trang phòng'],
  ['Long requested your review on pull request #7', 'Long nhờ bạn review pull request #7'],
  // Không khớp / đã tiếng Việt ⇒ giữ nguyên
  ['Có review code mới (3 góp ý) — xem và sửa', null],
  ['Something brand new happened', null],
  ['', null],
];

test('alertVi dịch các mẫu cảnh báo CT Work', () => {
  for (const [vao, ra] of CA) assert.equal(alertVi(vao), ra, vao);
});
