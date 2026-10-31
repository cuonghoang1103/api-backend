/**
 * nfd-02-4 — Networking for Developers, bài 2.4 "IPv6 cho lập trình viên" (slug netdev-2-4-ipv6).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c24-*.out.txt). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, sh, two, box, kw, bang, steps, svg, T, R, C, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-02-4', code: 'NFD 2.4', title: 'IPv6 for developers', sub: 'Networking for Developers · Chapter 2' };
const term = (t, o = {}) => sh(t, o);
const noC = { drop: /^# |^reading from file/ };

/* 8 nhóm 16 bit, tô các nhóm số 0 bị gộp thành :: */
const groupsPic = () => {
  const w = 1110, h = 200, g = ['2001', '0db8', '0000', '0000', '0001', '0000', '0000', '0001'];
  let s = '';
  g.forEach((x, i) => {
    const X = 8 + i * 138, zero = x === '0000', first = i === 2 || i === 3;
    s += R(X, 20, 124, 56, zero ? (first ? '#fde2e2' : '#f1f1f1') : C.ip + '18', zero ? (first ? C.red : '#aaa') : C.ip, { rx: 8, sw: first ? 3 : 2 });
    s += T(X + 62, 57, x, 26, { a: 'middle', w: 800, m: 1, f: zero ? (first ? C.red : '#888') : C.ip });
    s += T(X + 62, 98, `16 bits`, 13, { a: 'middle', f: '#777' });
  });
  s += T(w / 2, 138, '1) drop leading zeros: 2001 : db8 : 0 : 0 : 1 : 0 : 0 : 1', 21, { a: 'middle', m: 1 });
  s += T(w / 2, 172, '2) one :: for the longest zero run — tie ⇒ the FIRST: 2001:db8::1:0:0:1', 21, { a: 'middle', m: 1, w: 700, f: C.red });
  return svg(w, h, s);
};

/* dòng thời gian Happy Eyeballs (số đo thật: curl 0,21 s; Node 324 ms; không HE: còn chờ ở 8 s) */
const hePic = () => {
  const w = 1110, h = 230, x0 = 150, sc = (w - x0 - 30) / 400; // 0–400 ms
  let s = '';
  s += `<line x1="${x0}" y1="200" x2="${w - 20}" y2="200" stroke="#999" stroke-width="2"/>`;
  [0, 100, 200, 300, 400].forEach((t) => { s += `<line x1="${x0 + t * sc}" y1="196" x2="${x0 + t * sc}" y2="204" stroke="#999" stroke-width="2"/>` + T(x0 + t * sc, 224, `${t} ms`, 14, { a: 'middle', f: '#777', m: 1 }); });
  const bar = (y, a, b, c, t) => R(x0 + a * sc, y, (b - a) * sc, 30, c + '30', c, { rx: 6, sw: 2 }) + T(x0 + a * sc + 8, y + 21, t, 15, { w: 700, f: c });
  s += T(10, 40, 'curl', 18, { w: 800 }) + bar(18, 0, 400, C.red, 'IPv6 SYN … no answer (path broken)') + bar(52, 200, 211, C.tcp, '') + T(x0 + 215 * sc, 74, 'IPv4 connected at 0.211 s', 15, { w: 800, f: C.tcp });
  s += T(10, 128, 'Node 22', 18, { w: 800 }) + bar(106, 0, 250, C.red, 'IPv6 attempt (250 ms timeout)') + bar(140, 250, 324, C.tcp, '') + T(x0 + 330 * sc, 162, '324 ms', 15, { w: 800, f: C.tcp });
  s += T(10, 190, 'measured', 13, { f: '#999', i: 1 });
  return svg(w, h, s);
};

export const slides = lamDeck({ chuong: 'Chapter 2 — IP, routing and NAT', bai: '2.4' }, [
  { cover: true, t: 'IPv6 for developers', sub: 'Read an address, live without NAT,<br>and fix the three IPv6 bugs developers meet', nhan: 'Chapter 2 · Lesson 2.4' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Read and <b>compress</b> a 128-bit IPv6 address — and the classic trap</li>
<li>Global vs <b>link-local</b> addresses; <b>Neighbor Discovery</b> instead of ARP</li>
<li><b>No NAT</b>: what the server sees, and what that changes for firewalls and rate limits</li>
<li><b>Dual-stack</b> and <b>Happy Eyeballs</b>, measured: 0.21 s, 324 ms — or a hang</li>
<li>Bug 1: <code class="i">localhost</code> refused (<code class="i">ECONNREFUSED ::1</code>)</li>
<li>Bug 2: an app on <code class="i">0.0.0.0</code> refusing IPv6 · <code class="i">::ffff:</code> in your logs</li>
</ul>` },

  { t: '128 bits, written in hex — and one ::', giua: true, body: `
${groupsPic()}
${term(ra('c24-dia-chi', 'python3 -c "import ipaddress as i; a =', 3, { ...noC, gay: 110 }), { sm: true, title: 'checked with Python’s ipaddress' })}` },

  { t: 'How much space: /48 for a site, /64 for a network', giua: true, body: `
${bang(['Prefix', 'Who gets it', 'In our lab'], [
    ['<code class="i">/32</code>', 'an ISP (from a regional registry)', '<code class="i">2001:db8::/32</code> = documentation range'],
    ['<code class="i">/48</code> or <code class="i">/56</code>', 'a customer site: 65 536 or 256 networks', 'ISP owns <code class="i">2001:db8:a::/48</code>'],
    ['<code class="i">/64</code>', 'one LAN — 2<sup>64</sup> addresses', 'home LAN <code class="i">2001:db8:a:50::/64</code>'],
  ], { fs: 20 })}
${box('', 'One /64 = 18 446 744 073 709 551 616 addresses. Nobody counts hosts any more: every LAN is a /64, devices build their own address (SLAAC) or get one from DHCPv6.', 'lam')}` },

  { t: 'One card, several addresses', giua: true, body: `
${term(ra('c24-dia-chi', 'ip -br -6 addr show eth0', 2, noC), { title: 'nfi-laptop' })}
${bang(['Address', 'Kind', 'Meaning'], [
    ['<code class="i">2001:db8:a:50::10/64</code>', 'global', 'unique on the Internet, routed like a public IPv4'],
    ['<code class="i">fe80::c0ff:fea8:320a</code>', 'link-local', 'only on this link; from MAC 02:00:c0:a8:32:0a (insert ff:fe, flip one bit)'],
    ['(on real laptops/phones)', 'temporary', 'random, changes over time — privacy (RFC 8981)'],
  ], { fs: 18 })}` },

  { t: 'No ARP: Neighbor Discovery (ICMPv6)', giua: true, body: `
${term(ra('c24-ndp', 'tcpdump -n -t -r /tmp/n.pcap', 3, noC), { title: 'nfi-laptop: ping -6 the phone with an empty neighbour table' })}
${steps([
    'Question “who has 2001:db8:a:50::11?” goes to <code class="i">ff02::1:ff00:11</code> — a <b>multicast</b> group of the target, not everyone',
    'The <b>neighbor advertisement</b> answers directly · <code class="i">ip -6 neigh</code> = the IPv6 ARP cache (REACHABLE, STALE… lesson 1.4)',
  ])}` },

  { t: 'No NAT: the server sees the real device', giua: true, body: `
${term(ra('c24-dia-chi', 'curl -s "http://[2001', 2, noC), { title: 'nfi-laptop: the same server over IPv6, then over IPv4' })}
${bang(['Consequence', 'What to do'], [
    ['incoming connections work (no CGNAT)', 'a <b>firewall</b> matters — “NAT protected me” is gone'],
    ['one user owns a whole /64', 'rate-limit / ban per <b>/64</b>, not per address'],
    ['addresses up to 45 characters', 'store as text(45) or an <b>inet</b> type, not varchar(15)'],
  ], { fs: 19 })}` },

  { t: 'Dual-stack: one name, two addresses', giua: true, body: `
${term(ra('c24-dual', 'dig +short labflow.test A', 3, noC), { sm: true, title: 'nfi-laptop: the name has an A and an AAAA record' })}
${term(ra('c24-dual', 'curl -sv', 1, noC), { sm: true, title: 'curl tries IPv6 first' })}
${box('', 'A record = IPv4, AAAA record = IPv6. The system lists <b>IPv6 first</b> (RFC 6724) when it has a global IPv6 address — fine while IPv6 works.', 'lam')}` },

  { t: 'IPv6 broken silently: Happy Eyeballs, measured', body: `
${term(ra('c24-isp-hong', 'ip6tables -I FORWARD', 1, noC) + '\n' + ra('c24-happy', 'curl -sv', 2, { ...noC, gay: 96 }), { sm: true, title: 'nfi-isp drops IPv6 to the DC; then nfi-laptop' })}
${hePic()}` },

  { t: 'Without Happy Eyeballs: a hang', body: `
${term(ra('c24-happy', 'curl -6', 1, noC) + '\n' + ra('c24-happy', 'node --no-network', 1, { ...noC, gay: 100 }), { sm: true })}
${term(ra('c24-mac-dinh', 'node -p', 1, { ...noC, gay: 100 }) + '\n' + ra('c24-mac-dinh', 'sysctl', 1, noC), { sm: true })}
${box('So “IPv6 is broken somewhere” looks like…', 'modern clients: the first request is <b>~0.2–0.3 s slower</b> · old libraries / hand-written sockets: <b>hangs ≈ 127 s</b> (computed: tcp_syn_retries 6 ⇒ 1+2+4+8+16+32+64 s). Happy Eyeballs lives in each program’s library, not in the kernel.', 'do2')}` },

  { t: 'Bug: “localhost: connection refused” (Node ≥ 17)', body: `
${two(term(ra('c24-localhost', 'getent ahosts localhost', 1, noC), { sm: true }), term(ra('c24-localhost', 'ss -tln', 1, noC) + '\n' + ra('c24-localhost', "node -e \"require('dns')", 1, { ...noC, gay: 60 }), { sm: true }))}
${term(ra('c24-localhost', 'curl -s http://localhost', 3, { ...noC, gay: 110 }), { sm: true })}` },

  { t: 'Why localhost broke — and the two fixes', to: true, giua: true, body: `
${steps([
    '<code class="i">localhost</code> = <b>::1</b> first, then 127.0.0.1 · the dev server listens only on <b>127.0.0.1</b>',
    'Node 17 stopped reordering addresses IPv4-first ⇒ a plain connect goes to <b>::1</b> ⇒ ECONNREFUSED',
    'Node 20+ / curl try the next address (auto-selection); many tools and libraries do not',
  ])}
${two(box('Fix on the server', 'listen on <code class="i">::</code> (dual-stack) or on both addresses', 'xanh'), box('Fix on the client', 'write <code class="i">127.0.0.1</code> in the connection string, not localhost', 'xanh'))}` },

  { t: 'Bug: app on 0.0.0.0 refuses IPv6 · ::ffff: in logs', body: `
${term(ra('c24-nghe', 'ss -tln', 1, noC), { sm: true, title: 'nfi-server: listen(3000, "0.0.0.0") and listen(3001)' })}
${term(ra('c24-goi-nghe', 'curl -s http://203.0.113.10:3000/', 4, noC), { sm: true, title: 'nfi-laptop' })}
${box('', '<code class="i">::ffff:198.51.100.2</code> = an <b>IPv4-mapped</b> IPv6 address: how a dual-stack socket shows an IPv4 client. It lands in logs, allow-lists, rate limiters (Express <code class="i">req.ip</code>) — strip <code class="i">::ffff:</code> before comparing.', 'do2')}` },

  { t: 'Where this lives in the computer', to: true, giua: true, body: `
<ul>
<li>Separate kernel tables in RAM: <code class="i">ip -6 addr</code>, <code class="i">ip -6 route</code>, <code class="i">ip -6 neigh</code></li>
<li>NDP and Router Advertisements = <b>ICMPv6</b>, handled by the kernel</li>
<li><b>Happy Eyeballs</b> = each program’s networking library (libcurl, Node <code class="i">net</code>, browsers) — not the kernel</li>
<li>Address order (<code class="i">getent ahosts</code>) = the system resolver library (glibc, <code class="i">/etc/gai.conf</code>)</li>
</ul>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>IPv6 = 128 bits in hex; drop leading zeros; <b>one ::</b> for the longest (first) zero run</li>
<li>Every LAN is a <b>/64</b>; global + link-local addresses; <b>NDP</b> replaces ARP</li>
<li><b>No NAT</b>: real device seen, incoming works ⇒ firewall; limits per /64</li>
<li>Dual-stack prefers IPv6; <b>Happy Eyeballs</b> hides breakage (~0.2–0.3 s) — without it, a hang</li>
<li>Recognise: localhost → <b>::1</b> refused · app on 0.0.0.0 · <b>::ffff:</b> in logs</li>
</ul>
<p style="margin:0">${kw('link-local', 'chỉ trong mạng cục bộ')} ${kw('NDP', 'khám phá hàng xóm')} ${kw('dual-stack', 'hai ngăn xếp')} ${kw('Happy Eyeballs', 'đua v6/v4')} ${kw('::ffff:', 'IPv4 ánh xạ')}</p>` },
]);
