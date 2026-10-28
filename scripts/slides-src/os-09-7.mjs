/**
 * os-09-7 — khoá "Operating Systems for Developers", bài 9.7 "Beyond rwx: capabilities, ACLs, container users — and four
 * permission incidents" (28/10/2026). Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c97-cap, c97-host, c97-ssh qua
 * grab(). Giảng: giang/os-09-7.mjs.
 */
import { lamDeck, sh, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-09-7', code: 'OS 9.7', title: 'Beyond rwx: capabilities, ACLs, containers', sub: 'Operating Systems · Chapter 9' };

const g = (pre, n = 1) => grab('c97-cap', pre, n);
const h = (pre, n = 1) => grab('c97-host', pre, n);
const k = (pre, n = 1) => grab('c97-ssh', pre, n);
const wrap = (t, max = 104) => t.split('\n').map((l) => {
  if (l.length <= max) return l;
  if (!l.startsWith('$ ')) { const out = []; let rest = l; while (rest.length > max) { let i = rest.lastIndexOf(' ', max - 1); if (i < 20) i = max - 1; out.push(rest.slice(0, i)); rest = '      ' + rest.slice(i + 1); } return [...out, rest].join('\n'); }
  const out = []; let rest = l;
  while (rest.length > max) { let i = rest.lastIndexOf(' ', max - 2); if (i < 20) i = max - 2; out.push(rest.slice(0, i + 1) + ' \\'); rest = '    ' + rest.slice(i + 1); }
  return [...out, rest].join('\n');
}).join('\n');
const tiny = (t, fs = 13.5) => sh(wrap(t, Math.round(104 * 13 / fs)), { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.38">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 6}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
const A = (x1, y1, x2, y2, c, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="6 5"' : ''} marker-end="url(#ar${c.slice(1)})"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', GY = '#8a8a8a', PU = '#7b4fa0';
const mk = (m) => `<marker id="ar${m.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`;
const svg = (w, hh, inner, sc = 1) => `<svg viewBox="0 0 ${w} ${hh}" width="${Math.round(w * sc)}" height="${Math.round(hh * sc)}" font-family="Arial" style="display:block;margin:0 auto"><defs>${[BL, GR, RD, OR, GY, PU].map(mk).join('')}</defs>${inner}</svg>`;

/* root = một bộ capability: 14 cái của container mặc định */
const capSvg = () => {
  const list = g('capsh --decode').split('\n')[1].split('=')[1].split(',');
  let s = T(20, 26, `root in a default Docker container: ${list.length} capabilities (mask a80425fb)`, 19, { w: 800, f: '#444' });
  list.forEach((c, i) => {
    const x = 20 + (i % 4) * 272, y = 44 + Math.floor(i / 4) * 54, hot = /dac_override|chown|net_bind|net_raw/.test(c);
    s += R(x, y, 258, 42, hot ? BL + '18' : '#f6f6f6', hot ? BL : '#bbb', { rx: 4 }) + T(x + 12, y + 28, c, 17, { m: 1, w: hot ? 800 : 400, f: hot ? BL : '#555' });
  });
  const y = 44 + Math.ceil(list.length / 4) * 54 + 10;
  s += R(20, y, 1070, 48, RD + '10', RD, { rx: 4, dash: 1 }) + T(36, y + 31, 'not in the bounding set: cap_sys_admin (mount…), cap_net_admin, cap_sys_ptrace, cap_sys_module… — can never be gained inside', 16, { f: RD });
  return svg(1110, y + 58, s);
};

/* user namespace: 0 bên trong = 1001 bên ngoài */
const nsSvg = () => {
  let s = '';
  s += R(20, 30, 480, 200, '#fafafa', GY) + T(260, 62, 'container (no user namespace)', 19, { a: 'middle', w: 800, f: '#555' }) + T(260, 106, 'uid 0 inside', 22, { a: 'middle', w: 800, f: RD }) + T(260, 150, 'uid_map: 0 0 4294967295', 17, { a: 'middle', m: 1 }) + T(260, 194, '= uid 0 for the kernel (root on the host)', 17, { a: 'middle', f: RD });
  s += R(610, 30, 480, 200, '#fafafa', GY) + T(850, 62, 'unshare --user --map-root-user (as dev)', 18, { a: 'middle', w: 800, f: '#555' }) + T(740, 116, 'uid 0', 22, { a: 'middle', w: 800, f: GR }) + T(960, 116, 'uid 1001', 22, { a: 'middle', w: 800, f: GR });
  s += A(790, 110, 900, 110, GR) + T(740, 144, 'inside', 15, { a: 'middle', f: '#666' }) + T(960, 144, 'outside', 15, { a: 'middle', f: '#666' }) + T(850, 182, 'uid_map: 0 1001 1', 17, { a: 'middle', m: 1 }) + T(850, 212, 'root in there owns nothing dev could not touch', 15, { a: 'middle', f: GR });
  s += T(555, 268, 'rootless Docker / Podman: the whole engine runs as you; container root maps to a range from /etc/subuid', 17, { a: 'middle', f: '#444' });
  return svg(1110, 282, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 9 — File systems', bai: '9.7',
}, [
  { cover: true, t: 'Root is a set of capabilities', sub: 'Capabilities, ACLs, container users — and four permission incidents' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What <b>root</b> really is: ~40 <b>capabilities</b>, 14 in a container</li>
<li>Give <b>one</b> power to <b>one</b> program (Node on port 80) — and why ping needs none</li>
<li><b>ACLs</b>: a named user, a default ACL, and the <b>mask</b> trap</li>
<li>Who is root <b>in a container</b>, who owns the files it writes, rootless basics</li>
<li>Four incidents: <b>nginx 403</b>, <b>log dir</b>, <b>.env</b>, <b>SSH key</b></li>
</ul>` },

  { t: 'Root in a default container holds 14 capabilities', body: `
${tiny(g("grep -E '^Cap(Eff|Bnd)'") + '\n' + g('runuser -u dev -- grep CapEff'), 14)}
${capSvg()}` },

  { t: 'Drop CAP_DAC_OVERRIDE and root obeys rwx', giua: true, to: true, body: `
${sh(g('ls -l /srv/app/.env; cat'))}
${box('“Root can read everything” = “this capability can”', 'Same root, same file (600, owned by dev): with CAP_DAC_OVERRIDE it reads; after <code class="i">capsh --drop=cap_dac_override</code> it gets Permission denied like anyone else.', 'lam')}` },

  { t: 'One capability for one program: Node on port 80', giua: true, body: `
${tiny(g('sysctl net.ipv4.ip_unprivileged_port_start', 4), 14)}
${cards([
    ['EACCES on :80', 'Ports below 1024 are privileged (as on a VPS; Docker’s default is 0).'],
    ['setcap …=+ep', 'Stored in the file’s security.capability attribute; granted at exec.'],
    ['in production', 'Let nginx or Docker’s port mapping own :80; run Node on 3000.'],
  ])}` },

  { t: 'ping: a capability, and today not even that', giua: true, body: `
${tiny(g('getcap /usr/bin/ping', 4), 13)}
${cards([
    ['cap_net_raw=ep', 'No longer setuid-root; the + after the mode is this extended attribute.'],
    ['a copy without it works', 'ping_group_range 0–2147483647: every group may open ICMP datagram sockets.'],
    ['the lesson', 'Fewer privileged binaries = smaller attack surface.'],
  ])}` },

  { t: 'ACLs: who refuses? Ask namei', giua: true, body: `
${sh(g('runuser -u www-data -- cat /srv/app/uploads/a.jpg') + '\n' + g('namei -l'))}
<p style="margin:0;font-size:21px">www-data (nginx) must read what the app (dev) writes. <code class="i">namei -l</code> walks the path: <b>uploads</b> is <code class="i">drwx------ dev dev</code> — www-data cannot even traverse it.</p>` },

  { t: 'setfacl: exactly what www-data needs, nothing more', giua: true, body: `
${tiny(g('setfacl -m u:www-data:x') + '\n' + g('getfacl -p /srv/app/uploads/a.jpg', 3), 13.5)}` },

  { t: 'Default ACLs for new files — and the mask trap', giua: true, body: `
${tiny(g('setfacl -d -m') + '\n' + g('chmod 600 /srv/app/uploads/a.jpg'), 14)}
${vsd('A routine <b>chmod 600</b> set the ACL <b>mask</b> to ---: the entry still says r--, but <b>#effective:---</b>, and nginx is denied again.',
    'Read the effective column; on ACL trees use <code class="i">chmod g+r</code> (raises the mask) or let the default ACL set modes.')}` },

  { t: 'Container root is uid 0 — and owns what it writes', giua: true, body: `
${tiny(h('docker run --rm --label oslab=1 os-lab cat /proc/self/uid_map') + '\n' + h("docker run --rm --label oslab=1 -v os-c97-vol:/data os-lab bash -c 'id -un", 4), 13)}
${box('The classic USER bug', 'A root container created the volume, so <b>--user 1001</b> cannot write it. Fix ownership once (chown, or create the directory in the Dockerfile before USER) — not with --privileged.', '')}` },

  { t: '--cap-drop ALL, and user namespaces', body: `
${tiny(h('docker run --rm --label oslab=1 --cap-drop ALL') + '\n' + h('docker run --rm --label oslab=1 --privileged'), 12.5)}
${nsSvg().replace('width="1110" height="282"', 'width="944" height="240"')}` },

  { t: 'Incident 1: nginx answers 403 for uploads', giua: true, body: `
${tiny(h("docker exec os-c97web sh -c 'mkdir", 5), 13.5)}
${box('13 = EACCES', 'The master runs as root, but the <b>workers that serve requests run as nginx</b> — “other” for a 700 root folder.', 'do2')}` },

  { t: 'Incident 1, fixed by group — not by 777', giua: true, to: true, body: `
${tiny(h("docker exec os-c97web sh -c 'chgrp", 2), 14)}
${box('750 / 640, group nginx', 'Traverse the folder, read the file, nothing for others. On a host where the app writes as another user: shared group + setgid folder (9.6) or a default ACL.', 'xanh')}` },

  { t: 'Incident 2: the app cannot write its log directory', giua: true, body: `
${tiny(g("runuser -u dev -- node -e \"require('fs')", 3), 14)}
${cards([
    ['ENOENT → EACCES', 'First the folder is missing, then it exists but belongs to root (755).'],
    ['install -d -o dev -g dev -m 750', 'Create with owner and mode in one step (systemd: LogsDirectory=).'],
    ['containers', 'Log to stdout — own no log files at all.'],
  ])}` },

  { t: 'Incident 3: .env readable by every user on the box', giua: true, body: `
${tiny(g("find /srv -name '.env*'", 3), 14)}
${cards([
    ['umask 022 → 644', 'Editors, git, scp, echo > all create world-readable .env files.'],
    ['find -perm -o=r', 'Lists them; bob read the DB password.'],
    ['owner + 600', 'Count drops to 0, bob is refused. Also: .dockerignore, backups, parent dirs.'],
  ])}` },

  { t: 'Incident 4: OpenSSH refuses a key that is “too open”', giua: true, body: `
${tiny(k('ssh-keygen -q', 3), 14)}
${box('Private key 600 (or 400)', 'A key copied via a Windows share, git or a zip often ends up 644 → “This private key will be ignored” → a confusing <b>Permission denied (publickey)</b> in CI. (Run in node:22-bookworm: OpenSSH 9.2.)', 'lam')}` },

  { t: 'Pitfall: “just run it as root / --privileged”', giua: true, to: true, body: vsd(
    'It hides all four incidents instead of fixing them — and turns any bug in your app into root in the container; with <code class="i">--privileged</code>, every capability and device (Chapter 13).',
    'A named user, ownership fixed at build time, <b>--cap-drop ALL</b> + only what you need, config mounted <b>:ro</b>.') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Root = <b>capabilities</b>; container root has 14; drop what you do not need</li>
<li><b>setcap</b> grants one power to one binary</li>
<li><b>ACLs</b> add named users; watch the <b>mask</b>; use default ACLs</li>
<li>Container uid 0 = host uid 0 unless a <b>user namespace</b> maps it</li>
<li>Fix incidents with <b>groups, owners and 600</b> — never 777 or --privileged</li>
</ul>` },
]);
