/**
 * Hạ tầng email: SMTP, SPF/DKIM/DMARC & gửi thư không vào spam — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo
 * kế hoạch content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm B). Soạn chi tiết SAU theo content/courses/docker/_HOP-DONG.md.
 * Xem _chung/khung.mjs. Không có khoá cũ nào dạy email sâu; chỗ chạm: networking (DNS) và background-jobs (hàng đợi gửi thư) —
 * nhắc một câu và trỏ link. Thực hành trên tên miền thử qua Cloudflare DNS, không gửi thư hàng loạt tới người không đồng ý.
 * Ảnh bìa: người điều phối dựng (logo simple-icons gmail).
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Server', sortOrder: 4 },
  course: {
    slug: 'email-infrastructure',
    title: 'Email Infrastructure & Deliverability',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/email-infrastructure.png?v=4',
    shortDescription: 'Making email arrive: SMTP and MX, SPF, DKIM, DMARC, MTA-STS, reputation, transactional providers, bounces, templates, self-hosting trade-offs and anti-spoofing.|||Làm thư tới nơi: SMTP và MX, SPF, DKIM, DMARC, MTA-STS, uy tín gửi thư, dịch vụ thư giao dịch, bounce, template, cái giá của tự host và chống giả mạo.',
    description: 'Khoá cho lập trình viên và người vận hành web cần gửi thư xác thực tài khoản, đặt lại mật khẩu, thông báo và bản tin — và không muốn chúng rơi vào thư mục spam. Bắt đầu từ lịch sử (thư mạng đầu tiên 1971, SMTP 1982, SPF/DKIM/DMARC lần lượt ra đời vì thư giả mạo tràn lan, Gmail và Yahoo siết quy định người gửi hàng loạt từ 02/2024) và các vụ lừa đảo qua email có thật (Ubiquiti mất 46,7 triệu USD vì lừa đảo email doanh nghiệp năm 2015; lỗ hổng ProxyLogon trên Microsoft Exchange tự host năm 2021). Học: đường đi của một lá thư (MUA, MSA, MTA, MDA), SMTP bằng tay qua telnet/openssl, MX và DNS; xác thực SPF, DKIM, DMARC, ARC, BIMI; bảo mật đường truyền (STARTTLS, MTA-STS, TLS-RPT, DANE); uy tín IP và tên miền, reverse DNS, danh sách chặn, làm ấm IP; thư giao dịch vs thư marketing, chọn nhà cung cấp (Amazon SES, Resend, Postmark, SendGrid, Mailgun, Brevo); gửi từ Node.js và Spring Boot qua hàng đợi, webhook bounce/complaint, danh sách chặn; template responsive (MJML, React Email), đa ngôn ngữ, huỷ đăng ký một chạm; nhận thư (Cloudflare Email Routing, inbound parse); tự host Postfix/Dovecot/Rspamd hoặc Mailcow và vì sao hầu hết đội nhỏ không nên; chống giả mạo và phishing. Dự án cuối khoá: dựng hạ tầng email hoàn chỉnh cho một tên miền kiểu cuongthai.com và LabFlow, đạt DMARC p=reject và 10/10 trên công cụ kiểm tra.',
    whatYouLearn: 'Giải thích đường đi của một lá thư và đọc được header; gửi thư bằng SMTP thủ công; cấu hình MX, SPF, DKIM, DMARC trên Cloudflare DNS và đưa DMARC từ p=none lên p=reject an toàn; đọc báo cáo DMARC; bật MTA-STS; chọn nhà cung cấp gửi thư giao dịch; gửi thư từ Node.js/Spring Boot qua hàng đợi có thử lại; xử lý bounce, khiếu nại và danh sách chặn bằng webhook; viết template hiển thị đúng trên Gmail/Outlook/điện thoại; thêm huỷ đăng ký một chạm; nhận thư đến bằng Email Routing; biết cái giá thật của việc tự host mail server; nhận diện và chống giả mạo tên miền.',
    requirements: 'DNS cơ bản (bản ghi A, CNAME, TXT), một ngôn ngữ backend (Node.js hoặc Java/Spring Boot), dòng lệnh Linux. Cần một tên miền thử quản lý trên Cloudflare. Nên học trước: Mạng máy tính cho lập trình viên (nếu có), Queues & Background Jobs.',
    documentsNote: 'Tài liệu chính: RFC 5321 (SMTP) • RFC 5322 (định dạng thư) • RFC 7208 (SPF) • RFC 6376 (DKIM) • RFC 7489 (DMARC) • RFC 8617 (ARC) • RFC 8461 (MTA-STS) • RFC 8058 (huỷ đăng ký một chạm) • dmarc.org • support.google.com/a (Email sender guidelines) • senders.yahooinc.com • docs.aws.amazon.com/ses • resend.com/docs • postmarkapp.com/support • developers.cloudflare.com/email-routing • postfix.org/documentation.html • doc.dovecot.org • docs.mailcow.email • m3aawg.org (thực hành tốt chống lạm dụng) • mjml.io/documentation.',
  },
  sections: khung('mail', [
    ['Section 0 — Why email is harder than it looks', 'Mục 0 — Vì sao email khó hơn vẻ ngoài', 'Giao thức 40 năm tuổi, được vá bảo mật từng lớp một.', [
      ['bat-dau-tai-day', 'Start here (1/2) — How email works in everyday words, its history, and the frauds that forced authentication', 'Bắt đầu tại đây (1/2) — Email hoạt động thế nào bằng lời đời thường, lịch sử, và những vụ lừa đảo buộc phải có xác thực', 'Bưu điện không kiểm tên người gửi · Mốc: thư mạng đầu tiên (Ray Tomlinson, 1971), SMTP RFC 821 (1982), SPF (2006), DKIM (2007), DMARC (2015), Gmail/Yahoo siết người gửi hàng loạt (02/2024) · Ubiquiti 2015: 46,7 triệu USD mất vì email giả · ProxyLogon 2021: máy chủ Exchange tự host bị khai thác hàng loạt'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, where this skill is used, and the path', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, kỹ năng này dùng ở đâu, và lộ trình', 'Thư xác thực, OTP, đặt lại mật khẩu, thông báo, bản tin · Vị trí: backend, DevOps, deliverability specialist · Việc làm được sau khoá: một tên miền gửi thư sạch, DMARC p=reject · Khoá nền nên học trước'],
      ['lab', 'Lab setup: a test domain on Cloudflare, mail-tester, swaks, Mailpit and a provider sandbox', 'Dựng lab: tên miền thử trên Cloudflare, mail-tester, swaks, Mailpit và sandbox của nhà cung cấp', 'Tên miền rẻ chỉ để thử · Mailpit bắt thư khi dev · swaks gửi thử SMTP · Tài khoản SES sandbox/Resend miễn phí · Không gửi cho người chưa đồng ý'],
    ]],
    ['Chapter 1 — How a message travels', 'Chương 1 — Một lá thư đi như thế nào', 'Từ nút Gửi tới hộp thư người nhận.', [
      ['thanh-phan', 'The cast: MUA, MSA, MTA, MDA, and ports 25, 465, 587, 993', 'Các vai: MUA, MSA, MTA, MDA, và các cổng 25, 465, 587, 993', 'Ai làm gì trên đường đi · Cổng 25 giữa máy chủ, 587/465 để gửi, 993 để đọc · Vì sao nhiều VPS chặn cổng 25 ra'],
      ['mx', 'DNS for mail: MX records, priorities and fallback', 'DNS cho thư: bản ghi MX, độ ưu tiên và dự phòng', 'dig MX · Độ ưu tiên · Tên miền không có MX thì sao · Null MX (RFC 7505) cho tên miền không nhận thư'],
      ['smtp-tay', 'Speaking SMTP by hand: EHLO, MAIL FROM, RCPT TO, DATA', 'Nói chuyện SMTP bằng tay: EHLO, MAIL FROM, RCPT TO, DATA', 'openssl s_client -starttls smtp · Mã trả lời 2xx/4xx/5xx · Chỉ thử trên máy chủ của mình hoặc Mailpit'],
      ['header', 'Envelope vs headers: Return-Path, From, Received, and reading a raw message', 'Phong bì vs header: Return-Path, From, Received, và đọc một thư gốc', 'MAIL FROM khác From hiển thị · Chuỗi Received đọc từ dưới lên · Authentication-Results · Công cụ phân tích header của Google'],
      ['nhan', 'Reading mail: IMAP, POP3, JMAP', 'Đọc thư: IMAP, POP3, JMAP', 'IMAP đồng bộ, POP3 tải về · JMAP hiện đại · Vì sao app mail cần mật khẩu ứng dụng/OAuth'],
    ]],
    ['Chapter 2 — Authentication: SPF, DKIM and DMARC', 'Chương 2 — Xác thực: SPF, DKIM và DMARC', 'Ba bản ghi DNS quyết định thư của bạn có được tin hay không.', [
      ['spf', 'SPF: who may send for your domain, and the 10-lookup limit', 'SPF: ai được gửi thay tên miền của bạn, và giới hạn 10 lần tra', 'v=spf1 include: ~all/-all · Đếm lần tra DNS · Nhiều nhà cung cấp cùng lúc · SPF chỉ kiểm MAIL FROM, không kiểm From hiển thị'],
      ['dkim', 'DKIM: signing messages, selectors and key rotation', 'DKIM: ký thư, selector và xoay khoá', 'Chữ ký trong header · Khoá công khai ở selector._domainkey · Khoá 2048 bit · Xoay khoá không làm hỏng thư đang bay'],
      ['dmarc', 'DMARC: alignment, policies and the safe path from p=none to p=reject', 'DMARC: căn chỉnh, chính sách và đường an toàn từ p=none tới p=reject', 'Căn chỉnh SPF/DKIM với From · none → quarantine → reject · pct và sp cho tên miền con · Tên miền không gửi thư cũng cần DMARC'],
      ['bao-cao', 'Reading DMARC aggregate reports and finding forgotten senders', 'Đọc báo cáo tổng hợp DMARC và tìm ra những nguồn gửi bị quên', 'rua= nhận XML · Công cụ đọc báo cáo (parsedmarc, dịch vụ miễn phí) · Nguồn lạ: giả mạo hay dịch vụ quên khai báo'],
      ['arc-bimi', 'ARC for forwarding and BIMI for your logo', 'ARC cho thư chuyển tiếp và BIMI cho logo của bạn', 'Chuyển tiếp làm hỏng SPF · ARC giữ kết quả xác thực · BIMI cần DMARC chặt và (với Gmail) chứng chỉ VMC/CMC · Có đáng làm không'],
    ]],
    ['Chapter 3 — Transport security', 'Chương 3 — Bảo mật đường truyền', 'Mã hoá thư trên đường đi giữa các máy chủ.', [
      ['starttls', 'STARTTLS and opportunistic encryption, and the downgrade problem', 'STARTTLS và mã hoá cơ hội, và vấn đề hạ cấp', 'Nâng cấp kết nối lên TLS · Kẻ đứng giữa xoá lệnh STARTTLS · TLS ngầm trên 465'],
      ['mta-sts', 'MTA-STS and TLS-RPT: enforcing TLS for inbound mail', 'MTA-STS và TLS-RPT: bắt buộc TLS cho thư đến', 'File chính sách trên https://mta-sts.<tên miền> · Bản ghi _mta-sts và _smtp._tls · Host file chính sách trên Cloudflare Pages/Workers'],
      ['dane', 'DANE and DNSSEC at a glance', 'Lướt qua DANE và DNSSEC', 'Bản ghi TLSA · Cần DNSSEC · Ai hỗ trợ · So với MTA-STS'],
      ['ma-hoa-dau-cuoi', 'End-to-end encryption: S/MIME and PGP, and why they stayed niche', 'Mã hoá đầu cuối: S/MIME và PGP, và vì sao chúng vẫn ít người dùng', 'Khác mã hoá đường truyền · Quản lý khoá khó · Khi nào doanh nghiệp dùng S/MIME'],
    ]],
    ['Chapter 4 — Reputation and deliverability', 'Chương 4 — Uy tín và khả năng tới hộp thư', 'Xác thực đúng mới chỉ là vé vào cửa.', [
      ['uy-tin', 'How mailbox providers judge you: IP reputation, domain reputation, engagement', 'Nhà cung cấp hộp thư đánh giá bạn thế nào: uy tín IP, uy tín tên miền, mức tương tác', 'Tỉ lệ khiếu nại, bounce, mở/xoá không đọc · Tên miền quan trọng hơn IP ngày nay · Tên miền mới chưa có lịch sử'],
      ['rdns', 'Reverse DNS, HELO names and IP basics', 'Reverse DNS, tên HELO và cơ bản về IP', 'PTR khớp tên HELO khớp A (FCrDNS) · IP dùng chung vs IP riêng · IPv6 và thư'],
      ['blocklist', 'Blocklists: Spamhaus and others, checking and delisting', 'Danh sách chặn: Spamhaus và các danh sách khác, kiểm tra và gỡ tên', 'Tra IP/tên miền · Vì sao bị liệt kê · Quy trình gỡ · Dải IP VPS có tiếng xấu sẵn'],
      ['lam-am', 'Warming up a new IP or domain, and sending volume patterns', 'Làm ấm IP hoặc tên miền mới, và nhịp gửi thư', 'Tăng dần khối lượng · Gửi cho người tương tác nhiều trước · Tách tên miền con cho giao dịch và marketing'],
      ['cong-cu', 'Measuring: Google Postmaster Tools, Microsoft SNDS, seed tests, mail-tester', 'Đo lường: Google Postmaster Tools, Microsoft SNDS, thử bằng hộp thư mẫu, mail-tester', 'Tỉ lệ spam theo Gmail · Ngưỡng khiếu nại của quy định người gửi hàng loạt · Đo trước và sau mỗi thay đổi'],
    ]],
    ['Chapter 5 — Transactional email providers', 'Chương 5 — Nhà cung cấp gửi thư giao dịch', 'Thuê hạ tầng đã có uy tín thay vì tự xây.', [
      ['giao-dich-marketing', 'Transactional vs marketing mail: different rules, different streams', 'Thư giao dịch vs thư marketing: luật khác, luồng khác', 'OTP, hoá đơn vs bản tin · Tách luồng/tên miền con để một cái không kéo cái kia xuống · Đồng ý và huỷ đăng ký'],
      ['chon', 'Choosing a provider: Amazon SES, Resend, Postmark, SendGrid, Mailgun, Brevo', 'Chọn nhà cung cấp: Amazon SES, Resend, Postmark, SendGrid, Mailgun, Brevo', 'Giá theo nghìn thư · API vs SMTP relay · Webhook và nhật ký · Khu vực máy chủ và quyền riêng tư · Kiểm bảng giá mới nhất'],
      ['ses', 'Setting up Amazon SES: leaving the sandbox, DKIM, custom MAIL FROM', 'Cấu hình Amazon SES: ra khỏi sandbox, DKIM, MAIL FROM riêng', 'Xác minh tên miền · Xin tăng hạn mức · Configuration set và sự kiện · SNS nhận bounce'],
      ['resend-postmark', 'Setting up Resend or Postmark with Cloudflare DNS', 'Cấu hình Resend hoặc Postmark với Cloudflare DNS', 'Bản ghi cần thêm · Kiểm trạng thái xác minh · Khoá API phạm vi gửi-thôi · Môi trường thử'],
    ]],
    ['Chapter 6 — Sending from your application', 'Chương 6 — Gửi thư từ ứng dụng của bạn', 'Code gửi thư đúng cách: không chặn request, không gửi trùng, không mất thư.', [
      ['node', 'Node.js: Nodemailer vs provider SDKs', 'Node.js: Nodemailer vs SDK của nhà cung cấp', 'SMTP pool · SDK Resend/SES · Timeout và lỗi tạm thời · Không để khoá API trong frontend'],
      ['spring', 'Spring Boot: JavaMailSender, templates with Thymeleaf, async sending', 'Spring Boot: JavaMailSender, template với Thymeleaf, gửi bất đồng bộ', 'Cấu hình spring.mail · @Async vs hàng đợi · Gửi thư xác thực trong LabFlow'],
      ['hang-doi', 'Queues, retries and idempotency for email', 'Hàng đợi, thử lại và tính idempotent cho email', 'Gửi sau khi transaction commit (outbox) · Thử lại với backoff · Khoá chống gửi trùng · Trỏ khoá Queues & Background Jobs'],
      ['webhook', 'Bounces, complaints and suppression lists via webhooks', 'Bounce, khiếu nại và danh sách chặn qua webhook', 'Hard vs soft bounce · Khiếu nại spam là tín hiệu nặng nhất · Tự thêm vào danh sách chặn · Xác minh chữ ký webhook'],
      ['bao-mat', 'Security of auth emails: token expiry, link hijacking, rate limits, enumeration', 'Bảo mật của thư xác thực: hết hạn token, chiếm link, giới hạn tần suất, dò tài khoản', 'Token một lần, hạn ngắn · Host header injection trong link đặt lại mật khẩu · Giới hạn gửi theo người/IP · Không tiết lộ email có tồn tại · Trỏ khoá Xác thực'],
    ]],
    ['Chapter 7 — Templates, content and compliance', 'Chương 7 — Template, nội dung và tuân thủ', 'Thư hiển thị đúng ở mọi nơi và đúng luật.', [
      ['html', 'HTML email is its own world: tables, inline CSS, dark mode, Outlook', 'HTML email là một thế giới riêng: bảng, CSS inline, chế độ tối, Outlook', 'Vì sao flexbox không dùng được · Outlook dùng engine Word · Ảnh bị chặn mặc định · Bản text thay thế'],
      ['mjml', 'Building templates with MJML or React Email', 'Dựng template với MJML hoặc React Email', 'Component tái sử dụng · Xem trước và test trên nhiều ứng dụng mail · Song ngữ Việt/Anh · Lưu template theo phiên bản'],
      ['noi-dung', 'Content that avoids spam filters without tricks', 'Nội dung tránh bộ lọc spam mà không dùng mẹo', 'Tỉ lệ chữ/ảnh · Link rút gọn và tên miền lạ · Tiêu đề trung thực · Rspamd/SpamAssassin cho điểm thế nào'],
      ['huy-dang-ky', 'Unsubscribe, List-Unsubscribe one-click and consent records', 'Huỷ đăng ký, List-Unsubscribe một chạm và lưu bằng chứng đồng ý', 'RFC 8058 · Bắt buộc với người gửi hàng loạt tới Gmail/Yahoo · Luật chống thư rác và quyền riêng tư (kiểm văn bản hiện hành) · Trỏ khoá Quyền riêng tư & pháp lý dữ liệu'],
    ]],
    ['Chapter 8 — Receiving email', 'Chương 8 — Nhận thư', 'Hộp thư cho tên miền và thư đến cho ứng dụng.', [
      ['email-routing', 'Cloudflare Email Routing and forwarding pitfalls', 'Cloudflare Email Routing và cái bẫy của chuyển tiếp', 'Chuyển thư về Gmail · SRS và vì sao chuyển tiếp hỏng SPF · Email Workers xử lý thư đến'],
      ['inbound', 'Inbound parsing for apps: replies, support tickets, email-to-task', 'Phân tích thư đến cho ứng dụng: trả lời, ticket hỗ trợ, email thành việc', 'Webhook inbound của nhà cung cấp · Tách phần trả lời khỏi trích dẫn · Tệp đính kèm lên R2 · Kiểm độc hại'],
      ['hop-thu', 'Hosted mailboxes: Google Workspace, Microsoft 365, Zoho, Fastmail compared', 'Hộp thư thuê ngoài: so sánh Google Workspace, Microsoft 365, Zoho, Fastmail', 'Giá và giới hạn · Bí danh và nhóm · Kết hợp với dịch vụ gửi thư giao dịch trong một SPF'],
    ]],
    ['Chapter 9 — Self-hosting a mail server, and why it is hard', 'Chương 9 — Tự host mail server, và vì sao nó khó', 'Làm được — nhưng biết cái giá trước khi làm.', [
      ['vi-sao-kho', 'Why most small teams should not: port 25, reputation, maintenance, security', 'Vì sao đa số đội nhỏ không nên: cổng 25, uy tín, bảo trì, bảo mật', 'Nhà cung cấp VPS chặn cổng 25 · IP mới không có uy tín · Cập nhật bảo mật liên tục · ProxyLogon 2021 là lời nhắc · Khi nào tự host là hợp lý'],
      ['postfix', 'Postfix, Dovecot and Rspamd: the classic stack', 'Postfix, Dovecot và Rspamd: bộ cổ điển', 'Postfix gửi/nhận · Dovecot lưu và phục vụ IMAP · Rspamd lọc spam và ký DKIM · Chứng chỉ Let’s Encrypt'],
      ['mailcow', 'All-in-one with Mailcow or Mail-in-a-Box on Docker', 'Trọn gói với Mailcow hoặc Mail-in-a-Box trên Docker', 'Dựng trên VPS lab · Giao diện quản trị · Sao lưu hộp thư · Tài nguyên cần có'],
      ['open-relay', 'Operating safely: open relays, compromised accounts, rate limits, monitoring', 'Vận hành an toàn: open relay, tài khoản bị chiếm, giới hạn tần suất, giám sát', 'Kiểm máy chủ không phải open relay · Tài khoản bị lộ mật khẩu phát spam · Giới hạn gửi theo người · Cảnh báo hàng đợi phình'],
    ]],
    ['Chapter 10 — Spoofing, phishing and protecting your brand', 'Chương 10 — Giả mạo, lừa đảo và bảo vệ thương hiệu', 'Chặn người khác mạo danh tên miền của bạn.', [
      ['gia-mao', 'How spoofing works: exact-domain, lookalike domains, display-name tricks', 'Giả mạo hoạt động thế nào: đúng tên miền, tên miền nhìn giống, mẹo tên hiển thị', 'DMARC p=reject chặn giả đúng tên miền · Tên miền nhìn giống (homoglyph, đuôi khác) · Tên hiển thị là "Ngân hàng" nhưng địa chỉ lạ'],
      ['bec', 'Business email compromise: case studies and defences', 'Lừa đảo email doanh nghiệp (BEC): tình huống và cách phòng', 'Vụ Ubiquiti 2015 · Kịch bản giả sếp yêu cầu chuyển tiền · Quy trình xác minh ngoài kênh email · Đào tạo người dùng'],
      ['phong-thu', 'Defensive setup: DMARC everywhere, parked domains, lookalike monitoring', 'Thiết lập phòng thủ: DMARC ở mọi tên miền, tên miền không dùng, theo dõi tên miền nhìn giống', 'SPF -all và DMARC reject cho tên miền không gửi thư · Theo dõi tên miền mới đăng ký giống tên mình · Báo cáo lừa đảo'],
    ]],
    ['Chapter 11 — Capstone: complete email infrastructure for a real domain', 'Chương 11 — Dự án cuối khoá: hạ tầng email hoàn chỉnh cho một tên miền thật', 'Một tên miền kiểu cuongthai.com và LabFlow gửi và nhận thư đúng chuẩn.', [
      ['dns', 'DNS: MX, SPF, DKIM for two providers, DMARC with reports, MTA-STS, TLS-RPT, BIMI-ready', 'DNS: MX, SPF, DKIM cho hai nhà cung cấp, DMARC có báo cáo, MTA-STS, TLS-RPT, sẵn sàng BIMI', 'Tên miền con cho giao dịch và bản tin · Quản bằng Terraform (trỏ khoá Infrastructure as Code) · Kiểm bằng dig và công cụ online'],
      ['ung-dung', 'Application: queued sending from Node.js and Spring Boot, webhooks, suppression, templates', 'Ứng dụng: gửi qua hàng đợi từ Node.js và Spring Boot, webhook, danh sách chặn, template', 'Thư xác thực và đặt lại mật khẩu an toàn · Template song ngữ · Huỷ đăng ký một chạm cho bản tin'],
      ['nhan', 'Receiving: Email Routing to a team inbox and inbound parsing to tickets', 'Nhận thư: Email Routing về hộp thư đội và phân tích thư đến thành ticket', 'support@ về hộp thư chung · Thư trả lời vào hệ thống việc · Chặn thư độc hại'],
      ['nghiem-thu', 'Acceptance: DMARC to p=reject, 10/10 on mail-tester, Postmaster data, runbook', 'Nghiệm thu: DMARC lên p=reject, 10/10 trên mail-tester, số liệu Postmaster, sổ tay vận hành', 'Lộ trình nâng DMARC theo báo cáo thật · Chụp kết quả trước/sau · Sổ tay: làm gì khi bị vào spam, khi bị giả mạo'],
    ]],
    ['Chapter 12 — Troubleshooting and interviews', 'Chương 12 — Gỡ rối và phỏng vấn', 'Những câu hỏi thực tế nhất về email.', [
      ['go-roi', 'Troubleshooting playbook: not delivered, in spam, delayed, broken in Outlook', 'Sổ tay gỡ rối: không tới, vào spam, tới chậm, vỡ trên Outlook', 'Đọc Authentication-Results · Tra nhật ký nhà cung cấp · Mã lỗi 4xx/5xx thường gặp · Kiểm danh sách chặn'],
      ['cau-hoi', 'Interview questions: SPF vs DKIM vs DMARC, designing a notification service', 'Câu hỏi phỏng vấn: SPF vs DKIM vs DMARC, thiết kế dịch vụ thông báo', 'Giải thích căn chỉnh DMARC · Thiết kế gửi một triệu thư có thử lại và chống trùng · Xử lý bounce'],
      ['di-tiep', 'Going further: M3AAWG practices, deliverability as a career, related courses', 'Đi tiếp: thực hành M3AAWG, nghề deliverability, các khoá liên quan', 'Tài liệu M3AAWG · Nghề chuyên về deliverability · Khoá Quyền riêng tư, DevSecOps, Infrastructure as Code'],
    ]],
  ]),
};
