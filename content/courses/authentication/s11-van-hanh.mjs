/**
 * Authentication — Chương 11: Vận hành nó (soạn lại trọn 04/11/2026 theo ./_HOP-DONG.md, chuẩn đợt mẫu Ch1–10).
 * 11.1 bi-mat · 11.2 xoay-khoa · 11.3 gioi-han-tan-suat · 11.4 nhat-ky-kiem-toan · 11.5 giam-sat (slug giữ) ·
 * Lab 11 (MỚI auth-11-7-lab-audit-runbook) · Quiz (slug giữ auth-11-6-quiz, 10 câu).
 * Code/output dùng chung ở ./s11/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID v0.11 (src/secrets + src/ops) + demo11 chạy thật (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import biMat from './s11/bi-mat.mjs';
import xoayKhoa from './s11/xoay-khoa.mjs';
import gioiHanTanSuat from './s11/gioi-han-tan-suat.mjs';
import nhatKyKiemToan from './s11/nhat-ky-kiem-toan.mjs';
import giamSat from './s11/giam-sat.mjs';
import lab from './s11/lab.mjs';
import quiz from './s11/quiz.mjs';

export default {
  title: 'Chapter 11 — Running it|||Chương 11 — Vận hành nó',
  description: 'Chương 1–10 dựng và tấn công dịch vụ; chương này VẬN HÀNH nó. Trên LabFlow ID v0.11: 11.1 bí mật tới tiến trình từ MÔI TRƯỜNG (không bao giờ kho mã — một bí mật commit một lần là vĩnh viễn), hỏng nhanh khi thiếu, banner che giá trị; 11.2 xoay khoá ký với CỬA SỔ CHỒNG LẤN (hai khoá sống, mới ký cũ xác minh tới khi token hết hạn — kid chọn khoá; không ai bị đá ra, ĐO THẬT); 11.3 rate limit với cái đếm CHUNG (Redis — N node không để qua N lần), hỏng MỞ, 429 + Retry-After, lớp dưới decide() của Ch10; 11.4 nhật ký kiểm toán allow-list (giữ ai/gì/khi/đâu/kết quả + severity, BỎ mọi bí mật kể cả lồng — một token bị log là vụ rò thứ hai), chống-sửa; 11.5 SÁU tín hiệu → runbook page/investigate/auto/ignore (page chỉ việc-cần-người-ngay; lạ ⇒ investigate; page mọi thứ = mệt mỏi 10.4 trong đội). Rồi Lab 11 chấm safeAudit + triage bằng máy. Theo OWASP Secrets Management/Logging/DoS, NIST SP 800-57, Twelve-Factor.',
  lessons: [biMat, xoayKhoa, gioiHanTanSuat, nhatKyKiemToan, giamSat, lab, quiz],
};
