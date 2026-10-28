/**
 * Vòng lặp sự kiện của Node.js, từng bước: call stack, hàng nextTick, hàng microtask (Promise), các pha của libuv
 * (timers → poll → check), thread pool của libuv (fs, crypto, dns.lookup — mặc định 4 luồng) và socket chờ trong kernel
 * (epoll — KHÔNG tốn luồng nào). Đồng hồ ảo tính bằng ms: mã đồng bộ (`busy`) đẩy đồng hồ đi, và trong lúc đó mọi
 * callback đã sẵn sàng đều phải đứng chờ — đó là "chặn event loop".
 *
 * Quy tắc (Node ≥ 11): sau MỖI callback, xả hết nextTick rồi hết microtask; setTimeout(fn, 0) = 1 ms; trong pha timers
 * chạy mọi timer đã tới hạn; pha poll chạy callback I/O đã xong, nếu không còn gì thì ngủ (epoll_wait) tới sự kiện kế;
 * pha check chạy setImmediate. Thuần hàm: run(scenario, opts) → dãy ảnh chụp trạng thái.
 */
export type Phase = 'main' | 'timers' | 'poll' | 'check' | 'done';
type Env = { l: Record<string, number | string>; g: Record<string, number | string | string[]> };
export type Op = { ln: number } & (
  | { k: 'log'; v: string | ((e: Env) => string) }
  | { k: 'timeout'; ms: number; cb: string }
  | { k: 'immediate'; cb: string }
  | { k: 'micro'; cb: string; how?: string }
  | { k: 'call'; cb: string; ctx?: string }
  | { k: 'tick'; cb: string }
  | { k: 'pool'; ms: number; cb: string; label: string }
  | { k: 'net'; ms: number; cb: string; label: string }
  | { k: 'busy'; ms: number; label: string }
  | { k: 'exec'; txt: string; f: (e: Env) => void }
  | { k: 'guard'; test: (e: Env) => boolean; fail: (e: Env) => string }
  | { k: 'acquire'; cont: string }
  | { k: 'release' }
  | { k: 'respond' }
);
export interface Scenario { src: string[]; cbs: Record<string, { name: string; ops: Op[] }>; shared?: Env['g']; arrivals?: Array<{ at: number; cb: string; ctx: string; label: string }> }

export interface Inst { cb: string; ctx: string; label: string; at: number }
export interface Job { id: number; cb: string; ctx: string; label: string; ms: number; start: number; end: number; submitted: number }
export interface Frame { inst: Inst; pc: number; busy?: string }
export interface ELState {
  now: number; phase: Phase; stack: Frame[];
  tickQ: Inst[]; microQ: Inst[]; checkQ: Inst[]; pollQ: Inst[];
  timers: Array<Inst & { due: number; seq: number }>;
  pool: Array<Job | null>; poolWait: Job[]; net: Job[];
  out: Array<{ t: number; v: string }>;
  g: Env['g']; locals: Record<string, Env['l']>;
  lock: { owner: string | null; wait: Inst[] };
  reqs: Record<string, { arrive: number; done: number | null }>;
  line: number | null; seq: number; ev: string; evVi: string; blockedMs: number;
}

const clone = (s: ELState): ELState => ({
  ...s, stack: s.stack.map((f) => ({ ...f })), tickQ: [...s.tickQ], microQ: [...s.microQ], checkQ: [...s.checkQ], pollQ: [...s.pollQ],
  timers: [...s.timers], pool: [...s.pool], poolWait: [...s.poolWait], net: [...s.net], out: [...s.out],
  g: Object.fromEntries(Object.entries(s.g).map(([k, v]) => [k, Array.isArray(v) ? [...v] : v])),
  locals: Object.fromEntries(Object.entries(s.locals).map(([k, v]) => [k, { ...v }])),
  lock: { owner: s.lock.owner, wait: [...s.lock.wait] }, reqs: Object.fromEntries(Object.entries(s.reqs).map(([k, v]) => [k, { ...v }])),
});

export function initEL(sc: Scenario, poolSize = 4): ELState {
  const s: ELState = {
    now: 0, phase: 'main', stack: [{ inst: { cb: 'main', ctx: 'main', label: 'main()', at: 0 }, pc: 0 }],
    tickQ: [], microQ: [], checkQ: [], pollQ: [], timers: [], pool: Array.from({ length: poolSize }, () => null), poolWait: [], net: [],
    out: [], g: { ...(sc.shared ?? {}) }, locals: {}, lock: { owner: null, wait: [] }, reqs: {}, line: null, seq: 0,
    ev: 'Node starts running your file top to bottom inside main().', evVi: 'Node bắt đầu chạy file của bạn từ trên xuống, trong main().', blockedMs: 0,
  };
  for (const a of sc.arrivals ?? []) {
    s.net.push({ id: ++s.seq, cb: a.cb, ctx: a.ctx, label: a.label, ms: a.at, start: 0, end: a.at, submitted: 0 });
    s.reqs[a.ctx] = { arrive: a.at, done: null };
  }
  return s;
}

/** Cho thread pool và kernel chạy tới thời điểm `upto`: việc xong ⇒ callback vào hàng poll; luồng rảnh nhận việc kế. */
function settle(s: ELState, upto: number) {
  for (;;) {
    let best: { kind: 'pool' | 'net'; k: number; t: number } | null = null;
    s.pool.forEach((j, k) => { if (j && j.end <= upto && (!best || j.end < best.t)) best = { kind: 'pool', k, t: j.end }; });
    s.net.forEach((j, k) => { if (j.end <= upto && (!best || j.end < best.t)) best = { kind: 'net', k, t: j.end }; });
    if (!best) return;
    const b = best as { kind: 'pool' | 'net'; k: number; t: number };
    if (b.kind === 'pool') {
      const j = s.pool[b.k]!;
      s.pollQ.push({ cb: j.cb, ctx: j.ctx, label: j.label, at: j.end });
      const nx = s.poolWait.shift();
      s.pool[b.k] = nx ? { ...nx, start: j.end, end: j.end + nx.ms } : null;
    } else {
      const j = s.net[b.k];
      s.net.splice(b.k, 1);
      s.pollQ.push({ cb: j.cb, ctx: j.ctx, label: j.label, at: j.end });
    }
  }
}
function nextEvent(s: ELState): number {
  const ts = [...s.timers.map((t) => t.due), ...s.pool.filter((j): j is Job => !!j).map((j) => j.end), ...s.net.map((j) => j.end)];
  return ts.length ? Math.min(...ts) : Infinity;
}
const env = (s: ELState, ctx: string): Env => { if (!s.locals[ctx]) s.locals[ctx] = {}; return { l: s.locals[ctx], g: s.g }; };

export function step(sc: Scenario, s0: ELState): ELState {
  const s = clone(s0);
  s.blockedMs = 0;
  const say = (en: string, vi: string) => { s.ev = en; s.evVi = vi; };
  const push = (i: Inst, en: string, vi: string) => { s.stack.push({ inst: i, pc: 0 }); s.line = sc.cbs[i.cb].ops[0]?.ln ?? null; say(en, vi); };
  if (s.stack.length) {
    const f = s.stack[s.stack.length - 1];
    const cb = sc.cbs[f.inst.cb];
    if (f.busy) { f.busy = undefined; f.pc++; say('The synchronous work returns.', 'Phần việc đồng bộ trả về.'); return s; }
    if (f.pc >= cb.ops.length) {
      s.stack.pop(); s.line = null;
      say(`${cb.name} returns — the call stack is ${s.stack.length ? 'not ' : ''}empty.`, `${cb.name} trả về — call stack ${s.stack.length ? 'chưa ' : 'đã '}trống.`);
      if (!s.stack.length && f.inst.cb === 'main') { s.phase = 'timers'; say('main() is done. Now the event loop starts: first drain nextTick, then microtasks, then the libuv phases.', 'main() xong. Giờ event loop mới bắt đầu: xả nextTick trước, rồi microtask, rồi tới các pha của libuv.'); }
      return s;
    }
    const op = cb.ops[f.pc];
    s.line = op.ln;
    const e = env(s, f.inst.ctx);
    const C = f.inst.ctx;
    switch (op.k) {
      case 'log': { const v = typeof op.v === 'function' ? op.v(e) : op.v; s.out.push({ t: s.now, v }); say(`console.log prints "${v}".`, `console.log in ra "${v}".`); break; }
      case 'timeout': { const d = Math.max(1, op.ms); s.timers.push({ cb: op.cb, ctx: C, label: `${sc.cbs[op.cb].name} (${op.ms} ms)`, at: s.now, due: s.now + d, seq: ++s.seq }); say(`setTimeout registers a timer due at ${s.now + d} ms${op.ms === 0 ? ' (0 is rounded up to 1 ms)' : ''}. Nothing runs yet.`, `setTimeout đăng ký một hẹn giờ tới hạn lúc ${s.now + d} ms${op.ms === 0 ? ' (0 được làm tròn lên 1 ms)' : ''}. Chưa có gì chạy.`); break; }
      case 'immediate': s.checkQ.push({ cb: op.cb, ctx: C, label: sc.cbs[op.cb].name, at: s.now }); say('setImmediate puts the callback in the check queue: it runs right after the next poll phase.', 'setImmediate đặt callback vào hàng check: chạy ngay sau pha poll kế tiếp.'); break;
      case 'call': {
        f.pc++;
        const i: Inst = { cb: op.cb, ctx: op.ctx ?? C, label: sc.cbs[op.cb].name, at: s.now };
        s.stack.push({ inst: i, pc: 0 });
        say(`${sc.cbs[op.cb].name} is called: a new frame goes on top of the call stack and runs right now, synchronously, until its first await.`, `Gọi ${sc.cbs[op.cb].name}: một khung mới đặt lên đỉnh call stack và chạy ngay, đồng bộ, tới lệnh await đầu tiên.`);
        return s;
      }
      case 'micro': s.microQ.push({ cb: op.cb, ctx: C, label: sc.cbs[op.cb].name, at: s.now }); say(`${op.how ?? 'Promise.then'} queues a microtask. It will run as soon as the stack is empty — before any timer or I/O.`, `${op.how ?? 'Promise.then'} xếp một microtask. Nó chạy ngay khi stack trống — trước mọi timer hay I/O.`); break;
      case 'tick': s.tickQ.push({ cb: op.cb, ctx: C, label: sc.cbs[op.cb].name, at: s.now }); say('process.nextTick queues into the nextTick queue — it even jumps ahead of Promise microtasks.', 'process.nextTick xếp vào hàng nextTick — chen cả trước microtask của Promise.'); break;
      case 'pool': {
        const j: Job = { id: ++s.seq, cb: op.cb, ctx: C, label: op.label, ms: op.ms, start: s.now, end: s.now + op.ms, submitted: s.now };
        const k = s.pool.indexOf(null);
        if (k >= 0) { s.pool[k] = j; say(`${op.label} is handed to libuv thread #${k + 1} (${op.ms} ms of work there). JavaScript continues immediately.`, `${op.label} được giao cho luồng #${k + 1} của libuv (${op.ms} ms việc ở đó). JavaScript đi tiếp ngay.`); }
        else { s.poolWait.push(j); say(`${op.label}: all ${s.pool.length} pool threads are busy, so it WAITS in libuv's queue — even a 1 ms file read.`, `${op.label}: cả ${s.pool.length} luồng của pool đều bận nên nó phải CHỜ trong hàng của libuv — kể cả một lần đọc file 1 ms.`); }
        break;
      }
      case 'net': s.net.push({ id: ++s.seq, cb: op.cb, ctx: C, label: op.label, ms: op.ms, start: s.now, end: s.now + op.ms, submitted: s.now }); say(`${op.label}: the socket is registered with epoll in the kernel. No thread waits for it.`, `${op.label}: socket được đăng ký với epoll trong kernel. Không luồng nào phải ngồi chờ.`); break;
      case 'busy': {
        s.now += op.ms; s.blockedMs = op.ms; f.busy = op.label; settle(s, s.now);
        const ready = s.pollQ.length + s.timers.filter((t) => t.due <= s.now).length;
        say(`${op.label}: ${op.ms} ms of synchronous CPU work. The clock moves to ${s.now} ms and NOTHING else in JavaScript can run meanwhile${ready ? ` — ${ready} callback(s) are ready and waiting` : ''}.`, `${op.label}: ${op.ms} ms việc CPU đồng bộ. Đồng hồ nhảy tới ${s.now} ms và trong lúc đó KHÔNG có gì khác của JavaScript chạy được${ready ? ` — ${ready} callback đã sẵn sàng mà phải chờ` : ''}.`);
        return s;
      }
      case 'exec': op.f(e); say(op.txt, op.txt); break;
      case 'guard': if (!op.test(e)) { const v = op.fail(e); s.out.push({ t: s.now, v }); f.pc = cb.ops.length; say(`The check fails: "${v}".`, `Phép kiểm không qua: "${v}".`); return s; } say('The check passes.', 'Phép kiểm qua.'); break;
      case 'acquire':
        if (s.lock.owner === null) { s.lock.owner = C; s.microQ.push({ cb: op.cont, ctx: C, label: sc.cbs[op.cont].name, at: s.now }); say(`${C} takes the lock (tail.then(fn) → a microtask).`, `${C} lấy được khoá (tail.then(fn) → một microtask).`); }
        else { s.lock.wait.push({ cb: op.cont, ctx: C, label: sc.cbs[op.cont].name, at: s.now }); say(`The lock is held by ${s.lock.owner}: ${C} is chained behind it and waits.`, `Khoá đang do ${s.lock.owner} giữ: ${C} xếp sau và chờ.`); }
        break;
      case 'release': {
        const nx = s.lock.wait.shift();
        s.lock.owner = nx ? nx.ctx : null;
        if (nx) s.microQ.push(nx);
        say(nx ? `Lock released → ${nx.ctx} gets it next.` : 'Lock released.', nx ? `Nhả khoá → ${nx.ctx} được lượt kế.` : 'Nhả khoá.');
        break;
      }
      case 'respond': if (s.reqs[C]) s.reqs[C].done = s.now; s.out.push({ t: s.now, v: `→ ${C} answered after ${s.now - (s.reqs[C]?.arrive ?? 0)} ms` }); say(`The response for ${C} is sent.`, `Trả lời cho ${C} đã gửi.`); break;
    }
    f.pc++;
    return s;
  }
  // call stack trống ⇒ hàng ưu tiên trước, rồi tới các pha của vòng lặp
  if (s.phase === 'done') return s;
  if (s.tickQ.length) { const i = s.tickQ.shift()!; push(i, `Stack empty → the nextTick queue goes first: ${i.label}.`, `Stack trống → hàng nextTick được đi trước: ${i.label}.`); return s; }
  if (s.microQ.length) { const i = s.microQ.shift()!; push(i, `Stack empty → drain the microtask queue: ${i.label}.`, `Stack trống → xả hàng microtask: ${i.label}.`); return s; }
  settle(s, s.now);
  if (s.phase === 'timers' || s.phase === 'main') {
    s.phase = 'timers';
    const due = s.timers.filter((t) => t.due <= s.now).sort((a, b) => a.due - b.due || a.seq - b.seq);
    if (due.length) { const t = due[0]; s.timers = s.timers.filter((x) => x !== t); push(t, `Timers phase: "${t.label}" was due at ${t.due} ms (now ${s.now} ms) → it runs${s.now - t.due > 5 ? `, ${s.now - t.due} ms late` : ''}.`, `Pha timers: "${t.label}" tới hạn lúc ${t.due} ms (giờ là ${s.now} ms) → chạy${s.now - t.due > 5 ? `, trễ ${s.now - t.due} ms` : ''}.`); return s; }
    s.phase = 'poll'; say('Timers phase: nothing due yet → move to the poll phase (I/O callbacks).', 'Pha timers: chưa timer nào tới hạn → sang pha poll (callback I/O).'); return s;
  }
  if (s.phase === 'poll') {
    if (s.pollQ.length) { const i = s.pollQ.shift()!; push(i, `Poll phase: ${i.label} finished at ${i.at} ms → its callback runs${s.now - i.at > 5 ? ` (it waited ${s.now - i.at} ms for the stack)` : ''}.`, `Pha poll: ${i.label} xong lúc ${i.at} ms → callback của nó chạy${s.now - i.at > 5 ? ` (đã phải chờ stack ${s.now - i.at} ms)` : ''}.`); return s; }
    if (s.checkQ.length) { s.phase = 'check'; say('Poll queue empty and setImmediate callbacks are waiting → check phase.', 'Hàng poll trống và có setImmediate đang chờ → sang pha check.'); return s; }
    const nx = nextEvent(s);
    if (nx === Infinity) { s.phase = 'done'; say('Nothing left: no timers, no pending I/O, no sockets → the process exits.', 'Không còn gì: không timer, không I/O dở, không socket → tiến trình thoát.'); return s; }
    const from = s.now;
    s.now = Math.max(s.now, nx); settle(s, s.now);
    say(`Nothing to do: the loop sleeps in epoll_wait for ${s.now - from} ms (0% CPU) until the next event at ${s.now} ms.`, `Không có việc: vòng lặp ngủ trong epoll_wait ${s.now - from} ms (0% CPU) tới sự kiện kế lúc ${s.now} ms.`);
    if (!s.pollQ.length) s.phase = 'check';
    return s;
  }
  // check
  if (s.checkQ.length) { const i = s.checkQ.shift()!; push(i, `Check phase: setImmediate → ${i.label}.`, `Pha check: setImmediate → ${i.label}.`); return s; }
  s.phase = 'timers'; say('Check phase done → next loop iteration starts with timers.', 'Pha check xong → vòng lặp mới bắt đầu từ timers.');
  return s;
}

export function run(sc: Scenario, poolSize = 4, max = 1500): ELState[] {
  const out = [initEL(sc, poolSize)];
  while (out.length < max) {
    const cur = out[out.length - 1];
    if (cur.phase === 'done') break;
    out.push(step(sc, cur));
  }
  return out;
}

// ───────────────────────── kịch bản ─────────────────────────
const L = (ln: number, o: Record<string, unknown>) => ({ ln, ...o }) as Op;

export const ORDER: Scenario = {
  src: [
    "const fs = require('fs');",
    "console.log('1 sync');",
    "setTimeout(() => console.log('5 timeout'), 0);",
    "Promise.resolve().then(() => console.log('4 promise'));",
    "process.nextTick(() => console.log('3 nextTick'));",
    'fs.readFile(__filename, () => {',
    "  console.log('6 readFile');",
    "  setTimeout(() => console.log('8 timeout'), 0);",
    "  setImmediate(() => console.log('7 immediate'));",
    '});',
    "console.log('2 sync');",
    'warmUpCache();            // 5 ms of sync work',
  ],
  cbs: {
    main: { name: 'main()', ops: [L(1, { k: 'log', v: '1 sync' }), L(2, { k: 'timeout', ms: 0, cb: 't5' }), L(3, { k: 'micro', cb: 'p4' }), L(4, { k: 'tick', cb: 'n3' }), L(5, { k: 'pool', ms: 4, cb: 'rf', label: 'fs.readFile' }), L(10, { k: 'log', v: '2 sync' }), L(11, { k: 'busy', ms: 5, label: 'warmUpCache()' })] },
    t5: { name: 'timeout cb', ops: [L(2, { k: 'log', v: '5 timeout' })] },
    p4: { name: 'then cb', ops: [L(3, { k: 'log', v: '4 promise' })] },
    n3: { name: 'nextTick cb', ops: [L(4, { k: 'log', v: '3 nextTick' })] },
    rf: { name: 'readFile cb', ops: [L(6, { k: 'log', v: '6 readFile' }), L(7, { k: 'timeout', ms: 0, cb: 't8' }), L(8, { k: 'immediate', cb: 'i7' })] },
    t8: { name: 'timeout cb', ops: [L(7, { k: 'log', v: '8 timeout' })] },
    i7: { name: 'immediate cb', ops: [L(8, { k: 'log', v: '7 immediate' })] },
  },
};

export function blockScenario(offload: boolean): Scenario {
  return {
    src: [
      "http.createServer((req, res) => {",
      "  if (req.url === '/report') {",
      offload ? "    crypto.pbkdf2(pw, salt, 1e6, 64, 'sha512', () => res.end(report));  // thread pool" : "    const report = buildReportSync();   // 200 ms on the main thread",
      offload ? '    return;' : '    return res.end(report);',
      '  }',
      "  res.end(JSON.stringify(user));       // 2 ms",
      '}).listen(3000);',
    ],
    cbs: {
      main: { name: 'main()', ops: [L(6, { k: 'exec', txt: 'server.listen(3000): the listening socket goes into epoll.', f: () => {} })] },
      fast: { name: 'handler GET /me', ops: [L(5, { k: 'busy', ms: 2, label: 'JSON.stringify(user)' }), L(5, { k: 'respond' })] },
      slow: offload
        ? { name: 'handler GET /report', ops: [L(2, { k: 'pool', ms: 200, cb: 'slowDone', label: 'crypto.pbkdf2 (report)' })] }
        : { name: 'handler GET /report', ops: [L(2, { k: 'busy', ms: 200, label: 'buildReportSync()' }), L(3, { k: 'respond' })] },
      slowDone: { name: 'pbkdf2 cb', ops: [L(2, { k: 'respond' })] },
    },
    arrivals: [
      { at: 0, cb: 'fast', ctx: 'req1 /me', label: 'request 1 GET /me' },
      { at: 5, cb: 'slow', ctx: 'req2 /report', label: 'request 2 GET /report' },
      { at: 10, cb: 'fast', ctx: 'req3 /me', label: 'request 3 GET /me' },
      { at: 15, cb: 'fast', ctx: 'req4 /me', label: 'request 4 GET /me' },
    ],
  };
}

export function poolScenario(): Scenario {
  const ops: Op[] = [];
  for (let i = 1; i <= 8; i++) ops.push(L(1, { k: 'pool', ms: 100, cb: `h${i}`, label: `pbkdf2 #${i}` }));
  ops.push(L(3, { k: 'pool', ms: 1, cb: 'rf', label: 'fs.readFile (1 ms)' }));
  ops.push(L(4, { k: 'net', ms: 30, cb: 'web', label: 'https.get (30 ms)' }));
  const cbs: Scenario['cbs'] = { main: { name: 'main()', ops } };
  for (let i = 1; i <= 8; i++) cbs[`h${i}`] = { name: `pbkdf2 #${i} cb`, ops: [L(2, { k: 'log', v: `#${i} done` })] };
  cbs.rf = { name: 'readFile cb', ops: [L(3, { k: 'log', v: 'readFile done' })] };
  cbs.web = { name: 'https cb', ops: [L(4, { k: 'log', v: 'https.get done' })] };
  return {
    src: [
      '// UV_THREADPOOL_SIZE decides how many run at once (default 4)',
      "for (let i = 1; i <= 8; i++) crypto.pbkdf2('secret', 'salt', 3e5, 64, 'sha512',",
      '  () => console.log(`#${i} done`));      // ~100 ms each, on a pool thread',
      "fs.readFile('config.json', () => console.log('readFile done'));  // also the pool!",
      "https.get('https://api.example.com', () => console.log('https.get done')); // epoll, no thread",
    ],
    cbs,
  };
}

export function raceScenario(lock: boolean): Scenario {
  const book = (u: string): Scenario['cbs'] => ({
    [`${u}0`]: lock ? { name: `withLock(() => book('${u}'))`, ops: [L(9, { k: 'acquire', cont: `${u}1` })] } : { name: `book('${u}')`, ops: [L(4, { k: 'timeout', ms: 20, cb: `${u}q1` })] },
    [`${u}1`]: { name: `book('${u}') [locked]`, ops: [L(4, { k: 'timeout', ms: 20, cb: `${u}q1` })] },
    [`${u}q1`]: { name: 'query: read seatsLeft', ops: [L(4, { k: 'exec', txt: `the "database" reads seatsLeft for ${u}`, f: (e: Env) => { e.l.left = e.g.seatsLeft as number; } }), L(4, { k: 'micro', cb: `${u}2`, how: 'resolve(value) → await resumes' })] },
    [`${u}2`]: { name: `book('${u}') after 1st await`, ops: [
      L(5, { k: 'guard', test: (e: Env) => (e.l.left as number) > 0, fail: () => `${u}: sold out` }),
      L(6, { k: 'timeout', ms: 20, cb: `${u}q2` }),
    ] },
    [`${u}q2`]: { name: 'query: write booking', ops: [L(6, { k: 'exec', txt: `the "database" writes seatsLeft = left - 1 and adds ${u}`, f: (e: Env) => { e.g.seatsLeft = (e.l.left as number) - 1; (e.g.bookings as string[]).push(u); } }), L(6, { k: 'micro', cb: `${u}3`, how: 'resolve() → await resumes' })] },
    [`${u}3`]: { name: `book('${u}') after 2nd await`, ops: [L(7, { k: 'log', v: `${u}: booked ✔` }), ...(lock ? [L(9, { k: 'release' })] : [])] },
  });
  return {
    src: [
      'const db = { seatsLeft: 1, bookings: [] };',
      'const query = (fn) => new Promise((r) => setTimeout(() => r(fn()), 20));',
      'async function book(user) {',
      '  // ⬇ every await gives the event loop to somebody else',
      '  const left = await query(() => db.seatsLeft);              // 1) read',
      "  if (left <= 0) return `${user}: sold out`;",
      '  await query(() => { db.seatsLeft = left - 1; db.bookings.push(user); }); // 2) write',
      '  return `${user}: booked ✔`;',
      '}',
      lock ? "await Promise.all([withLock(() => book('alice')), withLock(() => book('bob'))]); // lock = Promise chain" : "await Promise.all([book('alice'), book('bob')]);",
    ],
    cbs: {
      main: { name: 'main()', ops: [L(9, { k: 'call', cb: 'alice0', ctx: 'alice' }), L(9, { k: 'call', cb: 'bob0', ctx: 'bob' })] },
      ...book('alice'), ...book('bob'),
    },
    shared: { seatsLeft: 1, bookings: [] },
  };
}
