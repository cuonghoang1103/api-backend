/**
 * Chương 2 · 2.2 — Bảng định tuyến, gateway và traceroute (slug khung netdev-2-2-dinh-tuyen). Bài đầu dùng lab
 * "Internet trong một hộp" (lab/moi-truong/internet.yml, project nfi).
 * Output thật: lab/out/c22-*.out.txt.
 */
import { run, card, kv, cauNoi, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-02-2.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };
const C = { drop: /^# |^Running as user/ };

const TOPO = `  HOME 192.168.50.0/24          ISP  AS64500                 IX 192.0.2.0/24           DC  AS64510  203.0.113.0/24
  laptop .10 ─┐                                             ┌── dc .3 ── .1 ──┬─ server .10  (nginx = LabFlow edge)
  phone  .11 ─┴─ homegw .1 ═NAT═ .2 ──── .1 [isp] .1 ───────┤                 └─ ns .53      (DNS for labflow.test)
                          198.51.100.0/24                   └── rogue AS64511 .66  (used in lesson 2.5)
  mobile 100.64.0.10 ──── .1 [isp]  (4G phone behind the ISP's NAT)`;

export default {
  title: '2.2 — Routing tables, gateways and traceroute|||2.2 — Bảng định tuyến, gateway và traceroute',
  slug: 'netdev-2-2-dinh-tuyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab "Internet trong một hộp"; đọc bảng định tuyến từng cột; router nào cũng tra bảng; tuyến dài nhất thắng; TTL và ICMP Time exceeded; traceroute bắt gói thật; đọc "* * *" và mtr cho đúng; vòng lặp định tuyến do một tuyến tĩnh bị quên; traceroute trong Docker Desktop.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Routing tables, gateways and traceroute</h2>
<p class="lead">In lesson 2.1 the laptop decided "this destination is not on my network — give it to the gateway". What does the gateway do with it? And the next router after that? This lesson follows one packet from a home laptop to LabFlow's server across four routers, reads every routing table on the way, and learns the tool everyone uses to see the path — <code>traceroute</code> — including how to read the lines that are just stars, and how a single forgotten route sends packets in circles.</p>

<h3>A new lab: the Internet in a box</h3>
<p>To see real routing you need more than one router. The course lab now has a second setup, <code>internet.yml</code>, that builds a tiny Internet on your machine: a home network behind a Wi-Fi router, an ISP, an <em>exchange point</em> (IX) where networks meet, and a datacenter (DC) where LabFlow's public server lives. Routers between the ISP, the DC and a third network exchange routes with real BGP (lesson 2.5). All "public" addresses are ranges reserved for documentation, so nothing touches anybody's real network.</p>
<pre><code class="language-text">${TOPO}</code></pre>
<p>Start it from the <code>lab/</code> folder (the first build adds the router software FRR and a small DNS server to the lab image):</p>
${cmd('docker build -t net-lab-inet -f moi-truong/Dockerfile.inet moi-truong', 'docker compose -f moi-truong/internet.yml -p nfi up -d     # wait ~15 s for BGP', 'docker exec -it nfi-laptop bash                            # a shell on the home laptop')}

<h3>A routing table is a list of "network → where to send it"</h3>
<p>Here is the laptop at home:</p>
${run('c22-laptop', 'ip -br -4 addr show eth0', 2, C)}
<p>Read each line from left to right:</p>
<ul>
<li><code>default via 192.168.50.1 dev eth0</code> — the <strong>default route</strong> (= <code>0.0.0.0/0</code>, matches everything): "for anything I do not know, send it to 192.168.50.1 out of <code>eth0</code>". 192.168.50.1 is the home router — the <strong>next hop</strong>.</li>
<li><code>192.168.50.0/24 dev eth0 proto kernel scope link src 192.168.50.10</code> — the <strong>connected route</strong> made from the mask (lesson 2.1): no <code>via</code>, deliver directly. <code>src</code> is the address the laptop puts as source when it uses this route.</li>
</ul>
${run('c22-laptop', 'ip route get 192.168.50.11', 3, C)}
<p>The phone is on the LAN, so it is reached directly. LabFlow's server and Google's DNS are not, so both go to the home router — the laptop knows nothing about the Internet beyond "give it to 192.168.50.1". That is the key idea of IP routing: <strong>each machine only chooses the next hop</strong>; nobody plans the whole path.</p>

<h3>Every router does the same lookup</h3>
<p>A router is just a machine that forwards packets that are not for itself, using the same kind of table. The home router:</p>
${run('c22-routers', 'ip -br -4 addr show up', 3, C)}
<p>Two connected networks (the house <code>lan0</code> and the line to the ISP <code>wan0</code>) and one default route to the ISP. Now the ISP's router — it is different in an important way:</p>
${run('c22-isp', 'ip -br -4 addr show up', 2, C)}
<p>There is <strong>no default route</strong>. Big routers on the Internet do not "give it to someone else"; they must know every network, and routes marked <code>proto bgp</code> were learned automatically from neighbouring networks (lesson 2.5). Ask it for an address nobody has announced and the answer is final:</p>
${run('c22-isp', 'ip route get 203.0.113.10', 3, C)}
<p>The full journey of our packet is therefore: laptop → <em>default</em> → homegw → <em>default</em> → isp → <em>203.0.113.0/24 via 192.0.2.3</em> → dc → <em>connected</em> → server. Four routing decisions, each made locally.</p>

<h3>The longest match wins</h3>
<p>Often several lines match a destination: the default route always matches, and a network can be inside a bigger one. The rule every router uses is <strong>longest prefix match</strong>: among the matching lines, take the one with the <em>longest</em> prefix (the most specific). For 203.0.113.10 at the DC router: <code>0.0.0.0/0</code> would match, <code>203.0.113.0/24</code> matches better, and if someone adds <code>203.0.113.10/32</code>, that one wins over both — whatever it says. We will use that in a minute to break something.</p>
<table>
<tr><th>Lines in the table</th><th>Matches 203.0.113.10?</th><th>Prefix length</th></tr>
<tr><td><code>default</code> (0.0.0.0/0)</td><td>yes — always</td><td>0</td></tr>
<tr><td><code>203.0.113.0/24</code></td><td>yes</td><td>24</td></tr>
<tr><td><code>203.0.113.10</code> (/32)</td><td>yes</td><td><strong>32 ⇒ wins</strong></td></tr>
<tr><td><code>203.0.113.128/25</code></td><td>no (.10 is not in .128–.255)</td><td>—</td></tr>
</table>
${net('route', 'lookup', 'en', 'Pick a router and a destination: every matching line lights up, the longest one wins. Try 8.8.8.8 at the ISP.', { tour: 'route-lpm' })}

<h3>TTL: why a packet cannot live forever</h3>
<p>In lesson 1.4 we saw the IP header field <strong>TTL</strong> (time to live) drop from 64 to 63 at the router. Every router subtracts 1 before forwarding. When it reaches 0, the router <strong>throws the packet away</strong> and sends a small error back to the sender: an ICMP <strong>Time exceeded</strong> message (ICMP — Internet Control Message Protocol — is IP's built-in error and test protocol; <code>ping</code> also uses it). TTL exists so that a packet caught in a loop eventually dies instead of circling forever.</p>

<h3>traceroute: turning the TTL into a map</h3>
<p><code>traceroute</code> uses that rule on purpose. It sends a probe with TTL 1: the first router drops it and answers "Time exceeded" — now we know the first router's address and how long the answer took. Then TTL 2, TTL 3… until the destination itself answers.</p>
${run('c22-trace', 'traceroute -n 203.0.113.10', 1, C)}
<p>Four hops, as planned: home router, ISP, DC router, server. Three times per line = three probes per TTL (<code>-n</code> = show numbers, do not look up names). To see the trick itself, we ran it once more with one probe at a time (<code>-q 1 -N 1</code>) while capturing:</p>
${run('c22-trace', 'tshark', 1, C)}
<p>Read it in pairs. Probe with TTL 1 → <code>192.168.50.1</code> answers "Time-to-live exceeded". TTL 2 → <code>198.51.100.1</code>. TTL 3 → <code>192.0.2.3</code>. TTL 4 reaches the server, which answers "Port unreachable": Linux traceroute sends UDP to unusual ports (33434 and up) on purpose, so the destination rejects them and traceroute knows it has arrived. The third column of the answers — 64, 63, 62, 61 — is the TTL the replies arrived with: each reply also crossed one more router on its way back. (Windows <code>tracert</code> sends ICMP echo instead of UDP; <code>traceroute -I</code> and <code>-T</code> do the same on Linux — useful when a firewall drops UDP.)</p>
${net('route', 'trace', 'en', 'Send the probes one by one: TTL 1, 2, 3, 4 — watch who drops each one and who answers. Then make the DC router silent.', { tour: 'route-trace' })}

<div class="pitfall co-tieu-de">
<p><strong>"Hop 3 shows * * * — the problem is at hop 3!"</strong> Not necessarily. A router may simply not send Time exceeded messages (a firewall rule, or a limit on how many ICMP errors per second it generates — making ICMP is extra work for a router's CPU, separate from forwarding). We configure the DC router to stay silent, as many real routers do:</p>
${run('c22-dc-chan', 'iptables -A OUTPUT', 2, C)}
${run('c22-sao', 'traceroute -n -w 1', 3, C)}
<p>Hop 3 is all stars and <code>mtr</code> (traceroute that keeps running and counts) reports <strong>100 % loss</strong> at hop 3 — yet hop 4 has 0 % loss and the website answers. Packets go <em>through</em> hop 3 perfectly; it just does not talk about itself. The rule: <strong>loss at a hop only matters if it continues to every hop after it</strong>, up to the destination. (The occasional <code>*</code> on the last line comes from the same thing: Linux limits ICMP error messages to about one per second per destination by default.)</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>A forgotten route makes a loop.</strong> During maintenance, someone adds a "temporary" route on the DC router — and forgets it:</p>
${run('c22-dc-vong', 'ip route add', 3, C)}
<p>The /32 is longer than the connected /24, so it wins: packets for the server are sent <em>back</em> to the ISP. The ISP, following its BGP route, sends them to the DC again. From the laptop:</p>
${run('c22-vong', 'ping -c 2', 2, C)}
<p>The packet bounces between 192.0.2.3 and 198.51.100.1, losing 1 TTL each time, until a router drops it and reports "Time to live exceeded". Alternating addresses in traceroute are the signature of a <strong>routing loop</strong>. (The ISP answers from <code>198.51.100.1</code> — its interface facing the laptop — not from its IX address: a router replies from the address on the way back to you.) The fix is to find the router whose choice is wrong (<code>ip route get</code> on each one) and remove the line:</p>
${run('c22-dc-sua', 'ip route del', 2, C)}
</div>

<div class="pitfall co-tieu-de">
<p><strong>traceroute inside Docker Desktop shows one hop and then stars.</strong> Our "Internet in a box" is fine because all its routers are containers. But a container that goes out to the <em>real</em> Internet on Docker Desktop (Mac/Windows) leaves through Docker's own user-space network proxy, which does not pass the TTL trick through:</p>
${run('c22-docker-desktop', 'ip route', 2, C)}
<p>This is not packet loss on the Internet. Run traceroute on your own computer instead (<code>traceroute -n cuongthai.com</code> on macOS/Linux, <code>tracert -d cuongthai.com</code> on Windows) — you will see your home router first, then your ISP's routers.</p>
</div>

<h3>Where this lives in the computer</h3>
<ul>
<li>On a Linux machine the routing table is a kernel structure in RAM; the lookup (longest prefix match) runs on a CPU core for every packet. <code>ip route</code> reads it; programs such as FRR add the <code>proto bgp</code> lines through the kernel's netlink interface.</li>
<li>In a hardware router the same table is copied into special memory on the forwarding chips so lookups happen at line speed (the <em>data plane</em>); building the table, running BGP and generating ICMP errors is done by a small CPU (the <em>control plane</em>) — which is why ICMP is rate-limited and why <code>* * *</code> is so common.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-7-2-goi-ipv6-va-bang-dinh-tuyen', so: '7.2', ten: 'The IPv6 packet, how a host routes, and routing tables', giong: 'how a host chooses local delivery or the gateway, reading a routing table', khac: 'NWC204 reads Cisco show ip route output', them: 'the Linux table read column by column on four routers of a running lab, longest prefix match decided live, and a routing loop caused by a forgotten /32' })}
${cauNoi('en', { ...NWC, bai: 'nwc204-12-2-ping-traceroute-va-lab-2-3', so: '12.2', ten: 'Ping, traceroute and Lab 2.3', giong: 'traceroute uses TTL and ICMP Time exceeded', khac: 'NWC204 runs tracert in Packet Tracer', them: 'the probes and replies captured with tshark, reply TTLs, * * * at a silent router measured with mtr, and why Docker Desktop hides the real path' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a customer sends a screenshot: "traceroute to your site shows * * * at hop 3, your network is broken". Your lead asks you to answer with evidence — and later the same day the site really does stop working.</p>
<ol>
<li>Start the Internet in a box. From <code>nfi-laptop</code>, run <code>traceroute -n 203.0.113.10</code> and write the owner of each hop (home, ISP, DC, LabFlow).</li>
<li>On <code>nfi-dc</code>, add the silent-ICMP rule from the pitfall. From the laptop run <code>traceroute -n -w 1</code>, <code>mtr -n -r -c 10</code> and <code>curl -s http://203.0.113.10/</code>. Write two sentences for the customer.</li>
<li>Remove the rule. Now add on <code>nfi-dc</code>: <code>ip route add 203.0.113.0/26 via 192.0.2.1</code> (a different forgotten route). From the laptop: what do <code>ping</code> and <code>traceroute -n -m 8</code> show? Is <code>203.0.113.100</code> affected? Why?</li>
<li>Find the guilty router with <code>ip route get 203.0.113.10</code> on isp and dc, fix it, prove the site works.</li>
</ol>
<p><strong>Done when:</strong> you can explain why stars at hop 3 with 0 % loss at the end is not a fault, you recognise the alternating-hop pattern of a loop, and you explain with longest prefix match why .10 loops but .100 does not.</p>
<details><summary>Solution</summary>
<p>1) 192.168.50.1 = home router, 198.51.100.1 = ISP, 192.0.2.3 = DC router, 203.0.113.10 = LabFlow server. 2) Hop 3 shows stars and mtr 100 % at hop 3, but hop 4 is 0 % and curl returns the page. Answer: "Hop 3 is our datacenter router, which does not send traceroute replies. Traffic passes through it normally — the final hop has no loss and the site answers." 3) ping prints "Time to live exceeded"; traceroute alternates 192.0.2.3 and 198.51.100.1. 203.0.113.100 is outside 203.0.113.0/26 (.0–.63), so at dc the connected /24 is still the longest match for it and it is delivered directly (it does not exist, so you get "!H" — host unreachable — not a loop). The name server .53 is inside the /26, so DNS for labflow.test breaks too. 4) <code>ip route get 203.0.113.10</code> on dc says <code>via 192.0.2.1</code> — wrong; <code>ip route del 203.0.113.0/26 via 192.0.2.1</code>; curl works again.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['routing table (bảng định tuyến)', 'List of “network → next hop / interface” the kernel or router consults for every packet.'],
    ['next hop (chặng kế)', 'The router a packet is handed to; each machine only chooses this, never the whole path.'],
    ['default route (tuyến mặc định)', '0.0.0.0/0: matches everything not matched by a more specific line.'],
    ['longest prefix match', 'Among matching lines, the most specific (longest prefix) wins.'],
    ['TTL (time to live)', 'IP header counter, minus 1 at each router; at 0 the packet is dropped.'],
    ['ICMP Time exceeded', 'Error a router sends back when it drops a packet whose TTL reached 0.'],
    ['traceroute / mtr', 'Map the path by sending probes with TTL 1, 2, 3…; mtr repeats and counts loss.'],
    ['routing loop (vòng lặp định tuyến)', 'Routers send a packet back and forth until its TTL runs out; hops alternate.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>A routing table maps networks to next hops; the default route catches the rest. Each router decides only the next hop.</li>
<li>Internet core routers have no default route — they learn every network (BGP); unknown ⇒ "Network is unreachable".</li>
<li>Longest prefix match: the most specific matching line wins, so a forgotten /32 beats everything.</li>
<li>traceroute = TTL 1, 2, 3… and the "Time exceeded" replies; stars at one hop with no loss after it are not a fault.</li>
<li>Alternating hops and "Time to live exceeded" = a routing loop; find the router with the wrong line using <code>ip route get</code>.</li>
</ul>
${L('https://man7.org/linux/man-pages/man8/ip-route.8.html', '📄', 'man 8 ip-route', 'Every field of the Linux routing table.', 'Open')}
${L('https://man7.org/linux/man-pages/man8/traceroute.8.html', '📄', 'man 8 traceroute', 'Probe methods (UDP, -I ICMP, -T TCP), -q, -N, -w.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc792', '📄', 'RFC 792 — Internet Control Message Protocol', 'Time exceeded, destination unreachable, echo.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc1812', '📄', 'RFC 1812 — Requirements for IP Version 4 Routers', 'TTL handling, longest match, ICMP rate limiting.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Bảng định tuyến, gateway và traceroute</h2>
<p class="lead">Ở bài 2.1, laptop quyết định "đích này không cùng mạng với mình — đưa cho cổng mặc định". Cổng mặc định làm gì với gói đó? Rồi router kế tiếp thì sao? Bài này đi theo một gói tin từ laptop ở nhà tới máy chủ của LabFlow qua bốn router, đọc mọi bảng định tuyến trên đường, và học công cụ ai cũng dùng để nhìn đường đi — <code>traceroute</code> — kể cả cách đọc những dòng chỉ có dấu sao, và cách một tuyến bị quên khiến gói tin chạy vòng tròn.</p>

<h3>Phòng lab mới: Internet trong một hộp</h3>
<p>Muốn thấy định tuyến thật thì cần nhiều hơn một router. Lab của khoá giờ có cấu hình thứ hai, <code>internet.yml</code>, dựng một Internet tí hon ngay trên máy bạn: một mạng gia đình sau router Wi-Fi, một nhà mạng (ISP), một <em>điểm trao đổi</em> (IX — nơi các mạng gặp nhau), và một trung tâm dữ liệu (DC) nơi đặt máy chủ công cộng của LabFlow. Các router giữa ISP, DC và một mạng thứ ba trao đổi tuyến bằng BGP thật (bài 2.5). Mọi địa chỉ "công cộng" đều là dải dành cho tài liệu, nên không đụng tới mạng thật của ai.</p>
<pre><code class="language-text">${TOPO}</code></pre>
<p>Khởi động từ thư mục <code>lab/</code> (lần dựng đầu thêm phần mềm router FRR và một máy chủ DNS nhỏ vào ảnh lab):</p>
${cmd('docker build -t net-lab-inet -f moi-truong/Dockerfile.inet moi-truong', 'docker compose -f moi-truong/internet.yml -p nfi up -d     # chờ ~15 s cho BGP lên', 'docker exec -it nfi-laptop bash                            # vào shell của laptop ở nhà')}

<h3>Bảng định tuyến là danh sách "mạng → gửi đi đâu"</h3>
<p>Đây là laptop ở nhà:</p>
${run('c22-laptop', 'ip -br -4 addr show eth0', 2, C)}
<p>Đọc mỗi dòng từ trái sang phải:</p>
<ul>
<li><code>default via 192.168.50.1 dev eth0</code> — <strong>tuyến mặc định</strong> (= <code>0.0.0.0/0</code>, khớp mọi thứ): "cái gì tôi không biết thì gửi cho 192.168.50.1 qua <code>eth0</code>". 192.168.50.1 là router nhà — <strong>chặng kế (next hop)</strong>.</li>
<li><code>192.168.50.0/24 dev eth0 proto kernel scope link src 192.168.50.10</code> — <strong>tuyến nối trực tiếp</strong> dựng từ mặt nạ (bài 2.1): không có <code>via</code>, giao thẳng. <code>src</code> là địa chỉ laptop ghi làm nguồn khi dùng tuyến này.</li>
</ul>
${run('c22-laptop', 'ip route get 192.168.50.11', 3, C)}
<p>Điện thoại ở cùng LAN nên tới thẳng. Máy chủ LabFlow và DNS của Google thì không, nên cả hai đi tới router nhà — laptop chẳng biết gì về Internet ngoài "đưa cho 192.168.50.1". Đó là ý cốt lõi của định tuyến IP: <strong>mỗi máy chỉ chọn chặng kế</strong>; không ai lên kế hoạch cho cả đường đi.</p>

<h3>Router nào cũng tra cùng một kiểu bảng</h3>
<p>Router chỉ là một máy chuyển tiếp những gói không phải của mình, dùng đúng loại bảng đó. Router nhà:</p>
${run('c22-routers', 'ip -br -4 addr show up', 3, C)}
<p>Hai mạng nối trực tiếp (mạng trong nhà <code>lan0</code> và đường lên ISP <code>wan0</code>) và một tuyến mặc định tới ISP. Giờ là router của ISP — nó khác ở một điểm quan trọng:</p>
${run('c22-isp', 'ip -br -4 addr show up', 2, C)}
<p><strong>Không có tuyến mặc định.</strong> Các router lớn trên Internet không "đưa cho người khác"; chúng phải biết mọi mạng, và các tuyến ghi <code>proto bgp</code> được học tự động từ các mạng láng giềng (bài 2.5). Hỏi nó một địa chỉ chưa ai quảng bá thì câu trả lời là dứt khoát:</p>
${run('c22-isp', 'ip route get 203.0.113.10', 3, C)}
<p>Vậy cả hành trình của gói tin là: laptop → <em>default</em> → homegw → <em>default</em> → isp → <em>203.0.113.0/24 via 192.0.2.3</em> → dc → <em>nối trực tiếp</em> → server. Bốn quyết định định tuyến, mỗi cái được đưa ra tại chỗ.</p>

<h3>Tuyến dài nhất thắng</h3>
<p>Nhiều khi có vài dòng cùng khớp một đích: tuyến mặc định lúc nào cũng khớp, và một mạng có thể nằm trong một mạng lớn hơn. Quy tắc mọi router dùng là <strong>khớp tiền tố dài nhất (longest prefix match)</strong>: trong các dòng khớp, lấy dòng có prefix <em>dài nhất</em> (cụ thể nhất). Với 203.0.113.10 ở router DC: <code>0.0.0.0/0</code> có khớp, <code>203.0.113.0/24</code> khớp tốt hơn, và nếu ai đó thêm <code>203.0.113.10/32</code> thì dòng đó thắng cả hai — dù nó nói gì đi nữa. Lát nữa ta sẽ dùng chính điều đó để làm hỏng một thứ.</p>
<table>
<tr><th>Dòng trong bảng</th><th>Khớp 203.0.113.10?</th><th>Độ dài prefix</th></tr>
<tr><td><code>default</code> (0.0.0.0/0)</td><td>có — luôn luôn</td><td>0</td></tr>
<tr><td><code>203.0.113.0/24</code></td><td>có</td><td>24</td></tr>
<tr><td><code>203.0.113.10</code> (/32)</td><td>có</td><td><strong>32 ⇒ thắng</strong></td></tr>
<tr><td><code>203.0.113.128/25</code></td><td>không (.10 không thuộc .128–.255)</td><td>—</td></tr>
</table>
${net('route', 'lookup', 'vi', 'Chọn một router và một địa chỉ đích: mọi dòng khớp sáng lên, dòng dài nhất thắng. Thử 8.8.8.8 ở ISP.', { tour: 'route-lpm' })}

<h3>TTL: vì sao gói tin không sống mãi</h3>
<p>Ở bài 1.4 ta thấy trường <strong>TTL</strong> (time to live — thời gian sống) trong header IP giảm từ 64 xuống 63 ở router. Router nào cũng trừ 1 trước khi chuyển tiếp. Khi về 0, router <strong>vứt gói đi</strong> và gửi một lỗi nhỏ về cho người gửi: thông điệp ICMP <strong>Time exceeded</strong> (ICMP — Internet Control Message Protocol — là giao thức báo lỗi và kiểm tra có sẵn của IP; <code>ping</code> cũng dùng nó). TTL tồn tại để gói tin bị kẹt trong vòng lặp cuối cùng sẽ chết thay vì chạy vòng mãi mãi.</p>

<h3>traceroute: biến TTL thành bản đồ</h3>
<p><code>traceroute</code> cố tình dùng quy tắc đó. Nó gửi một gói thăm dò với TTL 1: router đầu tiên vứt gói và trả lời "Time exceeded" — giờ ta biết địa chỉ router đầu và câu trả lời mất bao lâu. Rồi TTL 2, TTL 3… cho tới khi chính đích trả lời.</p>
${run('c22-trace', 'traceroute -n 203.0.113.10', 1, C)}
<p>Bốn chặng, đúng như dự tính: router nhà, ISP, router DC, máy chủ. Ba con số mỗi dòng = ba gói thăm dò cho mỗi TTL (<code>-n</code> = hiện số, không tra tên). Muốn thấy chính mánh đó, ta chạy lại một lần nữa với mỗi lúc một gói (<code>-q 1 -N 1</code>) trong khi bắt gói:</p>
${run('c22-trace', 'tshark', 1, C)}
<p>Đọc theo từng cặp. Gói thăm dò TTL 1 → <code>192.168.50.1</code> trả lời "Time-to-live exceeded". TTL 2 → <code>198.51.100.1</code>. TTL 3 → <code>192.0.2.3</code>. TTL 4 tới được máy chủ, nó trả lời "Port unreachable": traceroute của Linux cố tình gửi UDP tới các cổng lạ (từ 33434 trở lên), nên đích từ chối và traceroute biết mình đã tới nơi. Cột thứ ba của các câu trả lời — 64, 63, 62, 61 — là TTL lúc câu trả lời tới: mỗi câu trả lời cũng đi qua thêm một router trên đường về. (<code>tracert</code> của Windows gửi ICMP echo thay vì UDP; <code>traceroute -I</code> và <code>-T</code> làm tương tự trên Linux — hữu ích khi tường lửa chặn UDP.)</p>
${net('route', 'trace', 'vi', 'Gửi từng gói thăm dò: TTL 1, 2, 3, 4 — xem ai vứt gói nào và ai trả lời. Rồi bắt router DC im lặng.', { tour: 'route-trace' })}

<div class="pitfall co-tieu-de">
<p><strong>"Chặng 3 hiện * * * — lỗi nằm ở chặng 3!"</strong> Chưa chắc. Một router có thể đơn giản là không gửi thông điệp Time exceeded (một luật tường lửa, hoặc giới hạn số lỗi ICMP mỗi giây — tạo ICMP là việc thêm cho CPU của router, tách khỏi việc chuyển tiếp). Ta cấu hình router DC im lặng, như nhiều router thật vẫn làm:</p>
${run('c22-dc-chan', 'iptables -A OUTPUT', 2, C)}
${run('c22-sao', 'traceroute -n -w 1', 3, C)}
<p>Chặng 3 toàn dấu sao và <code>mtr</code> (traceroute chạy liên tục và đếm) báo <strong>mất 100 %</strong> ở chặng 3 — vậy mà chặng 4 mất 0 % và trang web vẫn trả lời. Gói tin đi <em>xuyên qua</em> chặng 3 hoàn hảo; nó chỉ không nói gì về bản thân. Quy tắc: <strong>mất gói ở một chặng chỉ đáng lo nếu nó kéo dài tới mọi chặng sau</strong>, tới tận đích. (Thỉnh thoảng có <code>*</code> ở dòng cuối cũng vì lý do tương tự: mặc định Linux giới hạn thông điệp lỗi ICMP khoảng một cái mỗi giây cho mỗi đích.)</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Một tuyến bị quên tạo ra vòng lặp.</strong> Lúc bảo trì, ai đó thêm một tuyến "tạm thời" trên router DC — rồi quên gỡ:</p>
${run('c22-dc-vong', 'ip route add', 3, C)}
<p>/32 dài hơn /24 nối trực tiếp, nên nó thắng: gói tới máy chủ bị gửi <em>ngược</em> về ISP. ISP theo tuyến BGP của mình lại gửi chúng sang DC. Từ laptop:</p>
${run('c22-vong', 'ping -c 2', 2, C)}
<p>Gói tin nảy qua lại giữa 192.0.2.3 và 198.51.100.1, mỗi lần mất 1 TTL, cho tới khi một router vứt nó và báo "Time to live exceeded". Địa chỉ lặp xen kẽ trong traceroute là dấu hiệu nhận dạng một <strong>vòng lặp định tuyến (routing loop)</strong>. (ISP trả lời bằng <code>198.51.100.1</code> — card mạng hướng về laptop — chứ không bằng địa chỉ ở IX: router trả lời bằng địa chỉ nằm trên đường quay về phía bạn.) Cách sửa là tìm router chọn sai (<code>ip route get</code> trên từng router) và gỡ dòng đó:</p>
${run('c22-dc-sua', 'ip route del', 2, C)}
</div>

<div class="pitfall co-tieu-de">
<p><strong>traceroute trong Docker Desktop chỉ hiện một chặng rồi toàn dấu sao.</strong> "Internet trong một hộp" của ta không sao vì mọi router đều là container. Nhưng một container đi ra Internet <em>thật</em> trên Docker Desktop (Mac/Windows) sẽ đi qua bộ proxy mạng chạy ở không gian người dùng của Docker, thứ không chuyển tiếp mánh TTL:</p>
${run('c22-docker-desktop', 'ip route', 2, C)}
<p>Đây không phải mất gói trên Internet. Hãy chạy traceroute trên chính máy của bạn (<code>traceroute -n cuongthai.com</code> trên macOS/Linux, <code>tracert -d cuongthai.com</code> trên Windows) — bạn sẽ thấy router nhà mình trước, rồi các router của nhà mạng.</p>
</div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Trên máy Linux, bảng định tuyến là một cấu trúc của nhân trong RAM; phép tra (khớp tiền tố dài nhất) chạy trên lõi CPU cho mỗi gói. <code>ip route</code> đọc nó; các chương trình như FRR thêm những dòng <code>proto bgp</code> qua giao diện netlink của nhân.</li>
<li>Trong router phần cứng, bảng đó được chép vào bộ nhớ đặc biệt trên các chip chuyển tiếp để tra với tốc độ đường truyền (<em>data plane</em> — mặt phẳng dữ liệu); việc dựng bảng, chạy BGP và tạo lỗi ICMP do một CPU nhỏ làm (<em>control plane</em> — mặt phẳng điều khiển) — vì thế ICMP bị giới hạn tốc độ và <code>* * *</code> mới phổ biến đến vậy.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-7-2-goi-ipv6-va-bang-dinh-tuyen', so: '7.2', ten: 'Gói tin IPv6, máy trạm định tuyến ra sao, và bảng định tuyến', giong: 'máy trạm chọn giao tại chỗ hay gửi cổng mặc định, đọc một bảng định tuyến', khac: 'NWC204 đọc output show ip route của Cisco', them: 'bảng của Linux đọc từng cột trên bốn router của một lab đang chạy, khớp tiền tố dài nhất quyết định trực tiếp, và vòng lặp định tuyến do một /32 bị quên' })}
${cauNoi('vi', { ...NWC, bai: 'nwc204-12-2-ping-traceroute-va-lab-2-3', so: '12.2', ten: 'Ping, traceroute và Lab 2.3', giong: 'traceroute dùng TTL và ICMP Time exceeded', khac: 'NWC204 chạy tracert trong Packet Tracer', them: 'gói thăm dò và câu trả lời bắt bằng tshark, TTL của câu trả lời, * * * ở một router im lặng đo bằng mtr, và vì sao Docker Desktop che mất đường đi thật' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một khách hàng gửi ảnh chụp: "traceroute tới trang của anh chị hiện * * * ở chặng 3, mạng của anh chị hỏng rồi". Trưởng nhóm nhờ bạn trả lời bằng bằng chứng — và cuối ngày hôm đó trang web hỏng thật.</p>
<ol>
<li>Khởi động Internet trong một hộp. Từ <code>nfi-laptop</code>, chạy <code>traceroute -n 203.0.113.10</code> và ghi chủ của từng chặng (nhà, ISP, DC, LabFlow).</li>
<li>Trên <code>nfi-dc</code>, thêm luật im lặng ICMP trong khung bẫy. Từ laptop chạy <code>traceroute -n -w 1</code>, <code>mtr -n -r -c 10</code> và <code>curl -s http://203.0.113.10/</code>. Viết hai câu cho khách hàng.</li>
<li>Gỡ luật. Giờ thêm trên <code>nfi-dc</code>: <code>ip route add 203.0.113.0/26 via 192.0.2.1</code> (một tuyến bị quên khác). Từ laptop: <code>ping</code> và <code>traceroute -n -m 8</code> cho thấy gì? <code>203.0.113.100</code> có bị ảnh hưởng không? Vì sao?</li>
<li>Tìm router có lỗi bằng <code>ip route get 203.0.113.10</code> trên isp và dc, sửa, chứng minh trang chạy lại.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được vì sao dấu sao ở chặng 3 mà cuối đường mất 0 % thì không phải lỗi, bạn nhận ra kiểu chặng lặp xen kẽ của vòng lặp, và bạn giải thích bằng khớp tiền tố dài nhất vì sao .10 bị lặp còn .100 thì không.</p>
<details><summary>Lời giải</summary>
<p>1) 192.168.50.1 = router nhà, 198.51.100.1 = ISP, 192.0.2.3 = router DC, 203.0.113.10 = máy chủ LabFlow. 2) Chặng 3 toàn dấu sao và mtr báo 100 % ở chặng 3, nhưng chặng 4 là 0 % và curl trả về trang. Trả lời: "Chặng 3 là router trung tâm dữ liệu của chúng tôi, nó không gửi trả lời cho traceroute. Lưu lượng đi qua nó bình thường — chặng cuối không mất gói nào và trang vẫn trả lời." 3) ping in "Time to live exceeded"; traceroute xen kẽ 192.0.2.3 và 198.51.100.1. 203.0.113.100 nằm ngoài 203.0.113.0/26 (.0–.63), nên ở dc tuyến /24 nối trực tiếp vẫn là tuyến khớp dài nhất với nó và nó được giao thẳng (máy đó không tồn tại, nên bạn nhận "!H" — host unreachable — chứ không phải vòng lặp). Máy chủ tên .53 nằm trong /26, nên DNS của labflow.test cũng hỏng theo. 4) <code>ip route get 203.0.113.10</code> trên dc ghi <code>via 192.0.2.1</code> — sai; <code>ip route del 203.0.113.0/26 via 192.0.2.1</code>; curl chạy lại.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['routing table (bảng định tuyến)', 'Danh sách “mạng → chặng kế / card mạng” mà nhân hay router tra cho mỗi gói.'],
    ['next hop (chặng kế)', 'Router mà gói được trao cho; mỗi máy chỉ chọn cái này, không bao giờ chọn cả đường.'],
    ['default route (tuyến mặc định)', '0.0.0.0/0: khớp mọi thứ không khớp dòng nào cụ thể hơn.'],
    ['longest prefix match (khớp tiền tố dài nhất)', 'Trong các dòng khớp, dòng cụ thể nhất (prefix dài nhất) thắng.'],
    ['TTL (time to live — thời gian sống)', 'Bộ đếm trong header IP, mỗi router trừ 1; về 0 thì gói bị vứt.'],
    ['ICMP Time exceeded', 'Lỗi router gửi về khi nó vứt một gói có TTL đã về 0.'],
    ['traceroute / mtr', 'Vẽ đường đi bằng gói thăm dò TTL 1, 2, 3…; mtr chạy lặp và đếm mất gói.'],
    ['routing loop (vòng lặp định tuyến)', 'Các router đẩy gói qua lại cho tới khi hết TTL; các chặng lặp xen kẽ.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bảng định tuyến ánh xạ mạng tới chặng kế; tuyến mặc định bắt phần còn lại. Mỗi router chỉ quyết định chặng kế.</li>
<li>Router lõi Internet không có tuyến mặc định — chúng học mọi mạng (BGP); không biết ⇒ "Network is unreachable".</li>
<li>Khớp tiền tố dài nhất: dòng khớp cụ thể nhất thắng, nên một /32 bị quên thắng mọi thứ.</li>
<li>traceroute = TTL 1, 2, 3… và các câu trả lời "Time exceeded"; dấu sao ở một chặng mà các chặng sau không mất gói thì không phải lỗi.</li>
<li>Chặng xen kẽ và "Time to live exceeded" = vòng lặp định tuyến; tìm router có dòng sai bằng <code>ip route get</code>.</li>
</ul>
${L('https://man7.org/linux/man-pages/man8/ip-route.8.html', '📄', 'man 8 ip-route', 'Mọi trường trong bảng định tuyến của Linux.', 'Mở')}
${L('https://man7.org/linux/man-pages/man8/traceroute.8.html', '📄', 'man 8 traceroute', 'Các kiểu thăm dò (UDP, -I ICMP, -T TCP), -q, -N, -w.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc792', '📄', 'RFC 792 — Giao thức thông điệp điều khiển Internet (ICMP)', 'Time exceeded, destination unreachable, echo.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc1812', '📄', 'RFC 1812 — Yêu cầu đối với router IPv4', 'Xử lý TTL, khớp dài nhất, giới hạn tốc độ ICMP.', 'Mở')}
</div>
`,
};
