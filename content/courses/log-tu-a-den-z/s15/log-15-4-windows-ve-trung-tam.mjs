/**
 * 15.4 — Đưa sự kiện Windows về kho trung tâm (soạn 24/11/2026, agent lgz).
 * Máy soạn là Linux: cấu hình Alloy cho Windows (./_demo/s15/windows/config.alloy) chỉ được kiểm bằng `alloy fmt` + `alloy run` (dừng ở bước đọc tệp chứng chỉ C:\…);
 * winlogbeat.yml / nxlog.conf là MẪU theo tài liệu chính thức, CHƯA chạy trên Windows — bài nói rõ. Phần chạy thật: TLS hai chiều OUT['s15/tls'] (OpenSSL 3 + Loki 3.7.10).
 * Tên trường JSON của loki.source.windowsevent kiểm từ mã nguồn Alloy v1.22.0 (internal/component/loki/source/windowsevent/format.go).
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Shipping Windows events to the central store: Winlogbeat, Grafana Alloy windows_event, NXLog CE|||Đưa sự kiện Windows về kho trung tâm: Winlogbeat, Grafana Alloy windows_event, NXLog CE',
  slug: 'log-15-4-windows-ve-trung-tam',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chọn kênh Windows nào đáng gửi (Security theo Event ID, System, Sysmon, PowerShell 4104) và lọc bằng XPath để không ngập; ba agent: Grafana Alloy loki.source.windowsevent (bẫy use_incoming_timestamp mặc định false, bookmark), Winlogbeat (giữ EventData thành trường), NXLog CE (syslog TLS); đường truyền TLS hai chiều chạy thật với Loki — thiếu chứng chỉ máy khách là bị từ chối; kiểm đầu-cuối bằng một 4625 tự gây ra; kẻ tấn công xoá log (MITRE T1685.005, trước là T1070.001).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>Windows events: from Event Viewer to the central store</h2>
<p class="lead">In Chapters 3–5 you read Windows logs on the machine itself. In a company with 200 Windows laptops nobody opens 200 Event Viewers, and the first thing an intruder with admin rights does is clear the Security log (event 1102). The answer is the same as for Linux in lesson 15.1: an agent on every machine sends the events that matter to a central store, <em>as they happen</em>. This lesson picks the events, compares three agents, secures the wire with mutual TLS, and checks the whole chain end to end.</p>
<div class="callout warn"><p><strong>Honest note about this lesson.</strong> It was written on a Linux machine. The Alloy configuration below passed <code>alloy fmt</code> and <code>alloy run</code> up to the point where it opens the Windows certificate files; the Winlogbeat and NXLog files are templates from the official documentation and were <em>not</em> run here. The TLS part was run for real. You run the Windows side in Lab 15 on your own PC — the "Done when" checks tell you whether it works.</p></div>

<h3>The everyday picture: the security guard's notebook and the CCTV room</h3>
<p>Every building has a guard who writes "08:12 delivery van, plate …" in a notebook (the local Event Log). A thief who gets inside can tear out the page. A building with a CCTV room sends every camera to a room the thief cannot reach (the central store). You do not wire every camera in the building — only the doors and the safe (the right Event IDs), or the recorder fills in a day.</p>

<h3>Step 1 — choose what to send (or drown)</h3>
<table>
<thead><tr><th>Channel</th><th>Events worth sending</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Security</td><td>4624/4625 logon ok/failed, 4672 special privileges, 4688 process created, 4720 user created, 4732 added to a local group, 4740 account locked, 1102 log cleared</td><td>Who logged in, from where, what they ran, accounts changed (Chapter 4)</td></tr>
<tr><td>System</td><td>Levels critical/error/warning, 7045 service installed, 104 log cleared</td><td>Crashes, new services (a favourite persistence trick)</td></tr>
<tr><td>Sysmon/Operational</td><td>All (your Sysmon config already filters)</td><td>Process tree with hashes, network connections, DNS (lesson 5.6)</td></tr>
<tr><td>PowerShell/Operational</td><td>4104 script block</td><td>The actual script text, even if it was obfuscated</td></tr>
</tbody>
</table>
<p>What <strong>not</strong> to send blindly: 5156/5158 (Windows Filtering Platform, one event per allowed connection), 4663 object access on busy file shares, 4656/4658 handles. On one server these can be thousands per minute and they will be most of your bill (lesson 16.2). Filter on the machine with XPath, not in the central store.</p>

<h3>Step 2 — three agents</h3>
${kv([
  ['Grafana Alloy', 'Component <code>loki.source.windowsevent</code> → Loki. Same agent and language as your Linux machines (lesson 15.2). Each event becomes one JSON line.'],
  ['Winlogbeat', 'Elastic\'s agent → Elasticsearch. Keeps every EventData field as its own field (<code>winlog.event_data.TargetUserName</code>) — best for searching.'],
  ['NXLog CE', 'Free, older, very common in enterprises. Reads Event Log, converts to JSON or syslog, sends to almost anything (syslog over TLS, port 6514, RFC 5425).'],
  ['WEF/WEC', 'Built into Windows, no agent: machines push to a Windows Event Collector over WinRM. Needs a domain (lesson 5.7) — then an agent on the collector forwards onward.'],
])}

<h3>Step 3 — Grafana Alloy on Windows</h3>
${ma('alloy', 's15/windows/config.alloy')}
<ul>
<li><strong><code>use_incoming_timestamp = true</code></strong> — the documented default is <code>false</code>: "assigns the current timestamp to the log". With the default, the first start of the agent stamps a week of old events with <em>now</em>, and every restart that replays from the bookmark shifts times. It is the Windows twin of the 7-hour trap in lesson 15.3.</li>
<li><strong>Bookmark</strong> (<code>bookmark_path</code>, default in Alloy's data directory): the last record read. Restart = continue, not resend. Deleting the data folder = resend everything.</li>
<li><strong>XPath</strong>: the same filter language as Event Viewer's "Filter Current Log → XML" tab. Build it there, paste it here (lesson 5.3).</li>
<li><strong>Labels</strong>: <code>channel</code> and <code>event_id</code> are bounded (a few dozen values), so they make good Loki labels; the user name and IP stay in the line. Field names of the JSON line (from Alloy's source code): <code>source, channel, computer, event_id, level, levelText, timeCreated, eventRecordID, execution, security, event_data, message</code>. <code>event_data</code> is one string with the <code>&lt;Data Name="…"&gt;</code> elements, so in LogQL you match on it with <code>|=</code> or a regexp.</li>
</ul>
<p>Install: the Alloy Windows installer (MSI) creates a service "Alloy" that reads <code>C:\\Program Files\\GrafanaLabs\\Alloy\\config.alloy</code>; the service runs as LocalSystem, which can read the Security log. Its UI listens on <code>http://127.0.0.1:12345</code> — the same component health page you used in 15.2.</p>

<h3>Step 4 — Winlogbeat and NXLog (templates)</h3>
${ma('yaml', 's15/windows/winlogbeat.yml')}
${ma('xml', 's15/windows/nxlog.conf')}
<p>Note what both templates do: the same short list of IDs, a dedicated <em>write-only</em> account instead of the admin password, the password in a keystore (not in the file), and a CA file so the agent checks it is talking to <em>your</em> server.</p>

<h3>Step 5 — the wire: mutual TLS, run for real</h3>
<p>Logon events contain user names, machine names and IPs. Sent in clear text across an office network or the internet, they are a gift to anyone sniffing. TLS gives encryption and lets the agent verify the server. <strong>Mutual</strong> TLS also lets the server verify the agent — so a stolen laptop's certificate can be revoked, and a random machine cannot push fake "all is fine" logs. A tiny CA, one server certificate, one client certificate:</p>
${lenh('s15/tls', 0)}
${lenh('s15/tls', 1)}
${lenh('s15/tls', 2)}
${ma('yaml', 's15/windows/loki-tls.yaml')}
${lenh('s15/tls', 3)}
${lenh('s15/tls', 4)}
${lenh('s15/tls', 5)}
${lenh('s15/tls', 6)}
${lenh('s15/tls', 7)}
${lenh('s15/tls', 8)}
<p>Plain HTTP gets 400; HTTPS without a client certificate is refused during the handshake (<code>certificate required</code>); with the certificate the push returns <strong>204</strong> and the line can be queried by its labels. (The pushed line here was written by hand with curl to test the wire — it is not a real Windows event; the real one comes from Alloy in Lab 15.) The <code>chmod</code> line is a real trap from preparing this lesson: Loki runs as uid 10001, the first attempt failed with <code>permission denied</code> on the certificate because the folder was private to the user.</p>

<h3>Step 6 — prove the chain end to end</h3>
<ol>
<li>On the Windows PC: <code>runas /user:%COMPUTERNAME%\\khongco cmd</code> and type any password → one 4625 in Security.</li>
<li>Within a few seconds in Grafana Explore: <code>{job="windows", event_id="4625"}</code> (or in Kibana: <code>event.code : 4625</code>).</li>
<li>Compare <code>timeCreated</code> in the line with the time in Event Viewer: equal (to the second) means <code>use_incoming_timestamp</code> works.</li>
<li>Stop the agent service for two minutes, create another 4625, start it again: the event must arrive (bookmark), and your "source silent" alert (lesson 15.5) should have fired in between.</li>
</ol>

<h3>Hacker's corner: clear the log, or stop it being written</h3>
<p>MITRE ATT&amp;CK lists both as techniques (renumbered in 2026; the old pages redirect): <strong>T1685.005 Clear Windows Event Logs</strong> (formerly T1070.001) — <code>wevtutil cl Security</code>, leaving event 1102 — and <strong>T1685.001 Disable or Modify Windows Event Log</strong> (formerly T1562.002) — stopping the EventLog service or changing audit policy. Neither erases what was already shipped. That is the real argument for central logging: the events up to the moment of clearing are already in Loki/Elasticsearch, and the 1102 itself is shipped. Add an alert on 1102/104 and on "this machine stopped sending" — an attacker who stops the agent produces silence, and silence must page someone.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>Customer IT says "no new software on servers".</strong> WEF needs no agent; NXLog is often already approved. Ask what is on their allow-list before proposing Alloy.</li>
<li><strong>The Security log on a domain controller rolls over in 6 hours.</strong> Shipping is the only way to keep a week; also raise the local size (lesson 3.5) so a network outage does not lose events.</li>
<li><strong>You log in as admin to fix something</strong> on a customer server: your 4624/4672 is now in their SIEM. Note the ticket number in the chat beforehand — otherwise you are the incident.</li>
</ul>

<h3>🧪 Practice (30 min, on your Windows PC or a VM)</h3>
<div class="callout ok"><ol>
<li>Build the XPath for "4625 where the logon type is 3 (network)" in Event Viewer's XML filter tab and paste it into <code>xpath_query</code>.</li>
<li>Install Alloy for Windows with the config above (point <code>url</code> at your lab Loki, without TLS first), create a 4625 and find it in Grafana.</li>
<li>Restart the Alloy service twice. Count the 4625 lines in Loki: are there duplicates?</li>
<li>Set <code>use_incoming_timestamp = false</code>, delete the bookmark, restart: what happens to the times of old events?</li>
</ol>
<p><strong>Done when:</strong> 1 contains <code>EventData[Data[@Name='LogonType']='3']</code>; 2 shows the line within ~10 s with <code>channel="Security"</code> and <code>event_id="4625"</code>; 3 gives no duplicates (bookmark); 4 shows old events re-sent with the current time — and you can explain why that breaks a timeline.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['loki.source.windowsevent', 'Alloy component reading a Windows event log channel; one JSON line per event.'],
  ['use_incoming_timestamp', 'Use the event\'s own time (true) instead of the read time (default false).'],
  ['Bookmark', 'Saved position in the event log so a restart neither loses nor repeats events.'],
  ['XPath query', 'Event Log filter (*[System[(EventID=4625)]]) applied on the machine.'],
  ['Winlogbeat', 'Elastic agent for Windows events; EventData kept as separate fields.'],
  ['NXLog CE', 'Free log agent (im_msvistalog) that converts and forwards Windows events.'],
  ['mTLS', 'Both sides present certificates; the server rejects agents without one.'],
  ['T1685.005', 'ATT&CK: Clear Windows Event Logs (formerly T1070.001).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Send Security (by Event ID), System, Sysmon and PowerShell 4104 — filter with XPath on the machine.</li>
<li>Alloy → Loki, Winlogbeat → Elasticsearch, NXLog → syslog/anything; WEF when you have a domain.</li>
<li>Turn on <code>use_incoming_timestamp</code>; keep the bookmark.</li>
<li>Mutual TLS: encrypted, server verified, agent verified.</li>
<li>Prove it end to end with a 4625 you caused yourself; alert on 1102/104 and on silence.</li>
</ul>
${nguon('📘', 'Grafana Alloy — loki.source.windowsevent', 'Arguments: eventlog_name, xpath_query, bookmark_path, use_incoming_timestamp', 'https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.windowsevent/')}
${nguon('📘', 'Install Grafana Alloy on Windows', 'MSI installer, service, config path', 'https://grafana.com/docs/alloy/latest/set-up/install/windows/')}
${nguon('📘', 'Configure Winlogbeat', 'event_logs: name, event_id, level, ignore_older', 'https://www.elastic.co/docs/reference/beats/winlogbeat/configuration-winlogbeat-options')}
${nguon('📘', 'Microsoft — Use Windows Event Forwarding to help with intrusion detection', 'Baseline and suspect subscriptions, which events to collect', 'https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/use-windows-event-forwarding-to-assist-in-intrusion-detection')}
${nguon('🛡️', 'MITRE ATT&CK — T1685.005 Clear Windows Event Logs', 'Formerly T1070.001; detection: event 1102/104', 'https://attack.mitre.org/techniques/T1685/005/')}
${nguon('🛡️', 'MITRE ATT&CK — T1685.001 Disable or Modify Windows Event Log', 'Formerly T1562.002', 'https://attack.mitre.org/techniques/T1685/001/')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-1-3-windows', title: 'Blue Team 1.3 — Windows logs in a SIEM', sub: 'Sysmon and Security events as detection sources', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Sự kiện Windows: từ Event Viewer về kho trung tâm</h2>
<p class="lead">Ở Chương 3–5 bạn đọc log Windows ngay trên máy. Ở công ty có 200 laptop Windows, chẳng ai mở 200 cái Event Viewer, và việc đầu tiên kẻ đột nhập có quyền admin làm là xoá log Security (sự kiện 1102). Lời giải giống Linux ở bài 15.1: một agent trên mỗi máy gửi những sự kiện đáng giá về kho trung tâm, <em>ngay khi chúng xảy ra</em>. Bài này chọn sự kiện, so ba agent, bảo vệ đường truyền bằng TLS hai chiều, và kiểm cả chuỗi từ đầu tới cuối.</p>
<div class="callout warn"><p><strong>Nói thật về bài này.</strong> Bài được viết trên máy Linux. Cấu hình Alloy dưới đây đã qua <code>alloy fmt</code> và <code>alloy run</code> tới đúng bước mở tệp chứng chỉ trên Windows; tệp Winlogbeat và NXLog là mẫu theo tài liệu chính thức và <em>chưa</em> chạy ở đây. Phần TLS đã chạy thật. Phần Windows bạn chạy ở Lab 15 trên máy của mình — các ô "Đạt khi" cho biết nó có chạy đúng không.</p></div>

<h3>Liên tưởng đời thường: sổ của bác bảo vệ và phòng camera</h3>
<p>Toà nhà nào cũng có bác bảo vệ ghi "08:12 xe giao hàng, biển số …" vào sổ (Event Log trên máy). Tên trộm vào được bên trong có thể xé trang đó. Toà nhà có phòng camera thì mọi camera truyền về một phòng mà tên trộm không với tới (kho trung tâm). Bạn không đặt camera khắp toà nhà — chỉ ở cửa và két sắt (đúng các Event ID), không thì đầu ghi đầy sau một ngày.</p>

<h3>Bước 1 — chọn cái cần gửi (hoặc là ngập)</h3>
<table>
<thead><tr><th>Kênh</th><th>Sự kiện đáng gửi</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Security</td><td>4624/4625 đăng nhập được/hỏng, 4672 quyền đặc biệt, 4688 tạo tiến trình, 4720 tạo user, 4732 thêm vào nhóm cục bộ, 4740 khoá tài khoản, 1102 xoá log</td><td>Ai đăng nhập, từ đâu, chạy gì, tài khoản nào bị đổi (Chương 4)</td></tr>
<tr><td>System</td><td>Mức critical/error/warning, 7045 cài dịch vụ, 104 xoá log</td><td>Sập, dịch vụ mới (mẹo bám trụ ưa thích)</td></tr>
<tr><td>Sysmon/Operational</td><td>Tất cả (cấu hình Sysmon của bạn đã lọc)</td><td>Cây tiến trình kèm hash, kết nối mạng, DNS (bài 5.6)</td></tr>
<tr><td>PowerShell/Operational</td><td>4104 script block</td><td>Chính nội dung script, kể cả khi bị làm rối</td></tr>
</tbody>
</table>
<p>Thứ <strong>đừng</strong> gửi bừa: 5156/5158 (Windows Filtering Platform, mỗi kết nối được cho phép một sự kiện), 4663 truy cập đối tượng trên ổ chia sẻ đông người, 4656/4658 handle. Trên một máy chủ, mấy loại này có thể hàng nghìn sự kiện mỗi phút và chiếm phần lớn hoá đơn (bài 16.2). Lọc ngay trên máy bằng XPath, đừng lọc ở kho trung tâm.</p>

<h3>Bước 2 — ba agent</h3>
${kv([
  ['Grafana Alloy', 'Thành phần <code>loki.source.windowsevent</code> → Loki. Cùng agent, cùng ngôn ngữ với máy Linux của bạn (bài 15.2). Mỗi sự kiện thành một dòng JSON.'],
  ['Winlogbeat', 'Agent của Elastic → Elasticsearch. Giữ mỗi trường EventData thành một trường riêng (<code>winlog.event_data.TargetUserName</code>) — tìm kiếm tốt nhất.'],
  ['NXLog CE', 'Miễn phí, lâu đời, rất hay gặp ở doanh nghiệp. Đọc Event Log, đổi sang JSON hoặc syslog, gửi đi gần như mọi nơi (syslog qua TLS, cổng 6514, RFC 5425).'],
  ['WEF/WEC', 'Có sẵn trong Windows, không cần agent: máy đẩy về một Windows Event Collector qua WinRM. Cần domain (bài 5.7) — rồi một agent trên máy thu chuyển tiếp đi tiếp.'],
])}

<h3>Bước 3 — Grafana Alloy trên Windows</h3>
${ma('alloy', 's15/windows/config.alloy')}
<ul>
<li><strong><code>use_incoming_timestamp = true</code></strong> — mặc định theo tài liệu là <code>false</code>: "gán thời điểm hiện tại cho log". Để mặc định thì lần đầu bật agent, một tuần sự kiện cũ bị đóng dấu <em>bây giờ</em>, và mỗi lần khởi động lại mà đọc lại từ bookmark là lệch giờ. Đây là anh em sinh đôi trên Windows của bẫy lệch 7 tiếng ở bài 15.3.</li>
<li><strong>Bookmark</strong> (<code>bookmark_path</code>, mặc định trong thư mục dữ liệu của Alloy): bản ghi cuối đã đọc. Khởi động lại = đọc tiếp, không gửi lại. Xoá thư mục dữ liệu = gửi lại tất cả.</li>
<li><strong>XPath</strong>: cùng ngôn ngữ lọc với thẻ "Filter Current Log → XML" của Event Viewer. Dựng ở đó rồi dán vào đây (bài 5.3).</li>
<li><strong>Nhãn</strong>: <code>channel</code> và <code>event_id</code> có giới hạn (vài chục giá trị) nên làm nhãn Loki tốt; tên người dùng và IP để trong dòng. Tên trường của dòng JSON (theo mã nguồn Alloy): <code>source, channel, computer, event_id, level, levelText, timeCreated, eventRecordID, execution, security, event_data, message</code>. <code>event_data</code> là một chuỗi chứa các phần tử <code>&lt;Data Name="…"&gt;</code>, nên trong LogQL bạn khớp nó bằng <code>|=</code> hoặc regexp.</li>
</ul>
<p>Cài đặt: bộ cài Alloy cho Windows (MSI) tạo dịch vụ "Alloy" đọc <code>C:\\Program Files\\GrafanaLabs\\Alloy\\config.alloy</code>; dịch vụ chạy bằng LocalSystem nên đọc được log Security. Giao diện của nó nghe ở <code>http://127.0.0.1:12345</code> — đúng trang tình trạng thành phần bạn dùng ở 15.2.</p>

<h3>Bước 4 — Winlogbeat và NXLog (mẫu)</h3>
${ma('yaml', 's15/windows/winlogbeat.yml')}
${ma('xml', 's15/windows/nxlog.conf')}
<p>Để ý cả hai mẫu cùng làm gì: cùng danh sách ID ngắn, một tài khoản riêng <em>chỉ có quyền ghi</em> thay vì mật khẩu admin, mật khẩu nằm trong keystore (không nằm trong tệp), và một tệp CA để agent kiểm rằng nó đang nói chuyện với máy chủ <em>của bạn</em>.</p>

<h3>Bước 5 — đường truyền: TLS hai chiều, chạy thật</h3>
<p>Sự kiện đăng nhập chứa tên người dùng, tên máy và IP. Gửi dạng rõ qua mạng văn phòng hay Internet là món quà cho bất kỳ ai nghe lén. TLS cho mã hoá và cho agent kiểm máy chủ. TLS <strong>hai chiều</strong> còn cho máy chủ kiểm agent — để chứng chỉ của laptop bị mất có thể thu hồi, và một máy lạ không đẩy được log giả kiểu "mọi thứ ổn". Một CA tí hon, một chứng chỉ máy chủ, một chứng chỉ máy khách:</p>
${lenh('s15/tls', 0)}
${lenh('s15/tls', 1)}
${lenh('s15/tls', 2)}
${ma('yaml', 's15/windows/loki-tls.yaml')}
${lenh('s15/tls', 3)}
${lenh('s15/tls', 4)}
${lenh('s15/tls', 5)}
${lenh('s15/tls', 6)}
${lenh('s15/tls', 7)}
${lenh('s15/tls', 8)}
<p>HTTP thường nhận 400; HTTPS không có chứng chỉ máy khách bị từ chối ngay lúc bắt tay (<code>certificate required</code>); có chứng chỉ thì lệnh đẩy trả <strong>204</strong> và dòng đó truy vấn được theo nhãn. (Dòng được đẩy ở đây do tôi tự viết bằng curl để thử đường truyền — không phải sự kiện Windows thật; sự kiện thật đến từ Alloy ở Lab 15.) Dòng <code>chmod</code> là một cái bẫy thật lúc soạn bài: Loki chạy bằng uid 10001, lần đầu thất bại với <code>permission denied</code> ở tệp chứng chỉ vì thư mục chỉ chủ nhân mới đọc được.</p>

<h3>Bước 6 — chứng minh cả chuỗi từ đầu tới cuối</h3>
<ol>
<li>Trên máy Windows: <code>runas /user:%COMPUTERNAME%\\khongco cmd</code> rồi gõ mật khẩu bất kỳ → một sự kiện 4625 trong Security.</li>
<li>Vài giây sau, trong Grafana Explore: <code>{job="windows", event_id="4625"}</code> (hoặc trong Kibana: <code>event.code : 4625</code>).</li>
<li>So <code>timeCreated</code> trong dòng với giờ trong Event Viewer: bằng nhau (tới giây) nghĩa là <code>use_incoming_timestamp</code> đang chạy.</li>
<li>Dừng dịch vụ agent hai phút, tạo thêm một 4625, bật lại: sự kiện phải tới (bookmark), và cảnh báo "nguồn im lặng" (bài 15.5) phải đã kêu ở giữa.</li>
</ol>

<h3>Góc hacker: xoá log, hoặc làm nó không được ghi</h3>
<p>MITRE ATT&amp;CK liệt kê cả hai thành kỹ thuật (đánh số lại năm 2026; trang cũ tự chuyển hướng): <strong>T1685.005 Clear Windows Event Logs</strong> (trước là T1070.001) — <code>wevtutil cl Security</code>, để lại sự kiện 1102 — và <strong>T1685.001 Disable or Modify Windows Event Log</strong> (trước là T1562.002) — dừng dịch vụ EventLog hoặc đổi audit policy. Không cách nào xoá được thứ đã gửi đi. Đó là lý lẽ thật của gom log tập trung: các sự kiện tới trước lúc xoá đã nằm trong Loki/Elasticsearch, và chính sự kiện 1102 cũng được gửi đi. Thêm cảnh báo cho 1102/104 và cho "máy này ngừng gửi" — kẻ tấn công dừng agent sẽ tạo ra im lặng, và im lặng phải đánh thức được ai đó.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Bộ phận IT của khách bảo "không cài phần mềm mới lên máy chủ".</strong> WEF không cần agent; NXLog thường đã có trong danh sách được duyệt. Hỏi danh sách cho phép của họ trước khi đề xuất Alloy.</li>
<li><strong>Log Security trên domain controller cuộn vòng sau 6 giờ.</strong> Gửi đi là cách duy nhất giữ được một tuần; đồng thời tăng dung lượng cục bộ (bài 3.5) để mất mạng một lúc không mất sự kiện.</li>
<li><strong>Bạn đăng nhập admin để sửa gì đó</strong> trên máy chủ của khách: 4624/4672 của bạn giờ nằm trong SIEM của họ. Ghi số ticket vào nhóm chat trước — không thì chính bạn là sự cố.</li>
</ul>

<h3>🧪 Thực hành (30 phút, trên máy Windows hoặc máy ảo)</h3>
<div class="callout ok"><ol>
<li>Dựng XPath cho "4625 có kiểu đăng nhập 3 (qua mạng)" ở thẻ XML của bộ lọc Event Viewer rồi dán vào <code>xpath_query</code>.</li>
<li>Cài Alloy cho Windows với cấu hình trên (trỏ <code>url</code> về Loki lab của bạn, lúc đầu chưa cần TLS), tạo một 4625 và tìm nó trong Grafana.</li>
<li>Khởi động lại dịch vụ Alloy hai lần. Đếm số dòng 4625 trong Loki: có bị trùng không?</li>
<li>Đặt <code>use_incoming_timestamp = false</code>, xoá bookmark, khởi động lại: giờ của các sự kiện cũ ra sao?</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 có <code>EventData[Data[@Name='LogonType']='3']</code>; câu 2 thấy dòng trong ~10 giây với <code>channel="Security"</code> và <code>event_id="4625"</code>; câu 3 không trùng (nhờ bookmark); câu 4 thấy sự kiện cũ bị gửi lại với giờ hiện tại — và bạn giải thích được vì sao điều đó làm hỏng dòng thời gian.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['loki.source.windowsevent', 'Thành phần Alloy đọc một kênh Windows Event Log; mỗi sự kiện một dòng JSON.'],
  ['use_incoming_timestamp', 'Dùng giờ của chính sự kiện (true) thay vì giờ đọc (mặc định false).'],
  ['Bookmark', 'Vị trí đã lưu trong event log để khởi động lại không mất, không lặp sự kiện.'],
  ['XPath query', 'Bộ lọc Event Log (*[System[(EventID=4625)]]) chạy ngay trên máy.'],
  ['Winlogbeat', 'Agent của Elastic cho sự kiện Windows; EventData giữ thành trường riêng.'],
  ['NXLog CE', 'Agent log miễn phí (im_msvistalog) chuyển đổi và chuyển tiếp sự kiện Windows.'],
  ['mTLS', 'Hai phía cùng trình chứng chỉ; máy chủ từ chối agent không có chứng chỉ.'],
  ['T1685.005', 'ATT&CK: Clear Windows Event Logs (trước là T1070.001).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gửi Security (theo Event ID), System, Sysmon và PowerShell 4104 — lọc bằng XPath ngay trên máy.</li>
<li>Alloy → Loki, Winlogbeat → Elasticsearch, NXLog → syslog/đâu cũng được; có domain thì dùng WEF.</li>
<li>Bật <code>use_incoming_timestamp</code>; giữ bookmark.</li>
<li>TLS hai chiều: mã hoá, kiểm máy chủ, kiểm agent.</li>
<li>Chứng minh đầu-cuối bằng một 4625 tự gây ra; cảnh báo 1102/104 và cảnh báo im lặng.</li>
</ul>
${nguon('📘', 'Grafana Alloy — loki.source.windowsevent', 'Tham số: eventlog_name, xpath_query, bookmark_path, use_incoming_timestamp', 'https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.windowsevent/')}
${nguon('📘', 'Cài Grafana Alloy trên Windows', 'Bộ cài MSI, dịch vụ, đường dẫn cấu hình', 'https://grafana.com/docs/alloy/latest/set-up/install/windows/')}
${nguon('📘', 'Configure Winlogbeat', 'event_logs: name, event_id, level, ignore_older', 'https://www.elastic.co/docs/reference/beats/winlogbeat/configuration-winlogbeat-options')}
${nguon('📘', 'Microsoft — Use Windows Event Forwarding to help with intrusion detection', 'Subscription baseline và suspect, nên thu sự kiện nào', 'https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/use-windows-event-forwarding-to-assist-in-intrusion-detection')}
${nguon('🛡️', 'MITRE ATT&CK — T1685.005 Clear Windows Event Logs', 'Trước là T1070.001; phát hiện: sự kiện 1102/104', 'https://attack.mitre.org/techniques/T1685/005/')}
${nguon('🛡️', 'MITRE ATT&CK — T1685.001 Disable or Modify Windows Event Log', 'Trước là T1562.002', 'https://attack.mitre.org/techniques/T1685/001/')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-1-3-windows', title: 'Blue Team 1.3 — Log Windows trong SIEM', sub: 'Sự kiện Sysmon và Security làm nguồn phát hiện', cta: 'Mở bài' })}
</div>
`,
};
