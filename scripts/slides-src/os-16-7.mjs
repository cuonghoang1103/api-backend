/**
 * os-16-7 — khoá "Operating Systems for Developers", bài 16.7 "Interview track (2/2)" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out (các chương trước + c173-chan-doan) qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-16-7.mjs.
 */
import { lamDeck, sh, box, cards, vsd, flow, steps } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-16-7', code: 'OS 16.7', title: 'Interview track (2/2): files to incidents', sub: 'Operating Systems · Chapter 16 — Exams & interviews' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.4">`);
const qa = (q, a) => box(q, a, 'lam');
const D = (pre, n = 1) => grab('c173-chan-doan', pre, n, { drop: /^# / });

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 16 — Exams & interviews', bai: '16.7',
}, [
  { cover: true, t: 'Interview track (2/2):<br>files to incidents', sub: 'Twenty more questions — from "type a URL" to "tell me about an incident"' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The open question: <b>what happens when you type a URL</b>, OS view</li>
<li>Files, fds, durability, epoll, C10K, hung processes, syscalls</li>
<li>Containers: what they are, how they break, how they are limited</li>
<li>Security: seccomp, overflows, setuid, capabilities</li>
<li>Shutdown on SIGTERM — and your own <b>incident story</b></li>
</ul>` },

  { t: 'Q21 — type a URL and press Enter', giua: true, body: flow([
    { t: 'DNS', s: 'socket · sendto', mau: '#336791' }, { t: 'connect', s: 'TCP handshake', mau: '#336791' },
    { t: 'accept queue', s: 'listen backlog', mau: '#e08a1e' }, { t: 'epoll loop', s: 'ready fds only', mau: '#e08a1e' },
    { t: 'read file / DB', s: 'page cache · socket', mau: '#2f7d4f' }, { t: 'one write', s: 'TCP stack', mau: '#2f7d4f' },
  ], { fs: 18 }) + qa('Model answer', 'Name the mechanisms in order — and where each can stall: DNS, a full accept queue, a blocked loop, slow disk, an exhausted pool.') },

  { t: 'Q22 — "Too many open files"', giua: true, body: term(D('docker logs --tail 2 os-17-report', 2), 16) +
    qa('Model answer', 'EMFILE = the process hit RLIMIT_NOFILE. 236 of 255 fds were one template: a leak, not a low limit. Close on every path.') },

  { t: 'Q24–Q25 — durability, and a full disk that looks empty', giua: true, to: true, body: cards([
    ['write()', 'reaches the page cache in ~1.8 µs'], ['fsync()', 'waits for the device: ~880 µs'],
    ['group commit', 'many writers, one flush: 0.7 ms per audit event'], ['df 100 %, du small', 'a deleted file still open: lsof +L1'],
  ], 2) },

  { t: 'Q26–Q27 — epoll vs threads at 10,000 connections', giua: true, body: term(grab('c104-c10k', './c10k.sh echo-thread 10000 1000', 2, { max: 13 }), 15) },

  { t: 'Q29 — a process is hung: what is it waiting for?', giua: true, to: true, body: steps([
    '<code class="i">ps -o stat,wchan</code> — S or D? which kernel function?',
    '<code class="i">/proc/PID/stack</code>, <code class="i">/proc/PID/syscall</code>, <code class="i">ls -l /proc/PID/fd</code>',
    '<code class="i">strace -p</code> live · thread dump: <code class="i">jstack</code>, <code class="i">gdb</code>',
    'No ptrace in the container? A debug container: <code class="i">--pid=container:X --cap-add SYS_PTRACE</code>',
  ]) },

  { t: 'Q31–Q32 — what a container is, and is not', giua: true, to: true, body: cards([
    ['Namespaces', 'what it can see: pid, mnt, net, uts, ipc, user, cgroup'], ['cgroup', 'what it can use: memory.max, cpu.max, pids.max'],
    ['Layers', 'an OverlayFS root from the image'], ['Shared kernel', 'not a VM — a kernel bug is everyone’s bug'],
  ], 2) + box('Follow-up', 'Docker on a Mac is a Linux VM; bind-mounted small files are 10–25× slower (14.6).', '') },

  { t: 'Q33–Q34 — how isolation breaks, how limits work', giua: true, to: true, body: vsd(
    '<code class="i">--privileged</code>, a mounted <code class="i">docker.sock</code>, host namespaces, root without user namespaces.',
    'non-root, read-only root, cap-drop ALL, no-new-privileges, seccomp, and limits the runtime reads (-Xmx below the limit).', '✗ Breaks it', '✓ Hardens it') },

  { t: 'Q35–Q37 — seccomp, overflows, setuid', giua: true, to: true, body: cards([
    ['seccomp kill', 'forbidden mkdirat ⇒ SIGSYS, exit 159'], ['seccomp EPERM', '"Operation not permitted", exit 1'],
    ['canary', '"stack smashing detected", exit 134'], ['setuid + PATH', 'execlp ran the planted binary with euid 0'],
  ], 2) + box('', 'Answer with the layer each mitigation blocks and how you verified it.', 'lam') },

  { t: 'Q39 — shutting down on SIGTERM', giua: true, body: term(grab('c15-pid1', 'docker stop os-p1a', 2), 20) +
    qa('Model answer', 'Stop accepting, drain, close, exit 0 before SIGKILL. In 17.2: drained in 1.4 s, exit 0 — without a handler: exit 143 and a lost request.') },

  { t: 'Q40 — tell me about an incident (STAR)', giua: true, to: true, body: steps([
    '<b>S</b>: transfers timed out after 3 s; billing at 0 % CPU, 39 threads',
    '<b>T</b>: find the cause without restarting',
    '<b>A</b>: idle + stuck ⇒ waiting ⇒ jstack: Java-level deadlock',
    '<b>R</b>: lock in id order + a 100-transfer test: 100/100 in 10 s, total kept',
  ]) },

  { t: 'Pitfall: a story without a number or an action', giua: true, to: true, body: vsd(
    '"There was a memory problem and we restarted it."',
    '"RSS rose 18 MiB per 2 s to the 192 MiB limit; events showed oom + 137; capping the cache kept RSS at 68 MiB."') },

  { t: 'Practice: the open question and your story', giua: true, to: true, body: `
<ol>
<li>"Type a URL" aloud in three minutes: at least five mechanisms in order</li>
<li>Three random questions in four beats, recorded</li>
<li>Your incident from 17.3 as STAR, two numbers, under two minutes</li>
<li>Follow-ups only, asked by a friend</li>
</ol>` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>"Type a URL" = sockets, accept queue, epoll, page cache, one write</li>
<li>EMFILE is a leak; deleted-open files fill disks; fsync makes data durable</li>
<li>epoll: one thread at 10k; threads: 10,001 and +156 MiB stacks</li>
<li>Container = namespaces + cgroup on a shared kernel</li>
<li>SIGTERM ⇒ drain and exit 0; stories ⇒ STAR with two numbers</li>
</ul>` },
]);
