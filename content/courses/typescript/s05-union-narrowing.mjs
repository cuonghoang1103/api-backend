/**
 * TypeScript — Chương 5: Union, literal & thu hẹp kiểu (soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md).
 * 5.1 union-narrowing · 5.2 literal-value · 5.3 discriminated-union · 5.4 exhaustiveness (slug giữ) · Lab 5 (MỚI: typescript-5-6-lab-may-trang-thai)
 * · Quiz Chương 5 (slug giữ typescript-5-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz (syncOrder: true).
 * Cả chương xoay quanh một ý: BookingState — máy trạng thái lượt đặt là discriminated union trên BookingRecord của Ch4, đầy đủ nhờ never.
 * Lab 5 ráp lại, lời giải ở ./_labflow-ts/src/rules/state.ts. Code/output mỗi bài ở ./s05/_ma-<deck>.mjs — SINH TỰ ĐỘNG (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề). Bản cũ (một tệp) đã thay hẳn.
 */
import unionNarrowing from './s05/union-narrowing.mjs';
import literalValue from './s05/literal-value.mjs';
import discriminatedUnion from './s05/discriminated-union.mjs';
import exhaustiveness from './s05/exhaustiveness.mjs';
import lab from './s05/lab.mjs';
import quiz from './s05/quiz.mjs';

export default {
  title: 'Chapter 5 — Unions, literals & narrowing|||Chương 5 — Union, literal & thu hẹp kiểu',
  description: 'Dữ liệu thật là "cái này hoặc cái kia": một union (A | B) chỉ cho dùng thứ mọi thành viên cùng có, và thu hẹp kiểu (typeof, tính đúng/sai với bẫy 0, control-flow) lấy lại kiểu nhỏ hơn trong từng nhánh. Thu hẹp theo giá trị (SlotResult qua r.ok, switch trên union literal không cần default, in, instanceof với unknown của catch, TS2367). Discriminated union (union có nhãn) dựng BookingState trên BookingRecord của Ch4 cùng type predicate (và predicate nói dối sập lúc chạy). Kiểm tra đầy đủ với never + assertNever biến "thêm một trạng thái" thành lỗi biên dịch — còn default bắt-hết thì ship nó âm thầm; rồi Lab 5 (máy chấm thật thêm một trạng thái mới ⇒ describe và Record đóng phải hoá đỏ).',
  lessons: [unionNarrowing, literalValue, discriminatedUnion, exhaustiveness, lab, quiz],
};
