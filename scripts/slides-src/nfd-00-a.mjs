/**
 * nfd-00-a — Networking for Developers, Mục 0 "Bắt đầu tại đây (1/2)": mạng là gì, so sánh dễ nhầm, lịch sử có nguồn,
 * vì sao ra đời, dùng làm gì, giúp gì cho bạn. Khuôn _nfd-chung.mjs (= khuôn PostgreSQL). Output = CHẠY THẬT
 * (content/courses/networking-for-developers/lab/out/c00-internet.out.txt).
 */
import { lamDeck, sh, two, box, cards, steps, kw, tbl, bang, svg, T, R, C, topo } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-00-a', code: 'NFD 0.A', title: 'What a network is, and why it matters to you', sub: 'Networking for Developers · Section 0' };

/* Dòng thời gian — mỗi mốc đã kiểm nguồn (ISOC, Computer History Museum, CERN, rfc-editor.org) */
const timeline = () => {
  const ev = [
    ['1969', 'ARPANET: first host-to-host', 'link UCLA → SRI, 29 Oct'],
    ['1974', 'Cerf & Kahn publish TCP', 'one protocol for many networks'],
    ['1983', 'Flag day: ARPANET → TCP/IP', '1 Jan · DNS invented the same year'],
    ['1989', 'Berners-Lee proposes the Web', 'CERN, March · public site Aug 1991'],
    ['2015', 'HTTP/2 (RFC 7540)', 'many requests on one connection'],
    ['2018', 'TLS 1.3 (RFC 8446)', 'faster, safer encryption'],
    ['2021–22', 'QUIC + HTTP/3', 'RFC 9000 · RFC 9114 — over UDP'],
  ];
  const w = 1110, h = 330, x0 = 92, step = (w - 2 * x0) / (ev.length - 1);
  let s = `<line x1="${x0 - 40}" y1="165" x2="${w - x0 + 40}" y2="165" stroke="${C.br}" stroke-width="5"/>`;
  ev.forEach(([y, t, d], i) => {
    const x = x0 + i * step, up = i % 2 === 0;
    s += `<circle cx="${x}" cy="165" r="11" fill="${C.or}" stroke="#fff" stroke-width="3"/>`;
    s += T(x, up ? 140 : 206, y, 24, { a: 'middle', w: 800, f: C.br });
    const ty = up ? 30 : 246;
    s += R(x - 84, ty - 26, 168, 86, '#fffaf5', '#e3c9ae', { rx: 8, sw: 1.5 });
    const words = t.split(' '); const l1 = [], l2 = [];
    for (const wd of words) ((l1.join(' ') + ' ' + wd).length <= 18 && !l2.length ? l1 : l2).push(wd);
    s += T(x, ty - 4, l1.join(' '), 15, { a: 'middle', w: 800 }) + T(x, ty + 15, l2.join(' '), 15, { a: 'middle', w: 800 });
    const dw = d.split(' '); const d1 = [], d2 = [];
    for (const wd of dw) ((d1.join(' ') + ' ' + wd).length <= 22 && !d2.length ? d1 : d2).push(wd);
    s += T(x, ty + 36, d1.join(' '), 12.5, { a: 'middle', f: '#666' }) + T(x, ty + 52, d2.join(' '), 12.5, { a: 'middle', f: '#666' });
  });
  return svg(w, h, s);
};

/* Các chặng của một request thật (số đo ở slide 9, cộng dồn ⇒ độ dài từng chặng) */
const phases = () => {
  const P = [['DNS', 0, 3.26, C.link], ['TCP', 3.26, 11.94, C.ip], ['TLS', 11.94, 26.04, C.tcp], ['server', 26.04, 69.55, C.app], ['download', 69.55, 102.74, C.br]];
  const w = 1110, h = 96, k = (w - 20) / 102.74;
  let s = '';
  for (const [n, a, b, c] of P) {
    const x = 10 + a * k, ww = (b - a) * k;
    s += R(x, 8, Math.max(ww, 4), 40, c + '33', c, { rx: 4, sw: 2 });
    const lab = `${n} ${(b - a).toFixed(1)} ms`;
    s += ww > lab.length * 9 ? T(x + ww / 2, 34, lab, 16, { a: 'middle', w: 700, f: c }) : T(x, 70, lab, 14, { w: 700, f: c });
  }
  s += T(w / 2, 92, 'the same request, drawn to scale: 102.7 ms in total', 15, { a: 'middle', f: '#666', i: 1 });
  return svg(w, h, s);
};

/* Bưu kiện ↔ gói tin */
const parcel = () => {
  const w = 1110, h = 200;
  let s = '';
  const box1 = (x, t, sub, c) => R(x, 30, 236, 130, c + '14', c, { rx: 12 }) + T(x + 118, 80, t, 22, { a: 'middle', w: 800, f: c }) + T(x + 118, 112, sub, 16, { a: 'middle', f: '#555' });
  s += box1(4, '📦 You pack it', 'contents + address', C.app);
  s += box1(294, '🏤 Post offices', 'each one: next hop only', C.ip);
  s += box1(584, '🚚 Roads, trucks', 'cables, Wi-Fi, fibre', C.link);
  s += box1(870, '🏠 Recipient', 'opens it, reads it', C.tcp);
  for (const x of [240, 530, 820]) s += `<text x="${x + 27}" y="104" font-size="34" text-anchor="middle" fill="${C.br}">→</text>`;
  s += T(555, 192, 'Nobody along the way reads your letter — they only read the address on the box.', 18, { a: 'middle', f: '#333', i: 1 });
  return svg(w, h, s);
};

export const slides = lamDeck({ chuong: 'Section 0 — Start here', bai: '0.A' }, [
  { cover: true, t: 'What a network is,<br>and why it matters to you', sub: 'Everyday words first · the history in seven dates<br>· what developers really use it for', nhan: 'Section 0 · Start here (1/2)' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A picture of a network you can explain to a friend: <b>parcels, addresses, post offices</b></li>
<li>The pairs everybody confuses: Internet vs Web, IP vs MAC, TCP vs HTTP, bandwidth vs latency</li>
<li>Where the Internet came from — seven dates, every one checked against its source</li>
<li>What a <b>developer</b> (not a network engineer) does with networking every week</li>
<li>Where this course takes you, and the lab you will build on your own laptop</li>
</ul>` },

  { t: 'A network is parcels, addresses and post offices', giua: true, body: `
${parcel()}
${bang(['Post', 'Network', 'You will meet it in'], [
    ['the parcel', '<b>packet</b> — a small chunk of your data with a header on it', 'Chapter 1'],
    ['street address', '<b>IP address</b> — which machine, anywhere on Earth', 'Chapter 2'],
    ['flat / room number', '<b>port</b> — which program on that machine', 'Lesson 1.5'],
    ['phone contacts', '<b>DNS</b> — the name cuongthai.com → an address', 'Chapter 3'],
  ])}` },

  { t: 'Network, Internet: devices + links + agreed rules', to: true, body: `
${cards([
    ['Devices', 'Laptops, phones, servers — and the boxes in between: <b>switches</b> and <b>routers</b>.'],
    ['Links', 'Copper cable, Wi-Fi radio, fibre light, 4G/5G. They only carry bits.'],
    ['Protocols', 'The rules both sides agree on: how to say hello, how big a packet is, what an address looks like.'],
  ])}
${box('The Internet = a network of networks', 'Your home Wi-Fi, the school network, Viettel, a data centre in Singapore — tens of thousands of separately owned networks that agree to carry each other’s packets using the <b>same protocols</b> (TCP/IP). Nobody owns all of it.', 'lam')}` },

  { t: 'The pairs everybody confuses', giua: true, body: `
${bang(['People say…', 'but these are different', 'In one sentence'], [
    ['the Internet / the Web', 'network of networks <b>vs</b> one service on it', 'Email, games and SSH use the Internet without the Web.'],
    ['IP / MAC address', 'whole-journey address <b>vs</b> one-hop address', 'IP stays the same end to end; the MAC changes at every router.'],
    ['TCP / HTTP', 'delivery service <b>vs</b> the language in the parcel', 'HTTP text travels inside TCP; TCP does not know what HTTP is.'],
    ['domain / IP', 'a name <b>vs</b> a number', 'cuongthai.com is looked up (DNS) to 160.187.1.208.'],
    ['bandwidth / latency', 'how much per second <b>vs</b> how long one trip takes', 'A fat pipe can still be slow if it is long.'],
    ['switch / router', 'inside one network <b>vs</b> between networks', 'Switch reads MACs; router reads IPs.'],
  ])}` },

  { t: 'Seven dates that built the Internet', giua: true, body: `
${timeline()}
<p class="nho" style="margin:0">Sources: Internet Society “Brief History of the Internet” · Computer History Museum · CERN “A short history of the Web” · rfc-editor.org.</p>` },

  { t: 'Why it was born: share machines, survive broken links', to: true, giua: true, body: `
${two(`<ul>
<li>1960s computers were rare and expensive — researchers wanted to <b>use a far-away computer</b> from their own lab</li>
<li>A phone call holds one wire for the whole call. <b>Packet switching</b> cuts data into packets that share links and can take any path</li>
<li>Different networks (radio, satellite, cable) had to talk ⇒ <b>one common protocol</b>: TCP/IP</li>
</ul>`, box('The design decision that still shapes your code', 'The network in the middle is kept simple: it just forwards packets, best effort. <b>Reliability is the job of the two ends</b> — TCP in your kernel, retries and timeouts in your app. That is why your code must handle a connection that hangs or breaks.', 'xanh'))}` },

  { t: 'What a developer does with networking every week', giua: true, body: `
${bang(['Task at work', 'The networking behind it', 'Chapter'], [
    ['Your API is “up” but nobody can reach it', 'bound to 127.0.0.1 instead of 0.0.0.0 — ports & sockets', '1.5'],
    ['Users get 502 / 504 from nginx', 'which hop failed, and why — proxies, timeouts', '10'],
    ['You moved the server and half the users still hit the old one', 'DNS caching and TTL', '3'],
    ['“Your connection is not private”', 'TLS certificates and chains', '7'],
    ['The page is slow only for users abroad', 'latency, round trips, CDN', '5, 8'],
    ['Chat / live updates drop after 60 s', 'WebSocket idle timeouts at a proxy', '9'],
  ])}` },

  { t: 'Real numbers: who is online, and what one page costs', giua: true, body: `
${two(box('ITU Facts and Figures 2025', '<b>About 6 billion people</b> — 74% of the world — were online in 2025; about <b>2.2 billion</b> still were not. Every one of them reaches your site through the protocols in this course.', 'lam'),
    box('Measured from our lab, 31/10/2026', 'One HTTPS request to cuongthai.com: name lookup, TCP connect, TLS handshake, waiting for the first byte. Each stage has a name and a time — lesson 0.2 takes it apart.', ''))}
${sh(`$ curl -s -o /dev/null https://cuongthai.com/ -w \\
  'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n'
dns=0.003260 connect=0.011939 tls=0.026036 ttfb=0.069547 total=0.102738`, { sm: true })}
${phases()}` },

  { t: 'How this helps YOU', to: true, giua: true, body: `
${cards([
    ['Your team project', 'The demo works on your laptop and dies on the server: wrong port, wrong address, missing certificate. You will know where to look.'],
    ['Internships & interviews', '“What happens when you type a URL?”, “TCP vs UDP?”, “What is a 502?” — answered with measurements, not memorised definitions.'],
    ['Backend & DevOps jobs', 'Timeouts, connection pools, keep-alive, DNS, TLS, load balancers, CDN — daily vocabulary of the job.'],
  ])}
<p style="margin:0">${kw('packet', 'gói tin')} ${kw('protocol', 'giao thức')} ${kw('latency', 'độ trễ')} ${kw('bandwidth', 'băng thông')}</p>` },

  { t: 'The road through this course', to: true, giua: true, body: `
${steps([
    '<b>0–1</b> · Your lab, the URL journey, layers and packets: bits, frames, MAC, ARP, ports, sockets',
    '<b>2–3</b> · IP, subnets, routing, NAT, IPv6 · DNS all the way to the root servers',
    '<b>4–6</b> · TCP in depth, UDP, QUIC · <b>7</b> TLS 1.3 and certificates',
    '<b>8–10</b> · HTTP/1.1 → 2 → 3, caching and CDN · WebSocket/SSE · load balancers and proxies',
    '<b>11–13</b> · Tools and a method to diagnose · interview rounds · capstone: trace and tune a real request path',
  ])}` },

  { t: 'You will build this lab on your own laptop', giua: true, body: `
${topo()}
<p style="margin:0">Five small Linux containers on two virtual networks — a <b>mini LabFlow</b>: a client, a router, nginx in front of a Node API, like cuongthai.com. Every output in this course was produced here.</p>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A network moves <b>packets</b>; each carries addresses; routers pass it on one hop at a time</li>
<li>The Internet is a network of networks that all speak <b>TCP/IP</b> (flag day: 1 January 1983)</li>
<li>Most confusion disappears once you separate the pairs: Internet/Web, IP/MAC, TCP/HTTP</li>
<li>The ends do the hard work — so <b>your code</b> handles timeouts, retries and broken connections</li>
<li>Next: real outages, and how to learn this without giving up (Start here 2/2)</li>
</ul>` },
]);
