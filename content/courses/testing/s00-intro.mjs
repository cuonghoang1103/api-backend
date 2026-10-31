/**
 * Testing — Mục 0: Vì sao phải test, và cách học khoá này (soạn chi tiết 31/10/2026, đợt mẫu).
 * Thứ tự bài: 2 bài "Bắt đầu tại đây" → 0.1 giới thiệu khoá/dự án (MỚI) → 0.2 kim tự tháp → 0.3 cài đặt → quiz Mục 0 (MỚI).
 * Slug cũ giữ nguyên (tst-0-8/9, tst-0-1, tst-0-2); bài mới: tst-0-3-gioi-thieu-du-an, tst-0-4-quiz. syncOrder: true ⇒ seed theo đúng thứ tự file.
 * TIÊU ĐỀ CHƯƠNG giữ nguyên như khung (seeder neo chương bằng tiêu đề).
 */
import batDau1 from './s00/bat-dau-1.mjs';
import batDau2 from './s00/bat-dau-2.mjs';
import gioiThieu from './s00/gioi-thieu.mjs';
import kimTuThap from './s00/kim-tu-thap.mjs';
import caiDat from './s00/cai-dat.mjs';
import quiz from './s00/quiz.mjs';

export default {
  title: 'Section 0 — Why test, and how to study this course|||Mục 0 — Vì sao phải test, và cách học khoá này',
  description: 'Test là gì, vì sao công ty đòi hỏi nó, sự cố thật khi thiếu test, dự án LabFlow Lite và lộ trình 12 phần, kim tự tháp test đo thật, và cài Vitest để chạy test đầu tiên.',
  lessons: [batDau1, batDau2, gioiThieu, kimTuThap, caiDat, quiz],
};
