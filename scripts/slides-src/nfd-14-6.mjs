/**
 * nfd-14-6 — Networking for Developers, bài 14.6 "Mạng ở nhà và ký túc xá: router, giữ chỗ DHCP, mở cổng và CGNAT" (slug netdev-14-6-lan-nha-ky-tuc-xa).
 * Output = CHẠY THẬT đọc bằng ra(): lab/out/c146-* (bash lab/code/dung-output-ch14b.sh, CHI=146). Sóng Wi-Fi: chỉ giải thích (không đo được).
 */
import { lamDeck, sh, two, box, kw, bang, ra, svg, T, R, A, MK, C } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-14-6', code: 'NFD 14.6', title: 'The network at home and in the dorm', sub: 'Networking for Developers · Chapter 14' };
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const rt = (...a) => ra(...a).replace(/[ \t]+$/gm, '');

/** Hai lớp NAT: luật mở cổng ở router nhà không đủ. */
function haiLop() {
  const d = MK('g', C.tcp) + MK('r', C.red);
  let s = '';
  s += R(10, 70, 200, 100, '#eef7f1', C.tcp, { rx: 12 }) + T(110, 106, '🌍 friend / VPS', 19, { a: 'middle', w: 800, f: C.tcp }) + T(110, 138, 'on the Internet', 15, { a: 'middle' });
  s += R(300, 40, 250, 160, '#fff7ec', C.or, { rx: 12 }) + T(425, 76, '🏢 ISP CGNAT', 20, { a: 'middle', w: 800, f: C.br }) + T(425, 106, '198.18.0.40', 16, { a: 'middle', m: 1 }) + T(425, 140, 'no rule for :8080', 16, { a: 'middle', w: 700, f: C.red }) + T(425, 168, '⇒ refused', 15, { a: 'middle', f: C.red });
  s += R(620, 40, 250, 160, '#f6f2ff', C.link, { rx: 12 }) + T(745, 76, '📶 your router', 20, { a: 'middle', w: 800, f: C.link }) + T(745, 106, 'WAN 100.64.0.2', 16, { a: 'middle', m: 1 }) + T(745, 140, 'DNAT :8080 → .10:80', 15, { a: 'middle', m: 1, w: 700, f: C.tcp }) + T(745, 168, '✓ works from inside ISP', 14, { a: 'middle', f: C.tcp });
  s += R(940, 70, 160, 100, '#fdf0ee', C.red, { rx: 12 }) + T(1020, 106, '🏠 home PC', 18, { a: 'middle', w: 800, f: C.red }) + T(1020, 136, '192.168.1.10', 14, { a: 'middle', m: 1 });
  s += A(212, 120, 296, 120, 'r', C.red) + A(552, 120, 616, 120, 'g', C.tcp) + A(872, 120, 936, 120, 'g', C.tcp);
  s += T(555, 225, 'a port forward on YOUR router is only the second gate — the ISP\'s gate must open too (or tunnel out)', 16, { a: 'middle', w: 700, f: C.br });
  return svg(1110, 240, s, d);
}

export const slides = lamDeck({ chuong: 'Chapter 14 — Real-life networks', bai: '14.6' }, [
  { cover: true, t: 'The network at home<br>and in the dorm', sub: 'router · DHCP reservations · port forwarding ·<br>CGNAT · UPnP · 2.4 vs 5 GHz', nhan: 'Chapter 14 · Lesson 14.6' },

  { t: 'What you will get', giua: true, body: `
${box('The question', '"I opened port 8080 exactly like the tutorial — why can\'t my friend reach my server?"', 'do2')}
<ul>
<li>The five jobs of a home router — and which address the Internet really sees</li>
<li><b>DHCP reservation</b>, then a <b>port forward</b> — measured from outside and from inside the ISP</li>
<li><b>CGNAT</b>: why most students cannot open ports, and what to do instead</li>
<li>UPnP, the radio (2.4 / 5 GHz, channels, mesh), and the attacker who loves defaults</li>
</ul>` },

  { t: 'Which address does the Internet see?', body: `
${term(rt('c146-wan', 'ip', 3, { gay: 96 }), { title: 'router WAN 100.64.0.2 is in 100.64.0.0/10 — the Internet sees 198.18.0.40 ⇒ CGNAT' })}
${box('', 'Check at home: router status page (WAN) vs any "what is my IP" site. WAN in 100.64–100.127 or a private range (10.x, 172.16–31.x, 192.168.x — typical in dorms) ⇒ a second NAT you do not control.', 'lam')}` },

  { t: 'DHCP: a room number — and reserving one', body: `
${term(rt('c146-dhcp', 'busybox', 1, { gay: 96 }), { title: 'first lease: 192.168.1.148 for 12 hours' })}
${term(rt('c146-giucho', 'echo', 1, { gay: 96 }) + '\n' + rt('c146-dhcp2', 'busybox', 1, { gay: 96 }), { title: 'reserve 192.168.1.50 for this MAC ⇒ same laptop, always .50' })}` },

  { t: 'Port forwarding = one DNAT rule', body: `
${term(rt('c146-nas', 'curl', 1) + '\n' + rt('c146-mo-cong', 'iptables', 2, { gay: 96 }), { title: 'a service at home, and the forward WAN :8080 → 192.168.1.10:80' })}
${term(rt('c146-thu-vao', 'curl', 2, { gay: 96 }), { title: 'from the Internet: refused at the ISP\'s address, timeout at 100.64.0.2' })}` },

  { t: 'Two gates: CGNAT', giua: true, body: `
${haiLop()}
${term(rt('c146-isp-thu', 'curl', 1) + '\n' + rt('c146-isp-mo', 'iptables', 1, { gay: 96 }) + '\n' + rt('c146-thu-vao2', 'curl', 1), { title: 'from inside the ISP it works · the ISP adds its own forward ⇒ the Internet gets in' })}` },

  { t: 'UPnP — and the way around CGNAT', body: `
${term(rt('c146-upnp', 'sleep', 1) + '\n' + rt('c146-upnp-nha', 'upnpc', 1), { title: 'UPnP under CGNAT: the router itself says it needs a public IP; the mapping fails' })}
${two(box('🚇 Tunnel out instead', 'SSH -R to a VPS (14.3) · WireGuard / Tailscale (14.4) · Cloudflare Tunnel / ngrok — works behind any number of NATs', 'xanh'), box('🌐 IPv6?', 'no NAT: a device can be reachable directly if the router\'s IPv6 firewall allows it (lesson 2.4)', 'lam'))}` },

  { t: 'The radio: 2.4 GHz, 5 GHz, channels', giua: true, body: `
${bang(['', '2.4 GHz', '5 GHz (6 GHz on Wi-Fi 6E/7)'], [
    ['range, walls', 'longer, better through walls', 'shorter'],
    ['speed', 'lower, crowded', 'higher'],
    ['channels', 'only <b>1 · 6 · 11</b> do not overlap', 'dozens'],
  ], { fs: 19 })}
${box('', 'Dorm floor: pick the least-used of 1/6/11 · router high, central, in the open · mesh with wired back-haul for big houses. Radio is explained here, not measured (no radios in containers).', 'lam')}` },

  { t: 'Attacker\'s corner: defaults', body: `
${term(rt('c146-admin', 'curl -s -o', 2, { gay: 96 }), { title: 'a roommate tries the admin page: the default login works on the third try' })}
${two(box('🕵️ What they get', 'Wi-Fi password · port forwards · the DNS every device uses (phishing, 14.2) · firmware', 'do2'), box('🔐 Day one', 'change the ADMIN password · WPS off · UPnP off · remote admin off · update firmware · IoT on a guest network', 'xanh'))}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A home router is a small Linux box: <b>DHCP · DNS · NAT · firewall · Wi-Fi</b></li>
<li>WAN address ≠ "what is my IP" ⇒ <b>CGNAT</b> ⇒ port forwards cannot work</li>
<li>Reserve the IP, then forward — behind CGNAT, <b>tunnel out</b></li>
<li>2.4 GHz: channels <b>1, 6, 11</b> · day one: change defaults, WPS/UPnP off, IoT on a guest network</li>
</ul>
<p style="margin:0">${kw('DHCP reservation', 'giữ chỗ IP')} ${kw('port forwarding', 'mở cổng = DNAT')} ${kw('CGNAT', 'NAT hai lớp')} ${kw('UPnP', 'tự mở cổng')} ${kw('WPS', 'PIN dò được')}</p>` },
]);
