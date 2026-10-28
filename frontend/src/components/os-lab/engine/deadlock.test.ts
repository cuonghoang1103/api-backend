/**
 * Kiểm phòng lab deadlock với đáp án giáo trình (Silberschatz, OS Concepts) và với output của ch06/banker.py, ch06/pi.c.
 *   npx tsx --test frontend/src/components/os-lab/engine/deadlock.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { availOf, detectExamples, hasCycle, initDine, priorityInversion, request, safety, stepDine, textbookBank, type PMode } from './deadlock';
import { rng } from './rng';

const names = (b: ReturnType<typeof textbookBank>, xs: number[]) => xs.map((i) => b.names[i]);

describe("Banker's algorithm (Silberschatz §8.6.3, A B C = 10 5 7)", () => {
  it('Need = Max − Allocation, and the totals are 10 5 7', () => {
    const b = textbookBank();
    assert.deepEqual(b.need, [[7, 4, 3], [1, 2, 2], [6, 0, 0], [0, 1, 1], [4, 3, 1]]);
    assert.deepEqual(b.total, [10, 5, 7]);
  });
  it('the state is safe; scanning like banker.py gives <P1, P3, P4, P0, P2>', () => {
    const b = textbookBank();
    const r = safety(b.alloc, b.need, b.avail);
    assert.ok(r.safe);
    assert.deepEqual(names(b, r.order), ['P1', 'P3', 'P4', 'P0', 'P2']);
    assert.deepEqual(r.steps.at(-1)!.work, [10, 5, 7]);
  });
  it('P1 requests (1,0,2): granted, still safe', () => {
    const b = textbookBank();
    const r = request(b, 1, [1, 0, 2]);
    assert.equal(r.verdict, 'grant');
    assert.deepEqual(r.after.avail, [2, 3, 0]);
    assert.deepEqual(names(b, r.check!.order), ['P1', 'P3', 'P4', 'P0', 'P2']);
  });
  it('after that, P4 (3,3,0) must wait (not available) and P0 (0,2,0) is denied (unsafe)', () => {
    const b1 = request(textbookBank(), 1, [1, 0, 2]).after;
    assert.equal(request(b1, 4, [3, 3, 0]).verdict, 'wait');
    const r = request(b1, 0, [0, 2, 0]);
    assert.equal(r.verdict, 'deny');
    assert.equal(r.check!.safe, false);
    assert.deepEqual(r.after, b1, 'state rolled back');
  });
  it('asking for more than the declared max is an error', () => {
    assert.equal(request(textbookBank(), 3, [0, 2, 0]).verdict, 'error');
  });
});

describe('deadlock detection with multi-instance resources (Silberschatz §8.7.2)', () => {
  const ex = Object.fromEntries(detectExamples().map((d) => [d.key, d]));
  const run = (k: string) => { const d = ex[k]; return safety(d.alloc, d.req, availOf(d), true); };
  it('A=7, B=2, C=6: no deadlock; scanning like banker.py gives <P0, P2, P3, P4, P1> (the book prints <P0, P2, P3, P1, P4> — also valid)', () => {
    assert.deepEqual(availOf(ex.textbook), [0, 0, 0]);
    const r = run('textbook');
    assert.ok(r.safe);
    assert.deepEqual(r.order.map((i) => ex.textbook.names[i]), ['P0', 'P2', 'P3', 'P4', 'P1']);
  });
  it('P2 asks one more C: P1, P2, P3, P4 are deadlocked (P0 can still finish)', () => {
    const r = run('p2more');
    assert.deepEqual(r.stuck.map((i) => ex.p2more.names[i]), ['P1', 'P2', 'P3', 'P4']);
  });
  it('a cycle in the graph is necessary but not sufficient when resources have several instances', () => {
    assert.ok(hasCycle(ex.cycle));
    assert.ok(run('cycle').safe);
    assert.ok(hasCycle(ex.pool) && !run('pool').safe);
  });
});

describe('dining philosophers', () => {
  const dine = (mode: PMode, together: boolean, seed: number, ticks: number) => {
    const R = rng(seed); let d = initDine(mode, together, R);
    for (let k = 0; k < ticks && !d.deadlock; k++) d = stepDine(d, R);
    return d;
  };
  it('naive (left then right), everyone hungry at once: deadlock', () => {
    const d = dine('naive', true, 1, 50);
    assert.ok(d.deadlock);
    assert.ok(d.ph.every((p) => p.held.length === 1));
  });
  it('naive with random timing deadlocks sooner or later', () => {
    let hits = 0;
    for (let seed = 1; seed <= 20; seed++) if (dine('naive', false, seed, 3000).deadlock) hits++;
    assert.ok(hits >= 5, `${hits}/20`);
  });
  for (const mode of ['ordered', 'waiter', 'trylock'] as PMode[]) {
    it(`${mode}: never deadlocks and everybody eats`, () => {
      for (let seed = 1; seed <= 15; seed++) for (const together of [true, false]) {
        const d = dine(mode, together, seed, 2000);
        assert.ok(!d.deadlock);
        assert.ok(d.ph.every((p) => p.meals > 20), `${mode} seed ${seed}: ${d.ph.map((p) => p.meals)}`);
      }
    });
  }
});

describe('priority inversion (ch06/pi.c, Mars Pathfinder)', () => {
  it('without inheritance H waits 540 ms (M runs 500 ms while L holds the mutex)', () => {
    const r = priorityInversion(false);
    assert.equal(r.hWait, 540);
    assert.ok(r.segs.some((s) => s.task === 'M' && s.from === 10 && s.to === 510));
  });
  it('with priority inheritance H waits 40 ms (L finishes its critical section at priority 30)', () => {
    const r = priorityInversion(true);
    assert.equal(r.hWait, 40);
    assert.ok(r.segs.some((s) => s.task === 'L' && s.eff === 30 && s.from === 10 && s.to === 50));
  });
  it('a 125 ms watchdog fires only without inheritance', () => {
    assert.equal(priorityInversion(false, 125).watchdogAt, 135);
    assert.equal(priorityInversion(true, 125).watchdogAt, null);
  });
});
