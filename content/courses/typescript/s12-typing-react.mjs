/**
 * TypeScript — Chương 12: Gõ kiểu React (soạn lại TRỌN 04/11/2026 theo ./_HOP-DONG.md, thay placeholder cũ một tệp).
 * 12.1 components-props · 12.2 hooks · 12.3 events · 12.4 context-generics (slug giữ) · Lab 12 (MỚI: typescript-12-6-lab-form-co-kieu)
 * · Quiz Chương 12 (slug giữ typescript-12-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz.
 * ⚠ KHÔNG cài @types/react, KHÔNG JSX — dùng mô hình kiểu tự-chứa (react.ts: FC/El, useState/useRef, ChangeEvent, createContext/useContext),
 *   đúng dáng @types/react cho, đo thật bằng tsc 7.0.2 + Node 22.23.3 với @types/node. Code/output mỗi bài ở ./s12/_ma-<deck>.mjs — SINH TỰ ĐỘNG. Lab 12 ở ./_labflow-ts/lab12/.
 */
import componentsProps from './s12/components-props.mjs';
import hooks from './s12/hooks.mjs';
import events from './s12/events.mjs';
import contextGenerics from './s12/context-generics.mjs';
import lab from './s12/lab.mjs';
import quiz from './s12/quiz.mjs';

export default {
  title: 'Chapter 12 — Typing React|||Chương 12 — Gõ kiểu React',
  description: 'Gõ kiểu một UI React từ đầu đến cuối, nơi cùng các model của backend đi sang client. Một component là một hàm của props có kiểu (FC<Props>; đọc một prop không khai ⇒ TS2339, gọi thiếu một prop bắt buộc ⇒ TS2741). Hook là generic: useState suy ra state và gõ kiểu setter (sai kiểu ⇒ TS2345), một state nullable useState<T | null>(null) buộc nhánh "chưa tải xong" (đọc chưa kiểm ⇒ TS18047), và một ref có .current là T | null. Sự kiện có kiểu: e.target.value là một string (đọc e.value ⇒ TS2339, gán cho number ⇒ TS2322). Context có kiểu: createContext<T | null>(null) làm useContext trả về T | null (đọc chưa kiểm ⇒ TS18047), sửa bằng một hook gác; và component generic List<T> suy T từ props. Dùng mô hình kiểu tự-chứa đúng dáng @types/react (không JSX), đo thật tsc + Node. Rồi Lab 12: một BookingForm có kiểu — component + hook (any stub 3, hook any 7.5, seats optional 9.5, bản có kiểu 10).',
  lessons: [componentsProps, hooks, events, contextGenerics, lab, quiz],
};
