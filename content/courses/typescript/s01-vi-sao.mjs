/**
 * TypeScript — Chương 1: Vì sao TypeScript tồn tại (soạn lại TRỌN 01/11/2026, đợt mẫu — xem ./_HOP-DONG.md).
 * 1.1 ba-con-bug · 1.2 chung-minh-gi · 1.3 suy-luan-kieu · 1.4 any-unknown (slug giữ) · Lab 1 (MỚI: typescript-1-6-lab-chuyen-doi)
 * · Quiz Chương 1 (slug giữ typescript-1-5-quiz, 8 → 10 câu). Lab đứng TRƯỚC quiz (syncOrder: true).
 * Code/output mỗi bài ở ./s01/_ma-<deck>.mjs — SINH TỰ ĐỘNG từ dự án LabFlow TS chạy thật (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import baConBug from './s01/ba-con-bug.mjs';
import chungMinhGi from './s01/chung-minh-gi.mjs';
import suyLuanKieu from './s01/suy-luan-kieu.mjs';
import anyUnknown from './s01/any-unknown.mjs';
import lab from './s01/lab.mjs';
import quiz from './s01/quiz.mjs';

export default {
  title: 'Chapter 1 — Why TypeScript exists|||Chương 1 — Vì sao TypeScript tồn tại',
  description: 'Ba loại bug JavaScript đẩy lên production và TypeScript từ chối chúng ra sao, trình kiểm tra kiểu chứng minh được gì và không được gì (dữ liệu từ ngoài, lỗi logic), suy luận kiểu, any và unknown, chuyển dần JS sang TS — rồi Lab 1 đổi luật đặt phòng LabFlow sang TypeScript với máy chấm chạy thật.',
  lessons: [baConBug, chungMinhGi, suyLuanKieu, anyUnknown, lab, quiz],
};
