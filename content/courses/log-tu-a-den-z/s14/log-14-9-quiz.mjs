/**
 * 14.9 — Kiểm tra Chương 14 (soạn 24/11/2026, agent lgz). 12 câu; đáp số dựa trên output thật OUT['s14/*'] (vu14/lab14 sinh bởi tao-vu.py + EVTX công khai) và attack.mitre.org v19.2 (kiểm 24/11/2026).
 * Phân bố đáp án: A ×3 (3, 6, 9) · B ×3 (1, 8, 11) · C ×3 (2, 5, 12) · D ×3 (4, 7, 10).
 */
export default {
  title: '14.9 — Chapter 14 quiz|||14.9 — Kiểm tra Chương 14',
  slug: 'log-14-9-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười hai câu đọc tình huống thật của chương: nhận ra stuffing/spraying/brute force, chọn ngưỡng đúng, giải mã 4771 và Logon Type 10 từ loopback, auid của auditd, phiên mồ côi, tệp log bị viết lại, 1102, chuẩn hoá thời gian, số ATT&CK hiện hành, vì sao một quy tắc Sigma im lặng, và gắn kỹ thuật cho Lab 14.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Quiz</span>
<h2>Investigating with logs</h2>
<p class="lead">Twelve questions built on the real output of this chapter. For each, name the log line or field that proves your answer.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can tell brute force, spraying and stuffing apart by their shape, and choose a threshold for each.</li>
<li>I can build a baseline and list first-seen logons; I know the limits of impossible travel.</li>
<li>I can find escalation and persistence in auth.log, auditd and Windows events, and use auid.</li>
<li>I can prove that logs were deleted: central copy, orphans, gaps, file metadata, 1102/104.</li>
<li>I can build a UTC timeline with evidence, map it to ATT&amp;CK v19.2, and read a Sigma rule's filters.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Kiểm tra</span>
<h2>Điều tra bằng log</h2>
<p class="lead">Mười hai câu dựa trên output thật của chương. Với mỗi câu, chỉ ra dòng log hoặc trường chứng minh câu trả lời của bạn.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi phân biệt được brute force, spraying và stuffing qua hình dạng, và chọn được ngưỡng cho từng loại.</li>
<li>Tôi dựng được đường nền và liệt kê lần đăng nhập "lần đầu thấy"; biết giới hạn của impossible travel.</li>
<li>Tôi tìm được leo thang và bám trụ trong auth.log, auditd và sự kiện Windows, và dùng được auid.</li>
<li>Tôi chứng minh được log đã bị xoá: bản trung tâm, mồ côi, khoảng lặng, siêu dữ liệu tệp, 1102/104.</li>
<li>Tôi dựng được dòng thời gian UTC có bằng chứng, gắn ATT&amp;CK v19.2, và đọc được filter của quy tắc Sigma.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 1200,
    questions: [
      {
        question: 'In one hour: 598 failed logins, 40 IPs, 598 different accounts each tried once, 242 of them do not exist. What is it?|||Trong một giờ: 598 lần đăng nhập hỏng, 40 IP, 598 tài khoản khác nhau mỗi tài khoản thử một lần, 242 tài khoản không tồn tại. Đó là gì?',
        options: [
          'Brute force against one account|||Brute force vào một tài khoản',
          'Credential stuffing with a leaked list|||Credential stuffing bằng danh sách bị lộ',
          'Password spraying of one common password|||Password spraying một mật khẩu phổ biến',
          'A denial-of-service attack|||Tấn công từ chối dịch vụ',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 14.1: pairs tried once each, many unknown accounts, spread over proxies = stuffing (T1110.004).|||VI: Bài 14.1: mỗi cặp thử một lần, nhiều tài khoản không tồn tại, rải qua proxy = stuffing (T1110.004).',
      },
      {
        question: 'Which threshold catches the SSH spray from 203.0.113.77 but ignores the daily Internet bots?|||Ngưỡng nào bắt được đợt rải mật khẩu SSH từ 203.0.113.77 mà bỏ qua bot Internet hằng ngày?',
        options: [
          '≥ 5 failures per IP per minute|||≥ 5 lần hỏng mỗi IP mỗi phút',
          '≥ 3 failures per account per hour|||≥ 3 lần hỏng mỗi tài khoản mỗi giờ',
          '≥ 10 distinct accounts per IP per hour|||≥ 10 tài khoản khác nhau mỗi IP mỗi giờ',
          '≥ 100 failures per day for the whole server|||≥ 100 lần hỏng mỗi ngày cho cả máy chủ',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 14.1 Step 2: only 203.0.113.77 reaches 25 and 24 distinct accounts per hour; bots try ≤ 7 times per IP.|||VI: Bài 14.1 Bước 2: chỉ 203.0.113.77 đạt 25 và 24 tài khoản khác nhau mỗi giờ; bot thử ≤ 7 lần mỗi IP.',
      },
      {
        question: 'On a domain controller, event 4771 has Status 0x18. What does the attacker learn?|||Trên domain controller, sự kiện 4771 có Status 0x18. Kẻ tấn công học được gì?',
        options: [
          'The account exists; the password was wrong|||Tài khoản có thật; mật khẩu sai',
          'The account does not exist|||Tài khoản không tồn tại',
          'The account is locked out|||Tài khoản đang bị khoá',
          'The password has expired|||Mật khẩu đã hết hạn',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 14.1 Step 3: 0x18 = bad password for a real account; 4768 0x6 = unknown name.|||VI: Bài 14.1 Bước 3: 0x18 = sai mật khẩu của tài khoản có thật; 4768 0x6 = tên không có.',
      },
      {
        question: 'A workstation shows 4624 with Logon Type 10 and IpAddress 127.0.0.1. Most likely?|||Một máy trạm có 4624 với Logon Type 10 và IpAddress 127.0.0.1. Khả năng cao nhất?',
        options: [
          'Someone logged on at the keyboard|||Ai đó đăng nhập tại bàn phím',
          'A Windows service started|||Một dịch vụ Windows khởi động',
          'A shared folder was opened|||Một thư mục chia sẻ được mở',
          'RDP came through a tunnel on the machine itself|||RDP đi qua một đường hầm trên chính máy đó',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 14.2 Step 3: RemoteInteractive from loopback = forwarded RDP (here via an SSH server running as sshd_server).|||VI: Bài 14.2 Bước 3: RemoteInteractive từ loopback = RDP được chuyển tiếp (ở đây qua máy chủ SSH chạy dưới sshd_server).',
      },
      {
        question: 'auditd records with uid=0 (root) all show auid=1001. What does auid tell you?|||Các bản ghi auditd có uid=0 (root) đều ghi auid=1001. auid cho biết gì?',
        options: [
          'Nothing — it is a random session number|||Không gì cả — đó là số phiên ngẫu nhiên',
          'That root logged in directly over SSH|||Root đã đăng nhập thẳng qua SSH',
          'The user who originally logged in (deploy), unchanged by sudo|||Người đã đăng nhập ban đầu (deploy), không đổi qua sudo',
          'The process ID of the shell|||PID của shell',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 14.3 Step 3: the audit login uid is set at login and survives sudo/su.|||VI: Bài 14.3 Bước 3: audit login uid gắn lúc đăng nhập và giữ nguyên qua sudo/su.',
      },
      {
        question: 'web01\'s auth.log has "session opened for user deploy" by sshd[3045102] but no "Accepted" line with that PID. Best explanation?|||auth.log của web01 có "session opened for user deploy" của sshd[3045102] nhưng không có dòng "Accepted" cùng PID. Giải thích hợp lý nhất?',
        options: [
          'Lines were deleted, but not all of them|||Các dòng đã bị xoá, nhưng không hết',
          'Normal for public-key logons|||Bình thường với đăng nhập bằng khoá',
          'sshd crashed|||sshd bị sập',
          'Clock skew reordered the lines|||Lệch đồng hồ làm đảo thứ tự dòng',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 14.4 Step 2: the attacker removed lines with the IP; the session line has no IP — an orphan.|||VI: Bài 14.4 Bước 2: kẻ tấn công xoá các dòng chứa IP; dòng session không có IP — thành mồ côi.',
      },
      {
        question: 'stat shows auth.log was "born" at 02:23:05 last night, while syslog was born on the 1st at rotation. What does it suggest?|||stat cho thấy auth.log "sinh" lúc 02:23:05 đêm qua, còn syslog sinh ngày 1 lúc xoay log. Điều đó gợi ý gì?',
        options: [
          'logrotate ran early|||logrotate chạy sớm',
          'The disk was full|||Đĩa bị đầy',
          'The time zone changed|||Múi giờ đã đổi',
          'The file was rewritten (e.g. sed -i creates a new inode)|||Tệp đã bị viết lại (vd. sed -i tạo inode mới)',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 14.4 Step 4: sed -i writes a new file and renames it; birth time and inode change.|||VI: Bài 14.4 Bước 4: sed -i ghi tệp mới rồi đổi tên; birth time và inode đổi.',
      },
      {
        question: 'What does Windows write when someone clears the Security log?|||Windows ghi gì khi ai đó xoá log Security?',
        options: [
          '104 in the System log|||104 trong log System',
          '1102 in the new Security log, with who did it|||1102 trong log Security mới, kèm người làm',
          'Nothing, if the user is an administrator|||Không gì cả, nếu người dùng là quản trị viên',
          '4719 audit policy change|||4719 đổi audit policy',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 14.4 Step 5: Security → 1102; any other log → 104 in System.|||VI: Bài 14.4 Bước 5: Security → 1102; log khác → 104 trong System.',
      },
      {
        question: 'The timestamp in "audit(1795029750.764:12813)" is…|||Mốc thời gian trong "audit(1795029750.764:12813)" là…',
        options: [
          'Unix seconds, in UTC|||Giây Unix, theo UTC',
          'Local time of the server|||Giờ địa phương của máy chủ',
          'Milliseconds since boot|||Mili giây từ lúc khởi động',
          'A Windows FILETIME|||Một FILETIME của Windows',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 14.5 Step 1: epoch seconds (UTC); 12813 is the event serial that joins SYSCALL/PATH records.|||VI: Bài 14.5 Bước 1: giây epoch (UTC); 12813 là số thứ tự sự kiện dùng ghép các bản ghi SYSCALL/PATH.',
      },
      {
        question: 'In ATT&CK v19.2, "Clear Linux or Mac System Logs" is…|||Trong ATT&CK v19.2, "Clear Linux or Mac System Logs" là…',
        options: [
          'T1070.001',
          'T1562.012',
          'T1070.003',
          'T1685.006',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 14.6: renumbered from T1070.002 (tactic Defense Impairment); T1070.003 is Clear Command History.|||VI: Bài 14.6: đánh số lại từ T1070.002 (chiến thuật Defense Impairment); T1070.003 là Clear Command History.',
      },
      {
        question: 'The Sigma rule "Suspicious Failed Logon Reasons" found 0 events although two 4625 have SubStatus 0xC0000072. Why?|||Quy tắc Sigma "Suspicious Failed Logon Reasons" ra 0 dù có hai 4625 với SubStatus 0xC0000072. Vì sao?',
        options: [
          'The rule looks at Event ID 4624 only|||Quy tắc chỉ xét Event ID 4624',
          'Its filter SubjectUserSid S-1-0-0 removes network logons|||Filter SubjectUserSid S-1-0-0 loại các đăng nhập qua mạng',
          'The rule is disabled by default|||Quy tắc bị tắt mặc định',
          'SubStatus is compared case-sensitively|||SubStatus được so phân biệt hoa thường',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 14.7: both attempts came over SMB with a null subject; the filter that reduces noise also creates a blind spot.|||VI: Bài 14.7: cả hai lần đến qua SMB với chủ thể rỗng; filter giảm nhiễu cũng tạo ra điểm mù.',
      },
      {
        question: 'Lab 14: "crontab[…]: (www-data) REPLACE" then "(www-data) CMD (/var/tmp/.cache/kthreadd …)" every minute. Which pair of techniques?|||Lab 14: "crontab[…]: (www-data) REPLACE" rồi "(www-data) CMD (/var/tmp/.cache/kthreadd …)" mỗi phút. Cặp kỹ thuật nào?',
        options: [
          'T1110.001 + T1078',
          'T1543.002 + T1685',
          'T1053.003 + T1036.005',
          'T1505.003 + T1041',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lab 14 Q7: cron persistence (T1053.003) + a kernel-thread name in a hidden folder (T1036.005); the miner itself is T1496.001.|||VI: Lab 14 câu 7: bám trụ bằng cron (T1053.003) + tên luồng nhân trong thư mục ẩn (T1036.005); bản thân trình đào là T1496.001.',
      },
    ],
  },
};
