/**
 * TypeScript — Chương 11: Backend Node/Express (soạn lại TRỌN 04/11/2026 theo ./_HOP-DONG.md, thay placeholder cũ một tệp).
 * 11.1 express-handlers · 11.2 typed-responses · 11.3 api-envelope-errors · 11.4 services-and-config (slug giữ) · Lab 11 (MỚI: typescript-11-6-lab-handler-co-kieu)
 * · Quiz Chương 11 (slug giữ typescript-11-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz.
 * ⚠ KHÔNG cài @types/express — dùng mô hình kiểu tự-chứa (Req/Res/Handler, ApiResult) đúng dáng @types/express, đo thật bằng tsc + Node với @types/node.
 * Code/output mỗi bài ở ./s11/_ma-<deck>.mjs — SINH TỰ ĐỘNG. Lab 11 ở ./_labflow-ts/lab11/.
 */
import expressHandlers from './s11/express-handlers.mjs';
import typedResponses from './s11/typed-responses.mjs';
import apiEnvelopeErrors from './s11/api-envelope-errors.mjs';
import servicesAndConfig from './s11/services-and-config.mjs';
import lab from './s11/lab.mjs';
import quiz from './s11/quiz.mjs';

export default {
  title: 'Chapter 11 — Typing a Node/Express backend|||Chương 11 — Gõ kiểu backend Node/Express',
  description: 'Gõ kiểu một backend từ đầu đến cuối. Một handler là một hàm của một request và response có kiểu (Handler<P,Q,B,T> — params/query/body/response; đọc một param route không khai ⇒ TS2339). Một response có kiểu: res.json kiểm dáng (sai kiểu ⇒ TS2322, thiếu trường ⇒ TS2741). Một envelope kết quả API (ApiResult<T> = ok với data | error có kiểu — discriminated union của Chương 5; đọc data không kiểm ok ⇒ TS2339) buộc xử lý lỗi. Và một tầng config (readonly, dựng một lần ⇒ gán lại là TS2540) và service (kiểu trả về trung thực — T | undefined). Dùng mô hình kiểu tự-chứa đúng dáng @types/express, đo thật tsc + Node. Rồi Lab 11: viết handler POST /bookings có kiểu với body đã kiểm và envelope lỗi (any stub 4.5, Booking any 8, purpose optional 9.5, tham khảo 10).',
  lessons: [expressHandlers, typedResponses, apiEnvelopeErrors, servicesAndConfig, lab, quiz],
};
