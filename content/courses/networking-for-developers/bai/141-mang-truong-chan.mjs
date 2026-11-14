/**
 * Chương 14 · 14.2 — Mạng trường chặn những gì và chặn bằng cách nào (soạn 14/11/2026 từ câu hỏi THẬT của chủ kênh: "mạng trường chặn
 * một số trang; phát Wi-Fi từ laptop sang điện thoại không vào được; điện thoại không vào được game").
 * Output thật: lab/out/c142-* ("Wi-Fi trường trong một hộp", moi-truong/truong.yml — bash code/dung-output-ch14.sh, chạy SAU phần 14.1).
 * Bẫy đo được khi soạn: luật TTL đặt ở FORWARD thì nhân đã trừ TTL 1 ⇒ bắt nhầm laptop — phải ở mangle PREROUTING.
 */
import { run, card, kv } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-14-2.mjs';

const L = card;
const R = (f, p, n = 1, o = {}) => run(f, p, n, { drop: /^# /, ...o });
const bai = (slug) => `/courses/networking-for-developers/learn?lessonSlug=${slug}`;

export default {
  title: '14.2 — What the school network blocks, and how: DNS, SNI, ports, UDP and the hotspot TTL|||14.2 — Mạng trường chặn những gì và chặn bằng cách nào: DNS, SNI, cổng, UDP và TTL của điểm phát',
  slug: 'netdev-14-2-mang-truong-chan',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba câu hỏi thật — trang web bị chặn, phát Wi-Fi từ laptop sang điện thoại không vào được, điện thoại không chơi được game — và cơ chế đứng sau: lọc DNS, chặn theo SNI của TLS, chặn IP/cổng, chặn UDP, phát hiện chia sẻ mạng bằng TTL. Mỗi cơ chế bật từng cái trên lab "Wi-Fi trường trong một hộp", đo lỗi nó sinh ra, bảng "triệu chứng → cơ chế → lệnh kiểm", và cách vẫn làm việc được trong mạng bị chặn.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>What the school network blocks, and how: DNS, SNI, ports, UDP and the hotspot TTL</h2>
<p class="lead">Three questions every student asks sooner or later: "why does this site not open at school?", "I turned on my laptop's hotspot — why does my phone get nothing?", and "why don't my phone games work on school Wi-Fi?". The network is not one wall. It is a row of different checkpoints, each with its own trick and its own error message. Learn the tricks and you can read which checkpoint stopped you from the error alone — and then decide what to do.</p>

<h3>Five checkpoints, in everyday words</h3>
<div class="table-wrap"><table>
<tr><th>Checkpoint</th><th>Like…</th><th>What it looks at</th></tr>
<tr><td>Device registration (lesson 14.1)</td><td>the dorm guard who checks your bike's chassis number</td><td>source MAC</td></tr>
<tr><td>DNS filter</td><td>a phone book with some names crossed out</td><td>the name you ask the school's DNS for</td></tr>
<tr><td>SNI filter</td><td>a postman reading the recipient's name on the envelope — the letter inside stays sealed</td><td>the site name in the TLS ClientHello</td></tr>
<tr><td>IP / port / protocol filter</td><td>a building that opens only doors 80, 443, 587 and 993, and has a blacklist of street numbers</td><td>destination IP, port, TCP or UDP</td></tr>
<tr><td>Sharing (tethering) detection</td><td>the guard noticing one card brings in a whole group</td><td>TTL and other fingerprints</td></tr>
</table></div>
<p>We switch them on one at a time on the lab's controller and measure what a student's laptop sees. First, the baseline — nothing blocked:</p>
${R('c142-truoc', 'dig +short', 6)}
<p>Every name resolves, the web works, SSH answers on port 22, and two UDP services answer: a game server and a VPN.</p>

<h3>1 — DNS filtering: the crossed-out phone book</h3>
<p>Your laptop takes its DNS server from DHCP (lesson 14.1) — the school's. So the cheapest way to block a site is to make that DNS lie. Two flavours:</p>
${R('c142-dns-gw', 'printf', 2)}
${R('c142-dns', 'dig phim.test', 3)}
<p><code>phim.test</code> gets <strong>NXDOMAIN</strong> ("no such name") so the browser says the site does not exist (Chrome: <code>DNS_PROBE_FINISHED_NXDOMAIN</code>). <code>cado.test</code> resolves to the school's own block page. Now the weakness — the block is only in the phone book, not on the road:</p>
${R('c142-dns', 'dig @198.18.0.53', 2)}
<p>Ask another DNS server (here the lab's "public DNS" 198.18.0.53, like 1.1.1.1 or 8.8.8.8), or give the IP yourself, and the site opens. So networks that care add a firewall rule: no DNS leaves except through the school's server.</p>
${R('c142-dns53', 'dig @198.18.0.53', 1)}
<p>Plain DNS on port 53 is now dead. DNS over HTTPS (DoH, lesson 3.5) still looks like ordinary HTTPS on port 443 — which is why some networks block well-known DoH servers by name or IP, and why a browser's "secure DNS" can make a DNS block disappear.</p>

<h3>2 — SNI filtering: the postman reads the envelope</h3>
<p>HTTPS encrypts the page, the URL path, the cookies. But the very first message, the TLS <strong>ClientHello</strong>, carries the site name in clear — the <strong>SNI</strong> (Server Name Indication, RFC 6066) — because one IP often hosts many sites and the server must know which certificate to send (lesson 6.2). A firewall can read it. In the lab, one rule: any packet to port 443 that contains the bytes <code>social.test</code> is cut with a TCP reset.</p>
${R('c142-sni-gw', 'iptables', 1)}
${R('c142-sni', 'dig +short', 4)}
<p>The proof that this is blocking by <em>name</em>: <code>news.test</code> and <code>social.test</code> have <strong>the same IP</strong>; one passes, the other is reset instantly (<code>curl: (35)</code>, in Chrome <code>ERR_CONNECTION_RESET</code>). Plain HTTP to the same site still works because our rule only watches port 443 — real filters read the HTTP <code>Host:</code> header too. What the firewall saw:</p>
${R('c142-sni-doc', 'tshark', 2)}
<p>The page content stays secret; the <strong>name of every site you visit</strong> does not. A newer TLS extension, <strong>ECH</strong> (Encrypted Client Hello, RFC 9849), encrypts the name as well; networks that filter by SNI often respond by blocking ECH or the services that offer it.</p>
${net('block', 'web', 'en', 'Switch each school rule on and off and watch where a request dies: DNS, SNI, or the port.', { tour: 'block-web' })}

<h3>3 — IP, port and UDP: why games and VPNs die</h3>
<p>The bluntest tools: drop everything to a listed IP; open only the TCP ports for web and mail (80, 443, 587, 993); drop all UDP.</p>
${R('c142-cong-gw', 'iptables', 3)}
${R('c142-cong', 'time nc', 5)}
<p>Read the symptoms, they are the fingerprints:</p>
<ul>
<li><strong>Hangs, then times out</strong> (exactly the 3 s we allowed): a <code>DROP</code> — the packet vanished. The VPN server's IP and SSH on port 22 die like this.</li>
<li><strong>SSH on port 993 still answers</strong> — the same server, a port the school must keep open for email. That is why developers often run SSH on 993 or 443 as well (lesson 14.3).</li>
<li><strong>UDP: silence</strong>. <code>nc -u</code> sends and gets nothing back, exit code 0 — UDP has no handshake, so nothing ever tells you "blocked" (lesson 5.1). The game server that answered <code>pong</code> before is gone, while HTTPS to the same host works.</li>
</ul>
<p>Mobile games use UDP for the match itself (a lost bullet is better than a late one) and often fixed ports, and many use peer-to-peer connections that need a friendly NAT. A network that allows only TCP 80/443 kills the game while the shop page of the same game still loads. The same thing happens to QUIC/HTTP-3 — browsers then quietly fall back to TCP (lesson 5.3) — and to WireGuard VPNs, which are UDP. Some networks do not block but <strong>slow down</strong> (QoS/bandwidth limits per category): the game connects but lags.</p>
<p>Commercial filters add <strong>categories</strong> ("games", "social", "streaming"): a vendor database of domains and IPs that the school ticks. Underneath, they still act through DNS, SNI or IP — the same three mechanisms you just saw.</p>

<h3>4 — The hotspot: why your phone gets nothing</h3>
<p>The Windows laptop turns on Mobile Hotspot: it creates a small network for the phone (192.168.137.0/24, the range Windows uses for this) and NATs it out through its school Wi-Fi card — exactly lesson 2.3's home router.</p>
${R('c142-ttl-win', 'ip -br addr show hs', 3)}
${R('c142-ttl-phone', 'ip -br addr show wlan0', 2)}
<p>It works — and the registration check from 14.1 cannot see the phone: after NAT, all its packets carry the laptop's IP and MAC. So how can a network notice? On the controller we captured the two SYN packets — one from the laptop itself, one from the phone:</p>
${R('c142-ttl-gw', 'tshark', 2)}
<p>Same MAC, same IP, but <strong>TTL 64 and TTL 63</strong>. Every router lowers TTL by one (lesson 2.2) — and the laptop is now a router for the phone. Operating systems start from known values (Linux, Android, iOS, macOS: 64; Windows: 128), so a 63 or 127 coming from a single "device" means something is behind it. The TCP timestamps (last column) are also wildly different — two different clocks, two different machines. Other clues networks use: many devices' worth of connections, browsers of two operating systems (User-Agent) from one MAC. The rule, and the result:</p>
${R('c142-ttl-gw', 'iptables -t mangle', 2)}
${R('c142-ttl-sau-phone', 'curl', 1)}
${R('c142-ttl-sau-win', 'curl', 1)}
<p>The phone is dead — even its DNS question never gets an answer ("Resolving timed out"), because the rule drops every packet with TTL 63 — while the laptop is untouched. Note that Windows itself starts at 128, so a phone behind a <em>Windows</em> hotspot often arrives with 63 while the laptop arrives with 128; either way the numbers do not match one device.</p>
<div class="pitfall co-tieu-de"><p><strong>The rule that blocked the wrong machine.</strong> Our first version put the TTL rule in the <code>FORWARD</code> chain — and it blocked the <em>laptop</em> and let the phone through. By the time a packet reaches <code>FORWARD</code>, the controller has already lowered its TTL by one (64 → 63, 63 → 62). Rules about the TTL a packet <em>arrived</em> with must be in <code>PREROUTING</code> (here <code>-t mangle</code>). Measure your filter with both cases before you trust it.</p></div>
${net('block', 'hotspot', 'en', 'Laptop + phone behind its hotspot: compare the TTL the controller sees, then switch on the TTL rule.', { tour: 'block-hotspot' })}
<p>Two more reasons a hotspot fails that are not blocking at all: many Wi-Fi cards cannot join one network and broadcast another at the same time, and Apple's guide to Internet Sharing describes sharing a <em>wired</em> connection over Wi-Fi. And remember 14.1: if your account is tied to the laptop's MAC, the phone does not need its own registration — the TTL is what gives it away.</p>

<h3>All the counters at the end</h3>
${R('c142-dem', 'iptables -L CHAN', 2)}
<p>Each rule counts the packets it stopped. A real school firewall has thousands of such lines, often managed by a vendor's category list — but each one is still one of the few kinds above.</p>

<h3>Symptom → mechanism → the command that proves it</h3>
<div class="table-wrap"><table>
<tr><th>What you see</th><th>Likely mechanism</th><th>Check</th></tr>
<tr><td>"Site can't be reached", <code>NXDOMAIN</code></td><td>DNS filter</td><td><code>dig name</code> vs <code>dig @1.1.1.1 name</code> (or another DNS)</td></tr>
<tr><td>A page with the school's logo "blocked"</td><td>DNS redirect or HTTP interception</td><td><code>dig +short name</code> → an IP of the school</td></tr>
<tr><td><code>ERR_CONNECTION_RESET</code> immediately on HTTPS</td><td>SNI filter</td><td><code>curl -v https://name</code> resets right after the ClientHello; another site on the same IP works</td></tr>
<tr><td>Hangs until timeout</td><td>IP or port DROP</td><td><code>nc -vz -w 3 host port</code>; try port 443 on the same host</td></tr>
<tr><td>Game/voice fails, web is fine; works on 4G</td><td>UDP blocked or throttled</td><td><code>nc -u</code> gets no answer; app shows "strict NAT"</td></tr>
<tr><td>Laptop OK, phone via hotspot not</td><td>tethering detection (TTL), or the card cannot share</td><td>compare the same request from both</td></tr>
<tr><td>"Connected, no Internet" for everything</td><td>not blocking — registration/portal (14.1)</td><td>the 14.1 checklist</td></tr>
</table></div>

<h3>🕵️ The attacker's corner</h3>
<ul>
<li><strong>The same tricks, used against you.</strong> A rogue Wi-Fi (evil twin, 14.1) can run the DNS: instead of a block page it answers your bank's name with a phishing site. Defences: HTTPS with a valid certificate, DNSSEC-validating or DoH resolvers (lesson 3.5).</li>
<li><strong>SNI is a diary.</strong> Whoever runs the network — school, café, an attacker in the middle — can log the name of every HTTPS site you visit without breaking any encryption. Assume a shared network knows where you go.</li>
<li><strong>"Free VPN" apps.</strong> A VPN sees all your traffic instead of the school. Some free ones sell it or bundle malware. Use a VPN you control or a reputable one (14.4).</li>
<li><strong>Fake block pages.</strong> A "this site is blocked, log in again to continue" page on a non-school domain is a password trap.</li>
</ul>

<h3>Working in a blocked network (preview of 14.3–14.4)</h3>
<p>Developers need git, SSH, Docker pulls and deploys even on restricted Wi-Fi — teachers often show students exactly these tools:</p>
<ul>
<li><strong>SSH on an allowed port.</strong> Run sshd on 443 or 993 on your server — the lab showed 993 passing while 22 dies. Lesson 14.3 (SSH tunnels, <code>-L/-R/-D</code>, ProxyJump) builds on this.</li>
<li><strong>A VPN that looks like HTTPS.</strong> WireGuard (UDP) dies on a TCP-only network; VPNs that fall back to TCP 443 usually pass, unless their server IPs are blacklisted (the lab's vpn.test). Lesson 14.4.</li>
<li><strong>DNS over HTTPS</strong> beats DNS-only filters.</li>
<li>Where a rule explicitly forbids it, follow the rule.</li>
</ul>

<h3>"What if…"</h3>
<ul>
<li><strong>…a site works on 4G but not on Wi-Fi?</strong> The Wi-Fi's policy, not the site. Run the table above.</li>
<li><strong>…everything HTTPS resets?</strong> Maybe a "TLS inspection" proxy that requires installing the school's certificate — that one can read your HTTPS. Know when a certificate is not the site's own (lesson 6.4).</li>
<li><strong>…you use a VPN?</strong> The school sees one encrypted flow to one IP: it can block that IP (or the VPN's protocol), but not see inside.</li>
</ul>

<h3>Where this lives in the computer</h3>
<ul>
<li>Filter rules and the connection table live in the RAM of the controller/firewall; string matching (SNI, Host) costs CPU per packet, which is why big filters use dedicated hardware.</li>
<li>Your laptop's DNS settings come from DHCP; a browser's "secure DNS" bypasses them inside the browser process.</li>
<li>TTL is one byte in every IP header, set by the sender's kernel and lowered by every router.</li>
</ul>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> in the lab (<code>GIU_LAB=1 bash lab/code/dung-output-ch14.sh</code>), the school has switched on all its rules. A classmate says "the network is broken".</p>
<ol>
<li>From <code>nft-win</code>, try <code>phim.test</code>, <code>cado.test</code>, <code>https://social.test</code>, <code>vpn.test:443</code>, <code>game.test</code> UDP 27015 and SSH on 22 and 993.</li>
<li>For each, write the exact symptom (error code, time) and name the mechanism without looking at the rules.</li>
<li>Check your answers with <code>iptables -L CHAN -v -n</code> and <code>iptables -t mangle -L PREROUTING -v -n</code> on <code>nft-gw</code>: which counters went up?</li>
<li>On your real laptop at school, run the same checks for one blocked site.</li>
</ol>
<p><strong>Done when:</strong> each of the six tests is matched to DNS / SNI / IP / port / UDP with the counter that proves it.</p>
<details><summary>Solution</summary><p>phim.test: <code>Could not resolve host</code> → DNS NXDOMAIN. cado.test: the school's page → DNS redirect. social.test over HTTPS: <code>curl: (35) … reset</code> → SNI (same IP as news.test which works). vpn.test:443: timeout → IP blacklist. UDP 27015: silence → UDP dropped. Port 22: timeout, 993: SSH banner → port allow-list. The counters of rules 1/3/4/5/6 increase accordingly.</p></details>
</div>

<details><summary>🧠 Self-check (5 questions)</summary>
<ol>
<li>A site gives NXDOMAIN at school, but <code>dig @1.1.1.1</code> returns an IP. Mechanism? — <em>DNS filter.</em></li>
<li>Two sites on the same IP: one opens, the other resets immediately over HTTPS. — <em>SNI filter.</em></li>
<li>Why does <code>nc -u</code> not say "blocked"? — <em>UDP has no handshake; a dropped datagram just never gets a reply.</em></li>
<li>Why does a phone behind a laptop hotspot arrive with TTL 63? — <em>The laptop routes (NATs) its packets and lowers TTL by 1.</em></li>
<li>Why must a TTL rule be in PREROUTING, not FORWARD? — <em>By FORWARD the router has already decremented TTL.</em></li>
</ol></details>

<h3>🗂 Key terms</h3>
${kv([
    ['DNS filtering (lọc DNS)', 'The school DNS answers NXDOMAIN or a block-page IP for listed names.'],
    ['NXDOMAIN', 'DNS answer "this name does not exist".'],
    ['SNI (Server Name Indication)', 'The site name sent in clear in the TLS ClientHello; firewalls can read it.'],
    ['ECH (Encrypted Client Hello)', 'TLS extension (RFC 9849) that encrypts the SNI too.'],
    ['DROP vs REJECT', 'DROP = silence then timeout; REJECT = immediate refusal or reset.'],
    ['tethering / hotspot (chia sẻ mạng)', 'A device routes and NATs another device\'s traffic through its own connection.'],
    ['TTL', 'One byte lowered by every router; 63/127 from one device betrays a device behind it.'],
    ['category filter (lọc theo danh mục)', 'A vendor list of domains/IPs by topic, enforced through DNS, SNI or IP.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>"Blocked" is not one thing: DNS, SNI, IP/port, UDP and tethering detection each fail differently.</li>
<li>DNS filters are bypassed by another DNS ⇒ networks also block outside DNS; DoH looks like HTTPS.</li>
<li>HTTPS hides content but not the site name (SNI); ECH hides it too.</li>
<li>TCP-only networks kill games, WireGuard and QUIC (UDP) while the web works.</li>
<li>A hotspot hides the phone's MAC but not its TTL (64 → 63); check filters with both cases.</li>
</ul>
<p>Related lessons: <a href="${bai('netdev-3-5-dns-an-toan')}">3.5 DNSSEC, DoH/DoT</a> · <a href="${bai('netdev-5-3-udp-thuc-te')}">5.3 UDP in practice</a> · <a href="${bai('netdev-6-2-bat-tay-tls')}">6.2 The TLS 1.3 handshake (SNI)</a> · <a href="${bai('netdev-2-3-nat')}">2.3 NAT</a> · <a href="${bai('netdev-10-3-reverse-forward')}">10.3 Tunnels</a> · <a href="${bai('netdev-14-1-wifi-truong-mac')}">14.1 School Wi-Fi and MAC</a>.</p>
${L('https://www.rfc-editor.org/rfc/rfc6066', '📄', 'RFC 6066 — TLS Extensions (section 3: Server Name Indication)', 'Why the site name travels in the ClientHello.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc9849', '📄', 'RFC 9849 — TLS Encrypted Client Hello', 'Encrypting the SNI as well.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8484', '📄', 'RFC 8484 — DNS Queries over HTTPS (DoH)', 'DNS that looks like ordinary HTTPS.', 'Open')}
${L('https://learn.microsoft.com/en-gb/answers/questions/1529841/(solved)-hosted-network-doesnt-remove-the-initial', '💬', 'Microsoft Q&A — Mobile hotspot adapter at 192.168.137.1', 'The address range Windows uses for its hotspot.', 'Open')}
${L('https://support.apple.com/guide/mac-help/share-internet-connection-mac-network-users-mchlp1540/mac', '📄', 'Apple — Share your Mac\'s internet connection', 'Internet Sharing in System Settings.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Mạng trường chặn những gì và chặn bằng cách nào: DNS, SNI, cổng, UDP và TTL của điểm phát</h2>
<p class="lead">Ba câu hỏi sinh viên nào sớm muộn cũng hỏi: "sao trang này ở trường không mở được?", "mình bật điểm phát Wi-Fi trên laptop rồi — sao điện thoại không có mạng?", và "sao game điện thoại không chơi được trên Wi-Fi trường?". Mạng không phải một bức tường. Nó là một dãy trạm kiểm soát khác nhau, mỗi trạm một mánh và một kiểu báo lỗi riêng. Học các mánh đó thì chỉ nhìn thông báo lỗi là bạn biết trạm nào đã chặn mình — rồi mới quyết định làm gì.</p>

<h3>Năm trạm kiểm soát, nói bằng lời đời thường</h3>
<div class="table-wrap"><table>
<tr><th>Trạm</th><th>Giống như…</th><th>Nó nhìn vào đâu</th></tr>
<tr><td>Đăng ký thiết bị (bài 14.1)</td><td>bác bảo vệ ký túc xá kiểm số khung xe của bạn</td><td>MAC nguồn</td></tr>
<tr><td>Lọc DNS</td><td>một cuốn danh bạ bị gạch tên vài người</td><td>cái tên bạn hỏi DNS của trường</td></tr>
<tr><td>Lọc SNI</td><td>người đưa thư đọc tên người nhận ngoài phong bì — lá thư bên trong vẫn dán kín</td><td>tên trang trong ClientHello của TLS</td></tr>
<tr><td>Lọc IP / cổng / giao thức</td><td>toà nhà chỉ mở cửa số 80, 443, 587 và 993, và có danh sách đen số nhà</td><td>IP đích, cổng, TCP hay UDP</td></tr>
<tr><td>Phát hiện chia sẻ mạng (tethering)</td><td>bác bảo vệ để ý một thẻ mà dẫn cả nhóm vào</td><td>TTL và các dấu vết khác</td></tr>
</table></div>
<p>Ta bật từng trạm một trên bộ điều khiển của lab và đo laptop của sinh viên thấy gì. Trước hết là mốc so sánh — chưa chặn gì:</p>
${R('c142-truoc', 'dig +short', 6)}
<p>Tên nào cũng phân giải được, web chạy, SSH trả lời ở cổng 22, và hai dịch vụ UDP trả lời: một máy chủ game và một VPN.</p>

<h3>1 — Lọc DNS: cuốn danh bạ bị gạch tên</h3>
<p>Laptop lấy máy chủ DNS từ DHCP (bài 14.1) — tức DNS của trường. Nên cách rẻ nhất để chặn một trang là bắt DNS đó nói dối. Hai kiểu:</p>
${R('c142-dns-gw', 'printf', 2)}
${R('c142-dns', 'dig phim.test', 3)}
<p><code>phim.test</code> nhận <strong>NXDOMAIN</strong> ("không có tên này") nên trình duyệt báo trang không tồn tại (Chrome: <code>DNS_PROBE_FINISHED_NXDOMAIN</code>). <code>cado.test</code> được trỏ về trang chặn của chính trường. Giờ đến điểm yếu — lệnh chặn chỉ nằm trong danh bạ, không nằm trên đường đi:</p>
${R('c142-dns', 'dig @198.18.0.53', 2)}
<p>Hỏi một DNS khác (ở đây là "DNS công cộng" 198.18.0.53 của lab, giống 1.1.1.1 hay 8.8.8.8), hoặc tự đưa IP, là trang mở. Vì thế mạng nào làm kỹ sẽ thêm một luật tường lửa: không DNS nào được ra ngoài trừ khi đi qua máy chủ của trường.</p>
${R('c142-dns53', 'dig @198.18.0.53', 1)}
<p>DNS thường ở cổng 53 giờ đã chết. DNS qua HTTPS (DoH, bài 3.5) vẫn trông như HTTPS bình thường ở cổng 443 — vì thế có mạng chặn các máy chủ DoH nổi tiếng theo tên hoặc IP, và vì thế bật "DNS bảo mật" trong trình duyệt có thể làm lệnh chặn bằng DNS biến mất.</p>

<h3>2 — Lọc SNI: người đưa thư đọc phong bì</h3>
<p>HTTPS mã hoá nội dung trang, đường dẫn URL, cookie. Nhưng tin nhắn đầu tiên, <strong>ClientHello</strong> của TLS, mang tên trang ở dạng rõ — <strong>SNI</strong> (Server Name Indication, RFC 6066) — vì một IP thường chứa nhiều trang và máy chủ phải biết gửi chứng chỉ nào (bài 6.2). Tường lửa đọc được nó. Trong lab, một luật: gói nào tới cổng 443 mà chứa chuỗi byte <code>social.test</code> thì cắt bằng TCP reset.</p>
${R('c142-sni-gw', 'iptables', 1)}
${R('c142-sni', 'dig +short', 4)}
<p>Bằng chứng đây là chặn theo <em>tên</em>: <code>news.test</code> và <code>social.test</code> có <strong>cùng một IP</strong>; một cái qua, cái kia bị cắt ngay (<code>curl: (35)</code>, trên Chrome là <code>ERR_CONNECTION_RESET</code>). HTTP thường tới cùng trang vẫn chạy vì luật của ta chỉ canh cổng 443 — bộ lọc thật đọc cả header <code>Host:</code> của HTTP. Tường lửa đã thấy gì:</p>
${R('c142-sni-doc', 'tshark', 2)}
<p>Nội dung trang vẫn bí mật; <strong>tên của mọi trang bạn vào</strong> thì không. Một phần mở rộng TLS mới hơn, <strong>ECH</strong> (Encrypted Client Hello, RFC 9849), mã hoá luôn cả cái tên; mạng lọc theo SNI thường đáp lại bằng cách chặn ECH hoặc chặn dịch vụ cung cấp nó.</p>
${net('block', 'web', 'vi', 'Bật tắt từng luật của trường và xem request chết ở đâu: DNS, SNI hay cổng.', { tour: 'block-web' })}

<h3>3 — IP, cổng và UDP: vì sao game và VPN chết</h3>
<p>Những công cụ thô nhất: bỏ mọi thứ tới một IP trong danh sách; chỉ mở các cổng TCP của web và email (80, 443, 587, 993); bỏ hết UDP.</p>
${R('c142-cong-gw', 'iptables', 3)}
${R('c142-cong', 'time nc', 5)}
<p>Đọc triệu chứng, chúng là dấu vân tay:</p>
<ul>
<li><strong>Treo rồi hết giờ</strong> (đúng 3 giây ta cho phép): một luật <code>DROP</code> — gói biến mất. IP máy chủ VPN và SSH ở cổng 22 chết kiểu này.</li>
<li><strong>SSH ở cổng 993 vẫn trả lời</strong> — cùng máy chủ, nhưng là cổng trường buộc phải mở cho email. Đó là lý do nhiều lập trình viên cho SSH nghe thêm ở cổng 993 hoặc 443 (bài 14.3).</li>
<li><strong>UDP: im lặng</strong>. <code>nc -u</code> gửi đi rồi không nhận gì, mã thoát 0 — UDP không bắt tay, nên chẳng có gì báo cho bạn "bị chặn" (bài 5.1). Máy chủ game lúc nãy trả <code>pong</code> giờ biến mất, trong khi HTTPS tới cùng máy vẫn chạy.</li>
</ul>
<p>Game điện thoại dùng UDP cho trận đấu (mất một viên đạn còn hơn tới muộn), thường kèm cổng cố định, và nhiều game nối ngang hàng (P2P) cần một NAT dễ tính. Mạng chỉ cho TCP 80/443 sẽ giết trận đấu trong khi trang cửa hàng của chính game đó vẫn mở. Chuyện y hệt xảy ra với QUIC/HTTP-3 — trình duyệt lặng lẽ lùi về TCP (bài 5.3) — và với VPN WireGuard, vốn chạy UDP. Có mạng không chặn mà <strong>bóp băng thông</strong> (QoS, giới hạn theo danh mục): game vào được nhưng giật.</p>
<p>Bộ lọc thương mại thêm <strong>danh mục</strong> ("game", "mạng xã hội", "xem phim"): một cơ sở dữ liệu tên miền và IP của hãng, trường chỉ việc tích chọn. Bên dưới, chúng vẫn ra tay qua DNS, SNI hoặc IP — đúng ba cơ chế bạn vừa thấy.</p>

<h3>4 — Điểm phát Wi-Fi: vì sao điện thoại không có mạng</h3>
<p>Laptop Windows bật Mobile Hotspot: nó tạo một mạng nhỏ cho điện thoại (192.168.137.0/24, dải Windows dùng cho việc này) và NAT ra ngoài qua card Wi-Fi trường của nó — đúng như router nhà ở bài 2.3.</p>
${R('c142-ttl-win', 'ip -br addr show hs', 3)}
${R('c142-ttl-phone', 'ip -br addr show wlan0', 2)}
<p>Chạy được — và phép kiểm đăng ký ở bài 14.1 không thấy điện thoại: sau NAT, mọi gói của nó mang IP và MAC của laptop. Vậy mạng nhận ra bằng cách nào? Trên bộ điều khiển ta bắt hai gói SYN — một của chính laptop, một của điện thoại:</p>
${R('c142-ttl-gw', 'tshark', 2)}
<p>Cùng MAC, cùng IP, nhưng <strong>TTL 64 và TTL 63</strong>. Router nào cũng trừ TTL đi một (bài 2.2) — và giờ laptop là router của điện thoại. Hệ điều hành bắt đầu từ các giá trị quen thuộc (Linux, Android, iOS, macOS: 64; Windows: 128), nên một gói 63 hay 127 đến từ một "thiết bị" nghĩa là đằng sau nó còn máy khác. Dấu thời gian TCP (cột cuối) cũng chênh nhau hoàn toàn — hai đồng hồ khác nhau, hai máy khác nhau. Dấu vết khác mạng hay dùng: số kết nối bằng cả mấy thiết bị, trình duyệt của hai hệ điều hành (User-Agent) đi ra từ một MAC. Luật, và kết quả:</p>
${R('c142-ttl-gw', 'iptables -t mangle', 2)}
${R('c142-ttl-sau-phone', 'curl', 1)}
${R('c142-ttl-sau-win', 'curl', 1)}
<p>Điện thoại chết hẳn — ngay cả câu hỏi DNS cũng không được trả lời ("Resolving timed out"), vì luật bỏ mọi gói có TTL 63 — còn laptop thì không hề hấn gì. Lưu ý Windows tự bắt đầu ở 128, nên điện thoại sau điểm phát <em>Windows</em> thường tới với 63 trong khi laptop tới với 128; kiểu nào thì các con số cũng không khớp với một thiết bị.</p>
<div class="pitfall co-tieu-de"><p><strong>Luật chặn nhầm máy.</strong> Bản đầu tiên của ta đặt luật TTL ở chuỗi <code>FORWARD</code> — và nó chặn <em>laptop</em>, để lọt điện thoại. Lúc gói tới <code>FORWARD</code>, bộ điều khiển đã trừ TTL đi một (64 → 63, 63 → 62). Luật về TTL lúc gói <em>vừa tới</em> phải đặt ở <code>PREROUTING</code> (ở đây là <code>-t mangle</code>). Đo bộ lọc của bạn với cả hai trường hợp trước khi tin nó.</p></div>
${net('block', 'hotspot', 'vi', 'Laptop + điện thoại sau điểm phát của nó: so TTL bộ điều khiển thấy, rồi bật luật TTL.', { tour: 'block-hotspot' })}
<p>Thêm hai lý do điểm phát hỏng mà chẳng phải bị chặn: nhiều card Wi-Fi không vừa vào một mạng vừa phát một mạng khác cùng lúc, và hướng dẫn Internet Sharing của Apple mô tả việc chia sẻ một kết nối <em>có dây</em> ra Wi-Fi. Và nhớ bài 14.1: nếu tài khoản gắn với MAC của laptop, điện thoại không cần đăng ký riêng — chính TTL mới làm nó lộ.</p>

<h3>Tất cả bộ đếm lúc cuối</h3>
${R('c142-dem', 'iptables -L CHAN', 2)}
<p>Mỗi luật đếm số gói nó đã chặn. Tường lửa trường thật có hàng nghìn dòng như vậy, thường do danh sách danh mục của hãng quản lý — nhưng dòng nào cũng thuộc một trong vài kiểu ở trên.</p>

<h3>Triệu chứng → cơ chế → lệnh chứng minh</h3>
<div class="table-wrap"><table>
<tr><th>Bạn thấy gì</th><th>Cơ chế có lẽ là</th><th>Kiểm</th></tr>
<tr><td>"Không truy cập được trang web", <code>NXDOMAIN</code></td><td>lọc DNS</td><td><code>dig tên</code> so với <code>dig @1.1.1.1 tên</code> (hoặc một DNS khác)</td></tr>
<tr><td>Một trang có logo trường báo "bị chặn"</td><td>DNS chuyển hướng hoặc chặn HTTP giữa đường</td><td><code>dig +short tên</code> → một IP của trường</td></tr>
<tr><td><code>ERR_CONNECTION_RESET</code> ngay lập tức với HTTPS</td><td>lọc SNI</td><td><code>curl -v https://tên</code> bị reset ngay sau ClientHello; trang khác cùng IP vẫn chạy</td></tr>
<tr><td>Treo tới hết giờ</td><td>DROP theo IP hoặc cổng</td><td><code>nc -vz -w 3 máy cổng</code>; thử cổng 443 của cùng máy</td></tr>
<tr><td>Game/gọi thoại hỏng, web vẫn ổn; dùng 4G thì chạy</td><td>UDP bị chặn hoặc bị bóp</td><td><code>nc -u</code> không có trả lời; ứng dụng báo "strict NAT"</td></tr>
<tr><td>Laptop chạy, điện thoại qua điểm phát thì không</td><td>phát hiện chia sẻ (TTL), hoặc card không chia sẻ được</td><td>so cùng một request từ hai máy</td></tr>
<tr><td>"Đã kết nối, không có Internet" với mọi thứ</td><td>không phải chặn — đăng ký/trang đăng nhập (14.1)</td><td>bảng kiểm của bài 14.1</td></tr>
</table></div>

<h3>🕵️ Góc kẻ xấu</h3>
<ul>
<li><strong>Cùng những mánh đó, dùng để hại bạn.</strong> Một Wi-Fi giả (evil twin, 14.1) có thể nắm DNS: thay vì trang chặn, nó trả tên ngân hàng của bạn về một trang lừa đảo. Phòng: HTTPS với chứng chỉ hợp lệ, resolver có kiểm DNSSEC hoặc DoH (bài 3.5).</li>
<li><strong>SNI là một cuốn nhật ký.</strong> Ai điều hành mạng — trường, quán cà phê, kẻ đứng giữa — đều ghi được tên mọi trang HTTPS bạn vào mà không cần phá mã hoá nào. Hãy coi như mạng dùng chung biết bạn đi đâu.</li>
<li><strong>Ứng dụng "VPN miễn phí".</strong> VPN thấy toàn bộ lưu lượng của bạn thay cho trường. Vài cái miễn phí bán dữ liệu đó hoặc gói kèm mã độc. Dùng VPN bạn tự dựng hoặc một nhà cung cấp uy tín (14.4).</li>
<li><strong>Trang chặn giả.</strong> Trang "trang này bị chặn, đăng nhập lại để tiếp tục" trên tên miền không phải của trường là bẫy lấy mật khẩu.</li>
</ul>

<h3>Làm việc được trong mạng bị chặn (xem trước 14.3–14.4)</h3>
<p>Lập trình viên cần git, SSH, kéo ảnh Docker và deploy cả khi ở Wi-Fi bị hạn chế — thầy cô thường chỉ sinh viên đúng những công cụ này:</p>
<ul>
<li><strong>SSH ở một cổng được mở.</strong> Cho sshd trên máy chủ của bạn nghe ở 443 hoặc 993 — lab cho thấy 993 qua được trong khi 22 chết. Bài 14.3 (đường hầm SSH, <code>-L/-R/-D</code>, ProxyJump) xây trên ý này.</li>
<li><strong>VPN trông như HTTPS.</strong> WireGuard (UDP) chết ở mạng chỉ cho TCP; VPN biết lùi về TCP 443 thường qua được, trừ khi IP máy chủ của nó nằm trong danh sách đen (vpn.test của lab). Bài 14.4.</li>
<li><strong>DNS qua HTTPS</strong> thắng các bộ lọc chỉ dựa vào DNS.</li>
<li>Nơi nào có quy định cấm rõ thì theo quy định.</li>
</ul>

<h3>"Nếu… thì sao"</h3>
<ul>
<li><strong>…một trang chạy trên 4G mà không chạy trên Wi-Fi?</strong> Do chính sách của Wi-Fi, không phải do trang. Đi theo bảng trên.</li>
<li><strong>…mọi trang HTTPS đều bị reset?</strong> Có thể là proxy "kiểm tra TLS" đòi cài chứng chỉ của trường — loại này đọc được HTTPS của bạn. Biết nhận ra khi chứng chỉ không phải của chính trang đó (bài 6.4).</li>
<li><strong>…bạn dùng VPN?</strong> Trường chỉ thấy một luồng mã hoá tới một IP: có thể chặn IP đó (hoặc giao thức của VPN), nhưng không nhìn được bên trong.</li>
</ul>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Luật lọc và bảng kết nối nằm trong RAM của bộ điều khiển/tường lửa; dò chuỗi (SNI, Host) tốn CPU cho từng gói, nên bộ lọc lớn dùng phần cứng chuyên dụng.</li>
<li>Cài đặt DNS của laptop đến từ DHCP; "DNS bảo mật" của trình duyệt đi vòng qua nó ngay trong tiến trình trình duyệt.</li>
<li>TTL là một byte trong mọi header IP, do nhân của máy gửi đặt và bị mỗi router trừ đi.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trong lab (<code>GIU_LAB=1 bash lab/code/dung-output-ch14.sh</code>), trường đã bật mọi luật. Một bạn cùng lớp bảo "mạng hỏng rồi".</p>
<ol>
<li>Từ <code>nft-win</code>, thử <code>phim.test</code>, <code>cado.test</code>, <code>https://social.test</code>, <code>vpn.test:443</code>, <code>game.test</code> UDP 27015 và SSH ở cổng 22 và 993.</li>
<li>Với từng cái, ghi đúng triệu chứng (mã lỗi, thời gian) và gọi tên cơ chế mà không nhìn luật.</li>
<li>Kiểm đáp án bằng <code>iptables -L CHAN -v -n</code> và <code>iptables -t mangle -L PREROUTING -v -n</code> trên <code>nft-gw</code>: bộ đếm nào tăng?</li>
<li>Trên laptop thật ở trường, làm cùng các phép kiểm với một trang bị chặn.</li>
</ol>
<p><strong>Đạt khi:</strong> cả sáu phép thử được gán đúng DNS / SNI / IP / cổng / UDP kèm bộ đếm chứng minh.</p>
<details><summary>Lời giải</summary><p>phim.test: <code>Could not resolve host</code> → DNS NXDOMAIN. cado.test: trang của trường → DNS chuyển hướng. social.test qua HTTPS: <code>curl: (35) … reset</code> → SNI (cùng IP với news.test vẫn chạy). vpn.test:443: hết giờ → danh sách đen IP. UDP 27015: im lặng → bỏ UDP. Cổng 22: hết giờ, 993: lời chào SSH → chỉ mở một số cổng. Bộ đếm của các luật 1/3/4/5/6 tăng tương ứng.</p></details>
</div>

<details><summary>🧠 Tự kiểm (5 câu)</summary>
<ol>
<li>Ở trường một trang báo NXDOMAIN, nhưng <code>dig @1.1.1.1</code> trả về IP. Cơ chế? — <em>Lọc DNS.</em></li>
<li>Hai trang cùng IP: một mở được, cái kia bị reset ngay qua HTTPS. — <em>Lọc SNI.</em></li>
<li>Vì sao <code>nc -u</code> không báo "bị chặn"? — <em>UDP không bắt tay; gói bị bỏ thì chỉ đơn giản là không có trả lời.</em></li>
<li>Vì sao điện thoại sau điểm phát của laptop tới nơi với TTL 63? — <em>Laptop định tuyến (NAT) gói của nó và trừ TTL đi 1.</em></li>
<li>Vì sao luật TTL phải ở PREROUTING chứ không phải FORWARD? — <em>Tới FORWARD thì router đã trừ TTL rồi.</em></li>
</ol></details>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['DNS filtering (lọc DNS)', 'DNS của trường trả NXDOMAIN hoặc IP trang chặn cho các tên trong danh sách.'],
    ['NXDOMAIN', 'Câu trả lời DNS "tên này không tồn tại".'],
    ['SNI (Server Name Indication)', 'Tên trang gửi ở dạng rõ trong ClientHello của TLS; tường lửa đọc được.'],
    ['ECH (Encrypted Client Hello)', 'Phần mở rộng TLS (RFC 9849) mã hoá luôn cả SNI.'],
    ['DROP và REJECT', 'DROP = im lặng rồi hết giờ; REJECT = từ chối hoặc reset ngay lập tức.'],
    ['tethering / hotspot (chia sẻ mạng)', 'Một thiết bị định tuyến và NAT lưu lượng của thiết bị khác qua kết nối của nó.'],
    ['TTL', 'Một byte bị mỗi router trừ đi; 63/127 từ một thiết bị lộ ra có máy khác phía sau.'],
    ['category filter (lọc theo danh mục)', 'Danh sách tên miền/IP theo chủ đề của một hãng, thực thi qua DNS, SNI hoặc IP.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Bị chặn" không phải một thứ: DNS, SNI, IP/cổng, UDP và phát hiện chia sẻ mạng mỗi cái hỏng một kiểu.</li>
<li>Lọc DNS bị qua mặt bằng DNS khác ⇒ mạng chặn luôn DNS ra ngoài; DoH trông như HTTPS.</li>
<li>HTTPS giấu nội dung nhưng không giấu tên trang (SNI); ECH giấu nốt.</li>
<li>Mạng chỉ cho TCP giết game, WireGuard và QUIC (UDP) trong khi web vẫn chạy.</li>
<li>Điểm phát giấu được MAC của điện thoại nhưng không giấu được TTL (64 → 63); đo bộ lọc với cả hai trường hợp.</li>
</ul>
<p>Bài liên quan: <a href="${bai('netdev-3-5-dns-an-toan')}">3.5 DNSSEC, DoH/DoT</a> · <a href="${bai('netdev-5-3-udp-thuc-te')}">5.3 UDP ngoài đời</a> · <a href="${bai('netdev-6-2-bat-tay-tls')}">6.2 Bắt tay TLS 1.3 (SNI)</a> · <a href="${bai('netdev-2-3-nat')}">2.3 NAT</a> · <a href="${bai('netdev-10-3-reverse-forward')}">10.3 Đường hầm</a> · <a href="${bai('netdev-14-1-wifi-truong-mac')}">14.1 Wi-Fi trường và MAC</a>.</p>
${L('https://www.rfc-editor.org/rfc/rfc6066', '📄', 'RFC 6066 — Các phần mở rộng TLS (mục 3: Server Name Indication)', 'Vì sao tên trang đi trong ClientHello.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc9849', '📄', 'RFC 9849 — TLS Encrypted Client Hello', 'Mã hoá luôn cả SNI.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8484', '📄', 'RFC 8484 — DNS qua HTTPS (DoH)', 'DNS trông như HTTPS bình thường.', 'Mở')}
${L('https://learn.microsoft.com/en-gb/answers/questions/1529841/(solved)-hosted-network-doesnt-remove-the-initial', '💬', 'Microsoft Q&A — Card ảo của Mobile Hotspot ở 192.168.137.1', 'Dải địa chỉ Windows dùng cho điểm phát.', 'Mở')}
${L('https://support.apple.com/guide/mac-help/share-internet-connection-mac-network-users-mchlp1540/mac', '📄', 'Apple — Chia sẻ kết nối Internet của Mac', 'Internet Sharing trong Cài đặt hệ thống.', 'Mở')}
</div>
`,
};
