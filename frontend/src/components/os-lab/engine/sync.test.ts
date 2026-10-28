/**
 * Kiểm các nguyên thuỷ đồng bộ: semaphore không bao giờ quá N, rò kết nối làm cạn pool, `if` vs `while` dưới
 * "đánh thức bị cướp" và đánh thức giả, khoá đọc–ghi ưu tiên người đọc làm người ghi đói.
 *   npx tsx --test frontend/src/components/os-lab/engine/sync.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { allStuck, autoRun, init, spurious, stepThread, STEAL } from './sync';
import { rng } from './rng';

describe('semaphore', () => {
  it('a pool of 3 never has more than 3 holders, whatever the interleaving', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const st = autoRun(init('semaphore', { slots: 3 }), 'rand', 400, rng(seed));
      const last = st.at(-1)!;
      assert.equal(last.maxInside, 3);
      for (const s of st) assert.ok(s.sems.pool.v >= 0 && s.sems.pool.max - s.sems.pool.v <= 3);
    }
  });
  it('a missing release on an error path drains the pool: everybody ends up waiting', () => {
    const st = autoRun(init('semaphore', { slots: 3, leak: true }), 'rr', 2000, rng(1));
    const last = st.at(-1)!;
    assert.ok(allStuck(last));
    assert.equal(last.sems.pool.v, 0);
    assert.equal(last.th[2].holds.filter((h) => h === 'pool').length, 3, 'the leaky thread still "holds" all three');
  });
});

describe('bounded buffer: if vs while', () => {
  it('the stolen-wakeup interleaving crashes the `if` version', () => {
    const st = autoRun(init('pc', { loop: false }), 'steal', 100, rng(1));
    const last = st.at(-1)!;
    assert.deepEqual(last.errors, ['C1: take from an EMPTY buffer']);
    assert.equal(st.length - 1, STEAL.length);
  });
  it('the same interleaving is harmless with `while`; every item is consumed exactly once', () => {
    const st = autoRun(init('pc', { loop: true, items: 6 }), 'steal', 400, rng(1));
    const last = st.at(-1)!;
    assert.deepEqual(last.errors, []);
    assert.equal(last.produced, 6); assert.equal(last.consumed, 6);
    for (const s of st) assert.ok(s.buf.length >= 0 && s.buf.length <= s.cap);
  });
  it('random interleavings: `while` is always safe', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const last = autoRun(init('pc', { loop: true, items: 8 }), 'rand', 600, rng(seed)).at(-1)!;
      assert.deepEqual(last.errors, []);
      assert.equal(last.consumed, 8);
    }
  });
  it('a spurious wakeup breaks `if` but not `while`', () => {
    for (const loop of [false, true]) {
      let s = init('pc', { loop });
      s = stepThread(s, 0); s = stepThread(s, 0); // C1: lock, wait (bộ đệm rỗng)
      s = spurious(s);
      s = stepThread(s, 0); s = stepThread(s, 0);
      assert.equal(s.errors.length, loop ? 0 : 1);
      if (loop) assert.equal(s.th[0].status, 'blocked');
    }
  });
});

describe('readers–writers', () => {
  it('reader preference: with readers overlapping, the writer starves', () => {
    const last = autoRun(init('rw', { pref: 'reader' }), 'rr', 600, rng(3)).at(-1)!;
    assert.ok(last.rw.reads > 50);
    assert.equal(last.rw.writes, 0);
    assert.ok(last.th[4].maxWait > 500);
  });
  it('writer preference: new readers queue behind a waiting writer, so it gets in', () => {
    const last = autoRun(init('rw', { pref: 'writer' }), 'rr', 600, rng(3)).at(-1)!;
    assert.ok(last.rw.writes > 10 && last.rw.reads > 50);
    assert.ok(last.th[4].maxWait < 20);
  });
  it('never a reader and a writer inside together', () => {
    for (const pref of ['reader', 'writer'] as const) for (let seed = 1; seed <= 10; seed++) {
      for (const s of autoRun(init('rw', { pref }), 'rand', 300, rng(seed))) assert.ok(!(s.rw.writer !== null && s.rw.readers > 0));
    }
  });
});
