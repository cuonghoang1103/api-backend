/**
 * 11.3 — Ghi log tường lửa Windows Defender (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s11/fw-win'] — Windows Server 2025 Standard Evaluation (10.0.26100, máy LAPTOP-AN 192.168.56.177 trong LAN lab, ssh + PowerShell 5.1):
 * Get-NetFirewallProfile/Set-NetFirewallProfile, netsh advfirewall, pfirewall.log khi keodo quét 25 cổng, ConvertFrom-Csv, auditpol "Filtering Platform
 * Connection" ⇒ 5156/5157 trong Security log. Quan sát thật đáng nhớ: nmap thăm 25 cổng nhưng pfirewall.log chỉ có DROP cho các cổng có tiến trình đang nghe
 * (135 svchost PID 972, 139/445 System PID 4). Số tất định trong lời: 4096 KB mặc định, 6 dòng DROP / 3 cổng, 20 MB Security log.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Windows Defender Firewall logging: pfirewall.log, dropped/allowed packets, WFP events 5156/5157|||Ghi log tường lửa Windows Defender: pfirewall.log, gói bị chặn/cho qua, sự kiện WFP 5156/5157',
  slug: 'log-11-3-firewall-windows',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tường lửa Windows chặn rất nhiều nhưng mặc định không ghi gì. Chạy thật trên Windows Server 2025: xem và bật log cho cả ba profile (Domain/Private/Public), đọc pfirewall.log từng cột khi một máy lạ quét cổng, gom theo nguồn bằng PowerShell, rồi bật audit "Filtering Platform Connection" để có sự kiện 5156 (cho qua) / 5157 (chặn) kèm TÊN CHƯƠNG TRÌNH — và thấy vì sao phải bật có chừng mực. Kèm một bất ngờ thật: quét 25 cổng nhưng log chỉ có vài dòng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>The Windows firewall blocks a lot — and by default remembers nothing</h2>
<p class="lead">Every Windows PC since XP SP2 has a host firewall turned on. It quietly drops scans from the café Wi‑Fi, the dorm network, the infected laptop next to you. But out of the box it writes nothing down. Two switches change that: a text log (<code>pfirewall.log</code>) and audit events in the Security log (5156/5157). This lesson turns both on in a real Windows machine, lets a stranger scan it, and reads what was recorded — and what was not.</p>

<h3>The everyday picture: a door with a peephole vs a door with a camera</h3>
<p>The firewall is the locked door: it keeps strangers out whether or not you watch. <code>pfirewall.log</code> is a notebook by the door: date, time, who knocked, which door, let in or not. The 5156/5157 events are a camera that also records <em>which person inside</em> was expecting the visitor (the program). Useful, but if you film everything all day, the tape fills up quickly.</p>

<h3>Step 1 — the three profiles and their default</h3>
${lenh('s11/fw-win', 0)}
<p>Windows has three profiles: <strong>Domain</strong> (joined to a company domain and can see its domain controller), <strong>Private</strong> (home network you trusted) and <strong>Public</strong> (café, school, anything unknown — the strictest). A network gets a profile when you first join it ("Do you want your PC to be discoverable?"). All three share one file by default, <code>%systemroot%\\system32\\LogFiles\\Firewall\\pfirewall.log</code>, limited to 4096 KB, and <strong>LogAllowed/LogBlocked are False</strong>: no log at all. Turn it on for all profiles and give it more room:</p>
${lenh('s11/fw-win', 1)}
<p>The GUI path is <em>Windows Defender Firewall with Advanced Security → Properties → (each profile tab) → Logging → Customize</em>; <code>netsh advfirewall set allprofiles logging droppedconnections enable</code> is the cmd-era equivalent. Group Policy can enforce it on every company PC. Mind the profile actually in use — the <code>netsh … currentprofile</code> output says <strong>Public</strong> here.</p>

<h3>Step 2 — a stranger scans the PC</h3>
${lenh('s11/fw-win', 2)}
${lenh('s11/fw-win', 3)}
${lenh('s11/fw-win', 4)}
<p>The header line <code>#Fields:</code> names the columns: <code>date time action protocol src-ip dst-ip src-port dst-port size tcpflags tcpsyn tcpack tcpwin icmptype icmpcode info path pid</code>. <code>Time Format: Local</code> — local clock, not UTC (Lesson 1.5). <code>action</code> is ALLOW or DROP; <code>path</code> is SEND or RECEIVE; recent Windows versions add <code>pid</code>, the process that owns the port. The first real line is us: lab7 connecting to SSH (22), allowed.</p>
${lenh('s11/fw-win', 5)}
${lenh('s11/fw-win', 6)}
<p>Read one DROP: at 12:16:18 a TCP packet from 192.168.56.66 port 57387 to this PC port 445, size 44 bytes, flag <code>S</code> (SYN, the first packet of a connection), arriving (RECEIVE), the port belonging to PID 4 (System — SMB). Same source port, many destination ports, only SYN, window 1024: the fingerprint of an nmap SYN scan.</p>

<h3>Step 3 — let PowerShell count for you</h3>
${lenh('s11/fw-win', 7)}
${lenh('s11/fw-win', 8)}
<p>The file is space-separated text with a fixed header, so <code>ConvertFrom-Csv -Delimiter ' ' -Header …</code> turns it into objects, after which <code>Group-Object</code>/<code>Where-Object</code> work like SQL (Lesson 2.5). Here is the surprise: nmap probed <strong>25</strong> ports, but the log holds only <strong>6</strong> DROP lines from 192.168.56.66 covering <strong>3</strong> ports — 135, 139, 445, exactly the ports where a program is listening (PID 972 RPC, PID 4 System). Probes to ports where nothing listens left no line at all in this lab. Lesson for the reader: <strong>the firewall log is not a complete list of what was scanned</strong>. Count it as "at least", and use the WFP events or a packet capture (Lesson 11.5) when completeness matters. Also visible: 192.168.56.142 tried 445 twice — a phone has no business with SMB on a laptop; that is worth a question.</p>

<h3>Step 4 — WFP audit events: 5156 allowed, 5157 blocked, with the program</h3>
${lenh('s11/fw-win', 9)}
${lenh('s11/fw-win', 10)}
${lenh('s11/fw-win', 11)}
${lenh('s11/fw-win', 12)}
<p>The Windows Filtering Platform (WFP) is the engine under the firewall. Enabling the audit subcategory <em>Filtering Platform Connection</em> writes <strong>5156</strong> ("permitted a connection") and <strong>5157</strong> ("blocked a connection") into the Security log, with what <code>pfirewall.log</code> lacks: <strong>Application Name</strong> (here <code>svchost.exe</code> owning RPC port 135, <code>sshd.exe</code> for our SSH) and the filter that decided. <code>Direction %%14592</code> is a message-table reference that Event Viewer renders as "Inbound" (%%14593 = Outbound) — when you read raw XML you see the code. Related events: 5152/5153 (packet dropped — <em>Filtering Platform Packet Drop</em>), 5154/5155 (an application was allowed/blocked to listen), 5158/5159 (bind). Note too: <code>5985 open</code> — WinRM listens on Windows Server and the default rule allows it from the local subnet; a log reader who sees 5985/5986 connections from odd places should think "remote PowerShell" (ATT&amp;CK T1021.006).</p>
${lenh('s11/fw-win', 13)}
${lenh('s11/fw-win', 14)}
${lenh('s11/fw-win', 15)}
<p>Why "with moderation": 20 events in three quiet minutes on an idle lab PC. On a busy server every outbound connection (updates, telemetry, browser) is a 5156: tens of thousands per hour, and the Security log is only 20 MB in <strong>Circular</strong> mode — new events overwrite the oldest, including the 4624/4625 logons you will need in Chapter 4. Practical rule: enable failures only (<code>/failure:enable</code>) or only on servers that ship events to a central store (Chapter 15) with a bigger log; and switch it off after an investigation, exactly as above.</p>

<h3>🛡️ Attacker's corner: SMB exposed, and the firewall turned off</h3>
<p>WannaCry (May 2017) spread through SMB port 445 using the EternalBlue exploit; machines with 445 reachable from untrusted networks were infected within minutes. In a firewall log that wave looks like what you just read — SYN to 445 from many sources — multiplied by thousands. The other half of the story: attackers who get admin often disable or weaken the firewall (<code>netsh advfirewall set allprofiles state off</code>, new allow rules) so that their tools can listen. Those changes are logged in the channel <em>Microsoft-Windows-Windows Firewall With Advanced Security/Firewall</em>. Here is what Windows Server 2025 recorded when we added, modified and deleted a rule and switched the Private profile off and on again:</p>
${lenh('s11/bt-11-3', 0)}
${lenh('s11/bt-11-3', 1)}
<p>2097 rule added, 2099 rule modified, 2052 rule deleted, 2082 a profile setting changed (older Windows 10 builds used 2004/2005/2006/2003 for the same things — check the IDs on your version). Check this channel when a host "suddenly" accepts connections. Defence: keep Public profile on any laptop, never expose 445/3389 to the Internet, log drops, and alert on firewall-disabled events.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Where is the Windows firewall log and is it on by default?" — pfirewall.log under System32\LogFiles\Firewall; logging off by default, 4 MB.</li>
<li>"What is the difference between pfirewall.log and event 5157?" — text log per packet/connection without the program vs Security event with application and filter; volume.</li>
<li>"How do you recognise a port scan in a firewall log?" — one source, many destination ports, SYN only, short time window.</li>
<li>"Why might a scan not appear completely in the log?" — logging of drops depends on the stack/listeners; rate and size limits; use packet capture to confirm.</li>
</ul>

<h3>Real-world situations</h3>
<ul>
<li><strong>"The customer cannot connect to our test server on port 8080."</strong> On Windows test servers in outsourcing projects this is very often the host firewall. Turn on LogBlocked, ask the customer to retry, and the DROP line with their IP and port 8080 settles the argument in one minute.</li>
<li><strong>On a public Wi‑Fi</strong>, your own laptop's pfirewall.log (Public profile, drops logged) shows who on that network tried to connect to you.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>On your own Windows PC (as administrator): show the profile your current network uses and turn on LogBlocked for it only. After a day, how many DROP lines are there and from how many source IPs?</li>
<li>Using the field list, write a PowerShell one-liner that shows the 5 destination ports with the most DROPs.</li>
<li>Why did the probes to 3389 and 5900 in Step 2 leave no line, while 445 did? What tool would show them?</li>
</ol>
<p><strong>Pass:</strong> (1) <code>Get-NetConnectionProfile</code> then <code>Set-NetFirewallProfile -Name Public -LogBlocked True</code> (or Private) and a count from step 3's pipeline; (2) <code>$d | Where-Object action -eq 'DROP' | Group-Object dstport | Sort-Object Count -Descending | Select-Object -First 5 Count,Name</code> (with <code>$d</code> built as in Step 3) — on the lab log: 445 ×8, 135 ×4, 139 ×2; (3) in this lab only ports with a listening process produced DROP lines; probes to closed ports were discarded without a line — a packet capture on the PC or the 5152 packet-drop audit would show them.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Domain / Private / Public profile', 'Firewall settings set chosen by the network the PC is on.'],
  ['pfirewall.log', 'Text firewall log; #Fields header; local time; off by default, 4 MB.'],
  ['DROP / ALLOW, SEND / RECEIVE', 'Action and direction columns of pfirewall.log.'],
  ['WFP', 'Windows Filtering Platform, the engine below the firewall.'],
  ['5156 / 5157', 'Security events: WFP permitted / blocked a connection, with application.'],
  ['auditpol', 'Command to view/change advanced audit policy subcategories.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>The firewall is on, its log is off: enable LogBlocked (and LogAllowed when needed) per profile.</li>
<li>Read pfirewall.log by its #Fields header; parse with ConvertFrom-Csv.</li>
<li>A firewall log is "at least" — not every probe produces a line.</li>
<li>5156/5157 add the program name but flood the Security log; enable briefly or ship centrally.</li>
<li>Watch for the firewall being turned off — that is an event too.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Configure Windows Firewall logging', 'Per-profile logging, path, size, permissions of the log folder', 'https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/configure-logging')}
${nguon('📘', 'Microsoft Learn — 5157(F): The Windows Filtering Platform has blocked a connection', 'Fields, direction codes, recommendations', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-5157')}
${nguon('🛡️', 'Microsoft Security Bulletin MS17-010', 'The SMB vulnerabilities exploited by EternalBlue / WannaCry (2017)', 'https://learn.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-2-5-powershell-text', title: 'Lesson 2.5 — PowerShell for text logs', sub: 'Select-String, ConvertFrom-Csv, Group-Object used above', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Tường lửa Windows chặn rất nhiều — và mặc định chẳng nhớ gì</h2>
<p class="lead">Mọi máy Windows từ XP SP2 đều có tường lửa bật sẵn. Nó lặng lẽ chặn các lượt quét từ Wi‑Fi quán cà phê, mạng ký túc xá, chiếc laptop nhiễm mã độc ngồi cạnh bạn. Nhưng để mặc định thì nó chẳng ghi gì. Có hai công tắc đổi điều đó: một log dạng chữ (<code>pfirewall.log</code>) và các sự kiện audit trong Security log (5156/5157). Bài này bật cả hai trên một máy Windows thật, để một người lạ quét nó, rồi đọc những gì được ghi — và những gì không.</p>

<h3>Liên tưởng đời thường: cửa có mắt thần và cửa có camera</h3>
<p>Tường lửa là cánh cửa khoá: nó giữ người lạ ở ngoài dù bạn có nhìn hay không. <code>pfirewall.log</code> là cuốn sổ cạnh cửa: ngày, giờ, ai gõ, cửa nào, cho vào hay không. Sự kiện 5156/5157 là camera ghi thêm cả <em>người nào bên trong</em> đang chờ vị khách (chương trình nào). Hữu ích, nhưng quay mọi thứ cả ngày thì băng đầy rất nhanh.</p>

<h3>Bước 1 — ba profile và mặc định của chúng</h3>
${lenh('s11/fw-win', 0)}
<p>Windows có ba profile: <strong>Domain</strong> (đã vào domain công ty và thấy được domain controller), <strong>Private</strong> (mạng nhà bạn đã tin tưởng) và <strong>Public</strong> (quán cà phê, trường học, mọi mạng lạ — chặt nhất). Một mạng được gán profile ngay lần đầu bạn vào ("Bạn có muốn máy này được tìm thấy trong mạng?"). Mặc định cả ba dùng chung một tệp <code>%systemroot%\\system32\\LogFiles\\Firewall\\pfirewall.log</code>, giới hạn 4096 KB, và <strong>LogAllowed/LogBlocked đều False</strong>: không có log nào. Bật cho mọi profile và cho thêm chỗ:</p>
${lenh('s11/fw-win', 1)}
<p>Đường đi trên giao diện là <em>Windows Defender Firewall with Advanced Security → Properties → (thẻ từng profile) → Logging → Customize</em>; <code>netsh advfirewall set allprofiles logging droppedconnections enable</code> là cách thời cmd. Group Policy ép được cho mọi máy trong công ty. Để ý profile đang thực sự được dùng — output <code>netsh … currentprofile</code> ở đây ghi <strong>Public</strong>.</p>

<h3>Bước 2 — một người lạ quét máy</h3>
${lenh('s11/fw-win', 2)}
${lenh('s11/fw-win', 3)}
${lenh('s11/fw-win', 4)}
<p>Dòng tiêu đề <code>#Fields:</code> đặt tên các cột: <code>date time action protocol src-ip dst-ip src-port dst-port size tcpflags tcpsyn tcpack tcpwin icmptype icmpcode info path pid</code>. <code>Time Format: Local</code> — giờ máy, không phải UTC (Bài 1.5). <code>action</code> là ALLOW hoặc DROP; <code>path</code> là SEND hoặc RECEIVE; Windows đời mới thêm <code>pid</code>, tiến trình đang giữ cổng đó. Dòng thật đầu tiên là chính ta: lab7 kết nối SSH (22), được cho qua.</p>
${lenh('s11/fw-win', 5)}
${lenh('s11/fw-win', 6)}
<p>Đọc một dòng DROP: lúc 12:16:18, một gói TCP từ 192.168.56.66 cổng 57387 tới cổng 445 của máy này, kích thước 44 byte, cờ <code>S</code> (SYN, gói đầu tiên của một kết nối), đi vào (RECEIVE), cổng thuộc PID 4 (System — SMB). Cùng cổng nguồn, nhiều cổng đích, chỉ có SYN, window 1024: dấu vân tay của lượt quét SYN bằng nmap.</p>

<h3>Bước 3 — để PowerShell đếm giúp</h3>
${lenh('s11/fw-win', 7)}
${lenh('s11/fw-win', 8)}
<p>Tệp là văn bản ngăn cách bằng dấu cách với tiêu đề cố định, nên <code>ConvertFrom-Csv -Delimiter ' ' -Header …</code> biến nó thành đối tượng, sau đó <code>Group-Object</code>/<code>Where-Object</code> chạy như SQL (Bài 2.5). Và đây là điều bất ngờ: nmap thăm <strong>25</strong> cổng, nhưng log chỉ có <strong>6</strong> dòng DROP từ 192.168.56.66, phủ <strong>3</strong> cổng — 135, 139, 445, đúng những cổng có chương trình đang nghe (PID 972 RPC, PID 4 System). Các lượt thăm vào cổng không có ai nghe không để lại dòng nào trong lab này. Bài học cho người đọc log: <strong>log tường lửa không phải danh sách đầy đủ những gì đã bị quét</strong>. Hãy đọc nó là "ít nhất", và dùng sự kiện WFP hoặc bắt gói (Bài 11.5) khi cần đủ. Cũng thấy luôn: 192.168.56.142 hai lần thử cổng 445 — một chiếc điện thoại chẳng có lý do gì để gọi SMB vào laptop; đáng hỏi lại.</p>

<h3>Bước 4 — sự kiện audit WFP: 5156 cho qua, 5157 chặn, kèm chương trình</h3>
${lenh('s11/fw-win', 9)}
${lenh('s11/fw-win', 10)}
${lenh('s11/fw-win', 11)}
${lenh('s11/fw-win', 12)}
<p>Windows Filtering Platform (WFP) là bộ máy nằm dưới tường lửa. Bật mục audit <em>Filtering Platform Connection</em> sẽ ghi <strong>5156</strong> ("đã cho phép một kết nối") và <strong>5157</strong> ("đã chặn một kết nối") vào Security log, kèm thứ mà <code>pfirewall.log</code> không có: <strong>Application Name</strong> (ở đây <code>svchost.exe</code> giữ cổng RPC 135, <code>sshd.exe</code> cho SSH của ta) và bộ lọc đã quyết định. <code>Direction %%14592</code> là mã tham chiếu bảng thông điệp mà Event Viewer hiển thị thành "Inbound" (%%14593 = Outbound) — đọc XML thô thì bạn thấy mã. Sự kiện họ hàng: 5152/5153 (gói bị bỏ — <em>Filtering Platform Packet Drop</em>), 5154/5155 (chương trình được phép/bị chặn mở cổng nghe), 5158/5159 (bind). Để ý thêm: <code>5985 open</code> — WinRM nghe trên Windows Server và luật mặc định cho phép từ cùng mạng con; người đọc log thấy kết nối 5985/5986 từ nơi lạ nên nghĩ ngay "PowerShell từ xa" (ATT&amp;CK T1021.006).</p>
${lenh('s11/fw-win', 13)}
${lenh('s11/fw-win', 14)}
${lenh('s11/fw-win', 15)}
<p>Vì sao phải "có chừng mực": 20 sự kiện trong ba phút yên ắng trên một máy lab không ai dùng. Trên máy chủ bận rộn, mọi kết nối đi ra (cập nhật, đo đạc, trình duyệt) đều là một 5156: hàng chục nghìn mỗi giờ, trong khi Security log chỉ 20 MB ở chế độ <strong>Circular</strong> — sự kiện mới đè lên cái cũ nhất, kể cả những lần đăng nhập 4624/4625 bạn sẽ cần ở Chương 4. Quy tắc thực tế: chỉ bật thất bại (<code>/failure:enable</code>), hoặc chỉ bật trên máy chủ có gửi sự kiện về kho trung tâm (Chương 15) với log lớn hơn; và tắt đi sau khi điều tra xong, đúng như trên.</p>

<h3>🛡️ Góc hacker: SMB phơi ra ngoài, và tường lửa bị tắt</h3>
<p>WannaCry (tháng 5/2017) lây qua SMB cổng 445 bằng khai thác EternalBlue; máy nào để 445 với tới được từ mạng không tin cậy thì bị nhiễm trong vài phút. Trong log tường lửa, làn sóng đó trông đúng như cái bạn vừa đọc — SYN tới 445 từ nhiều nguồn — nhân lên hàng nghìn lần. Nửa còn lại của câu chuyện: kẻ tấn công có quyền admin thường tắt hoặc nới tường lửa (<code>netsh advfirewall set allprofiles state off</code>, thêm luật cho phép) để công cụ của chúng mở cổng nghe được. Những thay đổi đó được ghi trong kênh <em>Microsoft-Windows-Windows Firewall With Advanced Security/Firewall</em>. Đây là những gì Windows Server 2025 ghi khi ta thêm, sửa, xoá một luật rồi tắt và bật lại profile Private:</p>
${lenh('s11/bt-11-3', 0)}
${lenh('s11/bt-11-3', 1)}
<p>2097 thêm luật, 2099 sửa luật, 2052 xoá luật, 2082 đổi một cài đặt của profile (Windows 10 bản cũ dùng 2004/2005/2006/2003 cho cùng việc — kiểm lại mã trên phiên bản của bạn). Hãy xem kênh này khi một máy "tự dưng" nhận kết nối. Cách phòng: giữ profile Public trên mọi laptop, không bao giờ mở 445/3389 ra Internet, ghi log gói bị chặn, cảnh báo khi có sự kiện tắt tường lửa.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Log tường lửa Windows nằm đâu và mặc định có bật không?" — pfirewall.log trong System32\LogFiles\Firewall; mặc định tắt, 4 MB.</li>
<li>"pfirewall.log khác sự kiện 5157 thế nào?" — log chữ theo gói/kết nối nhưng không có tên chương trình, so với sự kiện Security có ứng dụng và bộ lọc; khác nhau về khối lượng.</li>
<li>"Nhận ra một lượt quét cổng trong log tường lửa thế nào?" — một nguồn, nhiều cổng đích, chỉ có SYN, trong một khoảng ngắn.</li>
<li>"Vì sao một lượt quét có thể không hiện đủ trong log?" — việc ghi gói bị chặn phụ thuộc ngăn xếp mạng/chương trình đang nghe; giới hạn tốc độ và dung lượng; dùng bắt gói để xác nhận.</li>
</ul>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>"Khách không kết nối được máy chủ test của mình ở cổng 8080."</strong> Với máy chủ test chạy Windows trong dự án outsourcing, thủ phạm rất thường là tường lửa của chính máy. Bật LogBlocked, nhờ khách thử lại, và dòng DROP mang IP của khách với cổng 8080 sẽ kết thúc cuộc tranh luận trong một phút.</li>
<li><strong>Ở Wi‑Fi công cộng</strong>, chính pfirewall.log trên laptop của bạn (profile Public, có ghi gói bị chặn) cho thấy ai trong mạng đó đã thử kết nối vào bạn.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy Windows của bạn (quyền quản trị): xem mạng hiện tại đang dùng profile nào và chỉ bật LogBlocked cho profile đó. Sau một ngày, có bao nhiêu dòng DROP và từ bao nhiêu IP nguồn?</li>
<li>Dựa vào danh sách cột, viết một dòng PowerShell cho ra 5 cổng đích bị DROP nhiều nhất.</li>
<li>Vì sao các lượt thăm 3389 và 5900 ở Bước 2 không để lại dòng nào, còn 445 thì có? Công cụ nào sẽ cho thấy chúng?</li>
</ol>
<p><strong>Đạt khi:</strong> (1) <code>Get-NetConnectionProfile</code> rồi <code>Set-NetFirewallProfile -Name Public -LogBlocked True</code> (hoặc Private) và có con số đếm từ đường ống ở Bước 3; (2) <code>$d | Where-Object action -eq 'DROP' | Group-Object dstport | Sort-Object Count -Descending | Select-Object -First 5 Count,Name</code> (với <code>$d</code> dựng như Bước 3) — trên log lab: 445 ×8, 135 ×4, 139 ×2; (3) trong lab này chỉ các cổng có tiến trình đang nghe mới sinh dòng DROP; lượt thăm vào cổng đóng bị bỏ mà không ghi — bắt gói trên máy hoặc audit 5152 (gói bị bỏ) sẽ thấy chúng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Profile Domain / Private / Public', 'Bộ cài đặt tường lửa được chọn theo mạng máy đang ở.'],
  ['pfirewall.log', 'Log tường lửa dạng chữ; tiêu đề #Fields; giờ máy; mặc định tắt, 4 MB.'],
  ['DROP / ALLOW, SEND / RECEIVE', 'Cột hành động và chiều của pfirewall.log.'],
  ['WFP', 'Windows Filtering Platform, bộ máy nằm dưới tường lửa.'],
  ['5156 / 5157', 'Sự kiện Security: WFP cho phép / chặn một kết nối, kèm ứng dụng.'],
  ['auditpol', 'Lệnh xem/đổi các mục audit nâng cao.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tường lửa bật, nhưng log tắt: bật LogBlocked (và LogAllowed khi cần) theo từng profile.</li>
<li>Đọc pfirewall.log theo tiêu đề #Fields; tách bằng ConvertFrom-Csv.</li>
<li>Log tường lửa là "ít nhất" — không phải lượt thăm nào cũng sinh một dòng.</li>
<li>5156/5157 có thêm tên chương trình nhưng làm ngập Security log; bật ngắn hoặc gửi về kho trung tâm.</li>
<li>Để mắt việc tường lửa bị tắt — đó cũng là một sự kiện.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Configure Windows Firewall logging', 'Log theo profile, đường dẫn, kích thước, quyền thư mục log', 'https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/configure-logging')}
${nguon('📘', 'Microsoft Learn — 5157(F): The Windows Filtering Platform has blocked a connection', 'Các trường, mã chiều, khuyến nghị', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-5157')}
${nguon('🛡️', 'Microsoft Security Bulletin MS17-010', 'Lỗ hổng SMB bị khai thác bởi EternalBlue / WannaCry (2017)', 'https://learn.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-2-5-powershell-text', title: 'Bài 2.5 — PowerShell cho log dạng chữ', sub: 'Select-String, ConvertFrom-Csv, Group-Object dùng ở trên', cta: 'Mở bài' })}
</div>
`,
};
