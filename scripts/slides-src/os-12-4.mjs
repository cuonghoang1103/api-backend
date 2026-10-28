/**
 * os-12-4 — khoá "Operating Systems for Developers", bài 12.4 "Build a mini container by hand" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c124-mini.out.txt; mã đọc THẲNG từ lab/code/ch12/mini-container.sh.
 * Giảng: content/courses/operating-systems-for-developers/giang/os-12-4.mjs.
 */
import fs from 'node:fs';
import { lamDeck, sh, sql, two, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-12-4', code: 'OS 12.4', title: 'Build a mini container by hand', sub: 'Operating Systems · Chapter 12 — Containers' };

const g = (pre, n = 1) => grab('c124-mini', pre, n);
const cut = (t, w) => t.split('\n').map((l) => (l.length > w ? l.slice(0, w - 1) + '…' : l)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 10}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b', PU = '#7b4fa0';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">${inner}</svg>`;
const SRC = fs.readFileSync(new URL('../../content/courses/operating-systems-for-developers/lab/code/ch12/mini-container.sh', import.meta.url), 'utf8').split('\n');
const lines = (a, b) => SRC.slice(a - 1, b).join('\n');
const bang = (cols, rows, fs = 19) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;

/* bốn khối của runtime, xếp lớp như một cái hộp */
const blocks = () => {
  const items = [
    ['4 · exec CMD', 'becomes PID 1 of the box', RD],
    ['3 · fences', 'unshare 6 namespaces  →  pivot_root  →  /proc /sys /dev', PU],
    ['2 · limits', 'cgroup mini-NAME: memory.max 64M · cpu.max 50% · pids.max 32', GR],
    ['1 · layers', 'overlay: lower = image/ (Alpine tar)  +  upper/work per box', OR],
    ['0 · image', 'alpine-3.24.tar — 421 files, 8.6 MB', BL],
  ];
  let s = '';
  items.forEach(([t, d, c], i) => {
    const y = 10 + i * 78;
    s += R(40, y, 1030, 66, c + '16', c) + T(70, y + 42, t, 24, { w: 700, f: c }) + T(300, y + 42, d, 20, { m: 1 });
  });
  return svg(1110, 405, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 12 — Containers', bai: '12.4',
}, [
  { cover: true, t: 'Build a mini container<br>by hand', sub: 'An Alpine rootfs, overlayfs, a cgroup, six namespaces and pivot_root — about 40 lines of shell' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A working container runtime in <b>~40 lines</b> of shell</li>
<li>Why <b>pivot_root</b>, not chroot</li>
<li>Proof it behaves like a container: PID 1, <b>137</b>, fork refused, CPU throttled</li>
<li>The box seen from <b>outside</b>, entered with nsenter</li>
<li>What is still <b>missing</b> compared with Docker</li>
</ul>` },

  { t: 'The runtime is four blocks on top of an image', giua: true, body: blocks() },

  { t: 'Step 0: an image is a tar of files', giua: true, body:
    sql('docker create --name tmp alpine:latest\ndocker export tmp > alpine-3.24.tar     # on the host, once\ndocker rm tmp', { lang: 'bash' }).replace('<pre class="vs">', '<pre class="vs" style="font-size:20px">') +
    term(g('ls -lh /opt/c12/alpine-3.24.tar') + '\n' + g('cat /etc/os-release | head -1'), 19) },

  { t: 'Blocks 1 and 2: layers and limits', giua: true, body: sql(lines(15, 24), { lang: 'bash' }).replace('<pre class="vs">', '<pre class="vs" style="font-size:15.5px;white-space:pre-wrap">') +
    box('', 'One shared, read-only <b>image/</b>; a private <b>upper</b> per box. A cgroup per box — the parent must already delegate memory, cpu, pids (lesson 12.2).', 'lam') },

  { t: 'Block 3: fences, then pivot_root', giua: true, body: sql(lines(27, 39), { lang: 'bash' }).replace('<pre class="vs">', '<pre class="vs" style="font-size:15px">') },

  { t: 'pivot_root vs chroot', giua: true, to: true, body: vsd(
    '<b>chroot</b> changes where path lookup starts. The old root stays mounted and reachable (an fd opened before is enough). Never a security boundary.',
    '<b>pivot_root</b> makes the overlay the root <b>mount</b> and moves the old one aside; <code class="i">umount -l /.old</code> removes the host from the namespace. Needs a mount point + private propagation. runc does this.',
    '✗ chroot', '✓ pivot_root') },

  { t: 'It looks like a container', giua: true, body: term(g("./mini-container.sh box1 /bin/sh -c 'echo \"hostname:"), 18) +
    box('', 'Own hostname, Alpine instead of Ubuntu, <b>PID 1</b>, a world of two processes.', 'xanh') },

  { t: 'Its file system, devices and network', giua: true, body: two(
    term(g("./mini-container.sh box1 /bin/sh -c 'ls /").split('\n').slice(0, 18).join('\n'), 13, 540),
    '<div>' + term(g("./mini-container.sh box1 /bin/sh -c 'ls /").split('\n').slice(18).join('\n'), 15, 540) +
    box('', 'Root = our overlay (256 MB tmpfs). <b>/dev has 3 nodes</b> — no disks, no host terminal. Network: only <code class="i">lo</code>, down.', 'lam') + '</div>') },

  { t: 'Its own cgroup, with our limits', giua: true, to: true, body: term(g("./mini-container.sh box1 /bin/sh -c 'cat /proc/self/cgroup"), 20) +
    box('', 'The cgroup namespace shows <b>/</b>; the files carry 64 MiB, 50 % of a CPU, 32 tasks.', 'lam') },

  { t: 'The limits bite: 137 and "can’t fork"', giua: true, body: term(g("./mini-container.sh box1 /bin/sh -c 'dd", 2) + '\n' + g("./mini-container.sh box1 /bin/sh -c 'for i"), 16) +
    box('', 'dd allocates a 200 MB buffer → killed at 64 MiB, exit 137, named in the kernel log. 40 sleeps under pids.max 32 → the shell cannot fork and gives up.', 'do2') },

  { t: 'CPU quota: 0.45 s of CPU takes 0.88 s', giua: true, to: true, body: term(g("./mini-container.sh box1 /bin/sh -c 'time", 2), 17) +
    box('', 'Same work, same CPU time. Under <code class="i">50000 100000</code> half of every 100 ms period is spent waiting.', 'lam') },

  { t: 'Seen from outside', body: term(g('./mini-container.sh box2', 4), 13) +
    box('', 'PID 271 outside, 1 inside; cgroup <code class="i">/mini-box2</code>; <code class="i">/proc/PID/root</code> reads its Alpine files. Changes live in its <b>upper</b>: note + a whiteout for motd.', 'lam') },

  { t: 'nsenter = docker exec; PID 1 exits, the box is gone', giua: true, to: true, body: term(g('nsenter -t $P --all', 2), 19) +
    box('', 'Zero <code class="i">mini-*</code> cgroups and only the lab’s own overlay left after cleanup.', 'xanh') },

  { t: 'What is still missing compared with Docker', giua: true, body: bang(['feature', 'our 40 lines', 'runc / Docker'], [
    ['namespaces, cgroups, overlay, pivot_root', '✓', '✓'],
    ['network: veth, bridge, NAT, ports', 'only lo', '✓ — lesson 12.5'],
    ['capabilities dropped', 'full root', '14 kept by default'],
    ['seccomp filter', '—', 'default profile'],
    ['masked /proc paths', '—', 'maskedPaths, readonlyPaths'],
    ['user namespace (rootless)', '—', 'optional — lesson 12.6'],
    ['registry, logs, restart, health', '—', 'containerd + dockerd'],
  ]) },

  { t: 'Pitfall: mounts that leak back to the host', giua: true, to: true, body: vsd(
    'On systemd hosts / is <b>shared</b>. Mounting /proc, overlays or tmpfs without making the tree private can leave them visible on the host — hundreds of stale mounts.',
    '<code class="i">mount --make-rprivate /</code> first, in every piece of code that creates a mount namespace (lesson 9.6).') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>A runtime’s kernel work: <b>image → overlay → cgroup → unshare → pivot_root → exec</b></li>
<li>The homemade box gets PID 1, its own hostname, <b>137</b>, EAGAIN, throttling</li>
<li><b>pivot_root</b> removes the host file system; chroot only hides it</li>
<li>Make mounts <b>private</b> before mounting anything</li>
<li>Docker adds network, caps, seccomp, masking, images, lifecycle</li>
</ul>` },
]);
