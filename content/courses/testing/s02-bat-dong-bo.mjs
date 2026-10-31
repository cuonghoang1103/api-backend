/**
 * Testing — Chương 2: Code bất đồng bộ, thời gian và lỗi (soạn chi tiết 01/11/2026).
 * 2.1 async · 2.2 thoi-gian · 2.3 loi · 2.4 ngau-nhien (slug giữ từ khung) · Lab 2 (MỚI) · Quiz Chương 2 (MỚI).
 * Code/output dùng chung ở ./s02/_ma.mjs — SINH TỰ ĐỘNG từ dự án labflow-lite chạy thật (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên như khung (seeder neo chương bằng tiêu đề).
 */
import asyncBai from './s02/async.mjs';
import thoiGian from './s02/thoi-gian.mjs';
import loi from './s02/loi.mjs';
import ngauNhien from './s02/ngau-nhien.mjs';
import lab from './s02/lab.mjs';
import quiz from './s02/quiz.mjs';

export default {
  title: 'Chapter 2 — Async code, time and errors|||Chương 2 — Code bất đồng bộ, thời gian và lỗi',
  description: 'Test code phải chờ: promise và async/await (kể cả một lỗi tranh chấp thật), thời gian (fake timers, đồng hồ được tiêm, bug múi giờ UTC+7), lỗi và nhánh catch (repository cố ý hỏng), ngẫu nhiên và ID (seed, spy, restoreMocks) — rồi để script cài 8 bug kiểm chứng bộ test của bạn.',
  lessons: [asyncBai, thoiGian, loi, ngauNhien, lab, quiz],
};
