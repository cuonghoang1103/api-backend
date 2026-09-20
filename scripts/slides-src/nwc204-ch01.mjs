/**
 * nwc204-ch01.mjs — NWC204 Chapter 1: Networking Today (FLM buổi 1–2, Cisco Module 1).
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng tiếng Việt nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 1 và buổi 2.
 */
import { CSS, stack, pkt, topo, flow, term, kv, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch01',
  code: 'NWC204',
  title: 'Ch.1 — Networking Today',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

export const slides = [
  {
    kind: 'cover',
    t: 'Networking Today',
    sub: 'Chapter 1 — Cisco Module 1',
    body: `<div class="cov-meta">Sessions 1–2 of 60 · CLO1, CLO9<br>
      Networks affect our lives · Components · Topologies · Types<br>
      Internet connections · Reliability · Trends · Security</div>`,
  },

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

  {
    t: 'Three kinds of component',
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

  {
    t: 'Network types by scale',
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

  {
    t: 'How a home or office reaches the Internet',
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

  {
    t: 'What makes a network reliable',
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

  {
    t: 'Trends that shape today’s networks',
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

  {
    t: 'Threats and the answers to them',
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
];
