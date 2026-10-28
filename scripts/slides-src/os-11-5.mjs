/**
 * os-11-5 — khoá "Operating Systems for Developers", bài 11.5 "errno, signals and interrupted calls" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c115-eintr.out.txt qua grab(); mã nguồn từ lab/code/ch11.
 * Giảng: content/courses/operating-systems-for-developers/giang/os-11-5.mjs.
 */
import { lamDeck, sh, box, cards, vsd, sql, tbl } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';
import fs from 'node:fs';

export const deck = { key: 'os-11-5', code: 'OS 11.5', title: 'errno, signals and interrupted calls', sub: 'Operating Systems · Chapter 11' };

const g = (pre, n = 1) => grab('c115-eintr', pre, n);
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
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', PU = '#7b4fa0';
const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" style="display:block;margin:0 auto">${inner}</svg>`;

/* dòng thời gian: read chặn 0→2 s, SIGALRM lúc 1 s, ba kết cục */
const timeline = () => {
  const X = 250, W = 780, sx = (t) => X + t / 2.3 * W;
  let s = `<line x1="${X}" y1="40" x2="${X + W}" y2="40" stroke="#bbb" stroke-width="2"/>`;
  [0, 0.5, 1, 1.5, 2].forEach((t) => { s += `<line x1="${sx(t)}" y1="34" x2="${sx(t)}" y2="46" stroke="#bbb" stroke-width="2"/>` + T(sx(t), 26, `${t} s`, 14, { a: 'middle', f: '#888' }); });
  s += `<line x1="${sx(1)}" y1="48" x2="${sx(1)}" y2="320" stroke="${OR}" stroke-width="2.5" stroke-dasharray="6 5"/>` + T(sx(1) + 8, 66, 'SIGALRM', 16, { w: 800, f: OR });
  s += `<line x1="${sx(2)}" y1="48" x2="${sx(2)}" y2="244" stroke="${GR}" stroke-width="2.5" stroke-dasharray="6 5"/>` + T(sx(2) + 8, 66, 'data arrives', 16, { w: 800, f: GR });
  const rows = [
    ['no SA_RESTART', [[0, 1, 'read() blocks', BL], [1, 2, '-1 EINTR → your loop calls read() again', RD]], 'read = 5 at 2.0 s'],
    ['SA_RESTART', [[0, 1, 'read() blocks', BL], [1, 2, 'kernel restarts read() by itself', GR]], 'read = 5 at 2.0 s'],
    ['poll / epoll_wait', [[0, 1, 'poll() blocks', BL], [1, 1.12, '', RD]], '-1 EINTR at 1.0 s, even with SA_RESTART'],
  ];
  rows.forEach(([name, segs, end], i) => {
    const y = 90 + i * 78;
    s += T(X - 12, y + 26, name, 16, { a: 'end', w: 800, m: 1 });
    segs.forEach(([a, b, lab, c]) => { s += R(sx(a), y + 4, sx(b) - sx(a), 34, c + '22', c, { rx: 4 }) + (lab ? T(sx(a) + 10, y + 27, lab, 15, { f: c, w: 700 }) : ''); });
    s += T(i === 2 ? sx(1.15) + 6 : sx(2) + 8, y + 27, end, 15, { f: '#444', w: 700 });
  });
  s += T(X, 350, 'Each row is measured below with strace: the same program, three ways of handling one SIGALRM.', 16, { f: '#666' });
  return svg(1110, 362, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 11 — System calls', bai: '11.5',
}, [
  { cover: true, t: 'errno, signals and<br>interrupted system calls', sub: 'EINTR and SA_RESTART, EAGAIN and non-blocking I/O, EPIPE and SIGPIPE' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>errno</b> values a backend developer actually meets</li>
<li>What happens when a <b>signal</b> arrives during a blocking call</li>
<li><b>EINTR</b>, <b>SA_RESTART</b> — and the calls that never restart</li>
<li><b>EAGAIN</b>: “not now” instead of waiting — Chapter 10’s starting point</li>
<li><b>EPIPE</b> vs <b>SIGPIPE</b>: writing to someone who left</li>
</ul>` },

  { t: 'The errno values you will see in logs', giua: true, body: tbl(['errno', 'name', 'what it usually means for you'], [
    ['1', 'EPERM', 'not allowed: capability or seccomp (11.7)'], ['2', 'ENOENT', 'no such file — read the path in strace'],
    ['4', '<b>EINTR</b>', 'a signal interrupted a blocking call — <b>retry</b>'], ['9', 'EBADF', 'fd already closed (a use-after-close bug)'],
    ['11', '<b>EAGAIN</b>', 'non-blocking: nothing yet — <b>wait, then retry</b>'], ['13', 'EACCES', 'file permissions (Ch9)'],
    ['24', 'EMFILE', 'out of file descriptors (lesson 2.5)'], ['28', 'ENOSPC', 'disk full (lesson 2.4)'],
    ['32', 'EPIPE', 'the reader closed the pipe/socket'], ['110 / 111', 'ETIMEDOUT / ECONNREFUSED', 'nobody answered / nobody listening'],
  ]) + `<div class="cap">Numbers printed in the lab by Python’s errno module (Linux values).</div>` },

  { t: 'A signal arrives while read() is blocked', body: timeline() },

  { t: 'The experiment: a pipe, a late writer, an alarm', giua: true, body: code((() => { const L = SRC('eintr.c').split('\n'); return [L[12], '', ...L.slice(17, 28), '    /* … the "poll" mode calls poll() here instead … */', ...L.slice(34, 40)].join('\n'); })(), 'c', 13.5) },

  { t: 'Without SA_RESTART: read() fails with EINTR', giua: true, body: `
${tiny(g('strace -qq -e trace=read,rt_sigreturn ./eintr norestart'), 14)}
${box('', '<b>ERESTARTSYS</b> is the kernel’s internal “interrupted, may restart”. The handler had no SA_RESTART, so after it ran (rt_sigreturn) the call returned <b>-1 EINTR</b>. The program’s loop asked again and got the data at 2.0 s.', 'do2')}` },

  { t: 'With SA_RESTART: the kernel asks again for you', giua: true, body: `
${tiny(g('strace -qq -e trace=read,rt_sigreturn ./eintr restart'), 14)}
${box('', 'Same signal, same handler. rt_sigreturn put the original arguments back (x0 = fd 3) and re-ran the svc: the program never saw the interruption.', 'xanh')}` },

  { t: 'Some calls are never restarted', giua: true, body: `
${tiny(g('strace -qq -e trace=ppoll,rt_sigreturn ./eintr poll'), 14)}
${cards([
    ['always EINTR', 'poll, epoll_wait, select, nanosleep, sigtimedwait… — even with SA_RESTART (man 7 signal).'],
    ['why', 'They have timeouts; restarting would silently stretch the timeout.'],
    ['so', 'Every event loop must treat EINTR from its wait call as “loop again”.'],
  ])}` },

  { t: 'Python retries for you (PEP 475)', giua: true, body: `
${tiny(g('strace -qq -e trace=read,rt_sigreturn -e signal=SIGALRM python3'), 14)}
${box('', 'Python installs handlers without SA_RESTART, so the kernel returns EINTR — then Python runs your handler and calls read() again. Since 3.5 you never see EINTR. libuv (Node) and the JVM retry too.', 'xanh')}` },

  { t: 'Go preempts goroutines with signals', giua: true, to: true, body: `
${tiny(g('TIMEFORMAT') + '\n' + g('CGO_ENABLED=0 go build -o spin', 2), 14)}
${box('Async preemption (Go 1.14)', 'Two busy goroutines on one thread: the runtime sends itself <b>SIGURG</b> ~33 times a second to switch between them. Go 1.14’s release notes warned that programs would therefore see <b>more EINTR</b> from slow syscalls made through syscall/x/sys/unix.', 'lam')}` },

  { t: 'EAGAIN: “not now” instead of waiting', giua: true, body: `
${tiny(g('gcc -O2 -Wall nb.c'), 14)}
${cards([
    ['O_NONBLOCK', 'Empty pipe → -1 EAGAIN in 11 µs. The thread is free to do something else.'],
    ['blocking', 'The reader sleeps inside the kernel: wchan = anon_pipe_read, syscall 63 = read.'],
    ['the server way', 'Non-blocking sockets + one wait for all of them: epoll (Chapter 10).'],
  ])}` },

  { t: 'EPIPE and SIGPIPE: writing to someone who left', giua: true, body: `
${tiny(g('strace -qq -o yes.txt'), 13)}
${tiny(g('strace -qq -o py.txt'), 12)}` },

  { t: 'Why servers ignore SIGPIPE', giua: true, to: true, body: cards([
    ['default action', 'SIGPIPE kills the process. A C server whose client disconnects mid-response would die.'],
    ['Node, Python, Java', 'Ignore SIGPIPE at startup and turn EPIPE into an error/exception you can handle.'],
    ['per call', 'send(…, MSG_NOSIGNAL) — curl’s sendto in lesson 11.3 used exactly that flag.'],
    ['in C', 'signal(SIGPIPE, SIG_IGN) once at startup, then check write() for EPIPE.'],
  ], 2) },

  { t: 'Preview of Chapter 10: you already saw the pieces', giua: true, body: tbl(['seen in', 'call', 'result', 'meaning'], [
    ['11.2 (libuv)', 'connect()', '-1 EINPROGRESS', 'started; epoll says when it is done'],
    ['11.2 (libuv)', 'accept4(…, SOCK_NONBLOCK)', 'fd 20', 'the new socket will never block'],
    ['11.3 (curl)', 'recvfrom()', '-1 EAGAIN', 'no data yet; wait in ppoll'],
    ['11.3 (Node)', 'epoll_pwait()', '1 ready fd', 'one thread waits for all sockets'],
  ]) + box('', 'Chapter 10 builds an echo server with epoll and compares it with io_uring. Here, remember the contract: <b>EAGAIN means “wait, then retry”</b>, never “fail”.', 'lam') },

  { t: 'Pitfall: two errors that are not errors', giua: true, to: true, body: vsd(
    'C code that treats <b>-1</b> from read/write/poll as fatal: a SIGCHLD or a profiler’s SIGPROF turns into a random “Interrupted system call” crash; a non-blocking socket turns into “Resource temporarily unavailable” errors under load.',
    'EINTR → retry the call (or let the runtime do it). EAGAIN → wait for readiness (poll/epoll), then retry. Only other errno values are real failures.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>A signal during a blocking call ⇒ <b>EINTR</b>, unless <b>SA_RESTART</b> — and waits are never restarted</li>
<li>Python, libuv and the JVM retry EINTR for you; C and raw Go syscalls must</li>
<li><b>EAGAIN</b> = non-blocking “not now”: wait for readiness, then retry</li>
<li><b>SIGPIPE</b> kills by default; servers ignore it and handle <b>EPIPE</b></li>
</ul>` },
]);
