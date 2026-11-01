/**
 * Máy chấm `mutation` (01/11/2026) — bộ chạy Vitest thu gọn (RUNNER_SRC) + điều phối chấm + điểm/ngưỡng.
 *   npx tsx --test frontend/src/components/code-lab/cham/mutation.test.ts
 * RUNNER_SRC chạy trong `vm` (thay Worker) — cùng mã nguồn mà trình duyệt nạp. Đường Worker + quá giờ thật:
 * scripts/codelab-kiem-cham-trinh-duyet.mjs (Chromium dưới CSP web).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { RUNNER_SRC } from './mutationRunner';
import { chamMutation, ketQuaXanh, ketQuaDotBien, ketQuaVoHai, tepChoLuot, timTepTest, tuyChonTu, type LuotChay, type TestChay, type TuyChonChay } from './chamMutation';
import { chapNhan, demDotBien, tinhDiem } from './diem';
import type { TepMap, TestsJson } from './kieu';

type Runner = { chay: (d: { files: TepMap; tepTest: string[]; tranTestMs?: number } & TuyChonChay) => Promise<{ tests: TestChay[]; loiNap?: string; anhChup?: TepMap }> };

/** Mỗi lượt một ngữ cảnh vm MỚI — như một Worker mới. */
function runner(): Runner {
  // những gì Worker của trình duyệt có sẵn (route handler / msw cần Request/Response; crypto.randomUUID)
  const ctx = vm.createContext({ setTimeout, clearTimeout, console, crypto: globalThis.crypto, Request, Response, Headers, URL, URLSearchParams, TextEncoder, TextDecoder, structuredClone, AbortController });
  vm.runInContext(RUNNER_SRC, ctx);
  const r = (ctx as unknown as { __ctMutation: Runner }).__ctMutation;
  // kết quả từ realm vm ⇒ chép sang realm này (trình duyệt: structured clone qua postMessage)
  return { chay: async (d) => JSON.parse(JSON.stringify(await r.chay(d))) };
}
async function chayVm(files: TepMap, tepTest: string[], _timeoutMs?: number, tranTestMs?: number, tuy: TuyChonChay = {}): Promise<LuotChay> {
  const r = await runner().chay({ files, tepTest, tranTestMs: tranTestMs ?? 300, ...tuy });
  return { ...r, ms: 0 };
}
/** Chạy một tệp test với một module `src/m.js`. */
async function chay1(test: string, m = 'export const id = (x) => x;'): Promise<{ tests: TestChay[]; loiNap?: string }> {
  return runner().chay({ files: { 'src/m.js': m, 'src/m.test.js': test }, tepTest: ['src/m.test.js'], tranTestMs: 300 });
}
const HEAD = "import { describe, it, test, expect, beforeEach } from 'vitest';\nimport { id } from './m.js';\n";
const dat = (r: { tests: TestChay[] }) => r.tests.map((t) => t.dat);

describe('bộ chạy — matcher', () => {
  it('toBe / toEqual / toStrictEqual / toMatchObject / not', async () => {
    const r = await chay1(HEAD + `
it('toBe số', () => { expect(id(2)).toBe(2); });
it('toBe object thì đỏ (khác tham chiếu) + gợi ý toEqual', () => { expect(id({ a: 1 })).toBe({ a: 1 }); });
it('toEqual bỏ qua undefined', () => { expect({ a: 1, b: undefined }).toEqual({ a: 1 }); });
it('toStrictEqual không bỏ qua', () => { expect({ a: 1, b: undefined }).toStrictEqual({ a: 1 }); });
it('toMatchObject một phần', () => { expect({ a: 1, b: { c: 2, d: 3 } }).toMatchObject({ b: { c: 2 } }); });
it('not', () => { expect(id(1)).not.toBe(2); expect([1, 2]).not.toEqual([2, 1]); });
it('not sai thì đỏ', () => { expect(1).not.toBe(1); });
`);
    assert.deepEqual(dat(r), [true, false, true, false, true, true, false]);
    assert.match(r.tests[1].loi!, /Object\.is equality.*use toEqual/);
    assert.match(r.tests[6].loi!, /not to be 1/);
  });

  it('toThrow: kiểu lỗi, chuỗi, regex; quên hàm bọc ⇒ đỏ với lời nhắc', async () => {
    const m = "export function f(x) { if (x < 0) throw new RangeError('x must be >= 0, got ' + x); return x; }";
    const r = await chay1(`import { it, expect } from 'vitest'; import { f } from './m.js';
it('kiểu', () => { expect(() => f(-1)).toThrow(RangeError); });
it('kiểu sai', () => { expect(() => f(-1)).toThrow(TypeError); });
it('chuỗi', () => { expect(() => f(-1)).toThrow('must be'); });
it('regex', () => { expect(() => f(-1)).toThrow(/got -1/); });
it('không ném', () => { expect(() => f(1)).toThrow(); });
it('not.toThrow', () => { expect(() => f(1)).not.toThrow(); });
it('quên bọc', () => { expect(f(-1)).toThrow(); });
`, m);
    assert.deepEqual(dat(r), [true, false, true, true, false, true, false]);
    assert.match(r.tests[6].loi!, /RangeError|FUNCTION/); // f(-1) ném ngay khi tính đối số
  });

  it('toThrow với giá trị không phải hàm ⇒ lỗi nói rõ phải bọc', async () => {
    const r = await chay1(HEAD + "it('x', () => { expect(5).toThrow(); });");
    assert.match(r.tests[0].loi!, /expects a FUNCTION/);
  });

  it('toBeCloseTo: mặc định 2 chữ số, numDigits chặt hơn', async () => {
    const r = await chay1(HEAD + `
it('0.1+0.2 toBe 0.3 đỏ', () => { expect(0.1 + 0.2).toBe(0.3); });
it('0.1+0.2 closeTo', () => { expect(0.1 + 0.2).toBeCloseTo(0.3); });
it('0.18 vs 0.1786 mặc định đạt', () => { expect(0.18).toBeCloseTo(0.1786); });
it('0.18 vs 0.1786 4 chữ số đỏ', () => { expect(0.18).toBeCloseTo(0.1786, 4); });
`);
    assert.deepEqual(dat(r), [false, true, true, false]);
  });

  it('các matcher còn lại', async () => {
    const r = await chay1(HEAD + `
it('ok', () => {
  expect('').toBeFalsy(); expect({}).toBeTruthy(); expect(null).toBeNull(); expect(undefined).toBeUndefined();
  expect(0).toBeDefined(); expect(NaN).toBeNaN(); expect([1, 2, 3]).toContain(2); expect('abc').toContain('b');
  expect([{ a: 1 }]).toContainEqual({ a: 1 }); expect([1, 2]).toHaveLength(2); expect({ a: { b: 2 } }).toHaveProperty('a.b', 2);
  expect({ a: 1 }).not.toHaveProperty('b'); expect('hello').toMatch(/ell/); expect(3).toBeGreaterThan(2);
  expect(3).toBeGreaterThanOrEqual(3); expect(2).toBeLessThan(3); expect(2).toBeLessThanOrEqual(2);
  expect(new RangeError('x')).toBeInstanceOf(Error); expect('s').toBeTypeOf('string');
});
it('matcher lạ ⇒ lỗi rõ', () => { expect(1).toMatchSnapshot(); });
`);
    assert.deepEqual(dat(r), [true, false]);
    assert.match(r.tests[1].loi!, /not available in the browser grader/);
  });

  it('resolves / rejects; expect.soft gom lỗi; expect.assertions', async () => {
    const r = await chay1(HEAD + `
it('resolves', async () => { await expect(Promise.resolve(3)).resolves.toBe(3); });
it('rejects toThrow', async () => { await expect(Promise.reject(new TypeError('bad'))).rejects.toThrow(TypeError); });
it('rejects nhưng resolve ⇒ đỏ', async () => { await expect(Promise.resolve(1)).rejects.toThrow(); });
it('soft', () => { expect.soft(1).toBe(2); expect.soft(2).toBe(2); });
it('assertions(2) mà chỉ 1', () => { expect.assertions(2); expect(1).toBe(1); });
`);
    assert.deepEqual(dat(r), [true, true, false, false, false]);
  });
});

describe('bộ chạy — cấu trúc', () => {
  it('requireAssertions: test không expect ⇒ đỏ', async () => {
    const r = await chay1(HEAD + "it('rỗng', () => { id(1); });");
    assert.equal(r.tests[0].dat, false);
    assert.match(r.tests[0].loi!, /requireAssertions/);
  });

  it('describe lồng + tên đầy đủ; beforeEach; skip/todo không tính; only lọc', async () => {
    const r = await chay1(HEAD + `
let n = 0;
describe('ngoài', () => {
  beforeEach(() => { n = 10; });
  describe('trong', () => {
    it('a', () => { n++; expect(n).toBe(11); });
    it('b', () => { n++; expect(n).toBe(11); });
  });
  it.skip('bỏ', () => { expect(1).toBe(2); });
  it.todo('sau');
});
`);
    assert.deepEqual(r.tests.map((t) => t.ten), ['ngoài › trong › a', 'ngoài › trong › b']);
    assert.deepEqual(dat(r), [true, true]);
    const o = await chay1(HEAD + "it('x', () => { expect(1).toBe(1); }); it.only('y', () => { expect(2).toBe(2); });");
    assert.deepEqual(o.tests.map((t) => t.ten), ['y']);
  });

  it('it.each: mảng (%s %i %#) và object ($key); mỗi hàng là một test', async () => {
    const r = await chay1(HEAD + `
it.each([[1, 1], [2, 2], [3, 4]])('id(%i) = %i (#%#)', (a, b) => { expect(id(a)).toBe(b); });
test.each([{ x: 'a', y: 'a' }, { x: 'b', y: 'b' }])('$x → $y', ({ x, y }) => { expect(id(x)).toBe(y); });
describe.each([[5]])('nhóm %i', (k) => { it('k', () => { expect(k).toBe(5); }); });
`);
    assert.deepEqual(r.tests.map((t) => t.ten), ['id(1) = 1 (#0)', 'id(2) = 2 (#1)', 'id(3) = 4 (#2)', 'a → a', 'b → b', 'nhóm 5 › k']);
    assert.deepEqual(dat(r), [true, true, false, true, true, true]);
  });

  it('import: đặt lại tên, namespace, default, import nhiều dòng, module lồng (./ và ../)', async () => {
    const files: TepMap = {
      'src/rules/time.js': "export function parseTime(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }\nexport default 7;",
      'src/rules/booking.js': "import { parseTime } from './time.js';\nexport const OPEN = 7 * 60;\nexport function len(a, b) { return parseTime(b) - parseTime(a); }\nexport { OPEN as MO };",
      'test/booking.test.js': `import {
  describe,
  it,
  expect,
} from 'vitest';
import * as B from '../src/rules/booking.js';
import bay, { parseTime as pt } from '../src/rules/time.js';
it('ns', () => { expect(B.len('08:00', '10:00')).toBe(120); expect(B.MO).toBe(420); });
it('default + rename', () => { expect(bay).toBe(7); expect(pt('01:30')).toBe(90); });`,
    };
    const r = await runner().chay({ files, tepTest: ['test/booking.test.js'] });
    assert.equal(r.loiNap, undefined);
    assert.deepEqual(dat(r), [true, true]);
  });

  it('lỗi nạp: import tên không có, module lạ, cú pháp sai', async () => {
    const a = await chay1("import { it } from 'vitest'; import { khongCo } from './m.js'; it('x', () => {});");
    assert.match(a.loiNap!, /does not provide an export named "khongCo"/);
    const b = await chay1("import { it } from 'vitest'; import { x } from 'lodash';");
    assert.match(b.loiNap!, /Cannot import "lodash" — the browser grader has "vitest"/);
    const c = await chay1("import { it } from 'vitest'\nit('x', () => { expect(1).toBe(1) ");
    assert.match(c.loiNap!, /SyntaxError/);
  });

  it('test async treo ⇒ đỏ sau trần thời gian một test', async () => {
    const r = await chay1(HEAD + "it('treo', async () => { await new Promise(() => {}); expect(1).toBe(1); });");
    assert.equal(r.tests[0].dat, false);
    assert.match(r.tests[0].loi!, /timed out/);
  });

  it('chế độ strict như ES module: gán biến chưa khai báo ⇒ đỏ', async () => {
    const r = await chay1(HEAD + "it('x', () => { chuaKhai = 1; expect(1).toBe(1); });");
    assert.match(r.tests[0].loi!, /ReferenceError/);
  });
});

describe('bộ chạy — vi, đồng hồ giả, so khớp bất đối xứng, it.fails, fast-check (Chương 2 khoá Testing)', () => {
  it('vi.fn / mockResolvedValueOnce / toHaveBeenCalledTimes / toHaveBeenCalledWith; vi.spyOn + restoreAllMocks', async () => {
    const r = await chay1(`import { it, expect, vi } from 'vitest';
it('fn', async () => {
  const f = vi.fn().mockReturnValueOnce(1).mockResolvedValue('ok');
  expect(f('a')).toBe(1);
  await expect(f('b')).resolves.toBe('ok');
  expect(f).toHaveBeenCalledTimes(2);
  expect(f).toHaveBeenCalledWith('b');
  expect(f).not.toHaveBeenCalledWith('c');
});
it('spy', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
  expect(Math.random()).toBe(0.5);
  vi.restoreAllMocks();
  expect(Math.random()).not.toBe(0.5);
});
it('không phải mock', () => { expect(() => 1).toHaveBeenCalled(); });`);
    assert.deepEqual(dat(r), [true, true, false]);
    assert.match(r.tests[2].loi!, /not a spy/);
  });

  it('đồng hồ giả: setTimeout + advanceTimersByTime(Async) + setSystemTime + Date; useRealTimers trả lại', async () => {
    const m = "export function sau(ms, f) { setTimeout(f, ms); }\nexport const bayGio = () => new Date().toISOString();\nexport function cho(ms) { return new Promise((r) => setTimeout(() => r('xong'), ms)); }";
    const r = await chay1(`import { it, expect, vi, afterEach } from 'vitest';
import { sau, bayGio, cho } from './m.js';
afterEach(() => { vi.useRealTimers(); });
it('timers', () => {
  vi.useFakeTimers();
  const f = vi.fn();
  sau(1000, f);
  vi.advanceTimersByTime(999); expect(f).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1); expect(f).toHaveBeenCalledTimes(1);
});
it('system time', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-16T01:00:00Z'));
  expect(bayGio()).toBe('2026-11-16T01:00:00.000Z');
  expect(new Date(0)).toBeInstanceOf(Date);
});
it('async', async () => {
  vi.useFakeTimers();
  const p = cho(5000);
  await vi.advanceTimersByTimeAsync(5000);
  await expect(p).resolves.toBe('xong');
});
it('runAllTimersAsync', async () => {
  vi.useFakeTimers();
  const p = cho(60000);
  await vi.runAllTimersAsync();
  await expect(p).resolves.toBe('xong');
});`, m);
    assert.deepEqual(dat(r), [true, true, true, true]);
  });

  it('expect.stringMatching / any / objectContaining trong toEqual; it.fails', async () => {
    const r = await chay1(HEAD + `
it('bất đối xứng', () => {
  expect({ code: 'LF-ABC', n: 3, at: new Date(0) }).toEqual({ code: expect.stringMatching(/^LF-/), n: expect.any(Number), at: expect.anything() });
  expect({ a: 1, b: 2 }).toEqual(expect.objectContaining({ a: 1 }));
  expect([1, 2, 3]).toEqual(expect.arrayContaining([3, 1]));
});
it.fails('biết là đang hỏng', () => { expect(1).toBe(2); });
it.fails('it.fails mà lại xanh ⇒ đỏ', () => { expect(1).toBe(1); });
`);
    assert.deepEqual(dat(r), [true, true, false]);
  });

  it('fast-check thu gọn: property đúng xanh; property sai báo phản ví dụ (biên đi trước, hạt giống cố định)', async () => {
    const r = await chay1(`import { it, expect } from 'vitest';
import fc from 'fast-check';
it('đúng', () => { fc.assert(fc.property(fc.integer({ min: 0, max: 1439 }), (m) => m >= 0 && m <= 1439)); expect(1).toBe(1); });
it('sai ở biên', () => { fc.assert(fc.property(fc.integer({ min: 0, max: 47 }).map((i) => i * 30), (m) => m < 1410)); });`);
    assert.deepEqual(dat(r), [true, false]);
    assert.match(r.tests[1].loi!, /Property failed[\s\S]*Counterexample: \[1410\]/);
  });
});

// ─── điều phối chấm ─────────────────────────────────────────────────────────────────

const IMPL = "export function needsApproval(seats, role) {\n  if (seats < 1) throw new RangeError('seats');\n  if (role === 'LECTURER') return false;\n  return seats > 30;\n}\n";
const tjMau = (extra: Partial<TestsJson> = {}): TestsJson => ({
  loai: 'mutation',
  impl: { 'src/a.js': IMPL },
  toiThieuTest: 2,
  kiem: [
    { i: 0, kiem: 'xanh', nhom: 'xanh', moTa: 'xanh với code đúng' },
    { i: 1, kiem: 'diet', nhom: 'dot-bien', moTa: 'M1 > thành >=', ma: { 'src/a.js': IMPL.replace('seats > 30', 'seats >= 30') }, goiY: 'test biên 30' },
    { i: 2, kiem: 'diet', nhom: 'dot-bien', moTa: 'M2 bỏ LECTURER', ma: { 'src/a.js': IMPL.replace("role === 'LECTURER'", 'false') }, goiY: 'test giảng viên' },
    { i: 3, kiem: 'diet', nhom: 'dot-bien', moTa: 'M3 vòng lặp', ma: { 'src/a.js': IMPL.replace("if (seats < 1)", 'while (seats < 1000) {} if (seats < 1)') }, an: true },
  ],
  ...extra,
});
const T = (body: string): TepMap => ({ 'src/a.js': '// bản sao người học sửa — máy chấm bỏ qua\nexport const needsApproval = () => true;', 'src/a.test.js': "import { it, expect } from 'vitest';\nimport { needsApproval } from './a.js';\n" + body });

/** Runner giả lập quá giờ cho đột biến vòng lặp (vm không huỷ được vòng lặp đồng bộ trong hàm async). */
const chayCoTimeout: typeof chayVm = async (files, tepTest, t, tr) => (/while \(seats < 1000\)/.test(files['src/a.js']) ? { tests: [], quaGio: true, ms: 0 } : chayVm(files, tepTest, t, tr));

describe('chamMutation — điều phối', () => {
  it('bộ test mạnh: xanh + diệt hết (quá giờ ở đột biến = diệt); dùng impl của ĐỀ, không dùng bản người học sửa', async () => {
    const files = T(`it('31 student', () => { expect(needsApproval(31, 'STUDENT')).toBe(true); });
it('30 student', () => { expect(needsApproval(30, 'STUDENT')).toBe(false); });
it('31 lecturer', () => { expect(needsApproval(31, 'LECTURER')).toBe(false); });`);
    const tj = tjMau();
    const kq = await chamMutation(tj, tj.kiem!, files, undefined, chayCoTimeout);
    assert.deepEqual(kq.map((r) => r.dat), [true, true, true, true]);
    assert.match(kq[3].thay!, /quá giờ/);
    assert.deepEqual(demDotBien(tj, kq), { xanh: true, diet: 3, tong: 3, nguong: 3 });
    assert.equal(chapNhan(tj, kq), true);
    assert.equal(tinhDiem(tj, kq).score, 100);
  });

  it('bộ test yếu: còn sống + gợi ý; ngưỡng k/n', async () => {
    const files = T(`it('31 student', () => { expect(needsApproval(31, 'STUDENT')).toBe(true); });
it('5 student', () => { expect(needsApproval(5, 'STUDENT')).toBe(false); });`);
    const tj = tjMau();
    const kq = await chamMutation(tj, tj.kiem!, files, undefined, chayCoTimeout);
    assert.deepEqual(kq.map((r) => r.dat), [true, false, false, true]);
    assert.match(kq[1].thay!, /Còn sống.*Gợi ý: test biên 30/);
    assert.equal(chapNhan(tj, kq), false);
    assert.equal(tinhDiem(tj, kq).score, 33);
    assert.equal(chapNhan({ ...tj, nguong: 1 }, kq), true);
  });

  it('test SAI với code đúng ⇒ kiểm xanh trượt, đột biến "chưa chấm", điểm 0', async () => {
    const files = T(`it('sai', () => { expect(needsApproval(30, 'STUDENT')).toBe(true); });
it('ok', () => { expect(needsApproval(31, 'STUDENT')).toBe(true); });`);
    const tj = tjMau();
    const kq = await chamMutation(tj, tj.kiem!, files, undefined, chayCoTimeout);
    assert.deepEqual(kq.map((r) => r.dat), [false, false, false, false]);
    assert.match(kq[0].thay!, /SAI với code đúng.*✗ sai/);
    assert.match(kq[1].thay!, /Chưa chấm/);
    assert.equal(tinhDiem(tj, kq).score, 0);
    assert.equal(chapNhan(tj, kq), false);
  });

  it('ít test hơn toiThieuTest ⇒ trượt; không có tệp test ⇒ trượt', async () => {
    const tj = tjMau({ toiThieuTest: 3 });
    const kq = await chamMutation(tj, tj.kiem!.slice(0, 1), T("it('a', () => { expect(needsApproval(31, 'X')).toBe(true); });"), undefined, chayVm);
    assert.match(kq[0].thay!, /Có 1 test, cần ít nhất 3/);
    const kq2 = await chamMutation(tj, tj.kiem!.slice(0, 1), { 'src/a.js': IMPL }, undefined, chayVm);
    assert.match(kq2[0].thay!, /Không thấy tệp test/);
  });

  it('tiện ích', () => {
    assert.deepEqual(timTepTest({ loai: 'mutation' }, { 'a.js': '', 'b.test.js': '', 'c.spec.mjs': '' }), ['b.test.js', 'c.spec.mjs']);
    assert.deepEqual(timTepTest({ loai: 'mutation', tepTest: 'x.test.js' }, { 'x.test.js': '', 'y.test.js': '' }), ['x.test.js']);
    assert.deepEqual(tepChoLuot({ 'a.js': 'người học', 'h.js': 'phụ', 't.test.js': 't' }, { 'a.js': 'đúng' }, { 'a.js': 'đột biến' }), { 'h.js': 'phụ', 't.test.js': 't', 'a.js': 'đột biến' });
    assert.equal(ketQuaXanh({ tests: [], quaGio: true, ms: 1 }, 1, true, 4000).dat, false);
    assert.equal(ketQuaDotBien({ tests: [], loiNap: 'x', ms: 1 }, null).dat, true);
  });
});

describe('điểm + ngưỡng', () => {
  const kq = (xanh: boolean, ...db: boolean[]) => [{ dat: xanh, nhom: 'xanh' }, ...db.map((d) => ({ dat: d, nhom: 'dot-bien' }))];
  it('tỉ lệ diệt; ngưỡng mặc định = tất cả; ngưỡng lớn hơn số đột biến bị kẹp', () => {
    const tj = { loai: 'mutation' };
    assert.equal(tinhDiem(tj, kq(true, true, true, false, false)).score, 50);
    assert.equal(chapNhan(tj, kq(true, true, true, true)), true);
    assert.equal(chapNhan({ loai: 'mutation', nguong: 2 }, kq(true, true, true, false)), true);
    assert.equal(chapNhan({ loai: 'mutation', nguong: 9 }, kq(true, true)), true);
    assert.equal(chapNhan({ loai: 'mutation', nguong: 1 }, kq(false, true)), false);
  });
  it('loại khác giữ luật cũ: đạt khi mọi kiểm đạt (bỏ qua kiểm boQua)', () => {
    assert.equal(chapNhan({ loai: 'js' }, [{ dat: true }, { dat: false, boQua: 'x' }]), true);
    assert.equal(chapNhan({ loai: 'js' }, [{ dat: true }, { dat: false }]), false);
    assert.equal(chapNhan({ loai: 'js' }, []), false);
  });
});

// ─── mở rộng 01/11/2026 cho 52 đề tự động của khoá Testing (Ch3 msw/vi.mock, Ch6.4 route handler, Ch8 shuffle/repeats,
//     Ch9 node:fs + yaml đi kèm đề, Ch10 golden master) ───
describe('bộ chạy — mở rộng Ch3–Ch10', () => {
  const chayN = (files: TepMap, tepTest: string[], tuy: TuyChonChay = {}) => runner().chay({ files, tepTest, tranTestMs: 300, ...tuy });

  it('vi.mock + vi.hoisted được đưa lên TRÊN import (như Vitest); vi.mocked; importActual trả module thật', async () => {
    const r = await chayN({
      'src/mail.js': "export async function send() { throw new Error('real network'); }\nexport const ten = 'that';",
      'src/remind.js': "import { send } from './mail.js';\nexport async function remind(to) { await send({ to, subject: 'tomorrow' }); return 'ok'; }",
      'src/r.test.js': `import { it, expect, vi } from 'vitest';
import { remind } from './remind.js';
const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('./mail.js', () => ({ send }));
it('dùng module giả', async () => {
  await expect(remind('an')).resolves.toBe('ok');
  expect(vi.mocked(send)).toHaveBeenCalledWith({ to: 'an', subject: 'tomorrow' });
});
it('importActual', async () => { const m = await vi.importActual('./mail.js'); expect(m.ten).toBe('that'); });`,
    }, ['src/r.test.js']);
    assert.deepEqual(dat(r), [true, true]);
    // biến KHÔNG hoisted dùng trong factory ⇒ lỗi TDZ như Vitest (bài 3.2: vi-mock-sai)
    const sai = await chayN({
      'src/mail.js': 'export async function send() {}',
      'src/remind.js': "import { send } from './mail.js';\nexport const s = send;",
      'src/r.test.js': "import { it, expect, vi } from 'vitest';\nimport { s } from './remind.js';\nconst send = vi.fn();\nvi.mock('./mail.js', () => ({ send }));\nit('x', () => { expect(s).toBe(send); });",
    }, ['src/r.test.js']);
    assert.match(sai.loiNap!, /before initialization|not defined/);
  });

  it('msw thu gọn: setupServer/http/HttpResponse, server.use ưu tiên, resetHandlers, error() ⇒ fetch từ chối, không handler ⇒ TypeError', async () => {
    const r = await chayN({
      'src/c.js': "export async function lay(id) { const res = await fetch('https://api.test/b/' + id, { headers: { authorization: 'Bearer k' } }); if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); }",
      'src/c.test.js': `import { it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { lay } from './c.js';
const thay = [];
const server = setupServer(http.get('https://api.test/b/:id', ({ request, params }) => { thay.push(request.headers.get('authorization')); return HttpResponse.json({ id: Number(params.id) }); }));
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
it('handler gốc + params + header', async () => { await expect(lay(7)).resolves.toEqual({ id: 7 }); expect(thay).toEqual(['Bearer k']); });
it('server.use thắng', async () => { server.use(http.get('https://api.test/b/:id', () => new HttpResponse(null, { status: 503 }))); await expect(lay(1)).rejects.toThrow('HTTP 503'); });
it('resetHandlers trả về handler gốc', async () => { await expect(lay(2)).resolves.toEqual({ id: 2 }); });
it('mạng hỏng', async () => { server.use(http.get('https://api.test/b/:id', () => HttpResponse.error())); await expect(lay(3)).rejects.toThrow(TypeError); });
it('không handler nào nhận', async () => { await expect(fetch('https://khac.test/')).rejects.toThrow(/without a matching request handler/); });`,
    }, ['src/c.test.js']);
    assert.deepEqual(dat(r), [true, true, true, true, true]);
  });

  it('node:fs đọc tệp CỦA ĐỀ qua new URL(…, import.meta.url); thư viện đi kèm đề (thuVien, CommonJS)', async () => {
    const r = await chayN({
      '.github/w.yml': 'name: CI\n',
      'src/ci/w.test.js': `import { it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'yaml';
const TEXT = readFileSync(new URL('../../.github/w.yml', import.meta.url), 'utf8');
it('đọc được', () => { expect(TEXT).toBe('name: CI\\n'); expect(parse(TEXT)).toEqual({ dong: 1 }); expect(existsSync('.github/w.yml')).toBe(true); });
it('tệp không có ⇒ ENOENT', () => { expect(() => readFileSync('nope.txt', 'utf8')).toThrow(/ENOENT/); });`,
    }, ['src/ci/w.test.js'], { thuVien: { yaml: 'module.exports = { parse: function (s) { return { dong: s.trim().split("\\n").length }; } };' } });
    assert.deepEqual(dat(r), [true, true]);
  });

  it('toMatchFileSnapshot: chưa có ⇒ ghi (anhChup) và đạt; có rồi ⇒ so, lệch thì nói dòng đầu khác', async () => {
    const files: TepMap = { 'src/r.js': "export const bc = (n) => 'A\\nB ' + n + '\\n';", 'src/r.test.js': "import { it, expect } from 'vitest';\nimport { bc } from './r.js';\nit('golden', async () => { await expect(bc(1)).toMatchFileSnapshot('./__ok__/r.txt'); });" };
    const a = await chayN(files, ['src/r.test.js']);
    assert.deepEqual(dat(a), [true]);
    assert.deepEqual(a.anhChup, { 'src/__ok__/r.txt': 'A\nB 1\n' });
    const b = await chayN({ ...files, 'src/r.js': "export const bc = (n) => 'A\\nB ' + (n + 1) + '\\n';", ...a.anhChup }, ['src/r.test.js']);
    assert.deepEqual(dat(b), [false]);
    assert.match(b.tests[0].loi!, /mismatched — first difference at line 2/);
  });

  it('beforeEach trả hàm dọn; afterEach chạy cả khi test đỏ; useFakeTimers({ toFake: [Date] }) giữ setTimeout thật; stubGlobal/stubEnv', async () => {
    const r = await chayN({ 'src/a.test.js': `import { it, expect, vi, beforeEach, afterEach } from 'vitest';
const log = [];
beforeEach(() => { vi.stubGlobal('fetch', async () => 'gia'); vi.stubEnv('API', 'http://x'); return () => { log.push('don'); vi.unstubAllGlobals(); vi.unstubAllEnvs(); }; });
afterEach(() => { log.push('after'); });
it('đỏ', () => { expect(1).toBe(2); });
it('dọn đã chạy sau test đỏ', async () => { expect(log).toEqual(['after', 'don']); expect(await fetch()).toBe('gia'); expect(process.env.API).toBe('http://x'); });
it('chỉ giả Date', async () => {
  vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-11-16T00:00:00Z'));
  await new Promise((r) => setTimeout(r, 1));
  expect(new Date().toISOString()).toBe('2026-11-16T00:00:00.000Z');
  vi.useRealTimers();
});` }, ['src/a.test.js']);
    assert.deepEqual(dat(r), [false, true, true]);
  });

  it('--sequence.shuffle (xaoTron, hạt giống cố định) bắt test phụ thuộc thứ tự; --repeats (lapLai) bắt test chập chờn', async () => {
    const thuTu: TepMap = { 'src/a.test.js': "import { it, expect } from 'vitest';\nlet x = 0;\n" + Array.from({ length: 6 }, (_, i) => `it('t${i}', () => { x++; expect(x).toBe(${i + 1}); });`).join('\n') };
    assert.ok(dat(await chayN(thuTu, ['src/a.test.js'])).every(Boolean));
    assert.ok(dat(await chayN(thuTu, ['src/a.test.js'], { xaoTron: 20261101 })).some((d) => !d));
    const chapChon: TepMap = { 'src/b.test.js': "import { it, expect } from 'vitest';\nlet n = 0;\nit('lần thứ 3 đỏ', () => { n++; expect(n % 3).not.toBe(0); });" };
    assert.deepEqual(dat(await chayN(chapChon, ['src/b.test.js'])), [true]);
    const lap = await chayN(chapChon, ['src/b.test.js'], { lapLai: 9 });
    assert.deepEqual(dat(lap), [false]);
    assert.match(lap.tests[0].loi!, /^\(repeat 2\)/);
  });

  it('restoreMocks (cấu hình khoá): spy của test trước được trả lại trước test sau; tắt được', async () => {
    const f: TepMap = { 'src/a.test.js': "import { it, expect, vi } from 'vitest';\nit('spy', () => { vi.spyOn(Math, 'max').mockReturnValue(-1); expect(Math.max(1, 2)).toBe(-1); });\nit('đã trả', () => { expect(Math.max(1, 2)).toBe(2); });" };
    assert.deepEqual(dat(await chayN(f, ['src/a.test.js'])), [true, true]);
    assert.deepEqual(dat(await chayN(f, ['src/a.test.js'], { restoreMocks: false })), [true, false]);
  });
});

describe('chamMutation — thay đổi vô hại + ảnh chụp + tuỳ chọn đề', () => {
  const IMPL2 = 'export function tong(ds) { let s = 0; for (let i = 0; i < ds.length; i++) s += ds[i]; return s; }\n';
  const tj: TestsJson = {
    loai: 'mutation', impl: { 'src/t.js': IMPL2 }, toiThieuTest: 1,
    kiem: [
      { i: 0, kiem: 'xanh', nhom: 'xanh', moTa: 'xanh' },
      { i: 1, kiem: 'diet', nhom: 'dot-bien', moTa: 'bỏ phần tử cuối', ma: { 'src/t.js': IMPL2.replace('i < ds.length', 'i < ds.length - 1') } },
      { i: 2, kiem: 'vo-hai', nhom: 'xanh', moTa: 'reduce thay for', ma: { 'src/t.js': 'export function tong(ds) { return ds.reduce((a, b) => a + b, 0); }\n' } },
    ],
  };
  const tep = (body: string): TepMap => ({ 'src/t.test.js': `import { it, expect } from 'vitest';\nimport { tong } from './t.js';\n${body}` });
  it('test hành vi: diệt + vẫn xanh với refactor ⇒ đạt', async () => {
    const kq = await chamMutation(tj, tj.kiem!, tep("it('1+2+3', () => { expect(tong([1, 2, 3])).toBe(6); });"), undefined, chayVm);
    assert.deepEqual(kq.map((r) => r.dat), [true, true, true]);
    assert.equal(chapNhan(tj, kq), true);
  });
  it('test khoá vào cách cài đặt (đọc mã nguồn) ⇒ đỏ với refactor ⇒ CHƯA đạt dù diệt hết', async () => {
    const kq = await chamMutation(tj, tj.kiem!, tep("it('dùng vòng for', () => { expect(String(tong)).toContain('for ('); expect(tong([1, 2, 3])).toBe(6); });"), undefined, chayVm);
    assert.deepEqual(kq.map((r) => r.dat), [true, true, false]);
    assert.match(kq[2].thay!, /ĐỎ với một thay đổi VÔ HẠI/);
    assert.equal(chapNhan(tj, kq), false);
    assert.equal(ketQuaVoHai({ tests: [{ ten: 'a', dat: true }], ms: 1 }).dat, true);
  });
  it('ảnh chụp ghi ở lượt code đúng được dùng cho đột biến; tuyChonTu đọc thuVien/xaoTron/lapLai/restoreMocks', async () => {
    const tj2: TestsJson = { ...tj, kiem: tj.kiem!.slice(0, 2) };
    const kq = await chamMutation(tj2, tj2.kiem!, tep("it('golden', async () => { await expect(String(tong([4, 5]))).toMatchFileSnapshot('./__ok__/t.txt'); });"), undefined, chayVm);
    assert.deepEqual(kq.map((r) => r.dat), [true, true]);
    assert.match(kq[1].thay!, /Snapshot src\/__ok__\/t\.txt mismatched/);
    assert.deepEqual(tuyChonTu({ loai: 'mutation', thuVien: { yaml: 'x' }, xaoTron: 7, lapLai: 9, restoreMocks: false }), { thuVien: { yaml: 'x' }, xaoTron: 7, lapLai: 9, restoreMocks: false });
  });
});
