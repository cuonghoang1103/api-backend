/**
 * 16.8 — Kiểm tra Chương 16 (soạn 24/11/2026, agent lgz). 10 câu; đáp số dựa trên output thật OUT['s16/*'].
 * Phân bố đáp án: A ×2 (3, 8) · B ×3 (1, 5, 9) · C ×3 (2, 6, 10) · D ×2 (4, 7).
 */
export default {
  title: '16.8 — Chapter 16 quiz|||16.8 — Kiểm tra Chương 16',
  slug: 'log-16-8-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu: Ubuntu giữ auth.log bao lâu, Loki mặc định giữ mãi, tiền nạp so với tiền lưu trên CloudWatch, lấy mẫu đúng cách, bảy bản sao bí mật của pino-http, record Java in mật khẩu, việc đầu tiên khi token lọt vào log, chattr +a và root, chuỗi băm cần mốc bên ngoài, Object Lock COMPLIANCE.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Quiz</span>
<h2>Running logs well</h2>
<p class="lead">Ten questions built on the real output of this chapter. For each one, ask: is this about how long, how much, what must never be there, or who can change it?</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say how long a default Ubuntu keeps <code>auth.log</code>, and what Loki keeps by default.</li>
<li>I can estimate GB/day from rps, lines per request and bytes per line.</li>
<li>I know the six ways secrets get into logs and the fix for each.</li>
<li>I know what to do first when a secret is found in a log.</li>
<li>I can explain what chattr +a, a hash chain and Object Lock each protect against — and what not.</li>
<li>I can list the ten sections of a logging policy.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Kiểm tra</span>
<h2>Vận hành log cho đúng</h2>
<p class="lead">Mười câu dựa trên output thật của chương. Với mỗi câu, tự hỏi: nó nói về giữ bao lâu, tốn bao nhiêu, cái gì không được có, hay ai sửa được?</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được Ubuntu mặc định giữ <code>auth.log</code> bao lâu, và Loki mặc định giữ gì.</li>
<li>Tôi ước lượng được GB/ngày từ rps, số dòng mỗi request và byte mỗi dòng.</li>
<li>Tôi biết sáu đường bí mật lọt vào log và cách chặn từng đường.</li>
<li>Tôi biết việc đầu tiên phải làm khi thấy bí mật trong log.</li>
<li>Tôi giải thích được chattr +a, chuỗi băm và Object Lock mỗi thứ chống được gì — và không chống được gì.</li>
<li>Tôi kể được mười mục của một chính sách log.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'On a fresh Ubuntu 24.04 server, logrotate has `weekly` and `rotate 4` for /var/log/auth.log. An intrusion is discovered six weeks after it happened. What do you find in auth.log on that server?|||Trên máy chủ Ubuntu 24.04 mới cài, logrotate có `weekly` và `rotate 4` cho /var/log/auth.log. Một vụ đột nhập được phát hiện sáu tuần sau khi xảy ra. Trên máy đó, auth.log còn gì?',
        options: [
          'Everything — logrotate only compresses|||Còn đủ — logrotate chỉ nén thôi',
          'Nothing from the day of the intrusion: only about four weeks are kept, so the lines were deleted|||Không còn gì của ngày đột nhập: chỉ giữ khoảng bốn tuần, các dòng đó đã bị xoá',
          'Only the failed logins|||Chỉ còn các lần đăng nhập thất bại',
          'It depends on journald, which overrides logrotate|||Tuỳ journald, vì journald ghi đè logrotate',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 16.1 printed the real defaults: weekly + rotate 4 ≈ four weeks, then deleted. Security logs need ≥ 12 months, off the machine (Decree 333/2026, PCI DSS 10.5.1).|||VI: Bài 16.1 in cấu hình mặc định thật: weekly + rotate 4 ≈ bốn tuần rồi xoá. Log bảo mật cần ≥ 12 tháng và nằm ngoài máy (Nghị định 333/2026, PCI DSS 10.5.1).',
      },
      {
        question: 'You run Loki with its sample configuration. `-print-config-stderr` shows `retention_enabled: false` and `retention_period: 0s`. What does that mean?|||Bạn chạy Loki với cấu hình mẫu. `-print-config-stderr` cho thấy `retention_enabled: false` và `retention_period: 0s`. Nghĩa là gì?',
        options: [
          'Logs are deleted immediately|||Log bị xoá ngay lập tức',
          'Logs are kept 0 days in the hot tier and moved to cold storage|||Log giữ 0 ngày ở tầng nóng rồi chuyển sang tầng lạnh',
          'Logs are kept forever until the disk is full; retention needs the compactor with retention_enabled and a retention_period|||Log được giữ mãi tới khi đầy đĩa; muốn xoá theo hạn phải bật compactor với retention_enabled và đặt retention_period',
          'Loki uses the journald retention instead|||Loki dùng thời gian lưu của journald',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: 0s means "no limit". Real output from Loki 3.7.10 in lesson 16.1.|||VI: 0s nghĩa là "không giới hạn". Output thật của Loki 3.7.10 ở bài 16.1.',
      },
      {
        question: 'An app produces 79 GB of logs per month and sends them to CloudWatch Logs in Singapore (0.70 USD/GB ingested, 0.03 USD/GB-month stored, ~15 % after compression). Where is most of the bill, and what reduces it?|||Một ứng dụng sinh 79 GB log mỗi tháng và gửi lên CloudWatch Logs ở Singapore (nạp 0,70 USD/GB, lưu 0,03 USD/GB-tháng, còn ~15 % sau nén). Phần lớn hoá đơn nằm ở đâu, và cái gì làm nó giảm?',
        options: [
          'Ingestion (~56 USD); reduce lines at the source — debug off, drop health checks, sample successes|||Tiền nạp (~56 USD); bớt dòng ở nguồn — tắt debug, bỏ health check, lấy mẫu request thành công',
          'Storage; shorten retention from 30 to 7 days|||Tiền lưu; rút thời gian lưu từ 30 xuống 7 ngày',
          'Both equally; compress before sending|||Hai khoản ngang nhau; nén trước khi gửi',
          'Neither: the first 5 GB are free, so it is free|||Không khoản nào: 5 GB đầu miễn phí nên coi như miễn phí',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 16.2, real Price List API: 79 × 0.70 ≈ 56 USD ingestion vs well under 1 USD storage. Ingestion is charged on what goes in.|||VI: Bài 16.2, Price List API thật: 79 × 0,70 ≈ 56 USD tiền nạp so với chưa tới 1 USD tiền lưu. Tiền nạp tính trên lượng chảy vào.',
      },
      {
        question: 'Which sampling rule is correct for an nginx access log you ship to a paid store?|||Luật lấy mẫu nào đúng cho access log nginx bạn gửi lên một kho trả phí?',
        options: [
          'Keep 10 % of all requests, errors included, to be fair|||Giữ 10 % mọi request, kể cả lỗi, cho công bằng',
          'Keep only errors, drop all successful requests|||Chỉ giữ lỗi, bỏ hết request thành công',
          'Sample by IP so each user is either fully kept or fully dropped|||Lấy mẫu theo IP để mỗi người dùng hoặc được giữ hết hoặc bị bỏ hết',
          'Keep 100 % of 4xx/5xx and security events, drop successful health checks, sample other successes and record the rate|||Giữ 100 % 4xx/5xx và sự kiện bảo mật, bỏ health check thành công, lấy mẫu các request thành công khác và ghi lại tỉ lệ',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 16.2: 1012 → 59 lines, all 12 errors kept, 47 of 400 successes (~10 %). Counting sampled lines needs ×10.|||VI: Bài 16.2: 1012 → 59 dòng, giữ đủ 12 lỗi, 47 trên 400 request thành công (~10 %). Đếm dòng đã lấy mẫu phải nhân 10.',
      },
      {
        question: 'A Node API uses pino-http with default settings and logs `req.log.info({ body }, "đăng nhập")`. One login request carries a password, a Bearer token, a session cookie and ?token= in the URL. Why did the lesson find seven copies of secrets for four secrets?|||Một API Node dùng pino-http mặc định và ghi `req.log.info({ body }, "đăng nhập")`. Một request đăng nhập mang mật khẩu, Bearer token, cookie phiên và ?token= trong URL. Vì sao bài học đếm được bảy bản sao bí mật cho bốn bí mật?',
        options: [
          'pino duplicates every line for safety|||pino nhân đôi mọi dòng cho an toàn',
          'The default request serializer includes all headers and the full URL, and appears on both the custom line and the automatic "request completed" line; the password appears once in the body|||Serializer request mặc định có mọi header và nguyên URL, và xuất hiện ở cả dòng tự viết lẫn dòng "request completed" tự động; mật khẩu chỉ xuất hiện một lần trong body',
          'The browser sent the request twice|||Trình duyệt gửi request hai lần',
          'grep counted the same line twice|||grep đếm trùng một dòng hai lần',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Real output in 16.3: Bearer ×2, cookie ×2, ?token ×2, password ×1. Fix: redact paths + a req serializer without query string; better, log userId instead of body.|||VI: Output thật ở 16.3: Bearer ×2, cookie ×2, ?token ×2, mật khẩu ×1. Sửa: redact + serializer req bỏ query string; tốt hơn nữa, ghi userId thay vì body.',
      },
      {
        question: 'In Java, `record LoginRequest(String email, String password)` is logged with `log.info("nhận yêu cầu {}", req)`. What appears, and what is the right fix?|||Trong Java, `record LoginRequest(String email, String password)` được ghi bằng `log.info("nhận yêu cầu {}", req)`. Cái gì hiện ra, và cách sửa đúng là gì?',
        options: [
          'Only the class name — records hide fields|||Chỉ tên lớp — record giấu các trường',
          'The password is masked automatically by SLF4J|||Mật khẩu tự được SLF4J che',
          'The generated toString prints every component including the password; override toString (or exclude the field) and log fields, keeping %replace only as a safety net|||toString tự sinh in mọi thành phần kể cả mật khẩu; ghi đè toString (hoặc loại trường) và ghi từng trường, chỉ giữ %replace làm lưới an toàn',
          'A compile error|||Lỗi biên dịch',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Real run with Java 21 + Logback 1.5.38 in 16.3: LoginRequest[email=…, password=MatKhau-GIA-123].|||VI: Chạy thật với Java 21 + Logback 1.5.38 ở 16.3: LoginRequest[email=…, password=MatKhau-GIA-123].',
      },
      {
        question: 'gitleaks finds a live Stripe key in last week\'s application log on production. What do you do FIRST?|||gitleaks tìm thấy một khoá Stripe live trong log ứng dụng tuần trước trên production. Việc ĐẦU TIÊN bạn làm là gì?',
        options: [
          'Delete the log file so nobody sees it|||Xoá tệp log để không ai thấy',
          'Mask the line with sed|||Che dòng đó bằng sed',
          'Open a ticket and wait for the weekly meeting|||Mở ticket và chờ buổi họp tuần',
          'Revoke/rotate the key, then fix the code, then purge every copy (rotated files, central store, backups), then document|||Thu hồi/đổi khoá, rồi sửa mã, rồi xoá mọi bản sao (tệp đã xoay, kho trung tâm, bản sao lưu), rồi ghi nhận',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Deleting a log does not un-leak a secret: it may already be in the central store, backups or someone\'s laptop. Lesson 16.3 and Lab 16 task 4.|||VI: Xoá log không làm bí mật "hết lộ": nó có thể đã nằm ở kho trung tâm, bản sao lưu hay laptop của ai đó. Bài 16.3 và việc 4 của Lab 16.',
      },
      {
        question: 'You set `chattr +a /var/log/shop/app.log`. Which statement matches the real output of lesson 16.4?|||Bạn đặt `chattr +a /var/log/shop/app.log`. Câu nào khớp với output thật của bài 16.4?',
        options: [
          'Appending works; overwrite, truncate, rm and mv fail even for root; logrotate fails to rename it; root can remove the attribute with chattr -a|||Ghi thêm được; ghi đè, cắt rỗng, rm và mv đều thất bại kể cả với root; logrotate không đổi tên được; root gỡ được thuộc tính bằng chattr -a',
          'Nothing can write to the file any more|||Không gì ghi vào tệp được nữa',
          'It protects the file against root permanently|||Nó bảo vệ tệp trước root vĩnh viễn',
          'It encrypts the file|||Nó mã hoá tệp',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Append-only stops accidents and non-root attackers; against root, the log must already be elsewhere (shipped, immutable).|||VI: Chỉ-ghi-thêm chặn tai nạn và kẻ tấn công không có root; muốn chống root, log phải đã nằm ở nơi khác (đã gửi đi, bất biến).',
      },
      {
        question: 'An attacker with write access edits one line of a hash-chained log and then recomputes the whole chain. How can you still detect it?|||Kẻ có quyền ghi sửa một dòng của log có chuỗi băm rồi tính lại toàn bộ chuỗi. Làm sao vẫn phát hiện được?',
        options: [
          'You cannot; hash chains are useless|||Không thể; chuỗi băm vô dụng',
          'Compare the final hash with an anchor saved earlier somewhere the attacker cannot change|||So băm cuối với một mốc đã lưu từ trước ở nơi kẻ tấn công không sửa được',
          'Check the file\'s modification time|||Xem thời gian sửa đổi của tệp',
          'Run the checker twice|||Chạy bộ kiểm hai lần',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 16.4: the recomputed chain passes the internal check but fails against the anchor. Same principle as journald FSS keeping the verification key off the machine.|||VI: Bài 16.4: chuỗi tính lại qua được phép kiểm nội bộ nhưng trượt khi so với mốc. Cùng nguyên lý với FSS của journald giữ khoá kiểm ngoài máy.',
      },
      {
        question: 'A MinIO bucket has Object Lock COMPLIANCE 30 days. The shipper account has only s3:PutObject. Which is true?|||Một bucket MinIO có Object Lock COMPLIANCE 30 ngày. Tài khoản của bộ gửi log chỉ có s3:PutObject. Câu nào đúng?',
        options: [
          'The administrator can delete any version at any time|||Quản trị viên xoá được mọi phiên bản bất cứ lúc nào',
          'The shipper can read logs back to check them|||Bộ gửi đọc lại được log để kiểm',
          'The shipper can only add objects; "delete" by the admin only adds a delete marker, and deleting the version or clearing its retention is refused (WORM) until the 30 days pass|||Bộ gửi chỉ thêm được đối tượng; quản trị viên "xoá" chỉ thêm một dấu xoá, còn xoá phiên bản hay gỡ thời hạn lưu đều bị từ chối (WORM) tới khi hết 30 ngày',
          'COMPLIANCE and GOVERNANCE are the same|||COMPLIANCE và GOVERNANCE giống nhau',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Real output in 16.4: "Insufficient permissions" for the shipper on cat/rm; "is WORM protected and cannot be overwritten" for the admin. GOVERNANCE can be bypassed by a privileged user; COMPLIANCE cannot.|||VI: Output thật ở 16.4: bộ gửi bị "Insufficient permissions" khi cat/rm; quản trị viên bị "is WORM protected and cannot be overwritten". GOVERNANCE người có quyền đặc biệt vượt được; COMPLIANCE thì không.',
      },
    ],
  },
};
