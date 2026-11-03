/**
 * TypeScript — Chương 7: Kiểu nâng cao (soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md).
 * 7.1 mapped-types · 7.2 mapping-modifiers · 7.3 conditional-infer · 7.4 template-literal-types (slug giữ) · Lab 7 (MỚI: typescript-7-6-lab-he-su-kien)
 * · Quiz Chương 7 (slug giữ typescript-7-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz (syncOrder: true).
 * Cả chương xoay quanh một ý: hệ sự kiện có kiểu của LabFlow (template literal tên sự kiện + mapped payload + conditional PayloadOf) — lời giải Lab 7 ở
 * ./_labflow-ts/src/rules/events.ts. Code/output mỗi bài ở ./s07/_ma-<deck>.mjs — SINH TỰ ĐỘNG. TIÊU ĐỀ CHƯƠNG giữ nguyên. Bản cũ (một tệp) đã thay hẳn.
 */
import mappedTypes from './s07/mapped-types.mjs';
import mappingModifiers from './s07/mapping-modifiers.mjs';
import conditionalInfer from './s07/conditional-infer.mjs';
import templateLiteralTypes from './s07/template-literal-types.mjs';
import lab from './s07/lab.mjs';
import quiz from './s07/quiz.mjs';

export default {
  title: 'Chapter 7 — Advanced types|||Chương 7 — Kiểu nâng cao',
  description: 'Những kiểu tính ra từ kiểu khác — bộ máy đằng sau Partial, Readonly, Record, ReturnType và một hệ sự kiện có kiểu. Mapped types ({ [K in keyof T]: … }) dựng một bản form/readonly/getter từ nguồn nên không bao giờ trôi; modifier ánh xạ thêm/gỡ ? và readonly (Partial, Required với -?, Mutable với -readonly). Conditional types (T extends U ? X : Y) chọn kiểu theo điều kiện và infer rút một kiểu ra (element type, ReturnType, PayloadOf), distribute qua union (NonNullable). Template literal types dựng kiểu chuỗi (booking:${Action}), tích Descartes hai union, Uppercase/Capitalize, đổi tên khoá bằng as — tên sự kiện/khoá an toàn, gõ sai là TS2820. Rồi Lab 7 (hệ sự kiện có kiểu gộp cả ba: string/any điểm 5, bus generic theo sự kiện, lời giải 10/10).',
  lessons: [mappedTypes, mappingModifiers, conditionalInfer, templateLiteralTypes, lab, quiz],
};
