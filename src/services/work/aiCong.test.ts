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

const { goiAiCtWork, _datCongChoTest, modelRamboCho, modelChinhHangCho, modelModelapiCho } = await import('./aiCong.js');
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

  it('rambo sống ⇒ trả lời bằng rambo (Sonnet)', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (_o, _ep, model) => { goi.push(`rambo:${model}`); return ok('rambo', model); },
      chinhHangSanSang: async () => { goi.push('ch?'); return true; },
      goiModelapi: async (_o, m) => { goi.push(`modelapi:${m}`); return ok('modelapi', m); },
    });
    const r = await goiAiCtWork(base);
    assert.equal(r.cong, 'rambo');
    assert.match(goi[0], /^rambo:claude-sonnet/);
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
    assert.match(modelRamboCho('work_assistant'), /^claude-sonnet/);
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
    assert.match(rambo!.model ?? '', /^claude-sonnet/);
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
