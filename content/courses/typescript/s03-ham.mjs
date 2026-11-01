/**
 * TypeScript — Chương 3: Hàm (soạn lại TRỌN 01/11/2026 theo ./_HOP-DONG.md).
 * 3.1 tham-so · 3.2 callback · 3.3 overload-void · 3.4 this (slug giữ) · Lab 3 (MỚI: typescript-3-6-lab-luat-dat-phong)
 * · Quiz Chương 3 (slug giữ typescript-3-5-quiz, 8 → 10 câu). Lab đứng TRƯỚC quiz (syncOrder: true).
 * Cả chương xoay quanh một ý: LabFlow kiểm một yêu cầu đặt phòng bằng một DANH SÁCH HÀM (Rule) — Lab 3 ráp lại, lời giải ở
 * ./_labflow-ts/src/rules/validate.ts. Code/output mỗi bài ở ./s03/_ma-<deck>.mjs — SINH TỰ ĐỘNG (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề). Bản cũ (một tệp) đã thay hẳn.
 */
import thamSo from './s03/tham-so.mjs';
import callback from './s03/callback.mjs';
import overloadVoid from './s03/overload-void.mjs';
import thisBai from './s03/this.mjs';
import lab from './s03/lab.mjs';
import quiz from './s03/quiz.mjs';

export default {
  title: 'Chapter 3 — Functions|||Chương 3 — Hàm',
  description: 'Bộ luật đặt phòng LabFlow viết thành một danh sách hàm: tham số bắt buộc, tuỳ chọn, mặc định và rest (giá trị mặc định không thay null, "| undefined" vẫn bắt buộc), kiểu hàm và callback (luật Rule, hàm tạo luật, bẫy map(parseInt), kiểu Function), overload thay cho union trả về và điều tinh tế của void (hàm async ở chỗ callback void làm sập Node), this và tham số this (phương thức bị tách khỏi object) — rồi Lab 3 gõ kiểu cho cả module có máy chấm chạy thật.',
  lessons: [thamSo, callback, overloadVoid, thisBai, lab, quiz],
};
