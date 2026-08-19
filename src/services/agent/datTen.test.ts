/**
 * Model hay kèm rác quanh cái tên dù đã dặn kỹ — dấu ngoặc kép, dấu chấm,
 * câu dẫn "Tên việc: …", hoặc cả một đoạn. Lời dặn đúng 90% lần, và 10% còn
 * lại hiện thẳng lên thanh bên của người dùng.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { donDep } from './datTen.js';

test('bỏ dấu ngoặc kép và dấu chấm cuối', () => {
  assert.equal(donDep('"App iOS cho dự án hiện tại."'), 'App iOS cho dự án hiện tại');
  assert.equal(donDep('“Robot ESP32 kết nối WiFi”'), 'Robot ESP32 kết nối WiFi');
});

test('bỏ câu dẫn model tự thêm', () => {
  assert.equal(donDep('Tên việc: Trả 403 thay vì 500'), 'Trả 403 thay vì 500');
  assert.equal(donDep('Title: Feed profile avatars'), 'Feed profile avatars');
});

test('chỉ lấy DÒNG ĐẦU — model đôi khi giải thích thêm ở dưới', () => {
  assert.equal(donDep('App iOS cho dự án\n\nGiải thích: vì người dùng hỏi về...'), 'App iOS cho dự án');
});

test('model trả cả đoạn ⇒ từ chối, giữ tên cũ còn hơn hiện một đoạn văn', () => {
  assert.equal(donDep('a'.repeat(80)), null);
});

test('rỗng hoặc quá ngắn ⇒ null', () => {
  assert.equal(donDep(''), null);
  assert.equal(donDep('ok'), null);
});
