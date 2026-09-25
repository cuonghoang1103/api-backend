/**
 * parseJson khoan dung — sinh ra từ lỗi thật 25/09/2026: trợ lý CT Work trả lời
 * xong (~1.600 token) nhưng đuôi JSON hỏng, người dùng nhận "could not read".
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { z } from 'zod';
import { parseJson } from './ai.service.js';

const S = z.object({ reply: z.string(), actions: z.unknown().optional() });

test('JSON chuẩn (có rào ```json) vẫn đọc như cũ', () => {
  assert.deepEqual(parseJson('```json\n{"reply":"Chào","actions":[]}\n```', S), { reply: 'Chào', actions: [] });
});

test('đuôi cụt: thiếu } và thừa dấu phẩy sau reply', () => {
  const r = parseJson('{\n  "reply": "Bắt đầu từ **charter** — nó định hướng 20 tuần.\\nCần outline không?",', S);
  assert.equal(r.reply, 'Bắt đầu từ **charter** — nó định hướng 20 tuần.\nCần outline không?');
});

test('chuỗi reply bị cắt giữa chừng (chạm trần token) — vẫn giữ phần đã viết', () => {
  const r = parseJson('{"reply":"Ngày 1: tạo repo, viết charter, cài toolchain. Tiếp theo', S);
  assert.match(r.reply, /^Ngày 1: tạo repo/);
});

test('actions hỏng không làm mất câu trả lời', () => {
  const r = parseJson('{"reply":"Ok nhé","actions":[{"type":"create_issue","title":"Spike"', S);
  assert.equal(r.reply, 'Ok nhé');
});

test('model trả chữ thường không có JSON ⇒ chính chữ đó là câu trả lời', () => {
  assert.equal(parseJson('Được rồi, bắt đầu ngày 1 nhé!', S).reply, 'Được rồi, bắt đầu ngày 1 nhé!');
});

test('trường khác tên (report) cũng cứu được', () => {
  assert.equal(parseJson('{"report":"Tuần 1 xong 5/6 việc",', z.object({ report: z.string() })).report, 'Tuần 1 xong 5/6 việc');
});

test('không còn gì để hiển thị ⇒ vẫn báo lỗi', () => {
  assert.throws(() => parseJson('{"actions":[]}', S), /could not read/);
});
