/**
 * epoll: đối chiếu với lab/out/c103-epoll, c104-c10k, c104-mem, c104-pids, c104-fd.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/epoll.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { C10K, ONESHOT, POLLBENCH, WALLS, readyScript, realMiB, trigger } from './epoll';

describe('epoll — ready list', () => {
  it('epoll_wait returns only the ready fds; poll would touch the whole interest list', () => {
    const S = readyScript();
    const w = S.find((s) => s.returned.length === 2)!;
    assert.deepEqual(w.returned, [7, 11]); assert.equal(w.epollWork, 2); assert.equal(w.pollWork, w.interest.length);
    assert.equal(S[0].call, 'epoll_create1(0) = 4');
    assert.ok(S.some((s) => s.sleeping && s.ready.length === 0), 'thread sleeps while idle');
    assert.ok(!S[S.length - 1].interest.includes(6), 'close() removes the fd from the interest list');
  });
  it('pollbench: epoll ≈ 0.7 µs at any N; poll grows ~linearly; select cannot go past FD_SETSIZE', () => {
    assert.deepEqual(POLLBENCH.map((r) => r.epoll), [0.7, 0.71, 0.72, 0.72]);
    assert.equal(POLLBENCH[3].select, null); assert.equal(POLLBENCH[3].poll, 676.02);
    assert.ok(POLLBENCH[3].poll / POLLBENCH[2].poll > 10 * 0.9);
  });
});

describe('epoll — trigger modes (trigger.c)', () => {
  it('LT: 3 wake-ups of 4 + 4 + 2', () => {
    const t = trigger('lt');
    assert.deepEqual(t.filter((s) => /wake-up/.test(s.line)).map((s) => s.line.trim()), ['wake-up 1: read 4 bytes', 'wake-up 2: read 4 bytes', 'wake-up 3: read 2 bytes']);
    assert.equal(t.at(-1)!.line.trim(), 'all 10 bytes read');
  });
  it('ET: one wake-up, then "timeout after 500 ms, 6 bytes still unread"', () => {
    const t = trigger('et');
    assert.equal(t.at(-1)!.line.trim(), 'epoll_wait: timeout after 500 ms, 6 bytes still unread'); assert.equal(t.at(-1)!.stuck, true);
  });
  it('ET + drain: read 10 bytes then EAGAIN', () => {
    assert.equal(trigger('drain')[1].line.trim(), 'wake-up 1: read 10 bytes (then EAGAIN)');
  });
  it('oneshot.c: LT wakes all 4 threads (3 EAGAIN), ET a second thread at 56 ms, ONESHOT exactly one', () => {
    assert.equal(ONESHOT.lt.filter((e) => e.what === 'eagain').length, 3);
    assert.equal(ONESHOT.et.find((e) => e.what === 'dup')!.ms, 56);
    assert.equal(ONESHOT.oneshot.filter((e) => e.what === 'woke').length, 1);
  });
});

describe('epoll — c10k (c104)', () => {
  it('busy 10k: thread p50 95 ms / p99 322 ms, 61 800 late sends; epoll p99 0.38 ms', () => {
    const r = C10K.busy[10000];
    assert.equal(r.thread.p50, 95.09); assert.equal(r.thread.p99, 321.67); assert.equal(r.thread.late, 61800); assert.equal(r.epoll.p99, 0.38);
  });
  it('light 10k: 122.6 MiB + 156 MiB kernel stacks vs 40.9 MiB; ctx 32 136 vs 5 956', () => {
    const r = C10K.light[10000];
    assert.equal(realMiB(r.thread), 278.6); assert.equal(realMiB(r.epoll), 40.9);
    assert.equal(r.thread.ctx, 32136); assert.equal(r.epoll.ctx, 5956);
  });
  it('walls: pids 997, memory OOM at 4624 (exit 137), nofile spin 9 359/s', () => {
    assert.equal(WALLS.pids.thread.failAt, 997); assert.equal(WALLS.memory.thread.failAt, 4624); assert.equal(WALLS.memory.thread.exit, 137);
    assert.equal(WALLS.pids.epoll.failAt, null); assert.match(WALLS.nofile.epoll.out.join(' '), /9 359 failed accept4/);
  });
});
