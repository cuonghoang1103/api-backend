/**
 * QA đợt 6 (e14d0a60): APP CŨ (desktop ≤ 0.5.200, CLI ≤ 0.5.0, extension ≤ 0.7.0) kiểm mã model bằng z.enum CỐ ĐỊNH
 * (`3d3d3bf2:desktop/src/shared/ipc.ts › modelAgentSchema`). Máy chủ trả cho app cũ (không có `?bang=cm`) phải nằm
 * TRỌN trong enum đó, và mã cũ gửi lên `/agent/turn` phải đổi về ĐÚNG model qua `BI_DANH`.
 *
 *   npx tsx --test src/services/agent/appCu.test.ts
 */
import assert from 'node:assert/strict';
import test from 'node:test';

process.env.JWT_SECRET ||= 'bi-mat-chi-de-test-app-cu';

const { MA_CU, MA_MAC_DINH, bangModel, laMaCuongMini, maChoAppCu, timModel } = await import('./bangModel.js');
const { mucChoApp } = await import('./anthropicChinhHang/dinhTuyen.js');

/** Chép NGUYÊN VĂN từ 3d3d3bf2:desktop/src/shared/ipc.ts (bản app cũ đang chạy ở máy người dùng). */
const ENUM_APP_CU = new Set([
  'sonnet-5', 'opus-4-8', 'gpt-sol',
  'haiku-4-5', 'sonnet-4-6', 'opus-4-6', 'opus-4-7',
  'opus-5', 'fable-5',
  'cl-free', 'cl-sonnet-5-5', 'cl-opus-5-5', 'cl-fable-5-1',
]);
const RAMBO_IDS = ['haiku-4-5', 'sonnet-4-6', 'sonnet-5', 'opus-4-6', 'opus-4-7', 'opus-4-8', 'opus-5', 'fable-5'];

const tatCaQuyen = [
  { laAdmin: false, modelCao: false, invisible: false },
  { laAdmin: false, modelCao: true, invisible: true },
  { laAdmin: true, modelCao: true, invisible: true },
];

test('app cũ (không ?bang=cm): MỌI id + model/macDinh nằm trong z.enum cũ', () => {
  for (const q of tatCaQuyen) {
    const ds = bangModel().map((m) => mucChoApp(m, q, true));
    /* rambo bật lại ⇒ máy chủ nối thêm mã rambo — vẫn phải lọt enum cũ. */
    const coRambo = [...ds, ...RAMBO_IDS.map((id) => ({ id }))];
    for (const m of maChoAppCu(coRambo, true)) assert.ok(ENUM_APP_CU.has(m.id), `app cũ nhận mã lạ "${m.id}" ⇒ "Dữ liệu gửi lên không hợp lệ cho agent:datModel"`);
  }
  const macDinhCu = MA_CU[MA_MAC_DINH] ?? MA_MAC_DINH;
  assert.ok(ENUM_APP_CU.has(macDinhCu), `model/macDinh cho app cũ "${macDinhCu}" phải nằm trong enum cũ`);
});

test('app cũ: model chưa có mã cũ (Nova/Shin/Eco) bị ẩn, phần còn lại giữ đúng thứ tự năng lực', () => {
  const ds = maChoAppCu(bangModel().map((m) => ({ id: m.id, ten: m.ten })), true);
  assert.deepEqual(ds.map((m) => m.ten), ['CuongMini Invisible', 'CuongMini Optimum 5.5', 'CuongMini Sonic 5.5', 'CuongMini Solid', 'CuongMini Heshin 5.5'].map((t) => (t === 'CuongMini Invisible' ? bangModel()[0]!.ten : t)));
});

test('app mới (?bang=cm): giữ nguyên mã cm-* và đủ 8 model', () => {
  const ds = maChoAppCu(bangModel().map((m) => ({ id: m.id })), false);
  assert.equal(ds.length, bangModel().length);
  assert.ok(ds.every((m) => m.id.startsWith('cm-')));
});

test('mã cũ gửi lên /agent/turn ⇒ máy chủ đổi về ĐÚNG model (BI_DANH), không rơi về mặc định', () => {
  for (const [cm, cu] of Object.entries(MA_CU)) {
    assert.ok(laMaCuongMini(cu), `${cu} phải được nhận là mã CuongMini`);
    assert.equal(timModel(cu).id, cm, `${cu} ⇒ ${cm}`);
  }
});
