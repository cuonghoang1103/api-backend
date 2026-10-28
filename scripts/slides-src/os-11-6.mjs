/**
 * os-11-6 — khoá "Operating Systems for Developers", bài 11.6 "/proc and /sys: the kernel's other API" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c116-proc.out.txt + c116-bpf.out.txt (+ hai số đo strace của c113)
 * qua grab(). Giảng: content/courses/operating-systems-for-developers/giang/os-11-6.mjs.
 */
import { lamDeck, sh, box, cards, vsd, tbl } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-11-6', code: 'OS 11.6', title: '/proc and /sys: the kernel’s other API', sub: 'Operating Systems · Chapter 11' };

const g = (pre, n = 1) => grab('c116-proc', pre, n);
const b = (pre, n = 1) => grab('c116-bpf', pre, n);
const wrap = (t, max) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k + 1) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
const tiny = (t, fs = 14) => sh(wrap(t, Math.floor(1060 / (fs * 0.602))), { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.36">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"/>`;
const A = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2.5" marker-end="url(#ar${c.slice(1)})"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', PU = '#7b4fa0';
const mk = (m) => `<marker id="ar${m.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`;
const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" style="display:block;margin:0 auto"><defs>${[BL, GR, RD, OR, PU].map(mk).join('')}</defs>${inner}</svg>`;

const twoDoors = () => {
  let s = '';
  s += R(20, 20, 340, 300, BL + '0d', BL) + T(190, 56, 'your program / ps / top / JVM', 18, { a: 'middle', w: 800, f: BL });
  ['getpid()  write()  mmap()', 'open("/proc/1/stat")', 'read("/sys/fs/cgroup/cpu.max")'].forEach((t, i) => { s += T(190, 110 + i * 70, t, 17, { a: 'middle', m: 1 }); });
  s += R(750, 20, 340, 300, PU + '0d', PU) + T(920, 56, 'the kernel', 18, { a: 'middle', w: 800, f: PU });
  ['sys_call_table[nr]', 'procfs (text on read)', 'sysfs, cgroupfs'].forEach((t, i) => { s += T(920, 110 + i * 70, t, 17, { a: 'middle', m: 1 }); });
  s += A(362, 105, 746, 105, BL) + T(554, 96, 'door 1: a system call', 16, { a: 'middle', w: 700, f: BL });
  s += A(362, 175, 746, 175, GR) + A(362, 245, 746, 245, GR) + T(554, 166, 'door 2: openat + read of a file', 16, { a: 'middle', w: 700, f: GR }) + T(554, 236, '(still syscalls — but the API is text)', 15, { a: 'middle', f: '#666' });
  s += T(555, 356, 'no file is stored on disk: the kernel formats the answer when you read it', 17, { a: 'middle', f: RD, w: 700 });
  return svg(1110, 368, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 11 — System calls', bai: '11.6',
}, [
  { cover: true, t: '/proc and /sys:<br>the kernel’s other API', sub: 'ps, free, sysctl, the JVM and Node read files — and a first look at eBPF' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why <b>ps</b>, <b>free</b>, <b>uptime</b> and <b>sysctl</b> are just file readers</li>
<li>Diagnose a hung process from <b>/proc</b> — no strace needed</li>
<li>Free syscall counters in <b>/proc/PID/io</b></li>
<li>How the <b>JVM</b> and <b>Node</b> discover container limits in <b>/sys</b></li>
<li>A first look at <b>eBPF</b>: counting syscalls inside the kernel</li>
</ul>` },

  { t: 'Two doors into the kernel', body: twoDoors() },

  { t: 'ps aux is 82 openat and 58 read of /proc', giua: true, body: `
${tiny(g('strace -qq -c -o ps.sc ps aux') + '\n' + g('strace -qq -y -e trace=openat,read -o ps.txt ps aux'), 13.5)}
${box('', '<b>-y</b> shows the path behind each fd: ps opens /proc/&lt;pid&gt;/stat and status for every process and parses the text. top, htop and docker top do the same.', 'lam')}` },

  { t: 'free, uptime, sysctl: one file each', giua: true, body: `
${tiny(g('strace -qq -e trace=openat -o free.txt free') + '\n' + g('strace -qq -e trace=openat -o up.txt uptime') + '\n' + g('strace -qq -e trace=openat,read,write -o sysctl.txt sysctl'), 13.5)}
${tiny(g('sysctl -w vm.swappiness=10') + '\n' + g("grep -E ' /(proc|sys) ' /proc/mounts"), 13.5)}` },

  { t: 'A process seen from outside: where is it sleeping?', giua: true, body: `
${tiny(g('sleep 300 & S', 5), 15)}
${cards([
    ['wchan', 'The kernel function it sleeps in: hrtimer_nanosleep.'],
    ['syscall', '115 = clock_nanosleep on arm64, then its six arguments, stack pointer, pc.'],
    ['stack', 'The kernel stack needs CAP_SYS_ADMIN: refused in a normal container.'],
  ])}` },

  { t: 'The hung DB connect of 11.3 — read from /proc', giua: true, body: `
${tiny(g('python3 hang.py > /dev/null & APP', 4), 13)}
${tbl(['field', 'raw', 'decoded'], [
    ['syscall', '203 0x3 …', '<b>connect</b> on fd 3 (arm64 numbering)'],
    ['fd 3', 'socket:[…]', 'a socket — its inode links to /proc/net/tcp'],
    ['remote', '01FFFF0A:1538', '10.255.255.1 : 5432 (hex, little-endian address)'],
    ['st', '02', '<b>SYN_SENT</b>: waiting for a handshake that never comes'],
  ])}` },

  { t: 'Syscall counters for free: /proc/PID/io', giua: true, to: true, body: `
${tiny(g('node server.js & NODE', 5), 16)}
${box('', 'syscr / syscw count read-like and write-like syscalls since the process started: +1,016 and +1,013 for 1,000 requests — the same ~1 read + 1 writev per request that strace counted, with zero overhead.', 'xanh')}` },

  { t: 'Container limits are files — runtimes read them', giua: true, body: `
${tiny(g('cat /sys/fs/cgroup/memory.max') + '\n' + g('java -XshowSettings:system') + '\n' + g('node -e'), 15)}
${box('', 'docker run <b>--memory 512m --cpus 1.5</b> wrote 536870912 and “150000 100000” into cgroup files. The JVM sizes its heap and thread pools from them; Node reports the limit too.', 'lam')}` },

  { t: 'strace shows them reading the files', giua: true, body: tiny(g('strace -f -qq -e trace=openat -o jvm.txt java') + '\n' + g('strace -f -qq -e trace=openat -o nd.txt node'), 15) },

  { t: 'Pitfall: 1.5 CPUs is 2 for Java and 1 for Node', giua: true, to: true, body: vsd(
    'cpu.max = 150000/100000. The JVM rounds <b>up</b>: Effective CPU Count 2, and sizes its GC and worker threads from it. Node’s availableParallelism() said <b>1</b>. Pool sizes copied from “nproc” on the host (10 here) are wrong for both.',
    'Size pools from the cgroup (or set them explicitly: -XX:ActiveProcessorCount, UV_THREADPOOL_SIZE) and check what the runtime saw — lesson 8.5 measured the memory side.') },

  { t: 'More of /sys: one value per file', giua: true, to: true, body: `
${tiny(g('cat /sys/class/net/eth0'), 16)}
${cards([
    ['/sys/class/net/eth0/statistics', 'rx_bytes, tx_bytes, errors — what ip -s and monitoring agents read.'],
    ['/sys/devices/system/cpu/online', 'Which CPUs exist: 0-9 here (the VM, not the container limit).'],
    ['/sys/kernel/mm/…', 'Kernel tunables like transparent huge pages ([always] here — lesson 7.2).'],
  ])}` },

  { t: 'eBPF preview: count syscalls inside the kernel', giua: true, body: `
${tiny(b('bpftrace --version') + '\n' + b('time curl', 3) + '\n' + b('kill -INT $BT'), 12.5)}` },

  { t: 'Same question, very different price', giua: true, to: true, body: tbl(['1,000 requests to Node', 'alone', 'while observed', 'how'], [
    ['strace -f -c (lesson 11.3)', '0.135 s', '0.250 s', 'stops the process at every syscall (ptrace)'],
    ['bpftrace, all syscall tracepoints', b('time curl').split('\n')[1], b('time curl', 3).split('\n').filter((l) => / s$/.test(l)).pop(), 'a small program counts inside the kernel'],
  ]) + box('Chapter 15', 'eBPF runs verified programs on kernel events: execsnoop, opensnoop, biolatency, profiles. Not in the os-lab image — installed here from Ubuntu’s bpftrace 0.25.0 package in a throwaway --privileged container.', 'lam') },

  { t: 'opensnoop in one line: who opened what?', giua: true, body: `
${tiny(b("bpftrace -q -e 'tracepoint:syscalls:sys_enter_openat") + '\n' + b('node cfg.js'), 13.5)}
${box('', 'The answer of lesson 11.3’s “vague error”, found without attaching to anything — for every process named node on the machine.', 'xanh')}` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li><b>/proc</b> and <b>/sys</b> are an API: text generated by the kernel on read</li>
<li>ps, free, sysctl, top, the JVM and Node are <b>file readers</b></li>
<li><b>wchan</b>, <b>syscall</b>, <b>fd</b>, <b>/proc/net/tcp</b>: diagnose a hang without strace</li>
<li><b>/proc/PID/io</b> counts syscalls for free; cgroup files hold your limits</li>
<li><b>eBPF</b> observes inside the kernel at a fraction of strace’s cost</li>
</ul>` },
]);
