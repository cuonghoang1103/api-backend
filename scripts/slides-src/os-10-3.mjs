/**
 * os-10-3 — khoá "Operating Systems for Developers", bài 10.3 "select, poll, epoll" (28/10/2026).
 * Output từ lab/out/c103-epoll.out.txt. Giảng: giang/os-10-3.mjs.
 */
import { lamDeck, box, cards, vsd, tbl, two } from './_pg-chung.mjs';
import { META, g, SRC, dong, noCmt, tiny, code, T, R, A, svg, bars, BL, GR, RD, OR, PU } from './os-10-chung.mjs';

export const deck = { key: 'os-10-3', code: 'OS 10.3', title: 'select, poll, epoll', sub: 'Operating Systems · Chapter 10' };
const F = 'c103-epoll';

/* bên trong một thực thể epoll: danh sách quan tâm + danh sách sẵn sàng */
const epollHinh = () => {
  let s = '';
  s += R(20, 30, 250, 250, BL + '10', BL) + T(145, 58, 'sockets', 19, { a: 'middle', w: 700, f: BL });
  ['fd 3  listen', 'fd 5  client', 'fd 6  client', 'fd 7  client'].forEach((x, i) => { s += R(40, 74 + i * 48, 210, 38, '#fff', '#9db4cc') + T(56, 99 + i * 48, x, 16, { m: 1 }); });
  s += R(330, 30, 380, 250, OR + '10', OR, { dash: '7 5' }) + T(520, 58, 'epoll instance (fd 4)', 19, { a: 'middle', w: 700, f: '#9a4a12' });
  s += R(350, 74, 340, 96, '#fff', OR) + T(520, 98, 'interest list', 17, { a: 'middle', w: 700, f: '#9a4a12' }) + T(520, 124, 'fd 3, 5, 6, 7 — added ONCE', 15, { a: 'middle', m: 1 }) + T(520, 150, 'by epoll_ctl(ADD)', 15, { a: 'middle', m: 1, f: '#666' });
  s += R(350, 188, 340, 76, GR + '12', GR) + T(520, 214, 'ready list', 17, { a: 'middle', w: 700, f: GR }) + T(520, 242, 'fd 6  (data arrived)', 15, { a: 'middle', m: 1, f: GR });
  s += A(252, 194, 348, 222, GR) + T(298, 238, 'callback', 14, { a: 'middle', f: GR });
  s += R(770, 120, 300, 110, PU + '10', PU) + T(920, 150, 'your loop', 19, { a: 'middle', w: 700, f: PU }) + T(920, 178, 'epoll_wait()', 16, { a: 'middle', m: 1 }) + T(920, 204, '→ returns only fd 6', 15, { a: 'middle', f: '#555' });
  s += A(692, 226, 768, 190, PU);
  return svg(1090, 300, s);
};
/* level vs edge: 10 byte tới một lần, đọc 4 byte mỗi lần */
const ltEt = () => {
  let s = '';
  const row = (y, name, marks, note, c) => {
    s += T(150, y + 26, name, 18, { a: 'end', w: 700 });
    s += `<line x1="170" y1="${y + 20}" x2="1060" y2="${y + 20}" stroke="#ccc" stroke-width="2"/>`;
    marks.forEach(([x, lab, cc, wd = 120]) => { s += R(x, y + 2, wd, 36, (cc || c) + '22', cc || c, { rx: 5 }) + T(x + wd / 2, y + 26, lab, 15, { a: 'middle', w: 700, f: cc || c }); });
    s += T(1060, y + 62, note, 15, { a: 'end', f: '#555' });
  };
  s += T(170, 22, '10 bytes arrive once ↓', 16, { w: 700, f: OR });
  row(36, 'level', [[180, 'read 4'], [330, 'read 4'], [480, 'read 2']], 'reported while unread data remains → 3 wake-ups, all read', GR);
  row(126, 'edge', [[180, 'read 4'], [330, '6 bytes left', RD]], 'reported once per arrival → 6 bytes stranded, epoll_wait times out', RD);
  row(216, 'edge + drain', [[180, 'read 4 + 4 + 2, then EAGAIN', BL, 270]], 'the ET rule: read (and write, accept) until EAGAIN', BL);
  return svg(1080, 290, s);
};

export const slides = lamDeck(META('10.3'), [
  { cover: true, t: 'select, poll, epoll', sub: 'Why only one scales, level vs edge triggered, EPOLLONESHOT — and a tiny echo server' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why <b>select</b> cannot use fd 1024 or above — measured as a crash</li>
<li>The cost of one wake-up at 10 … 10,000 fds: <b>O(N) vs O(1)</b></li>
<li>The <b>interest list</b> and the <b>ready list</b>, read from <code>/proc</code></li>
<li>A complete <b>epoll echo server</b>, traced call by call</li>
<li><b>Level vs edge</b> triggered, <b>EPOLLONESHOT</b> and <b>EPOLLEXCLUSIVE</b></li>
</ul>` },

  { t: 'select: a fixed array of 1,024 bits', giua: true, body: `
${tiny(g(F, 'gcc -O2 -o sel1024 sel1024.c'), 18)}
${box('', 'fd_set is indexed by the fd <b>number</b>. fd 1102 does not fit: FD_SET writes past the 128-byte array, glibc’s fortify check aborts (SIGABRT, <b>exit 134</b>). Without fortify: silent stack corruption.', 'do2')}` },

  { t: 'One wake-up, N watched fds: the measurement', giua: true, body: `
${tiny(g(F, 'gcc -O2 -Wall -o pollbench pollbench.c'), 16)}` },

  { t: 'poll grows with N, epoll stays flat', giua: true, body: `
${bars([
    ['poll, 10 fds', 1.33, OR, '1.3 µs'], ['epoll, 10 fds', 0.70, GR, '0.7 µs'],
    ['poll, 1,000 fds', 64.52, OR, '64.5 µs'], ['epoll, 1,000 fds', 0.72, GR, '0.7 µs'],
    ['poll, 10,000 fds', 676.02, RD, '676 µs'], ['epoll, 10,000 fds', 0.72, GR, '0.7 µs'],
  ], { rowH: 52, fs: 19 })}
${box('', 'poll copies, checks and returns <b>all N</b> entries on every call; epoll returns only the <b>ready</b> ones. 676 µs per wake-up ⇒ ~1,500 wake-ups/s per core: C10K in 1999.', 'lam')}` },

  { t: 'Inside an epoll instance: two lists', giua: true, body: epollHinh() + box('', '<b>epoll_ctl</b> edits the interest list once per fd · a kernel <b>callback</b> moves ready fds to the ready list · <b>epoll_wait</b> returns only those.', 'lam') },

  { t: 'The interest list, visible in /proc', giua: true, body: `
${tiny(g(F, 'ls -l /proc/$S/fd', 2), 15)}
${box('', 'fd 4 = <b>anon_inode:[eventpoll]</b>. One <b>tfd</b> line per watched fd (3 = listening socket, 5–7 = clients). <b>events: 19</b> = 0x1 EPOLLIN + 0x8 EPOLLERR + 0x10 EPOLLHUP.', 'lam')}` },

  { t: 'A tiny epoll echo server — the loop', giua: true, body: `
${code(noCmt(dong(SRC('echo-epoll.c'), 33, 46)) + '\n            /* … read, write; on a partial write wait for EPOLLOUT (backpressure, 10.8) … */', 'c', 16)}
${box('', 'One thread, one <b>epoll_wait</b> for every client. On the listening socket, <b>accept until EAGAIN</b> — several clients may be waiting behind one event.', 'xanh')}` },

  { t: 'One client, call by call', giua: true, body: `
${tiny(g(F, 'strace -qq -p $S', 3), 15)}
${box('', 'wait → <b>accept4</b> (until EAGAIN) → <b>epoll_ctl ADD</b> → wait → read/write → read 0 → <b>close</b> (removes it from the interest list).', 'xanh')}` },

  { t: 'Level-triggered vs edge-triggered', giua: true, body: `${ltEt()}
${box('', '<b>Level</b>: “is readable” on every wait. <b>Edge</b> (EPOLLET): “became readable”, once per arrival. Same 10 bytes, same 4-byte reads — only the flag differs.', 'lam')}` },

  { t: 'The measurement: 10 bytes, 4 per wake-up', giua: true, body: `
${code(noCmt(dong(SRC('trigger.c'), 27, 30)), 'c', 16)}
${tiny(g(F, 'gcc -O2 -Wall -o trigger trigger.c'), 17)}` },

  { t: 'Four threads, one epoll, one connection', giua: true, body: `
${tiny(g(F, 'gcc -O2 -Wall -pthread -o oneshot oneshot.c'), 14)}` },

  { t: 'Choosing the flags', giua: true, to: true, body: tbl(['flag', 'what it does', 'measured / used by'], [
    ['(level, default)', 'report while unread data remains', 'LT woke all 4 threads · libuv, asyncio, Java NIO, Netty 4.2'],
    ['EPOLLET', 'report once per new arrival', '6 bytes stranded unless drained · nginx, Go'],
    ['EPOLLONESHOT', 'disable after one event, re-arm with MOD', 'exactly one thread owns the connection'],
    ['EPOLLEXCLUSIVE', 'wake one of many waiters on a listen socket', 'nginx workers (lesson 10.5)'],
  ]) },

  { t: 'Pitfalls', giua: true, to: true, body: vsd(
    'Edge-triggered “for speed”, reading once per event → connections hang only under load.<br><br>close(fd) on a socket that was dup()ed or inherited by fork() → epoll keeps reporting it.',
    'With ET, loop <b>until EAGAIN</b> for read, write and accept — or stay level-triggered.<br><br><b>EPOLL_CTL_DEL</b> before close when fds are shared; open with <b>SOCK_CLOEXEC</b>.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li><b>select</b>: fd numbers ≥ 1024 impossible — FD_SET(1102) aborted (134)</li>
<li><b>poll</b>: O(N) per wake-up — 676 µs at 10,000 fds; <b>epoll</b>: 0.7 µs flat</li>
<li>epoll = <b>interest list</b> (epoll_ctl, once) + <b>ready list</b> (kernel callbacks)</li>
<li><b>Edge-triggered</b> needs non-blocking fds and draining until EAGAIN</li>
<li>Threads sharing one epoll: <b>EPOLLONESHOT</b> per connection, <b>EPOLLEXCLUSIVE</b> for listen</li>
</ul>` },
]);
