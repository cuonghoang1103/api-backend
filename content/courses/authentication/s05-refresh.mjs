/**
 * Authentication — Chương 5: Làm mới, xoay vòng và thu hồi (soạn lại trọn 03/11/2026 theo ./_HOP-DONG.md, chuẩn đợt mẫu Ch1–4).
 * 5.1 hai-token · 5.2 xoay-vong · 5.3 nam-su-kien · 5.4 danh-sach-thiet-bi · 5.5 cuoc-dua-refresh (slug giữ) · Lab 5 (MỚI auth-5-7-lab-xoay-vong) · Quiz (slug giữ, 10 câu).
 * Code/output dùng chung ở ./s05/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID v0.5 + PostgreSQL 17.11 chạy thật trong env -i (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import haiToken from './s05/hai-token.mjs';
import xoayVong from './s05/xoay-vong.mjs';
import namSuKien from './s05/nam-su-kien.mjs';
import danhSachThietBi from './s05/danh-sach-thiet-bi.mjs';
import cuocDuaRefresh from './s05/cuoc-dua-refresh.mjs';
import lab from './s05/lab.mjs';
import quiz from './s05/quiz.mjs';

export default {
  title: 'Chapter 5 — Refresh, rotation and revocation|||Chương 5 — Refresh, xoay vòng và thu hồi',
  description: 'Access token phải ngắn vì không thu hồi được (Chương 4), nhưng đăng nhập lại mỗi 15 phút thì không chịu nổi — nên có một refresh token dài hạn, thu hồi được, mua access token mới mà không cần mật khẩu. LabFlow ID v0.5 phát cặp access + refresh (refresh trong cookie __Host- HttpOnly, lưu dạng digest SHA-256 trong các họ); xoay refresh token mỗi lần dùng và coi một token đã xoay quay lại là TRỘM, thu hồi cả họ (kể cả token sống); liệt kê năm sự kiện bắt buộc kết thúc một phiên; dựng trang thiết bị (GROUP BY family, thu hồi giới hạn theo chủ chống IDOR); và chịu được cuộc đua hai tab bằng một cửa sổ ân hạn ngắn — nếu không, cảnh báo giả đăng xuất người thật và các đội tắt cả tính năng. Rồi Lab 5 chấm một lớp refresh bằng máy. Theo RFC 9700 (BCP 240) và OWASP.',
  lessons: [haiToken, xoayVong, namSuKien, danhSachThietBi, cuocDuaRefresh, lab, quiz],
};
