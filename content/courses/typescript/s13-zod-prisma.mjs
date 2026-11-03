/**
 * TypeScript — Chương 13: Validate runtime với Zod & suy kiểu từ Prisma (soạn lại TRỌN 04/11/2026 theo ./_HOP-DONG.md, thay placeholder cũ một tệp).
 * 13.1 boundary-zod · 13.2 parse-safeparse · 13.3 schema-source-of-truth · 13.4 types-from-prisma (slug giữ) · Lab 13 (MỚI: typescript-13-6-lab-schema-nguon-su-that)
 * · Quiz Chương 13 (slug giữ typescript-13-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz.
 * ⚠ KHÔNG cài zod/@prisma/client — mô hình kiểu TỰ-CHỨA (zod.ts: z.object/string/number, parse/safeParse, Infer; prisma.ts: kiểu sinh Booking/CreateInput/findUnique),
 *   đúng dáng zod + Prisma cho, đo thật tsc 7.0.2 + Node 22.23.3 với @types/node. Code/output mỗi bài ở ./s13/_ma-<deck>.mjs — SINH TỰ ĐỘNG. Lab 13 ở ./_labflow-ts/lab13/.
 */
import boundaryZod from './s13/boundary-zod.mjs';
import parseSafeparse from './s13/parse-safeparse.mjs';
import schemaSourceOfTruth from './s13/schema-source-of-truth.mjs';
import typesFromPrisma from './s13/types-from-prisma.mjs';
import lab from './s13/lab.mjs';
import quiz from './s13/quiz.mjs';

export default {
  title: 'Chapter 13 — Runtime validation: Zod & Prisma|||Chương 13 — Validate runtime: Zod & Prisma',
  description: 'Kiểu bị xoá lúc chạy, nên dữ liệu từ ngoài chưa được kiểm — as T là một lời hứa, không phải một phép kiểm. Zod đóng lỗ hổng: một schema validate dữ liệu VÀ suy ra kiểu (z.object/z.Infer; đọc trường không khai ⇒ TS2339, dữ liệu xấu ⇒ parse ném). parse ném cho ngoại lệ; safeParse trả một discriminated union { success: true; data } | { success: false; error } cho dự kiến (đọc data không kiểm success ⇒ TS2339). Schema là nguồn sự thật duy nhất: suy kiểu bằng z.Infer, một bản chép tay trôi ⇒ TS2741. Và Prisma sinh kiểu cho mọi model: BookingCreateInput không có trường server (truyền id ⇒ TS2353), findUnique là Booking | null (đọc chưa kiểm ⇒ TS18047). Dùng mô hình tự-chứa đúng dáng zod + Prisma, đo thật tsc + Node. Rồi Lab 13: validate POST /bookings bằng một schema Zod (any stub 5, cast 7, as thừa 9, schema + z.Infer + safeParse 10).',
  lessons: [boundaryZod, parseSafeparse, schemaSourceOfTruth, typesFromPrisma, lab, quiz],
};
