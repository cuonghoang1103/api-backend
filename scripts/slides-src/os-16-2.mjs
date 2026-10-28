/**
 * os-16-2 — khoá "Operating Systems for Developers", bài 16.2 "Review sheet (2/2)" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out (các chương trước) qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-16-2.mjs.
 */
import { lamDeck, sh, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-16-2', code: 'OS 16.2', title: 'Review sheet (2/2): files to security', sub: 'Operating Systems · Chapter 16 — Exams & interviews' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 16 — Exams & interviews', bai: '16.2',
}, [
  { cover: true, t: 'Review sheet (2/2):<br>files to security', sub: 'Files, I/O, system calls, containers, security — and ten numbers worth remembering' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Files</b>: inodes, fds, durability, the disk that is full but empty</li>
<li><b>I/O</b>: why epoll scales and threads do not, at 10,000 connections</li>
<li><b>System calls</b>: the price of the kernel boundary, and the vDSO</li>
<li><b>Containers</b> as processes, <b>security</b> as layers</li>
<li>The <b>ten numbers</b> to quote in any interview</li>
</ul>` },

  { t: 'write() is fast because it is not durable', giua: true, body: term(grab('c93-fsync', 'for run in 1 2 3; do ./wbench'), 15) +
    box('', 'Buffered write ≈ 1.8 µs (a memory copy). fsync ≈ 880 µs (wait for the device) — ~500× more. Databases batch fsyncs: group commit.', 'lam') },

  { t: 'The disk is "full" but du finds nothing', giua: true, body: term(grab('c24-disk', 'rm /mnt/vps/log/app.log', 3), 17) +
    box('', 'The name is gone, the inode is still open ⇒ blocks stay allocated. Find it with <code class="i">lsof +L1</code>.', 'do2') },

  { t: 'epoll stays flat while poll grows linearly', giua: true, body: term(grab('c103-epoll', 'gcc -O2 -Wall -o pollbench'), 16, 1100) },

  { t: 'Crossing the kernel boundary has a price', giua: true, body: term(grab('c114-chi-phi', 'gcc -O2 -Wall cost.c', 1, { max: 7 }), 20) +
    box('', 'Function 2.1 ns · system call 176 ns · vDSO 18.5 ns. Batch your syscalls; time queries are cheap.', 'lam') },

  { t: 'A container is a process with two identities', giua: true, body: term(grab('c121-ns', "unshare --pid --fork --mount-proc sh -c 'echo"), 18) +
    term(grab('c122-cg', "sh -c 'echo $$ > /sys/fs/cgroup/box", 2), 15) },

  { t: 'Security is layers — verify each one', giua: true, body: term(grab('c132-overflow', './retaddr-canary'), 18) + cards([
    ['Canary', 'detects the overwrite ⇒ abort, exit 134'], ['NX', 'the stack cannot execute'], ['ASLR / PIE', 'addresses move each run'],
    ['RELRO', 'GOT read-only'], ['Least privilege', 'caps, seccomp, non-root'], ['Never', '--privileged, docker.sock'],
  ], 3) },

  { t: 'Ten numbers worth remembering', giua: true, body: bang(['What', 'Measured in this course'], [
    ['function call · system call · vDSO', '2.1 ns · 176 ns · 18.5 ns'], ['context switch, one core', '~1 µs'],
    ['thread · fork + exec', '56.9 µs · 302.6 µs'], ['buffered write · fsync', '1.8 µs · ~880 µs'],
    ['epoll · poll at 10,000 fds', '0.72 µs · 676 µs'], ['10,000 idle threads', '+156 MiB kernel stacks'],
    ['256 MiB first touch', '65,539 page faults'], ['counter++ in 2 threads', '44 % updates lost'],
    ['SIGKILL / SIGTERM / SIGSEGV', 'exit 137 / 143 / 139'], ['Little’s law, 64 clients at 347/s', '≈ 184 ms predicted, 182 ms measured'],
  ], 19) },

  { t: 'Exam traps for the second half', to: true, giua: true, body: `
<ul>
<li>Inode questions: blocks via direct + single/double/triple indirect pointers</li>
<li>A hard link cannot cross file systems; a symlink can — and can dangle</li>
<li>Programmed I/O busy-waits; interrupts and DMA free the CPU</li>
<li>Disk arm: FCFS · SSTF · SCAN · C-SCAN · LOOK — drilled in 16.5</li>
<li>"Containers are lightweight VMs" — no: one shared kernel</li>
</ul>` },

  { t: 'Pitfall: learning security as an attack recipe', giua: true, to: true, body: vsd(
    'Memorise exploit steps; answer "is ASLR enough?" with "yes".',
    'Explain which step each mitigation blocks, and how you <b>verified</b> it is on: "the canary aborted with exit 134".') },

  { t: 'Practice: fill the ten numbers from memory', giua: true, to: true, body: `
<ol>
<li>Cover the measured column and fill it in</li>
<li>One production symptom per mechanism (df full, du small ⇒ ?)</li>
<li>Rerun <code class="i">./pollbench epoll 10000</code> and <code class="i">./wbench</code></li>
<li>"What is a container?" in three lines</li>
</ol>` + box('Done when', 'eight of ten numbers within 2×, every symptom names its mechanism.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>write() is not durable until fsync; deleted-but-open files fill disks</li>
<li>epoll: 0.72 µs at 10,000 fds; poll: 676 µs</li>
<li>A syscall ≈ 176 ns; the vDSO avoids the trap for time</li>
<li>Container = namespaces (view) + cgroup (budget) on one kernel</li>
<li>Security = layers you can verify, plus least privilege</li>
</ul>` },
]);
