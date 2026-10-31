/**
 * Chương 2 · 2.3 — NAT, dải IP riêng và mạng Docker (slug khung netdev-2-3-nat).
 * Output thật: lab/out/c23-*.out.txt (lab "Internet trong một hộp" + container nginx tạm trên máy soạn).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-02-3.mjs';

const L = card;
const OSG = { mon: 'OSG202', khoa: 'operating-systems' };
const C = { drop: /^# |^reading from file/ };

export default {
  title: '2.3 — NAT, private ranges and Docker networks|||2.3 — NAT, dải IP riêng và mạng Docker',
  slug: 'netdev-2-3-nat',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dải riêng RFC 1918 và vì sao không ra Internet được; NAT ở router nhà bắt hai phía; bảng conntrack và thời gian sống của nó; hai máy cùng cổng nguồn; vì sao không ai gọi ngược vào được và cách mở cổng (DNAT); CGNAT của nhà mạng 4G; docker run -p chính là DNAT, cổng công bố vượt qua ufw.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>NAT, private ranges and Docker networks</h2>
<p class="lead">The laptop at home has the address <code>192.168.50.10</code> — and so do millions of other laptops in millions of other homes. Yet LabFlow's server can answer each of them. How? This lesson opens the home router and watches it rewrite addresses (NAT), reads the table that lets the answers find their way back, shows why nobody on the Internet can call <em>into</em> your laptop, what changes when your ISP adds its own NAT (4G, CGNAT), and why <code>docker run -p</code> is the very same trick inside your machine.</p>

<h3>Private ranges: addresses that are not on the Internet</h3>
<p>In 1996 RFC 1918 set aside three ranges that anyone may use inside their own network, without asking anybody: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code> and <code>192.168.0.0/16</code>. Every home router uses one; Docker, offices, schools and cloud networks too. Because everyone reuses them, they cannot mean one place on the Internet, so Internet routers simply have no route for them. From LabFlow's server, the laptop's private address is unreachable — the DC router answers <code>!N</code> (network unreachable):</p>
${run('c23-vao', 'nc -vz -w 3 192.168.50.10', 2, C)}
<p>So how does the laptop browse the web at all?</p>

<h3>NAT: the home router puts its own address on your packets</h3>
<p>The laptop calls LabFlow's server, which prints the address it sees:</p>
${run('c23-laptop', 'ip -br -4 addr show eth0', 2, C)}
<p>The server saw <code>198.51.100.2</code> — not the laptop's address but the home router's <em>public</em> address, the one the ISP gave it. That is <strong>NAT</strong> (Network Address Translation): the router rewrites the source address of outgoing packets to its own, and rewrites the destination of the answers back to the laptop. On a Linux router it is one rule:</p>
${run('c23-homegw', 'iptables -t nat -S POSTROUTING', 1, C)}
<p><code>-o wan0 -j MASQUERADE</code>: "for packets leaving through the Internet side, replace the source address with whatever address <code>wan0</code> has". (MASQUERADE is a kind of <strong>SNAT</strong> — source NAT — that follows the interface's address, handy when the ISP changes it. The <code>127.0.0.11</code> line is Docker's internal DNS, not ours.) We captured the same connection on both sides of the router — <code>lan0</code> (inside) and <code>wan0</code> (outside):</p>
${run('c23-homegw', 'tcpdump -n -t -q -r /tmp/lan.pcap', 2, C)}
<p>Same connections, same destination, same source <em>ports</em> — only the source address changed, from 192.168.50.x to 198.51.100.2. Except the third line: we will come back to it.</p>

<h3>The conntrack table: how the answers find the way back</h3>
<p>When the server answers to <code>198.51.100.2:41000</code>, how does the router know it belongs to the laptop? It wrote it down. Linux keeps a <strong>connection tracking</strong> table (conntrack):</p>
${run('c23-homegw', 'conntrack -L', 1, C)}
<p>Each line has two halves. The first <code>src=… dst=… sport=… dport=…</code> is the connection as the laptop sent it (the <em>original</em> direction). The second is what the router expects to come back (the <em>reply</em> direction): from <code>203.0.113.10:80</code> to <code>198.51.100.2</code>. When a reply arrives, the router finds the line and rewrites it back to <code>192.168.50.10</code>. <code>TIME_WAIT</code> and the number 117 are the state of the TCP connection and the seconds left before the line is deleted. How long a line lives depends on the protocol:</p>
${run('c23-timeout', 'sysctl net.netfilter.nf_conntrack_tcp_timeout_established', 3, C)}
<p>On this Linux router an idle established TCP connection keeps its line for 432 000 s (5 days), but a UDP "connection" only 30 s without traffic. Many home routers and cloud NAT services are much stricter: AWS's NAT Gateway, for example, drops a connection after 350 seconds without traffic and answers the next packet with a reset. That is why a database connection or a WebSocket that stays silent for a few minutes can die "for no reason" behind NAT — and why the fix is a keep-alive (Chapter 4).</p>

<h3>Two devices, one public address, the same port</h3>
<p>A house has one public address and many devices. What if two of them use the same source port at the same time? We force it: the laptop and the phone both connect from port 41000:</p>
${run('c23-laptop', 'curl -s --local-port 41000', 1, C)}
${run('c23-phone', 'curl -s --local-port 41000', 1, C)}
<p>The laptop kept port 41000 outside; the phone's port was rewritten, to 4734, because <code>198.51.100.2:41000</code> was already taken for that destination. The capture above (third line: <code>198.51.100.2.4734</code>) and the conntrack table (<code>sport=41000 … dport=4734</code>) both show it. This port rewriting is what lets thousands of devices share one address — the full name is NAPT or PAT (port address translation). Two consequences for developers:</p>
<ul>
<li>A whole house, a café, a company or a university can reach your API from <strong>one</strong> IP. Rate limiting or banning by IP alone can block hundreds of innocent users.</li>
<li>One public address has about 64 000 ports per destination. A busy NAT can run out (cloud NAT gateways document a limit — AWS says each IPv4 address of its NAT gateway supports up to 55 000 simultaneous connections).</li>
</ul>
${net('nat', 'home', 'en', 'Send connections from the laptop and the phone through the home router: watch each header get rewritten and the conntrack table fill — including the port collision.', { tour: 'nat-home' })}

<h3>Why nobody can call into your laptop — and port forwarding</h3>
<p>NAT works for connections that start <em>inside</em>: the outgoing packet creates the conntrack line that the answer uses. A connection that starts <em>outside</em> finds no line. From the server we try the router's public address on port 8080, where the laptop runs a development server:</p>
${run('c23-vao', 'nc -vz -w 3 198.51.100.2', 1, C)}
<p>"Connection refused": the packet reached the home router, which has nothing listening on 8080 and no rule saying "this belongs to the laptop". To expose the laptop on purpose you add a <strong>DNAT</strong> rule (destination NAT) — what home router menus call <strong>port forwarding</strong>:</p>
${run('c23-dnat', 'iptables -t nat -A PREROUTING', 2, C)}
${run('c23-vao2', 'curl -s -m 3', 1, C)}
<div class="pitfall co-tieu-de">
<p><strong>"NAT is my firewall."</strong> It blocks incoming connections only as a side effect: it does not know where to send them. The moment you forward a port, your laptop's development server — often running with debug mode on and no password — is on the Internet for anyone scanning that port. Forward only what must be public, put real authentication in front, and remove the rule after the demo. For a quick demo, an outbound tunnel (Cloudflare Tunnel, ngrok, an SSH tunnel — Chapter 10) is safer than a forwarded port.</p>
</div>
${net('nat', 'inbound', 'en', 'Try to reach the laptop from the Internet: private address, public address, then add a port-forwarding rule.', { tour: 'nat-inbound' })}

<h3>CGNAT: when your ISP adds its own NAT</h3>
<p>There are not enough IPv4 addresses for every customer (lesson 2.1). Mobile networks and some home ISPs therefore give customers an address from <code>100.64.0.0/10</code> — the range RFC 6598 reserved for exactly this — and do NAT a second time in their own network: <strong>carrier-grade NAT</strong> (CGNAT). Our 4G phone:</p>
${run('c23-mobile', 'ip -br -4 addr show eth0', 2, C)}
${run('c23-isp', 'iptables -t nat -S POSTROUTING', 2, C)}
<p>The phone has <code>100.64.0.10</code>; LabFlow sees <code>198.51.100.200</code>, an address of the ISP shared by many customers. And this time you cannot forward a port, because the NAT is on the ISP's equipment, not yours:</p>
${run('c23-vao3', 'nc -vz', 1, C)}
<p>The ISP's box itself answered "refused". This is why hosting a game server or a home lab "just doesn't work" on some connections: check whether the WAN address your router shows is in <code>100.64.0.0/10</code> (or differs from what a "what is my IP" site shows). The way out is an outbound tunnel or IPv6 (lesson 2.4), which needs no NAT at all.</p>
${net('nat', 'cgnat', 'en', 'Follow the 4G phone through the ISP’s NAT, then try to forward a port — and see why it cannot work.')}

<h3>docker run -p is DNAT on your own machine</h3>
<p>A container is a separate <strong>network namespace</strong> — its own interfaces, routes and ports — attached to a bridge with a private address. To reach it from outside, Docker installs NAT rules in the host's kernel, exactly the kind we wrote for the home router. We publish an nginx container on port 18080 and read the rules Docker created (inside Docker Desktop's virtual machine, read only):</p>
${run('c23-docker', 'docker run -d', 7, C)}
<ul>
<li><code>-A DOCKER … --dport 18080 -j DNAT --to-destination 172.17.0.5:80</code>: <code>-p 18080:80</code> is a port-forwarding rule to the container's private address.</li>
<li><code>-A POSTROUTING -s 172.17.0.0/16 ! -o docker0 -j MASQUERADE</code>: containers going out to the Internet are NATed behind the host's address — the home-router rule again.</li>
<li>The nginx log shows the client as <code>192.168.65.1</code> — Docker Desktop's own address, not the real client. Behind NAT and proxies, the IP your app sees is often not the user's IP (Chapter 7 shows how proxies pass the real one with <code>X-Forwarded-For</code>).</li>
</ul>
<div class="pitfall co-tieu-de">
<p><strong>Published ports skip the host firewall.</strong> On a Linux server with ufw blocking everything, <code>docker run -p 5432:5432 postgres</code> is still reachable from the whole Internet. Docker's documentation says it plainly: traffic to published ports is NATed before ufw's rules are applied, "effectively ignoring your firewall configuration", and publishing "is insecure by default" because it binds all addresses. Publish only what must be public, and for anything else bind to loopback: <code>-p 127.0.0.1:5432:5432</code>.</p>
</div>

<h3>Where this lives in the computer</h3>
<ul>
<li>NAT rules (iptables/nftables) and the conntrack table are part of the kernel's packet filter, <strong>netfilter</strong>, in RAM. The NAT rule is evaluated only for the first packet of a connection; every later packet is translated by looking up its conntrack line.</li>
<li>A home Wi-Fi router is usually a small Linux computer doing exactly this. A CGNAT is the same idea on large dedicated hardware at the ISP.</li>
</ul>
${cauNoi('en', { ...OSG, bai: 'osg202-slide-cs6-1', so: 'CS.6', ten: 'Containers (1/2): container vs VM, the 8 namespaces, nsenter', giong: 'a container has its own network namespace: its own interfaces, routes and ports', khac: 'OSG202 looks at namespaces from the operating-system side (unshare, lsns, nsenter)', them: 'what happens to a container’s packets: the bridge, -p as a DNAT rule read from the kernel, masquerade on the way out, and the client IP the app really sees' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you want to show a client a build running on your laptop (port 8080). The client is "on the Internet" (<code>nfi-server</code>). A teammate on 4G (<code>nfi-mobile</code>) wants to do the same from their phone.</p>
<ol>
<li>On <code>nfi-laptop</code>: <code>cd /tmp && echo demo > index.html && python3 -m http.server 8080 &</code>. From <code>nfi-server</code>, try <code>nc -vz -w 3 192.168.50.10 8080</code> and <code>nc -vz -w 3 198.51.100.2 8080</code>. Explain each error.</li>
<li>On <code>nfi-homegw</code>, forward port 8443 of the public address to the laptop's 8080. Prove it with <code>curl http://198.51.100.2:8443/</code> from the server. Show the conntrack line of that connection on homegw.</li>
<li>From <code>nfi-laptop</code>, <code>nfi-phone</code> and <code>nfi-mobile</code>, run <code>curl -s http://203.0.113.10/</code>. Make a table: device, its own address, the address the server sees, which NAT did it.</li>
<li>Explain to your teammate why they cannot forward a port on 4G, and propose a solution.</li>
</ol>
<p><strong>Done when:</strong> the client sees your page through 8443, your table has three correct rows, and you can name the device that does each translation.</p>
<details><summary>Solution</summary>
<p>1) <code>192.168.50.10</code>: "Network is unreachable" — private addresses have no route on the Internet (the DC router answers !N). <code>198.51.100.2:8080</code>: "Connection refused" — the home router itself answers; it has no service and no forwarding rule. 2) <code>iptables -t nat -A PREROUTING -i wan0 -p tcp --dport 8443 -j DNAT --to-destination 192.168.50.10:8080</code>; curl prints "demo"; <code>conntrack -L -p tcp --dport 8443</code> shows <code>src=203.0.113.10 dst=198.51.100.2 dport=8443</code> with a reply half from <code>192.168.50.10 sport=8080</code>. 3) laptop 192.168.50.10 → 198.51.100.2 (home router NAT); phone 192.168.50.11 → 198.51.100.2 (same home router — same public address); mobile 100.64.0.10 → 198.51.100.200 (the ISP's CGNAT). 4) The 4G phone's public address belongs to the ISP's NAT, which you cannot configure; it is shared with other customers. Use an outbound tunnel (Cloudflare Tunnel/ngrok/SSH reverse tunnel) or IPv6 if the network offers it.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['private address (địa chỉ riêng, RFC 1918)', '10/8, 172.16/12, 192.168/16 — reused everywhere, never routed on the Internet.'],
    ['NAT / SNAT / masquerade', 'Rewrite the source address of outgoing packets to the router’s public address.'],
    ['DNAT / port forwarding (mở cổng)', 'Rewrite the destination of incoming packets to an inside machine.'],
    ['conntrack (bảng theo dõi kết nối)', 'Kernel table of translated connections: original and reply direction, state, timeout.'],
    ['PAT / NAPT', 'NAT that also rewrites ports so many devices share one address.'],
    ['CGNAT (NAT của nhà mạng)', 'ISP-side NAT with 100.64.0.0/10 customer addresses; you cannot forward ports.'],
    ['network namespace', 'A container’s own interfaces, routes and ports, isolated from the host.'],
    ['published port (-p)', 'Docker DNAT rule from a host port to a container; binds all addresses by default.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>Private ranges are reused in every network and have no route on the Internet.</li>
<li>Home routers SNAT (masquerade) outgoing packets to one public address; conntrack remembers each connection so replies are translated back.</li>
<li>Many devices share one IP by rewriting ports too — rate limits by IP hit whole houses and offices; idle NAT entries expire and silent connections die.</li>
<li>Incoming connections need DNAT (port forwarding) — impossible behind CGNAT; NAT is not a firewall.</li>
<li><code>docker run -p</code> is a DNAT rule in your kernel; published ports bypass ufw — bind to 127.0.0.1 unless the port must be public.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc1918', '📄', 'RFC 1918 — Address Allocation for Private Internets', 'The three private ranges and why they are not routed.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc6598', '📄', 'RFC 6598 — Shared Address Space (100.64.0.0/10)', 'The range reserved for carrier-grade NAT.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc4787', '📄', 'RFC 4787 — NAT Behavioral Requirements for Unicast UDP', 'Mapping, port reuse and timeouts that NATs should follow.', 'Open')}
${L('https://docs.docker.com/engine/network/port-publishing/', '🐳', 'Docker docs — Port publishing and mapping', '“Publishing container ports is insecure by default”; binding to 127.0.0.1.', 'Open')}
${L('https://docs.docker.com/engine/network/packet-filtering-firewalls/', '🐳', 'Docker docs — Packet filtering and firewalls', 'Why published ports ignore ufw rules.', 'Open')}
${L('https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-troubleshooting.html', '☁️', 'AWS — Troubleshoot NAT gateways', 'Idle connections dropped after 350 s; about 55 000 connections per IP.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>NAT, dải IP riêng và mạng Docker</h2>
<p class="lead">Laptop ở nhà có địa chỉ <code>192.168.50.10</code> — và hàng triệu laptop khác trong hàng triệu ngôi nhà khác cũng vậy. Thế mà máy chủ LabFlow vẫn trả lời được từng chiếc. Bằng cách nào? Bài này mở router nhà ra và xem nó viết lại địa chỉ (NAT), đọc cái bảng giúp câu trả lời tìm được đường về, chỉ ra vì sao không ai trên Internet gọi <em>vào</em> laptop của bạn được, điều gì đổi khi nhà mạng thêm một lớp NAT của riêng họ (4G, CGNAT), và vì sao <code>docker run -p</code> chính là mánh đó ngay bên trong máy bạn.</p>

<h3>Dải riêng: những địa chỉ không có trên Internet</h3>
<p>Năm 1996, RFC 1918 dành riêng ba dải mà ai cũng được dùng trong mạng của mình, không cần xin phép ai: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code> và <code>192.168.0.0/16</code>. Router nhà nào cũng dùng một dải; Docker, văn phòng, trường học và mạng trên cloud cũng vậy. Vì ai cũng dùng lại chúng, chúng không thể chỉ một nơi duy nhất trên Internet, nên router trên Internet đơn giản là không có tuyến cho chúng. Từ máy chủ LabFlow, địa chỉ riêng của laptop là không tới được — router DC trả lời <code>!N</code> (network unreachable):</p>
${run('c23-vao', 'nc -vz -w 3 192.168.50.10', 2, C)}
<p>Vậy thì laptop lướt web bằng cách nào?</p>

<h3>NAT: router nhà dán địa chỉ của chính nó lên gói tin của bạn</h3>
<p>Laptop gọi máy chủ LabFlow, máy chủ in ra địa chỉ nó thấy:</p>
${run('c23-laptop', 'ip -br -4 addr show eth0', 2, C)}
<p>Máy chủ thấy <code>198.51.100.2</code> — không phải địa chỉ của laptop mà là địa chỉ <em>công cộng</em> của router nhà, địa chỉ nhà mạng cấp cho nó. Đó là <strong>NAT</strong> (Network Address Translation — biên dịch địa chỉ mạng): router viết lại địa chỉ nguồn của gói đi ra thành địa chỉ của chính nó, và viết lại địa chỉ đích của câu trả lời về lại laptop. Trên router Linux, đó là một luật:</p>
${run('c23-homegw', 'iptables -t nat -S POSTROUTING', 1, C)}
<p><code>-o wan0 -j MASQUERADE</code>: "với gói đi ra phía Internet, thay địa chỉ nguồn bằng địa chỉ mà <code>wan0</code> đang có". (MASQUERADE là một kiểu <strong>SNAT</strong> — NAT nguồn — tự theo địa chỉ của card mạng, tiện khi nhà mạng đổi địa chỉ. Dòng <code>127.0.0.11</code> là DNS nội bộ của Docker, không phải của ta.) Ta bắt cùng các kết nối ở hai phía router — <code>lan0</code> (bên trong) và <code>wan0</code> (bên ngoài):</p>
${run('c23-homegw', 'tcpdump -n -t -q -r /tmp/lan.pcap', 2, C)}
<p>Cùng kết nối, cùng đích, cùng <em>cổng</em> nguồn — chỉ địa chỉ nguồn đổi, từ 192.168.50.x thành 198.51.100.2. Trừ dòng thứ ba: lát nữa ta quay lại.</p>

<h3>Bảng conntrack: câu trả lời tìm đường về ra sao</h3>
<p>Khi máy chủ trả lời tới <code>198.51.100.2:41000</code>, làm sao router biết gói đó là của laptop? Nó đã ghi lại. Linux giữ một bảng <strong>theo dõi kết nối (connection tracking — conntrack)</strong>:</p>
${run('c23-homegw', 'conntrack -L', 1, C)}
<p>Mỗi dòng có hai nửa. Nửa đầu <code>src=… dst=… sport=… dport=…</code> là kết nối như laptop gửi đi (chiều <em>gốc — original</em>). Nửa sau là thứ router chờ đợi quay về (chiều <em>trả lời — reply</em>): từ <code>203.0.113.10:80</code> tới <code>198.51.100.2</code>. Khi câu trả lời tới, router tìm thấy dòng đó và viết lại về <code>192.168.50.10</code>. <code>TIME_WAIT</code> và con số 117 là trạng thái kết nối TCP và số giây còn lại trước khi dòng bị xoá. Một dòng sống được bao lâu tuỳ giao thức:</p>
${run('c23-timeout', 'sysctl net.netfilter.nf_conntrack_tcp_timeout_established', 3, C)}
<p>Trên router Linux này, một kết nối TCP đã thiết lập mà im lặng vẫn giữ dòng của nó 432 000 giây (5 ngày), nhưng một "kết nối" UDP chỉ 30 giây không có lưu lượng. Nhiều router gia đình và dịch vụ NAT trên cloud chặt hơn nhiều: NAT Gateway của AWS, chẳng hạn, bỏ một kết nối sau 350 giây không có lưu lượng và trả lời gói kế tiếp bằng một gói reset. Vì thế một kết nối cơ sở dữ liệu hay một WebSocket im lặng vài phút có thể chết "vô cớ" sau NAT — và cách chữa là keep-alive (Chương 4).</p>

<h3>Hai thiết bị, một địa chỉ công cộng, cùng một cổng</h3>
<p>Một nhà có một địa chỉ công cộng và nhiều thiết bị. Nếu hai thiết bị cùng dùng một cổng nguồn cùng lúc thì sao? Ta ép điều đó xảy ra: laptop và điện thoại cùng kết nối từ cổng 41000:</p>
${run('c23-laptop', 'curl -s --local-port 41000', 1, C)}
${run('c23-phone', 'curl -s --local-port 41000', 1, C)}
<p>Laptop giữ được cổng 41000 ra bên ngoài; cổng của điện thoại thì bị viết lại, thành 4734, vì <code>198.51.100.2:41000</code> đã bị chiếm cho đích đó. Bản bắt gói ở trên (dòng thứ ba: <code>198.51.100.2.4734</code>) và bảng conntrack (<code>sport=41000 … dport=4734</code>) đều cho thấy. Việc viết lại cổng này là thứ cho phép hàng nghìn thiết bị dùng chung một địa chỉ — tên đầy đủ là NAPT hay PAT (port address translation — biên dịch địa chỉ kèm cổng). Hai hệ quả cho lập trình viên:</p>
<ul>
<li>Cả một nhà, một quán cà phê, một công ty hay một trường đại học có thể gọi API của bạn từ <strong>một</strong> IP. Giới hạn tần suất hay cấm chỉ theo IP có thể chặn hàng trăm người vô tội.</li>
<li>Một địa chỉ công cộng có khoảng 64 000 cổng cho mỗi đích. Một NAT bận rộn có thể cạn cổng (NAT gateway trên cloud có ghi giới hạn — AWS cho biết mỗi địa chỉ IPv4 của NAT gateway hỗ trợ tối đa 55 000 kết nối đồng thời).</li>
</ul>
${net('nat', 'home', 'vi', 'Gửi kết nối từ laptop và điện thoại qua router nhà: xem từng header bị viết lại và bảng conntrack đầy dần — cả vụ đụng cổng.', { tour: 'nat-home' })}

<h3>Vì sao không ai gọi vào laptop của bạn được — và mở cổng</h3>
<p>NAT chạy với những kết nối bắt đầu từ <em>bên trong</em>: gói đi ra tạo ra dòng conntrack mà câu trả lời dùng. Một kết nối bắt đầu từ <em>bên ngoài</em> không tìm thấy dòng nào. Từ máy chủ, ta thử địa chỉ công cộng của router ở cổng 8080, nơi laptop đang chạy một máy chủ phát triển:</p>
${run('c23-vao', 'nc -vz -w 3 198.51.100.2', 1, C)}
<p>"Connection refused": gói tới được router nhà, nhưng router không có gì nghe ở 8080 và không có luật nào nói "cái này thuộc về laptop". Muốn cố ý mở laptop ra ngoài, bạn thêm một luật <strong>DNAT</strong> (NAT đích) — thứ mà menu router gia đình gọi là <strong>mở cổng (port forwarding)</strong>:</p>
${run('c23-dnat', 'iptables -t nat -A PREROUTING', 2, C)}
${run('c23-vao2', 'curl -s -m 3', 1, C)}
<div class="pitfall co-tieu-de">
<p><strong>"NAT là tường lửa của tôi."</strong> Nó chặn kết nối đi vào chỉ như một tác dụng phụ: nó không biết gửi chúng đi đâu. Ngay khi bạn mở một cổng, máy chủ phát triển trên laptop — thường đang bật chế độ debug và không có mật khẩu — nằm trên Internet cho bất kỳ ai quét cổng đó. Chỉ mở những gì buộc phải công khai, đặt xác thực thật ở phía trước, và gỡ luật sau buổi demo. Để demo nhanh, một đường hầm đi ra (Cloudflare Tunnel, ngrok, đường hầm SSH — Chương 10) an toàn hơn một cổng được mở.</p>
</div>
${net('nat', 'inbound', 'vi', 'Thử gọi vào laptop từ Internet: địa chỉ riêng, địa chỉ công cộng, rồi thêm một luật mở cổng.', { tour: 'nat-inbound' })}

<h3>CGNAT: khi nhà mạng thêm NAT của riêng họ</h3>
<p>Không đủ địa chỉ IPv4 cho mọi khách hàng (bài 2.1). Vì vậy mạng di động và một số nhà mạng gia đình cấp cho khách một địa chỉ thuộc <code>100.64.0.0/10</code> — dải RFC 6598 dành riêng cho đúng việc này — và làm NAT thêm một lần nữa trong mạng của họ: <strong>NAT cấp nhà mạng (carrier-grade NAT — CGNAT)</strong>. Điện thoại 4G của ta:</p>
${run('c23-mobile', 'ip -br -4 addr show eth0', 2, C)}
${run('c23-isp', 'iptables -t nat -S POSTROUTING', 2, C)}
<p>Điện thoại có <code>100.64.0.10</code>; LabFlow thấy <code>198.51.100.200</code>, một địa chỉ của nhà mạng dùng chung cho nhiều khách. Và lần này bạn không mở cổng được, vì NAT nằm trên thiết bị của nhà mạng, không phải của bạn:</p>
${run('c23-vao3', 'nc -vz', 1, C)}
<p>Chính hộp của nhà mạng trả lời "refused". Đó là vì sao dựng máy chủ game hay lab tại nhà "cứ không chạy" trên một số đường mạng: kiểm xem địa chỉ WAN mà router của bạn hiện có nằm trong <code>100.64.0.0/10</code> không (hoặc khác với địa chỉ mà một trang "what is my IP" cho thấy). Lối thoát là một đường hầm đi ra hoặc IPv6 (bài 2.4), thứ không cần NAT chút nào.</p>
${net('nat', 'cgnat', 'vi', 'Theo điện thoại 4G đi qua NAT của nhà mạng, rồi thử mở cổng — và xem vì sao không thể được.')}

<h3>docker run -p là DNAT ngay trên máy của bạn</h3>
<p>Một container là một <strong>network namespace</strong> (không gian tên mạng) riêng — card mạng, tuyến và cổng của riêng nó — gắn vào một bridge với địa chỉ riêng. Muốn tới được nó từ bên ngoài, Docker cài luật NAT vào nhân của máy chủ, đúng loại luật ta đã viết cho router nhà. Ta công bố một container nginx ở cổng 18080 và đọc các luật Docker tạo ra (bên trong máy ảo của Docker Desktop, chỉ đọc):</p>
${run('c23-docker', 'docker run -d', 7, C)}
<ul>
<li><code>-A DOCKER … --dport 18080 -j DNAT --to-destination 172.17.0.5:80</code>: <code>-p 18080:80</code> là một luật mở cổng tới địa chỉ riêng của container.</li>
<li><code>-A POSTROUTING -s 172.17.0.0/16 ! -o docker0 -j MASQUERADE</code>: container đi ra Internet được NAT sau địa chỉ của máy chủ — lại chính luật của router nhà.</li>
<li>Log của nginx ghi người gọi là <code>192.168.65.1</code> — địa chỉ của chính Docker Desktop, không phải người gọi thật. Sau NAT và proxy, IP mà ứng dụng thấy thường không phải IP của người dùng (Chương 7 chỉ cách proxy chuyển IP thật qua <code>X-Forwarded-For</code>).</li>
</ul>
<div class="pitfall co-tieu-de">
<p><strong>Cổng đã công bố đi vòng qua tường lửa của máy.</strong> Trên một máy chủ Linux có ufw chặn mọi thứ, <code>docker run -p 5432:5432 postgres</code> vẫn tới được từ cả Internet. Tài liệu Docker nói thẳng: lưu lượng tới cổng đã công bố được NAT trước khi luật của ufw được áp dụng, "coi như bỏ qua cấu hình tường lửa của bạn", và việc công bố cổng "mặc định là không an toàn" vì nó gắn vào mọi địa chỉ. Chỉ công bố những gì buộc phải công khai, còn lại thì gắn vào loopback: <code>-p 127.0.0.1:5432:5432</code>.</p>
</div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Luật NAT (iptables/nftables) và bảng conntrack thuộc bộ lọc gói của nhân, <strong>netfilter</strong>, nằm trong RAM. Luật NAT chỉ được xét cho gói đầu tiên của một kết nối; mọi gói sau đó được biên dịch bằng cách tra dòng conntrack của nó.</li>
<li>Router Wi-Fi gia đình thường là một máy tính Linux nhỏ làm đúng việc này. CGNAT là cùng ý tưởng đó trên phần cứng chuyên dụng cỡ lớn ở nhà mạng.</li>
</ul>
${cauNoi('vi', { ...OSG, bai: 'osg202-slide-cs6-1', so: 'CS.6', ten: 'Container (1/2): container và máy ảo, 8 loại namespace, nsenter', giong: 'container có network namespace riêng: card mạng, tuyến và cổng của riêng nó', khac: 'OSG202 nhìn namespace từ phía hệ điều hành (unshare, lsns, nsenter)', them: 'chuyện gì xảy ra với gói tin của container: bridge, -p là một luật DNAT đọc ra từ nhân, masquerade khi đi ra, và IP người gọi mà ứng dụng thật sự thấy' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn muốn cho khách xem một bản dựng đang chạy trên laptop (cổng 8080). Khách đang ở "trên Internet" (<code>nfi-server</code>). Một đồng nghiệp dùng 4G (<code>nfi-mobile</code>) muốn làm điều tương tự từ điện thoại.</p>
<ol>
<li>Trên <code>nfi-laptop</code>: <code>cd /tmp && echo demo > index.html && python3 -m http.server 8080 &</code>. Từ <code>nfi-server</code>, thử <code>nc -vz -w 3 192.168.50.10 8080</code> và <code>nc -vz -w 3 198.51.100.2 8080</code>. Giải thích từng lỗi.</li>
<li>Trên <code>nfi-homegw</code>, mở cổng 8443 của địa chỉ công cộng vào cổng 8080 của laptop. Chứng minh bằng <code>curl http://198.51.100.2:8443/</code> từ máy chủ. Chỉ ra dòng conntrack của kết nối đó trên homegw.</li>
<li>Từ <code>nfi-laptop</code>, <code>nfi-phone</code> và <code>nfi-mobile</code>, chạy <code>curl -s http://203.0.113.10/</code>. Lập bảng: thiết bị, địa chỉ của chính nó, địa chỉ máy chủ thấy, NAT nào làm việc đó.</li>
<li>Giải thích cho đồng nghiệp vì sao trên 4G không mở cổng được, và đề xuất một cách giải quyết.</li>
</ol>
<p><strong>Đạt khi:</strong> khách thấy trang của bạn qua 8443, bảng của bạn có ba dòng đúng, và bạn gọi tên được thiết bị làm từng phép biên dịch.</p>
<details><summary>Lời giải</summary>
<p>1) <code>192.168.50.10</code>: "Network is unreachable" — địa chỉ riêng không có tuyến trên Internet (router DC trả lời !N). <code>198.51.100.2:8080</code>: "Connection refused" — chính router nhà trả lời; nó không có dịch vụ nào và không có luật mở cổng. 2) <code>iptables -t nat -A PREROUTING -i wan0 -p tcp --dport 8443 -j DNAT --to-destination 192.168.50.10:8080</code>; curl in ra "demo"; <code>conntrack -L -p tcp --dport 8443</code> hiện <code>src=203.0.113.10 dst=198.51.100.2 dport=8443</code> với nửa trả lời từ <code>192.168.50.10 sport=8080</code>. 3) laptop 192.168.50.10 → 198.51.100.2 (NAT của router nhà); điện thoại 192.168.50.11 → 198.51.100.2 (cùng router nhà — cùng địa chỉ công cộng); mobile 100.64.0.10 → 198.51.100.200 (CGNAT của nhà mạng). 4) Địa chỉ công cộng của điện thoại 4G thuộc NAT của nhà mạng, thứ bạn không cấu hình được, và nó dùng chung với khách khác. Dùng một đường hầm đi ra (Cloudflare Tunnel/ngrok/đường hầm SSH ngược) hoặc IPv6 nếu mạng có hỗ trợ.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['private address (địa chỉ riêng, RFC 1918)', '10/8, 172.16/12, 192.168/16 — dùng lại khắp nơi, không bao giờ được định tuyến trên Internet.'],
    ['NAT / SNAT / masquerade', 'Viết lại địa chỉ nguồn của gói đi ra thành địa chỉ công cộng của router.'],
    ['DNAT / port forwarding (mở cổng)', 'Viết lại địa chỉ đích của gói đi vào thành một máy bên trong.'],
    ['conntrack (bảng theo dõi kết nối)', 'Bảng của nhân ghi các kết nối đã biên dịch: chiều gốc và chiều trả lời, trạng thái, thời hạn.'],
    ['PAT / NAPT', 'NAT viết lại cả cổng để nhiều thiết bị dùng chung một địa chỉ.'],
    ['CGNAT (NAT của nhà mạng)', 'NAT phía nhà mạng, khách dùng địa chỉ 100.64.0.0/10; không mở cổng được.'],
    ['network namespace (không gian tên mạng)', 'Card mạng, tuyến và cổng riêng của một container, tách khỏi máy chủ.'],
    ['published port (-p, cổng công bố)', 'Luật DNAT của Docker từ một cổng của máy chủ vào container; mặc định gắn mọi địa chỉ.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dải riêng được dùng lại ở mọi mạng và không có tuyến trên Internet.</li>
<li>Router nhà làm SNAT (masquerade) gói đi ra về một địa chỉ công cộng; conntrack nhớ từng kết nối để biên dịch câu trả lời về lại.</li>
<li>Nhiều thiết bị dùng chung một IP nhờ viết lại cả cổng — giới hạn theo IP đánh trúng cả nhà, cả văn phòng; dòng NAT im lặng sẽ hết hạn và kết nối im lặng sẽ chết.</li>
<li>Kết nối đi vào cần DNAT (mở cổng) — không thể sau CGNAT; NAT không phải tường lửa.</li>
<li><code>docker run -p</code> là một luật DNAT trong nhân của bạn; cổng công bố vượt qua ufw — gắn vào 127.0.0.1 trừ khi cổng buộc phải công khai.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc1918', '📄', 'RFC 1918 — Cấp phát địa chỉ cho mạng riêng', 'Ba dải riêng và vì sao chúng không được định tuyến.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc6598', '📄', 'RFC 6598 — Không gian địa chỉ dùng chung (100.64.0.0/10)', 'Dải dành cho NAT cấp nhà mạng.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc4787', '📄', 'RFC 4787 — Yêu cầu hành vi của NAT với UDP unicast', 'Ánh xạ, dùng lại cổng và thời hạn mà NAT nên tuân theo.', 'Mở')}
${L('https://docs.docker.com/engine/network/port-publishing/', '🐳', 'Tài liệu Docker — Công bố và ánh xạ cổng', '“Công bố cổng container mặc định là không an toàn”; gắn vào 127.0.0.1.', 'Mở')}
${L('https://docs.docker.com/engine/network/packet-filtering-firewalls/', '🐳', 'Tài liệu Docker — Lọc gói và tường lửa', 'Vì sao cổng đã công bố bỏ qua luật ufw.', 'Mở')}
${L('https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-troubleshooting.html', '☁️', 'AWS — Xử lý sự cố NAT gateway', 'Kết nối im lặng bị bỏ sau 350 giây; khoảng 55 000 kết nối mỗi IP.', 'Mở')}
</div>
`,
};
