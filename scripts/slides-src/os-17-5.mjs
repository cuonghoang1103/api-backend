/**
 * os-17-5 — khoá "Operating Systems for Developers", bài 17.5 "Stretch: a mini container runtime in C" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c175-ctr.out.txt qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-17-5.mjs.
 */
import { lamDeck, sh, box, steps, vsd, flow } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-17-5', code: 'OS 17.5', title: 'Stretch: a mini container runtime in C', sub: 'Operating Systems · Chapter 17 — Capstone' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.38">`);
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const C = (pre, n = 1) => grab('c175-ctr', pre, n, { drop: /^# / });

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 17 — Capstone', bai: '17.5',
}, [
  { cover: true, t: 'Stretch:<br>a mini container runtime in C', sub: 'Namespaces, pivot_root, cgroups and dropped capabilities — every isolation a line you wrote' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The brief for <code class="i">minictr</code>: what a runtime does, <b>in order</b></li>
<li>Ten acceptance tests in a throwaway privileged lab container</li>
<li>The box from inside: PID 1, its own hostname, a busybox root</li>
<li>The box from outside: host PID, cgroup, six new namespaces</li>
<li>A real pitfall: symbolic links after pivot_root</li>
</ul>` },

  { t: 'Safety first', giua: true, to: true, body: box('Only in a throwaway lab container', 'A runtime needs root, mounts and cgroups. Run it inside <code class="i">docker run --privileged --label oslab=1 …</code> as in Chapter 12 — never on your laptop or a server. The tests put the rootfs on a tmpfs.', 'do2') },

  { t: 'What a runtime does, in order', giua: true, body: flow([
    { t: 'cgroup', s: 'memory · pids · cpu', mau: '#e08a1e' }, { t: 'clone()', s: '5 namespaces', mau: '#336791' },
    { t: 'join cgroup', s: 'before user code', mau: '#e08a1e' }, { t: 'pivot_root', s: 'new / , /proc, /dev', mau: '#336791' },
    { t: 'drop caps', s: 'no_new_privs', mau: '#2f7d4f' }, { t: 'exec', s: 'then wait, clean up', mau: '#2f7d4f' },
  ], { fs: 18 }) + box('', 'Order matters: limits before exec · cgroup namespace after joining the cgroup · / private before pivot_root.', 'lam') },

  { t: 'Requirements and marks', giua: true, body: bang(['#', 'Checked', 'Marks'], [
    ['C1', 'the command is PID 1', '1.5'], ['C2', 'own hostname, host unchanged', '1'], ['C3', 'only the rootfs visible; host mounts unchanged', '2'],
    ['C4', 'no eth0, no routes, nothing up', '1'], ['C5', 'memory.max 32M ⇒ exit 137, oom_kill reported', '1.5'],
    ['C6', 'pids.max 10 ⇒ forks refused and reported', '1'], ['C7', 'CAP_SYS_ADMIN gone, mount refused', '1'], ['C8', 'exit code passed through; cgroups removed', '1'],
  ], 20) },

  { t: 'The reference runtime passes all ten', giua: true, body: term(C('wc -l ctr/minictr.c', 2), 15) },

  { t: 'Inside the box', giua: true, body: term(C('minictr --hostname shop-01'), 17) +
    box('', 'PID 1, hostname shop-01, cgroup "0::/" (namespace made after joining), and a root with only bin, dev, proc, tmp.', 'lam') },

  { t: 'Still root — but without the dangerous capabilities', giua: true, body: term(C("grep -E 'CapBnd'"), 18) + term(C('minictr --mem 32M', 2), 16) },

  { t: 'The same box, seen from the host', giua: true, body: term(C('minictr /box /bin/sleep 30', 4), 14) +
    box('', 'Host PID 768 is PID 1 inside; it lives in /minictr-766; six namespaces with new inodes; cgroup removed afterwards.', 'xanh') },

  { t: 'Pitfall: "No such file" for a file that is there', giua: true, to: true, body: vsd(
    '<code class="i">busybox --install -s DIR</code> ⇒ absolute links to the old path; after pivot_root they all dangle. Linking busybox → busybox ⇒ "Too many levels of symbolic links".',
    'Relative links (<code class="i">ln -s busybox bin/sh</code>), skip busybox itself. Inside a new root, paths resolve against that root.') },

  { t: 'What to put on your CV', giua: true, to: true, body: box('One line', '"Implemented a minimal container runtime in C (~120 lines): PID/mount/UTS/IPC/net/cgroup namespaces, pivot_root into a busybox rootfs, cgroup v2 limits before exec, capability reduction and no_new_privs; 10-case acceptance suite."', 'xanh') +
    box('Be ready for', '"what is a container?", "why is --privileged dangerous?", "how does Docker limit memory?" — answer with your own code.', 'lam') },

  { t: 'Practice: show what a container shares', giua: true, to: true, body: `
<ol>
<li>Run a box with <code class="i">sleep 60</code>; read its NSpid, cgroup and ns links from outside</li>
<li><code class="i">uname -r</code> inside and outside: the same kernel</li>
<li>Remove CLONE_NEWNET, rebuild, read <code class="i">/proc/net/dev</code> inside</li>
<li>Three lines: what is shared, what is private, which line of code decides</li>
</ol>` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>A runtime ≈ 120 lines: cgroup files, clone flags, pivot_root, caps, exec</li>
<li>Order: limits before exec; cgroup ns after joining; / private first</li>
<li>Inside PID 1 = host PID 768; 32 MiB ⇒ oom_kill, exit 137</li>
<li>Same kernel as the host — a fenced process, not a VM</li>
<li>Only ever in a throwaway privileged lab container</li>
</ul>` },
]);
