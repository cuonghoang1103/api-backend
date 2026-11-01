/**
 * Authentication — Chương 2: Mật khẩu (soạn lại trọn 01/11/2026 theo ./_HOP-DONG.md, chuẩn đợt mẫu Mục 0 + Ch1).
 * 2.1 da-co-csdl · 2.2 chon-va-chinh · 2.3 luong-dang-nhap · 2.4 chinh-sach · 2.5 chuyen-doi (slug giữ) · Lab 2 (MỚI auth-2-7-lab-luu-mat-khau) · Quiz (slug giữ, 10 câu).
 * Code/output dùng chung ở ./s02/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID v0.2 + PostgreSQL 17.11 chạy thật trong env -i (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import daCoCsdl from './s02/da-co-csdl.mjs';
import chonVaChinh from './s02/chon-va-chinh.mjs';
import luongDangNhap from './s02/luong-dang-nhap.mjs';
import chinhSach from './s02/chinh-sach.mjs';
import chuyenDoi from './s02/chuyen-doi.mjs';
import lab from './s02/lab.mjs';
import quiz from './s02/quiz.mjs';

export default {
  title: 'Chapter 2 — Passwords|||Chương 2 — Mật khẩu',
  description: 'Kẻ tấn công đã cầm bảng users — chỉ còn tốc độ đứng giữa họ và mật khẩu của mọi người. LabFlow ID chuyển sang PostgreSQL 17 và argon2id; bốn cách lưu bị bẻ cạnh nhau trên 1.003 tài khoản; tham số chọn bằng hai ngân sách đo trên máy và thử với 40 lượt đăng nhập cùng lúc; luồng đăng nhập không rò qua thông báo, đồng hồ hay chuỗi byte (băm giả, NFC); chính sách NIST 800-63B-4 kèm kiểm rò rỉ k-ẩn danh; bọc cả bảng MD5 cũ trong argon2id mà không bắt ai đặt lại — rồi Lab 2 dựng module mật khẩu có máy chấm dump, bẻ và bấm giờ.',
  lessons: [daCoCsdl, chonVaChinh, luongDangNhap, chinhSach, chuyenDoi, lab, quiz],
};
