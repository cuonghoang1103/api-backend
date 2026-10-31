/**
 * nfd-02-1 — Networking for Developers, bài 2.1 "IPv4, CIDR và chia subnet bằng tay" (slug netdev-2-1-ipv4-cidr). Mở Chương 2.
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c21-*.out.txt). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, sh, two, box, cards, kw, bang, steps, svg, T, R, C, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-02-1', code: 'NFD 2.1', title: 'IPv4, CIDR and subnetting by hand', sub: 'Networking for Developers · Chapter 2' };
const term = (t, o = {}) => sh(t, o);
const noC = { drop: /^# / };

/* 32 bit của 10.10.1.10/24: 4 byte, phần mạng (lam) | phần host (cam) */
const bitsPic = (p = 24, dec = [10, 10, 1, 10]) => {
  const w = 1110, h = 196, bw = 262, gap = 14;
  let s = '';
  dec.forEach((d, i) => {
    const x = 6 + i * (bw + gap);
    const b = d.toString(2).padStart(8, '0');
    s += T(x + bw / 2, 34, String(d), 30, { a: 'middle', w: 800 });
    for (let k = 0; k < 8; k++) {
      const bit = i * 8 + k, net = bit < p, c = net ? C.ip : C.app;
      s += R(x + k * 32.5, 52, 30, 46, c + (net ? '22' : '1c'), c, { rx: 5, sw: 1.8 });
      s += T(x + k * 32.5 + 15, 84, b[k], 22, { a: 'middle', w: 700, m: 1, f: c });
    }
  });
  const xs = 6 + (p / 8) * (bw + gap) - gap / 2 - (p % 8 ? (8 - (p % 8)) * 32.5 + gap / 2 : 0);
  s += `<line x1="${xs}" y1="44" x2="${xs}" y2="108" stroke="${C.red}" stroke-width="4" stroke-dasharray="6 4"/>`;
  s += T(xs / 2, 136, `network part: first ${p} bits`, 21, { a: 'middle', w: 800, f: C.ip });
  s += T(xs + (w - xs) / 2, 136, `host part: ${32 - p} bits`, 21, { a: 'middle', w: 800, f: C.app });
  s += T(w / 2, 178, `mask /${p} = ${p} ones then ${32 - p} zeros`, 20, { a: 'middle', f: '#555', m: 1 });
  return svg(w, h, s);
};

/* trục số byte thứ tư với cỡ khối 64: 0 · 64 · 128 · 192 · 256, đánh dấu 77 */
const blockPic = () => {
  const w = 1110, h = 150, x0 = 40, sc = (w - 80) / 256;
  let s = '';
  [0, 64, 128, 192].forEach((a, i) => {
    const on = a === 64;
    s += R(x0 + a * sc, 30, 64 * sc - 4, 50, on ? '#fff3c4' : C.ip + '12', on ? C.or : C.ip, { rx: 7, sw: on ? 3.5 : 2 });
    s += T(x0 + a * sc + 32 * sc, 62, on ? '64 – 127' : `${a} – ${a + 63}`, 22, { a: 'middle', w: 800, f: on ? C.br : C.ip, m: 1 });
    void i;
  });
  s += `<line x1="${x0 + 77 * sc}" y1="20" x2="${x0 + 77 * sc}" y2="92" stroke="${C.red}" stroke-width="4"/>`;
  s += T(x0 + 77 * sc, 116, '77 is here ⇒ network .64, broadcast .127', 21, { a: 'middle', w: 800, f: C.red });
  s += T(w / 2, 144, 'block size = 256 − 192 = 64 ⇒ networks start at 0, 64, 128, 192', 19, { a: 'middle', f: '#555', m: 1 });
  return svg(w, h, s);
};

export const slides = lamDeck({ chuong: 'Chapter 2 — IP, routing and NAT', bai: '2.1' }, [
  { cover: true, t: 'IPv4, CIDR and<br>subnetting by hand', sub: 'What the /24 means, how a machine decides “next to me or behind a router”,<br>and how to cut an address block without holes', nhan: 'Chapter 2 · Lesson 2.1' },

  { t: 'Chapter 2: what you will be able to do', giua: true, body: `
${cards([
    ['Plan addresses', 'Read <code class="i">10.30.0.200/26</code> at a glance; split a block for an office or Docker without overlaps.'],
    ['Follow a packet', 'Read routing tables and <code class="i">traceroute</code> — including the <code class="i">* * *</code> that scares people.'],
    ['Know what the server sees', 'Why a whole house — or all of 4G — arrives from one IP; what <code class="i">docker run -p</code> does.'],
    ['Fix IPv6 bugs', '“localhost refused”, a slow first request, logs full of <code class="i">::ffff:</code>.'],
    ['Read Internet outages', 'Facebook 2021, YouTube 2008: BGP routes withdrawn or stolen; what RPKI protects.'],
    ['Measured, not memorised', 'Two labs on your machine: LabFlow (Ch1) + an “Internet in a box” with real BGP.'],
  ])}
${box('Why a developer needs it', 'Cloud firewalls, nginx <code class="i">allow</code>, rate limits and Docker networks are written in CIDR. “No route to host” and “works on Wi-Fi, not on 4G” are addressing and routing problems — not code problems.', 'lam')}` },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What is inside an <b>IPv4 address</b>: 32 bits, a network part and a host part</li>
<li>The <b>mask</b> and the <b>/24</b> notation (CIDR) — and the AND you can do in your head</li>
<li>How many machines fit in a /24, /26, /31, /32 — and why two addresses are lost</li>
<li>The first decision of every packet: <b>on my network</b> or <b>via the gateway</b></li>
<li>A one-character bug (<b>/16 instead of /24</b>) captured live</li>
<li>Planning the LabFlow office with <b>VLSM</b>, and Docker’s own subnets</li>
</ul>` },

  { t: 'An IPv4 address is one 32-bit number', giua: true, body: `
${bitsPic()}
${box('', '<b>4 bytes</b>, each written in decimal (0–255), dots between: <b>dotted decimal</b>. Bit weights per byte: 128 64 32 16 8 4 2 1 (lesson 1.1). 2<sup>32</sup> ≈ <b>4.29 billion</b> addresses in total.', 'lam')}` },

  { t: 'Network part + host part', body: `
${two(box('Like a street address', '<b>Street</b> = network: tells the postman which area.<br><b>House number</b> = host: only matters once you are on that street.<br><br>Routers keep <b>one line per network</b>, not one per machine — that is how the Internet scales.', 'lam'), term(ra('c21-dia-chi', 'ip -br -4 addr show eth0', 2, noC), { title: 'nfd-client (lab of Chapter 1)' }))}
${steps([
    '<b>Mask</b>: 32 bits — ones for the network part, zeros for the host part: <code class="i">255.255.255.0</code>',
    '<b>/24</b> = “the first 24 bits are the network” — address/prefix is <b>CIDR notation</b>',
    'The kernel <b>made the route</b> <code class="i">10.10.1.0/24 dev eth0 … scope link</code> from the mask — nobody typed it',
  ])}
${bang(['/8', '/16', '/24', '/26', '/30'], [['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.192', '255.255.255.252']], { fs: 20 })}` },

  { t: 'By hand: AND with the mask (192.168.50.77/26)', body: `
${two(term(`77    = 0100 1101
mask  = 1100 0000   (/26: 128 + 64 = 192)
AND   = 0100 0000 = 64   → network   .64
hosts → 0111 1111 = 127  → broadcast .127`, { title: 'only the 4th byte needs work' }), box('The rule', 'Keep the bits where the mask is <b>1</b>, turn the rest to <b>0</b> (AND) ⇒ <b>network</b>.<br>Set every host bit to <b>1</b> ⇒ <b>broadcast</b>.<br>Hosts = everything in between.', 'lam'))}
${blockPic()}
${term(ra('c21-dia-chi', 'python3 cidr.py 192.168.50.77/26', 1), { sm: true, title: 'checked by lab/code/ch02/cidr.py (it also asks Python’s ipaddress)' })}` },

  { t: 'How many machines fit: 2^(32−p) − 2', body: `
${bang(['Prefix', 'Mask', 'Addresses', 'Usable', 'Where you meet it'], [
    ['/16', '255.255.0.0', '65 536', '65 534', 'Docker’s default bridge 172.17.0.0/16; a cloud VPC'],
    ['/24', '255.255.255.0', '256', '254', 'a home or office LAN; most lab networks'],
    ['/26', '255.255.255.192', '64', '62', 'a small server segment'],
    ['/30', '255.255.255.252', '4', '2', 'an old-style link between two routers'],
    ['/31', '255.255.255.254', '2', '2', 'point-to-point link (RFC 3021) — no broadcast'],
    ['/32', '255.255.255.255', '1', '1', 'exactly one machine: “my IP/32” in a firewall'],
  ], { fs: 19 })}
${box('', 'The two lost addresses: the <b>network</b> itself (all host bits 0) and the <b>broadcast</b> (all host bits 1). <code class="i">0.0.0.0/0</code> = every address — the “source” of many too-open cloud rules.', 'lam')}` },

  { t: 'The first decision: on my network, or via the gateway?', giua: true, body: `
${term(ra('c21-dia-chi', 'ip route get 10.10.1.11', 3), { title: 'nfd-client 10.10.1.10/24' })}
${bang(['Destination', 'Inside 10.10.1.0/24?', 'So the kernel…'], [
    ['10.10.1.11', 'yes', 'delivers directly — ARP for <b>its</b> MAC (lesson 1.4)'],
    ['10.10.1.200', 'yes (no machine there!)', 'would ARP for it directly — and get no answer'],
    ['10.10.2.10', 'no', 'sends <b>via 10.10.1.254</b>, the default gateway'],
  ], { fs: 20 })}
${box('Where the 4 settings come from', 'Address, mask, gateway, DNS server: handed out by <b>DHCP</b> when a device joins a home/office network, by Docker’s <b>IPAM</b> in a container, or typed in a config file on a server.', 'lam')}` },

  { t: 'Bug: one character wrong — /16 instead of /24', body: `
${two(term(ra('c21-sai-mask', 'ip -br -4 addr show eth0', 2, noC), { title: 'client2 configured correctly' }), term(ra('c21-sai-mask', 'ip -br -4 addr show eth0', 3, { ...noC, lan: 2 }), { title: 'the same machine with 255.255.0.0' }))}
${box('Why it is nasty', 'The LAN still works and the Internet still works (default route). Only networks that are “near” in numbers — here all of <b>10.10.x.x</b> — are now believed to be <b>on this cable</b>: no <code class="i">via</code> for 10.10.2.10.', 'do2')}
${term(ra('c21-sai-mask', 'ip route get 10.10.2.10', 1, noC), { title: 'with /16: no “via” any more' })}` },

  { t: 'The capture proves it', giua: true, body: `
${two(term(ra('c21-sai-mask', 'ping -c 4', 1, { drop: /^$|^pipe|^# / }), { sm: true }), term(ra('c21-sai-mask', 'tcpdump -n -r', 2, { drop: /^reading|^# / }).replace(/^\d\d:\d\d:\d\d\.\d+ /gm, ''), { sm: true, title: 'tcpdump -Q out (timestamps removed · the one Reply = client2 answering another machine)' }))}
${steps([
    'The machine <b>asks ARP for the server itself</b>: <code class="i">who-has 10.10.2.10</code> — on a LAN where it is not',
    'Nobody answers ⇒ neighbour entry <b>FAILED</b> ⇒ “Destination Host Unreachable” from its <b>own</b> address',
    'Fix: mask /24 ⇒ <code class="i">10.10.2.10 via 10.10.1.254</code> again',
  ])}
${box('Recognise it in real life', 'One machine reaches the Internet but <b>not one internal network that looks “near” in numbers</b>. Check <code class="i">ip -br addr</code> and <code class="i">ip route get</code> <b>before</b> blaming the firewall or the cable.', 'lam')}` },

  { t: 'Special addresses you will meet', body: `
${bang(['Range', 'Meaning', 'What it tells you'], [
    ['<code class="i">127.0.0.0/8</code>', 'loopback', 'never leaves the machine (localhost)'],
    ['<code class="i">10/8 · 172.16/12 · 192.168/16</code>', 'private (RFC 1918)', 'homes, offices, Docker, clouds — not on the Internet (2.3)'],
    ['<code class="i">100.64.0.0/10</code>', 'shared (RFC 6598)', 'your ISP uses carrier-grade NAT (2.3)'],
    ['<code class="i">169.254.0.0/16</code>', 'link-local', 'DHCP failed · cloud metadata 169.254.169.254'],
    ['<code class="i">192.0.2/24 · 198.51.100/24 · 203.0.113/24</code>', 'documentation', 'examples — our “Internet in a box” uses them'],
    ['<code class="i">0.0.0.0</code> · <code class="i">255.255.255.255</code>', 'any · limited broadcast', 'listen on all · DHCP before you have an address'],
  ], { fs: 18 })}` },

  { t: 'From classes to CIDR to running out', giua: true, body: `
${steps([
    '<b>1981, RFC 791</b> — fixed classes: A = /8, B = /16, C = /24. A company with 300 machines had to take a whole class B (65 534)',
    '<b>1993, RFC 1519</b> (today RFC 4632) — <b>CIDR</b>: any prefix length; neighbouring networks <b>aggregated</b> into one route',
    '<b>3 Feb 2011</b> — IANA hands out its last /8 blocks to the five regional registries (APNIC got two more on 31 Jan)',
    'Since then: IPv4 is recycled, traded and <b>shared</b> ⇒ NAT (lesson 2.3) and IPv6 (lesson 2.4)',
  ])}
${box('', 'Source: NRO, “Free pool of IPv4 address space depleted”, 3 February 2011.', 'lam')}` },

  { t: 'VLSM: the LabFlow office in 10.20.0.0/22', body: `
${term(ra('c21-chia', 'python3 chia.py 10.20.0.0/22 iot', 1), { sm: true, title: 'checked by lab/code/ch02/chia.py' })}
${steps([
    '<b>Sort needs largest first</b> · for each, the smallest block that fits <b>hosts + 2</b> (300 + 2 → 512 = /23)',
    '<b>Place it at the next free multiple of its own size</b> (a /25 starts at .0 or .128) — alignment',
    'Write network, first/last host, broadcast · check: inside the block, no overlap',
  ])}` },

  { t: 'Why largest first — and when it does not fit', body: `
${term(ra('c21-chia', 'python3 chia.py --as-given', 1), { sm: true, title: 'the same needs in the order someone typed them' })}
${term(ra('c21-chia', 'python3 chia.py 10.20.0.0/24', 1), { sm: true })}
${box('Read it', 'The /23 had to jump to <code class="i">10.20.2.0</code> to be aligned: a <b>hole of 336 addresses</b> and a full block. Say “it does not fit” <b>before</b> anybody configures a router.', 'do2')}` },

  { t: 'Docker chooses subnets too — and they can collide', giua: true, body: `
${term(ra('c21-docker', 'docker network inspect bridge', 2), { title: 'on your machine' })}
${box('“Since I installed Docker I cannot reach the school / company network”', 'If the office or VPN also uses e.g. <code class="i">172.18.0.0/16</code> and Docker creates a network there, the <b>local bridge wins</b> and traffic to the real servers disappears into a container network.', 'do2')}
${box('Fix', '<code class="i">"default-address-pools": [{"base": "10.200.0.0/16", "size": 24}]</code> in <code class="i">/etc/docker/daemon.json</code>, or an explicit <code class="i">subnet</code> in compose — like our lab.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>IPv4 = <b>32 bits</b>; the mask (/prefix) splits network part | host part</li>
<li>Network = address <b>AND</b> mask · broadcast = host bits all 1</li>
<li>Usable hosts = 2<sup>32−p</sup> − 2 (but /31 = 2, /32 = 1)</li>
<li>Every packet: <b>same network ⇒ direct</b>, otherwise ⇒ <b>gateway</b>; a wrong mask breaks exactly this</li>
<li>Know 127/8, RFC 1918, 100.64/10, 169.254/16, 0.0.0.0/0</li>
<li>VLSM <b>largest first, aligned</b>; check with a tool; watch Docker’s pools</li>
</ul>
<p style="margin:0">${kw('subnet mask', 'mặt nạ mạng')} ${kw('prefix /24', 'độ dài tiền tố')} ${kw('broadcast', 'cả mạng')} ${kw('default gateway', 'cổng mặc định')} ${kw('VLSM', 'chia khác cỡ')}</p>` },
]);
