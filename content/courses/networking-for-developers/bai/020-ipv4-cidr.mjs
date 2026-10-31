/**
 * Chương 2 · 2.1 — IPv4, CIDR và chia subnet bằng tay (slug khung netdev-2-1-ipv4-cidr). Bài MỞ CHƯƠNG: có khối
 * "Học xong chương này làm được gì" ở đầu bài đọc.
 * Output thật: lab/out/c21-dia-chi, c21-sai-mask, c21-chia, c21-docker (.out.txt). Công cụ: lab/code/ch02/cidr.py, chia.py.
 */
import { run, src, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-02-1.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };
const C = { drop: /^# / };   // dòng chú thích tiếng Việt của kịch bản lab không lọt vào bài

export default {
  title: '2.1 — IPv4, CIDR and subnetting by hand|||2.1 — IPv4, CIDR và chia subnet bằng tay',
  slug: 'netdev-2-1-ipv4-cidr',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Địa chỉ IPv4 là số 32 bit; phần mạng và phần host; mặt nạ và ký hiệu /24; AND bằng tay rồi kiểm bằng công cụ; đếm số host (/31, /32); "cùng mạng hay qua cổng"; lỗi gõ sai mặt nạ đo thật; các dải đặc biệt; chia VLSM cho văn phòng LabFlow; dải mạng của Docker.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>IPv4, CIDR and subnetting by hand</h2>
<p class="lead">In Chapter 1 every machine had an address like <code>10.10.1.10/24</code>, and we used the <code>/24</code> without asking what it means. This lesson answers it: what is inside an IPv4 address, how a computer decides "this address is next to me" or "this one is behind a router", how to cut an address block into networks of the right size — by hand, then checked by a tool — and the one-character mistake that causes a half-broken network.</p>

<div class="callout info">
<p><strong>🎯 Chapter 2 at a glance — what you will be able to do after it</strong></p>
<ul>
<li><strong>Read and plan addresses:</strong> tell from <code>10.30.0.200/26</code> which network it is in and who its neighbours are; split a block for an office or a Docker setup without overlaps.</li>
<li><strong>Follow a packet across networks:</strong> read a routing table, predict which line wins, read <code>traceroute</code> — including the <code>* * *</code> lines that scare people for nothing.</li>
<li><strong>Explain what your server really sees:</strong> why every user in a house (or on 4G) arrives from the same IP, why you cannot "just open a port" on mobile, what <code>docker run -p</code> does in the kernel.</li>
<li><strong>Fix IPv6 bugs</strong> that only some users hit: "localhost refused", a slow first request, logs full of <code>::ffff:</code>.</li>
<li><strong>Understand Internet-wide outages</strong> such as Facebook (2021) and YouTube (2008): BGP, routes being withdrawn or stolen — and what RPKI protects.</li>
</ul>
<p><strong>Why a developer needs this:</strong> cloud firewalls, nginx <code>allow</code> rules, rate limits and Docker networks are all written in CIDR; "connection refused", "no route to host" and "it works on Wi-Fi but not on 4G" are addressing and routing problems, not code problems. Everything in this chapter is measured in two labs on your machine: the LabFlow lab from Chapter 1, and a new "Internet in a box" with a home router, an ISP, an exchange point running real BGP, and a datacenter.</p>
</div>

<h3>An IPv4 address is one 32-bit number</h3>
<p>An <strong>IPv4 address</strong> is a number of 32 bits — four bytes. We write each byte in decimal (0–255) and put dots between them: <em>dotted decimal</em>. In lesson 1.1 you learned that a byte has bit weights 128, 64, 32, 16, 8, 4, 2, 1; so <code>10.10.1.10</code> is really:</p>
<pre><code class="language-text">10       .10       .1        .10
00001010 .00001010 .00000001 .00001010</code></pre>
<p>32 bits give 2<sup>32</sup> ≈ 4.29 billion different addresses. That sounds like a lot until you count phones, laptops, servers and cameras — we return to that problem in lessons 2.3 (NAT) and 2.4 (IPv6).</p>

<h3>Network part and host part: why an address has two halves</h3>
<p>Think of a street address: "12 Tran Hung Dao street". The <em>street</em> tells the postman which area to go to; the <em>house number</em> only matters once he is on that street. IP addresses work the same way. The first bits name the <strong>network</strong> (the street), the remaining bits name the <strong>host</strong> — the machine — on that network (the house number).</p>
<p>The reason is scale. A router on the Internet cannot keep one line for each of four billion machines. It keeps one line per <em>network</em>: "everything in 203.0.113.something goes that way". The device that tells where the network part ends is the <strong>subnet mask</strong>: 32 bits, all ones for the network part, all zeros for the host part. <code>/24</code> — the <strong>prefix length</strong> — is just a short way to say "the first 24 bits are the network": the mask <code>11111111.11111111.11111111.00000000</code> = <code>255.255.255.0</code>. Writing an address as <code>address/prefix</code> is called <strong>CIDR notation</strong> (Classless Inter-Domain Routing). Here is the lab client from Chapter 1:</p>
${run('c21-dia-chi', 'ip -br -4 addr show eth0', 2, C)}
<p>The second line of <code>ip route</code> was not typed by anyone: as soon as the address <code>10.10.1.10/24</code> was set, the kernel computed the network <code>10.10.1.0/24</code> and added a route "this network is right here on <code>eth0</code>" (<code>proto kernel scope link</code> = directly connected, created by the kernel). The mask is not decoration — it decides what the machine believes is next to it.</p>

<h3>By hand: AND with the mask</h3>
<p>To find the network of an address, keep the bits where the mask is 1 and turn the others to 0. That is a bitwise <strong>AND</strong>: 1 AND 1 = 1, anything AND 0 = 0. Then the <strong>broadcast address</strong> — "everyone on this network" — is the network with all host bits set to 1. Let us do the easy one, then the one that appears in exams and in real configs.</p>
<p><strong>Example 1: 10.10.1.10/24.</strong> The mask ends exactly at a byte boundary, so you can do it in your head: keep the first three bytes, zero the last one. Network <code>10.10.1.0</code>, broadcast <code>10.10.1.255</code>, hosts <code>.1</code> to <code>.254</code>.</p>
<p><strong>Example 2: 192.168.50.77/26.</strong> 26 bits = three full bytes + 2 bits of the fourth. Only the fourth byte needs work:</p>
<pre><code class="language-text">77    = 0100 1101
mask  = 1100 0000   (/26 → the first 2 bits of this byte: 128 + 64 = 192)
AND   = 0100 0000 = 64      → network   192.168.50.64
host bits all 1:
        0111 1111 = 127     → broadcast 192.168.50.127</code></pre>
<p>A shortcut you will use every day: the <strong>block size</strong> of the interesting byte is 256 − 192 = 64, so networks start at 0, 64, 128, 192. 77 falls in the block 64–127. Now check both answers with the small tool of this lab (<code>lab/code/ch02/cidr.py</code>, which does exactly these steps and then asks Python's own <code>ipaddress</code> library):</p>
${run('c21-dia-chi', 'python3 cidr.py 10.10.1.10/24', 1)}
${run('c21-dia-chi', 'python3 cidr.py 192.168.50.77/26', 1)}
${net('subnet', 'mask', 'en', 'Move the prefix slider and watch the mask, the AND and the broadcast change bit by bit — then find 192.168.50.77/26 yourself.', { tour: 'subnet-mask' })}

<h3>How many machines fit: 2<sup>host bits</sup> − 2</h3>
<p>A /p network has 32 − p host bits, so 2<sup>32−p</sup> addresses. Two of them are not given to machines: the first (the network itself) and the last (broadcast). The same address with a bigger prefix makes a much bigger network:</p>
${run('c21-dia-chi', 'python3 cidr.py 10.10.1.10/16', 1)}
<table>
<tr><th>Prefix</th><th>Mask</th><th>Addresses</th><th>Usable hosts</th><th>Where you meet it</th></tr>
<tr><td>/8</td><td>255.0.0.0</td><td>16 777 216</td><td>16 777 214</td><td><code>10.0.0.0/8</code> — a whole private range</td></tr>
<tr><td>/16</td><td>255.255.0.0</td><td>65 536</td><td>65 534</td><td>Docker's default bridge <code>172.17.0.0/16</code>; a cloud VPC</td></tr>
<tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>254</td><td>a home or office LAN; most lab networks</td></tr>
<tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>62</td><td>a small server segment</td></tr>
<tr><td>/30</td><td>255.255.255.252</td><td>4</td><td>2</td><td>an old-style link between two routers</td></tr>
<tr><td>/31</td><td>255.255.255.254</td><td>2</td><td>2</td><td>point-to-point link (RFC 3021): no broadcast needed</td></tr>
<tr><td>/32</td><td>255.255.255.255</td><td>1</td><td>1</td><td>exactly one machine: firewall rules, routes, "my IP/32"</td></tr>
</table>
${run('c21-dia-chi', 'python3 cidr.py 203.0.113.10/32', 2)}
<p>Every time a cloud console asks you for a "source CIDR", this table is the question. <code>0.0.0.0/0</code> means "every address" (zero network bits); <code>203.0.113.10/32</code> means "only this one machine".</p>

<h3>"Is it on my network?" — the first decision of every packet</h3>
<p>Before sending anything, the computer applies its own mask to the destination. Same network ⇒ deliver directly (ARP for the destination's MAC, lesson 1.4). Different network ⇒ send to a router (the <strong>default gateway</strong>). <code>ip route get</code> shows the decision:</p>
${run('c21-dia-chi', 'ip route get 10.10.1.11', 3)}
<p><code>10.10.1.200</code> has no machine, but it is <em>inside</em> 10.10.1.0/24, so the kernel would try to ARP for it directly. <code>10.10.2.10</code> is outside, so it goes <code>via 10.10.1.254</code> — the router. Where do the four settings of a normal computer (address, mask, gateway, DNS server) come from? On a home or office network a <strong>DHCP</strong> server hands them out when the device joins; in Docker, the daemon's address manager (IPAM) does it; on a server you may type them in a config file. Wherever they come from, the mask is the one that decides this first step.</p>
${net('subnet', 'same', 'en', 'Pick a destination and see the decision: deliver myself or send to the gateway — then type the wrong mask and watch the ARP requests that nobody answers.')}

<div class="pitfall co-tieu-de">
<p><strong>One character wrong: /16 instead of /24.</strong> A real and common bug: someone configures a machine by hand and types the mask 255.255.0.0 instead of 255.255.255.0. The machine still reaches its own LAN and still reaches the Internet through the gateway — so "the network works". Only some networks are broken. We set up client2 like an office PC (address, mask, default gateway), first correctly:</p>
${run('c21-sai-mask', 'ip -br -4 addr show eth0', 3, C)}
<p>Now the typo:</p>
${run('c21-sai-mask', 'ip -br -4 addr show eth0', 3, { ...C, lan: 2 })}
<p>With /16, the kernel believes all of <code>10.10.x.x</code> is next door — so for 10.10.2.10 there is no <code>via</code>: it will ARP for the server itself, on a LAN where the server is not.</p>
${run('c21-sai-mask', 'ping -c 4', 1, C)}
${run('c21-sai-mask', 'tcpdump -n -r', 2, C)}
<p>The capture proves it (the one <code>Reply</code> line is client2 answering an ARP question from another machine on its LAN — background traffic, unrelated): <code>who-has 10.10.2.10</code> again and again, no answer, the neighbour entry ends <code>FAILED</code>, and ping reports "Destination Host Unreachable" from <em>its own</em> address — no router was ever involved. Typing /24 again restores the <code>via</code>:</p>
${run('c21-sai-mask', 'ip route get 10.10.2.10', 2, { ...C, lan: 2 })}
<p>How to recognise it in real life: one machine reaches the Internet but not one particular internal network that "is nearby" in numbers. Check the mask first (<code>ip -br addr</code>, <code>ip route get</code>), before blaming the firewall or the cable.</p>
</div>

<h3>Special addresses you will meet</h3>
<p>Some ranges have a fixed meaning (the official list is IANA's special-purpose registry):</p>
<table>
<tr><th>Range</th><th>Meaning</th><th>What it tells you in practice</th></tr>
<tr><td><code>0.0.0.0</code></td><td>"this host / any address"</td><td>listen on all interfaces (lesson 1.5); <code>0.0.0.0/0</code> = all addresses</td></tr>
<tr><td><code>127.0.0.0/8</code></td><td>loopback</td><td>traffic never leaves the machine (<code>127.0.0.1</code> = localhost)</td></tr>
<tr><td><code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code></td><td>private (RFC 1918)</td><td>used inside homes, offices, Docker, clouds; not routed on the Internet — lesson 2.3</td></tr>
<tr><td><code>100.64.0.0/10</code></td><td>shared address space (RFC 6598)</td><td>your ISP uses carrier-grade NAT — lesson 2.3</td></tr>
<tr><td><code>169.254.0.0/16</code></td><td>link-local</td><td>the machine gave itself an address because DHCP failed; in clouds, <code>169.254.169.254</code> is the metadata service</td></tr>
<tr><td><code>192.0.2.0/24</code>, <code>198.51.100.0/24</code>, <code>203.0.113.0/24</code></td><td>documentation (RFC 5737)</td><td>reserved for examples — our "Internet in a box" uses them so we never touch anyone's real address</td></tr>
<tr><td><code>224.0.0.0/4</code></td><td>multicast</td><td>one packet to a group (e.g. mDNS <code>224.0.0.251</code>)</td></tr>
<tr><td><code>255.255.255.255</code></td><td>limited broadcast</td><td>"everyone on this link" — DHCP uses it before the machine has an address</td></tr>
</table>

<h3>A short history: from classes to CIDR to running out</h3>
<p>The first design (RFC 791, 1981) had fixed <strong>classes</strong>: class A networks were /8, class B /16, class C /24 — the class was read from the first bits of the address. A company with 300 machines was too big for a class C and had to take a class B of 65 534 addresses, wasting almost all of it, and every network was one more line in every Internet router. In 1993 <strong>CIDR</strong> (RFC 1519, today RFC 4632) removed the classes: any prefix length, and neighbouring networks can be <em>aggregated</em> into one shorter prefix in routing tables. It slowed the problem down; it did not solve it. On 3 February 2011 the central pool at IANA handed out its last /8 blocks to the five regional registries (APNIC, which serves Asia-Pacific including Vietnam, had received two more on 31 January). Since then IPv4 addresses are recycled, traded and shared — which is why NAT (2.3) and IPv6 (2.4) matter so much.</p>

<h3>Subnetting a real plan: the LabFlow office</h3>
<p>LabFlow gets the block <code>10.20.0.0/22</code> (1 024 addresses) for a new office and needs four networks: IoT sensors (300 devices), web servers (100), databases (20) and management (10). The method, by hand:</p>
<ol>
<li><strong>Sort the needs from largest to smallest.</strong></li>
<li>For each, find the smallest block that fits <em>hosts + 2</em>: 300 + 2 → 512 = /23; 100 + 2 → 128 = /25; 20 + 2 → 32 = /27; 10 + 2 → 16 = /28.</li>
<li><strong>Place each block at the next free address that is a multiple of its own size</strong> (a /25 must start at .0 or .128 — this is called alignment).</li>
<li>Write the network, first host, last host and broadcast; check nothing overlaps and everything is inside the block.</li>
</ol>
<p>This plan is called <strong>VLSM</strong> (variable-length subnet masks): subnets of different sizes in one block. Then check with the second tool, <code>chia.py</code>:</p>
${run('c21-chia', 'python3 chia.py 10.20.0.0/22 iot', 1)}
<p>Why largest first? Here is the same plan in the order someone typed it:</p>
${run('c21-chia', 'python3 chia.py --as-given', 1)}
<p>It still fits — but the /23 had to jump to <code>10.20.2.0</code> to be aligned, leaving a hole of 336 addresses in the middle, and the block is now full: the next team that asks for a /24 gets nothing. And when the block is simply too small, say so before anybody configures a router:</p>
${run('c21-chia', 'python3 chia.py 10.20.0.0/24', 1)}
${net('subnet', 'vlsm', 'en', 'Allocate the LabFlow office: change the host counts, switch between "largest first" and "as given", and watch the gaps appear.', { tour: 'subnet-vlsm' })}

<h3>Docker chooses subnets too — and they can collide</h3>
<p>Every Docker network is a subnet. When you do not give one, Docker picks a free range from its default pools (172.17.0.0/16 for the default bridge, then more 172.x and 192.168.x blocks):</p>
${run('c21-docker', 'docker network inspect bridge', 2)}
<div class="pitfall co-tieu-de">
<p><strong>"Since I started Docker I cannot reach the school/company network."</strong> If the office, the VPN or the school Wi-Fi also uses, for example, <code>172.18.0.0/16</code> and Docker creates a network in that range, your machine now has two routes for the same addresses — and the local Docker bridge wins, so traffic to the real office servers goes into a container network and disappears. Fix it once in <code>/etc/docker/daemon.json</code> with <code>"default-address-pools"</code> (a range you know is unused, e.g. <code>{"base": "10.200.0.0/16", "size": 24}</code>), or give the compose network an explicit <code>subnet</code> like our lab does.</p>
</div>

<h3>Where this lives in the computer</h3>
<ul>
<li>The address and mask of each interface, and the <strong>routing table</strong> built from them, are kernel tables in RAM (<code>ip addr</code>, <code>ip route</code> read them). The mask is applied by kernel code on a CPU core for every packet sent.</li>
<li>DHCP is a small program (a client on the device, a server on the router) that writes those settings into the kernel.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-10-1-cau-truc-dia-chi-ipv4', so: '10.1', ten: 'IPv4 address structure, types and segmentation', giong: 'network and host parts, masks, AND, unicast/broadcast/multicast, private ranges', khac: 'NWC204 works the examples on paper and in Packet Tracer', them: 'the mask measured as a kernel decision (ip route get), the wrong-mask bug captured with tcpdump, /31 and /32, the special-purpose ranges a developer meets, and Docker’s address pools' })}
${cauNoi('en', { ...NWC, bai: 'nwc204-10-2-chia-subnet-va-vlsm', so: '10.2', ten: 'Subnetting, VLSM and structured design', giong: 'borrowing host bits, block sizes, VLSM largest first', khac: 'NWC204 designs for a Cisco topology', them: 'a plan for the LabFlow office checked by a script, the alignment gap made visible, and a plan that does not fit' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a new LabFlow intern says: "My VM <code>10.10.1.50</code> reaches the Internet, but not the API at <code>10.10.2.20</code>. We already changed the cable." The VM's settings show mask <code>255.255.0.0</code>, gateway <code>10.10.1.254</code>. Your lead also asks for an address plan for a second office.</p>
<ol>
<li>By hand (paper first!): find the network and broadcast of <code>10.10.1.50/16</code> and of <code>10.10.1.50/24</code>. Is <code>10.10.2.20</code> inside each? Then check with <code>python3 cidr.py</code> in <code>nfd-client</code> (<code>cd /lab/k/code/ch02</code>).</li>
<li>Reproduce the bug on <code>nfd-client2</code> with the commands from the pitfall (address 10.10.1.11/16). Run <code>ip route get 10.10.2.20</code> and a capture: which ARP question do you see?</li>
<li>Fix it with /24 and prove the API answers (<code>curl -s http://10.10.2.20:3000/api/hello</code>). Restore the lab: <code>docker compose -f moi-truong/compose.yml -p nfd up -d --force-recreate client2</code> (from the <code>lab/</code> folder).</li>
<li>Plan the block <code>10.40.0.0/23</code> for: staff Wi-Fi 200, cameras 40, servers 25, printers 5. Do it by hand, then verify with <code>python3 chia.py</code>. How many addresses are left?</li>
</ol>
<p><strong>Done when:</strong> your two calculations match the tool, you can show the <code>who-has 10.10.2.20</code> lines and explain in one sentence why the machine "reaches the Internet but not the API", and your plan has no overlap.</p>
<details><summary>Solution</summary>
<p>1) <code>10.10.1.50/16</code> → network 10.10.0.0, broadcast 10.10.255.255 — 10.10.2.20 is inside, so the VM thinks the API is on its own LAN. <code>/24</code> → network 10.10.1.0, broadcast 10.10.1.255 — 10.10.2.20 is outside, so it goes to the gateway. 2) <code>ip route get 10.10.2.20</code> shows <code>dev eth0</code> with no <code>via</code>; the capture shows repeated <code>who-has 10.10.2.20 tell 10.10.1.11</code> and no reply. 3) With /24 the route says <code>via 10.10.1.254</code> and curl answers. The sentence: "The mask was /16, so the VM believes every 10.10.x.x address is on its own cable; it asks ARP for the API instead of sending to the router. The Internet works because those addresses are outside 10.10.0.0/16 and still use the gateway." 4) Sorted: Wi-Fi 200 → /24 <code>10.40.0.0/24</code>; cameras 40 → /26 <code>10.40.1.0/26</code>; servers 25 → /27 <code>10.40.1.64/27</code>; printers 5 → /29 <code>10.40.1.96/29</code>. Used 256 + 64 + 32 + 8 = 360 of 512; next free 10.40.1.104 — 152 addresses left.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['IPv4 address (địa chỉ IPv4)', '32-bit number written as four decimal bytes, e.g. 10.10.1.10.'],
    ['network part / host part', 'First bits name the network (the street), the rest name the machine on it (the house).'],
    ['subnet mask (mặt nạ mạng)', '32 bits: ones for the network part, zeros for the host part, e.g. 255.255.255.0.'],
    ['prefix length, CIDR (/24)', 'Number of network bits; 10.10.1.0/24 is CIDR notation.'],
    ['broadcast address', 'Network with all host bits 1 — “everyone on this network”.'],
    ['default gateway (cổng mặc định)', 'The router a machine sends to when the destination is not on its network.'],
    ['VLSM', 'Subnets of different sizes in one block; allocate largest first, aligned.'],
    ['DHCP', 'Hands out address, mask, gateway and DNS server when a device joins a network.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>An IPv4 address is 32 bits; the mask (or /prefix) splits it into a network part and a host part.</li>
<li>Network = address AND mask; broadcast = host bits all 1; usable hosts = 2<sup>32−p</sup> − 2 (/31 = 2, /32 = 1).</li>
<li>Every packet starts with one decision: same network ⇒ deliver directly; otherwise ⇒ default gateway. A wrong mask breaks exactly that decision.</li>
<li>Know the special ranges: 127/8, RFC 1918 private, 100.64/10 CGNAT, 169.254/16 "DHCP failed", 0.0.0.0/0 "everything".</li>
<li>Plan VLSM largest first and aligned; check with a tool; watch Docker's default pools against your real networks.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4632', '📄', 'RFC 4632 — Classless Inter-domain Routing (CIDR)', 'Prefixes, aggregation, and why classes were dropped.', 'Open')}
${L('https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml', '📄', 'IANA IPv4 Special-Purpose Address Registry', 'The official list of reserved ranges.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc3021', '📄', 'RFC 3021 — Using 31-bit prefixes on point-to-point links', 'Why a /31 has two usable addresses.', 'Open')}
${L('https://www.nro.net/ipv4-free-pool-depleted/', '📰', 'NRO — Free pool of IPv4 address space depleted (3 Feb 2011)', 'The day the central IPv4 pool ran out.', 'Open')}
${L('https://docs.docker.com/engine/network/', '🐳', 'Docker docs — Networking overview', 'Default address pools and how to change them.', 'Open')}
${L('https://docs.python.org/3/library/ipaddress.html', '🐍', 'Python ipaddress module', 'The library cidr.py and chia.py check themselves against.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>IPv4, CIDR và chia subnet bằng tay</h2>
<p class="lead">Ở Chương 1, máy nào cũng có địa chỉ kiểu <code>10.10.1.10/24</code>, và ta dùng cái <code>/24</code> mà chưa hỏi nó nghĩa là gì. Bài này trả lời: bên trong một địa chỉ IPv4 có gì, máy tính quyết định "địa chỉ này ở ngay cạnh mình" hay "địa chỉ kia nằm sau router" ra sao, cắt một khối địa chỉ thành các mạng đúng cỡ thế nào — làm bằng tay trước, rồi kiểm bằng công cụ — và cái lỗi sai đúng một ký tự gây ra một mạng "hỏng một nửa".</p>

<div class="callout info">
<p><strong>🎯 Chương 2 trong một khung — học xong bạn làm được gì</strong></p>
<ul>
<li><strong>Đọc và lên kế hoạch địa chỉ:</strong> nhìn <code>10.30.0.200/26</code> là biết nó thuộc mạng nào, hàng xóm là ai; chia một khối địa chỉ cho văn phòng hay cho Docker mà không chồng lấn.</li>
<li><strong>Theo một gói tin qua nhiều mạng:</strong> đọc bảng định tuyến, đoán dòng nào thắng, đọc <code>traceroute</code> — kể cả những dòng <code>* * *</code> khiến người ta hoảng vô cớ.</li>
<li><strong>Giải thích máy chủ của bạn thật sự thấy gì:</strong> vì sao mọi người trong một nhà (hay trên 4G) tới từ cùng một IP, vì sao trên 4G không "mở cổng" được, <code>docker run -p</code> làm gì trong nhân.</li>
<li><strong>Sửa lỗi IPv6</strong> chỉ một số người dùng gặp: "localhost bị từ chối", request đầu chậm, log đầy <code>::ffff:</code>.</li>
<li><strong>Hiểu các sự cố cả Internet</strong> như Facebook (2021), YouTube (2008): BGP, tuyến bị rút hay bị cướp — và RPKI bảo vệ được gì.</li>
</ul>
<p><strong>Vì sao lập trình viên cần:</strong> tường lửa trên cloud, luật <code>allow</code> của nginx, giới hạn tần suất và mạng Docker đều viết bằng CIDR; "connection refused", "no route to host" và "Wi-Fi thì được mà 4G thì không" là chuyện địa chỉ và định tuyến, không phải chuyện code. Mọi thứ trong chương được đo trên hai phòng lab ngay trên máy bạn: lab LabFlow của Chương 1, và một "Internet trong một hộp" mới — có router nhà, nhà mạng (ISP), điểm trao đổi chạy BGP thật, và trung tâm dữ liệu.</p>
</div>

<h3>Địa chỉ IPv4 là một con số 32 bit</h3>
<p><strong>Địa chỉ IPv4</strong> là một con số 32 bit — bốn byte. Ta viết mỗi byte bằng số thập phân (0–255) và đặt dấu chấm giữa chúng: <em>dạng thập phân có chấm (dotted decimal)</em>. Ở bài 1.1 bạn đã biết một byte có trọng số các bit là 128, 64, 32, 16, 8, 4, 2, 1; vậy <code>10.10.1.10</code> thật ra là:</p>
<pre><code class="language-text">10       .10       .1        .10
00001010 .00001010 .00000001 .00001010</code></pre>
<p>32 bit cho 2<sup>32</sup> ≈ 4,29 tỉ địa chỉ khác nhau. Nghe thì nhiều cho tới khi bạn đếm điện thoại, laptop, máy chủ, camera — ta quay lại chuyện đó ở bài 2.3 (NAT) và 2.4 (IPv6).</p>

<h3>Phần mạng và phần host: vì sao địa chỉ có hai nửa</h3>
<p>Hãy nghĩ tới một địa chỉ nhà: "số 12 đường Trần Hưng Đạo". <em>Tên đường</em> cho người đưa thư biết phải tới khu nào; <em>số nhà</em> chỉ có nghĩa khi đã ở đúng đường đó. Địa chỉ IP cũng vậy. Các bit đầu đặt tên cho <strong>mạng (network)</strong> — tên đường; các bit còn lại đặt tên cho <strong>host</strong> — tức một máy — trên mạng đó — số nhà.</p>
<p>Lý do là quy mô. Một router trên Internet không thể giữ một dòng cho từng máy trong bốn tỉ máy. Nó giữ một dòng cho mỗi <em>mạng</em>: "mọi thứ trong 203.0.113.gì-đó thì đi hướng kia". Thứ cho biết phần mạng kết thúc ở đâu là <strong>mặt nạ mạng (subnet mask)</strong>: 32 bit, toàn số 1 ở phần mạng, toàn số 0 ở phần host. <code>/24</code> — <strong>độ dài tiền tố (prefix length)</strong> — chỉ là cách viết gọn "24 bit đầu là mạng": mặt nạ <code>11111111.11111111.11111111.00000000</code> = <code>255.255.255.0</code>. Viết địa chỉ dạng <code>địa_chỉ/prefix</code> gọi là <strong>ký hiệu CIDR</strong> (Classless Inter-Domain Routing — định tuyến liên miền không theo lớp). Đây là máy client của lab Chương 1:</p>
${run('c21-dia-chi', 'ip -br -4 addr show eth0', 2, C)}
<p>Dòng thứ hai của <code>ip route</code> không do ai gõ: ngay khi địa chỉ <code>10.10.1.10/24</code> được đặt, nhân tính ra mạng <code>10.10.1.0/24</code> và thêm một tuyến "mạng này ở ngay đây trên <code>eth0</code>" (<code>proto kernel scope link</code> = nối trực tiếp, do nhân tạo). Mặt nạ không phải đồ trang trí — nó quyết định máy tin cái gì đang ở cạnh mình.</p>

<h3>Làm bằng tay: AND với mặt nạ</h3>
<p>Muốn tìm mạng của một địa chỉ, giữ các bit ở chỗ mặt nạ là 1 và biến các bit còn lại thành 0. Đó là phép <strong>AND</strong> theo bit: 1 AND 1 = 1, gì AND 0 cũng = 0. Còn <strong>địa chỉ broadcast</strong> — "mọi máy trong mạng này" — là địa chỉ mạng với mọi bit host bật thành 1. Ta làm ví dụ dễ trước, rồi tới ví dụ hay gặp trong đề thi và trong cấu hình thật.</p>
<p><strong>Ví dụ 1: 10.10.1.10/24.</strong> Mặt nạ kết thúc đúng ở ranh giới byte, nên tính nhẩm được: giữ ba byte đầu, byte cuối thành 0. Mạng <code>10.10.1.0</code>, broadcast <code>10.10.1.255</code>, các host từ <code>.1</code> tới <code>.254</code>.</p>
<p><strong>Ví dụ 2: 192.168.50.77/26.</strong> 26 bit = ba byte đầy + 2 bit của byte thứ tư. Chỉ byte thứ tư cần tính:</p>
<pre><code class="language-text">77    = 0100 1101
mask  = 1100 0000   (/26 → 2 bit đầu của byte này: 128 + 64 = 192)
AND   = 0100 0000 = 64      → mạng      192.168.50.64
bit host toàn 1:
        0111 1111 = 127     → broadcast 192.168.50.127</code></pre>
<p>Một mẹo bạn sẽ dùng hằng ngày: <strong>cỡ khối (block size)</strong> của byte đang xét là 256 − 192 = 64, nên các mạng bắt đầu ở 0, 64, 128, 192. Số 77 rơi vào khối 64–127. Giờ kiểm cả hai đáp án bằng công cụ nhỏ của lab (<code>lab/code/ch02/cidr.py</code> — làm đúng các bước trên rồi hỏi lại thư viện <code>ipaddress</code> của chính Python):</p>
${run('c21-dia-chi', 'python3 cidr.py 10.10.1.10/24', 1)}
${run('c21-dia-chi', 'python3 cidr.py 192.168.50.77/26', 1)}
${net('subnet', 'mask', 'vi', 'Kéo thanh prefix và xem mặt nạ, phép AND, broadcast đổi theo từng bit — rồi tự tìm 192.168.50.77/26.', { tour: 'subnet-mask' })}

<h3>Chứa được bao nhiêu máy: 2<sup>số bit host</sup> − 2</h3>
<p>Mạng /p có 32 − p bit host, tức 2<sup>32−p</sup> địa chỉ. Hai địa chỉ không cấp cho máy nào: địa chỉ đầu (chính mạng đó) và địa chỉ cuối (broadcast). Cùng một địa chỉ nhưng prefix ngắn hơn là một mạng lớn hơn rất nhiều:</p>
${run('c21-dia-chi', 'python3 cidr.py 10.10.1.10/16', 1)}
<table>
<tr><th>Prefix</th><th>Mặt nạ</th><th>Số địa chỉ</th><th>Host dùng được</th><th>Gặp ở đâu</th></tr>
<tr><td>/8</td><td>255.0.0.0</td><td>16 777 216</td><td>16 777 214</td><td><code>10.0.0.0/8</code> — cả một dải riêng</td></tr>
<tr><td>/16</td><td>255.255.0.0</td><td>65 536</td><td>65 534</td><td>bridge mặc định của Docker <code>172.17.0.0/16</code>; một VPC trên cloud</td></tr>
<tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>254</td><td>mạng LAN ở nhà, ở văn phòng; phần lớn mạng của lab</td></tr>
<tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>62</td><td>một đoạn mạng máy chủ nhỏ</td></tr>
<tr><td>/30</td><td>255.255.255.252</td><td>4</td><td>2</td><td>đường nối hai router kiểu cũ</td></tr>
<tr><td>/31</td><td>255.255.255.254</td><td>2</td><td>2</td><td>đường điểm-điểm (RFC 3021): không cần broadcast</td></tr>
<tr><td>/32</td><td>255.255.255.255</td><td>1</td><td>1</td><td>đúng một máy: luật tường lửa, tuyến, "IP của tôi/32"</td></tr>
</table>
${run('c21-dia-chi', 'python3 cidr.py 203.0.113.10/32', 2)}
<p>Mỗi lần trang quản trị cloud hỏi bạn "source CIDR", câu hỏi chính là bảng này. <code>0.0.0.0/0</code> nghĩa là "mọi địa chỉ" (không bit mạng nào); <code>203.0.113.10/32</code> nghĩa là "chỉ đúng máy này".</p>

<h3>"Có cùng mạng với mình không?" — quyết định đầu tiên của mọi gói tin</h3>
<p>Trước khi gửi bất cứ thứ gì, máy áp mặt nạ của chính nó lên địa chỉ đích. Cùng mạng ⇒ tự giao thẳng (hỏi ARP lấy MAC của đích, bài 1.4). Khác mạng ⇒ gửi cho router (<strong>cổng mặc định — default gateway</strong>). <code>ip route get</code> cho thấy quyết định đó:</p>
${run('c21-dia-chi', 'ip route get 10.10.1.11', 3)}
<p><code>10.10.1.200</code> không có máy nào, nhưng nó nằm <em>trong</em> 10.10.1.0/24, nên nhân sẽ thử hỏi ARP trực tiếp cho nó. <code>10.10.2.10</code> nằm ngoài, nên đi <code>via 10.10.1.254</code> — router. Bốn thiết lập của một máy bình thường (địa chỉ, mặt nạ, cổng mặc định, máy chủ DNS) từ đâu ra? Ở mạng nhà hay văn phòng, máy chủ <strong>DHCP</strong> cấp chúng khi thiết bị vừa vào mạng; trong Docker thì bộ quản lý địa chỉ (IPAM) của daemon làm; trên máy chủ thì có thể bạn gõ trong một tệp cấu hình. Dù từ đâu ra, chính mặt nạ quyết định bước đầu tiên này.</p>
${net('subnet', 'same', 'vi', 'Chọn một địa chỉ đích và xem quyết định: tự giao hay gửi cho cổng mặc định — rồi gõ sai mặt nạ và xem những câu hỏi ARP không ai trả lời.')}

<div class="pitfall co-tieu-de">
<p><strong>Sai một ký tự: /16 thay vì /24.</strong> Một lỗi thật và rất hay gặp: ai đó cấu hình tay một máy và gõ mặt nạ 255.255.0.0 thay vì 255.255.255.0. Máy vẫn tới được LAN của mình và vẫn ra Internet qua cổng mặc định — nên "mạng vẫn chạy". Chỉ vài mạng bị hỏng. Ta cấu hình client2 như một máy văn phòng (địa chỉ, mặt nạ, cổng mặc định), trước hết là cho đúng:</p>
${run('c21-sai-mask', 'ip -br -4 addr show eth0', 3, C)}
<p>Giờ gõ nhầm:</p>
${run('c21-sai-mask', 'ip -br -4 addr show eth0', 3, { ...C, lan: 2 })}
<p>Với /16, nhân tin rằng cả <code>10.10.x.x</code> đều ở sát vách — nên với 10.10.2.10 không còn <code>via</code>: nó sẽ hỏi ARP cho chính máy chủ, trên một LAN mà máy chủ không hề ở đó.</p>
${run('c21-sai-mask', 'ping -c 4', 1, C)}
${run('c21-sai-mask', 'tcpdump -n -r', 2, C)}
<p>Bản bắt gói chứng minh (dòng <code>Reply</code> duy nhất là client2 trả lời câu hỏi ARP của một máy khác trong LAN — lưu lượng nền, không liên quan): <code>who-has 10.10.2.10</code> lặp đi lặp lại, không ai trả lời, mục hàng xóm kết thúc ở <code>FAILED</code>, và ping báo "Destination Host Unreachable" từ <em>chính</em> địa chỉ của nó — không router nào dính vào cả. Gõ lại /24 thì <code>via</code> quay về:</p>
${run('c21-sai-mask', 'ip route get 10.10.2.10', 2, { ...C, lan: 2 })}
<p>Nhận ra ngoài đời thế nào: một máy ra được Internet nhưng không tới được đúng một mạng nội bộ "trông gần" về mặt con số. Kiểm mặt nạ trước (<code>ip -br addr</code>, <code>ip route get</code>), trước khi đổ cho tường lửa hay dây cáp.</p>
</div>

<h3>Những địa chỉ đặc biệt bạn sẽ gặp</h3>
<p>Một số dải có nghĩa cố định (danh sách chính thức là sổ đăng ký địa chỉ dùng cho mục đích đặc biệt của IANA):</p>
<table>
<tr><th>Dải</th><th>Nghĩa</th><th>Ngoài thực tế nó cho bạn biết gì</th></tr>
<tr><td><code>0.0.0.0</code></td><td>"máy này / mọi địa chỉ"</td><td>nghe trên mọi card mạng (bài 1.5); <code>0.0.0.0/0</code> = mọi địa chỉ</td></tr>
<tr><td><code>127.0.0.0/8</code></td><td>loopback</td><td>gói không bao giờ rời máy (<code>127.0.0.1</code> = localhost)</td></tr>
<tr><td><code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code></td><td>riêng (RFC 1918)</td><td>dùng trong nhà, văn phòng, Docker, cloud; không được định tuyến trên Internet — bài 2.3</td></tr>
<tr><td><code>100.64.0.0/10</code></td><td>không gian dùng chung (RFC 6598)</td><td>nhà mạng của bạn dùng NAT cấp nhà mạng (CGNAT) — bài 2.3</td></tr>
<tr><td><code>169.254.0.0/16</code></td><td>link-local</td><td>máy tự đặt địa chỉ vì DHCP hỏng; trên cloud, <code>169.254.169.254</code> là dịch vụ metadata</td></tr>
<tr><td><code>192.0.2.0/24</code>, <code>198.51.100.0/24</code>, <code>203.0.113.0/24</code></td><td>dành cho tài liệu (RFC 5737)</td><td>để viết ví dụ — "Internet trong một hộp" dùng chúng để không bao giờ đụng địa chỉ thật của ai</td></tr>
<tr><td><code>224.0.0.0/4</code></td><td>multicast</td><td>một gói gửi cho cả một nhóm (vd mDNS <code>224.0.0.251</code>)</td></tr>
<tr><td><code>255.255.255.255</code></td><td>broadcast giới hạn</td><td>"mọi máy trên đường truyền này" — DHCP dùng khi máy chưa có địa chỉ</td></tr>
</table>

<h3>Lịch sử ngắn: từ lớp địa chỉ tới CIDR tới lúc cạn</h3>
<p>Thiết kế đầu tiên (RFC 791, năm 1981) có các <strong>lớp (class)</strong> cố định: mạng lớp A là /8, lớp B /16, lớp C /24 — lớp được đọc từ mấy bit đầu của địa chỉ. Một công ty có 300 máy thì quá lớn cho lớp C, phải lấy cả một lớp B 65 534 địa chỉ và bỏ phí gần hết, mà mạng nào cũng thêm một dòng vào mọi router trên Internet. Năm 1993 <strong>CIDR</strong> (RFC 1519, nay là RFC 4632) bỏ các lớp: prefix dài bao nhiêu cũng được, và các mạng liền kề có thể <em>gộp (aggregate)</em> thành một prefix ngắn hơn trong bảng định tuyến. Nó làm vấn đề chậm lại chứ không giải quyết được. Ngày 3/2/2011, kho trung tâm của IANA cấp nốt các khối /8 cuối cùng cho năm tổ chức đăng ký khu vực (APNIC — phụ trách châu Á – Thái Bình Dương, gồm cả Việt Nam — đã nhận thêm hai khối vào 31/1). Từ đó địa chỉ IPv4 được thu hồi, mua bán và dùng chung — vì thế NAT (2.3) và IPv6 (2.4) quan trọng đến vậy.</p>

<h3>Chia subnet cho một kế hoạch thật: văn phòng LabFlow</h3>
<p>LabFlow nhận khối <code>10.20.0.0/22</code> (1 024 địa chỉ) cho văn phòng mới và cần bốn mạng: cảm biến IoT (300 thiết bị), máy chủ web (100), cơ sở dữ liệu (20) và quản trị (10). Cách làm bằng tay:</p>
<ol>
<li><strong>Xếp nhu cầu từ lớn tới nhỏ.</strong></li>
<li>Với mỗi nhu cầu, tìm khối nhỏ nhất chứa đủ <em>số máy + 2</em>: 300 + 2 → 512 = /23; 100 + 2 → 128 = /25; 20 + 2 → 32 = /27; 10 + 2 → 16 = /28.</li>
<li><strong>Đặt mỗi khối ở địa chỉ trống kế tiếp là bội số của chính cỡ khối đó</strong> (một /25 phải bắt đầu ở .0 hoặc .128 — gọi là căn lề, alignment).</li>
<li>Ghi mạng, host đầu, host cuối, broadcast; kiểm không chồng lấn và tất cả nằm trong khối.</li>
</ol>
<p>Kiểu chia này gọi là <strong>VLSM</strong> (variable-length subnet mask — mặt nạ độ dài thay đổi): nhiều subnet khác cỡ trong một khối. Rồi kiểm bằng công cụ thứ hai, <code>chia.py</code>:</p>
${run('c21-chia', 'python3 chia.py 10.20.0.0/22 iot', 1)}
<p>Vì sao phải lớn trước? Đây là cùng kế hoạch đó theo thứ tự ai đó gõ vào:</p>
${run('c21-chia', 'python3 chia.py --as-given', 1)}
<p>Vẫn vừa — nhưng khối /23 phải nhảy tới <code>10.20.2.0</code> cho đúng căn lề, để lại một lỗ hổng 336 địa chỉ ở giữa, và giờ khối đã đầy: nhóm tiếp theo xin một /24 sẽ không còn gì. Còn khi khối đơn giản là quá nhỏ, hãy nói ra trước khi ai đó cấu hình router:</p>
${run('c21-chia', 'python3 chia.py 10.20.0.0/24', 1)}
${net('subnet', 'vlsm', 'vi', 'Cấp địa chỉ cho văn phòng LabFlow: đổi số máy, chuyển giữa "lớn trước" và "theo thứ tự gõ", và xem lỗ hổng xuất hiện.', { tour: 'subnet-vlsm' })}

<h3>Docker cũng tự chọn subnet — và có thể đụng hàng</h3>
<p>Mỗi mạng Docker là một subnet. Khi bạn không chỉ định, Docker lấy một dải trống từ các kho mặc định của nó (172.17.0.0/16 cho bridge mặc định, rồi tới các khối 172.x và 192.168.x khác):</p>
${run('c21-docker', 'docker network inspect bridge', 2)}
<div class="pitfall co-tieu-de">
<p><strong>"Từ khi bật Docker, mình không vào được mạng trường/công ty."</strong> Nếu văn phòng, VPN hay Wi-Fi của trường cũng dùng, ví dụ, <code>172.18.0.0/16</code> và Docker tạo một mạng trong dải đó, máy bạn giờ có hai tuyến cho cùng một dải địa chỉ — và bridge Docker cục bộ thắng, nên gói tới máy chủ văn phòng thật đi vào một mạng container rồi biến mất. Sửa một lần trong <code>/etc/docker/daemon.json</code> bằng <code>"default-address-pools"</code> (một dải bạn biết chắc không ai dùng, vd <code>{"base": "10.200.0.0/16", "size": 24}</code>), hoặc ghi rõ <code>subnet</code> cho mạng trong compose như lab của ta.</p>
</div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Địa chỉ và mặt nạ của từng card mạng, cùng <strong>bảng định tuyến</strong> dựng từ chúng, là các bảng của nhân trong RAM (<code>ip addr</code>, <code>ip route</code> đọc chúng). Mặt nạ được mã của nhân áp lên từng gói gửi đi, chạy trên lõi CPU.</li>
<li>DHCP là một chương trình nhỏ (bên khách trên thiết bị, bên chủ trên router) ghi các thiết lập đó vào nhân.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-10-1-cau-truc-dia-chi-ipv4', so: '10.1', ten: 'Cấu trúc, các loại địa chỉ IPv4 và phân đoạn mạng', giong: 'phần mạng và phần host, mặt nạ, phép AND, unicast/broadcast/multicast, dải riêng', khac: 'NWC204 làm ví dụ trên giấy và trong Packet Tracer', them: 'mặt nạ đo như một quyết định của nhân (ip route get), lỗi sai mặt nạ bắt bằng tcpdump, /31 và /32, các dải đặc biệt lập trình viên hay gặp, và kho địa chỉ của Docker' })}
${cauNoi('vi', { ...NWC, bai: 'nwc204-10-2-chia-subnet-va-vlsm', so: '10.2', ten: 'Chia subnet, VLSM và thiết kế có cấu trúc', giong: 'mượn bit host, cỡ khối, VLSM lớn trước', khac: 'NWC204 thiết kế cho một sơ đồ Cisco', them: 'kế hoạch cho văn phòng LabFlow được một script kiểm, lỗ hổng do căn lề hiện ra rõ, và một kế hoạch không vừa' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một bạn thực tập ở LabFlow nói: "Máy ảo <code>10.10.1.50</code> của em ra Internet được, nhưng không tới được API ở <code>10.10.2.20</code>. Tụi em đã thay dây rồi." Thiết lập của máy ảo ghi mặt nạ <code>255.255.0.0</code>, cổng mặc định <code>10.10.1.254</code>. Trưởng nhóm còn nhờ bạn lên kế hoạch địa chỉ cho văn phòng thứ hai.</p>
<ol>
<li>Làm tay (giấy trước!): tìm mạng và broadcast của <code>10.10.1.50/16</code> và của <code>10.10.1.50/24</code>. <code>10.10.2.20</code> có nằm trong từng mạng không? Rồi kiểm bằng <code>python3 cidr.py</code> trong <code>nfd-client</code> (<code>cd /lab/k/code/ch02</code>).</li>
<li>Dựng lại lỗi trên <code>nfd-client2</code> bằng các lệnh trong khung bẫy (địa chỉ 10.10.1.11/16). Chạy <code>ip route get 10.10.2.20</code> và một lượt bắt gói: bạn thấy câu hỏi ARP nào?</li>
<li>Sửa bằng /24 và chứng minh API trả lời (<code>curl -s http://10.10.2.20:3000/api/hello</code>). Trả lab về như cũ: <code>docker compose -f moi-truong/compose.yml -p nfd up -d --force-recreate client2</code> (chạy trong thư mục <code>lab/</code>).</li>
<li>Lên kế hoạch cho khối <code>10.40.0.0/23</code>: Wi-Fi nhân viên 200, camera 40, máy chủ 25, máy in 5. Làm tay trước, rồi kiểm bằng <code>python3 chia.py</code>. Còn dư bao nhiêu địa chỉ?</li>
</ol>
<p><strong>Đạt khi:</strong> hai phép tính của bạn khớp với công cụ, bạn chỉ ra được các dòng <code>who-has 10.10.2.20</code> và giải thích trong một câu vì sao máy "ra Internet được mà không tới API", và kế hoạch không chồng lấn.</p>
<details><summary>Lời giải</summary>
<p>1) <code>10.10.1.50/16</code> → mạng 10.10.0.0, broadcast 10.10.255.255 — 10.10.2.20 nằm trong, nên máy ảo tưởng API ở cùng LAN. <code>/24</code> → mạng 10.10.1.0, broadcast 10.10.1.255 — 10.10.2.20 nằm ngoài, nên đi qua cổng mặc định. 2) <code>ip route get 10.10.2.20</code> ra <code>dev eth0</code> mà không có <code>via</code>; bản bắt gói lặp lại <code>who-has 10.10.2.20 tell 10.10.1.11</code> và không có trả lời. 3) Với /24 tuyến ghi <code>via 10.10.1.254</code> và curl có trả lời. Câu giải thích: "Mặt nạ là /16, nên máy ảo tin mọi địa chỉ 10.10.x.x đều ở chung dây với nó; nó hỏi ARP cho API thay vì gửi cho router. Internet vẫn chạy vì các địa chỉ đó nằm ngoài 10.10.0.0/16 nên vẫn đi qua cổng mặc định." 4) Xếp lớn trước: Wi-Fi 200 → /24 <code>10.40.0.0/24</code>; camera 40 → /26 <code>10.40.1.0/26</code>; máy chủ 25 → /27 <code>10.40.1.64/27</code>; máy in 5 → /29 <code>10.40.1.96/29</code>. Dùng 256 + 64 + 32 + 8 = 360 trên 512; trống kế tiếp là 10.40.1.104 — còn 152 địa chỉ.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['IPv4 address (địa chỉ IPv4)', 'Số 32 bit viết thành bốn byte thập phân, vd 10.10.1.10.'],
    ['network part / host part (phần mạng / phần host)', 'Các bit đầu đặt tên mạng (tên đường), phần còn lại đặt tên máy trên mạng đó (số nhà).'],
    ['subnet mask (mặt nạ mạng)', '32 bit: số 1 ở phần mạng, số 0 ở phần host, vd 255.255.255.0.'],
    ['prefix length, CIDR (/24)', 'Số bit mạng; 10.10.1.0/24 là ký hiệu CIDR.'],
    ['broadcast address (địa chỉ broadcast)', 'Địa chỉ mạng với mọi bit host là 1 — “mọi máy trong mạng này”.'],
    ['default gateway (cổng mặc định)', 'Router mà máy gửi tới khi đích không cùng mạng với nó.'],
    ['VLSM', 'Nhiều subnet khác cỡ trong một khối; cấp từ lớn tới nhỏ, đúng căn lề.'],
    ['DHCP', 'Cấp địa chỉ, mặt nạ, cổng mặc định và máy chủ DNS khi thiết bị vào mạng.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Địa chỉ IPv4 là 32 bit; mặt nạ (hay /prefix) chia nó thành phần mạng và phần host.</li>
<li>Mạng = địa chỉ AND mặt nạ; broadcast = bit host toàn 1; số host dùng được = 2<sup>32−p</sup> − 2 (/31 = 2, /32 = 1).</li>
<li>Mọi gói tin bắt đầu bằng một quyết định: cùng mạng ⇒ tự giao; khác mạng ⇒ cổng mặc định. Mặt nạ sai làm hỏng đúng quyết định đó.</li>
<li>Nhớ các dải đặc biệt: 127/8, dải riêng RFC 1918, 100.64/10 của CGNAT, 169.254/16 "DHCP hỏng", 0.0.0.0/0 "tất cả".</li>
<li>Chia VLSM lớn trước, đúng căn lề; kiểm bằng công cụ; để ý kho địa chỉ mặc định của Docker so với mạng thật của bạn.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4632', '📄', 'RFC 4632 — Định tuyến liên miền không theo lớp (CIDR)', 'Prefix, gộp tuyến, và vì sao bỏ các lớp địa chỉ.', 'Mở')}
${L('https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml', '📄', 'IANA — Sổ đăng ký địa chỉ IPv4 dùng cho mục đích đặc biệt', 'Danh sách chính thức các dải dành riêng.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc3021', '📄', 'RFC 3021 — Dùng prefix 31 bit trên đường điểm-điểm', 'Vì sao một /31 có hai địa chỉ dùng được.', 'Mở')}
${L('https://www.nro.net/ipv4-free-pool-depleted/', '📰', 'NRO — Kho địa chỉ IPv4 tự do đã cạn (3/2/2011)', 'Ngày kho IPv4 trung tâm hết sạch.', 'Mở')}
${L('https://docs.docker.com/engine/network/', '🐳', 'Tài liệu Docker — Tổng quan mạng', 'Kho địa chỉ mặc định và cách đổi.', 'Mở')}
${L('https://docs.python.org/3/library/ipaddress.html', '🐍', 'Mô-đun ipaddress của Python', 'Thư viện mà cidr.py và chia.py tự đối chiếu.', 'Mở')}
</div>
`,
};
void src;
