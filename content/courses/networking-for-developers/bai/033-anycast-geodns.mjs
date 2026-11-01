/**
 * Chương 3 · 3.4 — Anycast, GeoDNS và cân bằng tải bằng DNS (slug khung netdev-3-4-anycast-geodns).
 * Output thật: lab/out/c34-*.out.txt. Output GIỮ: c34-pop1-rut + c34-theo-doc (dòng thời gian), c34-rr, c34-rr-thu, c34-that.
 */
import { run, src, card, kv } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-03-4.mjs';

const L = card;
const D = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN/ };

export default {
  title: '3.4 — Anycast, GeoDNS and DNS-based load balancing|||3.4 — Anycast, GeoDNS và cân bằng tải bằng DNS',
  slug: 'netdev-3-4-anycast-geodns',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một IP ở hai thành phố bằng BGP (DNS công cộng 198.19.1.1 của lab): ai trả lời từ đâu, rút một điểm và tự chuyển trong một giây; 1.1.1.1 và 8.8.8.8; GeoDNS bằng view của BIND, và vì sao nó nhìn resolver chứ không nhìn người dùng (EDNS Client Subnet); DNS round-robin với một máy đã chết: curl mất 0,2 s, Python 3 s, Node 0,26 s; Cloudflare proxy (đám mây cam) nhìn từ cuongthai.com và media.cuongthai.com.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Anycast, GeoDNS and DNS-based load balancing</h2>
<p class="lead">1.1.1.1 answers in a few milliseconds whether you ask from Hanoi or from Paris. A CDN gives a user in Vietnam a different address than a user in Singapore — for the same name. And many small sites "load balance" by putting two A records on one name. Three tricks, three very different mechanisms: one IP in many places (anycast), answers chosen by who asks (GeoDNS), and several IPs for one name (round robin). This lesson builds each one in the lab, breaks it, and shows what users really experience.</p>

<h3>Anycast: one address, two cities</h3>
<p>The lab's "public DNS" <code>198.19.1.1</code> runs on two machines: <strong>pop1</strong> in "Hanoi" (at the exchange point, connected to the ISP) and <strong>pop2</strong> in "Singapore" (behind the datacenter's router). Both put <code>198.19.1.1</code> on their loopback interface and both <strong>announce the same prefix</strong> <code>198.19.1.0/24</code> with BGP (lesson 2.5). Ask it "which copy are you?" (the CHAOS-class <code>id.server</code> question, as with the root servers in lesson 3.1) — first from the laptop at home:</p>
${run('c34-anycast', 'dig @198.19.1.1', 2, D)}
<p>And from a machine in the datacenter:</p>
${run('c34-anycast-dc', 'dig @198.19.1.1', 2, D)}
<p>Same address, different machine, different path. Nothing in DNS decides this: it is ordinary routing. The ISP's router simply has two routes to the same prefix and picks the shorter AS path:</p>
${run('c34-bgp', 'vtysh', 1, D)}
<p>Path <code>64530</code> (pop1, directly at the exchange) beats <code>64510 64530</code> (via the datacenter to pop2). The datacenter router makes the opposite choice, because pop2 is its direct neighbour. Each network reaches its <em>nearest</em> copy — "nearest" in routing terms, which is usually also nearest in kilometres.</p>

<h3>When one site goes down</h3>
<p>A loop on the laptop asked <code>198.19.1.1</code> "who are you?" every second. At 16:22:56 we made pop1 stop announcing the prefix (maintenance, or a crash detected by a health check):</p>
${run('c34-pop1-rut', 'date', 2, D)}
${run('c34-theo-doc', 'cat', 1, D)}
<p>The next second, the same address was answered from Singapore. The ISP's router lost one of its two routes and used the other; the laptop changed nothing — no new IP, no new config, no TTL to wait for. This is why every big public resolver and every root server uses anycast: failover happens at the speed of BGP. (It suits DNS especially well: one small UDP question, one answer. A long TCP connection that is moved to another site mid-way would break, because the new site knows nothing about it — so anycast for TCP services such as CDNs needs routes that stay stable; RFC 4786 discusses this.)</p>
${net('anycast', 'anycast', 'en', 'Two sites announce the same prefix: see which clients reach which site, then withdraw one.', { tour: 'anycast-withdraw' })}
<p>The real public resolvers work the same way: Google launched <code>8.8.8.8</code> on 3 December 2009, Cloudflare launched <code>1.1.1.1</code> on 1 April 2018. From the course lab, <code>1.1.1.1</code> answers from a Hong Kong data centre:</p>
${run('c34-that', 'dig @1.1.1.1', 1, D)}

<h3>GeoDNS: the answer depends on who asks</h3>
<p><code>static.labflow.test</code> is a CNAME to <code>labflow.cdn.test</code> (lesson 3.2). The CDN's name server answers that name differently depending on <strong>where the question comes from</strong>, using BIND <em>views</em>:</p>
${src('../moi-truong/dns/named-cdn.conf', 'text')}
<p>From the laptop — through the ISP resolver, and through the public DNS (which is pop1 in Hanoi for this laptop):</p>
${run('c34-geo', 'dig +short static.labflow.test', 3, D)}
<p>From a machine in the datacenter, whose nearest public DNS is pop2 in Singapore:</p>
${run('c34-geo-dc', 'dig @198.19.1.1', 2, D)}
<p>Same name, two answers, two different servers — that is how CDNs and global services send each user to a nearby location with DNS alone.</p>

<div class="pitfall co-tieu-de">
<p><strong>GeoDNS sees the resolver, not the user.</strong> The CDN's name server never talks to the laptop: it only sees the address of the <em>resolver</em> that asks. When pop1 was withdrawn above, the laptop — still in Vietnam — started using pop2 in Singapore without noticing:</p>
${run('c34-geo-sai', 'dig @198.19.1.1 id', 3, D)}
<p>The Vietnamese user is now sent to the Singapore edge: slower, for no reason visible to them. The same happens to anyone using a public resolver whose nearest site is in another country, or a company VPN with a resolver abroad. The extension <strong>EDNS Client Subnet</strong> (ECS, RFC 7871) lets a resolver pass a shortened form of the user's address (e.g. a /24) to the authoritative server so it can choose better — at a privacy cost: Cloudflare's 1.1.1.1 deliberately does <em>not</em> send ECS. That is one reason large CDNs also use anycast for the website itself, so that "nearest" is decided by routing, not by DNS.</p>
</div>
${net('anycast', 'geodns', 'en', 'Change which resolver a client uses and watch which edge server the CDN’s DNS hands out.', { tour: 'anycast-geodns' })}

<h3>Round-robin DNS: several A records for one name</h3>
<p>The cheapest "load balancing": give one name two addresses. Our <code>app.labflow.test</code> gets two A records — but the machine <code>.12</code> was shut down last month and nobody removed its record:</p>
${run('c34-rr-ns', 'printf', 3, D)}
${run('c34-rr', 'for i in 1 2 3 4; do dig', 1, D)}
<p>The resolver rotates the order between answers. Clients usually try the first address first — so how much does the dead <code>.12</code> cost? It depends entirely on the client:</p>
${run('c34-rr', 'for i in 1 2 3 4; do curl', 2, D)}
${run('c34-rr', 'for i in 1 2 3 4; do python3', 2, D)}
<ul>
<li><strong>curl</strong>: about 0.2 s extra when <code>.12</code> came first. It does not wait for <code>.12</code> to fail: it starts the next address after its "Happy Eyeballs" delay (200 ms by default) — the timestamps below show the second attempt starting 0.21 s, then 1.0 s after the first when the delay is set to 1000 ms.</li>
<li><strong>Python's</strong> <code>socket.create_connection</code> tries the addresses one after the other and waits for each to fail: 2.8 and 3.1 s, the time the datacenter router needed to give up finding <code>.12</code> and answer "No route to host". If a firewall had silently dropped the packets instead, it would wait for the full connect timeout — tens of seconds.</li>
<li><strong>Node</strong> (with <code>autoSelectFamily</code>, on by default since Node 20) tries each address for up to 250 ms: connected after 264 ms.</li>
</ul>
${run('c34-rr-thu', 'curl', 3, D)}

<div class="pitfall co-tieu-de">
<p><strong>Round-robin DNS is not a load balancer.</strong> DNS does not check whether <code>.12</code> is alive — the dead record stays in every answer until someone removes it, and then for another TTL in every cache. The split is not even (one big company resolver hands the same order to thousands of users), and the cost of a dead server depends on each client's code. Use it only with health-checked DNS from your provider, or put a real load balancer (Chapter 10) behind a single address.</p>
</div>
${net('anycast', 'roundrobin', 'en', 'Two A records, one dead server: compare how curl, Python and Node pay for it.')}

<h3>The orange cloud: Cloudflare's proxy, seen from DNS</h3>
<p>On Cloudflare, each record has a switch: <em>DNS only</em> (grey cloud) or <em>Proxied</em> (orange cloud). Proxied means Cloudflare's DNS answers with <strong>Cloudflare's own anycast addresses</strong> instead of yours, and the traffic goes through their edge. This site has one of each — we checked who owns each address with Team Cymru's IP-to-ASN DNS service:</p>
${run('c34-that', 'dig +short cuongthai.com', 6, D)}
<ul>
<li><code>cuongthai.com</code> → <code>160.187.1.208</code>, in a network of AS152992 registered in Vietnam: the VPS itself (grey cloud). Its web server answers directly: <code>server: nginx/1.27.5</code>.</li>
<li><code>media.cuongthai.com</code> (the image CDN, served from R2) → two addresses of AS13335, <strong>Cloudflare</strong> — the same addresses are announced from hundreds of cities. The response says <code>server: cloudflare</code>, and the <code>cf-ray</code> header ends with <code>HKG</code>: the edge in Hong Kong handled this request.</li>
<li>Consequences for a developer: with the proxy on, <code>dig</code> no longer shows your server's IP (good for hiding the origin), the IP your app sees is Cloudflare's unless you read <code>CF-Connecting-IP</code> (Chapter 7), and limits such as the ~100-second request timeout apply (Chapter 8).</li>
</ul>

<h3>Where this lives in the computer</h3>
<ul>
<li><strong>Anycast</strong> is only routing: the same /24 in the BGP table of many routers, each installing the best path in its kernel table (lesson 2.2). The PoP machines just have the address on their loopback interface.</li>
<li><strong>GeoDNS</strong> is a lookup in the authoritative server: for each query, BIND matches the source address against each view's ACL and answers from that view's copy of the zone.</li>
<li><strong>Round robin</strong> is the resolver (here Unbound, <code>rrset-roundrobin</code>) shuffling the order of records in each answer; the choice of which address to try, and how long to wait, is in the client library.</li>
</ul>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> support forwards two tickets: "Users in Hanoi sometimes load images from Singapore and the site feels slow", and ops proposes "let's add a second web server with a second A record — that's load balancing done". Answer both with measurements.</p>
<ol>
<li>From <code>nfi-laptop</code> and from <code>nfi-ns2</code>, run <code>dig @198.19.1.1 id.server CH TXT +short</code> and <code>dig @198.19.1.1 +short static.labflow.test</code>. Explain the two answers.</li>
<li>On <code>nfi-pop1</code>, withdraw the anycast prefix (<code>vtysh -c 'configure terminal' -c 'router bgp 64530' -c 'address-family ipv4 unicast' -c 'no network 198.19.1.0/24'</code>). Repeat step 1 on the laptop. Then on <code>nfi-pop2</code> run <code>unbound-control flush labflow.cdn.test</code> and repeat once more. Restore with <code>network 198.19.1.0/24</code>.</li>
<li>Add <code>app 30 IN A 203.0.113.10</code> and <code>app 30 IN A 203.0.113.12</code> on ns1 (bump the serial). From the laptop, time 6 connections with curl and with Python (commands from the lesson).</li>
<li>Write three sentences: one per ticket, and one recommendation.</li>
</ol>
<p><strong>Done when:</strong> you show from your own output that GeoDNS follows the resolver, that anycast failover changed the answer without any client change, and how much a dead round-robin address costs each client.</p>
<details><summary>Solution</summary>
<p>1) Laptop: <code>pop1.hn</code> and <code>203.0.113.10</code> (Hanoi edge). ns2: <code>pop2.sg</code> and <code>203.0.113.11</code> (Singapore edge): the CDN's DNS sees pop2's address and uses its "sg" view. 2) After the withdrawal the laptop reaches <code>pop2.sg</code>. If pop2 still had <code>labflow.cdn.test</code> cached (TTL 60), the answer may stay the same for up to a minute; after the flush it is <code>203.0.113.11</code> — a Vietnamese user sent to Singapore because GeoDNS sees the resolver. 3) curl: ~0.2 s extra whenever <code>.12</code> is first; Python: ~3 s. 4) "Hanoi users get Singapore images when their DNS resolver is in (or fails over to) Singapore: GeoDNS chooses by resolver address; ECS would help but public resolvers like 1.1.1.1 do not send it." "A second A record is not load balancing: DNS keeps sending users to a dead server, and some clients lose 3 s or more each time." "Use health-checked DNS or a load balancer in front of both servers."</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['anycast', 'One IP prefix announced from several places; routing sends each network to its nearest copy.'],
    ['unicast', 'The normal case: one address, one machine.'],
    ['PoP — point of presence (điểm hiện diện)', 'A site of a global service (a city, a data centre).'],
    ['GeoDNS', 'Authoritative server answers differently depending on the asking resolver’s address.'],
    ['EDNS Client Subnet — ECS (RFC 7871)', 'Resolver passes part of the user’s address to the authoritative server; not sent by 1.1.1.1.'],
    ['round-robin DNS', 'Several A/AAAA records for one name, order rotated; no health check.'],
    ['Happy Eyeballs (RFC 8305)', 'Client starts the next address after a short delay instead of waiting for the first to fail.'],
    ['proxied record (bản ghi đi qua proxy)', 'Cloudflare “orange cloud”: DNS returns Cloudflare’s anycast IPs, traffic goes through their edge.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>Anycast = the same prefix announced from several sites; BGP picks the nearest; withdrawing one site moved our clients in about one second, with no client change.</li>
<li>Public resolvers (8.8.8.8 since 2009, 1.1.1.1 since 2018) and the root servers are anycast.</li>
<li>GeoDNS answers by the <em>resolver’s</em> address — a user behind a far-away resolver gets a far-away server; ECS helps but costs privacy.</li>
<li>Round-robin DNS has no health check: a dead address cost curl ~0.2 s, Node ~0.26 s and Python ~3 s per connection.</li>
<li>Cloudflare’s proxy answers with its own anycast IPs (AS13335): <code>media.cuongthai.com</code> is proxied, <code>cuongthai.com</code> points straight at the VPS.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4786', '📄', 'RFC 4786 — Operation of anycast services', 'How anycast is run, and its limits for long-lived TCP.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc7871', '📄', 'RFC 7871 — Client Subnet in DNS queries', 'ECS: what is sent, and the privacy trade-off.', 'Open')}
${L('https://developers.cloudflare.com/1.1.1.1/faq/', '☁️', 'Cloudflare 1.1.1.1 — FAQ', '“1.1.1.1 does not send the EDNS Client Subnet header.”', 'Open')}
${L('https://blog.cloudflare.com/announcing-1111/', '☁️', 'Cloudflare — Announcing 1.1.1.1 (1 April 2018)', 'Why a fast, privacy-first public resolver.', 'Open')}
${L('https://googleblog.blogspot.com/2009/12/introducing-google-public-dns.html', '🔎', 'Google — Introducing Google Public DNS (3 December 2009)', 'The launch of 8.8.8.8.', 'Open')}
${L('https://developers.cloudflare.com/dns/proxy-status/', '☁️', 'Cloudflare — Proxy status', 'Proxied (orange) vs DNS-only (grey) records.', 'Open')}
${L('https://curl.se/libcurl/c/CURLOPT_HAPPY_EYEBALLS_TIMEOUT_MS.html', '📄', 'curl — Happy Eyeballs timeout', 'Default 200 ms; how curl moves through a list of addresses.', 'Open')}
${L('https://nodejs.org/api/net.html', '📄', 'Node.js — net: autoSelectFamily', 'Trying each address with autoSelectFamilyAttemptTimeout (250 ms).', 'Open')}
${L('https://team-cymru.com/community-services/ip-asn-mapping/', '🔎', 'Team Cymru — IP to ASN mapping', 'The DNS service used to find who owns an address.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Anycast, GeoDNS và cân bằng tải bằng DNS</h2>
<p class="lead">1.1.1.1 trả lời trong vài mili giây dù bạn hỏi từ Hà Nội hay từ Paris. Một CDN đưa cho người dùng ở Việt Nam một địa chỉ khác với người ở Singapore — cho cùng một cái tên. Và nhiều trang nhỏ "cân bằng tải" bằng cách đặt hai bản ghi A cho một tên. Ba mánh, ba cơ chế rất khác nhau: một IP ở nhiều nơi (anycast), câu trả lời chọn theo người hỏi (GeoDNS), và nhiều IP cho một tên (round robin). Bài này dựng từng cái trong lab, làm hỏng nó, và cho thấy người dùng thật sự trải qua điều gì.</p>

<h3>Anycast: một địa chỉ, hai thành phố</h3>
<p>"DNS công cộng" <code>198.19.1.1</code> của lab chạy trên hai máy: <strong>pop1</strong> ở "Hà Nội" (tại điểm trao đổi, nối với ISP) và <strong>pop2</strong> ở "Singapore" (sau router của trung tâm dữ liệu). Cả hai đặt <code>198.19.1.1</code> trên card loopback và cả hai <strong>quảng bá cùng một dải</strong> <code>198.19.1.0/24</code> bằng BGP (bài 2.5). Hỏi nó "anh là bản nào?" (câu hỏi <code>id.server</code> ở lớp CHAOS, như với máy chủ gốc ở bài 3.1) — trước từ laptop ở nhà:</p>
${run('c34-anycast', 'dig @198.19.1.1', 2, D)}
<p>Rồi từ một máy trong trung tâm dữ liệu:</p>
${run('c34-anycast-dc', 'dig @198.19.1.1', 2, D)}
<p>Cùng địa chỉ, khác máy, khác đường. Không có gì trong DNS quyết định chuyện này: đó là định tuyến bình thường. Router của ISP đơn giản có hai tuyến tới cùng một dải và chọn đường AS ngắn hơn:</p>
${run('c34-bgp', 'vtysh', 1, D)}
<p>Đường <code>64530</code> (pop1, ngay tại điểm trao đổi) thắng <code>64510 64530</code> (qua trung tâm dữ liệu tới pop2). Router trung tâm dữ liệu chọn ngược lại, vì pop2 là láng giềng trực tiếp của nó. Mỗi mạng tới bản sao <em>gần nhất</em> — "gần" theo nghĩa định tuyến, thường cũng là gần theo cây số.</p>

<h3>Khi một điểm ngừng hoạt động</h3>
<p>Một vòng lặp trên laptop hỏi <code>198.19.1.1</code> "anh là ai?" mỗi giây. Lúc 16:22:56 ta cho pop1 ngừng quảng bá dải (bảo trì, hoặc một phép kiểm sức khoẻ phát hiện nó hỏng):</p>
${run('c34-pop1-rut', 'date', 2, D)}
${run('c34-theo-doc', 'cat', 1, D)}
<p>Ngay giây sau, cùng địa chỉ đó được trả lời từ Singapore. Router của ISP mất một trong hai tuyến và dùng tuyến còn lại; laptop không đổi gì — không IP mới, không cấu hình mới, không có TTL nào phải chờ. Đó là lý do mọi resolver công cộng lớn và mọi máy chủ gốc đều dùng anycast: chuyển dự phòng diễn ra với tốc độ của BGP. (Nó đặc biệt hợp với DNS: một câu hỏi UDP nhỏ, một câu trả lời. Một kết nối TCP dài bị chuyển sang điểm khác giữa chừng sẽ đứt, vì điểm mới không biết gì về nó — nên anycast cho dịch vụ TCP như CDN cần các tuyến ổn định; RFC 4786 bàn về điều này.)</p>
${net('anycast', 'anycast', 'vi', 'Hai điểm quảng bá cùng một dải: xem máy nào tới điểm nào, rồi rút một điểm.', { tour: 'anycast-withdraw' })}
<p>Các resolver công cộng thật hoạt động y như vậy: Google ra mắt <code>8.8.8.8</code> ngày 3/12/2009, Cloudflare ra mắt <code>1.1.1.1</code> ngày 1/4/2018. Từ lab của khoá, <code>1.1.1.1</code> trả lời từ một trung tâm dữ liệu ở Hồng Kông:</p>
${run('c34-that', 'dig @1.1.1.1', 1, D)}

<h3>GeoDNS: câu trả lời tuỳ ai hỏi</h3>
<p><code>static.labflow.test</code> là CNAME sang <code>labflow.cdn.test</code> (bài 3.2). Máy chủ tên của CDN trả lời tên đó khác nhau tuỳ <strong>câu hỏi đến từ đâu</strong>, dùng các <em>view</em> của BIND:</p>
${src('../moi-truong/dns/named-cdn.conf', 'text')}
<p>Từ laptop — qua resolver nhà mạng, và qua DNS công cộng (với laptop này là pop1 ở Hà Nội):</p>
${run('c34-geo', 'dig +short static.labflow.test', 3, D)}
<p>Từ một máy trong trung tâm dữ liệu, nơi DNS công cộng gần nhất là pop2 ở Singapore:</p>
${run('c34-geo-dc', 'dig @198.19.1.1', 2, D)}
<p>Cùng tên, hai câu trả lời, hai máy chủ khác nhau — đó là cách CDN và các dịch vụ toàn cầu đưa mỗi người dùng tới một điểm gần chỉ bằng DNS.</p>

<div class="pitfall co-tieu-de">
<p><strong>GeoDNS nhìn resolver, không nhìn người dùng.</strong> Máy chủ tên của CDN không bao giờ nói chuyện với laptop: nó chỉ thấy địa chỉ của <em>resolver</em> đi hỏi. Khi pop1 bị rút ở trên, laptop — vẫn ở Việt Nam — bắt đầu dùng pop2 ở Singapore mà không hề hay biết:</p>
${run('c34-geo-sai', 'dig @198.19.1.1 id', 3, D)}
<p>Người dùng Việt Nam giờ bị đưa tới máy biên Singapore: chậm hơn, vì một lý do họ không nhìn thấy. Chuyện y hệt xảy ra với bất kỳ ai dùng resolver công cộng có điểm gần nhất ở nước khác, hoặc VPN công ty có resolver ở nước ngoài. Phần mở rộng <strong>EDNS Client Subnet</strong> (ECS, RFC 7871) cho resolver gửi một dạng rút gọn của địa chỉ người dùng (ví dụ một /24) tới máy chủ authoritative để nó chọn tốt hơn — đổi lại là quyền riêng tư: 1.1.1.1 của Cloudflare cố ý <em>không</em> gửi ECS. Đó là một lý do các CDN lớn dùng anycast cho cả website, để "gần nhất" do định tuyến quyết định chứ không phải do DNS.</p>
</div>
${net('anycast', 'geodns', 'vi', 'Đổi resolver mà một máy dùng và xem DNS của CDN đưa máy biên nào.', { tour: 'anycast-geodns' })}

<h3>DNS round-robin: nhiều bản ghi A cho một tên</h3>
<p>Kiểu "cân bằng tải" rẻ nhất: cho một tên hai địa chỉ. <code>app.labflow.test</code> của ta nhận hai bản ghi A — nhưng máy <code>.12</code> đã tắt từ tháng trước và chưa ai gỡ bản ghi của nó:</p>
${run('c34-rr-ns', 'printf', 3, D)}
${run('c34-rr', 'for i in 1 2 3 4; do dig', 1, D)}
<p>Resolver đổi thứ tự giữa các câu trả lời. Client thường thử địa chỉ đầu tiên trước — vậy <code>.12</code> đã chết tốn bao nhiêu? Hoàn toàn tuỳ client:</p>
${run('c34-rr', 'for i in 1 2 3 4; do curl', 2, D)}
${run('c34-rr', 'for i in 1 2 3 4; do python3', 2, D)}
<ul>
<li><strong>curl</strong>: thêm khoảng 0,2 s mỗi khi <code>.12</code> đứng đầu. Nó không chờ <code>.12</code> thất bại: nó bắt đầu địa chỉ kế tiếp sau khoảng trễ "Happy Eyeballs" (mặc định 200 ms) — dấu giờ bên dưới cho thấy lần thử thứ hai bắt đầu 0,21 s, rồi 1,0 s sau lần đầu khi đặt khoảng trễ là 1000 ms.</li>
<li><code>socket.create_connection</code> của <strong>Python</strong> thử các địa chỉ lần lượt và chờ từng cái thất bại: 2,8 và 3,1 s, thời gian router trung tâm dữ liệu cần để bỏ cuộc tìm <code>.12</code> và trả lời "No route to host". Nếu một tường lửa lặng lẽ bỏ gói thì nó sẽ chờ trọn connect timeout — hàng chục giây.</li>
<li><strong>Node</strong> (với <code>autoSelectFamily</code>, mặc định bật từ Node 20) thử mỗi địa chỉ tối đa 250 ms: kết nối được sau 264 ms.</li>
</ul>
${run('c34-rr-thu', 'curl', 3, D)}

<div class="pitfall co-tieu-de">
<p><strong>DNS round-robin không phải bộ cân bằng tải.</strong> DNS không kiểm <code>.12</code> còn sống hay không — bản ghi chết nằm trong mọi câu trả lời cho tới khi có người gỡ, rồi thêm một TTL nữa trong mọi cache. Việc chia không đều (một resolver lớn của công ty đưa cùng một thứ tự cho hàng nghìn người), và cái giá của một máy chết tuỳ vào code của từng client. Chỉ dùng nó với DNS có kiểm tra sức khoẻ của nhà cung cấp, hoặc đặt một bộ cân bằng tải thật (Chương 10) sau một địa chỉ duy nhất.</p>
</div>
${net('anycast', 'roundrobin', 'vi', 'Hai bản ghi A, một máy chết: so curl, Python và Node trả giá thế nào.')}

<h3>Đám mây cam: proxy của Cloudflare nhìn từ DNS</h3>
<p>Trên Cloudflare, mỗi bản ghi có một công tắc: <em>DNS only</em> (đám mây xám) hoặc <em>Proxied</em> (đám mây cam). Proxied nghĩa là DNS của Cloudflare trả về <strong>địa chỉ anycast của chính Cloudflare</strong> thay cho địa chỉ của bạn, và lưu lượng đi qua máy biên của họ. Trang này có cả hai loại — ta kiểm xem ai sở hữu từng địa chỉ bằng dịch vụ DNS tra IP ra ASN của Team Cymru:</p>
${run('c34-that', 'dig +short cuongthai.com', 6, D)}
<ul>
<li><code>cuongthai.com</code> → <code>160.187.1.208</code>, trong một mạng của AS152992 đăng ký ở Việt Nam: chính là VPS (đám mây xám). Máy chủ web của nó trả lời trực tiếp: <code>server: nginx/1.27.5</code>.</li>
<li><code>media.cuongthai.com</code> (CDN ảnh, phục vụ từ R2) → hai địa chỉ của AS13335, <strong>Cloudflare</strong> — cùng những địa chỉ đó được quảng bá từ hàng trăm thành phố. Câu trả lời ghi <code>server: cloudflare</code>, và header <code>cf-ray</code> kết thúc bằng <code>HKG</code>: máy biên ở Hồng Kông đã xử lý request này.</li>
<li>Hệ quả cho lập trình viên: bật proxy thì <code>dig</code> không còn cho thấy IP máy chủ của bạn (tốt cho việc giấu máy gốc), IP mà app của bạn thấy là của Cloudflare trừ khi đọc <code>CF-Connecting-IP</code> (Chương 7), và các giới hạn như request bị cắt sau khoảng 100 giây sẽ áp dụng (Chương 8).</li>
</ul>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li><strong>Anycast</strong> chỉ là định tuyến: cùng một dải /24 trong bảng BGP của nhiều router, mỗi router cài đường tốt nhất vào bảng của nhân (bài 2.2). Các máy PoP chỉ cần đặt địa chỉ trên card loopback.</li>
<li><strong>GeoDNS</strong> là một phép tra trong máy chủ authoritative: với mỗi câu hỏi, BIND so địa chỉ nguồn với ACL của từng view rồi trả lời từ bản vùng của view đó.</li>
<li><strong>Round robin</strong> là resolver (ở đây Unbound, <code>rrset-roundrobin</code>) xáo thứ tự bản ghi trong mỗi câu trả lời; còn chọn thử địa chỉ nào, chờ bao lâu, là việc của thư viện phía client.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> đội hỗ trợ chuyển tới hai phiếu: "Người dùng ở Hà Nội đôi khi tải ảnh từ Singapore và trang có vẻ chậm", và đội vận hành đề xuất "thêm một máy chủ web thứ hai với một bản ghi A thứ hai — thế là xong cân bằng tải". Trả lời cả hai bằng số đo.</p>
<ol>
<li>Từ <code>nfi-laptop</code> và từ <code>nfi-ns2</code>, chạy <code>dig @198.19.1.1 id.server CH TXT +short</code> và <code>dig @198.19.1.1 +short static.labflow.test</code>. Giải thích hai câu trả lời.</li>
<li>Trên <code>nfi-pop1</code>, rút dải anycast (<code>vtysh -c 'configure terminal' -c 'router bgp 64530' -c 'address-family ipv4 unicast' -c 'no network 198.19.1.0/24'</code>). Lặp lại bước 1 trên laptop. Rồi trên <code>nfi-pop2</code> chạy <code>unbound-control flush labflow.cdn.test</code> và lặp lại một lần nữa. Khôi phục bằng <code>network 198.19.1.0/24</code>.</li>
<li>Thêm <code>app 30 IN A 203.0.113.10</code> và <code>app 30 IN A 203.0.113.12</code> trên ns1 (tăng serial). Từ laptop, bấm giờ 6 lần kết nối bằng curl và bằng Python (lệnh trong bài).</li>
<li>Viết ba câu: mỗi phiếu một câu, và một câu khuyến nghị.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra từ output của chính mình rằng GeoDNS đi theo resolver, rằng chuyển dự phòng anycast đổi câu trả lời mà client không đổi gì, và một địa chỉ round-robin chết tốn bao nhiêu với từng client.</p>
<details><summary>Lời giải</summary>
<p>1) Laptop: <code>pop1.hn</code> và <code>203.0.113.10</code> (máy biên Hà Nội). ns2: <code>pop2.sg</code> và <code>203.0.113.11</code> (máy biên Singapore): DNS của CDN thấy địa chỉ của pop2 và dùng view "sg". 2) Sau khi rút, laptop tới <code>pop2.sg</code>. Nếu pop2 còn cache <code>labflow.cdn.test</code> (TTL 60), câu trả lời có thể giữ nguyên tới một phút; sau khi xoá cache thì là <code>203.0.113.11</code> — người dùng Việt Nam bị đưa sang Singapore vì GeoDNS nhìn resolver. 3) curl: thêm ~0,2 s mỗi khi <code>.12</code> đứng đầu; Python: ~3 s. 4) "Người dùng Hà Nội nhận ảnh từ Singapore khi resolver DNS của họ ở (hoặc bị chuyển sang) Singapore: GeoDNS chọn theo địa chỉ resolver; ECS sẽ giúp nhưng resolver công cộng như 1.1.1.1 không gửi nó." "Bản ghi A thứ hai không phải cân bằng tải: DNS vẫn gửi người dùng tới máy chết, và có client mất 3 s hoặc hơn mỗi lần." "Hãy dùng DNS có kiểm tra sức khoẻ hoặc một bộ cân bằng tải đứng trước cả hai máy."</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['anycast', 'Một dải IP được quảng bá từ nhiều nơi; định tuyến đưa mỗi mạng tới bản gần nhất.'],
    ['unicast', 'Trường hợp bình thường: một địa chỉ, một máy.'],
    ['PoP — point of presence (điểm hiện diện)', 'Một điểm của dịch vụ toàn cầu (một thành phố, một trung tâm dữ liệu).'],
    ['GeoDNS', 'Máy chủ authoritative trả lời khác nhau tuỳ địa chỉ của resolver đi hỏi.'],
    ['EDNS Client Subnet — ECS (RFC 7871)', 'Resolver gửi một phần địa chỉ người dùng tới máy chủ authoritative; 1.1.1.1 không gửi.'],
    ['round-robin DNS', 'Nhiều bản ghi A/AAAA cho một tên, thứ tự xoay vòng; không kiểm tra sức khoẻ.'],
    ['Happy Eyeballs (RFC 8305)', 'Client bắt đầu địa chỉ kế tiếp sau một khoảng trễ ngắn thay vì chờ địa chỉ đầu thất bại.'],
    ['proxied record (bản ghi đi qua proxy)', '“Đám mây cam” của Cloudflare: DNS trả IP anycast của Cloudflare, lưu lượng đi qua máy biên của họ.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Anycast = cùng một dải được quảng bá từ nhiều điểm; BGP chọn điểm gần nhất; rút một điểm thì client của ta chuyển trong khoảng một giây mà không đổi gì.</li>
<li>Resolver công cộng (8.8.8.8 từ 2009, 1.1.1.1 từ 2018) và các máy chủ gốc đều là anycast.</li>
<li>GeoDNS trả lời theo địa chỉ của <em>resolver</em> — người dùng sau một resolver ở xa nhận máy chủ ở xa; ECS giúp được nhưng tốn quyền riêng tư.</li>
<li>DNS round-robin không kiểm tra sức khoẻ: một địa chỉ chết làm curl tốn ~0,2 s, Node ~0,26 s và Python ~3 s mỗi lần kết nối.</li>
<li>Proxy của Cloudflare trả về IP anycast của chính họ (AS13335): <code>media.cuongthai.com</code> đi qua proxy, <code>cuongthai.com</code> trỏ thẳng về VPS.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4786', '📄', 'RFC 4786 — Vận hành dịch vụ anycast', 'Anycast được vận hành ra sao, và giới hạn với TCP sống lâu.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc7871', '📄', 'RFC 7871 — Client Subnet trong câu hỏi DNS', 'ECS: gửi những gì, và cái giá về quyền riêng tư.', 'Mở')}
${L('https://developers.cloudflare.com/1.1.1.1/faq/', '☁️', 'Cloudflare 1.1.1.1 — Hỏi đáp', '“1.1.1.1 không gửi header EDNS Client Subnet.”', 'Mở')}
${L('https://blog.cloudflare.com/announcing-1111/', '☁️', 'Cloudflare — Ra mắt 1.1.1.1 (1/4/2018)', 'Vì sao có một resolver công cộng nhanh, đặt quyền riêng tư lên đầu.', 'Mở')}
${L('https://googleblog.blogspot.com/2009/12/introducing-google-public-dns.html', '🔎', 'Google — Giới thiệu Google Public DNS (3/12/2009)', 'Ngày ra mắt 8.8.8.8.', 'Mở')}
${L('https://developers.cloudflare.com/dns/proxy-status/', '☁️', 'Cloudflare — Trạng thái proxy', 'Bản ghi Proxied (cam) và DNS only (xám).', 'Mở')}
${L('https://curl.se/libcurl/c/CURLOPT_HAPPY_EYEBALLS_TIMEOUT_MS.html', '📄', 'curl — Happy Eyeballs timeout', 'Mặc định 200 ms; curl đi qua danh sách địa chỉ thế nào.', 'Mở')}
${L('https://nodejs.org/api/net.html', '📄', 'Node.js — net: autoSelectFamily', 'Thử từng địa chỉ với autoSelectFamilyAttemptTimeout (250 ms).', 'Mở')}
${L('https://team-cymru.com/community-services/ip-asn-mapping/', '🔎', 'Team Cymru — tra IP ra ASN', 'Dịch vụ DNS dùng để biết ai sở hữu một địa chỉ.', 'Mở')}
</div>
`,
};
