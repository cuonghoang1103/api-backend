/**
 * os-12-1 — khoá "Operating Systems for Developers", bài 12.1 "A container is a process with a different view" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c121-ns|c121-host.out.txt (chạy thật) qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-12-1.mjs.
 */
import { lamDeck, sh, two, box, cards, vsd, tbl } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-12-1', code: 'OS 12.1', title: 'A container is a process with a different view', sub: 'Operating Systems · Chapter 12 — Containers' };

const g = (pre, n = 1) => grab('c121-ns', pre, n);
const h = (pre, n = 1) => grab('c121-host', pre, n);
const cut = (t, w) => t.split('\n').map((l) => (l.length > w ? l.slice(0, w - 1) + '…' : l)).join('\n');
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.d ? ' stroke-dasharray="8 6"' : ''}/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>${inner}</svg>`;
const bang = (cols, rows, fs = 21) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
/** terminal chữ to: tự cắt dòng theo bề rộng (w px) để không tràn ngang */
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const A = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b85a2b" stroke-width="3" marker-end="url(#m1)"/>`;

/* PID thật từ output: VM pid của sleep + shim */
const vmPid = h("docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab bash -c \"grep").match(/NSpid:\s+(\d+)\s+1/)[1];
const shimLine = h("docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab bash -c \"grep").split('\n').find((l) => /containerd-shim/.test(l)).trim().split(/\s+/);
const twoViews = () => {
  let s = '';
  s += R(20, 20, 470, 330, '#f4f8fc', BL) + T(255, 56, 'inside the container', 22, { a: 'middle', w: 700, f: BL });
  s += R(70, 120, 370, 70, '#fff', BL) + T(255, 164, 'PID 1  sleep 600', 24, { a: 'middle', m: 1, w: 700 });
  s += T(255, 250, 'the first and only process', 19, { a: 'middle', f: '#555' }) + T(255, 280, 'in its world', 19, { a: 'middle', f: '#555' });
  s += R(560, 20, 530, 330, '#fdf6ee', OR) + T(825, 56, 'the Docker VM (the real kernel)', 22, { a: 'middle', w: 700, f: OR });
  s += R(600, 90, 450, 64, '#fff', '#888') + T(825, 130, `PID ${shimLine[0]}  containerd-shim-runc-v2`, 19, { a: 'middle', m: 1 });
  s += A(825, 156, 825, 206);
  s += R(600, 210, 450, 64, '#fff', OR, { sw: 3 }) + T(825, 250, `PID ${vmPid}  sleep 600`, 22, { a: 'middle', m: 1, w: 700 });
  s += T(825, 320, `NSpid: ${vmPid}  1`, 22, { a: 'middle', m: 1, w: 700, f: RD });
  s += `<line x1="440" y1="155" x2="598" y2="242" stroke="${RD}" stroke-width="2.5" stroke-dasharray="7 6"/>` + T(530, 176, 'same', 18, { a: 'middle', f: RD, w: 700 });
  return svg(1110, 370, s);
};

const nsRows = h('docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab bash -c "for n').split('\n').slice(1)
  .map((l) => { const [n, , c, , v] = l.trim().split(/\s+/); return [n, c.replace(/^\w+:/, ''), v.replace(/^\w+:/, ''), c === v ? '<b class="do">same</b>' : 'own']; });

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 12 — Containers', bai: '12.1',
}, [
  { cover: true, t: 'A container is a process<br>with a different view', sub: 'The namespaces one by one: unshare, /proc/PID/ns, nsenter' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>One container, seen from <b>inside</b> and from the <b>real kernel</b></li>
<li>The <b>eight namespaces</b> and how to read them in /proc</li>
<li>Each one built by hand with <b>unshare</b> — and the PID traps</li>
<li><b>nsenter</b> = what docker exec does</li>
<li>Why <b>root in a default container</b> is the kernel’s root</li>
</ul>` },

  { t: 'Inside it is PID 1; outside it is just another process', giua: true, body: twoViews() + box('', 'The kernel keeps both numbers. The parent outside is containerd-shim — there is no "container" object, only a process.', 'lam') },

  { t: 'Six namespaces differ — the user namespace does not', giua: true, body: two(
    `<div style="zoom:1.32">${tbl(['namespace', 'container', 'VM PID 1', ''], nsRows)}</div>`,
    box('Default Docker = no user namespace', 'UID 0 in the container <b>is</b> UID 0 of the kernel. Only capabilities, seccomp and the other fences of lesson 13.4 hold it back.', 'do2'), 'r73') },

  { t: 'Eight namespaces, eight links in /proc', giua: true, body: bang(['type', 'unshare flag', 'gives the process its own…'], [
    ['<b>pid</b>', 'CLONE_NEWPID', 'process numbers — the first one is PID 1'], ['<b>mnt</b>', 'CLONE_NEWNS', 'mount table: what /, /proc, /data are'],
    ['<b>net</b>', 'CLONE_NEWNET', 'interfaces, IPs, routes, ports, firewall'], ['<b>uts</b>', 'CLONE_NEWUTS', 'hostname'],
    ['<b>ipc</b>', 'CLONE_NEWIPC', 'System V queues, semaphores, shared memory'], ['<b>user</b>', 'CLONE_NEWUSER', 'UIDs/GIDs and capabilities'],
    ['<b>cgroup</b>', 'CLONE_NEWCGROUP', 'view of the cgroup tree'], ['<b>time</b>', 'CLONE_NEWTIME', 'monotonic / boot clock offsets'],
  ], 20) + `<p style="margin:6px 0 0;font-size:21px">Same inode number in <code class="i">/proc/PID/ns/&lt;type&gt;</code> = same namespace.</p>` },

  { t: 'UTS: a hostname of its own', giua: true, body: term(g('hostname') + '\n' + g('unshare --uts', 2), 21) +
    box('', 'Inside: <b>mini</b>, a new UTS inode. Outside: still <b>oslab</b>. <code class="i">docker run --hostname web</code> does exactly this.', 'xanh') },

  { t: 'PID trap 1: unshare moves your next child, not you', giua: true, body: term(g('unshare --pid sh -c'), 20) +
    box('Why the second fork fails', 'The first child became PID 1 of the new namespace and exited. A PID namespace whose PID 1 is dead accepts no new process ⇒ the next fork fails (ENOMEM, "Cannot fork"). Fix: <b>--fork</b>.', 'do2') },

  { t: 'PID trap 2: a new namespace needs its own /proc', giua: true, body: term(g("unshare --pid --fork sh -c 'echo \"I am PID $$\"; ps -e") + '\n' + g('unshare --pid --fork --mount-proc sh -c'), 18) +
    box('', 'ps reads /proc. Without <b>--mount-proc</b> it reads the old namespace’s /proc and fails. With it: a world of two processes.', 'xanh') },

  { t: 'One process, two PIDs — and PID 1 ignores SIGTERM', giua: true, body: term(g('unshare --pid --fork --mount-proc sleep 300 &', 3) + '\n' + g('kill $S; sleep 0.5'), 17) +
    box('PID trap 3 (lesson 1.5)', 'The kernel drops signals to a namespace’s PID 1 unless it has a handler. After SIGTERM: still sleeping. Only SIGKILL gets through.', 'do2') },

  { t: 'Mount: a private tree', giua: true, body: term(g('unshare --mount sh -c', 2), 20) +
    box('', 'The tmpfs exists only in the new mount namespace; outside, /mnt is an empty directory. unshare also makes the tree <b>private</b>, so nothing propagates back (lesson 9.6).', 'lam') },

  { t: 'Network: a new namespace has no cable', giua: true, body: term(g('ip -br link | grep -v NONE', 2), 17) +
    box('', 'Outside: lo + eth0. Inside: only <code class="i">lo</code>, down. After <code class="i">ip link set lo up</code> ping 127.0.0.1 works — but no route, no DNS: curl exits 6. Lesson 12.5 plugs in a virtual cable.', 'lam') },

  { t: 'User namespace: root inside = dev (1001) outside', giua: true, body: term(g("runuser -u dev -- unshare --user --map-root-user sh -c 'id", 2) + '\n' + g('unshare --user --map-users'), 17) +
    box('', 'Full capabilities inside, but they only count for objects the namespace owns — not the host’s /etc. No privilege needed: the basis of <b>rootless</b>. A remapped range (100000…) shows unmapped host root as <b>nobody</b>.', 'xanh') },

  { t: 'nsenter joins a running box — that is docker exec', giua: true, body: term(g('nsenter -t $C --uts --pid --mount --net sh -c'), 16) +
    box('', 'setns() on the target’s /proc/PID/ns links. The entered shell is PID 4 with <b>PPID 0</b>: its parent (nsenter) is outside the PID namespace.', 'lam') },

  { t: 'A namespace lives while something holds it', giua: true, body: term(g('ip netns add demo', 2), 19) + cards([
    ['a process', 'the usual case: the last process exits, the namespace goes'],
    ['an open fd', 'to /proc/PID/ns/net — runtimes hold one while they set up'],
    ['a bind mount', '/run/netns/demo keeps it alive with <b>0 processes</b> (Kubernetes uses a "pause" process instead)'],
  ]) },

  { t: 'Pitfall: half of the unshare recipe', giua: true, to: true, body: vsd(
    '<code class="i">unshare --pid cmd</code>: the second fork fails.<br><br><code class="i">unshare --pid --fork cmd</code>: ps crashes or shows the host.',
    'Always <code class="i" style="white-space:nowrap">unshare --pid --fork --mount-proc</code> — fork into the namespace first, then mount a fresh /proc. Runtimes do the same.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>A container is a <b>process</b>: PID 1 inside, a normal PID outside (NSpid)</li>
<li>Its isolation = <b>namespace memberships</b>, readable in /proc/PID/ns</li>
<li>PID namespaces need <b>--fork + --mount-proc</b>; PID 1 ignores unhandled signals</li>
<li><b>Default Docker shares the user namespace</b>: container root is kernel root</li>
<li><b>nsenter</b> = docker exec; a namespace lives while something holds it</li>
</ul>` },
]);
