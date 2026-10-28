/**
 * Các nguyên thuỷ đồng bộ, từng lệnh: semaphore (pool N chỗ), mutex + biến điều kiện (bộ đệm giới hạn producer–consumer,
 * `if` vs `while`), khoá đọc–ghi (ưu tiên người đọc ⇒ người ghi bị đói; ưu tiên người ghi). Ngữ nghĩa Mesa như pthread /
 * Java: signal() chỉ ĐÁNH THỨC, luồng được đánh thức phải giành lại mutex — kẻ khác có thể chen vào trước ("cướp" mất
 * điều kiện), và còn có đánh thức giả (spurious wakeup). Vì thế luôn `while`, không bao giờ `if`.
 * Thuần hàm: stepThread(s, t) → trạng thái mới.
 */
export type Op =
  | { k: 'P'; sem: string } | { k: 'V'; sem: string }
  | { k: 'lock'; m: string } | { k: 'unlock'; m: string }
  | { k: 'wait'; cond: 'empty' | 'full'; cv: string; m: string; loop: boolean }
  | { k: 'signal'; cv: string } | { k: 'broadcast'; cv: string }
  | { k: 'put' } | { k: 'take' }
  | { k: 'work'; label: string; n?: number }
  | { k: 'rlock' } | { k: 'runlock' } | { k: 'wlock' } | { k: 'wunlock' }
  | { k: 'jump'; to: number; times?: number }
  | { k: 'end' };
export interface Ins { op: Op; txt: string }
export type TStatus = 'ready' | 'blocked' | 'done' | 'crashed';
export interface Th {
  name: string; role: string; prog: Ins[]; pc: number; status: TStatus; on: string | null;
  phase: 'cv' | 'relock' | 'recheck' | null; holds: string[]; workLeft: number; loops: number; waited: number; maxWait: number; wantW: boolean; leak?: boolean;
}
export interface SState {
  th: Th[]; sems: Record<string, { v: number; max: number; q: number[] }>; mx: Record<string, { owner: number | null; q: number[] }>;
  cv: Record<string, number[]>; buf: number[]; cap: number; nextItem: number; produced: number; consumed: number;
  rw: { readers: number; writer: number | null; pref: 'reader' | 'writer'; reads: number; writes: number };
  inside: number; maxInside: number; errors: string[]; steps: number; ran: number | null; en: string; vi: string; spurious: number;
}
export type Scn = 'semaphore' | 'pc' | 'rw';

const I = (op: Op, txt: string): Ins => ({ op, txt });

export function programs(scn: Scn, o: { loop?: boolean; leak?: boolean; pref?: 'reader' | 'writer'; slots?: number; items?: number } = {}): Array<{ name: string; role: string; prog: Ins[]; leak?: boolean }> {
  if (scn === 'semaphore') {
    const mk = (k: number, leak: boolean) => ({
      name: `T${k + 1}`, role: 'worker', leak,
      prog: [
        I({ k: 'P', sem: 'pool' }, 'conn = pool.acquire();        // P(pool)'),
        I({ k: 'work', label: 'query', n: 2 + (k % 2) }, 'conn.query(sql);'),
        ...(leak ? [I({ k: 'work', label: 'error!', n: 1 }, 'if (err) return;   // ⚠ forgot release!')] : []),
        I({ k: 'V', sem: 'pool' }, 'pool.release(conn);           // V(pool)'),
        I({ k: 'work', label: 'think', n: 1 + (k % 3) }, 'handleNextRequest();'),
        I({ k: 'jump', to: 0 }, 'loop'),
      ],
    });
    return Array.from({ length: 6 }, (_, k) => mk(k, !!o.leak && k === 2));
  }
  if (scn === 'pc') {
    const w = o.loop ? 'while' : 'if   ';
    const n = o.items ?? 6;
    const prod = {
      name: 'P', role: 'producer', prog: [
        I({ k: 'lock', m: 'm' }, 'lock(&m);'),
        I({ k: 'wait', cond: 'full', cv: 'notFull', m: 'm', loop: !!o.loop }, `${w} (count == N) wait(&notFull, &m);`),
        I({ k: 'put' }, 'buf[in] = item; count++;'),
        I({ k: 'signal', cv: 'notEmpty' }, 'signal(&notEmpty);'),
        I({ k: 'unlock', m: 'm' }, 'unlock(&m);'),
        I({ k: 'jump', to: 0, times: n }, `repeat ${n}×`),
        I({ k: 'end' }, 'return;'),
      ],
    };
    const cons = (nm: string) => ({
      name: nm, role: 'consumer', prog: [
        I({ k: 'lock', m: 'm' }, 'lock(&m);'),
        I({ k: 'wait', cond: 'empty', cv: 'notEmpty', m: 'm', loop: !!o.loop }, `${w} (count == 0) wait(&notEmpty, &m);`),
        I({ k: 'take' }, 'item = buf[out]; count--;'),
        I({ k: 'signal', cv: 'notFull' }, 'signal(&notFull);'),
        I({ k: 'unlock', m: 'm' }, 'unlock(&m);'),
        I({ k: 'work', label: 'consume', n: 1 }, 'use(item);'),
        I({ k: 'jump', to: 0 }, 'loop'),
      ],
    });
    return [cons('C1'), prod, cons('C2')];
  }
  const reader = (k: number) => ({
    name: `R${k + 1}`, role: 'reader', prog: [
      I({ k: 'work', label: 'arrive', n: 1 + 2 * k }, `sleep(${1 + 2 * k});   // requests arrive staggered`),
      I({ k: 'rlock' }, 'rw.readLock();'),
      I({ k: 'work', label: 'read', n: 3 }, 'v = cache.get(key);   // 3 steps'),
      I({ k: 'runlock' }, 'rw.readUnlock();'),
      I({ k: 'work', label: 'think', n: 1 }, 'prepare();'),
      I({ k: 'jump', to: 1 }, 'loop'),
    ],
  });
  return [reader(0), reader(1), reader(2), reader(3), {
    name: 'W', role: 'writer', prog: [
      I({ k: 'work', label: 'prepare', n: 1 }, 'v = compute();'),
      I({ k: 'wlock' }, 'rw.writeLock();'),
      I({ k: 'work', label: 'write', n: 2 }, 'cache.put(key, v);'),
      I({ k: 'wunlock' }, 'rw.writeUnlock();'),
      I({ k: 'jump', to: 0 }, 'loop'),
    ],
  }];
}

export function init(scn: Scn, o: Parameters<typeof programs>[1] = {}): SState {
  const ps = programs(scn, o);
  const slots = o.slots ?? 3;
  return {
    th: ps.map((p) => ({ ...p, pc: 0, status: 'ready', on: null, phase: null, holds: [], workLeft: 0, loops: 0, waited: 0, maxWait: 0, wantW: false })),
    sems: scn === 'semaphore' ? { pool: { v: slots, max: slots, q: [] } } : {},
    mx: scn === 'pc' ? { m: { owner: null, q: [] } } : {},
    cv: scn === 'pc' ? { notEmpty: [], notFull: [] } : {},
    buf: [], cap: 2, nextItem: 1, produced: 0, consumed: 0,
    rw: { readers: 0, writer: null, pref: o.pref ?? 'reader', reads: 0, writes: 0 },
    inside: 0, maxInside: 0, errors: [], steps: 0, ran: null, spurious: 0,
    en: 'All threads are ready.', vi: 'Mọi luồng đã sẵn sàng.',
  };
}

const clone = (s: SState): SState => ({
  ...s, th: s.th.map((t) => ({ ...t, holds: [...t.holds] })),
  sems: Object.fromEntries(Object.entries(s.sems).map(([k, v]) => [k, { ...v, q: [...v.q] }])),
  mx: Object.fromEntries(Object.entries(s.mx).map(([k, v]) => [k, { ...v, q: [...v.q] }])),
  cv: Object.fromEntries(Object.entries(s.cv).map(([k, v]) => [k, [...v]])), buf: [...s.buf], rw: { ...s.rw }, errors: [...s.errors],
});

export const runnable = (s: SState, t: number) => s.th[t].status === 'ready';
export const allStuck = (s: SState) => s.th.every((t) => t.status !== 'ready') && s.th.some((t) => t.status === 'blocked');

/** Một lệnh của luồng t. */
export function stepThread(s0: SState, t: number): SState {
  const s = clone(s0);
  s.steps++; s.ran = t;
  for (const [k, x] of s.th.entries()) if (k !== t && (x.status === 'blocked' || x.wantW)) { x.waited++; x.maxWait = Math.max(x.maxWait, x.waited); }
  const T = s.th[t], N = T.name;
  const say = (en: string, vi: string) => { s.en = `${N}: ${en}`; s.vi = `${N}: ${vi}`; };
  if (T.status !== 'ready') { say('cannot run (blocked or finished).', 'không chạy được (đang chờ hoặc đã xong).'); return s; }
  const out = stepInner(s, t);
  const U = out.th[t], B = s0.th[t];
  if (U.pc !== B.pc || U.workLeft !== B.workLeft || U.status === 'done') U.waited = 0;
  else { U.waited++; U.maxWait = Math.max(U.maxWait, U.waited); }
  return out;
}

function stepInner(s: SState, t: number): SState {
  const T = s.th[t], N = T.name;
  const say = (en: string, vi: string) => { s.en = `${N}: ${en}`; s.vi = `${N}: ${vi}`; };
  const block = (on: string) => { T.status = 'blocked'; T.on = on; };
  const wakeMutexWaiters = (m: string) => { for (const k of s.mx[m].q) { s.th[k].status = 'ready'; s.th[k].on = null; } s.mx[m].q = []; };
  const op = T.prog[T.pc].op;

  // giai đoạn của wait(): giành lại mutex sau khi được đánh thức
  if (op.k === 'wait' && (T.phase === 'relock' || T.phase === 'recheck')) {
    const M = s.mx[op.m];
    if (T.phase === 'relock') {
      if (M.owner !== null && M.owner !== t) { block(op.m); M.q.push(t); say(`woke up, but ${s.th[M.owner].name} holds the mutex — waits for it again.`, `đã thức, nhưng ${s.th[M.owner].name} đang giữ mutex — lại phải chờ.`); return s; }
      M.owner = t; T.holds.push(op.m);
      if (op.loop) { T.phase = 'recheck'; say('re-acquired the mutex inside wait(). Because of `while`, it will check the condition AGAIN.', 'đã giành lại mutex trong wait(). Vì là `while` nên nó sẽ kiểm điều kiện LẦN NỮA.'); return s; }
      T.phase = null; T.pc++;
      say('re-acquired the mutex and — because of `if` — assumes the condition is now true, without checking.', 'đã giành lại mutex và — vì là `if` — mặc định điều kiện giờ đã đúng, không kiểm lại.');
      return s;
    }
    T.phase = null; // recheck: rơi xuống nhánh đánh giá điều kiện bên dưới
  }

  switch (op.k) {
    case 'P': {
      const S = s.sems[op.sem];
      if (S.v > 0) { S.v--; T.holds.push(op.sem); T.pc++; s.inside++; s.maxInside = Math.max(s.maxInside, s.inside); say(`P(${op.sem}): ${S.v + 1} → ${S.v} free slots. Got one.`, `P(${op.sem}): ${S.v + 1} → ${S.v} chỗ trống. Lấy được một chỗ.`); }
      else { block(op.sem); S.q.push(t); say(`P(${op.sem}): 0 free slots → sleeps in the semaphore queue.`, `P(${op.sem}): 0 chỗ trống → ngủ trong hàng của semaphore.`); }
      break;
    }
    case 'V': {
      const S = s.sems[op.sem];
      T.holds = T.holds.filter((h) => h !== op.sem); T.pc++; s.inside--;
      const w = S.q.shift();
      if (w !== undefined) { const W = s.th[w]; W.status = 'ready'; W.on = null; W.holds.push(op.sem); W.pc++; s.inside++; say(`V(${op.sem}): hands its slot straight to ${W.name}, who was waiting.`, `V(${op.sem}): trao thẳng chỗ của mình cho ${W.name} đang chờ.`); }
      else { S.v++; say(`V(${op.sem}): ${S.v - 1} → ${S.v} free slots.`, `V(${op.sem}): ${S.v - 1} → ${S.v} chỗ trống.`); }
      break;
    }
    case 'lock': {
      const M = s.mx[op.m];
      if (M.owner === null) { M.owner = t; T.holds.push(op.m); T.pc++; say(`locks ${op.m}.`, `khoá ${op.m}.`); }
      else { block(op.m); M.q.push(t); say(`${op.m} is held by ${s.th[M.owner].name} → sleeps.`, `${op.m} đang do ${s.th[M.owner].name} giữ → ngủ.`); }
      break;
    }
    case 'unlock': {
      s.mx[op.m].owner = null; T.holds = T.holds.filter((h) => h !== op.m); T.pc++;
      const n = s.mx[op.m].q.length; wakeMutexWaiters(op.m);
      say(`unlocks ${op.m}${n ? ` (${n} waiter(s) wake up and race for it)` : ''}.`, `mở khoá ${op.m}${n ? ` (${n} luồng chờ thức dậy và tranh nhau)` : ''}.`);
      break;
    }
    case 'wait': {
      const c = op.cond === 'empty' ? s.buf.length === 0 : s.buf.length >= s.cap;
      const what = op.cond === 'empty' ? 'count == 0' : 'count == N';
      if (!c) { T.pc++; say(`checks ${what}: false (count = ${s.buf.length}) → goes on.`, `kiểm ${what}: sai (count = ${s.buf.length}) → đi tiếp.`); break; }
      s.mx[op.m].owner = null; T.holds = T.holds.filter((h) => h !== op.m); wakeMutexWaiters(op.m);
      block(op.cv); T.phase = 'cv'; s.cv[op.cv].push(t);
      say(`checks ${what}: TRUE → wait(&${op.cv}, &m): releases m and sleeps on ${op.cv} — atomically.`, `kiểm ${what}: ĐÚNG → wait(&${op.cv}, &m): nhả m và ngủ trên ${op.cv} — trong một bước nguyên tử.`);
      break;
    }
    case 'signal': case 'broadcast': {
      const q = s.cv[op.cv];
      const woke = op.k === 'signal' ? q.splice(0, 1) : q.splice(0);
      for (const w of woke) { const W = s.th[w]; W.status = 'ready'; W.on = null; W.phase = 'relock'; }
      T.pc++;
      say(woke.length ? `${op.k}(&${op.cv}) wakes ${woke.map((w) => s.th[w].name).join(', ')} — who still has to re-acquire m (Mesa semantics).` : `${op.k}(&${op.cv}): nobody is waiting — the signal is simply lost.`,
        woke.length ? `${op.k}(&${op.cv}) đánh thức ${woke.map((w) => s.th[w].name).join(', ')} — nó vẫn phải giành lại m (ngữ nghĩa Mesa).` : `${op.k}(&${op.cv}): không ai chờ — tín hiệu mất luôn.`);
      break;
    }
    case 'put': {
      if (s.buf.length >= s.cap) { s.errors.push(`${N}: buffer overflow`); T.status = 'crashed'; say('writes into a FULL buffer — overwrites an item! 💥', 'ghi vào bộ đệm ĐÃ ĐẦY — đè mất một món! 💥'); break; }
      s.buf.push(s.nextItem++); s.produced++; T.pc++; say(`puts item #${s.nextItem - 1} (count = ${s.buf.length}).`, `đặt món #${s.nextItem - 1} (count = ${s.buf.length}).`);
      break;
    }
    case 'take': {
      if (!s.buf.length) { s.errors.push(`${N}: take from an EMPTY buffer`); T.status = 'crashed'; say('takes from an EMPTY buffer: count becomes −1, reads garbage 💥. Somebody else consumed the item between the signal and this thread getting the mutex back.', 'lấy từ bộ đệm RỖNG: count thành −1, đọc rác 💥. Có kẻ đã lấy mất món hàng giữa lúc signal và lúc luồng này giành lại mutex.'); break; }
      const it = s.buf.shift()!; s.consumed++; T.pc++; say(`takes item #${it} (count = ${s.buf.length}).`, `lấy món #${it} (count = ${s.buf.length}).`);
      break;
    }
    case 'work': {
      if (T.workLeft === 0) T.workLeft = op.n ?? 1;
      T.workLeft--;
      if (op.label === 'read') { if (T.workLeft === 0) s.rw.reads++; }
      if (op.label === 'write') { if (T.workLeft === 0) s.rw.writes++; }
      if (T.workLeft === 0) T.pc++;
      say(`${op.label}${(op.n ?? 1) > 1 ? ` (${(op.n ?? 1) - T.workLeft}/${op.n})` : ''}.`, `${op.label}${(op.n ?? 1) > 1 ? ` (${(op.n ?? 1) - T.workLeft}/${op.n})` : ''}.`);
      if (op.label === 'error!' && T.workLeft === 0) {
        // nhánh lỗi: quay lại đầu vòng mà không trả kết nối
        T.pc = 0; T.loops++; s.inside--;
        say('hits an error and returns early — the connection is never released. The pool just shrank by one, forever.', 'gặp lỗi và return sớm — kết nối không bao giờ được trả. Pool vừa hụt một chỗ, vĩnh viễn.');
      }
      break;
    }
    case 'rlock': {
      const R = s.rw, waitingW = s.th.some((x) => x.wantW);
      if (R.writer === null && (R.pref === 'reader' || !waitingW)) { R.readers++; T.pc++; T.holds.push('R'); say(`read-locks (readers = ${R.readers}).`, `khoá đọc (readers = ${R.readers}).`); }
      else { block('rw'); say(R.writer !== null ? 'a writer is inside → waits.' : 'a writer is WAITING and this lock prefers writers → new readers queue behind it.', R.writer !== null ? 'đang có người ghi → chờ.' : 'có người ghi ĐANG CHỜ và khoá này ưu tiên người ghi → người đọc mới phải xếp sau.'); }
      break;
    }
    case 'runlock': {
      s.rw.readers--; T.pc++; T.holds = T.holds.filter((h) => h !== 'R');
      for (const x of s.th) if (x.status === 'blocked' && x.on === 'rw') { x.status = 'ready'; x.on = null; }
      say(`read-unlocks (readers = ${s.rw.readers})${s.rw.readers === 0 ? ' — the lock is free for a writer at last' : ''}.`, `nhả khoá đọc (readers = ${s.rw.readers})${s.rw.readers === 0 ? ' — cuối cùng khoá cũng rảnh cho người ghi' : ''}.`);
      break;
    }
    case 'wlock': {
      const R = s.rw;
      if (R.writer === null && R.readers === 0) { R.writer = t; T.wantW = false; T.pc++; T.holds.push('W'); say('write-locks: exclusive.', 'khoá ghi: độc quyền.'); }
      else { T.wantW = true; block('rw'); say(`wants to write but ${R.readers} reader(s) are inside → waits (waiting ${T.maxWait} steps so far).`, `muốn ghi nhưng còn ${R.readers} người đọc bên trong → chờ (đã chờ ${T.maxWait} bước).`); }
      break;
    }
    case 'wunlock': {
      s.rw.writer = null; T.pc++; T.holds = T.holds.filter((h) => h !== 'W');
      for (const x of s.th) if (x.status === 'blocked' && x.on === 'rw') { x.status = 'ready'; x.on = null; }
      say('write-unlocks.', 'nhả khoá ghi.');
      break;
    }
    case 'jump': {
      T.loops++;
      if (op.times && T.loops >= op.times) { T.pc++; say(`done ${T.loops} rounds.`, `xong ${T.loops} vòng.`); }
      else { T.pc = op.to; say(`round ${T.loops} done, again.`, `xong vòng ${T.loops}, làm tiếp.`); }
      break;
    }
    case 'end': T.status = 'done'; say('finished.', 'kết thúc.'); break;
  }
  return s;
}

/** Đánh thức GIẢ một luồng đang ngủ trên biến điều kiện (POSIX cho phép điều này xảy ra bất cứ lúc nào). */
export function spurious(s0: SState): SState {
  const s = clone(s0);
  for (const [name, q] of Object.entries(s.cv)) {
    const w = q.shift();
    if (w !== undefined) {
      const W = s.th[w]; W.status = 'ready'; W.on = null; W.phase = 'relock'; s.spurious++;
      s.en = `Spurious wakeup: ${W.name} returns from wait(&${name}) although nobody signalled.`; s.vi = `Đánh thức giả: ${W.name} thoát khỏi wait(&${name}) dù không ai signal.`;
      return s;
    }
  }
  s.en = 'Nobody is waiting on a condition variable.'; s.vi = 'Không ai đang chờ trên biến điều kiện.';
  return s;
}

export type Sched = 'rr' | 'rand' | 'steal';
/** Dãy luồng của "kịch bản xấu": C1 chờ, P sản xuất + signal, C2 chen vào lấy mất, rồi C1 mới giành lại mutex. */
export const STEAL = [0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 0, 0];

export function autoRun(s0: SState, sched: Sched, n: number, R: () => number): SState[] {
  const out = [s0];
  let last = -1, k = 0;
  for (let step = 0; step < n; step++) {
    const s = out[out.length - 1];
    const ready = s.th.map((_, i) => i).filter((i) => runnable(s, i));
    if (!ready.length || s.errors.length) break;
    let t: number;
    if (sched === 'steal' && k < STEAL.length && runnable(s, STEAL[k])) t = STEAL[k++];
    else if (sched === 'rand') t = ready[Math.floor(R() * ready.length)];
    else { t = ready.find((i) => i > last) ?? ready[0]; }
    last = t;
    out.push(stepThread(s, t));
  }
  return out;
}
