/**
 * os-10-6 — khoá "Operating Systems for Developers", bài 10.6 "Disk I/O in an event loop" (28/10/2026).
 * Output từ lab/out/c106-dia.out.txt (đĩa ghìm 50 MB/s). Giảng: giang/os-10-6.mjs.
 */
import { lamDeck, box, cards, vsd, tbl, two } from './_pg-chung.mjs';
import { META, g, SRC, dong, noCmt, tiny, code, T, R, A, svg, bars, BL, GR, RD, OR, PU } from './os-10-chung.mjs';

export const deck = { key: 'os-10-6', code: 'OS 10.6', title: 'Disk I/O in an event loop', sub: 'Operating Systems · Chapter 10' };
const F = 'c106-dia';

/* vòng lặp + eventfd + hàng đợi FIFO + 4 luồng pool */
const poolHinh = () => {
  let s = '';
  s += R(20, 40, 250, 200, BL + '10', BL) + T(145, 70, 'loop thread', 20, { a: 'middle', w: 700, f: BL });
  s += T(145, 100, 'epoll_wait(sockets,', 15, { a: 'middle', m: 1 }) + T(145, 122, 'eventfd 16)', 15, { a: 'middle', m: 1 });
  s += T(145, 160, 'runs callbacks', 15, { a: 'middle', f: '#555' }) + T(145, 184, 'never waits for disk', 15, { a: 'middle', f: GR, w: 700 });
  s += A(272, 90, 350, 90) + T(311, 80, 'submit', 14, { a: 'middle', f: '#b85a2b' });
  s += R(352, 40, 380, 110, OR + '10', OR, { dash: '7 5' }) + T(542, 64, 'pool queue (FIFO)', 17, { a: 'middle', w: 700, f: '#9a4a12' });
  const items = [['512 KiB', OR], ['512 KiB', OR], ['512 KiB', OR], ['stat', PU], ['lookup', PU]];
  items.forEach(([t, c], i) => { s += R(368 + i * 72, 82, 64, 50, c + '22', c, { rx: 4 }) + T(400 + i * 72, 112, t, 13, { a: 'middle', w: 700, f: c }); });
  s += A(734, 95, 800, 95);
  s += R(802, 30, 280, 210, GR + '10', GR) + T(942, 58, '4 pool threads', 18, { a: 'middle', w: 700, f: GR });
  for (let i = 0; i < 4; i++) s += R(822, 72 + i * 40, 240, 32, '#fff', GR) + T(942, 93 + i * 40, 'read(file, 512 KiB) — disk', 13, { a: 'middle', m: 1 });
  s += `<polyline points="942,242 942,282 145,282" fill="none" stroke="${GR}" stroke-width="2.5" stroke-dasharray="6 4"/>` + A(145, 282, 145, 244, GR, { dash: '6 4' });
  s += T(560, 306, 'task done → pool thread writes the eventfd → epoll wakes the loop → your callback runs', 15, { a: 'middle', f: GR, w: 700 });
  s += T(542, 180, 'a 1-µs stat waits behind every', 15, { a: 'middle', f: RD, w: 700 }) + T(542, 200, 'chunk queued before it', 15, { a: 'middle', f: RD, w: 700 });
  return svg(1100, 316, s);
};

export const slides = lamDeck(META('10.6'), [
  { cover: true, t: 'Disk I/O<br>in an event loop', sub: 'Why file reads go to a thread pool — and how a slow disk can make your DNS lookups slow' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why <b>epoll cannot wait for a disk</b> — measured</li>
<li><b>Page cache</b> hit vs miss: 0.7 µs or 21.8 µs, 0.002 s or 1.3 s</li>
<li>How Node uses the <b>libuv thread pool</b> and an <b>eventfd</b></li>
<li>16 cold file reads that make <b>dns.lookup wait 0.94 s</b></li>
<li>What Go, Java virtual threads, asyncio and nginx do with files</li>
</ul>` },

  { t: 'epoll refuses regular files; poll says “ready”', giua: true, body: `
${tiny(g(F, 'cat /sys/fs/cgroup/io.max', 2), 18)}
${box('', 'POSIX: regular files <b>always poll as ready</b> and ignore <b>O_NONBLOCK</b>. epoll rejects them (<b>EPERM</b>). Readiness says nothing about whether a read will hit the disk. (Disk throttled to <b>50 MB/s</b> with --device-read-bps, like a small VPS.)', 'lam')}` },

  { t: 'Page cache hit or miss: same read(), 31× apart', giua: true, body: `
${tiny(g(F, './evict /tmp/data; ./incache', 6), 15)}
${cards([
    ['4 KiB random read', 'disk p50 <b>21.8 µs</b> · page cache p50 <b>0.7 µs</b>'],
    ['64 MiB sequential', 'cold <b>1.304 s</b> · warm <b>0.002 s</b>'],
    ['your program', 'cannot know in advance which one it will get'],
  ])}` },

  { t: 'Node: the loop never waits for the disk — the pool does', giua: true, body: poolHinh() + box('', 'The loop only submits and collects. A slow disk now slows the <b>pool</b> — and everything else that shares it: dns.lookup, fs.stat, crypto, zlib.', 'lam') },

  { t: 'The pool starts lazily; files are read on pool threads', giua: true, body: `
${tiny(g(F, 'node threads.js'), 17)}
${tiny(g(F, 'strace -f -qq -e trace=openat,read'), 15)}
${box('', '7 → 11 threads at the first fs call. Thread 944 opens, 946 reads <code>"oslab\\n"</code>; the main thread 937 only reads <b>8 bytes from eventfd 16</b> — the “a task finished” signal.', 'lam')}` },

  { t: 'The experiment: 16 requests, 16 cold 4 MiB files', giua: true, body: `
${code(noCmt(dong(SRC('loop-lag.js'), 24, 31)), 'javascript', 13)}
<div style="font-size:15px;color:#555">Every 20 ms, four probes record their worst delay:</div>
${cards([
    ['event loop', 'a 10 ms timer: how late does it fire?'],
    ['net echo', 'a TCP round trip over loopback'],
    ['dns.lookup', 'getaddrinfo — runs on the pool'],
    ['fs.stat', '/etc/hosts, cached — runs on the pool'],
  ], 4)}` },

  { t: 'Results: sync, async, and a bigger pool', giua: true, body: `
${tiny(g(F, 'node loop-lag.js sync', 3), 17)}` },

  { t: 'Worst delays, measured', giua: true, body: `
${bars([
    ['readFileSync: event loop', 1256, RD, '1,256 ms'], ['readFile: event loop', 16, GR, '16 ms'],
    ['readFile: dns.lookup', 944, OR, '944 ms'], ['readFile: fs.stat', 479, OR, '479 ms'],
    ['pool 64: dns.lookup', 3, GR, '3 ms'], ['pool 64: fs.stat', 3, GR, '3 ms'],
  ], { rowH: 50, fs: 18, label: 300 })}
${box('', 'The disk is no faster with 64 threads (all files done at ~1.44 s) — small tasks simply stop queueing behind 512 KiB chunks.', 'lam')}` },

  { t: 'What runs on the libuv pool — and the fixes', giua: true, body: two(
    cards([
      ['fs.*', 'every async file call (512 KiB chunks for readFile)'],
      ['dns.lookup', 'every new connection to a host name (http.get!)'],
      ['crypto, zlib', 'pbkdf2, scrypt, randomBytes, async zlib (lesson 3.5)'],
    ], 1),
    box('Fixes, in order', '1. static files from <b>nginx / CDN</b><br>2. cache hot files in memory<br>3. <b>stream</b> big files, not readFile<br>4. keep-alive agents / <b>dns.resolve</b><br>5. a measured <b>UV_THREADPOOL_SIZE</b>', 'xanh'), 'r46') },

  { t: 'libuv’s io_uring: blocked, silently', giua: true, body: `
${tiny(g(F, 'UV_USE_IO_URING=1 strace'), 14)}
${box('', 'Docker’s default seccomp returns <b>EPERM</b> for io_uring_setup and libuv falls back to the pool without a word. Allowed (lesson 10.7), libuv 1.51 still reads files on the pool.', 'lam')}` },

  { t: 'Go: a blocking file read holds an OS thread', giua: true, body: `
${tiny(g(F, './evict /tmp/small*; ./gofile'), 18)}
${cards([
    ['Go', 'netpoller = network only; 32 cold reads ⇒ <b>4 → 38 threads</b>'],
    ['Java 21 virtual threads', 'file I/O pins the carrier; the scheduler “temporarily expands parallelism” (JEP 444)'],
    ['Python asyncio · nginx', 'to_thread / run_in_executor · sendfile from cache, aio threads'],
  ])}` },

  { t: 'Two pitfalls', giua: true, to: true, body: vsd(
    '<b>readFileSync in a handler</b>: froze the loop 1,256 ms here — and looks harmless on a laptop where everything is cached.<br><br><b>“Just make the pool bigger”</b> everywhere.',
    'Only at startup. Find them: search <code>Sync(</code>, run <code>node --trace-sync-io</code>.<br><br>Measure with YOUR disk: on a busy or spinning disk 64 parallel reads can make every read slower. Prefer removing file reads from the request path.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Regular files are always “ready”: readiness <b>cannot</b> keep disk off the loop</li>
<li>A read takes <b>0.7 µs or a second</b> — the page cache decides</li>
<li>Node: file work on a <b>4-thread pool</b>; small tasks queue behind 512 KiB chunks</li>
<li>A bigger pool removes queueing (944 → 3 ms) but not disk time</li>
<li>Disk I/O in event-driven servers means <b>threads</b> — unless the kernel offers async</li>
</ul>` },
]);
