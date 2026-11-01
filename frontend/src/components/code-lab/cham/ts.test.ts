/**
 * Máy chấm `ts` (01/11/2026) — shim node:test / node:assert/strict của TS_CHAY_SRC, tầng kiểu TS_KIEU_SRC (TypeScript 6.0.3
 * tự lưu) và điều phối chamTs, chạy bằng cùng "máy Node" mà bộ xuất đề dùng (scripts/codelab-ts-node.mjs).
 *   npx tsx --test frontend/src/components/code-lab/cham/ts.test.ts
 * Đường Worker + quá giờ thật + CSP: scripts/codelab-kiem-cham-trinh-duyet.mjs --track typescript-practice [--app].
 * Đối chiếu từng kiểm với tsc 7.0.2 + Node 22 thật: scripts/codelab-ts-doi-chieu.mjs.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import nodeAssert from 'node:assert/strict';
import vm from 'node:vm';
import path from 'node:path';
import { TS_CHAY_SRC } from './tsRunner';
import { ketQuaChay, tepNguoiHoc } from './chamTs';
import type { Kiem, TestsJson } from './kieu';

type Chay = { chay: (d: { js: Record<string, string>; lenh: string }) => Promise<{ ma: number; stdout: string; stderr: string; tests: Array<{ ten: string; dat: boolean; loi?: string }>; loi?: string }>; assert: Record<string, (...a: unknown[]) => unknown> };
function mayChay(): Chay {
  const ctx = vm.createContext({ setTimeout, clearTimeout, setInterval, clearInterval, URL, URLSearchParams });
  vm.runInContext(TS_CHAY_SRC, ctx);
  const m = (ctx as unknown as { __CL_TS_CHAY__: Chay }).__CL_TS_CHAY__;
  // kết quả từ realm vm ⇒ chép sang realm này (trình duyệt: structured clone qua postMessage)
  return { assert: m.assert, chay: async (d) => JSON.parse(JSON.stringify(await m.chay(d))) };
}
const cjs = (s: string) => `"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\n${s}`;

describe('shim node:assert/strict — cùng kết luận với assert thật của Node', () => {
  const a = mayChay().assert;
  const nem = (f: () => unknown) => { try { f(); return false; } catch { return true; } };
  class Loi extends Error {}
  const CAP: Array<[string, unknown, unknown]> = [
    ['số', 1, 1], ['số khác', 1, 2], ['NaN', NaN, NaN], ['-0/0', -0, 0], ['chuỗi/số', '1', 1],
    ['object khác tham chiếu', { a: 1 }, { a: 1 }], ['mảng', [1, [2, 3]], [1, [2, 3]]], ['mảng khác', [1, 2], [2, 1]],
    ['undefined khoá', { a: 1, b: undefined }, { a: 1 }], ['Date', new Date(0), new Date(0)], ['Date khác', new Date(0), new Date(1)],
    ['Map', new Map([[1, { x: 1 }]]), new Map([[1, { x: 1 }]])], ['Set', new Set([1, 2]), new Set([2, 1])],
    ['prototype khác', Object.create(null), {}], ['null', null, null], ['null/undefined', null, undefined],
    ['bigint', BigInt(10), BigInt(10)], ['lớp khác', new Loi('x'), new Error('x')],
  ];
  for (const [ten, x, y] of CAP) {
    it(`equal / deepEqual / notEqual / notDeepEqual: ${ten}`, () => {
      for (const fn of ['equal', 'deepEqual', 'notEqual', 'notDeepEqual'] as const) {
        assert.equal(nem(() => a[fn](x, y)), nem(() => (nodeAssert as unknown as Record<string, (p: unknown, q: unknown) => void>)[fn](x, y)), `${fn}(${ten})`);
      }
    });
  }
  it('throws: lớp lỗi, regex trên String(err), object, hàm kiểm, không ném', () => {
    const f = () => { throw new RangeError('seats must be >= 1'); };
    const MAU: unknown[] = [RangeError, TypeError, Error, /seats/, /^RangeError: seats/, /nope/, { name: 'RangeError' }, { message: /must/ }, { message: 'x' }, (e: Error) => e instanceof RangeError, undefined];
    for (const m of MAU) assert.equal(nem(() => a.throws(f, m)), nem(() => nodeAssert.throws(f, m as RegExp)), `throws(${String(m)})`);
    assert.equal(nem(() => a.throws(() => 1)), true);
    assert.match(String((() => { try { a.throws(() => 1, RangeError); } catch (e) { return (e as Error).message; } return ''; })()), /Missing expected exception \(RangeError\)/);
  });
  it('match / ok / rejects', async () => {
    assert.equal(nem(() => a.match('LF-AB12', /^LF-/)), false);
    assert.equal(nem(() => a.match('x', /^LF-/)), true);
    assert.equal(nem(() => a.match(5, /5/)), true); // không phải chuỗi ⇒ đỏ như Node
    assert.equal(nem(() => a.ok(0)), true);
    assert.equal(nem(() => a.ok('x')), false);
    await assert.rejects(a.rejects(Promise.resolve(1)) as Promise<unknown>);
    await (a.rejects(Promise.reject(new TypeError('t')), TypeError) as Promise<unknown>);
  });
});

describe('shim node:test + bộ nạp module', () => {
  it('node --test: đếm test đạt/trượt, exit 1 khi có trượt, t.mock.method tự trả lại', async () => {
    const r = await mayChay().chay({
      lenh: 'node --test test/x.test.ts',
      js: {
        'src/x.ts': cjs('exports.dbl = (n) => n * 2;\nexports.log = (s) => { console.log("[audit] " + s); };'),
        'test/x.test.ts': cjs(`const node_test_1 = require("node:test");
const strict_1 = require("node:assert/strict");
const x_1 = require("../src/x.ts");
(0, node_test_1.test)('dbl', () => strict_1.default.equal((0, x_1.dbl)(2), 4));
(0, node_test_1.test)('sai', () => strict_1.equal((0, x_1.dbl)(2), 5));
(0, node_test_1.test)('mock', (t) => { const ds = []; t.mock.method(console, 'log', (l) => { ds.push(l); }); (0, x_1.log)('a'); strict_1.deepEqual(ds, ['[audit] a']); });
(0, node_test_1.test)('async', async () => { await new Promise((r) => setTimeout(r, 5)); strict_1.ok(true); });`),
      },
    });
    assert.equal(r.ma, 1);
    assert.deepEqual(r.tests.map((t) => t.dat), [true, false, true, true]);
    assert.match(r.tests[1].loi!, /AssertionError \[ERR_ASSERTION\]: Expected values to be strictly equal:[\s\S]*4 !== 5/);
  });
  it('node src/main.ts: stdout bắt đúng định dạng console.log; lỗi nạp ⇒ exit 1; import sai đường ⇒ ERR_MODULE_NOT_FOUND', async () => {
    const ok = await mayChay().chay({ lenh: 'node src/main.ts', js: { 'src/main.ts': cjs('console.log("usage today:", 3 / 7); console.log("%s needs %d seats", "BE-201", 31); console.log([1, "a"], { a: 1 });') } });
    assert.equal(ok.ma, 0);
    assert.equal(ok.stdout, "usage today: 0.42857142857142855\nBE-201 needs 31 seats\n[ 1, 'a' ] { a: 1 }\n");
    const hong = await mayChay().chay({ lenh: 'node src/main.ts', js: { 'src/main.ts': cjs('const x = undefined; x.y;') } });
    assert.equal(hong.ma, 1);
    assert.match(hong.loi!, /TypeError: Cannot read properties of undefined/);
    const thieu = await mayChay().chay({ lenh: 'node src/main.ts', js: { 'src/main.ts': cjs('require("./hello.js");') } });
    assert.match(thieu.loi!, /ERR_MODULE_NOT_FOUND/);
  });
});

describe('chamTs — kết quả một lệnh chạy', () => {
  it('ra: phải chứa chuỗi; trượt ⇒ nêu test đỏ đầu tiên; quá giờ ⇒ nói rõ', () => {
    const k: Kiem = { moTa: 'x', kiem: 'chay', lenh: 'node src/a.ts', ra: 'Opens at 07:30' };
    assert.equal(ketQuaChay(k, { ma: 0, stdout: 'Opens at 07:30 (450 minutes)\n', stderr: '', tests: [] }, 5000).dat, true);
    assert.equal(ketQuaChay(k, { ma: 0, stdout: 'Opens at NaN:NaN\n', stderr: '', tests: [] }, 5000).dat, false);
    assert.match(ketQuaChay(k, { ma: 1, stdout: '', stderr: '', tests: [], quaGio: true }, 5000).thay!, /still running after 5s/);
  });
  it('tệp của đề luôn lấy bản gốc: tệp người học = editor trừ coDinh', () => {
    const tj = { loai: 'ts', coDinh: { 'test/a.test.ts': 'X' } } as TestsJson;
    assert.deepEqual(Object.keys(tepNguoiHoc(tj, { 'src/a.ts': '1', 'test/a.test.ts': 'đã sửa' })), ['src/a.ts']);
  });
});

describe('máy chấm đủ (TypeScript 6.0.3 tự lưu) trên đề thật của khoá', async () => {
  const goc = path.resolve(__dirname, '../../../../..');
  let node: { chamTsNode: (tj: unknown, f: Record<string, string>) => Promise<Array<{ dat: boolean; moTa?: string; thay?: string }>> } | null = null;
  let boQua = '';
  try { node = await import(path.join(goc, 'scripts/codelab-ts-node.mjs')); } catch (e) { boQua = `không nạp được máy chấm Node: ${e instanceof Error ? e.message : String(e)}`; }
  const { deTs } = await import(path.join(goc, 'content/codelab/typescript-practice/nguon/_chung.mjs'));
  const cham = async (id: string, f: (d: { loiGiai: Record<string, string>; khoiDau: Record<string, string>; saiMau: Array<{ tep: Record<string, string> }> }) => Record<string, string>) => {
    const d = deTs(id);
    return node!.chamTsNode(d.tests, f(d));
  };
  it('ts-cl-0-8-a: lời giải đạt hết; khởi đầu trượt đúng các kiểm kiểu; "any" bị bắt', async (t) => {
    if (!node) return t.skip(boQua);
    assert.ok((await cham('ts-cl-0-8-a', (d) => d.loiGiai)).every((r) => r.dat));
    const s = await cham('ts-cl-0-8-a', (d) => d.khoiDau);
    // sạch: trượt (implicit any TS7006) · '480' và gán vào string vẫn biên dịch (trượt) · thiếu đối số vẫn TS2554 (đạt) · …
    assert.deepEqual(s.map((r) => r.dat), [false, false, true, false, true, true, true]);
    const any = await cham('ts-cl-0-8-a', (d) => ({ ...d.khoiDau, ...d.saiMau[0].tep }));
    assert.equal(any.at(-1)!.dat, false); // cấm any
  });
  it('ts-cl-1-2-d: dòng TS6/TS7 lệch mã vẫn đạt (nhận TS2739 hoặc TS2345)', async (t) => {
    if (!node) return t.skip(boQua);
    const g = await cham('ts-cl-1-2-d', (d) => d.loiGiai);
    assert.ok(g.every((r) => r.dat), JSON.stringify(g.filter((r) => !r.dat)));
    assert.match(g.find((r) => /sai\.ts:6/.test(r.moTa ?? ''))!.thay!, /TS2345|TS2739/);
  });
  it('ts-cl-0-4-a: giữ enum ⇒ Node 22 (strip-only) không chạy được ⇒ kiểm chạy trượt như Node thật', async (t) => {
    if (!node) return t.skip(boQua);
    const s = await cham('ts-cl-0-4-a', (d) => d.khoiDau);
    const chay = s.find((r) => /node --test/.test(r.moTa ?? ''))!;
    assert.equal(chay.dat, false);
    assert.match(chay.thay!, /ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX|enum is not supported/);
  });
});
