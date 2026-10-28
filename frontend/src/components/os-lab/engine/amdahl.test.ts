/**
 * amdahl: công thức đối chiếu với lab/out/c45-amdahl (predict.py, karp.py) và các bảng sweep thật.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/amdahl.test.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { amdahl, BUSY, capacity, ceiling, GROW, gustafson, hetero, karpFlatt, karpTable, MEASURED, parseSweep, PRIMES, SWEEP_TEXT } from './amdahl';

const lab = (f: string) => fs.readFileSync(fileURLToPath(new URL(`../../../../../content/courses/operating-systems-for-developers/lab/out/${f}`, import.meta.url)), 'utf8');
const C45 = lab('c45-amdahl.out.txt'), C41 = lab('c41-c.out.txt');
const r2 = (x: number) => x.toFixed(2);

describe('amdahl / gustafson = predict.py (c45)', () => {
  it('10 %: Amdahl 1.82 3.08 4.71 5.26, Gustafson 1.90 3.70 7.30 9.10', () => {
    assert.deepEqual([2, 4, 8, 10].map((n) => r2(amdahl(0.1, n))), ['1.82', '3.08', '4.71', '5.26']);
    assert.deepEqual([2, 4, 8, 10].map((n) => r2(gustafson(0.1, n))), ['1.90', '3.70', '7.30', '9.10']);
    for (const v of ['1.82x      1.90x', '3.08x      3.70x', '4.71x      7.30x', '5.26x      9.10x']) assert.ok(C45.includes(v), v);
  });
  it('25 %: Amdahl 1.60 2.29 2.91 3.08, ceiling 4×', () => {
    assert.deepEqual([2, 4, 8, 10].map((n) => r2(amdahl(0.25, n))), ['1.60', '2.29', '2.91', '3.08']);
    assert.equal(ceiling(0.25), 4);
  });
});

describe('measured points are the real sweep output', () => {
  it('every [cores, ms, speedup] row of MEASURED appears in c45', () => {
    for (const k of ['s0', 's10', 's25'] as const) for (const [n, ms, S] of MEASURED[k].pts.slice(1)) {
      assert.match(C45, new RegExp(`\\n +${n} +${ms} +${S.toFixed(2)}x`), `${k} ${n}`);
    }
  });
  it('grow (Gustafson): 4 000 units in 3 048 ms on 1 core, 36 400 in 3 612 ms on 10', () => {
    for (const [n, u, ms] of GROW) assert.match(C45, new RegExp(`T=${n} +serial=10% units=${u} +serial +\\d+ ms \\+ parallel +\\d+ ms = +${ms} ms`));
  });
  it('primes block / queue / fork sweeps and per-thread busy times come from c41', () => {
    for (const [k, rows] of Object.entries(PRIMES)) for (const r of rows.slice(1)) assert.match(C41, new RegExp(`\\n +${r.cores} +${r.ms} `), `${k} ${r.cores}`);
    for (const [i, ms] of BUSY.primes.block.entries()) assert.match(C41, new RegExp(`thread ${i} busy +${ms} ms +\\[`));
    for (const [i, ms] of BUSY.mandel.block.entries()) assert.match(C41, new RegExp(`thread ${i} busy +${ms} ms, +300 rows`));
  });
});

describe('karp–flatt', () => {
  it('karp.py prediction from e = 11.7 %: 16 → 5.81×, 32 → 6.92×, 64 → 7.65×, ceiling 8.6×', () => {
    assert.deepEqual([16, 32, 64].map((n) => r2(amdahl(0.117, n))), ['5.81', '6.92', '7.65']);
    assert.equal((1 / 0.117).toFixed(1), '8.5'); // karp.py in 8.6 vì e = 11.66…% trước khi làm tròn
    for (const v of ['5.81x', '6.92x', '7.65x', '8.6x']) assert.ok(C45.includes(v), v);
  });
  it('the karp.py rows: S 1.79/3.00/4.60/4.87 ⇒ e ≈ 11.8 / 11.1 / 10.6 / 11.7 %', () => {
    // karp.py dùng ms với gốc T1 ≈ 3045 ms của lần chạy đó (không in ra); từ speedup đã làm tròn sai lệch ≤ 0,2 điểm %
    const got = [[2, 1.79], [4, 3.0], [8, 4.6], [10, 4.87]].map(([n, S]) => 100 * karpFlatt(S, n));
    [11.8, 11.1, 10.6, 11.7].forEach((want, k) => assert.ok(Math.abs(got[k] - want) < 0.25, `${got[k]} vs ${want}`));
  });
  it('karpTable on the full 10 % sweep (1-core row included): e rises 10.1 → 11.3 %', () => {
    const k = karpTable(parseSweep(SWEEP_TEXT));
    assert.deepEqual(k.rows.map((r) => (r.e === null ? null : +(100 * r.e).toFixed(1))), [null, 10.1, 10.6, 10.6, 11.3]);
    assert.ok(k.e! > 0.11 && k.e! < 0.115);
    assert.equal(k.predict.length, 3);
  });
  it('parseSweep accepts pasted sweep.sh output with headers and the x suffix', () => {
    const rows = parseSweep('cores        ms  speedup    eff\n    1      3105    1.00x   100%\n    2      1709    1.82x    91%');
    assert.deepEqual(rows, [{ cores: 1, ms: 3105 }, { cores: 2, ms: 1709 }]);
  });
  it('the queue sweep is nearly perfect (e ≈ 0–3 %) while fixed blocks are not', () => {
    const q = karpTable(PRIMES.queue), b = karpTable(PRIMES.block);
    assert.ok(q.rows[3].e! < 0.01, String(q.rows[3].e)); // 6 lõi
    assert.ok(b.rows[3].e! > 0.07, String(b.rows[3].e));
  });
});

describe('uneven cores (model)', () => {
  it('8 P + 2 E: capacity grows by only r per E core after 8', () => {
    assert.equal(capacity(8, 8, 0.4), 8); assert.ok(Math.abs(capacity(10, 8, 0.4) - 8.8) < 1e-9);
    assert.ok(hetero(0, 10, 8, 0.4) < amdahl(0, 10));
    assert.equal(hetero(0.1, 4, 8, 0.4), amdahl(0.1, 4));
  });
});
