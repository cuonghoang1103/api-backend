/**
 * Kiểm cgroup v2: memory.max ⇒ OOM 137 đúng thời điểm, memory.high làm chậm chứ không cứu một lỗi rò, page cache không
 * gây OOM, cpu.max làm đứng cả cgroup tới chu kỳ sau.
 *   npx tsx --test frontend/src/components/os-lab/engine/cgroup.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { cpuQuota, memTimeline, type MemCfg } from './cgroup';

const base: MemCfg = { max: 512, high: Infinity, swapMax: 0, base: 100, leak: 40, cacheRate: 0, restart: false, duration: 60 };
const firstKill = (pts: ReturnType<typeof memTimeline>) => pts.find((p) => p.oomKill > 0)?.t ?? -1;

describe('cgroup memory', () => {
  it('a 40 MiB/s leak from 100 MiB hits memory.max = 512 MiB after (512 − 100)/40 ≈ 10.3 s → oom_kill', () => {
    const pts = memTimeline(base);
    assert.ok(Math.abs(firstKill(pts) - 10.4) < 0.15, `killed at ${firstKill(pts)}`);
    for (const p of pts) assert.ok(p.current <= 512 + 1e-6, 'memory.current never exceeds memory.max');
  });
  it('memory.high throttles: the same leak survives much longer, memory.events high counts up, PSI rises', () => {
    const pts = memTimeline({ ...base, high: 384 });
    const k = firstKill(pts);
    assert.ok(k > 2 * 10.4 || k < 0, `killed at ${k}`);
    const at = pts.find((p) => p.t === 15)!;
    assert.ok(at.current > 384 && at.current < 512 && at.high > 0 && at.psi > 0.3);
  });
  it('page cache fills memory.max but never causes an OOM kill', () => {
    const pts = memTimeline({ ...base, leak: 0, base: 150, cacheRate: 60 });
    assert.equal(firstKill(pts), -1);
    const last = pts.at(-1)!;
    assert.ok(last.current > 500 && last.anon === 150 && last.file > 300);
  });
  it('swap.max delays the kill by exactly swap / leak rate', () => {
    const k = firstKill(memTimeline({ ...base, swapMax: 200 }));
    assert.ok(Math.abs(k - (10.4 + 5)) < 0.2, `killed at ${k}`);
  });
  it('restart policy → the container is killed again and again (crash loop)', () => {
    const last = memTimeline({ ...base, restart: true }).at(-1)!;
    assert.ok(last.oomKill >= 4, `${last.oomKill}`);
  });
});

describe('cgroup cpu.max', () => {
  it('cpu.max "50000 100000", one thread needing 120 ms: runs 50, waits 50, runs 50, waits 50, runs 20 → done at 220 ms', () => {
    const r = cpuQuota({ quota: 50, period: 100, cores: 4, threads: 1, work: 120 });
    assert.equal(r.end, 220);
    assert.equal(r.nrPeriods, 3); assert.equal(r.nrThrottled, 2); assert.equal(r.throttledMs, 100);
  });
  it('four threads burn the 50 ms quota in 12.5 ms and stall 87.5 ms: 30 ms of work each takes 205 ms', () => {
    const r = cpuQuota({ quota: 50, period: 100, cores: 4, threads: 4, work: 30 });
    assert.ok(Math.abs(r.end - 205) < 1e-9, `${r.end}`);
    assert.equal(r.nrThrottled, 2);
    assert.equal(cpuQuota({ quota: Infinity, period: 100, cores: 4, threads: 4, work: 30 }).end, 30);
  });
  it('more threads than cores share the cores (4 × 10 ms on 2 cores ≈ 20 ms)', () => {
    const r = cpuQuota({ quota: Infinity, period: 100, cores: 2, threads: 4, work: 10 });
    assert.ok(r.end >= 20 && r.end <= 21, `${r.end}`);
  });
});
