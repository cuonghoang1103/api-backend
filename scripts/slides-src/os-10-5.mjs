/**
 * os-10-5 — khoá "Operating Systems for Developers", bài 10.5 "The same epoll underneath" (28/10/2026).
 * Output từ lab/out/c105-runtime.out.txt. Giảng: giang/os-10-5.mjs.
 */
import { lamDeck, box, cards, vsd, tbl, two, flow } from './_pg-chung.mjs';
import { META, g, SRC, dong, bo, noCmt, tiny, code, bars, BL, GR, RD, OR, PU } from './os-10-chung.mjs';

export const deck = { key: 'os-10-5', code: 'OS 10.5', title: 'The same epoll underneath', sub: 'Operating Systems · Chapter 10' };
const F = 'c105-runtime';
const T$ = 'strace -f -qq -e signal=none -e $T -p ';

export const slides = lamDeck(META('10.5'), [
  { cover: true, t: 'The same epoll<br>underneath', sub: 'Node, nginx, Java NIO, Netty, Go and asyncio — traced with strace, then loaded' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Six real servers, one client each, <b>traced call by call</b></li>
<li>The <b>skeleton</b> they all share — and the details where they differ</li>
<li>Who uses <b>level</b> vs <b>edge</b> triggered, and nginx’s <b>EPOLLEXCLUSIVE</b></li>
<li>How many <b>threads</b> an “event loop” process really has</li>
<li>The same load on all of them: <b>threads, RSS, CPU, p99</b></li>
</ul>` },

  { t: 'Node and Python: a few lines each', giua: true, body: `
${code(noCmt(SRC('echo.js')), 'javascript', 16)}
${code(noCmt(dong(SRC('echo_async.py'), 4, 12)), 'python', 16)}
${box('', 'Six servers: these two, Java NIO (the selector loop of 10.3 in Java), Netty 4.2 (twenty lines of bootstrap), Go — and nginx, which is only configuration.', 'lam')}` },

  { t: 'Go: blocking-style code, one goroutine per connection', giua: true, body: `
${code(noCmt(dong(SRC('echo.go'), 15, 35)).replace(/\t/g, '    '), 'go', 15)}
${box('', '<b>c.Read()</b> looks blocking — but it only parks the goroutine. The runtime waits on epoll for all of them (next slides).', 'xanh')}` },

  { t: 'One skeleton under all of them', giua: true, body: flow([
    { t: 'epoll_wait', s: 'sleep for all fds', mau: BL }, { t: 'accept4', s: 'new client fd', mau: OR },
    { t: 'epoll_ctl ADD', s: 'watch it', mau: PU }, { t: 'read / write', s: 'when ready', mau: GR }, { t: 'DEL + close', s: 'client left', mau: RD },
  ], { h: 170, fs: 21 }) + cards([
    ['Node, asyncio, Java NIO, Netty', 'level-triggered, one loop thread per loop'],
    ['Go', 'edge-triggered, registered once for IN + OUT; goroutines parked'],
    ['nginx', 'edge-triggered clients, EPOLLEXCLUSIVE listening socket per worker'],
  ]) },

  { t: 'Node (libuv): one loop thread', giua: true, body: `
${tiny(g(F, T$ + '$NODE'), 15)}
${box('', 'accept4 with <b>SOCK_CLOEXEC|SOCK_NONBLOCK</b>, ADD as <b>EPOLLIN</b> (level), then epoll again with timeout 0 to drain what else is ready before sleeping.', 'lam')}` },

  { t: 'Python asyncio: the same loop in Python', giua: true, body: `
${tiny(g(F, T$ + '$PY'), 15, 'Python asyncio (EpollSelector)')}
${box('', '<b>recvfrom/sendto</b> are what socket.recv/send compile to; the empty epoll_pwait(…, 0) calls drain whatever else is ready before the loop sleeps.', 'lam')}` },

  { t: 'Java NIO: Selector = epoll', giua: true, body: `
${tiny(g(F, T$ + '$NIO'), 16, 'Java NIO (sun.nio.ch.EPollSelectorImpl)')}
${box('', 'Plain <b>accept</b> (non-blocking set separately), then the same ADD → wait → read/write → DEL. One thread runs the Selector loop.', 'lam')}` },

  { t: 'Netty 4.2 native epoll: epoll_pwait2 + EPOLLRDHUP', giua: true, body: `
${tiny(g(F, T$ + '$NETTY'), 14)}
${box('', 'Netty’s own JNI transport: waits in <b>epoll_pwait2</b> with a 1-second timeout, registers <b>EPOLLRDHUP</b> to learn early that a peer closed; level-triggered in 4.2.', 'lam')}` },

  { t: 'Go: the read happens on ANOTHER thread', giua: true, body: `
${tiny(g(F, T$ + '$GO'), 15)}
${box('', 'Registered once with <b>EPOLLIN|EPOLLOUT|EPOLLRDHUP|EPOLLET</b>. Thread 1076 waited; thread 1052 did the read/write. Your goroutine “blocked” in c.Read() — the runtime parked it and resumed it on a free thread.', 'xanh')}` },

  { t: 'nginx: EPOLLEXCLUSIVE and edge-triggered clients', giua: true, body: `
${tiny(g(F, 'curl -s http://127.0.0.1:8080/hello'), 13)}
${box('', 'Both workers watch listening fd 4 with <b>EPOLLEXCLUSIVE</b> (one wakes). The winner DEL + ADDs it to move to the back of the queue. Timeouts in epoll_pwait = <b>client_header_timeout 60 s</b>, <b>keepalive_timeout 75 s</b>.', 'lam')}` },

  { t: 'The runtimes side by side', giua: true, body: tbl(['runtime (lab)', 'wait call', 'trigger', 'who waits', 'your code'], [
    ['Node 22.23 / libuv 1.51', 'epoll_pwait', 'level', '1 loop thread', 'callbacks, promises'],
    ['Python 3.14 asyncio', 'epoll_pwait', 'level', '1 loop thread', 'async / await'],
    ['Java 21 NIO', 'epoll_pwait', 'level', '1 thread per Selector', 'selector loop'],
    ['Netty 4.2.19 native', 'epoll_pwait2', 'level', 'N event loops (2)', 'handlers'],
    ['Go 1.27', 'epoll_pwait', 'edge', 'runtime threads', 'blocking-style goroutines'],
    ['nginx 1.28', 'epoll_pwait', 'edge + EXCLUSIVE', '1 per worker', 'configuration'],
  ]) },

  { t: '“Single-threaded” processes have many threads', giua: true, body: `
${tiny(bo(g(F, 'for p in $NODE $PY $NIO $NETTY $GO'), /^# /), 13)}
${box('', 'Node: loop + V8 helpers (the libuv pool starts later, 10.6). asyncio: + one executor thread (asyncio_0, from getaddrinfo). JVM: GC, JIT compilers… Go: 5 OS threads for any number of goroutines. <b>What is single is the thread that waits.</b>', 'lam')}` },

  { t: 'Same load for everyone: 2,000 conns × 10 msg/s', giua: true, body: `
${tiny(g(F, './do-tai.sh node 7301', 6), 14)}
${bars([['Go', 22.2, GR, '22 MiB'], ['Python', 36.9, BL, '37 MiB'], ['Node', 73.5, BL, '74 MiB'], ['Java NIO', 80.0, OR, '80 MiB'], ['Netty', 165.8, RD, '166 MiB']], { rowH: 36, fs: 16, label: 160, w: 900 })}` },

  { t: 'Where the differences come from', to: true, giua: true, body: cards([
    ['memory', 'follows the runtime, not the model: a JVM starts with a heap, JIT code, class metadata'],
    ['Python’s tail', 'p99 23 ms: one interpreter thread works through each batch of ready sockets'],
    ['Go’s CPU', '4.39 s: idle runtime threads spin briefly (futex, nanosleep, sched_yield) before sleeping'],
    ['io.Copy', 'go-copy: 3 fds per connection — Go picks splice(2) through a pipe for TCP→TCP'],
  ], 2) },

  { t: 'go-copy under strace: splice and spinning threads', giua: true, body: `
${tiny(g(F, 'strace -f -qq -c -p $GOC'), 16)}
${tiny(g(F, './tai 8080 2000 3 0'), 15, 'nginx: 2,000 idle connections')}` },

  { t: 'Pitfall: blocking the loop thread', giua: true, to: true, body: vsd(
    'fs.readFileSync, bcrypt.hashSync, time.sleep in async def, a JDBC call in a Netty handler — on the loop thread they stop EVERY connection of that loop.',
    'Move blocking work off the loop. Detect it: <code>node --trace-sync-io</code>, <code>PYTHONASYNCIODEBUG=1</code>, BlockHound (Netty/Reactor). Go moves other goroutines to other threads.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>All six run the same skeleton: <b>wait → accept → ADD → read/write → DEL</b></li>
<li>Level-triggered: Node, asyncio, Java NIO, Netty · edge: <b>Go, nginx</b></li>
<li>Go keeps blocking-style code by <b>parking goroutines</b> on the netpoller</li>
<li>Many threads per process; <b>one thread per loop waits</b></li>
<li>Costs differ by runtime (RSS 22–166 MiB), not by I/O model</li>
</ul>` },
]);
