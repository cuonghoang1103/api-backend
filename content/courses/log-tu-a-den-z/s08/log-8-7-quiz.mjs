/**
 * 8.7 — Kiểm tra Chương 8 (soạn 24/11/2026, agent lgz). 10 câu; mọi đáp số dựa trên output thật OUT['s08/*'] (máy ảo lab7 + keodo).
 * Phân bố đáp án: A ×2 (4, 9) · B ×3 (1, 5, 8) · C ×3 (2, 6, 10) · D ×2 (3, 7).
 */
export default {
  title: '8.7 — Chapter 8 quiz|||8.7 — Kiểm tra Chương 8',
  slug: 'log-8-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu: máy Ubuntu không có auth.log, đọc PRI, thứ tự tệp trong rsyslog.d và stop, UDP khi máy nhận đơ, Invalid user, bẫy sudo grep tự khớp, auid qua sudo, auditd bị dừng trên Ubuntu, copytruncate mất dòng, tệp đã xoá mà đĩa vẫn đầy.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>/var/log, rsyslog, auth logs, auditd and logrotate</h2>
<p class="lead">Ten questions built on the real output of lab7 and keodo. For each one, ask: which program wrote this line, and can it be trusted?</p>
<h3>Self-check before you start</h3>
<ul>
<li>I check who writes logs on a machine before I look for files.</li>
<li>I can decode a PRI and write a selector, and I know rules run in file-name order.</li>
<li>I can tell a nonexistent account from a wrong password in sshd lines, and count without matching my own commands.</li>
<li>I know what auid is and why auditd answers "which human" better than auth.log.</li>
<li>I can explain create + postrotate vs copytruncate with file descriptors.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>/var/log, rsyslog, log xác thực, auditd và logrotate</h2>
<p class="lead">Mười câu dựa trên output thật của lab7 và keodo. Với mỗi câu, tự hỏi: chương trình nào viết dòng này, và tin được tới đâu?</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi kiểm ai đang ghi log trên máy trước khi đi tìm tệp.</li>
<li>Tôi giải mã được PRI, viết được selector, và biết luật chạy theo thứ tự tên tệp.</li>
<li>Tôi phân biệt được tài khoản không tồn tại với sai mật khẩu trong dòng sshd, và đếm mà không khớp lệnh của chính mình.</li>
<li>Tôi biết auid là gì và vì sao auditd trả lời câu "con người nào" tốt hơn auth.log.</li>
<li>Tôi giải thích được create + postrotate so với copytruncate bằng mã mô tả tệp.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'On a fresh Ubuntu 24.04 cloud VM, "ls /var/log/auth.log" says "No such file or directory". What is the right conclusion?|||Trên một máy ảo cloud Ubuntu 24.04 mới, "ls /var/log/auth.log" báo "No such file or directory". Kết luận đúng là gì?',
        options: [
          'Nobody has logged in yet, so the file was never created|||Chưa ai đăng nhập nên tệp chưa từng được tạo',
          'rsyslog is not installed; login events are in the journal (journalctl -t sshd / _COMM=sshd)|||rsyslog chưa được cài; sự kiện đăng nhập nằm trong journal (journalctl -t sshd / _COMM=sshd)',
          'Logging is disabled by sshd_config|||Ghi log đã bị tắt trong sshd_config',
          'The file is in /var/log/secure on Ubuntu|||Trên Ubuntu tệp nằm ở /var/log/secure',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: In 8.1, systemctl status rsyslog said "could not be found", yet journalctl -t sshd showed Accepted lines. After apt install rsyslog, auth.log appeared. Always check who writes logs first.|||VI: Ở Bài 8.1, systemctl status rsyslog báo "could not be found", nhưng journalctl -t sshd vẫn hiện các dòng Accepted. Cài rsyslog xong thì auth.log xuất hiện. Luôn kiểm ai đang ghi log trước.',
      },
      {
        question: 'A raw syslog packet starts with <155>. Which facility and severity is it?|||Một gói syslog thô bắt đầu bằng <155>. Đó là facility và severity nào?',
        options: [
          'auth.notice|||auth.notice',
          'daemon.err|||daemon.err',
          'local3.err|||local3.err',
          'local5.warning|||local5.warning',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: PRI = facility × 8 + severity. 155 = 19 × 8 + 3; facility 19 = local3, severity 3 = err. That was our logger -p local3.err line in 8.2.|||VI: PRI = facility × 8 + severity. 155 = 19 × 8 + 3; facility 19 = local3, severity 3 = err. Đó là dòng logger -p local3.err của ta ở Bài 8.2.',
      },
      {
        question: 'You add /etc/rsyslog.d/90-gui-di.conf with "*.* action(type="omfwd" …)". user.err lines reach the server, local3 lines do not. 30-shop.conf ends with "local3.* stop". Why?|||Bạn thêm /etc/rsyslog.d/90-gui-di.conf với "*.* action(type="omfwd" …)". Dòng user.err tới máy nhận, dòng local3 thì không. 30-shop.conf kết thúc bằng "local3.* stop". Vì sao?',
        options: [
          'omfwd cannot forward local facilities|||omfwd không chuyển được các facility local',
          'The server drops local3 by default|||Máy nhận mặc định bỏ local3',
          'UDP lost the local3 packets|||UDP làm mất các gói local3',
          'Files are processed in name order: 30-shop.conf stops local3 before 90-gui-di.conf is reached|||Tệp được xử lý theo thứ tự tên: 30-shop.conf dừng local3 trước khi tới 90-gui-di.conf',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Renaming the file to 20-gui-di.conf made the local3 line arrive. "stop" discards the message for all later rules and files.|||VI: Đổi tên thành 20-gui-di.conf thì dòng local3 tới nơi. "stop" bỏ thông điệp với mọi luật và tệp phía sau.',
      },
      {
        question: 'The log server process was frozen (kill -STOP) while 200,000 lines were sent by UDP. 217 arrived. What did the sender see?|||Tiến trình máy chủ log bị làm đơ (kill -STOP) trong lúc gửi 200.000 dòng qua UDP. Tới nơi 217 dòng. Bên gửi thấy gì?',
        options: [
          'Nothing: it reported "sent 200000 lines in 0.30 s" — UDP gives no delivery feedback|||Không gì cả: nó báo "gửi 200000 dòng trong 0.30 s" — UDP không phản hồi việc tới nơi',
          'An error for each lost line|||Một lỗi cho mỗi dòng mất',
          'It blocked for as long as the server was frozen|||Nó bị chặn suốt thời gian máy nhận đơ',
          'It automatically retried over TCP|||Nó tự động thử lại qua TCP',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Blocking is what TCP did (5.05 s instead of 0.26 s, 0 lost). UDP loses silently — use TCP with a queue, or RELP.|||VI: Bị chặn là chuyện của TCP (5.05 s thay vì 0.26 s, mất 0). UDP mất âm thầm — dùng TCP có hàng đợi, hoặc RELP.',
      },
      {
        question: 'What do "Invalid user postgres from 192.168.56.88" followed by "Failed password for invalid user postgres" tell you?|||"Invalid user postgres from 192.168.56.88" rồi "Failed password for invalid user postgres" cho bạn biết gì?',
        options: [
          'The postgres account exists but is locked|||Tài khoản postgres có tồn tại nhưng đã bị khoá',
          'There is no account named postgres on this machine: someone is guessing names|||Máy này không có tài khoản tên postgres: ai đó đang đoán tên',
          'The database server rejected a login|||Máy chủ CSDL đã từ chối một lần đăng nhập',
          'The password was correct but the key was missing|||Mật khẩu đúng nhưng thiếu khoá',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: sshd still asks for a password for nonexistent names so the attacker cannot tell real names from fake ones. "Failed password for root" (no "invalid user") means the account exists.|||VI: sshd vẫn hỏi mật khẩu cho tên không tồn tại để kẻ dò không phân biệt được tên thật với tên giả. "Failed password for root" (không có "invalid user") nghĩa là tài khoản có thật.',
      },
      {
        question: 'Running "sudo grep -c \'Failed password\' /var/log/auth.log" three times gives 196, 197, 198 with no attack going on. Why?|||Chạy "sudo grep -c \'Failed password\' /var/log/auth.log" ba lần ra 196, 197, 198 trong khi không có tấn công nào. Vì sao?',
        options: [
          'grep counts are approximate on large files|||Số đếm của grep chỉ gần đúng trên tệp lớn',
          'rsyslog is still flushing old lines|||rsyslog vẫn đang đẩy dòng cũ xuống',
          'sudo logs its own command line, which contains "Failed password", so each run adds a matching line|||sudo ghi chính dòng lệnh của nó, mà dòng lệnh chứa "Failed password", nên mỗi lần chạy thêm một dòng khớp',
          'The attacker is still connected|||Kẻ tấn công vẫn đang kết nối',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The last match was "sudo: hv : … COMMAND=/usr/bin/grep \'Failed password\' …". Anchor on the program (sshd\\[[0-9]*\\]: Failed password) and count on a copy of the window.|||VI: Dòng khớp cuối là "sudo: hv : … COMMAND=/usr/bin/grep \'Failed password\' …". Neo vào chương trình (sshd\\[[0-9]*\\]: Failed password) và đếm trên bản chép của cửa sổ thời gian.',
      },
      {
        question: 'User an runs "sudo bash -c \'… > /etc/sudoers.d/dev\'". ausearch -k sudoers --format text shows "an, acting as root, successfully opened-file /etc/sudoers.d/dev using bash". Which audit field keeps the name "an"?|||Người dùng an chạy "sudo bash -c \'… > /etc/sudoers.d/dev\'". ausearch -k sudoers --format text hiện "an, acting as root, successfully opened-file /etc/sudoers.d/dev using bash". Trường audit nào giữ cái tên "an"?',
        options: [
          'uid|||uid',
          'euid|||euid',
          'comm|||comm',
          'auid — the login UID set at login and unchanged by sudo/su|||auid — UID đăng nhập, đặt lúc đăng nhập và không đổi qua sudo/su',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: uid and euid became root; comm is "bash". auid stays the human. That is why audit answers "who did it" after sudo.|||VI: uid và euid đã thành root; comm là "bash". auid giữ nguyên con người. Đó là lý do audit trả lời được "ai làm" sau sudo.',
      },
      {
        question: 'After "auditctl -e 2", an attacker with root runs "systemctl stop auditd" on Ubuntu 24.04 and then touches a file in /etc/sudoers.d. What do you find later?|||Sau "auditctl -e 2", kẻ có root chạy "systemctl stop auditd" trên Ubuntu 24.04 rồi tạo một tệp trong /etc/sudoers.d. Về sau bạn tìm thấy gì?',
        options: [
          'Nothing changes: -e 2 makes the daemon impossible to stop|||Không có gì khác: -e 2 làm dịch vụ không thể dừng',
          'No event for the file; only the gap between DAEMON_END and DAEMON_START (and rate-limited kernel messages)|||Không có sự kiện nào cho tệp đó; chỉ còn khoảng trống giữa DAEMON_END và DAEMON_START (và thông điệp nhân bị giới hạn tốc độ)',
          'The full event in audit.log, written by the kernel directly|||Sự kiện đầy đủ trong audit.log, do nhân ghi thẳng',
          'The event in auth.log instead|||Sự kiện nằm ở auth.log thay vào đó',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: -e 2 locks rules, not the daemon. Ubuntu has RefuseManualStop=no; the touched file was not found by ausearch, only the deletion after restart. Rocky sets RefuseManualStop=yes. Alert on DAEMON_END and ship records off the host.|||VI: -e 2 khoá quy tắc, không khoá dịch vụ. Ubuntu đặt RefuseManualStop=no; ausearch không tìm thấy tệp đã tạo, chỉ thấy lần xoá sau khi bật lại. Rocky đặt RefuseManualStop=yes. Cảnh báo khi có DAEMON_END và gửi bản ghi ra khỏi máy.',
      },
      {
        question: 'An app opens its log file once and writes 140,000 lines/s. The logrotate rule uses copytruncate. What did we measure?|||Một ứng dụng mở tệp log một lần và ghi 140.000 dòng/giây. Luật logrotate dùng copytruncate. Ta đã đo được gì?',
        options: [
          'About 2,000 lines lost — written between the copy and the truncate|||Khoảng 2.000 dòng mất — ghi giữa lúc chép và lúc cắt',
          '0 lines lost, because copytruncate is atomic|||Mất 0 dòng, vì copytruncate là nguyên tử',
          'All new lines went into app.log.1|||Mọi dòng mới đi vào app.log.1',
          'The app crashed with "file not found"|||Ứng dụng sập vì "file not found"',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lines 438,001–440,000 were in neither file. "All new lines went into app.log.1" is version A (create without postrotate). create + postrotate HUP lost 0.|||VI: Các dòng 438.001–440.000 không nằm ở tệp nào. "Mọi dòng mới vào app.log.1" là bản A (create mà không postrotate). create + postrotate HUP mất 0.',
      },
      {
        question: 'Someone ran "rm /var/log/shopapp/app.log" to free space, but df keeps growing. What fixes it without losing the app?|||Ai đó chạy "rm /var/log/shopapp/app.log" để lấy chỗ, nhưng df vẫn tăng. Cách nào sửa mà không mất ứng dụng?',
        options: [
          'Run rm again with -f|||Chạy lại rm với -f',
          'Delete everything in /var/log|||Xoá hết trong /var/log',
          'Find the deleted-but-open descriptor (find /proc/*/fd -lname "*(deleted)" or lsof +L1) and make the app reopen its log (SIGHUP) or restart it|||Tìm mã mô tả của tệp đã xoá mà còn mở (find /proc/*/fd -lname "*(deleted)" hoặc lsof +L1) rồi bảo ứng dụng mở lại log (SIGHUP) hoặc khởi động lại nó',
          'Run logrotate -f|||Chạy logrotate -f',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: In 8.5 usage went 958 → 971 MB after rm, and fell to 938 MB only after SIGHUP closed the old descriptor. Next time truncate with ": > file" instead of rm.|||VI: Ở Bài 8.5, dung lượng dùng tăng 958 → 971 MB sau rm, và chỉ giảm về 938 MB khi SIGHUP đóng mã mô tả cũ. Lần sau cắt bằng ": > tệp" thay vì rm.',
      },
    ],
  },
};
