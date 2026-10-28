/**
 * os-03-4 — khoá "Operating Systems for Developers", bài 3.4 "Multicore, affinity, CPU limits" (28/10/2026).
 * Khuôn _pg-chung.mjs. Số liệu = CHẠY THẬT (lab/out/c34-loi, c34-quota, c34-cpuset .out.txt; dòng "--cpus 4" đo
 * cùng lat.c khi kiểm bài thực hành). Giảng: giang/os-03-4.mjs.
 */
import { lamDeck, sh, two as two0, box, cards, vsd } from './_pg-chung.mjs';

export const deck = { key: 'os-03-4', code: 'OS 3.4', title: 'Multicore, affinity and CPU limits', sub: 'Operating Systems · Chapter 3' };

const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', GY = '#8a8a8a', RD = '#c0392b';

/* Slide 3: ba con số "số CPU" */
const ba = () => {
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">`;
  const cols = [[20, '1 · machine CPUs', 'os.cpus().length · os.cpu_count()', BL], [390, '2 · CPUs you may run on', 'affinity · cpuset · nproc', GR], [760, '3 · CPU time you may use', 'quota: cpu.max · --cpus', RD]];
  cols.forEach(([x, t, sub, m], i) => {
    s += R(x, 10, 330, 230, m + '10', m);
    s += T(x + 165, 42, t, 21, { a: 'middle', w: 800, f: m });
    s += T(x + 165, 226, sub, 15, { a: 'middle', f: '#555' });
    if (i < 2) {
      for (let k = 0; k < 10; k++) {
        const cx = x + 30 + (k % 5) * 56, cy = 66 + Math.floor(k / 5) * 66, on = i === 0 || k < 2;
        s += R(cx, cy, 46, 50, on ? m + '33' : '#f4f4f4', on ? m : '#cfcfcf', { rx: 6, sw: 2 });
        s += T(cx + 23, cy + 32, String(k), 17, { a: 'middle', w: 700, f: on ? m : '#bbb' });
      }
    } else {
      s += T(x + 165, 86, 'every 100 ms period:', 17, { a: 'middle', f: '#444' });
      s += R(x + 25, 104, 280, 40, '#f4f4f4', '#cfcfcf', { rx: 6, sw: 2 });
      s += R(x + 25, 104, 280, 40, m + '33', m, { rx: 6, sw: 2 });
      s += T(x + 165, 131, '150 ms of CPU, any cores', 17, { a: 'middle', w: 700, f: m });
      s += T(x + 165, 180, 'nothing is hidden —', 17, { a: 'middle', f: '#444' });
      s += T(x + 165, 202, 'you are just stopped', 17, { a: 'middle', f: '#444' });
    }
  });
  return s + '</svg>';
};

/* Slide 11: dòng thời gian throttling — 4 luồng bận, quota 150 ms / 100 ms */
const throttle = () => {
  let s = `<svg viewBox="0 0 1110 290" width="1110" height="290" font-family="Arial">`;
  const x0 = 150, pw = 300; // 100 ms = 300 px
  ['thread 1', 'thread 2', 'thread 3', 'request'].forEach((n, r) => {
    const y = 20 + r * 52;
    s += T(x0 - 12, y + 29, n, 18, { a: 'end', w: 700, f: r === 3 ? RD : '#333' });
    for (let p = 0; p < 3; p++) {
      const x = x0 + p * pw, run = pw * 0.375;
      s += R(x, y + 4, run, 38, (r === 3 ? RD : BL) + '44', r === 3 ? RD : BL, { rx: 3, sw: 1.5 });
      s += R(x + run, y + 4, pw - run, 38, '#eeeeee', '#bdbdbd', { rx: 3, sw: 1.5, dash: 1 });
    }
  });
  for (let p = 0; p <= 3; p++) {
    s += `<line x1="${x0 + p * pw}" y1="10" x2="${x0 + p * pw}" y2="232" stroke="#555" stroke-width="2"/>`;
    s += T(x0 + p * pw, 254, `${p * 100} ms`, 16, { a: 'middle', f: '#555' });
  }
  s += T(x0 + pw * 0.19, 282, 'run ≈ 37 ms', 16, { a: 'middle', w: 700, f: BL });
  s += T(x0 + pw * 0.69, 282, 'throttled ≈ 63 ms', 16, { a: 'middle', w: 700, f: GY });
  s += T(x0 + pw * 1.5, 282, '4 threads × 37 ms ≈ the 150 ms quota', 16, { a: 'middle', w: 700, f: '#555' });
  return s + '</svg>';
};

/* Slide 12: p99 độ trễ request 2 ms CPU */
const latBars = () => {
  const rows = [['--cpus 1.5, no background job', 2.4, BL], ['--cpus 1.5, 3 background threads', 60.4, RD], ['--cpus 4, 3 background threads', 2.4, GR]];
  let s = `<svg viewBox="0 0 1110 210" width="1110" height="210" font-family="Arial">`;
  rows.forEach(([lab, v, m], i) => {
    const y = 6 + i * 68, w = Math.max(6, Math.round(v / 61 * 520));
    s += T(400, y + 38, lab, 20, { a: 'end', w: 700 });
    s += R(414, y + 12, w, 42, m + '33', m, { rx: 4, sw: 2 });
    s += T(426 + w, y + 40, `p99 ${v} ms`, 20, { w: 800, f: m });
  });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 3 — Threads & scheduling', bai: '3.4',
}, [
  { cover: true, t: 'How many cores do I have?', sub: 'Multicore, affinity, NUMA — and CPU limits in containers,<br>where Node, Java and Python give three different answers' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>three</b> numbers people call “the number of CPUs”</li>
<li>Parallel speedup, <b>affinity</b> and <b>migrations</b> — measured with taskset and perf</li>
<li>What <b>NUMA</b> is, and why there is nothing to measure on a small VM</li>
<li>Container <b>cpuset</b> vs CPU <b>quota</b>: what nproc, Node, Java and Python report</li>
<li><b>Throttling</b>: how a quota turned a 2.4 ms p99 into 60.4 ms</li>
</ul>` },

  { t: '“Number of CPUs” means three different things', giua: true, body: `
${ba()}
${box('Why it matters', 'Thread pools, cluster workers, GC threads and parallel streams size themselves from “the number of CPUs”. If a runtime reads number 1 while you are limited by number 3, it starts far too many busy threads.', 'lam')}` },

  { t: 'The machine’s CPUs, and the ones you may use', giua: true, body: two(
    sh(`$ nproc; taskset -p $$
10
pid 8's current affinity mask: 3ff
$ lscpu | grep -E '^(CPU\\(s\\)|On-line|Core|Thread|NUMA)'
CPU(s):              10
On-line CPU(s) list: 0-9
Thread(s) per core:  1
Core(s) per cluster: 10
$ taskset -c 0 nproc
1`),
    `<ul style="font-size:22px">
<li>Mask <code class="i">3ff</code> = ten 1-bits: CPUs 0–9 allowed</li>
<li>One hardware thread per core (no hyper-threading here)</li>
<li>No <b>NUMA</b> line: one memory node</li>
<li><code class="i">taskset</code> narrows the mask — and <code class="i">nproc</code> follows it</li>
</ul>`, 'r64') },

  { t: 'Parallel speedup, measured', to: true, giua: true, body: `
<table class="t" style="font-size:24px">
<tr><th>crowd.c, 4 threads of CPU work</th><th>Wall time</th><th>Speedup</th></tr>
<tr><td><code class="i">taskset -c 0</code> — one core</td><td>889 ms</td><td>1×</td></tr>
<tr><td><code class="i">taskset -c 0-3</code> — four cores</td><td><b class="xanh">232 ms</b></td><td><b class="xanh">3.8×</b></td></tr>
<tr><td>no pinning — ten cores free</td><td>230 ms</td><td>3.9×</td></tr>
</table>
${box('Read it', 'Four threads can use at most four cores, so ten free cores do not beat four. Threads run in parallel only when there are free cores to put them on.', 'xanh')}` },

  { t: 'Where does a thread run? psr and re-pinning', giua: true, body: two(
    sh(`# a lone hog, sampled 5 times
$ for i in 1 2 3 4 5; do ps -o psr= -p $!; ...; done
  7   7   7   7   7

$ taskset -c 5 ./hog y > /dev/null &
$ ps -o pid,psr,comm -p $!
    PID PSR COMMAND
     71   5 hog
$ taskset -p $!
pid 71's current affinity mask: 20
$ taskset -p -c 7 $!; ps -o pid,psr,comm -p $!
    PID PSR COMMAND
     71   7 hog`),
    `<ul style="font-size:22px">
<li>The scheduler keeps a thread on the core it last used — its data is still in that cache</li>
<li>Mask <code class="i">20</code> hex = bit 5 = CPU 5</li>
<li><code class="i">taskset -p -c 7</code> moves a <b>running</b> process</li>
</ul>`, 'r64') + box('Pinning is for isolation', 'Keep a noisy job off the cores that serve requests, or keep a latency-critical thread on a warm cache. It is not a free speedup.', 'lam') },

  { t: 'Migrations: free vs pinned', giua: true, body: two(
    sh(`$ perf stat -e cpu-migrations,context-switches \\
    ./crowd 64 cpu
cpu  threads=64       131 ms
                18      cpu-migrations
               398      context-switches
$ perf stat -e cpu-migrations,context-switches \\
    taskset -c 0-3 ./crowd 64 cpu
cpu  threads=64       237 ms
                52      cpu-migrations
               276      context-switches`),
    `<ul style="font-size:22px">
<li>Free: 64 threads spread over <b>ten</b> cores: 131 ms</li>
<li>Pinned to four: 237 ms, and <b>more</b> migrations (52) as the scheduler balances four busy run queues</li>
<li>Each migration leaves the thread’s cached data behind</li>
</ul>`, 'r64') },

  { t: 'NUMA: when memory is not one place', to: true, giua: true, body: `
<ul>
<li>Servers with <b>2+ CPU sockets</b>: each socket has its own RAM</li>
<li>Reading memory attached to the <b>other</b> socket is noticeably slower</li>
<li>There <code class="i">lscpu</code> shows <code class="i">NUMA node(s): 2</code>; <code class="i">numactl</code> pins threads and memory to one node</li>
<li>Our lab VM has <b>one</b> memory node — nothing to measure here, like most small cloud VMs</li>
</ul>
${box('Remember the word', 'You will meet it on a 2-socket database server: a query that is fast on one node and slow on the other is often NUMA.', 'lam')}` },

  { t: 'Container limit #1: cpuset — fewer CPUs, visibly', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th>docker run --cpuset-cpus 0,1</th><th>Reports</th></tr>
<tr><td><code class="i">cpuset.cpus.effective</code></td><td>0-1</td></tr>
<tr><td><code class="i">nproc</code></td><td><b class="xanh">2</b></td></tr>
<tr><td>Node <code class="i">os.availableParallelism()</code> · <code class="i">os.cpus().length</code></td><td><b class="xanh">2</b> · <b class="do">10</b></td></tr>
<tr><td>Java <code class="i">availableProcessors()</code> · ForkJoin parallelism</td><td><b class="xanh">2</b> · 1</td></tr>
<tr><td>Python <code class="i">os.process_cpu_count()</code> · <code class="i">os.cpu_count()</code></td><td><b class="xanh">2</b> · <b class="do">10</b></td></tr>
</table>
${box('Read it', 'A cpuset changes affinity, so almost everyone sees it. Only the calls that list the machine’s CPUs still say 10.', 'xanh')}` },

  { t: 'Container limit #2: CPU quota — invisible', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th>docker run --cpus 1.5</th><th>Reports</th></tr>
<tr><td><code class="i">/sys/fs/cgroup/cpu.max</code></td><td>150000 100000 &nbsp;(150 ms per 100 ms)</td></tr>
<tr><td><code class="i">nproc</code></td><td>2 (rounds up)</td></tr>
<tr><td>Node <code class="i">os.availableParallelism()</code> · <code class="i">os.cpus().length</code></td><td><b class="do">1</b> (rounds down) · <b class="do">10</b></td></tr>
<tr><td>Java <code class="i">availableProcessors()</code> · ForkJoin parallelism</td><td>2 · 1</td></tr>
<tr><td>Python <code class="i">os.process_cpu_count()</code> · <code class="i">os.cpu_count()</code></td><td><b class="do">10</b> · <b class="do">10</b> (ignores quota)</td></tr>
</table>
${box('Read it', 'Nothing is hidden, so everyone answers differently. Size a cluster from os.cpus().length and you start 10 busy workers on 1.5 CPUs.', 'do2')}` },

  { t: 'Throttling: the quota is spent, everyone stops', giua: true, body: `
${throttle()}
<p style="margin:0;font-size:20px;text-align:center">Measured with <code class="i">cpu.stat</code>: a 4-thread job ran <b>user 0.903 s in real 0.576 s</b> (1.57 CPUs), 10 of 14 periods throttled. Even JVM startup was throttled in 4 of the first 8.</p>` },

  { t: 'What throttling does to latency', giua: true, body: `
${latBars()}
${box('lat.c: 300 requests of 2 ms CPU', 'Median stayed 2.0 ms in every case. The p99 jumps to 60.4 ms (max 63.3) when background threads burn the quota early in each period — and disappears with --cpus 4. CPU-usage averages look fine the whole time.', 'do2')}` },

  { t: '“CPU is at 40% but p99 is terrible”', to: true, giua: true, body: `
${vsd(`<ul><li>Look at the CPU graph, see 40%, blame the database</li><li>Size pools from <code class="i">os.cpus().length</code></li></ul>`,
    `<ul><li>Read <code class="i">cpu.stat</code>: <b>nr_throttled</b> growing = quota throttling</li><li>Size pools to the quota: <code class="i">os.availableParallelism()</code>, JVM reads it itself</li><li>Move CPU-heavy side jobs out; raise the quota; or use <code class="i">cpu.weight</code> / <code class="i">--cpu-shares</code></li></ul>`, '✗ Reflex', '✓ Diagnose and fix')}` },

  { t: 'Cheat sheet — cores and limits', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:42%">You want to…</th><th>Run</th></tr>
<tr><td>See / set affinity</td><td><code class="i">taskset -p PID</code> · <code class="i">taskset -c 0-3 CMD</code></td></tr>
<tr><td>Which core a thread is on</td><td><code class="i">ps -L -o lwp,psr,comm -p PID</code></td></tr>
<tr><td>Container quota</td><td><code class="i">cat /sys/fs/cgroup/cpu.max</code></td></tr>
<tr><td>Is it throttled?</td><td><code class="i">grep throttled /sys/fs/cgroup/cpu.stat</code></td></tr>
<tr><td>Cores for a Node pool</td><td><code class="i">os.availableParallelism()</code></td></tr>
</table>
${box('Rule of thumb', 'Size every pool from the quota, not the host. If p99 is bad and the average is fine, read cpu.stat before anything else.', 'xanh')}` },
]);
