/**
 * os-12-6 — khoá "Operating Systems for Developers", bài 12.6 "What Docker really runs" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c126-host|c126-runc.out.txt (chạy thật) qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-12-6.mjs.
 */
import { lamDeck, sh, two, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-12-6', code: 'OS 12.6', title: 'What Docker really runs', sub: 'Operating Systems · Chapter 12 — Containers' };

const h = (pre, n = 1) => grab('c126-host', pre, n);
const r = (pre, n = 1) => grab('c126-runc', pre, n);
const cut = (t, w) => t.split('\n').map((l) => (l.length > w ? l.slice(0, w - 1) + '…' : l)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 10}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.d ? ' stroke-dasharray="8 6"' : ''}/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b', PU = '#7b4fa0', GY = '#888888';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="m6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>${inner}</svg>`;
const A = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b85a2b" stroke-width="3" marker-end="url(#m6)"/>`;
const bang = (cols, rows, fs = 19) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((x) => `<tr>${x.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;

const PS = h('docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged os-lab sh -c "S=').split('\n').slice(2).map((l) => l.trim().split(/\s+/));
const pid = (re) => (PS.find((p) => re.test(p.slice(2).join(' '))) || ['?'])[0];
const chain = () => {
  const box_ = (x, y, w, t, sub, c, o = {}) => R(x, y, w, 76, c + '16', c, o) + T(x + w / 2, y + 32, t, 20, { a: 'middle', w: 700, f: c }) + T(x + w / 2, y + 58, sub, 15, { a: 'middle', m: 1 });
  let s = '';
  s += box_(10, 20, 200, 'docker CLI', 'on your Mac', GY);
  s += A(212, 58, 268, 58) + T(240, 44, 'HTTP', 13, { a: 'middle', f: '#777' }) + T(240, 116, 'docker.sock', 13, { a: 'middle', f: '#777' });
  s += box_(270, 20, 230, 'dockerd', `PID ${pid(/dockerd/)}`, BL);
  s += A(502, 58, 558, 58) + T(530, 44, 'gRPC', 13, { a: 'middle', f: '#777' });
  s += box_(560, 20, 230, 'containerd', `PID ${pid(/^\/usr\/bin\/containerd /)}`, BL);
  s += A(675, 98, 675, 160) + T(690, 134, 'starts one per container', 14, { f: '#777' });
  s += box_(520, 162, 310, 'containerd-shim-runc-v2', `PID ${pid(/shim/)} · parent: PID 1`, OR, { sw: 3 });
  s += A(675, 240, 675, 300);
  s += box_(560, 302, 230, 'your app', `PID ${pid(/sleep/)} (PID 1 inside)`, GR, { sw: 3 });
  s += R(890, 162, 200, 76, '#fdecea', RD, { d: 1 }) + T(990, 194, 'runc', 20, { a: 'middle', w: 700, f: RD }) + T(990, 220, 'sets up · execs · exits', 14, { a: 'middle', f: RD });
  s += A(832, 200, 888, 200) + `<line x1="990" y1="240" x2="792" y2="330" stroke="${RD}" stroke-width="2.5" stroke-dasharray="7 5" marker-end="url(#m6)"/>` + T(1000, 300, 'unshare · pivot_root · exec', 15, { a: 'middle', f: RD, w: 700 });
  s += T(20, 220, 'measured in the Docker VM:', 16, { w: 700, f: '#555' }) + T(20, 246, 'no runc in the process list —', 16, { f: '#555' }) + T(20, 270, 'it has already exited', 16, { f: '#555' });
  return svg(1110, 390, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 12 — Containers', bai: '12.6',
}, [
  { cover: true, t: 'What Docker really runs', sub: 'dockerd, containerd, the shim, runc and an OCI config.json — and why it is not a VM' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>chain of processes</b> behind docker run, measured</li>
<li>Why a <b>shim</b> is the parent of your PID 1</li>
<li>The <b>OCI config.json</b> Docker writes, field by field</li>
<li><b>runc</b> by hand: spec, run, lifecycle, strace, rootless</li>
<li>Why containers are <b>not VMs</b> — and where gVisor and Kata fit</li>
</ul>` },

  { t: 'docker run → dockerd → containerd → shim → runc', giua: true, body: chain() },

  { t: 'Measured in the Docker VM', giua: true, body: term(h('docker run -d --name os-c126-app') + '\n' + h('docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged os-lab sh -c "S='), 13.5) +
    box('', 'The shim’s parent is <b>PID 1</b>, not containerd; the app is the shim’s child. runc is gone.', 'lam') },

  { t: 'Why a shim sits between the daemons and your app', giua: true, to: true, body: cards([
    ['parent of PID 1', 'collects the exit code and reaps the process — someone has to'],
    ['holds stdio', 'stdout/stderr for docker logs, stdin for attach'],
    ['daemons can restart', 'dockerd/containerd upgrades do not kill containers (live-restore)'],
  ]) },

  { t: 'The bundle: rootfs + config.json', giua: true, to: true, body: term(h("docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged os-lab sh -c \"S=\\$(ps -o ppid= -p $P | tr -d ' '); readlink"), 17) +
    box('', 'The shim’s working directory. Every OCI runtime — runc, crun, runsc, Kata — takes exactly this input.', 'lam') },

  { t: 'The config.json Docker wrote', giua: true, body: term(h('docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged -v').split('\n').slice(1).join('\n'), 17) +
    box('', 'Our flags (--memory 128m --cpus 0.5 --pids-limit 64 --cap-drop ALL --read-only) are all here, plus Docker’s own: seccomp, masked paths, generated hosts/resolv.conf mounts.', 'xanh') },

  { t: 'runc’s default spec vs Docker’s', giua: true, body: bang(['field', 'runc spec (default)', 'Docker (this container)'], [
    ['namespaces', 'pid net ipc uts mount cgroup', '+ time'],
    ['capabilities', '3', '0 (--cap-drop ALL); 14 by default'],
    ['seccomp', '<b class="do">none</b>', 'ERRNO default, 380 syscalls allowed'],
    ['masked / read-only paths', '10 / 5', '12 / 5'],
    ['noNewPrivileges', 'true', 'false'],
    ['resources', 'none', 'memory, cpu, pids from the flags'],
    ['extra mounts', '—', '/etc/hostname, /etc/hosts, /etc/resolv.conf'],
  ], 21) },

  { t: 'runc run: same Alpine rootfs, our limits', giua: true, body: term(r("python3 /lab/ch12/ocifix.py config.json 'hostname", 2), 15) +
    box('', 'CapEff <code class="i">0x20000420</code> = KILL, NET_BIND_SERVICE, AUDIT_WRITE. No seccomp. 64 MiB, 32 PIDs.', 'lam') },

  { t: 'The lifecycle — and why Docker needs the shim', giua: true, body: term(r("python3 /lab/ch12/ocifix.py config.json 'sleep 300'", 5), 13.5) +
    box('', 'After <code class="i">runc run -d</code> the container’s PID 1 has <b>PPID 1</b>: runc exited, the lab’s init adopted the orphan. Nobody holds its stdout or waits for its exit code — the shim’s job.', 'do2') },

  { t: 'strace runc: the syscalls of our 40-line script', giua: true, body: term(r('strace -f -qq', 3), 15.5) +
    box('', 'One <b>unshare</b> with six namespace flags, <b>pivot_root(".", ".")</b>, sethostname, execve — exactly what mini-container.sh did. 20 clones = runc’s threads and helper children.', 'xanh') },

  { t: 'Pitfall: the security defaults live in the spec', giua: true, to: true, body: vsd(
    '"Containers are sandboxed." — runc’s own default has <b>no seccomp</b>. --privileged, seccomp=unconfined, a CI runner calling runc directly, a pod without RuntimeDefault: the fences are silently gone.',
    'Read the <b>effective</b> spec: the bundle’s config.json, docker inspect, or Seccomp/CapEff in /proc/PID/status inside.') },

  { t: 'Rootless runc: root inside, uid 1001 outside', giua: true, body: term(r('mkdir -p /srv/rl', 4), 13.5) +
    box('', 'A <b>user</b> namespace is added; the <b>network</b> namespace is dropped (no veth for ordinary users — rootless Docker uses slirp4netns/pasta). An escape lands as an ordinary user.', 'xanh') },

  { t: 'Not a VM: every container runs on one kernel', giua: true, to: true, body: term(h('uname -sr', 3), 18) +
    box('', 'macOS is Darwin; Docker Desktop runs a Linux VM, and Alpine and Ubuntu containers both report <b>7.0.12-linuxkit</b>. On a Linux VPS, containers are processes of the server’s own kernel.', 'lam') },

  { t: 'Container, gVisor, Kata, VM', giua: true, body: bang(['', 'runc', 'gVisor (runsc)', 'Kata', 'VM'], [
    ['the app talks to', 'host kernel', 'a user-space kernel', 'guest kernel per pod', 'own kernel'],
    ['boundary', 'ns, cgroups, caps, seccomp', 'gVisor kernel', 'hardware virtualisation', 'hardware virtualisation'],
    ['host-kernel bug', 'reachable', 'much smaller surface', 'needs VM escape', 'needs VM escape'],
    ['cost', 'almost none', 'slower syscalls', 'VM boot, memory', 'most'],
    ['choose with', 'default', '--runtime=runsc', 'RuntimeClass / shim', '—'],
  ], 19) + `<p style="margin:8px 0 0;font-size:17px;color:#666">gVisor and Kata rows: from their documentation, not measured here. All take the same OCI bundle.</p>` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>docker → <b>dockerd → containerd → shim → runc</b>; runc exits after exec</li>
<li>The <b>shim</b> parents PID 1: exit code, stdio, daemon restarts</li>
<li>A container is fully described by its <b>OCI config.json</b></li>
<li>runc = <b>unshare + pivot_root + exec</b>; defaults come from the spec writer</li>
<li><b>One shared kernel</b>; gVisor/Kata add a boundary behind the same OCI API</li>
</ul>` },
]);
