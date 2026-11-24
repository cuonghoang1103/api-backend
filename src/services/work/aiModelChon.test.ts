/**
 * 24/11/2026 — ô chọn model của trợ lý CT Work. `npx tsx --test src/services/work/aiModelChon.test.ts`
 * Không chọn ⇒ chuỗi mặc định y nguyên. Chọn ⇒ model đó ở chính hãng → cùng model ở gwai → chuỗi mặc định → GPT,
 * tự chuyển im lặng trong cùng lượt; admin không chịu trần $ CT Work ở bậc chọn; việc nền (digest) bỏ qua lựa chọn.
 */
import assert from 'node:assert/strict';
import { after, describe, it } from 'node:test';

process.env.STORAGE_SANDBOX ??= '1';
delete process.env.GWAI_BASE_URL;
delete process.env.GWAI_API_KEY;

const { goiAiCtWork, _datCongChoTest, chuoiChoLuot, chayVoiModelChon } = await import('./aiCong.js');
type Opts = Parameters<typeof goiAiCtWork>[0];

const EP = { root: 'http://gwai.test', key: 'k', local: false, label: 'cong-agent', giaoThuc: 'anthropic' as const };
const ok = (cong: 'rambo' | 'chinh_hang' | 'modelapi', model: string) => ({ text: `từ ${cong}`, model, inputTokens: 1, outputTokens: 1, cong });
const base: Opts = { system: 's', messages: [{ role: 'user', content: 'hỏi' }], maxTokens: 100, userId: 1, purpose: 'work_assistant' };
const loi = (s: number) => Object.assign(new Error(`anthropic HTTP ${s}`), { httpStatus: s });

describe('chuỗi bậc theo lựa chọn (thuần)', () => {
  it('không chọn ⇒ chuỗi mặc định; chọn ⇒ thêm 2 bậc đầu; việc nền bỏ qua lựa chọn', () => {
    assert.deepEqual(chuoiChoLuot(null, 'work_assistant'), ['rambo', 'chinh_hang_sonnet', 'chinh_hang_haiku', 'modelapi']);
    assert.deepEqual(chuoiChoLuot({ ma: 'cm-optimum', laAdmin: false }, 'work_assistant').slice(0, 3), ['chon_chinh_hang', 'chon_gwai', 'rambo']);
    assert.deepEqual(chuoiChoLuot({ ma: 'cm-optimum', laAdmin: false }, 'work_digest'), chuoiChoLuot(null, 'work_digest'));
  });
});

describe('gọi trợ lý với model đã chọn — phụ thuộc giả', () => {
  after(() => _datCongChoTest(null));

  it('không chọn ⇒ y như cũ (gwai/rambo bậc đầu, không gọi bậc chọn)', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      goiRambo: async (_o, _e, m) => { goi.push(`gwai:${m}`); return ok('rambo', m); },
      chinhHangCoKey: async () => { goi.push('coKey?'); return true; },
    });
    await goiAiCtWork(base);
    assert.deepEqual(goi, ['gwai:claude-fable-5']);
  });

  it('chọn Max ⇒ Opus 5.5 chính hãng trước', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      chinhHangSanSang: async () => true,
      goiChinhHang: async (_o, m) => { goi.push(`ch:${m}`); return ok('chinh_hang', m); },
      goiRambo: async (_o, _e, m) => { goi.push(`gwai:${m}`); return ok('rambo', m); },
    });
    const r = await goiAiCtWork({ ...base, modelChon: { ma: 'cm-optimum', laAdmin: false } });
    assert.equal(r.bac, 'chon_chinh_hang');
    assert.deepEqual(goi, ['ch:claude-opus-5-5']);
  });

  it('chọn Max, chính hãng hết key ⇒ CÙNG model trên gwai (không lỗi)', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      chinhHangSanSang: async () => false,
      goiChinhHang: async (_o, m) => { goi.push(`ch:${m}`); return ok('chinh_hang', m); },
      goiRambo: async (_o, _e, m) => { goi.push(`gwai:${m}`); return ok('rambo', m); },
    });
    const r = await goiAiCtWork({ ...base, modelChon: { ma: 'cm-optimum', laAdmin: false } });
    assert.equal(r.bac, 'chon_gwai');
    assert.deepEqual(goi, ['gwai:claude-opus-5-5']);
  });

  it('chọn Pro 2: chính hãng 529 + gwai 503 ⇒ rơi về chuỗi mặc định rồi GPT, cùng lượt', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      chinhHangSanSang: async () => true,
      goiChinhHang: async (_o, m) => { goi.push(`ch:${m}`); throw new Error('Cổng chính hãng HTTP 529'); },
      goiRambo: async (_o, _e, m) => { goi.push(`gwai:${m}`); throw loi(503); },
      baoChinhHangHong: () => {},
      goiModelapi: async (_o, m) => { goi.push(`gpt:${m}`); return ok('modelapi', m); },
    });
    const r = await goiAiCtWork({ ...base, modelChon: { ma: 'cm-sonic', laAdmin: false } });
    assert.equal(r.cong, 'modelapi');
    /* Bậc chính hãng Sonnet của chuỗi mặc định KHÔNG gọi lại đúng model vừa hỏng. */
    assert.equal(goi.filter((g) => g === 'ch:claude-sonnet-5-5').length, 1);
    assert.equal(goi[0], 'ch:claude-sonnet-5-5');
    assert.ok(goi[1].startsWith('gwai:'));
    assert.equal(goi.at(-1), 'gpt:gpt-6-sol');
  });

  it('admin: bậc chọn chỉ cần có key (không xét trần $ CT Work)', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      chinhHangSanSang: async () => { goi.push('tran?'); return false; },
      chinhHangCoKey: async () => true,
      goiChinhHang: async (_o, m) => { goi.push(`ch:${m}`); return ok('chinh_hang', m); },
    });
    const r = await goiAiCtWork({ ...base, modelChon: { ma: 'cm-invisible', laAdmin: true } });
    assert.equal(r.bac, 'chon_chinh_hang');
    assert.deepEqual(goi, ['ch:claude-fable-5-2']);
  });

  it('lựa chọn của LƯỢT đọc từ chayVoiModelChon (không luồn tham số qua chat())', async () => {
    const goi: string[] = [];
    _datCongChoTest({
      rambo: () => EP, ramboDangNghi: () => false,
      chinhHangSanSang: async () => false,
      goiRambo: async (_o, _e, m) => { goi.push(`gwai:${m}`); return ok('rambo', m); },
    });
    await chayVoiModelChon({ ma: 'cm-optimum', laAdmin: false }, () => goiAiCtWork(base));
    await goiAiCtWork(base);
    assert.deepEqual(goi, ['gwai:claude-opus-5-5', 'gwai:claude-fable-5']);
  });
});
