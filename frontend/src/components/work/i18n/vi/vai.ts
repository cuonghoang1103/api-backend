import type { vai as En } from '../en/vai';
import type { Strings } from '../core';

/** Chế độ đóng vai (27/11/2026): một tài khoản đóng 5 vai C1–C5 của đồ án một người. */
export const vai: Strings<typeof En> = {
  label: 'Vai đang đóng',
  acting: 'Đang đóng vai {role}',
  pick: 'Chọn vai',
  none: 'Chưa chọn vai',
  noneHint: 'Luật so theo người, như dự án nhóm',
  r_C1: 'PM / Leader', r_C2: 'BA', r_C3: 'Dev BE', r_C4: 'Dev FE', r_C5: 'QA',
  d_C1: 'Lập sprint, WBS, rủi ro, CR, họp, báo cáo tuần',
  d_C2: 'Yêu cầu, use case, business rule, Q&A',
  d_C3: 'Code backend, API, CSDL, unit test',
  d_C4: 'Màn hình, trạng thái UI, test front-end',
  d_C5: 'Test case, chạy test, lỗi, UAT, quyết định review',
  shortcut: 'Alt+{n}',
  honest: 'Một tài khoản, năm vai. Mỗi thay đổi ghi lại vai bạn đang đóng; bản xuất ghi "Tên (vai C3 · BE)" — không bao giờ thành năm người khác nhau.',
  separation: 'Vai tác giả không tự duyệt việc của mình: đổi sang vai khác (vd C5 QA) để review.',
  switched: 'Đang đóng vai {role}',
  cleared: 'Đã bỏ vai — luật lại so theo người',
  nudge: 'Bạn đang đóng vai {vai}, nhưng việc này thường của {dung}.',
  switchTo: 'Đổi sang {role}',
  inComment: 'vai {role}',
  settingsTitle: 'Chế độ đóng vai (một người, năm vai)',
  settingsDesc: 'Cho đồ án làm một mình: một tài khoản đóng C1 PM · C2 BA · C3 BE · C4 FE · C5 QA. Chọn vai đang đóng ở thanh tiêu đề dự án; luật "người được giao không tự đóng thẻ" và "tác giả không tự duyệt review" khi đó so theo VAI thay vì người. Mỗi thay đổi ghi lại vai; bản xuất giữ ghi chú một sinh viên đóng cả năm vai.',
  settingsToggle: 'Bật chế độ đóng vai',
  settingsOn: 'Đã bật chế độ đóng vai',
  settingsOff: 'Đã tắt chế độ đóng vai',
  settingsFailed: 'Không đổi được chế độ đóng vai',
};
