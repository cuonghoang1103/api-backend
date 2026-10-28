/**
 * "Phòng máy" kiểu top/htop: một máy Linux ảo 4 lõi / 7,75 GiB RAM / ổ 40 GiB, mỗi tick = 1 giây. Người học bơm sự cố
 * (CPU bị chiếm, rò bộ nhớ tới OOM, log làm đầy đĩa, bão I/O, fork bomb trong cgroup, zombie dồn đống) rồi đọc các cột
 * như đọc máy thật. Thuần hàm: tick(s) → s mới; act(s, việc) → s mới; cmd(s, lệnh) → chữ in ra như terminal.
 *
 * Mô hình (đủ đúng để các cột "cư xử" như thật, không giả vờ là kernel):
 *  - CPU: mỗi luồng muốn ≤ 1 lõi; chia lõi theo TRỌNG SỐ nice của CFS (nice 0 = 1024, nice 19 = 15) bằng cách "rót nước"
 *    (luồng muốn ít hơn phần của nó thì lấy đủ, phần dư chia lại). top hiện %CPU theo LÕI (một tiến trình 6 luồng được 380%).
 *  - load average: số tác vụ R (chạy + chờ CPU) + D (ngủ chờ I/O, không ngắt được) — trung bình mũ 1/5/15 phút như
 *    kernel/sched/loadavg.c (kernel lấy mẫu mỗi 5 s; ở đây mỗi 1 s với hệ số e^(-1/60) … tương đương).
 *  - Bộ nhớ: used = kernel + Σ RES; buff/cache lớn lên theo I/O; thiếu chỗ ⇒ bỏ cache trước, rồi đẩy trang ra swap
 *    (kswapd ăn sy%), hết swap ⇒ OOM killer giết tiến trình RES lớn nhất (SIGKILL ⇒ mã thoát 128 + 9 = 137).
 *    available ≈ free + phần cache bỏ được — con số phải nhìn, KHÔNG phải free.
 *  - Đĩa: băng thông chia theo nhu cầu; ρ = nhu cầu / băng thông; ρ cao ⇒ tiến trình nằm D, %util → 100, await phình ra,
 *    CPU rảnh mà có tác vụ chờ I/O thì tính vào wa.
 */
export type Scen = 'cpuhog' | 'memleak' | 'diskfull' | 'iostorm' | 'forkbomb' | 'zombies';
export const SCENS: Scen[] = ['cpuhog', 'memleak', 'diskfull', 'iostorm', 'forkbomb', 'zombies'];

export type Role = 'hog' | 'leak' | 'logger' | 'io' | 'mgr' | 'api' | 'db' | 'base';
export interface Proc {
  pid: number; ppid: number; user: string; cmd: string; nice: number; threads: number;
  /** nhu cầu CPU của MỖI luồng khi chạy (0..1 lõi) */ cpu: number;
  /** phần thời gian CPU nằm trong kernel */ sysFrac: number;
  rss: number; virt: number; shr: number; swp: number; // MiB
  ioR: number; ioW: number; // MB/s muốn đọc/ghi
  ioIdle?: boolean; // ionice -c3
  role: Role;
  time: number; // giây CPU đã dùng
  pcpu: number; st: 'R' | 'S' | 'D' | 'Z';
}
export interface LogLine { t: number; src: 'kernel' | 'systemd' | 'app' | 'shell'; txt: string }
export interface Sys {
  t: number; cores: number; memTotal: number; swapTotal: number; swapUsed: number; cache: number;
  disk: { size: number; used: number; logFile: number; deletedOpen: number; deleted: boolean; bw: number }; // GiB, MB/s
  procs: Proc[];
  bomb: { n: number; max: number; failed: number } | null;
  zomb: { n: number; ppid: number } | null;
  load: [number, number, number]; nr: number;
  cpu: { us: number; sy: number; ni: number; wa: number; id: number };
  io: { util: number; await: number; rMB: number; wMB: number; rho: number };
  mem: { used: number; free: number; avail: number };
  si: number; so: number;
  scen: Scen[];
  nextPid: number; restartAt: number | null;
  log: LogLine[];
  apiMs: number | null; // p99 của API web (null = API chết)
  oomKills: number; enospc: number;
  stopped: string[]; // dịch vụ đã systemctl stop
}

export const KERNEL_MIB = 650;
const CACHE_MIN = 160;
const MIN_FREE = 80;
const LEAK_MIB_S = 180;
const LOG_MB_S = 300;
const BASH_MIB = 3.4;
/** bảng trọng số của CFS (kernel/sched/core.c sched_prio_to_weight), nice 0..19 */
export const NICE_WEIGHT = [1024, 820, 655, 526, 423, 335, 272, 215, 172, 137, 110, 87, 70, 56, 45, 36, 29, 23, 18, 15];
export const weightOf = (nice: number) => NICE_WEIGHT[Math.max(0, Math.min(19, nice))];
export const EXP = [Math.exp(-1 / 60), Math.exp(-1 / 300), Math.exp(-1 / 900)] as const;

const base = (pid: number, ppid: number, user: string, cmd: string, o: Partial<Proc>): Proc => ({
  pid, ppid, user, cmd, nice: 0, threads: 1, cpu: 0, sysFrac: 0.1, rss: 5, virt: 20, shr: 3, swp: 0, ioR: 0, ioW: 0,
  role: 'base', time: 0, pcpu: 0, st: 'S', ...o,
});

function baseline(): Proc[] {
  return [
    base(1, 0, 'root', 'systemd', { cpu: 0.003, rss: 12, virt: 166, shr: 9, time: 41 }),
    base(412, 1, 'root', 'systemd-journald', { cpu: 0.006, rss: 40, virt: 90, shr: 38, ioW: 0.3, time: 88 }),
    base(780, 1, 'root', 'sshd', { rss: 8, virt: 15, shr: 7, time: 2 }),
    base(1022, 1, 'postgres', 'postgres', { cpu: 0.03, rss: 210, virt: 1300, shr: 180, ioR: 1.5, ioW: 2, role: 'db', time: 620 }),
    base(1100, 1, 'redis', 'redis-server', { cpu: 0.01, rss: 60, virt: 140, shr: 8, time: 210 }),
    base(1188, 1, 'www-data', 'nginx', { cpu: 0.01, rss: 14, virt: 60, shr: 10, time: 95 }),
    base(1203, 1, 'app', 'node /srv/api/server.js', { cpu: 0.12, sysFrac: 0.15, rss: 165, virt: 1120, shr: 42, ioW: 0.5, role: 'api', time: 1830 }),
    base(2201, 780, 'dev', 'bash', { rss: 5, virt: 9, shr: 3, time: 0.1 }),
    base(2290, 2201, 'dev', 'top', { cpu: 0.005, rss: 4, virt: 12, shr: 3, time: 0.4 }),
  ];
}

function spawn(s: Sys, sc: Scen): void {
  const pid = () => s.nextPid++;
  if (sc === 'cpuhog') s.procs.push(base(pid(), 2201, 'dev', 'python3 train.py', { threads: 6, cpu: 1, sysFrac: 0.02, rss: 900, virt: 3400, shr: 60, role: 'hog' }));
  if (sc === 'memleak') s.procs.push(base(pid(), 1, 'app', 'java -jar report.jar', { threads: 2, cpu: 0.25, sysFrac: 0.05, rss: 600, virt: 4800, shr: 30, role: 'leak' }));
  if (sc === 'diskfull') s.procs.push(base(pid(), 1, 'app', 'python3 worker.py', { cpu: 0.2, sysFrac: 0.35, rss: 120, virt: 450, shr: 12, ioW: LOG_MB_S, role: 'logger' }));
  if (sc === 'iostorm') {
    s.procs.push(base(pid(), 1, 'postgres', 'pg_dump shop', { cpu: 0.15, sysFrac: 0.3, rss: 40, virt: 220, shr: 20, ioR: 180, role: 'io' }));
    s.procs.push(base(pid(), 1, 'root', 'tar czf /backup/srv.tgz /srv', { cpu: 0.45, sysFrac: 0.2, rss: 8, virt: 30, shr: 4, ioR: 160, role: 'io' }));
    s.procs.push(base(pid(), 1, 'root', 'rsync -a /data /mnt/nas', { cpu: 0.1, sysFrac: 0.4, rss: 12, virt: 60, shr: 4, ioR: 150, role: 'io' }));
  }
  if (sc === 'forkbomb') s.bomb = { n: 1, max: 512, failed: 0 };
  if (sc === 'zombies') {
    const p = pid();
    s.procs.push(base(p, 1, 'app', 'worker-mgr', { cpu: 0.05, rss: 40, virt: 300, shr: 8, role: 'mgr' }));
    s.zomb = { n: 0, ppid: p };
  }
  if (!s.scen.includes(sc)) s.scen = [...s.scen, sc];
}

export function initSys(scens: Scen[] = []): Sys {
  const s: Sys = {
    t: 0, cores: 4, memTotal: 7936, swapTotal: 1024, swapUsed: 0, cache: 3000,
    disk: { size: 40, used: scens.includes('diskfull') ? 34 : 26, logFile: 3, deletedOpen: 0, deleted: false, bw: 300 },
    procs: baseline(), bomb: null, zomb: null, load: [0.35, 0.3, 0.25], nr: 0,
    cpu: { us: 0, sy: 0, ni: 0, wa: 0, id: 100 }, io: { util: 0, await: 0, rMB: 0, wMB: 0, rho: 0 },
    mem: { used: 0, free: 0, avail: 0 }, si: 0, so: 0, scen: [], nextPid: 4242, restartAt: null, log: [],
    apiMs: 38, oomKills: 0, enospc: 0, stopped: [],
  };
  for (const sc of scens) spawn(s, sc);
  return measure(s, 0);
}

/** Bơm thêm một sự cố vào máy đang chạy. */
export function inject(s0: Sys, sc: Scen): Sys {
  const s = clone(s0);
  if (s.scen.includes(sc) && sc !== 'iostorm') return s0;
  if (sc === 'diskfull') s.disk.used = Math.max(s.disk.used, 34);
  spawn(s, sc);
  return measure(s, 0);
}

function clone(s: Sys): Sys {
  return { ...s, disk: { ...s.disk }, procs: s.procs.map((p) => ({ ...p })), bomb: s.bomb && { ...s.bomb }, zomb: s.zomb && { ...s.zomb },
    load: [...s.load] as [number, number, number], cpu: { ...s.cpu }, io: { ...s.io }, mem: { ...s.mem }, log: s.log, scen: [...s.scen], stopped: [...s.stopped] };
}
const say = (s: Sys, src: LogLine['src'], txt: string) => { s.log = [...s.log.slice(-60), { t: s.t, src, txt }]; };

/**
 * "Rót nước" theo trọng số: mỗi luồng muốn `want` (≤ 1 lõi), trọng số `w`; chia `cores` lõi.
 * Trả về phần mỗi luồng nhận được. Tổng ≤ cores; luồng nào muốn ít hơn phần công bằng thì nhận đúng phần muốn.
 */
export function shareCpu(threads: Array<{ want: number; w: number }>, cores: number): number[] {
  const got = threads.map(() => 0);
  let left = cores;
  let act = threads.map((t, k) => k).filter((k) => threads[k].want > 0);
  for (let guard = 0; guard < 50 && act.length && left > 1e-12; guard++) {
    const W = act.reduce((a, k) => a + threads[k].w, 0);
    const unit = left / W;
    const sat = act.filter((k) => threads[k].want <= threads[k].w * unit + 1e-12);
    if (!sat.length) { for (const k of act) got[k] = threads[k].w * unit; left = 0; break; }
    for (const k of sat) { got[k] = threads[k].want; left -= threads[k].want; }
    act = act.filter((k) => !sat.includes(k));
  }
  return got;
}

/** Một giây trôi qua. */
export function tick(s0: Sys): Sys {
  const s = clone(s0);
  s.t++;
  // 1) sự cố lớn dần
  for (const p of s.procs) if (p.role === 'leak') { p.rss += LEAK_MIB_S; p.virt += LEAK_MIB_S; }
  if (s.bomb) {
    if (s.bomb.n < s.bomb.max) {
      s.bomb.n = Math.min(s.bomb.max, s.bomb.n * 2);
      if (s.bomb.n === s.bomb.max) say(s, 'kernel', `cgroup: fork rejected by pids controller in /user.slice/user-1000.slice (pids.max=${s.bomb.max})`);
    } else {
      s.bomb.failed += s.bomb.n;
      if (s.t % 3 === 0) say(s, 'shell', 'bash: fork: retry: Resource temporarily unavailable');
    }
  }
  if (s.zomb) s.zomb.n += 5;
  if (s.restartAt !== null && s.t >= s.restartAt) {
    s.restartAt = null;
    spawn(s, 'memleak');
    say(s, 'systemd', 'systemd[1]: Started report.service - Report generator.');
  }
  return measure(s, 1);
}

/** Tính các số đo của một giây (dt = 0: chỉ đo lại sau khi can thiệp, không cộng dồn thời gian). */
function measure(s: Sys, dt: number): Sys {
  const live = s.procs;
  // 2) I/O
  const diskFree = s.disk.size - s.disk.used;
  const wantIo = (p: Proc) => p.ioR + (p.role === 'logger' && diskFree <= 0.0005 ? 0 : p.ioW);
  const norm = live.filter((p) => !p.ioIdle), idle = live.filter((p) => p.ioIdle);
  const qN = norm.reduce((a, p) => a + wantIo(p), 0), qI = idle.reduce((a, p) => a + wantIo(p), 0);
  const Q = qN + qI, bw = s.disk.bw;
  const fN = qN > 0 ? Math.min(1, bw / qN) : 1;
  const leftBw = Math.max(0, bw - qN * fN);
  const fI = qI > 0 ? Math.min(1, leftBw / qI) : 1;
  const frac = (p: Proc) => (p.ioIdle ? fI : fN);
  const rho = Q / bw;
  let rMB = 0, wMB = 0;
  for (const p of live) {
    const f = frac(p);
    rMB += p.ioR * f;
    const w = (wantIo(p) - p.ioR) * f;
    wMB += w;
    if (p.role === 'logger' && dt) {
      const g = (w * dt) / 1024;
      s.disk.used = Math.min(s.disk.size, s.disk.used + g);
      if (s.disk.deleted) s.disk.deletedOpen += g; else s.disk.logFile += g;
    }
  }
  if (dt && live.some((p) => p.role === 'logger') && s.disk.size - s.disk.used <= 0.0005) {
    s.enospc++;
    if (s.enospc === 1 || s.enospc % 6 === 0) {
      say(s, 'app', "worker.py: OSError: [Errno 28] No space left on device: '/var/log/app/debug.log'");
      say(s, 'app', 'postgres: PANIC: could not write to file "pg_wal/xlogtemp.1022": No space left on device');
    }
  }
  const u = Math.min(rho, 0.985);
  const rhoN = qN / bw, uN = Math.min(rhoN, 0.985);
  const awaitN = 0.4 / (1 - uN) + (rhoN > 1 ? (rhoN - 1) * 300 : 0);
  s.io = { rho, util: Math.min(100, rho * 100), await: Q > 0 ? 0.4 / (1 - u) + (rho > 1 ? (rho - 1) * 300 : 0) : 0, rMB, wMB };

  // 3) bộ nhớ
  let kswapd = 0;
  s.so = 0; s.si = 0;
  if (dt) s.cache = Math.min(s.memTotal, s.cache + (rMB + wMB) * dt * 0.9);
  const anonOf = () => KERNEL_MIB + s.procs.reduce((a, p) => a + p.rss, 0) + (s.bomb ? s.bomb.n * BASH_MIB : 0);
  const limit = s.memTotal - MIN_FREE;
  let over = anonOf() + s.cache - limit;
  if (over > 0) {
    const drop = Math.min(over, Math.max(0, s.cache - CACHE_MIN));
    s.cache -= drop; over -= drop; kswapd += drop / 3000;
  }
  if (over > 0) {
    const room = s.swapTotal - s.swapUsed;
    let out = Math.min(over, room);
    if (out > 0) {
      // trang lâu không dùng (tiến trình đang ngủ) bị đẩy ra trước, tiến trình đang rò sau cùng
      const order = [...s.procs].sort((a, b) => (a.role === 'leak' ? 1 : 0) - (b.role === 'leak' ? 1 : 0) || b.rss - a.rss);
      for (const p of order) {
        if (out <= 0) break;
        const take = Math.min(out, Math.max(0, p.rss - p.shr * 0.5) * (p.role === 'leak' ? 1 : 0.6));
        p.rss -= take; p.swp += take; out -= take; s.swapUsed += take; s.so += take; over -= take;
      }
      kswapd += 0.6; s.si = s.so * 0.35;
    }
  }
  if (over > 0 && dt) {
    const cand = s.procs.filter((p) => p.pid !== 1);
    const v = cand.reduce((a, p) => (p.rss + p.swp > a.rss + a.swp ? p : a), cand[0]);
    s.procs = s.procs.filter((p) => p !== v);
    s.swapUsed = Math.max(0, s.swapUsed - v.swp);
    s.oomKills++;
    say(s, 'kernel', `${v.cmd.split(' ')[0]} invoked oom-killer: gfp_mask=0x140cca(GFP_HIGHUSER_MOVABLE|__GFP_COMP), order=0, oom_score_adj=0`);
    say(s, 'kernel', `Out of memory: Killed process ${v.pid} (${v.cmd.split(' ')[0]}) total-vm:${Math.round(v.virt * 1024)}kB, anon-rss:${Math.round(v.rss * 1024)}kB, file-rss:0kB, shmem-rss:0kB, UID:1001 pgtables:${Math.round(v.rss * 2)}kB oom_score_adj:0`);
    if (v.role === 'leak') {
      say(s, 'systemd', 'systemd[1]: report.service: Main process exited, code=killed, status=9/KILL');
      say(s, 'systemd', "systemd[1]: report.service: Failed with result 'oom-kill'.");
      if (!s.stopped.includes('report')) s.restartAt = s.t + 4;
    }
  }
  const used = anonOf();
  const free = Math.max(0, s.memTotal - used - s.cache);
  s.mem = { used, free, avail: free + Math.max(0, s.cache - 95) };

  // 4) CPU
  const ths: Array<{ want: number; w: number; p: Proc | null; sys: number; nice: number }> = [];
  for (const p of s.procs) {
    const io = wantIo(p);
    const f = io > 0 ? frac(p) : 1;
    const want = p.cpu * (io > 0 ? f : 1) * (dt ? jitter(s.t, p.pid) : 1);
    for (let k = 0; k < p.threads; k++) ths.push({ want, w: weightOf(p.nice), p, sys: p.sysFrac, nice: p.nice });
  }
  if (s.bomb) for (let k = 0; k < s.bomb.n; k++) ths.push({ want: 0.25, w: 1024, p: null, sys: 0.7, nice: 0 });
  if (kswapd > 0) ths.push({ want: Math.min(1, kswapd), w: 1024, p: null, sys: 1, nice: 0 });
  const got = shareCpu(ths, s.cores);
  let us = 0, sy = 0, ni = 0;
  const pc = new Map<Proc, number>();
  ths.forEach((t, k) => {
    const g = got[k];
    sy += g * t.sys;
    if (t.nice > 0) ni += g * (1 - t.sys); else us += g * (1 - t.sys);
    if (t.p) pc.set(t.p, (pc.get(t.p) ?? 0) + g);
  });
  const busy = us + sy + ni, idleC = Math.max(0, s.cores - busy);
  let nD = 0, nR = 0;
  for (const p of s.procs) {
    const g = pc.get(p) ?? 0;
    p.pcpu = g * 100;
    if (dt) p.time += g * dt;
    const io = wantIo(p);
    if (io > 0 && rho > 0.85 && (p.role === 'io' || p.role === 'logger' || io > 20)) { p.st = 'D'; nD++; }
    else if (p.cpu * p.threads >= 0.3 || g > 0.05) { p.st = 'R'; nR += p.cpu >= 0.5 ? p.threads : 1; }
    else p.st = 'S';
  }
  nR += s.bomb ? s.bomb.n : 0;
  if (kswapd > 0.2) nR++;
  const wa = Math.min(idleC, Math.min(s.cores, nD) * (rho > 0.85 ? 0.9 : 0.3));
  const pct = (v: number) => (100 * v) / s.cores;
  s.cpu = { us: pct(us), sy: pct(sy), ni: pct(ni), wa: pct(wa), id: Math.max(0, pct(s.cores - busy - wa)) };

  // 5) load average
  s.nr = nR + nD;
  if (dt) s.load = s.load.map((l, k) => l * EXP[k] + s.nr * (1 - EXP[k])) as [number, number, number];

  // 6) độ trễ p99 của API (người dùng thấy gì)
  const api = s.procs.find((p) => p.role === 'api');
  if (!api) s.apiMs = null;
  else {
    const want = api.cpu, g = pc.get(api) ?? 0;
    // chờ trong hàng chạy: các luồng khác đang đòi CPU, quy theo trọng số (nice 19 gần như không chen được)
    const rival = ths.reduce((a, t, k) => a + (t.p === api ? 0 : Math.min(1, t.want) * (t.w / 1024)), 0);
    const rq = idleC < 0.2 ? 1 + Math.max(0, rival + 1 - s.cores) / s.cores : 1;
    const cpuF = (g > 0 ? Math.max(1, want / g) : 50) * rq;
    const ioF = api.ioIdle ? 0 : awaitN * 2.5;
    const memF = s.so > 0 ? 450 : 0;
    s.apiMs = 37 * cpuF * (1 + Math.max(0, s.cpu.sy - 30) / 40) + ioF + memF;
  }
  return s;
}
function jitter(t: number, pid: number) {
  const x = Math.sin(t * 12.9898 + pid * 78.233) * 43758.5453;
  return 0.85 + 0.3 * (x - Math.floor(x));
}

export type Action =
  | { k: 'kill'; pid: number } | { k: 'renice'; pid: number } | { k: 'ionice'; pid: number }
  | { k: 'truncate' } | { k: 'rm' } | { k: 'stop'; svc: 'report' | 'worker' | 'worker-mgr' } | { k: 'cgkill' };
export interface ActResult { s: Sys; en: string; vi: string; tone: 'ok' | 'bad' | 'warn' }

/** Can thiệp của người học. pid ≥ 60000 là một bản sao bash của fork bomb, 50000..59999 là một zombie. */
export function act(s0: Sys, a: Action): ActResult {
  const s = clone(s0);
  const r = (en: string, vi: string, tone: ActResult['tone']) => ({ s: measure(s, 0), en, vi, tone });
  if (a.k === 'kill') {
    say(s, 'shell', `$ kill -9 ${a.pid}`);
    if (a.pid === 1) return r('PID 1 (systemd) ignores signals it has no handler for — the kernel protects init. Nothing happens.', 'PID 1 (systemd) bỏ qua tín hiệu không có handler — kernel bảo vệ init. Không có gì xảy ra.', 'warn');
    if (a.pid >= 60000 && s.bomb) {
      s.bomb.n = Math.max(1, s.bomb.n - 1);
      return r('One copy dies — and the others fork a replacement next second. Killing a fork bomb one PID at a time never wins. Kill the whole cgroup.', 'Một bản chết — giây sau các bản còn lại fork bù ngay. Giết fork bomb từng PID một không bao giờ thắng. Hãy giết cả cgroup.', 'warn');
    }
    if (a.pid >= 50000 && a.pid < 60000) return r('A zombie is already dead: it has no code left to receive a signal. kill -9 does nothing. Only its parent calling wait() — or the parent dying so systemd adopts and reaps it — removes it.', 'Zombie đã chết rồi: không còn mã nào để nhận tín hiệu. kill -9 vô tác dụng. Chỉ cha nó gọi wait() — hoặc cha chết để systemd nhận nuôi và dọn — mới xoá được.', 'warn');
    const p = s.procs.find((x) => x.pid === a.pid);
    if (!p) return r(`bash: kill: (${a.pid}) - No such process`, `bash: kill: (${a.pid}) - No such process (không có tiến trình này)`, 'warn');
    s.procs = s.procs.filter((x) => x !== p);
    s.swapUsed = Math.max(0, s.swapUsed - p.swp);
    if (p.role === 'leak') {
      say(s, 'systemd', 'systemd[1]: report.service: Main process exited, code=killed, status=9/KILL');
      if (!s.stopped.includes('report')) s.restartAt = s.t + 4;
      return r('Memory is back — for now. report.service has Restart=on-failure, so systemd starts it again in a few seconds and the leak starts over. A restart buys time; it is not a fix. (Exit status 9/KILL = shell exit code 137.)', 'Bộ nhớ đã về — tạm thời. report.service có Restart=on-failure nên vài giây nữa systemd chạy lại và rò tiếp. Khởi động lại chỉ câu giờ, không phải sửa lỗi. (status 9/KILL = mã thoát 137 trong shell.)', 'warn');
    }
    if (p.role === 'logger') {
      const freed = s.disk.deletedOpen;
      if (freed > 0) { s.disk.used -= freed; s.disk.deletedOpen = 0; }
      s.disk.deleted = false;
      return r(freed > 0 ? `The process held the deleted file open; now that it exited, the kernel finally frees ${freed.toFixed(1)} GiB.` : 'The writer is gone, the disk stops filling. The log file is still there — clean it up.',
        freed > 0 ? `Tiến trình đang giữ file đã xoá; nó thoát rồi nên kernel mới trả ${freed.toFixed(1)} GiB.` : 'Kẻ ghi đã chết, đĩa ngừng đầy thêm. File log vẫn còn đó — hãy dọn.', 'ok');
    }
    if (p.role === 'mgr' && s.zomb) {
      const n = s.zomb.n; s.zomb = null;
      say(s, 'kernel', `worker-mgr exited; ${n} zombie children re-parented to PID 1 and reaped`);
      return r(`Killing the PARENT works: its ${n} zombie children are adopted by PID 1 (systemd), which calls wait() and reaps them all at once.`, `Giết CHA mới hiệu quả: ${n} đứa con zombie được PID 1 (systemd) nhận nuôi, nó gọi wait() và dọn sạch một lượt.`, 'ok');
    }
    if (p.role === 'api') return r('You just killed the web API itself. Users now get 502 Bad Gateway from nginx.', 'Bạn vừa giết chính API web. Người dùng giờ nhận 502 Bad Gateway từ nginx.', 'bad');
    if (p.role === 'db') return r('You killed PostgreSQL. Every request that touches the database now fails.', 'Bạn vừa giết PostgreSQL. Mọi request đụng tới CSDL giờ đều lỗi.', 'bad');
    return r(`Process ${p.pid} (${p.cmd}) killed with SIGKILL — its parent will see exit code 137.`, `Đã giết tiến trình ${p.pid} (${p.cmd}) bằng SIGKILL — tiến trình cha sẽ thấy mã thoát 137.`, p.role === 'hog' || p.role === 'io' ? 'ok' : 'warn');
  }
  if (a.k === 'renice') {
    const p = s.procs.find((x) => x.pid === a.pid);
    if (!p) return r('No such process.', 'Không có tiến trình này.', 'warn');
    p.nice = 19;
    say(s, 'shell', `$ renice -n 19 -p ${a.pid}`);
    return r(`nice 19 = CFS weight 15 instead of 1024. ${p.cmd} still uses every idle cycle (us% stays high, it moves to "ni"), but anything with nice 0 now wins the CPU when it needs it — watch the API latency.`, `nice 19 = trọng số CFS 15 thay vì 1024. ${p.cmd} vẫn ăn mọi chu kỳ rảnh (us% vẫn cao, nó chuyển sang cột "ni"), nhưng tiến trình nice 0 nào cần CPU là giành được ngay — nhìn độ trễ API.`, 'ok');
  }
  if (a.k === 'ionice') {
    let n = 0;
    for (const p of s.procs) if (p.role === 'io' || p.pid === a.pid) { p.ioIdle = true; n++; }
    say(s, 'shell', `$ ionice -c3 -p ${a.pid}`);
    return r(n ? 'Idle I/O class: the backup only gets the disk when nobody else wants it. The disk is still 100% busy, but the API and PostgreSQL go first again.' : 'Nothing to change.',
      n ? 'Lớp I/O idle: bản sao lưu chỉ được dùng đĩa khi không ai khác cần. Đĩa vẫn bận 100%, nhưng API và PostgreSQL lại được đi trước.' : 'Không có gì để đổi.', 'ok');
  }
  if (a.k === 'truncate') {
    say(s, 'shell', '$ truncate -s 0 /var/log/app/debug.log');
    if (s.disk.deleted) return r("truncate: cannot open '/var/log/app/debug.log': No such file or directory — you already rm'ed the name. Truncate it through the open descriptor instead: : > /proc/<pid>/fd/3 (or restart the writer).", "truncate: không mở được '/var/log/app/debug.log': không có file — bạn đã rm mất tên rồi. Hãy truncate qua descriptor đang mở: : > /proc/<pid>/fd/3 (hoặc khởi động lại tiến trình ghi).", 'warn');
    const g = s.disk.logFile; s.disk.used = Math.max(0, s.disk.used - g); s.disk.logFile = 0;
    const still = s.procs.some((p) => p.role === 'logger');
    return r(`Freed ${g.toFixed(1)} GiB immediately — truncating keeps the same inode, so the process that has it open just keeps writing at offset 0.${still ? ' But the writer is still running at 300 MB/s: fix its log level or add logrotate, or it fills up again.' : ''}`,
      `Trả ngay ${g.toFixed(1)} GiB — truncate giữ nguyên inode, tiến trình đang mở file cứ thế ghi tiếp từ đầu.${still ? ' Nhưng kẻ ghi vẫn chạy 300 MB/s: sửa mức log hoặc thêm logrotate, không thì lại đầy.' : ''}`, still ? 'warn' : 'ok');
  }
  if (a.k === 'rm') {
    say(s, 'shell', '$ rm /var/log/app/debug.log');
    const holder = s.procs.some((p) => p.role === 'logger');
    if (s.disk.deleted) return r("rm: cannot remove '/var/log/app/debug.log': No such file or directory", "rm: không xoá được '/var/log/app/debug.log': không có file (đã xoá rồi)", 'warn');
    if (holder) { s.disk.deletedOpen += s.disk.logFile; s.disk.logFile = 0; s.disk.deleted = true; }
    else { s.disk.used -= s.disk.logFile; s.disk.logFile = 0; }
    return r(holder ? 'The name is gone from ls, but df did NOT drop: worker.py still has the file open, and the kernel frees the blocks only when the last open descriptor closes. Find it with lsof +L1, then restart the process (or truncate via /proc/<pid>/fd/N).' : 'Deleted and freed.',
      holder ? 'Tên đã biến mất khỏi ls, nhưng df KHÔNG giảm: worker.py vẫn đang mở file, và kernel chỉ trả các khối khi descriptor cuối cùng đóng. Tìm bằng lsof +L1, rồi khởi động lại tiến trình (hoặc truncate qua /proc/<pid>/fd/N).' : 'Đã xoá và trả chỗ.', holder ? 'bad' : 'ok');
  }
  if (a.k === 'stop') {
    const role: Role = a.svc === 'report' ? 'leak' : a.svc === 'worker' ? 'logger' : 'mgr';
    say(s, 'shell', `$ sudo systemctl stop ${a.svc}`);
    s.stopped.push(a.svc === 'report' ? 'report' : a.svc);
    if (a.svc === 'report') s.restartAt = null;
    const p = s.procs.find((x) => x.role === role);
    if (p) {
      const res = act(s, { k: 'kill', pid: p.pid });
      const out = res.s; out.restartAt = a.svc === 'report' ? null : out.restartAt;
      return { s: out, en: `Service stopped (systemd will not restart it). ${a.svc === 'report' ? 'Now find the leak in the code — or cap it with MemoryMax= (see the cgroup lab).' : ''}`, vi: `Đã dừng dịch vụ (systemd không tự chạy lại). ${a.svc === 'report' ? 'Giờ đi tìm chỗ rò trong mã — hoặc chặn trần bằng MemoryMax= (xem phòng lab cgroup).' : ''}`, tone: 'ok' };
    }
    return r('Service stopped.', 'Đã dừng dịch vụ.', 'ok');
  }
  // cgkill
  say(s, 'shell', '$ echo 1 | sudo tee /sys/fs/cgroup/user.slice/user-1000.slice/session-7.scope/cgroup.kill');
  if (!s.bomb) return r('No fork bomb running.', 'Không có fork bomb nào.', 'warn');
  const n = s.bomb.n; s.bomb = null;
  return r(`cgroup.kill sends SIGKILL to all ${n} processes in the cgroup at once — they cannot fork faster than that. The pids.max=512 limit is why the rest of the machine survived.`, `cgroup.kill gửi SIGKILL cho cả ${n} tiến trình trong cgroup cùng lúc — chúng không fork kịp. Giới hạn pids.max=512 là lý do phần còn lại của máy sống sót.`, 'ok');
}

// ───────────────────────── các lệnh "in ra như thật" ─────────────────────────
const f1 = (v: number) => v.toFixed(1);
const f2 = (v: number) => v.toFixed(2);
const pad = (v: string | number, w: number) => String(v).padStart(w);
const padE = (v: string | number, w: number) => String(v).padEnd(w);
const clock = (t: number) => { const x = 10 * 3600 + 42 * 60 + 7 + t; return `${pad(Math.floor(x / 3600) % 24, 2)}:${String(Math.floor(x / 60) % 60).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`; };
const tasks = (s: Sys) => s.procs.length + 96 + (s.bomb?.n ?? 0) + (s.zomb?.n ?? 0);

export interface TopRow { pid: number; user: string; pr: number | string; ni: number; virt: number; res: number; shr: number; st: string; cpu: number; mem: number; time: number; cmd: string; role?: Role | 'bomb' | 'zombie' | 'kswapd' }
export function topRows(s: Sys, sort: 'cpu' | 'mem' = 'cpu', n = 14): TopRow[] {
  const rows: TopRow[] = s.procs.map((p) => ({ pid: p.pid, user: p.user, pr: 20 + p.nice, ni: p.nice, virt: p.virt * 1024, res: p.rss * 1024, shr: p.shr * 1024, st: p.st, cpu: p.pcpu, mem: (100 * p.rss) / s.memTotal, time: p.time, cmd: p.cmd.split(' ')[0].split('/').pop() === 'node' ? 'node' : p.cmd.split(' ')[0], role: p.role }));
  if (s.cpu.sy > 0 && s.so > 0) rows.push({ pid: 98, user: 'root', pr: 20, ni: 0, virt: 0, res: 0, shr: 0, st: 'R', cpu: Math.min(100, 60 + (s.so / 30)), mem: 0, time: 0, cmd: 'kswapd0', role: 'kswapd' });
  if (s.bomb) {
    const each = Math.min(25, (100 * s.cores * 0.95) / Math.max(1, s.bomb.n));
    for (let k = 0; k < Math.min(s.bomb.n, 12); k++) rows.push({ pid: 60000 + k * 7 + 3, user: 'dev', pr: 20, ni: 0, virt: 9 * 1024, res: BASH_MIB * 1024, shr: 3 * 1024, st: k % 3 ? 'R' : 'S', cpu: each, mem: (100 * BASH_MIB) / s.memTotal, time: 0.01 * s.t, cmd: 'bash', role: 'bomb' });
  }
  if (s.zomb && s.zomb.n) for (let k = 0; k < Math.min(s.zomb.n, 8); k++) rows.push({ pid: 50000 + k * 3 + 1, user: 'app', pr: 20, ni: 0, virt: 0, res: 0, shr: 0, st: 'Z', cpu: 0, mem: 0, time: 0, cmd: 'worker <defunct>', role: 'zombie' });
  rows.sort((a, b) => (sort === 'cpu' ? b.cpu - a.cpu || b.mem - a.mem : b.mem - a.mem || b.cpu - a.cpu));
  return rows.slice(0, n);
}

export function topHeader(s: Sys): string[] {
  const R = s.procs.filter((p) => p.st === 'R').length + (s.bomb ? Math.round(s.bomb.n * 0.6) : 0);
  const Z = s.zomb?.n ?? 0;
  const T = tasks(s);
  return [
    `top - ${clock(s.t)} up 12 days,  3:11,  1 user,  load average: ${f2(s.load[0])}, ${f2(s.load[1])}, ${f2(s.load[2])}`,
    `Tasks: ${pad(T, 3)} total, ${pad(R, 3)} running, ${pad(T - R - Z, 3)} sleeping,   0 stopped, ${pad(Z, 3)} zombie`,
    `%Cpu(s): ${pad(f1(s.cpu.us), 4)} us, ${pad(f1(s.cpu.sy), 4)} sy, ${pad(f1(s.cpu.ni), 4)} ni, ${pad(f1(s.cpu.id), 4)} id, ${pad(f1(s.cpu.wa), 4)} wa,  0.0 hi,  0.0 si,  0.0 st`,
    `MiB Mem : ${pad(f1(s.memTotal), 7)} total, ${pad(f1(s.mem.free), 7)} free, ${pad(f1(s.mem.used), 7)} used, ${pad(f1(s.cache), 7)} buff/cache`,
    `MiB Swap: ${pad(f1(s.swapTotal), 7)} total, ${pad(f1(s.swapTotal - s.swapUsed), 7)} free, ${pad(f1(s.swapUsed), 7)} used. ${pad(f1(s.mem.avail), 7)} avail Mem`,
  ];
}
const kb = (k: number) => (k >= 1e7 ? `${(k / 1048576).toFixed(1)}g` : String(Math.round(k)));
export function topLine(r: TopRow): string {
  const tm = `${Math.floor(r.time / 60)}:${(r.time % 60).toFixed(2).padStart(5, '0')}`;
  return `${pad(r.pid, 7)} ${padE(r.user, 8)} ${pad(r.pr, 3)} ${pad(r.ni, 3)} ${pad(kb(r.virt), 7)} ${pad(kb(r.res), 6)} ${pad(kb(r.shr), 6)} ${r.st} ${pad(f1(r.cpu), 5)} ${pad(f1(r.mem), 5)} ${pad(tm, 9)} ${r.cmd}`;
}
export const TOP_COLS = '    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND';

export const COMMANDS = ['uptime', 'free -m', 'df -h /', 'vmstat 1 2', 'iostat -x 1 2', 'ps zombies', 'dmesg | tail', 'du -sh /var/log/*', 'lsof +L1', 'pids.current'] as const;
export type Cmd = (typeof COMMANDS)[number];

export function cmd(s: Sys, c: Cmd): string {
  const d = s.disk, dfUse = Math.min(100, Math.ceil((100 * d.used) / d.size));
  switch (c) {
    case 'uptime': return `$ nproc\n${s.cores}\n$ uptime\n ${clock(s.t)} up 12 days,  3:11,  1 user,  load average: ${f2(s.load[0])}, ${f2(s.load[1])}, ${f2(s.load[2])}`;
    case 'free -m': return `$ free -m\n               total        used        free      shared  buff/cache   available\nMem:     ${pad(s.memTotal, 11)} ${pad(Math.round(s.mem.used), 11)} ${pad(Math.round(s.mem.free), 11)} ${pad(95, 11)} ${pad(Math.round(s.cache), 11)} ${pad(Math.round(s.mem.avail), 11)}\nSwap:    ${pad(s.swapTotal, 11)} ${pad(Math.round(s.swapUsed), 11)} ${pad(Math.round(s.swapTotal - s.swapUsed), 11)}`;
    case 'df -h /': return `$ df -h /\nFilesystem      Size  Used Avail Use% Mounted on\n/dev/vda1       ${pad(`${d.size}G`, 4)} ${pad(`${f1(d.used)}G`, 5)} ${pad(`${f1(Math.max(0, d.size - d.used))}G`, 5)} ${pad(`${dfUse}%`, 4)} /`;
    case 'vmstat 1 2': {
      const r = Math.round(s.nr - s.procs.filter((p) => p.st === 'D').length), b = s.procs.filter((p) => p.st === 'D').length;
      return `$ vmstat 1 2\nprocs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n${pad(Math.max(0, r), 2)} ${pad(b, 2)} ${pad(Math.round(s.swapUsed * 1024), 6)} ${pad(Math.round(s.mem.free * 1024), 6)} ${pad(132400, 6)} ${pad(Math.round(s.cache * 1024), 6)} ${pad(Math.round(s.si * 1024 / 4), 4)} ${pad(Math.round(s.so * 1024 / 4), 5)} ${pad(Math.round(s.io.rMB * 1024), 5)} ${pad(Math.round(s.io.wMB * 1024), 5)} ${pad(3000 + Math.round(s.cpu.sy * 60), 4)} ${pad(4000 + (s.bomb?.n ?? 0) * 40, 4)} ${pad(Math.round(s.cpu.us + s.cpu.ni), 2)} ${pad(Math.round(s.cpu.sy), 2)} ${pad(Math.round(s.cpu.id), 2)} ${pad(Math.round(s.cpu.wa), 2)}  0`;
    }
    case 'iostat -x 1 2': return `$ iostat -x 1 2 | grep -E 'Device|vda'\nDevice      r/s     rkB/s   r_await     w/s     wkB/s   w_await  aqu-sz  %util\nvda     ${pad(Math.round(s.io.rMB * 8), 7)} ${pad(Math.round(s.io.rMB * 1024), 9)} ${pad(f2(s.io.await), 9)} ${pad(Math.round(s.io.wMB * 4), 7)} ${pad(Math.round(s.io.wMB * 1024), 9)} ${pad(f2(s.io.await * 1.2), 9)} ${pad(f2(Math.min(64, s.io.rho * s.io.await / 4)), 7)} ${pad(f1(s.io.util), 6)}`;
    case 'ps zombies': {
      const z = s.zomb?.n ?? 0;
      if (!z) return "$ ps -eo stat,pid,ppid,comm | grep '^Z'\n(no output — no zombies)";
      const lines = Array.from({ length: Math.min(z, 5) }, (_, k) => `Z      ${50000 + k * 3 + 1}    ${s.zomb!.ppid} worker <defunct>`);
      return `$ ps -eo stat,pid,ppid,comm | grep '^Z' | head -5\n${lines.join('\n')}\n$ ps -eo stat | grep -c '^Z'\n${z}\n# every zombie has the same PPID ${s.zomb!.ppid} → look at that parent: ps -p ${s.zomb!.ppid} -o pid,comm`;
    }
    case 'dmesg | tail': {
      const k = s.log.filter((l) => l.src === 'kernel' || l.src === 'systemd').slice(-6);
      return `$ sudo dmesg -T | tail   # + journalctl -u report\n${k.length ? k.map((l) => `[${clock(l.t)}] ${l.txt}`).join('\n') : '(nothing unusual)'}`;
    }
    case 'du -sh /var/log/*': {
      const lg = d.logFile;
      return `$ sudo du -sh /var/log/* 2>/dev/null | sort -h | tail -4\n4.0M\t/var/log/nginx\n38M\t/var/log/postgresql\n212M\t/var/log/journal\n${lg >= 1 ? `${f1(lg)}G` : `${Math.round(lg * 1024)}M`}\t/var/log/app${d.deletedOpen > 0 ? '\n# du counts only files that still have a name — the deleted-but-open file is invisible here' : ''}`;
    }
    case 'lsof +L1': {
      if (d.deletedOpen <= 0) return '$ sudo lsof +L1\n(no output — no deleted files are being held open)';
      const w = s.procs.find((p) => p.role === 'logger');
      return `$ sudo lsof +L1\nCOMMAND     PID USER   FD   TYPE DEVICE     SIZE/OFF NLINK    NODE NAME\npython3 ${pad(w?.pid ?? 4242, 6)} app    3w   REG  252,1 ${pad(Math.round(d.deletedOpen * 1073741824), 12)}     0  393231 /var/log/app/debug.log (deleted)`;
    }
    case 'pids.current': {
      const cg = '/sys/fs/cgroup/user.slice/user-1000.slice';
      return `$ cat ${cg}/pids.current ${cg}/pids.max\n${2 + (s.bomb?.n ?? 0)}\n${s.bomb ? s.bomb.max : 'max'}${s.bomb ? `\n$ grep max ${cg}/pids.events\nmax ${s.bomb.failed}` : ''}`;
    }
  }
  return '';
}

/** Tóm tắt "triệu chứng" để chấm câu trả lời chẩn đoán và để UI tô màu. */
export function symptoms(s: Sys) {
  return {
    loadPerCore: s.load[0] / s.cores,
    cpuBusy: s.cpu.us + s.cpu.sy + s.cpu.ni,
    availPct: (100 * s.mem.avail) / s.memTotal,
    swapPct: (100 * s.swapUsed) / s.swapTotal,
    diskPct: (100 * s.disk.used) / s.disk.size,
    wa: s.cpu.wa,
    tasks: tasks(s),
    zombies: s.zomb?.n ?? 0,
  };
}
