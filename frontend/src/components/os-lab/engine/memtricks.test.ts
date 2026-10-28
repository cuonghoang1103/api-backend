/**
 * Kiểm copy-on-write và page cache/read-ahead.
 *   npx tsx --test frontend/src/components/os-lab/engine/memtricks.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { bgsave, cowExec, cowExit, cowFork, cowInit, cowWrite, framesInUse, pageCache, type PcCfg } from './memtricks';

describe('copy-on-write', () => {
  it('fork copies nothing; each first write to a shared page copies exactly one page', () => {
    let s = cowFork(cowInit(16));
    assert.equal(framesInUse(s), 16);
    assert.ok(s.frames.every((f) => f.refs === 2));
    s = cowWrite(s, 'parent', 3);
    assert.equal(s.copies, 1); assert.equal(framesInUse(s), 17);
    s = cowWrite(s, 'parent', 3);
    assert.equal(s.copies, 1, 'second write to the same page: already private');
    s = cowWrite(s, 'child', 3);
    assert.equal(s.copies, 1, 'child is now the only user of the old frame — no copy');
    s = cowWrite(s, 'child', 7);
    assert.equal(s.copies, 2);
    assert.notEqual(s.parent[7], s.child![7]);
    s = cowExit(s);
    assert.equal(framesInUse(s), 16, 'child exits: its frames are freed, the parent is left with exactly 16');
  });
  it('fork + exec copies nothing', () => {
    const s = cowExec(cowFork(cowInit(16)));
    assert.equal(s.copies, 0); assert.equal(framesInUse(s), 16);
  });
  it('BGSAVE: touched pages = n(1 − (1 − 1/n)^W); 2 MiB huge pages amplify the copy', () => {
    const small = bgsave(4, 10000, 10, 4).final; // 100k lệnh ghi vào 4 GiB
    const n = 4 * 1024 * 256;
    assert.ok(Math.abs(small.touched - n * (1 - Math.pow(1 - 1 / n, 1e5))) < 1);
    assert.ok(small.extraMiB > 360 && small.extraMiB < 380, `${small.extraMiB}`);
    const huge = bgsave(4, 10000, 10, 2048).final;
    assert.ok(huge.extraMiB > 4095, 'with THP almost every 2 MiB page gets touched → the whole 4 GiB is copied');
  });
});

describe('page cache and read-ahead', () => {
  const base: PcCfg = { filePages: 256, cachePages: 1024, pattern: 'seq', api: 'read', readahead: true, passes: 1, warm: false, seed: 1 };
  it('sequential cold read: windows grow 4, 8, 16, 32 and stay at 32 (128 KiB)', () => {
    const r = pageCache(base);
    assert.deepEqual(r.windows.slice(0, 4), [4, 8, 16, 32]);
    assert.ok(r.windows.every((w) => w <= 32));
    assert.equal(r.diskPages, 256);
    assert.ok(r.requests <= 12, `${r.requests} requests`);
    assert.ok(r.misses <= 2, 'after the first miss, async read-ahead keeps ahead of the reader');
  });
  it('random cold read: about one disk request per page', () => {
    const r = pageCache({ ...base, pattern: 'rand' });
    assert.ok(r.requests >= 250 && r.misses >= 250, `${r.requests}`);
  });
  it('without read-ahead even a sequential read pays one request per page', () => {
    assert.equal(pageCache({ ...base, readahead: false }).requests, 256);
  });
  it('a warm cache costs no disk I/O at all', () => {
    const r = pageCache({ ...base, warm: true });
    assert.equal(r.requests, 0); assert.equal(r.hits, 256);
  });
  it('read() copies every page into your buffer; mmap() copies nothing (minor faults only on a warm cache)', () => {
    assert.equal(pageCache({ ...base, warm: true }).copies, 256);
    const m = pageCache({ ...base, warm: true, api: 'mmap' });
    assert.equal(m.copies, 0); assert.equal(m.minor, 256); assert.equal(m.major, 0);
  });
  it('LRU and a loop bigger than the cache: the second pass misses again (sequential flooding)', () => {
    const r = pageCache({ ...base, cachePages: 200, passes: 2, readahead: false });
    assert.equal(r.misses, 512);
    const fits = pageCache({ ...base, cachePages: 300, passes: 2, readahead: false });
    assert.equal(fits.misses, 256);
  });
});
