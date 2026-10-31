/**
 * Testing — Chương 6: Test component React (soạn chi tiết 01/11/2026).
 * 6.1 testing-library · 6.2 tuong-tac · 6.3 api-gia · 6.4 nextjs (slug giữ từ khung) · Lab 6 (MỚI) · Quiz Chương 6 (MỚI).
 * Code/output ở ./s06/_ma.mjs — sinh bằng scripts/tst/sinh-ma.mjs từ labflow-lite chạy thật (React 19.3.1, Testing Library 16.3.3, jsdom 30.1.3, MSW 3.0.3).
 * TIÊU ĐỀ CHƯƠNG giữ như khung.
 */
import testingLibrary from './s06/testing-library.mjs';
import tuongTac from './s06/tuong-tac.mjs';
import apiGia from './s06/api-gia.mjs';
import nextjs from './s06/nextjs.mjs';
import lab from './s06/lab.mjs';
import quiz from './s06/quiz.mjs';

export default {
  title: 'Chapter 6 — Testing React components|||Chương 6 — Test component React',
  description: 'Form đặt phòng và danh sách admin của LabFlow Lite viết bằng React, test như người dùng: truy vấn theo role và label, user-event, findBy, promise hoãn cho trạng thái bận; MSW trước client thật cho năm trạng thái của màn hình gọi API; route handler và Server Component của Next.js test tới đâu; đo thật bẫy cleanup, quên await, URL tương đối, happy-dom và CORS; rồi script cài 8 bug, hai trong đó là bug trợ năng.',
  lessons: [testingLibrary, tuongTac, apiGia, nextjs, lab, quiz],
};
