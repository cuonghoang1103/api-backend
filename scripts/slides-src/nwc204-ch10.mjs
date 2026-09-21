/**
 * nwc204-ch10.mjs — NWC204 Chapter 10: IPv4 Addressing
 * (FLM buổi 30–31 lý thuyết + buổi 32–33 Lab 2.2 + buổi 34 Midterm, Cisco Module 11).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 30, 31, 32, 33, 34.
 *   buổi 30: 10.1 IPv4 Address Structure · 10.2 IPv4 Unicast, Broadcast, and Multicast
 *            · 10.3 Types of IPv4 Addresses · 10.4 Network Segmentation
 *   buổi 31: 10.5 Subnet an IPv4 · 10.6 Subnet a /16 and /8 Prefix
 *            · 10.7 Subnet to Meet Requirements · 10.8 Variable Length Subnet Masking
 *            · 10.9 Structured Design · 10.10 Integrate AI Tools (Self Learning)
 *   buổi 32–33: Lab 2.2 — Calculate IPv4 Subnets · Design and Implement a VLSM
 *            Addressing Scheme · Use AI Tools for Calculating IPv4 Subnets
 *   buổi 34: Midterm Progress Test (CLO1–CLO9)
 *
 * ⚠️ Chương này BẮT BUỘC nối vào chương bù ch04b (hệ đếm): trường KHÔNG xếp buổi
 *    nào cho Cisco Module 5, mà buổi 30–33 không làm được nếu không đọc nhị phân.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 11: đọc mạng của chính máy chủ thật
 *     bằng `ip -br addr`, hai mạng Docker đã biến VPS thành router, CIDR trong luật
 *     tường lửa và nginx, dải CGNAT 100.64/10 mà Tailscale dùng, và /31 · /32.
 *
 * ⚠️ Mọi con số subnet trong deck này đã kiểm lại bằng python3 ipaddress.
 * ⚠️ SVG: viewBox="0 0 900 h" width="1150". font-size 15 ⇒ tối đa ~99 ký tự/dòng
 *    tính từ x=4; vượt là chữ bị CẮT CÂM. Nhãn topo() giữ ≤ 10 ký tự.
 *
 * 36 slide (1 bìa + 35 nội dung); 33 trong số đó là sơ đồ, SVG, bảng hoặc terminal.
 */
import { CSS, topo, term, kv, code, bits, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch10',
  code: 'NWC204',
  title: 'Ch.10 — IPv4 Addressing',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: 32 bits, four octets, two parts ──────────────────────────────── */
const STRUCT = `<svg class="nw-svg" viewBox="0 0 900 250" width="1150" height="347"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">One IPv4 address = 32 bits, written as four decimal octets separated by dots</text>
  <g stroke="#1b5fa8" stroke-width="2.5" fill="#fff">
    <rect x="20" y="30" width="200" height="52" rx="6"/>
    <rect x="240" y="30" width="200" height="52" rx="6"/>
    <rect x="460" y="30" width="200" height="52" rx="6"/>
    <rect x="680" y="30" width="200" height="52" rx="6"/>
  </g>
  <g text-anchor="middle" font-size="22" font-weight="800" fill="#0f2a4a">
    <text x="120" y="54">192</text><text x="340" y="54">168</text>
    <text x="560" y="54">1</text><text x="780" y="54">200</text>
  </g>
  <g text-anchor="middle" font-size="13" fill="#5d7288">
    <text x="120" y="74">11000000</text><text x="340" y="74">10101000</text>
    <text x="560" y="74">00000001</text><text x="780" y="74">11001000</text>
  </g>
  <g text-anchor="middle" font-size="12" fill="#8aa0b6">
    <text x="120" y="98">bits 1-8</text><text x="340" y="98">bits 9-16</text>
    <text x="560" y="98">bits 17-24</text><text x="780" y="98">bits 25-32</text>
  </g>
  <rect x="20" y="118" width="640" height="44" rx="6" fill="#eef5fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <rect x="680" y="118" width="200" height="44" rx="6" fill="#fff5d6" stroke="#b4690e" stroke-width="2.5"/>
  <text x="340" y="146" text-anchor="middle" font-size="17" font-weight="800" fill="#1b5fa8">NETWORK portion</text>
  <text x="780" y="146" text-anchor="middle" font-size="17" font-weight="800" fill="#7a4708">HOST portion</text>
  <text x="4" y="186" fill="#0f2a4a" font-size="15" font-weight="700">The split is NOT fixed by the address. The subnet mask decides where the line falls.</text>
  <text x="4" y="210" fill="#5d7288" font-size="14">Same address, different mask = different network. That is why a wrong mask breaks things</text>
  <text x="4" y="232" fill="#5d7288" font-size="14">in a way that looks like a cable fault: the host is on a network nobody else is on.</text>
</svg>`;

/* ── SVG: the mask is a sliding boundary ───────────────────────────────── */
const MASK = `<svg class="nw-svg" viewBox="0 0 900 262" width="1150" height="363"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">The mask is 32 bits too: a run of 1s, then a run of 0s. Never mixed, never interleaved.</text>
  <g font-size="13">
    <text x="4" y="46" fill="#3c5570" font-weight="700">/24</text>
    <rect x="52" y="34" width="600" height="20" fill="#1b5fa8"/>
    <rect x="652" y="34" width="200" height="20" fill="#e0952a"/>
    <text x="352" y="49" text-anchor="middle" fill="#fff" font-weight="700">24 network bits</text>
    <text x="752" y="49" text-anchor="middle" fill="#fff" font-weight="700">8 host bits</text>
    <text x="860" y="49" fill="#5d7288">254</text>

    <text x="4" y="82" fill="#3c5570" font-weight="700">/25</text>
    <rect x="52" y="70" width="625" height="20" fill="#1b5fa8"/>
    <rect x="677" y="70" width="175" height="20" fill="#e0952a"/>
    <text x="364" y="85" text-anchor="middle" fill="#fff" font-weight="700">25 network bits</text>
    <text x="764" y="85" text-anchor="middle" fill="#fff" font-weight="700">7 host</text>
    <text x="860" y="85" fill="#5d7288">126</text>

    <text x="4" y="118" fill="#3c5570" font-weight="700">/26</text>
    <rect x="52" y="106" width="650" height="20" fill="#1b5fa8"/>
    <rect x="702" y="106" width="150" height="20" fill="#e0952a"/>
    <text x="377" y="121" text-anchor="middle" fill="#fff" font-weight="700">26 network bits</text>
    <text x="777" y="121" text-anchor="middle" fill="#fff" font-weight="700">6 host</text>
    <text x="860" y="121" fill="#5d7288">62</text>

    <text x="4" y="154" fill="#3c5570" font-weight="700">/28</text>
    <rect x="52" y="142" width="700" height="20" fill="#1b5fa8"/>
    <rect x="752" y="142" width="100" height="20" fill="#e0952a"/>
    <text x="402" y="157" text-anchor="middle" fill="#fff" font-weight="700">28 network bits</text>
    <text x="802" y="157" text-anchor="middle" fill="#fff" font-weight="700">4</text>
    <text x="860" y="157" fill="#5d7288">14</text>

    <text x="4" y="190" fill="#3c5570" font-weight="700">/30</text>
    <rect x="52" y="178" width="750" height="20" fill="#1b5fa8"/>
    <rect x="802" y="178" width="50" height="20" fill="#e0952a"/>
    <text x="427" y="193" text-anchor="middle" fill="#fff" font-weight="700">30 network bits</text>
    <text x="860" y="193" fill="#5d7288">2</text>
  </g>
  <text x="4" y="224" fill="#1b5fa8" font-size="14" font-weight="700">Every bit the network side gains, the host side loses. There are only 32 bits to share.</text>
  <text x="4" y="248" fill="#5d7288" font-size="14">Rightmost column = usable hosts. Doubling the subnets always halves the hosts.</text>
</svg>`;

/* ── SVG: the AND operation, worked ────────────────────────────────────── */
const AND = `<svg class="nw-svg" viewBox="0 0 900 278" width="1150" height="386"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">What a router actually does with an address: bitwise AND with the mask</text>
  <g font-size="15">
    <text x="4" y="52" fill="#3c5570" font-weight="700">address</text>
    <text x="110" y="52" fill="#0f2a4a" font-weight="800">192.168.1.200</text>
    <text x="320" y="52" fill="#25405e">11000000.10101000.00000001.11001000</text>
    <text x="4" y="80" fill="#3c5570" font-weight="700">mask /26</text>
    <text x="110" y="80" fill="#0f2a4a" font-weight="800">255.255.255.192</text>
    <text x="320" y="80" fill="#25405e">11111111.11111111.11111111.11000000</text>
  </g>
  <line x1="320" y1="92" x2="645" y2="92" stroke="#1b5fa8" stroke-width="2"/>
  <text x="300" y="86" font-size="18" fill="#1b5fa8" font-weight="800" text-anchor="end">AND</text>
  <g font-size="15">
    <text x="4" y="116" fill="#1f9d6b" font-weight="700">network</text>
    <text x="110" y="116" fill="#14603f" font-weight="800">192.168.1.192</text>
    <text x="320" y="116" fill="#14603f" font-weight="800">11000000.10101000.00000001.11000000</text>
  </g>
  <rect x="561" y="101" width="78" height="20" fill="none" stroke="#d94b4b" stroke-width="2" rx="3"/>
  <text x="600" y="136" font-size="12" fill="#d94b4b" font-weight="700" text-anchor="middle">host bits, erased to 0</text>
  <text x="4" y="162" fill="#0f2a4a" font-size="14" font-weight="700">AND keeps a bit only where BOTH are 1. The mask 0s erase the host part to zero.</text>
  <text x="4" y="186" fill="#5d7288" font-size="14">1 AND 1 = 1 · 1 AND 0 = 0 · 0 AND 1 = 0 · 0 AND 0 = 0. That is the whole operation.</text>
  <text x="4" y="216" fill="#1b5fa8" font-size="15" font-weight="700">Now change ONLY the mask to /24 and redo it:</text>
  <text x="4" y="240" fill="#25405e" font-size="14">192.168.1.200 AND 255.255.255.0 = 192.168.1.0 — a DIFFERENT network, same address.</text>
  <text x="4" y="266" fill="#d94b4b" font-size="14" font-weight="700">Two hosts with the same address and different masks disagree about who is a neighbour.</text>
</svg>`;

/* ── SVG: the three fixed points inside every subnet ───────────────────── */
const THREE = `<svg class="nw-svg" viewBox="0 0 900 236" width="1150" height="328"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Inside 192.168.1.192/26 there are 64 addresses, and only 62 you may hand out</text>
  <rect x="20" y="32" width="120" height="58" rx="6" fill="#eef5fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <rect x="150" y="32" width="580" height="58" rx="6" fill="#eefaf4" stroke="#1f9d6b" stroke-width="2.5"/>
  <rect x="740" y="32" width="130" height="58" rx="6" fill="#fdeeee" stroke="#d94b4b" stroke-width="2.5"/>
  <g text-anchor="middle">
    <text x="80" y="55" font-size="15" font-weight="800" fill="#1b5fa8">.192</text>
    <text x="80" y="76" font-size="11" fill="#3c5570">NETWORK</text>
    <text x="440" y="55" font-size="16" font-weight="800" fill="#14603f">.193  ...  .254</text>
    <text x="440" y="76" font-size="12" fill="#3c5570">62 usable host addresses</text>
    <text x="805" y="55" font-size="15" font-weight="800" fill="#8f2c2c">.255</text>
    <text x="805" y="76" font-size="11" fill="#3c5570">BROADCAST</text>
  </g>
  <text x="4" y="118" fill="#1b5fa8" font-size="14" font-weight="700">Network address = all host bits 0. It NAMES the subnet; no interface may use it.</text>
  <text x="4" y="142" fill="#1b5fa8" font-size="14" font-weight="700">Broadcast address = all host bits 1. It means "everyone here"; no interface may use it.</text>
  <text x="4" y="170" fill="#5d7288" font-size="14">That is where the minus two in 2^n - 2 comes from. It is two addresses, not a rule of thumb.</text>
  <text x="4" y="196" fill="#0f2a4a" font-size="14" font-weight="700">Exception: /31 has no broadcast (2 usable, for router-to-router), /32 is a single host.</text>
  <text x="4" y="222" fill="#d94b4b" font-size="14" font-weight="700">Assigning the broadcast address to a PC is silent: it configures, then nothing answers.</text>
</svg>`;

/* ── SVG: unicast vs broadcast vs multicast ────────────────────────────── */
const CAST = `<svg class="nw-svg" viewBox="0 0 900 262" width="1150" height="364"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Three ways to address a packet, answering "how many receivers did I mean?"</text>
  <g stroke-width="2.5">
    <rect x="12" y="30" width="282" height="162" rx="8" fill="#f7fbff" stroke="#1b5fa8"/>
    <rect x="309" y="30" width="282" height="162" rx="8" fill="#fdf6ea" stroke="#e0952a"/>
    <rect x="606" y="30" width="282" height="162" rx="8" fill="#eefaf4" stroke="#1f9d6b"/>
  </g>
  <g text-anchor="middle" font-weight="800" font-size="17">
    <text x="153" y="54" fill="#1b5fa8">UNICAST</text>
    <text x="450" y="54" fill="#7a4708">BROADCAST</text>
    <text x="747" y="54" fill="#14603f">MULTICAST</text>
  </g>
  <g text-anchor="middle" font-size="13" fill="#3c5570">
    <text x="153" y="78">one sender to ONE receiver</text>
    <text x="450" y="78">one sender to EVERY host</text>
    <text x="747" y="78">one sender to a GROUP</text>
  </g>
  <g stroke-width="2.5" fill="none">
    <circle cx="96" cy="108" r="9" fill="#1b5fa8" stroke="none"/>
    <line x1="110" y1="108" x2="192" y2="108" stroke="#1b5fa8"/>
    <polygon points="192,101 206,108 192,115" fill="#1b5fa8" stroke="none"/>
    <circle cx="216" cy="108" r="9" fill="#fff" stroke="#1b5fa8"/>

    <circle cx="386" cy="108" r="9" fill="#e0952a" stroke="none"/>
    <line x1="400" y1="108" x2="470" y2="90" stroke="#e0952a"/>
    <line x1="400" y1="108" x2="470" y2="108" stroke="#e0952a"/>
    <line x1="400" y1="108" x2="470" y2="126" stroke="#e0952a"/>
    <polygon points="470,84 484,90 470,97" fill="#e0952a" stroke="none"/>
    <polygon points="470,101 484,108 470,115" fill="#e0952a" stroke="none"/>
    <polygon points="470,120 484,126 470,133" fill="#e0952a" stroke="none"/>
    <circle cx="496" cy="90" r="8" fill="#fff" stroke="#e0952a"/>
    <circle cx="496" cy="108" r="8" fill="#fff" stroke="#e0952a"/>
    <circle cx="496" cy="126" r="8" fill="#fff" stroke="#e0952a"/>

    <circle cx="676" cy="108" r="9" fill="#1f9d6b" stroke="none"/>
    <line x1="690" y1="108" x2="766" y2="96" stroke="#1f9d6b"/>
    <line x1="690" y1="108" x2="766" y2="120" stroke="#1f9d6b"/>
    <polygon points="766,90 780,96 766,103" fill="#1f9d6b" stroke="none"/>
    <polygon points="766,114 780,120 766,127" fill="#1f9d6b" stroke="none"/>
    <circle cx="792" cy="96" r="8" fill="#fff" stroke="#1f9d6b"/>
    <circle cx="792" cy="120" r="8" fill="#fff" stroke="#1f9d6b"/>
  </g>
  <g text-anchor="middle" font-size="13" fill="#25405e">
    <text x="153" y="154">dest = a host address</text>
    <text x="450" y="154">dest = 255.255.255.255</text>
    <text x="747" y="154">dest = 224.0.0.0/4</text>
    <text x="153" y="174">99% of your traffic</text>
    <text x="450" y="174">or .255 of the subnet</text>
    <text x="747" y="174">only members listen</text>
  </g>
  <text x="4" y="218" fill="#1b5fa8" font-size="14" font-weight="700">A router does NOT forward a limited broadcast (255.255.255.255). It stops at the subnet edge.</text>
  <text x="4" y="244" fill="#5d7288" font-size="14">That boundary is the reason a broadcast storm floods one LAN instead of the whole Internet.</text>
</svg>`;

/* ── SVG: private vs public address space ──────────────────────────────── */
const PRIV = `<svg class="nw-svg" viewBox="0 0 900 258" width="1150" height="358"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">RFC 1918 private ranges — free to reuse, never routed on the public Internet</text>
  <g stroke-width="2.5">
    <rect x="20" y="30" width="270" height="88" rx="8" fill="#eef5fc" stroke="#1b5fa8"/>
    <rect x="315" y="30" width="270" height="88" rx="8" fill="#eef5fc" stroke="#1b5fa8"/>
    <rect x="610" y="30" width="270" height="88" rx="8" fill="#eef5fc" stroke="#1b5fa8"/>
  </g>
  <g text-anchor="middle">
    <text x="155" y="56" font-size="18" font-weight="800" fill="#0f2a4a">10.0.0.0/8</text>
    <text x="155" y="78" font-size="13" fill="#3c5570">16,777,216 addresses</text>
    <text x="155" y="100" font-size="12" fill="#5d7288">big campuses, clouds</text>
    <text x="450" y="56" font-size="18" font-weight="800" fill="#0f2a4a">172.16.0.0/12</text>
    <text x="450" y="78" font-size="13" fill="#3c5570">1,048,576 addresses</text>
    <text x="450" y="100" font-size="12" fill="#5d7288">172.16.x to 172.31.x</text>
    <text x="745" y="56" font-size="18" font-weight="800" fill="#0f2a4a">192.168.0.0/16</text>
    <text x="745" y="78" font-size="13" fill="#3c5570">65,536 addresses</text>
    <text x="745" y="100" font-size="12" fill="#5d7288">home routers, labs</text>
  </g>
  <text x="4" y="150" fill="#d94b4b" font-size="14" font-weight="700">/12 is the one people get wrong: it ends at 172.31.255.255, NOT at 172.16.255.255.</text>
  <text x="4" y="174" fill="#5d7288" font-size="14">172.20.0.1 is private. 172.32.0.1 is PUBLIC and belongs to somebody else.</text>
  <text x="4" y="204" fill="#1b5fa8" font-size="15" font-weight="700">Everything else is public: globally unique, assigned by a registry, costs money.</text>
  <text x="4" y="228" fill="#25405e" font-size="14">Private addresses reach the Internet only through NAT, which rewrites the source.</text>
  <text x="4" y="250" fill="#5d7288" font-size="14">Two different companies can both use 192.168.1.0/24 and never collide — until a VPN joins them.</text>
</svg>`;

/* ── SVG: borrowing bits ───────────────────────────────────────────────── */
const BORROW = `<svg class="nw-svg" viewBox="0 0 900 254" width="1150" height="352"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Subnetting is ONE idea: move the boundary right, taking bits from host to network</text>
  <text x="4" y="48" fill="#3c5570" font-size="14" font-weight="700">before — 192.168.1.0/24</text>
  <rect x="20" y="58" width="620" height="26" fill="#1b5fa8"/>
  <rect x="640" y="58" width="230" height="26" fill="#e0952a"/>
  <text x="330" y="76" text-anchor="middle" font-size="14" fill="#fff" font-weight="700">24 network bits</text>
  <text x="755" y="76" text-anchor="middle" font-size="14" fill="#fff" font-weight="700">8 host bits = 254 hosts</text>
  <text x="4" y="118" fill="#3c5570" font-size="14" font-weight="700">after — borrow 2 bits, /26</text>
  <rect x="20" y="128" width="620" height="26" fill="#1b5fa8"/>
  <rect x="640" y="128" width="58" height="26" fill="#7ad0c7"/>
  <rect x="698" y="128" width="172" height="26" fill="#e0952a"/>
  <text x="330" y="146" text-anchor="middle" font-size="14" fill="#fff" font-weight="700">24 network bits</text>
  <text x="669" y="146" text-anchor="middle" font-size="13" fill="#0f2a4a" font-weight="800">2</text>
  <text x="784" y="146" text-anchor="middle" font-size="14" fill="#fff" font-weight="700">6 host = 62</text>
  <text x="669" y="172" text-anchor="middle" font-size="11" fill="#1b5fa8" font-weight="700">borrowed</text>
  <text x="4" y="204" fill="#1b5fa8" font-size="15" font-weight="700">2 borrowed bits = 2^2 = 4 subnets. 6 host bits left = 2^6 - 2 = 62 hosts each.</text>
  <text x="4" y="228" fill="#5d7288" font-size="14">4 x 62 = 248 usable, down from 254. Every split costs two addresses per new subnet.</text>
  <text x="4" y="250" fill="#5d7288" font-size="14">Nothing is created. You are only choosing where to spend the 32 bits you already had.</text>
</svg>`;

/* ── SVG: VLSM, the whole point in one picture ─────────────────────────── */
const VLSM = `<svg class="nw-svg" viewBox="0 0 900 306" width="1150" height="425"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Same /24, two ways to cut it. Five networks needed: 58, 28, 12, 2, 2 hosts.</text>
  <text x="4" y="46" fill="#8f2c2c" font-size="14" font-weight="700">Fixed-size /26 everywhere — runs out</text>
  <g stroke="#d94b4b" stroke-width="2">
    <rect x="20" y="56" width="212" height="40" fill="#fdeeee"/>
    <rect x="232" y="56" width="212" height="40" fill="#fdeeee"/>
    <rect x="444" y="56" width="212" height="40" fill="#fdeeee"/>
    <rect x="656" y="56" width="212" height="40" fill="#fdeeee"/>
  </g>
  <g text-anchor="middle" font-size="12" fill="#8f2c2c">
    <text x="126" y="72" font-weight="800">/26 Sales</text><text x="126" y="89">58 of 62 used</text>
    <text x="338" y="72" font-weight="800">/26 Eng</text><text x="338" y="89">28 of 62 — 34 wasted</text>
    <text x="550" y="72" font-weight="800">/26 Admin</text><text x="550" y="89">12 of 62 — 50 wasted</text>
    <text x="762" y="72" font-weight="800">/26 WAN</text><text x="762" y="89">2 of 62 — 60 wasted</text>
  </g>
  <text x="4" y="118" fill="#d94b4b" font-size="14" font-weight="700">Only 4 blocks exist. The fifth network has nowhere to go. 144 addresses wasted.</text>
  <text x="4" y="150" fill="#14603f" font-size="14" font-weight="700">VLSM — each network gets the size it needs</text>
  <g stroke="#1f9d6b" stroke-width="2">
    <rect x="20" y="160" width="212" height="40" fill="#eefaf4"/>
    <rect x="232" y="160" width="106" height="40" fill="#eefaf4"/>
    <rect x="338" y="160" width="53" height="40" fill="#eefaf4"/>
    <rect x="391" y="160" width="14" height="40" fill="#eefaf4"/>
    <rect x="405" y="160" width="14" height="40" fill="#eefaf4"/>
    <rect x="419" y="160" width="449" height="40" fill="#f4f7fa" stroke="#8aa0b6" stroke-dasharray="5 4"/>
  </g>
  <g text-anchor="middle" font-size="11" fill="#14603f">
    <text x="126" y="176" font-weight="800">/26 Sales 62</text><text x="126" y="193">.0 - .63</text>
    <text x="285" y="176" font-weight="800">/27 Eng 30</text><text x="285" y="193">.64 - .95</text>
    <text x="364" y="178" font-weight="800">/28</text><text x="364" y="194" font-size="10">.96-.111</text>
    <text x="643" y="180" font-size="13" fill="#5d7288" font-weight="700">136 addresses still free for growth</text>
  </g>
  <g stroke="#1f9d6b" stroke-width="1.5" fill="none">
    <line x1="398" y1="202" x2="398" y2="214"/><line x1="412" y1="202" x2="412" y2="214"/>
    <line x1="398" y1="214" x2="412" y2="214"/><line x1="405" y1="214" x2="405" y2="222"/>
  </g>
  <text x="418" y="226" font-size="12" fill="#14603f" font-weight="700">two /30 WAN links — .112 and .116, four addresses each</text>
  <text x="4" y="252" fill="#1f9d6b" font-size="14" font-weight="700">All five fit, using 120 of 256 addresses. Verified with python3 ipaddress: no overlap.</text>
  <text x="4" y="276" fill="#1b5fa8" font-size="14" font-weight="700">Rule: allocate LARGEST first. Smallest first fragments the space and you get stuck.</text>
  <text x="4" y="298" fill="#5d7288" font-size="14">VLSM is just subnetting applied again to a subnet. There is no second algorithm to learn.</text>
</svg>`;

/* ── SVG: the method, as a loop ────────────────────────────────────────── */
const METHOD = `<svg class="nw-svg" viewBox="0 0 900 224" width="1150" height="311"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">The VLSM loop — four steps, repeated once per network, no arithmetic tricks needed</text>
  <g stroke="#1b5fa8" stroke-width="2.5" fill="#f7fbff">
    <rect x="14" y="36" width="196" height="72" rx="8"/>
    <rect x="248" y="36" width="196" height="72" rx="8"/>
    <rect x="482" y="36" width="196" height="72" rx="8"/>
    <rect x="716" y="36" width="170" height="72" rx="8"/>
  </g>
  <g text-anchor="middle">
    <text x="112" y="60" font-size="15" font-weight="800" fill="#1b5fa8">1. SORT</text>
    <text x="112" y="80" font-size="12" fill="#3c5570">largest need first</text>
    <text x="112" y="98" font-size="12" fill="#3c5570">58, 28, 12, 2, 2</text>
    <text x="346" y="60" font-size="15" font-weight="800" fill="#1b5fa8">2. SIZE</text>
    <text x="346" y="80" font-size="12" fill="#3c5570">smallest n with</text>
    <text x="346" y="98" font-size="12" fill="#3c5570">2^n - 2 &gt;= need</text>
    <text x="580" y="60" font-size="15" font-weight="800" fill="#1b5fa8">3. PLACE</text>
    <text x="580" y="80" font-size="12" fill="#3c5570">start at the next</text>
    <text x="580" y="98" font-size="12" fill="#3c5570">free address</text>
    <text x="801" y="60" font-size="15" font-weight="800" fill="#1b5fa8">4. ADVANCE</text>
    <text x="801" y="80" font-size="12" fill="#3c5570">next block starts</text>
    <text x="801" y="98" font-size="12" fill="#3c5570">at broadcast + 1</text>
  </g>
  <g stroke="#1b5fa8" stroke-width="3" fill="none">
    <line x1="212" y1="72" x2="240" y2="72"/><polygon points="240,66 252,72 240,78" fill="#1b5fa8" stroke="none"/>
    <line x1="446" y1="72" x2="474" y2="72"/><polygon points="474,66 486,72 474,78" fill="#1b5fa8" stroke="none"/>
    <line x1="680" y1="72" x2="708" y2="72"/><polygon points="708,66 720,72 708,78" fill="#1b5fa8" stroke="none"/>
    <line x1="801" y1="112" x2="801" y2="132"/><line x1="801" y1="132" x2="112" y2="132"/>
    <line x1="112" y1="132" x2="112" y2="114"/><polygon points="106,114 112,102 118,114" fill="#1b5fa8" stroke="none"/>
  </g>
  <text x="450" y="152" text-anchor="middle" font-size="13" fill="#1b5fa8" font-weight="700">repeat for the next network</text>
  <text x="4" y="182" fill="#1b5fa8" font-size="14" font-weight="700">Step 4 is where mistakes happen: the next block starts AFTER the broadcast, not after the last host.</text>
  <text x="4" y="206" fill="#d94b4b" font-size="14" font-weight="700">Off by one there and two subnets overlap. Nothing warns you; some hosts just cannot be reached.</text>
</svg>`;

/* ── SVG: ★ the real server ────────────────────────────────────────────── */
const REAL = `<svg class="nw-svg" viewBox="0 0 900 244" width="1150" height="339"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">★ A real production VPS has THREE IPv4 networks on it, and you must read all three</text>
  <g stroke-width="2.5">
    <rect x="20" y="34" width="264" height="96" rx="8" fill="#eef5fc" stroke="#1b5fa8"/>
    <rect x="318" y="34" width="264" height="96" rx="8" fill="#fdf6ea" stroke="#e0952a"/>
    <rect x="616" y="34" width="264" height="96" rx="8" fill="#eefaf4" stroke="#1f9d6b"/>
  </g>
  <g text-anchor="middle">
    <text x="152" y="58" font-size="15" font-weight="800" fill="#1b5fa8">eth0 — public</text>
    <text x="152" y="80" font-size="14" fill="#0f2a4a" font-weight="700">198.51.100.208/24</text>
    <text x="152" y="100" font-size="12" fill="#3c5570">gateway .1 · 254 usable</text>
    <text x="152" y="120" font-size="12" fill="#5d7288">the address DNS points at</text>
    <text x="450" y="58" font-size="15" font-weight="800" fill="#7a4708">docker0 — default</text>
    <text x="450" y="80" font-size="14" fill="#0f2a4a" font-weight="700">172.17.0.1/16</text>
    <text x="450" y="100" font-size="12" fill="#3c5570">65,534 usable · RFC 1918</text>
    <text x="450" y="120" font-size="12" fill="#5d7288">Docker made this, not you</text>
    <text x="748" y="58" font-size="15" font-weight="800" fill="#14603f">br-xxxx — compose</text>
    <text x="748" y="80" font-size="14" fill="#0f2a4a" font-weight="700">172.18.0.1/16</text>
    <text x="748" y="100" font-size="12" fill="#3c5570">one per compose project</text>
    <text x="748" y="120" font-size="12" fill="#5d7288">where containers talk</text>
  </g>
  <text x="4" y="162" fill="#1b5fa8" font-size="14" font-weight="700">ip_forward = 1, so this server IS a router. It routes between those two private subnets.</text>
  <text x="4" y="186" fill="#5d7288" font-size="14">Every chapter-7 routing rule you learned applies to your own machine, right now.</text>
  <text x="4" y="216" fill="#d94b4b" font-size="14" font-weight="700">Consequence: if your office VPN also uses 172.18.0.0/16, containers become unreachable</text>
  <text x="4" y="238" fill="#d94b4b" font-size="14" font-weight="700">from the office, and nothing in Docker logs will mention it. It is an addressing collision.</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'IPv4 Addressing',
    sub: 'Chapter 10 — Cisco Module 11',
    body: `<div class="cov-meta">Sessions 30–31 (theory) + 32–33 (Lab 2.2) + 34 (Midterm) of 60 · CLO5, CLO9<br>
      10.1 Structure · 10.2 Unicast, Broadcast, Multicast · 10.3 Types · 10.4 Segmentation<br>
      10.5–10.7 Subnetting · 10.8 VLSM · 10.9 Structured Design · 10.10 AI Tools<br>
      Lab 2.2 — Calculate IPv4 Subnets and Design a VLSM Scheme<br>
      ★ marks material added by cuongthai.com, beyond Cisco Module 11</div>`,
  },

  /* ── 10.1 Address structure — session 30 ─────────────────────────────── */
  {
    t: 'The heaviest chapter of the course, and why',
    body: `${CSS}
      ${kv([
        ['What it is', 'Cisco <b>Module 11</b> — the module everything after it depends on'],
        ['Sessions', '30 and 31 theory, 32 and 33 Lab 2.2, <b>34 is the Midterm Progress Test</b>'],
        ['Outcome', '<b>CLO5</b> — design and implement IPv4 and IPv6 addressing by calculating subnets'],
        ['Prerequisite', 'binary, hex and bitwise AND — <b>Chapter 4B</b> on this site'],
        ['Why 4B exists', 'FPT schedules no session for Cisco Module 5, and you cannot subnet without it'],
      ])}
      <div class="box warn">If Chapter 4B is not solid, stop and go back. Everything here is bit arithmetic wearing decimal clothes, and no amount of memorising subnet tables survives an exam question phrased sideways.</div>`,
  },

  { t: 'An IPv4 address is 32 bits split into two questions', body: `${CSS}${STRUCT}` },

  {
    t: 'Dotted decimal is a convenience for humans',
    body: `${CSS}
      ${bits('11000000', 'the first octet of 192.168.1.200 — each position is a power of two')}
      <div class="box">The machine never sees "192". It sees eight bits. Dotted decimal exists because <b>11000000.10101000.00000001.11001000</b> is unreadable, and four numbers from 0 to 255 are not.</div>
      <p class="note">Each octet holds 0 to 255 — that is 2^8 = 256 values. An octet can never be 256 or higher, which is the quickest way to spot an invalid address.</p>`,
  },

  { t: 'The subnet mask decides where the split falls', body: `${CSS}${MASK}` },

  {
    t: 'Prefix length and dotted-decimal mask are the same thing',
    body: `${CSS}
      <table class="t"><thead><tr><th>Prefix</th><th>Mask</th><th>Block size</th><th>Usable hosts</th><th>Typical use</th></tr></thead>
      <tbody>
        <tr><td class="hl">/24</td><td>255.255.255.0</td><td>256</td><td>254</td><td>one office LAN</td></tr>
        <tr><td>/25</td><td>255.255.255.128</td><td>128</td><td>126</td><td>half of it</td></tr>
        <tr><td class="hl">/26</td><td>255.255.255.192</td><td>64</td><td>62</td><td>a department</td></tr>
        <tr><td>/27</td><td>255.255.255.224</td><td>32</td><td>30</td><td>a small team</td></tr>
        <tr><td>/28</td><td>255.255.255.240</td><td>16</td><td>14</td><td>a rack of servers</td></tr>
        <tr><td class="hl">/30</td><td>255.255.255.252</td><td>4</td><td>2</td><td>router to router</td></tr>
      </tbody></table>
      <div class="box ok">Learn the right-hand column by the block size, not by memorising masks: <b>block = 256 - last mask octet</b>. 256 - 192 = 64, so /26 subnets start at .0, .64, .128, .192.</div>`,
  },

  { t: 'How a router decides: bitwise AND', body: `${CSS}${AND}` },

  { t: 'Every subnet has three fixed points', body: `${CSS}${THREE}` },

  {
    t: 'Reading a subnet in four lines',
    body: `${CSS}
      ${term(`<span class="c"># Given 192.168.1.200/26 — answer all four without a calculator</span>

<span class="k">block size</span>  = 256 - 192 = <span class="g">64</span>        <span class="c"># from the mask 255.255.255.192</span>
<span class="k">network</span>     = largest multiple of 64 that is &lt;= 200 = <span class="g">192.168.1.192</span>
<span class="k">broadcast</span>   = network + 64 - 1           = <span class="g">192.168.1.255</span>
<span class="k">host range</span>  = <span class="g">192.168.1.193</span> to <span class="g">192.168.1.254</span>`)}
      <div class="box">This is the entire exam skill. Block size, round down, add block minus one. Three steps, and it works for any prefix once you can compute the block.</div>`,
  },

  { t: 'Unicast, broadcast, multicast', body: `${CSS}${CAST}` },

  {
    t: 'Two kinds of broadcast, and only one crosses anything',
    body: `${CSS}
      ${kv([
        ['Limited broadcast', '<b>255.255.255.255</b> — "everyone on this wire". A router NEVER forwards it.'],
        ['Directed broadcast', '<b>192.168.1.255</b> — "everyone on that subnet". Routers drop it by default too.'],
        ['Why it matters', 'DHCP Discover is a limited broadcast, which is why a DHCP server must be on the same subnet — or a relay must be configured.'],
        ['Multicast you meet', '<b>224.0.0.5 / .6</b> OSPF · <b>224.0.0.9</b> RIPv2 · <b>224.0.0.251</b> mDNS (Bonjour, AirPlay)'],
      ])}
      <div class="box warn">"My printer disappears from the network at the office but works at home." Home is one flat subnet so mDNS multicast reaches it. The office puts you on another subnet, and 224.0.0.251 has a TTL of 1 — it dies at the first router. Nothing is broken.</div>`,
  },

  { t: 'Public and private address space', body: `${CSS}${PRIV}` },

  {
    t: 'The other reserved ranges you will actually meet',
    body: `${CSS}
      <table class="t"><thead><tr><th>Range</th><th>Name</th><th>Where you see it for real</th></tr></thead>
      <tbody>
        <tr><td class="hl">127.0.0.0/8</td><td>loopback</td><td><b>localhost</b> — 16.7 million addresses for one machine</td></tr>
        <tr><td class="hl">169.254.0.0/16</td><td>link-local, APIPA</td><td>DHCP failed. Also cloud metadata at <b>169.254.169.254</b></td></tr>
        <tr><td>100.64.0.0/10</td><td>CGNAT, RFC 6598</td><td>mobile carriers · <b>Tailscale</b> gives you a 100.x address</td></tr>
        <tr><td>224.0.0.0/4</td><td>multicast</td><td>routing protocols, mDNS, streaming</td></tr>
        <tr><td>192.0.2.0/24</td><td>TEST-NET-1</td><td>documentation only — use it in your own diagrams</td></tr>
      </tbody></table>
      <div class="box ok">★ <b>169.254.169.254 is worth memorising.</b> Seeing a route to it on a cloud server tells you instantly that you are on a VM, not bare metal — that is the provider's metadata service, and it lives in the link-local range precisely so it can never be routed off the host.</div>`,
  },

  {
    t: 'Classful addressing is dead, but its ghost explains a lot',
    body: `${CSS}
      <table class="t"><thead><tr><th>Class</th><th>First octet</th><th>Old default mask</th><th>Hosts per network</th></tr></thead>
      <tbody>
        <tr><td>A</td><td>1 – 126</td><td>/8</td><td>16,777,214</td></tr>
        <tr><td>B</td><td>128 – 191</td><td>/16</td><td>65,534</td></tr>
        <tr><td>C</td><td>192 – 223</td><td>/24</td><td>254</td></tr>
        <tr><td>D</td><td>224 – 239</td><td>multicast</td><td>—</td></tr>
        <tr><td>E</td><td>240 – 255</td><td>reserved</td><td>—</td></tr>
      </tbody></table>
      <div class="box warn">Classes were abolished by <b>CIDR</b> in 1993 because the granularity was absurd: an organisation needing 300 hosts had to choose between 254 and 65,534. But the ghost remains — IOS still <i>offers</i> a classful mask by default, and this is why 10.x feels like "a big network" and 192.168.x feels like "a small one".</div>`,
  },

  {
    t: '10.4 Why segment at all — three reasons, one of them yours',
    body: `${CSS}
      <div class="grid3">
        <div class="card"><b>Broadcast control</b><p>One subnet = one broadcast domain. 500 hosts on one flat LAN means every ARP and DHCP request interrupts all 500.</p></div>
        <div class="card"><b>Security</b><p>A router is a place to put a rule. Guests on their own subnet cannot reach the accounting server, because the packet must pass a device that can say no.</p></div>
        <div class="card"><b>Structure</b><p>Addresses that match the org chart are addresses a human can debug. 10.20.x = floor 2, and a log line becomes readable.</p></div>
      </div>
      <div class="box">★ You have already done this without naming it: putting your database on the compose network instead of publishing port 5432 is network segmentation. The container is unreachable from the Internet because it has no address the Internet can route to.</div>`,
  },

  /* ── 10.5–10.8 Subnetting — session 31 ───────────────────────────────── */
  {
    t: 'Session 31 — from one network to many',
    body: `${CSS}
      ${kv([
        ['10.5', 'Subnet an IPv4 network — the mechanics of borrowing bits'],
        ['10.6', 'Subnet a /16 and a /8 prefix — the same mechanics, more room'],
        ['10.7', 'Subnet to meet requirements — start from what you need, not from a table'],
        ['10.8', '<b>Variable Length Subnet Masking</b> — the part that separates pass from fluent'],
        ['10.9', 'Structured design — addressing that a human can still read in three years'],
        ['10.10', 'Integrate AI tools for explaining concepts (self learning)'],
      ])}
      <div class="box warn">⚠️ The school's question table puts <b>CQ11.1 "Progress Test 2"</b> on this session. That is not a question — and the course has only ONE Midterm Progress Test, at session 34. We quote the table as published and say so, rather than silently fixing it.</div>`,
  },

  { t: '10.5 Borrowing bits — the only idea in the chapter', body: `${CSS}${BORROW}` },

  {
    t: 'The two formulas, and what each one counts',
    body: `${CSS}
      <div class="two">
        <div class="box"><b>2^n subnets</b><br><span class="note">n = bits BORROWED from the host part.<br>Borrow 2 → 4 subnets. Borrow 4 → 16.</span></div>
        <div class="box ok"><b>2^h - 2 hosts</b><br><span class="note">h = bits REMAINING for hosts.<br>The -2 is network and broadcast.</span></div>
      </div>
      <table class="t"><thead><tr><th>Borrow</th><th>New prefix</th><th>Subnets</th><th>Host bits</th><th>Hosts each</th></tr></thead>
      <tbody>
        <tr><td>0</td><td>/24</td><td>1</td><td>8</td><td>254</td></tr>
        <tr><td>1</td><td>/25</td><td>2</td><td>7</td><td>126</td></tr>
        <tr><td class="hl">2</td><td class="hl">/26</td><td class="hl">4</td><td class="hl">6</td><td class="hl">62</td></tr>
        <tr><td>3</td><td>/27</td><td>8</td><td>5</td><td>30</td></tr>
        <tr><td>4</td><td>/28</td><td>16</td><td>4</td><td>14</td></tr>
        <tr><td>6</td><td>/30</td><td>64</td><td>2</td><td>2</td></tr>
      </tbody></table>`,
  },

  {
    t: '10.5 worked — 192.168.1.0/24 into four /26',
    body: `${CSS}
      <table class="t"><thead><tr><th>Subnet</th><th>Network</th><th>First host</th><th>Last host</th><th>Broadcast</th></tr></thead>
      <tbody>
        <tr><td>0</td><td class="hl">192.168.1.0</td><td>192.168.1.1</td><td>192.168.1.62</td><td>192.168.1.63</td></tr>
        <tr><td>1</td><td class="hl">192.168.1.64</td><td>192.168.1.65</td><td>192.168.1.126</td><td>192.168.1.127</td></tr>
        <tr><td>2</td><td class="hl">192.168.1.128</td><td>192.168.1.129</td><td>192.168.1.190</td><td>192.168.1.191</td></tr>
        <tr><td>3</td><td class="hl">192.168.1.192</td><td>192.168.1.193</td><td>192.168.1.254</td><td>192.168.1.255</td></tr>
      </tbody></table>
      <div class="box ok">Read the Network column downwards: <b>0, 64, 128, 192</b> — the block size, added repeatedly. Every subnetting question in this course is that one pattern at a different scale. Each row's broadcast is the next row's network minus one, with no gap anywhere.</div>`,
  },

  {
    t: '10.6 The same mechanics on a /16 and a /8',
    body: `${CSS}
      <div class="two">
        <div>
          <p class="nh">172.16.0.0/16 borrowed to /20</p>
          ${kv([
            ['Borrowed', '4 bits → 2^4 = <b>16</b> subnets'],
            ['Host bits', '12 → <b>4,094</b> hosts each'],
            ['Block', '256 - 240 = 16, in the THIRD octet'],
            ['First three', '172.16.0.0 · 172.16.16.0 · 172.16.32.0'],
            ['Last', '172.16.240.0 → bcast 172.16.255.255'],
          ])}
        </div>
        <div>
          <p class="nh">10.0.0.0/8 borrowed to /14</p>
          ${kv([
            ['Borrowed', '6 bits → 2^6 = <b>64</b> subnets'],
            ['Host bits', '18 → <b>262,142</b> hosts each'],
            ['Block', '256 - 252 = 4, in the SECOND octet'],
            ['First three', '10.0.0.0 · 10.4.0.0 · 10.8.0.0'],
            ['Note', 'one subnet is bigger than most companies'],
          ])}
        </div>
      </div>
      <div class="box">The only thing that changes is <b>which octet the block lands in</b>. Find the octet where the mask is neither 255 nor 0 — that is the interesting one, and everything to its right is host space.</div>`,
  },

  {
    t: '10.7 Start from the requirement, not from a table',
    body: `${CSS}
      ${term(`<span class="c"># "The floor needs 200 hosts." Which prefix?</span>

  2^7 - 2 = <span class="r">126</span>   <span class="c"># /25 — too small, you would be 74 short</span>
  2^8 - 2 = <span class="g">254</span>   <span class="c"># /24 — smallest that fits. Answer: /24</span>

<span class="c"># "We need 6 separate networks from one /24." How many bits?</span>

  2^2 = <span class="r">4</span>         <span class="c"># not enough</span>
  2^3 = <span class="g">8</span>         <span class="c"># borrow 3 → /27 → 8 subnets of 30 hosts</span>`)}
      <div class="box warn">Two different questions, two different formulas. <b>Hosts-first</b> uses 2^h - 2 and rounds UP to the next prefix that fits. <b>Subnets-first</b> uses 2^n and accepts spares. Read which one the question is asking before touching a number — mixing them is the single most common exam error.</div>`,
  },

  { t: '10.8 VLSM — why fixed-size subnetting runs out', body: `${CSS}${VLSM}` },

  { t: '10.8 The VLSM method', body: `${CSS}${METHOD}` },

  {
    t: '10.8 worked — 192.168.20.0/24 for five networks',
    body: `${CSS}
      <table class="t"><thead><tr><th>Network</th><th>Need</th><th>Prefix</th><th>Subnet</th><th>Host range</th><th>Broadcast</th></tr></thead>
      <tbody>
        <tr><td>Sales</td><td>58</td><td class="hl">/26</td><td>192.168.20.0</td><td>.1 – .62</td><td>.63</td></tr>
        <tr><td>Engineering</td><td>28</td><td class="hl">/27</td><td>192.168.20.64</td><td>.65 – .94</td><td>.95</td></tr>
        <tr><td>Admin</td><td>12</td><td class="hl">/28</td><td>192.168.20.96</td><td>.97 – .110</td><td>.111</td></tr>
        <tr><td>WAN R1–R2</td><td>2</td><td class="hl">/30</td><td>192.168.20.112</td><td>.113 – .114</td><td>.115</td></tr>
        <tr><td>WAN R2–R3</td><td>2</td><td class="hl">/30</td><td>192.168.20.116</td><td>.117 – .118</td><td>.119</td></tr>
      </tbody></table>
      <div class="box ok">120 of 256 addresses used, <b>136 left for growth</b>, and no two blocks overlap — checked with <span class="nw-m">python3 ipaddress</span>, not by eye. Notice each subnet starts exactly one after the previous broadcast: .63 → .64, .95 → .96, .111 → .112.</div>`,
  },

  {
    t: 'Why WAN links get a /30 (or a /31)',
    body: `${CSS}
      ${topo(['nd:R1|.113', 'lk:serial link|192.168.20.112/30', 'nd.rt:R2|.114'])}
      ${kv([
        ['A point-to-point link', 'has exactly <b>two</b> interfaces. Ever.'],
        ['/30 gives', '4 addresses: network, two hosts, broadcast. 50% overhead, but it fits.'],
        ['/31 gives', '2 addresses, <b>no network and no broadcast</b> (RFC 3021). 0% waste.'],
        ['Why not /24', 'you would burn 254 addresses to connect two routers.'],
      ])}
      <div class="box warn">/31 is the exception to "always subtract 2". It is legal and widely used on modern router links, but Packet Tracer and older IOS may refuse it — <b>use /30 in Lab 2.2</b> and know /31 exists for the real world.</div>`,
  },

  {
    t: '10.9 Structured design — addressing a human can read',
    body: `${CSS}
      ${kv([
        ['Encode meaning', '10.<b>20</b>.x = floor 2 · 10.<b>30</b>.x = floor 3. A log line becomes self-explaining.'],
        ['Keep blocks contiguous', 'so one summary route covers a whole site instead of twelve entries.'],
        ['Leave room', 'allocate by need, but place blocks so each can grow into the gap after it.'],
        ['Reserve a pattern', '.1 = gateway, .2–.9 = infrastructure, .10+ = DHCP pool. Every site the same.'],
      ])}
      <div class="box ok">Summarisation is the payoff: four contiguous /24s at 10.20.0.0 through 10.20.3.0 advertise as <b>one</b> route, 10.20.0.0/22. Scattered allocations cannot be summarised, and the routing table grows forever. Design is what makes the arithmetic reusable.</div>`,
  },

  {
    t: '10.10 Using AI tools — the school asks for it, so do it properly',
    body: `${CSS}
      <div class="two">
        <div class="box ok"><b>Good use</b><br><span class="note">"Explain why 2^h - 2 has the minus two."<br>"Check this VLSM table for overlaps."<br>"Give me five practice questions on /27."</span></div>
        <div class="box warn"><b>Bad use</b><br><span class="note">"Subnet this for me" and pasting the answer into the lab without checking a single block boundary.</span></div>
      </div>
      <div class="box">Language models produce subnet tables that are <b>plausible and wrong</b> — an off-by-one broadcast address reads perfectly. Verify before you trust:</div>
      ${code(`python3 -c "import ipaddress as i; n=i.ip_network('192.168.20.64/27'); print(n.network_address, n.broadcast_address, n.num_addresses-2)"`, 'bash', 'sm')}
      <p class="note">That is the same habit this whole course teaches: check the checker, and never let a green-looking answer stand in for a measured one.</p>`,
  },

  /* ── Lab 2.2 — sessions 32–33 ────────────────────────────────────────── */
  {
    t: 'Lab 2.2 — what sessions 32 and 33 ask you to produce',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span>Calculate IPv4 subnets — given a network and a requirement, produce the table.</span></div>
        <div><span class="n">2</span><span>Design <b>and implement</b> a VLSM addressing scheme — on paper, then on the devices.</span></div>
        <div><span class="n">3</span><span>Use AI tools for calculating IPv4 subnets — and show how you verified the output.</span></div>
      </div>
      <p class="note">Materials: <b>11.6.6 Lab Manual</b> and <b>11.10.2 Lab Manual</b>. Type U (Use) — you are expected to do it, not watch it. Dialogue-based Assessment: be ready to explain your choices out loud.</p>
      <div class="box warn">"Implement" is the word that catches people. A correct table on paper scores nothing if <span class="nw-m">ip address</span> was never typed and <span class="nw-m">no shutdown</span> was forgotten. Chapter 9 is the other half of this lab.</div>`,
  },

  {
    t: 'Lab 2.2 — verify bottom-up, stop at the first failure',
    body: `${CSS}
      ${term(`<span class="p">R1#</span> <span class="k">show ip interface brief</span>     <span class="c"># L1/L2 — is it up/up?</span>
<span class="p">R1#</span> <span class="k">show ip route</span>                <span class="c"># is the connected route there? if not, no address</span>
<span class="p">PC&gt;</span> <span class="k">ipconfig</span>                     <span class="c"># right address, right MASK, right gateway?</span>
<span class="p">PC&gt;</span> <span class="k">ping 192.168.20.1</span>            <span class="c"># own gateway — proves L1-L3 on this subnet</span>
<span class="p">PC&gt;</span> <span class="k">ping 192.168.20.65</span>           <span class="c"># across the router — proves routing</span>`)}
      <div class="box">★ The <b>mask</b> on the PC is the field people skim past, and it is the one that produces the strangest symptom: the PC can ping its own subnet but silently refuses to send anything to the gateway, because with the wrong mask it believes the gateway is remote — or that a remote host is local.</div>`,
  },

  {
    t: '★ Read your own server: three networks, one machine',
    body: `${CSS}${REAL}`,
  },

  {
    t: '★ The commands that answer "what is my network?"',
    body: `${CSS}
      ${code(`ip -br addr                 # every interface and its CIDR, one line each
ip route                    # which network goes out which interface
ip route get 8.8.8.8        # which route WOULD be chosen for this destination
ipcalc 192.168.20.0/26      # network, broadcast, range — if installed`, 'bash')}
      ${term(`<span class="p">$</span> <span class="k">ip -br addr</span>
lo         UNKNOWN   <span class="g">127.0.0.1/8</span>
eth0       UP        <span class="g">198.51.100.208/24</span>      <span class="c"># public, /24 — 254 usable</span>
docker0    UP        <span class="g">172.17.0.1/16</span>          <span class="c"># RFC 1918, made by Docker</span>
br-e4e65a  UP        <span class="g">172.18.0.1/16</span>          <span class="c"># one compose project</span>`, 'sm')}
      <div class="box ok">Every number after the slash in that output is this chapter. You now read it the way you read a sentence.</div>`,
  },

  {
    t: '★ CIDR is the unit of firewall and web-server rules',
    body: `${CSS}
      ${code(`ufw allow from 10.0.0.0/8 to any port 22      # SSH only from the campus
ufw allow from 192.168.1.0/24 to any port 5432 # Postgres only from the office`, 'bash', 'sm')}
      ${code(`location /admin {
    allow 203.0.113.0/24;   # office block
    deny  all;              # everyone else gets 403
}`, 'apache', 'sm')}
      <div class="box warn">A prefix one bit too wide silently admits twice as many machines, and nothing logs a warning. <b>/16 instead of /24 opens 256 times the address space.</b> Before writing a rule, compute the range: <span class="nw-m">python3 -c "import ipaddress as i; n=i.ip_network('10.0.0.0/8'); print(n[0], n[-1])"</span></div>`,
  },

  {
    t: '★ Three collisions that look like broken software',
    body: `${CSS}
      ${kv([
        ['VPN vs Docker', 'Office VPN routes 172.18.0.0/16; your compose network uses the same. Containers vanish from the office and only from the office.'],
        ['Home vs office', 'Both sides of a site-to-site VPN use 192.168.1.0/24. The tunnel comes up; no traffic crosses, because each end thinks the other subnet is itself.'],
        ['CGNAT', 'Your ISP gives 100.64.x.x, not a public address. Port forwarding cannot work — there is no public address to forward FROM.'],
      ])}
      <div class="box warn">All three present as "the app is broken". None of them is. The diagnosis is always the same move: list the CIDR blocks in play and check whether any two overlap. <span class="nw-m">ip route</span> on both ends answers it in ten seconds.</div>`,
  },

  /* ── Midterm — session 34 ────────────────────────────────────────────── */
  {
    t: 'Session 34 — Midterm Progress Test, CLO1 to CLO9',
    body: `${CSS}
      <table class="t"><thead><tr><th>From</th><th>What is examinable</th></tr></thead>
      <tbody>
        <tr><td>Ch.1–3</td><td>network components, OSI and TCP/IP layers, encapsulation, PDUs</td></tr>
        <tr><td>Ch.4 + 4B</td><td>media, signalling, <b>binary and hex conversion</b></td></tr>
        <tr><td>Ch.5–6</td><td>frames, MAC addresses, switch MAC table, duplex</td></tr>
        <tr><td>Ch.7–8</td><td>routing table, default gateway, ARP</td></tr>
        <tr><td class="hl">Ch.10</td><td class="hl">address structure, types, <b>subnetting and VLSM</b></td></tr>
      </tbody></table>
      <div class="box warn">The published plan says <b>CLO1 – CLO9</b> for this session. Note that the course defines ten CLOs; session 60 lists "CLO1-CLO11", which do not exist. We report the table as published rather than correcting it.</div>`,
  },

  {
    t: 'The four mistakes that cost the most marks',
    body: `${CSS}
      ${kv([
        ['Wrong formula', 'using 2^n for hosts, or 2^h - 2 for subnets. Read the question first.'],
        ['Forgetting -2', 'a /27 has 32 addresses and <b>30</b> hosts. Both numbers are correct answers to different questions.'],
        ['Next block off by one', 'the next subnet starts at <b>broadcast + 1</b>, not last host + 1.'],
        ['172.16.0.0/12', 'it ends at <b>172.31</b>.255.255. 172.32.0.1 is somebody else’s public address.'],
      ])}
      <div class="box ok">Under time pressure, write the block size first and the rest follows mechanically: block = 256 - last mask octet, networks are multiples of the block, broadcast is next network minus one.</div>`,
  },

  {
    t: 'What you can do after this chapter',
    body: `${CSS}
      ${kv([
        ['Split', 'an address into network and host with any mask, using AND, without a calculator'],
        ['Produce', 'network, first host, last host and broadcast for any prefix in under thirty seconds'],
        ['Choose', 'a prefix from a host requirement, and from a subnet-count requirement'],
        ['Design', 'a VLSM scheme largest-first, and prove no two blocks overlap'],
        ['Recognise', 'private, loopback, link-local, CGNAT and multicast ranges on sight'],
        ['★ Read', '<span class="nw-m">ip -br addr</span> and <span class="nw-m">ip route</span> on a real server and name every network on it'],
        ['★ Diagnose', 'an addressing collision between a VPN, a Docker bridge and a LAN'],
      ])}
      <div class="box ok">Next: <b>Chapter 11 — IPv6 Addressing</b> (sessions 35–36, Cisco Module 12), where the hexadecimal from Chapter 4B finally earns its place.</div>`,
  },
];
