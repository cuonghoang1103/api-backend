/**
 * os-10-2 — khoá "Operating Systems for Developers", bài 10.2 "Five ways to wait for data" (28/10/2026).
 * Output từ lab/out/c102-mo-hinh.out.txt (+ c107-uring cho io_uring khi seccomp=unconfined). Giảng: giang/os-10-2.mjs.
 */
import { lamDeck, box, cards, vsd, tbl, two } from './_pg-chung.mjs';
import { META, g, SRC, dong, noCmt, tiny, code, T, R, svg, BL, GR, RD, OR } from './os-10-chung.mjs';

export const deck = { key: 'os-10-2', code: 'OS 10.2', title: 'Five ways to wait for data', sub: 'Operating Systems · Chapter 10' };
const F = 'c102-mo-hinh';

/* Hình kinh điển của Stevens: 5 mô hình × 2 giai đoạn */
const haiGiaiDoan = () => {
  const X0 = 270, W1 = 520, W2 = 210, rowH = 66;
  let s = T(X0 + W1 / 2, 24, 'phase 1: wait for data', 18, { a: 'middle', w: 700, f: '#555' }) + T(X0 + W1 + 14 + W2 / 2, 24, 'phase 2: copy to you', 18, { a: 'middle', w: 700, f: '#555' });
  const rows = [
    ['1 blocking', [RD, 'thread blocked in read()'], [RD, 'blocked']],
    ['2 non-blocking', [OR, 'thread spins: EAGAIN, EAGAIN, …'], [RD, 'blocked']],
    ['3 multiplexing', [RD, 'blocked in poll/epoll — for MANY fds'], [RD, 'read()']],
    ['4 signal-driven', [GR, 'thread free … SIGIO'], [RD, 'read()']],
    ['5 asynchronous', [GR, 'thread free'], [GR, 'kernel copies → done']],
  ];
  rows.forEach(([n, a, b], i) => {
    const y = 40 + i * rowH;
    s += T(X0 - 14, y + 34, n, 19, { a: 'end', w: 700 });
    s += R(X0, y + 8, W1, 42, a[0] + '22', a[0], { rx: 5 }) + T(X0 + 14, y + 35, a[1], 17, { w: 700, f: a[0] });
    s += R(X0 + W1 + 14, y + 8, W2, 42, b[0] + '22', b[0], { rx: 5 }) + T(X0 + W1 + 28, y + 35, b[1], 17, { w: 700, f: b[0] });
  });
  const ly = 40 + 5 * rowH + 18;
  s += R(X0, ly, 18, 18, RD + '22', RD, { rx: 3 }) + T(X0 + 26, ly + 15, 'your thread is blocked', 15);
  s += R(X0 + 230, ly, 18, 18, OR + '22', OR, { rx: 3 }) + T(X0 + 256, ly + 15, 'your thread burns CPU', 15);
  s += R(X0 + 450, ly, 18, 18, GR + '22', GR, { rx: 3 }) + T(X0 + 476, ly + 15, 'your thread is free', 15);
  return svg(1020, ly + 30, s);
};

export const slides = lamDeck(META('10.2'), [
  { cover: true, t: 'Five ways<br>to wait for data', sub: 'Blocking, non-blocking, multiplexing, signal-driven and asynchronous I/O — in real code' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>two phases</b> of every input: wait for data, then copy it</li>
<li>Stevens’ <b>five I/O models</b>, each run on the same problem</li>
<li>What your thread does while waiting — read from <code>/proc</code> (<b>wchan</b>)</li>
<li>How much <b>CPU</b> waiting costs: from 0 ms to a full core</li>
<li>Why “async” in an API name may still mean <b>a hidden thread</b></li>
</ul>` },

  { t: 'Five models, two phases (Stevens, UNP §6.2)', giua: true, body: haiGiaiDoan() },

  { t: 'The experiment: data arrives after 1 second', giua: true, body: `
${code(noCmt(dong(SRC('cho.h'), 16, 23)), 'c', 16)}
${box('', 'Every model reads the same pipe. <code>peek.sh</code> looks at the program after 0.5 s and prints each thread’s <b>state</b> (R running, S sleeping) and <b>wchan</b> — the kernel function it sleeps in.', 'lam')}` },

  { t: 'Model 1 — blocking: sleep inside read()', giua: true, body: `
${code(noCmt(dong(SRC('m1-block.c'), 3, 8)), 'c', 17)}
${tiny(g(F, './m1-block &'), 16)}
${box('', 'State <b>S</b> in <b>anon_pipe_read</b>, 1 call, no CPU. Perfect for ONE wait — but one thread can wait for only one thing.', 'xanh')}` },

  { t: 'Model 2 — non-blocking alone: a busy loop', giua: true, body: `
${code(noCmt(dong(SRC('m2-nonblock.c'), 3, 12)), 'c', 15)}
${tiny(g(F, './m2-nonblock &'), 15)}
${box('', '<b>4.87 million</b> calls, <b>~1 s of CPU</b> in 1 s, state <b>R</b> — a whole core burned to wait for six bytes.', 'do2')}` },

  { t: 'strace confirms: every call failed with EAGAIN', giua: true, body: `
${tiny(g(F, 'strace -c -qq ./m2-nonblock'), 18)}
${cards([
    ['errors column', 'all but 2 calls returned −1 EAGAIN: “not now”'],
    ['why so few?', 'strace stops the program twice per call — 24 k instead of 4.87 M'],
    ['the fix', 'sleep until ready: poll / epoll (model 3)'],
  ])}` },

  { t: 'Model 3 — multiplexing: one wait for many fds', giua: true, body: `
${code(noCmt(dong(SRC('m3-poll.c'), 4, 11)), 'c', 16)}
${tiny(g(F, './m3-poll &'), 16)}
${box('', 'Sleeps in <b>poll_schedule_timeout</b>; then read() only copies. The array can hold <b>thousands</b> of fds — the base of nginx, Node, Netty, Go, asyncio, Redis.', 'xanh')}` },

  { t: 'Model 4 — signal-driven: the kernel sends SIGIO', giua: true, body: `
${tiny(g(F, './m4-sigio &'), 15)}
${tiny(g(F, 'strace -qq -o sigio.txt'), 15)}
${box('', '<b>F_SETOWN</b> + <b>O_ASYNC</b> ask for SIGIO when ready. Fine for UDP; for TCP one signal cannot tell which of thousands of sockets is ready (Stevens).', 'lam')}` },

  { t: 'Model 5 — POSIX aio: a thread in disguise', giua: true, body: `
${tiny(g(F, './m5-aio &'), 15)}
${tiny(g(F, 'strace -f -qq -o aio.txt'), 13)}
${box('', 'aio_read() created thread 95 (clone3 → ENOSYS from Docker’s seccomp → clone), and that thread does a <b>blocking read()</b>. Async for you, blocking for the kernel.', 'do2')}` },

  { t: 'Model 5 for real — io_uring', giua: true, body: `
${tiny(g(F, 'strace -qq -e trace=io_uring_setup'), 15, 'default Docker container')}
${tiny(g('c107-uring', './m5-uring &'), 15, 'throwaway container with seccomp=unconfined')}
${box('Completion, not readiness', 'Blocked by Docker’s default seccomp (<b>EPERM</b>, lesson 10.7). Where it is allowed, one thread sleeps in <b>io_cqring_wait</b> — and when it wakes, the data is <b>already in the buffer</b>.', 'lam')}` },

  { t: 'The five models, measured', giua: true, body: tbl(['model', 'while waiting', 'calls', 'CPU', 'where you meet it'], [
    ['1 blocking', 'sleeps in read()', '1', '~0', 'JDBC, requests, Spring MVC thread'],
    ['2 non-blocking', 'spins on EAGAIN', '4.87 M', '~1 s', 'never alone'],
    ['3 multiplexing', 'sleeps in poll/epoll, many fds', '2', '~0', 'nginx, Node, Netty, Go, asyncio'],
    ['4 signal-driven', 'free until SIGIO', '2 + signal', '~0', 'rare (UDP)'],
    ['5 asynchronous', 'free, kernel copies', '2', '~0', 'io_uring, IOCP (glibc aio = threads)'],
  ]) },

  { t: 'Readiness vs completion', to: true, giua: true, body: cards([
    ['Readiness (models 3, 4)', 'The kernel says <b>“fd 8 can be read now”</b>. Your thread still calls read() and copies. epoll, kqueue, select.'],
    ['Completion (model 5)', 'The kernel says <b>“your read of 64 bytes is done”</b> — the data is already in your buffer. io_uring, Windows IOCP.'],
  ], 2) },

  { t: 'Pitfalls', giua: true, to: true, body: vsd(
    'A “waiting” worker at 100% CPU: a loop around a non-blocking read, a flag, a queue.<br><br>Trusting “async” in a name: aio_read, fs.readFile, AsynchronousFileChannel all use threads.',
    'Wait for readiness (poll/epoll) or block; confirm with <b>strace -c</b> and <b>wchan</b>.<br><br>Check with <b>strace -f</b> and <code>/proc/PID/task/*/wchan</code> what really waits — and where.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Every input = <b>wait</b> + <b>copy</b>; the models differ in who waits and who copies</li>
<li>Blocking is efficient for one wait, but needs <b>one thread per wait</b></li>
<li>Non-blocking alone = <b>busy loop</b> (4.87 M calls, a full core)</li>
<li>Multiplexing lets <b>one thread</b> sleep on thousands of fds — every event loop</li>
<li>Real async on Linux = <b>io_uring</b>; glibc POSIX aio = a helper thread</li>
</ul>` },
]);
