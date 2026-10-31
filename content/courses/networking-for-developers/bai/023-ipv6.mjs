/**
 * Chương 2 · 2.4 — IPv6 cho lập trình viên (slug khung netdev-2-4-ipv6).
 * Output thật: lab/out/c24-*.out.txt (lab "Internet trong một hộp", dual-stack). c24-happy là phép ĐO được giữ (giu_do).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-02-4.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };
const C = { drop: /^# |^reading from file/ };

export default {
  title: '2.4 — IPv6 for developers|||2.4 — IPv6 cho lập trình viên',
  slug: 'netdev-2-4-ipv6',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Địa chỉ 128 bit và luật viết gọn; /64 cho mỗi mạng; địa chỉ link-local và Neighbor Discovery thay ARP; không có NAT — máy chủ thấy đúng địa chỉ thật; dual-stack và Happy Eyeballs đo thật (curl 0,21 s, Node 324 ms, không có thì treo); bẫy localhost = ::1 của Node; app chỉ nghe 0.0.0.0 và địa chỉ ::ffff:.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>IPv6 for developers</h2>
<p class="lead">IPv4 ran out (lesson 2.1) and NAT made it last (lesson 2.3). IPv6 is the real fix: so many addresses that every device can have its own public one. You do not need to become an IPv6 network engineer — but you do need to read an IPv6 address, know what changes without NAT, and recognise three bugs that hit developers every year: a site that is slow only for some users, <code>localhost</code> that suddenly refuses connections, and logs full of strange <code>::ffff:</code> addresses. All three are measured in the lab.</p>

<h3>128 bits, written in hex</h3>
<p>An IPv6 address is 128 bits — four times longer than IPv4. It is written as eight groups of four hex digits (16 bits each), separated by colons. Two rules make it shorter (RFC 5952 fixes the one correct way):</p>
<ol>
<li>Drop leading zeros in each group: <code>0db8</code> → <code>db8</code>, <code>0050</code> → <code>50</code>.</li>
<li>Replace <strong>one</strong> run of all-zero groups with <code>::</code> — the longest run; if two runs are equally long, the first one. Only once, otherwise you could not know how many zeros each <code>::</code> hides.</li>
</ol>
${run('c24-dia-chi', 'python3 -c "import ipaddress as i; a =', 3, C)}
<p>The second example is the classic trap: <code>2001:0db8:0000:0000:0001:0000:0000:0001</code> has two runs of two zero groups; the <code>::</code> goes to the first, giving <code>2001:db8::1:0:0:1</code>. And the size: one ordinary network, a <code>/64</code>, holds 2<sup>64</sup> addresses — about 18 billion billion. ISPs typically give a home a /56 or a /48 (that is, 256 or 65 536 such networks); in our lab the ISP owns <code>2001:db8:a::/48</code> and the home LAN is <code>2001:db8:a:50::/64</code>. (<code>2001:db8::/32</code> is reserved for documentation, like 203.0.113.0/24 in IPv4.)</p>
${net('ipv6', 'addr', 'en', 'Compress and expand IPv6 addresses step by step, then see how a link-local address is built from a MAC.', { tour: 'ipv6-compress' })}

<h3>One network card, several addresses</h3>
${run('c24-dia-chi', 'ip -br -6 addr show eth0', 2, C)}
<ul>
<li><code>2001:db8:a:50::10/64</code> — a <strong>global</strong> address: unique on the whole Internet, routed like a public IPv4 address.</li>
<li><code>fe80::c0ff:fea8:320a/64</code> — a <strong>link-local</strong> address: every IPv6 interface has one, valid only on its own link (like 169.254 in IPv4, but always present). This one is built from the MAC <code>02:00:c0:a8:32:0a</code>: split it in half, insert <code>ff:fe</code>, flip one bit of the first byte (02 → 00). Real laptops and phones usually use random addresses instead, so their address does not reveal the hardware and changes over time ("privacy" or temporary addresses, RFC 8981).</li>
</ul>
<p>The routing table works exactly like IPv4: a connected route for the /64 and a default route to the home router. Devices learn the prefix and the router from <strong>Router Advertisements</strong> and usually build their own address (SLAAC), or get one from DHCPv6.</p>

<h3>No ARP: Neighbor Discovery</h3>
<p>IPv6 does not use ARP. It asks the same question — "who has this address? tell me your MAC" — with ICMPv6 messages, the <strong>Neighbor Discovery Protocol</strong> (NDP). And it does not broadcast to everyone: the question goes to a <em>solicited-node multicast</em> address built from the last 24 bits of the target, so only the right machine (and a few unlucky ones) even look at it:</p>
${run('c24-ndp', 'tcpdump -n -t -r /tmp/n.pcap', 3, C)}
<p><code>ff02::1:ff00:11</code> = "the group of machines whose address ends in <code>00:11</code>". The answer, a <em>neighbor advertisement</em>, comes back directly, and the neighbour table — <code>ip -6 neigh</code>, the IPv6 twin of the ARP cache — has the same REACHABLE/STALE states you met in lesson 1.4.</p>

<h3>No NAT: the server sees the real device</h3>
<p>Here is the biggest practical change. The laptop calls LabFlow's server over IPv6, then over IPv4:</p>
${run('c24-dia-chi', 'curl -s "http://[2001', 2, C)}
<p>Over IPv6 the server sees <code>2001:db8:a:50::10</code> — the laptop itself. Over IPv4 it sees the home router's address. With IPv6 there is no address sharing, no port rewriting, no conntrack table on the way, and incoming connections can work (no CGNAT problem). Three consequences:</p>
<ul>
<li><strong>A firewall matters more.</strong> Home routers block unsolicited incoming IPv6 by default with a stateful firewall; servers need their own. "NAT protected me" no longer applies.</li>
<li><strong>Rate limits and bans by single address are weak.</strong> One user controls a whole /64 and can rotate through 2<sup>64</sup> addresses; limit per /64 (or /56) instead.</li>
<li><strong>Store addresses as text up to 45 characters</strong> (or a proper inet type) — not a 15-character IPv4 column.</li>
</ul>

<h3>Dual-stack: one name, two addresses</h3>
<p>Most of the Internet runs IPv4 and IPv6 side by side (<strong>dual-stack</strong>). A name has an A record (IPv4) and an AAAA record (IPv6), and the client picks:</p>
${run('c24-dual', 'dig +short labflow.test A', 3, C)}
${run('c24-dual', 'curl -sv', 2, C)}
<p>The system lists IPv6 first (the default address-selection rules of RFC 6724 prefer it when the machine has a global IPv6 address), and curl connected over IPv6. Fine — while IPv6 works.</p>

<h3>Happy Eyeballs: when IPv6 is broken for some users</h3>
<p>Now the common real-world failure: somewhere on the path IPv6 is broken <em>silently</em> — packets are dropped, no error comes back. We simulate it at the ISP:</p>
${run('c24-isp-hong', 'ip6tables -I FORWARD', 2, C)}
<p>A naive client would try the first address (IPv6), wait for the TCP connection to time out, and only then try IPv4. Modern clients race: start IPv6, and if it has not connected after a short delay, start IPv4 in parallel and keep whichever wins. This is <strong>Happy Eyeballs</strong> (RFC 8305). Measured:</p>
${run('c24-happy', 'curl -sv', 2, C)}
<p>curl tried <code>[2001:db8:d::10]</code>, then <code>203.0.113.10</code>, and connected over IPv4 after <strong>0.21 s</strong> — its Happy Eyeballs delay is 200 ms. Forced to IPv6 only, it hangs until our 5-second limit:</p>
${run('c24-happy', 'curl -6', 1, C)}
<p>Node.js (built-in <code>fetch</code>) does the same since version 20 — and without it, a request waits for the kernel to give up:</p>
${run('c24-happy', 'node -e', 2, C)}
${run('c24-mac-dinh', 'node -p', 3, C)}
<p>Node 22 fell back after <strong>324 ms</strong> (its attempt timeout is 250 ms). With Happy Eyeballs disabled it was still waiting when we aborted at 8 s; the kernel would keep retrying the SYN for about 127 s (computed: <code>tcp_syn_retries = 6</code> means 1 + 2 + 4 + 8 + 16 + 32 + 64 s). So "IPv6 is broken somewhere" shows up as <em>"the first request is a quarter of a second slower"</em> for modern clients — and as <em>"it hangs for two minutes"</em> for old libraries or hand-written socket code that connects to the first address only.</p>
${net('ipv6', 'happy', 'en', 'Break IPv6 on the path and watch the race: IPv6 attempt, 200–250 ms timer, IPv4 attempt — and what happens without Happy Eyeballs.', { tour: 'ipv6-happy' })}

<div class="pitfall co-tieu-de">
<p><strong>"localhost: connection refused" after upgrading Node.</strong> <code>localhost</code> has <em>two</em> addresses:</p>
${run('c24-localhost', 'getent ahosts localhost', 1, C)}
${run('c24-localhost', 'ss -tln', 1, C)}
${run('c24-localhost', "node -e \"require('dns')", 1, C)}
<p>The dev server listens only on <code>127.0.0.1</code>, but the system lists <code>::1</code> first. Since Node 17 the address order from the system is kept as-is (before, Node put IPv4 first), so a plain connection to <code>localhost</code> goes to <code>::1</code> — where nobody listens:</p>
${run('c24-localhost', 'curl -s http://localhost', 3, C)}
<p>curl and Node 22 recover by trying the next address; with the address auto-selection off — as in Node 17–19, and many other tools and libraries — you get <code>ECONNREFUSED ::1:5000</code>. This hit thousands of projects (database clients, test runners, proxies). Fixes: make the server listen on both (<code>::</code>, see below), or write <code>127.0.0.1</code> explicitly in the client's configuration.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>The app listens on 0.0.0.0 — IPv6 users are refused; and <code>::ffff:</code> in your logs.</strong> On the server we start two apps: one bound to <code>0.0.0.0</code> (IPv4 only), one with no host given (Node then binds <code>::</code>, both families):</p>
${run('c24-nghe', 'ss -tln', 1, C)}
${run('c24-goi-nghe', 'curl -s http://203.0.113.10:3000/', 4, C)}
<p>The IPv4-only app refuses IPv6 clients outright — invisible in testing if your own network is IPv4-only. The dual-stack app accepts both, but sees the IPv4 client as <code>::ffff:198.51.100.2</code>: an <strong>IPv4-mapped IPv6 address</strong>, the way a dual-stack socket represents an IPv4 peer. That string ends up in logs, allow-lists and rate limiters (Express's <code>req.ip</code> shows it too); compare addresses after stripping <code>::ffff:</code>, or use a library that normalises them.</p>
</div>
${net('ipv6', 'localhost', 'en', 'A dev server on 127.0.0.1, a client that resolves localhost: see when it connects and when it gets ECONNREFUSED ::1 — then the server-side view with ::ffff:.')}

<h3>Where this lives in the computer</h3>
<ul>
<li>The kernel keeps separate IPv6 tables (<code>ip -6 addr</code>, <code>ip -6 route</code>, <code>ip -6 neigh</code>) in RAM; NDP and Router Advertisements are ICMPv6 handled by the kernel.</li>
<li>Happy Eyeballs is <em>not</em> in the kernel: it lives in each program's networking library (libcurl, Node's <code>net</code>, browsers, Java/Go/Python libraries) — which is why one tool is fast and another hangs on the same machine.</li>
<li>Address order (<code>getent ahosts</code>) comes from the system resolver library (glibc on Linux) and its rules in <code>/etc/gai.conf</code>.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-11-1-cau-truc-dia-chi-ipv6', so: '11.1', ten: 'IPv6 address structure and types', giong: 'the 128-bit format, compression rules, global unicast vs link-local, EUI-64', khac: 'NWC204 configures IPv6 on Cisco routers', them: 'the compression trap checked by a library, NDP captured live, and the developer side: no NAT, dual-stack, Happy Eyeballs timings' })}
${cauNoi('en', { ...NWC, bai: 'nwc204-11-2-cau-hinh-va-chia-subnet-ipv6', so: '11.2', ten: 'Configuring IPv6, multicast and subnetting', giong: 'SLAAC/DHCPv6, solicited-node multicast, /48 → /64 subnetting', khac: 'NWC204 works in Packet Tracer', them: 'a dual-stack lab end to end, and the three IPv6 bugs developers meet (slow first request, localhost = ::1, ::ffff: in logs)' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> two tickets on the same day. Ticket A: "LabFlow is a bit slow to open for some customers, not for us." Ticket B: "After upgrading Node, the integration tests fail with <code>ECONNREFUSED ::1:5432</code>."</p>
<ol>
<li>Compress by hand, then check with Python: <code>2001:0db8:0000:0000:0000:ff00:0042:8329</code> and <code>fe80:0000:0000:0000:0000:0000:0000:0001</code>.</li>
<li>Ticket A: on <code>nfi-isp</code> block IPv6 to the DC as in the lesson. On <code>nfi-laptop</code> compare <code>curl -s -o /dev/null -w '%{remote_ip} %{time_connect}\n' http://labflow.test/</code> before and after. Explain the difference. Remove the rule.</li>
<li>Ticket B: reproduce it on the laptop with the 127.0.0.1:5000 server from the lesson and <code>node --no-network-family-autoselection</code>. Give two fixes — one on the server, one on the client.</li>
<li>On <code>nfi-server</code>, start an app that listens on 0.0.0.0:3000 and check it from the laptop over IPv6. Change it to listen on <code>::</code> and check again over IPv4 and IPv6. What address does the app log for the IPv4 client?</li>
</ol>
<p><strong>Done when:</strong> your compressions are correct, you can explain the ~0.2 s with Happy Eyeballs, you have a working fix for each ticket, and you can explain <code>::ffff:</code>.</p>
<details><summary>Solution</summary>
<p>1) <code>2001:db8::ff00:42:8329</code> (the run of three zero groups becomes ::); <code>fe80::1</code>. 2) Before: <code>2001:db8:d::10</code> in a fraction of a millisecond. After: <code>203.0.113.10</code> in about 0.21 s — curl tried IPv6, waited its 200 ms Happy Eyeballs delay, then raced IPv4. Customers with broken IPv6 somewhere on their path pay that delay on every new connection; clients without Happy Eyeballs would hang. Fix at the source (the broken IPv6 path), or make sure your server's AAAA record really works. 3) The client resolves <code>localhost</code> to ::1 first; the server listens only on 127.0.0.1. Server fix: listen on <code>::</code> (dual-stack) or on both addresses. Client fix: use <code>127.0.0.1</code> in the connection string (or Node 20+ where auto-selection is on by default). 4) <code>listen(3000, '0.0.0.0')</code> refuses <code>curl -6</code> ("Could not connect"); <code>listen(3000)</code> or <code>listen(3000, '::')</code> accepts both, and logs the IPv4 client as <code>::ffff:198.51.100.2</code> — an IPv4-mapped address; normalise it before comparing.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['IPv6 address', '128 bits, eight groups of hex; compress with leading-zero removal and one ::.'],
    ['/64', 'The size of one IPv6 network (LAN): 2^64 addresses.'],
    ['link-local (fe80::/10)', 'Address valid only on the local link; every IPv6 interface has one.'],
    ['NDP (Neighbor Discovery)', 'ICMPv6 replacement for ARP; also carries Router Advertisements.'],
    ['dual-stack', 'Running IPv4 and IPv6 side by side; names have A and AAAA records.'],
    ['Happy Eyeballs (RFC 8305)', 'Try IPv6 first, start IPv4 after a short delay, keep the first to connect.'],
    ['IPv4-mapped address (::ffff:a.b.c.d)', 'How a dual-stack socket shows an IPv4 client.'],
    ['::1', 'IPv6 loopback — the IPv6 “localhost”.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>IPv6 = 128 bits in hex; drop leading zeros and replace one (the longest, first) zero run with ::.</li>
<li>Each LAN is a /64; interfaces have a global and a link-local address; NDP replaces ARP.</li>
<li>No NAT: servers see the real device, incoming works — so firewalls matter, and limits should be per /64.</li>
<li>Dual-stack clients prefer IPv6; Happy Eyeballs hides broken IPv6 at the cost of ~0.2–0.3 s — without it, connections hang.</li>
<li>Bugs to recognise: localhost → ::1 refused (Node ≥ 17), apps bound to 0.0.0.0 refusing IPv6, ::ffff: in logs.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4291', '📄', 'RFC 4291 — IP Version 6 Addressing Architecture', 'Address types, link-local, interface identifiers.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc5952', '📄', 'RFC 5952 — A Recommendation for IPv6 Address Text Representation', 'The one correct way to compress an address.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8305', '📄', 'RFC 8305 — Happy Eyeballs Version 2', 'Racing IPv6 and IPv4 connections.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc4861', '📄', 'RFC 4861 — Neighbor Discovery for IPv6', 'Neighbor solicitation/advertisement, router advertisements.', 'Open')}
${L('https://nodejs.org/api/net.html', '🟢', 'Node.js — net (autoSelectFamily)', 'Happy Eyeballs in Node, on by default since v20.', 'Open')}
${L('https://nodejs.org/api/dns.html', '🟢', 'Node.js — dns.lookup (order / verbatim)', 'v17.0.0: addresses are no longer reordered IPv4-first.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>IPv6 cho lập trình viên</h2>
<p class="lead">IPv4 đã cạn (bài 2.1) và NAT giúp nó cầm cự (bài 2.3). IPv6 là cách sửa thật sự: nhiều địa chỉ tới mức thiết bị nào cũng có một địa chỉ công cộng của riêng nó. Bạn không cần trở thành kỹ sư mạng IPv6 — nhưng bạn cần đọc được một địa chỉ IPv6, biết điều gì thay đổi khi không còn NAT, và nhận ra ba lỗi năm nào cũng làm khổ lập trình viên: trang chỉ chậm với một số người dùng, <code>localhost</code> bỗng dưng từ chối kết nối, và log đầy những địa chỉ <code>::ffff:</code> lạ hoắc. Cả ba đều được đo trong lab.</p>

<h3>128 bit, viết bằng hex</h3>
<p>Địa chỉ IPv6 dài 128 bit — gấp bốn IPv4. Nó được viết thành tám nhóm bốn chữ số hex (mỗi nhóm 16 bit), ngăn bởi dấu hai chấm. Hai quy tắc giúp viết gọn (RFC 5952 quy định cách viết đúng duy nhất):</p>
<ol>
<li>Bỏ số 0 ở đầu mỗi nhóm: <code>0db8</code> → <code>db8</code>, <code>0050</code> → <code>50</code>.</li>
<li>Thay <strong>một</strong> dãy các nhóm toàn số 0 bằng <code>::</code> — dãy dài nhất; nếu hai dãy dài bằng nhau thì lấy dãy đầu. Chỉ một lần thôi, nếu không sẽ không biết mỗi <code>::</code> che bao nhiêu số 0.</li>
</ol>
${run('c24-dia-chi', 'python3 -c "import ipaddress as i; a =', 3, C)}
<p>Ví dụ thứ hai là cái bẫy kinh điển: <code>2001:0db8:0000:0000:0001:0000:0000:0001</code> có hai dãy, mỗi dãy hai nhóm số 0; <code>::</code> đi vào dãy đầu, thành <code>2001:db8::1:0:0:1</code>. Còn kích thước: một mạng bình thường, một <code>/64</code>, chứa 2<sup>64</sup> địa chỉ — khoảng 18 tỉ tỉ. Nhà mạng thường cấp cho một nhà một /56 hoặc một /48 (tức 256 hoặc 65 536 mạng như vậy); trong lab, nhà mạng sở hữu <code>2001:db8:a::/48</code> và mạng LAN của nhà là <code>2001:db8:a:50::/64</code>. (<code>2001:db8::/32</code> dành cho tài liệu, giống 203.0.113.0/24 của IPv4.)</p>
${net('ipv6', 'addr', 'vi', 'Viết gọn và viết đầy đủ địa chỉ IPv6 từng bước, rồi xem địa chỉ link-local được dựng từ MAC thế nào.', { tour: 'ipv6-compress' })}

<h3>Một card mạng, nhiều địa chỉ</h3>
${run('c24-dia-chi', 'ip -br -6 addr show eth0', 2, C)}
<ul>
<li><code>2001:db8:a:50::10/64</code> — địa chỉ <strong>toàn cầu (global)</strong>: duy nhất trên cả Internet, được định tuyến như một địa chỉ IPv4 công cộng.</li>
<li><code>fe80::c0ff:fea8:320a/64</code> — địa chỉ <strong>link-local</strong>: card IPv6 nào cũng có một cái, chỉ có giá trị trên đường truyền của nó (giống 169.254 của IPv4, nhưng lúc nào cũng có). Cái này dựng từ MAC <code>02:00:c0:a8:32:0a</code>: chẻ đôi, chèn <code>ff:fe</code> vào giữa, lật một bit của byte đầu (02 → 00). Laptop và điện thoại thật thường dùng địa chỉ ngẫu nhiên thay vào đó, để địa chỉ không để lộ phần cứng và đổi theo thời gian (địa chỉ "riêng tư" hay tạm thời, RFC 8981).</li>
</ul>
<p>Bảng định tuyến hoạt động y như IPv4: một tuyến nối trực tiếp cho /64 và một tuyến mặc định tới router nhà. Thiết bị biết prefix và router từ các <strong>Router Advertisement</strong> (thông báo của router) và thường tự dựng địa chỉ của mình (SLAAC), hoặc nhận địa chỉ từ DHCPv6.</p>

<h3>Không có ARP: Neighbor Discovery</h3>
<p>IPv6 không dùng ARP. Nó hỏi cùng câu hỏi — "ai có địa chỉ này? cho tôi MAC của bạn" — bằng các thông điệp ICMPv6, gọi là <strong>giao thức khám phá hàng xóm (Neighbor Discovery Protocol — NDP)</strong>. Và nó không phát cho tất cả: câu hỏi đi tới một địa chỉ <em>multicast solicited-node</em> dựng từ 24 bit cuối của địa chỉ cần tìm, nên chỉ đúng máy đó (và vài máy xui xẻo) mới phải nhìn tới nó:</p>
${run('c24-ndp', 'tcpdump -n -t -r /tmp/n.pcap', 3, C)}
<p><code>ff02::1:ff00:11</code> = "nhóm các máy có địa chỉ kết thúc bằng <code>00:11</code>". Câu trả lời, một <em>neighbor advertisement</em>, quay về thẳng, và bảng hàng xóm — <code>ip -6 neigh</code>, người anh em IPv6 của cache ARP — có cùng các trạng thái REACHABLE/STALE bạn đã gặp ở bài 1.4.</p>

<h3>Không có NAT: máy chủ thấy đúng thiết bị thật</h3>
<p>Đây là thay đổi thực tế lớn nhất. Laptop gọi máy chủ LabFlow qua IPv6, rồi qua IPv4:</p>
${run('c24-dia-chi', 'curl -s "http://[2001', 2, C)}
<p>Qua IPv6 máy chủ thấy <code>2001:db8:a:50::10</code> — chính laptop. Qua IPv4 nó thấy địa chỉ của router nhà. Với IPv6 không có chuyện dùng chung địa chỉ, không viết lại cổng, không có bảng conntrack trên đường, và kết nối đi vào có thể chạy (không còn vấn đề CGNAT). Ba hệ quả:</p>
<ul>
<li><strong>Tường lửa quan trọng hơn.</strong> Router gia đình mặc định chặn IPv6 đi vào mà không ai mời bằng một tường lửa có trạng thái; máy chủ cần tường lửa của riêng nó. Câu "NAT bảo vệ tôi rồi" không còn đúng.</li>
<li><strong>Giới hạn tần suất và cấm theo từng địa chỉ trở nên yếu.</strong> Một người dùng nắm cả một /64 và có thể xoay vòng qua 2<sup>64</sup> địa chỉ; hãy giới hạn theo /64 (hoặc /56).</li>
<li><strong>Lưu địa chỉ dạng chữ dài tới 45 ký tự</strong> (hoặc kiểu inet đúng nghĩa) — không phải một cột 15 ký tự cho IPv4.</li>
</ul>

<h3>Dual-stack: một tên, hai địa chỉ</h3>
<p>Phần lớn Internet chạy IPv4 và IPv6 song song (<strong>dual-stack</strong> — hai ngăn xếp). Một tên có bản ghi A (IPv4) và bản ghi AAAA (IPv6), và client chọn:</p>
${run('c24-dual', 'dig +short labflow.test A', 3, C)}
${run('c24-dual', 'curl -sv', 2, C)}
<p>Hệ thống liệt kê IPv6 trước (quy tắc chọn địa chỉ mặc định của RFC 6724 ưu tiên nó khi máy có địa chỉ IPv6 toàn cầu), và curl kết nối qua IPv6. Ổn — chừng nào IPv6 còn chạy.</p>

<h3>Happy Eyeballs: khi IPv6 hỏng với một số người dùng</h3>
<p>Giờ là kiểu hỏng hay gặp ngoài đời: ở đâu đó trên đường đi, IPv6 hỏng <em>lặng lẽ</em> — gói bị vứt, không có lỗi nào quay về. Ta giả lập ở nhà mạng:</p>
${run('c24-isp-hong', 'ip6tables -I FORWARD', 2, C)}
<p>Một client ngây thơ sẽ thử địa chỉ đầu tiên (IPv6), chờ kết nối TCP hết hạn, rồi mới thử IPv4. Client hiện đại thì chạy đua: bắt đầu IPv6, và nếu sau một khoảng ngắn vẫn chưa kết nối được, bắt đầu IPv4 song song và giữ bên nào thắng. Đó là <strong>Happy Eyeballs</strong> (RFC 8305). Đo thật:</p>
${run('c24-happy', 'curl -sv', 2, C)}
<p>curl thử <code>[2001:db8:d::10]</code>, rồi <code>203.0.113.10</code>, và kết nối qua IPv4 sau <strong>0,21 giây</strong> — khoảng chờ Happy Eyeballs của nó là 200 ms. Ép chỉ dùng IPv6 thì nó treo tới giới hạn 5 giây của ta:</p>
${run('c24-happy', 'curl -6', 1, C)}
<p>Node.js (<code>fetch</code> có sẵn) làm điều tương tự từ phiên bản 20 — còn nếu không có, một request phải chờ tới khi nhân bỏ cuộc:</p>
${run('c24-happy', 'node -e', 2, C)}
${run('c24-mac-dinh', 'node -p', 3, C)}
<p>Node 22 chuyển sang IPv4 sau <strong>324 ms</strong> (thời hạn mỗi lần thử của nó là 250 ms). Khi tắt Happy Eyeballs, nó vẫn đang chờ lúc ta huỷ ở giây thứ 8; nhân sẽ còn gửi lại SYN khoảng 127 giây (tính ra: <code>tcp_syn_retries = 6</code> nghĩa là 1 + 2 + 4 + 8 + 16 + 32 + 64 giây). Vậy "IPv6 hỏng ở đâu đó" hiện ra thành <em>"request đầu chậm hơn một phần tư giây"</em> với client hiện đại — và thành <em>"treo hai phút"</em> với thư viện cũ hay code socket tự viết chỉ kết nối tới địa chỉ đầu tiên.</p>
${net('ipv6', 'happy', 'vi', 'Làm hỏng IPv6 trên đường đi và xem cuộc đua: thử IPv6, đồng hồ 200–250 ms, thử IPv4 — và chuyện gì xảy ra khi không có Happy Eyeballs.', { tour: 'ipv6-happy' })}

<div class="pitfall co-tieu-de">
<p><strong>"localhost: connection refused" sau khi nâng cấp Node.</strong> <code>localhost</code> có <em>hai</em> địa chỉ:</p>
${run('c24-localhost', 'getent ahosts localhost', 1, C)}
${run('c24-localhost', 'ss -tln', 1, C)}
${run('c24-localhost', "node -e \"require('dns')", 1, C)}
<p>Máy chủ dev chỉ nghe trên <code>127.0.0.1</code>, nhưng hệ thống liệt kê <code>::1</code> trước. Từ Node 17, thứ tự địa chỉ của hệ thống được giữ nguyên (trước đó Node xếp IPv4 lên đầu), nên một kết nối thẳng tới <code>localhost</code> đi vào <code>::1</code> — nơi chẳng ai nghe:</p>
${run('c24-localhost', 'curl -s http://localhost', 3, C)}
<p>curl và Node 22 tự cứu bằng cách thử địa chỉ kế tiếp; khi tắt tự chọn địa chỉ — như ở Node 17–19, và ở nhiều công cụ, thư viện khác — bạn nhận <code>ECONNREFUSED ::1:5000</code>. Lỗi này đã đánh trúng hàng nghìn dự án (client cơ sở dữ liệu, công cụ chạy test, proxy). Cách sửa: cho máy chủ nghe cả hai (<code>::</code>, xem bên dưới), hoặc ghi rõ <code>127.0.0.1</code> trong cấu hình của client.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>App nghe trên 0.0.0.0 — người dùng IPv6 bị từ chối; và <code>::ffff:</code> trong log.</strong> Trên máy chủ ta chạy hai app: một gắn vào <code>0.0.0.0</code> (chỉ IPv4), một không ghi host (khi đó Node gắn vào <code>::</code>, cả hai loại):</p>
${run('c24-nghe', 'ss -tln', 1, C)}
${run('c24-goi-nghe', 'curl -s http://203.0.113.10:3000/', 4, C)}
<p>App chỉ-IPv4 từ chối thẳng client IPv6 — không thấy được khi test nếu mạng của chính bạn chỉ có IPv4. App dual-stack nhận cả hai, nhưng thấy client IPv4 là <code>::ffff:198.51.100.2</code>: một <strong>địa chỉ IPv6 ánh xạ từ IPv4 (IPv4-mapped)</strong>, cách một socket dual-stack biểu diễn một máy IPv4. Chuỗi đó rơi vào log, danh sách cho phép và bộ giới hạn tần suất (<code>req.ip</code> của Express cũng hiện như vậy); hãy so sánh địa chỉ sau khi bỏ <code>::ffff:</code>, hoặc dùng thư viện có chuẩn hoá địa chỉ.</p>
</div>
${net('ipv6', 'localhost', 'vi', 'Một máy chủ dev trên 127.0.0.1, một client phân giải localhost: xem lúc nào kết nối được và lúc nào nhận ECONNREFUSED ::1 — rồi góc nhìn phía máy chủ với ::ffff:.')}

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Nhân giữ các bảng IPv6 riêng (<code>ip -6 addr</code>, <code>ip -6 route</code>, <code>ip -6 neigh</code>) trong RAM; NDP và Router Advertisement là ICMPv6 do nhân xử lý.</li>
<li>Happy Eyeballs <em>không</em> nằm trong nhân: nó nằm trong thư viện mạng của từng chương trình (libcurl, mô-đun <code>net</code> của Node, trình duyệt, thư viện Java/Go/Python) — vì thế trên cùng một máy, công cụ này nhanh còn công cụ kia treo.</li>
<li>Thứ tự địa chỉ (<code>getent ahosts</code>) đến từ thư viện phân giải của hệ thống (glibc trên Linux) và các quy tắc trong <code>/etc/gai.conf</code>.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-11-1-cau-truc-dia-chi-ipv6', so: '11.1', ten: 'Cấu trúc và các loại địa chỉ IPv6', giong: 'định dạng 128 bit, luật viết gọn, global unicast và link-local, EUI-64', khac: 'NWC204 cấu hình IPv6 trên router Cisco', them: 'cái bẫy viết gọn được một thư viện kiểm, NDP bắt gói trực tiếp, và phía lập trình viên: không NAT, dual-stack, thời gian Happy Eyeballs đo thật' })}
${cauNoi('vi', { ...NWC, bai: 'nwc204-11-2-cau-hinh-va-chia-subnet-ipv6', so: '11.2', ten: 'Cấu hình IPv6, multicast và chia subnet', giong: 'SLAAC/DHCPv6, multicast solicited-node, chia /48 → /64', khac: 'NWC204 làm trong Packet Tracer', them: 'một lab dual-stack từ đầu tới cuối, và ba lỗi IPv6 lập trình viên hay gặp (request đầu chậm, localhost = ::1, ::ffff: trong log)' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> hai phiếu trong cùng một ngày. Phiếu A: "LabFlow mở hơi chậm với một số khách hàng, với tụi mình thì không." Phiếu B: "Sau khi nâng cấp Node, test tích hợp hỏng với <code>ECONNREFUSED ::1:5432</code>."</p>
<ol>
<li>Viết gọn bằng tay, rồi kiểm bằng Python: <code>2001:0db8:0000:0000:0000:ff00:0042:8329</code> và <code>fe80:0000:0000:0000:0000:0000:0000:0001</code>.</li>
<li>Phiếu A: trên <code>nfi-isp</code> chặn IPv6 tới DC như trong bài. Trên <code>nfi-laptop</code> so sánh <code>curl -s -o /dev/null -w '%{remote_ip} %{time_connect}\n' http://labflow.test/</code> trước và sau. Giải thích sự khác biệt. Gỡ luật.</li>
<li>Phiếu B: dựng lại lỗi trên laptop với máy chủ 127.0.0.1:5000 của bài và <code>node --no-network-family-autoselection</code>. Đưa ra hai cách sửa — một ở máy chủ, một ở client.</li>
<li>Trên <code>nfi-server</code>, chạy một app nghe 0.0.0.0:3000 và kiểm từ laptop qua IPv6. Đổi sang nghe <code>::</code> và kiểm lại qua IPv4 và IPv6. App ghi địa chỉ nào cho client IPv4?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn viết gọn đúng, giải thích được ~0,2 giây bằng Happy Eyeballs, có một cách sửa chạy được cho mỗi phiếu, và giải thích được <code>::ffff:</code>.</p>
<details><summary>Lời giải</summary>
<p>1) <code>2001:db8::ff00:42:8329</code> (dãy ba nhóm số 0 thành ::); <code>fe80::1</code>. 2) Trước: <code>2001:db8:d::10</code> trong chưa tới một mili giây. Sau: <code>203.0.113.10</code> trong khoảng 0,21 giây — curl thử IPv6, chờ 200 ms của Happy Eyeballs, rồi đua với IPv4. Khách hàng có IPv6 hỏng ở đâu đó trên đường phải trả khoản trễ đó cho mỗi kết nối mới; client không có Happy Eyeballs sẽ treo. Sửa tận gốc (đường IPv6 hỏng), hoặc bảo đảm bản ghi AAAA của máy chủ thật sự chạy. 3) Client phân giải <code>localhost</code> ra ::1 trước; máy chủ chỉ nghe 127.0.0.1. Sửa ở máy chủ: nghe trên <code>::</code> (dual-stack) hoặc trên cả hai địa chỉ. Sửa ở client: dùng <code>127.0.0.1</code> trong chuỗi kết nối (hoặc Node 20+ nơi tự chọn địa chỉ bật sẵn). 4) <code>listen(3000, '0.0.0.0')</code> từ chối <code>curl -6</code> ("Could not connect"); <code>listen(3000)</code> hay <code>listen(3000, '::')</code> nhận cả hai, và ghi client IPv4 là <code>::ffff:198.51.100.2</code> — một địa chỉ ánh xạ từ IPv4; hãy chuẩn hoá trước khi so sánh.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['IPv6 address (địa chỉ IPv6)', '128 bit, tám nhóm hex; viết gọn bằng bỏ số 0 đầu nhóm và một dấu ::.'],
    ['/64', 'Cỡ của một mạng IPv6 (LAN): 2^64 địa chỉ.'],
    ['link-local (fe80::/10)', 'Địa chỉ chỉ có giá trị trên đường truyền cục bộ; card IPv6 nào cũng có.'],
    ['NDP (Neighbor Discovery — khám phá hàng xóm)', 'Thay ARP bằng ICMPv6; còn mang cả Router Advertisement.'],
    ['dual-stack (hai ngăn xếp)', 'Chạy IPv4 và IPv6 song song; tên có bản ghi A và AAAA.'],
    ['Happy Eyeballs (RFC 8305)', 'Thử IPv6 trước, sau một khoảng ngắn bắt đầu IPv4, giữ bên kết nối trước.'],
    ['IPv4-mapped address (::ffff:a.b.c.d)', 'Cách một socket dual-stack hiện một client IPv4.'],
    ['::1', 'Loopback của IPv6 — “localhost” bản IPv6.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>IPv6 = 128 bit viết hex; bỏ số 0 đầu nhóm và thay một dãy số 0 (dài nhất, dãy đầu) bằng ::.</li>
<li>Mỗi LAN là một /64; card mạng có địa chỉ toàn cầu và địa chỉ link-local; NDP thay ARP.</li>
<li>Không NAT: máy chủ thấy thiết bị thật, kết nối đi vào chạy được — nên tường lửa quan trọng, và giới hạn nên theo /64.</li>
<li>Client dual-stack ưu tiên IPv6; Happy Eyeballs che IPv6 hỏng với giá ~0,2–0,3 giây — không có nó, kết nối treo.</li>
<li>Lỗi cần nhận ra: localhost → ::1 bị từ chối (Node ≥ 17), app gắn 0.0.0.0 từ chối IPv6, ::ffff: trong log.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4291', '📄', 'RFC 4291 — Kiến trúc địa chỉ IPv6', 'Các loại địa chỉ, link-local, định danh giao diện.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc5952', '📄', 'RFC 5952 — Khuyến nghị cách viết địa chỉ IPv6', 'Cách viết gọn đúng duy nhất.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8305', '📄', 'RFC 8305 — Happy Eyeballs phiên bản 2', 'Chạy đua kết nối IPv6 và IPv4.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc4861', '📄', 'RFC 4861 — Neighbor Discovery cho IPv6', 'Neighbor solicitation/advertisement, router advertisement.', 'Mở')}
${L('https://nodejs.org/api/net.html', '🟢', 'Node.js — net (autoSelectFamily)', 'Happy Eyeballs trong Node, bật mặc định từ v20.', 'Mở')}
${L('https://nodejs.org/api/dns.html', '🟢', 'Node.js — dns.lookup (order / verbatim)', 'v17.0.0: địa chỉ không còn bị xếp IPv4 lên đầu.', 'Mở')}
</div>
`,
};
