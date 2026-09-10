/**
 * ============================================================
 * BỘ QUY TẮC CỦA THẦY — CHỐT NỘI DUNG
 * ============================================================
 *
 * Phép kiểm này sinh ra từ một lỗi ĐO ĐƯỢC, không phải từ lo xa. Bài giảng AI
 * soạn cho J1.S.P0001 (bubble sort) viết: "Không cần bo vì không có quy tắc
 * nghiệp vụ phức tạp" — trong khi lời giải mẫu đã verify của đúng đề đó là BA
 * tệp CÓ bo (bo/ArraySorter.java giữ generate() và bubbleSort()). Model có
 * quy tắc đúng trong tay và vẫn kết luận ngược: nó vơ con số "0,9 thao tác"
 * — vốn chỉ nói về `controller` — rồi áp sang cả `bo`.
 *
 * Nên chốt ở đây kiểm THỨ THẬT SỰ ĐƯỢC GỬI ĐI (`heThong()`), không kiểm một
 * hằng số rời. Ai viết lại mục "các tầng" mà đánh rơi lời cảnh báo hoặc ca
 * P0001 thì đỏ ngay, thay vì lộ ra sáu tháng sau bằng một bài bị trừ điểm.
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

test('con số 4,8 / 0,9 phải nói rõ là của controller, KHÔNG phải của bo', () => {
  const s = heThong();
  assert.match(s, /GOVERN controller ONLY/,
    'mất lời cảnh báo — model sẽ lại đọc "0.9" thành "không cần bo"');
  assert.match(s, /J1\.S\.P0001/,
    'mất ca đối chứng P0001, thứ duy nhất làm lời cảnh báo có sức nặng');
  assert.match(s, /ArraySorter/,
    'mất tên lớp bo thật của P0001 — nói suông thì model không tin');
  assert.match(s, /SEPARATELY/,
    'mất câu bắt chạy phép thử trách nhiệm riêng cho bo và cho controller');
});

test('những quy tắc không được phép biến mất', () => {
  const s = heThong();
  for (const [ten, mau] of [
    ['bo không bao giờ in', /NEVER prints/],
    ['đọc/ghi tệp thuộc bo', /READING AND WRITING THE DATA FILE BELONGS IN bo/],
    ['Serializable đo trên 54 bài', /NOT ONE does/],
    ['tên phương thức khớp đề từng chữ', /checked by name/],
    ['thuật toán cũng sinh ra bo', /algorithm worth keeping/],
  ] as const) {
    assert.match(s, mau, `mất quy tắc: ${ten}`);
  }
});

test('ngân hàng vấn đáp đi kèm khi chấm, và nó hỏi về MÃ CỦA HỌ', () => {
  assert.ok(NGAN_HANG_VAN_DAP.length > 500);
  const s = heThong(NGAN_HANG_VAN_DAP);
  assert.ok(s.includes(NGAN_HANG_VAN_DAP.slice(0, 60)));
});
