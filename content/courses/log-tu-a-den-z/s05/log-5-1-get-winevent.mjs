/**
 * 5.1 — Get-WinEvent từ số 0 (soạn 24/11/2026, agent lgz). Output thật: OUT['s05/get-winevent'] — Get-WinEventMau (mô phỏng Get-WinEvent -Path, _demo/s05/bin/WinEventMau)
 * trên bộ EVTX mẫu công khai, PowerShell 7 trong container lgz-c03. Lệnh chỉ chạy trên Windows (-ListLog, -LogName, -ListProvider) là khối mã, không kèm output giả.
 * Số tất định: smb-doan-mk-4625.evtx 3561 × 4625 16:50:06→16:52:49 (9/19/2016), 3560 Administrator + 1 JcDfcZTc, 192.168.198.149: 3558 × 0xc000006a, 2 × 0xc0000072, 1 × 0xc0000064;
 * ForwardedEvents sự kiện mới nhất slad3 4624 có Message "An account was successfully logged on."
 */
import { lenh, nguon, lienKet, kv, ma } from '../_chung.mjs';

export default {
  title: '5.1 — PowerShell Get-WinEvent from zero: -ListLog, -LogName, -MaxEvents, objects not text|||5.1 — PowerShell Get-WinEvent từ số 0: -ListLog, -LogName, -MaxEvents, đối tượng chứ không phải chữ',
  slug: 'log-5-1-get-winevent',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Rời Event Viewer, đọc log Windows bằng PowerShell: Get-WinEvent -ListLog/-LogName/-Path/-MaxEvents/-Oldest, vì sao mỗi sự kiện là một ĐỐI TƯỢNG (Id, TimeCreated, Properties[n], ToXml()) chứ không phải một dòng chữ, Group-Object/Measure-Object/Export-Csv, và vì sao Message đôi khi rỗng. Thực hành trên 3561 lần dò mật khẩu SMB thật (mẫu công khai) bằng bản mô phỏng Get-WinEventMau chạy được cả trên Linux/macOS.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>From clicking to querying</h2>
<p class="lead">Event Viewer is perfect for reading <em>one</em> event. The moment the question becomes "how many, from where, since when, on which of my 20 servers", you need a query language. On Windows that language is PowerShell, and the command is <strong>Get-WinEvent</strong>. This lesson teaches the one idea that makes everything else easy: Get-WinEvent returns <strong>objects</strong>, not lines of text.</p>

<h3>The everyday picture: the library catalogue</h3>
<p>Event Viewer is walking along the shelves and opening books one by one. Get-WinEvent is the catalogue terminal: you type "author = X, year after 2016, only novels" and get a list you can sort, count and print. And because every result is a <em>record card</em> with named fields (title, author, year), you never have to cut text with scissors.</p>

${kv([
  ['Get-WinEvent', 'The cmdlet for reading event logs (classic and the newer Applications and Services logs). Windows PowerShell 5.1 and PowerShell 7 on Windows.'],
  ['Get-EventLog', 'The old cmdlet: classic logs only, slower, and it does not exist in PowerShell 7. Recognise it in old scripts; do not write new ones with it.'],
  ['-ListLog / -ListProvider', 'Which logs exist (size, record count, enabled) / which providers write events.'],
  ['-LogName / -Path', 'Read a live log by name / read an exported .evtx file.'],
  ['-MaxEvents / -Oldest', 'Stop after N events / reverse the default newest-first order.'],
  ['EventLogRecord', 'The object you get back: Id, TimeCreated, ProviderName, LevelDisplayName, MachineName, Properties, Message, ToXml().'],
])}

<h3>Step 0 — on your own Windows machine (PowerShell as administrator)</h3>
<pre><code class="language-powershell"># Which logs exist, how big, how many records? (hundreds of logs; most are empty)
Get-WinEvent -ListLog * -ErrorAction SilentlyContinue | Where-Object RecordCount -gt 0 |
  Sort-Object RecordCount -Descending | Select-Object -First 10 LogName, RecordCount, FileSize, LogMode, IsEnabled

# The five newest events of the System log
Get-WinEvent -LogName System -MaxEvents 5

# Which providers write into the Security log?
(Get-WinEvent -ListLog Security).ProviderNames

# Same cmdlet, but an exported file (from a server, a colleague, an incident)
Get-WinEvent -Path C:\\lab\\tc\\smb-doan-mk-4625.evtx -MaxEvents 3</code></pre>
<p>Reading <code>Security</code> needs an elevated PowerShell; without it you get "Attempted to perform an unauthorized operation". Reading an exported <code>.evtx</code> does not.</p>

<div class="callout"><p><strong>How the outputs in this chapter were produced.</strong> This course runs every command for real, but Get-WinEvent only exists on Windows. So the lab uses <code>Get-WinEventMau</code>: a ~130-line PowerShell module written for this course that reads the same public <code>.evtx</code> samples (Lessons 3.1, 4.9, and the Sysmon set in 5.6) with a Rust parser and returns objects with <strong>the same property names</strong> as Get-WinEvent; filters are translated to XPath and evaluated like Windows does (Lessons 5.2–5.3). On Windows, replace <code>Get-WinEventMau</code> with <code>Get-WinEvent</code> — the rest of every pipeline is identical. The one visible difference: <code>Message</code> is empty here (explained in Step 4).</p></div>

<h3>Step 1 — read a file, newest first</h3>
${lenh('s05/get-winevent', 0)}
${lenh('s05/get-winevent', 1)}
<p>The sample is a real SMB password-guessing run against a Windows 10 machine (DeepBlueCLI). By default Get-WinEvent returns <strong>newest first</strong> (the Microsoft documentation says so explicitly), which is what you want at 2 a.m. — the latest events. <code>-Oldest</code> flips it to read a story from the beginning. <code>-MaxEvents</code> is not cosmetic: it stops reading, so on a 1 GB Security log it is the difference between one second and one minute.</p>

<h3>Step 2 — an event is an object with named fields</h3>
${lenh('s05/get-winevent', 2)}
${lenh('s05/get-winevent', 3)}
<p><code>Properties</code> is the EventData of the event as an <em>ordered list</em>: for 4625, index 5 is TargetUserName, 7 Status, 9 SubStatus, 10 LogonType, 19 IpAddress. Positional access is short, but you must know the order for each Event ID (and it can change between versions of an event). The safer way is by name, through the XML of the event:</p>
${lenh('s05/get-winevent', 4)}
<p>Remember this line — <code>([xml]$e.ToXml()).Event.EventData.Data</code> — it turns any event into <em>name = value</em> pairs. Lesson 5.3 wraps it into a reusable function.</p>

<h3>Step 3 — questions become pipelines</h3>
${lenh('s05/get-winevent', 5)}
${lenh('s05/get-winevent', 6)}
${lenh('s05/get-winevent', 9)}
<p>Three one-liners answer an incident triage: <strong>3561 failures in 2 minutes 43 seconds</strong>, all from <strong>192.168.198.149</strong>, almost all against <strong>Administrator</strong> with SubStatus <code>0xc000006a</code> (account exists, wrong password — Lesson 4.1), two against a disabled account (<code>0xc0000072</code>) and one random user name (<code>0xc0000064</code>). In Event Viewer you would still be scrolling. The pattern is always the same: <em>get → filter → shape (Select/Group/Measure) → output</em>.</p>

<h3>Step 4 — why is Message empty?</h3>
${lenh('s05/get-winevent', 7)}
${lenh('s05/get-winevent', 8)}
<p>An <code>.evtx</code> record stores only the event's <em>data</em> (Id, provider, fields). The sentence you read in Event Viewer — "An account failed to log on…" — is built at read time from a <strong>message template inside the provider's DLL</strong> on the reading machine. No DLL, no Message: that is why Get-WinEventMau (Linux) shows nothing, and why on Windows you sometimes see "The description for Event ID X from source Y cannot be found" when you open a file exported from a machine with software you do not have. Two exceptions: events forwarded by WEF in <em>RenderedText</em> format carry the text with them (the ForwardedEvents sample above — Lesson 5.7), and <code>wevtutil archive-log</code> (Lesson 5.4) packs the locale metadata next to the file. Lesson learned: <strong>filter and report on fields, not on Message text</strong> — fields are the same in every language and on every machine.</p>

<h3>Step 5 — hand the result to a human</h3>
${lenh('s05/get-winevent', 10)}
<p><code>Export-Csv</code> opens in Excel, attaches to a ticket, imports into anything. Two traps: <code>Format-Table</code> is for your eyes only — never pipe its output further (it produces formatting objects, not data); and <code>TimeCreated</code> is in the <em>local time of the machine running PowerShell</em> (UTC here, Vietnam time on a laptop in Hanoi) — write the time zone in your report (Lesson 1.5).</p>

<details>
<summary><strong>See the code of Get-WinEventMau (for the curious — not needed on Windows)</strong></summary>
${ma('powershell', 's05/bin/WinEventMau/WinEventMau.psm1')}
</details>

<h3>🛡️ Attacker's corner: the account that could not be locked out</h3>
<p>The sample is 3558 wrong passwords for <strong>Administrator</strong> in under three minutes — and no lockout event. That is not an oversight of the sample: the built-in local Administrator (RID 500) was historically <strong>exempt from account lockout</strong>. Microsoft's KB5020282 (cumulative updates from 11 October 2022) explains that this allowed "unlimited brute force attacks" over the network and added the policy <em>Allow Administrator account lockout</em> (enabled on new installs, must be turned on by GPO on existing machines). On an older or upgraded server, your Get-WinEvent pipeline is the alarm: thousands of 4625 for one account from one IP is brute force (ATT&amp;CK T1110.001) whether or not anything locked.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Get-WinEvent or Get-EventLog?" — Get-WinEvent: all logs (including Applications and Services and .evtx files), filtering at the source, works in PowerShell 7; Get-EventLog is legacy and absent from PowerShell 7.</li>
<li>"How do you get the user name out of a 4625 in PowerShell?" — <code>$e.Properties[5].Value</code>, or safer by name via <code>([xml]$e.ToXml()).Event.EventData.Data</code>.</li>
<li>"Why can the Message be empty when you read an exported log?" — the text comes from the provider's message DLL on the reading machine; the file only has the data.</li>
<li>"What order does Get-WinEvent return?" — newest first; <code>-Oldest</code> reverses it.</li>
</ul>

<h3>At work</h3>
<p>In an outsourcing project you rarely get Remote Desktop to the customer's production server. What you get is: "here is the exported System and Application log, the API crashed at 03:10". Knowing <code>Get-WinEvent -Path</code> and three pipeline cmdlets lets you answer in ten minutes from your own laptop — and attach the exact command you ran, so the customer's admin can repeat it. Keep a personal <code>.ps1</code> file of your best one-liners from this chapter; it becomes your toolkit.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>On the sample (or after downloading it on Windows — Lesson 4.9), list the 10 newest events with TimeCreated, Id and the TargetUserName <em>by name</em> (not by index).</li>
<li>Count 4625 per minute (<code>Group-Object { $_.TimeCreated.ToString('HH:mm') }</code>). Which minute was the busiest?</li>
<li>On your own Windows machine: which 5 logs have the most records? Is the Security log close to its maximum size (FileSize vs MaximumSizeInBytes)?</li>
</ol>
<p><strong>Pass:</strong> (1) uses <code>ToXml()</code> and <code>Where-Object Name -eq 'TargetUserName'</code> or builds a hashtable; (2) 16:51 (Lesson 4.1 counted 1198/1299/1064 for 16:50/16:51/16:52); (3) answer comes from <code>-ListLog *</code> with RecordCount, FileSize and MaximumSizeInBytes.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Get-WinEvent', 'Reads event logs and .evtx files as objects.'],
  ['-MaxEvents / -Oldest', 'Stop early / oldest-first instead of newest-first.'],
  ['Properties[n].Value', 'EventData by position.'],
  ['ToXml()', 'The full event XML — the safe way to read fields by name.'],
  ['Message', 'Text rendered from the provider DLL on the reading machine; may be empty.'],
  ['Pipeline', 'get → filter → shape → output.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Get-WinEvent returns objects; questions become one-line pipelines.</li>
<li>Newest first by default; <code>-MaxEvents</code> stops reading early.</li>
<li>Read fields by name through <code>ToXml()</code>; report on fields, not Message text.</li>
<li>Get-EventLog is legacy; <code>Format-Table</code> is the last step only.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Get-WinEvent', 'Parameters, newest-first order, -Path, -ListLog', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent')}
${nguon('📘', 'Microsoft Support — KB5020282: Account lockout available for built-in local administrators', 'Why RID-500 brute force went unlocked; the October 2022 policy', 'https://support.microsoft.com/en-us/topic/kb5020282-account-lockout-available-for-built-in-local-administrators-bce45c4d-f28d-43ad-b6fe-70156cb2dc00')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-1-dang-nhap', title: 'Lesson 4.1 — Logon events', sub: 'What 4625 Status/SubStatus mean', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-2-filterhashtable', title: 'Lesson 5.2 — -FilterHashtable', sub: 'Filter at the source instead of Where-Object', cta: 'Next' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Từ bấm chuột sang truy vấn</h2>
<p class="lead">Event Viewer rất hợp để đọc <em>một</em> sự kiện. Ngay khi câu hỏi thành "bao nhiêu, từ đâu, từ lúc nào, trên máy nào trong 20 máy chủ của tôi", bạn cần một ngôn ngữ truy vấn. Trên Windows, ngôn ngữ đó là PowerShell, và lệnh là <strong>Get-WinEvent</strong>. Bài này dạy một ý duy nhất làm mọi thứ sau trở nên dễ: Get-WinEvent trả về <strong>đối tượng</strong>, không phải các dòng chữ.</p>

<h3>Liên tưởng đời thường: máy tra cứu thư viện</h3>
<p>Event Viewer là đi dọc các kệ và mở từng cuốn sách. Get-WinEvent là máy tra cứu: bạn gõ "tác giả = X, xuất bản sau 2016, chỉ tiểu thuyết" và nhận một danh sách để sắp xếp, đếm và in ra. Và vì mỗi kết quả là một <em>phiếu sách</em> có các ô đặt tên (tên sách, tác giả, năm), bạn không bao giờ phải cắt chữ bằng kéo.</p>

${kv([
  ['Get-WinEvent', 'Lệnh (cmdlet) đọc log sự kiện (log cổ điển và các log Applications and Services mới hơn). Có trong Windows PowerShell 5.1 và PowerShell 7 trên Windows.'],
  ['Get-EventLog', 'Lệnh cũ: chỉ log cổ điển, chậm hơn, và KHÔNG có trong PowerShell 7. Nhận ra nó trong script cũ; đừng viết script mới bằng nó.'],
  ['-ListLog / -ListProvider', 'Có những log nào (kích thước, số bản ghi, bật/tắt) / nhà cung cấp nào ghi sự kiện.'],
  ['-LogName / -Path', 'Đọc log đang chạy theo tên / đọc một tệp .evtx đã xuất.'],
  ['-MaxEvents / -Oldest', 'Dừng sau N sự kiện / đảo thứ tự mặc định mới-nhất-trước.'],
  ['EventLogRecord', 'Đối tượng bạn nhận về: Id, TimeCreated, ProviderName, LevelDisplayName, MachineName, Properties, Message, ToXml().'],
])}

<h3>Bước 0 — trên máy Windows của bạn (PowerShell chạy quyền quản trị)</h3>
<pre><code class="language-powershell"># Có những log nào, to bao nhiêu, bao nhiêu bản ghi? (hàng trăm log; phần lớn rỗng)
Get-WinEvent -ListLog * -ErrorAction SilentlyContinue | Where-Object RecordCount -gt 0 |
  Sort-Object RecordCount -Descending | Select-Object -First 10 LogName, RecordCount, FileSize, LogMode, IsEnabled

# Năm sự kiện mới nhất của log System
Get-WinEvent -LogName System -MaxEvents 5

# Những nhà cung cấp nào ghi vào log Security?
(Get-WinEvent -ListLog Security).ProviderNames

# Cùng lệnh đó, nhưng đọc tệp đã xuất (từ máy chủ, từ đồng nghiệp, từ một sự cố)
Get-WinEvent -Path C:\\lab\\tc\\smb-doan-mk-4625.evtx -MaxEvents 3</code></pre>
<p>Đọc <code>Security</code> cần PowerShell chạy quyền quản trị; không có thì gặp "Attempted to perform an unauthorized operation". Đọc tệp <code>.evtx</code> đã xuất thì không cần.</p>

<div class="callout"><p><strong>Output trong chương này được tạo ra thế nào.</strong> Khoá này chạy thật mọi lệnh, nhưng Get-WinEvent chỉ có trên Windows. Vì vậy lab dùng <code>Get-WinEventMau</code>: một mô-đun PowerShell khoảng 130 dòng viết riêng cho khoá, đọc chính các tệp <code>.evtx</code> mẫu công khai (Bài 3.1, 4.9, và bộ Sysmon ở 5.6) bằng bộ phân tích viết bằng Rust và trả về đối tượng có <strong>cùng tên thuộc tính</strong> với Get-WinEvent; bộ lọc được dịch sang XPath và chấm như Windows làm (Bài 5.2–5.3). Trên Windows, thay <code>Get-WinEventMau</code> bằng <code>Get-WinEvent</code> — phần còn lại của mọi đường ống giữ nguyên. Khác biệt duy nhất nhìn thấy được: <code>Message</code> ở đây rỗng (giải thích ở Bước 4).</p></div>

<h3>Bước 1 — đọc một tệp, mới nhất trước</h3>
${lenh('s05/get-winevent', 0)}
${lenh('s05/get-winevent', 1)}
<p>Mẫu này là một đợt dò mật khẩu SMB thật vào một máy Windows 10 (DeepBlueCLI). Mặc định Get-WinEvent trả <strong>mới nhất trước</strong> (tài liệu Microsoft ghi rõ), đúng thứ bạn cần lúc 2 giờ sáng — những sự kiện gần nhất. <code>-Oldest</code> đảo lại để đọc câu chuyện từ đầu. <code>-MaxEvents</code> không phải để cho gọn: nó dừng việc đọc, nên với log Security 1 GB đó là khác biệt giữa một giây và một phút.</p>

<h3>Bước 2 — một sự kiện là một đối tượng có các trường đặt tên</h3>
${lenh('s05/get-winevent', 2)}
${lenh('s05/get-winevent', 3)}
<p><code>Properties</code> là EventData của sự kiện dưới dạng <em>danh sách có thứ tự</em>: với 4625, chỉ số 5 là TargetUserName, 7 là Status, 9 là SubStatus, 10 là LogonType, 19 là IpAddress. Truy cập theo vị trí thì ngắn, nhưng bạn phải thuộc thứ tự của từng Event ID (và nó có thể đổi giữa các phiên bản của sự kiện). Cách an toàn hơn là theo tên, qua XML của sự kiện:</p>
${lenh('s05/get-winevent', 4)}
<p>Nhớ dòng này — <code>([xml]$e.ToXml()).Event.EventData.Data</code> — nó biến mọi sự kiện thành các cặp <em>tên = giá trị</em>. Bài 5.3 gói nó thành một hàm dùng lại được.</p>

<h3>Bước 3 — câu hỏi biến thành đường ống</h3>
${lenh('s05/get-winevent', 5)}
${lenh('s05/get-winevent', 6)}
${lenh('s05/get-winevent', 9)}
<p>Ba dòng lệnh trả lời xong một lần phân loại sự cố: <strong>3561 lần thất bại trong 2 phút 43 giây</strong>, tất cả từ <strong>192.168.198.149</strong>, gần như toàn bộ vào <strong>Administrator</strong> với SubStatus <code>0xc000006a</code> (tài khoản có thật, sai mật khẩu — Bài 4.1), hai lần vào một tài khoản bị vô hiệu hoá (<code>0xc0000072</code>) và một tên người dùng ngẫu nhiên (<code>0xc0000064</code>). Trong Event Viewer bạn vẫn còn đang cuộn chuột. Khuôn luôn giống nhau: <em>lấy → lọc → định hình (Select/Group/Measure) → xuất</em>.</p>

<h3>Bước 4 — vì sao Message rỗng?</h3>
${lenh('s05/get-winevent', 7)}
${lenh('s05/get-winevent', 8)}
<p>Một bản ghi <code>.evtx</code> chỉ lưu <em>dữ liệu</em> của sự kiện (Id, nhà cung cấp, các trường). Câu bạn đọc trong Event Viewer — "An account failed to log on…" — được ghép lúc đọc, từ một <strong>mẫu câu nằm trong DLL của nhà cung cấp</strong> trên máy đang đọc. Không có DLL thì không có Message: vì vậy Get-WinEventMau (Linux) không hiện gì, và vì vậy trên Windows đôi khi bạn gặp "The description for Event ID X from source Y cannot be found" khi mở tệp xuất từ một máy có phần mềm mà máy bạn không có. Hai ngoại lệ: sự kiện được WEF chuyển tiếp ở dạng <em>RenderedText</em> mang theo câu chữ (mẫu ForwardedEvents ở trên — Bài 5.7), và <code>wevtutil archive-log</code> (Bài 5.4) đóng gói siêu dữ liệu ngôn ngữ cạnh tệp. Bài học: <strong>lọc và báo cáo trên trường dữ liệu, không trên câu Message</strong> — trường thì giống nhau ở mọi ngôn ngữ và mọi máy.</p>

<h3>Bước 5 — giao kết quả cho người đọc</h3>
${lenh('s05/get-winevent', 10)}
<p><code>Export-Csv</code> mở được bằng Excel, đính được vào ticket, nạp được vào mọi thứ. Hai cái bẫy: <code>Format-Table</code> chỉ để mắt bạn xem — đừng bao giờ đưa output của nó đi tiếp (nó sinh đối tượng định dạng, không phải dữ liệu); và <code>TimeCreated</code> hiển thị theo <em>giờ địa phương của máy đang chạy PowerShell</em> (ở đây là UTC, trên laptop ở Hà Nội là giờ Việt Nam) — ghi múi giờ vào báo cáo (Bài 1.5).</p>

<details>
<summary><strong>Xem mã Get-WinEventMau (cho người tò mò — trên Windows không cần)</strong></summary>
${ma('powershell', 's05/bin/WinEventMau/WinEventMau.psm1')}
</details>

<h3>🛡️ Góc hacker: tài khoản không thể bị khoá</h3>
<p>Mẫu này là 3558 lần sai mật khẩu vào <strong>Administrator</strong> trong chưa đầy ba phút — và không có sự kiện khoá tài khoản nào. Đó không phải thiếu sót của mẫu: tài khoản Administrator cục bộ dựng sẵn (RID 500) trước đây <strong>được miễn khoá tài khoản</strong>. Bài KB5020282 của Microsoft (các bản cập nhật tích luỹ từ 11/10/2022) giải thích điều này cho phép "tấn công dò mật khẩu không giới hạn" qua mạng và thêm chính sách <em>Allow Administrator account lockout</em> (bật sẵn trên máy cài mới, máy đang chạy phải bật bằng GPO). Trên máy chủ cũ hoặc nâng cấp lên, đường ống Get-WinEvent của bạn chính là chuông báo động: hàng nghìn 4625 cho một tài khoản từ một IP là dò mật khẩu (ATT&amp;CK T1110.001), dù có khoá hay không.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Get-WinEvent hay Get-EventLog?" — Get-WinEvent: mọi log (cả Applications and Services và tệp .evtx), lọc tại nguồn, chạy trong PowerShell 7; Get-EventLog là đồ cũ và không có trong PowerShell 7.</li>
<li>"Lấy tên người dùng trong 4625 bằng PowerShell thế nào?" — <code>$e.Properties[5].Value</code>, hoặc an toàn hơn theo tên qua <code>([xml]$e.ToXml()).Event.EventData.Data</code>.</li>
<li>"Vì sao Message có thể rỗng khi đọc log đã xuất?" — câu chữ đến từ DLL thông điệp của nhà cung cấp trên máy đọc; tệp chỉ có dữ liệu.</li>
<li>"Get-WinEvent trả về theo thứ tự nào?" — mới nhất trước; <code>-Oldest</code> đảo lại.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Trong dự án outsourcing, hiếm khi bạn được Remote Desktop vào máy chủ production của khách. Cái bạn nhận được là: "đây là log System và Application đã xuất, API sập lúc 03:10". Biết <code>Get-WinEvent -Path</code> và ba lệnh đường ống là trả lời được trong mười phút ngay trên laptop của mình — và đính kèm đúng lệnh đã chạy để quản trị viên phía khách chạy lại. Giữ một tệp <code>.ps1</code> riêng chứa những dòng lệnh hay nhất của chương này; nó sẽ thành bộ đồ nghề của bạn.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Trên mẫu (hoặc sau khi tải về máy Windows — Bài 4.9), liệt kê 10 sự kiện mới nhất với TimeCreated, Id và TargetUserName <em>theo tên</em> (không theo chỉ số).</li>
<li>Đếm 4625 theo từng phút (<code>Group-Object { $_.TimeCreated.ToString('HH:mm') }</code>). Phút nào dày nhất?</li>
<li>Trên máy Windows của bạn: 5 log nào nhiều bản ghi nhất? Log Security có gần chạm kích thước tối đa không (FileSize so với MaximumSizeInBytes)?</li>
</ol>
<p><strong>Đạt:</strong> (1) dùng <code>ToXml()</code> và <code>Where-Object Name -eq 'TargetUserName'</code> hoặc dựng một bảng băm; (2) 16:51 (Bài 4.1 đã đếm 1198/1299/1064 cho 16:50/16:51/16:52); (3) câu trả lời lấy từ <code>-ListLog *</code> với RecordCount, FileSize và MaximumSizeInBytes.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Get-WinEvent', 'Đọc log sự kiện và tệp .evtx dưới dạng đối tượng.'],
  ['-MaxEvents / -Oldest', 'Dừng sớm / cũ nhất trước thay vì mới nhất trước.'],
  ['Properties[n].Value', 'EventData theo vị trí.'],
  ['ToXml()', 'Toàn bộ XML của sự kiện — cách an toàn để đọc trường theo tên.'],
  ['Message', 'Câu chữ ghép từ DLL của nhà cung cấp trên máy đọc; có thể rỗng.'],
  ['Đường ống (pipeline)', 'lấy → lọc → định hình → xuất.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Get-WinEvent trả về đối tượng; câu hỏi biến thành đường ống một dòng.</li>
<li>Mặc định mới nhất trước; <code>-MaxEvents</code> dừng đọc sớm.</li>
<li>Đọc trường theo tên qua <code>ToXml()</code>; báo cáo trên trường, không trên câu Message.</li>
<li>Get-EventLog là đồ cũ; <code>Format-Table</code> chỉ ở bước cuối.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Get-WinEvent', 'Tham số, thứ tự mới nhất trước, -Path, -ListLog', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent')}
${nguon('📘', 'Microsoft Support — KB5020282: Account lockout available for built-in local administrators', 'Vì sao dò mật khẩu RID 500 không bị khoá; chính sách 10/2022', 'https://support.microsoft.com/en-us/topic/kb5020282-account-lockout-available-for-built-in-local-administrators-bce45c4d-f28d-43ad-b6fe-70156cb2dc00')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-1-dang-nhap', title: 'Bài 4.1 — Sự kiện đăng nhập', sub: 'Status/SubStatus của 4625 nghĩa là gì', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-2-filterhashtable', title: 'Bài 5.2 — -FilterHashtable', sub: 'Lọc tại nguồn thay vì Where-Object', cta: 'Bài tiếp' })}
</div>
`,
};
