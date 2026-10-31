/**
 * nfd-00-1 — Networking for Developers, bài 0.1 "Phòng lab mạng: công cụ và một máy chủ thử". Khuôn _nfd-chung.mjs.
 * Output = CHẠY THẬT (lab/out/c00-lab.out.txt, c00-host.out.txt — 31/10/2026).
 */
import { lamDeck, sql, sh, psql, two, box, cards, steps, kw, bang, svg, T, R, C, topo, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-00-1', code: 'NFD 0.1', title: 'Your networking lab', sub: 'Networking for Developers · Section 0' };

const term = (t, o = {}) => sh(t, { sm: false, ...o });

/* Máy Mac → máy ảo Linux của Docker Desktop → hai switch ảo → năm container */
const vmPic = () => {
  const w = 1110, h = 250;
  let s = R(4, 6, 1100, 238, '#f6f6f6', '#999', { rx: 14 }) + T(20, 34, '💻 Your Mac / Windows laptop — Terminal, browser, Wireshark app', 18, { w: 800, f: '#444' });
  s += R(40, 50, 1040, 180, '#eef4fa', C.ip, { rx: 12, dash: 1 }) + T(58, 78, '🐧 Linux virtual machine run by Docker Desktop (on Linux: your own kernel)', 17, { w: 800, f: C.ip });
  s += R(80, 96, 300, 52, '#f3eefe', C.link, { rx: 8 }) + T(230, 128, 'bridge nfd-lan (a switch)', 17, { a: 'middle', w: 700, f: C.link });
  s += R(700, 96, 300, 52, '#f3eefe', C.link, { rx: 8 }) + T(850, 128, 'bridge nfd-dmz (a switch)', 17, { a: 'middle', w: 700, f: C.link });
  [['client', 80], ['client2', 230], ['router', 455], ['web', 700], ['api', 850]].forEach(([n, x]) => {
    s += R(x, 168, 140, 44, '#fff', C.br, { rx: 8 }) + T(x + 70, 196, n, 17, { a: 'middle', w: 700, f: C.br });
  });
  s += T(560, 128, '⇄ router joins both', 15, { a: 'middle', f: '#666' });
  return svg(w, h, s);
};

export const slides = lamDeck({ chuong: 'Section 0 — Your lab', bai: '0.1' }, [
  { cover: true, t: 'Your networking lab:<br>tools and a test server', sub: 'Eight tools, one Docker Compose file,<br>your first captured packet', nhan: 'Section 0 · Lesson 0.1' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The eight tools of this course and the <b>one question</b> each answers</li>
<li>Installing them natively on macOS, Linux and Windows (WSL2)</li>
<li>A <b>Docker lab</b>: two virtual networks, a router, nginx and an API — one command to build</li>
<li>Your first request and your first captured packets</li>
<li>Where the lab really runs on a Mac, and the rules for capturing safely</li>
</ul>` },

  { t: 'Eight tools, eight questions', giua: true, body: `
${bang(['Tool', 'The question it answers', 'First used'], [
    ['<b>dig</b>', 'What address does this <b>name</b> point to?', '0.2, Ch.3'],
    ['<b>curl</b>', 'Talk HTTP to a server — and <b>time</b> each stage', '0.2, Ch.8'],
    ['<b>ping / mtr</b>', 'Is there a <b>path</b>? How long is one round trip?', '0.A, Ch.2'],
    ['<b>ip</b>', 'My addresses, routes and neighbours', '0.1, Ch.1–2'],
    ['<b>ss</b>', 'Which <b>sockets</b> are open on this machine?', '1.5'],
    ['<b>tcpdump / tshark</b>', 'What packets actually went over the wire?', '0.1, Ch.1'],
    ['<b>Wireshark</b>', 'The same packets, in a window you can click', '1.3'],
    ['<b>openssl · nc</b>', 'Speak TLS by hand · open a raw TCP connection', 'Ch.7 · 1.5'],
  ], { fs: 20 })}` },

  { t: 'Install them natively (optional, but useful)', body: `
${two(`<div><b>macOS</b> — curl, dig, ping, nc, tcpdump come with the system (tcpdump needs <code class="i">sudo</code>).
${term(`$ brew install mtr wireshark
$ dig -v ; curl --version | head -1`)}
<p style="margin:6px 0 0"><b>Windows</b> — use <b>WSL2</b> (Ubuntu) for the Linux commands, plus the Wireshark installer for Windows.</p></div>`,
    `<div><b>Linux (Ubuntu/Debian)</b>
${term(`$ sudo apt install -y bind9-dnsutils curl \\
    iproute2 iputils-ping mtr-tiny tcpdump \\
    tshark netcat-openbsd openssl`)}
${box('But for this course…', 'Every output you see was produced in the <b>Docker lab</b> on the next slides, so your screen matches the lesson exactly. Native tools are for using what you learn on real networks.', 'lam')}</div>`)}` },

  { t: 'Why a Docker lab', to: true, giua: true, body: `
${cards([
    ['Same output as the lesson', 'Fixed addresses (10.10.1.10…), fixed MAC addresses, the same tool versions on every laptop.'],
    ['Safe to break', 'Change routes, kill nginx, swap a MAC address — then <code class="i">down</code> and <code class="i">up</code> again in seconds.'],
    ['Only your own traffic', 'You capture packets on networks <b>you created</b>. No risk of reading anyone else’s data.'],
  ])}
${box('A mini LabFlow', 'The shape is the same as cuongthai.com and the LabFlow project: a proxy (nginx) in front of an API (Node), reached from a client through a router. Each chapter adds a piece — DNS, TLS, caching, a database.', 'xanh')}` },

  { t: 'The lab: five containers, two networks', giua: true, body: `
${topo()}
<p style="margin:0">Every MAC address is fixed: <code class="i">02:00:0a:0a:01:0a</code> = “locally administered” <b>02</b> + the IP 10.10.1.10 in hex. You will read these in lesson 1.4.</p>` },

  { t: 'One Compose file describes it all', giua: true, body: `
${two(sql(`services:
  router:
    image: net-lab
    cap_add: [NET_ADMIN, NET_RAW]
    sysctls: { net.ipv4.ip_forward: "1" }
    networks:
      lan: { ipv4_address: 10.10.1.254 }
      dmz: { ipv4_address: 10.10.2.254 }
  client:
    networks: { lan: { ipv4_address: 10.10.1.10 } }
    command: ["sh", "-c", "ip route add
      10.10.2.0/24 via 10.10.1.254 && …"]`, { lang: 'yaml', sm: true }),
    `<ul style="font-size:21px">
<li><b>image net-lab</b> — Ubuntu 26.04 + every tool of the course</li>
<li><b>ip_forward = 1</b> makes the router pass packets between its two networks</li>
<li>The client is told: “to reach 10.10.2.0/24, go <b>via 10.10.1.254</b>” — a route (Chapter 2)</li>
<li><b>NET_ADMIN</b> lets a container change routes; <b>NET_RAW</b> lets it capture</li>
</ul>`, 'r64')}` },

  { t: 'Build it and check it', giua: true, body: `
${term('$ cd lab && docker build -t net-lab moi-truong\n$ docker compose -f moi-truong/compose.yml -p nfd up -d\n' + ra('c00-host', 'docker compose', 1))}
${box('Then step inside the client', '<code class="i">docker exec -it nfd-client bash</code> — from now on you are “on” the machine 10.10.1.10.', 'lam')}` },

  { t: 'Inside the client: address and routes', to: true, giua: true, body: `
${term(ra('c00-lab', 'ip -br addr', 2))}
${steps([
    '<b>10.10.1.10/24</b> — my address; the /24 says which neighbours are “on my street” (Chapter 2)',
    '<b>10.10.1.0/24 dev eth0</b> — neighbours: talk to them directly',
    '<b>10.10.2.0/24 via 10.10.1.254</b> — the server network: hand packets to the router',
  ])}` },

  { t: 'First request, first captured packets', giua: true, body: `
${term(ra('c00-lab', 'curl -s http://10.10.2.10/api/hello', 1, { cut: 112 }) + '\n' + ra('c00-lab', 'tcpdump -n -r', 1, { drop: /^reading/, cut: 112, max: 7 }), { sm: true, title: 'terminal — client (long lines cut at the right edge)' })}
<p style="margin:0;font-size:21px">Ten packets for one tiny page: 3 to open the connection, 4 for the request and answer, 3 to close. You will name every one of them by Chapter 4.</p>` },

  { t: 'Where does this run? Not on your Mac directly', giua: true, body: `
${vmPic()}
${box('Why it matters', 'On macOS and Windows, containers live inside a hidden Linux VM. Their two networks are <b>bridges inside that VM</b>, so <code class="i">tcpdump</code> on your Mac does not see them — you capture <b>inside</b> a container. On a Linux laptop the bridges are on your own machine.', '')}` },

  { t: 'Capture is allowed, changing routes is not', to: true, giua: true, body: `
${term(ra('c00-host', 'docker run --rm net-lab tcpdump', 3, { drop: /^\d\d:|verbose|listening|received by|dropped by/ }))}
<p style="margin:0">${kw('NET_RAW', 'đọc/gửi gói thô — Docker cho sẵn')} ${kw('NET_ADMIN', 'sửa route, card mạng — phải xin')}</p>` },

  { t: 'Lab rules', to: true, giua: true, body: `
<ul>
<li>Capture and scan only <b>your own</b> machine, your own containers, or cuongthai.com — never a school or café network</li>
<li>Every lab container has the label <code class="i">netlab=1</code>; clean up with <code class="i">docker compose -p nfd down</code></li>
<li>Never give lab containers <code class="i">--privileged</code>; <b>NET_ADMIN</b> is enough</li>
<li>Something weird? <code class="i">down</code> then <code class="i">up</code> — a clean lab in five seconds</li>
</ul>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Eight tools, eight questions: name, HTTP timing, path, addresses, sockets, packets, TLS, raw TCP</li>
<li>One Compose file builds a mini LabFlow: client → router → nginx → API</li>
<li>Routes decide who you talk to directly and who goes through the router</li>
<li>On a Mac the lab lives in Docker’s Linux VM — capture inside containers</li>
<li>Next: follow one URL through the lab and the Internet, stage by stage (0.2)</li>
</ul>` },
]);
void psql; void C;
