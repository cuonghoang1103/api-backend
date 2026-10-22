import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ngonNguCauHoi } from './ai.service.js';

// 22/10/2026: người duyệt App Store hỏi tiếng Anh mà CuongMini trả lời tiếng Việt — ngôn ngữ câu hỏi đoán bằng mã.
test('ngôn ngữ câu hỏi: có dấu ⇒ vi; tiếng Việt không dấu ⇒ vi; tiếng Anh ⇒ en; chỉ mã thẻ/1 từ ⇒ null', () => {
  assert.equal(ngonNguCauHoi('What should I work on today?'), 'en');
  assert.equal(ngonNguCauHoi('Explain DEMO-4 step by step'), 'en');
  assert.equal(ngonNguCauHoi('what is the bug in LAB-3'), 'en');
  assert.equal(ngonNguCauHoi('Hôm nay tôi nên làm gì?'), 'vi');
  assert.equal(ngonNguCauHoi('hom nay toi lam gi'), 'vi');
  assert.equal(ngonNguCauHoi('giai thich DEMO-4 giup minh'), 'vi');
  assert.equal(ngonNguCauHoi('DEMO-12'), null);
  assert.equal(ngonNguCauHoi('ok'), null);
  assert.equal(ngonNguCauHoi(''), null);
});
