/**
 * nwc204-ch05.mjs — NWC204 Chapter 5: The Data Link Layer
 * (FLM buổi 15–16, Cisco Module 6).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 15 và 16.
 *   buổi 15: 5.1 Purpose of the Data Link Layer
 *   buổi 16: 5.2 Topologies · 5.3 Data Link Frame · 5.4 AI tools (self learning)
 *
 * ★ = phần KHÔNG có trong Module 6 của Cisco, do cuongthai.com bổ sung để dùng
 *     được ngoài đời (duplex mismatch, 802.1Q, MTU, lệnh Linux, Docker bridge).
 *     Người học yêu cầu đánh dấu rõ phần bổ sung.
 *
 * Người học yêu cầu slide THIÊN VỀ SƠ ĐỒ: 21/27 slide ở đây là sơ đồ, SVG hoặc bảng.
 */
import { CSS, stack, pkt, topo, flow, term, kv, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch05',
  code: 'NWC204',
  title: 'Ch.5 — Data Link Layer',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: half duplex vs full duplex on one timeline ─────────────────────── */
const DUPLEX = `<svg class="nw-svg" viewBox="0 0 700 230" width="900" height="296"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="6" y="20" fill="#0f2a4a" font-size="16" font-weight="700">HALF DUPLEX — one at a time, or they collide</text>
  <text x="6" y="48" fill="#5d7288" font-size="14">A</text>
  <text x="6" y="80" fill="#5d7288" font-size="14">B</text>
  <rect x="30" y="34" width="150" height="18" fill="#1b5fa8" rx="3"/>
  <rect x="330" y="34" width="120" height="18" fill="#1b5fa8" rx="3"/>
  <rect x="200" y="66" width="110" height="18" fill="#1f9d6b" rx="3"/>
  <rect x="470" y="66" width="90" height="18" fill="#1f9d6b" rx="3"/>
  <rect x="470" y="34" width="90" height="18" fill="#d94b4b" rx="3" opacity="0.35"/>
  <text x="600" y="48" fill="#d94b4b" font-size="14" font-weight="700">collision</text>
  <line x1="30" y1="96" x2="680" y2="96" stroke="#cfe0f0" stroke-width="2"/>
  <text x="6" y="140" fill="#0f2a4a" font-size="16" font-weight="700">FULL DUPLEX — both directions at once, no collision domain</text>
  <text x="6" y="168" fill="#5d7288" font-size="14">A</text>
  <text x="6" y="200" fill="#5d7288" font-size="14">B</text>
  <rect x="30" y="154" width="230" height="18" fill="#1b5fa8" rx="3"/>
  <rect x="300" y="154" width="260" height="18" fill="#1b5fa8" rx="3"/>
  <rect x="30" y="186" width="180" height="18" fill="#1f9d6b" rx="3"/>
  <rect x="240" y="186" width="320" height="18" fill="#1f9d6b" rx="3"/>
  <text x="600" y="180" fill="#1f9d6b" font-size="14" font-weight="700">CSMA/CD off</text>
</svg>`;

/* ── SVG: what the FCS covers and what it does not ───────────────────────── */
const FCS = `<svg class="nw-svg" viewBox="0 0 700 200" width="900" height="257"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <rect x="20" y="40" width="80" height="44" fill="#f2f7fd" stroke="#6b8199" stroke-width="2"/>
  <text x="60" y="67" font-size="14" text-anchor="middle" fill="#5d7288">Preamble</text>
  <rect x="100" y="40" width="330" height="44" fill="#eaf3fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="265" y="60" font-size="15" text-anchor="middle" fill="#0f2a4a" font-weight="700">MAC dst · MAC src · Type · Payload</text>
  <text x="265" y="78" font-size="13" text-anchor="middle" fill="#5d7288">every one of these bits goes into the CRC</text>
  <rect x="430" y="40" width="90" height="44" fill="#fff5d6" stroke="#b4690e" stroke-width="2.5"/>
  <text x="475" y="67" font-size="15" text-anchor="middle" fill="#7a4708" font-weight="800">FCS (4 B)</text>
  <path d="M100,92 L100,110 L430,110 L430,92" fill="none" stroke="#1b5fa8" stroke-width="2"/>
  <text x="265" y="128" font-size="15" text-anchor="middle" fill="#1b5fa8" font-weight="700">CRC-32 computed over this range</text>
  <text x="265" y="148" font-size="14" text-anchor="middle" fill="#5d7288">sender writes it · receiver recomputes it</text>
  <text x="20" y="176" font-size="15" fill="#1f9d6b" font-weight="700">match → hand the packet up</text>
  <text x="300" y="176" font-size="15" fill="#d94b4b" font-weight="700">mismatch → drop it, and tell nobody</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'The Data Link Layer',
    sub: 'Chapter 5 — Cisco Module 6',
    body: `<div class="cov-meta">Sessions 15–16 of 60 · CLO2, CLO4, CLO9<br>
      5.1 Purpose of the Data Link Layer · 5.2 Topologies<br>
      5.3 Data Link Frame · 5.4 AI tools for explaining concepts<br>
      ★ marks material added by cuongthai.com, beyond Cisco Module 6</div>`,
  },

  /* ── 5.1 Purpose ─────────────────────────────────────────────────────── */
  {
    t: 'Where the frame lives',
    body: `${CSS}
      ${stack([
        ['L4', 'Application', 'data — an HTTP GET'],
        ['L3', 'Transport', 'segment — ports added'],
        ['L2', 'Internet', 'packet — IP addresses added'],
        ['L1', 'Network Access', 'FRAME — MAC addresses + FCS, then bits', true],
      ])}
      ${kv([
        ['Chapter 4 ended', 'with a frame handed down to the wire'],
        ['Chapter 5 asks', 'who built that frame, and by what rules'],
        ['One sentence', 'layer 2 moves a packet across ONE link, and no further'],
      ])}`,
  },

  {
    t: 'Four jobs, and nothing else',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><b>Encapsulate</b> — wrap the layer-3 packet in a header and a trailer, making a frame.</span></div>
        <div><span class="n">2</span><span><b>Address locally</b> — write the MAC of this hop's sender and this hop's receiver.</span></div>
        <div><span class="n">3</span><span><b>Control media access</b> — decide who is allowed to transmit, and when.</span></div>
        <div><span class="n">4</span><span><b>Detect errors</b> — add an FCS so the receiver can throw away a damaged frame.</span></div>
      </div>
      <div class="box warn">Detect, not correct. Ethernet never resends a broken frame — it drops it and says nothing. Recovery is TCP's problem, four layers up.</div>`,
  },

  {
    t: 'Two sublayers: LLC and MAC',
    body: `${CSS}
      <div class="dg">
        <div class="bx ext">Layer 3<br><small>IPv4 / IPv6 packet</small></div>
        <div class="ar">↓</div>
        <div class="bx st">LLC — IEEE 802.2<br><small>which L3 protocol is inside?</small></div>
        <div class="ar">↓</div>
        <div class="bx">MAC — 802.3 / 802.11<br><small>framing · addressing · FCS · media access</small></div>
        <div class="ar">↓</div>
        <div class="bx ext">Layer 1<br><small>bits</small></div>
      </div>
      ${kv([
        ['LLC (upper)', 'talks to the software above. Same code whether the wire is copper, fibre or radio.'],
        ['MAC (lower)', 'talks to the hardware below. Different for Ethernet (802.3) and Wi-Fi (802.11).'],
        ['Why split', 'IP had to be written once, not once per medium.'],
      ])}`,
  },

  {
    t: 'One packet, three different frames',
    body: `${CSS}
      ${topo([
        'nd.cl:PC-A|',
        'lk:frame #1|Ethernet',
        'nd.rt:R1|',
        'lk:frame #2|PPP',
        'nd.rt:R2|',
        'lk:frame #3|802.11',
        'nd.cl:PC-B|',
      ])}
      ${kv([
        ['frame #1', 'Ethernet — src MAC of PC-A, dst MAC of R1'],
        ['frame #2', 'PPP — no addresses at all, the link has only two ends'],
        ['frame #3', 'Wi-Fi 802.11 — src MAC of R2, dst MAC of PC-B'],
      ])}
      <div class="box ok">The IP packet inside is <b>byte for byte the same</b> at every step. The frame around it is built, stripped and rebuilt at every single hop.</div>
`,
  },

  {
    t: 'A MAC address never leaves its link',
    body: `${CSS}
      <div class="lanes">
        <div class="row"><div class="who">Layer 3</div><div class="acts">
          <span class="a">src 192.168.1.10</span><span class="x">→</span><span class="a">dst 8.8.8.8</span>
          <span class="d">unchanged end to end</span></div></div>
        <div class="row"><div class="who">Hop 1 (L2)</div><div class="acts">
          <span class="a">src aa:aa (PC)</span><span class="x">→</span><span class="a">dst bb:bb (router)</span></div></div>
        <div class="row"><div class="who">Hop 2 (L2)</div><div class="acts">
          <span class="a">src cc:cc (router)</span><span class="x">→</span><span class="a">dst dd:dd (next router)</span>
          <span class="d">rewritten</span></div></div>
      </div>
      <div class="box">You cannot route to a MAC, and you cannot ping one. If a device is not on your link, its MAC address is a fact you will never learn.</div>`,
  },

  {
    t: 'Who writes these rules',
    body: `${CSS}
      <table class="t">
        <tr><th>Body</th><th>Standard</th><th>What you meet it as</th></tr>
        <tr><td class="hl">IEEE</td><td>802.2 · 802.3 · 802.11</td><td>LLC · Ethernet · Wi-Fi</td></tr>
        <tr><td class="hl">ITU-T</td><td>G.992 · Q.922</td><td>DSL · Frame Relay</td></tr>
        <tr><td class="hl">ISO</td><td>ISO 13239 · ISO 7498</td><td>HDLC · the seven-layer model itself</td></tr>
        <tr><td class="hl">ANSI</td><td>X3T9.5</td><td>FDDI (legacy fibre ring)</td></tr>
      </table>
      <p class="note">IEEE numbers are worth memorising: <b>802.3</b> is the cable, <b>802.11</b> is the air, <b>802.1Q</b> is the VLAN tag. Those three cover almost everything you will touch.</p>`,
  },

  /* ── 5.2 Topologies ──────────────────────────────────────────────────── */
  {
    t: 'Physical topology vs logical topology',
    body: `${CSS}
      <div class="two">
        <div>
          <p class="note"><b>Physical</b> — where the cables actually run.</p>
          ${topo(['nd.cl:PC1|', 'lk:', 'nd:Switch|', 'lk:', 'nd.cl:PC2|'])}
        </div>
        <div>
          <p class="note"><b>Logical</b> — how frames actually reach each other.</p>
          ${topo(['nd.cl:PC1|', 'lk:direct, full duplex|the switch is invisible', 'nd.cl:PC2|'])}
        </div>
      </div>
      <div class="box warn">They are allowed to disagree, and often do. A VPN is one cable physically and a straight point-to-point link logically; a Wi-Fi cell is a star physically and a shared bus logically.</div>`,
  },

  {
    t: 'WAN topologies',
    body: `${CSS}
      <div class="grid3">
        <div class="card"><b>Point-to-point</b><p>Two nodes, one link. Simplest, and the only one with no media-access question to answer.</p></div>
        <div class="card"><b>Hub and spoke</b><p>One central site, many branches. Cheap. The centre is a single point of failure.</p></div>
        <div class="card"><b>Mesh</b><p>Every site to every site: n(n−1)/2 links. Survives anything, costs accordingly.</p></div>
      </div>
      <table class="t">
        <tr><th>Sites</th><th>Hub and spoke</th><th>Full mesh</th></tr>
        <tr><td>5</td><td>4 links</td><td class="hl">10 links</td></tr>
        <tr><td>10</td><td>9 links</td><td class="hl">45 links</td></tr>
      </table>`,
  },

  {
    t: 'LAN topologies',
    body: `${CSS}
      <div class="grid3">
        <div class="card"><b>Star</b><p>Every host to a central switch. What every office actually is today.</p></div>
        <div class="card"><b>Extended star</b><p>Stars of stars — access switches into a distribution switch.</p></div>
        <div class="card"><b>Bus / Ring</b><p>Legacy. One shared coax, or a closed loop. Study them to understand CSMA/CD and token passing.</p></div>
      </div>
      <div class="box ok">Star won for one reason: on a switch, each port is its own collision domain, so the whole contention problem below simply disappears.</div>`,
  },

  {
    t: 'Half duplex and full duplex',
    body: `${CSS}${DUPLEX}
      ${kv([
        ['Half duplex', 'shared medium — a hub, or any radio. Must run CSMA/CD or CSMA/CA.'],
        ['Full duplex', 'switched port — transmit and receive pairs are separate. Collision detection is switched off.'],
      ])}`,
  },

  {
    t: '★ Duplex mismatch: the 3 MB/s ghost',
    body: `${term(`<span class="c"># the link is "up", ping is fine, the copy crawls</span>
<span class="p">$</span> <span class="k">ethtool</span> eth0 | grep -E 'Speed|Duplex'
   Speed: 100Mb/s
   Duplex: <span class="r">Half</span>          <span class="c">← the other end is Full</span>

<span class="p">$</span> <span class="k">ip</span> -s link show eth0
   RX: bytes  packets  errors  dropped
   ...                 <span class="r">18452</span>      0      <span class="c">← late collisions, climbing</span>`)}
      <div class="box warn">One end auto-negotiated, the other was nailed to full duplex by hand. The full-duplex end transmits whenever it likes; the half-duplex end calls that a collision. Nothing goes down, throughput falls by 20×, and no log mentions it.</div>`,
  },

  {
    t: 'Media access control: one question',
    body: `${CSS}
      <div class="dg">
        <div class="dia">Is the medium shared?</div>
        <div class="ar">no<small>switched, full duplex</small></div>
        <div class="bx st">Just transmit.<br><small>No method needed</small></div>
      </div>
      <div class="dg">
        <div class="ar">↓ yes</div>
        <div class="bx">Contention-based<br><small>CSMA/CD · CSMA/CA</small></div>
        <div class="ar">or</div>
        <div class="bx ext">Controlled<br><small>token passing · polling</small></div>
      </div>
      ${kv([
        ['Contention', 'anyone may try; sort out the crashes afterwards. Efficient when quiet.'],
        ['Controlled', 'wait your turn, always. Predictable, and wasteful when quiet.'],
      ])}`,
  },

  {
    t: 'CSMA/CD — detect the crash',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><b>Carrier sense</b> — listen. Busy? wait.</span></div>
        <div><span class="n">2</span><span><b>Transmit</b> — and keep listening to your own signal.</span></div>
        <div><span class="n">3</span><span><b>Collision detected</b> — the voltage is not what you sent.</span></div>
        <div><span class="n">4</span><span><b>Jam signal</b> — 32 bits, so every station is sure a collision happened.</span></div>
        <div><span class="n">5</span><span><b>Random backoff</b> — wait k × 51.2 µs, k random in 0…2ⁿ−1, then retry. Give up after 16 tries.</span></div>
      </div>
      <p class="note">Ethernet only. Needs a shared, half-duplex medium — which in 2026 means a hub, and hubs are museum pieces. Modern switch ports never run this.</p>`,
  },

  {
    t: 'CSMA/CA — avoid it instead',
    body: `${CSS}
      ${flow('Station', 'Access point', [
        ['r', 'RTS — may I send 1500 bytes?', 'sent only after the air was idle for DIFS + a random backoff'],
        ['l', 'CTS — yes, everyone else be quiet', 'reserves the air'],
        ['r', 'DATA frame', ''],
        ['l', 'ACK', 'no ACK = assume lost, resend'],
      ])}
      <div class="box warn">A radio cannot hear anything while its own transmitter is on, so Wi-Fi <b>cannot detect</b> a collision — it can only try to avoid one, and confirm with an ACK afterwards. That ACK is why Wi-Fi throughput is roughly half its headline rate.</div>`,
  },

  {
    t: 'Controlled access: token passing',
    body: `${CSS}
      ${topo([
        'nd.cl:A|holds the token',
        'lk:→',
        'nd.cl:B|waits',
        'lk:→',
        'nd.cl:C|waits',
        'lk:→ back to A',
      ])}
      ${kv([
        ['Rule', 'only the holder of the token may transmit. Then it passes the token on.'],
        ['Good', 'zero collisions, and a worst-case delay you can actually calculate.'],
        ['Bad', 'a station with nothing to say still costs a turn. Ethernet beat it on price and simplicity.'],
        ['Where it survives', 'industrial and avionics buses, where "predictable" outranks "fast".'],
      ])}`,
  },

  /* ── 5.3 The frame ───────────────────────────────────────────────────── */
  {
    t: 'The generic frame',
    body: `${CSS}
      ${pkt([
        ['Start', 'flag / preamble', '', 1],
        ['Addressing', 'dst + src', 'hl', 1.4],
        ['Type', 'what is inside', '', 1],
        ['Control', 'flow / QoS', '', 1],
        ['DATA', 'the L3 packet', 'pay', 2.6],
        ['FCS', 'error check', 'hl', 1],
        ['Stop', 'flag', '', 0.8],
      ])}
      ${kv([
        ['Header', 'start · addressing · type · control'],
        ['Data', 'the packet from layer 3, untouched'],
        ['Trailer', 'FCS, and on some protocols a stop flag'],
        ['Only the trailer', 'is written AFTER the data — it is computed from it'],
      ])}`,
  },

  {
    t: 'Frame fields, one by one',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Field</th><td>What it answers</td></tr>
        <tr><th>Frame start/stop</th><td>Where does this frame begin and end in a stream of bits?</td></tr>
        <tr><th>Addressing</th><td>Which node on THIS link sent it, and which should read it?</td></tr>
        <tr><th>Type</th><td>Which layer-3 protocol is inside — IPv4, IPv6, ARP?</td></tr>
        <tr><th>Control</th><td>Quality of service, flow control. Often unused on Ethernet.</td></tr>
        <tr><th>Data</th><td>The packet. Layer 2 never looks inside it.</td></tr>
        <tr><th>Error detection</th><td>Did any bit change on the way? (FCS)</td></tr>
      </table>`,
  },

  {
    t: 'FCS — what it checks, and what it does not',
    body: `${CSS}${FCS}
      <div class="box warn">Rising CRC errors on a switch port is a <b>cable, connector or interference</b> story, never a software one. It is one of the very few counters that names its own cause.</div>`,
  },

  {
    t: 'The Ethernet II frame, in real bytes',
    body: `${CSS}
      ${pkt([
        ['Preamble+SFD', '8 B', '', 1.1],
        ['Dst MAC', '6 B', 'hl', 1],
        ['Src MAC', '6 B', 'hl', 1],
        ['Type', '2 B', '', 0.8],
        ['Payload', '46 – 1500 B', 'pay', 2.6],
        ['FCS', '4 B', 'hl', 0.8],
      ])}
      ${kv([
        ['Frame size', '64 B minimum, 1518 B maximum — the preamble is not counted'],
        ['Why 46 minimum', 'a 64-byte floor kept CSMA/CD able to hear a collision before finishing; short payloads are padded'],
        ['Type values', '0x0800 = IPv4 · 0x86DD = IPv6 · 0x0806 = ARP'],
      ])}`,
  },

  {
    t: '★ 802.1Q — where the VLAN tag goes',
    body: `${CSS}
      ${pkt([
        ['Dst MAC', '6 B', '', 1],
        ['Src MAC', '6 B', '', 1],
        ['802.1Q TAG', '4 B', 'hl', 1.2],
        ['Type', '2 B', '', 0.7],
        ['Payload', '46 – 1500 B', 'pay', 2.4],
        ['FCS', '4 B', '', 0.7],
      ])}
      ${kv([
        ['TPID = 0x8100', 'tells the receiver "a tag follows, do not read this as a type"'],
        ['VID, 12 bits', 'the VLAN number: 1 – 4094, which is where that ceiling comes from'],
        ['Max frame', '1518 → 1522 bytes. Old gear that rejects 1522 shows "baby giant" errors.'],
      ])}
      <p class="note">★ Not in Module 6 — but the tag lives in this frame, so this is where it belongs. VLANs themselves come in Chapter 6.</p>`,
  },

  {
    t: 'Same idea, different fields',
    body: `${CSS}
      <table class="t">
        <tr><th>Protocol</th><th>Where</th><th>Addressing</th><th>Note</th></tr>
        <tr><td class="hl">Ethernet 802.3</td><td>LAN</td><td>48-bit MAC ×2</td><td>What you meet 95% of the time</td></tr>
        <tr><td class="hl">802.11</td><td>WLAN</td><td>up to 4 MAC fields</td><td>Needs the AP's address too</td></tr>
        <tr><td class="hl">PPP</td><td>WAN serial</td><td>none needed</td><td>Point-to-point: only one possible receiver</td></tr>
        <tr><td class="hl">HDLC</td><td>WAN serial</td><td>1 address byte</td><td>Cisco's default on serial links</td></tr>
      </table>
      <div class="box ok">PPP carries no address at all. On a link with exactly two ends, "who is this for" is not a question worth asking — which is the clearest proof that layer-2 addressing exists only to pick one neighbour out of many.</div>`,
  },

  {
    t: '★ MTU — the ceiling on the payload',
    body: `${CSS}
      ${pkt([
        ['Ethernet header', '14 B', '', 1],
        ['IP header', '20 B', '', 1],
        ['TCP header', '20 B', '', 1],
        ['Your data', 'MSS = 1460 B', 'pay', 3],
        ['FCS', '4 B', '', 0.6],
      ])}
      ${kv([
        ['MTU 1500', 'the largest payload a standard Ethernet frame will carry'],
        ['MSS 1460', '1500 − 20 (IP) − 20 (TCP). This is what TCP announces in the handshake.'],
        ['Jumbo 9000', 'storage and backup networks. Every device on the path must agree, or frames vanish.'],
        ['WireGuard 1420', 'the tunnel header eats 80 bytes, so the inner MTU must come down'],
      ])}`,
  },

  {
    t: '★ Wrong MTU: ping works, ssh hangs',
    body: `${term(`<span class="p">$</span> <span class="k">ping</span> -c1 10.8.0.1              <span class="c"># 64 bytes: sails through</span>
   64 bytes from 10.8.0.1: time=12.4 ms

<span class="p">$</span> <span class="k">ping</span> -M do -s 1472 10.8.0.1    <span class="c"># 1472+28 = exactly 1500</span>
   <span class="r">ping: local error: message too long, mtu=1420</span>

<span class="p">$</span> <span class="k">ssh</span> server                       <span class="c"># banner appears, then dead</span>
   <span class="g">SSH-2.0-OpenSSH_9.6</span>
   <span class="c">^C  — the first full-size packet never arrives</span>

<span class="p">$</span> <span class="k">sudo ip</span> link set dev wg0 mtu 1420   <span class="c"># fixed</span>`, 'sm')}
      <div class="box warn">Small packets fit, large ones do not, and the ICMP that would have said so was dropped by a firewall. Every symptom points at "the server", and the fault is one number on your own interface.</div>`,
  },

  {
    t: '★ Layer 2 on your own Linux server',
    body: `${term(`<span class="p">$</span> <span class="k">ip</span> -br link                   <span class="c"># state, MAC, MTU</span>
   eth0  <span class="g">UP</span>  52:54:00:a1:b2:c3  <span class="k">mtu 1500</span>
   wg0   <span class="g">UNKNOWN</span>               <span class="k">mtu 1420</span>

<span class="p">$</span> <span class="k">ip</span> neigh                      <span class="c"># the ARP cache = IP ↔ MAC on THIS link</span>
   192.168.1.1 dev eth0 lladdr 00:1a:2b:3c:4d:5e <span class="g">REACHABLE</span>
   192.168.1.77 dev eth0 <span class="r">FAILED</span>      <span class="c">← nobody answered</span>

<span class="p">$</span> <span class="k">ethtool</span> -S eth0 | grep -i crc
   rx_crc_errors: <span class="g">0</span>                 <span class="c">← anything above 0 = a cable story</span>`, 'sm')}
      <p class="note">★ Cisco Module 6 teaches the theory on IOS. These four commands are the same theory on the machine you actually pay for.</p>`,
  },

  {
    t: '★ A Docker bridge is a switch in software',
    body: `${CSS}
      ${topo([
        'nd.cl:container|eth0 · 172.17.0.2',
        'lk:veth pair|virtual cable',
        'nd:docker0|a real L2 bridge',
        'lk:NAT|iptables',
        'nd.cl:eth0|the host',
      ])}
      ${term(`<span class="p">$</span> <span class="k">bridge</span> fdb show br docker0 | head -3
   02:42:ac:11:00:02 dev veth3f2a <span class="g">master docker0</span>
   <span class="c"># that is a MAC address table — the same one Chapter 6 teaches on a switch</span>`, 'sm')}
      <p class="note">★ Every container you deploy is a host on a tiny Ethernet LAN living inside your server. Chapter 6 is not abstract: it is running on your VPS right now.</p>`,
  },

  {
    t: 'Self-check — what to run, what it proves',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Command</th><td>Healthy → / Suspicious →</td></tr>
        <tr><th>ip -br link</th><td><b>UP</b> with a MAC → the link exists · <b>NO-CARRIER</b> → layer 1, go back to Ch.4</td></tr>
        <tr><th>ethtool eth0</th><td><b>1000Mb/s, Full</b> → fine · <b>Half</b> on a switch port → duplex mismatch</td></tr>
        <tr><th>ethtool -S | grep crc</th><td><b>0</b> → clean · <b>rising</b> → cable, connector or interference</td></tr>
        <tr><th>ip neigh</th><td><b>REACHABLE</b> → the neighbour answers at L2 · <b>FAILED</b> → it is not on this link</td></tr>
        <tr><th>ping -M do -s 1472</th><td><b>reply</b> → MTU 1500 is real · <b>message too long</b> → an MTU ceiling exists</td></tr>
      </table>`,
  },
];
