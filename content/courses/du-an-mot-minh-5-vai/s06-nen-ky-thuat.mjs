/**
 * Chương 6 — Nền kỹ thuật & quy trình code (mũ Dev, PM giám sát) (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 5 bài kiến thức (6.1–6.5), 1 bài Lab nghiệm thu nền kỹ thuật trên CT Work LF #2 + GitHub (6.6, dm5-6-lab)
 * và bài kiểm tra 12 câu tình huống (6.7, dm5-6-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s06/b1-repo-cau-truc-readme.mjs';
import B2 from './s06/b2-git-flow-mot-nguoi.mjs';
import B3 from './s06/b3-ci-toi-thieu-dod.mjs';
import B4 from './s06/b4-docker-compose-seed-env.mjs';
import B5 from './s06/b5-tu-review-code-ai.mjs';
import B6 from './s06/b6-lab.mjs';

const QUIZ6 = [
  Q('dm5-6-q1',
    'What is the core security lesson from the Uber GitHub breach (2016/2017, FTC 2018) and Toyota T-Connect exposure (2022) for Commit #1 of your project?|||Bài học bảo mật cốt lõi từ sự cố rò rỉ GitHub của Uber (2016/2017, FTC 2018) và Toyota T-Connect (2022) cho Commit #1 của dự án là gì?',
    [
      'Private GitHub repositories are completely safe places to commit .env files and database passwords|||Kho GitHub private là nơi hoàn toàn an toàn để commit tệp .env và mật khẩu cơ sở dữ liệu',
      'Never commit real secrets even in a private repo — lock .gitignore and .env.example (placeholders only) on Commit #1 before adding any app config|||Không bao giờ commit bí mật thật kể cả trong repo private — khoá .gitignore và .env.example (chỉ biến rỗng) ngay Commit #1 trước khi thêm cấu hình ứng dụng',
      'Secrets are safe in Git as long as you delete the file in the next commit|||Bí mật an toàn trong Git miễn là bạn xoá tệp đó ở commit tiếp theo',
      'Only frontend repositories need .gitignore; backend Spring Boot repos do not|||Chỉ kho frontend mới cần .gitignore; kho backend Spring Boot thì không',
    ],
    1,
    'Uber\'s credentials leaked from a private repository and Toyota\'s key sat exposed for nearly 5 years. Strict .gitignore + .env.example from Commit #1 prevents credentials from ever touching Git history. Lesson 6.1.|||Khoá của Uber bị lộ ngay từ kho private còn khoá của Toyota phơi suốt gần 5 năm. Khoá .gitignore + .env.example ngay Commit #1 chặn bí mật chạm vào lịch sử Git. Bài 6.1.'),

  Q('dm5-6-q2',
    'Why does a modular monolith capstone like LabFlow choose Package-by-Feature (auth/, catalog/, reservation/) over Package-by-Layer (controllers/, services/, repos/)?|||Vì sao một đồ án modular monolith như LabFlow chọn Package-by-Feature (auth/, catalog/, reservation/) thay vì Package-by-Layer (controllers/, services/, repos/)?',
    [
      'Because Spring Boot refuses to compile Package-by-Layer projects|||Vì Spring Boot không biên dịch được dự án chia theo tầng',
      'It keeps all files for one vertical slice together, allows package-private encapsulation to enforce one-way module dependencies, reduces merge conflicts, and creates clean cut lines if a module is extracted later|||Nó gom mọi tệp của một miền dọc vào cùng thư mục, cho phép đóng gói package-private để ép phụ thuộc một chiều, giảm xung đột merge và tạo sẵn đường cắt sạch nếu sau này cần tách dịch vụ',
      'It eliminates the need to write Flyway migrations or REST DTOs|||Nó giúp không cần viết migration Flyway hay REST DTO nữa',
      'It automatically doubles SWP391 LOC grades without writing unhappy cases|||Nó tự động nhân đôi điểm LOC SWP391 mà không cần làm unhappy case',
    ],
    1,
    'Package-by-Feature aligns code layout directly with modular monolith boundaries and vertical-slice ownership. Lesson 6.1.|||Package-by-Feature đồng bộ thẳng bố cục thư mục với ranh giới modular monolith và quyền sở hữu theo miền dọc. Bài 6.1.'),

  Q('dm5-6-q3',
    'How do you verify under hat C5 (QA) that README.md is genuinely complete and not relying on hidden files on your laptop?|||Dưới mũ C5 (QA), làm thế nào để kiểm chứng README.md thật sự đầy đủ chứ không phụ thuộc ngầm vào tệp sẵn có trên laptop của bạn?',
    [
      'Read README.md quickly once and check for spelling errors|||Đọc lướt README.md một lần xem có lỗi chính tả không',
      'Clone the repository into a brand-new clean directory (e.g., /tmp/clean-test) and execute ONLY the commands written in README.md from start to finish|||Clone kho mã vào một thư mục hoàn toàn mới (vd /tmp/clean-test) và chạy ĐÚNG từng lệnh ghi trong README.md từ đầu tới cuối',
      'Ask your IDE if any Markdown syntax warnings appear|||Kiểm xem IDE có báo lỗi cú pháp Markdown không',
      'Only write README.md the night before Final Presentation so it reflects final code|||Chỉ viết README.md vào đêm trước ngày bảo vệ cuối kỳ để khớp code cuối',
    ],
    1,
    'The Clean-Machine Test exposes every missing prerequisite, env var, or undocumented command immediately. Lesson 6.1 &amp; Lab 6.6.|||Bài test Máy Sạch làm lộ ngay mọi công cụ thiếu, biến môi trường sót hoặc lệnh chưa ghi. Bài 6.1 &amp; Lab 6.6.'),

  Q('dm5-6-q4',
    'When practicing "Solo Git Flow like a 5-person team" on LabFlow, which setup obeys BOTH enterprise discipline AND Academic Honesty?|||Khi chạy "Git flow một người mà như năm người" trên LabFlow, cách thiết lập nào tuân thủ CẢ kỷ luật doanh nghiệp LẪN Trung thực học thuật?',
    [
      'Create 5 GitHub accounts with different student names so the contributor graph shows 5 authors|||Tạo 5 tài khoản GitHub mang tên 5 sinh viên khác nhau để biểu đồ đóng góp hiện 5 tác giả',
      'Push directly to main with commit message "update" because nobody else is in the repo|||Push thẳng lên main với lời nhắn "update" vì chẳng có ai khác trong kho',
      'Use ONE real GitHub identity, protect main (no admin bypass), cut short-lived ticket branches (feat/lf-xx-...), use Conventional Commits + PR template, and log role handoffs transparently on CT Work|||Dùng ĐÚNG MỘT danh tính GitHub thật, khoá main (cấm admin vượt luật), cắt nhánh theo thẻ ngắn hạn (feat/lf-xx-...), dùng Conventional Commits + mẫu PR và ghi chuyển vai minh bạch trên CT Work',
      'Use git push --force on main every evening to hide mistakes|||Dùng git push --force lên main mỗi tối để giấu các commit sai',
    ],
    2,
    'Never forge fake Git authors. Enterprise discipline comes from protected main, ticket-linked short-lived branches, PR templates, and cooling-off reviews under your real identity. Lesson 6.2.|||Tuyệt đối không giả tác giả Git. Kỷ luật doanh nghiệp đến từ khoá main, nhánh ngắn gắn mã thẻ, mẫu PR và review sau khoảng nghỉ dưới danh tính thật. Bài 6.2.'),

  Q('dm5-6-q5',
    'You configured GitHub Branch Protection on main for your solo repository, yet "git push origin main" still succeeded. What is the most likely cause?|||Bạn đã bật Branch Protection trên GitHub cho nhánh main ở repo làm một mình, nhưng lệnh "git push origin main" vẫn đẩy lên được. Nguyên nhân có khả năng nhất là gì?',
    [
      'GitHub Branch Protection only works on repositories with at least 2 paid collaborators|||Branch Protection trên GitHub chỉ chạy khi kho có ít nhất 2 thành viên trả phí',
      'You forgot to disable administrator bypass ("Do not allow bypassing the above settings" / Include administrators), OR the repository is private on a GitHub Free account where branch rules are not enforced (requires GitHub Student Developer Pack/Pro or a public repo)|||Bạn quên tắt quyền admin vượt luật ("Do not allow bypassing the above settings" / Include administrators), HOẶC kho đang để private trên tài khoản GitHub Free nơi ruleset không được thực thi (cần GitHub Student Developer Pack/Pro hoặc repo public)',
      'Branch Protection does not apply to commits using Conventional Commits format|||Branch Protection không áp dụng cho commit viết theo chuẩn Conventional Commits',
      'You need to install Docker Desktop before GitHub enforces branch rules|||Bạn phải cài Docker Desktop trước khi GitHub bật luật nhánh',
    ],
    1,
    'Two real causes let direct pushes slip through solo: leaving admin bypass enabled, or using a private repo on GitHub Free (activate GitHub Student Pack/Pro, use a lecturer-approved public repo, or log the Free-plan fallback in an ADR). Lesson 6.2 &amp; Lab 6.6.|||Có hai nguyên nhân thật khiến push thẳng vẫn lọt khi làm một mình: để hở quyền admin vượt luật, hoặc dùng repo private trên tài khoản GitHub Free (hãy kích hoạt GitHub Student Pack/Pro, mở public nếu GV cho phép, hoặc ghi phương án dự phòng vào ADR). Bài 6.2 &amp; Lab 6.6.'),

  Q('dm5-6-q6',
    'What crucial CI lesson does the July 2024 CrowdStrike Falcon Sensor outage (CrowdStrike RCA, Aug 2024) teach you when setting up Minimal CI?|||Sự cố CrowdStrike Falcon Sensor tháng 7/2024 (Báo cáo RCA CrowdStrike tháng 8/2024) dạy bài học CI cốt lõi nào khi bạn dựng CI tối thiểu?',
    [
      'Automated validators always catch every bug automatically once installed|||Bộ kiểm tra tự động cứ cài xong là chắc chắn bắt được mọi lỗi',
      'A green CI checkmark is meaningless if its checks fail to validate real invariants — you must write real assertions and run a Deliberate Red Test to prove CI actually blocks broken PRs|||Một dấu tích CI xanh là vô nghĩa nếu nó không kiểm bất biến thật — bạn phải viết khẳng định thật và chạy Bài test cố tình làm ĐỎ để chứng minh CI thật sự chặn được PR hỏng',
      'You should skip CI and run only manual clicks on localhost|||Bạn nên bỏ CI và chỉ bấm tay kiểm trên localhost',
      'CI pipelines should always grant contents: write permissions to every workflow|||Pipeline CI nên luôn cấp quyền contents: write cho mọi workflow',
    ],
    1,
    'CrowdStrike\'s validator passed green despite a field-count mismatch. Always prove your CI gate catches real failures by running a Deliberate Red Test. Lesson 6.3.|||Bộ kiểm của CrowdStrike báo xanh dù lệch số trường dữ liệu. Luôn chứng minh cổng CI bắt được lỗi thật bằng Bài test cố tình làm ĐỎ. Bài 6.3.'),

  Q('dm5-6-q7',
    'In a Spring Boot + PostgreSQL project like LabFlow, why is running CI integration tests against an H2 in-memory database a dangerous trap?|||Trong dự án Spring Boot + PostgreSQL như LabFlow, vì sao chạy integration test trên CI bằng H2 trong RAM là một cái bẫy nguy hiểm?',
    [
      'Because H2 does not support Java 21|||Vì H2 không hỗ trợ Java 21',
      'Because H2 does not support PostgreSQL-specific constraints like tstzrange EXCLUDE USING gist, so CI turns green even when double-booking protection is broken — use Testcontainers PostgreSQL instead|||Vì H2 không hỗ trợ các ràng buộc đặc thù của PostgreSQL như EXCLUDE USING gist trên tstzrange, khiến CI vẫn xanh ngay cả khi cơ chế chống đặt trùng bị hỏng — hãy dùng Testcontainers PostgreSQL',
      'Because H2 costs money on GitHub Actions|||Vì H2 tốn phí trên GitHub Actions',
      'Because H2 automatically deletes Flyway files|||Vì H2 tự động xoá tệp Flyway',
    ],
    1,
    'Dev/Test/Prod parity (Twelve-Factor Factor X) requires testing PostgreSQL constraints on real PostgreSQL via Testcontainers. Lesson 6.3 &amp; 6.4.|||Nguyên tắc tương đồng môi trường (Twelve-Factor X) đòi hỏi test ràng buộc PostgreSQL trên đúng PostgreSQL thật qua Testcontainers. Bài 6.3 &amp; 6.4.'),

  Q('dm5-6-q8',
    'Why should Minimal CI run "npm ci" instead of "npm install", and declare "permissions: { contents: read }"?|||Vì sao CI tối thiểu nên chạy "npm ci" thay vì "npm install", và khai báo "permissions: { contents: read }"?',
    [
      'npm ci skips running ESLint and TypeScript checks to save time|||npm ci bỏ qua bước kiểm ESLint và TypeScript để tiết kiệm thời gian',
      'npm ci installs exact locked versions from package-lock.json (failing on drift for reproducible builds), and contents: read enforces least privilege to limit blast radius if a CI step is compromised|||npm ci cài đúng phiên bản khoá trong package-lock.json (báo lỗi nếu lệch để build tái lập chuẩn xác), còn contents: read ép quyền tối thiểu nhằm thu hẹp thiệt hại nếu một bước CI bị xâm nhập',
      'npm ci automatically upgrades every library to the latest beta release|||npm ci tự động nâng cấp mọi thư viện lên bản beta mới nhất',
      'contents: read allows CI to force-push directly to main|||contents: read cho phép CI force-push thẳng lên main',
    ],
    1,
    'Reproducible locked installs (npm ci / ./mvnw -B) plus least-privilege token scopes are standard CI hygiene. Lesson 6.3.|||Cài đặt khoá phiên bản tái lập được (npm ci / ./mvnw -B) cùng quyền token tối thiểu là chuẩn vệ sinh CI. Bài 6.3.'),

  Q('dm5-6-q9',
    'Which Docker Compose + Hibernate + Seed configuration follows Twelve-Factor best practices and avoids security &amp; demo-day failures?|||Cấu hình Docker Compose + Hibernate + Seed nào đúng chuẩn Twelve-Factor và tránh được sự cố bảo mật lẫn sập ngày demo?',
    [
      'Bind 0.0.0.0:5432:5432, set ddl-auto=update, and put classmates\' real emails in V1__init.sql|||Gắn 0.0.0.0:5432:5432, đặt ddl-auto=update và đưa email thật của bạn học vào V1__init.sql',
      'Bind 127.0.0.1:5432:5432 with pg_isready healthcheck, lock ddl-auto=validate with Flyway, keep reference roles in Flyway, and put synthetic @demo.local records with relative CURRENT_DATE dates in an idempotent dev-seed.sql|||Gắn 127.0.0.1:5432:5432 có healthcheck pg_isready, khoá ddl-auto=validate dùng Flyway, để dữ liệu tham chiếu (roles) trong Flyway, và đặt tài khoản giả @demo.local kèm mốc ngày tương đối CURRENT_DATE trong dev-seed.sql idempotent',
      'Put JWT_SECRET inside VITE_JWT_SECRET so both React and Spring can read it|||Đặt JWT_SECRET vào VITE_JWT_SECRET để cả React và Spring cùng đọc',
      'Hardcode "postgres" as the fallback password and seed fixed past dates like 2026-10-01|||Đặt mật khẩu mặc định "postgres" và seed ngày quá khứ cố định như 2026-10-01',
    ],
    1,
    'Localhost binding prevents Internet exposure via Docker iptables, ddl-auto=validate keeps Flyway authoritative, relative dates keep demos fresh, and idempotent synthetic seeds prevent duplicate rows and PII leaks. Lesson 6.4.|||Gắn localhost chặn phơi cổng ra Internet qua iptables Docker, ddl-auto=validate giữ Flyway là nguồn sự thật, ngày tương đối giúp demo luôn mới và seed giả idempotent chặn trùng dòng lẫn lộ PII. Bài 6.4.'),

  Q('dm5-6-q10',
    'In the January 31, 2017 GitLab.com database incident (GitLab Official Postmortem), an engineer accidentally ran rm -rf on the primary DB (db1) instead of the replica (db2) and found all 5 backup/replication mechanisms had failed. What is the core operational takeaway for your project?|||Trong sự cố CSDL GitLab.com ngày 31/01/2017 (Postmortem chính thức của GitLab), kỹ sư định xoá thư mục dữ liệu của máy replica (db2) nhưng gõ nhầm rm -rf trên máy primary (db1), rồi phát hiện cả 5 cơ chế backup/replication đều hỏng. Bài học vận hành cốt lõi cho dự án của bạn là gì?',
    [
      'Never use PostgreSQL for web applications|||Không bao giờ nên dùng PostgreSQL cho ứng dụng web',
      'Always double-check hostname/target before running any destructive command, and regularly rehearse full backup restores and clean-start rebuild drills instead of assuming scripts and backups work|||Luôn kiểm tra kỹ tên máy/mục tiêu trước mọi lệnh phá huỷ, đồng thời thường xuyên diễn tập phục hồi backup và dựng sạch từ đầu thay vì mặc định script và bản sao lưu vẫn chạy tốt',
      'Disable Docker volumes so databases erase themselves every hour|||Tắt Docker volume để CSDL tự xoá mỗi giờ',
      'Keep all environments sharing one single database to save RAM|||Cho mọi môi trường dùng chung đúng một CSDL để tiết kiệm RAM',
    ],
    1,
    'GitLab\'s postmortem highlights verifying the exact target host before destructive commands (never running rm -rf blindly under stress) and routinely testing backup/restore and clean-rebuild scripts so silent failures are caught early. Lesson 6.4.|||Postmortem của GitLab nhấn mạnh việc kiểm tra đúng tên máy trước lệnh phá huỷ (không gõ rm -rf theo quán tính khi căng thẳng) và định kỳ diễn tập phục hồi backup / dựng sạch để phát hiện sớm lỗi hỏng âm thầm. Bài 6.4.'),

  Q('dm5-6-q11',
    'During Lesson 6.5\'s 4-Pass Next-Day Self-Review, why does the protocol insist on "My Eyes First, AI Second" AND forbidding AI from writing replacement patches?|||Trong Quy trình Tự Review 4 Lượt hôm sau ở Bài 6.5, vì sao nguyên tắc bắt buộc "Mắt mình soi trước, AI soi sau" VÀ cấm AI viết bản vá thay bạn?',
    [
      'Because AI tools cannot read Java or TypeScript syntax|||Vì công cụ AI không đọc được cú pháp Java hay TypeScript',
      'Reading with your own eyes first trains your real bug-spotting radar across scope, OWASP security, boundaries, and tests; restricting AI to a critic avoids Stanford\'s false-confidence trap (ACM CCS 2023) and preserves 100% hand-coded authorship|||Tự soi bằng mắt mình trước rèn cặp mắt săn bug thật qua phạm vi, bảo mật OWASP, cận biên và test; giới hạn AI làm người phản biện tránh bẫy tự tin ảo của nghiên cứu Stanford (ACM CCS 2023) và giữ trọn 100% quyền tự code tay',
      'Because GitHub bans any PR that was ever reviewed by an AI tool|||Vì GitHub cấm mọi PR từng được công cụ AI review',
      'So that you can skip writing Template5 AI Usage Report|||Để bạn có thể bỏ qua việc viết báo cáo Template5 AI Usage Report',
    ],
    1,
    'Remember OpenSSL Heartbleed (missing bounds check) and Stanford (ACM CCS 2023): active human inspection of trust boundaries + AI strictly as an X-ray critic builds genuine engineering mastery and honesty. Lesson 6.5.|||Nhớ Heartbleed (thiếu kiểm biên) và nghiên cứu Stanford (ACM CCS 2023): con người chủ động soi ranh giới tin cậy + AI đúng vai máy X-quang mới rèn ra tay nghề kỹ sư thật và trung thực. Bài 6.5.'),

  Q('dm5-6-q12',
    'In Pass 2 of self-review on LabFlow\'s "POST /api/v1/reservations/{id}/cancel" endpoint, you see "@PreAuthorize(\'hasRole(STUDENT)\')" but NO check comparing reservation.userId with currentUser.id. What flaw did you just catch?|||Ở Lượt 2 tự review endpoint "POST /api/v1/reservations/{id}/cancel" của LabFlow, bạn thấy có "@PreAuthorize(\'hasRole(STUDENT)\')" nhưng KHÔNG có dòng so sánh reservation.userId với currentUser.id. Bạn vừa bắt được lỗ hổng gì?',
    [
      'A harmless CSS formatting nitpick|||Một lỗi nhỏ về định dạng CSS vô hại',
      'OWASP API1:2023 Broken Object Level Authorization (BOLA / IDOR) — any logged-in Student could cancel another Student\'s reservation simply by passing their reservation ID|||Lỗ hổng OWASP API1:2023 Vượt phân quyền cấp đối tượng (BOLA / IDOR) — bất kỳ Student nào đã đăng nhập đều có thể huỷ lịch đặt của Student khác chỉ bằng cách đổi ID',
      'A Docker port-binding error|||Một lỗi gắn cổng Docker',
      'A Maven cache miss in GitHub Actions|||Một lỗi trượt cache Maven trong GitHub Actions',
    ],
    1,
    'Role checks alone only prove the caller is A student, not the OWNER of that specific reservation. Catching BOLA in Pass 2 before merge prevents critical security leakage. Lesson 6.5.|||Kiểm vai trò mới chỉ chứng minh người gọi là MỘT sinh viên, chưa chứng minh họ là CHỦ của lượt đặt đó. Bắt BOLA ngay ở Lượt 2 trước khi merge chặn lỗ hổng bảo mật nghiêm trọng. Bài 6.5.'),
];

export default {
  title: 'Chapter 6 — Engineering Foundation & Code Workflow (Dev Hat, PM Oversight)|||Chương 6 — Nền kỹ thuật & quy trình code (mũ Dev, PM giám sát)',
  description: 'Dựng trọn nền kỹ thuật và quy trình code chuẩn doanh nghiệp cho công ty một người: bố cục monorepo Package-by-Feature & README chạy sạch máy, GitHub Flow gắn mã thẻ & khoá main cấm admin vượt, CI tối thiểu + Definition of Done tự động (bài test cố tình làm ĐỎ), môi trường dev tái lập với Docker Compose + Flyway + seed idempotent, quy trình tự review code 4 lượt + AI phản biện không viết hộ, Lab nghiệm thu và Kiểm tra 12 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    {
      title: '6.7 — Chapter 6 Quiz|||6.7 — Kiểm tra Chương 6',
      slug: 'dm5-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười hai câu hỏi tình huống bao trọn Chương 6: vệ sinh Commit #1 (Uber 2016, Toyota 2022), Package-by-Feature, Clean-Machine README, GitHub Flow trung thực & lỗi quên tắt admin bypass, bài học CrowdStrike (2024), Testcontainers vs H2, npm ci & quyền tối thiểu CI, Docker Compose Twelve-Factor & GitLab (2017), Tự Review 4 lượt + AI phản biện (Stanford ACM CCS 2023) và bắt lỗi BOLA.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>6.7 — Check your mastery of Engineering Foundation &amp; Code Workflow</h2>
<p class="lead">Twelve scenario-based questions covering Lessons 6.1–6.6. Aim for at least 10/12 before moving on to Chapter 7 (Iteration 1 End-to-End). Every explanation points directly back to the lesson to review.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>6.7 — Kiểm tra độ nắm vững Nền kỹ thuật &amp; Quy trình code</h2>
<p class="lead">Mười hai câu hỏi tình huống bao trọn Bài 6.1–6.6. Hãy đặt mục tiêu đạt tối thiểu 10/12 trước khi bước sang Chương 7 (Iteration 1 từ đầu tới cuối). Mỗi giải thích đều chỉ rõ bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ6 },
    },
  ],
};
