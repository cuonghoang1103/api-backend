/**
 * Hai luồng chạy `counter++` (= load / add / store) xen kẽ từng lệnh máy; sửa bằng mutex hoặc lệnh nguyên tử;
 * chế độ deadlock với hai khoá A, B. Thuần hàm — mỗi bước trả về trạng thái mới.
 */
export type RMode = 'none' | 'mutex' | 'atomic' | 'deadlock' | 'ordered';
export type Op = 'load' | 'add' | 'store' | 'lock' | 'unlock' | 'xadd' | 'work';
export interface Ins { op: Op; arg?: string; txt: string }
export interface Th { pc: number; reg: number; regVer: number; done: boolean; blockedOn: string | null; holds: string[]; inc: number }
export interface RState {
  mode: RMode; prog: Ins[][]; mem: number; ver: number; th: Th[]; locks: Record<string, number | null>;
  lost: number; lastLost: boolean; deadlock: boolean; ranThread: number | null; en: string; vi: string; steps: number;
}

export function program(mode: RMode, t: number, n: number): Ins[] {
  const inc: Ins[] = [
    { op: 'load', txt: 'load  r, [counter]' },
    { op: 'add', txt: 'add   r, r, 1' },
    { op: 'store', txt: 'store [counter], r' },
  ];
  if (mode === 'none') return Array.from({ length: n }, () => inc).flat();
  if (mode === 'atomic') return Array.from({ length: n }, () => ({ op: 'xadd' as Op, txt: 'atomic_fetch_add(&counter, 1)' }));
  if (mode === 'mutex') return Array.from({ length: n }, () => [
    { op: 'lock' as Op, arg: 'm', txt: 'lock(&m)' }, ...inc, { op: 'unlock' as Op, arg: 'm', txt: 'unlock(&m)' },
  ]).flat();
  const [a, b] = mode === 'deadlock' && t === 1 ? ['B', 'A'] : ['A', 'B'];
  return [
    { op: 'lock', arg: a, txt: `lock(&${a})` },
    { op: 'work', txt: `/* use ${a} */` },
    { op: 'lock', arg: b, txt: `lock(&${b})` },
    { op: 'work', txt: t === 0 ? 'transfer(acc1 → acc2)' : 'transfer(acc2 → acc1)' },
    { op: 'unlock', arg: b, txt: `unlock(&${b})` },
    { op: 'unlock', arg: a, txt: `unlock(&${a})` },
  ];
}

export function init(mode: RMode, n: number): RState {
  const prog = [program(mode, 0, n), program(mode, 1, n)];
  const locks: Record<string, number | null> = mode === 'mutex' ? { m: null } : mode === 'deadlock' || mode === 'ordered' ? { A: null, B: null } : {};
  return {
    mode, prog, mem: 0, ver: 0, locks, lost: 0, lastLost: false, deadlock: false, ranThread: null, steps: 0,
    th: [0, 1].map(() => ({ pc: 0, reg: 0, regVer: 0, done: false, blockedOn: null, holds: [], inc: 0 })),
    en: 'Both threads are about to start. counter = 0.', vi: 'Hai luồng sắp bắt đầu. counter = 0.',
  };
}

export const runnable = (s: RState, t: number) => !s.th[t].done && !(s.th[t].blockedOn && s.locks[s.th[t].blockedOn] !== null);
export const finished = (s: RState) => s.th.every((x) => x.done) || s.deadlock;

export function step(s0: RState, t: number): RState {
  const s: RState = { ...s0, th: s0.th.map((x) => ({ ...x, holds: [...x.holds] })), locks: { ...s0.locks }, lastLost: false, ranThread: t, steps: s0.steps + 1 };
  const T = s.th[t], name = `T${t + 1}`;
  if (T.done) { s.en = `${name} has already finished.`; s.vi = `${name} đã xong.`; return s; }
  const ins = s.prog[t][T.pc];
  switch (ins.op) {
    case 'load': T.reg = s.mem; T.regVer = s.ver; s.en = `${name} loads counter (${s.mem}) into its register.`; s.vi = `${name} nạp counter (${s.mem}) vào thanh ghi của nó.`; T.pc++; break;
    case 'add': T.reg += 1; s.en = `${name} adds 1 inside its own register: r = ${T.reg}. Memory still says ${s.mem}.`; s.vi = `${name} cộng 1 trong thanh ghi riêng: r = ${T.reg}. Bộ nhớ vẫn là ${s.mem}.`; T.pc++; break;
    case 'store': {
      const lost = s.ver !== T.regVer;
      if (lost) { s.lost += s.ver - T.regVer; s.lastLost = true; }
      s.mem = T.reg; s.ver++; T.inc++; T.pc++;
      s.en = lost ? `${name} stores ${T.reg} — but the other thread wrote counter after ${name} read it. That increment is LOST.` : `${name} stores ${T.reg} into counter.`;
      s.vi = lost ? `${name} ghi ${T.reg} — nhưng luồng kia đã ghi counter SAU khi ${name} đọc. Lần tăng đó MẤT.` : `${name} ghi ${T.reg} vào counter.`;
      break;
    }
    case 'xadd': s.mem++; s.ver++; T.inc++; T.pc++; s.en = `${name}: one indivisible instruction reads, adds and writes. Nobody can slip in between. counter = ${s.mem}.`; s.vi = `${name}: một lệnh không chia cắt được vừa đọc, cộng, ghi. Không ai chen vào giữa được. counter = ${s.mem}.`; break;
    case 'work': T.pc++; s.en = `${name} works inside the critical section.`; s.vi = `${name} làm việc trong vùng găng.`; break;
    case 'lock': {
      const L = ins.arg!;
      if (s.locks[L] === null) {
        s.locks[L] = t; T.holds.push(L); T.blockedOn = null; T.pc++;
        s.en = `${name} acquires lock ${L}.`; s.vi = `${name} lấy được khoá ${L}.`;
      } else {
        T.blockedOn = L;
        s.en = `${name} wants lock ${L}, but T${(s.locks[L] ?? 0) + 1} holds it → ${name} sleeps (blocked).`;
        s.vi = `${name} muốn khoá ${L} nhưng T${(s.locks[L] ?? 0) + 1} đang giữ → ${name} ngủ (bị chặn).`;
      }
      break;
    }
    case 'unlock': {
      const L = ins.arg!; s.locks[L] = null; T.holds = T.holds.filter((x) => x !== L); T.pc++;
      s.en = `${name} releases lock ${L}.`; s.vi = `${name} nhả khoá ${L}.`; break;
    }
  }
  if (T.pc >= s.prog[t].length) { T.done = true; s.en += ` ${name} is done.`; s.vi += ` ${name} xong.`; }
  // deadlock: mọi luồng chưa xong đều đang chờ một khoá đang bị giữ
  const alive = s.th.filter((x) => !x.done);
  if (alive.length && alive.every((x) => x.blockedOn && s.locks[x.blockedOn] !== null && s.locks[x.blockedOn] !== s.th.indexOf(x))) {
    s.deadlock = true;
    s.en += ' DEADLOCK: each thread holds one lock and waits forever for the other.';
    s.vi += ' DEADLOCK: mỗi luồng giữ một khoá và chờ mãi khoá kia.';
  }
  return s;
}

/** Bộ lập lịch tự động: 'alt' = luân phiên mỗi lệnh (trường hợp xấu nhất), 'rand' = ngẫu nhiên có hạt giống. */
export function autoRun(mode: RMode, n: number, sched: 'alt' | 'rand' | 'seq', rnd: () => number): RState[] {
  let s = init(mode, n);
  const out = [s];
  let cur = 0;
  for (let k = 0; k < 400 && !finished(s); k++) {
    let t: number;
    if (sched === 'seq') t = runnable(s, 0) ? 0 : 1;
    else if (sched === 'alt') t = k % 2;
    else t = rnd() < 0.5 ? 0 : 1;
    if (!runnable(s, t)) t = 1 - t;
    if (!runnable(s, t)) { // cả hai không chạy được nhưng chưa phát hiện deadlock (chờ khoá của chính mình?) — dừng an toàn
      break;
    }
    cur = t;
    s = step(s, cur);
    out.push(s);
  }
  return out;
}

/** Chạy `runs` lần với xen kẽ ngẫu nhiên, trả về tần suất giá trị cuối của counter. */
export function histogram(mode: RMode, n: number, runs: number, rnd: () => number) {
  const freq = new Map<number, number>();
  for (let r = 0; r < runs; r++) {
    const h = autoRun(mode, n, 'rand', rnd);
    const v = h[h.length - 1].mem;
    freq.set(v, (freq.get(v) ?? 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => a[0] - b[0]);
}
