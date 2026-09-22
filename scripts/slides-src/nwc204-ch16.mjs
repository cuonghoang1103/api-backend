/**
 * nwc204-ch16.mjs — NWC204 Chapter 16: Build a Small Network
 * (FLM buổi 54–55, Cisco Module 17). CHƯƠNG CUỐI của môn.
 *
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 54, 55.
 *   buổi 53: Review Modules 8-15                          (CLO5-CLO10 · buổi ôn)
 *   buổi 54: 16. Build a Small Network · 16.1 Devices in a Small Network ·
 *            16.2 Small Network Applications and Protocols ·
 *            16.3 Scale to Larger Networks                (CLO8, CLO9 · T · Module 17)
 *   buổi 55: 16.4 Verify Connectivity · 16.5 Host and IOS Commands ·
 *            16.6 Troubleshooting Methodologies · 16.7 Troubleshooting Scenarios ·
 *            16.8 Integrate AI Tools (Self Learning)      (CLO8, CLO9 · T · Module 17)
 *   buổi 58, 59, 60: Review. ⚠️ Buổi 60 ghi LO là "CLO1-CLO11" mà môn chỉ có 10 CLO.
 *
 * ⚠️ BẤT THƯỜNG của bảng câu hỏi kiến tạo — NÊU, KHÔNG SỬA:
 *   - buổi 54 mang CQ18.3 (tường lửa)  → nội dung CHƯƠNG 15, đã trả lời ở bài 15.2
 *   - buổi 55 mang CQ19.1 (DoS)        → cũng CHƯƠNG 15
 *   - ngược lại, ba câu KHỚP ĐÚNG chương này lại nằm ở buổi khác:
 *       CQ19.2 (buổi 57, đồ án)  — "identifying the physical and logical topologies" = 16.3
 *       CQ20.1 (buổi 58, ôn tập) — một router ra ISP hỏng thì làm gì      = 16.3 dự phòng
 *       CQ20.2 (buổi 59, ôn tập) — giảm độ trễ cho luồng thời gian thực  = 16.2 QoS
 *
 * ★ = phần cuongthai.com bổ sung. ⚠️ KHÔNG có quyền SSH vào VPS khi soạn chương
 *    này, nên MỌI kết xuất lệnh trong deck là DẠNG CHUẨN của lệnh đó, không phải
 *    bản ghi đo được. Slide nào in kết xuất đều nói rõ điều đó.
 * ⚠️ KHÔNG in địa chỉ IP công khai thật. Chỉ dùng dải tài liệu RFC 5737
 *    (198.51.100.x / 203.0.113.x) và dải riêng RFC 1918.
 *
 * ⚠️ SVG: viewBox="0 0 900 h" width="1150". Chữ đơn cách rộng 0,602 × font-size
 *    ⇒ font 15 tối đa ~99 ký tự/dòng từ x=4; font 14 → 106; font 13 → 114.
 *    Chữ trong <rect> phải NGẮN HƠN rect, và mọi rect đặt bằng CÔNG THỨC.
 *
 * 25 slide (1 bìa + 24 nội dung); 17 trong số đó là sơ đồ, SVG, bảng hoặc terminal.
 */
import { CSS, topo, term, kv, code, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch16',
  code: 'NWC204',
  title: 'Ch.16 — Build a Small Network',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: ★ a docker compose stack IS a small network ──────────────────── */
const DOCKER = `<svg class="nw-svg" viewBox="0 0 900 262" width="1150" height="364"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">★ You already run a small network: every part of Module 17 has a container-sized twin.</text>
  <g stroke-width="2.5">
    <rect x="14" y="34" width="118" height="56" rx="8" fill="#f4f6f8" stroke="#6b8199"/>
    <rect x="170" y="34" width="122" height="56" rx="8" fill="#fdf6ea" stroke="#e0952a"/>
    <rect x="316" y="26" width="570" height="118" rx="10" fill="#f7fbff" stroke="#1b5fa8" stroke-dasharray="7 5"/>
  </g>
  <text x="73" y="60" text-anchor="middle" font-size="14" font-weight="800" fill="#3c5570">Internet</text>
  <text x="73" y="80" text-anchor="middle" font-size="11" fill="#6b8199">untrusted</text>
  <text x="231" y="60" text-anchor="middle" font-size="14" font-weight="800" fill="#7a4708">nginx</text>
  <text x="231" y="80" text-anchor="middle" font-size="11" fill="#6b8199">the edge device</text>
  <text x="326" y="48" font-size="13" fill="#1b5fa8" font-weight="700">docker network 172.18.0.0/16 — this is the LAN</text>
  <g stroke="#1b5fa8" stroke-width="2" fill="#fff">
    <rect x="330" y="62" width="126" height="56" rx="7"/>
    <rect x="468" y="62" width="126" height="56" rx="7"/>
    <rect x="606" y="62" width="126" height="56" rx="7"/>
    <rect x="744" y="62" width="126" height="56" rx="7"/>
  </g>
  <g text-anchor="middle" font-size="13" font-weight="800" fill="#0f2a4a">
    <text x="393" y="88">frontend</text><text x="531" y="88">backend</text>
    <text x="669" y="88">postgres</text><text x="807" y="88">redis</text>
  </g>
  <g text-anchor="middle" font-size="11" fill="#6b8199">
    <text x="393" y="106">:3000</text><text x="531" y="106">:3001</text>
    <text x="669" y="106">:5432</text><text x="807" y="106">:6379</text>
  </g>
  <g stroke="#1b5fa8" stroke-width="2.5">
    <line x1="132" y1="62" x2="164" y2="62"/><polygon points="164,56 178,62 164,68" fill="#1b5fa8" stroke="none"/>
    <line x1="292" y1="62" x2="310" y2="62"/><polygon points="310,56 324,62 310,68" fill="#1b5fa8" stroke="none"/>
  </g>
  <text x="4" y="176" fill="#1b5fa8" font-size="14" font-weight="700">nginx is the edge router and the firewall. The four services are the internal hosts.</text>
  <text x="4" y="200" fill="#25405e" font-size="14">172.18.0.0/16 is a private range (RFC 1918), exactly like the LAN behind any office router.</text>
  <text x="4" y="224" fill="#25405e" font-size="14">Only nginx is published to the outside; the other four are reachable by name inside the network.</text>
  <text x="4" y="248" fill="#5d7288" font-size="14">Same design questions as Module 17: which device is at the edge, who may talk to whom, what scales.</text>
</svg>`;

/* ── SVG: 16.3 redundancy — one exit point versus two ──────────────────── */
const REDUN = `<svg class="nw-svg" viewBox="0 0 900 276" width="1150" height="383"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">CQ20.1 — one router to the ISP is one failure away from having no network at all.</text>
  <g stroke-width="2.5">
    <rect x="12" y="30" width="430" height="162" rx="9" fill="#fdeeee" stroke="#d94b4b"/>
    <rect x="458" y="30" width="430" height="162" rx="9" fill="#eefaf4" stroke="#1f9d6b"/>
  </g>
  <text x="227" y="52" text-anchor="middle" font-size="14" font-weight="800" fill="#8f2c2c">One exit point</text>
  <text x="673" y="52" text-anchor="middle" font-size="14" font-weight="800" fill="#14603f">Two exit points</text>
  <g stroke="#1b5fa8" stroke-width="2" fill="#fff">
    <rect x="30" y="72" width="110" height="46" rx="7"/>
    <rect x="170" y="72" width="110" height="46" rx="7"/>
    <rect x="310" y="72" width="110" height="46" rx="7"/>
  </g>
  <g text-anchor="middle" font-size="13" font-weight="800" fill="#0f2a4a">
    <text x="85" y="100">LAN</text><text x="225" y="100">router</text><text x="365" y="100">ISP</text>
  </g>
  <g stroke="#5d7288" stroke-width="2">
    <line x1="140" y1="95" x2="170" y2="95"/><line x1="280" y1="95" x2="310" y2="95"/>
  </g>
  <text x="225" y="142" text-anchor="middle" font-size="12" fill="#8f2c2c" font-weight="700">one box, one link, one cut</text>
  <text x="227" y="166" text-anchor="middle" font-size="12" fill="#3c5570">either one fails and the whole site is offline</text>
  <g stroke="#1b5fa8" stroke-width="2" fill="#fff">
    <rect x="474" y="72" width="100" height="46" rx="7"/>
    <rect x="604" y="50" width="100" height="40" rx="7"/>
    <rect x="604" y="102" width="100" height="40" rx="7"/>
    <rect x="734" y="50" width="140" height="40" rx="7"/>
    <rect x="734" y="102" width="140" height="40" rx="7"/>
  </g>
  <g text-anchor="middle" font-size="13" font-weight="800" fill="#0f2a4a">
    <text x="524" y="100">LAN</text>
    <text x="654" y="75">router A</text><text x="654" y="127">router B</text>
    <text x="804" y="75">ISP A</text><text x="804" y="127">ISP B</text>
  </g>
  <g stroke="#5d7288" stroke-width="2">
    <line x1="574" y1="84" x2="604" y2="70"/><line x1="574" y1="106" x2="604" y2="122"/>
    <line x1="704" y1="70" x2="734" y2="70"/><line x1="704" y1="122" x2="734" y2="122"/>
  </g>
  <text x="673" y="166" text-anchor="middle" font-size="12" fill="#14603f" font-weight="700">a second path, and ideally a second provider</text>
  <text x="4" y="216" fill="#1b5fa8" font-size="14" font-weight="700">Redundancy is not a bigger box. It is a SECOND independent path to the same place.</text>
  <text x="4" y="240" fill="#25405e" font-size="14">Two routers on one ISP link still share one failure. Two ISPs also survive the provider itself.</text>
  <text x="4" y="264" fill="#5d7288" font-size="14">The cost is real: a second line, a second contract, and a routing protocol to choose between them.</text>
</svg>`;

/* ── SVG: 16.6 three troubleshooting methods ───────────────────────────── */
const METHODS = `<svg class="nw-svg" viewBox="0 0 900 268" width="1150" height="372"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">16.6 — three ways to walk the same stack. The difference is only WHERE YOU START.</text>
  <g stroke-width="2.5">
    <rect x="12" y="30" width="282" height="150" rx="9" fill="#eef5fc" stroke="#1b5fa8"/>
    <rect x="309" y="30" width="282" height="150" rx="9" fill="#fdf6ea" stroke="#e0952a"/>
    <rect x="606" y="30" width="282" height="150" rx="9" fill="#eefaf4" stroke="#1f9d6b"/>
  </g>
  <g text-anchor="middle" font-size="14" font-weight="800">
    <text x="153" y="54" fill="#1b5fa8">Bottom-up</text>
    <text x="450" y="54" fill="#7a4708">Top-down</text>
    <text x="747" y="54" fill="#14603f">Divide-and-conquer</text>
  </g>
  <g stroke-width="2.5">
    <line x1="36" y1="152" x2="36" y2="82" stroke="#1b5fa8"/>
    <polygon points="30,86 36,70 42,86" fill="#1b5fa8"/>
    <line x1="333" y1="78" x2="333" y2="146" stroke="#e0952a"/>
    <polygon points="327,142 333,158 339,142" fill="#e0952a"/>
    <line x1="630" y1="114" x2="630" y2="82" stroke="#1f9d6b"/>
    <polygon points="624,86 630,70 636,86" fill="#1f9d6b"/>
    <line x1="630" y1="114" x2="630" y2="146" stroke="#1f9d6b"/>
    <polygon points="624,142 630,158 636,142" fill="#1f9d6b"/>
  </g>
  <g font-size="12" fill="#25405e">
    <text x="56" y="82">start at layer 1</text>
    <text x="56" y="104">cable, link, IP, port, app</text>
    <text x="56" y="126">use it when the fault</text>
    <text x="56" y="148">smells physical</text>
    <text x="353" y="82">start at the application</text>
    <text x="353" y="104">app, port, IP, link, cable</text>
    <text x="353" y="126">use it when ONE app</text>
    <text x="353" y="148">fails and others work</text>
    <text x="650" y="82">start in the middle, L3</text>
    <text x="650" y="104">ping the gateway first</text>
    <text x="650" y="126">use it when experience</text>
    <text x="650" y="148">says where to look</text>
  </g>
  <text x="4" y="208" fill="#1b5fa8" font-size="14" font-weight="700">Every method tests ONE layer at a time and does not move on until that layer is proven.</text>
  <text x="4" y="232" fill="#25405e" font-size="14">Picking one is a bet about where the fault is. A wrong bet costs time; no method at all costs far more.</text>
  <text x="4" y="256" fill="#5d7288" font-size="14">Write down what you tried. Half of all repeated work is re-testing something already proven fine.</text>
</svg>`;

/* ── SVG: ★ sixteen chapters, one path ─────────────────────────────────── */
const MAP = `<svg class="nw-svg" viewBox="0 0 900 300" width="1150" height="417"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">★ Sixteen chapters, one path: each layer, and the chapter that taught you to read it.</text>
  <g stroke-width="2">
    <rect x="14" y="28" width="872" height="34" rx="7" fill="#eefaf4" stroke="#1f9d6b"/>
    <rect x="14" y="66" width="872" height="34" rx="7" fill="#eef5fc" stroke="#1b5fa8"/>
    <rect x="14" y="104" width="872" height="34" rx="7" fill="#eef5fc" stroke="#1b5fa8"/>
    <rect x="14" y="142" width="872" height="34" rx="7" fill="#eef5fc" stroke="#1b5fa8"/>
    <rect x="14" y="180" width="872" height="34" rx="7" fill="#eef5fc" stroke="#1b5fa8"/>
    <rect x="14" y="218" width="872" height="34" rx="7" fill="#fdf6ea" stroke="#e0952a"/>
  </g>
  <g font-size="14" font-weight="800" fill="#0f2a4a">
    <text x="28" y="50">L7 Application</text>
    <text x="28" y="88">L4 Transport</text>
    <text x="28" y="126">L3 Network</text>
    <text x="28" y="164">L2 Data link</text>
    <text x="28" y="202">L1 Physical</text>
    <text x="28" y="240">Across all</text>
  </g>
  <g font-size="13" fill="#25405e">
    <text x="164" y="50">Ch.14 — HTTP, DNS, DHCP, email, peer-to-peer</text>
    <text x="164" y="88">Ch.13 — ports, sockets, TCP handshake, UDP, flow control</text>
    <text x="164" y="126">Ch.7 routing · Ch.8 ARP · Ch.9 routers · Ch.10 IPv4 · Ch.11 IPv6 · Ch.12 ICMP</text>
    <text x="164" y="164">Ch.5 framing and MAC · Ch.6 Ethernet switching and the MAC table</text>
    <text x="164" y="202">Ch.4 media, signals, bandwidth · Ch.4B binary and hex (added chapter)</text>
    <text x="164" y="240">Ch.1 today · Ch.2 device config · Ch.3 models · Ch.15 security · Ch.16 assembly</text>
  </g>
  <text x="4" y="278" fill="#1b5fa8" font-size="14" font-weight="700">This chapter is the only one with no new layer. Its subject is the other fifteen, assembled.</text>
  <text x="4" y="298" fill="#5d7288" font-size="14">Design reads the table downwards; troubleshooting reads it upwards. Same table, two directions.</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'Build a Small Network',
    sub: 'Chapter 16 — Cisco Module 17 · the final chapter',
    body: `<div class="cov-meta">Sessions 54–55 of 60 · CLO8, CLO9<br>
      16.1 Devices in a Small Network · 16.2 Small Network Applications and Protocols<br>
      16.3 Scale to Larger Networks · 16.4 Verify Connectivity · 16.5 Host and IOS Commands<br>
      16.6 Troubleshooting Methodologies · 16.7 Troubleshooting Scenarios · 16.8 AI Tools<br>
      ★ marks material added by cuongthai.com</div>`,
  },

  /* ── session 54 ──────────────────────────────────────────────────────── */
  {
    t: 'Two sessions, and the two outcomes they are measured by',
    body: `${CSS}
      ${kv([
        ['Session 54', '16.1 Devices · 16.2 Applications and Protocols · 16.3 Scale to Larger Networks'],
        ['Session 55', '16.4 Verify Connectivity · 16.5 Host and IOS Commands · 16.6 Troubleshooting Methodologies · 16.7 Scenarios · 16.8 AI Tools'],
        ['CLO8', '"Design and implement a small network topology with routers, switches, and end devices, considering performance and scalability."'],
        ['CLO9', '"Utilize AI tools to analyze, configure, monitor, and troubleshoot networks."'],
      ])}
      <div class="box ok">Read CLO8 again: <b>design AND implement</b>, then <b>performance and scalability</b>. Every other chapter asked you to understand one layer. This one asks you to put all of them together and defend the result — which is why it is last.</div>`,
  },

  {
    t: '16.1 What a small network is made of',
    body: `${CSS}
      ${topo(['nd.cl:PCs|end devices', 'lk:copper', 'nd:Switch|layer 2', 'lk:trunk', 'nd.rt:Router|layer 3 edge', 'lk:WAN link', 'nd.cl:ISP|the outside'])}
      ${kv([
        ['Typical size', 'one site, under 200 users, usually one router and one or two switches'],
        ['Who runs it', 'one or two people who also do everything else — so simplicity is a requirement'],
        ['What is shared', 'file and print, mail, web, DNS, DHCP, and increasingly voice and video'],
        ['The edge device', 'the router is the only thing between the LAN and the rest of the world'],
      ])}
      <div class="box">Small does not mean simple. The same layers, the same protocols and the same failure modes appear; what changes is that <b>nobody else is going to fix it for you</b>, so the design has to be one you can hold in your head at 2am.</div>`,
  },

  {
    t: '16.1 Choosing devices: the four factors',
    body: `${CSS}
      <table class="t"><thead><tr><th>Factor</th><th>The question it answers</th><th>What it costs to get wrong</th></tr></thead>
      <tbody>
        <tr><td class="hl">Cost</td><td>what the budget actually buys, including support</td><td>buying twice</td></tr>
        <tr><td class="hl">Ports and speed</td><td>how many devices now, at what link speed</td><td>uplink becomes the bottleneck</td></tr>
        <tr><td>Expandability</td><td>fixed-configuration or modular slots</td><td>a full switch on day 400</td></tr>
        <tr><td>OS features</td><td>does the image support routing, QoS, ACLs, SSH</td><td>a feature you cannot enable</td></tr>
      </tbody></table>
      <div class="box warn">The two highlighted rows fight each other, and that fight is the whole exercise. <b>A cheap switch with the right port count today is a bottleneck the moment one uplink carries everyone traffic.</b> Count ports for growth, not for the current headcount.</div>`,
  },

  {
    t: '16.1 What the design must settle before any cable is plugged',
    body: `${CSS}
      ${kv([
        ['Addressing', 'one planned scheme, documented — which subnet, which gateway, what is static'],
        ['Static or DHCP', 'servers, printers and network devices static; user devices by DHCP'],
        ['Redundancy', 'where a second path exists, and where you have accepted a single point of failure'],
        ['Traffic types', 'which traffic is real-time and therefore must not wait in a queue'],
        ['Security', 'Chapter 15: device hardening first, then the filtering at the edge'],
      ])}
      <div class="box ok">Notice the third row. <b>Accepting a single point of failure is a legitimate design decision</b> — small networks are full of them, because a second line costs real money. What is not legitimate is having one without knowing it. Write it down and the outage becomes a known risk instead of a surprise.</div>`,
  },

  { t: '★ You already run a small network', body: `${CSS}${DOCKER}` },

  {
    t: '16.2 The protocols a small network actually runs',
    body: `${CSS}
      <table class="t"><thead><tr><th>Service</th><th>Protocol</th><th>Port</th><th>Chapter that taught it</th></tr></thead>
      <tbody>
        <tr><td>Name resolution</td><td>DNS</td><td>53 UDP/TCP</td><td>Ch.14</td></tr>
        <tr><td>Address assignment</td><td>DHCP</td><td>67 / 68 UDP</td><td>Ch.10, Ch.14</td></tr>
        <tr><td>Web</td><td>HTTP / HTTPS</td><td>80 / 443 TCP</td><td>Ch.13, Ch.14</td></tr>
        <tr><td>Mail</td><td>SMTP / IMAP</td><td>25, 587 / 143, 993</td><td>Ch.14</td></tr>
        <tr><td class="hl">Voice and video</td><td>RTP over UDP</td><td>dynamic</td><td>this chapter</td></tr>
        <tr><td>Remote admin</td><td>SSH</td><td>22 TCP</td><td>Ch.2, Ch.15</td></tr>
      </tbody></table>
      <div class="box">Only the highlighted row is new, and it is new for a reason: it is the only one that <b>cannot be fixed by retrying</b>. Everything else on this list tolerates a lost packet by asking again.</div>`,
  },

  {
    t: '16.2 Real-time traffic, and the answer named QoS',
    body: `${CSS}
      ${kv([
        ['The problem', 'a queue is first-in-first-out, so a voice packet waits behind a 2 GB backup'],
        ['Why retrying fails', 'audio that arrives late cannot be played — the conversation moved on'],
        ['<b>QoS</b>', 'classify traffic, then serve the delay-sensitive class first at every queue'],
        ['Where it acts', 'only where there is congestion: the uplink, the WAN link, the slow hop'],
        ['CQ20.2 answer', 'implement <b>QoS</b> — queuing and prioritisation for real-time streams'],
      ])}
      <div class="box warn">QoS does not create bandwidth. <b>It decides who waits.</b> On an uncongested link it changes nothing at all, which is why "we enabled QoS and nothing improved" usually means the link was never the problem. Measure first, prioritise second.</div>`,
  },

  {
    t: '16.3 Scaling starts with a document, not a purchase',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><b>Physical topology</b> — where devices are, what cable runs where, which port is which</span></div>
        <div><span class="n">2</span><span><b>Logical topology</b> — subnets, VLANs, addresses, routes, who reaches whom</span></div>
        <div><span class="n">3</span><span><b>Inventory</b> — device, model, image version, purpose, who owns it</span></div>
        <div><span class="n">4</span><span><b>Budget and traffic analysis</b> — what is spent, and what the links actually carry</span></div>
      </div>
      <div class="box ok"><b>CQ19.2 asks which element of scaling involves identifying the physical and logical topologies.</b> The answer is this documentation step, and it comes first because every later decision is an argument about a diagram. Without one, scaling is guesswork with invoices attached.</div>`,
  },

  { t: '16.3 Redundancy — one exit point is one failure', body: `${CSS}${REDUN}` },

  {
    t: '★ The same single point of failure, one layer up',
    body: `${CSS}
      <div class="grid3">
        <div class="card"><b>One VPS</b><p>web, API, database and cache on one machine. One reboot takes all four down.</p></div>
        <div class="card"><b>One container</b><p>a stateless service is cheap to duplicate. The database is not — it holds state.</p></div>
        <div class="card"><b>One provider</b><p>two servers at one hosting company still share one outage.</p></div>
      </div>
      <div class="box warn">★ Module 17 talks about redundancy in routers, and the idea does not stop at layer 3. <b>Ask the same question of every layer: if this one thing stops, what else stops with it?</b> The honest answer for most small setups is "everything", and that is survivable — as long as it is written down next to a restore procedure that has actually been tested.</div>`,
  },

  /* ── session 55 ──────────────────────────────────────────────────────── */
  {
    t: '16.4 Verify connectivity — the ladder, one rung at a time',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span>${m('ping 127.0.0.1')} — is my own TCP/IP stack alive?</span></div>
        <div><span class="n">2</span><span>${m('ping &lt;my own address&gt;')} — is my interface configured and up?</span></div>
        <div><span class="n">3</span><span>${m('ping &lt;default gateway&gt;')} — can I reach my own LAN?</span></div>
        <div><span class="n">4</span><span>${m('ping 8.8.8.8')} — is routing off-site working, DNS aside?</span></div>
        <div><span class="n">5</span><span>${m('ping example.com')} — and only now, does name resolution work?</span></div>
      </div>
      <div class="box ok">Steps 4 and 5 are the pair that pays for itself. <b>If the address answers and the name does not, the network is fine and DNS is broken</b> — one rung apart, completely different repair. Chapter 12 built this ladder; this chapter uses it inside a method.</div>`,
  },

  {
    t: '16.5 Host commands you will actually type',
    body: `${CSS}
      <table class="t"><thead><tr><th>Question</th><th>Windows</th><th>Linux / macOS</th></tr></thead>
      <tbody>
        <tr><td>What is my address?</td><td>${m('ipconfig /all')}</td><td>${m('ip addr')} · ${m('ifconfig')}</td></tr>
        <tr><td>Where do packets go?</td><td>${m('route print')}</td><td>${m('ip route')}</td></tr>
        <tr><td>Can I reach it?</td><td>${m('ping')}</td><td>${m('ping')}</td></tr>
        <tr><td>Which path?</td><td>${m('tracert')}</td><td>${m('traceroute')} · ${m('mtr')}</td></tr>
        <tr><td class="hl">What is listening?</td><td>${m('netstat -ano')}</td><td>${m('ss -tlnp')}</td></tr>
        <tr><td>Who resolves the name?</td><td>${m('nslookup')}</td><td>${m('dig')} · ${m('nslookup')}</td></tr>
      </tbody></table>
      <div class="box">The highlighted row is the one that separates "the machine is reachable" from "the service is there". Chapter 13 showed why: ping never touches layer 4, so a host can answer every ping and still have nothing listening on the port you need.</div>`,
  },

  {
    t: '16.5 IOS commands — what is up, before what is configured',
    body: `${CSS}
      ${term(`<span class="p">R1#</span> <span class="k">show ip interface brief</span>
Interface        IP-Address      OK? Method Status            Protocol
GigabitEthernet0/0  198.51.100.1  YES manual <span class="g">up</span>                <span class="g">up</span>
GigabitEthernet0/1  192.168.10.1  YES manual <span class="g">up</span>                <span class="r">down</span>
Serial0/0/0         unassigned    YES unset  <span class="r">administratively down</span> <span class="r">down</span>

<span class="c">! Status = layer 1 (is there a signal?)   Protocol = layer 2 (is the link usable?)</span>`, 'sm')}
      <div class="box warn"><b>Two columns, two layers, and the pair is the diagnosis.</b> up/up is healthy. <b>up/down</b> means the cable is fine and layer 2 is not — encapsulation mismatch, no clock rate, no keepalive. <b>administratively down</b> means nobody typed ${m('no shutdown')}. Reading them as one word throws away half the information.</div>
      <p class="note">Output shown in its standard form, with documentation addresses (RFC 5737). It is not a capture from a live device.</p>`,
  },

  {
    t: '16.5 IOS — neighbours, versions, and saving the work',
    body: `${CSS}
      ${code(`R1# show cdp neighbors detail     ! who is on the other end of each cable
R1# show ip route                 ! what this router believes about the world
R1# show version                  ! image, uptime, and the configuration register
R1# show running-config           ! what is active RIGHT NOW, in RAM
R1# show startup-config           ! what will come back after a reload
R1# copy running-config startup-config   ! the step everyone forgets`, 'bash', 'sm')}
      <div class="box warn"><b>running-config and startup-config are different files, and only one of them survives a power cut.</b> A change that works perfectly and is never copied looks like a hardware fault the next morning: the device came back and undid your work. Copy, then verify with ${m('show startup-config')} — not by remembering that you copied.</div>
      <div class="box">★ Same shape as a habit from Chapter 15: verify the <b>effective state</b>, never the file you just wrote. ${m('sshd -T')} on Linux, ${m('show startup-config')} on IOS.</div>`,
  },

  { t: '16.6 Three troubleshooting methods', body: `${CSS}${METHODS}` },

  {
    t: '16.6 Choosing a method, and what each one assumes',
    body: `${CSS}
      <table class="t"><thead><tr><th>Method</th><th>Start at</th><th>Best when</th><th>Wastes time when</th></tr></thead>
      <tbody>
        <tr><td class="hl">Bottom-up</td><td>layer 1</td><td>a whole site is down, or new cabling</td><td>everything is up and one app is broken</td></tr>
        <tr><td>Top-down</td><td>layer 7</td><td>one application fails, others work</td><td>the cable is out and you test the app</td></tr>
        <tr><td>Divide-and-conquer</td><td>layer 3</td><td>you have a strong hunch</td><td>the hunch is wrong</td></tr>
      </tbody></table>
      <div class="box ok">All three end in the same place; they differ only in how quickly. <b>Divide-and-conquer is the fastest when it is right and the slowest when it is wrong</b>, because a wrong start means testing in both directions. Bottom-up is the safe default precisely because it never assumes anything.</div>`,
  },

  {
    t: '★ This course has been bottom-up the whole time',
    body: `${CSS}
      ${kv([
        ['Ch.12 ping ladder', 'loopback, own address, gateway, remote IP, then the name — layer 1 upward'],
        ['Ch.13 refused test', 'reached the machine first, then asked what was listening'],
        ['Ch.13 five steps', 'listening? which address? refused or timeout? local? firewall last'],
        ['Ch.15 hardening', 'device first, then the service, then the filter at the edge'],
        ['What that means', 'you already own a method; this section only gives it a name'],
      ])}
      <div class="box ok">★ Being able to <b>name</b> the method matters more than it sounds. Once you can say "I am going bottom-up", you can also say "I am at rung 3 and rungs 1 and 2 are proven" — and that sentence is what stops the same test being run four times by three people.</div>`,
  },

  {
    t: '16.7 Scenario — the interface that is up but not up',
    body: `${CSS}
      ${term(`<span class="p">R1#</span> <span class="k">show ip interface brief | include 0/1</span>
GigabitEthernet0/1  192.168.10.1  YES manual up                <span class="r">down</span>

<span class="p">R1#</span> <span class="k">show interfaces gi0/1</span>
  <span class="c">! line protocol is down  ·  0 packets input  ·  keepalive set (10 sec)</span>

<span class="c">! Layer 1 is fine: there is a signal. Layer 2 is not: nothing usable comes back.</span>
<span class="c">! Look for duplex or encapsulation mismatch, a dead neighbour, or a bad patch.</span>`, 'sm')}
      <div class="box warn"><b>Symptom people report:</b> "the port is up, so the cable is fine, so it must be the server." Half right. Status up does mean the cable carries a signal — and line protocol down means nothing usable is coming back over it. The next command is on the <b>other</b> device, not this one.</div>
      <p class="note">Standard form of the output, not a capture from a live device.</p>`,
  },

  {
    t: '16.7 Scenario — right cable, wrong gateway',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span>${m('ping 127.0.0.1')} works · ${m('ping 192.168.10.25')} works — stack and interface fine</span></div>
        <div><span class="n">2</span><span>${m('ping 192.168.10.1')} fails — cannot reach the gateway</span></div>
        <div><span class="n">3</span><span>${m('ipconfig /all')} shows gateway ${m('192.168.11.1')} — a typo, wrong subnet</span></div>
        <div><span class="n">4</span><span>Other machines work, so DHCP is fine — this host was set static by hand</span></div>
        <div><span class="n">5</span><span>Fix the gateway, or return the host to DHCP so the mistake cannot recur</span></div>
      </div>
      <div class="box ok">Step 4 is the one that turns a fix into a repair. <b>"Why is this one host static?"</b> is a better question than "what is its gateway", because the answer usually explains the next three incidents too. Manual exceptions are where small networks rot.</div>`,
  },

  {
    t: '★ Scenario — a service that answers, and one that is not there',
    body: `${CSS}
      ${code(`# Is this route actually live? Ask the server, not the browser.
curl -s -o /dev/null -w "%{http_code}" https://example.com/api/v1/health

# 200 = mounted and public      401 = mounted, needs auth  (both are GOOD news)
# 404 = not mounted -> stale or partial build
# no answer at all -> filtered somewhere; this says nothing about the service`, 'bash', 'sm')}
      <div class="box warn">★ <b>404 and 401 look equally like failure in a browser and mean opposite things.</b> 401 proves the route exists and the whole path works. 404 from a route you know you wrote means the running build is not the build you think it is. A timeout means you have learned nothing yet — go back to the ladder.</div>
      <div class="box">This is top-down troubleshooting: start at layer 7, and let the status code tell you whether you need to go any lower. It is the right method here precisely because one service is broken while everything else on the host answers.</div>`,
  },

  {
    t: '16.8 AI tools — the question shape that works',
    body: `${CSS}
      <div class="two">
        <div class="box ok"><b>Good use</b><br><span class="note">"Explain up/down versus administratively down."<br>"Review this running-config for unreachable ACL lines."<br>"Draft a checklist for a bottom-up walk of a small LAN."</span></div>
        <div class="box warn"><b>Bad use</b><br><span class="note">"My network is down, fix it." It has not seen your cabling, your addresses or your interface states.</span></div>
      </div>
      <div class="box">The pattern holds across the whole course: a model is good at reasoning about <b>text you can show it</b> — a config, an output, a rule chain — and useless about state it cannot observe. Paste the evidence and it becomes a second pair of eyes; withhold it and you get confident guessing.</div>
      <p class="note">The rule that has held all course: a model proposes, a command decides.</p>`,
  },

  {
    t: 'The question table is at its most scrambled here',
    body: `${CSS}
      ${kv([
        ['Session 54 → CQ18.3', 'the component protecting communications to and from a computer — <b>firewall</b>, Chapter 15'],
        ['Session 55 → CQ19.1', 'the threat that stops authorized users reaching resources — <b>DoS</b>, Chapter 15'],
        ['Session 57 → CQ19.2', 'identifying physical and logical topologies — that is <b>16.3</b>, taught in session 54'],
        ['Session 58 → CQ20.1', 'one router to the ISP fails — that is <b>16.3 redundancy</b>'],
        ['Session 59 → CQ20.2', 'minimise latency for real-time streams — that is <b>16.2 QoS</b>'],
      ])}
      <div class="box warn">Both questions printed against this chapter belong to the previous one, and all three questions that belong here are printed against a project session and two revision sessions. <b>The table is quoted as published and is not corrected.</b> Answer by topic, never by the session number beside the question.</div>`,
  },

  { t: '★ Sixteen chapters, one path from layer 1 to layer 7', body: `${CSS}${MAP}` },

  {
    t: 'What you can do now — and what is left of the course',
    body: `${CSS}
      ${kv([
        ['Design', 'a small network: devices chosen by cost, ports, expandability and OS features'],
        ['Plan', 'addressing, what is static, where redundancy exists and where it deliberately does not'],
        ['Name', 'the protocol behind each service, and say which one cannot tolerate waiting'],
        ['Argue', 'for QoS as prioritisation, not as extra bandwidth'],
        ['Verify', 'with the ping ladder, then host commands, then <b>show ip interface brief</b>'],
        ['Choose', 'bottom-up, top-down or divide-and-conquer, and say what each one assumes'],
        ['★ Apply', 'all of it to the small network you already run on a server'],
      ])}
      <div class="box ok">Sessions 53, 58, 59 and 60 are revision; 56 and 57 are the group project. <b>There is no Chapter 17.</b> What remains is to take the design you can now defend and build it — in Packet Tracer for the project, and on a real machine for everything after it.</div>`,
  },
];
