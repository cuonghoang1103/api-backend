/**
 * os-12-7 — khoá "Operating Systems for Developers", bài 12.7 "Pods share namespaces; Dockerfiles from the OS side" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c127-host|c127-good.out.txt (chạy thật) qua grab(); Dockerfile đọc từ lab/code/ch12/good.
 * Giảng: content/courses/operating-systems-for-developers/giang/os-12-7.mjs.
 */
import fs from 'node:fs';
import { lamDeck, sh, sql, two, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-12-7', code: 'OS 12.7', title: 'Pods share namespaces; Dockerfiles from the OS side', sub: 'Operating Systems · Chapter 12 — Containers' };

const h = (pre, n = 1) => grab('c127-host', pre, n);
const gd = (pre, n = 1) => grab('c127-good', pre, n);
const cut = (t, w) => t.split('\n').map((l) => (l.length > w ? l.slice(0, w - 1) + '…' : l)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 10}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.d ? ' stroke-dasharray="8 6"' : ''}/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b', PU = '#7b4fa0', GY = '#888888';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">${inner}</svg>`;
const bang = (cols, rows, fs = 19) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((x) => `<tr>${x.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const DF = fs.readFileSync(new URL('../../content/courses/operating-systems-for-developers/lab/code/ch12/good/Dockerfile', import.meta.url), 'utf8').trim();

/* số đo dừng container, đọc thẳng từ output */
const stop = (name) => { const t = h(`docker run -d --name ${name}`); return { s: (t.match(/took ([\d.]+)s/) || [])[1], ex: (t.match(/^exit (\d+)/m) || [])[1] || '—' }; };
const S1 = stop('os-c127-s1'), S2 = stop('os-c127-s2'), S3 = stop('os-c127-s3'), S4 = stop('os-c127-s4');

/* pod: pause giữ net/ipc/pid; app + sidecar gia nhập */
const pod = () => {
  let s = R(20, 20, 1070, 360, '#fafcff', BL, { d: 1 }) + T(40, 52, 'pod: one IP · one port space · localhost between containers', 20, { w: 700, f: BL });
  s += R(60, 80, 990, 70, '#eef3f8', BL) + T(555, 112, 'shared namespaces:  net  ·  ipc  ·  pid (if shareProcessNamespace)  ·  uts (Kubernetes)', 19, { a: 'middle', w: 700 }) + T(555, 138, 'held by the pause process — they survive app restarts', 16, { a: 'middle', f: '#555' });
  [['pause', 'sleep / pause', GY], ['app', 'python -m http.server 8000', GR], ['sidecar', 'wget 127.0.0.1:8000', PU]].forEach(([n, d, c], i) => {
    const x = 60 + i * 340;
    s += R(x, 190, 310, 160, c + '14', c) + T(x + 155, 226, n, 22, { a: 'middle', w: 700, f: c }) + T(x + 155, 256, d, 16, { a: 'middle', m: 1 });
    s += R(x + 30, 280, 250, 50, '#fff', '#bbb') + T(x + 155, 311, 'own mnt: own file system', 16, { a: 'middle', f: '#555' });
    s += `<line x1="${x + 155}" y1="150" x2="${x + 155}" y2="190" stroke="${BL}" stroke-width="3"/>`;
  });
  return svg(1110, 395, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 12 — Containers', bai: '12.7',
}, [
  { cover: true, t: 'Pods share namespaces;<br>Dockerfiles from the OS side', sub: 'The pause container, and a five-item checklist — every item measured' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a Kubernetes <b>pod</b> shares — rebuilt with Docker flags</li>
<li>Why a <b>pause</b> process holds the namespaces</li>
<li>PID 1 and <b>signals</b>: four ways to stop, timed</li>
<li><b>Limits, ulimits, read-only root, non-root user</b> — measured</li>
<li>One image with <b>all of it</b>, checked from inside</li>
</ul>` },

  { t: 'A pod = containers that join one set of namespaces', giua: true, body: pod() },

  { t: 'Rebuilt with --network/--pid/--ipc container:', giua: true, body: term(h('docker run -d --name os-c127-pause', 5), 13.5) +
    box('', 'The sidecar reached the app on <b>127.0.0.1:8000</b>. net, pid, ipc identical; mnt different. Docker copies the hostname instead of sharing UTS.', 'lam') },

  { t: 'Why a pause process', giua: true, to: true, body: cards([
    ['holds the namespaces', 'a namespace lives while something holds it (12.1)'],
    ['apps can restart', 'the pod keeps its IP while app containers crash and come back'],
    ['one per pod', 'a few hundred KB, does nothing — that is the point'],
  ]) },

  { t: 'A Dockerfile checklist from the OS side', giua: true, body: bang(['item', 'what the kernel does', 'measured here'], [
    ['1. PID 1 + signals', 'PID 1 ignores signals without a handler', `no handler ${S1.s} s → ${S1.ex} · handler ${S4.s} s → ${S4.ex}`],
    ['2. limits', 'none unless cgroup files are written', 'memory.max=max, pids.max=max'],
    ['3. ulimits', 'RLIMIT_NOFILE inherited from the runtime', 'soft = hard = 1048576'],
    ['4. read-only root', 'overlay mounted ro', 'EROFS; --tmpfs /tmp for scratch'],
    ['5. non-root user', 'a UID without capabilities', 'CapEff 0, port 80 still works'],
  ], 19) },

  { t: 'PID 1 and signals: four ways to stop, timed', giua: true, body: bang(['variant', 'PID 1', 'docker stop', 'exit'], [
    ['exec form, no handler', 'node', `${S1.s} s`, `<b class="do">${S1.ex}</b>`],
    ['shell form <code class="i">sh -c</code>', 'sh (dash)', `${S2.s} s`, 'killed at timeout'],
    ['<code class="i">--init</code>', 'docker-init (tini)', `${S3.s} s`, S3.ex],
    ['SIGTERM handler', 'node', `${S4.s} s`, `<b class="xanh">${S4.ex}</b>`],
  ], 21) + box('', 'The grace period here was ~3 s (Docker documents 10 s, Kubernetes 30 s). Without a handler: SIGKILL, 137, lost requests.', 'do2') },

  { t: 'Shell form keeps sh as PID 1; --init forwards', giua: true, body: term(h('docker run -d --name os-c127-s2') + '\n' + h('docker run -d --name os-c127-s3') + '\n' + h('docker run -d --name os-c127-s4'), 13.5) },

  { t: 'No flags = no limits; ulimits from the runtime', giua: true, body: term(h("docker run --rm --label oslab=1 os-lab sh -c 'cd /sys/fs/cgroup") + '\n' + h("docker run --rm --label oslab=1 os-lab bash -c 'echo \"nofile", 2), 14) +
    box('', 'Over a million fds by default hides leaks; set <code class="i">--ulimit nofile</code>. Node raises its soft limit to the hard one at start — the hard limit is what counts.', 'lam') },

  { t: 'A read-only root, with a tmpfs for scratch', giua: true, to: true, body: term(h('docker run --rm --label oslab=1 --read-only os-lab') + '\n' + h('docker run --rm --label oslab=1 --read-only --tmpfs'), 15) +
    box('', 'Nothing can be dropped into the image’s directories and the container layer cannot grow. Log to stdout; data on volumes.', 'xanh') },

  { t: 'Non-root: 0 capabilities — and port 80 still works', giua: true, body: term(h("docker run --rm --label oslab=1 os-lab sh -c 'id -u") + '\n' + h('docker run --rm --label oslab=1 --user 1001:1001 os-lab'), 14) +
    box('', 'Root: 14 caps (0xa80425fb). UID 1001: none. Docker sets <code class="i">ip_unprivileged_port_start=0</code> per network namespace, so binding :80 needs no root.', 'xanh') },

  { t: 'Pitfall: volume ownership is a number', giua: true, body: term(h('docker run --rm --label oslab=1 --user 1001:1001 -v', 2), 15) + vsd(
    'Switch to a non-root USER, get "Permission denied" on a volume, switch back to root. (On a Mac the file shows as UID 501 — the problem stays hidden until Linux.)',
    'The kernel checks UIDs: <code class="i">COPY --chown</code>, chown the data directory at build or init time, keep the non-root user.') },

  { t: 'One image with the whole checklist', giua: true, body: sql(DF, { lang: 'dockerfile' }).replace('<pre class="vs">', '<pre class="vs" style="font-size:19px;white-space:pre-wrap;line-height:1.5">') +
    box('', 'Run with: <code class="i">--init --read-only --tmpfs /tmp --memory 256m --cpus 1 --pids-limit 128 --cap-drop ALL --security-opt no-new-privileges --ulimit nofile=4096:4096 -p 127.0.0.1:3000:3000</code>', 'lam') },

  { t: 'Checked from inside — and a clean stop', giua: true, body: term(gd('docker run -d --name os-c127-g', 4).split('\n').slice(1).join('\n') + '\n' + gd('TIMEFORMAT=', 2).split('\n').slice(1).join('\n'), 14) +
    box('', 'docker-init PID 1, app as <b>node</b>; CapEff 0, NoNewPrivs 1, Seccomp 2; 256 MiB, 1 CPU, 128 tasks, 4096 fds; read-only root; stop in 0.13 s, <b>exit 0</b>.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>A pod = containers joining <b>shared net/ipc(/pid)</b> namespaces held by pause</li>
<li>PID 1: <b>exec form + --init + a SIGTERM handler</b> → exit 0, fast</li>
<li><b>No flags, no limits</b>: memory, CPUs, PIDs, nofile</li>
<li><b>Read-only root</b> + tmpfs; logs to stdout; data on volumes</li>
<li><b>Non-root</b>: 0 caps, port 80 still fine; fix ownership by UID</li>
</ul>` },
]);
