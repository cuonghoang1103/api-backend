// kiem-engine.mts — đối chiếu LẦN HAI: mọi đáp án của osgcalc.py (bài 16.3–16.5) chạy lại bằng bộ máy mô phỏng của /os-lab
// (frontend/src/components/os-lab/engine, gắn chỉ-đọc vào /engine). Hai chương trình viết độc lập, hai ngôn ngữ.
//   node --experimental-strip-types kiem-engine.mts
import { execFileSync } from 'node:child_process';
import { simulate, type Policy } from '/engine/scheduler.ts';
import { replace, type Algo } from '/engine/vm.ts';
import { safety, request, type Bank } from '/engine/deadlock.ts';

const py = (...a: string[]) => execFileSync('python3', ['osgcalc.py', ...a], { encoding: 'utf8' });
let ok = 0, bad = 0;
const check = (what: string, engine: string | number, mine: string | number) => {
  const same = String(engine) === String(mine);
  same ? ok++ : bad++;
  console.log(`${same ? 'OK ' : 'BAD'} ${what.padEnd(46)} engine=${String(engine).padEnd(8)} osgcalc=${mine}`);
};

// ── lập lịch: trung bình chờ + trung bình hoàn thành
const jobs = (s: string) => s.split(' ').map((t) => { const [id, a, b, p] = t.split(':'); return { id, arrival: +a, burst: +b, prio: +(p ?? 0) }; });
const avgOf = (out: string, k: string) => Number(out.match(new RegExp(`average ${k} *= [0-9]+/[0-9]+ = ([0-9.]+)`))![1]);
const S = [
  ['S1', 'A:0:6:4 B:0:3:1 C:0:8:5 D:0:2:2 E:0:5:3'],
  ['S2', 'P1:0:7 P2:1:4 P3:2:1 P4:4:4 P5:6:3'],
  ['S3', 'P1:0:6:3 P2:2:3:1 P3:3:4:4 P4:5:2:2'],
  ['Q2', 'A:0:5 B:0:9 C:0:2 D:0:4'],
  ['Q3', 'P1:0:6 P2:1:4 P3:2:2'],
  ['Q4', 'P1:0:6 P2:2:2 P3:3:8 P4:5:3'],
] as const;
for (const [name, js] of S) {
  for (const [pol, q] of [['fcfs', 2], ['sjf', 2], ['srtf', 2], ['rr', 2], ['rr', 3], ['prio', 2], ['prio-p', 2]] as Array<[Policy, number]>) {
    let ps = jobs(js);
    // engine: số NHỎ = ưu tiên cao. Đề S1 nói "5 = cao nhất" ⇒ lật dấu cho engine, osgcalc dùng hi=big
    const big = name === 'S1' && pol.startsWith('prio');
    if (big) ps = ps.map((p) => ({ ...p, prio: -p.prio }));
    const r = simulate(ps, { policy: pol, cores: 1, quantum: q, cs: 0 });
    const out = py('sched', pol, js, `q=${q}`, ...(big ? ['hi=big'] : []));
    check(`${name} ${pol}${pol === 'rr' ? ' q=' + q : ''} avg waiting`, +r.avg.waiting.toFixed(2), avgOf(out, 'waiting'));
    check(`${name} ${pol}${pol === 'rr' ? ' q=' + q : ''} avg turnaround`, +r.avg.turnaround.toFixed(2), avgOf(out, 'turnaround'));
  }
}

// ── thay trang: số lỗi trang
const refsOf = (s: string) => s.split(' ').map(Number);
for (const [refs, frames, algos] of [
  ['7 2 7 3 1 2 4 2 7 3 2 1 5 2', 3, ['fifo', 'lru', 'opt', 'clock']],
  ['7 2 7 3 1 2 4 2 7 3 2 1 5 2', 4, ['fifo', 'lru', 'opt', 'clock']],
  ['1 2 3 4 1 2 5 1 2 3 4 5', 3, ['fifo', 'lru']],
  ['1 2 3 4 1 2 5 1 2 3 4 5', 4, ['fifo', 'lru']],
  ['1 3 5 2 3 1 4 5 2 3 6 2', 3, ['opt', 'lru']],
  ['1 3 5 2 3 1 4 5 2 3 6 2', 4, ['lru', 'fifo']],
] as Array<[string, number, Algo[]]>) {
  for (const al of algos) {
    const eng = replace(refsOf(refs), frames, al).filter((x) => !x.hit).length;
    const mine = Number(py('page', al, String(frames), refs).match(/page faults = (\d+)/)![1]);
    check(`${al.toUpperCase()} ${frames} frames "${refs.slice(0, 13)}…" faults`, eng, mine);
  }
}

// ── Banker: an toàn? thứ tự an toàn? cấp hay từ chối?
const M = (s: string) => s.split(' ').map((r) => r.split(',').map(Number));
const bank = (al: string, mx: string, av: string): Bank => {
  const alloc = M(al), max = M(mx), avail = av.split(',').map(Number);
  return { names: alloc.map((_, i) => 'P' + i), res: avail.map((_, i) => 'R' + i), alloc, max, need: max.map((m, i) => m.map((x, k) => x - alloc[i][k])), avail, total: [] };
};
const B1 = bank('1,0,1 2,1,1 0,1,0 1,2,0 0,0,2', '4,2,3 3,2,2 2,3,1 1,3,2 3,1,4', '2,1,1');
const s1 = safety(B1.alloc, B1.need, B1.avail);
const outB1 = py('banker', '1,0,1 2,1,1 0,1,0 1,2,0 0,0,2', '4,2,3 3,2,2 2,3,1 1,3,2 3,1,4', '2,1,1', 'P4=1,0,1', 'P1=1,0,0');
check('B1 safe sequence', '<' + s1.order.map((i) => 'P' + i).join(', ') + '>', outB1.match(/safe sequence (<[^>]+>)/)![1]);
const r4 = request(B1, 4, [1, 0, 1]);
check('B1 request P4 (1,0,1)', r4.verdict.toUpperCase(), outB1.match(/Request P4[\s\S]*?(DENY|GRANT)/)![1]);
const r1 = request(r4.after, 1, [1, 0, 0]);
check('B1 request P1 (1,0,0) after that', r1.verdict.toUpperCase(), outB1.match(/Request P1[\s\S]*?(DENY|GRANT)/)![1]);
for (const free of ['2', '1']) {
  const b = bank('2 1 3 2', '7 4 5 8', free);
  const out = py('banker', '2 1 3 2', '7 4 5 8', free);
  check(`B3 Has/Max with Free = ${free}`, safety(b.alloc, b.need, b.avail).safe ? 'SAFE' : 'UNSAFE', /SAFE, safe/.test(out) ? 'SAFE' : 'UNSAFE');
}
{
  const b = bank('1,2 2,0 0,1 1,1', '3,3 2,2 2,2 1,3', '1,1');
  const out = py('banker', '1,2 2,0 0,1 1,1', '3,3 2,2 2,2 1,3', '1,1');
  check('Q9 two resources, Available = (1,1)', safety(b.alloc, b.need, b.avail).safe ? 'SAFE' : 'UNSAFE', /SAFE, safe/.test(out) ? 'SAFE' : 'UNSAFE');
}
for (const av of ['0,0,0', '0,1,0']) {
  const al = M('1,0,1 0,1,0 1,1,0 0,0,1'), rq = M('0,1,0 1,0,1 0,0,1 1,0,0');
  const eng = safety(al, rq, av.split(',').map(Number), true).stuck.map((i) => 'P' + i).join(', ') || 'none';
  const out = py('detect', '1,0,1 0,1,0 1,1,0 0,0,1', '0,1,0 1,0,1 0,0,1 1,0,0', av);
  check(`B4 detection, Available = (${av})`, eng, (out.match(/DEADLOCKED: (.*)/) ?? [, 'none'])[1]);
}
console.log(`${ok} agree, ${bad} disagree`);
