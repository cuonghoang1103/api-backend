/**
 * nfd-03-4 — Networking for Developers, bài 3.4 "Anycast, GeoDNS và cân bằng tải bằng DNS" (slug netdev-3-4-anycast-geodns).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c34-*.out.txt).
 */
import fs from 'node:fs';
import { lamDeck, sh, two, box, kw, bang, steps, ra, svg, T, R, C, MK, A } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-03-4', code: 'NFD 3.4', title: 'Anycast, GeoDNS and DNS-based load balancing', sub: 'Networking for Developers · Chapter 3' };
const term = (t, o = {}) => sh(t, o);
const D = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|^$/ };
const CDN = fs.readFileSync(new URL('../../content/courses/networking-for-developers/lab/moi-truong/dns/named-cdn.conf', import.meta.url), 'utf8')
  .split('\n').filter((l) => l && !l.startsWith('//')).map((l) => l.replace(/; (zone|recursion|listen-on-v6|server-id)/g, ';\n    $1')).join('\n');

/** Sơ đồ anycast của lab: hai PoP cùng quảng bá 198.19.1.0/24; ISP chọn pop1, DC chọn pop2. */
function soDoAnycast() {
  const box2 = (x, y, w, h, t1, t2, c, fill) => R(x, y, w, h, fill || c + '14', c, { rx: 10 }) + T(x + w / 2, y + 26, t1, 18, { a: 'middle', w: 800, f: c }) + T(x + w / 2, y + 48, t2, 14, { a: 'middle', m: 1 });
  let s = '';
  s += box2(20, 30, 200, 64, 'laptop (home)', '192.168.50.10', C.ip);
  s += box2(20, 196, 200, 64, 'server (DC)', '203.0.113.10', C.ip);
  s += box2(300, 30, 200, 64, 'isp router', 'AS64500', C.br);
  s += box2(300, 196, 200, 64, 'dc router', 'AS64510', C.br);
  s += box2(640, 20, 440, 84, 'pop1 “Hanoi” — 198.19.1.1', 'announces 198.19.1.0/24 · AS64530', C.tcp, '#e9f5ec');
  s += box2(640, 186, 440, 84, 'pop2 “Singapore” — 198.19.1.1', 'announces 198.19.1.0/24 · AS64530', C.app, '#fdf0e3');
  s += T(860, 92, 'same address, same prefix', 13, { a: 'middle', f: '#555' }) + T(860, 258, 'same address, same prefix', 13, { a: 'middle', f: '#555' });
  s += `<line x1="400" y1="94" x2="400" y2="196" stroke="#bbb" stroke-width="3" stroke-dasharray="6 5"/>` + T(410, 150, 'IX / BGP', 13, { f: '#888' });
  s += A(220, 62, 298, 62, 'ag', C.tcp) + A(500, 62, 638, 62, 'ag', C.tcp) + T(569, 52, 'path 64530 ✓', 14, { a: 'middle', w: 800, f: C.tcp });
  s += A(220, 228, 298, 228, 'ao', C.app) + A(500, 228, 638, 228, 'ao', C.app) + T(569, 218, 'path 64530 ✓', 14, { a: 'middle', w: 800, f: C.app });
  s += `<line x1="500" y1="80" x2="640" y2="210" stroke="#ccc" stroke-width="2" stroke-dasharray="4 4"/>` + T(585, 138, 'via dc: 64510 64530', 12, { a: 'middle', f: '#999' });
  return svg(1110, 280, s, MK('ag', C.tcp) + MK('ao', C.app));
}

export const slides = lamDeck({ chuong: 'Chapter 3 — DNS in depth', bai: '3.4' }, [
  { cover: true, t: 'Anycast, GeoDNS and<br>DNS-based load balancing', sub: 'One IP in two cities, answers chosen by who asks,<br>two IPs for one name — measured', nhan: 'Chapter 3 · Lesson 3.4' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Anycast</b>: one address served from two cities — built with real BGP in the lab</li>
<li><b>Failover</b> by withdrawing a site — measured second by second</li>
<li><b>GeoDNS</b>: why a CDN gives Hanoi and Singapore different answers</li>
<li>Why GeoDNS sees the <b>resolver, not the user</b> — and what ECS changes</li>
<li><b>Round-robin DNS</b> with a dead server: what curl, Python and Node pay</li>
<li>Cloudflare’s <b>orange cloud</b>, seen from DNS on cuongthai.com</li>
</ul>` },

  { t: 'Anycast: two sites announce the same prefix', giua: true, body: `
${soDoAnycast()}
${box('', 'Nothing in DNS decides who answers: each router picks the <b>shortest path</b> to 198.19.1.0/24. Home users reach pop1, datacenter machines reach pop2.', 'lam')}` },

  { t: 'Same address, different machine', body: `
${two(term(ra('c34-anycast', 'dig @198.19.1.1', 2, { ...D, drop: /^# |^$|^traceroute to/ }), { sm: true, title: 'nfi-laptop (home)' }), term(ra('c34-anycast-dc', 'dig @198.19.1.1', 2, { ...D, drop: /^# |^$|^traceroute to/ }), { sm: true, title: 'nfi-server (datacenter)' }))}
${steps([
    '<code class="i">id.server CH TXT</code>: “which copy are you?” — the same trick as the root servers (3.1)',
    'Home → homegw → isp → <b>pop1 Hanoi</b> · Datacenter → dc router → <b>pop2 Singapore</b>',
  ])}` },

  { t: 'The ISP’s router sees two paths', body: `
${term(ra('c34-bgp', 'vtysh', 1, D), { title: 'nfi-isp: show ip bgp 198.19.1.0/24' })}
${box('', 'Best: <b>64530</b> via pop1 (direct at the IX) · second: <b>64510 64530</b> via the datacenter. The dc router chooses the opposite.', 'xanh')}` },

  { t: 'Failover: pop1 stops announcing', body: `
${two(term(ra('c34-pop1-rut', 'date', 2, { ...D, gay: 60 }), { sm: true, title: 'nfi-pop1 at 16:22:56' }), term(ra('c34-theo-doc', 'cat', 1, D), { sm: true, title: 'nfi-laptop: 198.19.1.1, every second' }))}
${box('One second, no client change', 'The ISP router dropped one route and used the other. No new IP, no config, no TTL. That is why root servers and public resolvers are anycast. Long TCP connections can break if moved mid-way (RFC 4786).', 'lam')}` },

  { t: 'Anycast in the real world', to: true, giua: true, body: `
${bang(['Service', 'Since', 'Anycast'], [
    ['Root servers (13 names)', '—', '2 049 instances (1 Nov 2026) — from Vietnam F, K, M answer in Hanoi'],
    ['Google Public DNS <b>8.8.8.8</b>', '3 Dec 2009', 'one address, many sites'],
    ['Cloudflare <b>1.1.1.1</b>', '1 Apr 2018', 'one address, many sites'],
  ], { fs: 20 })}
${term(ra('c34-that', 'dig @1.1.1.1', 1, D), { sm: true, title: 'from the course lab: 1.1.1.1 answered from Hong Kong' })}` },

  { t: 'GeoDNS: the CDN’s name server chooses by who asks', body: `
${term(CDN, { sm: true, title: 'lab/moi-truong/dns/named-cdn.conf (BIND views)' })}
${steps([
    '<code class="i">static.labflow.test</code> is a CNAME to <code class="i">labflow.cdn.test</code> (3.2)',
    'Question from a Vietnamese resolver ⇒ view <b>vn</b> ⇒ Hanoi edge <b>.10</b>',
    'Any other resolver ⇒ view <b>sg</b> ⇒ Singapore edge <b>.11</b>',
  ])}` },

  { t: 'Same name, two answers, two servers', body: `
${term(ra('c34-geo', 'dig +short static.labflow.test', 3, D), { sm: true, title: 'nfi-laptop: ISP resolver and pop1 (both in Vietnam)' })}
${term(ra('c34-geo-dc', 'dig @198.19.1.1', 2, { ...D, gay: 96 }), { sm: true, title: 'nfi-ns2 in the datacenter: its public DNS is pop2 (Singapore)' })}` },

  { t: 'GeoDNS sees the resolver, not the user', body: `
${term(ra('c34-geo-sai', 'dig @198.19.1.1 id', 3, { ...D, gay: 96 }), { sm: true, title: 'nfi-laptop in Vietnam, after pop1 was withdrawn' })}
${box('EDNS Client Subnet (RFC 7871)', 'A resolver may pass a short form of the user’s address (e.g. a /24) so the authoritative server can choose better — a privacy cost. <b>1.1.1.1 does not send ECS.</b> CDNs therefore also use anycast for the site itself.', 'do2')}` },

  { t: 'Round-robin DNS: two A records, one dead server', body: `
${term(ra('c34-rr-ns', 'printf', 3, { ...D, gay: 96 }), { sm: true, title: 'nfi-ns: app has .10 and .12 — .12 was shut down last month' })}
${term(ra('c34-rr', 'for i in 1 2 3 4; do dig', 1, D), { sm: true, title: 'nfi-laptop: the resolver rotates the order' })}` },

  { t: 'What a dead address costs each client', body: `
${term(ra('c34-rr', 'for i in 1 2 3 4; do curl', 2, { ...D, gay: 96 }), { sm: true, title: 'curl' })}
${term(ra('c34-rr', 'for i in 1 2 3 4; do python3', 2, { ...D, gay: 96 }), { sm: true, title: 'Python socket.create_connection' })}` },

  { t: 'Why curl lost only 0.2 s', body: `
${term(ra('c34-rr-thu', 'curl', 3, { ...D, gay: 96 }), { sm: true, title: 'nfi-laptop: dead address forced first, every attempt timestamped' })}
${steps([
    'curl starts the next address after its <b>Happy Eyeballs delay</b> — 200 ms by default, 1 s when set to 1000',
    'Python waits for each address to fail: ~3 s for “No route to host”, longer behind a silent firewall',
    'Node (<code class="i">autoSelectFamily</code>, default since v20) tries each address for up to <b>250 ms</b>',
  ])}` },

  { t: 'Round-robin DNS is not a load balancer', to: true, giua: true, body: `
${bang(['Problem', 'Why'], [
    ['No health check', 'the dead .12 stays in every answer until removed — then one more TTL in caches'],
    ['Uneven split', 'one big resolver hands the same order to thousands of users'],
    ['Cost depends on the client', 'curl 0.2 s · Node 0.26 s · Python 3 s · silent firewall: tens of seconds'],
  ], { fs: 21 })}
${box('Instead', 'Health-checked DNS from your provider, or a real <b>load balancer</b> behind one address (Chapter 10).', 'xanh')}` },

  { t: 'The orange cloud, seen from DNS', body: `
${term(ra('c34-that', 'dig +short cuongthai.com', 6, { ...D, gay: 96 }), { sm: true, title: 'real Internet — who owns each address (Team Cymru IP-to-ASN)' })}` },

  { t: 'Proxied or not: what changes for you', to: true, giua: true, body: `
${bang(['', 'cuongthai.com (grey cloud)', 'media.cuongthai.com (orange cloud)'], [
    ['DNS answers', 'the VPS: 160.187.1.208 (AS152992, VN)', 'Cloudflare anycast IPs (AS13335)'],
    ['Who answers HTTP', '<code class="i">server: nginx/1.27.5</code>', '<code class="i">server: cloudflare</code>, edge <b>HKG</b> (cf-ray)'],
    ['Origin IP', 'visible to anyone with dig', 'hidden behind Cloudflare'],
    ['Client IP in your app', 'the real client', 'Cloudflare’s — read <code class="i">CF-Connecting-IP</code> (Ch. 7)'],
  ], { fs: 19 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>Anycast</b>: same prefix from several sites, BGP picks the nearest; failover in ~1 s</li>
<li>Root servers, <b>8.8.8.8</b> (2009) and <b>1.1.1.1</b> (2018) are anycast</li>
<li><b>GeoDNS</b> answers by the resolver’s address; ECS helps, at a privacy cost</li>
<li><b>Round robin</b> has no health check: a dead IP costs 0.2 s to 3 s+ per connection</li>
<li>Cloudflare proxy = its own anycast IPs in DNS; your origin and client IP change</li>
</ul>
<p style="margin:0">${kw('anycast', 'một IP nhiều nơi')} ${kw('PoP', 'điểm hiện diện')} ${kw('GeoDNS', 'DNS theo vị trí')} ${kw('round robin', 'xoay vòng')} ${kw('proxied', 'đi qua proxy')}</p>` },
]);
