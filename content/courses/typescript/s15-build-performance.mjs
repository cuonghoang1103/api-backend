/**
 * TypeScript — Chương 15: Hiệu năng build (soạn lại TRỌN 04/11/2026 theo ./_HOP-DONG.md, thay placeholder cũ một tệp).
 * 15.1 where-time-goes · 15.2 incremental-references · 15.3 isolated-modules · 15.4 import-type (slug giữ) · Lab 15 (MỚI: typescript-15-6-lab-bien-transpile)
 * · Quiz Chương 15 (slug giữ typescript-15-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz.
 * ⚠ Đo build THẬT, TÁI LẬP ĐƯỢC (tsc 7.0.2 + Node 22.23.3): skipLibCheck (.d.ts hỏng ⇒ TS2304), tsc -b (--verbose, bỏ timestamp), export type (TS1205), import type (TS1484).
 * Code/output mỗi bài ở ./s15/_ma-<deck>.mjs — SINH TỰ ĐỘNG. Lab 15 ở ./_labflow-ts/lab15/.
 */
import whereTimeGoes from './s15/where-time-goes.mjs';
import incrementalReferences from './s15/incremental-references.mjs';
import isolatedModules from './s15/isolated-modules.mjs';
import importType from './s15/import-type.mjs';
import lab from './s15/lab.mjs';
import quiz from './s15/quiz.mjs';

export default {
  title: 'Chapter 15 — Build performance|||Chương 15 — Hiệu năng build',
  description: 'Mọi đòn bẩy cho một build nhanh. Một lượt kiểm parse · bind · check; check chiếm đa số, và một phần lớn là kiểm các .d.ts của dependency — skipLibCheck bỏ chúng (tắt ⇒ một .d.ts hỏng là TS2304). Incremental (tsc -b + .tsbuildinfo): build thứ hai không đổi "up to date"; project references (composite: true) build theo thứ tự phụ thuộc, bỏ qua dự án không đổi. Tách kiểm kiểu (tsc --noEmit, toàn chương trình) khỏi transpile (nhanh, từng-tệp): một transpiler từng-tệp không phân biệt kiểu với giá trị, nên verbatimModuleSyntax làm một re-export thường của kiểu thành TS1205 (viết export type). Và cắt gọn đồ thị module: value-import một kiểu ⇒ TS1484, viết import type (bị xoá, không cạnh lúc chạy). Đo thật, tái lập được, tsc + Node. Rồi Lab 15: làm một module biên sẵn-sàng-transpile (stub 6, import sửa re-export chưa 6, as thừa 9, bản sẵn-sàng-transpile 10).',
  lessons: [whereTimeGoes, incrementalReferences, isolatedModules, importType, lab, quiz],
};
