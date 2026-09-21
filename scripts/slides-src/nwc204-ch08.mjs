/**
 * nwc204-ch08.mjs — NWC204 Chapter 8: Address Resolution
 * (FLM buổi 24–25, Cisco Module 9).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 24, 25.
 *   buổi 24: 8.1 MAC and IP
 *   buổi 25: 8.2 ARP · 8.3 Neighbor Discovery · 8.4 Integrate AI Tools (self learning)
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 9: các trạng thái của bảng láng
 *     giềng trên Linux (REACHABLE/STALE/DELAY/PROBE/FAILED), ARP không hỏi mà
 *     tự khai, phát hiện giả mạo ARP, proxy ARP, và đọc `ip -6 neigh` trên máy
 *     chủ thật.
 *
 * 24 slide, 21 trong số đó là sơ đồ, SVG, bảng hoặc terminal.
 */
import { CSS, pkt, topo, flow, term, kv, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch08',
  code: 'NWC204',
  title: 'Ch.8 — Address Resolution',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: the two addresses across two routers ──────────────────────────── */
const TWOADDR = `<svg class="nw-svg" viewBox="0 0 900 250" width="1150" height="319"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">The MAC pair is rewritten on every link. The IP pair never changes.</text>
  <g stroke="#1b5fa8" stroke-width="2.5" fill="none">
    <line x1="120" y1="72" x2="275" y2="72"/><line x1="425" y1="72" x2="545" y2="72"/><line x1="695" y1="72" x2="800" y2="72"/>
  </g>
  <rect x="20" y="52" width="100" height="40" rx="6" fill="#eaf3fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="70" y="70" font-size="13" text-anchor="middle" fill="#0f2a4a" font-weight="700">PC-A</text>
  <text x="70" y="86" font-size="11" text-anchor="middle" fill="#5d7288">10.0.0.42</text>
  <ellipse cx="350" cy="72" rx="75" ry="26" fill="#f5f9fd" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="350" y="70" font-size="13" text-anchor="middle" fill="#0f2a4a" font-weight="700">R1</text>
  <text x="350" y="86" font-size="10" text-anchor="middle" fill="#5d7288">10.0.0.1 · 192.0.2.1</text>
  <ellipse cx="620" cy="72" rx="75" ry="26" fill="#f5f9fd" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="620" y="70" font-size="13" text-anchor="middle" fill="#0f2a4a" font-weight="700">R2</text>
  <text x="620" y="86" font-size="10" text-anchor="middle" fill="#5d7288">192.0.2.2 · 203.0.113.1</text>
  <rect x="800" y="52" width="96" height="40" rx="6" fill="#eefaf4" stroke="#1f9d6b" stroke-width="2.5"/>
  <text x="848" y="70" font-size="13" text-anchor="middle" fill="#14603f" font-weight="700">server</text>
  <text x="848" y="86" font-size="11" text-anchor="middle" fill="#5d7288">203.0.113.9</text>
  <g font-size="12" text-anchor="middle">
    <rect x="128" y="108" width="154" height="54" rx="5" fill="#fff5d6" stroke="#b4690e" stroke-width="2"/>
    <text x="205" y="125" fill="#7a4708" font-weight="800">LINK 1</text>
    <text x="205" y="141" fill="#3c5570">MAC: PC-A → R1</text>
    <text x="205" y="156" fill="#14603f" font-weight="700">IP: .42 → 203.0.113.9</text>
    <rect x="418" y="108" width="154" height="54" rx="5" fill="#fff5d6" stroke="#b4690e" stroke-width="2"/>
    <text x="495" y="125" fill="#7a4708" font-weight="800">LINK 2</text>
    <text x="495" y="141" fill="#3c5570">MAC: R1 → R2</text>
    <text x="495" y="156" fill="#14603f" font-weight="700">IP: .42 → 203.0.113.9</text>
    <rect x="672" y="108" width="154" height="54" rx="5" fill="#fff5d6" stroke="#b4690e" stroke-width="2"/>
    <text x="749" y="125" fill="#7a4708" font-weight="800">LINK 3</text>
    <text x="749" y="141" fill="#3c5570">MAC: R2 → server</text>
    <text x="749" y="156" fill="#14603f" font-weight="700">IP: .42 → 203.0.113.9</text>
  </g>
  <text x="4" y="192" fill="#d94b4b" font-size="14" font-weight="700">Three different MAC pairs. One IP pair, identical all three times.</text>
  <text x="4" y="214" fill="#5d7288" font-size="14">Each device must therefore learn the MAC of the NEXT device only — never of the final one.</text>
  <text x="4" y="238" fill="#1b5fa8" font-size="14" font-weight="700">That learning is what ARP does on IPv4, and what Neighbor Discovery does on IPv6.</text>
</svg>`;

/* ── SVG: ARP request broadcast, reply unicast ──────────────────────────── */
const ARPX = `<svg class="nw-svg" viewBox="0 0 900 235" width="1150" height="300"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">STEP 1 — the question is shouted to everyone</text>
  <rect x="20" y="28" width="120" height="38" rx="6" fill="#eaf3fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="80" y="52" font-size="13" text-anchor="middle" fill="#0f2a4a" font-weight="700">PC-A .42</text>
  <g stroke="#d94b4b" stroke-width="2.5" fill="none">
    <line x1="140" y1="47" x2="300" y2="47"/>
    <polygon points="300,42 312,47 300,52" fill="#d94b4b" stroke="none"/>
  </g>
  <rect x="316" y="26" width="360" height="42" rx="5" fill="#fdeeee" stroke="#d94b4b" stroke-width="2"/>
  <text x="496" y="43" font-size="13" text-anchor="middle" fill="#8f2c2c" font-weight="800">dst MAC FF:FF:FF:FF:FF:FF — BROADCAST</text>
  <text x="496" y="60" font-size="12" text-anchor="middle" fill="#3c5570">"Who has 10.0.0.1? Tell 10.0.0.42"</text>
  <text x="700" y="43" font-size="12" fill="#5d7288">every NIC on the</text>
  <text x="700" y="59" font-size="12" fill="#5d7288">LAN must process it</text>
  <line x1="4" y1="84" x2="896" y2="84" stroke="#cfe0f0" stroke-width="2"/>
  <text x="4" y="108" fill="#0f2a4a" font-size="15" font-weight="700">STEP 2 — only the owner answers, and answers privately</text>
  <rect x="20" y="120" width="120" height="38" rx="6" fill="#eaf3fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="80" y="144" font-size="13" text-anchor="middle" fill="#0f2a4a" font-weight="700">PC-A .42</text>
  <g stroke="#1f9d6b" stroke-width="2.5" fill="none">
    <line x1="676" y1="139" x2="152" y2="139"/>
    <polygon points="152,134 140,139 152,144" fill="#1f9d6b" stroke="none"/>
  </g>
  <rect x="316" y="118" width="360" height="42" rx="5" fill="#eefaf4" stroke="#1f9d6b" stroke-width="2"/>
  <text x="496" y="135" font-size="13" text-anchor="middle" fill="#14603f" font-weight="800">dst MAC = PC-A only — UNICAST</text>
  <text x="496" y="152" font-size="12" text-anchor="middle" fill="#3c5570">"10.0.0.1 is at aa:bb:cc:dd:ee:ff"</text>
  <rect x="700" y="118" width="130" height="42" rx="6" fill="#f5f9fd" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="765" y="143" font-size="13" text-anchor="middle" fill="#0f2a4a" font-weight="700">R1 .1</text>
  <text x="4" y="192" fill="#5d7288" font-size="14">Both machines now cache the pair: the asker learned the answer, and the answerer learned the asker.</text>
  <text x="4" y="214" fill="#1b5fa8" font-size="14" font-weight="700">One broadcast + one unicast, and the conversation can finally start. Everything after this is cached.</text>
</svg>`;

/* ── SVG: solicited-node multicast address construction ─────────────────── */
const SNMA = `<svg class="nw-svg" viewBox="0 0 900 215" width="1150" height="275"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">IPv6 does not shout at everyone — it addresses a group of roughly one</text>
  <rect x="20" y="30" width="860" height="36" rx="5" fill="#eaf3fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="450" y="54" font-size="17" text-anchor="middle" fill="#0f2a4a" font-weight="800">target address   2001:db8:acad:1:  0000:0000:  1a:  2b3c</text>
  <text x="500" y="86" font-size="18" fill="#b4690e" font-weight="800">take the LAST 24 bits ↓</text>
  <rect x="560" y="94" width="150" height="30" rx="4" fill="#fff5d6" stroke="#b4690e" stroke-width="2.5"/>
  <text x="635" y="115" font-size="16" text-anchor="middle" fill="#7a4708" font-weight="800">1a:2b3c</text>
  <rect x="20" y="140" width="860" height="36" rx="5" fill="#eefaf4" stroke="#1f9d6b" stroke-width="2.5"/>
  <text x="450" y="164" font-size="17" text-anchor="middle" fill="#14603f" font-weight="800">solicited-node   ff02::1:ff1a:2b3c</text>
  <text x="4" y="200" fill="#5d7288" font-size="14">Only hosts whose last 24 bits match join that group, so usually exactly ONE NIC is interrupted —</text>
  <text x="4" y="212" fill="#1b5fa8" font-size="13" font-weight="700">not every machine on the LAN, as an ARP broadcast does. Same job, far less noise.</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'Address Resolution',
    sub: 'Chapter 8 — Cisco Module 9',
    body: `<div class="cov-meta">Sessions 24–25 of 60 · CLO4, CLO9<br>
      8.1 MAC and IP<br>
      8.2 ARP · 8.3 Neighbor Discovery<br>
      8.4 Integrate AI Tools for Explaining Concepts (self-learning)<br>
      ★ marks material added by cuongthai.com, beyond Cisco Module 9</div>`,
  },

  /* ── 8.1 MAC and IP ──────────────────────────────────────────────────── */
  { t: 'Two addresses, and only one of them travels', body: `${CSS}${TWOADDR}` },

  {
    t: 'Why one address was never enough',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Why not MAC only?</th><td>A MAC address is flat — 00:1A:2B:3C:4D:5E says nothing about <em>where</em> the device is. A router would need one table entry per device on Earth. IP is hierarchical, so one entry covers a whole network.</td></tr>
        <tr><th>Why not IP only?</th><td>The wire does not understand IP. An Ethernet NIC decides whether to accept a frame by looking at 48 bits of destination MAC, before any software runs. Layer 2 must be addressed in layer-2 terms.</td></tr>
        <tr><th>So both</th><td>IP says <b>which machine, anywhere</b>. MAC says <b>which neighbour, on this wire</b>. Address resolution is the bridge between them.</td></tr>
      </table>
      <div class="box ok">Ask "is the destination on my network?" and the answer decides whose MAC you need: the target's if local, the <b>gateway's</b> if remote. That is the whole of Chapter 8 in one sentence.</div>`,
  },

  {
    t: 'Local or remote decides whose MAC you need',
    body: `${CSS}
      <div class="two">
        <div>
          <div class="nh">Destination is LOCAL</div>
          ${topo(['nd:PC-A|10.0.0.42', 'lk:same LAN|', 'nd:PC-B|10.0.0.99'])}
          ${kv([
            ['ARP asks for', '10.0.0.99 — the target itself'],
            ['dst MAC', 'PC-B'],
            ['dst IP', '10.0.0.99'],
            ['Both point at', 'the same machine'],
          ])}
        </div>
        <div>
          <div class="nh">Destination is REMOTE</div>
          ${topo(['nd:PC-A|10.0.0.42', 'lk:gateway|', 'nd.rt:R1|10.0.0.1'])}
          ${kv([
            ['ARP asks for', '10.0.0.1 — the GATEWAY'],
            ['dst MAC', 'R1'],
            ['dst IP', '203.0.113.9'],
            ['They point at', '<b>two different machines</b>'],
          ])}
        </div>
      </div>
      <div class="box warn">A host <b>never</b> ARPs for an address outside its own subnet — it cannot, because the request is a broadcast and broadcasts do not cross routers.</div>`,
  },

  /* ── 8.2 ARP ─────────────────────────────────────────────────────────── */
  { t: 'ARP — one broadcast question, one unicast answer', body: `${CSS}${ARPX}` },

  {
    t: 'Inside an ARP message',
    body: `${CSS}
      ${pkt([['Hardware Type', '2 B · 1 = Ethernet'], ['Protocol Type', '2 B · 0x0800 = IPv4'], ['HLEN', '1 B · 6'], ['PLEN', '1 B · 4'], ['Opcode', '2 B', 'hl']])}
      ${pkt([['Sender MAC', '6 bytes', 'pay'], ['Sender IP', '4 bytes', 'pay']])}
      ${pkt([['Target MAC', '6 bytes — all zeros in a request', 'hl'], ['Target IP', '4 bytes', 'pay']])}
      ${kv([
        ['Opcode 1', 'request · Opcode 2 = reply. Same format, one field different'],
        ['Target MAC in a request', 'all zeros — that is precisely the unknown being asked about'],
        ['ARP is not inside IP', 'EtherType 0x0806, carried directly by Ethernet · it has no TTL and cannot leave the LAN'],
      ])}`,
  },

  {
    t: 'The ARP table, on three systems',
    body: `${CSS}
      ${term(`<span class="c"># Linux — the modern command. "arp -a" is deprecated and hides the state column.</span>
<span class="p">$</span> <span class="k">ip neigh</span> show
<span class="g">10.0.0.1 dev eth0 lladdr aa:bb:cc:dd:ee:ff REACHABLE</span>
<span class="g">10.0.0.99 dev eth0 lladdr 52:54:00:12:34:56 STALE</span>
<span class="g">10.0.0.77 dev eth0  FAILED</span>

<span class="c"># Cisco IOS</span>
<span class="p">R1#</span> <span class="k">show ip arp</span>
<span class="g">Protocol  Address     Age (min)  Hardware Addr   Type   Interface</span>
<span class="g">Internet  10.0.0.1          -   aabb.ccdd.eeff  ARPA   GigabitEthernet0/0</span>
<span class="g">Internet  10.0.0.42         3   5254.0012.3456  ARPA   GigabitEthernet0/0</span>`, 'sm')}
      ${kv([
        ['Age <span class="nw-m">-</span> on IOS', 'the router\'s own interface — it never ages out'],
        ['<b>FAILED</b> on Linux', 'we asked and nobody answered · that address is not on this LAN, or is switched off'],
        ['Default lifetime', 'Cisco 4 hours · Linux ~30 s to REACHABLE then STALE, refreshed on use'],
      ])}`,
  },

  {
    t: '★ The five states Linux keeps, and what each one means',
    body: `${CSS}
      <table class="t">
        <tr><th>State</th><th>Meaning</th><th>What you should conclude</th></tr>
        <tr><td class="hl">REACHABLE</td><td>confirmed within the last ~30 s</td><td>healthy · traffic is flowing</td></tr>
        <tr><td>STALE</td><td>known, but not confirmed recently</td><td><b>normal</b> · not an error, will be re-checked on next use</td></tr>
        <tr><td>DELAY</td><td>used while stale, waiting a moment before probing</td><td>transient, lasts ~5 s</td></tr>
        <tr><td>PROBE</td><td>actively asking right now</td><td>transient · if it lingers, the neighbour is gone</td></tr>
        <tr><td class="hl">FAILED</td><td>asked repeatedly, no answer</td><td><b>the fault</b> · wrong VLAN, wrong subnet, or the device is off</td></tr>
      </table>
      <div class="box warn">Most people see <b>STALE</b> and start debugging. Stale is the resting state of a working entry. The word to look for is <b>FAILED</b>, and the address next to it names the machine that is really missing.</div>`,
  },

  {
    t: 'ARP entries do not live forever',
    body: `${CSS}
      ${kv([
        ['Why they expire at all', 'a NIC can be replaced, a VM can move host, an IP can be reassigned — a cache that never expired would be permanently wrong'],
        ['Why they do not expire quickly', 'every expiry costs a broadcast that interrupts every machine on the LAN'],
        ['Cisco default', '4 hours (14 400 s) — tuned with <span class="nw-m">arp timeout</span> on the interface'],
        ['Linux', 'confirmed entries stay REACHABLE ~30 s, then STALE until used again'],
        ['Clear one by hand', '<span class="nw-m">ip neigh flush dev eth0</span> · IOS <span class="nw-m">clear arp-cache</span>'],
      ])}
      <div class="box">The timer is the reason a device that changes its IP address is unreachable for a while afterwards — and the reason a <b>gratuitous ARP</b> exists to cut that wait to zero.</div>`,
  },

  {
    t: '★ Gratuitous ARP — an answer nobody asked for',
    body: `${CSS}
      ${flow('a server taking over 10.0.0.50', 'every machine on the LAN', [
        ['r', 'ARP reply, broadcast, unrequested', 'sender IP = sender target IP = 10.0.0.50'],
        ['r', 'everyone overwrites their cache entry', 'no request was ever sent'],
      ])}
      ${kv([
        ['What it is for', 'a failover pair moving a shared IP · a VM migrating to another host · detecting a duplicate address at boot'],
        ['Why it works', 'ARP has no authentication whatsoever — any reply is believed, requested or not'],
        ['★ See it happen', '<span class="nw-m">sudo tcpdump -n -i eth0 arp</span> during a failover'],
      ])}
      <div class="box warn">The same property that makes failover instant makes <b>ARP spoofing</b> trivial. There is no protocol-level defence; every defence is a switch feature.</div>`,
  },

  {
    t: '★ ARP spoofing, and how to see it',
    body: `${CSS}
      ${flow('attacker', 'victim and gateway', [
        ['r', 'unrequested reply: "10.0.0.1 is at MY MAC"', 'to the victim'],
        ['r', 'unrequested reply: "10.0.0.42 is at MY MAC"', 'to the gateway'],
        ['l', 'all traffic now flows through the attacker', 'both sides believe it'],
      ])}
      ${term(`<span class="c"># Symptom: two different IPs sharing ONE MAC address</span>
<span class="p">$</span> <span class="k">ip neigh</span> | <span class="k">awk</span> '{print $5}' | <span class="k">sort</span> | <span class="k">uniq</span> -d
<span class="r">00:11:22:33:44:55</span>     <span class="c"># the gateway and a PC cannot share a NIC</span>

<span class="c"># Defence lives on the SWITCH, not on the host:</span>
<span class="p">SW(config)#</span> <span class="k">ip dhcp snooping</span>
<span class="p">SW(config)#</span> <span class="k">ip arp inspection vlan 10</span>`, 'sm')}`,
  },

  {
    t: '★ Proxy ARP — a router answering on someone else\'s behalf',
    body: `${CSS}
      ${topo([
        'nd:host|10.0.0.42/16', 'lk:asks for 10.1.0.9|',
        'nd.rt:R1|answers with its OWN MAC', 'lk:routes onward|',
        'nd:10.1.0.9|different segment',
      ])}
      ${kv([
        ['What happens', 'the host wrongly believes 10.1.0.9 is on its own LAN · the router replies anyway and forwards'],
        ['When it helps', 'a host with a too-wide mask, or a legacy device that cannot be given a gateway'],
        ['Why it is usually wrong', 'it hides a misconfiguration, doubles ARP traffic, and makes the ARP table a mess'],
        ['Check it', '<span class="nw-m">cat /proc/sys/net/ipv4/conf/eth0/proxy_arp</span> — expect 0'],
      ])}
      <div class="box warn">Symptom of proxy ARP hiding a bad mask: <b>one MAC address appears against a dozen different IPs</b> — which looks exactly like an ARP spoofing attack.</div>`,
  },

  /* ── 8.3 Neighbor Discovery ──────────────────────────────────────────── */
  {
    t: 'IPv6 has no ARP at all',
    body: `${CSS}
      <table class="t">
        <tr><th>Job</th><th>IPv4</th><th>IPv6</th></tr>
        <tr><td>find a neighbour's MAC</td><td>ARP request</td><td class="hl">Neighbor Solicitation (ICMPv6 135)</td></tr>
        <tr><td>answer with a MAC</td><td>ARP reply</td><td class="hl">Neighbor Advertisement (ICMPv6 136)</td></tr>
        <tr><td>find the router</td><td>DHCP, or typed by hand</td><td>Router Solicitation / Advertisement (133 / 134)</td></tr>
        <tr><td>check nobody else has my address</td><td>gratuitous ARP, optional</td><td>Duplicate Address Detection, <b>mandatory</b></td></tr>
        <tr><td>carried by</td><td>its own EtherType 0x0806</td><td><b>ICMPv6</b> — inside IP</td></tr>
      </table>
      <div class="box warn">Because Neighbor Discovery <b>is</b> ICMPv6, a firewall rule that drops ICMPv6 stops hosts from finding each other at all. On IPv4 you can block ICMP and still reach your neighbour; on IPv6 you cannot.</div>`,
  },

  {
    t: 'Neighbor Solicitation and Advertisement',
    body: `${CSS}
      ${flow('host A', 'host B', [
        ['r', 'NS — ICMPv6 type 135', 'to ff02::1:ff1a:2b3c, not to everyone'],
        ['l', 'NA — ICMPv6 type 136', 'unicast, carries B\'s MAC'],
      ])}
      ${kv([
        ['The destination is a multicast group', 'built from the last 24 bits of the target address — see the next slide'],
        ['Who gets interrupted', 'usually exactly one NIC, instead of every machine on the LAN'],
        ['Source link-layer option', 'the NS carries A\'s own MAC, so B learns A in the same exchange'],
        ['Result', 'both neighbour caches are populated by one round trip — same as ARP, far quieter'],
      ])}`,
  },

  { t: 'How the solicited-node address is built', body: `${CSS}${SNMA}` },

  {
    t: 'Router Solicitation, Advertisement and SLAAC',
    body: `${CSS}
      ${flow('a host that just booted', 'the router', [
        ['r', 'RS — ICMPv6 type 133', 'to ff02::2, "all routers"'],
        ['l', 'RA — ICMPv6 type 134', 'prefix 2001:db8:acad:1::/64 · I am your gateway'],
        ['r', 'host builds its own address', 'prefix + interface ID · no DHCP server involved'],
      ])}
      ${kv([
        ['SLAAC', 'Stateless Address Autoconfiguration — the host makes its own address from the prefix'],
        ['Why "stateless"', 'no server records who got what · nothing to run out, nothing to back up'],
        ['The default gateway', 'comes from the RA itself, not from DHCP — this is why IPv6 needs no gateway setting'],
        ['★ Consequence', 'an unauthorised RA on your LAN can hijack IPv6 routing · switches block it with <span class="nw-m">RA Guard</span>'],
      ])}`,
  },

  {
    t: 'Duplicate Address Detection — asking before claiming',
    body: `${CSS}
      ${flow('host, address still "tentative"', 'the LAN', [
        ['r', 'NS for the address I intend to use', 'source :: — I own nothing yet'],
        ['l', 'silence', 'nobody has it → the address becomes mine'],
        ['l', 'an NA arrives', 'somebody HAS it → my address is disabled'],
      ])}
      ${kv([
        ['Mandatory in IPv6', 'every address, including the automatic link-local one, is verified before use'],
        ['IPv4 equivalent', 'gratuitous ARP at boot — optional, and frequently skipped'],
        ['★ What a failure looks like', '<span class="nw-m">ip -6 addr</span> shows the address flagged <span class="nw-m">dadfailed</span>'],
        ['★ Why you will meet it', 'two containers or two VMs cloned with the same MAC generate the same link-local address'],
      ])}`,
  },

  {
    t: '★ The neighbour table on a real IPv6 server',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">ip -6 neigh</span> show
<span class="g">fe80::1 dev eth0 lladdr aa:bb:cc:dd:ee:ff router REACHABLE</span>
<span class="g">2001:db8:acad:1::9 dev eth0 lladdr 52:54:00:12:34:56 STALE</span>

<span class="c"># the word "router" is there because that neighbour sent Router Advertisements</span>

<span class="p">$</span> <span class="k">ip -6 route</span> show default
<span class="g">default via fe80::1 dev eth0 proto ra metric 100</span>
<span class="c">#            ^ a LINK-LOCAL address    ^ learned from an RA, not typed</span>`, 'sm')}
      ${kv([
        ['<b>fe80::/10</b>', 'link-local · every IPv6 interface has one, automatically, always'],
        ['The default route points at a link-local address', 'normal and correct · the gateway is a neighbour, and neighbours are addressed link-locally'],
        ['<span class="nw-m">proto ra</span>', 'this route was learned from a Router Advertisement — nobody configured it'],
      ])}`,
  },

  {
    t: 'ARP and Neighbor Discovery, side by side',
    body: `${CSS}
      <table class="t">
        <tr><th></th><th>ARP (IPv4)</th><th>Neighbor Discovery (IPv6)</th></tr>
        <tr><td>carried by</td><td>Ethernet, EtherType 0x0806</td><td>ICMPv6, inside IPv6</td></tr>
        <tr><td>the question goes to</td><td class="hl">every machine (broadcast)</td><td class="hl">a group of ~1 (multicast)</td></tr>
        <tr><td>can it cross a router</td><td>no</td><td>no — hop limit is 255 and checked</td></tr>
        <tr><td>authentication</td><td>none</td><td>none by default (SEND exists, unused)</td></tr>
        <tr><td>finds the gateway</td><td>no — DHCP or manual</td><td>yes — Router Advertisement</td></tr>
        <tr><td>duplicate detection</td><td>optional</td><td>mandatory</td></tr>
      </table>
      <div class="box ok">Same problem, thirty years apart. The design changes all follow from one lesson learned: <b>do not interrupt every machine on the network to ask one question.</b></div>`,
  },

  {
    t: 'Reading a broken LAN through its neighbour table',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Gateway entry says FAILED</th><td>Nobody is answering for the gateway IP. Either the gateway address is wrong, or you are in the wrong VLAN, or its interface is shut. Check the address first — it is wrong far more often than the router is broken.</td></tr>
        <tr><th>Table is empty and stays empty</th><td>The interface is down, or has no IP, or the switch port is in a VLAN with nobody in it. <span class="nw-m">ip -br addr</span> and <span class="nw-m">ip -br link</span> before anything else.</td></tr>
        <tr><th>Two IPs share one MAC</th><td>ARP spoofing, proxy ARP, or a load balancer. Look at which IPs — a gateway sharing a MAC with a PC is an attack; several service IPs on one server is normal.</td></tr>
        <tr><th>One IP, two MACs over time</th><td>A duplicate IP address. Two machines are both claiming it and overwriting each other's entries, and connections break every few seconds.</td></tr>
      </table>`,
  },

  {
    t: '8.4 — using AI on this material, safely',
    body: `${CSS}
      ${kv([
        ['Good use', 'paste a real <span class="nw-m">ip neigh</span> output and ask which line explains the symptom you see'],
        ['Good use', 'ask it to explain why an ARP request must be a broadcast but the reply need not be'],
        ['Good use', 'have it build practice questions on the ARP header field by field, then check them against this deck'],
        ['<b>Dangerous</b>', 'accepting invented command output as evidence about YOUR network'],
        ['<b>Dangerous</b>', 'asking "is my gateway reachable?" — only your machine can answer that'],
        ['The rule', 'AI forms the hypothesis · a command tests it · never the other way round'],
      ])}
      <div class="box warn">This is a CLO9 requirement, so it will be assessed. Be ready to describe <em>both</em> a case where AI helped and a case where you caught it being confidently wrong.</div>`,
  },

  {
    t: 'Chapter 8 — what you must be able to do',
    body: `${CSS}
      ${kv([
        ['Explain', 'why a packet needs both a MAC and an IP address, and which one changes at each hop'],
        ['State', 'whose MAC a host asks for when the destination is local, and whose when it is remote'],
        ['Describe', 'the ARP exchange: broadcast question, unicast answer, both caches updated'],
        ['Name', 'every field of the ARP message and what an all-zero Target MAC means'],
        ['Read', 'an ARP or neighbour table on Linux and IOS, and say what each state means'],
        ['Explain', 'why ARP has no security and what a gratuitous ARP makes possible, good and bad'],
        ['Map', 'each ARP function onto its ICMPv6 Neighbor Discovery equivalent'],
        ['Build', 'a solicited-node multicast address from a target IPv6 address'],
        ['★ Diagnose', 'a LAN fault from the neighbour table alone — FAILED, empty, duplicated MAC, flapping'],
      ])}`,
  },
];
