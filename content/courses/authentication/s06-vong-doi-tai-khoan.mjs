/**
 * Authentication — Chương 6: Vòng đời tài khoản (soạn lại trọn 04/11/2026 theo ./_HOP-DONG.md, chuẩn đợt mẫu Ch1–5).
 * 6.1 dang-ky · 6.2 xac-minh-email · 6.3 dat-lai-mat-khau · 6.4 do-tai-khoan · 6.5 doi-email-va-xoa (slug giữ) ·
 * Lab 6 (MỚI auth-6-7-lab-vong-doi) · Quiz (slug giữ auth-6-6-quiz, 10 câu).
 * Code/output dùng chung ở ./s06/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID v0.6 + PostgreSQL 17.11 chạy thật trong env -i (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import dangKy from './s06/dang-ky.mjs';
import xacMinhEmail from './s06/xac-minh-email.mjs';
import datLaiMatKhau from './s06/dat-lai-mat-khau.mjs';
import doTaiKhoan from './s06/do-tai-khoan.mjs';
import doiEmailVaXoa from './s06/doi-email-va-xoa.mjs';
import lab from './s06/lab.mjs';
import quiz from './s06/quiz.mjs';

export default {
  title: 'Chapter 6 — The account lifecycle|||Chương 6 — Vòng đời tài khoản',
  description: 'Đăng nhập chỉ là một khoảnh khắc trong đời một tài khoản; chương này lo phần còn lại, nơi phần lớn tấn công thật xảy ra. LabFlow ID v0.6 (hộp thư giả + token một lần, lưu digest): đăng ký một tài khoản bắt đầu CHƯA XÁC MINH mà không rò email nào tồn tại (băm ở cả hai nhánh); xác minh email bằng một đường dẫn mà máy quét của cổng bảo mật bấm trước cũng không đốt được (GET hiện trang, POST mới tiêu); đặt lại mật khẩu — luồng bị tấn công nhiều nhất — tiêu một token một lần 15 phút rồi THU HỒI mọi phiên và họ refresh; chống dò tài khoản ở cả câu chữ LẪN THỜI GIAN (đo thật cú rò ~0,9 ms của một tuyến mồi rồi vá bằng cách đẩy việc ra ngoài đường phản hồi — "lỗ 2" của khoá); và đổi email (về chưa xác minh) rồi xoá tài khoản (xác thực lại, xoá-mềm, thu hồi tất cả). Rồi Lab 6 chấm lớp vòng đời bằng máy. Theo OWASP (Authentication, Forgot Password, WSTG) và GDPR Điều 17.',
  lessons: [dangKy, xacMinhEmail, datLaiMatKhau, doTaiKhoan, doiEmailVaXoa, lab, quiz],
};
