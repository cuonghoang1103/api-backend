/**
 * TypeScript — Chương 9: tsconfig & trình biên dịch (soạn lại TRỌN 04/11/2026 theo ./_HOP-DONG.md, thay bản placeholder cũ 534 dòng).
 * 9.1 tsc-and-tsconfig · 9.2 strict-mode · 9.3 extra-safety-flags · 9.4 target-lib-module (slug giữ) · Lab 9 (MỚI: typescript-9-6-lab-siet-strict)
 * · Quiz Chương 9 (slug giữ typescript-9-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz.
 * Cả chương: tsc kiểm gì và âm thầm không kiểm gì (lỗ hổng include = sự cố seed 08/08), cờ strict + họ hàng, cờ an toàn thêm, target/lib/module/noEmit.
 * Lab 9 = siết một dự án lỏng lên strict + cổng CI (tsc --noEmit) + đóng lỗ hổng seed (./_labflow-ts/lab9/). Code/output mỗi bài ở ./s09/_ma-<deck>.mjs — SINH TỰ ĐỘNG.
 */
import tscAndTsconfig from './s09/tsc-and-tsconfig.mjs';
import strictMode from './s09/strict-mode.mjs';
import extraSafetyFlags from './s09/extra-safety-flags.mjs';
import targetLibModule from './s09/target-lib-module.mjs';
import lab from './s09/lab.mjs';
import quiz from './s09/quiz.mjs';

export default {
  title: 'Chapter 9 — tsconfig & the compiler|||Chương 9 — tsconfig & trình biên dịch',
  description: 'Công cụ kiểm kiểu và tệp cấu hình nó. tsc đọc code, kiểm kiểu, và (ở khoá này) không sinh gì — kiểu bị xoá, Node tự chạy .ts. tsconfig.json là bảng điều khiển, và lỗ hổng quan trọng nhất là include: tsc CHỈ kiểm các tệp trong dự án, nên một tệp đã trôi để ngoài là vô hình — đúng cách một enum đổi tên từng làm vỡ seed trên production (08/08), đóng bằng một config typecheck thứ hai (TS2322). Cờ strict (noImplicitAny TS7006, strictNullChecks TS18048) là một chiếc ô trên tám cờ, mặc định kể cả không có config; các cờ an toàn thêm ngoài strict (noUncheckedIndexedAccess TS18048, noImplicitReturns TS7030, noUnusedLocals TS6133); và target/lib/module/noEmit tả môi trường (findLast cần lib es2023 ⇒ TS2550, nodenext cần phần mở rộng ⇒ TS2835, tsc --noEmit = cổng CI). Rồi Lab 9: siết một dự án lỏng lên strict + cổng CI + đóng lỗ hổng seed — lỏng 4.5, strict thiếu noUncheckedIndexedAccess 8, tight nhưng seed chép tay 9, tham khảo 10/10.',
  lessons: [tscAndTsconfig, strictMode, extraSafetyFlags, targetLibModule, lab, quiz],
};
