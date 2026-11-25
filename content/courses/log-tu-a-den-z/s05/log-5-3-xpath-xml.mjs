/**
 * 5.3 — -FilterXPath, -FilterXml, tách EventData (soạn 24/11/2026, agent lgz). Output thật: OUT['s05/xpath-xml'] — Get-WinEventMau chấm XPath bằng .NET trên XML thật từng bản ghi.
 * Số tất định (ForwardedEvents): SubStatus 0xc000006a = 57, còn lại 73 × 0xc0000064; slad3 4624 = 61; LogonType 4624 toàn bộ 429 × 3; timediff 600000 với Now 00:01:30 ⇒ 1 sự kiện (Kernel-General 16);
 * Suppress 0xc0000064 ⇒ 56 CTX-WS16-FS-T3$, 36 univ-svc-servicenow, 34 univ-svc-idm…; 4720/4728/4738/4756 lúc 23:20:55–23:21:11 do univ-svc-idm (madilynloughlin, justinwalberg); Event/System[EventID=4625] = 3561.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '5.3 — -FilterXPath and -FilterXml, and parsing EventData fields from event XML|||5.3 — -FilterXPath và -FilterXml, và tách các trường EventData từ XML của sự kiện',
  slug: 'log-5-3-xpath-xml',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ngôn ngữ lọc thật sự của Windows Event Log: XPath (tập con của XPath 1.0 — chỉ [], and/or/not, so sánh, @thuộc-tính, timediff() và band(); KHÔNG có contains()), truy vấn XML có cấu trúc với nhiều Select và Suppress, sao chép truy vấn từ Event Viewer (tab XML của Filter Current Log), và hàm ConvertFrom-EventData biến mọi sự kiện thành đối tượng có tên trường. Thực hành trên log ForwardedEvents thật của một trường đại học.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>The real query language of Windows logs</h2>
<p class="lead">Every filter you have used so far — Event Viewer's "Filter Current Log", a hashtable, a WEF subscription, a Task Scheduler trigger "On an event" — is turned into the same thing: an <strong>XPath expression</strong> evaluated against the XML of each event. Learn to write it directly and you can express what the friendly tools cannot: "not this", "this field or that one", "everything except the noise".</p>

<h3>The everyday picture: an address on an envelope</h3>
<p>The event's XML is a building: <code>Event</code> → floor <code>System</code> or <code>EventData</code> → room <code>Data</code> with a name plate (<code>@Name</code>). XPath is the address: <code>*[System[EventID=4625]]</code> reads "any event whose System floor has EventID 4625". Square brackets mean "which has…"; you can nest them as deep as the building.</p>

${kv([
  ['*[System[EventID=4625]]', 'Events with ID 4625. Paths start with * or Event.'],
  ['*[System[(EventID=4624 or EventID=4625) and Level=0]]', 'Parentheses, or, and.'],
  ['*[System[Computer=\'slad3…\']]', 'Any System field: Computer, Channel, Provider[@Name], Execution[@ProcessID], Security[@UserID].'],
  ['*[EventData[Data[@Name=\'IpAddress\']=\'10.0.0.5\']]', 'A named EventData field.'],
  ['*[EventData[Data=\'x\']]', 'Any Data value equals x.'],
  ['!=, &lt;, &gt;, &lt;=, &gt;=', 'Comparison operators (escape &lt; and &gt; inside XML).'],
  ['timediff(@SystemTime) &lt;= 86400000', 'Within the last N milliseconds (here 24 h) — Windows-only function.'],
  ['band(Keywords, 4503599627370496)', 'Bitwise AND — Windows-only; e.g. Audit Failure.'],
])}

<h3>Step 1 — conditions on two floors at once</h3>
${lenh('s05/xpath-xml', 0)}
${lenh('s05/xpath-xml', 1)}
${lenh('s05/xpath-xml', 2)}
<p>One XPath combines System (EventID, Computer) and EventData (SubStatus) — something a hashtable can do only by name and only in PowerShell 6+. <code>!=</code> gives you "everything except": 73 failures are "user does not exist" (0xc0000064), 57 are "wrong password". <code>Computer='…'</code> answers last lesson's exercise: 61 logons on slad3.</p>
${lenh('s05/xpath-xml', 3)}
<p>Every one of the 429 successful logons is type 3 (network): a domain server's normal life — services, file shares, machine accounts — no human at a keyboard. A type 10 or type 2 here would be the event worth opening.</p>

<h3>Step 2 — "the last N minutes": timediff</h3>
${lenh('s05/xpath-xml', 4)}
<p><code>timediff(@SystemTime)</code> is the age of the event in milliseconds, measured against <em>now</em>. Here "now" is frozen at 00:01:30 so the result is reproducible; on a live server, <code>timediff(@SystemTime) &lt;= 3600000</code> is "the last hour". This is how Event Viewer's "Logged: Last hour" and WEF subscriptions express time.</p>

<h3>Step 3 — what XPath cannot do</h3>
${lenh('s05/xpath-xml', 5)}
<p>Windows Event Log supports only a <strong>subset of XPath 1.0</strong>: child and attribute axes, <code>=, !=, &lt;, &gt;, and, or</code>, parentheses, <code>position()</code>, plus <code>band()</code> and <code>timediff()</code> (Microsoft, "Consuming events → XPath 1.0 limitations"). No <code>contains()</code>, no <code>starts-with()</code>, no wildcards inside values. "All accounts ending with $" or "command line contains powershell" cannot be asked of the log service — fetch a narrowed set with XPath, then finish with <code>Where-Object { $_.… -like '*powershell*' }</code>.</p>

<h3>Step 4 — structured XML queries: Select and Suppress</h3>
${lenh('s05/xpath-xml', 6)}
<p>A <code>&lt;QueryList&gt;</code> can hold several <code>&lt;Select&gt;</code> (union) and <code>&lt;Suppress&gt;</code> (subtract). Here: all logons and failures, <em>minus</em> the "user does not exist" noise. What is left is the list a human should read: the machine account with a bad password, service accounts logging on (normal for svc-servicenow, worth confirming once), workstations.</p>
${lenh('s05/xpath-xml', 7)}
<p>Two Selects in one query (both on Security here; in real life one can read System and another Security). The result is a small account-management story: at 23:20:55 and 23:21:11 the identity-management service account <code>univ-svc-idm</code> created and updated users and put them into groups. Automated, expected — and exactly the kind of query you save for "who changed group membership today?".</p>

<div class="callout"><p><strong>Let Event Viewer write the XML for you.</strong> Event Viewer → right-click a log → Filter Current Log → fill the form → tab <strong>XML</strong> → "Edit query manually" to add a <code>&lt;Suppress&gt;</code>. Copy the XML into <code>-FilterXml</code> in a script, or save it as a Custom View (Lesson 3.4). Same query, three tools.</p></div>

<h3>Step 5 — every event as an object with named fields</h3>
${lenh('s05/xpath-xml', 8)}
<p><code>ConvertFrom-EventData</code> is ten lines you will reuse in every script of this course: it walks the <code>&lt;Data Name="…"&gt;</code> elements and builds an object whose properties are the field names. From then on you write <code>Format-Table SubjectUserName, MemberName, TargetUserName</code> instead of guessing <code>Properties[6]</code>. (For events with <em>unnamed</em> Data — old classic events such as 1000 or 1074 — name them p0, p1… as the Lab does.)</p>
${lenh('s05/xpath-xml', 9)}
<p>The <code>Event/System[…]</code> form is also valid; it selects the same 3561 events of Lesson 5.1.</p>

<h3>On your Windows machine</h3>
<pre><code class="language-powershell"># XPath directly
Get-WinEvent -LogName Security -FilterXPath "*[System[EventID=4625] and EventData[Data[@Name='LogonType']='10']]" -MaxEvents 20

# Errors and warnings of the last 24 h in Application and System, minus one noisy source
$q = @'
&lt;QueryList&gt;
  &lt;Query Id="0"&gt;
    &lt;Select Path="Application"&gt;*[System[(Level=2 or Level=3) and TimeCreated[timediff(@SystemTime) &amp;lt;= 86400000]]]&lt;/Select&gt;
    &lt;Select Path="System"&gt;*[System[(Level=2 or Level=3) and TimeCreated[timediff(@SystemTime) &amp;lt;= 86400000]]]&lt;/Select&gt;
    &lt;Suppress Path="System"&gt;*[System[Provider[@Name='Microsoft-Windows-DistributedCOM']]]&lt;/Suppress&gt;
  &lt;/Query&gt;
&lt;/QueryList&gt;
'@
Get-WinEvent -FilterXml $q | Group-Object LogName, ProviderName, Id | Sort-Object Count -Descending | Select-Object -First 15 Count, Name

# A reusable converter
function ConvertFrom-EventData {
  process {
    $o = [ordered]@{ TimeCreated = $_.TimeCreated; Id = $_.Id; Machine = $_.MachineName }
    foreach ($d in ([xml]$_.ToXml()).Event.EventData.Data) { $o[$d.Name] = $d.'#text' }
    [pscustomobject]$o
  }
}</code></pre>
<div class="pitfall"><p><strong>Escape inside XML.</strong> In a <code>&lt;QueryList&gt;</code> string, <code>&lt;=</code> must be written <code>&amp;lt;=</code>. In a here-string <code>@' … '@</code> PowerShell does not touch <code>$</code> or quotes, which is why it is the usual way to paste a query into a script.</p></div>

<h3>🛡️ Attacker's corner: noise is a hiding place</h3>
<p>Suppress is powerful in both directions. Defenders use it to remove known noise; an attacker who can edit your saved queries, Custom Views or WEF subscription (they are just XML files and GPO settings) can add a Suppress for their own tool or account and you will "see nothing" while the events are still in the log. Keep detection queries in version control, review changes to them like code, and periodically run the query <em>without</em> suppressions to check what you are hiding.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Can you filter Windows events with contains()?" — no; the log service supports a subset of XPath 1.0; narrow with XPath, finish with Where-Object.</li>
<li>"How do you express 'the last hour' in an event XPath?" — <code>TimeCreated[timediff(@SystemTime) &lt;= 3600000]</code>.</li>
<li>"Select vs Suppress?" — union of matches vs events removed from the result.</li>
<li>"How do you get EventData fields by name in PowerShell?" — cast <code>ToXml()</code> to <code>[xml]</code>, walk <code>Event.EventData.Data</code>, build an object.</li>
</ul>

<h3>At work</h3>
<p>Monitoring tools for Windows (the Elastic Agent and Winlogbeat <code>event_logs</code> settings, the Azure Monitor Agent data collection rules, Splunk's <code>whitelist/blacklist</code>, WEF subscriptions) all accept XPath. The query you test today with Get-WinEvent is the one you paste into the agent configuration tomorrow — test it first on an exported log so you know exactly how many events per day it will ship.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Write one XPath for: 4624 <em>or</em> 4625 on slad1 whose TargetUserName is <code>psadmin</code>. How many?</li>
<li>Write a QueryList that selects all 4728/4756 and suppresses those done by <code>univ-svc-idm</code>. What is left, and what does that mean?</li>
<li>Explain why <code>*[EventData[Data[@Name='TargetUserName']!='-']]</code> and <code>*[EventData[not(Data[@Name='TargetUserName']='-')]]</code> may differ on events that have no TargetUserName field.</li>
</ol>
<p><strong>Pass:</strong> (1) 73 (71 + 2, all 4625 — psadmin never logged on successfully); (2) nothing is left: every group change was the IDM service — a clean answer to "did a human change groups?"; (3) <code>!=</code> needs the field to exist (no node, no comparison → false), <code>not(… = …)</code> is true when the field is missing.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['XPath (Event Log)', 'Subset of XPath 1.0 used by every Windows event filter.'],
  ['timediff() / band()', 'Windows-only functions: age in ms / bit test.'],
  ['QueryList', 'Structured query: several Select + Suppress.'],
  ['Suppress', 'Remove matches from the result.'],
  ['ConvertFrom-EventData', 'Event → object with named fields.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>XPath is the common language of Event Viewer, Get-WinEvent, WEF and agents.</li>
<li>Subset only: no contains(); finish text matching in PowerShell.</li>
<li>QueryList = union of Selects minus Suppresses; review suppressions.</li>
<li>Read fields by name through the event XML.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Consuming events (Windows Event Log)', 'XPath examples, structured queries, XPath 1.0 limitations, timediff and band', 'https://learn.microsoft.com/en-us/windows/win32/wes/consuming-events')}
${nguon('📘', 'Microsoft Learn — Get-WinEvent', '-FilterXPath and -FilterXml parameters', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-4-loc-luu', title: 'Lesson 3.4 — Filter, Custom Views, export', sub: 'The same XML in Event Viewer', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-4-wevtutil-cmd', title: 'Lesson 5.4 — wevtutil and cmd tools', sub: 'The same XPath from the command prompt', cta: 'Next' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Ngôn ngữ truy vấn thật sự của log Windows</h2>
<p class="lead">Mọi bộ lọc bạn đã dùng — "Filter Current Log" của Event Viewer, bảng băm, một subscription WEF, trigger "On an event" của Task Scheduler — đều được biến thành cùng một thứ: một <strong>biểu thức XPath</strong> chấm trên XML của từng sự kiện. Học viết trực tiếp là bạn nói được điều các công cụ thân thiện không nói được: "trừ cái này", "trường này hoặc trường kia", "mọi thứ trừ tiếng ồn".</p>

<h3>Liên tưởng đời thường: địa chỉ ghi trên phong bì</h3>
<p>XML của sự kiện là một toà nhà: <code>Event</code> → tầng <code>System</code> hoặc <code>EventData</code> → phòng <code>Data</code> có biển tên (<code>@Name</code>). XPath là địa chỉ: <code>*[System[EventID=4625]]</code> đọc là "bất kỳ sự kiện nào có tầng System mang EventID 4625". Ngoặc vuông nghĩa là "có…"; lồng sâu bao nhiêu tuỳ toà nhà.</p>

${kv([
  ['*[System[EventID=4625]]', 'Sự kiện có ID 4625. Đường dẫn bắt đầu bằng * hoặc Event.'],
  ['*[System[(EventID=4624 or EventID=4625) and Level=0]]', 'Ngoặc tròn, or, and.'],
  ['*[System[Computer=\'slad3…\']]', 'Mọi trường System: Computer, Channel, Provider[@Name], Execution[@ProcessID], Security[@UserID].'],
  ['*[EventData[Data[@Name=\'IpAddress\']=\'10.0.0.5\']]', 'Một trường EventData có tên.'],
  ['*[EventData[Data=\'x\']]', 'Bất kỳ giá trị Data nào bằng x.'],
  ['!=, &lt;, &gt;, &lt;=, &gt;=', 'Toán tử so sánh (phải escape &lt; và &gt; khi nằm trong XML).'],
  ['timediff(@SystemTime) &lt;= 86400000', 'Trong N mili giây gần nhất (ở đây 24 giờ) — hàm riêng của Windows.'],
  ['band(Keywords, 4503599627370496)', 'AND theo bit — riêng của Windows; ví dụ Audit Failure.'],
])}

<h3>Bước 1 — điều kiện trên hai tầng cùng lúc</h3>
${lenh('s05/xpath-xml', 0)}
${lenh('s05/xpath-xml', 1)}
${lenh('s05/xpath-xml', 2)}
<p>Một XPath kết hợp System (EventID, Computer) và EventData (SubStatus) — bảng băm chỉ làm được theo tên và chỉ từ PowerShell 6+. <code>!=</code> cho bạn "mọi thứ trừ": 73 lần thất bại là "người dùng không tồn tại" (0xc0000064), 57 lần là "sai mật khẩu". <code>Computer='…'</code> trả lời bài tập bài trước: 61 lần đăng nhập trên slad3.</p>
${lenh('s05/xpath-xml', 3)}
<p>Toàn bộ 429 lần đăng nhập thành công đều là type 3 (qua mạng): cuộc sống bình thường của một máy chủ miền — dịch vụ, thư mục chia sẻ, tài khoản máy — không có ai ngồi trước bàn phím. Một type 10 hay type 2 ở đây mới là sự kiện đáng mở ra xem.</p>

<h3>Bước 2 — "N phút gần nhất": timediff</h3>
${lenh('s05/xpath-xml', 4)}
<p><code>timediff(@SystemTime)</code> là tuổi của sự kiện tính bằng mili giây, so với <em>bây giờ</em>. Ở đây "bây giờ" được đóng băng lúc 00:01:30 để chạy lại vẫn ra cùng kết quả; trên máy chủ đang chạy, <code>timediff(@SystemTime) &lt;= 3600000</code> là "một giờ qua". Đó là cách "Logged: Last hour" của Event Viewer và các subscription WEF diễn đạt thời gian.</p>

<h3>Bước 3 — điều XPath không làm được</h3>
${lenh('s05/xpath-xml', 5)}
<p>Windows Event Log chỉ hỗ trợ một <strong>tập con của XPath 1.0</strong>: trục con và trục thuộc tính, <code>=, !=, &lt;, &gt;, and, or</code>, ngoặc tròn, <code>position()</code>, cộng thêm <code>band()</code> và <code>timediff()</code> (Microsoft, "Consuming events → XPath 1.0 limitations"). Không có <code>contains()</code>, không có <code>starts-with()</code>, không có ký tự đại diện trong giá trị. "Mọi tài khoản kết thúc bằng $" hay "dòng lệnh có chứa powershell" không hỏi được dịch vụ log — lấy một tập đã thu hẹp bằng XPath, rồi làm nốt bằng <code>Where-Object { $_.… -like '*powershell*' }</code>.</p>

<h3>Bước 4 — truy vấn XML có cấu trúc: Select và Suppress</h3>
${lenh('s05/xpath-xml', 6)}
<p>Một <code>&lt;QueryList&gt;</code> chứa được nhiều <code>&lt;Select&gt;</code> (hợp lại) và <code>&lt;Suppress&gt;</code> (trừ đi). Ở đây: mọi lần đăng nhập và thất bại, <em>trừ</em> tiếng ồn "người dùng không tồn tại". Phần còn lại là danh sách con người nên đọc: tài khoản máy có mật khẩu sai, các tài khoản dịch vụ đăng nhập (bình thường với svc-servicenow, đáng xác nhận một lần), các máy trạm.</p>
${lenh('s05/xpath-xml', 7)}
<p>Hai Select trong một truy vấn (cả hai đều trên Security ở đây; ngoài đời một cái có thể đọc System, cái kia đọc Security). Kết quả là một câu chuyện quản lý tài khoản nhỏ: lúc 23:20:55 và 23:21:11, tài khoản dịch vụ quản lý danh tính <code>univ-svc-idm</code> tạo, cập nhật người dùng và đưa họ vào các nhóm. Tự động, đúng dự kiến — và chính là loại truy vấn nên lưu lại cho câu hỏi "hôm nay ai đổi thành viên nhóm?".</p>

<div class="callout"><p><strong>Để Event Viewer viết XML giúp bạn.</strong> Event Viewer → chuột phải một log → Filter Current Log → điền biểu mẫu → tab <strong>XML</strong> → "Edit query manually" để thêm <code>&lt;Suppress&gt;</code>. Chép XML đó vào <code>-FilterXml</code> trong script, hoặc lưu thành Custom View (Bài 3.4). Cùng một truy vấn, ba công cụ.</p></div>

<h3>Bước 5 — mọi sự kiện thành đối tượng có tên trường</h3>
${lenh('s05/xpath-xml', 8)}
<p><code>ConvertFrom-EventData</code> là mười dòng bạn sẽ dùng lại trong mọi script của khoá: nó đi qua các phần tử <code>&lt;Data Name="…"&gt;</code> và dựng một đối tượng có thuộc tính là tên trường. Từ đó bạn viết <code>Format-Table SubjectUserName, MemberName, TargetUserName</code> thay vì đoán <code>Properties[6]</code>. (Với sự kiện có Data <em>không tên</em> — sự kiện cổ điển như 1000 hay 1074 — đặt tên p0, p1… như Lab làm.)</p>
${lenh('s05/xpath-xml', 9)}
<p>Dạng <code>Event/System[…]</code> cũng hợp lệ; nó chọn đúng 3561 sự kiện của Bài 5.1.</p>

<h3>Trên máy Windows của bạn</h3>
<pre><code class="language-powershell"># XPath trực tiếp
Get-WinEvent -LogName Security -FilterXPath "*[System[EventID=4625] and EventData[Data[@Name='LogonType']='10']]" -MaxEvents 20

# Lỗi và cảnh báo 24 giờ qua của Application và System, trừ một nguồn ồn ào
$q = @'
&lt;QueryList&gt;
  &lt;Query Id="0"&gt;
    &lt;Select Path="Application"&gt;*[System[(Level=2 or Level=3) and TimeCreated[timediff(@SystemTime) &amp;lt;= 86400000]]]&lt;/Select&gt;
    &lt;Select Path="System"&gt;*[System[(Level=2 or Level=3) and TimeCreated[timediff(@SystemTime) &amp;lt;= 86400000]]]&lt;/Select&gt;
    &lt;Suppress Path="System"&gt;*[System[Provider[@Name='Microsoft-Windows-DistributedCOM']]]&lt;/Suppress&gt;
  &lt;/Query&gt;
&lt;/QueryList&gt;
'@
Get-WinEvent -FilterXml $q | Group-Object LogName, ProviderName, Id | Sort-Object Count -Descending | Select-Object -First 15 Count, Name

# Hàm chuyển đổi dùng lại được
function ConvertFrom-EventData {
  process {
    $o = [ordered]@{ TimeCreated = $_.TimeCreated; Id = $_.Id; Machine = $_.MachineName }
    foreach ($d in ([xml]$_.ToXml()).Event.EventData.Data) { $o[$d.Name] = $d.'#text' }
    [pscustomobject]$o
  }
}</code></pre>
<div class="pitfall"><p><strong>Escape trong XML.</strong> Trong chuỗi <code>&lt;QueryList&gt;</code>, <code>&lt;=</code> phải viết là <code>&amp;lt;=</code>. Trong here-string <code>@' … '@</code>, PowerShell không đụng tới <code>$</code> hay dấu nháy, nên đó là cách thường dùng để dán truy vấn vào script.</p></div>

<h3>🛡️ Góc hacker: tiếng ồn là chỗ ẩn nấp</h3>
<p>Suppress mạnh theo cả hai chiều. Người phòng thủ dùng nó để bỏ tiếng ồn đã biết; kẻ tấn công sửa được truy vấn đã lưu, Custom View hay subscription WEF của bạn (chúng chỉ là tệp XML và thiết lập GPO) có thể thêm một Suppress cho công cụ hay tài khoản của chính họ — và bạn "không thấy gì" trong khi sự kiện vẫn nằm trong log. Giữ truy vấn phát hiện trong hệ quản lý phiên bản, duyệt thay đổi của chúng như duyệt mã, và định kỳ chạy truy vấn <em>không</em> có Suppress để kiểm xem mình đang giấu đi những gì.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Lọc sự kiện Windows bằng contains() được không?" — không; dịch vụ log chỉ hỗ trợ tập con XPath 1.0; thu hẹp bằng XPath, làm nốt bằng Where-Object.</li>
<li>"Diễn đạt 'một giờ qua' trong XPath sự kiện thế nào?" — <code>TimeCreated[timediff(@SystemTime) &lt;= 3600000]</code>.</li>
<li>"Select khác Suppress thế nào?" — hợp các kết quả khớp, so với loại sự kiện ra khỏi kết quả.</li>
<li>"Lấy trường EventData theo tên trong PowerShell thế nào?" — ép <code>ToXml()</code> sang <code>[xml]</code>, đi qua <code>Event.EventData.Data</code>, dựng một đối tượng.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Các công cụ giám sát cho Windows (thiết lập <code>event_logs</code> của Elastic Agent và Winlogbeat, data collection rule của Azure Monitor Agent, <code>whitelist/blacklist</code> của Splunk, subscription WEF) đều nhận XPath. Truy vấn bạn thử hôm nay bằng Get-WinEvent chính là truy vấn bạn dán vào cấu hình agent ngày mai — thử trước trên log đã xuất để biết chính xác mỗi ngày nó sẽ gửi đi bao nhiêu sự kiện.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Viết một XPath cho: 4624 <em>hoặc</em> 4625 trên slad1 có TargetUserName là <code>psadmin</code>. Bao nhiêu sự kiện?</li>
<li>Viết một QueryList chọn mọi 4728/4756 và loại những cái do <code>univ-svc-idm</code> làm. Còn lại gì, và điều đó nghĩa là gì?</li>
<li>Giải thích vì sao <code>*[EventData[Data[@Name='TargetUserName']!='-']]</code> và <code>*[EventData[not(Data[@Name='TargetUserName']='-')]]</code> có thể khác nhau trên những sự kiện không có trường TargetUserName.</li>
</ol>
<p><strong>Đạt:</strong> (1) 73 (71 + 2, đều là 4625 — psadmin chưa từng đăng nhập thành công); (2) không còn gì: mọi thay đổi nhóm là của dịch vụ IDM — câu trả lời sạch cho "có con người nào đổi nhóm không?"; (3) <code>!=</code> cần trường tồn tại (không có nút thì không có phép so → false), <code>not(… = …)</code> đúng khi trường vắng mặt.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['XPath (Event Log)', 'Tập con XPath 1.0 mà mọi bộ lọc sự kiện Windows dùng.'],
  ['timediff() / band()', 'Hàm riêng của Windows: tuổi tính bằng ms / kiểm bit.'],
  ['QueryList', 'Truy vấn có cấu trúc: nhiều Select + Suppress.'],
  ['Suppress', 'Loại kết quả khớp ra khỏi kết quả.'],
  ['ConvertFrom-EventData', 'Sự kiện → đối tượng có tên trường.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>XPath là ngôn ngữ chung của Event Viewer, Get-WinEvent, WEF và các agent.</li>
<li>Chỉ là tập con: không có contains(); khớp chữ làm nốt trong PowerShell.</li>
<li>QueryList = hợp các Select trừ các Suppress; hãy duyệt các Suppress.</li>
<li>Đọc trường theo tên qua XML của sự kiện.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Consuming events (Windows Event Log)', 'Ví dụ XPath, truy vấn có cấu trúc, giới hạn XPath 1.0, timediff và band', 'https://learn.microsoft.com/en-us/windows/win32/wes/consuming-events')}
${nguon('📘', 'Microsoft Learn — Get-WinEvent', 'Tham số -FilterXPath và -FilterXml', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-4-loc-luu', title: 'Bài 3.4 — Lọc, Custom View, xuất log', sub: 'Cùng XML đó trong Event Viewer', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-4-wevtutil-cmd', title: 'Bài 5.4 — wevtutil và công cụ cmd', sub: 'Cùng XPath đó từ dấu nhắc lệnh', cta: 'Bài tiếp' })}
</div>
`,
};
