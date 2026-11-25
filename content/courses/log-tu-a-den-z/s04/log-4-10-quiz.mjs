/**
 * 4.10 — Kiểm tra Chương 4 (soạn 24/11/2026, agent lgz). 15 câu; đáp số dựa trên output thật OUT['s04/*'] (bộ EVTX mẫu công khai).
 * Phân bố đáp án: A ×4 (3, 7, 11, 15) · B ×4 (1, 5, 9, 13) · C ×4 (2, 6, 10, 14) · D ×3 (4, 8, 12).
 */
export default {
  title: '4.10 — Chapter 4 quiz|||4.10 — Kiểm tra Chương 4',
  slug: 'log-4-10-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười lăm câu đọc sự kiện thật và đoán chuyện gì đã xảy ra: Logon Type, Sub Status, Logon ID, split token, đoán mật khẩu SMB, cờ UAC, 4740, 1102/104, 4719, chuỗi tắt sạch, Kernel-Power 41, dịch vụ named pipe, 4688 thiếu dòng lệnh, chiếm phiên RDP, loại trừ Defender.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>The event IDs you must know</h2>
<p class="lead">Fifteen questions built on the real sample events of this chapter. For each one, name the field that proves your answer.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read Logon Type, Sub Status and Logon ID of 4624/4625 and follow a session.</li>
<li>I can read an account's history (4720/4722/4738/4732/4726) and decode UAC flags.</li>
<li>I know the five tampering signals (1102, 104, 7040 on EventLog, 4719, 4616).</li>
<li>I can tell a clean restart from a crash or power loss.</li>
<li>I can spot PsExec, a malicious service, a suspicious task, RDP hijacking and a Defender exclusion in the logs.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Những mã sự kiện phải thuộc</h2>
<p class="lead">Mười lăm câu dựa trên các sự kiện mẫu thật của chương. Với mỗi câu, gọi tên trường chứng minh câu trả lời của bạn.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được Logon Type, Sub Status và Logon ID của 4624/4625 và lần theo một phiên.</li>
<li>Tôi đọc được lịch sử một tài khoản (4720/4722/4738/4732/4726) và giải mã cờ UAC.</li>
<li>Tôi biết năm dấu hiệu can thiệp (1102, 104, 7040 trên EventLog, 4719, 4616).</li>
<li>Tôi phân biệt được khởi động lại sạch với sập máy hoặc mất điện.</li>
<li>Tôi nhận ra PsExec, dịch vụ độc, tác vụ đáng ngờ, chiếm phiên RDP và loại trừ Defender trong log.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 1200,
    questions: [
      {
        question: 'A 4624 shows LogonType 10 and IpAddress 47.190.48.109. How did the user log on?|||Một 4624 có LogonType 10 và IpAddress 47.190.48.109. Người dùng đã đăng nhập bằng cách nào?',
        options: [
          'At the keyboard of the machine|||Tại bàn phím của máy',
          'By Remote Desktop (RDP) from that address|||Bằng Remote Desktop (RDP) từ địa chỉ đó',
          'By opening a shared folder over SMB|||Bằng cách mở thư mục chia sẻ qua SMB',
          'As a Windows service starting|||Là một dịch vụ Windows đang khởi động',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 4.1: type 10 = RemoteInteractive (RDP); 2 = keyboard, 3 = network (SMB), 5 = service.|||VI: Bài 4.1: type 10 = RemoteInteractive (RDP); 2 = bàn phím, 3 = mạng (SMB), 5 = dịch vụ.',
      },
      {
        question: 'In the forwarded log, 71 × 4625 for "psadmin" from one server have Sub Status 0xC0000064. What does that code mean?|||Trong log chuyển tiếp, 71 lần 4625 cho "psadmin" từ một máy chủ có Sub Status 0xC0000064. Mã đó nghĩa là gì?',
        options: [
          'Wrong password for an existing user|||Sai mật khẩu của một người dùng có thật',
          'The account is locked out|||Tài khoản đang bị khoá',
          'The user name does not exist|||Tên người dùng không tồn tại',
          'The account is disabled|||Tài khoản bị vô hiệu hoá',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 4.1: 0xC0000064 = bad user name; 0xC000006A wrong password, 0xC0000234 locked out, 0xC0000072 disabled. One server, steady rhythm → a task/service with a deleted account.|||VI: Bài 4.1: 0xC0000064 = tên người dùng sai; 0xC000006A sai mật khẩu, 0xC0000234 bị khoá, 0xC0000072 bị tắt. Một máy chủ, nhịp đều → tác vụ/dịch vụ dùng tài khoản đã bị xoá.',
      },
      {
        question: 'How do you find every event caused by the RDP session that started with 4624 TargetLogonId 0x7ac7caf?|||Làm sao tìm mọi sự kiện do phiên RDP bắt đầu bằng 4624 có TargetLogonId 0x7ac7caf gây ra?',
        options: [
          'Filter events whose SubjectLogonId (or TargetLogonId for logoff) is 0x7ac7caf|||Lọc các sự kiện có SubjectLogonId (hoặc TargetLogonId với đăng xuất) bằng 0x7ac7caf',
          'Filter events with the same EventRecordID|||Lọc các sự kiện có cùng EventRecordID',
          'Filter events with the same IpAddress only|||Chỉ lọc các sự kiện có cùng IpAddress',
          'Take all events within 5 minutes after the logon|||Lấy mọi sự kiện trong 5 phút sau lần đăng nhập',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 4.1: the Logon ID ties the session together — 4672, 4798, 4732 and the 4647 sign-out 1 h 44 min later all carry 0x7ac7caf.|||VI: Bài 4.1: Logon ID buộc cả phiên lại — 4672, 4798, 4732 và lần đăng xuất 4647 sau 1 giờ 44 phút đều mang 0x7ac7caf.',
      },
      {
        question: 'An administrator logs on once at the keyboard, but you see two 4624 at the same millisecond, one with ElevatedToken %%1842 and one with %%1843, each pointing to the other. Why?|||Một quản trị viên đăng nhập một lần tại bàn phím, nhưng bạn thấy hai 4624 cùng mili giây, một cái ElevatedToken %%1842 và một cái %%1843, cái này trỏ sang cái kia. Vì sao?',
        options: [
          'Someone else logged on at the same time|||Có người khác đăng nhập cùng lúc',
          'The log is duplicated by forwarding|||Log bị nhân đôi do chuyển tiếp',
          'A pass-the-hash attack|||Một vụ tấn công pass-the-hash',
          'UAC split token: one elevated and one limited logon, linked by TargetLinkedLogonId|||Split token của UAC: một phiên nâng quyền và một phiên giới hạn, nối nhau qua TargetLinkedLogonId',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 4.1, records 10512/10513: Linked points to each other; %%1842 = Yes (elevated), %%1843 = No. Count it as one logon.|||VI: Bài 4.1, bản ghi 10512/10513: Linked trỏ vào nhau; %%1842 = Yes (nâng quyền), %%1843 = No. Đếm là một lần đăng nhập.',
      },
      {
        question: '3 561 × 4625 in 2 minutes 43 seconds from one IP, type 3, Administrator, a different random WorkstationName each time. What is it?|||3 561 lần 4625 trong 2 phút 43 giây từ một IP, type 3, Administrator, mỗi lần một WorkstationName ngẫu nhiên khác nhau. Đó là gì?',
        options: [
          'A user who forgot the password|||Một người dùng quên mật khẩu',
          'An automated password-guessing tool over SMB (T1110.001)|||Một công cụ tự động đoán mật khẩu qua SMB (T1110.001)',
          'A service with an old password|||Một dịch vụ dùng mật khẩu cũ',
          'A domain controller replication error|||Lỗi đồng bộ của domain controller',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 4.1: ~22 attempts per second is no human; the random client name is a tool fingerprint. Watch for the first 4624 from that IP.|||VI: Bài 4.1: ~22 lần mỗi giây thì không phải người; tên máy khách ngẫu nhiên là dấu vân tay của công cụ. Canh 4624 đầu tiên từ IP đó.',
      },
      {
        question: 'A 4738 shows OldUacValue 0x15 → NewUacValue 0x210 with %%2048 %%2050 %%2089. What changed?|||Một 4738 có OldUacValue 0x15 → NewUacValue 0x210 kèm %%2048 %%2050 %%2089. Cái gì đã đổi?',
        options: [
          'The account was disabled and its password removed|||Tài khoản bị tắt và mật khẩu bị gỡ',
          'The account was renamed|||Tài khoản bị đổi tên',
          'Enabled, password now required, and password set to never expire|||Được bật, giờ phải có mật khẩu, và mật khẩu đặt không bao giờ hết hạn',
          'The account was added to Administrators|||Tài khoản được thêm vào Administrators',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 4.2: %%(2048+n) = bit n off, %%(2080+n) = bit n on; bit 0 disabled, bit 2 password not required, bit 9 don\u2019t expire password.|||VI: Bài 4.2: %%(2048+n) = tắt bit n, %%(2080+n) = bật bit n; bit 0 bị tắt, bit 2 không cần mật khẩu, bit 9 mật khẩu không hết hạn.',
      },
      {
        question: 'An account keeps getting locked every morning. In 4740 on the domain controller, which field tells you which machine caused it?|||Một tài khoản sáng nào cũng bị khoá. Trong 4740 trên domain controller, trường nào cho biết máy nào gây ra?',
        options: [
          'Caller Computer Name (TargetDomainName in the XML)|||Caller Computer Name (TargetDomainName trong XML)',
          'Computer in the System part|||Computer trong phần System',
          'SubjectUserName|||SubjectUserName',
          'EventRecordID|||EventRecordID',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 4.2: Computer is the DC that wrote the event; Caller Computer Name is the source of the bad attempts (old phone, mapped drive, service).|||VI: Bài 4.2: Computer là DC đã ghi sự kiện; Caller Computer Name là nguồn các lần thử sai (điện thoại cũ, ổ mạng, dịch vụ).',
      },
      {
        question: 'An attacker clears the Security log and then the Application log. Which events are written?|||Kẻ tấn công xoá log Security rồi log Application. Những sự kiện nào được ghi?',
        options: [
          'Nothing — clearing leaves no trace|||Không gì cả — xoá log không để lại dấu',
          '104 in Security and 1102 in Application|||104 trong Security và 1102 trong Application',
          '6006 in System for both|||6006 trong System cho cả hai',
          '1102 in the new Security log, and 104 in System naming "Application"|||1102 trong log Security mới, và 104 trong System ghi tên "Application"',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 4.3: 1102 is the first record of the cleared Security log (with Subject and Logon ID); every other cleared log gets a 104 in System with data.Channel.|||VI: Bài 4.3: 1102 là bản ghi đầu tiên của log Security đã xoá (kèm Subject và Logon ID); mọi log khác bị xoá có một 104 trong System kèm data.Channel.',
      },
      {
        question: 'Thirty 4719 events in the same second by user admmig, each with AuditPolicyChanges %%8448, %%8450 (Logon, Process Creation, User Account Management…). What happened?|||Ba mươi sự kiện 4719 trong cùng một giây do admmig, mỗi cái có AuditPolicyChanges %%8448, %%8450 (Logon, Process Creation, User Account Management…). Chuyện gì đã xảy ra?',
        options: [
          'Group Policy refreshed normally|||Group Policy làm mới bình thường',
          'Auditing was switched off for those subcategories (success and failure removed)|||Kiểm toán bị tắt cho các nhóm con đó (gỡ cả thành công lẫn thất bại)',
          'Auditing was switched on for more events|||Kiểm toán được bật thêm cho nhiều sự kiện',
          'The Security log was cleared|||Log Security bị xoá',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 4.3: %%8448 Success removed, %%8450 Failure removed; a person doing it to many subcategories at once = auditpol /clear. Normal 4719 come from the computer account at boot/GPO.|||VI: Bài 4.3: %%8448 Success removed, %%8450 Failure removed; một người làm vậy với nhiều nhóm con cùng lúc = auditpol /clear. 4719 bình thường đến từ tài khoản máy lúc khởi động/áp GPO.',
      },
      {
        question: 'Which order is a clean restart requested by Windows Update?|||Thứ tự nào là một lần khởi động lại sạch do Windows Update yêu cầu?',
        options: [
          '41 → 6008 → 6005|||41 → 6008 → 6005',
          '6005 → 1074 → 6006|||6005 → 1074 → 6006',
          '1074 → 6006 → 13 → 12 → 6005|||1074 → 6006 → 13 → 12 → 6005',
          '42 → 107 → 6013|||42 → 107 → 6013',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 4.4, 2-vss_7-System: 1074 by svchost (Service pack, Planned) → 6006 → 109 → 13 → 12 → 6005/6013, about 21 s of downtime. 41/6008 = unclean; 42/107 = sleep.|||VI: Bài 4.4, 2-vss_7-System: 1074 do svchost (Service pack, Planned) → 6006 → 109 → 13 → 12 → 6005/6013, gián đoạn khoảng 21 giây. 41/6008 = không sạch; 42/107 = ngủ.',
      },
      {
        question: 'After a sudden reboot you find Kernel-Power 41 with BugcheckCode 0 and PowerButtonTimestamp 0, and no System 1001. Most likely cause?|||Sau một lần khởi động lại đột ngột bạn thấy Kernel-Power 41 có BugcheckCode 0 và PowerButtonTimestamp 0, không có System 1001. Nguyên nhân nhiều khả năng nhất?',
        options: [
          'Power loss, power supply, overheating or a hard hang|||Mất điện, bộ nguồn, quá nhiệt hoặc treo cứng',
          'A blue screen caused by a driver|||Màn hình xanh do driver',
          'The user held the power button|||Người dùng giữ nút nguồn',
          'Windows Update restarted the machine|||Windows Update khởi động lại máy',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 4.4 (Microsoft Event ID 41 guide): BugcheckCode ≠ 0 = stop error, PowerButtonTimestamp ≠ 0 = button held, all zero = the machine stopped without warning.|||VI: Bài 4.4 (hướng dẫn Event ID 41 của Microsoft): BugcheckCode ≠ 0 = lỗi dừng, PowerButtonTimestamp ≠ 0 = giữ nút nguồn, tất cả bằng 0 = máy dừng không báo trước.',
      },
      {
        question: 'A 7045 installs service "hgabms" with ImagePath "cmd.exe /c echo hgabms > \\\\.\\pipe\\hgabms" as LocalSystem, followed by 7009 (timeout 30000 ms). What is it?|||Một 7045 cài dịch vụ "hgabms" có ImagePath "cmd.exe /c echo hgabms > \\\\.\\pipe\\hgabms" dưới LocalSystem, sau đó là 7009 (hết giờ 30000 ms). Đó là gì?',
        options: [
          'A driver installed by Windows|||Một driver do Windows cài',
          'A normal software update|||Một lần cập nhật phần mềm bình thường',
          'PsExec run by an administrator|||PsExec do quản trị viên chạy',
          'A fake service used to make SYSTEM connect to a named pipe (privilege escalation)|||Một dịch vụ giả để SYSTEM kết nối vào named pipe (leo thang đặc quyền)',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 4.5: cmd.exe is not a service, so the SCM times out (7009); its only job is to make SYSTEM touch the pipe. PsExec would show PSEXESVC.|||VI: Bài 4.5: cmd.exe không phải dịch vụ nên SCM hết giờ chờ (7009); nhiệm vụ duy nhất của nó là khiến SYSTEM chạm vào pipe. PsExec thì hiện PSEXESVC.',
      },
      {
        question: 'On a Windows 10 machine every 4688 has a CommandLine field, but it is always empty. Why?|||Trên một máy Windows 10, 4688 nào cũng có trường CommandLine nhưng luôn rỗng. Vì sao?',
        options: [
          'The processes had no arguments|||Các tiến trình không có tham số',
          'The policy "Include command line in process creation events" is off (default)|||Chính sách "Include command line in process creation events" đang tắt (mặc định)',
          'Sysmon is not installed|||Chưa cài Sysmon',
          'The log was cleared|||Log đã bị xoá',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 4.6: Microsoft: "By default Process Command Line field is empty." Turn on the policy (Lesson 5.5).|||VI: Bài 4.6: Microsoft: "By default Process Command Line field is empty." Hãy bật chính sách (Bài 5.5).',
      },
      {
        question: 'On server FS01: 4688 "tscon 2 /dest:rdp-tcp#8" as FS01$ (SYSTEM), then 4779 admmig on RDP-Tcp#8 and 4778 admmarsid on RDP-Tcp#8 from the same client. What happened?|||Trên máy chủ FS01: 4688 "tscon 2 /dest:rdp-tcp#8" dưới FS01$ (SYSTEM), rồi 4779 admmig trên RDP-Tcp#8 và 4778 admmarsid trên RDP-Tcp#8 từ cùng máy khách. Chuyện gì đã xảy ra?',
        options: [
          'admmig logged off normally|||admmig đăng xuất bình thường',
          'A network glitch reconnected the session|||Mạng chập chờn làm phiên nối lại',
          'admmarsid\u2019s session was hijacked into admmig\u2019s RDP connection without a password (T1563.002)|||Phiên của admmarsid bị chiếm và gắn vào kết nối RDP của admmig mà không cần mật khẩu (T1563.002)',
          'admmarsid brute-forced admmig\u2019s password|||admmarsid dò ra mật khẩu của admmig',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 4.7: same SessionName/ClientName, different AccountName, tscon as SYSTEM just before = RDP hijacking.|||VI: Bài 4.7: cùng SessionName/ClientName, khác AccountName, ngay trước đó có tscon dưới SYSTEM = chiếm phiên RDP.',
      },
      {
        question: 'Defender 5007: New Value "HKLM\\SOFTWARE\\Microsoft\\Windows Defender\\Exclusions\\Paths\\C:\\TOOLS\\mimikatz = 0x0". What does it mean?|||Defender 5007: New Value "HKLM\\SOFTWARE\\Microsoft\\Windows Defender\\Exclusions\\Paths\\C:\\TOOLS\\mimikatz = 0x0". Nghĩa là gì?',
        options: [
          'The folder C:\\TOOLS\\mimikatz is no longer scanned — Defender was blinded there|||Thư mục C:\\TOOLS\\mimikatz không còn bị quét — Defender bị bịt mắt ở đó',
          'Defender quarantined mimikatz|||Defender đã cách ly mimikatz',
          'Real-time protection was turned off|||Bảo vệ thời gian thực bị tắt',
          'Tamper Protection blocked a change|||Tamper Protection đã chặn một thay đổi',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 4.8: 5007 = configuration changed; an exclusion means "do not scan here" (T1685). Quarantine = 1117, RTP off = 5001, Tamper Protection = 5013.|||VI: Bài 4.8: 5007 = đổi cấu hình; loại trừ nghĩa là "đừng quét ở đây" (T1685). Cách ly = 1117, tắt RTP = 5001, Tamper Protection = 5013.',
      },
    ],
  },
};
