/**
 * nfd-14-3 — Networking for Developers, bài 14.3 "SSH khi cổng 22 bị chặn: cửa phụ 993, ~/.ssh/config tự chọn cổng, đường hầm -L/-R/-D,
 * máy nhà sau CGNAT" (slug netdev-14-3-ssh-cong-bi-chan). Output = CHẠY THẬT đọc bằng ra(): lab/out/c143-* (lab "Wi-Fi trường trong một
 * hộp" mở rộng: vps.example chạy systemd thật, mạng nhà sau CGNAT — bash lab/code/dung-output-ch14b.sh).
 * Ca thật của kho (VPS nghe 22 + 993, ssh993.service, khối Match) kể KHÔNG lộ IP/tên máy/tường lửa thật — mọi tên là vps.example.
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra, svg, T, R, A, MK, C } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-14-3', code: 'NFD 14.3', title: 'SSH when port 22 is blocked', sub: 'Networking for Developers · Chapter 14' };
const term = (t, o = {}) => sh(t, { sm: true, ...o });
/** ra() bỏ khoảng trắng CUỐI dòng (ss đệm cột bằng dấu cách) — không đổi chữ nào. */
const rt = (...a) => ra(...a).replace(/[ \t]+$/gm, '');

/** Một VPS, hai cửa: 22 (ssh.socket) và 993 (ssh993.service); trường chỉ mở 80/443/587/993. */
function haiCua() {
  const d = MK('g', C.tcp) + MK('r', C.red);
  let s = '';
  s += R(10, 70, 230, 120, '#f6f2ff', C.link, { rx: 12 }) + T(125, 110, '💻 laptop at school', 21, { a: 'middle', w: 800, f: C.link }) + T(125, 140, '10.20.2.159', 17, { a: 'middle', m: 1 }) + T(125, 168, '~/.ssh/config picks the port', 15, { a: 'middle', f: '#555' });
  s += R(340, 30, 250, 200, '#fff7ec', C.or, { rx: 12 }) + T(465, 62, '🧱 school firewall', 20, { a: 'middle', w: 800, f: C.br }) + T(465, 90, 'opens only TCP', 17, { a: 'middle' }) + T(465, 116, '80 · 443 · 587 · 993', 17, { a: 'middle', w: 800, m: 1 }) + T(465, 142, '22 ⇒ DROP (timeout)', 16, { a: 'middle', w: 700, f: C.red });
  s += R(720, 30, 380, 200, '#eef7f1', C.tcp, { rx: 12 }) + T(910, 66, '🖥️ vps.example (Ubuntu)', 21, { a: 'middle', w: 800, f: C.tcp });
  s += R(745, 90, 330, 52, '#fff', C.gy, { rx: 9 }) + T(910, 123, ':22  ← ssh.socket (systemd)', 17, { a: 'middle', m: 1 });
  s += R(745, 155, 330, 52, '#fff', C.tcp, { rx: 9 }) + T(910, 188, ':993 ← ssh993.service', 17, { a: 'middle', m: 1, w: 700, f: C.tcp });
  s += A(242, 100, 336, 100, 'r', C.red) + T(289, 88, ':22', 16, { a: 'middle', w: 700, f: C.red }) + T(318, 132, '✕', 30, { a: 'middle', w: 900, f: C.red });
  s += A(242, 181, 741, 181, 'g', C.tcp) + T(290, 172, ':993', 16, { a: 'middle', w: 700, f: C.tcp }) + T(465, 210, 'door 993 is open', 15, { a: 'middle', w: 700, f: C.tcp });
  return svg(1110, 240, s, d);
}

/** Ba kiểu đường hầm: -L kéo về, -R đẩy ra, -D proxy. */
function baHam() {
  const d = MK('b', '#2563eb') + MK('o', C.app) + MK('p', C.link);
  let s = '';
  const row = (y, mk, c, flag, from, to, note) => {
    s += T(10, y + 8, flag, 22, { w: 800, f: c, m: 1 });
    s += R(130, y - 24, 250, 48, '#fff', c, { rx: 9 }) + T(255, y + 7, from, 16, { a: 'middle', m: 1 });
    s += R(430, y - 18, 240, 36, c + '18', c, { rx: 18, dash: true }) + T(550, y + 6, '🔒 SSH :993', 16, { a: 'middle', w: 700, f: c });
    s += R(720, y - 24, 250, 48, '#fff', c, { rx: 9 }) + T(845, y + 7, to, 16, { a: 'middle', m: 1 });
    s += A(382, y, 428, y, mk, c) + A(672, y, 718, y, mk, c);
    s += T(990, y + 7, note, 15, { f: '#555' });
  };
  row(40, 'b', '#2563eb', '-L', 'laptop :16379', 'VPS 127.0.0.1:6379', 'pull a server port home');
  row(120, 'o', C.app, '-R', 'laptop 127.0.0.1:3000', 'VPS :8080 (public?)', 'push a laptop port out');
  row(200, 'p', C.link, '-D', 'laptop SOCKS :1080', 'anywhere, from the VPS', 'a proxy for every app');
  return svg(1180, 240, s, d);
}

/** Máy nhà sau CGNAT: đường hầm ngược ra VPS, laptop nhảy qua VPS. */
function nhaCgnat() {
  const d = MK('g', C.tcp) + MK('r', C.red) + MK('b', '#2563eb');
  let s = '';
  s += R(10, 40, 210, 90, '#f6f2ff', C.link, { rx: 12 }) + T(115, 78, '💻 laptop (school)', 19, { a: 'middle', w: 800, f: C.link }) + T(115, 108, 'ssh nha', 17, { a: 'middle', m: 1 });
  s += R(400, 30, 250, 110, '#eef7f1', C.tcp, { rx: 12 }) + T(525, 66, '🖥️ vps.example', 20, { a: 'middle', w: 800, f: C.tcp }) + T(525, 96, '127.0.0.1:2222', 17, { a: 'middle', m: 1 }) + T(525, 124, '= the door home', 15, { a: 'middle', f: '#555' });
  s += R(780, 150, 140, 70, '#fff7ec', C.or, { rx: 10 }) + T(850, 182, '🏢 ISP CGNAT', 16, { a: 'middle', w: 700, f: C.br }) + T(850, 206, '198.18.0.40', 14, { a: 'middle', m: 1 });
  s += R(940, 150, 150, 70, '#fff7ec', C.or, { rx: 10 }) + T(1015, 182, '📶 home router', 16, { a: 'middle', w: 700, f: C.br }) + T(1015, 206, 'WAN 100.64.0.2', 14, { a: 'middle', m: 1 });
  s += R(860, 30, 230, 90, '#fdf0ee', C.red, { rx: 12 }) + T(975, 66, '🏠 home Linux', 19, { a: 'middle', w: 800, f: C.red }) + T(975, 96, '192.168.1.10', 16, { a: 'middle', m: 1 });
  s += A(222, 85, 396, 85, 'b', '#2563eb') + T(309, 74, 'ProxyJump', 15, { a: 'middle', w: 700, f: '#2563eb' });
  s += A(856, 75, 654, 75, 'g', C.tcp) + T(755, 64, 'ssh -R 2222 (goes OUT)', 15, { a: 'middle', w: 700, f: C.tcp });
  s += A(652, 185, 776, 185, 'r', C.red) + T(714, 175, 'in?', 15, { a: 'middle', w: 700, f: C.red }) + T(714, 215, '✕ no way in', 15, { a: 'middle', w: 700, f: C.red });
  return svg(1100, 235, s, d);
}

export const slides = lamDeck({ chuong: 'Chapter 14 — Real-life networks', bai: '14.3' }, [
  { cover: true, t: 'SSH when port 22<br>is blocked', sub: 'a side door on 993 · ~/.ssh/config that picks the port ·<br>tunnels -L / -R / -D · a home machine behind CGNAT', nhan: 'Chapter 14 · Lesson 14.3' },

  { t: 'A real case — and what you will get', giua: true, body: `
${box('The case (from this course\'s own server)', 'At school, <code class="i">ssh</code> to the VPS just hangs: the school Wi-Fi opens only TCP <b>80 · 443 · 587 · 993</b>. Fix used for months: the VPS answers SSH on <b>both 22 and 993</b>, and the laptop picks the port by itself depending on the network.', 'do2')}
<ul>
<li>A second door (993) — and the Ubuntu trap that locks you out if you do it the "obvious" way</li>
<li><code class="i">~/.ssh/config</code> that chooses 22 or 993 alone — first value wins</li>
<li>Tunnels: <b>-L</b> pull a database home, <b>-R</b> show your demo, <b>-D</b> a SOCKS proxy</li>
<li>A home machine behind CGNAT: reverse tunnel, ProxyJump, autossh after a real outage</li>
<li>If the school inspects packets (DPI) · the attacker\'s corner</li>
</ul>` },

  { t: 'Same server, two doors', body: `
${haiCua()}
${term(rt('c143-cong', 'ssh -o ConnectTimeout', 2), { title: 'laptop at school: port 22 times out — port 993 of the SAME VPS answers' })}` },

  { t: 'What ssh -v shows on the side door', body: `
${term(rt('c143-cong', 'ssh -v', 1, { gay: 96 }), { title: 'TCP to :993 → SSH greeting → host key → logged in with the KEY, not a password' })}
${two(box('🔑 Key pair', '<b>private key</b> stays on the laptop (600) · <b>public key</b> goes into the VPS\'s <code class="i">authorized_keys</code> — like giving the guard a photo of your face, never your house key', 'xanh'), box('🧾 Host key', 'the VPS proves who it is. First time: "Permanently added" — check the fingerprint against the provider\'s console once', 'lam'))}` },

  { t: 'The Ubuntu trap: who really holds port 22?', body: `
${term(rt('c143-bay', 'systemctl is-enabled', 5, { drop: /^# / }), { title: 'trap 1: Port 993 + restart sshd ⇒ still only 22 — systemd (ssh.socket) holds the port' })}
${term(rt('c143-bay', 'systemctl daemon-reload', 2), { title: 'trap 2: daemon-reload + restart ssh.socket ⇒ 993 REPLACES 22 (you are now locked out of 22)' })}` },

  { t: 'The safe way: ADD a second listener', body: `
${term(rt('c143-dichvu', 'systemctl daemon-reload', 2), { title: 'ssh993.service runs its own sshd -D -p 993 — ssh.socket and port 22 untouched' })}
${two(box('The unit (excerpt)', '<code class="i">ExecStartPre=/usr/sbin/sshd -t</code> — refuse to start on a bad config<br><code class="i">ExecStart=/usr/sbin/sshd -D -p 993</code> — <code class="i">-p</code> overrides every Port line<br><code class="i">ExecReload=/bin/kill -HUP $MAINPID</code>', 'xanh'), box('How it went on the real server', 'Applied from a GitHub Actions runner (the network was blocking 22): start the service, check 5 conditions (993 answers, 22 still answers, the tunnel home still up…) and <b>remove itself</b> if any fails.', 'lam'))}
${bang(['Way', 'Risk on a live server'], [
    ['edit <code class="i">Port</code> + restart <code class="i">ssh.socket</code>', 'one typo ⇒ 22 gone; restarting the socket drops tunnels that ride on it'],
    ['separate <code class="i">ssh993.service</code>', 'if it fails, 22 still works — nothing existing restarts'],
  ], { fs: 19 })}` },

  { t: '~/.ssh/config: the laptop picks the port', body: `
${term(rt('c143-config', 'ssh -G vps 2>/dev/null', 1, { lan: 1, drop: /^# / }), { title: 'Match written AFTER Host vps: port 22 — ssh keeps the FIRST value it meets' })}
${term(rt('c143-config', 'ssh -G vps 2>/dev/null', 2, { lan: 2 }), { title: 'Match moved to the top: at school (10.20.2.x) ⇒ 993' })}
${term(rt('c143-config-nha', 'ssh -G', 2), { title: 'same laptop, same file, at home (192.168.1.x) ⇒ 22' })}` },

  { t: 'Three tunnels in one picture', giua: true, body: `
${baHam()}
${box('', 'All three ride inside the SSH connection on an allowed port (993 here). The school sees one encrypted flow to the VPS — nothing about what is inside.', 'lam')}` },

  { t: '-L: bring the server\'s database home', body: `
${term(rt('c143-L-vps', 'ss', 1), { title: 'on the VPS: redis listens on 127.0.0.1 only — never open to the Internet' })}
${term(rt('c143-L', 'nc', 5), { title: 'laptop: direct = timeout · ssh -L 16379:127.0.0.1:6379 ⇒ PONG' })}` },

  { t: '-R: show your demo to a friend', body: `
${term(rt('c143-R', 'ssh -f', 1) + '\n' + rt('c143-R-ban1', 'curl', 1, { cut: 100 }), { title: '-R 8080 — but the friend at home is refused' })}
${term(rt('c143-R-vps', 'ss', 1) + '\n' + rt('c143-R-vps', 'echo', 2), { title: 'VPS: the tunnel opened 127.0.0.1:8080 only — allow clients to ask for more' })}
${term(rt('c143-R2', 'ssh -f', 2) + '\n' + rt('c143-R-ban2', 'curl', 1), { title: '-R 0.0.0.0:8080 ⇒ the friend sees the demo running on your laptop' })}` },

  { t: '-D: a SOCKS proxy through the VPS', body: `
${term(rt('c143-D', 'curl -sS -m 5 --cacert /ca/ca.pem https', 4, { gay: 96 }), { title: 'social.test (SNI-blocked) and phim.test (DNS-blocked) — direct, via SOCKS, and the DNS leak' })}
${box('socks5 vs socks5<b>h</b>', '<code class="i">--socks5</code> resolves the name <b>on the laptop</b> (the school DNS says NXDOMAIN — curl 8.18 even mislabels it "Could not resolve proxy"). <code class="i">--socks5-hostname</code> sends the NAME to the VPS. Browsers: "Proxy DNS when using SOCKS v5".', 'do2')}` },

  { t: 'What the school sees · the SOCKS left open', body: `
${term(rt('c143-D-gw', 'iptables', 2), { title: 'school firewall: the SNI rule caught only the direct try — the rest is SSH to the VPS :993' })}
${term(rt('c143-D-mo', 'ss', 1) + '\n' + rt('c143-D-ke', 'curl', 2, { cut: 104 }), { title: '🕵️ -D 0.0.0.0:1081 by mistake ⇒ a stranger on the same Wi-Fi surfs as YOUR VPS' })}` },

  { t: 'A home machine behind CGNAT', body: `
${nhaCgnat()}
${term(rt('c143-cgnat', 'ip', 2) + '\n' + rt('c143-vao-nha', 'nc', 2), { title: 'router WAN 100.64.0.2 ≠ what the Internet sees (198.18.0.40) ⇒ nobody can call in' })}` },

  { t: 'Reverse tunnel + ProxyJump', body: `
${term(rt('c143-ham-vps', 'cut', 2), { title: 'VPS: the home key may open ONE port (2222) and nothing else' })}
${term(rt('c143-jump', 'ssh nha', 2), { title: 'laptop at school: ssh nha = jump through the VPS, then the tunnel home' })}` },

  { t: 'A real outage: 45 s without Internet at home', body: `
${term(rt('c143-autossh', 'grep "exited"', 4), { title: 'home: ssh noticed after ~38 s (ServerAlive 10 × 3), 8 restarts, back at count 9' })}
${term(rt('c143-autossh-vps', 'J()', 4, { cut: 104 }), { title: 'VPS: the OLD session still held 2222 ⇒ "Address already in use" until its RST arrived' })}` },

  { t: 'If the school inspects packets (DPI)', body: `
${term(rt('c143-dpi-gw', 'iptables', 1, { gay: 92 }) + '\n' + rt('c143-dpi', 'ssh vps true', 3), { title: 'a rule on the bytes "SSH-2.0" kills SSH on ANY port — 993 and 443 alike; HTTPS on 443 lives' })}
${term(rt('c143-dpi', 'ssh vps-tls', 1, { drop: /^(depth|verify)/ }), { title: 'SSH wrapped in TLS (sslh on 443 routes the name ssh.vps.example to sshd) ⇒ passes' })}` },

  { t: 'Attacker\'s corner · the lifeline', body: `
${term(rt('c143-do', 'for u', 1, { drop: /^Warning/, gay: 96 }), { title: 'a bot trying passwords: the server offers no password method at all' })}
${term(rt('c143-do-vps', 'mv', 2) + '\n' + rt('c143-do-vps', 'mv', 2, { lan: 2 }), { title: 'same file named 70- ⇒ 50-cloud-init.conf ("yes") is read first and WINS — check with sshd -T' })}
${box('', 'fail2ban on a VPS bans the attacker\'s IP — but your whole school shares one IP (198.18.0.1 in the logs): ban it and the class is locked out. Lost every door? A GitHub Actions runner holding the deploy key can still reach the VPS.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Port blocked ≠ server down: add a <b>second listener</b> on an allowed port (993/443) — a separate service, not a socket edit</li>
<li><code class="i">~/.ssh/config</code> <b>Match … exec</b> picks the port per network — the block must come <b>first</b></li>
<li><b>-L</b> pulls a server port home · <b>-R</b> pushes a laptop port out · <b>-D</b> is a SOCKS proxy (use socks5<b>h</b>)</li>
<li>Behind CGNAT nobody calls in: the home machine tunnels OUT (autossh), you jump via the VPS</li>
<li>Keys only, drop-in <b>01-</b>, verify with <code class="i">sshd -T</code> · DPI reads protocols, not ports</li>
</ul>
<p style="margin:0">${kw('ssh.socket', 'systemd giữ cổng 22')} ${kw('ProxyJump', 'nhảy qua máy trung gian')} ${kw('SOCKS', 'proxy mọi ứng dụng')} ${kw('GatewayPorts', 'cho người ngoài vào -R')} ${kw('CGNAT', 'NAT hai lớp')} ${kw('DPI', 'soi nội dung gói')}</p>` },
]);
