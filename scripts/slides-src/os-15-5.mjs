/**
 * os-15-5 — khoá "Operating Systems for Developers", bài 15.5 "eBPF in practice" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c155-ebpf.out.txt. Giảng: giang/os-15-5.mjs.
 */
import { lamDeck, box, cards, two, flow } from './_pg-chung.mjs';
import { META, g, num, tiny, BL, GR, RD, OR, PU } from './os-15-chung.mjs';

export const deck = { key: 'os-15-5', code: 'OS 15.5', title: 'eBPF in practice', sub: 'Operating Systems · Chapter 15' };

const F = 'c155-ebpf';
const execN = num(F, 'head -8 exec.txt', /\.\.\.(\d+) processes started/);
const conns1 = num(F, 'head -4 life1.txt', /\.\.\. (\d+) connections/);
const life2 = g(F, 'cat life2.txt').split('\n').filter((l) => /^\d+\s/.test(l)).length;
const sys = g(F, "bpftrace -q -e 'tracepoint:raw_syscalls:sys_enter");
const hey = num(F, "bpftrace -q -e 'tracepoint:raw_syscalls:sys_enter", /@\[hey\]: (\d+)/), node = num(F, "bpftrace -q -e 'tracepoint:raw_syscalls:sys_enter", /@\[node\]: (\d+)/);
const col = (h) => `<div style="display:flex;flex-direction:column;gap:6px;min-width:0">${h}</div>`;
const hist = (pre) => g(F, pre).split('\n').filter((l) => /^\[|^@|^\s+\d+ ->|^\s+msecs/.test(l)).join('\n');

export const slides = lamDeck(META('15.5'), [
  { cover: true, t: 'eBPF in practice', sub: 'Ask the kernel your question directly —<br>bpftrace one-liners and BCC-style tools' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What eBPF is: <b>verified</b> programs at kernel events, results in <b>maps</b></li>
<li>What runs in the lab — and the two container traps (whole VM, kernel PIDs)</li>
<li>Four <b>bpftrace</b> one-liners: syscalls, read sizes, fsync and block latency</li>
<li><b>execsnoop, opensnoop, runqlat, tcplife</b> on real incidents — and biolatency printing nothing</li>
<li>Which tool answers which USE question</li>
</ul>` },

  { t: 'eBPF: a small verified program at a kernel event', giua: true, body: `
${flow([
    { t: 'your program', s: 'bpftrace / libbpf', mau: BL },
    { t: 'verifier', s: 'safe? bounded?', mau: RD },
    { t: 'JIT', s: 'native code', mau: PU },
    { t: 'attach', s: 'tracepoint · kprobe · uprobe', mau: OR },
    { t: 'maps', s: 'count · hist in the kernel', mau: GR },
  ], { h: 140, fs: 18 })}
${cards([
    ['Cheap', 'aggregates inside the kernel; only a summary crosses to user space'],
    ['Portable', 'BTF + CO-RE: one binary, many kernel versions'],
    ['Powerful = root', 'needs CAP_BPF + CAP_PERFMON; in the lab: --privileged'],
  ], 3)}` },

  { t: 'In the lab: it works — with two container traps', giua: true, body: `
${tiny(g(F, 'bpftrace --version'), 17)}
${cards([
    ['✓ Kernel 7.0 has BTF', 'tracepoints, kprobes, uprobes; bpftrace 0.25 and libbpf-tools 0.35 (Ubuntu 26.04 debs) ran for real'],
    ['⚠ It sees the whole VM', 'every container on this Mac — so every command filters to our cgroup, name or port'],
    ['⚠ Kernel PIDs', 'tools print and filter the kernel’s PIDs (76427…), not the container’s (lesson 15.3)'],
  ], 3)}` },

  { t: 'bpftrace one-liner: who makes system calls?', giua: true, body: `
<div class="o info" style="font-size:22px;font-family:Menlo,monospace">probe <b>/filter/</b> { action } · @map[key] = count() · hist() · interval:s:2 { exit(); }</div>
${tiny(g(F, "bpftrace -q -e 'tracepoint:raw_syscalls:sys_enter").replace(/\n\n+/g, '\n'), 16)}
${box('Read it', `In 2 s under load: hey ${Number(hey).toLocaleString('en')}, node ${Number(node).toLocaleString('en')} system calls — about ten kernel crossings per request (lesson 11.4).`, 'lam')}` },

  { t: 'How big are the reads?', giua: true, body: two(
    col(tiny(hist("bpftrace -q -e 'tracepoint:syscalls:sys_exit_read"), 15, 'terminal', 440)),
    cards([
      ['64–127 bytes ×1 209', 'one HTTP request each'],
      ['8–15 bytes ×134', 'not HTTP: an eventfd counter is 8 bytes — libuv wakes its loop with one (likely; one more one-liner would confirm)'],
      ['0 bytes ×2', 'end of file: a client closed its connection'],
    ], 1), 'r46') },

  { t: 'fsync takes 10–20× longer than one block I/O', giua: true, body: two(
    col(`<div class="tcap">fsync latency (kprobe + kretprobe on vfs_fsync_range)</div>${tiny(hist("bpftrace -q -e 'kprobe:vfs_fsync_range"), 14, 'terminal', 520)}`),
    col(`<div class="tcap">block request latency (block_rq_issue → complete)</div>${tiny(hist("bpftrace -q -e 'tracepoint:block:block_rq_issue"), 14, 'terminal', 520)}`)) +
    box('Why', 'The device answers in 16–32 µs; an fsync waits for the data write, the ext4 journal commit and a cache flush — several requests in sequence (lesson 9.4). “The disk is fast” ≠ “durable writes are fast”.', '') },

  { t: 'biolatency -c printed nothing — while dd was writing', giua: true, body: `
${tiny(g(F, 'biolatency-libbpf -c /sys/fs/cgroup'), 16)}
${box('A silent zero', 'dd wrote 1 500 synchronous blocks; the cgroup filter matched none of them (likely: completions run in interrupt context, not in our cgroup). Always test a tool on a workload you KNOW produces events before you trust an empty result.', 'do2')}` },

  { t: `execsnoop: ${execN} processes in 2 s that top never shows`, body: tiny([
    g(F, 'top -bn1'),
    g(F, 'execsnoop-libbpf -c /sys/fs/cgroup', 2),
    g(F, "awk 'NR > 1"),
  ].join('\n'), 14) },

  { t: 'opensnoop: the config file it really looked for', giua: true, body: `
${tiny([g(F, './cfgload'), g(F, 'opensnoop-libbpf -x -n cfgload')].join('\n'), 16)}
${box('Found it', 'The team wrote <b>./config.yaml</b>; the program looks for <b>./config.yml</b>. ERR 2 = ENOENT. strace -e openat would also show it — but stops the process at every syscall.', 'xanh')}` },

  { t: 'runqlat: waiting for a CPU — 2 vs 8 threads on 2 cores', giua: true, body: two(
    col(`<div class="tcap">2 threads, 2 cores</div>${tiny(hist('taskset -c 0,1 stress-ng --cpu 2'), 15, 'terminal', 520)}`),
    col(`<div class="tcap">8 threads, 2 cores</div>${tiny(hist('taskset -c 0,1 stress-ng --cpu 8'), 15, 'terminal', 520)}`)) +
    box('CPU saturation, made visible', 'Both runs show 100% CPU in top. Only the run-queue latency shows the difference: with 8 threads many wake-ups wait 8–15 ms for their turn.', 'lam') },

  { t: `tcplife: ${conns1} connections vs ${life2}`, body: tiny([
    g(F, 'tcplife-libbpf -L 8080 > life1.txt'), g(F, 'head -4 life1.txt'),
    g(F, 'tcplife-libbpf -L 8080 > life2.txt'), g(F, 'cat life2.txt'),
  ].join('\n'), 13) + box('Keep-alive', 'Without: one connection per request, 1–4 ms each. With: 4 connections of ~310 ms. On loopback throughput was similar; across a network every new connection costs a round trip (+TLS) and leaves a TIME_WAIT socket.', 'lam') },

  { t: 'Which tool answers which USE question', giua: true, body: `
<table class="t" style="font-size:20px">
<tr><th>resource</th><th>utilization</th><th>saturation</th><th>errors</th></tr>
<tr><td>CPU</td><td>profile · execsnoop</td><td><b>runqlat</b> · runqlen*</td><td>—</td></tr>
<tr><td>disk</td><td>biolatency / block tracepoints</td><td>biolatency -Q · offcputime (io_schedule)</td><td>block errors</td></tr>
<tr><td>network</td><td><b>tcplife</b> · tcptop*</td><td>tcpsynbl*</td><td>retransmit tracing</td></tr>
<tr><td>files</td><td>opensnoop</td><td>—</td><td><b>opensnoop -x</b></td></tr>
<tr><td>locks / waiting</td><td>—</td><td><b>offcputime</b> (15.3)</td><td>—</td></tr>
</table>
<div class="cap">* same libbpf-tools package, not run in this lesson (per its documentation)</div>` },

  { t: 'Takeaways', to: true, giua: true, body: `
<ul>
<li>eBPF = <b>verified</b> programs at kernel events; aggregate in <b>maps</b></li>
<li>In containers: it sees the <b>whole machine</b> — filter; PIDs are the kernel’s</li>
<li>One-liners answer “how often / how big / how long” in seconds</li>
<li>Test a tool on a known workload before you trust an empty result</li>
<li>Trace for seconds, not all day: every event still costs</li>
</ul>` },
]);
