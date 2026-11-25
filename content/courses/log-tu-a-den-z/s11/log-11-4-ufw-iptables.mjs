/**
 * 11.4 — Log tường lửa Linux: ufw, iptables, nftables (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s11/ufw'] — lab7 (Ubuntu 24.04, ufw 0.36 trên iptables-nft) bị keodo quét bằng nmap 7.94; mức log low/medium; ufw limit 80 bị android
 * gọi 10 lần; nftables "limit rate 5/minute … log prefix" và iptables "-m limit --limit 3/min --limit-burst 3 -j LOG" trên keodo.
 * Quan sát thật đáng nhớ: lượt quét 1000 cổng ngay sau lượt 25 cổng ghi 0 dòng — xô "burst 10, 3/phút" của ufw đã cạn. Số tất định: 10 dòng,
 * 5×200 rồi 000, 5 dòng LIMIT BLOCK, 12 lần thử → 5 dòng log, 8 lần → 3 dòng log, 8 gói DROP.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Linux firewall logs: ufw logging levels, [UFW BLOCK] lines, iptables/nftables log rules with prefixes and rate limits|||Log tường lửa Linux: mức log của ufw, dòng [UFW BLOCK], quy tắc log của iptables/nftables có tiền tố và giới hạn tốc độ',
  slug: 'log-11-4-ufw-iptables',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Trên Linux, tường lửa là một phần của nhân, nên log của nó là dòng log của nhân: [UFW BLOCK] IN= OUT= SRC= DST= PROTO= SPT= DPT=. Chạy thật: bật ufw trên máy ảo, để máy lạ quét, đọc từng trường, đếm cổng theo nguồn bằng grep/awk; so mức log low và medium; [UFW LIMIT BLOCK] khi một máy gọi quá 6 lần/30 giây; tự viết quy tắc log có tiền tố và giới hạn tốc độ bằng nftables và iptables. Và một bài học thật: quét 1000 cổng mà log ghi 0 dòng, vì giới hạn tốc độ ghi log đã cạn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Linux firewall logs are kernel messages — learn to read one line</h2>
<p class="lead">On Linux the packet filter lives in the kernel (netfilter). Whether you configure it with <code>ufw</code>, <code>firewalld</code>, raw <code>iptables</code> or <code>nftables</code>, a "log this packet" rule makes the kernel print one line per packet into the kernel log. Once you can read that line, every Linux firewall log looks the same. This lesson turns ufw on in your VM, lets a stranger scan it, reads the lines, and then shows the part people forget: firewall logging is rate-limited, so the log tells you "at least", never "exactly".</p>

<h3>The everyday picture: a guard with a rubber stamp and a small ink pad</h3>
<p>The guard stamps a note for every stranger turned away. The ink pad is small and refills slowly: if 1000 strangers arrive in one minute, the first few get a stamp and the rest are turned away without one. That is not laziness — it keeps the guard from drowning in paperwork during a riot. Linux firewall logging works exactly like that ink pad.</p>

<h3>Step 1 — turn on ufw with a sane policy</h3>
${lenh('s11/ufw', 0)}
${lenh('s11/ufw', 1)}
<p>Deny everything incoming except SSH, syslog from the router only (Lesson 11.1), and web with <code>limit</code> (more in Step 4). <code>Logging: on (low)</code> is ufw's default once enabled. (CONFIGURING ufw/nftables properly is taught in the Network Security course; here we only make it log.)</p>

<h3>Step 2 — a scan, and one line read field by field</h3>
${lenh('s11/ufw', 2)}
${lenh('s11/ufw', 3)}
<table>
<thead><tr><th>Field</th><th>Meaning</th><th>In the line above</th></tr></thead>
<tbody>
<tr><td><code>[UFW BLOCK]</code></td><td>Log prefix chosen by the rule (ufw: BLOCK, ALLOW, AUDIT, LIMIT BLOCK)</td><td>dropped by the default deny</td></tr>
<tr><td><code>IN= / OUT=</code></td><td>Interface it arrived on / would leave by (empty = local)</td><td>IN=ens4, OUT= (to this host)</td></tr>
<tr><td><code>MAC=</code></td><td>Destination MAC : source MAC : EtherType (08:00 = IPv4)</td><td>…:52:54:00:56:00:66 = keodo's NIC</td></tr>
<tr><td><code>SRC= DST=</code></td><td>Source and destination IP</td><td>192.168.56.66 → 192.168.56.10</td></tr>
<tr><td><code>LEN TTL ID</code></td><td>IP length, time-to-live, identification</td><td>LEN=44 is a bare SYN from nmap</td></tr>
<tr><td><code>PROTO SPT DPT</code></td><td>Protocol, source port, destination port</td><td>TCP 57786 → 199, 110</td></tr>
<tr><td><code>WINDOW … SYN</code></td><td>TCP window and flags</td><td>SYN only = connection attempt</td></tr>
</tbody>
</table>
${lenh('s11/ufw', 4)}
<p>The same line exists in three places: <code>/var/log/ufw.log</code> (an rsyslog rule in <code>/etc/rsyslog.d/20-ufw.conf</code> copies kernel lines containing "[UFW "), <code>/var/log/kern.log</code> and <code>/var/log/syslog</code> — and in the journal (<code>journalctl -k</code>). Three copies of a noisy log is a disk-size question (Chapter 16): many admins add <code>&amp; stop</code> to that rsyslog rule so ufw lines go only to ufw.log.</p>
${lenh('s11/ufw', 5)}
${lenh('s11/ufw', 6)}
<p>One source, ten different destination ports, all within a second: a port scan. But nmap probed 25 ports and only 10 lines exist. Why?</p>

<h3>Step 3 — the ink pad: rate limits on logging</h3>
${lenh('s11/ufw', 7)}
<p>Every ufw logging rule carries <code>-m limit --limit 3/min --limit-burst 10</code>: a bucket of 10 "log tokens", refilled at 3 per minute. The first 10 blocked packets are logged, then at most 3 per minute. The packets are still dropped — only the <em>logging</em> is limited. Now a full 1000-port scan seconds later:</p>
${lenh('s11/ufw', 8)}
${lenh('s11/ufw', 9)}
<p><strong>Zero lines</strong> for a 1000-port scan, because the bucket was already empty from the first scan. This is the most important thing to remember about firewall logs on any platform: <strong>absence of log lines is not absence of traffic</strong>. Count from firewall logs gives a lower bound; for real volume use the rule counters (<code>iptables -L -v</code>, <code>nft list ruleset</code> show packets/bytes), flow logs, or a packet capture. The kernel also has its own global limit; when it suppresses messages you see "net_ratelimit: N callbacks suppressed" in dmesg (none here).</p>

<h3>Step 4 — [UFW LIMIT BLOCK]: too many connections</h3>
${lenh('s11/ufw', 10)}
${lenh('s11/ufw', 11)}
<p><code>ufw limit 80/tcp</code> denies a source IP that attempts 6 or more new connections within 30 seconds (ufw manual); those are dropped and logged as <code>[UFW LIMIT BLOCK]</code>. The phone got five 200 responses then <code>000</code> (connection failed). In a real incident a burst of LIMIT BLOCK lines on 22 or on a login page is brute force or a misbehaving client (a mobile app retrying in a loop — common in student projects).</p>

<h3>Step 5 — logging levels</h3>
${lenh('s11/ufw', 12)}
${lenh('s11/ufw', 13)}
${lenh('s11/ufw', 14)}
${lenh('s11/ufw', 15)}
<table>
<thead><tr><th>ufw logging</th><th>What is logged (ufw manual)</th></tr></thead>
<tbody>
<tr><td>off</td><td>nothing</td></tr>
<tr><td>low (default)</td><td>blocked packets not matching the policy (rate limited), and packets matching logged rules</td></tr>
<tr><td>medium</td><td>low + invalid packets, all new connections ([UFW AUDIT]), and allowed packets not matching the policy</td></tr>
<tr><td>high</td><td>medium without rate limiting, plus all packets with rate limiting</td></tr>
<tr><td>full</td><td>high without rate limiting</td></tr>
</tbody>
</table>
<p>At <strong>medium</strong>, the same single curl produced an <code>[UFW AUDIT]</code> line (new connection seen) and, because the phone was still over its limit, a LIMIT BLOCK. Medium and above on a public server fill a disk quickly; use them for a short investigation, then go back to low.</p>

<h3>Step 6 — your own log rules: nftables and iptables</h3>
<p>Without ufw you write the log rule yourself. Always three parts: <strong>match</strong> the traffic, <strong>limit</strong> the rate, <strong>log with a prefix</strong> you can grep — then a separate rule for the decision (drop/accept).</p>
${lenh('s11/ufw', 16)}
${lenh('s11/ufw', 17)}
${lenh('s11/ufw', 18)}
${lenh('s11/ufw', 19)}
${lenh('s11/ufw', 20)}
${lenh('s11/ufw', 21)}
<p>nftables: 12 attempts, <strong>5</strong> log lines (burst 5, then 5 per minute). iptables: 8 attempts, the LOG rule counter shows <strong>3</strong> logged packets (burst 3) while the DROP counter shows <strong>8</strong> dropped. Read the counters, not only the log. Note the prefix ends with a space or colon so the rest of the line stays readable, and <code>level info</code>/<code>--log-level 6</code> sets the syslog severity (so rsyslog can route it). Modern Ubuntu, Debian and RHEL use nftables underneath even when you type <code>iptables</code> ("iptables v1.8.10 (nf_tables)").</p>

<h3>🛡️ Attacker's corner: scans are background noise — the follow-up is not</h3>
<p>Any server on the Internet is scanned within minutes of getting a public IP; large scanning services and botnets sweep the whole IPv4 space continuously. So "[UFW BLOCK] from a foreign IP" by itself is noise. What matters: (1) a scan followed by an <em>allowed</em> connection from the same source to the port it found open (check auth.log/access log for that IP right after); (2) scans from <strong>inside</strong> your network (like keodo or android here) — a compromised device mapping the LAN (ATT&amp;CK T1046 Network Service Discovery); (3) outbound blocks from a server, which reveal malware trying to call home. Defence: default-deny inbound, log drops with a rate limit, and correlate, not count.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Explain the fields of a [UFW BLOCK] line." — IN/OUT, MAC, SRC/DST, LEN/TTL, PROTO/SPT/DPT, flags.</li>
<li>"Where do firewall logs go on Ubuntu?" — kernel ring buffer → journal (-k) and rsyslog → kern.log, syslog, ufw.log.</li>
<li>"Why can a big scan produce few or no log lines?" — log rate limiting (limit/burst), kernel net_ratelimit; use counters or flow logs.</li>
<li>"How would you log dropped SSH attempts without filling the disk?" — log rule with limit + prefix before the drop rule; logrotate; ship centrally.</li>
</ul>

<h3>Real-world situations</h3>
<ul>
<li><strong>"The new microservice cannot reach the database on the same VPS."</strong> Look for OUT= or IN= blocks with DPT=5432 — a forgotten ufw rule after a reboot.</li>
<li><strong>A VPS for your graduation project</strong> shows thousands of [UFW BLOCK] lines a day: normal. Make sure SSH is key-only, then stop worrying about the count and alert on what follows (Chapter 15).</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>On your VM, enable ufw logging low and run <code>nmap -sS --top-ports 100</code> against it from another machine you own. How many [UFW BLOCK] lines? Run it again at once — how many now?</li>
<li>Print, from ufw.log, the top 3 source IPs and the number of distinct destination ports for each.</li>
<li>Write an nftables rule that logs (prefix "ssh-moi: ", 10/minute) every NEW connection to port 22 and accepts it.</li>
</ol>
<p><strong>Pass:</strong> (1) about 10 the first time and no new line the second time (measured in the lab: 10, then still 10) — the rate limit, explained in one sentence; (2) <code>sudo awk '/UFW BLOCK/ {for (i = 1; i &lt;= NF; i++) {if ($i ~ /^SRC=/) s = $i; if ($i ~ /^DPT=/) d = $i} print s, d}' /var/log/ufw.log | sort -u | awk '{print $1}' | uniq -c | sort -rn | head -n 3</code>; (3) <code>nft add rule inet lab vao tcp dport 22 ct state new limit rate 10/minute log prefix "ssh-moi: " accept</code> (in a chain with hook input) — verify with <code>journalctl -k -g ssh-moi</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['netfilter', 'Packet filtering framework in the Linux kernel (iptables/nftables are front ends).'],
  ['[UFW BLOCK] / ALLOW / AUDIT / LIMIT BLOCK', 'ufw log prefixes.'],
  ['IN= OUT= SRC= DST= SPT= DPT=', 'Interface, addresses and ports in a kernel firewall log line.'],
  ['limit / limit-burst', 'Token bucket that caps how many packets are logged.'],
  ['Log prefix', 'Fixed text added by the rule so you can grep it.'],
  ['Rule counters', 'Packets/bytes per rule: the true volume when logs are limited.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>One kernel log line format for ufw, iptables and nftables; learn the fields once.</li>
<li>ufw lines land in ufw.log, kern.log, syslog and the journal.</li>
<li>Logging is rate-limited: a log count is a lower bound; check counters.</li>
<li>LIMIT BLOCK = too many new connections; AUDIT (medium) = new connections.</li>
<li>Write log rules as match → limit → log prefix → separate decision.</li>
</ul>
${nguon('📘', 'ufw(8) — Ubuntu manpage', 'LOGGING levels off/low/medium/high/full, limit', 'https://manpages.ubuntu.com/manpages/noble/man8/ufw.8.html')}
${nguon('📘', 'nftables wiki — Logging traffic', 'log prefix, level, group; limit rate', 'https://wiki.nftables.org/wiki-nftables/index.php/Logging_traffic')}
${lienKet({ khoa: 'network-security', bai: 'netsec-2-3-ufw', title: 'Network Security 2.3 — ufw done right', sub: 'Configuring the firewall (this lesson only reads its log)', cta: 'Open' })}
${lienKet({ khoa: 'network-security', bai: 'netsec-2-2-nftables', title: 'Network Security 2.2 — Writing an nftables ruleset', sub: 'Tables, chains, hooks, sets', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Log tường lửa Linux là thông điệp của nhân — học đọc một dòng</h2>
<p class="lead">Trên Linux, bộ lọc gói nằm trong nhân (netfilter). Dù bạn cấu hình bằng <code>ufw</code>, <code>firewalld</code>, <code>iptables</code> thô hay <code>nftables</code>, một quy tắc "ghi log gói này" sẽ khiến nhân in ra một dòng cho mỗi gói vào log của nhân. Đọc được dòng đó rồi thì mọi log tường lửa Linux trông như nhau. Bài này bật ufw trên máy ảo của bạn, để một người lạ quét, đọc các dòng, rồi chỉ ra phần mọi người hay quên: ghi log tường lửa bị giới hạn tốc độ, nên log chỉ nói "ít nhất", không bao giờ nói "chính xác".</p>

<h3>Liên tưởng đời thường: chú bảo vệ với con dấu và hộp mực nhỏ</h3>
<p>Mỗi người lạ bị đuổi về, chú bảo vệ đóng một con dấu vào sổ. Hộp mực nhỏ và thấm lại chậm: nếu 1000 người lạ kéo đến trong một phút, vài người đầu có dấu, số còn lại bị đuổi mà không có dấu nào. Đó không phải lười — nó giữ cho chú không chết đuối trong giấy tờ giữa lúc hỗn loạn. Ghi log tường lửa trên Linux hoạt động y hệt hộp mực ấy.</p>

<h3>Bước 1 — bật ufw với chính sách hợp lý</h3>
${lenh('s11/ufw', 0)}
${lenh('s11/ufw', 1)}
<p>Chặn mọi thứ đi vào trừ SSH, syslog chỉ từ router (Bài 11.1), và web với <code>limit</code> (xem Bước 4). <code>Logging: on (low)</code> là mặc định của ufw khi đã bật. (CẤU HÌNH ufw/nftables cho đúng được dạy ở khoá Network Security; ở đây ta chỉ làm cho nó ghi log.)</p>

<h3>Bước 2 — một lượt quét, và đọc một dòng từng trường</h3>
${lenh('s11/ufw', 2)}
${lenh('s11/ufw', 3)}
<table>
<thead><tr><th>Trường</th><th>Ý nghĩa</th><th>Trong dòng trên</th></tr></thead>
<tbody>
<tr><td><code>[UFW BLOCK]</code></td><td>Tiền tố log do quy tắc đặt (ufw: BLOCK, ALLOW, AUDIT, LIMIT BLOCK)</td><td>bị chính sách mặc định chặn</td></tr>
<tr><td><code>IN= / OUT=</code></td><td>Giao diện gói đi vào / sẽ đi ra (rỗng = chính máy này)</td><td>IN=ens4, OUT= (tới máy này)</td></tr>
<tr><td><code>MAC=</code></td><td>MAC đích : MAC nguồn : EtherType (08:00 = IPv4)</td><td>…:52:54:00:56:00:66 = card mạng của keodo</td></tr>
<tr><td><code>SRC= DST=</code></td><td>IP nguồn và đích</td><td>192.168.56.66 → 192.168.56.10</td></tr>
<tr><td><code>LEN TTL ID</code></td><td>Độ dài gói IP, thời gian sống, số định danh</td><td>LEN=44 là một SYN trần của nmap</td></tr>
<tr><td><code>PROTO SPT DPT</code></td><td>Giao thức, cổng nguồn, cổng đích</td><td>TCP 57786 → 199, 110</td></tr>
<tr><td><code>WINDOW … SYN</code></td><td>Cửa sổ TCP và các cờ</td><td>chỉ có SYN = đang thử kết nối</td></tr>
</tbody>
</table>
${lenh('s11/ufw', 4)}
<p>Cùng một dòng nằm ở ba chỗ: <code>/var/log/ufw.log</code> (một luật rsyslog trong <code>/etc/rsyslog.d/20-ufw.conf</code> chép các dòng nhân có chứa "[UFW "), <code>/var/log/kern.log</code> và <code>/var/log/syslog</code> — và trong journal (<code>journalctl -k</code>). Ba bản sao của một log ồn ào là chuyện dung lượng đĩa (Chương 16): nhiều quản trị viên thêm <code>&amp; stop</code> vào luật rsyslog đó để dòng ufw chỉ vào ufw.log.</p>
${lenh('s11/ufw', 5)}
${lenh('s11/ufw', 6)}
<p>Một nguồn, mười cổng đích khác nhau, tất cả trong một giây: quét cổng. Nhưng nmap thăm 25 cổng mà chỉ có 10 dòng. Vì sao?</p>

<h3>Bước 3 — hộp mực: giới hạn tốc độ ghi log</h3>
${lenh('s11/ufw', 7)}
<p>Mọi quy tắc ghi log của ufw đều mang <code>-m limit --limit 3/min --limit-burst 10</code>: một cái xô chứa 10 "vé ghi log", được nạp lại 3 vé mỗi phút. 10 gói bị chặn đầu tiên được ghi, sau đó tối đa 3 gói mỗi phút. Các gói vẫn bị chặn — chỉ việc <em>ghi log</em> bị giới hạn. Giờ là một lượt quét đủ 1000 cổng ngay vài giây sau:</p>
${lenh('s11/ufw', 8)}
${lenh('s11/ufw', 9)}
<p><strong>Không dòng nào</strong> cho một lượt quét 1000 cổng, vì cái xô đã cạn từ lượt quét đầu. Đây là điều quan trọng nhất cần nhớ về log tường lửa trên mọi nền tảng: <strong>không có dòng log không có nghĩa là không có lưu lượng</strong>. Con số đếm từ log tường lửa chỉ là cận dưới; muốn biết khối lượng thật hãy dùng bộ đếm của quy tắc (<code>iptables -L -v</code>, <code>nft list ruleset</code> hiện số gói/byte), flow log, hoặc bắt gói. Nhân còn có giới hạn chung của riêng nó; khi nó nuốt bớt thông điệp, bạn sẽ thấy "net_ratelimit: N callbacks suppressed" trong dmesg (ở đây không có).</p>

<h3>Bước 4 — [UFW LIMIT BLOCK]: quá nhiều kết nối</h3>
${lenh('s11/ufw', 10)}
${lenh('s11/ufw', 11)}
<p><code>ufw limit 80/tcp</code> chặn IP nguồn nào thử từ 6 kết nối mới trở lên trong 30 giây (theo man ufw); các lần đó bị chặn và ghi là <code>[UFW LIMIT BLOCK]</code>. Chiếc điện thoại được năm lần 200 rồi <code>000</code> (kết nối hỏng). Trong sự cố thật, một tràng LIMIT BLOCK ở cổng 22 hay ở trang đăng nhập là dò mật khẩu, hoặc một client cư xử tệ (ứng dụng di động thử lại liên tục trong vòng lặp — rất hay gặp ở đồ án sinh viên).</p>

<h3>Bước 5 — các mức log</h3>
${lenh('s11/ufw', 12)}
${lenh('s11/ufw', 13)}
${lenh('s11/ufw', 14)}
${lenh('s11/ufw', 15)}
<table>
<thead><tr><th>ufw logging</th><th>Ghi những gì (theo man ufw)</th></tr></thead>
<tbody>
<tr><td>off</td><td>không ghi gì</td></tr>
<tr><td>low (mặc định)</td><td>gói bị chặn không khớp chính sách (có giới hạn tốc độ), và gói khớp các quy tắc có ghi log</td></tr>
<tr><td>medium</td><td>low + gói không hợp lệ, mọi kết nối mới ([UFW AUDIT]), và gói được cho qua không khớp chính sách</td></tr>
<tr><td>high</td><td>medium nhưng bỏ giới hạn tốc độ, cộng thêm mọi gói (có giới hạn)</td></tr>
<tr><td>full</td><td>high nhưng bỏ hết giới hạn tốc độ</td></tr>
</tbody>
</table>
<p>Ở mức <strong>medium</strong>, cùng một lần curl đã sinh một dòng <code>[UFW AUDIT]</code> (thấy kết nối mới) và, vì điện thoại vẫn đang vượt giới hạn, một dòng LIMIT BLOCK. Từ medium trở lên trên máy chủ công khai sẽ lấp đầy đĩa rất nhanh; dùng cho một cuộc điều tra ngắn rồi quay về low.</p>

<h3>Bước 6 — tự viết quy tắc log: nftables và iptables</h3>
<p>Không có ufw thì bạn tự viết quy tắc log. Luôn gồm ba phần: <strong>khớp</strong> lưu lượng, <strong>giới hạn</strong> tốc độ, <strong>ghi log kèm tiền tố</strong> để grep — rồi một quy tắc riêng cho quyết định (drop/accept).</p>
${lenh('s11/ufw', 16)}
${lenh('s11/ufw', 17)}
${lenh('s11/ufw', 18)}
${lenh('s11/ufw', 19)}
${lenh('s11/ufw', 20)}
${lenh('s11/ufw', 21)}
<p>nftables: 12 lần thử, <strong>5</strong> dòng log (burst 5, sau đó 5 mỗi phút). iptables: 8 lần thử, bộ đếm của quy tắc LOG cho thấy <strong>3</strong> gói được ghi (burst 3) trong khi bộ đếm DROP cho thấy <strong>8</strong> gói bị chặn. Hãy đọc bộ đếm, không chỉ đọc log. Để ý tiền tố kết thúc bằng dấu cách hoặc dấu hai chấm để phần còn lại của dòng vẫn dễ đọc, và <code>level info</code>/<code>--log-level 6</code> đặt mức syslog (để rsyslog định tuyến được). Ubuntu, Debian và RHEL đời mới đều dùng nftables bên dưới kể cả khi bạn gõ <code>iptables</code> ("iptables v1.8.10 (nf_tables)").</p>

<h3>🛡️ Góc hacker: quét là tiếng ồn nền — bước tiếp theo thì không</h3>
<p>Máy chủ nào trên Internet cũng bị quét trong vài phút sau khi nhận IP công khai; các dịch vụ quét lớn và botnet rà cả không gian IPv4 liên tục. Nên bản thân "[UFW BLOCK] từ một IP nước ngoài" chỉ là tiếng ồn. Cái đáng quan tâm: (1) một lượt quét rồi ngay sau đó là một kết nối <em>được cho qua</em> từ cùng nguồn tới đúng cổng nó vừa thấy mở (xem auth.log/access log của IP đó ngay sau); (2) quét từ <strong>bên trong</strong> mạng của bạn (như keodo hay android ở đây) — một thiết bị bị chiếm đang vẽ bản đồ LAN (ATT&amp;CK T1046 Network Service Discovery); (3) gói đi ra bị chặn từ máy chủ, cho thấy mã độc đang cố gọi về. Cách phòng: mặc định chặn chiều vào, ghi log gói bị chặn có giới hạn tốc độ, và đối chiếu chứ không chỉ đếm.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Giải thích các trường của một dòng [UFW BLOCK]." — IN/OUT, MAC, SRC/DST, LEN/TTL, PROTO/SPT/DPT, cờ.</li>
<li>"Trên Ubuntu log tường lửa đi đâu?" — bộ đệm nhân → journal (-k) và rsyslog → kern.log, syslog, ufw.log.</li>
<li>"Vì sao một lượt quét lớn có thể chỉ sinh vài dòng hoặc không dòng nào?" — giới hạn tốc độ ghi log (limit/burst), net_ratelimit của nhân; dùng bộ đếm hoặc flow log.</li>
<li>"Ghi log các lần thử SSH bị chặn thế nào mà không đầy đĩa?" — quy tắc log có limit + tiền tố đặt trước quy tắc drop; logrotate; gửi về trung tâm.</li>
</ul>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>"Microservice mới không gọi được cơ sở dữ liệu trên cùng VPS."</strong> Tìm dòng chặn có OUT= hoặc IN= với DPT=5432 — một luật ufw bị quên sau lần khởi động lại.</li>
<li><strong>VPS của đồ án tốt nghiệp</strong> có hàng nghìn dòng [UFW BLOCK] mỗi ngày: bình thường. Đảm bảo SSH chỉ cho đăng nhập bằng khoá, rồi thôi lo về con số mà cảnh báo cho những gì xảy ra sau đó (Chương 15).</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy ảo của bạn, bật ufw logging low rồi chạy <code>nmap -sS --top-ports 100</code> vào nó từ một máy khác của bạn. Bao nhiêu dòng [UFW BLOCK]? Chạy lại ngay — giờ bao nhiêu?</li>
<li>In từ ufw.log 3 IP nguồn hàng đầu và số cổng đích khác nhau của mỗi IP.</li>
<li>Viết một quy tắc nftables ghi log (tiền tố "ssh-moi: ", 10/phút) mọi kết nối MỚI tới cổng 22 và cho qua.</li>
</ol>
<p><strong>Đạt khi:</strong> (1) lần đầu khoảng 10 và lần hai không thêm dòng nào (đo trong lab: 10, rồi vẫn 10) — do giới hạn tốc độ, giải thích được trong một câu; (2) <code>sudo awk '/UFW BLOCK/ {for (i = 1; i &lt;= NF; i++) {if ($i ~ /^SRC=/) s = $i; if ($i ~ /^DPT=/) d = $i} print s, d}' /var/log/ufw.log | sort -u | awk '{print $1}' | uniq -c | sort -rn | head -n 3</code>; (3) <code>nft add rule inet lab vao tcp dport 22 ct state new limit rate 10/minute log prefix "ssh-moi: " accept</code> (trong một chain có hook input) — kiểm bằng <code>journalctl -k -g ssh-moi</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['netfilter', 'Khung lọc gói trong nhân Linux (iptables/nftables là giao diện phía trên).'],
  ['[UFW BLOCK] / ALLOW / AUDIT / LIMIT BLOCK', 'Các tiền tố log của ufw.'],
  ['IN= OUT= SRC= DST= SPT= DPT=', 'Giao diện, địa chỉ và cổng trong một dòng log tường lửa của nhân.'],
  ['limit / limit-burst', 'Cái xô vé giới hạn số gói được ghi log.'],
  ['Tiền tố log', 'Đoạn chữ cố định do quy tắc thêm vào để grep được.'],
  ['Bộ đếm quy tắc', 'Số gói/byte của mỗi quy tắc: khối lượng thật khi log bị giới hạn.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>ufw, iptables và nftables chung một định dạng dòng log của nhân; học các trường một lần.</li>
<li>Dòng ufw nằm ở ufw.log, kern.log, syslog và journal.</li>
<li>Ghi log bị giới hạn tốc độ: số dòng đếm được chỉ là cận dưới; xem bộ đếm.</li>
<li>LIMIT BLOCK = quá nhiều kết nối mới; AUDIT (medium) = kết nối mới.</li>
<li>Viết quy tắc log theo thứ tự khớp → giới hạn → tiền tố → quyết định riêng.</li>
</ul>
${nguon('📘', 'ufw(8) — Ubuntu manpage', 'Các mức LOGGING off/low/medium/high/full, limit', 'https://manpages.ubuntu.com/manpages/noble/man8/ufw.8.html')}
${nguon('📘', 'nftables wiki — Logging traffic', 'log prefix, level, group; limit rate', 'https://wiki.nftables.org/wiki-nftables/index.php/Logging_traffic')}
${lienKet({ khoa: 'network-security', bai: 'netsec-2-3-ufw', title: 'Network Security 2.3 — ufw làm cho đúng', sub: 'Cấu hình tường lửa (bài này chỉ đọc log của nó)', cta: 'Mở bài' })}
${lienKet({ khoa: 'network-security', bai: 'netsec-2-2-nftables', title: 'Network Security 2.2 — Viết ruleset nftables', sub: 'Table, chain, hook, set', cta: 'Mở bài' })}
</div>
`,
};
