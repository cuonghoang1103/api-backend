/**
 * nwc204-ch01.mjs — NWC204 Chapter 1: Networking Today (FLM buổi 1–2, Cisco Module 1).
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng tiếng Việt nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 1 và buổi 2.
 *   buổi 1: 1.1 Networks Affect Our Lives · 1.2 Network Components ·
 *           1.3 Network Representations and Topologies · 1.4 Common Types of Networks
 *   buổi 2: 1.5 Internet Connections · 1.6 Reliable Networks · 1.7 Network Trends ·
 *           1.8 Network Security · 1.9 The IT Professional · 1.10 Integrate AI Tools
 * Thứ tự slide bám đúng thứ tự mục của hai buổi, nên mỗi bài học lấy được MỘT DẢI
 * slide liền nhau: bài 1.1 = slide 1–8, bài 1.2 = 9–13, bài 1.3 = 14–18.
 * ⚠️ Ít nhất 60% slide phải là SƠ ĐỒ / BẢNG — người học nói thẳng là slide toàn chữ
 *    thì "học rất chán + không hiểu lắm vì bài giảng bên dưới cũng là chữ rồi".
 */
import { CSS, stack, topo, flow, term, kv } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch01',
  code: 'NWC204',
  title: 'Ch.1 — Networking Today',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

export const slides = [
  /* ── 1 ── */
  {
    kind: 'cover',
    t: 'Networking Today',
    sub: 'Chapter 1 — Cisco Module 1',
    body: `<div class="cov-meta">Sessions 1–2 of 60 · CLO1, CLO9<br>
      Networks affect our lives · Components · Topologies · Types<br>
      Internet connections · Reliability · Trends · Security<br>
      The IT professional · Integrate AI tools</div>`,
  },

  /* ── 2 ── 1.1 */
  {
    t: '1.1 — What the network actually changed',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Before a network</th><th>With a network</th><th>What the network must guarantee</th></tr>
        <tr><td>Letters, fixed telephone</td><td>Messaging, video calls</td><td>Low, <b>steady</b> delay — not just speed</td></tr>
        <tr><td>Library opening hours</td><td>Search, documents in the cloud</td><td>Availability — the data is useless if unreachable</td></tr>
        <tr><td>Cash at a counter</td><td>Online payment</td><td>Confidentiality and proof of identity</td></tr>
        <tr><td>One desk, one office</td><td>Work from anywhere</td><td>Remote access that is not also open to attackers</td></tr>
      </table>
      <p class="note">Read the third column as a list of <b>requirements</b>. Every design
      choice in the rest of this course exists to satisfy one of them.</p>`,
  },

  /* ── 3 ── */
  {
    t: 'What is a network, really?',
    body: `${CSS}
      <p class="lead2">A network is not the cables. It is an <b>agreement</b> that lets
      two devices exchange data reliably over shared infrastructure.</p>
      ${topo([
        'nd.cl:PC-A|192.168.1.10',
        'lk:copper<br>Fa0/1',
        'nd:Switch S1|Layer 2',
        'lk:copper<br>Fa0/24',
        'nd.rt:Router R1|default gateway',
        'lk:fibre<br>to ISP',
        'nd.cl:Server|203.0.113.5',
      ])}
      <p class="note">Remove any one box and the conversation stops. Each box exists
      because it answers a question the others cannot: <i>who am I talking to</i>,
      <i>which way out</i>, <i>how do the bits travel</i>.</p>`,
  },

  /* ── 4 ── 1.2 */
  {
    t: '1.2 — Three kinds of component',
    body: `${CSS}
      <div class="grid3">
        <div class="card"><b>End devices</b><p>Where data is created or consumed.
          PC, phone, printer, server, IP camera, sensor.</p></div>
        <div class="card"><b>Intermediary devices</b><p>Move data and decide its path.
          Switch, router, wireless AP, firewall.</p></div>
        <div class="card"><b>Network media</b><p>Carry the signal.
          Copper (electricity), fibre (light), wireless (radio).</p></div>
      </div>
      ${kv([
        ['Every end device', 'has an address, so it can be reached'],
        ['Every intermediary', 'keeps a table, so it can forward'],
        ['Every medium', 'has a limit: distance, bandwidth, interference'],
      ])}`,
  },

  /* ── 5 ── */
  {
    t: 'The words on every network diagram',
    body: `${CSS}
      ${topo([
        'nd.cl:PC-A|NIC inside',
        'lk:link (UTP)<br>into Fa0/1',
        'nd:Switch S1|24 physical ports',
        'lk:uplink<br>Fa0/24',
        'nd.rt:Router R1|interface Gi0/0',
      ])}
      ${kv([
        ['NIC', 'the card in the end device; it owns the MAC address'],
        ['Physical port', 'the hole you plug the cable into, e.g. Fa0/1'],
        ['Interface', 'the port as software sees it — what you configure and what show commands report'],
        ['Link', 'the medium between two ports; it has a speed and a maximum length'],
      ])}
      <p class="note">Say "port" for the hardware and "interface" for the configured
      thing. The exam, and every <i>show</i> command, keeps them apart.</p>`,
  },

  /* ── 6 ── 1.3 */
  {
    t: '1.3 — Who serves whom: client–server and peer-to-peer',
    body: `${CSS}
      <div class="two">
        <div><div class="nh">Client–server</div>
          ${topo(['nd.cl:Client|asks', 'lk:request<br>response', 'nd:Server|answers, always on'])}
          <p class="note">One machine has the data and the duty to be up. Easy to
          secure and back up; it is also the single thing that can fail.</p>
        </div>
        <div><div class="nh">Peer-to-peer</div>
          ${topo(['nd.cl:Peer A|both roles', 'lk:direct<br>share', 'nd.cl:Peer B|both roles'])}
          <p class="note">Every host is client <i>and</i> server. No dedicated box to buy;
          no central place to enforce a password or take a backup.</p>
        </div>
      </div>
      <div class="box">A printer shared from a desktop is peer-to-peer. The same printer
      behind a print server is client–server. <b>Same cable, different model.</b></div>`,
  },

  /* ── 7 ── */
  {
    t: 'Physical vs logical topology',
    body: `${CSS}
      <div class="two">
        <div><div class="nh">Physical</div>
          <p class="note">Where the boxes and cables actually are. Answers:
          <i>which port is this plugged into?</i></p>
          ${topo(['nd.cl:PC|', 'lk:Fa0/1', 'nd:S1|', 'lk:Fa0/2', 'nd.cl:PC|'])}
        </div>
        <div><div class="nh">Logical</div>
          <p class="note">Which addresses talk to which, and how they are grouped.
          Answers: <i>same network or different?</i></p>
          ${kv([
            ['Host A', '192.168.1.10 /24'],
            ['Host B', '192.168.1.20 /24'],
            ['Same network?', 'yes — no router needed'],
          ])}
        </div>
      </div>
      <div class="box warn">Two devices can be one cable apart physically and still
      be unable to talk — because logically they sit in different networks.</div>`,
  },

  /* ── 8 ── 1.4 */
  {
    t: '1.4 — Network types by scale',
    body: `${CSS}
      <table class="t">
        <tr><th>Type</th><th>Scope</th><th>Owned by</th><th>Typical link</th></tr>
        <tr><td><b>SOHO</b></td><td>Home / small office</td><td>You</td><td>One combined router</td></tr>
        <tr><td><b>LAN</b></td><td>One building or campus</td><td>One organisation</td><td>Switched Ethernet, Wi-Fi</td></tr>
        <tr><td><b>WAN</b></td><td>City, country, global</td><td>Service provider</td><td>Leased fibre, MPLS</td></tr>
        <tr><td class="hl"><b>Internet</b></td><td>Worldwide</td><td class="hl">Nobody — and everybody</td><td>Many WANs peering</td></tr>
      </table>
      <p class="note">The Internet is not a bigger LAN. It is a <b>network of networks</b>
      that agreed on one addressing scheme (IP) and one way to hand traffic over (BGP).</p>`,
  },

  /* ── 9 ── 1.5 */
  {
    t: '1.5 — How a home or office reaches the Internet',
    body: `${CSS}
      <table class="t">
        <tr><th>Connection</th><th>Medium</th><th>Shared with neighbours?</th><th>Typical use</th></tr>
        <tr><td>DSL</td><td>Telephone copper</td><td>No</td><td>Legacy home</td></tr>
        <tr><td>Cable</td><td>Coaxial</td><td class="hl">Yes — speed varies by time of day</td><td>Home</td></tr>
        <tr><td>Fibre to the home</td><td>Optical fibre</td><td>No</td><td>Home, business</td></tr>
        <tr><td>Cellular</td><td>Radio</td><td>Yes</td><td>Mobile, backup link</td></tr>
        <tr><td>Satellite</td><td>Radio</td><td>Yes</td><td>Remote sites</td></tr>
        <tr><td>Dedicated leased line</td><td>Fibre</td><td>No</td><td>Business, data centre</td></tr>
      </table>
      <p class="note">Business links cost more not for raw speed but for the
      <b>guarantee</b>: symmetric upload, fixed address, contracted repair time.</p>`,
  },

  /* ── 10 ── */
  {
    t: 'Bandwidth, throughput, latency — three different numbers',
    body: `${CSS}
      <table class="t">
        <tr><th>Term</th><th>What it means</th><th>Unit</th><th>How you see it</th></tr>
        <tr><td><b>Bandwidth</b></td><td>Capacity the link is <i>rated</i> for</td><td>Mbps, Gbps</td><td>The contract</td></tr>
        <tr><td><b>Throughput</b></td><td>What you actually get now</td><td>Mbps</td><td>A speed test</td></tr>
        <tr><td><b>Goodput</b></td><td>Throughput minus headers and resends</td><td>Mbps</td><td>Always the lowest</td></tr>
        <tr><td class="hl"><b>Latency</b></td><td>Time for one bit to get there</td><td class="hl">ms</td><td><span class="nw-m">ping</span> round-trip</td></tr>
      </table>
      <div class="box warn">A 1 Gbps link with 300 ms latency feels broken for a video
      call and perfect for a backup. <b>Bandwidth and latency are not substitutes.</b></div>`,
  },

  /* ── 11 ── 1.6 */
  {
    t: '1.6 — What makes a network reliable',
    body: `${CSS}
      <div class="grid2">
        <div class="f"><b>Fault tolerance</b><br><span style="font-size:19px">Multiple paths.
          One link dies, traffic re-routes.</span></div>
        <div class="f"><b>Scalability</b><br><span style="font-size:19px">Add users
          without redesigning what already works.</span></div>
        <div class="f"><b>Quality of Service</b><br><span style="font-size:19px">Voice and
          video get priority over a file copy.</span></div>
        <div class="f"><b>Security</b><br><span style="font-size:19px">Protect the
          infrastructure, and protect the data on it.</span></div>
      </div>
      ${flow('Sender', 'Receiver', [
        ['r', 'packet via path 1', 'normal'],
        ['r', 'packet via path 2', 'path 1 down — fault tolerance at work'],
      ])}`,
  },

  /* ── 12 ── 1.7 */
  {
    t: '1.7 — Trends that shape today’s networks',
    body: `${CSS}
      ${kv([
        ['BYOD', 'Any device, any owner, any place — the network can no longer assume it owns the endpoint.'],
        ['Online collaboration', 'Meetings and documents live on the network; an outage stops work, not just browsing.'],
        ['Video', 'Bandwidth and latency both matter; one is not a substitute for the other.'],
        ['Cloud computing', 'The server you administer may be in another country — public, private, hybrid, community.'],
        ['Smart home / powerline', 'Networking over wiring that was never designed for data.'],
        ['Wireless ISP', 'Broadband delivered by radio where cable never arrived.'],
      ])}
      <div class="box">Each trend moves the security boundary further away from the
      building — which is why Module 16 spends two sessions on it.</div>`,
  },

  /* ── 13 ── 1.8 */
  {
    t: '1.8 — Threats and the answers to them',
    body: `${CSS}
      <div class="two">
        <div><div class="nh">External threats</div>
          ${kv([
            ['Viruses, worms, trojans', 'malicious code on hosts'],
            ['Spyware, adware', 'silent data collection'],
            ['Zero-day attacks', 'no patch exists yet'],
            ['Denial of service', 'service drowned in traffic'],
            ['Data interception, theft', 'traffic read on the way'],
            ['Identity theft', 'credentials reused elsewhere'],
          ])}
        </div>
        <div><div class="nh">Layered answers</div>
          ${kv([
            ['Antivirus, antispyware', 'on every host'],
            ['Firewall filtering', 'at the network edge'],
            ['Dedicated firewall systems', 'deep inspection, logging'],
            ['Access control lists', 'who may reach what'],
            ['Intrusion prevention', 'detect and block patterns'],
            ['Virtual private networks', 'encrypt across untrusted paths'],
          ])}
        </div>
      </div>
      <p class="note">No single control is enough — this is the whole idea of
      <b>defence in depth</b>.</p>`,
  },

  /* ── 14 ── 1.9 */
  {
    t: '1.9 — The IT professional: who does what',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Role</th><th>A normal day</th><th>Starts from</th></tr>
        <tr><td><b>Network technician</b></td><td>Patch cables, replace a faulty port, run the first checks</td><td>CCNA, Networking Basics</td></tr>
        <tr><td><b>Network administrator</b></td><td>Addressing plan, device configuration, backups, monitoring</td><td>CCNA</td></tr>
        <tr><td><b>Network engineer</b></td><td>Design, capacity, routing policy, change review</td><td>CCNA then CCNP</td></tr>
        <tr><td><b>Security analyst</b></td><td>Logs, alerts, hardening, incident response</td><td>CCNA then CyberOps</td></tr>
      </table>
      <p class="note">This course is the first of the CCNA path. FPT also requires every
      Networking Academy assignment on <b>netacad.com</b> to reach at least <b>75%</b>
      before the final exam — that is in the syllabus, not optional.</p>`,
  },

  /* ── 15 ── 1.10 */
  {
    t: '1.10 — Using AI tools without being misled',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><div><b>Give the topology, not just the question.</b> Addresses, masks, interface names, what you already tried.</div></div>
        <div><span class="n">2</span><div><b>Ask for the reasoning, then the command.</b> A command you cannot explain is a command you cannot debug.</div></div>
        <div><span class="n">3</span><div><b>Predict the output before you run it.</b> Write down what <i>show</i> should say if the answer is right.</div></div>
        <div><span class="n">4</span><div><b>Run it on Packet Tracer or a lab switch</b> — never first on something people are using.</div></div>
        <div><span class="n">5</span><div><b>Compare with the real output.</b> A mismatch is the finding; that is the whole exercise.</div></div>
      </div>
      <div class="box warn">AI invents interface names, invents IOS commands that never
      existed, and states subnet boundaries that are off by one. It is a fast draft,
      <b>never the verification</b>. CLO9 asks you to use it; step 5 is what makes that safe.</div>`,
  },

  /* ── 16 ── */
  {
    t: 'Verify it yourself, on your own machine',
    body: `${CSS}
      <p class="note">Everything on the previous slides is visible from one terminal.
      Run these and read what they tell you about <i>your</i> network.</p>
      ${term(`<span class="c"># Which address am I, and which way out?</span>
<span class="p">$</span> <span class="k">ip</span> addr show        <span class="c"># Linux — your own address + mask</span>
<span class="p">$</span> <span class="k">ip</span> route show       <span class="c"># the default gateway = your exit</span>
<span class="p">$</span> <span class="k">ipconfig</span> /all       <span class="c"># Windows equivalent</span>

<span class="c"># Is the far end reachable, and how many hops away?</span>
<span class="p">$</span> <span class="k">ping</span> -c 4 1.1.1.1
<span class="p">$</span> <span class="k">traceroute</span> 1.1.1.1  <span class="c"># every line is one router on the path</span>`)}
      <div class="box ok">If <span class="nw-m">ping 1.1.1.1</span> works but a domain
      name fails, the network is fine and <b>DNS</b> is the problem. That one
      distinction saves hours — you will meet it again in Module 15.</div>`,
  },

  /* ── 17 ── */
  {
    t: 'Sessions 1–2: the school’s own questions',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Question, exactly as FPT wrote it</th><th>Answer it with</th></tr>
        <tr><td><b>CQ1.1</b> — What is the Internet?</td><td>A network <i>of networks</i> agreeing on IP addressing and on how to hand traffic over — not one big LAN</td></tr>
        <tr><td><b>CQ1.2</b> — How can computers in network talk together?</td><td>An address each, a shared medium, and an agreed set of rules (protocols)</td></tr>
        <tr><td><b>CQ1.3</b> — Why do we need a reliable networks?</td><td>Fault tolerance, scalability, QoS, security — each answers a different way a network fails</td></tr>
      </table>
      <p class="note">CQ1.3 is quoted with its original grammar. The syllabus lists no
      constructive question for session 6 at all — one of several gaps in that table.</p>`,
  },

  /* ── 18 ── */
  {
    t: 'Where Chapter 1 sits, and what comes next',
    body: `${CSS}
      ${stack([
        ['1', 'Networking Today', 'components, topologies, types, trends, threats — sessions 1–2', true],
        ['2', 'Switch and end-device configuration', 'get into a device and configure it — sessions 3–6'],
        ['3', 'Protocols and models', 'OSI, TCP/IP, encapsulation — sessions 7–10'],
        ['4', 'Physical layer', 'copper, fibre, wireless — sessions 11–14'],
        ['5+', 'Data link, Ethernet, network layer', 'frames, MAC, IP packets — sessions 15–22'],
      ])}
      <div class="box">You now have the vocabulary. From Chapter 2 on, every idea comes
      with a command that proves it — which is the point of the Practical Exam.</div>`,
  },
];
