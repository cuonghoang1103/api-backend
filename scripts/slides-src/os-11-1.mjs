/**
 * os-11-1 — khoá "Operating Systems for Developers", bài 11.1 "One printf, followed into the kernel" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c111-hanh-trinh.out.txt + c111-kernel.out.txt qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-11-1.mjs.
 */
import { lamDeck, sh, box, cards, vsd, steps, tbl, sql } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-11-1', code: 'OS 11.1', title: 'One printf, followed into the kernel', sub: 'Operating Systems · Chapter 11' };

const g = (pre, n = 1) => grab('c111-hanh-trinh', pre, n);
const k = (pre, n = 1) => grab('c111-kernel', pre, n);
const wrap = (t, max) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k + 1) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
const tiny = (t, fs = 14) => sh(wrap(t, Math.floor(1060 / (fs * 0.602))), { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.36">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
const A = (x1, y1, x2, y2, c, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="6 5"' : ''} marker-end="url(#ar${c.slice(1)})"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', GY = '#8a8a8a', PU = '#7b4fa0';
const mk = (m) => `<marker id="ar${m.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`;
const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" style="display:block;margin:0 auto"><defs>${[BL, GR, RD, OR, GY, PU].map(mk).join('')}</defs>${inner}</svg>`;

/* Bản đồ hành trình: user space (trên) — đường kẻ ranh giới — kernel (dưới); đường về + giá đo được. */
const journey = () => {
  let s = '';
  s += R(10, 6, 1090, 196, BL + '08', BL + '55', { rx: 12, dash: 1 }) + T(26, 32, 'USER MODE (EL0) — your process', 16, { w: 800, f: BL });
  s += R(10, 238, 1090, 222, PU + '08', PU + '55', { rx: 12, dash: 1 }) + T(26, 450, 'KERNEL MODE (EL1)', 16, { w: 800, f: PU });
  const box = (x, w, y, a, b, c) => R(x, y, w, 86, '#fff', c) + T(x + w / 2, y + 36, a, 15, { a: 'middle', m: 1, w: 700, f: c }) + T(x + w / 2, y + 64, b, 15, { a: 'middle', f: '#555' });
  s += box(24, 170, 52, 'printf("hi\\n")', 'your code', BL);
  s += box(230, 230, 52, 'puts → _IO_file_write', 'stdio buffer (libc)', BL);
  s += box(496, 180, 52, '__libc_write', 'x6 = 64 (write)', BL);
  s += box(712, 250, 52, '__internal_syscall_cancel', 'x8 = 64 · svc #0', RD);
  [[194, 230], [460, 496], [676, 712]].forEach(([a, b]) => { s += A(a, 95, b - 2, 95, BL); });
  s += A(837, 140, 837, 268, RD, { sw: 3 }) + T(849, 206, 'trap', 17, { w: 800, f: RD });
  s += `<line x1="10" y1="220" x2="1100" y2="220" stroke="${RD}" stroke-width="2" stroke-dasharray="3 6"/>` + T(24, 233, 'the boundary', 14, { f: RD });
  s += box(712, 250, 270, 'el0_svc → do_el0_svc', 'save user registers', PU);
  s += box(470, 206, 270, 'sys_call_table[64]', 'invoke_syscall', PU);
  s += box(232, 202, 270, '__arm64_sys_write', 'ksys_write → vfs_write', PU);
  s += box(24, 172, 270, 'write_null', 'the /dev/null driver', GR);
  [[712, 676], [470, 434], [232, 196]].forEach(([a, b]) => { s += A(a, 313, b + 2, 313, PU); });
  s += `<path d="M110,358 L110,410 L1046,410 L1046,95 L966,95" fill="none" stroke="${GR}" stroke-width="2.5" stroke-dasharray="7 5" marker-end="url(#ar${GR.slice(1)})"/>`;
  s += T(560, 434, 'return: x0 = bytes written (10) — or -errno (-2 = ENOENT)', 16, { a: 'middle', w: 700, f: GR });
  s += T(1030, 388, 'round trip ≈ 180 ns', 17, { a: 'end', w: 800, f: OR });
  return svg(1110, 466, s);
};

/* sys_call_table: mảng con trỏ hàm đánh số */
const table = () => {
  let s = '';
  const rows = [['56', '__arm64_sys_openat'], ['57', '__arm64_sys_close'], ['63', '__arm64_sys_read'], ['64', '__arm64_sys_write'], ['94', '__arm64_sys_exit_group'], ['172', '__arm64_sys_getpid']];
  s += T(40, 30, 'sys_call_table — an array of function pointers, indexed by x8', 19, { w: 800, f: PU });
  rows.forEach(([n, f], i) => {
    const y = 50 + i * 52, hot = n === '64';
    s += R(40, y, 110, 42, hot ? RD + '22' : '#fff', hot ? RD : GY, { rx: 4 }) + T(95, y + 28, `[${n}]`, 19, { a: 'middle', m: 1, w: 700, f: hot ? RD : '#444' });
    s += A(152, y + 21, 240, y + 21, hot ? RD : GY) + T(250, y + 28, f, 19, { m: 1, w: hot ? 800 : 400, f: hot ? RD : '#444' });
  });
  s += R(640, 70, 440, 230, BL + '10', BL, { rx: 10 }) + T(860, 108, 'svc #0 with x8 = 64', 21, { a: 'middle', m: 1, w: 800, f: BL });
  s += T(860, 150, 'the kernel checks x8 < NR_syscalls,', 18, { a: 'middle' }) + T(860, 178, 'loads table[x8] and calls it', 18, { a: 'middle' });
  s += T(860, 222, 'an unknown number → -ENOSYS', 18, { a: 'middle', f: RD, w: 700 }) + T(860, 262, 'this kernel: 434 handlers', 18, { a: 'middle', f: '#555' });
  return svg(1110, 370, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 11 — System calls', bai: '11.1',
}, [
  { cover: true, t: 'One printf,<br>followed into the kernel', sub: 'Wrapper, instruction, registers, table, handler, errno' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Every <b>system call</b> a tiny C program makes, and why</li>
<li>Where <b>printf</b> really ends: a wrapper, a number, one instruction</li>
<li>The <b>registers</b> at the exact moment of the trap</li>
<li>The kernel side: <b>table → handler → driver</b>, traced live</li>
<li>How a failure comes back as <b>-2</b> and becomes <b>errno = 2</b></li>
</ul>` },

  { t: 'The whole journey on one page', body: journey() },

  { t: `Everything “hello” asks the kernel: ${g('strace ./hello-static').split('\n').filter((l) => /^[a-z_0-9]+\(/.test(l)).length} calls`, giua: true, body: `
${tiny(g('strace ./hello-static'), 13.5)}` },

  { t: 'Startup is most of it; your line is one write()', giua: true, to: true, body: cards([
    ['execve', 'Replace the shell’s child with our program.'],
    ['brk · mprotect', 'Set up the heap; make relocated data read-only.'],
    ['set_tid_address · set_robust_list · rseq', 'Thread bookkeeping libc needs even with one thread.'],
    ['prlimit64 · getrandom', 'Stack size; random bytes for the stack canary.'],
    ['fstat(1)', 'Is stdout a terminal or a pipe? That decides buffering.'],
    ['write(1, …, 10) · exit_group(0)', 'The only line you wrote — then the end.'],
  ], 2) },

  { t: 'printf became puts — and wrote only at exit()', giua: true, body: `
${tiny(g('nm hello-static'), 14)}
${tiny(g("gdb -q -batch -ex 'catch syscall write'").split('\n').slice(3, 16).join('\n'), 13)}` },

  { t: 'The wrapper picks a number: 64 means write', giua: true, body: `
${tiny(g("objdump -d --no-show-raw-insn hello-static | awk '/<__libc_write>:/"), 14)}
${box('', 'glibc 2.43 routes every “cancellable” call through <b>__syscall_cancel</b> (a pthread cancellation point) before the trap.', 'lam')}` },

  { t: 'One instruction crosses the boundary: svc #0', giua: true, body: `
${tiny(g("objdump -d --no-show-raw-insn hello-static | awk '/<__internal_syscall_cancel>:/"), 17)}
${tiny(g('grep -wE'), 16)}` },

  { t: 'At the trap: the number in x8, arguments in x0–x2', giua: true, body: `
${tiny(g("gdb -q -batch -ex 'catch syscall write'").split('\n').slice(16).join('\n'), 16)}
${cards([
    ['x8 = 64', 'which service: write'],
    ['x0, x1, x2', 'fd 1 · buffer address · 10 bytes'],
    ['after: x0 = 10', 'the return value, in the same register'],
  ])}` },

  { t: 'The same contract on two CPUs', giua: true, body: tbl(['', 'arm64 (this lab)', 'x86-64 (most servers)'], [
    ['instruction', '<b>svc #0</b>', '<b>syscall</b>'],
    ['syscall number in', 'x8', 'rax'],
    ['arguments 1–6', 'x0 x1 x2 x3 x4 x5', 'rdi rsi rdx r10 r8 r9'],
    ['return value', 'x0', 'rax'],
    ['also destroyed', '—', 'rcx, r11 (the CPU saves rip/rflags there)'],
    ['write is number', '64', '1'],
  ]) + `<div class="cap">Source: man 2 syscall (Linux man-pages). Numbers differ per architecture — never hard-code them.</div>` +
  box('Who follows this contract?', 'libc (and so Node, Python, the JVM) for you; Go’s runtime and the raw.c of lesson 11.2 by hand. One wrong register = the wrong syscall.', 'lam') },

  { t: 'Inside the kernel: the chain, traced with ftrace', giua: true, body: `
${tiny(k('awk'), 15.5)}
${box('', 'Only for <b>our</b> process (set_ftrace_pid), in a throwaway <b>--privileged</b> container. <b>security_file_permission</b> is where AppArmor/SELinux/BPF-LSM can still say no.', 'lam')}` },

  { t: 'The syscall table is just an array', body: table() },

  { t: 'The way back: the kernel says -2, libc says -1 + errno', giua: true, body: `
${tiny(g('gcc -O2 -static fail.c') + '\n' + g('strace -e trace=openat ./fail'), 14)}
${tiny(g("gdb -q -batch -ex 'catch syscall openat'").split('\n').slice(3).join('\n'), 14)}` },

  { t: 'Node, Python, Java: the same write(1, …) at the end', giua: true, body: `
${tiny([g("strace -f -qq -e trace=write -e signal=none -o node.txt"), g("strace -f -qq -e trace=write -e signal=none python3"), g("strace -f -qq -e trace=write -e signal=none -o java.txt")].join('\n'), 14)}
${box('', 'Different runtimes, different libraries — one kernel API. The number before Java’s line is a <b>thread id</b>: <b>main()</b> does not run on the process’s first thread.', 'xanh')}` },

  { t: 'Pitfall: output that waits in a buffer is lost in a crash', giua: true, to: true, body: vsd(
    'stdout is a <b>pipe</b> (Docker logs, <code class="i">| tee</code>, systemd) ⇒ stdio buffers 4 KiB and writes at exit. A crash (SIGSEGV, SIGKILL, OOM 137) throws the buffer away — the last log lines never existed.',
    'Flush what must survive: <code class="i">fflush</code>/<code class="i">setvbuf(_IOLBF)</code> in C, <code class="i">PYTHONUNBUFFERED=1</code> or <code class="i">python -u</code>, stderr for errors. Check with <code class="i">strace -e trace=write</code>.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Your code never “does” I/O — it <b>asks</b>, with a number in a register</li>
<li>libc wraps it; <b>svc #0 / syscall</b> traps into the kernel</li>
<li>The kernel indexes <b>sys_call_table</b>, runs the handler, reaches the driver</li>
<li>Failure returns <b>-errno</b>; libc turns it into <b>-1 + errno</b></li>
<li>strace shows the calls, gdb the registers, ftrace the kernel side</li>
</ul>` },
]);
