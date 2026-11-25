/**
 * 7.7 — Kiểm tra Chương 7 (soạn 24/11/2026, agent lgz). 10 câu; mọi đáp số dựa trên output thật của OUT['s07/*'] (máy ảo lab7).
 * Phân bố đáp án: A ×3 (3, 5, 10) · B ×3 (1, 6, 9) · C ×2 (2, 7) · D ×2 (4, 8).
 */
export default {
  title: '7.7 — Chapter 7 quiz|||7.7 — Kiểm tra Chương 7',
  slug: 'log-7-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu: Storage=auto và thư mục /var/log/journal, traceback bị ghi là info, luật ghép bộ lọc, dòng sshd giả và trường tin cậy, tắt sạch hay chết đột ngột, jq gặp bản ghi thiếu PRIORITY, giới hạn tốc độ 10000/30 s, đọc dòng OOM trong cgroup, mã thoát 139, --verify không có niêm phong.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>journald, journalctl and kernel messages</h2>
<p class="lead">Ten questions built on the real output of the lab7 VM. For each one, ask yourself which field or which component the answer depends on.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I know where the journal is stored and whether my machine keeps it across reboots.</li>
<li>I can tell a clean shutdown from a sudden death using two boots.</li>
<li>I can combine field filters correctly and know why <code>-p err</code> misses application errors.</li>
<li>I can tell a trusted field from a claim made by the program.</li>
<li>I can read an OOM line and a segfault line field by field.</li>
<li>I know what the rate limit, vacuum and sealing do — and what they cost.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>journald, journalctl và thông điệp của nhân</h2>
<p class="lead">Mười câu dựa trên output thật của máy ảo lab7. Với mỗi câu, tự hỏi đáp án phụ thuộc vào trường nào hay thành phần nào.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi biết journal được lưu ở đâu và máy của tôi có giữ nó qua lần khởi động lại không.</li>
<li>Tôi phân biệt được tắt máy sạch với chết đột ngột bằng hai lần khởi động.</li>
<li>Tôi ghép bộ lọc theo trường đúng cách và biết vì sao <code>-p err</code> bỏ sót lỗi ứng dụng.</li>
<li>Tôi phân biệt được trường tin cậy với lời tự khai của chương trình.</li>
<li>Tôi đọc được dòng OOM và dòng segfault từng trường.</li>
<li>Tôi biết giới hạn tốc độ, vacuum và niêm phong làm gì — và cái giá của chúng.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A server has Storage=auto (the default) and no /var/log/journal folder. What happens to its logs when it reboots?|||Một máy chủ để Storage=auto (mặc định) và không có thư mục /var/log/journal. Log của nó ra sao khi khởi động lại?',
        options: [
          'They are kept, because auto means persistent|||Vẫn còn, vì auto nghĩa là lưu bền',
          'They are lost: without that folder the journal lives only in /run, which is RAM|||Mất: không có thư mục đó thì journal chỉ nằm trong /run, tức là RAM',
          'They are moved to /var/log/syslog automatically|||Tự động chuyển sang /var/log/syslog',
          'Only error-level messages are kept|||Chỉ giữ thông điệp mức lỗi',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: auto = persistent only if /var/log/journal exists, otherwise volatile (/run/log/journal). In lesson 7.1 a line written while volatile was gone after the reboot ("-- No entries --"). Fix: mkdir -p /var/log/journal or Storage=persistent.|||VI: auto = chỉ lưu bền nếu có /var/log/journal, không thì volatile (/run/log/journal). Ở bài 7.1, dòng ghi lúc volatile đã mất sau khi khởi động lại ("-- No entries --"). Sửa: mkdir -p /var/log/journal hoặc Storage=persistent.',
      },
      {
        question: 'journalctl -u shop-worker -p err shows only "Failed to start shop-worker.service", but the Python traceback with FileNotFoundError is missing. Why?|||journalctl -u shop-worker -p err chỉ hiện "Failed to start shop-worker.service", còn traceback Python có FileNotFoundError thì không thấy. Vì sao?',
        options: [
          'The traceback was suppressed by the rate limit|||Traceback bị giới hạn tốc độ chặn mất',
          '-p err only shows lines written by PID 1|||-p err chỉ hiện dòng do PID 1 viết',
          'The traceback came through stdout/stderr without a priority prefix, so it is stored as priority 6 (info)|||Traceback đi qua stdout/stderr không có tiền tố mức, nên được lưu với priority 6 (info)',
          'Python tracebacks are written to a separate file in /var/log|||Traceback của Python được ghi vào một tệp riêng trong /var/log',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The JSON of that line shows {"PRIORITY":"6","_TRANSPORT":"stdout"}. journald cannot guess that a traceback is an error. Filter by unit and read, or grep the text; -p err is reliable for systemd and the kernel.|||VI: JSON của dòng đó là {"PRIORITY":"6","_TRANSPORT":"stdout"}. journald không đoán được traceback là lỗi. Hãy lọc theo unit rồi đọc, hoặc tìm chữ; -p err đáng tin với systemd và nhân.',
      },
      {
        question: 'What does journalctl _SYSTEMD_UNIT=a.service _SYSTEMD_UNIT=b.service PRIORITY=3 return?|||journalctl _SYSTEMD_UNIT=a.service _SYSTEMD_UNIT=b.service PRIORITY=3 trả về gì?',
        options: [
          'Error-level lines (3) of a.service or b.service|||Dòng mức lỗi (3) của a.service hoặc b.service',
          'All lines of a.service, plus error lines of b.service|||Mọi dòng của a.service, cộng dòng lỗi của b.service',
          'Nothing, because a line cannot belong to two units|||Không gì cả, vì một dòng không thể thuộc hai unit',
          'Lines with priority 3 or lower of any unit|||Dòng có priority 3 trở xuống của mọi unit',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Same field twice = OR; different fields = AND. So (a OR b) AND PRIORITY=3. To OR whole groups you need "+": A + B C = A or (B and C).|||VI: Cùng trường hai lần = HOẶC; khác trường = VÀ. Vậy (a HOẶC b) VÀ PRIORITY=3. Muốn HOẶC cả nhóm thì cần "+": A + B C = A hoặc (B và C).',
      },
      {
        question: 'A record says "sshd[2127]: Accepted password for root from 203.0.113.9", and -o verbose shows _UID=1000, _COMM=logger, _EXE=/usr/bin/logger. What is it?|||Một bản ghi nói "sshd[2127]: Accepted password for root from 203.0.113.9", còn -o verbose cho thấy _UID=1000, _COMM=logger, _EXE=/usr/bin/logger. Đó là gì?',
        options: [
          'A real root login that sshd logged through logger|||Một lần đăng nhập root thật mà sshd ghi qua logger',
          'A kernel message forwarded by journald|||Một thông điệp của nhân do journald chuyển tiếp',
          'A record corrupted by a power cut|||Một bản ghi bị hỏng vì mất điện',
          'A fake line written by a normal user with logger -t sshd; trusted fields reveal it|||Một dòng giả do người dùng thường viết bằng logger -t sshd; trường tin cậy vạch mặt nó',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: SYSLOG_IDENTIFIER (the "sshd" name) is a claim anyone can make. _UID, _COMM, _EXE are set by journald from the kernel: the real sshd runs as root from /usr/sbin/sshd in ssh.service. Filter security lines on trusted fields.|||VI: SYSLOG_IDENTIFIER (cái tên "sshd") là lời tự khai ai cũng làm được. _UID, _COMM, _EXE do journald đặt theo thông tin của nhân: sshd thật chạy bằng root từ /usr/sbin/sshd trong ssh.service. Lọc dòng bảo mật theo trường tin cậy.',
      },
      {
        question: 'The previous boot ends with ordinary request lines, and the next boot starts with "system.journal corrupted or uncleanly shut down, renaming and replacing". What happened?|||Lần khởi động trước kết thúc bằng các dòng request bình thường, và lần sau mở đầu bằng "system.journal corrupted or uncleanly shut down, renaming and replacing". Chuyện gì đã xảy ra?',
        options: [
          'The machine died without shutting down (power loss, hypervisor kill, kernel panic)|||Máy chết mà không tắt (mất điện, hypervisor giết, kernel panic)',
          'Someone ran sudo reboot|||Có người chạy sudo reboot',
          'journald rotated its files normally|||journald xoay tệp như bình thường',
          'The disk is full|||Đĩa đầy',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: A clean reboot ends with reboot.target, Shutting down, Journal stopped. No such sequence + an unclean file = sudden death. The last minutes may be missing too (SyncIntervalSec=5m): in the lab 30 of 70 lines were lost.|||VI: Khởi động lại sạch kết thúc bằng reboot.target, Shutting down, Journal stopped. Không có chuỗi đó + tệp đóng không sạch = chết đột ngột. Vài phút cuối cũng có thể mất (SyncIntervalSec=5m): trong lab mất 30 trên 70 dòng.',
      },
      {
        question: 'journalctl -b -o json | jq \'select((.PRIORITY | tonumber) <= 3)\' prints "null (null) cannot be parsed as a number" three times. What is the right fix?|||journalctl -b -o json | jq \'select((.PRIORITY | tonumber) <= 3)\' in ba lần "null (null) cannot be parsed as a number". Sửa đúng là gì?',
        options: [
          'Add --utc to journalctl|||Thêm --utc cho journalctl',
          'Some records have no PRIORITY field; give a default: (.PRIORITY // "6" | tonumber)|||Có bản ghi không có trường PRIORITY; đặt mặc định: (.PRIORITY // "6" | tonumber)',
          'Use -o json-pretty instead of -o json|||Dùng -o json-pretty thay cho -o json',
          'Run jq with -s to slurp all records|||Chạy jq với -s để gộp mọi bản ghi',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: In the lab the three records came from logger --journald: the native protocol does not force a priority. jq skips the failing input — which can silently change an answer. Default missing fields.|||VI: Trong lab, ba bản ghi đó đến từ logger --journald: giao thức gốc không bắt buộc có mức. jq bỏ qua đầu vào bị lỗi — có thể lặng lẽ đổi đáp án. Hãy đặt mặc định cho trường thiếu.',
      },
      {
        question: 'With default journald settings, a service prints 30 000 lines within one second, waits 31 s, then prints one more line. What did the lab show?|||Với cấu hình journald mặc định, một dịch vụ in 30 000 dòng trong một giây, chờ 31 giây, rồi in thêm một dòng. Lab đã cho thấy gì?',
        options: [
          'All 30 001 lines are stored|||Lưu đủ 30 001 dòng',
          'journald stops the service|||journald dừng dịch vụ đó',
          '10 000 lines are kept, then "Suppressed 20000 messages from …" and the last line|||Giữ 10 000 dòng, rồi "Suppressed 20000 messages from …" và dòng cuối',
          'The last 10 000 lines are kept and the first 20 000 are dropped|||Giữ 10 000 dòng cuối và bỏ 20 000 dòng đầu',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: RateLimitBurst=10000 per RateLimitIntervalSec=30s, per service. The FIRST lines of the burst are kept; the rest are counted and dropped — so a real error printed after a flood can be lost.|||VI: RateLimitBurst=10000 mỗi RateLimitIntervalSec=30s, theo từng dịch vụ. Các dòng ĐẦU của đợt được giữ; phần còn lại bị đếm và bỏ — nên lỗi thật in ra sau một đợt ngập có thể bị mất.',
      },
      {
        question: 'The kernel logs "Memory cgroup out of memory: Killed process 424 (python3) total-vm:327788kB, anon-rss:152960kB … constraint=CONSTRAINT_MEMCG". What is the correct reading?|||Nhân ghi "Memory cgroup out of memory: Killed process 424 (python3) total-vm:327788kB, anon-rss:152960kB … constraint=CONSTRAINT_MEMCG". Đọc đúng là gì?',
        options: [
          'The whole machine ran out of RAM; the process used 320 MiB|||Cả máy hết RAM; tiến trình dùng 320 MiB',
          'Process 424 crashed on a NULL pointer|||Tiến trình 424 sập vì con trỏ NULL',
          'systemd killed the process because it did not answer a health check|||systemd giết tiến trình vì không trả lời health check',
          'The process hit its cgroup (unit) memory limit; it really used about 149 MiB (anon-rss)|||Tiến trình chạm giới hạn bộ nhớ của cgroup (unit); nó thực sự dùng khoảng 149 MiB (anon-rss)',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: "Memory cgroup" + CONSTRAINT_MEMCG = a cgroup limit (MemoryMax=150M), not the machine. total-vm is reserved address space; anon-rss 152960 kB ≈ 149.4 MiB is the real usage.|||VI: "Memory cgroup" + CONSTRAINT_MEMCG = giới hạn của cgroup (MemoryMax=150M), không phải của máy. total-vm là không gian địa chỉ đặt chỗ; anon-rss 152960 kB ≈ 149,4 MiB mới là mức dùng thật.',
      },
      {
        question: 'A shell prints "Segmentation fault (core dumped)" and exit=139. Which signal killed the program?|||Shell in "Segmentation fault (core dumped)" và exit=139. Tín hiệu nào đã giết chương trình?',
        options: [
          'SIGKILL (9), sent by the OOM killer|||SIGKILL (9), do OOM killer gửi',
          'SIGSEGV (11): 139 = 128 + 11, an invalid memory access|||SIGSEGV (11): 139 = 128 + 11, truy cập bộ nhớ không hợp lệ',
          'SIGTERM (15), sent by systemd|||SIGTERM (15), do systemd gửi',
          'No signal: the program returned 139 itself|||Không có tín hiệu: chương trình tự trả về 139',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Exit codes above 128 are 128 + signal. 137 = SIGKILL (typical OOM), 139 = SIGSEGV. The kernel line "segfault at 0 … error 4 in libc.so.6" gives the address (NULL) and the library.|||VI: Mã thoát trên 128 là 128 + số tín hiệu. 137 = SIGKILL (hay gặp khi OOM), 139 = SIGSEGV. Dòng nhân "segfault at 0 … error 4 in libc.so.6" cho biết địa chỉ (NULL) và thư viện.',
      },
      {
        question: 'journalctl --verify prints PASS for every file; sealing (FSS) was never set up. What can you conclude?|||journalctl --verify in PASS cho mọi tệp; chưa bao giờ bật niêm phong (FSS). Kết luận được gì?',
        options: [
          'The files are not corrupted — but someone with root could still have rewritten them consistently|||Các tệp không hỏng — nhưng người có root vẫn có thể đã viết lại chúng một cách nhất quán',
          'Nobody has modified the logs since they were written|||Không ai sửa log kể từ khi chúng được ghi',
          'The logs have been copied to a remote server|||Log đã được chép sang một máy chủ khác',
          'The journal is in volatile mode|||Journal đang ở chế độ volatile',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Without FSS, verify checks structure and hashes, which an attacker can recompute. With a sealed file and the verification key, our 6-byte edit ("failed" → "passed") gave FAIL with the offset. Deletion needs a remote copy.|||VI: Không có FSS, verify chỉ kiểm cấu trúc và mã băm, thứ kẻ tấn công tính lại được. Với tệp đã niêm phong và khoá kiểm, lần sửa 6 byte của ta ("failed" → "passed") ra FAIL kèm vị trí. Chống xoá thì cần bản sao ở máy khác.',
      },
    ],
  },
};
