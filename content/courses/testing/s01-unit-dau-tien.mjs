/**
 * Testing — Chương 1: Những unit test đầu tiên (soạn chi tiết 01/11/2026, đợt mẫu).
 * 1.1 cau-truc · 1.2 matcher · 1.3 ten-test · 1.4 ham-thuan (slug giữ từ khung) · Lab 1 (MỚI) · Quiz Chương 1 (MỚI).
 * Code/output dùng chung ở ./s01/_ma.mjs — SINH TỰ ĐỘNG từ dự án labflow-lite chạy thật (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên như khung (seeder neo chương bằng tiêu đề).
 */
import cauTruc from './s01/cau-truc.mjs';
import matcher from './s01/matcher.mjs';
import tenTest from './s01/ten-test.mjs';
import hamThuan from './s01/ham-thuan.mjs';
import lab from './s01/lab.mjs';
import quiz from './s01/quiz.mjs';

export default {
  title: 'Chapter 1 — Your first unit tests|||Chương 1 — Những unit test đầu tiên',
  description: 'Viết, đọc và đặt tên test; chọn đúng matcher; chọn giá trị test bằng phân vùng, giá trị biên, bảng quyết định và thuộc tính — rồi để một script cài 8 bug kiểm chứng bộ test của bạn.',
  lessons: [cauTruc, matcher, tenTest, hamThuan, lab, quiz],
};
