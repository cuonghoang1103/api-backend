/**
 * 6.7 — Kiểm tra Chương 6 (soạn 25/11/2026, agent Mac tiếp quản lgz). 8 câu; mọi đáp số dựa trên output thật của OUT['s06/*'] (MacBook macOS 27.2.1).
 * Phân bố đáp án: A ×2 (2, 7) · B ×2 (1, 5) · C ×2 (4, 8) · D ×2 (3, 6).
 */
export default {
  title: '6.7 — Chapter 6 quiz|||6.7 — Kiểm tra Chương 6',
  slug: 'log-6-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Tám câu: lệnh log trong script zsh, mức debug có được lưu không, <private> và cái bẫy hằng số, CONTAINS phân biệt hoa thường, đọc báo cáo .ips (exit 133 = SIGTRAP), dòng sudo giả viết bằng logger, chữ "crash" trong last, giữ log bao lâu trên Mac.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>macOS: unified logging, Console and security logs</h2>
<p class="lead">Eight questions built on the real output of the lab MacBook. For each one, ask yourself which field, which level or which log the answer depends on.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain which levels are stored and why a debug line can vanish.</li>
<li>I know why messages show &lt;private&gt; and how a developer controls it.</li>
<li>I can write a predicate with process/subsystem/messageType and case-insensitive text.</li>
<li>I can read a crash report's exception, termination and faulting frame.</li>
<li>I can tell a fake log line from a real one and corroborate "crash" in <code>last</code>.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>macOS: unified logging, Console và log bảo mật</h2>
<p class="lead">Tám câu dựa trên output thật của MacBook lab. Với mỗi câu, tự hỏi đáp án phụ thuộc vào trường nào, mức nào hay log nào.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được mức nào được lưu và vì sao một dòng debug có thể biến mất.</li>
<li>Tôi biết vì sao thông điệp hiện &lt;private&gt; và lập trình viên điều khiển nó thế nào.</li>
<li>Tôi viết được predicate với process/subsystem/messageType và tìm chữ không phân biệt hoa thường.</li>
<li>Tôi đọc được exception, termination và khung gây lỗi của một báo cáo crash.</li>
<li>Tôi phân biệt được dòng log giả với dòng thật và đối chứng chữ "crash" trong <code>last</code>.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: 'A #!/bin/zsh deploy script runs "log show --last 5m" and fails with "too many arguments", although the same line works in Terminal. Why?|||Một script deploy #!/bin/zsh chạy "log show --last 5m" và báo "too many arguments", trong khi cùng dòng đó chạy được trong Terminal. Vì sao?',
        options: [
          'The script needs sudo to read the unified log|||Script cần sudo mới đọc được unified log',
          'In a non-interactive zsh, "log" is zsh’s builtin; /etc/zshrc disables it only for interactive shells — call /usr/bin/log|||Trong zsh không tương tác, "log" là lệnh dựng sẵn của zsh; /etc/zshrc chỉ tắt nó cho shell tương tác — hãy gọi /usr/bin/log',
          '--last does not accept minutes in scripts|||--last không nhận phút khi chạy trong script',
          'The unified log is disabled while a script runs|||Unified log bị tắt khi có script đang chạy',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: zsh -f -c \'type log\' printed "log is a shell builtin"; Terminal printed "/usr/bin/log" because /etc/zshrc line 13 says "disable log". Scripts do not read /etc/zshrc.|||VI: zsh -f -c \'type log\' in "log is a shell builtin"; Terminal in "/usr/bin/log" vì dòng 13 của /etc/zshrc là "disable log". Script không đọc /etc/zshrc.',
      },
      {
        question: 'You emit one message at each level, with "log stream --level debug" running. Afterwards, "log show --last 1m --info --debug" returns the info line but not the debug line. What does that show?|||Bạn phát một thông điệp ở mỗi mức, trong lúc "log stream --level debug" đang chạy. Sau đó "log show --last 1m --info --debug" ra dòng info nhưng không ra dòng debug. Điều đó cho thấy gì?',
        options: [
          'Debug messages are shown live but not stored by default; --debug cannot bring back what was never saved|||Thông điệp debug được hiện trực tiếp nhưng mặc định không lưu; --debug không mang lại được thứ chưa từng được lưu',
          'The stream deleted the debug message after showing it|||Luồng trực tiếp đã xoá thông điệp debug sau khi hiện',
          'Debug messages are stored in /var/log/system.log instead|||Thông điệp debug được lưu ở /var/log/system.log',
          '--debug must come before --info to work|||--debug phải đứng trước --info mới có tác dụng',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: The stream printed "Db … debug: chi thay khi dang stream"; the show a second later returned only the header line. Info stays in memory (seen with --info); default/error/fault go to disk.|||VI: Luồng in "Db … debug: chi thay khi dang stream"; lệnh show một giây sau chỉ ra dòng tiêu đề. Info ở RAM (thấy bằng --info); default/error/fault xuống đĩa.',
      },
      {
        question: 'A Swift app logs notice("email=\\(email)") with an email read at run time, and notice("support: \\(supportEmail)") where supportEmail is a string literal constant. What did log show print on our Mac?|||Một ứng dụng Swift ghi notice("email=\\(email)") với email đọc lúc chạy, và notice("support: \\(supportEmail)") với supportEmail là hằng chuỗi viết sẵn. log show trên máy của ta in ra gì?',
        options: [
          'Both values in clear, because notice is a public level|||Cả hai giá trị đều hiện rõ, vì notice là mức công khai',
          'Both <private>|||Cả hai đều là <private>',
          'The runtime email in clear, the constant <private>|||Email lúc chạy hiện rõ, hằng số thành <private>',
          'The runtime email <private>, the literal constant in clear — so mark sensitive values .private explicitly|||Email lúc chạy là <private>, hằng viết sẵn hiện rõ — vì vậy hãy tự đánh dấu .private cho giá trị nhạy cảm',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Output: "email=<private>" and "Liên hệ hỗ trợ: hotro@example.com"; with privacy: .private the constant became <private>. Do not rely on defaults; never log secrets.|||VI: Output: "email=<private>" và "Liên hệ hỗ trợ: hotro@example.com"; thêm privacy: .private thì hằng số thành <private>. Đừng dựa vào mặc định; đừng bao giờ log bí mật.',
      },
      {
        question: 'The message is "Mở CSDL thất bại: disk I/O error". Which predicate finds it?|||Thông điệp là "Mở CSDL thất bại: disk I/O error". Predicate nào tìm ra nó?',
        options: [
          'eventMessage CONTAINS "csdl"|||eventMessage CONTAINS "csdl"',
          'subsystem == com.example.shopmac AND eventMessage CONTAINS "CSDL"|||subsystem == com.example.shopmac AND eventMessage CONTAINS "CSDL"',
          'subsystem == "com.example.shopmac" AND eventMessage CONTAINS[c] "csdl"|||subsystem == "com.example.shopmac" AND eventMessage CONTAINS[c] "csdl"',
          'subsystem == "com.example.shopmac" AND eventMessage == "csdl"|||subsystem == "com.example.shopmac" AND eventMessage == "csdl"',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: CONTAINS is case-sensitive ("csdl" found only our own log-run lines); an unquoted dotted value gives "no such field"; == needs the whole message. [c] ignores case, [cd] also diacritics.|||VI: CONTAINS phân biệt hoa thường ("csdl" chỉ ra các dòng log run của chính ta); giá trị có dấu chấm không ngoặc kép báo "no such field"; == đòi khớp cả thông điệp. [c] bỏ qua hoa thường, [cd] bỏ qua cả dấu.',
      },
      {
        question: 'A tool exits with code 133 and its .ips shows exception.type EXC_BREAKPOINT. What happened?|||Một công cụ thoát với mã 133 và tệp .ips ghi exception.type EXC_BREAKPOINT. Chuyện gì đã xảy ra?',
        options: [
          'It was killed by the OOM killer (SIGKILL)|||Nó bị OOM killer giết (SIGKILL)',
          'A deliberate trap — 133 = 128 + 5 (SIGTRAP), in Swift typically a failed force-unwrap or bounds check|||Một cái bẫy cố ý — 133 = 128 + 5 (SIGTRAP), trong Swift thường là ép ! thất bại hoặc kiểm biên',
          'It read an invalid memory address (SIGSEGV)|||Nó đọc một địa chỉ bộ nhớ không hợp lệ (SIGSEGV)',
          'Gatekeeper refused to run it|||Gatekeeper từ chối cho nó chạy',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: termination.indicator "Trace/BPT trap: 5", first frame in our image: main motep.swift:11 (Int(…)!). SIGSEGV would be EXC_BAD_ACCESS/139; a Gatekeeper/signature kill shows namespace CODESIGNING.|||VI: termination.indicator "Trace/BPT trap: 5", khung đầu tiên trong image của ta: main motep.swift:11 (Int(…)!). SIGSEGV sẽ là EXC_BAD_ACCESS/139; bị giết vì chữ ký thì namespace là CODESIGNING.',
      },
      {
        question: 'You find "sv : TTY=ttys009 ; PWD=/Users/sv ; USER=root ; COMMAND=/bin/cat /etc/master.passwd" by searching eventMessage, but process == "sudo" returns nothing. What is the best conclusion?|||Bạn tìm thấy "sv : TTY=ttys009 ; PWD=/Users/sv ; USER=root ; COMMAND=/bin/cat /etc/master.passwd" khi tìm theo eventMessage, nhưng process == "sudo" không ra gì. Kết luận tốt nhất là gì?',
        options: [
          'sudo logs under another process name on macOS|||Trên macOS sudo ghi log dưới tên tiến trình khác',
          'The unified log lost the process field|||Unified log đã mất trường process',
          'User sv read the password database as root|||Người dùng sv đã đọc CSDL mật khẩu bằng quyền root',
          'It is a forged line: processImagePath is /usr/bin/logger and userID 501 — the system attests the writer, not the text|||Đó là dòng giả: processImagePath là /usr/bin/logger và userID 501 — hệ thống xác nhận người viết, không xác nhận nội dung',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: logger -t sudo dropped the tag; ndjson showed processImagePath "/usr/bin/logger", userID 501, messageType Default. Always confirm suspicious lines by the attested fields.|||VI: logger -t sudo đã bỏ nhãn; ndjson cho thấy processImagePath "/usr/bin/logger", userID 501, messageType Default. Luôn xác nhận dòng đáng ngờ bằng các trường được hệ thống xác nhận.',
      },
      {
        question: 'last shows "root console Tue Nov 24 19:06 - crash" and "reboot time Tue Nov 24 19:16" with no shutdown line. What should you do before writing "the Mac crashed"?|||last ghi "root console Tue Nov 24 19:06 - crash" và "reboot time Tue Nov 24 19:16", không có dòng shutdown. Bạn nên làm gì trước khi viết "máy Mac đã sập"?',
        options: [
          'Corroborate with other sources: unified log around 19:10 (suhelperd "Rebooting", reboot3, the gap until 19:16), install.log, pmset -g log|||Đối chứng với nguồn khác: unified log quanh 19:10 (suhelperd "Rebooting", reboot3, khoảng trống tới 19:16), install.log, pmset -g log',
          'Nothing — "crash" in last always means a kernel panic|||Không cần gì — "crash" trong last luôn là kernel panic',
          'Run sudo log erase to clean up and watch whether it happens again|||Chạy sudo log erase để dọn rồi xem có lặp lại không',
          'Check /var/log/system.log, which holds all events since 2016|||Xem /var/log/system.log, nơi giữ mọi sự kiện từ 2016',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: "crash" only means no logout record before the next boot. Four sources showed a user-started update to 27.2.1 (MSU_UPDATE_26B131_patch_27.2.1) and reboot at 19:10:22. system.log is nearly empty today; erasing logs destroys evidence.|||VI: "crash" chỉ nghĩa là không có bản ghi đăng xuất trước lần khởi động kế. Bốn nguồn cho thấy một lần cập nhật lên 27.2.1 (MSU_UPDATE_26B131_patch_27.2.1) do người dùng bắt đầu và khởi động lại lúc 19:10:22. system.log hôm nay gần trống; xoá log là huỷ bằng chứng.',
      },
      {
        question: 'A colleague asks about a problem on their Mac from three weeks ago. What does the measured store of our lab Mac suggest?|||Một đồng nghiệp hỏi về sự cố trên máy Mac của họ từ ba tuần trước. Kho log đo được trên Mac lab của ta gợi ý điều gì?',
        options: [
          'The unified log keeps 30 days for everything, so it is there|||Unified log giữ 30 ngày cho mọi thứ, nên vẫn còn',
          'Logs are kept forever unless erased with sudo|||Log được giữ mãi trừ khi bị xoá bằng sudo',
          'Probably gone from the unified log (our store covered 12 days, with per-message TTLs) — look at longer-lived sources: crash reports, install.log, pmset -g log, last|||Nhiều khả năng đã mất khỏi unified log (kho của ta phủ 12 ngày, mỗi thông điệp có TTL) — hãy tìm ở nguồn sống lâu hơn: báo cáo crash, install.log, pmset -g log, last',
          'Only debug messages are deleted after a week|||Chỉ thông điệp debug bị xoá sau một tuần',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: log stats: start 13 Nov, end 25 Nov, 2.3 GB; the ttl row shows millions of messages living 1–14 days. Retention is a size budget, not a fixed number of days — collect early next time.|||VI: log stats: bắt đầu 13/11, kết thúc 25/11, 2,3 GB; dòng ttl cho thấy hàng triệu thông điệp chỉ sống 1–14 ngày. Thời gian giữ là ngân sách dung lượng, không phải số ngày cố định — lần sau hãy thu log sớm.',
      },
    ],
  },
};
