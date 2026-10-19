/**
 * Đợt 8A — tự cứu khi cổng báo vượt cửa sổ ngữ cảnh (`cuuCuaSo.ts` + `turn.ts`).
 *   npx tsx --test src/services/agent/cuuCuaSo.test.ts
 */
import assert from 'node:assert/strict';
import test from 'node:test';

const { laLoiVuotCuaSo, catKetQuaToolTo, CAU_TU_TOM_TAT } = await import('./cuuCuaSo.js');

test('nhận đủ các cách nói "vượt cửa sổ" của các cổng, không nhầm 429', () => {
  for (const s of [
    'HTTP 400 {"type":"error","error":{"type":"invalid_request_error","message":"This request is longer than the model\'s context window"}}',
    'HTTP 400 prompt is too long: 215000 tokens > 200000 maximum',
    "HTTP 400 This model's maximum context length is 400000 tokens. However, your messages resulted in 512000 tokens",
    'HTTP 400 {"error":{"code":"context_length_exceeded"}}',
    'input exceeds the context window of this model',
  ]) assert.equal(laLoiVuotCuaSo(s), true, s);
  for (const s of ['HTTP 429 Too many tokens per minute', 'HTTP 503 No available channel', 'HTTP 400 invalid tool schema', '']) {
    assert.equal(laLoiVuotCuaSo(s), false, s);
  }
});

test('cắt kết quả tool to: giữ đầu + đuôi, không xoá tin tool, gỡ ảnh cũ', () => {
  const to = `DAU-${'a'.repeat(50_000)}-DUOI`;
  const ms: any[] = [
    { role: 'user', content: 'hỏi' },
    { role: 'assistant', content: null, tool_calls: [{ id: 't1', type: 'function', function: { name: 'read_file', arguments: '{}' } }] },
    { role: 'tool', tool_call_id: 't1', content: to, anh: [{ media_type: 'image/png', data: 'x' }] },
    { role: 'assistant', content: null, tool_calls: [{ id: 't2', type: 'function', function: { name: 'read_file', arguments: '{}' } }] },
    { role: 'tool', tool_call_id: 't2', content: to },
  ];
  const r = catKetQuaToolTo(ms, { giuCuoi: 1, tranCu: 4_000, tranMoi: 20_000 });
  assert.equal(r.messages.length, ms.length);
  const t1 = r.messages[2] as any;
  const t2 = r.messages[4] as any;
  assert.ok(t1.content.length < 4_500 && t1.content.startsWith('DAU-') && t1.content.includes('-DUOI'));
  assert.equal(t1.anh, undefined, 'ảnh kết quả cũ bị gỡ');
  assert.ok(t2.content.length < 20_500 && t2.content.startsWith('DAU-') && t2.content.endsWith('-DUOI'));
  assert.equal(r.soDaCat, 2);
});

// ─── runAgentTurn THẬT với cổng giả ───────────────────────────────
async function chay(t: any, lanLoi: number) {
  const { runAgentTurn } = await import('./turn.js');
  const luu = ['LLM_GATEWAY_API_KEY', 'LLM_GATEWAY_API_KEY_GPT', 'LLM_GATEWAY_BASE_URL', 'AGENT_GATEWAY_BASE_URL', 'AGENT_GATEWAY_API_KEY'].map((k) => [k, process.env[k]] as const);
  process.env.LLM_GATEWAY_API_KEY = 'sk-gia-lap-cho-kiem-thu';
  process.env.LLM_GATEWAY_API_KEY_GPT = 'sk-gia-lap-cho-kiem-thu';
  process.env.LLM_GATEWAY_BASE_URL = 'https://vi-du.test/v1';
  delete process.env.AGENT_GATEWAY_BASE_URL; delete process.env.AGENT_GATEWAY_API_KEY;
  const goc = globalThis.fetch;
  const goi: Array<{ stream: boolean; chu: number; than: string }> = [];
  let daLoi = 0;
  globalThis.fetch = (async (_url: unknown, init: { body?: string }) => {
    const b = JSON.parse(String(init?.body ?? '{}'));
    const than = JSON.stringify(b.messages ?? []);
    goi.push({ stream: b.stream === true, chu: than.length, than });
    if (b.stream !== true) {
      return new Response(JSON.stringify({ choices: [{ message: { content: 'TÓM TẮT CŨ: đã sửa src/a.ts, còn chạy test.' } }], usage: { prompt_tokens: 100, completion_tokens: 20 } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (daLoi < lanLoi) {
      daLoi++;
      return new Response(JSON.stringify({ error: { type: 'invalid_request_error', message: "This request is longer than the model's context window" } }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const enc = new TextEncoder();
    return new Response(new ReadableStream({ start(c) {
      c.enqueue(enc.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: 'xong' }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 2 } })}\n\n`));
      c.enqueue(enc.encode('data: [DONE]\n\n')); c.close();
    } }), { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
  }) as typeof fetch;
  t.after(() => { globalThis.fetch = goc; for (const [k, v] of luu) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } });

  const messages: any[] = [{ role: 'user', content: 'ĐỀ BÀI GỐC: sửa lỗi đăng nhập' }];
  for (let i = 0; i < 6; i++) messages.push({ role: 'assistant', content: `bước ${i} ${'y'.repeat(20_000)}` }, { role: 'user', content: `tiếp ${i}` });
  messages.push({ role: 'assistant', content: null, tool_calls: [{ id: 'k1', type: 'function', function: { name: 'read_file', arguments: '{"path":"log.txt"}' } }] });
  messages.push({ role: 'tool', tool_call_id: 'k1', content: `LOG ${'z'.repeat(120_000)} HET` });
  const sk: any[] = [];
  await runAgentTurn({ userId: 1, messages, capabilities: ['fs_read'], model: 'cm-solid' } as any, (e) => sk.push(e), new AbortController().signal);
  return { sk, goi };
}

test('cổng 400 vượt cửa sổ ⇒ tự tóm tắt + cắt tool to ⇒ gửi lại ĐÚNG MỘT lần, thành công, dòng mờ', async (t) => {
  const { sk, goi } = await chay(t, 1);
  assert.ok(sk.some((e) => e.type === 'done' && e.stop === 'end'), JSON.stringify(sk.filter((e) => e.type === 'error')));
  const chinh = goi.filter((g) => g.stream);
  assert.equal(chinh.length, 2, 'một lần lỗi + đúng một lần gửi lại');
  assert.ok(chinh[1]!.chu < chinh[0]!.chu / 2, `bản gửi lại phải nhỏ hẳn: ${chinh[0]!.chu} → ${chinh[1]!.chu}`);
  assert.ok(goi.some((g) => !g.stream), 'phải gọi tóm tắt lượt cũ');
  assert.match(chinh[1]!.than, /ĐỀ BÀI GỐC: sửa lỗi đăng nhập/, 'đề bài được ghim');
  assert.match(chinh[1]!.than, /TÓM TẮT CŨ/);
  assert.match(chinh[1]!.than, /LOG z+/, 'kết quả tool mới vẫn còn (đã cắt bớt)');
  const mo = sk.find((e) => e.type === 'cong' && e.ma === 'DOI_CONG_TU_DONG');
  assert.equal(mo?.thongDiep, CAU_TU_TOM_TAT.vi);
});

test('gửi lại vẫn vượt cửa sổ ⇒ dừng với câu rõ (gợi ý /compact, /clear), không lặp', async (t) => {
  const { sk, goi } = await chay(t, 5);
  const loi = sk.find((e) => e.type === 'error');
  assert.equal(loi?.code, 'NGU_CANH_QUA_DAI');
  assert.match(loi.error, /\/compact/);
  assert.match(loi.error, /\/clear/);
  assert.equal(goi.filter((g) => g.stream).length, 2, 'không lặp quá một lần gửi lại');
});
