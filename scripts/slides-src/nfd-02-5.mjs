/**
 * nfd-02-5 — Networking for Developers, bài 2.5 "Internet được nối lại thế nào: AS và BGP" (slug netdev-2-5-bgp-internet).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c25-*.out.txt, c25-that = RIPEstat). Khuôn _nfd-chung.mjs + _nfd-inet.mjs.
 */
import { lamDeck, sh, two, box, kw, bang, steps, svg, T, R, C, A, MK, ra } from './_nfd-chung.mjs';
import { inetTopo } from './_nfd-inet.mjs';

export const deck = { key: 'nfd-02-5', code: 'NFD 2.5', title: 'How the Internet is stitched together: AS and BGP', sub: 'Networking for Developers · Chapter 2' };
const term = (t, o = {}) => sh(t, o);
// FRR in 5 dòng chú giải ở đầu bảng — ẩn (ghi rõ trên slide)
const noC = { drop: /^# |^Status codes|^\s+i internal|^Nexthop codes|^Origin codes|^RPKI validation|^Default local pref|^BGP table version|^$/ };

/* lời quảng bá lan ra: dc nói "203.0.113.0/24 — path 64510"; isp chuyển cho rogue "path 64500 64510" */
const propPic = () => {
  const w = 1110, h = 210;
  let s = '';
  const as = (x, t1, t2, c) => R(x, 70, 230, 80, c + '16', c, { rx: 12 }) + T(x + 115, 103, t1, 21, { a: 'middle', w: 800, f: c }) + T(x + 115, 130, t2, 15, { a: 'middle', m: 1 });
  s += as(870, 'dc · AS64510', 'owns 203.0.113.0/24', C.tcp) + as(440, 'isp · AS64500', 'owns 198.51.100.0/24', C.br) + as(10, 'rogue · AS64511', 'owns 198.18.0.0/24', C.red);
  s += A(866, 100, 674, 100, 'pp', C.ip) + A(436, 100, 244, 100, 'pp', C.ip);
  s += T(770, 60, '203.0.113.0/24', 16, { a: 'middle', m: 1, w: 700, f: C.ip }) + T(770, 80, 'path: 64510', 15, { a: 'middle', m: 1 });
  s += T(340, 60, '203.0.113.0/24', 16, { a: 'middle', m: 1, w: 700, f: C.ip }) + T(340, 80, 'path: 64500 64510', 15, { a: 'middle', m: 1 });
  s += T(w / 2, 186, 'each AS adds its own number in front ⇒ the last number = the origin AS (the owner)', 19, { a: 'middle', w: 700, f: C.br });
  return svg(w, h, s, MK('pp', C.ip));
};

export const slides = lamDeck({ chuong: 'Chapter 2 — IP, routing and NAT', bai: '2.5' }, [
  { cover: true, t: 'How the Internet is stitched<br>together: AS and BGP', sub: 'Real BGP tables, a hijack and a withdrawal in the lab —<br>and RPKI checked for cuongthai.com', nhan: 'Chapter 2 · Lesson 2.5' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What an <b>Autonomous System</b> (AS) is; transit, peering, exchange points (<b>VNIX</b>)</li>
<li><b>BGP</b>: how networks announce address ranges — read on real FRR tables</li>
<li>The <b>AS path</b> and the <b>origin AS</b></li>
<li>A <b>hijack</b> by a more specific prefix (YouTube 2008) — replayed, then fixed with a filter</li>
<li><b>RPKI</b>: who may announce cuongthai.com’s address — checked live</li>
<li>A <b>withdrawal</b> like Facebook 2021: why “DNS is down” can be routing</li>
</ul>` },

  { t: 'The Internet is a network of networks', giua: true, body: `
${inetTopo({ hl: ['isp', 'ix', 'dc', 'rogue'] })}
${bang(['Word', 'Meaning', 'Example'], [
    ['Autonomous System (AS)', 'one network, one administration, one routing policy, an AS number', 'Cloudflare AS13335 · cuongthai.com’s host AS152992 · lab AS64500/64510/64511'],
    ['transit · peering', 'pay a bigger network to reach everything · exchange customers’ traffic directly', 'a small ISP buys transit; two ISPs peer'],
    ['IXP', 'shared switch where networks plug in to peer', 'VNIX (VNNIC): Hanoi, Da Nang, HCMC · lab: 192.0.2.0/24'],
  ], { fs: 17 })}` },

  { t: 'BGP: “I can reach this range — through me”', giua: true, body: `
${propPic()}
${steps([
    'Routers of neighbouring ASes keep a <b>TCP session</b> (port 179) and announce <b>prefixes</b>',
    'Accepted routes are passed on with the AS number added in front: the <b>AS path</b>',
    'The best route per prefix goes into the kernel routing table (<code class="i">proto bgp</code> — lesson 2.2)',
  ])}` },

  { t: 'Reading the ISP’s BGP table', body: `
${term(ra('c25-isp', "vtysh -c 'show bgp ipv4 unicast summary'", 1, noC) + '\n' + ra('c25-isp', "vtysh -c 'show ip bgp'", 1, noC), { sm: true, title: 'nfi-isp (FRR) — 5-line legend hidden' })}
${bang(['Column', 'Meaning'], [
    ['<code class="i">*&gt;</code>', 'valid and <b>best</b> — the route actually used'],
    ['Next Hop', 'neighbour at the IX to send packets to · 0.0.0.0 = announced by this router'],
    ['Path', 'AS path — the <b>last</b> number is the origin AS (the owner) · i = originated inside it'],
  ], { fs: 18 })}` },

  { t: 'The same routes, seen from the datacenter', giua: true, body: `
${term(ra('c25-dc', "vtysh -c 'show ip bgp'", 1, noC), { title: 'nfi-dc (AS64510)' })}
${steps([
    'AS64511’s range reaches the DC <b>through the ISP</b>: path <code class="i">64500 64511</code> — two ASes away',
    'Several routes to one prefix ⇒ policy first (who pays whom), then e.g. the <b>shorter AS path</b>',
    'IPv6 ranges travel the same way (<code class="i">show bgp ipv6 unicast</code>)',
  ])}` },

  { t: 'The weakness: BGP believes what it is told', to: true, giua: true, body: `
${box('24 February 2008 — YouTube disappears (RIPE NCC analysis)', '<b>18:47 UTC</b>: Pakistan Telecom (AS17557) announces <code class="i">208.65.153.0/24</code> to black-hole YouTube locally · YouTube itself announces <code class="i">208.65.152.0/22</code> · upstream PCCW (AS3491) passes the /24 to the world · <b>a /24 beats a /22 everywhere</b> · YouTube answers ~80 min later with the /24, then two /25s · PCCW withdraws at <b>21:01 UTC</b> — about two hours.', 'do2')}
${steps([
    'Classic BGP has <b>no built-in check</b> that a network may announce a range',
    'Combined with <b>longest prefix match</b> (lesson 2.2) ⇒ a more specific announcement steals the traffic',
  ])}` },

  { t: 'Replay: the rogue AS announces half of LabFlow', body: `
${term(ra('c25-rogue-cuop', 'ip route add blackhole', 2, noC), { sm: true, title: 'nfi-rogue (AS64511): announce 203.0.113.0/25 and drop everything sent there' })}
${term(ra('c25-isp-cuop', "vtysh -c 'show ip bgp'", 3, noC), { sm: true, title: 'nfi-isp: both routes accepted — the /25 wins for .0–.127' })}` },

  { t: 'What users and the victim see', body: `
${term(ra('c25-laptop-cuop', 'curl -sS', 3, { ...noC, drop: /^# |^$|global options|^; <<>>/ }), { sm: true, title: 'nfi-laptop: timeout · path vanishes after the ISP · DNS dead (ns .53 is in the /25)' })}
${term(ra('c25-dc-thay', 'vtysh', 1, noC), { sm: true, title: 'nfi-dc: its own range comes back with origin AS64511 — what BGP monitoring alerts on' })}` },

  { t: 'Fix 1: filter what a neighbour may announce', body: `
${term(ra('c25-isp-loc', "vtysh -c 'configure terminal'", 4, { ...noC, gay: 100 }), { sm: true, title: 'nfi-isp: accept only 198.18.0.0/24 from AS64511' })}
${term(ra('c25-laptop-ok', 'curl', 1, noC), { sm: true, title: 'nfi-laptop: LabFlow is back' })}
${box('', 'Works between neighbours who know each other — in 2008 it failed because PCCW did not filter its customer.', 'lam')}` },

  { t: 'Fix 2: RPKI — checked on the real Internet', body: `
${term(ra('c25-that', 'IP=', 7, { ...noC, gay: 108 }), { sm: true, title: 'RIPEstat public API — read-only' })}
${bang(['Result', 'Meaning'], [
    ['<code class="i">valid</code>', 'AS152992 announces 160.187.0.0/23 — its ROA allows it, up to /24'],
    ['<code class="i">invalid_asn</code>', 'another AS (64511) announcing the range — wrong origin ⇒ dropped by validating networks'],
    ['<code class="i">invalid_length</code>', 'a /25 — longer than the ROA allows: how a 2008-style hijack is caught today'],
  ], { fs: 17 })}` },

  { t: 'RPKI is not the whole answer', to: true, giua: true, body: `
${box('27 June 2024 — Cloudflare 1.1.1.1', '<b>Hijack</b>: 1.1.1.1/32 originated by AS267613 — RPKI <b>invalid</b> (wrong origin, longer than /24). <b>Leak</b>: 1.1.1.0/24 passed on by AS262504 — still Cloudflare’s origin ⇒ RPKI <b>valid</b>, origin validation cannot catch it. Protecting the path needs newer work (<b>ASPA</b>).', 'do2')}
${steps([
    '<b>ROA</b> = signed “prefix P may be originated by AS N, up to length L”',
    'Routers doing <b>route origin validation</b> (RFC 6811) drop announcements that contradict a ROA',
    'Test your own ISP: <code class="i">isbgpsafeyet.com</code>',
  ])}` },

  { t: 'Withdrawal: the day Facebook disappeared (4 Oct 2021)', to: true, giua: true, body: `
${steps([
    'Maintenance command takes down Facebook’s whole backbone; the audit tool that should stop it has a bug',
    'DNS servers lose contact with the datacenters ⇒ by design they <b>withdraw their own BGP routes</b>',
    '~15:40 UTC burst of routing changes · by <b>15:58</b> the DNS prefixes are gone from the Internet',
    'Resolvers worldwide (1.1.1.1, 8.8.8.8…) answer <b>SERVFAIL</b> · names resolve again ~<b>21:20</b> — about 5.5 h',
  ])}
${box('', 'Sources: Meta Engineering “More details about the October 4 outage”; Cloudflare “Understanding how Facebook disappeared from the Internet”.', 'lam')}` },

  { t: 'Replay: the datacenter withdraws its range', body: `
${two(term(ra('c25-dc-rut', "vtysh -c 'configure terminal'", 2, { ...noC, gay: 60 }), { sm: true, title: 'nfi-dc: stop announcing' }), term(ra('c25-isp-rut', "vtysh -c 'show ip bgp'", 3, noC), { sm: true, title: 'nfi-isp: LabFlow and its DNS are gone' }))}
${term(ra('c25-laptop-rut', 'dig +tries=1', 4, { drop: /^# |^$|^;; (global|OPT|QUESTION|WHEN|MSG|flags)|^; EDNS|^;labflow/ }), { sm: true, title: 'nfi-laptop: “the name does not exist any more” — then the IP fails too' })}` },

  { t: '“DNS is down” is often not a DNS problem', to: true, giua: true, body: `
${bang(['Our lab', 'Facebook 2021'], [
    ['dnsmasq answers <b>REFUSED</b> + EDE 23 “Network Error”', 'public resolvers answered <b>SERVFAIL</b>'],
    ['app: <code class="i">Could not resolve host</code>', 'apps: “facebook.com not found”'],
    ['the IPv6 route was still there — useless without DNS', 'most Facebook prefixes stayed routed — DNS ones were gone'],
  ], { fs: 19 })}
${box('Checklist', 'Can you reach the name server’s IP (<code class="i">dig @IP</code>, traceroute)? Is the prefix still announced (looking glass, RIPEstat, Cloudflare Radar)? Never let your only way in depend on the network you are fixing.', 'xanh')}` },

  { t: 'Where this lives in the computer', to: true, giua: true, body: `
<ul>
<li>A BGP daemon (<b>FRR bgpd</b> here; vendor software on hardware routers) keeps the sessions and all routes in RAM — the <b>RIB</b></li>
<li>The best route per prefix is pushed into the kernel forwarding table: <code class="i">proto bgp</code></li>
<li>A full Internet table ≈ a million IPv4 prefixes, held in fast memory on core routers’ forwarding chips</li>
<li><b>RPKI validators</b> download ROAs from the five regional registries and tell routers what is valid</li>
</ul>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Internet = autonomous systems linked by <b>transit</b> and <b>peering</b>, often at <b>IXPs</b></li>
<li><b>BGP</b> announces prefixes with an AS path; the last AS is the <b>origin</b></li>
<li>BGP trusts what it hears: more specific wins ⇒ <b>hijack</b>; defences = filters + <b>RPKI</b></li>
<li><b>Withdrawal</b> removes a network in seconds; vanished DNS ⇒ “name does not exist”</li>
<li>“DNS is down” can be routing — check reachability and announcements</li>
</ul>
<p style="margin:0">${kw('AS', 'hệ tự trị')} ${kw('peering', 'kết nối ngang hàng')} ${kw('AS path', 'đường AS')} ${kw('hijack', 'cướp tuyến')} ${kw('ROA', 'giấy phép AS gốc')}</p>` },
]);
