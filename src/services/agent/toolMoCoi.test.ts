/** Vá tool_use / tool_result mồ côi trước khi gửi Anthropic (19/10/2026 — Opus 5.5 chính hãng trả 400). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sangAnthropic, vaToolMoCoi, KET_QUA_GIAN_DOAN } from './anthropic.js';

const tc = (id: string) => ({ id, type: 'function' as const, function: { name: 'read_file', arguments: '{"path":"a.ts"}' } });

test('tool_use thiếu kết quả (lượt bị đứt) ⇒ chèn tool_result "gián đoạn" ở tin user kế tiếp', () => {
  const { messages } = sangAnthropic([
    { role: 'user', content: 'làm đi' },
    { role: 'assistant', content: '', tool_calls: [tc('t1'), tc('t2')] },
    { role: 'tool', tool_call_id: 't1', content: 'ok' },
    { role: 'user', content: 'tiếp tục' },
  ] as never);
  const sau = messages[2]!;
  assert.equal(sau.role, 'user');
  const k = sau.content as Array<{ type: string; tool_use_id?: string; content?: string }>;
  const kq = k.filter((x) => x.type === 'tool_result').map((x) => x.tool_use_id).sort();
  assert.deepEqual(kq, ['t1', 't2']);
  assert.equal(k.find((x) => x.tool_use_id === 't2')!.content, KET_QUA_GIAN_DOAN);
  assert.equal(k[0]!.type, 'tool_result', 'tool_result phải đứng đầu tin user');
});

test('tool_use ở CUỐI hội thoại không có tin sau ⇒ thêm tin user chứa tool_result', () => {
  const { messages } = sangAnthropic([
    { role: 'user', content: 'x' },
    { role: 'assistant', content: 'đọc file', tool_calls: [tc('a')] },
  ] as never);
  assert.equal(messages.at(-1)!.role, 'user');
  assert.equal((messages.at(-1)!.content as Array<{ tool_use_id: string }>)[0]!.tool_use_id, 'a');
});

test('tool_result không có tool_use ngay trước ⇒ bỏ', () => {
  const ra = vaToolMoCoi([
    { role: 'user', content: [{ type: 'text', text: 'hi' }] },
    { role: 'assistant', content: [{ type: 'text', text: 'chào' }] },
    { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'ma', content: 'x' }, { type: 'text', text: 'tiếp' }] },
  ] as never);
  const k = ra[2]!.content as Array<{ type: string }>;
  assert.ok(!k.some((x) => x.type === 'tool_result'));
  assert.ok(k.some((x) => x.type === 'text'));
});

test('hội thoại lành giữ nguyên', () => {
  const { messages } = sangAnthropic([
    { role: 'user', content: 'x' },
    { role: 'assistant', content: '', tool_calls: [tc('q')] },
    { role: 'tool', tool_call_id: 'q', content: 'kq' },
  ] as never);
  assert.equal(messages.length, 3);
  assert.equal((messages[2]!.content as Array<{ content: string }>)[0]!.content, 'kq');
});

import { vaToolCallMoCoi, KET_QUA_TOOL_GIAN_DOAN } from './catCu.js';

test('OpenAI: assistant tool_calls thiếu tin tool ⇒ chèn "gián đoạn"; tin tool mồ côi ⇒ bỏ', () => {
  const ra = vaToolCallMoCoi([
    { role: 'user', content: 'x' },
    { role: 'assistant', content: '', tool_calls: [tc('a'), tc('b')] },
    { role: 'tool', tool_call_id: 'a', content: 'ok' },
    { role: 'user', content: 'tiếp' },
    { role: 'tool', tool_call_id: 'lac', content: 'mồ côi' },
  ] as never);
  const tools = ra.filter((m) => m.role === 'tool') as Array<{ tool_call_id: string; content: string }>;
  assert.deepEqual(tools.map((t) => t.tool_call_id), ['a', 'b']);
  assert.equal(tools[1]!.content, KET_QUA_TOOL_GIAN_DOAN);
  assert.equal(ra[3]!.role, 'tool', 'tin tool chèn ngay sau kết quả có sẵn, trước tin user');
});
