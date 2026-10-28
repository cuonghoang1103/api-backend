/**
 * os-13-4 — khoá "Operating Systems for Developers", bài 13.4 "Containers & hardening" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c134-container|priv|userns.out.txt (chạy thật) qua grab().
 * THUẦN PHÒNG THỦ: chỉ ĐỌC cờ bảo mật trong container vứt đi; không trình diễn cách thoát. Giảng: giang/os-13-4.mjs.
 */
import { lamDeck, sql, sh, two, box, cards } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-13-4', code: 'OS 13.4', title: 'Containers from a security view, and hardening', sub: 'Operating Systems · Chapter 13 — OS security' };

const gc = (pre, n = 1) => grab('c134-container', pre, n);
const gp = (pre, n = 1) => grab('c134-priv', pre, n);
const gu = (pre, n = 1) => grab('c134-userns', pre, n);

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 13 — OS security', bai: '13.4',
}, [
  { cover: true, t: 'Containers & hardening', sub: 'a container is a fenced process —<br>keep the fence high (read-only observation, no escape shown)' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What the kernel takes away from a <b>default</b> container</li>
<li>What <b>--privileged</b> gives back, and why that is host root</li>
<li>How <b>rootless</b> user namespaces keep "root" harmless</li>
<li><b>NoNewPrivileges</b>, seccomp and AppArmor</li>
<li>A hardening checklist and a <b>systemd</b> unit for a backend service</li>
</ul>` },

  { t: 'A default container drops most of root', giua: true, body: `
${sh(gc("grep -E '^(CapBnd|CapEff|Seccomp|NoNewPrivs):'"))}
<p style="margin:0;font-size:21px"><code class="i">CapBnd</code> is <b>not</b> all-ones — dangerous capabilities like CAP_SYS_ADMIN are already gone. <code class="i">Seccomp: 2</code> = a syscall filter is loaded. The kernel built this fence before your process started.</p>` },

  { t: '14 capabilities, 15 devices — not the host', giua: true, body: two(
    sh('# caps left vs a full set\n$ capsh --decode=$CapBnd | wc -l\n' + gc('capsh --decode=$(grep CapBnd').split('\n').pop() + '\n$ full set:\n' + gc('capsh --decode=0x000001ffffffffff').split('\n').pop(), { sm: true }),
    sh(gc('ls /dev | wc -l'), { sm: true }) + `<p style="margin:8px 0 0;font-size:20px">15 device nodes: tty, null, zero, random — nothing that reaches the host’s disks.</p>`) },

  { t: 'Why --privileged is dangerous', giua: true, body: `
${sh(gp("grep -E '^(CapBnd|CapEff|Seccomp|NoNewPrivs):'"))}
<p style="margin:0;font-size:21px">All-ones <code class="i">CapBnd</code> (41 caps, incl. CAP_SYS_ADMIN), <code class="i">Seccomp: 0</code> — no filter. The fence is gone.</p>` },

  { t: 'The host’s disks appear inside', giua: true, body: `
${sh(gp('ls /dev | wc -l') + '\n' + gp('ls /dev | grep -E'))}
${box('Effectively host root', 'Full caps + host devices (<code class="i">vda</code>, <code class="i">mem</code>, <code class="i">kmsg</code>) + no seccomp ⇒ a process inside can reach the host’s disk directly. Never run app workloads with --privileged. Mounting <code class="i">docker.sock</code> is the same danger: talking to the root daemon is host root. (We only read the flags; no escape is shown.)', 'do2')}` },

  { t: 'Rootless: "root" that cannot hurt the host', giua: true, body: `
${sh(gu('runuser -u dev -- unshare'))}
<p style="margin:0;font-size:21px"><code class="i">id -u</code> is 0 inside, but <code class="i">uid_map</code> reads <b>0 1001 1</b>: root inside = the unprivileged <code class="i">dev</code> outside. Its power stops at the namespace edge. This is how rootless Docker/Podman run.</p>` },

  { t: 'NoNewPrivileges neutralises setuid', giua: true, body: two(
    sh(gc('echo "== setuid works normally').split('\n').filter((l) => /euid|hostname|oslab|normally/.test(l)).join('\n'), { sm: true }),
    sh('$ … setpriv --no-new-privs greetsuid\n' + gc('runuser -u dev -- setpriv'), { sm: true })) + `<p style="margin:10px 0 0;font-size:20px">A one-way flag: after it, no exec gains privilege, so the SUID binary keeps euid=1001. This is what Docker’s <code class="i">no-new-privileges</code> and systemd’s <code class="i">NoNewPrivileges=</code> set.</p>` },

  { t: 'seccomp and AppArmor, one line each', giua: true, body: cards([
    ['seccomp', 'Filters which <b>syscalls</b> a process may make. You saw <code class="i">Seccomp: 2</code> — Docker’s default profile denies ~44 dangerous ones. Tighten per service.'],
    ['AppArmor / SELinux', 'Mandatory access control: confines a program to declared files and operations beyond Unix permissions. Docker ships a default profile.'],
    ['Rule', 'Keep the defaults on. Loosen (seccomp=unconfined) only for a one-off measurement, never for a real workload.'],
  ], 1) },

  { t: 'A hardening checklist', to: true, giua: true, body: `
<ul>
<li><b>Least privilege</b>: a dedicated non-root user; a capability, not root; drop every capability you do not use.</li>
<li><b>Containers</b>: never --privileged, never mount docker.sock; keep seccomp/AppArmor defaults; read-only rootfs + a small writable volume; prefer rootless.</li>
<li><b>systemd</b>: ProtectSystem, NoNewPrivileges, CapabilityBoundingSet, SystemCallFilter — much of a container, for a plain service.</li>
</ul>` },

  { t: 'A hardened systemd unit', giua: true, body: sql(`[Service]
User=app
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/var/lib/app
PrivateTmp=yes
CapabilityBoundingSet=
AmbientCapabilities=CAP_NET_BIND_SERVICE
SystemCallFilter=@system-service`, { lang: 'ini', sm: true }) + `<p style="margin:10px 0 0;font-size:20px">Each line maps to this chapter: NoNewPrivileges (13.4), capabilities (13.3), SystemCallFilter (seccomp), ProtectSystem=strict (read-only root). Score it with <code class="i">systemd-analyze security</code>.</p>` },

  { t: 'Harden the host too — the same ideas as SSH', giua: true, body: box('From this project’s own SSH hardening',
    'Least privilege at the login layer: <code class="i">PasswordAuthentication no</code> + <code class="i">PermitRootLogin prohibit-password</code> = key-only access, the login equivalent of "drop every capability you don’t need". And the drop-in ordering lesson (a <code class="i">01-</code> file must sort before <code class="i">50-cloud-init.conf</code>, verified with <code class="i">sshd -T</code>, not by reading the file) is the same discipline as reading mitigations with <code class="i">readelf</code>: <b>verify the effective state, do not assume it.</b>', 'lam') },

  { t: 'Takeaways', to: true, giua: true, body: `
<ul>
<li>A container is a fenced process: the kernel already drops most of root (CapBnd ~14, Seccomp 2, 15 devices).</li>
<li><b>--privileged</b> returns everything (41 caps, Seccomp 0, host disks) — never for apps; same for <b>docker.sock</b>.</li>
<li><b>Rootless</b> user namespaces map root-inside to an unprivileged UID outside — a compromise is one account.</li>
<li><b>NoNewPrivileges</b> + seccomp + AppArmor + a hardened <b>systemd</b> unit; verify the effective state.</li>
</ul>` },
]);
