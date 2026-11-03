/**
 * TypeScript — Chương 10: Module & .d.ts (soạn lại TRỌN 04/11/2026 theo ./_HOP-DONG.md, thay bản placeholder cũ một tệp).
 * 10.1 es-modules · 10.2 declaration-files · 10.3 augmentation · 10.4 types-from-packages (slug giữ) · Lab 10 (MỚI: typescript-10-6-lab-viet-dts)
 * · Quiz Chương 10 (slug giữ typescript-10-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz.
 * Cả chương: kiểu đi qua các biên giới — import type, viết .d.ts cho JS không kiểu, augmentation (declare global / module augmentation, mẫu Request.user),
 * cách một package giao kiểu (@types, trường types). Lab 10 = viết .d.ts cho labflow-slug.js (./_labflow-ts/lab10/). Code/output ở ./s10/_ma-<deck>.mjs — SINH TỰ ĐỘNG.
 */
import esModules from './s10/es-modules.mjs';
import declarationFiles from './s10/declaration-files.mjs';
import augmentation from './s10/augmentation.mjs';
import typesFromPackages from './s10/types-from-packages.mjs';
import lab from './s10/lab.mjs';
import quiz from './s10/quiz.mjs';

export default {
  title: 'Chapter 10 — Modules & declaration files|||Chương 10 — Module & tệp khai báo (.d.ts)',
  description: 'Kiểu đi qua các biên giới — giữa tệp, package và môi trường chạy. ES module: kiểu và giá trị đi cùng một import nhưng chỉ giá trị tồn tại lúc chạy (import một kiểu như giá trị ⇒ TS1484, dùng import type). Tệp khai báo .d.ts cho kiểu một JavaScript không kiểu mà không chạm vào code (import không kiểu ⇒ TS7016; sidecar .d.ts; declare module). Bổ sung (declare global / module augmentation) thêm một trường vào kiểu bạn không sở hữu — process.env.X, Request.user — qua gộp khai báo. Và một package giao kiểu ra sao (đóng gói sẵn, @types, trường types). Rồi Lab 10: viết .d.ts cho labflow-slug.js (stub any 6, any+optional 8, optional max 9.5, tham khảo 10).',
  lessons: [esModules, declarationFiles, augmentation, typesFromPackages, lab, quiz],
};
