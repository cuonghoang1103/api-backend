/**
 * Chương 3 · 3.3 — TTL, cache và vì sao đổi DNS lại chậm (slug khung netdev-3-3-ttl-cache).
 * Output thật: lab/out/c33-*.out.txt. Output GIỮ (bài trích giờ/số đo): c33-ns-ha, c33-ns-doi, c33-ns-doi2, c33-theo-doc,
 * c33-app, c33-treo, c33-treo8, c33-that.
 */
import { run, src, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-03-3.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };
const OSG = { mon: 'OSG202', khoa: 'operating-systems' };
const D = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN/ };

export default {
  title: '3.3 — TTL, caching and why DNS changes are slow|||3.3 — TTL, cache và vì sao đổi DNS lại chậm',
  slug: 'netdev-3-3-ttl-cache',
  type: 'LESSON',
  isFreePreview: true,
  description: 'TTL đếm ngược trong cache của resolver; các lớp cache (trình duyệt, hệ điều hành, runtime, resolver); thí nghiệm ba phút: hạ TTL rồi đổi IP ngay — người dùng vẫn nhận IP cũ 1 phút 45 giây; quy trình hạ TTL trước khi chuyển máy chủ; cache âm (NXDOMAIN) và vì sao xoá một tên chưa đủ khi vùng có DNSSEC; Java cache 30 s, Node không cache; dns.lookup và thread pool của libuv đo thật.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>TTL, caching and why DNS changes are slow</h2>
<p class="lead">"I changed the DNS record an hour ago — why do some users still reach the old server?" Every developer asks this once. The answer is caching: DNS is fast only because almost nobody asks the authoritative server, and the number that controls how long everyone may keep an old answer — the TTL — works differently from what most people think. This lesson measures it: a TTL counting down, a three-minute server move done in the wrong order and then the right one, a name that "does not exist" after you created it, and what Java and Node do with DNS inside your application.</p>

<h3>TTL counts down in every cache</h3>
<p>We emptied the ISP resolver's cache, then asked for <code>api.labflow.test</code> twice, five seconds apart, and finally asked LabFlow's own server:</p>
${run('c33-dem', 'dig +noall +answer api.labflow.test', 4, D)}
<p>The authoritative server always says <strong>120</strong>: that is the TTL written in the zone ("you may keep this for 120 seconds"). The resolver says 120 the first time (it just fetched it) and <strong>115</strong> five seconds later: it stored the record with an expiry time and reports the time left. When the counter reaches 0 the record is thrown away, and the next question goes back up the tree. Inside the resolver:</p>
${run('c33-isp-cache', 'unbound-control dump_cache', 2, D)}
<p>Two questions, one cache miss (the first, which went to the Internet), one cache hit. Important consequence: <strong>a TTL is a promise you make to everybody who already asked</strong>. Once a resolver has your record with 115 seconds left, nothing you do on your server can make it forget sooner.</p>

<h3>Every layer has its own cache</h3>
<table>
<tr><th>Layer</th><th>Example</th><th>How to see / clear it</th></tr>
<tr><td>Browser</td><td>Chrome, Firefox keep a short host cache of their own</td><td><code>chrome://net-internals/#dns</code> → "Clear host cache"</td></tr>
<tr><td>Your runtime</td><td>the JVM caches successful lookups (30 s by default) — Node does not cache at all (measured below)</td><td>restart, or <code>networkaddress.cache.ttl</code> in Java</td></tr>
<tr><td>Operating system</td><td>systemd-resolved (lesson 3.1), macOS mDNSResponder, Windows DNS Client</td><td><code>resolvectl flush-caches</code> · macOS <code>sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder</code> · <code>ipconfig /flushdns</code></td></tr>
<tr><td>Recursive resolver</td><td>your ISP's DNS, 1.1.1.1, 8.8.8.8, the company DNS</td><td>only its operator can flush it (public resolvers have a "purge cache" web page)</td></tr>
</table>
<p>Each layer respects the TTL it received (and some cap it: Unbound keeps nothing longer than one day by default, <code>cache-max-ttl 86400</code>). In the worst case a stale answer can survive for the sum of a few of them, but the resolver's copy is the one that matters most — it serves thousands of users.</p>

<h3>The experiment: lower the TTL and change the IP right away</h3>
<p>LabFlow wants to move <code>api.labflow.test</code> from the Hanoi edge (<code>.10</code>) to the Singapore edge (<code>.11</code>). Someone read that "you should lower the TTL before a move", so they lower it from 120 to 10 seconds — and change the IP eleven seconds later. While a loop on the laptop asked the resolver every 15 seconds, the two changes on ns1:</p>
${run('c33-ns-ha', 'date', 4, D)}
${run('c33-ns-doi', 'date', 4, D)}
<p>What the laptop received, second by second:</p>
${run('c33-theo-doc', 'cat', 1, D)}
<ul>
<li>16:10:46: the resolver fetches the record — TTL 120, address <code>.10</code>.</li>
<li>16:10:51 and 16:11:02: the TTL is lowered and then the IP changed <em>on the server</em>. The laptop sees nothing: 105, 90, 75 … the resolver keeps counting down the <strong>old</strong> TTL of 120. It has no idea the zone changed, and it does not ask.</li>
<li>16:12:47: the old copy has expired, the resolver asks again and gets the new record: TTL 10, address <code>.11</code>. The IP was changed at 16:11:02, so users kept reaching the old server for <strong>1 minute 45 seconds</strong> (computed) — the whole remaining old TTL. Lowering the TTL did nothing for this move, because it was done too late.</li>
<li>Then a second change at 16:13:07 (back to <code>.10</code>, recorded in <code>c33-ns-doi2</code>): visible at 16:13:17. This time every cache already held the short TTL of 10 seconds, so the change spread within one 15-second poll.</li>
</ul>
${net('ttl', 'change', 'en', 'Pick the old TTL, when you lower it and when you change the IP: watch how long each cache keeps serving the old address.', { tour: 'ttl-change' })}

<h3>The right order for moving a server</h3>
<ol>
<li><strong>Lower the TTL</strong> (for example from 3600 to 60) — and do nothing else.</li>
<li><strong>Wait at least the old TTL</strong> (3600 s = one hour here) so that every cache that fetched the record with TTL 3600 has thrown it away. Now every copy in the world expires within 60 seconds.</li>
<li><strong>Change the IP.</strong> Keep the old server running: the last copies of the old address live up to 60 more seconds (plus runtime caches like the JVM's).</li>
<li><strong>Verify</strong> on the authoritative servers (<code>dig @ns1</code>, <code>dig @ns2</code>) and through a few resolvers.</li>
<li><strong>Raise the TTL back</strong> once you are sure you will not roll back — long TTLs mean fewer lookups and more resilience if your DNS provider has an outage.</li>
</ol>
<p>Rule of thumb: the worst-case delay of a change = the TTL that was in caches <em>when you made the change</em>, not the TTL you set at that moment.</p>

<h3>Negative caching: "it does not exist" is cached too</h3>
<p>Someone checks whether <code>new.labflow.test</code> works before creating it:</p>
${run('c33-am', 'dig new.labflow.test', 1, D)}
<p><code>NXDOMAIN</code>, and the answer carries the zone's SOA. A resolver caches a "does not exist" answer for the smaller of the SOA record's own TTL and its last number (<em>minimum</em>) — here min(3600, 300) = <strong>300 seconds</strong> (RFC 2308). Now the record is created on ns1:</p>
${run('c33-am-ns', 'printf', 3, D)}
${run('c33-am2', 'dig', 2, D)}
<p>ns1 has the record, but the resolver keeps answering NXDOMAIN with 298 seconds left on its "does not exist" memory. On a resolver you run yourself you can flush it — but flushing just that name is not enough here:</p>
${run('c33-am-xoa1', 'unbound-control flush', 1, D)}
${run('c33-am3a', 'dig', 1, D)}
${run('c33-am3b', 'dig', 1, D)}
${run('c33-am-xoa2', 'unbound-control', 2, D)}
${run('c33-am3', 'dig', 1, D)}
<p>Still NXDOMAIN after flushing the name, because the zone is signed with DNSSEC: the resolver had kept the zone's signed <strong>NSEC</strong> records, which list "the next existing name after <code>mail</code> is <code>ns1</code>" — proof that nothing called <code>new</code> exists, valid for any name in that range. With <code>aggressive-nsec</code> (RFC 8198, on by default in Unbound) it answers from that proof without asking. Flushing the whole zone removed the proof, and the new name resolved. Public resolvers can only be flushed through their operator's web page; most of the time you simply wait.</p>
<div class="pitfall co-tieu-de">
<p><strong>"I just created the record and it says it does not exist."</strong> Typical with a new subdomain checked too early, a monitoring probe, or a certificate tool (Let's Encrypt DNS-01) that queries <code>_acme-challenge</code> before the TXT record is published. For <code>cuongthai.com</code> (Cloudflare DNS), the negative TTL is <strong>1800 seconds</strong>:</p>
${run('c33-that', 'dig', 2, D)}
<p>Create the record <em>first</em>, check it on the authoritative server (<code>dig @kyrie.ns.cloudflare.com</code>), and only then through a resolver.</p>
</div>
${net('ttl', 'negative', 'en', 'Query a name before it exists, create it, and see how long the resolver keeps saying NXDOMAIN.', { tour: 'ttl-negative' })}

<h3>Inside your application: Java remembers, Node asks every time</h3>
<p>The same five lookups of <code>api.labflow.test</code>, one second apart, from a Java program and from a Node program, counting the DNS questions that actually left the laptop:</p>
${src('ch03/Hoi.java', 'java')}
${run('c33-app', 'java', 4, D)}
<p>The JVM asked the network once (2 questions: A and AAAA) and answered the other four lookups from its own cache in a fraction of a millisecond. Since the security manager is not used, the JDK's default is 30 seconds (<code>DEFAULT_POSITIVE = 30</code> in <code>InetAddressCachePolicy</code>); failed lookups are cached 10 seconds. Node asked 5 times: it has <strong>no DNS cache</strong>, every <code>dns.lookup</code> (so every new HTTP connection) goes to the OS.</p>
<div class="pitfall co-tieu-de">
<p><strong>Java: "the service moved but our app still calls the old IP."</strong> With the default it lasts 30 s. But some setups set <code>networkaddress.cache.ttl=-1</code> ("cache forever") in <code>java.security</code>, or ran with a security manager — then the app keeps the old address until restart, whatever the DNS TTL. In containers and Kubernetes, where service IPs change, set it explicitly (for example 30 or 60).</p>
<p><strong>Node: every request pays for DNS.</strong> Without keep-alive, each request opens a new connection and does a lookup. Reuse connections (Node's global HTTP agent keeps connections alive by default since v19 — measured <code>true</code> on Node 22 in the lab), and if your service calls many hosts, consider a small DNS cache in the process.</p>
</div>

<h3>Slow DNS and Node's thread pool</h3>
<p><code>dns.lookup</code> calls the blocking C function <code>getaddrinfo()</code>, so Node runs it on the <strong>libuv thread pool</strong> (4 threads by default) — the same pool used for file system work and some crypto. What happens when DNS is slow? Four lookups of names whose name server never answers (<code>dead.test</code>, lesson 3.5), then a tiny file read:</p>
${src('ch03/treo.mjs', 'javascript')}
${run('c33-treo', 'node treo.mjs', 1, D)}
${run('c33-treo8', 'UV_THREADPOOL_SIZE=8', 1, D)}
<ul>
<li>The file read finished at once (72 ms, then 6 ms): it was <em>not</em> blocked. libuv classes DNS as "slow I/O" and lets it use at most half the pool — <code>(threads + 1) / 2</code> in its source — exactly so that slow DNS cannot freeze file access.</li>
<li>But with 4 threads only <strong>2</strong> lookups run at a time: x1 and x2 failed after 10 seconds (glibc gives up after 2 tries × 5 s, the default in <code>resolv.conf</code>), and x3, x4 could only <em>start</em> then — they failed at <strong>20 seconds</strong>. With 8 threads, 4 lookups run at once and all four fail at 10 seconds.</li>
<li>In a real service, that means: one slow DNS server ⇒ requests to every host queue behind each other. Remedies: keep-alive (fewer lookups), short timeouts on outgoing calls, <code>UV_THREADPOOL_SIZE</code> set at start-up when you do many lookups, and a working resolver.</li>
</ul>
${cauNoi('en', { ...OSG, bai: 'osg202-slide-cs3-2', so: 'CS.3 (2/2)', ten: 'Threads in backend: Node’s event loop and libuv thread pool', giong: 'Node has one JavaScript thread plus a libuv thread pool of 4 used for fs, dns.lookup, crypto and zlib', khac: 'OSG202 measures the pool with CPU-heavy work (PBKDF2)', them: 'the pool measured with a dead DNS server: DNS may only take half the threads, so lookups queue behind each other while file reads still pass' })}

<h3>Where this lives in the computer</h3>
<ul>
<li>A resolver's cache entry is a few hundred bytes in RAM: the records plus an <em>absolute</em> expiry time. The TTL you see is "expiry − now", recomputed on each answer — which is why it goes down by exactly 5 after <code>sleep 5</code>.</li>
<li>The JVM's cache is a map inside your process; it dies with the process. systemd-resolved's cache is in its own process; the browser's in the browser's network service.</li>
<li>Negative answers are cached like positive ones, keyed by name and type — and, with DNSSEC, as signed NSEC ranges that cover many names at once.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep', so: '14.2', ten: 'Web, email, DNS, DHCP and file sharing', giong: 'the TTL on a record is “the most misunderstood number in DNS”: it is how long caches may keep it', khac: 'NWC204 explains it on two real records of one site', them: 'the countdown measured in a resolver, a server move done in the wrong order (old IP served 1 min 45 s after the change), the right procedure, negative caching with DNSSEC, and Java/Node caches' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> LabFlow will move <code>www</code> to a new server next week. Its current TTL is 300. Your lead wants a plan with numbers and a rehearsal in the lab.</p>
<ol>
<li>Write the plan: when to lower the TTL (to what), when to change the IP, how long the old server must stay up, when to raise the TTL back. Use the rule "worst-case delay = TTL in caches when you change".</li>
<li>Rehearse it on the lab: on <code>nfi-ns</code>, lower <code>api</code>'s TTL to 10 (edit <code>/dnsz/src/labflow.test.zone</code>, bump the serial, run <code>ky.sh labflow.test</code> and <code>rndc reload</code>). On the laptop run <code>for i in $(seq 1 12); do date +%T; dig +noall +answer api.labflow.test; sleep 15; done</code>.</li>
<li>Change the IP to <code>.11</code> only after the TTL shown on the laptop has dropped to 10. Note the time of the change and the time the laptop first sees <code>.11</code>.</li>
<li>Ask for <code>blog.labflow.test</code> (it does not exist), then create it on ns1. How long would a user wait? Prove it with the SOA in the NXDOMAIN answer.</li>
</ol>
<p><strong>Done when:</strong> your plan has concrete times, your rehearsal shows the new IP within ~10–15 s of the change, and you can explain the 300 s for <code>blog</code>.</p>
<details><summary>Solution</summary>
<p>1) Day −1 (or at least 300 s before): set TTL 300 → 30. Wait ≥ 300 s. Change the IP; keep the old server up ≥ 30 s plus the JVM's 30 s if Java clients call it (say 5 minutes to be safe). Verify with <code>dig @203.0.113.53</code> and <code>@203.0.113.54</code>. After a day without rollback, set TTL back to 300 (or 3600). 2–3) The laptop shows TTL counting down from ~120 to 10 over up to two minutes (the old 120 had to expire first). After the change, the next poll or the one after shows <code>.11</code> — at most 10 s of cache plus the 15 s poll interval. 4) NXDOMAIN with <code>labflow.test. 300 IN SOA … 300</code> in the authority section: the negative TTL is min(300, 300) = 300 s, so up to 5 minutes; flush the zone on the ISP resolver (<code>unbound-control flush_zone labflow.test</code>) to see it at once.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['TTL — time to live (thời gian được giữ)', 'Seconds any cache may keep a record; counts down in caches, fixed on the authoritative server.'],
    ['cache hit / miss (trúng / trượt cache)', 'Answered from memory / had to ask upstream.'],
    ['negative caching (cache âm)', 'Caching NXDOMAIN/NODATA answers, for min(SOA TTL, SOA minimum) seconds (RFC 2308).'],
    ['aggressive NSEC (RFC 8198)', 'Resolver uses cached signed NSEC ranges to answer “does not exist” without asking.'],
    ['networkaddress.cache.ttl', 'JVM setting for its own DNS cache (default 30 s without a security manager).'],
    ['libuv thread pool', 'Node’s helper threads (default 4) for getaddrinfo, fs, crypto; DNS may use at most half.'],
    ['flush (xoá cache)', 'Remove entries from a cache you control; public resolvers have their own purge pages.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>The authoritative server always gives the full TTL; caches count it down and do not ask again until it reaches 0.</li>
<li>A change reaches users after the TTL that was in caches <em>when you changed</em>: lower the TTL, wait the old TTL, then change (we measured 1 min 45 s of old IP when doing it in the wrong order).</li>
<li>NXDOMAIN is cached for min(SOA TTL, minimum) — 300 s in the lab, 1800 s for cuongthai.com; with DNSSEC, flushing one name may not be enough.</li>
<li>Java caches lookups for 30 s by default; Node does not cache at all.</li>
<li>Node runs <code>dns.lookup</code> on the libuv pool and lets DNS use only half of it: a dead DNS server made lookups queue to 20 s.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc2308', '📄', 'RFC 2308 — Negative caching of DNS queries', 'NXDOMAIN/NODATA caching and the SOA minimum.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8198', '📄', 'RFC 8198 — Aggressive use of DNSSEC-validated cache', 'Why flushing one name was not enough.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8767', '📄', 'RFC 8767 — Serving stale data to improve DNS resiliency', 'Resolvers that keep answering with expired records when authoritative servers are down.', 'Open')}
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/net/InetAddress.html', '☕', 'Java 21 — InetAddress caching', 'networkaddress.cache.ttl and cache.negative.ttl.', 'Open')}
${L('https://github.com/openjdk/jdk21u/blob/master/src/java.base/share/classes/sun/net/InetAddressCachePolicy.java', '☕', 'OpenJDK — InetAddressCachePolicy.java', 'DEFAULT_POSITIVE = 30 seconds.', 'Open')}
${L('https://github.com/libuv/libuv/blob/v1.x/src/threadpool.c', '⚙️', 'libuv — threadpool.c', 'slow I/O (DNS) limited to (threads + 1) / 2.', 'Open')}
${L('https://nodejs.org/api/dns.html', '📄', 'Node.js — dns module', 'dns.lookup runs on the libuv thread pool; dns.resolve uses the network directly.', 'Open')}
${L('https://nodejs.org/api/http.html', '📄', 'Node.js — http.globalAgent', 'Keep-Alive and a 5 second timeout by default since v19.0.0.', 'Open')}
${L('https://unbound.docs.nlnetlabs.nl/en/latest/manpages/unbound.conf.html', '📄', 'unbound.conf manual', 'cache-max-ttl, aggressive-nsec, serve-expired.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>TTL, cache và vì sao đổi DNS lại chậm</h2>
<p class="lead">"Tôi đổi bản ghi DNS một tiếng rồi — sao vẫn còn người vào máy chủ cũ?" Lập trình viên nào cũng hỏi câu này một lần. Câu trả lời là cache: DNS nhanh chỉ vì gần như không ai hỏi máy chủ authoritative, và con số điều khiển việc mọi người được giữ câu trả lời cũ bao lâu — TTL — hoạt động khác với điều đa số người nghĩ. Bài này đo nó: một TTL đếm ngược, một lần chuyển máy chủ ba phút làm sai thứ tự rồi làm đúng, một cái tên "không tồn tại" sau khi bạn đã tạo nó, và Java với Node làm gì với DNS bên trong ứng dụng của bạn.</p>

<h3>TTL đếm ngược trong mọi cache</h3>
<p>Ta xoá cache của resolver nhà mạng, rồi hỏi <code>api.labflow.test</code> hai lần cách nhau năm giây, cuối cùng hỏi máy chủ riêng của LabFlow:</p>
${run('c33-dem', 'dig +noall +answer api.labflow.test', 4, D)}
<p>Máy chủ authoritative luôn nói <strong>120</strong>: đó là TTL ghi trong vùng ("bạn được giữ cái này 120 giây"). Resolver nói 120 lần đầu (nó vừa lấy về) và <strong>115</strong> năm giây sau: nó lưu bản ghi kèm lúc hết hạn và báo thời gian còn lại. Khi bộ đếm về 0, bản ghi bị vứt, và câu hỏi tiếp theo lại đi lên cây. Bên trong resolver:</p>
${run('c33-isp-cache', 'unbound-control dump_cache', 2, D)}
<p>Hai câu hỏi, một lần trượt cache (lần đầu, phải đi ra Internet), một lần trúng. Hệ quả quan trọng: <strong>TTL là lời hứa bạn đưa cho tất cả những ai đã hỏi</strong>. Một khi resolver đã có bản ghi của bạn với 115 giây còn lại, bạn làm gì trên máy chủ cũng không bắt nó quên sớm hơn được.</p>

<h3>Lớp nào cũng có cache riêng</h3>
<table>
<tr><th>Lớp</th><th>Ví dụ</th><th>Xem / xoá thế nào</th></tr>
<tr><td>Trình duyệt</td><td>Chrome, Firefox giữ một cache tên ngắn hạn của riêng chúng</td><td><code>chrome://net-internals/#dns</code> → "Clear host cache"</td></tr>
<tr><td>Runtime của bạn</td><td>JVM cache các lần tra thành công (mặc định 30 s) — Node không cache gì (đo bên dưới)</td><td>khởi động lại, hoặc <code>networkaddress.cache.ttl</code> trong Java</td></tr>
<tr><td>Hệ điều hành</td><td>systemd-resolved (bài 3.1), mDNSResponder của macOS, DNS Client của Windows</td><td><code>resolvectl flush-caches</code> · macOS <code>sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder</code> · <code>ipconfig /flushdns</code></td></tr>
<tr><td>Recursive resolver</td><td>DNS của nhà mạng, 1.1.1.1, 8.8.8.8, DNS công ty</td><td>chỉ người vận hành mới xoá được (resolver công cộng có trang web "purge cache")</td></tr>
</table>
<p>Mỗi lớp tôn trọng TTL mà nó nhận (và có lớp đặt trần: Unbound mặc định không giữ gì quá một ngày, <code>cache-max-ttl 86400</code>). Trường hợp xấu nhất, một câu trả lời cũ có thể sống bằng tổng của vài lớp, nhưng bản trong resolver là bản quan trọng nhất — nó phục vụ hàng nghìn người.</p>

<h3>Thí nghiệm: hạ TTL rồi đổi IP ngay</h3>
<p>LabFlow muốn chuyển <code>api.labflow.test</code> từ máy biên Hà Nội (<code>.10</code>) sang máy biên Singapore (<code>.11</code>). Ai đó đọc được rằng "nên hạ TTL trước khi chuyển", nên họ hạ từ 120 xuống 10 giây — rồi đổi IP mười một giây sau. Trong lúc một vòng lặp trên laptop hỏi resolver mỗi 15 giây, hai lần thay đổi trên ns1:</p>
${run('c33-ns-ha', 'date', 4, D)}
${run('c33-ns-doi', 'date', 4, D)}
<p>Laptop nhận được gì, theo từng thời điểm:</p>
${run('c33-theo-doc', 'cat', 1, D)}
<ul>
<li>16:10:46: resolver lấy bản ghi — TTL 120, địa chỉ <code>.10</code>.</li>
<li>16:10:51 và 16:11:02: TTL được hạ rồi IP được đổi <em>trên máy chủ</em>. Laptop không thấy gì: 105, 90, 75 … resolver vẫn đếm ngược TTL <strong>cũ</strong> là 120. Nó không biết vùng đã đổi, và nó không hỏi.</li>
<li>16:12:47: bản cũ hết hạn, resolver hỏi lại và nhận bản ghi mới: TTL 10, địa chỉ <code>.11</code>. IP được đổi lúc 16:11:02, nên người dùng vẫn vào máy chủ cũ thêm <strong>1 phút 45 giây</strong> (tính ra) — trọn phần TTL cũ còn lại. Hạ TTL chẳng giúp gì cho lần chuyển này, vì làm quá muộn.</li>
<li>Rồi lần đổi thứ hai lúc 16:13:07 (về lại <code>.10</code>, ghi trong <code>c33-ns-doi2</code>): thấy được lúc 16:13:17. Lần này mọi cache đã giữ TTL ngắn 10 giây, nên thay đổi lan đi trong vòng một lượt hỏi 15 giây.</li>
</ul>
${net('ttl', 'change', 'vi', 'Chọn TTL cũ, lúc hạ TTL và lúc đổi IP: xem mỗi cache còn trả địa chỉ cũ bao lâu.', { tour: 'ttl-change' })}

<h3>Thứ tự đúng khi chuyển máy chủ</h3>
<ol>
<li><strong>Hạ TTL</strong> (ví dụ từ 3600 xuống 60) — và không làm gì khác.</li>
<li><strong>Chờ ít nhất bằng TTL cũ</strong> (3600 s = một giờ ở đây) để mọi cache đã lấy bản ghi với TTL 3600 đều vứt nó đi. Giờ mọi bản sao trên thế giới đều hết hạn trong vòng 60 giây.</li>
<li><strong>Đổi IP.</strong> Giữ máy chủ cũ chạy: những bản sao cuối của địa chỉ cũ còn sống thêm tối đa 60 giây (cộng cache của runtime như JVM).</li>
<li><strong>Kiểm</strong> trên các máy chủ authoritative (<code>dig @ns1</code>, <code>dig @ns2</code>) và qua vài resolver.</li>
<li><strong>Nâng TTL lại</strong> khi chắc chắn không phải quay lui — TTL dài nghĩa là ít lượt tra hơn và chịu đựng tốt hơn nếu nhà cung cấp DNS gặp sự cố.</li>
</ol>
<p>Quy tắc nhớ: độ trễ xấu nhất của một thay đổi = TTL đang nằm trong cache <em>lúc bạn thay đổi</em>, không phải TTL bạn đặt vào lúc đó.</p>

<h3>Cache âm: "không tồn tại" cũng được cache</h3>
<p>Ai đó thử xem <code>new.labflow.test</code> chạy chưa trước khi tạo nó:</p>
${run('c33-am', 'dig new.labflow.test', 1, D)}
<p><code>NXDOMAIN</code>, và câu trả lời mang theo SOA của vùng. Resolver cache câu "không tồn tại" trong khoảng nhỏ hơn giữa TTL của chính bản ghi SOA và con số cuối của nó (<em>minimum</em>) — ở đây min(3600, 300) = <strong>300 giây</strong> (RFC 2308). Giờ bản ghi được tạo trên ns1:</p>
${run('c33-am-ns', 'printf', 3, D)}
${run('c33-am2', 'dig', 2, D)}
<p>ns1 đã có bản ghi, nhưng resolver vẫn trả NXDOMAIN với 298 giây còn lại trong trí nhớ "không tồn tại". Trên resolver do bạn chạy thì xoá được — nhưng chỉ xoá đúng tên đó thì chưa đủ:</p>
${run('c33-am-xoa1', 'unbound-control flush', 1, D)}
${run('c33-am3a', 'dig', 1, D)}
${run('c33-am3b', 'dig', 1, D)}
${run('c33-am-xoa2', 'unbound-control', 2, D)}
${run('c33-am3', 'dig', 1, D)}
<p>Vẫn NXDOMAIN sau khi xoá tên, vì vùng được ký DNSSEC: resolver đã giữ các bản ghi <strong>NSEC</strong> có chữ ký của vùng, thứ liệt kê "tên tồn tại kế tiếp sau <code>mail</code> là <code>ns1</code>" — bằng chứng không có tên nào gọi là <code>new</code>, dùng được cho mọi tên trong khoảng đó. Với <code>aggressive-nsec</code> (RFC 8198, mặc định bật trong Unbound) nó trả lời từ bằng chứng đó mà không hỏi. Xoá cả vùng thì bằng chứng mất, và tên mới phân giải được. Resolver công cộng chỉ xoá được qua trang web của bên vận hành; đa số trường hợp bạn chỉ có thể chờ.</p>
<div class="pitfall co-tieu-de">
<p><strong>"Tôi vừa tạo bản ghi mà nó báo không tồn tại."</strong> Hay gặp với tên miền con mới bị kiểm quá sớm, một đầu dò giám sát, hoặc công cụ cấp chứng chỉ (Let's Encrypt DNS-01) hỏi <code>_acme-challenge</code> trước khi bản ghi TXT được công bố. Với <code>cuongthai.com</code> (DNS của Cloudflare), TTL âm là <strong>1800 giây</strong>:</p>
${run('c33-that', 'dig', 2, D)}
<p>Hãy tạo bản ghi <em>trước</em>, kiểm trên máy chủ authoritative (<code>dig @kyrie.ns.cloudflare.com</code>), rồi mới kiểm qua resolver.</p>
</div>
${net('ttl', 'negative', 'vi', 'Hỏi một tên trước khi nó tồn tại, tạo nó, rồi xem resolver còn nói NXDOMAIN bao lâu.', { tour: 'ttl-negative' })}

<h3>Bên trong ứng dụng: Java nhớ, Node hỏi mỗi lần</h3>
<p>Cùng năm lần tra <code>api.labflow.test</code>, cách nhau một giây, từ một chương trình Java và một chương trình Node, đếm các câu hỏi DNS thật sự rời khỏi laptop:</p>
${src('ch03/Hoi.java', 'java')}
${run('c33-app', 'java', 4, D)}
<p>JVM hỏi mạng một lần (2 câu hỏi: A và AAAA) và trả lời bốn lần tra còn lại từ cache riêng trong chưa tới một mili giây. Khi không dùng security manager, mặc định của JDK là 30 giây (<code>DEFAULT_POSITIVE = 30</code> trong <code>InetAddressCachePolicy</code>); lần tra thất bại được cache 10 giây. Node hỏi 5 lần: nó <strong>không có cache DNS</strong>, mỗi <code>dns.lookup</code> (tức mỗi kết nối HTTP mới) đều đi xuống hệ điều hành.</p>
<div class="pitfall co-tieu-de">
<p><strong>Java: "dịch vụ đã chuyển mà app vẫn gọi IP cũ."</strong> Với mặc định thì kéo dài 30 s. Nhưng có nơi đặt <code>networkaddress.cache.ttl=-1</code> ("cache mãi mãi") trong <code>java.security</code>, hoặc chạy với security manager — khi đó app giữ địa chỉ cũ tới lúc khởi động lại, bất kể TTL của DNS. Trong container và Kubernetes, nơi IP của dịch vụ hay đổi, hãy đặt rõ giá trị (ví dụ 30 hoặc 60).</p>
<p><strong>Node: request nào cũng trả giá cho DNS.</strong> Không có keep-alive thì mỗi request mở kết nối mới và tra tên một lần. Hãy dùng lại kết nối (HTTP agent toàn cục của Node mặc định giữ kết nối từ bản v19 — đo trong lab trên Node 22 ra <code>true</code>), và nếu dịch vụ gọi nhiều máy, cân nhắc một cache DNS nhỏ trong tiến trình.</p>
</div>

<h3>DNS chậm và thread pool của Node</h3>
<p><code>dns.lookup</code> gọi hàm C chặn <code>getaddrinfo()</code>, nên Node chạy nó trên <strong>thread pool của libuv</strong> (mặc định 4 luồng) — cùng pool dùng cho việc hệ thống tệp và một phần mã hoá. Chuyện gì xảy ra khi DNS chậm? Bốn lần tra những cái tên có máy chủ tên không bao giờ trả lời (<code>dead.test</code>, bài 3.5), rồi đọc một tệp nhỏ:</p>
${src('ch03/treo.mjs', 'javascript')}
${run('c33-treo', 'node treo.mjs', 1, D)}
${run('c33-treo8', 'UV_THREADPOOL_SIZE=8', 1, D)}
<ul>
<li>Việc đọc tệp xong ngay (72 ms, rồi 6 ms): nó <em>không</em> bị chặn. libuv xếp DNS vào loại "I/O chậm" và chỉ cho nó dùng tối đa nửa pool — <code>(threads + 1) / 2</code> trong mã nguồn — đúng để DNS chậm không làm đông cứng việc truy cập tệp.</li>
<li>Nhưng với 4 luồng chỉ <strong>2</strong> lần tra chạy cùng lúc: x1 và x2 thất bại sau 10 giây (glibc bỏ cuộc sau 2 lần thử × 5 s, mặc định của <code>resolv.conf</code>), còn x3, x4 khi đó mới được <em>bắt đầu</em> — chúng thất bại ở giây thứ <strong>20</strong>. Với 8 luồng, 4 lần tra chạy cùng lúc và cả bốn thất bại ở giây thứ 10.</li>
<li>Trong một dịch vụ thật, điều đó nghĩa là: một máy chủ DNS chậm ⇒ request tới mọi máy xếp hàng sau nhau. Cách chữa: keep-alive (ít lượt tra hơn), timeout ngắn cho lời gọi ra ngoài, đặt <code>UV_THREADPOOL_SIZE</code> lúc khởi động khi phải tra nhiều tên, và một resolver chạy tốt.</li>
</ul>
${cauNoi('vi', { ...OSG, bai: 'osg202-slide-cs3-2', so: 'CS.3 (2/2)', ten: 'Luồng trong backend: event loop của Node và thread pool của libuv', giong: 'Node có một luồng JavaScript cộng thread pool libuv 4 luồng dùng cho fs, dns.lookup, crypto và zlib', khac: 'OSG202 đo pool bằng việc nặng CPU (PBKDF2)', them: 'đo pool với một máy chủ DNS chết: DNS chỉ được dùng nửa số luồng, nên các lần tra xếp hàng sau nhau trong khi đọc tệp vẫn đi qua' })}

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Một mục trong cache của resolver là vài trăm byte trong RAM: các bản ghi cộng lúc hết hạn <em>tuyệt đối</em>. TTL bạn thấy là "lúc hết hạn − bây giờ", tính lại mỗi lần trả lời — vì thế nó giảm đúng 5 sau <code>sleep 5</code>.</li>
<li>Cache của JVM là một map trong tiến trình của bạn; nó chết cùng tiến trình. Cache của systemd-resolved nằm trong tiến trình riêng của nó; của trình duyệt nằm trong dịch vụ mạng của trình duyệt.</li>
<li>Câu trả lời âm được cache như câu dương, theo tên và loại — và với DNSSEC, dưới dạng các khoảng NSEC có chữ ký phủ nhiều tên cùng lúc.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep', so: '14.2', ten: 'Web, email, DNS, DHCP và chia sẻ tệp', giong: 'TTL của một bản ghi là “con số bị hiểu sai nhiều nhất trong DNS”: thời gian cache được giữ nó', khac: 'NWC204 giải thích trên hai bản ghi thật của một trang', them: 'đếm ngược đo trong resolver, một lần chuyển máy chủ làm sai thứ tự (IP cũ còn được trả 1 phút 45 giây sau khi đổi), quy trình đúng, cache âm với DNSSEC, và cache của Java/Node' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> tuần sau LabFlow chuyển <code>www</code> sang máy chủ mới. TTL hiện tại là 300. Trưởng nhóm muốn một kế hoạch có số liệu và một buổi diễn tập trên lab.</p>
<ol>
<li>Viết kế hoạch: khi nào hạ TTL (xuống bao nhiêu), khi nào đổi IP, máy chủ cũ phải chạy thêm bao lâu, khi nào nâng TTL lại. Dùng quy tắc "độ trễ xấu nhất = TTL trong cache lúc bạn đổi".</li>
<li>Diễn tập trên lab: trên <code>nfi-ns</code>, hạ TTL của <code>api</code> xuống 10 (sửa <code>/dnsz/src/labflow.test.zone</code>, tăng serial, chạy <code>ky.sh labflow.test</code> và <code>rndc reload</code>). Trên laptop chạy <code>for i in $(seq 1 12); do date +%T; dig +noall +answer api.labflow.test; sleep 15; done</code>.</li>
<li>Chỉ đổi IP sang <code>.11</code> sau khi TTL hiện trên laptop đã giảm về 10. Ghi giờ đổi và giờ laptop thấy <code>.11</code> lần đầu.</li>
<li>Hỏi <code>blog.labflow.test</code> (chưa tồn tại), rồi tạo nó trên ns1. Người dùng sẽ phải chờ bao lâu? Chứng minh bằng SOA trong câu trả lời NXDOMAIN.</li>
</ol>
<p><strong>Đạt khi:</strong> kế hoạch có thời điểm cụ thể, buổi diễn tập cho thấy IP mới trong khoảng ~10–15 s sau khi đổi, và bạn giải thích được con số 300 s của <code>blog</code>.</p>
<details><summary>Lời giải</summary>
<p>1) Ngày −1 (hoặc ít nhất 300 s trước): đặt TTL 300 → 30. Chờ ≥ 300 s. Đổi IP; giữ máy chủ cũ thêm ≥ 30 s cộng 30 s của JVM nếu có client Java gọi tới (cho chắc thì 5 phút). Kiểm bằng <code>dig @203.0.113.53</code> và <code>@203.0.113.54</code>. Sau một ngày không phải quay lui, đặt TTL lại 300 (hoặc 3600). 2–3) Laptop cho thấy TTL đếm ngược từ ~120 về 10 trong tối đa hai phút (120 cũ phải hết trước). Sau khi đổi, lượt hỏi kế tiếp hoặc lượt sau nữa cho thấy <code>.11</code> — tối đa 10 s cache cộng 15 s giữa hai lượt hỏi. 4) NXDOMAIN với <code>labflow.test. 300 IN SOA … 300</code> ở phần authority: TTL âm là min(300, 300) = 300 s, tức tới 5 phút; xoá cả vùng trên resolver nhà mạng (<code>unbound-control flush_zone labflow.test</code>) để thấy ngay.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['TTL — time to live (thời gian được giữ)', 'Số giây mọi cache được giữ một bản ghi; đếm ngược trong cache, cố định ở máy chủ authoritative.'],
    ['cache hit / miss (trúng / trượt cache)', 'Trả lời từ bộ nhớ / phải đi hỏi lên trên.'],
    ['negative caching (cache âm)', 'Cache câu trả lời NXDOMAIN/NODATA trong min(TTL của SOA, minimum của SOA) giây (RFC 2308).'],
    ['aggressive NSEC (RFC 8198)', 'Resolver dùng các khoảng NSEC có chữ ký đã cache để trả lời “không tồn tại” mà không hỏi.'],
    ['networkaddress.cache.ttl', 'Thiết lập cache DNS riêng của JVM (mặc định 30 s khi không có security manager).'],
    ['libuv thread pool', 'Các luồng phụ của Node (mặc định 4) cho getaddrinfo, fs, crypto; DNS chỉ được dùng tối đa một nửa.'],
    ['flush (xoá cache)', 'Gỡ mục khỏi cache bạn kiểm soát; resolver công cộng có trang xin xoá riêng.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Máy chủ authoritative luôn đưa TTL đầy đủ; cache đếm ngược và không hỏi lại cho tới khi về 0.</li>
<li>Thay đổi tới người dùng sau khoảng TTL đang nằm trong cache <em>lúc bạn đổi</em>: hạ TTL, chờ hết TTL cũ, rồi mới đổi (làm sai thứ tự, ta đo được 1 phút 45 giây IP cũ).</li>
<li>NXDOMAIN được cache trong min(TTL của SOA, minimum) — 300 s trong lab, 1800 s với cuongthai.com; với DNSSEC, xoá một tên có thể chưa đủ.</li>
<li>Java mặc định cache lần tra 30 s; Node không cache gì.</li>
<li>Node chạy <code>dns.lookup</code> trên pool của libuv và chỉ cho DNS dùng nửa pool: một máy chủ DNS chết làm các lần tra xếp hàng tới 20 s.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc2308', '📄', 'RFC 2308 — Cache âm cho câu hỏi DNS', 'Cache NXDOMAIN/NODATA và minimum của SOA.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8198', '📄', 'RFC 8198 — Dùng chủ động cache đã kiểm DNSSEC', 'Vì sao xoá một tên là chưa đủ.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8767', '📄', 'RFC 8767 — Trả dữ liệu cũ để DNS bền hơn', 'Resolver tiếp tục trả bản ghi đã hết hạn khi máy chủ authoritative sập.', 'Mở')}
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/net/InetAddress.html', '☕', 'Java 21 — cache của InetAddress', 'networkaddress.cache.ttl và cache.negative.ttl.', 'Mở')}
${L('https://github.com/openjdk/jdk21u/blob/master/src/java.base/share/classes/sun/net/InetAddressCachePolicy.java', '☕', 'OpenJDK — InetAddressCachePolicy.java', 'DEFAULT_POSITIVE = 30 giây.', 'Mở')}
${L('https://github.com/libuv/libuv/blob/v1.x/src/threadpool.c', '⚙️', 'libuv — threadpool.c', 'I/O chậm (DNS) bị giới hạn ở (threads + 1) / 2.', 'Mở')}
${L('https://nodejs.org/api/dns.html', '📄', 'Node.js — module dns', 'dns.lookup chạy trên thread pool của libuv; dns.resolve dùng mạng trực tiếp.', 'Mở')}
${L('https://nodejs.org/api/http.html', '📄', 'Node.js — http.globalAgent', 'Mặc định Keep-Alive và timeout 5 giây từ bản v19.0.0.', 'Mở')}
${L('https://unbound.docs.nlnetlabs.nl/en/latest/manpages/unbound.conf.html', '📄', 'Tài liệu unbound.conf', 'cache-max-ttl, aggressive-nsec, serve-expired.', 'Mở')}
</div>
`,
};
