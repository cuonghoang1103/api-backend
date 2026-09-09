/**
 * Chạy THẬT `runAgentTurn` qua tuyến Anthropic, với một cổng giả nói đúng
 * khung SSE của Anthropic. Chứng minh cả ba việc cùng lúc:
 *   • yêu cầu gửi đi đúng hình dạng Anthropic (`system` riêng, vai luân phiên)
 *   • bộ đọc luồng nhặt đúng chữ, tool và `stop_reason`
 *   • `tool_use` dịch thành `tool_calls` cho phần còn lại của mã hiểu
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { runAgentTurn, type AgentEvent } from './turn.js';

function than(mau: Array<Record<string, unknown>>): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      for (const m of mau) c.enqueue(enc.encode(`data: ${JSON.stringify(m)}\n\n`));
      c.close();
    },
  });
}

test('tuyến Anthropic: gửi đúng hình dạng, đọc đúng tool', async (t) => {
  const luu = ['AGENT_GATEWAY_BASE_URL', 'AGENT_GATEWAY_API_KEY', 'LLM_GATEWAY_API_KEY']
    .map((k) => [k, process.env[k]] as const);
  process.env.AGENT_GATEWAY_BASE_URL = 'https://vi-du.test/api/claude';
  process.env.AGENT_GATEWAY_API_KEY = 'sk-gia-lap';
  process.env.LLM_GATEWAY_API_KEY = 'sk-gia-lap';
  t.after(() => { for (const [k, v] of luu) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } });

  const goc = globalThis.fetch;
  const daGui: any[] = [];
  const duong: string[] = [];
  const head: any[] = [];
  globalThis.fetch = (async (url: any, init: any) => {
    duong.push(String(url));
    head.push(init.headers);
    daGui.push(JSON.parse(String(init.body)));
    return new Response(than([
      { type: 'message_start', message: { usage: { input_tokens: 120 } } },
      { type: 'content_block_start', index: 0, content_block: { type: 'text' } },
      { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Để tôi đọc file.' } },
      { type: 'content_block_start', index: 1, content_block: { type: 'tool_use', id: 'tu_1', name: 'read_file' } },
      // Tham số về TỪNG MẨU — mẩu riêng lẻ không phải JSON hợp lệ.
      { type: 'content_block_delta', index: 1, delta: { type: 'input_json_delta', partial_json: '{"path":' } },
      { type: 'content_block_delta', index: 1, delta: { type: 'input_json_delta', partial_json: '"src/a.ts"}' } },
      { type: 'message_delta', delta: { stop_reason: 'tool_use' }, usage: { output_tokens: 40 } },
    ]), { status: 200 });
  }) as typeof fetch;
  t.after(() => { globalThis.fetch = goc; });

  const sk: AgentEvent[] = [];
  await runAgentTurn(
    { userId: 1, messages: [{ role: 'user', content: 'Đọc src/a.ts' }], capabilities: ['fs_read'], mucNoLuc: 'vua' } as any,
    (e) => sk.push(e),
    new AbortController().signal,
  );

  // 1. Đi đúng đường /v1/messages của cổng riêng.
  assert.match(duong[0]!, /vi-du\.test\/api\/claude\/v1\/messages$/, duong[0]);

  // 2. Header Anthropic, KHÔNG phải Bearer.
  assert.equal(head[0]['x-api-key'], 'sk-gia-lap');
  assert.equal(head[0]['anthropic-version'], '2023-06-01');

  // 3. `system` là tham số riêng, và KHÔNG còn tin `system` nào trong mảng.
  const body = daGui[0];
  assert.equal(typeof body.system, 'string');
  assert.ok(body.system.length > 0, 'system rỗng');
  assert.ok(!body.messages.some((m: any) => m.role === 'system'), 'còn tin system trong messages');

  // 4. Tool đã đổi sang `input_schema`.
  assert.ok(Array.isArray(body.tools) && body.tools.length > 0);
  assert.ok(body.tools[0].input_schema, 'tool chưa dịch sang input_schema');
  assert.ok(!body.tools[0].function, 'còn hình dạng OpenAI');

  // 5. Tham số tool nối dần được ⇒ JSON hoàn chỉnh.
  const goiTool = sk.find((e) => e.type === 'tool_call') as any;
  assert.ok(goiTool, `không có tool_call. Sự kiện: ${JSON.stringify(sk.map((e) => e.type))}`);
  assert.equal(goiTool.name, 'read_file');
  assert.deepEqual(goiTool.args, { path: 'src/a.ts' });

  // 6. `tool_use` → `tool_calls`, nên lượt kết thúc bằng 'tool_calls'.
  const xong = sk.find((e) => e.type === 'done') as any;
  assert.equal(xong.stop, 'tool_calls');
  assert.equal(xong.usage.inputTokens, 120);
});

/*
 * CHỐT MỐI NỐI GIỮA `turn.ts` VÀ `anthropic.ts`.
 *
 * Phép kiểm đơn vị của từng tệp đều xanh trong khi ảnh dán ở AI Code KHÔNG tới
 * model: `turn.ts` cho `image_url` qua (đúng, đó là giao thức OpenAI), còn
 * `sangAnthropic` lại chỉ nhận `image` — mà AI Code chạy tuyến ANTHROPIC. Chỉ
 * phép kiểm đọc THÂN YÊU CẦU THẬT gửi đi mới thấy được chỗ rơi.
 */
test('tuyến Anthropic: ảnh dán đi hết đường, tới THÂN yêu cầu gửi cổng', async (t) => {
  const luu = ['AGENT_GATEWAY_BASE_URL', 'AGENT_GATEWAY_API_KEY', 'LLM_GATEWAY_API_KEY']
    .map((k) => [k, process.env[k]] as const);
  process.env.AGENT_GATEWAY_BASE_URL = 'https://vi-du.test/api/claude';
  process.env.AGENT_GATEWAY_API_KEY = 'sk-gia-lap';
  process.env.LLM_GATEWAY_API_KEY = 'sk-gia-lap';
  t.after(() => { for (const [k, v] of luu) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } });

  const goc = globalThis.fetch;
  const daGui: any[] = [];
  globalThis.fetch = (async (_url: any, init: any) => {
    daGui.push(JSON.parse(String(init.body)));
    return new Response(than([
      { type: 'content_block_start', index: 0, content_block: { type: 'text' } },
      { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Ảnh 1×1 màu đen.' } },
      { type: 'message_delta', delta: { stop_reason: 'end_turn' }, usage: { output_tokens: 8 } },
    ]), { status: 200 });
  }) as typeof fetch;
  t.after(() => { globalThis.fetch = goc; });

  // ĐÚNG thứ app desktop gửi lên: khối `text` + khối `image_url` data URI.
  const than64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  await runAgentTurn(
    { userId: 1, capabilities: [], mucNoLuc: 'vua', messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Ảnh này màu gì?' },
        { type: 'image_url', image_url: { url: `data:image/png;base64,${than64}` } },
      ],
    }] } as any,
    () => {},
    new AbortController().signal,
  );

  const kh = daGui[0].messages.at(-1).content;
  assert.ok(Array.isArray(kh), `content không phải mảng khối: ${JSON.stringify(kh).slice(0, 200)}`);
  const anh = kh.find((k: any) => k.type === 'image');
  assert.ok(anh, `THÂN GỬI CỔNG KHÔNG CÓ ẢNH — model sẽ nói "tôi không nhận được ảnh". Khối: ${
    JSON.stringify(kh.map((k: any) => k.type))}`);
  assert.equal(anh.source.type, 'base64');
  assert.equal(anh.source.media_type, 'image/png');
  assert.equal(anh.source.data, than64);
  // Và KHÔNG được còn hình dạng OpenAI sót lại — cổng Anthropic không hiểu nó.
  assert.ok(!kh.some((k: any) => k.type === 'image_url'), 'còn khối image_url kiểu OpenAI');
});
