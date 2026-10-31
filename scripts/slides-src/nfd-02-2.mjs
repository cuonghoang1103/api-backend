/**
 * nfd-02-2 — Networking for Developers, bài 2.2 "Bảng định tuyến, gateway và traceroute" (slug netdev-2-2-dinh-tuyen).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c22-*.out.txt). Khuôn _nfd-chung.mjs + sơ đồ _nfd-inet.mjs.
 */
import { lamDeck, sh, two, box, kw, bang, steps, seq, C, ra } from './_nfd-chung.mjs';
import { inetTopo } from './_nfd-inet.mjs';

export const deck = { key: 'nfd-02-2', code: 'NFD 2.2', title: 'Routing tables, gateways and traceroute', sub: 'Networking for Developers · Chapter 2' };
const term = (t, o = {}) => sh(t, o);
const noC = { drop: /^# |^Running as user/ };

export const slides = lamDeck({ chuong: 'Chapter 2 — IP, routing and NAT', bai: '2.2' }, [
  { cover: true, t: 'Routing tables, gateways<br>and traceroute', sub: 'Follow one packet across four routers —<br>and read the stars in traceroute correctly', nhan: 'Chapter 2 · Lesson 2.2' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A new lab: an <b>Internet in a box</b> — home router, ISP, exchange point, datacenter</li>
<li>Read a <b>routing table</b> column by column, on four different routers</li>
<li>Why each machine only picks the <b>next hop</b> — and why core routers have no default route</li>
<li><b>Longest prefix match</b>: the rule that decides between matching routes</li>
<li><b>TTL</b> and <b>traceroute</b>, captured packet by packet</li>
<li>When <code class="i">* * *</code> means nothing — and when alternating hops mean a <b>routing loop</b></li>
</ul>` },

  { t: 'The lab: an Internet in a box', giua: true, body: `
${inetTopo({ hl: ['laptop', 'homegw', 'isp', 'dc', 'server'], path: true })}
${term(`docker build -t net-lab-inet -f moi-truong/Dockerfile.inet moi-truong
docker compose -f moi-truong/internet.yml -p nfi up -d     # wait ~15 s for BGP
docker exec -it nfi-laptop bash`, { sm: true, title: 'from the lab/ folder' })}
${box('', 'All “public” addresses are <b>documentation ranges</b> (RFC 5737) — nobody’s real network. Routers run <b>FRR</b> and exchange routes with real <b>BGP</b> (lesson 2.5).', 'lam')}` },

  { t: 'Reading the laptop’s routing table', body: `
${term(ra('c22-laptop', 'ip -br -4 addr show eth0', 2, noC), { title: 'nfi-laptop (at home)' })}
${bang(['Part', 'Meaning'], [
    ['<code class="i">default</code>', '= 0.0.0.0/0, matches <b>everything</b> no other line matches'],
    ['<code class="i">via 192.168.50.1</code>', 'the <b>next hop</b>: hand the packet to this router (the home Wi-Fi router)'],
    ['<code class="i">dev eth0</code>', 'which network card to send it out of'],
    ['<code class="i">proto kernel scope link</code>', 'made by the kernel from the mask — <b>directly connected</b>, no via'],
    ['<code class="i">src 192.168.50.10</code>', 'the source address used for packets on this route'],
  ], { fs: 19 })}` },

  { t: 'Each machine only chooses the next hop', giua: true, body: `
${term(ra('c22-laptop', 'ip route get 192.168.50.11', 3, noC), { sm: true })}
${steps([
    'laptop: <b>default</b> → homegw 192.168.50.1',
    'homegw: <b>default</b> → isp 198.51.100.1',
    'isp: <b>203.0.113.0/24 via 192.0.2.3</b> (learned by BGP) → dc',
    'dc: <b>connected</b> 203.0.113.0/24 → deliver to the server',
  ])}
${box('', 'Four local decisions. Nobody plans the whole path — that is how IP routing scales.', 'lam')}` },

  { t: 'Core routers have no default route', body: `
${two(term(ra('c22-routers', 'ip -br -4 addr show up', 2, noC), { sm: true, title: 'homegw — two connected networks + default' }), term(ra('c22-isp', 'ip -br -4 addr show up', 2, noC), { sm: true, title: 'isp — no default, routes learned by BGP' }))}
${term(ra('c22-isp', 'ip route get 203.0.113.200', 2, noC), { sm: true, title: 'isp: an address in a known network vs. one nobody announced' })}
${box('No default route', 'Big routers must <b>know</b> every network. Unknown destination ⇒ <code class="i">Network is unreachable</code> — the router tells the sender (ICMP) instead of guessing. <code class="i">proto bgp</code> lines were learned from neighbours (lesson 2.5).', 'lam')}` },

  { t: 'Longest prefix match: the most specific line wins', giua: true, body: `
${bang(['Line in the table', 'Matches 203.0.113.10?', 'Prefix'], [
    ['<code class="i">default</code> (0.0.0.0/0)', 'yes — always', '0'],
    ['<code class="i">203.0.113.0/24</code>', 'yes', '24'],
    ['<code class="i">203.0.113.10/32</code>', 'yes', '<b>32 ⇒ wins</b>'],
    ['<code class="i">203.0.113.128/25</code>', 'no — .10 is not in .128–.255', '—'],
  ], { fs: 21 })}
${box('The rule every router uses', 'Among all lines that match the destination, take the one with the <b>longest prefix</b>. A forgotten <code class="i">/32</code> therefore beats everything — whatever it says.', 'do2')}` },

  { t: 'TTL: a packet cannot live forever', giua: true, body: `
${seq('laptop (TTL 64)', 'next router', [
    { d: 'r', t: 'packet with TTL 1 → router: 1 − 1 = 0 ⇒ dropped', c: C.ip },
    { d: 'l', t: 'ICMP Time exceeded (from the router’s address)', c: C.red },
    { d: 'r', t: 'packet with TTL 64 → 63 ⇒ forwarded', c: C.ip },
  ])}
${steps([
    'Every router subtracts <b>1</b> from the TTL before forwarding',
    'At <b>0</b> the router drops the packet and sends <b>ICMP Time exceeded</b> to the sender',
    'Purpose: a packet caught in a loop dies instead of circling forever',
  ])}` },

  { t: 'traceroute: TTL 1, 2, 3… until the destination answers', giua: true, body: `
${term(ra('c22-trace', 'traceroute -n 203.0.113.10', 1, noC), { title: 'nfi-laptop' })}
${bang(['Hop', 'Address', 'Who'], [
    ['1', '192.168.50.1', 'home router'],
    ['2', '198.51.100.1', 'ISP'],
    ['3', '192.0.2.3', 'DC router (at the exchange point)'],
    ['4', '203.0.113.10', 'LabFlow’s server — the destination'],
  ], { fs: 20 })}` },

  { t: 'The trick, captured packet by packet', body: `
${term(ra('c22-trace', 'tshark', 1, { ...noC, gay: 92 }), { sm: true, title: 'tshark: source · destination · TTL · info (one probe at a time: -q 1 -N 1)' })}
${steps([
    'TTL 1 → <b>192.168.50.1</b> drops it: “Time-to-live exceeded” · TTL 2 → <b>198.51.100.1</b> · TTL 3 → <b>192.0.2.3</b>',
    'TTL 4 reaches the server: “<b>Port unreachable</b>” — Linux traceroute sends UDP to ports 33434+ on purpose, so arrival is obvious',
    'Reply TTLs 64, 63, 62, 61: each reply crossed one more router on its way back · Windows <code class="i">tracert</code> = ICMP echo',
  ])}` },

  { t: '“Hop 3 shows * * * — the problem is at hop 3!”', body: `
${term(ra('c22-dc-chan', 'iptables -A OUTPUT', 1, noC), { sm: true, title: 'nfi-dc: do not send Time exceeded (like many real routers)' })}
${term(ra('c22-sao', 'traceroute -n -w 1', 3, noC), { sm: true, title: 'nfi-laptop' })}` },

  { t: 'When does loss at a hop matter?', to: true, giua: true, body: `
${box('Read it', 'Hop 3: stars, <b>100 % “loss”</b>. Hop 4: <b>0 % loss</b>, and the site answers. Packets go <b>through</b> hop 3 fine — it just does not talk about itself.', 'xanh')}
${steps([
    'Routers make ICMP errors on a small CPU (control plane) and often <b>rate-limit or block</b> them',
    'Loss only matters if it <b>continues to every later hop</b>, up to the destination',
    'An occasional <code class="i">*</code> on the last line: Linux sends about <b>one ICMP error per second</b> per destination by default',
  ])}` },

  { t: 'Bug: a forgotten route makes a loop', body: `
${two(term(ra('c22-dc-vong', 'ip route add', 3, noC), { sm: true, title: 'nfi-dc: a “temporary” /32, forgotten' }), term(ra('c22-vong', 'ping -c 2', 1, { drop: /^$|^# / }), { sm: true, title: 'nfi-laptop' }))}
${term(ra('c22-vong', 'traceroute', 1, noC), { sm: true, title: 'alternating hops = a routing loop' })}
${box('Fix', 'Find the router whose choice is wrong (<code class="i">ip route get 203.0.113.10</code> on each) ⇒ <code class="i">ip route del 203.0.113.10/32 via 192.0.2.1</code> on dc.', 'xanh')}` },

  { t: 'traceroute inside Docker Desktop: one hop, then stars', giua: true, body: `
${term(ra('c22-docker-desktop', 'ip route', 2, noC), { title: 'a container going out to the real Internet (Docker Desktop on a Mac)' })}
${box('Not Internet packet loss', 'Docker Desktop sends container traffic out through its own user-space network proxy, which does not pass the TTL trick through. Run traceroute on <b>your own computer</b>: <code class="i">traceroute -n cuongthai.com</code> · Windows <code class="i">tracert -d cuongthai.com</code>.', 'do2')}` },

  { t: 'Where this lives in the computer', to: true, giua: true, body: `
<ul>
<li>Linux: the routing table is a <b>kernel structure in RAM</b>; longest-prefix lookup runs on a CPU core for every packet</li>
<li>FRR adds the <code class="i">proto bgp</code> lines through the kernel’s <b>netlink</b> interface</li>
<li>Hardware routers copy the table into fast memory on the forwarding chips: the <b>data plane</b></li>
<li>Building tables, running BGP, generating ICMP: a small CPU — the <b>control plane</b> ⇒ ICMP is rate-limited ⇒ <code class="i">* * *</code></li>
</ul>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Routing table = network → next hop; the <b>default route</b> catches the rest</li>
<li>Each router decides only the next hop; core routers have <b>no default</b> (BGP)</li>
<li><b>Longest prefix match</b>: the most specific line wins — a forgotten /32 beats all</li>
<li>traceroute = TTL 1, 2, 3… + Time exceeded; stars with no loss after them are not a fault</li>
<li>Alternating hops + “Time to live exceeded” = <b>routing loop</b> → <code class="i">ip route get</code> on each router</li>
</ul>
<p style="margin:0">${kw('next hop', 'chặng kế')} ${kw('default route', 'tuyến mặc định')} ${kw('longest prefix match', 'khớp dài nhất')} ${kw('TTL', 'thời gian sống')} ${kw('routing loop', 'vòng lặp')}</p>` },
]);
