/**
 * Chương 2 · Lab 2 — Con đường đi vào LabFlow (phần 2 của dự án xuyên khoá). Lab "Internet trong một hộp".
 * Lời giải dùng output thật: lab/out/lab2-*.out.txt (kịch bản lab/code/ch02/lab2/, chạy bằng chay-loi-giai.sh).
 */
import { run, card, kv, details, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-2.mjs';

const L = card;
const C = { drop: /^# |^Running as user/ };
const PHIEU = `# Lab 2 report — <your name>, <date>

## R1 Address plan for the LabFlow office (10.30.0.0/23)
| network | hosts needed | subnet | gateway (.1) | first host | last host | broadcast |
|---|---|---|---|---|---|---|

## R2 Path map (laptop IPv4 + IPv6, 4G phone)
| hop | address | owner (home / ISP / IX / DC) | AS |
|---|---|---|---|

## R3 What the server sees
| device | its own address | address the server sees | which NAT (or none) |
|---|---|---|---|

## R4 Demo for a client          — rule + proof; why not on 4G; what to do instead
## R5 Incident A                 — symptoms, the command that found it, the fix, proof
## R6 Incident B                 — symptoms, the BGP evidence, the fix, proof, RPKI sentence`;

export default {
  title: 'Lab 2 — The road into LabFlow: address plan, path map, NAT, and two incidents|||Lab 2 — Con đường đi vào LabFlow: kế hoạch địa chỉ, bản đồ đường đi, NAT và hai sự cố',
  slug: 'netdev-2-6-lab-duong-vao-labflow',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab chương 2 (phần 2 dự án xuyên khoá): lên kế hoạch địa chỉ VLSM cho văn phòng LabFlow, vẽ đường đi từ nhà và từ 4G tới cổng LabFlow kèm chủ sở hữu và AS từng chặng, giải thích máy chủ thấy địa chỉ nào và vì sao, mở cổng demo cho khách, rồi chẩn đoán hai sự cố bí ẩn (vòng lặp định tuyến, cướp tuyến BGP). Rubric 10 điểm, gợi ý theo bậc, lời giải bằng output thật.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lab 2 · Course project part 2</span>
<h2>Lab 2 — The road into LabFlow</h2>
<p class="lead">In Lab 1 you mapped what happens <em>inside</em> LabFlow. Now the team needs the outside: LabFlow is opening a small office and wants an address plan; support wants a map of how customers reach the server from home and from 4G, and what address the server will see for each; sales wants to show a client a build running on a laptop; and on-call wants a written diagnosis of two incidents that will be injected into the network while you work. Everything you need is in Chapter 2.</p>

<h3>What you get</h3>
<ul>
<li>The Internet in a box from lesson 2.2 (from the <code>lab/</code> folder): <code>docker compose -f moi-truong/internet.yml -p nfi up -d</code>, then wait ~15 s. Machines: <code>nfi-laptop</code>, <code>nfi-phone</code>, <code>nfi-homegw</code>, <code>nfi-mobile</code>, <code>nfi-isp</code>, <code>nfi-dc</code>, <code>nfi-rogue</code>, <code>nfi-server</code>, <code>nfi-ns</code>.</li>
<li>LabFlow's public edge: <code>http://labflow.test/</code> = <code>203.0.113.10</code> and <code>2001:db8:d::10</code>; it answers with the address and port it sees.</li>
<li>Two incident scripts you must <strong>not read before diagnosing</strong>: <code>lab/code/ch02/lab2/su-co-a.sh</code> (runs on <code>nfi-dc</code>) and <code>su-co-b.sh</code> (runs on <code>nfi-rogue</code>).</li>
<li>Tools in <code>/lab/k/code/ch02</code> on every machine: <code>cidr.py</code>, <code>chia.py</code>.</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 Address plan.</strong> The office gets <code>10.30.0.0/23</code> and needs: staff Wi-Fi 120 devices, servers 50, cameras 25, printers 6, VPN pool 60. Plan it by hand (largest first, aligned), gateway = first host of each subnet; verify with <code>chia.py</code>; state how many addresses remain.</li>
<li><strong>R2 Path map.</strong> Trace the path to LabFlow from the laptop (IPv4 and IPv6) and from the 4G phone. For every hop write the owner (home / ISP / IX / DC) and the AS number, using the ISP's BGP table as evidence.</li>
<li><strong>R3 What the server sees.</strong> For the laptop (IPv4 and IPv6), the phone at home and the 4G phone: the device's own address, the address the server reports, and which NAT (if any) did the translation. Prove one row with a conntrack line.</li>
<li><strong>R4 Demo for a client.</strong> Run a web server on the laptop (port 8080) and make it reachable from <code>nfi-server</code> through port <strong>8443</strong> of the home router's public address. Prove it. Explain why the same is impossible for the 4G phone, and what you would use instead.</li>
<li><strong>R5 Incident A.</strong> Run <code>docker exec nfi-dc bash /lab/k/code/ch02/lab2/su-co-a.sh</code>. Customers report "LabFlow is down". Collect the symptoms from the laptop, find the cause with routing tools only, fix it, prove it.</li>
<li><strong>R6 Incident B.</strong> Run <code>docker exec nfi-rogue bash /lab/k/code/ch02/lab2/su-co-b.sh</code>. Same report. Diagnose with BGP evidence, fix it on the ISP, prove it, and add one sentence on what RPKI would have done.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<tr><th>Req.</th><th>Points</th><th>Full marks when…</th></tr>
<tr><td>R1</td><td>1.5</td><td>five correct, aligned, non-overlapping subnets with first/last/broadcast, matching <code>chia.py</code>; remaining addresses stated</td></tr>
<tr><td>R2</td><td>1.5</td><td>three traces; every hop has the right owner and AS, justified from <code>show ip bgp</code></td></tr>
<tr><td>R3</td><td>2</td><td>four rows correct; home NAT, carrier NAT and "no NAT on IPv6" named; one conntrack line explained (original vs reply)</td></tr>
<tr><td>R4</td><td>1.5</td><td>working DNAT rule + curl proof; CGNAT explained; an outbound-tunnel alternative named; the security risk mentioned</td></tr>
<tr><td>R5</td><td>1.5</td><td>symptoms incl. the DNS failure, the alternating hops, <code>ip route get</code> on the guilty router, the exact line removed, proof</td></tr>
<tr><td>R6</td><td>2</td><td>the /25 from AS64511 shown in BGP, longest prefix match explained, prefix-list fix + proof, correct RPKI status</td></tr>
</table>
<p class="nho">−1 for any claim without evidence (a command and its output). Report: Markdown, two pages at most.</p>

<h3>Hints by level</h3>
${details('Hint 1 — getting started (open after 10 minutes)', `<ul>
<li>R1: sort the needs, then hosts + 2 → power of two → prefix. A /23 is 512 addresses.</li>
<li>R2: <code>traceroute -n -q 1 -N 1 203.0.113.10</code>, <code>traceroute -6 -n …</code>; then <code>docker exec nfi-isp vtysh -c 'show ip bgp'</code>: the last number of the Path column is the owner.</li>
<li>R3: <code>curl -4 -s http://labflow.test/</code> and <code>curl -6 …</code> on each device; then <code>docker exec nfi-homegw conntrack -L -p tcp --dport 80</code>.</li>
<li>R4: <code>cd /tmp && echo demo &gt; index.html && python3 -m http.server 8080 &amp;</code> on the laptop; the rule goes on the home router (PREROUTING, DNAT).</li>
</ul>`)}
${details('Hint 2 — the right questions (open after 20 minutes)', `<ul>
<li>R5: does traceroute repeat two addresses? Which router sends the packet back? Compare <code>ip route get 203.0.113.10</code> and <code>ip route get 203.0.113.100</code> on that router. Why does DNS also fail?</li>
<li>R6: is there a prefix in the ISP's table that you did not expect? Who is its origin AS? Which line wins for 203.0.113.10 and why? What prefixes does AS64511 really own?</li>
<li>RPKI: LabFlow's ROA would say "203.0.113.0/24, origin AS64510". Compare with the bad announcement.</li>
</ul>`)}

<h3>Going further</h3>
<ul>
<li>Break IPv6 silently on the ISP (<code>ip6tables -I FORWARD -d 2001:db8:d::/48 -j DROP</code>) and measure the Happy Eyeballs penalty on <code>time_connect</code> for curl and Node; then make an app on <code>nfi-server</code> listen on <code>::</code> and show its logs contain <code>::ffff:</code> addresses.</li>
<li>Code Lab, lab module: write the functions behind this report — a VLSM planner, a longest-prefix-match lookup, a NAT translator and an RPKI validator — and run them on this lab's real data.</li>
<li>Course project: add an "outside" panel to your Lab 1 request-path map — home NAT → ISP → IX → DC → nginx → API — with the address the request carries on each segment.</li>
</ul>

${details('✅ Solution (open only after you have written your report)', `
<p><strong>R1</strong> — sorted 120, 60, 50, 25, 6:</p>
${run('lab2-r1', 'python3 ../chia.py', 2, C)}
<p>Wi-Fi <code>10.30.0.0/25</code> (gateway .1), VPN <code>10.30.0.128/26</code>, servers <code>10.30.0.192/26</code>, cameras <code>10.30.1.0/27</code>, printers <code>10.30.1.32/29</code>. 296 of 512 used; 216 left from 10.30.1.40. The <code>cidr.py</code> line confirms that 10.30.0.200 is a server address (in 10.30.0.192/26).</p>
<p><strong>R2</strong> — laptop and 4G phone:</p>
${run('lab2-r2-laptop', 'traceroute -n', 2, C)}
${run('lab2-r2-mobile', 'traceroute', 1, C)}
${run('lab2-r2-isp', 'vtysh', 1, C)}
<p>Laptop: 192.168.50.1 home router (home, no AS) → 198.51.100.1 ISP (AS64500) → 192.0.2.3 DC router at the IX (AS64510) → 203.0.113.10 LabFlow (AS64510, origin of 203.0.113.0/24). IPv6 follows the same routers. The 4G phone has one hop less: its first router is the ISP itself (100.64.0.1, AS64500).</p>
<p><strong>R3</strong>:</p>
${run('lab2-r3-laptop', 'curl -4', 2, C)}
${run('lab2-r3-phone', 'curl -4', 1, C)}
${run('lab2-r3-mobile', 'curl -4', 1, C)}
${run('lab2-r3-homegw', 'conntrack', 1, C)}
<table>
<tr><th>device</th><th>own address</th><th>server sees</th><th>translation</th></tr>
<tr><td>laptop, IPv4</td><td>192.168.50.10</td><td>198.51.100.2</td><td>home router NAT (masquerade)</td></tr>
<tr><td>laptop, IPv6</td><td>2001:db8:a:50::10</td><td>2001:db8:a:50::10</td><td>none — IPv6 has no NAT</td></tr>
<tr><td>phone at home</td><td>192.168.50.11</td><td>198.51.100.2</td><td>the same home router NAT — same public address</td></tr>
<tr><td>4G phone</td><td>100.64.0.10</td><td>198.51.100.200</td><td>the ISP's carrier-grade NAT</td></tr>
</table>
<p>Each conntrack line: first half = original (192.168.50.x → 203.0.113.10:80), second half = the reply the router expects (203.0.113.10:80 → 198.51.100.2), which it translates back.</p>
<p><strong>R4</strong>:</p>
${run('lab2-r4-homegw', 'iptables -t nat -A', 2, C)}
${run('lab2-r4-server', 'curl', 2, C)}
<p>The 4G phone's public address belongs to the ISP's NAT, shared with other customers; you cannot add a forwarding rule there, so the ISP's box refuses. Use an outbound tunnel (Cloudflare Tunnel, ngrok, SSH reverse tunnel) or IPv6. Remove the forwarding rule after the demo: the dev server is exposed to every scanner while it exists.</p>
<p><strong>R5</strong> — symptoms:</p>
${run('lab2-r5-laptop', 'curl -sS', 4, C)}
<p>DNS fails (resolving timed out), traceroute to .10 alternates 198.51.100.1 and 192.0.2.3 — a loop; .100 is not affected (it gets <code>!H</code>, simply no such host). On the DC router:</p>
${run('lab2-r5-dc', 'ip route get 203.0.113.10', 5, C)}
${run('lab2-r5-ok', 'curl', 1, C)}
<p>Cause: a forgotten <code>203.0.113.0/26 via 192.0.2.1</code> on the DC router. By longest prefix match it beats the connected /24 for .0–.63 — the server (.10) <em>and</em> the name server (.53), which is why DNS failed too — and sends them back to the ISP, which sends them back to the DC.</p>
<p><strong>R6</strong> — symptoms and evidence:</p>
${run('lab2-r6-laptop', 'curl -4 -sS', 4, C)}
${run('lab2-r6-isp', "vtysh -c 'show ip bgp' |", 5, C)}
${run('lab2-r6-ok', 'curl', 1, C)}
<p>IPv4 to .10 times out and the path vanishes after the ISP, DNS gets no answer — yet the IPv6 address works. The ISP's table holds <code>203.0.113.0/25</code> from AS64511, more specific than LabFlow's /24, so it wins for .0–.127 (server and name server). Filtering AS64511 to its own 198.18.0.0/24 removes it. RPKI: with a ROA "203.0.113.0/24, origin AS64510, max /24", the announcement would be <em>invalid</em> (wrong origin and too long) and validating networks would drop it.</p>
`)}

<h3>🗂 Key terms</h3>
${kv([
    ['address plan (kế hoạch địa chỉ)', 'The list of subnets, gateways and ranges for a site, decided before configuring anything.'],
    ['path map (bản đồ đường đi)', 'Every hop of a request with its owner and AS — the first thing to draw in an outage.'],
    ['port forwarding / DNAT', 'Incoming rule on a NAT router that sends a public port to an inside machine.'],
    ['CGNAT', 'The ISP’s NAT; customers cannot forward ports on it.'],
    ['routing loop', 'Two routers sending packets back and forth until TTL expires; alternating hops.'],
    ['BGP hijack', 'Another AS announces your prefix (often more specific) and attracts your traffic.'],
    ['RPKI invalid', 'An announcement that contradicts the owner’s ROA (wrong origin or too long).'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>Plan addresses before configuring: largest first, aligned, checked by a tool.</li>
<li>Draw the path map with owners and AS numbers — it tells you whose problem an outage is.</li>
<li>Know what the server sees: one public IP per house (NAT), per many customers (CGNAT), or the real device (IPv6).</li>
<li>Incidents outside your code look like "the site is down" and "DNS fails": loops and hijacks are found with <code>traceroute</code>, <code>ip route get</code> and <code>show ip bgp</code>.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4632', '📄', 'RFC 4632 — CIDR', 'For R1.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc6598', '📄', 'RFC 6598 — Shared Address Space', 'For R3–R4 (CGNAT).', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc6811', '📄', 'RFC 6811 — BGP Prefix Origin Validation', 'For R6 (RPKI).', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Lab 2 · Dự án xuyên khoá phần 2</span>
<h2>Lab 2 — Con đường đi vào LabFlow</h2>
<p class="lead">Ở Lab 1 bạn vẽ bản đồ những gì diễn ra <em>bên trong</em> LabFlow. Giờ nhóm cần phần bên ngoài: LabFlow mở một văn phòng nhỏ và cần kế hoạch địa chỉ; đội hỗ trợ cần bản đồ khách hàng đi tới máy chủ từ nhà và từ 4G ra sao, và máy chủ sẽ thấy địa chỉ nào cho từng người; đội kinh doanh muốn cho khách xem một bản dựng đang chạy trên laptop; và người trực sự cố cần bản chẩn đoán bằng văn bản cho hai sự cố sẽ được cài vào mạng trong lúc bạn làm. Mọi thứ cần dùng đều có trong Chương 2.</p>

<h3>Bạn có gì</h3>
<ul>
<li>Internet trong một hộp của bài 2.2 (từ thư mục <code>lab/</code>): <code>docker compose -f moi-truong/internet.yml -p nfi up -d</code>, rồi chờ ~15 giây. Các máy: <code>nfi-laptop</code>, <code>nfi-phone</code>, <code>nfi-homegw</code>, <code>nfi-mobile</code>, <code>nfi-isp</code>, <code>nfi-dc</code>, <code>nfi-rogue</code>, <code>nfi-server</code>, <code>nfi-ns</code>.</li>
<li>Cổng công cộng của LabFlow: <code>http://labflow.test/</code> = <code>203.0.113.10</code> và <code>2001:db8:d::10</code>; nó trả lời bằng địa chỉ và cổng nó thấy.</li>
<li>Hai script gây sự cố mà bạn <strong>không được đọc trước khi chẩn đoán</strong>: <code>lab/code/ch02/lab2/su-co-a.sh</code> (chạy trên <code>nfi-dc</code>) và <code>su-co-b.sh</code> (chạy trên <code>nfi-rogue</code>).</li>
<li>Công cụ trong <code>/lab/k/code/ch02</code> trên mọi máy: <code>cidr.py</code>, <code>chia.py</code>.</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 Kế hoạch địa chỉ.</strong> Văn phòng nhận <code>10.30.0.0/23</code> và cần: Wi-Fi nhân viên 120 thiết bị, máy chủ 50, camera 25, máy in 6, dải VPN 60. Lên kế hoạch bằng tay (lớn trước, đúng căn lề), cổng mặc định = host đầu của mỗi subnet; kiểm bằng <code>chia.py</code>; ghi rõ còn dư bao nhiêu địa chỉ.</li>
<li><strong>R2 Bản đồ đường đi.</strong> Truy vết đường tới LabFlow từ laptop (IPv4 và IPv6) và từ điện thoại 4G. Với mỗi chặng ghi chủ sở hữu (nhà / nhà mạng / IX / DC) và số AS, dùng bảng BGP của nhà mạng làm bằng chứng.</li>
<li><strong>R3 Máy chủ thấy gì.</strong> Với laptop (IPv4 và IPv6), điện thoại ở nhà và điện thoại 4G: địa chỉ của chính thiết bị, địa chỉ máy chủ báo lại, và NAT nào (nếu có) đã biên dịch. Chứng minh một dòng bằng một dòng conntrack.</li>
<li><strong>R4 Demo cho khách.</strong> Chạy một máy chủ web trên laptop (cổng 8080) và làm cho <code>nfi-server</code> tới được nó qua cổng <strong>8443</strong> của địa chỉ công cộng router nhà. Chứng minh. Giải thích vì sao điều tương tự không thể làm với điện thoại 4G, và bạn sẽ dùng gì thay thế.</li>
<li><strong>R5 Sự cố A.</strong> Chạy <code>docker exec nfi-dc bash /lab/k/code/ch02/lab2/su-co-a.sh</code>. Khách hàng báo "LabFlow sập". Thu thập triệu chứng từ laptop, tìm nguyên nhân chỉ bằng công cụ định tuyến, sửa, chứng minh.</li>
<li><strong>R6 Sự cố B.</strong> Chạy <code>docker exec nfi-rogue bash /lab/k/code/ch02/lab2/su-co-b.sh</code>. Cùng lời báo đó. Chẩn đoán bằng bằng chứng BGP, sửa trên nhà mạng, chứng minh, và thêm một câu về việc RPKI lẽ ra đã làm gì.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<tr><th>Yêu cầu</th><th>Điểm</th><th>Trọn điểm khi…</th></tr>
<tr><td>R1</td><td>1,5</td><td>năm subnet đúng, đúng căn lề, không chồng lấn, có host đầu/cuối/broadcast, khớp <code>chia.py</code>; ghi rõ số địa chỉ còn dư</td></tr>
<tr><td>R2</td><td>1,5</td><td>ba lượt truy vết; chặng nào cũng đúng chủ và AS, có lý lẽ từ <code>show ip bgp</code></td></tr>
<tr><td>R3</td><td>2</td><td>bốn dòng đúng; gọi tên được NAT nhà, NAT nhà mạng và "IPv6 không NAT"; giải thích một dòng conntrack (gốc và trả lời)</td></tr>
<tr><td>R4</td><td>1,5</td><td>luật DNAT chạy được + bằng chứng curl; giải thích CGNAT; nêu được giải pháp đường hầm đi ra; nhắc tới rủi ro bảo mật</td></tr>
<tr><td>R5</td><td>1,5</td><td>triệu chứng kể cả DNS hỏng, các chặng xen kẽ, <code>ip route get</code> trên router có lỗi, đúng dòng đã gỡ, bằng chứng</td></tr>
<tr><td>R6</td><td>2</td><td>chỉ ra /25 từ AS64511 trong BGP, giải thích khớp tiền tố dài nhất, sửa bằng prefix-list + bằng chứng, trạng thái RPKI đúng</td></tr>
</table>
<p class="nho">−1 cho mỗi khẳng định không có bằng chứng (một lệnh và output của nó). Báo cáo: Markdown, tối đa hai trang.</p>

<h3>Gợi ý theo bậc</h3>
${details('Gợi ý 1 — bắt đầu (mở sau 10 phút)', `<ul>
<li>R1: xếp nhu cầu, rồi số máy + 2 → luỹ thừa của hai → prefix. Một /23 là 512 địa chỉ.</li>
<li>R2: <code>traceroute -n -q 1 -N 1 203.0.113.10</code>, <code>traceroute -6 -n …</code>; rồi <code>docker exec nfi-isp vtysh -c 'show ip bgp'</code>: số cuối của cột Path là chủ sở hữu.</li>
<li>R3: <code>curl -4 -s http://labflow.test/</code> và <code>curl -6 …</code> trên từng thiết bị; rồi <code>docker exec nfi-homegw conntrack -L -p tcp --dport 80</code>.</li>
<li>R4: <code>cd /tmp && echo demo &gt; index.html && python3 -m http.server 8080 &amp;</code> trên laptop; luật đặt trên router nhà (PREROUTING, DNAT).</li>
</ul>`)}
${details('Gợi ý 2 — đặt đúng câu hỏi (mở sau 20 phút)', `<ul>
<li>R5: traceroute có lặp hai địa chỉ không? Router nào gửi gói ngược lại? So sánh <code>ip route get 203.0.113.10</code> và <code>ip route get 203.0.113.100</code> trên router đó. Vì sao DNS cũng hỏng?</li>
<li>R6: trong bảng của nhà mạng có prefix nào bạn không chờ đợi không? AS gốc của nó là ai? Dòng nào thắng cho 203.0.113.10 và vì sao? AS64511 thật sự sở hữu những prefix nào?</li>
<li>RPKI: ROA của LabFlow sẽ ghi "203.0.113.0/24, AS gốc AS64510". So với lời quảng bá xấu.</li>
</ul>`)}

<h3>Thử thách thêm</h3>
<ul>
<li>Làm hỏng IPv6 lặng lẽ trên nhà mạng (<code>ip6tables -I FORWARD -d 2001:db8:d::/48 -j DROP</code>) và đo khoản trễ Happy Eyeballs trên <code>time_connect</code> của curl và Node; rồi cho một app trên <code>nfi-server</code> nghe trên <code>::</code> và chỉ ra log của nó có địa chỉ <code>::ffff:</code>.</li>
<li>Code Lab, module lab: viết các hàm đứng sau báo cáo này — bộ chia VLSM, phép tra khớp tiền tố dài nhất, bộ biên dịch NAT và bộ kiểm RPKI — rồi chạy chúng trên dữ liệu thật của lab này.</li>
<li>Dự án của khoá: thêm một khung "bên ngoài" vào bản đồ đường đi request của Lab 1 — NAT nhà → nhà mạng → IX → DC → nginx → API — ghi địa chỉ mà request mang trên từng đoạn.</li>
</ul>

${details('✅ Lời giải (chỉ mở sau khi đã viết xong báo cáo)', `
<p><strong>R1</strong> — xếp 120, 60, 50, 25, 6:</p>
${run('lab2-r1', 'python3 ../chia.py', 2, C)}
<p>Wi-Fi <code>10.30.0.0/25</code> (cổng .1), VPN <code>10.30.0.128/26</code>, máy chủ <code>10.30.0.192/26</code>, camera <code>10.30.1.0/27</code>, máy in <code>10.30.1.32/29</code>. Dùng 296 trên 512; còn 216 tính từ 10.30.1.40. Dòng <code>cidr.py</code> xác nhận 10.30.0.200 là một địa chỉ máy chủ (thuộc 10.30.0.192/26).</p>
<p><strong>R2</strong> — laptop và điện thoại 4G:</p>
${run('lab2-r2-laptop', 'traceroute -n', 2, C)}
${run('lab2-r2-mobile', 'traceroute', 1, C)}
${run('lab2-r2-isp', 'vtysh', 1, C)}
<p>Laptop: 192.168.50.1 router nhà (nhà, không có AS) → 198.51.100.1 nhà mạng (AS64500) → 192.0.2.3 router DC ở IX (AS64510) → 203.0.113.10 LabFlow (AS64510, AS gốc của 203.0.113.0/24). IPv6 đi qua đúng các router đó. Điện thoại 4G ít hơn một chặng: router đầu tiên của nó chính là nhà mạng (100.64.0.1, AS64500).</p>
<p><strong>R3</strong>:</p>
${run('lab2-r3-laptop', 'curl -4', 2, C)}
${run('lab2-r3-phone', 'curl -4', 1, C)}
${run('lab2-r3-mobile', 'curl -4', 1, C)}
${run('lab2-r3-homegw', 'conntrack', 1, C)}
<table>
<tr><th>thiết bị</th><th>địa chỉ của nó</th><th>máy chủ thấy</th><th>biên dịch</th></tr>
<tr><td>laptop, IPv4</td><td>192.168.50.10</td><td>198.51.100.2</td><td>NAT của router nhà (masquerade)</td></tr>
<tr><td>laptop, IPv6</td><td>2001:db8:a:50::10</td><td>2001:db8:a:50::10</td><td>không — IPv6 không có NAT</td></tr>
<tr><td>điện thoại ở nhà</td><td>192.168.50.11</td><td>198.51.100.2</td><td>cùng NAT của router nhà — cùng địa chỉ công cộng</td></tr>
<tr><td>điện thoại 4G</td><td>100.64.0.10</td><td>198.51.100.200</td><td>NAT cấp nhà mạng (CGNAT)</td></tr>
</table>
<p>Mỗi dòng conntrack: nửa đầu = chiều gốc (192.168.50.x → 203.0.113.10:80), nửa sau = câu trả lời router chờ đợi (203.0.113.10:80 → 198.51.100.2), thứ nó sẽ biên dịch ngược lại.</p>
<p><strong>R4</strong>:</p>
${run('lab2-r4-homegw', 'iptables -t nat -A', 2, C)}
${run('lab2-r4-server', 'curl', 2, C)}
<p>Địa chỉ công cộng của điện thoại 4G thuộc NAT của nhà mạng, dùng chung với khách khác; bạn không thể thêm luật mở cổng ở đó, nên hộp của nhà mạng từ chối. Dùng một đường hầm đi ra (Cloudflare Tunnel, ngrok, đường hầm SSH ngược) hoặc IPv6. Gỡ luật mở cổng sau buổi demo: còn luật là máy chủ dev còn lộ trước mọi máy quét.</p>
<p><strong>R5</strong> — triệu chứng:</p>
${run('lab2-r5-laptop', 'curl -sS', 4, C)}
<p>DNS hỏng (resolving timed out), traceroute tới .10 xen kẽ 198.51.100.1 và 192.0.2.3 — một vòng lặp; .100 không bị ảnh hưởng (nó nhận <code>!H</code>, đơn giản là không có máy đó). Trên router DC:</p>
${run('lab2-r5-dc', 'ip route get 203.0.113.10', 5, C)}
${run('lab2-r5-ok', 'curl', 1, C)}
<p>Nguyên nhân: một tuyến <code>203.0.113.0/26 via 192.0.2.1</code> bị quên trên router DC. Theo khớp tiền tố dài nhất, nó thắng /24 nối trực tiếp cho .0–.63 — máy chủ (.10) <em>và</em> máy chủ tên (.53), vì thế DNS cũng hỏng — và gửi chúng ngược về nhà mạng, nhà mạng lại gửi về DC.</p>
<p><strong>R6</strong> — triệu chứng và bằng chứng:</p>
${run('lab2-r6-laptop', 'curl -4 -sS', 4, C)}
${run('lab2-r6-isp', "vtysh -c 'show ip bgp' |", 5, C)}
${run('lab2-r6-ok', 'curl', 1, C)}
<p>IPv4 tới .10 hết giờ và đường đi biến mất sau nhà mạng, DNS không trả lời — vậy mà địa chỉ IPv6 vẫn chạy. Bảng của nhà mạng có <code>203.0.113.0/25</code> từ AS64511, cụ thể hơn /24 của LabFlow, nên nó thắng cho .0–.127 (máy chủ và máy chủ tên). Lọc AS64511 về đúng 198.18.0.0/24 của nó là xoá được. RPKI: với ROA "203.0.113.0/24, AS gốc AS64510, tối đa /24", lời quảng bá đó sẽ là <em>invalid</em> (sai AS gốc và quá dài) và các mạng có kiểm tra sẽ bỏ nó.</p>
`)}

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['address plan (kế hoạch địa chỉ)', 'Danh sách subnet, cổng mặc định và dải địa chỉ của một nơi, quyết định trước khi cấu hình bất cứ gì.'],
    ['path map (bản đồ đường đi)', 'Mọi chặng của một request kèm chủ sở hữu và AS — thứ đầu tiên cần vẽ khi có sự cố.'],
    ['port forwarding / DNAT (mở cổng)', 'Luật đi vào trên router NAT, gửi một cổng công cộng tới một máy bên trong.'],
    ['CGNAT (NAT nhà mạng)', 'NAT của nhà mạng; khách hàng không mở cổng trên đó được.'],
    ['routing loop (vòng lặp định tuyến)', 'Hai router đẩy gói qua lại tới khi hết TTL; các chặng lặp xen kẽ.'],
    ['BGP hijack (cướp tuyến)', 'Một AS khác quảng bá prefix của bạn (thường cụ thể hơn) và hút lưu lượng của bạn.'],
    ['RPKI invalid', 'Lời quảng bá trái với ROA của chủ dải (sai AS gốc hoặc quá dài).'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lên kế hoạch địa chỉ trước khi cấu hình: lớn trước, đúng căn lề, kiểm bằng công cụ.</li>
<li>Vẽ bản đồ đường đi kèm chủ sở hữu và số AS — nó cho biết sự cố là việc của ai.</li>
<li>Biết máy chủ thấy gì: một IP công cộng cho cả nhà (NAT), cho nhiều khách (CGNAT), hoặc đúng thiết bị (IPv6).</li>
<li>Sự cố nằm ngoài code trông như "trang sập" và "DNS hỏng": vòng lặp và cướp tuyến được tìm bằng <code>traceroute</code>, <code>ip route get</code> và <code>show ip bgp</code>.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4632', '📄', 'RFC 4632 — CIDR', 'Cho R1.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc6598', '📄', 'RFC 6598 — Không gian địa chỉ dùng chung', 'Cho R3–R4 (CGNAT).', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc6811', '📄', 'RFC 6811 — Kiểm tra AS gốc của prefix BGP', 'Cho R6 (RPKI).', 'Mở')}
</div>
`,
};
