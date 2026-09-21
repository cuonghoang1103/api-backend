/**
 * nwc204-ch07.mjs — NWC204 Chapter 7: The Network Layer
 * (FLM buổi 21–22 lý thuyết + buổi 23 Review Modules 1–7, Cisco Module 8).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 21, 22, 23.
 *   buổi 21: 7.1 Network Layer Characteristics · 7.2 IPv4 Packet
 *   buổi 22: 7.3 IPv6 Packet · 7.4 How a Host Routes · 7.5 Router Routing Tables
 *            · 7.6 Integrate AI Tools (self learning)
 *   buổi 23: Review Modules 1–7
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 8: Path MTU Discovery và lỗ đen
 *     MTU, cờ DF cùng MSS clamping, `ip route get`, bảng định tuyến nhiều bảng
 *     của Linux với `ip rule`, và các tuyến Docker tự cắm vào máy chủ.
 *
 * 28 slide, 25 trong số đó là sơ đồ, SVG, bảng hoặc terminal.
 */
import { CSS, stack, pkt, encap, topo, flow, term, kv, code, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch07',
  code: 'NWC204',
  title: 'Ch.7 — The Network Layer',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: TTL decremented hop by hop until it hits zero ──────────────────── */
const TTL = `<svg class="nw-svg" viewBox="0 0 900 205" width="1150" height="262"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Every router that FORWARDS a packet subtracts 1 from TTL before sending it on</text>
  <g stroke="#1b5fa8" stroke-width="2.5" fill="none">
    <line x1="90" y1="72" x2="220" y2="72"/><line x1="280" y1="72" x2="420" y2="72"/>
    <line x1="480" y1="72" x2="620" y2="72"/><line x1="680" y1="72" x2="810" y2="72"/>
  </g>
  <rect x="20" y="54" width="70" height="36" rx="6" fill="#eaf3fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="55" y="77" font-size="14" text-anchor="middle" fill="#0f2a4a" font-weight="700">host</text>
  <g fill="#f5f9fd" stroke="#1b5fa8" stroke-width="2.5">
    <ellipse cx="250" cy="72" rx="30" ry="20"/><ellipse cx="450" cy="72" rx="30" ry="20"/><ellipse cx="650" cy="72" rx="30" ry="20"/>
  </g>
  <text x="250" y="77" font-size="14" text-anchor="middle" fill="#0f2a4a" font-weight="700">R1</text>
  <text x="450" y="77" font-size="14" text-anchor="middle" fill="#0f2a4a" font-weight="700">R2</text>
  <text x="650" y="77" font-size="14" text-anchor="middle" fill="#0f2a4a" font-weight="700">R3</text>
  <rect x="810" y="54" width="82" height="36" rx="6" fill="#eefaf4" stroke="#1f9d6b" stroke-width="2.5"/>
  <text x="851" y="77" font-size="14" text-anchor="middle" fill="#14603f" font-weight="700">server</text>
  <g font-size="15" font-weight="800" fill="#b4690e" text-anchor="middle">
    <text x="155" y="44">TTL 64</text><text x="350" y="44">TTL 63</text>
    <text x="550" y="44">TTL 62</text><text x="745" y="44">TTL 61</text>
  </g>
  <text x="4" y="128" fill="#d94b4b" font-size="15" font-weight="700">If TTL reaches 0 the router DISCARDS the packet and returns ICMP Time Exceeded (type 11)</text>
  <text x="4" y="150" fill="#5d7288" font-size="14">That is not a failure — it is the loop brake, and traceroute turns it into a tool:</text>
  <text x="4" y="172" fill="#1b5fa8" font-size="14" font-weight="700">TTL=1 → R1 answers · TTL=2 → R2 answers · TTL=3 → R3 answers … one hop revealed per round</text>
  <text x="4" y="196" fill="#5d7288" font-size="14">Linux and macOS start at 64, Windows at 128, Cisco IOS at 255 — the value names the sender OS.</text>
</svg>`;

/* ── SVG: fragmentation of one 4000-byte packet across a 1500-byte link ──── */
const FRAG = `<svg class="nw-svg" viewBox="0 0 900 218" width="1150" height="278"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">One 4000-byte IPv4 packet meets a link whose MTU is 1500</text>
  <rect x="20" y="28" width="860" height="30" rx="4" fill="#eaf3fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="450" y="48" font-size="15" text-anchor="middle" fill="#0f2a4a" font-weight="700">IP header 20 B + 3980 bytes of data · ID = 0x4A1F · MF = 0 · Offset = 0</text>
  <text x="450" y="76" font-size="18" text-anchor="middle" fill="#b4690e" font-weight="800">↓ the ROUTER splits it — the sender is never told</text>
  <g stroke-width="2.5">
    <rect x="20" y="90" width="300" height="52" rx="4" fill="#fff5d6" stroke="#b4690e"/>
    <rect x="332" y="90" width="300" height="52" rx="4" fill="#fff5d6" stroke="#b4690e"/>
    <rect x="644" y="90" width="236" height="52" rx="4" fill="#eefaf4" stroke="#1f9d6b"/>
  </g>
  <g font-size="13" text-anchor="middle" fill="#3c5570">
    <text x="170" y="109" font-weight="800" fill="#7a4708">fragment 1 · 1480 B data</text>
    <text x="170" y="128">ID 0x4A1F · MF=1 · offset 0</text>
    <text x="482" y="109" font-weight="800" fill="#7a4708">fragment 2 · 1480 B data</text>
    <text x="482" y="128">ID 0x4A1F · MF=1 · offset 185</text>
    <text x="762" y="109" font-weight="800" fill="#14603f">fragment 3 · 1020 B data</text>
    <text x="762" y="128">ID 0x4A1F · MF=0 · offset 370</text>
  </g>
  <text x="4" y="166" fill="#5d7288" font-size="14">Offset counts in units of 8 bytes: 1480 / 8 = 185. The shared ID ties the three together.</text>
  <text x="4" y="190" fill="#d94b4b" font-size="14" font-weight="700">Only the DESTINATION reassembles. Lose one fragment and the whole packet is lost.</text>
  <text x="4" y="212" fill="#1b5fa8" font-size="14" font-weight="700">IPv6 removed this: routers never fragment. The SOURCE must size the packet correctly.</text>
</svg>`;

/* ── SVG: the three decisions a host makes for every packet ──────────────── */
const HOSTDEC = `<svg class="nw-svg" viewBox="0 0 740 238" width="960" height="309"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <rect x="250" y="6" width="200" height="34" rx="6" fill="#eaf3fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="350" y="28" font-size="15" text-anchor="middle" fill="#0f2a4a" font-weight="700">packet for 10.0.0.7</text>
  <path d="M350 40 L350 60" stroke="#1b5fa8" stroke-width="2.5"/>
  <polygon points="350,68 500,104 350,140 200,104" fill="#fff8e8" stroke="#b4690e" stroke-width="2.5"/>
  <text x="350" y="100" font-size="13" text-anchor="middle" fill="#7a4708" font-weight="700">destination AND my mask</text>
  <text x="350" y="116" font-size="13" text-anchor="middle" fill="#7a4708" font-weight="700">= my own network?</text>
  <path d="M200 104 L120 104 L120 150" stroke="#1f9d6b" stroke-width="2.5" fill="none"/>
  <path d="M500 104 L585 104 L585 150" stroke="#d94b4b" stroke-width="2.5" fill="none"/>
  <text x="150" y="96" font-size="14" fill="#1f9d6b" font-weight="800">YES</text>
  <text x="528" y="96" font-size="14" fill="#d94b4b" font-weight="800">NO</text>
  <rect x="20" y="152" width="200" height="60" rx="6" fill="#eefaf4" stroke="#1f9d6b" stroke-width="2.5"/>
  <text x="120" y="174" font-size="14" text-anchor="middle" fill="#14603f" font-weight="800">LOCAL — deliver direct</text>
  <text x="120" y="194" font-size="12" text-anchor="middle" fill="#3c5570">ARP for 10.0.0.7 itself,</text>
  <text x="120" y="208" font-size="12" text-anchor="middle" fill="#3c5570">frame goes straight to it</text>
  <rect x="465" y="152" width="245" height="60" rx="6" fill="#fdeeee" stroke="#d94b4b" stroke-width="2.5"/>
  <text x="587" y="174" font-size="14" text-anchor="middle" fill="#8f2c2c" font-weight="800">REMOTE — send to gateway</text>
  <text x="587" y="194" font-size="12" text-anchor="middle" fill="#3c5570">ARP for the GATEWAY, not the</text>
  <text x="587" y="208" font-size="12" text-anchor="middle" fill="#3c5570">target · dst IP stays 10.0.0.7</text>
  <rect x="245" y="160" width="190" height="44" rx="6" fill="#f2f7fd" stroke="#6b8199" stroke-width="2"/>
  <text x="340" y="178" font-size="13" text-anchor="middle" fill="#3c5570" font-weight="700">third case: 127.0.0.1</text>
  <text x="340" y="196" font-size="12" text-anchor="middle" fill="#5d7288">never leaves the machine</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'The Network Layer',
    sub: 'Chapter 7 — Cisco Module 8',
    body: `<div class="cov-meta">Sessions 21–22 (theory) + 23 (Review Modules 1–7) of 60 · CLO4, CLO9<br>
      7.1 Network Layer Characteristics · 7.2 IPv4 Packet<br>
      7.3 IPv6 Packet · 7.4 How a Host Routes · 7.5 Router Routing Tables<br>
      7.6 Integrate AI Tools for Explaining Concepts (self-learning)<br>
      ★ marks material added by cuongthai.com, beyond Cisco Module 8</div>`,
  },

  /* ── 7.1 Network layer characteristics ───────────────────────────────── */
  {
    t: 'Layer 3 is where "anywhere" begins',
    body: `${CSS}
      ${stack([
        ['L4', 'Transport', 'TCP / UDP — which program on that machine'],
        ['L3', 'Network', 'IP — WHICH MACHINE, anywhere on Earth', true],
        ['L2', 'Data Link', 'MAC — which neighbour on THIS wire'],
        ['L1', 'Physical', 'bits on copper, fibre, radio'],
      ])}
      ${kv([
        ['Layer 2 addressing', 'valid on one link only · a MAC address means nothing one hop away'],
        ['Layer 3 addressing', 'globally meaningful · 8.8.8.8 means the same thing from every country'],
        ['The whole job of L3', 'carry a packet across networks it has never seen, through routers it does not know'],
      ])}`,
  },

  {
    t: 'Four operations, and only four',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><b>Addressing end devices</b> — every host gets a unique IP so it can be named from anywhere.</span></div>
        <div><span class="n">2</span><span><b>Encapsulation</b> — the L4 segment gets an IP header carrying source and destination IP. It becomes a <b>packet</b>.</span></div>
        <div><span class="n">3</span><span><b>Routing</b> — every router on the path picks the next hop, re-frames the packet for that link, and sends it.</span></div>
        <div><span class="n">4</span><span><b>De-encapsulation</b> — the destination strips the IP header and hands the segment up to L4.</span></div>
      </div>
      <div class="box warn">Notice what is <b>not</b> on the list: error recovery, ordering, retransmission, flow control. IP does none of it. That is Chapter 13's job.</div>`,
  },

  {
    t: 'Encapsulation — what L3 adds, and what it never reads',
    body: `${CSS}
      ${encap(['Ethernet frame — dst MAC, src MAC, EtherType 0x0800, FCS',
               'IPv4 packet — src IP, dst IP, TTL, Protocol 6',
               'TCP segment — src port, dst port, seq, ack'],
              `<div style="font-size:19px;padding:8px 6px;color:#3c5570">HTTP request — GET /index.html</div>`)}
      ${kv([
        ['Every router', 'rewrites the Ethernet frame completely — new src and dst MAC on every hop'],
        ['No router', 'changes the source or destination IP · those survive the whole journey (until NAT)'],
        ['No router', 'reads the TCP header or the HTTP text · it has no business there'],
      ])}`,
  },

  {
    t: 'Characteristic 1 — IP is CONNECTIONLESS',
    body: `${CSS}
      <div class="two">
        <div>
          <div class="nh">TCP — connection first</div>
          ${flow('client', 'server', [
            ['r', 'SYN', 'may I?'],
            ['l', 'SYN, ACK', 'yes'],
            ['r', 'ACK', 'agreed'],
            ['r', 'data', 'only now'],
          ])}
        </div>
        <div>
          <div class="nh">IP — just send it</div>
          ${flow('host', 'destination', [
            ['r', 'packet', 'no warning'],
          ])}
          <div class="box" style="margin-top:14px;font-size:20px">No setup, no agreement, no state kept anywhere. Like posting a letter: you do not phone ahead.</div>
        </div>
      </div>`,
  },

  {
    t: 'Characteristic 2 — IP is BEST-EFFORT',
    body: `${CSS}
      ${kv([
        ['IP promises', 'to <b>try</b>. Nothing else.'],
        ['IP does NOT promise', 'delivery · order · no duplicates · no corruption of your data'],
        ['A packet may be', 'dropped by a full queue, dropped by TTL expiry, delivered twice, or arrive third'],
        ['Who fixes it', 'TCP at layer 4, if the application asked for TCP. Otherwise nobody does.'],
      ])}
      <div class="box ok">This is a <b>design choice, not a weakness.</b> Reliability costs state, and state in the middle of the network does not scale to billions of devices. Push it to the two ends, and the middle stays simple and fast.</div>
      <div class="box warn">Exam trap: FLM's own question CQ8.1 asks "why do we need IP for <b>reliable</b> communications?". IP is explicitly <b>un</b>reliable — say so, then explain what it does provide.</div>`,
  },

  {
    t: 'Characteristic 3 — IP is MEDIA INDEPENDENT',
    body: `${CSS}
      ${topo([
        'nd:laptop|MTU 1500', 'lk:Ethernet|1500 B',
        'nd.rt:R1|', 'lk:PPPoE|1492 B',
        'nd.rt:R2|', 'lk:VPN tunnel|1420 B',
        'nd:server|MTU 1500',
      ])}
      ${kv([
        ['The same IP packet', 'crosses copper, fibre, Wi-Fi, 4G and a VPN tunnel without one field changing'],
        ['L3 cares about exactly one property of the medium', '<b>MTU</b> — the largest payload that link will carry'],
        ['MTU too small for the packet', 'IPv4 → the router fragments it · IPv6 → the router drops it and reports back'],
      ])}`,
  },

  /* ── 7.2 The IPv4 packet ─────────────────────────────────────────────── */
  {
    t: 'The IPv4 header — all twelve fields',
    body: `${CSS}
      <div class="nh" style="margin-bottom:3px">Row 1 — bytes 0 to 3</div>
      ${pkt([['Version', '4 bits', 'hl'], ['IHL', '4 bits'], ['DSCP', '6 bits'], ['ECN', '2 bits'], ['Total Length', '16 bits', '', 2]])}
      <div class="nh" style="margin-top:0;margin-bottom:3px">Row 2 — bytes 4 to 7 · fragmentation</div>
      ${pkt([['Identification', '16 bits', '', 2], ['Flags', '3 bits'], ['Fragment Offset', '13 bits', '', 2]])}
      <div class="nh" style="margin-top:0;margin-bottom:3px">Row 3 — bytes 8 to 11</div>
      ${pkt([['TTL', '8 bits', 'hl'], ['Protocol', '8 bits', 'hl'], ['Header Checksum', '16 bits', '', 2]])}
      <div class="nh" style="margin-top:0;margin-bottom:3px">Rows 4 and 5 — bytes 12 to 19</div>
      ${pkt([['Source IPv4 Address', '32 bits', 'pay'], ['Destination IPv4 Address', '32 bits', 'pay']])}`,
  },

  {
    t: 'Version, IHL, DSCP and ECN — the first four bytes',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Version — 4 bits</th><td>Always 4 here. A 6 means the whole header below is IPv6 and must be read differently.</td></tr>
        <tr><th>IHL — 4 bits</th><td>Header length in 4-byte words. Minimum 5 (20 B), maximum 15 (60 B). Options are rare and often dropped by firewalls.</td></tr>
        <tr><th>Total Length — 16 bits</th><td>Header + data, in bytes. Maximum 65 535, so an IP packet can never exceed 64 KB.</td></tr>
        <tr><th>DSCP — 6 bits</th><td>Quality of service. EF (46) for voice, AF classes for video and business traffic, 0 for everything else.</td></tr>
        <tr><th>ECN — 2 bits</th><td>Explicit Congestion Notification. A router near overload sets 11 instead of dropping, and TCP slows down without a loss.</td></tr>
      </table>
      <div class="box warn">DSCP only means something if every device on the path is configured to honour it. Across the public Internet it is usually rewritten to 0 — pay for it only on links you control.</div>`,
  },

  { t: 'TTL — the loop brake that became a diagnostic tool', body: `${CSS}${TTL}` },

  {
    t: 'Protocol — the field that says what is inside',
    body: `${CSS}
      <table class="t">
        <tr><th>Value</th><th>Protocol</th><th>What you see it carry</th></tr>
        <tr><td class="hl">1</td><td>ICMP</td><td>ping, traceroute, "destination unreachable", "fragmentation needed"</td></tr>
        <tr><td class="hl">6</td><td>TCP</td><td>HTTP, HTTPS, SSH, SMTP — anything that must not lose bytes</td></tr>
        <tr><td class="hl">17</td><td>UDP</td><td>DNS, DHCP, QUIC, VoIP, game traffic</td></tr>
        <tr><td>41</td><td>IPv6</td><td>an IPv6 packet tunnelled inside IPv4</td></tr>
        <tr><td>47 / 50</td><td>GRE / ESP</td><td>tunnels and IPsec VPNs</td></tr>
        <tr><td>89</td><td>OSPF</td><td>routers telling each other about routes</td></tr>
      </table>
      <div class="box">This one byte is what lets the destination know which layer-4 handler to call. Get it wrong and the packet is delivered to the wrong code — which is why <b>firewall rules that only mention ports miss ICMP, GRE and ESP entirely.</b></div>`,
  },

  { t: 'Fragmentation — how IPv4 survives a small link', body: `${CSS}${FRAG}` },

  {
    t: '★ The MTU black hole — a fault that looks like magic',
    body: `${CSS}
      ${flow('your laptop', 'the web server', [
        ['r', 'TCP SYN — 60 bytes', 'small · gets through'],
        ['l', 'SYN, ACK', 'connection opens fine'],
        ['r', 'GET /page — 200 bytes', 'small · gets through'],
        ['l', 'response, 1500-byte packets, DF set', 'hits a 1420 B tunnel'],
        ['l', 'ICMP "fragmentation needed" from a router', 'BLOCKED by a firewall'],
      ])}
      <div class="box warn"><b>Symptom:</b> the page starts loading and then hangs forever. SSH connects and then freezes the moment you run a command with long output. Small things work, big things die.</div>
      <div class="box ok"><b>Cause:</b> somebody blocked all ICMP "to be safe". Path MTU Discovery depends on ICMP type 3 code 4 getting back. Kill that message and the sender never learns to send smaller.</div>`,
  },

  {
    t: '★ Proving and fixing an MTU black hole',
    body: `${CSS}
      ${term(`<span class="c"># Find the largest packet that survives. -M do sets DF: do NOT fragment.</span>
<span class="p">$</span> <span class="k">ping</span> -M do -s 1472 -c 2 1.1.1.1
<span class="g">1480 bytes from 1.1.1.1: icmp_seq=1 ttl=57 time=12.4 ms</span>   <span class="c"># 1472 + 28 = 1500 OK</span>

<span class="p">$</span> <span class="k">ping</span> -M do -s 1473 -c 2 1.1.1.1
<span class="r">ping: local error: message too long, mtu=1500</span>          <span class="c"># your own NIC refuses</span>

<span class="c"># Over a tunnel the wall appears EARLIER — binary-search between 1200 and 1472.</span>
<span class="p">$</span> <span class="k">ping</span> -M do -s 1392 -c 2 10.8.0.1   <span class="c"># 1392 + 28 = 1420 → tunnel MTU</span>`, 'sm')}
      ${kv([
        ['Fix on the server', 'clamp TCP MSS so the two ends negotiate a size that fits the smallest link'],
        ['nftables', '<span class="nw-m">tcp flags syn tcp option maxseg size set rt mtu</span>'],
        ['Or simply', 'stop blocking ICMP type 3 — it is a control message, not an attack'],
      ])}`,
  },

  /* ── 7.3 The IPv6 packet ─────────────────────────────────────────────── */
  {
    t: 'The IPv6 header — fewer fields, bigger addresses',
    body: `${CSS}
      <div class="nh">IPv6 — fixed 40 bytes, 8 fields</div>
      ${pkt([['Version', '4 b'], ['Traffic Class', '8 b'], ['Flow Label', '20 b', '', 2]])}
      ${pkt([['Payload Length', '16 b', '', 2], ['Next Header', '8 b', 'hl'], ['Hop Limit', '8 b', 'hl']])}
      ${pkt([['Source Address', '128 bits', 'pay']])}
      ${pkt([['Destination Address', '128 bits', 'pay']])}
      ${kv([
        ['Header is BIGGER', '40 bytes vs 20 — but 32 of those 40 are just the two addresses'],
        ['Header is SIMPLER', '8 fields vs 12, and always the same length · no IHL needed'],
        ['Next Header', 'does the job of IPv4\'s Protocol field, and also chains extension headers'],
      ])}`,
  },

  {
    t: 'What IPv6 deleted, and why',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Header Checksum</th><td>Gone. Ethernet already checks with the FCS and TCP/UDP check again — three checksums for one packet was waste, and recomputing it at every hop cost router CPU.</td></tr>
        <tr><th>Identification, Flags, Fragment Offset</th><td>Gone from the main header. <b>Routers never fragment IPv6.</b> Too small → drop it and send ICMPv6 Packet Too Big. The source must resize.</td></tr>
        <tr><th>IHL and Options</th><td>Gone. The header is always 40 bytes, so a router can find the payload by arithmetic instead of parsing. Options moved to extension headers.</td></tr>
        <tr><th>TTL → Hop Limit</th><td>Renamed, not removed. The old name was a lie: it was always a hop count, never seconds.</td></tr>
      </table>
      <div class="box warn">Consequence you will meet on a real server: if ICMPv6 is blocked, IPv6 breaks <b>much harder</b> than IPv4 did — there is no fragmentation fallback at all.</div>`,
  },

  {
    t: 'Extension headers — options that routers can skip',
    body: `${CSS}
      ${encap(['IPv6 header — Next Header = 43',
               'Routing header — Next Header = 44',
               'Fragment header — Next Header = 6'],
              `<div style="font-size:19px;padding:8px 6px;color:#3c5570">TCP segment → the application data</div>`)}
      ${kv([
        ['The chain', 'each header names the next · the last one names the transport protocol (6 = TCP, 17 = UDP)'],
        ['Why it is faster', 'a router reads the fixed 40-byte header and forwards · it only walks the chain if it must'],
        ['Hop-by-Hop', 'the one exception — every router on the path must examine it, so it must come first'],
        ['★ In practice', 'firewalls often drop packets with long chains · keep them short in anything you design'],
      ])}`,
  },

  /* ── 7.4 How a host routes ───────────────────────────────────────────── */
  { t: 'How a host routes — three destinations, one test', body: `${CSS}${HOSTDEC}` },

  {
    t: 'The host routing table on Linux',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">ip route</span>
<span class="g">default via 10.0.0.1 dev eth0 proto dhcp metric 100</span>
<span class="g">10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.42 metric 100</span>
<span class="g">172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown</span>

<span class="c"># default        → everything not matched above goes to 10.0.0.1</span>
<span class="c"># scope link     → this network is DIRECTLY attached, no router needed</span>
<span class="c"># proto kernel   → the kernel added it when the address was configured</span>
<span class="c"># src            → which of my addresses is used as the source IP</span>`, 'sm')}
      ${kv([
        ['Three lines is a normal server', 'one default, one for the LAN, one that Docker added by itself'],
        ['No default route', 'you can reach neighbours and nothing else — the classic "ping works, curl hangs"'],
        ['metric', 'when two routes tie, the lower metric wins'],
      ])}`,
  },

  {
    t: 'The same table on Windows and on Cisco IOS',
    body: `${CSS}
      <div class="nh">Windows</div>
      ${term(`<span class="p">C:\\&gt;</span> <span class="k">route print -4</span>
<span class="g">Network Destination        Netmask          Gateway       Interface  Metric</span>
<span class="g">          0.0.0.0          0.0.0.0       10.0.0.1      10.0.0.42      35</span>
<span class="g">       10.0.0.0    255.255.255.0        On-link       10.0.0.42     291</span>
<span class="g">      127.0.0.0        255.0.0.0        On-link      127.0.0.1     331</span>`, 'sm')}
      <div class="nh" style="margin-top:8px">Cisco IOS — an end device, not a router</div>
      ${term(`<span class="p">Switch#</span> <span class="k">show ip route</span>
<span class="g">Default gateway is 192.168.1.1</span>
<span class="g">Host               Gateway           Last Use    Total Uses  Interface</span>
<span class="g">ICMP redirect cache is empty</span>`, 'sm')}
      <div class="box">Three operating systems, three layouts, <b>one idea</b>: destination, mask, next hop, exit interface. Learn the idea and every table is readable.</div>`,
  },

  {
    t: '★ Stop guessing — ask the kernel which route it would use',
    body: `${CSS}
      ${term(`<span class="c"># "If I sent a packet there RIGHT NOW, what would actually happen?"</span>
<span class="p">$</span> <span class="k">ip route get</span> 8.8.8.8
<span class="g">8.8.8.8 via 10.0.0.1 dev eth0 src 10.0.0.42 uid 1000</span>
<span class="c">#        ^ gateway      ^ out here  ^ with this source address</span>

<span class="p">$</span> <span class="k">ip route get</span> 10.0.0.99
<span class="g">10.0.0.99 dev eth0 src 10.0.0.42 uid 1000</span>       <span class="c"># no "via" = LOCAL, direct delivery</span>

<span class="p">$</span> <span class="k">ip route get</span> 172.17.0.5
<span class="g">172.17.0.5 dev docker0 src 172.17.0.1 uid 1000</span>   <span class="c"># goes to the container bridge</span>`, 'sm')}
      <div class="box ok">This single command answers "local or remote?", "which interface?" and "which source IP?" at once. It reads the <b>real</b> table with the <b>real</b> longest-prefix logic — no arithmetic in your head, no mistakes.</div>`,
  },

  {
    t: 'The default gateway is just a neighbour with a job',
    body: `${CSS}
      ${topo([
        'nd:PC|10.0.0.42/24', 'lk:switch|access port',
        'nd.rt:R1|10.0.0.1', 'lk:WAN|R1 is the gateway',
        'nd.cl:Internet|8.8.8.8',
      ])}
      ${kv([
        ['A gateway must be', 'an address <b>on your own subnet</b> — you have to be able to ARP for it'],
        ['Gateway outside your subnet', 'the classic misconfiguration: you cannot ARP for it, so nothing leaves'],
        ['What the PC sends', 'dst MAC = the router · dst IP = 8.8.8.8 · two different destinations in one packet'],
        ['No gateway set', 'the LAN still works perfectly — which is why the fault looks so strange'],
      ])}`,
  },

  /* ── 7.5 Router routing tables ───────────────────────────────────────── */
  {
    t: 'A router table, read line by line',
    body: `${CSS}
      ${term(`<span class="p">R1#</span> <span class="k">show ip route</span>
<span class="c">Codes: L - local, C - connected, S - static, O - OSPF, * - candidate default</span>

<span class="g">      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks</span>
<span class="g">C        10.0.0.0/24 is directly connected, GigabitEthernet0/0</span>
<span class="g">L        10.0.0.1/32 is directly connected, GigabitEthernet0/0</span>
<span class="g">C        192.168.1.0/24 is directly connected, GigabitEthernet0/1</span>
<span class="g">S        172.16.0.0/16 [1/0] via 10.0.0.9</span>
<span class="g">O        10.5.0.0/24 [110/2] via 192.168.1.2, 00:14:22, GigabitEthernet0/1</span>
<span class="g">S*       0.0.0.0/0 [1/0] via 203.0.113.1</span>`, 'sm')}
      ${kv([
        ['<b>C</b> vs <b>L</b>', 'C is the network on that interface · L is the router\'s own address, always a /32'],
        ['[1/0] and [110/2]', 'administrative distance / metric — trust first, then cost'],
        ['<b>S*</b> 0.0.0.0/0', 'the gateway of last resort · matches every destination, with the worst possible prefix'],
      ])}`,
  },

  {
    t: 'Where routes come from, and who is believed',
    body: `${CSS}
      <table class="t">
        <tr><th>Code</th><th>Source</th><th>AD</th><th>Meaning</th></tr>
        <tr><td class="hl">C / L</td><td>Connected</td><td>0</td><td>I can see this network on my own interface. Nothing beats it.</td></tr>
        <tr><td class="hl">S</td><td>Static</td><td>1</td><td>A human typed it. Trusted almost absolutely, and never notices a failure.</td></tr>
        <tr><td>D</td><td>EIGRP</td><td>90</td><td>Learned from a Cisco neighbour.</td></tr>
        <tr><td>O</td><td>OSPF</td><td>110</td><td>Learned from any vendor's neighbour. Reacts to failures on its own.</td></tr>
        <tr><td>R</td><td>RIP</td><td>120</td><td>Obsolete, still on exams.</td></tr>
      </table>
      <div class="box"><b>Administrative distance answers "who do I believe?"</b> — it is used when two <i>different protocols</i> offer the same prefix. <b>Metric answers "which way is better?"</b> — used inside one protocol. Lower wins in both cases.</div>`,
  },

  {
    t: 'Longest prefix match — the only rule that decides',
    body: `${CSS}
      <table class="t">
        <tr><th>Route in the table</th><th>Prefix length</th><th>Matches 172.16.5.10?</th><th>Verdict</th></tr>
        <tr><td>0.0.0.0/0 via 203.0.113.1</td><td>0</td><td>yes</td><td>weakest match</td></tr>
        <tr><td>172.16.0.0/16 via 10.0.0.9</td><td>16</td><td>yes</td><td>better</td></tr>
        <tr><td class="hl">172.16.5.0/24 via 10.0.0.20</td><td class="hl">24</td><td class="hl">yes</td><td class="hl">✅ THIS ONE WINS</td></tr>
        <tr><td>172.16.6.0/24 via 10.0.0.30</td><td>24</td><td>no</td><td>not a match at all</td></tr>
      </table>
      ${kv([
        ['The rule', 'among all routes that MATCH, the one with the most 1-bits in its mask wins'],
        ['Administrative distance', 'only consulted when two routes have the <b>same</b> prefix length'],
        ['Why /32 host routes work', 'a /32 is the longest possible prefix, so it overrides everything — handy and dangerous'],
      ])}`,
  },

  {
    t: '★ Linux has many routing tables, not one',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">ip rule</span> show
<span class="g">0:      from all lookup local</span>      <span class="c"># own addresses + broadcast — consulted FIRST</span>
<span class="g">32766:  from all lookup main</span>       <span class="c"># what "ip route" shows you</span>
<span class="g">32767:  from all lookup default</span>    <span class="c"># usually empty</span>

<span class="c"># A VPN or a second ISP adds its own table and a rule to reach it:</span>
<span class="p">$</span> <span class="k">ip rule</span> add from 203.0.113.50 table 200
<span class="p">$</span> <span class="k">ip route</span> add default via 203.0.113.1 table 200
<span class="p">$</span> <span class="k">ip route</span> show table 200`, 'sm')}
      <div class="box warn">If <span class="nw-m">ip route</span> looks perfectly correct and traffic still goes the wrong way, <b>a rule sent it to another table before "main" was ever read.</b> Check <span class="nw-m">ip rule</span> before you doubt your own eyes — and remember <span class="nw-m">ip route get</span> follows the rules for you.</div>`,
  },

  {
    t: '★ Docker writes routes into your server too',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">ip route</span> | <span class="k">grep</span> -E 'docker|br-'
<span class="g">172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1</span>
<span class="g">172.18.0.0/16 dev br-4f2a1c proto kernel scope link src 172.18.0.1</span>

<span class="p">$</span> <span class="k">cat</span> /proc/sys/net/ipv4/ip_forward
<span class="g">1</span>   <span class="c"># Docker turned your server into a router. This is why containers reach the Internet.</span>`, 'sm')}
      ${kv([
        ['Each compose project', 'gets its own <span class="nw-m">br-*</span> bridge and its own /16 out of 172.16–172.31'],
        ['The classic collision', 'your office LAN is 172.18.0.0/16 too → the office becomes unreachable <b>from inside the container only</b>'],
        ['The fix', 'pin the pool in <span class="nw-m">/etc/docker/daemon.json</span> with <span class="nw-m">default-address-pools</span>'],
        ['Read it as routing', 'nothing here is Docker magic — it is layer 3 doing exactly what this chapter describes'],
      ])}`,
  },

  {
    t: 'Static or dynamic — and when each is right',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Static routing</th><td>You type it. Zero CPU, zero bandwidth, completely predictable — and completely blind: if the link dies the route stays, and packets keep marching into a hole.</td></tr>
        <tr><th>Dynamic routing</th><td>Routers tell each other what they can reach. Adapts to failures in seconds, but costs CPU, bandwidth and a protocol to configure and secure.</td></tr>
        <tr><th>Use static when</th><td>there is only one way out (a stub site), or on the link to your ISP. A default route on a single-homed server is a static route, and it is the right answer.</td></tr>
        <tr><th>Use dynamic when</th><td>there is more than one path, or more than a handful of routers, or when a human typing every prefix would be the weak point.</td></tr>
      </table>
      <div class="box ok">Both end up in the same table and are chosen by the same rule: longest prefix first, then administrative distance. The <i>source</i> of a route changes nothing about how it is used.</div>`,
  },

  /* ── 7.6 / session 23 ────────────────────────────────────────────────── */
  {
    t: 'Session 23 — Review of Modules 1 to 7',
    body: `${CSS}
      ${stack([
        ['M1-3', 'Foundations', 'network components · topologies · IOS · protocols and models'],
        ['M4', 'Physical', 'copper, fibre, wireless · encoding · bandwidth vs throughput'],
        ['M6', 'Data Link', 'framing · MAC vs LLC · topologies · error detection with the FCS', true],
        ['M7', 'Ethernet', 'the frame · MAC addresses · the switch table · forwarding methods', true],
        ['M8', 'Network', 'IP characteristics · IPv4 and IPv6 headers · host and router routing', true],
      ])}
      ${kv([
        ['Note what is missing', 'Module 5 (Number Systems) is not in the 60-session plan at all'],
        ['Why that matters', 'sessions 30–34 are subnetting and VLSM, which cannot be done without binary'],
        ['Our answer', 'the make-up chapter on number systems sits before IPv4 Addressing on this site'],
      ])}`,
  },

  {
    t: 'One packet, all seven modules at once',
    body: `${CSS}
      ${flow('your laptop 10.0.0.42', 'server 93.184.216.34', [
        ['r', 'DNS query — UDP 53', 'M3 protocols'],
        ['r', 'ARP who-has 10.0.0.1', 'M7 — next chapter proper'],
        ['r', 'frame: dst MAC = router, dst IP = server', 'M7 + M8 together'],
        ['r', 'R1 rewrites the frame, TTL 64 → 63', 'M8 routing'],
        ['l', 'reply arrives, TTL 57', 'M8 — count the hops back'],
      ])}
      <div class="box ok">Every module you have studied is visible in this one exchange. If you can narrate these five lines from memory, and say which device rewrote what, you are ready for the review session and for the midterm.</div>`,
  },

  {
    t: 'Chapter 7 — what you must be able to do',
    body: `${CSS}
      ${kv([
        ['Explain', 'why IP is connectionless, best-effort and media-independent — and why each is a deliberate trade'],
        ['Name', 'every IPv4 header field, its size, and what breaks if it is wrong'],
        ['Read', 'a TTL value and say which OS sent the packet and how many hops away it is'],
        ['Say', 'exactly what IPv6 removed from the header and what the consequence is on a live network'],
        ['Decide', 'local or remote for any destination, using the mask and nothing else'],
        ['Read', 'a routing table on Linux, Windows and IOS, and predict which line a packet will match'],
        ['Apply', 'longest prefix match, then administrative distance, in that order'],
        ['★ Diagnose', 'an MTU black hole, and prove it with ping -M do'],
        ['★ Use', 'ip route get instead of guessing, and check ip rule when the answer surprises you'],
      ])}`,
  },
];
