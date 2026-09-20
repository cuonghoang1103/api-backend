/**
 * nwc204-ch06.mjs — NWC204 Chapter 6: Ethernet Switching
 * (FLM buổi 17–18 lý thuyết + buổi 19–20 Lab 1.4, Cisco Module 7).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 17, 18, 19, 20.
 *   buổi 17: 6.1 Ethernet Frame · 6.2 Ethernet MAC Address
 *   buổi 18: 6.3 The MAC Address Table · 6.4 Switch Speeds and Forwarding Methods
 *   buổi 19–20: Lab 1.4 — Wireshark, xem MAC thiết bị, xem bảng MAC của switch
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 7: bit I/G và U/L, tấn công làm
 *     tràn bảng MAC + port-security, làm lại Lab 1.4 trên Linux/Docker không cần
 *     Packet Tracer.
 *
 * 26 slide, 21 trong số đó là sơ đồ, SVG, bảng hoặc terminal.
 */
import { CSS, stack, pkt, topo, flow, term, kv, bits, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch06',
  code: 'NWC204',
  title: 'Ch.6 — Ethernet Switching',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: store-and-forward vs cut-through, on one time axis ─────────────── */
const FWD = `<svg class="nw-svg" viewBox="0 0 700 215" width="900" height="277"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="6" y="18" fill="#0f2a4a" font-size="15" font-weight="700">STORE-AND-FORWARD — read all 1518 bytes, check the FCS, then send</text>
  <rect x="30" y="28" width="470" height="20" fill="#1b5fa8" rx="3"/>
  <text x="265" y="43" fill="#fff" font-size="13" text-anchor="middle">receiving the whole frame</text>
  <rect x="500" y="28" width="60" height="20" fill="#b4690e" rx="3"/>
  <text x="530" y="43" fill="#fff" font-size="12" text-anchor="middle">FCS</text>
  <rect x="560" y="28" width="110" height="20" fill="#1f9d6b" rx="3"/>
  <text x="615" y="43" fill="#fff" font-size="12" text-anchor="middle">forward</text>
  <text x="30" y="68" fill="#5d7288" font-size="13">latency = whole frame · bad frames are never forwarded</text>
  <line x1="30" y1="82" x2="670" y2="82" stroke="#cfe0f0" stroke-width="2"/>
  <text x="6" y="108" fill="#0f2a4a" font-size="15" font-weight="700">CUT-THROUGH (fast-forward) — read 6 bytes of destination MAC, then send</text>
  <rect x="30" y="118" width="70" height="20" fill="#1b5fa8" rx="3"/>
  <text x="65" y="133" fill="#fff" font-size="11" text-anchor="middle">dst MAC</text>
  <rect x="100" y="118" width="300" height="20" fill="#1f9d6b" rx="3"/>
  <text x="250" y="133" fill="#fff" font-size="12" text-anchor="middle">already forwarding while still receiving</text>
  <text x="30" y="158" fill="#5d7288" font-size="13">lowest latency · a corrupt frame is forwarded too — nobody checked</text>
  <text x="6" y="188" fill="#0f2a4a" font-size="15" font-weight="700">FRAGMENT-FREE — wait for 64 bytes (the collision window), then send</text>
  <rect x="30" y="196" width="130" height="16" fill="#1b5fa8" rx="3"/>
  <text x="95" y="208" fill="#fff" font-size="11" text-anchor="middle">first 64 bytes</text>
  <rect x="160" y="196" width="250" height="16" fill="#1f9d6b" rx="3"/>
  <text x="285" y="208" fill="#fff" font-size="11" text-anchor="middle">forward — catches runts only</text>
</svg>`;

/* ── SVG: the 48-bit MAC address, split ──────────────────────────────────── */
const MAC = `<svg class="nw-svg" viewBox="0 0 700 180" width="920" height="231"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <rect x="40" y="30" width="300" height="46" fill="#eaf3fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <rect x="340" y="30" width="300" height="46" fill="#fff5d6" stroke="#b4690e" stroke-width="2.5"/>
  <text x="190" y="60" font-size="22" text-anchor="middle" fill="#0f2a4a" font-weight="800">00 : 1A : 2B</text>
  <text x="490" y="60" font-size="22" text-anchor="middle" fill="#7a4708" font-weight="800">3C : 4D : 5E</text>
  <text x="190" y="96" font-size="15" text-anchor="middle" fill="#1b5fa8" font-weight="700">OUI — 24 bits</text>
  <text x="190" y="114" font-size="13" text-anchor="middle" fill="#5d7288">bought from IEEE by the vendor</text>
  <text x="490" y="96" font-size="15" text-anchor="middle" fill="#b4690e" font-weight="700">device ID — 24 bits</text>
  <text x="490" y="114" font-size="13" text-anchor="middle" fill="#5d7288">assigned by that vendor, 16.7 M per OUI</text>
  <g stroke="#d94b4b" stroke-width="2">
    <line x1="70" y1="24" x2="70" y2="14"/><line x1="70" y1="14" x2="150" y2="14"/>
  </g>
  <text x="155" y="18" font-size="13" fill="#d94b4b" font-weight="700">first byte carries two flag bits: I/G and U/L</text>
  <text x="40" y="150" font-size="14" fill="#5d7288">48 bits = 12 hex digits · burned into the NIC, and changeable in one command</text>
  <text x="40" y="170" font-size="14" fill="#1f9d6b" font-weight="700">00:1A:2B:3C:4D:5E · 00-1A-2B-3C-4D-5E · 001A.2B3C.4D5E — the same address</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'Ethernet Switching',
    sub: 'Chapter 6 — Cisco Module 7',
    body: `<div class="cov-meta">Sessions 17–18 (theory) + 19–20 (Lab 1.4) of 60 · CLO2, CLO4, CLO9<br>
      6.1 Ethernet Frame · 6.2 Ethernet MAC Address<br>
      6.3 The MAC Address Table · 6.4 Switch Speeds and Forwarding Methods<br>
      Lab 1.4 — Wireshark, device MAC addresses, the switch MAC table<br>
      ★ marks material added by cuongthai.com, beyond Cisco Module 7</div>`,
  },

  /* ── 6.1 The Ethernet frame ──────────────────────────────────────────── */
  {
    t: 'Ethernet is layer 1 and layer 2 together',
    body: `${CSS}
      ${stack([
        ['L3', 'Network', 'IPv4 / IPv6 packet — Ethernet never reads it'],
        ['L2', 'LLC 802.2', 'which protocol is inside (EtherType in practice)'],
        ['L2', 'MAC 802.3', 'framing · MAC addressing · FCS · access control', true],
        ['L1', 'PHY 802.3', 'copper, fibre, the 100 m rule — Chapter 4'],
      ])}
      ${kv([
        ['IEEE 802.3', 'defines BOTH the physical layer and the MAC sublayer'],
        ['That is why', 'Ethernet standards are named for the medium: 1000BASE-T, 10GBASE-SR'],
        ['Chapter 5 gave the rules', 'Chapter 6 gives the one protocol that actually implements them'],
      ])}`,
  },

  {
    t: 'The Ethernet frame, byte by byte',
    body: `${CSS}
      ${pkt([
        ['Preamble', '7 B', '', 1],
        ['SFD', '1 B', '', 0.6],
        ['Dst MAC', '6 B', 'hl', 1],
        ['Src MAC', '6 B', 'hl', 1],
        ['Type/Len', '2 B', '', 0.8],
        ['Data + pad', '46 – 1500 B', 'pay', 2.6],
        ['FCS', '4 B', 'hl', 0.7],
      ])}
      ${kv([
        ['Preamble + SFD', '10101010 × 7, then 10101011 — a clock-sync pattern, not part of the frame'],
        ['Type ≥ 0x0600', 'it is an EtherType: 0x0800 IPv4 · 0x86DD IPv6 · 0x0806 ARP'],
        ['Type &lt; 0x0600', 'it is a LENGTH instead — the original 802.3 format, now rare'],
        ['Pad', 'added by the NIC when the payload is under 46 bytes'],
      ])}`,
  },

  {
    t: 'Runts, giants and everything legal between',
    body: `${CSS}
      <table class="t">
        <tr><th>Frame size</th><th>Name</th><th>What it means</th></tr>
        <tr><td>&lt; 64 B</td><td class="hl">Runt</td><td>Dropped. A collision remnant, or a faulty NIC.</td></tr>
        <tr><td>64 – 1518 B</td><td class="hl">Legal</td><td>Processed normally.</td></tr>
        <tr><td>1519 – 1522 B</td><td class="hl">Baby giant</td><td>Legal only if the switch understands 802.1Q tags.</td></tr>
        <tr><td>&gt; 1522 B</td><td class="hl">Giant / jumbo</td><td>Dropped unless jumbo frames are enabled everywhere.</td></tr>
      </table>
      <div class="box warn">Both ends of the decision are silent: a runt and a giant are discarded with no message, and only a counter moves. <span class="nw-m">show interfaces</span> on IOS, <span class="nw-m">ip -s link</span> on Linux.</div>`,
  },

  /* ── 6.2 MAC addresses ───────────────────────────────────────────────── */
  { t: 'What a MAC address is made of', body: `${CSS}${MAC}` },

  {
    t: 'Two flag bits hiding in the first byte',
    body: `${CSS}${bits('00000000', 'First byte of 00:1A:2B:3C:4D:5E — both flags are 0: a unicast, globally unique address')}
      ${kv([
        ['I/G bit — the LAST bit of the first byte', '0 = unicast, one recipient · 1 = multicast or broadcast'],
        ['★ U/L bit — the one before it', '0 = globally unique, from an IEEE-assigned OUI · 1 = locally administered'],
        ['Why it matters', 'every virtual machine, container and bonded interface gets a locally administered MAC — the U/L bit is how you tell software-made addresses from hardware ones'],
      ])}`,
  },

  {
    t: 'Three kinds of destination',
    body: `${CSS}
      <table class="t">
        <tr><th>Type</th><th>Destination MAC</th><th>Who processes it</th></tr>
        <tr><td class="hl">Unicast</td><td>the target's own address</td><td>one host; the switch sends it out one port</td></tr>
        <tr><td class="hl">Broadcast</td><td>FF:FF:FF:FF:FF:FF</td><td>every host on the LAN; the switch floods it everywhere</td></tr>
        <tr><td class="hl">Multicast</td><td>01:00:5E:xx:xx:xx (IPv4)<br>33:33:xx:xx:xx:xx (IPv6)</td><td>only the hosts that joined that group</td></tr>
      </table>
      ${kv([
        ['ARP is a broadcast', 'which is why an ARP request reaches every machine on your LAN, and why a big flat LAN is a slow LAN'],
        ['Multicast MACs are derived', 'the last 23 bits of an IPv4 multicast address are copied straight into the MAC'],
      ])}`,
  },

  {
    t: 'A frame arrives: what the NIC decides',
    body: `${CSS}
      <div class="dg">
        <div class="dia">Destination MAC<br>= mine?</div>
        <div class="ar">yes</div>
        <div class="bx st">Accept<br><small>pass up to layer 3</small></div>
      </div>
      <div class="dg">
        <div class="ar">↓ no</div>
        <div class="dia">Broadcast or<br>a joined multicast?</div>
        <div class="ar">yes</div>
        <div class="bx st">Accept</div>
        <div class="ar">no</div>
        <div class="bx ext">Discard<br><small>silently, in hardware</small></div>
      </div>
      <p class="note">Unless the interface is in <strong>promiscuous mode</strong>, which is exactly what Wireshark turns on in Lab 1.4 — and the reason a capture on a switched port still shows you so little.</p>`,
  },

  /* ── 6.3 The MAC address table ───────────────────────────────────────── */
  {
    t: 'How a switch learns, in one rule',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span>A frame arrives on port Fa0/1 with <b>source</b> MAC aa:aa.</span></div>
        <div><span class="n">2</span><span>The switch writes <b>aa:aa → Fa0/1</b> into its MAC address table.</span></div>
        <div><span class="n">3</span><span>It now looks up the <b>destination</b> MAC in that same table.</span></div>
        <div><span class="n">4</span><span>Found → send out that one port. Not found → send out <b>every</b> port except the one it came from.</span></div>
      </div>
      <div class="box ok">The switch learns from the <strong>source</strong> address and decides on the <strong>destination</strong> address. Two different fields, two different jobs — this one sentence is the whole of switching.</div>`,
  },

  {
    t: 'The table filling up, frame by frame',
    body: `${CSS}
      ${topo([
        'nd.cl:PC-A|aa:aa · Fa0/1',
        'lk:',
        'nd:Switch|learns as it goes',
        'lk:',
        'nd.cl:PC-B|bb:bb · Fa0/2',
      ])}
      <table class="t">
        <tr><th>Event</th><th>Table after it</th><th>What the switch did</th></tr>
        <tr><td>A → B, first frame</td><td>aa:aa → Fa0/1</td><td class="hl">FLOOD — B is unknown</td></tr>
        <tr><td>B replies to A</td><td>aa:aa → Fa0/1<br>bb:bb → Fa0/2</td><td>FORWARD to Fa0/1 only</td></tr>
        <tr><td>A → B again</td><td>unchanged</td><td>FORWARD to Fa0/2 only</td></tr>
      </table>
      <p class="note">Only the very first frame of a conversation is ever flooded. From the reply onwards the switch is silent everywhere else.</p>`,
  },

  {
    t: 'Forward, flood, filter',
    body: `${CSS}
      <div class="dg">
        <div class="dia">Destination in<br>the table?</div>
        <div class="ar">yes, other port</div>
        <div class="bx st">FORWARD<br><small>one port only</small></div>
      </div>
      <div class="dg">
        <div class="ar">↓ no</div>
        <div class="bx">FLOOD<br><small>all ports but the source</small></div>
        <div class="ar">or</div>
        <div class="dia">same port it<br>arrived on?</div>
        <div class="ar">→</div>
        <div class="bx ext">FILTER<br><small>drop it, both hosts are on that side</small></div>
      </div>
      ${kv([
        ['Broadcast and unknown unicast', 'are both flooded — they look identical to the switch'],
        ['Filtering', 'is why adding a second switch does not duplicate local traffic'],
      ])}`,
  },

  {
    t: 'Aging: the table forgets on purpose',
    body: `${CSS}
      ${term(`Switch# <span class="k">show mac address-table</span>
          Mac Address Table
<span class="c">-------------------------------------------</span>
Vlan    Mac Address       Type       Ports
----    -----------       ----       -----
   1    001a.2b3c.4d5e    <span class="g">DYNAMIC</span>    Fa0/1
   1    0050.56aa.bb01    <span class="g">DYNAMIC</span>    Fa0/2
   1    0800.27cc.dd02    <span class="k">STATIC</span>     Fa0/24

Switch# <span class="k">show mac address-table aging-time</span>
Global Aging Time: <span class="k">300</span>`)}
      ${kv([
        ['300 seconds', 'the Cisco default. A dynamic entry unused for five minutes is deleted.'],
        ['Why forget at all', 'so that moving a laptop to another port works within five minutes instead of never'],
        ['STATIC entries', 'never age out — set by hand, or by port-security'],
      ])}`,
  },

  {
    t: 'Collision domain is not broadcast domain',
    body: `${CSS}
      ${topo([
        'nd.cl:PC-A|',
        'lk:1 collision<br>domain',
        'nd:Switch|',
        'lk:1 collision<br>domain',
        'nd.cl:PC-B|',
        'lk:',
        'nd.rt:Router|the boundary',
      ])}
      ${kv([
        ['Collision domain', 'one per SWITCH PORT. A 24-port switch has 24 of them, and each is full duplex, so collisions never happen.'],
        ['Broadcast domain', 'one per VLAN. Every port in VLAN 1 hears every broadcast in VLAN 1, across as many switches as you cable together.'],
        ['Only a ROUTER', 'splits a broadcast domain. A switch multiplies collision domains and does nothing to broadcasts.'],
      ])}
      <div class="box warn">Exam trap and real-world trap in one: three switches chained together is <b>one</b> broadcast domain, no matter how many ports.</div>`,
  },

  /* ── 6.4 Switch speeds and forwarding methods ────────────────────────── */
  { t: 'Two ways to forward a frame', body: `${CSS}${FWD}` },

  {
    t: 'Which method, and what it costs',
    body: `${CSS}
      <table class="t">
        <tr><th></th><th>Store-and-forward</th><th>Cut-through</th></tr>
        <tr><td class="hl">Waits for</td><td>the whole frame</td><td>the first 6 bytes (or 64, fragment-free)</td></tr>
        <tr><td class="hl">Checks the FCS</td><td>yes — bad frames stop here</td><td>no — bad frames are passed on</td></tr>
        <tr><td class="hl">Latency</td><td>grows with frame size</td><td>fixed and tiny</td></tr>
        <tr><td class="hl">Needed for</td><td>QoS, any speed change between ports</td><td>high-frequency trading, some fabrics</td></tr>
      </table>
      <div class="box ok">Cisco Catalyst switches are <strong>store-and-forward only</strong>. If the incoming and outgoing ports run at different speeds, cut-through is impossible anyway — the switch must buffer.</div>`,
  },

  {
    t: 'Memory buffering: where a frame waits',
    body: `${CSS}
      <div class="grid2">
        <div class="f"><b>Port-based memory</b><br><span style="font-size:19px;color:#4a6076">Each port has its own queue. One busy destination port can block frames queued behind it, even for other ports.</span></div>
        <div class="f"><b>Shared memory</b><br><span style="font-size:19px;color:#4a6076">One pool for all ports. A frame is stored once and linked to whichever port needs it — better for mixed speeds.</span></div>
      </div>
      ${kv([
        ['Why buffering exists at all', 'a 1 Gbps port feeding a 100 Mbps port must hold the excess somewhere'],
        ['When the buffer fills', 'frames are dropped — and this is the commonest cause of packet loss inside a healthy-looking LAN'],
      ])}`,
  },

  {
    t: 'Speed, duplex and auto-MDIX',
    body: `${CSS}
      ${term(`Switch(config)# <span class="k">interface</span> FastEthernet0/1
Switch(config-if)# <span class="k">speed</span> auto        <span class="c">! negotiate, the default</span>
Switch(config-if)# <span class="k">duplex</span> auto       <span class="c">! negotiate, the default</span>
Switch(config-if)# <span class="k">mdix</span> auto         <span class="c">! detect straight-through vs crossover</span>
Switch(config-if)# <span class="k">end</span>

Switch# <span class="k">show interfaces</span> Fa0/1 status
Port   Name  Status       Vlan  Duplex  Speed Type
Fa0/1        <span class="g">connected</span>    1     <span class="g">a-full</span>  <span class="g">a-100</span> 10/100BaseTX`, 'sm')}
      ${kv([
        ['a-full, a-100', 'the "a-" prefix means auto-negotiated. Without it, somebody forced the setting by hand.'],
        ['auto-MDIX', 'ends the straight-through vs crossover question — the port rewires itself'],
        ['Leave both on auto', 'forcing one end is how you create the duplex mismatch from Chapter 5'],
      ])}`,
  },

  {
    t: '★ Filling the table on purpose: MAC flooding',
    body: `${CSS}
      ${flow('Attacker', 'Switch', [
        ['r', 'thousands of frames, each a fake source MAC', 'fills the table'],
        ['l', 'table full — nothing new can be learned', ''],
        ['r', 'now every unknown unicast is FLOODED', 'to every port'],
        ['l', 'the attacker receives traffic meant for others', 'a switch behaving as a hub'],
      ])}
      ${term(`Switch(config-if)# <span class="k">switchport port-security</span>
Switch(config-if)# <span class="k">switchport port-security maximum</span> 2
Switch(config-if)# <span class="k">switchport port-security violation</span> restrict
<span class="c">! the port now refuses a third MAC and logs it</span>`, 'sm')}
      <p class="note">★ Beyond Module 7, but it explains why a MAC table has a fixed size and why port-security exists at all.</p>`,
  },

  /* ── Lab 1.4 ─────────────────────────────────────────────────────────── */
  {
    t: 'Lab 1.4 — the three things to look at',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><b>Wireshark</b> — capture a ping and read the Ethernet header: source MAC, destination MAC, EtherType.</span></div>
        <div><span class="n">2</span><span><b>Device MAC addresses</b> — find the same addresses on the PCs and the router, from the command line.</span></div>
        <div><span class="n">3</span><span><b>The switch MAC table</b> — see the switch's own view of who is on which port.</span></div>
      </div>
      <div class="box ok">The point of the lab is a single comparison: <strong>the MAC the capture shows must be a machine on your own link</strong>. When you ping the internet, the destination MAC is the router — not the far server. Seeing that with your own eyes is what the lab is for.</div>
      <p class="note">FLM assigns sessions 19 and 20 to this lab, with "Use AI Tools for Analyzing Captured Packets" as part of CLO9.</p>`,
  },

  {
    t: 'Lab 1.4 · step 1 — read the frame',
    body: `${term(`$ <span class="k">sudo tshark</span> -i eth0 -c 1 -V -f "icmp" | head -14

Frame 1: 98 bytes on wire (784 bits)
<span class="k">Ethernet II</span>, Src: <span class="g">52:54:00:a1:b2:c3</span>, Dst: <span class="g">00:1a:2b:3c:4d:5e</span>
    Destination: 00:1a:2b:3c:4d:5e
        <span class="c">.... ..0. .... .... = Local: globally unique (U/L = 0)</span>
        <span class="c">.... ...0 .... .... = IG bit: unicast    (I/G = 0)</span>
    Source: 52:54:00:a1:b2:c3
    <span class="k">Type: IPv4 (0x0800)</span>
Internet Protocol Version 4, Src: 192.168.1.10, Dst: <span class="r">8.8.8.8</span>
    <span class="c"># the IP destination is Google — the MAC destination is your router</span>`, 'sm')}
      <p class="note">Wireshark decodes the I/G and U/L bits for you. That is the slide-6 theory printed on a real packet.</p>`,
  },

  {
    t: 'Lab 1.4 · step 2 — find the MACs on the devices',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Windows</th><td><span class="nw-m">ipconfig /all</span> — read "Physical Address"</td></tr>
        <tr><th>Linux</th><td><span class="nw-m">ip -br link</span> · <span class="nw-m">cat /sys/class/net/eth0/address</span></td></tr>
        <tr><th>macOS</th><td><span class="nw-m">ifconfig en0 | grep ether</span> · <span class="nw-m">networksetup -listallhardwareports</span></td></tr>
        <tr><th>Cisco IOS</th><td><span class="nw-m">show interfaces</span> — "bia" = burned-in address</td></tr>
        <tr><th>Any neighbour</th><td><span class="nw-m">ip neigh</span> · <span class="nw-m">arp -a</span> — their MAC as YOUR machine learned it</td></tr>
      </table>
      <div class="box warn">Compare what the host reports with what the capture showed. They must match exactly. If they do not, you are reading a different interface — a VPN, a bridge or a virtual adapter.</div>`,
  },

  {
    t: 'Lab 1.4 · step 3 — the switch\'s own view',
    body: `${term(`Switch# <span class="k">show mac address-table dynamic</span>
Vlan    Mac Address       Type       Ports
----    -----------       ----       -----
   1    5254.00a1.b2c3    DYNAMIC    Fa0/1     <span class="c">&lt;- PC-A</span>
   1    5254.00d4.e5f6    DYNAMIC    Fa0/2     <span class="c">&lt;- PC-B</span>
   1    001a.2b3c.4d5e    DYNAMIC    Gi0/1     <span class="c">&lt;- the router, on the uplink</span>

Switch# <span class="k">clear mac address-table dynamic</span>
Switch# <span class="k">show mac address-table dynamic</span>
<span class="c">! empty — then ping once from PC-A and watch one entry appear</span>`, 'sm')}
      <p class="note">Clearing the table and watching it refill is the clearest demonstration in the whole course: the table is <strong>learned</strong>, never configured.</p>`,
  },

  {
    t: '★ The same lab without Packet Tracer',
    body: `${term(`$ <span class="k">ip</span> -br link                     <span class="c"># step 2: your own MAC</span>
   eth0  UP  52:54:00:a1:b2:c3  mtu 1500

$ <span class="k">ip</span> neigh                        <span class="c"># step 2: the neighbours' MACs</span>
   192.168.1.1 lladdr 00:1a:2b:3c:4d:5e REACHABLE

$ <span class="k">bridge</span> fdb show br docker0 | grep -v permanent
   02:42:ac:11:00:02 dev veth3f2a master docker0   <span class="c"># step 3: a MAC table</span>
   02:42:ac:11:00:03 dev veth9b1c master docker0

$ <span class="k">sudo</span> bridge -s fdb show br docker0   <span class="c"># with ageing timers</span>`, 'sm')}
      <p class="note">★ Every part of Lab 1.4 exists on a plain Linux box: <span class="nw-m">tshark</span> is Wireshark, <span class="nw-m">ip</span> is <span class="nw-m">ipconfig</span>, and <span class="nw-m">bridge fdb show</span> is <span class="nw-m">show mac address-table</span>. No simulator, no licence.</p>`,
  },

  {
    t: '★ Why your containers can see each other',
    body: `${CSS}
      ${topo([
        'nd.cl:web|02:42:ac:11:00:02',
        'lk:veth',
        'nd:docker0|learns both MACs',
        'lk:veth',
        'nd.cl:db|02:42:ac:11:00:03',
      ])}
      ${kv([
        ['02:42 prefix', 'Docker builds the MAC itself — and the U/L bit in 0x02 is 1: locally administered, exactly as slide 6 said'],
        ['Same learning rule', 'docker0 fills its table from source addresses and forwards on destination, identically to a Catalyst'],
        ['Same consequences', 'one broadcast domain per network, so every container on a bridge hears every broadcast on it'],
        ['Which is why', 'creating a separate Docker network is the container version of creating a VLAN'],
      ])}`,
  },

  {
    t: 'Self-check — switching',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Command</th><td>What it proves</td></tr>
        <tr><th>show mac address-table</th><td>Which MAC the switch believes is on which port. Wrong port = the device moved, or somebody is spoofing.</td></tr>
        <tr><th>show interfaces status</th><td><b>a-full / a-1000</b> = negotiated cleanly. Missing "a-" = forced by hand.</td></tr>
        <tr><th>show interfaces Fa0/1</th><td>runts, giants, CRC. Rising CRC = cable. Rising giants = someone enabled tagging.</td></tr>
        <tr><th>bridge fdb show</th><td>the same table, on your Linux server</td></tr>
        <tr><th>tshark -e eth.src -e eth.dst</th><td>the two addresses actually on the wire, which settle every argument</td></tr>
      </table>`,
  },

  {
    t: 'What Chapter 7 needs from this one',
    body: `${CSS}
      <div class="dg">
        <div class="bx st">Ch.5<br><small>frames exist</small></div>
        <div class="ar">→</div>
        <div class="bx st">Ch.6<br><small>switches move them<br>inside one LAN</small></div>
        <div class="ar">→</div>
        <div class="bx"><b>Ch.7</b><br><small>routers move packets<br>BETWEEN LANs</small></div>
        <div class="ar">→</div>
        <div class="bx ext">Ch.8<br><small>ARP joins the two</small></div>
      </div>
      ${kv([
        ['Carry forward #1', 'a switch never changes a frame; a router always builds a new one'],
        ['Carry forward #2', 'a switch multiplies collision domains and cannot split a broadcast domain — only a router can'],
        ['Carry forward #3', 'the destination MAC of anything leaving your LAN is the router, and Chapter 8 explains how your machine found it'],
      ])}`,
  },
];
