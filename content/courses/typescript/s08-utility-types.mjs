/**
 * TypeScript — Chương 8: Utility types (soạn lại TRỌN 04/11/2026 theo ./_HOP-DONG.md, thay bản placeholder cũ 507 dòng).
 * 8.1 partial-required-readonly · 8.2 pick-omit · 8.3 record · 8.4 exclude-returntype-awaited (slug giữ) · Lab 8 (MỚI: typescript-8-6-lab-utility-dto)
 * · Quiz Chương 8 (slug giữ typescript-8-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz.
 * Cả chương là thư viện của các mapped/conditional type Chương 7: Partial/Required/Readonly, Pick/Omit (DTO), Record, Exclude/NonNullable/ReturnType/
 * Parameters/Awaited. Lab 8 = tự dựng lại MyPartial/MyPick/MyOmit rồi dựng tầng DTO của API (./_labflow-ts/src/rules/dto.ts). Code/output mỗi bài ở
 * ./s08/_ma-<deck>.mjs — SINH TỰ ĐỘNG. TIÊU ĐỀ CHƯƠNG giữ nguyên.
 */
import partialRequiredReadonly from './s08/partial-required-readonly.mjs';
import pickOmit from './s08/pick-omit.mjs';
import record from './s08/record.mjs';
import excludeReturntypeAwaited from './s08/exclude-returntype-awaited.mjs';
import lab from './s08/lab.mjs';
import quiz from './s08/quiz.mjs';

export default {
  title: 'Chapter 8 — Utility types|||Chương 8 — Utility types (kiểu tiện ích)',
  description: 'Thư viện kiểu có sẵn của TypeScript — Partial, Required, Readonly, Pick, Omit, Record, Exclude, NonNullable, ReturnType, Parameters, Awaited — chính là các mapped/conditional type của Chương 7, đóng gói sẵn kèm tên. Partial/Required/Readonly đổi modifier của mọi trường (PATCH body, bản đã đủ, ảnh chụp); Pick/Omit nắn một kiểu thành DTO (CreateBooking = Omit bỏ trường server ⇒ gửi id là TS2353; Omit<User,"passwordHash"> làm đọc hash thành TS2339); Record dựng một bảng — đóng (thiếu khoá ⇒ TS2741) hay mở (tra chưa kiểm ⇒ TS2322); Exclude/NonNullable lọc một union, ReturnType/Parameters/Awaited đọc kiểu ra từ hàm. Rồi Lab 8: tự dựng lại Partial/Pick/Omit từ số 0 (MyPartial/MyPick/MyOmit) rồi dựng tầng DTO của API — any điểm 5, DTO lỏng 8, MyPick không ràng buộc 9.5, tham khảo 10/10.',
  lessons: [partialRequiredReadonly, pickOmit, record, excludeReturntypeAwaited, lab, quiz],
};
