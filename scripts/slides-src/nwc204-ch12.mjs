/**
 * nwc204-ch12.mjs — NWC204 Chapter 12: ICMP
 * (FLM buổi 37–38 lý thuyết + buổi 39–40 Lab 2.3, Cisco Module 13).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 37, 38, 39, 40.
 *   buổi 37: 12. ICMP · 12.1 ICMP Messages
 *   buổi 38: 12.2 Ping and Traceroute Testing · 12.3 Integrate AI Tools (Self Learning)
 *   buổi 39–40: Lab 2.3 — Use Ping and Traceroute to Test Network Connectivity
 *               · Use AI Tools for Configuration and Troubleshooting
 *   LO: CLO6 ("dùng công cụ chẩn đoán… kể cả tiện ích ICMP") + CLO9.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 13, ĐO THẬT trên VPS sản xuất:
 *     - ping tới host không tồn tại trong subnet của chính mình → IM LẶNG,
 *       không có "host unreachable" nào cả
 *     - Path MTU: 1472 byte + DF đi lọt, 1473 byte trả
 *       `ping: local error: message too long, mtu=1500`
 *     - tracepath thật: hop 1 "no reply" mà hop 2..10 vẫn trả lời, kèm nhãn `asymm`
 *     - TTL trong gói trả lời đếm ngược số chặng: 1.1.1.1 → ttl=55, 8.8.8.8 → ttl=118
 *     - ping6 ff02::1%eth0 → chỉ CHÍNH NÓ đáp, trong 0,055 ms
 *     - exit code: 0 khi tới được, 1 khi không — dùng được trong script
 *
 * ⚠️ SVG: viewBox="0 0 900 h" width="1150". Chữ đơn cách rộng 0,602 × font-size
 *    ⇒ font 15 tối đa ~99 ký tự/dòng từ x=4. Chữ trong <rect> phải NGẮN HƠN rect,
 *    và <rect> đánh dấu phải đặt bằng CÔNG THỨC chứ không bằng mắt.
 *
 * 23 slide (1 bìa + 22 nội dung); 20 trong số đó là sơ đồ, SVG, bảng hoặc terminal.
 */
import { CSS, topo, flow, encap, term, kv, code, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch12',
  code: 'NWC204',
  title: 'Ch.12 — ICMP',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: what ICMP is for ─────────────────────────────────────────────── */
const ROLE = `<svg class="nw-svg" viewBox="0 0 900 246" width="1150" height="341"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">IP has no way to report a problem. ICMP is that missing channel.</text>
  <g stroke-width="2.5">
    <rect x="20" y="32" width="400" height="104" rx="8" fill="#fdeeee" stroke="#d94b4b"/>
    <rect x="480" y="32" width="400" height="104" rx="8" fill="#eefaf4" stroke="#1f9d6b"/>
  </g>
  <text x="220" y="56" text-anchor="middle" font-size="15" font-weight="800" fill="#8f2c2c">IP alone</text>
  <text x="220" y="80" text-anchor="middle" font-size="13" fill="#3c5570">best effort, no guarantee</text>
  <text x="220" y="100" text-anchor="middle" font-size="13" fill="#3c5570">a dropped packet is simply gone</text>
  <text x="220" y="122" text-anchor="middle" font-size="13" fill="#8f2c2c" font-weight="700">the sender is never told</text>
  <text x="680" y="56" text-anchor="middle" font-size="15" font-weight="800" fill="#14603f">IP + ICMP</text>
  <text x="680" y="80" text-anchor="middle" font-size="13" fill="#3c5570">still best effort — nothing is fixed</text>
  <text x="680" y="100" text-anchor="middle" font-size="13" fill="#3c5570">but the sender gets TOLD what happened</text>
  <text x="680" y="122" text-anchor="middle" font-size="13" fill="#14603f" font-weight="700">feedback, not delivery</text>
  <text x="4" y="172" fill="#1b5fa8" font-size="15" font-weight="700">ICMP does NOT make IP reliable. It makes IP diagnosable.</text>
  <text x="4" y="198" fill="#25405e" font-size="14">Reliability is the transport layer's job — TCP, in Chapter 13. ICMP only reports.</text>
  <text x="4" y="222" fill="#5d7288" font-size="14">Every tool in this chapter — ping, traceroute, path MTU discovery — is ICMP being read.</text>
  <text x="4" y="242" fill="#5d7288" font-size="14">CLO6 names it directly: "use diagnostic tools ... including ICMP utilities".</text>
</svg>`;

/* ── SVG: traceroute's TTL trick ───────────────────────────────────────── */
const TTLTRICK = `<svg class="nw-svg" viewBox="0 0 900 268" width="1150" height="372"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Traceroute has no special protocol. It abuses the TTL field, one hop at a time.</text>
  <g stroke-width="2.5" fill="#fff">
    <circle cx="70" cy="76" r="26" stroke="#1b5fa8"/>
    <circle cx="270" cy="76" r="26" stroke="#5d7288"/>
    <circle cx="470" cy="76" r="26" stroke="#5d7288"/>
    <circle cx="670" cy="76" r="26" stroke="#5d7288"/>
    <rect x="820" y="52" width="60" height="48" rx="6" stroke="#1f9d6b"/>
  </g>
  <g text-anchor="middle" font-size="13" font-weight="700" fill="#0f2a4a">
    <text x="70" y="81">you</text><text x="270" y="81">R1</text><text x="470" y="81">R2</text>
    <text x="670" y="81">R3</text><text x="850" y="81">dest</text>
  </g>
  <g stroke="#8aa0b6" stroke-width="2">
    <line x1="96" y1="76" x2="244" y2="76"/><line x1="296" y1="76" x2="444" y2="76"/>
    <line x1="496" y1="76" x2="644" y2="76"/><line x1="696" y1="76" x2="818" y2="76"/>
  </g>
  <g font-size="13">
    <text x="4" y="134" fill="#3c5570" font-weight="700">TTL=1</text>
    <text x="90" y="134" fill="#25405e">dies at R1 &#8594; R1 sends Time Exceeded &#8594; you learn R1's address</text>
    <text x="4" y="160" fill="#3c5570" font-weight="700">TTL=2</text>
    <text x="90" y="160" fill="#25405e">dies at R2 &#8594; R2 sends Time Exceeded &#8594; you learn R2's address</text>
    <text x="4" y="186" fill="#3c5570" font-weight="700">TTL=3</text>
    <text x="90" y="186" fill="#25405e">dies at R3 &#8594; R3 sends Time Exceeded &#8594; you learn R3's address</text>
    <text x="4" y="212" fill="#14603f" font-weight="700">TTL=4</text>
    <text x="90" y="212" fill="#14603f" font-weight="700">reaches the destination &#8594; a different reply &#8594; the trace stops</text>
  </g>
  <text x="4" y="244" fill="#1b5fa8" font-size="14" font-weight="700">Every router that decrements TTL to zero MUST report it. That obligation is the whole tool.</text>
  <text x="4" y="264" fill="#5d7288" font-size="14">So traceroute maps the FORWARD path only — each reply comes back by its own route.</text>
</svg>`;

/* ── SVG: path MTU black hole ──────────────────────────────────────────── */
const PMTU = `<svg class="nw-svg" viewBox="0 0 900 262" width="1150" height="364"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">★ Why blocking all ICMP breaks connections that look like they should work</text>
  <text x="4" y="46" fill="#14603f" font-size="14" font-weight="700">ICMP allowed — the sender is told, and adapts</text>
  <g stroke-width="2.5" fill="#fff">
    <rect x="20" y="58" width="100" height="36" rx="6" stroke="#1f9d6b"/>
    <rect x="380" y="58" width="130" height="36" rx="6" stroke="#e0952a"/>
    <rect x="760" y="58" width="110" height="36" rx="6" stroke="#1f9d6b"/>
  </g>
  <g text-anchor="middle" font-size="12" fill="#0f2a4a" font-weight="700">
    <text x="70" y="81">sender</text><text x="445" y="81">link MTU 1400</text><text x="815" y="81">server</text>
  </g>
  <g stroke="#1f9d6b" stroke-width="2.5" fill="none">
    <line x1="124" y1="76" x2="370" y2="76"/><polygon points="370,70 382,76 370,82" fill="#1f9d6b" stroke="none"/>
    <line x1="376" y1="100" x2="128" y2="100"/><polygon points="128,94 116,100 128,106" fill="#1f9d6b" stroke="none"/>
  </g>
  <text x="250" y="70" text-anchor="middle" font-size="11" fill="#3c5570">1500-byte packet, DF set</text>
  <text x="250" y="116" text-anchor="middle" font-size="11" fill="#14603f" font-weight="700">ICMP Frag Needed, MTU=1400</text>
  <text x="560" y="116" font-size="11" fill="#14603f" font-weight="700">sender retries at 1400 - it works</text>
  <text x="4" y="152" fill="#8f2c2c" font-size="14" font-weight="700">ICMP blocked by a firewall — nobody is told, and nobody knows why</text>
  <g stroke-width="2.5" fill="#fff">
    <rect x="20" y="164" width="100" height="36" rx="6" stroke="#d94b4b"/>
    <rect x="380" y="164" width="130" height="36" rx="6" stroke="#d94b4b"/>
    <rect x="760" y="164" width="110" height="36" rx="6" stroke="#d94b4b"/>
  </g>
  <g text-anchor="middle" font-size="12" fill="#0f2a4a" font-weight="700">
    <text x="70" y="187">sender</text><text x="445" y="187">link MTU 1400</text><text x="815" y="187">server</text>
  </g>
  <g stroke="#d94b4b" stroke-width="2.5" fill="none">
    <line x1="124" y1="182" x2="370" y2="182"/><polygon points="370,176 382,182 370,188" fill="#d94b4b" stroke="none"/>
  </g>
  <text x="250" y="176" text-anchor="middle" font-size="11" fill="#3c5570">1500-byte packet, DF set</text>
  <text x="530" y="187" font-size="13" fill="#8f2c2c" font-weight="800">dropped, silently</text>
  <text x="4" y="228" fill="#d94b4b" font-size="14" font-weight="700">Symptom: the handshake succeeds, small requests work, and large responses hang forever.</text>
  <text x="4" y="252" fill="#5d7288" font-size="14">"Some pages load, some never finish" is a path-MTU black hole until proven otherwise.</text>
</svg>`;

/* ── SVG: what ping does and does not prove ────────────────────────────── */
const PROVE = `<svg class="nw-svg" viewBox="0 0 900 244" width="1150" height="339"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">A successful ping proves less than people assume, and a failed one proves even less</text>
  <g stroke-width="2.5">
    <rect x="20" y="32" width="410" height="120" rx="8" fill="#eefaf4" stroke="#1f9d6b"/>
    <rect x="470" y="32" width="410" height="120" rx="8" fill="#fdeeee" stroke="#d94b4b"/>
  </g>
  <text x="225" y="56" text-anchor="middle" font-size="15" font-weight="800" fill="#14603f">ping SUCCEEDS — proves</text>
  <g font-size="13" fill="#25405e">
    <text x="40" y="80">layer 1: a physical path exists</text>
    <text x="40" y="102">layer 2: frames are being delivered</text>
    <text x="40" y="124">layer 3: IP routing works BOTH ways</text>
    <text x="40" y="146">the host is powered on and has an IP stack</text>
  </g>
  <text x="675" y="56" text-anchor="middle" font-size="15" font-weight="800" fill="#8f2c2c">ping FAILS — does NOT prove</text>
  <g font-size="13" fill="#25405e">
    <text x="490" y="80">that the host is down</text>
    <text x="490" y="102">that routing is broken</text>
    <text x="490" y="124">that the service is unavailable</text>
    <text x="490" y="146">anything at all, if ICMP is filtered</text>
  </g>
  <text x="4" y="182" fill="#1b5fa8" font-size="14" font-weight="700">What ping NEVER proves: that the application works. Layer 4 and above are untouched.</text>
  <text x="4" y="206" fill="#25405e" font-size="14">A server can answer every ping perfectly while nginx is stopped and port 443 refuses.</text>
  <text x="4" y="230" fill="#d94b4b" font-size="14" font-weight="700">Many hosts drop ICMP by policy. "It does not ping" is a starting point, never a diagnosis.</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'ICMP',
    sub: 'Chapter 12 — Cisco Module 13',
    body: `<div class="cov-meta">Sessions 37–38 (theory) + 39–40 (Lab 2.3) of 60 · CLO6, CLO9<br>
      12.1 ICMP Messages<br>
      12.2 Ping and Traceroute Testing · 12.3 AI Tools<br>
      Lab 2.3 — Use Ping and Traceroute to Test Network Connectivity<br>
      ★ marks material added by cuongthai.com, measured on a real server</div>`,
  },

  /* ── 12.1 — session 37 ───────────────────────────────────────────────── */
  {
    t: 'Four sessions, and the outcome they serve',
    body: `${CSS}
      ${kv([
        ['Session 37', '12.1 ICMP Messages'],
        ['Session 38', '12.2 Ping and Traceroute Testing · 12.3 AI tools (self learning)'],
        ['Sessions 39–40', '<b>Lab 2.3</b> — use ping and traceroute to test connectivity'],
        ['Outcome', '<b>CLO6</b> — "use diagnostic tools and techniques to test and troubleshoot network connectivity, <b>including ICMP utilities</b> and AI-assisted methods"'],
        ['Why it matters', 'this is the chapter that turns knowing how a network works into finding out why one does not'],
      ])}
      <div class="box">CLO6 names ICMP explicitly, which is unusual — most outcomes describe a skill rather than a protocol. That is a signal about how this chapter is assessed: you are expected to <b>use</b> the tools and defend what their output means, not recite message types.</div>`,
  },

  { t: '12.1 What ICMP is for', body: `${CSS}${ROLE}` },

  {
    t: 'ICMP travels inside IP, and that has consequences',
    body: `${CSS}
      ${encap(['Ethernet frame', 'IP packet — protocol number 1', 'ICMP message'], '<div class="lb" style="color:#b4690e">type · code · checksum · payload</div>')}
      ${kv([
        ['Protocol number', '<b>1</b> for ICMPv4, <b>58</b> for ICMPv6 — in the IP header protocol field'],
        ['Not a transport', 'there is no port number, so a firewall rule cannot say "port 80" about it'],
        ['Carried BY IP', 'so an ICMP message can itself be dropped, delayed or lost'],
      ])}
      <div class="box warn">The consequence people miss: <b>an ICMP error is an unreliable message about an unreliable protocol.</b> If a router sends "fragmentation needed" and that reply is dropped, the original sender learns nothing and simply keeps failing. Path MTU discovery depends on a message that has no guarantee of arriving — which is exactly why blocking ICMP causes such strange faults.</div>`,
  },

  {
    t: '12.1 The messages worth knowing by heart',
    body: `${CSS}
      <table class="t"><thead><tr><th>Type</th><th>Name</th><th>Sent when</th><th>Tool that reads it</th></tr></thead>
      <tbody>
        <tr><td class="hl">8 / 0</td><td>Echo Request / Reply</td><td>you asked "are you there"</td><td><b>ping</b></td></tr>
        <tr><td class="hl">11</td><td>Time Exceeded</td><td>TTL reached zero in transit</td><td><b>traceroute</b></td></tr>
        <tr><td class="hl">3</td><td>Destination Unreachable</td><td>the packet could not be delivered</td><td>both, and the kernel</td></tr>
        <tr><td>5</td><td>Redirect</td><td>"there is a better first hop than me"</td><td>routing</td></tr>
        <tr><td>3 code 4</td><td>Fragmentation Needed</td><td>too big, and DF was set</td><td><b>path MTU discovery</b></td></tr>
      </tbody></table>
      <div class="box ok">In ICMPv6 the numbers differ — echo is 128/129, and types 133 to 137 are Neighbor Discovery, which Chapter 11 covered. That renumbering matters for firewall rules: a rule written for ICMPv4 type 8 does nothing at all to IPv6.</div>`,
  },

  {
    t: 'Destination Unreachable — the codes that mean different things',
    body: `${CSS}
      ${kv([
        ['code 0 — net unreachable', 'a router has no route to that network at all'],
        ['code 1 — host unreachable', 'the network was reached; the host did not answer ARP or ND'],
        ['code 3 — port unreachable', 'the host is there, nothing is listening on that UDP port'],
        ['code 4 — fragmentation needed', '<b>too big, and DF was set</b>. This one carries the correct MTU.'],
        ['code 13 — administratively prohibited', 'a firewall said no, and admitted it'],
      ])}
      <div class="box warn">★ <b>Code 1 is the one that is usually absent when you expect it.</b> Measured on a real server: pinging 172.17.99.99 — an address inside its own docker0 subnet with nothing at it — produced <b>no reply at all</b>, not a host-unreachable message. 100% packet loss and silence. The router only reports what it knows, and "nobody answered ARP" is often reported by saying nothing.</div>`,
  },

  {
    t: '12.1 Time Exceeded — and the field that makes it happen',
    body: `${CSS}
      ${kv([
        ['TTL', 'an 8-bit counter in the IPv4 header. <b>Hop Limit</b> in IPv6 — same idea, better name.'],
        ['Every router', 'decrements it by one before forwarding'],
        ['At zero', 'the packet is discarded and the router MUST send Time Exceeded back'],
        ['Why it exists', 'a routing loop would otherwise circulate a packet forever'],
        ['Typical start', '64 on Linux and macOS, 128 on Windows, 255 on network gear'],
      ])}
      <div class="box">★ <b>The received TTL tells you the hop count, for free.</b> Measured from a real VPS: a reply from 1.1.1.1 arrived with <span class="nw-m">ttl=55</span>, and from 8.8.8.8 with <span class="nw-m">ttl=118</span>. Subtract from the nearest starting value above: 64 − 55 = <b>9 hops</b>, 128 − 118 = <b>10 hops</b>. No traceroute needed, and it costs one packet.</div>`,
  },

  {
    t: '★ ICMPv6 is not optional — blocking it breaks IPv6 entirely',
    body: `${CSS}
      ${kv([
        ['ICMPv4', 'convenient. You can block most of it and the network still mostly works.'],
        ['ICMPv6', '<b>structural.</b> Core functions are built on it and stop without it.'],
        ['Types 135 / 136', 'Neighbor Solicitation and Advertisement — <b>the ARP replacement</b>'],
        ['Types 133 / 134', 'Router Solicitation and Advertisement — <b>how a host gets a prefix</b>'],
        ['Type 2', 'Packet Too Big — IPv6 routers do not fragment, so this is the ONLY way'],
      ])}
      <div class="box warn">Block ICMPv6 wholesale and you get a network where hosts cannot find each other, cannot get addresses, and cannot discover the path MTU. It will look like "IPv6 does not work here". A firewall rule written as "drop all ICMP" is a reasonable-sounding decision on IPv4 and a catastrophic one on IPv6 — RFC 4890 exists specifically to say which types must be permitted.</div>`,
  },

  /* ── 12.2 — session 38 ───────────────────────────────────────────────── */
  {
    t: '12.2 How ping works',
    body: `${CSS}
      ${flow('your host', 'target', [
        ['r', 'ICMP Echo Request (type 8)', 'id + sequence number'],
        ['l', 'ICMP Echo Reply (type 0)', 'same id + sequence'],
        ['r', 'Echo Request seq=2', 'and so on'],
        ['l', 'Echo Reply seq=2', 'round trip time measured'],
      ])}
      <div class="box">The <b>sequence number</b> is what makes loss visible: missing sequence numbers in the output are packets that never came back. The <b>identifier</b> lets several ping processes on one machine tell their replies apart. Neither is decoration — both are how the tool turns a message into a measurement.</div>`,
  },

  {
    t: 'Reading ping output line by line',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">ping -c 3 1.1.1.1</span>
64 bytes from 1.1.1.1: icmp_seq=3 <span class="g">ttl=55</span> <span class="g">time=26.6 ms</span>

--- 1.1.1.1 ping statistics ---
3 packets transmitted, 3 received, <span class="g">0% packet loss</span>, time 2003ms
rtt min/avg/max/mdev = <span class="g">26.640/27.497/28.579/0.807 ms</span>`)}
      ${kv([
        ['64 bytes', 'payload size — the default, not the packet size'],
        ['icmp_seq', 'sequence. <b>Gaps here are lost packets.</b>'],
        ['ttl=55', '★ hops: 64 − 55 = 9 routers between here and there'],
        ['time=26.6 ms', 'round trip, not one way. Halve it for a rough one-way estimate.'],
        ['mdev = 0.807', '<b>jitter.</b> A high mdev with low loss means congestion, not a break.'],
      ])}`,
  },

  {
    t: '12.2 How traceroute works — the TTL trick',
    body: `${CSS}${TTLTRICK}`,
  },

  {
    t: '★ A real trace, with the things that confuse people',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">tracepath -n 1.1.1.1</span>
 1?: [LOCALHOST]                        pmtu 1500
 1:  <span class="r">no reply</span>
 2:  10.132.133.186                      1.147ms
 3:  113.171.33.198                      1.067ms <span class="c">asymm  5</span>
 4:  113.171.31.249                     28.094ms <span class="c">asymm  8</span>
 5:  113.171.34.62                      30.954ms <span class="c">asymm  7</span>
 8:  103.22.203.1                       25.480ms
10:  103.22.203.45                      29.157ms
     <span class="c">Too many hops: pmtu 1500</span>`, 'sm')}
      <div class="box warn"><b>Hop 1 says "no reply" and hops 2 to 10 answer perfectly.</b> Nothing is broken. That router simply does not generate Time Exceeded messages — many do not, by policy. A missing hop in the middle of a working trace is almost never the fault.</div>`,
  },

  {
    t: '★ Two things that look like faults and are not',
    body: `${CSS}
      ${kv([
        ['<b>* * *</b> or "no reply"', 'that router does not send Time Exceeded. Later hops still answering proves the path is fine.'],
        ['<b>asymm 5</b>', 'the reply came back by a path of a different length. <b>Routing is not symmetric</b>, and there is no reason it should be.'],
        ['Rising then falling times', 'ICMP replies are low priority. A busy router answers slowly while forwarding fast.'],
        ['The trace never reaches the target', 'the target may drop ICMP entirely — which says nothing about whether its service works'],
      ])}
      <div class="box">★ In the real trace above, <span class="nw-m">tracepath</span> reached hop 10 without arriving, while the TTL of a direct ping reply implied 9 hops back. Both are true: <b>the forward path and the return path are different</b>. That is what <span class="nw-m">asymm</span> is reporting, and it is normal on the public Internet.</div>`,
  },

  {
    t: '★ Path MTU discovery, measured',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">ping -c 2 -M do -s 1472 1.1.1.1</span>   <span class="c"># 1472 + 28 header = 1500</span>
2 packets transmitted, 2 received, <span class="g">0% packet loss</span>

<span class="p">$</span> <span class="k">ping -c 1 -M do -s 1473 1.1.1.1</span>   <span class="c"># one byte more = 1501</span>
<span class="r">ping: local error: message too long, mtu=1500</span>`, 'sm')}
      ${kv([
        ['-M do', 'set the Don’t Fragment bit — "deliver whole or report back"'],
        ['-s 1472', 'payload. Add 8 bytes ICMP header and 20 bytes IP header to get the packet size.'],
        ['The boundary', 'is the interface MTU, 1500 here. One byte over and it cannot be sent.'],
      ])}
      <div class="box ok">This is how you find the real MTU of a path: increase <span class="nw-m">-s</span> until it breaks, then the last size that worked plus 28 is the path MTU. Useful when a VPN or tunnel silently lowers it below 1500.</div>`,
  },

  { t: '★ When ICMP is blocked, PMTUD becomes a black hole', body: `${CSS}${PMTU}` },

  { t: 'What ping proves, and what it does not', body: `${CSS}${PROVE}` },

  {
    t: '12.3 AI tools for troubleshooting — and their limit',
    body: `${CSS}
      <div class="two">
        <div class="box ok"><b>Good use</b><br><span class="note">"Explain what asymm means in tracepath output."<br>"What does ICMP type 3 code 4 mean and who sends it?"<br>"Give me a checklist for a path MTU black hole."</span></div>
        <div class="box warn"><b>Bad use</b><br><span class="note">Pasting an error and accepting the first confident explanation without running a single command to test it.</span></div>
      </div>
      <div class="box">A model can tell you what a message type <em>means</em>. It cannot tell you what is happening <em>on your network</em>, because it has not seen your network. The syllabus lists AI tools under Lab 2.3 as an aid to "Configuration and Troubleshooting" — and troubleshooting is precisely the activity where a plausible wrong answer costs the most, because you act on it.</div>
      <p class="note">The rule that has held all course: a model proposes, a command decides.</p>`,
  },

  /* ── Lab 2.3 — sessions 39–40 ────────────────────────────────────────── */
  {
    t: 'Lab 2.3 — what sessions 39 and 40 ask for',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span>Use ping and traceroute to test network connectivity.</span></div>
        <div><span class="n">2</span><span>Use AI tools for configuration and troubleshooting — and show how you checked them.</span></div>
      </div>
      <p class="note">Materials: <b>13.3.2 Lab Manual</b>, or the Packet Tracer activities <b>13.2.7</b> and <b>13.3.1</b>. Type <b>U</b> — you do it, not watch it.</p>
      <div class="box warn">The deliverable that earns marks is not "ping worked". It is being able to say, for each test, <b>what that specific result rules in and what it rules out</b>. A ping that fails is a fact; a ping that fails <em>while its gateway answers</em> is a diagnosis.</div>`,
  },

  {
    t: 'The ping ladder — test in this order, stop at the first failure',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><span class="nw-m">ping 127.0.0.1</span> — is the host’s own IP stack alive?</span></div>
        <div><span class="n">2</span><span><span class="nw-m">ping &lt;my own address&gt;</span> — is the interface configured and up?</span></div>
        <div><span class="n">3</span><span><span class="nw-m">ping &lt;default gateway&gt;</span> — layers 1 to 3 on my own subnet</span></div>
        <div><span class="n">4</span><span><span class="nw-m">ping &lt;a host on another subnet&gt;</span> — routing works</span></div>
        <div><span class="n">5</span><span><span class="nw-m">ping 8.8.8.8</span> then <span class="nw-m">ping google.com</span> — the last pair separates routing from <b>DNS</b></span></div>
      </div>
      <div class="box ok">Step 5 is the one that saves the most time in real life. <b>If 8.8.8.8 answers and google.com does not, the network is fine and DNS is broken.</b> That single comparison ends more arguments than any other test in this course.</div>`,
  },

  {
    t: '★ ping in scripts — the flags that matter',
    body: `${CSS}
      ${code(`ping -c 1 -W 2 10.0.0.5 >/dev/null 2>&1 && echo up || echo down
#      |     |
#      |     +-- timeout in SECONDS for a reply — without it you wait forever
#      +-------- send exactly one packet, then exit

# measured on a real server:
#   reachable   -> exit code 0
#   unreachable -> exit code 1`, 'bash', 'sm')}
      ${kv([
        ['-c 1', 'count. Without it, ping runs until interrupted — fatal in a script.'],
        ['-W 2', 'how long to wait for a reply. The default can be tens of seconds.'],
        ['exit 0 / 1', '★ measured: 0 when a reply came back, 1 when none did'],
        ['-M do -s N', 'the path MTU probe from three slides ago'],
      ])}
      <div class="box warn">A health check built on ping tests exactly one thing: that the host answers ICMP. It does not test your application. For a web service, <span class="nw-m">curl -fsS -o /dev/null</span> against a real URL is the check that fails when the thing you care about fails.</div>`,
  },

  {
    t: '★ Diagnosing on the machine you actually run',
    body: `${CSS}
      ${code(`ping -c 3 1.1.1.1              # is the Internet reachable at all
ping -c 3 <gateway>            # is my own subnet fine
ping -c 3 <container IP>       # can the host reach the container network
tracepath -n 1.1.1.1           # where does it stop, and does it stop everywhere
ping -6 -c 2 ff02::1%eth0      # who else is on this link, over IPv6
ping -M do -s 1472 <host>      # is the path MTU really 1500`, 'bash', 'sm')}
      <div class="box">★ <b>Measured result worth knowing.</b> <span class="nw-m">ping -6 ff02::1%eth0</span> on a production VPS got exactly one answer, from the machine itself, in <b>0.055 ms</b>. The upstream router did not answer a multicast ping — common, and not a fault. All-nodes multicast tells you who is <em>willing</em> to answer, not who is there.</div>`,
  },

  {
    t: 'The five mistakes that cost the most marks',
    body: `${CSS}
      ${kv([
        ['"It does not ping, so it is down"', 'many hosts drop ICMP by policy. Failure proves nothing on its own.'],
        ['"It pings, so the service works"', 'ping never touches layer 4. nginx can be stopped and ping still answers.'],
        ['Reading <b>* * *</b> as a fault', 'that router does not send Time Exceeded. Later hops answering proves the path.'],
        ['Blocking all ICMP for "security"', 'kills path MTU discovery on IPv4, and kills IPv6 outright'],
        ['Skipping the DNS test', 'ping 8.8.8.8 then ping google.com. The difference names the layer.'],
      ])}
      <div class="box ok">One habit covers most of it: before running a test, say out loud what a pass and a fail would each rule out. A test whose outcome does not change what you do next is a test not worth running.</div>`,
  },

  {
    t: 'What you can do now, and what comes next',
    body: `${CSS}
      ${kv([
        ['Explain', 'what ICMP is for, and why it does not make IP reliable'],
        ['Name', 'echo, time exceeded and destination unreachable, and what generates each'],
        ['Read', 'a ping line and extract loss, latency, jitter and ★ hop count from the TTL'],
        ['Explain', 'how traceroute works from the TTL field alone, with no special protocol'],
        ['Recognise', '★ "no reply" and "asymm" as normal, not as faults'],
        ['Diagnose', '★ a path MTU black hole, and say why it looks like a slow application'],
        ['Say', 'why ICMPv6 must not be blocked, naming the types that would break'],
      ])}
      <div class="box ok">Next: <b>Chapter 13 — the Transport Layer</b> (sessions 41–42, Cisco Module 14). TCP, UDP and <b>port numbers</b> — the layer where "the server is up but the site is down" finally has a precise explanation.</div>`,
  },
];
