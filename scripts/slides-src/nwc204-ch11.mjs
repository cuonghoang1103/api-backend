/**
 * nwc204-ch11.mjs — NWC204 Chapter 11: IPv6 Addressing
 * (FLM buổi 35–36, Cisco Module 12).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 35, 36.
 *   buổi 35: 11.1 IPv6 Addressing · 11.2 IPv4 Issues · 11.3 IPv6 Addressing
 *            · 11.4 IPv6 Address Types          ⚠️ 11.1 và 11.3 TRÙNG TÊN
 *   buổi 36: 11.5 GUA and LLA Static Configuration · 11.6 Dynamic Addressing for
 *            IPv6 GUAs · 11.7 Dynamic Addressing for IPv6 LLAs · 11.8 IPv6
 *            Multicast Addresses · 11.9 Subnet an IPv6 Network · 11.10 Integrate
 *            AI Tools (Self Learning)
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 12: 13 địa chỉ fe80:: có sẵn trên
 *     VPS thật mà không ai cấu hình, EUI-64 kiểm ngược từ MAC THẬT của router
 *     thượng nguồn, nginx đã `listen [::]` sẵn, và bẫy ::1 so với 127.0.0.1.
 *
 * ⚠️ Mọi con số/địa chỉ trong deck này đã kiểm bằng python3 ipaddress, và bộ
 *    tính solicited-node đã tự nghiệm thu bằng ví dụ của RFC 4291 TRƯỚC khi dùng
 *    (bản đầu tiên thiếu một byte `ff` và ra kết quả trông hợp lý mà SAI).
 * ⚠️ SVG: viewBox="0 0 900 h" width="1150". Chữ đơn cách rộng 0,602 × font-size
 *    ⇒ font 15 tối đa ~99 ký tự/dòng từ x=4. Chữ trong <rect> phải NGẮN HƠN rect.
 *
 * 27 slide (1 bìa + 26 nội dung); 24 trong số đó là sơ đồ, SVG, bảng hoặc terminal.
 */
import { CSS, topo, term, kv, code, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch11',
  code: 'NWC204',
  title: 'Ch.11 — IPv6 Addressing',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: the scale of the change ──────────────────────────────────────── */
const SCALE = `<svg class="nw-svg" viewBox="0 0 900 236" width="1150" height="328"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">32 bits to 128 bits is not four times bigger. It is four times bigger in the EXPONENT.</text>
  <rect x="20" y="34" width="120" height="46" rx="6" fill="#fdf6ea" stroke="#e0952a" stroke-width="2.5"/>
  <text x="80" y="54" text-anchor="middle" font-size="15" font-weight="800" fill="#7a4708">IPv4</text>
  <text x="80" y="72" text-anchor="middle" font-size="13" fill="#3c5570">32 bits</text>
  <text x="160" y="62" font-size="15" fill="#25405e">4,294,967,296 addresses — fewer than there are people</text>
  <rect x="20" y="94" width="120" height="46" rx="6" fill="#eefaf4" stroke="#1f9d6b" stroke-width="2.5"/>
  <text x="80" y="114" text-anchor="middle" font-size="15" font-weight="800" fill="#14603f">IPv6</text>
  <text x="80" y="132" text-anchor="middle" font-size="13" fill="#3c5570">128 bits</text>
  <text x="160" y="116" font-size="14" fill="#25405e">340,282,366,920,938,463,463,374,607,431,768,211,456</text>
  <text x="160" y="136" font-size="13" fill="#5d7288">= 340 undecillion, or 2 to the power 128</text>
  <text x="4" y="172" fill="#1b5fa8" font-size="15" font-weight="700">The number that makes it concrete: ONE /64 subnet holds 18,446,744,073,709,551,616</text>
  <text x="4" y="194" fill="#1b5fa8" font-size="15" font-weight="700">addresses — that single subnet is 4,294,967,296 times the WHOLE IPv4 Internet.</text>
  <text x="4" y="224" fill="#5d7288" font-size="14">Consequence: in IPv6 you never subnet to save addresses. You subnet to organise them.</text>
</svg>`;

/* ── SVG: 128 bits as eight hextets ────────────────────────────────────── */
const STRUCT6 = `<svg class="nw-svg" viewBox="0 0 900 250" width="1150" height="347"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">128 bits written as eight groups of four hex digits, separated by colons</text>
  <g stroke="#1b5fa8" stroke-width="2" fill="#fff">
    <rect x="16" y="30" width="104" height="40" rx="5"/><rect x="126" y="30" width="104" height="40" rx="5"/>
    <rect x="236" y="30" width="104" height="40" rx="5"/><rect x="346" y="30" width="104" height="40" rx="5"/>
    <rect x="456" y="30" width="104" height="40" rx="5"/><rect x="566" y="30" width="104" height="40" rx="5"/>
    <rect x="676" y="30" width="104" height="40" rx="5"/><rect x="786" y="30" width="98" height="40" rx="5"/>
  </g>
  <g text-anchor="middle" font-size="16" font-weight="800" fill="#0f2a4a">
    <text x="68" y="56">2001</text><text x="178" y="56">0db8</text><text x="288" y="56">acad</text>
    <text x="398" y="56">0001</text><text x="508" y="56">0000</text><text x="618" y="56">0000</text>
    <text x="728" y="56">0000</text><text x="835" y="56">0100</text>
  </g>
  <g text-anchor="middle" font-size="11" fill="#8aa0b6">
    <text x="68" y="84">16 bits</text><text x="178" y="84">16</text><text x="288" y="84">16</text>
    <text x="398" y="84">16</text><text x="508" y="84">16</text><text x="618" y="84">16</text>
    <text x="728" y="84">16</text><text x="835" y="84">16</text>
  </g>
  <rect x="16" y="98" width="434" height="38" rx="5" fill="#eef5fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <rect x="456" y="98" width="428" height="38" rx="5" fill="#fff5d6" stroke="#b4690e" stroke-width="2.5"/>
  <text x="233" y="122" text-anchor="middle" font-size="15" font-weight="800" fill="#1b5fa8">PREFIX — 64 bits</text>
  <text x="670" y="122" text-anchor="middle" font-size="15" font-weight="800" fill="#7a4708">INTERFACE ID — 64 bits</text>
  <text x="4" y="164" fill="#0f2a4a" font-size="15" font-weight="700">Each group is a HEXTET. Each hex digit is 4 bits, so 4 digits = 16 bits per group.</text>
  <text x="4" y="188" fill="#25405e" font-size="14">This is why Chapter 4B taught hexadecimal: 128 bits in binary would be unreadable.</text>
  <text x="4" y="214" fill="#1b5fa8" font-size="15" font-weight="700">Unlike IPv4, the split is almost always at /64 — and that is a rule, not a choice.</text>
  <text x="4" y="238" fill="#5d7288" font-size="14">The whole address above compresses to 2001:db8:acad:1::100. Next slide shows how.</text>
</svg>`;

/* ── SVG: the two compression rules ────────────────────────────────────── */
const COMPRESS = `<svg class="nw-svg" viewBox="0 0 900 268" width="1150" height="372"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Two rules, applied in this order. There is no third rule.</text>
  <text x="4" y="46" fill="#1b5fa8" font-size="15" font-weight="800">RULE 1 — drop LEADING zeros inside a hextet (never trailing)</text>
  <text x="24" y="72" font-size="15" fill="#25405e">2001:<tspan fill="#d94b4b">0</tspan>db8:acad:<tspan fill="#d94b4b">000</tspan>1:<tspan fill="#d94b4b">000</tspan>0:<tspan fill="#d94b4b">000</tspan>0:<tspan fill="#d94b4b">000</tspan>0:<tspan fill="#d94b4b">0</tspan>100</text>
  <text x="24" y="96" font-size="15" fill="#14603f" font-weight="700">2001:db8:acad:1:0:0:0:100</text>
  <text x="4" y="130" fill="#1b5fa8" font-size="15" font-weight="800">RULE 2 — replace ONE run of all-zero hextets with ::</text>
  <text x="24" y="156" font-size="15" fill="#25405e">2001:db8:acad:1:<tspan fill="#d94b4b" font-weight="700">0:0:0</tspan>:100</text>
  <text x="24" y="180" font-size="15" fill="#14603f" font-weight="700">2001:db8:acad:1::100</text>
  <rect x="166" y="143" width="51" height="18" fill="none" stroke="#d94b4b" stroke-width="2" rx="3"/>
  <text x="290" y="157" font-size="12" fill="#d94b4b" font-weight="700">this run, and only this run</text>
  <text x="4" y="216" fill="#d94b4b" font-size="15" font-weight="700">:: may appear AT MOST ONCE. Twice is ambiguous — nothing says how to split the zeros.</text>
  <text x="4" y="240" fill="#5d7288" font-size="14">2001:db8::acad::1 is INVALID. A parser cannot know if :: means one hextet or five.</text>
  <text x="4" y="262" fill="#5d7288" font-size="14">Dropping trailing zeros is also wrong: 0100 is not 01, and abcd is not abc.</text>
</svg>`;

/* ── SVG: /64 is a hard boundary ───────────────────────────────────────── */
const P64 = `<svg class="nw-svg" viewBox="0 0 900 250" width="1150" height="347"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">The three prefixes that matter, and why /64 is where you stop</text>
  <g font-size="13">
    <text x="4" y="46" fill="#3c5570" font-weight="700">/48</text>
    <rect x="52" y="34" width="330" height="22" fill="#1b5fa8"/>
    <rect x="382" y="34" width="110" height="22" fill="#7ad0c7"/>
    <rect x="492" y="34" width="392" height="22" fill="#e0952a"/>
    <text x="217" y="50" text-anchor="middle" fill="#fff" font-weight="700">global routing prefix</text>
    <text x="437" y="50" text-anchor="middle" fill="#0f2a4a" font-weight="700">subnet</text>
    <text x="688" y="50" text-anchor="middle" fill="#fff" font-weight="700">interface ID</text>

    <text x="4" y="86" fill="#3c5570" font-weight="700">/56</text>
    <rect x="52" y="74" width="385" height="22" fill="#1b5fa8"/>
    <rect x="437" y="74" width="55" height="22" fill="#7ad0c7"/>
    <rect x="492" y="74" width="392" height="22" fill="#e0952a"/>
    <text x="244" y="90" text-anchor="middle" fill="#fff" font-weight="700">typical home allocation</text>
    <text x="688" y="90" text-anchor="middle" fill="#fff" font-weight="700">interface ID</text>

    <text x="4" y="126" fill="#3c5570" font-weight="700">/64</text>
    <rect x="52" y="114" width="440" height="22" fill="#1b5fa8"/>
    <rect x="492" y="114" width="392" height="22" fill="#e0952a"/>
    <text x="272" y="130" text-anchor="middle" fill="#fff" font-weight="700">one subnet, one LAN</text>
    <text x="688" y="130" text-anchor="middle" fill="#fff" font-weight="700">interface ID — 64 bits</text>
  </g>
  <text x="4" y="164" fill="#1b5fa8" font-size="14" font-weight="700">A /48 gives 65,536 subnets. A /56 gives 256. Both are sized for HUMANS, not for hosts.</text>
  <text x="4" y="190" fill="#d94b4b" font-size="14" font-weight="700">Do NOT use a prefix longer than /64 on a LAN. SLAAC needs exactly 64 interface bits</text>
  <text x="4" y="212" fill="#d94b4b" font-size="14" font-weight="700">and simply stops working — the host gets no address and nothing explains why.</text>
  <text x="4" y="240" fill="#5d7288" font-size="14">The one exception: /127 on point-to-point router links, and /128 on loopbacks.</text>
</svg>`;

/* ── SVG: address types ────────────────────────────────────────────────── */
const TYPES = `<svg class="nw-svg" viewBox="0 0 900 262" width="1150" height="364"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">IPv6 has THREE kinds of address, and broadcast is not one of them</text>
  <g stroke-width="2.5">
    <rect x="12" y="30" width="282" height="128" rx="8" fill="#f7fbff" stroke="#1b5fa8"/>
    <rect x="309" y="30" width="282" height="128" rx="8" fill="#eefaf4" stroke="#1f9d6b"/>
    <rect x="606" y="30" width="282" height="128" rx="8" fill="#fdf6ea" stroke="#e0952a"/>
  </g>
  <g text-anchor="middle" font-weight="800" font-size="17">
    <text x="153" y="54" fill="#1b5fa8">UNICAST</text>
    <text x="450" y="54" fill="#14603f">MULTICAST</text>
    <text x="747" y="54" fill="#7a4708">ANYCAST</text>
  </g>
  <g text-anchor="middle" font-size="13" fill="#3c5570">
    <text x="153" y="78">one interface</text>
    <text x="450" y="78">a group of interfaces</text>
    <text x="747" y="78">the NEAREST of many</text>
  </g>
  <g text-anchor="middle" font-size="12" fill="#25405e">
    <text x="153" y="104">GUA  2000::/3</text>
    <text x="153" y="122">LLA  fe80::/10</text>
    <text x="153" y="140">ULA  fc00::/7</text>
    <text x="450" y="104">ff00::/8</text>
    <text x="450" y="122">ff02::1 all nodes</text>
    <text x="450" y="140">ff02::2 all routers</text>
    <text x="747" y="104">looks like a unicast</text>
    <text x="747" y="122">many hosts share it</text>
    <text x="747" y="140">DNS root, CDNs</text>
  </g>
  <text x="4" y="192" fill="#d94b4b" font-size="15" font-weight="700">There is NO broadcast in IPv6. It was removed on purpose.</text>
  <text x="4" y="216" fill="#25405e" font-size="14">Broadcast interrupts every device on the link, including the ones that cannot use it.</text>
  <text x="4" y="238" fill="#25405e" font-size="14">Multicast reaches only the group, so a host that joined nothing is never interrupted.</text>
  <text x="4" y="258" fill="#5d7288" font-size="14">ff02::1 does what a broadcast did, but a host can choose how much it listens to.</text>
</svg>`;

/* ── SVG: EUI-64 worked from a REAL mac ────────────────────────────────── */
const EUI = `<svg class="nw-svg" viewBox="0 0 900 262" width="1150" height="364"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">★ EUI-64, worked on the REAL upstream router of a production VPS</text>
  <text x="4" y="48" fill="#3c5570" font-size="14" font-weight="700">1. the MAC address, 48 bits</text>
  <text x="40" y="72" font-size="17" font-weight="800" fill="#0f2a4a">96:3d:fa : 00:04:e9</text>
  <text x="330" y="72" font-size="13" fill="#5d7288">left half = vendor (OUI), right half = serial</text>
  <text x="4" y="102" fill="#3c5570" font-size="14" font-weight="700">2. insert ff:fe in the middle — 48 becomes 64 bits</text>
  <text x="40" y="126" font-size="17" font-weight="800" fill="#0f2a4a">96:3d:fa : <tspan fill="#d94b4b">ff:fe</tspan> : 00:04:e9</text>
  <text x="4" y="156" fill="#3c5570" font-size="14" font-weight="700">3. flip the 7th bit of the first byte — 0x96 XOR 0x02 = 0x94</text>
  <text x="40" y="180" font-size="17" font-weight="800" fill="#14603f"><tspan fill="#d94b4b">94</tspan>:3d:fa : ff:fe : 00:04:e9</text>
  <text x="4" y="210" fill="#1b5fa8" font-size="15" font-weight="800">4. prepend fe80:: and regroup into hextets</text>
  <text x="40" y="234" font-size="18" font-weight="800" fill="#14603f">fe80::943d:faff:fe00:4e9</text>
  <text x="4" y="256" fill="#1f9d6b" font-size="14" font-weight="700">That is byte-for-byte what ip -6 neigh reports on the server. Verified, not claimed.</text>
</svg>`;

/* ── SVG: how a host gets a GUA ────────────────────────────────────────── */
const SLAAC = `<svg class="nw-svg" viewBox="0 0 900 268" width="1150" height="372"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">How a host gets a global address — the router's RA decides, via two flags</text>
  <rect x="300" y="30" width="300" height="42" rx="8" fill="#eef5fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="450" y="47" text-anchor="middle" font-size="14" font-weight="800" fill="#1b5fa8">Router Advertisement, ICMPv6 134</text>
  <text x="450" y="65" text-anchor="middle" font-size="12" fill="#3c5570">to ff02::1, or after an RS to ff02::2</text>
  <g stroke="#1b5fa8" stroke-width="2.5" fill="none">
    <line x1="450" y1="72" x2="450" y2="88"/>
    <line x1="150" y1="88" x2="750" y2="88"/>
    <line x1="150" y1="88" x2="150" y2="104"/><line x1="450" y1="88" x2="450" y2="104"/>
    <line x1="750" y1="88" x2="750" y2="104"/>
    <polygon points="144,104 150,116 156,104" fill="#1b5fa8" stroke="none"/>
    <polygon points="444,104 450,116 456,104" fill="#1b5fa8" stroke="none"/>
    <polygon points="744,104 750,116 756,104" fill="#1b5fa8" stroke="none"/>
  </g>
  <g stroke-width="2.5">
    <rect x="30" y="118" width="240" height="72" rx="8" fill="#eefaf4" stroke="#1f9d6b"/>
    <rect x="330" y="118" width="240" height="72" rx="8" fill="#fdf6ea" stroke="#e0952a"/>
    <rect x="630" y="118" width="240" height="72" rx="8" fill="#f7fbff" stroke="#1b5fa8"/>
  </g>
  <g text-anchor="middle">
    <text x="150" y="140" font-size="15" font-weight="800" fill="#14603f">M=0  O=0</text>
    <text x="150" y="160" font-size="13" fill="#3c5570">SLAAC only</text>
    <text x="150" y="180" font-size="12" fill="#5d7288">host builds it itself</text>
    <text x="450" y="140" font-size="15" font-weight="800" fill="#7a4708">M=0  O=1</text>
    <text x="450" y="160" font-size="13" fill="#3c5570">SLAAC + stateless DHCPv6</text>
    <text x="450" y="180" font-size="12" fill="#5d7288">address self, DNS from DHCP</text>
    <text x="750" y="140" font-size="15" font-weight="800" fill="#1b5fa8">M=1</text>
    <text x="750" y="160" font-size="13" fill="#3c5570">stateful DHCPv6</text>
    <text x="750" y="180" font-size="12" fill="#5d7288">server hands out addresses</text>
  </g>
  <text x="4" y="222" fill="#1b5fa8" font-size="14" font-weight="700">In every case the RA supplies the PREFIX. Only the interface ID differs in how it is made.</text>
  <text x="4" y="246" fill="#5d7288" font-size="14">SLAAC interface ID: EUI-64 from the MAC, or a random privacy address (RFC 4941).</text>
  <text x="4" y="266" fill="#d94b4b" font-size="14" font-weight="700">No RA on the link = no GUA, no matter how the host is configured. Start debugging there.</text>
</svg>`;

/* ── SVG: solicited-node multicast ─────────────────────────────────────── */
const SOLIC = `<svg class="nw-svg" viewBox="0 0 900 250" width="1150" height="347"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Solicited-node multicast: how IPv6 finds a neighbour without shouting at everyone</text>
  <text x="4" y="48" fill="#3c5570" font-size="14" font-weight="700">target address</text>
  <text x="200" y="48" font-size="16" font-weight="800" fill="#0f2a4a">2001:db8:acad:1::<tspan fill="#d94b4b">1</tspan><tspan fill="#d94b4b">00</tspan></text>
  <text x="600" y="48" font-size="12" fill="#5d7288">only the last 24 bits matter</text>
  <g stroke="#1b5fa8" stroke-width="2.5" fill="none">
    <line x1="450" y1="58" x2="450" y2="76"/><polygon points="444,76 450,88 456,76" fill="#1b5fa8" stroke="none"/>
  </g>
  <text x="4" y="112" fill="#3c5570" font-size="14" font-weight="700">group address</text>
  <text x="200" y="112" font-size="16" font-weight="800" fill="#14603f">ff02::1:ff<tspan fill="#d94b4b">00:100</tspan></text>
  <text x="4" y="146" fill="#3c5570" font-size="14" font-weight="700">ethernet MAC</text>
  <text x="200" y="146" font-size="16" font-weight="800" fill="#14603f">33:33:<tspan fill="#d94b4b">ff:00:01:00</tspan></text>
  <text x="520" y="146" font-size="12" fill="#5d7288">33:33 + last 32 bits of the group</text>
  <text x="4" y="182" fill="#1b5fa8" font-size="14" font-weight="700">The NIC filters on that MAC in hardware, so uninterested hosts are never woken.</text>
  <text x="4" y="206" fill="#25405e" font-size="14">This is what replaces ARP. Neighbor Solicitation (ICMPv6 135) goes to this group only.</text>
  <text x="4" y="228" fill="#5d7288" font-size="14">Collisions are possible and harmless: ...:acad::100 and ...:9999:7::100 share a group.</text>
  <text x="4" y="248" fill="#5d7288" font-size="14">Those few hosts check the full address and only the real owner replies.</text>
</svg>`;

/* ── SVG: ★ the ::1 trap ───────────────────────────────────────────────── */
const LOCALHOST = `<svg class="nw-svg" viewBox="0 0 900 244" width="1150" height="339"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">★ The IPv6 bug you will actually hit: localhost is TWO addresses</text>
  <g stroke-width="2.5">
    <rect x="20" y="32" width="400" height="96" rx="8" fill="#fdeeee" stroke="#d94b4b"/>
    <rect x="480" y="32" width="400" height="96" rx="8" fill="#eefaf4" stroke="#1f9d6b"/>
  </g>
  <text x="220" y="56" text-anchor="middle" font-size="15" font-weight="800" fill="#8f2c2c">service bound to 127.0.0.1</text>
  <text x="220" y="80" text-anchor="middle" font-size="13" fill="#3c5570">client asks for "localhost"</text>
  <text x="220" y="100" text-anchor="middle" font-size="13" fill="#3c5570">resolver returns ::1 FIRST</text>
  <text x="220" y="120" text-anchor="middle" font-size="14" fill="#8f2c2c" font-weight="700">ECONNREFUSED</text>
  <text x="680" y="56" text-anchor="middle" font-size="15" font-weight="800" fill="#14603f">service bound to ::</text>
  <text x="680" y="80" text-anchor="middle" font-size="13" fill="#3c5570">listens on BOTH families</text>
  <text x="680" y="100" text-anchor="middle" font-size="13" fill="#3c5570">::1 and 127.0.0.1 both work</text>
  <text x="680" y="120" text-anchor="middle" font-size="14" fill="#14603f" font-weight="700">connected</text>
  <text x="4" y="162" fill="#d94b4b" font-size="14" font-weight="700">The symptom is maddening: curl 127.0.0.1:3000 works, curl localhost:3000 refuses.</text>
  <text x="4" y="186" fill="#1b5fa8" font-size="14" font-weight="700">Prove it in one second: curl -4 localhost:3000 versus curl -6 localhost:3000.</text>
  <text x="4" y="212" fill="#25405e" font-size="14">Since Node 17 the resolver no longer reorders results, so ::1 now comes first far more</text>
  <text x="4" y="234" fill="#25405e" font-size="14">often than it used to — which is why this started biting projects that never changed.</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'IPv6 Addressing',
    sub: 'Chapter 11 — Cisco Module 12',
    body: `<div class="cov-meta">Sessions 35–36 of 60 · CLO5, CLO9<br>
      11.1 / 11.3 IPv6 Addressing · 11.2 IPv4 Issues · 11.4 Address Types<br>
      11.5 Static GUA and LLA · 11.6–11.7 Dynamic Addressing · 11.8 Multicast<br>
      11.9 Subnet an IPv6 Network · 11.10 AI Tools<br>
      ★ marks material added by cuongthai.com, beyond Cisco Module 12</div>`,
  },

  /* ── session 35 ──────────────────────────────────────────────────────── */
  {
    t: 'Two sessions, and what carries over from Chapter 10',
    body: `${CSS}
      ${kv([
        ['Session 35', '11.1 IPv6 Addressing · 11.2 IPv4 Issues · <b>11.3 IPv6 Addressing</b> · 11.4 Address Types'],
        ['Session 36', '11.5 static GUA/LLA · 11.6–11.7 dynamic · 11.8 multicast · 11.9 subnetting · 11.10 AI'],
        ['Carries over', 'prefix, network portion, host portion, bitwise thinking — <b>all unchanged</b>'],
        ['What is new', '128 bits instead of 32, hexadecimal notation, and <b>no broadcast</b>'],
        ['Prerequisite', 'hexadecimal, from <b>Chapter 4B</b> — the school schedules no session for it'],
      ])}
      <div class="box warn">⚠️ <b>The published plan lists "11.1 IPv6 Addressing" and then "11.3 IPv6 Addressing"</b> — the same title twice, with no 11.2-style topic between them other than "IPv4 Issues". We teach what is listed and report the duplication rather than inventing a section to fill it.</div>`,
  },

  {
    t: '11.2 Why IPv4 ran out, and what was done about it',
    body: `${CSS}
      ${kv([
        ['The arithmetic', '2^32 = <b>4,294,967,296</b> addresses, for a planet of 8 billion people'],
        ['Exhausted', 'IANA handed out the last blocks in <b>2011</b>; the regional registries followed'],
        ['Patch 1 — NAT', 'many private hosts behind one public address. Bought two decades.'],
        ['Patch 2 — CGNAT', '<b>100.64.0.0/10</b> — even the customer gets a private address'],
        ['The real cost', 'NAT breaks end-to-end. No inbound connection without a forwarding rule.'],
      ])}
      <div class="box">★ You have met the cost already. A server behind CGNAT cannot accept an inbound connection at all — there is no public address to forward FROM, which is why a tunnel service is needed to expose anything from such a line. IPv6 removes the problem by having enough addresses that NAT is unnecessary.</div>`,
  },

  { t: 'The scale of the change', body: `${CSS}${SCALE}` },

  { t: '11.1 The structure: 128 bits, eight hextets', body: `${CSS}${STRUCT6}` },

  { t: 'Compressing an address — two rules', body: `${CSS}${COMPRESS}` },

  {
    t: 'Compression, worked both ways',
    body: `${CSS}
      <table class="t"><thead><tr><th>Full form</th><th>Compressed</th><th>Watch out for</th></tr></thead>
      <tbody>
        <tr><td>2001:0db8:0000:0000:0000:0000:0000:0001</td><td class="hl">2001:db8::1</td><td>one long zero run</td></tr>
        <tr><td>2001:0db8:acad:0001:0000:0000:0000:0100</td><td class="hl">2001:db8:acad:1::100</td><td>0100 keeps its zeros</td></tr>
        <tr><td>fe80:0000:0000:0000:49ae:5537:795c:ff65</td><td class="hl">fe80::49ae:5537:795c:ff65</td><td>a real address from a VPS</td></tr>
        <tr><td>0000:…:0000:0001</td><td class="hl">::1</td><td>loopback</td></tr>
        <tr><td>0000:…:0000:0000</td><td class="hl">::</td><td>unspecified, or "all interfaces"</td></tr>
      </tbody></table>
      <div class="box ok">Check yourself with one command — it prints the canonical compressed form, which is the one an exam wants:<br>${m('python3 -c "import ipaddress as i; print(i.ip_address(\'2001:0db8:acad:0001:0000:0000:0000:0100\').compressed)"')}</div>`,
  },

  { t: 'Prefix lengths, and why /64 is a hard floor', body: `${CSS}${P64}` },

  { t: '11.4 Three kinds of address, and no broadcast', body: `${CSS}${TYPES}` },

  {
    t: 'GUA — the address the Internet can reach',
    body: `${CSS}
      ${kv([
        ['Range', '<b>2000::/3</b> — the first three bits are 001, so it starts with 2 or 3'],
        ['Equivalent to', 'an IPv4 public address, but there is no shortage and no NAT'],
        ['Typical allocation', 'a site gets a <b>/48</b>, a home line gets a <b>/56</b>, a LAN uses a <b>/64</b>'],
        ['Structure', '48 bits routing prefix · 16 bits subnet ID · 64 bits interface ID'],
        ['How a host gets one', 'from a Router Advertisement, statically, or via DHCPv6 — never invented locally'],
      ])}
      <div class="box warn">★ <b>Your VPS has no GUA at all.</b> Measured on a production server: thirteen interfaces, every one with an <span class="nw-m">fe80::</span> address, and not a single global one. The provider allocated IPv4 only. That is completely normal in 2026, and it is why the site is reachable over IPv4 while nginx already has <span class="nw-m">listen [::]:443</span> waiting.</div>`,
  },

  {
    t: 'LLA — the address that is always there',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">ip -6 -br addr</span>          <span class="c"># a real VPS, nobody configured any of this</span>
lo               UNKNOWN   <span class="g">::1/128</span>
eth0             UP        <span class="g">fe80::49ae:5537:795c:ff65/64</span>
docker0          UP        <span class="g">fe80::c8ac:bff:fed6:c31/64</span>
br-e4e65abd25c3  UP        <span class="g">fe80::7c59:f1ff:feb2:6437/64</span>
veth2c01473      UP        <span class="g">fe80::68ac:6cff:fea0:a218/64</span>
<span class="c">... nine more veth interfaces, all with an fe80:: address</span>`, 'sm')}
      ${kv([
        ['Range', '<b>fe80::/10</b>, in practice always fe80::/64'],
        ['Scope', 'this link only. A router NEVER forwards it.'],
        ['Mandatory', 'every IPv6 interface has one, automatically, always'],
        ['Used for', 'Neighbor Discovery, Router Advertisements, and as the <b>next hop of every route</b>'],
      ])}`,
  },

  {
    t: 'ULA and the special addresses',
    body: `${CSS}
      <table class="t"><thead><tr><th>Address</th><th>Name</th><th>IPv4 equivalent</th></tr></thead>
      <tbody>
        <tr><td class="hl">fc00::/7</td><td>Unique Local (ULA)</td><td>RFC 1918 private space</td></tr>
        <tr><td class="hl">::1/128</td><td>loopback</td><td>127.0.0.1</td></tr>
        <tr><td>::/128</td><td>unspecified — "I have no address yet"</td><td>0.0.0.0 as a source</td></tr>
        <tr><td>::/0</td><td>default route</td><td>0.0.0.0/0</td></tr>
        <tr><td>2001:db8::/32</td><td>documentation only</td><td>192.0.2.0/24 TEST-NET</td></tr>
      </tbody></table>
      <div class="box">★ <b>ULA is not as useful as RFC 1918 was</b>, and it is worth knowing why. Private IPv4 was necessary because addresses were scarce; ULA exists only for networks that must never be routed outside, such as a lab or a closed industrial system. If you have a GUA, use it — with a firewall, not with NAT. The firewall is where "not reachable" belongs, and it is a rule you can read.</div>`,
  },

  /* ── session 36 ──────────────────────────────────────────────────────── */
  {
    t: 'Session 36 — putting addresses on interfaces',
    body: `${CSS}
      ${kv([
        ['11.5', 'GUA and LLA static configuration — typing it in by hand'],
        ['11.6', 'Dynamic addressing for GUAs — SLAAC and DHCPv6'],
        ['11.7', 'Dynamic addressing for LLAs — which is to say, none needed'],
        ['11.8', 'IPv6 multicast addresses — what replaced broadcast and ARP'],
        ['11.9', 'Subnet an IPv6 network — easier than IPv4, for a surprising reason'],
        ['11.10', 'Integrate AI tools for explaining concepts (self learning)'],
      ])}
      <div class="box warn">⚠️ The school's question table has <b>no entry for session 36</b> — one of eight blank sessions (6, 9, 15, 16, 22, 30, 36, 56). It puts CQ12.2 on session 35, and that question asks about <b>IPv4</b> subnetting, which is Chapter 10's material. Reported, not corrected.</div>`,
  },

  {
    t: '11.5 Static configuration on IOS',
    body: `${CSS}
      ${code(`enable
configure terminal
ipv6 unicast-routing              ! off by default — the router forwards nothing without it
!
interface gigabitEthernet 0/0
 ipv6 address 2001:db8:acad:1::1/64      ! a global address
 ipv6 address fe80::1 link-local         ! optional: a readable link-local
 no shutdown
!
end
copy running-config startup-config`, 'bash', 'sm')}
      <div class="box warn"><b>Two things bite here.</b> <span class="nw-m">ipv6 unicast-routing</span> is OFF by default — without it the router holds addresses but forwards nothing and sends no Router Advertisements, so every host on the LAN silently fails to get an address. And setting an explicit <span class="nw-m">fe80::1</span> is worth doing: the automatic EUI-64 link-local is correct but unreadable, and it is the address that appears as the next hop in every routing table on the segment.</div>`,
  },

  { t: '★ EUI-64, checked against a real router', body: `${CSS}${EUI}` },

  { t: '11.6 How a host gets a global address', body: `${CSS}${SLAAC}` },

  {
    t: '11.7 Dynamic LLA, and the check that runs first',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span>Interface comes up. The host builds a link-local from EUI-64 or a random ID.</span></div>
        <div><span class="n">2</span><span><b>Duplicate Address Detection.</b> It sends a Neighbor Solicitation to its own proposed address.</span></div>
        <div><span class="n">3</span><span>If anybody answers, the address is in use and the interface stays unusable.</span></div>
        <div><span class="n">4</span><span>Silence means the address is free. Only then does the host use it.</span></div>
        <div><span class="n">5</span><span>It sends a Router Solicitation to ff02::2 and waits for an RA to learn the prefix.</span></div>
      </div>
      <div class="box ok">DAD is <b>mandatory</b> in IPv6 and runs on every address, including the link-local. IPv4 has nothing equivalent as a requirement — which is why two IPv4 hosts can share an address and both keep running badly, while in IPv6 the second one simply refuses to come up. A noisier failure, but an honest one.</div>`,
  },

  { t: '11.8 Multicast: what replaced broadcast and ARP', body: `${CSS}${SOLIC}` },

  {
    t: 'The multicast groups to recognise on sight',
    body: `${CSS}
      <table class="t"><thead><tr><th>Group</th><th>Who joins it</th><th>What it replaces</th></tr></thead>
      <tbody>
        <tr><td class="hl">ff02::1</td><td>every IPv6 node on the link</td><td>the broadcast address</td></tr>
        <tr><td class="hl">ff02::2</td><td>every IPv6 <b>router</b> on the link</td><td>—</td></tr>
        <tr><td>ff02::5 / ::6</td><td>OSPFv3 routers</td><td>224.0.0.5 / .6</td></tr>
        <tr><td>ff02::9</td><td>RIPng routers</td><td>224.0.0.9</td></tr>
        <tr><td class="hl">ff02::1:ffXX:XXXX</td><td>hosts whose address ends in those 24 bits</td><td><b>ARP</b></td></tr>
      </tbody></table>
      <div class="box">The second character after ff is the <b>scope</b>: <span class="nw-m">ff02</span> is link-local and never leaves the segment, <span class="nw-m">ff05</span> is site-local, <span class="nw-m">ff0e</span> is global. Reading that one digit tells you how far a multicast packet can travel, which is usually the question you actually have.</div>`,
  },

  {
    t: '11.9 Subnetting IPv6 — and why it is easier',
    body: `${CSS}
      ${kv([
        ['You get', 'a <b>/48</b>, and the interface ID is fixed at 64 bits'],
        ['So you subnet', 'only the <b>16-bit subnet ID</b> in between — nothing else moves'],
        ['Which gives', '2^16 = <b>65,536</b> subnets, each with 18,446,744,073,709,551,616 addresses'],
        ['The arithmetic', 'count in hex in the fourth hextet: 0000, 0001, 0002 … ffff'],
        ['No host maths', 'every subnet is the same size. There is nothing to size, ever.'],
      ])}
      <div class="box ok">This is the part that surprises people coming from Chapter 10. <b>There is no VLSM in IPv6 and no 2^h &minus; 2.</b> You never trade subnets against hosts, because a /64 is always big enough for any LAN that will ever exist. Subnetting becomes pure organisation: give each site, floor or VLAN a number and write it in the subnet ID.</div>`,
  },

  {
    t: '11.9 worked — 2001:db8:acad::/48 into /64s',
    body: `${CSS}
      <table class="t"><thead><tr><th>Subnet ID</th><th>Prefix</th><th>Use it for</th></tr></thead>
      <tbody>
        <tr><td>0000</td><td class="hl">2001:db8:acad::/64</td><td>management</td></tr>
        <tr><td>0001</td><td class="hl">2001:db8:acad:1::/64</td><td>Sales</td></tr>
        <tr><td>0002</td><td class="hl">2001:db8:acad:2::/64</td><td>Engineering</td></tr>
        <tr><td>0003</td><td class="hl">2001:db8:acad:3::/64</td><td>Admin</td></tr>
        <tr><td>ffff</td><td>2001:db8:acad:ffff::/64</td><td>the 65,536th and last</td></tr>
      </tbody></table>
      <div class="box">Compare with Chapter 10's VLSM table, where five networks consumed 120 of 256 addresses and the WAN links needed /30s. Here the same five networks use five of 65,536 subnets, each router link gets a whole /64, and nothing has to be measured. ★ In practice people number by meaning — <span class="nw-m">:10::</span> for floor 1, <span class="nw-m">:20::</span> for floor 2 — exactly the structured-design habit from 10.9.</div>`,
  },

  {
    t: '11.10 AI tools — and the checks that catch them',
    body: `${CSS}
      ${code(`# does this compress correctly?
python3 -c "import ipaddress as i; print(i.ip_address('2001:0db8:acad:0001:0000:0000:0000:0100').compressed)"

# is this a legal /64 boundary?
python3 -c "import ipaddress as i; print(i.ip_network('2001:db8:acad:1::/64'))"

# what is the solicited-node group for this address?
python3 -c "import ipaddress as i; a=i.ip_address('2001:db8:acad:1::100'); print(i.ip_address(bytes.fromhex('ff0200000000000000000001ff')+a.packed[-3:]))"`, 'bash', 'sm')}
      <div class="box warn">IPv6 is <b>worse</b> than IPv4 for trusting a generated answer, because a wrong hextet looks exactly like a right one and there is no familiar shape to catch the eye. When writing the third command above, the first version was missing one <span class="nw-m">ff</span> byte and produced a plausible, wrong group address — caught only by testing it against the worked example in RFC 4291 before trusting it.</div>`,
  },

  /* ── ★ real machine ──────────────────────────────────────────────────── */
  {
    t: '★ IPv6 on your own server, as it actually is',
    body: `${CSS}
      ${kv([
        ['13 link-local addresses', 'one per interface, <b>nobody configured any of them</b>'],
        ['0 global addresses', 'the provider allocated IPv4 only — normal, and worth knowing'],
        ['1 neighbour', '<span class="nw-m">fe80::943d:faff:fe00:4e9 dev eth0 router STALE</span>'],
        ['forwarding', '<span class="nw-m">net.ipv6.conf.all.forwarding = 0</span> — unlike IPv4, which is 1 for Docker'],
        ['nginx', 'already has <span class="nw-m">listen [::]:80</span> and <span class="nw-m">listen [::]:443 ssl</span>'],
      ])}
      <div class="box ok">Two things to read off that. <b>STALE is normal</b>, not a fault — Chapter 8 covered the neighbour states, and only FAILED is a problem. And the router's link-local is EUI-64 derived from its MAC <span class="nw-m">96:3d:fa:00:04:e9</span>, which is how the previous slide could be checked instead of merely asserted.</div>`,
  },

  { t: '★ The ::1 trap — localhost is two addresses', body: `${CSS}${LOCALHOST}` },

  {
    t: '★ Commands for reading IPv6 on a real machine',
    body: `${CSS}
      ${code(`ip -6 -br addr                 # every interface and its IPv6 addresses
ip -6 route                    # IPv6 routing table — note fe80::/64 per interface
ip -6 neigh                    # the neighbour table: ARP's replacement
ping6 ff02::1%eth0             # ask every node on this link to answer
curl -4 localhost:3000         # force IPv4
curl -6 localhost:3000         # force IPv6 — compare the two`, 'bash', 'sm')}
      <div class="box warn">The <span class="nw-m">%eth0</span> is not optional and it trips everybody once. A link-local address is only meaningful on a specific link, and a machine with thirteen interfaces has thirteen different <span class="nw-m">fe80::</span> networks. Without the zone identifier the kernel cannot know which one you meant, and it refuses rather than guessing.</div>`,
  },

  {
    t: 'The five mistakes that cost the most marks',
    body: `${CSS}
      ${kv([
        ['Two :: in one address', 'illegal — the split is ambiguous. Only ONE run may collapse.'],
        ['Dropping trailing zeros', '0100 compresses to 100, never to 1. Leading zeros only.'],
        ['A prefix longer than /64 on a LAN', 'SLAAC stops working and nothing explains why'],
        ['Expecting broadcast', 'it does not exist. ff02::1 is the nearest thing, and it is multicast.'],
        ['Forgetting ipv6 unicast-routing', 'the router holds addresses, forwards nothing, sends no RAs'],
      ])}
      <div class="box ok">If you can compress an address, expand it again, and name the range from its first hextet — 2 or 3 is global, fe80 is link-local, fc or fd is unique-local, ff is multicast — you have most of the marks in this chapter.</div>`,
  },

  {
    t: 'What you can do now, and what comes next',
    body: `${CSS}
      ${kv([
        ['Compress and expand', 'any IPv6 address, both directions, by the two rules'],
        ['Name the type', 'from the leading hextet alone, without a lookup table'],
        ['Explain', 'why there is no broadcast, and what took its place'],
        ['Configure', 'a static GUA and LLA on IOS, including <span class="nw-m">ipv6 unicast-routing</span>'],
        ['Derive', 'an EUI-64 interface ID from a MAC, and check it on a real machine'],
        ['Subnet', 'a /48 into /64s, and say why there is no VLSM and no minus two'],
        ['★ Read', '<span class="nw-m">ip -6 -br addr</span> on your own server and explain every line'],
        ['★ Diagnose', 'the localhost ::1 versus 127.0.0.1 failure in one command'],
      ])}
      <div class="box ok">Next: <b>Chapter 12 — ICMP and Lab 2.3</b> (sessions 37–40, Cisco Module 13), where ping and traceroute stop being commands you type and become a diagnostic method you can defend.</div>`,
  },
];
