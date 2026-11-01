/**
 * TypeScript — Mục 0: Giới thiệu khoá học & Hướng dẫn học (soạn lại TRỌN 01/11/2026, đợt mẫu — xem ./_HOP-DONG.md).
 * Thứ tự: 2 bài "Bắt đầu tại đây" (MỚI: typescript-0-8, typescript-0-9) → 0.1 giới thiệu khoá + dự án LabFlow TS → 0.2 cách học/đọc lỗi
 * → 0.3 cài đặt → 0.4 mô hình biên dịch/chạy → quiz Mục 0 (MỚI: typescript-0-5-quiz). Slug cũ giữ nguyên; course có syncOrder: true.
 * Code/output mỗi bài ở ./s00/_ma-<deck>.mjs — SINH TỰ ĐỘNG từ dự án LabFlow TS chạy thật (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import batDau1 from './s00/bat-dau-1.mjs';
import batDau2 from './s00/bat-dau-2.mjs';
import gioiThieu from './s00/gioi-thieu.mjs';
import cachHoc from './s00/cach-hoc.mjs';
import caiDat from './s00/cai-dat.mjs';
import moHinh from './s00/mo-hinh.mjs';
import quiz from './s00/quiz.mjs';

export default {
  title: 'Section 0 — Introduction & How to Study|||Mục 0 — Giới thiệu khoá học & Hướng dẫn học',
  description: 'TypeScript là gì và vì sao ra đời, sự cố thật khi thiếu kiểu, khoá học và dự án LabFlow TS, cách học bằng cách đọc lỗi của trình biên dịch, cài Node 22 + TypeScript 7 + VS Code, và mô hình cốt lõi: lúc biên dịch khác lúc chạy.',
  lessons: [batDau1, batDau2, gioiThieu, cachHoc, caiDat, moHinh, quiz],
};
