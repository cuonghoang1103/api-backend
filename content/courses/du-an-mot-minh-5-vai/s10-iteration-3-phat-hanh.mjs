/**
 * Chương 10 — Iteration 3, chất lượng phi chức năng & phát hành (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 5 bài kiến thức (10.1–10.5), 1 bài Lab diễn tập phát hành trên CT Work LF #2 (10.6, dm5-10-lab) và bài kiểm tra 10 câu (10.7, dm5-10-quiz) đúng quy định KE-HOACH.md.
 */
import { Q } from './_chung.mjs';
import B1 from './s10/b1-code-freeze.mjs';
import B2 from './s10/b2-bao-mat-api.mjs';
import B3 from './s10/b3-hieu-nang.mjs';
import B4 from './s10/b4-release-deploy.mjs';
import B5 from './s10/b5-report6-user-guides.mjs';
import B6 from './s10/b6-lab.mjs';

const QUIZ10 = [
  Q('dm5-10-q1',
    'What is the main difference between Feature Freeze, Code Freeze, and Hard Freeze during Iteration 3?|||Sự khác nhau chính giữa Feature Freeze, Code Freeze và Hard Freeze trong Iteration 3 là gì?',
    [
      'They are three different names for the exact same moment on the final night|||Đó là ba tên gọi khác nhau cho cùng một thời điểm vào đêm cuối cùng',
      'Feature Freeze stops new features while finishing in-progress P0/P1 to L2; Code Freeze allows ONLY verified P0/P1 bugfixes; Hard Freeze forbids all app code edits so docs, packaging, and drills stay synchronized|||Feature Freeze dừng thêm tính năng mới để hoàn thiện P0/P1 lên L2; Code Freeze CHỈ nhận bản vá P0/P1 có kiểm chứng; Hard Freeze cấm sửa code ứng dụng để hồ sơ, gói nộp và diễn tập đồng bộ',
      'Hard Freeze deletes all P2 backlog cards permanently without updating SRS|||Hard Freeze xoá vĩnh viễn mọi thẻ P2 mà không cần cập nhật SRS',
      'Code Freeze allows refactoring and UI styling tweaks as long as CI compiles|||Code Freeze cho phép refactor và chỉnh đẹp UI miễn là CI biên dịch được',
    ],
    1,
    'The three-stage funnel tightens change risk step by step and enforces consistent, verified releases — avoiding last-minute regressions (Brooks 20–50%) and unverified manual deployments like Knight Capital (2012). Lesson 10.1.|||Phễu khoá ba tầng siết rủi ro thay đổi theo từng nấc và buộc kiểm chứng đồng bộ bản phát hành — tránh lỗi hồi quy phút chót (Brooks 20–50%) và triển khai thủ công thiếu kiểm chứng như Knight Capital (2012). Bài 10.1.'),

  Q('dm5-10-q2',
    'Two days after Code Freeze, you discover: (A) a Student can approve their own reservation via curl, and (B) a dashboard badge color is 2 shades too light. How should hats C1 + C5 triage them?|||Hai ngày sau Code Freeze, bạn phát hiện: (A) Student tự duyệt lịch của mình qua curl, và (B) màu huy hiệu trên dashboard hơi nhạt hơn thiết kế. Mũ C1 + C5 phải phân loại thế nào?',
    [
      'Fix both immediately and refactor the dashboard component while you are in that file|||Sửa cả hai ngay lập tức và tranh thủ refactor luôn component dashboard',
      'Defer both to v2 because Code Freeze means zero code edits of any kind|||Hoãn cả hai sang v2 vì Code Freeze nghĩa là không sửa bất kỳ dòng code nào',
      'Classify (A) as a P0 security blocker — fix immediately with an automated negative test + C5 verification; classify (B) as P3 cosmetic — DO NOT touch after Code Freeze, defer to Known Issues / backlog|||Xếp (A) vào lỗi P0 chặn phát hành — vá ngay kèm test phủ định tự động + kiểm chứng C5; xếp (B) vào P3 thẩm mỹ — KHÔNG đụng vào sau Code Freeze, đưa sang Known Issues / backlog',
      'Fix (B) first because it is visible in screenshots, and hide the Approve button in React for (A)|||Sửa (B) trước vì hiện trên ảnh chụp, còn (A) chỉ cần ẩn nút Duyệt trên React',
    ],
    2,
    'Ruthless triage fixes P0 security blockers immediately with full regression while refusing low-value P3 cosmetic tweaks that risk fresh regressions. Lesson 10.1.|||Phân loại dứt khoát vá ngay lỗi chặn bảo mật P0 kèm hồi quy, đồng thời từ chối sửa thẩm mỹ P3 dễ gây lỗi lây. Bài 10.1.'),

  Q('dm5-10-q3',
    'When cutting an unfinished P2 screen cleanly during Week 9, which step is ESSENTIAL to avoid losing credibility with the defense panel?|||Khi cắt gọn một màn hình P2 chưa kịp làm ở Tuần 9, bước nào là BẮT BUỘC để không mất uy tín trước hội đồng?',
    [
      'Leave the menu link visible showing a "Coming Soon" popup so examiners know you planned it|||Giữ nguyên mục menu hiện thông báo "Đang phát triển" để hội đồng thấy nhóm có kế hoạch',
      'Remove/hide all dead UI entry points, move the card to Post-v1 backlog, update SRS (Record of Changes) + Project Tracking + RTM honestly, and inform the supervisor in the Weekly Report|||Gỡ/ẩn sạch cửa vào chết trên UI, chuyển thẻ sang backlog Post-v1, cập nhật trung thực SRS (Record of Changes) + Project Tracking + RTM và báo sớm cho GV trong Weekly Report',
      'Keep the screen listed as "100% Completed" in SRS and hope examiners do not click it|||Vẫn để màn hình đó là "100% Completed" trong SRS và hy vọng hội đồng không bấm vào',
      'Ship the screen at Quality L1 (happy path only) even if it crashes on empty input|||Cứ nộp màn hình ở mức Quality L1 (chỉ happy path) dù nhập rỗng bị crash',
    ],
    1,
    'Clean scope cuts keep SRS, Tracking, RTM, and live UI 100% consistent — and protect Quality L2/L3 on core screens. Lesson 10.1.|||Cắt phạm vi sạch giữ SRS, Tracking, RTM và giao diện thật khớp 100% — đồng thời bảo vệ chuẩn Quality L2/L3 ở các màn lõi. Bài 10.1.'),

  Q('dm5-10-q4',
    'During your C5 red-team check, Student A copies their valid JWT and sends GET /api/v1/reservations/{studentB_id} via curl, receiving 200 OK with Student B\'s details. What vulnerability is this?|||Trong phiên tự tấn công của C5, Student A dùng JWT hợp lệ của mình gọi GET /api/v1/reservations/{studentB_id} qua curl và nhận 200 OK kèm dữ liệu của Student B. Đây là lỗ hổng gì?',
    [
      'OWASP API1:2023 Broken Object Level Authorization (BOLA / IDOR) — backend verified login/role but failed to verify record ownership against currentUser|||OWASP API1:2023 Broken Object Level Authorization (BOLA / IDOR) — backend chỉ kiểm đăng nhập/vai trò mà quên kiểm quyền sở hữu bản ghi theo currentUser',
      'Cross-Site Scripting (XSS) in React|||Lỗi Cross-Site Scripting (XSS) trên React',
      'SQL Injection in Flyway migrations|||Lỗi SQL Injection trong Flyway migration',
      'Not a vulnerability because Student A is already logged in|||Không phải lỗ hổng vì Student A đã đăng nhập rồi',
    ],
    0,
    'Authentication and role checks are NOT enough — every {id} endpoint must also verify object ownership on the server (returning 403 or 404). Lesson 10.2.|||Xác thực và kiểm vai trò là CHƯA đủ — mọi endpoint theo {id} còn phải kiểm quyền sở hữu ở server (trả 403 hoặc 404). Bài 10.2.'),

  Q('dm5-10-q5',
    'Which pre-demo Spring Boot hardening pair prevents BOTH sensitive Actuator exposure (management.endpoints.web.exposure.include=*) AND 1-click OOM Denial of Service via ?size=1000000 (OWASP API4:2023)?|||Cặp chốt làm cứng Spring Boot nào trước demo chặn ĐỒNG THỜI việc mở toang Actuator (management.endpoints.web.exposure.include=*) VÀ lỗi từ chối dịch vụ OOM bằng ?size=1000000 (OWASP API4:2023)?',
    [
      'Expose * on Actuator because Spring Boot 3 masks /env values, and return all database rows without pagination so React sorts faster|||Mở * trên Actuator vì Spring Boot 3 đã che giá trị /env, và trả hết dòng DB không phân trang để React sắp xếp cho nhanh',
      'Expose ONLY /actuator/health publicly (locking /env which leaks config structure/paths and /heapdump which can expose secrets from memory) AND enforce server-side pagination with a hard maxPageSize cap (e.g., 100)|||Chỉ mở công khai /actuator/health (khoá /env vì lộ cấu trúc cấu hình/đường dẫn và /heapdump vì có thể chứa bí mật trong bộ nhớ) VÀ cưỡng chế phân trang phía server kèm trần cứng maxPageSize (vd 100)',
      'Disable PostgreSQL foreign keys and hide the /actuator URL from React menus|||Tắt khoá ngoại PostgreSQL và ẩn đường dẫn /actuator khỏi menu React',
      'Increase container RAM to 64 GB while keeping /actuator/heapdump public|||Tăng RAM container lên 64 GB và vẫn để công khai /actuator/heapdump',
    ],
    1,
    'Exposing * is a severe misconfiguration even when /actuator/env masks secret values (it still leaks config structure/paths, and /heapdump can leak secrets in RAM); enforcing maxPageSize blocks 1-click OWASP API4 resource exhaustion. Lessons 10.2 &amp; 10.3.|||Mở * luôn là lỗi cấu hình nghiêm trọng kể cả khi /actuator/env che giá trị bí mật (vẫn lộ cấu trúc cấu hình/đường dẫn, còn /heapdump có thể chứa bí mật trong RAM); khoá trần maxPageSize chặn đòn cạn tài nguyên OWASP API4. Bài 10.2 &amp; 10.3.'),

  Q('dm5-10-q6',
    'Why must your pre-demo performance check use a right-sized synthetic dataset (e.g., 5,000–20,000 rows) AND measure p95 latency rather than relying on 5 demo rows and averages?|||Vì sao kiểm tra hiệu năng trước demo phải dùng dữ liệu giả quy mô vừa đủ (vd 5.000–20.000 dòng) VÀ đo phân vị p95 thay vì chỉ dùng 5 dòng mẫu và số trung bình?',
    [
      'Because 5 rows hide Seq Scans, missing indexes, N+1 storms, and unbounded paging — and averages hide severe tail slowness affecting 1 in 20 users|||Vì 5 dòng che giấu hoàn toàn Seq Scan, thiếu index, bão N+1 và thiếu phân trang — còn số trung bình che lấp các ca chậm đuôi nghiêm trọng rơi vào 1/20 người dùng',
      'Because PostgreSQL refuses to run EXPLAIN ANALYZE on fewer than 5,000 rows|||Vì PostgreSQL không cho chạy EXPLAIN ANALYZE nếu bảng dưới 5.000 dòng',
      'Because you must always deploy 20,000 dummy rows during your live 15-minute defense|||Vì bạn bắt buộc phải để nguyên 20.000 dòng rác lúc bảo vệ 15 phút',
      'Because p95 is always smaller than the average|||Vì p95 luôn nhỏ hơn giá trị trung bình',
    ],
    0,
    'Keep seed-perf.sql separate from clean seed-demo.sql: realistic row counts expose real bottlenecks, and p95 reveals true user experience (Jakob Nielsen thresholds). Lesson 10.3.|||Tách riêng seed-perf.sql với seed-demo.sql sạch: dữ liệu đủ dày làm lộ nút thắt thật và p95 phản ánh đúng trải nghiệm người dùng (ngưỡng Jakob Nielsen). Bài 10.3.'),

  Q('dm5-10-q7',
    'You already tagged and submitted v1.0 for Software Package Version 1, then spot a P1 bug an hour later. What is the RIGHT release-engineering action?|||Bạn vừa gắn tag và nộp v1.0 cho Software Package Version 1, một giờ sau phát hiện một lỗi P1. Hành động chuẩn kỹ nghệ phát hành là gì?',
    [
      'Delete tag v1.0 on remote and force-push a new v1.0 pointing to the fixed commit so nobody notices|||Xoá tag v1.0 trên remote rồi force-push đè tag v1.0 mới trỏ vào commit đã sửa để không ai biết',
      'Fix the bug on main (CI green + C5 review), create a NEW immutable annotated tag (e.g., v1.0.1 or v1.1), update RELEASE_NOTES.md, and notify the supervisor honestly|||Sửa lỗi trên main (CI xanh + C5 review), tạo một annotated tag MỚI bất biến (vd v1.0.1 hoặc v1.1), cập nhật RELEASE_NOTES.md và báo trung thực với giảng viên',
      'Edit the code directly inside the submitted zip file without committing to Git|||Sửa code trực tiếp bên trong file zip nộp mà không commit lên Git',
      'Switch the demo laptop to a local unmerged branch during presentation|||Chuyển laptop demo sang nhánh local chưa merge lúc thuyết trình',
    ],
    1,
    'Submitted tags are immutable audit markers — never rewrite or move them; increment cleanly to a new patch tag with updated Release Notes. Lesson 10.4.|||Tag đã nộp là mốc kiểm toán bất biến — không bao giờ ghi đè hay dời đi; hãy tăng sang tag vá mới kèm Release Notes cập nhật. Bài 10.4.'),

  Q('dm5-10-q8',
    'What is the core operational lesson from the January 31, 2017 GitLab.com database outage — and how does it apply to your LabFlow release?|||Bài học vận hành cốt lõi từ sự cố mất CSDL GitLab.com ngày 31/01/2017 là gì — và nó áp vào bản phát hành LabFlow thế nào?',
    [
      'PostgreSQL should never be used in production|||Không bao giờ nên dùng PostgreSQL trên production',
      'A backup (or release package) you have NEVER tested restoring/booting on a clean environment cannot be relied on — always run a real pg_dump + restore drill and clean-machine boot before submission|||Một bản sao lưu (hay gói phát hành) CHƯA TỪNG chạy thử khôi phục/khởi động trên môi trường sạch thì không thể trông cậy được — luôn diễn tập pg_dump + restore và chạy thử máy sạch trước khi nộp',
      'Always bundle your live .env file inside the backup zip so restore is faster|||Luôn kẹp sẵn file .env thật vào zip sao lưu để khôi phục nhanh hơn',
      'Never use Docker volumes for databases|||Không bao giờ dùng Docker volume cho cơ sở dữ liệu',
    ],
    1,
    'All five of GitLab\'s backup mechanisms failed when needed because restores were not verified routinely — proving why clean-machine &amp; restore drills are mandatory DoD items. Lesson 10.4.|||Cả năm cơ chế sao lưu của GitLab đều trục trặc khi cần vì không được kiểm thử phục hồi định kỳ — chứng minh vì sao diễn tập máy sạch &amp; restore là mục DoD bắt buộc. Bài 10.4.'),

  Q('dm5-10-q9',
    'How should you determine the Server Hardware Requirements (Minimum / Recommended RAM &amp; CPU) in Report 6 Section 2.1?|||Bạn nên xác định thông số Server Hardware Requirements (RAM &amp; CPU Tối thiểu / Khuyến nghị) trong Report 6 mục 2.1 bằng cách nào?',
    [
      'Copy the exact hardware table from the sample group\'s template to save time|||Chép nguyên bảng phần cứng từ bài mẫu nhóm khác cho nhanh',
      'Guess 16 GB RAM and 8 vCPU so the system sounds enterprise-grade|||Đoán đại 16 GB RAM và 8 vCPU nghe cho hoành tráng',
      'Run the Docker Compose stack under realistic test load (e.g., k6 / 50-request burst), sample docker stats --no-stream periodically (e.g., every 2s into a log) to capture the true CPU/RAM peak, set Minimum = peak + safety buffer and Recommended ≈ 2×, and state the exact measurement profile|||Chạy stack Docker Compose dưới tải thử thật (vd k6 / bắn 50 request song song), chạy vòng lặp lấy mẫu docker stats --no-stream định kỳ (vd mỗi 2 giây ghi ra file) để lấy ĐỈNH CPU/RAM thật, đặt Minimum = đỉnh + biên an toàn và Recommended ≈ gấp đôi, kèm ghi rõ kịch bản đo',
      'Run docker stats --no-stream once while the app is idle and use that number directly|||Chạy docker stats --no-stream đúng một lần lúc app đang nhàn rỗi rồi lấy luôn số đó',
    ],
    2,
    'Periodic docker stats sampling under load captures the true peak (unlike a single snapshot), letting you defend every hardware number confidently when examiners ask "Why 4 GB RAM?". Lessons 10.3 &amp; 10.5.|||Lấy mẫu docker stats định kỳ suốt đợt tải mới bắt được đỉnh thật (khác với chụp 1 phát), giúp bạn tự tin trả lời khi hội đồng hỏi "Sao cần 4 GB RAM?". Bài 10.3 &amp; 10.5.'),

  Q('dm5-10-q10',
    'Which combination of practices makes Report 6 Section 3 (User Manual) pass both ISO/IEC/IEEE 26514 quality and strict FPT defense scrutiny?|||Tổ hợp thực hành nào giúp Report 6 mục 3 (User Manual) vừa đạt chất lượng ISO/IEC/IEEE 26514 vừa vượt qua sự soi xét gắt của hội đồng FPT?',
    [
      'Paste 40 full-screen screenshots from Iteration 1 with real student emails visible and no captions|||Dán 40 ảnh toàn màn hình chụp từ Iteration 1 còn nguyên email sinh viên thật và không có caption',
      'Document only the Student role because it is the most common user|||Chỉ viết cho mỗi vai Student vì đó là người dùng đông nhất',
      'Include a Role-to-Section map for ALL roles (including Admin/Lecturer &amp; v2 IoT/AI), keep 100% screen/button label parity with SRS &amp; final UI, pair every 5-part feature card with 1440px final-build screenshots carrying numbered callouts ①②③④ matching Steps 1–4, redact PII/tokens, and validate via the UAT Stranger Test|||Có bảng Vai trò → Mục đọc cho TẤT CẢ vai (gồm Admin/Lecturer &amp; v2 IoT/AI), giữ khớp tên màn/nút 100% với SRS &amp; UI cuối, mỗi chức năng 5 phần kèm ảnh 1440px bản cuối có vòng số ①②③④ khớp Step 1–4, che PII/token và kiểm chứng qua Phép thử người lạ khi UAT',
      'Write User Manual in Vietnamese even though Report 1–5 are in English|||Viết User Manual bằng tiếng Việt dù Report 1–5 đều viết tiếng Anh',
    ],
    2,
    'Complete role coverage, 100% SRS-UI label parity, callout-matched final screenshots (①②③④ ↔ Steps 1–4), clean synthetic data, honest AI/IoT limits, and UAT Stranger Test verification eliminate all 7 classic Report 6 traps. Lesson 10.5 &amp; Lab 10.6.|||Đủ mọi vai, khớp tên 100% SRS–UI, ảnh bản cuối đánh số khớp bước (①②③④ ↔ Step 1–4), dữ liệu giả sạch, nêu rõ giới hạn AI/IoT và kiểm qua Phép thử người lạ loại bỏ sạch 7 bẫy kinh điển ở Report 6. Bài 10.5 &amp; Lab 10.6.'),
];

export default {
  title: 'Chapter 10 — Iteration 3, Non-Functional Quality & Release|||Chương 10 — Iteration 3, chất lượng phi chức năng & phát hành',
  description: 'Khép lại Iteration 3 như một đội ngũ phát hành chuyên nghiệp: phễu khoá phạm vi ba tầng (Feature/Code/Hard Freeze) & phân loại P0–P3 từ bài học triển khai thiếu kiểm chứng Knight Capital (2012), kiểm toán bảo mật tối thiểu OWASP & tự tấn công API dưới mũ C5, đo hiệu năng vừa đủ (p95, EXPLAIN ANALYZE, chống API4 DoS, lấy mẫu đỉnh docker stats thật), phát hành Software Package 9 hạng mục (+ SWP-M3) với tag bất biến + diễn tập máy sạch & backup/restore (GitLab 2017), viết Report 6 Software User Guides chuẩn mẫu SEP490, Lab diễn tập phát hành trọn gói trên CT Work LF #2 và Kiểm tra 10 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    {
      title: '10.7 — Chapter 10 Quiz|||10.7 — Kiểm tra Chương 10',
      slug: 'dm5-10-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu hỏi tình huống bao trọn Chương 10: phễu khoá 3 tầng & triage P0–P3, cắt phạm vi sạch, OWASP API1 BOLA, khoá Actuator & chống OWASP API4 DoS, dữ liệu giả vừa đủ & p95, tag bất biến, bài học backup/restore GitLab (2017), lấy mẫu đỉnh docker stats cho Report 6 §2.1 và chuẩn User Manual khớp SRS/UI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>10.7 — Check your mastery of Iteration 3, NFR Hardening &amp; Release</h2>
<p class="lead">Ten scenario-based questions covering Lessons 10.1–10.6. Aim for at least 8/10 before moving on to Chapter 11 (Final Reports &amp; 8–9 Defense). Every explanation points directly back to the lesson to review.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>10.7 — Kiểm tra độ nắm vững Iteration 3, Chất lượng phi chức năng &amp; Phát hành</h2>
<p class="lead">Mười câu hỏi tình huống bao trọn Bài 10.1–10.6. Hãy đặt mục tiêu đạt tối thiểu 8/10 trước khi sang Chương 11 (Hồ sơ cuối &amp; Bảo vệ 8–9 điểm). Mỗi giải thích đều chỉ rõ bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 750, questions: QUIZ10 },
    },
  ],
};
