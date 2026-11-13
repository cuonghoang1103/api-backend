/**
 * Hồi quy 13/11/2026 — "CuongMini 3.11" + ảnh ⇒ AI đáp "chưa thấy ảnh được đính kèm".
 *
 * Bậc mặc định (gpt-6-luna → Groq) chỉ nhận chữ; trước bản vá máy chủ bỏ `images`/`documents` im lặng khi client
 * (app desktop, robot, web tự kèm lại ảnh lượt trước) gửi kèm model `cuongmini-3.11`. Test này chứng minh:
 *   1. MỌI model người dùng chọn được trong Chat + có ảnh + tài khoản Pro ⇒ lượt chạy bậc Claude (đọc được ảnh).
 *   2. Payload thật gửi đi (tuyến `/v1/messages` qua `streamClaudeChat`, và cổng chính hãng qua `streamChatChinhHang`)
 *      CÓ khối `image` base64 đúng dữ liệu.
 *   3. Không Pro ⇒ báo `pro_required` + model được dặn nói thật (không "chưa thấy ảnh").
 * Không gọi LLM thật: `fetch` và lời gọi cổng chính hãng đều được thay.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.STORAGE_SANDBOX ??= '1';
process.env.AGENT_GATEWAY_BASE_URL ??= 'https://gwai.test/api/claude';
process.env.AGENT_GATEWAY_API_KEY ??= 'sk-test';
process.env.LLM_GATEWAY_BASE_URL ??= 'https://modelapi.test/v1';
process.env.LLM_GATEWAY_API_KEY ??= 'sk-test';

const { CHAT_MODELS, BAC_DOC_TEP, DEFAULT_CHAT_MODEL_ID, buildUserContent, chonBacChoTep, ghiChuTepKhongDoc } = await import('./ai.service.js');
const { streamClaudeChat } = await import('./claudeChat.js');
const { streamChatChinhHang, modelChinhHangCuaBac } = await import('./aiChatChinhHang.js');

const ANH = { media_type: 'image/png', data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==' };

test('mọi model chọn được + có ảnh + Pro ⇒ lượt chạy bậc Claude (đọc được ảnh)', () => {
  const ids = [...Object.keys(CHAT_MODELS), undefined, 'model-la'];
  for (const id of ids) {
    const r = chonBacChoTep(id, true, true);
    assert.equal(CHAT_MODELS[r.bac]?.tier, 'claude', `model ${String(id)} ⇒ ${r.bac} phải là bậc Claude`);
  }
  // Đúng ca chủ kênh báo: 3.11 + ảnh ⇒ Pro 2, có cờ để client báo.
  assert.deepEqual(chonBacChoTep('cuongmini-3.11', true, true), { bac: BAC_DOC_TEP, lyDo: 'nang_bac_tep' });
  // Bậc Claude đã chọn thì giữ nguyên.
  assert.deepEqual(chonBacChoTep('cuongmini-max', true, true), { bac: 'cuongmini-max' });
});

test('không có tệp ⇒ không đổi bậc; không Pro + tệp ⇒ pro_required', () => {
  assert.deepEqual(chonBacChoTep('cuongmini-3.11', false, true), { bac: DEFAULT_CHAT_MODEL_ID });
  assert.deepEqual(chonBacChoTep('cuongmini-3.11', true, false), { bac: DEFAULT_CHAT_MODEL_ID, lyDo: 'pro_required' });
});

test('ghi chú cho bậc mặc định: nói thật, không bảo gửi lại', () => {
  assert.equal(ghiChuTepKhongDoc(0, 0), '');
  const g = ghiChuTepKhongDoc(2, 1);
  assert.match(g, /2 ảnh và 1 tệp/);
  assert.match(g, /Đừng nói kiểu "chưa thấy ảnh được đính kèm"/);
});

test('payload tuyến /v1/messages (gwai) CÓ khối image base64', async () => {
  const content = await buildUserContent('Bạn xem ảnh này nội dung có gì sai', [ANH], undefined, true);
  assert.ok(Array.isArray(content));
  let body: { model?: string; messages?: Array<{ content: unknown }> } = {};
  const goc = globalThis.fetch;
  globalThis.fetch = (async (_url: unknown, init?: { body?: string }) => {
    body = JSON.parse(String(init?.body ?? '{}'));
    const sse = 'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Thấy ảnh"}}\n\n';
    return new Response(sse, { status: 200, headers: { 'content-type': 'text/event-stream' } });
  }) as typeof fetch;
  try {
    let chu = '';
    for await (const p of streamClaudeChat({ model: modelChinhHangCuaBac('cuongmini-pro-2'), system: 's', messages: [{ role: 'user', content }] })) chu += p;
    assert.equal(chu, 'Thấy ảnh');
  } finally {
    globalThis.fetch = goc;
  }
  const khoi = body.messages?.[0]?.content as Array<{ type: string; source?: { data?: string; media_type?: string } }>;
  const anh = khoi.find((b) => b.type === 'image');
  assert.ok(anh, 'phải có khối image trong payload');
  assert.equal(anh!.source?.data, ANH.data);
  assert.equal(anh!.source?.media_type, 'image/png');
  assert.ok(khoi.some((b) => b.type === 'text'), 'câu hỏi chữ vẫn đi kèm');
});

test('payload cổng chính hãng (lớp lùi) CÓ khối image', async () => {
  const content = await buildUserContent('xem ảnh', [ANH], undefined, true);
  let seen: unknown = null;
  for await (const _ of streamChatChinhHang({
    bac: 'cuongmini-pro-2', system: 's', userId: 1,
    messages: [{ role: 'user', content: content as unknown as Array<Record<string, unknown>> }],
    _goi: async (o) => { seen = o.messages; o.onToken?.('ok'); return { usd: 0 }; },
  })) { /* */ }
  const khoi = (seen as Array<{ content: Array<{ type: string }> }>)[0].content;
  assert.ok(khoi.some((b) => b.type === 'image'));
});

test('bấm Dừng (nơi gọi thôi đọc) ⇒ huỷ lời gọi cổng chính hãng', async () => {
  let tinHieu: AbortSignal | undefined;
  const g = streamChatChinhHang({
    bac: 'cuongmini-pro', system: 's', userId: 1, messages: [{ role: 'user', content: 'hi' }],
    _goi: (o) => new Promise((giai) => {
      tinHieu = o.signal;
      o.onToken?.('mẩu đầu');
      o.signal?.addEventListener('abort', () => giai({ usd: 0 }));
    }),
  });
  const r = await g.next();
  assert.equal(r.value, 'mẩu đầu');
  await g.return(undefined as never);
  assert.equal(tinHieu?.aborted, true);
});

test('bấm Dừng ⇒ streamClaudeChat đóng luồng fetch upstream', async () => {
  let tinHieu: AbortSignal | undefined;
  const goc = globalThis.fetch;
  globalThis.fetch = (async (_u: unknown, init?: { signal?: AbortSignal }) => {
    tinHieu = init?.signal;
    const enc = new TextEncoder();
    const body = new ReadableStream({
      pull(c) { c.enqueue(enc.encode('data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"x"}}\n\n')); },
    });
    return new Response(body, { status: 200 });
  }) as typeof fetch;
  try {
    const g = streamClaudeChat({ model: 'claude-sonnet-5-5', system: 's', messages: [{ role: 'user', content: 'hi' }] });
    assert.equal((await g.next()).value, 'x');
    await g.return(undefined);
    assert.equal(tinHieu?.aborted, true);
  } finally {
    globalThis.fetch = goc;
  }
});

test('khách đóng (signal từ khiKhachDong) khi model còn IM ⇒ streamClaudeChat huỷ fetch ngay, không chờ hết giờ', async () => {
  let tinHieu: AbortSignal | undefined;
  const goc = globalThis.fetch;
  globalThis.fetch = ((_u: unknown, init?: { signal?: AbortSignal }) => {
    tinHieu = init?.signal;
    // Upstream im lặng: không trả gì cho tới khi bị huỷ.
    return new Promise((_g, tuChoi) => init?.signal?.addEventListener('abort', () => tuChoi(Object.assign(new Error('aborted'), { name: 'AbortError' }))));
  }) as typeof fetch;
  try {
    const huy = new AbortController();
    const g = streamClaudeChat({ model: 'claude-sonnet-5-5', system: 's', messages: [{ role: 'user', content: 'hi' }], signal: huy.signal });
    const p = g.next();
    setTimeout(() => huy.abort(), 20);
    const t0 = Date.now();
    await assert.rejects(p);
    assert.ok(Date.now() - t0 < 2000, 'phải huỷ ngay');
    assert.equal(tinHieu?.aborted, true);
  } finally {
    globalThis.fetch = goc;
  }
});

test('khách đóng ⇒ signal truyền tới lời gọi cổng chính hãng', async () => {
  const huy = new AbortController();
  let tinHieu: AbortSignal | undefined;
  const g = streamChatChinhHang({
    bac: 'cuongmini-pro', system: 's', userId: 1, messages: [{ role: 'user', content: 'hi' }], signal: huy.signal,
    _goi: (o) => new Promise((_giai, tuChoi) => { tinHieu = o.signal; o.signal?.addEventListener('abort', () => tuChoi(new Error('huỷ'))); }),
  });
  const p = g.next();
  huy.abort();
  await assert.rejects(p, /huỷ/);
  assert.equal(tinHieu?.aborted, true);
});
