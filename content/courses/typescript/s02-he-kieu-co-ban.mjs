/**
 * TypeScript — Chương 2: Hệ thống kiểu cơ bản (soạn lại TRỌN 01/11/2026 theo ./_HOP-DONG.md, sau đợt mẫu Mục 0 + Ch1).
 * 2.1 primitive · 2.2 mang-tuple · 2.3 kieu-dac-biet · 2.4 literal-as-const (slug giữ) · Lab 2 (MỚI: typescript-2-6-lab-lich-phong)
 * · Quiz Chương 2 (slug giữ typescript-2-5-quiz, 8 → 10 câu). Lab đứng TRƯỚC quiz (syncOrder: true).
 * Cả chương dùng chung một mô hình dữ liệu: lịch phòng LabFlow (ScheduleEntry, TimeRange, LabCode) — Lab 2 ráp lại, lời giải ở
 * ./_labflow-ts/src/rules/schedule.ts. Code/output mỗi bài ở ./s02/_ma-<deck>.mjs — SINH TỰ ĐỘNG (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề). Bản cũ (một tệp, ví dụ "Notes") đã thay hẳn.
 */
import primitive from './s02/primitive.mjs';
import mangTuple from './s02/mang-tuple.mjs';
import kieuDacBiet from './s02/kieu-dac-biet.mjs';
import literalAsConst from './s02/literal-as-const.mjs';
import lab from './s02/lab.mjs';
import quiz from './s02/quiz.mjs';

export default {
  title: 'Chapter 2 — The basic type system|||Chương 2 — Hệ thống kiểu cơ bản',
  description: 'Lịch phòng LabFlow làm đề bài cho cả chương: bảy kiểu primitive và những bẫy kiểu số không bắt được (0.1 + 0.2, id bigint), null và undefined dưới strictNullChecks (string | null, trường tuỳ chọn, ?? thay ||), mảng readonly và tuple cho khoảng giờ, cây kiểu unknown/never/void và switch vét cạn, kiểu literal và as const làm nguồn sự thật duy nhất — rồi Lab 2 bật strict cho một module lịch phòng viết khi còn tắt strict, có máy chấm chạy thật.',
  lessons: [primitive, mangTuple, kieuDacBiet, literalAsConst, lab, quiz],
};
