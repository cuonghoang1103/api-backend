/**
 * TypeScript — Chương 4: Object, interface & type alias (soạn lại TRỌN 01/11/2026 theo ./_HOP-DONG.md).
 * 4.1 dang-object · 4.2 interface-vs-type · 4.3 extends-intersection · 4.4 index-record (slug giữ) · Lab 4 (MỚI: typescript-4-6-lab-mo-hinh-du-lieu)
 * · Quiz Chương 4 (slug giữ typescript-4-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz (syncOrder: true).
 * Cả chương xoay quanh một ý: mô hình dữ liệu LabFlow (Lab, User, BookingRecord, BookingView, LAB_INFO) — Lab 4 ráp lại, lời giải ở
 * ./_labflow-ts/src/rules/model.ts. Code/output mỗi bài ở ./s04/_ma-<deck>.mjs — SINH TỰ ĐỘNG (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề). Bản cũ (một tệp) đã thay hẳn.
 */
import dangObject from './s04/dang-object.mjs';
import interfaceType from './s04/interface-type.mjs';
import extendsGiao from './s04/extends-giao.mjs';
import indexRecord from './s04/index-record.mjs';
import lab from './s04/lab.mjs';
import quiz from './s04/quiz.mjs';

export default {
  title: 'Chapter 4 — Objects, interfaces & type aliases|||Chương 4 — Object, interface & type alias',
  description: 'Mô hình dữ liệu LabFlow (phòng lab, người dùng, lượt đặt) viết bằng dáng object: thuộc tính bắt buộc, optional, readonly (kiểm thuộc tính thừa chỉ chạy với literal tươi, readonly chỉ là nông), interface hay type alias (interface trùng tên âm thầm gộp, chỉ type đặt tên được union), ghép kiểu bằng extends và & (xung đột thành never), từ điển bằng index signature và Record<LabCode, Lab> (noUncheckedIndexedAccess, Object.keys, đếm giữ số không) — rồi Lab 4 viết lại một mô hình biên dịch 0 lỗi mà chỉ được 4.5/10, có máy chấm chạy thật.',
  lessons: [dangObject, interfaceType, extendsGiao, indexRecord, lab, quiz],
};
