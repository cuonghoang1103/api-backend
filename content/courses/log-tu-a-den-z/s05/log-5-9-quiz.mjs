/**
 * 5.9 — Kiểm tra Chương 5 (soạn 24/11/2026, agent lgz). 12 câu; đáp số dựa trên output thật OUT['s05/*'] (bộ EVTX mẫu công khai, Get-WinEventMau).
 * Phân bố đáp án: A ×3 (3, 6, 9) · B ×3 (1, 8, 11) · C ×3 (2, 5, 12) · D ×3 (4, 7, 10).
 */
export default {
  title: '5.9 — Chapter 5 quiz|||5.9 — Kiểm tra Chương 5',
  slug: 'log-5-9-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười hai câu về đọc log Windows bằng dòng lệnh: thứ tự mặc định của Get-WinEvent, Properties và ToXml, vì sao Message rỗng, luật AND/OR của FilterHashtable, bẫy Level 0 của Security, ID trùng giữa nhà cung cấp, giới hạn XPath, Suppress, wevtutil qe /rd, suy ra audit policy từ log, Sysmon 0x1010 vào lsass, WEF RenderedText.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Command line, audit policy and Sysmon</h2>
<p class="lead">Twelve questions on the real outputs of this chapter. Answer, then explain which command or field proves it.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read a .evtx with Get-WinEvent, get fields by name and group/count/export the result.</li>
<li>I can write a FilterHashtable, an XPath and a QueryList with Suppress — and know what XPath cannot do.</li>
<li>I can use wevtutil qe/epl/al and recognise wevtutil cl in 4688.</li>
<li>I can tell from a log which audit subcategories were on, and turn them on.</li>
<li>I can read Sysmon 1, 3, 8, 10, 11, 13 and explain a web shell, an LSASS read and an injection.</li>
<li>I can pull logs from many machines and explain WEF.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Dòng lệnh, audit policy và Sysmon</h2>
<p class="lead">Mười hai câu trên output thật của chương. Trả lời, rồi giải thích lệnh hay trường nào chứng minh điều đó.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được tệp .evtx bằng Get-WinEvent, lấy trường theo tên và gom/đếm/xuất kết quả.</li>
<li>Tôi viết được FilterHashtable, XPath và QueryList có Suppress — và biết XPath không làm được gì.</li>
<li>Tôi dùng được wevtutil qe/epl/al và nhận ra wevtutil cl trong 4688.</li>
<li>Nhìn log tôi biết những subcategory kiểm toán nào đã bật, và biết cách bật.</li>
<li>Tôi đọc được Sysmon 1, 3, 8, 10, 11, 13 và giải thích được webshell, đọc LSASS và tiêm mã.</li>
<li>Tôi kéo được log từ nhiều máy và giải thích được WEF.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 1080,
    questions: [
      {
        question: 'Get-WinEvent -Path x.evtx -MaxEvents 3 returns which events?|||Get-WinEvent -Path x.evtx -MaxEvents 3 trả về những sự kiện nào?',
        options: [
          'The 3 oldest|||3 sự kiện cũ nhất',
          'The 3 newest|||3 sự kiện mới nhất',
          'Three random events|||Ba sự kiện ngẫu nhiên',
          'The 3 with the highest Level|||3 sự kiện có Level cao nhất',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 5.1: newest first by default; -Oldest reverses it. (wevtutil qe is the opposite: oldest first unless /rd:true.)|||VI: Bài 5.1: mặc định mới nhất trước; -Oldest đảo lại. (wevtutil qe thì ngược lại: cũ nhất trước trừ khi /rd:true.)',
      },
      {
        question: 'You read an .evtx exported from a customer server on your laptop and the Message column is empty. Most likely reason?|||Bạn đọc trên laptop một tệp .evtx xuất từ máy chủ của khách và cột Message rỗng. Lý do khả dĩ nhất?',
        options: [
          'The file is corrupted|||Tệp bị hỏng',
          'You are not administrator|||Bạn không phải quản trị viên',
          'Message is rendered from the provider’s DLL on the reading machine, which your laptop does not have|||Message được ghép từ DLL của nhà cung cấp trên máy đọc, mà laptop của bạn không có',
          'Get-WinEvent never shows Message for files|||Get-WinEvent không bao giờ hiện Message với tệp',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 5.1 Step 4: the file stores data, not text. Fix: wevtutil al (locale metadata) or WEF RenderedText (Lesson 5.7). Report on fields, not Message.|||VI: Bài 5.1 Bước 4: tệp lưu dữ liệu, không lưu câu chữ. Cách xử lý: wevtutil al (siêu dữ liệu ngôn ngữ) hoặc WEF RenderedText (Bài 5.7). Báo cáo trên trường, không trên Message.',
      },
      {
        question: '@{ LogName = \'Security\'; Id = 4624, 4625; StartTime = $t } means…|||@{ LogName = \'Security\'; Id = 4624, 4625; StartTime = $t } nghĩa là…',
        options: [
          'Security AND (4624 OR 4625) AND after $t|||Security VÀ (4624 HOẶC 4625) VÀ sau $t',
          'Security OR 4624 OR 4625 OR after $t|||Security HOẶC 4624 HOẶC 4625 HOẶC sau $t',
          'Security AND 4624 AND 4625 AND after $t (no event can match)|||Security VÀ 4624 VÀ 4625 VÀ sau $t (không sự kiện nào khớp được)',
          'Only 4624; the second Id is ignored|||Chỉ 4624; Id thứ hai bị bỏ qua',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 5.2: keys AND, values inside one key OR. On the ForwardedEvents sample: 429 + 130 = 559.|||VI: Bài 5.2: các khoá AND, các giá trị trong một khoá OR. Trên mẫu ForwardedEvents: 429 + 130 = 559.',
      },
      {
        question: 'On a collector, @{ LogName = \'Security\'; Level = 4 } returns almost nothing although there are 650 audit events. Why?|||Trên một máy gom, @{ LogName = \'Security\'; Level = 4 } gần như không trả gì dù có 650 sự kiện kiểm toán. Vì sao?',
        options: [
          'The Security log is encrypted|||Log Security bị mã hoá',
          'Level is not a valid key|||Level không phải khoá hợp lệ',
          'Audit events are Level 3 (Warning)|||Sự kiện kiểm toán là Level 3 (Warning)',
          'Audit events are stored with Level 0 (LogAlways); use Keywords (Audit Success/Failure) or Id|||Sự kiện kiểm toán được lưu với Level 0 (LogAlways); dùng Keywords (Audit Success/Failure) hoặc Id',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 5.2 Step 4: 650 × Level 0; Event Viewer only displays "Information". Keywords = Audit Failure returned exactly the 130 failures.|||VI: Bài 5.2 Bước 4: 650 × Level 0; Event Viewer chỉ hiển thị là "Information". Keywords = Audit Failure trả đúng 130 lần thất bại.',
      },
      {
        question: 'A morning report counts @{ Id = 4625 } on a machine with no failed logons and finds 38 events. What are they?|||Báo cáo buổi sáng đếm @{ Id = 4625 } trên một máy không có lần đăng nhập hỏng nào và ra 38 sự kiện. Đó là gì?',
        options: [
          'Hidden brute force|||Dò mật khẩu bị ẩn',
          'Kerberos failures|||Lỗi Kerberos',
          'Application-log events of Microsoft-Windows-EventSystem, which reuses ID 4625|||Sự kiện log Application của Microsoft-Windows-EventSystem, nhà cung cấp dùng lại ID 4625',
          'Logon failures from the future|||Đăng nhập hỏng đến từ tương lai',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 5.2 Step 5: always pair Id with LogName or ProviderName — the same lesson as ID 1000 in 3.6 and the LoadPerf "crashes" of Lab 5.|||VI: Bài 5.2 Bước 5: luôn đi kèm Id với LogName hoặc ProviderName — cùng bài học với ID 1000 ở 3.6 và "lần sập" LoadPerf của Lab 5.',
      },
      {
        question: 'Which XPath is NOT accepted by the Windows Event Log service?|||Biểu thức XPath nào dịch vụ Windows Event Log KHÔNG chấp nhận?',
        options: [
          '*[EventData[Data[@Name=\'TargetUserName\' and contains(., \'adm\')]]]|||*[EventData[Data[@Name=\'TargetUserName\' and contains(., \'adm\')]]]',
          '*[System[EventID=4625] and EventData[Data[@Name=\'SubStatus\']!=\'0xc000006a\']]|||*[System[EventID=4625] and EventData[Data[@Name=\'SubStatus\']!=\'0xc000006a\']]',
          '*[System[TimeCreated[timediff(@SystemTime) <= 3600000]]]|||*[System[TimeCreated[timediff(@SystemTime) <= 3600000]]]',
          'Event/System[EventID=4625]|||Event/System[EventID=4625]',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 5.3: a subset of XPath 1.0 — no contains()/starts-with(); timediff() and band() are Windows extras. Narrow with XPath, finish with Where-Object -like.|||VI: Bài 5.3: tập con XPath 1.0 — không có contains()/starts-with(); timediff() và band() là phần thêm của Windows. Thu hẹp bằng XPath, làm nốt bằng Where-Object -like.',
      },
      {
        question: 'In a QueryList, what does <Suppress> do?|||Trong một QueryList, <Suppress> làm gì?',
        options: [
          'Deletes matching events from the log|||Xoá sự kiện khớp khỏi log',
          'Hides matching events in Event Viewer for everyone|||Ẩn sự kiện khớp trong Event Viewer với mọi người',
          'Raises their priority|||Tăng mức ưu tiên của chúng',
          'Removes matching events from this query’s result only — which is also why changes to saved Suppress rules must be reviewed|||Chỉ loại sự kiện khớp ra khỏi kết quả của truy vấn này — cũng vì thế mà thay đổi trên các luật Suppress đã lưu phải được duyệt',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 5.3 Step 4 and the attacker’s corner: the events stay in the log; a malicious Suppress in a saved query or WEF subscription hides them from you.|||VI: Bài 5.3 Bước 4 và góc hacker: sự kiện vẫn nằm trong log; một Suppress độc hại trong truy vấn đã lưu hay subscription WEF giấu chúng khỏi bạn.',
      },
      {
        question: 'A server’s 4688 has no CommandLine field at all, yet 149 wevtutil.exe processes ran from one Logon ID within 10 seconds and a 1102 by the same Logon ID sits in the middle. Best conclusion?|||4688 của một máy chủ không hề có trường CommandLine, nhưng 149 tiến trình wevtutil.exe chạy từ cùng một Logon ID trong 10 giây và một 1102 của cùng Logon ID nằm giữa. Kết luận tốt nhất?',
        options: [
          'Nothing can be said without the command line|||Không nói được gì khi thiếu dòng lệnh',
          'A loop cleared (almost) every event log on the machine in that session|||Một vòng lặp đã xoá (gần như) mọi log sự kiện trên máy trong phiên đó',
          'Windows Update ran|||Windows Update đã chạy',
          'An admin exported logs for backup|||Một quản trị viên đã xuất log để sao lưu',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 5.4 Step 3: count per Logon ID + time window, correlate with 1102/104 and the log’s first record (01:47:07). An export would not produce a 1102.|||VI: Bài 5.4 Bước 3: đếm theo Logon ID + khung giờ, đối chiếu với 1102/104 và bản ghi đầu tiên của log (01:47:07). Xuất log thì không sinh 1102.',
      },
      {
        question: 'Kiem-DoPhu.ps1 shows 142 × 4688 without CommandLine on DESKTOP-0QT8017. What should be turned on?|||Kiem-DoPhu.ps1 cho thấy 142 × 4688 không có CommandLine trên DESKTOP-0QT8017. Cần bật gì?',
        options: [
          '"Include command line in process creation events" (ProcessCreationIncludeCmdLine_Enabled = 1)|||"Include command line in process creation events" (ProcessCreationIncludeCmdLine_Enabled = 1)',
          'The Process Creation subcategory|||Subcategory Process Creation',
          'PowerShell Script Block logging|||Log Script Block của PowerShell',
          'Sysmon Event ID 22|||Sysmon Event ID 22',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 5.5: 4688 exists, so Process Creation is already audited; the empty field is the separate command-line policy.|||VI: Bài 5.5: đã có 4688 nghĩa là Process Creation đã được kiểm toán; trường rỗng là do chính sách dòng lệnh riêng.',
      },
      {
        question: 'Sysmon ID 10: SourceImage mimikatz.exe, TargetImage lsass.exe, GrantedAccess 0x1010. What is it?|||Sysmon ID 10: SourceImage mimikatz.exe, TargetImage lsass.exe, GrantedAccess 0x1010. Đó là gì?',
        options: [
          'A normal antivirus scan|||Một lần quét bình thường của phần mềm diệt virus',
          'A process injection into lsass|||Một lần tiêm mã vào lsass',
          'lsass starting mimikatz|||lsass khởi động mimikatz',
          'Reading LSASS memory (query-limited + VM_READ) to dump credentials — T1003.001|||Đọc bộ nhớ LSASS (query-limited + VM_READ) để lấy thông tin đăng nhập — T1003.001',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 5.6: 0x1000 + 0x0010. Injection would be ID 8 (CreateRemoteThread) and rights including VM_WRITE/CREATE_THREAD.|||VI: Bài 5.6: 0x1000 + 0x0010. Tiêm mã sẽ là ID 8 (CreateRemoteThread) và quyền có VM_WRITE/CREATE_THREAD.',
      },
      {
        question: 'Sysmon ID 1: ParentImage w3wp.exe, Image cmd.exe, CommandLine "cmd.exe /c net user", User IIS APPPOOL\\DefaultAppPool. Most likely?|||Sysmon ID 1: ParentImage w3wp.exe, Image cmd.exe, CommandLine "cmd.exe /c net user", User IIS APPPOOL\\DefaultAppPool. Khả năng cao nhất?',
        options: [
          'IIS restarting itself|||IIS tự khởi động lại',
          'A web shell running commands through the web application (T1505.003)|||Một webshell chạy lệnh qua ứng dụng web (T1505.003)',
          'Windows Update|||Windows Update',
          'An administrator on RDP|||Một quản trị viên qua RDP',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 5.6 Step 4: a web server worker should not spawn shells; the account is the app pool, not a human.|||VI: Bài 5.6 Bước 4: tiến trình worker của web server không nên sinh shell; tài khoản là app pool, không phải con người.',
      },
      {
        question: 'Why do events read from a WEF collector (ForwardedEvents) often show a Message even on Linux?|||Vì sao sự kiện đọc từ máy gom WEF (ForwardedEvents) thường hiện được Message kể cả trên Linux?',
        options: [
          'Linux has the Windows DLLs|||Linux có DLL của Windows',
          'The collector translates every event to English|||Máy gom dịch mọi sự kiện sang tiếng Anh',
          'The subscription used RenderedText: the text was rendered on the source and stored in RenderingInfo|||Subscription dùng RenderedText: câu chữ được ghép trên máy nguồn và lưu trong RenderingInfo',
          'ForwardedEvents stores no data fields|||ForwardedEvents không lưu trường dữ liệu',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 5.7 Step 4: 653/653 events carry RenderingInfo (Message, Task "Logon", Keyword "Audit Failure"); the data fields are still there too.|||VI: Bài 5.7 Bước 4: 653/653 sự kiện mang RenderingInfo (Message, Task "Logon", Keyword "Audit Failure"); các trường dữ liệu vẫn còn nguyên.',
      },
    ],
  },
};
