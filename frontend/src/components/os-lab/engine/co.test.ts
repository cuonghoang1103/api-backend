/**
 * coordinated-omission: mô hình stall.js phải tái hiện HÌNH DÁNG các số đo thật của c156 (p99 vòng kín ≈ 0,2 ms dù có
 * cú đứng 200 ms; vòng mở 100/s p95 ≈ 150, p99 ≈ 190 từ lúc dự định; sửa kiểu wrk ≈ 187 ms) và số đo thật phải có trong c156.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/co.test.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { C156, correct, LAB_SERVER, pct, runCo } from './co';

const C = fs.readFileSync(fileURLToPath(new URL('../../../../../content/courses/operating-systems-for-developers/lab/out/c156-bench.out.txt', import.meta.url)), 'utf8');
const base = { ...LAB_SERVER, durationMs: 8000 };

describe('model reproduces the lab shapes', () => {
  it('closed loop, 1 connection: ~7 400 req/s, p99 ≤ 0.2 ms, max ≈ 200 ms', () => {
    const r = runCo({ ...base, mode: 'closed', rate: 0, conns: 1 });
    assert.ok(r.rps > 7000 && r.rps < 7400, String(r.rps));
    assert.ok(r.fromSent.p99 <= 0.2, String(r.fromSent.p99));
    assert.ok(r.fromSent.max > 190 && r.fromSent.max <= 200.2, String(r.fromSent.max));
    // chỉ 7 yêu cầu (một mỗi cú đứng) thấy cú đứng hình
    assert.equal(r.reqs.filter((q) => q.done - q.sent > 50).length, 7);
  });
  it('open loop 100/s, 1 connection: from intended p95 ≈ 150, p99 ≈ 190; from actual send p99 tiny', () => {
    const r = runCo({ ...base, mode: 'open', rate: 100, conns: 1 });
    assert.equal(r.reqs.length, 800);
    assert.ok(Math.abs(r.fromIntended.p95 - 150) < 12, String(r.fromIntended.p95));
    assert.ok(Math.abs(r.fromIntended.p99 - 190) < 6, String(r.fromIntended.p99));
    assert.ok(r.fromSent.p99 < 10, String(r.fromSent.p99));
  });
  it('open loop 100/s, enough connections: from actual send ≈ from intended (the requests queue IN the server)', () => {
    const r = runCo({ ...base, mode: 'open', rate: 100, conns: 50 });
    assert.ok(Math.abs(r.fromSent.p99 - r.fromIntended.p99) < 2);
    assert.ok(r.fromSent.p99 > 180);
  });
  it('wrk-style correction lifts the closed-loop p99 to ≈ 187 ms', () => {
    const r = runCo({ ...base, mode: 'closed', rate: 0, conns: 1 });
    assert.ok(r.corrected!.p99 > 180 && r.corrected!.p99 < 195, String(r.corrected!.p99));
  });
  it('no stall ⇒ every percentile is just the service time', () => {
    const r = runCo({ ...base, stallMs: 0, mode: 'open', rate: 100, conns: 1 });
    assert.ok(r.fromIntended.max < 0.2);
  });
  it('pct / correct helpers', () => {
    assert.deepEqual(pct([1, 2, 3, 4]), { n: 4, p50: 2, p95: 4, p99: 4, max: 4 });
    assert.deepEqual(correct([10, 1], 3), [10, 7, 4, 1]);
  });
});

describe('measured numbers come from c156', () => {
  it('tai.js closed / open, wrk, k6', () => {
    assert.match(C, /closed loop, 1 connection\(s\): 59031 ok.*\nlatency from intended start +p50 +0\.1 +p95 +0\.1 +p99 +0\.2 +max +200\.2 ms/);
    assert.match(C, /latency from intended start +p50 +1\.3 +p95 +150\.0 +p99 +189\.3 +max +199\.1 ms\nlatency from actual send +p50 +0\.2 +p95 +0\.9 +p99 +6\.4 +max +198\.6 ms/);
    assert.match(C, /latency from actual send +p50 +0\.3 +p95 +150\.1 +p99 +190\.0 +max +199\.8 ms/);
    assert.match(C, /99% +187\.31ms/); assert.match(C, /p\(99\)=189\.15ms/);
    assert.equal(C156.open1Intended.p99, 189.3); assert.equal(C156.wrk.p99, 187.31);
  });
});
