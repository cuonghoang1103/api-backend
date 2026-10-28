/**
 * cgroup v2 theo dòng thời gian.
 *  - Bộ nhớ (mỗi bước 100 ms): memory.current = anon + file (page cache). Vượt memory.high ⇒ kernel thu hồi cache rồi
 *    BẮT TIẾN TRÌNH NGỦ khi nó xin thêm (throttle, memory.events high++); chạm memory.max ⇒ thu hồi gấp, đẩy ra swap nếu
 *    memory.swap.max cho phép, không được nữa ⇒ OOM killer trong cgroup (oom_kill++), tiến trình chết với SIGKILL ⇒ 137.
 *  - CPU (mỗi bước 1 ms): cpu.max = "quota period". Hết quota trong một chu kỳ ⇒ cả cgroup bị đứng (throttled) tới đầu
 *    chu kỳ sau, dù máy còn lõi trống. cpu.stat: nr_periods, nr_throttled, throttled_usec.
 */
export interface MemCfg { max: number; high: number; swapMax: number; base: number; leak: number; cacheRate: number; restart: boolean; duration: number }
export interface MemPt {
  t: number; anon: number; file: number; swap: number; current: number; psi: number; alive: boolean;
  high: number; maxEv: number; oom: number; oomKill: number; note?: { en: string; vi: string; tone: 'ok' | 'warn' | 'bad' };
}
const CACHE_MIN = 8;

export function memTimeline(c: MemCfg): MemPt[] {
  const dt = 0.1;
  let anon = c.base, file = 0, swap = 0, alive = true, deadUntil = -1;
  let high = 0, maxEv = 0, oom = 0, oomKill = 0;
  let wasOver = false;
  const out: MemPt[] = [];
  for (let k = 0; k <= c.duration * 10; k++) {
    const t = +(k * dt).toFixed(1);
    let note: MemPt['note'];
    let psi = 0;
    if (!alive && t >= deadUntil && c.restart) { alive = true; anon = c.base; note = { en: 'Container restarted (restart policy) — and the leak starts over.', vi: 'Container được chạy lại (restart policy) — và lại rò từ đầu.', tone: 'warn' }; }
    if (alive && k > 0) {
      // 1) muốn xin thêm
      let want = c.leak * dt;
      const cur0 = anon + file;
      if (cur0 > c.high) {
        // vượt high: thu hồi cache trước, rồi ngủ phạt — càng vượt sâu càng ngủ lâu
        const drop = Math.min(file - CACHE_MIN, cur0 - c.high);
        if (drop > 0) file -= drop;
        const over = Math.max(0, anon + file - c.high) / Math.max(1, c.max - c.high);
        const f = 1 / (1 + 25 * over * over);
        want *= f; psi = 1 - f;
        high++;
        if (!wasOver) note = { en: 'memory.high crossed: the kernel reclaims page cache and starts putting the process to sleep on every allocation (throttling). It slows down — it is not killed.', vi: 'Vượt memory.high: kernel thu hồi page cache và bắt tiến trình ngủ mỗi lần xin bộ nhớ (throttle). Nó chậm lại — chưa bị giết.', tone: 'warn' };
        wasOver = true;
      } else wasOver = false;
      anon += want;
      file += c.cacheRate * dt;
      // 2) chạm max
      let cur = anon + file;
      if (cur > c.max) {
        maxEv++;
        const drop = Math.min(cur - c.max, Math.max(0, file - CACHE_MIN));
        file -= drop; cur -= drop; psi = Math.max(psi, drop > 0 && c.leak === 0 ? 0.05 : 0.3);
        if (cur > c.max) {
          const room = c.swapMax - swap, out2 = Math.min(cur - c.max, room);
          anon -= out2; swap += out2; cur -= out2;
          if (out2 > 0) { psi = Math.max(psi, 0.7); if (!note) note = { en: 'At memory.max: pages are pushed out to swap (memory.swap.max allows it). Everything gets slow.', vi: 'Chạm memory.max: trang bị đẩy ra swap (memory.swap.max cho phép). Mọi thứ chậm hẳn.', tone: 'warn' }; }
        }
        if (cur > c.max + 1e-9) {
          oom++; oomKill++; alive = false; deadUntil = t + 1; anon = 0; swap = 0; psi = 1;
          note = { en: 'Nothing left to reclaim → the OOM killer kills the process INSIDE this cgroup (memory.events oom_kill++). SIGKILL = signal 9 ⇒ exit code 128 + 9 = 137. The rest of the machine is untouched.', vi: 'Không còn gì để thu hồi → OOM killer giết tiến trình BÊN TRONG cgroup này (memory.events oom_kill++). SIGKILL = tín hiệu 9 ⇒ mã thoát 128 + 9 = 137. Phần còn lại của máy không hề hấn gì.', tone: 'bad' };
        } else if (!note && c.leak === 0 && maxEv === 1) note = { en: 'memory.current reached memory.max — but it is page cache. The kernel simply drops old cache pages to make room. No OOM: "my container uses 100% of its memory" is often just cache.', vi: 'memory.current chạm memory.max — nhưng đó là page cache. Kernel chỉ việc bỏ các trang cache cũ để lấy chỗ. Không OOM: "container của tôi dùng 100% bộ nhớ" thường chỉ là cache.', tone: 'ok' };
      }
    } else if (!alive) { file = Math.max(CACHE_MIN, file); }
    out.push({ t, anon, file, swap, current: anon + file, psi, alive, high, maxEv, oom, oomKill, note });
  }
  return out;
}

export interface CpuCfg { quota: number; period: number; cores: number; threads: number; work: number }
export interface CpuRes { run: number[]; throttled: boolean[]; done: number[]; nrPeriods: number; nrThrottled: number; throttledMs: number; end: number }
/** Mỗi luồng cần `work` ms CPU; cgroup được `quota` ms CPU mỗi `period` ms (cộng trên mọi lõi). */
export function cpuQuota(c: CpuCfg, maxMs = 3000): CpuRes {
  const left = Array(c.threads).fill(c.work);
  const done = Array(c.threads).fill(-1);
  const run: number[] = [], thr: boolean[] = [];
  let used = 0, nrPeriods = 0, nrThrottled = 0, throttledMs = 0, throttledThisPeriod = false;
  let t = 0;
  for (; t < maxMs; t++) {
    if (t % c.period === 0) { used = 0; throttledThisPeriod = false; if (left.some((x) => x > 0)) nrPeriods++; }
    const active = left.map((x, i) => (x > 0 ? i : -1)).filter((i) => i >= 0);
    if (!active.length) break;
    const budget = Number.isFinite(c.quota) ? c.quota - used : Infinity;
    if (budget <= 1e-9) {
      run.push(0); thr.push(true); throttledMs++;
      if (!throttledThisPeriod) { nrThrottled++; throttledThisPeriod = true; }
      continue;
    }
    const n = Math.min(active.length, c.cores);
    const per = Math.min(1, budget / n);
    const pick = active.length > n ? [...active.slice(t % active.length), ...active.slice(0, t % active.length)].slice(0, n) : active;
    for (const i of pick) { left[i] -= per; if (left[i] <= 1e-9 && done[i] < 0) { left[i] = 0; done[i] = t + per; } }
    used += per * n;
    run.push(per * n); thr.push(false);
  }
  return { run, throttled: thr, done, nrPeriods, nrThrottled, throttledMs, end: Math.max(...done) };
}
