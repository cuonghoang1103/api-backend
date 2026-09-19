/**
 * Quy đổi band — phép tính duy nhất trong mảng IELTS mà người học TIN.
 *
 * Bảng quy đổi là thang 40 câu, còn đề thử thường ít câu hơn (kho nội dung
 * có 10 câu mỗi bài đọc, một đề ba bài ra 30). Tra thẳng bảng với 30 câu thì
 * làm đúng HẾT cũng chỉ ra band 7 — sai, và sai theo đúng hướng làm người
 * học tưởng mình kém hơn thực tế rồi bỏ cuộc.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quyDoiBand } from './deThi.service.js';

test('đề đủ 40 câu: tra đúng bảng chính thức', () => {
  assert.equal(quyDoiBand(40, 40, 'doc'), 9);
  assert.equal(quyDoiBand(30, 40, 'doc'), 7);
  assert.equal(quyDoiBand(23, 40, 'doc'), 6);
  assert.equal(quyDoiBand(30, 40, 'nghe'), 7);
  assert.equal(quyDoiBand(23, 40, 'nghe'), 6);
});

test('đề 30 câu: chuẩn hoá về 40 rồi mới tra — làm đúng hết là band 9', () => {
  assert.equal(quyDoiBand(30, 30, 'doc'), 9, 'đúng hết phải ra 9, không phải 7');
  // 23/30 ≈ 77% → 31/40 → band 7
  assert.equal(quyDoiBand(23, 30, 'doc'), 7);
});

test('không chia cho 0, không trả về số vô nghĩa', () => {
  assert.equal(quyDoiBand(0, 0, 'doc'), 0);
  assert.equal(quyDoiBand(0, 30, 'doc'), 2);
});
