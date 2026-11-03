/**
 * TypeScript — Chương 16: Kiến trúc & tư duy type-driven (soạn lại TRỌN 04/11/2026 theo ./_HOP-DONG.md, thay placeholder cũ một tệp). CHƯƠNG CUỐI.
 * 16.1 illegal-states · 16.2 any-unknown-never · 16.3 organizing-types · 16.4 whole-picture (slug giữ) · DỰ ÁN CUỐI KHOÁ (MỚI: typescript-16-6-du-an-cuoi-khoa)
 * · Kiểm tra cuối khoá (slug giữ typescript-16-5-quiz, → 10 câu trải cả khoá). Dự án đứng TRƯỚC quiz.
 * ⚠ Native TS, đo thật tsc 7.0.2 + Node 22.23.3. Dự án cuối khoá = máy chấm `cham-du-an.mjs` (tsc + 60 test + 6 lab tiêu biểu = 100 điểm; tham khảo 100/100).
 * Code/output mỗi bài ở ./s16/_ma-<deck>.mjs — SINH TỰ ĐỘNG. Máy chấm dự án ở ./_labflow-ts/scripts/cham-du-an.mjs.
 */
import illegalStates from './s16/illegal-states.mjs';
import anyUnknownNever from './s16/any-unknown-never.mjs';
import organizingTypes from './s16/organizing-types.mjs';
import wholePicture from './s16/whole-picture.mjs';
import duAn from './s16/du-an-cuoi-khoa.mjs';
import quiz from './s16/quiz.mjs';

export default {
  title: 'Chapter 16 — Architecture & type-driven design|||Chương 16 — Kiến trúc & tư duy type-driven',
  description: 'Chương cuối: để trình biên dịch giữ các bất biến. Tư duy type-driven nắn các kiểu để một giá trị sai không tồn tại được — một branded type cho một string đã validate (một cái thường ⇒ TS2345), một discriminated union để chỉ một trạng thái biểu diễn được (một trường sai ⇒ TS2339). Ba kiểu đặc biệt: any tắt kiểm (một lời gọi sai sập lúc chạy), unknown là top type an toàn (đọc chưa thu hẹp ⇒ TS18046), never là kiểu rỗng (assertNever bắt một case chưa xử lý ⇒ TS2345). Tổ chức kiểu: type là một định nghĩa duy nhất (khai lại ⇒ TS2300), interface gộp (cơ chế augmentation); một kiểu một nguồn, re-export qua barrel. Bức tranh toàn cảnh: mọi thói quen ghép vào một kiến trúc — lõi đáng tin sau các rìa đã validate. Rồi DỰ ÁN CUỐI KHOÁ: lắp LabFlow TS full-stack (rules→model→state machine→generics→DTO→CI→API→React→Zod/Prisma→service→build→branded) và chấm 100 điểm (cham-du-an.mjs: typecheck 20 + 60 test 20 + 6 lab 60; tham khảo 100/100 DISTINCTION), kể theo STAR cho CV. Đo thật tsc + Node.',
  lessons: [illegalStates, anyUnknownNever, organizingTypes, wholePicture, duAn, quiz],
};
