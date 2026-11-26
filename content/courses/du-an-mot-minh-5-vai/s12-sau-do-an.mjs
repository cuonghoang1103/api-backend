/**
 * Chương 12 — Sau đồ án & tổng kết khoá (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 5 bài kiến thức & cẩm nang (12.1–12.5), 1 bài Lab thực hành trên CT Work (12.6, dm5-12-lab),
 * 1 Đề thực hành cuối khoá kiểu PE 120 phút (12.7, dm5-12-de-cuoi) và bài Kiểm tra tổng kết khoá 15 câu (12.8, dm5-12-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s12/b1-sang-doi-that.mjs';
import B2 from './s12/b2-bang-chung-nang-luc.mjs';
import B3 from './s12/b3-doi-de-tai-tmdt.mjs';
import B4 from './s12/b4-quy-mo-doanh-nghiep.mjs';
import B5 from './s12/b5-bo-cong-cu-mang-theo.mjs';
import B6 from './s12/b6-lab.mjs';
import B7 from './s12/b7-de-cuoi.mjs';

const QUIZ12 = [
  Q('dm5-12-q1',
    'According to Brooks\'s Law (1975), when you move from a solo 5-hat project (n = 1) to a real 5-person SEP490 team (n = 5), how many external communication paths exist and which habit MUST change on Day 1?|||Theo Định luật Brooks (1975), khi bạn chuyển từ dự án 1 người 5 mũ (n = 1) sang nhóm SEP490 5 người thật (n = 5), có bao nhiêu đường giao tiếp và thói quen nào BẮT BUỘC phải đổi ngay Ngày 1?',
    [
      '5 paths; you should silently rewrite teammates\' rough PRs at 2 a.m. so velocity stays high|||5 đường; bạn nên âm thầm viết lại PR còn yếu của đồng đội lúc 2 giờ sáng để giữ tốc độ',
      '10 paths [n(n−1)/2]; keep the process skeleton (DoD, vertical slices, CI, RTM) but switch to 5 real accounts, peer review buddies (≥ 2 reviewers), a signed Working Agreement, and coaching reviews instead of doing their code for them|||10 đường [n(n−1)/2]; giữ nguyên xương sống quy trình (DoD, miền dọc, CI, RTM) nhưng chuyển sang 5 tài khoản thật, cặp review chéo (≥ 2 người duyệt), Thoả thuận làm việc có ký và review dẫn dắt thay vì làm hộ',
      '0 paths as long as everyone uses the same shared leader account|||0 đường miễn cả nhóm dùng chung một tài khoản trưởng nhóm',
      '25 paths; drop vertical slices and assign 2 people to Backend, 2 to Frontend, and 1 to Word documents|||25 đường; bỏ miền dọc và chia 2 người làm Backend, 2 người Frontend, 1 người viết Word',
    ],
    1,
    'n(n−1)/2 = 5×4/2 = 10 communication paths. Solo veterans fail real teams when they act as a bottleneck hero instead of enforcing Dual Ownership, peer review buddies, and disciplined repo-split onboarding. Lesson 12.1.|||n(n−1)/2 = 5×4/2 = 10 kênh giao tiếp. Người từng làm solo hay vấp ở đội thật nếu ôm việc làm anh hùng thay vì áp dụng Sở hữu Kép, cặp review chéo và onboarding bài bản khi tách repo. Bài 12.1.'),

  Q('dm5-12-q2',
    'When transitioning from a solo v1 prototype (e.g., LabFlow v1) into a real 5-person SEP490 Capstone team, what does the Repo-Split & Inheritance Declaration rule require?|||Khi chuyển từ bản prototype solo v1 (vd LabFlow v1) sang nhóm đồ án tốt nghiệp SEP490 5 người thật, quy tắc Tách repo & khai báo kế thừa quy định gì?',
    [
      'Force-push all 10,000 lines of solo code into Commit #1 and tell teammates to just polish the CSS|||Force-push toàn bộ 10.000 dòng code solo vào Commit #1 rồi bảo đồng đội chỉ cần sửa CSS',
      'Confirm inheritance rules with the supervisor in Week 1, treat the prototype as reference material, start a fresh team repository with balanced vertical-slice ownership, and declare any reused baseline transparently in Report 1/Report 7|||Xác nhận luật kế thừa với giảng viên ngay Tuần 1, xem prototype là tài liệu tham chiếu, dựng repo nhóm mới với miền dọc cân bằng và công khai minh bạch mọi phần kế thừa trong Report 1/Report 7',
      'Hide the existence of the v1 prototype completely from your supervisor|||Giấu kín sự tồn tại của bản prototype v1 với giảng viên',
      'Share one admin password in the team chat so everyone can deploy fast|||Dùng chung một mật khẩu admin trong nhóm chat để ai cũng deploy cho nhanh',
    ],
    1,
    'Repo-split & transparent inheritance declaration protects academic integrity AND gives every teammate genuine code ownership so all 5 can defend confidently. Lesson 12.1 & 11.5.|||Tách repo & khai báo kế thừa minh bạch vừa bảo vệ liêm chính học thuật vừa giúp cả 5 thành viên thật sự làm chủ code để bảo vệ tự tin. Bài 12.1 & 11.5.'),

  Q('dm5-12-q3',
    'Which CV bullet best applies Google\'s XYZ Formula AND stays 100% honest about a solo 5-role project?|||Dòng CV nào áp dụng chuẩn nhất Công thức XYZ của Google ĐỒNG THỜI trung thực 100% về dự án 1 người đóng 5 vai?',
    [
      '"Led a 5-developer agile team building LabFlow AI with Spring Boot, React, Microservices, and Kubernetes."|||"Dẫn dắt đội Agile 5 lập trình viên xây LabFlow AI bằng Spring Boot, React, Microservices và Kubernetes."',
      '"Participated in building a lab booking web app and learned Git and PostgreSQL."|||"Tham gia làm web đặt phòng lab và học Git cùng PostgreSQL."',
      '"Eliminated double-booking race conditions [X] verified under 50 concurrent integration-test requests with 0 conflicts leaked [Y], by enforcing PostgreSQL tstzrange exclusion constraints and modular-monolith boundaries in a hand-coded solo 5-role project [Z]."|||"Triệt tiêu lỗi tranh chấp đặt trùng [X] được kiểm chứng dưới 50 request test tích hợp đồng thời với 0 xung đột lọt [Y], bằng ràng buộc loại trừ tstzrange trên PostgreSQL và ranh giới modular monolith trong dự án tự code tay mô phỏng 5 vai [Z]."',
      '"Built 100% bug-free enterprise AI platform with 99.999% uptime."|||"Xây dựng nền tảng AI doanh nghiệp không lỗi 100% với uptime 99,999%."',
    ],
    2,
    'Strong XYZ bullets pair measurable verifiable outcomes with concrete engineering actions while being completely honest about solo scope and real tech stack. Lesson 12.2.|||Dòng CV XYZ mạnh ghép kết quả đo kiểm chứng được với hành động kỹ thuật cụ thể và trung thực tuyệt đối về phạm vi làm một mình lẫn công nghệ thật. Bài 12.2.'),

  Q('dm5-12-q4',
    'Before making a university project repository public — or writing about your OJT work on a CV — which security & NDA check is MANDATORY?|||Trước khi bật chế độ công khai cho repo đồ án — hoặc viết về công việc OJT lên CV — bước kiểm tra bảo mật & NDA nào là BẮT BUỘC?',
    [
      'Only delete the local .env file on your desktop without checking git history|||Chỉ cần xoá file .env hiện tại trên máy mà không cần soát lịch sử git',
      'Scan full git history for leaked secrets/keys (rotate first, then scrub history if found), replace real PII with synthetic demo data, and NEVER publish client code, schemas, or screenshots covered by an OJT/company NDA|||Quét toàn bộ lịch sử git tìm khoá bí mật bị lộ (đổi khoá trước rồi xoá khỏi lịch sử nếu dính), thay PII thật bằng dữ liệu giả, và TUYỆT ĐỐI không đăng code, lược đồ hay ảnh màn hình khách hàng thuộc NDA công ty/OJT',
      'Upload screenshots of your OJT client\'s internal Jira board so recruiters see you worked on a big project|||Đăng ảnh chụp bảng Jira nội bộ của khách hàng OJT để nhà tuyển dụng thấy bạn làm dự án lớn',
      'Keep your real Gmail and university phone number inside seed.sql so recruiters can call you|||Giữ email cá nhân và số điện thoại thật trong seed.sql để nhà tuyển dụng tiện gọi',
    ],
    1,
    'Secrets inside past git commits stay exploitable even after deleting the file in HEAD (GitGuardian 2024), and leaking NDA client assets can end an OJT/job immediately. Lesson 12.2.|||Bí mật từng nằm trong commit cũ vẫn bị khai thác dù bạn xoá file ở HEAD (GitGuardian 2024), còn làm lộ tài sản khách hàng dưới NDA có thể khiến bạn mất việc ngay lập tức. Bài 12.2.'),

  Q('dm5-12-q5',
    'Your lecturer switches your topic on Monday to a Multi-Vendor E-Commerce Marketplace ("ShopFlow"). Which combination protects BOTH inventory accuracy under flash-sale load AND payment integrity?|||Thứ Hai giảng viên đổi đề tài sang Sàn thương mại điện tử nhiều người bán ("ShopFlow"). Cặp cơ chế nào bảo vệ ĐỒNG THỜI tính chính xác tồn kho lúc flash sale VÀ tính toàn vẹn thanh toán?',
    [
      'Read stock_qty in Java, wait 100ms, then update; trust totalAmount and status="PAID" sent directly from the React checkout JSON|||Đọc stock_qty trong Java rồi mới update; tin tưởng totalAmount và status="PAID" gửi thẳng từ JSON của React',
      'Atomic conditional SQL stock guard (UPDATE skus SET stock_qty = stock_qty - :qty WHERE id = :id AND stock_qty >= :qty + CHECK >= 0), server-side SKU price lookup, HMAC-verified payment webhook, and UNIQUE(provider_tx_id) idempotency|||Cập nhật trừ kho nguyên tử ở SQL (UPDATE skus SET stock_qty = stock_qty - :qty WHERE id = :id AND stock_qty >= :qty + CHECK >= 0), tính giá từ bảng SKU phía server, xác thực chữ ký HMAC cho webhook thanh toán và chống trùng bằng UNIQUE(provider_tx_id)',
      'Disable the Buy button in React after 1 click and skip database constraints|||Ẩn nút Mua trên React sau 1 cú bấm và bỏ qua ràng buộc CSDL',
      'Allow negative stock_qty and manually email buyers the next morning to apologize|||Cho phép tồn kho âm rồi sáng hôm sau gửi email xin lỗi khách hàng bằng tay',
    ],
    1,
    'Client-side price tampering, TOCTOU flash-sale overselling, and forged/replayed webhooks are the top three e-commerce attack vectors — all solved at the backend + DB invariant layer. Lesson 12.3.|||Sửa giá từ client, chạy đua TOCTOU bán âm kho và giả/lặp webhook là ba đòn tấn công lớn nhất trên TMĐT — đều phải chặn ở tầng backend + ràng buộc CSDL. Bài 12.3.'),

  Q('dm5-12-q6',
    'How does LabFlow AI\'s core engineering design map onto ShopFlow (Multi-Vendor E-Commerce)?|||Các mẫu kỹ thuật lõi của LabFlow AI ánh xạ sang ShopFlow (Sàn TMĐT) như thế nào?',
    [
      'Nothing transfers — you must throw away the entire process and start from scratch|||Không chuyển giao được gì — phải vứt bỏ toàn bộ quy trình và học lại từ đầu',
      'Core invariants transfer 1-to-1: LabFlow double-booking exclusion ↔ ShopFlow atomic stock guard; QR check-in idempotency ↔ Payment webhook dedup; No-show timeout job ↔ 15-min unpaid order restock job; Campus scope auth ↔ Seller shop_id isolation|||Các mẫu ràng buộc chuyển giao 1-1: chặn đặt trùng phòng lab ↔ trừ kho nguyên tử; chống quét lại QR ↔ chống lặp webhook thanh toán; job quá hạn no-show ↔ job quá hạn 15 phút hoàn kho; phân quyền cơ sở ↔ cô lập shop_id của người bán',
      'Only the CSS theme transfers; database and QA practices are completely unrelated|||Chỉ giữ được giao diện CSS; thiết kế CSDL và QA hoàn toàn không liên quan',
      'ShopFlow requires 15 microservices on Day 1 while LabFlow uses a monolith|||ShopFlow bắt buộc làm 15 microservices ngay Ngày 1 còn LabFlow dùng monolith',
    ],
    1,
    'Most software delivery mastery is domain-independent: once you own the underlying concurrency, idempotency, state-machine, and scope-auth patterns, pivoting domains takes days instead of months. Lesson 12.3.|||Phần lớn năng lực làm dự án không phụ thuộc đề tài: khi đã làm chủ mẫu đồng thời, idempotent, máy trạng thái và phân quyền phạm vi, đổi đề tài chỉ tính bằng ngày. Bài 12.3.'),

  Q('dm5-12-q7',
    'In a 60-person enterprise program (e.g., 6 Scrum squads), what is the primary purpose of Scrum of Scrums (or SAFe PI Planning at larger scale)?|||Trong chương trình doanh nghiệp 60 người (vd 6 đội Scrum), mục đích chính của Scrum of Scrums (hoặc SAFe PI Planning ở quy mô lớn hơn) là gì?',
    [
      'Let the CEO assign individual coding lines to every junior developer|||Để CEO giao từng dòng code cho từng lập trình viên junior',
      'Surface and synchronize cross-squad dependencies, shared API contract changes, and joint release risks before squads block each other|||Làm lộ sớm và đồng bộ các phụ thuộc liên đội, thay đổi hợp đồng API dùng chung và rủi ro phát hành chung trước khi các đội làm tắc nhau',
      'Replace unit testing and code reviews inside each squad|||Thay thế unit test và code review bên trong từng squad',
      'Merge all 60 people into a single 3-hour Daily Standup every morning|||Gộp cả 60 người vào một buổi Daily Standup dài 3 tiếng mỗi sáng',
    ],
    1,
    'At multi-squad scale (Conway\'s Law), cross-team dependencies become the #1 delay driver; Scrum of Scrums and PI Planning align interfaces and blockers across squads. Lesson 12.4.|||Ở quy mô nhiều đội (Định luật Conway), phụ thuộc liên đội trở thành nguyên nhân trễ số 1; Scrum of Scrums và PI Planning giúp đồng bộ giao diện và gỡ tắc giữa các đội. Bài 12.4.'),

  Q('dm5-12-q8',
    'What shared engineering lesson connects the Knight Capital trading meltdown (~$440–$460M lost in 45 min, 2012) and the CrowdStrike Falcon global outage (~8.5M Windows machines, 2024)?|||Bài học kỹ thuật chung nào kết nối thảm hoạ giao dịch Knight Capital (lỗ ~440–460 triệu USD trong 45 phút, 2012) và sự cố toàn cầu CrowdStrike Falcon (~8,5 triệu máy Windows, 2024)?',
    [
      'Both happened because the companies used PostgreSQL instead of MySQL|||Cả hai xảy ra vì các công ty dùng PostgreSQL thay vì MySQL',
      'Manual/inconsistent deploys, unvalidated content/config pushes, and rolling out globally without gradual Canary Rings + automated halt/rollback turn small flaws into catastrophic blast-radius failures|||Triển khai tay/lệch bản, đẩy cấu hình/nội dung thiếu kiểm biên và phát hành đồng loạt không qua vòng Canary tăng dần + cơ chế tự dừng/lùi bản biến lỗi nhỏ thành thảm hoạ diện rộng',
      'Both happened because developers wrote too many unit tests|||Cả hai xảy ra vì lập trình viên viết quá nhiều unit test',
      'Release management is only needed for student capstones, not mature companies|||Quản lý phát hành chỉ cần cho đồ án sinh viên, không cần ở công ty lớn',
    ],
    1,
    'Knight Capital (SEC Rel. 34-70694 cites ~$460M; Knight Form 8-K reported ~$440M) proved manual deploys and dead feature flags are lethal; CrowdStrike (PIR 2024) proved config/content updates need strict validation and progressive Canary Rings. Lesson 12.4.|||Knight Capital (SEC ghi ~460 triệu; Knight báo ~440 triệu) chứng minh deploy tay và cờ cũ cực kỳ nguy hiểm; CrowdStrike (PIR 2024) chứng minh cập nhật cấu hình cũng cần kiểm biên chặt và vòng Canary tăng dần. Bài 12.4.'),

  Q('dm5-12-q9',
    'In enterprise production operations, what is the right order of action when an on-call alert wakes you at 2 a.m. AND what happens promptly after recovery (e.g., within ~48–72 hours depending on company policy)?|||Trong vận hành production doanh nghiệp, thứ tự hành động ĐÚNG khi cảnh báo trực on-call reo lúc 2 giờ sáng là gì VÀ việc gì diễn ra ngay sau khi khôi phục (vd trong ~48–72 giờ tuỳ chính sách công ty)?',
    [
      'Spend 3 hours hunting for who wrote the buggy commit first, fire them, and then restart the server|||Dành 3 tiếng truy ra ai viết dòng code lỗi trước, kỷ luật họ rồi mới khởi động lại server',
      'Follow the Runbook to stabilize/rollback production first (stop customer bleeding), investigate root cause calmly once healthy, and write a Blameless Postmortem with tracked prevention tickets promptly (e.g., ~48–72 hours per policy)|||Làm theo Runbook để cầm máu/lùi bản production trước (ngừng ảnh hưởng khách), điều tra nguyên nhân gốc sau khi hệ thống ổn định, và viết Postmortem không đổ lỗi kèm thẻ phòng ngừa kịp thời (vd trong ~48–72 giờ tuỳ chính sách)',
      'SSH straight into the prod database and manually delete rows until alerts stop|||SSH thẳng vào DB production và xoá tay dữ liệu tới khi hết cảnh báo',
      'Mute the alert channel until Monday morning standup|||Tắt tiếng kênh cảnh báo cho tới buổi standup sáng thứ Hai',
    ],
    1,
    'Mitigate customer impact first via Runbook/rollback; analyze systemic root causes afterward in a Blameless Postmortem so the same class of outage cannot repeat. Lesson 12.4.|||Cầm máu cho khách hàng trước bằng Runbook/rollback; phân tích nguyên nhân gốc hệ thống sau đó trong Blameless Postmortem để cùng nhóm lỗi không tái diễn. Bài 12.4.'),

  Q('dm5-12-q10',
    'What is the "Dirty Template Risk" warned about in Lesson 12.5\'s Take-Home Toolkit?|||"Rủi ro Mẫu bẩn" (Dirty Template Risk) được cảnh báo trong Bộ công cụ mang theo Bài 12.5 là gì?',
    [
      'Using a blank template with placeholder tags like <PROJECT_NAME>|||Dùng bản mẫu trống có sẵn chỗ giữ như <TEN_DU_AN>',
      'Cloning a previously filled report/config without running a thorough sweep — accidentally leaking prior group codes, real PII, or old credentials into a new submission or client workspace|||Sao chép lại báo cáo/file cấu hình đã điền từ dự án cũ mà quên quét sạch — vô tình để sót mã nhóm cũ, PII thật hoặc mật khẩu cũ sang bài nộp hay không gian khách hàng mới',
      'Exporting Word reports to PDF with automatic Table of Contents bookmarks|||Xuất báo cáo Word sang PDF có mục lục bookmark tự động',
      'Pinning the Universal DoR/DoD checklist inside CT Work kb|||Ghim bảng kiểm DoR/DoD tổng quát trong trang kb của CT Work',
    ],
    1,
    'Keep a clean blank toolkit folder with explicit placeholders and always run a Find-All audit before submission or reuse. Lesson 12.5.|||Luôn giữ thư mục mẫu trống sạch có chỗ giữ rõ ràng và chạy quét Find-All trước khi nộp hoặc tái sử dụng. Bài 12.5.'),

  Q('dm5-12-q11',
    'Course Synthesis (Ch 0–1): Why does the Solo 5-Hat method insist on a cooling-off gap (1–24 hours) between coding (C3/C4) and reviewing/testing (C5), plus 1 real Git identity?|||Tổng hợp khoá (Ch 0–1): Vì sao phương pháp 1 người 5 mũ nhấn mạnh khoảng nghỉ làm nguội (1–24 giờ) giữa lúc code (C3/C4) và lúc review/test (C5), cộng với 1 danh tính Git thật?',
    [
      'To slow down development artificially so the project takes 20 weeks|||Để cố tình làm chậm tiến độ cho đủ 20 tuần',
      'The cooling-off gap weakens confirmation bias for honest self-audit, while 1 real Git identity + transparent solo disclosure upholds strict Academic Honesty without forging fake teammates|||Khoảng nghỉ làm nguội giảm thiên kiến xác nhận để tự soi lỗi thật, còn 1 danh tính Git thật + công khai làm solo giữ trọn Liêm chính Học thuật mà không giả mạo đồng đội',
      'Because GitHub bans accounts that commit more than twice a day|||Vì GitHub khoá tài khoản commit quá hai lần mỗi ngày',
      'Because CT Work cannot track cards without a 24-hour delay|||Vì CT Work không theo dõi được thẻ nếu không chờ 24 giờ',
    ],
    1,
    'Separation of duties + cooling-off gap catches real bugs; 1 real Git identity + honest solo/AI disclosure prevents academic-integrity failure. Lessons 0.2, 1.5, 11.5.|||Tách nhiệm vụ + khoảng nghỉ làm nguội giúp bắt lỗi thật; 1 danh tính Git thật + công khai trung thực về solo/AI giúp tránh vi phạm liêm chính học thuật. Bài 0.2, 1.5, 11.5.'),

  Q('dm5-12-q12',
    'Course Synthesis (Ch 2–3 & PE 12.7): Mid-Iteration 2, your team is 20% behind velocity and a stakeholder demands a large new feature immediately. Which PM action is RIGHT?|||Tổng hợp khoá (Ch 2–3 & PE 12.7): Giữa Iteration 2, đội đang chậm 20% velocity và khách/GV đòi thêm ngay một tính năng lớn. Hành động PM nào là ĐÚNG?',
    [
      'Say "Yes!" immediately, squeeze the new feature in silently, and skip System Testing to make the deadline|||Nói "Dạ được!" ngay, nhét âm thầm tính năng mới vào và cắt bỏ System Test cho kịp hạn',
      'Run formal CR impact analysis, send a transparent 4-Line Crisis/Trade-Off message offering clear options (defer CR to Backlog/Iter 3 OR swap out equal scope + adjust date), and get written approval before touching sprint scope|||Phân tích tác động CR, gửi thông điệp đánh đổi 4 dòng minh bạch đưa lựa chọn rõ (đẩy CR vào Backlog/Iter 3 HOẶC đổi ngang phạm vi + chỉnh ngày) và chốt xác nhận bằng văn bản trước khi đổi phạm vi sprint',
      'Ignore the stakeholder\'s email until the final presentation|||Phớt lờ email của khách/GV cho tới ngày bảo vệ cuối kỳ',
      'Pull three consecutive all-nighters without updating Project Tracking or Weekly Report|||Thức trắng ba đêm liền mà không cập nhật Project Tracking hay Weekly Report',
    ],
    1,
    'Never absorb unbudgeted scope silently or sacrifice sleep/quality — make scope, schedule, and quality trade-offs visible with written sign-off. Lessons 12.5, 12.7.|||Không bao giờ âm thầm nuốt phạm vi phát sinh hay đánh đổi giấc ngủ/chất lượng — luôn minh bạch bài toán đánh đổi phạm vi–lịch–chất lượng bằng văn bản. Bài 12.5, 12.7.'),

  Q('dm5-12-q13',
    'Course Synthesis (Ch 5 & PE 12.7): Why is a Modular Monolith (with clean module facades, separate migrations, and ArchUnit checks) the preferred architecture for a 1–5 person capstone over Microservices?|||Tổng hợp khoá (Ch 5 & PE 12.7): Vì sao Modular Monolith (có facade module sạch, migration tách bạch và kiểm ArchUnit) được ưu tiên hơn Microservices cho đồ án 1–5 người?',
    [
      'Because Spring Boot cannot build Microservices|||Vì Spring Boot không xây được Microservices',
      'It avoids distributed transactions, network partial failures, and multi-service DevOps tax while keeping strong ACID invariants and clean boundaries so modules can still be extracted later if real scale demands it (Monolith-First)|||Nó tránh được giao dịch phân tán, lỗi mạng cục bộ và gánh nặng DevOps đa dịch vụ mà vẫn giữ ACID chặt và ranh giới sạch để sau này tách được khi thật sự cần quy mô (Monolith-First)',
      'Because examiners forbid talking about Microservices during Q&A|||Vì hội đồng cấm nhắc tới từ Microservices trong phần Q&A',
      'Because a Modular Monolith requires zero database design|||Vì Modular Monolith không cần thiết kế cơ sở dữ liệu',
    ],
    1,
    'A clean Modular Monolith delivers working, verifiable software under capstone constraints and earns higher defense marks than half-broken Microservices. Chapter 5 & Lesson 12.7.|||Modular Monolith sạch tạo ra sản phẩm chạy chắc, kiểm chứng được trong khung thời gian đồ án và ghi điểm hội đồng cao hơn hẳn Microservices làm dở dang. Chương 5 & Bài 12.7.'),

  Q('dm5-12-q14',
    'Course Synthesis (Ch 9–10 & PE 12.7): On MediSlot, Patient A modifies the URL to GET /api/v1/prescriptions/{patientB_id} using Patient A\'s valid JWT. What vulnerability is being tested and what is the ONLY safe fix?|||Tổng hợp khoá (Ch 9–10 & PE 12.7): Trên MediSlot, Bệnh nhân A đổi URL thành GET /api/v1/prescriptions/{id_benh_nhan_B} kèm JWT hợp lệ của chính mình. Đây là kiểm thử lỗ hổng nào và đâu là cách vá DUY NHẤT an toàn?',
    [
      'XSS; fix by adding CSS display:none on the React link|||XSS; vá bằng cách ẩn nút bằng CSS display:none trên React',
      'IDOR / BOLA (OWASP API1); fix on the backend by scoping the SQL/repository query strictly to the authenticated JWT\'s patientId (returning 403/404 for foreign records) and verifying via automated unauthorized-access tests|||IDOR / BOLA (OWASP API1); vá ở backend bằng cách lọc truy vấn SQL/repository chặt theo đúng patientId từ JWT (trả 403/404 cho hồ sơ người khác) và khoá bằng test truy cập trái phép tự động',
      'Slow query; fix by removing authentication on the endpoint|||Truy vấn chậm; vá bằng cách bỏ bước xác thực trên endpoint',
      'CORS; fix by setting Access-Control-Allow-Origin: *|||CORS; vá bằng cách đặt Access-Control-Allow-Origin: *',
    ],
    1,
    'UI hiding is never security; object-level authorization MUST run server-side against the verified JWT identity and be proved by automated tests. Lessons 10.2, 12.7.|||Ẩn giao diện không bao giờ là bảo mật; phân quyền cấp đối tượng PHẢI chạy ở server dựa trên danh tính JWT đã xác thực và chứng minh bằng test tự động. Bài 10.2, 12.7.'),

  Q('dm5-12-q15',
    'Course Synthesis (Ch 10–11): Which combination best locks in an 8–9+ defense score on SWP391/SEP490?|||Tổng hợp khoá (Ch 10–11): Tổ hợp chuẩn bị nào khoá chặt nhất mức điểm bảo vệ 8–9+ ở SWP391/SEP490?',
    [
      '12 minutes of reading text-heavy slides, happy-path-only live demo, and improvising answers on the spot|||Đọc 12 phút slide dày đặc chữ, demo chỉ bấm đường đúng và ứng biến câu trả lời tại chỗ',
      'Zero-gap bidirectional RTM & Report 7 parity + Assertion–Evidence slides (Demo starts ≤ 5:15) + live Failure Paths + 30-second offline Plan-B video + 6-tab Evidence Cockpit + 3-round rehearsal (R1–R3) + 100% honest Solo/AI disclosure|||RTM hai chiều 0 lỗ hổng & Report 7 khớp số + Slide Khẳng định–Bằng chứng (Demo từ ≤ 5:15) + Đường lỗi chạy thật + Video Plan B offline 30 giây + Bảng 6 tab bằng chứng + Tổng duyệt 3 vòng (R1–R3) + Công bố trung thực 100% về Solo/AI',
      'Copying a senior group\'s Report 7 and hiding your AI Usage Report|||Chép Report 7 của khoá trước và giấu AI Usage Report',
      'Skipping live demo completely and showing static Figma mockups|||Bỏ hẳn demo chạy thật và chỉ mở bản vẽ Figma tĩnh',
    ],
    1,
    'Every pillar reinforces the others: verifiable artifacts, calm live/Plan-B demo with failure paths, fast evidence retrieval, rehearsed 5-hat PREP answers, and total honesty. Chapter 11 & 12.|||Mọi trụ cột nâng đỡ nhau: hồ sơ kiểm chứng được, demo/Plan B bình tĩnh có đường lỗi, mở bằng chứng nhanh, trả lời PREP 5 mũ nhuần nhuyễn và trung thực tuyệt đối. Chương 11 & 12.'),
];

export default {
  title: 'Chapter 12 — After the Project & Course Wrap-Up|||Chương 12 — Sau đồ án & tổng kết khoá',
  description: 'Khép lại hành trình 1 người 5 vai và mở cửa sang chặng tiếp theo: chuyển từ 5 mũ sang đội thật SEP490/OJT (Định luật Brooks, Sở hữu Kép, tách repo & khai báo kế thừa), dựng Bộ Hồ sơ Bằng chứng 4 tầng cho CV/phỏng vấn, Đổi đề tài trong 1 tuần làm mẫu trọn trên Sàn TMĐT ShopFlow, Lên quy mô doanh nghiệp 20–100 người (CMMI, môi trường, Canary/Blue-Green, On-Call), Bộ công cụ mang theo một trang, Lab thực hành trên CT Work, Đề thực hành cuối khoá kiểu PE 120 phút và Bài kiểm tra tổng kết 15 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    B7,
    {
      title: '12.8 — Final Course Comprehensive Quiz (15 Questions)|||12.8 — Kiểm tra tổng kết khoá (15 câu)',
      slug: 'dm5-12-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười lăm câu tổng kết Chương 12 và toàn khoá (0–12): chuyển sang đội thật & Định luật Brooks, tách repo & khai báo kế thừa, CV công thức XYZ & kiểm toán bí mật/NDA, đổi đề tài sang Sàn TMĐT (chống bán âm + HMAC webhook), Scrum of Scrums/SAFe, bài học Knight Capital & CrowdStrike, On-Call/Postmortem, Rủi ro mẫu bẩn, xử lý CR giữa sprint, Modular Monolith, IDOR/BOLA và công thức bảo vệ 8–9+ điểm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Final Comprehensive Quiz</span>
<h2>Verify full-course mastery (Chapters 0–12)</h2>
<p class="lead">Fifteen scenario questions spanning Chapter 12 (real-team handover, career evidence, 1-week e-commerce topic pivot, enterprise scale, toolkit) and core engineering principles from the entire course. Aim for ≥ 13/15 before your defense or OJT interviews!</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra tổng kết khoá</span>
<h2>Kiểm chứng độ làm chủ toàn khoá (Chương 0–12)</h2>
<p class="lead">Mười lăm câu tình huống phủ trọn Chương 12 (sang đội thật, hồ sơ bằng chứng nghề nghiệp, đổi đề tài 1 tuần sang Sàn TMĐT, quy mô doanh nghiệp, bộ công cụ) cùng các nguyên tắc xương sống của cả khoá. Nhắm ≥ 13/15 trước khi bước vào bảo vệ hoặc phỏng vấn OJT!</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ12 },
    },
  ],
};
