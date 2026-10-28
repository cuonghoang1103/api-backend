/**
 * os-10-7 — khoá "Operating Systems for Developers", bài 10.7 "io_uring" (28/10/2026).
 * Output từ lab/out/c107-uring.out.txt (container vứt đi seccomp=unconfined). Giảng: giang/os-10-7.mjs.
 */
import { lamDeck, box, cards, vsd, tbl, two } from './_pg-chung.mjs';
import { META, g, SRC, dong, noCmt, tiny, code, T, R, A, svg, bars, BL, GR, RD, OR, PU } from './os-10-chung.mjs';

export const deck = { key: 'os-10-7', code: 'OS 10.7', title: 'io_uring', sub: 'Operating Systems · Chapter 10' };
const F = 'c107-uring';

/* hai vòng đệm dùng chung */
const vongDem = () => {
  let s = '';
  s += R(20, 40, 260, 230, BL + '10', BL) + T(150, 70, 'your process', 20, { a: 'middle', w: 700, f: BL });
  s += T(150, 110, '1. write SQEs', 16, { a: 'middle' }) + T(150, 136, '“read fd 5, 4 KiB, tag 17”', 14, { a: 'middle', m: 1, f: '#555' });
  s += T(150, 180, '4. read CQEs', 16, { a: 'middle' }) + T(150, 206, '“tag 17: 4096”', 14, { a: 'middle', m: 1, f: '#555' });
  s += R(330, 30, 440, 250, OR + '0d', OR, { dash: '7 5' }) + T(550, 54, 'shared memory (mmap)', 17, { a: 'middle', w: 700, f: '#9a4a12' });
  const ring = (y, name, c, fill) => {
    s += T(470, y - 8, name, 16, { w: 700, f: c });
    for (let i = 0; i < 8; i++) s += R(470 + i * 36, y, 32, 36, i < fill ? c + '33' : '#fff', c, { rx: 4 });
  };
  ring(80, 'SQ ring', PU, 3);
  ring(190, 'CQ ring', GR, 2);
  s += A(282, 110, 466, 98, PU) + A(466, 210, 282, 190, GR);
  s += R(830, 40, 250, 230, RD + '0c', RD) + T(955, 70, 'kernel', 20, { a: 'middle', w: 700, f: RD });
  s += T(955, 110, '2. io_uring_enter()', 15, { a: 'middle', m: 1 }) + T(955, 132, 'or SQPOLL thread', 14, { a: 'middle', f: '#555' });
  s += T(955, 176, '3. do the work,', 15, { a: 'middle' }) + T(955, 198, 'post a CQE', 15, { a: 'middle' });
  s += A(762, 98, 828, 110, PU) + A(828, 200, 762, 208, GR);
  return svg(1100, 300, s);
};

export const slides = lamDeck(META('10.7'), [
  { cover: true, t: 'io_uring', sub: 'Shared rings with the kernel, blocked by Docker, measured honestly — and sendfile' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>How io_uring works: <b>submission</b> and <b>completion</b> rings</li>
<li>Why every default Docker container returns <b>EPERM</b></li>
<li>What it gains here: <b>system calls</b> — and what it does not: latency</li>
<li>The price of “zero syscalls”: <b>busy kernel threads</b></li>
<li>Zero-copy you already have: nginx <b>sendfile</b></li>
</ul>` },

  { t: 'Two rings shared with the kernel', giua: true, body: vongDem() + box('', 'One <b>io_uring_enter</b> can submit many SQEs and wait for many CQEs. With <b>SQPOLL</b> a kernel thread watches the SQ ring, so submitting needs no system call at all. (Linux 5.1, 2019, Jens Axboe.)', 'lam') },

  { t: 'Why your container says EPERM', giua: true, body: `
${tiny(g(F, 'grep Seccomp: /proc/self/status', 2), 13)}
${cards([
    ['Docker 25.0+', 'default profile: deny = <b>ERRNO 1 (EPERM)</b>; no io_uring_* allowed (moby PR #46762, Nov 2023)'],
    ['why', 'ring operations are not syscalls, so seccomp cannot filter them; long CVE history'],
    ['Google 2023', '<b>60%</b> of kCTF kernel exploits in 2022 used io_uring; restricted on ChromeOS, Android, servers'],
  ])}` },

  { t: 'The experiment: 64 random 4 KiB reads per batch', giua: true, body: `
${code(noCmt(dong(SRC('ubatch.c'), 31, 49)), 'c', 13)}` },

  { t: 'Fewer system calls — not faster cached reads', giua: true, body: `
${tiny(g(F, 'gcc -O2 -Wall -o ubatch ubatch.c -luring'), 15, 'time per read, no strace')}
${tiny(g(F, 'strace -f -qq -c -o pr.txt', 2), 14, 'system calls for 100 batches (6,400 reads)')}` },

  { t: 'Syscalls vs time', giua: true, body: two(
    bars([['pread', 6400, RD, '6,400 calls'], ['io_uring', 100, OR, '100'], ['SQPOLL', 100, OR, '100'], ['SQPOLL + spin', 1, GR, '1']], { w: 620, label: 170, rowH: 54, fs: 17 }),
    bars([['pread', 0.60, GR, '0.60 µs'], ['io_uring', 1.64, OR, '1.64 µs'], ['SQPOLL', 1.37, OR, '1.37 µs'], ['SQPOLL + spin', 1.43, OR, '1.43 µs']], { w: 480, label: 170, rowH: 54, fs: 17 }), 'r64') +
    box('', 'Left: system calls for 6,400 reads. Right: time per cached 4 KiB read, without strace. A cached read is a memory copy; io_uring adds bookkeeping per operation.', 'lam') },

  { t: 'The price of zero system calls: three busy cores', giua: true, body: `
${tiny(g(F, './ubatch /tmp/data sqspin 20000'), 17)}
${box('', 'Our thread spins on the CQ ring (100%), the kernel SQ thread <b>iou-sqp</b> (100%), a kernel worker <b>iou-wrk</b> (87%) does the copies — on Docker’s overlayfs the reads could not complete inline.', 'do2')}` },

  { t: 'An echo server with no epoll and no read()', giua: true, body: `
${code(noCmt(dong(SRC('echo-uring.c'), 36, 55)), 'c', 13)}` },

  { t: 'Kernel crossings per message: 2.6 vs 0.64', giua: true, body: `
${tiny(g(F, './echo-uring 7400 &', 3), 14)}
${box('', '4,000 echoes: epoll needed <b>10,565</b> system calls, io_uring <b>2,559</b> io_uring_enter — four times fewer.', 'xanh')}` },

  { t: '… but latency and CPU: within noise', giua: true, body: `
${tiny(g(F, './do-tai.sh epoll 7000 $E 2000', 4), 15)}
${box('', 'On loopback with 64-byte messages a syscall is cheap; saving ¾ of them barely shows (and the order changed between our runs). Gains grow when crossings are expensive (mitigations, VMs) or rates are far higher.', 'lam')}` },

  { t: 'Who uses io_uring today', giua: true, body: `
${tiny(g(F, "strace -f -qq -e trace=io_uring_setup,io_uring_enter -o uv0.txt"), 13)}
${cards([
    ['libuv 1.51 (Node)', 'small rings to batch epoll_ctl; file reads still on the pool, even with UV_USE_IO_URING=1'],
    ['databases', 'PostgreSQL 18 <code>io_method = io_uring</code>; ScyllaDB, TigerBeetle'],
    ['frameworks', 'Netty 4.2 io_uring transport; Rust tokio-uring, glommio'],
  ])}` },

  { t: 'Zero-copy without io_uring: sendfile', giua: true, body: `
${tiny(g(F, 'curl -s -o /dev/null', 1), 14, 'nginx, sendfile on')}
${tiny(g(F, "sed 's/sendfile on;/sendfile off;/'", 2), 13, 'nginx, sendfile off')}
${box('', '<b>on</b>: headers + <b>one sendfile</b> for 1 MiB, never in nginx’s memory · <b>off</b>: <b>64 calls</b>, every byte copied up and back down.', 'xanh')}` },

  { t: 'Pitfall', giua: true, to: true, body: vsd(
    '“io_uring makes servers 2× faster — add <code>seccomp=unconfined</code> to docker-compose.”',
    'Unconfined removes the filter for <b>all</b> ~300 syscalls. If you really need io_uring: a custom profile adding only io_uring_setup/enter/register, a patched kernel — and a measurement first (here: 4× fewer syscalls, same latency).') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>io_uring = <b>shared SQ/CQ rings</b>: submit whole operations, collect completions</li>
<li>Blocked by Docker’s default seccomp since <b>25.0</b> (EPERM) — for security reasons</li>
<li>Syscalls: <b>64× fewer</b> (reads), <b>4× fewer</b> (echo); cached pread still cheaper</li>
<li>“Zero syscalls” with SQPOLL cost <b>~3 busy cores</b></li>
<li>Static files: <b>sendfile</b> — one call for 1 MiB instead of 64</li>
</ul>` },
]);
