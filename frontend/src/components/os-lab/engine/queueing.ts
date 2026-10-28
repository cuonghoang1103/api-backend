/**
 * Thread pool + hàng đợi + pool kết nối CSDL, mô phỏng sự kiện rời rạc (discrete-event). Request đến theo Poisson (λ/s),
 * cần một LUỒNG (worker) suốt đời, cần một LÕI trong `cpuMs`, rồi một KẾT NỐI CSDL trong `dbMs`. Hết worker ⇒ xếp hàng;
 * hàng đầy ⇒ 503; client chờ quá `timeoutMs` ⇒ coi như lỗi (máy chủ ngây thơ vẫn làm tiếp việc đó — làm không công).
 * Chế độ virtual thread: worker không giới hạn (luồng ảo rẻ), nhưng LÕI và KẾT NỐI vẫn giới hạn như cũ.
 *
 * Kiểm bằng lý thuyết hàng đợi: định luật Little L = λW (mọi hệ ổn định), M/M/1 W = 1/(μ−λ), M/M/c theo Erlang C.
 */
import { rng } from './rng';

export interface QCfg {
  lambda: number; cpuMs: number; dbMs: number; workers: number; cores: number; dbPool: number;
  queueCap: number; timeoutMs: number; dropExpired: boolean; virtual: boolean; dist: 'exp' | 'const';
  duration: number; seed: number;
}
export const WS = { idle: 0, waitCpu: 1, cpu: 2, waitConn: 3, db: 4 } as const;
export interface QFrame { t: number; queue: number; w: number[]; conns: number; waitConn: number; inSys: number; done: number; ok: number; late: number; rej: number; dropped: number }
export interface QSec { t: number; arr: number; done: number; ok: number; late: number; rej: number; dropped: number; p50: number | null; p99: number | null; queue: number; busy: number }
export interface QResult {
  frames: QFrame[]; secs: QSec[];
  X: number; goodput: number; W: number; Wq: number; L: number; Lq: number; p50: number; p99: number; util: { workers: number; cores: number; db: number };
  arrived: number; completed: number; late: number; rejected: number; dropped: number; wasted: number;
}

interface Req { id: number; arrive: number; start: number; w: number; deadline: number }
type Ev = { t: number; k: 0 | 1 | 2; r: Req; seq: number }; // 0 đến, 1 xong CPU, 2 xong CSDL

class Heap {
  a: Ev[] = [];
  push(e: Ev) { const a = this.a; a.push(e); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (lt(a[p], a[i])) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop(): Ev | undefined {
    const a = this.a; if (!a.length) return undefined;
    const top = a[0], last = a.pop()!;
    if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && lt(a[l], a[m])) m = l; if (r < a.length && lt(a[r], a[m])) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } }
    return top;
  }
}
const lt = (x: Ev, y: Ev) => x.t < y.t || (x.t === y.t && x.seq < y.seq);

function pct(sorted: number[], q: number) { if (!sorted.length) return NaN; return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]; }

export function simulate(c: QCfg, frameMs = 100, maxFrames = 600): QResult {
  const R = rng(c.seed);
  const expo = (mean: number) => (c.dist === 'const' ? mean : -Math.log(1 - R()) * mean);
  const T = c.duration * 1000;
  const W = c.virtual ? Infinity : c.workers;
  const heap = new Heap();
  let seq = 0, id = 0;
  const push = (t: number, k: Ev['k'], r: Req) => heap.push({ t, k, r, seq: ++seq });
  const nextArr = (t: number) => t + expo(1000 / c.lambda) * (c.dist === 'const' ? 1 : 1);
  if (c.lambda > 0) push(-Math.log(1 - R()) * (1000 / c.lambda), 0, { id: ++id, arrive: 0, start: 0, w: -1, deadline: 0 });

  const queue: Req[] = [];
  const cpuQ: Req[] = [], connQ: Req[] = [];
  let busyW = 0, busyCores = 0, busyConn = 0;
  const wstate: number[] = Number.isFinite(W) ? Array.from({ length: W }, () => 0) : [];
  const freeW: number[] = Number.isFinite(W) ? Array.from({ length: W }, (_, k) => W - 1 - k) : [];
  let arrived = 0, completed = 0, late = 0, rejected = 0, dropped = 0, wasted = 0, ok = 0;
  const lat: number[] = [], waitQ: number[] = [];
  // tích phân theo thời gian cho L, Lq, mức bận
  let lastT = 0, inSys = 0, areaL = 0, areaQ = 0, areaW = 0, areaC = 0, areaD = 0;
  const frames: QFrame[] = [];
  let nextFrame = 0;
  const secs: QSec[] = [];
  let sec: QSec = { t: 0, arr: 0, done: 0, ok: 0, late: 0, rej: 0, dropped: 0, p50: null, p99: null, queue: 0, busy: 0 };
  let secLat: number[] = [];
  const closeSec = (upto: number) => {
    while ((sec.t + 1) * 1000 <= upto) {
      const sl = [...secLat].sort((a, b) => a - b);
      sec.p50 = sl.length ? pct(sl, 0.5) : null; sec.p99 = sl.length ? pct(sl, 0.99) : null; sec.queue = queue.length; sec.busy = busyW;
      secs.push(sec); secLat = [];
      sec = { t: sec.t + 1, arr: 0, done: 0, ok: 0, late: 0, rej: 0, dropped: 0, p50: null, p99: null, queue: 0, busy: 0 };
    }
  };
  const snap = (upto: number) => {
    while (nextFrame <= upto && frames.length < maxFrames && nextFrame <= T) {
      frames.push({ t: nextFrame, queue: queue.length, w: Number.isFinite(W) ? [...wstate] : [busyW, cpuQ.length, busyCores, connQ.length, busyConn], conns: busyConn, waitConn: connQ.length, inSys, done: completed, ok, late, rej: rejected, dropped });
      nextFrame += frameMs;
    }
  };
  const advance = (t: number) => {
    const dt = t - lastT;
    areaL += inSys * dt; areaQ += queue.length * dt; areaW += busyW * dt; areaC += busyCores * dt; areaD += busyConn * dt;
    lastT = t;
  };
  const setW = (r: Req, st: number) => { if (r.w >= 0) wstate[r.w] = st; };
  const startCpu = (r: Req, t: number) => {
    if (busyCores < c.cores) { busyCores++; setW(r, WS.cpu); push(t + expo(c.cpuMs), 1, r); }
    else { cpuQ.push(r); setW(r, WS.waitCpu); }
  };
  const startDb = (r: Req, t: number) => {
    if (c.dbMs <= 0) { finish(r, t); return; }
    if (busyConn < c.dbPool) { busyConn++; setW(r, WS.db); push(t + expo(c.dbMs), 2, r); }
    else { connQ.push(r); setW(r, WS.waitConn); }
  };
  const begin = (r: Req, t: number) => {
    busyW++; r.start = t; waitQ.push(t - r.arrive);
    r.w = Number.isFinite(W) ? freeW.pop()! : -1;
    startCpu(r, t);
  };
  const finish = (r: Req, t: number) => {
    const L = t - r.arrive;
    completed++; sec.done++; inSys--;
    if (L > c.timeoutMs) { late++; sec.late++; wasted++; } else { ok++; sec.ok++; }
    if (t > 0) { lat.push(L); secLat.push(L); }
    busyW--; if (r.w >= 0) { wstate[r.w] = WS.idle; freeW.push(r.w); }
    // nhận việc kế trong hàng
    while (queue.length && busyW < W) {
      const nx = queue.shift()!;
      if (c.dropExpired && t - nx.arrive > c.timeoutMs) { dropped++; sec.dropped++; inSys--; continue; }
      begin(nx, t);
    }
  };

  for (;;) {
    const e = heap.pop();
    if (!e || e.t > T) { advance(T); snap(T); closeSec(T); break; }
    advance(e.t); snap(e.t); closeSec(e.t);
    const r = e.r;
    if (e.k === 0) {
      arrived++; sec.arr++; inSys++; r.arrive = e.t; r.deadline = e.t + c.timeoutMs;
      push(nextArr(e.t), 0, { id: ++id, arrive: 0, start: 0, w: -1, deadline: 0 });
      if (busyW < W) begin(r, e.t);
      else if (queue.length < c.queueCap) queue.push(r);
      else { rejected++; sec.rej++; inSys--; }
    } else if (e.k === 1) {
      busyCores--;
      const nx = cpuQ.shift(); if (nx) { busyCores++; setW(nx, WS.cpu); push(e.t + expo(c.cpuMs), 1, nx); }
      startDb(r, e.t);
    } else {
      busyConn--;
      const nx = connQ.shift(); if (nx) { busyConn++; setW(nx, WS.db); push(e.t + expo(c.dbMs), 2, nx); }
      finish(r, e.t);
    }
  }
  const sl = [...lat].sort((a, b) => a - b);
  const dur = T;
  return {
    frames, secs, X: (completed * 1000) / dur, goodput: (ok * 1000) / dur,
    W: lat.reduce((a, b) => a + b, 0) / Math.max(1, lat.length), Wq: waitQ.reduce((a, b) => a + b, 0) / Math.max(1, waitQ.length),
    L: areaL / dur, Lq: areaQ / dur, p50: pct(sl, 0.5), p99: pct(sl, 0.99),
    util: { workers: Number.isFinite(W) ? areaW / dur / W : NaN, cores: areaC / dur / c.cores, db: c.dbMs > 0 ? areaD / dur / c.dbPool : 0 },
    arrived, completed, late, rejected, dropped, wasted,
  };
}

/** Sức chứa lý thuyết (req/s): nút cổ chai nhỏ nhất trong ba thứ — worker, lõi, kết nối. */
export function capacity(c: Pick<QCfg, 'workers' | 'cores' | 'dbPool' | 'cpuMs' | 'dbMs' | 'virtual'>) {
  const byW = c.virtual ? Infinity : (1000 * c.workers) / (c.cpuMs + c.dbMs);
  const byC = (1000 * c.cores) / c.cpuMs;
  const byD = c.dbMs > 0 ? (1000 * c.dbPool) / c.dbMs : Infinity;
  const m = Math.min(byW, byC, byD);
  return { rps: m, by: m === byW ? 'workers' : m === byC ? 'cores' : 'db' as 'workers' | 'cores' | 'db', byW, byC, byD };
}

/** Erlang C: xác suất phải chờ trong M/M/c, và thời gian chờ trung bình Wq (cùng đơn vị với 1/μ). */
export function erlangC(c: number, lambda: number, mu: number) {
  const a = lambda / mu, rho = a / c;
  if (rho >= 1) return { pWait: 1, Wq: Infinity, W: Infinity, rho };
  let sum = 0, term = 1;
  for (let k = 0; k < c; k++) { if (k > 0) term *= a / k; sum += term; }
  const last = (term * a) / c; // a^c / c!
  const top = last * (c / (c - a));
  const p = top / (sum + top);
  const Wq = p / (c * mu - lambda);
  return { pWait: p, Wq, W: Wq + 1 / mu, rho };
}

/** Quét λ để vẽ đường cong thông lượng / độ trễ. */
export function sweep(c: QCfg, points = 14) {
  const cap = capacity(c).rps;
  const top = Number.isFinite(cap) ? cap * 1.5 : c.lambda * 2;
  const out: Array<{ lambda: number; X: number; goodput: number; p99: number; W: number }> = [];
  for (let k = 1; k <= points; k++) {
    const lambda = (top * k) / points;
    const r = simulate({ ...c, lambda, duration: Math.min(c.duration, 20), seed: c.seed + k }, 1000, 0);
    out.push({ lambda, X: r.X, goodput: r.goodput, p99: r.p99, W: r.W });
  }
  return out;
}
