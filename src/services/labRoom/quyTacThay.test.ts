/**
 * ============================================================
 * BỘ QUY TẮC CỦA THẦY — CHỐT NỘI DUNG
 * ============================================================
 *
 * Phép kiểm này sinh ra từ những lỗi ĐO ĐƯỢC, không phải từ lo xa:
 *
 *   • Bài giảng AI soạn cho J1.S.P0001 (bubble sort) viết "không cần tầng
 *     nghiệp vụ" — trong khi thuật toán do đề bắt tự viết chính là thứ phải
 *     nằm trong `service`. Model có quy tắc đúng trong tay vẫn kết luận ngược.
 *   • Trợ giảng bài J1.S.P0055 bày ra "src/ └── (default package hoặc
 *     doctormanagement/)" và chốt "chỉ 73 LOC nên controller sẽ thành empty
 *     wrapper" — quyết định tầng bằng SỐ DÒNG, đúng thứ quy tắc cấm.
 *
 * 15/09/2026 người học hỏi lại thầy: chia đủ package như `Guide.xlsx` MỚI là
 * đúng Design Pattern và SOLID. Nên chốt ở đây kiểm THỨ THẬT SỰ ĐƯỢC GỬI ĐI
 * (`heThong()`): ai viết lại mục "các tầng" mà đánh rơi chín package, luật
 * Scanner, hay ranh giới "pattern GoF tuỳ bài" thì đỏ ngay.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { heThong, QUY_TAC_LOI, NGAN_HANG_VAN_DAP } from './quyTacThay.js';

test('lời nhắc gửi cho model luôn mang đủ ba phần', () => {
  const s = heThong();
  assert.ok(s.includes(QUY_TAC_LOI.slice(0, 80)), 'thiếu bộ quy tắc');
  assert.ok(s.length > 10_000, `quá ngắn (${s.length}) — nhiều khả năng một phần bị rơi`);
  // Phần thêm vào phải nằm SAU quy tắc, không được thay chỗ nó.
  const them = 'NHIEM VU GIA LAP DE KIEM THU';
  assert.ok(heThong(them).includes(them));
  assert.ok(heThong(them).includes(QUY_TAC_LOI.slice(0, 80)));
});

test('chín package của Guide.xlsx phải có đủ, không được rơi cái nào', () => {
  const s = heThong();
  for (const goi of ['constants/', 'model/', 'dto/', 'repository/', 'service/',
    'controller/', 'view/', 'utils/', 'main/']) {
    assert.ok(s.includes(goi), `mất package ${goi} trong mục các tầng`);
  }
  assert.match(s, /NINE PACKAGES OF Guide\.xlsx/, 'mất tiêu đề mục các tầng');
});

test('cấm quyết định tầng theo SỐ DÒNG, và cấm gói phẳng', () => {
  const s = heThong();
  assert.match(s, /DOES NOT DEPEND ON SIZE/,
    'mất câu "cấu trúc không phụ thuộc kích thước bài"');
  assert.match(s, /never by line count/,
    'mất lệnh cấm quyết định tầng theo số dòng');
  assert.match(s, /MISSING controller is what\s+loses the mark/,
    'mất câu chặn lời khuyên "bài 40 dòng thì bỏ controller"');
  assert.match(s, /NEVER a flat package/, 'mất lệnh cấm gói phẳng');
  assert.match(s, /J1\.S\.P0055/, 'mất ca đối chứng P0055 — nói suông thì model không đổi hành vi');
});

test('những quy tắc kiến trúc không được phép biến mất', () => {
  const s = heThong();
  for (const [ten, mau] of [
    ['view là nơi duy nhất in cùng main', /ONLY place besides main that is allowed to print/],
    ['controller không import model', /must not\s+import model/],
    ['Scanner chỉ ở main, là biến cục bộ', /created HERE\s+and only here, as a LOCAL variable/],
    ['không được để Scanner trong utils', /never one in utils/],
    ['đọc dòng NGOÀI try, tránh lặp vô hạn khi hết input', /spins for ever/],
    ['đọc/ghi tệp thuộc repository', /DATA FILE BELONGS IN repository/],
    ['thuật toán do đề bắt viết tay nằm ở service', /SortService/],
    ['ca đối chứng P0001', /J1\.S\.P0001/],
    ['tên phương thức khớp đề từng chữ', /checked by name/],
  ] as const) {
    assert.match(s, mau, `mất quy tắc: ${ten}`);
  }
});

test('SOLID và Design Pattern: CÓ chấm, nhưng bài nhỏ không nhét lớp pattern', () => {
  const s = heThong();
  assert.match(s, /GRADED IN THIS COURSE/,
    'mất việc SOLID/DP được chấm — model sẽ lại khuyên bỏ pattern');
  assert.match(s, /earns LOC/, 'mất câu "hiểu SOLID được cộng LOC" của thầy');
  assert.match(s, /60 lines or less do NOT add an interface/,
    'mất ranh giới: bài nhỏ không thêm lớp pattern cho có');
  assert.match(s, /WHERE Strategy would\s+plug in/,
    'mất câu trả lời mẫu khi thầy hỏi "Strategy đâu"');
});

test('luật comment của thầy nằm trong bộ quy tắc', () => {
  const s = heThong();
  assert.match(s, /ONE-LINE \/\/ comment above every method/, 'mất luật comment từng hàm');
  assert.match(s, /No\s+comments, no review/, 'mất cửa từ chối review vì thiếu comment');
});

test('ngân hàng vấn đáp đi kèm khi chấm, và nó hỏi về MÃ CỦA HỌ', () => {
  assert.ok(NGAN_HANG_VAN_DAP.length > 500);
  const s = heThong(NGAN_HANG_VAN_DAP);
  assert.ok(s.includes(NGAN_HANG_VAN_DAP.slice(0, 60)));
});

test('luật chấm: cắt digest thì KHÔNG được cho đạt, và CẤM lộ lời giải mẫu', async () => {
  // Hai luật này vừa được thêm vì hai rủi ro thật:
  //   • bản đầu `slice()` mù rồi vứt cờ `truncated` ⇒ grader chấm nửa project
  //     mà tưởng đủ và trả về "đạt";
  //   • đưa lời giải mẫu vào để làm THƯỚC ĐO thì cũng mở đúng một cửa: model
  //     chép nó ra cho người học. Mất luật này là mất luôn ý nghĩa việc học.
  const { NHIEM_VU_CHAM } = await import('./phongLab.service.js');
  assert.match(NHIEM_VU_CHAM, /TRUNCATED[\s\S]*?"dat" MUST be false/,
    'mất luật "digest bị cắt thì không được cho đạt"');
  assert.match(NHIEM_VU_CHAM, /NEVER reproduce, quote or paraphrase the reference solution/,
    'mất luật cấm lộ lời giải mẫu — grader sẽ phát đáp án cho người học');
  assert.match(NHIEM_VU_CHAM, /NOT the only correct answer/,
    'mất câu chống chấm máy móc theo lời giải mẫu');
});
