/**
 * Kiểm bộ tách từ khoá — chỗ dễ hỏng nhất của trợ lý.
 *
 * Sai ở đây thì trợ lý im lặng trả "không tìm thấy ghi chú nào" cho những câu
 * hỏi hoàn toàn hợp lệ, và không có lỗi nào để lần ra.
 *
 *   npx tsx --test src/services/noteAssistant.test.ts
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { tachTuKhoa } from './noteAssistant.service.js';

test('bỏ hư từ, giữ từ mang nghĩa', () => {
  const t = tachTuKhoa('tuần trước tôi có ghi gì về Prisma không');
  assert.deepEqual(t, ['prisma']);
});

test('bỏ dấu để "duong" tìm ra "đường"', () => {
  assert.ok(tachTuKhoa('ghi chú về Đường ống dữ liệu').includes('duong'));
});

test('câu hỏi TOÀN hư từ vẫn trả về từ, không trả mảng rỗng', () => {
  // Mảng rỗng sẽ thành mệnh đề OR rỗng ⇒ khớp MỌI ghi chú, tệ hơn hẳn.
  const t = tachTuKhoa('hôm nay có gì không');
  assert.ok(t.length > 0, 'không được rỗng');
});

test('giữ số — "PRO192" và "2026" là từ khoá thật', () => {
  const t = tachTuKhoa('điểm PRO192 kỳ 2026 thế nào');
  assert.ok(t.includes('pro192'));
  assert.ok(t.includes('2026'));
});

test('cắt trần 8 từ để câu dài không dựng truy vấn khổng lồ', () => {
  const t = tachTuKhoa('alpha beta gamma delta epsilon zeta eta theta iota kappa lambda');
  assert.equal(t.length, 8);
});

test('bỏ ký tự một chữ cái — nhiễu chứ không phải từ khoá', () => {
  assert.ok(!tachTuKhoa('a b prisma').includes('a'));
});
