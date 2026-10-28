/**
 * Kiểm event loop với hành vi đã biết của Node.js (thứ tự in, thread pool 4 luồng, chặn vòng lặp, race qua await).
 *   npx tsx --test frontend/src/components/os-lab/engine/eventloop.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { blockScenario, ORDER, poolScenario, raceScenario, run } from './eventloop';

const outs = (st: ReturnType<typeof run>) => st[st.length - 1].out;

describe('event loop', () => {
  it('ordering: sync → nextTick → promise → timers → poll (I/O) → check (setImmediate) → next timers', () => {
    const st = run(ORDER);
    assert.equal(st[st.length - 1].phase, 'done');
    assert.deepEqual(outs(st).map((o) => o.v), ['1 sync', '2 sync', '3 nextTick', '4 promise', '5 timeout', '6 readFile', '7 immediate', '8 timeout']);
  });
  it('libuv pool of 4: eight 100 ms pbkdf2 finish in two waves; a 1 ms readFile waits behind them; https does not', () => {
    const o = outs(run(poolScenario(), 4));
    const at = (v: string) => o.find((x) => x.v === v)!.t;
    for (let i = 1; i <= 4; i++) assert.equal(at(`#${i} done`), 100);
    for (let i = 5; i <= 8; i++) assert.equal(at(`#${i} done`), 200);
    assert.equal(at('readFile done'), 201);
    assert.equal(at('https.get done'), 30);
    const o8 = outs(run(poolScenario(), 8));
    for (let i = 1; i <= 8; i++) assert.equal(o8.find((x) => x.v === `#${i} done`)!.t, 100);
  });
  it('one 200 ms synchronous handler delays every request that arrives meanwhile; offloading fixes it', () => {
    const lat = (off: boolean) => {
      const s = run(blockScenario(off)).at(-1)!;
      return Object.fromEntries(Object.entries(s.reqs).map(([k, v]) => [k, v.done! - v.arrive]));
    };
    assert.deepEqual(lat(false), { 'req1 /me': 2, 'req2 /report': 200, 'req3 /me': 197, 'req4 /me': 194 });
    assert.deepEqual(lat(true), { 'req1 /me': 2, 'req2 /report': 200, 'req3 /me': 2, 'req4 /me': 2 });
  });
  it('single-threaded Node still races across await: both buy the last seat; a Promise-chain lock fixes it', () => {
    const a = run(raceScenario(false)).at(-1)!;
    assert.deepEqual(a.g.bookings, ['alice', 'bob']);
    assert.equal(a.g.seatsLeft, 0);
    const b = run(raceScenario(true)).at(-1)!;
    assert.deepEqual(b.g.bookings, ['alice']);
    assert.ok(b.out.some((o) => o.v === 'bob: sold out'));
  });
});
