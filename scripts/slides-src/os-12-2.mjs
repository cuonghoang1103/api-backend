/**
 * os-12-2 — khoá "Operating Systems for Developers", bài 12.2 "cgroups v2 by hand" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c122-cg|c122-host|c127-host.out.txt (chạy thật) qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-12-2.mjs.
 */
import { lamDeck, sh, two, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-12-2', code: 'OS 12.2', title: 'cgroups v2 by hand', sub: 'Operating Systems · Chapter 12 — Containers' };

const g = (pre, n = 1) => grab('c122-cg', pre, n);
const h = (pre, n = 1) => grab('c122-host', pre, n);
const cut = (t, w) => t.split('\n').map((l) => (l.length > w ? l.slice(0, w - 1) + '…' : l)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">${inner}</svg>`;
const L = (x1, y1, x2, y2, c = '#999') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2.5"/>`;
const bang = (cols, rows, fs = 21) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;

/* cây cgroup bằng tay */
const tree = () => {
  let s = R(400, 10, 310, 56, '#fdf6ee', OR) + T(555, 46, '/sys/fs/cgroup', 22, { a: 'middle', m: 1, w: 700 });
  s += T(760, 36, 'cgroup.subtree_control =', 17, { f: '#555' }) + T(760, 58, 'cpu io memory pids', 17, { m: 1, f: OR, w: 700 });
  s += L(555, 66, 270, 110) + L(555, 66, 840, 110);
  s += R(110, 110, 320, 150, '#f4f8fc', BL) + T(270, 146, 'init/', 22, { a: 'middle', m: 1, w: 700, f: BL });
  s += T(270, 186, 'cgroup.procs: the lab shell', 18, { a: 'middle' }) + T(270, 214, 'no limits', 18, { a: 'middle', f: '#777' });
  s += R(640, 110, 400, 270, '#f3f9f4', GR) + T(840, 146, 'box/', 22, { a: 'middle', m: 1, w: 700, f: GR });
  [['memory.max', '64M'], ['cpu.max', '50000 100000'], ['pids.max', '20 → 64'], ['io.max', '254:0 wbps=10M'], ['cgroup.procs', 'echo $$ > …']].forEach(([f, v], i) => {
    s += T(670, 186 + i * 38, f, 18, { m: 1, w: 700 }) + T(1020, 186 + i * 38, v, 18, { a: 'end', m: 1, f: GR });
  });
  s += T(270, 300, 'a group = a directory', 20, { a: 'middle', w: 700 }) + T(270, 330, 'a setting = a file', 20, { a: 'middle', w: 700 }) + T(270, 360, 'join = write your PID', 20, { a: 'middle', w: 700 });
  return svg(1110, 390, s);
};

/* cpu.max 50 ms / 100 ms với 2 luồng */
const quota = () => {
  const X = 140, W = 900, per = 4, pw = W / per, y1 = 50, y2 = 150, hh = 70;
  let s = '';
  for (let p = 0; p <= per; p++) s += L(X + p * pw, 30, X + p * pw, 240, '#ccc') + (p < per ? T(X + p * pw + pw / 2, 24, `period ${p + 1} · 100 ms`, 16, { a: 'middle', f: '#888' }) : '');
  [[y1, 'thread 1'], [y2, 'thread 2']].forEach(([y, n]) => {
    s += T(X - 14, y + 42, n, 20, { a: 'end', w: 700 });
    for (let p = 0; p < per; p++) {
      const x = X + p * pw;
      s += R(x + 2, y, pw * 0.25 - 4, hh, GR + '44', GR, { rx: 4 }) + R(x + pw * 0.25, y, pw * 0.75 - 4, hh, RD + '14', RD, { rx: 4 });
    }
  });
  s += R(230, 268, 30, 26, GR + '44', GR, { rx: 4 }) + T(270, 288, 'runs ~25 ms', 20, { w: 700, f: GR });
  s += R(470, 268, 30, 26, RD + '14', RD, { rx: 4 }) + T(510, 288, 'throttled ~75 ms — waits for the next period', 20, { w: 700, f: RD });
  s += T(X + W / 2, 340, '2 threads × 25 ms = the 50 ms quota, spent in the first quarter of every period', 21, { a: 'middle', w: 700 });
  return svg(1110, 355, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 12 — Containers', bai: '12.2',
}, [
  { cover: true, t: 'cgroups v2 by hand', sub: 'memory.max, cpu.max, pids.max, io.max — each limit hit on purpose' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The cgroup tree as a <b>file system</b>: mkdir, echo, cat</li>
<li>The <b>EBUSY</b> rule every runtime has to work around</li>
<li>Each limit hit and <b>measured</b>: memory, CPU, PIDs, disk I/O</li>
<li><b>cgroup.kill</b> and <b>freeze</b> (= docker pause)</li>
<li>Exactly which files <b>docker run</b> flags write</li>
</ul>` },

  { t: 'Namespaces: what you see. cgroups: what you use', giua: true, body: tree() },

  { t: 'The tree is a file system', giua: true, body: term(g('cat /proc/self/cgroup', 2), 22) +
    box('', 'Our lab container has its own cgroup namespace, so its group looks like <code class="i">/</code>. Seven controllers are available; four processes live here.', 'lam') },

  { t: 'EBUSY: a group that delegates may not hold processes', giua: true, body: term(g('mkdir /sys/fs/cgroup/box') + '\n' + g('mkdir /sys/fs/cgroup/init', 2), 16) +
    box('The no-internal-processes rule', 'Move the existing processes into a leaf (<b>init/</b>), <b>then</b> enable controllers in <code class="i">cgroup.subtree_control</code>. systemd and every runtime do this.', 'do2') },

  { t: 'A new group: 49 files, every limit at "max"', giua: true, body: term(g('cd /sys/fs/cgroup/box', 2), 17) +
    cards([['*.max', 'limits — start at <b>max</b> (no limit)'], ['*.current / *.peak', 'usage now / highest so far'], ['*.events / *.stat', 'what happened: oom_kill, throttled, max…']]) },

  { t: 'memory.max 64M: the kernel kills inside the box', giua: true, body: term(g('echo 64M > memory.max', 2) + '\n' + g("grep -E '^(oom|oom_kill|max) ' memory.events", 2), 15) +
    box('', '200 MiB asked, 64 MiB allowed ⇒ SIGKILL, exit 137, <code class="i">oom_kill 1</code>. The lab shell in another group never noticed. Victim choice, memory.high, swap: Chapter 8.', 'xanh') },

  { t: 'cpu.max "50000 100000": 50 ms of CPU per 100 ms', giua: true, body: quota() },

  { t: 'Measured: two workers × 25 %, throttled 42 of 42', giua: true, body: term(g('echo "50000 100000" > cpu.max') + '\n' + g("sh -c 'echo $$ > /sys/fs/cgroup/box/cgroup.procs; exec stress-ng --cpu 2", 2), 18) +
    box('', '2.13 s of CPU in 42 periods (≈ 4.2 s) = 0.5 CPU. Every period was throttled: that stop-and-go is the latency spike of lesson 3.4.', 'lam') },

  { t: 'pids.max 20: fork number 20 fails with EAGAIN', giua: true, to: true, body: term(g('echo max > cpu.max; echo 20 > pids.max', 3), 20) +
    box('', 'Python + 19 children = 20 tasks. Threads count too: a JVM with 60 threads uses 60.', 'lam') },

  { t: 'A fork bomb stops at 64 — the machine does not notice', giua: true, body: term(g('echo 64 > pids.max', 4), 18) +
    box('', 'Refused 150 times, load average 0.24. <b>cgroup.kill</b> sends SIGKILL to the whole group in one write; <code class="i">populated 0</code> = empty.', 'xanh') },

  { t: 'io.max: 10 MiB/s on one device', giua: true, body: term(g('echo "254:0 wbps=10485760" > io.max', 3), 17) +
    box('', '<b>254:0 = vda</b>, the VM’s disk. 40 MiB took 4.0 s instead of 12 ms. Only I/O that reaches that device is limited; buffered writes are throttled at writeback (hence O_DIRECT).', 'lam') },

  { t: 'cgroup.freeze = docker pause', giua: true, body: term(g('sleep 300 & S=$!', 2), 16) + term(h('ID=$(docker inspect', 3), 15) +
    box('', 'Every process of the group stops in the kernel’s signal path (<code class="i">get_signal</code>). Nothing is killed; memory stays. docker pause writes the same file.', 'lam') },

  { t: 'docker run flags → cgroup files', giua: true, body: term(h('docker run -d --name os-c122-app', 3), 15) +
    bang(['flag', 'file', 'flag', 'file'], [['--memory 256m', 'memory.max = 268435456', '--device-write-bps', 'io.max'], ['--cpus 1.5', 'cpu.max = 150000 100000', 'docker pause', 'cgroup.freeze = 1'], ['--pids-limit 100', 'pids.max = 100', 'docker update', 'rewrites them live']], 18) },

  { t: 'Pitfall: no flags = no limits', giua: true, body: term(grab('c127-host', "docker run --rm --label oslab=1 os-lab sh -c 'cd /sys/fs/cgroup"), 15) + vsd(
    'One leak or one fork bomb in a container started without flags can take the whole server — RAM, PID table, every core.',
    'Give every service <code class="i">--memory</code>, <code class="i">--cpus</code> and <code class="i" style="white-space:nowrap">--pids-limit</code> (or Compose/Kubernetes limits) — lesson 12.7.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>A group is a <b>directory</b>; a limit is a <b>file</b>; joining = writing a PID</li>
<li>Delegate controllers only from a group <b>without processes</b> (else EBUSY)</li>
<li>memory.max → <b>137</b>; cpu.max → <b>throttling</b>; pids.max → <b>EAGAIN</b>; io.max → <b>MB/s per device</b></li>
<li><b>cgroup.kill</b> empties a group; <b>cgroup.freeze</b> = docker pause</li>
<li>docker run flags write exactly these files; <b>docker update</b> rewrites them live</li>
</ul>` },
]);
