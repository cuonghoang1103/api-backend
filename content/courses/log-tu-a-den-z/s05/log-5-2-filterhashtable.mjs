/**
 * 5.2 — -FilterHashtable (soạn 24/11/2026, agent lgz). Output thật: OUT['s05/filterhashtable'] — Get-WinEventMau trên mẫu công khai.
 * Số tất định: ForwardedEvents 429×4624, 130×4625, 59×4648; 4625: 71 psadmin←10.115.247.239, 56 CTX-WS16-FS-T3$←10.115.55.139, 2 psadmin←.238, 1 chadkramer←130.86.9.236;
 * 23:20:54→23:21:26; cửa sổ 23:21:00–23:21:59 = 119; Data='10.115.247.238' = 20; Level=4 ⇒ 1 (Kernel-General 16); Level 0 = 650, 2 = 2, 4 = 1; Keywords AuditFailure = 130 × 4625;
 * dbc System Level 1,2: SCM 7011×25, 7009×8, DCOM 10010×4, 7023×4; Id=4625 trên dbc security+application = 38 × Application/EventSystem.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '5.2 — -FilterHashtable: LogName, Id, Level, StartTime, EndTime, ProviderName, Data|||5.2 — -FilterHashtable: LogName, Id, Level, StartTime, EndTime, ProviderName, Data',
  slug: 'log-5-2-filterhashtable',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lọc TẠI NGUỒN thay vì kéo hết về rồi Where-Object: từng khoá của -FilterHashtable (LogName/Path, Id, Level, ProviderName, Keywords, StartTime/EndTime, UserID, Data, trường có tên), luật AND giữa các khoá – OR trong một mảng, bảng băm được dịch thành XPath ra sao, và ba cái bẫy thật trong log mẫu: log Security có Level 0 nên Level=4 không ra gì, Event ID 4625 của nhà cung cấp khác, và giờ StartTime là giờ máy đang chạy.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Ask the log service, not your pipeline</h2>
<p class="lead"><code>Get-WinEvent -LogName Security | Where-Object Id -eq 4625</code> works — by reading <em>every</em> event of the Security log into PowerShell and throwing 99 % of them away. <code>-FilterHashtable</code> sends the condition to the Windows Event Log service, which returns only the matching events. Same answer, a fraction of the time and memory, and the only sane way to query a 4 GB log or a remote server.</p>

<h3>The everyday picture: ordering at a counter</h3>
<p>Where-Object is asking the warehouse to deliver <em>every</em> box to your desk so you can pick out the red ones. FilterHashtable is handing the clerk a slip: "red, size M, delivered after Monday". Each line on the slip must be true (AND); "red or blue" on one line is a choice (OR).</p>

${kv([
  ['LogName / Path', 'Which log(s) or which .evtx file(s). Arrays allowed.'],
  ['Id', 'Event ID(s): Id = 4624, 4625.'],
  ['Level', '1 Critical · 2 Error · 3 Warning · 4 Information · 5 Verbose · 0 LogAlways.'],
  ['ProviderName', 'Who wrote the event — disambiguates IDs that several providers reuse.'],
  ['Keywords', 'Bit mask: Audit Success 0x20000000000000 (9007199254740992), Audit Failure 0x10000000000000 (4503599627370496).'],
  ['StartTime / EndTime', '[datetime] in the local time of the machine running the command.'],
  ['UserID', 'The SID in the System part (who the event is about for some providers).'],
  ['Data', 'Any EventData value equals this (unnamed match).'],
  ['&lt;named-data&gt;', 'Any EventData field by name: TargetUserName = \'admin\', IpAddress = \'…\' — PowerShell 6 and later only.'],
])}

<h3>Step 1 — Id: one value, then an array</h3>
${lenh('s05/filterhashtable', 0)}
${lenh('s05/filterhashtable', 1)}
${lenh('s05/filterhashtable', 2)}
<p>The sample is the ForwardedEvents log of a real university collector (Lesson 5.7). <code>Id = 4625</code> → 130; <code>Id = 4624, 4625</code> → 559 = 429 + 130: inside one key, values are <strong>OR</strong>.</p>

<h3>Step 2 — see what Get-WinEvent really sends</h3>
${lenh('s05/filterhashtable', 3)}
<p>Add <code>-Verbose</code> and Get-WinEvent prints the "constructed structured query": your hashtable becomes an XPath expression wrapped in a <code>&lt;QueryList&gt;</code> — exactly the language of Lesson 5.3. Keys become <strong>AND</strong>ed predicates; <code>TargetUserName = 'psadmin'</code> became <code>Data[@Name='TargetUserName']='psadmin'</code>. When a hashtable "returns nothing" and you do not know why, <code>-Verbose</code> is the first thing to look at.</p>

<h3>Step 3 — group, count, narrow the time window</h3>
${lenh('s05/filterhashtable', 4)}
${lenh('s05/filterhashtable', 5)}
${lenh('s05/filterhashtable', 6)}
${lenh('s05/filterhashtable', 7)}
<p>Two sources produce almost all failures: <code>psadmin</code> from 10.115.247.239 (71, SubStatus 0xc0000064 — the account does not exist on this server) and the computer account <code>CTX-WS16-FS-T3$</code> (56 — a machine with a stale password or a misconfigured service). That is the daily reality of a domain log: most 4625 are <em>broken configurations</em>, not attackers. <code>StartTime</code>/<code>EndTime</code> cut the window to one minute (119 of 130). <code>Data = '10.115.247.238'</code> matches that value in <em>any</em> field — 20 events, 4624 and 4625 mixed — handy when you only know "something with this IP".</p>

<h3>Step 4 — the Level trap on the Security log</h3>
${lenh('s05/filterhashtable', 8)}
${lenh('s05/filterhashtable', 9)}
${lenh('s05/filterhashtable', 12)}
<p>"Give me Information events from Security" with <code>Level = 4</code> returns <strong>one</strong> event — and it is not even a security audit (Kernel-General 16, a registry-hive housekeeping event from a workstation that the collector also received). The 650 audit events are stored with <strong>Level 0</strong> (LogAlways); Event Viewer just displays them as "Information". For the Security log, select success/failure with <strong>Keywords</strong> instead: Audit Failure returns exactly the 130 failures. On other logs Level works as you expect:</p>
${lenh('s05/filterhashtable', 10)}
<p>Level 1–2 on three Windows 7 machines: Service Control Manager timeouts (7011, 7009), DCOM 10010 ("server did not register within the required timeout") and 7023 (service terminated with an error) — the classic "slow boot" signature.</p>

<h3>Step 5 — the same ID, another provider</h3>
${lenh('s05/filterhashtable', 13)}
<p>On machines that have <em>no</em> failed logons at all, <code>Id = 4625</code> still returns 38 events: in the Application log, provider <strong>Microsoft-Windows-EventSystem</strong> uses 4625 for "the EventSystem sub system is suppressing duplicate event log entries". Lesson 3.6 showed the same with ID 1000 (four providers). Rule: always pair an Id with <code>LogName</code> (or <code>ProviderName</code>) — a morning report that counts "failed logons" without LogName would raise false alarms.</p>
${lenh('s05/filterhashtable', 11)}
<p><code>ProviderName</code> + <code>Id</code> is also how you list boots (Kernel-General 12 = OS started, 13 = OS shut down). Note the first line: <strong>14/7/2009</strong> — the shutdown at the end of Microsoft's build of the Windows 7 image, carried into every installed copy. Treat "impossible" dates as a clue, not an error.</p>

<h3>Step 6 — build the query yourself</h3>
${lenh('s05/filterhashtable', 14)}
<p>A hashtable is a shortcut for XPath. When you need something a hashtable cannot say (NOT, "field A or field B", "exclude these"), switch to <code>-FilterXPath</code> / <code>-FilterXml</code> — next lesson.</p>

<h3>On your Windows machine</h3>
<pre><code class="language-powershell"># Failed logons in the last 24 hours, grouped by user and source IP
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4625; StartTime = (Get-Date).AddDays(-1) } -ErrorAction SilentlyContinue |
  Group-Object { $_.Properties[5].Value }, { $_.Properties[19].Value } | Sort-Object Count -Descending | Select-Object -First 10 Count, Name

# Critical + Error events of System this week, by provider and ID
Get-WinEvent -FilterHashtable @{ LogName = 'System'; Level = 1, 2; StartTime = (Get-Date).AddDays(-7) } |
  Group-Object ProviderName, Id | Sort-Object Count -Descending | Select-Object -First 10 Count, Name

# Named field (PowerShell 7): everything about one IP in the Security log
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; IpAddress = '203.0.113.66' } -MaxEvents 50</code></pre>
<div class="pitfall"><p><strong>Windows PowerShell 5.1 does not understand named fields</strong> (<code>IpAddress = …</code>) — Microsoft added &lt;named-data&gt; keys in PowerShell 6. On a server with only 5.1, use <code>Data = '…'</code> (any field) or <code>-FilterXPath</code>. And if a hashtable matches nothing, Get-WinEvent raises an <em>error</em> ("No events were found…"), not an empty result — add <code>-ErrorAction SilentlyContinue</code> in scripts.</p></div>

<h3>🛡️ Attacker's corner: the needle is the rare value</h3>
<p>Attackers count on defenders drowning: 130 failures in 30 seconds here are almost all a misconfigured service and a stale computer account. The one line that matters is <code>chadkramer ← 130.86.9.236</code> — a single failure from a different network. FilterHashtable + Group-Object gives you the "long tail" in seconds; that is how password spraying (one or two attempts per account, many accounts — ATT&amp;CK T1110.003) is found: not by volume, but by <em>breadth</em> (many users from one IP) and by <em>rarity</em> (a source you have never seen).</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Why FilterHashtable instead of Where-Object?" — filtering happens in the Event Log service; only matching events cross into PowerShell — faster, less memory, essential on big or remote logs.</li>
<li>"Keys are combined how?" — different keys AND, values in one key's array OR.</li>
<li>"Level = 4 on Security returns nothing. Why?" — audit events are Level 0; use Keywords (Audit Success/Failure) or just Id.</li>
<li>"How do you check what query a hashtable produced?" — <code>-Verbose</code> shows the structured XML query.</li>
</ul>

<h3>At work</h3>
<p>Customers' servers are often busy production machines; a careless <code>Get-WinEvent -LogName Security | Where-Object …</code> over RDP can pin a CPU and take minutes. Use hashtables with <code>StartTime</code> and <code>-MaxEvents</code> first, then widen. In your ticket write the exact hashtable you ran — the reviewer can rerun it on another server unchanged.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>On the ForwardedEvents sample, how many 4624 came from slad3 (<code>MachineName</code>) — and can you express "from slad3" inside the hashtable? (Hint: not directly — why?)</li>
<li>Count 4625 per SubStatus with one hashtable and one Group-Object.</li>
<li>On your own Windows machine, list the providers that wrote Level 1–2 events in System during the last 7 days; look up the top one.</li>
</ol>
<p><strong>Pass:</strong> (1) 61; Computer is not a hashtable key → filter MachineName with Where-Object or use XPath <code>System[Computer='…']</code> (5.3); (2) 73 × 0xc0000064, 57 × 0xc000006a; (3) a list of providers with counts and a one-line explanation of the first.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['FilterHashtable', 'Filter keys sent to the Event Log service.'],
  ['AND / OR', 'Between keys / inside one key\'s array.'],
  ['Level 0', 'LogAlways — how Security audit events are stored.'],
  ['Keywords', 'Audit Success / Audit Failure bits for Security.'],
  ['&lt;named-data&gt;', 'Filter by an EventData field name (PowerShell 6+).'],
  ['-Verbose', 'Shows the XML query the hashtable became.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Filter at the source; Where-Object only for what a filter cannot express.</li>
<li>Always pair Id with LogName/ProviderName — IDs are reused.</li>
<li>Security: Level 0; use Keywords or Id.</li>
<li>StartTime is local time; named fields need PowerShell 6+.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Creating Get-WinEvent queries with FilterHashtable', 'Key table, <named-data>, building a hashtable step by step', 'https://learn.microsoft.com/en-us/powershell/scripting/samples/creating-get-winevent-queries-with-filterhashtable')}
${nguon('🛡️', 'MITRE ATT&CK T1110.003 — Password Spraying', 'Why breadth matters more than volume', 'https://attack.mitre.org/techniques/T1110/003/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-6-reliability-monitor', title: 'Lesson 3.6 — Reliability Monitor', sub: 'ID 1000 written by four providers', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-3-xpath-xml', title: 'Lesson 5.3 — -FilterXPath and -FilterXml', sub: 'What hashtables cannot say', cta: 'Next' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Hỏi dịch vụ log, đừng hỏi đường ống của bạn</h2>
<p class="lead"><code>Get-WinEvent -LogName Security | Where-Object Id -eq 4625</code> chạy được — bằng cách đọc <em>mọi</em> sự kiện của log Security vào PowerShell rồi vứt đi 99 %. <code>-FilterHashtable</code> gửi điều kiện cho dịch vụ Windows Event Log, dịch vụ chỉ trả về sự kiện khớp. Cùng đáp án, tốn một phần nhỏ thời gian và bộ nhớ, và là cách duy nhất còn tỉnh táo để truy vấn log 4 GB hay máy chủ ở xa.</p>

<h3>Liên tưởng đời thường: gọi hàng ở quầy</h3>
<p>Where-Object là bảo kho chở <em>mọi</em> thùng hàng tới bàn bạn để bạn tự nhặt thùng màu đỏ. FilterHashtable là đưa cho nhân viên một tờ phiếu: "màu đỏ, cỡ M, nhập sau thứ Hai". Mỗi dòng trên phiếu đều phải đúng (AND); "đỏ hoặc xanh" trên một dòng là lựa chọn (OR).</p>

${kv([
  ['LogName / Path', 'Log nào hoặc tệp .evtx nào. Cho phép mảng.'],
  ['Id', 'Event ID: Id = 4624, 4625.'],
  ['Level', '1 Critical · 2 Error · 3 Warning · 4 Information · 5 Verbose · 0 LogAlways.'],
  ['ProviderName', 'Ai ghi sự kiện — phân biệt các ID bị nhiều nhà cung cấp dùng lại.'],
  ['Keywords', 'Mặt nạ bit: Audit Success 0x20000000000000 (9007199254740992), Audit Failure 0x10000000000000 (4503599627370496).'],
  ['StartTime / EndTime', '[datetime] theo giờ địa phương của máy đang chạy lệnh.'],
  ['UserID', 'SID ở phần System (với vài nhà cung cấp, đó là người mà sự kiện nói tới).'],
  ['Data', 'Bất kỳ giá trị EventData nào bằng giá trị này (khớp không cần tên).'],
  ['&lt;named-data&gt;', 'Một trường EventData bất kỳ theo tên: TargetUserName = \'admin\', IpAddress = \'…\' — chỉ từ PowerShell 6 trở lên.'],
])}

<h3>Bước 1 — Id: một giá trị, rồi một mảng</h3>
${lenh('s05/filterhashtable', 0)}
${lenh('s05/filterhashtable', 1)}
${lenh('s05/filterhashtable', 2)}
<p>Mẫu này là log ForwardedEvents của một máy gom log thật ở một trường đại học (Bài 5.7). <code>Id = 4625</code> → 130; <code>Id = 4624, 4625</code> → 559 = 429 + 130: trong một khoá, các giá trị là <strong>OR</strong>.</p>

<h3>Bước 2 — xem Get-WinEvent thật sự gửi đi cái gì</h3>
${lenh('s05/filterhashtable', 3)}
<p>Thêm <code>-Verbose</code> là Get-WinEvent in ra "constructed structured query": bảng băm của bạn thành một biểu thức XPath bọc trong <code>&lt;QueryList&gt;</code> — đúng ngôn ngữ của Bài 5.3. Các khoá thành những điều kiện nối bằng <strong>AND</strong>; <code>TargetUserName = 'psadmin'</code> thành <code>Data[@Name='TargetUserName']='psadmin'</code>. Khi một bảng băm "không ra gì" mà bạn không hiểu vì sao, <code>-Verbose</code> là chỗ đầu tiên cần nhìn.</p>

<h3>Bước 3 — gom nhóm, đếm, thu hẹp khung giờ</h3>
${lenh('s05/filterhashtable', 4)}
${lenh('s05/filterhashtable', 5)}
${lenh('s05/filterhashtable', 6)}
${lenh('s05/filterhashtable', 7)}
<p>Hai nguồn tạo ra gần hết lần thất bại: <code>psadmin</code> từ 10.115.247.239 (71 lần, SubStatus 0xc0000064 — tài khoản không tồn tại trên máy chủ này) và tài khoản máy <code>CTX-WS16-FS-T3$</code> (56 lần — một máy có mật khẩu máy đã cũ hoặc một dịch vụ cấu hình sai). Đó là thực tế hằng ngày của log miền: phần lớn 4625 là <em>cấu hình hỏng</em>, không phải kẻ tấn công. <code>StartTime</code>/<code>EndTime</code> cắt khung xuống một phút (119 trên 130). <code>Data = '10.115.247.238'</code> khớp giá trị đó ở <em>bất kỳ</em> trường nào — 20 sự kiện, lẫn cả 4624 và 4625 — tiện khi bạn chỉ biết "có gì đó với IP này".</p>

<h3>Bước 4 — cái bẫy Level trên log Security</h3>
${lenh('s05/filterhashtable', 8)}
${lenh('s05/filterhashtable', 9)}
${lenh('s05/filterhashtable', 12)}
<p>"Cho tôi các sự kiện Information của Security" bằng <code>Level = 4</code> trả về <strong>một</strong> sự kiện — mà còn không phải sự kiện kiểm toán (Kernel-General 16, một sự kiện dọn dẹp tệp hive registry từ một máy trạm mà máy gom cũng nhận). 650 sự kiện kiểm toán được lưu với <strong>Level 0</strong> (LogAlways); Event Viewer chỉ <em>hiển thị</em> chúng là "Information". Với log Security, chọn thành công/thất bại bằng <strong>Keywords</strong>: Audit Failure trả đúng 130 lần thất bại. Ở các log khác, Level chạy như bạn nghĩ:</p>
${lenh('s05/filterhashtable', 10)}
<p>Level 1–2 trên ba máy Windows 7: Service Control Manager hết giờ chờ (7011, 7009), DCOM 10010 ("máy chủ không đăng ký trong thời gian quy định") và 7023 (dịch vụ dừng kèm lỗi) — dấu hiệu kinh điển của "khởi động chậm".</p>

<h3>Bước 5 — cùng ID, nhà cung cấp khác</h3>
${lenh('s05/filterhashtable', 13)}
<p>Trên những máy <em>không hề</em> có lần đăng nhập hỏng nào, <code>Id = 4625</code> vẫn trả 38 sự kiện: trong log Application, nhà cung cấp <strong>Microsoft-Windows-EventSystem</strong> dùng 4625 cho "hệ con EventSystem đang chặn các mục log trùng lặp". Bài 3.6 đã thấy điều tương tự với ID 1000 (bốn nhà cung cấp). Luật: luôn đi kèm Id với <code>LogName</code> (hoặc <code>ProviderName</code>) — một báo cáo buổi sáng đếm "đăng nhập hỏng" mà thiếu LogName sẽ báo động giả.</p>
${lenh('s05/filterhashtable', 11)}
<p><code>ProviderName</code> + <code>Id</code> cũng là cách liệt kê các lần khởi động (Kernel-General 12 = hệ điều hành khởi động, 13 = tắt). Để ý dòng đầu: <strong>14/7/2009</strong> — lần tắt máy cuối của bản dựng ảnh Windows 7 tại Microsoft, đi theo vào mọi bản cài. Coi ngày "không thể" là manh mối, không phải lỗi.</p>

<h3>Bước 6 — tự dựng truy vấn</h3>
${lenh('s05/filterhashtable', 14)}
<p>Bảng băm là lối tắt của XPath. Khi cần nói điều bảng băm không nói được (NOT, "trường A hoặc trường B", "loại trừ những cái này"), chuyển sang <code>-FilterXPath</code> / <code>-FilterXml</code> — bài sau.</p>

<h3>Trên máy Windows của bạn</h3>
<pre><code class="language-powershell"># Đăng nhập hỏng 24 giờ qua, gom theo người dùng và IP nguồn
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4625; StartTime = (Get-Date).AddDays(-1) } -ErrorAction SilentlyContinue |
  Group-Object { $_.Properties[5].Value }, { $_.Properties[19].Value } | Sort-Object Count -Descending | Select-Object -First 10 Count, Name

# Sự kiện Critical + Error của System trong tuần, theo nhà cung cấp và ID
Get-WinEvent -FilterHashtable @{ LogName = 'System'; Level = 1, 2; StartTime = (Get-Date).AddDays(-7) } |
  Group-Object ProviderName, Id | Sort-Object Count -Descending | Select-Object -First 10 Count, Name

# Trường có tên (PowerShell 7): mọi thứ về một IP trong log Security
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; IpAddress = '203.0.113.66' } -MaxEvents 50</code></pre>
<div class="pitfall"><p><strong>Windows PowerShell 5.1 không hiểu trường có tên</strong> (<code>IpAddress = …</code>) — Microsoft thêm khoá &lt;named-data&gt; từ PowerShell 6. Trên máy chủ chỉ có 5.1, dùng <code>Data = '…'</code> (trường bất kỳ) hoặc <code>-FilterXPath</code>. Và nếu bảng băm không khớp gì, Get-WinEvent ném <em>lỗi</em> ("No events were found…") chứ không trả kết quả rỗng — thêm <code>-ErrorAction SilentlyContinue</code> trong script.</p></div>

<h3>🛡️ Góc hacker: cây kim là giá trị hiếm</h3>
<p>Kẻ tấn công trông vào việc người phòng thủ bị ngập: 130 lần thất bại trong 30 giây ở đây gần hết là một dịch vụ cấu hình sai và một tài khoản máy có mật khẩu cũ. Dòng duy nhất đáng để ý là <code>chadkramer ← 130.86.9.236</code> — một lần thất bại từ một mạng khác. FilterHashtable + Group-Object cho bạn "phần đuôi dài" trong vài giây; đó là cách phát hiện password spraying (một hai lần thử cho mỗi tài khoản, rất nhiều tài khoản — ATT&amp;CK T1110.003): không phải theo số lượng, mà theo <em>độ rộng</em> (nhiều người dùng từ một IP) và <em>độ hiếm</em> (một nguồn chưa từng thấy).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Vì sao dùng FilterHashtable thay vì Where-Object?" — việc lọc diễn ra trong dịch vụ Event Log; chỉ sự kiện khớp mới sang PowerShell — nhanh hơn, ít bộ nhớ hơn, bắt buộc với log lớn hoặc ở xa.</li>
<li>"Các khoá được kết hợp thế nào?" — khác khoá thì AND, các giá trị trong mảng của một khoá thì OR.</li>
<li>"Level = 4 trên Security không ra gì. Vì sao?" — sự kiện kiểm toán là Level 0; dùng Keywords (Audit Success/Failure) hoặc chỉ Id.</li>
<li>"Làm sao kiểm bảng băm đã thành truy vấn gì?" — <code>-Verbose</code> in truy vấn XML có cấu trúc.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Máy chủ của khách thường là máy production đang bận; một lệnh <code>Get-WinEvent -LogName Security | Where-Object …</code> bất cẩn qua RDP có thể ghim một nhân CPU và chạy nhiều phút. Dùng bảng băm có <code>StartTime</code> và <code>-MaxEvents</code> trước, rồi mới nới rộng. Trong ticket, ghi đúng bảng băm bạn đã chạy — người duyệt chạy lại được trên máy chủ khác mà không cần sửa.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Trên mẫu ForwardedEvents, có bao nhiêu 4624 đến từ slad3 (<code>MachineName</code>) — và có viết "từ slad3" ngay trong bảng băm được không? (Gợi ý: không trực tiếp — vì sao?)</li>
<li>Đếm 4625 theo SubStatus bằng một bảng băm và một Group-Object.</li>
<li>Trên máy Windows của bạn, liệt kê các nhà cung cấp đã ghi sự kiện Level 1–2 vào System trong 7 ngày qua; tra cứu cái đứng đầu.</li>
</ol>
<p><strong>Đạt:</strong> (1) 61; Computer không phải khoá của bảng băm → lọc MachineName bằng Where-Object hoặc dùng XPath <code>System[Computer='…']</code> (5.3); (2) 73 × 0xc0000064, 57 × 0xc000006a; (3) danh sách nhà cung cấp kèm số lượng và một dòng giải thích cái đầu tiên.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['FilterHashtable', 'Các khoá lọc gửi tới dịch vụ Event Log.'],
  ['AND / OR', 'Giữa các khoá / trong mảng của một khoá.'],
  ['Level 0', 'LogAlways — cách sự kiện kiểm toán Security được lưu.'],
  ['Keywords', 'Bit Audit Success / Audit Failure của Security.'],
  ['&lt;named-data&gt;', 'Lọc theo tên trường EventData (PowerShell 6+).'],
  ['-Verbose', 'Cho thấy truy vấn XML mà bảng băm đã biến thành.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lọc tại nguồn; Where-Object chỉ cho điều bộ lọc không diễn đạt được.</li>
<li>Luôn đi kèm Id với LogName/ProviderName — ID bị dùng lại.</li>
<li>Security: Level 0; dùng Keywords hoặc Id.</li>
<li>StartTime là giờ địa phương; trường có tên cần PowerShell 6+.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Creating Get-WinEvent queries with FilterHashtable', 'Bảng khoá, <named-data>, dựng bảng băm từng bước', 'https://learn.microsoft.com/en-us/powershell/scripting/samples/creating-get-winevent-queries-with-filterhashtable')}
${nguon('🛡️', 'MITRE ATT&CK T1110.003 — Password Spraying', 'Vì sao độ rộng quan trọng hơn số lượng', 'https://attack.mitre.org/techniques/T1110/003/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-6-reliability-monitor', title: 'Bài 3.6 — Reliability Monitor', sub: 'ID 1000 do bốn nhà cung cấp ghi', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-3-xpath-xml', title: 'Bài 5.3 — -FilterXPath và -FilterXml', sub: 'Điều bảng băm không nói được', cta: 'Bài tiếp' })}
</div>
`,
};
