/**
 * Cổng dự phòng: dịch Anthropic Messages ⇄ OpenAI Chat (16/10/2026).
 *
 * Lý do tồn tại: modelapi nhận định dạng Anthropic với gpt-6-sol nhưng LẶNG
 * LẼ VỨT `tools` (đo thật) — OpenCode không gọi được tool nào. Các phép kiểm
 * dưới đây khoá đúng những chỗ dễ vỡ nhất của phép dịch: thứ tự tin `tool`,
 * id tool đi khứ hồi, và luồng SSE ghép từ từng mẩu.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anthropicSangOpenAI, nenChuyenDuPhong, openAISangAnthropic, taoBoDichStream } from './du-phong.mjs';

test('yêu cầu: system + tool + tool_use/tool_result khứ hồi đúng thứ tự', () => {
  const ra = anthropicSangOpenAI({
    model: 'claude-sonnet-5',
    max_tokens: 1000,
    stream: true,
    system: [{ type: 'text', text: 'Bạn là trợ lý.' }, { type: 'text', text: 'Trả lời tiếng Việt.' }],
    tools: [
      { name: 'read', description: 'đọc file', input_schema: { type: 'object', properties: { path: { type: 'string' } } } },
      { type: 'web_search_20250305', name: 'web_search' },   // tool phía máy chủ ⇒ bỏ
    ],
    tool_choice: { type: 'any' },
    messages: [
      { role: 'user', content: 'Đọc a.txt' },
      { role: 'assistant', content: [{ type: 'text', text: 'Để mình đọc.' }, { type: 'tool_use', id: 'toolu_1', name: 'read', input: { path: 'a.txt' } }] },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'toolu_1', content: [{ type: 'text', text: 'xin chào' }] }, { type: 'text', text: 'tóm tắt đi' }] },
    ],
  }, 'gpt-6-sol');

  assert.equal(ra.model, 'gpt-6-sol');
  assert.deepEqual(ra.stream_options, { include_usage: true });
  assert.equal(ra.tool_choice, 'required');
  assert.equal(ra.tools.length, 1);
  assert.equal(ra.tools[0].function.name, 'read');
  assert.deepEqual(ra.messages.map((m) => m.role), ['system', 'user', 'assistant', 'tool', 'user']);
  assert.equal(ra.messages[0].content, 'Bạn là trợ lý.\n\nTrả lời tiếng Việt.');
  assert.equal(ra.messages[2].tool_calls[0].id, 'toolu_1');
  assert.equal(ra.messages[2].tool_calls[0].function.arguments, '{"path":"a.txt"}');
  assert.equal(ra.messages[3].tool_call_id, 'toolu_1');
  assert.equal(ra.messages[3].content, 'xin chào');
  assert.equal(ra.messages[4].content, 'tóm tắt đi');
});

test('yêu cầu: ảnh base64 → image_url; ảnh trong tool_result đi kèm tin user', () => {
  const anh = { type: 'image', source: { type: 'base64', media_type: 'image/png', data: 'QUJD' } };
  const ra = anthropicSangOpenAI({
    messages: [
      { role: 'user', content: [anh, { type: 'text', text: 'ảnh gì?' }] },
      { role: 'assistant', content: [{ type: 'tool_use', id: 't2', name: 'chup', input: {} }] },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 't2', content: [anh], is_error: false }] },
    ],
  }, 'm');
  assert.equal(ra.messages[0].content[0].image_url.url, 'data:image/png;base64,QUJD');
  assert.equal(ra.messages[1].content, null);          // assistant chỉ có tool_use
  assert.equal(ra.messages[2].role, 'tool');
  assert.equal(ra.messages[3].role, 'user');
  assert.equal(ra.messages[3].content[1].type, 'image_url');
});

test('trả lời không stream: tool_calls → tool_use, stop_reason đúng', () => {
  const a = openAISangAnthropic({
    id: 'c1',
    choices: [{ finish_reason: 'tool_calls', message: { content: null, tool_calls: [{ id: 'call_9', function: { name: 'read', arguments: '{"path":"b"}' } }] } }],
    usage: { prompt_tokens: 12, completion_tokens: 7 },
  }, 'claude-sonnet-5');
  assert.equal(a.type, 'message');
  assert.equal(a.stop_reason, 'tool_use');
  assert.deepEqual(a.content, [{ type: 'tool_use', id: 'call_9', name: 'read', input: { path: 'b' } }]);
  assert.deepEqual(a.usage, { input_tokens: 12, output_tokens: 7 });
});

/** Gom các sự kiện SSE Anthropic thành danh sách {type, ...}. */
function docSuKien(sse) {
  return sse.split('\n\n').filter(Boolean).map((k) => JSON.parse(k.split('\n')[1].slice(6)));
}

test('stream: chữ rồi tool, tham số đến từng mẩu ⇒ dựng lại đúng', () => {
  const bd = taoBoDichStream('claude-sonnet-5');
  const dong = [
    { id: 'x', choices: [{ delta: { role: 'assistant', content: 'Đọc ' } }] },
    { id: 'x', choices: [{ delta: { content: 'nhé.' } }] },
    { id: 'x', choices: [{ delta: { tool_calls: [{ index: 0, id: 'call_1', function: { name: 'read', arguments: '{"pa' } }] } }] },
    { id: 'x', choices: [{ delta: { tool_calls: [{ index: 0, function: { arguments: 'th":"a.txt"}' } }] } }] },
    { id: 'x', choices: [{ delta: {}, finish_reason: 'tool_calls' }] },
    { id: 'x', choices: [], usage: { prompt_tokens: 30, completion_tokens: 9 } },
  ];
  let sse = '';
  for (const d of dong) sse += bd.nhan(`data: ${JSON.stringify(d)}`);
  sse += bd.nhan('data: [DONE]');
  sse += bd.ketThuc();                                   // gọi thừa không nhả gì thêm
  const sk = docSuKien(sse);
  assert.deepEqual(sk.map((e) => e.type), [
    'message_start',
    'content_block_start', 'content_block_delta', 'content_block_delta', 'content_block_stop',
    'content_block_start', 'content_block_delta', 'content_block_delta', 'content_block_stop',
    'message_delta', 'message_stop',
  ]);
  assert.equal(sk[5].content_block.type, 'tool_use');
  assert.equal(sk[5].content_block.id, 'call_1');
  assert.equal(sk[6].delta.partial_json + sk[7].delta.partial_json, '{"path":"a.txt"}');
  assert.equal(sk[9].delta.stop_reason, 'tool_use');
  assert.deepEqual(sk[9].usage, { input_tokens: 30, output_tokens: 9 });
});

test('stream đứt không có [DONE] ⇒ ketThuc vẫn đóng tin nhắn hợp lệ', () => {
  const bd = taoBoDichStream('m');
  let sse = bd.nhan(`data: ${JSON.stringify({ id: 'y', choices: [{ delta: { content: 'hi' }, finish_reason: 'stop' }] })}`);
  sse += bd.ketThuc();
  const sk = docSuKien(sse);
  assert.equal(sk.at(-2).delta.stop_reason, 'end_turn');
  assert.equal(sk.at(-1).type, 'message_stop');
});

test('khi nào chuyển dự phòng', () => {
  for (const s of [429, 500, 502, 503, 504, 529]) assert.equal(nenChuyenDuPhong(s), true, String(s));
  // 400/401/413: lỗi CỦA YÊU CẦU — đổi cổng không chữa được, trả nguyên cho người dùng.
  for (const s of [200, 400, 401, 403, 413]) assert.equal(nenChuyenDuPhong(s), false, String(s));
});
