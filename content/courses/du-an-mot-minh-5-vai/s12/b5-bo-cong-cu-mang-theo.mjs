/**
 * 12.5 — Bộ công cụ mang theo: mọi mẫu và checklist của khoá trong một trang (dm5-12-5-bo-cong-cu-mang-theo).
 * Cẩm nang tra cứu nhanh một trang (Quick Reference Handbook) dùng lại cho MỌI đề tài (SWP391, SEP490, OJT, đi làm):
 * Sơ đồ vòng đời toàn khoá, Bảng chỉ mục 12 mẫu hồ sơ FPT + Agile Artifacts, 5 Checklist bỏ túi C1–C5,
 * Thẻ DoR/DoD & Phản ứng khủng hoảng 4 dòng, Cảnh báo bảo mật khi tái sử dụng mẫu, và Lộ trình học tiếp có link chuẩn.
 */
import { bang, cl, note, thuatNgu, tomTat, out, ac, cs, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L125 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 12 · Lesson 12.5', 'Chương 12 · Bài 12.5', `
<h2>${t('12.5 — The Take-Home Toolkit: Every Template, Checklist &amp; Gate of the Course on One Page', '12.5 — Bộ công cụ mang theo: mọi mẫu và checklist của khoá trong một trang')}</h2>
<p class="lead">${t(
    'Across twelve chapters you learned how to plan, track, specify, architect, code, test, release, document, defend, and scale a software project across five hats. Six months from now — right before SEP490 Kickoff or your first OJT sprint — you will NOT have time to re-read sixty lessons. <strong>Bookmark this single page as your Quick Reference Handbook:</strong> every template, naming rule, role checklist, quality gate, and crisis card of the entire course distilled into one reusable, topic-agnostic toolkit.',
    'Qua mười hai chương, bạn đã học cách lập kế hoạch, theo dõi, đặc tả, thiết kế kiến trúc, viết code, kiểm thử, phát hành, hoàn thiện hồ sơ, bảo vệ và mở rộng một dự án phần mềm xuyên suốt năm chiếc mũ. Sáu tháng nữa — ngay trước buổi khởi động SEP490 hoặc sprint đầu ở OJT — bạn sẽ KHÔNG kịp đọc lại sáu chục bài. <strong>Hãy đánh dấu đúng trang này làm Sổ tay Tra cứu Nhanh:</strong> mọi mẫu biểu, quy ước đặt tên, bảng kiểm theo vai, cổng chất lượng và thẻ xử lý khủng hoảng của cả khoá được nén gọn thành một bộ công cụ dùng lại được cho mọi đề tài.')}</p>

<h3>${t('Everyday picture: the commercial aircraft Quick Reference Handbook (QRH)', 'Liên tưởng đời thường: cuốn Sổ tay Tra cứu Nhanh (QRH) trong buồng lái máy bay')}</h3>
<p>${t(
    'Airline pilots study thousands of pages of manuals in training, yet right next to the throttle sits a slim, tabbed binder called the Quick Reference Handbook (QRH). When a warning light flashes mid-flight, nobody relies on memory — they flip straight to the exact 8-line checklist, execute item by item, and verify each step aloud. Treat this page as your engineering QRH: whenever you start a new project, freeze a release, handle a surprise change request, or walk into defense, open the exact section below and run it line by line.',
    'Phi công học hàng nghìn trang sách kỹ thuật khi đào tạo, nhưng ngay cạnh cần ga luôn đặt một cuốn sổ mỏng chia thẻ mục gọi là Quick Reference Handbook (QRH). Khi đèn cảnh báo nháy giữa chuyến bay, không ai trông cậy vào trí nhớ — họ mở đúng trang checklist 8 dòng, làm từng mục và đọc to xác nhận. Hãy coi trang này là cuốn QRH kỹ thuật của bạn: bất cứ khi nào mở dự án mới, khoá bản phát hành, gặp yêu cầu thay đổi đột xuất hay chuẩn bị vào phòng bảo vệ, mở đúng mục bên dưới và chạy từng dòng.')}</p>

<h3>${t('1. Master Lifecycle Map: From Day 0 to Defense &amp; Career', '1. Bản đồ Vòng đời Tổng thể: Từ Ngày 0 tới Bảo vệ &amp; Đi làm')}</h3>
<pre><code>  [Ch 0-1: Setup &amp; 5 Hats]     -&gt; 5 roles, CT Work workspace, Git identity, cooling-off rule, RACI
            |
            v
  [Ch 2-3: Plan &amp; Rhythm]      -&gt; Charter (MoSCoW), WBS, 3 Iterations, RAID, Daily/Weekly RAG, CR
            |
            v
  [Ch 4-5: Req &amp; Design]       -&gt; Q&amp;A, Use Cases, BR, Wireframes, SRS + RTM, ADR, ERD, OpenAPI, SDS
            |
            v
  [Ch 6-8: Build &amp; Iterations] -&gt; Repo/CI/DoD, Docker, Iter 1 (model loop), Iter 2 (core invariant &amp; CR)
            |
            v
  [Ch 9-10: QA &amp; Release]      -&gt; Test Plan, Report 5.1-5.3, Defect/Leakage, UAT, OWASP, Perf, Package, Rep 6
            |
            v
  [Ch 11-12: Defense &amp; Beyond] -&gt; Report 7 + Final RTM, Plan-B Demo, 5-Hat Q&amp;A, Real Team, CV, Topic Pivot</code></pre>

<h3>${t('2. Master Document &amp; Artifact Index (All 12 FPT Templates + Core Engineering Artifacts)', '2. Bảng Chỉ mục Tài liệu Tổng hợp (Đủ 12 mẫu hồ sơ FPT + Tạo tác kỹ thuật lõi)')}</h3>
<p>${t(
    'Use the standard file naming convention (confirm exact group code <code>&lt;Gxxx&gt;</code> with your supervisor): <code>SEP490_&lt;Gxxx&gt;_&lt;TemplateName&gt;_v&lt;x.y&gt;.docx/.xlsx</code> (always export a matching PDF with updated Table of Contents bookmarks before submission).',
    'Dùng thống nhất quy ước đặt tên nộp bài (xác nhận mã nhóm <code>&lt;Gxxx&gt;</code> thật với giảng viên): <code>SEP490_&lt;Gxxx&gt;_&lt;TenMau&gt;_v&lt;x.y&gt;.docx/.xlsx</code> (luôn xuất kèm bản PDF đã cập nhật mục lục và bookmark trước khi nộp).')}</p>

${bang(
  [t('Artifact / Template', 'Tài liệu / Mẫu biểu'), t('Owner Hat', 'Mũ chủ trì'), t('When Created &amp; Updated', 'Lúc tạo &amp; cập nhật'), t('CT Work Location', 'Nơi quản lý trên CT Work'), t('#1 Trap to Avoid', 'Bẫy số 1 phải tránh')],
  [
    [t('<strong>Report 1</strong> — Project Introduction', '<strong>Report 1</strong> — Giới thiệu dự án'), mu('C1', en) + ' ' + mu('C2', en), t('Init (v1.0) → Freeze for Rep 7', 'Khởi động (v1.0) → Chốt vào Rep 7'), '<code>docs</code>', t('Vague scope without explicit "Out of Scope / Limitations"', 'Phạm vi mơ hồ, thiếu mục "Không làm / Giới hạn"')],
    [t('<strong>Report 2a</strong> — Project Management Plan', '<strong>Report 2a</strong> — Kế hoạch quản lý (PMP)'), mu('C1', en), t('Init (v1.0) → Update Actuals each release', 'Khởi động (v1.0) → Cập nhật số thật mỗi mốc'), '<code>docs</code>, <code>timeline</code>, <code>raid</code>', t('Plan vs Actual effort mismatch with Tracking/Weekly', 'Số liệu Kế hoạch/Thực tế lệch với Tracking/Weekly')],
    [t('<strong>Report 2b</strong> — Project Tracking (6 sheets)', '<strong>Report 2b</strong> — Theo dõi dự án (6 sheet)'), mu('C1', en), t('Daily (TimeLogs) + Weekly (Scope/WBS)', 'Hằng ngày (TimeLogs) + Hằng tuần (Scope/WBS)'), '<code>board</code>, <code>timesheet</code>, <code>reports</code>', t('Broken <code>#REF!</code> formulas or text dates instead of <code>dd/mm/yyyy</code>', 'Lỗi công thức <code>#REF!</code> hoặc gõ ngày dạng chữ')],
    [t('<strong>Report 3</strong> — SRS (+ Screen Auth &amp; BR)', '<strong>Report 3</strong> — Đặc tả yêu cầu (SRS)'), mu('C2', en), t('Every iteration (v0.9 → v1.2)', 'Mỗi iteration (v0.9 → v1.2)'), '<code>requirements</code>, <code>spec</code>, <code>wiegers</code>', t('Writing "System" instead of project name; untestable adjectives ("fast")', 'Viết chung "System"; dùng tính từ không đo được ("nhanh")')],
    [t('<strong>Report 4</strong> — SDS (+ ERD, Class, Sequence)', '<strong>Report 4</strong> — Đặc tả thiết kế (SDS)'), mu('C3', en) + ' ' + mu('C4', en), t('Every iteration (v1.0 → v1.3)', 'Mỗi iteration (v1.0 → v1.3)'), '<code>diagrams</code>, <code>docs</code>', t('Coded UC missing Sequence/Class diagram or drifting from live DB schema', 'UC đã code nhưng thiếu Sequence/Class hoặc lệch bảng DB thật')],
    [t('<strong>Report 5.0–5.3</strong> — Test Plan, UT, IT, ST', '<strong>Report 5.0–5.3</strong> — Test Plan, UT, IT, ST'), mu('C5', en), t('Plan early; UT/IT per iter; ST 3 rounds', 'Lập Plan sớm; UT/IT theo vòng; ST 3 vòng'), '<code>tests</code> (<code>fpt_unit_*</code>, <code>fpt_it_*</code>)', t('Happy-path-only tests; pass rate in Rep 5.0 contradicting Excel tabs', 'Chỉ test đường đúng; tỉ lệ pass ở Rep 5.0 đánh nhau với Excel')],
    [t('<strong>Report 6</strong> — Software User Guides', '<strong>Report 6</strong> — Hướng dẫn sử dụng'), mu('C4', en) + ' ' + mu('C2', en), t('Pre-release (after UI freeze)', 'Trước phát hành (sau khi khoá UI)'), '<code>docs</code>, <code>kb</code>', t('Outdated screenshots or real student emails/passwords in captures', 'Ảnh chụp giao diện cũ hoặc lộ email/mật khẩu thật')],
    [t('<strong>Report 7</strong> — Final Project Report', '<strong>Report 7</strong> — Báo cáo tổng kết cuối'), mu('C1', en), t('Final week (assembles Rep 1–6)', 'Tuần cuối (ghép bản chốt Rep 1–6)'), '<code>docs</code> (<code>final_report_assemble</code>)', t('Paste format clash, forgotten F9 TOC update, leftover sample-team text', 'Dán hỏng định dạng, quên nhấn F9 cập nhật mục lục, sót chữ bài mẫu')],
    [t('<strong>Weekly Report</strong> &amp; <strong>AI Usage (Template5)</strong>', '<strong>Báo cáo tuần</strong> &amp; <strong>Nhật ký AI (Template5)</strong>'), mu('C1', en) + ' ' + mu('C5', en), t('Every Sunday without fail', 'Mỗi Chủ nhật không bỏ tuần nào'), '<code>reports</code>, <code>ai-usage</code>', t('Backfilling 5 weeks at once; hiding AI assistance instead of logging verification', 'Dồn 5 tuần viết bù một lần; giấu dùng AI thay vì ghi bước kiểm chứng')],
    [t('<strong>RTM</strong>, <strong>ADR</strong>, <strong>OpenAPI</strong> &amp; <strong>Release Package</strong>', '<strong>RTM</strong>, <strong>ADR</strong>, <strong>OpenAPI</strong> &amp; <strong>Gói phát hành</strong>'), t('All C1–C5', 'Cả C1–C5'), t('Continuous across all iterations', 'Cập nhật liên tục suốt các iteration'), '<code>requirements</code>, <code>code</code>, <code>releases</code>', t('Orphan tests; DB seed script missing from release Git tag', 'Test mồ côi; quên script DB/seed trong bản Git tag nộp')]
  ]
)}

<h3>${t('3. The Five Pocket Checklists (Print or Pin in CT Work)', '3. Năm Bảng kiểm Bỏ túi theo Vai (In ra hoặc ghim trên CT Work)')}</h3>
${bang(
  [t('Hat', 'Mũ'), t('6-Point Pocket Checklist (Topic-Agnostic — Run Before Every Gate)', 'Bảng kiểm bỏ túi 6 điểm (Dùng cho mọi đề tài — Chạy trước mỗi mốc)')],
  [
    [mu('C1', en) + '<br><strong>Leader / PM</strong>', t('1. Every card in Sprint has 1 owner + clear AC + estimate.<br>2. WIP ≤ 2 active items per person; blocked items flagged within 24h.<br>3. Weekly RAG status honest (Red/Amber triggers explicit P2 scope cut, NOT secret overtime).<br>4. RAID register updated; every CR has impact analysis + written approval.<br>5. Release tag contains runnable DB migrations + seed + Release Notes + Rollback note.<br>6. Record of Changes &amp; contribution logs reflect 100% honest attribution.', '1. Mọi thẻ trong Sprint có đúng 1 người phụ trách + AC rõ + ước lượng.<br>2. WIP ≤ 2 việc đang mở/người; việc kẹt gắn cờ blocked trong 24 giờ.<br>3. Báo cáo tuần RAG trung thực (Đỏ/Vàng → chủ động cắt P2, KHÔNG âm thầm thức đêm).<br>4. Cập nhật sổ RAID; mọi CR có phân tích tác động + phê duyệt bằng chữ.<br>5. Tag phát hành chứa đủ migration DB + dữ liệu mẫu + Release Notes + ghi chú Rollback.<br>6. Record of Changes và nhật ký đóng góp phản ánh trung thực 100%.')],
    [mu('C2', en) + '<br><strong>BA</strong>', t('1. All stakeholders, actors, and screen-role permissions mapped in a matrix.<br>2. Every UC has Main + Alternative + Exception flows; zero "etc./fast/easy".<br>3. Every BR has an exact number/rule and a closed Q&amp;A confirmation from client/lecturer.<br>4. Wireframes approved BEFORE backend/frontend feature coding starts.<br>5. Shared naming codes (<code>FE-xx</code>, <code>UC-xx</code>, <code>BR-xx</code>, <code>SM-xx</code>) identical across all docs.<br>6. Forward RTM has 0 gaps (every UC traces to SDS, Code, and Test).', '1. Đủ ma trận stakeholder, actor và phân quyền từng màn hình.<br>2. Mọi UC có đủ luồng Chính + Thay thế + Ngoại lệ; sạch từ mơ hồ ("v.v./nhanh/dễ").<br>3. Mọi BR có con số/điều kiện cụ thể và đã chốt Q&amp;A với khách/giảng viên.<br>4. Wireframe được duyệt TRƯỚC khi bắt đầu code tính năng.<br>5. Mã dùng chung (<code>FE-xx</code>, <code>UC-xx</code>, <code>BR-xx</code>, <code>SM-xx</code>) khớp 100% mọi tài liệu.<br>6. RTM xuôi không lỗ hổng (mọi UC nối tới SDS, Code và Test).')],
    [mu('C3', en) + '<br><strong>Dev BE</strong>', t('1. Architecture ADR written (modular boundaries enforced; no cross-module table joins/transactions).<br>2. Critical invariants (double-booking/overselling/idempotency) enforced in DB + transaction.<br>3. OpenAPI contract + RFC 9457 error schema agreed BEFORE FE integrates.<br>4. Server-side validation + RBAC/scope check on EVERY endpoint (never trust client IDs/prices).<br>5. Flyway migrations run cleanly on empty DB (<code>ddl-auto=validate</code>); server-side paging/sort allowlist.<br>6. Branch-per-ticket, atomic commits with card ID, green CI, zero hardcoded secrets.', '1. Có ADR kiến trúc (giữ ranh giới module; không join/transaction chéo module).<br>2. Ràng buộc sống còn (chống trùng/bán âm/idempotent) khoá ở tầng DB + transaction.<br>3. Hợp đồng OpenAPI + chuẩn lỗi RFC 9457 chốt TRƯỚC khi FE ghép.<br>4. Validate + kiểm quyền RBAC/phạm vi trên MỌI endpoint server (không tin ID/giá từ client).<br>5. Migration Flyway chạy sạch trên DB trống (<code>ddl-auto=validate</code>); phân trang &amp; allowlist sắp xếp server.<br>6. Nhánh theo thẻ, commit kèm mã thẻ, CI xanh, không hardcode bí mật.')],
    [mu('C4', en) + '<br><strong>Dev FE</strong>', t('1. Shared layout/navigation &amp; consistent Create/Update/View form patterns across screens.<br>2. Every list screen supports server-side search, filter, sort, and pagination.<br>3. All four UI states implemented: Loading, Empty, Error (400/403/409/500), and Success.<br>4. Double-submit prevented while request is in flight; user input preserved on validation error.<br>5. Client validation mirrors backend rules (required, length, format) while still handling server rejections.<br>6. Clean responsive rendering (no broken tables on mobile/iPad) + Vietnamese UTF-8 verified.', '1. Dùng chung layout/menu &amp; form Create/Update/View thống nhất giữa các màn.<br>2. Mọi màn danh sách có đủ tìm kiếm, lọc, sắp xếp và phân trang phía server.<br>3. Đủ 4 trạng thái giao diện: Đang tải, Rỗng, Lỗi (400/403/409/500) và Thành công.<br>4. Khoá nút chống bấm đúp khi đang gửi request; giữ lại dữ liệu đã gõ khi báo lỗi.<br>5. Validate client khớp luật backend (bắt buộc, độ dài, định dạng) và hiện đẹp thông báo lỗi từ server.<br>6. Hiển thị responsive sạch (bảng không vỡ trên di động/iPad) + kiểm hiển thị tiếng Việt.')],
    [mu('C5', en) + '<br><strong>QA / Tester</strong>', t('1. Cooling-off gap (solo) or independent peer reviewer (team) applied before sign-off.<br>2. Every screen verified to ≥ Quality L2 (happy path + unhappy/boundary/auth paths — exact count set by your team and confirmed with your lecturer; e.g., LabFlow defaults to ≥ 3 unhappy cases).<br>3. Concurrency &amp; unauthorized-access (401/403 curl bypass) tests run against REAL PostgreSQL.<br>4. Defects logged with repro steps + evidence; fixed bugs retested + regression run before closing.<br>5. Backward RTM verified: 0 orphan tests, 0 coded features missing ST, pass rates reconciled.<br>6. Pre-demo Plan-B offline video + 1-command DB reset verified on clean checkout.', '1. Áp khoảng nghỉ làm nguội (solo) hoặc người kiểm độc lập (đội thật) trước khi ký đạt.<br>2. Mọi màn kiểm đạt ≥ Quality L2 (có nhánh lỗi/biên/phân quyền — số nhánh cụ thể do nhóm đặt và kiểm lại với GV; vd LabFlow chọn mặc định ≥ 3 nhánh lỗi).<br>3. Chạy test song song &amp; truy cập trái phép (curl 401/403) trên PostgreSQL THẬT.<br>4. Ghi lỗi đủ bước tái hiện + ảnh bằng chứng; lỗi sửa xong phải retest + hồi quy mới đóng.<br>5. Kiểm RTM ngược: 0 test mồ côi, 0 tính năng đã code thiếu ST, đối soát tỉ lệ pass.<br>6. Kiểm video Plan B offline + lệnh 1 bước reset DB trên bản checkout sạch trước khi demo.')]
  ]
)}

<h3>${t('4. Copy-Paste Governance Cards: Universal DoR, DoD &amp; 4-Line Crisis Card', '4. Các thẻ quản trị chép-dán ngay: DoR, DoD &amp; Thẻ Báo khủng hoảng 4 dòng')}</h3>
${out(`=== UNIVERSAL DEFINITION OF READY (DoR — Before Coding a Card) ===
[ ] Linked to approved UC / BR / Screen ID (and approved wireframe if UI)
[ ] Clear Given / When / Then Acceptance Criteria (course default: >= 1 happy + >= 2 unhappy; confirm with lecturer)
[ ] API contract & DB migration impact agreed; dependencies unblocked; size <= 3 days

=== UNIVERSAL DEFINITION OF DONE (DoD — Before Dragging to Done) ===
[ ] All AC pass on clean Docker/demo build (not only author's IDE)
[ ] Backend auth + validation + DB constraints + unhappy paths tested (Quality >= L2)
[ ] PR reviewed (peer or post-cooling-off checklist) + CI green + merged to main
[ ] SRS / SDS / RTM / Evidence link updated on the CT Work card; 0 P0/P1 defects open

=== 4-LINE CRISIS / DELAY ESCALATION CARD (Send to PM / Lecturer / Client Immediately) ===
1. FACT:    [Card/Milestone X] is behind by [N hours/days] due to [verified root cause].
2. IMPACT:  If unchanged, [Gate Y] will miss [specific feature/test].
3. OPTIONS: Option A (Recommended): cut P2 item [Z] to protect [Core Goal] on time.
            Option B: keep [Z] and shift [Gate Y] by [N days].
4. ASK:     Please confirm Option A or B by [exact date/time].`)}

<h3>${t('5. Toolkit Security Warning: The "Dirty Template" Blunder', '5. Cảnh báo Bảo mật Bộ công cụ: Cú sẩy chân mang tên "Mẫu bẩn"')}</h3>
${cl('warn', `<p>${t(
    'Reusing templates is a superpower — until you accidentally reuse a <strong>filled</strong> file from a past project instead of a blank template. Every semester, teams lose heavy points (or trigger privacy breaches at work) because Word headers, Excel Cover tabs, or <code>docker-compose.yml</code> still contain a previous group\'s project code, a classmate\'s real phone number, or an old staging database password. <strong>Rule:</strong> Maintain a dedicated <code>toolkit-blank/</code> folder containing ONLY empty skeleton files with <code>&lt;PROJECT_NAME&gt;</code> placeholders — NEVER clone last semester\'s finished submission directly without running a full Find-All sweep.',
    'Tái sử dụng mẫu là siêu năng lực — cho tới khi bạn vô tình dùng lại một file <strong>đã điền sẵn</strong> từ dự án cũ thay vì bản mẫu trống. Kỳ nào cũng có nhóm bị trừ điểm nặng (hoặc dính sự cố rò dữ liệu khi đi làm) vì tiêu đề trang Word, sheet Cover Excel hay tệp <code>docker-compose.yml</code> còn sót mã dự án cũ, số điện thoại thật của bạn cũ hoặc mật khẩu DB staging cũ. <strong>Quy tắc:</strong> Duy trì một thư mục <code>toolkit-blank/</code> chỉ chứa duy nhất khung trống có chỗ điền <code>&lt;TEN_DU_AN&gt;</code> — KHÔNG BAO GIỜ sao chép thẳng bài nộp cũ mà không chạy lệnh Find-All quét sạch.')}</p>`)}

<h3>${t('6. Your Next Learning Roadmap on cuongthai.com (After Completing This Course)', '6. Lộ trình Học tiếp trên cuongthai.com (Sau khi hoàn thành khoá này)')}</h3>
<p>${t(
    'This course gave you the <strong>end-to-end project operating system</strong>. Pair it with these specialist courses depending on what comes next for you:',
    'Khoá này đã trao cho bạn <strong>hệ điều hành vận hành dự án trọn vòng đời</strong>. Hãy ghép thêm các khoá chuyên sâu dưới đây tuỳ chặng kế tiếp của bạn:')}</p>
${bang(
  [t('Your Next Goal', 'Mục tiêu kế tiếp của bạn'), t('Recommended Courses &amp; Direct Links', 'Khoá học khuyên ghép &amp; Đường dẫn trực tiếp')],
  [
    [t('<strong>Sharpen Backend / Full-Stack Craft</strong>', '<strong>Nâng tay nghề Backend / Full-Stack</strong>'), cs('spring-boot', 'sb-0-8-bat-dau-tai-day', 'Spring Boot từ số 0') + ' · ' + cs('api-design', 'api-0-8-bat-dau-tai-day', 'API & System Design') + ' · ' + cs('fullstack-project', 'fp-11-4-tong-ket', 'Full-Stack Project Checklist')],
    [t('<strong>Master Testing, Git &amp; Production Deploy</strong>', '<strong>Chắc tay Kiểm thử, Git &amp; Deploy thật</strong>'), cs('testing', 'tst-0-8-bat-dau-tai-day', 'Testing chuyên sâu') + ' · ' + cs('git', 'git-0-5-bat-dau-tai-day', 'Git & GitHub') + ' · ' + cs('docker', 'dk-16-1-dong-goi', 'Docker Production') + ' · ' + cs('deploy-vps', 'deploy-0-5-bat-dau-tai-day', 'Deploy lên VPS')],
    [t('<strong>Prepare for OJT &amp; Enterprise Interviews</strong>', '<strong>Sẵn sàng OJT &amp; Phỏng vấn công ty lớn</strong>'), cs('agile-teamwork', 'agl-8-1-onboarding', 'Agile Teamwork Ch8–11') + ' · ' + cs('tieng-anh-ky-thuat-di-lam', 'tak-0-8-bat-dau-tai-day', 'Tiếng Anh kỹ thuật đi làm') + ' · ' + cs('thuc-tap-cung-claude', 'thuc-tap-cung-claude-0-8-bat-dau-tai-day', 'Thực tập cùng AI Senior (gõ code thật)')],
    [t('<strong>Review FPT Academic Foundations</strong>', '<strong>Ôn nền tảng học thuật các môn FPT</strong>'), ac('software-development-project', 'swp391-p-1-ban-do-ca-ky', 'SWP391') + ' · ' + ac('software-requirements', 'swr302-gioi-thieu', 'SWR302') + ' · ' + ac('software-architecture-and-design', 'swd392-bat-dau-tai-day', 'SWD392') + ' · ' + ac('software-testing', 'swt301-gioi-thieu', 'SWT301')]
  ]
)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('Copy the 5 Pocket Checklists + Universal DoR/DoD straight into your ShopFlow CT Work <code>kb</code> page on Day 1 — zero rewrites required; simply plug ShopFlow\'s BR/UC IDs into the Master Document Index.', 'Chép nguyên 5 Bảng kiểm bỏ túi + DoR/DoD tổng quát vào trang <code>kb</code> của dự án ShopFlow trên CT Work ngay Ngày 1 — không phải viết lại chữ nào; chỉ điền mã BR/UC của ShopFlow vào Bảng Chỉ mục Tài liệu.')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('Print or pin this page during Week 1 Kickoff so every member sees exactly which of the 12 FPT templates they own, what the naming rule is, and what DoD blocks a card from reaching Done.', 'In hoặc ghim trang này ngay buổi họp Khởi động Tuần 1 để cả 5 người nhìn rõ mình giữ mẫu nào trong 12 báo cáo FPT, quy ước đặt tên ra sao và DoD nào chặn thẻ vào Done.')],
  [t('Large enterprise / OJT (FPT Software, 20–100 people)', 'Công ty lớn / OJT (FPT Software, 20–100 người)'), t('Keep the 4-Line Crisis Escalation Card and the C3/C4/C5 Pocket Checklists beside your editor — they translate seamlessly to Jira tickets, daily <em>hourensou</em> updates, and enterprise PR reviews.', 'Để sẵn Thẻ Báo khủng hoảng 4 dòng và Bảng kiểm C3/C4/C5 ngay cạnh trình soạn thảo — chúng khớp mượt với ticket Jira, báo cáo <em>hourensou</em> hằng ngày và review PR ở doanh nghiệp.')]
], en)}

${viecLabflow([
  [t('Create a clean blank <code>toolkit-blank/</code> page or folder inside your CT Work Knowledge Base (<code>kb</code>) containing the 5 Pocket Checklists, Universal DoR/DoD, and 4-Line Crisis Card with zero LabFlow-specific leftovers so you can clone it to any future project in 60 seconds.', 'Tạo trang/thư mục mẫu trống sạch <code>toolkit-blank/</code> trong <code>kb</code> của CT Work chứa 5 Bảng kiểm bỏ túi, DoR/DoD tổng quát và Thẻ Báo khủng hoảng 4 dòng không dính chữ riêng của LabFlow để nhân bản cho mọi dự án tương lai trong 60 giây.'), t('Your personal reusable toolkit is pinned, searchable, and verified free of old project names or credentials.', 'Bộ công cụ tái sử dụng của riêng bạn đã được ghim, dễ tìm và sạch hoàn toàn tên dự án hay thông tin cũ.')]
], en)}

${thuatNgu([
  ['QRH (Quick Reference Handbook)', t('Compact, tabbed operational checklist reference used in aviation and engineering so critical steps are executed reliably under pressure without relying on memory.', 'Cuốn sổ tay bảng kiểm tra cứu nhanh dùng trong hàng không và kỹ thuật giúp thực thi chắc chắn các bước sống còn dưới áp lực mà không phụ thuộc trí nhớ.')],
  ['DoR (Definition of Ready)', t('Minimum clarity bar a backlog card must meet before a developer pulls it into active coding (clear AC, approved wireframe/API contract, right size).', 'Ngưỡng rõ ràng tối thiểu mà một thẻ backlog phải đạt trước khi lập trình viên kéo vào code (AC rõ, wireframe/hợp đồng API đã chốt, cỡ vừa phải).')],
  ['Dirty Template Risk', t('Academic or security blunder caused by copying a previously filled deliverable without stripping prior team names, numbers, or credentials.', 'Lỗi học thuật hoặc rò rỉ bảo mật khi sao chép tệp đã điền của dự án cũ mà quên xoá tên nhóm, số liệu hay bí mật cũ.')]
], en)}

${tomTat([
  t('This single page consolidates the course\'s <strong>Lifecycle Map</strong>, <strong>12-Template Document Index</strong>, <strong>5 Role Pocket Checklists</strong>, <strong>Universal DoR/DoD</strong>, and <strong>4-Line Crisis Card</strong>.', 'Trang này nén trọn <strong>Bản đồ Vòng đời</strong>, <strong>Chỉ mục 12 mẫu báo cáo</strong>, <strong>5 Bảng kiểm bỏ túi</strong>, <strong>DoR/DoD tổng quát</strong> và <strong>Thẻ Khủng hoảng 4 dòng</strong> của cả khoá.'),
  t('Always keep a clean blank copy of your toolkit so you never leak old project names, PII, or secrets into a new engagement.', 'Luôn giữ một bản mẫu trống sạch sẽ để không bao giờ rò tên dự án cũ, PII hay bí mật sang dự án mới.'),
  t('Put the entire toolkit to the test right now in the hands-on Lab (12.6) and the 120-minute PE Final Practical Exam (12.7)!', 'Đưa toàn bộ bộ công cụ vào thử lửa ngay bây giờ ở bài Lab thực hành (12.6) và Đề thi thực hành cuối khoá 120 phút (12.7)!')
], en)}

<p>${t('Cross-references: ', 'Đọc thêm: ')}${dm('dm5-0-1-bat-dau-1', '0.1 — Bắt đầu tại đây')} · ${dm('dm5-1-6-raci-lich-tuan', '1.6 — RACI & lịch tuần')} · ${dm('dm5-10-4-release-deploy', '10.4 — Release & Software Package')} · ${dm('dm5-11-1-report7-rtm', '11.1 — Report 7 & RTM cuối')} · ${cs('huong-dan-ct-work', 'ctw-07-docs-so-do-hop', 'CT Work — Docs, Sơ đồ & Họp')}. ${t('Next: ', 'Bài tiếp: ')}${dm('dm5-12-lab', t('12.6 — Lab: Topic Pivot Sprint (E-Commerce on CT Work) + Portfolio Evidence Pack', '12.6 — Lab: Khởi động nhanh đề tài Sàn TMĐT trên CT Work & Hồ sơ năng lực'))}.</p>
`);
};

export default {
  title: '12.5 — The Take-Home Toolkit: Every Template, Checklist & Gate of the Course on One Page|||12.5 — Bộ công cụ mang theo: mọi mẫu và checklist của khoá trong một trang',
  slug: 'dm5-12-5-bo-cong-cu-mang-theo',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cẩm nang tra cứu nhanh một trang tổng hợp toàn khoá: sơ đồ vòng đời 0–12, chỉ mục 12 mẫu báo cáo FPT + tạo tác Agile, 5 bảng kiểm bỏ túi C1–C5, thẻ DoR/DoD và báo khủng hoảng 4 dòng, cảnh báo mẫu bẩn và lộ trình học tiếp.',
  content: L125(true) + L125(false),
};
