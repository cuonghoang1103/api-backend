/**
 * disk-arm: đối chiếu với output thật của `osgcalc.py disk` (lab/out/c165-banker-dia) — thứ tự đi và tổng số trụ.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/disk.test.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { cylinderSkew, diskSchedule, DISK_165, whichAlgo, type DAlgo } from './disk';

const OUT = fs.readFileSync(fileURLToPath(new URL('../../../../../content/courses/operating-systems-for-developers/lab/out/c165-banker-dia.out.txt', import.meta.url)), 'utf8').split('\n');

describe('disk-arm vs osgcalc.py (c165)', () => {
  const runs: Array<{ algo: DAlgo; head: number; reqs: number[]; up: boolean; order: string; total: number }> = [];
  OUT.forEach((l, k) => {
    const m = l.match(/^\$ python3 osgcalc\.py disk (\S+) (\d+) "([^"]+)"(.*)$/);
    if (!m) return;
    const order = OUT[k + 2].replace('order: ', '').trim();
    const total = Number(OUT[k + 3].match(/= (\d+) cylinders/)![1]);
    runs.push({ algo: m[1] as DAlgo, head: +m[2], reqs: m[3].split(' ').map(Number), up: !/down/.test(m[4]), order, total });
  });
  it('found the seven runs of 16.5', () => assert.equal(runs.length, 7));
  for (const r of runs) {
    it(`${r.algo} ${r.up ? 'up' : 'down'} = ${r.total}`, () => {
      const R = diskSchedule(r.algo, { head: r.head, reqs: r.reqs, up: r.up, max: 199, countReturn: true });
      assert.equal(R.order.join(' -> '), r.order);
      assert.equal(R.total, r.total);
    });
  }
  it('the totals quoted in Ch16: 708 / 237 / 306 / 270 / 385 / 325', () => {
    const t = (['fcfs', 'sstf', 'scan', 'look', 'cscan', 'clook'] as DAlgo[]).map((a) => diskSchedule(a, DISK_165).total);
    assert.deepEqual(t, [708, 237, 306, 270, 385, 325]);
  });
  it('C-SCAN without the return jump = 186 (the other convention Ch16 mentions)', () => {
    const R = diskSchedule('cscan', { ...DISK_165, countReturn: false });
    assert.equal(R.total, 186); assert.equal(R.totalWithJump, 385);
    assert.equal(R.moves.filter((m) => m.jump).length, 1); assert.equal(R.moves.find((m) => m.jump)!.dist, 199);
  });
  it('every request is served exactly once, edges are not requests', () => {
    for (const a of ['fcfs', 'sstf', 'scan', 'look', 'cscan', 'clook'] as DAlgo[]) for (const up of [true, false]) {
      const R = diskSchedule(a, { ...DISK_165, up });
      assert.deepEqual([...R.served].sort((x, y) => x - y), [...DISK_165.reqs].sort((x, y) => x - y), `${a} ${up}`);
    }
  });
  it('K1.3: 80, 98, 132, 140, 181, 12, 30, 45, 67 can only be C-LOOK; K1.4: LOOK down = SSTF = 237', () => {
    assert.deepEqual(whichAlgo(DISK_165, [80, 98, 132, 140, 181, 12, 30, 45, 67]), ['clook']);
    assert.equal(diskSchedule('look', { ...DISK_165, up: false }).total, 237);
    assert.deepEqual(diskSchedule('look', { ...DISK_165, up: false }).order, diskSchedule('sstf', DISK_165).order);
  });
  it('cylinder skew: 7200 rpm, 1 ms seek, 300 sectors ⇒ 36 (c165 K2)', () => {
    const s = cylinderSkew(7200, 1, 300);
    assert.equal(s.skew, 36); assert.equal(s.rotMs.toFixed(4), '8.3333'); assert.equal(s.perSector.toFixed(5), '0.02778');
  });
});
