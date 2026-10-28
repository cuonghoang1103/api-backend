/**
 * Chế độ THI cho lập lịch CPU (bài 16.3, đợt mô phỏng #4 — 29/10/2026): một bộ giải một lõi viết lại ĐÚNG luật của
 * lab/code/ch16/osgcalc.py, cộng bộ chấm từng ô và bộ "đoán bạn hiểu sai quy ước nào".
 *
 * Quy ước (y như Ch16 "Luật hoà — ghi ra giấy"):
 *   • thời gian nguyên, mỗi ô Gantt = 1 đơn vị;
 *   • ở mỗi thời điểm t: (1) thêm việc vừa đến vào hàng (theo thứ tự đến, rồi thứ tự trong bảng), (2) xét cắt ngang,
 *     (3) chọn việc kế tiếp;
 *   • hoà thời gian/ưu tiên ⇒ đến sớm hơn trước, rồi thứ tự trong bảng;
 *   • Round robin: việc đến đúng lúc t vào hàng TRƯỚC việc bị cắt lúc t; hết quantum mà hàng trống ⇒ chạy tiếp;
 *   • ưu tiên: mặc định số NHỎ = ưu tiên cao; đề "số lớn = cao" ⇒ bật hiBig (osgcalc hi=big);
 *   • turnaround = xong − đến · waiting = turnaround − thời gian CPU · response = lần chạy đầu − đến.
 * Kết quả được đối chiếu ba chiều trong gantt.test.ts: output thật c163 của osgcalc.py, và engine/scheduler.ts
 * (bộ máy của mô phỏng `scheduler`) trên vài trăm đề ngẫu nhiên.
 */
import { rng } from './rng';

export type GPolicy = 'fcfs' | 'sjf' | 'srtf' | 'rr' | 'prio' | 'prio-p';
export const G_POLICIES: GPolicy[] = ['fcfs', 'sjf', 'srtf', 'rr', 'prio', 'prio-p'];
export interface GJob { id: string; arrival: number; burst: number; prio: number }
export interface GConv { quantum: number; hiBig: boolean; /** true = quy ước giáo trình (việc mới đến xếp trước việc vừa bị cắt) */ rrNewFirst: boolean }
export interface GSeg { id: string | null; from: number; to: number }
export interface GRow { id: string; arrival: number; burst: number; finish: number; turnaround: number; waiting: number; response: number }
export interface GDecision {
  t: number;
  arrived: string[];
  preempted: string | null;
  picked: string | null;
  running: string | null;
  /** hàng sẵn sàng SAU khi chọn (đúng thứ tự trong hàng) */
  ready: string[];
  finished: string | null;
  en: string; vi: string;
}
export interface GResult {
  segs: GSeg[]; cells: Array<string | null>; rows: GRow[]; end: number;
  avg: { turnaround: number; waiting: number; response: number };
  sum: { turnaround: number; waiting: number };
  switches: number; decisions: GDecision[];
}

export const POLICY_NAME: Record<GPolicy, [string, string]> = {
  fcfs: ['FCFS', 'FCFS'], sjf: ['SJF (non-preemptive)', 'SJF (không cắt ngang)'], srtf: ['SRTF (preemptive SJF)', 'SRTF (SJF có cắt ngang)'],
  rr: ['Round robin', 'Round robin'], prio: ['Priority (non-preemptive)', 'Ưu tiên (không cắt ngang)'], 'prio-p': ['Priority (preemptive)', 'Ưu tiên (có cắt ngang)'],
};

export function solve(jobs: GJob[], policy: GPolicy, conv: GConv): GResult {
  const J = jobs.map((j, idx) => ({ ...j, idx }));
  const by = new Map(J.map((j) => [j.id, j]));
  const rem = new Map(J.map((j) => [j.id, j.burst]));
  const first = new Map<string, number>();
  const fin = new Map<string, number>();
  const prioKey = (id: string) => (conv.hiBig ? -by.get(id)!.prio : by.get(id)!.prio);
  const key = (id: string): number[] => {
    const j = by.get(id)!;
    if (policy === 'sjf' || policy === 'srtf') return [rem.get(id)!, j.arrival, j.idx];
    if (policy === 'prio' || policy === 'prio-p') return [prioKey(id), j.arrival, j.idx];
    return [0];
  };
  const less = (a: number[], b: number[]) => { for (let k = 0; k < Math.max(a.length, b.length); k++) { if ((a[k] ?? 0) !== (b[k] ?? 0)) return (a[k] ?? 0) < (b[k] ?? 0); } return false; };
  const best = (list: string[]) => list.reduce((m, x) => (less(key(x), key(m)) ? x : m), list[0]);

  const ready: string[] = [];
  const cells: Array<string | null> = [];
  const decisions: GDecision[] = [];
  const order = [...J].sort((a, b) => a.arrival - b.arrival || a.idx - b.idx);
  let run: string | null = null, slice = 0, t = 0;
  let lastFinished: string | null = null;
  const q = Math.max(1, Math.round(conv.quantum));
  const left = () => [...rem.values()].some((v) => v > 0);
  while (left() && t < 1000) {
    const arrived = order.filter((j) => j.arrival === t).map((j) => j.id);
    let preempted: string | null = null;
    let why: [string, string] | null = null;
    // (2) cắt ngang — quy ước "sai" của RR: việc bị cắt xếp TRƯỚC việc mới đến
    const cutRR = () => run !== null && policy === 'rr' && slice >= q && (ready.length > 0 || arrived.length > 0);
    if (!conv.rrNewFirst && cutRR()) { preempted = run; ready.push(run!); run = null; why = [`${preempted} used its quantum of ${q} and goes to the back of the queue`, `${preempted} dùng hết quantum ${q}, xuống cuối hàng`]; }
    ready.push(...arrived); // (1) việc mới đến
    if (run !== null) {
      let cut = false;
      if (policy === 'rr' && conv.rrNewFirst && slice >= q && ready.length) { cut = true; why = [`${run} used its quantum of ${q}; it goes BEHIND ${arrived.length ? 'the newcomer' + (arrived.length > 1 ? 's' : '') + ' ' + arrived.join(', ') : 'the waiting jobs'}`, `${run} dùng hết quantum ${q}; xếp SAU ${arrived.length ? 'việc vừa đến ' + arrived.join(', ') : 'các việc đang chờ'}`]; }
      if ((policy === 'srtf' || policy === 'prio-p') && ready.length) {
        const b = best(ready);
        if (less(key(b), key(run))) {
          cut = true;
          why = policy === 'srtf'
            ? [`${b} needs only ${rem.get(b)} more, ${run} still needs ${rem.get(run)} ⇒ ${b} takes the CPU`, `${b} chỉ còn ${rem.get(b)}, ${run} còn ${rem.get(run)} ⇒ ${b} giành CPU`]
            : [`${b} has priority ${by.get(b)!.prio}, better than ${run}'s ${by.get(run)!.prio} ⇒ ${b} takes the CPU`, `${b} ưu tiên ${by.get(b)!.prio}, cao hơn ${by.get(run)!.prio} của ${run} ⇒ ${b} giành CPU`];
        }
      }
      if (cut) { preempted = run; ready.push(run); run = null; }
    }
    let picked: string | null = null;
    let pickWhy: [string, string] | null = null;
    if (run === null && ready.length) {
      const pool = [...ready];
      picked = policy === 'fcfs' || policy === 'rr' ? ready[0] : best(ready);
      ready.splice(ready.indexOf(picked), 1);
      run = picked; slice = 0;
      if (!first.has(picked)) first.set(picked, t);
      const tie = pool.filter((x) => x !== picked && key(x)[0] === key(picked!)[0]);
      if (policy === 'fcfs' || policy === 'rr') pickWhy = [`${picked} is at the front of the ready queue [${pool.join(', ')}]`, `${picked} đứng đầu hàng sẵn sàng [${pool.join(', ')}]`];
      else if (policy === 'sjf' || policy === 'srtf') pickWhy = [`shortest ${policy === 'srtf' ? 'remaining time' : 'burst'} among [${pool.map((x) => `${x}:${rem.get(x)}`).join(', ')}] is ${picked} (${rem.get(picked)})${tie.length ? ` — tie with ${tie.join(', ')}: earlier arrival / table order wins` : ''}`, `${policy === 'srtf' ? 'thời gian còn lại' : 'thời gian CPU'} nhỏ nhất trong [${pool.map((x) => `${x}:${rem.get(x)}`).join(', ')}] là ${picked} (${rem.get(picked)})${tie.length ? ` — hoà với ${tie.join(', ')}: đến sớm hơn / đứng trước trong bảng thắng` : ''}`];
      else pickWhy = [`best priority among [${pool.map((x) => `${x}:${by.get(x)!.prio}`).join(', ')}] (${conv.hiBig ? 'bigger' : 'smaller'} number = higher) is ${picked}${tie.length ? ` — tie with ${tie.join(', ')}: earlier arrival / table order wins` : ''}`, `ưu tiên tốt nhất trong [${pool.map((x) => `${x}:${by.get(x)!.prio}`).join(', ')}] (số ${conv.hiBig ? 'lớn' : 'nhỏ'} = cao) là ${picked}${tie.length ? ` — hoà với ${tie.join(', ')}: đến sớm hơn / đứng trước trong bảng thắng` : ''}`];
    }
    const en: string[] = [], vi: string[] = [];
    if (lastFinished) { en.push(`${lastFinished} finished at ${t}.`); vi.push(`${lastFinished} xong lúc ${t}.`); }
    if (arrived.length) { en.push(`${arrived.join(', ')} arrive${arrived.length === 1 ? 's' : ''} and join${arrived.length === 1 ? 's' : ''} the ready queue.`); vi.push(`${arrived.join(', ')} đến, vào hàng sẵn sàng.`); }
    if (why) { en.push(why[0] + '.'); vi.push(why[1] + '.'); }
    if (pickWhy) { en.push(`Pick: ${pickWhy[0]}.`); vi.push(`Chọn: ${pickWhy[1]}.`); }
    else if (run !== null && !preempted) { en.push(`${run} keeps running (${rem.get(run)} left${policy === 'rr' ? `, slice ${slice + 1}/${q}` : ''}).`); vi.push(`${run} chạy tiếp (còn ${rem.get(run)}${policy === 'rr' ? `, lát ${slice + 1}/${q}` : ''}).`); }
    if (run === null) { en.push('Nobody is ready: the CPU idles.'); vi.push('Không ai sẵn sàng: CPU rảnh.'); }
    cells.push(run);
    lastFinished = null;
    if (run !== null) {
      rem.set(run, rem.get(run)! - 1); slice++;
      if (rem.get(run) === 0) { fin.set(run, t + 1); lastFinished = run; }
    }
    decisions.push({ t, arrived, preempted, picked, running: run, ready: [...ready], finished: null, en: en.join(' '), vi: vi.join(' ') });
    if (run !== null && rem.get(run) === 0) run = null;
    t++;
  }
  if (lastFinished) decisions.push({ t, arrived: [], preempted: null, picked: null, running: null, ready: [], finished: lastFinished, en: `${lastFinished} finished at ${t}. Everything is done: the chart is ${t} units long.`, vi: `${lastFinished} xong lúc ${t}. Xong hết: biểu đồ dài ${t} đơn vị.` });
  const segs: GSeg[] = [];
  cells.forEach((id, k) => { const s = segs[segs.length - 1]; if (s && s.id === id) s.to = k + 1; else segs.push({ id, from: k, to: k + 1 }); });
  const rows: GRow[] = J.map((j) => {
    const f = fin.get(j.id)!, ta = f - j.arrival;
    return { id: j.id, arrival: j.arrival, burst: j.burst, finish: f, turnaround: ta, waiting: ta - j.burst, response: first.get(j.id)! - j.arrival };
  });
  const n = Math.max(1, rows.length);
  const sumT = rows.reduce((a, r) => a + r.turnaround, 0), sumW = rows.reduce((a, r) => a + r.waiting, 0);
  let switches = 0;
  for (let k = 1; k < segs.length; k++) if (segs[k - 1].id !== null && segs[k].id !== null) switches++;
  return { segs, cells, rows, end: cells.length, avg: { turnaround: sumT / n, waiting: sumW / n, response: rows.reduce((a, r) => a + r.response, 0) / n }, sum: { turnaround: sumT, waiting: sumW }, switches, decisions };
}

// ───────────────────────── đề thi ─────────────────────────
export interface GDrill { key: string; en: string; vi: string; jobs: GJob[]; policy: GPolicy; conv: GConv }
const J = (s: string): GJob[] => s.split(' ').map((t) => { const [id, a, b, p] = t.split(':'); return { id, arrival: +a, burst: +b, prio: +(p ?? 0) }; });
const STD = { quantum: 2, hiBig: false, rrNewFirst: true };
/** Đúng các đề của bài 16.3 (c163-lich) — osgcalc.py đã in đáp án. */
export const DRILLS: Record<string, GDrill> = {
  s1: { key: 's1', en: 'S1 — five batch jobs, all at time 0', vi: 'S1 — năm việc theo lô, cùng đến lúc 0', jobs: J('A:0:6:4 B:0:3:1 C:0:8:5 D:0:2:2 E:0:5:3'), policy: 'fcfs', conv: { ...STD, hiBig: true } },
  s2: { key: 's2', en: 'S2 — five processes with arrival times', vi: 'S2 — năm tiến trình có thời điểm đến', jobs: J('P1:0:7 P2:1:4 P3:2:1 P4:4:4 P5:6:3'), policy: 'srtf', conv: { ...STD, quantum: 3 } },
  s3: { key: 's3', en: 'S3 — preemptive priority, smaller = higher', vi: 'S3 — ưu tiên có cắt ngang, số nhỏ = cao', jobs: J('P1:0:6:3 P2:2:3:1 P3:3:4:4 P4:5:2:2'), policy: 'prio-p', conv: STD },
  q4: { key: 'q4', en: 'Q4 — round robin with a late long job', vi: 'Q4 — round robin với một việc dài đến muộn', jobs: J('P1:0:6 P2:2:2 P3:3:8 P4:5:3'), policy: 'rr', conv: { ...STD, quantum: 3 } },
};

/** Đề ngẫu nhiên có hạt giống: 4–5 việc, tổng ≤ 26 ô (vừa màn hình điện thoại), đến trong 0..6. */
export function randomDrill(seed: number, policy: GPolicy): GDrill {
  const r = rng(seed * 7919 + 13);
  const n = 4 + Math.floor(r() * 2);
  const arr = [0, ...Array.from({ length: n - 1 }, () => Math.floor(r() * 7))].sort((a, b) => a - b);
  const jobs: GJob[] = arr.map((a, k) => ({ id: `P${k + 1}`, arrival: a, burst: 1 + Math.floor(r() * 7), prio: 1 + Math.floor(r() * 5) }));
  let total = jobs.reduce((s, j) => s + j.burst, 0);
  while (total > 26) { const j = jobs.reduce((m, x) => (x.burst > m.burst ? x : m)); j.burst--; total--; }
  return { key: 'random', en: `Random exam #${seed}`, vi: `Đề ngẫu nhiên #${seed}`, jobs, policy, conv: { quantum: 2 + Math.floor(r() * 3), hiBig: r() < 0.3, rrNewFirst: true } };
}

// ───────────────────────── chấm bài ─────────────────────────
export interface GAnswer { cells: Array<string | null | undefined>; rows: Record<string, { finish?: number; turnaround?: number; waiting?: number }>; avgWaiting?: number; avgTurnaround?: number }
export interface GGrade {
  cells: boolean[]; cellScore: number;
  rows: Record<string, { finish: boolean; turnaround: boolean; waiting: boolean }>;
  avgWaiting: boolean; avgTurnaround: boolean;
  score: number; max: number;
  /** quy ước có lẽ đã hiểu sai (nếu bài của người học khớp một cách giải sai hơn khớp cách giải đúng) */
  slips: Slip[];
}
export type Slip = 'rr-order' | 'prio-dir' | 'preempt' | 'not-preempt' | 'fcfs' | 'waiting-def' | 'turnaround-def' | 'chart-length';
export const SLIP_TEXT: Record<Slip, [string, string]> = {
  'rr-order': ['Round robin order: a job arriving at t joins the queue BEFORE the job whose quantum ends at t. Your chart puts the preempted job first.', 'Thứ tự round robin: việc đến lúc t vào hàng TRƯỚC việc hết quantum lúc t. Biểu đồ của bạn xếp việc bị cắt lên trước.'],
  'prio-dir': ['Priority direction: your chart matches the OTHER convention. Re-read the question — here a ' + 'smaller/bigger number is higher.', 'Chiều ưu tiên: biểu đồ của bạn khớp quy ước NGƯỢC lại. Đọc lại đề — ở đây số nhỏ/lớn mới là ưu tiên cao.'],
  preempt: ['You preempted, but this policy is NON-preemptive: once a job starts it runs to the end.', 'Bạn đã cắt ngang, nhưng chính sách này KHÔNG cắt ngang: việc đã chạy là chạy tới hết.'],
  'not-preempt': ['This policy is preemptive: a newcomer that is shorter / more important takes the CPU at once. Your chart never preempts.', 'Chính sách này CÓ cắt ngang: việc mới đến ngắn hơn / quan trọng hơn giành CPU ngay. Biểu đồ của bạn không cắt ngang lần nào.'],
  fcfs: ['Your chart is plain FCFS (arrival order). This question asks for a different policy.', 'Biểu đồ của bạn là FCFS thuần (theo thứ tự đến). Đề này hỏi chính sách khác.'],
  'waiting-def': ['Waiting time = turnaround − burst (all the time spent in the ready queue), not "start − arrival" (that is response time).', 'Thời gian chờ = turnaround − thời gian CPU (mọi lúc nằm trong hàng sẵn sàng), không phải "lúc bắt đầu − lúc đến" (đó là response).'],
  'turnaround-def': ['Turnaround = finish − ARRIVAL. You wrote the finish time itself.', 'Turnaround = lúc xong − lúc ĐẾN. Bạn ghi chính lúc xong.'],
  'chart-length': ['The chart length must equal the total burst time (plus idle gaps). Count the cells again.', 'Độ dài biểu đồ phải bằng tổng thời gian CPU (cộng khoảng rảnh). Đếm lại số ô.'],
};

const near = (a: number | undefined, b: number) => a !== undefined && Number.isFinite(a) && Math.abs(a - b) < 0.006;

export function grade(jobs: GJob[], policy: GPolicy, conv: GConv, ans: GAnswer): GGrade {
  const R = solve(jobs, policy, conv);
  const cells = R.cells.map((id, k) => (ans.cells[k] ?? null) === id);
  const cellScore = cells.filter(Boolean).length;
  const rows: GGrade['rows'] = {};
  let rowScore = 0;
  for (const r of R.rows) {
    const a = ans.rows[r.id] ?? {};
    rows[r.id] = { finish: a.finish === r.finish, turnaround: a.turnaround === r.turnaround, waiting: a.waiting === r.waiting };
    rowScore += +rows[r.id].finish + +rows[r.id].turnaround + +rows[r.id].waiting;
  }
  const avgWaiting = near(ans.avgWaiting, R.avg.waiting), avgTurnaround = near(ans.avgTurnaround, R.avg.turnaround);
  const max = R.cells.length + 3 * R.rows.length + 2;
  const slips = diagnose(jobs, policy, conv, ans, R);
  return { cells, cellScore, rows, avgWaiting, avgTurnaround, score: cellScore + rowScore + +avgWaiting + +avgTurnaround, max, slips };
}

const matchCount = (a: Array<string | null | undefined>, b: Array<string | null>) => b.reduce((n, x, k) => n + +((a[k] ?? null) === x), 0) - Math.abs(a.filter((x) => x !== undefined).length - b.length);

function diagnose(jobs: GJob[], policy: GPolicy, conv: GConv, ans: GAnswer, R: GResult): Slip[] {
  const out: Slip[] = [];
  const filled = ans.cells.filter((x) => x !== undefined && x !== null).length;
  if (filled > 0) {
    const mine = matchCount(ans.cells, R.cells);
    const alts: Array<[Slip, GResult]> = [];
    if (policy === 'rr') alts.push(['rr-order', solve(jobs, policy, { ...conv, rrNewFirst: false })]);
    if (policy === 'prio' || policy === 'prio-p') alts.push(['prio-dir', solve(jobs, policy, { ...conv, hiBig: !conv.hiBig })]);
    if (policy === 'sjf') alts.push(['preempt', solve(jobs, 'srtf', conv)]);
    if (policy === 'prio') alts.push(['preempt', solve(jobs, 'prio-p', conv)]);
    if (policy === 'srtf') alts.push(['not-preempt', solve(jobs, 'sjf', conv)]);
    if (policy === 'prio-p') alts.push(['not-preempt', solve(jobs, 'prio', conv)]);
    if (policy !== 'fcfs') alts.push(['fcfs', solve(jobs, 'fcfs', conv)]);
    for (const [slip, A] of alts) {
      if (A.cells.join() === R.cells.join()) continue; // cách giải sai cho cùng đáp án ⇒ không phân biệt được
      if (matchCount(ans.cells, A.cells) > mine) out.push(slip);
    }
    const lastFilled = ans.cells.reduce((m: number, x, k) => (x !== undefined && x !== null ? k + 1 : m), 0);
    if (lastFilled > R.end || (filled >= R.end - 2 && lastFilled < R.end)) out.push('chart-length');
  }
  let wResp = 0, wWrong = 0, tFin = 0, tWrong = 0;
  for (const r of R.rows) {
    const a = ans.rows[r.id]; if (!a) continue;
    if (a.waiting !== undefined && a.waiting !== r.waiting) { wWrong++; if (a.waiting === r.response) wResp++; }
    if (a.turnaround !== undefined && a.turnaround !== r.turnaround) { tWrong++; if (a.turnaround === r.finish) tFin++; }
  }
  if (wWrong && wResp === wWrong) out.push('waiting-def');
  if (tWrong && tFin === tWrong) out.push('turnaround-def');
  return [...new Set(out)];
}

/** Bài mẫu đúng (để kiểm bộ chấm và cho nút "Làm giúp tôi" của tour). */
export function perfect(jobs: GJob[], policy: GPolicy, conv: GConv): GAnswer {
  const R = solve(jobs, policy, conv);
  return {
    cells: [...R.cells],
    rows: Object.fromEntries(R.rows.map((r) => [r.id, { finish: r.finish, turnaround: r.turnaround, waiting: r.waiting }])),
    avgWaiting: Math.round(R.avg.waiting * 100) / 100, avgTurnaround: Math.round(R.avg.turnaround * 100) / 100,
  };
}

/** "75/5 = 15", "51/5 = 10.20" — y cách osgcalc in. */
export const fracText = (sum: number, n: number) => `${sum}/${n} = ${Number.isInteger(sum / n) ? String(sum / n) : (sum / n).toFixed(2)}`;
