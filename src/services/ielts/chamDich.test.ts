import { test } from 'node:test';
import assert from 'node:assert/strict';
import { docKetQua } from './chamDich.service.js';

test('docKetQua: JSON trần', () => {
  assert.deepEqual(docKetQua('{"dung": true, "nhanXet": "Đúng rồi.", "cauSua": ""}'), { dung: true, nhanXet: 'Đúng rồi.' });
});

test('docKetQua: bọc ```json và chữ thừa', () => {
  const r = docKetQua('Đây:\n```json\n{"dung": false, "nhanXet": "Thiếu **a**.", "cauSua": "I\'m a student."}\n```');
  assert.equal(r?.dung, false);
  assert.equal(r?.cauSua, "I'm a student.");
});

test('docKetQua: thiếu dung / hỏng ⇒ null', () => {
  assert.equal(docKetQua('{"nhanXet": "x"}'), null);
  assert.equal(docKetQua('không có json'), null);
  assert.equal(docKetQua('{dung: true'), null);
});
