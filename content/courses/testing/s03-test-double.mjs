/**
 * Testing — Chương 3: Mock, stub, spy mà không tự lừa mình (soạn chi tiết 01/11/2026).
 * 3.1 phan-loai · 3.2 mock-module · 3.3 qua-da · 3.4 thiet-ke (slug giữ từ khung) · Lab 3 (MỚI) · Quiz Chương 3 (MỚI).
 * Code/output ở ./s03/_ma.mjs — sinh bằng scripts/tst/sinh-ma.mjs từ labflow-lite chạy thật. TIÊU ĐỀ CHƯƠNG giữ như khung.
 */
import phanLoai from './s03/phan-loai.mjs';
import mockModule from './s03/mock-module.mjs';
import quaDa from './s03/qua-da.mjs';
import thietKe from './s03/thiet-ke.mjs';
import lab from './s03/lab.mjs';
import quiz from './s03/quiz.mjs';

export default {
  title: 'Chapter 3 — Test doubles without lying to yourself|||Chương 3 — Mock, stub, spy mà không tự lừa mình',
  description: 'Năm loại đồ đóng thế dựng quanh tính năng gửi thư của LabFlow Lite; vi.mock, vi.hoisted và MSW 3 cho HTTP; đo thật khi nào mock làm test vô giá trị; thiết kế code để cần ít đồ đóng thế — rồi script cài 8 bug kiểm chứng bộ test.',
  lessons: [phanLoai, mockModule, quaDa, thietKe, lab, quiz],
};
