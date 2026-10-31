/**
 * Testing — Chương 5: Test API HTTP (soạn chi tiết 01/11/2026).
 * 5.1 supertest · 5.2 xac-thuc · 5.3 validation · 5.4 hop-dong (slug giữ từ khung) · Lab 5 (MỚI) · Quiz Chương 5 (MỚI).
 * Code/output ở ./s05/_ma.mjs — sinh bằng scripts/tst/sinh-ma.mjs từ labflow-lite chạy thật (Express 5, Supertest 7, jose 6.2.12, Zod 4.6.7, Ajv 8.20).
 * TIÊU ĐỀ CHƯƠNG giữ như khung.
 */
import supertest from './s05/supertest.mjs';
import xacThuc from './s05/xac-thuc.mjs';
import validation from './s05/validation.mjs';
import hopDong from './s05/hop-dong.mjs';
import lab from './s05/lab.mjs';
import quiz from './s05/quiz.mjs';

export default {
  title: 'Chapter 5 — Testing HTTP APIs|||Chương 5 — Test API HTTP',
  description: 'API Express 5 cho LabFlow Lite test bằng Supertest không cần tự bật server; token JWT thật với đồng hồ điều khiển được cho 401/403/404 và IDOR; Zod nghiêm ngặt ở cửa với 400 so với 422 và một định dạng lỗi chung; hợp đồng OpenAPI kiểm mọi phản hồi thật; rồi script cài 8 bug vào route, xác thực và phần đổi mã lỗi.',
  lessons: [supertest, xacThuc, validation, hopDong, lab, quiz],
};
