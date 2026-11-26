/**
 * 6.3 — CI tối thiểu (build + test + lint) và Definition of Done tự động (dm5-6-3-ci-toi-thieu-dod).
 * Chương 6 — Nền kỹ thuật & quy trình code (mũ Dev, PM giám sát).
 * Nguồn đã kiểm: CrowdStrike Falcon Sensor outage (July 19, 2024 — CrowdStrike Preliminary Post-Incident Review & RCA, Aug 2024);
 * Martin Fowler — Continuous Integration (2006);
 * OWASP / GitHub Actions security hardening (pinning actions, least-privilege permissions).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, out, ac, cs, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L63 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 6 · Lesson 6.3', 'Chương 6 · Bài 6.3', `
<h2>${t('6.3 — Minimal CI (build + test + lint) and automated Definition of Done', '6.3 — CI tối thiểu (build + test + lint) và Definition of Done tự động')}</h2>
<p class="lead">${t(
    'A Definition of Done written only in a Word document is a wish list — the moment you are tired at 11 PM, your brain whispers "I will run tests tomorrow" and merges broken code into <code>main</code>. <strong>Continuous Integration (CI)</strong> turns your Definition of Done from willpower into an impartial robot teammate sitting on GitHub that compiles, lints, checks architecture rules, and runs real tests on a clean Linux server on EVERY pull request — blocking merges automatically when anything turns red. This lesson shows you how to design a lean, fast, honest <strong>Minimal CI</strong> and wire it into your CT Work DoD.',
    'Một bản Definition of Done chỉ nằm trên tệp Word chỉ là lời ước — hễ tới 11 giờ đêm mệt nhoài, não bạn sẽ thì thầm "để mai chạy test cũng được" rồi merge code hỏng lên <code>main</code>. <strong>Tích hợp liên tục (Continuous Integration — CI)</strong> biến Definition of Done từ ý chí mong manh thành một người đồng đội máy công tâm ngồi trên GitHub: biên dịch, soát lint, kiểm luật kiến trúc và chạy test thật trên máy chủ Linux sạch ở MỌI pull request — tự động chặn nút Merge ngay khi có dấu đỏ. Bài này dạy bạn thiết kế một pipeline <strong>CI tối thiểu</strong> gọn, nhanh, trung thực và nối khớp nó với DoD trên CT Work.')}</p>

<h3>${t('Everyday picture: the automated airport luggage gate vs trusting passengers to weigh their own bags', 'Liên tưởng đời thường: khung đo kích thước hành lý ở sân bay so với tin hành khách tự ước lượng')}</h3>
<p>${t(
    'Imagine an airline relying on a polite poster saying "Please make sure your carry-on bag fits under the seat." Half the passengers would eyeball their suitcase and swear it fits — until boarding jams to a halt. That is why every gate has a rigid metal sizing frame and digital scale: it takes three seconds, has zero feelings, and stops oversize bags BEFORE they board the plane. <strong>Minimal CI is that metal sizing frame in front of <code>main</code>.</strong> It never gets sleepy, never rushes before a deadline, and never says "it works on my laptop."',
    'Hãy tưởng tượng một hãng hàng không chỉ dán tờ áp phích lịch sự: "Xin quý khách tự kiểm hành lý xách tay sao cho vừa gầm ghế." Một nửa hành khách sẽ nhìn bằng mắt rồi cam đoan là vừa — cho tới khi cả chuyến bay tắc cứng trên khoang. Đó là lý do mọi cửa lên máy bay đều đặt khung sắt đo cỡ và cân điện tử: mất ba giây, không có cảm tính, và chặn vali quá khổ TRƯỚC KHI lên máy bay. <strong>CI tối thiểu chính là chiếc khung sắt đó đặt ngay trước cửa nhánh <code>main</code>.</strong> Nó không bao giờ buồn ngủ, không vội trước hạn nộp, và không bao giờ nói câu "chạy trên máy em bình thường mà."')}</p>

<h3>${t('1. Why "automated gates that actually check real invariants" save projects', '1. Vì sao cổng kiểm tự động (và kiểm ĐÚNG thứ quan trọng) cứu cả dự án')}</h3>
<p>${t('Martin Fowler defined Continuous Integration (2006) around one habit: every developer integrates work into the mainline frequently, and <em>each integration is verified by an automated build (including test) to detect integration errors as quickly as possible.</em> Yet CI only protects you if its checks actually validate real invariants — not dummy green checkmarks:', 'Martin Fowler định nghĩa Continuous Integration (2006) xoay quanh một thói quen: mỗi lập trình viên tích hợp mã vào nhánh chính thường xuyên, và <em>mỗi lần tích hợp đều được xác minh bằng bản build + test tự động để phát hiện lỗi tích hợp sớm nhất có thể.</em> Tuy nhiên CI chỉ bảo vệ được bạn khi các bước kiểm thật sự soi đúng bất biến cốt lõi — chứ không phải dấu tích xanh giả:')}</p>

${cl('danger', `<strong>🚨 ${t('Real-world incident: CrowdStrike Falcon Outage (July 19, 2024 — CrowdStrike Root Cause Analysis, August 2024)', 'Sự cố thật có nguồn: Sập hệ thống toàn cầu CrowdStrike Falcon (19/07/2024 — Báo cáo RCA chính thức của CrowdStrike, tháng 8/2024)')}</strong><br>${t('A routine configuration update (Channel File 291) crashed approximately <strong>8.5 million Windows computers</strong> across airlines, hospitals, and banks worldwide. CrowdStrike\'s post-incident review revealed a chilling CI/validation lesson: their automated Content Validator DID run and passed — because a bug in the validator itself failed to check the 21st input field against the runtime parser expecting only 20! <strong>Lesson for your project:</strong> (1) never ship a "green-by-default" CI with zero assertions, and (2) deliberately test that your CI turns <strong>RED</strong> when you introduce a real bug (smoke-testing your own gate!).', 'Một bản cập nhật cấu hình thường lệ (Channel File 291) đã làm màn hình xanh khoảng <strong>8,5 triệu máy tính Windows</strong> tại các hãng bay, bệnh viện và ngân hàng toàn cầu. Báo cáo điều tra gốc rễ (RCA) của CrowdStrike chỉ ra bài học xương máu về kiểm thử tự động: bộ kiểm tra tự động Content Validator CÓ chạy và báo XANH — nhưng chính bộ kiểm đó bị lỗi bỏ sót trường dữ liệu thứ 21 trong khi trình phân tích thực tế chỉ nhận 20 trường! <strong>Bài học cho đồ án của bạn:</strong> (1) đừng bao giờ dựng một CI "xanh cho đẹp" mà chẳng assert gì thật, và (2) phải CỐ TÌNH thử gài một lỗi thật để chứng minh CI chịu báo <strong>ĐỎ</strong> và khoá được nút Merge!')}`)}

<h3>${t('2. Splitting Definition of Done: Automated (CI Robot) vs Human (C5/C1 Hats)', '2. Tách đôi Definition of Done: Việc máy CI tự gác vs Việc người (mũ C5/C1) soát')}</h3>
<p>${t('Trying to verify everything manually causes burnout; trying to automate everything in Week 1 causes DevOps paralysis. Divide your project\'s ', 'Cố tự soát mọi thứ bằng tay sẽ kiệt sức; cố tự động hoá mọi thứ ngay Tuần 1 sẽ sa lầy DevOps. Hãy tách đôi bản ')}${lf('Definition of Done')}${t(' cleanly into <strong>two enforcement layers</strong> — reusable on every software project:', ' thành <strong>hai tầng cưỡng chế rõ ràng</strong> — áp được cho mọi dự án phần mềm:')}</p>

${bang(
  [t('DoD Criterion (General)', 'Tiêu chí DoD (Tổng quát)'), t('Who Enforces It?', 'Ai gác cổng?'), t('Exact Mechanism (LabFlow Example)', 'Cơ chế cụ thể (Ví dụ LabFlow)'), t('Runs When?', 'Chạy lúc nào?')],
  [
    [t('<strong>Code compiles cleanly on fresh Linux</strong>', '<strong>Biên dịch sạch trên máy Linux trắng</strong>'), t('🤖 CI Robot', '🤖 Máy CI'), t('<code>./mvnw -B test-compile</code> + <code>npm ci &amp;&amp; npm run build</code>', '<code>./mvnw -B test-compile</code> + <code>npm ci &amp;&amp; npm run build</code>'), t('Every PR &amp; push to main', 'Mọi PR &amp; push lên main')],
    [t('<strong>Type safety, lint &amp; formatting</strong>', '<strong>An toàn kiểu, lint &amp; định dạng</strong>'), t('🤖 CI Robot', '🤖 Máy CI'), t('<code>npm run lint</code> + <code>npx tsc --noEmit</code> (FE); Checkstyle/Spotless (BE optional)', '<code>npm run lint</code> + <code>npx tsc --noEmit</code> (FE); Checkstyle/Spotless (BE tuỳ chọn)'), t('Every PR &amp; push to main', 'Mọi PR &amp; push lên main')],
    [t('<strong>Unit + real DB integration tests pass</strong>', '<strong>Unit test + Integration test trên DB thật xanh</strong>'), t('🤖 CI Robot', '🤖 Máy CI'), t('<code>./mvnw -B verify</code> (JUnit 5 + Flyway + Testcontainers PostgreSQL)', '<code>./mvnw -B verify</code> (JUnit 5 + Flyway + Testcontainers PostgreSQL)'), t('Every PR &amp; push to main', 'Mọi PR &amp; push lên main')],
    [t('<strong>Commit/branch hygiene &amp; secret scan</strong>', '<strong>Quy chuẩn commit &amp; quét bí mật lộ</strong>'), t('🤖 CI Robot (optional extension)', '🤖 Máy CI (mở rộng tuỳ chọn)'), t('Optional 3rd job: ticket-ID regex check + secret pattern scan (e.g., Gitleaks)', 'Job mở rộng tuỳ chọn: kiểm regex mã thẻ + quét mẫu bí mật lộ (vd Gitleaks)'), t('Optional on PR', 'Tuỳ chọn trên PR')],
    [t('<strong>Modular monolith boundary intact</strong>', '<strong>Ranh giới modular monolith không vỡ</strong>'), t('🤖 CI Robot (from Iteration 2)', '🤖 Máy CI (từ Iteration 2)'), t('ArchUnit test verifying one-way package imports (no <code>catalog → reservation</code>)', 'Bài test ArchUnit kiểm tra import một chiều (cấm <code>catalog → reservation</code>)'), t('Every PR', 'Mọi PR')],
    [t('<strong>Matches SRS/BR &amp; 3+ Unhappy cases</strong>', '<strong>Khớp SRS/BR &amp; đủ ≥ 3 Unhappy case</strong>'), `${mu('C5', en)} + ${mu('C2', en)}`, t('Manual exploratory check + 10-point checklist after cooling-off gap', 'Soát thực nghiệm + checklist 10 điểm sau khoảng nghỉ làm nguội'), t('Before Approve', 'Trước Approve')],
    [t('<strong>Evidence linked &amp; Docs/RTM synced</strong>', '<strong>Đủ Evidence &amp; đồng bộ tài liệu/RTM</strong>'), `${mu('C1', en)}`, t('Check DoD checklist on the CT Work card and add Web link / Attachment / Comment <code>Evidence: ...</code> (PR link + test log/screenshot) before dragging to Done', 'Soát checklist DoD trên thẻ CT Work và thêm Liên kết web / Đính kèm / Bình luận <code>Evidence: ...</code> (link PR + log test/ảnh) trước khi kéo sang Done'), t('Before Done', 'Trước Done')]
  ]
)}

<h3>${t('3. Anatomy of a Minimal CI Pipeline (under 5 minutes, zero bloat)', '3. Giải phẫu một Pipeline CI Tối Thiểu (chạy dưới 5 phút, không rườm rà)')}</h3>
<p>${t('For full GitHub Actions syntax and YAML walkthroughs, see ', 'Để học chi tiết cú pháp GitHub Actions, xem thêm ')}${cs('git', 'git-11-2-actions', 'Git 11.2 — GitHub Actions from zero')}${t(', ', ', ')}${cs('spring-boot', 'sb-17-3-github-actions-spring', 'Spring Boot 17.3 — CI with GitHub Actions')}${t(', and ', ' và ')}${cs('testing', 'tst-9-1-github-actions', 'Testing 9.1 — Tests in GitHub Actions')}${t('. In Chapter 6, keep it crisp with <strong>2 mandatory parallel jobs (<code>backend</code> and <code>frontend</code>)</strong> so feedback stays fast (target ≤ 4–6 minutes total); once comfortable, you can add an optional 3rd job (<code>hygiene-and-secrets</code>) and frontend unit tests:', '. Ở Chương 6, chỉ cần <strong>2 job song song bắt buộc (<code>backend</code> và <code>frontend</code>)</strong> để phản hồi nhanh (mục tiêu tổng ≤ 4–6 phút); khi đã vững, bạn có thể mở rộng thêm job thứ 3 tuỳ chọn (<code>hygiene-and-secrets</code>) và bước unit test frontend:')}</p>

<pre><code>  PR opened / updated or push to main on GitHub
        |
        +---&gt; [Job 1: backend]              (~2-3m) Setup JDK 21 + Maven cache -&gt; ./mvnw -B verify
        |       (REQUIRED in Ch.6)                  (compiles + Flyway + JUnit 5 + Testcontainers)
        |
        +---&gt; [Job 2: frontend]             (~1m)   Setup Node 22 + npm cache -&gt; npm ci
        |       (REQUIRED in Ch.6)                  -&gt; lint -&gt; tsc --noEmit -&gt; npm run build
        |                                           (+ optional npm test once FE unit tests exist)
        |
        +---&gt; [Optional extension: hygiene-and-secrets] (~20s, optional) Commit regex + Gitleaks scan
        v
  [Both Required Status Checks (backend &amp; frontend) GREEN?] -- NO --&gt; Merge button LOCKED!
        |
       YES --&gt; Ready for C5 QA review &amp; C1 Maintainer merge</code></pre>

<p>${t('Illustrative minimal skeleton for <code>.github/workflows/ci.yml</code> (generic structure ≤ 20 lines — write and tune your real file by hand):', 'Khung sườn minh hoạ tối giản cho <code>.github/workflows/ci.yml</code> (cấu trúc tổng quát ≤ 20 dòng — bạn tự gõ tay và tinh chỉnh tệp thật cho dự án mình):')}</p>
${out(`name: CI
on: { pull_request: {}, push: { branches: [main] } }
permissions: { contents: read }   # Least privilege!
jobs:
  backend:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: backend } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '21', cache: maven }
      - run: ./mvnw -B verify
  frontend:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: frontend } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: npm, cache-dependency-path: frontend/package-lock.json }
      - run: npm ci && npm run lint && npx tsc --noEmit && npm run build`)}

${note(t('<strong>Why <code>npm ci</code> instead of <code>npm install</code> in CI?</strong> <code>npm ci</code> installs exact locked versions from <code>package-lock.json</code> and fails immediately if the lockfile is out of sync — preventing mysterious "passed yesterday, broke today" dependency surprises. Similarly, <code>./mvnw -B verify</code> runs Maven in non-interactive batch mode using the pinned wrapper.', '<strong>Vì sao trong CI phải dùng <code>npm ci</code> thay vì <code>npm install</code>?</strong> <code>npm ci</code> cài đúng phiên bản đã khoá trong <code>package-lock.json</code> và báo lỗi ngay nếu lockfile lệch — chặn lỗi "hôm qua xanh, hôm nay tự gãy" do thư viện tự nâng bản. Tương tự, <code>./mvnw -B verify</code> chạy Maven ở chế độ batch không tương tác với đúng phiên bản wrapper đã ghim.'))}

<h3>${t('4. Wiring CI into Branch Protection &amp; CT Work DoD Evidence (C1 + C5)', '4. Nối CI vào Branch Protection và bằng chứng DoD trên CT Work (C1 + C5)')}</h3>
<ol>
<li>${mu('C3', en)} ${mu('C4', en)} ${t('<strong>Add workflow + local parity command:</strong> Commit <code>.github/workflows/ci.yml</code> to <code>main</code> before locking it (then open a test PR so both jobs run at least once on GitHub Actions). Document the exact same commands in <code>README.md</code> so you can run them locally BEFORE pushing.', '<strong>Tạo workflow + lệnh chạy giống hệt dưới máy:</strong> Commit <code>.github/workflows/ci.yml</code> lên <code>main</code> khi chưa khoá (rồi mở một PR thử để cả hai job chạy ít nhất một lần trên GitHub Actions). Ghi đúng các lệnh đó vào <code>README.md</code> để bạn tự chạy dưới máy TRƯỚC KHI push.')}</li>
<li>${mu('C1', en)} ${t('<strong>Mark checks as Required on GitHub:</strong> Open GitHub → Settings → Rulesets/Branch protection for <code>main</code> → add <code>backend</code> and <code>frontend</code> (exact job names — they only appear in GitHub\'s list after running at least once!) under <strong>Require status checks to pass</strong> (see ', '<strong>Đánh dấu các job là Bắt buộc trên GitHub:</strong> Vào GitHub → Settings → Rulesets/Branch protection cho <code>main</code> → thêm đúng tên job <code>backend</code> và <code>frontend</code> (tên job chỉ hiện trong danh sách của GitHub sau khi workflow đã chạy ít nhất một lần!) vào mục <strong>Require status checks to pass</strong> (xem ')}${cs('testing', 'tst-9-3-bat-buoc', 'Testing 9.3 — Required checks')}${t('; remember the GitHub Free private repo note from Lesson 6.2).', '; nhớ lưu ý repo private GitHub Free ở Bài 6.2).')}</li>
<li>${mu('C5', en)} ${t('<strong>Prove the alarm works (Deliberate Red Test):</strong> Open a throwaway test PR containing ONE broken assertion (or TypeScript type error). Confirm GitHub Actions turns <strong>RED</strong> and disables the Merge button. Then fix the bug, push, watch it turn <strong>GREEN</strong>, open your CT Work card, and add a Web link / Attachment / Comment <code>Evidence: &lt;green CI run URL&gt;</code>!', '<strong>Thử chuông báo cháy (Bài test cố tình làm ĐỎ):</strong> Mở một PR thử có cố tình gài MỘT lỗi assert (hoặc lỗi kiểu TypeScript). Xác nhận GitHub Actions báo <strong>ĐỎ</strong> và khoá cứng nút Merge. Sau đó sửa lỗi, push lại, nhìn nó chuyển <strong>XANH</strong>, rồi mở thẻ CT Work → thêm Liên kết web / Đính kèm / Bình luận <code>Evidence: &lt;link lượt chạy CI xanh&gt;</code>!')}</li>
</ol>

<h3>🕵️ ${t('The security &amp; hacker angle: CI supply-chain traps &amp; secret leaks in CI logs', 'Góc bảo mật &amp; hacker: bẫy chuỗi cung ứng trong CI và lộ bí mật qua log CI')}</h3>
<p>${t(
    'CI runners are prime targets for attackers because they hold repository tokens and sometimes deployment secrets. Three non-negotiable CI security rules:',
    'Máy chạy CI là mục tiêu ưa thích của kẻ tấn công vì chúng thường giữ token kho mã và đôi khi cả khoá deploy. Ba luật bảo mật CI không được phép bỏ qua:')}</p>
<ul>
<li>${t('<strong>Least-privilege <code>permissions: { contents: read }</code>:</strong> Never leave default write permissions on a CI job that only builds and tests.', '<strong>Quyền tối thiểu <code>permissions: { contents: read }</code>:</strong> Không bao giờ để mặc định quyền ghi trên một job CI chỉ làm nhiệm vụ build và test.')}</li>
<li>${t('<strong>NEVER echo secrets or use <code>pull_request_target</code> blindly:</strong> Printing <code>env</code> in a debug step exposes tokens in public/team logs; and on open/public repos, untrusted PRs can steal secrets if a workflow misuses <code>pull_request_target</code>.', '<strong>KHÔNG BAO GIỜ in biến bí mật ra log hoặc dùng bừa <code>pull_request_target</code>:</strong> Lệnh <code>env</code> trong bước debug làm phơi token trong log; và trên kho công khai, PR lạ có thể đánh cắp bí mật nếu workflow cấu hình sai <code>pull_request_target</code>.')}</li>
<li>${t('<strong>Keep test credentials fake and ephemeral:</strong> CI tests should run against disposable Testcontainers PostgreSQL with throwaway credentials — never point CI at a staging or production database.', '<strong>Dùng tài khoản giả dùng-một-lần cho test:</strong> Test trong CI chỉ chạy với PostgreSQL Testcontainers tạo mới rồi vứt bỏ — tuyệt đối không trỏ CI vào CSDL staging hay production.')}</li>
</ul>

<h3>${t('5. Four CI anti-patterns that waste time or give false comfort', '5. Bốn kiểu làm CI sai vừa tốn thời gian vừa tạo cảm giác an toàn giả')}</h3>
<ul>
<li>${t('<strong>Commenting out failing tests to "make CI green":</strong> Turning off the smoke detector because the toast is burning. Fix the bug or fix the outdated test honestly.', '<strong>Comment tạm bài test đang đỏ để "cho CI xanh":</strong> Khác gì tháo pin chuông báo cháy vì bánh mì đang khét. Luôn sửa lỗi thật hoặc cập nhật test đúng đặc tả.')}</li>
<li>${t('<strong>Testing against H2 in-memory DB instead of real PostgreSQL:</strong> H2 does NOT support PostgreSQL <code>tstzrange</code> or <code>EXCLUDE USING gist</code> — your CI turns green while double-booking happens in production! Use Testcontainers (see ', '<strong>Chạy test trên H2 trong RAM thay vì PostgreSQL thật:</strong> H2 KHÔNG hỗ trợ <code>tstzrange</code> hay <code>EXCLUDE USING gist</code> của PostgreSQL — CI xanh rực nhưng lên thật vẫn đặt trùng lịch! Hãy dùng Testcontainers (xem ')}${cs('spring-boot', 'sb-11-4-testcontainers', 'Spring Boot 11.4 — Testcontainers')}).</li>
<li>${t('<strong>No dependency caching (15-minute slow CI):</strong> Downloading the entire Maven/npm internet on every push makes you hate CI and skip small PRs. Enable Maven + npm cache in the setup actions.', '<strong>Quên bật cache thư viện (CI chạy chậm 15 phút):</strong> Mỗi lần push lại tải lại cả kho Maven/npm khiến bạn chán CI và lười tách PR nhỏ. Luôn bật cache Maven + npm ngay trong bước setup.')}</li>
<li>${t('<strong>Ignoring flaky tests:</strong> A test that fails randomly 1 in 5 runs teaches you to click "Re-run jobs" blindly until a real bug slips through. Quarantine and fix flaky tests immediately (see ', '<strong>Mặc kệ test chập chờn (flaky test):</strong> Một bài test cứ 5 lần lại đỏ ngẫu nhiên 1 lần sẽ tập cho bạn thói quen bấm "Re-run" theo phản xạ cho tới khi lọt lỗi thật. Bắt và sửa test chập chờn ngay lập tức (xem ')}${cs('testing', 'tst-8-3-flaky', 'Testing 8.3 — Flaky tests')}).</li>
</ul>

${phongVan([
  [t('"How did you ensure your Definition of Done was actually followed instead of being ignored near deadlines?"', '"Làm sao bạn bảo đảm Definition of Done thật sự được tuân thủ chứ không bị bỏ qua lúc sát hạn nộp?"'), t('We split DoD into two layers: automated gates in GitHub Actions (2 required parallel jobs — backend compile/Flyway/JUnit 5/Testcontainers PostgreSQL and frontend ESLint/TypeScript strict/build — plus optional secret scanning) enforced by server-side Branch Protection with admin bypass disabled, plus human gates on CT Work (cooling-off review + checking our DoD checklist and adding Web link/Attachment/Comment "Evidence: ..." on the card before moving to Done). We even tested the gate with a deliberate failing PR to prove it blocks merges.', 'Em tách DoD làm hai tầng: tầng tự động trên GitHub Actions (2 job song song bắt buộc — backend biên dịch/Flyway/JUnit 5/Testcontainers PostgreSQL và frontend ESLint/TypeScript strict/build — cộng job quét bí mật mở rộng tuỳ chọn) được khoá cứng bằng Branch Protection phía server tắt quyền admin vượt luật, cộng với tầng con người trên CT Work (review sau khoảng nghỉ + soát checklist DoD và thêm Liên kết web/Đính kèm/Bình luận "Evidence: ..." lên thẻ trước khi kéo sang Done). Em còn thử gài một PR lỗi thật để chứng minh cổng chặn hoạt động.')]
], en)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('Use the exact same 2-job CI template (+ optional secret-scan extension), swapping the core integration suite in <code>backend</code> to verify concurrent stock deduction (50 parallel checkout requests on 10 items in stock → exactly 10 succeed, 40 return <code>409 OUT_OF_STOCK</code>) and idempotent payment webhook handling on real PostgreSQL.', 'Dùng nguyên mẫu CI 2 job đó (+ job quét bí mật mở rộng tuỳ chọn), chỉ thay bộ test tích hợp lõi ở <code>backend</code> thành kiểm tra trừ tồn kho đồng thời (50 yêu cầu thanh toán song song cho 10 sản phẩm → đúng 10 đơn thành công, 40 đơn trả <code>409 OUT_OF_STOCK</code>) và xử lý webhook thanh toán idempotent trên PostgreSQL thật.')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('CI becomes the team\'s neutral referee: nobody argues "it runs on my laptop" because GitHub Actions is the single source of truth. Add a JaCoCo coverage summary + JUnit XML report upload as CI artifacts so QA can pull real test numbers directly into Report 5.1/5.2 and Release Notes.', 'CI trở thành trọng tài công tâm cho cả 5 bạn: chấm dứt tranh cãi "máy tớ vẫn chạy" vì GitHub Actions là chuẩn duy nhất. Bật thêm bước xuất báo cáo độ phủ JaCoCo và JUnit XML làm artifact của CI để QA lấy thẳng số liệu thật điền vào Report 5.1/5.2 và Release Notes.')],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('Minimal CI expands into full CI/CD Quality Gates: SonarQube static analysis (blocking PRs with new Critical code smells or coverage &lt; 80% on new code), SAST/dependency vulnerability scanners (Snyk/Trivy/Dependabot), Docker image build + SBOM signing, and automated deployment to Dev/Staging environments after merge.', 'CI tối thiểu mở rộng thành Cổng Chất Lượng CI/CD đầy đủ: phân tích tĩnh SonarQube (chặn PR có lỗi nghiêm trọng mới hoặc độ phủ mã mới &lt; 80%), máy quét lỗ hổng thư viện/SAST (Snyk/Trivy/Dependabot), dựng ảnh Docker + ký SBOM và tự động triển khai lên môi trường Dev/Staging sau khi merge.')]
], en)}

${viecLabflow([
  [t('Under hats C3 + C4 + C1, hand-write <code>.github/workflows/ci.yml</code> for LabFlow (backend <code>./mvnw -B verify</code> + frontend <code>npm ci &amp;&amp; lint &amp;&amp; tsc --noEmit &amp;&amp; build</code> with caching and <code>permissions: contents: read</code>), wire both jobs as Required Checks in GitHub Branch Protection, and run the <strong>Deliberate Red Test</strong> under hat C5.', 'Dưới mũ C3 + C4 + C1, tự gõ tay <code>.github/workflows/ci.yml</code> cho LabFlow (backend <code>./mvnw -B verify</code> + frontend <code>npm ci &amp;&amp; lint &amp;&amp; tsc --noEmit &amp;&amp; build</code> có cache và <code>permissions: contents: read</code>), gắn cả hai job thành Required Checks trong Branch Protection trên GitHub, và chạy <strong>Bài test cố tình làm ĐỎ</strong> dưới mũ C5.'), t('One screenshot/link proves a deliberate broken PR was blocked RED by GitHub, and the fixed commit turned GREEN and unlocked merge — recorded by opening your Foundation card in CT Work <strong>LF #2</strong> and adding a Web link / Attachment / Comment <code>Evidence: ...</code>.', 'Có ảnh/link chứng minh một PR gài lỗi bị GitHub báo ĐỎ và khoá nút Merge, sau khi sửa chuyển XANH và mở khoá merge — lưu lại bằng cách mở thẻ Foundation trong CT Work <strong>LF #2</strong> và thêm Liên kết web / Đính kèm / Bình luận <code>Evidence: ...</code>.')]
], en)}

${thuatNgu([
  ['Continuous Integration (CI — Tích hợp liên tục)', t('Practice of automatically building, linting, and testing every code change in a clean shared environment on every PR/commit.', 'Thực hành tự động biên dịch, soát lint và chạy test cho mọi thay đổi mã trên môi trường sạch dùng chung ở mỗi PR/commit.')],
  ['Required Status Check', t('A GitHub rule blocking PR merges unless named CI jobs finish with a passing (green) status.', 'Luật trên GitHub chặn nút merge PR trừ khi các job CI được chỉ định chạy đạt (xanh).')],
  ['Automated Quality Gate', t('Objective, machine-enforced pass/fail criteria (tests, type checks, lint, security scan) replacing subjective human promises.', 'Tiêu chí đạt/không đạt do máy tự động cưỡng chế (test, kiểm kiểu, lint, quét bảo mật) thay cho lời hứa cảm tính.')],
  ['Flaky Test (Test chập chờn)', t('A test that passes and fails unpredictably on the exact same code (often due to timing, timezone, or shared state).', 'Bài test lúc xanh lúc đỏ thất thường trên cùng một đoạn mã (thường do chờ thời gian, múi giờ hoặc dùng chung trạng thái).')],
  ['Least Privilege in CI', t('Granting a CI workflow only the minimum token permissions needed (e.g., <code>contents: read</code>) to limit blast radius.', 'Chỉ cấp cho workflow CI quyền token tối thiểu cần thiết (vd <code>contents: read</code>) để thu hẹp thiệt hại nếu bị xâm nhập.')]
], en)}

${tomTat([
  t('Split Definition of Done into machine-enforced CI checks (build, lint, typecheck, real DB tests, secret scan) and human-enforced CT Work checks (SRS/BR match, unhappy cases, Evidence).', 'Tách Definition of Done thành chốt máy CI tự gác (build, lint, kiểm kiểu, test DB thật, quét bí mật) và chốt người trên CT Work (khớp SRS/BR, unhappy case, Evidence).'),
  t('Keep Minimal CI fast (&lt; 5 min) with parallel jobs and Maven/npm caching, using <code>npm ci</code> and <code>./mvnw -B verify</code> for reproducibility.', 'Giữ CI tối thiểu chạy nhanh (&lt; 5 phút) bằng chạy song song và bật cache Maven/npm, dùng <code>npm ci</code> và <code>./mvnw -B verify</code> để tái lập chính xác.'),
  t('Remember CrowdStrike (2024): a green check that asserts nothing is dangerous — always prove your CI blocks merges with a Deliberate Red Test.', 'Nhớ bài học CrowdStrike (2024): dấu xanh không kiểm gì thật rất nguy hiểm — luôn chứng minh CI khoá được nút Merge bằng Bài test cố tình làm ĐỎ.'),
  t('Never fake integration tests with H2 when production uses PostgreSQL features like <code>tstzrange</code> exclusion constraints — use Testcontainers.', 'Đừng đánh lừa mình bằng H2 khi hệ thật dùng tính năng PostgreSQL như exclusion constraint trên <code>tstzrange</code> — hãy dùng Testcontainers.')
], en)}
<p>${t('Cross-references: ', 'Đọc thêm: ')}${cs('agile-teamwork', 'agl-3-3-ci', 'Agile Teamwork 3.3 — CI as a teammate')} · ${cs('git', 'git-11-2-actions', 'Git 11.2 — GitHub Actions')} · ${cs('spring-boot', 'sb-17-3-github-actions-spring', 'Spring Boot 17.3')} · ${cs('testing', 'tst-9-3-bat-buoc', 'Testing 9.3 — Required checks')}. ${t('Next: ', 'Bài tiếp: ')}${dm('dm5-6-4-docker-compose-seed-env', t('6.4 — Dev Environment with Docker Compose, Seed Data &amp; Env Config', '6.4 — Môi trường dev bằng Docker Compose, dữ liệu mẫu &amp; cấu hình theo môi trường'))}.</p>
`);
};

export default {
  title: '6.3 — Minimal CI (build + test + lint) and automated Definition of Done|||6.3 — CI tối thiểu (build + test + lint) và Definition of Done tự động',
  slug: 'dm5-6-3-ci-toi-thieu-dod',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Biến Definition of Done từ ý chí thành cổng chặn tự động trên GitHub Actions: bài học CrowdStrike (2024), tách đôi DoD máy CI vs người soát, kiến trúc CI 2 job song song bắt buộc (+ mở rộng tuỳ chọn) gọn nhanh (< 5 phút), bảo mật CI tối thiểu, Bài test cố tình làm ĐỎ và áp sang sàn TMĐT, SEP490 và doanh nghiệp.',
  content: L63(true) + L63(false),
};
