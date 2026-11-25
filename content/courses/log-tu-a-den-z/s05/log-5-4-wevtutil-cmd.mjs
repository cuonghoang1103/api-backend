/**
 * 5.4 — wevtutil và công cụ thời cmd (soạn 24/11/2026, agent lgz). wevtutil/eventcreate/systeminfo/quser/tasklist chỉ chạy trên Windows ⇒ khối mã, không output giả.
 * Output thật: OUT['s05/wevtutil-cmd'] — DẤU VẾT các lệnh đó trong log mẫu công khai (4688).
 * Số tất định: clear-4688-native (fs02, admmig) 14 × wevtutil cl 19:07:25.659→19:07:26.143, mỗi cái kèm conhost; security_big_sample (WIN-WFBHIBE5GXZ): 4688 v0 không CommandLine,
 * 149 wevtutil + 2 cmd + 1 bcdedit cùng Logon ID 0x32cfb trong 01:47:07–01:47:10, 1102 bởi Administrator 0x32cfb, log bắt đầu 01:47:07.166; dbc IE10Win7 4688: 675 v0, 7472 v1 có CommandLine, 199 v1 không.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '5.4 — wevtutil and cmd-era tools: el, gl, qe, epl, sl, cl; eventcreate, systeminfo, query user, tasklist /svc|||5.4 — wevtutil và các công cụ thời cmd: el, gl, qe, epl, sl, cl; eventcreate, systeminfo, query user, tasklist /svc',
  slug: 'log-5-4-wevtutil-cmd',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khi không có PowerShell (Server Core cũ, cmd của công cụ quản trị từ xa, script .bat của khách): wevtutil el/gl/gli/sl/qe/epl/al/cl với /q XPath, /rd, /c, /f, /lf; eventcreate để thử cảnh báo; systeminfo, query user, tasklist /svc, whoami. Và mặt kia: chính các lệnh này để lại dấu vết trong 4688 — xem một vòng "wevtutil cl" xoá 149 log trong 2,5 giây trên một máy chủ mẫu thật, kể cả khi 4688 không có CommandLine.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>The command prompt still matters</h2>
<p class="lead">PowerShell is the main tool, but you will meet situations where it is not there or not welcome: a vendor's <code>.bat</code> health check, an old Server Core box, a remote shell that only runs <code>cmd.exe</code>, a customer runbook written in 2012. <strong>wevtutil</strong> does everything Event Viewer does from the command line, with the same XPath you learned in 5.3. And every one of these commands is also used by attackers — so you must recognise them in the logs.</p>

<h3>The everyday picture: the building's maintenance keys</h3>
<p>Event Viewer is the front desk; wevtutil is the janitor's key ring. With it you can list every room (<code>el</code>), read a room's settings (<code>gl</code>), resize it (<code>sl</code>), photocopy its records (<code>qe</code>, <code>epl</code>) — and shred them (<code>cl</code>). The same key ring in the wrong hands is how records disappear.</p>

${kv([
  ['wevtutil el', 'enum-logs: list all log names.'],
  ['wevtutil gl &lt;log&gt; / gli &lt;log&gt;', 'get-log: settings (enabled, maxSize, retention, path) / get-log-info: size, record count, oldest record.'],
  ['wevtutil sl &lt;log&gt; /ms:&lt;bytes&gt; /rt:false /e:true', 'set-log: maximum size, overwrite mode, enable a disabled log.'],
  ['wevtutil qe &lt;log&gt; /q:"XPath" /c:N /rd:true /f:text', 'query-events: XPath filter, count, newest first, text/xml/RenderedXml; /lf:true to read a .evtx file.'],
  ['wevtutil epl &lt;log&gt; &lt;file.evtx&gt; [/q:"XPath"]', 'export-log: copy (optionally filtered) to a file — the evidence-friendly way.'],
  ['wevtutil al &lt;file.evtx&gt; /l:en-US', 'archive-log: add locale metadata so Message renders on other machines.'],
  ['wevtutil cl &lt;log&gt; [/bu:&lt;backup.evtx&gt;]', 'clear-log: empties the log (optionally backing it up first). Writes 1102 (Security) / 104 (others).'],
  ['eventcreate /T ERROR /ID 900 /L APPLICATION /SO MyApp /D "text"', 'Write a test event (IDs 1–1000) — to test alerts and Custom Views.'],
])}

<h3>Step 1 — on your Windows machine (cmd as administrator)</h3>
<pre><code class="language-bat">:: Logs and their settings
wevtutil el | find /c /v ""
wevtutil gl Security
wevtutil gli Security

:: The 5 newest failed logons, as text (same XPath as Lesson 5.3)
wevtutil qe Security /q:"*[System[EventID=4625]]" /c:5 /rd:true /f:text

:: Read an exported file instead of a live log
wevtutil qe C:\\lab\\tc\\smb-doan-mk-4625.evtx /lf:true /q:"*[System[EventID=4625]]" /c:1 /f:xml

:: Export the last 24 h of System errors to a file, then make it portable
wevtutil epl System C:\\lab\\sys-err.evtx /q:"*[System[(Level=1 or Level=2) and TimeCreated[timediff(@SystemTime) &lt;= 86400000]]]"
wevtutil al C:\\lab\\sys-err.evtx /l:en-US

:: Grow the Security log to 1 GB (Lesson 3.5) and keep overwriting
wevtutil sl Security /ms:1073741824 /rt:false

:: Write a test event to check that your alert fires
eventcreate /T ERROR /ID 900 /L APPLICATION /SO LabTest /D "Lab 5: alert test"

:: Context every incident note needs
systeminfo | findstr /B /C:"Host Name" /C:"OS Name" /C:"System Boot Time" /C:"Time Zone"
query user
tasklist /svc /fi "imagename eq svchost.exe"
whoami /all</code></pre>
<p><code>/rd:true</code> means "reverse direction" = newest first (the default for qe is <em>oldest</em> first — the opposite of Get-WinEvent). <code>/f:text</code> renders Message using the local DLLs, like Event Viewer. <code>systeminfo</code>'s "System Boot Time" and "Time Zone" are the two lines you paste at the top of every incident note.</p>

<h3>Step 2 — the other side: what these commands leave behind</h3>
<p>We cannot run wevtutil here (no Windows), but we can read what it left in real public logs. First, a lab machine where the attacker ran the classic "clear everything" loop — <code>for /F "tokens=*" %1 in ('wevtutil el') DO wevtutil cl "%1"</code> — with command-line auditing on:</p>
${lenh('s05/wevtutil-cmd', 0)}
${lenh('s05/wevtutil-cmd', 1)}
${lenh('s05/wevtutil-cmd', 2)}
<p>Every <code>wevtutil cl &lt;log&gt;</code> is a 4688 with the full command line, one every ~35 ms, each followed by its <code>conhost.exe</code> (console host — every console program gets one). The fields tell <strong>who</strong> (SubjectUserName admmig, domain OFFSEC, Logon ID 0x1caf291 → trace back to the 4624 of that session, Lesson 4.1), <strong>how elevated</strong> (TokenElevationType %%1936 = full token, i.e. "Run as administrator"), and the parent process ID.</p>

<h3>Step 3 — same story, no command line</h3>
${lenh('s05/wevtutil-cmd', 3)}
${lenh('s05/wevtutil-cmd', 4)}
<p>A real server sample (Windows Server, 62 000 events). The most frequent "new process" of the whole log is <strong>wevtutil.exe — 149 times</strong>, and its 4688 has <strong>no CommandLine field at all</strong>: this is version 0 of the event (Windows Vista / Server 2008 era — Microsoft's 4688 page lists the versions; the command-line field arrived in version 1 with Windows 8.1 / Server 2012 R2). So we cannot read "cl" or "qe". Can we still tell what happened?</p>
${lenh('s05/wevtutil-cmd', 5)}
${lenh('s05/wevtutil-cmd', 7)}
${lenh('s05/wevtutil-cmd', 6)}
${lenh('s05/wevtutil-cmd', 8)}
<p>Yes, by correlation: <strong>149 wevtutil + 2 cmd + 1 bcdedit, all from Logon ID 0x32cfb, inside one 10-second window</strong>; a <strong>1102 "audit log cleared" by Administrator with the same Logon ID</strong> in the middle of the burst; and the Security log itself <strong>starts</strong> at 01:47:07 — everything before is gone. 149 is roughly "every log on the machine". Conclusion with evidence from three angles: someone in session 0x32cfb ran a loop clearing all event logs. (In this public dataset it was the sample's author resetting the machine before recording; in your incident it would be the first line of the report.)</p>

<h3>Step 4 — does this machine record command lines?</h3>
${lenh('s05/wevtutil-cmd', 9)}
<p>The same Windows 7 machine produced 675 events of version 0 (no field) and later 7 671 of version 1 — Windows 7 and Server 2008 R2 received the command-line field through Microsoft security advisory KB3004375, "Update to improve Windows command-line auditing", 10 February 2015 — and 199 of those version 1 events still have an empty CommandLine: the field exists but the policy <em>Include command line in process creation events</em> was off at that time. Version tells you what the OS <em>can</em> record; an empty value tells you what was <em>configured</em>. Lesson 5.5 turns this into a checklist.</p>

<h3>🛡️ Attacker's corner: wevtutil cl in the real world</h3>
<p>MITRE ATT&amp;CK records that <strong>NotPetya</strong> (June 2017) "uses wevtutil to clear the Windows event logs" (technique now numbered T1685.005, formerly T1070.001); <strong>Olympic Destroyer</strong> (February 2018, Winter Olympics in Pyeongchang) did the same before wiping. Clearing is loud: it writes 1102/104 (Lesson 4.3), and with process auditing it writes a 4688 per log — which is why serious defenders <strong>forward</strong> events off the machine (Lesson 5.7): the attacker can clear the local copy, not the copy already on the collector. Also note the reconnaissance commands in the same list — <code>whoami</code>, <code>systeminfo</code>, <code>tasklist</code>, <code>net user</code>, <code>query user</code> — you will see them run by a reverse shell in Lesson 5.6.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"How do you export only the last day of errors from a server without PowerShell?" — <code>wevtutil epl System file.evtx /q:"…timediff…"</code>, then <code>wevtutil al</code> for portability.</li>
<li>"wevtutil qe returns the oldest event first — how do you get the newest?" — <code>/rd:true</code> (and <code>/c:N</code> to limit).</li>
<li>"4688 has no command line. Can you still prove a log-clearing loop?" — count wevtutil per Logon ID and time window, correlate with 1102/104 and the log's first record.</li>
<li>"How do you test that an alert on Event ID X works?" — <code>eventcreate</code> (Application/System, IDs 1–1000) or <code>Write-EventLog</code>/<code>New-WinEvent</code>, in a test machine.</li>
</ul>

<h3>At work</h3>
<p>Customer ops teams love <code>.bat</code> files. A common outsourcing task is "add a step to the nightly job that exports the logs": <code>wevtutil epl</code> with a dated file name, <code>wevtutil al</code>, then copy to the share — never <code>cl</code> without <code>/bu:</code> (a backup) and never on Security without an approved change. When someone asks "can you clear the logs, the disk is full?", the answer is "increase or archive, don't clear" (Lesson 3.5) — and if they insist, clear with <code>/bu:</code> and write it in the ticket, because the 1102 will be questioned at the next audit.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Translate to wevtutil: "the 10 newest 4624 with LogonType 10 from the Security log, as XML".</li>
<li>In the clear-loop sample, list all 14 logs that were cleared (hint: CommandLine after <code>cl </code>). Which one should have produced a 1102 and which ones a 104?</li>
<li>On your own Windows VM, run <code>eventcreate</code> and find your event with wevtutil qe and with Get-WinEvent.</li>
</ol>
<p><strong>Pass:</strong> (1) <code>wevtutil qe Security /q:"*[System[EventID=4624] and EventData[Data[@Name='LogonType']='10']]" /c:10 /rd:true /f:xml</code>; (2) RTWorkQueueTheading, Security, Setup, SmbWmiAnalytic, System, SystemEventsBroker, TabletPC_InputPanel_Channel, …/IHM, UIManager_Channel, WINDOWS_KS_CHANNEL, WINDOWS_WMPHOTO_CHANNEL, "Windows PowerShell", Windows.Globalization/Analytic, WitnessClientAdmin — Security → 1102 in Security; the others → 104 in System; (3) provider = the /SO name, ID = /ID.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['wevtutil', 'Command-line tool for event logs: el, gl, gli, sl, qe, epl, al, cl.'],
  ['/rd:true', 'qe newest first.'],
  ['epl / al', 'Export (filtered) / archive with locale data.'],
  ['eventcreate', 'Write a test event.'],
  ['4688 version 0/1/2', 'No CommandLine / CommandLine (if enabled) / plus parent name and target user.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>wevtutil uses the same XPath; qe is oldest-first unless /rd:true.</li>
<li>Export with epl + al; never cl without a backup and a ticket.</li>
<li>Admin and attacker tools are the same — recognise them in 4688.</li>
<li>No command line? Correlate by Logon ID, time window and 1102/104.</li>
</ul>
${nguon('📘', 'Microsoft Learn — wevtutil', 'All subcommands and options', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil')}
${nguon('📘', 'Microsoft Learn — eventcreate', 'Writing custom events (IDs 1–1000)', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/eventcreate')}
${nguon('📘', 'Microsoft Learn — 4688(S): A new process has been created', 'Event versions 0, 1, 2 and their fields', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4688')}
${nguon('📘', 'Microsoft Support — KB3004375: Update to improve Windows command-line auditing (10/2/2015)', 'CommandLine in 4688 for Windows 7 / Server 2008 R2', 'https://support.microsoft.com/kb/3004375')}
${nguon('🛡️', 'MITRE ATT&CK S0368 — NotPetya', '"uses wevtutil to clear the Windows event logs"', 'https://attack.mitre.org/software/S0368/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-3-xoa-log-chinh-sach', title: 'Lesson 4.3 — Clearing logs and changing policy', sub: '1102, 104, 4719 in detail', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-5-audit-policy', title: 'Lesson 5.5 — Audit policy', sub: 'Turn on what is off', cta: 'Next' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Dấu nhắc lệnh vẫn còn quan trọng</h2>
<p class="lead">PowerShell là công cụ chính, nhưng bạn sẽ gặp lúc nó không có hoặc không được hoan nghênh: một tệp <code>.bat</code> kiểm tra sức khoẻ của hãng phần mềm, một máy Server Core cũ, một shell từ xa chỉ chạy <code>cmd.exe</code>, một runbook của khách viết năm 2012. <strong>wevtutil</strong> làm được mọi việc Event Viewer làm, ngay từ dòng lệnh, với đúng XPath bạn học ở 5.3. Và mỗi lệnh trong số này cũng được kẻ tấn công dùng — nên bạn phải nhận ra chúng trong log.</p>

<h3>Liên tưởng đời thường: chùm chìa khoá của người bảo trì toà nhà</h3>
<p>Event Viewer là quầy lễ tân; wevtutil là chùm chìa khoá của người bảo trì. Với nó bạn liệt kê được mọi phòng (<code>el</code>), đọc thiết lập của một phòng (<code>gl</code>), nới rộng phòng (<code>sl</code>), photo hồ sơ của phòng (<code>qe</code>, <code>epl</code>) — và huỷ chúng (<code>cl</code>). Cũng chùm chìa ấy rơi vào tay kẻ xấu là cách hồ sơ biến mất.</p>

${kv([
  ['wevtutil el', 'enum-logs: liệt kê tên mọi log.'],
  ['wevtutil gl &lt;log&gt; / gli &lt;log&gt;', 'get-log: thiết lập (bật, maxSize, chế độ giữ, đường dẫn) / get-log-info: kích thước, số bản ghi, bản ghi cũ nhất.'],
  ['wevtutil sl &lt;log&gt; /ms:&lt;byte&gt; /rt:false /e:true', 'set-log: kích thước tối đa, chế độ ghi đè, bật một log đang tắt.'],
  ['wevtutil qe &lt;log&gt; /q:"XPath" /c:N /rd:true /f:text', 'query-events: lọc XPath, số lượng, mới nhất trước, dạng text/xml/RenderedXml; /lf:true để đọc tệp .evtx.'],
  ['wevtutil epl &lt;log&gt; &lt;tệp.evtx&gt; [/q:"XPath"]', 'export-log: chép (có thể đã lọc) ra tệp — cách thân thiện với bằng chứng.'],
  ['wevtutil al &lt;tệp.evtx&gt; /l:en-US', 'archive-log: thêm siêu dữ liệu ngôn ngữ để Message hiện được trên máy khác.'],
  ['wevtutil cl &lt;log&gt; [/bu:&lt;bản-sao.evtx&gt;]', 'clear-log: làm rỗng log (có thể sao lưu trước). Ghi 1102 (Security) / 104 (các log khác).'],
  ['eventcreate /T ERROR /ID 900 /L APPLICATION /SO MyApp /D "chữ"', 'Ghi một sự kiện thử (ID 1–1000) — để thử cảnh báo và Custom View.'],
])}

<h3>Bước 1 — trên máy Windows của bạn (cmd chạy quyền quản trị)</h3>
<pre><code class="language-bat">:: Các log và thiết lập của chúng
wevtutil el | find /c /v ""
wevtutil gl Security
wevtutil gli Security

:: 5 lần đăng nhập hỏng mới nhất, dạng chữ (cùng XPath với Bài 5.3)
wevtutil qe Security /q:"*[System[EventID=4625]]" /c:5 /rd:true /f:text

:: Đọc tệp đã xuất thay vì log đang chạy
wevtutil qe C:\\lab\\tc\\smb-doan-mk-4625.evtx /lf:true /q:"*[System[EventID=4625]]" /c:1 /f:xml

:: Xuất lỗi System của 24 giờ qua ra tệp, rồi làm nó mang đi được
wevtutil epl System C:\\lab\\sys-err.evtx /q:"*[System[(Level=1 or Level=2) and TimeCreated[timediff(@SystemTime) &lt;= 86400000]]]"
wevtutil al C:\\lab\\sys-err.evtx /l:en-US

:: Nới log Security lên 1 GB (Bài 3.5) và giữ chế độ ghi đè
wevtutil sl Security /ms:1073741824 /rt:false

:: Ghi một sự kiện thử để kiểm cảnh báo có kêu không
eventcreate /T ERROR /ID 900 /L APPLICATION /SO LabTest /D "Lab 5: thu canh bao"

:: Bối cảnh mà mọi ghi chú sự cố đều cần
systeminfo | findstr /B /C:"Host Name" /C:"OS Name" /C:"System Boot Time" /C:"Time Zone"
query user
tasklist /svc /fi "imagename eq svchost.exe"
whoami /all</code></pre>
<p><code>/rd:true</code> nghĩa là "đảo chiều" = mới nhất trước (mặc định của qe là <em>cũ nhất</em> trước — ngược với Get-WinEvent). <code>/f:text</code> ghép Message bằng DLL trên máy, như Event Viewer. "System Boot Time" và "Time Zone" của <code>systeminfo</code> là hai dòng bạn dán lên đầu mọi ghi chú sự cố.</p>

<h3>Bước 2 — mặt kia: những lệnh này để lại gì</h3>
<p>Ở đây không chạy được wevtutil (không có Windows), nhưng đọc được thứ nó để lại trong log công khai thật. Trước hết, một máy lab nơi kẻ tấn công chạy vòng lặp "xoá sạch" kinh điển — <code>for /F "tokens=*" %1 in ('wevtutil el') DO wevtutil cl "%1"</code> — khi đã bật kiểm toán dòng lệnh:</p>
${lenh('s05/wevtutil-cmd', 0)}
${lenh('s05/wevtutil-cmd', 1)}
${lenh('s05/wevtutil-cmd', 2)}
<p>Mỗi <code>wevtutil cl &lt;log&gt;</code> là một 4688 có đủ dòng lệnh, cứ khoảng 35 ms một cái, mỗi cái kèm một <code>conhost.exe</code> (console host — chương trình console nào cũng có một cái). Các trường cho biết <strong>ai</strong> (SubjectUserName admmig, miền OFFSEC, Logon ID 0x1caf291 → lần ngược về 4624 của phiên đó, Bài 4.1), <strong>quyền nâng tới đâu</strong> (TokenElevationType %%1936 = token đầy đủ, tức là "Run as administrator"), và ID của tiến trình cha.</p>

<h3>Bước 3 — cùng câu chuyện, không có dòng lệnh</h3>
${lenh('s05/wevtutil-cmd', 3)}
${lenh('s05/wevtutil-cmd', 4)}
<p>Một mẫu máy chủ thật (Windows Server, 62 000 sự kiện). "Tiến trình mới" xuất hiện nhiều nhất của cả log là <strong>wevtutil.exe — 149 lần</strong>, và 4688 của nó <strong>không hề có trường CommandLine</strong>: đây là phiên bản 0 của sự kiện (thời Windows Vista / Server 2008 — trang 4688 của Microsoft liệt kê các phiên bản; trường dòng lệnh có từ phiên bản 1 với Windows 8.1 / Server 2012 R2). Vậy không đọc được "cl" hay "qe". Vẫn nói được chuyện gì đã xảy ra không?</p>
${lenh('s05/wevtutil-cmd', 5)}
${lenh('s05/wevtutil-cmd', 7)}
${lenh('s05/wevtutil-cmd', 6)}
${lenh('s05/wevtutil-cmd', 8)}
<p>Được, bằng cách đối chiếu: <strong>149 wevtutil + 2 cmd + 1 bcdedit, tất cả từ Logon ID 0x32cfb, trong một khung 10 giây</strong>; một <strong>1102 "audit log cleared" bởi Administrator với cùng Logon ID</strong> nằm giữa đợt đó; và chính log Security <strong>bắt đầu</strong> lúc 01:47:07 — mọi thứ trước đó đã mất. 149 xấp xỉ "mọi log trên máy". Kết luận có bằng chứng từ ba phía: ai đó trong phiên 0x32cfb đã chạy một vòng lặp xoá mọi log sự kiện. (Trong bộ dữ liệu công khai này, đó là tác giả mẫu dọn máy trước khi ghi; trong sự cố của bạn, đó sẽ là dòng đầu tiên của báo cáo.)</p>

<h3>Bước 4 — máy này có ghi dòng lệnh không?</h3>
${lenh('s05/wevtutil-cmd', 9)}
<p>Cùng một máy Windows 7 sinh ra 675 sự kiện phiên bản 0 (không có trường) rồi sau đó 7 671 sự kiện phiên bản 1 — Windows 7 và Server 2008 R2 được thêm trường dòng lệnh qua khuyến cáo bảo mật KB3004375 của Microsoft, "Update to improve Windows command-line auditing", ngày 10/2/2015 — và 199 sự kiện phiên bản 1 trong số đó vẫn có CommandLine rỗng: trường có, nhưng lúc đó chính sách <em>Include command line in process creation events</em> đang tắt. Phiên bản cho biết hệ điều hành <em>có thể</em> ghi gì; giá trị rỗng cho biết đã được <em>cấu hình</em> thế nào. Bài 5.5 biến điều này thành một danh sách kiểm.</p>

<h3>🛡️ Góc hacker: wevtutil cl ngoài đời thật</h3>
<p>MITRE ATT&amp;CK ghi nhận <strong>NotPetya</strong> (tháng 6/2017) "dùng wevtutil để xoá log sự kiện Windows" (kỹ thuật nay đánh số T1685.005, số cũ T1070.001); <strong>Olympic Destroyer</strong> (tháng 2/2018, Thế vận hội mùa đông Pyeongchang) cũng làm vậy trước khi xoá sạch máy. Xoá log rất ồn: nó ghi 1102/104 (Bài 4.3), và khi bật kiểm toán tiến trình thì mỗi log thêm một 4688 — vì vậy người phòng thủ nghiêm túc <strong>chuyển tiếp</strong> sự kiện ra khỏi máy (Bài 5.7): kẻ tấn công xoá được bản cục bộ, không xoá được bản đã nằm trên máy gom. Để ý cả các lệnh trinh sát trong cùng danh sách — <code>whoami</code>, <code>systeminfo</code>, <code>tasklist</code>, <code>net user</code>, <code>query user</code> — bạn sẽ thấy một reverse shell chạy chúng ở Bài 5.6.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Xuất riêng lỗi của ngày hôm qua từ một máy chủ không có PowerShell thế nào?" — <code>wevtutil epl System tệp.evtx /q:"…timediff…"</code>, rồi <code>wevtutil al</code> để mang đi được.</li>
<li>"wevtutil qe trả sự kiện cũ nhất trước — lấy mới nhất thế nào?" — <code>/rd:true</code> (và <code>/c:N</code> để giới hạn).</li>
<li>"4688 không có dòng lệnh. Vẫn chứng minh được một vòng xoá log không?" — đếm wevtutil theo Logon ID và khung giờ, đối chiếu với 1102/104 và bản ghi đầu tiên của log.</li>
<li>"Kiểm một cảnh báo theo Event ID X có chạy không thế nào?" — <code>eventcreate</code> (Application/System, ID 1–1000) hoặc <code>Write-EventLog</code>/<code>New-WinEvent</code>, trên máy thử.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Đội vận hành phía khách rất chuộng tệp <code>.bat</code>. Việc outsourcing hay gặp là "thêm một bước vào job ban đêm để xuất log": <code>wevtutil epl</code> với tên tệp có ngày, <code>wevtutil al</code>, rồi chép sang thư mục chia sẻ — không bao giờ <code>cl</code> mà thiếu <code>/bu:</code> (bản sao lưu) và không bao giờ đụng Security khi chưa có change được duyệt. Khi ai đó hỏi "xoá log giúp được không, đầy đĩa rồi?", câu trả lời là "nới hoặc lưu trữ, đừng xoá" (Bài 3.5) — còn nếu họ nhất quyết, xoá kèm <code>/bu:</code> và ghi vào ticket, vì 1102 sẽ bị hỏi tới ở lần kiểm toán sau.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Dịch sang wevtutil: "10 sự kiện 4624 mới nhất có LogonType 10 của log Security, dạng XML".</li>
<li>Trong mẫu vòng xoá, liệt kê đủ 14 log đã bị xoá (gợi ý: CommandLine sau <code>cl </code>). Cái nào lẽ ra sinh 1102 và những cái nào sinh 104?</li>
<li>Trên máy ảo Windows của bạn, chạy <code>eventcreate</code> rồi tìm sự kiện của mình bằng wevtutil qe và bằng Get-WinEvent.</li>
</ol>
<p><strong>Đạt:</strong> (1) <code>wevtutil qe Security /q:"*[System[EventID=4624] and EventData[Data[@Name='LogonType']='10']]" /c:10 /rd:true /f:xml</code>; (2) RTWorkQueueTheading, Security, Setup, SmbWmiAnalytic, System, SystemEventsBroker, TabletPC_InputPanel_Channel, …/IHM, UIManager_Channel, WINDOWS_KS_CHANNEL, WINDOWS_WMPHOTO_CHANNEL, "Windows PowerShell", Windows.Globalization/Analytic, WitnessClientAdmin — Security → 1102 trong Security; các log khác → 104 trong System; (3) nhà cung cấp = tên ở /SO, ID = /ID.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['wevtutil', 'Công cụ dòng lệnh cho log sự kiện: el, gl, gli, sl, qe, epl, al, cl.'],
  ['/rd:true', 'qe mới nhất trước.'],
  ['epl / al', 'Xuất (có lọc) / lưu trữ kèm dữ liệu ngôn ngữ.'],
  ['eventcreate', 'Ghi một sự kiện thử.'],
  ['4688 phiên bản 0/1/2', 'Không CommandLine / có CommandLine (nếu bật) / thêm tên tiến trình cha và người dùng đích.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>wevtutil dùng cùng XPath; qe cũ nhất trước trừ khi /rd:true.</li>
<li>Xuất bằng epl + al; không bao giờ cl khi thiếu bản sao lưu và ticket.</li>
<li>Công cụ của quản trị viên và kẻ tấn công là một — nhận ra chúng trong 4688.</li>
<li>Không có dòng lệnh? Đối chiếu theo Logon ID, khung giờ và 1102/104.</li>
</ul>
${nguon('📘', 'Microsoft Learn — wevtutil', 'Mọi lệnh con và tuỳ chọn', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil')}
${nguon('📘', 'Microsoft Learn — eventcreate', 'Ghi sự kiện tự tạo (ID 1–1000)', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/eventcreate')}
${nguon('📘', 'Microsoft Learn — 4688(S): A new process has been created', 'Các phiên bản 0, 1, 2 và trường của chúng', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4688')}
${nguon('📘', 'Microsoft Support — KB3004375: Update to improve Windows command-line auditing (10/2/2015)', 'CommandLine in 4688 for Windows 7 / Server 2008 R2', 'https://support.microsoft.com/kb/3004375')}
${nguon('🛡️', 'MITRE ATT&CK S0368 — NotPetya', '"uses wevtutil to clear the Windows event logs"', 'https://attack.mitre.org/software/S0368/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-3-xoa-log-chinh-sach', title: 'Bài 4.3 — Xoá log và đổi chính sách', sub: '1102, 104, 4719 chi tiết', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-5-audit-policy', title: 'Bài 5.5 — Audit policy', sub: 'Bật những gì đang tắt', cta: 'Bài tiếp' })}
</div>
`,
};
