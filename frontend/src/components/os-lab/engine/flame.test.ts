/**
 * flamegraph: cây dựng lại từ SVG thật phải cho ĐÚNG các con số folded.py đã in trong lab/out/c152-perf, c153-offcpu.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/flame.test.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { byName, flame, FLAME_KEYS, folded, search } from './flame';

const lab = (f: string) => fs.readFileSync(fileURLToPath(new URL(`../../../../../content/courses/operating-systems-for-developers/lab/out/${f}`, import.meta.url)), 'utf8');
const pct = (list: Array<{ name: string; pct: number }>, name: string) => list.find((x) => x.name === name)?.pct ?? NaN;
const close = (a: number, b: number, tol = 0.06) => assert.ok(Math.abs(a - b) <= tol, `${a.toFixed(2)} vs ${b}`);

describe('tree integrity', () => {
  for (const k of FLAME_KEYS) {
    it(`${k}: children fit inside their parent, self ≥ 0, one root`, () => {
      const F = flame(k);
      assert.equal(F.nodes.filter((n) => n.depth === 0).length, 1);
      for (const n of F.nodes) {
        if (n.depth > 0) assert.ok(n.parent >= 0, `${k} orphan ${n.name}`);
        const sum = n.kids.reduce((s, c) => s + F.nodes[c].n, 0);
        assert.ok(sum <= n.n, `${k} ${n.name}: kids ${sum} > ${n.n}`);
        for (const c of n.kids) assert.ok(F.nodes[c].start >= n.start - 1e-9 && F.nodes[c].start + F.nodes[c].n <= n.start + n.n + 1e-9);
      }
    });
  }
});

describe('SELF / TOTAL = folded.py (c152, c153)', () => {
  const C152 = lab('c152-perf.out.txt'), C153 = lab('c153-offcpu.out.txt');
  it('hot.c before: 915 samples, 17 stacks, crc_bitwise 86.9 % self, render_json 10.2 % total', () => {
    const F = flame('hot'); const b = byName(F);
    assert.equal(F.total, 915); assert.equal(folded(F).length, 17);
    close(pct(b.self, 'crc_bitwise'), 86.9); close(pct(b.self, '__printf_buffer'), 4.5); close(pct(b.self, 'parse_headers'), 2.3); close(pct(b.self, '_itoa_word'), 1.9);
    close(pct(b.total, 'render_json'), 10.2); close(pct(b.total, '__sprintf_chk'), 9.9); close(pct(b.total, '__vsprintf_internal'), 9.3);
    assert.equal(b.self[0].name, 'crc_bitwise');
    assert.match(C152, /915 samples in 17 distinct stacks/);
    assert.ok(folded(F).includes('hot;_start;__libc_start_main@@GLIBC_2.34;call_init;__libc_start_call_main;main;handle;crc_bitwise 795'));
  });
  it('hot.c after (table): 309 samples, crc_table 64.4 % self, render_json 24.9 % total', () => {
    const b = byName(flame('hot-fixed'));
    close(pct(b.self, 'crc_table'), 64.4); close(pct(b.self, 'parse_headers'), 8.4); close(pct(b.total, 'render_json'), 24.9);
    assert.match(C152, /309 samples in 19 distinct stacks/);
  });
  it('wait.c on-CPU: price_order 96.7 %; off-CPU: futex_do_wait 87.8 % vs do_nanosleep 12.2 %', () => {
    close(pct(byName(flame('wait-on')).self, 'price_order'), 96.7);
    const off = byName(flame('wait-off'));
    assert.equal(flame('wait-off').unit, 'us'); assert.equal(flame('wait-off').total, 22558071);
    close(pct(off.self, 'futex_do_wait'), 87.8); close(pct(off.self, 'do_nanosleep'), 12.2);
    assert.match(C153, /futex_do_wait +87\.8%/); assert.match(C153, /do_nanosleep +12\.2%/);
  });
  it('node: Builtins_ArrayIncludesSmiOrObject 93.3 % self, JS:^report 97.7 % total — uniqueCustomers barely visible (inlined)', () => {
    const F = flame('node'); const b = byName(F);
    close(pct(b.self, 'Builtins_ArrayIncludesSmiOrObject'), 93.3, 0.15);
    close(pct(b.total, 'JS:^report /tmp/orders.js:22:16'), 97.7, 0.15);
    // uniqueCustomers đã bị JIT inline vào report: chỉ 2 mẫu mang tên nó (khung JS:*, bản tối ưu), 0,1 %
    assert.deepEqual(b.total.filter((x) => /uniqueCustomers/.test(x.name)).map((x) => [x.name, x.v]), [['JS:*uniqueCustomers /tmp/orders.js:10:25', 2]]);
  });
  it('differential: widths are the AFTER profile (309), crc_bitwise is gone, crc_table is red', () => {
    const F = flame('hot-diff');
    assert.equal(F.total, 309); assert.ok(F.diff);
    assert.ok(!F.nodes.some((n) => n.name === 'crc_bitwise'));
    const t = F.nodes.find((n) => n.name === 'crc_table')!;
    assert.ok(t.delta > 50, String(t.delta));
  });
  it('search highlights every match and sums without double counting', () => {
    const F = flame('hot');
    const r = search(F, 'printf');
    assert.ok(r.ids.size >= 4);
    close(r.pct, 100 * flame('hot').nodes.filter((n) => n.name === '__sprintf_chk').reduce((s, n) => s + n.n, 0) / 915 + 100 * 4 / 915, 0.6);
  });
});
