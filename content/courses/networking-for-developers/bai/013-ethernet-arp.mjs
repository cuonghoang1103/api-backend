/**
 * Chương 1 · 1.4 — Ethernet, địa chỉ MAC và ARP (slug khung netdev-1-3-ethernet-arp).
 * Output thật: lab/out/c13-arp, c13-q-in, c13-switch, c13-hop-client, c13-hop-web, c13-stale-* (.out.txt).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-01-4.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '1.4 — Ethernet, MAC addresses and ARP: how a frame finds the next device|||1.4 — Ethernet, địa chỉ MAC và ARP: frame tìm thiết bị kế tiếp ra sao',
  slug: 'netdev-1-3-ethernet-arp',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Địa chỉ MAC đọc thế nào và vì sao chỉ dùng trên một chặng; switch học bảng MAC; ARP bắt trực tiếp; vì sao ARP hỏi MAC của router; MAC bị viết lại qua router còn IP giữ nguyên; lỗi cache ARP cũ khi thay máy và gratuitous ARP.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Ethernet, MAC addresses and ARP: how a frame finds the next device</h2>
<p class="lead">In lesson 1.3 the client's frame was addressed to <code>02:00:0a:0a:01:fe</code> — the router's card. Three questions follow, and each one becomes a real bug in production sooner or later: how does a switch know where to send a frame? How did the client learn the router's MAC address? And what happens when the machine behind an IP address is replaced?</p>

<h3>The MAC address: 48 bits on a network card</h3>
<p>Every network card has a <strong>MAC address</strong> (Media Access Control): 48 bits, written as six bytes in hex. On a card made in a factory, the first three bytes are the manufacturer's code (the <em>OUI</em>) and the last three are unique to the card. Two bits of the first byte are flags:</p>
<ul>
<li><strong>multicast bit</strong> (the lowest bit): 1 = the address names a group. <code>ff:ff:ff:ff:ff:ff</code> — all ones — is <strong>broadcast</strong>: every card on the link.</li>
<li><strong>locally administered bit</strong> (the second-lowest): 1 = chosen by software, not burned in. Docker, virtual machines and modern phones (with "random MAC" for privacy) use these.</li>
</ul>
<p>Our lab's <code>02:00:0a:0a:01:0a</code>: <code>02</code> = <code>0000 0010</code>, locally administered, unicast; the rest we chose to be the IP address in hex so you can read it.</p>

<h3>Ethernet only reaches the next device</h3>
<p>An Ethernet frame travels between cards on the <strong>same link</strong> — the same cable, the same Wi-Fi network, the same switch. That set of devices is called a <em>broadcast domain</em>: a broadcast frame reaches all of them and nothing beyond. To reach another network, the frame is addressed to the <strong>router's</strong> MAC; the router opens it, looks at the IP address, and builds a <em>new</em> frame for the next link.</p>
<p>So every packet carries two kinds of address with two different jobs: the <strong>IP address</strong> says where the packet is going, end to end; the <strong>MAC address</strong> says which card should take this frame right now, for one hop.</p>

<h3>How a switch learns where everyone is</h3>
<p>A switch has many ports and must decide which port a frame leaves from. It learns by watching the <strong>source</strong> MAC of every frame that arrives: "this MAC lives behind this port". Here is the real table of the lab's <code>nfd-lan</code> switch (a Linux bridge inside Docker's VM), read without changing anything:</p>
${run('c13-switch', 'bridge fdb show', 1)}
<p>Three addresses — router, client, client2 — each learned on its own virtual port (<code>veth…</code>). When a frame's destination is in the table, the switch sends it out of that one port; when it is not, or when it is a broadcast, the switch <strong>floods</strong> it out of every port. Entries expire after a few minutes of silence.</p>

<h3>ARP: from an IP address to a MAC address</h3>
<p>Your program only knows IP addresses. Before the kernel can build a frame, it must know the MAC of the next hop. First it asks the routing table <em>who</em> the next hop is:</p>
${run('c13-arp', 'ip route get 10.10.1.11', 2)}
<p>10.10.1.11 is on the client's own link (<code>dev eth0</code>), so the next hop is 10.10.1.11 itself. 10.10.2.10 is on another network, so the next hop is the router (<code>via 10.10.1.254</code>). In both cases the kernel now knows an IP and needs a MAC — and the <strong>Address Resolution Protocol (ARP)</strong> finds it. We empty the client's ARP cache and ping both:</p>
${run('c13-arp', 'ip neigh show', 3)}
${run('c13-arp', 'tcpdump -e -n -r', 1)}
<p>Read the capture in pairs. To reach 10.10.1.11: a broadcast <code>who-has 10.10.1.11 tell 10.10.1.10</code> to <code>ff:ff:ff:ff:ff:ff</code>; client2 answers directly <code>10.10.1.11 is-at 02:00:0a:0a:01:0b</code>; then the ICMP echo goes as a normal unicast frame. To reach 10.10.2.10: the client never asks for 10.10.2.10 — it asks <code>who-has 10.10.1.254</code>, the router. The echo request then goes to the router's MAC with IP destination 10.10.2.10. The last pair is the router doing the same in the other direction: before replying it needs the client's MAC.</p>
${net('arp', 'lan', 'en', 'An empty ARP cache, a broadcast, a switch that learns — step by step, with the real lab addresses.', { tour: 'arp-lan' })}
${net('arp', 'gateway', 'en', 'Pinging another network: watch which IP the client ARPs for.', { tour: 'arp-gateway' })}
<div class="pitfall co-tieu-de">
<p><strong>"Why is every ARP request there twice?"</strong> It is tempting to invent an explanation (a retry? two processes?). Measure instead: capture only the frames <em>arriving</em> at the client (<code>tcpdump -Q in</code>):</p>
${run('c13-q-in', 'tcpdump -e -n -r', 1)}
<p>One copy of our <em>own</em> broadcast arrives back at us — Docker Desktop's virtual bridge reflects it. The second line in the earlier capture was that reflection, not a second request. When a capture looks strange, first ask: in which direction was each packet captured?</p>
</div>
<p>After the pings the cache holds both neighbours:</p>
${run('c13-arp', 'ip neigh show', 1, { lan: 3 })}
<p>Each entry moves through states: <strong>REACHABLE</strong> (confirmed recently) → <strong>STALE</strong> (not confirmed for a while; still used, re-checked on next use) → <strong>DELAY</strong> (traffic is flowing; wait 5 s for a confirmation) → <strong>PROBE</strong> (send unicast ARP probes) → back to REACHABLE, or <strong>FAILED</strong>.</p>

<h3>Through the router: the MAC changes, the IP does not</h3>
<p>We capture one request at the same time on both sides of the router — on the client and on the web server:</p>
${run('c13-hop-client', 'tshark', 1)}
${run('c13-hop-web', 'tshark', 1)}
<p>On the LAN side the frame goes from the client's card to the router's LAN card; on the DMZ side the <em>same request</em> goes from the router's DMZ card to the web server. Both MAC addresses changed. The IP addresses and the ports did not. The TTL went from 64 to 63 (every router lowers it by one, so a looping packet eventually dies) — and because a header field changed, the IP checksum had to be recomputed. TCP and HTTP were never touched.</p>
${net('encap', 'hop', 'en', 'The same packet on both sides of the router: predict which fields change, then reveal.', { tour: 'encap-hop' })}

<h3>The stale ARP cache: "we replaced the server and the network still remembers the old one"</h3>
<p>A real scenario: a machine fails and is replaced by another with the <em>same</em> IP address but a different network card — a new MAC. We simulate it by changing client2's MAC to <code>…:01:bb</code>:</p>
${run('c13-stale-doi', 'ip -br link', 5)}
${run('c13-stale-2', 'ip neigh show', 3)}
<p>The client's cache still says the old MAC, <code>REACHABLE</code>, so it keeps sending frames to a card that no longer exists: three pings, zero replies. The fix is for the new machine to announce itself with a <strong>gratuitous ARP</strong> — an unsolicited "10.10.1.11 is at …:01:bb" sent to everyone:</p>
${run('c13-stale-garp', 'arping', 1)}
${run('c13-stale-3', 'ip neigh show', 2)}
<p>("Received 0 responses" is expected — nobody answers an announcement.) The client updated its cache immediately and the next ping worked. Now the same change <em>without</em> an announcement: client2 silently switches to <code>…:01:cc</code>, and the client pings once per second, printing a line only when something changes:</p>
${run('c13-stale-cho', 'ip neigh show', 2)}
<p>Ping 1 is lost while the entry sits in DELAY; by ping 5 the kernel is PROBEing the old MAC; at ping 8 the entry is FAILED; ping 9 triggers a fresh broadcast, learns <code>…:01:cc</code> and gets a reply. About <strong>nine seconds of lost traffic</strong> caused purely by a cache. That is why failover tools (keepalived, cloud "floating IPs", Kubernetes MetalLB in layer-2 mode) send gratuitous ARP the moment an IP moves.</p>
${net('arp', 'stale', 'en', 'Replace the machine behind an IP and watch the cache go REACHABLE → STALE → DELAY → PROBE → FAILED.')}

<h3>Where this lives in the computer</h3>
<ul>
<li>The <strong>ARP cache</strong> is a table inside the kernel, in RAM (<code>ip neigh</code> reads it). Your program never sees ARP — the kernel resolves the MAC before the first frame of your connection leaves.</li>
<li>ARP frames are built by the kernel and transmitted by the <strong>network chip</strong>, like any other frame.</li>
<li>A switch's <strong>MAC table</strong> lives in the switch; in our lab the switch is a bridge in the kernel of Docker's VM.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-8-2-arp-va-neighbor-discovery', so: '8.2', ten: 'ARP, Neighbor Discovery, and reading a broken LAN', giong: 'ARP requests and replies, the ARP table, broadcast', khac: 'NWC204 uses Cisco Packet Tracer and IOS commands', them: 'a live capture including the reflected broadcast, the switch table of a real Linux bridge, MAC rewriting measured on both sides of a router, and the stale-cache failover bug with real timings' })}
${cauNoi('en', { ...NWC, bai: 'nwc204-6-2-bang-mac-va-cach-switch-chuyen-tiep', so: '6.2', ten: 'The MAC address table and switch forwarding', giong: 'how a switch learns and floods', khac: 'NWC204 reads the table on a Cisco switch', them: 'the same table read on a Linux bridge with bridge fdb' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after a server was replaced at 2 a.m., monitoring shows 10 seconds of failed health checks from the load balancer on the same network. Your lead asks whether that was "the network" or "the app".</p>
<ol>
<li>In <code>nfd-client</code>, flush the ARP cache, start a capture of <code>arp or icmp</code>, ping 10.10.1.11 and 10.10.2.20, and read it with <code>tcpdump -e -n -r</code>. For each ARP request, write which IP it asks for and why.</li>
<li>On <code>nfd-client2</code>, change the MAC (<code>ip link set eth0 down; ip link set eth0 address 02:00:0a:0a:01:dd; ip link set eth0 up</code>) without announcing it. On the client, run the "ping once per second" loop from this lesson and record when replies resume.</li>
<li>Repeat with a new MAC, but this time send <code>arping -U -c 1 -I eth0 10.10.1.11</code> on client2 right after the change. How many pings are lost now?</li>
<li>Write the answer to your lead in three sentences.</li>
</ol>
<p><strong>Done when:</strong> you can show that the gateway case ARPs for 10.10.1.254, that the silent change loses several seconds while the announced change loses none, and you name the fix (gratuitous ARP on failover).</p>
<details><summary>Solution</summary>
<p>Pinging 10.10.2.20 produces <code>who-has 10.10.1.254</code>, never <code>who-has 10.10.2.20</code>: the target is on another network, so only the router's MAC is needed. The silent change loses traffic until the old entry goes DELAY → PROBE → FAILED (about 9 s in our run; it depends on where the entry was in its timers). With a gratuitous ARP the cache is corrected at once and no ping is lost. Answer: "It was the network layer below the app: the replacement had a new MAC and did not announce itself, so neighbours kept sending to the old card until their ARP entries expired. The app was fine. We will make the failover send a gratuitous ARP."</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['MAC address (địa chỉ MAC)', '48-bit address of a network card; valid on one link only.'],
    ['broadcast (gửi cho tất cả)', 'Destination ff:ff:ff:ff:ff:ff — every card on the link receives it.'],
    ['broadcast domain', 'The set of devices a broadcast reaches — one LAN, bounded by routers.'],
    ['switch / MAC table', 'Forwards frames by destination MAC; learns MAC → port from source addresses.'],
    ['ARP', 'Asks "who has this IP?" by broadcast; the owner answers with its MAC.'],
    ['ARP cache / neighbour table (bảng hàng xóm)', 'Kernel table of IP → MAC with states REACHABLE, STALE, DELAY, PROBE, FAILED.'],
    ['next hop (chặng kế)', 'The device the frame is sent to: the target itself if on-link, else the router.'],
    ['gratuitous ARP (ARP tự thông báo)', 'An unsolicited announcement "this IP is at this MAC", used when an IP moves.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>A MAC address names a card and is used one hop at a time; IP addresses stay end to end.</li>
<li>A switch learns MAC → port from source addresses and floods unknown destinations and broadcasts.</li>
<li>ARP turns the next hop's IP into a MAC; for another network the next hop is the router, so you ARP for the router.</li>
<li>Each router rebuilds the frame: new source and destination MAC, same IPs and ports, TTL − 1, new IP checksum.</li>
<li>Replacing the machine behind an IP leaves stale caches; a gratuitous ARP fixes it instantly, otherwise traffic is lost for seconds.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/arp.7.html', '📄', 'man 7 arp', 'Linux neighbour states and the timers behind them.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc826', '📄', 'RFC 826 — An Ethernet Address Resolution Protocol', 'The original ARP, from 1982 — still how it works.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc5227', '📄', 'RFC 5227 — IPv4 Address Conflict Detection', 'ARP probes and announcements (gratuitous ARP).', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Ethernet, địa chỉ MAC và ARP: frame tìm thiết bị kế tiếp ra sao</h2>
<p class="lead">Ở bài 1.3, frame của máy khách được gửi tới <code>02:00:0a:0a:01:fe</code> — card của router. Từ đó nảy ra ba câu hỏi, và câu nào sớm muộn cũng thành một lỗi thật trên production: switch biết gửi frame đi đâu bằng cách nào? Máy khách biết MAC của router từ đâu? Và chuyện gì xảy ra khi máy đứng sau một địa chỉ IP bị thay bằng máy khác?</p>

<h3>Địa chỉ MAC: 48 bit trên một card mạng</h3>
<p>Card mạng nào cũng có một <strong>địa chỉ MAC</strong> (Media Access Control): 48 bit, viết thành sáu byte hex. Với card làm ở nhà máy, ba byte đầu là mã nhà sản xuất (<em>OUI</em>) và ba byte sau là riêng của card. Hai bit của byte đầu là cờ:</p>
<ul>
<li><strong>bit multicast</strong> (bit thấp nhất): 1 = địa chỉ chỉ một nhóm. <code>ff:ff:ff:ff:ff:ff</code> — toàn số một — là <strong>broadcast</strong>: mọi card trên đường truyền.</li>
<li><strong>bit tự quản (locally administered)</strong> (bit thấp thứ hai): 1 = do phần mềm chọn, không đóng sẵn từ nhà máy. Docker, máy ảo và điện thoại đời mới (với "MAC ngẫu nhiên" để bảo vệ riêng tư) dùng loại này.</li>
</ul>
<p><code>02:00:0a:0a:01:0a</code> của lab: <code>02</code> = <code>0000 0010</code>, tự quản, unicast; phần còn lại ta cố ý chọn bằng chính địa chỉ IP viết hex để bạn đọc được.</p>

<h3>Ethernet chỉ tới được thiết bị kế tiếp</h3>
<p>Một frame Ethernet đi giữa các card trên <strong>cùng một đường truyền</strong> — cùng dây cáp, cùng mạng Wi-Fi, cùng switch. Tập thiết bị đó gọi là một <em>miền broadcast (broadcast domain)</em>: một frame broadcast tới được tất cả chúng và không đi xa hơn. Muốn tới mạng khác, frame được gửi tới MAC của <strong>router</strong>; router mở ra, nhìn địa chỉ IP, rồi dựng một frame <em>mới</em> cho đường truyền kế tiếp.</p>
<p>Vì vậy gói nào cũng mang hai loại địa chỉ với hai nhiệm vụ khác nhau: <strong>địa chỉ IP</strong> cho biết gói đang đi đâu, từ đầu tới cuối; <strong>địa chỉ MAC</strong> cho biết card nào nhận frame này ngay lúc này, cho một chặng.</p>

<h3>Switch học xem ai đang ở đâu</h3>
<p>Switch có nhiều cổng và phải quyết định frame đi ra cổng nào. Nó học bằng cách nhìn MAC <strong>nguồn</strong> của mọi frame đi tới: "MAC này sống sau cổng này". Đây là bảng thật của switch <code>nfd-lan</code> trong lab (một bridge Linux bên trong máy ảo Docker), đọc mà không thay đổi gì:</p>
${run('c13-switch', 'bridge fdb show', 1)}
<p>Ba địa chỉ — router, client, client2 — mỗi cái học được trên một cổng ảo riêng (<code>veth…</code>). Khi đích của frame có trong bảng, switch gửi nó ra đúng cổng đó; khi chưa có, hoặc là broadcast, switch <strong>tràn (flood)</strong> nó ra mọi cổng. Các mục hết hạn sau vài phút im lặng.</p>

<h3>ARP: từ địa chỉ IP tới địa chỉ MAC</h3>
<p>Chương trình của bạn chỉ biết địa chỉ IP. Trước khi dựng được frame, nhân phải biết MAC của chặng kế. Đầu tiên nó hỏi bảng định tuyến chặng kế là <em>ai</em>:</p>
${run('c13-arp', 'ip route get 10.10.1.11', 2)}
<p>10.10.1.11 nằm trên chính đường truyền của máy khách (<code>dev eth0</code>), nên chặng kế chính là 10.10.1.11. 10.10.2.10 ở mạng khác, nên chặng kế là router (<code>via 10.10.1.254</code>). Trường hợp nào nhân cũng đang biết một IP và cần một MAC — và <strong>giao thức phân giải địa chỉ (ARP — Address Resolution Protocol)</strong> đi tìm nó. Ta xoá trống cache ARP của máy khách rồi ping cả hai:</p>
${run('c13-arp', 'ip neigh show', 3)}
${run('c13-arp', 'tcpdump -e -n -r', 1)}
<p>Đọc bản bắt theo từng cặp. Để tới 10.10.1.11: một broadcast <code>who-has 10.10.1.11 tell 10.10.1.10</code> gửi tới <code>ff:ff:ff:ff:ff:ff</code>; client2 trả lời thẳng <code>10.10.1.11 is-at 02:00:0a:0a:01:0b</code>; rồi gói ICMP echo đi bằng frame unicast bình thường. Để tới 10.10.2.10: máy khách không bao giờ hỏi 10.10.2.10 — nó hỏi <code>who-has 10.10.1.254</code>, tức router. Gói echo request sau đó gửi tới MAC của router nhưng có IP đích là 10.10.2.10. Cặp cuối là router làm điều tương tự theo chiều ngược lại: trước khi trả lời, nó cần MAC của máy khách.</p>
${net('arp', 'lan', 'vi', 'Cache ARP trống, một broadcast, một switch đang học — từng bước, với đúng địa chỉ của lab.', { tour: 'arp-lan' })}
${net('arp', 'gateway', 'vi', 'Ping sang mạng khác: xem máy khách hỏi ARP cho IP nào.', { tour: 'arp-gateway' })}
<div class="pitfall co-tieu-de">
<p><strong>"Sao request ARP nào cũng xuất hiện hai lần?"</strong> Rất dễ bịa ra một lời giải thích (thử lại? hai tiến trình?). Hãy đo: chỉ bắt các frame <em>đi tới</em> máy khách (<code>tcpdump -Q in</code>):</p>
${run('c13-q-in', 'tcpdump -e -n -r', 1)}
<p>Một bản sao broadcast của <em>chính ta</em> quay về lại với ta — bridge ảo của Docker Desktop phản hồi nó. Dòng thứ hai trong bản bắt lúc nãy là bản phản hồi đó, không phải một request thứ hai. Khi bản bắt trông lạ, hãy hỏi trước: mỗi gói được bắt theo chiều nào?</p>
</div>
<p>Sau hai lần ping, cache giữ cả hai hàng xóm:</p>
${run('c13-arp', 'ip neigh show', 1, { lan: 3 })}
<p>Mỗi mục đi qua các trạng thái: <strong>REACHABLE</strong> (mới được xác nhận) → <strong>STALE</strong> (lâu chưa xác nhận; vẫn dùng, lần dùng sau sẽ kiểm lại) → <strong>DELAY</strong> (đang có lưu lượng; chờ 5 giây xem có xác nhận) → <strong>PROBE</strong> (gửi các gói thăm dò ARP unicast) → quay về REACHABLE, hoặc <strong>FAILED</strong>.</p>

<h3>Qua router: MAC đổi, IP giữ nguyên</h3>
<p>Ta bắt một request cùng lúc ở hai phía router — trên máy khách và trên máy chủ web:</p>
${run('c13-hop-client', 'tshark', 1)}
${run('c13-hop-web', 'tshark', 1)}
<p>Ở phía LAN, frame đi từ card của máy khách tới card LAN của router; ở phía DMZ, <em>cùng request đó</em> đi từ card DMZ của router tới máy chủ web. Cả hai địa chỉ MAC đã đổi. Địa chỉ IP và cổng thì không. TTL giảm từ 64 xuống 63 (mỗi router trừ đi một, để gói bị lặp vòng cuối cùng sẽ chết) — và vì một trường trong header đã đổi, checksum IP phải tính lại. TCP và HTTP không hề bị đụng tới.</p>
${net('encap', 'hop', 'vi', 'Cùng một gói ở hai phía router: đoán trường nào đổi, rồi lật ra xem.', { tour: 'encap-hop' })}

<h3>Cache ARP cũ: "thay máy chủ rồi mà mạng vẫn nhớ máy cũ"</h3>
<p>Một tình huống thật: một máy hỏng và được thay bằng máy khác cùng địa chỉ IP nhưng khác card mạng — MAC mới. Ta giả lập bằng cách đổi MAC của client2 thành <code>…:01:bb</code>:</p>
${run('c13-stale-doi', 'ip -br link', 5)}
${run('c13-stale-2', 'ip neigh show', 3)}
<p>Cache của máy khách vẫn ghi MAC cũ, <code>REACHABLE</code>, nên nó cứ gửi frame tới một card không còn tồn tại: ba ping, không một trả lời. Cách sửa là máy mới tự thông báo bằng <strong>gratuitous ARP</strong> — một lời "10.10.1.11 ở …:01:bb" gửi cho tất cả mà không ai hỏi:</p>
${run('c13-stale-garp', 'arping', 1)}
${run('c13-stale-3', 'ip neigh show', 2)}
<p>("Received 0 responses" là đúng — chẳng ai trả lời một lời thông báo.) Máy khách cập nhật cache ngay và ping kế tiếp chạy. Giờ cùng thay đổi đó <em>không</em> thông báo: client2 lặng lẽ chuyển sang <code>…:01:cc</code>, và máy khách ping mỗi giây một lần, chỉ in một dòng khi có gì thay đổi:</p>
${run('c13-stale-cho', 'ip neigh show', 2)}
<p>Ping 1 mất trong lúc mục ARP ở DELAY; tới ping 5 nhân đang PROBE MAC cũ; ở ping 8 mục thành FAILED; ping 9 kích một broadcast mới, học được <code>…:01:cc</code> và có trả lời. Khoảng <strong>chín giây mất lưu lượng</strong> chỉ vì một bộ nhớ đệm. Vì thế các công cụ chuyển dự phòng (keepalived, "IP nổi" trên đám mây, MetalLB của Kubernetes ở chế độ tầng 2) gửi gratuitous ARP ngay khi một IP chuyển chỗ.</p>
${net('arp', 'stale', 'vi', 'Thay máy đứng sau một IP và xem cache đi REACHABLE → STALE → DELAY → PROBE → FAILED.')}

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li><strong>Cache ARP</strong> là một bảng trong nhân, nằm trong RAM (<code>ip neigh</code> đọc nó). Chương trình của bạn không bao giờ thấy ARP — nhân phân giải MAC xong trước khi frame đầu tiên của kết nối rời máy.</li>
<li>Frame ARP do nhân dựng và do <strong>chip mạng</strong> phát đi, như mọi frame khác.</li>
<li><strong>Bảng MAC</strong> của switch nằm trong switch; ở lab, switch là một bridge trong nhân của máy ảo Docker.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-8-2-arp-va-neighbor-discovery', so: '8.2', ten: 'ARP, Neighbor Discovery, và đọc một mạng LAN bị hỏng', giong: 'request và reply ARP, bảng ARP, broadcast', khac: 'NWC204 dùng Cisco Packet Tracer và lệnh IOS', them: 'bắt gói trực tiếp kể cả broadcast bị phản hồi, bảng switch của một bridge Linux thật, việc MAC bị viết lại đo ở hai phía router, và lỗi cache cũ khi chuyển dự phòng với thời gian đo thật' })}
${cauNoi('vi', { ...NWC, bai: 'nwc204-6-2-bang-mac-va-cach-switch-chuyen-tiep', so: '6.2', ten: 'Bảng địa chỉ MAC và cách switch chuyển tiếp', giong: 'switch học và tràn frame ra sao', khac: 'NWC204 đọc bảng trên switch Cisco', them: 'cùng bảng đó đọc trên một bridge Linux bằng bridge fdb' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau khi thay một máy chủ lúc 2 giờ sáng, hệ thống giám sát ghi 10 giây kiểm tra sức khoẻ thất bại từ bộ cân bằng tải cùng mạng. Trưởng nhóm hỏi đó là lỗi "mạng" hay lỗi "ứng dụng".</p>
<ol>
<li>Trên <code>nfd-client</code>, xoá cache ARP, bắt gói <code>arp or icmp</code>, ping 10.10.1.11 và 10.10.2.20, rồi đọc bằng <code>tcpdump -e -n -r</code>. Với mỗi request ARP, ghi nó hỏi cho IP nào và vì sao.</li>
<li>Trên <code>nfd-client2</code>, đổi MAC (<code>ip link set eth0 down; ip link set eth0 address 02:00:0a:0a:01:dd; ip link set eth0 up</code>) mà không thông báo. Trên máy khách, chạy vòng lặp "ping mỗi giây" của bài này và ghi lại lúc nào có trả lời trở lại.</li>
<li>Làm lại với một MAC mới, nhưng lần này chạy <code>arping -U -c 1 -I eth0 10.10.1.11</code> trên client2 ngay sau khi đổi. Giờ mất bao nhiêu ping?</li>
<li>Viết câu trả lời cho trưởng nhóm trong ba câu.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được trường hợp đi qua cổng mặc định thì ARP hỏi 10.10.1.254, đổi lặng lẽ thì mất vài giây còn có thông báo thì không mất gì, và bạn nêu được cách sửa (gratuitous ARP khi chuyển dự phòng).</p>
<details><summary>Lời giải</summary>
<p>Ping 10.10.2.20 sinh ra <code>who-has 10.10.1.254</code>, không bao giờ <code>who-has 10.10.2.20</code>: đích ở mạng khác, nên chỉ cần MAC của router. Đổi lặng lẽ thì mất lưu lượng cho tới khi mục cũ đi DELAY → PROBE → FAILED (khoảng 9 giây trong lần chạy của ta; tuỳ mục đó đang ở đâu trong các bộ hẹn giờ). Có gratuitous ARP thì cache được sửa ngay và không mất ping nào. Trả lời: "Lỗi ở tầng mạng bên dưới ứng dụng: máy thay thế có MAC mới và không tự thông báo, nên các máy hàng xóm cứ gửi tới card cũ cho tới khi mục ARP hết hạn. Ứng dụng không sao. Ta sẽ cho quy trình chuyển dự phòng gửi gratuitous ARP."</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['MAC address (địa chỉ MAC)', 'Địa chỉ 48 bit của card mạng; chỉ có giá trị trên một đường truyền.'],
    ['broadcast (gửi cho tất cả)', 'Đích ff:ff:ff:ff:ff:ff — mọi card trên đường truyền đều nhận.'],
    ['broadcast domain (miền broadcast)', 'Tập thiết bị mà một broadcast tới được — một mạng LAN, giới hạn bởi router.'],
    ['switch / MAC table (bảng MAC)', 'Chuyển frame theo MAC đích; học MAC → cổng từ địa chỉ nguồn.'],
    ['ARP', 'Hỏi "ai giữ IP này?" bằng broadcast; chủ nhân trả lời bằng MAC của mình.'],
    ['ARP cache / neighbour table (bảng hàng xóm)', 'Bảng IP → MAC trong nhân, với các trạng thái REACHABLE, STALE, DELAY, PROBE, FAILED.'],
    ['next hop (chặng kế)', 'Thiết bị frame được gửi tới: chính đích nếu cùng đường truyền, ngược lại là router.'],
    ['gratuitous ARP (ARP tự thông báo)', 'Lời thông báo "IP này ở MAC này" không ai hỏi, dùng khi một IP chuyển chỗ.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Địa chỉ MAC đặt tên một card và được dùng từng chặng; địa chỉ IP giữ nguyên từ đầu tới cuối.</li>
<li>Switch học MAC → cổng từ địa chỉ nguồn và tràn frame có đích lạ hoặc broadcast.</li>
<li>ARP đổi IP của chặng kế thành MAC; với mạng khác chặng kế là router, nên bạn hỏi ARP cho router.</li>
<li>Mỗi router dựng lại frame: MAC nguồn và đích mới, IP và cổng giữ nguyên, TTL − 1, checksum IP mới.</li>
<li>Thay máy đứng sau một IP để lại cache cũ; gratuitous ARP sửa ngay, không thì lưu lượng mất trong vài giây.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/arp.7.html', '📄', 'man 7 arp', 'Các trạng thái hàng xóm của Linux và bộ hẹn giờ phía sau.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc826', '📄', 'RFC 826 — Giao thức phân giải địa chỉ Ethernet', 'ARP gốc từ năm 1982 — đến giờ vẫn chạy y như vậy.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc5227', '📄', 'RFC 5227 — Phát hiện xung đột địa chỉ IPv4', 'Thăm dò và thông báo ARP (gratuitous ARP).', 'Mở')}
</div>
`,
};
