/**
 * TypeScript — Chương 14: Class & decorator (soạn lại TRỌN 04/11/2026 theo ./_HOP-DONG.md, thay placeholder cũ một tệp).
 * 14.1 classes-access · 14.2 abstract-implements · 14.3 hash-private-static · 14.4 decorators (slug giữ) · Lab 14 (MỚI: typescript-14-6-lab-service-repo)
 * · Quiz Chương 14 (slug giữ typescript-14-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz.
 * ⚠ Class native (không gói ngoài). Decorator chuẩn TC39 — Node type-stripping KHÔNG chạy decorator, bài 14.4 chạy qua bước build (tsc emit → node). Đo thật tsc 7.0.2 + Node 22.23.3.
 * Code/output mỗi bài ở ./s14/_ma-<deck>.mjs — SINH TỰ ĐỘNG. Lab 14 ở ./_labflow-ts/lab14/.
 */
import classesAccess from './s14/classes-access.mjs';
import abstractImplements from './s14/abstract-implements.mjs';
import hashPrivateStatic from './s14/hash-private-static.mjs';
import decorators from './s14/decorators.mjs';
import lab from './s14/lab.mjs';
import quiz from './s14/quiz.mjs';

export default {
  title: 'Chapter 14 — Classes & decorators|||Chương 14 — Class & decorator',
  description: 'Nửa hướng-đối-tượng của TypeScript. Một class gom dữ liệu với thao tác, và modifier truy cập nói ai được chạm gì: private giấu (đọc ngoài ⇒ TS2341), readonly cố định sau construction (gán lại ⇒ TS2540). Một abstract class đặt tên dáng lớp con phải điền (dựng ⇒ TS2511), implements kiểm một class khớp interface (thiếu method ⇒ TS2420; lớp con non-abstract thiếu method abstract ⇒ TS2654). #private là đóng gói THẬT lúc chạy (đọc svc.#x ngoài ⇒ TS18013), mạnh hơn private lúc biên dịch; getter là view chỉ-đọc, static thuộc class. Và decorator chuẩn TC39 bọc một thành viên (context có kiểu; sai đích ⇒ TS1240; cần bước build để chạy). Class native, đo thật tsc + Node. Rồi Lab 14: một BookingService trên một BookingRepo abstract với #private (any stub 5.5, Booking any 7.5, private không # 9.5, bản thiết kế 10).',
  lessons: [classesAccess, abstractImplements, hashPrivateStatic, decorators, lab, quiz],
};
