/**
 * 3.4 — Lọc, Custom View, Find, xuất, gắn tác vụ (soạn 24/11/2026, agent lgz). Output thật: OUT['s03/loc-luu'] — bộ EVTX mẫu công khai (3.1).
 * Khối lệnh Windows (Filter XML, Custom View, wevtutil epl, schtasks /sc onevent, eventcreate) là MÃ cho máy người học — không kèm output vì máy soạn không có Windows.
 * Số tất định: sự kiện cuối 2016-09-20 15:45:22 UTC; 7 ngày cuối: 20 × DNS 1014, 19 × 7011, 6 × 7009; 66 × 1074, 38 × 6005, 37 × 6006; SID S-1-5-18 2618; CSV 20 dòng.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '3.4 — Filtering, custom views, Find, export (.evtx/.csv/.xml) and attaching a task to an event|||3.4 — Lọc, Custom View, Find, xuất (.evtx/.csv/.xml) và gắn tác vụ vào một sự kiện',
  slug: 'log-3-4-loc-luu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Filter Current Log theo mức, ID, nguồn, thời gian, người dùng; tab XML của bộ lọc là một truy vấn XPath dùng lại được; lưu Custom View; Find; xuất .evtx/.csv/.xml để gửi người khác; "Attach Task To This Event" để tự báo động. Thực hành lọc và xuất CSV thật trên log System mẫu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>From 8 000 events to the 5 that matter</h2>
<p class="lead">A System log easily has tens of thousands of events. Scrolling is not investigating. Event Viewer has four tools that turn the pile into an answer: <strong>Filter Current Log</strong>, <strong>Custom Views</strong> (a saved filter), <strong>Find</strong>, and <strong>export</strong>. A fifth one, <strong>Attach a Task</strong>, makes Windows tell <em>you</em> when an event happens.</p>

<h3>The everyday picture: a spreadsheet filter you can save</h3>
<p>Filtering a log is like the filter arrows in Excel: level = Error, source = X, date = last week. A Custom View is that filter saved with a name so you don't rebuild it every Monday. Export is "Save as" so a colleague can open the same rows.</p>

<h3>Filter Current Log: the dialog and what it really is</h3>
<p>Right-click a log › <em>Filter Current Log…</em>: Logged (last hour/12 h/24 h/7 days/30 days/custom range), Event level (Critical/Error/Warning/Information/Verbose), By log or By source, Event IDs (<code>1074,6005-6008,-7036</code> — ranges and exclusions with a minus), Task category, Keywords, User, Computer. Then open the <strong>XML</strong> tab: the dialog is just a query builder.</p>
<pre><code class="language-xml">&lt;QueryList&gt;
  &lt;Query Id="0" Path="System"&gt;
    &lt;Select Path="System"&gt;*[System[(Level=1 or Level=2 or Level=3) and
      TimeCreated[timediff(@SystemTime) &amp;lt;= 604800000]]]&lt;/Select&gt;
  &lt;/Query&gt;
&lt;/QueryList&gt;</code></pre>
<p><code>604800000</code> ms = 7 days, counted back from <em>now</em>. The same XML works in PowerShell (<code>Get-WinEvent -FilterXml</code>), in <code>wevtutil qe</code>, in Windows Event Forwarding and in many SIEM agents (Lessons 5.3, 15.4). Learn it once.</p>

<h3>Step 1 — "errors and warnings in the last 7 days"</h3>
<p>The sample file is from 2016, so "now" is replaced by "the last event in the file":</p>
${lenh('s03/loc-luu', 0)}
<p>Three kinds of problem in the final week: DNS timeouts (1014), and two Service Control Manager errors — <strong>7011</strong> ("timeout waiting for a transaction response from a service") and <strong>7009</strong> ("timeout waiting for a service to connect"). Both mean a service was too slow to start; on a lab VM with little RAM this is common, on a production server it is a lead.</p>

<h3>Step 2 — by Event ID, by user</h3>
${lenh('s03/loc-luu', 1)}
${lenh('s03/loc-luu', 2)}
<p>66 restarts/shutdowns initiated (1074), 38 starts of the event log service (6005 ≈ boots), 37 stops (6006 ≈ clean shutdowns): one boot has no clean shutdown before it — Lab 3 finds it. The <em>User</em> filter matches the event's <code>Security UserID</code>: S-1-5-18 SYSTEM, S-1-5-19 LOCAL SERVICE, S-1-5-20 NETWORK SERVICE, and the one <code>…-1000</code> SID is the real person (the first local account created).</p>

<h3>Step 3 — Find (text search) and its limits</h3>
${lenh('s03/loc-luu', 3)}
<p>Event Viewer's <em>Find…</em> searches the displayed text, one match at a time — handy for "where is KB2…?", useless for counting. Here the Windows Update client (event 18, "installation ready") lists the update titles. For anything you want to count or repeat, use a filter or PowerShell.</p>

<h3>Step 4 — export for someone else</h3>
<pre><code class="language-powershell"># On Windows: Action › "Save All Events As…" (.evtx, .xml, .txt, .csv) or "Save Filtered Log File As…"
wevtutil epl System C:\\ra\\system-1074.evtx /q:"*[System[(EventID=1074)]]"      # only matching events
Get-WinEvent -Path C:\\ra\\system-1074.evtx | Measure-Object                        # check what you send</code></pre>
${lenh('s03/loc-luu', 4)}
<p>Which format? <strong>.evtx</strong> keeps everything and opens in Event Viewer — send it to another engineer. <strong>.csv</strong> opens in Excel — send it to a manager, but choose columns on purpose (Lesson 3.2: the friendly text depends on the machine). <strong>.xml</strong> for scripts. When saving .evtx, Event Viewer asks about <em>Display information</em> (message text in a language): include it if the receiver won't have the same software.</p>
<p>The same filter in jq, for colleagues on Linux/macOS:</p>
${lenh('s03/loc-luu', 5)}

<h3>Custom Views: save the filter</h3>
<pre><code class="language-xml">&lt;!-- %ProgramData%\\Microsoft\\Event Viewer\\Views\\View_lab1.xml — created by "Create Custom View…", can be exported/imported --&gt;
&lt;ViewerConfig&gt;&lt;QueryConfig&gt;&lt;QueryParams&gt;&lt;UserQuery /&gt;&lt;/QueryParams&gt;&lt;QueryNode&gt;
  &lt;Name&gt;Lab - Boot and shutdown&lt;/Name&gt;
  &lt;QueryList&gt;&lt;Query Id="0" Path="System"&gt;&lt;Select Path="System"&gt;
    *[System[(EventID=41 or EventID=1074 or EventID=6005 or EventID=6006 or EventID=6008)]]
  &lt;/Select&gt;&lt;/Query&gt;&lt;/QueryList&gt;
&lt;/QueryNode&gt;&lt;/QueryConfig&gt;&lt;/ViewerConfig&gt;</code></pre>
<p>A Custom View can span several logs (System + Application + Security) — a single "incident view" for your team. Export it (<em>Export Custom View…</em>) and put it in the team wiki.</p>

<h3>Attach a Task To This Event: an alarm in five minutes</h3>
<pre><code class="language-powershell"># What the wizard creates, in one line (run as administrator):
schtasks /create /tn "Alert-LabApp-999" /ru SYSTEM /sc onevent /ec Application ^
  /mo "*[System[Provider[@Name='LabApp'] and EventID=999]]" ^
  /tr "powershell -NoProfile -Command Add-Content C:\\ra\\alert.txt (Get-Date)"
eventcreate /T ERROR /ID 999 /L APPLICATION /SO LabApp /D "DB connection failed 3 times"   # fire a test event</code></pre>
<p>Good for one machine and one rare event (a backup job failure, a disk warning). For many machines, ship logs to a central place and alert there (Lesson 15.5) — a local task dies with the machine it watches.</p>

<h3>🛡️ Attacker's corner: the filter you didn't write</h3>
<p>A filter shows only what you asked for. Analysts who filter Security on 4625 to "look for brute force" miss the <em>successful</em> logon that followed (4624) and the log clearing (1102). Keep a second, wide view (all Critical/Error/Warning + a list of "never should happen" IDs) and compare counts before and after your filter.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"How do you show only errors from one service in the last 24 hours?" — Filter Current Log: level, source, Logged; or <code>Get-WinEvent -FilterHashtable</code>.</li>
<li>"How do you send logs to a vendor?" — export .evtx (with display information) of the time range; optionally CSV for a summary.</li>
<li>"How would you get notified when event X occurs on a server?" — Attach Task for one machine; central collection + alert for a fleet.</li>
</ul>

<h3>At work</h3>
<p>Ask the customer for <strong>.evtx</strong>, not screenshots and not copy-pasted text. Screenshots cannot be filtered; pasted text loses fields and time zones. A filtered .evtx (only the incident window) is small enough to email and contains nothing you didn't ask for.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>On your PC, create a Custom View "Restarts" on System with IDs 41, 1074, 6005, 6006, 6008. How many events?</li>
<li>Export that view as .evtx and as .csv. Open the .evtx with Open Saved Log — same count?</li>
<li>In the sample <code>dbc-many-events-system.evtx</code>, how many 1074 events were initiated by <code>NT AUTHORITY\\SYSTEM</code> vs a person?</li>
</ol>
<p><strong>Pass:</strong> (1)/(2) counts match between the live view and the saved file; (3) group by <code>$_.data.'#text'[6]</code>: 57 by a person (<code>…\\IEUser</code> on the IE8/IE9/IE10 VMs, mostly Explorer.EXE + winlogon.exe = Start › Shut down), 9 by SYSTEM (TrustedInstaller ×4 = updates, svchost ×2, msiexec, winlogon, and <code>wlms.exe</code> — the licence monitor that shuts down an expired evaluation VM).</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Filter Current Log', 'Dialog to filter one log by time, level, source, ID, user…'],
  ['QueryList / XPath', 'The XML query behind every filter; reusable in PowerShell, wevtutil, WEF.'],
  ['Custom View', 'Saved filter (one or more logs), stored as XML.'],
  ['Save Filtered Log File As', 'Export only matching events to .evtx.'],
  ['Attach a Task', 'Scheduled task triggered by an event (schtasks /sc onevent).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Every filter is an XML query — copy it from the XML tab and reuse it.</li>
<li>Save team filters as Custom Views; export .evtx for engineers, CSV for people.</li>
<li>Event-triggered tasks are a one-machine alarm; fleets need central alerting.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Consuming events (XPath queries)', 'Supported XPath subset, QueryList, Select/Suppress', 'https://learn.microsoft.com/en-us/windows/win32/wes/consuming-events')}
${nguon('📘', 'Microsoft Learn — wevtutil', 'qe, epl, gl, sl, cl', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-2-5-powershell-text', title: 'Lesson 2.5 — PowerShell for text logs', sub: 'Group-Object, Export-Csv used above', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Từ 8 000 sự kiện xuống 5 sự kiện đáng xem</h2>
<p class="lead">Một log System dễ dàng có hàng chục nghìn sự kiện. Kéo chuột không phải là điều tra. Event Viewer có bốn công cụ biến đống sự kiện thành câu trả lời: <strong>Filter Current Log</strong>, <strong>Custom Views</strong> (bộ lọc đã lưu), <strong>Find</strong>, và <strong>xuất</strong>. Công cụ thứ năm, <strong>Attach a Task</strong>, khiến Windows tự báo cho <em>bạn</em> khi một sự kiện xảy ra.</p>

<h3>Liên tưởng đời thường: bộ lọc bảng tính lưu lại được</h3>
<p>Lọc log giống các mũi tên lọc trong Excel: mức = Error, nguồn = X, ngày = tuần trước. Custom View là bộ lọc đó được lưu với một cái tên để thứ Hai nào cũng khỏi dựng lại. Xuất là "Save as" để đồng nghiệp mở được đúng những dòng đó.</p>

<h3>Filter Current Log: hộp thoại và bản chất của nó</h3>
<p>Chuột phải vào một log › <em>Filter Current Log…</em>: Logged (1 giờ/12 giờ/24 giờ/7 ngày/30 ngày/khoảng tuỳ chọn), Event level (Critical/Error/Warning/Information/Verbose), By log hoặc By source, Event IDs (<code>1074,6005-6008,-7036</code> — dải số và loại trừ bằng dấu trừ), Task category, Keywords, User, Computer. Rồi mở tab <strong>XML</strong>: hộp thoại chỉ là trình dựng truy vấn.</p>
<pre><code class="language-xml">&lt;QueryList&gt;
  &lt;Query Id="0" Path="System"&gt;
    &lt;Select Path="System"&gt;*[System[(Level=1 or Level=2 or Level=3) and
      TimeCreated[timediff(@SystemTime) &amp;lt;= 604800000]]]&lt;/Select&gt;
  &lt;/Query&gt;
&lt;/QueryList&gt;</code></pre>
<p><code>604800000</code> ms = 7 ngày, tính lùi từ <em>bây giờ</em>. Cùng XML này dùng được trong PowerShell (<code>Get-WinEvent -FilterXml</code>), trong <code>wevtutil qe</code>, trong Windows Event Forwarding và trong nhiều agent SIEM (Bài 5.3, 15.4). Học một lần, dùng mãi.</p>

<h3>Bước 1 — "lỗi và cảnh báo trong 7 ngày qua"</h3>
<p>Tệp mẫu từ năm 2016, nên "bây giờ" được thay bằng "sự kiện cuối cùng trong tệp":</p>
${lenh('s03/loc-luu', 0)}
<p>Ba loại vấn đề trong tuần cuối: DNS hết thời gian chờ (1014), và hai lỗi của Service Control Manager — <strong>7011</strong> ("hết thời gian chờ phản hồi giao dịch từ một dịch vụ") và <strong>7009</strong> ("hết thời gian chờ dịch vụ kết nối"). Cả hai nghĩa là một dịch vụ khởi động quá chậm; trên máy ảo lab ít RAM thì hay gặp, trên máy chủ thật thì đó là manh mối.</p>

<h3>Bước 2 — theo Event ID, theo người dùng</h3>
${lenh('s03/loc-luu', 1)}
${lenh('s03/loc-luu', 2)}
<p>66 lần có người/chương trình yêu cầu khởi động lại/tắt máy (1074), 38 lần dịch vụ event log bật (6005 ≈ số lần khởi động), 37 lần tắt (6006 ≈ số lần tắt sạch): có một lần khởi động không có lần tắt sạch nào trước nó — Lab 3 sẽ tìm ra. Bộ lọc <em>User</em> khớp với <code>Security UserID</code> của sự kiện: S-1-5-18 SYSTEM, S-1-5-19 LOCAL SERVICE, S-1-5-20 NETWORK SERVICE, và SID <code>…-1000</code> duy nhất là người thật (tài khoản cục bộ đầu tiên được tạo).</p>

<h3>Bước 3 — Find (tìm chữ) và giới hạn của nó</h3>
${lenh('s03/loc-luu', 3)}
<p><em>Find…</em> của Event Viewer tìm trong chữ đang hiển thị, từng kết quả một — tiện cho "KB2… nằm đâu?", vô dụng khi cần đếm. Ở đây Windows Update (sự kiện 18, "sẵn sàng cài đặt") liệt kê tên các bản cập nhật. Thứ gì cần đếm hay làm lại nhiều lần, hãy dùng bộ lọc hoặc PowerShell.</p>

<h3>Bước 4 — xuất cho người khác</h3>
<pre><code class="language-powershell"># Trên Windows: Action › "Save All Events As…" (.evtx, .xml, .txt, .csv) hoặc "Save Filtered Log File As…"
wevtutil epl System C:\\ra\\system-1074.evtx /q:"*[System[(EventID=1074)]]"      # chỉ các sự kiện khớp
Get-WinEvent -Path C:\\ra\\system-1074.evtx | Measure-Object                        # kiểm thứ mình sắp gửi</code></pre>
${lenh('s03/loc-luu', 4)}
<p>Định dạng nào? <strong>.evtx</strong> giữ trọn mọi thứ và mở được bằng Event Viewer — gửi cho kỹ sư khác. <strong>.csv</strong> mở bằng Excel — gửi cho quản lý, nhưng chọn cột có chủ đích (Bài 3.2: câu chữ phụ thuộc máy hiển thị). <strong>.xml</strong> cho script. Khi lưu .evtx, Event Viewer hỏi có kèm <em>Display information</em> (câu chữ theo một ngôn ngữ) không: hãy kèm nếu người nhận không có cùng phần mềm.</p>
<p>Cùng bộ lọc bằng jq, cho đồng nghiệp dùng Linux/macOS:</p>
${lenh('s03/loc-luu', 5)}

<h3>Custom View: lưu bộ lọc</h3>
<pre><code class="language-xml">&lt;!-- %ProgramData%\\Microsoft\\Event Viewer\\Views\\View_lab1.xml — tạo bằng "Create Custom View…", xuất/nhập được --&gt;
&lt;ViewerConfig&gt;&lt;QueryConfig&gt;&lt;QueryParams&gt;&lt;UserQuery /&gt;&lt;/QueryParams&gt;&lt;QueryNode&gt;
  &lt;Name&gt;Lab - Bat va tat may&lt;/Name&gt;
  &lt;QueryList&gt;&lt;Query Id="0" Path="System"&gt;&lt;Select Path="System"&gt;
    *[System[(EventID=41 or EventID=1074 or EventID=6005 or EventID=6006 or EventID=6008)]]
  &lt;/Select&gt;&lt;/Query&gt;&lt;/QueryList&gt;
&lt;/QueryNode&gt;&lt;/QueryConfig&gt;&lt;/ViewerConfig&gt;</code></pre>
<p>Một Custom View có thể gộp nhiều log (System + Application + Security) — một "khung nhìn sự cố" chung cho cả đội. Xuất nó (<em>Export Custom View…</em>) và để lên wiki của đội.</p>

<h3>Attach a Task To This Event: chuông báo trong năm phút</h3>
<pre><code class="language-powershell"># Thứ mà trình hướng dẫn tạo ra, viết thành một lệnh (chạy bằng quyền quản trị):
schtasks /create /tn "Alert-LabApp-999" /ru SYSTEM /sc onevent /ec Application ^
  /mo "*[System[Provider[@Name='LabApp'] and EventID=999]]" ^
  /tr "powershell -NoProfile -Command Add-Content C:\\ra\\alert.txt (Get-Date)"
eventcreate /T ERROR /ID 999 /L APPLICATION /SO LabApp /D "DB connection failed 3 times"   # bắn thử một sự kiện</code></pre>
<p>Hợp với một máy và một sự kiện hiếm (job sao lưu hỏng, cảnh báo ổ đĩa). Nhiều máy thì gom log về một nơi rồi cảnh báo ở đó (Bài 15.5) — tác vụ cục bộ chết cùng chiếc máy nó canh.</p>

<h3>🛡️ Góc hacker: bộ lọc bạn không viết</h3>
<p>Bộ lọc chỉ cho thấy cái bạn hỏi. Người phân tích lọc Security theo 4625 để "tìm dò mật khẩu" sẽ bỏ lỡ lần đăng nhập <em>thành công</em> ngay sau đó (4624) và việc xoá log (1102). Hãy giữ một khung nhìn thứ hai thật rộng (mọi Critical/Error/Warning + danh sách ID "không bao giờ nên xảy ra") và so số lượng trước và sau khi lọc.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Làm sao chỉ hiện lỗi của một dịch vụ trong 24 giờ qua?" — Filter Current Log: level, source, Logged; hoặc <code>Get-WinEvent -FilterHashtable</code>.</li>
<li>"Gửi log cho bên hỗ trợ của hãng thế nào?" — xuất .evtx (kèm display information) đúng khoảng thời gian; có thể kèm CSV tóm tắt.</li>
<li>"Muốn được báo khi sự kiện X xảy ra trên máy chủ?" — Attach Task cho một máy; gom tập trung + cảnh báo cho cả dàn máy.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Hãy xin khách tệp <strong>.evtx</strong>, đừng xin ảnh chụp hay chữ dán. Ảnh chụp không lọc được; chữ dán mất trường và múi giờ. Một tệp .evtx đã lọc (chỉ khung giờ sự cố) đủ nhỏ để gửi email và không chứa gì ngoài thứ bạn cần.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy bạn, tạo Custom View "Khởi động lại" trên System với ID 41, 1074, 6005, 6006, 6008. Có bao nhiêu sự kiện?</li>
<li>Xuất view đó ra .evtx và .csv. Mở .evtx bằng Open Saved Log — số lượng có khớp không?</li>
<li>Trong tệp mẫu <code>dbc-many-events-system.evtx</code>, bao nhiêu sự kiện 1074 do <code>NT AUTHORITY\\SYSTEM</code> khởi xướng, bao nhiêu do người?</li>
</ol>
<p><strong>Đạt khi:</strong> (1)/(2) số lượng của view đang mở và tệp đã lưu khớp nhau; (3) gom theo <code>$_.data.'#text'[6]</code>: 57 lần do người (<code>…\\IEUser</code> trên các máy ảo IE8/IE9/IE10, phần lớn là Explorer.EXE + winlogon.exe = Start › Shut down), 9 lần do SYSTEM (TrustedInstaller ×4 = cập nhật, svchost ×2, msiexec, winlogon, và <code>wlms.exe</code> — dịch vụ theo dõi giấy phép, tự tắt máy ảo bản dùng thử đã hết hạn).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Filter Current Log', 'Hộp thoại lọc một log theo thời gian, mức, nguồn, ID, người dùng…'],
  ['QueryList / XPath', 'Truy vấn XML đứng sau mọi bộ lọc; dùng lại trong PowerShell, wevtutil, WEF.'],
  ['Custom View', 'Bộ lọc đã lưu (một hay nhiều log), lưu dạng XML.'],
  ['Save Filtered Log File As', 'Xuất riêng các sự kiện khớp ra .evtx.'],
  ['Attach a Task', 'Tác vụ hẹn giờ kích hoạt bởi một sự kiện (schtasks /sc onevent).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi bộ lọc là một truy vấn XML — chép từ tab XML và dùng lại.</li>
<li>Lưu bộ lọc chung của đội thành Custom View; xuất .evtx cho kỹ sư, CSV cho người đọc.</li>
<li>Tác vụ theo sự kiện là chuông báo cho một máy; dàn máy cần cảnh báo tập trung.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Consuming events (truy vấn XPath)', 'Tập con XPath được hỗ trợ, QueryList, Select/Suppress', 'https://learn.microsoft.com/en-us/windows/win32/wes/consuming-events')}
${nguon('📘', 'Microsoft Learn — wevtutil', 'qe, epl, gl, sl, cl', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-2-5-powershell-text', title: 'Bài 2.5 — PowerShell cho log văn bản', sub: 'Group-Object, Export-Csv dùng ở trên', cta: 'Mở bài' })}
</div>
`,
};
