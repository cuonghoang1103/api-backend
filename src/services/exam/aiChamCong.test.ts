/**
 * Chuỗi cổng chấm bài phòng thi (24/10/2026) — `npx tsx --test src/services/exam/aiChamCong.test.ts`
 *
 * Phụ thuộc giả (không gọi cổng thật): rambo Opus 5 → chính hãng Sonnet 5.5 → modelapi gpt-6-sol; rambo 410 ⇒ chính hãng;
 * chính hãng vượt trần / lỗi ⇒ modelapi (+ báo cổng hỏng); cầu dao mở ⇒ bỏ rambo; trả rỗng / câu báo lỗi của cổng ⇒ bậc
 * sau; ẢNH đi nguyên vẹn cả 3 bậc và lượt có ảnh ở modelapi luôn là gpt-6-sol; hết trần tiền web ⇒ báo thẳng; trần riêng.
 */
import assert from 'node:assert/strict';
import { after, afterEach, describe, it } from 'node:test';

process.env.STORAGE_SANDBOX ??= '1';

const {
  goiChamThi, _datCongChamThiChoTest, modelRamboChamThi, modelChinhHangChamThi, modelModelapiChamThi, tranChinhHangChamThi,
  trongTranChamThi, examDiRambo, coAnh, chuoiChamThiHienTai,
} = await import('./aiChamCong.js');
type Opts = Parameters<typeof goiChamThi>[0];
const { AppError } = await import('../../middleware/errorHandler.js');

function loi(status: number) {
  const e = new Error(`anthropic HTTP ${status}`) as Error & { httpStatus?: number };
  e.httpStatus = status;
  return e;
}
const JSON_OK = '{"score":80,"verdict":"good","summary":"ok|||ổn","criteria":[],"suggestions":[]}';
const ok = (cong: 'rambo' | 'chinh_hang' | 'modelapi', model: string, text = JSON_OK) => ({ text, model, inputTokens: 1, outputTokens: 1, cong });
const base: Opts = { system: 's', messages: [{ role: 'user', content: 'chấm' }], maxTokens: 100, userId: 7 };
const EP = { root: 'http://rambo.test', key: 'k', local: false, label: 'cong-agent', giaoThuc: 'anthropic' as const };

const ENV_KEYS = ['EXAM_RAMBO', 'EXAM_RAMBO_MODEL', 'EXAM_MODEL_CHINH_HANG', 'EXAM_CHINH_HANG_USD_NGAY', 'EXAM_CHINH_HANG_USD_NGUOI_NGAY', 'LLM_MODEL_EXAM_GRADE'];
const envCu = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
const traEnv = () => { for (const k of ENV_KEYS) { if (envCu[k] === undefined) delete process.env[k]; else process.env[k] = envCu[k]; } };
for (const k of ENV_KEYS) delete process.env[k];

describe('chuỗi cổng chấm bài phòng thi — phụ thuộc giả', () => {
  afterEach(() => { for (const k of ENV_KEYS) delete process.env[k]; });
  after(() => { _datCongChamThiChoTest(null); traEnv(); });

  it('rambo sống ⇒ chấm bằng rambo claude-opus-5, không đụng bậc sau', async () => {
    const goi: string[] = [];
    _datCongChamThiChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (_o, _ep, m) => { goi.push(`rambo:${m}`); return ok('rambo', m); },
      chinhHangSanSang: async () => { goi.push('ch?'); return true; },
      goiModelapi: async (_o, m) => { goi.push(`modelapi:${m}`); return ok('modelapi', m); },
    });
    const r = await goiChamThi(base);
    assert.equal(r.cong, 'rambo');
    assert.equal(r.bac, 'rambo');
    assert.deepEqual(goi, ['rambo:claude-opus-5']);
  });

  it('rambo 410 ⇒ TỰ sang chính hãng claude-sonnet-5-5 trong cùng lượt', async () => {
    const goi: string[] = [];
    _datCongChamThiChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async () => { goi.push('rambo'); throw loi(410); },
      chinhHangSanSang: async (uid) => { goi.push(`ch?${uid}`); return true; },
      goiChinhHang: async (_o, m) => { goi.push(`ch:${m}`); return ok('chinh_hang', m); },
      goiModelapi: async (_o, m) => { goi.push(`modelapi:${m}`); return ok('modelapi', m); },
    });
    const r = await goiChamThi(base);
    assert.equal(r.cong, 'chinh_hang');
    assert.equal(r.bac, 'chinh_hang_sonnet');
    assert.deepEqual(goi, ['rambo', 'ch?7', 'ch:claude-sonnet-5-5']);
  });

  it('rambo hỏng + chính hãng VƯỢT TRẦN (không sẵn sàng) ⇒ modelapi gpt-6-sol, không gọi chính hãng', async () => {
    let goiCh = 0;
    _datCongChamThiChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async () => { throw loi(502); },
      chinhHangSanSang: async () => false,
      goiChinhHang: async (_o, m) => { goiCh++; return ok('chinh_hang', m); },
      goiModelapi: async (_o, m) => ok('modelapi', m),
    });
    const r = await goiChamThi(base);
    assert.equal(r.cong, 'modelapi');
    assert.equal(r.model, 'gpt-6-sol');
    assert.equal(goiCh, 0);
  });

  it('chính hãng lỗi 529 ⇒ modelapi; báo cổng chính hãng hỏng', async () => {
    let baoHong = 0;
    _datCongChamThiChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async () => { throw loi(410); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async () => { throw new Error('Cổng chính hãng HTTP 529'); },
      baoChinhHangHong: () => { baoHong++; },
      goiModelapi: async (_o, m) => ok('modelapi', m),
    });
    const r = await goiChamThi(base);
    assert.equal(r.cong, 'modelapi');
    assert.equal(baoHong, 1);
  });

  it('cầu dao rambo đang mở / rambo tắt ⇒ không gọi rambo', async () => {
    for (const p of [{ rambo: () => EP, ramboDangNghi: () => true }, { rambo: () => null, ramboDangNghi: () => false }]) {
      let ramboGoi = false;
      _datCongChamThiChoTest({
        ...p,
        goiRambo: async (_o, _ep, m) => { ramboGoi = true; return ok('rambo', m); },
        chinhHangSanSang: async () => true,
        goiChinhHang: async (_o, m) => ok('chinh_hang', m),
      });
      const r = await goiChamThi(base);
      assert.equal(ramboGoi, false);
      assert.equal(r.cong, 'chinh_hang');
    }
  });

  it('trả RỖNG hoặc câu báo lỗi của cổng (HTTP 200) ⇒ coi là hỏng, sang bậc sau', async () => {
    _datCongChamThiChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (_o, _ep, m) => ok('rambo', m, '   '),
      chinhHangSanSang: async () => true,
      goiChinhHang: async (_o, m) => ok('chinh_hang', m, 'Insufficient balance, please top up'),
      baoChinhHangHong: () => {},
      goiModelapi: async (_o, m) => ok('modelapi', m),
    });
    const r = await goiChamThi(base);
    assert.equal(r.cong, 'modelapi');
    assert.equal(r.text, JSON_OK);
  });

  it('ẢNH đi NGUYÊN VẸN cả 3 bậc; lượt có ảnh ở modelapi luôn gpt-6-sol (kể cả LLM_MODEL_EXAM_GRADE=gpt-5.4-mini)', async () => {
    process.env.LLM_MODEL_EXAM_GRADE = 'gpt-5.4-mini';
    const anh = { type: 'image' as const, source: { type: 'base64' as const, media_type: 'image/png', data: 'iVBORw0KGgo=' } };
    const o: Opts = { ...base, messages: [{ role: 'user', content: [anh, { type: 'text', text: 'Grade the diagram' }] }] };
    assert.equal(coAnh(o.messages), true);
    assert.equal(coAnh(base.messages), false);
    const thay: Array<{ cong: string; msgs: unknown }> = [];
    let modelapiModel = '';
    _datCongChamThiChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (x) => { thay.push({ cong: 'rambo', msgs: x.messages }); throw loi(500); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async (x) => { thay.push({ cong: 'chinh_hang', msgs: x.messages }); throw new Error('Cổng chính hãng HTTP 503'); },
      baoChinhHangHong: () => {},
      goiModelapi: async (x, m) => { thay.push({ cong: 'modelapi', msgs: x.messages }); modelapiModel = m; return ok('modelapi', m); },
    });
    const r = await goiChamThi(o);
    assert.equal(r.cong, 'modelapi');
    assert.deepEqual(thay.map((t) => t.cong), ['rambo', 'chinh_hang', 'modelapi']);
    for (const t of thay) assert.deepEqual(t.msgs, o.messages);
    assert.equal(modelapiModel, 'gpt-6-sol');
    // Lượt KHÔNG ảnh thì env GPT vẫn đè được.
    assert.equal(modelModelapiChamThi(false), 'gpt-5.4-mini');
  });

  it('hết trần TIỀN của cả web (BUDGET_EXCEEDED) ⇒ báo thẳng, không lùi tiếp', async () => {
    let modelapi = 0;
    _datCongChamThiChoTest({
      rambo: () => null, ramboDangNghi: () => false,
      chinhHangSanSang: async () => true,
      goiChinhHang: async () => { throw new AppError('hết trần', 429, 'BUDGET_EXCEEDED'); },
      goiModelapi: async (_o, m) => { modelapi++; return ok('modelapi', m); },
    });
    await assert.rejects(goiChamThi(base), (e: unknown) => (e as { code?: string }).code === 'BUDGET_EXCEEDED');
    assert.equal(modelapi, 0);
  });

  it('mọi bậc đều hỏng ⇒ ném lỗi của bậc CUỐI', async () => {
    _datCongChamThiChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async () => { throw loi(410); },
      chinhHangSanSang: async () => true,
      goiChinhHang: async () => { throw loi(529); },
      baoChinhHangHong: () => {},
      goiModelapi: async () => { throw new Error('modelapi HTTP 503 cuối'); },
    });
    await assert.rejects(goiChamThi(base), /modelapi HTTP 503 cuối/);
  });
});

describe('cấu hình chuỗi chấm bài', () => {
  afterEach(() => { for (const k of ENV_KEYS) delete process.env[k]; });
  after(traEnv);

  it('trần chính hãng mặc định 15 $/ngày · 1,5 $/người; env đè; tổng 0 ⇒ không dùng bậc', () => {
    assert.deepEqual(tranChinhHangChamThi(), { tong: 15, nguoi: 1.5 });
    assert.equal(trongTranChamThi({ ca: 14.9, nguoi: 1.4 }), true);
    assert.equal(trongTranChamThi({ ca: 15, nguoi: 0 }), false);
    assert.equal(trongTranChamThi({ ca: 1, nguoi: 1.5 }), false);
    process.env.EXAM_CHINH_HANG_USD_NGAY = '40';
    process.env.EXAM_CHINH_HANG_USD_NGUOI_NGAY = '0';
    assert.deepEqual(tranChinhHangChamThi(), { tong: 40, nguoi: 0 });
    assert.equal(trongTranChamThi({ ca: 39, nguoi: 99 }), true); // người 0 = không trần người
    process.env.EXAM_CHINH_HANG_USD_NGAY = '0';
    assert.equal(trongTranChamThi({ ca: 0, nguoi: 0 }), false);
    process.env.EXAM_CHINH_HANG_USD_NGAY = 'abc';
    assert.equal(tranChinhHangChamThi().tong, 15);
  });

  it('model theo env: EXAM_MODEL_CHINH_HANG, EXAM_RAMBO_MODEL, LLM_MODEL_EXAM_GRADE=claude-… áp ở rambo', () => {
    assert.equal(modelChinhHangChamThi(), 'claude-sonnet-5-5');
    process.env.EXAM_MODEL_CHINH_HANG = 'claude-haiku-5-5';
    assert.equal(modelChinhHangChamThi(), 'claude-haiku-5-5');
    assert.equal(modelRamboChamThi(), 'claude-opus-5');
    process.env.LLM_MODEL_EXAM_GRADE = 'claude-sonnet-5';
    assert.equal(modelRamboChamThi(), 'claude-sonnet-5');
    assert.equal(modelModelapiChamThi(), 'gpt-6-sol'); // model Claude không gọi qua modelapi
    process.env.EXAM_RAMBO_MODEL = 'claude-fable-5';
    assert.equal(modelRamboChamThi(), 'claude-fable-5');
  });

  it('EXAM_RAMBO=0 ⇒ tắt rambo riêng cho việc chấm; bảng admin có đủ 3 bậc', () => {
    process.env.EXAM_RAMBO = '0';
    assert.equal(examDiRambo(), null);
    const c = chuoiChamThiHienTai();
    assert.deepEqual(c.map((b) => b.bac), ['rambo', 'chinh_hang_sonnet', 'modelapi']);
    assert.equal(c[0].dungDuoc, false);
    assert.equal(c[1].model, 'claude-sonnet-5-5');
  });
});
