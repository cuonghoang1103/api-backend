/**
 * Phòng lab deadlock: thuật toán Banker (tránh), thuật toán phát hiện với tài nguyên NHIỀU BẢN (đồ thị cấp phát),
 * bữa tối của các triết gia (4 chế độ), đảo ngược ưu tiên kiểu Mars Pathfinder (kế thừa ưu tiên bật/tắt).
 * Số liệu khớp ch06/banker.py và ch06/pi.c của phòng lab (ví dụ Silberschatz, Operating System Concepts §8.6–8.7).
 */
export type Vec = number[];
export const le = (a: Vec, b: Vec) => a.every((x, k) => x <= b[k]);
export const add = (a: Vec, b: Vec) => a.map((x, k) => x + b[k]);
export const sub = (a: Vec, b: Vec) => a.map((x, k) => x - b[k]);

export interface Bank { names: string[]; res: string[]; alloc: Vec[]; max: Vec[] | null; need: Vec[]; avail: Vec; total: Vec }
export type SafeStep =
  | { k: 'check'; i: number; work: Vec; finish: boolean[]; ok: boolean }
  | { k: 'run'; i: number; work: Vec; newWork: Vec; finish: boolean[] }
  | { k: 'end'; work: Vec; finish: boolean[]; order: number[]; stuck: number[] };

/** Ví dụ kinh điển (giống banker.py): A B C = 10 5 7. */
export function textbookBank(): Bank {
  const alloc = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]];
  const max = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
  const avail = [3, 3, 2];
  return { names: ['P0', 'P1', 'P2', 'P3', 'P4'], res: ['A', 'B', 'C'], alloc, max, need: max.map((m, i) => sub(m, alloc[i])), avail, total: alloc.reduce(add, avail) };
}

/**
 * Thuật toán an toàn, quét như banker.py: mỗi lượt đi P0 → P(n−1), ai có Need ≤ Work thì cho chạy xong và trả hết;
 * lặp tới khi một lượt không ai chạy thêm được. `zeroDone` (thuật toán PHÁT HIỆN): tiến trình không giữ gì coi như xong.
 */
export function safety(alloc: Vec[], need: Vec[], avail: Vec, zeroDone = false): { steps: SafeStep[]; order: number[]; stuck: number[]; safe: boolean } {
  let work = [...avail];
  const finish = alloc.map((a) => zeroDone && a.every((x) => x === 0));
  const order: number[] = [], steps: SafeStep[] = [];
  let progress = true;
  while (progress) {
    progress = false;
    for (let i = 0; i < alloc.length; i++) {
      if (finish[i]) continue;
      const ok = le(need[i], work);
      steps.push({ k: 'check', i, work: [...work], finish: [...finish], ok });
      if (ok) {
        const nw = add(work, alloc[i]);
        finish[i] = true;
        steps.push({ k: 'run', i, work: [...work], newWork: nw, finish: [...finish] });
        work = nw; order.push(i); progress = true;
      }
    }
  }
  const stuck = finish.map((f, i) => (f ? -1 : i)).filter((i) => i >= 0);
  steps.push({ k: 'end', work, finish: [...finish], order, stuck });
  return { steps, order, stuck, safe: stuck.length === 0 };
}

export type Verdict = 'error' | 'wait' | 'grant' | 'deny';
/** Thuật toán yêu cầu tài nguyên của Banker: Request ≤ Need? ≤ Available? giả vờ cấp rồi chạy thuật toán an toàn. */
export function request(b: Bank, i: number, req: Vec): { verdict: Verdict; after: Bank; check: ReturnType<typeof safety> | null } {
  if (!le(req, b.need[i])) return { verdict: 'error', after: b, check: null };
  if (!le(req, b.avail)) return { verdict: 'wait', after: b, check: null };
  const after: Bank = { ...b, avail: sub(b.avail, req), alloc: b.alloc.map((a, k) => (k === i ? add(a, req) : [...a])), need: b.need.map((n, k) => (k === i ? sub(n, req) : [...n])) };
  const check = safety(after.alloc, after.need, after.avail);
  return { verdict: check.safe ? 'grant' : 'deny', after: check.safe ? after : b, check };
}

// ───────── phát hiện deadlock: tài nguyên nhiều bản ─────────
export interface Detect { key: string; en: string; vi: string; names: string[]; res: string[]; inst: Vec; alloc: Vec[]; req: Vec[] }
export function detectExamples(): Detect[] {
  const tb = { names: ['P0', 'P1', 'P2', 'P3', 'P4'], res: ['A', 'B', 'C'], inst: [7, 2, 6], alloc: [[0, 1, 0], [2, 0, 0], [3, 0, 3], [2, 1, 1], [0, 0, 2]] };
  return [
    { key: 'textbook', en: 'Textbook: A=7, B=2, C=6 — everyone is waiting, yet nobody is deadlocked', vi: 'Sách: A=7, B=2, C=6 — ai cũng đang chờ, mà không ai bị deadlock', ...tb, req: [[0, 0, 0], [2, 0, 2], [0, 0, 0], [1, 0, 0], [0, 0, 2]] },
    { key: 'p2more', en: '… then P2 asks for one more C', vi: '… rồi P2 xin thêm một C', ...tb, req: [[0, 0, 0], [2, 0, 2], [0, 0, 1], [1, 0, 0], [0, 0, 2]] },
    { key: 'cycle', en: 'A cycle, but no deadlock (2 instances each)', vi: 'Có vòng, nhưng không deadlock (mỗi loại 2 bản)', names: ['P1', 'P2', 'P3', 'P4'], res: ['R1', 'R2'], inst: [2, 2], alloc: [[0, 1], [1, 0], [1, 0], [0, 1]], req: [[1, 0], [0, 0], [0, 1], [0, 0]] },
    { key: 'pool', en: 'Connection pool of 2: each request holds 1 and asks for 1 more', vi: 'Pool 2 kết nối: mỗi request giữ 1 và xin thêm 1', names: ['req1', 'req2'], res: ['conn'], inst: [2], alloc: [[1], [1]], req: [[1], [1]] },
  ];
}
export function availOf(d: Detect): Vec { return d.alloc.reduce((a, x) => sub(a, x), [...d.inst]); }

/** Có vòng trong đồ thị chờ (P → R → P) không? — chỉ là ĐIỀU KIỆN CẦN khi tài nguyên nhiều bản. */
export function hasCycle(d: Detect): boolean {
  const n = d.names.length;
  // Pi chờ Pj nếu Pi xin loại r mà Pj đang giữ r
  const adj = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i !== j && d.req[i].some((x, r) => x > 0 && d.alloc[j][r] > 0)));
  const color = Array(n).fill(0);
  const dfs = (u: number): boolean => { color[u] = 1; for (let v = 0; v < n; v++) if (adj[u][v]) { if (color[v] === 1) return true; if (color[v] === 0 && dfs(v)) return true; } color[u] = 2; return false; };
  for (let i = 0; i < n; i++) if (color[i] === 0 && dfs(i)) return true;
  return false;
}

// ───────── triết gia ăn tối ─────────
export type PMode = 'naive' | 'ordered' | 'waiter' | 'trylock';
export interface Phil { st: 'think' | 'hungry' | 'eat' | 'backoff'; timer: number; held: number[]; meals: number; hungry: number; maxHungry: number; seated: boolean; drops: number }
export interface Dine { n: number; t: number; mode: PMode; ph: Phil[]; forks: number[]; seated: number; deadlock: boolean; ev: string[] }

export function initDine(mode: PMode, together: boolean, R: () => number, n = 5): Dine {
  return {
    n, t: 0, mode, forks: Array(n).fill(-1), seated: 0, deadlock: false, ev: [],
    ph: Array.from({ length: n }, () => ({ st: 'think', timer: together ? 0 : 1 + Math.floor(R() * 6), held: [], meals: 0, hungry: 0, maxHungry: 0, seated: false, drops: 0 })),
  };
}
const leftF = (i: number) => i, rightF = (i: number, n: number) => (i + 1) % n;

export function stepDine(d0: Dine, R: () => number): Dine {
  const d: Dine = { ...d0, t: d0.t + 1, forks: [...d0.forks], ph: d0.ph.map((p) => ({ ...p, held: [...p.held] })), ev: [] };
  if (d.deadlock) return d;
  const order = Array.from({ length: d.n }, (_, i) => i).sort(() => R() - 0.5);
  let progress = false;
  for (const i of order) {
    const p = d.ph[i];
    const L = leftF(i), Rf = rightF(i, d.n);
    const [first, second] = d.mode === 'ordered' ? [Math.min(L, Rf), Math.max(L, Rf)] : [L, Rf];
    if (p.st === 'think') { if (p.timer > 0) p.timer--; else { p.st = 'hungry'; p.hungry = 0; } progress = true; continue; }
    if (p.st === 'backoff') { if (--p.timer <= 0) p.st = 'hungry'; progress = true; continue; }
    if (p.st === 'eat') {
      if (--p.timer <= 0) {
        for (const f of p.held) d.forks[f] = -1;
        p.held = []; p.meals++; p.st = 'think'; p.timer = 1 + Math.floor(R() * 3);
        if (p.seated) { p.seated = false; d.seated--; }
      }
      progress = true; continue;
    }
    // đói
    p.hungry++; p.maxHungry = Math.max(p.maxHungry, p.hungry);
    if (d.mode === 'waiter' && !p.seated) {
      if (d.seated < d.n - 1) { p.seated = true; d.seated++; progress = true; d.ev.push(`P${i}: the waiter lets me sit (${d.seated}/${d.n - 1})`); }
      continue;
    }
    if (!p.held.includes(first)) {
      // nhặt đũa thứ nhất rồi "khựng" một nhịp trước khi với đũa thứ hai (như usleep giữa hai lần lock trong philo.c)
      if (d.forks[first] === -1) { d.forks[first] = i; p.held.push(first); p.timer = 2; progress = true; }
      continue;
    }
    if (p.timer > 0) { p.timer--; progress = true; continue; }
    if (!p.held.includes(second)) {
      if (d.forks[second] === -1) { d.forks[second] = i; p.held.push(second); progress = true; }
      else if (d.mode === 'trylock') {
        d.forks[first] = -1; p.held = []; p.st = 'backoff'; p.timer = 1 + Math.floor(R() * 4); p.drops++; progress = true;
        continue;
      } else continue;
    }
    if (p.held.length === 2) { p.st = 'eat'; p.timer = 2 + Math.floor(R() * 3); p.hungry = 0; progress = true; }
  }
  if (!progress && d.ph.every((p) => p.st === 'hungry')) d.deadlock = true;
  return d;
}

// ───────── đảo ngược ưu tiên (một lõi, SCHED_FIFO) ─────────
export interface PiTask { name: 'L' | 'M' | 'H'; prio: number; arrive: number; plan: Array<{ k: 'lock' } | { k: 'cpu'; ms: number } | { k: 'unlock' }> }
export const PI_TASKS: PiTask[] = [
  { name: 'L', prio: 10, arrive: 0, plan: [{ k: 'lock' }, { k: 'cpu', ms: 50 }, { k: 'unlock' }] },
  { name: 'H', prio: 30, arrive: 10, plan: [{ k: 'lock' }, { k: 'unlock' }] },
  { name: 'M', prio: 20, arrive: 10, plan: [{ k: 'cpu', ms: 500 }] },
];
export interface PiSeg { task: string; from: number; to: number; eff: number }
export interface PiResult { segs: PiSeg[]; hWait: number; hGot: number; events: Array<{ t: number; en: string; vi: string }>; end: number; watchdogAt: number | null }

export function priorityInversion(inherit: boolean, watchdogMs: number | null = null, tasks: PiTask[] = PI_TASKS): PiResult {
  const st = tasks.map((x) => ({ ...x, pc: 0, left: 0, eff: x.prio, blocked: false, done: false }));
  let owner: number | null = null;
  const waiters: number[] = [];
  const segs: PiSeg[] = [], events: PiResult['events'] = [];
  let hReq = -1, hGot = -1, watchdogAt: number | null = null;
  const H = st.findIndex((x) => x.name === 'H');
  for (let t = 0; t < 5000; t++) {
    // các thao tác tức thời (lock/unlock) của tác vụ đang được chọn chạy
    for (let guard = 0; guard < 10; guard++) {
      const ready = st.map((x, i) => i).filter((i) => st[i].arrive <= t && !st[i].done && !st[i].blocked);
      if (!ready.length) break;
      const r = ready.reduce((a, b) => (st[b].eff > st[a].eff ? b : a));
      const T = st[r], op = T.plan[T.pc];
      if (!op) { T.done = true; continue; }
      if (op.k === 'lock') {
        if (r === H && hReq < 0) { hReq = t; events.push({ t, en: 'H wants the bus mutex', vi: 'H muốn khoá bus' }); }
        if (owner === null) { owner = r; T.pc++; if (r === H) { hGot = t; events.push({ t, en: `H got the bus after waiting ${t - hReq} ms`, vi: `H lấy được bus sau ${t - hReq} ms chờ` }); } else events.push({ t, en: `${T.name} locks the bus`, vi: `${T.name} khoá bus` }); continue; }
        T.blocked = true; waiters.push(r);
        if (inherit && st[owner].eff < T.eff) { st[owner].eff = T.eff; events.push({ t, en: `${st[owner].name} inherits priority ${T.eff} from ${T.name}`, vi: `${st[owner].name} được mượn ưu tiên ${T.eff} của ${T.name}` }); }
        else events.push({ t, en: `${T.name} blocks: ${st[owner].name} holds the bus`, vi: `${T.name} bị chặn: ${st[owner].name} đang giữ bus` });
        continue;
      }
      if (op.k === 'unlock') {
        T.pc++; T.eff = T.prio; owner = null;
        events.push({ t, en: `${T.name} unlocks the bus${inherit ? ' (back to its own priority)' : ''}`, vi: `${T.name} mở khoá bus${inherit ? ' (về ưu tiên gốc)' : ''}` });
        const w = waiters.sort((a, b) => st[b].prio - st[a].prio).shift();
        if (w !== undefined) st[w].blocked = false;
        continue;
      }
      break; // cpu: chạy 1 ms bên dưới
    }
    const ready = st.map((x, i) => i).filter((i) => st[i].arrive <= t && !st[i].done && !st[i].blocked);
    if (!ready.length) { if (st.every((x) => x.done)) return { segs, hWait: hGot - hReq, hGot, events, end: t, watchdogAt }; continue; }
    const r = ready.reduce((a, b) => (st[b].eff > st[a].eff ? b : a));
    const T = st[r], op = T.plan[T.pc];
    if (op && op.k === 'cpu') {
      if (T.left === 0) T.left = op.ms;
      T.left--;
      if (T.left === 0) T.pc++;
      const last = segs[segs.length - 1];
      if (last && last.task === T.name && last.to === t && last.eff === T.eff) last.to = t + 1; else segs.push({ task: T.name, from: t, to: t + 1, eff: T.eff });
      if (T.pc >= T.plan.length) { T.done = true; events.push({ t: t + 1, en: `${T.name} done`, vi: `${T.name} xong` }); }
    }
    if (watchdogMs !== null && watchdogAt === null && hReq >= 0 && hGot < 0 && t + 1 - hReq >= watchdogMs) {
      watchdogAt = t + 1;
      events.push({ t: t + 1, en: `WATCHDOG: H has not run for ${watchdogMs} ms → total system reset (what happened on Mars, July 1997)`, vi: `WATCHDOG: H không chạy được ${watchdogMs} ms → khởi động lại toàn hệ thống (chuyện đã xảy ra trên sao Hoả, 7/1997)` });
    }
  }
  return { segs, hWait: hGot - hReq, hGot, events, end: 5000, watchdogAt };
}
