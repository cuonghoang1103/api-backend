/**
 * nfd-14-4 — Networking for Developers, bài 14.4 "VPN cho lập trình viên: WireGuard, split/full tunnel, khi UDP bị chặn" (slug netdev-14-4-vpn).
 * Output = CHẠY THẬT đọc bằng ra(): lab/out/c144-* (bash lab/code/dung-output-ch14b.sh, CHI=144). Tailscale/DERP: chỉ sơ đồ (không đo được offline).
 */
import { lamDeck, sh, two, box, kw, bang, ra, svg, esc, T, R, A, MK, C } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-14-4', code: 'NFD 14.4', title: 'VPNs for developers', sub: 'Networking for Developers · Chapter 14' };
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const rt = (...a) => ra(...a).replace(/[ \t]+$/gm, '');

/** VPN = card mạng thứ hai; ống riêng trong đường ống chung. */
function ong() {
  const d = MK('g', C.tcp) + MK('b', '#2563eb');
  let s = '';
  s += R(10, 60, 230, 130, '#f6f2ff', C.link, { rx: 12 }) + T(125, 98, '💻 laptop', 21, { a: 'middle', w: 800, f: C.link }) + T(125, 130, 'wlan: 10.20.2.159', 16, { a: 'middle', m: 1 }) + T(125, 160, 'wg0: 10.66.0.2', 16, { a: 'middle', m: 1, w: 700, f: C.tcp });
  s += R(300, 40, 520, 170, '#f3f4f6', C.gy, { rx: 16, dash: true }) + T(560, 72, '🌐 the shared Internet (school, ISP, café)', 18, { a: 'middle', f: '#555' });
  s += R(330, 105, 460, 50, '#eef7f1', C.tcp, { rx: 25 }) + T(560, 137, '🔒 encrypted UDP 51820 — a private pipe', 18, { a: 'middle', w: 800, f: C.tcp });
  s += R(880, 60, 220, 130, '#eef7f1', C.tcp, { rx: 12 }) + T(990, 98, '🖥️ your VPS', 21, { a: 'middle', w: 800, f: C.tcp }) + T(990, 130, 'wg0: 10.66.0.1', 16, { a: 'middle', m: 1 }) + T(990, 160, 'NAT → 198.18.0.30', 16, { a: 'middle', m: 1 });
  s += A(242, 130, 326, 130, 'g', C.tcp) + A(792, 130, 876, 130, 'g', C.tcp);
  s += T(560, 238, 'the school sees one encrypted flow to one IP — the VPS sees everything inside', 17, { a: 'middle', w: 700, f: C.br });
  return svg(1110, 250, s, d);
}

/** Tailscale: thử đi thẳng (đục NAT) — UDP bị chặn thì lùi về DERP qua 443. */
function luoi() {
  const d = MK('g', C.tcp) + MK('r', C.red) + MK('o', C.app);
  let s = '';
  s += R(10, 70, 200, 90, '#f6f2ff', C.link, { rx: 12 }) + T(110, 108, '💻 laptop', 20, { a: 'middle', w: 800, f: C.link }) + T(110, 138, 'at school', 16, { a: 'middle' });
  s += R(900, 70, 200, 90, '#fdf0ee', C.red, { rx: 12 }) + T(1000, 108, '🏠 home PC', 20, { a: 'middle', w: 800, f: C.red }) + T(1000, 138, 'behind CGNAT', 16, { a: 'middle' });
  s += R(440, 0, 230, 54, '#f3f4f6', C.gy, { rx: 10 }) + T(555, 33, '🗝️ coordination: keys only', 16, { a: 'middle', w: 700 });
  s += A(212, 100, 896, 100, 'g', C.tcp) + T(555, 92, '① direct WireGuard (UDP hole punching)', 16, { a: 'middle', w: 700, f: C.tcp }) + T(555, 122, '✕ school drops UDP', 16, { a: 'middle', w: 700, f: C.red });
  s += R(455, 170, 200, 54, '#fff7ec', C.or, { rx: 10 }) + T(555, 203, '📡 DERP relay :443', 17, { a: 'middle', w: 800, f: C.br });
  s += A(212, 150, 452, 192, 'o', C.app) + A(658, 192, 896, 150, 'o', C.app) + T(300, 200, '② HTTPS 443', 15, { a: 'middle', w: 700, f: C.app }) + T(810, 200, 'still end-to-end encrypted', 15, { a: 'middle', w: 700, f: C.app });
  return svg(1110, 235, s, d);
}

export const slides = lamDeck({ chuong: 'Chapter 14 — Real-life networks', bai: '14.4' }, [
  { cover: true, t: 'VPNs for developers', sub: 'WireGuard · split vs full tunnel ·<br>when the school drops UDP · DNS leaks · kill switch', nhan: 'Chapter 14 · Lesson 14.4' },

  { t: 'What you will get', giua: true, body: `
${box('The questions', '① How do I reach my VPS\'s private services from home? ② Why does my VPN die at school? ③ Is a VPN safe — and who sees my traffic then?', 'do2')}
<ul>
<li>A real <b>WireGuard</b> tunnel from a laptop behind two NATs to a VPS</li>
<li><b>Split</b> vs <b>full</b> tunnel — measured with routes, traceroute and "who does the site see"</li>
<li>At school UDP is dropped ⇒ plan B: <b>OpenVPN over TCP 443</b> behind sslh</li>
<li>A <b>DNS leak</b> caught on the wire, a <b>kill switch</b>, the cost in ms and Mbit/s</li>
<li>Tailscale/DERP, a VPN on the phone, and the attacker's corner</li>
</ul>` },

  { t: 'A VPN is a second network card', giua: true, body: `
${ong()}
${box('', 'Whatever the routing table sends into <code class="i">wg0</code> comes out at your server — a database connection, a game\'s UDP, DNS. That is the difference from SSH -L/-D (lesson 14.3): one layer lower, any protocol.', 'lam')}` },

  { t: 'The server: wg0 on UDP 51820', body: `
${term(rt('c144-vps', 'wg-quick up', 2), { title: 'vps: wg-quick prints every step — interface, keys, address, MTU 1420, NAT' })}
${two(box('🔑 Keys like SSH', 'each side: a private key that never leaves the machine, a public key given to the other side', 'xanh'), box('🧭 AllowedIPs', '<b>cryptokey routing</b>: which addresses are routed to this peer AND accepted from it', 'lam'))}` },

  { t: 'The laptop at home — through two NATs', body: `
${term(rt('c144-nha', 'wg-quick up', 3), { title: 'lap (behind the home router AND the ISP\'s CGNAT): handshake 2 s ago, ping 0.9 ms' })}
${box('', 'Nobody can connect IN to this laptop — but it connects OUT over UDP, the NATs open a mapping, and <code class="i">PersistentKeepalive = 25</code> keeps it open.', 'lam')}` },

  { t: 'Split tunnel vs full tunnel', body: `
${term(rt('c144-tach', 'ip route get 198', 2) + '\n' + rt('c144-tach', 'ip route get 198', 2, { lan: 2 }), { title: 'split: the site sees the ISP (198.18.0.40) · full (AllowedIPs 0.0.0.0/0): the site sees the VPS' })}
${bang(['', 'Split', 'Full'], [
    ['use', 'reach a company/home/dev network', 'hostile or blocked Wi-Fi'],
    ['site sees', 'your normal IP', 'the VPN server\'s IP'],
    ['who sees your traffic', 'the local network', 'the VPN operator'],
  ], { fs: 18 })}` },

  { t: 'How full tunnel avoids a loop', body: `
${term(rt('c144-tach', 'wg-quick up', 1, { drop: /^sysctl:/ }), { title: 'wg-quick: mark the tunnel\'s own packets (fwmark 51820); everything UNmarked uses table 51820 → wg0' })}
${term(rt('c144-tach', 'traceroute', 1, { drop: /^# / }) + '\n' + rt('c144-tach', 'traceroute', 1, { lan: 2 }), { title: 'traceroute: home router → CGNAT → site · vs · the VPS tunnel address → site' })}` },

  { t: 'At school: UDP is dropped', body: `
${term(rt('c144-truong', 'wg-quick up', 4), { title: 'no "latest handshake", 0 B received — and with full tunnel the whole Internet is gone' })}
${term(rt('c144-truong-gw', 'iptables', 1), { title: 'school firewall: the "drop all UDP" rule of 14.2 counted the handshake attempts' })}` },

  { t: 'Plan B: OpenVPN over TCP 443, behind sslh', body: `
${term(rt('c144-ovpn-vps', 'ss', 1), { title: 'vps: sslh holds 443 and hands OpenVPN to 127.0.0.1:1194 (also SSH and HTTPS)' })}
${term(rt('c144-ovpn', 'grep', 5), { title: 'laptop at school: connected over 443, tun0 up, the site sees the VPS, social.test (SNI-blocked) opens' })}` },

  { t: 'The DNS leak', body: `
${term(rt('c144-ovpn', 'cat /etc/resolv.conf', 2) + '\n' + rt('c144-ovpn-dns', 'echo', 2), { title: 'the laptop still asks the SCHOOL\'s DNS — on its own Wi-Fi, so never through the tunnel · fix' })}
${term(rt('c144-ovpn-gw', 'tshark', 1, { gay: 96 }), { title: 'what the school captured before the fix: every name (A + AAAA)' })}` },

  { t: 'Kill switch — or a silent leak', body: `
${term(rt('c144-kill-win', 'pkill', 3), { title: 'OpenVPN dies ⇒ its routes vanish ⇒ the next request leaves with the SCHOOL\'s IP' })}
${term(rt('c144-kill-lap', 'ip route', 2), { title: 'wg-quick full tunnel, UDP blocked: routes still point into wg0 ⇒ nothing escapes' })}` },

  { t: 'What it costs — measured', body: `
${term(rt('c144-netem', 'tc qdisc add', 1), { title: 'the home router imitates a real line' })}
${bang(['20 ms, 50 Mbit/s', 'RTT (avg)', 'clean line', 'with 2% loss'], [
    ['direct', '~24 ms', '<b>46.2</b> Mbit/s', '5.2 Mbit/s'],
    ['WireGuard (UDP)', '~24 ms', '<b>45.4</b> Mbit/s', '3.4 Mbit/s'],
    ['OpenVPN (TCP 443)', '~23 ms', '<b>43.6</b> Mbit/s', '4.0 Mbit/s'],
  ], { fs: 19 })}
${box('', 'Clean line: the tunnels cost a few %. With loss all three collapse (TCP slows down on loss) and the numbers jump between runs — <b>no conclusion</b> about which is faster under loss. Use UDP when allowed, TCP 443 when not.', 'lam')}` },

  { t: 'Tailscale: a mesh that finds its way', giua: true, body: `
${luoi()}
${box('', 'Coordination hands out keys; devices try to talk <b>directly</b> (NAT hole punching, lesson 9.4); if UDP is blocked they fall back to <b>DERP</b> relays over HTTPS 443. Not measurable in our offline lab — shown, not measured.', 'lam')}` },

  { t: 'A VPN on your phone', body: `
${two(`<div><div class="nh">real output of qrencode</div><pre style="display:inline-block;margin:0;padding:12px 14px;background:#0f172a;color:#f8fafc;border-radius:10px;font:13px/1 Menlo,monospace">${esc(rt('c144-dt', 'qrencode', 1, { boLenh: true }))}</pre></div>`,
    box('Server: one more peer', '<code class="i">wg set wg0 peer &lt;phone.pub&gt; allowed-ips 10.66.0.3/32</code> · a full-tunnel config with <code class="i">DNS = 198.18.0.53</code> · scan it in the WireGuard app<br><br>⚠️ this QR holds a lab key — a real one <b>is a password</b>. Turn on <b>Always-on VPN</b> + <b>Block connections without VPN</b>: the phone\'s kill switch.', 'lam'))}` },

  { t: 'Attacker\'s corner', body: `
${term(rt('c144-thay', 'tshark', 2, { gay: 96 }), { title: 'the VPN server reads wg0 (decrypted): HTTP login in clear · HTTPS shows the name' })}
${two(box('🕵️ Who to trust', 'A VPN <b>moves</b> trust from the school to the operator. "Free VPN" apps have sold data and shipped malware. A VPN is not anonymity.', 'do2'), box('🔐 Hygiene', 'one key per device; remove the peer when a device is lost; never post a config/QR; beware "install this profile to use Wi-Fi"', 'xanh'))}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A VPN is a <b>second network card</b>: whatever routes into it comes out at your server</li>
<li><b>Split</b> tunnel for some networks, <b>full</b> for everything — check with <code class="i">ip route get</code> and "who does the site see"</li>
<li>WireGuard works behind CGNAT but only over UDP — at school use <b>TCP 443</b> or a mesh with relays</li>
<li>The tunnel does not move your DNS by itself — check for <b>leaks</b>; want a <b>kill switch</b></li>
<li>The VPN operator sees what the school used to see</li>
</ul>
<p style="margin:0">${kw('AllowedIPs', 'định tuyến theo khoá')} ${kw('full tunnel', 'mọi gói vào hầm')} ${kw('DNS leak', 'rò DNS')} ${kw('kill switch', 'hầm sập thì chặn')} ${kw('DERP', 'trạm chuyển tiếp 443')}</p>` },
]);
