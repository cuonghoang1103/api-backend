/**
 * cacheline: mô phỏng MESI (đếm lần vô hiệu hoá / dòng nhảy) + số đo thật c46-false.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/cacheline.test.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { FS_MS, JAVA, linesUsed, PERF, simulateCl } from './cacheline';

const C46 = fs.readFileSync(fileURLToPath(new URL('../../../../../content/courses/operating-systems-for-developers/lab/out/c46-false.out.txt', import.meta.url)), 'utf8');

describe('MESI model', () => {
  it('8 counters 8 B apart, 64-B line: one line, EVERY write after the first steals it', () => {
    const s = simulateCl({ cores: 8, gap: 8, line: 64, rounds: 5 });
    assert.equal(linesUsed({ cores: 8, gap: 8, line: 64, rounds: 1 }), 1);
    const last = s[s.length - 1];
    assert.equal(last.misses, 40); assert.equal(last.hits, 0); assert.equal(last.bounces, 39);
    assert.ok(s.slice(1).every((x) => x.event === 'rfo' && x.invalidated.length === 1));
    // tại mọi lúc chỉ MỘT lõi có bản hợp lệ (M), số còn lại I
    for (const x of s) assert.equal(x.states.filter((row) => row[0] === 'M').length, 1);
  });
  it('padded to 128 B with a 128-B line: one compulsory miss per core, then only hits', () => {
    const last = simulateCl({ cores: 8, gap: 128, line: 128, rounds: 5 }).at(-1)!;
    assert.equal(last.misses, 8); assert.equal(last.hits, 32); assert.equal(last.bounces, 0); assert.equal(last.invalidations, 0);
  });
  it('64 B apart but the REAL line is 128 B (M1): pairs still share ⇒ half the false sharing', () => {
    const real = simulateCl({ cores: 8, gap: 64, line: 128, rounds: 5 }).at(-1)!;
    const told = simulateCl({ cores: 8, gap: 64, line: 64, rounds: 5 }).at(-1)!;
    assert.equal(told.bounces, 0);
    assert.equal(real.bounces, 4 * 2 * 5 - 4); // 4 dòng, mỗi vòng 2 lần đổi chủ/dòng, trừ lần nạp đầu
  });
  it('local variables: never a bounce', () => {
    assert.equal(simulateCl({ cores: 8, gap: 8, line: 64, rounds: 5, local: true }).at(-1)!.bounces, 0);
  });
});

describe('measured numbers come from c46-false', () => {
  it('fs timings 4 and 8 threads', () => {
    for (const th of [4, 8] as const) for (const g of [8, 64, 128, 256] as const) assert.match(C46, new RegExp(`threads=${th} ${g} +sum=\\d+ +${FS_MS[th][g]} ms`), `${th}/${g}`);
    assert.match(C46, new RegExp(`threads=8 local +sum=\\d+ +${FS_MS[8].local} ms`));
    assert.equal(FS_MS[8][8], 777); assert.equal(FS_MS[8][128], 192);
  });
  it('perf task-clock 1 429.59 vs 713.36 ms; Java 6 086 / 1 064 / 385 / 25 ms; getconf says 64', () => {
    assert.ok(C46.includes(String(PERF.false.taskClock)) && C46.includes(String(PERF.padded.taskClock)));
    for (const [k, v] of Object.entries(JAVA)) assert.match(C46, new RegExp(`${k} +sum=[0-9,]+ +${v} ms`), k);
    assert.match(C46, /LEVEL1_DCACHE_LINESIZE\n64/);
  });
});
