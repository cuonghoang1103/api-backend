/**
 * os-11-7 — khoá "Operating Systems for Developers", bài 11.7 "Filtering syscalls with seccomp" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c117-seccomp.out.txt + c117-host.out.txt qua grab(); mã nguồn từ
 * lab/code/ch11. Giảng: content/courses/operating-systems-for-developers/giang/os-11-7.mjs.
 */
import { lamDeck, sh, box, cards, vsd, sql, tbl } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';
import fs from 'node:fs';

export const deck = { key: 'os-11-7', code: 'OS 11.7', title: 'Filtering syscalls with seccomp', sub: 'Operating Systems · Chapter 11' };

const g = (pre, n = 1) => grab('c117-seccomp', pre, n);
const h = (pre, n = 1) => grab('c117-host', pre, n);
const SRC = (f) => fs.readFileSync(new URL(`../../content/courses/operating-systems-for-developers/lab/code/ch11/${f}`, import.meta.url), 'utf8');
const wrap = (t, max) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k + 1) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
const tiny = (t, fs = 14) => sh(wrap(t, Math.floor(1060 / (fs * 0.602))), { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.36">`);
const code = (src, lang = 'c', fs = 14) => sql(src, { lang, sm: true }).replace('<pre class="vs sm">', `<pre class="vs sm" style="font-size:${fs}px">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"/>`;
const A = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2.5" marker-end="url(#ar${c.slice(1)})"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', PU = '#7b4fa0', GY = '#777777';
const mk = (m) => `<marker id="ar${m.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`;
const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" style="display:block;margin:0 auto"><defs>${[BL, GR, RD, OR, PU, GY].map(mk).join('')}</defs>${inner}</svg>`;

const filterSvg = () => {
  let s = '';
  s += R(20, 120, 230, 90, BL + '12', BL) + T(135, 158, 'svc #0', 22, { a: 'middle', m: 1, w: 800, f: BL }) + T(135, 188, 'x8 = nr, x0–x5 = args', 15, { a: 'middle', f: '#555' });
  s += A(252, 165, 330, 165, BL);
  s += R(334, 60, 384, 210, PU + '10', PU) + T(526, 92, 'seccomp filter (BPF)', 19, { a: 'middle', w: 800, f: PU });
  ['load arch → foreign ABI? kill', 'load nr → compare', 'optionally: compare args', 'return an action'].forEach((t, i) => { s += T(354, 128 + i * 36, `${i + 1}. ${t}`, 16, { m: 1 }); });
  const acts = [['ALLOW', 'run the syscall normally', GR], ['ERRNO(n)', 'skip it, return -n (EPERM, ENOSYS…)', OR], ['KILL_PROCESS', 'SIGSYS, exit 159', RD], ['TRAP / USER_NOTIF', 'signal handler / supervisor decides', PU], ['LOG', 'allow, but write an audit line', GY]];
  acts.forEach(([a, d, c], i) => { const y = 12 + i * 62; s += A(720, 165, 776, y + 26, c) + R(780, y, 320, 52, c + '14', c, { rx: 6 }) + T(794, y + 22, a, 16, { m: 1, w: 800, f: c }) + T(794, y + 43, d, 14, { f: '#444' }); });
  s += T(20, 300, 'runs in the kernel on every syscall entry · inherited by fork/exec · can only get stricter', 16, { f: '#666' });
  return svg(1110, 312, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 11 — System calls', bai: '11.7',
}, [
  { cover: true, t: 'Filtering system calls<br>with seccomp', sub: 'A filter by hand, EPERM vs ENOSYS vs SIGSYS, Docker’s default profile, an allowlist for Node' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Write a <b>seccomp filter</b> by hand and watch a syscall fail</li>
<li>Three actions: <b>EPERM</b>, <b>ENOSYS</b>, <b>kill</b> — and why the choice matters</li>
<li>The <b>clone3</b> story that broke containers in 2021</li>
<li>Docker’s <b>default profile</b>, your own profile, strict mode</li>
<li>An <b>allowlist</b> for a Node server — and the syscall it forgot</li>
</ul>` },

  { t: 'A tiny program the kernel runs on every syscall', body: filterSvg() + box('Where it sits', 'On the kernel’s entry path, <b>before</b> the sys_call_table lookup of lesson 11.1: a denied call never reaches its handler. Filters are classic BPF, checked by the kernel when loaded.', 'lam') },

  { t: 'The whole filter: seven instructions', giua: true, body: code(SRC('sandbox.c').split('\n').filter((l, i, a) => i >= a.findIndex((x) => /struct sock_filter f\[\]/.test(x)) && i <= a.findIndex((x) => /execvp\(argv\[2\]/.test(x))).join('\n'), 'c', 13) },

  { t: 'EPERM: the filter answers, the handler never runs', giua: true, body: `
${tiny(g('gcc -O2 -Wall sandbox.c') + '\n' + g('strace -f -qq -e trace=prctl,mkdirat'), 14)}
${box('', 'mkdirat was answered by the filter with <b>-1 EPERM</b>: the directory code of the kernel never ran. To the program it is an ordinary “Operation not permitted”.', 'lam')}` },

  { t: 'Inherited, stacked, one-way', giua: true, to: true, body: `
${tiny(g("grep -E '^(Seccomp|Seccomp_filters|NoNewPrivs):'") + '\n' + g("./sandbox eperm:mkdirat grep"), 15)}
${cards([
    ['stacked', 'Docker’s filter + ours = 2. Every filter runs; the strictest answer wins.'],
    ['inherited', 'grep was exec’d by sandbox — and runs inside the filter.'],
    ['NoNewPrivs = 1', 'Required to install a filter without CAP_SYS_ADMIN; also disables setuid (lesson 13.4).'],
  ])}` },

  { t: 'KILL: “Bad system call”, exit 159', giua: true, to: true, body: `
${tiny(g('./sandbox kill:mkdirat'), 15)}
${box('159 = 128 + 31', 'SIGSYS, signal 31. The process is gone before it can log anything — a different failure from EPERM, with a different exit code to look for.', 'do2')}` },

  { t: 'Errors that point the wrong way', giua: true, to: true, body: `
${tiny(g('./sandbox eperm:socket'), 16)}
${box('', 'socket() was blocked, so the DNS lookup could not even start — and curl reports “Could not resolve host”. A seccomp denial surfaces as whatever the program was trying to do — so when an error makes no sense inside a sandbox, trace the syscalls (as on slide 5) before debugging DNS.', 'do2')}` },

  { t: 'EPERM vs ENOSYS: the clone3 story', giua: true, body: `
${tiny(g('./sandbox eperm:clone3 python3') + '\n' + g('./sandbox eperm:clone3 java') + '\n' + g('./sandbox enosys:clone3 python3') + '\n' + g('strace -f -qq -e trace=clone,clone3'), 12.5)}` },

  { t: 'Why ENOSYS works: “no such call, use the old one”', giua: true, to: true, body: cards([
    ['2021', 'glibc 2.34 started creating threads with clone3. Older Docker profiles did not know clone3 and answered EPERM.'],
    ['EPERM', 'Means “forbidden”: glibc gave up, pthread_create failed — threads broke in new distro images.'],
    ['ENOSYS', 'Means “this kernel has no such call”: glibc falls back to clone, which the profile allows.'],
    ['lesson', 'Deny unknown/new syscalls with ENOSYS, not EPERM — Docker’s profile does exactly that now.'],
  ], 2) },

  { t: 'Docker’s default profile, read from the source', giua: true, body: `
${tiny(h('docker run --rm --label oslab=1 -v'), 12.5)}
${cards([
    ['deny by default', 'SCMP_ACT_ERRNO with errno 1 (EPERM) for anything not listed.'],
    ['361 + 65', 'Allowed for every container, plus 65 only with a capability, architecture or argument condition.'],
    ['clone3 → 38', 'ENOSYS unless the container has CAP_SYS_ADMIN — the fix from the previous slide.'],
  ])}` },

  { t: 'Default vs --security-opt seccomp=unconfined', giua: true, body: tiny(h("docker run --rm --label oslab=1 os-lab grep -E '^Seccomp'", 4) + '\n' + h('docker run --rm --label oslab=1 os-lab bash -c \'strace'), 13) },

  { t: 'Your own profile: one rule on top of “allow”', giua: true, body: tiny(h('cat lab/code/ch11/deny-mkdir.json', 2), 14) + box('', 'A real profile starts from Docker’s default and removes what your service never needs — never from “allow everything”.', 'lam') },

  { t: 'Strict mode (2005): read, write, exit — and nothing else', giua: true, body: `
${tiny(h(`docker run --rm --label oslab=1 -v "$PWD/lab/code/ch11":/lab/ch11 os-lab bash -c 'gcc`) + '\n' + h('docker run --rm --label oslab=1 --security-opt seccomp=unconfined -v'), 13)}
${cards([
    ['inside Docker', 'EINVAL: a process already under a filter cannot switch to strict mode.'],
    ['unconfined', 'write() works, getpid() → SIGKILL: exit 137.'],
    ['137 ≠ always OOM', 'Exit 137 means SIGKILL — the OOM killer is only one sender (Ch8).'],
  ])}` },

  { t: 'An allowlist from strace: Node needs 54 of 327', giua: true, body: `
${tiny(g("awk 'NR>2").split('\n').map((l) => (l.startsWith('$') || l.length < 120 ? l : l.trim().split(' ').reduce((acc, w) => { const last = acc[acc.length - 1]; if ((last + ' ' + w).length > 118) acc.push(w); else acc[acc.length - 1] = last ? last + ' ' + w : w; return acc; }, ['']).join('\n'))).join('\n') + '\n' + g('./allow node.sc node server.js', 2), 12.5)}
${box('', 'Record the calls the server makes (startup + 100 requests), allow only those, return EPERM for the rest. The server still answers — and 270 syscalls an attacker might want are gone.', 'xanh')}` },

  { t: 'The syscall the recording missed', giua: true, body: `
${tiny(g("timeout 8 ./allow node.sc node -e", 1) + '\n' + g('timeout 8 strace -f -qq -o hang.txt') + '\n' + g('echo exit >> node.sc'), 12.5)}
${box('Record the whole life of the service', 'The server never stopped while we recorded, so thread <b>exit</b> was not in the list: threads looped on EPERM and Node hung (124 = killed by timeout). Start with SCMP_ACT_LOG, run startup, traffic and shutdown, then enforce.', 'do2')}` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>seccomp = a BPF filter on every syscall: <b>ALLOW, ERRNO, KILL, TRAP, LOG</b></li>
<li>Filters are inherited and one-way; Docker loads one by default (<b>Seccomp: 2</b>)</li>
<li>Deny new calls with <b>ENOSYS</b>, not EPERM (clone3); KILL ⇒ exit <b>159</b></li>
<li>Never run apps <b>seccomp=unconfined</b>; tighten from the default</li>
<li>Allowlists from strace must cover the <b>whole lifecycle</b></li>
</ul>` },
]);
