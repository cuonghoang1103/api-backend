/**
 * 11.2 — Log DNS (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s11/dns'] (router OpenWrt dnsmasq 2.93 logqueries=1 + bản gửi về lab7; Windows Server 2025 DNS-Client/Operational 3006/3008/3020,
 * ipconfig /displaydns; systemd-resolved 255 trên lab7; android-7f3a chạy ./_demo/s11/dns/dns-la.sh giả lập DGA, đường hầm TXT, gọi về mỗi 15 s — mọi tên
 * dưới .test, router trả lời tại chỗ). OUT['s11/agh'] (AdGuard Home v1.0.0 trong Docker, query log JSON qua API). Tên DGA ngẫu nhiên đổi mỗi lần chạy;
 * lời chỉ dùng số tất định: 37/38 truy vấn, 36 NXDOMAIN, nhãn 50 và 35 ký tự, +15 s.
 * Nguồn: Mandiant/Google Cloud blog SUNBURST 13/12/2020 (DGA tên miền con avsvmcloud[.]com), MITRE T1071.004, T1568.002, T1048 (GET 200 ngày 24/11/2026).
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'DNS logs on clients, resolvers and servers|||Log DNS: DNS Client của Windows, ipconfig /displaydns, systemd-resolved, query log Pi-hole/AdGuard, ghi truy vấn ở máy chủ',
  slug: 'log-11-2-dns',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Gần như mọi kết nối đều bắt đầu bằng một câu hỏi DNS — nên log DNS là danh sách "ai định nói chuyện với ai". Chạy thật: bật query log trên router (dnsmasq, cùng định dạng Pi-hole), đọc query/forwarded/reply/NXDOMAIN; AdGuard Home ghi JSON và chặn tên miền; Windows ghi 3006/3008/3020 trong DNS-Client/Operational, ipconfig /displaydns; systemd-resolved trên Linux. Rồi một thiết bị giả lập ba hành vi xấu — tên miền ngẫu nhiên (DGA), nhãn TXT dài (đường hầm DNS), gọi về đều 15 giây — và ba lệnh awk lôi cả ba ra khỏi log.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>DNS log: the list of everyone your devices intended to talk to</h2>
<p class="lead">Before a browser, an app or a piece of malware opens a connection, it almost always asks DNS "what is the address of this name?". A DNS log is therefore the cheapest, smallest and most revealing network log you can keep: it shows intentions, even for connections that were later blocked or encrypted. This lesson reads DNS logs at four places — the router, a home DNS filter, Windows, and Linux — and then hunts three classic bad patterns in it.</p>

<h3>The everyday picture: the phone book at the front desk</h3>
<p>In an office building without a directory board, every visitor asks the receptionist "which floor is company X?". The receptionist's notebook of questions tells you who meant to visit whom — even visitors who were turned away at the lift. A visitor who asks for 25 companies that do not exist, or comes every 15 minutes exactly to ask for the same office, deserves attention.</p>

<h3>Where DNS can be logged</h3>
<table>
<thead><tr><th>Place</th><th>What it sees</th><th>Example in this lesson</th></tr></thead>
<tbody>
<tr><td>The device itself</td><td>Every lookup by every program, including cache hits; process id on Windows</td><td>Windows DNS-Client/Operational, systemd-resolved</td></tr>
<tr><td>The home/office resolver</td><td>Every device on the LAN, only questions that miss the device's cache</td><td>dnsmasq on the router, AdGuard Home / Pi-hole</td></tr>
<tr><td>Upstream resolver (ISP, 1.1.1.1, 8.8.8.8)</td><td>Everything your router forwards — not yours to read</td><td>—</td></tr>
<tr><td>Authoritative server of a domain</td><td>Questions about that domain only (yours, if you run one)</td><td>Chapter 13 (cloud DNS logs)</td></tr>
</tbody>
</table>

<h3>Step 1 — the router as a DNS log (dnsmasq)</h3>
${lenh('s11/dns', 0)}
${lenh('s11/dns', 1)}
${lenh('s11/dns', 2)}
${lenh('s11/dns', 3)}
<p>One option (<code>logqueries</code>, i.e. dnsmasq <code>--log-queries=extra</code> on OpenWrt) and every question is logged. Read a group of lines by its serial number (<code>1</code>, <code>2</code>…) and client <code>IP/port</code>: <strong>query[A]</strong> (who asked what, record type A = IPv4, AAAA = IPv6, TXT = text…), <strong>forwarded … to 1.1.1.1</strong> (the router did not know, asked upstream), <strong>reply … is 111.65.250.2</strong> or <strong>is NXDOMAIN</strong> ("no such name"), and <code>cached</code> when the router answered from memory. <code>config … is NXDOMAIN</code> means the router answered from its own configuration without asking anyone — here a device asking its own hostname under the local <code>.lan</code> domain. Notice what is <em>missing</em>: the phone ran <code>dig vnexpress.net</code> twice but the router saw it once. The second answer came from the device's own cache (systemd-resolved on 127.0.0.53). Every layer of cache hides repeats from the layer above — so "1 query in the router log" can mean "100 visits".</p>

<h3>Step 2 — a family DNS filter: AdGuard Home (and Pi-hole)</h3>
<p>Pi-hole and AdGuard Home are the two popular "DNS for the whole house" boxes: they block ads and trackers by name and keep a query log. Pi-hole's engine (FTL) is built on dnsmasq, so its log lines are the ones you just read. AdGuard Home keeps its log as JSON; here it runs in Docker with two blocking rules:</p>
${lenh('s11/agh', 0)}
${lenh('s11/agh', 1)}
${lenh('s11/agh', 2)}
${lenh('s11/agh', 3)}
${lenh('s11/agh', 4)}
${lenh('s11/agh', 5)}
${lenh('s11/agh', 6)}
${lenh('s11/agh', 7)}
<p>Each entry has the client, question, answer, <code>reason</code> (<code>FilteredBlackList</code> = blocked by a rule — the answer is 0.0.0.0; <code>NotFilteredNotFound</code> = allowed), whether it was <code>cached</code>, which <code>upstream</code> answered, and the time in <strong>UTC</strong> (the <code>Z</code>) — 04:39 UTC is 11:39 in Vietnam; Lesson 1.5 again. The file <code>querylog.json</code> appears only after a flush (here, after a restart): the newest entries live in memory first. A home filter is also where privacy starts to matter: it records every site each family member visits. Keep it short (AdGuard defaults to 90 days, adjustable) and tell the people whose questions you log.</p>

<h3>Step 3 — Windows: the DNS Client log and the cache</h3>
${lenh('s11/dns', 4)}
${lenh('s11/dns', 5)}
${lenh('s11/dns', 6)}
${lenh('s11/dns', 7)}
<p>The channel <code>Microsoft-Windows-DNS-Client/Operational</code> is off by default; <code>wevtutil sl … /e:true</code> (or Event Viewer → Applications and Services Logs → Microsoft → Windows → DNS Client Events → Operational → Enable Log) turns it on. Three events per lookup: <strong>3006</strong> (query called), <strong>3008</strong> (query completed, status 0 = success, results), <strong>3020</strong> (response returned, with the <strong>client PID</strong> — which process asked; match it with <code>Get-Process -Id</code> or with Sysmon Event 22 that records the image name, Chapter 5). The cache (<code>ipconfig /displaydns</code>, <code>Get-DnsClientCache</code>) is not a log: it holds only names still within their TTL and vanishes with <code>ipconfig /flushdns</code> or a reboot. It is useful in the first minutes of an incident and useless the next day. Cross-check from the router — the same laptop seen from outside:</p>
${lenh('s11/dns', 9)}

<h3>Step 4 — Linux: systemd-resolved</h3>
${lenh('s11/dns', 10)}
${lenh('s11/dns', 11)}
${lenh('s11/dns', 12)}
<p>systemd-resolved does not log queries by default. <code>resolvectl statistics</code> gives counters (cache hits and misses, timeouts); <code>resolvectl log-level debug</code> temporarily writes every lookup into the journal ("Looking up RR for example.org IN A", "Cache miss…"), and <code>resolvectl monitor</code> (systemd 254+) shows live queries. Debug level is very noisy — turn it back to <code>info</code> as soon as you have what you need, exactly as above.</p>

<h3>Step 5 — three bad patterns, three awk commands</h3>
<p>Now the device <code>android-7f3a</code> runs a small script that imitates malware behaviour. All names are under <code>.test</code> (a TLD reserved for testing, RFC 6761) and the router answers them locally, so nothing leaves the lab:</p>
${ma('bash', 's11/dns/dns-la.sh')}
${lenh('s11/dns', 13)}
${lenh('s11/dns', 14)}
${lenh('s11/dns', 15)}
${lenh('s11/dns', 16)}
<p><strong>Pattern 1 — DGA (domain generation algorithm):</strong> many never-seen, random-looking names, almost all NXDOMAIN. Malware generates hundreds of names a day and the attacker registers only one; the infected machine tries them all. In the log: one client with a burst of NXDOMAIN (36 here) and names of the same length with no vowels pattern. Normal devices produce a few NXDOMAIN (typos, the device's own name as above), not dozens per minute.</p>
${lenh('s11/dns', 17)}
<p><strong>Pattern 2 — DNS tunnelling / exfiltration:</strong> data encoded into the name itself, in labels of 30–63 characters, often TXT queries to one domain. DNS is allowed almost everywhere, so it is a sneaky exit. One awk line measures the longest label of every question — normal names rarely exceed 20–25 characters per label.</p>
${lenh('s11/dns', 18)}
<p><strong>Pattern 3 — beaconing:</strong> the same name at a fixed interval (+15 s, every time). Humans are irregular; software calling home is a metronome. Real malware adds random "jitter", so look for a strong peak in the interval histogram rather than exact equality.</p>

<h3>🛡️ Attacker's corner: SUNBURST (SolarWinds, 2020)</h3>
<p>The SolarWinds Orion backdoor disclosed in December 2020 stayed dormant up to two weeks, then resolved subdomains of <code>avsvmcloud[.]com</code> built by a domain generation algorithm; the DNS answer (a CNAME) told the infected server which command-and-control domain to use next (Mandiant, 13 Dec 2020). Victims whose resolvers logged queries could later search for that one domain and find every infected machine in minutes; victims without DNS logs could not. In ATT&amp;CK terms: T1071.004 (command and control over DNS), T1568.002 (DGA), T1048 (exfiltration over an alternative protocol). Defence for small teams: keep resolver query logs for weeks, force all devices through your resolver (block outbound 53 except from it — and DNS-over-HTTPS in browsers can bypass this), and alert on NXDOMAIN bursts and very long labels.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Why is DNS logging valuable even when traffic is encrypted?" — names are asked before TLS starts; intent is visible even when content is not.</li>
<li>"What does an NXDOMAIN spike from one host suggest?" — DGA malware, a misconfiguration, or a typo loop; check the names.</li>
<li>"How would you detect DNS tunnelling?" — long labels, high entropy, many unique subdomains of one domain, TXT/NULL record types, volume per client.</li>
<li>"Where do you look for which process made a DNS request on Windows?" — DNS-Client 3020 (client PID) or Sysmon Event 22.</li>
<li>"What is the privacy risk of DNS logs?" — browsing history of every user; minimise, restrict, set retention (Chapter 16).</li>
</ul>

<h3>Real-world situations</h3>
<ul>
<li><strong>"The app cannot reach the API from the customer's network."</strong> Ask for the resolver's answer to the API name first. Half of "network problems" are a different DNS answer inside the customer's network (split DNS, a stale record).</li>
<li><strong>Japanese customer's security check</strong> (common in Vietnamese outsourcing): "does your office keep DNS logs, and for how long?" — now you know what that log looks like and where it lives.</li>
<li><strong>At home:</strong> a smart TV or a cheap camera that asks for the same strange name every few minutes all night is worth a look in the AdGuard/Pi-hole log.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>On your Windows PC: enable the DNS Client Operational log, open a few sites, and list the 10 most asked names in the last hour with PowerShell.</li>
<li>On the lab log (or the Lab 11 sample <code>wrt-nha.log</code>): print, for each client IP, the number of NXDOMAIN answers. (Hint: the <code>config … is NXDOMAIN</code> and <code>reply … is NXDOMAIN</code> lines carry the client in field 5.)</li>
<li>Decode the two TXT labels from Step 5 back to the original text. What did the "malware" try to send?</li>
</ol>
<p><strong>Pass:</strong> (1) e.g. <code>Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-DNS-Client/Operational'; Id=3008; StartTime=(Get-Date).AddHours(-1)} | ForEach-Object { ($_.Message -split ' ')[7].TrimEnd(',') } | Group-Object | Sort-Object Count -Descending | Select-Object -First 10 Count,Name</code> — and you notice Windows' own names (Microsoft update/telemetry, <code>wpad</code>) among yours; (2) <code>awk '/ is NXDOMAIN/ {split($5, a, "/"); print a[1]}' wrt-nha.log | sort | uniq -c</code> → 192.168.56.142 has 36; (3) join the first labels in order, upper-case, pad with <code>=</code> to a multiple of 8, <code>base32 -d</code> (the Lab 11 answer shows the exact command) → <code>tai-khoan=an;mat-khau=LabGia-123;the=4111111111111111</code>: an account, a password and a card number — fake, but exactly what real exfiltration looks like.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['query / forwarded / reply / cached', 'The four kinds of dnsmasq query-log lines.'],
  ['NXDOMAIN', 'Answer "this name does not exist".'],
  ['DNS-Client/Operational 3006/3008/3020', 'Windows DNS client events: called, completed, response with client PID.'],
  ['DGA', 'Domain generation algorithm: malware tries many generated names.'],
  ['DNS tunnelling', 'Data hidden inside DNS names/records to cross firewalls.'],
  ['Beaconing', 'Regular, periodic contact with the same destination.'],
  ['.test', 'TLD reserved for testing (RFC 6761); never resolves on the Internet.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>DNS logs show intent; a single resolver log covers every device on the LAN.</li>
<li>Caches hide repeats: one line upstream may mean many visits.</li>
<li>Windows: enable DNS-Client/Operational; 3020 gives the process id. Linux: resolved debug only while investigating.</li>
<li>Hunt NXDOMAIN bursts (DGA), long labels (tunnelling), fixed intervals (beaconing).</li>
<li>DNS logs are personal data: short retention, limited access.</li>
</ul>
${nguon('📘', 'dnsmasq manual', '--log-queries, --log-facility, cache', 'https://thekelleys.org.uk/dnsmasq/docs/dnsmasq-man.html')}
${nguon('📘', 'Pi-hole — FTLDNS', 'Pi-hole engine is a dnsmasq fork: same log format', 'https://docs.pi-hole.net/ftldns/')}
${nguon('📘', 'AdGuard Home — Configuration', 'querylog interval, file, privacy options', 'https://github.com/AdguardTeam/AdGuardHome/wiki/Configuration')}
${nguon('🛡️', 'Mandiant — SUNBURST backdoor (Dec 2020)', 'DGA subdomains of avsvmcloud[.]com, CNAME to C2', 'https://cloud.google.com/blog/topics/threat-intelligence/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor')}
${nguon('🛡️', 'MITRE ATT&CK T1071.004 — Application Layer Protocol: DNS', 'C2 over DNS; see also T1568.002 (DGA), T1048', 'https://attack.mitre.org/techniques/T1071/004/')}
${lienKet({ khoa: 'network-security', bai: 'netsec-7-5-loc-dns', title: 'Network Security 7.5 — DNS filtering and logging', sub: 'Setting up Pi-hole/AdGuard Home as a detection tool', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Log DNS: danh sách mọi nơi thiết bị của bạn định nói chuyện</h2>
<p class="lead">Trước khi trình duyệt, ứng dụng hay một con mã độc mở kết nối, gần như lúc nào nó cũng hỏi DNS "tên này địa chỉ là gì?". Vì vậy log DNS là loại log mạng rẻ nhất, nhỏ nhất mà lại lộ nhiều nhất: nó cho thấy ý định, kể cả với những kết nối sau đó bị chặn hay đã mã hoá. Bài này đọc log DNS ở bốn chỗ — router, bộ lọc DNS gia đình, Windows và Linux — rồi săn ba mẫu xấu kinh điển trong đó.</p>

<h3>Liên tưởng đời thường: cuốn sổ ở quầy lễ tân</h3>
<p>Ở một toà văn phòng không có bảng chỉ dẫn, khách nào cũng phải hỏi lễ tân "công ty X ở tầng mấy?". Cuốn sổ ghi các câu hỏi đó cho biết ai định gặp ai — kể cả những người bị chặn ở thang máy. Một vị khách hỏi 25 công ty không hề tồn tại, hay cứ đúng 15 phút lại đến hỏi cùng một văn phòng, thì đáng để ý.</p>

<h3>DNS có thể được ghi ở đâu</h3>
<table>
<thead><tr><th>Chỗ</th><th>Thấy được gì</th><th>Ví dụ trong bài</th></tr></thead>
<tbody>
<tr><td>Ngay trên thiết bị</td><td>Mọi lần tra của mọi chương trình, kể cả lần trúng cache; trên Windows có cả mã tiến trình</td><td>Windows DNS-Client/Operational, systemd-resolved</td></tr>
<tr><td>Bộ phân giải của nhà/văn phòng</td><td>Mọi thiết bị trong LAN, nhưng chỉ những câu hỏi trượt cache của thiết bị</td><td>dnsmasq trên router, AdGuard Home / Pi-hole</td></tr>
<tr><td>Bộ phân giải phía trên (nhà mạng, 1.1.1.1, 8.8.8.8)</td><td>Mọi thứ router chuyển lên — không phải của bạn để đọc</td><td>—</td></tr>
<tr><td>Máy chủ có thẩm quyền của một tên miền</td><td>Chỉ câu hỏi về tên miền đó (của bạn, nếu bạn tự chạy)</td><td>Chương 13 (log DNS trên cloud)</td></tr>
</tbody>
</table>

<h3>Bước 1 — router làm log DNS (dnsmasq)</h3>
${lenh('s11/dns', 0)}
${lenh('s11/dns', 1)}
${lenh('s11/dns', 2)}
${lenh('s11/dns', 3)}
<p>Chỉ một tuỳ chọn (<code>logqueries</code>, tức dnsmasq <code>--log-queries=extra</code> trên OpenWrt) là mọi câu hỏi đều được ghi. Đọc theo nhóm dòng có cùng số thứ tự (<code>1</code>, <code>2</code>…) và <code>IP/cổng</code> của máy hỏi: <strong>query[A]</strong> (ai hỏi gì; loại bản ghi A = IPv4, AAAA = IPv6, TXT = văn bản…), <strong>forwarded … to 1.1.1.1</strong> (router không biết, hỏi lên trên), <strong>reply … is 111.65.250.2</strong> hoặc <strong>is NXDOMAIN</strong> ("không có tên này"), và <code>cached</code> khi router trả lời từ bộ nhớ. <code>config … is NXDOMAIN</code> nghĩa là router tự trả lời theo cấu hình của nó mà không hỏi ai — ở đây là thiết bị hỏi chính tên máy của nó dưới tên miền nội bộ <code>.lan</code>. Để ý cái <em>bị thiếu</em>: điện thoại chạy <code>dig vnexpress.net</code> hai lần mà router chỉ thấy một. Câu trả lời thứ hai đến từ cache của chính thiết bị (systemd-resolved ở 127.0.0.53). Mỗi tầng cache che các lần lặp khỏi tầng trên — nên "1 truy vấn trong log router" có thể nghĩa là "100 lần ghé".</p>

<h3>Bước 2 — bộ lọc DNS gia đình: AdGuard Home (và Pi-hole)</h3>
<p>Pi-hole và AdGuard Home là hai cái hộp "DNS cho cả nhà" phổ biến: chặn quảng cáo và trình theo dõi theo tên, và giữ query log. Lõi của Pi-hole (FTL) dựng trên dnsmasq, nên dòng log của nó chính là những dòng bạn vừa đọc. AdGuard Home giữ log dạng JSON; ở đây nó chạy trong Docker với hai luật chặn:</p>
${lenh('s11/agh', 0)}
${lenh('s11/agh', 1)}
${lenh('s11/agh', 2)}
${lenh('s11/agh', 3)}
${lenh('s11/agh', 4)}
${lenh('s11/agh', 5)}
${lenh('s11/agh', 6)}
${lenh('s11/agh', 7)}
<p>Mỗi bản ghi có máy hỏi, câu hỏi, câu trả lời, <code>reason</code> (<code>FilteredBlackList</code> = bị luật chặn — trả về 0.0.0.0; <code>NotFilteredNotFound</code> = cho qua), có <code>cached</code> không, <code>upstream</code> nào trả lời, và thời gian theo <strong>UTC</strong> (chữ <code>Z</code>) — 04:39 UTC là 11:39 giờ Việt Nam; lại là Bài 1.5. Tệp <code>querylog.json</code> chỉ xuất hiện sau khi ghi xuống đĩa (ở đây là sau khi khởi động lại): bản ghi mới nhất nằm trong bộ nhớ trước. Bộ lọc gia đình cũng là chỗ quyền riêng tư bắt đầu quan trọng: nó ghi mọi trang mà từng người trong nhà ghé. Giữ ngắn thôi (AdGuard mặc định 90 ngày, chỉnh được) và báo cho những người mà bạn đang ghi câu hỏi của họ.</p>

<h3>Bước 3 — Windows: log DNS Client và bộ nhớ đệm</h3>
${lenh('s11/dns', 4)}
${lenh('s11/dns', 5)}
${lenh('s11/dns', 6)}
${lenh('s11/dns', 7)}
<p>Kênh <code>Microsoft-Windows-DNS-Client/Operational</code> mặc định tắt; <code>wevtutil sl … /e:true</code> (hoặc Event Viewer → Applications and Services Logs → Microsoft → Windows → DNS Client Events → Operational → Enable Log) để bật. Mỗi lần tra có ba sự kiện: <strong>3006</strong> (bắt đầu hỏi), <strong>3008</strong> (hỏi xong, status 0 = thành công, kèm kết quả), <strong>3020</strong> (trả kết quả, có <strong>client PID</strong> — tiến trình nào hỏi; đối chiếu bằng <code>Get-Process -Id</code> hoặc Sysmon Event 22 vốn ghi cả tên chương trình, Chương 5). Bộ nhớ đệm (<code>ipconfig /displaydns</code>, <code>Get-DnsClientCache</code>) không phải là log: nó chỉ giữ những tên còn hạn TTL và biến mất khi <code>ipconfig /flushdns</code> hoặc khởi động lại. Hữu ích trong mấy phút đầu của sự cố, vô dụng vào hôm sau. Đối chiếu từ phía router — cùng chiếc laptop nhìn từ bên ngoài:</p>
${lenh('s11/dns', 9)}

<h3>Bước 4 — Linux: systemd-resolved</h3>
${lenh('s11/dns', 10)}
${lenh('s11/dns', 11)}
${lenh('s11/dns', 12)}
<p>systemd-resolved mặc định không ghi truy vấn. <code>resolvectl statistics</code> cho bộ đếm (trúng/trượt cache, quá hạn); <code>resolvectl log-level debug</code> tạm thời ghi mọi lần tra vào journal ("Looking up RR for example.org IN A", "Cache miss…"), còn <code>resolvectl monitor</code> (systemd 254 trở lên) hiện truy vấn theo thời gian thực. Mức debug rất ồn — có đủ thứ cần rồi thì trả về <code>info</code> ngay, đúng như trên.</p>

<h3>Bước 5 — ba mẫu xấu, ba lệnh awk</h3>
<p>Giờ thiết bị <code>android-7f3a</code> chạy một đoạn script nhỏ bắt chước hành vi mã độc. Mọi tên đều dưới <code>.test</code> (tên miền cấp cao dành riêng cho thử nghiệm, RFC 6761) và router trả lời tại chỗ, nên không gì lọt ra ngoài lab:</p>
${ma('bash', 's11/dns/dns-la.sh')}
${lenh('s11/dns', 13)}
${lenh('s11/dns', 14)}
${lenh('s11/dns', 15)}
${lenh('s11/dns', 16)}
<p><strong>Mẫu 1 — DGA (thuật toán sinh tên miền):</strong> rất nhiều tên chưa từng thấy, trông ngẫu nhiên, gần như toàn NXDOMAIN. Mã độc sinh ra hàng trăm tên mỗi ngày còn kẻ tấn công chỉ đăng ký một; máy nhiễm thử hết lượt. Trong log: một máy hỏi với một tràng NXDOMAIN (ở đây 36) và các tên cùng độ dài, chẳng giống chữ của ai. Thiết bị bình thường chỉ có vài NXDOMAIN (gõ nhầm, hỏi tên chính nó như trên), không phải hàng chục mỗi phút.</p>
${lenh('s11/dns', 17)}
<p><strong>Mẫu 2 — đường hầm DNS / rút dữ liệu:</strong> dữ liệu được mã hoá vào chính cái tên, thành các nhãn dài 30–63 ký tự, thường là truy vấn TXT tới cùng một tên miền. DNS được cho qua gần như ở mọi nơi, nên đây là lối ra lén lút. Một dòng awk đo nhãn dài nhất của mọi câu hỏi — tên bình thường hiếm khi quá 20–25 ký tự mỗi nhãn.</p>
${lenh('s11/dns', 18)}
<p><strong>Mẫu 3 — gọi về (beaconing):</strong> cùng một tên, đều đặn theo nhịp (+15 s, lần nào cũng vậy). Con người thì thất thường; phần mềm gọi về nhà thì như máy đếm nhịp. Mã độc thật thêm "jitter" ngẫu nhiên, nên hãy tìm một đỉnh nổi bật trong biểu đồ khoảng cách thay vì đòi bằng nhau tuyệt đối.</p>

<h3>🛡️ Góc hacker: SUNBURST (SolarWinds, 2020)</h3>
<p>Cửa hậu trong SolarWinds Orion công bố tháng 12/2020 ngủ yên tới hai tuần, rồi tra các tên miền con của <code>avsvmcloud[.]com</code> được sinh bằng thuật toán DGA; câu trả lời DNS (một CNAME) cho máy chủ nhiễm biết tên miền điều khiển nào dùng tiếp theo (Mandiant, 13/12/2020). Nạn nhân nào có bộ phân giải ghi truy vấn thì sau đó chỉ cần tìm đúng tên miền đó là thấy mọi máy nhiễm trong vài phút; nạn nhân không có log DNS thì chịu. Theo ATT&amp;CK: T1071.004 (điều khiển qua DNS), T1568.002 (DGA), T1048 (rút dữ liệu qua giao thức khác). Cách phòng cho đội nhỏ: giữ query log của bộ phân giải vài tuần, buộc mọi thiết bị đi qua bộ phân giải của mình (chặn cổng 53 đi ra trừ từ nó — và DNS-over-HTTPS trong trình duyệt có thể vượt qua cách này), cảnh báo khi có tràng NXDOMAIN hoặc nhãn rất dài.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Vì sao log DNS có giá trị kể cả khi lưu lượng đã mã hoá?" — tên được hỏi trước khi TLS bắt đầu; thấy được ý định dù không thấy nội dung.</li>
<li>"Một máy đột nhiên có rất nhiều NXDOMAIN gợi ý điều gì?" — mã độc DGA, cấu hình sai, hoặc vòng lặp gõ nhầm; xem các tên.</li>
<li>"Bạn phát hiện đường hầm DNS thế nào?" — nhãn dài, độ ngẫu nhiên cao, rất nhiều tên miền con khác nhau của một tên miền, loại TXT/NULL, lưu lượng theo từng máy.</li>
<li>"Trên Windows, tìm tiến trình nào đã hỏi DNS ở đâu?" — DNS-Client 3020 (client PID) hoặc Sysmon Event 22.</li>
<li>"Rủi ro quyền riêng tư của log DNS là gì?" — lịch sử duyệt web của mọi người dùng; tối thiểu hoá, giới hạn quyền, đặt hạn lưu (Chương 16).</li>
</ul>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>"Ứng dụng không gọi được API từ mạng của khách hàng."</strong> Hỏi trước tiên câu trả lời của bộ phân giải bên khách cho tên API đó. Một nửa "sự cố mạng" là DNS bên trong mạng khách trả lời khác (split DNS, bản ghi cũ).</li>
<li><strong>Khách hàng Nhật kiểm tra bảo mật</strong> (hay gặp ở outsourcing Việt Nam): "văn phòng bạn có giữ log DNS không, giữ bao lâu?" — giờ bạn biết log đó trông thế nào và nằm ở đâu.</li>
<li><strong>Ở nhà:</strong> một chiếc smart TV hay camera rẻ tiền cứ vài phút lại hỏi cùng một cái tên lạ suốt đêm thì đáng xem trong log AdGuard/Pi-hole.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy Windows của bạn: bật log DNS Client Operational, mở vài trang web, rồi liệt kê 10 tên được hỏi nhiều nhất trong một giờ qua bằng PowerShell.</li>
<li>Trên log lab (hoặc tệp mẫu <code>wrt-nha.log</code> của Lab 11): in số câu trả lời NXDOMAIN theo từng IP máy hỏi. (Gợi ý: các dòng <code>config … is NXDOMAIN</code> và <code>reply … is NXDOMAIN</code> mang máy hỏi ở trường 5.)</li>
<li>Giải mã hai nhãn TXT ở Bước 5 về lại văn bản gốc. "Mã độc" đã định gửi đi cái gì?</li>
</ol>
<p><strong>Đạt khi:</strong> (1) ví dụ <code>Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-DNS-Client/Operational'; Id=3008; StartTime=(Get-Date).AddHours(-1)} | ForEach-Object { ($_.Message -split ' ')[7].TrimEnd(',') } | Group-Object | Sort-Object Count -Descending | Select-Object -First 10 Count,Name</code> — và bạn nhận ra các tên của chính Windows (cập nhật/đo đạc của Microsoft, <code>wpad</code>) lẫn trong tên của mình; (2) <code>awk '/ is NXDOMAIN/ {split($5, a, "/"); print a[1]}' wrt-nha.log | sort | uniq -c</code> → 192.168.56.142 có 36; (3) nối các nhãn đầu theo thứ tự, đổi sang chữ hoa, đệm <code>=</code> cho đủ bội số 8, <code>base32 -d</code> (đáp án Lab 11 có đúng lệnh) → <code>tai-khoan=an;mat-khau=LabGia-123;the=4111111111111111</code>: một tài khoản, một mật khẩu và một số thẻ — giả thôi, nhưng đúng hình dạng của một vụ rút dữ liệu thật.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['query / forwarded / reply / cached', 'Bốn kiểu dòng trong query log của dnsmasq.'],
  ['NXDOMAIN', 'Câu trả lời "tên này không tồn tại".'],
  ['DNS-Client/Operational 3006/3008/3020', 'Sự kiện DNS client của Windows: bắt đầu, xong, trả kết quả kèm PID.'],
  ['DGA', 'Thuật toán sinh tên miền: mã độc thử rất nhiều tên tự sinh.'],
  ['Đường hầm DNS', 'Dữ liệu giấu trong tên/bản ghi DNS để vượt tường lửa.'],
  ['Gọi về (beaconing)', 'Liên lạc đều đặn, theo chu kỳ tới cùng một đích.'],
  ['.test', 'Tên miền cấp cao dành cho thử nghiệm (RFC 6761); không bao giờ phân giải trên Internet.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Log DNS cho thấy ý định; một log bộ phân giải phủ mọi thiết bị trong LAN.</li>
<li>Cache che các lần lặp: một dòng ở tầng trên có thể là nhiều lần ghé.</li>
<li>Windows: bật DNS-Client/Operational; 3020 cho mã tiến trình. Linux: chỉ bật debug của resolved khi đang điều tra.</li>
<li>Săn tràng NXDOMAIN (DGA), nhãn dài (đường hầm), nhịp cố định (gọi về).</li>
<li>Log DNS là dữ liệu cá nhân: hạn lưu ngắn, quyền đọc hẹp.</li>
</ul>
${nguon('📘', 'dnsmasq manual', '--log-queries, --log-facility, cache', 'https://thekelleys.org.uk/dnsmasq/docs/dnsmasq-man.html')}
${nguon('📘', 'Pi-hole — FTLDNS', 'Lõi Pi-hole là bản rẽ nhánh của dnsmasq: cùng định dạng log', 'https://docs.pi-hole.net/ftldns/')}
${nguon('📘', 'AdGuard Home — Configuration', 'querylog: thời hạn, tệp, tuỳ chọn riêng tư', 'https://github.com/AdguardTeam/AdGuardHome/wiki/Configuration')}
${nguon('🛡️', 'Mandiant — cửa hậu SUNBURST (12/2020)', 'Tên miền con DGA của avsvmcloud[.]com, CNAME tới máy điều khiển', 'https://cloud.google.com/blog/topics/threat-intelligence/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor')}
${nguon('🛡️', 'MITRE ATT&CK T1071.004 — Application Layer Protocol: DNS', 'Điều khiển qua DNS; xem thêm T1568.002 (DGA), T1048', 'https://attack.mitre.org/techniques/T1071/004/')}
${lienKet({ khoa: 'network-security', bai: 'netsec-7-5-loc-dns', title: 'Network Security 7.5 — Lọc và ghi log DNS', sub: 'Dựng Pi-hole/AdGuard Home làm công cụ phát hiện', cta: 'Mở bài' })}
</div>
`,
};
