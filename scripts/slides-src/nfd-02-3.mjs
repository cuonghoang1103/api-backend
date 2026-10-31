/**
 * nfd-02-3 — Networking for Developers, bài 2.3 "NAT, dải IP riêng và mạng Docker" (slug netdev-2-3-nat).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c23-*.out.txt). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, sh, two, box, kw, bang, steps, svg, T, R, C, MK, A, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-02-3', code: 'NFD 2.3', title: 'NAT, private ranges and Docker networks', sub: 'Networking for Developers · Chapter 2' };
const term = (t, o = {}) => sh(t, o);
const noC = { drop: /^# |^reading from file/ };

/* gói đi ra và câu trả lời, trước/sau router nhà (số thật của lab: laptop cổng 41000) */
const natPic = () => {
  const w = 1110, h = 250;
  let s = '';
  const hb = (x, y, c, t1, t2) => R(x, y, 330, 70, c + '14', c, { rx: 9 }) + T(x + 165, y + 28, t1, 17, { a: 'middle', m: 1, w: 700, f: c }) + T(x + 165, y + 54, t2, 17, { a: 'middle', m: 1 });
  s += R(10, 70, 150, 90, C.ip + '14', C.ip, { rx: 10 }) + T(85, 108, 'laptop', 19, { a: 'middle', w: 800, f: C.ip }) + T(85, 132, '192.168.50.10', 14, { a: 'middle', m: 1 });
  s += R(480, 60, 150, 110, '#fff3c4', C.br, { rx: 10, sw: 3 }) + T(555, 100, 'homegw', 19, { a: 'middle', w: 800, f: C.br }) + T(555, 124, 'NAT', 15, { a: 'middle', w: 700, f: C.red }) + T(555, 148, '+ conntrack', 14, { a: 'middle', m: 1 });
  s += R(950, 70, 150, 90, C.app + '14', C.app, { rx: 10 }) + T(1025, 108, 'server', 19, { a: 'middle', w: 800, f: C.app }) + T(1025, 132, '203.0.113.10', 14, { a: 'middle', m: 1 });
  s += hb(150, 0, C.ip, 'src 192.168.50.10:41000', 'dst 203.0.113.10:80') + hb(640, 0, C.red, 'src 198.51.100.2:41000', 'dst 203.0.113.10:80');
  s += hb(640, 180, C.tcp, 'src 203.0.113.10:80', 'dst 198.51.100.2:41000') + hb(150, 180, C.tcp, 'src 203.0.113.10:80', 'dst 192.168.50.10:41000');
  s += A(162, 100, 476, 100, 'na1', C.ip) + A(634, 100, 946, 100, 'na1', C.red) + A(946, 140, 634, 140, 'na2', C.tcp) + A(476, 140, 162, 140, 'na2', C.tcp);
  s += T(318, 92, 'inside (lan0)', 14, { a: 'middle', f: '#555' }) + T(790, 92, 'outside (wan0)', 14, { a: 'middle', f: '#555' });
  return svg(w, h, s, MK('na1', C.red) + MK('na2', C.tcp));
};

export const slides = lamDeck({ chuong: 'Chapter 2 — IP, routing and NAT', bai: '2.3' }, [
  { cover: true, t: 'NAT, private ranges<br>and Docker networks', sub: 'Why a whole house reaches the server from one IP,<br>why nobody can call in — and what docker run -p really does', nhan: 'Chapter 2 · Lesson 2.3' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Private ranges</b> (RFC 1918) and why they are not on the Internet</li>
<li><b>NAT</b> at the home router, captured on both sides</li>
<li>The <b>conntrack</b> table: how answers find the way back — and how long it remembers</li>
<li>Two devices, one public IP, the <b>same port</b></li>
<li>Why nobody can call <b>into</b> your laptop — and <b>port forwarding</b></li>
<li><b>CGNAT</b> on 4G, and <code class="i">docker run -p</code> as NAT on your own machine</li>
</ul>` },

  { t: 'Private ranges: not on the Internet', giua: true, body: `
${bang(['Range', 'Size', 'Typical use'], [
    ['<code class="i">10.0.0.0/8</code>', '16.7 million', 'companies, clouds (VPC), Kubernetes'],
    ['<code class="i">172.16.0.0/12</code>', '1 million', 'Docker’s default networks (172.17.x…)'],
    ['<code class="i">192.168.0.0/16</code>', '65 536', 'home Wi-Fi routers'],
  ], { fs: 21 })}
${term(ra('c23-vao', 'nc -vz -w 3 192.168.50.10', 2, noC), { title: 'from LabFlow’s server: call the laptop’s private address' })}
${box('', 'RFC 1918 (1996): anyone may reuse them inside their network ⇒ they cannot mean one place ⇒ Internet routers have <b>no route</b> (the DC router answers <code class="i">!N</code>).', 'lam')}` },

  { t: 'NAT: the router puts its own address on your packets', body: `
${natPic()}
${two(term(ra('c23-laptop', 'curl -s http', 1, noC), { sm: true, title: 'nfi-laptop' }), term(ra('c23-homegw', 'iptables -t nat -S POSTROUTING', 1, noC), { sm: true, title: 'nfi-homegw: one rule' }))}` },

  { t: 'The same connections on both sides of the router', giua: true, body: `
${term(ra('c23-homegw', 'tcpdump -n -t -q -r /tmp/lan.pcap', 2, noC), { title: 'SYN packets captured on lan0 (inside) and wan0 (outside)' })}
${steps([
    '<b>MASQUERADE</b> = SNAT (source NAT) to whatever address <code class="i">wan0</code> has — handy when the ISP changes it',
    'Destination and source <b>ports</b> unchanged; only the source <b>address</b> becomes 198.51.100.2',
    'Except the third line: <code class="i">41000 → 4734</code> — next slides',
  ])}` },

  { t: 'conntrack: how the answers find the way back', body: `
${term(ra('c23-homegw', 'conntrack -L', 1, { ...noC, cut: 132 }), { title: 'nfi-homegw — the connection tracking table (lines cut at “…”)' })}
${bang(['Part of a line', 'Meaning'], [
    ['first <code class="i">src= dst= sport= dport=</code>', '<b>original</b>: the connection as the laptop sent it'],
    ['second <code class="i">src= dst= sport= dport=</code>', '<b>reply</b>: what the router expects back — from the server to 198.51.100.2'],
    ['<code class="i">TIME_WAIT</code> · <code class="i">117</code>', 'TCP state · seconds left before the line is deleted'],
  ], { fs: 19 })}
${two(box('A reply arrives', 'the router finds the line ⇒ rewrites the destination back to <b>192.168.50.10</b>. No line ⇒ the packet has nowhere to go.', 'lam'), box('One line per connection', 'protocol + both addresses + both ports — the <b>5-tuple</b> of lesson 1.5 — keeps 3 connections from 2 devices apart.', 'lam'))}` },

  { t: 'How long does the NAT remember a silent connection?', giua: true, body: `
${term(ra('c23-timeout', 'sysctl net.netfilter.nf_conntrack_tcp_timeout_established', 3, noC), { title: 'Linux defaults on the lab’s home router' })}
${bang(['Where', 'Idle timeout'], [
    ['Linux, TCP established', '432 000 s (5 days)'],
    ['Linux, UDP', '30 s (120 s once traffic flows both ways)'],
    ['AWS NAT Gateway', '<b>350 s</b> — then the next packet gets a reset'],
  ], { fs: 20 })}
${box('Why your connection “dies for no reason”', 'A database connection or WebSocket silent for a few minutes loses its NAT line. Fix: <b>keep-alive</b> traffic shorter than the timeout (Chapter 4).', 'do2')}` },

  { t: 'Two devices, one public IP, the same port', body: `
${two(term(ra('c23-laptop', 'curl -s --local-port 41000', 1, noC), { sm: true, title: 'laptop: source port 41000' }), term(ra('c23-phone', 'curl -s --local-port 41000', 1, noC), { sm: true, title: 'phone: also source port 41000' }))}
${steps([
    '198.51.100.2:41000 was already used for that destination ⇒ the phone’s port is rewritten to <b>4734</b>',
    'Rewriting ports lets thousands of devices share one address: <b>PAT / NAPT</b>',
    'A house, a café, a whole university may reach your API from <b>one IP</b> — rate limits by IP alone hit everyone',
    'One address ≈ 64 000 ports per destination; AWS: up to <b>55 000</b> simultaneous connections per NAT gateway IP',
  ])}` },

  { t: 'Why nobody can call into your laptop', giua: true, body: `
${term(ra('c23-vao', 'nc -vz -w 3 198.51.100.2', 1, noC), { title: 'from the server: the home router’s public address, port 8080' })}
${steps([
    'NAT lines are created by <b>outgoing</b> packets — a connection that starts outside finds no line',
    '“Connection refused” comes from the <b>home router itself</b>: nothing listens on 8080, no rule says “this is the laptop’s”',
    'To expose the laptop on purpose: <b>DNAT</b> = port forwarding',
  ])}` },

  { t: 'Port forwarding = DNAT', body: `
${term(ra('c23-dnat', 'iptables -t nat -A PREROUTING', 2, noC), { sm: true, title: 'nfi-homegw: 198.51.100.2:8080 ⇒ 192.168.50.10:8080' })}
${term(ra('c23-vao2', 'curl -s -m 3', 1, noC), { sm: true, title: 'from the server, again' })}
${box('“NAT is my firewall” — no', 'It blocks incoming connections only as a side effect. A forwarded port puts your dev server (debug on, no password) on the Internet for every scanner. Forward only what must be public, add real auth, remove it after the demo — or use an <b>outbound tunnel</b> (Chapter 10).', 'do2')}` },

  { t: 'CGNAT: your ISP adds its own NAT', body: `
${term(ra('c23-mobile', 'ip -br -4 addr show eth0', 2, noC), { title: 'nfi-mobile (4G phone): its own address is 100.64.0.10' })}
${term(ra('c23-isp', 'iptables -t nat -S POSTROUTING', 1, noC), { title: 'nfi-isp: one NAT rule for all 4G customers' })}
${term(ra('c23-vao3', 'nc -vz', 1, noC), { title: 'from the server: try to reach the phone through its public address' })}
${box('', '<code class="i">100.64.0.0/10</code> (RFC 6598) = carrier-grade NAT. The public address belongs to the ISP and is shared — <b>no port forwarding possible</b>. Check: is your router’s WAN address in 100.64/10? Way out: outbound tunnel or IPv6.', 'lam')}` },

  { t: 'docker run -p is DNAT on your own machine', body: `
${term(ra('c23-docker', 'docker run -d', 7, { ...noC, gay: 100 }), { sm: true, title: 'on the host (rules read inside Docker Desktop’s VM, read-only)' })}
${bang(['Line', 'Means'], [
    ['<code class="i">--dport 18080 -j DNAT --to-destination 172.17.0.5:80</code>', '<code class="i">-p 18080:80</code> = port forwarding to the container'],
    ['<code class="i">-s 172.17.0.0/16 ! -o docker0 -j MASQUERADE</code>', 'containers going out are NATed — the home-router rule'],
    ['nginx log: <code class="i">192.168.65.1</code>', 'the app does not see the real client IP (Chapter 7: X-Forwarded-For)'],
  ], { fs: 17 })}` },

  { t: 'Published ports skip the host firewall', to: true, giua: true, body: `
${box('Docker’s own documentation', '“Publishing container ports is <b>insecure by default</b>.” Traffic to published ports is NATed before ufw rules apply, “<b>effectively ignoring your firewall configuration</b>.”', 'do2')}
${two(box('✗ Reachable by the whole Internet — even with ufw deny', sh('docker run -p 5432:5432 postgres', { title: 'binds 0.0.0.0 and [::]' }), 'do2'), box('✓ Only from the host itself', sh('docker run -p 127.0.0.1:5432:5432 postgres', { title: 'binds loopback only' }), 'xanh'))}
${box('', 'Publish only what must be public (80/443 behind your proxy); databases, admin panels, Redis: <b>127.0.0.1</b> or no <code class="i">-p</code> at all — containers on the same Docker network reach each other directly.', 'lam')}` },

  { t: 'Where this lives in the computer', to: true, giua: true, body: `
<ul>
<li>NAT rules and the conntrack table belong to <b>netfilter</b>, the kernel’s packet filter, in <b>RAM</b></li>
<li>The NAT rule is checked only for the <b>first packet</b>; later packets are translated by their conntrack line</li>
<li>A container = its own <b>network namespace</b> (interfaces, routes, ports) on a bridge</li>
<li>A home Wi-Fi router is usually a small Linux computer doing exactly this; CGNAT is the same idea on big ISP hardware</li>
</ul>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Private ranges are reused everywhere and have <b>no route</b> on the Internet</li>
<li>Home routers <b>SNAT</b> to one public IP; <b>conntrack</b> translates the replies back</li>
<li>Ports are rewritten too (PAT) — one IP = many users; silent NAT lines <b>expire</b></li>
<li>Incoming needs <b>DNAT</b>; impossible behind <b>CGNAT</b>; NAT is not a firewall</li>
<li><code class="i">-p</code> is DNAT in your kernel — bind <code class="i">127.0.0.1</code> unless it must be public</li>
</ul>
<p style="margin:0">${kw('private address', 'địa chỉ riêng')} ${kw('NAT', 'biên dịch địa chỉ')} ${kw('conntrack', 'theo dõi kết nối')} ${kw('port forwarding', 'mở cổng')} ${kw('CGNAT', 'NAT nhà mạng')}</p>` },
]);
