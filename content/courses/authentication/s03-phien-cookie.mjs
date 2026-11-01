/**
 * Authentication — Chương 3: Phiên và cookie (soạn lại trọn 01/11/2026 theo ./_HOP-DONG.md, chuẩn đợt mẫu).
 * 3.1 bang-phien · 3.2 thuoc-tinh-cookie · 3.3 tai-sinh-phien · 3.4 csrf · 3.5 phien-song-o-dau (slug giữ) · Lab 3 (MỚI auth-3-7-lab-phien-cookie) · Quiz (slug giữ, 10 câu).
 * Code/output dùng chung ở ./s03/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID v0.3 + PostgreSQL 17.11 + Redis 7.4.9 + Chromium 156 chạy thật trong env -i (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import bangPhien from './s03/bang-phien.mjs';
import thuocTinhCookie from './s03/thuoc-tinh-cookie.mjs';
import taiSinhPhien from './s03/tai-sinh-phien.mjs';
import csrf from './s03/csrf.mjs';
import phienSongODau from './s03/phien-song-o-dau.mjs';
import lab from './s03/lab.mjs';
import quiz from './s03/quiz.mjs';

export default {
  title: 'Chapter 3 — Sessions and cookies|||Chương 3 — Phiên và cookie',
  description: 'Câu trả lời lâu đời nhất cho "HTTP hay quên", vẫn đúng cho phần lớn sản phẩm: một dòng trên máy chủ và một cookie trỏ tới nó. LabFlow ID v0.3 dựng bảng phiên có hai kiểu hết hạn và đăng xuất mọi nơi; đo từng thuộc tính cookie trong Chromium 156 thật (__Host- sai bị bỏ âm thầm, SameSite, HttpOnly không chặn được XSS); chạy session fixation thật rồi vá bằng phiên mới ở mỗi lần đổi đặc quyền; tấn công CSRF từ site khác với năm cấu hình và xếp hạng ba lớp phòng; so PostgreSQL, Redis và cookie có ký bằng số đo — rồi Lab 3 dựng lớp phiên có máy chấm dùng trình duyệt thật.',
  lessons: [bangPhien, thuocTinhCookie, taiSinhPhien, csrf, phienSongODau, lab, quiz],
};
