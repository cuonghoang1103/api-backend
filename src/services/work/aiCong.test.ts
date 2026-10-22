/**
 * Chuỗi cổng CT Work (22/10/2026) — `npx tsx --test src/services/work/aiCong.test.ts`
 *
 * Phần 1 (thuần, phụ thuộc giả): rambo → chính hãng → modelapi; rambo 410 ⇒ tự sang chính hãng; chính hãng hỏng ⇒ modelapi;
 *   cầu dao đang mở ⇒ bỏ qua rambo; chữ đã stream của bậc hỏng ⇒ onRestart; model theo việc (Opus spec/nặng trên rambo,
 *   Haiku 5.5 cho digest ở chính hãng, không Opus chính hãng); hết trần tiền của web ⇒ báo thẳng, không lùi.
 * Phần 2 (HTTP giả, `llmComplete` THẬT): adapter Anthropic gọi ĐÚNG gốc rambo (lỗi âm thầm từ 07/09: nó gọi modelapi),
 *   410 Key Expired ⇒ `khongLui` ném ngay + cầu dao mở dài; chuỗi đầy đủ ⇒ trả lời bằng modelapi gpt-6-sol, kể cả stream.
 */
import assert from 'node:assert/strict';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';

process.env.STORAGE_SANDBOX ??= '1';

const {
  goiAiCtWork, _datCongChoTest, modelRamboCho, modelChinhHangCho, modelModelapiCho, chuoiCtWork, chuoiCongHienTai, tranChinhHang, trongTranChinhHang, laCauLoiCong,
} = await import('./aiCong.js');
type Opts = Parameters<typeof goiAiCtWork>[0];
const { AppError } = await import('../../middleware/errorHandler.js');

function loi(status: number) {
  const e = new Error(`anthropic HTTP ${status}`) as Error & { httpStatus?: number; retryable?: boolean };
  e.httpStatus = status;
  return e;
}
const ok = (cong: 'rambo' | 'chinh_hang' | 'modelapi', model: string, text = `từ ${cong}`) => ({ text, model, inputTokens: 1, outputTokens: 1, cong });
const base: Opts = { system: 's', messages: [{ role: 'user', content: 'hỏi' }], maxTokens: 100, userId: 1, purpose: 'work_assistant' };
const EP = { root: 'http://rambo.test', key: 'k', local: false, label: 'cong-agent', giaoThuc: 'anthropic' as const };

describe('chuỗi cổng CT Work — phụ thuộc giả', () => {
  after(() => _datCongChoTest(null));

  it('rambo sống ⇒ trả lời bằng rambo (claude-fable-5 cho trợ lý — 22/10)', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (_o, _ep, model) => { goi.push(`rambo:${model}`); return ok('rambo', model); },
      chinhHangSanSang: async () => { goi.push('ch?'); return true; },
      goiModelapi: async (_o, m) => { goi.push(`modelapi:${m}`); return ok('modelapi', m); },
    });
    const r = await goiAiCtWork(base);
    assert.equal(r.cong, 'rambo');
    assert.equal(goi[0], 'rambo:claude-fable-5');
    assert.equal(goi.length, 1);
  });

  it('rambo 410 Key Expired ⇒ TỰ sang chính hãng Sonnet 5.5 (người dùng không thấy lỗi)', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async () => { goi.push('rambo'); throw loi(410); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async (_o, m) => { goi.push(`ch:${m}`); return ok('chinh_hang', m); },
      goiModelapi: async (_o, m) => { goi.push(`modelapi:${m}`); return ok('modelapi', m); },
    });
    const r = await goiAiCtWork(base);
    assert.equal(r.cong, 'chinh_hang');
    assert.deepEqual(goi, ['rambo', 'ch:claude-sonnet-5-5']);
  });

  it('rambo 410 + chính hãng hỏng (5xx) ⇒ modelapi gpt-6-sol; báo cổng chính hãng hỏng', async () => {
    let baoHong = 0;
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async () => { throw loi(410); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async () => { throw new Error('Cổng chính hãng HTTP 529'); },
      baoChinhHangHong: () => { baoHong++; },
      goiModelapi: async (_o, m) => ok('modelapi', m),
    });
    const r = await goiAiCtWork(base);
    assert.equal(r.cong, 'modelapi');
    assert.equal(r.model, 'gpt-6-sol');
    assert.equal(baoHong, 1);
  });

  it('cầu dao rambo đang mở ⇒ không gọi rambo; chính hãng hết trần/hết key ⇒ thẳng modelapi', async () => {
    let ramboGoi = false;
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => true,
      goiRambo: async () => { ramboGoi = true; return ok('rambo', 'x'); },
      chinhHangSanSang: async () => false,
      goiModelapi: async (_o, m) => ok('modelapi', m),
    });
    assert.equal((await goiAiCtWork(base)).cong, 'modelapi');
    assert.equal(ramboGoi, false);
  });

  it('rambo tắt cho CT Work (null) ⇒ bắt đầu từ chính hãng', async () => {
    _datCongChoTest({ rambo: () => null, chinhHangSanSang: async () => true, goiChinhHang: async (_o, m) => ok('chinh_hang', m) });
    assert.equal((await goiAiCtWork(base)).cong, 'chinh_hang');
  });

  it('bậc trước đã lỡ STREAM chữ rồi hỏng ⇒ onRestart một lần, bậc sau phát lại từ đầu', async () => {
    const chu: string[] = [];
    let restart = 0;
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (o) => { o.onToken?.('{"reply":"nửa câu'); throw loi(502); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async (o, m) => { o.onToken?.('{"reply":"đủ"}'); return ok('chinh_hang', m, '{"reply":"đủ"}'); },
    });
    const r = await goiAiCtWork({ ...base, onToken: (d) => chu.push(d), onRestart: () => { restart++; chu.length = 0; } });
    assert.equal(r.cong, 'chinh_hang');
    assert.equal(restart, 1);
    assert.deepEqual(chu, ['{"reply":"đủ"}']);
  });

  it('hết trần TIỀN của web (BUDGET_EXCEEDED) ⇒ báo thẳng, không lùi sang bậc trả tiền khác', async () => {
    let modelapi = false;
    _datCongChoTest({
      rambo: () => null, chinhHangSanSang: async () => true,
      goiChinhHang: async () => { throw new AppError('hết trần', 429, 'BUDGET_EXCEEDED'); },
      goiModelapi: async (_o, m) => { modelapi = true; return ok('modelapi', m); },
    });
    await assert.rejects(goiAiCtWork(base), (e: { code?: string }) => e.code === 'BUDGET_EXCEEDED');
    assert.equal(modelapi, false);
  });

  it('model theo việc: spec_review + việc nặng ⇒ Opus trên rambo; lùi chính hãng vẫn Sonnet 5.5; digest ⇒ Haiku 5.5', async () => {
    assert.equal(modelRamboCho('work_spec_review'), 'claude-opus-5');
    assert.equal(modelRamboCho('work_assistant', true), 'claude-opus-5');
    assert.equal(modelRamboCho('work_assistant'), 'claude-fable-5');
    assert.match(modelRamboCho('work_digest'), /^claude-sonnet/);
    assert.equal(modelChinhHangCho('work_spec_review'), 'claude-sonnet-5-5');
    assert.equal(modelChinhHangCho('work_assistant'), 'claude-sonnet-5-5');
    assert.equal(modelChinhHangCho('work_digest'), 'claude-haiku-5-5');
    assert.equal(modelModelapiCho('work_assistant'), 'gpt-6-sol');
    // env Claude ⇒ áp ở rambo; env GPT ⇒ áp ở modelapi (không bao giờ gọi Claude qua modelapi).
    process.env.LLM_MODEL_WORK_DIGEST = 'claude-haiku-4-5';
    assert.equal(modelRamboCho('work_digest'), 'claude-haiku-4-5');
    assert.equal(modelModelapiCho('work_digest'), 'gpt-6-sol');
    process.env.LLM_MODEL_WORK_DIGEST = 'gpt-6-luna';
    assert.equal(modelModelapiCho('work_digest'), 'gpt-6-luna');
    delete process.env.LLM_MODEL_WORK_DIGEST;
  });
});

// ─── Phần 2: llmComplete THẬT + cổng HTTP giả ─────────────────────

describe('llmComplete thật — rambo 410 ⇒ lùi (HTTP giả)', () => {
  let srv: http.Server;
  const daGoi: Array<{ url: string; auth: string; model?: string }> = [];
  let ramboStatus = 410;

  before(async () => {
    srv = http.createServer((req, res) => {
      let raw = '';
      req.on('data', (c) => { raw += c; });
      req.on('end', () => {
        const body = raw ? JSON.parse(raw) : {};
        daGoi.push({ url: req.url ?? '', auth: String(req.headers['x-api-key'] ?? req.headers.authorization ?? ''), model: body.model });
        if (req.url?.startsWith('/rambo/v1/messages')) {
          res.writeHead(ramboStatus, { 'content-type': 'application/json' });
          res.end(JSON.stringify(ramboStatus === 200
            ? { content: [{ type: 'text', text: '{"reply":"Trả lời từ rambo"}' }], stop_reason: 'end_turn', usage: { input_tokens: 10, output_tokens: 5 } }
            : { error: { message: 'Key Expired' } }));
          return;
        }
        if (req.url?.startsWith('/modelapi/v1/chat/completions')) {
          if (body.stream) {
            res.writeHead(200, { 'content-type': 'text/event-stream' });
            res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: '{"reply":"Trả lời từ gpt-6-sol"}' } }] })}\n\n`);
            res.write(`data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 5 } })}\n\n`);
            res.end('data: [DONE]\n\n');
            return;
          }
          res.writeHead(200, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ choices: [{ message: { content: '{"reply":"Trả lời từ gpt-6-sol"}' }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 5 } }));
          return;
        }
        res.writeHead(404).end();
      });
    });
    await new Promise<void>((r) => srv.listen(0, '127.0.0.1', () => r()));
    const goc = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
    Object.assign(process.env, {
      AGENT_GATEWAY_BASE_URL: `${goc}/rambo`, AGENT_GATEWAY_API_KEY: 'sk-rambo-gia',
      LLM_GATEWAY_BASE_URL: `${goc}/modelapi/v1`, LLM_GATEWAY_API_KEY: 'sk-modelapi-gia', LLM_GATEWAY_API_KEY_GPT: 'sk-modelapi-gia',
      WORK_AI_CHINH_HANG_USD_NGAY: '0', // không dùng bậc chính hãng trong phần này
      LLM_DAILY_COST_HARD_USD: '0', LLM_DAILY_COST_SOFT_USD: '0',
    });
    delete process.env.CTWORK_RAMBO;
    _datCongChoTest(null);
  });
  after(async () => {
    srv.close();
    const { prisma } = await import('../../config/database.js');
    await prisma.$disconnect().catch(() => {});
  });

  it('adapter Anthropic gọi ĐÚNG gốc + khoá rambo (không còn lén gọi modelapi); 410 ⇒ chuỗi lùi modelapi gpt-6-sol', async () => {
    daGoi.length = 0;
    const r = await goiAiCtWork(base);
    assert.equal(r.cong, 'modelapi');
    assert.equal(r.model, 'gpt-6-sol');
    assert.match(r.text, /gpt-6-sol/);
    const rambo = daGoi.find((x) => x.url.startsWith('/rambo/v1/messages'));
    assert.ok(rambo, 'phải gọi rambo trước');
    assert.equal(rambo!.auth, 'sk-rambo-gia', 'khoá của rambo, không phải khoá modelapi');
    assert.equal(rambo!.model, 'claude-fable-5');
    assert.ok(!daGoi.some((x) => x.url.startsWith('/modelapi/v1/messages')), 'không được gọi Claude qua modelapi');
    const g = await import('../llm/gateway.js');
    assert.equal(g.ramboDangNghi(), true, '410 ⇒ cầu dao mở (nghỉ dài)');
  });

  it('cầu dao đang mở ⇒ lượt sau đi thẳng modelapi, bản STREAM vẫn ra chữ', async () => {
    daGoi.length = 0;
    const chu: string[] = [];
    const r = await goiAiCtWork({ ...base, onToken: (d) => chu.push(d) });
    assert.equal(r.cong, 'modelapi');
    assert.ok(!daGoi.some((x) => x.url.startsWith('/rambo')), 'cầu dao mở ⇒ không gõ rambo trong lượt');
    assert.match(chu.join(''), /gpt-6-sol/);
  });

  it('rambo sống lại (khoá mới) ⇒ đóng cầu dao ⇒ lượt sau về rambo, chi phí ghi 0 (gói trọn)', async () => {
    const g = await import('../llm/gateway.js');
    ramboStatus = 200;
    g.baoRamboOk(); // mũi dò / nút "Thử rambo" làm việc này khi gõ cửa thành công
    assert.equal(g.ramboDangNghi(), false);
    const r = await goiAiCtWork(base);
    assert.equal(r.cong, 'rambo');
    assert.match(r.text, /từ rambo/);
    ramboStatus = 410;
  });
});

// ─── Phần 3 (22/10/2026): viết tiếp khi cổng chết GIỮA CHỪNG, tool gốc, hết giờ theo bậc ───

describe('chuỗi cổng CT Work — chuyển cổng giữa chừng + tool gốc', () => {
  after(() => _datCongChoTest(null));
  const tinNoi = [{ role: 'user' as const, content: 'hỏi' }, { role: 'assistant' as const, content: 'nửa câu' }, { role: 'user' as const, content: 'viết tiếp' }];

  it('hỏng TRƯỚC mẩu chữ đầu ⇒ chuyển im lặng: không onRestart, không hỏi noiTiep, bậc sau nhận đúng câu hỏi gốc', async () => {
    let restart = 0;
    let hoiNoi = 0;
    let tinBacSau: unknown;
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async () => { throw new Error('ECONNRESET'); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async (o, m) => { tinBacSau = o.messages; o.onToken?.('đủ'); return ok('chinh_hang', m, 'đủ'); },
    });
    const r = await goiAiCtWork({ ...base, onToken: () => {}, onRestart: () => { restart++; }, noiTiep: () => { hoiNoi++; return tinNoi; } });
    assert.equal(r.cong, 'chinh_hang');
    assert.equal(restart, 0);
    assert.equal(hoiNoi, 0);
    assert.deepEqual(tinBacSau, base.messages);
  });

  it('hỏng GIỮA CHỪNG + có noiTiep ⇒ bậc sau nhận bộ tin "viết tiếp", nháp GIỮ NGUYÊN (không onRestart)', async () => {
    let restart = 0;
    const chu: string[] = [];
    let tinBacSau: unknown;
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (o) => { o.onToken?.('nửa câu'); throw loi(502); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async (o, m) => { tinBacSau = o.messages; o.onToken?.(' phần sau'); return ok('chinh_hang', m, ' phần sau'); },
    });
    const r = await goiAiCtWork({ ...base, onToken: (d) => chu.push(d), onRestart: () => { restart++; }, noiTiep: () => tinNoi });
    assert.equal(r.cong, 'chinh_hang');
    assert.equal(restart, 0);
    assert.deepEqual(tinBacSau, tinNoi);
    assert.equal(chu.join(''), 'nửa câu phần sau');
  });

  it('hỏng giữa chừng HAI bậc ⇒ noiTiep hỏi hai lần, modelapi viết tiếp lần cuối', async () => {
    let hoiNoi = 0;
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (o) => { o.onToken?.('A'); throw loi(502); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async (o) => { o.onToken?.('B'); throw new Error('stream gãy'); },
      baoChinhHangHong: () => {},
      goiModelapi: async (o, m) => { assert.equal(o.messages.length, 3); o.onToken?.('C'); return ok('modelapi', m, 'C'); },
    });
    const r = await goiAiCtWork({ ...base, onToken: () => {}, noiTiep: () => { hoiNoi++; return tinNoi; } });
    assert.equal(r.cong, 'modelapi');
    assert.equal(hoiNoi, 3, 'rambo, chính hãng Sonnet, chính hãng Haiku');
  });

  it('noiTiep trả null ⇒ hành vi cũ: onRestart, bậc sau làm lại từ đầu', async () => {
    let restart = 0;
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (o) => { o.onToken?.('nửa'); throw loi(502); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async (o, m) => { assert.deepEqual(o.messages, base.messages); return ok('chinh_hang', m); },
    });
    await goiAiCtWork({ ...base, onToken: () => {}, onRestart: () => { restart++; }, noiTiep: () => null });
    assert.equal(restart, 1);
  });

  it('tool gốc đi qua mọi bậc; toolCalls trả về; hết giờ theo bậc tới đúng bậc', async () => {
    const tools = [{ name: 'read_command', description: 'd', parameters: { type: 'object' } }];
    const thay: Array<{ cong: string; tools?: unknown; t?: number }> = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (o) => { thay.push({ cong: 'rambo', tools: o.tools, t: o.timeoutTheoCong?.rambo }); throw loi(503); },
      chinhHangSanSang: async () => false,
      goiModelapi: async (o, m) => {
        thay.push({ cong: 'modelapi', tools: o.tools, t: o.timeoutTheoCong?.modelapi });
        return { ...ok('modelapi', m, ''), toolCalls: [{ name: 'read_command', input: { name: 'read_issue' } }] };
      },
    });
    const r = await goiAiCtWork({ ...base, tools, timeoutTheoCong: { rambo: 45_000, modelapi: 120_000 } });
    assert.deepEqual(r.toolCalls, [{ name: 'read_command', input: { name: 'read_issue' } }]);
    assert.deepEqual(thay, [{ cong: 'rambo', tools, t: 45_000 }, { cong: 'modelapi', tools, t: 120_000 }]);
  });
});

// ─── Phần 4 (22/10/2026): adapter THẬT đọc tool call trong luồng (Anthropic + OpenAI), HTTP giả ───

describe('llmComplete thật — tool gốc trong luồng (HTTP giả)', () => {
  let srv: http.Server;
  let goc = '';
  const than: Array<Record<string, unknown>> = [];
  before(async () => {
    srv = http.createServer((req, res) => {
      let raw = '';
      req.on('data', (c) => { raw += c; });
      req.on('end', () => {
        const body = raw ? JSON.parse(raw) : {};
        than.push(body);
        res.writeHead(200, { 'content-type': 'text/event-stream' });
        const gui = (o: unknown) => res.write(`data: ${JSON.stringify(o)}\n\n`);
        if (req.url?.startsWith('/an/v1/messages')) {
          gui({ type: 'message_start', message: { usage: { input_tokens: 9 } } });
          gui({ type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } });
          gui({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Để tôi đọc.' } });
          gui({ type: 'content_block_start', index: 1, content_block: { type: 'tool_use', id: 't1', name: 'read_command', input: {} } });
          gui({ type: 'content_block_delta', index: 1, delta: { type: 'input_json_delta', partial_json: '{"name":"read_' } });
          gui({ type: 'content_block_delta', index: 1, delta: { type: 'input_json_delta', partial_json: 'issue","args":{"issue":75}}' } });
          gui({ type: 'content_block_start', index: 2, content_block: { type: 'tool_use', id: 't2', name: 'read_page', input: {} } });
          gui({ type: 'content_block_delta', index: 2, delta: { type: 'input_json_delta', partial_json: '{"number":3}' } });
          gui({ type: 'message_delta', delta: { stop_reason: 'tool_use' }, usage: { output_tokens: 20 } });
          res.end();
          return;
        }
        // OpenAI: chỉ tool call, không có chữ — KHÔNG được coi là "stream produced no text".
        gui({ choices: [{ delta: { tool_calls: [{ index: 0, id: 'c1', type: 'function', function: { name: 'search_pages', arguments: '' } }] } }] });
        gui({ choices: [{ delta: { tool_calls: [{ index: 0, function: { arguments: '{"query":' } }] } }] });
        gui({ choices: [{ delta: { tool_calls: [{ index: 0, function: { arguments: '"git"}' } }] } }] });
        gui({ choices: [{ delta: {}, finish_reason: 'tool_calls' }], usage: { prompt_tokens: 5, completion_tokens: 6 } });
        res.end('data: [DONE]\n\n');
      });
    });
    await new Promise<void>((r) => srv.listen(0, '127.0.0.1', () => r()));
    goc = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
    process.env.LLM_DAILY_COST_HARD_USD = '0';
    process.env.LLM_DAILY_COST_SOFT_USD = '0';
  });
  after(() => srv.close());
  const tools = [{ name: 'read_command', description: 'đọc', parameters: { type: 'object', properties: { name: { type: 'string' } } } }];

  it('Anthropic: tool_use + input_json_delta ⇒ toolCalls; body gửi tools dạng input_schema', async () => {
    const { llmComplete } = await import('../interview/llm/index.js');
    than.length = 0;
    const chu: string[] = [];
    const r = await llmComplete({
      step: 'report', system: 's', messages: [{ role: 'user', content: 'hỏi' }], maxTokens: 100, feature: 'work', purpose: 'work_assistant', maxRetries: 0,
      diemCuoi: { root: `${goc}/an`, key: 'k', local: false, label: 'thu', giaoThuc: 'anthropic' }, model: 'claude-thu', tools, onToken: (d) => chu.push(d),
    });
    assert.deepEqual(r.toolCalls, [{ name: 'read_command', input: { name: 'read_issue', args: { issue: 75 } } }, { name: 'read_page', input: { number: 3 } }]);
    assert.equal(r.text, 'Để tôi đọc.');
    assert.equal(r.biCat, false);
    assert.deepEqual((than[0].tools as unknown[])[0], { name: 'read_command', description: 'đọc', input_schema: tools[0].parameters });
  });

  it('OpenAI: delta.tool_calls ghép theo index ⇒ toolCalls; chữ rỗng KHÔNG phải lỗi; body gửi tools dạng function', async () => {
    const { llmComplete } = await import('../interview/llm/index.js');
    than.length = 0;
    const r = await llmComplete({
      step: 'report', system: 's', messages: [{ role: 'user', content: 'hỏi' }], maxTokens: 100, feature: 'work', purpose: 'work_assistant', maxRetries: 0,
      diemCuoi: { root: `${goc}/oa`, key: 'k', local: false, label: 'thu' }, model: 'gpt-thu', tools, onToken: () => {},
    });
    assert.deepEqual(r.toolCalls, [{ name: 'search_pages', input: { query: 'git' } }]);
    assert.equal(r.text, '');
    assert.deepEqual((than[0].tools as unknown[])[0], { type: 'function', function: { name: 'read_command', description: 'đọc', parameters: tools[0].parameters } });
  });
});

// ─── Phần 5 (22/10/2026, chủ web chốt lần 2): rambo fable-5 → chính hãng Sonnet 5.5 → chính hãng Haiku 5.5 → modelapi ───

describe('chuỗi cổng CT Work — thứ tự mới, Haiku dự phòng, trần $, env', () => {
  after(() => { _datCongChoTest(null); delete process.env.CTWORK_CHUOI_CONG; });

  it('thứ tự MẶC ĐỊNH: rambo → chính hãng Sonnet → chính hãng Haiku → modelapi', () => {
    delete process.env.CTWORK_CHUOI_CONG;
    assert.deepEqual(chuoiCtWork(), ['rambo', 'chinh_hang_sonnet', 'chinh_hang_haiku', 'modelapi']);
    assert.deepEqual(chuoiCongHienTai('work_assistant').map((b) => [b.bac, b.model]), [
      ['rambo', 'claude-fable-5'], ['chinh_hang_sonnet', 'claude-sonnet-5-5'], ['chinh_hang_haiku', 'claude-haiku-5-5'], ['modelapi', 'gpt-6-sol'],
    ]);
  });

  it('rambo hỏng ⇒ chính hãng SONNET 5.5 (im lặng, đúng bậc)', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async () => { goi.push('rambo'); throw new Error('fetch failed'); },
      chinhHangSanSang: async (_u, bac) => { goi.push(`san:${bac}`); return true; },
      goiChinhHang: async (_o, m) => { goi.push(`ch:${m}`); return ok('chinh_hang', m); },
    });
    const r = await goiAiCtWork(base);
    assert.equal(r.bac, 'chinh_hang_sonnet');
    assert.deepEqual(goi, ['rambo', 'san:sonnet', 'ch:claude-sonnet-5-5']);
  });

  it('chính hãng Sonnet HẾT TRẦN ⇒ Haiku 5.5 (khoản trần chồng thêm); Sonnet HỎNG ⇒ Haiku, báo cổng hỏng chỉ khi cả Haiku cũng hỏng', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => null,
      chinhHangSanSang: async (_u, bac) => bac === 'haiku', // Sonnet chạm trần, Haiku còn
      goiChinhHang: async (_o, m) => { goi.push(m); return ok('chinh_hang', m); },
    });
    const r = await goiAiCtWork(base);
    assert.equal(r.bac, 'chinh_hang_haiku');
    assert.deepEqual(goi, ['claude-haiku-5-5']);

    let bao = 0;
    const goi2: string[] = [];
    _datCongChoTest({
      rambo: () => null, chinhHangSanSang: async () => true,
      goiChinhHang: async (_o, m) => { goi2.push(m); if (m === 'claude-sonnet-5-5') throw new Error('Cổng chính hãng HTTP 529'); return ok('chinh_hang', m); },
      baoChinhHangHong: () => { bao++; },
    });
    assert.equal((await goiAiCtWork(base)).bac, 'chinh_hang_haiku');
    assert.deepEqual(goi2, ['claude-sonnet-5-5', 'claude-haiku-5-5']);
    assert.equal(bao, 0, 'Haiku chạy được ⇒ cổng không hỏng, không mở cầu dao');
  });

  it('trần $: mặc định 100/10 cho Sonnet, Haiku thêm 20/2; env đè; 0 = tắt', () => {
    const cu = process.env.WORK_AI_CHINH_HANG_USD_NGAY;
    delete process.env.WORK_AI_CHINH_HANG_USD_NGAY; // phần 2 đặt '0' cho cả tiến trình
    assert.deepEqual(tranChinhHang('sonnet'), { tong: 100, nguoi: 10 });
    assert.deepEqual(tranChinhHang('haiku'), { tong: 120, nguoi: 12 });
    assert.equal(trongTranChinhHang('sonnet', { ca: 99, nguoi: 9.9 }), true);
    assert.equal(trongTranChinhHang('sonnet', { ca: 100, nguoi: 1 }), false);
    assert.equal(trongTranChinhHang('sonnet', { ca: 5, nguoi: 10 }), false);
    assert.equal(trongTranChinhHang('haiku', { ca: 5, nguoi: 10 }), true, 'người hết trần Sonnet vẫn còn Haiku');
    assert.equal(trongTranChinhHang('haiku', { ca: 120, nguoi: 0 }), false);
    process.env.WORK_AI_CHINH_HANG_USD_NGAY = '0';
    process.env.WORK_AI_CHINH_HANG_HAIKU_USD_NGAY = '0';
    assert.equal(trongTranChinhHang('haiku', { ca: 0, nguoi: 0 }), false);
    process.env.WORK_AI_CHINH_HANG_USD_NGAY = '50';
    assert.deepEqual(tranChinhHang('sonnet'), { tong: 50, nguoi: 10 });
    delete process.env.WORK_AI_CHINH_HANG_HAIKU_USD_NGAY;
    if (cu === undefined) delete process.env.WORK_AI_CHINH_HANG_USD_NGAY; else process.env.WORK_AI_CHINH_HANG_USD_NGAY = cu;
  });

  it('model rambo: fable-5 ⇒ /v1/models không có ⇒ Sonnet rambo có (claude-sonnet-5); CTWORK_RAMBO_MODEL đè', async () => {
    const g = await import('../llm/gateway.js');
    g.datDsModelRambo(['claude-opus-5', 'claude-fable-5', 'claude-sonnet-5', 'claude-haiku-4-5']);
    assert.equal(modelRamboCho('work_assistant'), 'claude-fable-5');
    g.datDsModelRambo(['claude-opus-5', 'claude-sonnet-5', 'claude-haiku-4-5']);
    assert.equal(modelRamboCho('work_assistant'), 'claude-sonnet-5');
    assert.equal(modelRamboCho('work_spec_review'), 'claude-opus-5');
    process.env.CTWORK_RAMBO_MODEL = 'claude-opus-5';
    assert.equal(modelRamboCho('work_assistant'), 'claude-opus-5');
    process.env.CTWORK_RAMBO_MODEL = 'claude-khong-co';
    assert.equal(modelRamboCho('work_assistant'), 'claude-sonnet-5');
    delete process.env.CTWORK_RAMBO_MODEL;
    g.datDsModelRambo([]);
    assert.equal(modelRamboCho('work_assistant'), 'claude-fable-5', 'chưa đọc được danh sách ⇒ dùng model đã chọn');
  });

  it('CTWORK_CHUOI_CONG đè thứ tự (bí danh chinh_hang, tên lạ/trùng bị bỏ, rỗng ⇒ mặc định)', async () => {
    process.env.CTWORK_CHUOI_CONG = 'modelapi, chinh_hang ,rambo,xyz,modelapi';
    assert.deepEqual(chuoiCtWork(), ['modelapi', 'chinh_hang_sonnet', 'rambo']);
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (_o, _ep, m) => { goi.push(`rambo:${m}`); return ok('rambo', m); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async (_o, m) => { goi.push(`ch:${m}`); return ok('chinh_hang', m); },
      goiModelapi: async () => { goi.push('modelapi'); throw new Error('modelapi 503'); },
    });
    const r = await goiAiCtWork(base);
    assert.equal(r.bac, 'chinh_hang_sonnet');
    assert.deepEqual(goi, ['modelapi', 'ch:claude-sonnet-5-5']);
    process.env.CTWORK_CHUOI_CONG = 'abc';
    assert.deepEqual(chuoiCtWork(), ['rambo', 'chinh_hang_sonnet', 'chinh_hang_haiku', 'modelapi']);
    delete process.env.CTWORK_CHUOI_CONG;
  });

  it('rambo trả CÂU BÁO LỖI ("Verify your email…") với HTTP 200 ⇒ coi là hỏng: xoá nháp, bậc sau làm lại từ đầu', async () => {
    assert.equal(laCauLoiCong('Please verify your email address before using the API.'), true);
    assert.equal(laCauLoiCong('Insufficient balance, please top up.'), true);
    assert.equal(laCauLoiCong('### Việc hôm nay\n- LFD-7'), false);
    let restart = 0;
    let hoiNoi = 0;
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (o, _ep, m) => { o.onToken?.('Verify your email to continue.'); return ok('rambo', m, 'Verify your email to continue.'); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async (o, m) => { assert.deepEqual(o.messages, base.messages); return ok('chinh_hang', m, 'trả lời thật'); },
    });
    const r = await goiAiCtWork({ ...base, onToken: () => {}, onRestart: () => { restart++; }, noiTiep: () => { hoiNoi++; return null; } });
    assert.equal(r.text, 'trả lời thật');
    assert.equal(restart, 1);
    assert.equal(hoiNoi, 0, 'không "viết tiếp" một câu báo lỗi');
  });

  it('boQuaCong: bỏ qua cổng vừa trả markup — trừ bậc CUỐI', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (_o, _ep, m) => { goi.push('rambo'); return ok('rambo', m); },
      chinhHangSanSang: async () => false,
      goiModelapi: async (_o, m) => { goi.push('modelapi'); return ok('modelapi', m); },
    });
    assert.equal((await goiAiCtWork({ ...base, boQuaCong: ['rambo'] })).cong, 'modelapi');
    process.env.CTWORK_CHUOI_CONG = 'modelapi,rambo';
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (_o, _ep, m) => { goi.push('rambo-cuoi'); return ok('rambo', m); },
      goiModelapi: async () => { throw new Error('modelapi 503'); },
    });
    assert.equal((await goiAiCtWork({ ...base, boQuaCong: ['rambo'] })).cong, 'rambo', 'rambo là bậc cuối ⇒ vẫn gọi');
    delete process.env.CTWORK_CHUOI_CONG;
    assert.deepEqual(goi, ['modelapi', 'rambo-cuoi']);
  });
});
