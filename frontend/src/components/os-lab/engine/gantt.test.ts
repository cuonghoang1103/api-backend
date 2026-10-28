/**
 * gantt-exam: đối chiếu BA chiều —
 *   1) output thật của osgcalc.py trong lab/out/c163-lich.out.txt (biểu đồ Gantt từng khúc + bảng + trung bình);
 *   2) engine/scheduler.ts (bộ máy của mô phỏng `scheduler`, đã khớp osgcalc 108/108 ở c16-engine) trên 400 đề ngẫu nhiên;
 *   3) bộ chấm: bài đúng được điểm tối đa, các lỗi quy ước kinh điển bị gọi đúng tên.
 *   cd frontend && npx tsx --test src/components/os-lab/engine/gantt.test.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { DRILLS, grade, perfect, randomDrill, solve, type GJob, type GPolicy } from './gantt';
import { simulate } from './scheduler';

const OUT = fileURLToPath(new URL('../../../../../content/courses/operating-systems-for-developers/lab/out/c163-lich.out.txt', import.meta.url));
const parseJobs = (s: string): GJob[] => s.split(' ').map((t) => { const [id, a, b, p] = t.split(':'); return { id, arrival: +a, burst: +b, prio: +(p ?? 0) }; });

interface Block { algo: GPolicy; jobs: GJob[]; q: number; hiBig: boolean; segs: Array<[string, number, number]>; rows: Record<string, number[]>; avgT: string; avgW: string }
function blocks(): Block[] {
  const lines = fs.readFileSync(OUT, 'utf8').split('\n');
  const out: Block[] = [];
  for (let k = 0; k < lines.length; k++) {
    const m = lines[k].match(/^\$ python3 osgcalc\.py sched (\S+) "([^"]+)"(.*)$/);
    if (!m) continue;
    const q = Number((m[3].match(/q=(\d+)/) ?? [, '2'])[1]);
    const bar = lines[k + 2], marks = lines[k + 3];
    const names = bar.split('|').slice(1, -1).map((x) => x.trim());
    const times = marks.trim().split(/\s+/).map(Number);
    const segs = names.map((n, i) => [n, times[i], times[i + 1]] as [string, number, number]);
    const rows: Record<string, number[]> = {};
    let j = k + 5;
    for (; !lines[j].startsWith('average'); j++) { const c = lines[j].trim().split(/\s+/); rows[c[0]] = c.slice(1).map(Number); }
    out.push({ algo: m[1] as GPolicy, jobs: parseJobs(m[2]), q, hiBig: /hi=big/.test(m[3]), segs, rows, avgT: lines[j].split('= ').pop()!, avgW: lines[j + 1].split('= ').pop()! });
  }
  return out;
}

describe('gantt-exam vs osgcalc.py (c163)', () => {
  const B = blocks();
  it('parsed every sched run of the chapter output', () => assert.equal(B.length, 9));
  for (const b of B) {
    it(`${b.algo}${b.algo === 'rr' ? ` q=${b.q}` : ''}${b.hiBig ? ' hi=big' : ''} ${b.jobs.map((j) => j.id).join('')}`, () => {
      const R = solve(b.jobs, b.algo, { quantum: b.q, hiBig: b.hiBig, rrNewFirst: true });
      assert.deepEqual(R.segs.map((s) => [s.id ?? 'idle', s.from, s.to]), b.segs);
      for (const r of R.rows) assert.deepEqual([r.arrival, r.burst, r.finish, r.turnaround, r.waiting, r.response], b.rows[r.id], r.id);
      const f = (x: number) => (Number.isInteger(x) ? String(x) : x.toFixed(2));
      assert.equal(f(R.avg.turnaround), b.avgT);
      assert.equal(f(R.avg.waiting), b.avgW);
    });
  }
  it('the textbook numbers quoted in Ch16: S1 FCFS 75/5 = 15 and 51/5 = 10.20; S2 SRTF waits 3.60', () => {
    const s1 = solve(DRILLS.s1.jobs, 'fcfs', DRILLS.s1.conv);
    assert.equal(s1.sum.turnaround, 75); assert.equal(s1.sum.waiting, 51);
    assert.equal(solve(DRILLS.s2.jobs, 'srtf', DRILLS.s2.conv).avg.waiting, 3.6);
  });
});

describe('gantt-exam vs engine/scheduler.ts (400 random exams)', () => {
  it('same finish times and averages for every policy', () => {
    let n = 0, skipped = 0;
    for (let seed = 1; seed <= 400; seed++) {
      for (const pol of ['fcfs', 'sjf', 'srtf', 'rr', 'prio', 'prio-p'] as GPolicy[]) {
        const d = randomDrill(seed, pol);
        // Hoà TRỌN (cùng lúc đến VÀ cùng thời gian/ưu tiên): osgcalc + Ch16 xếp theo thứ tự trong bảng, scheduler.ts xếp
        // theo thứ tự trong hàng (việc vừa bị cắt đứng sau) — xem phép kiểm "full tie" bên dưới. Bỏ các đề đó ở đây.
        if (d.jobs.some((a, i) => d.jobs.some((b, k) => k > i && a.arrival === b.arrival && (a.burst === b.burst || a.prio === b.prio)))) { skipped++; continue; }
        const conv = { ...d.conv, hiBig: false };
        const R = solve(d.jobs, pol, conv);
        const S = simulate(d.jobs, { policy: pol, cores: 1, quantum: conv.quantum, cs: 0 });
        for (const r of R.rows) assert.equal(r.finish, S.stats[r.id].finish, `seed ${seed} ${pol} ${r.id}`);
        assert.ok(Math.abs(R.avg.waiting - S.avg.waiting) < 1e-9);
        // cùng biểu đồ, ô theo ô
        S.ticks.slice(0, R.end).forEach((tk, k) => assert.equal(tk.cores[0].pid, R.cells[k], `seed ${seed} ${pol} t=${k}`));
        n++;
      }
    }
    assert.equal(n + skipped, 2400);
    assert.ok(n > 1500, `only ${n} compared`);
  });
  it('full tie (same arrival, same priority, one preempted): table order wins, as Ch16 says — scheduler.ts differs here', () => {
    const jobs = parseJobs('P1:0:2:3 P2:0:2:3 P3:1:5:2 P4:2:2:4');
    const conv = { quantum: 2, hiBig: false, rrNewFirst: true };
    assert.equal(solve(jobs, 'prio-p', conv).cells.join(' '), 'P1 P3 P3 P3 P3 P3 P1 P2 P2 P4 P4');
    const S = simulate(jobs, { policy: 'prio-p', cores: 1, quantum: 2, cs: 0 });
    assert.equal(S.ticks.slice(0, 11).map((t) => t.cores[0].pid).join(' '), 'P1 P3 P3 P3 P3 P3 P2 P2 P1 P4 P4');
  });
  it('random drills are solvable on a phone: ≤ 26 cells, first job at 0', () => {
    for (let seed = 1; seed <= 200; seed++) { const d = randomDrill(seed, 'rr'); assert.ok(solve(d.jobs, 'rr', d.conv).end <= 32); assert.equal(d.jobs[0].arrival, 0); }
  });
});

describe('grading', () => {
  it('a perfect answer gets full marks and no slips', () => {
    for (const d of Object.values(DRILLS)) for (const pol of ['fcfs', 'sjf', 'srtf', 'rr', 'prio', 'prio-p'] as GPolicy[]) {
      const g = grade(d.jobs, pol, d.conv, perfect(d.jobs, pol, d.conv));
      assert.equal(g.score, g.max, `${d.key} ${pol}`); assert.deepEqual(g.slips, []);
    }
  });
  it('RR with the preempted job queued first is named "rr-order"', () => {
    const d = DRILLS.q4;
    const wrong = solve(d.jobs, 'rr', { ...d.conv, rrNewFirst: false });
    const right = solve(d.jobs, 'rr', d.conv);
    assert.notEqual(wrong.cells.join(), right.cells.join());
    const g = grade(d.jobs, 'rr', d.conv, { cells: wrong.cells, rows: {} });
    assert.ok(g.slips.includes('rr-order'), JSON.stringify(g.slips));
    assert.ok(g.cellScore < right.end);
  });
  it('priority read the wrong way round is named "prio-dir"', () => {
    const d = DRILLS.s3;
    const wrong = solve(d.jobs, 'prio-p', { ...d.conv, hiBig: true });
    assert.ok(grade(d.jobs, 'prio-p', d.conv, { cells: wrong.cells, rows: {} }).slips.includes('prio-dir'));
  });
  it('a non-preemptive chart for SRTF is named "not-preempt"', () => {
    const d = DRILLS.s2;
    const wrong = solve(d.jobs, 'sjf', d.conv);
    assert.ok(grade(d.jobs, 'srtf', d.conv, { cells: wrong.cells, rows: {} }).slips.includes('not-preempt'));
  });
  it('waiting written as response time, turnaround written as finish time', () => {
    const d = DRILLS.s2;
    const R = solve(d.jobs, 'srtf', d.conv);
    const rows = Object.fromEntries(R.rows.map((r) => [r.id, { finish: r.finish, turnaround: r.finish, waiting: r.response }]));
    const g = grade(d.jobs, 'srtf', d.conv, { cells: R.cells, rows });
    assert.ok(g.slips.includes('waiting-def') && g.slips.includes('turnaround-def'), JSON.stringify(g.slips));
  });
});
