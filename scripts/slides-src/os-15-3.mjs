/**
 * os-15-3 — khoá "Operating Systems for Developers", bài 15.3 "Off-CPU time" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c153-offcpu.out.txt; flame graph = SVG thật lab/code/ch15/fg/wait-*.svg.
 * Giảng: giang/os-15-3.mjs.
 */
import { lamDeck, box, cards } from './_pg-chung.mjs';
import { META, g, num, tiny, code, fg, bars, svg, T, R, A, SRC, dong, noCmt, BL, GR, RD, OR, GY } from './os-15-chung.mjs';

export const deck = { key: 'os-15-3', code: 'OS 15.3', title: 'Off-CPU time', sub: 'Operating Systems · Chapter 15' };

const F = 'c153-offcpu';
const wallIn = +num(F, 'time ./wait inside', /wall (\d+) ms/), cpuIn = +num(F, 'time ./wait inside', /CPU (\d+) ms/), coresIn = num(F, 'time ./wait inside', /\(([\d.]+) cores/);
const wallOut = +num(F, 'time ./wait outside', /wall (\d+) ms/), coresOut = num(F, 'time ./wait outside', /\(([\d.]+) cores/);
const onPct = num(F, 'profile-libbpf', /price_order\s+([\d.]+)%/);
const fut = num(F, 'python3 offcpu2folded.py', /futex_do_wait\s+([\d.]+)%/), nano = num(F, 'python3 offcpu2folded.py', /do_nanosleep\s+([\d.]+)%/);
const offTot = (+num(F, 'python3 offcpu2folded.py', /^(\d+) us off-CPU/m) / 1e6).toFixed(1);
const lockPct = num(F, 'python3 pmp.py', /\d+\s+([\d.]+)%\s+futex_wait/);

/* 8 luồng × thời gian thật: phần trên CPU (xanh) và ngoài CPU (xám) — tổng thời gian-luồng */
const threadTime = () => {
  const W = 1060, L = 20, bw = W - 40, total = 8 * wallIn;
  const on = Math.round(bw * cpuIn / total);
  let s = T(L, 18, `thread time available: 8 threads × ${wallIn} ms = ${total.toLocaleString('en')} thread-ms`, 17, { w: 700 });
  s += R(L, 30, bw, 40, '#dddddd', '#bbbbbb', { rx: 4 }) + R(L, 30, on, 40, GR + 'aa', GR, { rx: 4 });
  s += T(L + on + 10, 56, `on CPU: ${cpuIn} ms`, 17, { w: 700, f: GR }) + T(L + bw - 12, 56, `off CPU: ${(total - cpuIn).toLocaleString('en')} thread-ms`, 17, { a: 'end', w: 700, f: '#555' });
  return svg(W, 80, s);
};

/* offcputime: đồng hồ bật lúc rời CPU, tắt lúc quay lại */
const howOff = () => {
  let s = '';
  s += R(20, 40, 300, 40, GR + '55', GR) + T(170, 66, 'running (on CPU)', 17, { a: 'middle', w: 700 });
  s += R(320, 40, 420, 40, '#dddddd', '#999999') + T(530, 66, 'switched out: waiting', 17, { a: 'middle', w: 700, f: '#555' });
  s += R(740, 40, 300, 40, GR + '55', GR) + T(890, 66, 'running again', 17, { a: 'middle', w: 700 });
  s += `<line x1="320" y1="20" x2="320" y2="130" stroke="${RD}" stroke-width="3"/><line x1="740" y1="20" x2="740" y2="130" stroke="${RD}" stroke-width="3"/>`;
  s += T(320, 152, 'sched_switch OUT: note time + stack', 15, { a: 'middle', f: RD, w: 700 }) + T(740, 152, 'sched_switch IN: add Δt to that stack', 15, { a: 'middle', f: RD, w: 700 });
  s += A(330, 110, 728, 110, BL) + T(530, 104, 'Δt = off-CPU time', 16, { a: 'middle', w: 700, f: BL });
  return svg(1060, 165, s);
};

export const slides = lamDeck(META('15.3'), [
  { cover: true, t: 'Off-CPU time', sub: 'Where the waiting goes —<br>and why a CPU profiler cannot see it' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Wall time = on-CPU + off-CPU</b> — and how to tell which one hurts</li>
<li>Why a correct CPU profile can point at the wrong place</li>
<li><b>offcputime</b> (eBPF): measure waiting, with stacks — and the container PID trap</li>
<li>The <b>poor man’s profiler</b>: gdb snapshots of every thread</li>
<li>Fix, re-measure, and a table of what each off-CPU stack means</li>
</ul>` },

  { t: 'The program: compute, then write while holding a lock', body: `
${code(noCmt(dong(SRC('wait.c'), 19, 34)), 'c', 15)}
${box('Eight threads, 150 orders each', '<b>price_order</b> ≈ 0.5 ms of real CPU work; <b>write_audit</b> sleeps 1 ms (a stand-in for fsync or a network call) — <b>while the audit_lock is held</b>.', '')}` },

  { t: `Slow, but not busy: ${wallIn} ms wall, ${cpuIn} ms CPU`, giua: true, body: `
${tiny(g(F, 'time ./wait inside'), 17)}
${threadTime()}
${box('The gap is off-CPU time', `Eight threads could keep eight cores busy; on average only ${coresIn} were. Something makes them wait.`, 'lam')}` },

  { t: `The CPU profile: price_order ${onPct}% — true and useless`, giua: true, body: `
${tiny(g(F, 'profile-libbpf'), 15)}
${box('Why useless', 'Even if price_order cost nothing, the run would still take ≥ 1 200 ms: 8 threads × 150 writes × 1 ms, one at a time under the lock. A CPU profiler samples only running threads.', 'do2')}` },

  { t: 'pidstat -w: every thread waits ~175 times per second', giua: true, body: `
${tiny(g(F, './wait inside 300'), 17)}
${cards([
    ['cswch/s — voluntary', 'the thread chose to give up the CPU: “I will wait for something” → off-CPU time'],
    ['nvcswch/s — involuntary', 'the scheduler took the CPU away → waiting for a CPU (run queue, lesson 15.5)'],
  ], 2)}` },

  { t: 'offcputime: a stopwatch on every context switch', giua: true, body: `
${howOff()}
${box('Kernel PIDs', 'eBPF runs in the kernel and filters by the kernel’s PID; inside the container the same process has another number. Translate first (one bpftrace line, lesson 15.5).', 'lam')}
${tiny(g(F, 'G=$(bpftrace').split('\n').slice(-1).join('\n'), 16)}` },

  { t: `The waiting: ${fut}% in a futex — a lock`, body: tiny([
    g(F, 'offcputime-libbpf -p $G 3').split('\n').slice(0, 16).join('\n'),
    g(F, 'python3 offcpu2folded.py'),
  ].join('\n'), 13) },

  { t: 'Off-CPU flame graph of wait.c', body: `${fg('wait-off', { h: 300 })}
${box('Two towers', `futex (waiting for audit_lock) ${fut}% · nanosleep (the audit write itself) ${nano}%. ${offTot} s of off-CPU time collected in 3 s of wall time — 8 threads waiting most of the time.`, 'lam')}
${cards([['On-CPU profile said', `price_order ${onPct}% — where the CPU goes`], ['Off-CPU profile says', `the lock ${fut}% — where the <b>time</b> goes`]], 2)}` },

  { t: 'Which lock? gdb snapshots of every thread', giua: true, body: `
${tiny(g(F, 'python3 pmp.py'), 16)}
${cards([
    [`${lockPct}% — waiting for the lock`, 'pthread_mutex_lock ← worker: line 28, audit_lock'],
    ['11% — holding it, asleep', 'usleep ← write_audit: the one thread that has the lock'],
    ['Cost', 'each snapshot stops the process for tens of ms — use sparingly; async-profiler -e wall for Java'],
  ], 3)}` },

  { t: `Fix: write outside the lock — ${wallIn} → ${wallOut} ms`, giua: true, body: `
${bars([
    ['audit inside the lock', wallIn, RD, `${wallIn} ms · ${coresIn} cores busy`],
    ['audit outside the lock', wallOut, GR, `${wallOut} ms · ${coresOut} cores busy`],
  ], { label: 270, rowH: 52, max: wallIn * 1.45 })}
${tiny(g(F, "G=$(bpftrace -q -e 'tracepoint:syscalls:sys_enter_futex /comm == \"wait\"/ { printf(\"%d\\n\", curtask->tgid); exit(); }'); offcputime").split('\n').slice(1, 4).join('\n'), 15)}
${box('Still waiting — but in parallel', 'off-CPU is now 100% nanosleep: the I/O itself, eight threads at once. Waiting on I/O is often fine; waiting on a lock is usually a bug.', 'xanh')}` },

  { t: 'Read the leaf: what each off-CPU stack means', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th>kernel frame near the leaf</th><th>waiting for…</th><th>look next at</th></tr>
<tr><td>futex_wait · futex_do_wait</td><td>a lock / condition variable</td><td>which lock: gdb/pmp, async-profiler -e lock</td></tr>
<tr><td>do_nanosleep</td><td>a sleep the program asked for</td><td>why it sleeps (polling? backoff?)</td></tr>
<tr><td>io_schedule · folio_wait_* · jbd2_log_wait_commit</td><td>the disk: writeback, fsync, journal</td><td>biolatency, iostat — lesson 15.8</td></tr>
<tr><td>sk_wait_data · ep_poll</td><td>the network — or simply idle</td><td>the peer’s latency</td></tr>
<tr><td>exit_to_user_mode_loop (preempted)</td><td>a CPU (runnable, not running)</td><td>runqlat — lesson 15.5</td></tr>
</table>` },

  { t: 'Takeaways', to: true, giua: true, body: `
<ul>
<li>Compare <b>CPU time with wall time</b> before you trust a CPU profile</li>
<li>Voluntary context switches = waiting; <b>offcputime</b> says for what</li>
<li>Inside containers, eBPF needs the <b>kernel’s PID</b></li>
<li>gdb snapshots (pmp) name the exact line that waits</li>
<li>${wallIn} → ${wallOut} ms by moving one write out of a lock</li>
</ul>` },
]);
