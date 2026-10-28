/**
 * os-14-1 — khoá "Operating Systems for Developers", bài 14.1 "Three kernels: Linux, XNU and Windows NT" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c141-mac|c141-lx.out.txt (chạy thật, đã ẩn danh) qua grab().
 * Phần Windows: theo tài liệu (không có máy Windows để đo) — slide ghi rõ "per the docs".
 * Giảng: content/courses/operating-systems-for-developers/giang/os-14-1.mjs.
 */
import { lamDeck, sh, two, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-14-1', code: 'OS 14.1', title: 'Three kernels: Linux, XNU and Windows NT', sub: 'Operating Systems · Chapter 14 — Windows & macOS' };

const m = (pre, n = 1) => grab('c141-mac', pre, n);
const l = (pre, n = 1) => grab('c141-lx', pre, n);
const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 10}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.d ? ' stroke-dasharray="8 6"' : ''}/>`;
const A = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b85a2b" stroke-width="3" marker-end="url(#m1)"/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', GY = '#777777';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>${inner}</svg>`;
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;

/* cây phả hệ: ba hàng thời gian */
const tree = () => {
  const node = (x, y, w, t, s, c) => R(x, y, w, 62, c + '16', c) + T(x + w / 2, y + 27, t, 20, { a: 'middle', w: 700, f: c }) + T(x + w / 2, y + 51, s, 16, { a: 'middle', f: '#555' });
  let s = '';
  // hàng 1: Unix → BSD → NeXTSTEP → Mac OS X → macOS
  const r1 = [[10, 'Unix', '1969 · Bell Labs'], [222, 'BSD', '1977 · Berkeley'], [434, 'NeXTSTEP', '1989 · Mach + BSD'], [646, 'Mac OS X', '2001 · Apple'], [858, 'macOS / iOS', 'kernel: XNU']];
  r1.forEach(([x, t, sub], i) => { s += node(x, 20, 190, t, sub, i < 2 ? GY : BL); if (i < 4) s += A(x + 192, 51, x + 220, 51); });
  // hàng 2: Linux
  s += node(222, 150, 400, 'Linux', '1991 · Torvalds — Unix-like, no Unix code', GR) + A(624, 181, 652, 181);
  s += node(656, 150, 392, 'Ubuntu, Android, Docker’s VM', 'kernel: Linux', GR);
  s += `<line x1="105" y1="84" x2="105" y2="181" stroke="${GY}" stroke-width="2.5" stroke-dasharray="7 6"/>` + `<line x1="105" y1="181" x2="218" y2="181" stroke="${GY}" stroke-width="2.5" stroke-dasharray="7 6"/>`;
  s += T(112, 140, 'ideas, not code', 15, { f: GY });
  // hàng 3: VMS → NT → Windows
  s += node(10, 280, 300, 'VMS', '1977 · DEC (Dave Cutler)', OR) + A(312, 311, 340, 311);
  s += node(344, 280, 300, 'Windows NT 3.1', '1993 · Cutler at Microsoft', OR) + A(646, 311, 674, 311);
  s += node(678, 280, 370, 'Windows 2000 … 10 / 11', 'kernel: NT', OR);
  s += T(555, 382, 'a different family: handles, CreateProcess, C:\\, NTFS', 18, { a: 'middle', f: OR, w: 700 });
  return svg(1060, 400, s);
};

/* ba thiết kế nhân */
const designs = () => {
  let s = '';
  const col = (x, title, c) => R(x, 10, 340, 330, '#fff', c) + T(x + 170, 42, title, 22, { a: 'middle', w: 700, f: c });
  s += col(10, 'Linux — monolithic', GR) + col(375, 'XNU — hybrid', BL) + col(740, 'NT — hybrid', OR);
  // Linux: một khối
  s += R(30, 62, 300, 210, GR + '18', GR) + T(180, 100, 'one kernel program', 19, { a: 'middle', w: 700 });
  ['scheduler · memory', 'file systems · VFS', 'network stack', 'drivers'].forEach((t, i) => { s += T(180, 136 + i * 32, t, 18, { a: 'middle' }); });
  s += R(70, 288, 220, 40, '#fff', GR, { d: 1, sw: 2 }) + T(180, 314, 'loadable modules', 17, { a: 'middle', f: GR });
  // XNU
  s += R(395, 62, 300, 266, BL + '10', BL, { sw: 2 }) + T(545, 86, 'one kernel address space', 16, { a: 'middle', f: BL });
  s += R(410, 98, 270, 62, '#fff', BL) + T(545, 124, 'BSD', 20, { a: 'middle', w: 700 }) + T(545, 148, 'processes · POSIX · VFS · sockets', 15, { a: 'middle', f: '#555' });
  s += R(410, 170, 270, 62, '#fff', BL) + T(545, 196, 'Mach', 20, { a: 'middle', w: 700 }) + T(545, 220, 'tasks · threads · ports · VM', 15, { a: 'middle', f: '#555' });
  s += R(410, 242, 270, 62, '#fff', BL) + T(545, 268, 'IOKit', 20, { a: 'middle', w: 700 }) + T(545, 292, 'drivers in C++', 15, { a: 'middle', f: '#555' });
  // NT
  s += R(760, 62, 300, 52, OR + '18', OR) + T(910, 94, 'Win32 subsystem (user mode)', 17, { a: 'middle', w: 700, f: OR });
  s += R(760, 124, 300, 204, OR + '10', OR, { sw: 2 }) + T(910, 146, 'kernel mode', 16, { a: 'middle', f: OR });
  ['Executive: objects, memory, I/O', 'kernel: scheduling, interrupts', 'drivers · win32k.sys', 'HAL (hardware layer)'].forEach((t, i) => { s += R(775, 156 + i * 42, 270, 36, '#fff', '#c9a27a', { sw: 1.5, rx: 6 }) + T(910, 180 + i * 42, t, 16, { a: 'middle' }); });
  return svg(1090, 350, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 14 — Windows & macOS', bai: '14.1',
}, [
  { cover: true, t: 'Three kernels:<br>Linux, XNU and Windows NT', sub: '"Are Linux, Apple and Windows all operating systems?" — yes. Here is what differs, measured on a real Mac' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Kernel vs operating system: <b>Linux, XNU, NT</b></li>
<li>The family tree: Unix → BSD → NeXT → macOS, and VMS → NT</li>
<li>Monolithic vs <b>hybrid</b> — and why all three still crash on a bad driver</li>
<li>Each kernel <b>seen on this Mac</b>: version, PID 1, page size</li>
<li>Why only Linux lets programs call the kernel directly</li>
</ul>` },

  { t: 'Kernel vs OS: who is who', giua: true, body: bang(['', 'Linux server', 'macOS', 'Windows (per the docs)'], [
    ['kernel', 'Linux', 'XNU', 'NT (ntoskrnl.exe)'],
    ['library programs must use', 'glibc — optional', '<b>libSystem</b> — mandatory', '<b>ntdll + kernel32</b> — mandatory'],
    ['PID 1 / first process', 'systemd', 'launchd', 'System (4) → smss → services.exe'],
    ['default shell · file system', 'bash · ext4', 'zsh · APFS', 'PowerShell · NTFS'],
    ['executable format', 'ELF', 'Mach-O', 'PE (.exe, .dll)'],
    ['POSIX', 'Unix-like', 'certified UNIX', 'no (Linux via WSL)'],
  ], 23) },

  { t: 'One family tree, two roots', giua: true, body: tree() },

  { t: 'Three designs: monolithic, hybrid, hybrid', giua: true, body: designs() +
    box('', '"Hybrid" = microkernel <b>structure</b>, monolithic <b>deployment</b>. File systems and drivers run in kernel mode on all three — a bad driver crashes any of them.', 'lam') },

  { t: 'The macOS kernel, measured', giua: true, body: term(m('sw_vers', 4), 17) +
    box('', '<b>xnu-13432.1.9</b> · 10 cores (8 performance + 2 efficiency) · 32 GiB · <b>16 KiB pages</b>', 'lam') },

  { t: 'launchd is PID 1, and every program links libSystem', giua: true, body: term(m('ps -o pid,ppid,user,comm -p 1', 3), 20) +
    box('', '254 kernel extensions, all Apple. Even <code class="i">true</code>, which does nothing, links exactly one library.', 'lam') },

  { t: 'The Linux kernel, inside Docker’s VM', giua: true, body: term(m('docker run --rm --label oslab=1 --name os-c141-lx', 3), 16) +
    box('', 'Same 10 cores, but <b>4 KiB pages</b>. PID 1 = <code class="i">initd</code>, PID 2 = <code class="i">kthreadd</code> with 172 kernel threads.', 'lam') },

  { t: 'One program, one address space', to: true, giua: true, body: term(l('cat /proc/version'), 19) + term(l('wc -l', 2), 23) +
    box('', 'Docker built almost everything <b>into</b> the kernel: 146 entries in /sys/module, only 5 loadable modules. A VPS kernel loads dozens with modprobe. Monolithic either way.', 'lam') },

  { t: 'Same call, different numbers', giua: true, body: two(
    '<div>' + term(l("grep -cE '^#define __NR_'", 2), 17, 540) + '</div>',
    '<div>' + term(m('SDK=$(xcrun --show-sdk-path)', 2).replace(/\$SDK\/usr\/include\/sys\/syscall\.h/g, 'syscall.h').replace(/SDK=\$\(xcrun --show-sdk-path\); /, ''), 17, 540) + '</div>') +
    bang(['system call', 'Linux arm64 (365 numbers)', 'macOS (467 numbers)'], [
      ['write', '<b>64</b>', '<b>4</b>'], ['fork', 'none — it is clone (220)', '2'], ['posix_spawn', 'none — a glibc function', '244'],
    ], 22) },

  { t: 'Who may call the kernel directly?', giua: true, to: true, body:
    box('🐧 Linux — the kernel is the API', 'Syscall numbers never change meaning. Static binaries, Go programs and container images rely on it.', 'xanh') +
    box('🍎 macOS — only libSystem', 'Go 1.11 release notes: "the runtime now uses libSystem.dylib instead of calling the kernel directly" — to survive future macOS releases.', 'lam') +
    box('⊞ Windows — only Win32 (per the docs)', 'kernel32 is the stable API; the syscall stubs in ntdll use numbers that are undocumented and change between Windows builds.', '') },

  { t: 'Pitfall: "it is Unix on my Mac, so Linux will match"', giua: true, to: true, body: vsd(
    'Hard-code <code class="i">4096</code> as the page size; build on the Mac and copy the binary to the server; assume the same init and syscall numbers.',
    'Ask the system: <code class="i">sysconf(_SC_PAGESIZE)</code>, <code class="i">getconf PAGESIZE</code>. Build Linux artefacts <b>in Linux</b> (Mach-O ≠ ELF). Test in the lab before deploying.') },

  { t: 'Practice: one table, three kernels', giua: true, to: true, body: `
<ol>
<li>Mac: <code class="i">sw_vers</code>, <code class="i">sysctl -n kern.version</code>, <code class="i">sysctl hw.pagesize hw.ncpu</code></li>
<li>Lab: <code class="i">uname -srm</code>, <code class="i">getconf PAGESIZE</code>, <code class="i">ps -o pid,comm -p 1,2</code> with <code class="i">--pid=host</code></li>
<li>Windows teammate: <code class="i">[Environment]::OSVersion</code>, <code class="i">Get-Process -Id 4</code></li>
<li>Fill: kernel + version, PID 1, page size, executable format</li>
</ol>` + box('Done when', 'three kernels in one table, and one sentence each on why macOS is "Unix" but not Linux and Windows is neither.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Three OSes, three kernels: <b>Linux</b>, <b>XNU</b> (Mach + BSD), <b>NT</b></li>
<li>macOS and Linux are POSIX cousins; Windows is another family</li>
<li>Measured: xnu-13432, launchd, <b>16 KiB</b> pages vs Linux’s <b>4 KiB</b></li>
<li>Only Linux keeps syscall numbers stable (write = 64 vs 4)</li>
<li>Works on my Mac ≠ works on Linux — test in Linux</li>
</ul>` },
]);
