/**
 * os-11-2 — khoá "Operating Systems for Developers", bài 11.2 "Write a raw system call yourself" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c112-raw.out.txt qua grab(); mã nguồn từ lab/code/ch11.
 * Giảng: content/courses/operating-systems-for-developers/giang/os-11-2.mjs.
 */
import { lamDeck, sh, box, cards, vsd, tbl, sql, two } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';
import fs from 'node:fs';

export const deck = { key: 'os-11-2', code: 'OS 11.2', title: 'Write a raw system call yourself', sub: 'Operating Systems · Chapter 11' };

const g = (pre, n = 1) => grab('c112-raw', pre, n);
const SRC = (f) => fs.readFileSync(new URL(`../../content/courses/operating-systems-for-developers/lab/code/ch11/${f}`, import.meta.url), 'utf8');
const wrap = (t, max) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k + 1) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
const tiny = (t, fs = 14) => sh(wrap(t.replace(/\t+/g, '  '), Math.floor(1060 / (fs * 0.602))), { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.36">`);
const code = (src, lang = 'c', fs = 14) => sql(src, { lang, sm: true }).replace('<pre class="vs sm">', `<pre class="vs sm" style="font-size:${fs}px">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', PU = '#7b4fa0';
const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" style="display:block;margin:0 auto">${inner}</svg>`;

/* Bốn tầng đi xuống, mỗi tầng một hàng: ai lo bộ đệm, ai đổi lỗi */
const ladder = () => {
  const rows = [
    ['printf("…")', 'stdio buffer → write later', 'buffers · formats · errno', BL],
    ['write(fd, buf, n)', 'libc wrapper → svc now', 'errno on failure · cancellation point', BL],
    ['syscall(SYS_write, …)', 'generic libc wrapper', 'errno on failure · any number', OR],
    ['svc #0 / syscall', 'your own asm, no libc', 'raw -errno · nothing else', RD],
  ];
  let s = '';
  rows.forEach(([a, b, c, col], i) => {
    const y = 6 + i * 112, x = 20 + i * 50;
    s += R(x, y, 1090 - x, 96, col + '12', col) + T(x + 22, y + 40, a, 23, { m: 1, w: 800, f: col }) + T(x + 22, y + 72, b, 18, { f: '#444' }) + T(1070, y + 58, c, 18, { a: 'end', f: '#555' });
  });
  s += T(20, 476, '↓ less code between you and the kernel — and less help', 19, { w: 700, f: RD });
  return svg(1110, 486, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 11 — System calls', bai: '11.2',
}, [
  { cover: true, t: 'Write a raw system call<br>yourself', sub: 'syscall(), inline svc #0, no libc at all — and how Node, the JVM and Go do it' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Four ways to print, from <b>printf</b> down to one <b>svc #0</b></li>
<li>What libc does for you — and what you lose without it</li>
<li>A working program of <b>1,632 bytes</b> with no libc at all</li>
<li>How <b>libuv</b>, the <b>JVM</b> and the <b>Go runtime</b> reach the kernel</li>
</ul>` },

  { t: 'Four doors to the same write()', body: ladder() },

  { t: 'The bottom step: registers and one instruction', giua: true, body: code(SRC('raw.c').split('\n').slice(9, 27).join('\n'), 'c', 13.5) },

  { t: 'Run it: the printf line arrives last', giua: true, body: `
${tiny(g('gcc -O2 -Wall raw.c'), 15)}
${box('Why last?', 'Lines 2–4 trapped immediately. printf only filled the stdio buffer; stdout is a pipe, so it was flushed by <b>exit()</b> — lesson 11.1.', 'lam')}` },

  { t: 'strace sees all four the same way', giua: true, body: `
${tiny(g('strace -qq -e trace=write ./raw'), 14.5)}
${box('', 'The kernel cannot tell libc from hand-written assembly: same number, same registers, same answer.', 'xanh')}` },

  { t: 'The error path at three levels', giua: true, to: true, body: tbl(['level', 'returns for fd 99', 'errno'], [
    ['write()', '-1', '9 (EBADF)'],
    ['syscall(SYS_write, …)', '-1', '9 (EBADF)'],
    ['svc #0 by hand', '<b>-9</b>', '<b>0 — untouched</b>'],
  ], { hl: [2] }) + box('', 'The kernel always answers <b>-errno</b>. Only libc turns that into -1 + errno. Raw code that checks <code class="i">== -1</code> never sees the error.', 'do2') },

  { t: 'A whole program with no libc', giua: true, body: code(SRC('tiny.c').split('\n').slice(4).join('\n'), 'c', 13) + tiny(g('gcc -O2 -static -nostdlib') + '\n' + g('./tiny') + '\n' + g('strace ./tiny'), 13) },

  { t: '1,632 bytes vs 711,936 — and what is missing', giua: true, to: true, body: cards([
    ['no main()', 'The kernel jumps to _start; nobody parses argv or runs constructors.'],
    ['no printf, no malloc', 'Only what you write yourself — or what the kernel offers.'],
    ['no errno, no buffering', 'Raw -errno; every write is a syscall.'],
    ['why care', 'Tiny static tools, init programs, shellcode analysis (Ch13) — and to SEE that libc is just code.'],
  ], 2) },

  { t: 'Node: libuv calls libc — two ways of waiting', giua: true, body: `
${tiny(g("objdump -T $(which node)"), 14)}
${tiny(g('strace -f -qq -e trace=openat,connect,accept4'), 11.5)}
${box('', 'The file was opened on <b>another thread</b> (libuv thread pool); the sockets stayed on the main thread, <b>non-blocking</b> (EINPROGRESS, SOCK_NONBLOCK) and watched by epoll.', 'lam')}` },

  { t: 'The JVM: native code over libc, many threads', giua: true, body: `
${tiny(g('javac Hello.java') + '\n' + g('objdump -T /opt/java/openjdk/lib/libjava.so'), 14)}
${tiny(g('strace -f -c -o jc.txt java Hello'), 13)}` },

  { t: 'Go: no libc — its own svc, its own scheduler', giua: true, body: `
${tiny(g('CGO_ENABLED=0 go build') + '\n' + g('ldd hello-go') + '\n' + g("go tool objdump -s"), 13.5)}
${tiny(g('strace -f -c -o goc.txt ./hello-go'), 13)}` },

  { t: 'Why Go bypasses libc (on Linux only)', giua: true, to: true, body: cards([
    ['static binaries', 'One file, runs FROM scratch in Docker, no glibc version to match.'],
    ['its own scheduler', 'runtime.entersyscall/exitsyscall: a blocking call frees the P so other goroutines keep running.'],
    ['114 rt_sigaction', 'The runtime installs a handler for every signal (preemption, crashes, os/signal).'],
    ['only where it is safe', 'Linux promises a stable syscall ABI. On macOS and OpenBSD Go calls libc, because those kernels do not.'],
  ], 2) },

  { t: 'Pitfall: hand-made syscalls skip the safety nets', giua: true, to: true, body: vsd(
    'Raw <b>svc</b> returns -errno, sets no errno, is not a cancellation point, and its number is per-architecture. A raw <code class="i">clone</code>/<code class="i">exit</code> behind libc’s back corrupts its thread state.',
    'Use the libc wrapper, or <code class="i">syscall(SYS_x, …)</code> for calls libc lacks. Hand-written asm: only to learn, or in a runtime that owns everything (Go).') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>A syscall is <b>number + registers + one instruction</b>; libc is optional</li>
<li>Without libc: no errno, no buffering — the kernel answers <b>-errno</b></li>
<li>Node (libuv) and the JVM call <b>glibc</b>; Go issues <b>svc</b> itself</li>
<li>Runtimes add the policy: thread pools, non-blocking sockets, schedulers</li>
</ul>` },
]);
