/**
 * os-14-6 — khoá "Operating Systems for Developers", bài 14.6 "WSL2 and Docker Desktop: Linux in a virtual machine" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c146-mac.out.txt (chạy thật trên Mac, đã ẩn danh) qua grab();
 * số trong biểu đồ cột TÍNH từ chính output đó (không gõ tay). Phần Windows/WSL: theo tài liệu Microsoft — slide ghi "per the docs".
 * Giảng: content/courses/operating-systems-for-developers/giang/os-14-6.mjs.
 */
import fs from 'node:fs';
import { lamDeck, sh, sql, two, box, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-14-6', code: 'OS 14.6', title: 'WSL2 and Docker Desktop: Linux in a virtual machine', sub: 'Operating Systems · Chapter 14 — Windows & macOS' };

const m = (pre, n = 1) => grab('c146-mac', pre, n);
const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 10}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.d ? ' stroke-dasharray="8 6"' : ''}/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b', GY = '#777777';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>${inner}</svg>`;
const bang = (cols, rows, fs = 22) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;

/* ── số đo của bench-fs.sh, đọc từ output (2 lượt × 2 nơi) ── */
const BENCH = m('docker run --rm --label oslab=1 --name os-c146-fs');
const rows = BENCH.split('\n').filter((x) => /\(3000 files\)/.test(x)).map((x) => {
  const where = x.startsWith('/mac') ? 'mac' : 'tmp';
  const v = Object.fromEntries([...x.matchAll(/(write|stat|read|delete)\s+([\d.]+) s/g)].map((a) => [a[1], +a[2]]));
  return { where, ...v };
});
const OPS = ['write', 'stat', 'read', 'delete'];
const avg = (where, op) => { const r = rows.filter((x) => x.where === where); return r.reduce((s, x) => s + x[op], 0) / r.length; };
const fmt = (x) => x.toFixed(3);

/* ── các tầng giữa terminal và nhân Linux trên ba máy ── */
const layers = () => {
  let s = '';
  const col = (x, title, c, items, note) => {
    s += R(x, 10, 340, 380, '#ffffff', c) + T(x + 170, 44, title, 22, { a: 'middle', w: 700, f: c });
    items.forEach(([t, sub, cc, dash], i) => {
      const y = 64 + i * 78;
      s += R(x + 20, y, 300, 58, (cc || c) + '16', cc || c, { d: dash }) + T(x + 170, y + 27, t, 19, { a: 'middle', w: 700 }) + (sub ? T(x + 170, y + 50, sub, 15, { a: 'middle', f: '#555' }) : '');
      if (i < items.length - 1) s += `<line x1="${x + 170}" y1="${y + 61}" x2="${x + 170}" y2="${y + 76}" stroke="#b85a2b" stroke-width="3" marker-end="url(#m1)"/>`;
    });
    if (note) s += T(x + 170, 378, note, 16, { a: 'middle', f: c, w: 700 });
  };
  col(10, 'macOS + Docker Desktop', BL, [
    ['macOS (XNU)', 'your terminal, docker CLI', BL],
    ['Virtualization.framework', 'one process: …VirtualMachine', BL],
    ['linuxkit VM', 'Linux 7.0.12 · 10 CPUs · 8 GB', GR],
    ['containerd → containers', 'all share the VM’s kernel', GR],
  ], 'files: virtiofs share');
  col(375, 'Windows + WSL2 · per docs', OR, [
    ['Hyper-V hypervisor', 'Windows = root partition', OR],
    ['WSL2 utility VM', 'one managed VM', OR],
    ['Microsoft-built Linux kernel', 'from kernel.org sources', GR],
    ['distros + Docker Desktop', 'containers inside the VM', GR],
  ], 'files: /mnt/c ⇄ \\\\wsl.localhost');
  col(740, 'Linux VPS', GR, [
    ['provider’s hypervisor', 'the VPS itself is a VM', GY, true],
    ['Ubuntu kernel', 'no extra VM for Docker', GR],
    ['containerd → containers', 'processes of this kernel', GR],
  ], 'files: local ext4');
  return svg(1090, 400, s);
};

/* ── biểu đồ cột: trung bình 2 lượt, thang log ── */
const chart = () => {
  const W = 1090, H = 400, x0 = 150, y0 = 340, top = 40, lo = Math.log10(0.01), hi = Math.log10(2);
  const y = (v) => y0 - (Math.log10(v) - lo) / (hi - lo) * (y0 - top);
  let s = '';
  [0.01, 0.1, 1].forEach((v) => { s += `<line x1="${x0}" y1="${y(v)}" x2="${W - 20}" y2="${y(v)}" stroke="#dddddd" stroke-width="1.5"/>` + T(x0 - 12, y(v) + 6, v + ' s', 17, { a: 'end', f: '#777777' }); });
  s += `<line x1="${x0}" y1="${top - 10}" x2="${x0}" y2="${y0}" stroke="#999999" stroke-width="2"/>`;
  const gw = (W - 20 - x0) / 4;
  OPS.forEach((op, i) => {
    const gx = x0 + i * gw + 30, bw = 90;
    const a = avg('mac', op), b = avg('tmp', op);
    s += R(gx, y(a), bw, y0 - y(a), BL + '30', BL, { rx: 3, sw: 2 }) + T(gx + bw / 2, y(a) - 8, fmt(a) + ' s', 17, { a: 'middle', w: 700, f: BL });
    s += R(gx + bw + 14, y(b), bw, y0 - y(b), GR + '30', GR, { rx: 3, sw: 2 }) + T(gx + bw * 1.5 + 14, y(b) - 8, fmt(b) + ' s', 17, { a: 'middle', w: 700, f: GR });
    s += T(gx + bw + 7, y0 + 30, op, 21, { a: 'middle', w: 700 }) + T(gx + bw + 7, y0 + 55, '× ' + Math.round(a / b), 18, { a: 'middle', f: RD, w: 700 });
  });
  s += R(x0 + 10, 4, 22, 18, BL + '30', BL, { rx: 3, sw: 2 }) + T(x0 + 40, 19, 'shared from the Mac (/mac, virtiofs)', 17);
  s += R(x0 + 400, 4, 22, 18, GR + '30', GR, { rx: 3, sw: 2 }) + T(x0 + 430, 19, 'VM’s own disk (/tmp, overlay)', 17);
  s += T(x0 + 750, 19, 'mean of 2 runs · log scale', 16, { f: '#777777' });
  return svg(W, H + 20, s);
};

const SRC = fs.readFileSync(new URL('../../content/courses/operating-systems-for-developers/lab/code/ch14/bench-fs.sh', import.meta.url), 'utf8')
  .split('\n').filter((x) => !x.startsWith('#')).join('\n').trim();

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 14 — Windows & macOS', bai: '14.6',
}, [
  { cover: true, t: 'WSL2 and Docker Desktop:<br>Linux in a virtual machine', sub: 'Why every Linux container on a Mac or a Windows laptop runs inside a VM — and what crossing that boundary costs, measured' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why containers need a <b>Linux kernel</b> — and why macOS and Windows borrow one</li>
<li>The layers on a Mac, a Windows laptop and the VPS</li>
<li><b>WSL1 vs WSL2</b>: translation vs a real kernel</li>
<li>The Docker VM <b>measured</b>: one macOS process, a whole Linux box inside</li>
<li>The price of the boundary: <b>3,000 small files</b>, shared vs local</li>
<li>Sizing the VM, and keeping node_modules where it belongs</li>
</ul>` },

  { t: 'A container is a Linux process: it needs Linux', giua: true, to: true, body: two(
    box('Linux containers need', 'namespaces (pid, net, mnt, uts, ipc, user, cgroup) and <b>cgroups</b> — features of the Linux kernel (Chapter 12).', 'lam'),
    box('XNU and NT have', '<b>neither</b>. So Docker Desktop and WSL2 start a Linux kernel in a virtual machine, and every container is a process of <b>that</b> kernel.', 'do2')) +
    box('', 'On the VPS there is no extra layer: Docker talks to the kernel the server already runs.', 'xanh') },

  { t: 'What sits between your terminal and the Linux kernel', giua: true, body: layers() },

  { t: 'WSL1 translated system calls; WSL2 runs a real kernel', giua: true, body: bang(['per the docs (Microsoft)', 'WSL1', 'WSL2'], [
    ['Linux kernel', 'none — NT translates Linux syscalls ("pico processes")', '<b>full Linux kernel</b>, built by Microsoft'],
    ['system call compatibility', 'partial — Docker cannot run', '<b>full</b>'],
    ['managed VM', 'no', 'yes (Hyper-V utility VM)'],
    ['speed on Windows files (/mnt/c)', '<b>fast</b>', 'slower — crosses the VM boundary'],
    ['systemd', 'no', 'yes, opt-in in /etc/wsl.conf'],
  ], 24) },

  { t: 'To macOS, the whole Linux machine is one process', giua: true, body: term(m('uname -sm', 4), 19) +
    box('', 'Client <b>darwin/arm64</b>, server <b>linux/arm64</b> 7.0.12-linuxkit · 10 CPUs · 8.3 GB set in Docker Desktop. macOS sees one process: 12 % CPU, 3.6 GiB resident.', 'lam') },

  { t: 'From inside, it is an ordinary Linux box', giua: true, body: term(m('docker run --rm --label oslab=1 --name os-c146-vm', 3), 20) +
    box('', '235 processes, 7.7 GiB, PID 1 = <code class="i">initd</code>. Alpine and Ubuntu report the <b>same</b> kernel — a container brings no kernel of its own.', 'lam') },

  { t: 'Effects of the VM you already met in this course', giua: true, to: true, body: `
<ul>
<li><b>perf</b> lacks hardware counters inside the VM (lesson 0.1)</li>
<li>the default <b>docker stop</b> grace period measured at <b>3.1 s</b> (lesson 1.5)</li>
<li>memory and CPU are capped by the VM <b>before</b> any cgroup — OOM inside the VM is exit 137 while the Mac still has RAM</li>
<li>every file on a <b>shared folder</b> is a round trip to the host — next slides</li>
</ul>` },

  { t: 'The benchmark: 3,000 tiny files, like npm install', giua: true, body: sql(SRC, { lang: 'bash' }).replace('<pre class="vs">', '<pre class="vs" style="font-size:16px;white-space:pre-wrap">') +
    box('', 'Run on <code class="i">/mac</code> (a Mac folder shared over virtiofs) and on <code class="i">/tmp</code> (the VM’s own overlay disk), twice each.', 'lam') },

  { t: 'Raw output: same container, two folders', giua: true, body: term(BENCH, 19) + box('', `Twice each: <b>/mac</b> (virtiofs) write ${rows.filter((x) => x.where === 'mac').map((x) => fmt(x.write)).join(' / ')} s vs <b>/tmp</b> ${rows.filter((x) => x.where === 'tmp').map((x) => fmt(x.write)).join(' / ')} s — same container, same kernel, only the folder differs.`, 'lam') },

  { t: 'Every operation on the shared folder is 10–24× slower', giua: true, body: chart() },

  { t: 'Windows has the same shape (per the docs)', giua: true, to: true, body: bang(['you build with…', 'keep the project…', 'why'], [
    ['Linux tools in WSL (npm, Maven, git)', 'inside the distro: <code class="i">~/project</code>', 'ext4 inside the VM — no boundary'],
    ['Windows tools (NetBeans, Visual Studio)', 'on the Windows drive: <code class="i">C:\\…</code>', 'NTFS — no boundary'],
    ['Linux tools on <code class="i">/mnt/c/…</code>', '✗ avoid', 'every file crosses Windows ⇄ VM'],
  ], 25) },

  { t: 'Size the VM on purpose', giua: true, body: bang(['', 'Docker Desktop (Mac)', 'WSL2 .wslconfig (per the docs)'], [
    ['where', 'Settings → Resources', '<code class="i">%UserProfile%\\.wslconfig</code>, section [wsl2]'],
    ['memory', 'here 8 GB of 32', 'default <b>50 %</b> of Windows memory'],
    ['CPUs', 'here 10', 'default: all logical processors'],
    ['swap', '1 GiB in the VM', 'default 25 % of memory'],
    ['apply', 'restart Docker Desktop', '<code class="i">wsl --shutdown</code>, wait ~8 s'],
  ], 24) + box('', 'Too small ⇒ OOM (137) <b>inside</b> the VM. Too large ⇒ the host compresses and swaps.', 'do2') },

  { t: 'Pitfall: npm install takes minutes on my Mac', giua: true, to: true, body: vsd(
    'Bind-mount the whole project, so <code class="i">node_modules</code> (tens of thousands of files) lives on the shared folder. On Windows: clone to C:\\ and build from WSL via <code class="i">/mnt/c</code>.',
    'Keep <code class="i">node_modules</code>, <code class="i">target/</code>, caches <b>inside the VM</b>: a named volume (<code class="i">-v nm:/app/node_modules</code>) or COPY. Mount only source. On Windows clone inside the distro.') },

  { t: 'Practice: measure your own boundary', giua: true, body: `
<ol>
<li>Mac: <code class="i">docker run --rm -v "$PWD":/mac os-lab /mac/bench-fs.sh /mac</code>, then <code class="i">/tmp</code></li>
<li>Find the VM: <code class="i">ps -axo pid,%cpu,rss,comm | grep Virtualization</code></li>
<li>Windows teammate: the same script in <code class="i">~/bench</code> and in <code class="i">/mnt/c/…</code>; show <code class="i">.wslconfig</code></li>
<li>Move <code class="i">node_modules</code> into a named volume; time <code class="i">npm ci</code> before and after</li>
</ol>` + box('Done when', 'you have the four-row table, the two WSL numbers, and an npm ci time that dropped — plus one sentence on the boundary each file operation crossed.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Containers need Linux; macOS and Windows run it in a <b>VM</b></li>
<li>To macOS the VM is <b>one process</b>; inside: 235 processes, kernel 7.0.12</li>
<li>WSL1 translated syscalls; <b>WSL2</b> runs a real kernel</li>
<li>Small files on a shared folder: <b>10–24× slower</b> — keep dependencies inside</li>
<li>Size the VM deliberately: Resources, <code class="i">.wslconfig</code></li>
</ul>` },
]);
