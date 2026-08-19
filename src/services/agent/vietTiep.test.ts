/**
 * Phép kiểm dựa trên ĐO THẬT, không dựa trên tưởng tượng: các cặp chuỗi ở
 * `ca thật` dưới đây lấy nguyên văn từ hai lời gọi cổng modelapi ngày
 * 19/08/2026 (xem chú thích đầu `vietTiep.ts`).
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { gopVietTiep } from './vietTiep.js';

test('ca THẬT: model viết lại mục đang dở', () => {
  // Lượt 1 dừng giữa mục "7"; lượt 2 viết lại cả mục đó.
  const a = '1 - một\n2 - hai\n3 - ba\n4 - bốn\n5 - năm\n6 - sáu\n7 ';
  const b = '7 - bảy\n8 - tám\n9 - chín';
  const ra = gopVietTiep(a, b);
  assert.equal(ra, '1 - một\n2 - hai\n3 - ba\n4 - bốn\n5 - năm\n6 - sáu\n7 - bảy\n8 - tám\n9 - chín');
  // Nối thẳng sẽ ra "…\n7 7 - bảy" — đúng lỗi mà file này tồn tại để tránh.
  assert.ok(!ra.includes('7 7'));
});

test('ca THẬT: cụt giữa câu trong khối mã', () => {
  const a = '```\nPython - Ngôn ngữ đa năng,';
  const b = ' Ngôn ngữ đa năng, dễ học\nJava - …';
  assert.equal(gopVietTiep(a, b), '```\nPython - Ngôn ngữ đa năng, dễ học\nJava - …');
});

test('không chồng lấn thì nối thẳng', () => {
  assert.equal(gopVietTiep('phần một.', ' phần hai.'), 'phần một. phần hai.');
});

test('lấy đoạn chồng lấn DÀI NHẤT, không phải ngắn nhất', () => {
  // "abcabc" + "abcxyz": hậu tố "abc" khớp tiền tố "abc" (dài 3), nhưng "c"
  // cũng khớp (dài 1). Dò từ ngắn lên sẽ ăn nhầm "c" và để lại "abcabcbcxyz".
  assert.equal(gopVietTiep('abcabc', 'abcxyz'), 'abcabcxyz');
});

test('chuỗi rỗng không làm hỏng gì', () => {
  assert.equal(gopVietTiep('', 'xyz'), 'xyz');
  assert.equal(gopVietTiep('xyz', ''), 'xyz');
  assert.equal(gopVietTiep('', ''), '');
});

test('model viết lại TRỌN phần cũ thì không nhân đôi', () => {
  const a = 'Tổng quan dự án.';
  const b = 'Tổng quan dự án. Phần tiếp theo.';
  assert.equal(gopVietTiep(a, b), 'Tổng quan dự án. Phần tiếp theo.');
});

test('không dò chồng lấn quá xa — đoạn trùng dài là model viết LẠI, phải giữ cả hai', () => {
  // 300 ký tự giống nhau vượt trần 200 ⇒ không gộp, để người đọc thấy model
  // đang lặp thay vì ta âm thầm giấu đi.
  const dai = 'x'.repeat(300);
  assert.equal(gopVietTiep(dai, dai).length, 600 - 200);
});
