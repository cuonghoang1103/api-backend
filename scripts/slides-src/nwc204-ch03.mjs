/**
 * nwc204-ch03.mjs — NWC204 Chapter 3: Protocols and Models
 * (FLM buổi 7–8 lý thuyết + buổi 9–10 Lab 1.2, Cisco Module 3).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 7, 8, 9, 10.
 *
 * Yêu cầu của người học: slide phải THIÊN VỀ SƠ ĐỒ, tối đa ~6 dòng chữ mỗi slide.
 * Vì vậy 20/23 slide là sơ đồ hoặc bảng.
 */
import { CSS, stack, pkt, encap, topo, flow, term, kv, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch03',
  code: 'NWC204',
  title: 'Ch.3 — Protocols and Models',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

export const slides = [
  {
    kind: 'cover',
    t: 'Protocols and Models',
    sub: 'Chapter 3 — Cisco Module 3',
    body: `<div class="cov-meta">Sessions 7–8 (theory) + 9–10 (Lab 1.2) of 60 · CLO1, CLO9<br>
      The Rules · Protocols · Protocol Suites · Standards Organizations<br>
      Reference Models · Data Encapsulation · Data Access<br>
      Lab 1.2 — Design a Communications System · Research Standards · Install Wireshark</div>`,
  },

  /* ── 3.1 The Rules ───────────────────────────────────────────────────── */
  {
    t: 'A protocol is an agreement, not a cable',
    body: `${CSS}
      <p class="lead2">Two machines that share a wire still cannot talk until they
      agree <b>what the bits mean</b>. That agreement is the protocol.</p>
      ${flow('Sender', 'Receiver', [
        ['r', 'same language, same format', 'understood → reply comes back'],
        ['l', 'ACK', 'the agreement held'],
        ['r', 'different format', 'received as noise → silence'],
      ])}
      <p class="note">The third arrow is the whole reason this module exists: the
      signal arrived perfectly and the conversation still failed.</p>`,
  },

  {
    t: 'Every message needs three things',
    body: `${CSS}
      ${topo([
        'nd.cl:Source|encodes the message',
        'lk:channel<br>copper · fibre · radio',
        'nd:Transmitter|puts it on the medium',
        'lk:channel',
        'nd.cl:Destination|decodes the message',
      ])}
      ${kv([
        ['Source', 'the device that has something to say'],
        ['Channel', 'the medium the signal travels on — it always has a limit'],
        ['Destination', 'the device that must rebuild the original meaning'],
      ])}
      <p class="note">Encoding turns meaning into a signal; decoding turns it back.
      A mismatch at either end is indistinguishable from a broken cable.</p>`,
  },

  {
    t: 'What every protocol must define',
    body: `${CSS}
      <table class="t">
        <tr><th>Rule</th><th>Question it answers</th><th>Example</th></tr>
        <tr><td><b>Message encoding</b></td><td>How is meaning turned into signals?</td><td>Bits as voltage, light pulses, radio</td></tr>
        <tr><td><b>Message formatting</b></td><td>Where does each field start and stop?</td><td>Ethernet frame layout</td></tr>
        <tr><td><b>Encapsulation</b></td><td>What wraps around the data?</td><td>Headers added per layer</td></tr>
        <tr><td><b>Message size</b></td><td>How big may one message be?</td><td>Ethernet MTU 1500 bytes</td></tr>
        <tr><td class="hl"><b>Message timing</b></td><td>When may I send, how long do I wait?</td><td>Flow control, timeout</td></tr>
        <tr><td><b>Delivery options</b></td><td>To one, to some, or to all?</td><td>Unicast, multicast, broadcast</td></tr>
      </table>
      <p class="note">Break any one row and the link still shows "up".</p>`,
  },

  {
    t: 'Timing: three separate rules',
    body: `${CSS}
      ${flow('Host A', 'Host B', [
        ['r', 'data — 64 KB burst', 'flow control: B says how much it can take'],
        ['l', 'window = 8 KB', 'A slows down instead of losing data'],
        ['r', 'request', 'response timeout starts here'],
        ['r', 'retransmit', 'no reply in time → send it again'],
      ])}
      ${kv([
        ['Flow control', 'match the speed of the sender to the receiver'],
        ['Response timeout', 'how long to wait before deciding the reply is lost'],
        ['Access method', 'when is the shared medium free for me to use?'],
      ])}`,
  },

  {
    t: 'Delivery options',
    body: `${CSS}
      <div class="two">
        <div>
          <div class="nh">Unicast — one to one</div>
          ${topo(['nd.cl:A|sender', 'lk:', 'nd:S1|', 'lk:', 'nd.cl:B|only B'])}
          <div class="nh" style="margin-top:12px">Multicast — one to a group</div>
          ${topo(['nd.cl:A|sender', 'lk:', 'nd:S1|', 'lk:', 'nd.cl:B + D|group members'])}
          <div class="nh" style="margin-top:12px">Broadcast — one to all</div>
          ${topo(['nd.cl:A|sender', 'lk:', 'nd:S1|', 'lk:', 'nd.cl:B C D|everyone'])}
        </div>
        <div>
          <div class="nh">How they differ</div>
          ${kv([
            ['Unicast', 'one destination address'],
            ['Multicast', 'one group address, only members listen'],
            ['Broadcast', 'every host on the local network must process it'],
            ['IPv6', 'has NO broadcast — multicast replaced it'],
          ])}
          <div class="box warn">Broadcast costs every host CPU time, even the ones
          that do not care. That is why big flat networks get slow.</div>
        </div>
      </div>`,
  },

  /* ── 3.2 Protocols ───────────────────────────────────────────────────── */
  {
    t: 'What a protocol actually provides',
    body: `${CSS}
      <table class="t">
        <tr><th>Function</th><th>Meaning</th><th>Who does it</th></tr>
        <tr><td><b>Addressing</b></td><td>Identify sender and receiver</td><td>Ethernet, IPv4, IPv6</td></tr>
        <tr><td><b>Reliability</b></td><td>Guarantee delivery, resend what is lost</td><td>TCP</td></tr>
        <tr><td><b>Flow control</b></td><td>Keep the sender from drowning the receiver</td><td>TCP</td></tr>
        <tr><td><b>Sequencing</b></td><td>Reassemble in the right order</td><td>TCP</td></tr>
        <tr><td><b>Error detection</b></td><td>Notice corrupted data and discard it</td><td>Ethernet FCS, IPv4, TCP, UDP</td></tr>
        <tr><td><b>Application interface</b></td><td>Let two programs talk end to end</td><td>HTTP, DNS, DHCP</td></tr>
      </table>
      <p class="note">UDP deliberately leaves out reliability, sequencing and flow
      control — that is a design choice, not a defect.</p>`,
  },

  {
    t: 'Four families of protocol',
    body: `${CSS}
      <div class="grid2">
        <div class="f"><b>Network communications</b><br><span style="font-size:18px">HTTP · TCP · UDP · IP · Ethernet · WLAN</span></div>
        <div class="f"><b>Network security</b><br><span style="font-size:18px">SSH · SSL/TLS · IPsec</span></div>
        <div class="f"><b>Routing</b><br><span style="font-size:18px">OSPF · EIGRP · BGP · RIP</span></div>
        <div class="f"><b>Service discovery</b><br><span style="font-size:18px">DNS · DHCP · ARP</span></div>
      </div>
      ${kv([
        ['Every SSH session you open', 'uses all four families at once'],
        ['DNS', 'finds the name · DHCP gave you the address'],
        ['BGP', 'chose the path across the Internet'],
        ['SSH', 'encrypted what TCP carried'],
      ])}`,
  },

  /* ── 3.3 Protocol Suites ─────────────────────────────────────────────── */
  {
    t: 'The TCP/IP suite, layer by layer',
    body: `${CSS}
      ${stack([
        ['L4', 'Application', 'HTTP, HTTPS, DNS, DHCP, SMTP, POP3, IMAP, FTP, TFTP, SSH'],
        ['L3', 'Transport', 'TCP (reliable) · UDP (fast, no guarantee) — port numbers'],
        ['L2', 'Internet', 'IPv4, IPv6, ICMP, ARP, NDP — logical addresses, routing'],
        ['L1', 'Network Access', 'Ethernet, WLAN, PPP — MAC addresses, cables, radio'],
      ])}
      ${kv([
        ['Open standard', 'anyone may implement it — that is why TCP/IP won'],
        ['Proprietary suite', 'AppleTalk, Novell NetWare — both effectively gone'],
      ])}`,
  },

  /* ── 3.4 Standards Organizations ─────────────────────────────────────── */
  {
    t: 'Who writes the rules',
    body: `${CSS}
      <table class="t">
        <tr><th>Body</th><th>Owns</th><th>You meet it as</th></tr>
        <tr><td><b>IETF</b></td><td>Internet protocols</td><td>Every RFC — RFC 791 is IPv4</td></tr>
        <tr><td><b>IANA / ICANN</b></td><td>Addresses, names, port numbers</td><td>Port 22 = SSH is an IANA entry</td></tr>
        <tr><td><b>IEEE</b></td><td>LAN and wireless standards</td><td>802.3 Ethernet · 802.11 Wi-Fi</td></tr>
        <tr><td><b>ISO</b></td><td>The OSI reference model</td><td>ISO 7498 — the 7 layers</td></tr>
        <tr><td><b>ITU-T</b></td><td>Telecom and optical</td><td>Video codecs, fibre standards</td></tr>
        <tr><td><b>TIA / EIA</b></td><td>Cabling and connectors</td><td>TIA-568 — T568A / T568B pinout</td></tr>
      </table>
      <p class="note">A standard is <b>open</b> when the document is public and
      royalty-free. That is why two vendors interoperate at all.</p>`,
  },

  /* ── 3.5 Reference Models ────────────────────────────────────────────── */
  {
    t: 'Two models, one stack of ideas',
    body: `${CSS}
      <div class="two">
        <div><div class="nh">OSI — 7 layers (teaching)</div>
          ${stack([
            ['7', 'Application', ''], ['6', 'Presentation', ''], ['5', 'Session', ''],
            ['4', 'Transport', ''], ['3', 'Network', ''], ['2', 'Data Link', ''], ['1', 'Physical', ''],
          ])}
        </div>
        <div><div class="nh">TCP/IP — 4 layers (running)</div>
          ${stack([
            ['4', 'Application', 'OSI 7 + 6 + 5', true],
            ['3', 'Transport', 'OSI 4', true],
            ['2', 'Internet', 'OSI 3', true],
            ['1', 'Network Access', 'OSI 2 + 1', true],
          ])}
          <p class="note">OSI is the vocabulary everyone argues in.
          TCP/IP is the stack actually installed on your machine.</p>
        </div>
      </div>`,
  },

  {
    t: 'OSI upper layers — what the program sees',
    body: `${CSS}
      ${stack([
        ['7', 'Application', 'The protocol your program speaks: HTTP, SSH, DNS', true],
        ['6', 'Presentation', 'Format, compress, encrypt: JPEG, GIF, TLS records', true],
        ['5', 'Session', 'Start, keep and end one conversation', true],
        ['4', 'Transport', 'Segments, ports, reliability'],
        ['3', 'Network', 'Logical addresses, best path'],
        ['2', 'Data Link', 'Frames on one link, MAC addresses'],
        ['1', 'Physical', 'Bits as signals on the medium'],
      ])}
      <p class="note">TCP/IP folds all three highlighted layers into one
      "Application" layer — in practice HTTP does its own formatting and TLS its
      own sessions.</p>`,
  },

  {
    t: 'OSI lower layers — what the network does',
    body: `${CSS}
      ${stack([
        ['7', 'Application', 'HTTP, SSH, DNS'],
        ['6', 'Presentation', 'Format, encrypt'],
        ['5', 'Session', 'Conversation state'],
        ['4', 'Transport', 'Port numbers · end-to-end reliability · TCP, UDP', true],
        ['3', 'Network', 'IP addresses · routing between networks', true],
        ['2', 'Data Link', 'MAC addresses · framing · error detection (FCS)', true],
        ['1', 'Physical', 'Voltage, light, radio · connectors and pinouts', true],
      ])}
      <p class="note">Layers 1–2 get you across <b>one</b> link. Layer 3 gets you
      across <b>many</b>. Layer 4 makes it one conversation.</p>`,
  },

  {
    t: 'Mapping OSI to TCP/IP',
    body: `${CSS}
      <table class="t">
        <tr><th>OSI</th><th>TCP/IP</th><th>Protocols</th><th>Address used</th></tr>
        <tr><td>7 Application</td><td rowspan="3" class="hl">Application</td><td>HTTP, DNS, SSH, DHCP</td><td>URL, host name</td></tr>
        <tr><td>6 Presentation</td><td>TLS, JPEG</td><td>—</td></tr>
        <tr><td>5 Session</td><td>part of HTTP, TLS</td><td>—</td></tr>
        <tr><td>4 Transport</td><td class="hl">Transport</td><td>TCP, UDP</td><td>Port number</td></tr>
        <tr><td>3 Network</td><td class="hl">Internet</td><td>IPv4, IPv6, ICMP</td><td>IP address</td></tr>
        <tr><td>2 Data Link</td><td rowspan="2" class="hl">Network Access</td><td>Ethernet, 802.11</td><td>MAC address</td></tr>
        <tr><td>1 Physical</td><td>copper, fibre, radio</td><td>none — just bits</td></tr>
      </table>`,
  },

  {
    t: 'The PDU changes name at every layer',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><b>Data</b> — what the application produced (an HTTP GET)</span></div>
        <div><span class="n">2</span><span><b>Segment</b> — Transport added ports and a sequence number (TCP)</span></div>
        <div><span class="n">3</span><span><b>Packet</b> — Internet added source and destination IP addresses</span></div>
        <div><span class="n">4</span><span><b>Frame</b> — Network Access added MAC addresses and a checksum</span></div>
        <div><span class="n">5</span><span><b>Bits</b> — Physical put the frame on the wire as signals</span></div>
      </div>
      <p class="note">PDU = Protocol Data Unit. Same bytes, five names — the name
      tells you <i>which header is outermost</i>, nothing else.</p>
      <div class="box">A UDP PDU is called a <b>datagram</b>, not a segment.</div>`,
  },

  {
    t: 'Encapsulation — the sender wraps',
    body: `${CSS}
      ${encap(
        ['Frame — Ethernet header + FCS (MAC addresses)',
         'Packet — IP header (source and destination IP)',
         'Segment — TCP header (source and destination port)'],
        `<div class="en"><div class="lb">Data — HTTP GET /index.html</div>
         <p class="note" style="margin:4px 0 0">the only part the user cares about</p></div>`,
      )}
      <p class="note">Each layer treats everything above it as <b>opaque payload</b>.
      The switch never reads the IP header; the router never reads the TCP port.</p>`,
  },

  {
    t: 'De-encapsulation — the receiver unwraps',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><b>Physical</b> — signals back into a bit stream</span></div>
        <div><span class="n">2</span><span><b>Data Link</b> — check the FCS, is the destination MAC mine? Strip the frame</span></div>
        <div><span class="n">3</span><span><b>Internet</b> — is the destination IP mine? Strip the IP header</span></div>
        <div><span class="n">4</span><span><b>Transport</b> — which port? Reorder, acknowledge. Strip the TCP header</span></div>
        <div><span class="n">5</span><span><b>Application</b> — hand the HTTP request to the web server</span></div>
      </div>
      <div class="box warn">Every step is a question that can answer "no": wrong FCS,
      wrong MAC, wrong IP, closed port. Four different silent drops, four different
      fixes — that is why you must know which layer answered "no".</div>`,
  },

  /* ── 3.6 Data Access ─────────────────────────────────────────────────── */
  {
    t: 'The Ethernet frame on the wire',
    body: `${CSS}
      ${pkt([
        ['Preamble + SFD', '8 bytes', '', 1.1],
        ['Destination MAC', '6 bytes', 'hl', 1.1],
        ['Source MAC', '6 bytes', 'hl', 1.05],
        ['Type', '2 bytes', '', 0.75],
        ['Payload — IP packet', '46–1500 bytes', 'pay', 1.9],
        ['FCS', '4 bytes', '', 0.7],
      ])}
      ${kv([
        ['Preamble + SFD', 'clock sync — the receiver finds the bit boundaries'],
        ['Type', '0x0800 = IPv4 · 0x86DD = IPv6 · 0x0806 = ARP'],
        ['Payload', 'minimum 46 bytes, so the whole frame is at least 64 bytes'],
        ['FCS', 'a CRC over the frame — mismatch means silent discard'],
      ])}`,
  },

  {
    t: 'Three addresses, three different jobs',
    body: `${CSS}
      <table class="t">
        <tr><th>Layer</th><th>Address</th><th>Scope</th><th>Changes on the way?</th></tr>
        <tr><td>Transport</td><td>Port — <span class="nw-m">443</span></td><td>Which program on the host</td><td>No</td></tr>
        <tr><td>Internet</td><td>IP — <span class="nw-m">192.168.10.10</span></td><td>End to end, across routers</td><td class="hl">No (except NAT)</td></tr>
        <tr><td>Data Link</td><td>MAC — <span class="nw-m">00:1B:44:11:3A:B7</span></td><td>One link only</td><td class="hl">Yes — at every router</td></tr>
      </table>
      ${flow('PC 192.168.10.10', 'Server 203.0.113.5', [
        ['r', 'src MAC PC → dst MAC R1', 'link 1 — IP addresses unchanged'],
        ['r', 'src MAC R1 → dst MAC R2', 'link 2 — new MACs, same IPs'],
      ])}`,
  },

  {
    t: 'Same network or different? The host decides first',
    body: `${CSS}
      ${topo([
        'nd.cl:PC-A|192.168.10.10 /24',
        'lk:same net<br>direct',
        'nd.cl:PC-B|192.168.10.20 /24',
        'lk:other net<br>via gateway',
        'nd.rt:R1|192.168.10.1',
        'lk:',
        'nd.cl:Server|203.0.113.5',
      ])}
      ${kv([
        ['Same network', 'destination MAC = the destination host itself'],
        ['Different network', 'destination MAC = the default gateway, destination IP unchanged'],
        ['How the host knows', 'bitwise AND of both addresses with its own mask — Chapter 4B'],
      ])}
      <div class="box warn">A wrong mask does not break the cable. It makes the host
      send local traffic to a router, or remote traffic to nobody.</div>`,
  },

  {
    t: 'Wireshark shows all four headers at once',
    body: `${CSS}
      ${term(`<span class="c"># One HTTP GET, as Wireshark decodes it — four nested headers</span>
<span class="g">Frame 41:</span> 495 bytes on wire, 495 bytes captured
<span class="k">Ethernet II</span>  Src: 00:1b:44:11:3a:b7   Dst: 3c:5a:b4:00:11:02   Type: IPv4 (0x0800)
  <span class="k">Internet Protocol Version 4</span>  Src: 192.168.10.10   Dst: 203.0.113.5
    <span class="k">Transmission Control Protocol</span>  Src Port: 51544   Dst Port: 80   Seq: 1
      <span class="k">Hypertext Transfer Protocol</span>
        GET /index.html HTTP/1.1
        Host: example.com`, 'sm')}
      <p class="note">Indentation in Wireshark <b>is</b> the encapsulation diagram —
      outermost header at the left, your data at the right.</p>`,
  },

  /* ── Lab 1.2, sessions 9–10 ──────────────────────────────────────────── */
  {
    t: 'Lab 1.2 — three tasks, sessions 9–10',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><b>Design a communications system</b> (3.0.3) — invent a protocol for a
          simple message and write down all six rules of slide 4</span></div>
        <div><span class="n">2</span><span><b>Research networking standards</b> (3.4.4) — pick one body, find the
          document number, say what it standardises</span></div>
        <div><span class="n">3</span><span><b>Install Wireshark</b> (3.7.9) and <b>capture your first packets</b> (3.7.10)
          — then find the four headers of the previous slide in your own traffic</span></div>
      </div>
      <div class="box">FLM marks Lab 1.2 as "Dialogue-based Assessment &amp; Self
      Learning": you must be able to <i>explain</i> the capture out loud, not just
      produce a screenshot.</div>`,
  },

  {
    t: 'Verify it yourself, before the next chapter',
    body: `${CSS}
      ${term(`<span class="c"># 1. Capture 20 packets on the interface that has your address</span>
<span class="p">$</span> <span class="k">ip</span> -br addr            <span class="c"># which interface is up, with what address</span>
<span class="p">$</span> <span class="k">sudo</span> tcpdump -i en0 -c 20 -n   <span class="c"># macOS: en0 · Linux: eth0 / wlan0</span>

<span class="c"># 2. Prove that the MAC changes per link but the IP does not</span>
<span class="p">$</span> <span class="k">arp</span> -an                <span class="c"># the gateway MAC your frames are addressed to</span>
<span class="p">$</span> <span class="k">traceroute</span> -n 1.1.1.1  <span class="c"># each line: one new pair of MACs, same dst IP</span>`)}
      <div class="box ok">If <span class="nw-m">tcpdump</span> shows frames leaving
      but no reply, the failure is above Layer 1 — the cable is doing its job.
      Read the next chapter for what happens below.</div>`,
  },
];
