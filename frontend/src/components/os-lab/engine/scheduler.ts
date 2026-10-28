/**
 * Bộ mô phỏng lập lịch CPU theo nhịp (tick) rời rạc — thuần hàm, không phụ thuộc React (kiểm bằng
 * `npx tsx src/components/os-lab/engine/scheduler.check.ts`).
 *
 * Quy ước (giống giáo trình OS/đề thi FPT):
 *  - thời gian là số nguyên; một tick = một đơn vị CPU;
 *  - tiến trình đến lúc `arrival` được xếp hàng TRƯỚC khi lập lịch tick đó; tiến trình bị cắt (hết quantum) xếp SAU
 *    tiến trình vừa đến cùng tick (thứ tự kinh điển của round robin);
 *  - ưu tiên: số NHỎ = ưu tiên CAO (như nice của Linux);
 *  - CFS rút gọn: vruntime tăng 1024/weight mỗi tick, weight = 1024 / 1.25^nice (nice lấy từ cột ưu tiên, kẹp −20..19),
 *    tiến trình mới vào nhận vruntime = min vruntime đang có; "quantum" đóng vai sched_min_granularity;
 *  - MLFQ: 3 hàng, quantum q, 2q, rồi FCFS; dùng hết quantum ⇒ xuống một hàng; nhường CPU vì I/O ⇒ giữ hàng;
 *    không có "boost" định kỳ (nên thấy được đói — starvation — khi có nhiều việc ngắn).
 */
export type Policy = 'fcfs' | 'sjf' | 'srtf' | 'rr' | 'prio' | 'prio-p' | 'mlfq' | 'cfs';
export interface SProc { id: string; arrival: number; burst: number; prio: number; io?: { every: number; dur: number } | null }
export interface SOpts { policy: Policy; cores: number; quantum: number; cs: number }
export type PState = 'na' | 'ready' | 'run' | 'cs' | 'blocked' | 'done';
export interface CoreCell { pid: string | null; kind: 'run' | 'cs' | 'idle' }
export interface SEvent { pid: string; en: string; vi: string; kind: 'arrive' | 'start' | 'preempt' | 'block' | 'wake' | 'done' | 'demote' }
export interface Tick {
  t: number;
  cores: CoreCell[];
  ready: string[];
  blocked: string[];
  state: Record<string, PState>;
  remaining: Record<string, number>;
  level: Record<string, number>;
  vruntime: Record<string, number>;
  events: SEvent[];
}
export interface PStat { finish: number; first: number; turnaround: number; waiting: number; response: number }
export interface SResult { ticks: Tick[]; end: number; stats: Record<string, PStat>; switches: number; busy: number; avg: { turnaround: number; waiting: number; response: number } }

const weight = (nice: number) => 1024 / Math.pow(1.25, Math.max(-20, Math.min(19, nice)));

export function simulate(procs: SProc[], o: SOpts): SResult {
  const P = procs.map((p) => ({ ...p, burst: Math.max(1, Math.round(p.burst)), arrival: Math.max(0, Math.round(p.arrival)) }));
  const st: Record<string, { rem: number; first: number; finish: number; cpuSinceIo: number; blockedUntil: number; level: number; vrt: number; wait: number; arrived: boolean }> = {};
  for (const p of P) st[p.id] = { rem: p.burst, first: -1, finish: -1, cpuSinceIo: 0, blockedUntil: -1, level: 0, vrt: 0, wait: 0, arrived: false };
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  const cores = Array.from({ length: Math.max(1, Math.min(8, o.cores)) }, () => ({ pid: null as string | null, slice: 0, csLeft: 0, last: null as string | null }));
  const ready: string[] = [];
  const blocked = new Set<string>();
  const ticks: Tick[] = [];
  let switches = 0, busy = 0;
  const q = Math.max(1, o.quantum);
  const qOf = (lvl: number) => (lvl === 0 ? q : lvl === 1 ? 2 * q : Infinity);
  const minVrt = () => {
    const vals = [...ready, ...cores.map((c) => c.pid).filter(Boolean) as string[]].map((id) => st[id].vrt);
    return vals.length ? Math.min(...vals) : 0;
  };
  const better = (a: string, b: string): boolean => { // a tốt hơn b để chạy?
    const A = st[a], B = st[b];
    switch (o.policy) {
      case 'sjf': case 'srtf': return A.rem !== B.rem ? A.rem < B.rem : byId[a].arrival < byId[b].arrival;
      case 'prio': case 'prio-p': return byId[a].prio !== byId[b].prio ? byId[a].prio < byId[b].prio : byId[a].arrival < byId[b].arrival;
      case 'mlfq': return A.level < B.level;
      case 'cfs': return A.vrt < B.vrt;
      default: return false;
    }
  };
  const pick = (): string | null => {
    if (!ready.length) return null;
    let k = 0;
    if (o.policy === 'mlfq') {
      const lv = Math.min(...ready.map((id) => st[id].level));
      k = ready.findIndex((id) => st[id].level === lv);
    } else if (o.policy !== 'fcfs' && o.policy !== 'rr') {
      for (let j = 1; j < ready.length; j++) if (better(ready[j], ready[k])) k = j;
    }
    return ready.splice(k, 1)[0];
  };
  const done = () => P.every((p) => st[p.id].finish >= 0);

  for (let t = 0; t < 400 && !done(); t++) {
    const events: SEvent[] = [];
    // 1. hết I/O ⇒ quay lại hàng sẵn sàng
    for (const id of [...blocked]) if (st[id].blockedUntil === t) {
      blocked.delete(id); ready.push(id);
      if (o.policy === 'cfs') st[id].vrt = Math.max(st[id].vrt, minVrt() - 2);
      events.push({ pid: id, kind: 'wake', en: `${id} finished its I/O and is ready again`, vi: `${id} xong I/O, quay lại hàng sẵn sàng` });
    }
    // 2. tiến trình mới đến
    for (const p of P) if (p.arrival === t) {
      st[p.id].arrived = true;
      if (o.policy === 'cfs') st[p.id].vrt = minVrt();
      ready.push(p.id);
      events.push({ pid: p.id, kind: 'arrive', en: `${p.id} arrives (burst ${p.burst})`, vi: `${p.id} đến (cần ${p.burst} tick CPU)` });
    }
    // 3. cắt ngang (preempt)
    for (const c of cores) {
      if (!c.pid || c.csLeft > 0) continue;
      const id = c.pid;
      let cut = false, why = '', whyVi = '';
      if (o.policy === 'rr' && c.slice >= q && ready.length) { cut = true; why = `quantum of ${q} used up`; whyVi = `dùng hết quantum ${q}`; }
      if (o.policy === 'mlfq' && c.slice >= qOf(st[id].level)) {
        st[id].level = Math.min(2, st[id].level + 1); c.slice = 0;
        events.push({ pid: id, kind: 'demote', en: `${id} used its whole quantum → demoted to queue ${st[id].level}`, vi: `${id} dùng hết quantum → bị hạ xuống hàng ${st[id].level}` });
        if (ready.some((r) => st[r].level <= st[id].level)) { cut = true; why = 'quantum used up'; whyVi = 'hết quantum'; }
      }
      if (o.policy === 'mlfq' && !cut && ready.some((r) => st[r].level < st[id].level)) { cut = true; why = 'a higher-priority queue has work'; whyVi = 'hàng ưu tiên cao hơn có việc'; }
      if (o.policy === 'cfs' && c.slice >= q && ready.some((r) => st[r].vrt < st[id].vrt)) { cut = true; why = 'another task has a smaller vruntime'; whyVi = 'tác vụ khác có vruntime nhỏ hơn'; }
      if (cut) {
        ready.push(id); c.last = id; c.pid = null; c.slice = 0;
        events.push({ pid: id, kind: 'preempt', en: `${id} preempted: ${why}`, vi: `${id} bị cắt ngang: ${whyVi}` });
      }
    }
    if (o.policy === 'srtf' || o.policy === 'prio-p') {
      // so tiến trình tốt nhất đang chờ với tiến trình tệ nhất đang chạy, lặp tới khi không còn đổi được
      for (let guard = 0; guard < cores.length; guard++) {
        const freeCore = cores.find((c) => !c.pid);
        if (freeCore || !ready.length) break;
        let worst = -1;
        cores.forEach((c, k) => { if (c.pid && c.csLeft === 0 && (worst < 0 || better(cores[worst].pid!, c.pid))) worst = k; });
        if (worst < 0) break;
        let best = 0;
        for (let j = 1; j < ready.length; j++) if (better(ready[j], ready[best])) best = j;
        const victim = cores[worst].pid!;
        if (!better(ready[best], victim)) break;
        ready.push(victim); cores[worst].last = victim; cores[worst].pid = null; cores[worst].slice = 0;
        events.push({ pid: victim, kind: 'preempt', en: `${victim} preempted by ${ready[best]} (${o.policy === 'srtf' ? 'shorter remaining time' : 'higher priority'})`, vi: `${victim} bị ${ready[best]} giành CPU (${o.policy === 'srtf' ? 'còn ít việc hơn' : 'ưu tiên cao hơn'})` });
      }
    }
    // 4. lấp lõi trống
    for (const c of cores) {
      if (c.pid) continue;
      const id = pick();
      if (!id) continue;
      c.pid = id; c.slice = 0;
      if (c.last !== null && c.last !== id) {
        switches++;
        if (o.cs > 0) c.csLeft = o.cs;
      }
      events.push({ pid: id, kind: 'start', en: `${id} gets core ${cores.indexOf(c)}`, vi: `${id} được lõi ${cores.indexOf(c)}` });
    }
    // 5. chụp trạng thái tick t
    const state: Record<string, PState> = {};
    for (const p of P) {
      const S = st[p.id];
      state[p.id] = S.finish >= 0 ? 'done' : !S.arrived ? 'na' : blocked.has(p.id) ? 'blocked' : ready.includes(p.id) ? 'ready' : 'ready';
    }
    const cells: CoreCell[] = cores.map((c) => {
      if (!c.pid) return { pid: null, kind: 'idle' };
      if (c.csLeft > 0) { state[c.pid] = 'cs'; return { pid: c.pid, kind: 'cs' }; }
      state[c.pid] = 'run';
      return { pid: c.pid, kind: 'run' };
    });
    for (const id of ready) st[id].wait++;
    ticks.push({
      t, cores: cells, ready: [...ready], blocked: [...blocked], state,
      remaining: Object.fromEntries(P.map((p) => [p.id, st[p.id].rem])),
      level: Object.fromEntries(P.map((p) => [p.id, st[p.id].level])),
      vruntime: Object.fromEntries(P.map((p) => [p.id, Math.round(st[p.id].vrt * 10) / 10])),
      events,
    });
    // 6. chạy một tick
    for (const c of cores) {
      if (!c.pid) continue;
      if (c.csLeft > 0) { c.csLeft--; continue; }
      const id = c.pid, S = st[id];
      busy++;
      if (S.first < 0) S.first = t;
      S.rem--; c.slice++; S.cpuSinceIo++;
      S.vrt += 1024 / weight(byId[id].prio);
      if (S.rem === 0) {
        S.finish = t + 1; c.last = id; c.pid = null; c.slice = 0;
      } else if (byId[id].io && S.cpuSinceIo >= byId[id].io!.every) {
        S.cpuSinceIo = 0; S.blockedUntil = t + 1 + byId[id].io!.dur; blocked.add(id); c.last = id; c.pid = null; c.slice = 0;
      }
    }
    // sự kiện "xong"/"chặn I/O" hiện ở tick kế tiếp cho khớp với hình
    const nextEv: SEvent[] = [];
    for (const p of P) {
      if (st[p.id].finish === t + 1) nextEv.push({ pid: p.id, kind: 'done', en: `${p.id} finished at t=${t + 1}`, vi: `${p.id} xong lúc t=${t + 1}` });
      if (blocked.has(p.id) && st[p.id].blockedUntil === t + 1 + (byId[p.id].io?.dur ?? 0)) nextEv.push({ pid: p.id, kind: 'block', en: `${p.id} starts I/O for ${byId[p.id].io?.dur} ticks (gives up the CPU)`, vi: `${p.id} chờ I/O ${byId[p.id].io?.dur} tick (nhả CPU)` });
    }
    (ticks[ticks.length - 1] as Tick & { after?: SEvent[] }).after = nextEv;
  }
  const end = ticks.length;
  // tick cuối "đã xong hết" để hình kết thúc trọn vẹn
  ticks.push({
    t: end, cores: cores.map(() => ({ pid: null, kind: 'idle' as const })), ready: [], blocked: [],
    state: Object.fromEntries(P.map((p) => [p.id, 'done' as PState])),
    remaining: Object.fromEntries(P.map((p) => [p.id, 0])), level: Object.fromEntries(P.map((p) => [p.id, st[p.id].level])),
    vruntime: Object.fromEntries(P.map((p) => [p.id, Math.round(st[p.id].vrt * 10) / 10])),
    events: (ticks[end - 1] as Tick & { after?: SEvent[] })?.after ?? [],
  });
  // dời sự kiện "after" sang đầu tick sau
  for (let k = 0; k < end - 1; k++) {
    const a = (ticks[k] as Tick & { after?: SEvent[] }).after;
    if (a?.length) ticks[k + 1].events = [...a, ...ticks[k + 1].events];
  }
  const stats: Record<string, PStat> = {};
  for (const p of P) {
    const S = st[p.id];
    stats[p.id] = { finish: S.finish, first: S.first, turnaround: S.finish - p.arrival, waiting: S.wait, response: S.first - p.arrival };
  }
  const n = P.length || 1;
  const avg = {
    turnaround: P.reduce((a, p) => a + stats[p.id].turnaround, 0) / n,
    waiting: P.reduce((a, p) => a + stats[p.id].waiting, 0) / n,
    response: P.reduce((a, p) => a + stats[p.id].response, 0) / n,
  };
  return { ticks, end, stats, switches, busy, avg };
}

export const PRESETS: Record<string, { en: string; vi: string; procs: SProc[]; opts: Partial<SOpts> }> = {
  textbook: {
    en: 'Textbook: 4 processes', vi: 'Giáo trình: 4 tiến trình',
    procs: [
      { id: 'P1', arrival: 0, burst: 8, prio: 3 }, { id: 'P2', arrival: 1, burst: 4, prio: 1 },
      { id: 'P3', arrival: 2, burst: 9, prio: 4 }, { id: 'P4', arrival: 3, burst: 5, prio: 2 },
    ],
    opts: { policy: 'fcfs', cores: 1, quantum: 4, cs: 0 },
  },
  convoy: {
    en: 'Convoy: one long job in front', vi: 'Đoàn xe: một việc dài đứng đầu',
    procs: [
      { id: 'BUILD', arrival: 0, burst: 14, prio: 5 }, { id: 'curl', arrival: 1, burst: 1, prio: 0 },
      { id: 'ls', arrival: 1, burst: 1, prio: 0 }, { id: 'git', arrival: 2, burst: 2, prio: 0 },
    ],
    opts: { policy: 'fcfs', cores: 1, quantum: 2, cs: 0 },
  },
  rr: {
    en: 'Round robin, quantum 2', vi: 'Round robin, quantum 2',
    procs: [
      { id: 'P1', arrival: 0, burst: 5, prio: 1 }, { id: 'P2', arrival: 1, burst: 3, prio: 1 },
      { id: 'P3', arrival: 2, burst: 1, prio: 1 }, { id: 'P4', arrival: 3, burst: 4, prio: 1 },
    ],
    opts: { policy: 'rr', cores: 1, quantum: 2, cs: 0 },
  },
  interactive: {
    en: 'Interactive + batch (I/O)', vi: 'Tương tác + chạy nền (có I/O)',
    procs: [
      { id: 'editor', arrival: 0, burst: 6, prio: 0, io: { every: 1, dur: 3 } },
      { id: 'video', arrival: 0, burst: 12, prio: 5 },
      { id: 'backup', arrival: 1, burst: 10, prio: 10 },
    ],
    opts: { policy: 'mlfq', cores: 1, quantum: 2, cs: 0 },
  },
  multicore: {
    en: '6 threads on 2 cores', vi: '6 luồng trên 2 lõi',
    procs: [
      { id: 'T1', arrival: 0, burst: 6, prio: 0 }, { id: 'T2', arrival: 0, burst: 4, prio: 0 }, { id: 'T3', arrival: 0, burst: 5, prio: 0 },
      { id: 'T4', arrival: 1, burst: 3, prio: 0 }, { id: 'T5', arrival: 2, burst: 6, prio: 0 }, { id: 'T6', arrival: 2, burst: 2, prio: 0 },
    ],
    opts: { policy: 'rr', cores: 2, quantum: 2, cs: 0 },
  },
  nice: {
    en: 'CFS: nice 0 vs nice 5', vi: 'CFS: nice 0 vs nice 5',
    procs: [
      { id: 'api', arrival: 0, burst: 12, prio: 0 }, { id: 'report', arrival: 0, burst: 12, prio: 5 },
    ],
    opts: { policy: 'cfs', cores: 1, quantum: 1, cs: 0 },
  },
};
