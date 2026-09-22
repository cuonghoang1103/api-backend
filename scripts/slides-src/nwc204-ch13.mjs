/**
 * nwc204-ch13.mjs — NWC204 Chapter 13: The Transport Layer
 * (FLM buổi 41–42, Cisco Module 14).
 *
 * ⭐ Người học ĐẶT HÀNG ĐÍCH DANH chương này. Yêu cầu nguyên văn ở mục 0 của
 *    `_HOP-DONG-NWC204.md`: "để hiểu toàn bộ mạng để có thể ssh, deploy, cổng
 *    mạng trường học, và all liên quan đến cổng mạng". Đây là chương về SỐ HIỆU
 *    CỔNG, nên nó là chương thực dụng nhất của cả môn với người học.
 *
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 41, 42.
 *   buổi 41: 13. Transport Layer · 13.1 Transportation of Data · 13.2 TCP
 *            Overview · 13.3 UDP Overview          (CLO1, CLO4, CLO9 · T)
 *   buổi 42: 13.4 Port Numbers · 13.5 TCP Communication Process · 13.6
 *            Reliability and Flow Control · 13.7 UDP Communication · 13.8
 *            Integrate AI Tools (Self Learning)    (CLO1, CLO4, CLO9 · T)
 *
 * ★ = phần cuongthai.com bổ sung, ĐO THẬT trên VPS sản xuất:
 *   - `ss -tlnp` đọc ra ba kiểu bind KHÁC NHAU trên cùng một máy: 0.0.0.0:3001
 *     (mọi nơi), 127.0.0.1:3300 (chỉ trong máy), 172.18.0.1:8888 (chỉ mạng
 *     Docker) — ba mức phơi bày khác hẳn nhau, nhìn cột địa chỉ là biết
 *   - `docker ps` cho thấy `-p` khác `EXPOSE`: frontend ghi `3000/tcp` (KHÔNG
 *     publish) còn backend ghi `0.0.0.0:3001->3001/tcp` (publish thật)
 *   - đếm trạng thái kết nối: 104 LISTEN · 7 SYN-RECV · 3 ESTAB
 *   - luật `DOCKER-USER` chặn 5432/6379 — và thứ tự luật sai, xem slide ★
 *
 * ⚠️ SVG: viewBox="0 0 900 h" width="1150". Chữ đơn cách rộng 0,602 × font-size
 *    ⇒ font 15 tối đa ~99 ký tự/dòng từ x=4. Chữ trong <rect> phải NGẮN HƠN rect,
 *    và <rect> đánh dấu phải đặt bằng CÔNG THỨC chứ không bằng mắt.
 *
 * 22 slide (1 bìa + 21 nội dung); 19 trong số đó là sơ đồ, SVG, bảng hoặc terminal.
 */
import { CSS, topo, flow, pkt, term, kv, code, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch13',
  code: 'NWC204',
  title: 'Ch.13 — The Transport Layer',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: what the transport layer adds ────────────────────────────────── */
const ROLE = `<svg class="nw-svg" viewBox="0 0 900 240" width="1150" height="333"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">IP gets a packet to the right MACHINE. The transport layer gets it to the right PROGRAM.</text>
  <g stroke-width="2.5">
    <rect x="20" y="34" width="390" height="106" rx="8" fill="#eef5fc" stroke="#1b5fa8"/>
    <rect x="490" y="34" width="390" height="106" rx="8" fill="#eefaf4" stroke="#1f9d6b"/>
  </g>
  <text x="215" y="58" text-anchor="middle" font-size="15" font-weight="800" fill="#1b5fa8">Layer 3 — IP</text>
  <text x="215" y="82" text-anchor="middle" font-size="13" fill="#3c5570">"deliver to 203.0.113.9"</text>
  <text x="215" y="104" text-anchor="middle" font-size="13" fill="#3c5570">one address per machine</text>
  <text x="215" y="128" text-anchor="middle" font-size="13" fill="#8f2c2c" font-weight="700">but WHICH program?</text>
  <text x="685" y="58" text-anchor="middle" font-size="15" font-weight="800" fill="#14603f">Layer 4 — TCP / UDP</text>
  <text x="685" y="82" text-anchor="middle" font-size="13" fill="#3c5570">"...and hand it to port 443"</text>
  <text x="685" y="104" text-anchor="middle" font-size="13" fill="#3c5570">65,535 ports per address</text>
  <text x="685" y="128" text-anchor="middle" font-size="13" fill="#14603f" font-weight="700">now it reaches nginx</text>
  <text x="4" y="176" fill="#1b5fa8" font-size="15" font-weight="700">A port number is how one machine runs a hundred services on one IP address.</text>
  <text x="4" y="200" fill="#25405e" font-size="14">Without it, a server could offer exactly one thing, and the web would need one IP per site.</text>
  <text x="4" y="224" fill="#5d7288" font-size="14">Everything else in this chapter — reliability, flow control, handshakes — is layer 4 too.</text>
</svg>`;

/* ── SVG: the socket, four numbers ─────────────────────────────────────── */
const SOCKET = `<svg class="nw-svg" viewBox="0 0 900 250" width="1150" height="347"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">A connection is identified by FOUR numbers, not by one. That is why one port serves thousands.</text>
  <g stroke="#1b5fa8" stroke-width="2.5" fill="#fff">
    <rect x="40" y="34" width="180" height="46" rx="6"/>
    <rect x="240" y="34" width="130" height="46" rx="6"/>
    <rect x="450" y="34" width="180" height="46" rx="6"/>
    <rect x="650" y="34" width="130" height="46" rx="6"/>
  </g>
  <g text-anchor="middle" font-size="15" font-weight="800" fill="#0f2a4a">
    <text x="130" y="55">198.51.100.7</text><text x="305" y="55">51514</text>
    <text x="540" y="55">203.0.113.9</text><text x="715" y="55">443</text>
  </g>
  <g text-anchor="middle" font-size="11" fill="#6b8199">
    <text x="130" y="72">source IP</text><text x="305" y="72">source port</text>
    <text x="540" y="72">dest IP</text><text x="715" y="72">dest port</text>
  </g>
  <text x="4" y="112" fill="#1b5fa8" font-size="14" font-weight="700">Open a second tab to the same site and only ONE of the four numbers changes:</text>
  <g font-size="15">
    <text x="40" y="142" fill="#25405e">198.51.100.7 : <tspan fill="#d94b4b" font-weight="800">51514</tspan>  &#8594;  203.0.113.9 : 443</text>
    <text x="40" y="166" fill="#25405e">198.51.100.7 : <tspan fill="#d94b4b" font-weight="800">51515</tspan>  &#8594;  203.0.113.9 : 443</text>
  </g>
  <text x="4" y="200" fill="#14603f" font-size="14" font-weight="700">Different source port = a different connection. The server keeps them apart by the pair.</text>
  <text x="4" y="224" fill="#25405e" font-size="14">The client's port is EPHEMERAL — the kernel picks a free one, usually 32768-60999 on Linux.</text>
  <text x="4" y="246" fill="#5d7288" font-size="14">You never choose it, and it is why a client needs no configuration to make a connection.</text>
</svg>`;

/* ── SVG: three-way handshake and close ────────────────────────────────── */
const HAND = `<svg class="nw-svg" viewBox="0 0 900 256" width="1150" height="355"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Why the handshake needs THREE messages, not two</text>
  <g font-size="14">
    <text x="60" y="44" fill="#1b5fa8" font-weight="800">client</text>
    <text x="760" y="44" fill="#1b5fa8" font-weight="800">server</text>
  </g>
  <g stroke="#1b5fa8" stroke-width="2.5" fill="none">
    <line x1="120" y1="68" x2="740" y2="68"/><polygon points="740,62 754,68 740,74" fill="#1b5fa8" stroke="none"/>
    <line x1="740" y1="106" x2="120" y2="106"/><polygon points="120,100 106,106 120,112" fill="#1b5fa8" stroke="none"/>
    <line x1="120" y1="144" x2="740" y2="144"/><polygon points="740,138 754,144 740,150" fill="#1b5fa8" stroke="none"/>
  </g>
  <g font-size="14" text-anchor="middle" fill="#0f2a4a" font-weight="700">
    <text x="430" y="62">SYN  seq=x</text>
    <text x="430" y="100">SYN-ACK  seq=y  ack=x+1</text>
    <text x="430" y="138">ACK  ack=y+1</text>
  </g>
  <g font-size="12" text-anchor="middle" fill="#5d7288">
    <text x="430" y="84">"here is MY starting number"</text>
    <text x="430" y="122">"got yours; here is MINE"</text>
    <text x="430" y="160">"got yours too"</text>
  </g>
  <text x="4" y="192" fill="#1b5fa8" font-size="14" font-weight="700">Each side must announce a starting sequence number AND learn that the other side heard it.</text>
  <text x="4" y="214" fill="#25405e" font-size="14">Two messages would leave the SERVER unsure its own number arrived. Three is the minimum.</text>
  <text x="4" y="238" fill="#5d7288" font-size="14">Closing takes FOUR (FIN, ACK, FIN, ACK) because each direction is shut down separately.</text>
</svg>`;

/* ── SVG: ★ three ways to bind, read off a real server ─────────────────── */
const BIND = `<svg class="nw-svg" viewBox="0 0 900 262" width="1150" height="364"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">★ Same machine, three bind addresses, three completely different exposures</text>
  <g stroke-width="2.5">
    <rect x="12" y="32" width="282" height="122" rx="8" fill="#fdeeee" stroke="#d94b4b"/>
    <rect x="309" y="32" width="282" height="122" rx="8" fill="#fdf6ea" stroke="#e0952a"/>
    <rect x="606" y="32" width="282" height="122" rx="8" fill="#eefaf4" stroke="#1f9d6b"/>
  </g>
  <g text-anchor="middle" font-size="15" font-weight="800">
    <text x="153" y="56" fill="#8f2c2c">0.0.0.0:3001</text>
    <text x="450" y="56" fill="#7a4708">172.18.0.1:8888</text>
    <text x="747" y="56" fill="#14603f">127.0.0.1:3300</text>
  </g>
  <g text-anchor="middle" font-size="12" fill="#3c5570">
    <text x="153" y="80">every interface</text>
    <text x="153" y="100">reachable from the</text>
    <text x="153" y="120">whole INTERNET</text>
    <text x="450" y="80">one Docker bridge</text>
    <text x="450" y="100">reachable from</text>
    <text x="450" y="120">containers only</text>
    <text x="747" y="80">loopback only</text>
    <text x="747" y="100">reachable from</text>
    <text x="747" y="120">THIS machine only</text>
  </g>
  <g text-anchor="middle" font-size="12" font-weight="700">
    <text x="153" y="142" fill="#8f2c2c">needs a firewall</text>
    <text x="450" y="142" fill="#7a4708">scoped by design</text>
    <text x="747" y="142" fill="#14603f">safest default</text>
  </g>
  <text x="4" y="186" fill="#1b5fa8" font-size="14" font-weight="700">All three are real lines from ss -tlnp on one production VPS, at the same moment.</text>
  <text x="4" y="210" fill="#25405e" font-size="14">The port number is identical in kind; only the ADDRESS in front of the colon differs.</text>
  <text x="4" y="234" fill="#d94b4b" font-size="14" font-weight="700">Read the address, not just the port. "Port 3001 is open" is not a statement about risk.</text>
  <text x="4" y="256" fill="#5d7288" font-size="14">Most accidental exposures are a service bound to 0.0.0.0 that nobody meant to publish.</text>
</svg>`;

/* ── SVG: TCP vs UDP ───────────────────────────────────────────────────── */
const VS = `<svg class="nw-svg" viewBox="0 0 900 250" width="1150" height="347"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">TCP and UDP are not better and worse. They trade the same thing in opposite directions.</text>
  <g stroke-width="2.5">
    <rect x="20" y="32" width="410" height="132" rx="8" fill="#eef5fc" stroke="#1b5fa8"/>
    <rect x="470" y="32" width="410" height="132" rx="8" fill="#eefaf4" stroke="#1f9d6b"/>
  </g>
  <text x="225" y="56" text-anchor="middle" font-size="16" font-weight="800" fill="#1b5fa8">TCP</text>
  <text x="675" y="56" text-anchor="middle" font-size="16" font-weight="800" fill="#14603f">UDP</text>
  <g font-size="13" fill="#25405e">
    <text x="40" y="80">connection: handshake first</text>
    <text x="40" y="102">lost data is retransmitted</text>
    <text x="40" y="124">arrives in order, or waits</text>
    <text x="40" y="146">header 20 bytes, flow control</text>
    <text x="490" y="80">no connection, just send</text>
    <text x="490" y="102">lost data stays lost</text>
    <text x="490" y="124">may arrive out of order</text>
    <text x="490" y="146">header 8 bytes, no control</text>
  </g>
  <text x="4" y="196" fill="#1b5fa8" font-size="14" font-weight="700">The trade is LATENCY against CERTAINTY, and the right answer depends on the application.</text>
  <text x="4" y="220" fill="#25405e" font-size="14">A file must be perfect and can wait: TCP. A voice packet 200 ms late is useless: UDP.</text>
  <text x="4" y="244" fill="#5d7288" font-size="14">Retransmitting late audio would make a call worse, not better — that is the whole argument.</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'The Transport Layer',
    sub: 'Chapter 13 — Cisco Module 14',
    body: `<div class="cov-meta">Sessions 41–42 of 60 · CLO1, CLO4, CLO9<br>
      13.1 Transportation of Data · 13.2 TCP Overview · 13.3 UDP Overview<br>
      <b>13.4 Port Numbers</b> · 13.5 TCP Communication Process<br>
      13.6 Reliability and Flow Control · 13.7 UDP Communication · 13.8 AI Tools<br>
      ★ marks material added by cuongthai.com, measured on a real server</div>`,
  },

  /* ── session 41 ──────────────────────────────────────────────────────── */
  {
    t: 'Two sessions, and why this one is the useful one',
    body: `${CSS}
      ${kv([
        ['Session 41', '13.1 Transportation of Data · 13.2 TCP Overview · 13.3 UDP Overview'],
        ['Session 42', '<b>13.4 Port Numbers</b> · 13.5 TCP Communication Process · 13.6 Reliability and Flow Control · 13.7 UDP Communication · 13.8 AI tools'],
        ['Outcomes', '<b>CLO1</b> (layered protocols support end-user applications), <b>CLO4</b> (how layers interact for reliable communication), <b>CLO9</b>'],
        ['What it explains', 'why "the server is up but the site is down" is not a contradiction'],
      ])}
      <div class="box ok">Every chapter so far has been about moving bytes between <b>machines</b>. This one is about getting them to the right <b>program</b> — which is the layer where almost all day-to-day server work actually happens: publishing a port, opening a firewall, debugging a connection that refuses.</div>`,
  },

  { t: '13.1 What the transport layer adds', body: `${CSS}${ROLE}` },

  {
    t: '13.1 The four jobs of layer 4',
    body: `${CSS}
      ${kv([
        ['Multiplexing', 'many conversations over one IP address, kept apart by port numbers'],
        ['Segmentation', 'split a large stream into pieces that fit the path MTU (Chapter 12)'],
        ['Reliability', '<b>optional.</b> TCP does it, UDP does not, and that is a choice not a defect'],
        ['Flow control', '<b>optional.</b> stop a fast sender from drowning a slow receiver'],
      ])}
      <div class="box">The word to notice is <b>optional</b>. Layers 1 to 3 have no choice about what they do. Layer 4 is the first layer where the application picks a protocol with different guarantees, and that single decision — TCP or UDP — shapes everything above it.</div>`,
  },

  { t: '13.4 A connection is four numbers, not one', body: `${CSS}${SOCKET}` },

  {
    t: '13.4 Port numbers — the three ranges',
    body: `${CSS}
      <table class="t"><thead><tr><th>Range</th><th>Name</th><th>Who uses it</th></tr></thead>
      <tbody>
        <tr><td class="hl">0 – 1023</td><td>well-known</td><td>standard services. <b>Needs root on Linux to bind.</b></td></tr>
        <tr><td>1024 – 49151</td><td>registered</td><td>vendor services: 3306 MySQL, 5432 Postgres, 6379 Redis, 8080 alt-HTTP</td></tr>
        <tr><td>49152 – 65535</td><td>dynamic / ephemeral</td><td>the client end of every connection you ever make</td></tr>
      </tbody></table>
      <div class="box warn">★ <b>The under-1024 rule is why a hardened container cannot serve port 80.</b> A container running as a non-root user is refused the bind, and the usual fix is to listen on 8080 inside and publish it as 80 outside — which is exactly what a reverse proxy arrangement does. Linux ephemeral ports are 32768–60999 by default, not 49152 — check with <span class="nw-m">sysctl net.ipv4.ip_local_port_range</span>.</div>`,
  },

  {
    t: 'The well-known ports worth memorising',
    body: `${CSS}
      <table class="t"><thead><tr><th>Port</th><th>Service</th><th>TCP/UDP</th><th>Why you meet it</th></tr></thead>
      <tbody>
        <tr><td class="hl">22</td><td>SSH</td><td>TCP</td><td>how you reach a server at all</td></tr>
        <tr><td>25 / <span class="nw-m">587</span></td><td>SMTP / submission</td><td>TCP</td><td>sending mail; 587 is the one clients use</td></tr>
        <tr><td>53</td><td>DNS</td><td><b>both</b></td><td>UDP for queries, TCP when the answer is large</td></tr>
        <tr><td class="hl">80 / 443</td><td>HTTP / HTTPS</td><td>TCP</td><td>everything on the web</td></tr>
        <tr><td>67 / 68</td><td>DHCP</td><td>UDP</td><td>Chapter 10 — a host with no address yet</td></tr>
        <tr><td><span class="nw-m">993</span></td><td>IMAPS</td><td>TCP</td><td>reading mail over TLS</td></tr>
      </tbody></table>
      <div class="box">★ <b>Those three highlighted numbers are not academic.</b> A campus network that permits only 80, 443, 587 and 993 outbound lets you browse and use mail while silently blocking SSH on 22 — which is how a working laptop suddenly cannot reach its own server. The fix is to have the server listen on a permitted port as well; the diagnosis is this table.</div>`,
  },

  { t: '13.2 vs 13.3 — TCP and UDP side by side', body: `${CSS}${VS}` },

  {
    t: '13.2 The TCP header — the fields that do the work',
    body: `${CSS}
      ${pkt([['Src Port', '16 bits', 'hl'], ['Dst Port', '16 bits', 'hl'], ['Sequence', '32 bits'], ['Ack', '32 bits'], ['Flags', '9 bits'], ['Window', '16 bits', 'hl'], ['Checksum', '16 bits']])}
      ${kv([
        ['Sequence', 'byte number of the first byte in this segment — how order is restored'],
        ['Acknowledgement', '"I have everything up to here" — how loss is detected'],
        ['Flags', 'SYN opens, FIN closes politely, <b>RST</b> closes rudely, ACK confirms'],
        ['Window', 'how much the receiver can still take — this is flow control'],
      ])}
      <div class="box warn">★ <b>RST is the flag you meet as "connection refused".</b> Nothing was listening on that port, so the kernel answers with RST immediately instead of leaving you waiting. A <em>timeout</em> means something silently dropped the packet — usually a firewall. <b>Refused is fast and means "nobody home"; timeout is slow and means "something ate it".</b> That one distinction solves a large fraction of connection problems.</div>`,
  },

  { t: '13.5 The three-way handshake', body: `${CSS}${HAND}` },

  {
    t: '13.6 Reliability: how loss is detected and repaired',
    body: `${CSS}
      ${flow('sender', 'receiver', [
        ['r', 'seq=1000, 500 bytes', ''],
        ['l', 'ack=1500', 'got it'],
        ['r', 'seq=1500, 500 bytes', 'LOST in transit'],
        ['r', 'seq=2000, 500 bytes', ''],
        ['l', 'ack=1500 again', 'duplicate ACK — still missing 1500'],
      ])}
      <div class="box">The receiver never says "resend 1500". It keeps repeating the last acknowledgement it can honestly give, and the sender reads three duplicate ACKs as "the segment after 1500 never arrived". <b>Reliability is built from repetition of a positive statement</b>, not from an error message — which is why it works even when the network is losing packets in both directions.</div>`,
  },

  {
    t: '13.6 Flow control — the window',
    body: `${CSS}
      ${kv([
        ['The problem', 'a fast sender can overwhelm a slow receiver, and everything sent after is wasted'],
        ['The window', 'in every ACK the receiver says how much buffer it still has'],
        ['Window = 0', '"stop, I am full." The sender waits and probes until it reopens.'],
        ['Not the same as', '<b>congestion</b> control, which is about the NETWORK being full, not the receiver'],
      ])}
      <div class="box ok">Flow control protects the <b>receiver</b>; congestion control protects the <b>path</b>. They are separate mechanisms that happen to both work by slowing the sender, and confusing them makes performance problems hard to reason about. A window that keeps hitting zero points at the receiving application not reading fast enough — not at the network.</div>`,
  },

  {
    t: '13.7 UDP — and why "unreliable" is a feature',
    body: `${CSS}
      ${kv([
        ['Header', '8 bytes: source port, destination port, length, checksum. That is all of it.'],
        ['No handshake', 'the first packet carries data. No round trip spent setting up.'],
        ['No retransmission', 'a lost packet stays lost, and the application decides whether it cares'],
        ['Used by', 'DNS queries, DHCP, voice and video, game state, syslog, QUIC'],
      ])}
      <div class="box">★ <b>DNS is the clearest example of the trade.</b> A query and its answer are one small packet each. Setting up a TCP connection would cost a round trip before the question is even asked — to protect data that is cheap to simply ask for again. So DNS uses UDP, and falls back to TCP only when the answer is too big for one packet. The protocol chose latency over certainty, deliberately, because a retry is cheaper than a handshake.</div>`,
  },

  /* ── ★ on a real server ──────────────────────────────────────────────── */
  { t: '★ Three ways to bind, on one real server', body: `${CSS}${BIND}` },

  {
    t: '★ Reading ss -tlnp on a production VPS',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">ss -tlnp</span>
State   Local Address:Port    Process
LISTEN  <span class="r">0.0.0.0:3001</span>          docker-proxy      <span class="c"># the whole Internet</span>
LISTEN  <span class="g">127.0.0.1:3300</span>        docker-proxy      <span class="c"># this machine only</span>
LISTEN  <span class="k">172.18.0.1:8888</span>       docker-proxy      <span class="c"># Docker bridge only</span>
LISTEN  <span class="g">127.0.0.1:3478</span>        turnserver        <span class="c"># loopback</span>`, 'sm')}
      ${kv([
        ['-t', 'TCP only. Use <span class="nw-m">-u</span> for UDP; they are separate namespaces.'],
        ['-l', 'listening sockets only, not established connections'],
        ['-n', 'numeric — do not turn 443 into "https", which hides the number you want'],
        ['-p', 'which process. Needs root to show anything useful.'],
      ])}
      <div class="box ok">This one command answers "what is this machine offering, and to whom" completely. It is the first thing to run on a server you did not set up, and the fastest way to find a service exposed by accident.</div>`,
  },

  {
    t: '★ -p is not EXPOSE, and the difference is everything',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">docker ps --format '{{.Names}}\\t{{.Ports}}'</span>
cuonghoangdev_frontend   <span class="g">3000/tcp</span>                        <span class="c"># EXPOSE only — NOT published</span>
cuonghoangdev_backend    <span class="r">0.0.0.0:3001-&gt;3001/tcp</span>          <span class="c"># published to everyone</span>
cuonghoangdev_newapi     <span class="g">127.0.0.1:3300-&gt;3000/tcp</span>        <span class="c"># published to localhost</span>
cuonghoangdev_nginx      <span class="r">0.0.0.0:443-&gt;443/tcp</span>            <span class="c"># deliberately public</span>`, 'sm')}
      <div class="box warn"><b><span class="nw-m">EXPOSE</span> in a Dockerfile publishes nothing.</b> It is documentation — a note saying "this image listens here". Only <span class="nw-m">-p</span> or a compose <span class="nw-m">ports:</span> entry creates the host mapping. The frontend line above proves it: the container listens on 3000 and no traffic from outside can reach it, which is correct, because nginx reaches it over the Docker network instead.</div>
      <p class="note">★ Reading the left side of the arrow is the whole skill: no address means not published, <span class="nw-m">127.0.0.1</span> means local, <span class="nw-m">0.0.0.0</span> means the Internet.</p>`,
  },

  {
    t: '★ Connection states, and what they tell you',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">ss -tan | awk 'NR&gt;1{print $1}' | sort | uniq -c | sort -rn</span>
    104 LISTEN
      7 <span class="k">SYN-RECV</span>
      3 ESTAB`, 'sm')}
      ${kv([
        ['LISTEN', 'a socket waiting. 104 of them is mostly one docker-proxy per published port.'],
        ['ESTAB', 'an actual live conversation'],
        ['SYN-RECV', 'half-open: a SYN arrived, the SYN-ACK went out, no final ACK came back'],
        ['TIME-WAIT', 'recently closed, held briefly so late packets cannot confuse a new connection'],
      ])}
      <div class="box warn">★ <b>A handful of SYN-RECV on a public server is normal background noise</b> — scanners knock constantly and never complete the handshake. Thousands of them is a different matter and points at a SYN flood. The number is the signal, not the presence. Likewise <b>many TIME-WAIT is usually healthy</b>, not a leak: it means connections are being closed properly.</div>`,
  },

  {
    t: '★ Diagnosing a refused connection, in order',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span>Is anything listening? <span class="nw-m">ss -tlnp | grep :5432</span></span></div>
        <div><span class="n">2</span><span>Listening on which ADDRESS? <span class="nw-m">127.0.0.1</span> will never answer a remote client.</span></div>
        <div><span class="n">3</span><span>From the client: refused, or timeout? Refused = RST = nobody home. Timeout = filtered.</span></div>
        <div><span class="n">4</span><span>Reachable from the machine itself? <span class="nw-m">curl -v localhost:5432</span> separates service from network.</span></div>
        <div><span class="n">5</span><span>Only now look at the firewall.</span></div>
      </div>
      <div class="box ok">Step 3 is the one that saves the most time. <b>"Connection refused" arrives instantly and means the packet reached the machine</b> — routing and firewall are fine, and the service is simply not there. <b>A timeout means the packet never got an answer</b> — look at filtering, not at the service. People routinely restart a perfectly healthy service because they did not read which of the two they got.</div>`,
  },

  {
    t: '★ A firewall rule whose order makes half of it dead',
    body: `${CSS}
      ${code(`# iptables -L DOCKER-USER -n --line-numbers      (real output, trimmed)
1  DROP    tcp  0.0.0.0/0       dpt:6379     # matches EVERYTHING
2  ACCEPT  tcp  192.168.0.0/16  dpt:6379     # never reached
3  ACCEPT  tcp  172.16.0.0/12   dpt:6379     # never reached
4  ACCEPT  tcp  127.0.0.0/8     dpt:6379     # never reached`, 'bash', 'sm')}
      <div class="box warn"><b>iptables takes the FIRST rule that matches.</b> Rule 1 matches every source address, so rules 2 to 4 can never run. The intent was clearly "block the Internet, allow the local networks"; the effect is "block everything". The ACCEPT lines are dead text that reads as protection.</div>
      <div class="box">★ This is the same shape as a trap this course has met before: an <span class="nw-m">sshd_config</span> drop-in named <span class="nw-m">70-</span> saying the opposite of <span class="nw-m">50-cloud-init.conf</span> and being silently ignored, because sshd also takes the first value it reads. <b>Whenever order decides meaning, put the specific rule ABOVE the general one</b> — and verify the effective state, never the file you just wrote.</div>`,
  },

  {
    t: '13.8 AI tools — and the one question to ask them',
    body: `${CSS}
      <div class="two">
        <div class="box ok"><b>Good use</b><br><span class="note">"What does SYN-RECV mean and when is it a problem?"<br>"Explain the difference between refused and timeout."<br>"Review this iptables chain for unreachable rules."</span></div>
        <div class="box warn"><b>Bad use</b><br><span class="note">"Why can't I connect?" — it has not seen your machine, your bind address or your firewall.</span></div>
      </div>
      <div class="box">The third good example is the interesting one: <b>an ordering bug in a rule chain is exactly what a model is good at spotting</b>, because it is a property of the text itself and needs no knowledge of your network. Compare that with "why can't I connect", where every useful fact is on your machine and none of it is in the question.</div>
      <p class="note">The rule that has held all course: a model proposes, a command decides.</p>`,
  },

  {
    t: 'The five mistakes that cost the most marks',
    body: `${CSS}
      ${kv([
        ['"A port is open"', 'meaningless without the address. 0.0.0.0:3001 and 127.0.0.1:3001 differ completely.'],
        ['Confusing refused with timeout', 'refused = RST = reached the machine. Timeout = filtered. Different fixes.'],
        ['Thinking EXPOSE publishes', 'it documents. Only <span class="nw-m">-p</span> creates the mapping.'],
        ['"UDP is unreliable so it is worse"', 'DNS and voice choose it deliberately. The trade is latency against certainty.'],
        ['Two-way handshake', 'three is the minimum for BOTH sides to know their sequence number arrived.'],
      ])}
      <div class="box ok">One habit covers most of them: when you say a port is open, say the address and the protocol too. "TCP 0.0.0.0:5432 is listening" is a fact you can act on; "5432 is open" is a sentence that has lost the part that mattered.</div>`,
  },

  {
    t: 'What you can do now, and what comes next',
    body: `${CSS}
      ${kv([
        ['Explain', 'what layer 4 adds to layer 3, and why a port number is what makes it possible'],
        ['Name', 'a connection by its four numbers, and say why one port serves thousands of clients'],
        ['Say', 'why the handshake needs three messages and the close needs four'],
        ['Choose', 'TCP or UDP for an application and defend the choice as a trade, not a ranking'],
        ['★ Read', '<span class="nw-m">ss -tlnp</span> and say what each line exposes and to whom'],
        ['★ Distinguish', 'EXPOSE from <span class="nw-m">-p</span>, and refused from timeout'],
        ['★ Spot', 'a firewall rule made dead by a catch-all above it'],
      ])}
      <div class="box ok">Next: <b>Chapter 14 — the Application Layer</b> (sessions 45–46, Cisco Module 15). HTTP, DNS, DHCP and email — the protocols that sit on the ports this chapter just explained.</div>`,
  },
];
