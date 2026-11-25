/**
 * Làm việc nhóm phần mềm — Chương 10: An ninh thông tin khi đi làm (soạn 24/11/2026, agent agl).
 * Slug + title chương GIỮ NGUYÊN theo khung trong ../agile-teamwork.mjs (agl-10-1-nda … agl-10-9-quiz), ghép bằng ghep().
 * Nội dung từng bài ở ./s10/b*.mjs; mã lab + output THẬT ở ./s10/_ma.mjs (sinh bởi scratchpad/agl/lab/ch10/tao-ma.mjs từ chính các tệp đã chạy:
 * gitleaks v8.30.1 trong docker không mạng, Node 22.22.2, OpenSSH, tcpdump trong netns riêng, LibreOffice headless).
 * Góc người XÂY hệ thống (xác thực, quét bí mật cấp đội) không giảng lại — liên kết authentication, git, devsecops, privacy-data-law.
 */
import { Q } from './_chung.mjs';
import { L101 } from './s10/b1-nda.mjs';
import { L102 } from './s10/b2-isms.mjs';
import { L103 } from './s10/b3-du-lieu-khach.mjs';
import { L104 } from './s10/b4-thiet-bi.mjs';
import { L105 } from './s10/b5-tai-khoan.mjs';
import { L106 } from './s10/b6-lua-dao.mjs';
import { L107 } from './s10/b7-su-co-that.mjs';
import { L108 } from './s10/b8-lab.mjs';

const hai = (L) => L(true) + L(false);

const QUIZ10 = [
  Q('agl10-1', 'You finished your internship last month. Your NDA…|||Bạn đã kết thúc thực tập tháng trước. NDA của bạn…', [
    'Ended with the internship|||Hết hiệu lực cùng kỳ thực tập',
    'Usually still applies for the period stated in it, sometimes indefinitely for trade secrets|||Thường vẫn còn hiệu lực trong thời hạn ghi trong đó, có khi vô thời hạn với bí mật kinh doanh',
    'Only applies to printed documents|||Chỉ áp dụng cho tài liệu in',
    'Applies only if the customer is Japanese|||Chỉ áp dụng nếu khách là người Nhật',
  ], 1, 'Confidentiality obligations normally survive termination. Lesson 10.1.|||Nghĩa vụ bảo mật thường còn sau khi chấm dứt hợp đồng. Bài 10.1.'),
  Q('agl10-2', 'Which CV line is safe under a typical NDA?|||Dòng CV nào an toàn với một NDA thông thường?', [
    '"Built the booking system for Sakura Clinic (project SKR-2026)"|||"Làm hệ thống đặt lịch cho Sakura Clinic (dự án SKR-2026)"',
    '"Appointment booking system for a Japanese clinic chain, ~50 screens; wrote 120 UT cases"|||"Hệ thống đặt lịch khám cho một chuỗi phòng khám Nhật, ~50 màn hình; viết 120 UT case"',
    'A screenshot of the real UI|||Ảnh chụp giao diện thật',
    'A link to a private repo with the customer code|||Liên kết tới repo private có mã của khách',
  ], 1, 'Domain, scale, role and results — no customer name, code names or screenshots. Lesson 10.1.|||Lĩnh vực, quy mô, vai trò, kết quả — không tên khách, tên mã hay ảnh chụp. Bài 10.1.'),
  Q('agl10-3', 'A customer document has no classification label. How do you treat it?|||Tài liệu của khách không có nhãn phân loại. Bạn xử lý thế nào?', [
    'Public|||Public', 'Internal|||Internal', 'Confidential|||Confidential', 'Ask the customer to label it before reading|||Đòi khách gắn nhãn rồi mới đọc',
  ], 2, 'No label on a customer document ⇒ treat as Confidential. Lesson 10.2.|||Tài liệu khách không có nhãn ⇒ coi là Confidential. Bài 10.2.'),
  Q('agl10-4', 'You hid the "internal pricing" sheet before e-mailing the estimate to the customer. Is the pricing protected?|||Bạn đã ẩn sheet "giá nội bộ" trước khi email bảng ước lượng cho khách. Giá đã được bảo vệ chưa?', [
    'Yes — hidden sheets cannot be opened|||Rồi — sheet ẩn không mở được',
    'No — the sheet and the author\'s name are still inside the file; delete it and inspect the document|||Chưa — sheet và tên người soạn vẫn nằm trong tệp; phải xoá và chạy soát tài liệu',
    'Yes, if the file is .xlsx|||Rồi, nếu tệp là .xlsx',
    'Only if the customer uses LibreOffice|||Chỉ khi khách dùng LibreOffice',
  ], 1, 'In the lab the hidden sheet text and dc:creator were read straight from the ZIP. Lesson 10.2.|||Trong lab, chữ của sheet ẩn và dc:creator đọc thẳng được từ tệp ZIP. Bài 10.2.'),
  Q('agl10-5', 'Your project has not approved any AI tool. You want help with an error from the customer\'s staging server. Best action?|||Dự án chưa duyệt công cụ AI nào. Bạn cần giúp với một lỗi từ server staging của khách. Làm gì là tốt nhất?', [
    'Paste the stack trace into your personal chatbot account|||Dán stack trace vào tài khoản chatbot cá nhân',
    'Paste it, but delete the conversation afterwards|||Dán, nhưng xoá cuộc trò chuyện sau đó',
    'Ask your leader; reproduce with fake data; use only approved tools|||Hỏi leader; tái hiện bằng dữ liệu giả; chỉ dùng công cụ được duyệt',
    'Send it to a classmate who is good at Spring|||Gửi cho bạn cùng lớp giỏi Spring',
  ], 2, 'Data leaves the company the moment you paste it — Samsung 2023. Lesson 10.3.|||Dữ liệu rời công ty ngay khi bạn dán — Samsung 2023. Bài 10.3.'),
  Q('agl10-6', 'Why is SHA-256 of an e-mail address not anonymous?|||Vì sao SHA-256 của email không phải ẩn danh?', [
    'SHA-256 is broken|||SHA-256 đã bị phá',
    'Anyone with a list of candidate e-mails can hash them and compare|||Ai có danh sách email ứng viên cũng băm lại và so được',
    'It is too long|||Nó quá dài',
    'It is anonymous|||Nó là ẩn danh',
  ], 1, 'Unkeyed hashes are reversible by guessing; keyed HMAC is pseudonymisation, still personal data. Lesson 10.3.|||Băm không khoá đoán ngược được; HMAC có khoá là giả danh, vẫn là dữ liệu cá nhân. Bài 10.3.'),
  Q('agl10-7', 'Your work laptop was left on a bus. When do you tell IT/security?|||Laptop công ty để quên trên xe buýt. Khi nào báo IT/an ninh?', [
    'After searching for a day or two|||Sau khi tự tìm một hai ngày',
    'Only if it was not encrypted|||Chỉ khi máy chưa mã hoá',
    'Within minutes, together with contacting the bus company|||Trong vài phút, song song với việc gọi nhà xe',
    'Never, if it turns up|||Không cần, nếu tìm lại được',
  ], 2, 'IT can lock/wipe and revoke sessions only once they know. Lesson 10.4.|||IT chỉ khoá/xoá máy và thu hồi phiên được khi họ biết. Bài 10.4.'),
  Q('agl10-8', 'At midnight you receive five GitHub login approval prompts you did not trigger. What do you do?|||Nửa đêm bạn nhận năm yêu cầu duyệt đăng nhập GitHub mà mình không tạo. Bạn làm gì?', [
    'Approve one so they stop|||Duyệt một cái cho nó thôi',
    'Deny all, change the password, check sessions and security log, report|||Từ chối hết, đổi mật khẩu, xem phiên và security log, báo cáo',
    'Ignore them until morning|||Kệ tới sáng',
    'Turn off 2FA to stop the prompts|||Tắt 2FA để hết thông báo',
  ], 1, 'MFA fatigue — Uber 2022. Lesson 10.5.|||Dội thông báo MFA — Uber 2022. Bài 10.5.'),
  Q('agl10-9', 'An e-mail shows "From: Tanaka (Sakura Clinic PM)" but Reply-To is a different domain and DMARC=fail. It asks for the test DB today. Best response?|||Email hiện "From: Tanaka (Sakura Clinic PM)" nhưng Reply-To là tên miền khác và DMARC=fail. Nó xin DB test ngay hôm nay. Phản ứng tốt nhất?', [
    'Reply asking for confirmation|||Trả lời để xin xác nhận',
    'Send it — the name is correct|||Gửi — tên đúng mà',
    'Do not reply; report it as phishing and verify with your leader/BrSE through the known channel|||Không trả lời; báo là lừa đảo và xác minh với leader/BrSE qua kênh đã biết',
    'Forward it to the whole team to warn them|||Chuyển tiếp cho cả đội để cảnh báo',
  ], 2, 'Replying goes to the attacker (Reply-To); verify through a second channel. Lesson 10.6.|||Trả lời là gửi cho kẻ gian (Reply-To); xác minh qua kênh thứ hai. Bài 10.6.'),
  Q('agl10-10', 'You pushed an AWS key yesterday and noticed today. What comes FIRST?|||Hôm qua bạn push nhầm một khoá AWS, hôm nay mới phát hiện. Việc nào làm TRƯỚC TIÊN?', [
    'Rewrite history with git filter-repo and force-push|||Viết lại lịch sử bằng git filter-repo rồi force-push',
    'Delete the file in a new commit|||Xoá tệp trong một commit mới',
    'Report and revoke/rotate the key, then check usage logs|||Báo cáo và thu hồi/xoay khoá, rồi xem log sử dụng',
    'Make the repo private and say nothing|||Chuyển repo sang private và im lặng',
  ], 2, 'Rotation stops the damage; history cleanup does not remove copies — Uber 2016, Toyota 2022. Lesson 10.7.|||Xoay khoá mới chặn được thiệt hại; dọn lịch sử không xoá được bản sao — Uber 2016, Toyota 2022. Bài 10.7.'),
];

const BAI = (so, en, vi, slug, desc, L) => ({ title: `10.${so} — ${en}|||10.${so} — ${vi}`, slug, type: 'LESSON', isFreePreview: true, description: desc, content: hai(L) });

export default {
  title: 'Chapter 10 — Information security at work|||Chương 10 — An ninh thông tin khi đi làm',
  description: 'Những gì bạn ký ngày đầu và cách không vi phạm: NDA, ISO 27001 cho nhân viên, dữ liệu khách và AI, thiết bị và mạng, vệ sinh tài khoản, lừa đảo nhắm vào dev, năm sự cố thật — kèm lab quét bí mật bằng gitleaks và tự kiểm an ninh cá nhân.',
  lessons: [
    BAI(1, 'NDAs and what you may say: social media, CV, GitHub, interviews', 'NDA và những gì được nói: mạng xã hội, CV, GitHub, phỏng vấn', 'agl-10-1-nda',
      'NDA công ty–khách và công ty–bạn, điều khoản thường gặp, được/không được nói ở từng nơi, viết CV không lộ, soát repo portfolio (chạy thật: tên khách, IP nội bộ, email công ty trong lịch sử), OSINT, vụ mã nguồn Twitter trên GitHub 2023.', L101),
    BAI(2, 'ISMS and ISO 27001 for employees: classification, clean desk, reporting', 'ISMS và ISO 27001 cho nhân viên: phân loại tài liệu, bàn làm việc sạch, báo cáo sự cố', 'agl-10-2-isms',
      'ISO/IEC 27001:2022 (93 biện pháp, 6 cái về bạn), bộ ba CIA bằng bệnh án, nhãn và cách xử lý, bàn sạch/màn hình sạch, sheet ẩn + tên người soạn đọc thẳng từ .xlsx (chạy thật), báo cáo sự kiện, đi ké qua cửa.', L102),
    BAI(3, 'Customer data and code: no copying out, no personal repos, no public AI', 'Dữ liệu và mã của khách: không mang ra, không repo cá nhân, không AI công cộng', 'agl-10-3-du-lieu-khach',
      'Ba quy tắc, Samsung 04/2023, AI bản cá nhân vs doanh nghiệp, bộ soát trước khi dán (chạy thật), làm giả dữ liệu bằng HMAC và vì sao băm trần dò ngược được, giả danh ≠ ẩn danh, Luật 91/2025/QH15.', L103),
    BAI(4, 'Devices and networks: USB, VPN, public Wi-Fi — and losing your laptop', 'Thiết bị và mạng: USB, VPN, Wi-Fi công cộng — và khi mất laptop', 'agl-10-4-thiet-bi',
      'Vụ USB Amagasaki 2022, ổ không mã hoá vs mã hoá (chạy thật), nghe lén mật khẩu HTTP vs HTTPS trong netns (chạy thật), VPN, máy ở nhà và vụ LastPass 2022, giờ đầu tiên khi mất laptop.', L104),
    BAI(5, 'Personal account hygiene: password manager, 2FA, SSH keys, scoped tokens', 'Vệ sinh tài khoản cá nhân: trình quản lý mật khẩu, 2FA, SSH key, token phạm vi hẹp', 'agl-10-5-tai-khoan',
      'Trình quản lý mật khẩu và NIST 800-63B-4, chọn yếu tố 2FA, MFA fatigue (Uber 2022), kiểm kê SSH key có/không passphrase (chạy thật), PAT cổ điển vs fine-grained, hai danh tính, lịch soát 3 tháng.', L105),
    BAI(6, 'Phishing and social engineering aimed at developers', 'Lừa đảo và tấn công phi kỹ thuật nhắm vào lập trình viên', 'agl-10-6-lua-dao',
      'Bản đồ kiểu tấn công, đọc header email giả (chạy thật), phỏng vấn giả Contagious Interview 2023–, postinstall đọc khoá ngay lúc npm install (chạy thật), crossenv 2017 và kiểm tên na ná, xác minh kênh thứ hai.', L106),
    BAI(7, 'Real leaks and what they teach: secrets in public repos, lost devices, pasted code', 'Sự cố rò rỉ thật và bài học: bí mật trong repo công khai, mất thiết bị, dán code', 'agl-10-7-su-co-that',
      'Uber 2016 (FTC), Toyota T-Connect 2017–2022, CircleCI 2023, bảng điểm chung; tái hiện khoá trong lịch sử, gitleaks dir vs git, bộ quét 40 dòng tự viết (bắt được thứ gitleaks bỏ sót), hook pre-commit, thứ tự xử lý khi đã lộ.', L107),
    BAI(8, 'Lab: Your personal security check-up', 'Lab: Tự kiểm tra an ninh cá nhân', 'agl-10-8-lab',
      'Sáu sản phẩm trên tài khoản thật: quét bí mật mọi repo, hook pre-commit có chứng minh, soát GitHub, kiểm kê key/token, laptop, kế hoạch mất laptop + soát portfolio; mẫu báo cáo, rubric 100 điểm, bài mẫu.', L108),
    {
      title: '10.9 — Chapter 10 quiz|||10.9 — Kiểm tra Chương 10',
      slug: 'agl-10-9-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: NDA sau khi nghỉ, viết CV, tài liệu không nhãn, sheet ẩn, AI và dữ liệu khách, băm trần, mất laptop, MFA fatigue, email giả mạo, thứ tự xử lý khoá bị lộ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chương này. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ10 },
    },
  ],
};
