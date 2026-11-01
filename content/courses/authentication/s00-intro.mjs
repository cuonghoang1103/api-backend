/**
 * Authentication — Mục 0: Bài toán, và một môi trường chạy được (soạn lại trọn 01/11/2026, đợt mẫu — xem ../authentication/_HOP-DONG.md).
 * Thứ tự: Bắt đầu 1/2 (MỚI auth-0-8) → Bắt đầu 2/2 (MỚI auth-0-9) → 0.1 → 0.2 → 0.3 (slug giữ) → Quiz Mục 0 (slug giữ, 10 câu).
 * Code/output dùng chung ở ./s00/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID chạy thật trong env -i (đừng sửa tay).
 * TIÊU ĐỀ MỤC giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import batDau1 from './s00/bat-dau-1.mjs';
import batDau2 from './s00/bat-dau-2.mjs';
import giaoThucQuen from './s00/giao-thuc-quen.mjs';
import baBaiToan from './s00/ba-bai-toan.mjs';
import dangNhapSai from './s00/dang-nhap-sai.mjs';
import quiz from './s00/quiz.mjs';

export default {
  title: 'Section 0 — The problem, and a setup that runs|||Mục 0 — Bài toán, và một môi trường chạy được',
  description: 'Xác thực là gì và vì sao mọi đồ án đều cần nó, những sự cố thật khi làm sai, vì sao HTTP không nhớ ai, ba bài toán trốn trong chữ "đăng nhập", và LabFlow ID v0 — một cái đăng nhập chạy được trong mười phút mà sai sáu chỗ, mỗi chỗ đo thật bằng một đòn tấn công.',
  lessons: [batDau1, batDau2, giaoThucQuen, baBaiToan, dangNhapSai, quiz],
};
