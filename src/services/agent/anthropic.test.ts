/**
 * Luật của Anthropic mà OpenAI không có, và mỗi cái vi phạm đều cho 400 với
 * một câu chẳng nói rõ vì sao ("Error from Anthropic Server please try again
 * later or create a new conversation"). Nên chúng phải có phép kiểm.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { sangAnthropic, stopSangFinish, toolSangAnthropic } from './anthropic.js';

const goiTool = (id: string, ten: string, args = '{}') =>
  ({ role: 'assistant' as const, content: null, tool_calls: [{ id, function: { name: ten, arguments: args } }] });

test('system tách ra THAM SỐ RIÊNG, không nằm trong messages', () => {
  const r = sangAnthropic([
    { role: 'system', content: 'Bạn là trợ lý.' },
    { role: 'user', content: 'chào' },
  ]);
  assert.equal(r.system, 'Bạn là trợ lý.');
  assert.equal(r.messages.length, 1);
  assert.equal(r.messages[0]!.role, 'user');
});

test('NHIỀU kết quả tool gộp vào MỘT tin user — đây là chỗ 400 hay xảy ra', () => {
  const r = sangAnthropic([
    { role: 'user', content: 'đọc ba file' },
    { role: 'assistant', content: null, tool_calls: [
      { id: 'a', function: { name: 'doc', arguments: '{"p":"1"}' } },
      { id: 'b', function: { name: 'doc', arguments: '{"p":"2"}' } },
      { id: 'c', function: { name: 'doc', arguments: '{"p":"3"}' } },
    ] },
    { role: 'tool', tool_call_id: 'a', content: 'A' },
    { role: 'tool', tool_call_id: 'b', content: 'B' },
    { role: 'tool', tool_call_id: 'c', content: 'C' },
  ]);
  const vai = r.messages.map((m) => m.role);
  assert.deepEqual(vai, ['user', 'assistant', 'user'], `vai không luân phiên: ${vai.join(',')}`);
  const cuoi = r.messages[2]!.content as any[];
  assert.equal(cuoi.length, 3, 'ba kết quả tool phải nằm trong MỘT tin');
  assert.equal(cuoi[0].type, 'tool_result');
});

test('vai LUÔN luân phiên, kể cả khi có hai assistant liền nhau (prefill)', () => {
  const r = sangAnthropic([
    { role: 'user', content: 'hỏi' },
    { role: 'assistant', content: 'phần một' },
    { role: 'assistant', content: 'phần hai' },
  ]);
  assert.deepEqual(r.messages.map((m) => m.role), ['user', 'assistant']);
});

test('assistant vừa có chữ vừa gọi tool ⇒ hai khối, đúng thứ tự', () => {
  const r = sangAnthropic([
    { role: 'user', content: 'x' },
    { role: 'assistant', content: 'Để tôi đọc file.', tool_calls: [{ id: 'a', function: { name: 'doc', arguments: '{}' } }] },
  ]);
  const k = r.messages[1]!.content as any[];
  assert.equal(k[0].type, 'text');
  assert.equal(k[1].type, 'tool_use');
  assert.equal(k[1].id, 'a');
});

test('kết quả tool RỖNG không được gửi chuỗi rỗng — Anthropic từ chối', () => {
  const r = sangAnthropic([
    { role: 'user', content: 'x' },
    goiTool('a', 'doc'),
    { role: 'tool', tool_call_id: 'a', content: '' },
  ]);
  const k = r.messages[2]!.content as any[];
  assert.ok(k[0].content.length > 0, 'nội dung tool_result rỗng');
});

test('`arguments` hỏng JSON không làm ném — trả object rỗng', () => {
  const r = sangAnthropic([
    { role: 'user', content: 'x' },
    goiTool('a', 'doc', '{khong-phai-json'),
  ]);
  assert.deepEqual((r.messages[1]!.content as any[])[0].input, {});
});

test('ảnh trong tin user giữ nguyên khối image', () => {
  const r = sangAnthropic([
    { role: 'user', content: [
      { type: 'text', text: 'ảnh này là gì' },
      { type: 'image', source: { type: 'base64', media_type: 'image/png', data: 'AAA' } },
    ] },
  ]);
  const k = r.messages[0]!.content as any[];
  assert.equal(k[1].type, 'image');
  assert.equal(k[1].source.media_type, 'image/png');
});

test('tool OpenAI → Anthropic: `parameters` thành `input_schema`', () => {
  const r = toolSangAnthropic([{ type: 'function', function: {
    name: 'doc_file', description: 'Đọc file', parameters: { type: 'object', properties: { p: { type: 'string' } } } } }]);
  assert.equal(r[0]!.name, 'doc_file');
  assert.deepEqual(r[0]!.input_schema, { type: 'object', properties: { p: { type: 'string' } } });
});

test('stop_reason dịch đúng — `max_tokens` phải thành `length` để bật viết tiếp', () => {
  assert.equal(stopSangFinish('tool_use'), 'tool_calls');
  assert.equal(stopSangFinish('max_tokens'), 'length');
  assert.equal(stopSangFinish('end_turn'), 'stop');
  assert.equal(stopSangFinish(null), null);
});

// ── Ảnh kèm kết quả tool (`web_anh`) ──────────────────────
test('ảnh kèm kết quả tool thành khối image trong tool_result', () => {
  const r = sangAnthropic([
    { role: 'user', content: 'trang trông thế nào' },
    { role: 'assistant', content: null, tool_calls: [{ id: 'a', function: { name: 'web_anh', arguments: '{}' } }] },
    { role: 'tool', tool_call_id: 'a', content: 'Ảnh chụp localhost:3000',
      anh: [{ media_type: 'image/png', data: 'AAAA' }] },
  ]);
  // Ảnh phải là khối ANH EM, KHÔNG nằm trong `tool_result` — đo thật cho
  // thấy cổng lọc bỏ phần bên trong (xem chú thích ở `anthropic.ts`).
  const kh = r.messages[2]!.content as any[];
  assert.equal(kh[0].type, 'tool_result');
  assert.equal(typeof kh[0].content, 'string', 'ảnh bị nhét VÀO tool_result — cổng sẽ lọc mất');
  assert.equal(kh[1].type, 'image');
  assert.equal(kh[1].source.media_type, 'image/png');
  assert.equal(kh[1].source.data, 'AAAA');
});

test('không có ảnh thì content vẫn là CHUỖI — đừng bọc mảng vô cớ', () => {
  const r = sangAnthropic([
    { role: 'user', content: 'x' },
    { role: 'assistant', content: null, tool_calls: [{ id: 'a', function: { name: 'read_file', arguments: '{}' } }] },
    { role: 'tool', tool_call_id: 'a', content: 'nội dung file' },
  ]);
  const kh = r.messages[2]!.content as any[];
  assert.equal(typeof kh[0].content, 'string');
  assert.equal(kh.length, 1, 'không có ảnh thì đừng đẩy thêm khối nào');
});
